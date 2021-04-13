"use strict";

import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'no-headingless-sections'", () => {
  const modules = [`/src/core/linter-rules/no-headingless-sections.js`];

  async function getWarnings(body) {
    const config = { lint: { "no-headingless-sections": true } };
    const doc = await makePluginDoc(modules, { config, body });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/no-headingless-sections"
    );
  }

  it("returns error when heading is missing section", async () => {
    const body = `<section id="test"></section>`;
    const warnings = await getWarnings(body);

    expect(warnings).toHaveSize(1);
    const [warning] = warnings;

    expect(warning.elements).toHaveSize(1);
    expect(warning.elements[0].id).toBe("test");
    expect(warning.message).toContain("sections must start with a `h2-6`");
  });

  it("doesn't complain when sections do have a heading", async () => {
    const body = `
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
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("complains when a nested section doesn't have a heading", async () => {
    const body = `
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
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].elements).toHaveSize(1);
    expect(warnings[0].elements[0].id).toBe("badone");
  });
});
