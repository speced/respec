"use strict";
describe("Core Linter Rule - 'no-headingless-sections'", () => {
  const ruleName = "no-headingless-sections";
  const config = {
    lint: { [ruleName]: true },
  };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require([`core/linter-rules/${ruleName}`], ({ rule }) => resolve(rule));
    });
  });
  const doc = document.implementation.createHTMLDocument("test doc");
  it("returns error when heading is missing section", async () => {
    const section = doc.createElement("section");
    doc.body.appendChild(section);
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(1);
    const result = results[0];
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
  it("doesn't complain when sections do have a heading", async () => {
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
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(0);
  });
  it("complains when a nested section doesn't have a heading", async () => {
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
    const results = await rule.lint(config, doc);
    const [result] = results;
    expect(result.offendingElements.length).toEqual(1);
    expect(result.offendingElements[0]).toEqual(badone);
  });
});
