describe("Core Linter Rule - 'check-charset'", () => {
  const ruleName = "check-charset";
  const config = {
    lint: { [ruleName]: true },
  };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require([`core/linter-rules/${ruleName}`], ({ rule }) => resolve(rule));
    });
  });

  it("checks if meta[charset] is set to utf-8", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.head.innerHTML = `
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <title>ReSpec</title>
    `;

    const results = await rule.lint(config, doc);
    expect(results.length).toBe(0);
  });

  it("doesn't give an error when written in capitals", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.head.innerHTML = `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width">
      <title>ReSpec</title>
    `;

    const results = await rule.lint(config, doc);
    expect(results.length).toBe(0);
  });

  it("checks if meta[charset] is present or not", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.head.innerHTML = `
      <meta name="viewport" content="width=device-width">
      <title>ReSpec</title>
    `;

    const results = await rule.lint(config, doc);
    expect(results.occurrences).toBe(0);
  });

  it("returns error when more then one meta[charset] present", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.head.innerHTML = `
      <meta charset="utf-8">
      <meta charset="ascii-128">
      <meta name="viewport" content="width=device-width">
      <title>ReSpec</title>
    `;

    const results = await rule.lint(config, doc);
    expect(results.occurrences).toBe(2);
  });

  it("return error when some other charset defined", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.head.innerHTML = `
      <meta charset="ascii-128">
      <meta name="viewport" content="width=device-width">
      <title>ReSpec</title>
    `;

    const results = await rule.lint(config, doc);
    expect(results.occurrences).toBe(1);
  });
});
