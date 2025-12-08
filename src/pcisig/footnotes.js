/*global define */

/* jshint browser: true */

// Module pcisig/footnotes
//  Handles footnotes.

// CONFIGURATION:
import { pub } from "../core/pubsubhub.js";

export const name = "pcisig/footnotes";

export function run(conf, doc, cb) {

  let $footnotes = $("span.footnote", doc);
  if ($footnotes.length) {
    $footnotes.each(function (index) {
      $(this).prepend("<span class='footnote-online'> [Footnote: </span>")
        .append("<span class='footnote-online'>] </span>");
      let id = "footnote-" + (index + 1);
      let span = "<span class='footnote-contents' id='" + id + "'></span>";
      let input = "<input type='checkbox' name='" + id + "' value='#" + id + "'></input>";
      $(this).wrapInner(span)
        .prepend(input);
    });
  }
  cb();
}
