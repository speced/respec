import { fetchAndCache } from "./utils";
import { pub } from "./pubsubhub";
export const name = "core/github-api";

export async function fetchAndStoreGithubIssues(conf) {
  const { githubAPI, githubUser, githubToken } = conf;
  /** @type {NodeListOf<HTMLElement>} */
  const specIssues = document.querySelectorAll(".issue[data-number]");

  const ratelimitURL = `https://api.github.com/rate_limit`;
  const rateheaders = {
    // Get back HTML content instead of markdown
    // See: https://developer.github.com/v3/media/
    Accept: "application/vnd.github.v3.html+json",
  };
  const raterequest = new Request(ratelimitURL, {
    mode: "cors",
    referrerPolicy: "no-referrer",
    rateheaders,
  });
  const rateresponse = await fetchAndCache(raterequest);
  const jsonresponse = await rateresponse.json();
  if (specIssues.length > jsonresponse.rate.remaining) {
    const msg =
      `Your spec contains ${specIssues.length} Github issues, ` +
      `but GitHub only allows ${
        jsonresponse.rate.remaining
      } requests. Some issues might not show up.`;
    pub("warning", msg);
  }
  const issuePromises = [...specIssues]
    .map(elem => Number.parseInt(elem.dataset.number, 10))
    .filter(issueNumber => issueNumber)
    .map(async issueNumber => {
      const issueURL = `${githubAPI}/issues/${issueNumber}`;
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
      const request = new Request(issueURL, {
        mode: "cors",
        referrerPolicy: "no-referrer",
        headers,
      });
      const response = await fetchAndCache(request);
      return processResponse(response, issueNumber);
    });
  const issues = await Promise.all(issuePromises);
  return new Map(issues);
}

export function extractGithubCredentials(conf) {
  const headers = {};
  const { githubUser, githubToken } = conf;
  if (githubUser && githubToken) {
    const credentials = btoa(`${githubUser}:${githubToken}`);
    const Authorization = `Basic ${credentials}`;
    Object.assign(headers, { Authorization });
  }
  return headers;
}

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
  return /** @type {[number, GitHubIssue]} */ ([issueNumber, issue]);
}

function findNext(header) {
  // Finds the next URL of paginated resources which
  // is available in the Link header. Link headers look like this:
  // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
  // More info here: https://developer.github.com/v3/#link-header
  const m = (header || "").match(/<([^>]+)>\s*;\s*rel="next"/);
  return (m && m[1]) || null;
}

export async function fetchAll(url, headers = {}, output = []) {
  const urlObj = new URL(url);
  if (urlObj.searchParams && !urlObj.searchParams.has("per_page")) {
    urlObj.searchParams.append("per_page", "100");
  }
  const request = new Request(urlObj, {
    headers,
  });
  request.headers.set("Accept", "application/vnd.github.v3+json");
  const response = await window.fetch(request);
  const json = await response.json();
  if (Array.isArray(json)) {
    output.push(...json);
  }
  const next = findNext(response.headers.get("Link"));
  return next ? fetchAll(next, headers, output) : output;
}

export function fetchIndex(url, headers) {
  // converts URLs of the form:
  // https://api.github.com/repos/user/repo/comments{/number}
  // into:
  // https://api.github.com/repos/user/repo/comments
  // which is what you need if you want to get the index.
  return fetchAll(url.replace(/\{[^}]+\}/, ""), headers);
}

export async function getArgs(urls, editors, elements, headers) {
  return await Promise.all(urls.map(url => fetch(url, { headers })));
}

export async function run(conf) {
  const headers = {};
  const { githubAPI, githubUser, githubToken } = conf;
  if (githubUser && githubToken) {
    const credentials = btoa(`${githubUser}:${githubToken}`);
    const Authorization = `Basic ${credentials}`;
    Object.assign(headers, { Authorization });
  }
  if (!githubAPI) {
    const msg =
      "Requested list of contributors and/or commenters from GitHub, but " +
      "[`githubAPI`](https://github.com/w3c/respec/wiki/githubAPI) is not set.";
    pub("error", msg);
    return;
  }
  const response = await fetch(githubAPI, { headers });
  if (!response.ok) {
    const msg =
      "Error fetching repository information from GitHub. " +
      `(HTTP Status ${response.status}).`;
    pub("error", msg);
    return;
  }
  const indexes = await response.json();
  const { issues_url, issue_comment_url, contributors_url } = indexes;
  const [issues, comments, contributors] = await Promise.all([
    fetchIndex(issues_url, headers),
    fetchIndex(issue_comment_url, headers),
    fetchIndex(contributors_url, headers),
  ]);
  window.ghRepoInfo = {
    issues,
    comments,
    contributors,
  };
}
