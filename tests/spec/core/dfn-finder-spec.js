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
});
