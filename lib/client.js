window.__ModuleLoader__.load({
	id: "dsh-side-chat-pro",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region \0dsh-css:/home/runner/work/dsh-side-chat/dsh-side-chat/src/client/attachments/AttachmentRail.module.css.mjs
		const css$5 = ".J5tleW_root{align-items:center;min-width:0;display:flex;position:relative}.J5tleW_rail{scrollbar-width:none;gap:8px;padding:2px;display:flex;overflow-x:auto}.J5tleW_rail::-webkit-scrollbar{display:none}.J5tleW_item{flex:none;position:relative}.J5tleW_thumbnail{border:1px solid var(--dsw-color-border,#0000001a);cursor:pointer;background:0 0;border-radius:8px;width:56px;height:56px;padding:0;display:block;overflow:hidden}.J5tleW_thumbnail img{object-fit:cover;width:100%;height:100%}.J5tleW_remove{background:var(--dsw-color-surface-raised,#fff);width:18px;height:18px;color:var(--dsw-color-text-secondary,#646a73);cursor:pointer;opacity:0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:0;display:flex;position:absolute;top:-6px;right:-6px;box-shadow:0 1px 4px #0003}.J5tleW_item:hover .J5tleW_remove,.J5tleW_remove:focus-visible{opacity:1}.J5tleW_arrow{z-index:1;border:1px solid var(--dsw-color-border,#0000001a);background:var(--dsw-color-surface-raised,#fff);width:22px;height:22px;color:var(--dsw-color-text-secondary,#646a73);cursor:pointer;border-radius:50%;justify-content:center;align-items:center;padding:0;display:flex;position:absolute}.J5tleW_arrowLeft{left:-10px}.J5tleW_arrowRight{right:-10px}";
		const tagId$5 = "dsh-side-chat-pro/AttachmentRail.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-side-chat-pro";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		var AttachmentRail_module_css_default = {
			"thumbnail": "J5tleW_thumbnail",
			"root": "J5tleW_root",
			"remove": "J5tleW_remove",
			"item": "J5tleW_item",
			"arrowRight": "J5tleW_arrowRight",
			"arrowLeft": "J5tleW_arrowLeft",
			"rail": "J5tleW_rail",
			"arrow": "J5tleW_arrow"
		};
		//#endregion
		//#region src/client/attachments/AttachmentRail.tsx
		/** Approximate pixels per wheel step for `deltaMode` LINE deltas (Firefox notch wheels report lines). */
		const WHEEL_LINE_PX = 16;
		/** Smooth paging unless the user asked for reduced motion. */
		function pageBehavior() {
			return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
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
		function AttachmentRail({ items, labels, onOpen, onRemove }) {
			const railRef = (0, react.useRef)(null);
			const countRef = (0, react.useRef)(null);
			const [edges, setEdges] = (0, react.useState)({
				left: false,
				right: false
			});
			const updateEdges = (0, react.useCallback)(() => {
				const el = railRef.current;
				if (el === null) return;
				const left = el.scrollLeft > 1;
				const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
				setEdges((prev) => prev.left === left && prev.right === right ? prev : {
					left,
					right
				});
			}, []);
			(0, react.useLayoutEffect)(() => {
				const grew = countRef.current !== null && items.length > countRef.current;
				countRef.current = items.length;
				const el = railRef.current;
				if (el === null) return;
				if (grew) el.scrollLeft = el.scrollWidth - el.clientWidth;
				updateEdges();
			}, [items.length, updateEdges]);
			(0, react.useEffect)(() => {
				const el = railRef.current;
				if (el === null) return;
				let disconnect = () => {};
				if (typeof ResizeObserver !== "undefined") {
					const observer = new ResizeObserver(updateEdges);
					observer.observe(el);
					disconnect = () => {
						observer.disconnect();
					};
				}
				const onWheel = (event) => {
					if (event.deltaY === 0) return;
					const scale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? WHEEL_LINE_PX : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? el.clientWidth : 1;
					event.preventDefault();
					el.scrollBy({
						left: event.deltaX !== 0 ? event.deltaX * scale : Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY) * scale, 60),
						behavior: "auto"
					});
				};
				el.addEventListener("wheel", onWheel, { passive: false });
				return () => {
					disconnect();
					el.removeEventListener("wheel", onWheel);
				};
			}, [updateEdges]);
			const page = (direction) => {
				const el = railRef.current;
				if (el === null) return;
				el.scrollBy({
					left: direction * Math.max(el.clientWidth - 64, 200),
					behavior: pageBehavior()
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AttachmentRail_module_css_default.root,
				children: [
					edges.left && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${AttachmentRail_module_css_default.arrow} ${AttachmentRail_module_css_default.arrowLeft}`,
						"aria-label": labels.scrollLeft,
						onClick: () => {
							page(-1);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutlineRegular, {})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						ref: railRef,
						className: AttachmentRail_module_css_default.rail,
						role: "group",
						"aria-label": labels.group,
						onScroll: updateEdges,
						children: items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: AttachmentRail_module_css_default.item,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: AttachmentRail_module_css_default.thumbnail,
								title: labels.open,
								onClick: () => {
									onOpen(item);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
									src: item.previewUrl,
									alt: item.alt
								})
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: AttachmentRail_module_css_default.remove,
								"aria-label": item.removeLabel,
								onClick: () => {
									onRemove(item);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFillRegular, { size: 12 })
							})]
						}, item.id))
					}),
					edges.right && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${AttachmentRail_module_css_default.arrow} ${AttachmentRail_module_css_default.arrowRight}`,
						"aria-label": labels.scrollRight,
						onClick: () => {
							page(1);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutlineRegular, {})
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:/home/runner/work/dsh-side-chat/dsh-side-chat/src/client/attachments/DropOverlay.module.css.mjs
		const css$4 = "._9H6qrq_mask{z-index:999;pointer-events:none;border:2px dashed var(--dsw-color-border-strong,#4d6bfe);background:#ffffffb8;border-radius:12px;justify-content:center;align-items:center;display:flex;position:fixed;inset:0}._9H6qrq_wrap{text-align:center;flex-direction:column;align-items:center;gap:12px;display:flex}._9H6qrq_illustration{justify-content:center;align-items:center;display:flex}._9H6qrq_title{color:var(--dsw-color-text,#1f2329);font-size:16px;font-weight:600}._9H6qrq_desc{color:var(--dsw-color-text-secondary,#646a73);font-size:13px}";
		const tagId$4 = "dsh-side-chat-pro/DropOverlay.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-side-chat-pro";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var DropOverlay_module_css_default = {
			"wrap": "_9H6qrq_wrap",
			"title": "_9H6qrq_title",
			"desc": "_9H6qrq_desc",
			"mask": "_9H6qrq_mask",
			"illustration": "_9H6qrq_illustration"
		};
		//#endregion
		//#region src/client/attachments/DropOverlay.tsx
		/**
		* Full-viewport invitation shown while a file drag is over the page.
		* Decoration only: `pointer-events: none` keeps drag targeting on the page
		* below, so the owner's document-level listeners keep an accurate enter/leave
		* count and own accept/reject. Rendered through a body portal for the same
		* transformed-ancestor reason as the lightbox.
		*/
		function DropOverlay({ disabled, labels }) {
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: DropOverlay_module_css_default.mask,
				role: "status",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: DropOverlay_module_css_default.wrap,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: DropOverlay_module_css_default.illustration,
							"aria-hidden": "true",
							children: disabled ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlockedIllustration, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UploadIllustration, {})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: DropOverlay_module_css_default.title,
							children: labels.title
						}),
						!disabled && labels.desc !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: DropOverlay_module_css_default.desc,
							children: labels.desc
						})
					]
				})
			}), document.body);
		}
		/** Tilted photo-and-note cards. */
		const UploadIllustration = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: "96",
			height: "72",
			viewBox: "0 0 96 72",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					y: "14",
					width: "38",
					height: "38",
					rx: "10",
					transform: "rotate(-22 0 14)",
					fill: "#9ce5ed"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "62",
					y: "7",
					width: "37",
					height: "43",
					rx: "8",
					transform: "rotate(17 62 7)",
					fill: "#679efe"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "26",
					y: "30",
					width: "38",
					height: "38",
					rx: "10",
					fill: "#3964fe"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M33 62c1-2 4-8 7-14 1-2 5-2 6 1 2 5 5 9 7 10 3 1 7-9 17 2",
					stroke: "#fff",
					strokeWidth: "3",
					fill: "none"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "53",
					cy: "43",
					r: "4",
					fill: "#fff"
				})
			]
		});
		/** Greyed cards with a blocked badge. */
		const BlockedIllustration = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: "96",
			height: "72",
			viewBox: "0 0 96 72",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					y: "14",
					width: "38",
					height: "38",
					rx: "10",
					transform: "rotate(-22 0 14)",
					fill: "#c4c9d0"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "62",
					y: "7",
					width: "37",
					height: "43",
					rx: "8",
					transform: "rotate(17 62 7)",
					fill: "#b0b6be"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "26",
					y: "30",
					width: "38",
					height: "38",
					rx: "10",
					fill: "#d8dce1"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "45",
					cy: "49",
					r: "12",
					stroke: "#fff",
					strokeWidth: "3",
					fill: "none"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M36 40l18 18",
					stroke: "#fff",
					strokeWidth: "3",
					strokeLinecap: "round"
				})
			]
		});
		//#endregion
		//#region \0dsh-css:/home/runner/work/dsh-side-chat/dsh-side-chat/src/client/attachments/ImageLightbox.module.css.mjs
		const css$3 = "._5IyjUq_backdrop{z-index:1000;justify-content:center;align-items:center;padding:32px;display:flex;position:fixed;inset:0}._5IyjUq_mask{background:#000000b8;position:absolute;inset:0}._5IyjUq_image{object-fit:contain;border-radius:8px;max-width:100%;max-height:100%;position:relative}._5IyjUq_close{color:#fff;cursor:pointer;background:#ffffff29;border:none;border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;padding:0;display:flex;position:absolute;top:20px;right:20px}._5IyjUq_close:hover{background:#ffffff47}";
		const tagId$3 = "dsh-side-chat-pro/ImageLightbox.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-side-chat-pro";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var ImageLightbox_module_css_default = {
			"backdrop": "_5IyjUq_backdrop",
			"close": "_5IyjUq_close",
			"mask": "_5IyjUq_mask",
			"image": "_5IyjUq_image"
		};
		//#endregion
		//#region src/client/attachments/ImageLightbox.tsx
		/**
		* Document-level original-image preview opened by clicking a thumbnail.
		* Closes on Escape, backdrop press, or the close control, and restores focus
		* to the opener on unmount. Rendered through a body portal: an opener inside
		* a transformed or filtered ancestor would otherwise trap the fixed backdrop
		* in that ancestor's box instead of covering the viewport.
		*/
		function ImageLightbox({ src, alt, labels, onClose }) {
			const closeRef = (0, react.useRef)(null);
			const restoreRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
				closeRef.current?.focus();
				const onKeyDown = (event) => {
					if (event.key === "Escape") onClose();
				};
				window.addEventListener("keydown", onKeyDown);
				return () => {
					window.removeEventListener("keydown", onKeyDown);
					restoreRef.current?.focus();
				};
			}, [onClose]);
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ImageLightbox_module_css_default.backdrop,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": labels.dialog,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: ImageLightbox_module_css_default.mask,
						"aria-hidden": "true",
						onMouseDown: onClose
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
						className: ImageLightbox_module_css_default.image,
						src,
						alt
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						ref: closeRef,
						type: "button",
						className: ImageLightbox_module_css_default.close,
						"aria-label": labels.close,
						onClick: onClose,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutlineRegular, { size: 16 })
					})
				]
			}), document.body);
		}
		//#endregion
		//#region \0dsh-css:/home/runner/work/dsh-side-chat/dsh-side-chat/src/client/attachments/MessageImage.module.css.mjs
		const css$2 = "._1H6WSq_gallery{flex-wrap:wrap;gap:8px;max-width:100%;display:flex}._1H6WSq_gallery[data-align=start]{justify-content:flex-start}._1H6WSq_gallery[data-align=end]{justify-content:flex-end}._1H6WSq_frame{border:1px solid var(--dsw-color-border,#00000014);cursor:pointer;background:0 0;border-radius:8px;padding:0;overflow:hidden}._1H6WSq_frame[data-variant=tile]{width:64px;height:64px}._1H6WSq_frame img{object-fit:cover;width:100%;height:100%}._1H6WSq_loading{width:100%;min-width:64px;height:100%;min-height:64px;color:var(--dsw-color-text-secondary,#646a73);justify-content:center;align-items:center;font-size:12px;display:flex}._1H6WSq_error{border:1px dashed var(--dsw-color-border,#00000029);min-width:64px;min-height:64px;color:var(--dsw-color-text-secondary,#646a73);cursor:pointer;background:0 0;border-radius:8px;justify-content:center;align-items:center;padding:0 8px;font-size:12px;display:flex}";
		const tagId$2 = "dsh-side-chat-pro/MessageImage.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-side-chat-pro";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var MessageImage_module_css_default = {
			"frame": "_1H6WSq_frame",
			"loading": "_1H6WSq_loading",
			"gallery": "_1H6WSq_gallery",
			"error": "_1H6WSq_error"
		};
		//#endregion
		//#region src/client/attachments/MessageImage.tsx
		/** Display box for a lone image: long edge 240px with the rendered aspect
		* ratio clamped to [0.25, 4] — the overflow is cropped by
		* `object-fit: cover` — and never upscaled past the image's natural size. The
		* crop anchor keeps the top of very tall images and the left of very wide
		* ones, where the informative content usually starts. */
		function singleFit(dimensions) {
			const natural = dimensions.width / dimensions.height;
			const ratio = Math.min(4, Math.max(.25, natural));
			const box = ratio >= 1 ? {
				width: 240,
				height: 240 / ratio
			} : {
				width: 240 * ratio,
				height: 240
			};
			const scale = Math.min(1, dimensions.width / box.width, dimensions.height / box.height);
			return {
				width: Math.max(1, Math.round(box.width * scale)),
				height: Math.max(1, Math.round(box.height * scale)),
				objectPosition: natural < .25 ? "center top" : natural > 4 ? "left center" : "center"
			};
		}
		/**
		* Compact history renderer with retryable loading and click-to-open original
		* preview. A lone image renders at its `singleFit` size; an image among
		* several renders as a fixed 64px square tile.
		*/
		function MessageImage({ image, load, variant, labels }) {
			const [loaded, setLoaded] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(false);
			const [open, setOpen] = (0, react.useState)(false);
			const [attempt, setAttempt] = (0, react.useState)(0);
			const request = (0, react.useCallback)(() => {
				setAttempt((a) => a + 1);
			}, []);
			const close = (0, react.useCallback)(() => {
				setOpen(false);
			}, []);
			const label = image.name === void 0 || image.name === "" ? labels.image : image.name;
			const fit = (0, react.useMemo)(() => variant === "single" ? singleFit(image) : void 0, [image, variant]);
			(0, react.useEffect)(() => {
				let live = true;
				setError(false);
				setLoaded(null);
				load(image).then((url) => {
					if (live) setLoaded(url);
				}).catch(() => {
					if (live) setError(true);
				});
				return () => {
					live = false;
				};
			}, [
				image,
				load,
				attempt
			]);
			if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: MessageImage_module_css_default.error,
				"data-variant": variant,
				onClick: request,
				children: labels.loadFailed
			});
			const src = loaded;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: MessageImage_module_css_default.frame,
				"data-variant": variant,
				style: fit === void 0 ? void 0 : {
					width: fit.width,
					height: fit.height
				},
				title: labels.open,
				"aria-label": labels.openNamed(label),
				onClick: () => {
					if (src !== null) setOpen(true);
				},
				children: src === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: MessageImage_module_css_default.loading,
					children: labels.loading
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
					src,
					alt: label,
					style: fit === void 0 ? void 0 : { objectPosition: fit.objectPosition }
				})
			}), open && src !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImageLightbox, {
				src,
				alt: label,
				labels: labels.lightbox,
				onClose: close
			})] });
		}
		/** Wrapping image group: a lone image renders large, several render as 64px
		* square tiles. */
		function ImageGallery({ images, load, align, labels }) {
			if (images.length === 0) return null;
			const variant = images.length === 1 ? "single" : "tile";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: MessageImage_module_css_default.gallery,
				"data-align": align,
				children: images.map((image, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MessageImage, {
					image,
					load,
					variant,
					labels
				}, `${image.attachmentId}:${index}`))
			});
		}
		//#endregion
		//#region \0dsh-css:/home/runner/work/dsh-side-chat/dsh-side-chat/src/client/client.module.css.mjs
		const css$1 = ".yw4T5a_selectionMenu{z-index:2147483000;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l3);box-shadow:0 4px 16px var(--dsw-alias-bg-mask-2);pointer-events:auto;border-radius:10px;gap:4px;padding:4px;display:flex;position:fixed;transform:translate(-50%)}.yw4T5a_selectionButton{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-primary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-radius:7px;padding:6px 10px;font-size:13px;line-height:20px}.yw4T5a_selectionButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_selectionButton:disabled{cursor:default;opacity:.55}.yw4T5a_panel{width:var(--dsh-subchat-width,360px);z-index:2147482990;background:var(--dsw-specific-sidebar-fill);border-left:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);pointer-events:auto;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;font-size:14px;display:flex;position:fixed;top:0;bottom:0;right:0}.yw4T5a_panelEmbedded{border-left:none;border-radius:0;width:100%;position:absolute;inset:0}.yw4T5a_panelConflictHidden{pointer-events:none;transform:translate(calc(100% + 24px))}.yw4T5a_panelResize{cursor:col-resize;z-index:2;touch-action:none;width:8px;position:absolute;top:0;bottom:0;left:-4px}.yw4T5a_panelHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;align-items:center;padding:12px 14px;display:flex}.yw4T5a_panelTitle{font-weight:600}.yw4T5a_panelHeaderActions{align-items:center;gap:4px;display:flex}.yw4T5a_panelIconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:999px;place-items:center;display:grid}.yw4T5a_panelIconButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.yw4T5a_panelClose{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:6px;padding:4px 8px;font-size:13px}.yw4T5a_panelClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.yw4T5a_collapsedHandle{z-index:2147482990;width:32px;height:32px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;box-shadow:var(--dsw-shadow-lv2);border-radius:999px;place-items:center;display:grid;position:fixed;top:50%;right:8px;transform:translateY(-50%)}.yw4T5a_collapsedHandle:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_questionFab{z-index:2147482990;width:32px;height:32px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-state-business-primary);cursor:pointer;box-shadow:var(--dsw-shadow-lv2);border-radius:999px;place-items:center;display:grid;position:fixed}.yw4T5a_questionFab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_questionFabDot{background:var(--dsw-alias-state-business-primary);border-radius:50%;width:8px;height:8px;position:absolute;top:4px;right:4px}.yw4T5a_questionBlock{border-bottom:1px solid var(--dsw-alias-border-l1);flex-direction:column;flex:none;gap:8px;max-height:40%;padding:8px;display:flex;overflow-y:auto}.yw4T5a_questionBlockActions{justify-content:space-between;align-items:center;display:flex}.yw4T5a_questionToggle{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:6px;padding:2px 6px;font-size:12px;line-height:18px}.yw4T5a_questionToggle:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_questionDeleteAll{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:6px;padding:2px 6px;font-size:12px;line-height:18px}.yw4T5a_questionDeleteAll:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_questionItemCollapsed{gap:0;padding:8px 12px}.yw4T5a_questionItem{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);border-radius:12px;flex-direction:column;gap:6px;padding:10px 12px;display:flex}.yw4T5a_questionHeader{justify-content:space-between;align-items:center;gap:8px;display:flex}.yw4T5a_questionHeaderText{min-width:0;color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:13px;font-weight:600;line-height:20px;overflow:hidden}.yw4T5a_questionHeaderActions{flex:none;align-items:center;gap:4px;display:flex}.yw4T5a_questionBody{color:var(--dsw-alias-label-primary);white-space:pre-wrap;word-break:break-word;font-size:14px;line-height:22px}.yw4T5a_questionDetail{color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:18px}.yw4T5a_questionOption{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;justify-content:space-between;align-items:center;gap:8px;padding:6px 8px 6px 10px;display:flex}.yw4T5a_questionOptionText{min-width:0;color:var(--dsw-alias-label-primary);word-break:break-word;flex:1;font-size:13px;line-height:20px}.yw4T5a_questionOptionLabel{font-weight:500}.yw4T5a_questionOptionDesc{color:var(--dsw-alias-label-secondary)}.yw4T5a_questionBringButton{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;white-space:nowrap;background:0 0;border-radius:999px;flex:none;padding:2px 10px;font-size:12px;line-height:18px}.yw4T5a_questionBringButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_questionBringButton:disabled{cursor:default;opacity:.55}.yw4T5a_questionDelete{width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:6px;flex:none;place-items:center;font-size:14px;line-height:20px;display:grid}.yw4T5a_questionDelete:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_panelList{border-bottom:1px solid var(--dsw-alias-border-l1);flex-direction:column;flex:none;gap:2px;max-height:132px;padding:8px;display:flex;overflow-y:auto}.yw4T5a_panelEmpty{color:var(--dsw-alias-label-tertiary);padding:6px 8px;font-size:12px;line-height:18px}.yw4T5a_panelListActions{justify-content:flex-end;padding:0 2px 2px;display:flex}.yw4T5a_panelListDeleteAll{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:6px;padding:2px 6px;font-size:12px;line-height:18px}.yw4T5a_panelListDeleteAll:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_panelListItem{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-primary);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:8px;align-items:center;gap:8px;padding:6px 8px;display:flex}.yw4T5a_panelListItem:hover{background:var(--dsw-specific-sidebar-nav-item-hover)}.yw4T5a_panelListItemActive{background:var(--dsw-specific-sidebar-nav-item-active)}.yw4T5a_panelListItemDot{background:var(--dsw-alias-label-tertiary);border-radius:50%;flex:none;width:8px;height:8px}.yw4T5a_panelListItemDot[data-running=\"1\"]{background:var(--dsw-alias-state-business-primary)}.yw4T5a_panelListItemLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;font-size:12px;font-family:var(--ds-font-family-code);overflow:hidden}.yw4T5a_panelListItemRow{align-items:center;gap:2px;display:flex}.yw4T5a_panelListItemRow .yw4T5a_panelListItem{flex:1;min-width:0}.yw4T5a_panelListItemRemove{width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:6px;flex:none;place-items:center;font-size:14px;line-height:20px;display:grid}.yw4T5a_panelListItemRemove:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_panelTranscript{flex-direction:column;flex:1;gap:10px;min-height:0;padding:14px;display:flex;overflow-y:auto}.yw4T5a_messageUser{background:var(--dsw-specific-bubble);color:var(--dsw-alias-label-primary);white-space:pre-wrap;word-break:break-word;border-radius:22px;align-self:flex-end;max-width:86%;padding:10px 16px;font-size:16px;line-height:24px}.yw4T5a_messageAssistant{min-width:0;max-width:100%;color:var(--dsw-alias-label-primary);align-self:flex-start}.yw4T5a_messageActions{gap:6px;margin-top:6px;display:flex}.yw4T5a_messageInsertButton{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);cursor:pointer;background:0 0;border-radius:999px;padding:2px 10px;font-size:12px;line-height:18px}.yw4T5a_messageInsertButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.yw4T5a_messageInsertButton:disabled{cursor:default;opacity:.55}.yw4T5a_reasoningSummary{min-width:0;color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:24px;overflow:hidden}.yw4T5a_reasoningBody{color:var(--dsw-alias-label-tertiary);white-space:pre-wrap;word-break:break-word;padding:4px 0 4px 22px;font-size:14px;line-height:24px}.yw4T5a_panelRunning{color:var(--dsw-alias-label-tertiary);align-self:flex-start;align-items:center;gap:6px;font-size:12px;line-height:18px;display:inline-flex}.yw4T5a_panelRunningDot{background:var(--dsw-alias-state-business-primary);border-radius:50%;flex:none;width:8px;height:8px;animation:1s ease-in-out infinite alternate yw4T5a_panelRunningPulse}.yw4T5a_panelRunningClock{color:var(--dsw-alias-label-caption)}@keyframes yw4T5a_panelRunningPulse{0%{opacity:1}to{opacity:.3}}@media (prefers-reduced-motion:reduce){.yw4T5a_panelRunningDot{animation:none}}.yw4T5a_panelError{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px}.yw4T5a_panelComposer{border:1px solid var(--dsw-alias-border-l2-darkmode-thin);background:var(--dsw-specific-input-major);box-shadow:var(--dsw-shadow-lv2);border-radius:22px;flex-direction:column;flex:none;gap:4px;margin:10px 14px 14px;padding:10px;display:flex}.yw4T5a_panelToolbar{flex:none;justify-content:flex-end;align-items:center;gap:4px;min-width:0;display:flex}.yw4T5a_panelTextarea{box-sizing:border-box;resize:none;width:100%;min-width:0;color:var(--dsw-alias-label-primary);caret-color:var(--dsw-alias-state-business-primary);font-family:var(--dsw-font-family);background:0 0;border:none;outline:none;flex:1;min-height:32px;max-height:160px;padding:4px 8px;font-size:16px;line-height:24px}.yw4T5a_panelLookup{max-width:100%;height:24px;color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;border-radius:24px;align-self:flex-start;align-items:center;gap:6px;padding:0 8px;font-size:12px;font-weight:500;line-height:18px;display:inline-flex}.yw4T5a_panelLookup span{text-overflow:ellipsis;min-width:0;overflow:hidden}.yw4T5a_panelLookup:hover{background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_panelAttachment{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-tip);border-radius:10px;align-items:center;gap:8px;padding:6px 10px;display:flex}.yw4T5a_panelAttachmentText{min-width:0;color:var(--dsw-alias-label-secondary);white-space:nowrap;text-overflow:ellipsis;flex:1;font-size:12px;line-height:18px;overflow:hidden}.yw4T5a_panelAttachmentRemove{width:20px;height:20px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:999px;flex:none;font-size:16px;line-height:20px}.yw4T5a_panelAttachmentRemove:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.yw4T5a_panelFooter{flex:none;padding:0 14px 12px}.yw4T5a_panelDispose{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;padding:4px 0;font-size:12px;line-height:18px}.yw4T5a_panelDispose:hover{color:var(--dsw-alias-state-error-primary)}.yw4T5a_primary{background:var(--dsw-alias-button-info-fill);color:#fff;cursor:pointer;border:none;border-radius:999px;flex:none;place-items:center;width:34px;height:34px;transition:background-color .1s;display:grid}.yw4T5a_primary:hover{background:var(--dsw-alias-button-info-hover)}.yw4T5a_panelAttachmentRail{flex:none;min-width:0}.yw4T5a_messageUserText{white-space:pre-wrap;word-break:break-word}.yw4T5a_modelSelect{min-width:0;position:relative}.yw4T5a_modelSelectTrigger{min-width:0;max-width:200px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:24px;outline:none;align-items:center;gap:4px;padding:0 4px 0 8px;font-size:13px;font-weight:500;line-height:20px;display:flex}.yw4T5a_modelSelectTrigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_modelSelectLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.yw4T5a_modelSelectEffort{color:var(--dsw-alias-label-caption);flex:none}.yw4T5a_chevronOpen{transform:rotate(180deg)}.yw4T5a_modelSelectMenu{z-index:30;border:1px solid var(--dsw-alias-border-inverted);background:var(--dsw-specific-menu);width:min(260px,100vw - 32px);max-height:min(360px,100vh - 96px);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);border-radius:12px;flex-direction:column;padding:4px;display:flex;position:absolute;bottom:calc(100% + 8px);right:0;overflow:hidden}.yw4T5a_modelCell{width:100%;height:40px;color:var(--dsw-alias-label-primary);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:10px;flex:none;align-items:center;gap:8px;padding:0 10px;font-size:14px;line-height:22px;display:flex}.yw4T5a_modelCell:hover{background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_modelCellLabel{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;overflow:hidden}.yw4T5a_modelCellValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-tertiary);flex:0 auto;overflow:hidden}.yw4T5a_modelCellChevron{color:var(--dsw-alias-label-tertiary);flex:none}.yw4T5a_modelGroups{min-height:0;overflow-y:auto}.yw4T5a_modelGroup+.yw4T5a_modelGroup{margin-top:4px}.yw4T5a_modelGroupTitle{z-index:1;background:var(--dsw-specific-menu);color:var(--dsw-alias-label-tertiary);padding:5px 8px 3px;font-size:12px;font-weight:500;line-height:18px;position:sticky;top:0}.yw4T5a_modelOption{width:100%;min-height:38px;color:inherit;text-align:left;cursor:pointer;background:0 0;border:none;border-radius:10px;outline:none;align-items:center;gap:8px;padding:6px 8px;display:flex}.yw4T5a_modelOption:hover:not(:disabled),.yw4T5a_modelOptionSelected{background:var(--dsw-alias-interactive-bg-hover)}.yw4T5a_modelOptionCopy{flex-direction:column;flex:1;min-width:0;display:flex}.yw4T5a_modelName{color:inherit;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:500;line-height:20px;overflow:hidden}.yw4T5a_modelDescription{color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;overflow:hidden}.yw4T5a_modelCheck{color:var(--dsw-alias-label-primary);flex:0 0 18px;place-items:center;display:grid}.yw4T5a_modelEmpty{color:var(--dsw-alias-label-tertiary);padding:10px;font-size:13px;line-height:20px}.yw4T5a_settingsSection{flex-direction:column;gap:8px;display:flex}.yw4T5a_settingsRow{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);cursor:pointer;border-radius:12px;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;display:flex}.yw4T5a_settingsRowText{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.yw4T5a_settingsRowTitle{color:var(--dsw-alias-label-primary);font-size:14px;line-height:20px}.yw4T5a_settingsRowDesc{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.yw4T5a_settingsToggle{width:16px;height:16px;accent-color:var(--dsw-alias-state-business-primary);flex:none}.yw4T5a_settingsBringMode{flex-direction:column;gap:8px;display:flex}.yw4T5a_settingsBringOption{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);cursor:pointer;border-radius:12px;align-items:flex-start;gap:12px;padding:10px 12px;display:flex}.yw4T5a_settingsBringOptionActive{border-color:var(--dsw-alias-state-business-primary)}.yw4T5a_settingsPromptInput{box-sizing:border-box;resize:vertical;width:100%;min-height:72px;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);font-family:var(--dsw-font-family);border-radius:10px;padding:8px 10px;font-size:13px;line-height:20px}.yw4T5a_settingsPromptInput:focus{outline:2px solid var(--dsw-alias-border-l3);outline-offset:-1px}.yw4T5a_renderFailure{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-state-error-primary);font-family:var(--dsw-font-family);border-radius:12px;flex-direction:column;gap:6px;margin:12px;padding:12px 14px;font-size:13px;line-height:20px;display:flex}.yw4T5a_renderFailure code{color:var(--dsw-alias-label-tertiary);white-space:pre-wrap;word-break:break-word;font-size:12px}";
		const tagId$1 = "dsh-side-chat-pro/client.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-side-chat-pro";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var client_module_css_default = {
			"modelName": "yw4T5a_modelName",
			"settingsRow": "yw4T5a_settingsRow",
			"panelAttachmentText": "yw4T5a_panelAttachmentText",
			"modelSelect": "yw4T5a_modelSelect",
			"panelHeaderActions": "yw4T5a_panelHeaderActions",
			"panelAttachmentRail": "yw4T5a_panelAttachmentRail",
			"panelListItemDot": "yw4T5a_panelListItemDot",
			"questionItem": "yw4T5a_questionItem",
			"questionDetail": "yw4T5a_questionDetail",
			"modelEmpty": "yw4T5a_modelEmpty",
			"primary": "yw4T5a_primary",
			"renderFailure": "yw4T5a_renderFailure",
			"questionOption": "yw4T5a_questionOption",
			"modelSelectMenu": "yw4T5a_modelSelectMenu",
			"questionDeleteAll": "yw4T5a_questionDeleteAll",
			"selectionMenu": "yw4T5a_selectionMenu",
			"panelRunningPulse": "yw4T5a_panelRunningPulse",
			"modelSelectTrigger": "yw4T5a_modelSelectTrigger",
			"settingsToggle": "yw4T5a_settingsToggle",
			"panelConflictHidden": "yw4T5a_panelConflictHidden",
			"questionHeaderText": "yw4T5a_questionHeaderText",
			"panelListDeleteAll": "yw4T5a_panelListDeleteAll",
			"settingsBringOptionActive": "yw4T5a_settingsBringOptionActive",
			"panelEmbedded": "yw4T5a_panelEmbedded",
			"panel": "yw4T5a_panel",
			"panelClose": "yw4T5a_panelClose",
			"panelTextarea": "yw4T5a_panelTextarea",
			"settingsBringMode": "yw4T5a_settingsBringMode",
			"selectionButton": "yw4T5a_selectionButton",
			"questionBlock": "yw4T5a_questionBlock",
			"questionOptionDesc": "yw4T5a_questionOptionDesc",
			"modelOptionCopy": "yw4T5a_modelOptionCopy",
			"settingsSection": "yw4T5a_settingsSection",
			"panelEmpty": "yw4T5a_panelEmpty",
			"panelTitle": "yw4T5a_panelTitle",
			"messageAssistant": "yw4T5a_messageAssistant",
			"settingsBringOption": "yw4T5a_settingsBringOption",
			"questionFabDot": "yw4T5a_questionFabDot",
			"messageUserText": "yw4T5a_messageUserText",
			"messageActions": "yw4T5a_messageActions",
			"panelAttachment": "yw4T5a_panelAttachment",
			"panelDispose": "yw4T5a_panelDispose",
			"questionToggle": "yw4T5a_questionToggle",
			"reasoningBody": "yw4T5a_reasoningBody",
			"panelComposer": "yw4T5a_panelComposer",
			"collapsedHandle": "yw4T5a_collapsedHandle",
			"panelResize": "yw4T5a_panelResize",
			"panelLookup": "yw4T5a_panelLookup",
			"questionFab": "yw4T5a_questionFab",
			"panelHeader": "yw4T5a_panelHeader",
			"panelAttachmentRemove": "yw4T5a_panelAttachmentRemove",
			"modelSelectEffort": "yw4T5a_modelSelectEffort",
			"modelOption": "yw4T5a_modelOption",
			"panelListItemActive": "yw4T5a_panelListItemActive",
			"reasoningSummary": "yw4T5a_reasoningSummary",
			"panelRunning": "yw4T5a_panelRunning",
			"panelListItemLabel": "yw4T5a_panelListItemLabel",
			"questionHeaderActions": "yw4T5a_questionHeaderActions",
			"panelRunningDot": "yw4T5a_panelRunningDot",
			"questionOptionText": "yw4T5a_questionOptionText",
			"modelDescription": "yw4T5a_modelDescription",
			"panelListItem": "yw4T5a_panelListItem",
			"settingsRowDesc": "yw4T5a_settingsRowDesc",
			"modelGroup": "yw4T5a_modelGroup",
			"chevronOpen": "yw4T5a_chevronOpen",
			"questionBringButton": "yw4T5a_questionBringButton",
			"panelListItemRow": "yw4T5a_panelListItemRow",
			"modelGroupTitle": "yw4T5a_modelGroupTitle",
			"panelToolbar": "yw4T5a_panelToolbar",
			"modelGroups": "yw4T5a_modelGroups",
			"panelRunningClock": "yw4T5a_panelRunningClock",
			"messageUser": "yw4T5a_messageUser",
			"panelListActions": "yw4T5a_panelListActions",
			"modelCheck": "yw4T5a_modelCheck",
			"panelListItemRemove": "yw4T5a_panelListItemRemove",
			"panelTranscript": "yw4T5a_panelTranscript",
			"panelFooter": "yw4T5a_panelFooter",
			"modelCell": "yw4T5a_modelCell",
			"modelSelectLabel": "yw4T5a_modelSelectLabel",
			"modelCellLabel": "yw4T5a_modelCellLabel",
			"settingsRowText": "yw4T5a_settingsRowText",
			"settingsPromptInput": "yw4T5a_settingsPromptInput",
			"settingsRowTitle": "yw4T5a_settingsRowTitle",
			"panelList": "yw4T5a_panelList",
			"messageInsertButton": "yw4T5a_messageInsertButton",
			"questionOptionLabel": "yw4T5a_questionOptionLabel",
			"modelCellChevron": "yw4T5a_modelCellChevron",
			"questionItemCollapsed": "yw4T5a_questionItemCollapsed",
			"panelIconButton": "yw4T5a_panelIconButton",
			"questionBody": "yw4T5a_questionBody",
			"questionHeader": "yw4T5a_questionHeader",
			"questionBlockActions": "yw4T5a_questionBlockActions",
			"questionDelete": "yw4T5a_questionDelete",
			"panelError": "yw4T5a_panelError",
			"modelOptionSelected": "yw4T5a_modelOptionSelected",
			"modelCellValue": "yw4T5a_modelCellValue"
		};
		//#endregion
		//#region src/client/ErrorBoundary.tsx
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
		/** Render-level guard around one mounted side-chat surface. */
		var SidechatErrorBoundary = class extends react.Component {
			state = { failure: null };
			static getDerivedStateFromError(failure) {
				return { failure };
			}
			componentDidCatch(failure, info) {
				console.error(`[dsh-side-chat] ${this.props.label} failed to render against this DSH runtime:`, failure instanceof Error ? failure.message : String(failure), info.componentStack ?? "");
			}
			render() {
				if (this.state.failure === null) return this.props.children;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: client_module_css_default.renderFailure,
					"data-dsh-side-chat-failure": this.props.label,
					role: "alert",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "侧边聊天无法在此 DSH 版本上渲染 / Side chat cannot render on this DSH build" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "请把 dsh-side-chat-pro 升级到与当前 DSH 匹配的版本，或重载插件。 / Update dsh-side-chat-pro to a release built for this DSH, then reload the plugin." }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: this.state.failure instanceof Error ? this.state.failure.message : String(this.state.failure) })
					]
				});
			}
		};
		//#endregion
		//#region src/client/api.ts
		/** Call one /sidechat/api method. */
		async function call(method, payload) {
			return await (await fetch(`/sidechat/api/${method}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload)
			})).json();
		}
		const api = {
			start: (args) => call("sidechat.start", args),
			followup: (args) => call("sidechat.followup", args),
			list: (args) => call("sidechat.list", args),
			attach: (args) => call("sidechat.attach", args),
			history: (args) => call("sidechat.history", args),
			stop: (args) => call("sidechat.stop", args),
			selectModel: (args) => call("sidechat.selectModel", args),
			selectPermission: (args) => call("sidechat.selectPermission", args),
			summarize: (args) => call("sidechat.summarize", args),
			assist: (args) => call("sidechat.assist", args),
			inject: (args) => call("sidechat.inject", args),
			directory: () => call("sidechat.directory", {}),
			permissions: () => call("sidechat.permissions", {}),
			limits: () => call("sidechat.limits", {}),
			attachment: (args) => call("sidechat.attachment", args),
			inherit: (args) => call("sidechat.inherit", args),
			commands: (args) => call("sidechat.commands", args),
			command: (args) => call("sidechat.command", args),
			state: (args) => call("sidechat.state", args),
			settingsGet: () => call("settings.get", {}),
			settingsUpdate: (patch, expectedRevision) => call("settings.update", {
				patch,
				expectedRevision
			}),
			dispose: (args) => call("sidechat.dispose", args)
		};
		//#endregion
		//#region src/client/locales.ts
		/**
		* Client locale dictionaries for dsh-side-chat (zh + en), registered under the
		* `sidechat` namespace.
		*/
		const LOCALE_NS = "sidechat";
		const zh = {
			"ask.new": "在侧边聊天中提问",
			"assist.translate": "翻译",
			"assist.explain": "名词解释",
			"assist.loading": "生成中…",
			"assist.copy": "复制",
			"assist.close": "关闭",
			"ask.continue": "继续在激活的侧边聊天中提问",
			"panel.title": "侧边聊天",
			"panel.empty": "当前会话还没有侧边聊天。选中消息文本后点「在侧边聊天中提问」即可发起。",
			"panel.new": "新建侧边聊天",
			"panel.close": "关闭",
			"panel.input.placeholder": "输入消息，回车发送",
			"panel.send": "发送",
			"panel.stop": "停止",
			"panel.lookup": "需要时从工作区 / 主会话查信息",
			"panel.model": "模型",
			"panel.provider": "服务商",
			"panel.effort": "思考难度",
			"panel.permission": "权限",
			"panel.noModel": "（继承）",
			"panel.effortDefault": "默认",
			"panel.expand": "展开侧边聊天",
			"panel.collapse": "收起侧边聊天",
			"panel.dispose": "结束此侧边聊天",
			"panel.delete": "删除",
			"panel.deleteAll": "删除全部",
			"panel.error": "侧边聊天出错",
			"panel.running": "思考中…",
			"panel.copy": "复制",
			"panel.copied": "已复制",
			"panel.footnotes": "脚注",
			"panel.think": "思考",
			"panel.commands": "命令",
			"command.model": "/model 模型",
			"command.permission": "/permission 权限",
			"plan.chipTitle": "计划模式已开启 — 点击关闭（/plan off）",
			"plan.chipAria": "计划模式已开启，按下关闭",
			"goal.label": "目标",
			"image.railGroup": "图片附件",
			"image.railOpen": "查看原图",
			"image.railScrollLeft": "向左滚动",
			"image.railScrollRight": "向右滚动",
			"image.remove": "移除图片",
			"image.label": "图片",
			"image.open": "查看原图",
			"image.loading": "加载中…",
			"image.loadFailed": "加载失败",
			"image.lightboxDialog": "图片预览",
			"image.close": "关闭",
			"image.dropTitle": "拖放图片到此处",
			"image.dropDesc": "支持 PNG / JPEG / WebP / GIF",
			"image.unsupported": "不支持的图片格式",
			"image.tooMany": "图片数量超出限制",
			"image.fileTooLarge": "图片过大",
			"image.dimensionTooLarge": "图片尺寸超出限制",
			"settingsNav": "侧边聊天",
			"settings.lookupTitle": "默认勾选「需要时从工作区 / 主会话查信息」",
			"settings.lookupDesc": "新会话的侧边聊天默认打开此开关；可在每次聊天中临时更改",
			"settings.sendImmediatelyTitle": "选中内容后立即发送",
			"settings.sendImmediatelyDesc": "关闭后，选中的内容会作为附件先放进侧边聊天输入框，由你确认后再发送",
			"settings.defaultPromptTitle": "默认用户提示词",
			"settings.defaultPromptDesc": "「立即发送」开启时，选中的内容会自动附加这段提示词，让回答更符合你的需求",
			"settings.defaultPromptPlaceholder": "例如：请用中文回答，并尽量简洁…",
			"settings.bringModeTitle": "带回内容的方式",
			"settings.bringModeDesc": "把侧边聊天的 AI 回复带回主会话时，内容落在哪里（两种方式都不会立即发送）",
			"settings.bringModeDraftTitle": "写入输入框草稿",
			"settings.bringModeDraftDesc": "内容进入主会话输入框，可直接编辑后再发送",
			"settings.bringModeContextTitle": "注入为折叠提示行",
			"settings.bringModeContextDesc": "内容作为一条折叠的上下文提示行注入主会话（带来源标记），不写输入框；下次对话时模型可见",
			"settings.panelHomeTitle": "侧边聊天面板位置",
			"settings.panelHomeDesc": "浮动面板固定在窗口右缘；停靠模式把侧聊放进新版右侧栏（与文档预览同一区域），两种模式都不会与内置右侧栏互相遮挡",
			"settings.panelHomeFloatingTitle": "浮动面板（经典）",
			"settings.panelHomeFloatingDesc": "固定在窗口右缘，可拖拽调宽、独立收起",
			"settings.panelHomeDockTitle": "停靠到右侧栏",
			"settings.panelHomeDockDesc": "作为「侧边聊天」标签停靠在新版右侧栏，与文档预览共用同一边栏",
			"dock.title": "侧边聊天",
			"dock.unavailable": "当前部署未提供新版右侧栏，已回退为浮动面板",
			"dock.openFailed": "无法打开右侧栏侧边标签",
			"insert.direct": "直接带回",
			"insert.summarize": "摘要后带回",
			"insert.summarizing": "摘要中…",
			"insert.failed": "无法写入主会话输入框",
			"insert.summarizeFailed": "摘要失败",
			"insert.contextSummary": "侧边聊天带回",
			"insert.summarizeContextSummary": "侧边聊天摘要",
			"question.options": "可选选项",
			"question.option": "选项",
			"question.bringAll": "带入全部",
			"question.bringAllNew": "新会话全部",
			"question.bringOne": "带入",
			"question.bringOneNew": "新会话",
			"question.bringing": "带入中…",
			"question.failed": "带入侧边聊天失败",
			"question.delete": "删除",
			"question.deleteAll": "删除全部",
			"question.collapse": "折叠",
			"question.expand": "展开",
			"question.allPrompt": "请帮我理解上面的问题和各个选项的含义，并给出选择建议。",
			"question.onePrompt": "请帮我理解这个选项的含义，以及它在这个问题中的利弊。",
			"question.openHint": "主会话有一个问题弹框，点击在侧边聊天里询问"
		};
		const en = {
			"ask.new": "Ask in side chat",
			"assist.translate": "Translate",
			"assist.explain": "Explain",
			"assist.loading": "Generating…",
			"assist.copy": "Copy",
			"assist.close": "Close",
			"ask.continue": "Continue active side chat",
			"panel.title": "Side chat",
			"panel.empty": "No side chat for this conversation yet. Select some message text and choose \"Ask in side chat\".",
			"panel.new": "New side chat",
			"panel.close": "Close",
			"panel.input.placeholder": "Type a message, Enter to send",
			"panel.send": "Send",
			"panel.stop": "Stop",
			"panel.lookup": "Look up workspace / parent when needed",
			"panel.model": "Model",
			"panel.provider": "Provider",
			"panel.effort": "Effort",
			"panel.permission": "Permission",
			"panel.noModel": "(inherited)",
			"panel.effortDefault": "Default",
			"panel.expand": "Expand side chat",
			"panel.collapse": "Collapse side chat",
			"panel.dispose": "End this side chat",
			"panel.delete": "Delete",
			"panel.deleteAll": "Delete all",
			"panel.error": "Side chat error",
			"panel.running": "Thinking…",
			"panel.copy": "Copy",
			"panel.copied": "Copied",
			"panel.footnotes": "Footnotes",
			"panel.think": "Think",
			"panel.commands": "Commands",
			"command.model": "/model Model",
			"command.permission": "/permission Permission",
			"plan.chipTitle": "Plan mode on — click to turn off (/plan off)",
			"plan.chipAria": "Plan mode on, press to turn off",
			"goal.label": "Goal",
			"image.railGroup": "Image attachments",
			"image.railOpen": "Open original",
			"image.railScrollLeft": "Scroll left",
			"image.railScrollRight": "Scroll right",
			"image.remove": "Remove image",
			"image.label": "Image",
			"image.open": "Open original",
			"image.loading": "Loading…",
			"image.loadFailed": "Load failed",
			"image.lightboxDialog": "Image preview",
			"image.close": "Close",
			"image.dropTitle": "Drop images here",
			"image.dropDesc": "PNG / JPEG / WebP / GIF",
			"image.unsupported": "Unsupported image type",
			"image.tooMany": "Too many images",
			"image.fileTooLarge": "Image too large",
			"image.dimensionTooLarge": "Image dimensions exceed the limit",
			"settingsNav": "Side chat",
			"settings.lookupTitle": "Default on: \"look up workspace / parent when needed\"",
			"settings.lookupDesc": "New conversations start with this switch on; you can still change it per chat",
			"settings.sendImmediatelyTitle": "Send selected text immediately",
			"settings.sendImmediatelyDesc": "When off, the selection is staged as an attachment in the composer for you to confirm before sending",
			"settings.defaultPromptTitle": "Default prompt",
			"settings.defaultPromptDesc": "When \"send immediately\" is on, this prompt is appended to the selection so the answer matches your needs",
			"settings.defaultPromptPlaceholder": "e.g. Answer in Chinese and keep it concise…",
			"settings.bringModeTitle": "Bring-back target",
			"settings.bringModeDesc": "Where a side-chat AI reply lands when brought back (neither mode sends immediately)",
			"settings.bringModeDraftTitle": "Into the composer draft",
			"settings.bringModeDraftDesc": "Text lands in the main composer so you can edit before sending",
			"settings.bringModeContextTitle": "As a collapsed context row",
			"settings.bringModeContextDesc": "Text is injected as a collapsed, source-tagged context row — not into the composer; the model sees it next turn",
			"settings.panelHomeTitle": "Side-chat panel location",
			"settings.panelHomeDesc": "The classic panel floats on the window’s right edge; dock mode puts the side chat inside the new right sidebar (the same rail as document previews). Neither mode covers the built-in sidebar",
			"settings.panelHomeFloatingTitle": "Floating panel (classic)",
			"settings.panelHomeFloatingDesc": "Fixed to the window’s right edge; drag to resize and collapse independently",
			"settings.panelHomeDockTitle": "Dock in the right sidebar",
			"settings.panelHomeDockDesc": "Lives as a \"Side chat\" tab in the new right sidebar, sharing the rail with document previews",
			"dock.title": "Side chat",
			"dock.unavailable": "This deployment has no right sidebar; fell back to the floating panel",
			"dock.openFailed": "Could not open the side-chat tab in the right sidebar",
			"insert.direct": "Insert directly",
			"insert.summarize": "Summarize & insert",
			"insert.summarizing": "Summarizing…",
			"insert.failed": "Could not write to the main composer",
			"insert.summarizeFailed": "Summarization failed",
			"insert.contextSummary": "Brought from side chat",
			"insert.summarizeContextSummary": "Side chat summary",
			"question.options": "Options",
			"question.option": "Option",
			"question.bringAll": "Bring all",
			"question.bringAllNew": "New chat (all)",
			"question.bringOne": "Bring",
			"question.bringOneNew": "New chat",
			"question.bringing": "Bringing…",
			"question.failed": "Failed to bring into the side chat",
			"question.delete": "Delete",
			"question.deleteAll": "Delete all",
			"question.collapse": "Collapse",
			"question.expand": "Expand",
			"question.allPrompt": "Please explain what this question is asking and what each option means, and advise how I should choose.",
			"question.onePrompt": "Please explain what this option means and its trade-offs for this question.",
			"question.openHint": "The main conversation has a question dialog — click to ask in the side chat"
		};
		//#endregion
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
		//#region \0dsh-css:/home/runner/work/dsh-side-chat/dsh-side-chat/src/client/layout.css.mjs
		const css = "/**\n * Layout push: when the side-chat panel is open it OCCUPIES layout instead of\n * floating over it — the app shell (#root) gives up the right margin so the\n * center column (conversation + input bar) squeezes left, like a VSCode\n * sidebar. The width rides a CSS variable the panel sets.\n */\n#root {\n  margin-right: var(--dsh-subchat-width, 0px);\n  transition: margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  #root {\n    transition: none;\n  }\n}\n";
		const tagId = "dsh-side-chat-pro/layout.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-side-chat-pro";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/index.tsx
		/**
		* Client half of dsh-side-chat: a text-selection floating menu, a right-side
		* side-chat panel (drag-resizable + collapsible), the main-conversation-style
		* model/permission selectors and send/stop buttons, and a "Side chat" settings
		* section. The panel is isolated per current conversation and talks to the
		* host /sidechat API.
		*/
		/** Services required before mounting. */
		const inject = [
			"sessions",
			"locale",
			"slots",
			"conversation",
			"uiSession"
		];
		function emptyPanel() {
			return {
				open: false,
				parentSessionId: "",
				activeChildId: null,
				items: [],
				messages: [],
				draft: "",
				attachment: null,
				attachments: [],
				lookup: false,
				directory: null,
				permissions: null,
				provider: "",
				model: "",
				effort: "",
				preset: "",
				commandOpen: null,
				planActive: false,
				planPending: false,
				goalObjective: null,
				error: null
			};
		}
		/** Resolve the effort to send with: the explicit choice, else the model's Low (or its default). */
		function resolveReasoningEffort(panel) {
			if (panel.effort !== "") return panel.effort;
			for (const group of panel.directory?.groups ?? []) {
				const model = group.models.find((m) => m.id === panel.model && group.id === panel.provider);
				const reasoning = model?.reasoning;
				if (reasoning === void 0) continue;
				const low = reasoning.efforts.find((e) => e.id.toLowerCase() === "low" || e.name.toLowerCase() === "low");
				if (low !== void 0) return low.id;
				if (reasoning.defaultEffort !== void 0) return reasoning.defaultEffort;
				if (reasoning.efforts[0] !== void 0) return reasoning.efforts[0].id;
			}
			return void 0;
		}
		/** Create the browser store (one instance per activation, per the factory rule). */
		function createStore() {
			let current;
			let panel = emptyPanel();
			let anchor = null;
			let prefs = { ...SUBCHAT_PREFS_DEFAULTS };
			let mainQuestion = null;
			let dismissedQuestionIds = [];
			let dockAvailable = true;
			const bySession = /* @__PURE__ */ new Map();
			const listeners = /* @__PURE__ */ new Set();
			let dockLaunch = null;
			let snapshot = {
				current,
				panel,
				anchor,
				prefs,
				mainQuestion,
				dismissedQuestionIds,
				dockAvailable
			};
			const notify = () => {
				snapshot = {
					current,
					panel,
					anchor,
					prefs,
					mainQuestion,
					dismissedQuestionIds,
					dockAvailable
				};
				for (const fn of [...listeners]) fn();
			};
			return {
				getSnapshot: () => snapshot,
				subscribe: (fn) => {
					listeners.add(fn);
					return () => {
						listeners.delete(fn);
					};
				},
				setCurrent(next) {
					if (next === current) return;
					if (current !== void 0) bySession.set(current, panel);
					current = next;
					panel = next === void 0 ? emptyPanel() : bySession.get(next) ?? {
						...emptyPanel(),
						parentSessionId: next,
						lookup: prefs.lookupDefault
					};
					anchor = null;
					mainQuestion = null;
					dismissedQuestionIds = [];
					notify();
				},
				setAnchor(next) {
					anchor = next;
					notify();
				},
				setPrefs(next) {
					prefs = next;
					notify();
				},
				setMainQuestion(questions) {
					mainQuestion = questions;
					notify();
				},
				dismissQuestion(id) {
					if (!dismissedQuestionIds.includes(id)) {
						dismissedQuestionIds = [...dismissedQuestionIds, id];
						notify();
					}
				},
				dismissAllQuestions(ids) {
					dismissedQuestionIds = [.../* @__PURE__ */ new Set([...dismissedQuestionIds, ...ids])];
					notify();
				},
				openPanel(parentSessionId) {
					panel = {
						...panel,
						open: true,
						parentSessionId
					};
					dockLaunch?.();
					notify();
				},
				closePanel() {
					panel = {
						...panel,
						open: false
					};
					notify();
				},
				setDockLaunch(fn) {
					dockLaunch = fn;
				},
				setDockAvailable(available) {
					if (available === dockAvailable) return;
					dockAvailable = available;
					notify();
				},
				setActive(childId) {
					panel = {
						...panel,
						activeChildId: childId,
						messages: [],
						error: null
					};
					notify();
				},
				patch(partial) {
					panel = {
						...panel,
						...partial
					};
					notify();
				}
			};
		}
		/** Resolve the localized label for one locale key (module-level active locale). */
		function translate(activeLocale, key) {
			return (activeLocale === "en" ? en : zh)[key] ?? key;
		}
		/** Format a run duration like the main conversation: "Xs" / "Xm SSs" (or Chinese). */
		function formatRunDuration(ms, activeLocale) {
			const total = Math.max(0, Math.floor(ms / 1e3));
			const minutes = Math.floor(total / 60);
			const seconds = total % 60;
			if (minutes > 0) return activeLocale === "en" ? `${minutes}m ${String(seconds).padStart(2, "0")}s` : `${minutes}分${String(seconds).padStart(2, "0")}秒`;
			return activeLocale === "en" ? `${seconds}s` : `${seconds}秒`;
		}
		/** Accepted image media types (mirror of dsh-attachment's ImageMediaType). */
		const IMAGE_MEDIA_TYPES = [
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/gif"
		];
		/** Create runtime draft images with object URLs (validates media type). */
		function createDraftImages(files) {
			return files.map((file) => {
				if (!IMAGE_MEDIA_TYPES.includes(file.type)) throw new Error(`unsupported image type: ${file.type || "unknown"}`);
				return {
					id: crypto.randomUUID(),
					file,
					previewUrl: URL.createObjectURL(file)
				};
			});
		}
		/**
		* Read one image file's intrinsic pixel size, releasing the decoded bitmap.
		* Returns null when the browser cannot decode it: the host's `validateImage`
		* stays the authority either way.
		*/
		async function imageSize(file) {
			try {
				const bitmap = await createImageBitmap(file);
				const size = {
					width: bitmap.width,
					height: bitmap.height
				};
				bitmap.close();
				return size;
			} catch {
				return null;
			}
		}
		/** Revoke one draft image's preview URL. */
		function releaseDraftImage(attachment) {
			URL.revokeObjectURL(attachment.previewUrl);
		}
		/** Serialize draft images to base64 prompt parts (mirror of main sendSession). */
		async function serializeImages(attachments) {
			return Promise.all(attachments.map(async (a) => {
				const bytes = new Uint8Array(await a.file.arrayBuffer());
				let binary = "";
				const chunk = 32768;
				for (let offset = 0; offset < bytes.length; offset += chunk) binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
				return {
					type: "image",
					mediaType: a.file.type,
					data: btoa(binary),
					...a.file.name === "" ? {} : { name: a.file.name }
				};
			}));
		}
		/** Convert a base64 string to an object URL for transcript image rendering. */
		function base64ObjectUrl(mediaType, data) {
			const binary = atob(data);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
			return URL.createObjectURL(new Blob([bytes], { type: mediaType }));
		}
		/** Pull the side-chat list for one parent conversation. */
		async function refreshList(store, parentSessionId) {
			const result = await api.list({ parentSessionId });
			if (result.ok) store.patch({ items: result.value.items });
		}
		/** Optimistically flip one side-chat's running flag before the list round-trip. */
		function setItemRunning(store, childId, running) {
			const items = store.getSnapshot().panel.items;
			store.patch({ items: items.map((i) => i.childId === childId ? {
				...i,
				running
			} : i) });
		}
		/** Pull the active side chat's transcript. */
		async function refreshHistory(store, childId) {
			const result = await api.history({ childId });
			if (result.ok) store.patch({ messages: result.value.messages });
		}
		/** Pull the model directory + permission catalog once. */
		async function refreshDirectory(store) {
			const [directoryResult, permissionsResult] = await Promise.all([api.directory(), api.permissions()]);
			const patch = {};
			if (directoryResult.ok) patch.directory = directoryResult.value;
			if (permissionsResult.ok) {
				patch.permissions = permissionsResult.value;
				if (store.getSnapshot().panel.preset === "") patch.preset = permissionsResult.value.current;
			}
			store.patch(patch);
		}
		/** The first non-empty line of a reasoning block (collapsed summary). */
		function firstLine(text) {
			const end = text.indexOf("\n");
			return end === -1 ? text : text.slice(0, end);
		}
		/** Main-conversation-style reasoning disclosure row (Think). */
		function ReasoningRow(props) {
			const [expanded, setExpanded] = (0, react.useState)(false);
			const summary = firstLine(props.text);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.DisclosureRow, {
				icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconThinkOutlineRegular, { size: 14 }),
				title: props.t("panel.think"),
				open: expanded,
				expandable: true,
				expandOnRowClick: true,
				onToggle: () => {
					setExpanded((value) => !value);
				},
				collapsedContent: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: client_module_css_default.reasoningSummary,
					children: summary
				}),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: client_module_css_default.reasoningBody,
					children: props.text
				})
			});
		}
		/**
		* Main-conversation-style model selector: a compact trigger showing
		* `model · effort`, opening a two-level menu (provider groups → models, then
		* effort levels). UI mirrors dsh-client-ui-model-selection's ModelSelect.
		*/
		function ModelSelect(props) {
			const { directory, selection, onSelect, t, openSignal, onOpenConsumed } = props;
			const [open, setOpen] = (0, react.useState)(false);
			const [pane, setPane] = (0, react.useState)("root");
			const rootRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (openSignal === true) {
					setPane("root");
					setOpen(true);
					onOpenConsumed?.();
				}
			}, [openSignal, onOpenConsumed]);
			let currentChoice;
			for (const group of directory?.groups ?? []) {
				const model = group.models.find((m) => m.id === selection.model && group.id === selection.provider);
				if (model !== void 0) {
					currentChoice = {
						name: model.name,
						reasoning: model.reasoning
					};
					break;
				}
			}
			const reasoning = currentChoice?.reasoning;
			const effectiveEffort = selection.effort !== "" ? selection.effort : reasoning?.defaultEffort;
			const effortLabel = reasoning === void 0 ? void 0 : effectiveEffort === void 0 ? t("panel.effortDefault") : reasoning.efforts.find((e) => e.id === effectiveEffort)?.name ?? effectiveEffort;
			const modelLabel = currentChoice?.name ?? t("panel.noModel");
			const effortChoices = reasoning === void 0 ? [] : [...reasoning.defaultEffort === void 0 ? [{
				key: "default",
				effort: void 0,
				label: t("panel.effortDefault")
			}] : [], ...reasoning.efforts.map((e) => ({
				key: e.id,
				effort: e.id,
				label: e.name
			}))];
			(0, react.useEffect)(() => {
				if (!open) return;
				const onDown = (e) => {
					if (rootRef.current !== null && !rootRef.current.contains(e.target)) setOpen(false);
				};
				const onKey = (e) => {
					if (e.key === "Escape") setOpen(false);
				};
				document.addEventListener("mousedown", onDown);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDown);
					document.removeEventListener("keydown", onKey);
				};
			}, [open]);
			const triggerLabel = effortLabel === void 0 ? modelLabel : `${modelLabel} · ${effortLabel}`;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: rootRef,
				className: client_module_css_default.modelSelect,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: client_module_css_default.modelSelectTrigger,
					"aria-haspopup": "menu",
					"aria-expanded": open,
					title: triggerLabel,
					onClick: () => {
						if (open) setOpen(false);
						else {
							setPane("root");
							setOpen(true);
						}
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: client_module_css_default.modelSelectLabel,
							children: modelLabel
						}),
						effortLabel !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: client_module_css_default.modelSelectEffort,
							children: effortLabel
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: open ? client_module_css_default.chevronOpen : void 0 })
					]
				}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: client_module_css_default.modelSelectMenu,
					role: "menu",
					children: [
						pane === "root" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "menuitem",
							className: client_module_css_default.modelCell,
							onClick: () => {
								setPane("model");
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.modelCellLabel,
									children: t("panel.model")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.modelCellValue,
									children: modelLabel
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutlineRegular, { className: client_module_css_default.modelCellChevron })
							]
						}), reasoning !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "menuitem",
							className: client_module_css_default.modelCell,
							onClick: () => {
								setPane("effort");
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.modelCellLabel,
									children: t("panel.effort")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.modelCellValue,
									children: effortLabel
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutlineRegular, { className: client_module_css_default.modelCellChevron })
							]
						})] }),
						pane === "model" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: client_module_css_default.modelGroups,
							children: [(directory?.groups ?? []).map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								role: "group",
								"aria-label": group.name,
								className: client_module_css_default.modelGroup,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: client_module_css_default.modelGroupTitle,
									children: group.name
								}), group.models.map((model) => {
									const selected = selection.provider === group.id && selection.model === model.id;
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "menuitemradio",
										"aria-checked": selected,
										className: selected ? `${client_module_css_default.modelOption} ${client_module_css_default.modelOptionSelected}` : client_module_css_default.modelOption,
										title: model.name,
										onClick: () => {
											onSelect(group.id, model.id);
											setOpen(false);
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: client_module_css_default.modelOptionCopy,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: client_module_css_default.modelName,
												children: model.name
											}), model.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: client_module_css_default.modelDescription,
												children: model.description
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: client_module_css_default.modelCheck,
											children: selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineRegular, {}) : null
										})]
									}, model.id);
								})]
							}, group.id)), (directory?.groups ?? []).length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: client_module_css_default.modelEmpty,
								children: t("panel.noModel")
							})]
						}),
						pane === "effort" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: effortChoices.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: client_module_css_default.modelEmpty,
							children: t("panel.effort")
						}) : effortChoices.map((level) => {
							const selected = effectiveEffort === level.effort;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "menuitemradio",
								"aria-checked": selected,
								className: selected ? `${client_module_css_default.modelOption} ${client_module_css_default.modelOptionSelected}` : client_module_css_default.modelOption,
								onClick: () => {
									onSelect(selection.provider, selection.model, level.effort);
									setOpen(false);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.modelOptionCopy,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: client_module_css_default.modelName,
										children: level.label
									})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.modelCheck,
									children: selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutlineRegular, {}) : null
								})]
							}, level.key);
						}) })
					]
				})]
			});
		}
		/** Main-conversation-style permission selector (Menu + compact trigger). */
		function PermissionSelect(props) {
			const { permissions, preset, onSelect, openSignal, onOpenConsumed } = props;
			const [open, setOpen] = (0, react.useState)(false);
			const options = (permissions?.options ?? []).filter((o) => o.value !== "custom");
			const current = options.find((o) => o.value === preset);
			const items = options.map((o) => ({
				id: o.value,
				label: o.name
			}));
			(0, react.useEffect)(() => {
				if (openSignal === true) {
					setOpen(true);
					onOpenConsumed?.();
				}
			}, [openSignal, onOpenConsumed]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
				open,
				side: "top",
				align: "end",
				items,
				selectedId: preset,
				onSelect: (id) => {
					setOpen(false);
					onSelect(id);
				},
				onClose: () => {
					setOpen(false);
				},
				anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: client_module_css_default.modelSelectTrigger,
					"aria-haspopup": "menu",
					"aria-expanded": open,
					title: current?.description,
					onClick: () => {
						setOpen(!open);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: client_module_css_default.modelSelectLabel,
						children: current?.name ?? preset
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, {})]
				})
			});
		}
		/**
		* The floating selection menu: listens to the document selection and shows
		* one or two buttons (start / continue), dispatching to the host API.
		*/
		function SelectionMenu(props) {
			const { anchor, current, panel, prefs } = (0, react.useSyncExternalStore)(props.store.subscribe, props.store.getSnapshot);
			const [local, setLocal] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				const compute = () => {
					const selection = window.getSelection();
					if (selection === null || selection.isCollapsed) {
						setLocal(null);
						return;
					}
					const text = selection.toString().trim();
					if (text === "") {
						setLocal(null);
						return;
					}
					const range = selection.getRangeAt(0);
					const node = range.startContainer;
					const element = node.nodeType === 1 ? node : node.parentElement;
					if (element !== null && element.closest("input, textarea, [contenteditable=\"true\"]") !== null) {
						setLocal(null);
						return;
					}
					if (element !== null && element.closest("[data-dsh-side-chat]") !== null) {
						setLocal(null);
						return;
					}
					const rect = range.getBoundingClientRect();
					if (rect.width === 0 && rect.height === 0) {
						setLocal(null);
						return;
					}
					setLocal({
						text,
						x: rect.left + rect.width / 2,
						y: rect.top
					});
				};
				const onMouseUp = () => {
					window.setTimeout(compute, 0);
				};
				document.addEventListener("mouseup", onMouseUp);
				document.addEventListener("selectionchange", compute);
				return () => {
					document.removeEventListener("mouseup", onMouseUp);
					document.removeEventListener("selectionchange", compute);
				};
			}, []);
			const [assist, setAssist] = (0, react.useState)(null);
			const runAssist = (0, react.useCallback)(async (mode) => {
				if (local === null || current === void 0) return;
				const text = local.text;
				const x = Math.max(220, Math.min(window.innerWidth - 220, local.x));
				const y = local.y + 26;
				let context = "";
				try {
					const selection = window.getSelection();
					const anchor = selection === null ? null : selection.anchorNode;
					const element = anchor === null ? null : anchor.nodeType === 1 ? anchor : anchor.parentElement;
					const block = element === null ? null : element.closest("p, li, td, pre, blockquote");
					if (block !== null && block.textContent !== null) context = block.textContent.slice(0, 1500);
				} catch (error) {}
				const locale = typeof document !== "undefined" && document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "zh";
				setAssist({
					mode,
					status: "loading",
					text: "",
					x,
					y
				});
				const result = await api.assist({
					parentSessionId: current,
					text,
					mode,
					context,
					locale
				});
				if (result.ok) setAssist({
					mode,
					status: "done",
					text: result.value.text,
					x,
					y
				});
				else setAssist({
					mode,
					status: "error",
					text: result.error?.message ?? "failed",
					x,
					y
				});
			}, [local, current]);
			const start = (0, react.useCallback)(() => {
				if (local === null || current === void 0) return;
				const parentSessionId = current;
				const text = local.text;
				const snap = props.store.getSnapshot().panel;
				if (prefs.sendImmediately) {
					const content = [{
						type: "text",
						text
					}, ...prefs.defaultPrompt.trim() !== "" ? [{
						type: "text",
						text: prefs.defaultPrompt.trim()
					}] : []];
					api.start({
						parentSessionId,
						content,
						lookupEnabled: prefs.lookupDefault,
						...snap.provider !== "" ? { provider: snap.provider } : {},
						...snap.model !== "" ? { model: snap.model } : {},
						...resolveReasoningEffort(snap) !== void 0 ? { reasoningEffort: resolveReasoningEffort(snap) } : {}
					}).then((result) => {
						if (result.ok) {
							props.store.openPanel(parentSessionId);
							props.store.setActive(result.value.childId);
							props.store.patch({
								provider: result.value.provider,
								model: result.value.model,
								effort: result.value.reasoningEffort ?? ""
							});
							refreshList(props.store, parentSessionId);
							refreshDirectory(props.store);
						}
					});
				} else {
					props.store.openPanel(parentSessionId);
					props.store.patch({
						attachment: text,
						activeChildId: null,
						messages: [],
						draft: "",
						provider: "",
						model: "",
						effort: ""
					});
					api.inherit({ parentSessionId }).then((result) => {
						if (result.ok) props.store.patch({
							provider: result.value.provider,
							model: result.value.model,
							effort: ""
						});
					});
					refreshDirectory(props.store);
				}
				setLocal(null);
			}, [
				local,
				current,
				prefs,
				props.store
			]);
			const continueChat = (0, react.useCallback)(() => {
				if (local === null || current === void 0) return;
				const parentSessionId = current;
				const text = local.text;
				const active = props.store.getSnapshot().panel.activeChildId;
				if (active === null) return;
				props.store.openPanel(parentSessionId);
				if (prefs.sendImmediately) {
					const content = [{
						type: "text",
						text
					}, ...prefs.defaultPrompt.trim() !== "" ? [{
						type: "text",
						text: prefs.defaultPrompt.trim()
					}] : []];
					setItemRunning(props.store, active, true);
					api.followup({
						childId: active,
						content,
						lookupEnabled: prefs.lookupDefault
					}).then((result) => {
						if (!result.ok) props.store.patch({ error: result.error.message });
						refreshList(props.store, parentSessionId);
						refreshHistory(props.store, active);
					});
				} else props.store.patch({ attachment: text });
				setLocal(null);
			}, [
				local,
				current,
				prefs,
				props.store
			]);
			if (local === null && assist === null) return null;
			const hasActive = panel.activeChildId !== null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [local !== null && current !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: client_module_css_default.selectionMenu,
				style: {
					left: local.x,
					top: local.y - 46
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: client_module_css_default.selectionButton,
					onClick: start,
					children: props.t("ask.new")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: client_module_css_default.selectionButton,
					onClick: () => {
						runAssist("translate");
					},
					children: props.t("assist.translate")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: client_module_css_default.selectionButton,
					onClick: () => {
						runAssist("explain");
					},
					children: props.t("assist.explain")
				}), hasActive && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: client_module_css_default.selectionButton,
					onClick: continueChat,
					children: props.t("ask.continue")
				})]
			}), assist !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					position: "fixed",
					left: assist.x,
					top: assist.y,
					transform: "translateX(-50%)",
					zIndex: 2147483000,
					width: "min(440px, 82vw)",
					maxHeight: "46vh",
					overflow: "auto",
					background: "rgba(28,30,34,0.98)",
					border: "1px solid rgba(255,255,255,0.14)",
					borderRadius: "10px",
					boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
					padding: "10px 12px",
					color: "#e9e9e9",
					fontSize: "13px",
					lineHeight: "1.65",
					whiteSpace: "pre-wrap"
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "8px",
						marginBottom: "6px",
						fontSize: "12px",
						opacity: 0.75
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: assist.mode === "translate" ? props.t("assist.translate") : props.t("assist.explain") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						style: {
							marginLeft: "auto",
							display: "flex",
							gap: "8px"
						},
						children: [assist.status === "done" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								navigator.clipboard?.writeText(assist.text).catch(() => {});
							},
							style: {
								background: "none",
								border: "none",
								color: "inherit",
								cursor: "pointer",
								padding: "0",
								fontSize: "inherit"
							},
							children: props.t("assist.copy")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setAssist(null);
							},
							style: {
								background: "none",
								border: "none",
								color: "inherit",
								cursor: "pointer",
								padding: "0",
								fontSize: "inherit"
							},
							children: props.t("assist.close")
						})]
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: assist.status === "loading" ? props.t("assist.loading") : assist.text })]
			})] });
		}
		/**
		* The floating bring-back-to-main menu: listens to the document selection and,
		* when the selection is inside an assistant reply in the side-chat panel, shows
		* two actions — "insert directly" and "summarize then insert" — both appending
		* into the main composer without sending.
		*/
		function BringBackMenu(props) {
			const [local, setLocal] = (0, react.useState)(null);
			const [summarizing, setSummarizing] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				const compute = () => {
					const selection = window.getSelection();
					if (selection === null || selection.isCollapsed) {
						setLocal(null);
						return;
					}
					const text = selection.toString().trim();
					if (text === "") {
						setLocal(null);
						return;
					}
					const range = selection.getRangeAt(0);
					const node = range.startContainer;
					const element = node.nodeType === 1 ? node : node.parentElement;
					if (element !== null && element.closest("input, textarea, [contenteditable=\"true\"]") !== null) {
						setLocal(null);
						return;
					}
					if (element === null || element.closest("[data-sidechat-role=\"assistant\"]") === null) {
						setLocal(null);
						return;
					}
					const rect = range.getBoundingClientRect();
					if (rect.width === 0 && rect.height === 0) {
						setLocal(null);
						return;
					}
					setLocal({
						text,
						x: rect.left + rect.width / 2,
						y: rect.top
					});
				};
				const onMouseUp = () => {
					window.setTimeout(compute, 0);
				};
				document.addEventListener("mouseup", onMouseUp);
				document.addEventListener("selectionchange", compute);
				return () => {
					document.removeEventListener("mouseup", onMouseUp);
					document.removeEventListener("selectionchange", compute);
				};
			}, []);
			if (local === null) return null;
			const summarize = async () => {
				setSummarizing(true);
				const ok = await props.summarizeBring(local.text);
				setSummarizing(false);
				if (!ok) props.store.patch({ error: props.t("insert.summarizeFailed") });
				else setLocal(null);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: client_module_css_default.selectionMenu,
				style: {
					left: local.x,
					top: local.y - 46
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: client_module_css_default.selectionButton,
					onClick: () => {
						props.bringToMain(local.text).then((ok) => {
							if (!ok) props.store.patch({ error: props.t("insert.failed") });
							else setLocal(null);
						});
					},
					children: props.t("insert.direct")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: client_module_css_default.selectionButton,
					disabled: summarizing,
					onClick: () => {
						summarize();
					},
					children: summarizing ? props.t("insert.summarizing") : props.t("insert.summarize")
				})]
			});
		}
		/**
		* Floating entry shown while the panel is closed and the main conversation has
		* a pending question dialog. It anchors beside the dialog's header (without
		* covering its text) and disappears once clicked (the panel opens instead).
		*/
		function QuestionFab(props) {
			const [pos, setPos] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				let raf = 0;
				let missing = 0;
				const tick = () => {
					const el = document.querySelector("[data-question-key], [data-approval-key]");
					if (el === null) {
						missing += 1;
						if (missing > 30) {
							props.store.setMainQuestion(null);
							return;
						}
						setPos(null);
						raf = requestAnimationFrame(tick);
						return;
					}
					missing = 0;
					const rect = (el.querySelector("header") ?? el.firstElementChild ?? el).getBoundingClientRect();
					const left = Math.min(rect.right + 8, window.innerWidth - 32 - 8);
					const top = rect.top + rect.height / 2;
					setPos({
						left,
						top
					});
					raf = requestAnimationFrame(tick);
				};
				tick();
				return () => {
					cancelAnimationFrame(raf);
				};
			}, [props.store]);
			const style = pos !== null ? {
				left: pos.left,
				top: pos.top,
				transform: "translateY(-50%)"
			} : {
				left: "50%",
				bottom: 160,
				transform: "translateX(-50%)"
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: props.t("question.openHint"),
				side: "top",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: client_module_css_default.questionFab,
					style,
					"aria-label": props.t("question.openHint"),
					onClick: props.onOpen,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutlineRegular, { size: 16 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: client_module_css_default.questionFabDot })]
				})
			});
		}
		/** Panel width bounds. The panel never takes more than ~40% of the window and
		* never squeezes the main chat below a usable minimum — so the panel adapts to
		* whatever resolution / zoom the browser window is at. */
		const PANEL_MIN_WIDTH = 280;
		const PANEL_MAX_WIDTH = 720;
		const PANEL_DEFAULT_WIDTH = 360;
		const MAIN_CHAT_MIN_WIDTH = 480;
		/** localStorage key remembering the last panel width across reloads. */
		const PANEL_WIDTH_KEY = "dsh-side-chat.panelWidth";
		/** Right-sidebar dock identity (kind is the `openTab` discriminator; id keys the body seat). */
		const SIDEBAR_TAB_ID = "dsh-side-chat-pro/side-chat";
		const SIDEBAR_TAB_KIND = "side-chat";
		/** The viewport-aware maximum panel width for the current window. */
		function panelCap() {
			const vw = window.innerWidth;
			return Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, vw * .4, vw - MAIN_CHAT_MIN_WIDTH));
		}
		/** The last user-chosen width, if any (re-clamped to the viewport on load). */
		function savedPanelWidth() {
			try {
				const raw = window.localStorage.getItem(PANEL_WIDTH_KEY);
				if (raw === null) return null;
				const n = Number(raw);
				return Number.isFinite(n) && n > 0 ? n : null;
			} catch {
				return null;
			}
		}
		/** The side-chat panel body. */
		function SidechatPanel(props) {
			const { panel, mainQuestion, dismissedQuestionIds } = (0, react.useSyncExternalStore)(props.store.subscribe, props.store.getSnapshot);
			const scrollRef = (0, react.useRef)(null);
			const markdownLabels = (0, react.useMemo)(() => ({
				code: {
					copyLabel: props.t("panel.copy"),
					copiedLabel: props.t("panel.copied")
				},
				footnotes: props.t("panel.footnotes")
			}), [props.t]);
			const attachmentRailLabels = (0, react.useMemo)(() => ({
				group: props.t("image.railGroup"),
				open: props.t("image.railOpen"),
				scrollLeft: props.t("image.railScrollLeft"),
				scrollRight: props.t("image.railScrollRight")
			}), [props.t]);
			const messageImageLabels = (0, react.useMemo)(() => ({
				image: props.t("image.label"),
				open: props.t("image.open"),
				openNamed: (name) => name,
				loading: props.t("image.loading"),
				loadFailed: props.t("image.loadFailed"),
				lightbox: {
					dialog: props.t("image.lightboxDialog"),
					close: props.t("image.close")
				}
			}), [props.t]);
			const dropOverlayLabels = (0, react.useMemo)(() => ({
				title: props.t("image.dropTitle"),
				desc: props.t("image.dropDesc")
			}), [props.t]);
			const [width, setWidth] = (0, react.useState)(() => {
				const base = savedPanelWidth() ?? PANEL_DEFAULT_WIDTH;
				return Math.max(PANEL_MIN_WIDTH, Math.min(panelCap(), base));
			});
			const [collapsed, setCollapsed] = (0, react.useState)(false);
			const [now, setNow] = (0, react.useState)(() => Date.now());
			const [dragActive, setDragActive] = (0, react.useState)(false);
			const [lightbox, setLightbox] = (0, react.useState)(null);
			const [limits, setLimits] = (0, react.useState)(null);
			/** Index of the assistant message whose "summarize then insert" is in flight. */
			const [summarizingIndex, setSummarizingIndex] = (0, react.useState)(null);
			/** Which question-dialog item is being brought into the side chat ('all' or an option label). */
			const [bringingKey, setBringingKey] = (0, react.useState)(null);
			/** Whether the question-dialog list is collapsed (headers only). */
			const [questionCollapsed, setQuestionCollapsed] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (panel.open && panel.activeChildId !== null) setCollapsed(false);
			}, [panel.open, panel.activeChildId]);
			const openQuestionPanel = (0, react.useCallback)(() => {
				props.store.openPanel(panel.parentSessionId);
				setCollapsed(false);
			}, [props.store, panel.parentSessionId]);
			/** Assemble one question + all its options into a prompt. */
			const buildAllText = (q) => {
				const lines = [];
				if (q.header !== void 0 && q.header !== "") lines.push(`【${q.header}】`);
				lines.push(q.question);
				if (q.detail !== void 0 && q.detail !== "") lines.push(q.detail);
				const options = q.options ?? [];
				if (options.length > 0) {
					lines.push(props.t("question.options"));
					for (const o of options) lines.push(`- ${o.label}${o.description !== void 0 && o.description !== "" ? ` — ${o.description}` : ""}`);
				}
				lines.push(props.t("question.allPrompt"));
				return lines.join("\n");
			};
			/** Assemble one question + one specific option into a prompt. */
			const buildOneText = (q, o) => {
				const lines = [];
				if (q.header !== void 0 && q.header !== "") lines.push(`【${q.header}】`);
				lines.push(q.question);
				if (q.detail !== void 0 && q.detail !== "") lines.push(q.detail);
				lines.push(`${props.t("question.option")}：${o.label}${o.description !== void 0 && o.description !== "" ? ` — ${o.description}` : ""}`);
				lines.push(props.t("question.onePrompt"));
				return lines.join("\n");
			};
			const bringQuestionText = (text, key, useNew) => {
				setBringingKey(key);
				(useNew ? props.askSidechatNew : props.askSidechat)(text).then((ok) => {
					setBringingKey(null);
					if (!ok) props.store.patch({ error: props.t("question.failed") });
				});
			};
			const activeItem = panel.items.find((i) => i.childId === panel.activeChildId);
			const activeRunning = activeItem?.running ?? false;
			const [anchor, setAnchor] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (props.embedded) return;
				const w = panel.open && !collapsed && !props.conflictHidden ? `${width}px` : "0px";
				document.documentElement.style.setProperty("--dsh-subchat-width", w);
				return () => {
					document.documentElement.style.setProperty("--dsh-subchat-width", "0px");
				};
			}, [
				props.embedded,
				panel.open,
				collapsed,
				width,
				props.conflictHidden
			]);
			(0, react.useEffect)(() => {
				const onResize = () => {
					setWidth((w) => Math.min(w, panelCap()));
				};
				window.addEventListener("resize", onResize);
				return () => {
					window.removeEventListener("resize", onResize);
				};
			}, []);
			(0, react.useEffect)(() => {
				try {
					window.localStorage.setItem(PANEL_WIDTH_KEY, String(width));
				} catch {}
			}, [width]);
			(0, react.useEffect)(() => {
				if (panel.open && panel.directory === null) refreshDirectory(props.store);
			}, [
				panel.open,
				panel.directory,
				props.store
			]);
			(0, react.useEffect)(() => {
				if (activeRunning) {
					if (anchor === null) setAnchor(activeItem?.runningSince ?? Date.now());
				} else if (anchor !== null) setAnchor(null);
			}, [
				activeRunning,
				activeItem?.runningSince,
				anchor
			]);
			(0, react.useEffect)(() => {
				if (!activeRunning) return;
				const id = window.setInterval(() => {
					setNow(Date.now());
				}, 1e3);
				return () => {
					window.clearInterval(id);
				};
			}, [activeRunning]);
			(0, react.useEffect)(() => {
				const el = scrollRef.current;
				if (el !== null) el.scrollTop = el.scrollHeight;
			}, [panel.messages.length, panel.activeChildId]);
			(0, react.useEffect)(() => {
				if (!panel.open || panel.activeChildId === null) return;
				const tick = () => {
					const snap = props.store.getSnapshot().panel;
					const childId = snap.activeChildId;
					if (childId === null) return;
					refreshList(props.store, snap.parentSessionId);
					refreshHistory(props.store, childId);
				};
				tick();
				const id = window.setInterval(tick, 1200);
				return () => {
					window.clearInterval(id);
				};
			}, [
				panel.open,
				panel.activeChildId,
				props.store
			]);
			const send = (0, react.useCallback)(() => {
				const draft = panel.draft.trim();
				const attachment = panel.attachment === null ? "" : panel.attachment;
				const text = attachment === "" ? draft : draft === "" ? attachment : `${attachment}\n\n${draft}`;
				serializeImages(panel.attachments).then((imageParts) => {
					const content = [...imageParts, ...text === "" ? [] : [{
						type: "text",
						text
					}]];
					if (content.length === 0) return;
					const toRelease = panel.attachments;
					props.store.patch({
						draft: "",
						attachment: null,
						attachments: []
					});
					toRelease.forEach(releaseDraftImage);
					if (panel.activeChildId === null) {
						api.start({
							parentSessionId: panel.parentSessionId,
							content,
							lookupEnabled: panel.lookup,
							...panel.provider !== "" ? { provider: panel.provider } : {},
							...panel.model !== "" ? { model: panel.model } : {},
							...resolveReasoningEffort(panel) !== void 0 ? { reasoningEffort: resolveReasoningEffort(panel) } : {},
							...panel.preset !== "" ? { preset: panel.preset } : {}
						}).then((result) => {
							if (result.ok) {
								props.store.setActive(result.value.childId);
								props.store.patch({
									provider: result.value.provider,
									model: result.value.model,
									effort: result.value.reasoningEffort ?? ""
								});
								refreshList(props.store, panel.parentSessionId);
								refreshDirectory(props.store);
							} else props.store.patch({ error: result.error.message });
						});
						return;
					}
					const childId = panel.activeChildId;
					setItemRunning(props.store, childId, true);
					api.followup({
						childId,
						content,
						lookupEnabled: panel.lookup
					}).then((result) => {
						if (!result.ok) {
							setItemRunning(props.store, childId, false);
							props.store.patch({ error: result.error.message });
						}
						refreshList(props.store, panel.parentSessionId);
						refreshHistory(props.store, childId);
					});
				}).catch((error) => {
					props.store.patch({ error: error instanceof Error ? error.message : String(error) });
				});
			}, [panel, props.store]);
			const stop = (0, react.useCallback)(() => {
				if (panel.activeChildId === null) return;
				const childId = panel.activeChildId;
				setItemRunning(props.store, childId, false);
				api.stop({ childId }).then(() => {
					refreshList(props.store, panel.parentSessionId);
					refreshHistory(props.store, childId);
				});
			}, [panel, props.store]);
			const onModelSelect = (0, react.useCallback)((provider, model, effort) => {
				props.store.patch({
					provider,
					model,
					effort: effort ?? ""
				});
				if (panel.activeChildId !== null) api.selectModel({
					childId: panel.activeChildId,
					provider,
					model,
					...effort === void 0 ? {} : { reasoningEffort: effort }
				});
			}, [panel.activeChildId, props.store]);
			const onPresetChange = (0, react.useCallback)((value) => {
				if (value === "custom" || value === "") return;
				props.store.patch({ preset: value });
				if (panel.activeChildId !== null) api.selectPermission({
					childId: panel.activeChildId,
					presetName: value
				}).then((result) => {
					if (!result.ok) props.store.patch({ error: result.error.message });
				});
			}, [panel.activeChildId, props.store]);
			const dispose = (0, react.useCallback)(() => {
				const childId = panel.activeChildId;
				if (childId === null) {
					props.store.closePanel();
					return;
				}
				api.dispose({ childId }).then(() => {
					refreshList(props.store, panel.parentSessionId);
					props.store.patch({
						activeChildId: null,
						messages: []
					});
					props.store.closePanel();
				});
			}, [panel, props.store]);
			/** Delete one side chat from the list. */
			const disposeItem = (0, react.useCallback)((childId) => {
				api.dispose({ childId }).then(() => {
					refreshList(props.store, panel.parentSessionId);
					if (panel.activeChildId === childId) props.store.patch({
						activeChildId: null,
						messages: []
					});
				});
			}, [
				panel.activeChildId,
				panel.parentSessionId,
				props.store
			]);
			/** Delete every side chat of this conversation at once. */
			const disposeAll = (0, react.useCallback)(() => {
				const ids = panel.items.map((i) => i.childId);
				if (ids.length === 0) return;
				Promise.all(ids.map((id) => api.dispose({ childId: id }))).then(() => {
					refreshList(props.store, panel.parentSessionId);
					props.store.patch({
						activeChildId: null,
						messages: []
					});
				});
			}, [
				panel.items,
				panel.parentSessionId,
				props.store
			]);
			const startResize = (0, react.useCallback)((e) => {
				e.preventDefault();
				const startX = e.clientX;
				const startWidth = width;
				const onMove = (ev) => {
					setWidth(Math.max(PANEL_MIN_WIDTH, Math.min(panelCap(), startWidth + (startX - ev.clientX))));
				};
				const onUp = () => {
					window.removeEventListener("mousemove", onMove);
					window.removeEventListener("mouseup", onUp);
				};
				window.addEventListener("mousemove", onMove);
				window.addEventListener("mouseup", onUp);
			}, [width]);
			const intakeImages = (0, react.useCallback)((files) => {
				if (files.length === 0) return;
				const images = files.filter((f) => f.type.startsWith("image/"));
				if (images.length === 0) {
					props.store.patch({ error: props.t("image.unsupported") });
					return;
				}
				(async () => {
					try {
						if (limits !== null) {
							if (images.some((f) => !limits.mediaTypes.includes(f.type))) {
								props.store.patch({ error: props.t("image.unsupported") });
								return;
							}
							if (panel.attachments.length + images.length > limits.maxImagesPerMessage) {
								props.store.patch({ error: props.t("image.tooMany") });
								return;
							}
							if (images.some((f) => f.size > limits.maxImageBytes)) {
								props.store.patch({ error: props.t("image.fileTooLarge") });
								return;
							}
							const maxDimension = limits.maxImageDimension;
							if (typeof maxDimension === "number" && maxDimension > 0) for (const file of images) {
								const size = await imageSize(file);
								if (size !== null && (size.width > maxDimension || size.height > maxDimension)) {
									props.store.patch({ error: props.t("image.dimensionTooLarge") });
									return;
								}
							}
						}
						const created = createDraftImages(images);
						props.store.patch({
							attachments: [...panel.attachments, ...created],
							error: null
						});
					} catch (error) {
						props.store.patch({ error: error instanceof Error ? error.message : String(error) });
					}
				})();
			}, [
				limits,
				panel.attachments,
				props.store,
				props.t
			]);
			(0, react.useEffect)(() => {
				api.limits().then((result) => {
					if (result.ok) setLimits(result.value);
				});
			}, []);
			(0, react.useEffect)(() => {
				if (!panel.open || collapsed) return;
				const dragDepth = { value: 0 };
				const hasFiles = (event) => event.dataTransfer?.types.includes("Files") ?? false;
				const reset = () => {
					dragDepth.value = 0;
					setDragActive(false);
				};
				const onDragEnter = (event) => {
					if (!hasFiles(event)) return;
					event.preventDefault();
					dragDepth.value += 1;
					setDragActive(true);
				};
				const onDragOver = (event) => {
					if (!hasFiles(event) || event.dataTransfer === null) return;
					event.preventDefault();
					event.dataTransfer.dropEffect = "copy";
				};
				const onDragLeave = (event) => {
					if (!hasFiles(event)) return;
					dragDepth.value = Math.max(0, dragDepth.value - 1);
					if (dragDepth.value === 0) setDragActive(false);
				};
				const onDrop = (event) => {
					if (!hasFiles(event)) return;
					event.preventDefault();
					reset();
					intakeImages([...event.dataTransfer?.files ?? []]);
				};
				document.addEventListener("dragenter", onDragEnter);
				document.addEventListener("dragover", onDragOver);
				document.addEventListener("dragleave", onDragLeave);
				document.addEventListener("drop", onDrop);
				window.addEventListener("dragend", reset);
				return () => {
					document.removeEventListener("dragenter", onDragEnter);
					document.removeEventListener("dragover", onDragOver);
					document.removeEventListener("dragleave", onDragLeave);
					document.removeEventListener("drop", onDrop);
					window.removeEventListener("dragend", reset);
				};
			}, [
				panel.open,
				collapsed,
				intakeImages
			]);
			const onPaste = (0, react.useCallback)((e) => {
				const files = Array.from(e.clipboardData.items).filter((item) => item.kind === "file").map((item) => item.getAsFile()).filter((f) => f !== null);
				if (files.length === 0) return;
				e.preventDefault();
				intakeImages(files);
			}, [intakeImages]);
			const removeImage = (0, react.useCallback)((id) => {
				const target = panel.attachments.find((a) => a.id === id);
				if (target !== void 0) releaseDraftImage(target);
				props.store.patch({ attachments: panel.attachments.filter((a) => a.id !== id) });
			}, [panel.attachments, props.store]);
			const imageLoader = (0, react.useCallback)(async (ref) => {
				const result = await api.attachment({
					childId: panel.activeChildId ?? "",
					attachmentId: ref.attachmentId
				});
				if (!result.ok) throw new Error(result.error.message);
				return base64ObjectUrl(result.value.mediaType, result.value.data);
			}, [panel.activeChildId]);
			if (!props.embedded) {
				if (!panel.open) return null;
				if (collapsed) {
					if (mainQuestion !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QuestionFab, {
						store: props.store,
						t: props.t,
						onOpen: openQuestionPanel
					});
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: props.t("panel.expand"),
						side: "bottom",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: client_module_css_default.collapsedHandle,
							onClick: () => {
								setCollapsed(false);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutlineRegular, { size: 16 })
						})
					});
				}
			}
			const elapsedMs = anchor === null ? 0 : Math.max(0, now - anchor);
			const showClock = elapsedMs >= 15e3;
			const panelClass = props.embedded ? `${client_module_css_default.panel} ${client_module_css_default.panelEmbedded}` : `${client_module_css_default.panel}${props.conflictHidden ? ` ${client_module_css_default.panelConflictHidden}` : ""}`;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: panelClass,
				style: props.embedded ? void 0 : { width },
				"data-sidechat-panel": props.embedded ? "embedded" : "floating",
				children: [
					!props.embedded && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: client_module_css_default.panelResize,
						onMouseDown: startResize
					}),
					!props.embedded && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: client_module_css_default.panelHeader,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: client_module_css_default.panelTitle,
							children: props.t("panel.title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: client_module_css_default.panelHeaderActions,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
								label: props.t("panel.collapse"),
								side: "bottom",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: client_module_css_default.panelIconButton,
									onClick: () => {
										setCollapsed(true);
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutlineRegular, { size: 16 })
								})
							})
						})]
					}),
					mainQuestion !== null && (() => {
						const visible = mainQuestion.filter((q) => !dismissedQuestionIds.includes(q.id));
						if (visible.length === 0) return null;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: client_module_css_default.questionBlock,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: client_module_css_default.questionBlockActions,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: client_module_css_default.questionToggle,
									onClick: () => {
										setQuestionCollapsed(!questionCollapsed);
									},
									children: questionCollapsed ? props.t("question.expand") : props.t("question.collapse")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: client_module_css_default.questionDeleteAll,
									onClick: () => {
										props.store.dismissAllQuestions(visible.map((q) => q.id));
									},
									children: props.t("question.deleteAll")
								})]
							}), visible.map((q) => {
								if (questionCollapsed) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: `${client_module_css_default.questionItem} ${client_module_css_default.questionItemCollapsed}`,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: client_module_css_default.questionHeaderText,
										children: q.header ?? q.question
									})
								}, q.id);
								const options = q.options ?? [];
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: client_module_css_default.questionItem,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: client_module_css_default.questionHeader,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: client_module_css_default.questionHeaderText,
												children: q.header ?? q.question
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: client_module_css_default.questionHeaderActions,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: client_module_css_default.questionBringButton,
														disabled: bringingKey !== null,
														onClick: () => {
															bringQuestionText(buildAllText(q), `newall:${q.id}`, true);
														},
														children: bringingKey === `newall:${q.id}` ? props.t("question.bringing") : props.t("question.bringAllNew")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: client_module_css_default.questionBringButton,
														disabled: bringingKey !== null,
														onClick: () => {
															bringQuestionText(buildAllText(q), `all:${q.id}`, false);
														},
														children: bringingKey === `all:${q.id}` ? props.t("question.bringing") : props.t("question.bringAll")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: client_module_css_default.questionDelete,
														"aria-label": props.t("question.delete"),
														title: props.t("question.delete"),
														onClick: () => {
															props.store.dismissQuestion(q.id);
														},
														children: "×"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: client_module_css_default.questionBody,
											children: q.question
										}),
										q.detail !== void 0 && q.detail !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: client_module_css_default.questionDetail,
											children: q.detail
										}),
										options.map((o) => {
											const key = `${q.id}:${o.label}`;
											return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: client_module_css_default.questionOption,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
														className: client_module_css_default.questionOptionText,
														children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
															className: client_module_css_default.questionOptionLabel,
															children: o.label
														}), o.description !== void 0 && o.description !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
															className: client_module_css_default.questionOptionDesc,
															children: [" — ", o.description]
														})]
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: client_module_css_default.questionBringButton,
														disabled: bringingKey !== null,
														onClick: () => {
															bringQuestionText(buildOneText(q, o), `new:${key}`, true);
														},
														children: bringingKey === `new:${key}` ? props.t("question.bringing") : props.t("question.bringOneNew")
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														type: "button",
														className: client_module_css_default.questionBringButton,
														disabled: bringingKey !== null,
														onClick: () => {
															bringQuestionText(buildOneText(q, o), key, false);
														},
														children: bringingKey === key ? props.t("question.bringing") : props.t("question.bringOne")
													})
												]
											}, o.label);
										})
									]
								}, q.id);
							})]
						});
					})(),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: client_module_css_default.panelList,
						children: panel.items.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: client_module_css_default.panelEmpty,
							children: [props.t("panel.empty"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								style: {
									marginTop: 8,
									padding: "3px 10px",
									fontFamily: "var(--dsw-font-family)",
									fontSize: 12,
									lineHeight: "18px",
									color: "var(--dsw-alias-state-business-primary)",
									background: "transparent",
									border: "1px solid var(--dsw-alias-border-l2)",
									borderRadius: 999,
									cursor: "pointer"
								},
								onClick: () => {
									props.store.openPanel(panel.parentSessionId);
									props.store.patch({ activeChildId: null, attachment: null, messages: [], draft: "", error: null });
									const el = document.querySelector("." + client_module_css_default.panelTextarea);
									if (el instanceof HTMLTextAreaElement) el.focus();
								},
								children: props.t("panel.new")
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: client_module_css_default.panelListActions,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: client_module_css_default.panelListDeleteAll,
								onClick: disposeAll,
								children: props.t("panel.deleteAll")
							})
						}), panel.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: client_module_css_default.panelListItemRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `${client_module_css_default.panelListItem} ${item.childId === panel.activeChildId ? client_module_css_default.panelListItemActive : ""}`,
								onClick: () => {
									props.store.setActive(item.childId);
									(async () => {
										if (item.idle === true) {
											const attached = await api.attach({ childId: item.childId });
											if (!attached.ok) {
												props.store.patch({ error: attached.error?.message ?? "attach failed" });
												return;
											}
											await refreshList(props.store, props.store.getSnapshot().panel.parentSessionId);
										}
										await refreshHistory(props.store, item.childId);
									})();
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.panelListItemDot,
									"data-running": item.running ? "1" : void 0
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.panelListItemLabel,
									children: item.childId
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: client_module_css_default.panelListItemRemove,
								"aria-label": props.t("panel.delete"),
								title: props.t("panel.delete"),
								onClick: () => {
									disposeItem(item.childId);
								},
								children: "×"
							})]
						}, item.childId))] })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: client_module_css_default.panelTranscript,
						ref: scrollRef,
						children: [
							panel.messages.map((message, index) => {
								const textBlocks = message.blocks.filter((b) => b.type === "text");
								const imageBlocks = message.blocks.filter((b) => b.type === "image");
								const reasoningBlocks = message.blocks.filter((b) => b.type === "reasoning");
								const text = textBlocks.map((b) => b.type === "text" ? b.text : "").join("\n");
								const images = imageBlocks.map((b) => b.type === "image" ? { attachment: b.ref } : null).filter((x) => x !== null);
								if (message.role === "user") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: client_module_css_default.messageUser,
									children: [text !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: client_module_css_default.messageUserText,
										children: text
									}), images.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImageGallery, {
										images: images.map((image) => image.attachment),
										load: imageLoader,
										align: "end",
										labels: messageImageLabels
									})]
								}, index);
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: client_module_css_default.messageAssistant,
									"data-sidechat-role": "assistant",
									children: [
										reasoningBlocks.map((block, rIndex) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReasoningRow, {
											text: block.type === "reasoning" ? block.text : "",
											t: props.t
										}, rIndex)),
										text !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
											text,
											labels: markdownLabels
										}),
										text !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: client_module_css_default.messageActions,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: client_module_css_default.messageInsertButton,
												onClick: () => {
													props.bringToMain(text).then((ok) => {
														if (!ok) props.store.patch({ error: props.t("insert.failed") });
													});
												},
												children: props.t("insert.direct")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												type: "button",
												className: client_module_css_default.messageInsertButton,
												disabled: summarizingIndex === index,
												onClick: () => {
													setSummarizingIndex(index);
													props.summarizeBring(text).then((ok) => {
														setSummarizingIndex(null);
														if (!ok) props.store.patch({ error: props.t("insert.summarizeFailed") });
													});
												},
												children: summarizingIndex === index ? props.t("insert.summarizing") : props.t("insert.summarize")
											})]
										})
									]
								}, index);
							}),
							activeRunning && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: client_module_css_default.panelRunning,
								role: "status",
								"aria-live": "polite",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: client_module_css_default.panelRunningDot }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.t("panel.running") }),
									showClock && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: client_module_css_default.panelRunningClock,
										children: props.formatDuration(elapsedMs)
									})
								]
							}),
							panel.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: client_module_css_default.panelError,
								children: [
									props.t("panel.error"),
									": ",
									panel.error
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: client_module_css_default.panelComposer,
						children: [
							panel.attachment !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: client_module_css_default.panelAttachment,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.panelAttachmentText,
									children: panel.attachment
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: client_module_css_default.panelAttachmentRemove,
									onClick: () => {
										props.store.patch({ attachment: null });
									},
									children: "×"
								})]
							}),
							panel.attachments.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: client_module_css_default.panelAttachmentRail,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AttachmentRail, {
									items: panel.attachments.map((a) => ({
										id: a.id,
										previewUrl: a.previewUrl,
										alt: a.file.name || props.t("image.label"),
										removeLabel: props.t("image.remove")
									})),
									labels: attachmentRailLabels,
									onOpen: (item) => {
										const a = panel.attachments.find((x) => x.id === item.id);
										if (a !== void 0) setLightbox(a);
									},
									onRemove: (item) => {
										removeImage(item.id);
									}
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								className: client_module_css_default.panelTextarea,
								placeholder: props.t("panel.input.placeholder"),
								value: panel.draft,
								onChange: (e) => {
									props.store.patch({ draft: e.target.value });
								},
								onPaste,
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										send();
									}
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: client_module_css_default.panelToolbar,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModelSelect, {
										directory: panel.directory,
										selection: {
											provider: panel.provider,
											model: panel.model,
											effort: panel.effort
										},
										onSelect: onModelSelect,
										t: props.t
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PermissionSelect, {
										permissions: panel.permissions,
										preset: panel.preset,
										onSelect: onPresetChange,
										t: props.t
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
										label: activeRunning ? props.t("panel.stop") : props.t("panel.send"),
										side: "top",
										delayMs: 500,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: client_module_css_default.primary,
											"aria-label": activeRunning ? props.t("panel.stop") : props.t("panel.send"),
											onClick: activeRunning ? stop : send,
											children: activeRunning ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconStopFillRegular, { size: 16 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSendOutlineRegular, { size: 16 })
										})
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: client_module_css_default.panelLookup,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: panel.lookup,
									onChange: (e) => {
										props.store.patch({ lookup: e.target.checked });
									}
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.t("panel.lookup") })]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: client_module_css_default.panelFooter,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: client_module_css_default.panelDispose,
							onClick: dispose,
							children: props.t("panel.dispose")
						})
					}),
					dragActive && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DropOverlay, {
						disabled: false,
						labels: dropOverlayLabels
					}),
					lightbox !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImageLightbox, {
						src: lightbox.previewUrl,
						alt: lightbox.file.name || props.t("image.label"),
						labels: {
							dialog: props.t("image.lightboxDialog"),
							close: props.t("image.close")
						},
						onClose: () => {
							setLightbox(null);
						}
					})
				]
			});
		}
		/** The "Side chat" settings section (two switches + a prompt textarea). */
		/** Dock-mode body: the side-chat panel embedded in the built-in right sidebar's tab pane. */
		function EmbeddedSidechatPanel(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidechatPanel, {
				embedded: true,
				store: props.store,
				t: props.t,
				formatDuration: props.formatDuration,
				bringToMain: props.bringToMain,
				summarizeBring: props.summarizeBring,
				askSidechat: props.askSidechat,
				askSidechatNew: props.askSidechatNew
			});
		}
		/** The portalled shell: floating menus + the panel, switching on prefs.panelHome. */
		/**
		* The dock surface, guarded independently: it renders inside the host's
		* right-sidebar tab, so a drifted platform module must not take that sidebar
		* down with it.
		*/
		function DockPanel(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidechatErrorBoundary, {
				label: "dock",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EmbeddedSidechatPanel, { ...props })
			});
		}
		/** Always-visible launcher: opens the side chat without selecting any text. Draggable. */
		function LauncherFab(props) {
			const snap = (0, react.useSyncExternalStore)(props.store.subscribe, props.store.getSnapshot);
			const posRef = (0, react.useRef)(void 0);
			if (posRef.current === void 0) {
				posRef.current = null;
				try {
					const raw = window.localStorage.getItem("dsh-side-chat:fab-position");
					if (raw !== null) {
						const parsed = JSON.parse(raw);
						if (typeof parsed.x === "number" && typeof parsed.y === "number") posRef.current = { x: parsed.x, y: parsed.y };
					}
				} catch (error) {}
			}
			const [pos, setPos] = (0, react.useState)(posRef.current);
			const dragRef = (0, react.useRef)(null);
			const parentSessionId = snap.current ?? snap.panel.parentSessionId;
			if (parentSessionId === void 0) return null;
			const open = snap.panel.open;
			const label = open ? "收起侧边聊天" : "打开侧边聊天";
			const toggle = () => {
				if (open) {
					props.store.closePanel();
					return;
				}
				if (snap.prefs.panelHome !== "floating") props.store.setPrefs({ ...snap.prefs, panelHome: "floating" });
				props.store.openPanel(parentSessionId);
			};
			const placed = pos === null ? { right: "10px", top: "46%" } : { left: pos.x + "px", top: pos.y + "px" };
			return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				title: label,
				"aria-label": label,
				onPointerDown: (event) => {
					const rect = event.currentTarget.getBoundingClientRect();
					dragRef.current = {
						startX: event.clientX,
						startY: event.clientY,
						offsetX: event.clientX - rect.left,
						offsetY: event.clientY - rect.top,
						width: rect.width,
						height: rect.height,
						moved: false
					};
					try {
						event.currentTarget.setPointerCapture(event.pointerId);
					} catch (error) {}
				},
				onPointerMove: (event) => {
					const drag = dragRef.current;
					if (drag === null) return;
					if (!drag.moved && Math.abs(event.clientX - drag.startX) <= 3 && Math.abs(event.clientY - drag.startY) <= 3) return;
					drag.moved = true;
					const x = Math.max(4, Math.min(window.innerWidth - drag.width - 4, event.clientX - drag.offsetX));
					const y = Math.max(4, Math.min(window.innerHeight - drag.height - 4, event.clientY - drag.offsetY));
					posRef.current = { x, y };
					setPos({ x, y });
				},
				onPointerUp: (event) => {
					const drag = dragRef.current;
					dragRef.current = null;
					try {
						event.currentTarget.releasePointerCapture(event.pointerId);
					} catch (error) {}
					if (drag === null) return;
					if (drag.moved) {
						try {
							window.localStorage.setItem("dsh-side-chat:fab-position", JSON.stringify(posRef.current));
						} catch (error) {}
						return;
					}
					toggle();
				},
				style: {
					position: "fixed",
					zIndex: 2e9,
					width: "42px",
					height: "42px",
					borderRadius: "21px",
					border: "1px solid rgba(255,255,255,0.16)",
					background: "rgba(32,34,38,0.94)",
					color: "#fff",
					cursor: "pointer",
					fontSize: "17px",
					lineHeight: "1",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: "0 6px 18px rgba(0,0,0,0.38)",
					padding: "0",
					touchAction: "none",
					userSelect: "none",
					...placed
				},
				children: open ? "\u00d7" : "\ud83d\udcac"
			}), document.body);
		}
		function SideChatShell(props) {
			const snap = (0, react.useSyncExternalStore)(props.store.subscribe, props.store.getSnapshot);
			const [builtinOverlay, setBuiltinOverlay] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				const probe = () => {
					if (document.querySelector("[data-sidebar-right-panel][data-sidebar-right-open]") !== null) return true;
					const floatHost = document.querySelector("[data-sidebar-right-float-host]");
					if (floatHost !== null && floatHost.childElementCount > 0) return true;
					return false;
				};
				let active = probe();
				const apply = () => {
					const next = probe();
					if (next !== active) {
						active = next;
						setBuiltinOverlay(next);
					}
				};
				apply();
				const observer = new MutationObserver(apply);
				observer.observe(document.body, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: [
						"data-sidebar-right-open",
						"data-sidebar-right-panel",
						"data-sidebar-right-float-host"
					]
				});
				window.addEventListener("resize", apply);
				return () => {
					observer.disconnect();
					window.removeEventListener("resize", apply);
				};
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectionMenu, {
					store: props.store,
					t: props.t
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BringBackMenu, {
					store: props.store,
					t: props.t,
					bringToMain: props.bringToMain,
					summarizeBring: props.summarizeBring
				}),
				snap.mainQuestion !== null && !snap.panel.open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QuestionFab, {
					store: props.store,
					t: props.t,
					onOpen: () => {
						props.store.openPanel(snap.panel.parentSessionId);
					}
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LauncherFab, {
					store: props.store
				}),
				(snap.prefs.panelHome === "floating" || !snap.dockAvailable) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidechatPanel, {
					store: props.store,
					t: props.t,
					formatDuration: props.formatDuration,
					bringToMain: props.bringToMain,
					summarizeBring: props.summarizeBring,
					askSidechat: props.askSidechat,
					askSidechatNew: props.askSidechatNew,
					conflictHidden: builtinOverlay
				})
			] });
		}
		function SettingsSection(props) {
			const { store, t } = props;
			const { prefs } = (0, react.useSyncExternalStore)(store.subscribe, store.getSnapshot);
			const [promptDraft, setPromptDraft] = (0, react.useState)(prefs.defaultPrompt);
			(0, react.useEffect)(() => {
				setPromptDraft(prefs.defaultPrompt);
			}, [prefs.defaultPrompt]);
			const toggle = (0, react.useCallback)((patch) => {
				const previous = prefs;
				const next = {
					...previous,
					...patch
				};
				store.setPrefs(next);
				api.settingsUpdate(patch).then((result) => {
					if (!result.ok) store.setPrefs(previous);
				});
			}, [prefs, store]);
			const commitPrompt = (0, react.useCallback)(() => {
				const value = promptDraft.trim();
				if (value !== prefs.defaultPrompt) toggle({ defaultPrompt: value });
			}, [
				promptDraft,
				prefs.defaultPrompt,
				toggle
			]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: client_module_css_default.settingsSection,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: client_module_css_default.settingsRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: client_module_css_default.settingsRowText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowTitle,
								children: t("settings.lookupTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowDesc,
								children: t("settings.lookupDesc")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: client_module_css_default.settingsToggle,
							checked: prefs.lookupDefault,
							"aria-label": t("settings.lookupTitle"),
							onChange: (e) => {
								toggle({ lookupDefault: e.currentTarget.checked });
							}
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: client_module_css_default.settingsRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: client_module_css_default.settingsRowText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowTitle,
								children: t("settings.sendImmediatelyTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowDesc,
								children: t("settings.sendImmediatelyDesc")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: client_module_css_default.settingsToggle,
							checked: prefs.sendImmediately,
							"aria-label": t("settings.sendImmediatelyTitle"),
							onChange: (e) => {
								toggle({ sendImmediately: e.currentTarget.checked });
							}
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: client_module_css_default.settingsRow,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: client_module_css_default.settingsRowText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowTitle,
								children: t("settings.bringModeTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowDesc,
								children: t("settings.bringModeDesc")
							})]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: client_module_css_default.settingsBringMode,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: `${client_module_css_default.settingsBringOption} ${prefs.bringMode === "draft" ? client_module_css_default.settingsBringOptionActive : ""}`,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "dsh-side-chat-bring-mode",
								className: client_module_css_default.settingsToggle,
								checked: prefs.bringMode === "draft",
								onChange: () => {
									toggle({ bringMode: "draft" });
								}
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: client_module_css_default.settingsRowText,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowTitle,
									children: t("settings.bringModeDraftTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowDesc,
									children: t("settings.bringModeDraftDesc")
								})]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: `${client_module_css_default.settingsBringOption} ${prefs.bringMode === "context" ? client_module_css_default.settingsBringOptionActive : ""}`,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "dsh-side-chat-bring-mode",
								className: client_module_css_default.settingsToggle,
								checked: prefs.bringMode === "context",
								onChange: () => {
									toggle({ bringMode: "context" });
								}
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: client_module_css_default.settingsRowText,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowTitle,
									children: t("settings.bringModeContextTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowDesc,
									children: t("settings.bringModeContextDesc")
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: client_module_css_default.settingsRow,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: client_module_css_default.settingsRowText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowTitle,
								children: t("settings.panelHomeTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowDesc,
								children: t("settings.panelHomeDesc")
							})]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: client_module_css_default.settingsBringMode,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: `${client_module_css_default.settingsBringOption} ${prefs.panelHome === "floating" ? client_module_css_default.settingsBringOptionActive : ""}`,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "dsh-side-chat-panel-home",
								className: client_module_css_default.settingsToggle,
								checked: prefs.panelHome === "floating",
								onChange: () => {
									toggle({ panelHome: "floating" });
								}
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: client_module_css_default.settingsRowText,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowTitle,
									children: t("settings.panelHomeFloatingTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowDesc,
									children: t("settings.panelHomeFloatingDesc")
								})]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: `${client_module_css_default.settingsBringOption} ${prefs.panelHome === "sidebar-right" ? client_module_css_default.settingsBringOptionActive : ""}`,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "dsh-side-chat-panel-home",
								className: client_module_css_default.settingsToggle,
								checked: prefs.panelHome === "sidebar-right",
								onChange: () => {
									toggle({ panelHome: "sidebar-right" });
								}
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: client_module_css_default.settingsRowText,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowTitle,
									children: t("settings.panelHomeDockTitle")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: client_module_css_default.settingsRowDesc,
									children: t("settings.panelHomeDockDesc")
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: client_module_css_default.settingsRow,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: client_module_css_default.settingsRowText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowTitle,
								children: t("settings.defaultPromptTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: client_module_css_default.settingsRowDesc,
								children: t("settings.defaultPromptDesc")
							})]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
						className: client_module_css_default.settingsPromptInput,
						value: promptDraft,
						placeholder: t("settings.defaultPromptPlaceholder"),
						"aria-label": t("settings.defaultPromptTitle"),
						onChange: (e) => {
							setPromptDraft(e.currentTarget.value);
						},
						onBlur: commitPrompt
					})
				]
			});
		}
		/** Client plugin body. */
		function apply(ctx) {
			const store = createStore();
			let activeLocale = ctx.locale.getSnapshot().active;
			/**
			* The selected main-view Session. DSH 0.1.6-alpha.2 reworked Client Sessions
			* into independent instances and moved the selection off the list snapshot
			* (`sessions.list.current`, dropped) onto the ui-session scope binding;
			* older lines keep it on the list. Read the binding first, then fall back.
			*/
			const currentSessionId = () => ctx.uiSession.adapter?.current.getSnapshot().key ?? ctx.sessions.list.getSnapshot().current;
			/** Subscribe to current-Session changes on whichever face this DSH exposes. */
			const subscribeCurrentSession = (fn) => {
				const offList = ctx.sessions.list.subscribe(fn);
				const offAdapter = ctx.uiSession.adapter?.current.subscribe(fn);
				if (offAdapter === void 0) return offList;
				return () => {
					offList();
					offAdapter();
				};
			};
			/**
			* The pending interaction for one Session — DSH 0.1.6-alpha.2 moved it from
			* `uiSession.pendingInteractions` onto `uiSession.sessionStatus`; read
			* whichever face this build exposes.
			*/
			const pendingInteractionFor = (sessionId) => {
				if (ctx.uiSession.sessionStatus !== void 0) return ctx.uiSession.sessionStatus.getSnapshot().get(sessionId)?.pendingInteraction;
				return ctx.uiSession.pendingInteractions?.getSnapshot().get(sessionId);
			};
			/** Subscribe to pending-interaction changes on whichever face this DSH exposes. */
			const subscribePendingInteractions = (fn) => {
				if (ctx.uiSession.sessionStatus !== void 0) return ctx.uiSession.sessionStatus.subscribe(fn);
				if (ctx.uiSession.pendingInteractions !== void 0) return ctx.uiSession.pendingInteractions.subscribe(fn);
				return () => {};
			};
			/** Append text to the main composer draft (draft bring mode). */
			const draftBring = (text) => {
				const trimmed = text.trim();
				if (trimmed === "") return false;
				const sessionId = currentSessionId();
				if (sessionId === void 0) return false;
				try {
					const actx = ctx.sessions.scope(sessionId);
					if (actx === void 0) return false;
					const input = ctx.conversation.input.for(actx);
					const draft = input.state.getSnapshot().draft;
					input.setDraft(draft === "" ? trimmed : `${draft}\n\n${trimmed}`);
					return true;
				} catch {
					return false;
				}
			};
			/** Inject text into the main conversation as a collapsed, source-tagged context row. */
			const injectBring = async (text, summary) => {
				const trimmed = text.trim();
				if (trimmed === "") return false;
				const sessionId = currentSessionId();
				if (sessionId === void 0) return false;
				return (await api.inject({
					parentSessionId: sessionId,
					text: trimmed,
					summary
				})).ok;
			};
			/** Land text in the main conversation per the configured bring mode. */
			const landText = async (text, summaryKey) => {
				if (store.getSnapshot().prefs.bringMode === "context") return injectBring(text, translate(activeLocale, summaryKey));
				return draftBring(text);
			};
			/** Bring a reply back directly (routed through the configured mode). */
			const bringToMain = (text) => landText(text, "insert.contextSummary");
			/** Summarize text with the side chat's inherited model, then bring the summary back. */
			const summarizeBring = async (text) => {
				const trimmed = text.trim();
				if (trimmed === "") return false;
				const snap = store.getSnapshot().panel;
				if (snap.parentSessionId === "") return false;
				const result = await api.summarize({
					parentSessionId: snap.parentSessionId,
					text: trimmed,
					...snap.provider !== "" ? { provider: snap.provider } : {},
					...snap.model !== "" ? { model: snap.model } : {},
					...snap.effort !== "" ? { reasoningEffort: snap.effort } : {},
					locale: activeLocale
				});
				if (!result.ok) return false;
				return landText(result.value.summary, "insert.summarizeContextSummary");
			};
			/** Ask a piece of text in the side chat (start a new one, or continue the active one). */
			const askSidechat = async (text) => {
				const trimmed = text.trim();
				if (trimmed === "") return false;
				const parentSessionId = currentSessionId();
				if (parentSessionId === void 0) return false;
				const panel = store.getSnapshot().panel;
				const content = [{
					type: "text",
					text: trimmed
				}];
				const target = panel.activeChildId ?? panel.items[0]?.childId ?? null;
				if (target === null) {
					const result = await api.start({
						parentSessionId,
						content,
						lookupEnabled: panel.lookup,
						...panel.provider !== "" ? { provider: panel.provider } : {},
						...panel.model !== "" ? { model: panel.model } : {},
						...panel.effort !== "" ? { reasoningEffort: panel.effort } : {}
					});
					if (result.ok) {
						store.openPanel(parentSessionId);
						store.setActive(result.value.childId);
						store.patch({
							provider: result.value.provider,
							model: result.value.model,
							effort: result.value.reasoningEffort ?? ""
						});
						refreshList(store, parentSessionId);
						refreshDirectory(store);
						return true;
					}
					return false;
				}
				const childId = target;
				if (childId !== panel.activeChildId) store.setActive(childId);
				setItemRunning(store, childId, true);
				const result = await api.followup({
					childId,
					content,
					lookupEnabled: panel.lookup
				});
				if (!result.ok) {
					setItemRunning(store, childId, false);
					store.patch({ error: result.error.message });
				}
				refreshList(store, parentSessionId);
				refreshHistory(store, childId);
				return result.ok;
			};
			/** Ask a piece of text in a brand-new side chat (never reuses an existing one). */
			const askSidechatNew = async (text) => {
				const trimmed = text.trim();
				if (trimmed === "") return false;
				const parentSessionId = currentSessionId();
				if (parentSessionId === void 0) return false;
				const panel = store.getSnapshot().panel;
				const content = [{
					type: "text",
					text: trimmed
				}];
				const result = await api.start({
					parentSessionId,
					content,
					lookupEnabled: panel.lookup,
					...panel.provider !== "" ? { provider: panel.provider } : {},
					...panel.model !== "" ? { model: panel.model } : {},
					...panel.effort !== "" ? { reasoningEffort: panel.effort } : {}
				});
				if (result.ok) {
					store.openPanel(parentSessionId);
					store.setActive(result.value.childId);
					store.patch({
						provider: result.value.provider,
						model: result.value.model,
						effort: result.value.reasoningEffort ?? ""
					});
					refreshList(store, parentSessionId);
					refreshDirectory(store);
					return true;
				}
				return false;
			};
			ctx.effect(() => {
				const offZh = ctx.locale.register(LOCALE_NS, "zh", zh);
				const offEn = ctx.locale.register(LOCALE_NS, "en", en);
				const offSub = ctx.locale.subscribe(() => {
					activeLocale = ctx.locale.getSnapshot().active;
					store.patch({});
				});
				return () => {
					offZh();
					offEn();
					offSub();
				};
			}, "dsh-side-chat: dictionaries");
			api.settingsGet().then((result) => {
				if (!result.ok) return;
				const raw = result.value.value;
				if (raw === null || raw === void 0) return;
				store.setPrefs({
					lookupDefault: typeof raw.lookupDefault === "boolean" ? raw.lookupDefault : SUBCHAT_PREFS_DEFAULTS.lookupDefault,
					sendImmediately: typeof raw.sendImmediately === "boolean" ? raw.sendImmediately : SUBCHAT_PREFS_DEFAULTS.sendImmediately,
					defaultPrompt: typeof raw.defaultPrompt === "string" ? raw.defaultPrompt : SUBCHAT_PREFS_DEFAULTS.defaultPrompt,
					bringMode: raw.bringMode === "context" ? "context" : "draft",
					panelHome: raw.panelHome === "floating" ? "floating" : "sidebar-right"
				});
			});
			ctx.effect(() => {
				let lastId;
				const sync = () => {
					const next = currentSessionId();
					if (next === lastId) return;
					lastId = next;
					store.setCurrent(next);
					if (next === void 0) return;
					refreshList(store, next);
					const panel = store.getSnapshot().panel;
					if (panel.open && panel.activeChildId !== null) refreshHistory(store, panel.activeChildId);
				};
				sync();
				return subscribeCurrentSession(sync);
			}, "dsh-side-chat: follow current conversation");
			ctx.effect(() => {
				let lastQuestion = void 0;
				const read = () => {
					const sessionId = currentSessionId();
					if (sessionId === void 0) {
						store.setMainQuestion(null);
						return;
					}
					const interaction = pendingInteractionFor(sessionId);
					const question = interaction !== void 0 && (interaction.kind === "question" || interaction.kind === "plan-review") ? interaction : void 0;
					if (question === lastQuestion) return;
					lastQuestion = question;
					const questions = question?.questions ?? null;
					store.setMainQuestion(questions === null ? null : [...questions]);
				};
				read();
				const offPending = subscribePendingInteractions(read);
				const offList = subscribeCurrentSession(read);
				return () => {
					offPending();
					offList();
				};
			}, "dsh-side-chat: track main question dialog");
			ctx.effect(() => {
				const timer = window.setInterval(() => {
					if (store.getSnapshot().mainQuestion === null) return;
					const sessionId = currentSessionId();
					if (sessionId === void 0) return;
					const interaction = pendingInteractionFor(sessionId);
					if (!(interaction !== void 0 && (interaction.kind === "question" || interaction.kind === "plan-review"))) store.setMainQuestion(null);
				}, 1200);
				return () => {
					window.clearInterval(timer);
				};
			}, "dsh-side-chat: clear stale question dialog");
			ctx.effect(() => {
				let cleanup;
				let phase = "idle";
				const sync = () => {
					if (store.getSnapshot().prefs.panelHome === "sidebar-right") {
						if (phase === "docked" || phase === "unavailable") return;
						const sidebarRight = ctx.get("sidebarRight");
						const sidebarRightTabs = ctx.get("sidebarRightTabs") ?? sidebarRight?.tabs;
						if (sidebarRight === void 0 || sidebarRightTabs === void 0) {
							phase = "unavailable";
							store.setDockAvailable(false);
							store.patch({ error: translate(activeLocale, "dock.unavailable") });
							return;
						}
						store.setDockAvailable(true);
						const dockT = (key) => translate(activeLocale, key);
						const disposeType = sidebarRightTabs.register({
							id: SIDEBAR_TAB_ID,
							kind: SIDEBAR_TAB_KIND,
							priority: "extension",
							title: () => dockT("dock.title")
						});
						const disposeBody = ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
							name: "sidebar.right.pane.tab",
							key: SIDEBAR_TAB_ID,
							inject: () => ({
								store,
								t: dockT,
								formatDuration,
								bringToMain,
								summarizeBring,
								askSidechat,
								askSidechatNew
							})
						}, DockPanel));
						const launch = () => {
							try {
								sidebarRight.openTab(SIDEBAR_TAB_KIND, { revealIfOpened: true });
							} catch (error) {
								store.patch({ error: `${translate(activeLocale, "dock.openFailed")}: ${error instanceof Error ? error.message : String(error)}` });
							}
						};
						store.setDockLaunch(launch);
						cleanup = () => {
							store.setDockLaunch(null);
							disposeBody();
							disposeType();
						};
						phase = "docked";
						return;
					}
					if (phase === "idle") return;
					phase = "idle";
					store.setDockLaunch(null);
					cleanup?.();
					cleanup = void 0;
				};
				sync();
				const off = store.subscribe(sync);
				return () => {
					off();
					cleanup?.();
				};
			}, "dsh-side-chat: right-sidebar dock");
			const settingsT = (key) => translate(activeLocale, key);
			const formatDuration = (ms) => formatRunDuration(ms, activeLocale);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-side-chat",
				order: 110,
				label: () => settingsT("settingsNav"),
				inject: () => ({
					store,
					t: settingsT
				})
			}, SettingsSection));
			ctx.effect(() => {
				for (const stale of document.querySelectorAll("[data-dsh-side-chat]")) stale.remove();
				const host = document.createElement("div");
				host.setAttribute("data-dsh-side-chat", "");
				document.body.appendChild(host);
				const root = (0, react_dom_client.createRoot)(host);
				const t = (key) => translate(activeLocale, key);
				root.render(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidechatErrorBoundary, {
					label: "panel",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SideChatShell, {
						store,
						t,
						formatDuration,
						bringToMain,
						summarizeBring,
						askSidechat,
						askSidechatNew
					})
				}));
				return () => {
					root.unmount();
					host.remove();
				};
			}, "dsh-side-chat: panel mount");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map