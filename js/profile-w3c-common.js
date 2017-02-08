"use strict";
// this is only set in a build, not at all in the dev environment
require.config({
  shim: {
    shortcut: {
      exports: "shortcut"
    },
    highlight: {
      exports: "hljs"
    },
    beautify: {
      exports: "beautify"
    }
  },
  paths: {
    "beautify-css": "deps/beautify-css",
    "beautify-html": "deps/beautify-html",
    "handlebars.runtime": "deps/handlebars",
    "deps/highlight": "https://www.w3.org/Tools/respec/respec-highlight",
  },
  deps: [
    "deps/fetch",
  ],
});

define([
    // order is significant
    "deps/domReady",
    "core/base-runner",
    "core/ui",
    "deps/regenerator",
    "core/aria",
    "core/style",
    "w3c/style",
    "w3c/l10n",
    "core/data-include",
    "core/markdown",
    "w3c/headers",
    "w3c/abstract",
    "w3c/conformance",
    "core/data-transform",
    "core/inlines",
    "core/data-cite",
    "core/dfn",
    "w3c/rfc2119",
    "core/examples",
    "core/issues-notes",
    "core/requirements",
    "core/best-practices",
    "core/figures",
    "core/biblio",
    "core/webidl-contiguous",
    "core/webidl-index",
    "core/webidl-oldschool",
    "core/link-to-dfn",
    "core/contrib",
    "core/fix-headers",
    "core/structure",
    "w3c/informative",
    "w3c/permalinks",
    "core/id-headers",
    "core/rdfa",
    "w3c/aria",
    "core/shiv",
    "core/location-hash",
    "ui/about-respec",
    "ui/dfn-list",
    "ui/save-html",
    "ui/search-specref",
    "w3c/seo",
    "core/highlight",
    /*Linter must be the last thing to run*/
    "w3c/linter",
  ],
  function(domReady, runner, ui, regenerator) {
    var args = Array.from(arguments).filter(function(item) {
      return item;
    });
    ui.show();
    domReady(function() {
      runner
        .runAll(args)
        .then(document.respecIsReady)
        .then(ui.enable)
        .catch(function(err) {
          console.error(err);
          // even if things go critically bad, we should still try to show the UI
          ui.enable();
        });
    });
  }
);
