describe("Core Linter Rule - 'no-http-props'", () => {
  const ruleName = "no-http-props";
  const config = { lint: { [ruleName]: true } };
  let rule;
  beforeAll(async () => {
    rule = await new Promise(resolve => {
      require([`core/linter-rules/${ruleName}`], ({ rule }) => resolve(rule));
    });
  });
  it("checks any prop ending with 'URI' (case sensitive)", async () => {
    const conf = Object.assign(
      {
        FAIL_uri: "http://fail",
        failURIfail: "http://fail",
        URI: "http://pass",
        charterDisclosureURI: "http://pass",
        URI_FAIL: "http://fail",
        uri_FAIL: "http://fail",
      },
      config
    );
    const results = await rule.lint(conf);
    expect(results.length).toEqual(1);
    const [result] = results;
    expect(result).toEqual({
      name: "no-http-props",
      occurrences: 2,
      description: "Insecure URLs are not allowed in `respecConfig`.",
      howToFix:
        "Please change the following properties to 'https://': `URI`, `charterDisclosureURI`.",
    });
    conf.charterDisclosureURI = "https://valid";
    conf.URI = "https://valid";
    const r2 = await rule.lint(conf);
    expect(r2.length).toEqual(0);
  });
  it("checks for prevED, as special case", async () => {
    const conf = Object.assign(
      {
        FAIL_uri: "http://fail",
        failURIfail: "http://fail",
        prevED: "http://pass",
        charterDisclosureURI: "http://pass",
        URI_FAIL: "http://fail",
      },
      config
    );
    const results = await rule.lint(conf);
    const [result] = results;
    expect(result.howToFix.includes("prevED")).toBe(true);
    conf.prevED = "https://valid-now";
    const [r2] = await rule.lint(conf);
    expect(r2.howToFix.includes("prevED")).toBe(false);
  });
  it("flags well-known props as invalid, when invalid URLs are present", async () => {
    const conf = Object.assign(
      {
        charterDisclosureURI: "http://invalid",
        edDraftURI: "http://invalid",
        implementationReportURI: "http://invalid",
        previousDiffURI: "http://invalid",
        previousMaturityURI: "http://invalid",
        previousURI: "http://invalid",
        prevRecURI: "http://invalid",
        testSuiteURI: "http://invalid",
        wgPatentURI: "http://invalid",
        wgURI: "http://invalid",
      },
      config
    );
    const results = await rule.lint(conf);
    const [result] = results;
    const { howToFix } = result;
    expect(howToFix.includes("charterDisclosureURI")).toBe(true);
    expect(howToFix.includes("edDraftURI")).toBe(true);
    expect(howToFix.includes("implementationReportURI")).toBe(true);
    expect(howToFix.includes("previousDiffURI")).toBe(true);
    expect(howToFix.includes("previousMaturityURI")).toBe(true);
    expect(howToFix.includes("previousURI")).toBe(true);
    expect(howToFix.includes("prevRecURI")).toBe(true);
    expect(howToFix.includes("testSuiteURI")).toBe(true);
    expect(howToFix.includes("wgPatentURI")).toBe(true);
    expect(howToFix.includes("wgURI")).toBe(true);
  });
  it("ignores well-known URIs when they are valid", async () => {
    const conf = Object.assign(
      {
        charterDisclosureURI: "https://valid.com",
        edDraftURI: "https://valid.net",
        implementationReportURI: "https://valid.org",
        previousDiffURI: "https://valid.net",
        previousMaturityURI: "https://valid.org",
        previousURI: "https://valid.com",
        prevRecURI: "https://valid.example",
        testSuiteURI: "https://valid.baz",
        wgPatentURI: "https://valid.bar",
        wgURI: "https://valid.com",
      },
      config
    );
    const results = await rule.lint(conf);
    expect(results.length).toBe(0);
  });
  it("lints URLs by resolving them as real URLs", async () => {
    const conf = Object.assign(
      {
        someRelativeURI: "./foo/bar",
        somePathURI: "/foo/bar",
        someControlURI: "https://valid",
      },
      config
    );
    const results = await rule.lint(conf);
    const [result] = results;
    const { howToFix } = result;
    expect(howToFix.includes("someRelativeURI")).toBe(true);
    expect(howToFix.includes("somePathURI")).toBe(true);
    expect(howToFix.includes("someControlURI")).toBe(false);
  });
});
