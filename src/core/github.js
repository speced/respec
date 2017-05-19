/**
 * core/github
 *
 * @see https://github.com/w3c/respec/wiki/github
 */

import "deps/regenerator";
import l10n from "core/l10n";
import { pub } from "core/pubsubhub";

export const name = "core/github";

export async function run(conf) {
  if (!conf.hasOwnProperty("github") || !conf.github) {
    // nothing to do, bail out.
    return;
  }
  if (
    typeof conf.github === "object" &&
    !conf.github.hasOwnProperty("repoURL")
  ) {
    pub(
      "error",
      "`respecConf.github` missing property `repoURL`. See https://github.com/w3c/respec/wiki/github"
    );
    return;
  }
  let ghURL;
  try {
    ghURL = new URL(conf.github.repoURL || conf.github);
  } catch (err) {
    pub("error", `\`respecConf.github\` is not a valid URL? (${ghURL})`);
    return;
  }
  if (ghURL.origin !== "https://github.com") {
    pub(
      "error",
      `\`respecConf.github\` must be HTTPS and pointing to GitHub. (${ghURL})`
    );
    return;
  }
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  if (!org || !repo) {
    pub(
      "error",
      `\`respecConf.github\` URL needs a path with, for example, w3c/my-spec`
    );
  }
  const branch = conf.github.branch || "gh-pages";
  const newProps = {
    edDraftURI: `https://${org.toLowerCase()}.github.io/${repo}/`,
    githubAPI: `https://api.github.com/repos/${org}/${repo}`,
    issueBase: `${ghURL.href}${ghURL.pathname.endsWith("/") ? "" : "/"}issues/`,
  };
  const commitsHref = `${ghURL.href}${ghURL.pathname.endsWith("/") ? "" : "/"}commits/${branch}`;
  const otherLink = {
    key: conf.l10n.participate,
    data: [
      {
        value: `GitHub ${org}/${repo}`,
        href: ghURL,
      },
      {
        value: conf.l10n.file_a_bug,
        href: newProps.issueBase,
      },
      {
        value: conf.l10n.commit_history,
        href: commitsHref,
      },
    ],
  };
  // Write new properties, ignoring existing ones
  Object.getOwnPropertyNames(newProps)
    .filter(key => !conf.hasOwnProperty(key))
    .map(key => ({ key, value: newProps[key] }))
    .reduce((conf, { key, value }) => {
      conf[key] = value;
      return conf;
    }, conf);
  if (!conf.hasOwnProperty("otherLinks")) {
    conf.otherLinks = [];
  }
  conf.otherLinks.unshift(otherLink);
}
