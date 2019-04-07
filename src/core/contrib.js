// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues.
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.
import {
  checkLimitReached,
  fetchAll,
  githubRequestHeaders,
} from "./github-api";
import { flatten, joinAnd } from "./utils";
import { pub } from "./pubsubhub";
export const name = "core/contrib";

function prop(prop) {
  return o => o[prop];
}
const nameProp = prop("name");

function URLByUser(conf, user) {
  const { githubAPIBase } = conf;
  return (new URL(`users/${user.login}`, githubAPIBase)).href;
}

function findUserURLs(conf, ...thingsWithUsers) {
  const usersURLs = thingsWithUsers
    .reduce(flatten, [])
    .filter(thing => thing && thing.user)
        .map(({ user }) => URLByUser(conf, user));
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

  const [
    issues,
    issueComments,
    otherComments,
    contributors,
  ] = await Promise.all(
    [
      `${githubAPI}/issues`,
      `${githubAPI}/issues_comments`,
      `${githubAPI}/comments`,
      `${githubAPI}/contributors`,
    ].map(endpoint => fetchAll(endpoint, headers))
  );

  const editors = conf.editors.map(nameProp);
  const commenterUrls = ghCommenters
        ? findUserURLs(conf, issues, issueComments, otherComments)
    : [];
  const contributorUrls = ghContributors ? contributors.map(c => URLByUser(conf, c)) : [];
  try {
    const toHTMLPromises = [];
    if (ghCommenters) {
      toHTMLPromises.push(toHTML(commenterUrls, editors, ghCommenters, headers));
    }
    if (ghContributors) {
      toHTMLPromises.push(toHTML(contributorUrls, editors, ghContributors, headers));
    }
    await Promise.all(toHTMLPromises);
  } catch (error) {
    pub(
      "error",
      `Error loading contributors and/or commenters from GitHub. ${error}`
    );
  }
}
