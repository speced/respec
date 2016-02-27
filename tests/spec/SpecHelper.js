/*exported pickRandomsFromList, makeRSDoc, flushIframes,
 makeStandardOps, makeDefaultBody, makeBasicConfig, isPhantom*/
"use strict";
var iframes = [];

function makeRSDoc(opts, cb, src, style) {
  return new Promise(function(resove, reject) {
    if (!src) {
      src = "about:blank";
    }
    if (!style) {
      style = "display: none";
    }
    var $ifr = $("<iframe src='" + src + "' style='" + style + "'></iframe>");
    opts = opts || {};
    $ifr.on("load", function() {
      var destDoc = $ifr[0].contentDocument;
      var body = destDoc.body;
      var head = destDoc.head;
      if (opts.htmlAttrs) {
        $(destDoc.documentElement).attr(opts.htmlAttrs);
      }
      if (opts.title) {
        destDoc.title = opts.title;
      }
      $(body).append(opts.abstract || $("<section id='abstract'><p>test abstract</p></section>"));
      if (opts.body) {
        $(body).append(opts.body);
      }
      var path = opts.jsPath || "../js/";
      var config = destDoc.createElement("script");
      $(config)
        .text("var respecConfig = " + JSON.stringify(opts.config || {}) + ";")
        .addClass("remove");
      head.appendChild(config);
      var loader = destDoc.createElement("script");
      var loadAttr = {
        src: "/node_modules/requirejs/require.js",
        "data-main": path + (opts.profile || "profile-w3c-common")
      };
      $(loader)
        .attr(loadAttr)
        .addClass("remove");
      head.appendChild(loader);
      var handleAndVerify = function(doc) {
        return function handler(ev) {
          if (ev.data.topic === "end-all" && doc === ev.source.document) {
            window.removeEventListener("message", handler);
            cb(doc);
            resove();
          }
        };
      };
      // intercept that in the iframe we have finished processing
      window.addEventListener("message", handleAndVerify(destDoc));
    });
    // trigger load
    $ifr.appendTo($("body"));
    iframes.push($ifr);
    setTimeout(function() {
      reject(new Error("Timed out waiting on " + src));
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
  });
}

function flushIframes() {
  while (iframes.length) {
    // Poping them from the list prevents memory leaks.
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

function isPhantom() {
  return window.callPhantom || window._phantom;
}

function makeBasicConfig() {
  return {
    editors: [{
      name: "Person Name"
    }],
    specStatus: "ED",
    edDraftURI: "http://foo.com",
    shortName: "Foo",
  };
}

function makeDefaultBody() {
  return "<section id='sotd'><p>foo</p></section>";
}

function makeStandardOps() {
  return {
    config: makeBasicConfig(),
    body: makeDefaultBody(),
  };
}
