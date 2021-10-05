import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'no-http-props'", () => {
  const modules = [`/src/core/linter-rules/no-http-props.js`];

  async function getWarnings(conf) {
    const config = { ...conf, lint: { "no-http-props": true } };
    const doc = await makePluginDoc(modules, { config });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/no-http-props"
    );
  }

  it("skips over defined, but empty, URIs", async () => {
    const conf = {
      undefined_URI: undefined,
      empty_URI: "",
      null_URI: null,
      URI: "http://fail",
    };
    const warnings = await getWarnings(conf);
    expect(warnings).toHaveSize(1);
  });

  it("checks any prop ending with 'URI' (case sensitive)", async () => {
    const conf = {
      undefined_URI: undefined,
      FAIL_uri: "http://fail",
      failURIfail: "http://fail",
      URI: "http://pass",
      charterDisclosureURI: "http://pass",
      URI_FAIL: "http://fail",
      uri_FAIL: "http://fail",
    };
    const warnings = await getWarnings(conf);
    expect(warnings).toHaveSize(1);

    const [warning] = warnings;
    expect(warning.message).toContain("Insecure URLs are not allowed");
    expect(warning.hint).toContain(
      "Please change the following properties to 'https://':"
    );
    expect(warning.hint).toContain("URI");
    expect(warning.hint).toContain("`charterDisclosureURI`");

    conf.charterDisclosureURI = "https://valid";
    conf.URI = "https://valid";
    const warnings2 = await getWarnings(conf);
    expect(warnings2).toHaveSize(0);
  });

  it("checks for prevED, as special case", async () => {
    const conf = {
      FAIL_uri: "http://fail",
      failURIfail: "http://fail",
      prevED: "http://pass",
      charterDisclosureURI: "http://pass",
      URI_FAIL: "http://fail",
    };
    const warnings = await getWarnings(conf);
    expect(warnings).toHaveSize(1);

    const [warning] = warnings;
    expect(warning.hint).toContain("prevED");

    conf.prevED = "https://valid-now";
    const warnings2 = await getWarnings(conf);
    expect(warnings2.hint).not.toContain("prevED");
  });

  it("flags well-known props as invalid, when invalid URLs are present", async () => {
    const conf = {
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
    };
    const warnings = await getWarnings(conf);
    expect(warnings).toHaveSize(1);
    const { hint: howToFix } = warnings[0];

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
    const conf = {
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
    };
    const warnings = await getWarnings(conf);
    expect(warnings).toHaveSize(0);
  });

  it("lints URLs by resolving them as real URLs", async () => {
    const conf = {
      someRelativeURI: "./foo/bar",
      somePathURI: "/foo/bar",
      someControlURI: "https://valid",
    };
    const warnings = await getWarnings(conf);
    expect(warnings).toHaveSize(1);
    const { hint: howToFix } = warnings[0];

    expect(howToFix).toContain("someRelativeURI");
    expect(howToFix).toContain("somePathURI");
    expect(howToFix).not.toContain("someControlURI");
  });
});
