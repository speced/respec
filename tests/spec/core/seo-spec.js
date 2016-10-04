"use strict";

var testCanonical = function(uri) {
    return function(doc) {
      var $canLink = $("link[rel='canonical']", doc);
      expect($canLink.attr("href")).toEqual(uri);
    };
};

describe("Core - SEO", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should default to TR as canonical URI", function(done) {
    makeRSDoc(makeStandardOps(), testCanonical("https://www.w3.org/TR/Foo/"))
          .then(done);
  });
  it("should set the canonical URI to TR URI when so configured",
     function(done) {
    var ops = makeStandardOps();
    ops.config.canonicalURI = "TR";
    makeRSDoc(ops, testCanonical("https://www.w3.org/TR/Foo/")).then(done);
  });
  it("should set the canonical URI to editors draft when so configured",
     function(done) {
    var ops = makeStandardOps();
    ops.config.canonicalURI = "edDraft";
    makeRSDoc(ops, testCanonical("http://foo.com")).then(done);
  });
  it("should not set any canonical URI if no shortname is defined",
     function(done) {
    var ops = makeStandardOps();
    ops.config.shortName = undefined;
    makeRSDoc(ops, function(doc) {
        expect($("link[rel='canonical']", doc).length).toEqual(0);
    }).then(done);
  });
  it("should set the canonical URI if explicitly set",
     function(done) {
    var ops = makeStandardOps();
    ops.config.canonicalURI = "http://example.com";
    makeRSDoc(ops, testCanonical("http://example.com")).then(done);
  });
});
