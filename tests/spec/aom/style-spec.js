"use strict";

import { flushIframes, makeRSDoc, makeStandardAomOps } from "../SpecHelper.js";

async function loadWithStatus(specStatus, expectedURL) {
  const ops = makeStandardAomOps({ specStatus });
  const doc = await makeRSDoc(ops);
  const query = `link[href^='${expectedURL}']`;
  const elem = doc.querySelector(query);
  expect(elem).toBeTruthy();
  expect(elem.href).toBe(expectedURL);
  return doc;
}

describe("AOM - Style", () => {
  afterAll(flushIframes);

  it(`styles according to spec status`, async () => {
    const tests = [
      {
        specStatus: "PD",
        expectedURL: "https://www.w3.org/StyleSheets/TR/2016/W3C-UD",
      },
      {
        status: "unknown",
        expectedURL: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      },
      {
        status: "",
        expectedURL: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      },
    ];
    for (const { specStatus, expectedURL } of tests) {
      await loadWithStatus(specStatus, expectedURL);
    }
  });

  it("includes 'fixup.js'", async () => {
    const ops = makeStandardAomOps();
    const doc = await makeRSDoc(ops);
    const query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem.src).toBe("https://www.w3.org/scripts/TR/2016/fixup.js");
  });

  it("has meta viewport added", async () => {
    const ops = makeStandardAomOps();
    const doc = await makeRSDoc(ops);
    const elem = doc.head.querySelector("meta[name=viewport]");
    expect(elem).toBeTruthy();
    const expectedStr = "width=device-width, initial-scale=1, shrink-to-fit=no";
    expect(elem.content).toBe(expectedStr);
  });

  it("doesn't include fixup.js when noToc is set", async () => {
    const ops = makeStandardAomOps({ noToc: true });
    const doc = await makeRSDoc(ops);
    const query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem).toBeNull();
  });
});
