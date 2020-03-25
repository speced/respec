/**
 * Custom Karma reporter that creates failure annotations in GitHub PR.
 */

const { EOL } = require("os");

module.exports = {
  "reporter:respec-github-action": ["type", GithubActionReporter],
};

function GithubActionReporter(config) {
  const browserFailures = [];
  const locationPrefix = `:${config.port}/base/`;
  this.onSpecComplete = (_browser, result) => {
    if (!result.success) {
      const failure = parseFailure(result, locationPrefix);
      browserFailures.push(failure);
    }
  };

  this.onRunComplete = () => {
    print("group", "Failed tests");
    browserFailures.forEach(printFailure);
    print("endgroup");
  };
}

/**
 * @typedef {{ test: string[], file: string, line: number, col: number, message: string }} Failure
 * @returns {Failure}
 */
function parseFailure(result, locationPrefix) {
  // convert newlines into array and flatten
  const log = result.log.flatMap(message => message.split("\n"));
  const { suite, description } = result;
  const message = log[0].replace("Error: ", "");
  const location = log[2].split(locationPrefix, 2)[1].replace(/\)$/, "");
  // eslint-disable-next-line prefer-const
  let [file, line, col] = location.split(":");
  line = parseInt(line, 10);
  col = parseInt(col, 10);
  const test = suite.concat(description);
  return { test, file, line, col, message };
}

/** @param {Failure} failure */
function printFailure(failure) {
  const { file, line, col, test, message } = failure;
  const msg = test
    .map((s, i) => `${" ".repeat(i * 2)}${s}`)
    .concat([message])
    .join("\n");
  print("error", msg, { file, line, col });
}

/**
 * @param {string} command
 * @param {string} message
 * @param {Record<string, string>} options
 */
function print(command, message = "", options = {}) {
  let optionsString = `${new URLSearchParams(options)}`
    .replace(/&/g, ",")
    .replace(/%2F/g, "/");
  if (optionsString) optionsString = ` ${optionsString}`;
  const msg = escapeData(message);
  const output = `::${command}${optionsString}::${msg}${EOL}`;
  process.stdout.write(output);
}

/** @param {string} s */
function escapeData(s) {
  return s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
