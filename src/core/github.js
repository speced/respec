/**
 * core/github
 *
 * @see https://github.com/w3c/respec/wiki/github
 */

import l10n from "core/l10n";
import css from "deps/text!deps/balloon.css";
import { pub } from "core/pubsubhub";

export const name = "core/github";

function getSelectionCoordinates() {
  let doc = window.document;
  let selection = doc.selection, range, rects, rect;
  let x = 0, y = 0;
  if (selection) {
    if (selection.type !== "Control") {
      range = selection.createRange();
      range.collapse(false);
      x = range.boundingLeft;
      y = range.boundingTop;
    }
  } else if (window.getSelection) {
    selection = window.getSelection();
    if (selection.rangeCount) {
      range = selection.getRangeAt(0).cloneRange();
      if (range.getClientRects) {
        range.collapse(false);
        rects = range.getClientRects();
        if (rects.length > 0) {
          rect = rects[0];
        }
        x = rect.left;
        y = rect.top;
      }
      // Fall back to inserting a temporary element
      if (x === 0 && y === 0) {
        const span = doc.createElement("span");
        if (span.getClientRects) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild( doc.createTextNode("\u200b") );
          range.insertNode(span);
          rect = span.getClientRects()[0];
          x = rect.left;
          y = rect.top;
          const spanParent = span.parentNode;
          spanParent.removeChild(span);

          // Glue any broken text nodes back together
          spanParent.normalize();
        }
      }
    }
  }
  return { x: x, y: y };
}


function enableFileIssuesOnSelect(issueBase){
  const { body, head } = document;

  const codeStyle = document.createElement("style");
  codeStyle.textContent = css;
  codeStyle.classList.add('removeOnSave');
  head.appendChild(codeStyle);

  var fileIssueLink = document.createElement('button');
  fileIssueLink.setAttribute('data-balloon', 'file an issue related to the text selected');
  fileIssueLink.setAttribute('data-balloon-pos', 'up');
  fileIssueLink.setAttribute('id', 'respec-file-issue-btn');
  fileIssueLink.classList.add('removeOnSave', 'respec-file-issue-hidden');
  fileIssueLink.textContent = 'i';
  fileIssueLink.addEventListener("click", () => {
    window.location.href = fileIssueLink.dataset.href;
    fileIssueLink.classList.add('respec-file-issue-hidden');
  });
  body.appendChild(fileIssueLink);

  body.addEventListener("mouseup", () => {
    const textSelected = window.getSelection().toString();
    const newIssueURL = new URL('./new',issueBase);
    const { searchParams } = newIssueURL;
    let titleText;

    if (textSelected) {
      if (textSelected.length > 40) {
        const pos = textSelected.indexOf(" ", 40);
        titleText = textSelected.slice(0, pos).concat("...");
      } else {
        titleText = textSelected;
      }
      searchParams.set('title', `'${titleText}'`);
      searchParams.set('body', `> ${textSelected}`);
      fileIssueLink.classList.remove('respec-file-issue-hidden');
      fileIssueLink.dataset.href = newIssueURL.href;
      const { x, y } = getSelectionCoordinates();
      fileIssueLink.style.position = "fixed";
      fileIssueLink.style.left = `${x}px`;
      fileIssueLink.style.top = `${y}px`;
    } else {
      fileIssueLink.classList.add('respec-file-issue-hidden');
    }
  });

}

function findNext(header) {
  // Finds the next URL of paginated resources which
  // is available in the Link header. Link headers look like this:
  // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
  // More info here: https://developer.github.com/v3/#link-header
  var m = (header || "").match(/<([^>]+)>\s*;\s*rel="next"/);
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

export async function fetch(url) {
  let response = await window.fetch(url);
  if (!response.ok) {
    throw new Error("GitHub Response not OK. Probably exceeded request limit.");
  }
  return await response.json();
}

export function fetchIndex(url, headers) {
  // converts URLs of the form:
  // https://api.github.com/repos/user/repo/comments{/number}
  // into:
  // https://api.github.com/repos/user/repo/comments
  // which is what you need if you want to get the index.
  return fetchAll(url.replace(/\{[^}]+\}/, ""), headers);
}

export async function run(conf) {
  if (!conf.hasOwnProperty("github") || !conf.github) {
    // nothing to do, bail out.
    return;
  }
  if (
    typeof conf.github === "object" &&
    !conf.github.hasOwnProperty("repoURL")
  ) {
    pub(
      "error",
      "`respecConf.github` missing property `repoURL`. See https://github.com/w3c/respec/wiki/github"
    );
    return;
  }
  let ghURL;
  try {
    ghURL = new URL(conf.github.repoURL || conf.github);
  } catch (err) {
    pub("error", `\`respecConf.github\` is not a valid URL? (${ghURL})`);
    return;
  }
  if (ghURL.origin !== "https://github.com") {
    pub(
      "error",
      `\`respecConf.github\` must be HTTPS and pointing to GitHub. (${ghURL})`
    );
    return;
  }
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  if (!org || !repo) {
    pub(
      "error",
      `\`respecConf.github\` URL needs a path with, for example, w3c/my-spec`
    );
  }
  const branch = conf.github.branch || "gh-pages";
  const newProps = {
    otherLinks: [],
    shortName: repo,
    edDraftURI: `https://${org.toLowerCase()}.github.io/${repo}/`,
    githubAPI: `https://api.github.com/repos/${org}/${repo}`,
    issueBase: `${ghURL.href}${ghURL.pathname.endsWith("/") ? "" : "/"}issues/`,
  };
  if (conf.enableIssueFeature && newProps.issueBase &&
    '/https://github.com/'.search(newProps.issueBase)) {
    enableFileIssuesOnSelect(newProps.issueBase);
  }
  const commitsHref = `${ghURL.href}${
    ghURL.pathname.endsWith("/") ? "" : "/"
  }commits/${branch}`;
  const otherLink = {
    key: conf.l10n.participate,
    data: [
      {
        value: `GitHub ${org}/${repo}`,
        href: ghURL,
      },
      {
        value: conf.l10n.file_a_bug,
        href: newProps.issueBase,
      },
      {
        value: conf.l10n.commit_history,
        href: commitsHref,
      },
    ],
  };
  // Assign new properties, but retain exsiting ones
  Object.assign(conf, { ...newProps, ...conf });
  conf.otherLinks.unshift(otherLink);
}
