"use strict";

import {
  flushIframes,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../../SpecHelper.js";

const warningsFilter = warningFilters.filter(
  "core/linter-rules/no-uncaptioned-diagram"
);

describe("Core Linter Rule - 'no-uncaptioned-diagram'", () => {
  afterAll(flushIframes);

  it("warns when diagram is outside a figure", async () => {
    const body = `<pre class="mermaid">flowchart LR</pre>`;
    const ops = makeStandardOps(
      { lint: { "no-uncaptioned-diagram": true } },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(1);
  });

  it("warns when figure is missing a figcaption", async () => {
    const body = `<figure><pre class="mermaid">flowchart LR</pre></figure>`;
    const ops = makeStandardOps(
      { lint: { "no-uncaptioned-diagram": true } },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(1);
  });

  it("does not warn when diagram is in a figure with figcaption", async () => {
    const body = `
      <figure>
        <pre class="mermaid">flowchart LR</pre>
        <figcaption>Test</figcaption>
      </figure>
    `;
    const ops = makeStandardOps(
      { lint: { "no-uncaptioned-diagram": true } },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(0);
  });

  it("does not warn when disabled", async () => {
    const body = `<pre class="mermaid">flowchart LR</pre>`;
    const ops = makeStandardOps(
      { lint: { "no-uncaptioned-diagram": false } },
      body
    );
    const doc = await makeRSDoc(ops);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(0);
  });
});
