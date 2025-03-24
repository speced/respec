// @ts-check
/**
 * Module core/highlight-vars
 * Highlights occurrences of a <var> within the algorithm or the encompassing section on click.
 * Set `conf.highlightVars = true` to enable.
 * Removes highlights from <var> if clicked anywhere else.
 * All is done while keeping in mind that exported html stays clean
 * on export.
 */
import css from "../styles/var.css.js";
import { fetchBase } from "./text-loader.js";
import { sub } from "./pubsubhub.js";

export const name = "core/highlight-vars";

export async function run(conf) {
  if (!conf.highlightVars) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.textContent = css;
  document.head.appendChild(styleElement);

  const script = document.createElement("script");
  script.id = "respec-highlight-vars";
  script.textContent = await loadScript();
  document.body.append(script);

  // remove highlights, cleanup empty class/style attributes
  sub("beforesave", (/** @type {Document} */ outputDoc) => {
    outputDoc.querySelectorAll("var.respec-hl").forEach(el => {
      const classesToRemove = [...el.classList.values()].filter(cls =>
        cls.startsWith("respec-hl")
      );
      el.classList.remove(...classesToRemove);
      if (!el.classList.length) el.removeAttribute("class");
    });
  });
}

async function loadScript() {
  try {
    return (await import("text!./highlight-vars.runtime.js")).default;
  } catch {
    return fetchBase("./src/core/highlight-vars.runtime.js");
  }
}
