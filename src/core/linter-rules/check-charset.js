/**
 * Linter rule "check-charset".
 *
 * Checks whether the document has `<meta charset="utf-8">` properly.
 */
import LinterRule from "../LinterRule";
import { lang as defaultLang } from "../l10n";

const name = "check-charset";
const meta = {
  en: {
    description: `Document must only contain one \`<meta>\` tag with charset set to 'utf-8'`,
    howToFix: `Add this line in your document \`<head>\` section - \`<meta charset="utf-8">\` or set charset to "utf-8" if not set already.`,
  },
};

// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

/**
 * Runs linter rule.
 *
 * @param {Object} conf The ReSpec config.
 * @param {Document} doc The document to be checked.
 */
function linterFunction(conf, doc) {
  const metas = doc.querySelectorAll("meta[charset]");
  const val = [];
  for (const meta of metas) {
    val.push(
      meta
        .getAttribute("charset")
        .trim()
        .toLowerCase()
    );
  }
  const utfExists = val.includes("utf-8");

  // only a single meta[charset] and is set to utf-8, correct case
  if (utfExists && metas.length === 1) {
    return [];
  }
  // if more than one meta[charset] tag defined along with utf-8
  // or
  // no meta[charset] present in the document
  return {
    name,
    occurrences: metas.length,
    ...meta[lang],
  };
}
export const rule = new LinterRule(name, linterFunction);
