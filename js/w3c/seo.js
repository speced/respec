// Module w3c/seo
// Manages SEO information for documents
// e.g. set the canonical URL for the document if configured
"use strict";
define(
  ["core/pubsubhub"],
  function(pubsubhub) {
    return {
      run: function(conf, doc, cb) {
        var trLatestUri = conf.shortName ? 'https://www.w3.org/TR/' + conf.shortName + '/' : null;
        switch (conf.canonicalURI) {
          case "edDraft":
            if (conf.edDraftURI) {
              conf.canonicalURI = new URL(conf.edDraftURI, doc.location).href;
            } else {
              pubsubhub.pub("warn", "Canonical URI set to edDraft, " +
                "but no edDraftURI is set in configuration");
              conf.canonicalURI = null;
            }
            break;
          case "TR":
            if (trLatestUri) {
              conf.canonicalURI = trLatestUri;
            } else {
              pubsubhub.pub("warn", "Canonical URI set to TR, but " +
                "no shortName is set in configuration");
              conf.canonicalURI = null;
            }
            break;
          default:
            if (conf.canonicalURI) {
              try {
                conf.canonicalURI = new URL(conf.canonicalURI, doc.location).href;
              } catch (err) {
                pubsubhub.pub("warn", "CanonicalURI is an invalid URL: " +
                  err.message);
                conf.canonicalURI = null;
              }
            } else if (trLatestUri) {
              conf.canonicalURI = trLatestUri;
            }
        }
        if (conf.canonicalURI) {
          var linkElem = doc.createElement("link");
          linkElem.setAttribute("rel", "canonical");
          linkElem.setAttribute("href", conf.canonicalURI);
          doc.head.appendChild(linkElem);
        }
        cb();
      }
    };
  }
);
