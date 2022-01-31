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
}

expose(name, { sub });
