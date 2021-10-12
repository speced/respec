// @ts-check
/**
 * This module adds a "favicon" element. It knows how to use Unicode favicons, too.
 *
 */
import { html } from "./import-maps.js";
import { isURL } from "./utils.js";

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
    favLink = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%220.9em%22 font-size=%22105%22>${conf.favicon}</text></svg>`;
  } else {
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
