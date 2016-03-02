"use strict";
describe("Core — Default Root Attribute", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  var body = $("<section id='sotd'><p>foo</p></section>");

  it("should apply en and ltr defaults", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: body,
    };
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector("html").lang).toEqual("en");
      expect(doc.querySelector("html").dir).toEqual("ltr");
    }).then(done);
  });

  it("should not override existing dir", function(done) {
    var ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        dir: "rtl"
      },
      body: body,
    };
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector("html").lang).toEqual("en");
      expect(doc.querySelector("html").dir).toEqual("rtl");
    }).then(done);
  });

  it("should not override existing lang and not set dir", function(done) {
    var ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "fr"
      },
      body: body,
    };
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector("html").lang).toEqual("fr");
      expect(doc.querySelector("html").dir).toEqual("");
    }).then(done);
  });
});
