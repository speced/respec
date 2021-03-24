// @ts-check
/**
Currently used only for adding 'assert' class to algorithm lists
*/
import css from "../styles/algorithms.css.js";

export const name = "core/algorithms";

export function run() {
  const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
  elements
    .filter(li => li.textContent.trim().startsWith("Assert: "))
    .forEach(li => li.classList.add("assert"));
  if (document.querySelector(".assert")) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
}
