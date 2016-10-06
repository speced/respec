#!/usr/bin/env node

"use strict";
const async = require("marcosc-async");
const fsp = require("fs-promise");
const pth = require("path");
const r = require("requirejs");
const temp = require("temp").track();
const ClosureCompiler = require('google-closure-compiler').compiler;

function createTempfile() {
  return new Promise((resolve, reject) => {
    temp.open('respec-', (err, info) => {
      return (err) ? reject(err) : resolve(info);
    });
  });
}

/**
 * Async function that appends the boilerplate to the generated script
 * and writes out the result. It also creates the source map file.
 *
 * @private
 * @param  {String} outPath Where to write the output to.
 * @param  {String} version The version of the script.
 * @return {Promise} Resolves when done writing the files.
 */
function appendBoilerplate(outPath, version) {
  return async(function*(respecJs) {
    temp.track(); // Automatically clean up any temp files.
    const tmpFile = yield createTempfile();
    try {
      yield fsp.writeFile(tmpFile.path, respecJs);
    } catch (err) {
      console.error(err);
    }
    const closureCompiler = new ClosureCompiler({
      "js": tmpFile.path,
      "language_in": "ECMASCRIPT6",
      "language_out": "ES5_STRICT",
      "create_source_map": pth.join(__dirname, "../builds/respec-w3c-common.build.js.map"),
      "compilation_level": "WHITESPACE",
      "warning_level": "DEFAULT",
    });
    const compiledText = yield new Promise((resolve, reject) => {
      closureCompiler.run((exitCode, stdOut, stdErr) => {
        if (exitCode) {
          return reject(new Error(stdErr));
        }
        resolve(stdOut);
      });
    });
    const jsCode = `
"use strict";
/* ReSpec ${version}
Created by Robin Berjon, http://berjon.com/ (@robinberjon)
Documentation: http://w3.org/respec/.
See original source for licenses: https://github.com/w3c/respec */
window.respecVersion = "${version}";
${respecJs}
require(['profile-w3c-common']);`;
    yield fsp.writeFile(outPath, compiledText);
  }, Builder);
}

var Builder = {
  /**
   * Async function that gets the current version of ReSpec from package.json
   *
   * @returns {Promise<String>} The version string.
   */
  getRespecVersion: async(function*() {
    const path = pth.join(__dirname, "../package.json");
    const content = yield fsp.readFile(path, "utf-8");
    return JSON.parse(content).version;
  }),

  /**
   * Async function runs Requirejs' optimizer to generate the output.
   *
   * using a custom configuration.
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  build(options) {
    return async.task(function*() {
      // optimisation settings
      const version = options.version || (yield this.getRespecVersion());
      const outputWritter = appendBoilerplate(options.out, version);
      const config = {
        generateSourceMaps: false,
        mainConfigFile: "js/profile-w3c-common.js",
        baseUrl: pth.join(__dirname, "../js/"),
        optimize: "none",
        name: "profile-w3c-common",
        logLevel: 2, // Show uglify warnings and errors.
        deps: [
          "deps/require",
        ],
        inlineText: true,
        preserveLicenseComments: false,
        useStrict: true,
      };
      const promiseToWrite = new Promise((resolve, reject) => {
        config.out = (optimizedJs, sourceMap) => {
          outputWritter(optimizedJs, sourceMap)
            .then(resolve)
            .catch(reject);
        };
      });
      r.optimize(config);
      yield promiseToWrite;
    }, this);
  },
};

exports.Builder = Builder;
