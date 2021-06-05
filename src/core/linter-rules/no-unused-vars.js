// @ts-check
/**
 * Linter rule "no-unused-vars".
 *
 * Checks that an variable is used if declared (the first use is treated as
 * declaration).
 */
import { getIntlData, norm, showWarning } from "../utils.js";

const ruleName = "no-unused-vars";
export const name = "core/linter-rules/no-unused-vars";

const localizationStrings = {
  en: {
    msg: "Variable was defined, but never used.",
    hint: "Add a `data-ignore-unused` attribute to the `<var>`.",
  },
};
const l10n = getIntlData(localizationStrings);

export function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  const offendingElements = [];

  /**
   * Check if a <section> contains a `".algorithm"`
   *
   * The selector matches:
   * ``` html
   * <section><ul class="algorithm"></ul></section>
   * <section><div><ul class="algorithm"></ul></div></section>
   * ```
   * The selector does not match:
   * ``` html
   * <section><section><ul class="algorithm"></ul></section></section>
   * ```
   * @param {HTMLElement} section
   */
  const sectionContainsAlgorithm = section =>
    !!section.querySelector(
      ":scope > :not(section) ~ .algorithm, :scope > :not(section) .algorithm"
    );

  for (const section of document.querySelectorAll("section")) {
    if (!sectionContainsAlgorithm(section)) continue;

    /**
     * `<var>` in this section, but excluding those in child sections.
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

  if (offendingElements.length) {
    showWarning(l10n.msg, name, {
      hint: l10n.hint,
      elements: offendingElements,
    });
  }
}
