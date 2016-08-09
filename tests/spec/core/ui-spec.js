"use strict";

describe("Core - Ui", function () {
  this.retries(2);
  afterAll(function (done) {
    flushIframes();
    done();
  });

  it("shows and hides the UI", function (done) {
    makeRSDoc(makeStandardOps(), function (doc) {
      var ui = doc.defaultView.respecUI;
      var pillContainer = doc.querySelector("#respec-ui");
      ui.show();
      // showing it doesn't change it from showing
      expect(pillContainer.classList.contains("respec-hidden")).toBe(false);
      ui.hide();
      expect(pillContainer.classList.contains("respec-hidden")).toBe(true);
      ui.show();
      expect(pillContainer.classList.contains("respec-hidden")).toBe(false);
    }).then(done);
  });

  it("hides the UI when document is clicked", function (done) {
    makeRSDoc(makeStandardOps(), function (doc) {
      var menu = doc.querySelector("#respec-menu");
      expect(window.getComputedStyle(menu).display).toEqual("none");
      doc.querySelector("#respec-pill").click();
      // spin the event loop
      new Promise(function(resolve){
        setTimeout(function(){
          expect(window.getComputedStyle(menu).display).toEqual("block");
          doc.body.click();
          resolve();
        }, 500);
      })
      // Allow time to fade in
      .then(function(){
        setTimeout(function(){
          expect(window.getComputedStyle(menu).display).toEqual("none");
          done();
        }, 500);
      });
      // give it time to fade out
    }, null, "display: block");
  });
});
