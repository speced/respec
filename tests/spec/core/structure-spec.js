"use strict";
describe("Core - Structure", function() {
  var body = "";
  beforeAll(function(done){
    body = makeDefaultBody() +
      "<section class='introductory'><h2>INTRO</h2></section>" +
      "<section><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section><h2>FOUR</h2>" +
      "<section><h2>FIVE</h2><section><h2>SIX</h2></section></section></section></section></section></section>" +
      "<section class='notoc'><h2>Not in TOC</h2></section>" +
      "<section class='appendix'><h2>ONE</h2><section><h2>TWO</h2><section><h2>THREE</h2><section>" +
      "<h2>FOUR</h2><section><h2>FIVE</h2><section><h2>SIX</h2><p>[[DAHUT]]</p><p>[[!HTML5]]</p>" +
      "</section></section></section></section></section></section>";
    done();
  });

  it("should build a ToC with default values", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: body,
    };
    makeRSDoc(ops, function(doc) {
      // test default values
      var toc = doc.getElementById("toc");
      expect(toc.querySelector("h2").textContent).toEqual("Table of Contents");
      expect(toc.querySelector("ol > li a").textContent).toEqual("1. ONE");
      expect(toc.querySelector("h2 span").getAttribute("resource")).toEqual("xhv:heading");
      expect(toc.querySelector("h2 span").getAttribute("property")).toEqual("xhv:role");
      expect(toc.querySelectorAll("li").length).toEqual(15);
      expect(toc.querySelector("ol:first-of-type").childElementCount).toEqual(3);
      expect(toc.querySelector("a[href='#six']").textContent).toEqual("1.1.1.1.1.1 SIX");
      expect(toc.querySelector("li:first-child").nextElementSibling.querySelector("a").textContent).toEqual("A. ONE");
      expect(toc.querySelector("a[href='#six-1']").textContent).toEqual("A.1.1.1.1.1 SIX");
      // TODO: Move test to aria-spec
      // https://github.com/w3c/respec/issues/906
      expect(toc.querySelector("ol:first-of-type").getAttribute("role")).toEqual("directory");
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
      expect($toc.find("> ol > li").length).toEqual(6);
      expect($toc.find("li").length).toEqual(18);
      expect($toc.find("> ol > li a").first().text()).toEqual("Abstract");
      expect($toc.find("> ol > li a[href='#intro']").length).toEqual(1);
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
      expect($toc.find("> ol > li").length).toEqual(3);
      expect($toc.find("li").length).toEqual(11);
      expect($toc.find("> ol > li a").first().text()).toEqual("1. ONE");
      expect($toc.find("a[href='#four']").text()).toEqual("1.1.1.1 FOUR");
      expect($toc.find("> ol > li").first().next().find("> a").text()).toEqual("A. ONE");
      expect($toc.find("a[href='#four-1']").text()).toEqual("A.1.1.1 FOUR");
    }).then(done);
  });
});
