// Module ui/save-html
// Saves content to HTML when asked to
import { xmlEscape, removeReSpec } from "core/utils";
import { pub } from "core/pubsubhub";
import { ui } from "core/ui";
import { l10n, lang } from "core/l10n";
export const name = "ui/save-html";

const downloadLinks = [
  {
    id: "respec-save-as-html",
    title: `${l10n[lang].save_as} HTML`,
    get href() {
      return toDataURL(serialize());
    },
    fileName: "index.html",
  },
  {
    id: "respec-save-as-xml",
    fileName: "index.xhtml",
    title: `${l10n[lang].save_as} XML`,
    type: "application/xml",
    get href() {
      return toDataURL(serialize("xml"), this.type);
    },
  },
  {
    id: "respec-save-as-epub",
    fileName: "spec.epub",
    title: `${l10n[lang].save_as} EPUB 3`,
    type: "application/epub+zip",
    href: makeEPubHref(),
  },
];
const supportsDownload = "download" in document.createElement("a");
let button;
if (supportsDownload) {
  button = ui.addCommand(
    l10n[lang].save_snapshot,
    "ui/save-html",
    "Ctrl+Shift+Alt+S",
    "💾"
  );
}

function toDataURL(data, mimeType = "text/html") {
  const encodedString = encodeURIComponent(data);
  return `data:${mimeType};charset=utf-8,${encodedString}`;
}

function serialize(format = "html") {
  const cloneDoc = document.cloneNode(true);
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

// Create and download an EPUB 3 version of the content
// Using (by default) the EPUB 3 conversion service set up at labs.w3.org/epub-generator
// For more details on that service, see https://github.com/iherman/respec2epub
function makeEPubHref() {
  const url = new URL(
    "https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py"
  );
  const params = new URLSearchParams({
    type: "respec",
    url: document.location.href,
  });
  return `${url}?${params}`;
}

function cleanup(cloneDoc) {
  const { head, body, documentElement } = cloneDoc;
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

function toDownloadLink(
  { id, href, fileName, title, type = "" } = { type: "" }
) {
  const a = document.createElement("a");
  a.classList.add("respec-save-button");
  a.id = id;
  a.href = href;
  a.download = fileName;
  a.type = type;
  a.addEventListener("click", () => {
    ui.closeModal();
  });
  const render = hyperHTML.bind(a);
  return render`
    ${title}
  `;
}

const div = document.createElement("div");
div.classList.add("respec-save-buttons");
const dialogRender = hyperHTML.bind(div);
const saveDialog = {
  show(button) {
    document.respecIsReady.then(() => {
      dialogRender`
        ${downloadLinks.map(toDownloadLink)}
      `;
      ui.freshModal(l10n[lang].save_snapshot, div, button);
    });
  },
};

export function exportDocument(format, mimeType) {
  // Bug in babel won't export async function for some reason?
  return document.respecIsReady.then(() => {
    const dataURL = toDataURL(serialize(format), mimeType);
    const encodedString = dataURL.replace(/^data:\w+\/\w+;charset=utf-8,/, "");
    const decodedString = decodeURIComponent(encodedString);
    return decodedString;
  });
}

export function show() {
  if (!supportsDownload) {
    return;
  }
  saveDialog.show(button);
}
