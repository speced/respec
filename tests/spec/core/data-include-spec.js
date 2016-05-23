"use strict";
describe("Core — Data Include", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  // this does not test much, someone for whom this is
  // important should provide more tests
  it("should include an external file and remove the data-include attr", function(done) {
    var url = "/tests/spec/core/includer.html";
    var theTest = function(doc) {
      var p = doc.querySelector("#includes > div > p");
      expect(p).toBeTruthy();
      expect(p.textContent).toEqual("INCLUDED");
      expect(doc.querySelectorAll("*[data-include]").length).toBe(0);
    };
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    makeRSDoc(ops, theTest, url)
      .then(done);
  });
});
