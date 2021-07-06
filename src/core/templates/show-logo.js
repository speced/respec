// @ts-check
import { docLink, showError } from "../../core/utils.js";
import { html } from "../../core/import-maps.js";

const name = "core/templates/show-logo";

/**
 * Logo mapper. Takes a logo structure and converts it to HTML.
 *
 * @param {object} logo
 * @param {string} logo.src
 * @param {string} logo.url
 * @param {string} logo.alt
 * @param {string} [logo.id]
 * @param {number} [logo.width]
 * @param {number} [logo.height]
 * @param {number} index
 */
export default function showLogo(logo, index) {
  /** @type {HTMLAnchorElement} */
  const a = html`<a href="${logo.url || null}" class="logo"
    ><img
      alt="${logo.alt || null}"
      height="${logo.height || null}"
      id="${logo.id || null}"
      width="${logo.width || null}"
      src="${logo.src || null}"
      crossorigin
    />
  </a>`;
  const img = a.querySelector("img");
  if (!img.alt) {
    const msg = `Logo at index ${index} is missing required "\`alt\`" property.`;
    const hint = docLink`Add the missing "\`alt\`" property describing the logo. See ${"[logos]"} for more information.`;
    showError(msg, name, { hint, elements: [img] });
  }
  if (!img.src) {
    const msg = `Logo at index ${index} is missing "\`src\`" property.`;
    const hint = docLink`The \`src\` property is required on every logo. See ${"[logos]"} for more information.`;
    showError(msg, name, { hint, elements: [img] });
  }
  return a;
}
