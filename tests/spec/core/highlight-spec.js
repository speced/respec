"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Highlight", () => {
  afterAll(flushIframes);

  it("highlights remote languages not bundled by default with ReSpec", async () => {
    const doc = await makeRSDoc({}, "spec/core/highlight.html");
    const span = doc.querySelector("code.testlang span[class*=hljs]");
    expect(span.textContent).toBe("funkyFunction");
  });

  it("shouldn't highlight idl blocks", async () => {
    const body = `
      <section><pre class=idl>
        [Constructor]interface Dahut : Mammal {
          const unsigned short DEXTROGYROUS = 1;
          Dahut turnAround(float angle, boolean fall);
        };</pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("pre");
    expect(pre.classList.contains("hljs")).toBeFalsy();
    expect(pre.querySelector("span[class*=hljs-]")).toBeNull();
  });

  it("automatically highlights", async () => {
    const body = `
      <section>
        <pre class=example>
          function foo() {
            alert('foo');
          }
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("div.example pre");
    expect(pre.firstChild.classList).toContain("hljs");
    expect(pre.querySelector("span[class*=hljs-]")).toBeTruthy();
  });

  it("shouldn't highlight pre elements when told not to", async () => {
    const body = `
      <section>
        <pre class='nohighlight example'>
          function foo() {
            alert('foo');
          }
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("div.example pre");
    expect(pre.classList).toContain("nohighlight");
    expect(pre.querySelector("span[class*=hljs-]")).toBeNull();
  });

  it("shouldn't highlight code inside pre elements when told not to", async () => {
    const body = `
      <section>
        <pre class="example">
          <code class="nohighlight">
            function(){}
          </code>
          <code class="js">
            function(){}
          </code>
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const codeNoHighlight = doc.querySelector("div.example code.nohighlight");
    expect(codeNoHighlight).toBeTruthy();
    expect(codeNoHighlight.querySelector("span[class*=hljs-]")).toBeNull();

    const codeHighlight = doc.querySelector("div.example code.js");
    expect(codeHighlight.querySelector("span[class*=hljs-]")).toBeTruthy();
  });

  it("respects the noHighlightCSS by not highlighting anything", async () => {
    const ops = {
      config: Object.assign(makeBasicConfig(), { noHighlightCSS: true }),
      body: `${makeDefaultBody()}
        <section>
          <pre id="test">
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.getElementById("test");
    expect(pre.querySelector("span[class*=hljs-]")).toBeNull();
  });

  it("checks if <pre> content is wrapped in <code>", async () => {
    const body = `
        <section>
          <pre class="js">
            function foo() {
              alert('foo');
            }
          </pre>
        </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("pre");
    const code = pre.firstElementChild;
    expect(pre.classList).not.toContain("js");
    expect(code.localName).toBe("code");
    expect(code.classList).toContain("hljs");
    expect(code.classList).toContain("js");
  });

  it("asynchronously hightlights <code> elements inside <pre>", async () => {
    const body = `
      <section>
        <pre class="example" id="first-pre">
          <code class="js" id="test1">
            function one(){}
          </code>
          function pass(){}
          <code class="http" id="test2">
            Header: Test1
          </code>
        </pre>
        <pre id="second-pre">
          second function(){} is not highlighted.
          <code class="js">
            function three(){}
          </code>
          <code>
            function four(){}
          </code>
          <code class="http">
            Header: Test5
          </code>
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const firstPre = doc.getElementById("first-pre");
    expect(firstPre.innerHTML).toContain("function pass(){}");
    expect(firstPre.querySelector("code span[class*=hljs-]")).toBeTruthy();
    expect(firstPre.querySelector("code:nth-child(1)").textContent).toContain(
      "function one(){}"
    );

    const secondPre = doc.getElementById("second-pre");
    expect(secondPre.innerHTML).toContain(
      "second function(){} is not highlighted"
    );

    const fourthCode = secondPre.querySelector("code:nth-child(2)");
    expect(fourthCode.classList).toContain("javascript");
    const lastCode = secondPre.querySelector("code:last-child");
    expect(lastCode.textContent).toContain("Header: Test5");
    expect(lastCode.classList).toContain("http");
  });
});
