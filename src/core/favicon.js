// @ts-check
/**
 * This module adds a "favicon" element. It knows how to use Unicode favicons, too.
 *
 */
import { docLink, isURL, showWarning } from "./utils.js";
import { html } from "./import-maps.js";

export const name = "core/favicon";

export function run(conf) {
  if (!conf.favicon) {
    return;
  }

  let favLink;
  console.log(conf.favicon ? conf.favicon.length : 0);
  if (isURL(conf.favicon)) {
    favLink = conf.favicon;
    // test single character, Unicode edition
  } else if (/^.$/u.test(conf.favicon)) {
    favLink = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="105">${conf.favicon}</text></svg>`;
  } else {
    const hint = docLink`Check out ${"[favicon]"} for details.`;
    showWarning(
      "conf.favicon is neither a link nor a single character, ignored.",
      name,
      { hint }
    );
    return;
  }

  const existingIcon = document.querySelector("link[rel='icon']");
  const linkEl = html`<link rel="icon" href="${favLink}" />`;
  if (existingIcon) {
    existingIcon.parentNode.replaceChild(linkEl, existingIcon);
  } else {
    document.head.append(linkEl);
  }
}
