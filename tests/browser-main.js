/*
This is run by SpecRunner.js
*/
"use strict";
require.config({
  // to set the default folder
  baseUrl: "../js",
  // paths: maps ids with paths (no extension)
  paths: {
    "jasmine": "/node_modules/jasmine-core/lib/jasmine-core/jasmine",
    "jasmine-html": "/node_modules/jasmine-core/lib/jasmine-core/jasmine-html",
    "jasmine-boot": "/node_modules/jasmine-core/lib/jasmine-core/boot",
    "jquery": "/node_modules/jquery/dist/jquery",
    "fetch": "/node_modules/whatwg-fetch/fetch",
  },
  // shim: makes external libraries compatible with requirejs (AMD)
  shim: {
    shortcut: {
      exports: "shortcut"
    },
    "jasmine-html": {
      deps: ["jasmine"]
    },
    "jasmine-boot": {
      deps: ["jasmine", "jasmine-html"]
    }
  }
});

require(["text!/tests/testFiles.json", "jquery", "jasmine-boot"], function(testFiles, jquery) {
  var tests = JSON.parse(testFiles);
  window.$ = jquery;
  function toScript(testPath) {
    var script = document.createElement("script");
    script.src = testPath;
    script.async = true;
    script.defer = true;
    return script;
  }

  function intoElement(containerElem, nextScript) {
    containerElem.appendChild(nextScript);
    return containerElem;
  }

  function toLoadPromise(script) {
    return new Promise(function(resolve, reject) {
      script.onload = resolve;
      script.onerror = function() {
        reject(new Error(`${this.src} failed to load`));
      };
    });
  }

  function intoCollection(collection, next) {
    collection.push(next);
    return collection;
  }

  new Promise(function(resolve, reject) {
    var promisesToLoad = [];
    try {
      var scripts = tests.map(toScript);
      scripts
        .map(toLoadPromise)
        .reduce(intoCollection, promisesToLoad);
      scripts
        .reduce(intoElement, document.head);
    } catch (err) {
      reject(err);
    } finally {
      return Promise.all(promisesToLoad).then(resolve);
    }
  }).then(function() {
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    window.onload();
  }).catch(function(err) {
    console.error(err);
  });
});
