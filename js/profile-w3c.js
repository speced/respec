"use strict";
// In case everything else fails, we want the error
window.addEventListener("error", ev => {
  console.error(ev.error, ev.message, ev);
});

const modules = [
  // order is significant
  import("../src/core/base-runner.js"),
  import("../src/core/ui.js"),
  import("../src/core/reindent.js"),
  import("../src/core/location-hash.js"),
  import("../src/core/l10n.js"),
  import("../src/w3c/defaults.js"),
  import("../src/core/style.js"),
  import("../src/w3c/style.js"),
  import("../src/w3c/l10n.js"),
  import("../src/core/github.js"),
  import("../src/core/data-include.js"),
  import("../src/core/markdown.js"),
  import("../src/w3c/headers.js"),
  import("../src/w3c/abstract.js"),
  import("../src/core/data-transform.js"),
  import("../src/core/data-abbr.js"),
  import("../src/core/inlines.js"),
  import("../src/w3c/conformance.js"),
  import("../src/core/dfn.js"),
  import("../src/core/pluralize.js"),
  import("../src/core/examples.js"),
  import("../src/core/issues-notes.js"),
  import("../src/core/requirements.js"),
  import("../src/core/best-practices.js"),
  import("../src/core/figures.js"),
  import("../src/core/webidl.js"),
  import("../src/core/data-cite.js"),
  import("../src/core/biblio.js"),
  import("../src/core/webidl-index.js"),
  import("../src/core/link-to-dfn.js"),
  import("../src/core/render-biblio.js"),
  import("../src/core/contrib.js"),
  import("../src/core/fix-headers.js"),
  import("../src/core/structure.js"),
  import("../src/core/informative.js"),
  import("../src/core/id-headers.js"),
  import("../src/core/caniuse.js"),
  import("../src/core/mdn-annotation.js"),
  import("../src/ui/save-html.js"),
  import("../src/ui/search-specref.js"),
  import("../src/ui/search-xref.js"),
  import("../src/ui/dfn-list.js"),
  import("../src/ui/about-respec.js"),
  import("../src/core/seo.js"),
  import("../src/w3c/seo.js"),
  import("../src/core/highlight.js"),
  import("../src/core/webidl-clipboard.js"),
  import("../src/core/data-tests.js"),
  import("../src/core/list-sorter.js"),
  import("../src/core/highlight-vars.js"),
  import("../src/core/data-type.js"),
  import("../src/core/algorithms.js"),
  import("../src/core/anchor-expander.js"),
  /* Linter must be the last thing to run */
  import("../src/core/linter.js"),
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
