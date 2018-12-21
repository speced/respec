// Module core/issues-notes
// Manages issues and notes, including marking them up, numbering, inserting the title,
// and injecting the style sheet.
// These are elements with classes "issue" or "note".
// When an issue or note is found, it is reported using the "issue" or "note" event. This can
// be used by a containing shell to extract all of these.
// Issues are automatically numbered by default, but you can assign them specific numbers (or,
// despite the name, any arbitrary identifier) using the data-number attribute. Note that as
// soon as you use one data-number on any issue all the other issues stop being automatically
// numbered to avoid involuntary clashes.
// If the configuration has issueBase set to a non-empty string, and issues are
// manually numbered, a link to the issue is created using issueBase and the issue number
import { addId, fetchAndCache } from "./utils";
import css from "../deps/text!core/css/issues-notes.css";
import hyperHTML from "../deps/hyperhtml";
import { pub } from "./pubsubhub";
export const name = "core/issues-notes";

const MAX_GITHUB_REQUESTS = 60;

function handleIssues(ins, ghIssues, conf) {
  const { issueBase, githubAPI } = conf;
  const hasDataNum = !!document.querySelector(".issue[data-number]");
  let issueNum = 0;
  const issueSummary = hyperHTML`<div><h2>${
    conf.l10n.issue_summary
  }</h2><ul></ul></div>`;
  const issueList = issueSummary.querySelector("ul");
  Array.prototype.slice
    .call(ins)
    .filter(issue => issue.parentElement)
    .forEach(inno => {
      const isIssue = inno.classList.contains("issue");
      const isWarning = inno.classList.contains("warning");
      const isEdNote = inno.classList.contains("ednote");
      const isFeatureAtRisk = inno.classList.contains("atrisk");
      const isInline = inno.localName === "span";
      const dataNum = inno.getAttribute("data-number");
      const report = {
        inline: isInline,
      };
      report.type = isIssue
        ? "issue"
        : isWarning
        ? "warning"
        : isEdNote
        ? "ednote"
        : "note";
      if (isIssue && !isInline && !hasDataNum) {
        issueNum++;
        report.number = issueNum;
      } else if (dataNum) {
        report.number = dataNum;
      }
      // wrap
      if (!isInline) {
        const div = hyperHTML`<div class='${report.type +
          (isFeatureAtRisk ? " atrisk" : "")}'></div>`;
        const tit = hyperHTML`<div role='heading' class='${report.type +
          "-title"}'><span></span></div>`;
        let text = isIssue
          ? isFeatureAtRisk
            ? conf.l10n.feature_at_risk
            : conf.l10n.issue
          : isWarning
          ? conf.l10n.warning
          : isEdNote
          ? conf.l10n.editors_note
          : conf.l10n.note;
        let ghIssue;
        if (inno.id) {
          div.id = inno.id;
          inno.removeAttribute("id");
        } else {
          addId(
            div,
            "issue-container",
            report.number ? `number-${report.number}` : ""
          );
        }
        addId(div, "h", report.type);
        report.title = inno.getAttribute("title");
        if (isIssue) {
          if (hasDataNum) {
            if (dataNum) {
              text += " " + dataNum;
              // Set issueBase to cause issue to be linked to the external issue tracker
              if (!isFeatureAtRisk && issueBase) {
                tit.querySelector(".issue-number").innerHTMl =
                  "<a href='" + issueBase + dataNum + "'/>";
              } else if (isFeatureAtRisk && conf.atRiskBase) {
                tit.querySelector(".issue-number").innerHTML =
                  "<a href='" + conf.atRiskBase + dataNum + "'/>";
              }
              tit.querySelector("span").classList.add("issue-number");
              ghIssue = ghIssues.get(Number(dataNum));
              if (ghIssue && !report.title) {
                report.title = ghIssue.title;
              }
            }
          } else {
            text += " " + issueNum;
          }
          if (report.number !== undefined) {
            // Add entry to #issue-summary.
            const li = hyperHTML`<li><a></a></li>`;
            const a = li.querySelector("a");
            a.setAttribute("href", "#" + div.id);
            a.append(conf.l10n.issue + " " + report.number);
            if (report.title) {
              li.appendChild(
                hyperHTML`<span style='text-transform: none'>: ${
                  report.title
                }</span>`
              );
            }
            issueList.appendChild(li);
          }
        }
        tit.querySelector("span").innerHTML = text;
        if (ghIssue && report.title && githubAPI) {
          if (ghIssue.state === "closed") div.classList.add("closed");
          const labelsGroup = Array.from(ghIssue.labels || [])
            .map(label => {
              const issuesURL = new URL("./issues/", conf.github.repoURL);
              issuesURL.searchParams.set(
                "q",
                `is:issue is:open label:"${label.name}"`
              );
              return {
                ...label,
                href: issuesURL.href,
              };
            })
            .map(createLabel)
            .reduce((frag, labelElem) => {
              frag.appendChild(labelElem);
              return frag;
            }, document.createDocumentFragment());
          tit.appendChild(
            hyperHTML`<span style='text-transform: none'>: ${
              report.title
            }</span>`.append(labelsGroup)
          );
          inno.removeAttribute("title");
        } else if (report.title) {
          tit.appendChild(
            hyperHTML`<span style='text-transform: none'>: ${
              report.title
            }</span>`
          );
          inno.removeAttribute("title");
        }
        tit.classList.add("marker");
        div.appendChild(tit);
        let body = inno;
        inno.replaceWith(div);
        body.classList.remove(report.type);
        body.removeAttribute("data-number");
        if (ghIssue && !body.innerHTML().trim()) {
          body = ghIssue.body_html;
        }
        div.appendChild(body);
        const level = getCount(tit);
        tit.setAttribute("aria-level", level);
      }
      pub(report.type, report);
    });
  const issueSummaryElement = document.getElementById("issue-summary");
  if (document.querySelectorAll(".issue").length) {
    if (issueSummaryElement)
      issueSummaryElement.innerHTML = issueSummary.innerHTML;
  } else if (issueSummaryElement) {
    pub("warn", "Using issue summary (#issue-summary) but no issues found.");
    issueSummaryElement.parentNode.removeChild(issueSummaryElement);
  }
}

