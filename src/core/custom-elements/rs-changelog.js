// @ts-check
/**
 * Fetches commits between two commitish (tag or commit) - `from` and `to=HEAD`
 * and shows them as a list of "changes during" those commitish. If a filter
 * function is provided by the user, it is used to filter the commits that are
 * to be shown. Otherwise, all commits are shown.
 *
 * Optionally, a `path` parameter can be provided to filter commits to only
 * those that affected a specific file or folder (useful for monorepos).
 *
 * Optionally, a `repo` parameter can be provided (e.g., "owner/repo") to
 * fetch commits from a specific repository, overriding the default repository
 * from respecConfig.github.
 *
 * @typedef {{message: string, hash: string}} Commit
 */
import { github } from "../github.js";
import { html } from "../import-maps.js";
import { showError } from "../utils.js";

export const name = "rs-changelog";

export const element = class ChangelogElement extends HTMLElement {
  constructor() {
    super();
    this.props = {
      from: this.getAttribute("from"),
      to: this.getAttribute("to") || "HEAD",
      repo: this.getAttribute("repo"),
      path: this.getAttribute("path"),
      /** @type {(commit: Commit) => boolean} */
      filter:
        typeof window[this.getAttribute("filter")] === "function"
          ? window[this.getAttribute("filter")]
          : () => true,
    };
  }

  connectedCallback() {
    const { from, to, filter, repo, path } = this.props;
    html.bind(this)`
      <ul>
      ${{
        any: fetchCommits(from, to, filter, repo, path)
          .then(commits => toHTML(commits, repo))
          .catch(error =>
            showError(error.message, name, { elements: [this], cause: error })
          )
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
  }
};

async function fetchCommits(from, to, filter, repo, path) {
  /** @type {Commit[]} */
  let commits;
  try {
    let apiBase, fullName;
    
    if (repo) {
      // Use repo provided as attribute (e.g., "owner/repo")
      apiBase = "https://respec.org/github";
      fullName = repo;
    } else {
      // Fall back to respecConfig.github
      const gh = await github;
      if (!gh) {
        throw new Error("`respecConfig.github` is not set");
      }
      apiBase = gh.apiBase;
      fullName = gh.fullName;
    }
    
    const url = new URL("commits", `${apiBase}/${fullName}/`);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    if (path) {
      url.searchParams.set("path", path);
    }

    const res = await fetch(url.href);
    if (!res.ok) {
      throw new Error(
        `Request to ${url} failed with status code ${res.status}`
      );
    }
    commits = await res.json();
    if (!commits.length) {
      throw new Error(`No commits between ${from}..${to}.`);
    }
    commits = commits.filter(filter);
  } catch (error) {
    const msg = `Error loading commits from GitHub. ${error.message}`;
    throw new Error(msg, { cause: error });
  }
  return commits;
}

async function toHTML(commits, repo) {
  let repoURL;
  
  if (repo) {
    // Construct repoURL from repo (e.g., "owner/repo" -> "https://github.com/owner/repo/")
    repoURL = `https://github.com/${repo}/`;
  } else {
    // Use the default repoURL from respecConfig.github
    const gh = await github;
    repoURL = gh.repoURL;
  }
  
  return commits.map(commit => {
    const [message, prNumber = null] = commit.message.split(/\(#(\d+)\)/, 2);
    const commitURL = `${repoURL}commit/${commit.hash}`;
    const prURL = prNumber ? `${repoURL}pull/${prNumber}` : null;
    const pr = prNumber && html` (<a href="${prURL}">#${prNumber}</a>)`;
    return html`<li><a href="${commitURL}">${message.trim()}</a>${pr}</li>`;
  });
}
