// @ts-check
/**
 * This module adds a "monetization" meta-tag to enable web-monetization.
 *
 * The meta-tag is added only to "live" documents, and is removed from generated
 * static documents.
 */
import { html } from "./import-maps.js";

export const name = "core/web-monetization";

export function run(conf) {
  if (conf.monetization === false) {
    return;
  }
  const { monetization } = conf;

  const { removeOnSave, paymentPointer } = canonicalizeConfig(monetization);

  const cssClass = removeOnSave ? "removeOnSave" : null;
  document.head.append(html`<meta
    name="monetization"
    content="${paymentPointer}"
    class="${cssClass}"
  />`);
}

/**
 * @param {object|string} rawConfig
 * - {string} paymentPointer - The payment pointer to use.
 * - {boolean} removeOnSave - Whether to remove the meta tag when the document is saved.
 */
function canonicalizeConfig(rawConfig) {
  const config = {
    paymentPointer: "$respec.org",
    removeOnSave: true,
  };
  switch (typeof rawConfig) {
    case "string":
      config.paymentPointer = rawConfig;
      break;
    case "object":
      if (rawConfig.paymentPointer) {
        config.paymentPointer = String(rawConfig.paymentPointer);
      }
      if (rawConfig.removeOnSave === false) {
        config.removeOnSave = false;
      }
      break;
  }
  return config;
}
