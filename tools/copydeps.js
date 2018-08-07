#!/usr/bin/env node

"use strict";
const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const fsp = require("fs-extra");

const srcDesMap = new Map([
  ["./node_modules/clipboard/dist/clipboard.js", "./js/deps/"],
  ["./node_modules/domReady/domReady.js", "./js/deps/"],
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
  ["./node_modules/url-search-params/build/url-search-params.js", "./js/deps/"],
  ["./node_modules/webidl2/lib/webidl2.js", "./js/deps/"],
  ["./node_modules/pluralize/pluralize.js", "./js/deps/"],
  ["./node_modules/idb-keyval/dist/idb-keyval-amd.min.js", "./js/deps/idb.js"],
]);

function makePathResolver(base) {
  return file => toFullPath(file, base);
}

// simulate rm
async function rm(...files) {
  for (const file of files) {
    const fullPath = toFullPath(file);
    const resolveToThisPath = makePathResolver(fullPath);
    let lstat;
    try {
      lstat = await stat(fullPath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw new Error(err.message);
      }
      console.warn("File not found: " + fullPath);
      continue;
    }
    if (lstat.isDirectory()) {
      const innerFiles = await readdir(fullPath);
      const paths = innerFiles.map(resolveToThisPath);
      await rm(...paths);
      continue;
    }
    await unlink(fullPath);
  }
}

async function cp(source, dest) {
  const baseName = path.basename(source);
  const actualDestination = path.extname(dest)
    ? dest
    : path.resolve(dest, baseName);
  await fsp.copy(source, actualDestination);
}

// Copy them again
async function copyDeps() {
  const copyPromises = [];
  for (const [source, dest] of srcDesMap.entries()) {
    copyPromises.push(cp(source, dest));
  }
  await Promise.all(copyPromises);
}

// Delete dependent files
rm("./js/deps/", "./js/core/css/github.css")
  .then(copyDeps)
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
