"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
} from "../SpecHelper.js";

describe("Geonovum — Conformance", () => {
  afterAll(flushIframes);
  it("includes a h2 and inject its content", async () => {
    const config = makeBasicConfig("geonovum");
    const ops = {
      config,
      body: `${makeDefaultBody()}<section id='conformance'>
            <p>Custom conformance remarks</p>
        </section>`,
      profile: "geonovum",
    };
    const doc = await makeRSDoc(ops);
    const conformance = doc.getElementById("conformance");
    expect(conformance.querySelectorAll("h2")).toHaveSize(1);
    expect(conformance.querySelector("h2").textContent).toBe("Conformiteit");
    expect(conformance.querySelectorAll("p")).toHaveSize(3);
  });
});
