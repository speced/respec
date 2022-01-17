"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

const specStatus = [
  {
    status: "FPWD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-WD",
  },
  {
    status: "NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-NOTE",
  },
  {
    status: "finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
  },
  {
    status: "draft-finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
  },
  {
    status: "editor-draft-finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
  },
  {
    status: "unofficial",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-UD",
  },
  {
    status: "base",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/base.css",
  },
  {
    status: "RSCND",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-RSCND",
  },
  {
    status: "FAKE-TEST-TYPE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-FAKE-TEST-TYPE",
  },
  {
    status: "CG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/cg-final",
  },
  {
    status: "CG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/cg-draft",
  },
  {
    status: "BG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/bg-final",
  },
  {
    status: "BG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/bg-draft",
  },
  {
    status: "CR",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CR",
  },
  {
    status: "CRD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CRD",
  },
  {
    status: "CRY",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CRY",
  },
  {
    status: "CRYD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-CRYD",
  },
  {
    status: "DISC",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-DISC",
  },
  {
    status: "DNOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-DNOTE",
  },
  {
    status: "DRY",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-DRY",
  },
  {
    status: "ED",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-ED",
  },
  {
    status: "LC",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-LC",
  },
  {
    status: "Member-SUBM",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-Member-SUBM",
  },
  {
    status: "NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-NOTE",
  },
  {
    status: "PER",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-PER",
  },
  {
    status: "PR",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-PR",
  },
  {
    status: "REC",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-REC",
  },
  {
    status: "RSCND",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-RSCND",
  },
  {
    status: "RY",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-RY",
  },
  {
    status: "STMT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-STMT",
  },
  {
    status: "Team-SUBM",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-Team-SUBM",
  },
  {
    status: "UD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-UD",
  },
  {
    status: "WD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-WD",
  },
  {
    status: "WG-NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/2021/W3C-WG-NOTE",
  },
];

async function loadWithStatus(status, expectedURL) {
  const ops = makeStandardOps({
    specStatus: status,
  });
  const doc = await makeRSDoc(ops);
  const query = `link[href^='${expectedURL}']`;
  const elem = doc.querySelector(query);
  expect(elem).withContext(specStatus).toBeTruthy();
  expect(elem.href).withContext(specStatus).toBe(expectedURL);
}

describe("W3C - Style", () => {
  afterAll(flushIframes);

  it("should include 'fixup.js'", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const query = "script[src^='https://www.w3.org/scripts/TR/2021/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem.src).toBe("https://www.w3.org/scripts/TR/2021/fixup.js");
  });

  it("should have a meta viewport added", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const elem = doc.head.querySelector("meta[name=viewport]");
    expect(elem).toBeTruthy();
    const expectedStr = "width=device-width, initial-scale=1, shrink-to-fit=no";
    expect(elem.content).toBe(expectedStr);
  });

  it("should default to base when specStatus is missing", async () => {
    await loadWithStatus("", "https://www.w3.org/StyleSheets/TR/2021/base.css");
  });

  specStatus.forEach(test => {
    it(`should style according to spec status ${test.status}`, async () => {
      await loadWithStatus(test.status, test.expectedURL);
    });
  });

  it("shouldn't include fixup.js when noToc is set", async () => {
    const ops = makeStandardOps();
    const newProps = {
      noToc: true,
    };
    Object.assign(ops.config, newProps);
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const query = "script[src^='https://www.w3.org/scripts/TR/2021/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem).toBeNull();
  });
});
