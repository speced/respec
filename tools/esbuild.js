const path = require("path");
const fs = require("fs/promises");
const esbuild = require("esbuild");

const pluginCssLiteral = (settings = {}) => ({
  name: "css-literal",
  setup(build) {
    const {
      filter = /.*/,
      namespace = "",
      tag = "css",
      minify = false,
    } = settings;
    let warnings;

    const parse = css => {
      const result = esbuild.transformSync(css, {
        loader: "css",
        minify,
      });

      if (result.warnings.length) return (warnings = result.warnings);

      return `css\`${result.code}\``;
    };

    const transformContents = async ({ contents }) => {
      const index = contents.indexOf(`${tag}\``);

      if (index == -1) return { contents };

      const start = index + tag.length + 1;
      const end = contents.indexOf("`", start);
      const css = contents.slice(start, end);

      return Promise.resolve({ css })
        .then(result => {
          const css = parse(result.css);
          if (warnings) return { warnings };
          contents = css;
          return { contents };
        })
        .catch(error => {
          throw error;
        });
    };

    build.onLoad({ filter, namespace }, async args => {
      const contents = await fs.readFile(args.path, "utf8");
      return transformContents({ args, contents });
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
