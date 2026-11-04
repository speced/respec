"use strict";
import { cachesCleared } from "./respec-cache-helper.js";
import { validateServiceOrigins } from "./service-origin-rewrite.js";

const iframes = [];

/**
 * Registers the service worker that redirects respec.org and specref requests to
 * whatever origins the karma config names, and resolves once it controls this
 * page. Every spec document is a child of this page, so they inherit it.
 */
const serviceWorkerReady = (async () => {
  await navigator.serviceWorker.register("/respec-test-sw.js", {
    type: "module",
  });
  if (navigator.serviceWorker.controller) return;
  // Keep this wait: register() resolves before the worker activates and claims
  // the page, and the first makeRSDoc would then find no controller to send its
  // origins to.
  await new Promise(resolve => {
    navigator.serviceWorker.addEventListener("controllerchange", resolve, {
      once: true,
    });
  });
})();

/**
 * Sends `message` to the service worker and resolves with its reply.
 *
 * @param {object} message
 */
async function askServiceWorker(message) {
  await serviceWorkerReady;
  const worker = navigator.serviceWorker.controller;
  if (!worker) {
    throw new Error(
      "No service worker controls this page, so every service request would go to production."
    );
  }
  return new Promise(resolve => {
    const channel = new MessageChannel();
    channel.port1.addEventListener("message", ev => resolve(ev.data), {
      once: true,
    });
    channel.port1.start();
    worker.postMessage(message, [channel.port2]);
  });
}

/**
 * Hands the service worker the origins named in the karma config, and waits for
 * it to confirm. `makeRSDoc` does this per document, so one spec's redirects
 * cannot leak into the next.
 */
async function configureServiceWorker() {
  const origins = new Map(
    Object.entries(globalThis.__karma__?.config?.serviceOrigins ?? {})
  );
  validateServiceOrigins(origins);
  await askServiceWorker({ type: "configure", origins: [...origins] });
}

/**
 * Every URL the service worker has redirected since the last `makeRSDoc` call.
 *
 * @returns {Promise<string[]>}
 */
export async function serviceWorkerRedirects() {
  const { redirects } = await askServiceWorker({ type: "report" });
  return redirects;
}

/**
 * @return {Promise<Document>}
 */
export async function makeRSDoc(opts, src, style = "") {
  opts = { profile: "w3c", ...opts };
  await Promise.all([configureServiceWorker(), cachesCleared]);
  return new Promise((resolve, reject) => {
    const ifr = document.createElement("iframe");
    // reject when DEFAULT_TIMEOUT_INTERVAL passes
    const timeoutId = setTimeout(() => {
      const what = src ?? `srcdoc document (${opts.profile} profile)`;
      reject(new Error(`Timed out waiting on ${what}`));
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
    ifr.addEventListener("load", async () => {
      const doc = ifr.contentDocument;
      if (src) {
        decorateDocument(doc, opts);
      }
      if (doc.respec) {
        await doc.respec.ready;
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

  /**
   * Makes this document's Cache API miss every lookup and discard every write,
   * while the karma config redirects service requests to a local service.
   *
   * Leave this in: fetchAndCache in core/utils.js reads and writes the cache
   * from inside the document, where the service worker cannot see it, and it
   * stamps whatever it stores with a fresh 24 hour expiry under the production
   * URL. So one document's local response would answer the next document's
   * lookup instead of the service being asked again.
   */
  function blockCacheWhileRedirected() {
    const configured = globalThis.__karma__?.config?.serviceOrigins;
    if (!Object.keys(configured ?? {}).length) return;
    const script = doc.createElement("script");
    script.classList.add("remove");
    script.textContent = `
      Object.defineProperty(window, "caches", {
        configurable: true,
        value: {
          async open() {
            return { async match() {}, async put() {} };
          },
        },
      });
    `;
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
  blockCacheWhileRedirected();
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
