"use strict";

import { makePluginDoc } from "../../SpecHelper.js";

describe("W3C Linter Rule - 'privsec-section'", () => {
  const modules = [`/src/core/linter-rules/privsec-section.js`];

  async function getWarnings(body) {
    const config = { isRecTrack: true, lint: { "privsec-section": true } };
    const doc = await makePluginDoc(modules, { config, body });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/privsec-section"
    );
  }

  it("returns errors when missing privacy section", async () => {
    const warnings = await getWarnings("");
    expect(warnings).toHaveSize(1);
    const [warning] = warnings;
    expect(warning.message).toContain(
      `must have a 'Privacy and/or Security' Considerations`
    );
  });

  it("finds privacy section", async () => {
    const body = `<h2>the privacy of things</h2>`;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("finds just security sections", async () => {
    const body = `<h2>security of things</h2>`;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("ignores only considerations sections", async () => {
    const body = `<h2>Considerations for other things</h2>`;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(1);
  });

  it("finds privacy considerations sections", async () => {
    const body = `<h2>Considerations of privacy of things</h2>`;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("finds security considerations sections", async () => {
    const body = `<h2>Considerations of security of things</h2>`;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("finds privacy and security considerations sections, irrespective of order", async () => {
    expect(
      await getWarnings(`<h2>Privacy and Security Considerations</h2>`)
    ).toHaveSize(0);
    expect(
      await getWarnings(`<h2>Security and Privacy Considerations</h2>`)
    ).toHaveSize(0);
    expect(
      await getWarnings(`<h2>Considerations Security Privacy</h2>`)
    ).toHaveSize(0);
  });

  it("finds privacy and security considerations case insensitive", async () => {
    expect(
      await getWarnings(`<h2>Privacy and Security Considerations</h2>`)
    ).toHaveSize(0);
    expect(
      await getWarnings(`<h2>PRIVACY and Security Considerations</h2>`)
    ).toHaveSize(0);
    expect(
      await getWarnings(`<h2>PriVacy and SECURITY Considerations</h2>`)
    ).toHaveSize(0);
    expect(
      await getWarnings(`<h2>PRIVACY AND SECURITY CONSIDERATIONS</h2>`)
    ).toHaveSize(0);
    expect(
      await getWarnings(`<h2>privacy considerations security</h2>`)
    ).toHaveSize(0);
  });
});
