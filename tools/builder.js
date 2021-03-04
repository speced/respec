#!/usr/bin/env node

"use strict";
const sade = require("sade");
const colors = require("colors");
const { promises: fsp } = require("fs");
const path = require("path");
const { rollup } = require("rollup");
const alias = require("rollup-plugin-alias");
const CleanCSS = require("clean-css");

colors.setTheme({
  error: "red",
  info: "white",
});

/**
 * @param {object} opts
 * @param {RegExp[]} opts.include
 */
function string(opts) {
  const minifier = new CleanCSS({ format: "keep-breaks" });
  return {
    transform(code, id) {
      if (!opts.include.some(re => re.test(id))) return;

      if (id.endsWith(".css")) {
        code = minifier.minify(code).styles;
      } else if (id.endsWith(".runtime.js")) {
        code = `(() => {\n${code}})()`;
      }

      return {
        code: `export default ${JSON.stringify(code)};`,
        map: { mappings: "" },
      };
    },
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
          resolve: [".css", ".svg", ".js"],
          entries: [
            {
              find: /^text!(.*)/,
              replacement: "./$1",
            },
          ],
        }),
        string({
          include: [/\.runtime\.js$/, /\.css$/, /\.svg$/, /respec-worker\.js$/],
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
  sade("./tools/builder.js <profile>", true)
    .describe(
      "Builder builds a ReSpec profile. Profile must be in the profiles/ folder (e.g., w3c.js)"
    )
    .example(`w3c ${colors.dim("# Build W3C profile.")}`)
    .example(
      `w3c --debug ${colors.dim("# Build W3C profile without optimizations.")}`
    )
    .option("-d, --debug", "Disable optimization to ease debugging", false)
    .action(async (profile, opts) => {
      try {
        await Builder.build({ name: profile, debug: opts.debug });
      } catch (err) {
        console.error(colors.error(err.stack));
        return process.exit(1);
      }
    })
    .parse(process.argv);
}
