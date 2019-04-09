// @ts-check
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
import { addId, joinAnd, parents } from "./utils.js";
import { lang as defaultLang } from "../core/l10n.js";
import { fetchAndStoreGithubIssues } from "./github-api.js";
import hyperHTML from "hyperhtml";
import { pub } from "./pubsubhub.js";

/**
 * @typedef {import("./github-api").GitHubIssue} GitHubIssue
 * @typedef {import("./github-api").GitHubLabel} GitHubLabel
 */

export const name = "core/issues-notes";

const localizationStrings = {
  en: {
    issue_summary: "Issue Summary",
    no_issues_in_spec: "There are no issues listed in this specification.",
  },
  nl: {
    issue_summary: "Lijst met issues",
    no_issues_in_spec: "Er zijn geen problemen vermeld in deze specificatie.",
  },
  es: {
    issue_summary: "Resumen de la cuestión",
    no_issues_in_spec: "No hay problemas enumerados en esta especificación.",
  },
};

const lang = defaultLang in localizationStrings ? defaultLang : "en";

const l10n = localizationStrings[lang];

/**
 * @typedef {{ type: string, inline: boolean, number: number, title: string }} Report
 *
 * @param {NodeListOf<HTMLElement>} ins
 * @param {Map<number, GitHubIssue>} ghIssues
 * @param {*} conf
 */
function handleIssues(ins, ghIssues, conf) {
  const hasDataNum = !!document.querySelector(".issue[data-number]");
  let issueNum = 0;
  const issueList = document.createElement("ul");
  ins.forEach(inno => {
    const { type, displayType, isFeatureAtRisk } = getIssueType(inno, conf);
    const isIssue = type === "issue";
    const isInline = inno.localName === "span";
    const { number: dataNum } = inno.dataset;
    /** @type {Partial<Report>} */
    const report = {
      type,
      inline: isInline,
      title: inno.title,
    };
    if (isIssue && !isInline && !hasDataNum) {
      issueNum++;
      report.number = issueNum;
    } else if (dataNum) {
      report.number = Number(dataNum);
    }
    // wrap
    if (!isInline) {
      const cssClass = isFeatureAtRisk ? `${type} atrisk` : type;
      const ariaRole = type === "note" ? "note" : null;
      const div = hyperHTML`<div class="${cssClass}" role="${ariaRole}"></div>`;
      const title = document.createElement("span");
      const titleParent = hyperHTML`
        <div role='heading' class='${`${type}-title marker`}'>${title}</div>`;
      addId(titleParent, "h", type);
      let text = displayType;
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
      /** @type {GitHubIssue} */
      let ghIssue;
      if (isIssue) {
        if (!hasDataNum) {
          text += ` ${issueNum}`;
        } else if (dataNum) {
          text += ` ${dataNum}`;
          const link = linkToIssueTracker(Number(dataNum), conf, {
            isFeatureAtRisk,
          });
          if (link) {
            title.before(link);
            link.append(title);
          }
          title.classList.add("issue-number");
          ghIssue = ghIssues.get(Number(dataNum));
          if (ghIssue && !report.title) {
            report.title = ghIssue.title;
          }
        }
        if (report.number !== undefined) {
          // Add entry to #issue-summary.
          issueList.append(
            createIssueSummaryEntry(conf.l10n.issue, report, div.id)
          );
        }
      }
      title.textContent = text;
      if (report.title) {
        inno.removeAttribute("title");
        const { repoURL = "" } = conf.github || {};
        const labels = ghIssue ? ghIssue.labels : [];
        if (ghIssue && ghIssue.state === "closed") {
          div.classList.add("closed");
        }
        titleParent.append(createLabelsGroup(labels, report.title, repoURL));
      }
      /** @type {HTMLElement | DocumentFragment} */
      let body = inno;
      inno.replaceWith(div);
      body.classList.remove(type);
      body.removeAttribute("data-number");
      if (ghIssue && !body.innerHTML.trim()) {
        body = document
          .createRange()
          .createContextualFragment(ghIssue.body_html);
      }
      div.append(titleParent, body);
      const level = parents(titleParent, "section").length + 2;
      titleParent.setAttribute("aria-level", level);
    }
    pub(report.type, report);
  });
  makeIssueSectionSummary(issueList);
}

/**
 * @typedef {{ type: string, displayType: string, isFeatureAtRisk: boolean }} IssueType
 *
 * @param {HTMLElement} inno
 * @return {IssueType}
 */
function getIssueType(inno, conf) {
  const isIssue = inno.classList.contains("issue");
  const isWarning = inno.classList.contains("warning");
  const isEdNote = inno.classList.contains("ednote");
  const isFeatureAtRisk = inno.classList.contains("atrisk");
  const type = isIssue
    ? "issue"
    : isWarning
    ? "warning"
    : isEdNote
    ? "ednote"
    : "note";
  const displayType = isIssue
    ? isFeatureAtRisk
      ? conf.l10n.feature_at_risk
      : conf.l10n.issue
    : isWarning
    ? conf.l10n.warning
    : isEdNote
    ? conf.l10n.editors_note
    : conf.l10n.note;
  return { type, displayType, isFeatureAtRisk };
}

