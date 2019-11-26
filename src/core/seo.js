// @ts-check
/**
 * This Module adds a metatag description to the document, based on the
 * first paragraph of the abstract.
 */

export const name = "core/seo";

export async function run() {
  // This needs to run before JSON-LD export runs, because it relies on
  // the meta tag being present to extract the description itself.
  const firstParagraph = document.querySelector("#abstract p:first-of-type");
  if (!firstParagraph) {
    return; // no abstract, so nothing to do
  }
  insertMetaDescription(firstParagraph);
}

function insertMetaDescription(firstParagraph) {
  // Normalize whitespace: trim, remove new lines, tabs, etc.
  const doc = firstParagraph.ownerDocument;
  const content = firstParagraph.textContent.replace(/\s+/, " ").trim();
  const metaElem = doc.createElement("meta");
  metaElem.name = "description";
  metaElem.content = content;
  doc.head.appendChild(metaElem);
}
