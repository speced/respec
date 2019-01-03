"use strict";
describe("Core Linter Rule - 'check-internal-slots'", () => {
  const ruleName = "check-internal-slots";
  const config = {
    lint: { [ruleName]: true },
  };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require([`core/linter-rules/${ruleName}`], ({ rule }) => resolve(rule));
    });
  });
  const doc = document.implementation.createHTMLDocument("test doc");
  beforeEach(() => {
    // Make sure every unordered test get an empty document
    // See: https://github.com/w3c/respec/pull/1495
    while (doc.body.firstChild) {
      doc.body.removeChild(doc.body.firstChild);
    }
  });

  it("return error when no '.' between var and a for internal slots", async () => {
    doc.body.innerHTML = `
    <var>bar1</var><a>[[foo]]</a>
    <var>bar2</var>.<a>[[foo]]</a>
    <var>bar3</var>.<a>[[foo]]</a>
    `;
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(1);

    const [result] = results;
    expect(result.name).toEqual(ruleName);
    expect(result.occurrences).toEqual(1);

    const offendingElement = result.offendingElements[0];
    const { previousSibling } = offendingElement;
    // offending element's previous element won't have '.'
    expect(previousSibling.textContent).not.toEqual(".");
  });

  it("no error when correct pattern is followed", async () => {
    doc.body.innerHTML = `
      <var>bar</var>.<a>[[foo]]</a>
      <var>bar</var>.<a>[[foo]]</a>
    `;
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(0);
  });
});
