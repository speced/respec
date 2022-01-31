// @ts-check
import { expose } from "./expose-modules.js";
import { showError } from "./utils.js";

/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */
export const name = "core/pubsubhub";
/**
 * @type {Map<EventTopic, Set<SubscriptionHandle>>} MessageMap
 */
const subscriptions = new Map();
class SubscriptionHandle {
  /**
   * @param {EventTopic} topic
   * @param {Function} cb
   * @param {object} options
   */
  constructor(topic, cb, options) {
    this.topic = topic;
    this.cb = !options.once
      ? cb
      : // Wrap the callback in a function that will remove the subscription
        (...args) => {
          this.unsubscribe();
          cb(...args);
        };

    subscriptions.has(topic)
      ? subscriptions.get(topic).add(this)
      : subscriptions.set(topic, new Set([this]));
  }
  unsubscribe() {
    const callbacks = subscriptions.get(this.topic);
    if (callbacks?.has(this) === false) {
      console.warn(`Not subscribed to "${this.topic}"`, this.cb);
    }
    return callbacks.delete(this);
  }
}
/**
 *
 * @param {EventTopic} topic
 * @param  {...any} data
 */
export function pub(topic, ...data) {
  if (!subscriptions.has(topic)) {
    throw new Error(`No subscribers for topic "${topic}".`);
  }
  for (const handle of subscriptions.get(topic)) {
    try {
      handle.cb(...data);
    } catch (err) {
      const msg = `Error when calling function ${handle.cb.name}.`;
      const hint = "See developer console.";
      showError(msg, name, { hint });
      console.error(err);
    }
  }
  if (window.parent === window.self) {
    return;
  }
  // If this is an iframe, postMessage parent (used in testing).
  const args = data
    // to structured clonable
    .map(arg => String(JSON.stringify(arg.stack || arg)));
  window.parent.postMessage({ topic, args }, window.parent.location.origin);
}
/**
 * Subscribes to a message type.
 * @param  {EventTopic} topic The topic to subscribe to
 * @param  {Function} cb         Callback function
 * @param  {Object} [options]
 * @param  {Boolean} [options.once] Add prop "once" for single notification.
 * @return {SubscriptionHandle} Handle for unsubscribing from messages.
 */
export function sub(topic, cb, options = { once: false }) {
  return new SubscriptionHandle(topic, cb, options);
}

/**
 * Unsubscribe from messages.
 *
 * @param {SubscriptionHandle} handle The object that was returned from calling sub()
 */
export function unsub(handle) {
  return handle.unsubscribe();
}

expose(name, { sub });
