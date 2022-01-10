"use strict";

import {
  errorFilters,
  flushIframes,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../../SpecHelper.js";
import { noTrackStatus } from "../../../../src/w3c/headers.js";
import { requiresSomeSectionStatus } from "../../../../src/w3c/linter-rules/required-sections.js";

describe("w3c — required-sections", () => {
  afterAll(() => {
    flushIframes();
  });

  const errorsFilter = errorFilters.filter(
    "w3c/linter-rules/required-sections"
  );
  const warningsFilter = warningFilters.filter(
    "w3c/linter-rules/required-sections"
  );

  it("does nothing if disabled", async () => {
    const ops = makeStandardOps({ lint: { "required-sections": false } });
    const doc = await makeRSDoc(ops);
    const errors = errorsFilter(doc);
    const warnings = warningsFilter(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("allows using 'error' as the logger", async () => {
    const ops = makeStandardOps({ lint: { "required-sections": "error" } });
    const doc = await makeRSDoc(ops);
    const errors = errorsFilter(doc);
    const warnings = warningsFilter(doc);
    expect(errors).toHaveSize(2);
    expect(warnings).toHaveSize(0);
  });

  it("allows using 'warn' as the logger", async () => {
    const ops = makeStandardOps({ lint: { "required-sections": "warn" } });
    const doc = await makeRSDoc(ops);
    const errors = errorsFilter(doc);
    const warnings = warningsFilter(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(2);
  });

  it("doesn't lint non-rec-track docs", async () => {
    for (const specStatus of noTrackStatus) {
      const ops = makeStandardOps({
        lint: { "required-sections": true },
        specStatus,
      });
      const doc = await makeRSDoc(ops);
      const errors = errorsFilter(doc);
      const warnings = warningsFilter(doc);
      expect(errors).withContext(specStatus).toHaveSize(0);
      expect(warnings).withContext(specStatus).toHaveSize(0);
    }
  });

  it("doesn't lint for when explicitly marked as noRecTrack", async () => {
    const ops = makeStandardOps({
      lint: { "required-sections": true },
      noRecTrack: true,
      specStatus: "ED",
    });
    const doc = await makeRSDoc(ops);
    const errors = errorsFilter(doc);
    const warnings = warningsFilter(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("generates warning by default when its a rec track document and both privacy and security sections are missing", async () => {
    for (const specStatus of requiresSomeSectionStatus) {
      const ops = makeStandardOps({
        lint: { "required-sections": true },
        specStatus,
      });
      const doc = await makeRSDoc(ops);
      const errors = errorsFilter(doc);
      const warnings = warningsFilter(doc);
      expect(errors).withContext(specStatus).toHaveSize(0);
      expect(warnings).withContext(specStatus).toHaveSize(2);
    }
  });

  it("generates an error if privacy section if present, but security is missing", async () => {
    const body = `
      <section>
        <h2>Privacy considerations</h2>
        <p>This is a privacy section</p>
      </section>
    `;
    const conf = {
      lint: { "required-sections": "error" },
      specStatus: "WD",
    };
    const doc = await makeRSDoc(makeStandardOps(conf, body));
    const errors = errorsFilter(doc);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(0);
    expect(errors).toHaveSize(1);
    const [error] = errors;
    expect(error.message).toContain(
      'separate "Security Considerations" section'
    );
  });

  it("generates an error if Security section if present, but privacy is missing", async () => {
    const body = `
      <section>
        <h2>Security considerations</h2>
        <p>This is a security section</p>
      </section>
    `;
    const conf = {
      lint: { "required-sections": "error" },
      specStatus: "WD",
    };
    const doc = await makeRSDoc(makeStandardOps(conf, body));
    const errors = errorsFilter(doc);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(0);
    expect(errors).toHaveSize(1);
    const [error] = errors;
    expect(error.message).toContain(
      'separate "Privacy Considerations" section'
    );
  });

  it("generates no errors when both the Privacy and Security considerations sections are present", async () => {
    const body = `
      <section>
        <h2>Privacy Considerations</h2>
        <p>This is a privacy section</p>
      </section>
      <section>
        <h2>Security Considerations</h2>
        <p>This is a security section</p>
      </section>
    `;
    const conf = {
      lint: { "required-sections": true },
      specStatus: "WD",
    };
    const doc = await makeRSDoc(makeStandardOps(conf, body));
    const errors = errorsFilter(doc);
    expect(errors).toHaveSize(0);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(0);
  });

  it("handles localized documents", async () => {
    const body = `
    <section>
      <h2>Consideraciones de privacidad</h2>
      <p>This is a privacy section</p>
    </section>
    `;
    const conf = {
      lint: { "required-sections": true },
      specStatus: "WD",
    };
    const opts = makeStandardOps(conf, body);
    opts.htmlAttrs = { lang: "es" };
    const doc = await makeRSDoc(opts);
    const errors = errorsFilter(doc);
    expect(errors).toHaveSize(0);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(1);
    const [warn] = warnings;
    expect(warn.message).toContain("Consideraciones de Seguridad");
  });

  it("gracefully handles localized documents for unknown languages", async () => {
    const conf = {
      lint: { "required-sections": true },
      specStatus: "WD",
    };
    const opts = makeStandardOps(conf);
    opts.htmlAttrs = { lang: "ab" }; // Abkhazian
    const doc = await makeRSDoc(opts);
    const errors = errorsFilter(doc);
    expect(errors).toHaveSize(0);
    const warnings = warningsFilter(doc);
    expect(warnings).toHaveSize(0);
  });
});
