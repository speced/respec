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
        "ui":   "https://raw.github.com/darobin/respec/gh-pages/js/ui"
    };
}
require.config(requireConfig);

define([
            "domReady"
        ,   "core/base-runner"
        ,   "core/ui"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
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
        ,   "core/tables"
        ,   "core/biblio"
        ,   "core/rdfa"
        ,   "core/webidl-oldschool"
        ,   "core/dfn"
        ,   "core/fix-headers"
        ,   "core/structure"
        ,   "w3c/informative"
        ,   "core/id-headers"
        ,   "w3c/aria"
        ,   "core/shiv"
        ,   "core/remove-respec"
        ,   "core/location-hash"
        ],
        function (domReady, runner, ui) {
            var args = Array.prototype.slice.call(arguments);
            domReady(function () {
                ui.addCommand("Save Snapshot", "ui/save-html", "Ctrl+Shift+Alt+S");
                ui.addCommand("About ReSpec", "ui/about-respec", "Ctrl+Shift+Alt+A");
                runner.runAll(args);
            });
        }
);
