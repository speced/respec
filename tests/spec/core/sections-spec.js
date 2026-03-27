"use strict";

import {
  flushIframes,
  html,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — sections", () => {
  afterAll(flushIframes);

  it("wraps headings in sections elements and assigns an id", async () => {
    const body = html`
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
    const body = html`
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

  it("copies only special header classes from the header to the section", async () => {
    const body = html`
      <h2 id="h2" class="appendix informative nocopy">Section 2</h2>
      <h3 id="h3" class="notoc">Section 3</h3>
      <h4 id="h4" class="informative">Section 4</h4>
      <h5 id="h5" class="appendix">Section 5</h5>
      <h6 id="h6" class="notoc informative">Section 6</h6>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const section2 = doc.getElementById("h2").closest("section");
    expect(section2.classList).toContain("appendix");
    expect(section2.classList).toContain("informative");
    expect(section2.classList).not.toContain("nocopy");

    const section3 = doc.getElementById("h3").closest("section");
    expect(section3.classList).toContain("notoc");
    expect(section3.classList).not.toContain("appendix");
    expect(section3.classList).not.toContain("informative");

    const section4 = doc.getElementById("h4").closest("section");
    expect(section4.classList).toContain("informative");
    expect(section4.classList).not.toContain("appendix");
    expect(section4.classList).not.toContain("notoc");

    const section5 = doc.getElementById("h5").closest("section");
    expect(section5.classList).toContain("appendix");
    expect(section5.classList).not.toContain("informative");
    expect(section5.classList).not.toContain("notoc");

    const section6 = doc.getElementById("h6").closest("section");
    expect(section6.classList).toContain("notoc");
    expect(section6.classList).toContain("informative");
    expect(section6.classList).not.toContain("appendix");
  });

  it("treats informative section as non-normative section", async () => {
    const body = html`
      <h2 id="h2" class="informative">Informative Section</h2>
      <p>Testing</p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const section = doc.getElementById("h2").closest("section");
    expect(section.classList).toContain("informative");

    // Expect the first p to be "This section is non-normative."
    const em = section.querySelector("p");
    expect(em.textContent).toBe("This section is non-normative.");

    // check second child of section is the p with the content.
    const p = em.nextElementSibling;
    expect(p.localName).toBe("p");
    expect(p.textContent).toBe("Testing");
  });

  it("treats informative appendix as an appendix", async () => {
    const body = html`
      <h2 id="h2" class="appendix informative">Appendix A</h2>
      <p>Testing</p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const section = doc.getElementById("h2").closest("section");
    expect(section.classList).toContain("appendix");

    const heading = section.querySelector("#h2");
    expect(heading.localName).toBe("h2");
    expect(heading.textContent).toBe("A. Appendix A");

    const pNonNormative = section.querySelector("p:first-of-type");
    expect(pNonNormative.textContent).toBe("This section is non-normative.");

    // Expect the first p to be "This section is non-normative."
    const p = section.querySelector("p:last-of-type");
    expect(p.localName).toBe("p");
    expect(p.textContent).toBe("Testing");
  });

  it("doesn't wrap the spec title", async () => {
    const body = html`
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
