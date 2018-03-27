/**
 * Linter rule "check-period". Makes sure the there are no periods missing at the end of a <p>
 *   in the ReSpec config.
 */
import { lang as defaultLang } from "core/l10n";
import LinterRule from "core/LinterRule";

const name = "period-in-p";

const meta = {
  en: {
    description: "`<p>` tags should end with a period",
    howToFix: "Please put a period at the end of this `<p>` tag",
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
  
  const offendingMembers = Array.from(doc.querySelectorAll("p"))
    // this gives us all paragraphs that don't end with a period
    .filter(key => !key.textContent.trim().split("tests")[0].endsWith("."))
    .reduce((collector, key) => collector.concat(key), []);
  
  if (!offendingMembers.length) {
    return [];
  }
  
  const result = {
    name,
    occurrences: offendingMembers.length,
    ...meta[lang],
  };
  result.howToFix +=
    offendingMembers.map(item => "`" + item + "`").join(", ") + ".";
  return result;
}
console.log("k")
export const rule = new LinterRule(name, lintingFunction);
