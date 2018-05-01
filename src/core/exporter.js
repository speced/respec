// module: exporter
// exports a ReSpec document as either HTML or XML

import { removeReSpec } from "core/utils";
import { pub } from "core/pubsubhub";

const mimeTypes = new Map([
  ["text/html", "html"],
  ["application/xml", "xml"],
]);

/**
 * returns a stringified data-uri of document that can be saved
 * @param {String} mimeType mimetype. one of `mimeTypes` above
 * @param {Document} doc document to export. useful for testing purposes
 */
export function exportDocument(mimeType = "text/html", doc = document) {
  Promise.resolve(doc.respecIsReady);
  const format = mimeTypes.get(mimeType);
  const dataURL = toDataURL(serialize(format, doc), mimeType);
  return dataURL;
}

function toDataURL(data, mimeType = "text/html") {
  const encodedString = encodeURIComponent(data);
  return `data:${mimeType};charset=utf-8,${encodedString}`;
}

function serialize(format = "html", doc = document) {
  const cloneDoc = doc.cloneNode(true);
  cleanup(cloneDoc);
  let result = "";
  switch (format) {
    case "xml":
      result = new XMLSerializer().serializeToString(cloneDoc);
      break;
    default: {
      if (cloneDoc.doctype) {
        result += new XMLSerializer().serializeToString(cloneDoc.doctype);
      }
      result += cloneDoc.documentElement.outerHTML;
    }
  }
  return result;
}

function cleanup(cloneDoc) {
  const { head, body, documentElement } = cloneDoc;
  cleanupHyper(cloneDoc);

  cloneDoc
    .querySelectorAll(".removeOnSave, #toc-nav")
    .forEach(elem => elem.remove());
  body.classList.remove("toc-sidebar");
  removeReSpec(documentElement);

  const insertions = cloneDoc.createDocumentFragment();

  // Move meta viewport, as it controls the rendering on mobile.
  const metaViewport = cloneDoc.querySelector("meta[name='viewport']");
  if (metaViewport && head.firstChild !== metaViewport) {
    insertions.appendChild(metaViewport);
  }

  // Move charset to near top, as it needs to be in the first 512 bytes.
  let metaCharset = cloneDoc.querySelector(
    "meta[charset], meta[content*='charset=']"
  );
  if (!metaCharset) {
    metaCharset = hyperHTML`<meta charset="utf-8">`;
  }
  insertions.appendChild(metaCharset);

  // Add meta generator
  const respecVersion = window.respecVersion || "Developer Channel";
  const metaGenerator = hyperHTML`
    <meta name="generator" content="${"ReSpec " + respecVersion}">`;

  insertions.appendChild(metaGenerator);
  head.insertBefore(insertions, head.firstChild);
  pub("beforesave", documentElement);
}

function cleanupHyper({ documentElement: node }) {
  // collect first, or walker will cease too early
  const filter = comment => comment.textContent.startsWith("_hyper");
  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_COMMENT,
    filter
  );
  for (const comment of [...walkTree(walker)]) {
    comment.remove();
  }
}

function* walkTree(walker) {
  while (walker.nextNode()) {
    yield walker.currentNode;
  }
}
