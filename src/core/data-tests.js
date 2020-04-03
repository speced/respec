// @ts-check
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
import { getIntlData, showInlineWarning } from "./utils.js";
import { html } from "./import-maps.js";
import { pub } from "./pubsubhub.js";
const localizationStrings = {
  en: {
    missing_test_suite_uri:
      "Found tests in your spec, but missing '" +
      "[`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI)' in your ReSpec config.",
    tests: "tests",
    test: "test",
  },
  ja: {
    missing_test_suite_uri:
      "この仕様内にテストの項目を検出しましたが，ReSpec の設定に '" +
      "[`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI)' が見つかりません．",
    tests: "テスト",
    test: "テスト",
  },
  de: {
    missing_test_suite_uri:
      "Die Spezifikation enthält Tests, aber in der ReSpec-Konfiguration ist keine '" +
      "[`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI)' angegeben.",
    tests: "Tests",
    test: "Test",
  },
};

const l10n = getIntlData(localizationStrings);

export const name = "core/data-tests";

function toListItem(href) {
  const emojiList = [];
  const [testFile] = new URL(href).pathname.split("/").reverse();
  const testParts = testFile.split(".");
  let [testFileName] = testParts;

  const isSecureTest = testParts.find(part => part === "https");
  if (isSecureTest) {
    const requiresConnectionEmoji = document.createElement("span");
    requiresConnectionEmoji.textContent = "🔒";
    requiresConnectionEmoji.setAttribute(
      "aria-label",
      "requires a secure connection"
    );
    requiresConnectionEmoji.setAttribute("title", "Test requires HTTPS");
    testFileName = testFileName.replace(".https", "");
    emojiList.push(requiresConnectionEmoji);
  }

  const isManualTest = testFileName
    .split(".")
    .join("-")
    .split("-")
    .find(part => part === "manual");
  if (isManualTest) {
    const manualPerformEmoji = document.createElement("span");
    manualPerformEmoji.textContent = "💪";
    manualPerformEmoji.setAttribute(
      "aria-label",
      "the test must be run manually"
    );
    manualPerformEmoji.setAttribute("title", "Manual test");
    testFileName = testFileName.replace("-manual", "");
    emojiList.push(manualPerformEmoji);
  }

  const testList = html`
    <li>
      <a href="${href}">
        ${testFileName}
      </a>
      ${emojiList}
    </li>
  `;
  return testList;
}

export function run(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll("[data-tests]");
  const testables = [...elems].filter(elem => elem.dataset.tests);

  if (!testables.length) {
    return;
  }
  if (!conf.testSuiteURI) {
    pub("error", l10n.missing_test_suite_uri);
    return;
  }

  for (const elem of testables) {
    const tests = elem.dataset.tests.split(/,/gm).map(url => url.trim());
    const testURLs = toTestURLs(tests, conf.testSuiteURI);
    handleDuplicates(testURLs, elem);
    const details = toHTML(testURLs);
    elem.append(details);
  }
}

/**
 * @param {string[]} tests
 * @param {string} testSuiteURI
 */
function toTestURLs(tests, testSuiteURI) {
  return tests
    .map(test => {
      try {
        return new URL(test, testSuiteURI).href;
      } catch {
        pub("warn", `Bad URI: ${test}`);
      }
    })
    .filter(href => href);
}

/**
 * @param {string[]} testURLs
 * @param {HTMLElement} elem
 */
function handleDuplicates(testURLs, elem) {
  const duplicates = testURLs.filter(
    (link, i, self) => self.indexOf(link) !== i
  );
  if (duplicates.length) {
    showInlineWarning(
      elem,
      `Duplicate tests found`,
      `To fix, remove duplicates from "data-tests": ${duplicates
        .map(url => new URL(url).pathname)
        .join(", ")}`
    );
  }
}

/**
 * @param {string[]} testURLs
 */
function toHTML(testURLs) {
  const uniqueList = [...new Set(testURLs)];
  const details = html`
    <details class="respec-tests-details removeOnSave">
      <summary>
        tests: ${uniqueList.length}
      </summary>
      <ul>
        ${uniqueList.map(toListItem)}
      </ul>
    </details>
  `;
  return details;
}
