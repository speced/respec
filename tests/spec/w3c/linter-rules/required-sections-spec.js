"use strict";

import {
  errorFilters,
  flushIframes,
  makeRSDoc,
  makeStandardOps,
} from "../../SpecHelper.js";

import { requiresSomeSectionStatus } from "../../../../src/w3c/linter-rules/required-sections.js";

describe("w3c — required-sections", () => {
  afterAll(() => {
    flushIframes();
  });

  const linterErrors = errorFilters.filter(
    "w3c/linter-rules/required-sections"
  );

  it("does nothing if disabled", async () => {
    const ops = makeStandardOps({ lint: { "required-sections": false } });
    const doc = await makeRSDoc(ops);
    const errors = linterErrors(doc);
    expect(errors).toHaveSize(0);
  });

  it("doesn't generate errors for non-rec-track that don't have the required sections", async () => {
    const ops = makeStandardOps({
      lint: { "required-sections": true },
      specStatus: "unofficial",
    });
    const doc = await makeRSDoc(ops);
    const errors = linterErrors(doc);
    expect(errors).toHaveSize(0);
  });

  it("generates errors when its a rec track document and both privacy and security sections are missing", async () => {
    for (const specStatus of requiresSomeSectionStatus) {
      const ops = makeStandardOps({
        lint: { "required-sections": true },
        specStatus,
      });
      const doc = await makeRSDoc(ops);
      const errors = linterErrors(doc);
      expect(errors).withContext(specStatus).toHaveSize(2);
    }
  });

  it("generates an error if privacy section if present, but security is missing", async () => {
    const body = `
      <section>
        <h2>Privacy considerations</h2>
        <p>This is a privacy section</p>
      </section>
    `;
    const ops = makeStandardOps(
      {
        lint: { "required-sections": true },
        specStatus: "WD",
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = linterErrors(doc);
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
    const ops = makeStandardOps(
      {
        lint: { "required-sections": true },
        specStatus: "WD",
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = linterErrors(doc);
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
    const ops = makeStandardOps(
      {
        lint: { "required-sections": true },
        specStatus: "WD",
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = linterErrors(doc);
    expect(errors).toHaveSize(0);
  });
});