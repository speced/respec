/*exported pickRandomsFromList, makeRSDoc, flushIframes,
 makeStandardOps, makeDefaultBody, makeBasicConfig*/
"use strict";
var iframes = [];

function makeRSDoc(opts = {}, cb = () => {}, src = "about:blank", style = "") {
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
        if (!doc || !ev.source || doc !== ev.source.document || ev.data.topic !== "end-all") {
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
      } catch (err) {
        console.warn("Could not override iframe style: " + style + " (" + err.message + ")");
      }
    }
    ifr.src = src;
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
    var configText = "var respecConfig = " + JSON.stringify(opts.config || {}) + ";";
    config.classList.add("remove");
    config.innerText = configText;
    var loadAttr = {
      src: "/js/deps/require.js",
      "data-main": path + (opts.profile || "profile-w3c-common")
    };
    Object
      .keys(loadAttr)
      .reduce(intoAttributes.bind(loadAttr), loader)
      .classList.add("remove");
    this.appendChild(config);
    this.appendChild(loader);
  }

  function decorateBody(opts) {
    var bodyText = opts.abstract || "<section id='abstract'><p>test abstract</p></section>";
    if (opts.body) {
      bodyText = bodyText.concat(opts.body);
    }
    this.innerHTML = this.innerHTML.concat(bodyText);
  }

  if (opts.htmlAttrs) {
    Object
      .keys(opts.htmlAttrs)
      .reduce(intoAttributes.bind(opts.htmlAttrs), doc.documentElement);
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
    return list
      .slice()
      .sort(function randomSort() {
        return Math.round(Math.random() * (1 - (-1)) + -1);
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
    editors: [{
      name: "Person Name"
    }],
    specStatus: "ED",
    edDraftURI: "http://foo.com",
    shortName: "Foo",
    previousMaturity: "CR",
    previousPublishDate: "1999-01-01",
    errata: "https://github.com/tabatkins/bikeshed",
    implementationReportURI: "http://example.com/implementationReportURI",
    perEnd: "1999-01-01",
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
/*
Polyfill for Object.assign() from:
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
*/
/* jshint ignore:start */
if (typeof Object.assign !== "function") {
  (function() {
    Object.assign = function(target) {
      "use strict";
      if (target === undefined || target === null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
/* jshint ignore:end */
