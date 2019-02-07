"use strict";
describe("Core Linter Rule - 'local-refs-exist'", () => {
  const config = {
    lint: {
      "local-refs-exist": true,
    },
  };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require(["core/linter-rules/local-refs-exist"], ({ rule }) =>
        resolve(rule));
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

  it("returns error when a link is broken", async () => {
    doc.body.innerHTML = `
      <section id="ID">M/section>
      <a href="#ID">PASS</a>
      <a href="#ID-NOT-EXIST">FAIL</a>
      <a href="#ID-NOT-EXIST">FAIL</a>
    `;

    const result = await rule.lint(config, doc);
    expect(result.name).toEqual("local-refs-exist");
    expect(result.occurrences).toEqual(2);

    const offendingElement = result.offendingElements[0];
    const { hash } = new URL(offendingElement.href);
    expect(hash).toEqual("#ID-NOT-EXIST");
  });

  it("doesn't complain when all links are fine", async () => {
    doc.body.innerHTML = `
      <section id="ID">PASS</section>
      <a href="#ID">PASS</a>
    `;
    const result = await rule.lint(config, doc);
    expect(result).toBeUndefined();
  });

  it("handles unicode characters in ID", async () => {
    doc.body.innerHTML = `
      <section id="přehled">PASS</section>
      <a href="#přehled">PASS</a>
    `;
    const result = await rule.lint(config, doc);
    expect(result).toBeUndefined();
  });
});
