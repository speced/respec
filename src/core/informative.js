// Module core/informative
// Mark specific sections as informative, based on CSS
import { lang as defaultLang } from "../core/l10n";
import hyperHTML from "hyperhtml";

export const name = "core/informative";

const localizationStrings = {
  en: {
    informative: "This section is non-normative.",
  },
  nl: {
    informative: "Dit onderdeel is niet normatief.",
  },
  es: {
    informative: "Esta sección no es normativa.",
  },
  pt: "Essa seção não é normativa.",
};

const lang = defaultLang in localizationStrings ? defaultLang : "en";

const l10n = localizationStrings[lang];

export function run() {
  Array.from(document.querySelectorAll("section.informative"))
    .map(informative => informative.querySelector("h2, h3, h4, h5, h6"))
    .filter(heading => heading)
    .forEach(heading => {
      heading.after(hyperHTML`<p><em>${l10n.informative}</em></p>`);
    });
}
