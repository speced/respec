"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Respec Global - document.respec", () => {
  afterAll(flushIframes);

  it("gives access to ReSpec script version", async () => {
    const doc = await makeRSDoc(makeStandardOps());

    expect(doc.hasOwnProperty("respec")).toBeTrue();
    expect(doc.respec.version).toBeInstanceOf(String);
  });

  it("has a promise that resolves when ReSpec finishes processing", async () => {
    const ops = makeStandardOps({ shortName: "PASS" });
    const doc = await makeRSDoc(ops);

    expect(doc.hasOwnProperty("respec")).toBeTrue();
    expect(doc.respec.ready).toBeInstanceOf(doc.defaultView.Promise);
    await expectAsync(doc.respec.ready).toBeResolvedTo(undefined);
  });

  it("has an array of errors and warnings", async () => {
    const config = {
      lint: { "broken-refs-exist": true },
      specStatus: "unofficial",
    };
    const body = `
      <div id="sotd"></div>
      <p><a id="test-warning" href="#non-existent">FAIL</a></p>
    `;
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    expect(doc.respec.errors).toBeInstanceOf(doc.defaultView.Array);
    expect(doc.respec.warnings).toBeInstanceOf(doc.defaultView.Array);

    expect(doc.respec.warnings).toHaveSize(1);
    const warning = doc.respec.warnings[0];
    expect(warning.name).toBe("ReSpecWarning");
    expect(warning.plugin).toBe("core/linter-rules/local-refs-exist");
    expect(warning.message).toMatch(/Broken local reference/);
    expect(warning.elements).toHaveSize(1);
    expect(warning.elements[0].textContent).toBe("FAIL");

    expect(doc.respec.errors).toHaveSize(0);
  });

  it("returns exported html with toHTML()", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);

    const html = await doc.respec.toHTML();
    expect(typeof html).toBe("string");

    const regex = new RegExp(`^<!DOCTYPE html>\\s*<html.+lang="en"`);
    expect(html.slice(0, 40)).toMatch(regex);

    const exportedDoc = new DOMParser().parseFromString(html, "text/html");
    // <meta name=generator> is added in exported docs only.
    const generator = exportedDoc.querySelector("meta[name=generator]");
    expect(generator).toBeTruthy();
    expect(generator.content).toContain("ReSpec");
  });
});
