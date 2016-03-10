/**
 * This Module adds a `respectIsReady` property to the document object.
 * The property returns a promise.
 */

"use strict";
define(["Promise"], function() {
  var respecDone = false;
  var doneResolver;
  var doneRejector;
  var respecDonePromise = new Promise(function(resolve, reject) {
    doneResolver = resolve;
    doneRejector = reject;
  });
  Object.defineProperty(document, "respecDone", {
    get: function() {
      var warn = "document.respecDone is deprecated, use document.respectIsReady instead.";
      console.warn(warn);
      return respecDone;
    },
    set: function(value) {
      if (typeof value === "boolean" && value) {
	respecDone = value;
	doneResolver(respecConfig);
      }
      if (value instanceof Error) {
	doneRejector(value)
      }
      return value;
    }
  });
  Object.defineProperty(document, "respectIsReady", {
    get: function() {
      return respecDonePromise;
    },
  });
  return {};
});