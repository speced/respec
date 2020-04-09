// @ts-check
// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

export const name = "core/id-headers";
import { addId } from "./utils.js";
import { html } from "./import-maps.js";

export function run(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const headings = document.querySelectorAll(
    `section:not(.head):not(.introductory) h2, h3, h4, h5, h6`
  );
  for (const h of headings) {
    // prefer for ID: heading.id > parentElement.id > newly generated heading.id
    let id = h.id;
    if (!id) {
      addId(h);
      id = h.parentElement.id || h.id;
    }
    if (!conf.addSectionLinks) continue;
    h.appendChild(html`
      <a href="${`#${id}`}" class="self-link" aria-label="§"></a>
    `);
  }
}
