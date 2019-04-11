"use strict";
import { flushIframes, makeDefaultBody, makeRSDoc } from "../SpecHelper.js";

const specStatusGeonovum = [
  {
    status: "GN-BASIS",
    expectedURL: "https://tools.geostandaarden.nl/respec/style/GN-BASIS.css",
  },
  {
    status: "GN-WV",
    expectedURL: "https://tools.geostandaarden.nl/respec/style/GN-WV.css",
  },
  {
    status: "GN-CV",
    expectedURL: "https://tools.geostandaarden.nl/respec/style/GN-CV.css",
  },
  {
    status: "GN-VV",
    expectedURL: "https://tools.geostandaarden.nl/respec/style/GN-VV.css",
  },
  {
    status: "base",
    expectedURL: "https://tools.geostandaarden.nl/respec/style/base.css",
  },
  {
    status: "GN-DEF",
    expectedURL: "https://tools.geostandaarden.nl/respec/style/GN-DEF.css",
  },
];

async function loadWithStatus(status, expectedURL) {
  const config = makeBasicConfig();
  config.useExperimentalStyles = false;
  config.specStatus = status;
  // config.prevVersion = "CV";
  config.previousStatus = "CV";
  config.previousPublishDate = "2013-12-17";
  const testedURL = expectedURL;
  const ops = {
    config,
    body: makeDefaultBody(),
    profile: "profile-geonovum",
  };
  const doc = await makeRSDoc(ops);
  const query = `link[href^='${testedURL}']`;
  const elem = doc.querySelector(query);
  expect(elem).toBeTruthy();
  expect(elem.href).toEqual(testedURL);
  return doc;
}

describe("Geonovum - Style", () => {
  afterAll(flushIframes);

  it("should include 'fixup.js'", async () => {
    const ops = makeStandardOps();
    // TODO: create test specs for Geonovum?
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const query = "script[src^='https://www.w3.org/scripts/TR/2016/fixup.js']";
    const elem = doc.querySelector(query);
    expect(elem.src).toEqual("https://www.w3.org/scripts/TR/2016/fixup.js");
  });

  it("should have a meta viewport added", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops, "spec/core/simple.html");
    const elem = doc.head.querySelector("meta[name=viewport]");
    expect(elem).toBeTruthy();
    const expectedStr = "width=device-width, initial-scale=1, shrink-to-fit=no";
    expect(elem.content).toEqual(expectedStr);
  });

  it("should default to GN-BASIS when specStatus is missing", async () => {
    await loadWithStatus(
      "",
      "https://tools.geostandaarden.nl/respec/style/GN-BASIS.css"
    );
  });

  it("should style according to spec status", async () => {
    // We pick random half from the list, as running the whole set is very slow
    const promises = pickRandomsFromList(specStatusGeonovum).map(test => {
      return loadWithStatus(test.status, test.expectedURL, "2016");
    });
    await Promise.all(promises);
  });

  it("should not use 'experimental' URL when useExperimentalStyles is false", async () => {
    // We pick random half from the list, as running the whole set is very slow
    const promises = pickRandomsFromList(specStatusGeonovum).map(test =>
      loadWithStatus(test.status, test.expectedURL)
    );
    await Promise.all(promises);
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
