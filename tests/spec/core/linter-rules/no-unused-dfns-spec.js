"use strict";

import {
  errorFilters,
  flushIframes,
  makeRSDoc,
  makeStandardOps,
  warningFilters,
} from "../../SpecHelper.js";

describe("Core — linter-rules - no-unused-dfns", () => {
  afterAll(() => {
    flushIframes();
  });
  const name = "core/linter-rules/no-unused-dfns";
  const lintErrors = errorFilters.filter(name);
  const lintWarnings = warningFilters.filter(name);

  it("doesn't complain if the rule is turned off", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
        <p><dfn>bar</dfn></p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": false } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("doesn't complain when there is a matching anchor element", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn> [=bar=]</p>
        <p><dfn>bar</dfn> <a>foo</a></p>
        <p><dfn data-dfn-for="Test">baz</dfn> [=Test/baz=]</p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": true } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("defaults to warning", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
        <p><dfn>bar</dfn></p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": true } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(2);
  });

  it("complains even when the definitions are linked from the index", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
        <p><dfn>bar</dfn></p>
      </section>
      <section class="index"></section>
    `;
    const config = { lint: { "no-unused-dfns": true } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(2);
  });

  it("warns when the rule is set to 'warn'", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
        <p><dfn>bar</dfn></p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": "warn" } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(2);
  });

  it("shows as error when the rule is set to 'error'", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": "error" } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(1);
    expect(warnings).toHaveSize(0);
  });

  it("ignores self-defined WebIDL types", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <pre class="idl">
          interface Foo {
            void bar();
            readonly attribute DOMString baz;
          };
        </pre>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": true } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("ignores definitions that use CSS class 'lint-ignore'", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn class="lint-ignore">foo</dfn></p>
        <p><dfn>bar</dfn></p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": true } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(1);
    const [warning] = warnings;
    expect(warning.message).toContain('"bar"');
  });

  it("ignores definitions that use legacy 'data-cite'", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn data-cite="html#bar">bar</dfn></p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": true } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("ignores definitions that use data-export", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn data-export="foo">bar</dfn></p>
      </section>
    `;
    const config = { lint: { "no-unused-dfns": true } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });
});
