"use strict";
describe("Core — data-cite attribute", () => {
  afterAll(done => {
    flushIframes();
    done();
  });
  it("links data-cite attributes as normative reference", done => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + `
        <section>
          <p id="t1"><a data-cite="!WHATWG-HTML">inline link</a></p>
        </section>
      `,
    };
    makeRSDoc(ops).then(doc => {
      debugger;
      const a = doc.querySelector("#t1 > a");
      expect(a.textContent).toEqual("inline link");
      expect(a.href).toEqual("https://html.spec.whatwg.org/multipage/");
      expect(a.hasAttribute("data-cite")).toEqual(false);
      expect(doc.querySelector("#bib-WHATWG-HTML").closest("section").id)
        .toEqual("normative-references");
    }).then(done);
  });
  it("links data-cite attributes as informative reference", done => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + `
          <section>
            <p id="t1"><a data-cite="WHATWG-DOM">inline link</a></p>
          </section>
        `,
    };
    makeRSDoc(ops).then(doc => {
      const a = doc.querySelector("#t1 > a");
      expect(a.textContent).toEqual("inline link");
      expect(a.href).toEqual("https://dom.spec.whatwg.org/");
      expect(a.hasAttribute("data-cite")).toEqual(false);
      expect(doc.querySelector("#bib-WHATWG-DOM").closest("section").id)
        .toEqual("informative-references");
    }).then(done);
  });
  it("handles bogus data-cite values", done => {
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + `
          <section>
            <p id="t1"><a data-cite="no-exist-inf">link 1</a></p>
            <p id="t2"><a data-cite="!no-exist-norm">link 2</a></p>
          </section>
        `,
    };
    makeRSDoc(ops).then(doc => {
      const a1 = doc.querySelector("#t1 > a");
      const a2 = doc.querySelector("#t2 > a");
      expect(a1.textContent).toEqual("link 1");
      expect(a2.textContent).toEqual("link 2");
      expect(a1.href).toEqual("");
      expect(a2.href).toEqual("");
      expect(a1.hasAttribute("data-cite")).toEqual(false);
      expect(a2.hasAttribute("data-cite")).toEqual(false);
      expect(doc.querySelector("#bib-no-exist-inf").closest("section").id)
        .toEqual("informative-references");
      expect(doc.querySelector("#bib-no-exist-norm").closest("section").id)
        .toEqual("normative-references");
    }).then(done);
  });
});
