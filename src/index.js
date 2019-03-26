// @ts-check
import { cleanup } from "./core/exporter";
import { createRespecDocument } from "./respec-document";
import insertStyle from "./core/style";
import insertW3CStyle from "./w3c/style";
import reindent from "./core/reindent";

/**
 * @param {string|Document} doc A document that will be preprocessed
 * @param {*} [conf] a configuration object for preprocessor
 */
export async function preprocess(doc, conf) {
  const respecDoc = await createRespecDocument(doc, conf);
  reindent(respecDoc);
  await insertStyle(respecDoc);
  insertW3CStyle(respecDoc);

  cleanup(respecDoc.document, respecDoc.hub);
  return respecDoc;
}
