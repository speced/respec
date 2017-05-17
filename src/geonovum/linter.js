/*globals console*/
import { pub } from "core/pubsubhub";
/**
 * Checks for privacy and security and considerations heading. If "privacy" or
 * "security", and "considerations", in any order, case-insensitive,
 * multi-line check.
 *
 * @param  {Document} doc The document to be checked.
 * @return {Boolean} Returns true if section is found.
 */
function findHTTPProps(conf, base) {
  return Object.getOwnPropertyNames(conf)
    .filter(function(key) {
      return key.endsWith("URI") || key === "prevED";
    })
    .filter(function(key) {
      return new URL(conf[key], base).href.startsWith("http://");
    });
}

function findHeadinglessSections(doc) {
  return Array.from(doc.querySelectorAll("section:not(#toc)")).filter(function(
    elem
  ) {
    return (
      elem.querySelector(
        ":scope>h2, :scope>h3, :scope>h4, :scope>h5, :scope>h6"
      ) === null
    );
  });
}

export function run(conf, doc, cb) {
  if (conf.lint || conf.status === "unofficial") {
    return cb();
  }
  var warnings = [];
  var warn = "";

  // Warn about HTTP URLs used in respecConfig
  if (doc.location.href.startsWith("http")) {
    var httpURLs = findHTTPProps(conf, doc.location.href);
    if (httpURLs.length) {
      warn =
        "There are insecure URLs in your respecConfig! Please change " +
        "the following properties to use 'https://': " +
        httpURLs.join(", ") +
        ".";
      warnings.push(warn);
    }
  }

  // Warn about sections with no headings
  const sections = findHeadinglessSections(doc).map(function(section) {
    console.warn(
      "Section with no heading (maybe use a div or add a heading?):",
      section
    );
    return section;
  });
  if (sections.length) {
    warn =
      "Found " +
      sections.length +
      " section elements without a heading element. Consider " +
      "adding a heading element. See browser developer console for offending element(s).";
    warnings.push(warn);
  }

  // Publish warnings
  warnings.map(function(warn) {
    pub("warn", warn);
  });

  cb();
}
// Convenience methods, for quickly testing rules.
export const rules = {
  findHTTPProps: findHTTPProps,
};
