// @ts-check
// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.
import { fetchAndCache, joinAnd } from "./utils.js";
import hyperHTML from "hyperhtml";
import { pub } from "./pubsubhub.js";
export const name = "core/contrib";

const GITHUB_API = "https://respec.org/github/";

export async function run(conf) {
  const ghContributors = document.getElementById("gh-contributors");
  if (!ghContributors) {
    return;
  }

  if (!conf.github) {
    const msg =
      "Requested list of contributors from GitHub, but " +
      "[`github`](https://github.com/w3c/respec/wiki/github) configuration option is not set.";
    pub("error", msg);
    return;
  }

  const ghURL = new URL(conf.github.repoURL);
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  const editors = conf.editors.map(editor => editor.name);

  const isTestEnv =
    conf.githubAPI &&
    new URL(conf.githubAPI).hostname === window.parent.location.hostname;
  const apiURL = isTestEnv ? conf.githubAPI : GITHUB_API;

  await showContributors(org, repo, editors, apiURL);
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

  elem.textContent = "Fetching list of contributors...";
  const contributors = await getContributors();
  if (contributors !== null) {
    toHTML(contributors, elem);
  } else {
    elem.textContent = "Failed to fetch contributors.";
  }

  async function getContributors() {
    const { href: url } = new URL(`${org}/${repo}/contributors`, apiURL);
    try {
      const res = await fetchAndCache(url);
      if (!res.ok) {
        throw new Error(
          `Request to ${url} failed with status code ${res.status}`
        );
      }
      /** @type {Contributor[]} */
      const contributors = await res.json();
      return contributors.filter(
        user => !editors.includes(user.name || user.login)
      );
    } catch (error) {
      pub("error", "Error loading contributors from GitHub.");
      console.error(error);
      return null;
    }
  }
}

/**
 * @typedef {{ name?: string, login: string }} Contributor
 * @param {Contributor[]} contributors
 * @param {HTMLElement} element
 */
function toHTML(contributors, element) {
  const sortedContributors = contributors.sort((a, b) => {
    const nameA = a.name || a.login;
    const nameB = b.name || b.login;
    return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
  });

  if (element.tagName === "UL") {
    hyperHTML(element)`${sortedContributors.map(
      ({ name, login }) =>
        `<li><a href="https://github.com/${login}">${name || login}</a></li>`
    )}`;
    return;
  }

  const names = sortedContributors.map(user => user.name || user.login);
  element.textContent = joinAnd(names);
}
