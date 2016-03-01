"use strict";
describe("Core — Style", function() {
  flushIframes();
  it("should have included a style element", function(done) {
    makeRSDoc(makeStandardOps(), function(doc) {
      var $s = $("style", doc);
      expect($s.length).toBeTruthy();
      expect($s.text()).toMatch(/rfc2119/);
      done();
    });
  });
});
