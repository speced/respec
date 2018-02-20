// Module core/jsonld
// Create script element with JSON-LD for SEO document description
export const name = "core/jsonld";

export function run(conf, doc, cb) {
  if (!conf.doJsonLd) {
    return cb();
  }
  // Content for JSON
  const types = ["TechArticle"];
  if (conf.rdfStatus) types.push(conf.rdfStatus);

  const jsonld = {
    "@context": ["http://schema.org", {
      "@vocab": "http://schema.org/",
      "@language": "en",
      "w3p": "http://www.w3.org/2001/02pd/rec54#",
      "foaf": "http://xmlns.com/foaf/0.1/",
      "datePublished": {"@type": "xsd:date"},
      "inLanguage": {"@language": null},
      "isBasedOn": {"@type": "@id"},
      "license": {"@type": "@id"}
    }],
    id: conf.canonicalURI || conf.thisVersion,
    type: types,
    name: conf.title,
    inLanguage: doc.documentElement.lang || "en",
    license: conf.licenseInfo.url,
    datePublished: conf.dashDate,
    copyrightHolder: {
      name: "World Wide Web Consortium",
      url: "https://www.w3.org/"
    },
    discussionUrl: conf.issueBase
  };

  // add any additional copyright holders
  if (conf.additionalCopyrightHolders) {
    const addl = Array.isArray(conf.additionalCopyrightHolders)
      ? conf.additionalCopyrightHolders
      : [conf.additionalCopyrightHolders];
    jsonld.copyrightHolder = [
      jsonld.copyrightHolder,
      ...addl.map(h => ({name: h}))];
  }

  if (conf.subtitle) jsonld.alternativeHeadline = conf.subtitle;
  if (conf.prevVersion) jsonld.isBasedOn = conf.prevVersion;

  // description from abstract
  const abs = doc.getElementById("abstract");
  if (abs && abs.textContent) {
    jsonld.description = abs.textContent;
  }

  // Editors
  if (conf.editors) {
    jsonld.editor = conf.editors.map(addPerson);
  }
  if (conf.authors) {
    jsonld.contributor = conf.authors.map(addPerson);
  }

  // normative and informative references
  const refs = [...conf.normativeReferences, ...conf.informativeReferences];
  jsonld.citation = refs
    .map(ref => conf.biblio[ref])
    .filter(ref => typeof ref === "object")
    .map(addRef);

  const script = doc.createElement("script");
  script.type =  "application/ld+json";
  script.textContent = JSON.stringify(jsonld);
  doc.head.appendChild(script);

  cb();
}

// Turn editors and authors into a list of JSON-LD relationships
function addPerson({ name, url, mailto, company, companyURL }) {
  const ed = {
    type: "Person",
    name,
    url,
    'foaf:mbox': mailto
  };
  if (company || companyURL) {
    ed.worksFor = {
      name: company,
      url: companyURL
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
