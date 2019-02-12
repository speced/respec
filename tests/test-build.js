#!/usr/bin/env mocha
/* eslint-env node */

"use strict";
const colors = require("colors");
const fsp = require("fs-extra");
const path = require("path");
const expect = require("chai").expect;
const { Builder } = require("../tools/builder");

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

async function checkIfFileExists(filePath) {
  const stats = await fsp.lstat(filePath);
  return stats.isFile();
}

describe("builder (tool)", function() {
  // Generating respec + maps takes time.
  this.timeout(60000);
  const latestMap = path.join(
    __dirname,
    "../builds/respec-w3c-common.build.js.map"
  );
  const latest = path.join(__dirname, "../builds/respec-w3c-common.js");
  it("should have built default respec", async () => {
    await Builder.build({ name: "w3c-common" });
    expect(await checkIfFileExists(latest)).to.equal(true);
    expect(await checkIfFileExists(latestMap)).to.equal(true);
  });

  describe("respec-w3c-common.build.js", () => {
    it("should include the link to the sourcemap", async () => {
      const source = await fsp.readFile(latest, "utf-8");
      expect(source.search("respec-w3c-common.build.js.map")).to.not.equal(-1);
    });
  });
});
