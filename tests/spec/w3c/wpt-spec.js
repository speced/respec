"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("W3C — WPT", () => {
  afterAll(flushIframes);
  it("includes WPT information", async () => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    const abs = doc.getElementById("abstract");
    const h2 = abs.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toBe("Abstract");
    expect(abs.classList).toContain("introductory");
    expect(abs.querySelector("p")).toBeTruthy();
  });
  // XXX we should also test that an error is sent when absent
});
