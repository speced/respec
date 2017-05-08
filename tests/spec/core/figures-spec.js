"use strict";
describe("Core - Figures", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  var ops = {
    config: makeBasicConfig(),
    body: makeDefaultBody() +
      "<section>" +
      " <section id='figs'>" +
      "   <div class='figure'><pre title='PREFIG'>PRE</pre></div>" +
      "   <img src='IMG' title='IMGTIT' class='figure'>" +
      " </section>" +
      "<section id='tof'></section>" +
      "</section>"
  };
  it("generates captions for figures", function(done) {
    makeRSDoc(ops, function(doc) {
      var figs = doc.getElementById("figs");
      var captions = figs.querySelectorAll("figure figcaption");
      expect(figs.querySelectorAll("figure").length).toEqual(2);
      expect(captions.length).toEqual(2);
      expect(captions.item(0).textContent).toEqual("Fig. 1 PREFIG");
      expect(captions.item(1).textContent).toEqual("Fig. 2 IMGTIT");
    }).then(done);
  });
  it("generates table of figures", function(done) {
    makeRSDoc(ops, function(doc) {
      var tof = doc.getElementById("tof");
      var tofHeader = tof.querySelector("h3");
      var tofItems = tof.querySelectorAll("ul li");
      var figLinks = tof.querySelectorAll("ul li a");
      expect(tofHeader).toBeTruthy();
      expect(tofHeader.textContent).toEqual("Table of Figures");
      expect(tofItems.length).toEqual(2);
      expect(figLinks.item(0).textContent).toEqual("Fig. 1 PREFIG");
      expect(figLinks.item(1).textContent).toEqual("Fig. 2 IMGTIT");
    }).then(done);
  });
});
