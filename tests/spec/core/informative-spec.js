"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Informative", () => {
  afterAll(flushIframes);
  it("should process informative sections", async () => {
    const body = `<section class='informative'><h2>TITLE</h2></section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const sec = doc.querySelector("div.informative, section.informative");
    expect(sec.querySelectorAll("p")).toHaveSize(1);
    expect(sec.querySelectorAll("p em")).toHaveSize(1);
    expect(sec.querySelector("p em").textContent).toBe(
      "This section is non-normative."
    );
  });
  it("localizes informative sections", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "nl",
      },
      body: `
      <section class="informative" id="info">
        <h2>title</h2>
      </section>`,
    };
    const doc = await makeRSDoc(ops);
    const em = doc.querySelector("#info > p > em");
    expect(em.textContent).toBe("Dit onderdeel is niet normatief.");
  });
});
