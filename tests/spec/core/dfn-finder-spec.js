"use strict";
describe("Core — Definition finder", () => {
  afterAll(flushIframes);

  it("shouldn't duplicate data-lt items", async () => {
    const bodyText = `
      <section>
        <h2>Test section</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Foo {
            void bar();
          };
        </pre>
        <dfn data-dfn-for="Foo" data-lt="bar()">bar</dfn>
      </section>`;
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + bodyText,
    };
    const doc = await makeRSDoc(ops);
    const [dfn] = doc.getElementsByTagName("dfn");
    expect(dfn.dataset.lt).toBe("bar()|bar|foo.bar()|foo.bar");
    expect(dfn.classList.contains("respec-offending-element")).toBeFalsy();
  });

  it("should enumerate operation alternative names", async () => {
    const bodyText = `
      <section data-dfn-for="Foo">
        <h2>Test section</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Foo {
            void bar();
            void baz();
          };
        </pre>
        <dfn id="bar">bar</dfn>
        <dfn id="baz">baz()</dfn>
      </section>`;
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + bodyText,
    };
    const doc = await makeRSDoc(ops);
    const bar = doc.getElementById("bar");
    expect(bar.dataset.lt).toBe("foo.bar()|foo.bar|bar()|bar");
    const baz = doc.getElementById("baz");
    expect(baz.dataset.lt).toBe("foo.baz()|foo.baz|baz()|baz");
  });
});
