"use strict";

import {
  flushIframes,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../../SpecHelper.js";

describe("Core — linter-rules - prefer-xref", () => {
  const name = "core/linter-rules/prefer-xref";
  const lintWarnings = warningFilters.filter(name);

  afterAll(() => {
    flushIframes();
  });

  it("does not warn when the rule is turned off", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="HTML#the-a-element">a element</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": false }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    expect(lintWarnings(doc)).toHaveSize(0);
  });

  it("does not warn when xref is not enabled", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="HTML#the-a-element">a element</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: false },
      body
    );
    const doc = await makeRSDoc(ops);
    expect(lintWarnings(doc)).toHaveSize(0);
  });

  it("does not warn when xref is enabled with no spec list (xref: true)", async () => {
    // When xref=true we cannot determine coverage without a network call,
    // so we conservatively skip the check.
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="HTML#the-a-element">a element</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: true },
      body
    );
    const doc = await makeRSDoc(ops);
    expect(lintWarnings(doc)).toHaveSize(0);
  });

  it("warns for data-cite with fragment on a spec in the xref profile", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="HTML#the-a-element">a element</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("HTML");
  });

  it("warns once per spec key, grouping all offending elements together", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="HTML#the-a-element">a element</a></p>
        <p><a data-cite="HTML#the-p-element">p element</a></p>
        <p><a data-cite="INFRA#list">list</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    // One warning per spec key (HTML and INFRA each get one warning).
    expect(warnings).toHaveSize(2);
    const specKeys = warnings.map(w => w.message).join(" ");
    expect(specKeys).toContain("HTML");
    expect(specKeys).toContain("INFRA");
  });

  it("does not warn for data-cite without a fragment (context-only use)", async () => {
    // data-cite="HTML" (no #) is a legitimate context hint — xref uses it.
    const body = `
      <section data-cite="HTML">
        <h2>Test</h2>
        <p><a>event handler</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    expect(lintWarnings(doc)).toHaveSize(0);
  });

  it("does not warn for specs not in the configured xref list", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="SOME-OTHER-SPEC#a-fragment">some term</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    expect(lintWarnings(doc)).toHaveSize(0);
  });

  it("warns for specs in a custom xref array", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="MYSPEC#some-term">some term</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: ["MYSPEC"] },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("MYSPEC");
  });

  it("warns for specs in a custom xref object with specs array", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="DOM#eventtarget">EventTarget</a></p>
      </section>`;
    const ops = makeStandardOps(
      {
        lint: { "prefer-xref": true },
        xref: { profile: "web-platform", specs: ["DOM"] },
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("DOM");
  });

  it("ignores elements with class='lint-ignore'", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a class="lint-ignore" data-cite="HTML#the-a-element">a element</a></p>
        <p><a data-cite="HTML#the-p-element">p element</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    // Only the second element (without lint-ignore) should warn.
    expect(warnings).toHaveSize(1);
    expect(warnings[0].elements).toHaveSize(1);
  });

  it("handles case-insensitive spec key matching", async () => {
    // Authors may write lowercase "html" — should still match "HTML" in the profile.
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="html#the-a-element">a element</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    expect(warnings).toHaveSize(1);
  });

  it("handles informative prefix '?' in data-cite value", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><a data-cite="?HTML#the-a-element">a element</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("HTML");
  });

  it("warns for dfn elements with data-cite fragment in xref specs", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <p><dfn data-cite="WEBIDL#dfn-interface">interface</dfn></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = lintWarnings(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].message).toContain("WEBIDL");
  });

  it("does not warn for self-referencing data-cite (data-cite='#foo')", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn id="something">something</dfn>
        <p><a data-cite="#something">something</a></p>
      </section>`;
    const ops = makeStandardOps(
      { lint: { "prefer-xref": true }, xref: "web-platform" },
      body
    );
    const doc = await makeRSDoc(ops);
    expect(lintWarnings(doc)).toHaveSize(0);
  });
});
