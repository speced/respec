// @ts-check
/**
 * This module adds a "monetization" meta-tag to enable web-monetization.
 *
 * The meta-tag is added only to "live" documents, and is removed from generated
 * static documents.
 */
import { html } from "./import-maps.js";

export const name = "core/web-monetization";

const DEFAULT_PAYMENT_POINTER = "$ilp.uphold.com/DwJmxPHHi8K3";

export function run(conf) {
  const { monetization } = conf;
  if (monetization === false) {
    return;
  }

  const paymentPointer =
    typeof monetization === "string" ? monetization : DEFAULT_PAYMENT_POINTER;

  document.head.append(html`<meta
    name="monetization"
    content="${paymentPointer}"
  />`);
}
