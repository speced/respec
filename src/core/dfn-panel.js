// Constructs "dfn panels" which show all the local references to a dfn and a
// self link to the selected dfn. Based on Bikeshed's dfn panels at
// https://github.com/tabatkins/bikeshed/blob/ef44162c2e/bikeshed/dfnpanels.py
import { fetchAsset, fetchBase } from "./text-loader.js";

export const name = "core/dfn-panel";

export async function run() {
  const style = document.createElement("style");
  style.textContent = await loadStyle();
  document.head.insertBefore(style, document.querySelector("link"));

  const script = document.createElement("script");
  script.textContent = await loadScript();
  document.body.append(script);
}

async function loadStyle() {
  try {
    return (await import("text!../../assets/dfn-panel.css")).default;
  } catch {
    return fetchAsset("dfn-panel.css");
  }
}

async function loadScript() {
  try {
    return (await import("text!./dfn-panel.runtime.js")).default;
  } catch {
    return fetchBase("./src/core/dfn-panel.runtime.js");
  }
}
