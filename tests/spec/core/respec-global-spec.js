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
    const config = { lint: { "broken-refs-exist": true } };
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
    expect(warning.plugin).toBe("core/linter/local-refs-exist");
    expect(warning.message).toMatch(/Broken local reference/);
    expect(warning.elements).toHaveSize(1);
    expect(warning.elements[0].textContent).toBe("FAIL");

    expect(doc.respec.errors).toHaveSize(0);
  });
});
