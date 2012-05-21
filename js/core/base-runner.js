
// XXX
//  This is very rough and temporary

if (!window.console) {
    var fallback = window.opera ? window.opera.postError : function (str) {};
    window.console = { log: fallback, warn: fallback, error: fallback };
}

(function (GLOBAL) {
    GLOBAL.warn = function (str) {
        console.warn("W: " + str);
    };

    GLOBAL.error = function (str) {
        console.error("E: " + str);
    };

    GLOBAL.progress = function (str) {
        if (console) console.log("P: " + str);
    };
})(this);


define(
    [],
    function () {
        return {
            runAll:    function (plugs) {
                console.log("RUNALL");
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
                console.log("BASE: " + respecConfig.respecBase);
                
                var pipeline;
                pipeline = function () {
                    console.log("PIPELINE");
                    if (!plugs.length) return;
                    var plug = plugs.shift();
                    if (plug.run) plug.run.call(plug, respecConfig, document, pipeline);
                    else pipeline();
                };
                pipeline();
                if (respecConfig.afterEnd) respecConfig.afterEnd.apply(GLOBAL, Array.prototype.slice.call(arguments));
                console.log("END RUNALL");
            }
        };
    }
);
