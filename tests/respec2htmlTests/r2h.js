#!/usr/bin/env node
// @ts-check
/* eslint-env node */
// All RespecToHTML Tests are written here. Evaluation functions define the logics
// for the tests. When an eval function throws, the test fails.

const port = 5000;

const handler = require("serve-handler");
const http = require("http");
const colors = require("colors");

const {
  parseErrorsAndWarnings,
  URLTorespec2htmlExecutable,
  debug,
} = require("./utils");

const respec2htmlTests = [
  {
    blockDescription: "Process builds",
    tests: [
      {
        URL: `http://localhost:${port}/examples/basic.built.html`,
        evalFunction: async exec => {
          // The following function will automatically throw if ReSpec fails to make the document.
          await exec.run();
        },
        message: `Processes example spec employing default respec-w3c-common.js profile`,
      },
      {
        URL: `http://localhost:${port}/examples/basic.html`,
        evalFunction: async exec => {
          await exec.run();
        },
        message: `Processes example spec employing source JS files being pushed`,
      },
    ],
  },
  {
    blockDescription: "Process warnings and errors",
    tests: [
      {
        URL: `http://localhost:${port}/tests/respec2htmlTests/multiple-warn.html`,
        evalFunction: async exec => {
          try {
            await exec.run();
          } catch (error) {
            const expectedErrors = new Set([
              "A custom SotD paragraph is required for your type of document.",
              'Document must have one element with `id="abstract"',
            ]);
            const expectedWarnings = new Set([
              "Can't find Table of Contents. Please use <nav id='toc'> around the ToC.",
            ]);
            const RecordedTerminalErrors = parseErrorsAndWarnings(
              error.toString().split("\n")
            ).filter(err => err);
            RecordedTerminalErrors.forEach(({ type, text }) => {
              switch (type) {
                case "ReSpec error":
                  if (!expectedErrors.has(text))
                    throw `Unexpected ReSpec error ${text}`;
                  expectedErrors.delete(text);
                  break;

                case "ReSpec warning":
                  if (!expectedWarnings.has(text))
                    throw `Unexpected ReSpec warning ${text}`;
                  expectedWarnings.delete(text);
                  break;

                case "Fatal error":
                  throw text;
              }
            });
            if (expectedWarnings.size || expectedErrors.size)
              throw `Expected the following errors and warnings: \n ${[
                ...expectedErrors,
                ...expectedWarnings,
              ].join("\n")}`;
          }
        },
        message: `Shows multiple errors in terminal`,
      },
    ],
  },
];

module.exports = async function() {
  // Run all R2H tests
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
        failures.add(description);
      }
    }
  }
  if (failures.size) {
    const files = [...failures].join(", ");
    throw new Error(`   ❌ Test(s) failed: ${files}.`);
  } else {
    // eslint-disable-next-line no-console
    console.log(colors.green("All Respec2HTML Test(s) Passed!"));
  }
};
