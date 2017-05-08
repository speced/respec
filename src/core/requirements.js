// Module core/requirements
// This module does two things:
//
// 1.  It finds and marks all requirements. These are elements with class "req".
//     When a requirement is found, it is reported using the "req" event. This
//     can be used by a containing shell to extract them.
//     Requirements are automatically numbered.
//
// 2.  It allows referencing requirements by their ID simply using an empty <a>
//     element with its href pointing to the requirement it should be referencing
//     and a class of "reqRef".
import { pub } from "core/pubsubhub";

export function run(conf, doc, cb) {
  $(".req").each(function(i) {
    i++;
    var $req = $(this);
    var title = "Req. " + i;
    $req.prepend("<a href='#" + $req.attr("id") + "'>" + title + "</a>: ");
  });

  $("a.reqRef").each(function() {
    var $ref = $(this), href = $ref.attr("href"), id, $req, txt;
    if (!href) return;
    id = href.substring(1);
    $req = $("#" + id);
    if ($req.length) {
      txt = $req.find("> a").text();
    } else {
      txt = "Req. not found '" + id + "'";
      pub("error", "Requirement not found in a.reqRef: " + id);
    }
    $ref.text(txt);
  });
  cb();
}
