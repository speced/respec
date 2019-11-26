// @ts-check
/**
 * This Module adds a metatag description to the document, based on the
 * first paragraph of the abstract.
 */

export const name = "core/seo";

export function run() {
  const firstParagraph = document.querySelector("#abstract p:first-of-type");
  if (!firstParagraph) {
    return; // no abstract, so nothing to do
  }
  // Normalize whitespace: trim, remove new lines, tabs, etc.
  const content = firstParagraph.textContent.replace(/\s+/, " ").trim();
  const metaElem = document.createElement("meta");
  metaElem.name = "description";
  metaElem.content = content;
  document.head.appendChild(metaElem);
}
