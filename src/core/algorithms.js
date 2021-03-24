// @ts-check
/**
Currently used only for adding 'assert' class to algorithm lists
*/

import { fetchAsset } from "./text-loader.js";

export const name = "core/algorithms";

export async function prepare() {
  const style = document.createElement("style");
  style.id = "respec-css-algorithms";
  style.textContent = await loadStyle();
  document.head.appendChild(style);
}

export async function run() {
  const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
  elements
    .filter(li => li.textContent.trim().startsWith("Assert: "))
    .forEach(li => li.classList.add("assert"));
  if (!document.querySelector(".assert")) {
    document.getElementById("respec-css-algorithms").remove();
  }
}

async function loadStyle() {
  try {
    return (await import("text!../../assets/algorithms.css")).default;
  } catch {
    return fetchAsset("algorithms.css");
  }
}
