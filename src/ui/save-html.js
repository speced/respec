// @ts-check
// Module ui/save-html
// Saves content to HTML when asked to
import { concatDate, getIntlData, showWarning } from "../core/utils.js";
import { html } from "../core/import-maps.js";
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
  zh: {
    save_snapshot: "导出",
  },
};
const l10n = getIntlData(localizationStrings);

const downloadLinks = [
  {
    id: "respec-save-as-html",
    ext: "html",
    title: "HTML",
    type: "text/html",
    get href() {
      return rsDocToDataURL(this.type);
    },
  },
  {
    id: "respec-save-as-xml",
    ext: "xhtml",
    title: "XML",
    type: "application/xml",
    get href() {
      return rsDocToDataURL(this.type);
    },
  },
  {
    id: "respec-save-as-epub",
    ext: "epub",
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

/**
 * @param {typeof downloadLinks[0]} details
 */
function toDownloadLink(details, conf) {
  const { id, href, ext, title, type } = details;
  const date = concatDate(conf.publishDate || new Date());
  const filename = [conf.specStatus, conf.shortName || "spec", date].join("-");
  return html`<a
    href="${href}"
    id="${id}"
    download="${filename}.${ext}"
    type="${type}"
    class="respec-save-button"
    onclick=${() => ui.closeModal()}
    >${title}</a
  >`;
}

export function run(conf) {
  const saveDialog = {
    async show(button) {
      await document.respec.ready;
      const div = html`<div class="respec-save-buttons">
        ${downloadLinks.map(details => toDownloadLink(details, conf))}
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
}

/**
 * @param {*} _
 * @param {string} mimeType
 */
export function exportDocument(_, mimeType) {
  const msg =
    "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed.";
  const hint = "Use core/exporter `rsDocToDataURL()` instead.";
  showWarning(msg, name, { hint });
  return rsDocToDataURL(mimeType);
}
