#!/usr/bin/env node
// @ts-check
/* eslint-env node */
const colors = require("colors");
const { exec } = require("child_process");
const moment = require("moment");

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

module.exports = {
  parseErrorsAndWarnings(errorList) {
    return errorList.map((errorStr, i) => {
      if (i === 0 || errorStr === "") return null;
      const type = errorStr.includes("ReSpec error")
        ? "ReSpec error"
        : errorStr.includes("ReSpec warning")
        ? "ReSpec warning"
        : "Fatal error";
      switch (type) {
        case "ReSpec error":
          return {
            type: "ReSpec error",
            text: errorStr.substr(27, errorStr.length - 37),
          };

        case "ReSpec warning":
          return {
            type: "ReSpec warning",
            text: errorStr.substr(29, errorStr.length - 39),
          };

        case "Fatal error":
          return {
            type: "Fatal error",
            text: errorStr,
          };
      }
    });
  },

  urlToExecutable(url) {
    const nullDevice =
      process.platform === "win32" ? "\\\\.\\NUL" : "/dev/null";
    const disableSandbox = process.env.TRAVIS ? " --disable-sandbox" : "";
    const cmd = `node ./tools/respec2html.js -e -w${disableSandbox} --timeout 20 --src ${url} --out ${nullDevice}`;
    return toExecutable(cmd);
  },
  debug(msg) {
    // eslint-disable-next-line no-console
    console.log(colors.grey(moment().format("LTS")) + colors.cyan(` ${msg}`));
  },
};
