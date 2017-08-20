"use strict";
describe("Core — IDL Index", () => {
  afterAll(flushIframes);
  it("generates an idl summary", done => {
    const body = `
      ${makeDefaultBody()}
      <section>
        <pre class=idl>
        interface Foo {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section>
        <pre class=idl>
        interface Bar {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
    `;
    const expectedIDL = `interface Foo {
    readonly attribute DOMString bar;
};
interface Bar {
    readonly attribute DOMString foo;
};\n`;
    var ops = {
      config: makeBasicConfig(),
      body,
    };
    makeRSDoc(ops, function(doc) {
      var idlIndex = doc.querySelector("#idl-index");
      expect(idlIndex).not.toBe(null);
      expect(idlIndex.querySelector("pre").textContent).toEqual(expectedIDL);
      var header = doc.querySelector("#idl-index > h2");
      expect(header).not.toBe(null);
      expect(header.textContent).toEqual("1. IDL Index");
    }).then(done);
  });
  it("allows custom content and header", done => {
    const body = `
      ${makeDefaultBody()}
      <section id="idl-index">
        <h2>PASS</h2>
        <p>Custom paragraph.</p>
      </section>
    `;
    var ops = {
      config: makeBasicConfig(),
      body,
    };
    makeRSDoc(ops, function(doc) {
      var idlIndex = doc.querySelector("#idl-index");
      expect(idlIndex).not.toBe(null);
      expect(idlIndex.querySelector("pre")).toEqual(null);
      var header = doc.querySelector("#idl-index > h2");
      expect(header).not.toBe(null);
      expect(header.textContent).toEqual("1. PASS");
      expect(doc.querySelectorAll("#idl-index > h2").length).toEqual(1);
    }).then(done);
  });
  it("doesn't include ids in the cloned indexed", done => {
    const body = `
      ${makeDefaultBody()}
      <pre class=idl>
      interface Test {

      };
      </pre>
      <section id="idl-index">
        <h2>PASS</h2>
        <p>Custom paragraph.</p>
      </section>
    `;
    var ops = {
      config: makeBasicConfig(),
      body,
    };
    makeRSDoc(ops, function(doc) {
      const pre = doc.querySelector("#idl-index pre");
      expect(pre.querySelectorAll("*[id]").length).toEqual(0);
    }).then(done);
  });
});
