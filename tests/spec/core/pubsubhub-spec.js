"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - pubsubhub", () => {
  afterAll(flushIframes);
  let doc;

  beforeAll(async () => {
    const ops = makeStandardOps();
    ops.config = null; // use src doc's config
    doc = await makeRSDoc(ops, "spec/core/pubsubhub-spec.html");
  });

  it("subscribes start-all", () => {
    expect(doc.getElementById("start-all").textContent).toBe("pass");
  });
});
