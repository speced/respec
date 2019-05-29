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
  ];

  for (const module of modules) {
    const loaded = await module;
    await loaded.default(respecDoc);
  }

  cleanup(respecDoc.document, respecDoc.hub);
  return respecDoc;
}
