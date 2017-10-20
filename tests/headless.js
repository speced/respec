#!/usr/bin/env node

/*jshint strict: true, node:true*/
"use strict";
const fs = require("fs");
const colors = require("colors");
const { exec } = require("child_process");
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
    },
  };
}

const excludedFiles = new Set([
  "basic.built.html",
  "embedder.html",
  "manifest.html",
  "starter.html",
  "webidl.html",
]);

async function runRespec2html(server) {
  const errors = new Set();
  const captureFile = /(\w+\.html)/;
  // Run respec2html.js on each example file (except whatever gets filtered)
  // and stops in error if any of them reports a warning or an error
  let sources = fs
    .readdirSync("examples")
    .filter(filename => filename.match(/\.html$/))
    .filter(filename => !excludedFiles.has(filename));

  // Incrementally spawn processes and add them to process counter.
  const promisesToRun = sources
    .map(source => {
      let nullDevice =
        process.platform === "win32" ? "\\\\.\\NUL" : "/dev/null";
      let cmd = `node ./tools/respec2html.js -e --timeout 10 --src ${server}/examples/${source} --out ${nullDevice}`;
      return cmd;
    })
    .map(toExecutable)
    .map(async (exe, testCount) => {
      const [, filename] = captureFile.exec(exe.cmd);
      try {
        const msg = ` 👷‍♀️  Generating ${filename} - test ${testCount+1} of ${sources.length}.`;
        debug(msg);
        await exe.run();
      } catch (err) {
        console.error(colors.error(err));
        errors.add(filename);
      }
    });
  await Promise.all(promisesToRun);
  if (errors.size) {
    const files = [...errors].join(", ");
    throw new Error(` ❌ File(s) generated errors: ${files}.`);
  }
}

function debug(msg) {
  console.log(colors.debug(`${colors.input(moment().format("LTS"))} ${msg}`));
}

async function run() {
  const port = process.env.PORT || 3000;
  const server = "http://localhost:" + port;
  debug(" ✅ Starting up Express...");
  const app = express();
  const dir = require("path").join(__dirname, "..");
  app.use(express.static(dir));
  app.listen(port);
  debug(" ⏲  Running ReSpec2html tests...");
  try {
    await runRespec2html(server);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

run();
