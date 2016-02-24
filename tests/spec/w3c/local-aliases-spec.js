describe("W3C — Aliased References", function() {
  "use strict";
  flushIframes();
  it("aliased spec must be resolved", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + "<section id='sample'><p>foo [[!FOOBARGLOP]] bar</p></section>"
    };
    ops.config.localBiblio = {
      "FOOBARGLOP": {
        "aliasOf": "RFC2119"
      }
    }
    makeRSDoc(ops, function(doc) {
      var $r = $("#bib-FOOBARGLOP + dd", doc);
      expect($r.length).toBeTruthy();
      expect($r.text()).toMatch(/2119/);
      done();
    });
  });
});
