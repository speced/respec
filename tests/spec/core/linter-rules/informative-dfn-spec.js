"use strict";

import {
  errorFilters,
  flushIframes,
  html,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../../SpecHelper.js";

const body = (firstLinkClass = "") => html`
  <section class="normative" data-cite="accname-1.2">
    <h2>Heading</h2>
    <p><a class="${firstLinkClass}">accessible name</a></p>
    <p><a>accessible description</a></p>
  </section>
`;

describe("Core — linter-rules - informative-dfn", () => {
  const name = "core/linter-rules/informative-dfn";
  const lintErrors = errorFilters.filter(name);
  const lintWarnings = warningFilters.filter(name);

  afterAll(() => {
    flushIframes();
  });

  it("doesn't complain if the rule is turned off", async () => {
    const config = { lint: { "informative-dfn": false } };
    const ops = makeStandardOps(config, body());
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("defaults to warning", async () => {
    const config = { lint: { "informative-dfn": true } };
    const ops = makeStandardOps(config, body());
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(2);
  });

  it("warns when the rule is set to 'warn'", async () => {
    const config = { lint: { "informative-dfn": "warn" } };
    const ops = makeStandardOps(config, body());
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(2);
  });

  it("shows as error when the rule is set to 'error'", async () => {
    const config = { lint: { "informative-dfn": "error" } };
    const ops = makeStandardOps(config, body());
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(2);
    expect(warnings).toHaveSize(0);
  });

  it("ignores links that use CSS class 'lint-ignore'", async () => {
    const config = { lint: { "informative-dfn": true } };
    const ops = makeStandardOps(config, body("lint-ignore"));
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(1);
    const [warning] = warnings;
    expect(warning.message).toContain('"accessible description"');
  });
});
