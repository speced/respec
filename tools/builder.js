#!/usr/bin/env node

"use strict";
const colors = require("colors");
const fsp = require("fs-extra");
const loading = require("loading-indicator");
const path = require("path");
const presets = require("loading-indicator/presets");
const webpack = require("webpack");
const { promisify } = require("util");
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
async function appendBoilerplate(outPath, version, name) {
  const mapPath = `${path.dirname(outPath)}/respec-${name}.js.map`;
  const [optimizedJs, sourceMap] = await Promise.all([
    fsp.readFile(outPath, "utf-8"),
    fsp.readFile(mapPath, "utf-8"),
  ]);
  const respecJs = `"use strict";
window.respecVersion = "${version}";
${optimizedJs}`;
  const respecJsMap = sourceMap.replace(`"mappings":"`, `"mappings":";;`);
  const promiseToWriteJs = fsp.writeFile(outPath, respecJs, "utf-8");
  const promiseToWriteMap = fsp.writeFile(mapPath, respecJsMap, "utf-8");
  await Promise.all([promiseToWriteJs, promiseToWriteMap]);
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
    const config = {
      mode: "production",
      entry: require.resolve("../js/profile-w3c-common.js"),
      output: {
        path: buildPath,
        filename: outFile,
      },
      module: {
        rules: [
          {
            // shortcut.js uses global scope
            test: require.resolve("../js/shortcut.js"),
            use: "exports-loader?shortcut",
          },
        ],
      },
      resolveLoader: {
        // to import texts via e.g. "text!./css/webidl.css"
        alias: { text: "raw-loader" },
      },
      devtool: "source-map",
    };
    const buildDir = path.resolve(__dirname, "../builds/");
    const workerDir = path.resolve(__dirname, "../worker/");
    const stats = await promisify(webpack)(config);
    if (stats.hasErrors()) {
      throw new Error(stats.toJson().errors);
    }
    await appendBoilerplate(outPath, buildVersion, name);
    // copy respec-worker
    await fsp.copyFile(
      `${workerDir}/respec-worker.js`,
      `${buildDir}/respec-worker.js`
    );
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
