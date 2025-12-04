// Module w3c/aria
// Adds wai-aria landmarks and roles to entire document.
// Introduced by Shane McCarron (shane@aptest.com) from the W3C PFWG
export const name = "w3c/aria";
export function run(conf, doc, cb) {
  // ensure head section is labeled
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
  var impnoteCount = 1;
  Array.from(
    doc.querySelectorAll(".impnote-title, .note-title, .ednote-title, .issue-title")
  ).forEach(function(element) {
    var $element = $(element);
    var isIssue = element.classList.contains("issue-title");
    var isEdNote = element.classList.contains("ednote-title");
    var isImpnote = element.classList.contains("impnote-title");
    var level = $element.parents("section").length + 2;
    element.setAttribute("aria-level", level);
    element.setAttribute("role", "heading");
    if (isIssue) {
      $element.makeID("h", "issue" + issueCount++);
    } else if (isEdNote) {
      $element.makeID("h", "ednote" + ednoteCount++);
    } else if (isImpnote) {
      $element.makeID("h", "impnote" + impnoteCount++);
    } else {
      $element.makeID("h", "note" + noteCount++);
    }
  });
  cb();
}
