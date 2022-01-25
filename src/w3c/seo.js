// @ts-check
// Module w3c/seo
// Manages SEO information for documents
// e.g. set the canonical URL for the document if configured
import { W3CNotes, recTrackStatus, registryTrackStatus } from "./headers.js";
import { html } from "../core/import-maps.js";
import { resolveRef } from "../core/biblio.js";
import { showWarning } from "../core/utils.js";
export const name = "w3c/seo";

const status2rdf = {
  NOTE: "w3p:NOTE",
  WD: "w3p:WD",
  LC: "w3p:LastCall",
  CR: "w3p:CR",
  CRD: "w3p:CRD",
  PR: "w3p:PR",
  REC: "w3p:REC",
  PER: "w3p:PER",
  RSCND: "w3p:RSCND",
};

export const requiresCanonicalLink = new Set([
  ...W3CNotes,
  ...recTrackStatus,
  ...registryTrackStatus,
  "BG-FINAL",
  "CG-FINAL",
  "CRY",
  "DRY",
  "draft-finding",
  "finding",
]);

export async function run(conf) {
  // Don't include a canonical URL for documents that haven't been published.
  if (
    (!conf.canonicalURI && !requiresCanonicalLink.has(conf.specStatus)) ||
    !conf.shortName
  ) {
    return;
  }
  switch (conf.canonicalURI) {
    case "edDraft":
      if (conf.edDraftURI) {
        conf.canonicalURI = new URL(
          conf.edDraftURI,
          document.location.href
        ).href;
      } else {
        const msg = `Canonical URI set to edDraft, but no edDraftURI is set in configuration`;
        showWarning(msg, name);
        conf.canonicalURI = null;
      }
      break;
    case "TR":
      if (conf.latestVersion) {
        conf.canonicalURI = conf.latestVersion;
      } else {
        const msg = `Canonical URI set to TR, but no shortName is set in configuration`;
        showWarning(msg, name);
        conf.canonicalURI = null;
      }
      break;
    default:
      if (conf.latestVersion && !conf.canonicalURI) {
        conf.canonicalURI = conf.latestVersion;
      }
  }
  if (conf.canonicalURI) {
    const linkElem = html`<link rel="canonical" href="${conf.canonicalURI}" />`;
    document.head.appendChild(linkElem);
  }

  if (conf.doJsonLd) {
    await addJSONLDInfo(conf, document);
  }
}

async function addJSONLDInfo(conf, doc) {
  const rdfStatus = status2rdf[conf.specStatus];
  // Content for JSON
  const type = ["TechArticle"];
  if (rdfStatus) type.push(rdfStatus);

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
    name: document.title,
    inLanguage: doc.documentElement.lang || "en",
    license: conf.licenseInfo?.url,
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
