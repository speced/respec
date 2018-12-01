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
import css from "../deps/text!core/css/issues-notes.css";
import { fetchAndCache } from "./utils";
import hyperHTML from "../deps/hyperhtml";
import { pub } from "./pubsubhub";
export const name = "core/issues-notes";

const MAX_GITHUB_REQUESTS = 60;

function handleIssues(ins, ghIssues, conf) {
  const $ins = $(ins);
  const { issueBase, githubAPI } = conf;
  const hasDataNum = !!document.querySelector(".issue[data-number]");
  let issueNum = 0;
  const $issueSummary = $(
    "<div><h2>" + conf.l10n.issue_summary + "</h2><ul></ul></div>"
  );
  const $issueList = $issueSummary.find("ul");
  $ins
    .filter((i, issue) => issue.parentNode)
    .each((i, inno) => {
      const $inno = $(inno);
      const isIssue = $inno.hasClass("issue");
      const isWarning = $inno.hasClass("warning");
      const isEdNote = $inno.hasClass("ednote");
      const isFeatureAtRisk = $inno.hasClass("atrisk");
      const isInline = $inno[0].localName === "span";
      const dataNum = $inno.attr("data-number");
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
        const $div = $(
          "<div class='" +
            report.type +
            (isFeatureAtRisk ? " atrisk" : "") +
            "'></div>"
        );
        const $tit = $(
          "<div role='heading' class='" +
            report.type +
            "-title'><span></span></div>"
        );
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
          $div[0].id = inno.id;
          inno.removeAttribute("id");
        } else {
          $div.makeID(
            "issue-container",
            report.number ? `number-${report.number}` : ""
          );
        }
        $tit.makeID("h", report.type);
        report.title = $inno.attr("title");
        if (isIssue) {
          if (hasDataNum) {
            if (dataNum) {
              text += " " + dataNum;
              // Set issueBase to cause issue to be linked to the external issue tracker
              if (!isFeatureAtRisk && issueBase) {
                $tit
                  .find("span")
                  .wrap($("<a href='" + issueBase + dataNum + "'/>"));
              } else if (isFeatureAtRisk && conf.atRiskBase) {
                $tit
                  .find("span")
                  .wrap($("<a href='" + conf.atRiskBase + dataNum + "'/>"));
              }
              $tit.find("span")[0].classList.add("issue-number");
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
            const $li = $("<li><a></a></li>");
            const $a = $li.find("a");
            $a.attr("href", "#" + $div[0].id).text(
              conf.l10n.issue + " " + report.number
            );
            if (report.title) {
              $li.append(
                $(
                  "<span style='text-transform: none'>: " +
                    report.title +
                    "</span>"
                )
              );
            }
            $issueList.append($li);
          }
        }
        $tit.find("span").text(text);
        if (ghIssue && report.title && githubAPI) {
          if (ghIssue.state === "closed") $div[0].classList.add("closed");
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
          $tit.append(
            $(
              "<span style='text-transform: none'>: " + report.title + "</span>"
            ).append(labelsGroup)
          );
          $inno.removeAttr("title");
        } else if (report.title) {
          $tit.append(
            $(
              "<span style='text-transform: none'>: " + report.title + "</span>"
            )
          );
          $inno.removeAttr("title");
        }
        $tit.addClass("marker");
        $div.append($tit);
        $inno.replaceWith($div);
        let body = $inno.removeClass(report.type).removeAttr("data-number");
        if (ghIssue && !body.text().trim()) {
          body = ghIssue.body_html;
        }
        $div.append(body);
        const level = $tit.parents("section").length + 2;
        $tit.attr("aria-level", level);
      }
      pub(report.type, report);
    });
  if ($(".issue").length) {
    if ($("#issue-summary"))
      $("#issue-summary").append($issueSummary.contents());
  } else if ($("#issue-summary").length) {
    pub("warn", "Using issue summary (#issue-summary) but no issues found.");
    $("#issue-summary").remove();
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
