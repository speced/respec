"use strict";

import {
  errorFilters,
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../SpecHelper.js";

const errorsFilter = errorFilters.filter("core/cddl");
const warningsFilter = warningFilters.filter("core/cddl");
const linkToDfnWarningsFilter = warningFilters.filter("core/link-to-dfn");

describe("Core - CDDL", () => {
  afterAll(flushIframes);

  describe("CDDL block processing", () => {
    it("wraps inner CDDL in a code element", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" / "necktie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector("pre.cddl > code");
      expect(code).toBeTruthy();
      expect(code.textContent).toContain("attire");
    });

    it("adds the 'highlight' class to pre.cddl", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const pre = doc.querySelector("pre.cddl");
      expect(pre.classList.contains("highlight")).toBe(true);
    });

    it("adds a CDDL header to the block", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const header = doc.querySelector("pre.cddl .cddlHeader");
      expect(header).toBeTruthy();
      expect(header.textContent).toContain("CDDL");
    });

    it("skips blocks with data-no-cddl", async () => {
      const body = `
        <pre class="cddl" data-no-cddl>
          attire = "bow tie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const pre = doc.querySelector("pre.cddl");
      expect(pre.querySelector("code")).toBeFalsy();
      expect(pre.querySelector("dfn")).toBeFalsy();
    });

    it("reports errors for invalid CDDL syntax", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" /
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const errors = errorsFilter(doc);
      expect(errors).toHaveSize(1);
      expect(errors[0].message).toContain("CDDL parse error");
    });

    it("handles empty CDDL blocks gracefully", async () => {
      const body = `<pre class="cddl">   </pre>`;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const errors = errorsFilter(doc);
      expect(errors).toHaveSize(0);
    });
  });

  describe("definition creation", () => {
    it("creates dfn elements for type definitions", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" / "necktie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-type-attire");
      expect(dfn).toBeTruthy();
      expect(dfn.localName).toBe("dfn");
      expect(dfn.dataset.dfnType).toBe("cddl-type");
      expect(dfn.textContent).toBe("attire");
    });

    it("creates dfn elements for map keys", async () => {
      const body = `
        <pre class="cddl">
          delivery = {
            address: tstr,
            city: tstr,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-key-delivery-address");
      expect(dfn).toBeTruthy();
      expect(dfn.localName).toBe("dfn");
      expect(dfn.dataset.dfnType).toBe("cddl-key");
      expect(dfn.dataset.dfnFor).toBe("delivery");
    });

    it("creates dfn elements for string values in type choices", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" / "necktie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-value-attire-bow-tie");
      expect(dfn).toBeTruthy();
      expect(dfn.localName).toBe("dfn");
      expect(dfn.dataset.dfnType).toBe("cddl-value");
      expect(dfn.dataset.dfnFor).toBe("attire");
    });

    it("links duplicate type names instead of creating duplicate dfns", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" / "necktie"
          attire /= "casual"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfns = doc.querySelectorAll("dfn[data-dfn-type='cddl-type']");
      // Only one dfn for "attire", the second occurrence should be a link
      const attireDfns = [...dfns].filter(d => d.textContent === "attire");
      expect(attireDfns).toHaveSize(1);
    });

    it("marks definitions as exported", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-type-attire");
      expect(dfn.hasAttribute("data-export")).toBe(true);
    });
  });

  describe("prelude type linking", () => {
    it("links prelude types to RFC 8610", async () => {
      const body = `
        <pre class="cddl">
          delivery = {
            address: tstr,
            zip: uint,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const links = doc.querySelectorAll("pre.cddl a.cddl-kw");
      expect(links.length).toBeGreaterThanOrEqual(2);
      const tstrLink = [...links].find(a => a.textContent === "tstr");
      expect(tstrLink).toBeTruthy();
      expect(tstrLink.href).toContain("rfc8610");
      expect(tstrLink.dataset.linkSpec).toBe("rfc8610");
    });

    it("links all standard prelude types", async () => {
      const body = `
        <pre class="cddl">
          test = {
            a: tstr,
            b: bstr,
            c: int,
            d: uint,
            e: float,
            f: bool,
            g: true,
            h: false,
            i: nil,
            j: null,
            k: any,
            l: bytes,
            m: text,
            n: undefined,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const links = doc.querySelectorAll("pre.cddl a.cddl-kw");
      const linkedNames = [...links].map(a => a.textContent);
      for (const name of [
        "tstr",
        "bstr",
        "int",
        "uint",
        "float",
        "bool",
        "true",
        "false",
        "nil",
        "null",
        "any",
        "bytes",
        "text",
        "undefined",
      ]) {
        expect(linkedNames)
          .withContext(`prelude type "${name}" should be linked`)
          .toContain(name);
      }
    });
  });

  describe("syntax highlighting", () => {
    it("highlights string values", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const strSpan = doc.querySelector(
        "pre.cddl .cddl-str, pre.cddl dfn[data-dfn-type='cddl-value']"
      );
      expect(strSpan).toBeTruthy();
    });

    it("highlights comments", async () => {
      const body = `
        <pre class="cddl">
          ; This is a comment
          attire = "bow tie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const commentSpan = doc.querySelector("pre.cddl .cddl-comment");
      expect(commentSpan).toBeTruthy();
      expect(commentSpan.textContent).toContain("; This is a comment");
    });

    it("highlights operators", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" / "necktie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const opSpans = doc.querySelectorAll("pre.cddl .cddl-op");
      expect(opSpans.length).toBeGreaterThan(0);
    });

    it("highlights control operators", async () => {
      const body = `
        <pre class="cddl">
          name = tstr .size (1..100)
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const ctrlSpan = doc.querySelector("pre.cddl .cddl-ctrl");
      expect(ctrlSpan).toBeTruthy();
      expect(ctrlSpan.textContent).toContain(".size");
    });

    it("highlights occurrence indicators", async () => {
      const body = `
        <pre class="cddl">
          colors = {
            ? primary: tstr,
            * tstr => any,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const occSpans = doc.querySelectorAll("pre.cddl .cddl-occ");
      expect(occSpans.length).toBeGreaterThan(0);
    });

    it("highlights number values", async () => {
      const body = `
        <pre class="cddl">
          max-byte = 255
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const numSpan = doc.querySelector("pre.cddl .cddl-num");
      expect(numSpan).toBeTruthy();
      expect(numSpan.textContent).toContain("255");
    });
  });

  describe("type choices and extension", () => {
    it("handles type choice with /", async () => {
      const body = `
        <pre class="cddl">
          color = "red" / "green" / "blue"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-type-color");
      expect(dfn).toBeTruthy();
      // All three values should be dfns
      const valueDfns = doc.querySelectorAll(
        "dfn[data-dfn-type='cddl-value'][data-dfn-for='color']"
      );
      expect(valueDfns).toHaveSize(3);
    });

    it("handles type extension with /=", async () => {
      const body = `
        <pre class="cddl">
          color = "red" / "green"
          color /= "blue"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfns = doc.querySelectorAll("dfn[data-dfn-type='cddl-type']");
      // Only one dfn for "color" (the /= occurrence links to it)
      const colorDfns = [...dfns].filter(d => d.textContent === "color");
      expect(colorDfns).toHaveSize(1);
    });
  });

  describe("occurrence indicators", () => {
    it("processes all occurrence indicators", async () => {
      const body = `
        <pre class="cddl">
          test = {
            ? optional: tstr,
            * zeroOrMore: tstr,
            + oneOrMore: tstr,
            2*5 bounded: tstr,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // All key names should be dfns
      for (const key of ["optional", "zeroOrMore", "oneOrMore", "bounded"]) {
        const dfn = doc.getElementById(`cddl-key-test-${key.toLowerCase()}`);
        expect(dfn).withContext(`Expected key dfn for "${key}"`).toBeTruthy();
      }
    });
  });

  describe("ranges", () => {
    it("handles inclusive ranges", async () => {
      const body = `
        <pre class="cddl">
          byte = 0..255
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-type-byte");
      expect(dfn).toBeTruthy();
      // Range operator should be highlighted
      const opSpan = doc.querySelector("pre.cddl .cddl-op");
      expect(opSpan).toBeTruthy();
    });

    it("handles exclusive ranges", async () => {
      const body = `
        <pre class="cddl">
          byte = 0...256
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-type-byte");
      expect(dfn).toBeTruthy();
    });
  });

  describe("control operators", () => {
    it("highlights .size control operator", async () => {
      const body = `
        <pre class="cddl">
          name = tstr .size (1..100)
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const ctrl = doc.querySelector("pre.cddl .cddl-ctrl");
      expect(ctrl).toBeTruthy();
      expect(ctrl.textContent).toContain(".size");
    });

    it("highlights .regexp control operator", async () => {
      const body = `
        <pre class="cddl">
          email = tstr .regexp "[a-z]+@[a-z]+\\.[a-z]+"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const ctrl = doc.querySelector("pre.cddl .cddl-ctrl");
      expect(ctrl).toBeTruthy();
      expect(ctrl.textContent).toContain(".regexp");
    });
  });

  describe("tags", () => {
    it("handles CBOR tags", async () => {
      const body = `
        <pre class="cddl">
          my-date = #6.0(tstr)
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-type-my-date");
      expect(dfn).toBeTruthy();
    });
  });

  describe("generics", () => {
    it("handles generic type definitions", async () => {
      const body = `
        <pre class="cddl">
          message&lt;t, v> = {type: t, value: v}
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("cddl-type-message");
      expect(dfn).toBeTruthy();
      // Generic params should be styled
      const params = doc.querySelectorAll("pre.cddl .cddl-param");
      expect(params.length).toBeGreaterThanOrEqual(2);
    });

    it("handles generic type usage", async () => {
      const body = `
        <pre class="cddl">
          message&lt;t, v> = {type: t, value: v}
          msg = message&lt;tstr, uint>
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // "message" on RHS should be a link, not a dfn
      const links = doc.querySelectorAll("a[data-link-type='cddl-type']");
      const messageLinks = [...links].filter(a => a.textContent === "message");
      expect(messageLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("sockets and plugs", () => {
    it("handles type sockets ($name)", async () => {
      const body = `
        <pre class="cddl">
          $extension-point /= my-extension
          my-extension = tstr
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // Socket name should be processed
      expect(doc.querySelector("pre.cddl code")).toBeTruthy();
    });
  });

  describe("member key variants", () => {
    it("handles bareword keys", async () => {
      const body = `
        <pre class="cddl">
          point = {
            x: int,
            y: int,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const xDfn = doc.getElementById("cddl-key-point-x");
      expect(xDfn).toBeTruthy();
      expect(xDfn.dataset.dfnFor).toBe("point");
    });

    it("handles arrow key syntax", async () => {
      const body = `
        <pre class="cddl">
          headers = {
            * tstr => tstr,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // Arrow key maps should render without errors
      expect(doc.querySelector("pre.cddl code")).toBeTruthy();
    });
  });

  describe("byte strings", () => {
    it("handles byte string literals", async () => {
      const body = `
        <pre class="cddl">
          greeting = 'hello'
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const bytesSpan = doc.querySelector("pre.cddl .cddl-bytes");
      expect(bytesSpan).toBeTruthy();
    });

    it("handles hex byte strings", async () => {
      const body = `
        <pre class="cddl">
          magic = h'48656C6C6F'
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const bytesSpan = doc.querySelector("pre.cddl .cddl-bytes");
      expect(bytesSpan).toBeTruthy();
    });
  });

  describe("comments", () => {
    it("preserves and highlights comments", async () => {
      const body = `
        <pre class="cddl">
          ; This defines clothing
          attire = "bow tie" ; formal only
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const comments = doc.querySelectorAll("pre.cddl .cddl-comment");
      expect(comments.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("inline syntax {^ ^}", () => {
    it("creates link for {^typename^}", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" / "necktie"
        </pre>
        <p>The {^attire^} type defines clothing.</p>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const link = doc.querySelector("p a[data-link-type='cddl-type']");
      expect(link).toBeTruthy();
      expect(link.textContent).toBe("attire");
    });

    it("creates link for {^type/key^}", async () => {
      const body = `
        <pre class="cddl">
          delivery = {
            address: tstr,
          }
        </pre>
        <p>The {^delivery/address^} key holds the street.</p>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const link = doc.querySelector("p a[data-link-type='cddl-key']");
      expect(link).toBeTruthy();
      expect(link.textContent).toBe("address");
      expect(link.dataset.xrefFor || link.dataset.linkFor).toBe("delivery");
    });

    it('creates link for {^type/"value"^}', async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie" / "necktie"
        </pre>
        <p>The {^attire/"bow tie"^} value means formal.</p>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const link = doc.querySelector("p a[data-link-type='cddl-value']");
      expect(link).toBeTruthy();
      expect(link.textContent).toContain("bow tie");
    });

    it("wraps inline references in <code>", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
        <p>See {^attire^} for details.</p>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const code = doc.querySelector("p code a[data-link-type='cddl-type']");
      expect(code).toBeTruthy();
    });

    it("warns once for unresolved inline CDDL refs", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
        <p>See {^missing-type^} for details.</p>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const unresolved = doc.querySelector("p a[data-no-link-to-dfn]");
      expect(unresolved).toBeTruthy();
      expect(warningsFilter(doc)).toHaveSize(1);
      expect(warningsFilter(doc)[0].message).toContain(
        "no definition found for `missing-type`"
      );
      expect(linkToDfnWarningsFilter(doc)).toHaveSize(0);
    });
  });

  describe("prose-level definitions", () => {
    it("normalizes dfn[cddl-type] to data-dfn-type", async () => {
      const body = `
        <p>The <dfn cddl-type>attire</dfn> type represents clothing.</p>
        <pre class="cddl">
          attire = "bow tie" / "necktie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("dfn[data-dfn-type='cddl-type']");
      expect(dfn).toBeTruthy();
      expect(dfn.textContent).toBe("attire");
      // CDDL block should link to the prose dfn, not create a duplicate
      const blockDfns = doc.querySelectorAll(
        "pre.cddl dfn[data-dfn-type='cddl-type']"
      );
      const attireBlockDfns = [...blockDfns].filter(
        d => d.textContent === "attire"
      );
      expect(attireBlockDfns).toHaveSize(0);
    });

    it("normalizes dfn[cddl-key] with for attribute", async () => {
      const body = `
        <p>The <dfn cddl-key for="delivery">address</dfn> key.</p>
        <pre class="cddl">
          delivery = {
            address: tstr,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector(
        "dfn[data-dfn-type='cddl-key'][data-dfn-for='delivery']"
      );
      expect(dfn).toBeTruthy();
    });
  });

  describe("modules", () => {
    it("supports data-cddl-module attribute", async () => {
      const body = `
        <pre class="cddl" data-cddl-module="local end">
          Command = { method: tstr }
        </pre>
        <pre class="cddl" data-cddl-module="remote end">
          Event = { type: tstr }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // Both blocks should be processed
      expect(doc.getElementById("cddl-type-command")).toBeTruthy();
      expect(doc.getElementById("cddl-type-event")).toBeTruthy();
    });
  });

  describe("CDDL index", () => {
    it("populates section#cddl-index", async () => {
      const body = `
        ${makeDefaultBody()}
        <section>
          <h2>Types</h2>
          <pre class="cddl">
            attire = "bow tie" / "necktie"
          </pre>
        </section>
        <section id="cddl-index"></section>
        <section id="conformance"></section>
      `;
      const ops = {
        config: makeBasicConfig(),
        body,
      };
      const doc = await makeRSDoc(ops);
      const indexSec = doc.getElementById("cddl-index");
      expect(indexSec).toBeTruthy();
      const indexPre = indexSec.querySelector("pre");
      expect(indexPre).toBeTruthy();
      expect(indexPre.textContent).toContain("attire");
    });

    it("shows message when no CDDL is defined", async () => {
      const body = `
        <section id="cddl-index"></section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const indexSec = doc.getElementById("cddl-index");
      expect(indexSec.textContent).toContain(
        "doesn't normatively declare any CDDL"
      );
    });

    it("adds a heading when only nested headings are present", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
        <section id="cddl-index">
          <section><h3>Nested heading</h3></section>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const indexSec = doc.getElementById("cddl-index");
      const heading = indexSec.querySelector("h2");
      expect(heading).toBeTruthy();
      expect(heading.textContent).toContain("CDDL Index");
    });

    it("does not duplicate actual-cddl-index id for module sections", async () => {
      const body = `
        <pre class="cddl" data-cddl-module="local end">
          Command = { method: tstr }
        </pre>
        <pre class="cddl" data-cddl-module="remote end">
          Event = { type: tstr }
        </pre>
        <section id="cddl-index"></section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      expect(
        doc.querySelectorAll("section#cddl-index pre#actual-cddl-index")
      ).toHaveSize(0);
    });
  });

  describe("highlight.js exclusion", () => {
    it("does not apply highlight.js to CDDL blocks", async () => {
      const body = `
        <pre class="cddl">
          attire = "bow tie"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const pre = doc.querySelector("pre.cddl");
      // highlight.js adds hljs class — should NOT be present
      expect(pre.classList.contains("hljs")).toBe(false);
    });
  });

  describe("forward references", () => {
    it("resolves forward references across CDDL blocks", async () => {
      const body = `
        <pre class="cddl">
          delivery = {
            method: shipping,
          }
        </pre>
        <pre class="cddl">
          shipping = "ground" / "express" / "overnight"
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // "shipping" in the first block should eventually be linked
      const links = doc.querySelectorAll("a[data-link-type='cddl-type']");
      const shippingLinks = [...links].filter(
        a => a.textContent === "shipping"
      );
      expect(shippingLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("complex real-world patterns", () => {
    it("handles WebDriver BiDi-style definitions", async () => {
      const body = `
        <pre class="cddl" data-cddl-module="local end">
          Command = {
            id: uint,
            method: tstr,
            params: any,
          }
        </pre>
        <pre class="cddl" data-cddl-module="remote end">
          CommandResponse = {
            id: uint,
            result: any,
          }
          ErrorResponse = {
            id: uint,
            error: tstr,
            message: tstr,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      expect(doc.getElementById("cddl-type-command")).toBeTruthy();
      expect(doc.getElementById("cddl-type-commandresponse")).toBeTruthy();
      expect(doc.getElementById("cddl-type-errorresponse")).toBeTruthy();
    });

    it("handles multiple CDDL blocks referencing each other", async () => {
      const body = `
        <pre class="cddl">
          person = {
            name: tstr,
            address: postal-address,
          }
        </pre>
        <pre class="cddl">
          postal-address = {
            street: tstr,
            city: tstr,
            zip: uint,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      expect(doc.getElementById("cddl-type-person")).toBeTruthy();
      expect(doc.getElementById("cddl-type-postal-address")).toBeTruthy();
    });

    it("handles nested maps and arrays", async () => {
      const body = `
        <pre class="cddl">
          config = {
            servers: [+ server],
            options: {
              timeout: uint,
              retries: uint,
            },
          }
          server = {
            host: tstr,
            port: uint,
          }
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      expect(doc.getElementById("cddl-type-config")).toBeTruthy();
      expect(doc.getElementById("cddl-type-server")).toBeTruthy();
    });
  });
});
