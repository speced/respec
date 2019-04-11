#!/usr/bin/env mocha
/* eslint-env node */

"use strict";
const fsp = require("fs-extra");
const path = require("path");
const expect = require("chai").expect;
const { Builder } = require("../tools/builder");

async function checkIfFileExists(filePath) {
  const stats = await fsp.lstat(filePath);
  return stats.isFile();
}

describe("builder (tool)", () => {
  it("builds w3c respec", async () => {
    const profileFile = path.join(__dirname, "../builds/respec-w3c-common.js");
    const mapFile = path.join(__dirname, "../builds/respec-w3c-common.js.map");
    await Builder.build({ name: "w3c-common" });
    expect(await checkIfFileExists(profileFile)).to.equal(true);
    expect(await checkIfFileExists(mapFile)).to.equal(true);
  });

  it("builds Geonovum profile", async () => {
    const profileFile = path.join(__dirname, "../builds/respec-geonovum.js");
    const mapFile = path.join(__dirname, "../builds/respec-geonovum.js.map");
    await Builder.build({ name: "geonovum" });
    expect(await checkIfFileExists(profileFile)).to.equal(true);
    expect(await checkIfFileExists(mapFile)).to.equal(true);
  });

  describe("respec-w3c-common.build.js", () => {
    const latest = path.join(__dirname, "../builds/respec-w3c-common.js");
    it("should include the link to the sourcemap", async () => {
      const source = await fsp.readFile(latest, "utf-8");
      expect(source.search("respec-w3c-common.js.map")).to.not.equal(-1);
    });
  });
});
