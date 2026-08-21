"use strict";

import { flushIframes, makeRSDoc, makeStandardDiniOps } from "../SpecHelper.js";

describe("DINI - Style", () => {
  afterAll(flushIframes);

  const query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";

  it("includes 'fixup.js'", async () => {
    const doc = await makeRSDoc(makeStandardDiniOps());
    expect(doc.querySelector(query)).toBeTruthy();
  });

  it("doesn't include fixup.js when noTOC is set", async () => {
    const doc = await makeRSDoc(makeStandardDiniOps({ noTOC: true }));
    expect(doc.querySelector(query)).toBeNull();
  });

  it("doesn't include fixup.js when the deprecated noToc is set", async () => {
    const doc = await makeRSDoc(makeStandardDiniOps({ noToc: true }));
    expect(doc.querySelector(query)).toBeNull();
  });
});
