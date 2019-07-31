// Module ui/search-xref
// Search xref database
import { lang as defaultLang } from "../core/l10n.js";
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
  const iframe = document.createElement("iframe");
  iframe.id = "xref-ui";
  iframe.src = XREF_URL;
  iframe.onload = () => iframe.classList.add("ready");
  ui.freshModal(l10n.title, iframe, button);
}
