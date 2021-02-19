// @ts-check
/**
 * Fetches commits between two commitish (tag or commit) - `from` and `to=HEAD`
 * and shows them as a list of "changes during" those commitish. If a filter
 * function is provided by the user, it is used to filter the commits that are
 * to be shown. Otherwise, all commits are shown.
 *
 * @typedef {{message: string, hash: string}} Commit
 */
import { html } from "../import-maps.js";
import { showError } from "../utils.js";

export const name = "core/custom-elements/rs-changelog";
const customElementName = "rs-changelog";

export async function run(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll(customElementName);
  if (!elems.length) return;

  const github = conf.github;
  if (!github) {
    const msg = "`respecConfig.github` is not set.";
    return showError(msg, name);
  }

  const { apiBase, fullName, repoURL } = github;
  elems.forEach(el => {
    Object.assign(el.dataset, { apiBase, fullName, repoURL });
  });

  customElements.define(customElementName, ChangelogElement);

  const readyPromises = [...elems].map(
    el => new Promise(res => el.addEventListener("done", res, { once: true }))
  );
  await Promise.all(readyPromises);

  // Cleanup
  elems.forEach(el => {
    delete el.dataset.apiBase;
    delete el.dataset.fullName;
    delete el.dataset.repoURL;
  });
}

class ChangelogElement extends HTMLElement {
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
      // props handled by ReSpec
      github: {
        apiBase: this.dataset.apiBase,
        fullName: this.dataset.fullName,
        repoURL: this.dataset.repoURL,
      },
    };
  }

  connectedCallback() {
    const { from, to, filter, github } = this.props;
    html.bind(this)`
      <ul>
      ${{
        any: fetchCommits(from, to, filter, github)
          .then(commits => toHTML(commits, github))
          .catch(error => showError(error.message, name, { elements: [this] }))
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
  }
}

async function fetchCommits(from, to, filter, gh) {
  /** @type {Commit[]} */
  let commits;
  try {
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

async function toHTML(commits, github) {
  const { repoURL } = github;
  return commits.map(commit => {
    const [message, prNumber = null] = commit.message.split(/\(#(\d+)\)/, 2);
    const commitURL = `${repoURL}commit/${commit.hash}`;
    const prURL = prNumber ? `${repoURL}pull/${prNumber}` : null;
    const pr = prNumber && html` (<a href="${prURL}">#${prNumber}</a>)`;
    return html`<li><a href="${commitURL}">${message.trim()}</a>${pr}</li>`;
  });
}
