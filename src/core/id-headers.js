// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

export const name = "core/id-headers";
import { addId } from "./utils.js";
import hyperHTML from "../../js/html-template.js";

/**
 * @param {import("../respec-document.js").RespecDocument} respecDoc
 */
export default function({ document, configuration: conf }) {
  const headings = document.querySelectorAll(
    `section:not(.head):not(.introductory) h2, h3, h4, h5, h6`
  );
  for (const h of headings) {
    addId(h);
    if (!conf.addSectionLinks) return;
    const id = h.parentElement.id || h.id;
    h.appendChild(hyperHTML`
      <a href="${`#${id}`}" class="self-link" aria-label="§"></a>
    `);
  }
}
