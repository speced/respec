// @ts-check
/**
 * Fetches commits since a given commitish (tag or commit) and shows them as a
 * list of "changes since" given commitish. If a filter function is provided by
 * the user, it is used to filter the commits that are to be shown. Otherwise,
 * all commits are shown.
 *
 * @typedef {{message: string, hash: string}} Commit
 */
import { github } from "../github.js";
import { hyperHTML } from "../import-maps.js";
import { pub } from "../pubsubhub.js";
import { ready } from "./index.js";

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

  async connectedCallback() {
    this.state = { commits: this.getCommits() };
    await this.render();
    ready(this);
  }

  async getCommits() {
    const { from, to, filter } = this.props;
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
      pub("error", "Error loading commits from GitHub.");
      console.error(error);
      return null;
    }
  }

  async render() {
    this.append("Fetching commits...");
    const commits = await this.state.commits;
    this.firstChild.remove();

    if (!commits) return;

    const { repoURL } = await github;
    const nodes = commits.map(commit => {
      const [message, prNumber = null] = commit.message.split(/\(#(\d+)\)/, 2);
      const commitURL = `${repoURL}commit/${commit.hash}`;
      const prURL = prNumber ? `${repoURL}pull/${prNumber}` : null;
      const pr = prNumber && hyperHTML` (<a href="${prURL}">#${prNumber}</a>)`;
      return hyperHTML`<li><a href="${commitURL}">${message.trim()}</a>${pr}</li>`;
    });

    const ul = this.appendChild(document.createElement("ul"));
    ul.append(...nodes);
  }
}
