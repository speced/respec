// Module w3c/aria
// Adds wai-aria landmarks and roles to entire document.
// Introduced by Shane McCarron (shane@aptest.com) from the W3C PFWG
"use strict";
define([],
  function() {
    return {
      run: function(conf, doc, cb) {
        // ensure head section is labeled
        if (!doc.body.hasAttribute("role")) {
          doc.body.setAttribute("role", "document");
        }
        if (!doc.body.hasAttribute("id")) {
          doc.body.setAttribute("id", "respecDocument");
        }
        var head = document.querySelector("div.head");
        if (head) {
          head.setAttribute("role", "contentinfo");
          head.setAttribute("id", "respecHeader");
        }
        var toc = doc.querySelector("#toc ol:first-of-type");
        if (toc) {
          // ensure toc is labeled
          toc.setAttribute("role", "directory");
        }
        // mark issues and notes with heading
        var noteCount = 1;
        var issueCount = 1;
        var ednoteCount = 1;
        Array
          .from(doc.querySelectorAll(".note-title, .ednote-title, .issue-title"))
          .forEach(function(element) {
            var $element = $(element);
            var isIssue = element.classList.contains("issue-title");
            var isEdNote = element.classList.contains("ednote-title");
            var level = $element.parents("section").length + 2;
            element.setAttribute("aria-level", level);
            element.setAttribute("role", "heading");
            if (isIssue) {
              $element.makeID("h", "issue" + issueCount++);
            } else if (isEdNote) {
              $element.makeID("h", "ednote" + ednoteCount++);
            } else {
              $element.makeID("h", "note" + noteCount++);
            }
          });
        cb();
      }
    };
  }
);
