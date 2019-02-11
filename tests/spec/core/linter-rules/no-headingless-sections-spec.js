"use strict";
import { rule } from  '../../../../src/core/linter-rules/no-headingless-sections.js';
describe("Core Linter Rule - 'no-headingless-sections'", () => {
  const ruleName = "no-headingless-sections";
  const config = {
    lint: { [ruleName]: true },
  };

  const doc = document.implementation.createHTMLDocument("test doc");
  beforeEach(() => {
    // Make sure every unordered test get an empty document
    // See: https://github.com/w3c/respec/pull/1495
    while (doc.body.firstChild) {
      doc.body.removeChild(doc.body.firstChild);
    }
  });
  test("returns error when heading is missing section", async () => {
    const section = doc.createElement("section");
    doc.body.appendChild(section);
    const result = await rule.lint(config, doc);
    expect(result).toEqual({
      name: ruleName,
      offendingElements: [section],
      occurrences: 1,
      description: "All sections must start with a `h2-6` element.",
      howToFix: "Add a `h2-6` to the offending section or use a `<div>`.",
      help: "See developer console.",
    });
    section.remove();
  });
  test("doesn't complain when sections do have a heading", async () => {
    doc.body.innerHTML = `
        <section>
          <h2>test</h2>
          <section>
            <h3>Test</h3>
          </section>
          <section>
            <h3>Test</h3>
          </section>
        </section>
    `;
    const result = await rule.lint(config, doc);
    expect(result).toBeUndefined();
  });
  test("complains when a nested section doesn't have a heading", async () => {
    doc.body.innerHTML = `
        <section>
          <h2>test</h2>
          <section>
            <h3>Test</h3>
          </section>
          <section id="badone">
            <p></p>
          </section>
        </section>
    `;
    const badone = doc.getElementById("badone");
    const result = await rule.lint(config, doc);
    expect(result.offendingElements.length).toEqual(1);
    expect(result.offendingElements[0]).toEqual(badone);
  });
});
