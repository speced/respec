/**
 * This Module adds a `respecIsReady` property to the document object.
 * The property returns a promise that settles when ReSpec finishes
 * processing the document.
 */

"use strict";
define(["core/pubsubhub"], function (pubsubhub) {
  var respecDone = false;
  var respecDonePromise = new Promise(function (resolve) {
    var opaque = pubsubhub.sub("end-all", function(conf){
      pubsubhub.unsub(opaque);
      respecDone = true;
      resolve(conf);
    });
  });
  Object.defineProperty(document, "respecDone", {
    get: function () {
      var warn = "document.respecDone is deprecated, use document.respecIsReady instead.";
      pubsubhub.pub("warn", warn);
      return respecDone;
    }
  });
  Object.defineProperty(document, "respecIsReady", {
    get: function () {
      return respecDonePromise;
    },
  });
  return respecDonePromise;
});
