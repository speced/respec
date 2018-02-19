"use strict";
describe("Core — JSON-LD", () => {
  afterAll(flushIframes);
  const body = "<html><title>Basic Title</title></head>" +
    "<section id='sotd'><p>foo</p></section><section id='toc'></section>" +
    "<p>foo [[!TestRef1]] [[TestRef2]] [[!TestRef3]]</p>";
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

  it("should create basic document information", async () => {
    const ops = {config, body};
    const doc = await makeRSDoc(ops);

    const $script = $("head>script[type='application/ld+json']", doc);
    const jsonld = JSON.parse($script.text());
    expect(jsonld['@context']).toContain('http://schema.org');
    expect(jsonld.id).toEqual('https://www.w3.org/TR/2013/PER-some-spec-20130625/')
    expect(jsonld.type).toContain('TechArticle');
    expect(jsonld.type).toContain('w3p:PER');
    expect(jsonld.datePublished).toEqual('2013-06-25');
    expect(jsonld.description).toContain('Abstract');
    expect(jsonld.inLanguage).toEqual('en');
    expect(jsonld.isBasedOn).toEqual('https://www.w3.org/TR/2012/REC-some-spec-20120607/');
    expect(jsonld.license).toEqual("https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document")
    expect(jsonld.name).toEqual($('title', doc).text());
  });

  it("should describe editors and contributors", async () => {
    const ops = {config, body};
    const doc = await makeRSDoc(ops);

    const $script = $("head>script[type='application/ld+json']", doc);
    const jsonld = JSON.parse($script.text());
    expect(jsonld.editor).toContain({
      type: 'Person',
      name: 'Gregg Kellogg',
      url: 'http://URI',
      'foaf:mbox': 'EMAIL',
      worksFor: {
        name: 'COMPANY',
        url: 'http://COMPANY'
      }
    });
  });

  it("should describe contributors", async () => {
    const ops = {config, body};
    const doc = await makeRSDoc(ops);

    const $script = $("head>script[type='application/ld+json']", doc);
    const jsonld = JSON.parse($script.text());
    expect(jsonld.contributor).toContain({
      type: 'Person',
      name: 'Gregg Kellogg'
    });
    expect(jsonld.contributor).toContain({
      type: 'Person',
      name: 'Shane McCarron'
    });
  });

  it("should describe citations", async () => {
    const ops = {config, body};
    const doc = await makeRSDoc(ops);

    const $script = $("head>script[type='application/ld+json']", doc);
    const jsonld = JSON.parse($script.text());
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
});
