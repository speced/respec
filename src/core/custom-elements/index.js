// @ts-check
/**
 * Waits for all custom elements to finish their processing.
 *
 * Every custom element file exports:
 * - `name`: registered name of the custom element, prefixed with `rs-`.
 * - `run`: a function that accepts `conf` and calls
 *   `customElements.define(name, class {})`
 *
 * Every custom element must import `done` and call it once the custom
 * element has finished its processing, with or without errors, as:
 * ``` js
 * // do processing, then call:
 * done(this);
 * ```
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
