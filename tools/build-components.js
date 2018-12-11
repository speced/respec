const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const move = require("fs-extra").move;
const glob = require("glob");

(async () => {
  await buildHandlebars();
  await buildHighlight();
})();

async function buildHandlebars() {
  const paths = ["js/*/templates/*.css"]
    .map(path => glob.sync(path, { nonull: true }))
    .reduce((res, file) => res.concat(file), [])
    .join(" ");
  await exec(`handlebars ${paths} -a -f js/templates.js`);
}

async function buildHighlight() {
  await exec(
    "hljs -n --output js/deps/ xml javascript css http markdown json abnf"
  );
  await move("js/deps/highlight.pack.js", "js/deps/highlight.js", {
    overwrite: true,
  });
}
