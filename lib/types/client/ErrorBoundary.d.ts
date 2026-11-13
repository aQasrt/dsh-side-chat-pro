/**
 * Last-resort render guard for runtime drift.
 *
 * The client bundle externalizes the platform modules the DSH web shell freezes
 * into its module table (`react`, `dsh-client-ui-slots`,
 * `dsh-client-ui-primitives`). Those exports are resolved by the RUNNING shell,
 * not by the line this bundle was compiled against, so a newer DSH that drops or
 * renames one hands this bundle `undefined` — React then throws on render and
 * the whole panel (or the host's right-sidebar tab that embeds it) disappears.
 * `check-seed-exports` catches that at build time against the newest installed
 * shell; this boundary covers the gap where the runtime is newer than the last
 * verified line.
 *
 * It renders a neutral placeholder instead of retrying: a drifted platform
 * contract needs a rebuilt bundle, and an endless retry would only spam the
 * console. The failure is logged once per mount with the component label.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
interface SidechatErrorBoundaryProps {
    /** Which surface failed ("panel" / "dock"), for the log line. */
    label: string;
    children: ReactNode;
}
interface SidechatErrorBoundaryState {
    failure: unknown;
}
/** Render-level guard around one mounted side-chat surface. */
export declare class SidechatErrorBoundary extends Component<SidechatErrorBoundaryProps, SidechatErrorBoundaryState> {
    state: SidechatErrorBoundaryState;
    static getDerivedStateFromError(failure: unknown): SidechatErrorBoundaryState;
    componentDidCatch(failure: unknown, info: ErrorInfo): void;
    render(): ReactNode;
}
export {};
