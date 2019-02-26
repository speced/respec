"use strict";
describe("Core — Highlight", () => {
  afterAll(flushIframes);

  it("highlights remote languages not bundled by default with ReSpec", async () => {
    const doc = await makeRSDoc({}, "spec/core/highlight.html");
    const span = doc.querySelector("pre.testlang span[class^=hljs]");
    expect(span.textContent).toBe("funkyFunction");
  });

  it("shouldn't highlight idl blocks", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
        <section><pre class=idl>
          [Constructor]interface Dahut : Mammal {
            const unsigned short DEXTROGYROUS = 1;
            Dahut turnAround(float angle, boolean fall);
          };</pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("pre");
    expect(pre.classList.contains("hljs")).toBeFalsy();
    expect(pre.querySelectorAll("span[class~=hljs-]").length).toBe(0);
  });

  it("automatically highlights", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <pre class=example>
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("div.example pre");
    expect(pre.firstChild.classList.contains("hljs")).toBeTruthy();
    expect(pre.querySelectorAll("span[class~=hljs-]").length).toBeGreaterThan(
      0
    );
  });

  it("shouldn't highlight pre elements when told not to", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <pre class='nohighlight example'>
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("div.example pre");
    expect(pre.classList.contains("nohighlight")).toBeTruthy();
    expect(pre.querySelectorAll("span[class~=hljs-]").length).toBe(0);
  });

  it("respects the noHighlightCSS by not highlighting anything", async () => {
    const ops = {
      config: Object.assign(makeBasicConfig(), { noHighlightCSS: true }),
      body: `${makeDefaultBody()}<section>
          <pre id="test">
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.getElementById("test");
    expect(pre.querySelectorAll("span[class~=hljs-]").length).toBe(0);
  });

  it("checks if <pre> content is warpped in <code>", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <pre>
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelectorAll("pre");
    expect(pre[0].querySelectorAll("code").length).toBe(1);
    expect(pre[0].querySelectorAll("code[class~='javascript']").length).toBe(1);
  });

  it("gets the language class defined in <pre>", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <pre class="js">
            function foo() {
              alert('foo');
            }
          </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelectorAll("pre");
    expect(pre[0].firstChild.localName).toBe("code");
    expect(pre[0].querySelectorAll("code").length).toBe(1);
    expect(pre[0].querySelectorAll("code[class~='js']").length).toBe(1);
  });

  it("checks the case when <code> is present inside <pre>", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <pre>
            <code>
              function one(){}
            </code>
            this function(){} is not highlighted.
            <code class="http">
              Header: Test1
            </code>
          </pre>
          <pre>
            <code class="javascript">
              function three(){}
            </code>
            this function(){} is not highlighted.
            <code class="http">
              Header: Test2
            </code>
          </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelectorAll("pre");
    for (const eachPre of pre) {
      expect(eachPre.querySelectorAll("code").length).toBe(2);
      expect(eachPre.querySelectorAll("code[class~='javascript']").length).toBe(
        1
      );
      expect(eachPre.querySelectorAll("code[class~='http']").length).toBe(1);
    }
  });
});
