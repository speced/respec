/**
 * Linter rule "check-punctuation". Makes sure the there are no punctuations missing at the end of a <p>
 *   in the ReSpec config.
 */
import { lang as defaultLang } from "core/l10n";
import LinterRule from "core/LinterRule";

const name = "check-punctuation";
const punctuationMarks = [".", ":", "!", "?"];

const meta = {
  en: {
    description: `<p> tags should end with either of ${punctuationMarks} `,
    howToFix: `Please append ${punctuationMarks} at the end of this <p> tag`,
  },
};
// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

/**
 * Runs linter rule.
 *
 * @param {Object} config The ReSpec config.
 * @param  {Document} doc The document to be checked.
 */
function lintingFunction(conf, doc) {
  
  // ensures that either a string ends with one of [.!?:] or is empty
  const punctuatingRegExp = new RegExp(`[${punctuationMarks.join("")}]$|^ *$`, "m");
  
  const offendingElements = Array.from(doc.querySelectorAll("p:not(#back-to-top)"))
    .filter((elem) => !(punctuatingRegExp.test(elem.textContent)));
  
  const result = {
    name,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta[lang],
  };
  
  return result;
}
export const rule = new LinterRule(name, lintingFunction);
