// @ts-check
/**
 * Module core/data-type
 * Propagates data type of a <var> in all occurrences within a section.
 * Also adds the CSS for the data type tooltip.
 * Set `conf.highlightVars = true` to enable.
 */
import tooltipStyle from "text!../../assets/datatype.css";

export const name = "core/data-type";

export function run(conf) {
  if (!conf.highlightVars) {
    return;
  }

  const style = document.createElement("style");
  style.textContent = tooltipStyle;
  document.head.appendChild(style);

  document.querySelectorAll("section").forEach(section => {
    const varMap = new Map();
    const vars = section.querySelectorAll("var");
    vars.forEach(variable => {
      if (variable.dataset.type) {
        varMap.set(variable.textContent.trim(), variable.dataset.type);
      }
    });
    vars.forEach(variable => {
      const type = varMap.get(variable.textContent.trim());
      if (type) variable.dataset.type = type;
    });
  });
}
