// Automatically adds external references.
// Looks for the terms which do not have a definition locally on Shepherd API
// For each returend result, adds `data-cite` attributes to respective elements,
//   so later they can be handled by core/link-to-dfn.
// https://github.com/w3c/respec/issues/1662
import {
  IDBKeyVal,
  nonNormativeSelector,
  norm as normalize,
  showInlineError,
  showInlineWarning,
} from "./utils";
import { openDB } from "idb";
import { pub } from "./pubsubhub";

const profiles = {
  "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"],
};

const API_URL = "https://respec.org/xref";
const IDL_TYPES = new Set([
  "attribute",
  "dict-member",
  "dictionary",
  "enum",
  "enum-value",
  "interface",
  "method",
  "typedef",
  "_IDL_",
]);
const CONCEPT_TYPES = new Set(["dfn", "event", "element", "_CONCEPT_"]);
const CACHE_MAX_AGE = 86400000; // 24 hours

class ObjectSet extends Set {
  constructor(data = []) {
    super();
    this.stringified = new Set();
    data.forEach(entry => this.add(entry));
  }

  add(entry) {
    const stringified = JSON.stringify(entry);
    if (!this.stringified.has(stringified)) {
      this.stringified.add(stringified);
      super.add(entry);
    }
    return this;
  }
}

/**
 * main external reference driver
 * @param {Object} conf respecConfig
 * @param {HTMLElement[]} elems possibleExternalLinks
 */
export async function run(conf, elems) {
  const idb = await openDB("xref", 1, {
    upgrade(db) {
      db.createObjectStore("xrefs");
    },
  });
  const cache = new IDBKeyVal(idb, "xrefs");

  const xref = normalizeConfig(conf.xref);
  if (xref.specs) {
    const bodyCite = document.body.dataset.cite
      ? document.body.dataset.cite.split(/\s+/)
      : [];
    document.body.dataset.cite = bodyCite.concat(xref.specs).join(" ");
  }
  const xrefMap = createXrefMap(elems);
  const allKeys = collectPayloadKeys(xrefMap);
  const apiURL = xref.url;

  const {
    found: resultsFromCache,
    notFound: termsToLook,
  } = await resolveFromCache(allKeys, cache);
  const fetchedResults = Object.create(null);
  if (termsToLook.length) {
    Object.assign(fetchedResults, await fetchFromNetwork(termsToLook, apiURL));
    await cacheResults(fetchedResults, cache);
  }

  // merge results
  const uniqueTerms = new Set(
    Object.keys(resultsFromCache).concat(Object.keys(fetchedResults))
  );
  const results = Object.create(null);
  for (const term of uniqueTerms) {
    const data = (resultsFromCache[term] || []).concat(
      fetchedResults[term] || []
    );
    results[term] = [...new ObjectSet(data)];
  }
  addDataCiteToTerms(results, xrefMap, conf);
}

/**
 * converts conf.xref to object with url and spec properties
 */
function normalizeConfig(xref) {
  const defaults = {
    url: API_URL,
    specs: null,
  };

  const config = Object.assign({}, defaults);

  const type = Array.isArray(xref) ? "array" : typeof xref;
  switch (type) {
    case "boolean":
      // using defaults already, as above
      break;
    case "string":
      if (xref.toLowerCase() in profiles) {
        Object.assign(config, { specs: profiles[xref.toLowerCase()] });
      } else {
        invalidProfileError(xref);
      }
      break;
    case "array":
      Object.assign(config, { specs: xref });
      break;
    case "object":
      Object.assign(config, xref);
      if (xref.profile) {
        const profile = xref.profile.toLowerCase();
        if (profile in profiles) {
          const specs = (xref.specs || []).concat(profiles[profile]);
          Object.assign(config, { specs });
        } else {
          invalidProfileError(xref.profile);
        }
      }
      break;
    default:
      pub(
        "error",
        `Invalid value for \`xref\` configuration option. Received: "${xref}".`
      );
  }
  return config;

  function invalidProfileError(profile) {
    const supportedProfiles = Object.keys(profiles)
      .map(p => `"${p}"`)
      .join(", ");
    const msg =
      `Invalid profile "${profile}" in \`respecConfig.xref\`. ` +
      `Please use one of the supported profiles: ${supportedProfiles}.`;
    pub("error", msg);
  }
}

/**
 * maps term to elements and context
 * @typedef {{ elem: HTMLElement, specs: string[], for?: string, types: string[] }} XrefMapEntry
 * @param {HTMLElement[]} elems
 */
