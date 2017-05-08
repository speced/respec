"use strict";

function makeTest(uri) {
  return function(doc) {
    var canLink = doc.querySelector("link[rel='canonical']");
    expect(canLink.href).toEqual(uri);
  };
}

describe("W3C - SEO", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });

  it("should default to TR as canonical URI", function(done) {
    var test = makeTest("https://www.w3.org/TR/Foo/");
    makeRSDoc(makeStandardOps(), test).then(done);
  });

  it("should set the canonical URI to TR URI when so configured", function(
    done
  ) {
    var ops = makeStandardOps();
    var test = makeTest("https://www.w3.org/TR/Foo/");
    ops.config.canonicalURI = "TR";
    makeRSDoc(ops, test).then(done);
  });

  it("should set the canonical URI to editors draft when so configured", function(
    done
  ) {
    var ops = makeStandardOps();
    var test = makeTest("http://foo.com/");
    ops.config.canonicalURI = "edDraft";
    makeRSDoc(ops, test).then(done);
  });

  it("should not set any canonical URI if no shortname is defined", function(
    done
  ) {
    var ops = makeStandardOps();
    ops.config.shortName = undefined;
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelector("link[rel='canonical']")).toEqual(null);
    }).then(done);
  });

  it("should set the canonical URI if explicitly set", function(done) {
    var ops = makeStandardOps();
    var test = makeTest("http://example.com/");
    ops.config.canonicalURI = "http://example.com";
    makeRSDoc(ops, test).then(done);
  });
});
