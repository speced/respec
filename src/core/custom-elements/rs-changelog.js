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
import { hyperHTML } from "../import-maps.js";
import { pub } from "../pubsubhub.js";

export const name = "rs-changelog";

export default class ChangelogElement extends HTMLElement {
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
    hyperHTML.bind(this)`
      <ul>
      ${{
        any: fetchCommits(from, to, filter)
          .then(commits => toHTML(commits))
          .catch(error => pub("error", error.message))
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
  }
}

async function fetchCommits(from, to, filter) {
  try {
    const { api: githubAPI } = await github;
    const url = new URL("commits", githubAPI);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);

    const res = await fetch(url.href);
    if (!res.ok) {
      throw new Error(
        `Request to ${url} failed with status code ${res.status}`
      );
    }
    /** @type {Commit[]} */
    const commits = await res.json();
    if (!commits.length) {
      throw new Error(`No commits between ${from}..${to}.`);
    }
    return commits.filter(filter);
  } catch (error) {
    const msg = `Error loading commits from GitHub. ${error.message}`;
    console.error(error);
    throw new Error(msg);
  }
}

async function toHTML(commits) {
  const { repoURL } = await github;
  return commits.map(commit => {
    const [message, prNumber = null] = commit.message.split(/\(#(\d+)\)/, 2);
    const commitURL = `${repoURL}commit/${commit.hash}`;
    const prURL = prNumber ? `${repoURL}pull/${prNumber}` : null;
    const pr = prNumber && hyperHTML` (<a href="${prURL}">#${prNumber}</a>)`;
    return hyperHTML`<li><a href="${commitURL}">${message.trim()}</a>${pr}</li>`;
  });
}
