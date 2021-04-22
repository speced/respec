import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'check-charset'", () => {
  const modules = [`/src/core/linter-rules/check-charset.js`];

  async function getWarnings(head, disabled = false) {
    const config = { lint: { "check-charset": !disabled } };
    const doc = await makePluginDoc(modules, { config, head });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/check-charset"
    );
  }

  it("checks if meta[charset] is set to utf-8", async () => {
    const results = await getWarnings(`<meta charset="utf-8">`);
    expect(results).toHaveSize(0);
  });

  it("doesn't give an error when written in capitals", async () => {
    const results = await getWarnings(`<meta charset="UTF-8">`);
    expect(results).toHaveSize(0);
  });

  it("checks if meta[charset] is present or not", async () => {
    const results = await getWarnings("");
    expect(results).toHaveSize(1);
  });

  it("returns error when more then one meta[charset] present", async () => {
    const results = await getWarnings(`
      <meta charset="utf-8">
      <meta charset="ascii-128">
    `);
    expect(results).toHaveSize(1);
    expect(results[0].elements).toHaveSize(2);
  });

  it("return error when some other charset defined", async () => {
    const results = await getWarnings(`<meta charset="ascii-128">`);
    expect(results).toHaveSize(1);
    expect(results[0].elements).toHaveSize(1);
  });

  it("doesn't check if disabled", async () => {
    const results = await getWarnings("", true);
    expect(results).toHaveSize(0);
  });
});
