"use strict";
// In case everything else fails, we want the error
window.addEventListener("error", ev => {
  console.error(ev.error, ev.message, ev);
});

const modules = [
  // order is significant
  import("./core/base-runner.js"),
  import("./core/ui.js"),
  import("./core/jquery-enhanced.js"),
  import("./core/reindent.js"),
  import("./core/location-hash.js"),
  import("./core/l10n.js"),
  import("./w3c/defaults.js"),
  import("./core/style.js"),
  import("./w3c/style.js"),
  import("./w3c/l10n.js"),
  import("./core/github.js"),
  import("./core/data-include.js"),
  import("./core/markdown.js"),
  import("./w3c/headers.js"),
  import("./w3c/abstract.js"),
  import("./core/data-transform.js"),
  import("./core/data-abbr.js"),
  import("./core/inlines.js"),
  import("./w3c/conformance.js"),
  import("./core/dfn.js"),
  import("./core/pluralize.js"),
  import("./core/examples.js"),
  import("./core/issues-notes.js"),
  import("./core/requirements.js"),
  import("./core/best-practices.js"),
  import("./core/figures.js"),
  import("./core/webidl.js"),
  import("./core/data-cite.js"),
  import("./core/biblio.js"),
  import("./core/webidl-index.js"),
  import("./core/link-to-dfn.js"),
  import("./core/render-biblio.js"),
  import("./core/contrib.js"),
  import("./core/fix-headers.js"),
  import("./core/structure.js"),
  import("./core/informative.js"),
  import("./core/id-headers.js"),
  import("./core/caniuse.js"),
  import("./core/mdn-annotation.js"),
  import("./ui/save-html.js"),
  import("./ui/search-specref.js"),
  import("./ui/dfn-list.js"),
  import("./ui/about-respec.js"),
  import("./core/seo.js"),
  import("./w3c/seo.js"),
  import("./core/highlight.js"),
  import("./core/webidl-clipboard.js"),
  import("./core/data-tests.js"),
  import("./core/list-sorter.js"),
  import("./core/highlight-vars.js"),
  import("./core/data-type.js"),
  import("./core/algorithms.js"),
  import("./core/anchor-expander.js"),
  /* Linter must be the last thing to run */
  import("./core/linter.js"),
];

async function domReady() {
  if (document.readyState === "loading") {
    await new Promise(resolve =>
      document.addEventListener("DOMContentLoaded", resolve)
    );
  }
}

(async () => {
  const [runner, { ui }, ...plugins] = await Promise.all(modules);
  try {
    ui.show();
    await domReady();
    await runner.runAll(plugins);
  } finally {
    ui.enable();
  }
})().catch(err => {
  console.error(err);
});
