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

  it("adds automatic pluralization for defined terms", async () => {
    const body = `
      <section id="one">
        <dfn>foo</dfn>
        <a>foo</a>
        <a>foos</a>
      </section>

      <section id="two">
        <dfn data-lt="foo baz|foo bars">foo bar</dfn>
        <a>foo baz</a>
        <a>foo bazs</a>
        <a>foo bar</a>
        <a>foo bars</a>
      </section>

      <section id="three">
        <dfn data-lt-noPlural>baz</dfn>
        <a>baz</a>
        <a>bazs</a>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);
    await doc.respecIsReady;

    const getLinkHashes = parent =>
      [...parent.querySelectorAll("a")].map(({ href }) => new URL(href).hash);

    // case: no manual data-lt specified
    const one = doc.getElementById("one");
    const dfn1 = one.querySelector("dfn");
    expect(dfn1.id).toEqual("dfn-foo");
    const dfn1lt = dfn1.dataset.lt.split("|").sort();
    const expectedDfn1lt = "foo|foos".split("|");
    expect(dfn1lt).toEqual(expectedDfn1lt);
    expect(getLinkHashes(one).every(h => h === "#dfn-foo")).toBe(true);

    // case: data-lt specified. check: adds pluralization
    const two = doc.getElementById("two");
    const dfn2 = two.querySelector("dfn");
    expect(dfn2.id).toEqual("dfn-foo-baz"); // uses first data-lt as `id`
    const dfn2lt = dfn2.dataset.lt.split("|").sort();
    const expectedDfn2lt = "foo bar|foo bars|foo baz|foo bazs".split("|");
    expect(dfn2lt).toEqual(expectedDfn2lt); // no repeats, all pluralizations
    expect(getLinkHashes(two).every(h => h === "#dfn-foo-baz")).toBe(true);

    // case: asked to not pluralize (override)
    const three = doc.getElementById("three");
    const dfn3 = three.querySelector("dfn");
    expect(dfn3.id).toEqual("dfn-baz");
    const [validLink, invalidLink] = [...three.querySelectorAll("a")];
    expect(new URL(validLink.href).hash).toEqual("#dfn-baz");
    expect(invalidLink.href).toEqual("");
    expect(invalidLink.classList.value).toEqual("respec-offending-element");
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
          <dfn data-lt='text|text 1|text  2|text 3 '>text</dfn>
          <a>text</a>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const dfn = doc.querySelector("dfn[data-lt]");
    expect(dfn.dataset.lt).toEqual("text|text 1|text 2|text 3");
    expect(dfn.dataset.dfnType).toEqual("dfn");
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
