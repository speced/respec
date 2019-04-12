"use strict";
// In case everything else fails, we want the error
window.addEventListener("error", ev => {
  console.error(ev.error, ev.message, ev);
});

// this is only set in a build, not at all in the dev environment
require.config({
  paths: {
    hyperhtml: "deps/hyperhtml",
    idb: "deps/idb",
    jquery: "deps/jquery",
    marked: "deps/marked",
    pluralize: "deps/pluralize",
    text: "deps/text",
  },
  shim: {
    shortcut: {
      exports: "shortcut",
    },
    idb: {
      exports: "idb",
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
  "./geonovum/defaults",
  "./core/style",
  "./geonovum/style",
  "./geonovum/l10n",
  "./core/github",
  "./core/data-include",
  "./core/markdown",
  "./core/data-transform",
  "./core/inlines",
  "./core/dfn",
  "./core/pluralize",
  "./core/examples",
  "./core/issues-notes",
  "./core/requirements",
  "./core/best-practices",
  "./core/figures",
  "./core/data-cite",
  "./core/biblio",
  "./core/link-to-dfn",
  "./core/render-biblio",
  "./core/contrib",
  "./core/fix-headers",
  "./core/structure",
  "./core/informative",
  "./core/id-headers",
  "./ui/save-html",
  "./ui/search-specref",
  "./ui/dfn-list",
  "./ui/about-respec",
  "./core/seo",
  "./core/highlight",
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
