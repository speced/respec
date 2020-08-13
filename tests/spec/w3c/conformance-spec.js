"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("W3C — Conformance", () => {
  afterAll(flushIframes);
  it("includes a h2 and inject its content", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='conformance'>
            <p>CONFORMANCE</p>
        </section>
        <section>
          <h2>my section</h2>
          <p>No terms are used except SHOULD.</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const conformance = doc.getElementById("conformance");
    expect(conformance.querySelectorAll("h2")).toHaveSize(1);
    expect(conformance.querySelector("h2").textContent).toMatch(
      /\d+\.\s+Conformance/
    );
    expect(conformance.querySelectorAll("p")).toHaveSize(3);
    expect(conformance.querySelector("p:first-of-type").textContent).toContain(
      "non-normative"
    );
    expect(conformance.querySelector("p:last-child").textContent).toContain(
      "CONFORMANCE"
    );
  });

  it("includes only referenced 2119 terms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='conformance'>
          <p>CONFORMANCE</p>
        </section>
        <section><h2>my section</h2>
          <p>Terms are MUST, SHOULD, SHOULD NOT, and SHOULD  NOT.</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("#conformance .rfc2119")).toHaveSize(3);
  });

  it("omits the 2119 reference when there are no terms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='conformance'>
          <p>CONFORMANCE</p>
        </section>
        <section><h2>my section</h2>
          <p>Terms are not used.</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("#conformance .rfc2119")).toHaveSize(0);
  });

  it("allows conformance section to be completely overridden via .override css class", async () => {
    const body = `
      <section>
        <h2>Plain section</h2>
        <p>MUST SHOULD MAY.</p>
      </section>
      <section id="conformance" class="override">
        <h2>Overridden heading</h2>
        <p>Overridden paragraph.</p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps({}, body));
    const conformance = doc.querySelector("#conformance");

    expect(conformance.querySelectorAll(".rfc2119")).toHaveSize(0);
    expect(conformance.querySelectorAll("h2")).toHaveSize(1);
    expect(conformance.querySelectorAll("p")).toHaveSize(1);
    expect(conformance.querySelector("h2").textContent).toContain(
      "Overridden heading"
    );
    expect(conformance.querySelector("p").textContent).toBe(
      "Overridden paragraph."
    );
  });
});
