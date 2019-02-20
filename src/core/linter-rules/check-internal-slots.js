// @ts-check
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
 * @param {Object} conf The ReSpec config.
 * @param {Document} doc The document to be checked.
 * @return {import("../../core/LinterRule").LinterResult}
 */
function linterFunction(conf, doc) {
  const offendingElements = [...doc.querySelectorAll("var+a")].filter(
    ({ previousSibling: { nodeName } }) => {
      const isPrevVar = nodeName && nodeName === "VAR";
      return isPrevVar;
    }
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
