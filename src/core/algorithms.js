// @ts-check
/**
Currently used only for adding 'assert' class to algorithm lists
*/
import css from "../styles/algorithms.css.js";

export const name = "core/algorithms";

export function run() {
  const elements = Array.from(
    /** @type {NodeListOf<HTMLLIElement>} */ (
      document.querySelectorAll("ol.algorithm li")
    )
  ).filter(li => li.textContent.trim().startsWith("Assert: "));
  if (!elements.length) {
    return;
  }

  for (const li of elements) {
    li.classList.add("assert");
  }

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}
