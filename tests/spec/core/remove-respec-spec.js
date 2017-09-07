"use strict";
describe("Core — Remove ReSpec", function() {
  afterAll(flushIframes);
  it("should have removed all artifacts", function(done) {
    var ops = makeStandardOps();
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelectorAll(".remove").length).toEqual(0);
      expect(doc.querySelectorAll("script[data-requiremodule]").length).toEqual(
        0
      );
    }).then(done);
  });
});
