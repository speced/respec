"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - Markdown", () => {
  afterAll(flushIframes);
  it("processes standard markdown content", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}\n\nFoo\n===\n`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    Array.from(doc.querySelectorAll(".removeOnSave")).forEach(elem => {
      elem.remove();
    });
    const foo = doc.getElementById("foo");
    expect(foo).toBeTruthy();
    expect(foo.textContent).toBe("1. Foo");
  });

  it("processes markdown inside of sections", async () => {
    const body = `<section>\nFoo\n===\n</section>`;
    const ops = makeStandardOps({ format: "markdown" }, body);
    const doc = await makeRSDoc(ops);
    const foo = doc.getElementById("foo");
    expect(foo).toBeTruthy();
    expect(foo.textContent).toBe("1. Foo");
  });

  it("processes markdown inside of notes, issues and reqs.", async () => {
    const body = `
      <div class=note>
        _note_
      </div>
      <div class=issue>
        _issue_
      </div>
    `;
    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(".note p em")).toBeTruthy();
    expect(doc.querySelector(".issue p em")).toBeTruthy();
  });

  it("removes left padding before processing markdown content", async () => {
    const body = `

      ## Foo
        * list item 1
        * list item 2
          * nested list item
    `;
    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector("code")).toBeFalsy();
    expect(doc.querySelector("#foo h2").textContent).toBe("1. Foo");
    const listItems = doc.querySelectorAll(
      "section > ul:not([class=toc]) > li"
    );
    expect(listItems).toHaveSize(2);
    expect(listItems[0].textContent).toBe("list item 1");
    const nestedLi = doc.querySelector("li > ul > li");
    expect(nestedLi).toBeTruthy();
    expect(nestedLi.textContent).toBe("nested list item");
  });

  it("assigns unique ids to headers", async () => {
    const body = `
    <section data-format="markdown" id="test-section">
      Section title
      =========

      Section title
      ------------------------------
      First sub-section with this title.

      Section title
      ------------------------------
      Second sub-section with the same title.
    </section>`;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);

    const h2s = doc.querySelectorAll("#test-section h2");
    expect(h2s).toHaveSize(1);
    const [h2] = h2s;
    expect(h2.id).toBe("x1-section-title");
    const h3s = doc.querySelectorAll("#test-section h3");
    expect(h3s).toHaveSize(2);
    const [firstH3, secondH3] = h3s;
    expect(firstH3.id).not.toBe(secondH3);
    for (const elem of [h2, firstH3, secondH3]) {
      expect(doc.querySelectorAll(`#${elem.id}`)).toHaveSize(1);
    }
  });

  it("allows custom ids to headers", async () => {
    const body = `
      ## Heading {#custom-id}
      PASS

      Foo title {#foo}
      =========
      PASS

      Bar title {#bar}
      ------------------------------
      PASS

      ## Another title
      PASS
    `;
    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);

    const headings = doc.querySelectorAll("section h2, section h3");
    expect(headings).toHaveSize(4);

    const [customID, foo, bar, automaticId] = headings;

    expect(customID.id).toBe("custom-id");
    expect(customID.textContent).toBe("1. Heading");

    expect(foo.id).toBe("foo");
    expect(foo.textContent).toBe("2. Foo title");

    expect(bar.id).toBe("bar");
    expect(bar.textContent).toBe("2.1 Bar title");

    expect(automaticId.id).toBe("x2-2-another-title");
    expect(automaticId.textContent).toBe("2.2 Another title");
  });

  it("structures content in nested sections with appropriate titles", async () => {
    const body = `

        Foo
        ===

        Bar
        ---

        Baz
        ---

        ### Foobar ###

        #### Foobaz ####

        Zing
        ----

        `;
    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    const foo = doc.querySelector("#foo h2");
    expect(foo.textContent).toBe("1. Foo");
    expect(foo.parentElement.localName).toBe("section");

    const bar = doc.querySelector("#bar h3");
    expect(bar.textContent).toBe("1.1 Bar");
    expect(bar.parentElement.localName).toBe("section");

    const baz = doc.querySelector("#baz h3");
    expect(baz.textContent).toBe("1.2 Baz");
    expect(baz.parentElement.localName).toBe("section");

    const foobar = doc.querySelector("#foobar h4");
    expect(foobar.textContent).toBe("1.2.1 Foobar");
    expect(foobar.parentElement.localName).toBe("section");

    const foobaz = doc.querySelector("#foobaz h5");
    expect(foobaz.textContent).toBe("1.2.1.1 Foobaz");
    expect(foobaz.parentElement.localName).toBe("section");

    const zing = doc.querySelector("#zing h3");
    expect(zing.textContent).toBe("1.3 Zing");
    expect(zing.parentElement.localName).toBe("section");
  });

  it("gracefully handles jumps in nested headers", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}\n\nFoo\n===\n\nBar\n---\n\nBaz\n===\n\n### Foobar ###\n\n`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    const foo = doc.getElementById("foo");
    const bar = doc.getElementById("bar");
    expect(foo.parentElement.contains(bar)).toBeTruthy();
    const baz = doc.getElementById("baz");
    const foobar = doc.getElementById("foobar");
    expect(baz.parentElement.contains(foobar)).toBeTruthy();
  });

  it("nests sections according to their first header, if present", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}\n\nFoo\n===\n\nsome text\n\n<section>\n\nBar\n===\n</section>\n`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    const bar = doc.getElementById("bar");
    expect(bar.textContent).toBe("2. Bar");
  });

  it("nests sections according to their headers", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}\n\nFoo\n===\n\nsome text\n\n<section>\n\nBar\n---\n</section>\n`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    const bar = doc.getElementById("bar");
    expect(bar.textContent).toContain("1.1 Bar");
    const foo = doc.getElementById("foo");
    expect(foo.parentElement.contains(bar)).toBeTruthy();
  });

  it("shouldn't nest content following a section inside of said section", async () => {
    const body = `

        Foo
        ===
        some text

        <section>

        Bar
        ---

        </section>

        Baz
        ===

        some text

        `;
    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    const baz = doc.querySelector("#baz h2");
    expect(baz.textContent).toBe("2. Baz");
    const bar = doc.querySelector("#bar h3");
    expect(bar.parentElement.contains(baz)).toBeFalsy();
    expect(baz.parentElement.contains(bar)).toBeFalsy();
  });

  it("shouldn't nest sections with a top level header", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}\n\nFoo\n---\n\nsome text\n\n<section>\n\nBar\n---\n</section>\n`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    const bar = doc.getElementById("bar");
    expect(bar.textContent).toBe("2. Bar");
    expect(doc.body.contains(bar)).toBeTruthy();
  });

  it("shouldn't nest sections with no headers at all", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}\n\nFoo\n===\n\nsome text\n\n<section id=bar>no header</section>\n`,
    };
    ops.config.format = "markdown";
    const doc = await makeRSDoc(ops);
    const foo = doc.getElementById("foo");
    const bar = doc.getElementById("bar");
    expect(doc.body.contains(bar)).toBeTruthy();
    expect(foo.contains(bar)).toBeFalsy();
  });

  it("supports backticks for syntax highlighting", async () => {
    const body = `
      ## test

      \`\`\` webidl
      [Exposed=Window]
      interface Foo {
        constructor();
        attribute DOMString bar;
        undefined doTheFoo();
      };
      \`\`\`

      \`\`\` js
      console.log("hey")
      \`\`\`

      \`\`\`
      IDK what I'am
      \`\`\`
    `;
    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    const [webidlBlock, jsBlock, normalBlock] = doc.querySelectorAll("pre");

    expect(webidlBlock.classList).toContain("idl");
    expect(webidlBlock.querySelector("code.hljs")).toBeNull();
    expect(webidlBlock.querySelector(".idlConstructor")).not.toBeNull();
    expect(webidlBlock.querySelector(".respec-button-copy-paste")).toBeTruthy();

    expect(jsBlock.firstElementChild.localName).toBe("code");
    expect(
      jsBlock.querySelector("code.hljs").classList.contains("js")
    ).toBeTruthy();
    expect(jsBlock.querySelector("code.hljs span")).not.toBeNull();
    expect(jsBlock.querySelector(".respec-button-copy-paste")).toBeNull();

    expect(normalBlock.firstElementChild.localName).toBe("code");
    expect(normalBlock.querySelector(".respec-button-copy-paste")).toBeNull();
    expect(normalBlock.querySelector("code.hljs")).not.toBeNull();
    expect(normalBlock.querySelector("code.hljs span")).toBeNull();
  });

  it("is case insensitive for webidl language tags", async () => {
    const body = `
      ## test

      \`\`\` weBiDl
      [Exposed=Window]
      interface FooWebidl {};
      \`\`\`
    `;

    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    const mixedCaseWebidl = doc.querySelector("pre");

    expect(mixedCaseWebidl.classList).toContain("idl");
    expect(mixedCaseWebidl.querySelector("code.hljs")).toBeFalsy();
    expect(
      mixedCaseWebidl.querySelector(".respec-button-copy-paste")
    ).toBeTruthy();
  });

  it("indents <pre> in markdown correctly", async () => {
    const body = `
      1. I am your father

      2. No, no, it's not true

          <pre class="idl">
          [Exposed=Window]
          interface Thats {
            attribute Impossibl e;
          };
          </pre>
    `;

    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("pre");

    expect(pre.textContent).toContain("{\n  attribute Impossibl e;\n}");
  });

  it("properly indents <pre> contents with no block indentation", async () => {
    const idl = `function getAnswer() {\n  return 42;\n}\n`;
    const body = `
# test

\`\`\` js
function getAnswer() {
  return 42;
}
\`\`\`
    `;

    const ops = makeStandardOps({ format: "markdown" }, body);
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("pre");

    expect(pre.textContent).toBe(idl);
  });

  it("does not parse texts inside <pre> as markdown", async () => {
    const code = `1 * 2 * 3;`;
    const body = `
      <pre class="example">
      ${code}
      </pre>
    `;

    const ops = makeStandardOps({ format: "markdown" }, body);
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("pre");

    expect(pre.textContent).toBe(code);
  });

  describe("nolinks options", () => {
    it("automatically links URLs in pre when missing (smoke test)", async () => {
      const body = `
        <div id=testElem>
          this won't link
          this will link: http://no-links-foo.com
          so will this: http://no-links-bar.com
        </div>
      `;
      const ops = makeStandardOps({ format: "markdown" }, body);
      ops.abstract = null;
      const doc = await makeRSDoc(ops);
      const anchors = doc.querySelectorAll("#testElem a");
      expect(anchors).toHaveSize(2);
      expect(anchors[0].href).toBe("http://no-links-foo.com/");
      expect(anchors[1].href).toBe("http://no-links-bar.com/");
    });

    it("replaces HTMLAnchors when present", async () => {
      const body = `
        <div id=testElem class=nolinks>
          http://no-links-foo.com
          http://no-links-bar.com
        <div>
      `;
      const ops = makeStandardOps({ format: "markdown" }, body);
      const doc = await makeRSDoc(ops);
      const anchors = doc.querySelectorAll("#testElem a");
      expect(anchors).toHaveSize(0);
      expect(
        doc.querySelector("a[href='http://no-links-foo.com']")
      ).toBeFalsy();
      expect(
        doc.querySelector("a[href='http://no-links-bar.com']")
      ).toBeFalsy();
    });

    it("handles quoted elements, including entity quotes", async () => {
      const body = `
        <p id='test-text1'>test1 text &quot;<code>inner text</code>".</p>
        <p id='test-text2'>test2 '<code>inner</code>&#39;.</p>
        // Pre left alone
        <pre class=nohighlight id='test-text3'>test3 text "<code>inner text</code>".</pre>
      `;
      const ops = makeStandardOps({ format: "markdown" }, body);
      const doc = await makeRSDoc(ops);
      const text1 = doc.getElementById("test-text1");
      expect(text1.textContent).toBe(`test1 text "inner text".`);
      expect(text1.innerHTML).toBe(`test1 text "<code>inner text</code>".`);
      const text2 = doc.getElementById("test-text2");
      expect(text2.textContent).toBe(`test2 'inner'.`);
      expect(text2.innerHTML).toBe(`test2 '<code>inner</code>'.`);
      const text3 = doc.getElementById("test-text3");
      expect(text3.innerHTML).toBe(`test3 text "<code>inner text</code>".`);
    });
  });

  describe("data-format=markdown", () => {
    it("replaces processes data-format=markdown sections, but leaves other sections alone", async () => {
      const body = `
        <section id=markdown1 data-format=markdown>
          ## this is a h2
          This is a paragraph with \`code\`.

          ### heading 3
          This is another paragraph.

          ### another h3
          This is another paragraph.
        </section>
        <section id=dontTouch>
          ## this should not change
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const headings = Array.from(
        doc.querySelectorAll("#markdown1 h2, #markdown1 h3")
      );
      expect(headings).toHaveSize(3);
      const [h2, h3, anotherH3] = headings;
      expect(h2.localName).toBe("h2");
      expect(h3.localName).toBe("h3");
      expect(anotherH3.localName).toBe("h3");
      expect(anotherH3.textContent.trim()).toBe("1.2 another h3");
      expect(doc.querySelector("#markdown1 code")).toBeTruthy();
      const dontChange = doc.getElementById("dontTouch").textContent.trim();
      expect(dontChange).toBe("## this should not change");
    });
  });

  describe("triple-backtick code blocks", () => {
    it("treats code blocks as regular pre-element", async () => {
      const body = `
        <section data-format="markdown" id="test">
        \`\`\`js
        console.log("hey!!");
        \`\`\`
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const pre = doc.querySelector("#test pre");

      const example = pre.closest(".example");
      expect(example).toBeFalsy();
    });

    it("treats as example if example metadata exists", async () => {
      const body = `
        <section data-format="markdown" id="test">
        \`\`\`html "example": "the title"
        <div>&lt;soup</div>
        \`\`\`
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);

      const example = doc.querySelector("#test .example");
      expect(example).toBeTruthy();
      const title = example.querySelector(".example-title");
      expect(title).toBeTruthy();
      expect(title.textContent).toContain("the title");
      expect(example.querySelector("pre").classList).toContain("html");
      expect(example.querySelector("pre > code.hljs")).toBeTruthy();
    });
  });

  describe("Markdown-inside-block backward compatibility", () => {
    it("parses indented <pre> after a list", async () => {
      const idl = `dictionary Indented {\n  any shouldBeIndented;\n};`;
      const body = `
        <div>
        1. I lack double newlines between HTML block
        </div>
        <pre class="idl" id="pre">
        dictionary Indented {
          any shouldBeIndented;
        };
        </pre>
      `;
      const ops = makeStandardOps({ format: "markdown" }, body);
      ops.abstract = null;
      const doc = await makeRSDoc(ops);
      const pre = doc.querySelector("pre");
      pre.querySelector(".idlHeader").remove();

      expect(pre.textContent).toBe(idl);
    });

    it("parses indented HTML block contents as HTML", async () => {
      const body = `
        <section>
          <h2 id="h2">header</h2>
          <p id="p">This is HTML, not an indented markdown code block</p>
        </section>
      `;
      const ops = makeStandardOps({ format: "markdown" }, body);
      ops.abstract = null;
      const doc = await makeRSDoc(ops);
      const h2 = doc.getElementById("h2");
      const p = doc.getElementById("p");

      expect(h2.localName).toBe("h2");
      expect(h2.textContent).toBe("1. header");
      expect(p.localName).toBe("p");
    });
  });
});
