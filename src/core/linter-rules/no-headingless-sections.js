// @ts-check
/**
 * Linter rule "no-headingless-sections".
 *
 * Checks that there are no sections in the document that don't start
 * with a heading element (h1-6).
 */
import LinterRule from "../LinterRule";
import { lang as defaultLang } from "../l10n";
const name = "no-headingless-sections";
const meta = {
  en: {
    description: "All sections must start with a `h2-6` element.",
    howToFix: "Add a `h2-6` to the offending section or use a `<div>`.",
    help: "See developer console.",
  },
  nl: {
    description: "Alle secties moeten beginnen met een `h2-6` element.",
    howToFix:
      "Voeg een `h2-6` toe aan de conflicterende sectie of gebruik een `<div>`.",
    help: "Zie de developer console.",
  },
};

// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";
const hasNoHeading = ({ firstElementChild: elem }) => {
  return elem === null || /^h[1-6]$/.test(elem.localName) === false;
};

/**
 * @param {*} conf
 * @param {Document} doc
 * @return {import("../../core/LinterRule").LinterResult}
 */
function linterFunction(conf, doc) {
  const offendingElements = [...doc.querySelectorAll("section")].filter(
    hasNoHeading
  );
  if (!offendingElements.length) {
    return;
  }
  return {
    name,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta[lang],
  };
}
export const rule = new LinterRule(name, linterFunction);
