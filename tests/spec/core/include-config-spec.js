"use strict";
describe("Core — Include config as JSON", function() {
  afterAll(flushIframes);
  var ops;
  beforeAll(function(done) {
    ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    ops.config.publishDate = "1999-12-11";
    done();
  });
  it("should have a script tag with the correct attributes", function(done) {
    makeRSDoc(ops, function(doc) {
      var script = doc.getElementById("initialUserConfig");
      expect(script.tagName).toEqual("SCRIPT");
      expect(script.id).toEqual("initialUserConfig");
      expect(script.type).toEqual("application/json");
    }).then(done);
  });
  it("includes config options from query parameters", done => {
    makeRSDoc(
      ops,
      doc => {
        const conf = JSON.parse(
          doc.getElementById("initialUserConfig").textContent
        );
        expect(conf.foo).toEqual("bar");
        expect(conf.bar).toEqual(123);
        expect(conf.baz.length).toEqual(3);
        expect(conf.baz).toEqual([1, 2, 3]);
      },
      "spec/core/simple.html?foo=bar&bar=123&baz=[1,2,3]"
    ).then(done);
  });
  it("should have the same content for the config and the script's text", function(
    done
  ) {
    const expectedObj = Object.assign(makeBasicConfig(), {
      publishDate: "1999-12-11",
      publishISODate: "1999-12-11T00:00:00.000Z",
      generatedSubtitle: "Editor's Draft 11 December 1999",
    });
    const expected = JSON.stringify(expectedObj, null, 2);
    makeRSDoc(ops, function(doc) {
      var text = doc.getElementById("initialUserConfig").innerHTML;
      expect(text).toEqual(expected);
    }).then(done);
  });
});
