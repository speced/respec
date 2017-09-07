"use strict";
describe("Core — Definitions", function() {
  afterAll(flushIframes);
  it("processes definitions", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        "<section id='dfn'><dfn>text</dfn><a>text</a></section>",
    };
    const doc = await makeRSDoc(ops);
    var $sec = $("#dfn", doc);
    expect($sec.find("dfn").attr("id")).toEqual("dfn-text");
    expect($sec.find("a").attr("href")).toEqual("#dfn-text");
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
    const doc = await makeRSDoc(ops);
    var $sec = $("#dfn", doc);
    expect($sec.find("a:contains('outerCode')").contents()[0].nodeName).toEqual(
      "CODE"
    );
    expect($sec.find("a:contains('outerPre')").contents()[0].nodeName).toEqual(
      "CODE"
    );
    expect($sec.find("a:contains('innerCode')").contents()[0].nodeName).toEqual(
      "CODE"
    );
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
    const t2 = doc.querySelector("#t2");
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
          <dfn title='text|text 1|text  2|text 3 '>text</dfn>
          <a>text</a>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    var $sec = $("#dfn", doc);
    expect($sec.find("dfn").attr("data-lt")).toEqual(
      "text|text 1|text 2|text 3"
    );
    expect($sec.find("dfn").attr("data-dfn-type")).toEqual("dfn");
  });

  it("allows defining dfn-type", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section id='dfn'>
          <dfn dfn-type='myType'>text</dfn>
          <a>text</a>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    var $sec = $("#dfn", doc);
    expect($sec.find("dfn").attr("data-dfn-type")).toEqual("myType");
  });
});
