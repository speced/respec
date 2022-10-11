// @ts-check
/**
Currently used only for adding 'assert' class to algorithm lists
*/
import css from "../styles/algorithms.css.js";
import { html } from "./import-maps.js";

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

    // Link "Assert" to https://infra.spec.whatwg.org/#assert
    const textNode = li.firstChild;
    if (
      textNode instanceof Text &&
      textNode.textContent.startsWith("Assert: ")
    ) {
      textNode.textContent = textNode.textContent.replace("Assert: ", "");
      li.prepend(
        html`<a href="https://infra.spec.whatwg.org/#assert">Assert</a>`,
        ": "
      );
    }
  }

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}
