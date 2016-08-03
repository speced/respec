#!/usr/bin/env node

/*jshint strict: true, node:true*/
"use strict";
const fs = require("fs");
const async = require("marcosc-async");
const builder = require("../tools/build-w3c-common");
const colors = require("colors");
const exec = require("child_process").exec;
const express = require("express");
const moment = require("moment");
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

function toExecutable(cmd) {
  return {
    get cmd() {
      return cmd;
    },
    run() {
      return new Promise((resolve, reject) => {
        const childProcess = exec(cmd, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
      });
    }
  };
}

const excludedFiles = new Set([
  "basic.built.html",
  "embedder.html",
  "manifest.html",
  "starter.html",
  "webidl-contiguous.html",
]);

const runRespec2html = async(function* (server) {
  // Run respec2html.js on each example file (except whatever gets filtered)
  // and stops in error if any of them reports a warning or an error
  let sources = fs.readdirSync("examples")
    .filter(filename => filename.match(/\.html$/))
    .filter(filename => !excludedFiles.has(filename));

  // Incrementally spawn processes and add them to process counter.
  const executables = sources.map((source) => {
    let cmd = `node ./tools/respec2html.js -e --timeout 10 --src ${server}/examples/${source} --out /dev/null`;
    return cmd;
  }).map(
    toExecutable
  );
  let testCount = 1;
  const errored = new Set();
  const captureFile = /(\w+\.html)/;
  for (const exe of executables) {
    const filename = captureFile.exec(exe.cmd)[1];
    try {
      debug(` 🚄  Generating ${filename} - test ${testCount++} of ${sources.length}.`);
      yield exe.run();
    } catch (err) {
      console.error(colors.error(err));
      errored.add(filename);
    }
  }
  if (errored.size) {
    const files = Array.from(errored).join(", ");
    throw new Error(` ❌ File(s) generated errors: ${files}.`);
  }
});

function debug(msg) {
  console.log(colors.debug(`${colors.input(moment().format("LTS"))} ${msg}`));
}

async.task(function* () {
  const port = process.env.PORT || 3000;
  const server = "http://localhost:" + port;
  debug(" ✅ Starting up Express...");
  const app = express();
  const dir = require("path").join(__dirname, "..");
  app.use(express.static(dir));
  app.listen(port);
  debug(" ⏲  Building ReSpec...");
  yield builder.buildW3C("latest");
  debug(" ⏲  Running ReSpec2html tests...");
  try {
    yield runRespec2html(server);
  } catch (err) {
    throw err;
  }
})
.then(
  () => process.exit(0)
)
.catch((err) => {
  console.error(err);
  process.exit(1);
});
