// @ts-check
/**
 * core/github
 *
 * @see https://github.com/w3c/respec/wiki/github
 */

import { getIntlData, showError, showWarning } from "../core/utils.js";
export const name = "core/github";

let resolveGithubPromise;
let rejectGithubPromise;
/** @type {Promise<{ apiBase: string, fullName: string, branch: string, repoURL: string } | null>} */
export const github = new Promise((resolve, reject) => {
  resolveGithubPromise = resolve;
  rejectGithubPromise = message => {
    showError(message, name);
    reject(new Error(message));
  };
});

const localizationStrings = {
  en: {
    file_a_bug: "File a bug",
    participate: "Participate:",
    commit_history: "Commit history",
  },
  ko: {
    participate: "참여",
  },
  zh: {
    file_a_bug: "反馈错误",
    participate: "参与：",
  },
  ja: {
    commit_history: "変更履歴",
    file_a_bug: "問題報告",
    participate: "参加方法：",
  },
  nl: {
    commit_history: "Revisiehistorie",
    file_a_bug: "Dien een melding in",
    participate: "Doe mee:",
  },
  es: {
    commit_history: "Historia de cambios",
    file_a_bug: "Nota un bug",
    participate: "Participe:",
  },
  de: {
    commit_history: "Revisionen",
    file_a_bug: "Fehler melden",
    participate: "Mitmachen:",
  },
};
const l10n = getIntlData(localizationStrings);

export async function run(conf) {
  if (!conf.hasOwnProperty("github") || !conf.github) {
    // nothing to do, bail out.
    resolveGithubPromise(null);
    return;
  }
  if (
    typeof conf.github === "object" &&
    !conf.github.hasOwnProperty("repoURL")
  ) {
    const msg =
      "Config option `[github](https://github.com/w3c/respec/wiki/github)` " +
      "is missing property `repoURL`.";
    rejectGithubPromise(msg);
    return;
  }
  let tempURL = conf.github.repoURL || conf.github;
  if (!tempURL.endsWith("/")) tempURL += "/";
  let ghURL;
  try {
    ghURL = new URL(tempURL, "https://github.com");
  } catch {
    const msg = `\`respecConf.github\` is not a valid URL? (${ghURL})`;
    rejectGithubPromise(msg);
    return;
  }
  if (ghURL.origin !== "https://github.com") {
    const msg = `\`respecConf.github\` must be HTTPS and pointing to GitHub. (${ghURL})`;
    rejectGithubPromise(msg);
    return;
  }
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  if (!org || !repo) {
    const msg =
      "`respecConf.github` URL needs a path with, for example, w3c/my-spec";
    rejectGithubPromise(msg);
    return;
  }
  const branch = conf.github.branch || "gh-pages";
  const issueBase = new URL("./issues/", ghURL).href;
  const newProps = {
    edDraftURI: `https://${org.toLowerCase()}.github.io/${repo}/`,
    githubToken: undefined,
    githubUser: undefined,
    issueBase,
    atRiskBase: issueBase,
    otherLinks: [],
    pullBase: new URL("./pulls/", ghURL).href,
    shortName: repo,
  };
  const otherLink = {
    key: l10n.participate,
    data: [
      {
        value: `GitHub ${org}/${repo}`,
        href: ghURL,
      },
      {
        value: l10n.file_a_bug,
        href: newProps.issueBase,
      },
      {
        value: l10n.commit_history,
        href: new URL(`./commits/${branch}`, ghURL.href).href,
      },
      {
        value: "Pull requests",
        href: newProps.pullBase,
      },
    ],
  };
  // Assign new properties, but retain existing ones
  let githubAPI = "https://respec.org/github";
  if (conf.githubAPI) {
    if (new URL(conf.githubAPI).hostname === window.parent.location.hostname) {
      // for testing
      githubAPI = conf.githubAPI;
    } else {
      const msg = "`respecConfig.githubAPI` should not be added manually.";
      showWarning(msg, name);
    }
  }
  const normalizedGHObj = {
    branch,
    repoURL: ghURL.href,
    apiBase: githubAPI,
    fullName: `${org}/${repo}`,
  };
  resolveGithubPromise(normalizedGHObj);

  const normalizedConfig = {
    ...newProps,
    ...conf,
    github: normalizedGHObj,
    githubAPI,
  };
  Object.assign(conf, normalizedConfig);
  conf.otherLinks.unshift(otherLink);
}
