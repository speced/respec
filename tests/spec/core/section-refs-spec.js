"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - Section References", () => {
  afterAll(flushIframes);
  it("should have produced the section reference", async () => {
    const body = `
      <section id='ONE'>
        <h2>
          ONE
        </h2>
      </section>
      <section id='TWO'><a href='#ONE' class='sectionRef'></a></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const two = doc.getElementById("TWO");
    // \u00A0 is &nbsp; - non-breaking space U+00A0
    expect(two.querySelector("a").textContent).toContain("§\u00A0");
  });
});
