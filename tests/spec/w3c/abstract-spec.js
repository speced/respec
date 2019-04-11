"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
} from "../SpecHelper.js";

describe("W3C — Abstract", () => {
  afterAll(flushIframes);
  it("includes a h2 and sets the class", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
      abstract: "<section id='abstract'><p>test abstract</p></section>",
    };
    const doc = await makeRSDoc(ops);
    const abs = doc.getElementById("abstract");
    const h2 = abs.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toEqual("Abstract");
    expect(abs.classList.contains("introductory")).toBeTruthy();
    expect(abs.querySelector("p")).toBeTruthy();
  });
  // XXX we should also test that an error is sent when absent
});
