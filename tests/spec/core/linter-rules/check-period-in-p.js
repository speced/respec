fdescribe("Core Linter Rule - 'check-period-in-p'", () => {
  const ruleName = "check-period-in-p";
  const config = { lint: { [ruleName]: true } };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require([`core/linter-rules/${ruleName}`], ({ rule }) => resolve(rule));
    });
  });
  it("checks p ending without a period", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.body.innerHTML = `
        <section>
          <p id="no-fullstop">Should pass</p>
          <p>Should fail.</p>
          <p id="no-fullstop-at-end">Should. pass</p>
          <p>Should. Fail.</p>
          <p id="unnecessary-tests-after-fullstop">Should Pass. Tests</p>
        </section>
    `;

    const noFullStop = doc.getElementById("no-fullstop");
    const noFullStopAtEnd = doc.getElementById("no-fullstop-at-end");
    const unnecessaryTestsAfterFullStop = doc.getElementById("unnecessary-tests-after-fullstop");
    
    const results = await rule.lint(config, doc);
    const [result] = results;
    
    expect(result.offendingElements.length).toEqual(3);
    expect(result.offendingElements[0]).toEqual(noFullStop);
    expect(result.offendingElements[1]).toEqual(noFullStopAtEnd);
    expect(result.offendingElements[2]).toEqual(unnecessaryTestsAfterFullStop);
  });
  it("checks error message for p ending without a period", async () => {
    const doc = document.implementation.createHTMLDocument("test doc");
    doc.body.innerHTML = `
        <section>
          <p id="no-fullstop">Should pass</p>
          <p>Should fail.</p>
          <p id="no-fullstop-at-end">Should. pass</p>
          <p>Should. Fail.</p>
          <p id="unnecessary-tests-after-fullstop">Should Pass. Tests</p>
        </section>
    `;
  
    const results = await rule.lint(config, doc);
    const [result] = results;
    
    const noFullStop = doc.getElementById("no-fullstop");
    const noFullStopAtEnd = doc.getElementById("no-fullstop-at-end");
    const unnecessaryTestsAfterFullStop = doc.getElementById("unnecessary-tests-after-fullstop");

    expect(result.name).toEqual(ruleName);
    expect(result.occurrences).toEqual(3);
    expect(result.description).toEqual("`<p>` tags should end with a period");
    expect(result.howToFix).toEqual("Please put a period at the end of this `<p>` tag");
    expect(result.offendingElements.length).toEqual(3);
    expect(result.offendingElements[0]).toEqual(noFullStop);
    expect(result.offendingElements[1]).toEqual(noFullStopAtEnd);
    expect(result.offendingElements[2]).toEqual(unnecessaryTestsAfterFullStop);
  })
})
