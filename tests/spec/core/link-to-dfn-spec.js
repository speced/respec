"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Link to definitions", () => {
  afterAll(flushIframes);

  it("removes non-alphanum chars from fragment components", async () => {
    const bodyText = `
      <section>
        <h2>Test section</h2>
        <p><dfn>[[\\test]]</dfn><a id="testAnchor">[[\\test]]</a>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const a = doc.getElementById("testAnchor");
    expect(a).toBeTruthy();
    expect(a.hash).toBe("#dfn-test");
    const decodedHash = decodeURIComponent(a.hash);
    expect(doc.getElementById(decodedHash.slice(1))).toBeTruthy();
  });

  it("links to IDL definitions and wraps in code if needed", async () => {
    const bodyText = `
      <section data-link-for="Request">
        <h2><dfn>Request</dfn> interface</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Request {
            Request clone();
          };
        </pre>
        <p id="codeWrap">A <a>Request</a> object has a <dfn>clone</dfn> method.</p>
        <p id="codeWrapMethod"><a>clone</a>, <a>clone()</a>, <a>Request.clone</a>, and <a>Request.clone()</a> are all same.</p>
        <p id="noCodeWrap">An instance of <a data-lt="Request">the request interface</a>.</p>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const hasCode = doc.body.querySelector("#codeWrap a");
    expect(hasCode).toBeTruthy();
    expect(hasCode.firstElementChild.localName).toBe("code");
    expect(hasCode.textContent).toBe("Request");
    const codeWrapMethods = doc.body.querySelectorAll("#codeWrapMethod a code");
    expect(codeWrapMethods.length).toBe(4);
    const noCodeWrap = doc.body.querySelector("#noCodeWrap a");
    expect(noCodeWrap).toBeTruthy();
    expect(noCodeWrap.getAttribute("href")).toBe("#dom-request");
    expect(noCodeWrap.querySelector("code")).toBeFalsy();
    expect(noCodeWrap.textContent).toBe("the request interface");
  });

  it("checks for duplicate definitions", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <dfn>Test1</dfn>
        <dfn id="duplicate-definition">Test1</dfn>
        <dfn>Test1</dfn>
        <dfn title="test1">Test1</dfn>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const dfnList = doc.body.querySelectorAll("dfn");

    const dfn1 = dfnList[1];
    expect(dfn1).toBeTruthy();
    expect(dfn1.classList).toContain("respec-offending-element");
    expect(dfn1.id).toBe("duplicate-definition");

    const dfn2 = dfnList[2];
    expect(dfn2).toBeTruthy();
    expect(dfn2.classList).toContain("respec-offending-element");
    expect(dfn2.id).toBeDefined();

    const dfn3 = dfnList[3];
    expect(dfn3).toBeTruthy();
    expect(dfn3.classList).toContain("respec-offending-element");
    expect(dfn3.title).toBe("test1");
  });

  it("has data-dfn-for if it's included", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <dfn data-dfn-for="Foo">Test1</dfn>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const [dfn] = doc.getElementsByTagName("dfn");
    expect(dfn.dataset.dfnFor).toBe("Foo");
  });

  it("should get ID from the first match", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <dfn data-lt="Test2">Test1</dfn>
        <a>Test2</a>
        <a>Test1</a>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const [dfn] = doc.getElementsByTagName("dfn");
    expect(dfn.id).toBe("dfn-test2");
  });

  it("prefers data-lt over text content", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <pre class="idl">
          interface Presentation {};
        </pre>
        <dfn>Foo</dfn>
        <dfn>Bar</dfn>
        <a id="testFoo" data-lt="Foo">Presentation</a>
        <a id="testBar" data-lt="Bar">Foo</a>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const testFoo = doc.getElementById("testFoo");
    const testBar = doc.getElementById("testBar");
    expect(testFoo.hash).toBe("#dfn-foo");
    expect(testBar.hash).toBe("#dfn-bar");
  });

  it("links conceptual definitions case insensitively", async () => {
    const bodyText = `
    <section>
      <h2>Test Section</h2>
      <p><dfn>Test String</dfn>
      <p id="links"><a>test string</a> <a>test STRING</a> <a>TesT string</a>
    </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    expect(
      doc.querySelectorAll("#links a[href='#dfn-test-string']").length
    ).toBe(3);
  });
});
