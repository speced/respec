// Module geonovum/abstract
// Handle the abstract section properly.
import { pub } from "core/pubsubhub";

export function run(conf, doc, cb) {
  var $abs = $("#abstract");
  if ($abs.length) {
    if ($abs.find("p").length === 0) $abs.contents().wrapAll($("<p></p>"));
    $abs.prepend("<h2>" + conf.l10n.abstract + "</h2>");
    $abs.addClass("introductory");
    if (conf.doRDFa) {
      var rel = "dc:abstract", ref = $abs.attr("property");
      if (ref) rel = ref + " " + rel;
      $abs.attr({ property: rel });
    }
  } else pub("error", "Document must have one element with ID 'abstract'");
  cb();
}
