"use strict";
describe("W3C — Bibliographic References", () => {
  const config = {
    editors: [
      {
        name: "Robin Berjon",
      },
    ],
    shortName: "Foo",
    specStatus: "WD",
    prevVersion: "FPWD",
    previousMaturity: "WD",
    previousPublishDate: "2013-12-17",
    localBiblio: {
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
    },
  };
  const body = `
    <section id='sotd'>
      <p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]]</p>
    </section>
    <section id='sample'>
      <p>foo [[!FOOBARGLOP]] bar</p>
    </section>
  `;

  afterAll(flushIframes);
  let isSpecRefAvailable = false;
  const bibRefsURL = new URL("https://specref.herokuapp.com/bibrefs");

  let doc;
  beforeAll(async () => {
    doc = await makeRSDoc({ config, body });
  });

  it("pings biblio service to see if it's running", async () => {
    const res = await fetch(bibRefsURL, { method: "HEAD" });
    expect(res.ok).toBeTruthy();
    isSpecRefAvailable = res.ok;
  });

  it("includes a dns-prefetch to bibref server", () => {
    const host = bibRefsURL.host;
    const link = doc.querySelector(`link[rel='dns-prefetch'][href*='${host}']`);
    expect(link).toBeTruthy();
    expect(link.classList.contains("removeOnSave")).toBeTruthy();
  });

  it("displays the publisher when present", () => {
    // Make sure the reference is added.
    let ref = doc.querySelector("#bib-TestRef1 + dd");
    expect(ref).toBeTruthy();
    // This prevents Jasmine from taking down the whole test suite if SpecRef is down.
    if (!isSpecRefAvailable) {
      throw new Error(
        "SpecRef seems to be down. Can't proceed with this spec."
      );
    }
    expect(ref.textContent).toMatch(/Publishers Inc\.\s/);
    ref = null;
    // Make sure the ". " is automatically added to publisher.
    ref = doc.querySelector("#bib-TestRef2 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Testing 123\.\s/);
    ref = null;
    // Make sure publisher is shown even when there is no author
    ref = doc.querySelector("#bib-TestRef3 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Publisher Here\.\s/);
  });

  it("resolves a localy-aliased spec", () => {
    const ref = doc.querySelector("#bib-FOOBARGLOP + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/BARBAR/);
  });
});
