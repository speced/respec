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
      doRDFa: 1.1,
      perEnd: "2013-06-25",
    };
  }

  it("permalinks data should be added when section or h* have an id", function(
    done
  ) {
    var ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section id='testing'><h2>a heading</h2><p>some content</p></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#sotd", doc);
      var list = $(".permalink", $c);
      expect(list.length).toEqual(0);
      $c = $("#testing", doc);
      list = $(".permalink", $c);
      expect(list.length).toEqual(1);
    }).then(done);
  });

  it("permalinks data should be added when div or h* have an id", function(
    done
  ) {
    var ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<div id='testing'><h2>a heading</h2><p>some content</p></div>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#sotd", doc);
      var list = $(".permalink", $c);
      expect(list.length).toEqual(0);
      $c = $("#testing", doc);
      list = $(".permalink", $c);
      expect(list.length).toEqual(1);
    }).then(done);
  });

  it("permalinks data should not be added when section or h* have no id", function(
    done
  ) {
    var ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section id='testing'><h2>a heading</h2><p>some content</p></section>" +
          "<section><h2>another heading</h2><p>Other Content</p></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#testing", doc);
      $c = $c.nextElementSibling;
      var list = $(".permalink", $c);
      expect(list.length).toEqual(0);
    }).then(done);
  });

  it("permalinks data should not be added when section has a class of nolink", function(
    done
  ) {
    var ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section class='nolink' id='testing'><h2>a heading</h2><p>some content</p></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#testing", doc);
      var list = $(".permalink", $c);
      expect(list.length).toEqual(0);
    }).then(done);
  });

  it("should do nothing when disabled", function(done) {
    var noConfig = {
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
      doRDFa: false,
    };
    var ops = {
      config: noConfig,
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<section id='testing'><h2>a heading</h2><p>some content</p></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#sotd", doc);
      var list = $c.children(".permalink");
      expect(list.length).toEqual(0);
      var $n = $("#testing", doc);
      list = $n.children(".permalink");
      expect(list.length).toEqual(0);
    }).then(done);
  });

  it("permalinks content attribute should have special characters escaped", function(
    done
  ) {
    var ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<div id='testing'><h2>a heading with \" and '</h2><p>some content</p></div>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#testing", doc);
      var list = $("span.permalink a span", $c);
      expect(list.length).toEqual(1);
      expect($(list[0]).attr("content")).toMatch(/'/);
      expect($(list[0]).attr("content")).toMatch(/"/);
    }).then(done);
  });

  it("permalinks not on edge will have non-breaking space after heading", function(
    done
  ) {
    var ops = {
      config: makeCustomConfig(),
      body:
        "<section class='introductory' id='sotd'>Some unique SOTD content</section>" +
          "<div id='testing'><h2>a heading with \" and '</h2><p>some content</p></div>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#testing", doc);
      var list = $("h2", $c);
      expect(list.length).toEqual(1);
      expect(list[0].innerHTML).toMatch(/&nbsp;/);
    }).then(done);
  });
});