function createXrefMap(elems) {
  /** @type {Map<string, XrefMapEntry[]} */
  const map = new Map();

  for (const elem of elems) {
    const isIDL = "xrefType" in elem.dataset;

    let term = elem.dataset.lt
      ? elem.dataset.lt.split("|", 1)[0]
      : elem.textContent;
    term = normalize(term);
    if (!isIDL) term = term.toLowerCase();

    let specs = [];
    /** @type {HTMLElement} */
    const dataciteElem = elem.closest("[data-cite]");
    if (dataciteElem && dataciteElem.dataset.cite) {
      const cite = dataciteElem.dataset.cite.toLowerCase().replace(/[!?]/g, "");
      specs = cite.split(/\s+/);
    }
    // if element itself contains data-cite, we don't take inline context into account
    if (dataciteElem !== elem) {
      for (const el of elem.closest("section").querySelectorAll("a.bibref")) {
        const ref = el.textContent.toLowerCase();
        specs.push(ref);
      }
    }
    const uniqueSpecs = [...new Set(specs)].sort();

    const types = [];
    if (isIDL) {
      if (elem.dataset.xrefType) {
        types.push(...elem.dataset.xrefType.split("|"));
      } else {
        types.push("_IDL_");
      }
    } else {
      types.push("_CONCEPT_");
    }

    let { linkFor: forContext = null } = elem.dataset;
    if (!forContext && isIDL) {
      const dataLinkForElem = elem.closest("[data-link-for]");
      if (dataLinkForElem) {
        forContext = dataLinkForElem.dataset.linkFor;
      }
    }

    const xrefsForTerm = map.has(term) ? map.get(term) : [];
    xrefsForTerm.push({ elem, specs: uniqueSpecs, for: forContext, types });
    map.set(term, xrefsForTerm);
  }

  return map;
}

/**
 * collects xref keys in a form more usable for querying
 * @param {ReturnType<createXrefMap>} xrefs
 * @typedef {{ term: string, specs?: string[], types?: string[], for?: string }} PayloadKey
 * @returns {PayloadKey[]}
 */
function collectPayloadKeys(xrefs) {
  const keys = new ObjectSet();
  for (const [term, entries] of xrefs) {
    for (const { specs, types, for: forContext } of entries) {
      const key = { term };
      if (specs.length) key.specs = specs;
      if (types.length) key.types = types;
      if (forContext) key.for = forContext;
      keys.add(key);
    }
  }
  return [...keys];
}

// adds data to cache
async function cacheResults(data, cache) {
  const promisesToSet = Object.entries(data).map(([term, results]) =>
    cache.set(term, results)
  );
  await cache.set("__CACHE_TIME__", Date.now());
  await Promise.all(promisesToSet);
}

/**
 * looks for keys in cache and resolves them.
 * `found` contains resolved data from cache.
 * `notFound` contains keys not found in cache.
 * @param {Array} keys query keys
 * @param {IDBKeyVal} cache
 * @returns {Promise<{ found: ApiResponse, notFound: PayloadKey[] }>}
 */
async function resolveFromCache(keys, cache) {
  const cacheTime = await cache.get("__CACHE_TIME__");
  const bustCache = cacheTime && Date.now() - cacheTime > CACHE_MAX_AGE;
  if (bustCache) {
    await cache.clear();
    return { found: Object.create(null), notFound: keys };
  }

  const promisesToGet = keys.map(({ term }) => cache.get(term));
  const cachedData = await Promise.all(promisesToGet);
  return keys.reduce(separate, { found: Object.create(null), notFound: [] });

  function separate(collector, key, i) {
    const data = cachedData[i];
    if (data && data.length) {
      const fromCache = data.filter(entry => cacheFilter(entry, key));
      if (fromCache.length) {
        const { term } = key;
        if (!collector.found[term]) collector.found[term] = [];
        collector.found[term].push(...fromCache);
      } else {
        collector.notFound.push(key);
      }
    } else {
      collector.notFound.push(key);
    }
    return collector;
  }

  function cacheFilter(cacheEntry, key) {
    let accept = true;
    if (key.specs && key.specs.length) {
      accept = key.specs.includes(cacheEntry.spec);
    }
    if (accept && key.for) {
      accept = cacheEntry.for && cacheEntry.for.includes(key.for);
    }
    return accept;
  }
}

/**
 * @typedef {{ uri: string; shortname: string; spec: string; type: string; normative: boolean; for?: string[] }} ApiResponseElement
 * @typedef {{ [term: string]: ApiResponseElement[] }} ApiResponse
 * @returns {Promise<ApiResponse>}
 */
