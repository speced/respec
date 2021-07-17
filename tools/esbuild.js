const path = require("path");
const fs = require("fs/promises");
const esbuild = require("esbuild");

/** @returns {import("esbuild").Plugin} */
const pluginCssLiteral = ({ filter = /^$/, minify = false } = {}) => ({
  name: "css-literal",
  setup(build) {
    let warnings;

    const parse = css => {
      const result = esbuild.transformSync(css, {
        loader: "css",
        minify,
      });
      if (result.warnings.length) {
        return (warnings = result.warnings);
      }
      return result.code;
    };

    const extractCSS = (contents, pattern) => {
      const index = contents.indexOf(pattern);
      if (index == -1) return { contents };
      const start = index + pattern.length + 1;
      const end = contents.indexOf("`", start);
      return contents.slice(start, end);
    };

    const transformContents = async ({ contents }) => {
      const pattern = "export default css`";
      const css = extractCSS(contents, pattern);

      const parsedCSS = parse(css);
      if (warnings) return { warnings };
      return { contents: `export default String.raw\`${parsedCSS}\`` };
    };

    build.onLoad({ filter }, async args => {
      const contents = await fs.readFile(args.path, "utf8");
      return transformContents({ contents });
    });
  },
});

/** @returns {import("esbuild").Plugin} */
const inlineAsString = ({ filter = /^$/ } = {}) => ({
  name: "inline-string",
  setup(build) {
    build.onResolve({ filter }, args => ({
      path: path.resolve(args.resolveDir, args.path.replace("text!", "")),
    }));
    build.onLoad({ filter }, async args => {
      console.log(args.path);
      const contents = await fs.readFile(args.path, "utf8");
      return {
        contents: `export default ${JSON.stringify(contents)};`,
        loader: "text",
      };
    });
  },
});

const entryPoints = ["profiles/w3c.js"];
const minify = true;
console.log({ entryPoints });
esbuild.build({
  entryPoints,
  bundle: true,
  plugins: [
    pluginCssLiteral({ filter: /\.css\.js$/, minify }),
    inlineAsString({ filter: /^text!/ }),
  ],
  outdir: "builds",
  target: "es2020",
  minify,
  sourcemap: true,
});
// .then(console.log)
// .catch(err => (console.error(err), process.exit(1)));
