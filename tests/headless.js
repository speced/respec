#!/usr/local/bin/node

/*jshint strict: true, node:true*/
"use strict";
const fs = require("fs");
const async = require("marcosc-async");
const builder = require("../tools/build-w3c-common");
const colors = require('colors');
const exec = require("child_process").exec;
const express = require("express");
const noOp = function() {};
const moment = require("moment");
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

function spawnPhantom(url) {
  if (process.env.TRACE) {
    debug("PhantomJS version:");
    let childProcess = exec("phantomjs -v", noOp);
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  }
  const args = process.argv.slice(2).join(" ");
  const cmd = `phantomjs --ssl-protocol=any ./tests/phantom.js ${url} ${args}`;
  return toExecutable(cmd).run();
}

function toExecutable(cmd) {
  return {
    get cmd() {
      return cmd;
    },
    run() {
      debug(`Executing: ${cmd}`);
      const childProcess = exec(cmd, noOp);
      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);
      return new Promise((resolve, reject) => {
        let handler = function(code) {
          debug(`Done: ${cmd} (${code})`);
          if (code) {
            return reject(new Error(`Error ({code}): ${cmd}`));
          }
          resolve();
        };
        childProcess.on("exit", handler);
      });
    }
  };
}

const runRespec2html = async(function*(server) {
  // Run respec2html.js on each example file (except "embedder.html" and "PresentationAPI.html")
  // and stops in error if any of them reports a warning or an error
  let sources = fs.readdirSync("examples")
    .filter(filename => filename.match(/\.html$/))
    .filter(filename => filename !== "embedder.html")
    .filter(filename => filename !== "PresentationAPI.html");

  // Incrementally spawn processes and add them to process counter.
  const executables = sources.map((source) => {
    let cmd = "phantomjs --ssl-protocol=any ./tools/respec2html.js " +
      `--delay 1 -w -e ${server}/examples/${source} /dev/null 10`;
    return cmd;
  }).map(
    toExecutable
  );
  for (const exe of executables) {
    try {
      yield exe.run();
    } catch (err) {
      console.error(colors.error(err));
    }
  }
});

function debug(msg) {
  console.log(colors.debug(`${colors.input(moment().format("LTS"))} ${msg}`));
}

async.task(function*() {
  const server = "http://localhost:3000";
  const specRunner = `${server}/tests/phantom-runner.html`;
  debug("Starting up Express...");
  const app = express();
  const dir = require("path").join(__dirname, "..");
  app.use(express.static(dir));
  app.listen(3000);

  if (process.env.TRAVIS) {
    yield runRespec2html(server);
    yield spawnPhantom(specRunner);
    return;
  }
  debug("Building ReSpec...");
  yield builder.buildW3C();
  debug("Running ReSpec2html tests...");
  yield runRespec2html(server);
  debug("Starting up PhantomJS + Jasmine...");
  yield spawnPhantom(specRunner);
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
