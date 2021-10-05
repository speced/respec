"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — data-cite attribute", () => {
  afterAll(flushIframes);

  it(`walks up the tree to find the right reference to cite`, async () => {
    const body = `
      <section data-cite="dahut">
        <h2>test</h2>
        <p>
          <a id="t1" data-cite="#test">a</a>
          <dfn id="t2" data-cite="#test">a</dfn>
        </p>
        <p data-cite="URL">
          <a id="t3" data-cite="#urlspec">a</a>
        </p>
        <section data-cite="URL">
          <div data-cite="#fail">
            <p data-cite="#fail">
              <a id="t4" data-cite="#urlspec">a</a>
              <a id="t5" data-cite="CONSOLE#test5">a</a>
            </p>
          </div>
        </section>
      </section>
    `;
    const ops = makeStandardOps({ shortName: "fail" }, body);
    const doc = await makeRSDoc(ops);
    const t1 = doc.getElementById("t1");
    const t2 = doc.getElementById("t2").querySelector("a");
    const t3 = doc.getElementById("t3");
    const t4 = doc.getElementById("t4");
    const t5 = doc.getElementById("t5");
    const location = new URL("#test", "http://berjon.com/").href;
    expect(t1.href).toEqual(location);
    expect(t2.href).toEqual(location);
    const urlSpecHref = new URL("#urlspec", "https://url.spec.whatwg.org/")
      .href;
    expect(t3.href).toEqual(urlSpecHref);
    expect(t4.href).toEqual(urlSpecHref);
    const fooBarHref = new URL("#test5", "https://console.spec.whatwg.org/")
      .href;
    expect(t5.href).toEqual(fooBarHref);
  });

  it(`treats data-cite="#foo" as self citing when there is no parent data-cite`, async () => {
    const body = `
      <section>
        <h2>test</h2>
        <p>
          <a id="t1" data-cite="#test">a</a>
          <dfn id="t2" data-cite="#test">a</dfn>
        </p>
      </section>
    `;
    const ops = makeStandardOps({ shortName: "dahut" }, body);
    const doc = await makeRSDoc(ops);
    const t1 = doc.getElementById("t1");
    const t2 = doc.getElementById("t2").querySelector("a");
    const location = new URL("#test", doc.location).href;
    expect(t1.href).toEqual(location);
    expect(t2.href).toEqual(location);
  });

  it(`doesn't confuse similarly named specs as self citing`, async () => {
    const body = `
      <section>
        <h2>test</h2>
        <p id="test">
          [[[webxr-gamepads-module-1]]], [[webxr-gamepads-module-1]]
        </p>
      </section>
    `;
    const ops = makeStandardOps({ shortName: "gamepad" }, body);
    const doc = await makeRSDoc(ops);
    const [anchor1, anchor2] = doc.querySelectorAll("#test a");

    expect(anchor1.href).toContain("TR/webxr-gamepads-module-1/");
    expect(anchor1.textContent).toBe("WebXR Gamepads Module - Level 1");
    expect(anchor2.href).toContain("#bib-webxr-gamepads-module-1");
    expect(anchor2.textContent).toBe("webxr-gamepads-module-1");
  });

  it("links data-cite attributes as normative/informative reference when parent is citing", async () => {
    const body = `
      <section class="informative" data-cite="FETCH">
        <p><a data-cite="#fetch-thing">informative reference</a></p>
      </section>
      <section data-cite="!URL">
        <p><a data-cite="#url-thing">normative reference</a></p>
      </section>
      <section id="conformance"></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    expect(doc.getElementById("bib-url").closest("section").id).toBe(
      "normative-references"
    );
    expect(doc.getElementById("bib-fetch").closest("section").id).toBe(
      "informative-references"
    );
  });

  it("links directly to externally defined references", async () => {
    const body = `
      <section id="conformance">
        <p id="t1"><a>inline link</a></p>
        <p id="t2"><dfn data-cite="WHATWG-HTML#test">inline link</dfn></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const a = doc.querySelector("#t1 > a");
    expect(a.textContent).toBe("inline link");
    expect(a.href).toBe("https://html.spec.whatwg.org/multipage/#test");
    expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
      "normative-references"
    );
    // Definition part
    const dfn = doc.querySelector("#t2 > dfn");
    expect(dfn).toBeTruthy();
    const dfnA = doc.querySelector("#t2 > dfn > a");
    expect(dfnA.textContent).toBe("inline link");
    expect(dfnA.href).toBe("https://html.spec.whatwg.org/multipage/#test");
    expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
      "normative-references"
    );
  });

  it("links data-cite attributes as normative reference", async () => {
    const body = `
      <section id="conformance">
        <p id="t1"><a data-cite="WHATWG-HTML">inline link</a></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const a = doc.querySelector("#t1 > cite > a");
    expect(a.textContent).toBe("inline link");
    expect(a.href).toBe("https://html.spec.whatwg.org/multipage/");
    expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
      "normative-references"
    );
  });

  it("links data-cite attributes as informative reference", async () => {
    const body = `
      <section>
        <p id="t1"><a data-cite="?WHATWG-DOM">inline link</a></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const a = doc.querySelector("#t1 > cite > a");
    expect(a.textContent).toBe("inline link");
    expect(a.href).toBe("https://dom.spec.whatwg.org/");
    expect(doc.getElementById("bib-whatwg-dom").closest("section").id).toBe(
      "informative-references"
    );
  });

  it("handles bogus data-cite values", async () => {
    const body = `
      <section id="conformance">
        <p id="t1"><a data-cite="?no-exist-inf">link 1</a></p>
        <p id="t2"><a data-cite="!no-exist-norm">link 2</a></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const a1 = doc.querySelector("#t1 > a");
    const a2 = doc.querySelector("#t2 > a");
    expect(a1.textContent).toBe("link 1");
    expect(a2.textContent).toBe("link 2");
    expect(a1.href).toBe("");
    expect(a2.href).toBe("");
    expect(doc.getElementById("bib-no-exist-inf").closest("section").id).toBe(
      "informative-references"
    );
    expect(doc.getElementById("bib-no-exist-norm").closest("section").id).toBe(
      "normative-references"
    );
  });

  it("adds the path and fragment identifier to the link", async () => {
    const body = `
      <section id="conformance">
        <p id="t1"><a
          data-cite="WHATWG-HTML/webappapis.html#scripting">inline link</a></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const a = doc.querySelector("#t1 > a");
    expect(a.textContent).toBe("inline link");
    expect(a.href).toBe(
      "https://html.spec.whatwg.org/multipage/webappapis.html#scripting"
    );
    expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
      "normative-references"
    );
  });
  describe("data-cite-frag", () => {
    it("adds the path and the fragment identifier to the link", async () => {
      const body = `
        <section class="informative">
          <p id="t1"><a
            data-cite="WHATWG-HTML"
            data-cite-path="webappapis.html"
            data-cite-frag="pass">inline link</a></p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const a = doc.querySelector("#t1 > a");
      expect(a.textContent).toBe("inline link");
      expect(a.href).toBe(
        "https://html.spec.whatwg.org/multipage/webappapis.html#pass"
      );
      expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
        "informative-references"
      );
    });

    it("resolves paths relative to the cited spec, even when path is absolute", async () => {
      const body = `<a data-cite="HTML51/subpage.html#section">text</a>`;
      const ops = makeStandardOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(
        doc.querySelector(
          "a[href='https://www.w3.org/TR/html51/subpage.html#section']"
        )
      ).toBeTruthy();
    });

    it("cited fragments are overridden by cite-frag", async () => {
      const body = `
        <section id="conformance">
          <p id="t1"><a
            data-cite="WHATWG-HTML#fail"
            data-cite-frag="pass">inline link</a></p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);

      const a = doc.querySelector("#t1 > a");
      expect(a.textContent).toBe("inline link");
      expect(a.href).toBe("https://html.spec.whatwg.org/multipage/#pass");
      expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
        "normative-references"
      );
    });
  });

  it("Adds title to a reference when inline-link is empty normative reference", async () => {
    const body = `
      <section>
        <p id="t1"><a data-cite="HTML"></a></p>
        <p id="t2"><a data-cite="Fetch"></a></p>
        <p id="t3"><a data-cite="HTML">This should not be replaced</a></p>
      </section>
      <section id="conformance"></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    let a = doc.querySelector("#t1 > cite > a");
    expect(a.textContent).toBe("HTML Standard");
    expect(a.href).toBe("https://html.spec.whatwg.org/multipage/");
    expect(doc.getElementById("bib-html").closest("section").id).toBe(
      "normative-references"
    );
    a = doc.querySelector("#t2 > cite > a");
    expect(a.textContent).toBe("Fetch Standard");
    expect(a.href).toBe("https://fetch.spec.whatwg.org/");
    expect(doc.getElementById("bib-fetch").closest("section").id).toBe(
      "normative-references"
    );
    a = doc.querySelector("#t3 > cite > a");
    expect(a.textContent).toBe("This should not be replaced");
    expect(a.href).toBe("https://html.spec.whatwg.org/multipage/");
    expect(doc.getElementById("bib-fetch").closest("section").id).toBe(
      "normative-references"
    );
  });

  it("Adds title to a reference when inline-link is empty normative reference in definition", async () => {
    const body = `
      <section>
        <p id="t1"><dfn data-cite="WHATWG-HTML#test"></dfn></p>
        <p id="t2"><dfn data-cite="WHATWG-HTML#test">This should not change</dfn></p>
      </section>
      <section id="conformance"></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    let dfn = doc.querySelector("#t1 > dfn");
    expect(dfn).toBeTruthy();
    let dfnA = doc.querySelector("#t1 > dfn > a");
    expect(dfnA.textContent).toBe("HTML Standard");
    expect(dfnA.href).toBe("https://html.spec.whatwg.org/multipage/#test");
    expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
      "normative-references"
    );
    dfn = doc.querySelector("#t2 > dfn");
    expect(dfn).toBeTruthy();
    dfnA = doc.querySelector("#t2 > dfn > a");
    expect(dfnA.textContent).toBe("This should not change");
    expect(dfnA.href).toBe("https://html.spec.whatwg.org/multipage/#test");
    expect(doc.getElementById("bib-whatwg-html").closest("section").id).toBe(
      "normative-references"
    );
  });

  it("does not create external bibliography reference when when external spec id matches its Short Name", async () => {
    const body = `
      <section>
        <h2>test</h2>
        <p>
          <a data-cite="dahut#test1">a</a>
          <a data-cite="DaHuT#test2">a</a>
        </p>
      </section>
    `;
    const ops = makeStandardOps({ shortName: "dahut" }, body);
    const doc = await makeRSDoc(ops);
    const dahut = doc.getElementById("bib-dahut");
    const a = [...doc.querySelectorAll("section p a")];
    expect(
      a.every(
        anchor =>
          anchor.href ===
          `${doc.location.href}#${anchor.dataset.cite.split("#")[1]}`
      )
    ).toBeTruthy();
    expect(dahut).toBeNull();
  });

  it("Adds <cite> around <a> when frag and path are missing from <a/dfn data-cite='some-spec'>", async () => {
    const body = `
      <section>
        <p id="t1"><a data-cite="HTML"></a></p>
        <p id="t2"><dfn data-cite="HTML"></dfn></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    let cite = doc.querySelector("#t1 > cite");
    expect(cite).toBeTruthy();
    let a = doc.querySelector("#t1 > cite > a");
    expect(a.href).toBe("https://html.spec.whatwg.org/multipage/");

    cite = doc.querySelector("#t2 > dfn > cite");
    expect(cite).toBeTruthy();
    a = doc.querySelector("#t2 > dfn > cite > a");
    expect(a.href).toBe("https://html.spec.whatwg.org/multipage/");
  });

  it("does not wrap tags other than a/dfn with <cite> even with [data-cite='spec']", async () => {
    const body = `
      <section>
        <p id="t1"><span data-cite="HTML"></a></p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const cite = doc.querySelector("#t1 > cite");
    expect(cite).toBeNull();
  });
  it("prevents re-exporting things defined in other specs", async () => {
    const body = `
      <section>
        <p>
          <dfn id="t1" data-cite="html#foo">no export</dfn>
          <dfn id="t2" data-cite="html#bar" data-export>attempt to export</dfn>
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const dfn1 = doc.querySelector("#t1");
    expect("export" in dfn1.dataset).toBe(false);
    expect("noExport" in dfn1.dataset).toBe(true);

    const dfn2 = doc.querySelector("#t2");
    expect(dfn2.classList).toContain("respec-offending-element");
    expect("export" in dfn2.dataset).toBe(false);
    expect("noExport" in dfn2.dataset).toBe(true);
  });
});
