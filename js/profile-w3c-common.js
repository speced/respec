"use strict";
// Hide document, because we are about to change it radically.
if (document.body) {
  document.body.hidden = true;
} else {
  document.addEventListener(
    "DOMContentLoaded",
    function() {
      document.body.hidden = true;
    },
    { once: true }
  );
}

// In case everything else fails, we always want to show the document
window.addEventListener("error", function(ev) {
  console.error(ev.error);
  document.body.hidden = false;
});

// this is only set in a build, not at all in the dev environment
require.config({
  shim: {
    shortcut: {
      exports: "shortcut",
    },
    highlight: {
      exports: "hljs",
    },
    beautify: {
      exports: "beautify",
    },
  },
  paths: {
    "beautify-css": "deps/beautify-css",
    "beautify-html": "deps/beautify-html",
    "handlebars.runtime": "deps/handlebars",
    "deps/highlight": "https://www.w3.org/Tools/respec/respec-highlight",
  },
  deps: ["deps/fetch", "deps/hyperhtml"],
});

define(
  [
    // order is significant
    "deps/domReady",
    "core/base-runner",
    "core/ui",
    "core/aria",
    "core/style",
    "w3c/style",
    "core/l10n",
    "w3c/l10n",
    "core/github",
    "core/data-include",
    "core/markdown",
    "w3c/headers",
    "w3c/abstract",
    "w3c/conformance",
    "core/data-transform",
    "core/inlines",
    "core/dfn",
    "w3c/rfc2119",
    "core/examples",
    "core/issues-notes",
    "core/requirements",
    "core/best-practices",
    "core/figures",
    "core/webidl",
    "core/data-cite",
    "core/biblio",
    "core/webidl-index",
    "core/link-to-dfn",
    "core/contrib",
    "core/fix-headers",
    "core/structure",
    "w3c/informative",
    "w3c/permalinks",
    "core/id-headers",
    "core/rdfa",
    "w3c/aria",
    "core/location-hash",
    "ui/about-respec",
    "ui/dfn-list",
    "ui/save-html",
    "ui/search-specref",
    "w3c/seo",
    "core/highlight",
    "core/webidl-clipboard",
    /*Linter must be the last thing to run*/
    "w3c/linter",
  ],
  function(domReady, runner, ui) {
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
          // In case processing fails, we still want to show the document.
          document.body.hidden = false;
          // even if things go critically bad, we should still try to show the UI
          ui.enable();
        });
    });
  }
);
