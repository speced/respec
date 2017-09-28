/**
 * This Module adds a metatag description to the document, based on the
 * first paragraph of the abstract.
 */

export const name = "core/seo";

export async function run(conf, doc, cb) {
  // This is not critical, so let's continue other processing first
  cb();
  await doc.respecIsReady;
  const firstParagraph = doc.querySelector("#abstract p:first-of-type");
  if (!firstParagraph) {
    return; // no abstract, so nothing to do
  }
  const insertMetaDescription = makeDescriptionInserter(firstParagraph);
  if (window.requestIdleCallback) {
    window.requestIdleCallback(insertMetaDescription);
  } else {
    insertMetaDescription();
  }
}

function makeDescriptionInserter(firstParagraph) {
  return () => {
    // Normalize whitespace: trim, remove new lines, tabs, etc.
    const doc = firstParagraph.ownerDocument;
    const content = firstParagraph.textContent.replace(/\s+/, " ").trim();
    const metaElem = doc.createElement("meta");
    metaElem.name = "description";
    metaElem.content = content;
    doc.head.appendChild(metaElem);
  };
}
