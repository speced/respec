/**
 * Linter rule "warn-local-ref".
 * Warns about href's that link to nonexistent id's in a spec
 */
import { lang as defaultLang } from "core/l10n";
import LinterRule from "core/LinterRule";

const name = "local-refs-exist";

const meta = {
  en: {
    description: "Broken local reference found in document.",
    howToFix: "Please fix the links mentioned.",
    help: "See developer console.",
  },
};

// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

/**
 * Runs linter rule.
 * @param {Object} config The ReSpec config.
 * @param  {Document} doc The document to be checked.
 */
function linterFunction(conf, doc) {
  const offendingElements = [...doc.querySelectorAll("a[href^='#']")].filter(
    isBrokenHyperlink
  );
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

function isBrokenHyperlink(elem) {
  const { ownerDocument: doc } = elem;
  const hash = elem.getAttribute("href");
  return !doc.getElementById(hash.substring(1));
}
