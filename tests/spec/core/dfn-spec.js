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

  it("gives definitions a type and an id", async () => {
    const body = `
    <section id='dfns'>
      <dfn>some definition</dfn>
      <dfn data-export>some other def</dfn>
      <dfn data-dfn-type="abstract-op">some other def</dfn>
      <dfn data-dfn-type="">empty dfn type</dfn>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const sec = doc.getElementById("dfns");
    const dfns = sec.querySelectorAll("dfn");
    expect(dfns).toHaveSize(4);
    expect([...dfns].every(dfn => Boolean(dfn.getAttribute("id")))).toBeTrue();
    expect(
      [...dfns].every(dfn => dfn.hasAttribute("data-dfn-type"))
    ).toBeTrue();
    const [dfn1, dfn2, dfn3, dfn4] = dfns;

    expect(dfn1.dataset.dfnType).toBe("dfn");
    expect(dfn1.dataset.export).toBeUndefined();

    expect(dfn2.dataset.dfnType).toBe("dfn");
    expect(dfn2.dataset.hasOwnProperty("export")).toBeTrue();

    expect(dfn3.dataset.dfnType).toBe("abstract-op");
    // Override empty type with "dfn"
    expect(dfn4.dataset.dfnType).toBe("dfn");
  });

  it("exports known types by default", async () => {
    const body = `
    <section id='dfns'>
      <dfn data-dfn-type="abstract-op">dfn1</dfn>
      <dfn data-dfn-type="abstract-op" data-noexport>dfn2</dfn>
      <dfn data-dfn-type="abstract-op" data-export>dfn3</dfn>
      <dfn data-cite="dom#something">dfn4</dfn>
      <dfn>dfn5</dfn>
      <dfn data-noexport>dfn6</dfn>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const sec = doc.getElementById("dfns");
    const dfns = sec.querySelectorAll("dfn");
    expect(dfns).toHaveSize(6);
    const [dfn1, dfn2, dfn3, dfn4, dfn5, dfn6] = dfns;

    // first "abstract-op" is exported by default
    expect(dfn1.dataset.dfnType).toBe("abstract-op");
    expect(dfn1.dataset.hasOwnProperty("export")).toBeTrue();

    // second "abstract-op" is not exported
    expect(dfn2.dataset.dfnType).toBe("abstract-op");
    expect(dfn2.dataset.hasOwnProperty("export")).toBeFalse();

    // third "abstract-op" is exported
    expect(dfn3.dataset.dfnType).toBe("abstract-op");
    expect(dfn3.dataset.hasOwnProperty("export")).toBeTrue();

    // fourth doesn't export, because it's using data-cite.
    expect(dfn4.dataset.hasOwnProperty("export")).toBeFalse();
    expect(dfn4.dataset.dfnType).toBe("dfn");

    // fifth "dfn" is not exported, because it's just a regular "dfn".
    expect(dfn5.dataset.hasOwnProperty("export")).toBeFalse();
    expect(dfn5.dataset.dfnType).toBe("dfn");

    // six definition is not exported, because it's data-noexport.
    expect(dfn6.dataset.hasOwnProperty("export")).toBeFalse();
    expect(dfn6.dataset.dfnType).toBe("dfn");
    expect(dfn6.dataset.export).toBeUndefined();
  });

  it("makes dfn tab enabled whose aria-role is a link", async () => {
    const body = `
    <section id='dfns'>
      <dfn>dfn 1</dfn>
      <dfn>dfn 2</dfn>
      <dfn>dfn 3</dfn>
      <dfn>dfn 4</dfn>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const sec = doc.getElementById("dfns");
    const dfns = sec.querySelectorAll("dfn");
    expect(dfns).toHaveSize(4);
    expect([...dfns].every(dfn => dfn.tabIndex === 0)).toBeTrue();
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
    expect(t2.querySelector("code")).toBeNull();
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

  describe("internal slot definitions", () => {
    const body = `
      <section data-dfn-for="Test" data-cite="HTML">
        <h2>Internal slots</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Foo{};
        </pre>
        <p>
          <dfn id="attribute">
            [[\\internal slot]]
          </dfn>
          <dfn id="method" data-export="">
            [[\\I am_a method]](I, really, ...am)
          </dfn>
          <dfn id="parent" data-dfn-for="Window">[[\\internal slot]]</dfn>
          <dfn id="broken" data-dfn-for="">[[\\broken]]</dfn>
        </p>
        <section data-dfn-for="">
          <h2>.</h2>
          <p>
            <dfn id="broken-parent">[[\\broken]]</dfn>
          </p>
        </section>
        <p>
        {{Test/[[internal slot]]}}
        {{Test/[[I am_a method]](I, really, ...am)}}
        {{Window/[[internal slot]]}}
        </p>
        <p>
          <dfn id="legacy" data-cite="ecma-262#sec-8.6.2">[[\\Class]]</dfn>
        </p>
      </section>
    `;

    it("doesn't export internal slots by default", async () => {
      const ops = {
        config: makeBasicConfig(),
        body,
      };
      const doc = await makeRSDoc(ops);

      // The attribute is not exported explicitly, so defaults to "noexport".
      const attribute = doc.getElementById("attribute");
      expect(attribute.dataset.export).toBeUndefined();
      expect(attribute.dataset.noexport).toBe("");

      // The method has an explicit export, so doesn't have a "noexport".
      const method = doc.getElementById("method");
      expect(method.dataset.export).toBe("");
      expect(method.dataset.noexport).toBeUndefined();
    });

    it("sets the data-dfn-type as an attribute", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("attribute");
      expect(dfn.textContent.trim()).toBe("[[internal slot]]");
      expect(dfn.dataset.dfnType).toBe("attribute");
      expect(dfn.dataset.idl).toBe("");
      expect(dfn.dataset.noexport).toBe("");
    });

    it("sets the data-dfn-type as a method, when it's a method", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("method");
      expect(dfn.textContent.trim()).toBe(
        "[[I am_a method]](I, really, ...am)"
      );
      expect(dfn.dataset.dfnType).toBe("method");
      expect(dfn.dataset.idl).toBe("");
      expect(dfn.dataset.noexport).toBeUndefined();
      expect(dfn.dataset.export).toBe("");
    });

    it("when data-dfn-for is missing, it use the closes data-dfn-for as parent", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("attribute");
      expect(dfn.dataset.dfnFor).toBe("Test");
      const dfnWithParent = doc.getElementById("parent");
      expect(dfnWithParent.dataset.dfnFor).toBe("Window");
    });

    it("treats legacy slot references as regular definitions", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("legacy");
      expect(dfn.dataset.dfnType).toBe("dfn");
    });

    it("errors if the internal slot is not for something", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfnErrors = doc.respec.errors.filter(
        ({ plugin }) => plugin === "core/dfn"
      );
      expect(dfnErrors).toHaveSize(2);
    });
  });
});
