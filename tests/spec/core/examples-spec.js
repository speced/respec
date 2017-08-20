"use strict";
describe("Core — Examples", function() {
  afterAll(flushIframes);
  it("should process examples", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
          "<section>" +
          "<pre class='example' title='EX'>\n  {\n    CONTENT\n  }\n  </pre>" +
          "</section>",
    };
    makeRSDoc(ops, function(doc) {
      var $ex = $("div.example pre", doc);
      var $div = $ex.parent("div");
      expect($div.hasClass("example")).toBeTruthy();
      expect($div.find("div.example-title").length).toEqual(1);
      expect($div.find("div.example-title").text()).toEqual("Example 1: EX");
      expect($ex.attr("title")).toBeUndefined();
      expect($ex.text()).toEqual("{\n  CONTENT\n}");
    }).then(done);
  });
});
