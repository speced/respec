// Module core/best-practices
// Handles the marking up of best practices, and can generate a summary of all of them.
// The summary is generated if there is a section in the document with ID bp-summary.
// Best practices are marked up with span.practicelab.
import css from "deps/text!core/css/bp.css";
import { pub } from "core/pubsubhub";

export const name = "core/best-practices";

export function run(conf, doc, cb) {
  var num = 0;
  var $bps = $("span.practicelab", doc);
  var $content = $("<div><h2>Best Practices Summary</h2><ul></ul></div>");
  var $ul = $content.find("ul");
  $bps.each(function() {
    var $bp = $(this);
    var id = $bp.makeID("bp");
    var $li = $("<li><a></a></li>");
    var $a = $li.find("a");
    num++;
    $a.attr("href", "#" + id).text("Best Practice " + num);
    $li.append(doc.createTextNode(": " + $bp.text()));
    $ul.append($li);
    $bp.prepend(doc.createTextNode("Best Practice " + num + ": "));
  });
  if ($bps.length) {
    $(doc).find("head link").first().before($("<style/>").text(css));
    if ($("#bp-summary")) $("#bp-summary").append($content.contents());
  } else if ($("#bp-summary").length) {
    pub(
      "warn",
      "Using best practices summary (#bp-summary) but no best practices found."
    );
    $("#bp-summary").remove();
  }
  cb();
}
