/*globals flushIframes, makeRSDoc*/
describe("Core — Default Root Attribute", function() {
  "use strict";
  flushIframes();
  var body = $("<section id='sotd'><p>foo</p></section>");

  it("should apply en and ltr defaults", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: body,
    };
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector("html").lang).toEqual("en");
      expect(doc.querySelector("html").dir).toEqual("ltr");
      done();
    });
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
      done();
    });
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
      done();
    });
  });
});
