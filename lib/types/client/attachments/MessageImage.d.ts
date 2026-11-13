import type { SidechatImageRef } from '../api.ts';
import type { ImageLightboxLabels } from './ImageLightbox.tsx';
/** Loads one durable image's bytes into a displayable URL. */
export type ImageLoader = (ref: SidechatImageRef) => Promise<string>;
/** Message-image strings the owner resolves from its own locale namespace. */
export interface MessageImageLabels {
    /** Fallback display name for an unnamed image. */
    image: string;
    /** Thumbnail tooltip inviting the original-image preview. */
    open: string;
    /** Accessible thumbnail label; receives the image's display name. */
    openNamed: (label: string) => string;
    /** Loading placeholder shown until bytes resolve. */
    loading: string;
    /** Retry-control label shown when the load fails. */
    loadFailed: string;
    /** Lightbox strings forwarded to the opened preview. */
    lightbox: ImageLightboxLabels;
}
/**
 * Compact history renderer with retryable loading and click-to-open original
 * preview. A lone image renders at its `singleFit` size; an image among
 * several renders as a fixed 64px square tile.
 */
export declare function MessageImage({ image, load, variant, labels }: {
    image: SidechatImageRef;
    load: ImageLoader;
    variant: 'single' | 'tile';
    labels: MessageImageLabels;
}): import("react").JSX.Element;
/** Wrapping image group: a lone image renders large, several render as 64px
 * square tiles. */
export declare function ImageGallery({ images, load, align, labels }: {
    images: readonly SidechatImageRef[];
    load: ImageLoader;
    align: 'start' | 'end';
    labels: MessageImageLabels;
}): import("react").JSX.Element | null;
