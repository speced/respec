// @ts-check
import { cleanup } from "./core/exporter.js";
import { createRespecDocument } from "./respec-document.js";
import { setDocumentLocale } from "./core/l10n.js";

/**
 * @param {string|Document} doc A document that will be preprocessed
 * @param {*} [conf] a configuration object for preprocessor
 */
export async function preprocess(doc, conf) {
  const respecDoc = await createRespecDocument(doc, conf);
  setDocumentLocale(respecDoc.document);

  const modules = [
    import("./core/reindent.js"),
    import("./w3c/defaults.js"),
    import("./core/style.js"),
    import("./w3c/style.js"),
    import("./core/l10n.js"),
    import("./core/github.js"),
    import("./core/markdown.js"),
    import("./w3c/headers.js"),
    import("./w3c/abstract.js"),
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
    // import("./core/caniuse.js"),
    // import("./core/mdn-annotation.js"),
    // import("./core/seo.js"),
    // import("./w3c/seo.js"),
    // import("./core/highlight.js"),
    // import("./core/webidl-clipboard.js"),
    // import("./core/data-tests.js"),
    // import("./core/list-sorter.js"),
    // import("./core/highlight-vars.js"),
    // import("./core/data-type.js"),
    // import("./core/algorithms.js"),
    // import("./core/linter.js"),
    import("./core/anchor-expander.js"),
  ];

  for (const module of modules) {
    const loaded = await module;
    await loaded.default(respecDoc);
  }

  if (!conf.noCleanup) {
    cleanup(respecDoc.document, respecDoc.hub);
  }
  return respecDoc;
}
