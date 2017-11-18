/**
 * core/github
 *
 * @see https://github.com/w3c/respec/wiki/github
 */

import l10n from "core/l10n";
import { pub } from "core/pubsubhub";

export const name = "core/github";

function findNext(header) {
  // Finds the next URL of paginated resources which
  // is available in the Link header. Link headers look like this:
  // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
  // More info here: https://developer.github.com/v3/#link-header
  var m = (header || "").match(/<([^>]+)>\s*;\s*rel="next"/);
  return (m && m[1]) || null;
}

export async function fetchAll(url, headers = {}, output = []) {
  const request = new Request(url, { headers });
  const response = await window.fetch(request);
  const json = await response.json();
  output.push(...json);
  const next = findNext(response.headers.get("Link"));
  return next ? fetchAll(next, headers, output) : output;
}

export function fetch(url) {
  return window.fetch(url).then(async r => {
    if (!r.ok) {
      throw new Error("GitHub Response not OK. Probably exceeded request limit.");
    }
    return r.json();
  });
}

export function fetchIndex(url, headers) {
  // converts URLs of the form:
  // https://api.github.com/repos/user/repo/comments{/number}
  // into:
  // https://api.github.com/repos/user/repo/comments
  // which is what you need if you want to get the index.
  return fetchAll(url.replace(/\{[^}]+\}/, "") + "&per_page=100", headers);
}

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
    otherLinks: [],
    shortName: repo,
    edDraftURI: `https://${org.toLowerCase()}.github.io/${repo}/`,
    githubAPI: `https://api.github.com/repos/${org}/${repo}`,
    issueBase: `${ghURL.href}${ghURL.pathname.endsWith("/") ? "" : "/"}issues/`,
  };
  const commitsHref = `${ghURL.href}${ghURL.pathname.endsWith("/")
    ? ""
    : "/"}commits/${branch}`;
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
  // Assign new properties, but retain exsiting ones
  Object.assign(conf, { ...newProps, ...conf });
  conf.otherLinks.unshift(otherLink);
}
