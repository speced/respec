const fs = require("fs/promises");
const esbuild = require("esbuild");

const pluginCssLiteral = (settings = {}) => ({
  name: "css-literal",
  setup(build) {
    const { filter = /\.css\.js$/, namespace = "", minify = false } = settings;
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

    build.onLoad({ filter, namespace }, async args => {
      const contents = await fs.readFile(args.path, "utf8");
      return transformContents({ contents });
    });
  },
});

const minify = true;
esbuild.build({
  entryPoints: ["profiles/w3c.js"],
  bundle: true,
  minify,
  outdir: "builds",
  plugins: [pluginCssLiteral({ minify })],
});
// .then(console.log)
// .catch(err => (console.error(err), process.exit(1)));
