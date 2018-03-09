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
import { pub } from "core/pubsubhub";
import css from "deps/text!core/css/issues-notes.css";
import { fetch as ghFetch, fetchIndex } from "core/github";
export const name = "core/issues-notes";
export function run(conf, doc, cb) {
  function handleIssues($ins, ghIssues, issueBase) {
    $(doc).find("head link").first().before($("<style/>").text(css));
    var hasDataNum = $(".issue[data-number]").length > 0,
      issueNum = 0,
      $issueSummary = $(
        "<div><h2>" + conf.l10n.issue_summary + "</h2><ul></ul></div>"
      ),
      $issueList = $issueSummary.find("ul");
    $ins.each(function (i, inno) {
      var $inno = $(inno),
        isIssue = $inno.hasClass("issue"),
        isWarning = $inno.hasClass("warning"),
        isEdNote = $inno.hasClass("ednote"),
        isFeatureAtRisk = $inno.hasClass("atrisk"),
        isInline = $inno[0].localName === "span",
        dataNum = $inno.attr("data-number"),
        report = {
          inline: isInline,
          content: $inno.html(),
        };
      report.type = isIssue
        ? "issue"
        : isWarning ? "warning" : isEdNote ? "ednote" : "note";
      if (isIssue && !isInline && !hasDataNum) {
        issueNum++;
        report.number = issueNum;
      } else if (dataNum) {
        report.number = dataNum;
      }
      // wrap
      if (!isInline) {
        var $div = $(
          "<div class='" +
          report.type +
          (isFeatureAtRisk ? " atrisk" : "") +
          "'></div>"
        ),
          $tit = $(
            "<div role='heading' class='" + report.type + "-title'><span></span></div>"
          ),
          text = isIssue
            ? isFeatureAtRisk ? "Feature at Risk" : conf.l10n.issue
            : isWarning
              ? conf.l10n.warning
              : isEdNote ? conf.l10n.editors_note : conf.l10n.note,
          ghIssue;
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
              ghIssue = ghIssues[dataNum];
              if (ghIssue && !report.title) {
                report.title = ghIssue.title;
              }
            }
          } else {
            text += " " + issueNum;
          }
          if (report.number !== undefined) {
            // Add entry to #issue-summary.
            var id = "issue-" + report.number,
              $li = $("<li><a></a></li>"),
              $a = $li.find("a");
            $div.attr("id", id);
            $a
              .attr("href", "#" + id)
              .text(conf.l10n.issue + " " + report.number);
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
        if (report.title) {
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
        var body = $inno.removeClass(report.type).removeAttr("data-number");
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
  var $ins = $(".issue, .note, .warning, .ednote"),
    ghIssues = {},
    issueBase = conf.issueBase;
  if ($ins.length) {
    if (conf.githubAPI) {
      let issuesUrl;
      const getIssues = (json) => {
        issuesUrl = issueBase || json.html_url + "/issues/";
        return fetchIndex(json.issues_url, {
          // Get back HTML content instead of markdown
          // See: https://developer.github.com/v3/media/
          Accept: "application/vnd.github.v3.html+json",    
        });
      };
      const asyncFetch = async () => {
        const json = await ghFetch(conf.githubAPI);
        const issues = await getIssues(json);
        issues.reduce((collector, issue) => {
          collector[issue.number] = issue;
          return collector;
        }, ghIssues);
      };
      asyncFetch()
        .catch(err => pub("error", err.message))
        .finally(() => {
          handleIssues($ins, ghIssues, issuesUrl);
          cb();
        });
    } else {
      handleIssues($ins, ghIssues, issueBase);
      cb();
    }
  } else {
    cb();
  }
}
