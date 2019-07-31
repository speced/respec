// Module ui/search-xref
// Search xref database
import { lang as defaultLang } from "../core/l10n.js";
import hyperHTML from "hyperhtml";
import { ui } from "../core/ui.js";

const XREF_URL = "https://respec.org/xref/";

const localizationStrings = {
  en: {
    title: "Search definitions",
  },
};
const lang = defaultLang in localizationStrings ? defaultLang : "en";
const l10n = localizationStrings[lang];

const button = ui.addCommand(l10n.title, show, "Ctrl+Shift+Alt+x", "📚");

function show() {
  const iframe = hyperHTML`
    <iframe src="${XREF_URL}" id="xref-ui" onload="this.classList.add('ready')"></iframe>`;
  ui.freshModal(l10n.title, iframe, button);
}
