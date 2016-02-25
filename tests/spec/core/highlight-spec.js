"use strict";
describe("Core — Highlight", function() {
  flushIframes();
  it("should process highlights", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section><pre class='example sh_javascript'>function () {\n  alert('foo');\n}</pre></section>"
    };
    makeRSDoc(ops, function(doc) {
      var $ex = $("pre.example", doc);
      expect($ex.hasClass("sh_javascript")).toBeFalsy();
      expect($ex.hasClass("highlight")).toBeTruthy();
      expect($ex.hasClass("prettyprint")).toBeTruthy();
      expect($ex.find("span.str").length).toBeGreaterThan(0);
      done();
    });
  });
});
