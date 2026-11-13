/**
 * Wire helpers for the /sidechat JSON API: bounded body reading, response
 * writing, and the shared error envelope. Mirrors the /sidebar wire helpers
 * (loopback + trusted-host fence), kept self-contained so the plugin never
 * depends on the DSH gateway internals.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
/** One API failure with its wire code and HTTP status. */
export declare class SidechatError extends Error {
    readonly code: string;
    readonly status: number;
    constructor(code: string, message: string, status?: number);
}
/** Read and parse the JSON request body (bounded; malformed → bad-request). */
export declare function readJsonBody(req: IncomingMessage): Promise<unknown>;
/** Write a JSON response with the given status. */
export declare function writeJson(res: ServerResponse, status: number, body: unknown): void;
/** Write the success envelope. */
export declare function writeOk(res: ServerResponse, value: unknown): void;
/** Write the failure envelope for any thrown value (unknown → internal 500). */
export declare function writeError(res: ServerResponse, error: unknown): void;
/** Narrow an unknown payload value to a string, else throw bad-request. */
export declare function requireString(payload: unknown, key: string): string;
/** Narrow an unknown payload value to a boolean (default false). */
export declare function optionalBoolean(payload: unknown, key: string): boolean;
