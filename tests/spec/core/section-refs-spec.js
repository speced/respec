"use strict";
describe("Core - Section References", function() {
  afterAll(flushIframes);
  it("should have produced the section reference", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section id='ONE'><h2>ONE</h2></section><section id='TWO'><a href='#ONE' class='sectionRef'></a></section>",
    };
    makeRSDoc(ops, function(doc) {
      var $one = $("#ONE", doc);
      var $two = $("#TWO", doc);
      var tit = $one.find("> :first-child").text();
      expect($two.find("a").text()).toEqual("section " + tit);
    }).then(done);
  });
});
