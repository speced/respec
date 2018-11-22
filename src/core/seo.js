/**
 * This Module adds a metatag description to the document, based on the
 * first paragraph of the abstract.
 */

export const name = "core/seo";

export function run() {
  // This is not critical, so let's continue other processing first
  (async () => {
    await document.respecIsReady;
    const firstParagraph = document.querySelector("#abstract p:first-of-type");
    if (!firstParagraph) {
      return; // no abstract, so nothing to do
    }
    insertMetaDescription(firstParagraph);
  })();
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
