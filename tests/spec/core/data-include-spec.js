"use strict";
describe("Core — Data Include", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  // this does not test much, someone for whom this is
  // important should provide more tests
  it("should include an external file", function(done) {
    var url = "spec/core/includer.html";
;
    var theTest = function(doc) {
      var $sec = $("#includes", doc);
      expect($sec.find("p").length).toEqual(1);
      expect($sec.find("p").text()).toEqual("INCLUDED");
      expect($sec.find("div > p").length).toEqual(1);
      expect($sec.find("div > p").attr("data-include")).toBeFalsy();
    };
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
    }
    makeRSDoc(ops, theTest, url).then(done);
  });
});
