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
} from "./github-api.js";
import { flatten, joinAnd } from "./utils.js";
import fetch from "./fetch.js";
import { pub } from "./pubsubhub.js";
export const name = "core/contrib";

function prop(prop) {
  return o => o[prop];
}
const nameProp = prop("name");

/**
 * @param {string} origin
 * @param  {...any} thingsWithUsers
 */
function findUserURLs(origin, ...thingsWithUsers) {
  const usersURLs = thingsWithUsers
    .reduce(flatten, [])
    .filter(thing => thing && thing.user)
    .map(({ user }) => new URL(user.url, origin).href);
  return [...new Set(usersURLs)];
}

async function toHTML(urls, editors, element, headers) {
  const args = await Promise.all(
    urls
      .map(url =>
        fetch(url, { headers }).then(r => {
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

/** @param {import("../respec-document.js").RespecDocument} */
export default async function({ document, configuration: conf }) {
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
  const response = await fetch(githubAPI, { headers });
  checkLimitReached(response);
  if (!response.ok) {
    const msg =
      "Error fetching repository information from GitHub. " +
      `(HTTP Status ${response.status}).`;
    pub("error", msg);
    return;
  }
  const indexes = await response.json();
  const {
    issues_url,
    issue_comment_url,
    comments_url,
    contributors_url,
  } = indexes;

  const origin = new URL(githubAPI).origin;
  const [
    issues,
    issueComments,
    otherComments,
    contributors,
  ] = await Promise.all(
    [issues_url, issue_comment_url, comments_url, contributors_url].map(url => {
      const cleansedUrl = url.replace(/\{[^}]+\}/, "");
      return fetchAll(new URL(cleansedUrl, origin).href, headers);
    })
  );

  const editors = conf.editors.map(nameProp);
  try {
    const toHTMLPromises = [
      {
        elt: ghCommenters,
        getUrls: () =>
          findUserURLs(origin, issues, issueComments, otherComments),
      },
      {
        elt: ghContributors,
        getUrls: () => contributors.map(c => new URL(c.url, origin).href),
      },
    ]
      .filter(c => c.elt)
      .map(c => toHTML(c.getUrls(), editors, c.elt, headers));

    await Promise.all(toHTMLPromises);
  } catch (error) {
    pub("error", "Error loading contributors and/or commenters from GitHub.");
    console.error(error);
  }
}