async function fetchFromNetwork(keys, url) {
  const query = { keys };
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
 * Figures out from the tree structure if the reference is
 * normative (true) or informative (false).
 * @param {HTMLElement} elem
 */
function isNormative(elem) {
  const closestNormative = elem.closest(".normative");
  const closestInform = elem.closest(nonNormativeSelector);
  if (!closestInform || elem === closestNormative) {
    return true;
  } else if (
    closestNormative &&
    closestInform &&
    closestInform.contains(closestNormative)
  ) {
    return true;
  }
  return false;
}

/**
 * adds data-cite attributes to elems for each term for which results are found.
 * @param {ApiResponse} results parsed JSON results returned from API
 * @param {ReturnType<typeof createXrefMap>} xrefMap
 * @param {Object} conf respecConfig
 */
function addDataCiteToTerms(results, xrefMap, conf) {
  const errorCollectors = {
    /** @type {Map<string, HTMLElement[]>} */
    noDfn: new Map(),
    /** @type {Map<string, { specs: Set<string>, elems: HTMLElement[] }>} */
    ambiguousSpec: new Map(),
  };

  for (const [term, entries] of xrefMap) {
    for (const entry of entries) {
      const result = disambiguate(results[term], entry, term);
      const { elem } = entry;
      if (result.error) {
        collectErrors(term, elem, result, errorCollectors);
        continue;
      }
      const { uri, spec: cite, normative, type } = result;
      const path = uri.includes("/") ? uri.split("/", 1)[1] : uri;
      const [citePath, citeFrag] = path.split("#");
      const dataset = { cite, citePath, citeFrag, type };
      Object.assign(elem.dataset, dataset);

      // update indirect links (data-lt, data-plurals)
      const indirectLinks = document.querySelectorAll(
        `[data-dfn-type="xref"][data-xref="${term.toLowerCase()}"]`
      );
      indirectLinks.forEach(el => {
        el.removeAttribute("data-xref");
        Object.assign(el.dataset, dataset);
      });

      // add specs for citation (references section)
      const isNormRef = isNormative(elem);
      if (!isNormRef) {
        // Only add it if not already normative...
        if (!conf.normativeReferences.has(cite)) {
          conf.informativeReferences.add(cite);
        }
        continue;
      }
      if (normative) {
        // If it was originally informative, we move the existing
        // key to be normative.
        const existingKey = conf.informativeReferences.has(cite)
          ? conf.informativeReferences.getCanonicalKey(cite)
          : cite;
        conf.normativeReferences.add(existingKey);
        conf.informativeReferences.delete(existingKey);
        continue;
      }
      const msg =
        `Adding an informative reference to "${term}" from "${cite}" ` +
        "in a normative section";
      const title = "Error: Informative reference in normative section";
      showInlineWarning(entry.elem, msg, title);
    }
  }
  showErrors(errorCollectors);
}

/**
 * disambiguate fetched results based on context
 * @param {ApiResponseElement[]} fetchedData
 * @param {XrefMapEntry} context
 * @param {string} term
 */
function disambiguate(fetchedData, context, term) {
  const { specs, types, for: contextFor } = context;
  const data = (fetchedData || []).filter(entry => {
    let valid = true;
    if (specs.length) {
      valid = specs.includes(entry.shortname) || specs.includes(entry.spec);
    }
    if (valid && types.length) {
      valid = types.includes(entry.type);
      if (!valid) {
        const validTypes = types.includes("_IDL_") ? IDL_TYPES : CONCEPT_TYPES;
        valid = [...validTypes].some(type => type === entry.type);
      }
    }
    if (valid && contextFor && entry.for) {
      valid = entry.for.includes(contextFor);
    }
    return valid;
  });

  if (!data.length) {
    // no match found
    return { error: "NO_MATCH", term };
  }

  if (data.length === 1) {
    return data[0]; // unambiguous
  }

  // ambiguous
  return { error: "AMBIGUOUS", term, specs: data.map(e => e.spec) };
}

function collectErrors(term, elem, errorData, errorCollectors) {
  switch (errorData.error) {
    case "NO_MATCH": {
      const errors = errorCollectors.noDfn;
      if (!errors.has(term)) {
        errors.set(term, []);
      }
      const elems = errors.get(term);
      elems.push(elem);
      break;
    }
    case "AMBIGUOUS": {
      const errors = errorCollectors.ambiguousSpec;
      if (!errors.has(term)) {
        errors.set(term, { specs: new Set(), elems: [] });
      }
      const { specs, elems } = errors.get(term);
      errorData.specs.forEach(spec => specs.add(spec));
      elems.push(elem);
      break;
    }
  }
}

function showErrors(errorCollectors) {
  for (const [term, elems] of errorCollectors.noDfn) {
    const msg =
      `Couldn't match "**${term}**" to anything in the document or to any other spec. ` +
      "Please provide a [`data-cite`](https://github.com/w3c/respec/wiki/data--cite) attribute for it.";
    const title = "Error: No matching dfn found.";
    showInlineError(elems, msg, title);
  }

  for (const [term, data] of errorCollectors.ambiguousSpec) {
    const specs = [...data.specs];
    const msg =
      `The term "**${term}**" is defined in ${specs.length} ` +
      `spec(s) in multiple ways, so it's ambiguous. ` +
      "To disambiguate, you need to add a [`data-cite`](https://github.com/w3c/respec/wiki/data--cite) attribute. " +
      `The specs where it's defined are: ${specs
        .map(s => `**${s}**`)
        .join(", ")}.`;
    const title = "Error: Linking an ambiguous dfn.";
    showInlineError(data.elems, msg, title);
  }
}
