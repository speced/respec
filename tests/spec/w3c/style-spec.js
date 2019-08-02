"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
  pickRandomsFromList,
} from "../SpecHelper.js";

const specStatus = [
  {
    status: "FPWD",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WD",
  },
  {
    status: "WD-NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WD",
  },
  {
    status: "finding",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}base.css",
  },
  {
    status: "unofficial",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-UD",
  },
  {
    status: "base",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}base.css",
  },
  {
    status: "RSCND",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-RSCND",
  },
  {
    status: "FPWD-NOTE",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}W3C-WG-NOTE.css",
  },
  {
    status: "FAKE-TEST-TYPE",
    expectedURL:
      "https://www.w3.org/StyleSheets/TR/{version}W3C-FAKE-TEST-TYPE",
  },
  {
    status: "CG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}cg-final",
  },
  {
    status: "CG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}cg-draft",
  },
  {
    status: "BG-FINAL",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}bg-final",
  },
  {
    status: "BG-DRAFT",
    expectedURL: "https://www.w3.org/StyleSheets/TR/{version}bg-draft",
  },
];

async function loadWithStatus(status, expectedURL, mode) {
  const config = makeBasicConfig();
  config.useExperimentalStyles = false;
  config.specStatus = status;
  config.prevVersion = "FPWD";
  config.previousMaturity = "WD";
  config.previousPublishDate = "2013-12-17";
  let version = "2016/";
  switch (mode) {
    case "experimental":
      config.useExperimentalStyles = true;
      version = `${2016}/`;
      break;
    default:
      if (mode) {
        config.useExperimentalStyles = mode;
        version = `${mode}/`;
      }
  }
  const testedURL = expectedURL.replace("{version}", version);
  const ops = {
    config,
    body: makeDefaultBody(),
  };
  const doc = await makeRSDoc(ops);
  const query = `link[href^='${testedURL}']`;
  const elem = doc.querySelector(query);
  expect(elem).toBeTruthy();
  expect(elem.href).toBe(testedURL);
  return doc;
}

describe("W3C - Style", () => {
  afterAll(flushIframes);

  it("should include 'fixup.js'", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem.src).toBe("https://www.w3.org/scripts/TR/2016/fixup.js");
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
    await loadWithStatus(
      "",
      "https://www.w3.org/StyleSheets/TR/{version}base.css"
    );
  });

  // We pick random half from the list, as running the whole set is very slow
  pickRandomsFromList(specStatus).map(test => {
    it(`should style according to spec status ${test.status}`, async () => {
      await loadWithStatus(test.status, test.expectedURL, "2016");
    });
  });

  // We pick random half from the list, as running the whole set is very slow
  pickRandomsFromList(specStatus).map(test => {
    it(`should style according to spec status ${test.status} in experimental way`, async () => {
      await loadWithStatus(test.status, test.expectedURL, "experimental");
    });
  });

  // We pick random half from the list, as running the whole set is very slow
  pickRandomsFromList(specStatus).map(test => {
    it(`should not use 'experimental' URL in ${test.status} status when useExperimentalStyles is false`, async () => {
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
    const query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem).toBe(null);
  });
});
