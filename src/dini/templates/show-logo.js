// @ts-check
import { html } from "../../core/import-maps.js";
import { showInlineWarning } from "../../core/utils.js";

export default obj => {
  /** @type {HTMLAnchorElement} */
  const a = html`<a href="${obj.url || ""}" class="logo"></a>`;
  if (!obj.alt) {
    showInlineWarning(a, "Found spec logo without an `alt` attribute");
  }
  /** @type {HTMLImageElement} */
  const img = html`<img
    id="${obj.id}"
    alt="${obj.alt}"
    width="${obj.width}"
    height="${obj.height}"
  />`;
  // avoid triggering 404 requests from dynamically generated
  // hyperHTML attribute values
  img.src = obj.src;
  a.append(img);
  return a;
};
