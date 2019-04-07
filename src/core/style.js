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
export const name = "core/style";

// Opportunistically inserts the style, with the chance to reduce some FOUC
const styleElement =
  typeof document !== "undefined" ? insertStyle(document, {}) : undefined;

/**
 * @return {Promise<string>}
 */
async function loadStyle() {
  try {
    return (await import("text!../../assets/respec2.css")).default;
  } catch {
    const loader = await import("./asset-loader");
    return loader.loadAssetOnNode("respec2.css");
  }
}

/**
 * @param {Document} document
 * @param {*} conf
 */
async function insertStyle(document, conf) {
  if (conf.noReSpecCSS) {
    return;
  }
  const styleElement = document.createElement("style");
  styleElement.id = "respec-mainstyle";
  styleElement.textContent = await loadStyle();
  document.head.appendChild(styleElement);
  return styleElement;
}

export default async function({ document, configuration }) {
  if (!styleElement) {
    await insertStyle(document, configuration);
  } else if (configuration.noReSpecCSS) {
    (await styleElement).remove();
  }
}
