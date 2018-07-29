"use strict";
describe("W3C — Permalinks", function() {
  afterAll(flushIframes);

  function makeCustomConfig() {
    return {
      editors: [
        {
          name: "Shane McCarron",
          url: "http://URI",
          company: "COMPANY",
          companyURI: "http://COMPANY",
          mailto: "EMAIL",
          note: "NOTE",
        },
      ],
      shortName: "some-spec",
      publicationDate: "2013-06-25",
      previousPublishDate: "2012-06-07",
      previousMaturity: "REC",
      specStatus: "PER",
      wgPatentURI: "http://www.w3.org/fake-patent-uri",
      includePermalinks: true,
      perEnd: "2013-06-25",
    };
  }

  it("permalinks data should be added when section or h* have an id", async () => {
    const ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section id='testing'><h2>a heading</h2><p>some content</p></section>",
    };
    const doc = await makeRSDoc(ops);
    let $c = $("#sotd", doc);
    let list = $(".permalink", $c);
    expect(list.length).toEqual(0);
    $c = $("#testing", doc);
    list = $(".permalink", $c);
    expect(list.length).toEqual(1);
  });

  it("permalinks data should be added when div or h* have an id", async () => {
    const ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<div id='testing'><h2>a heading</h2><p>some content</p></div>",
    };
    const doc = await makeRSDoc(ops);
    let $c = $("#sotd", doc);
    let list = $(".permalink", $c);
    expect(list.length).toEqual(0);
    $c = $("#testing", doc);
    list = $(".permalink", $c);
    expect(list.length).toEqual(1);
  });

  it("permalinks data should not be added when section or h* have no id", async () => {
    const ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section id='testing'><h2>a heading</h2><p>some content</p></section>" +
          "<section><h2>another heading</h2><p>Other Content</p></section>",
    };
    const doc = await makeRSDoc(ops);
    const $c = $("#testing", doc).nextElementSibling;
    const list = $(".permalink", $c);
    expect(list.length).toEqual(0);
  });

  it("permalinks data should not be added when section has a class of nolink", async () => {
    const ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section class='nolink' id='testing'><h2>a heading</h2><p>some content</p></section>",
    };
    const doc = await makeRSDoc(ops);
    const $c = $("#testing", doc);
    const list = $(".permalink", $c);
    expect(list.length).toEqual(0);
  });

  it("should do nothing when disabled", async () => {
    const noConfig = {
      editors: [
        {
          name: "Shane McCarron",
          url: "http://URI",
          company: "COMPANY",
          companyURI: "http://COMPANY",
          mailto: "EMAIL",
          note: "NOTE",
        },
      ],
      shortName: "some-spec",
      publicationDate: "2013-06-25",
      previousPublishDate: "2012-06-07",
      previousMaturity: "REC",
      specStatus: "PER",
      includePermalinks: false,
    };
    const ops = {
      config: noConfig,
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section id='testing'><h2>a heading</h2><p>some content</p></section>",
    };
    const doc = await makeRSDoc(ops);
    const $c = $("#sotd", doc);
    let list = $c.children(".permalink");
    expect(list.length).toEqual(0);
    const $n = $("#testing", doc);
    list = $n.children(".permalink");
    expect(list.length).toEqual(0);
  });

  it("permalinks content attribute should have special characters escaped", async () => {
    const ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<div id='testing'><h2>a heading with \" and '</h2><p>some content</p></div>",
    };
    const doc = await makeRSDoc(ops);
    const $c = $("#testing", doc);
    const list = $("span.permalink a span", $c);
    expect(list.length).toEqual(1);
  });

  it("permalinks not on edge will have non-breaking space after heading", async () => {
    const ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<div id='testing'><h2>a heading with \" and '</h2><p>some content</p></div>",
    };
    const doc = await makeRSDoc(ops);
    const $c = $("#testing", doc);
    const list = $("h2", $c);
    expect(list.length).toEqual(1);
    expect(list[0].innerHTML).toMatch(/&nbsp;/);
  });
});
