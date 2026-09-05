// @ts-check
// Module core/insert-style
// One place where ReSpec adds its own `<style>` elements to the head.
//
// Add ReSpec's stylesheets through here and nowhere else: `disableDarkStyles()` rewrites what
// this module inserted, so anything added directly is beyond its reach, and a spec author's
// own `<style>` stays out of its reach for the same reason.

export const name = "core/insert-style";

/** The stylesheets `disableDarkStyles()` rewrites. */
const inserted = new Set();

let darkStylesDisabled = false;

/**
 * Removes every `@media` block that requests a dark color scheme.
 *
 * CSS with nothing to remove comes back untouched. Anything else comes back through the
 * browser's CSS parser, so formatting is normalized, comments are gone, and whatever the
 * parser rejects is dropped rather than passed along.
 *
 * `not (prefers-color-scheme: dark)` is kept: it forces a page light, so removing it would do
 * the opposite of what the caller asked for.
 *
 * @param {string} css
 * @returns {string}
 */
export function stripDarkMediaBlocks(css) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  const kept = [];
  let removed = false;
  for (const rule of sheet.cssRules) {
    const isDarkMedia =
      rule instanceof CSSMediaRule &&
      /prefers-color-scheme\s*:\s*dark/i.test(rule.conditionText) &&
      !/\bnot\b/i.test(rule.conditionText);
    if (isDarkMedia) removed = true;
    else kept.push(rule.cssText);
  }
  return removed ? kept.join("\n") : css;
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
 * Removes ReSpec's dark rules from the stylesheets it has already added, and from any added
 * afterwards.
 *
 * Existing ones have to be revisited because profile modules are imported with `Promise.all`,
 * so several insert their stylesheets before any config is read.
 *
 * The flag lives for the life of the realm. Every path today builds one document per realm, so
 * a second spec in the same realm would inherit it.
 */
export function disableDarkStyles() {
  darkStylesDisabled = true;
  inserted.forEach(style => {
    const stripped = stripDarkMediaBlocks(style.textContent);
    if (stripped !== style.textContent) style.textContent = stripped;
  });
}
