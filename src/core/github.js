/**
 * core/github
 *
 * @see https://github.com/w3c/respec/wiki/github
 */

import { lang as defaultLang } from "../core/l10n.js";
import { pub } from "./pubsubhub.js";
export const name = "core/github";

const localizationStrings = {
  en: {
    file_a_bug: "File a bug",
    participate: "Participate",
    commit_history: "Commit history",
  },
  nl: {
    commit_history: "Revisiehistorie",
    file_a_bug: "Dien een melding in",
    participate: "Doe mee",
  },
  es: {
    commit_history: "Historia de cambios",
    file_a_bug: "Nota un bug",
    participate: "Participe",
  },
};
const lang = defaultLang in localizationStrings ? defaultLang : "en";
const l10n = localizationStrings[lang];

export default async function({ configuration: conf }) {
  if (!conf.hasOwnProperty("github") || !conf.github) {
    // nothing to do, bail out.
    return;
  }
  if (
    typeof conf.github === "object" &&
    !conf.github.hasOwnProperty("repoURL")
  ) {
    const msg =
      "Config option `[github](https://github.com/w3c/respec/wiki/github)` " +
      "is missing property `repoURL`.";
    pub("error", msg);
    return;
  }
  let tempURL = conf.github.repoURL || conf.github;
  if (!tempURL.endsWith("/")) tempURL += "/";
  let ghURL;
  try {
    ghURL = new URL(tempURL, "https://github.com");
  } catch {
    pub("error", `\`respecConf.github\` is not a valid URL? (${ghURL})`);
    return;
  }
  if (ghURL.origin !== "https://github.com") {
    const msg = `\`respecConf.github\` must be HTTPS and pointing to GitHub. (${ghURL})`;
    pub("error", msg);
    return;
  }
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  if (!org || !repo) {
    const msg =
      "`respecConf.github` URL needs a path with, for example, w3c/my-spec";
    pub("error", msg);
    return;
  }
  const branch = conf.github.branch || "gh-pages";
  const issueBase = new URL("./issues/", ghURL).href;
  const newProps = {
    edDraftURI: `https://${org.toLowerCase()}.github.io/${repo}/`,
    githubToken: undefined,
    githubUser: undefined,
    githubAPI: `https://api.github.com/repos/${org}/${repo}`,
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
  const normalizedGHObj = {
    branch,
    repoURL: ghURL.href,
  };
  const normalizedConfig = { ...newProps, ...conf, github: normalizedGHObj };
  Object.assign(conf, normalizedConfig);
  conf.otherLinks.unshift(otherLink);
}
