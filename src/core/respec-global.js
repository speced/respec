// @ts-check
/**
 * This module adds a `respec` object to the `document` with the following
 * readonly properties:
 *  - version: returns version of ReSpec Script.
 *  - ready: an alias to `document.respecIsReady`.
 */

export const name = "core/respec-global";

class ReSpec {
  get version() {
    return window.respecVersion;
  }

  get ready() {
    return document.respecIsReady;
  }
}

export function init() {
  const respec = new ReSpec();
  Object.defineProperty(document, "respec", { value: respec });
}
