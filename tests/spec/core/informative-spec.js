"use strict";
describe("Core — Informative", function() {
  afterAll(flushIframes);
  it("should process informative sections", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section class='informative'><h2>TITLE</h2></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $sec = $("div.informative, section.informative", doc);
      expect($sec.find("p").length).toEqual(1);
      expect($sec.find("p em").length).toEqual(1);
      expect($sec.find("p em").text()).toEqual(
        "This section is non-normative."
      );
    }).then(done);
  });
});
