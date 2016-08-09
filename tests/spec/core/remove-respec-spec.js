"use strict";
describe("Core — Remove ReSpec", function() {
  this.retries(2);
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should have removed all artifacts", function(done) {
    var ops = makeStandardOps();
    makeRSDoc(ops, function(doc) {
      expect(doc.querySelectorAll(".remove").length).toEqual(0);
      expect(doc.querySelectorAll("script[data-requiremodule]").length).toEqual(0);
    }).then(done);
  });
});
