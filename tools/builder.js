#!/usr/bin/env node

"use strict";
const colors = require("colors");
const fsp = require("fs-extra");
const loading = require("loading-indicator");
const path = require("path");
const presets = require("loading-indicator/presets");
const r = require("requirejs");
const terser = require("terser");
const commandLineArgs = require("command-line-args");
const getUsage = require("command-line-usage");
colors.setTheme({
  error: "red",
  info: "green",
});

const optionList = [
  {
    alias: "h",
    defaultValue: false,
    description: "Display this usage guide.",
    name: "help",
    type: Boolean,
  },
  {
    alias: "p",
    defaultOption: true,
    description:
      "Name of profile to build. Profile must be " +
      "in the js/ folder, and start with 'profile-' (e.g., profile-w3c-common.js)",
    multiple: false,
    name: "profile",
    type: String,
  },
];

const usageSections = [
  {
    header: "builder",
    content: "Builder builds a ReSpec profile",
  },
  {
    header: "Options",
    optionList,
  },
  {
    header: "Examples",
    content: [
      {
        desc: "1. Build W3C Profile ",
        example: "$ ./tools/builder.js --profile=w3c-common",
      },
    ],
  },
  {
    content: "Project home: {underline https://github.com/w3c/respec}",
    raw: true,
  },
];

/**
 * Async function that appends the boilerplate to the generated script
 * and writes out the result. It also creates the source map file.
 *
 * @private
 * @param  {String} outPath Where to write the output to.
 * @param  {String} version The version of the script.
 * @return {Promise} Resolves when done writing the files.
 */
function appendBoilerplate(outPath, version, name) {
  return async (optimizedJs, sourceMap) => {
    const respecJs = `"use strict";
window.respecVersion = "${version}";
${optimizedJs}
require(['profile-${name}']);`;
    const respecJsMap = sourceMap.replace(`"mappings": "`, `"mappings": ";;`);
    const result = terser.minify(respecJs, {
      toplevel: true,
      sourceMap: {
        filename: `respec-${name}.js`,
        content: respecJsMap,
        root: "../js/",
        url: `respec-${name}.build.js.map`,
      },
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    const mapPath = path.dirname(outPath) + `/respec-${name}.build.js.map`;
    const promiseToWriteJs = fsp.writeFile(outPath, result.code, "utf-8");
    const promiseToWriteMap = fsp.writeFile(mapPath, result.map, "utf-8");
    await Promise.all([promiseToWriteJs, promiseToWriteMap]);
  };
}

const Builder = {
  /**
   * Async function that gets the current version of ReSpec from package.json
   *
   * @returns {Promise<String>} The version string.
   */
  getRespecVersion: async () => {
    const packagePath = path.join(__dirname, "../package.json");
    const content = await fsp.readFile(packagePath, "utf-8");
    return JSON.parse(content).version;
  },

  /**
   * Async function runs Requirejs' optimizer to generate the output.
   *
   * using a custom configuration.
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  async build({ name }) {
    if (!name) {
      throw new TypeError("name is required");
    }
    const buildPath = path.join(__dirname, "../builds");
    const outFile = `respec-${name}.js`;
    const outPath = path.join(buildPath, outFile);
    const loadingMsg = colors.info(` Generating ${outFile}. Please wait... `);
    const timer = loading.start(loadingMsg, {
      frames: presets.clock,
      delay: 1,
    });

    // optimisation settings
    const buildVersion = await this.getRespecVersion();
    const outputWritter = appendBoilerplate(outPath, buildVersion, name);
    const config = {
      baseUrl: path.join(__dirname, "../js/"),
      deps: ["deps/require"],
      generateSourceMaps: true,
      inlineText: true,
      logLevel: 2, // Show uglify warnings and errors.
      mainConfigFile: `js/profile-${name}.js`,
      name: `profile-${name}`,
      optimize: "none",
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
    const buildDir = path.resolve(__dirname, "../builds/");
    const workerDir = path.resolve(__dirname, "../worker/");
    // copy respec-worker
    fsp
      .createReadStream(`${workerDir}/respec-worker.js`)
      .pipe(fsp.createWriteStream(`${buildDir}/respec-worker.js`));
    await promiseToWrite;
    loading.stop(timer);
  },
};

exports.Builder = Builder;
if (require.main === module) {
  (async function run() {
    let parsedArgs;
    try {
      parsedArgs = commandLineArgs(optionList);
    } catch (err) {
      console.info(getUsage(usageSections));
      console.error(colors.error(err.stack));
      return process.exit(127);
    }
    if (parsedArgs.help) {
      console.info(getUsage(usageSections));
      return process.exit(0);
    }
    const { profile: name } = parsedArgs;
    if (!name) {
      return;
    }
    try {
      await Builder.build({ name });
    } catch (err) {
      console.error(colors.error(err.stack));
      return process.exit(1);
    }
    process.exit(0);
  })();
}
