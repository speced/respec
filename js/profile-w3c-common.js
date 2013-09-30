/*global respecVersion */

// this is only set in a build, not at all in the dev environment
var requireConfig = {
    shim:   {
        "shortcut": {
            exports:    "shortcut"
        }
    }
};
if ("respecVersion" in window && respecVersion) {
    requireConfig.paths = {
        "ui":   "https://darobin.github.io/respec/js/ui"
    };
}
require.config(requireConfig);

define([
            "domReady"
        ,   "core/base-runner"
        ,   "core/ui"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
        // ,   "core/local-biblio"
        ,   "core/markdown"
        ,   "core/style"
        ,   "w3c/style"
        ,   "w3c/headers"
        ,   "w3c/abstract"
        ,   "w3c/conformance"
        ,   "core/data-transform"
        ,   "core/data-include"
        ,   "core/inlines"
        ,   "core/examples"
        ,   "core/issues-notes"
        ,   "core/requirements"
        ,   "core/highlight"
        ,   "core/best-practices"
        ,   "core/figures"
        ,   "w3c/legacy"
        ,   "core/webidl-oldschool"
        ,   "core/dfn"
        ,   "core/fix-headers"
        ,   "core/structure"
        ,   "w3c/informative"
        ,   "core/id-headers"
        ,   "w3c/aria"
        ,   "core/remove-respec"
        ,   "core/location-hash"
        ],
        function (domReady, runner, ui) {
            var args = Array.prototype.slice.call(arguments)
            ,   hasRun = false;
            domReady(function () {
                hasRun = true;
                ui.addCommand("Save Snapshot", "ui/save-html", "Ctrl+Shift+Alt+S");
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
