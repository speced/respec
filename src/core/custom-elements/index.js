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
 */

import * as changelog from "./rs-changelog.js";
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
  const readyPromises = [...document.querySelectorAll(selectors)].map(
    el => el.ready
  );
  await Promise.all(readyPromises);
}

export function done(self) {
  self.dispatchEvent(new CustomEvent("done"));
}
