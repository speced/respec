#!/usr/local/bin/node

"use strict";
const async = require("marcosc-async");
const Builder = require("./builder").Builder;
const path = require("path");
const colors = require("colors");

colors.setTheme({
  data: "grey",
  debug: "cyan",
  error: "red",
  help: "cyan",
  info: "green",
  input: "grey",
  prompt: "grey",
  verbose: "cyan",
  warn: "yellow",
});

const buildW3C = async(function*(aVersion) {
  aVersion = (!aVersion) ? "latest" : aVersion;
  const builds = path.join(__dirname, "../builds");
  const isLatest = aVersion === "latest";
  const version = (isLatest) ? yield Builder.getRespecVersion() : aVersion;
  const outFile = "respec-w3c-common" + ((isLatest) ? ".js" : `-${aVersion}.js`);
  const out = path.join(builds, outFile);
  yield Builder.build({out, version});
});

if (require.main === module) {
  buildW3C()
    .catch((err) => console.log(colors.error(err.stack)));
}

exports.buildW3C = buildW3C;
