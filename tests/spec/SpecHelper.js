"use strict";
import {
  installFetchRewrite,
  rewriteServiceUrl,
  validateServiceOrigins,
} from "./service-origin-rewrite.js";

const iframes = [];

/**
 * @return {Promise<Document>}
 */
export function makeRSDoc(opts, src, style = "") {
  opts = { profile: "w3c", ...opts };
  return new Promise((resolve, reject) => {
    const ifr = document.createElement("iframe");
    // Name the document: `src` is undefined for every srcdoc-built document, so
    // this message used to read "Timed out waiting on undefined".
    const what = src ?? `srcdoc document (${opts.profile} profile)`;
    // reject when DEFAULT_TIMEOUT_INTERVAL passes
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out waiting on ${what}`));
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
    ifr.addEventListener("load", async () => {
      const doc = ifr.contentDocument;
      if (src) {
        decorateDocument(doc, opts);
      }
      if (doc.respec) {
        await doc.respec.ready;
        // Clear the timer on this path too, not only in the message handler
        // below. If it stays armed, jasmine abandons the spec first, then the
        // timer rejects a promise nobody holds; karma reports that as an error
        // thrown in afterAll and can abort the run with tests still unexecuted
        // and uncounted.
        clearTimeout(timeoutId);
        resolve(doc);
      }
      window.addEventListener("message", function msgHandler(ev) {
        if (
          !doc ||
          !ev.source ||
          doc !== ev.source.document ||
          ev.data.topic !== "end-all"
        ) {
          return;
        }
        window.removeEventListener("message", msgHandler);
        resolve(doc);
        clearTimeout(timeoutId);
      });
    });
    ifr.style.display = "none";
    if (style) {
      try {
        ifr.style = style;
      } catch ({ message }) {
        // eslint-disable-next-line no-console
        console.warn(`Could not override iframe style: ${style} (${message})`);
      }
    }
    if (src) {
      ifr.src = src;
    } else {
      const doc = document.implementation.createHTMLDocument();
      decorateDocument(doc, opts);
      ifr.srcdoc = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
    }
    // trigger load
    document.body.appendChild(ifr);
    iframes.push(ifr);
  });
}
/**
 * Used to get errors and warnings from a spec.
 */
class UIMessageFilters {
  /**
   * @param {"warnings" | "errors"} type
   */
  constructor(type) {
    this.cache = new Map();
    this.type = type;
  }
  /**
   * @param {string} pluginName
   * @returns (Document) => Array<RespecError>
   */
  filter(pluginName) {
    if (this.cache.has(pluginName)) {
      return this.cache.get(pluginName);
    }
    const filter = doc => {
      return doc.respec[this.type].filter(err => err.plugin === pluginName);
    };
    this.cache.set(pluginName, filter);
    return filter;
  }
}
export const errorFilters = new UIMessageFilters("errors");
export const warningFilters = new UIMessageFilters("warnings");

/** For syntax highlighting in IDE */
export const html = String.raw;

/**
 * @param {Document} doc
 * @returns {Promise<Document>}
 */
export async function getExportedDoc(doc) {
  const exportedHTML = await doc.respec.toHTML();
  return new Promise(resolve => {
    const ifr = document.createElement("iframe");
    ifr.addEventListener("load", () => resolve(ifr.contentDocument));
    ifr.srcdoc = exportedHTML;
    document.body.appendChild(ifr);
    iframes.push(ifr);
  });
}

function decorateDocument(doc, opts) {
  function intoAttributes(element, key) {
    element.setAttribute(key, this[key]);
    return element;
  }

  function addReSpecLoader(opts) {
    const { profile } = opts;
    const loader = doc.createElement("script");
    loader.classList.add("remove");
    loader.src = `/base/builds/respec-${profile}.js`;
    doc.head.appendChild(loader);
  }

  function addRespecConfig(opts) {
    const config = doc.createElement("script");
    const configText = opts.config
      ? `var respecConfig = ${JSON.stringify(opts.config || {})};`
      : "";
    config.classList.add("remove");
    config.textContent = configText;
    doc.head.appendChild(config);
    // "preProcess" gets destroyed by JSON.stringify above... so we need to recreate it
    if (opts.config && Array.isArray(opts.config.preProcess)) {
      const window = config.ownerDocument.defaultView;
      window.respecConfig.preProcess = opts.config.preProcess;
    }
  }

  function decorateBody({
    abstract = "<p>test abstract</p>",
    body = "",
    bodyAttrs = {},
  }) {
    if (abstract !== null) {
      doc.body.innerHTML += `<section id='abstract'>${abstract}</section>`;
    }
    doc.body.innerHTML += body;
    Object.entries(bodyAttrs).forEach(([key, value]) => {
      doc.body.setAttribute(key, value);
    });
  }

  function addFetchRewrite() {
    const map = globalThis.__karma__?.config?.serviceOrigins;
    if (!map || !Object.keys(map).length) return;
    // Validate here as well as inside the installer. When the injected script
    // throws, it only fires the iframe's error event and nothing listens for
    // that, so a bad variable would leave every document with no wrapper, still
    // hitting production. Calling it from the karma context fails a spec instead.
    validateServiceOrigins(map);
    const script = doc.createElement("script");
    script.classList.add("remove");
    // Inline the source rather than import it: makeRSDoc builds this document
    // detached and then hands it to ifr.srcdoc, so a module would not have run
    // by the time ReSpec loads. What matters is that this runs while the browser
    // parses the document rather than after it loads, which is why src-loaded
    // fixtures get only partial coverage. Position within <head> does not
    // matter, since ReSpec defers its pipeline behind a Promise.all.
    //
    // List every function the installer calls. Leave one out and the browser
    // throws a ReferenceError, which kills the script and installs nothing.
    // Emit them as bare declarations, because a parenthesised function
    // expression binds no name and the call below would throw.
    const payload = `
      ${rewriteServiceUrl.toString()}
      ${validateServiceOrigins.toString()}
      ${installFetchRewrite.toString()}
      installFetchRewrite(window, ${JSON.stringify(map)});
    `;
    // A "</script" in the payload would close this element once makeRSDoc
    // serializes the document into srcdoc, spilling raw JS into the body and
    // installing no wrapper at all. It can only occur inside a string, since it
    // is a syntax error in code, so escaping the slash is always safe. Escaping
    // every "<" would not be: "<" is no operator, so that would break any
    // comparison a future edit puts in these functions.
    const escaped = payload.replace(/<\/(script)/gi, "<\\/$1");
    script.textContent = escaped;
    doc.head.appendChild(script);
  }

  if (opts.htmlAttrs) {
    Object.keys(opts.htmlAttrs).reduce(
      intoAttributes.bind(opts.htmlAttrs),
      doc.documentElement
    );
  }
  if (opts.title) {
    doc.title = opts.title;
  }
  decorateBody(opts);
  addFetchRewrite();
  addRespecConfig(opts);
  if (!doc.querySelector("script[src]")) {
    addReSpecLoader(opts);
  }
}

export function flushIframes() {
  while (iframes.length) {
    // Popping them from the list prevents memory leaks.
    iframes.pop().remove();
  }
}

export function pickRandomsFromList(list, howMany) {
  // Get at least half by default.
  if (!howMany) {
    howMany = Math.floor(list.length / 2);
  }
  if (howMany > list.length) {
    // Return a new list, but randomized.
    return list.slice().sort(() => {
      return Math.round(Math.random() * (1 - -1) + -1);
    });
  }
  const collectedValues = [];
  // collect a unique set based on howMany we need.
  while (collectedValues.length < howMany) {
    const potentialValue = Math.floor(Math.random() * list.length);
    if (collectedValues.indexOf(potentialValue) === -1) {
      collectedValues.push(potentialValue);
    }
  }
  // Reduce the collectedValues into a new list
  return collectedValues.reduce((randList, next) => {
    randList.push(list[next]);
    return randList;
  }, []);
}

export function makeBasicConfig(profile = "w3c") {
  switch (profile) {
    case "w3c":
      return {
        editors: [
          {
            name: "Person Name",
            w3cid: "12345",
          },
        ],
        specStatus: "ED",
        edDraftURI: "https://foo.com",
        shortName: "Foo",
        previousMaturity: "CR",
        previousPublishDate: "1999-01-01",
        errata: "https://github.com/tabatkins/bikeshed",
        implementationReportURI: "https://example.com/implementationReportURI",
        perEnd: "1999-01-01",
        lint: false,
        definitionMap: {},
      };
    case "aom":
      return {
        editors: [
          {
            name: "Person Name",
          },
        ],
        specStatus: "PD",
      };
    case "dini":
      return {
        editors: [
          {
            name: "Person Name",
          },
        ],
        specStatus: "base",
      };
    default:
      throw new Error(`Unknown profile: ${profile}`);
  }
}

export function makeDefaultBody() {
  return "<section id='sotd'><p>foo</p></section><section id='toc'></section>";
}

/**
 *
 * @param configParams
 * @param bodyParams
 * @returns {{config: {editors, specStatus, edDraftURI, shortName, previousMaturity, previousPublishDate, errata, implementationReportURI, perEnd, lint} & any, body: string}}
 */

export function makeStandardOps(config = {}, body = makeDefaultBody()) {
  return {
    body,
    config: { ...makeBasicConfig(), ...config },
  };
}

export function makeStandardAomOps(config = {}, body = makeDefaultBody()) {
  return {
    body,
    config: { ...makeBasicConfig("aom"), ...config },
    profile: "aom",
  };
}

export function makeStandardDiniOps(config = {}, body = makeDefaultBody()) {
  return {
    body,
    config: { ...makeBasicConfig("dini"), ...config },
    profile: "dini",
  };
}
