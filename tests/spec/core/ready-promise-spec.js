"use strict";
describe("respecIsReady promise", function() {
  it("should settle when processing is done", function(done) {
    var ops = makeStandardOps();
    makeRSDoc(ops, function(doc) {
      var props = new Set(Object.getOwnPropertyNames(doc));
      expect(props.has("respecIsReady")).toBeTruthy();
      expect(doc.respecIsReady instanceof doc.defaultView.Promise).toBeTruthy();
      doc.respecIsReady.then(done);
    });
  });

  it("should resolve with the resulting respecConfig", function(done) {
    var ops = makeStandardOps();
    makeRSDoc(ops, function(doc) {
      doc.respecIsReady
        .then(function(resultingConfig) {
          // previousPublishDate gets changed to a Date object by ReSpec,
          // so not worth checking for equality.
          delete resultingConfig.previousPublishDate;
          delete ops.config.previousPublishDate;
          expect(resultingConfig).toEqual(jasmine.objectContaining(ops.config));
        })
        .then(done);
    });
  });
});
