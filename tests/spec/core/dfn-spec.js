"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Definitions", () => {
  afterAll(flushIframes);
  it("processes definitions", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='dfn'><dfn>text</dfn><a>text</a></section>`,
    };
    const doc = await makeRSDoc(ops);
    const sec = doc.getElementById("dfn");
    expect(sec.querySelector("dfn").id).toBe("dfn-text");
    expect(sec.querySelector("a").getAttribute("href")).toBe("#dfn-text");
  });

  it("makes links <code> when their definitions are <code>", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='dfn'>
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
    const sec = doc.getElementById("dfn");
    const anchors = [...sec.children].filter(node => node.localName === "a");
    expect(anchors[0].childNodes[0].textContent).toBe("outerCode");
    expect(anchors[0].childNodes[0].nodeName).toBe("CODE");
    expect(anchors[1].childNodes[0].textContent).toBe("outerPre");
    expect(anchors[1].childNodes[0].nodeName).toBe("CODE");
    expect(anchors[2].childNodes[0].textContent).toBe("innerCode");
    expect(anchors[2].childNodes[0].nodeName).toBe("CODE");
    expect(anchors[3].childNodes[0].textContent).toBe("partial inner code");
    expect(anchors[3].childNodes[0].nodeName).toBe("#text");
  });

  it("doesn't add redundant lt when not needed", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
      <section>
        <dfn id="test1">test</dfn>
        <dfn id="test2" data-lt="I'm an lt">test</dfn>
      </section>`,
    };
    const doc = await makeRSDoc(ops);

    const test1 = doc.getElementById("test1");
    expect(Object.keys(test1.dataset)).not.toContain("lt");

    const test2 = doc.getElementById("test2");
    expect(test2.dataset.lt).toBeTruthy();
    expect(test2.dataset.lt).toBe("I'm an lt|test");
  });

  it("links <code> for IDL, but not when text doesn't match", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
          <pre class="idl">
            interface Test {};
          </pre>
          <p id="t1"><a>Test</a>
          <p id="t2"><a data-lt="Test">not wrapped in code</a>
      `,
    };
    const doc = await makeRSDoc(ops);
    const code = doc.querySelector("#t1 code");
    expect(code.textContent).toBe("Test");
    const t2 = doc.getElementById("t2");
    expect(t2.querySelector("code")).toBe(null);
    expect(t2.querySelector("a").textContent).toBe("not wrapped in code");
    expect(t2.querySelector("a").getAttribute("href")).toBe("#dom-test");
  });

  it("processes aliases", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='dfn'>
          <dfn data-lt='text|text 1|text  2|text 3 '>text</dfn>
          <a>text</a>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const dfn = doc.querySelector("dfn[data-lt]");
    expect(dfn.dataset.lt).toBe("text|text 1|text 2|text 3");
  });

  it("allows linking via data-local-lt", async () => {
    const body = `
      <p id="only-lt">
        <dfn data-lt="hello">hey</dfn>
        [= hey =] [= hello =]
      </p>
      <p id="only-local-lt">
        <dfn data-local-lt="installing|installed|installation">install</dfn>
        [= install =] [= installation =] [= installed =] [= installing =]
      </p>
      <p id="lt-local-lt">
        <dfn data-lt="first" data-local-lt="second">third</dfn>
        [= first =] [= second =] [= third =]
      </p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const dfnOnlyLt = doc.querySelector("#only-lt dfn");
    expect(dfnOnlyLt.id).toBe("dfn-hello");
    for (const el of [...doc.querySelectorAll("#only-lt a")]) {
      expect(el.hash).toBe("#dfn-hello");
    }

    const dfnOnlyLocalLt = doc.querySelector("#only-local-lt dfn");
    expect(dfnOnlyLocalLt.id).toBe("dfn-install");
    for (const el of [...doc.querySelectorAll("#only-local-lt a")]) {
      expect(el.hash).toBe("#dfn-install");
    }

    const dfnLtLocalLt = doc.querySelector("#lt-local-lt dfn");
    expect(dfnLtLocalLt.id).toBe("dfn-first");
    for (const el of [...doc.querySelectorAll("#lt-local-lt a")]) {
      expect(el.hash).toBe("#dfn-first");
    }
  });
});
