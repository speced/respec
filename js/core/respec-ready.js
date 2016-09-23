/**
 * This Module adds a `respecIsReady` property to the document object.
 * The property returns a promise that settles when ReSpec finishes
 * processing the document.
 */
"use strict";
define(["core/pubsubhub"], (pubsubhub) => {
  let respecDone = false;
  const respecDonePromise = new Promise(resolve => {
    const opaque = pubsubhub.sub("end-all", conf => {
      pubsubhub.unsub(opaque);
      respecDone = true;
      resolve(conf);
    });
  });
  Object.defineProperties(document, {
    "respecDone": {
      get() {
        const warn = "document.respecDone is deprecated, use" +
          " document.respecIsReady instead.";
        pubsubhub.pub("warn", warn);
        return respecDone;
      },
    },
    "respecIsReady": {
      get() {
        return respecDonePromise;
      },
    },
  });
});
