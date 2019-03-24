// @ts-check
import { createRespecDocument } from "./respec-document";
import insertStyle from "./core/style";
import reindent from "./core/reindent";

/**
 * @param {string|Document} doc A document that will be preprocessed
 * @param {*} [conf] a configuration object for preprocessor
 */
export async function preprocess(doc, conf) {
  const respecDocument = await createRespecDocument(doc, conf);
  reindent(respecDocument);
  await insertStyle(respecDocument);
  return respecDocument;
}
