"use strict";
describe("Core — Definitions", () => {
  afterAll(flushIframes);
  it("processes definitions", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section id='dfn'><dfn>text</dfn><a>text</a></section>",
    };
    const doc = await makeRSDoc(ops);
    const sec = doc.querySelector("#dfn");
    expect(sec.querySelector("dfn").id).toEqual("dfn-text");
    expect(sec.querySelector("a").getAttribute("href")).toEqual("#dfn-text");
  });

  it("makes links <code> when their definitions are <code>", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section id='dfn'>
          <code><dfn>outerCode</dfn></code>
          <pre><dfn>outerPre</dfn></pre>
          <dfn><code>innerCode</code></dfn>
          <dfn><code>partial</code> inner code</dfn>
          <a>outerCode</a>
          <a>outerPre</a>
          <a>innerCode</a>
          <a>partial inner code</a>
        </section>`,
    };

    const getNodeArray = NodeList => Array.prototype.slice.call(NodeList);

    const doc = await makeRSDoc(ops);
    const $sec = $("#dfn", doc);
    const sec = doc.querySelector("#dfn");
    const findAnchorChild = (
      string,
      anchorArray = getNodeArray(sec.querySelectorAll("a"))
    ) =>
      anchorArray.reduce((result, anchor) => {
        const innerFind = getNodeArray(anchor.children).filter(element =>
          element.textContent.includes(string)
        )[0];
        if (innerFind !== undefined) result.push(innerFind);
        else if (anchor.textContent.includes(string)) result.push(anchor);
        return result;
      }, []);

    expect(findAnchorChild("outerCode")[0].nodeName).toEqual("CODE");
    expect(findAnchorChild("outerPre")[0].nodeName).toEqual("CODE");
    expect(findAnchorChild("innerCode")[0].nodeName).toEqual("CODE");
    expect($sec.find("a:contains('partial')").contents()[0].nodeName).toEqual(
      "#text"
    );
  });

  it("links <code> for IDL, but not when text doesn't match", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `
          <pre class="idl">
            interface Test {};
          </pre>
          <p id="t1"><a>Test</a>
          <p id="t2"><a data-lt="Test">not wrapped in code</a>
      `,
    };
    const doc = await makeRSDoc(ops);
    const code = doc.querySelector("#t1 code");
    expect(code.textContent).toEqual("Test");
    const t2 = doc.getElementById("t2");
    expect(t2.querySelector("code")).toEqual(null);
    expect(t2.querySelector("a").textContent).toEqual("not wrapped in code");
    expect(t2.querySelector("a").getAttribute("href")).toEqual("#idl-def-test");
  });

  it("processes aliases", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section id='dfn'>
          <dfn data-lt='text|text 1|text  2|text 3 '>text</dfn>
          <a>text</a>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const dfn = doc.querySelector("dfn[data-lt]");
    expect(dfn.dataset.lt).toEqual("text|text 1|text 2|text 3");
    expect(dfn.dataset.dfnType).toEqual("dfn");
  });
});
