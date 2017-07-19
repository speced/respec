"use strict";
describe("Core — Lint href's matching id's", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("should warn about href pointing nowhere", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
          "<section>" +
          "<a href='#test'>foo</a>" +
          "</section>",
    };
    makeRSDoc(ops, function(doc) {
      var ui = doc.defaultView.respecUI;
      expect(ui.getErrors().length).toEqual(0);
      expect(ui.getWarnings().length).toEqual(1);
    }).then(done);
  });
  it("should not warn about href pointing somewhere", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
          "<section id='test'>" +
          "<a href='#test'>bar</a>" +
          "<a href='http://example.com/#test'>buz</a>" +
          "<a href='http://example.com'>qaz</a>" +
          "<a href='#'>fuzz</a>" +
          "<a href=''>fuzz</a>" +
          "<dfn>zus</dfn>" +
          "<a>zus</a>" +
          "</section>",
    };
    makeRSDoc(ops, function(doc) {
      var ui = doc.defaultView.respecUI;
      expect(ui.getErrors().length).toEqual(0);
      expect(ui.getWarnings().length).toEqual(0);
    }).then(done);
  });
});
