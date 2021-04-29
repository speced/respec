#!/usr/bin/env node
"use strict";
const sade = require("sade");
const colors = require("colors");
const { readFileSync } = require("fs");
const path = require("path");
const rollup = require("rollup");
const alias = require("@rollup/plugin-alias");

const rel = p => path.relative(process.cwd(), p);

/**
 * @param {object} opts
 * @param {RegExp[]} opts.include
 */
function string(opts) {
  return {
    transform(code, id) {
      if (!opts.include.some(re => re.test(id))) return;

      if (id.endsWith(".runtime.js")) {
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
   * @returns {string} The version string.
   */
  getRespecVersion: () => {
    const packagePath = path.join(__dirname, "../package.json");
    const content = readFileSync(packagePath, "utf-8");
    return JSON.parse(content).version;
  },

  _getOptions(name, { debug }) {
    if (!name) {
      throw new TypeError("name is required");
    }
    const buildPath = path.join(__dirname, "../builds");
    const outFile = `respec-${name}.js`;
    const outPath = path.join(buildPath, outFile);
    const version = this.getRespecVersion();

    /** @type {import("rollup").InputOptions} */
    const inputOptions = {
      input: require.resolve(`../profiles/${name}.js`),
      plugins: [
        !debug && require("rollup-plugin-terser").terser(),
        alias({
          entries: [{ find: /^text!(.*)/, replacement: "./$1" }],
        }),
        string({
          include: [/\.runtime\.js$/, /\.svg$/, /respec-worker\.js$/],
        }),
        !debug &&
          require("rollup-plugin-minify-html-literals").default({
            include: [/\.css\.js$/],
            options: {
              minifyOptions: {
                minifyCSS: { format: "keep-breaks" },
              },
              // disable html`` minification
              shouldMinify: () => false,
              shouldMinifyCSS: ({ tag }) => !debug && tag === "css",
            },
          }),
      ],
      onwarn(warning, warn) {
        if (warning.code !== "CIRCULAR_DEPENDENCY") {
          warn(warning);
        }
      },
      inlineDynamicImports: true,
    };

    /** @type {import("rollup").OutputOptions} */
    const outputOptions = {
      file: outPath,
      format: "iife",
      sourcemap: true,
      banner: `window.respecVersion = "${version}";\n`,
    };

    return { inputOptions, outputOptions };
  },

  /**
   * @param {object} options
   * @param {string} options.name Name of the profile (in `/profiles` dierctory) to build.
   * @param {boolean} [options.debug] Don't run minifiers if true.
   */
  async build({ name, debug = false }) {
    const { inputOptions, outputOptions } = this._getOptions(name, { debug });
    console.log(`Building ${rel(inputOptions.input)}. Please wait...`);
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
    console.log(`  Wrote ${rel(outputOptions.file)}.`);
  },

  watch({ name, debug }) {
    const { inputOptions, outputOptions } = this._getOptions(name, { debug });
    const watcher = rollup.watch({ ...inputOptions, output: outputOptions });
    watcher.on("event", async ev => {
      switch (ev.code) {
        case "BUNDLE_START":
          console.log(`Building ${rel(ev.input)}. Please wait...`);
          break;
        case "BUNDLE_END":
          console.log(
            `  Wrote ${rel(ev.output[0])} in ${ev.duration}ms.`,
            "Watching for file changes..."
          );
          await ev.result.close();
          break;
        case "ERROR":
          console.log(ev.error);
          break;
      }
    });
    return watcher;
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
    .option("-w, --watch", "Automatically re-build on file changes", false)
    .action(async (profile, opts) => {
      if (opts.watch) {
        Builder.watch({ name: profile, debug: opts.debug });
        return;
      }
      try {
        await Builder.build({ name: profile, debug: opts.debug });
      } catch (err) {
        console.error(colors.red(err.stack));
        return process.exit(1);
      }
    })
    .parse(process.argv, {
      unknown: flag => console.error(`Unknown option: ${flag}`),
    });
}
