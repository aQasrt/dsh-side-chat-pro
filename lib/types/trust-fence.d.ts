/**
 * Browser-trust fence for the /sidechat routes, behaviorally identical to the
 * /api gateway's fence (dsh-client-connection's `api-request-trust`).
 *
 * DSH 0.2.1-rc.1 widened that fence in two ways this copy has to follow:
 *
 * 1. The listener's own bind IP literal is accepted on any port, independently
 *    of `trustedHosts` (`--host 10.0.0.7` then browsing that literal). The
 *    0.2.0 line instead folded LAN literals into `trustedHosts` through the
 *    `webRuntime` service, which is why this fence takes the bind address as an
 *    explicit input rather than inferring it from the authority list.
 * 2. Host and Origin normalize through the listener protocol (`--tls-cert`),
 *    so a default port is stripped under the scheme that actually served the
 *    request rather than always under `http:`.
 *
 * The declared authorities themselves moved from `webRuntime.trustedHosts` to
 * `webStartup.trustedHosts`; the host half resolves them (see `trustedHostsOf`)
 * and this module stays a pure decision function.
 *
 * Self-contained copy, since the DSH connection package exports no such helper
 * through a specifier a third-party host plugin may import.
 */
import type { IncomingHttpHeaders } from 'node:http';
/** One request's trust-relevant facts (headers only). */
export interface ApiTrustRequest {
    headers: IncomingHttpHeaders;
}
/** Listener protocol, matching the webserver's own vocabulary. */
export type ApiTrustProtocol = 'http:' | 'https:';
/** The listener protocol assumed when a runtime exposes none (pre-0.2.1 DSH). */
export declare const DEFAULT_TRUST_PROTOCOL: ApiTrustProtocol;
/** Whether a normalized URL hostname names the local loopback authority. */
export declare function isLoopbackHostname(hostname: string): boolean;
/**
 * Decide whether one sidechat request may reach the plugin routes.
 * @param request - node HTTP request facts (headers).
 * @param trustedHosts - non-loopback authorities this deployment serves: exact `host:port`, or port-less `host` matching any port.
 * @param bindHost - the listener's own bind IP literal, accepted on any port independently of `trustedHosts`.
 * @param protocol - listener protocol for default Host ports; HTTP when the runtime exposes none.
 * @returns true when the Host is ours (loopback, the bind address, or trusted) and browser markers are same-origin.
 */
export declare function isTrustedApiRequest(request: ApiTrustRequest, trustedHosts: readonly string[], bindHost?: string, protocol?: ApiTrustProtocol): boolean;
