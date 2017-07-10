/*globals console*/
import { pub } from "core/pubsubhub";
export const name = "w3c/linter";
/**
 * Checks for privacy and security and considerations heading. If "privacy" or
 * "security", and "considerations", in any order, case-insensitive,
 * multi-line check.
 *
 * @param  {Document} doc The document to be checked.
 * @return {Boolean} Returns true if section is found.
 */
function hasPriSecConsiderations(doc) {
  const privOrSecRegex = /(privacy|security)/im;
  const considerationsRegex = /(considerations)/im;
  return Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6"))
    .map(function(elem) {
      return elem.textContent;
    })
    .some(function(text) {
      const saysPrivOrSec = privOrSecRegex.test(text);
      const sayConsiderations = considerationsRegex.test(text);
      return (saysPrivOrSec && sayConsiderations) || saysPrivOrSec;
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

function findHeadinglessSections(doc) {
  return Array.from(doc.querySelectorAll("section:not(#toc)")).filter(elem => {
    const heading = elem.querySelector(
      "h2:first-child, h3:first-child, h4:first-child, h5:first-child, h6:first-child"
    );
    return heading && heading.parentElement !== elem;
  });
}

export function run(conf, doc, cb) {
  if (conf.lint || conf.status === "unofficial") {
    return cb();
  }
  var warnings = [];
  var warn = "";

  // Warn if no privacy and/or security considerations section
  // for Rec Track docs
  if (conf.isRecTrack && !hasPriSecConsiderations(doc)) {
    warn =
      "No 'Privacy' or 'Security' considerations sections found. Please see " +
      "[Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).";
    warnings.push(warn);
  }

  // Warn about HTTP URLs used in respecConfig
  if (doc.location.href.startsWith("http")) {
    var httpURLs = findHTTPProps(conf, doc.location.href);
    if (httpURLs.length) {
      warn =
        "Insecure URLs in `respecConfig`! Please change " +
        "the following members to 'https://': \n " +
        httpURLs.map(item => `\`${item}\``).join(", ") +
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
  hasPriSecConsiderations: hasPriSecConsiderations,
};
