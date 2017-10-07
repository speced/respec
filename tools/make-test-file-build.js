#!/usr/bin/env node

"use strict";
const fsp = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const testsPath = path.resolve(__dirname, "../tests");

function toJSON(files) {
  const pathMatcher = new RegExp(`${testsPath}/`, "g");
  const paths = files
    .split("\n")
    .map(path => path.replace(pathMatcher, ""))
    .filter(path => path)
    .sort();
  return JSON.stringify(paths, null, 2);
}

const run = async () => {
  const fileName = `${testsPath}/testFiles.json`;
  const cmd = `find ${testsPath} -name "*-spec.js"`;
  const files = await toExecPromise(cmd);
  const json = toJSON(files);
  await fsp.writeFile(fileName, json, "utf-8");
  process.exit(0);
};

run().catch(err => {
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
