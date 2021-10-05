// @ts-check
/**
 * Module core/data-tests
 *
 * Allows specs to link to test files in a test suite, by adding `details` of where
 * particular tests for a testable assertion can be found.
 *
 * `data-tests` takes a space separated list of URLs, e.g. data-test="foo.html bar.html".
 *
 * Docs: https://respec.org/doc/#data-tests
 */
import {
  codedJoinAnd,
  docLink,
  getIntlData,
  showError,
  showWarning,
} from "./utils.js";
import { html } from "./import-maps.js";
const localizationStrings = {
  en: {
    missing_test_suite_uri: docLink`Found tests in your spec, but missing ${"[testSuiteURI]"} in your ReSpec config.`,
    tests: "tests",
    test: "test",
  },
  ja: {
    missing_test_suite_uri: docLink`この仕様内にテストの項目を検出しましたが，ReSpec の設定に ${"[testSuiteURI]"} が見つかりません．`,
    tests: "テスト",
    test: "テスト",
  },
  de: {
    missing_test_suite_uri: docLink`Die Spezifikation enthält Tests, aber in der ReSpec-Konfiguration ist keine ${"[testSuiteURI]"} angegeben.`,
    tests: "Tests",
    test: "Test",
  },
  zh: {
    missing_test_suite_uri: docLink`本规范中包含测试，但在 ReSpec 配置中缺少 ${"[testSuiteURI]"}。`,
    tests: "测试",
    test: "测试",
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
      <a href="${href}">${testFileName}</a>
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
    showError(l10n.missing_test_suite_uri, name);
    return;
  }

  for (const elem of testables) {
    const tests = elem.dataset.tests.split(/,/gm).map(url => url.trim());
    const testURLs = toTestURLs(tests, conf.testSuiteURI, elem);
    handleDuplicates(testURLs, elem);
    const details = toHTML(testURLs);
    elem.append(details);
  }
}

/**
 * @param {string[]} tests
 * @param {string} testSuiteURI
 * @param {HTMLElement} elem
 */
function toTestURLs(tests, testSuiteURI, elem) {
  return tests
    .map(test => {
      try {
        return new URL(test, testSuiteURI).href;
      } catch {
        const msg = docLink`Invalid URL in ${"[data-tests]"} attribute: ${test}.`;
        showWarning(msg, name, { elements: [elem] });
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
    const msg = docLink`Duplicate tests found in the ${"[data-tests]"} attribute.`;
    const tests = codedJoinAnd(duplicates, { quotes: true });
    const hint = docLink`To fix, remove duplicates from ${"[data-tests]"}: ${tests}.`;
    showWarning(msg, name, { hint, elements: [elem] });
  }
}

/**
 * @param {string[]} testURLs
 */
function toHTML(testURLs) {
  const uniqueList = [...new Set(testURLs)];
  const details = html`
    <details class="respec-tests-details removeOnSave">
      <summary>tests: ${uniqueList.length}</summary>
      <ul>
        ${uniqueList.map(toListItem)}
      </ul>
    </details>
  `;
  return details;
}
