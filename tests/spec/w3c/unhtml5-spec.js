describe("W3C - un-HTML5", function() {
  "use strict";
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should have renamed all the HTML5 elements to div.elName", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: "<section><figure><figcaption></figcaption></figure></section>"
    };
    makeRSDoc(ops, function(doc) {
      expect($("section", doc).length).toEqual(0);
      expect($("div.section", doc).length).toBeGreaterThan(0);
      expect($("figure", doc).length).toEqual(0);
      expect($("div.figure", doc).length).toBeGreaterThan(0);
      expect($("figcaption", doc).length).toEqual(0);
      expect($("div.figcaption", doc).length).toBeGreaterThan(0);
    }).then(done);
  });
});
