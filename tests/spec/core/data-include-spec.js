"use strict";
describe("Core — Data Include", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  // this does not test much, someone for whom this is
  // important should provide more tests
  it("should include an external file", function(done) {
    var url = "/tests/spec/core/includer.html";
    var theTest = function(doc) {
      var $sec = $("#includes", doc);
      expect($sec.find("p").length).toEqual(1);
      expect($sec.find("dfn").text()).toEqual("INCLUDED");
      expect($sec.find("div > p").length).toEqual(1);
      expect($sec.find("div").attr("data-include")).toBeFalsy();
      expect($sec.find("dfn").attr("id")).toEqual("dfn-included");
    };
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    };
    makeRSDoc(ops, theTest, url).then(done);
  });
});
