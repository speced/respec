"use strict";
// In case everything else fails, we always want to show the document
window.addEventListener("error", function(ev) {
  console.error(ev.error, ev.message, ev);
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
  deps: ["deps/hyperhtml", "geonovum/deps/leaflet"],
});

define(
  [
    // order is significant
    "deps/domReady",
    "core/base-runner",
    "core/ui",
    "core/location-hash",
    "core/l10n",
    // "w3c/defaults",
    "geonovum/defaults",
    "core/style",
    "geonovum/style",
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
    "core/pluralize",
    // "w3c/rfc2119",
    "core/examples",
    "core/issues-notes",
    "core/requirements",
    "core/best-practices",
    "core/figures",
    // "core/webidl",
    "core/data-cite",
    "core/biblio",
    // "core/webidl-index",
    "core/link-to-dfn",
    "core/render-biblio",
    "core/contrib",
    "core/fix-headers",
    "core/structure",
    "geonovum/informative", // TODO: check: voor een niet normatieve tekst is een apart script opgenomen. Is dit nog nodig? Of naar i10n vertalen?
    "geonovum/permalinks", // TODO: check wat die nu nog precies doet, kan nodig zijn dat dit custom Geonovum is
    "core/id-headers",
    "core/caniuse",
    // "w3c/aria",
    "geonovum/leafletfigures", // TODO: opnemen in docs: eigen Geonovum doc
    "ui/save-html",
    "ui/search-specref",
    "ui/dfn-list",
    "ui/about-respec",
    "core/seo",
    "geonovum/seo",
    "core/highlight",
    // "core/webidl-clipboard",
    // "core/data-tests",
    "core/list-sorter",
    "core/highlight-vars",
    /*Linter must be the last thing to run*/
    "core/linter",
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
        })
        .catch(function(err) {
          console.error(err);
          // even if things go critically bad, we should still try to show the UI
          ui.enable();
        });
    });
  }
);
