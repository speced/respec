/*jshint
    expr:   true
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
//      same caveats. These two coexist for historical reasons; please not that they
//      are all considered deprecated and may all be removed.
"use strict";
define(
    ["core/pubsubhub"],
    function (pubsubhub) {
        function createLegacyWrapper(pubsubhub){
            var deprecatedMsg = "Using 'msg' is deprecated. " +
                "Import 'pubsubhub' into your module instead."
            return Object
                .keys(pubsubhub)
                .reduce(function(obj, key){
                    return Object.defineProperty(obj, key, {
                        value: function(){
                            console.warn(deprecatedMsg);
                            return pubsubhub[key].apply(pubsubhub, Array.from(arguments));
                        }
                    });
                }, {});
        }
        return {
            runAll:    function (plugs) {
                // publish messages for beginning of all and end of all
                pubsubhub.pub("start-all");
                if (respecConfig.preProcess) {
                    for (var i = 0; i < respecConfig.preProcess.length; i++) {
                        try {
                            respecConfig.preProcess[i].apply(this); }
                        catch (e) {
                            window.console.error(e);
                        }
                    }
                }
                var deprecated = createLegacyWrapper(pubsubhub);
                var pipeline = Promise.resolve();
                // the first in the plugs is going to be us
                plugs.shift();
                document.documentElement.setAttribute("aria-busy", "true");
                var docClone = document.cloneNode(true);
                plugs.forEach(function(plug) {
                    pipeline = pipeline.then(function () {
                        if (plug.run) {
                            return new Promise(function runPlugin(resolve) {
                                // We send pubsubhub in to retain backwards
                                var result = plug.run.call(plug, respecConfig, docClone, resolve, deprecated);
                                // If the plugin returns a promise, have that
                                // control the end of the plugin's run.
                                // Otherwise, assume it'll call resolve() as a
                                // completion callback.
                                if (result) {
                                    resolve(result);
                                }
                            }).catch(function(e) {
                                throw e;
                            });
                        }
                        else return Promise.resolve();
                    });
                });
                return pipeline
                    .then(function(){
                        var resultingConfig = Object.assign({}, window.respecConfig);
                        var adoptedNode = document.adoptNode(docClone.documentElement);
                        document.replaceChild(adoptedNode, document.documentElement);
                        pubsubhub.pub("end-all", resultingConfig);
                        document.documentElement.setAttribute("aria-busy", "false")
                    })
                    .then(function() {
                        if (respecConfig.postProcess) {
                            for (var i = 0; i < respecConfig.postProcess.length; i++) {
                                try { respecConfig.postProcess[i].apply(this); }
                                catch (e) { pubsubhub.pub("error", e); }
                            }
                        }
                        if (respecConfig.afterEnd) {
                            try { respecConfig.afterEnd.apply(window, Array.from(arguments)); }
                            catch (e) { pubsubhub.pub("error", e); }
                        }
                    });
            }
        };
    }
);
