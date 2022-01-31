// @ts-check
/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */
export const name = "core/pubsubhub";

import { expose } from "./expose-modules.js";

const subscriptions = new EventTarget();

export function sub(topic, cb, options = { once: false }) {
  const listener = e => cb(e.detail);
  subscriptions.addEventListener(topic, listener, options);
}

export function pub(topic, detail) {
  subscriptions.dispatchEvent(new CustomEvent(topic, { detail }));
  if (window.parent === window.self) {
    return;
  }
  // If this is an iframe, postMessage parent (used in testing).
  const args = String(JSON.stringify(detail?.stack || detail));
  window.parent.postMessage({ topic, args }, window.parent.location.origin);
}

expose(name, { sub });
