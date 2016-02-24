describe("W3C — Abstract", function() {
  "use strict";
  flushIframes();
  it("should include an h2, set the class, and wrap the content", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody(),
      abstract: $("<section id='abstract'>test abstract</section>")
    };
    makeRSDoc(ops, function(doc) {
      var $abs = $("#abstract", doc);
      expect($abs.find("h2").length).toBeTruthy();
      expect($abs.find("h2").text()).toEqual("Abstract");
      expect($abs.find("h2 span").attr('resource')).toEqual('xhv:heading');
      expect($abs.find("h2 span").attr('property')).toEqual('xhv:role');
      expect($abs.hasClass("introductory")).toBeTruthy();
      expect($abs.find("p").length).toBeTruthy();
      done();
    });
  });
  // XXX we should also test that an error is sent when absent
});
