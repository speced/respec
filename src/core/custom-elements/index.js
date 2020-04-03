// @ts-check
/**
 * Registers custom elements and waits for them to finish their processing.
 *
 * Every custom element file exports:
 * - `name`: registered name of the custom element, prefixed with `rs-`.
 * - `element`: class defintion of the custom element.
 *
 * Every custom element must dispatch a CustomEvent 'done' that tells the
 * element has finished its processing, with or without errors.
 *
 * @typedef {{ name: string, element: CustomElementConstructor }} CustomElementDfn
 */

import * as changelog from "./rs-changelog.js";
/** @type {CustomElementDfn[]} */
const CUSTOM_ELEMENTS = [changelog];

export const name = "core/custom-elements/index";

export async function run() {
  // prepare and register elements
  CUSTOM_ELEMENTS.forEach(el => {
    customElements.define(el.name, el.element);
  });

  // wait for each element to be ready
  const selectors = CUSTOM_ELEMENTS.map(el => el.name).join(", ");
  const elems = document.querySelectorAll(selectors);
  const readyPromises = [...elems].map(
    el => new Promise(res => el.addEventListener("done", res, { once: true }))
  );
  await Promise.all(readyPromises);
}
