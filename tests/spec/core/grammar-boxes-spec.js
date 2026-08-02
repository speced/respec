"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Grammar Boxes", () => {
  afterAll(flushIframes);

  describe("ABNF blocks", () => {
    it("wraps ABNF content in a <code> element", async () => {
      const body = `
        <pre class="abnf">
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector("pre.abnf > code");
      expect(code).toBeTruthy();
      expect(code.textContent).toContain("rulename");
    });

    it("adds an ABNF header badge", async () => {
      const body = `
        <pre class="abnf">
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const header = doc.querySelector("pre.abnf .grammarHeader");
      expect(header).toBeTruthy();
      const link = header.querySelector("a.self-link");
      expect(link).toBeTruthy();
      expect(link.textContent).toBe("ABNF");
    });

    it("adds an id to the pre element for self-linking", async () => {
      const body = `
        <pre class="abnf">
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const pre = doc.querySelector("pre.abnf");
      expect(pre.id).toBeTruthy();
      expect(pre.id).toMatch(/^abnf-block-/);
    });

    it("self-link href matches the pre element id", async () => {
      const body = `
        <pre class="abnf">
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const pre = doc.querySelector("pre.abnf");
      const link = doc.querySelector("pre.abnf .grammarHeader a.self-link");
      expect(link.getAttribute("href")).toBe(`#${pre.id}`);
    });

    it("skips blocks with data-no-grammar attribute", async () => {
      const body = `
        <pre id="skipped-abnf" class="abnf" data-no-grammar>
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const pre = doc.getElementById("skipped-abnf");
      expect(pre).toBeTruthy();
      // grammar-boxes must not have added a header badge
      expect(pre.querySelector(".grammarHeader")).toBeNull();
      // grammar-boxes must not have added its own <code class="abnf"> (no hljs class)
      const code = pre.querySelector("code");
      if (code) {
        // If highlight.js ran, the code element has the "hljs" class
        expect(code.classList.contains("hljs")).toBe(true);
      }
    });

    it("adds a copy button inside the header", async () => {
      const body = `
        <pre class="abnf">
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const header = doc.querySelector("pre.abnf .grammarHeader");
      const copyButton = header.querySelector(
        "button.respec-button-copy-paste"
      );
      expect(copyButton).toBeTruthy();
    });
  });

  describe("EBNF blocks", () => {
    it("wraps EBNF content in a <code> element", async () => {
      const body = `
        <pre class="ebnf">
          rule = "token" , rule
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector("pre.ebnf > code");
      expect(code).toBeTruthy();
      expect(code.textContent).toContain("rule");
    });

    it("adds an EBNF header badge", async () => {
      const body = `
        <pre class="ebnf">
          rule = "token" , rule
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const link = doc.querySelector("pre.ebnf .grammarHeader a.self-link");
      expect(link).toBeTruthy();
      expect(link.textContent).toBe("EBNF");
    });
  });

  describe("BNF blocks", () => {
    it("wraps BNF content in a <code> element", async () => {
      const body = `
        <pre class="bnf">
          &lt;term&gt; ::= "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector("pre.bnf > code");
      expect(code).toBeTruthy();
    });

    it("adds a BNF header badge", async () => {
      const body = `
        <pre class="bnf">
          &lt;term&gt; ::= "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const link = doc.querySelector("pre.bnf .grammarHeader a.self-link");
      expect(link).toBeTruthy();
      expect(link.textContent).toBe("BNF");
    });
  });

  describe("CSS injection", () => {
    it("injects grammar CSS when at least one grammar block exists", async () => {
      const body = `
        <pre class="abnf">
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // The CSS must define .grammarHeader — check via computed style or
      // inspect that the style element was injected.
      const styles = [...doc.querySelectorAll("style")].map(s => s.textContent);
      const hasGrammarCSS = styles.some(s => s.includes("grammarHeader"));
      expect(hasGrammarCSS).toBe(true);
    });

    it("does not inject CSS when no grammar blocks are present", async () => {
      const body = `<p>No grammar blocks here.</p>`;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const styles = [...doc.querySelectorAll("style")].map(s => s.textContent);
      const hasGrammarCSS = styles.some(s => s.includes("grammarHeader"));
      expect(hasGrammarCSS).toBe(false);
    });
  });

  describe("<code> element language class", () => {
    it("puts the grammar language class on the <code> element", async () => {
      const body = `
        <pre class="abnf">
          rulename = "value"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector("pre.abnf > code");
      expect(code.classList.contains("abnf")).toBe(true);
    });
  });
});
