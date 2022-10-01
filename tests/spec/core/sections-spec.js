"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — sections", () => {
  afterAll(flushIframes);

  it("wraps headings in sections elements and assigns an id", async () => {
    const body = `
      <h2 id="h2">Section 2</h2>
      <h3 id="h3">Section 3</h3>
      <h4 id="h4">Section 4</h4>
      <h5 id="h5">Section 5</h5>
      <h6 id="h6">Section 6</h6>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    for (let i = 2; i <= 6; i++) {
      const context = `h${i}`;
      const h = doc.getElementById(context);
      const section = h.parentElement.parentElement;
      expect(section.localName).withContext(context).toBe("section");
      expect(section.id).withContext(context).toBe(`section-${i}`);
    }
  });

  it("handles when some headings are wrapped", async () => {
    const body = `
      <h2 id="h2">Section 2</h2>
      <section>
        <h3 id="h3">Section 3</h3>
        <section>
          <h4 id="h4">Section 4</h4>
          <h5 id="h5">Section 5</h5>
          <section>
            <h6 id="h6">Section 6</h6>
          </section>
        </section>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    for (let i = 2; i <= 6; i++) {
      const h = doc.getElementById(`h${i}`);
      const section = h.parentElement.parentElement;
      expect(section.localName).toBe("section");
      expect(section.id).toBe(`section-${i}`);
    }
  });

  it("retains different nodes when wrapping", async () => {
    const body = `
      <h2 id="h2">Section 2</h2>
      <p>paragraph 2</p><!--comment 2-->
      <h3 id="h3">Section 3</h3>
      <p>paragraph 3</p><!--comment 3-->
      <h4 id="h4">Section 4</h4>
      <p>paragraph 4</p><!--comment 4-->
      <h5 id="h5">Section 5</h5>
      <p>paragraph 5</p><!--comment 5-->
      <h6 id="h6">Section 6</h6>
      <p>paragraph 6</p><!--comment 6-->
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    for (let i = 2; i <= 6; i++) {
      const p = doc
        .querySelector(`#h${i}`)
        .closest("section")
        .querySelector("p");
      expect(p.textContent).toBe(`paragraph ${i}`);
      const comment = p.nextSibling;
      expect(comment.nodeType).toBe(Node.COMMENT_NODE);
      expect(comment.textContent).toBe(`comment ${i}`);
    }
  });

  it("doesn't wrap the spec title", async () => {
    const body = `
      <h1 id="title">Spec title</h1>
      <h2 id="other">Some section</h2>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const title = doc.getElementById("title");
    expect(title.closest("div.head")).toBeTruthy();
    expect(title.closest("section")).toBeNull();
    const h2 = doc.getElementById("other");
    expect(h2.closest("section")).toBeTruthy();
  });
});
