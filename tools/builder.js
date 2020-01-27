#!/usr/bin/env node

"use strict";
const colors = require("colors");
const { promises: fsp } = require("fs");
const path = require("path");
const { rollup } = require("rollup");
const alias = require("rollup-plugin-alias");
const { string } = require("rollup-plugin-string");
const commandLineArgs = require("command-line-args");
const getUsage = require("command-line-usage");
colors.setTheme({
  error: "red",
  info: "white",
});

/** @type {import("command-line-usage").OptionDefinition[]} */
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
      "in the profiles/ folder (e.g., w3c.js)",
    multiple: false,
    name: "profile",
    type: String,
  },
  {
    alias: "d",
    defaultValue: false,
    description: "Disable optimization to ease debugging",
    name: "debug",
    type: Boolean,
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
        example: "$ ./tools/builder.js --profile=w3c",
      },
    ],
  },
  {
    content: "Project home: {underline https://github.com/w3c/respec}",
    raw: true,
  },
];

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
   * @param {object} options
   * @param {string} options.name
   * @param {boolean} options.debug
   */
  async build({ name, debug }) {
    if (!name) {
      throw new TypeError("name is required");
    }
    const buildPath = path.join(__dirname, "../builds");
    const outFile = `respec-${name}.js`;
    const outPath = path.join(buildPath, outFile);
    console.log(colors.info(`Generating ${outFile}. Please wait...`));

    // optimisation settings
    const version = await this.getRespecVersion();
    const buildDir = path.resolve(__dirname, "../builds/");
    const workerDir = path.resolve(__dirname, "../worker/");

    const inputOptions = {
      input: require.resolve(`../profiles/${name}.js`),
      plugins: [
        !debug && require("rollup-plugin-terser").terser(),
        alias({
          resolve: [".css", ".svg"],
          entries: [
            {
              find: /^text!(.*)/,
              replacement: "./$1",
            },
          ],
        }),
        string({
          include: [/\.css$/, /\.svg$/, /respec-worker\.js$/],
        }),
      ],
      onwarn(warning, warn) {
        if (warning.code !== "CIRCULAR_DEPENDENCY") {
          warn(warning);
        }
      },
      inlineDynamicImports: true,
    };
    const outputOptions = {
      file: outPath,
      format: "iife",
      sourcemap: true,
      banner: `window.respecVersion = "${version}";\n`,
    };

    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);

    // copy respec-worker
    await fsp.copyFile(
      `${workerDir}/respec-worker.js`,
      `${buildDir}/respec-worker.js`
    );
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
    const { profile: name, debug } = parsedArgs;
    if (!name) {
      return;
    }
    try {
      await Builder.build({ name, debug });
    } catch (err) {
      console.error(colors.error(err.stack));
      return process.exit(1);
    }
    process.exit(0);
  })();
}
