/*globals flushIframes, makeRSDoc*/
"use strict";
describe("Core — Default Root Attribute", function() {
  flushIframes();
  var basicConfig = {
    editors: [{
      name: "Robin Berjon"
    }],
    specStatus: "ED",
    edDraftURI: "http://foo.com",
    shortName: "Foo",
    prevVersion: 'FPWD',
    previousMaturity: "WD",
    previousPublishDate: "2013-12-17",
  };
  var body = $("<section id='sotd'><p>foo</p></section>");

  it("should apply en and ltr defaults", function(done) {
    var ops = {
      config: basicConfig,
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
      config: basicConfig,
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
      config: basicConfig,
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
