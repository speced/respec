#!/usr/bin/env node
// @ts-check
/* eslint-env node */
"use strict";
const port = 5000;
const respec2htmlTests = [
  {
    blockDescription: "Process builds",
    tests: [
      {
        URL: `http://localhost:${port}/examples/basic.built.html`,
        evalFunction: async exec => {
          try {
            await exec.run();
          } catch (error) {
            throw error;
          }
        },
        message: `Processes example spec employing default respec-w3c-common.js profile`,
      },
      {
        URL: `http://localhost:${port}/examples/basic.html`,
        evalFunction: async exec => {
          try {
            await exec.run();
          } catch (error) {
            throw error;
          }
        },
        message: `Processes example spec employing source JS files being pushed`,
      },
    ],
  },
  {
    blockDescription: "Process warnings and builds",
    tests: [
      {
        URL: `http://localhost:${port}/tests/respec2htmlTests/multiple-warn.html`,
        evalFunction: async exec => {
          try {
            await exec.run();
          } catch (error) {
            // TODO check against expected errors and warnings
            // throw error;
          }
        },
        message: `Shows multiple warnings and errors in terminal`,
      },
    ],
  },
];
const colors = require("colors");
const { exec } = require("child_process");
const moment = require("moment");

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

function URLTorespec2htmlExecutable(url) {
  const nullDevice = process.platform === "win32" ? "\\\\.\\NUL" : "/dev/null";
  const disableSandbox = process.env.TRAVIS ? " --disable-sandbox" : "";
  const cmd = `node ./tools/respec2html.js -e${disableSandbox} --timeout 20 --src ${url} --out ${nullDevice}`;
  return toExecutable(cmd);
}

async function runRespec2html() {
  const server = http.createServer(handler);
  server.listen(port);

  const failures = new Set();
  // Incrementally spawn processes and add them to process counter.
  for (const block of respec2htmlTests) {
    const { blockDescription: description, tests } = block;
    // eslint-disable-next-line no-console
    console.log(colors.green(`${description}`));
    let testCount = 1;
    for (const { URL, evalFunction, message } of tests) {
      const exec = URLTorespec2htmlExecutable(URL);
      const num = colors.yellow(`(test ${testCount++}/${tests.length})`);
      const testInfo = `   👷‍♀️  ${exec.cmd} ${num}`;
      debug(message);
      debug(testInfo);
      try {
        await evalFunction(exec);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(colors.red(err));
        failures.add(exec.cmd);
      }
    }
  }
  if (failures.size) {
    const files = [...failures].join(", ");
    throw new Error(`   ❌ File(s) generated errors: ${files}.`);
  }
}

function debug(msg) {
  // eslint-disable-next-line no-console
  console.log(colors.grey(moment().format("LTS")) + colors.cyan(` ${msg}`));
}

async function run() {
  debug(" ⏲  Running ReSpec2html tests...");
  try {
    await runRespec2html();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

run();
