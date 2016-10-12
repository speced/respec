/*jshint
    expr:   true,
    browser: true
*/
/*global respecConfig */
// Module core/base-runner
// The module in charge of running the whole processing pipeline.
// CONFIGURATION:
//  - trace: activate tracing for all modules
//  - preProcess: an array of functions that get called (with no parameters)
//      before anything else happens. This is not recommended and the feature is not
//      tested. Use with care, if you know what you're doing. Chances are you really
//      want to be using a new module with your own profile
//  - postProcess: the same as preProcess but at the end and with the same caveats
//  - afterEnd: a single function called at the end, after postProcess, with the
//      same caveats. These two coexist for historical reasons; please note that they
//      are all considered deprecated and may all be removed.
"use strict";
define([
    "core/pubsubhub",
    "deps/async",
  ],
  function(pubsubhub, async) {
    function createLegacyWrapper(pubsubhub) {
      const deprecatedMsg = "Using 'msg' is deprecated. " +
        "Import 'pubsubhub' into your module instead.";
      return Object
        .keys(pubsubhub)
        .reduce((obj, key) => {
          return Object.defineProperty(obj, key, {
            value(...args) {
              console.warn(deprecatedMsg);
              return pubsubhub[key].apply(pubsubhub, args);
            }
          });
        }, {});
    }

    function runFunctions(listOfFunctions = []) {
      listOfFunctions.forEach((f) => f());
    }

    return {
      runAll: async(function*(plugs) {
        // publish messages for beginning of all and end of all
        pubsubhub.pub("start-all");
        runFunctions(respecConfig.preProcess);
        const deprecated = createLegacyWrapper(pubsubhub);
        // excludes self, non-runnable, and modules that return falsy objects
        const tasks = plugs
          .filter(
            plug => plug && typeof plug.run === "function" && plug !== this
          )
          .map(
            plug => new Promise((resolve, reject) => {
              try {
                plug.run(respecConfig, document, resolve, deprecated);
              } catch (err) {
                reject(err);
              }
            })
          );
        for (let task of tasks) {
          try {
            yield task;
          } catch (err) {
            console.error(err);
          }
        }
        pubsubhub.pub("end-all", Object.assign({}, window.respecConfig));
        runFunctions(respecConfig.postProcess);
        if (respecConfig.afterEnd) {
          respecConfig.afterEnd();
        }
      })
    };
  }
);
