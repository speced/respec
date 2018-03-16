"use strict";
describe("W3C — Bibliographic References", () => {
  //Configuration for default of ReSpec
  const confDefault = {
    editors: [
      {
        name: "Robin Berjon"
      }
    ],
    edDraftURI: "https://foo",
    shortName: "Foo",
    specStatus: "WD",
    prevVersion: "FPWD",
    previousMaturity: "WD",
    previousPublishDate: "2013-12-17",
    localBiblio: {
      Zzz: {
        title: "Last Reference"
      },
      aaa: {
        title: "First Reference"
      },
      TestRef1: {
        title: "Test ref title",
        href: "http://test.com",
        authors: ["William Shakespeare"],
        publisher: "Publishers Inc."
      },
      TestRef2: {
        title: "Second test",
        href: "http://test.com",
        authors: ["Another author"],
        publisher: "Testing 123"
      },
      TestRef3: {
        title: "Third test",
        href: "http://test.com",
        publisher: "Publisher Here"
      },
      FOOBARGLOP: {
        aliasOf: "BARBAR"
      },
      BARBAR: {
        title: "The BARBAR Spec"
      }
    }
  };

  //Configuration for APA citation
  const confAPA = {
    ...confDefault,
    biblioStyle: "APA",
    localBiblio: {
      Zzz: {
        title: "Last Reference"
      },
      aaa: {
        title: "First Reference"
      },
      TestRef1: {
        title: "Test ref title",
        href: "http://test.com",
        authors: ["William Shakespeare"]
      },
      TestRef2: {
        title: "Second test",
        href: "http://test.com"
      },
      TestRef3: {
        title: "Third test"
      },
      TestRef4: {
        authors: ["William Shakespeare"]
      },
      TestRef5: {
        href: "http://test.com"
      },
      TestRef6: {
        href: "http://test.com",
        authors: ["William Shakespeare"]
      },
      FOOBARGLOP: {
        aliasOf: "BARBAR"
      },
      BARBAR: {
        title: "The BARBAR Spec"
      }
    }
  };

  //Configuration for MLA citation
  const confMLA = {
    ...confDefault,
    biblioStyle: "MLA",
    localBiblio: {
      Zzz: {
        title: "Last Reference"
      },
      aaa: {
        title: "First Reference"
      },
      TestRef1: {
        title: "Test ref title",
        href: "http://test.com",
        authors: ["William Shakespeare"],
        publisher: "Publishers Inc."
      },
      TestRef2: {
        title: "Second test",
        href: "http://test.com"
      },
      TestRef3: {
        title: "Third test",
        publisher: "Publisher Here"
      },
      TestRef4: {
        title: "Test ref title",
        href: "http://test.com",
        authors: ["William Shakespeare"]
      },
      TestRef5: {
        title: "Test ref title",
        authors: ["William Shakespeare"]
      },
      TestRef6: {
        authors: ["William Shakespeare"],
        publisher: "Publishers Inc."
      },
      FOOBARGLOP: {
        aliasOf: "BARBAR"
      },
      BARBAR: {
        title: "The BARBAR Spec"
      }
    }
  };

  const body = `
    <section id='sotd'>
      <p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]] [[!TestRef4]] [[TestRef5]] [[!TestRef6]]</p>
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

  afterAll(flushIframes);
  const bibRefsURL = new URL("https://specref.herokuapp.com/bibrefs");

  let docDefault, docAPA, docMLA;
  let specRefOk;
  beforeAll(async () => {
    docDefault = await makeRSDoc({ confDefault, body });
    docAPA = await makeRSDoc({ confAPA, body });
    docMLA = await makeRSDoc({ confMLA, body });
    specRefOk = (await fetch(bibRefsURL, { method: "HEAD" })).ok;
  });

  it("pings biblio service to see if it's running", () => {
    expect(specRefOk).toBeTruthy();
  });

  it("includes a dns-prefetch to bibref server", () => {
    const host = bibRefsURL.host;
    const link = docDefault.querySelector(`link[rel='dns-prefetch'][href*='${host}']`);
    expect(link).toBeTruthy();
    expect(link.classList.contains("removeOnSave")).toBeTruthy();
  });

  it("displays the publisher when present", () => {
    // Make sure the reference is added.
    let ref = docDefault.querySelector("#bib-TestRef1 + dd");
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
    ref = docDefault.querySelector("#bib-TestRef2 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Testing 123\.\s/);
    ref = null;
    // Make sure publisher is shown even when there is no author
    ref = docDefault.querySelector("#bib-TestRef3 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Publisher Here\.\s/);
  });

  it("displays the reference for APA citation", () => {
    // Make sure the reference is added.
    let ref = docAPA.querySelector("#bib-TestRef1 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/William Shakespeare\.\s/);
    expect(ref.textContent).toMatch(/Test ref title\.\s/);
    expect(ref.textContent).toMatch("Retrieved from URL: http://test.com/");
    ref = null;
    //title,url
    ref = docAPA.querySelector("#bib-TestRef2 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Second test\.\s/);
    expect(ref.textContent).toMatch("Retrieved from URL: http://test.com/");
    ref = null;
    //title
    ref = docAPA.querySelector("#bib-TestRef3 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Third test\.\s/);
    ref = null;
    //author
    ref = docAPA.querySelector("#bib-TestRef4 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/William Shakespeare\.\s/);
    ref = null;
    //url
    ref = docAPA.querySelector("#bib-TestRef5 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch("Retrieved from URL: http://test.com/");
    ref = null;
    //author,url
    ref = docAPA.querySelector("#bib-TestRef6 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/William Shakespeare\.\s/);
    expect(ref.textContent).toMatch("Retrieved from URL: http://test.com/");
  });

  it("displays the reference for MLA citation", () => {
    // Make sure the reference is added.
    let ref = docMLA.querySelector("#bib-TestRef1 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/William Shakespeare\.\s/);
    expect(ref.textContent).toMatch(/"Test ref title\."\s/);
    expect(ref.textContent).toMatch(/Publishers Inc,/);
    expect(ref.textContent).toMatch("http://test.com");
    ref = null;
    // title,url
    ref = docMLA.querySelector("#bib-TestRef2 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/"Second test"/);
    expect(ref.textContent).toMatch("http://test.com");
    ref = null;
    // publisher,title
    ref = docMLA.querySelector("#bib-TestRef3 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Publisher Here,/);
    expect(ref.textContent).toMatch(/"Third test\."\s/);
    ref = null;
    // title,url,author
    ref = docMLA.querySelector("#bib-TestRef4 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/"Test ref title\."\s/);
    expect(ref.textContent).toMatch("http://test.com");
    expect(ref.textContent).toMatch(/William Shakespeare\.\s/);
    ref = null;
    // title,author
    ref = docMLA.querySelector("#bib-TestRef5 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/"Test ref title\."\s/);
    expect(ref.textContent).toMatch(/William Shakespeare\.\s/);
    ref = null;
    // publisher,author
    ref = docMLA.querySelector("#bib-TestRef6 + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/Publishers Inc\.\s/);
    expect(ref.textContent).toMatch(/William Shakespeare\.\s/);
    ref = null;
  });

  it("resolves a localy-aliased spec", () => {
    const ref = docDefault.querySelector("#bib-FOOBARGLOP + dd");
    expect(ref).toBeTruthy();
    expect(ref.textContent).toMatch(/BARBAR/);
  });
  it("sorts references as if they were lowercase", () => {
    const { textContent: first } = docDefault.querySelector(
      "#normative-references dt:first-of-type"
    );
    const { textContent: last } = docDefault.querySelector(
      "#normative-references dt:last-of-type"
    );
    expect(first).toMatch("[a]");
    expect(last).toMatch("[Zzz]");
  });
});
