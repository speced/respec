"use strict";
describe("Core — Definitions", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should process definitions", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + "<section id='dfn'><dfn>text</dfn><a>text</a></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $sec = $("#dfn", doc);
      expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
      expect($sec.find("a").attr("href")).toEqual("#dfn-text");
    }).then(done);
  });

  it("should make links <code> when their definitions are <code>", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section id='dfn'>" +
        "<code><dfn>outerCode</dfn></code>" +
        "<pre><dfn>outerPre</dfn></pre>" +
        "<dfn><code>innerCode</code></dfn>" +
        "<dfn><code>partial</code> inner code</dfn>" +
        "<a>outerCode</a>" +
        "<a>outerPre</a>" +
        "<a>innerCode</a>" +
        "<a>partial inner code</a>" +
        "</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $sec = $("#dfn", doc);
      expect($sec.find("a:contains('outerCode')").contents()[0].nodeName).toEqual("CODE");
      expect($sec.find("a:contains('outerPre')").contents()[0].nodeName).toEqual("CODE");
      expect($sec.find("a:contains('innerCode')").contents()[0].nodeName).toEqual("CODE");
      expect($sec.find("a:contains('partial')").contents()[0].nodeName).toEqual("#text");
    }).then(done);
  });

  it("should process aliases", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section id='dfn'>" +
        "  <dfn title='text|text 1|text  2|text 3 '>text</dfn>" +
        "  <a>text</a>" +
        "</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $sec = $("#dfn", doc);
      expect($sec.find("dfn").attr("data-lt")).toEqual("text|text 1|text 2|text 3");
      expect($sec.find("dfn").attr("data-dfn-type")).toEqual("dfn");
    }).then(done);
  });

  it("should allow defined dfn-type ", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section™¡™ id='dfn'>" +
        "<dfn dfn-type='myType'>text</dfn>" +
        "<a>text</a>" +
        "</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $sec = $("#dfn", doc);
      expect($sec.find("dfn").attr("data-dfn-type")).toEqual("myType");
    }).then(done);
  });
});
