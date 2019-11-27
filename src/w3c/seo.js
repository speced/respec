// @ts-check
// Module w3c/seo
// Manages SEO information for documents
// e.g. set the canonical URL for the document if configured
import { pub } from "../core/pubsubhub.js";
import { resolveRef } from "../core/biblio.js";
export const name = "w3c/seo";
export async function run(conf) {
  // Don't include a canonical URL for documents
  // that haven't been published.
  if (!conf.canonicalURI) {
    switch (conf.specStatus) {
      case "CG-DRAFT":
      case "BG-DRAFT":
      case "unofficial":
        return;
    }
  }
  const trLatestUri = conf.shortName
    ? `https://www.w3.org/TR/${conf.shortName}/`
    : null;
  switch (conf.canonicalURI) {
    case "edDraft":
      if (conf.edDraftURI) {
        conf.canonicalURI = new URL(
          conf.edDraftURI,
          document.location.href
        ).href;
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
          conf.canonicalURI = new URL(
            conf.canonicalURI,
            document.location.href
          ).href;
        } catch (err) {
          pub("warn", `CanonicalURI is an invalid URL: ${err.message}`);
          conf.canonicalURI = null;
        }
      } else if (trLatestUri) {
        conf.canonicalURI = trLatestUri;
      }
  }
  if (conf.canonicalURI) {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "canonical");
    linkElem.setAttribute("href", conf.canonicalURI);
    document.head.appendChild(linkElem);
  }
  if (conf.doJsonLd) {
    await addJSONLDInfo(conf, document);
  }
}

async function addJSONLDInfo(conf, doc) {
  // Content for JSON
  const type = ["TechArticle"];
  if (conf.rdfStatus) type.push(conf.rdfStatus);

  const jsonld = {
    "@context": [
      "http://schema.org",
      {
        "@vocab": "http://schema.org/",
        "@language": doc.documentElement.lang || "en",
        w3p: "http://www.w3.org/2001/02pd/rec54#",
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
    inLanguage: doc.documentElement.lang || "en",
    license: conf.licenseInfo.url,
    datePublished: conf.dashDate,
    /** @type {{ name: string, url?: string } | { name: string, url?: string }[]} */
    copyrightHolder: {
      name: "World Wide Web Consortium",
      url: "https://www.w3.org/",
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
  const citationIds = [
    ...conf.normativeReferences,
    ...conf.informativeReferences,
  ];
  const citationContents = await Promise.all(
    citationIds.map(ref => resolveRef(ref))
  );
  jsonld.citation = citationContents
    .filter(ref => typeof ref === "object")
    .map(addRef);

  const script = doc.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonld, null, 2);
  doc.head.appendChild(script);
}

/**
 * Turn editors and authors into a list of JSON-LD relationships
 */
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

/**
 * Create a reference URL from the ref
 */
function addRef(ref) {
  const { href: id, title: name, href: url } = ref;
  const jsonld = {
    id,
    type: "TechArticle",
    name,
    url,
  };
  if (ref.authors) {
    jsonld.creator = ref.authors.map(a => ({ name: a }));
  }
  if (ref.rawDate) {
    jsonld.publishedDate = ref.rawDate;
  }
  if (ref.isbn) {
    jsonld.identifier = ref.isbn;
  }
  if (ref.publisher) {
    jsonld.publisher = { name: ref.publisher };
  }
  return jsonld;
}
