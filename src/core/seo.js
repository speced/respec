// @ts-check
/**
 * This Module adds a metatag description to the document, based on the
 * first paragraph of the abstract.
 */
import { docDescription } from "./utils.js";

export const name = "core/seo";

export function run() {
  const content = docDescription();
  if (!content) {
    return;
  }
  const metaElem = document.createElement("meta");
  metaElem.name = "description";
  metaElem.content = content;
  document.head.appendChild(metaElem);
}
