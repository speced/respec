"use strict";

import { makePluginDoc } from "../../SpecHelper.js";

describe("Core Linter Rule - 'check-internal-slots'", () => {
  const modules = [`/src/core/linter-rules/check-internal-slots.js`];

  async function getWarnings(body) {
    const config = { lint: { "check-internal-slots": true } };
    const doc = await makePluginDoc(modules, { config, body });
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/linter-rules/check-internal-slots"
    );
  }

  it("returns an error when there is no '.' between var and an internal slot", async () => {
    const body = `
      <var>bar</var><a>[[foo]]</a>
      <var>bar</var>.<a>[foo]</a>
      <var>bar</var>.<a>foo</a>
      <var>bar</var>.<a>[[foo</a>
      <var>bar</var>.<a>foo]]</a>
      <var></var>.<a></a>
      <var>[[foo]]</var>.<a></a>
      <var>[[foo]]</var>.<a>bar</a>
      <var>bar</var>.<a>[[f oo]]</a>
    `;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(1);

    // first fails the isPrevVar check, rest are ok tho weird...
    expect(warnings[0].elements).toHaveSize(1);

    const offendingElement = warnings[0].elements[0];
    const { previousSibling } = offendingElement;
    // offending element's previous element won't have '.'
    expect(previousSibling.textContent).not.toBe(".");
  });

  it("doesn't generates an error for general internal slot and var usage", async () => {
    const body = `
      <var>bar</var>.<a>[[foo]]</a>
      <var>foo</var>.<a>[[BarFoo]]</a>
      <var></var>.<a>[[foo]]</a>
      <p>
       ... the <var>foo</var>. The internal slot <a>[[bar]]</a>...
      </p>
      <var>bar</var>..<a>[[foo]]</a>
      <var>bar</var> . <a>[[foo]]</a>
      <var>bar</var> <a>[[foo]]</a>

    `;
    const warnings = await getWarnings(body);
    expect(warnings).toHaveSize(0);
  });
});
