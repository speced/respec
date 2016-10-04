"use strict";
// this is only set in a build, not at all in the dev environment
require.config({
  shim: {
    shortcut: {
      exports: "shortcut"
    },
    Promise: {
      exports: "Promise"
    },
    highlight:{
      exports: "hljs"
    },
    beautify:{
      exports: "beautify"
    }
  },
  paths: {
    "beautify-css": "deps/beautify-css",
    "beautify-html": "deps/beautify-html",
  },
  deps: [
    "deps/fetch",
    "deps/jquery",
  ],
});

define([
    // order is significant
    "deps/domReady",
    "core/base-runner",
    "core/ui",
    "core/respec-ready",
    "core/include-config",
    "core/override-configuration",
    "core/default-root-attr",
    "core/style",
    "w3c/style",
    "w3c/l10n",
    "core/markdown",
    "w3c/headers",
    "w3c/abstract",
    "w3c/conformance",
    "core/data-transform",
    "core/data-include",
    "core/inlines",
    "core/dfn",
    "w3c/rfc2119",
    "core/examples",
    "core/issues-notes",
    "core/requirements",
    "core/best-practices",
    "core/figures",
    "core/biblio",
    "core/webidl-contiguous",
    "core/webidl-oldschool",
    "core/link-to-dfn",
    "core/highlight",
    "core/contrib",
    "core/fix-headers",
    "core/structure",
    "w3c/informative",
    "w3c/permalinks",
    "core/id-headers",
    "core/rdfa",
    "w3c/aria",
    "core/shiv",
    "core/remove-respec",
    "core/location-hash",
    "ui/about-respec",
    "ui/dfn-list",
    "ui/save-html",
    "ui/search-specref",
    "w3c/linter",
    "core/seo",
  ],
  function(domReady, runner, ui) {
    var args = Array.from(arguments);
    domReady(function() {
      runner
        .runAll(args)
        .then(document.respecIsReady)
        .then(ui.show)
        .catch(function(err){
          console.error(err);
          // even if things go critically bad, we should still try to show the UI
          ui.show();
        });
      ui.addCommand("Save Snapshot", "ui/save-html", "Ctrl+Shift+Alt+S");
      ui.addCommand("About ReSpec", "ui/about-respec", "Ctrl+Shift+Alt+A");
      ui.addCommand("Definition List", "ui/dfn-list", "Ctrl+Shift+Alt+D");
      ui.addCommand("Search Specref DB", "ui/search-specref", "Ctrl+Shift+Alt+space");
    });
  }
);
