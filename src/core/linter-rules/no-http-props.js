/**
 * Linter rule "no-http-props". Makes sure the there are no URLs that
 * start with http:// in the ReSpec config.
 */
import { lang as defaultLang } from "core/l10n";
import LinterRule from "core/LinterRule";

const name = "no-http-props";

const meta = {
  en: {
    description: "Insecure URLs are not allowed in `respecConfig`.",
    howToFix: "Please change the following properties to 'https://': ",
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
  // We can only really perform this check over http/https
  if (!doc.location.href.startsWith("http")) {
    return [];
  }
  const offendingMembers = Object.getOwnPropertyNames(conf)
    // this check is cheap, "prevED" is w3c exception.
    .filter(key => key.endsWith("URI") || key === "prevED")
    // this check is expensive, so separate step
    .filter(key =>
      new URL(conf[key], doc.location.href).href.startsWith("http://")
    )
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

export const rule = new LinterRule(name, lintingFunction);
