describe("Core — Requirements", function() {
  "use strict";
  flushIframes();

  it("should process requirements", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: $("<p class='req' id='req-id'>REQ</p>")
    };
    makeRSDoc(ops, function(doc) {
      var $req = $("p.req", doc);
      var $a = $req.find("a");
      expect($req.text()).toEqual("Req. 1: REQ");
      expect($a.length).toEqual(1);
      expect($a.text()).toEqual("Req. 1");
      expect($a.attr("href")).toEqual("#req-id");
      done();
    });
  });

  it("should process requirement references", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: $("<a href='#req-id' class='reqRef'></a><a href='#foo' class='reqRef'></a><p class='req' id='req-id'>REQ</p>")
    };
    makeRSDoc(ops, function(doc) {
      var $refs = $("a.reqRef", doc);
      expect($refs.first().text()).toEqual("Req. 1");
      expect($refs.last().text()).toEqual("Req. not found 'foo'");
      done();
    });
  });
});
