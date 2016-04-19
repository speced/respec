"use strict";
describe("W3C — Aliased References", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("aliased spec must be resolved", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section id='sample'><p>foo [[!FOOBARGLOP]] bar</p></section>"
    };
    ops.config.localBiblio = {
      "FOOBARGLOP": {
	"aliasOf": "BARBAR",
      },
      "BARBAR": {
	title: "The BARBAR Spec",
      }
    };
    makeRSDoc(ops, function(doc) {
      var $r = $("#bib-FOOBARGLOP + dd", doc);
      expect($r.length).toBeTruthy();
      expect($r.text()).toMatch(/BARBAR/);
    }).then(done);
  });
});
