// Automatically adds external references.
// Looks for the terms which do not have a definition locally on Shepherd API
// For each returend result, adds `data-cite` attributes to respective elements,
//   so later they can be handled by core/link-to-dfn.
// https://github.com/w3c/respec/issues/1662

import { norm as normalize, showInlineError } from "core/utils";

const API_URL = new URL(
  "https://wt-466c7865b463a6c4cbb820b42dde9e58-0.sandbox.auth0-extend.com/xref-proto-2"
);

/**
 * main external reference driver
 * @param {Object} conf respecConfig
 * @param {Array:Elements} elems possibleExternalLinks
 */
export async function run(conf, elems) {
  const { xref } = conf;
  const xrefMap = createXrefMap(elems);

  const query = createXrefQuery(xrefMap);
  const apiURL = new URL(xref.url, location.href) || API_URL;
  if (!(apiURL instanceof URL)) {
    throw new TypeError("respecConfig.xref.url must be a valid URL instance");
  }
  const results = await fetchXrefs(query, apiURL);
  addDataCiteToTerms(results, xrefMap, conf);
}

/**
 * maps term to elements and context
 * @param {Array:Elements} elems
 * @returns {Map} term => [ { elem } ]
 */
function createXrefMap(elems) {
  return elems.reduce((map, elem) => {
    const term = normalize(elem.textContent);
    const xrefsForTerm = map.has(term) ? map.get(term) : [];
    xrefsForTerm.push({ elem });
    return map.set(term, xrefsForTerm);
  }, new Map());
}

/**
 * creates a body for POST request to API
 * @param {Map} xrefs
 * @returns {Object} { keys: [{ term }] }
 */
function createXrefQuery(xrefs) {
  const queryKeys = [...xrefs.keys()].reduce((queryKeys, term) => {
    return queryKeys.add(JSON.stringify({ term }));
  }, new Set());
  return { keys: [...queryKeys].map(JSON.parse) };
}

// fetch from network
async function fetchXrefs(query, url) {
  const options = {
    method: "POST",
    body: JSON.stringify(query),
    headers: {
      "Content-Type": "application/json",
    },
  };
  const json = await fetch(url, options);
  return await json.json();
}

/**
 * adds data-cite attributes to elems
 * for each term from conf.xref[term] for which results are found.
 * @param {Object} results parsed JSON results returned from API
 * @param {Map} xrefMap xrefMap
 * @param {Object} conf respecConfig
 */
function addDataCiteToTerms(results, xrefMap, conf) {
  for (const [term, entries] of xrefMap) {
    entries.forEach(entry => {
      const { elem } = entry;

      const result = disambiguate(results[term], entry, term);
      if (!result) return;

      const { uri, spec: cite, normative } = result;
      const path = uri.includes("/") ? uri.split("/", 1)[1] : uri;
      const [citePath, citeFrag] = path.split("#");
      Object.assign(elem.dataset, { cite, citePath, citeFrag });

      if (normative == true) conf.normativeReferences.add(cite);
    });
  }
}

// disambiguate fetched results based on context
function disambiguate(data, context, term) {
  const { elem } = context;

  if (!data || !data.length) {
    const msg = `No external reference data found for term \`${term}\`.`;
    showInlineError(elem, msg);
    return null;
  }

  if (data.length === 1) {
    return data[0]; // unambiguous
  }

  const msg = `Ambiguity in data found for term \`${term}\`.`;
  showInlineError(elem, msg);
  return null;
}
