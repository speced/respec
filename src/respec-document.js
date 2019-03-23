// @ts-check
/**
 * @typedef {PromiseParameter<ReturnType<typeof createRespecDocument>>} RespecDocument
 */

/**
 * @param {string} text 
 */
async function parseDocument(text) {
  if (typeof DOMParser !== "undefined") {
    return new DOMParser().parseFromString(text, "text/html");
  }
  const { JSDOM } = await import("jsdom");
  // This won't load any internal styles or scripts
  return new JSDOM(text).window.document;
}

/**
 * @param {string|Document} doc
 * @param {*} [conf]
 */
export async function createRespecDocument(doc, conf) {
  const document = typeof doc === "string" ?
    await parseDocument(doc) :
    doc;
  const configuration = conf || (document.defaultView && document.defaultView.respecConfig);
  if (!configuration) {
    throw new Error("Configuration object required if not given within document");
  }
  return { document, configuration };
}

