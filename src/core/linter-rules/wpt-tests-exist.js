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
    msg: "The following test could not be found in Web Platform Tests:",
    hint: "Check [wpt.live](https://wpt.live) to see if it was deleted or renamed.",
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

  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll("[data-tests]");
  const testables = [...elems].filter(elem => elem.dataset.tests);

  for (const elem of testables) {
    elem.dataset.tests
      .split(/,/gm)
      .map(test => test.trim().split("#")[0])
      .filter(test => test && !filesInWPT.has(test))
      .map(missingTest => {
        showWarning(`${l10n.msg} \`${missingTest}\`.`, name, {
          hint: l10n.hint,
          elements: [elem],
        });
      });
  }
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
