#!/usr/local/bin/node
/*jshint strict: true, node:true*/
"use strict";
const fs = require("fs");
const builder = require("../tools/build-w3c-common");
const exec = require("child_process").exec;
const express  = require("express");
const noOp = function(){};
let processCounter = 0;

run();

function done() {
  processCounter--;
  if (!processCounter) {
    process.exit(0);
  }
}

function runPhantom() {
  if (process.env.TRACE) {
    console.log("PhantomJS version:");
    let childProcess = exec("phantomjs -v", noOp);
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  }
  processCounter++;
  const cmd = `phantomjs --ssl-protocol=any ./tests/phantom.js ${process.argv.slice(2).join(" ")}`;
  const childProcess = exec(cmd, noOp);
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  childProcess.on("exit", code => (code > 0) ? process.exit(code) : done());
}

function buildFailureReporter(source) {
  return function(code) {
    if (code > 0) {
      console.error(`Running respec2html on ${source} failed.`);
      process.exit(code);
    } else {
      console.log(`Success building ${source}.`);
    }
    done();
  };
}

function runRespec2html() {
  // Run respec2html.js on each example file (except "embedder.html" and "PresentationAPI.html")
  // and stops in error if any of them reports a warning or an error
  let sources = fs.readdirSync("examples")
    .filter(filename => filename.match(/\.html$/))
    .filter(filename => filename !== "embedder.html")
    .filter(filename => filename !== "PresentationAPI.html");

  // Spawn processes and add them to process counter.
  processCounter += sources.map((source) => {
    // We use --delay 1 since the examples use the non-compiled version
    // of respec, which takes a bit longer to load
    const cmd = `phantomjs --ssl-protocol=any ./tools/respec2html.js --delay 1 -w -e examples/${source}`;
    console.log(`Running ${cmd}`);
    const childProcess = exec(cmd, noOp);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on("exit", buildFailureReporter(source));
    return childProcess;
  }).length;
}

function run(){
  const app = express();
  const dir = require("path").join(__dirname, "..");
  app.use(express.static(dir));
  app.listen(3000);
  if (process.env.TRAVIS) {
    runPhantom();
    runRespec2html();
    return;
  }
  const versionSnapshot = false;
  builder.buildW3C(versionSnapshot, () => {
    console.log("Script built");
    runPhantom();
    runRespec2html();
  });
}

