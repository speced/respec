"use strict";
describe("Core — Include config as JSON", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  var ops;
  beforeAll(function(done){
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
  it("should have the same content for the config and the script's text", function(done) {
    makeRSDoc(ops, function(doc) {
      var $script = $("#initialUserConfig", doc);
      var jsonConfig = JSON.stringify(doc.defaultView.respecConfig.initialUserConfig, null, 2);
      expect($script[0].innerHTML).toEqual(jsonConfig);
    }).then(done);
  });
});
