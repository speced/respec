/**
 * This Module adds a `respecIsReady` property to the document object.
 * The property returns a promise that settles when ReSpec finishes
 * processing the document.
 */

"use strict";
define([], function () {
  var respecDone = false;
  var doneResolver;
  var doneRejector;
  var respecDonePromise = new Promise(function (resolve, reject) {
    doneResolver = resolve;
    doneRejector = reject;
  });
  Object.defineProperty(document, "respecDone", {
    get: function () {
      var warn = "document.respecDone is deprecated, use document.respecIsReady instead.";
      console.warn(warn);
      return respecDone;
    },
    set: function (value) {
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
  Object.defineProperty(document, "respecIsReady", {
    get: function () {
      return respecDonePromise;
    },
  });
  return {};
});
