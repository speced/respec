/**
 * Linter rule "check-punctuation". Makes sure the there are no punctuations missing at the end of a <p>
 *   in the ReSpec config.
 */
import { lang as defaultLang } from "core/l10n";
import LinterRule from "core/LinterRule";

const name = "check-punctuation";
const punctuationMarks = [".", ":", "!", "?"];
const humanMarks = punctuationMarks.map(mark => `"${mark}"`).join(", ");
const meta = {
  en: {
    description: "`<p>` tags should end with a punctuation mark.",
    howToFix: `Please make sure \`<p>\` tags end with one of: ${humanMarks}.`,
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
  
  //To help the Editor reach he offending element at once
  console.log(offendingElements);
  
  const result = {
    name,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta[lang],
  };
  
  return result;
}
export const rule = new LinterRule(name, lintingFunction);
