"use strict";
import { flushIframes, makeRSDoc, makeStandardOps } from "../../SpecHelper.js";

describe("Core — no-dfn-in-abstract", () => {
  afterAll(flushIframes);

  it("does nothing when rule is disabled (default)", async () => {
    const body = `
      <section id="abstract">
        <p>This spec defines <dfn>my-term</dfn>.</p>
      </section>
      <section id="content"><h2>Content</h2></section>`;
    // lint: true enables the linter but this rule is not opted in — verifies opt-in behaviour
    const ops = makeStandardOps({ lint: true }, body);
    const doc = await makeRSDoc(ops);
    expect(
      doc.respec.warnings.filter(w => w.plugin.includes("no-dfn-in-abstract"))
    ).toHaveSize(0);
  });

  it("warns when a <dfn> is in the abstract and rule is enabled", async () => {
    const body = `
      <section id="abstract">
        <p>This spec defines <dfn>my-term</dfn>.</p>
      </section>
      <section id="content"><h2>Content</h2></section>`;
    const ops = makeStandardOps({ lint: { "no-dfn-in-abstract": true } }, body);
    const doc = await makeRSDoc(ops);
    const warnings = doc.respec.warnings.filter(w =>
      w.plugin.includes("no-dfn-in-abstract")
    );
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("my-term");
    expect(warnings[0].hint).toContain("Terminology");
  });

  it("warns for dfns in SotD section", async () => {
    const body = `
      <section id="abstract"><p>Abstract.</p></section>
      <section id="sotd">
        <p>Status. The <dfn>key concept</dfn> is defined here.</p>
      </section>
      <section id="content"><h2>Content</h2></section>`;
    const ops = makeStandardOps({ lint: { "no-dfn-in-abstract": true } }, body);
    const doc = await makeRSDoc(ops);
    const warnings = doc.respec.warnings.filter(w =>
      w.plugin.includes("no-dfn-in-abstract")
    );
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("key concept");
  });

  it("does not warn for dfns in numbered sections", async () => {
    const body = `
      <section id="abstract"><p>Abstract.</p></section>
      <section>
        <h2>Terminology</h2>
        <p>The <dfn>my-term</dfn> is defined here.</p>
      </section>`;
    const ops = makeStandardOps({ lint: { "no-dfn-in-abstract": true } }, body);
    const doc = await makeRSDoc(ops);
    const warnings = doc.respec.warnings.filter(w =>
      w.plugin.includes("no-dfn-in-abstract")
    );
    expect(warnings).toHaveSize(0);
  });
});
