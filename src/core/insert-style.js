// @ts-check
// Module core/insert-style
// One place where ReSpec adds its own `<style>` elements to the head.
//
// Going through here is also what lets `disableDarkStyles()` rewrite ReSpec's CSS without
// ever reading the spec author's: this module only sees strings ReSpec handed it.

export const name = "core/insert-style";

/** The elements this module created, so `disableDarkStyles` can revisit them. */
const inserted = new Set();

let darkStylesDisabled = false;

/**
 * Removes every `@media` block that requests a dark color scheme.
 *
 * Pass only ReSpec's own CSS. This counts braces rather than parsing, so a `{` or `}` inside
 * a string or a comment miscounts the depth. An unterminated block is left alone rather than
 * truncating the sheet, but a comment holding a dark `@media` opener still swallows the rules
 * after it.
 *
 * @param {string} css
 * @returns {string}
 */
export function stripDarkMediaBlocks(css) {
  // `(?!\s*not\b)` because `not (prefers-color-scheme: dark)` is what keeps a page light:
  // deleting it would do the opposite of what the caller asked for.
  const opener =
    /@media(?!\s*not\b)[^{]*prefers-color-scheme\s*:\s*dark[^{]*\{/gi;
  let out = "";
  let copiedTo = 0;
  let match;
  while ((match = opener.exec(css)) !== null) {
    let depth = 1;
    let i = opener.lastIndex;
    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }
    // Depth still open means the braces never balanced, so the end of the block is unknown.
    // Copying up to `i` here would delete every rule after it, silently.
    if (depth > 0) break;
    out += css.slice(copiedTo, match.index);
    copiedTo = i;
    opener.lastIndex = i;
  }
  return copiedTo === 0 ? css : out + css.slice(copiedTo);
}

/**
 * Add one of ReSpec's stylesheets to the head.
 *
 * @param {string} css
 * @param {object} [options]
 * @param {string} [options.id] when something needs to find the element again
 * @param {string} [options.className]
 * @param {Element|null} [options.before] insert ahead of this node; a null anchor appends
 * @returns {HTMLStyleElement} the inserted element
 */
export function insertStyle(css, { id, className, before } = {}) {
  const style = document.createElement("style");
  if (id) style.id = id;
  // Explicit undefined check: `style.className = undefined` would serialize as
  // `class="undefined"`, and callers pass "" to mean "no classes".
  if (className !== undefined) style.className = className;
  style.textContent = darkStylesDisabled ? stripDarkMediaBlocks(css) : css;
  // Insert through `head` rather than `before.before(style)`, which would let the anchor
  // choose the parent and put ReSpec's CSS in the body for an anchor that lives there.
  document.head.insertBefore(style, before ?? null);
  inserted.add(style);
  return style;
}

/**
 * Drop ReSpec's dark rules from the stylesheets it has already added, and from any it adds
 * afterwards.
 *
 * Revisiting the existing ones is what frees callers from caring about order: profile
 * modules are imported with `Promise.all`, so a module that inserted at import time, before
 * any config was read, still gets corrected here.
 *
 * The flag lives for the life of the realm, and every path today builds one document per
 * realm, so that is not observable. A host building two specs in one realm would carry it over.
 */
export function disableDarkStyles() {
  darkStylesDisabled = true;
  inserted.forEach(style => {
    const stripped = stripDarkMediaBlocks(style.textContent);
    if (stripped !== style.textContent) style.textContent = stripped;
  });
}
