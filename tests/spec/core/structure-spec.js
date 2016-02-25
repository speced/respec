"use strict";
describe("Core - Structure", function() {
  var body = makeDefaultBody() +
    "<section class='introductory'><h2>INTRO</h2></section>" +
    "<section><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section><h2>FOUR</h2>" +
    "<section><h2>FIVE</h2><section><h2>SIX</h2></section></section></section></section></section></section>" +
    "<section class='notoc'><h2>Not in TOC</h2></section>" +
    "<section class='appendix'><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section>" +
    "<h2>FOUR</h2><section><h2>FIVE</h2><section><h2>SIX</h2><p>[[DAHUT]]</p><p>[[!HTML5]]</p></section></section></section>" +
    "</section></section></section>";
  it("should build a ToC with default values", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: body,
    };
    makeRSDoc(ops, function(doc) {
      // test default values
      var $toc = $("#toc", doc);
      expect($toc.find("h2").text()).toEqual("Table of Contents");
      expect($toc.find("h2 span").attr('resource')).toEqual('xhv:heading');
      expect($toc.find("h2 span").attr('property')).toEqual('xhv:role');
      expect($toc.find("ul:first").attr('role')).toEqual('directory');
      expect($toc.find("> ul > li").length).toEqual(3);
      expect($toc.find("li").length).toEqual(15);
      expect($toc.find("> ul > li a").first().text()).toEqual("1. ONE");
      expect($toc.find("a[href='#six']").text()).toEqual("1.1.1.1.1.1 SIX");
      expect($toc.find("> ul > li").first().next().find("> a").text()).toEqual("A. ONE");
      expect($toc.find("a[href='#six-1']").text()).toEqual("A.1.1.1.1.1 SIX");
    }).then(done);
  });

  it("should not build a ToC with noTOC", function(done) {
    // test with noTOC
    var ops = {
      config: makeBasicConfig(),
      body: body,
    };
    ops.config.noTOC = true;
    makeRSDoc(ops, function(doc) {
      expect(doc.getElementById("toc")).toEqual(null);
    }).then(done);
  });

  it("should include introductory sections in ToC with tocIntroductory", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: body,
    };
    ops.config.tocIntroductory = true;
    makeRSDoc(ops, function(doc) {
      var $toc = $("#toc", doc);
      expect($toc.find("h2").text()).toEqual("Table of Contents");
      expect($toc.find("> ul > li").length).toEqual(6);
      expect($toc.find("li").length).toEqual(18);
      expect($toc.find("> ul > li a").first().text()).toEqual("Abstract");
      expect($toc.find("> ul > li a[href='#intro']").length).toEqual(1);
    }).then(done);
  });

  it("should limit ToC depth with maxTocLevel", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: body,
    };
    ops.config.maxTocLevel = 4;
    makeRSDoc(ops, function(doc) {
      var $toc = $("#toc", doc);
      expect($toc.find("h2").text()).toEqual("Table of Contents");
      expect($toc.find("> ul > li").length).toEqual(3);
      expect($toc.find("li").length).toEqual(11);
      expect($toc.find("> ul > li a").first().text()).toEqual("1. ONE");
      expect($toc.find("a[href='#four']").text()).toEqual("1.1.1.1 FOUR");
      expect($toc.find("> ul > li").first().next().find("> a").text()).toEqual("A. ONE");
      expect($toc.find("a[href='#four-1']").text()).toEqual("A.1.1.1 FOUR");
    }).then(done);
  });
});
