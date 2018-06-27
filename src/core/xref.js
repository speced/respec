// Automatically adds external refernces
// https://github.com/w3c/respec/issues/1662

import { norm } from "core/utils";
import { pub } from "core/pubsubhub";

/**
 * main external reference driver
 * @param {Object} conf respecConfig
 * @param {Array:Elements} elems possibleExternalLinks
 */
export async function run(conf, elems) {
  const xrefMap = createXrefMap(elems);

  const query = createXrefQuery(xrefMap);
  const results = await fetchXrefs(query, conf.xref.url);

  addDataCiteToTerms(results, xrefMap, conf);
}

/**
 * maps term to elements and context
 * @param {Array:Elements} elems
 * @returns {Map} term => [ { elem } ]
 */
function createXrefMap(elems) {
  return elems.reduce((map, elem) => {
    const term = norm(elem.textContent);
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
  return await simulateShepherd(query, url);
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
    showError(msg, elem);
    return null;
  }

  if (data.length === 1) {
    return data[0]; // unambiguous
  }

  const msg = `Ambiguity in data found for term \`${term}\`.`;
  showError(msg, elem);
  return null;

  function showError(msg, elem) {
    elem.classList.add("respec-offending-element");
    elem.setAttribute("title", msg);
    pub("warn", msg + " See develper console for details.");
    console.warn(msg, elem);
  }
}

// just a network simulation for prototype ignore.
async function simulateShepherd(query, url) {
  const result = {};
  const data = await (await fetch(url)).json();
  for (const key of query.keys) {
    const { term } = key;
    result[term] = result[term] || [];
    if (term in data) {
      for (const item of data[term]) {
        if (
          filterFn(item, key) &&
          !result[term].find(t => t.uri === item.uri)
        ) {
          result[term].push(item);
        }
      }
    }
    if (!result[term].length) delete result[term];
  }
  return result;

  function filterFn(item, { specs, types }) {
    let valid = true;
    if (Array.isArray(specs) && specs.length) {
      valid = specs.includes(item.spec);
    }
    if (Array.isArray(types) && types.length) {
      valid = valid && types.includes(item.type);
    }
    return valid;
  }
}
