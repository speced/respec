"use strict";

import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'wpt-tests-exist'", () => {
  const modules = [`/src/core/linter-rules/wpt-tests-exist.js`];

  async function getWarnings(body, conf = {}) {
    const config = {
      testSuiteURI: "https://w3c-test.org/payment-request/",
      github: "org/repo",
      githubAPI: `${window.parent.location.origin}/tests/data/github`,
      lint: { "wpt-tests-exist": true },
      ...conf,
    };
    const doc = await makePluginDoc(modules, { config, body });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/wpt-tests-exist"
    );
  }

  it("returns error when tests are missing", async () => {
    const body = `
      <p id="a" data-tests="foo.html,404.min.html,404.html"></p>
      <p id="b" data-tests="baz.html,404.html"></p>
      <p id="c" data-tests="cool.html"></p>
    `;

    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(3);

    // warn1 is a's 404.min.html
    // warn2 is a's 404.html
    // warn3 is b's 404.html
    const [warn1, warn2, warn3] = warnings;

    expect(warn1.elements).toHaveSize(1);
    expect(warn1.elements[0].id).toBe("a");
    expect(warn1.message).toContain("404.min.html");

    expect(warn2.elements).toHaveSize(1);
    expect(warn2.elements[0].id).toBe("a");
    expect(warn2.message).toContain("404.html");

    expect(warn3.elements).toHaveSize(1);
    expect(warn3.elements[0].id).toBe("b");
    expect(warn3.message).toContain("404.html");

    for (const { message } of warnings) {
      expect(message).not.toContain("baz.html");
      expect(message).not.toContain("foo.html");
      expect(message).not.toContain("cool.html");
    }
  });

  it("does nothing if no tests are missing", async () => {
    const body = `
      <p id="a" data-tests="foo.html,baz.html"></p>
      <p id="b" data-tests="cool.html"></p>
    `;

    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });

  it("parses WPT directory from testSuiteURI", async () => {
    const body = `<p data-tests="404.html"></p>`;
    const conf = {
      testSuiteURI: `https://github.com/web-platform-tests/wpt/tree/master/whatever`,
    };
    const warnings = await getWarnings(body, conf);
    expect(warnings).toHaveSize(1);

    expect(warnings[0].message).toContain("404.html");
  });
});
