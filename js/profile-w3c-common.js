"use strict";
// In case everything else fails, we want the error
window.addEventListener("error", ev => {
  console.error(ev.error, ev.message, ev);
});

// this is only set in a build, not at all in the dev environment
require.config({
  paths: {
    clipboard: "deps/clipboard",
    hyperhtml: "deps/hyperhtml",
    idb: "deps/idb",
    jquery: "deps/jquery",
    marked: "deps/marked",
    pluralize: "deps/pluralize",
    text: "deps/text",
    webidl2: "deps/webidl2",
  },
  shim: {
    shortcut: {
      exports: "shortcut",
    },
    highlight: {
      exports: "hljs",
    },
  },
});

define([
  // order is significant
  "./core/base-runner",
  "./core/ui",
  "./core/reindent",
  "./core/location-hash",
  "./core/l10n",
  "./w3c/defaults",
  "./core/style",
  "./w3c/style",
  "./w3c/l10n",
  "./core/github",
  "./core/data-include",
  "./core/markdown",
  "./w3c/headers",
  "./w3c/abstract",
  "./w3c/conformance",
  "./core/data-transform",
  "./core/inlines",
  "./core/dfn",
  "./core/pluralize",
  "./w3c/rfc2119",
  "./core/examples",
  "./core/issues-notes",
  "./core/requirements",
  "./core/best-practices",
  "./core/figures",
  "./core/webidl",
  "./core/data-cite",
  "./core/biblio",
  "./core/webidl-index",
  "./core/link-to-dfn",
  "./core/render-biblio",
  "./core/contrib",
  "./core/fix-headers",
  "./core/structure",
  "./w3c/informative",
  "./core/id-headers",
  "./core/caniuse",
  "./ui/save-html",
  "./ui/search-specref",
  "./ui/dfn-list",
  "./ui/about-respec",
  "./core/seo",
  "./w3c/seo",
  "./core/highlight",
  "./core/webidl-clipboard",
  "./core/data-tests",
  "./core/list-sorter",
  "./core/highlight-vars",
  "./core/algorithms",
  /* Linter must be the last thing to run */
  "./core/linter",
], (runner, { ui }, ...plugins) => {
  ui.show();
  domReady().then(async () => {
    try {
      await runner.runAll(plugins);
      await document.respecIsReady;
    } catch (err) {
      console.error(err);
    } finally {
      ui.enable();
    }
  });
});

async function domReady() {
  if (document.readyState === "loading") {
    await new Promise(resolve =>
      document.addEventListener("DOMContentLoaded", resolve)
    );
  }
}
