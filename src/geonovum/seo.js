// Module geonovum/seo
// Manages SEO information for documents
// e.g. set the canonical URL for the document if configured
import { pub } from "core/pubsubhub";
export const name = "geonovum/seo";
export function run(conf, doc, cb) {
  var trLatestUri = conf.shortName
    ? "https://docs.geostandaarden.nl/" +
      conf.pubDomain +
      "/" +
      conf.specStatus.substr(3).toLowerCase() +
      "-" +
      conf.shortName +
      "/"
    : null;
  switch (conf.canonicalURI.toLowerCase()) {
    case "wv":
      if (conf.edDraftURI) {
        conf.canonicalURI = new URL(conf.edDraftURI, doc.location).href;
      } else {
        pub(
          "warn",
          "Canonical URI staat op WV, " +
            "maar er is geen edDraftURI geconfigureerd"
        );
        conf.canonicalURI = null;
      }
      break;
    case "def":
      if (trLatestUri) {
        conf.canonicalURI = trLatestUri;
      } else {
        pub(
          "warn",
          "Canonical URI staat op DEF" +
            "maar er is geen shortName is geconfigureerd"
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
