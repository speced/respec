// @ts-check
// Module core/style
// Inserts the CSS that ReSpec uses into the document.
//
// IMPORTANT NOTE
//  To add you own styles, create a plugin that declares the css as a dependency
//  and create a build of your new ReSpec profile.
//
// CONFIGURATION
//  - noReSpecCSS: if you're using a profile that loads this module but you don't want
//    the style, set this to true
import { fetchAsset } from "./text-loader.js";
export const name = "core/style";

async function loadStyle() {
  try {
    return (await import("text!../../assets/respec.css")).default;
  } catch {
    return fetchAsset("respec.css");
  }
}

async function insertStyle() {
  const styleElement = document.createElement("style");
  styleElement.id = "respec-mainstyle";
  styleElement.textContent = await loadStyle();
  document.head.appendChild(styleElement);
  return styleElement;
}

export async function prepare(conf) {
  if (!conf.noReSpecCSS) {
    // Insert style early to reduce FOUC
    await insertStyle();
  }
}

export async function run(_conf) {
  /** nothing to do */
}
