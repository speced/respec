// @ts-check
// Module ui/save-html
// Saves content to HTML when asked to
import { getIntlData } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { pub } from "../core/pubsubhub.js";
import { rsDocToDataURL } from "../core/exporter.js";
import { ui } from "../core/ui.js";

export const name = "ui/save-html";

const localizationStrings = {
  en: {
    save_snapshot: "Export",
  },
  nl: {
    save_snapshot: "Bewaar Snapshot",
  },
  ja: {
    save_snapshot: "保存する",
  },
  de: {
    save_snapshot: "Exportieren",
  },
};
const l10n = getIntlData(localizationStrings);

const downloadLinks = [
  {
    id: "respec-save-as-html",
    fileName: "index.html",
    title: "HTML",
    type: "text/html",
    get href() {
      return rsDocToDataURL(this.type);
    },
  },
  {
    id: "respec-save-as-xml",
    fileName: "index.xhtml",
    title: "XML",
    type: "application/xml",
    get href() {
      return rsDocToDataURL(this.type);
    },
  },
  {
    id: "respec-save-as-epub",
    fileName: "spec.epub",
    title: "EPUB 3",
    type: "application/epub+zip",
    get href() {
      // Create and download an EPUB 3.2 version of the content
      // Using the EPUB 3.2 conversion service set up at labs.w3.org/r2epub
      // For more details on that service, see https://github.com/iherman/respec2epub
      const epubURL = new URL("https://labs.w3.org/r2epub/");
      epubURL.searchParams.append("respec", "true");
      epubURL.searchParams.append("url", document.location.href);
      return epubURL.href;
    },
  },
];

function toDownloadLink(details) {
  const { id, href, fileName, title, type } = details;
  return html`<a
    href="${href}"
    id="${id}"
    download="${fileName}"
    type="${type}"
    class="respec-save-button"
    onclick=${() => ui.closeModal()}
    >${title}</a
  >`;
}

const saveDialog = {
  async show(button) {
    await document.respecIsReady;
    const div = html`<div class="respec-save-buttons">
      ${downloadLinks.map(toDownloadLink)}
    </div>`;
    ui.freshModal(l10n.save_snapshot, div, button);
  },
};

const supportsDownload = "download" in HTMLAnchorElement.prototype;
let button;
if (supportsDownload) {
  button = ui.addCommand(l10n.save_snapshot, show, "Ctrl+Shift+Alt+S", "💾");
}

function show() {
  if (!supportsDownload) return;
  saveDialog.show(button);
}

/**
 * @param {*} _
 * @param {string} mimeType
 */
export function exportDocument(_, mimeType) {
  const msg =
    "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed. " +
    "Use core/exporter `rsDocToDataURL()` instead.";
  pub("warn", msg);
  console.warn(msg);
  return rsDocToDataURL(mimeType);
}
