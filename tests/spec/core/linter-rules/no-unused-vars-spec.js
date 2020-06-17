"use strict";

import { rule } from "../../../../src/core/linter-rules/no-unused-vars.js";

describe("Core Linter Rule - 'no-unused-vars'", () => {
  const config = {
    lint: { "no-unused-vars": true },
  };
  const doc = document.implementation.createHTMLDocument("test doc");
  beforeEach(() => {
    // Make sure every unordered test get an empty document
    // See: https://github.com/w3c/respec/pull/1495
    while (doc.body.firstChild) {
      doc.body.removeChild(doc.body.firstChild);
    }
  });

  it("skips sections without .algorithm", async () => {
    doc.body.innerHTML = `
      <section>
        <p><var>varA</var></p>
        <div>
          <ul class="algorithm">
            <li><var>varB</var></li>
          </ul>
        </div>
        <section>
          <p><var>varC</var></p>
        </section>
      </section>
    `;

    const result = await rule.lint(config, doc);
    expect(result).toBeUndefined();
  });

  it("complains on unused vars", async () => {
    doc.body.innerHTML = `
      <section>
        <p><var>varA</var>  is unused</p>
        <ul class="algorithm">
          <li><var>varB</var> is unused</li>
          <li><var>varC</var></li>
          <li><var>varC</var></li>
        </ul>
        <section>
          <p><var>varD</var></p>
          <ul class="algorithm">
            <li><var>varE</var></li>
            <li><var>varF</var></li>
            <li><var>varF</var></li>
          </ul>
        </section>
      </section>
    `;

    const result = await rule.lint(config, doc);
    expect(result.name).toBe("no-unused-vars");
    expect(result.occurrences).toBe(4);
    const unusedVars = result.offendingElements.map(v => v.textContent);
    expect(unusedVars).toEqual(["varA", "varB", "varD", "varE"]);
  });

  it("ignores unused vars with data-ignore-unused", async () => {
    doc.body.innerHTML = `
      <section>
        <p><var data-ignore-unused>varA</var>  is unused</p>
        <ul class="algorithm">
          <li><var>varB</var> is unused</li>
          <li><var data-ignore-unused>varC</var> is unused</li>
          <li><var>varD</var></li>
          <li><var>varD</var></li>
        </ul>
      </section>
    `;

    const result = await rule.lint(config, doc);
    expect(result.name).toBe("no-unused-vars");
    expect(result.occurrences).toBe(1);
    const unusedVars = result.offendingElements.map(v => v.textContent);
    expect(unusedVars).toEqual(["varB"]);
  });
});
