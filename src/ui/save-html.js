// Module ui/save-html
// Saves content to HTML when asked to
import { ui } from "core/ui";
import { l10n, lang } from "core/l10n";
import { pub } from "core/pubsubhub";
import {
  toDataURL,
  makeEPubHref,
  serialize,
  exportDocument as newExportDoc,
} from "core/exporter";
export const name = "ui/save-html";

const downloadLinks = [
  {
    id: "respec-save-as-html",
    title: "HTML",
    get href() {
      return toDataURL(serialize());
    },
    fileName: "index.html",
  },
  {
    id: "respec-save-as-xml",
    fileName: "index.xhtml",
    title: "XML",
    type: "application/xml",
    get href() {
      return toDataURL(serialize("xml"), this.type);
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
  newExportDoc(format, mimeType);
}
