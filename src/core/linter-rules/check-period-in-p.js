/**
 * Linter rule "check-period". Makes sure the there are no periods missing at the end of a <p>
 *   in the ReSpec config.
 */
import { lang as defaultLang } from "core/l10n";
import LinterRule from "core/LinterRule";

const name = "check-period-in-p";

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
  console.log("dsfdf")
  
  const allElements = Array.from(doc.querySelectorAll("p"));
  console.log(allElements);
  const offendingElements = Array.from(doc.querySelectorAll("p"))
    // this gives us all paragraphs that don't end with a period
    .filter(elem => !elem.textContent.trim().endsWith("."))
    .filter(elem => !elem.textContent.trim().endsWith(":"))
    .filter(elem => !elem.textContent.trim().endsWith("?"))
    .filter(elem => !elem.textContent.trim().endsWith("!"))
    .filter(elem => (elem.textContent.trim() !== ""))
    .filter(elem => !elem.textContent.trim().includes("tests:"))
    
  offendingElements.splice(-1,1); // back-to-top is always the last element.
// .filter(elem => !elem.textContent.trim())
    console.log(offendingElements)
  offendingElements.forEach(function (element) {
    console.log(element.innerText);
    
  })
  const result = {
    name,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta[lang],
  };
  
  return result;
}
export const rule = new LinterRule(name, lintingFunction);
