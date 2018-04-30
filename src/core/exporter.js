// module: exporter
// used in ui/save-html

import { removeReSpec } from "core/utils";
import { pub } from "core/pubsubhub";

export function serialize(format = "html", doc = document) {
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

export async function exportDocument(format, mimeType, doc = document) {
  await doc.respecIsReady;
  const dataURL = toDataURL(serialize(format, doc), mimeType);
  const encodedString = dataURL.replace(/^data:\w+\/\w+;charset=utf-8,/, "");
  const decodedString = decodeURIComponent(encodedString);
  return decodedString;
}

export function toDataURL(data, mimeType = "text/html") {
  const encodedString = encodeURIComponent(data);
  return `data:${mimeType};charset=utf-8,${encodedString}`;
}

// Create and download an EPUB 3 version of the content
// Using (by default) the EPUB 3 conversion service set up at labs.w3.org/epub-generator
// For more details on that service, see https://github.com/iherman/respec2epub
export function makeEPubHref() {
  const url = new URL(
    "https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py"
  );
  url.searchParams.append("type", "respec")
  url.searchParams.append("url", document.location.href);
  return url.href;
}

function cleanup(cloneDoc) {
  const { head, body, documentElement } = cloneDoc;
  cleanupHyper(documentElement);
  Array.from(
    cloneDoc.querySelectorAll(".removeOnSave, #toc-nav")
  ).forEach(elem => elem.remove());
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
    metaCharset = cloneDoc.createElement("meta");
    metaCharset.setAttribute("charset", "utf-8");
  }
  insertions.appendChild(metaCharset);
  // Add meta generator
  const metaGenerator = cloneDoc.createElement("meta");
  metaGenerator.name = "generator";
  metaGenerator.content =
    "ReSpec " + window.respecVersion || "Developer Channel";
  insertions.appendChild(metaGenerator);
  head.insertBefore(insertions, head.firstChild);
  pub("beforesave", documentElement);
}

function cleanupHyper(node) {
  // collect first, or walker will cease too early
  const comments = [...walkTree(
    node, NodeFilter.SHOW_COMMENT,
    comment => comment.textContent.startsWith("_hyper")
  )];
  for (const comment of comments) {
    comment.parentNode.removeChild(comment);
  }
}

function* walkTree(...args) {
  const walker = document.createTreeWalker(...args);
  while (walker.nextNode()) {
    yield walker.currentNode;
  }
}
