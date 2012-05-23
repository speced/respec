
(function (GLOBAL) {
    // pubsub
    // freely adapted from http://higginsforpresident.net/js/static/jq.pubsub.js
    var handlers = {};
    GLOBAL.respecEvents = {
        pub:    function (topic) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
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
        console.log(">>> began: " + details);
    });
    respecEvents.sub("end", function (details) {
        console.log("<<< finished: " + details);
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
                    if (!plugs.length) return;
                    var plug = plugs.shift();
                    if (plug.run) plug.run.call(plug, respecConfig, document, pipeline, respecEvents);
                    else pipeline();
                };
                pipeline();
                if (respecConfig.afterEnd) respecConfig.afterEnd.apply(GLOBAL, Array.prototype.slice.call(arguments));
                respecEvents.pub("end", "core/base-runner");
            }
        };
    }
);
