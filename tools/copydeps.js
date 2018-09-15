#!/usr/bin/env node

"use strict";
const path = require("path");
const fsp = require("fs-extra");

const srcDesMap = [
  ["./node_modules/clipboard/dist/clipboard.js", "./js/deps/"],
  [
    "./node_modules/handlebars/dist/handlebars.runtime.js",
    "./js/deps/handlebars.js",
  ],
  ["./node_modules/highlight.js/src/styles/github.css", "./js/core/css/"],
  ["./node_modules/hyperhtml/index.js", "./js/deps/hyperhtml.js"],
  ["./node_modules/jquery/dist/jquery.slim.js", "./js/deps/jquery.js"],
  ["./node_modules/marked/lib/marked.js", "./js/deps/"],
  ["./node_modules/requirejs/require.js", "./js/deps/"],
  ["./node_modules/text/text.js", "./js/deps/"],
  ["./node_modules/webidl2/lib/webidl2.js", "./js/deps/"],
  ["./node_modules/pluralize/pluralize.js", "./js/deps/"],
  ["./node_modules/idb-keyval/dist/idb-keyval-amd.min.js", "./js/deps/idb.js"],
];

const deprecated = [
  [
    "./node_modules/domReady/domReady.js",
    "Use standard DOMContentLoaded and document.readyState instead.",
  ],
];

async function cp(source, dest) {
  const baseName = path.basename(source);
  const actualDestination = path.extname(dest)
    ? dest
    : path.resolve(dest, baseName);
  await fsp.copy(source, actualDestination);
}

// Copy them again
async function copyDeps() {
  const copyPromises = srcDesMap.map(([source, dest]) => cp(source, dest));
  await Promise.all(copyPromises);
}

async function copyDeprecated() {
  const promises = deprecated.map(async ([dep, guide]) => {
    const basename = path.basename(dep, ".js");
    await cp(dep, `./js/deps/_${basename}.js`);

    const message = `The dependency \`deps/${basename}\` is deprecated. ${guide}`;
    const wrapper = `define(["deps/_${basename}"], dep => { console.warn("${message}"); return dep; });`;
    await fsp.writeFile(`./js/deps/${basename}.js`, wrapper);
  });
  await Promise.all(promises);
}

// Delete dependent files
(async () => {
  try {
    await fsp.remove("./js/deps/");
    await fsp.remove("./js/core/css/github.css");
    await copyDeps();
    await copyDeprecated();
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
})();
