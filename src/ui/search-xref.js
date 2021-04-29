// @ts-check
// Module ui/search-xref
// Search xref database
import { lang as defaultLang } from "../core/l10n.js";
import { html } from "../core/import-maps.js";
import { ui } from "../core/ui.js";

const URL = "https://respec.org/xref/";

const localizationStrings = {
  en: {
    title: "Search definitions",
  },
  ja: {
    title: "定義検索",
  },
  de: {
    title: "Definitionen durchsuchen",
  },
  zh: {
    title: "搜索定义",
  },
};
const lang = defaultLang in localizationStrings ? defaultLang : "en";
const l10n = localizationStrings[lang];

const button = ui.addCommand(l10n.title, show, "Ctrl+Shift+Alt+x", "📚");

function show() {
  const onLoad = e => e.target.classList.add("ready");
  const xrefSearchUI = html`
    <iframe class="respec-iframe" src="${URL}" onload="${onLoad}"></iframe>
    <a href="${URL}" target="_blank">Open Search UI in a new tab</a>
  `;
  ui.freshModal(l10n.title, xrefSearchUI, button);
}
