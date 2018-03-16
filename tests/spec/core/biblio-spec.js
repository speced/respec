"use strict";
describe("W3C — Bibliographic References", () => {
  //Configuration for default of ReSpec
  const confDefault = {
    editors: [
      {
        name: "Robin Berjon",
      },
    ],
    edDraftURI: "https://foo",
    shortName: "Foo",
    specStatus: "WD",
    prevVersion: "FPWD",
    previousMaturity: "WD",
    previousPublishDate: "2013-12-17",
    localBiblio: {
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
      RefWithOnlyHref: {
        href: "http://test.com",
      },
      RefWithOnlyHrefAndAuthor: {
        href: "http://test.com",
        authors: ["William Shakespeare"],
      },
      FOOBARGLOP: {
        aliasOf: "BARBAR",
      },
      BARBAR: {
        title: "The BARBAR Spec",
      },
    },
  };

  //Configuration for APA citation
  const confAPA = {
    ...confDefault,
    biblioStyle: "APA",
  };

  //Configuration for MLA citation
  const confMLA = {
    ...confDefault,
    biblioStyle: "MLA",
  };

  const body = `
    <section id='sotd'>
      <p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]] [[RefWithOnlyHref]] [[!RefWithOnlyHrefAndAuthor]]</p>
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
    const link = docDefault.querySelector(
      `link[rel='dns-prefetch'][href*='${host}']`
    );
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
    let ref = docAPA.querySelector("#bib-TestRef1 + dd");
    expect(ref).toBeTruthy();
    let finalString = "William Shakespeare. (2013-12-17). Test ref title. Retrieved from URL: http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    let anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(2);
    let [title, retrievedFrom] = [...anchors];
    expect(title.href).toEqual("http://test.com/");
    expect(title.firstElementChild.localName).toEqual("cite");
    expect(title.firstElementChild.textContent).toEqual("Test ref title");
    expect(retrievedFrom.href).toEqual("http://test.com/");
    ref = finalString = null;

    ref = docAPA.querySelector("#bib-TestRef3 + dd");
    expect(ref).toBeTruthy();
    finalString = "(2013-12-17). Third test. Retrieved from URL: http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(2);
    [title, retrievedFrom] = [...anchors];
    expect(title.href).toEqual("http://test.com/");
    expect(title.firstElementChild.localName).toEqual("cite");
    expect(title.firstElementChild.textContent).toEqual("Third test");
    expect(retrievedFrom.href).toEqual("http://test.com/");
  });

  it("displays the reference for MLA citation", () => {
    let ref = docMLA.querySelector("#bib-TestRef1 + dd");
    expect(ref).toBeTruthy();
    let finalString = "William Shakespeare. \"Test ref title.\" Publishers Inc., 2013-12-17, http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    let anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(2);
    let [title, retrievedFrom] = [...anchors];
    expect(title.href).toEqual("http://test.com/");
    expect(title.firstElementChild.localName).toEqual("cite");
    expect(title.firstElementChild.textContent).toEqual("\"Test ref title.\"");
    expect(retrievedFrom.href).toEqual("http://test.com/");
    ref = finalString = null;

    ref = docMLA.querySelector("#bib-TestRef2 + dd");
    expect(ref).toBeTruthy();
    finalString = "Another author. \"Second test.\" Testing 123, 2013-12-17, http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString);
    //Make sure that the right things are hyperlinked 
    anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(2);
    [title, retrievedFrom] = [...anchors];
    expect(title.href).toEqual("http://test.com/");
    expect(title.firstElementChild.localName).toEqual("cite");
    expect(title.firstElementChild.textContent).toEqual("\"Second test.\"");
    expect(retrievedFrom.href).toEqual("http://test.com/");
    ref = finalString = null;

    ref = docMLA.querySelector("#bib-TestRef3 + dd");
    expect(ref).toBeTruthy();
    finalString = "\"Third test.\" Publisher Here, 2013-12-17, http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(2);
    [title, retrievedFrom] = [...anchors];
    expect(title.href).toEqual("http://test.com/");
    expect(title.firstElementChild.localName).toEqual("cite");
    expect(title.firstElementChild.textContent).toEqual("\"Third test.\"");
    expect(retrievedFrom.href).toEqual("http://test.com/");
    ref = finalString = null;
  });

  //For both MLA and APA
  it("Reference with only url", ()=>{
    let ref = docAPA.querySelector("#bib-RefWithOnlyHref + dd");
    expect(ref).toBeTruthy();
    let finalString = "(2013-12-17). Retrieved from URL: http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    let anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(1);
    [retrievedFrom] = [...anchors];
    expect(retrievedFrom.href).toEqual("http://test.com/");
    ref = finalString = null;

    ref = docMLA.querySelector("#bib-RefWithOnlyHref + dd");
    expect(ref).toBeTruthy();
    finalString = "2013-12-17, http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(1);
    [retrievedFrom] = [...anchors];
    expect(retrievedFrom.href).toEqual("http://test.com/");
  }); 

  //For both MLA and APA
  it("Reference with only url", ()=>{
    let ref = docAPA.querySelector("#bib-RefWithOnlyHrefAndAuthor + dd");
    expect(ref).toBeTruthy();
    finalString = "William Shakespeare. (2013-12-17). Retrieved from URL: http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(1);
    [retrievedFrom] = [...anchors];
    expect(retrievedFrom.href).toEqual("http://test.com/");
    ref = finalString = null;

    ref = docMLA.querySelector("#bib-RefWithOnlyHrefAndAuthor + dd");
    expect(ref).toBeTruthy();
    finalString = "William Shakespeare. 2013-12-17, http://test.com/";
    expect(ref.textContent.trim()).toEqual(finalString); 
    //Make sure that the right things are hyperlinked
    anchors = ref.querySelectorAll("a");
    expect(anchors.length).toEqual(1);
    [retrievedFrom] = [...anchors];
    expect(retrievedFrom.href).toEqual("http://test.com/");
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
