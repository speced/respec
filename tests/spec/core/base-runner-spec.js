"use strict";
describe("Core — Base runner", function() {
  function performTest(doc) {
    var props = new Set(Object.getOwnPropertyNames(doc));
    expect(props.has("respectIsReady")).toBeTruthy();
    expect(doc.respectIsReady instanceof doc.defaultView.Promise).toBeTruthy();
    return doc.respectIsReady;
  }
  describe("respectIsReady promise", function(){
    it("should settle when processing is done", function(done) {
      var iframe = document.createElement("iframe");
      document.body.appendChild(iframe);
      iframe.src = "about:blank";
      iframe.addEventListener("load", function() {
        var doc = iframe.contentDocument;
        doc.body.innerHTML = makeDefaultBody() + "<section id=abstract>...</section>";
        doc.defaultView.respecConfig = makeBasicConfig();
        var requirejsLoader = doc.createElement("script");
        requirejsLoader.dataset.main = "/js/profile-w3c-common";
        requirejsLoader.src = "/node_modules/requirejs/require.js";
        doc.head.appendChild(requirejsLoader);
        // We are going to observe for the "profile-w3c-common" script
        // as it injects the respectIsReady property
        var observer = new MutationObserver(function() {
          var elem = doc.head.querySelector("script[src*='/js/profile-w3c-common']");
          if (!elem) {
            return;
          }
          elem.addEventListener("load", function() {
            // spin the event loop for a bit, as we can't actually capture
            // when a script is actually "ready". However, this is short enough
            // to have the script injected and run, but not long enough
            // for everthing else to complete (promise won't have settled).
            setTimeout(function() {
              var testPromise = performTest(doc);
              testPromise.then(function() {
                iframe.remove();
                done();
              });
          });
          observer.disconnect();
        });
        observer.observe(doc.head, {
          childList: true
        });
      });
    });

    it("should resolve with the resulting respecConfig", function(done) {
      var ops = makeStandardOps();
      makeRSDoc(ops, function(doc) {
        doc.respectIsReady.then(function(resultingConfig){
          expect(resultingConfig).toEqual(jasmine.objectContaining(ops.config));
        });
      }).then(done);
    });
  });
});
