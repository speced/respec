describe("Core — Remove ReSpec", function() {
  "use strict";
  flushIframes();
  it("should have removed all artefacts", function(done) {
    var ops = makeStandardOps();
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelectorAll(".remove").length).toEqual(0);
      expect(doc.querySelectorAll("script[data-requiremodule]").length).toEqual(0);
      done();
    });
  });
});
