"use strict";
describe("Core — Override Configuration", function() {
  flushIframes();
  it("should override a simple string setting", function(done) {
    var url = "spec/core/simple.html?specStatus=RSCND;previousMaturity=REC;previousPublishDate=1994-12-12";
    var test = function(doc) {
      expect($(".head h2", doc).text()).toMatch(/W3C Rescinded Recommendation/);
      expect(doc.defaultView.respecConfig.previousPublishDate.getFullYear()).toEqual(1994);
      expect(doc.defaultView.respecConfig.previousMaturity).toEqual("REC");
      done();
    };
    makeRSDoc(makeStandardOps(), test, url);
  });
});
