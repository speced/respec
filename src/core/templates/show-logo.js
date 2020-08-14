// @ts-check
import { html } from "../../core/import-maps.js";
import { showInlineWarning } from "../../core/utils.js";

/**
 * @param {object} logo
 * @param {string} logo.src
 * @param {string} logo.url
 * @param {string} logo.alt
 * @param {string} [logo.id]
 * @param {number} [logo.width]
 * @param {number} [logo.height]
 */
export default function showLogo(logo) {
  /** @type {HTMLAnchorElement} */
  const a = html`<a href="${logo.url || ""}" class="logo"></a>`;
  if (!logo.alt) {
    showInlineWarning(a, "Found spec logo without an `alt` attribute");
  }
  /** @type {HTMLImageElement} */
  const img = html`<img
    id="${logo.id}"
    alt="${logo.alt}"
    width="${logo.width}"
    height="${logo.height}"
  />`;
  // avoid triggering 404 requests from dynamically generated
  // hyperHTML attribute values
  img.src = logo.src;
  a.append(img);
  return a;
}
