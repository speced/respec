#!/usr/local/bin/node

"use strict";
const async = require("marcosc-async");
const colors = require("colors");
const fs = require("fs");
const path = require("path");
const builder = require("./build-w3c-common");

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

async.task(function*() {
  console.log(colors.debug("Starting tests..."));
  // Build latest
  let testFilePath = path.join(__dirname, "../builds/respec-w3c-common.js");
  yield builder.buildW3C();
  yield checkFileExists(testFilePath);
  console.log(colors.info(`OK! File built successfully: ${testFilePath}`));

  // Build custom version
  let name = "test-" + Math.round(Math.random() * 10000000);
  testFilePath = path.join(__dirname, `../builds/respec-w3c-common-${name}.js`);
  yield builder.buildW3C(name);
  yield checkFileExists(testFilePath);
  console.log(colors.info(`Ok! File built successfully: ${testFilePath}`));
  console.log(colors.debug(`Deleting ${testFilePath}.`))
  deleteFile(testFilePath);
}).catch(err => {
  console.log(err);
  process.exit(1);
});

function deleteFile(file) {
  return new Promise((resolve, reject) => {
    fs.deleteFile(file, (err) => {
      return (err) ? reject() : resolve();
    })
  })
}

function checkFileExists(filePath) {
  new Promise((resolve, reject) => {
    fs.lstat(filePath, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (!stats.isFile()) {
        const noFileErr = new Error(`File not found: ${filePath}`);
        return reject(noFileErr);
      }
      resolve();
    });
  });
}
