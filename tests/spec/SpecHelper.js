/*exported pickRandomsFromList, makeRSDoc, flushIframes,
 makeStandardOps, makeDefaultBody, makeBasicConfig*/
"use strict";
var iframes = [];

function makeRSDoc(
  opts = {},
  cb = () => {},
  src = "about-blank.html",
  style = ""
) {
  return new Promise(function(resove, reject) {
    var ifr = document.createElement("iframe");
    opts = opts || {};
    // reject when DEFAULT_TIMEOUT_INTERVAL passes
    var timeoutId = setTimeout(function() {
      reject(new Error("Timed out waiting on " + src));
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
    ifr.addEventListener("load", function() {
      var doc = this.contentDocument;
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
        cb(doc);
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
    var path = opts.jsPath || "../js/";
    var loader = this.ownerDocument.createElement("script");
    var config = this.ownerDocument.createElement("script");
    switch (Math.round(Math.random() * 2)) {
      case 2:
        loader.defer = true;
        break;
      case 1:
        loader.async = true;
        break;
    }
    var configText = "";
    if (opts.config) {
      configText =
        "var respecConfig = " + JSON.stringify(opts.config || {}) + ";";
    }
    config.classList.add("remove");
    config.innerText = configText;
    var isKarma = !!window.__karma__;
    var loadAttr = {
      src: isKarma
        ? new URL("/base/builds/respec-w3c-common.js", location).href
        : "/js/deps/require.js",
      "data-main": isKarma ? "" : path + (opts.profile || "profile-w3c-common"),
    };
    Object.keys(loadAttr)
      .reduce(intoAttributes.bind(loadAttr), loader)
      .classList.add("remove");
    this.appendChild(config);
    this.appendChild(loader);
  }

  function decorateBody(opts) {
    var bodyText = `
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
    return list.slice().sort(function randomSort() {
      return Math.round(Math.random() * (1 - -1) + -1);
    });
  }
  var collectedValues = [];
  // collect a unique set based on howMany we need.
  while (collectedValues.length < howMany) {
    var potentialValue = Math.floor(Math.random() * list.length);
    if (collectedValues.indexOf(potentialValue) === -1) {
      collectedValues.push(potentialValue);
    }
  }
  // Reduce the collectedValues into a new list
  return collectedValues.reduce(function(randList, next) {
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
  };
}

function makeDefaultBody() {
  return "<section id='sotd'><p>foo</p></section><section id='toc'></section>";
}

function makeStandardOps() {
  return {
    config: makeBasicConfig(),
    body: makeDefaultBody(),
  };
}

/**
 * partial equivalent to jquery's $(selector:contains('text'))
 * @param {String} selector
 * @param {String|RegExp} text text to search
 * @param context
 * returns: Array of valid selectors
 * example:
 *  selectorContains("dt", "Editors:", doc)
 *    <=>
 *  $("dt:contains('Editors:'", doc)
 */
function selectorContains(selector, text, context = document) {
  const re = new RegExp(text);
  return [...context.querySelectorAll(selector)]
    .filter(element => re.test(element.textContent));
}

/**
 * partial equivalent to jquery's `el.next([type])`
 * @param {Node} element element whose sibling is to be found
 * @param {String} tagname tagname of sibling.
 * return: element's sibling which has the tagname as tagName or null
 * default: return nextSibling (if tagname = "")
 * example:
 *   let el = $("dt:contains('Editor:')", doc);
*    nextSiblingOfType(el, "dd")
 *    <=>
 *   el.next("dd");
 */
function nextSiblingOfType(element, tagname = "") {
  if (!tagname) {
    return element.nextSibling;
  }
  let temp = element.nextSibling;
  while (temp) {
    if (temp.tagName.toLowerCase() === tagname) {
      return temp;
    }
    temp = temp.nextSibling;
  }
  return null;
}
