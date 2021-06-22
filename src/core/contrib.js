// @ts-check
// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.
import { docLink, fetchAndCache, joinAnd, showError } from "./utils.js";
import { html } from "./import-maps.js";
export const name = "core/contrib";

export async function run(conf) {
  const ghContributors = document.getElementById("gh-contributors");
  if (!ghContributors) {
    return;
  }

  if (!conf.github) {
    const msg = docLink`Requested list of contributors from GitHub, but ${"[github]"} configuration option is not set.`;
    showError(msg, name);
    return;
  }

  const editors = conf.editors.map(editor => editor.name);
  const apiURL = `${conf.github.apiBase}/${conf.github.fullName}/`;
  await showContributors(editors, apiURL);
}

/**
 * Show list of contributors in #gh-contributors
 * @param {string[]} editors
 * @param {string} apiURL
 */
async function showContributors(editors, apiURL) {
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
    const { href: url } = new URL("contributors", apiURL);
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
      const msg = "Error loading contributors from GitHub.";
      showError(msg, name);
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
    html(element)`${sortedContributors.map(
      ({ name, login }) =>
        `<li><a href="https://github.com/${login}">${name || login}</a></li>`
    )}`;
    return;
  }

  const names = sortedContributors.map(user => user.name || user.login);
  element.textContent = joinAnd(names);
}
