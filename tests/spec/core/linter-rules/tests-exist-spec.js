"use strict";

import { rule } from "../../../../src/core/linter-rules/wpt-tests-exist.js";

describe("Core Linter Rule - 'wpt-tests-exist'", () => {
  const config = {
    testSuiteURI: "https://w3c-test.org/payment-request/",
    github: "org/repo",
    githubAPI: `${window.parent.location.origin}/tests/data/github`,
    lint: {
      "wpt-tests-exist": true,
    },
  };
  const doc = document.implementation.createHTMLDocument("test doc");
  beforeEach(() => {
    // Make sure every unordered test get an empty document
    // See: https://github.com/w3c/respec/pull/1495
    while (doc.body.firstChild) {
      doc.body.removeChild(doc.body.firstChild);
    }
  });

  it("returns error when tests are missing", async () => {
    doc.body.innerHTML = `
      <p id="a" data-tests="foo.html,404.min.html,404.html"></p>
      <p id="b" data-tests="baz.html,404.html"></p>
      <p id="c" data-tests="cool.html"></p>
    `;

    const result = await rule.lint(config, doc);
    expect(result.name).toBe("wpt-tests-exist");
    expect(result.occurrences).toBe(2);

    const [a, b] = result.offendingElements;
    expect(a.id).toBe("a");
    expect(b.id).toBe("b");

    expect(result.description).toContain("404.min.html");
    expect(result.description).toContain("404.html");
    expect(result.description).not.toContain("baz.html");
    expect(result.description).not.toContain("foo.html");
    expect(result.description).not.toContain("cool.html");
  });

  it("does nothing if no tests are missing", async () => {
    doc.body.innerHTML = `
      <p id="a" data-tests="foo.html,baz.html"></p>
      <p id="b" data-tests="cool.html"></p>
    `;

    const result = await rule.lint(config, doc);
    expect(result).toBeUndefined();
  });

  it("parses WPT directory from testSuiteURI", async () => {
    doc.body.innerHTML = `<p data-tests="404.html"></p>`;
    const conf = {
      ...config,
      testSuiteURI:
        "https://github.com/web-platform-tests/wpt/tree/master/whatever",
    };
    const result = await rule.lint(conf, doc);
    expect(result.name).toBe("wpt-tests-exist");
    expect(result.occurrences).toBe(1);
    expect(result.description).toContain("404.html");
  });
});
