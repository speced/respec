/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */
const subscriptions = new Map();

export function pub(topic, ...data) {
  if (!subscriptions.has(topic)) {
    return; // Nothing to do...
  }
  Array
    .from(subscriptions.get(topic))
    .forEach(cb => cb.apply(null, data));
  if (window.parent === window.self) {
    return;
  }
  // If this is an iframe, postMessage parent (used in testing).
  var args = data
    // to structured clonable
    .map(arg => String(JSON.stringify(arg.stack || arg)));
  window.parent.postMessage({ topic, args }, window.parent.location.origin);
}

export function sub(topic, cb, opts = { once: false }) {
  if (opts.once) {
    const opaque = sub(topic, (...args) => {
      unsub(opaque);
      return cb(...args);
    });
    return;
  }
  if (!subscriptions.has(topic)) {
    subscriptions.set(topic, [cb]);
  } else {
    subscriptions.get(topic).push(cb);
  }
  return { topic, cb };
}

export function unsub(opaque) { // opaque is whatever is returned by sub()
  var callbacks = subscriptions.get(opaque.topic);
  if (!callbacks || callbacks.indexOf(opaque.cb) === -1) {
    console.warn("Already unsubscribed:", opaque.topic, opaque.cb);
    return;
  }
  callbacks.splice(callbacks.indexOf(opaque.cb), 1);
}

sub("error", err => {
  console.error(err.stack || err);
});

sub("warn", str => {
  console.warn(str);
});
