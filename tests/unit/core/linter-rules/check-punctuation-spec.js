import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'check-punctuation'", () => {
  const modules = [`/src/core/linter-rules/check-punctuation.js`];

  async function getWarnings(body) {
    const config = { lint: { "check-punctuation": true } };
    const doc = await makePluginDoc(modules, { config, body });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/check-punctuation"
    );
  }

  it("checks p ending without a punctuation", async () => {
    const body = `
        <section>
          <p>!.?: This! should? be. caught! by. linter</p>
          <p><img src="" alt="this_should_be_caught"></p>
          <p> Should. be! caught. by? linter</p>
          <p id="no-fullstop">Should be caught by linter</p>
          <p>Should not be caught by linter.</p>
          <p id="no-fullstop-at-end">Should. be caught by linter</p>
          <p>Should. not be caught by linter.</p>
          <p>This is fine.</p>
          <p>This is fine!</p>
          <p>This is fine?</p>
          <p>This is fine:</p>
          <p> !This
              ?is
              :totally
              !fine: too?
          </p>
        </section>
    `;

    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(1);

    const [warning] = warnings;
    expect(warning.elements).toHaveSize(4);
    expect(warning.message).toContain("should end with a punctuation");
  });
});
