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

  function findHTTPProps(conf, base) {
    return Object.getOwnPropertyNames(conf)
      .filter(function(key) {
        return key.endsWith("URI") || key === "prevED";
      })
      .filter(function(key) {
        return new URL(conf[key], base).href.startsWith("http://");
      });
  }

  return {
    run: function(conf, doc, cb) {
      if (!conf.lint || conf.status === "unofficial") {
        return cb();
      }
      var warnings = [];
      var warn = "";

      // Warn if no privacy and/or security considerations section
      if (!hasPriSecConsiderations(doc)) {
        warn = "This specification doesn't appear to have any 'Privacy' " +
          " or 'Security' considerations sections. Please consider adding one" +
          ", see https://w3ctag.github.io/security-questionnaire/";
        warnings.push(warn);
      }

      // Warn about HTTP URLs used in respecConfig
      var httpURLs = findHTTPProps(conf, doc.location.href);
      if (httpURLs.length) {
        warn = "There are insecure URLs in your respecConfig! Please change " +
          "the following properties to use 'https://': " + httpURLs.join(", ") + ".";
        warnings.push(warn);
      }

      // Publish warnings
      warnings.map(function(warn) {
        pubsubhub.pub("warn", warn);
      });

      cb();
    },
    // Convenience methods, for quickly testing rules.
    rules: {
      "findHTTPProps": findHTTPProps,
      "hasPriSecConsiderations": hasPriSecConsiderations,
    },
  };
});
