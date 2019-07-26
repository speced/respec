// Module core/informative
// Mark specific sections as informative, based on CSS
import hyperHTML from "../../js/html-template.js";

export const name = "core/informative";

const localizationStrings = {
  en: {
    informative: "This section is non-normative.",
  },
  nl: {
    informative: "Dit onderdeel is niet normatief.",
  },
};

/**
 * @param {import("../respec-document.js").RespecDocument} respecDoc
 */
export default function({ document, lang }) {
  const l10n = localizationStrings[lang] || localizationStrings.en;

  Array.from(document.querySelectorAll("section.informative"))
    .map(informative => informative.querySelector("h2, h3, h4, h5, h6"))
    .filter(heading => heading)
    .forEach(heading => {
      heading.after(hyperHTML`<p><em>${l10n.informative}</em></p>`);
    });
}
