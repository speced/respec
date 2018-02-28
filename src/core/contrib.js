// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues.
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.

import { fetch as ghFetch, fetchIndex } from "core/github";
import { pub } from "core/pubsubhub";
export const name = "core/contrib";

function prop(prop) {
  return o => o[prop];
}

function findUsers(...thingsToFind) {
  const users = new Set();
  for (const things of thingsToFind) {
    for (const thing of things) {
      if (thing.user) {
        users.add(thing.user.url);
      }
    }
  }
  return [...users];
}

function join(things) {
  if (!things.length) {
    return "";
  }
  const length = things.length;
  const last = things[length - 1];
  if (length === 1) {
    return last;
  }
  if (length === 2) {
    return `${things[0]} and ${last}`;
  }
  return `${things.join(", ")}, and ${last}`;
}

async function toHTML(urls, editors, element) {
  const args = await Promise.all(...urls.map(ghFetch));
  const names = args
    .map(user => user[0].name || user[0].login)
    .filter(name => !editors.includes(name))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  element.textContent = join(names);
  element.id = null;
}

export async function run(conf) {
  const ghCommenters = document.getElementById("gh-commenters");
  const ghContributors = document.getElementById("gh-contributors");

  if (!ghCommenters && !ghContributors) {
    return;
  }

  if (!conf.githubAPI) {
    const elements = [];
    if (ghCommenters) elements.push("#" + ghCommenters.id);
    if (ghContributors) elements.push("#" + ghContributors.id);
    pub(
      "error",
      `Requested list of contributors and/or commenters from GitHub (${
        elements.join(" and ")
      }) but config.githubAPI is not set.`
    );
    return;
  }

  const json = await ghFetch(conf.githubAPI);
  const [issues, comments, contributors] = await Promise.all(
    fetchIndex(json.issues_url),
    fetchIndex(json.issue_comment_url),
    fetchIndex(json.contributors_url)
  );
  const editors = respecConfig.editors.map(prop("name"));
  const commenters = findUsers(issues, comments);
  contributors = contributors.map(prop("url"));
  try {
    return Promise.all(
      toHTML(commenters, editors, ghCommenters),
      toHTML(contributors, editors, ghContributors)
    );
  }
  catch (error) {
    pub(
      "error",
      "Error loading contributors and/or commenters from  Error: " + error
    );
  }
}
