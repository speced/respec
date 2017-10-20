#!/usr/bin/env node

"use strict";
const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const fsp = require("fs-extra");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

const srcDesMap = new Map([
  ["./node_modules/clipboard/dist/clipboard.js", "./js/deps/"],
  ["./node_modules/domReady/domReady.js", "./js/deps/"],
  [
    "./node_modules/handlebars/dist/handlebars.runtime.js",
    "./js/deps/handlebars.js",
  ],
  ["./node_modules/highlight.js/src/styles/github.css", "./js/core/css/"],
  ["./node_modules/hyperhtml/index.js", "./js/deps/hyperhtml.js"],
  ["./node_modules/jquery/dist/jquery.js", "./js/deps/"],
  ["./node_modules/js-beautify/js/lib/beautify-css.js", "./js/deps/"],
  ["./node_modules/js-beautify/js/lib/beautify-html.js", "./js/deps/"],
  ["./node_modules/js-beautify/js/lib/beautify.js", "./js/deps/"],
  ["./node_modules/marked/lib/marked.js", "./js/deps/"],
  ["./node_modules/requirejs/require.js", "./js/deps/"],
  ["./node_modules/text/text.js", "./js/deps/"],
  ["./node_modules/url-search-params/build/url-search-params.js", "./js/deps/"],
  ["./node_modules/webidl2/lib/webidl2.js", "./js/deps/"],
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
  const fullSource = toFullPath(source);
  const fullDest = toFullPath(dest);
  const baseName = path.basename(fullSource);
  const actualDestination = path.extname(fullDest)
    ? fullDest
    : path.resolve(fullDest, baseName);
  await fsp.ensureFile(actualDestination);
  const readableStream = fs.createReadStream(fullSource);
  const writableStream = fs.createWriteStream(actualDestination);
  readableStream.setEncoding("utf8");
  readableStream.pipe(writableStream);
  return new Promise(resolve => {
    readableStream.on("end", resolve);
  });
}

function toFullPath(p, base = process.cwd()) {
  return path.isAbsolute(p) ? p : path.normalize(path.resolve(`${base}/${p}`));
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
  .catch(err => console.error(err));
