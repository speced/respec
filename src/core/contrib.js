// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues.
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.
import {
  checkLimitReached,
  fetchIndex,
  githubRequestHeaders,
} from "./github-api.js";
import { flatten, joinAnd } from "./utils.js";
import { pub } from "./pubsubhub.js";
export const name = "core/contrib";

function prop(prop) {
  return o => o[prop];
}
const nameProp = prop("name");
const urlProp = prop("url");

function findUserURLs(...thingsWithUsers) {
  const usersURLs = thingsWithUsers
    .reduce(flatten, [])
    .filter(thing => thing && thing.user)
    .map(({ user }) => user.url);
  return [...new Set(usersURLs)];
}

async function toHTML(urls, editors, element, headers) {
  const args = await Promise.all(
    urls
      .map(url =>
        fetch(new Request(url, { headers })).then(r => {
          if (checkLimitReached(r)) return null;
          return r.json();
        })
      )
      .filter(arg => arg)
  );
  const names = args
    .map(user => user.name || user.login)
    .filter(name => !editors.includes(name))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  element.textContent = joinAnd(names);
  element.id = null;
}

export async function run(conf) {
  const ghCommenters = document.getElementById("gh-commenters");
  const ghContributors = document.getElementById("gh-contributors");
  if (!ghCommenters && !ghContributors) {
    return;
  }
  const { githubAPI } = conf;
  if (!githubAPI) {
    const msg =
      "Requested list of contributors and/or commenters from GitHub, but " +
      "[`githubAPI`](https://github.com/w3c/respec/wiki/githubAPI) is not set.";
    pub("error", msg);
    return;
  }
  const headers = githubRequestHeaders(conf);
  const response = await fetch(new Request(githubAPI, { headers }));
  checkLimitReached(response);
  if (!response.ok) {
    const msg =
      "Error fetching repository information from GitHub. " +
      `(HTTP Status ${response.status}).`;
    pub("error", msg);
    return;
  }
  const indexes = await response.json();
  const { issues_url, issue_comment_url, contributors_url } = indexes;

  const [issues, comments, contributors] = await Promise.all([
    fetchIndex(issues_url, headers),
    fetchIndex(issue_comment_url, headers),
    fetchIndex(contributors_url, headers),
  ]);
  const editors = conf.editors.map(nameProp);
  const commenterUrls = ghCommenters ? findUserURLs(issues, comments) : [];
  const contributorUrls = ghContributors ? contributors.map(urlProp) : [];
  try {
    await Promise.all(
      toHTML(commenterUrls, editors, ghCommenters, headers),
      toHTML(contributorUrls, editors, ghContributors, headers)
    );
  } catch {
    pub("error", "Error loading contributors and/or commenters from GitHub.");
  }
}
