// @ts-check
/**
 * Linter rule "wpt-tests-exist".
 * Warns about nonexistent web platform tests.
 */
import LinterRule from "../LinterRule.js";
import { lang as defaultLang } from "../l10n.js";
import { showWarning } from "../utils.js";

const name = "wpt-tests-exist";

const meta = {
  en: {
    description: "Non-existent Web Platform Tests",
    howToFix: "Please fix the tests mentioned.",
    help: "See developer console.",
  },
};

const lang = defaultLang in meta ? defaultLang : "en";

/**
 * Runs linter rule.
 * @param {Object} conf The ReSpec config.
 * @param  {Document} doc The document to be checked.
 * @return {Promise<import("../LinterRule").LinterResult>}
 */
async function linterFunction(conf, doc) {
  const filesInWPT = await getFilesInWPT(conf.testSuiteURI, conf.githubAPI);
  if (!filesInWPT) {
    return;
  }

  const offendingElements = [];
  const offendingTests = new Set();

  /** @type {NodeListOf<HTMLElement>} */
  const elems = doc.querySelectorAll("[data-tests]");
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

  const missingTests = [...offendingTests].map(test => `\`${test}\``);
  return {
    name,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta[lang],
    description: `${meta[lang].description}: ${missingTests.join(", ")}.`,
  };
}

export const rule = new LinterRule(name, linterFunction);

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
