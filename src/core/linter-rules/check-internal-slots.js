/**
 * Linter rule "check-internal-slots".
 */
import LinterRule from "../LinterRule";
import { lang as defaultLang } from "../l10n";

const name = "check-internal-slots";

const meta = {
  en: {
    description: "Internal slots should be preceded by a '.'",
    howToFix: "Add a '.' between the elements mentioned.",
    help: "See developer console.",
  },
};

// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

/**
 * Runs linter rule.
 * @param {Object} config The ReSpec config.
 * @param {Document} doc The document to be checked.
 */
function linterFunction(conf, doc) {
  const filteredElements = [...doc.querySelectorAll("var+a")].filter(
    filterElement
  );

  const offendingElements = filteredElements.filter(checkElement);

  if (!offendingElements.length) {
    return [];
  }

  return {
    name,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta[lang],
  };
}

export const rule = new LinterRule(name, linterFunction);

function filterElement({ textContent }) {
  // return true if text is an internal slot
  return /^\[\[\w+\]\]/.test(textContent);
}

function checkElement({ previousSibling }) {
  // return true if the text is not "."
  return previousSibling.textContent !== ".";
}
