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
    await expectAsync(doc.respec.ready).toBeResolvedTo(
      jasmine.objectContaining({ shortName: ops.config.shortName })
    );
  });
});
