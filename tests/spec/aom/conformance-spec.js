import { flushIframes, makeRSDoc, makeStandardAomOps } from "../SpecHelper.js";

describe("AOM — Conformance", () => {
  afterAll(flushIframes);
  it("includes a h2 and inject its content", async () => {
    const body = `
      <section id='conformance'>
        <p>CONFORMANCE</p>
      </section>
      <section>
        <h2>my section</h2>
        <p>No terms are used except SHOULD.</p>
      </section>
    `;
    const ops = makeStandardAomOps(null, body);
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
    const body = `
      <section id='conformance'>
        <p>CONFORMANCE</p>
      </section>
      <section><h2>my section</h2>
        <p>Terms are MUST, SHOULD, SHOULD NOT, and SHOULD  NOT and SHALL.</p>
      </section>`;
    const ops = makeStandardAomOps(null, body);
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("#conformance .rfc2119")).toHaveSize(4);
  });

  it("omits the 2119 reference when there are no terms", async () => {
    const body = `
      <section id='conformance'>
        <p>CONFORMANCE</p>
      </section>
      <section>
        <h2>my section</h2>
        <p>Terms are not used.</p>
      </section>`;
    const ops = makeStandardAomOps(null, body);
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
        <h2>Custom heading</h2>
        <p>Included paragraph.</p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardAomOps({}, body));
    const conformance = doc.querySelector("#conformance");

    expect(conformance.querySelectorAll(".rfc2119")).toHaveSize(0);
    expect(conformance.querySelectorAll("h2")).toHaveSize(1);
    expect(conformance.querySelectorAll("p")).toHaveSize(1);
    expect(conformance.querySelector("h2").textContent).toContain(
      "Custom heading"
    );
    expect(conformance.querySelector("p").textContent).toBe(
      "Included paragraph."
    );
  });
});
