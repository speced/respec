
define([
            "domReady"
        ,   "core/base-runner"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
        ,   "core/style"
        ,   "w3c/style"
        ,   "w3c/headers"
        ,   "w3c/abstract"
        ,   "w3c/conformance"
        ,   "core/data-transform"
        ,   "core/data-include"
        ,   "core/dfn"
        ,   "core/examples"
        ,   "w3c/legacy"
        ,   "w3c/informative"
        ,   "w3c/unhtml5"
        ,   "core/remove-respec"
        ], 
        function (domReady, runner) {
            var args = Array.prototype.slice.call(arguments)
            ,   hasRun = false;
            domReady(function () {
                hasRun = true;
                runner.runAll(args);
            });
            // the below can trigger a run, assuming a way of starting this paused
            // window.addEventListener("message", function (ev) {
            //     console.log("message", ev.data);
            //     if (hasRun) return;
            //     if (ev.data && ev.data.topic == "run") {
            //         hasRun = true;
            //         runner.runAll(args);
            //     }
            // }, false);
        }
);

// XXX - FROM RSv2
//  X    "core/base-runner",
//  X    "core/utils", (port in increments, only including the stuff that is depended upon -- avoids cruft)
//  X    "core/override-configuration",
//  X    "core/default-root-attr",
//  X    "core/style",
//  X    "w3c/style",
//  X    "w3c/headers",
//  X    conformance
//  X    "core/data-transform",
//  X    "core/data-include",
//      "core/inlines",
//      "core/webidl",
//  X    "core/examples",
//      highlights (these can be advantageously split out, since removing them saves a lot of code)
//      best practices
//      issues-notes (like examples)
//      "w3c/bibref",
//      "core/figure",
//      "core/structure",
//  X    informative
//      section refs
//      "w3c/structure",
//  X    "core/dfn",
//      "core/rdfa", (note that we've deleted support here and there since it was spread everywhere — reinstate from original v1)
//  X    "w3c/unhtml5",
//  X    "core/remove-respec"