async function fetchAndStoreGithubIssues(conf) {
  const { githubAPI, githubUser, githubToken } = conf;
  const specIssues = document.querySelectorAll(".issue[data-number]");
  if (specIssues.length > MAX_GITHUB_REQUESTS) {
    const msg =
      `Your spec contains ${specIssues.length} Github issues, ` +
      `but GitHub only allows ${MAX_GITHUB_REQUESTS} requests. Some issues might not show up.`;
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

function isLight(rgb) {
  const red = (rgb >> 16) & 0xff;
  const green = (rgb >> 8) & 0xff;
  const blue = (rgb >> 0) & 0xff;
  const illumination = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return illumination > 140;
}

function createLabel(label) {
  const { color, href, name } = label;
  const rgb = parseInt(color, 16);
  const textColorClass = isNaN(rgb) || isLight(rgb) ? "light" : "dark";
  const cssClasses = `respec-gh-label respec-label-${textColorClass}`;
  const style = `background-color: #${color}`;
  return hyperHTML`<a
    class="${cssClasses}"
    style="${style}"
    href="${href}">${name}</a>`;
}

function getCount(currentEl) {
  let el = currentEl;
  let count = 0;
  while (el !== null) {
    if (el.tagName === "SECTION") count++;
    el = el.parentElement;
  }
  return count + 2;
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
  return [issueNumber, issue];
}

export async function run(conf) {
  const query = ".issue, .note, .warning, .ednote";
  if (!document.querySelector(query)) {
    return; // nothing to do.
  }
  const issuesAndNotes = document.querySelectorAll(query);
  const ghIssues = conf.githubAPI
    ? await fetchAndStoreGithubIssues(conf)
    : new Map();
  const { head: headElem } = document;
  headElem.insertBefore(
    hyperHTML`<style>${[css]}</style>`,
    headElem.querySelector("link")
  );
  handleIssues(issuesAndNotes, ghIssues, conf);
}
