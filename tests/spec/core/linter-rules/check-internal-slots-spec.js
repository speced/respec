"use strict";
import { rule } from  '../../../../src/core/linter-rules/check-internal-slots.js';
describe("Core Linter Rule - 'check-internal-slots'", () => {
  const ruleName = "check-internal-slots";
  const config = {
    lint: { [ruleName]: true },
  };

  const doc = document.implementation.createHTMLDocument("test doc");
  beforeEach(() => {
    // Make sure every unordered test get an empty document
    // See: https://github.com/w3c/respec/pull/1495
    while (doc.body.firstChild) {
      doc.body.removeChild(doc.body.firstChild);
    }
  });

  test(
    "returns an error when there is no '.' between var and an internal slot",
    async () => {
      doc.body.innerHTML = `
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
      const result = await rule.lint(config, doc);
      expect(result.name).toEqual(ruleName);
      // first fails the isPrevVar check, rest are ok tho weird...
      expect(result.occurrences).toEqual(1);

      const offendingElement = result.offendingElements[0];
      const { previousSibling } = offendingElement;
      // offending element's previous element won't have '.'
      expect(previousSibling.textContent).not.toEqual(".");
    }
  );

  test(
    "doesn't generates an error for general internal slot and var usage",
    async () => {
      doc.body.innerHTML = `
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
      const result = await rule.lint(config, doc);
      expect(result).toBeUndefined();
    }
  );
});
