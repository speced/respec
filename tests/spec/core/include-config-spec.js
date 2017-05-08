"use strict";
describe("Core — Include config as JSON", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  var ops;
  beforeAll(function(done) {
    ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
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
  it("should have the same content for the config and the script's text", function(
    done
  ) {
    const expected = JSON.stringify(makeBasicConfig(), null, 2);
    makeRSDoc(ops, function(doc) {
      var text = doc.getElementById("initialUserConfig").innerHTML;
      expect(text).toEqual(expected);
    }).then(done);
  });
});
