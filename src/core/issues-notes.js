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
import {
  addId,
  getIntlData,
  parents,
  showError,
  showWarning,
} from "./utils.js";
import css from "../styles/issues-notes.css.js";
import { html } from "./import-maps.js";
export const name = "core/issues-notes";

const localizationStrings = {
  en: {
    editors_note: "Editor's note",
    feature_at_risk: "(Feature at Risk) Issue",
    issue: "Issue",
    issue_summary: "Issue Summary",
    no_issues_in_spec: "There are no issues listed in this specification.",
    note: "Note",
    warning: "Warning",
  },
  ja: {
    note: "注",
    editors_note: "編者注",
    feature_at_risk: "(変更の可能性のある機能) Issue",
    issue: "Issue",
    issue_summary: "Issue の要約",
    no_issues_in_spec: "この仕様には未解決の issues は含まれていません．",
    warning: "警告",
  },
  nl: {
    editors_note: "Redactionele noot",
    issue_summary: "Lijst met issues",
    no_issues_in_spec: "Er zijn geen problemen vermeld in deze specificatie.",
    note: "Noot",
    warning: "Waarschuwing",
  },
  es: {
    editors_note: "Nota de editor",
    issue: "Cuestión",
    issue_summary: "Resumen de la cuestión",
    note: "Nota",
    no_issues_in_spec: "No hay problemas enumerados en esta especificación.",
    warning: "Aviso",
  },
  de: {
    editors_note: "Redaktioneller Hinweis",
    issue: "Frage",
    issue_summary: "Offene Fragen",
    no_issues_in_spec: "Diese Spezifikation enthält keine offenen Fragen.",
    note: "Hinweis",
    warning: "Warnung",
  },
  zh: {
    editors_note: "编者注",
    feature_at_risk: "（有可能变动的特性）Issue",
    issue: "Issue",
    issue_summary: "Issue 总结",
    no_issues_in_spec: "本规范中未列出任何 issue。",
    note: "注",
    warning: "警告",
  },
};

const l10n = getIntlData(localizationStrings);

/**
 * @typedef {object} Report
 * @property {string} type
 * @property {boolean} inline
 * @property {number} number
 * @property {string} title

 * @typedef {object} GitHubLabel
 * @property {string} color
 * @property {string} name
 *
 * @typedef {object} GitHubIssue
 * @property {string} title
 * @property {string} state
 * @property {string} bodyHTML
 * @property {GitHubLabel[]} labels

 * @param {NodeListOf<HTMLElement>} ins
 * @param {Map<string, GitHubIssue>} ghIssues
 * @param {*} conf
 */
function handleIssues(ins, ghIssues, conf) {
  const getIssueNumber = createIssueNumberGetter();
  const issueList = document.createElement("ul");
  ins.forEach(inno => {
    const { type, displayType, isFeatureAtRisk } = getIssueType(inno);
    const isIssue = type === "issue";
    const isInline = inno.localName === "span";
    const { number: dataNum } = inno.dataset;
    const report = {
      type,
      inline: isInline,
      title: inno.title,
      number: getIssueNumber(inno),
    };
    // wrap
    if (!isInline) {
      const cssClass = isFeatureAtRisk ? `${type} atrisk` : type;
      const ariaRole = type === "note" ? "note" : null;
      const div = html`<div class="${cssClass}" role="${ariaRole}"></div>`;
      const title = document.createElement("span");
      const className = `${type}-title marker`;
      // prettier-ignore
      const titleParent = html`<div role="heading" class="${className}">${title}</div>`;
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
        if (report.number !== undefined) {
          text += ` ${report.number}`;
        }
        if (inno.dataset.hasOwnProperty("number")) {
          const link = linkToIssueTracker(dataNum, conf, { isFeatureAtRisk });
          if (link) {
            title.before(link);
            link.append(title);
          }
          title.classList.add("issue-number");
          ghIssue = ghIssues.get(dataNum);
          if (!ghIssue) {
            const msg = `Failed to fetch issue number ${dataNum}.`;
            showWarning(msg, name);
          }
          if (ghIssue && !report.title) {
            report.title = ghIssue.title;
          }
        }
        if (report.number !== undefined) {
          // Add entry to #issue-summary.
          issueList.append(createIssueSummaryEntry(l10n.issue, report, div.id));
        }
      }
      title.textContent = text;
      if (report.title) {
        inno.removeAttribute("title");
        const { repoURL = "" } = conf.github || {};
        const labels = ghIssue ? ghIssue.labels : [];
        if (ghIssue && ghIssue.state === "CLOSED") {
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
          .createContextualFragment(ghIssue.bodyHTML);
      }
      div.append(titleParent, body);
      const level = parents(titleParent, "section").length + 2;
      titleParent.setAttribute("aria-level", level);
    }
  });
  makeIssueSectionSummary(issueList);
}

