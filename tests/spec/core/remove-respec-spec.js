"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Remove ReSpec", () => {
  afterAll(flushIframes);
  it("should have removed all artifacts", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(".remove")).toBeNull();
    expect(doc.querySelector("script[data-requiremodule]")).toBeNull();
  });
});
