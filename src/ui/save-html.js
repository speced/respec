// Module ui/save-html
// Saves content to HTML when asked to
import { ui } from "core/ui";
import { l10n, lang } from "core/l10n";
import { pub } from "core/pubsubhub";
import { exportDocument as newExportDoc } from "core/exporter";

export const name = "ui/save-html";

const downloadLinks = [
  {
    id: "respec-save-as-html",
    fileName: "index.html",
    title: "HTML",
    type: "text/html",
    get href() {
      return newExportDoc(this.type);
    },
  },
  {
    id: "respec-save-as-xml",
    fileName: "index.xhtml",
    title: "XML",
    type: "application/xml",
    get href() {
      return newExportDoc(this.type);
    },
  },
  {
    id: "respec-save-as-epub",
    fileName: "spec.epub",
    title: "EPUB 3",
    type: "application/epub+zip",
    get href() {
      return makeEPubHref();
    },
  },
];

function toDownloadLink(
  { id, href, fileName, title, type = "" } = { type: "" }
) {
  return hyperHTML`
    <a
      href="${href}"
      id="${id}"
      download="${fileName}"
      type="${type}"
      class="respec-save-button"
      onclick=${() => ui.closeModal()}
    >${title}</a>`;
}

const saveDialog = {
  show(button) {
    document.respecIsReady.then(() => {
      const div = hyperHTML`
        <div class="respec-save-buttons">
          ${downloadLinks.map(toDownloadLink)}
        </div>`;
      ui.freshModal(l10n[lang].save_snapshot, div, button);
    });
  },
};

const supportsDownload = "download" in HTMLAnchorElement.prototype;
let button;
if (supportsDownload) {
  button = ui.addCommand(
    l10n[lang].save_snapshot,
    "ui/save-html",
    "Ctrl+Shift+Alt+S",
    "💾"
  );
}

export function show() {
  if (!supportsDownload) return;
  saveDialog.show(button);
}

export function exportDocument(format, mimeType) {
  const msg =
    "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed. " +
    "Use core/exporter `exportDocument()` instead.";
  pub("warn", msg);
  console.warn(msg);
  newExportDoc(mimeType);
}

// Create and download an EPUB 3 version of the content
// Using (by default) the EPUB 3 conversion service set up at labs.w3.org/epub-generator
// For more details on that service, see https://github.com/iherman/respec2epub
function makeEPubHref() {
  const url = new URL(
    "https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py"
  );
  url.searchParams.append("type", "respec");
  url.searchParams.append("url", document.location.href);
  return url.href;
}
