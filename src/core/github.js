// @ts-check
/**
 * core/github
 *
 * @see https://github.com/w3c/respec/wiki/github
 */

import { docLink, getIntlData, showError, showWarning } from "../core/utils.js";
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
    file_a_bug: "File an issue",
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
    const msg = docLink`Config option ${"[github]"} is missing property \`repoURL\`.`;
    rejectGithubPromise(msg);
    return;
  }
  let tempURL = conf.github.repoURL || conf.github;
  if (!tempURL.endsWith("/")) tempURL += "/";
  /** @type URL */
  let ghURL;
  try {
    ghURL = new URL(tempURL, "https://github.com");
  } catch {
    const msg = docLink`${"[github]"} configuration option is not a valid URL? (${tempURL}).`;
    rejectGithubPromise(msg);
    return;
  }
  if (ghURL.origin !== "https://github.com") {
    const msg = docLink`${"[github]"} configuration option must be HTTPS and pointing to GitHub. (${
      ghURL.href
    }).`;
    rejectGithubPromise(msg);
    return;
  }
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  if (!org || !repo) {
    const msg = docLink`${"[github]"} URL needs a path. For example, "w3c/my-spec".`;
    rejectGithubPromise(msg);
    return;
  }
  const branch = conf.github.branch || "gh-pages";
  const issueBase = new URL("./issues/", ghURL).href;
  const commitHistoryURL = new URL(
    `./commits/${conf.github.branch ?? ""}`,
    ghURL.href
  );
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
  // Assign new properties, but retain existing ones
  let githubAPI = "https://respec.org/github";
  if (conf.githubAPI) {
    if (new URL(conf.githubAPI).hostname === window.parent.location.hostname) {
      // for testing
      githubAPI = conf.githubAPI;
    } else {
      const msg =
        "The `githubAPI` configuration option is private and should not be added manually.";
      showWarning(msg, name);
    }
  }
  if (!conf.excludeGithubLinks) {
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
          href: commitHistoryURL.href,
        },
        {
          value: "Pull requests",
          href: newProps.pullBase,
        },
      ],
    };
    if (!conf.otherLinks) {
      conf.otherLinks = [];
    }
    conf.otherLinks.unshift(otherLink);
  }
  const normalizedGHObj = {
    branch,
    repoURL: ghURL.href,
    apiBase: githubAPI,
    fullName: `${org}/${repo}`,
    issuesURL: issueBase,
    pullsURL: newProps.pullBase,
    newIssuesURL: new URL("./new/choose", issueBase).href,
    commitHistoryURL: commitHistoryURL.href,
  };
  resolveGithubPromise(normalizedGHObj);

  const normalizedConfig = {
    ...newProps,
    ...conf,
    github: normalizedGHObj,
    githubAPI,
  };
  Object.assign(conf, normalizedConfig);
}
