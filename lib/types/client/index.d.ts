import type { Context } from '../context-types.ts';
import './layout.css';
/** Services required before mounting. */
export declare const inject: string[];
/** Client plugin body. */
export declare function apply(ctx: Context): void;
