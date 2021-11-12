// @ts-check
/**
 * Linter rule "no-altless-figures".
 *
 * Checks all figures contain a text alternative (alt).
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "no-altless-figures";
export const name = "core/linter-rules/no-altless-figures";

const localizationStrings = {
  en: {
    msg: "All informative figures must have a text alternative.",
    hint: "Check the HTML `<img>` `alt` attribute",
  },
  nl: {
    msg: "Alle informatieve figuren dienen over een tekstueel alternatief te beschikken.",
    hint: "Controleer het HTML `<img>` `alt` atribuut",
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }
  const elems = document.getElementsByTagName("img");
  const offendingElements = [...elems].filter(elem => !elem.alt);
  if (offendingElements.length) {
    showWarning(l10n.msg, name, {
      hint: l10n.hint,
      elements: offendingElements,
    });
  }
}
