"use strict";

function makeTest(uri) {
  return doc => {
    const canLink = doc.querySelector("link[rel='canonical']");
    expect(canLink.href).toEqual(uri);
  };
}
describe("W3C - SEO", () => {
  afterAll(flushIframes);

  it("defaults to TR as canonical URI", done => {
    const test = makeTest("https://www.w3.org/TR/Foo/");
    makeRSDoc(makeStandardOps(), test).then(done);
  });

  it("sets the canonical URI to TR URI when so configured", done => {
    const test = makeTest("https://www.w3.org/TR/Foo/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "TR";
    makeRSDoc(ops, test).then(done);
  });

  it("sets the canonical URI to editors draft when so configured", done => {
    const test = makeTest("https://foo.com/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "edDraft";
    makeRSDoc(ops, test).then(done);
  });

  it("shouldn't set any canonical URI if no shortname is defined", done => {
    const ops = makeStandardOps();
    ops.config.shortName = undefined;
    makeRSDoc(ops, doc => {
      expect(doc.querySelector("link[rel='canonical']")).toEqual(null);
    }).then(done);
  });

  it("sets the canonical URI if explicitly set", done => {
    const test = makeTest("https://example.com/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "https://example.com";
    makeRSDoc(ops, test).then(done);
  });

  const body = `
    <html>
    <title>Basic Title</title>
    <section id="sotd">
      <p>foo</p>
    </section>
    <section id="toc"></section>
    <p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]]</p>
  `;
  const config = {
    editors: [
      {
        name: "Gregg Kellogg",
        url: "http://URI",
        company: "COMPANY",
        companyURL: "http://COMPANY",
        mailto: "EMAIL"
      },
    ],
    authors: [
      {
        name: "Gregg Kellogg",
      },
      {
        name: "Shane McCarron",
      },
    ],
    shortName: "some-spec",
    publishDate: "2013-06-25",
    previousPublishDate: "2012-06-07",
    previousMaturity: "REC",
    specStatus: "PER",
    perEnd: "2014-06-25",
    wgPatentURI: "http://www.w3.org/fake-patent-uri",
    doJsonLd: true,
    localBiblio: {
      TestRef1: {
        title: "Test ref title",
        href: "http://test.com/1",
        authors: ["William Shakespeare"],
        publisher: "Publishers Inc.",
      },
      TestRef2: {
        title: "Second test",
        href: "http://test.com/2",
        authors: ["Another author"],
        publisher: "Testing 123",
      },
      TestRef3: {
        title: "Third test",
        href: "http://test.com/3",
        publisher: "Publisher Here",
      },
    },
  };

  it("includes basic document information", async () => {
    const ops = { config, body };
    const doc = await makeRSDoc(ops);
    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld["@context"]).toContain("http://schema.org");
    expect(jsonld.id).toEqual("https://www.w3.org/TR/some-spec/")
    expect(jsonld.type).toContain("TechArticle");
    expect(jsonld.type).toContain("w3p:PER");
    expect(jsonld.datePublished).toEqual("2013-06-25");
    expect(jsonld.description).toContain("test abstract");
    expect(jsonld.inLanguage).toEqual("en");
    expect(jsonld.isBasedOn).toEqual("https://www.w3.org/TR/2012/REC-some-spec-20120607/");
    expect(jsonld.license).toEqual("https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document")
    expect(jsonld.name).toEqual("Basic Title");
    expect(jsonld.copyrightHolder).toEqual({
      name: "World Wide Web Consortium",
      url: "https://www.w3.org/"
    });
  });

  it("describes editors and contributors", async () => {
    const ops = { config, body };
    const doc = await makeRSDoc(ops);

    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld.editor).toContain({
      type: "Person",
      name: "Gregg Kellogg",
      url: "http://URI",
      "foaf:mbox": "EMAIL",
      worksFor: {
        name: "COMPANY",
        url: "http://COMPANY"
      }
    });
  });

  it("describes contributors", async () => {
    const ops = { config, body };
    const doc = await makeRSDoc(ops);

    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld.contributor).toContain({
      type: "Person",
      name: "Gregg Kellogg"
    });
    expect(jsonld.contributor).toContain({
      type: "Person",
      name: "Shane McCarron"
    });
  });

  it("describes citations", async () => {
    const ops = { config, body };
    const doc = await makeRSDoc(ops);

    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld.citation).toContain({
      id: "http://test.com/1",
      type: "TechArticle",
      name: "Test ref title",
      url: "http://test.com/1"
    });
    expect(jsonld.citation).toContain({
      id: "http://test.com/2",
      type: "TechArticle",
      name: "Second test",
      url: "http://test.com/2"
    });
    expect(jsonld.citation).toContain({
      id: "http://test.com/3",
      type: "TechArticle",
      name: "Third test",
      url: "http://test.com/3"
    });
  });

  it("adds an additional copyright holder", async () => {
    const ops = {
      config: {...config, additionalCopyrightHolders: ["ACME"] },
      body
    };
    const doc = await makeRSDoc(ops);

    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld.copyrightHolder).toEqual([{
      name: "World Wide Web Consortium",
      url: "https://www.w3.org/"
    }, { name: "ACME" }]);
  });
});
