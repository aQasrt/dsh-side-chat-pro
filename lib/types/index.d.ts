import z from 'schemastery';
import type { Context } from './context-types.ts';
import { type SubchatPrefs } from './settings-shared.ts';
/** Plugin identity for cordis.yml rows. */
export declare const name = "dsh-side-chat-pro";
/** Services required before mounting. */
export declare const inject: string[];
export declare const Config: z<NoInfer<SubchatPrefs>, NoInfer<SubchatPrefs>, "volatile">;
/** Host plugin body: register the /sidechat JSON API routes. */
export declare function apply(ctx: Context): void;
