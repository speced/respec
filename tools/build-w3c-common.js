#!/usr/local/bin/node

"use strict";
const async = require("marcosc-async");
const builder = require("./builder");
const fs = require("fs");
const path = require("path");
const colors = require('colors');

colors.setTheme({
  data: 'grey',
  debug: 'cyan',
  error: 'red',
  help: 'cyan',
  info: 'green',
  input: 'grey',
  prompt: 'grey',
  verbose: 'cyan',
  warn: 'yellow',
});

// Helper function for Node functions not returning promises.
function dataHandler(resolve, reject) {
  return function(err, data) {
    return (err) ? reject(err) : resolve(data);
  };
}

const getPackageVersion = async(function*() {
  const packagePath = path.join(__dirname, "../package.json");
  const packageContents = yield new Promise((resolve, reject) => {
    fs.readFile(packagePath, "utf-8", dataHandler(resolve, reject));
  });
  return JSON.parse(packageContents).version;
});

const buildW3C = async(function*(aVersion) {
  aVersion = (!aVersion) ? "latest" : aVersion;
  const builds = path.join(__dirname, "../builds");
  const isLatest = aVersion === "latest";
  const version = (isLatest) ? yield getPackageVersion() : aVersion;
  const outFile = "respec-w3c-common" + ((isLatest) ? ".js" : `-${aVersion}.js`);
  const out = path.join(builds, outFile);
  yield new Promise((resolve) => {
    builder.build({
      out, version
    }, resolve);
  });
});

if (require.main === module) {
  buildW3C()
    .then(() => console.log(colors.info("OK!")))
    .catch((err) => console.log(colors.error(`ERROR! ${err.message}`)));
}

exports.buildW3C = buildW3C;
