// @ts-check
/**
 * Fetches commits since a given commitish (tag or commit) and shows them as a
 * list of "changes since" given commitish. If a filter function is provided by
 * the user, it is used to filter the commits that are to be shown. Otherwise,
 * all commits are shown.
 */
import { done } from "./index.js";
import { pub } from "../pubsubhub.js";

export const name = "rs-changelog";

export function run(conf) {
  class Changelog extends HTMLElement {
    constructor() {
      super();
      this.data = {
        from: this.getAttribute("from"),
        to: this.getAttribute("to") || "HEAD",
        /** @type {typeof defaultFilter} */
        filter:
          typeof window[this.getAttribute("filter")] === "function"
            ? window[this.getAttribute("filter")]
            : defaultFilter,
        /** @type {Commit[]} */
        commits: [],
      };
    }

    connectedCallback() {
      this.getData()
        .then(() => this.render())
        .finally(() => done(this));
    }

    async getData() {
      const { from, to, filter } = this.data;
      this.append("Fetching commits...");
      const commits = await getCommits(from, to, conf.githubAPI);
      this.firstChild.remove();
      if (!commits) return;
      this.data.commits = commits.filter(filter);
    }

    async render() {
      const { commits } = this.data;
      const nodes = commits.map(commit => {
        const el = document.createElement("li");
        el.textContent = commit.message;
        return el;
      });
      const ul = this.appendChild(document.createElement("ul"));
      ul.append(...nodes);
    }
  }

  customElements.define(name, Changelog);
}

/**
 * @param {string} from commit-ish
 * @param {string} to commit-ish
 * @param {string} apiURL
 * @typedef {{ hash: string, message: string }} Commit
 */
async function getCommits(from, to, apiURL) {
  const url = new URL("commits", apiURL);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
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
      throw new Error(`No commits between ${from}..${to}.`);
    }
    return commits;
  } catch (error) {
    pub("error", "Error loading commits from GitHub.");
    console.error(error);
    return null;
  }
}

/**
 * @param {Commit} _commit
 */
function defaultFilter(_commit) {
  return true;
}
