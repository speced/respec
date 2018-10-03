/*exported pickRandomsFromList, makeRSDoc, flushIframes,
 makeStandardOps, makeDefaultBody, makeBasicConfig*/
"use strict";
const iframes = [];

function makeRSDoc(opts = {}, src = "about-blank.html", style = "") {
  return new Promise((resove, reject) => {
    const ifr = document.createElement("iframe");
    opts = opts || {};
    // reject when DEFAULT_TIMEOUT_INTERVAL passes
    const timeoutId = setTimeout(() => {
      reject(new Error("Timed out waiting on " + src));
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
    ifr.addEventListener("load", function() {
      const doc = this.contentDocument;
      decorateDocument(doc, opts);
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
        resove(doc);
        clearTimeout(timeoutId);
      });
    });
    ifr.style.display = "none";
    if (style) {
      try {
        ifr.style = style;
      } catch ({ message }) {
        console.warn(`Could not override iframe style: ${style} (${message})`);
      }
    }
    if (src) {
      ifr.src = src;
    }
    // trigger load
    document.body.appendChild(ifr);
    iframes.push(ifr);
  });
}

function decorateDocument(doc, opts) {
  function intoAttributes(element, key) {
    element.setAttribute(key, this[key]);
    return element;
  }

  function decorateHead(opts) {
    const path = opts.jsPath || "../js/";
    const loader = this.ownerDocument.createElement("script");
    const config = this.ownerDocument.createElement("script");
    switch (Math.round(Math.random() * 2)) {
      case 2:
        loader.defer = true;
        break;
      case 1:
        loader.async = true;
        break;
    }
    let configText = "";
    if (opts.config) {
      configText =
        "var respecConfig = " + JSON.stringify(opts.config || {}) + ";";
    }
    config.classList.add("remove");
    config.innerText = configText;
    const isKarma = !!window.__karma__;
    const loadAttr = {
      src: isKarma
        ? new URL("/base/builds/respec-w3c-common.js", location).href
        : "/js/deps/require.js",
      "data-main": isKarma ? "" : path + (opts.profile || "profile-w3c-common"),
    };
    Object.keys(loadAttr)
      .reduce(intoAttributes.bind(loadAttr), loader)
      .classList.add("remove");
    this.appendChild(config);
    // "preProcess" gets destroyed by JSON.stringify above... so we need to recreate it
    if (opts.config && Array.isArray(opts.config.preProcess)) {
      const window = config.ownerDocument.defaultView;
      window.respecConfig.preProcess = opts.config.preProcess;
    }
    this.appendChild(loader);
  }

  function decorateBody(opts) {
    let bodyText = `
      <section id='abstract'>
        ${opts.abstract === undefined ? "<p>test abstract</p>" : opts.abstract}
      </section>
    `;
    if (opts.body) {
      bodyText = bodyText.concat(opts.body);
    }
    this.innerHTML = this.innerHTML.concat(bodyText);
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
  decorateBody.call(doc.body, opts);
  decorateHead.call(doc.head, opts);
}

function flushIframes() {
  while (iframes.length) {
    // Popping them from the list prevents memory leaks.
    iframes.pop().remove();
  }
}

function pickRandomsFromList(list, howMany) {
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

function makeBasicConfig() {
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
}

function makeDefaultBody() {
  return "<section id='sotd'><p>foo</p></section><section id='toc'></section>";
}

/**
 *
 * @param configParams
 * @param bodyParams
 * @returns {{config: {editors, specStatus, edDraftURI, shortName, previousMaturity, previousPublishDate, errata, implementationReportURI, perEnd, lint} & any, body: string}}
 */

function makeStandardOps(config = {}, body = makeDefaultBody()) {
  return {
    body,
    config: { ...makeBasicConfig(), ...config },
  };
}
