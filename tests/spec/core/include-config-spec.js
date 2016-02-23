"use strict";
describe("Core — Include config as JSON", function() {
  flushIframes();
  var ops = {
    config: makeBasicConfig(),
    body: $("<section id='abstract'>no content</section><section id='sotd'><p>x</p></section>")
  };
  it("should have a script tag with the correct attributes", function(done) {
    makeRSDoc(ops, function(doc) {
      var script = doc.getElementById("initialUserConfig");
      expect(script.tagName).toEqual("SCRIPT");
      expect(script.id).toEqual("initialUserConfig");
      expect(script.type).toEqual("application/json");
      done();
    });
  });
  it("should have the same content for the config and the script's text", function(done) {
    makeRSDoc(ops, function(doc){
      var $script = $("#initialUserConfig", doc);
      var jsonConfig = JSON.stringify(doc.defaultView.respecConfig.initialUserConfig, null, 2);
      expect($script[0].innerHTML).toEqual(jsonConfig);
      done();
    });
  });
});
