"use strict";

import {
  flushIframes,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../../SpecHelper.js";

const warningsFilter = warningFilters.filter("core/diagrams");

describe("Core - Diagrams - uncaptioned diagram warning", () => {
  afterAll(flushIframes);

  it("warns when diagram is outside a figure", async () => {
    const body = `<pre class="mermaid">flowchart LR</pre>`;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const warnings = warningsFilter(doc);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    const match = warnings.find(w =>
      w.message.includes("must be wrapped in a `<figure>`")
    );
    expect(match).toBeTruthy();
  });

  it("warns when figure is missing a figcaption", async () => {
    const body = `<figure><pre class="mermaid">flowchart LR</pre></figure>`;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const warnings = warningsFilter(doc);
    const match = warnings.find(w =>
      w.message.includes("must be wrapped in a `<figure>`")
    );
    expect(match).toBeTruthy();
  });

  it("does not warn when diagram is in a figure with figcaption", async () => {
    const body = `
      <figure>
        <pre class="mermaid">flowchart LR</pre>
        <figcaption>Test</figcaption>
      </figure>
    `;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const warnings = warningsFilter(doc);
    const match = warnings.find(w =>
      w.message.includes("must be wrapped in a `<figure>`")
    );
    expect(match).toBeFalsy();
  });
});
