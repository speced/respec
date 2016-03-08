"use strict";
fdescribe("respectIsReady promise", function() {
  it("should settle when processing is done", function(done) {
    var ops = makeStandardOps();
    makeRSDoc(ops, function(doc) {
      var props = new Set(Object.getOwnPropertyNames(doc));
      expect(props.has("respectIsReady")).toBeTruthy();
      expect(doc.respectIsReady instanceof doc.defaultView.Promise).toBeTruthy();
      doc.respectIsReady.then(done);
    })
  });

  it("should resolve with the resulting respecConfig", function(done) {
    var ops = makeStandardOps();
    makeRSDoc(ops, function(doc) {
      doc.respectIsReady.then(function(resultingConfig) {
        expect(resultingConfig).toEqual(jasmine.objectContaining(ops.config));
      });
    }).then(done);
  });
});