"use strict";

import {
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../../../spec/SpecHelper.js";

describe("Core Linter Rule - 'no-headingless-sections'", () => {
  const warningsFilter = warningFilters.filter(
    "core/linter-rules/no-headingless-sections"
  );
  const config = { lint: { "no-headingless-sections": true } };

  it("warns when heading is missing section", async () => {
    const body = `<section id="test"></section>`;
    const opts = makeStandardOps(config, body);
    const doc = await makeRSDoc(opts);
    const warnings = warningsFilter(doc);

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
    const opts = makeStandardOps(config, body);
    const doc = await makeRSDoc(opts);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(0);
  });

  it("doesn't show a warning when sections have unwrapped headings", async () => {
    const body = `
      <section>
        <h2>test</h2>
        <section>
          <h3>Test</h3>
          <section>
            <h4>Test</h4>
          </section>
        </section>
      </section>
    `;
    const opts = makeStandardOps({ addSectionLinks: false, ...config }, body);
    const doc = await makeRSDoc(opts);
    const warnings = warningsFilter(doc);
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
    const opts = makeStandardOps(config, body);
    const doc = await makeRSDoc(opts);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(1);
    expect(warnings[0].elements).toHaveSize(1);
    expect(warnings[0].elements[0].id).toBe("badone");
  });
});
