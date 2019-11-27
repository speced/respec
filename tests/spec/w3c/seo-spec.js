"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

function makeTest(uri) {
  return doc => {
    const canLink = doc.querySelector("link[rel='canonical']");
    expect(canLink.href).toBe(uri);
  };
}
describe("W3C - SEO", () => {
  afterAll(flushIframes);

  it("defaults to TR as canonical URI", async () => {
    const test = makeTest("https://www.w3.org/TR/Foo/");
    test(await makeRSDoc(makeStandardOps()));
  });

  it("sets the canonical URI to TR URI when so configured", async () => {
    const test = makeTest("https://www.w3.org/TR/Foo/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "TR";
    test(await makeRSDoc(ops));
  });

  it("sets the canonical URI to editors draft when so configured", async () => {
    const test = makeTest("https://foo.com/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "edDraft";
    test(await makeRSDoc(ops));
  });

  it("shouldn't set any canonical URI if no shortname is defined", async () => {
    const ops = makeStandardOps();
    ops.config.shortName = undefined;
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("link[rel='canonical']")).toBe(null);
  });

  it("shouldn't set any canonical URI if it is a draft document", async () => {
    const ops = makeStandardOps();
    const draftStatuses = ["CG-DRAFT", "BG-DRAFT", "unofficial"];
    for (const status of draftStatuses) {
      ops.config.specStatus = status;
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("link[rel='canonical']")).toBe(null);
    }
  });

  it("sets the canonical URI if explicitly set", async () => {
    const test = makeTest("https://example.com/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "https://example.com";
    test(await makeRSDoc(ops));
  });

  const body = `
    <html>
    <title>Basic Title</title>
    <section id="sotd">
      <p>foo</p>
    </section>
    <section id="toc"></section>
    <p>foo [[!TestRef1]] [[TestRef2]] [[!TestAlias]]</p>
  `;
  const config = {
    editors: [
      {
        name: "Gregg Kellogg",
        url: "http://URI",
        company: "COMPANY",
        companyURL: "http://COMPANY",
        mailto: "EMAIL",
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
        isbn: "9783319934167",
      },
      TestAlias: {
        aliasOf: "TestRef3",
      },
    },
  };

  it("includes basic document information", async () => {
    const ops = { config, body };
    const doc = await makeRSDoc(ops);
    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld["@context"]).toContain("http://schema.org");
    expect(jsonld.id).toBe("https://www.w3.org/TR/some-spec/");
    expect(jsonld.type).toContain("TechArticle");
    expect(jsonld.type).toContain("w3p:PER");
    expect(jsonld.datePublished).toBe("2013-06-25");
    expect(jsonld.description).toContain("test abstract");
    expect(jsonld.inLanguage).toBe("en");
    expect(jsonld.isBasedOn).toBe(
      "https://www.w3.org/TR/2012/REC-some-spec-20120607/"
    );
    expect(jsonld.license).toBe(
      "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document"
    );
    expect(jsonld.name).toBe("Basic Title");
    expect(jsonld.copyrightHolder).toEqual({
      name: "World Wide Web Consortium",
      url: "https://www.w3.org/",
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
        url: "http://COMPANY",
      },
    });
  });

  it("describes contributors", async () => {
    const ops = { config, body };
    const doc = await makeRSDoc(ops);

    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld.contributor).toContain({
      type: "Person",
      name: "Gregg Kellogg",
    });
    expect(jsonld.contributor).toContain({
      type: "Person",
      name: "Shane McCarron",
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
      url: "http://test.com/1",
      creator: [{ name: "William Shakespeare" }],
      publisher: { name: "Publishers Inc." },
    });
    expect(jsonld.citation).toContain({
      id: "http://test.com/2",
      type: "TechArticle",
      name: "Second test",
      url: "http://test.com/2",
      creator: [{ name: "Another author" }],
      publisher: { name: "Testing 123" },
    });
    expect(jsonld.citation).toContain({
      id: "http://test.com/3",
      type: "TechArticle",
      name: "Third test",
      url: "http://test.com/3",
      publisher: { name: "Publisher Here" },
      identifier: "9783319934167",
    });
  });

  it("adds an additional copyright holder", async () => {
    const ops = {
      config: { ...config, additionalCopyrightHolders: ["ACME"] },
      body,
    };
    const doc = await makeRSDoc(ops);

    const script = doc.querySelector("script[type='application/ld+json']");
    const jsonld = JSON.parse(script.textContent);
    expect(jsonld.copyrightHolder).toEqual([
      {
        name: "World Wide Web Consortium",
        url: "https://www.w3.org/",
      },
      { name: "ACME" },
    ]);
  });
});
