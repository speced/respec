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
"use strict";
define(
  ["text!core/css/issues-notes.css", "github", "jquery"],
  function(css, github, $) {
    return {
      run: function(conf, doc, cb, msg) {
        function onEnd() {
          msg.pub("end", "core/issues-notes");
          cb();
        }

        function handleIssues($ins, ghIssues, issueBase) {
          $(doc).find("head link").first().before($("<style/>").text(css));
          var hasDataNum = $(".issue[data-number]").length > 0,
            issueNum = 0,
            $issueSummary = $("<div><h2>Issue Summary</h2><ul></ul></div>"),
            $issueList = $issueSummary.find("ul");
          $ins.each(function(i, inno) {
            var $inno = $(inno),
              isIssue = $inno.hasClass("issue"),
              isWarning = $inno.hasClass("warning"),
              isEdNote = $inno.hasClass("ednote"),
              isFeatureAtRisk = $inno.hasClass("atrisk"),
              isInline = $inno.css("display") != "block",
              dataNum = $inno.attr("data-number"),
              report = {
                inline: isInline,
                content: $inno.html()
              };
            report.type = isIssue ? "issue" : isWarning ? "warning" : isEdNote ? "ednote" : "note";
            if (isIssue && !isInline && !hasDataNum) {
              issueNum++;
              report.number = issueNum;
            } else if (dataNum) {
              report.number = dataNum;
            }
            // wrap
            if (!isInline) {
              var $div = $("<div class='" + report.type + (isFeatureAtRisk ? " atrisk" : "") + "'></div>"),
                $tit = $("<div class='" + report.type + "-title'><span></span></div>"),
                text = isIssue ? (isFeatureAtRisk ? "Feature at Risk" : "Issue") : isWarning ? "Warning" : isEdNote ? "Editor's Note" : conf.l10n.note,
                ghIssue;
              report.title = $inno.attr("title");
              if (isIssue) {
                if (hasDataNum) {
                  if (dataNum) {
                    text += " " + dataNum;
                    // Set issueBase to cause issue to be linked to the external issue tracker
                    if (!isFeatureAtRisk && issueBase) {
                      $tit.find("span").wrap($("<a href='" + issueBase + dataNum + "'/>"));
                    } else if (isFeatureAtRisk && conf.atRiskBase) {
                      $tit.find("span").wrap($("<a href='" + conf.atRiskBase + dataNum + "'/>"));
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
                  $a.attr("href", "#" + id).text("Issue " + report.number);
                  if (report.title) {
                    $li.append($("<span style='text-transform: none'>: " + report.title + "</span>"));
                  }
                  $issueList.append($li);
                }
              }
              $tit.find("span").text(text);
              if (report.title) {
                $tit.append($("<span style='text-transform: none'>: " + report.title + "</span>"));
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
            }
            msg.pub(report.type, report);
          });
          if ($(".issue").length) {
            if ($("#issue-summary")) $("#issue-summary").append($issueSummary.contents());
          } else if ($("#issue-summary").length) {
            msg.pub("warn", "Using issue summary (#issue-summary) but no issues found.");
            $("#issue-summary").remove();
          }
        }
        msg.pub("start", "core/issues-notes");
        var $ins = $(".issue, .note, .warning, .ednote"),
          ghIssues = {},
          issueBase = conf.issueBase;
        if ($ins.length) {
          if (conf.githubAPI) {
            github.fetch(conf.githubAPI).then(function(json) {
              issueBase = issueBase || json.html_url + "/issues/";
              return github.fetchIndex(json.issues_url, {
                // Get back HTML content instead of markdown
                // See: https://developer.github.com/v3/media/
                headers: {
                  Accept: "application/vnd.github.v3.html+json"
                }
              });
            }).then(function(issues) {
              issues.forEach(function(issue) {
                ghIssues[issue.number] = issue;
              });
              handleIssues($ins, ghIssues, issueBase);
              onEnd();
            });
          } else {
            handleIssues($ins, ghIssues, issueBase);
            onEnd();
          }
        } else {
          onEnd();
        }
      }
    };
  }
);
