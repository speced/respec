import { Biblio } from "./core/biblio.js";
import { DefinitionMap } from "./core/dfn-map.js";
import { PubSubHub } from "./core/pubsubhub.js";

// @ts-check
/**
 * @typedef {PromiseParameter<ReturnType<typeof createRespecDocument>>} RespecDocument
 */

/**
 * @param {string} text
 */
export async function parseDocument(text) {
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
  if (document.defaultView) {
    // only to pass tests
    document.defaultView.respecConfig = configuration;
  }
  const { continueOnError } = configuration;
  delete configuration.continueOnError; // TODO: remove this line
  return {
    document,
    configuration,
    hub: new PubSubHub({ continueOnError }),

    /** @type {Record<string, boolean>} */
    rfc2119Usage: Object.create(null),

    definitionMap: new DefinitionMap(),

    biblio: new Biblio(),

    get lang() {
      return document.documentElement.lang;
    },
  };
}
