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
  it("includes a URL and processes it as markdown", function(done) {
    var theTest = function(doc) {
      var h2 = doc.querySelector("#includes > h2");
      expect(h2).toBeTruthy();
      expect(h2.textContent).toEqual("1. PASS");
      expect(doc.querySelectorAll("*[data-include]").length).toBe(0);
    };
    //Data URI encoding of: "## PASS", which markdown converts to a H2 element.
    var testURL = "data:text/plain;charset=utf-8,%23%23%20PASS";
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section id='includes' data-include='"+ testURL +"'></section>",
    };
    ops.config.format = "markdown";
    makeRSDoc(ops, theTest)
      .then(done);
  });
});
