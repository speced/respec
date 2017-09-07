/**
 * Module core/data-tests
 *
 * Allows specs to link to test files in a test suite, by adding `details` of where
 * particular tests for a testable assertion can be found.
 *
 * `data-tests` takes a space separated list of URLs, e.g. data-test="foo.html bar.html".
 *
 * Docs: https://github.com/w3c/respec/wiki/data-tests
 */
import { pub } from "core/pubsubhub";
import { lang as defaultLang } from "core/l10n";
const l10n = {
  en: {
    missing_test_suite_uri: "Found tests in your spec, but missing '" +
      "[`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI)' in your ReSpec config.",
    tests: "tests",
    test: "test",
  },
};
export const name = "core/data-tests";

const lang = defaultLang in l10n ? defaultLang : "en";

function toListItem(href) {
  return hyperHTML.bind(document.createElement("li"))`
    <a href="${href}">
      ${href.split("/").pop()}
    </a>
  `;
}

export function run(conf, doc, cb) {
  const testables = doc.querySelectorAll("[data-tests]");
  if (!testables.length) {
    return cb();
  }
  if (!conf.testSuiteURI) {
    pub("error", l10n[lang].missing_test_suite_uri);
    return cb();
  }
  Array.from(testables)
    .filter(elem => elem.dataset.tests)
    // Render details + ul, returns HTMLDetailsElement
    .map(elem => {
      const details = document.createElement("details");
      const renderer = hyperHTML.bind(details);
      const testURLs = elem.dataset.tests
        .split(/,/gm)
        .map(url => url.trim())
        .map(url => {
          let href = "";
          try {
            href = new URL(url, conf.testSuiteURI).href;
          } catch (err) {
            pub("warn", `${l10n[lang].bad_uri}: ${url}`);
          }
          return href;
        });
      details.classList.add("respec-tests-details", "removeOnSave");
      renderer`
        <summary>
          tests: ${testURLs.length}
        </summary>
        <ul>${testURLs.map(toListItem)}</ul>
      `;
      return { elem, details };
    })
    .forEach(({ elem, details }) => {
      delete elem.dataset.tests;
      elem.insertAdjacentElement("beforeend", details);
    });
  cb();
}
