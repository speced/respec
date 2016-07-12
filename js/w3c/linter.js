"use strict";
define(["core/pubsubhub"], function(pubsubhub) {
  /**
   * Checks for privacy and security and considerations heading. If "privacy" or
   * "security", and "considerations", in any order, case-insensitive,
   * multi-line check.
   *
   * @param  {Document} doc The document to be checked.
   * @return {Boolean} Returns true if section is found.
   */
  function hasPriSecConsiderations(doc) {
    return Array
      .from(doc.querySelectorAll("h2, h3, h4, h5, h6"))
      .map(function(elem) {
        return elem.textContent;
      })
      .some(function(text) {
        var privOrSecRegex = /(privacy|security)/igm;
        var considerationsRegex = /(considerations)/igm;
        return privOrSecRegex.test(text) && considerationsRegex.test(text);
      });
  }

  return {
    run: function(conf, doc, cb) {
      if (!conf.lint) {
        return cb();
      }
      if (!hasPriSecConsiderations(doc)) {
        var warn = "This specification doesn't appear to have any 'Privacy' " +
          " or 'Security' considerations sections. Please consider adding one" +
          ", see https://w3ctag.github.io/security-questionnaire/";
        pubsubhub.pub("warning", warn);
      }
      cb();
    },
    // Convenience methods, for quickly testing rules.
    rules: {
      "hasPriSecConsiderations": hasPriSecConsiderations,
    },
  };
});
