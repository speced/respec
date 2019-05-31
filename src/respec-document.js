import { DefinitionMap } from "./core/dfn-map.js";
import { PubSubHub } from "./core/pubsubhub.js";

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
  const document = typeof doc === "string" ? await parseDocument(doc) : doc;
  const configuration =
    conf || (document.defaultView && document.defaultView.respecConfig);
  if (!configuration) {
    throw new Error(
      "Configuration object required if not given within document"
    );
  }
  return {
    document,
    configuration,
    hub: new PubSubHub(),

    /** @type {Record<string, boolean>} */
    rfc2119Usage: Object.create(null),

    definitionMap: new DefinitionMap(),

    /** @type {Record<string, *>} */
    biblio: {},

    get lang() {
      return document.documentElement.lang;
    },
  };
}
