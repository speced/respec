#!/usr/local/bin/mocha

"use strict";
const async = require("marcosc-async");
const colors = require("colors");
const fsp = require("fs-promise");
const path = require("path");
const expect = require("chai").expect;
const builder = require("../tools/build-w3c-common");

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

function checkIfFileExists(filePath) {
  return async.task(function*() {
    const stats = yield fsp.lstat(filePath);
    return stats.isFile();
  });
}

describe("build-w3c-common.js (tool)", function() {
  // Generating respec + maps takes time.
  this.timeout(60000);

  // These files get deleted in after().
  let customPath = "";
  let customMapPath = "";

  it("should have built default respec", async(function* () {
    const latest = path.join(__dirname, "../builds/respec-w3c-common.js");
    const latestMap = path.join(__dirname, "../builds/respec-w3c-common.build.js.map");
    yield builder.buildW3C();
    expect(yield checkIfFileExists(latest)).to.equal(true);
    expect(yield checkIfFileExists(latestMap)).to.equal(true);
  }));

  it("should have built a custom version respec", async(function* () {
    const randomName = "test-" + Math.round(Math.random() * 10000000);
    customPath = path.join(__dirname, `../builds/respec-w3c-common-${randomName}.js`);
    customMapPath = path.join(__dirname, `../builds/respec-w3c-common-${randomName}.build.js.map`);
    yield builder.buildW3C(randomName);
    expect(yield checkIfFileExists(customPath)).to.equal(true);
    expect(yield checkIfFileExists(customMapPath)).to.equal(true);
  }));

  describe("respec-w3c-common.build.js", function(){
    it("should include the link to the sourcemap", async(function*() {
      var source = yield fsp.readFile(customPath, "utf-8");
      var mapFilename = path.basename(customMapPath);
      expect(source.includes(mapFilename)).to.equal(true);
    }));
  });

  after(async(function*(){
    yield Promise.all([fsp.remove(customPath), fsp.remove(customMapPath)]);
    const msg = `  Deleted test files:
    ✓ ${colors.input(path.basename(customPath))}
    ✓ ${colors.input(path.basename(customMapPath))}`;
    console.log(colors.info(msg));
  }));
});

