// @ts-check
// Module core/sourcemap (Experimental)
//
// Recovers a source `path:line` for offending elements, from markers a
// preprocessing step leaves behind (see `tools/sourcemap.js`).
//
// Marks/finds error locations in 3 modes: data-respec-line,
// data-respec-original attributes, and `respec-sourcemap#` comment nodes.

export const name = "core/sourcemap";

const MARKER_ATTR = "data-respec-line";
const ORIGINAL_ATTR = "data-respec-original";

/** @type {boolean | undefined} */
let isSourcemapMode;
export function inSourcemapMode() {
  if (isSourcemapMode === undefined) {
    isSourcemapMode = document.documentElement.hasAttribute(MARKER_ATTR);
  }
  return isSourcemapMode;
}

// Comment markers are already gone by the time "beforesave" fires (exporter.js
// strips all comment nodes before publishing it); this only needs to clean up
// the attributes, on the exporter's clone, so they never leak into a saved or
// exported document. Subscribed to "beforesave" by core/inlines.js: doing it
// here at module scope would risk a `pubsubhub.js` <-> `utils.js` import cycle,
// since this module is itself imported by `utils.js`.
/** @param {HTMLElement} documentElement */
export function removeMarkers(documentElement) {
  if (!inSourcemapMode()) return;
  documentElement.removeAttribute(MARKER_ATTR);
  documentElement.removeAttribute(ORIGINAL_ATTR);
  documentElement
    .querySelectorAll(`[${MARKER_ATTR}], [${ORIGINAL_ATTR}]`)
    .forEach(el => {
      el.removeAttribute(MARKER_ATTR);
      el.removeAttribute(ORIGINAL_ATTR);
    });
}

/**
 * @param {HTMLElement} el
 * @returns {string | null}
 */
export function getSourcemapLocation(el) {
  if (el.dataset?.respecLine) return el.dataset.respecLine;

  const regex = /respec-sourcemap#(.+)/;
  /** @param {Node | null} node */
  const parseComment = node => {
    if (node?.nodeType !== Node.COMMENT_NODE || !node.textContent) {
      return null;
    }
    return node.textContent.match(regex)?.[1].trim() ?? null;
  };

  const exact = parseComment(el.firstChild);
  if (exact) return exact;

  /**
   * @param {"nextSibling" | "previousSibling"} direction
   * @returns {{ loc: string, climbed: boolean } | null}
   */
  const findNearest = direction => {
    /** @type {Node | null} */
    let node = el;
    let climbed = false;
    while (node) {
      const sibling = node[direction];
      if (!sibling) {
        node = node.parentElement;
        climbed = true;
        continue;
      }
      const loc = parseComment(sibling);
      if (loc) return { loc, climbed };
      node = sibling;
    }
    return null;
  };

  const before = findNearest("previousSibling");
  const after = findNearest("nextSibling");
  if (before && after) {
    if (before.loc === after.loc) return before.loc;
    const [beforePath, beforeLine] = splitLocation(before.loc);
    const [afterPath, afterLine] = splitLocation(after.loc);
    // Same file on both ends: collapse to `path:line-line`.
    if (beforePath === afterPath) {
      return `${beforePath}:${beforeLine}-${afterLine}`;
    }
    // Different files: `el` crossed a `data-include` boundary in one
    // direction but not the other. Prefer whichever bound didn't need to
    // climb out of `el`'s own subtree to be found.
    if (before.climbed !== after.climbed) {
      return before.climbed ? after.loc : before.loc;
    }
    return after.loc;
  }
  return after?.loc ?? before?.loc ?? null;
}

/** @param {string} location `path:line` */
function splitLocation(location) {
  const i = location.lastIndexOf(":");
  return [location.slice(0, i), location.slice(i + 1)];
}

/**
 * Stashes the raw matched text (e.g. `"[= SomeTerm =]"`) on elements a
 * replacement just appended to `df`, so an error against one of them can
 * later be traced back to its source line.
 * @param {DocumentFragment} df
 * @param {number} fromIndex
 * @param {string} matched
 */
export function tagOriginalSource(df, fromIndex, matched) {
  for (const node of Array.from(df.childNodes).slice(fromIndex)) {
    if (!(node instanceof Element)) continue;
    node.setAttribute(ORIGINAL_ATTR, matched);
    node
      .querySelectorAll("*")
      .forEach(el => el.setAttribute(ORIGINAL_ATTR, matched));
  }
}

/** @param {HTMLElement} el */
export function getSourcemapOriginalText(el) {
  return el.getAttribute(ORIGINAL_ATTR) ?? null;
}
