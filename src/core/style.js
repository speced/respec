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
import css from "../styles/respec.css.js";

export const name = "core/style";

// Opportunistically inserts the style, with the chance to reduce some FOUC
const styleElement = insertStyle();

function insertStyle() {
  const styleElement = document.createElement("style");
  styleElement.id = "respec-mainstyle";
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  return styleElement;
}

export function run(conf) {
  if (conf.noReSpecCSS) {
    styleElement.remove();
  }
}
