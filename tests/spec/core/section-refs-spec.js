"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - Section References", () => {
  afterAll(flushIframes);
  it("should have produced the section reference", async () => {
    const body = `
      <section id='ONE'>
        <h2>ONE</h2>
      </section>
      <section id='TWO'><a href='#ONE' class='sectionRef'></a></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const two = doc.getElementById("TWO");
    expect(two.querySelector("a").textContent).toContain("1. ONE");
  });
});
