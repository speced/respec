// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues.
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.
import { flatten, joinAnd } from "./utils";
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

function getHeaders(conf) {
  const headers = {};
  const { githubUser, githubToken } = conf;
  if (githubUser && githubToken) {
    const credentials = btoa(`${githubUser}:${githubToken}`);
    const Authorization = `Basic ${credentials}`;
    Object.assign(headers, { Authorization });
  }
  return headers;
}
async function toHTML(urls, editors, element, headers) {
  const args = await Promise.all(urls.map(url => fetch(url, { headers })));
  const names = args
    .map(([user]) => user.name || user.login)
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
  const { issues, comments, contributors } = window.ghRepoInfo;
  const editors = conf.editors.map(nameProp);
  const commenterUrls = ghCommenters ? findUserURLs(issues, comments) : [];
  const contributorUrls = ghContributors ? contributors.map(urlProp) : [];
  const headers = getHeaders(conf);
  try {
    await Promise.all(
      toHTML(commenterUrls, editors, ghCommenters, headers),
      toHTML(contributorUrls, editors, ghContributors, headers)
    );
  } catch (error) {
    pub("error", "Error loading contributors and/or commenters from GitHub.");
  }
}
