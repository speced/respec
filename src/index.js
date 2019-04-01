// @ts-check
import addL10nConfiguration, { setDocumentLocale } from "./core/l10n";
import { cleanup } from "./core/exporter";
import { createRespecDocument } from "./respec-document";
import insertStyle from "./core/style";
import insertW3CHeader from "./w3c/headers";
import insertW3CStyle from "./w3c/style";
import processAbstract from "./w3c/abstract";
import processMarkdown from "./core/markdown";
import reindent from "./core/reindent";
import setGitHubConfiguration from "./core/github";

/**
 * @param {string|Document} doc A document that will be preprocessed
 * @param {*} [conf] a configuration object for preprocessor
 */
export async function preprocess(doc, conf) {
  const respecDoc = await createRespecDocument(doc, conf);
  setDocumentLocale(respecDoc.document);
  reindent(respecDoc);
  await insertStyle(respecDoc);
  insertW3CStyle(respecDoc);
  addL10nConfiguration(respecDoc);
  setGitHubConfiguration(respecDoc);
  processMarkdown(respecDoc);
  insertW3CHeader(respecDoc);
  processAbstract(respecDoc);

  cleanup(respecDoc.document, respecDoc.hub);
  return respecDoc;
}
