/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */
export const name = "core/pubsubhub";

const subscriptions = new Map();

export function pub(topic, ...data) {
  if (!subscriptions.has(topic)) {
    return; // Nothing to do...
  }
  Array
    .from(subscriptions.get(topic))
    .forEach(cb => cb.apply(undefined, data));
  if (window.parent === window.self) {
    return;
  }
  // If this is an iframe, postMessage parent (used in testing).
  var args = data
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
export function unsub({ topic, cb }) { // opaque is whatever is returned by sub()
  const callbacks = subscriptions.get(topic);
  if (!callbacks || !callbacks.has(cb)) {
    console.warn("Already unsubscribed:", topic, cb);
    return false;
  }
  return callbacks.delete(cb);
}

sub("error", err => {
  console.error(err.stack || err);
});

sub("warn", str => {
  console.warn(str);
});
