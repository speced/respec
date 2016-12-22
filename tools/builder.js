#!/usr/bin/env node

"use strict";
const async = require("marcosc-async");
const fsp = require("fs-promise");
const pth = require("path");
const r = require("requirejs");
const UglifyJS = require("uglify-js");

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
  return async(function*(optimizedJs, sourceMap) {
    const respecJs = `"use strict";
/* ReSpec ${version}
Created by Robin Berjon, http://berjon.com/ (@robinberjon)
Documentation: http://w3.org/respec/.
See original source for licenses: https://github.com/w3c/respec */
window.respecVersion = "${version}";
${optimizedJs}
require(['profile-w3c-common']);`;
    const result = UglifyJS.minify(respecJs, {
      fromString: true,
      outSourceMap: "respec-w3c-common.build.js.map",
    });
    const mapPath = pth.dirname(outPath) + "/respec-w3c-common.build.js.map";
    const promiseToWriteJs = fsp.writeFile(outPath, result.code, "utf-8");
    const promiseToWriteMap = fsp.writeFile(mapPath, sourceMap, "utf-8");
    yield Promise.all([promiseToWriteJs, promiseToWriteMap]);
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
        generateSourceMaps: true,
        mainConfigFile: "js/profile-w3c-common.js",
        baseUrl: pth.join(__dirname, "../js/"),
        optimize: options.optimize || "uglify",
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
        config.out = (concatinatedJS, sourceMap) => {
          outputWritter(concatinatedJS, sourceMap)
            .then(resolve)
            .catch(reject);
        };
      });
      r.optimize(config);
      const buildDir = pth.resolve(__dirname, "../builds/");
      const workerDir = pth.resolve(__dirname, "../worker/");
      //console.log(buildDir, workerDir);
      yield promiseToWrite;
      // copy respec-worker
      fsp
        .createReadStream(`${workerDir}/respec-worker.js`)
        .pipe(fsp.createWriteStream(`${buildDir}/respec-worker.js`));
    }, this);
  },
};

exports.Builder = Builder;
