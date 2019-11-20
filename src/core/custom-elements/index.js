// @ts-check
/**
 * Registers custom elements and waits for them to finish their processing.
 *
 * Every custom element file exports:
 * - `name`: registered name of the custom element, prefixed with `rs-`.
 * - `default`: class defintion of the custom element.
 * - `is`: an optional string if element extends some built-in element.
 *
 * Every custom element must have a `ready` getter function which returns a
 * promise that tells the element has finished its processing, with or without
 * errors.
 *
 * @typedef {{ name: string, default: Function, is?: string }} CustomElementDfn
 */

import * as changelog from "./rs-changelog.js";
import { pub } from "../pubsubhub.js";
/** @type {CustomElementDfn[]} */
const CUSTOM_ELEMENTS = [changelog];

export const name = "core/custom-elements";

export async function run() {
  // prepare and register elements
  CUSTOM_ELEMENTS.forEach(el => {
    customElements.define(
      el.name,
      el.default,
      el.is ? { extends: el.is } : undefined
    );
  });

  // wait for each element to be ready
  const selectors = CUSTOM_ELEMENTS.map(el => {
    return el.is ? `is[${el.name}]` : el.name;
  }).join(", ");
  const elems = document.querySelectorAll(selectors);
  const readyPromises = [...elems].map(toReadyPromise);
  await Promise.all(readyPromises);
}

/** @param {HTMLElement} el */
export function ready(el) {
  el.dispatchEvent(new CustomEvent("ready"));
}

/** @param {HTMLElement} el */
function toReadyPromise(el) {
  return new Promise(resolve => {
    const timoutId = setTimeout(failure, 3000);
    el.addEventListener("ready", success, { once: true });
    function success() {
      clearTimeout(timoutId);
      resolve(true);
    }
    function failure() {
      el.removeEventListener("ready", success);
      const name = el.matches("[is]") ? el.getAttribute("is") : el.localName;
      pub("error", `Plugin \`core/custom-elements/${name}\` took too long.`);
      resolve(false);
    }
  });
}
