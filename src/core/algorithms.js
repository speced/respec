// @ts-check
/**
Currently used only for adding 'assert' class to algorithm lists
*/

import { fetchAsset } from "./text-loader.js";

export const name = "core/algorithms";

const cssPromise = loadStyle();

async function loadStyle() {
  try {
    return (await import("text!../../assets/algorithms.css")).default;
  } catch {
    return fetchAsset("algorithms.css");
  }
}

export async function run() {
  const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
  elements
    .filter(li => li.textContent.trim().startsWith("Assert: "))
    .forEach(li => li.classList.add("assert"));
  if (document.querySelector(".assert")) {
    const style = document.createElement("style");
    style.textContent = await cssPromise;
    document.head.appendChild(style);
  }
}
