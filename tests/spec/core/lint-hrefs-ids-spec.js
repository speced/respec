"use strict";
describe("Core — Lint href's matching id's", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("warns if can't match a fragment identifier to an id in the document", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() + `
          <section>
            <a href='#test'>foo</a>
          </section>
        `,
    };
    makeRSDoc(ops, function(doc) {
      var ui = doc.defaultView.respecUI;
      expect(ui.getErrors()).toEqual([]);
      expect(ui.getWarnings().length).toEqual(1);
    }).then(done);
  });
  it("does not warn if fragment identifier matches an id in the document", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() + `
          <section id='test'></section>
          <section id='[[Type]]'></section>
          <section id='%5B%5BValue%5D%5D'></section>
          <section>
            <a href='#test'>bar</a>
            <a href='#[[Type]]'>qaz</a>
            <a href='#%5B%5BType%5D%5D'>qaz</a>
            <a href='#%5B%5BValue%5D%5D'>qaz</a>
            <a href='http://example.com/#test'>buz</a>
            <a href='http://example.com'>qaz</a>
            <a href='#'>fuzz</a>
            <a href=''>fuzz</a>
            <dfn>zus</dfn>
            <a>zus</a>
          </section>
        `,
    };
    makeRSDoc(ops, function(doc) {
      var ui = doc.defaultView.respecUI;
      expect(ui.getErrors()).toEqual([]);
      expect(ui.getWarnings()).toEqual([]);
    }).then(done);
  });
});
