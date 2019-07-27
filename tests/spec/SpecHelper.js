"use strict";

import fetch from "../../src/core/fetch.js";

const iframes = [];

export async function makeRSDoc(opts, src, style = "") {
  if (typeof document !== "undefined") {
    return makeRSDocInIframe(opts, src, style);
  }
  // TODO: remove this line
  if (!opts.config.logos) {
    opts.config.logos = [];
  }
  opts.config.continueOnError = true;
  const { parseDocument } = await import("../../src/respec-document.js");
  const { preprocess } = await import("../../src/index.js");
  const html = src
    ? await (await fetch(new URL(src, getLocationOrigin()))).text()
    : opts.body;
  const doc = await parseDocument(html);
  decorateDocument(doc, opts);
  const rsDoc = await preprocess(doc, opts.config);
  return rsDoc.document;
}

function setHtmlAttrs(element, htmlAttrs) {
  for (const [key, value] of Object.entries(htmlAttrs)) {
    element.setAttribute(key, value);
  }
}

/**
 * @return {Promise<Document>}
 */
function makeRSDocInIframe(opts, src, style = "") {
  opts = { profile: "w3c", ...opts };
  return new Promise((resolve, reject) => {
    const ifr = document.createElement("iframe");
    // reject when DEFAULT_TIMEOUT_INTERVAL passes
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out waiting on ${src}`));
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
    ifr.addEventListener("load", async () => {
      const doc = ifr.contentDocument;
      if (src) {
        decorateDocument(doc, opts);
        insertReSpec(doc, opts);
      }
      if (doc.respecIsReady) {
        await doc.respecIsReady;
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
      doc.body.innerHTML = opts.body || "";
      decorateDocument(doc, opts);
      insertReSpec(doc, opts);
      ifr.srcdoc = doc.documentElement.outerHTML;
    }
    // trigger load
    document.body.appendChild(ifr);
    iframes.push(ifr);
  });
}

/**
 * @param {Document} doc
 * @param {*} opts
 */
function decorateDocument(doc, opts) {
  const { abstract = "<p>test abstract</p>", bodyAttrs = {} } = opts;
  doc.body.insertAdjacentHTML(
    "afterbegin",
    `<section id='abstract'>${abstract}</section>`
  );
  setHtmlAttrs(doc.body, bodyAttrs);

  if (opts.htmlAttrs) {
    setHtmlAttrs(doc.documentElement, opts.htmlAttrs);
  }
  if (opts.title) {
    doc.title = opts.title;
  }
}

function insertReSpec(doc, opts) {
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
    case "geonovum":
      return {
        editors: [
          {
            name: "Person Name",
          },
        ],
        specStatus: "GN-BASIS",
        edDraftURI: "https://foo.com",
        shortName: "Foo",
      };
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

export function makeStandardGeoOps(config = {}, body = makeDefaultBody()) {
  return {
    body,
    config: { ...makeBasicConfig("geonovum"), ...config },
  };
}

export function getLocationOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // This must match your actual server port
  return "http://localhost:5000";
}
