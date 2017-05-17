#!/usr/bin/env node

"use strict";
const async = require("marcosc-async");
const fsp = require("fs-promise");
const path = require("path");
const { exec } = require("child_process");
const testsPath = path.resolve(__dirname, "../tests");

function toJSON(files) {
  const pathMatcher = new RegExp(`${testsPath}/`, "g");
  const paths = files
    .split("\n")
    .map(path => path.replace(pathMatcher, ""))
    .filter(path => path);
  return JSON.stringify(paths, null, 2);
}

async
  .task(function*() {
    const fileName = `${testsPath}/testFiles.json`;
    const cmd = `find ${testsPath} -name "*-spec.js"`;
    const files = yield toExecPromise(cmd);
    const json = toJSON(files);
    yield fsp.writeFile(fileName, json, "utf-8");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

function toExecPromise(cmd) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Command took too long: ${cmd}`));
      proc.kill("SIGTERM");
    }, 20000);
    const proc = exec(cmd, (err, stdout) => {
      clearTimeout(id);
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
}
