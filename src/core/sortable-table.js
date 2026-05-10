// @ts-check
// Module core/sortable-table
// Adds click-to-sort behaviour to tables with class="sortable".
// The sort runs in a small runtime script injected into the document so
// that it is present in saved/exported specs as well as live ReSpec renders.
import css from "../styles/sortable-table.css.js";
import { fetchBase } from "./text-loader.js";

export const name = "core/sortable-table";

export async function run() {
  if (!document.querySelector("table.sortable")) {
    return;
  }

  const style = document.createElement("style");
  style.textContent = css;
  document.head.insertBefore(style, document.querySelector("link"));

  const script = document.createElement("script");
  script.id = "respec-sortable-table";
  script.textContent = await loadScript();
  document.body.append(script);
}

async function loadScript() {
  try {
    return (await import("text!./sortable-table.runtime.js")).default;
  } catch {
    return fetchBase("./src/core/sortable-table.runtime.js");
  }
}
