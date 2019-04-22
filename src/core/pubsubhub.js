// @ts-check
import { expose } from "./expose-modules.js";

/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */
export const name = "core/pubsubhub";

export class PubSubHub {
  constructor() {
    this.subscriptions = new Map();
    this.sub("error", console.error);
    this.sub("warn", console.warn);
  }

  /**
   * @param {string} topic
   * @param  {...any} data
   */
  pub(topic, ...data) {
    if (!this.subscriptions.has(topic)) {
      return; // Nothing to do...
    }
    if (typeof document === "undefined" && topic === "error") {
      throw new Error(data[0]);
    }
    Array.from(this.subscriptions.get(topic)).forEach(cb => {
      try {
        cb(...data);
      } catch (err) {
        this.pub(
          "error",
          `Error when calling function ${cb.name}. See developer console.`
        );
        console.error(err);
      }
    });
    if (typeof window === "undefined" || window.parent === window.self) {
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
   *
   * @param  {string} topic      The topic to subscribe to (e.g., "start-all")
   * @param  {Function} cb       Callback function
   * @param  {object} opts
   * @param  {Boolean} [opts.once] Add prop "once" for single notification.
   * @return {Object}            An object that should be considered opaque,
   *                             used for unsubscribing from messages.
   */
  sub(topic, cb, opts = { once: false }) {
    if (opts.once) {
      /**
       * @param {...any} args
       */
      const wrapper = (...args) => {
        this.unsub({ topic, cb: wrapper });
        cb(...args);
      };
      return this.sub(topic, wrapper);
    }
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).add(cb);
    } else {
      this.subscriptions.set(topic, new Set([cb]));
    }
    return { topic, cb };
  }
  /**
   * Unsubscribe from messages.
   *
   * @param {Object} opaque The object that was returned from calling sub()
   */
  unsub({ topic, cb }) {
    // opaque is whatever is returned by sub()
    const callbacks = this.subscriptions.get(topic);
    if (!callbacks || !callbacks.has(cb)) {
      console.warn("Already unsubscribed:", topic, cb);
      return false;
    }
    return callbacks.delete(cb);
  }
}

const hub = new PubSubHub();

export const pub = hub.pub.bind(hub);
export const sub = hub.sub.bind(hub);
export const unsub = hub.unsub.bind(hub);

expose(name, { sub });
