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
      expect($c.attr("prefix")).toMatch(/bibo:/);
      expect($c.attr("prefix")).toMatch(/w3p:/);
      expect($c.attr("prefix")).not.toMatch(/dc:/);
      expect($c.attr("prefix")).not.toMatch(/foaf:/);
      expect($c.attr("prefix")).not.toMatch(/xsd:/);
      expect($c.attr("typeof")).toMatch(/w3p:PER/);
      expect($c.attr("typeof")).toMatch(/bibo:Document/);

      var $lang = $("html>head>meta[property='dc:language']", doc);
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
      expect($dd.attr("property")).toEqual("bibo:editor");
      expect($dd.attr("resource")).toEqual("_:editor0");
      var $sp = $dd.children("span").first();
      expect($sp.attr("property")).toEqual("rdf:first");
      expect($sp.attr("typeof")).toEqual("foaf:Person");
      var $meta = $sp.children("meta");
      expect($meta.attr("property")).toEqual("foaf:name");
      expect($meta.attr("content")).toEqual("Shane McCarron");
      var $a = $sp.children("a");
      expect($a.attr("property")).toEqual("foaf:homepage");
      expect($a.attr("href")).toEqual("http://URI");
      $a = $sp.children("span").children("a");
      expect($a.attr("property")).toEqual("foaf:mbox");
      expect($a.attr("href")).toEqual("mailto:EMAIL");
      var $rest = $sp.next();
      expect($rest.attr("property")).toEqual("rdf:rest");
      expect($rest.attr("resource")).toEqual("_:editor1");

      var $ddd = $dd.next("dd");
      expect($ddd.attr("property")).not.toBeDefined();
      expect($ddd.attr("resource")).toEqual("_:editor1");
      $sp = $ddd.children("span").first();
      expect($sp.attr("property")).toEqual("rdf:first");
      expect($sp.attr("typeof")).toEqual("foaf:Person");
      var $spp = $sp.children("span");
      expect($spp.attr("property")).toEqual("foaf:name");
      expect($spp.text()).toEqual("Gregg Kellogg");
      $rest = $sp.next();
      expect($rest.attr("property")).toEqual("rdf:rest");
      expect($rest.attr("resource")).toEqual("rdf:nil");
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
      expect($sp.attr("property")).toEqual("dc:contributor");
      expect($sp.attr("typeof")).toEqual("foaf:Person");
      var $spp = $sp.children("span");
      expect($spp.attr("property")).toEqual("foaf:name");
      expect($spp.text()).toEqual("Gregg Kellogg");

      var $ddd = $dd.next("dd");
      $sp = $ddd.children("span").first();
      expect($sp.attr("property")).toEqual("dc:contributor");
      expect($sp.attr("typeof")).toEqual("foaf:Person");
      $spp = $sp.children("span");
      expect($spp.attr("property")).toEqual("foaf:name");
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
      expect($nr.attr("typeof")).toMatch(/bibo:Chapter/);
      expect($nr.attr("resource")).toEqual("#normative-references");
      expect($nr.find("dl dt").length).toEqual(1);
      expect($nr.find("dl dt:contains('[DAHU]')").length).toEqual(1);
      expect($nr.find("dl>dd>a").attr("property")).toEqual("dc:requires");

      expect($ir.attr("typeof")).toMatch(/bibo:Chapter/);
      expect($ir.attr("resource")).toEqual("#informative-references");
      expect($ir.find("dl dt").length).toEqual(1);
      expect($ir.find("dl dt:contains('[REX]')").length).toEqual(1);
      expect($ir.find("dl>dd>a").attr("property")).toEqual("dc:references");
    }).then(done);
  });

  it("should mark abstract using dc:abstract", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body:
        makeDefaultBody() + "<section id='abstract'>test abstract</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $abs = $("#abstract", doc);
      expect($abs.attr("property")).toEqual("dc:abstract");
      expect($abs.attr("typeof")).not.toBeDefined();
      expect($abs.attr("resource")).not.toBeDefined();
    }).then(done);
  });

  it("should add bibo to chapters", function(done) {
    var ops = {
      config: makeCustomConfig(),
      body: makeDefaultBody() + "<section id='chap'><h2>Chapter</h2></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $chap = $("#chap", doc);
      expect($chap.attr("typeof")).toEqual("bibo:Chapter");
      expect($chap.attr("resource")).toEqual("#chap");
      expect($chap.attr("property")).toMatch(/bibo:hasPart/);
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
