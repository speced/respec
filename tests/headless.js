#!/usr/bin/env node
/*eslint-env node*/
"use strict";
const port = 5000;
const testURLs = [
  `http://localhost:${port}/examples/basic.built.html`,
  `http://localhost:${port}/examples/basic.html`,
];
const colors = require("colors");
const { exec } = require("child_process");
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

const handler = require("serve-handler");
const http = require("http");

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

async function runRespec2html() {
  const server = http.createServer((request, response) => {
    return handler(request, response);
  });
  server.listen(port, () => {});

  const errors = new Set();
  // Incrementally spawn processes and add them to process counter.
  const executables = testURLs.map(url => {
    const nullDevice =
      process.platform === "win32" ? "\\\\.\\NUL" : "/dev/null";
    const disableSandbox = process.env.TRAVIS ? " --disable-sandbox" : "";
    const cmd = `node ./tools/respec2html.js -e${disableSandbox} --timeout 30 --src ${url} --out ${nullDevice}`;
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
  debug(" ⏲  Running ReSpec2html tests...");
  try {
    await runRespec2html();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

run();
