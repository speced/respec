// Module w3c/seo
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
  if (conf.canonicalURI) {
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
              "maar er is geen shortName geconfigureerd"
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
  }
  if (conf.canonicalURI) {
    var linkElem = doc.createElement("link");
    linkElem.setAttribute("rel", "canonical");
    linkElem.setAttribute("href", conf.canonicalURI);
    doc.head.appendChild(linkElem);
  }
  cb();
  if (conf.doJsonLd) {
    addJSONLDInfo(conf, doc);
  }
}

async function addJSONLDInfo (conf, doc) {
  await doc.respecIsReady;
  // Content for JSON
  const type = ["TechArticle"];

  const jsonld = {
    "@context": [
      "http://schema.org",
      {
        "@vocab": "http://schema.org/",
        "@language": doc.documentElement.lang || "en",
        foaf: "http://xmlns.com/foaf/0.1/",
        datePublished: { "@type": "http://www.w3.org/2001/XMLSchema#date" },
        inLanguage: { "@language": null },
        isBasedOn: { "@type": "@id" },
        license: { "@type": "@id" },
      },
    ],
    id: conf.canonicalURI || conf.thisVersion,
    type,
    name: conf.title,
    inLanguage: doc.documentElement.lang || "nl",
    license: conf.licenseInfo.url,
    datePublished: conf.dashDate,
    copyrightHolder: {
      name: "Geonovum",
      url: "https://www.geonovum.nl/",
    },
    discussionUrl: conf.issueBase,
    alternativeHeadline: conf.subtitle,
    isBasedOn: conf.prevVersion,
  };

  // add any additional copyright holders
  if (conf.additionalCopyrightHolders) {
    const addl = Array.isArray(conf.additionalCopyrightHolders)
      ? conf.additionalCopyrightHolders
      : [conf.additionalCopyrightHolders];
    jsonld.copyrightHolder = [
      jsonld.copyrightHolder,
      ...addl.map(h => ({ name: h })),
    ];
  }

  // description from meta description
  const description = doc.head.querySelector("meta[name=description]");
  if (description) {
    jsonld.description = description.content;
  }

  // Editors
  if (conf.editors) {
    jsonld.editor = conf.editors.map(addPerson);
  }
  if (conf.authors) {
    jsonld.contributor = conf.authors.map(addPerson);
  }

  // normative and informative references
  jsonld.citation = [...conf.normativeReferences, ...conf.informativeReferences]
    .map(ref => conf.biblio[ref])
    .filter(ref => typeof ref === "object")
    .map(addRef);

  const script = doc.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonld, null, 2);
  doc.head.appendChild(script);

}

// Turn editors and authors into a list of JSON-LD relationships
function addPerson({ name, url, mailto, company, companyURL }) {
  const ed = {
    type: "Person",
    name,
    url,
    "foaf:mbox": mailto,
  };
  if (company || companyURL) {
    ed.worksFor = {
      name: company,
      url: companyURL,
    };
  }
  return ed;
}

// Create a reference URL from the ref
function addRef(ref) {
  const { href: id, title: name, href: url } = ref;
  return {
    id,
    type: "TechArticle",
    name,
    url,
  };
}
