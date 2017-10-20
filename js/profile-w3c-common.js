"use strict";
// In case everything else fails, we want the error
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
  },
  paths: {
    "handlebars.runtime": "deps/handlebars",
    "deps/highlight": "https://www.w3.org/Tools/respec/respec-highlight",
  },
  deps: ["deps/hyperhtml", "deps/url-search-params"],
});

define(
  [
    // order is significant
    "deps/domReady",
    "core/base-runner",
    "core/ui",
    //"core/xrefs",
    // "core/l10n",
    // "w3c/defaults",
    // "core/aria",
    // "core/style",
    // "w3c/style",
    // "w3c/l10n",
    // "core/github",
    // "core/data-include",
    // "core/markdown",
    // "w3c/headers",
    // "w3c/abstract",
    // "w3c/conformance",
    // "core/data-transform",
    // "core/inlines",
    "core/webidl",
    //"core/dfn",
    // "w3c/rfc2119",
    // "core/examples",
    // "core/issues-notes",
    // "core/requirements",
    // "core/best-practices",
    // "core/figures",
    // "core/data-cite",
    // "core/biblio",
    // "core/webidl-index",
    //"core/link-to-dfn",
    // "core/contrib",
    // "core/fix-headers",
    // "core/structure",
    // "w3c/informative",
    // "w3c/permalinks",
    // "core/id-headers",
    // "core/rdfa",
    // "core/location-hash",
    // "ui/about-respec",
    // "ui/dfn-list",
    // "ui/save-html",
    // "ui/search-specref",
    // "core/seo",
    // "w3c/seo",
    // "core/highlight",
    // "core/webidl-clipboard",
    // "core/data-tests",
    // /*Linter must be the last thing to run*/
    // "core/linter",
  ],
  function(domReady, runner, { ui }) {
    const args = Array.from(arguments).filter(item => item);
    ui.show();
    domReady(async () => {
      try {
        await Promise.all([runner.runAll(args), document.respecIsReady]);
      } catch (err) {
        console.error(err);
      } finally {
        // even if things go critically bad, we should still try to show the UI
        ui.enable();
      }
    });
  }
);
