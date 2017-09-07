"use strict";
describe("W3C — Conformance", function() {
  afterAll(flushIframes);
  it("includes a h2 and inject its content", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section id='conformance'>
            <p>CONFORMANCE</p>
        </section>
        <section>
          <h2>my section</h2>
          <p>No terms are used except SHOULD.</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const conformance = doc.getElementById("conformance");
    expect(conformance.querySelectorAll("h2").length).toEqual(1);
    expect(conformance.querySelector("h2").textContent).toMatch(
      /\d+\.\s+Conformance/
    );
    expect(conformance.querySelectorAll("p").length).toEqual(3);
    expect(conformance.querySelector("p:first-of-type").textContent).toMatch(
      "non-normative"
    );
    expect(conformance.querySelector("p:last-child").textContent).toMatch(
      "CONFORMANCE"
    );
  });

  it("includes only referenced 2119 terms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section id='conformance'>
          <p>CONFORMANCE</p>
        </section>
        <section><h2>my section</h2>
          <p>Terms are MUST, SHOULD, SHOULD NOT, and SHOULD  NOT.</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    var $c = $("#conformance", doc);
    var $d = $(".rfc2119", $c);
    expect($d.length).toEqual(3);
  });

  it("omits the 2119 reference when there are no terms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section id='conformance'>
          <p>CONFORMANCE</p>
        </section>
        <section><h2>my section</h2>
          <p>Terms are not used.</p>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    var $c = $("#conformance", doc);
    var $d = $(".rfc2119", $c);
    expect($d.length).toEqual(0);
  });
});
