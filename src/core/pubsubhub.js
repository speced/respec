import { expose } from "./expose-modules";

/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */
export const name = "core/pubsubhub";

const subscriptions = new Map();

let onRespecError = null;
let onRespecWarn = null;

export function pub(topic, ...data) {
  if (!subscriptions.has(topic)) {
    return; // Nothing to do...
  }
  Array.from(subscriptions.get(topic)).forEach(cb => {
    try {
      cb(...data);
    } catch (err) {
      pub(
        "error",
        `Error when calling function ${cb.name}. See developer console.`
      );
      console.error(err);
    }
  });
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
 *
 * @param  {string} topic      The topic to subscribe to (e.g., "start-all")
 * @param  {Function} cb       Callback function
 * @param  {Boolean} opts.once Add prop "once" for single notification.
 * @return {Object}            An object that should be considered opaque,
 *                             used for unsubscribing from messages.
 */
export function sub(topic, cb, opts = { once: false }) {
  if (opts.once) {
    return sub(topic, function wrapper(...args) {
      unsub({ topic, cb: wrapper });
      cb(...args);
    });
  }
  if (subscriptions.has(topic)) {
    subscriptions.get(topic).add(cb);
  } else {
    subscriptions.set(topic, new Set([cb]));
  }
  return { topic, cb };
}
/**
 * Unsubscribe from messages.
 *
 * @param {Object} opaque The object that was returned from calling sub()
 */
export function unsub({ topic, cb }) {
  // opaque is whatever is returned by sub()
  const callbacks = subscriptions.get(topic);
  if (!callbacks || !callbacks.has(cb)) {
    console.warn("Already unsubscribed:", topic, cb);
    return false;
  }
  return callbacks.delete(cb);
}

sub("error", err => {
  console.error(err, err.stack);
  if (onRespecError) onRespecError(err);
});

sub("warn", str => {
  console.warn(str);
  if (onRespecWarn) onRespecWarn(str);
});

expose(name, { sub });

export async function run(conf) {
  if (conf.collectErrors && !conf.hasOwnProperty("onRespecError")) {
    // Automatically assign a callback function to collect errors.
    conf.onRespecError = err => {
      if (!conf.hasOwnProperty("collectedErrors"))
        conf.collectedErrors = new Set();
      const { collectedErrors } = conf;
      collectedErrors.add(err);
    };
  }
  if (conf.collectWarnings && !conf.hasOwnProperty("onRespecWarn")) {
    // Automatically assign a callback function to collect warnings.
    conf.onRespecWarn = warn => {
      if (!conf.hasOwnProperty("collectedWarnings"))
        conf.collectedWarnings = new Set();
      const { collectedWarnings } = conf;
      collectedWarnings.add(warn);
    };
  }

  if (conf.onRespecError && typeof conf.onRespecError === "function") {
    onRespecError = conf.onRespecError;
  }
  if (conf.onRespecWarn && typeof conf.onRespecWarn === "function") {
    onRespecWarn = conf.onRespecWarn;
  }
}
