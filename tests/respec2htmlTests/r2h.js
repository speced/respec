#!/usr/bin/env node
// @ts-check
/* eslint-env node */
// All RespecToHTML Tests are written here. Evaluation functions define the logics
// for the tests. When an eval function throws, the test fails.

const port = 5000;

const handler = require("serve-handler");
const http = require("http");
const colors = require("colors");

const { parseErrorsAndWarnings, urlToExecutable, debug } = require("./utils");

const respec2htmlTests = [
  // {
  //   blockDescription: "Process builds",
  //   tests: [
  //     {
  //       URL: `http://localhost:${port}/examples/basic.built.html`,
  //       evalFunction: async exec => {
  //         // The following function will automatically throw if ReSpec fails to make the document.
  //         await exec.run();
  //       },
  //       message: `Processes example spec employing default respec-w3c-common.js profile`,
  //     },
  //     {
  //       URL: `http://localhost:${port}/examples/basic.html`,
  //       evalFunction: async exec => {
  //         await exec.run();
  //       },
  //       message: `Processes example spec employing source JS files being pushed`,
  //     },
  //   ],
  // },
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
              "Every item in `postProcess` must be a JS function.",
            ]);
            const expectedWarnings = new Set([
              "Missing `<dfn>` for `UndefinedInterface` interface. [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).",
              "Missing `<dfn>` for `UndefinedInterface`'s `undefinedAttribute()` operation. [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).",
            ]);
            const recordedTerminalErrors = parseErrorsAndWarnings(
              error.toString().split("\n")
            ).filter(err => err);
            recordedTerminalErrors.forEach(({ type, text }) => {
              switch (type) {
                case "ReSpec error":
                  if (!expectedErrors.has(text))
                    throw new Error(`Unexpected ReSpec error ${text}`);
                  expectedErrors.delete(text);
                  break;

                case "ReSpec warning":
                  if (!expectedWarnings.has(text))
                    throw new Error(`Unexpected ReSpec warning ${text}`);
                  expectedWarnings.delete(text);
                  break;

                case "Fatal error":
                  throw new Error(text);
              }
            });
            if (expectedWarnings.size || expectedErrors.size)
              throw new Error(
                `Expected the following errors and warnings: \n ${[
                  ...expectedErrors,
                  ...expectedWarnings,
                ].join("\n")}`
              );
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
      const exec = urlToExecutable(URL);
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
