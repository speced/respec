// @ts-check
/**
 * Fetches commits between two commitish (tag or commit) - `from` and `to=HEAD`
 * and shows them as a list of "changes during" those commitish. If a filter
 * function is provided by the user, it is used to filter the commits that are
 * to be shown. Otherwise, all commits are shown.
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
      /** @type {(commit: Commit) => boolean} */
      filter:
        typeof window[this.getAttribute("filter")] === "function"
          ? window[this.getAttribute("filter")]
          : () => true,
    };
  }

  connectedCallback() {
    const { from, to, filter } = this.props;
    html.bind(this)`
      <ul>
      ${{
        any: fetchCommits(from, to, filter)
          .then(commits => toHTML(commits))
          .catch(error => showError(error.message, name, { elements: [this] }))
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
  }
};

async function fetchCommits(from, to, filter) {
  /** @type {Commit[]} */
  let commits;
  try {
    const gh = await github;
    if (!gh) {
      throw new Error("`respecConfig.github` is not set");
    }
    const url = new URL("commits", `${gh.apiBase}/${gh.fullName}/`);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);

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
    console.error(error);
    throw new Error(msg);
  }
  return commits;
}

async function toHTML(commits) {
  const { repoURL } = await github;
  return commits.map(commit => {
    const [message, prNumber = null] = commit.message.split(/\(#(\d+)\)/, 2);
    const commitURL = `${repoURL}commit/${commit.hash}`;
    const prURL = prNumber ? `${repoURL}pull/${prNumber}` : null;
    const pr = prNumber && html` (<a href="${prURL}">#${prNumber}</a>)`;
    return html`<li><a href="${commitURL}">${message.trim()}</a>${pr}</li>`;
  });
}
