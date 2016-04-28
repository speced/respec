"use strict";
/**
 * Sub resource integrity strings can be dynamically added to each node
 * as RequireJS loads them from a CDN.
 *
 */
var sriTable = {
  "https://code.jquery.com/jquery-2.2.3.min.js": "sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo="
};

// this is only set in a build, not at all in the dev environment
require.config({
  shim: {
    shortcut: {
      exports: "shortcut"
    },
    Promise: {
      exports: "Promise"
    },
  },
  paths: {
    "fetch": "/node_modules/whatwg-fetch/fetch",
    "handlebars": "/node_modules/handlebars/dist/handlebars",
    "jquery": "https://code.jquery.com/jquery-2.2.3.min",
    "Promise": "/node_modules/promise-polyfill/promise",
    "webidl2": "/node_modules/webidl2/lib/webidl2",
  },
  deps: [
    "fetch",
    "jquery",
    "Promise",
    "core/jquery-enhanced",
  ],
  onNodeCreated: function(node, config, moduleName, url) {
    console.log(node, config, moduleName, url);
    if(url in sriTable){
      node.crossOrigin = "anonymous";
      node.integrity = sriTable[url];
    }
    return node;
  }
});

define([
    // order is significant
    "domReady",
    "core/base-runner",
    "core/ui",
    "core/include-config",
    "core/override-configuration",
    "core/default-root-attr",
    "w3c/l10n",
    "core/markdown",
    "core/style",
    "w3c/style",
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
    "core/highlight",
    "core/best-practices",
    "core/figures",
    "core/biblio",
    "core/webidl-contiguous",
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
    "core/remove-respec",
    "core/location-hash",
    "ui/about-respec",
    "ui/dfn-list",
    "ui/save-html",
    "ui/search-specref",
  ],
  function(domReady, runner, ui) {
    var args = Array.from(arguments);
    domReady(function() {
      ui.addCommand("Save Snapshot", "ui/save-html", "Ctrl+Shift+Alt+S");
      ui.addCommand("About ReSpec", "ui/about-respec", "Ctrl+Shift+Alt+A");
      ui.addCommand("Definition List", "ui/dfn-list", "Ctrl+Shift+Alt+D");
      ui.addCommand("Search Specref DB", "ui/search-specref", "Ctrl+Shift+Alt+space");
      runner
        .runAll(args)
        .then(document.respectIsReady)
        .then(ui.show)
        .catch(function(err){
          console.error(err);
          // even if things go critically bad, we should still try to show the UI
          ui.show();
        });
    });
  }
);
