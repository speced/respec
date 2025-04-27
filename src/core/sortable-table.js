// @ts-check
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
  script.id = "respec-dfn-panel";
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
