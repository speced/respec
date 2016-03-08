"use strict";
describe("Core — Best Practices", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should process examples", function(done) {
    var bodyText = "<section><span class='practicelab'>BP1</span>";
    bodyText += "<span class='practicelab'>BP2</span>";
    bodyText += "<section id='bp-summary'></section>";
    bodyText += "</section>";
    bodyText += "<section id='sotd'><p>foo</p></section>";
    var ops = {
      config: makeBasicConfig(),
      body: bodyText,
    };
    makeRSDoc(ops, function(doc) {
      var pls = doc.body.querySelectorAll("span.practicelab");
      var $bps = $("#bp-summary", doc);
      expect(pls.item(0).textContent).toEqual("Best Practice 1: BP1");
      expect(pls.item(1).textContent).toEqual("Best Practice 2: BP2");
      expect($bps.find("h2, h3, h4, h5, h6").text()).toEqual("Best Practices Summary");
      expect($bps.find("ul li").length).toEqual(2);
    }).then(done);
  });
});
