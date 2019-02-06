// @ts-check
/**
 * Linter rule "check-punctuation". Makes sure the there are no punctuations missing at the end of a <p>
 *   in the ReSpec config.
 */
import LinterRule from "../LinterRule";
import { lang as defaultLang } from "../l10n";

const name = "check-punctuation";
const punctuationMarks = [".", ":", "!", "?"];
const humanMarks = punctuationMarks.map(mark => `"${mark}"`).join(", ");
const meta = {
  en: {
    description: "`p` elements should end with a punctuation mark.",
    howToFix: `Please make sure \`p\` elements end with one of: ${humanMarks}.`,
  },
};
// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

/**
 * Runs linter rule.
 *
 * @param {Object} conf The ReSpec config.
 * @param  {Document} doc The document to be checked.
 * @return {import("../../core/LinterRule").LinterResult}
 */
function lintingFunction(conf, doc) {
  // Check string ends with one of ., !, ?, :, ], or is empty.
  const punctuatingRegExp = new RegExp(
    `[${punctuationMarks.join("")}\\]]$|^ *$`,
    "m"
  );
  const offendingElements = [
    ...doc.querySelectorAll("p:not(#back-to-top)"),
  ].filter(elem => !punctuatingRegExp.test(elem.textContent.trim()));
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
export const rule = new LinterRule(name, lintingFunction);
