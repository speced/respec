"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

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
    EVERCOOKIE: {
      authors: ["Samy Kamkar"],
      href: "https://samy.pl/evercookie/",
      title: "evercookie - virtually irrevocable persistent cookies",
      date: "September 2010",
    },
  };
  const body = `
    <section id='sotd'>
      <p>[[DOM]] [[dom]] [[fetch]] [[?FeTcH]] [[FETCh]] [[fetCH]]
      <p>foo [[TestRef1]] [[TestRef2]] [[TestRef3]]</p>
      <p>[[EVERCOOKIE]]</p>
    </section>
    <section id='sample'>
      <h2>Privacy</h2>
      <p>foo [[FOOBARGLOP]] bar</p>
    </section>
    <section>
      <h2>Sorted</h2>
      <p>From [[Zzz]] to [[aaa]] - [[DOM]] and [[fetch]]</p>
    </section>
    <section id="conformance"></section>
  `;

  const ops = makeStandardOps({ localBiblio }, body);

  afterAll(flushIframes);
  const bibRefsURL = new URL("https://api.specref.org/bibrefs");

  let doc;
  let specRefOk;
  beforeAll(async () => {
    doc = await makeRSDoc(ops);
    specRefOk = (await fetch(bibRefsURL, { method: "HEAD" })).ok;
  });

  it("displays references correctly", async () => {
    const ref = doc.querySelector("#bib-evercookie + dd");
    expect(ref.textContent).toBe(
      "evercookie - virtually irrevocable persistent cookies. Samy Kamkar. September 2010. URL: https://samy.pl/evercookie/"
    );
  });

  it("pings biblio service to see if it's running", () => {
    expect(specRefOk).toBeTruthy();
  });

  it("includes the title of a spec for an inline citation, including aliases", async () => {
    const body = `
      <section id="conformance">
        <p id="ref-local">[[LOCAL]]</p>
        <p id="refs-dom">[[DOM4]] [[DOM]] [[dom]] [[dom4]]</p>
      </section>
    `;
    const localBiblio = {
      LOCAL: {
        title: "Test ref title",
        href: "http://test.com",
      },
    };
    const ops = makeStandardOps({ localBiblio }, body);
    const doc = await makeRSDoc(ops);

    const refLocal = doc.querySelector("#ref-local a");
    expect(refLocal.title).toBe("Test ref title");
    const refsDom = doc.querySelectorAll("#refs-dom a");
    expect(
      [...refsDom].every(a => a.getAttribute("title") === "DOM Standard")
    ).toBeTruthy();
  });

  it("includes a dns-prefetch to bibref server", () => {
    const host = bibRefsURL.host;
    const link = doc.querySelector(`link[rel='dns-prefetch'][href*='${host}']`);
    expect(link).toBeTruthy();
    expect(link.classList).toContain("removeOnSave");
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
    expect(ref.textContent).toContain("BARBAR");
  });

  it("normalizes aliases", async () => {
    const body = `
      <section id="conformance">
        <p id="refs-dom">[[DOM4]] [[DOM]] [[dom]] [[dom4]]</p>
        <p id="refs-cssom">[[CSSOM-VIEW]] [[cssom-view]] [[cssom-view-1]]</p>
        <p id="refs-local">[[LOCAL]] <a data-cite="LOCAL">PASS</a></p>
      </section>
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
    expect(refsDom).toHaveSize(4);
    expect(
      refsDom.every(a => a.getAttribute("href") === "#bib-dom4")
    ).toBeTruthy();

    const refsCssom = [...doc.querySelectorAll("p#refs-cssom cite a")];
    expect(refsCssom).toHaveSize(3);
    expect(
      refsCssom.every(a => a.getAttribute("href") === "#bib-cssom-view")
    ).toBeTruthy();

    const nr = [...doc.querySelectorAll("#normative-references dt")];
    expect(nr).toHaveSize(3);
    expect(nr[0].textContent).toBe("[CSSOM-VIEW]");
    expect(nr[1].textContent).toBe("[DOM4]"); // first appearing [[TERM]] is used
    expect(nr[2].textContent).toBe("[LOCAL]");

    const refsLocal = [...doc.querySelectorAll("p#refs-local a")];
    expect(refsLocal[0].textContent).toBe("LOCAL");
    expect(refsLocal[0].getAttribute("href")).toBe("#bib-local");
    expect(refsLocal[1].href).toBe("http://test.com/");
  });

  it("sorts references as if they were lowercase", () => {
    const { textContent: first } = doc.querySelector(
      "#normative-references dt:first-of-type"
    );
    const { textContent: last } = doc.querySelector(
      "#normative-references dt:last-of-type"
    );
    expect(first).toBe("[aaa]");
    expect(last).toBe("[Zzz]");
  });

  it("makes sure that normative references win irrespective of case", () => {
    expect(doc.querySelectorAll("#bib-dom")).toHaveSize(1);
    const domRef = doc.getElementById("bib-dom");
    expect(domRef.closest("section").id).toBe("normative-references");

    expect(doc.querySelectorAll("#bib-fetch")).toHaveSize(1);
    const fetchRef = doc.getElementById("bib-fetch");
    expect(fetchRef.closest("section").id).toBe("normative-references");
    expect(fetchRef.textContent.trim()).toBe("[fetch]");
  });

  it("shows error if reference doesn't exist", async () => {
    const body = `<p id="bad-ref">[[bad-ref]]</p>`;
    const ops = makeStandardOps({ localBiblio }, body);
    const doc = await makeRSDoc(ops);

    const badRefLink = doc.querySelector("#bad-ref a");
    expect(badRefLink.textContent).toBe("bad-ref");
    expect(badRefLink.getAttribute("href")).toBe("#bib-bad-ref");
    const badRef = doc.querySelector("#informative-references dd");
    expect(badRef).toBeTruthy();
    expect(badRef.textContent).toBe("Reference not found.");
  });

  it("uses cached results from IDB", async () => {
    const body = `<p id="test">[[dom]] [[DOM4]] [[DOM]] [[dom4]]</p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const links = [...doc.querySelectorAll("#test a")];
    expect(links).toHaveSize(4);
    expect(
      links.every(a => a.getAttribute("href") === "#bib-dom")
    ).toBeTruthy();
    const refs = doc.querySelectorAll("#references dt");
    expect(refs).toHaveSize(1);
    expect(refs[0].textContent).toBe("[dom]");
  });

  it("fetches fresh results from specref", async () => {
    const { biblioDB } = await import("../../../src/core/biblio-db.js");

    await biblioDB.ready;
    await biblioDB.clear();

    const body = `<p id="test">[[dom]] [[DOM4]] [[DOM]] [[dom4]]</p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const links = [...doc.querySelectorAll("#test a")];
    expect(links).toHaveSize(4);
    expect(
      links.every(a => a.getAttribute("href") === "#bib-dom")
    ).toBeTruthy();
    const refs = doc.querySelectorAll("#references dt");
    expect(refs).toHaveSize(1);
    expect(refs[0].textContent).toBe("[dom]");
  });
});

it("makes sure references section has expected localization text", async () => {
  const ops = {
    config: makeBasicConfig(),
    htmlAttrs: {
      lang: "nl",
    },
    body: `
    <section class="informative" id="intro">[[DOM]]</section>
    <section>[[!HTML]]</section>
    `,
  };
  const doc = await makeRSDoc(ops);
  const { textContent } = doc.querySelector("#references h2");
  const [normRef, infoRef] = doc.querySelectorAll("#references h3");
  expect(doc.documentElement.lang).toBe("nl");
  expect(textContent).toContain("Referenties");
  expect(normRef.textContent).toContain("Normatieve referenties");
  expect(infoRef.textContent).toContain("Informatieve referenties");
});

it("allows custom content in the references section", async () => {
  const ops = {
    config: makeBasicConfig(),
    htmlAttrs: {
      lang: "nl",
    },
    body: `
    <section id="conformance">[[HTML]]</section>
    <section id="references">
      <h2>Custom header</h2>
      <p>Some descriptive text [[?DOM]]</p>
    </section>
    `,
  };
  const doc = await makeRSDoc(ops);
  const { textContent: h2Text } = doc.querySelector("#references > h2");
  const { textContent: pText } = doc.querySelector("#references > p");
  const [normRef, infoRef] = doc.querySelectorAll("#references h3");
  expect(doc.documentElement.lang).toBe("nl");
  expect(h2Text).toContain("Custom header");
  expect(pText).toContain("Some descriptive text");
  expect(normRef.textContent).toContain("Normatieve referenties");
  expect(infoRef.textContent).toContain("Informatieve referenties");
});
