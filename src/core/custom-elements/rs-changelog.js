// @ts-check
/**
 * Fetches commits since a given commitish (tag or commit) and shows them as a
 * list of "changes since" given commitish. If a filter function is provided by
 * the user, it is used to filter the commits that are to be shown. Otherwise,
 * all commits are shown.
 */
import { apiURLPromise } from "../github.js";
import { pub } from "../pubsubhub.js";

export const name = "rs-changelog";

let readyResolver;
const readyPromise = new Promise(resolve => {
  readyResolver = resolve;
});

export default class Changelog extends HTMLElement {
  constructor() {
    super();
    this.props = {
      from: this.getAttribute("from"),
      to: this.getAttribute("to") || "HEAD",
      /** @type {typeof defaultFilter} */
      filter:
        typeof window[this.getAttribute("filter")] === "function"
          ? window[this.getAttribute("filter")]
          : defaultFilter,
    };
  }

  get ready() {
    return readyPromise;
  }

  async connectedCallback() {
    this.state = {
      commits: this.getCommits(),
    };
    await this.render();
    readyResolver();
  }

  async getCommits() {
    const { from, to, filter } = this.props;
    try {
      const githubAPI = await apiURLPromise;
      const url = new URL("commits", githubAPI);
      // TODO: /s/since/from
      url.searchParams.set("since", from);
      url.searchParams.set("to", to);

      const res = await fetch(url.href);
      if (!res.ok) {
        throw new Error(
          `Request to ${url} failed with status code ${res.status}`
        );
      }
      /** @type {{message: string, hash: string}[]} */
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
    const nodes = commits.map(commit => {
      const el = document.createElement("li");
      el.textContent = commit.message;
      return el;
    });
    const ul = this.appendChild(document.createElement("ul"));
    ul.append(...nodes);
  }
}

/**
 * @param {Commit} _commit
 */
function defaultFilter(_commit) {
  return true;
}
