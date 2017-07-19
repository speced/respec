"use strict";
describe("Core — Highlight", function() {
  afterAll(done => {
    flushIframes();
    done();
  });

  it("shouldn't highlight idl blocks", done => {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
          `
        <section><pre class=idl>
          [Constructor]interface Dahut : Mammal {
            const unsigned short DEXTROGYROUS = 1;
            Dahut turnAround(float angle, boolean fall);
          };</pre>
        </section>`,
    };
    makeRSDoc(ops, function(doc) {
      var pre = doc.querySelector("pre");
      expect(pre.classList.contains("hljs")).toBeFalsy();
      expect(pre.querySelectorAll("span[class^=hljs-]").length).toBe(0);
    }).then(done);
  });

  it("should automatically highlight", done => {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
          `<section>
          <pre class=example>
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    makeRSDoc(ops, function(doc) {
      var pre = doc.querySelector("div.example pre");
      expect(pre.classList.contains("hljs")).toBeTruthy();
      expect(pre.querySelectorAll("span[class^=hljs-]").length).toBeGreaterThan(
        0
      );
    }).then(done);
  });

  it("shouldn't highlight pre elements when told not to", done => {
    var ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
          `<section>
          <pre class='nohighlight example'>
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    makeRSDoc(ops, function(doc) {
      var pre = doc.querySelector("div.example pre");
      expect(pre.classList.contains("nohighlight")).toBeTruthy();
      expect(pre.querySelectorAll("span[class^=hljs-]").length).toBe(0);
    }).then(done);
  });

  it("should respect the noHighlightCSS by not highlighting anything", done => {
    var ops = {
      config: Object.assign(makeBasicConfig(), { noHighlightCSS: true }),
      body:
        makeDefaultBody() +
          `<section>
          <pre id="test">
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    makeRSDoc(ops, function(doc) {
      var pre = doc.querySelector("#test");
      expect(pre.querySelectorAll("span[class^=hljs-]").length).toBe(0);
    }).then(done);
  });
});
