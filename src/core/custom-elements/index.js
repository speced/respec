// @ts-check
/**
 * Registers custom elements and waits for them to finish their processing.
 *
 * Every custom element file exports:
 * - `name`: registered name of the custom element, prefixed with `rs-`.
 * - `default`: class defintion of the custom element.
 * - `extends`: an optional string if element extends some built-in element.
 *
 * Every custom element must have a `ready` getter function which returns a
 * promise that tells the element has finished its processing, with or without
 * errors.
 *
 * @typedef {{ name: string, default: Function, extends?: string }} CustomElementDfn
 * @typedef { HTMLElement & { ready: Promise<void> }} CustomElement
 */

import * as changelog from "./rs-changelog.js";
/** @type {CustomElementDfn[]} */
const CUSTOM_ELEMENTS = [changelog];

export const name = "core/custom-elements";

export async function run() {
  // prepare and register elements
  CUSTOM_ELEMENTS.forEach(el => {
    customElements.define(
      el.name,
      el.default,
      el.extends ? { extends: el.extends } : undefined
    );
  });

  // wait for each element to be ready
  const selectors = CUSTOM_ELEMENTS.map(el => {
    return el.extends ? `is["${el.name}"]` : el.name;
  }).join(", ");
  /** @type {NodeListOf<CustomElement>} */
  const elems = document.querySelectorAll(selectors);
  const readyPromises = [...elems].map(el => el.ready);
  await Promise.all(readyPromises);
}