function createIssueNumberGetter() {
  if (document.querySelector(".issue[data-number]")) {
    return element => {
      if (element.dataset.number) {
        return Number(element.dataset.number);
      }
    };
  }

  let issueNumber = 0;
  return element => {
    if (element.classList.contains("issue") && element.localName !== "span") {
      return ++issueNumber;
    }
  };
}

/**
 * @typedef {object} IssueType
 * @property {string} type
 * @property {string} displayType
 * @property {boolean} isFeatureAtRisk
 *
 * @param {HTMLElement} inno
 * @return {IssueType}
 */
function getIssueType(inno) {
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
      ? l10n.feature_at_risk
      : l10n.issue
    : isWarning
    ? l10n.warning
    : isEdNote
    ? l10n.editors_note
    : l10n.note;
  return { type, displayType, isFeatureAtRisk };
}

/**
 * @param {string} dataNum
 * @param {*} conf
 */
function linkToIssueTracker(dataNum, conf, { isFeatureAtRisk = false } = {}) {
  // Set issueBase to cause issue to be linked to the external issue tracker
  if (!isFeatureAtRisk && conf.issueBase) {
    return html`<a href="${conf.issueBase + dataNum}" />`;
  } else if (isFeatureAtRisk && conf.atRiskBase) {
    return html`<a href="${conf.atRiskBase + dataNum}" />`;
  }
}

/**
 * @param {string} l10nIssue
 * @param {Report} report
 */
function createIssueSummaryEntry(l10nIssue, report, id) {
  const issueNumberText = `${l10nIssue} ${report.number}`;
  const title = report.title
    ? html`<span style="text-transform: none">: ${report.title}</span>`
    : "";
  return html`<li><a href="${`#${id}`}">${issueNumberText}</a>${title}</li>`;
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
    : issueSummaryElement.append(html`<p>${l10n.no_issues_in_spec}</p>`);
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

/**
 * @param {GitHubLabel[]} labels
 * @param {string} title
 * @param {string} repoURL
 */
function createLabelsGroup(labels, title, repoURL) {
  const labelsGroup = labels.map(label => createLabel(label, repoURL));
  if (labelsGroup.length) {
    labelsGroup.unshift(document.createTextNode(" "));
  }
  return html`<span class="issue-label">: ${title}${labelsGroup}</span>`;
}

/** @param {string} bgColorHex background color as a hex value without '#' */
function textColorFromBgColor(bgColorHex) {
  return parseInt(bgColorHex, 16) > 0xffffff / 2 ? "#000" : "#fff";
}

/**
 * @param {GitHubLabel} label
 * @param {string} repoURL
 */
function createLabel(label, repoURL) {
  const { color: bgColor, name } = label;
  const issuesURL = new URL("./issues/", repoURL);
  issuesURL.searchParams.set("q", `is:issue is:open label:"${label.name}"`);
  const color = textColorFromBgColor(bgColor);
  const style = `background-color: #${bgColor}; color: ${color}`;
  const ariaLabel = `GitHub label: ${name}`;
  return html` <a
    class="respec-gh-label"
    style="${style}"
    href="${issuesURL.href}"
    aria-label="${ariaLabel}"
    >${name}</a
  >`;
}

/**
 * @returns {Promise<Map<string, GitHubIssue>>}
 */
async function fetchAndStoreGithubIssues(github) {
  if (!github || !github.apiBase) {
    return new Map();
  }

  /** @type {NodeListOf<HTMLElement>} */
  const specIssues = document.querySelectorAll(".issue[data-number]");
  const issueNumbers = [...specIssues]
    .map(elem => Number.parseInt(elem.dataset.number, 10))
    .filter(issueNumber => issueNumber);

  if (!issueNumbers.length) {
    return new Map();
  }

  const url = new URL("issues", `${github.apiBase}/${github.fullName}/`);
  url.searchParams.set("issues", issueNumbers.join(","));

  const response = await fetch(url.href);
  if (!response.ok) {
    const msg = `Error fetching issues from GitHub. (HTTP Status ${response.status}).`;
    showError(msg, name);
    return new Map();
  }

  /** @type {{ [issueNumber: string]: GitHubIssue }} */
  const issues = await response.json();
  return new Map(Object.entries(issues));
}

export async function run(conf) {
  const query = ".issue, .note, .warning, .ednote";
  /** @type {NodeListOf<HTMLElement>} */
  const issuesAndNotes = document.querySelectorAll(query);
  if (!issuesAndNotes.length) {
    return; // nothing to do.
  }
  const ghIssues = await fetchAndStoreGithubIssues(conf.github);
  const { head: headElem } = document;
  headElem.insertBefore(
    html`<style>
      ${css}
    </style>`,
    headElem.querySelector("link")
  );
  handleIssues(issuesAndNotes, ghIssues, conf);
  const ednotes = document.querySelectorAll(".ednote");
  ednotes.forEach(ednote => {
    ednote.classList.remove("ednote");
    ednote.classList.add("note");
  });
}
