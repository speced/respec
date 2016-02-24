describe("Core - ID headers", function() {
  "use strict";
  flushIframes();
  it("should have set ID on header", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: "<section><p>BLAH</p><h6>FOO</h6></section>"
    };
    makeRSDoc(ops, function(doc) {
      var $s = $("section h2:contains('FOO')", doc);
      expect($s.attr("id")).toEqual("foo");
      done();
    });
  });
});