/**
 * @param {string} dataNum
 * @param {*} conf
 */
function linkToIssueTracker(dataNum, conf, { isFeatureAtRisk = false } = {}) {
  // Set issueBase to cause issue to be linked to the external issue tracker
  if (!isFeatureAtRisk && conf.issueBase) {
    return hyperHTML`<a href='${conf.issueBase + dataNum}'/>`;
  } else if (isFeatureAtRisk && conf.atRiskBase) {
    return hyperHTML`<a href='${conf.atRiskBase + dataNum}'/>`;
  }
}

/**
 * @param {string} l10nIssue
 * @param {Partial<Report>} report
 */
function createIssueSummaryEntry(l10nIssue, report, id) {
  const issueNumberText = `${l10nIssue} ${report.number}`;
  const title = report.title
    ? hyperHTML`<span style="text-transform: none">: ${report.title}</span>`
    : "";
  return hyperHTML`
    <li><a href="${`#${id}`}">${issueNumberText}</a>${title}</li>
  `;
}

/**
 *
 * @param {HTMLUListElement} issueList
 */
function makeIssueSectionSummary(issueList) {
  const issueSummaryElement = document.getElementById("issue-summary");
  if (!issueSummaryElement) return;
  const heading = issueSummaryElement.querySelector("h2, h3, h4, h5, h6");

  issueList.hasChildNodes()
    ? issueSummaryElement.append(issueList)
    : issueSummaryElement.append(hyperHTML`<p>${l10n.no_issues_in_spec}</p>`);
  if (
    !heading ||
    (heading && heading !== issueSummaryElement.firstElementChild)
  ) {
    issueSummaryElement.insertAdjacentHTML(
      "afterbegin",
      `<h2>${l10n.issue_summary}</h2>`
    );
  }
}

function isLight(rgb) {
  const red = (rgb >> 16) & 0xff;
  const green = (rgb >> 8) & 0xff;
  const blue = (rgb >> 0) & 0xff;
  const illumination = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return illumination > 140;
}

/**
 * @param {GitHubLabel[]} labels
 * @param {string} title
 * @param {string} repoURL
 */
function createLabelsGroup(labels, title, repoURL) {
  const labelsGroup = labels.map(label => createLabel(label, repoURL));
  const labelNames = labels.map(label => label.name);
  const joinedNames = joinAnd(labelNames);
  if (labelsGroup.length) {
    labelsGroup.unshift(document.createTextNode(" "));
  }
  if (labelNames.length) {
    const ariaLabel = `This issue is labelled as ${joinedNames}.`;
    return hyperHTML`<span
      class="issue-label"
      aria-label="${ariaLabel}">: ${title}${labelsGroup}</span>`;
  }
  return hyperHTML`<span class="issue-label">: ${title}${labelsGroup}</span>`;
}

/**
 * @param {GitHubLabel} label
 * @param {string} repoURL
 */
function createLabel(label, repoURL) {
  const { color, name } = label;
  const issuesURL = new URL("./issues/", repoURL);
  issuesURL.searchParams.set("q", `is:issue is:open label:"${label.name}"`);
  const rgb = parseInt(color, 16);
  const textColorClass = isNaN(rgb) || isLight(rgb) ? "light" : "dark";
  const cssClasses = `respec-gh-label respec-label-${textColorClass}`;
  const style = `background-color: #${color}`;
  return hyperHTML`<a
    class="${cssClasses}"
    style="${style}"
    href="${issuesURL.href}">${name}</a>`;
}

async function loadStyle() {
  try {
    return (await import("text!../../assets/issues-notes.css")).default;
  } catch {
    const res = await fetch(
      new URL("../../assets/issues-notes.css", import.meta.url)
    );
    return await res.text();
  }
}

export async function run(conf) {
  const query = ".issue, .note, .warning, .ednote";
  /** @type {NodeListOf<HTMLElement>} */
  const issuesAndNotes = document.querySelectorAll(query);
  if (!issuesAndNotes.length) {
    return; // nothing to do.
  }
  const css = await loadStyle();
  /** @type {Map<number, GitHubIssue>} */
  const ghIssues = conf.githubAPI
    ? await fetchAndStoreGithubIssues(conf)
    : new Map();
  const { head: headElem } = document;
  headElem.insertBefore(
    hyperHTML`<style>${[css]}</style>`,
    headElem.querySelector("link")
  );
  handleIssues(issuesAndNotes, ghIssues, conf);
  const ednotes = document.querySelectorAll(".ednote");
  ednotes.forEach(ednote => {
    ednote.classList.remove("ednote");
    ednote.classList.add("note");
  });
}
