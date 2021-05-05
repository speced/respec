// @ts-check
/**
 * Linter rule "wpt-tests-exist".
 * Warns about nonexistent web platform tests.
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "wpt-tests-exist";
export const name = "core/linter-rules/wpt-tests-exist";

const localizationStrings = {
  en: {
    msg: "The following tests could not be found in Web Platform Tests:",
    hint:
      "Check [wpt.live](https://wpt.live) to see if they've been deleted or renamed.",
  },
};
const l10n = getIntlData(localizationStrings);

export async function run(conf) {
  if (!conf.lint?.[ruleName]) {
    return;
  }

  const filesInWPT = await getFilesInWPT(conf.testSuiteURI, conf.githubAPI);
  if (!filesInWPT) {
    return;
  }

  const offendingElements = [];
  const offendingTests = new Set();

  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll("[data-tests]");
  const testables = [...elems].filter(elem => elem.dataset.tests);

  for (const elem of testables) {
    const tests = elem.dataset.tests
      .split(/,/gm)
      .map(test => test.trim().split("#")[0])
      .filter(test => test);

    const missingTests = tests.filter(test => !filesInWPT.has(test));
    if (missingTests.length) {
      offendingElements.push(elem);
      missingTests.forEach(test => offendingTests.add(test));
    }
  }

  if (!offendingElements.length) {
    return;
  }

  const missingTests = [...offendingTests].map(test => ` * \`${test}\``);
  showWarning(`${l10n.msg}:\n${missingTests.join("\n")}\n\n`, name, {
    hint: l10n.hint,
    elements: offendingElements,
  });
}

/**
 * @param {string} testSuiteURI
 * @param {string} githubAPIBase
 */
async function getFilesInWPT(testSuiteURI, githubAPIBase) {
  let wptDirectory;
  try {
    const testSuiteURL = new URL(testSuiteURI);
    if (
      testSuiteURL.pathname.startsWith("/web-platform-tests/wpt/tree/master/")
    ) {
      const re = /web-platform-tests\/wpt\/tree\/master\/(.+)/;
      wptDirectory = testSuiteURL.pathname.match(re)[1].replace(/\//g, "");
    } else {
      wptDirectory = testSuiteURL.pathname.replace(/\//g, "");
    }
  } catch (error) {
    const msg = "Failed to parse WPT directory from testSuiteURI";
    showWarning(msg, `linter/${name}`);
    console.error(error);
    return null;
  }

  const url = new URL("web-platform-tests/wpt/files", `${githubAPIBase}/`);
  url.searchParams.set("path", wptDirectory);

  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.text();
    const msg =
      "Failed to fetch files from WPT repository. " +
      `Request failed with error: ${error} (${response.status})`;
    showWarning(msg, `linter/${name}`);
    return null;
  }
  /** @type {{ entries: string[] }} */
  const { entries } = await response.json();
  const files = entries.filter(entry => !entry.endsWith("/"));
  return new Set(files);
}
