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

export async function run(conf) {
  // prepare and register elements
  CUSTOM_ELEMENTS.forEach(el => el.run(conf));

  // wait for each element to be ready
  const selectors = CUSTOM_ELEMENTS.map(el => el.name).join(", ");
  const readyPromises = [...document.querySelectorAll(selectors)].map(
    el => new Promise(res => el.addEventListener("done", res, { once: true }))
  );
  await Promise.all(readyPromises);
}

export function done(self) {
  self.dispatchEvent(new CustomEvent("done"));
}
