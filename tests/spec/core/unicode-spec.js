"use strict";

import {
  flushIframes,
  html,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — unicode", () => {
  afterAll(flushIframes);

  it("expands single .hx, .ch to codepoint markup", async () => {
    const body = html`<div id="test">
      <span class="hx" lang="fr">00E9</span>
      <span class="ch" lang="fr">é</span>
    </div>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, body),
      "/tests/spec/core/simple.html"
    );

    const expanded = doc.querySelectorAll("#test .codepoint");
    expect(expanded).toHaveSize(2);

    for (let i = 0; i < expanded.length; i++) {
      const context = i === 0 ? "hx" : "ch";
      const elem = expanded[i];

      expect(elem.localName).withContext(context).toBe("span");
      expect(elem.getAttribute("translate")).withContext(context).toBe("no");
      expect(elem.children).withContext(context).toHaveSize(2);
      const [bdi, uname] = elem.children;

      expect(bdi.localName).withContext(context).toBe("bdi");
      expect(bdi.textContent).withContext(context).toBe("é");
      expect(bdi.getAttribute("lang")).withContext(context).toBe("fr");

      expect(uname.localName).withContext(context).toBe("span");
      expect(uname.getAttribute("class")).withContext(context).toBe("uname");
      expect(uname.textContent)
        .withContext(context)
        .toBe("U+00E9 LATIN SMALL LETTER E WITH ACUTE");
    }
  });

  it("expands .hx, .ch sequence to codepoint markup", async () => {
    const body = html`<div id="test">
      <span class="hx" lang="hi">0928 093F</span>
      <span class="ch" lang="hi">नि</span>
    </div>`;
    const doc = await makeRSDoc(
      makeStandardOps(null, body),
      "/tests/spec/core/simple.html"
    );

    const expanded = doc.querySelectorAll("#test .codepoint");
    expect(expanded).toHaveSize(2);
    for (let i = 0; i < expanded.length; i++) {
      const context = i === 0 ? "hx" : "ch";
      const elem = expanded[i];

      expect(elem.getAttribute("translate")).withContext(context).toBe("no");

      expect(elem.children).toHaveSize(3);
      expect(elem.childNodes.length).withContext(context).toBe(4);
      const [bdi, uname1, plusSign, uname2] = elem.childNodes;

      expect(bdi.localName).withContext(context).toBe("bdi");
      expect(bdi.textContent).withContext(context).toBe("नि");
      expect(bdi.getAttribute("lang")).withContext(context).toBe("hi");

      expect(uname1.localName).withContext(context).toBe("span");
      expect(uname1.getAttribute("class")).withContext(context).toBe("uname");
      expect(uname1.textContent)
        .withContext(context)
        .toBe("U+0928 DEVANAGARI LETTER NA");

      expect(plusSign.nodeName).withContext(context).toBe("#text");
      expect(plusSign.textContent).withContext(context).toBe(" + ");

      expect(uname2.localName).withContext(context).toBe("span");
      expect(uname2.getAttribute("class")).withContext(context).toBe("uname");
      expect(uname2.textContent)
        .withContext(context)
        .toBe("U+093F DEVANAGARI VOWEL SIGN I");
    }
  });
});
