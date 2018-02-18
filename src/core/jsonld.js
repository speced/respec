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
      "schema": "http://schema.org/",
      "xhv": "http://www.w3.org/1999/xhtml/vocab#",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "citation": {"@type": "@id"},
      "contributor": {"@type": "@id"},
      "datePublished": {"@type": "xsd:date"},
      "dependencies": {"@type": "@id"},
      "editor": {"@type": "@id"},
      "hasPart": {"@type": "@id"},
      "inLanguage": {"@language": null},
      "isBasedOn": {"@type": "@id"},
      "license": {"@type": "@id"},
      "license": {"@type": "@id"},
      "worksFor": {"@type": "@id"}
    }],
    id: (conf.canonicalURI || conf.thisVersion),
    type: types,
    name: conf.title,
    inLanguage: ($('html', doc).attr('lang') || 'en'),
    license: conf.licenseInfo.url,
    datePublished: conf.dashDate,
    copyrightHolder: {
      name: "World Wide Web Consortium",
      url: "https://www.w3.org/"
    },
    discussionUrl: conf.issueBase
  };

  if (conf.subtitle) jsonld.alternativeHeadline = conf.subtitle;
  if (conf.prevVersion) jsonld.isBasedOn = conf.prevVersion;

  // description from abstract
  const $abs = $("#abstract", doc);
  if ($abs.length) {
    jsonld.description = $abs.text();
  }

  // Editors
  if (conf.editors) {
    jsonld.editor = conf.editors.map(person => addPerson(person));
  }
  if (conf.authors) {
    jsonld.contributor = conf.authors.map(person => addPerson(person));
  }

  // normative and informative references
  jsonld.dependencies = Array.from(conf.normativeReferences).map(ref => addRef(conf, ref));
  jsonld.citation = Array.from(conf.informativeReferences).map(ref => addRef(conf, ref));

  var $jsonld = $(
    "<script type='application/ld+json'>" +
      JSON.stringify(jsonld) +
      "</script>"
  ).appendTo($("head"));

  cb();
}

// Turn editors and authors into a list of JSON-LD relationships
function addPerson(person) {
  const ed = {
    type: "Person",
    name: person.name,
    url: person.url,
    'foaf:mbox': person.mailto
  }
  if (person.company) {
    ed.worksFor = {
      name: person.company,
      url: person.companyURL
    };
  }
  return ed;
}

// Create a reference URL from the ref
function addRef(conf, ref) {
  const cite = conf.biblio[ref];
  return {
    name: cite.title,
    url: cite.href
  }
}