import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import * as agentApi from "@deepseek-ai/dsh-agent";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";
import { SettingsConflictError } from "@deepseek-ai/dsh-settings";
import z from "schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
//#region src/settings-shared.ts
/** Fallback prefs used whenever the settings document is unreachable or malformed. */
const SUBCHAT_PREFS_DEFAULTS = {
	lookupDefault: true,
	sendImmediately: false,
	defaultPrompt: "",
	bringMode: "draft",
	panelHome: "sidebar-right"
};
//#endregion
//#region src/trust-fence.ts
/** The listener protocol assumed when a runtime exposes none (pre-0.2.1 DSH). */
const DEFAULT_TRUST_PROTOCOL = "http:";
function header(headers, name) {
	const value = headers[name];
	return typeof value === "string" ? value : void 0;
}
function parseAuthority(authority, scheme = DEFAULT_TRUST_PROTOCOL) {
	try {
		return new URL(`${scheme}//${authority}`);
	} catch {
		return;
	}
}
/** Whether a normalized URL hostname names the local loopback authority. */
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	const parts = hostname.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/**
* Text of an entry's authority as it compares against a request authority.
* A port the entry names explicitly is kept; a port the entry omits resolves
* through the opposite scheme's default, so `host:80` reads as an exact
* authority while a bare `host` stays port-less and matches any port.
*/
function canonicalAuthority(entry, entryUrl) {
	const opposite = entryUrl.protocol === "http:" ? "https:" : "http:";
	const port = entryUrl.port !== "" ? entryUrl.port : parseAuthority(entry, opposite)?.port ?? "";
	return port === "" ? entryUrl.hostname : `${entryUrl.hostname}:${port}`;
}
function isTrustedAuthority(hostUrl, trustedHosts, protocol) {
	return trustedHosts.some((entry) => {
		const entryUrl = parseAuthority(entry, protocol);
		if (entryUrl === void 0) return false;
		return canonicalAuthority(entry, entryUrl) === entryUrl.hostname ? entryUrl.hostname === hostUrl.hostname : entryUrl.host === hostUrl.host;
	});
}
/**
* Whether a parsed authority names the deployment's own bind address. A browser
* dialing that literal sends it as Host, and accepting it grants nothing
* further: the literal is no rebinding target, the Origin and cross-site checks
* still apply, and it stays outside `trustedHosts`. Matching ignores the port,
* like a port-less entry, and any `%zone` id (an interface selector, not
* address text).
*/
function isBindAddressAuthority(hostUrl, bindHost) {
	if (bindHost === void 0) return false;
	const zoneAt = bindHost.indexOf("%");
	const address = zoneAt === -1 ? bindHost : bindHost.slice(0, zoneAt);
	const bindUrl = parseAuthority(address.includes(":") ? `[${address}]` : address);
	return bindUrl !== void 0 && bindUrl.hostname === hostUrl.hostname;
}
/**
* Compare Host under the Origin's HTTP(S) scheme so default ports normalize
* consistently. The transport may remain HTTP behind an HTTPS proxy.
*/
function isSameAuthorityOrigin(origin, host) {
	let originUrl;
	try {
		originUrl = new URL(origin);
	} catch {
		return false;
	}
	const scheme = originUrl.protocol === "https:" ? "https:" : originUrl.protocol === "http:" ? "http:" : void 0;
	if (scheme === void 0) return false;
	const hostUrl = parseAuthority(host, scheme);
	return hostUrl !== void 0 && originUrl.host === hostUrl.host;
}
/**
* Decide whether one sidechat request may reach the plugin routes.
* @param request - node HTTP request facts (headers).
* @param trustedHosts - non-loopback authorities this deployment serves: exact `host:port`, or port-less `host` matching any port.
* @param bindHost - the listener's own bind IP literal, accepted on any port independently of `trustedHosts`.
* @param protocol - listener protocol for default Host ports; HTTP when the runtime exposes none.
* @returns true when the Host is ours (loopback, the bind address, or trusted) and browser markers are same-origin.
*/
function isTrustedApiRequest(request, trustedHosts, bindHost, protocol = DEFAULT_TRUST_PROTOCOL) {
	const host = header(request.headers, "host");
	if (host === void 0) return false;
	const hostUrl = parseAuthority(host, protocol);
	if (hostUrl === void 0) return false;
	if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts, protocol) && !isBindAddressAuthority(hostUrl, bindHost)) return false;
	if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = header(request.headers, "origin");
	if (origin === void 0) return true;
	return isSameAuthorityOrigin(origin, host);
}
//#endregion
//#region src/wire.ts
/** One API failure with its wire code and HTTP status. */
var SidechatError = class extends Error {
	code;
	status;
	constructor(code, message, status = 400) {
		super(message);
		this.code = code;
		this.status = status;
	}
};
/** Body size bound of one JSON request. */
const MAX_BODY_BYTES = 1 << 20;
/** Read and parse the JSON request body (bounded; malformed → bad-request). */
async function readJsonBody(req) {
	const chunks = [];
	let total = 0;
	for await (const chunk of req) {
		const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
		total += buffer.length;
		if (total > MAX_BODY_BYTES) throw new SidechatError("bad-request", "request body too large");
		chunks.push(buffer);
	}
	const text = Buffer.concat(chunks).toString("utf8");
	if (text.trim() === "") return {};
	try {
		return JSON.parse(text);
	} catch {
		throw new SidechatError("bad-request", "request body is not valid JSON");
	}
}
/** Write a JSON response with the given status. */
function writeJson(res, status, body) {
	const payload = JSON.stringify(body);
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(payload);
}
/** Write the success envelope. */
function writeOk(res, value) {
	writeJson(res, 200, {
		ok: true,
		value
	});
}
/** Write the failure envelope for any thrown value (unknown → internal 500). */
function writeError(res, error) {
	if (error instanceof SidechatError) {
		writeJson(res, error.status, {
			ok: false,
			error: {
				code: error.code,
				message: error.message
			}
		});
		return;
	}
	writeJson(res, 500, {
		ok: false,
		error: {
			code: "internal",
			message: error instanceof Error ? error.message : String(error)
		}
	});
}
/** Narrow an unknown payload value to a string, else throw bad-request. */
function requireString(payload, key) {
	const value = payload?.[key];
	if (typeof value !== "string" || value === "") throw new SidechatError("bad-request", `missing or invalid "${key}"`);
	return value;
}
/** Narrow an unknown payload value to a boolean (default false). */
function optionalBoolean(payload, key) {
	return payload?.[key] === true;
}
//#endregion
//#region src/index.ts
/**
* dsh-side-chat host half: the /sidechat JSON API. Every side chat is an
* ORDINARY session (no `origin: 'subagent'`) whose `meta.parentSession` points
* at the conversation that launched it, kept archived so it appears in neither
* the main session list nor the subagent catalog, and driven directly through
* the live agent (followup). Model / reasoning-effort / permission are
* inherited from the launching conversation at creation and adjustable later.
*
* DSH 0.1.7 admits archived sessions to no model step: its archived-session
* gate answers `{ kind: 'reject' }` on `agent/pre-step` for a session in the
* registry archive set, so a turn ends `blocked` before the first request. The
* archive is therefore lifted (unarchived) for exactly as long as a side chat
* has work queued and restored as soon as its agent settles — see
* `deliver`/`settleTurn` below.
*
* All routes pass the same browser-trust fence as the /api gateway (loopback
* or trusted authority; cross-site markers refuse).
*/
/** Plugin identity for cordis.yml rows. */
const name = "dsh-side-chat-pro";
/** Services required before mounting. */
const inject = [
	"webServer",
	"sessions",
	"agents",
	"workspaceRegistry",
	"sessionQuery",
	"permissionPresets",
	"agentPresets",
	"llm",
	"attachments",
	"commands",
	"tools"
];
/**
* Read one export of the agent package without tripping the ESM namespace.
* A missing export is undefined here (older DSH lines), and a test double that
* models a partial namespace throws on the unknown key instead.
*/
function readAgentExport(name) {
	try {
		return agentApi[name];
	} catch {
		return;
	}
}
/**
* Apply a side chat's model / reasoning-effort choice. Two runtime shapes exist:
*
* - DSH 0.2.1 and earlier: `installModelSelection(agentCtx, selection)` couples a
*   MUTABLE ref to `system-prompt/assemble`, `agent/request`, and the model-switch
*   notice, so a mid-conversation switch lands on a later step.
* - DSH 0.2.2-alpha.3+: the choice became durable (`agent.model.select()` appends a
*   `model/selection` event the step preparation fixes before assembly), the same
*   installer now adds only the notice and takes no selection, and the agent loop
*   throws when an `agent/request` listener proposes a route different from the
*   step's fixed selection. `AgentModel` is the new-API marker: the 0.2.1 line
*   exports no such symbol.
*
* Read through the namespace object rather than a named import: a named import
* fails the ESM link on any build that drops the export, while this degrades to
* the request-only waterfall in `start`.
*/
const installModelSelection = readAgentExport("installModelSelection");
/** Whether this runtime records model choices durably on the agent (0.2.2+). */
const durableModelSelection = typeof readAgentExport("AgentModel") === "function";
/**
* Record one selection for the agent's NEXT step on a 0.2.2+ runtime. The
* durable append is what prompt assembly and routing read afterwards, so a
* switch made between turns (or mid-turn, before the next step prepares)
* applies without touching request config. A no-op on the coupled 0.2.1 line,
* which reads the mutable ref instead.
*/
const recordSelection = (agent, selection) => {
	if (!durableModelSelection || selection === void 0) return;
	try {
		agent.model?.select(selection);
	} catch (error) {
		console.warn("[dsh-side-chat] model selection record failed:", error instanceof Error ? error.message : String(error));
	}
};
/** Durable record list file (cleanup is a later feature; the list is the record). */
const RECORD_FILE = "dsh-side-chat-sessions.json";
/** The record-list file path under the harness home. */
function recordFilePath() {
	return dshHomePath(RECORD_FILE);
}
/** Read the durable side-chat record list (absent/malformed → empty). */
async function readRecords() {
	try {
		const raw = await readFile(recordFilePath(), "utf8");
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((entry) => {
			const record = entry;
			return typeof record?.childId === "string" && typeof record?.parentSessionId === "string";
		}).map((entry) => ({
			childId: entry.childId,
			parentSessionId: entry.parentSessionId,
			createdAt: typeof entry.createdAt === "number" ? entry.createdAt : 0
		}));
	} catch {
		return [];
	}
}
/** Persist the live side-chat record list (the "record" a future cleanup consumes). */
async function writeRecords(records) {
	const path = recordFilePath();
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, JSON.stringify(records, null, 2), "utf8");
}
/** The lookup guidance appended as an extra text block (hidden from the UI). */
const GUIDANCE_MARKER = "[sidechat-guidance]";
const LOOKUP_GUIDANCE = `${GUIDANCE_MARKER}[需要时，请优先查阅发起此问题的父会话记录，从父会话的对话内容和工具结果中找答案；只有父会话信息不足时，才读取工作区文件补充；若已尽力仍不足，请说明限制。]`;
const NO_LOOKUP_GUIDANCE = `${GUIDANCE_MARKER}[请仅基于上述内容直接回答，不要主动查阅工作区文件或父会话记录。]`;
/** Legacy (pre-marker) guidance prefixes, filtered so older messages hide too. */
const LEGACY_GUIDANCE_PREFIXES = ["[需要时，请读取工作区文件", "[请仅基于上述内容"];
/** Decode one base64 string into bytes (host-side; Node Buffer). */
function decodeBase64(data) {
	return new Uint8Array(Buffer.from(data, "base64"));
}
/** A user-role message value `agent.followup` accepts (identity + content + source). */
function userMessage(content) {
	return {
		id: randomUUID(),
		role: "user",
		content,
		source: { kind: "user" }
	};
}
/** Fold a raw session event log into a minimal user/assistant transcript with image refs. */
function foldTranscript(events) {
	const fold = (content) => {
		if (!Array.isArray(content)) return [];
		const blocks = [];
		for (const raw of content) {
			const b = raw;
			if (b?.type === "text" && typeof b.text === "string") {
				const text = b.text;
				if (!(text.startsWith(GUIDANCE_MARKER) || LEGACY_GUIDANCE_PREFIXES.some((prefix) => text.startsWith(prefix)))) blocks.push({
					type: "text",
					text
				});
			} else if (b?.type === "image" && b.attachment !== null && typeof b.attachment === "object") blocks.push({
				type: "image",
				ref: b.attachment
			});
			else if (b?.type === "reasoning" && typeof b.text === "string") blocks.push({
				type: "reasoning",
				text: b.text
			});
		}
		return blocks;
	};
	const messages = [];
	for (const event of events) if (event.type === "user/message") {
		const source = event.data.source;
		if (source !== void 0 && source.kind !== "user") continue;
		const blocks = fold(event.data.content);
		if (blocks.length > 0) messages.push({
			role: "user",
			blocks
		});
	} else if (event.type === "assistant/message") {
		const message = event.data.message;
		const blocks = fold(message?.content);
		if (blocks.length > 0) messages.push({
			role: "assistant",
			blocks
		});
	}
	return messages;
}
/** How many recent parent turns a new side chat receives, and the character budget for them. */
const PARENT_EXCERPT_ROUNDS = 5;
const PARENT_EXCERPT_BUDGET = 10000;
/** Render transcript messages as plain text with speaker prefixes. */
function renderTranscript(messages) {
	const lines = [];
	for (const message of messages) {
		const text = message.blocks.filter((block) => block.type === "text").map((block) => block.text).join("\n").trim();
		if (text === "") continue;
		lines.push(`【${message.role === "user" ? "用户" : "助手"}】${text}`);
	}
	return lines.join("\n\n");
}
/** Text of one transcript message, or "" when it carries no prose. */
function transcriptText(message) {
	return message.blocks.filter((block) => block.type === "text").map((block) => block.text).join("\n").trim();
}
/** The launching conversation's most recent turns, as one plain-text block. */
async function parentExcerpt(ctx, parentSessionId, rounds, budget) {
	let events;
	try {
		events = (await ctx.sessionQuery.readSession(parentSessionId)).events;
	} catch (error) {
		return void 0;
	}
	const messages = foldTranscript(events);
	const picked = [];
	let used = 0;
	for (let index = messages.length - 1; index >= 0 && picked.length < rounds * 2; index -= 1) {
		const text = transcriptText(messages[index]);
		if (text === "") continue;
		if (used + text.length > budget) break;
		used += text.length;
		picked.unshift(messages[index]);
	}
	if (picked.length === 0) return void 0;
	return `${GUIDANCE_MARKER}[下面是发起此问题的父会话最近 ${picked.length} 条消息，回答时可作为背景；需要更早的内容时调用 sidechat_read_parent 继续往前翻。]\n\n${renderTranscript(picked)}`;
}
/** The start time of the still-open turn, or undefined when no turn is running. */
function openTurnStart(events) {
	let lastStart;
	let lastEnd;
	for (const event of events) if (event.type === "turn/start") lastStart = event.time;
	else if (event.type === "turn/end") lastEnd = event.time;
	if (lastStart === void 0) return void 0;
	if (lastEnd !== void 0 && lastEnd >= lastStart) return void 0;
	return lastStart;
}
const Config = z.object({
	lookupDefault: z.boolean().default(SUBCHAT_PREFS_DEFAULTS.lookupDefault),
	sendImmediately: z.boolean().default(SUBCHAT_PREFS_DEFAULTS.sendImmediately),
	defaultPrompt: z.string().default(SUBCHAT_PREFS_DEFAULTS.defaultPrompt),
	bringMode: z.union(["draft", "context"]).default(SUBCHAT_PREFS_DEFAULTS.bringMode),
	panelHome: z.union(["floating", "sidebar-right"]).default(SUBCHAT_PREFS_DEFAULTS.panelHome)
}).volatile();
/** The API method table bound to the plugin context and the live side-chat map. */
function buildApi(ctx, sideChats, knownChats, getSettings) {
	/** Persist the current live records (best-effort; never blocks the API). */
	const persist = () => {
		const merged = new Map(knownChats);
		for (const record of sideChats.values()) merged.set(record.childId, {
			childId: record.childId,
			parentSessionId: record.parentSessionId,
			createdAt: record.createdAt
		});
		writeRecords([...merged.values()]).catch((error) => {
			console.warn("[dsh-side-chat] record write failed:", error instanceof Error ? error.message : String(error));
		});
	};
	/** Narrow a payload value to a non-empty prompt content array. */
	const requireContent = (payload) => {
		const content = payload?.content;
		if (!Array.isArray(content) || content.length === 0) throw new SidechatError("bad-request", "missing or invalid \"content\"");
		const parts = [];
		for (const raw of content) {
			const part = raw;
			if (part?.type === "text" && typeof part.text === "string" && part.text !== "") parts.push({
				type: "text",
				text: part.text
			});
			else if (part?.type === "image" && typeof part.mediaType === "string" && typeof part.data === "string" && part.data !== "") parts.push({
				type: "image",
				mediaType: part.mediaType,
				data: part.data,
				...typeof part.name === "string" && part.name !== "" ? { name: part.name } : {}
			});
			else throw new SidechatError("bad-request", "invalid content block");
		}
		if (parts.every((p) => p.type !== "text")) throw new SidechatError("bad-request", "content must include text");
		return parts;
	};
	/** Promote browser base64 images to durable references; append hidden guidance. */
	const durableContent = async (parts, lookupEnabled) => {
		const limits = ctx.attachments.imageLimits;
		if (parts.filter((p) => p.type === "image").length > limits.maxImagesPerMessage) throw new SidechatError("too-many-images", `prompt exceeds the ${limits.maxImagesPerMessage}-image limit`, 400);
		const blocks = [];
		for (const part of parts) if (part.type === "text") blocks.push({
			type: "text",
			text: part.text
		});
		else {
			const data = decodeBase64(part.data);
			try {
				await ctx.attachments.validateImage({
					data,
					mediaType: part.mediaType,
					...part.name === void 0 ? {} : { name: part.name }
				});
				const attachment = await ctx.attachments.saveImage({
					data,
					mediaType: part.mediaType,
					...part.name === void 0 ? {} : { name: part.name }
				});
				blocks.push({
					type: "image",
					attachment
				});
			} catch (error) {
				throw new SidechatError("bad-image", error instanceof Error ? error.message : String(error), 400);
			}
		}
		blocks.push({
			type: "text",
			text: lookupEnabled ? LOOKUP_GUIDANCE : NO_LOOKUP_GUIDANCE
		});
		return blocks;
	};
	/** Resolve the live launching agent (the side chat's durable parent must be live to start/continue). */
	const parentOf = (parentSessionId) => {
		const parent = ctx.agents.get(parentSessionId);
		if (parent === void 0) throw new SidechatError("parent-unavailable", "the launching conversation is not live; reopen it to start or continue a side chat", 409);
		return parent;
	};
	/**
	* The launching conversation's NEXT-STEP model choice.
	*
	* DSH 0.2.2-alpha.3 keeps a durable selection on the agent (`agent.model`), and a
	* model switch recorded in the main conversation applies from the next step,
	* while `session.requestHeader()` still reports the previous request. Reading
	* the durable choice first is what makes a side chat launched right after a
	* switch inherit the newly selected model; older runtimes expose no `model`
	* and fall back to the request header, then to the agent's own options.
	*/
	const parentRoute = (parent) => {
		const selected = parent.model?.current?.();
		const config = parent.session.requestHeader?.()?.config;
		const effort = selected?.reasoningEffort ?? config?.reasoningEffort;
		return {
			provider: selected?.provider ?? config?.provider ?? parent.options.provider ?? "",
			model: selected?.model ?? config?.model ?? parent.options.model ?? "",
			...effort === void 0 ? {} : { reasoningEffort: effort }
		};
	};
	/** The parent conversation's current model selection (for staged-mode display). */
	const inherit = (payload) => {
		const parentSessionId = requireString(payload, "parentSessionId");
		return parentRoute(parentOf(parentSessionId));
	};
	/** Resolve the live side-chat agent behind a childId. */
	const childOf = (childId) => {
		const record = sideChats.get(childId);
		if (record !== void 0) return record.handle.agent;
		const live = ctx.agents.get(childId);
		if (live !== void 0) return live;
		throw new SidechatError("child-unavailable", `side chat "${childId}" is not live`, 409);
	};
	/** Resolve the live side-chat session (for permission writes). */
	const sessionOf = (childId) => {
		const child = childOf(childId);
		const session = ctx.sessions.get(childId) ?? child.session;
		if (session === void 0) throw new SidechatError("child-unavailable", `side chat "${childId}" has no session`, 409);
		return session;
	};
	/** List the host slash commands available to one side-chat agent. */
	const commands = (payload) => {
		const childId = requireString(payload, "childId");
		const child = childOf(childId);
		return { commands: ctx.commands.list(child).map((c) => ({
			name: c.name,
			description: c.description
		})) };
	};
	/** Execute one host slash command against a side-chat agent. */
	const command = async (payload) => {
		const childId = requireString(payload, "childId");
		const line = requireString(payload, "line");
		const child = childOf(childId);
		return { executed: await ctx.commands.execute(child, line, [], new AbortController().signal) !== void 0 };
	};
	/**
	* Read a side chat's event log through the session-query service. DSH 0.1.6
	* deprecated the Session's synchronous event getters (`snapshotEvents`,
	* `eventAt`, `ownEvents`); `readSession` is the live-preferred asynchronous
	* read that supersedes them, and the transcript routes already use it.
	*/
	const sessionEvents = async (sessionId) => (await ctx.sessionQuery.readSession(sessionId)).events;
	/** Fold one side-chat agent's plan/goal state for its composer chrome. */
	const state = async (payload) => {
		const childId = requireString(payload, "childId");
		childOf(childId);
		const events = await sessionEvents(childId);
		let planActive = false;
		let planWanted = null;
		let goal = null;
		for (const event of events) {
			const data = event.data;
			if (event.type === "command/run" && data.name === "plan") {
				if (data.args === void 0) continue;
				const wanted = String(data.args).trim() !== "off";
				if (wanted !== planWanted) planWanted = wanted;
			} else if (event.type === "plan/mode") {
				planActive = data.active === true;
				planWanted = null;
			} else if (event.type === "goal/change") {
				if (data.operation === "clear") goal = null;
				else if (data.goal !== null && typeof data.goal === "object") {
					const g = data.goal;
					if (typeof g.id === "string" && typeof g.objective === "string") goal = {
						id: g.id,
						objective: g.objective
					};
				}
			}
		}
		return {
			plan: {
				active: planActive,
				pending: planWanted !== null && planWanted !== planActive
			},
			goal
		};
	};
	/**
	* Serialize one side chat's archive/unarchive writes. Both registry calls go
	* through the host registry's own operation queue, so enqueueing them in call
	* order is what decides the final state; this chain keeps that order stable
	* when a settling turn and a new delivery overlap.
	*/
	const visibilityQueue = /* @__PURE__ */ new Map();
	const queueVisibility = (childId, op) => {
		const next = (visibilityQueue.get(childId) ?? Promise.resolve()).then(op, op);
		visibilityQueue.set(childId, next.then(() => {}, () => {}));
		return next;
	};
	/**
	* Restore one side chat's session before a turn. Registries older than the
	* 0.1.7 gate have no `unarchiveSession` (and need none): there the archive
	* simply stays in place for the whole turn. A failed restore propagates: the
	* caller must not deliver a prompt the gate will answer with `blocked`.
	*/
	const unarchiveChild = (childId) => {
		const unarchive = ctx.workspaceRegistry.unarchiveSession;
		if (unarchive === void 0) return archiveChild(childId);
		return queueVisibility(childId, () => unarchive.call(ctx.workspaceRegistry, childId));
	};
	/**
	* Hide one side chat's session again once its agent has settled. Best-effort:
	* a registry that reports the session active (or refuses the write) only
	* leaves it visible until the next settle, never breaks a turn.
	*/
	const archiveChild = (childId) => {
		return queueVisibility(childId, () => ctx.workspaceRegistry.archiveSession(childId)).catch(() => {});
	};
	/** Count one settled turn and re-archive the session when the last one ends. */
	const settleTurn = (record) => {
		if (record.pendingTurns > 0) record.pendingTurns -= 1;
		if (record.pendingTurns > 0) return;
		archiveChild(record.childId);
	};
	/**
	* Hand one prompt to a side chat: lift the archive, deliver, and let the
	* agent's own idle boundary put the session back out of every list. `followup`
	* opens the driver synchronously (the phase turns `running` before it
	* returns), so observing `whenIdle` right after it can never miss the turn.
	*/
	const deliver = async (record, message) => {
		record.pendingTurns += 1;
		try {
			await unarchiveChild(record.childId);
			record.handle.agent.followup(message);
		} catch (error) {
			settleTurn(record);
			throw error;
		}
		record.handle.agent.whenIdle().then(() => {
			settleTurn(record);
		}, () => {
			settleTurn(record);
		});
	};
	/** Create one side chat: inherit, record, deliver the first prompt (hidden while idle). */
	const start = async (payload) => {
		const parentSessionId = requireString(payload, "parentSessionId");
		const content = requireContent(payload);
		const lookupEnabled = optionalBoolean(payload, "lookupEnabled");
		const parent = parentOf(parentSessionId);
		const blocks = await durableContent(content, lookupEnabled);
		if (lookupEnabled === true) {
			const excerpt = await parentExcerpt(ctx, parentSessionId, PARENT_EXCERPT_ROUNDS, PARENT_EXCERPT_BUDGET);
			if (excerpt !== void 0) blocks.unshift({
				type: "text",
				text: excerpt
			});
		}
		const record = payload;
		const inherited = parentRoute(parent);
		const parentConfig = parent.session.requestHeader?.()?.config;
		const provider = typeof record.provider === "string" && record.provider !== "" ? record.provider : inherited.provider;
		const model = typeof record.model === "string" && record.model !== "" ? record.model : inherited.model;
		const maxTokens = parentConfig?.maxTokens ?? parent.options.maxTokens;
		const reasoningEffort = (typeof record.reasoningEffort === "string" && record.reasoningEffort !== "" ? record.reasoningEffort : void 0) ?? inherited.reasoningEffort;
		const cwd = parent.session.header.cwd;
		const selection = {
			current: {
				provider,
				model,
				...reasoningEffort === void 0 ? {} : { reasoningEffort }
			},
			assembled: void 0
		};
		const parentCtx = parent.ctx;
		const childId = `subchat-${randomUUID()}`;
		const handle = await ctx.agents.create({
			sessionId: childId,
			meta: {
				...cwd === void 0 ? {} : { cwd },
				parentSession: parentSessionId
			},
			agentOptions: {
				provider,
				model,
				...maxTokens === void 0 ? {} : { maxTokens }
			},
			setup: (agentCtx) => {
				if (parentCtx !== void 0) ctx.agentPresets.composeFrom(agentCtx, parentCtx);
				if (durableModelSelection) {
					installModelSelection?.(agentCtx);
					return;
				}
				if (installModelSelection !== void 0) {
					installModelSelection(agentCtx, selection);
					return;
				}
				agentCtx.on("agent/request", async (_payload, next) => {
					const resolved = await next();
					const sel = selection.current;
					if (sel === void 0) return resolved;
					const { reasoningEffort: _drop, ...rest } = resolved;
					return {
						...rest,
						provider: sel.provider,
						model: sel.model,
						...sel.reasoningEffort === void 0 ? {} : { reasoningEffort: sel.reasoningEffort }
					};
				});
			}
		});
		recordSelection(handle.agent, selection.current);
		try {
			const explicitPreset = typeof record.preset === "string" && record.preset !== "" ? record.preset : void 0;
			const parentPreset = ctx.permissionPresets.current(parent.session);
			const preset = explicitPreset ?? parentPreset;
			if (preset !== "custom") ctx.permissionPresets.set(handle.agent.session, preset);
		} catch (error) {
			console.warn("[dsh-side-chat] permission inherit failed:", error instanceof Error ? error.message : String(error));
		}
		const child = {
			childId,
			parentSessionId,
			handle,
			selection,
			createdAt: Date.now(),
			pendingTurns: 0
		};
		sideChats.set(childId, child);
		persist();
		await deliver(child, userMessage(blocks));
		return {
			childId,
			provider,
			model,
			...reasoningEffort === void 0 ? {} : { reasoningEffort }
		};
	};
	/** Deliver one later message to an existing side chat. */
	const followup = async (payload) => {
		const childId = requireString(payload, "childId");
		const content = requireContent(payload);
		const lookupEnabled = optionalBoolean(payload, "lookupEnabled");
		const child = childOf(childId);
		const record = sideChats.get(childId);
		const message = userMessage(await durableContent(content, lookupEnabled));
		if (record === void 0) {
			await unarchiveChild(childId);
			child.followup(message);
			child.whenIdle().then(() => {
				archiveChild(childId);
			}, () => {
				archiveChild(childId);
			});
			return { accepted: true };
		}
		await deliver(record, message);
		return { accepted: true };
	};
	/** List the side chats launched by one parent conversation. */
	const list = async (payload) => {
		const parentSessionId = requireString(payload, "parentSessionId");
		const items = [];
		const live = /* @__PURE__ */ new Set();
		for (const record of sideChats.values()) {
			if (record.parentSessionId !== parentSessionId) continue;
			live.add(record.childId);
			const status = record.handle.agent.status;
			const statusRunning = status === "running";
			const eventRunningSince = status === void 0 ? openTurnStart(await sessionEvents(record.childId)) : void 0;
			const running = statusRunning || status === void 0 && eventRunningSince !== void 0;
			const runningSince = running ? eventRunningSince ?? Date.now() : void 0;
			items.push({
				childId: record.childId,
				running,
				...runningSince !== void 0 ? { runningSince } : {}
			});
		}
		for (const known of knownChats.values()) {
			if (known.parentSessionId !== parentSessionId) continue;
			if (live.has(known.childId)) continue;
			items.push({
				childId: known.childId,
				running: false,
				idle: true
			});
		}
		return { items };
	};
	/** Read one side chat's transcript. */
	/** Interrupt the active side chat's current turn (user-initiated stop). */
	const stop = (payload) => {
		const childId = requireString(payload, "childId");
		childOf(childId).cancel({ kind: "user" });
		return { accepted: true };
	};
	/** Fold one side chat's transcript. */
	const history = async (payload) => {
		const childId = requireString(payload, "childId");
		let events;
		try {
			events = (await ctx.sessionQuery.readSession(childId)).events;
		} catch (error) {
			throw new SidechatError("not-found", error instanceof Error ? error.message : String(error), 404);
		}
		return { messages: foldTranscript(events) };
	};
	/** The deployment-resolved image policy (for client-side fast-path checks). */
	const limits = () => {
		const l = ctx.attachments.imageLimits;
		return {
			mediaTypes: [...l.mediaTypes],
			maxImageBytes: l.maxImageBytes,
			maxImagesPerMessage: l.maxImagesPerMessage,
			maxMessageImageBytes: l.maxMessageImageBytes,
			maxImagePixels: l.maxImagePixels,
			...l.maxImageDimension === void 0 ? {} : { maxImageDimension: l.maxImageDimension }
		};
	};
	/** Read one durable image's bytes for transcript rendering. */
	const attachment = async (payload) => {
		const childId = requireString(payload, "childId");
		const attachmentId = requireString(payload, "attachmentId");
		const snapshot = await ctx.sessionQuery.readSession(childId);
		for (const message of foldTranscript(snapshot.events)) for (const block of message.blocks) if (block.type === "image" && block.ref.attachmentId === attachmentId) {
			const stored = await ctx.attachments.readImage(block.ref);
			return {
				mediaType: stored.ref.mediaType,
				data: Buffer.from(stored.data).toString("base64")
			};
		}
		throw new SidechatError("not-found", `image "${attachmentId}" not found`, 404);
	};
	/** Adjust one side chat's model / reasoning-effort. */
	const selectModel = (payload) => {
		const childId = requireString(payload, "childId");
		const provider = requireString(payload, "provider");
		const model = requireString(payload, "model");
		const record = sideChats.get(childId);
		if (record === void 0) throw new SidechatError("child-unavailable", `side chat "${childId}" is not live`, 409);
		const reasoningEffort = payload?.reasoningEffort;
		record.selection.current = {
			provider,
			model,
			...typeof reasoningEffort === "string" && reasoningEffort !== "" ? { reasoningEffort } : {}
		};
		recordSelection(record.handle.agent, record.selection.current);
		return { accepted: true };
	};
	/** Adjust one side chat's permission preset. */
	const selectPermission = (payload) => {
		const childId = requireString(payload, "childId");
		const presetName = requireString(payload, "presetName");
		const session = sessionOf(childId);
		ctx.permissionPresets.set(session, presetName);
		return { accepted: true };
	};
	/** Re-attach one recorded side chat that is not live yet (host restart). */
	const attach = async (payload) => {
		const childId = requireString(payload, "childId");
		if (sideChats.has(childId)) return { attached: true };
		const known = knownChats.get(childId);
		if (known === void 0) throw new SidechatError("not-found", `side chat "${childId}" is not recorded`, 404);
		const existing = ctx.agents.get(childId);
		if (existing !== void 0) {
			sideChats.set(childId, {
				childId,
				parentSessionId: known.parentSessionId,
				handle: {
					agent: existing,
					dispose: async () => {}
				},
				selection: {
					current: void 0,
					assembled: void 0
				},
				createdAt: known.createdAt,
				pendingTurns: 0
			});
			return { attached: true };
		}
		const parent = ctx.agents.get(known.parentSessionId);
		const parentCtx = parent?.ctx;
		const selection = {
			current: void 0,
			assembled: void 0
		};
		const handle = await ctx.agents.resume({
			resumeSessionId: childId,
			setup: (agentCtx) => {
				if (parentCtx !== void 0) ctx.agentPresets.composeFrom(agentCtx, parentCtx);
				if (installModelSelection !== void 0) installModelSelection(agentCtx, selection);
			}
		});
		sideChats.set(childId, {
			childId,
			parentSessionId: known.parentSessionId,
			handle,
			selection,
			createdAt: known.createdAt,
			pendingTurns: 0
		});
		return { attached: true };
	};
	/** Close one side chat: archive it and drop its record. */
	const dispose = async (payload) => {
		const childId = requireString(payload, "childId");
		const record = sideChats.get(childId);
		if (record !== void 0) {
			sideChats.delete(childId);
			try {
				await record.handle.dispose();
			} catch (error) {
				console.warn("[dsh-side-chat] dispose failed:", error instanceof Error ? error.message : String(error));
			}
		}
		knownChats.delete(childId);
		try {
			await archiveChild(childId);
		} catch {}
		persist();
		return { accepted: true };
	};
	/** Prompt for the selection translate / explain helpers. */
	const assistPrompt = (mode, locale, text, context) => {
		const hasCjk = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);
		if (mode === "translate") {
			const clip = typeof context === "string" ? context.trim().slice(0, 1500) : "";
			const around = clip === "" ? "" : locale === "en" ? `\n\nThe context it appears in:\n${clip}` : `\n\n它所在的上下文：\n${clip}`;
			return locale === "en" ? `Translate the following into ${hasCjk ? "English" : "Chinese"}. Use the surrounding context to judge the right sense, and give one to five possible translations ranked from most to least fitting here. One translation per line, each line starting with "1. ", "2. " and so on; no source text, no explanation:\n\n${text}${around}` : `把下面的内容翻译成${hasCjk ? "英文" : "中文"}。结合它所在的上下文判断词义，给出 1 到 5 个符合该语境的译法，按贴合程度从高到低排列；每条占一行并以「1. 」「2. 」这样的序号开头，只列译法，不要抄原文、不要解释：\n\n${text}${around}`;
		}
		const clip = typeof context === "string" ? context.trim().slice(0, 1500) : "";
		const around = clip === "" ? "" : locale === "en" ? `\n\nThe context it appears in:\n${clip}` : `\n\n它所在的上下文：\n${clip}`;
		return locale === "en" ? `Explain the term or concept in the following selection in one to three sentences, plainly:\n\n${text}${around}` : `用一到三句话解释下面这段内容里的名词或概念，说清它是什么、在这里起什么作用：\n\n${text}${around}`;
	};
	/** One-shot translate / explain for the selection menu. */
	const assist = async (payload) => {
		const parentSessionId = requireString(payload, "parentSessionId");
		const text = requireString(payload, "text");
		const mode = payload?.mode === "explain" ? "explain" : "translate";
		const record = payload;
		const inherited = parentRoute(parentOf(parentSessionId));
		const provider = typeof record.provider === "string" && record.provider !== "" ? record.provider : inherited.provider;
		const model = typeof record.model === "string" && record.model !== "" ? record.model : inherited.model;
		if (provider === "" || model === "") throw new SidechatError("bad-request", "no model available for this action");
		const inheritedEffort = typeof record.reasoningEffort === "string" && record.reasoningEffort !== "" ? record.reasoningEffort : inherited.reasoningEffort;
		const reasoningEffort = inheritedEffort === "high" || inheritedEffort === "xhigh" || inheritedEffort === "max" ? "low" : inheritedEffort;
		const locale = record.locale === "en" ? "en" : "zh";
		const prompt = assistPrompt(mode, locale, text, record.context);
		const chunks = ctx.llm.stream({
			provider,
			model,
			...reasoningEffort === void 0 ? {} : { reasoningEffort },
			maxTokens: 1024,
			messages: [{
				id: randomUUID(),
				role: "user",
				content: [{
					type: "text",
					text: prompt
				}],
				source: { kind: "user" }
			}]
		});
		let out = "";
		for await (const chunk of chunks) if (chunk.type === "text-delta" && typeof chunk.text === "string") out += chunk.text;
		const trimmed = out.trim();
		if (trimmed === "") throw new SidechatError("assist-empty", "the model returned no content", 502);
		return {
			text: trimmed,
			mode
		};
	};
	/** Summarize one piece of text with the side chat's (inherited) model. */
	const summarize = async (payload) => {
		const parentSessionId = requireString(payload, "parentSessionId");
		const text = requireString(payload, "text");
		const record = payload;
		const inherited = parentRoute(parentOf(parentSessionId));
		const provider = typeof record.provider === "string" && record.provider !== "" ? record.provider : inherited.provider;
		const model = typeof record.model === "string" && record.model !== "" ? record.model : inherited.model;
		if (provider === "" || model === "") throw new SidechatError("bad-request", "no model available for summarization");
		const reasoningEffort = typeof record.reasoningEffort === "string" && record.reasoningEffort !== "" ? record.reasoningEffort : inherited.reasoningEffort;
		const prompt = (typeof record.locale === "string" && record.locale === "en" ? "en" : "zh") === "en" ? `Summarize the following content concisely. Keep the key points and output only the summary:\n\n${text}` : `请对以下内容做简明扼要的摘要，保留关键信息，只输出摘要本身：\n\n${text}`;
		const chunks = ctx.llm.stream({
			provider,
			model,
			...reasoningEffort === void 0 ? {} : { reasoningEffort },
			maxTokens: 1024,
			messages: [{
				id: randomUUID(),
				role: "user",
				content: [{
					type: "text",
					text: prompt
				}],
				source: { kind: "user" }
			}]
		});
		let summary = "";
		for await (const chunk of chunks) if (chunk.type === "text-delta" && typeof chunk.text === "string") summary += chunk.text;
		const trimmed = summary.trim();
		if (trimmed === "") throw new SidechatError("summarize-empty", "the model returned no summary", 502);
		return { summary: trimmed };
	};
	/** Inject one piece of text into the main conversation as a collapsed context row. */
	const inject = (payload) => {
		const parentSessionId = requireString(payload, "parentSessionId");
		const text = requireString(payload, "text");
		const record = payload;
		const summary = typeof record.summary === "string" && record.summary.trim() !== "" ? record.summary.trim() : "从侧边聊天带回";
		parentOf(parentSessionId).inject({
			id: randomUUID(),
			role: "user",
			content: [{
				type: "text",
				text
			}],
			source: {
				kind: "plugin:dsh-side-chat",
				form: "notice",
				summary
			}
		});
		return { accepted: true };
	};
	/** Full model directory: provider groups → models → reasoning efforts. */
	const directory = async () => {
		const providers = ctx.llm.listProviders();
		const groups = [];
		for (const provider of providers) {
			const listed = await ctx.llm.listModels(provider.id);
			const models = [];
			for (const model of listed) {
				const entry = {
					id: model.id,
					name: model.name,
					...model.description === void 0 ? {} : { description: model.description }
				};
				try {
					const info = await ctx.llm.resolveModelInfo(provider.id, model.id);
					if (info.reasoning !== void 0) entry.reasoning = {
						efforts: info.reasoning.efforts.map((e) => ({
							id: e.id,
							name: e.name
						})),
						...info.reasoning.defaultEffort === void 0 ? {} : { defaultEffort: info.reasoning.defaultEffort }
					};
				} catch {}
				models.push(entry);
			}
			groups.push({
				id: provider.id,
				name: provider.name,
				models
			});
		}
		return { groups };
	};
	/** Permission-preset options for the side-chat selector. */
	const permissions = () => {
		const presets = ctx.permissionPresets;
		const toOption = (o) => ({
			value: o.value,
			name: o.name,
			...o.description === void 0 ? {} : { description: o.description }
		});
		const catalog = presets.catalog;
		if (typeof catalog === "function") return {
			options: catalog.call(presets).options.map(toOption),
			current: presets.defaultPreset ?? "custom"
		};
		const selectFor = presets.selectFor;
		if (typeof selectFor === "function") {
			const select = selectFor.call(presets, {});
			return {
				options: select.options.map(toOption),
				current: select.currentValue
			};
		}
		throw new SidechatError("permissions-unavailable", "the permission-presets service exposes neither catalog() nor selectFor()", 503);
	};
	return {
		"sidechat.start": start,
		"sidechat.followup": followup,
		"sidechat.list": list,
		"sidechat.history": history,
		"sidechat.stop": stop,
		"sidechat.selectModel": selectModel,
		"sidechat.selectPermission": selectPermission,
		"sidechat.assist": assist,
		"sidechat.summarize": summarize,
		"sidechat.inject": inject,
		"sidechat.directory": directory,
		"sidechat.permissions": permissions,
		"sidechat.limits": limits,
		"sidechat.attachment": attachment,
		"sidechat.inherit": inherit,
		"sidechat.commands": commands,
		"sidechat.command": command,
		"sidechat.state": state,
		"sidechat.attach": attach,
		"sidechat.dispose": dispose,
		"settings.get": () => {
			return getSettings()?.get() ?? {
				value: void 0,
				revision: void 0
			};
		},
		"settings.update": async (payload) => {
			const settings = getSettings();
			if (settings === void 0) throw new SidechatError("settings-rejected", "the settings service is not mounted in this deployment", 503);
			const record = payload;
			const patch = record?.patch;
			if (patch === null || typeof patch !== "object" || Array.isArray(patch)) throw new SidechatError("bad-request", "patch must be a plain object");
			const expectedRevision = typeof record?.expectedRevision === "number" ? record.expectedRevision : void 0;
			try {
				return await settings.update(patch, expectedRevision);
			} catch (error) {
				if (error instanceof SettingsConflictError) throw new SidechatError("settings-conflict", error.message, 409);
				throw new SidechatError("settings-rejected", error instanceof Error ? error.message : String(error), 400);
			}
		}
	};
}
/**
* Resolve this plugin's settings namespace: the Loader entry id that owns the
* running fiber. Both reads are defensive because this package builds against
* its own cordis, so the upstream `Fiber.entry` augmentation is not visible
* here. `undefined` (no owning entry, e.g. a bare programmatic mount) leaves
* the settings face unbound: the plugin still runs, only its preferences stay
* unavailable instead of being written to a namespace nobody owns.
*/
function settingsNamespaceOf(ctx) {
	const owner = ctx.fiber?.entry;
	const fromFiber = owner?.options?.id ?? owner?.id;
	if (typeof fromFiber === "string" && fromFiber !== "") return fromFiber;
	const located = ctx.get("loader")?.locate?.(ctx.fiber);
	return typeof located === "string" && located !== "" ? located : void 0;
}
/** The Loader row id and package specifier of DSH's /api connection plugin. */
const CONNECTION_ENTRY_ID = "connection";
const CONNECTION_PLUGIN_NAME = "@deepseek-ai/dsh-client-connection";
/**
* Declared non-loopback authorities this deployment serves.
*
* DSH 0.2.1-rc.1 made `webStartup.trustedHosts` — one entry per `--trusted-host`
* value — the source its /api fence reads. The 0.2.0 line instead resolved
* `webRuntime.trustedHosts` (the invocation values plus LAN literals derived
* from the active bind) into the `connection` row's config, so both are read
* and merged: the service first, the row as the fallback that keeps 0.2.0
* deployments working.
*
* Only a string array is accepted. A Loader row retains `!!js` expressions
* unevaluated (`Entry.options.config` is the raw node, not the value the fiber
* receives), so a non-array must never reach the fence — it would make the
* authority comparison throw instead of refusing the request.
*/
function trustedHostsOf(ctx) {
	const hosts = /* @__PURE__ */ new Set();
	const collect = (value) => {
		if (!Array.isArray(value)) return;
		for (const entry of value) if (typeof entry === "string" && entry !== "") hosts.add(entry);
	};
	collect(ctx.get("webStartup")?.trustedHosts);
	const loader = ctx.get("loader");
	for (const entry of loader?.entries?.() ?? []) {
		const options = entry.options;
		if (options?.id !== CONNECTION_ENTRY_ID && options?.name !== CONNECTION_PLUGIN_NAME) continue;
		collect(options.config?.trustedHosts);
	}
	return [...hosts];
}
/**
* The listener's own bind IP literal (DSH 0.2.1-rc.1 fence input). Read from the
* webserver service so `--host 10.0.0.7` stays reachable even though the literal
* is deliberately outside `trustedHosts`.
*/
function bindHostOf(ctx) {
	const host = ctx.webServer?.host;
	return typeof host === "string" && host !== "" ? host : void 0;
}
/**
* The listener protocol the fence normalizes default Host ports with. Absent
* before DSH 0.2.1-rc.1 (HTTP-only listeners), where the HTTP default applies.
*/
function listenerProtocolOf(ctx) {
	return ctx.webServer?.protocol === "https:" ? "https:" : DEFAULT_TRUST_PROTOCOL;
}
/** Host plugin body: register the /sidechat JSON API routes. */
function apply(ctx) {
	const sideChats = /* @__PURE__ */ new Map();
	const knownChats = /* @__PURE__ */ new Map();
	let settingsFace;
	ctx.inject(["settings"], (sctx) => {
		const ns = settingsNamespaceOf(ctx);
		if (ns === void 0) return;
		sctx.effect(() => sctx.settings.configure({ auto: false }, ctx.fiber));
		const viewOf = () => {
			const descriptor = sctx.settings.describe({ redactSecrets: true }).find((c) => c.ns === ns);
			return descriptor === void 0 ? {
				value: void 0,
				revision: void 0
			} : {
				value: descriptor.value,
				revision: descriptor.revision
			};
		};
		settingsFace = {
			get: viewOf,
			update: async (patch, expectedRevision) => {
				await sctx.settings.update(ns, patch, expectedRevision);
				return viewOf();
			}
		};
		sctx.effect(() => () => {
			settingsFace = void 0;
		});
	});
	const api = buildApi(ctx, sideChats, knownChats, () => settingsFace);
	ctx.tools.register(defineTool({
		name: "sidechat_read_parent",
		description: [
			"Read earlier turns of the conversation that launched this side chat.",
			"The newest turns are already in your prompt; use this tool when you need something older (a term defined earlier, a file path, a decision).",
			"Pages backwards from the newest message: skip counts how many recent messages to jump over, limit how many to return (default 10, max 30).",
			"Only usable from a side chat; it reads the parent conversation of the side chat you are running in."
		].join(" "),
		parameters: {
			skip: {
				type: "integer",
				description: "How many of the most recent parent messages to jump over (default 0)."
			},
			limit: {
				type: "integer",
				description: "How many messages to return (default 10, max 30)."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: { text: {
					type: "string",
					required: true
				} }
			},
			render: (_args, value) => [{
				type: "text",
				text: value.text
			}]
		},
		isConcurrencySafe: () => true,
		async execute(args, exec) {
			const childId = exec.agent?.session?.id;
			if (typeof childId !== "string") throw new Error("sidechat_read_parent: no active session");
			let record;
			for (const entry of sideChats.values()) if (entry.childId === childId) record = entry;
			if (record === void 0) throw new Error("sidechat_read_parent: this tool only works inside a side chat");
			const skip = Number.isInteger(args?.skip) && args.skip > 0 ? args.skip : 0;
			const limit = Number.isInteger(args?.limit) && args.limit > 0 ? Math.min(args.limit, 30) : 10;
			const messages = foldTranscript((await ctx.sessionQuery.readSession(record.parentSessionId)).events).filter((message) => transcriptText(message) !== "");
			if (messages.length === 0) return { text: "父会话还没有任何文本消息。" };
			const end = Math.max(0, messages.length - skip);
			const start = Math.max(0, end - limit);
			const picked = messages.slice(start, end);
			if (picked.length === 0) return { text: `父会话共有 ${messages.length} 条文本消息，skip=${skip} 已翻到最开头，没有更早的内容了。` };
			return { text: `父会话共有 ${messages.length} 条文本消息，本次返回第 ${start + 1}-${end} 条（从最新往回 skip=${skip}）。\n\n${renderTranscript(picked)}` };
		}
	}));
	ctx.effect(() => {
		return () => {
			const records = [...sideChats.values()];
			sideChats.clear();
			(async () => {
				for (const record of records) {
					try {
						await record.handle.dispose();
					} catch {}
				}
			})();
		};
	}, "dsh-side-chat: dispose side chats");
	ctx.effect(() => {
		(async () => {
			for (const record of await readRecords()) knownChats.set(record.childId, {
				childId: record.childId,
				parentSessionId: record.parentSessionId,
				createdAt: record.createdAt
			});
		})();
	}, "dsh-side-chat: load recorded side chats");
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: "/sidechat/api",
		handler: async (req, res) => {
			if (!isTrustedApiRequest(req, trustedHostsOf(ctx), bindHostOf(ctx), listenerProtocolOf(ctx))) {
				writeJson(res, 403, {
					ok: false,
					error: {
						code: "forbidden",
						message: "forbidden"
					}
				});
				return;
			}
			if (req.method !== "POST") {
				writeJson(res, 405, {
					ok: false,
					error: {
						code: "method-error",
						message: "method not allowed"
					}
				});
				return;
			}
			const pathname = new URL(req.url ?? "/", "http://dsh.internal").pathname;
			const method = pathname.startsWith("/sidechat/api/") ? pathname.slice(14) : void 0;
			if (method === void 0 || method.includes("/")) {
				writeJson(res, 404, {
					ok: false,
					error: {
						code: "not-found",
						message: "unknown sidechat API method"
					}
				});
				return;
			}
			const handler = api[method];
			if (handler === void 0) {
				writeJson(res, 404, {
					ok: false,
					error: {
						code: "not-found",
						message: `unknown sidechat API method "${method}"`
					}
				});
				return;
			}
			try {
				writeOk(res, await handler(await readJsonBody(req)));
			} catch (error) {
				writeError(res, error);
			}
		}
	}), "dsh-side-chat: /sidechat/api routes");
}
//#endregion
export { Config, apply, inject, name };
