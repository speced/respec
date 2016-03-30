// Module core/issues-notes
// Manages issues and notes, including marking them up, numbering, inserting the title,
// and injecting the style sheet.
// Issues are automatically numbered by default, but you can assign them specific numbers (or,
// despite the name, any arbitrary identifier) using the data-number attribute. Note that as
// soon as you use one data-number on any issue all the other issues stop being automatically
// numbered to avoid involuntary clashes.
// If the configuration has issueBase set to a non-empty string, and issues are
// manually numbered, a link to the issue is created using issueBase and the issue number
/*global define, console*/
"use strict";
define(
  ["text!core/css/issues-notes.css", "github"],
  function (css, github) {

    function reportMaker(ghIssues) {
      function doesClassListContain(className) {
        return function (element) {
          return element.classList.contains(className);
        };
      }

      var issueNum = 1;
      var isIssue = doesClassListContain("issue");
      var isWarning = doesClassListContain("warning");
      var isEdNote = doesClassListContain("ednote");
      var isFeatureAtRisk = doesClassListContain("atrisk");
      return function toReport(element) {
        var hasDataNum = false;
        var isGithubIssue = false;
        var type = isIssue(element) ? "issue" : isWarning(element) ? "warning" : isEdNote(element) ? "ednote" : "note";
        var isAtRisk = isFeatureAtRisk(element);
        var number = null;
        var title = element.title;
        var url = "";
        if (type === "issue") {
          hasDataNum = Number.isInteger(parseInt(element.dataset.number, 10));
          number = (hasDataNum) ? parseInt(element.dataset.number, 10) : issueNum++;
          isGithubIssue = ghIssues.has(number);
        }
        var label = "";
        switch (type) {
        case "issue":
          label = (isAtRisk) ? "Feature at Risk" : "Issue";
          break;
        case "warning":
          label = "Warning";
          break;
        case "ednote":
          label = "Editor's Note";
          break;
        default:
          label = "Note";
        }
        var report = {
          get isDataNum() {
            return hasDataNum;
          },
          get isGithubIssue() {
            return isGithubIssue;
          },
          get url() {
            if (isGithubIssue) {
              return ghIssues.get(number).html_url;
            }
            return url;
          },
          get body() {
            if (isGithubIssue) {
              return ghIssues.get(number).body_html;
            }
            return element.innerHTML;
          },
          get title() {
            if (isGithubIssue) {
              return ghIssues.get(number).title;
            }
            return title;
          },
          type: type,
          number: number,
          element: element,
          isAtRisk: isAtRisk,
          label: label,
        };
        return report;
      };
    }

    function byReportNumber(reportA, reportB) {
      return reportA.number - reportB.number;
    }

    function makeIssueElementChecker(ghIssues) {
      return function isValidIssue(element) {
        var number = parseInt(element.dataset.number, 10);
        if (Number.isInteger(number) && !ghIssues.has(number)) {
          return false;
        }
        return true;
      };
    }

    function issueListMaker(doc) {
      return function toIssueList(report) {
        var li = doc.createElement("li");
        var id = "issue-" + report.number;
        var html = "<a href=#" + id + ">Issue " + report.number + "</a>";
        html += (report.title) ? ": " + report.title : "";
        li.innerHTML = html;
        return li;
      };
    }

    function makeLabel(report) {
      var labelContainer = document.createElement("div");
      labelContainer.classList.add("marker", report.type + "-title");
      var labelText = report.label + " " + (report.number || "");
      if (report.url) {
        labelText = "<a href='" + report.url + "'>" + labelText + "</a>";
      }
      var label = "<span>" + labelText + "</span>";
      if (report.title) {
        var title = ": <span class='issue-title-text'>" + report.title + "</span>";
        label += title;
      }
      labelContainer.innerHTML = label;
      return labelContainer;
    }

    function makeDecorator(atRiskBase, issueBase) {
      return function decorateHTML(report) {
        var element = report.element;
        var wrapperDiv = (element.localName === "div") ? report.element : document.createElement("div");
        wrapperDiv.classList.add(report.type);
        if (report.isAtRisk) {
          wrapperDiv.classList.add("atrisk");
        }
        var label = makeLabel(report);
        wrapperDiv.removeAttribute("title");
        wrapperDiv.innerHTML = report.body;
        wrapperDiv.insertBefore(label, wrapperDiv.firstChild);
        if (wrapperDiv !== element) {
          element.parentElement.replaceChild(wrapperDiv, report.element);
        }
      }
    }

    function handleIssues(doc, atRiskBase, ghIssues, issueBase, elements) {
      var toReport = reportMaker(ghIssues);
      var reports = Array
        .from(elements)
        .map(toReport);
      // decorate issues, notes, etc.
      var decorateHTML = makeDecorator(atRiskBase, issueBase);
      reports.forEach(decorateHTML);
      // check if we need to make summary
      var summaryContainer = doc.getElementById("issue-summary");
      if (!summaryContainer) {
        return;
      }
      summaryContainer.innerHTML = "<h2>Issue Summary</h2>";
      var toIssueList = issueListMaker(doc);
      // Create summary;
      var summary = reports
        .filter(function (report) {
          return report.type === "issue";
        })
        .sort(byReportNumber)
        .map(toIssueList)
        .reduce(function intoElement(element, next) {
          element.appendChild(next);
          return element;
        }, document.createElement("ul"));

      summaryContainer.appendChild(summary);


      //     // Set issueBase to cause issue to be linked to the external issue tracker
      //     if (!report.isAtRisk && issueBase) {
      //       $tit.find("span").wrap($("<a href='" + issueBase + dataNum + "'/>"));
      //     } else if (report.isAtRisk && conf.atRiskBase) {
      //       $tit.find("span").wrap($("<a href='" + conf.atRiskBase + dataNum + "'/>"));
      //     }
    }
    return {
      run: function (conf, doc, cb, msg) {
        // Helper functions
        function hasGitHubIssues(doc) {
          return !!doc.querySelector(".issue[data-number]");
        }

        function attachStyle(doc, css) {
          var style = doc.createElement("style");
          style.id = "issues-notes";
          style.innerHTML = css;
          doc.head.appendChild(style);
        }

        function isBlocklevel(element) {
          var defaultView = element.ownerDocument.defaultView;
          return "block" === defaultView.getComputedStyle(element).getPropertyValue("display");
        }

        function finish() {
          msg.pub("end", "core/issues-notes");
          cb();
        }

        msg.pub("start", "core/issues-notes");
        var elements = Array
          .from(doc.querySelectorAll(".issue, .note, .warning, .ednote"))
          .filter(isBlocklevel);
        // Nothing to do, so finish.
        if (!elements.length) {
          return finish();
        }
        // TODO: merge with main ReSpec style
        // https://github.com/w3c/respec/issues/672
        attachStyle(doc, css);
        var atRiskBase = conf.atRiskBase || "";
        var issueBase = conf.issueBase || "";
        var ghIssues = new Map();
        // Handle regular issues and notes
        if (!conf.githubAPI || !hasGitHubIssues(doc)) {
          handleIssues(doc, atRiskBase, ghIssues, issueBase, elements);
          return finish();
        }
        // We only ping the network when we have GH issues + GH URL
        fetch(conf.githubAPI)
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            issueBase = issueBase || json.html_url + "/issues/";
            return github.fetchOpenIssues(json.issues_url);
          })
          .then(function (issues) {
            function toUserWarning(element) {
              var warn = "Couldn't match issue " + element.dataset.number;
              warn += " to a GitHub issue. Maybe it closed on GitHub?";
              return warn;
            }
            // Store the issues in a Map
            issues
              .reduce(function intoIssuesMap(issuesMap, issue) {
                return issuesMap.set(issue.number, issue);
              }, ghIssues);
            var isValidIssue = makeIssueElementChecker(ghIssues);
            // Warn about issues that are not in GitHub
            elements
              .filter(function (element) {
                return !isValidIssue(element);
              })
              .map(toUserWarning)
              .forEach(function (warning) {
                msg.pub("warn", warning);
              });
            // Proceed only with valid elements
            var validElements = elements
              .filter(isValidIssue);
            handleIssues(doc, atRiskBase, ghIssues, issueBase, validElements);
          })
          .then(
            finish
          )
          .catch(function (error) {
            console.error(error);
          });
      }
    };
  }
);