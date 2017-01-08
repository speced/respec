/**
 * Module core/pubsubhub
 *
 * Returns a singleton that can be used for message broadcasting
 * and message receiving. Replaces legacy "msg" code in ReSpec.
 */

"use strict";
define([], function() {
  var subscriptions = new Map();
  var PubSubHub = {
    pub: function(topic) {
      // Nothing to do...
      if (!subscriptions.has(topic)) {
        return;
      }
      var restParams = Array
        .from(arguments)
        .slice(1);
      // we take a copy, because subscribers can unsubscribe themselves
      // leading to race conditions
      Array
        .from(subscriptions.get(topic))
        .forEach(function(cb) {
          cb.apply(null, restParams);
        });

      // If this is an iframe, postMessage parent (used in testing).
      if (window.parent === window.self) {
        return;
      }
      var args = restParams.map(function toStructuredClonable(arg) {
        var str = String(JSON.stringify(arg.stack || arg));
        return str;
      });
      var msg = {
        topic: topic,
        args: args,
      };
      window.parent.postMessage(msg, window.parent.location.origin);
    },
    sub: function(topic, cb) {
      if (!subscriptions.has(topic)) {
        subscriptions.set(topic, [cb]);
      } else {
        subscriptions.get(topic).push(cb);
      }
      return {
        topic: topic,
        cb: cb,
      };
    },
    unsub: function(opaque) { // opaque is whatever is returned by sub()
      var callbacks = subscriptions.get(opaque.topic);
      if (!callbacks || callbacks.indexOf(opaque.cb) === -1) {
        console.warn("Already unsubscribed:", opaque.topic, opaque.cb);
        return;
      }
      callbacks.splice(callbacks.indexOf(opaque.cb), 1);
    }
  };

  PubSubHub.sub("error", function(err) {
    console.error(err.stack || err);
  });

  PubSubHub.sub("warn", function(str) {
    console.warn(str);
  });

  // Add deprecation warning
  Object.defineProperty(window, "respecEvents", {
    get: function() {
      var warning = "window.respecEvents() is deprecated. Use 'require([\"core/pubsubhub\"], function(){...})' instead.";
      PubSubHub.pub("warn", warning);
      return PubSubHub;
    }
  });

  return PubSubHub;
});
