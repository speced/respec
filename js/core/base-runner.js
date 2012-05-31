
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
    GLOBAL.respecEvents = {
        pub:    function (topic) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            if (embedded && window.postMessage) parent.postMessage({ topic: topic, args: args}, "*");
            $.each(handlers[topic], function () {
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
            handlers[t] && d.each(handlers[t], function (idx) {
                if (this == opaque[1]) handlers[t].splice(idx, 1);
            });
        }
    };
})(this);

// these need to be improved, or complemented with proper UI indications
if (window.console) {
    respecEvents.sub("warn", function (details) {
        console.log("WARN: " + details);
    });
    respecEvents.sub("error", function (details) {
        console.log("ERROR: " + details);
    });
    respecEvents.sub("start", function (details) {
        if (respecConfig && respecConfig.trace) console.log(">>> began: " + details);
    });
    respecEvents.sub("end", function (details) {
        if (respecConfig && respecConfig.trace) console.log("<<< finished: " + details);
    });
    respecEvents.sub("start-all", function () {
        console.log("RESPEC PROCESSING STARTED");
    });
    respecEvents.sub("end-all", function () {
        console.log("RESPEC DONE!");
    });
}


define(
    [],
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
                    if (!pluginStack) respecEvents.pub("end-all");
                });
                respecEvents.pub("start", "core/base-runner");
                
                // the first in the plugs is going to be us
                plugs.shift();
                if (!respecConfig) respecConfig = {};

                // the base URL is used by some modules
                var $scripts = $("script"),
                    baseUrl = "";
                $scripts.each(function (i, s) {
                    var src = s.getAttribute("src");
                    if (!src || !$(s).hasClass("remove")) return;
                    if (/\/js\//.test(src)) baseUrl = src.replace(/\/js\/.*/, "\/js\/")
                });
                respecConfig.respecBase = baseUrl;
                
                var pipeline;
                pipeline = function () {
                    if (!plugs.length) {
                        if (respecConfig.postProcess) {
                            for (var i = 0; i < respecConfig.postProcess.length; i++) respecConfig.postProcess[i].apply(this);
                        }
                        if (respecConfig.afterEnd) respecConfig.afterEnd.apply(GLOBAL, Array.prototype.slice.call(arguments));
                        respecEvents.pub("end", "core/base-runner");
                        return;
                    };
                    var plug = plugs.shift();
                    if (plug.run) plug.run.call(plug, respecConfig, document, pipeline, respecEvents);
                    else pipeline();
                };
                if (respecConfig.preProcess) {
                    for (var i = 0; i < respecConfig.preProcess.length; i++) respecConfig.preProcess[i].apply(this);
                }
                pipeline();
            }
        };
    }
);
