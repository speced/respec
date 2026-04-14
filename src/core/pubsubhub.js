// @ts-check
/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */
export const name = "core/pubsubhub";

import { expose } from "./expose-modules.js";
import { showError } from "./utils.js";

const subscriptions = new EventTarget();

/**
 *
 * @param {EventTopic} topic
 * @param  {any} detail
 */
export function pub(topic, detail) {
  subscriptions.dispatchEvent(new CustomEvent(topic, { detail }));
  if (window.parent === window.self) {
    return;
  }
  // If this is an iframe, postMessage parent (used in testing).
  const args = String(JSON.stringify(detail?.stack || detail));
  // Safari can throw SecurityError accessing parent.location.origin from
  // srcdoc iframes (treated as opaque origin). Fall back to "*" which is
  // acceptable here since these messages contain no sensitive data and are
  // only used in the test harness.
  let targetOrigin;
  try {
    targetOrigin = window.parent.location.origin;
  } catch {
    targetOrigin = "*";
  }
  window.parent.postMessage({ topic, args }, targetOrigin);
}

/**
 * Subscribes to a message type.
 * @param  {EventTopic} topic The topic to subscribe to
 * @param  {Function} cb         Callback function
 * @param  {Object} [options]
 * @param  {Boolean} [options.once] Add prop "once" for single notification.
 * @return {void}
 */
export function sub(topic, cb, options = { once: false }) {
  /** @param {CustomEvent} ev */
  /**
   * @param {CustomEvent} ev
   */
  const listener = async ev => {
    try {
      await cb(ev.detail);
    } catch (err) {
      const error = /** @type {Error} */ (err);
      const msg = `Error in handler for topic "${topic}": ${error.message}`;
      showError(msg, `sub:${topic}`, { cause: error });
    }
  };
  subscriptions.addEventListener(topic, /** @type {any} */ (listener), options);
}

expose(name, { sub });
