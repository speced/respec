
define([
            "domReady"
        ,   "core/base-runner"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
        ,   "core/style"
        ,   "w3c/style"
        ,   "w3c/legacy"
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
//  X   "core/utils", (port in increments, only including the stuff that is depended upon -- avoids cruft)
//  X    "core/override-configuration",
//  X    "core/default-root-attr",
//  X    "core/style",
//  X    "w3c/style",
//      "w3c/headers",
//      "core/data-transform",
//      "core/data-include",
//      "core/inlines",
//      "core/webidl",
//      "core/examples",
//      "w3c/bibref",
//      "core/figure",
//      "core/structure",
//      "w3c/structure",
//      "core/dfn",
//      "core/rdfa",
//      "w3c/unhtml5",
//      "core/remove-respec"

