// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues.
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.
import { flatten, joinAnd } from "./utils";
import { fetchIndex, githubRequestHeaders, getRateLimit } from "./github-api";
import { pub } from "./pubsubhub";
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
  const args = await Promise.all(urls.map(url => fetch(new Request(url, {headers}))));
  const argsResolved = await Promise.all(args.map(arg => arg.json()));
  const names = argsResolved
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
  let headers = githubRequestHeaders(conf);
  const response = await fetch(new Request(githubAPI, {headers}));
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
  const remainingRequests = await getRateLimit(conf);
  if (commenterUrls.length + contributorUrls.length > remainingRequests) {
    const msg =
      `Your GitHub Repository contains ${commenterUrls.length + contributorUrls.length} contributors and commenters` +
      `but your current GitHub quota only allows ${remainingRequests} more requests. Some contributors will not show up`;
    pub("warning", msg);
  }
  try {
    await Promise.all(
      toHTML(commenterUrls, editors, ghCommenters, headers),
      toHTML(contributorUrls, editors, ghContributors, headers)
    );
  } catch (error) {
    pub("error", "Error loading contributors and/or commenters from GitHub.");
  }
}
