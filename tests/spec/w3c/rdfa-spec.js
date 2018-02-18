"use strict";
describe("W3C — RDFa", function() {
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
        {
          name: "Gregg Kellogg",
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
      publicationDate: "2013-06-25",
      previousPublishDate: "2012-06-07",
      previousMaturity: "REC",
      specStatus: "PER",
      perEnd: "2014-06-25",
      wgPatentURI: "http://www.w3.org/fake-patent-uri",
      doRDFa: true,
    };
  }

  it("should set the document information", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body: "<section id='sotd'>Some unique SOTD content</section>",
    };

    makeRSDoc(ops, function(doc) {
      var $c = $("html", doc);
      expect($c.attr("prefix")).toMatch(/w3p:/);
      expect($c.attr("prefix")).not.toMatch(/dc:/);
      expect($c.attr("prefix")).not.toMatch(/foaf:/);
      expect($c.attr("prefix")).not.toMatch(/xsd:/);
      expect($c.attr("typeof")).toMatch(/w3p:PER/);
      expect($c.attr("typeof")).toMatch(/schema:TechArticle/);

      var $lang = $("html>head>meta[property='schema:inLanguage']", doc);
      expect($lang.attr("content")).toEqual("en");
    }).then(done);
  });

  it("should set RDFa information on editors", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body: "<section id='sotd'>Some unique SOTD content</section>",
    };

    makeRSDoc(ops, function(doc) {
      var $dd = $("dt:contains('Editors:')", doc).next("dd");
      var $sp = $dd.children("span").first();
      expect($sp.attr("property")).toEqual("schema:editor");
      expect($sp.attr("typeof")).toEqual("schema:Person");
      var $meta = $sp.children("meta");
      expect($meta.attr("property")).toEqual("schema:name");
      expect($meta.attr("content")).toEqual("Shane McCarron");

      var $a = $sp.children("a.p-name");
      expect($a.attr("property")).toEqual("schema:url");
      expect($a.attr("href")).toEqual("http://URI");

      var $spo = $sp.children("span");
      expect($spo.attr("property")).toEqual("schema:worksFor");
      expect($spo.attr("typeOf")).toEqual("schema:Organization");

      $a = $sp.children('a.email');
      expect($a.attr("property")).toEqual("foaf:mbox");
      expect($a.attr("href")).toEqual("mailto:EMAIL");

      var $ddd = $dd.next("dd");
      expect($ddd.attr("property")).not.toBeDefined();
      $sp = $ddd.children("span").first();
      expect($sp.attr("property")).toEqual("schema:editor");
      expect($sp.attr("typeof")).toEqual("schema:Person");
      var $spp = $sp.children("span");
      expect($spp.attr("property")).toEqual("schema:name");
      expect($spp.text()).toEqual("Gregg Kellogg");
    }).then(done);
  });

  it("should set RDFa information on authors", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body: "<section id='sotd'>Some unique SOTD content</section>",
    };

    makeRSDoc(ops, function(doc) {
      var $dd = $("dt:contains('Authors:')", doc).next("dd");
      var $sp = $dd.children("span").first();
      expect($sp.attr("property")).toEqual("schema:contributor");
      expect($sp.attr("typeof")).toEqual("schema:Person");
      var $spp = $sp.children("span");
      expect($spp.attr("property")).toEqual("schema:name");
      expect($spp.text()).toEqual("Gregg Kellogg");

      var $ddd = $dd.next("dd");
      $sp = $ddd.children("span").first();
      expect($sp.attr("property")).toEqual("schema:contributor");
      expect($sp.attr("typeof")).toEqual("schema:Person");
      $spp = $sp.children("span");
      expect($spp.attr("property")).toEqual("schema:name");
      expect($spp.text()).toEqual("Shane McCarron");
    }).then(done);
  });

  it("should set information on patent", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body: "<section id='sotd'>Some unique SOTD content</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("#sotd_patent", doc);
      expect($c.attr("property")).toEqual("w3p:patentRules");
    }).then(done);
  });
  it("should describe normative references", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body: makeDefaultBody() + "<section><p>[[!DAHU]] [[REX]]</p></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $nr = $("#normative-references", doc);
      var $ir = $("#informative-references", doc);
      expect($nr.attr("typeof")).toMatch(/schema:Chapter/);
      expect($nr.attr("resource")).toEqual("#normative-references");
      expect($nr.find("dl dt").length).toEqual(1);
      expect($nr.find("dl dt:contains('[DAHU]')").length).toEqual(1);
      expect($nr.find("dl>dd>a").attr("property")).toEqual("schema:dependencies");

      expect($ir.attr("typeof")).toMatch(/schema:Chapter/);
      expect($ir.attr("resource")).toEqual("#informative-references");
      expect($ir.find("dl dt").length).toEqual(1);
      expect($ir.find("dl dt:contains('[REX]')").length).toEqual(1);
      expect($ir.find("dl>dd>a").attr("property")).toEqual("schema:citation");
    }).then(done);
  });

  it("should mark abstract using schema:description", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body:
        makeDefaultBody() + "<section id='abstract'>test abstract</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $abs = $("#abstract", doc);
      expect($abs.attr("property")).toEqual("schema:description");
      expect($abs.attr("typeof")).not.toBeDefined();
      expect($abs.attr("resource")).not.toBeDefined();
    }).then(done);
  });

  it("should add hasPart to chapters", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body: makeDefaultBody() + "<section id='chap'><h2>Chapter</h2></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $chap = $("#chap", doc);
      expect($chap.attr("typeof")).toEqual("schema:Chapter");
      expect($chap.attr("resource")).toEqual("#chap");
      expect($chap.attr("property")).toMatch(/schema:hasPart/);
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
      authors: [
        {
          name: "Gregg Kellogg",
        },
        {
          name: "Shane McCarron",
        },
      ],
      shortName: "some-spec",
      publicationDate: "2013-06-25",
      previousPublishDate: "2012-06-07",
      previousMaturity: "REC",
      specStatus: "PER",
      doRDFa: false,
      perEnd: "2014-06-25",
    };
    var ops = {
      config: noConfig,
      body: "<section id='sotd'>Some unique SOTD content</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $c = $("html", doc);
      expect($c.attr("prefix")).not.toBeDefined();
      expect($c.attr("typeof")).not.toBeDefined();
      expect($c.attr("property")).not.toBeDefined();
      expect($c.attr("content")).not.toBeDefined();
      expect($c.attr("about")).not.toBeDefined();
    }).then(done);
  });
});
