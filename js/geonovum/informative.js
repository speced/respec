define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.run = run;
  // Module geonovum/informative
  // Mark specific sections as informative, based on CSS

  function run(conf, doc, cb) {
    $("section.informative").find("> h2:first, > h3:first, > h4:first, > h5:first, > h6:first").after("<p><em>Dit onderdeel is niet normatief.</em></p>");
    cb();
  }
});
//# sourceMappingURL=informative.js.map