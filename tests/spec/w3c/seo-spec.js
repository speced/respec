"use strict";

function makeTest(uri) {
  return doc => {
    const canLink = doc.querySelector("link[rel='canonical']");
    expect(canLink.href).toEqual(uri);
  };
}
describe("W3C - SEO", () => {
  afterAll(flushIframes);

  it("defaults to TR as canonical URI", done => {
    const test = makeTest("https://www.w3.org/TR/Foo/");
    makeRSDoc(makeStandardOps(), test).then(done);
  });

  it("sets the canonical URI to TR URI when so configured", done => {
    const test = makeTest("https://www.w3.org/TR/Foo/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "TR";
    makeRSDoc(ops, test).then(done);
  });

  it("sets the canonical URI to editors draft when so configured", done => {
    const test = makeTest("https://foo.com/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "edDraft";
    makeRSDoc(ops, test).then(done);
  });

  it("shouldn't set any canonical URI if no shortname is defined", done => {
    const ops = makeStandardOps();
    ops.config.shortName = undefined;
    makeRSDoc(ops, doc => {
      expect(doc.querySelector("link[rel='canonical']")).toEqual(null);
    }).then(done);
  });

  it("sets the canonical URI if explicitly set", done => {
    const test = makeTest("https://example.com/");
    const ops = makeStandardOps();
    ops.config.canonicalURI = "https://example.com";
    makeRSDoc(ops, test).then(done);
  });
});
