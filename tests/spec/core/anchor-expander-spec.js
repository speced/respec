"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - anchor-expander", () => {
  afterAll(flushIframes);
  it("clones nodes when expanding", async () => {
    const body = `
    <section class="introductory">
      <h3 id="about_character_classes">
        <span its-locale-filter-list="en">About Character Classes</span>
        <span its-locale-filter-list="ja">文字クラスについて</span>
      </h3>
      <p id="expansion">[[[#about_character_classes]]]</p>
    </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const [span1, span2] = doc.querySelectorAll("#expansion a > span");

    // <span its-locale-filter-list="en">About Character Classes</span>
    expect(span1.getAttribute("its-locale-filter-list")).toBe("en");
    expect(span1.textContent).toBe("About Character Classes");

    // <span its-locale-filter-list="ja">文字クラスについて</span>
    expect(span2.getAttribute("its-locale-filter-list")).toBe("ja");
    expect(span2.textContent).toBe("文字クラスについて");
  });

  it("shows inline error when it can't find a section's heading", async () => {
    const body = `
    <section id="no-header">
      <a href="#no-header"></a> [[[#no-header]]]
    </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const anchors = doc.querySelectorAll(
      "#no-header  a.respec-offending-element"
    );
    expect(anchors).toHaveSize(2);
    expect(
      [...anchors].every(({ textContent }) => textContent === "#no-header")
    ).toBeTruthy();
  });

  it("shows inline error when it can't find a figcaption", async () => {
    const body = `
    <section id="test-no-fig-caption">
      <figure id="figure">
        <p>I'm a figure</p>
      </figure>
      <p id="expansion">[[[#figure]]]</p>
    </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const a = doc.querySelector("#expansion a.respec-offending-element");
    expect(a.textContent).toBe("#figure");
  });

  it("safely copies definitions and things with ids, by not duplicating them", async () => {
    const body = `
    <section id="safe-copy" class="introductory">
      <h2>
        <dfn id="fail" title="pass">
          <code>code thing</code>
        </dfn>
        and <span data-value="pass">span</span>
      </h2>
      <p id="expansion">
        [[[#safe-copy]]]
      </p>
    </section>`;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("#expansion dfn")).toBeNull();
    expect(doc.querySelector("#expansion *[id]")).toBeNull();

    const [firstSpan, secondSpan] = doc.querySelectorAll("#expansion a > span");
    // title gets dropped from dfns
    expect(firstSpan.title).toBe("");
    expect(firstSpan.firstElementChild.localName).toBe("code");
    expect(firstSpan.firstElementChild.textContent).toBe("code thing");
    expect(secondSpan.textContent).toBe("span");
    expect(secondSpan.dataset.value).toBe("pass");
  });

  it("safely copies IDL defined things without copying their attributes", async () => {
    const body = `
    <section data-dfn-for="Foo" id="thefoo">
      <h2>
        <dfn>Foo</dfn> interface
      </h2>
      <pre class="idl">
      [Exposed=Window]
      interface Foo {};
      </pre>
      <p id="expansion">
       [[[#thefoo]]]
      </p>
    </section>`;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("#expansion dfn")).toBeNull();
    expect(doc.querySelector("#expansion *[id]")).toBeNull();
    const span = doc.querySelector("#expansion a > span");
    expect(span.attributes).toHaveSize(0);
    const code = span.firstElementChild;
    expect(code.localName).toBe("code");
    expect(code.textContent).toBe("Foo");
  });

  it("gets applies contextual directional and language information to expanded nodes", async () => {
    const body = `
      <section lang="ar" class="introductory">
        <h2 id="myid" dir="rtl">نشاط التدويل، W3C</h2>
      </section>
      <section>
        <h2>Some other section</section>
        <p id="expansion">[[[#myid]]]</p>
        <p id="expansion2"><a href="#myid" dir="ltr" lang=""></a></p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const firstExpansion = doc.querySelector("#expansion a");
    expect(firstExpansion.dir).toBe("rtl");
    expect(firstExpansion.lang).toBe("ar");
    const secondExpansion = doc.querySelector("#expansion2 a");
    expect(secondExpansion.dir).toBe("ltr");
    expect(secondExpansion.lang).toBe("");
  });

  it("it removes trailing whitespace when expanding headers", async () => {
    const body = `
      <section lang="ar" class="introductory">
        <h2 id="someid">
          This
          <code>is</code>
          a test
        </h2>
      </section>
      <section>
        <h2>Some other section</section>
        <p id="expansion1">[[[#someid]]].</p>
        <p id="expansion2"><a href="#someid"></a>!</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);

    const p1 = doc.getElementById("expansion1");
    const { textContent: text1 } = p1.querySelector("a").lastChild;
    expect(text1.endsWith("a test")).toBeTrue();
    expect(p1.textContent.endsWith("a test.")).toBeTrue();

    const p2 = doc.getElementById("expansion2");
    const { textContent: text2 } = p2.querySelector("a").lastChild;
    expect(text2.endsWith("a test")).toBeTrue();
    expect(p2.textContent.endsWith("a test!")).toBeTrue();
  });

  it("it converts nested anchors inside heading/sections expansions into spans", async () => {
    const body = `
      <section id="sectionid">
        <h2 id="someid">
          Some {{MediaDevices}}
        </h2>
        <pre class="idl">
          [Exposed=Window]
          interface MediaDevices {};
        </pre>
        <p id="exp1">[[[#someid]]].</p>
        <p id="exp2"><a href="#someid"></a>!</p>
        <p id="exp3"><a href="#sectionid"></a></p>
        <p id="exp4">[[[#sectionid]]]</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    for (const exp of ["exp1", "exp2", "exp3", "exp4"]) {
      const p = doc.getElementById(exp);
      expect(p.querySelector("a a")).toBeNull();
      const span = p.querySelector("span");
      expect(span).toBeTruthy();
      expect(span.textContent.trim()).toEqual("MediaDevices");
      expect(span.attributes).toHaveSize(0);
    }
  });
});
