// @ts-check
/**
Currently used only for adding 'assert' class to algorithm lists
*/

export const name = "core/algorithms";

/** @return {Promise<any>} */
async function loadStyle() {
  try {
    return await import("text!../../assets/algorithms.css");
  } catch {
    const res = await fetch(
      new URL("../../assets/algorithms.css", import.meta.url)
    );
    return await res.text();
  }
}

export async function run() {
  const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
  elements
    .filter(li => li.textContent.trim().startsWith("Assert: "))
    .forEach(li => li.classList.add("assert"));
  if (document.querySelector(".assert")) {
    const style = document.createElement("style");
    style.textContent = await loadStyle();
    document.head.appendChild(style);
  }
}
