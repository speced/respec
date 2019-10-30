// @ts-check
/**
 * Module core/data-type
 * Propagates data type of a <var> to subsequent instances within a section.
 * Also adds the CSS for the data type tooltip.
 * Set `conf.highlightVars = true` to enable.
 */
import { fetchAsset } from "./text-loader.js";

export const name = "core/data-type";

const tooltipStylePromise = loadStyle();

async function loadStyle() {
  try {
    return (await import("text!../../assets/datatype.css")).default;
  } catch {
    return fetchAsset("datatype.css");
  }
}

export async function run(conf) {
  if (!conf.highlightVars) {
    return;
  }

  const style = document.createElement("style");
  style.textContent = await tooltipStylePromise;
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
