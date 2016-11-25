#!/usr/bin/env node

"use strict";
const async = require("marcosc-async");
const fsp = require("fs-promise");
const path = require("path");

const srcDesMap = new Map([
  ["./node_modules/domReady/domReady.js", "./js/deps/"],
  ["./node_modules/handlebars/dist/handlebars.runtime.js", "./js/deps/handlebars.js"],
  ["./node_modules/highlight.js/build/highlight.pack.js", "./js/deps/highlight.js"],
  ["./node_modules/highlight.js/src/styles/github.css", "./js/core/css/"],
  ["./node_modules/jquery/dist/jquery.js", "./js/deps/"],
  ["./node_modules/js-beautify/js/lib/beautify-css.js", "./js/deps/"],
  ["./node_modules/js-beautify/js/lib/beautify-html.js", "./js/deps/"],
  ["./node_modules/js-beautify/js/lib/beautify.js", "./js/deps/"],
  ["./node_modules/marcosc-async/lib/async.js", "js/deps/"],
  ["./node_modules/marked/lib/marked.js", "./js/deps/"],
  ["./node_modules/requirejs/require.js", "./js/deps/"],
  ["./node_modules/text/text.js", "./js/deps/"],
  ["./node_modules/webidl2/lib/webidl2.js", "./js/deps/"],
  ["./node_modules/whatwg-fetch/fetch.js", "./js/deps/"],
]);

function makePathResolver(base){
  return (file) => toFullPath(file, base);
}

// simulate rm
const rm = async(function*(...files) {
  for (const file of files) {
    const fullPath = toFullPath(file);
    const resolveToThisPath = makePathResolver(fullPath);
    let stat;
    try {
      stat = yield fsp.stat(fullPath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw new Error(err.message);
      }
      console.warn("File not found: " + fullPath);
      continue;
    }
    if (stat.isDirectory()) {
      const innerFiles = yield fsp.readdir(fullPath);
      const paths = innerFiles.map(resolveToThisPath);
      yield rm(...paths);
      continue;
    }
    yield fsp.remove(fullPath);
  }
});

const cp = async(function*(source, dest) {
  const fullSource = toFullPath(source);
  const fullDest = toFullPath(dest);
  const baseName = path.basename(fullSource);
  const actualDestination = (path.extname(fullDest)) ? fullDest : path.resolve(fullDest, baseName);
  const readableStream = fsp.createReadStream(fullSource);
  const writableStream = fsp.createWriteStream(actualDestination);
  readableStream.setEncoding("utf8");
  readableStream.pipe(writableStream);
  return new Promise((resolve) => {
    readableStream.on("end", resolve);
  });
});

function toFullPath(p, base = process.cwd()) {
  return path.isAbsolute(p) ? p : path.normalize(path.resolve(`${base}/${p}`));
}

// Copy them again
const copyDeps = async(function*() {
  const copyPromises = [];
  for(const [source, dest] of srcDesMap.entries()){
    copyPromises.push(cp(source, dest));
  }
  yield Promise.all(copyPromises);
});


// Delete dependent files
rm("./js/deps/","./js/core/css/github.css")
  .then(copyDeps)
  .catch(err => console.error(err));

