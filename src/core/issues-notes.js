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
import { addId, fetchAndCache, parents } from "./utils";
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
  ins.forEach(inno => {
    const isIssue = inno.classList.contains("issue");
    const isWarning = inno.classList.contains("warning");
    const isEdNote = inno.classList.contains("ednote");
    const isFeatureAtRisk = inno.classList.contains("atrisk");
    const isInline = inno.localName === "span";
    const { number: dataNum } = inno.dataset;
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
              const span = tit.querySelector("span");
              const a = hyperHTML`<a href='${issueBase + dataNum}'/>`;
              span.before(a);
              a.append(span);
            } else if (isFeatureAtRisk && conf.atRiskBase) {
              const span = tit.querySelector("span");
              const a = hyperHTML`<a href='${conf.atRiskBase + dataNum}'/>`;
              span.before(a);
              a.append(span);
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
          const issueNumberText = `${conf.l10n.issue} ${report.number}`;
          const title = report.title
            ? hyperHTML`
              <span style="text-transform: none">: ${report.title}</span>`
            : "";
          issueList.append(
            hyperHTML`
              <li><a href="${"#" + div.id}">${issueNumberText}</a>${title}</li>
            `
          );
        }
      }
      tit.querySelector("span").textContent = text;
      if (report.title) {
        inno.removeAttribute("title");
        let labels = [];
        const { repoURL } = conf.github || {};
        if (ghIssue && githubAPI) {
          if (ghIssue.state === "closed") div.classList.add("closed");
          labels = ghIssue.labels;
        }
        tit.append(createLabelsGroup(labels, report.title, repoURL));
      }
      tit.classList.add("marker");
      div.append(tit);
      let body = inno;
      inno.replaceWith(div);
      body.classList.remove(report.type);
      body.removeAttribute("data-number");
      if (ghIssue && !body.innerHTML.trim()) {
        body = hyperHTML`${ghIssue.body_html}`;
      }
      div.append(body);
      const level = parents(tit, "section").length + 2;
      tit.setAttribute("aria-level", level);
    }
    pub(report.type, report);
  });
  const issueSummaryElement = document.getElementById("issue-summary");
  if (issueSummaryElement) {
    if (document.querySelectorAll(".issue").length) {
      issueSummaryElement.append(...issueSummary.childNodes);
    } else {
      pub("warn", "Using issue summary (#issue-summary) but no issues found.");
      issueSummaryElement.remove();
    }
  }
}

function createLabelsGroup(labels, title, repoURL) {
  const labelsGroup = Array.from(labels || [])
    .map(label => {
      const issuesURL = new URL("./issues/", repoURL);
      issuesURL.searchParams.set("q", `is:issue is:open label:"${label.name}"`);
      return {
        ...label,
        href: issuesURL.href,
      };
    })
    .map(createLabel);
  return hyperHTML`<span style='text-transform: none'>: ${title}${labelsGroup}</span>`;
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
