#!/usr/local/bin/node

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
  "embedder.html",
  "starter.html",
  "basic.built.html",
]);

const runRespec2html = async(function*(server) {
  // Run respec2html.js on each example file (except whatever gets filtered)
  // and stops in error if any of them reports a warning or an error
  let sources = fs.readdirSync("examples")
    .filter(filename => filename.match(/\.html$/))
    .filter(filename => !excludedFiles.has(filename));

  // Incrementally spawn processes and add them to process counter.
  const executables = sources.map((source) => {
    let cmd = "phantomjs --ssl-protocol=any ./tools/respec2html.js " +
      `--delay 1 -w -e ${server}/examples/${source} /dev/null 10`;
    return cmd;
  }).map(
    toExecutable
  );
  var testCount = 1;
  var errored = false;
  for (const exe of executables) {
    try {
      debug(` 🚄  Running test ${testCount++} of ${sources.length}.`);
      yield exe.run();
    } catch (err) {
      console.error(colors.error(err));
      errored = true;
    }
  }
  if(errored){
    throw new Error(" ❌ A test generated an error");
  }
});

function debug(msg) {
  console.log(colors.debug(`${colors.input(moment().format("LTS"))} ${msg}`));
}

async.task(function*() {
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
  yield runRespec2html(server);
})
.then(
  () => process.exit(0)
)
.catch((err) => {
  console.error(err);
  process.exit(1);
});
