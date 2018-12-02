/**
 * module: core/exporter
 * Exports a ReSpec document, based on mime type, so it can be saved, etc.
 * Also performs cleanup, removing things that shouldn't be in published documents.
 * That is, elements that have a "removeOnSave" css class.
 */

import hyperHTML from "../deps/hyperhtml";
import { pub } from "./pubsubhub";
import { removeReSpec } from "./utils";

const mimeTypes = new Map([["text/html", "html"], ["application/xml", "xml"]]);

/**
 * Creates a dataURI from a ReSpec document. It also cleans up the document
 * removing various things.
 *
 * @param {String} mimeType mimetype. one of `mimeTypes` above
 * @param {Document} doc document to export. useful for testing purposes
 * @returns a stringified data-uri of document that can be saved.
 */
export function rsDocToDataURL(mimeType, doc = document) {
  const format = mimeTypes.get(mimeType);
  if (!format) {
    const validTypes = [...mimeTypes.values()].join(", ");
    const msg = `Invalid format: ${mimeType}. Expected one of: ${validTypes}.`;
    throw new TypeError(msg);
  }
  const data = serialize(format, doc);
  const encodedString = encodeURIComponent(data);
  return `data:${mimeType};charset=utf-8,${encodedString}`;
}

function serialize(format, doc) {
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
  const respecVersion = `ReSpec ${window.respecVersion || "Developer Channel"}`;
  const metaGenerator = hyperHTML`
    <meta name="generator" content="${respecVersion}">
  `;

  insertions.appendChild(metaGenerator);
  head.insertBefore(insertions, head.firstChild);
  pub("beforesave", documentElement);
}

function cleanupHyper({ documentElement: node }) {
  // collect first, or walker will cease too early
  /** @param {Comment} comment */
  const filter = comment =>
    comment.textContent.startsWith("-") && comment.textContent.endsWith("%");
  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_COMMENT,
    filter
  );
  for (const comment of [...walkTree(walker)]) {
    comment.remove();
  }
}

/**
 * @param {TreeWalker} walker
 */
function* walkTree(walker) {
  while (walker.nextNode()) {
    yield walker.currentNode;
  }
}
