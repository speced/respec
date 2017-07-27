"use strict";
// Hide document, because we are about to change it radically.
if("body" in document) {
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
  console.error(ev.error, ev.message);
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
  deps: ["deps/hyperhtml", "deps/url-search-params", "geonovum/deps/leaflet"],
});

define(
  [
    // order is significant
    "deps/domReady",
    "core/base-runner",
    "core/ui",
    "core/aria",
    "core/style",
    "geonovum/style",
    "core/l10n",
    "geonovum/l10n",
    "core/github",
    "core/data-include",
    "core/markdown",
    "geonovum/headers",
    "geonovum/abstract",
    "geonovum/conformance",
    "core/data-transform",
    "core/inlines",
    "core/dfn",
    // "geonovum/rfc2119",
    "core/examples",
    "core/issues-notes",
    "core/requirements",
    "core/best-practices",
    "core/figures",
    // "core/webidl",
    "core/data-cite",
    "core/biblio",
    // "core/webidl-index",
    // "core/webidl-oldschool",
    "core/link-to-dfn",
    "core/contrib",
    "core/fix-headers",
    "core/structure",
    "geonovum/informative",
    "geonovum/permalinks",
    "core/id-headers",
    "core/rdfa",
    "geonovum/aria",
    // "core/shiv",
    "core/location-hash",
    "geonovum/leafletfigures",
    "geonovum/ui/about-respec",
    "geonovum/ui/dfn-list",
    "ui/save-html",
    "geonovum/ui/search-specref",
    // "geonovum/seo",
    "core/highlight",
    // /*Linter must be the last thing to run*/
    "geonovum/linter",
  ],
  function(domReady, runner, ui) {
    ui = ui.ui;
    var args = Array.from(arguments).filter(function(item) {
      return item;
    });
    ui.show();
    domReady(function() {
      runner
        .runAll(args)
        .then(document.respecIsReady)
        .then(function() {
          ui.enable();
          document.body.hidden = false;
        })
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
