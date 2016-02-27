#!/usr/local/bin/node

"use strict";
const async = require("marcosc-async");
const colors = require("colors");
const fsp = require("fs-promise");
const path = require("path");
const builder = require("./build-w3c-common");

colors.setTheme({
  data: "grey",
  debug: "cyan",
  error: "red",
  help: "cyan",
  info: "green",
  input: "grey",
  prompt: "grey",
  verbose: "cyan",
  warn: "yellow",
});

function checkIfFileExists(filePath) {
  return async.task(function*() {
    const stats = yield fsp.lstat(filePath);
    if (!stats.isFile()) {
      throw new Error(`File not found: ${filePath}`);
    }
    console.log(colors.info(`Ok! File built successfully: ${filePath}`));
  });
}

async.task(function*() {
  console.log(colors.debug("Starting tests... build latest!"));
  const latest = path.join(__dirname, "../builds/respec-w3c-common.js");
  const randomName = "test-" + Math.round(Math.random() * 10000000);
  const customPath = path.join(__dirname, `../builds/respec-w3c-common-${randomName}.js`);
  yield Promise.all([builder.buildW3C(), builder.buildW3C(randomName)]);
  yield checkIfFileExists(latest);
  yield checkIfFileExists(customPath);
  yield fsp.deleteFile(customPath);
  console.log(colors.debug(`Deleted ${customPath}.`));
}).catch(err => {
  console.log(colors.error(err.stack));
  process.exit(1);
});

