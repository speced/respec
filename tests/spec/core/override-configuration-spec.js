"use strict";
describe("Core — Override Configuration", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should override a simple string setting", function(done) {
    var url =
      "spec/core/simple.html?specStatus=RSCND;previousMaturity=REC;previousPublishDate=1994-12-12";
    var test = function(doc) {
      expect($(".head h2", doc).text()).toMatch(/W3C Rescinded Recommendation/);
      expect(
        doc.defaultView.respecConfig.previousPublishDate.getFullYear()
      ).toEqual(1994);
      expect(doc.defaultView.respecConfig.previousMaturity).toEqual("REC");
      done();
    };
    makeRSDoc(makeStandardOps(), test, url);
  });
  it("decodes URL key/values strings correctly", function(done) {
    var url =
      "spec/core/simple.html?additionalCopyrightHolders=Internet%20Engineering%20Task%20Force";
    var test = function(doc) {
      var copyrightText = doc.querySelector(".copyright").textContent;
      expect(copyrightText).toMatch(/Internet Engineering Task Force/);
      done();
    };
    makeRSDoc(makeStandardOps(), test, url);
  });
});
