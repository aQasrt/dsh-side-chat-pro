/** One rail thumbnail; strings arrive resolved (zero-cordis atom). */
export interface AttachmentRailItem {
    /** Stable identity for the React key. */
    id: string;
    /** Object or data URL rendered as the thumbnail. */
    previewUrl: string;
    /** Image alt text (display name with the owner's fallback applied). */
    alt: string;
    /** Accessible label of the item's remove control. */
    removeLabel: string;
}
/** Rail-level strings the owner resolves from its own locale namespace. */
export interface AttachmentRailLabels {
    /** Accessible name of the rail group. */
    group: string;
    /** Thumbnail tooltip inviting the original-image preview. */
    open: string;
    /** Accessible label of the left paging arrow. */
    scrollLeft: string;
    /** Accessible label of the right paging arrow. */
    scrollRight: string;
}
/**
 * Horizontal thumbnail rail over the caller's draft attachments.
 *
 * The rail scrolls with its scrollbar hidden; overflow is announced by edge
 * arrows recomputed from scroll geometry on scroll, item-count changes, and
 * rail size changes (a ResizeObserver on the rail element, so sidebar or panel
 * resizes count, not only window resizes). A vertical wheel pans the rail
 * horizontally and is consumed exclusively, a newly added item is revealed at
 * the rail's end, and each thumbnail opens on a single click while its remove
 * control sits inside the card. The owner decides mounting.
 */
export declare function AttachmentRail<T extends AttachmentRailItem>({ items, labels, onOpen, onRemove }: {
    items: readonly T[];
    labels: AttachmentRailLabels;
    onOpen: (item: T) => void;
    onRemove: (item: T) => void;
}): import("react").JSX.Element;
