/**
 * core/github
 *
 * @see https://github.com/w3c/respec/wiki/github
 */

import { pub } from "./pubsubhub";

export const name = "core/github";

function findNext(header) {
  // Finds the next URL of paginated resources which
  // is available in the Link header. Link headers look like this:
  // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
  // More info here: https://developer.github.com/v3/#link-header
  const m = (header || "").match(/<([^>]+)>\s*;\s*rel="next"/);
  return (m && m[1]) || null;
}

export async function fetchAll(url, headers = {}, output = []) {
  const urlObj = new URL(url);
  if (urlObj.searchParams && !urlObj.searchParams.has("per_page")) {
    urlObj.searchParams.append("per_page", "100");
  }
  const request = new Request(urlObj, {
    headers,
  });
  request.headers.set("Accept", "application/vnd.github.v3+json");
  const response = await window.fetch(request);
  const json = await response.json();
  if (Array.isArray(json)) {
    output.push(...json);
  }
  const next = findNext(response.headers.get("Link"));
  return next ? fetchAll(next, headers, output) : output;
}

export function fetchIndex(url, headers) {
  // converts URLs of the form:
  // https://api.github.com/repos/user/repo/comments{/number}
  // into:
  // https://api.github.com/repos/user/repo/comments
  // which is what you need if you want to get the index.
  return fetchAll(url.replace(/\{[^}]+\}/, ""), headers);
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
  } catch (err) {
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
        href: new URL(`./commits/${branch}`, ghURL.href).href,
      },
      {
        value: conf.l10n.pull_requests,
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
