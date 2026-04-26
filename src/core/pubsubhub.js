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
  // srcdoc iframes (treated as opaque origin). Skip the postMessage in that
  // case; the polling fallback in SpecHelper.js handles test completion.
  let targetOrigin;
  try {
    targetOrigin = window.parent.location.origin;
  } catch {
    return;
  }
  try {
    window.parent.postMessage({ topic, args }, targetOrigin);
  } catch {
    // Ignore: postMessage can throw in Safari when the srcdoc iframe's
    // window.parent is not accessible (e.g., opaque-origin restrictions).
    // The local CustomEvent dispatch above already resolved doc.respec.ready,
    // so tests that poll doc.respec.ready will still complete correctly.
  }
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
