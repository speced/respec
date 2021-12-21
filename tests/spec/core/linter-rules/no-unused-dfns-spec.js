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
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": false,
        },
      },
      body
    );
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
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": true,
        },
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });

  it("complains as an error by default", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
        <p><dfn>bar</dfn></p>
      </section>
    `;
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": true,
        },
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(2);
    expect(warnings).toHaveSize(0);
  });

  it("warnings when the rule is set to 'warn'", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
        <p><dfn>bar</dfn></p>
      </section>
    `;
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": "warn",
        },
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(2);
  });

  it("shows an error when the rule is set to 'error'", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn>foo</dfn></p>
      </section>
    `;
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": "error",
        },
      },
      body
    );
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
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": true,
        },
      },
      body
    );
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
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": true,
        },
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(1);
    expect(warnings).toHaveSize(0);
    const [error] = errors;
    expect(error.message).toContain('"bar"');
  });

  it("ignores definitions that use legacy 'data-cite'", async () => {
    const body = `
      <section>
        <h2>Heading</h2>
        <p><dfn data-cite="html#bar">bar</dfn></p>
      </section>
    `;
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": true,
        },
      },
      body
    );
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
    const ops = makeStandardOps(
      {
        lint: {
          "no-unused-dfns": true,
        },
      },
      body
    );
    const doc = await makeRSDoc(ops);
    const errors = lintErrors(doc);
    const warnings = lintWarnings(doc);
    expect(errors).toHaveSize(0);
    expect(warnings).toHaveSize(0);
  });
});
