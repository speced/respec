define(["exports", "core/pubsubhub"], function (exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.run = run;
  function run(conf, doc, cb) {
    var $abs = $("#abstract");
    if ($abs.length) {
      if ($abs.find("p").length === 0) $abs.contents().wrapAll($("<p></p>"));
      $abs.prepend("<h2>" + conf.l10n.abstract + "</h2>");
      $abs.addClass("introductory");
      if (conf.doRDFa) {
        var rel = "dc:abstract",
            ref = $abs.attr("property");
        if (ref) rel = ref + " " + rel;
        $abs.attr({ property: rel });
      }
    } else (0, _pubsubhub.pub)("error", "Document must have one element with ID 'abstract'");
    cb();
  } // Module geonovum/abstract
  // Handle the abstract section properly.
});
//# sourceMappingURL=abstract.js.map