const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const { move } = require("fs-extra");

(async () => {
  await buildHighlight();
})();

async function buildHighlight() {
  await exec(
    "hljs -n --output js/deps/ xml javascript css http markdown json abnf"
  );
  await move("js/deps/highlight.pack.js", "js/deps/highlight.js", {
    overwrite: true,
  });
}
