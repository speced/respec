"use strict";
describe("W3C Linter Rule - 'privsec-section'", () => {
  const ruleName = "privsec-section";
  const config = {
    isRecTrack: true,
    lint: { [ruleName]: true },
  };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require([`w3c/linter-rules/${ruleName}`], ({ rule }) => resolve(rule));
    });
  });
  const doc = document.implementation.createHTMLDocument("test doc");
  it("returns errors when missing privacy section", async () => {
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(1);
    const result = results[0];
    expect(result).toEqual({
      name: "privsec-section",
      occurrences: 1,
      description:
        "Document must a 'Privacy and/or Security' Considerations section.",
      howToFix: "Add a privacy and/or security considerations section.",
      help:
        "See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
    });
  });
  it("finds privacy section", async () => {
    const elem = doc.createElement("h2");
    elem.innerHTML = "the privacy of things";
    doc.body.appendChild(elem);
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(0);
    elem.remove();
  });
  it("finds just security sections", async () => {
    const elem = doc.createElement("h2");
    elem.innerHTML = "security of things";
    doc.body.appendChild(elem);
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(0);
    elem.remove();
  });
  it("ignores only considerations sections", async () => {
    const elem = doc.createElement("h2");
    elem.innerHTML = "Considerations for other things";
    doc.body.appendChild(elem);
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(1);
    elem.remove();
  });
  it("finds privacy considerations sections", async () => {
    const elem = doc.createElement("h2");
    elem.innerHTML = "Considerations of privacy of things";
    doc.body.appendChild(elem);
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(0);
    elem.remove();
  });
  it("finds security considerations sections", async () => {
    const elem = doc.createElement("h2");
    elem.innerHTML = "Considerations of security of things";
    doc.body.appendChild(elem);
    const results = await rule.lint(config, doc);
    expect(results.length).toEqual(0);
    elem.remove();
  });
  it("finds privacy and security considerations sections, irrespective of order", async () => {
    const elem = doc.createElement("h2");
    elem.innerHTML = "Privacy and Security Considerations";
    doc.body.appendChild(elem);
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.innerHTML = "Security and Privacy Considerations";
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.innerHTML = "Considerations Security Privacy";
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.remove();
  });
  it("finds privacy and security considerations case insensitive", async () => {
    const elem = doc.createElement("h2");
    doc.body.appendChild(elem);
    elem.innerHTML = "Privacy and Security Considerations";
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.innerHTML = "Privacy and Security Considerations";
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.innerHTML = "PRIVACY and Security Considerations";
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.innerHTML = "PriVacy and SECURITY Considerations";
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.innerHTML = "PRIVACY AND SECURITY CONSIDERATIONS";
    expect((await rule.lint(config, doc)).length).toEqual(0);
    elem.innerHTML = "privacy considerations security";
    elem.remove();
  });
});
