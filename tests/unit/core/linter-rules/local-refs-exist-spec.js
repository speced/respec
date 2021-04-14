"use strict";

import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'local-refs-exist'", () => {
  const modules = [`/src/core/linter-rules/local-refs-exist.js`];

  async function getWarnings(body) {
    const config = { lint: { "local-refs-exist": true } };
    const doc = await makePluginDoc(modules, { config, body });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/local-refs-exist"
    );
  }

  it("returns error when a link is broken", async () => {
    const body = `
      <section id="ID">M/section>
      <a href="#ID">PASS</a>
      <a href="#ID-NOT-EXIST">FAIL</a>
      <a href="#ID-NOT-EXIST">FAIL</a>
    `;

    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(1);

    const [warning] = warnings;
    expect(warning.elements).toHaveSize(2);
    const [offendingElement] = warning.elements;
    const { hash } = new URL(offendingElement.href);
    expect(hash).toBe("#ID-NOT-EXIST");
  });

  it("doesn't complain when all links are fine", async () => {
    const body = `
      <section id="ID">PASS</section>
      <a href="#ID">PASS</a>
    `;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("handles unicode characters in ID", async () => {
    const body = `
      <section id="přehled">PASS</section>
      <a href="#přehled">PASS</a>
    `;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("handles named anchors", async () => {
    const body = `
      <a name="NAME">PASS</a>
      <a href="#NAME">PASS</a>
      <a href="#NAME-NOT-EXIST">FAIL</a>
    `;

    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(1);

    const [warning] = warnings;
    expect(warning.elements).toHaveSize(1);
    const [offendingElement] = warning.elements;
    const { hash } = new URL(offendingElement.href);
    expect(hash).toBe("#NAME-NOT-EXIST");
  });
});
