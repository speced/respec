// Module ui/search-xref
// Search xref database
import { lang as defaultLang } from "../core/l10n.js";
import hyperHTML from "hyperhtml";
import { ui } from "../core/ui.js";

const XREF_URL = "https://respec.org/xref/";

const localizationStrings = {
  en: {
    title: "Search xref",
  },
};
const lang = defaultLang in localizationStrings ? defaultLang : "en";
const l10n = localizationStrings[lang];

const button = ui.addCommand(l10n.title, show, "Ctrl+Shift+Alt+x", "🔎");

export function show() {
  const url = new URL(XREF_URL); // TODO: add search params
  const iframe = hyperHTML`
    <iframe src="${url}" id="xref-ui" onload="this.classList.add('ready')"></iframe>`;
  ui.freshModal(l10n.title, iframe, button);
}
