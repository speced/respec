"use strict";
describe("Core — Highlight", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });

  it("should automatically highlight", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section><pre class=example>function () {\n  alert('foo');\n}</pre></section>"
    };
    makeRSDoc(ops, function(doc) {
      var pre = doc.querySelector("div.example pre");
      expect(pre.classList.contains("hljs")).toBeTruthy();
      expect(pre.querySelectorAll("span[class^=hljs-]").length).toBeGreaterThan(0);
    }).then(done);
  });

  it("shouldn't highlight pre elements when told not to", function(done) {
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() +
        "<section><pre class='nohighlight example'>function () {\n  alert('foo');\n}</pre></section>"
    };
    makeRSDoc(ops, function(doc) {
      var pre = doc.querySelector("div.example pre");
      expect(pre.classList.contains("nohighlight")).toBeTruthy();
      expect(pre.querySelectorAll("span[class^=hljs-]").length).toBe(0);
    }).then(done);
  });

  it("should respect the noHighlightCSS by not highlighting anything", function(done) {
    var ops = {
      config: Object.assign(makeBasicConfig(), { noHighlightCSS: true }),
      body: makeDefaultBody() +
        "<section><pre id=test>function () {\n  alert('foo');\n}</pre></section>"
    };
    makeRSDoc(ops, function(doc) {
      var pre = doc.querySelector("#test");
      expect(pre.querySelectorAll("span[class^=hljs-]").length).toBe(0);
    }).then(done);
  });

});
