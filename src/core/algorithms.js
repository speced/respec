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

    // Link "Assert" to infra spec using [=Assert=] syntax
    // Add data-cite="infra" to the li if not already citing infra in the tree
    const textNode = li.firstChild;
    if (
      textNode instanceof Text &&
      textNode.textContent.startsWith("Assert: ")
    ) {
      textNode.textContent = textNode.textContent.replace(
        "Assert: ",
        "[=Assert=]: "
      );
      // Add data-cite if infra is not already cited in the ancestor tree
      if (!li.closest("[data-cite~='INFRA' i], [data-cite~='infra' i]")) {
        li.dataset.cite = "INFRA";
      }
    }
  }

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}
