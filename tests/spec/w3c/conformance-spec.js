"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
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
    expect(conformance.querySelectorAll("h2").length).toBe(1);
    expect(conformance.querySelector("h2").textContent).toMatch(
      /\d+\.\s+Conformance/
    );
    expect(conformance.querySelectorAll("p").length).toBe(3);
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
    expect(doc.querySelectorAll("#conformance .rfc2119").length).toBe(3);
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
    expect(doc.querySelectorAll("#conformance .rfc2119").length).toBe(0);
  });

  it("emits end event", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
        <script>
          require(["core/pubsubhub"], ({ sub }) => {
            sub("end", name => {
              if (name === "w3c/conformance") {
                document.title = "hello";
              }
            })
          })
        </script>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.title).toBe("hello");
  });
});
