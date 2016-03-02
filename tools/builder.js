#!/usr/local/bin/node

"use strict";
const async = require("marcosc-async");
const fsp = require("fs-promise");
const pth = require("path");
const r = require("requirejs");

var Builder = {
  getRespecVersion: async(function*() {
    const path = pth.join(__dirname, "../package.json");
    const content = yield fsp.readFile(path, "utf-8");
    return JSON.parse(content).version;
  }),

  appendBoilerplate(outPath, version) {
    return async(function*(optimizedJs, sourceMap) {
      const respecJs = `"use strict";
/* ReSpec ${version}
Created by Robin Berjon, http://berjon.com/ (@robinberjon)
Documentation: http://w3.org/respec/.
See original source for licenses: https://github.com/w3c/respec */
window.respecVersion = "${version}";
${optimizedJs}
require(['profile-w3c-common']);`;
      const promiseToWriteJs = fsp.writeFile(outPath, respecJs, "utf-8");
      const promiseToSourceMap = fsp.writeFile(`${outPath}.map`, sourceMap, "utf-8");
      yield Promise.all([promiseToWriteJs, promiseToSourceMap]);
    }, Builder);
  },

  build(options) {
    return async.task(function*() {
      // optimisation settings
      const version = options.version || (yield this.getRespecVersion());
      const outputWritter = this.appendBoilerplate(options.out, version);
      const config = {
        generateSourceMaps: true,
        baseUrl: pth.join(__dirname, "../js/"),
        optimize: options.optimize || "uglify2",
        paths: {
          "require": "../node_modules/requirejs/require",
          "jquery": "../node_modules/jquery/dist/jquery",
          "Promise": "../node_modules/promise-polyfill/Promise",
          "handlebars": "../node_modules/handlebars/dist/handlebars",
          "webidl2": "../node_modules/webidl2/lib/webidl2",
        },
        shim: {
          "shortcut": {
            exports: "shortcut"
          }
        },
        name: "profile-w3c-common",
        include: [
          "../node_modules/requirejs/require",
          "../node_modules/jquery/dist/jquery",
          "../node_modules/promise-polyfill/Promise",
          "../node_modules/handlebars/dist/handlebars",
          "../node_modules/webidl2/lib/webidl2",
        ],
        out: outputWritter,
        inlineText: true,
        preserveLicenseComments: false,
      };
      r.optimize(config);
    }, Builder);
  },
};

exports.Builder = Builder;
