describe("Core - Figures", function() {
  "use strict";
  flushIframes();
  var sotd = "<section id=sotd><p>foo</p></section>";
  it("should have handled figures", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: $(
        "<section><section id='figs'><div class='figure'><pre title='PREFIG'>PRE</pre></div>" +
        "<img src='IMG' title='IMGTIT' class='figure'/></section><section id='tof'></section></section>" +
        sotd)
    };
    makeRSDoc(ops, function(doc) {
      var $figs = $("#figs", doc);
      var $tof = $("#tof", doc);
      expect($figs.find("figure").length).toEqual(2);
      expect($figs.find("figure figcaption").length).toEqual(2);
      expect($figs.find("figure figcaption").first().text()).toEqual("Fig. 1 PREFIG");
      expect($figs.find("figure figcaption").last().text()).toEqual("Fig. 2 IMGTIT");
      expect($tof.find("h3:contains('Table of Figures')").length).toEqual(1);
      expect($tof.find("ul li").length).toEqual(2);
      expect($tof.find("ul li a").first().text()).toEqual("Fig. 1 PREFIG");
      expect($tof.find("ul li a").last().text()).toEqual("Fig. 2 IMGTIT");
      done();
    });
  });
});
