// @ts-check
/**
 * Fetches commits since a given commitish (tag or commit) and shows them as a
 * list of "changes since" given commitish. If a filter function is provided by
 * the user, it is used to filter the commits that are to be shown. Otherwise,
 * all commits are shown.
 */
import { pub } from "./pubsubhub.js";

export const name = "core/changes-since";

export async function run(conf) {
  const { changesSince } = conf;
  if (!changesSince) return; // nothing to do

  const el = document.querySelector("ul#changes-since");
  if (!el) {
    const msg =
      "A `<ul id='changes-since'></ul>` is required for `respecConfig.changesSince`.";
    pub("error", msg);
    return;
  }

  const filter =
    typeof changesSince.filter === "function"
      ? changesSince.filter
      : defaultFilter;

  const commits = await getCommits(changesSince.tag, conf.githubAPI);
  if (!commits) return;
  showCommits(commits, filter, el);
}

/**
 * @param {string} since commit-ish
 * @param {string} apiURL
 * @typedef {{ hash: string, message: string }} Commit
 */
async function getCommits(since, apiURL) {
  const url = new URL("commits", apiURL);
  url.searchParams.set("since", since);
  try {
    const res = await fetch(url.href);
    if (!res.ok) {
      throw new Error(
        `Request to ${url} failed with status code ${res.status}`
      );
    }
    /** @type {Commit[]} */
    const commits = await res.json();
    if (!commits.length) {
      throw new Error(`No commits since ${since}.`);
    }
    return commits;
  } catch (error) {
    pub("error", "Error loading commits from GitHub.");
    console.error(error);
    return null;
  }
}

/**
 * @param {Commit[]} commits
 * @param {(Commit) => boolean} filter
 * @param {HTMLElement} element
 */
function showCommits(commits, filter, element) {
  const commitsToShow = commits.filter(filter);
  const nodes = commitsToShow.map(commit => {
    const el = document.createElement("li");
    el.textContent = commit.message;
    return el;
  });
  element.append(...nodes);
}

/**
 * @param {Commit} _commit
 */
function defaultFilter(_commit) {
  return true;
}
