// @ts-check
// Module core/insert-style
// One place where ReSpec adds its own `<style>` elements to the head, so the rest of the
// codebase stops hand-rolling `createElement("style")` in fifteen slightly different ways.

export const name = "core/insert-style";

/**
 * Add one of ReSpec's stylesheets to the head.
 *
 * @param {string} css
 * @param {object} [options]
 * @param {string} [options.id] when something needs to find the element again
 * @param {string} [options.className]
 * @param {Element|null} [options.before] insert ahead of this node; a null anchor appends,
 *   matching `head.insertBefore(style, null)`
 * @returns {HTMLStyleElement} the inserted element
 */
export function insertStyle(css, { id, className, before } = {}) {
  const style = document.createElement("style");
  if (id) style.id = id;
  // Explicit undefined check: `style.className = undefined` would serialize as
  // `class="undefined"`, and callers pass "" to mean "no classes".
  if (className !== undefined) style.className = className;
  style.textContent = css;
  if (before) before.before(style);
  else document.head.appendChild(style);
  return style;
}
