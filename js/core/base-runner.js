/*jshint
    expr:   true
*/
/*global self, respecEvents, respecConfig */

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
//      same caveats. These two coexist for historical reasons; please not that they
//      are all considered deprecated and may all be removed.

(function (GLOBAL) {
    // pubsub
    // freely adapted from http://higginsforpresident.net/js/static/jq.pubsub.js
    var handlers = {}
    ,   embedded = (top !== self)
    ;
    if (!("respecConfig" in window)) window.respecConfig = {};
    GLOBAL.respecEvents = {
        pub:    function (topic) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            if (embedded && window.postMessage) {
                // Make sure all args are structured-cloneable.
                args = args.map(function(arg) {
                    return (arg.stack || arg) + '';
                });
                parent.postMessage({ topic: topic, args: args}, "*");
            }
            $.each(handlers[topic] || [], function () {
                this.apply(GLOBAL, args);
            });
        }
    ,   sub:    function (topic, cb) {
            if (!handlers[topic]) handlers[topic] = [];
            handlers[topic].push(cb);
            return [topic, cb];
        }
    ,   unsub:  function (opaque) { // opaque is whatever is returned by sub()
            var t = opaque[0];
            handlers[t] && $.each(handlers[t] || [], function (idx) {
                if (this == opaque[1]) handlers[t].splice(idx, 1);
            });
        }
    };
}(this));

// these need to be improved, or complemented with proper UI indications
if (window.console) {
    respecEvents.sub("warn", function (details) {
        console.warn("WARN: ", details);
    });
    respecEvents.sub("error", function (details) {
        console.error("ERROR: ", details);
    });
    respecEvents.sub("start", function (details) {
        if (respecConfig && respecConfig.trace) console.log(">>> began: " + details);
    });
    respecEvents.sub("end", function (details) {
        if (respecConfig && respecConfig.trace) console.log("<<< finished: " + details);
    });
    respecEvents.sub("start-all", function () {
        console.log("RESPEC PROCESSING STARTED");
        if ("respecVersion" in window && respecVersion) {
            console.log("RESPEC Version: " + respecVersion) ;
        }
    });
    respecEvents.sub("end-all", function () {
        console.log("RESPEC DONE!");
    });
}


define(
    ["jquery", "Promise.min"],
    function () {
        return {
            runAll:    function (plugs) {
                // publish messages for beginning of all and end of all
                var pluginStack = 0;
                respecEvents.pub("start-all");
                respecEvents.sub("start", function () {
                    pluginStack++;
                });
                respecEvents.sub("end", function () {
                    pluginStack--;
                    if (!pluginStack) {
                        respecEvents.pub("end-all");
                        document.respecDone = true;
                    }
                });
                respecEvents.pub("start", "core/base-runner");

                if (respecConfig.preProcess) {
                    for (var i = 0; i < respecConfig.preProcess.length; i++) {
                        try { respecConfig.preProcess[i].apply(this); }
                        catch (e) { respecEvents.pub("error", e); }
                    }
                }

                var pipeline = Promise.resolve();
                // the first in the plugs is going to be us
                plugs.shift();
                plugs.forEach(function(plug) {
                    pipeline = pipeline.then(function () {
                        if (plug.run) {
                            return new Promise(function runPlugin(resolve, reject) {
                                var result = plug.run.call(plug, respecConfig, document, resolve, respecEvents);
                                // If the plugin returns a promise, have that
                                // control the end of the plugin's run.
                                // Otherwise, assume it'll call resolve() as a
                                // completion callback.
                                if (result) {
                                    resolve(result);
                                }
                            }).catch(function(e) {
                                respecEvents.pub("error", e);
                                respecEvents.pub("end", "unknown/with-error");
                            });
                        }
                        else return Promise.resolve();
                    });
                });
                return pipeline.then(function() {
                    if (respecConfig.postProcess) {
                        for (var i = 0; i < respecConfig.postProcess.length; i++) {
                            try { respecConfig.postProcess[i].apply(this); }
                            catch (e) { respecEvents.pub("error", e); }
                        }
                    }
                    if (respecConfig.afterEnd) {
                        try { respecConfig.afterEnd.apply(window, Array.prototype.slice.call(arguments)); }
                        catch (e) { respecEvents.pub("error", e); }
                    }
                    respecEvents.pub("end", "core/base-runner");
                });
            }
        };
    }
);
