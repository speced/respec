"use strict";

import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'no-captionless-tables'", () => {
  const modules = [`/src/core/linter-rules/no-captionless-tables.js`];

  async function getWarnings(head, disabled = false) {
    const config = { lint: { "no-captionless-tables": !disabled } };
    const doc = await makePluginDoc(modules, { config, head });
    return doc.respec.warnings.filter(
      warning => warning.plugin == "core/linter-rules/no-captionless-tables"
    );
  }

  it("checks for missing <caption>", async () => {
    const results = await getWarnings(`<table class="numbered"></table>`);
    expect(results).toHaveSize(1);
  });

  it("doesn't check if disabled", async () => {
    const results = await getWarnings(`<table class="numbered"></table>`, true);
    expect(results).toHaveSize(0);
  });
});
