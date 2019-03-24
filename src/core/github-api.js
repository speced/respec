import { fetchAndCache } from "./utils";
import { pub } from "./pubsubhub";
export const name = "core/github-api";

export function githubRequestHeaders(conf) {
  const { githubUser, githubToken } = conf;
  const headers = {
    // Get back HTML content instead of markdown
    // See: https://developer.github.com/v3/media/
    Accept: "application/vnd.github.v3.html+json",
  };
  if (githubUser && githubToken) {
    const credentials = btoa(`${githubUser}:${githubToken}`);
    const Authorization = `Basic ${credentials}`;
    Object.assign(headers, { Authorization });
  } else if (githubToken) {
    const Authorization = `token ${githubToken}`;
    Object.assign(headers, { Authorization });
  }
  return headers;
}

export async function getRateLimit(conf) {
  const headers = githubRequestHeaders(conf);
  const request = new Request(`https://api.github.com/rate_limit`, {
    mode: "cors",
    referrerPolicy: "no-referrer",
    headers,
  });
  const responseJSON = await fetch(request).then(r => r.json());
  return responseJSON.rate.remaining;
}

export async function fetchAndStoreGithubIssues(conf) {
  const { githubAPI } = conf;
  /** @type {NodeListOf<HTMLElement>} */
  const specIssues = document.querySelectorAll(".issue[data-number]");
  let remainingRequests = await getRateLimit(conf);
  if (specIssues.length > remainingRequests) {
    const msg =
      `Your spec contains ${specIssues.length} Github issues, ` +
      `but your current GitHub quota only allows ${remainingRequests} more requests. Some issues will not show up.`;
    pub("warning", msg);
  }
  const issuePromises = [...specIssues]
    .map(elem => Number.parseInt(elem.dataset.number, 10))
    .filter(issueNumber => issueNumber)
    .map(async issueNumber => {
      if (remainingRequests > 0) {
        const issueURL = `${githubAPI}/issues/${issueNumber}`;
        const headers = githubRequestHeaders(conf);
        const request = new Request(issueURL, {
          mode: "cors",
          referrerPolicy: "no-referrer",
          headers,
        });
        const response = await fetchAndCache(request);
        remainingRequests--;
        return processResponse(response, issueNumber);
      }
    });
  const issues = await Promise.all(issuePromises);
  return new Map(issues);
}

/**
 * @typedef {{ color: string, name: string }} GitHubLabel
 * @typedef {{ title: string, number: number, state: string, message: string, body_html: string, labels: GitHubLabel[] }} GitHubIssue
 *
 * @param {Response} response
 * @param {number} issueNumber
 * @returns {[number, GitHubIssue]}
 */
async function processResponse(response, issueNumber) {
  // "message" is always error message from GitHub
  const issue = { title: "", number: issueNumber, state: "", message: "" };
  try {
    const json = await response.json();
    Object.assign(issue, json);
  } catch (err) {
    issue.message = `Error JSON parsing issue #${issueNumber} from GitHub.`;
  }
  if (!response.ok || issue.message) {
    const msg = `Error fetching issue #${issueNumber} from GitHub. ${
      issue.message
    } (HTTP Status ${response.status}).`;
    pub("error", msg);
  }
  return [issueNumber, issue];
}

function findNext(header) {
  // Finds the next URL of paginated resources which
  // is available in the Link header. Link headers look like this:
  // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
  // More info here: https://developer.github.com/v3/#link-header
  const m = (header || "").match(/<([^>]+)>\s*;\s*rel="next"/);
  return m ? m[1] : null;
}

export async function fetchAll(url, headers, output = []) {
  const urlObj = new URL(url);
  if (urlObj.searchParams && !urlObj.searchParams.has("per_page")) {
    urlObj.searchParams.append("per_page", "100");
  }
  const request = new Request(urlObj, { headers });
  request.headers.set("Accept", "application/vnd.github.v3+json");
  const response = await fetch(request);
  const json = await response.json();
  if (Array.isArray(json)) {
    output.push(...json);
  }
  const next = findNext(response.headers.get("Link"));
  return next ? fetchAll(next, headers, output) : output;
}

export async function fetchIndex(url, headers) {
  // converts URLs of the form:
  // https://api.github.com/repos/user/repo/comments{/number}
  // into:
  // https://api.github.com/repos/user/repo/comments
  // which is what you need if you want to get the index.
  return fetchAll(url.replace(/\{[^}]+\}/, ""), headers);
}
