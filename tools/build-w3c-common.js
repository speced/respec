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

const buildW3C = async(function*() {
  let versionsToBuild = Array.from(arguments);
  if (!versionsToBuild.length){
    versionsToBuild.push("latest");
  }
  const builds = path.join(__dirname, "../builds");
  for(let aVersion of versionsToBuild){
    const isLatest = aVersion === "latest";
    const version = (isLatest) ? yield Builder.getRespecVersion() : aVersion;
    const outFile = "respec-w3c-common" + ((isLatest) ? ".js" : `-${aVersion}.js`);
    const out = path.join(builds, outFile);
    console.log(colors.info(`  ⏲  Generating ${outFile}. Please wait...`));
    yield Builder.build({out, version});
  }
});

if (require.main === module) {
  buildW3C("latest")
    .catch(
      err => console.error(`☠️ ${colors.error(err.stack)}`)
    );
}

exports.buildW3C = buildW3C;
