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
    const varSet = new Set();
    section.querySelectorAll("var").forEach(variable => {
      varSet.add(variable.textContent.trim());
    });
    varSet.forEach(uniquevar => {
      const vars = Array.from(section.querySelectorAll("var")).filter(
        elem => elem.textContent.trim() == uniquevar
      );
      let datatype = null;
      vars.forEach(v => {
        if (v.dataset.type) datatype = v.dataset.type;
      });
      if (datatype) {
        vars.forEach(v => {
          v.dataset.type = datatype;
        });
      }
    });
  });
}
