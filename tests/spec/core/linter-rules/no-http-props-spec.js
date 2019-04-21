import { rule } from "../../../../src/core/linter-rules/no-http-props.js";

describe("Core Linter Rule - 'no-http-props'", () => {
  const ruleName = "no-http-props";
  const config = { lint: { [ruleName]: true } };
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
    const result = await rule.lint(conf);
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
    expect(r2).toBeUndefined();
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
    const result = await rule.lint(conf);
    expect(result.howToFix).toContain("prevED");
    conf.prevED = "https://valid-now";
    const r2 = await rule.lint(conf);
    expect(r2.howToFix).not.toContain("prevED");
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
    const { howToFix } = await rule.lint(conf);
    expect(howToFix).toContain("charterDisclosureURI");
    expect(howToFix).toContain("edDraftURI");
    expect(howToFix).toContain("implementationReportURI");
    expect(howToFix).toContain("previousDiffURI");
    expect(howToFix).toContain("previousMaturityURI");
    expect(howToFix).toContain("previousURI");
    expect(howToFix).toContain("prevRecURI");
    expect(howToFix).toContain("testSuiteURI");
    expect(howToFix).toContain("wgPatentURI");
    expect(howToFix).toContain("wgURI");
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
    const result = await rule.lint(conf);
    expect(result).toBeUndefined();
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
    const { howToFix } = await rule.lint(conf);
    expect(howToFix).toContain("someRelativeURI");
    expect(howToFix).toContain("somePathURI");
    expect(howToFix).not.toContain("someControlURI");
  });
});
