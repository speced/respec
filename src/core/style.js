// @ts-check
// Module core/style
// The purpose of this module is to insert the default ReSpec CSS into the document.
// If you don't want to use the default ReSpec CSS, set the `noReSpecCSS` configuration
// option to `true`. If you want to use your own styles, create a ReSpec profile that
// includes your own styles and sets the `noReSpecCSS` configuration option to `true`.

/**
 * Module Name.
 * @type {string}
 */
export const name = "core/style";

import css from "../styles/respec.css.js";

// Opportunistically inserts the style to reduce some FOUC.
/** @type {HTMLStyleElement} */
const styleElement = insertStyle();

/**
 * Inserts the ReSpec CSS as a `style` element into the document's `head`.
 * @return {HTMLStyleElement} The `style` element that was inserted.
 */
function insertStyle() {
  const styleElement = document.createElement("style");
  styleElement.id = "respec-mainstyle";
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  return styleElement;
}

/**
 * Removes the ReSpec CSS if the `noReSpecCSS` configuration option is `true`.
 * @param {Conf} conf The document configuration object.
 */
export function run(conf) {
  if (conf.noReSpecCSS) {
    styleElement.remove();
  }
}
