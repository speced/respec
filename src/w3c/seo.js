// Module w3c/seo
// Manages SEO information for documents
// e.g. set the canonical URL for the document if configured
import { pub } from "core/pubsubhub";
export const name = "w3c/seo";
export function run(conf, doc, cb) {
  var trLatestUri = conf.shortName
    ? "https://www.w3.org/TR/" + conf.shortName + "/"
    : null;
  switch (conf.canonicalURI) {
    case "edDraft":
      if (conf.edDraftURI) {
        conf.canonicalURI = new URL(conf.edDraftURI, doc.location).href;
      } else {
        pub(
          "warn",
          "Canonical URI set to edDraft, " +
            "but no edDraftURI is set in configuration"
        );
        conf.canonicalURI = null;
      }
      break;
    case "TR":
      if (trLatestUri) {
        conf.canonicalURI = trLatestUri;
      } else {
        pub(
          "warn",
          "Canonical URI set to TR, but " +
            "no shortName is set in configuration"
        );
        conf.canonicalURI = null;
      }
      break;
    default:
      if (conf.canonicalURI) {
        try {
          conf.canonicalURI = new URL(conf.canonicalURI, doc.location).href;
        } catch (err) {
          pub("warn", "CanonicalURI is an invalid URL: " + err.message);
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
