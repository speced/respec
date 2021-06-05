// @ts-check
// Module ui/search-specref
// Search Specref database
import { getIntlData } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { ui } from "../core/ui.js";

const URL = "https://respec.org/specref/";

const localizationStrings = {
  en: {
    search_specref: "Search Specref",
  },
  nl: {
    search_specref: "Doorzoek Specref",
  },
  ja: {
    search_specref: "仕様検索",
  },
  de: {
    search_specref: "Spezifikationen durchsuchen",
  },
  zh: {
    search_specref: "搜索 Specref",
  },
};
const l10n = getIntlData(localizationStrings);

const button = ui.addCommand(
  l10n.search_specref,
  show,
  "Ctrl+Shift+Alt+space",
  "🔎"
);

function show() {
  const onLoad = e => e.target.classList.add("ready");
  /** @type {HTMLElement} */
  const specrefSearchUI = html`
    <iframe class="respec-iframe" src="${URL}" onload=${onLoad}></iframe>
    <a href="${URL}" target="_blank">Open Search UI in a new tab</a>
  `;
  ui.freshModal(l10n.search_specref, specrefSearchUI, button);
}
