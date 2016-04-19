"use strict";

describe("Core - Ui", function () {
  afterAll(function (done) {
    flushIframes();
    done();
  });

  it("shows and hides the UI", function (done) {
    makeRSDoc(makeStandardOps(), function (doc) {
      var ui = doc.defaultView.respecUI;
      var pillContainer = doc.querySelector("#respec-ui");
      // Initially, it should be showing
      expect(pillContainer.classList.contains("respec-hidden")).toBe(false);
      ui.show();
      // showing it doesn't change it from showing
      expect(pillContainer.classList.contains("respec-hidden")).toBe(false);
      ui.hide();
      expect(pillContainer.classList.contains("respec-hidden")).toBe(true);
      ui.show();
      expect(pillContainer.classList.contains("respec-hidden")).toBe(false);
    }).then(done);
  });
});
