#!/usr/bin/env node
"use strict";
const port = process.env.PORT || 3000;
const testURLs = [
  "https://w3c.github.io/html-media-capture/",
  "https://w3c.github.io/manifest/",
  "https://w3c.github.io/payment-request/",
  "https://w3c.github.io/resource-hints/",
  "https://w3c.github.io/wpub/",
  "https://webaudio.github.io/web-audio-api/",
  "https://wicg.github.io/web-share-target/",
  `http://localhost:${port}/examples/basic.built.html`,
  `http://localhost:${port}/examples/basic.html`,
];
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

async function runRespec2html(server) {
  const errors = new Set();
  const captureFile = /(\w+\.html)/;
  // Incrementally spawn processes and add them to process counter.
  const executables = testURLs.map(url => {
    const nullDevice =
      process.platform === "win32" ? "\\\\.\\NUL" : "/dev/null";
    const cmd = `node ./tools/respec2html.js -e --timeout 30 --src ${url} --out ${nullDevice}`;
    return toExecutable(cmd);
  });
  let testCount = 1;
  for (const exe of executables) {
    try {
      const testInfo = colors.info(`(test ${testCount++}/${testURLs.length})`);
      const msg = ` 👷‍♀️  ${exe.cmd} ${testInfo}`;
      debug(msg);
      await exe.run();
    } catch (err) {
      console.error(colors.error(err));
      errors.add(exe.cmd);
    }
  }
  if (errors.size) {
    const files = [...errors].join(", ");
    throw new Error(` ❌ File(s) generated errors: ${files}.`);
  }
}

function debug(msg) {
  console.log(colors.debug(`${colors.input(moment().format("LTS"))} ${msg}`));
}

async function run() {
  const server = "http://localhost:" + port;
  debug(" ✅  Starting up Express...");
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
