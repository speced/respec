"use strict";

import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'no-unused-vars'", () => {
  const modules = [`/src/core/linter-rules/no-unused-vars.js`];

  async function getWarnings(body) {
    const config = { lint: { "no-unused-vars": true } };
    const doc = await makePluginDoc(modules, { config, body });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/no-unused-vars"
    );
  }

  it("skips sections without .algorithm", async () => {
    const body = `
      <section>
        <p><var>varA</var></p>
        <section>
          <p><var>varC</var></p>
        </section>
      </section>
    `;

    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("complains on unused vars", async () => {
    const body = `
      <section>
        <p><var>A</var>  is unused</p>
        <p><var>B</var></p>
        <p><var>Z</var> is unused</p>
        <ul class="algorithm">
          <li><var>B</var></li>
          <li><var>C</var> is unused</li>
          <li><var>D</var></li>
          <li><var>D</var></li>
        </ul>
        <section>
          <p><var>E</var> is unused</p>
          <ul class="algorithm">
            <li><var>F</var> is unused</li>
            <li><var>G</var></li>
            <li><var>G</var></li>
            <li><var>Z</var> is unused even though it's used in grandparent</li>
          </ul>
        </section>
      </section>
    `;

    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(1);

    const [{ elements }] = warnings;
    const unusedVars = elements.map(v => v.textContent);
    expect(unusedVars).toEqual(["A", "Z", "C", "E", "F", "Z"]);
  });

  it("ignores unused vars with data-ignore-unused", async () => {
    const body = `
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

    const [warning] = await getWarnings(body);
    expect(warning.elements).toHaveSize(1);
    const unusedVars = warning.elements.map(v => v.textContent);
    expect(unusedVars).toEqual(["varB"]);
  });
});
