// @ts-check
// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues. [DEPRECATED]
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.
import { fetchAndCache, joinAnd } from "./utils.js";
import { pub } from "./pubsubhub.js";
export const name = "core/contrib";

/**
 * @typedef {{ name?: string, login: string }} User
 * @param {User[]} users
 * @param {string[]} editors
 * @param {HTMLElement} element
 */
function toHTML(users, editors, element) {
  const names = users
    .map(user => user.name || user.login)
    .filter(name => !editors.includes(name))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  element.textContent = joinAnd(names);
}

const GITHUB_API = "https://respec.org/github/";

export async function run(conf) {
  const ghCommenters = document.getElementById("gh-commenters");
  const ghContributors = document.getElementById("gh-contributors");
  if (!ghCommenters && !ghContributors) {
    return;
  }

  if (!conf.github) {
    const msg =
      "Requested list of contributors from GitHub, but " +
      "[`github`](https://github.com/w3c/respec/wiki/github) is not set.";
    pub("error", msg);
    return;
  }

  const ghURL = new URL(conf.github.repoURL);
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  const editors = conf.editors.map(editor => editor.name);

  const isTestEnv =
    conf.githubAPI && new URL(conf.githubAPI).hostname === location.hostname;
  const apiURL = isTestEnv ? conf.githubAPI : GITHUB_API;

  await showContributors(org, repo, editors, apiURL);
  showCommenters();
}

/**
 * Show list of contributors in #gh-contributors
 * @param {string} org
 * @param {string} repo
 * @param {string[]} editors
 * @param {string} apiURL
 */
async function showContributors(org, repo, editors, apiURL) {
  const elem = document.getElementById("gh-contributors");
  if (!elem) return;

  const contributors = await getContributors(org, repo);
  if (contributors !== null) {
    toHTML(contributors, editors, elem);
  }

  async function getContributors() {
    const url = new URL(`${org}/${repo}/contributors`, apiURL);
    try {
      const res = await fetchAndCache(url);
      if (!res.ok) {
        throw new Error(
          `Request to ${url} failed with status code ${res.status}`
        );
      }
      /** @type {User[]} */
      const contributors = await res.json();
      return contributors;
    } catch (error) {
      pub("error", "Error loading contributors from GitHub.");
      console.error(error);
      return null;
    }
  }
}

function showCommenters() {
  const elem = document.getElementById("gh-contributors");
  if (elem) {
    pub(
      "warn",
      "Use of `#gh-commenters` is deprecated. If you want to use this feature, " +
        "please [add your comments](https://github.com/w3c/respec/issues/2446)."
    );
  }
}
