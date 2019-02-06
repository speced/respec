describe("Core Linter Rule - 'check-punctuation'", () => {
  const ruleName = "check-punctuation";
  const config = { lint: { [ruleName]: true } };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require([`core/linter-rules/${ruleName}`], ({ rule }) => resolve(rule));
    });
  });
  it("checks p ending without a punctuation", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.body.innerHTML = `
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

    const result = await rule.lint(config, doc);
    expect(result.offendingElements.length).toEqual(4);
  });
  it("checks error message for p ending without a punctuation", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.body.innerHTML = `
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

    const result = await rule.lint(config, doc);

    expect(result.name).toEqual(ruleName);
    expect(result.occurrences).toEqual(4);
    expect(result.description).toBeTruthy();
    expect(result.howToFix).toBeTruthy();
    expect(result.offendingElements.length).toEqual(4);
  });
});
