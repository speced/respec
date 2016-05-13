// Module core/highlight
// Does syntax highlighting to all pre and code that have a class of "highlight"
// An improvement would be to use web workers to do the highlighting.
"use strict";
define(
  [
    "core/utils",
    "highlight",
    "text!highlightStyles/github.css",
  ],
  function(utils, hljs, ghCss) {
    // Opportunistically insert the style into the head to reduce FOUC.
    var codeStyle = document.createElement("style");
    codeStyle.textContent = ghCss;
    var swapStyleOwner = utils.makeOwnerSwapper(codeStyle);
    swapStyleOwner(document, document.head);
    return {
      run: function(conf, doc, cb, msg) {
        // Nothing to do
        if (conf.noHighlightCSS) {
          return cb();
        }

        if (codeStyle.ownerDocument !== doc) {
          swapStyleOwner(doc, doc.head);
        }

        if (doc.querySelector("highlight")) {
          msg.pub("warn", "pre elements don't need a 'highlight' class anymore.");
        }

        Array
          .from(
            doc.querySelectorAll("pre")
          )
          .forEach(function(element) {
            hljs.highlightBlock(element);
          });
        cb();
      }
    };
  }
);
