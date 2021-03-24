// @ts-check
/**
 * Module core/data-type
 * Propagates data type of a <var> to subsequent instances within a section.
 * Also adds the CSS for the data type tooltip.
 * Set `conf.highlightVars = true` to enable.
 */
import css from "../styles/datatype.css.js";

export const name = "core/data-type";

export function run(conf) {
  if (!conf.highlightVars) {
    return;
  }

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  let section = null;
  const varMap = new Map();
  /** @type {NodeListOf<HTMLElement>} */
  const variables = document.querySelectorAll("section var");
  for (const varElem of variables) {
    const currentSection = varElem.closest("section");
    if (section !== currentSection) {
      section = currentSection;
      varMap.clear();
    }
    if (varElem.dataset.type) {
      varMap.set(varElem.textContent.trim(), varElem.dataset.type);
      continue;
    }
    const type = varMap.get(varElem.textContent.trim());
    if (type) varElem.dataset.type = type;
  }
}
