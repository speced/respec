// @ts-check
/**
 * module: core/exporter
 * Exports a ReSpec document, based on mime type, so it can be saved, etc.
 * Also performs cleanup, removing things that shouldn't be in published documents.
 * That is, elements that have a "removeOnSave" css class.
 */

import { removeCommentNodes, removeReSpec } from "./utils.js";
import { expose } from "./expose-modules.js";
import { html } from "./import-maps.js";
import { pub } from "./pubsubhub.js";

const mimeTypes = new Map([
  ["text/html", "html"],
  ["application/xml", "xml"],
]);

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

export function serialize(format, doc) {
  const cloneDoc = doc.cloneNode(true);
  cleanup(cloneDoc);
  let result = "";
  switch (format) {
    case "xml":
      result = new XMLSerializer().serializeToString(cloneDoc);
      break;
    default: {
      prettify(cloneDoc);
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
  removeCommentNodes(cloneDoc);

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
    metaCharset = html`<meta charset="utf-8" />`;
  }
  insertions.appendChild(metaCharset);

  // Add meta generator
  const respecVersion = `ReSpec ${window.respecVersion || "Developer Channel"}`;
  const metaGenerator = html`
    <meta name="generator" content="${respecVersion}" />
  `;

  insertions.appendChild(metaGenerator);
  head.prepend(insertions);
  pub("beforesave", documentElement);
}

/** @param {Document} cloneDoc */
function prettify(cloneDoc) {
  cloneDoc.querySelectorAll("style").forEach(el => {
    el.innerHTML = `\n${el.innerHTML}\n`;
  });
  cloneDoc.querySelectorAll("head > *").forEach(el => {
    el.outerHTML = `\n${el.outerHTML}`;
  });
}

expose("core/exporter", { rsDocToDataURL });
