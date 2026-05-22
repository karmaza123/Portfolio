const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, .pf-card--link, .pf-chip, .pf-cta-btn, .rs-nav-link, .aa-back, .mp-project-item, .mp-hero-cta, .mp-contact-email, .mp-contact-link, .mp-nav-brand, .mpr-back, .mpr-contact-link, .mpr-download, .mp-nav-status--action, .mp-nav-burger, .mp-nav-drawer-close, .mp-nav-drawer-scrim, .mp-nav-drawer-links a, .mp-view-more, .mp-nav-appearance-summary, .mp-appearance-card";

const TEXT =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, td, th, dt, dd, label, em, strong, small, cite, q, span, [class*='title'], [class*='desc'], [class*='text'], [class*='label'], [class*='tag'], [class*='marquee'], [class*='stat'], [class*='caption'], [class*='summary'], .mara-label";

const SKIP =
  ".mara-cursor, .mara-noise, script, style, noscript, svg, img, canvas, video, button, input, textarea, select, [aria-hidden='true']";

type CaretHit = { offsetNode: Node; offset: number };

function caretAt(x: number, y: number): CaretHit | null {
  if ("caretPositionFromPoint" in document) {
    const pos = document.caretPositionFromPoint(x, y);
    if (pos) return { offsetNode: pos.offsetNode, offset: pos.offset };
  }

  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range;
  };
  if (doc.caretRangeFromPoint) {
    const range = doc.caretRangeFromPoint(x, y);
    if (range) return { offsetNode: range.startContainer, offset: range.startOffset };
  }

  return null;
}

export function hitAt(x: number, y: number): Element | null {
  const stack = document.elementsFromPoint?.(x, y);
  if (stack?.length) {
    for (const node of stack) {
      if (!(node instanceof Element)) continue;
      if (node.closest(".mara-cursor")) continue;
      return node;
    }
    return null;
  }

  const hit = document.elementFromPoint(x, y);
  return hit instanceof Element && !hit.closest(".mara-cursor") ? hit : null;
}

function isInteractive(el: Element | null): boolean {
  return !!el?.closest(INTERACTIVE);
}

export function isInteractiveAt(x: number, y: number): boolean {
  return isInteractive(hitAt(x, y));
}

export function isTextAt(x: number, y: number): boolean {
  const hit = hitAt(x, y);
  if (isInteractive(hit)) return false;

  const caret = caretAt(x, y);
  if (caret?.offsetNode) {
    const { offsetNode } = caret;
    if (offsetNode.nodeType === Node.TEXT_NODE && !offsetNode.textContent?.trim()) {
      return false;
    }

    const el =
      offsetNode.nodeType === Node.TEXT_NODE
        ? offsetNode.parentElement
        : offsetNode instanceof Element
          ? offsetNode
          : null;

    if (!el || el.closest(SKIP) || el.closest(INTERACTIVE)) return false;
    return true;
  }

  return !!hit?.closest(TEXT);
}
