"use strict";
describe("W3C — Bibliographic References", () => {
  const localBiblio = {
    Zzz: {
      title: "Last Reference",
    },
    aaa: {
      title: "First Reference",
    },
    TestRef1: {
      title: "Test ref title",
      href: "http://test.com",
      authors: ["William Shakespeare"],
      publisher: "Publishers Inc.",
    },
    TestRef2: {
      title: "Second test",
      href: "http://test.com",
      authors: ["Another author"],
      publisher: "Testing 123",
    },
    TestRef3: {
      title: "Third test",
      href: "http://test.com",
      publisher: "Publisher Here",
    },
    FOOBARGLOP: {
      aliasOf: "BARBAR",
    },
    BARBAR: {
      title: "The BARBAR Spec",
    },
  };
  const body = `
    <section id='sotd'>
      <p>[[!DOM]] [[dom]] [[fetch]] [[!FeTcH]] [[FETCh]] [[fetCH]]
      <p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]]</p>
    </section>
    <section id='sample'>
      <h2>Privacy</h2>
      <p>foo [[!FOOBARGLOP]] bar</p>
    </section>
    <section>
      <h2>Sorted</h2>
      <p>From [[!Zzz]] to [[!aaa]]</p>
    </secton>
  `;

  const ops = makeStandardOps({ localBiblio }, body);

  afterAll(flushIframes);
  const bibRefsURL = new URL("https://specref.herokuapp.com/bibrefs");

  let doc;
  let specRefOk;
  beforeAll(async () => {
    doc = await makeRSDoc(ops);
    specRefOk = (await fetch(bibRefsURL, { method: "HEAD" })).ok;
  });

  it("pings biblio service to see if it's running", () => {
    expect(specRefOk).toBeTruthy();
  });

  it("includes a dns-prefetch to bibref server", () => {
    const host = bibRefsURL.host;
    const link = doc.querySelector(`link[rel='dns-prefetch'][href*='${host}']`);
    expect(link).toBeTruthy();
    expect(link.classList.contains("removeOnSave")).toBeTruthy();
  });

  it("displays the publisher when present", () => {
    // Make sure the reference is added.
    let ref = doc.querySelector("#bib-testref1 + dd");
    expect(ref).toBeTruthy();
    // This prevents Jasmine from taking down the whole test suite if SpecRef is down.
    if (!specRefOk) {
      throw new Error(
        "SpecRef seems to be down. Can't proceed with this spec."
      );
    }
    expect(ref.textContent).toMatch(/Publishers Inc\.\s/);
    ref = null;
    // Make sure the ". " is automatically added to publisher.
    ref = doc.querySelector("#bib-testref2 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Testing 123\.\s/);
    ref = null;
    // Make sure publisher is shown even when there is no author
    ref = doc.querySelector("#bib-testref3 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Publisher Here\.\s/);
  });

  it("resolves a localy-aliased spec", () => {
    const ref = doc.querySelector("#bib-foobarglop + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/BARBAR/);
  });

  it("normalizes aliases", async () => {
    const body = `
      <p id="refs-dom">[[DOM4]] [[DOM]] [[dom]] [[dom4]]</p>
      <p id="refs-cssom">[[CSSOM-VIEW]] [[cssom-view]] [[cssom-view-1]]</p>
      <p id="refs-local">[[LOCAL]] <a data-cite="LOCAL">PASS<a></p>
    `;
    const localBiblio = {
      LOCAL: {
        title: "Test ref title",
        href: "http://test.com",
      },
    };
    const ops = makeStandardOps({ localBiblio }, body);
    const doc = await makeRSDoc(ops);

    const refsDom = [...doc.querySelectorAll("p#refs-dom cite a")];
    expect(refsDom.length).toEqual(4);
    expect(
      refsDom.every(a => a.getAttribute("href") === "#bib-dom4")
    ).toBeTruthy();

    const refsCssom = [...doc.querySelectorAll("p#refs-cssom cite a")];
    expect(refsCssom.length).toEqual(3);
    expect(
      refsCssom.every(a => a.getAttribute("href") === "#bib-cssom-view")
    ).toBeTruthy();

    const nr = [...doc.querySelectorAll("#normative-references dt")];
    expect(nr.length).toEqual(3);
    expect(nr[0].textContent).toEqual("[CSSOM-VIEW]");
    expect(nr[1].textContent).toEqual("[DOM4]"); // first appearing [[TERM]] is used
    expect(nr[2].textContent).toEqual("[LOCAL]");

    const refsLocal = [...doc.querySelectorAll("p#refs-local a")];
    expect(refsLocal[0].textContent).toEqual("LOCAL");
    expect(refsLocal[0].getAttribute("href")).toEqual("#bib-local");
    expect(refsLocal[1].href).toEqual("http://test.com/");
  });

  it("sorts references as if they were lowercase", () => {
    const { textContent: first } = doc.querySelector(
      "#normative-references dt:first-of-type"
    );
    const { textContent: last } = doc.querySelector(
      "#normative-references dt:last-of-type"
    );
    expect(first).toMatch("[a]");
    expect(last).toMatch("[Zzz]");
  });

  it("makes sure that normative references win irrespective of case", () => {
    expect(doc.querySelectorAll("#bib-dom").length).toBe(1);
    const domRef = doc.querySelector("#bib-dom");
    expect(domRef.closest("section").id).toBe("normative-references");

    expect(doc.querySelectorAll("#bib-fetch").length).toBe(1);
    const fetchRef = doc.querySelector("#bib-fetch");
    expect(fetchRef.closest("section").id).toBe("normative-references");
    expect(fetchRef.textContent.trim()).toBe("[fetch]");
  });

  it("shows error if reference doesn't exist", async () => {
    const body = `<p id="bad-ref">[[bad-ref]]`;
    const ops = makeStandardOps({ localBiblio }, body);
    const doc = await makeRSDoc(ops);

    const badRefLink = doc.querySelector("#bad-ref a");
    expect(badRefLink.textContent).toEqual("bad-ref");
    expect(badRefLink.getAttribute("href")).toEqual("#bib-bad-ref");
    const badRef = doc.querySelector("#normative-references dd");
    expect(badRef).toBeTruthy();
    expect(badRef.textContent).toEqual("Reference not found.");
  });

  it("uses cached results from IDB", async () => {
    const body = `<p id="test">[[dom]] [[DOM4]] [[DOM]] [[dom4]]</p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const links = [...doc.querySelectorAll("#test a")];
    expect(links.length).toEqual(4);
    expect(
      links.every(a => a.getAttribute("href") === "#bib-dom")
    ).toBeTruthy();
    const refs = doc.querySelectorAll("#references dt");
    expect(refs.length).toEqual(1);
    expect(refs[0].textContent).toEqual("[dom]");
  });

  it("fetches fresh results from specref", async () => {
    const { biblioDB } = await new Promise(resolve => {
      require(["core/biblio-db"], resolve);
    });

    await biblioDB.ready;
    await biblioDB.clear();

    const body = `<p id="test">[[dom]] [[DOM4]] [[DOM]] [[dom4]]</p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const links = [...doc.querySelectorAll("#test a")];
    expect(links.length).toEqual(4);
    expect(
      links.every(a => a.getAttribute("href") === "#bib-dom")
    ).toBeTruthy();
    const refs = doc.querySelectorAll("#references dt");
    expect(refs.length).toEqual(1);
    expect(refs[0].textContent).toEqual("[dom]");
  });
});
