// @ts-check
/**
 * Linter rule "no-unused-vars".
 *
 * Checks that an variable is used if declared (the first use is treated as
 * declaration).
 */
import LinterRule from "../LinterRule.js";
import { lang as defaultLang } from "../l10n.js";
import { norm } from "../utils.js";

const name = "no-unused-vars";

const meta = {
  en: {
    description: "All declared variables must be used at least once.",
    howToFix:
      "Change the tag to something other than `<var>` or add a `data-ignore-unused` attribute.",
    help: "See developer console.",
  },
};
// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

/**
 * @param {*} _
 * @param {Document} doc
 * @return {import("../LinterRule").LinterResult}
 */
function linterFunction(_, doc) {
  const offendingElements = [];

  for (const section of doc.querySelectorAll("section")) {
    /**
     * <var> in this section, but excluding those in child sections
     * @type {NodeListOf<HTMLElement>}
     */
    const varElems = section.querySelectorAll(":scope > :not(section) var");
    if (!varElems.length) continue;

    /** @type {Map<string, HTMLElement[]>} */
    const varUsage = new Map();
    for (const varElem of varElems) {
      const key = norm(varElem.textContent);
      const elems = varUsage.get(key) || varUsage.set(key, []).get(key);
      elems.push(varElem);
    }

    for (const vars of varUsage.values()) {
      if (vars.length === 1 && !vars[0].hasAttribute("data-ignore-unused")) {
        offendingElements.push(vars[0]);
      }
    }
  }

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
