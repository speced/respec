// @ts-check
import html from "../../../js/html-template";
import { showInlineWarning } from "../../core/utils";

export default obj => {
  /** @type {HTMLAnchorElement} */
  const a = html`
    <a href="${obj.url || ""}" class="logo"></a>
  `;
  if (!obj.alt) {
    showInlineWarning(a, "Found spec logo without an `alt` attribute");
  }
  a.appendChild(html`
    <img
      id="${obj.id}"
      alt="${obj.alt}"
      width="${obj.width}"
      height="${obj.height}"
    />
  `);
  // avoid triggering 404 requests from dynamically generated
  // hyperHTML attribute values
  a.querySelector("img").src = obj.src;
  return a;
};
