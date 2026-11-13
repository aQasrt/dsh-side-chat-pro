/**
 * Client API client for the /sidechat JSON routes (same fetch pattern the
 * better-sidebar built-ins use). All requests are same-origin POSTs; the host
 * fence (loopback/trusted authority) passes them naturally.
 */
/** One API failure envelope. */
export interface SidechatApiError {
    code: string;
    message: string;
}
/** The unwrapped success value of one API method. */
export type SidechatResult<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: SidechatApiError;
};
/** Side-chat list row. */
export interface SidechatListItem {
    childId: string;
    running: boolean;
    runningSince?: number;
}
/** Browser-submitted prompt content part (text or base64 image). */
export type PromptContentPart = {
    type: 'text';
    text: string;
} | {
    type: 'image';
    mediaType: string;
    data: string;
    name?: string;
};
/** One durable image reference returned by the host transcript. */
export interface SidechatImageRef {
    attachmentId: string;
    mediaType: string;
    bytes: number;
    width: number;
    height: number;
    name?: string;
}
/** One transcript message block. */
export type SidechatMessageBlock = {
    type: 'text';
    text: string;
} | {
    type: 'image';
    ref: SidechatImageRef;
} | {
    type: 'reasoning';
    text: string;
};
/** One transcript message. */
export interface SidechatMessage {
    role: 'user' | 'assistant';
    blocks: SidechatMessageBlock[];
}
/** Model / effort directory (provider groups → models → reasoning efforts). */
export interface SidechatDirectory {
    groups: Array<{
        id: string;
        name: string;
        models: Array<{
            id: string;
            name: string;
            description?: string;
            reasoning?: {
                efforts: Array<{
                    id: string;
                    name: string;
                }>;
                defaultEffort?: string;
            };
        }>;
    }>;
}
/** Permission options. */
export interface SidechatPermissions {
    options: Array<{
        value: string;
        name: string;
        description?: string;
    }>;
    current: string;
}
export declare const api: {
    start: (args: {
        parentSessionId: string;
        content: PromptContentPart[];
        lookupEnabled: boolean;
        provider?: string;
        model?: string;
        reasoningEffort?: string;
        preset?: string;
    }) => Promise<SidechatResult<{
        childId: string;
        provider: string;
        model: string;
        reasoningEffort?: string;
    }>>;
    followup: (args: {
        childId: string;
        content: PromptContentPart[];
        lookupEnabled: boolean;
    }) => Promise<SidechatResult<{
        accepted: true;
    }>>;
    list: (args: {
        parentSessionId: string;
    }) => Promise<SidechatResult<{
        items: SidechatListItem[];
    }>>;
    history: (args: {
        childId: string;
    }) => Promise<SidechatResult<{
        messages: SidechatMessage[];
    }>>;
    stop: (args: {
        childId: string;
    }) => Promise<SidechatResult<{
        accepted: true;
    }>>;
    selectModel: (args: {
        childId: string;
        provider: string;
        model: string;
        reasoningEffort?: string;
    }) => Promise<SidechatResult<{
        accepted: true;
    }>>;
    selectPermission: (args: {
        childId: string;
        presetName: string;
    }) => Promise<SidechatResult<{
        accepted: true;
    }>>;
    summarize: (args: {
        parentSessionId: string;
        text: string;
        provider?: string;
        model?: string;
        reasoningEffort?: string;
        locale?: string;
    }) => Promise<SidechatResult<{
        summary: string;
    }>>;
    inject: (args: {
        parentSessionId: string;
        text: string;
        summary?: string;
    }) => Promise<SidechatResult<{
        accepted: true;
    }>>;
    directory: () => Promise<SidechatResult<SidechatDirectory>>;
    permissions: () => Promise<SidechatResult<SidechatPermissions>>;
    limits: () => Promise<SidechatResult<{
        mediaTypes: string[];
        maxImageBytes: number;
        maxImagesPerMessage: number;
        maxMessageImageBytes: number;
        maxImagePixels: number;
        maxImageDimension?: number;
    }>>;
    attachment: (args: {
        childId: string;
        attachmentId: string;
    }) => Promise<SidechatResult<{
        mediaType: string;
        data: string;
    }>>;
    inherit: (args: {
        parentSessionId: string;
    }) => Promise<SidechatResult<{
        provider: string;
        model: string;
        reasoningEffort?: string;
    }>>;
    commands: (args: {
        childId: string;
    }) => Promise<SidechatResult<{
        commands: Array<{
            name: string;
            description: string;
        }>;
    }>>;
    command: (args: {
        childId: string;
        line: string;
    }) => Promise<SidechatResult<{
        executed: boolean;
    }>>;
    state: (args: {
        childId: string;
    }) => Promise<SidechatResult<{
        plan: {
            active: boolean;
            pending: boolean;
        };
        goal: {
            id: string;
            objective: string;
        } | null;
    }>>;
    settingsGet: () => Promise<SidechatResult<{
        value?: unknown;
        revision?: number;
    }>>;
    settingsUpdate: (patch: Record<string, unknown>, expectedRevision?: number) => Promise<SidechatResult<{
        value?: unknown;
        revision?: number;
    }>>;
    dispose: (args: {
        childId: string;
    }) => Promise<SidechatResult<{
        accepted: true;
    }>>;
};
