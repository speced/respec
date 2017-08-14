/**
 * This Module adds a metatag description to the document, based on the 
 * first paragraph of the abstract.
 */
export async function run(conf, doc, cb) {
  const metaDescription = doc.querySelector("#abstract p:first-of-type");
  if (!metaDescription) {
    return; // no abstract, so abort early
  }
  // This is not critical, so let's continue other processing first:
  cb();
  await doc.respecIsReady;
  const metaElem = doc.createElement("meta");
  metaElem.name = "description";
  metaElem.content = metaDescription.textContent;
  doc.head.appendChild(metaElem);
}
