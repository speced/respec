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
/*global $, define*/
"use strict";
define(
  ["text!core/css/issues-notes.css", "github"],
  function (css, github) {
    var issueNum = 0;
    var isIssue = doesClassListContain("issue");
    var isWarning = doesClassListContain("warning");
    var isEdNote = doesClassListContain("ednote");
    var isFeatureAtRisk = doesClassListContain("atrisk");

    attachStyle(css);

    function doesClassListContain(type){
      return function(element){
        element.classList.contains(type);
      };
    }

    function attachStyle(css){
      var style = document.createElement("style");
      style.text = css;
      document.appendChild(style);
    }

    function reportMaker(ghIssues){
      return function toReport (element) {
        var isInline = window.getComputedStyle(element).getPropertyValue("display") !== "block";
        var dataNum = (Number.isInteger(element.dataset.number)) ? element.dataset.number : null;
        var type = isIssue(element) ? "issue" : isWarning(element) ? "warning" : isEdNote(element) ? "ednote" : "note";
        var title = element.title;
        var number = (report.type === "issue" && !isInline && !hasDataNum) ? ++issueNum : dataNum;
        var isAtRisk = isFeatureAtRisk(element);
        var text;
        switch (type){
          case "issue":
            text =  (report.isAtRisk) ? "Feature at Risk" : "issue";
            break;
          case "warning":
            text = "Warning";
            break;
          case "ednote":
            text = "Editor's Note";
            break;
          default:
            text = "Note";
        }
        var report = {
          get isDataNum: function(){
            return !!dataNum;
          }
          isInline: isInline,
          title: title,
          type: type,
          number: number,
          element: element,
          isAtRisk: isAtRisk,
          text: text,
        };
        return report;
      };
    }

    function makeGhIssueTrimmer(){
      return function(report){
        if(!ghIssues.has(report.number)){
          var warn = "Issue " + dataNum + " not found. Was it closed on GitHub?";
          msg.pub("warn", warn);
          return;
        }
      };
    }

    function toIssueList(report){

    }

    function handleIssues(conf, doc, msg, ghIssues, issueBase) {
      var elements = document.querySelectorAll(".issue, .note, .warning, .ednote");
      if (!elements.length) {
        return;
      }
      var $issueSummary = $("<div><h2>Issue Summary</h2><ul></ul></div>");
      var $issueList = $issueSummary.find("ul");
      var toReport = reportMaker(ghIssues);
      Array
        .from(elements)
        .map(toReport)
        .filter(function(report){
          return !report.isInline;
        })
        .filter(isInGithub)
        // wrap
        .map(function(report){
          var $div = $("<div class='" + report.type + (report.isAtRisk ? " atrisk" : "") + "'></div>");
          var $tit = $("<div class='" + report.type + "-title'><span></span></div>");
          if (report.type === "issue") {
            if (hasDataNum) {
              // Check if we don't have this issue
              text += " " + dataNum;
              // Set issueBase to cause issue to be linked to the external issue tracker
              if (!report.isAtRisk && issueBase) {
                $tit.find("span").wrap($("<a href='" + issueBase + dataNum + "'/>"));
              } else if (report.isAtRisk && conf.atRiskBase) {
                $tit.find("span").wrap($("<a href='" + conf.atRiskBase + dataNum + "'/>"));
              }
              ghIssue = ghIssues.get(dataNum);
              if (ghIssue && !report.title) {
                report.title = ghIssue.title;
              }
            } else {
              text += " " + issueNum;
            }
            if (report.number && hasIssue(report.number)) {
              // Add entry to #issue-summary.
              var id = "issue-" + report.number;
              var $li = $("<li><a></a></li>");
              var $a = $li.find("a");
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
            element.removeAttr("title");
          }
          $tit.addClass("marker");
          $div.append($tit);
          $element.replaceWith($div);
          var body = $element.removeClass(report.type).removeAttr("data-number");
          if (ghIssue && !body.text().trim()) {
            body = ghIssue.body_html;
          }
          $div.append(body);
        });

      if(!document.getElementById("issue-summary")){
        return;
      }
      if (document.querySelector(".issue")) {
        $("#issue-summary").append($issueSummary.contents());
      } else {
        msg.pub("warn", "Found issue summary (#issue-summary) but no issues found in doc!");
        $("#issue-summary").remove();
      }
    }
    return {
      run: function (conf, doc, cb, msg) {
        function finish() {
          msg.pub("end", "core/issues-notes");
          cb();
        }
        msg.pub("start", "core/issues-notes");
        var ghIssues = new Map();
        var issueBase = conf.issueBase;
        if(!conf.githubAPI){
          handleIssues(conf, doc, msg, ghIssues, issueBase);
          return finish();
        }
        github
          .fetch(conf.githubAPI)
          .then(function (json) {
            issueBase = issueBase || json.html_url + "/issues/";
            return github.fetchIndex(json.issues_url, {
              // Get back HTML content instead of markdown
              // See: https://developer.github.com/v3/media/
              headers: {
                Accept: "application/vnd.github.v3.html+json"
              }
            });
          })
          .then(function (issues) {
            issues.reduce(function intoIssuesMap(issuesMap, issue) {
              return issuesMap.set(issue.number, issue);
            }, ghIssues);
            handleIssues(conf, doc, msg, ghIssues, issueBase);
          })
          .then(
            finish
          );
      }
    };
  }
);