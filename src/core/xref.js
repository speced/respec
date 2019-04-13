// @ts-check
// Automatically adds external references.
// Looks for the terms which do not have a definition locally on Shepherd API
// For each returend result, adds `data-cite` attributes to respective elements,
//   so later they can be handled by core/link-to-dfn.
// https://github.com/w3c/respec/issues/1662
/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 */
import {
  IDBKeyVal,
  nonNormativeSelector,
  norm as normalize,
  showInlineError,
  showInlineWarning,
} from "./utils.js";
import { openDB } from "idb";
import { pub } from "./pubsubhub.js";

const profiles = {
  "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"],
};

const API_URL = "https://respec.org/xref";
const CACHE_MAX_AGE = 86400000; // 24 hours

/**
 * main external reference driver
 * @param {Object} conf respecConfig
 * @param {HTMLElement[]} elems possibleExternalLinks
 */
export async function run(conf, elems) {
  const xref = normalizeConfig(conf.xref);
  if (xref.specs) {
    const bodyCite = document.body.dataset.cite
      ? document.body.dataset.cite.split(/\s+/)
      : [];
    document.body.dataset.cite = bodyCite.concat(xref.specs).join(" ");
  }

  /** @type {RequestEntry[]} */
  const queryKeys = [];
  for (const elem of elems) {
    const entry = getRequestEntry(elem);
    const id = await objectHash(entry);
    queryKeys.push({ ...entry, id });
  }

  const data = await getData(queryKeys, xref.url);
  addDataCiteToTerms(elems, queryKeys, data, conf);
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
 * get xref API request entry (term and context) for given xref element
 * @param {HTMLElement} elem
 */
function getRequestEntry(elem) {
  const isIDL = "xrefType" in elem.dataset;

  let term = elem.dataset.lt
    ? elem.dataset.lt.split("|", 1)[0]
    : elem.textContent;
  term = normalize(term);
  if (!isIDL) term = term.toLowerCase();

  const specs = [];
  /** @type {HTMLElement} */
  const dataciteElem = elem.closest("[data-cite]");
  if (dataciteElem && dataciteElem.dataset.cite) {
    const cite = dataciteElem.dataset.cite.toLowerCase().replace(/[!?]/g, "");
    specs.push(...cite.split(/\s+/));
  }
  // if element itself contains data-cite, we don't take inline context into account
  if (dataciteElem !== elem) {
    /** @type {NodeListOf<HTMLElement>} */
    const bibrefs = elem.closest("section").querySelectorAll("a.bibref");
    for (const el of bibrefs) {
      const ref = el.textContent.toLowerCase();
      specs.push(ref);
    }
  }

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

  let { linkFor: forContext } = elem.dataset;
  if (!forContext && isIDL) {
    const dataLinkForElem = elem.closest("[data-link-for]");
    if (dataLinkForElem) {
      forContext = dataLinkForElem.dataset.linkFor;
    }
  }

  return {
    term,
    types,
    ...(specs.length && { specs: [...new Set(specs)].sort() }),
    ...(forContext && { for: forContext }),
  };
}

/**
 * @param {RequestEntry[]} queryKeys
 * @param {string} apiUrl
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function getData(queryKeys, apiUrl) {
  const idb = await openDB("xref", 1, {
    upgrade(db) {
      db.createObjectStore("xrefs");
    },
  });
  const cache = new IDBKeyVal(idb, "xrefs");
  const resultsFromCache = await resolveFromCache(queryKeys, cache);

  const termsToLook = queryKeys.filter(key => !resultsFromCache.get(key.id));
  const fetchedResults = await fetchFromNetwork(termsToLook, apiUrl);
  if (fetchedResults.size) {
    // add data to cache
    await cache.addMany(fetchedResults);
    await cache.set("__CACHE_TIME__", Date.now());
  }

  return new Map([...resultsFromCache, ...fetchedResults]);
}

/**
 * @param {RequestEntry[]} keys
 * @param {IDBKeyVal} cache
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function resolveFromCache(keys, cache) {
  const cacheTime = await cache.get("__CACHE_TIME__");
  const bustCache = cacheTime && Date.now() - cacheTime > CACHE_MAX_AGE;
  if (bustCache) {
    await cache.clear();
    return new Map();
  }

  const cachedData = await cache.getMany(keys.map(key => key.id));
  return new Map(cachedData);
}

/**
 * @param {RequestEntry[]} keys
 * @param {string} url
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function fetchFromNetwork(keys, url) {
  if (!keys.length) return new Map();

  const query = { keys };
  const options = {
    method: "POST",
    body: JSON.stringify(query),
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, options);
  const json = await response.json();
  return new Map(Object.entries(json.result));
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
  }
  return (
    closestNormative &&
    closestInform &&
    closestInform.contains(closestNormative)
  );
}

/**
 * adds data-cite attributes to elems for each term for which results are found.
 * adds citations to references section.
 * collects and shows linking errors if any.
 * @param {HTMLElement[]} elems
 * @param {RequestEntry[]} queryKeys
 * @param {Map<string, SearchResultEntry[]>} data
 * @param {any} conf
 */
function addDataCiteToTerms(elems, queryKeys, data, conf) {
  /** @type {Map<string, { elems: HTMLElement[], specs: Set<string> }>} */
  const errorsAmbiguous = new Map();
  /** @type {Map<string, HTMLElement[]>} */
  const errorsTermNotFound = new Map();

  for (let i = 0, l = elems.length; i < l; i++) {
    const elem = elems[i];
    const { id, term } = queryKeys[i];
    const results = data.get(id);
    switch (results.length) {
      case 1:
        addDataCite(elem, queryKeys[i], results[0], conf);
        break;
      case 0: {
        const collector =
          errorsTermNotFound.get(term) ||
          errorsTermNotFound.set(term, []).get(term);
        collector.push(elem);
        break;
      }
      default: {
        const collector =
          errorsAmbiguous.get(term) ||
          errorsAmbiguous.set(term, { specs: new Set(), elems: [] }).get(term);
        results.forEach(result => collector.specs.add(result.shortname));
        collector.elems.push(elem);
      }
    }
  }

  showErrors({ errorsAmbiguous, errorsTermNotFound });
}

/**
 * @param {HTMLElement} elem
 * @param {RequestEntry} query
 * @param {SearchResultEntry} result
 * @param {any} conf
 */
function addDataCite(elem, query, result, conf) {
  const { term } = query;
  const { uri, shortname: cite, normative, type } = result;

  const path = uri.includes("/") ? uri.split("/", 1)[1] : uri;
  const [citePath, citeFrag] = path.split("#");
  const dataset = { cite, citePath, citeFrag, type };
  Object.assign(elem.dataset, dataset);

  // update indirect links (data-lt, data-plurals)
  /** @type {NodeListOf<HTMLElement>} */
  const indirectLinks = document.querySelectorAll(
    `[data-dfn-type="xref"][data-xref="${term.toLowerCase()}"]`
  );
  indirectLinks.forEach(el => {
    el.removeAttribute("data-xref");
    Object.assign(el.dataset, dataset);
  });

  addToReferences(elem, cite, normative, term, conf);
}

/**
 * add specs for citation (references section)
 * @param {HTMLElement} elem
 * @param {string} cite
 * @param {boolean} normative
 * @param {string} term
 * @param {any} conf
 */
function addToReferences(elem, cite, normative, term, conf) {
  const isNormRef = isNormative(elem);
  if (!isNormRef) {
    // Only add it if not already normative...
    if (!conf.normativeReferences.has(cite)) {
      conf.informativeReferences.add(cite);
    }
    return;
  }
  if (normative) {
    // If it was originally informative, we move the existing
    // key to be normative.
    const existingKey = conf.informativeReferences.has(cite)
      ? conf.informativeReferences.getCanonicalKey(cite)
      : cite;
    conf.normativeReferences.add(existingKey);
    conf.informativeReferences.delete(existingKey);
    return;
  }

  const msg =
    `Adding an informative reference to "${term}" from "${cite}" ` +
    "in a normative section";
  const title = "Error: Informative reference in normative section";
  showInlineWarning(elem, msg, title);
}

function showErrors({ errorsAmbiguous, errorsTermNotFound }) {
  const linkToDataCite =
    "[`data-cite`](https://github.com/w3c/respec/wiki/data--cite)";

  const titleForNotFound = "Error: No matching dfn found.";
  const hintForNotFound = `Please provide a ${linkToDataCite} attribute for it.`;
  for (const [term, elems] of errorsTermNotFound) {
    const msg =
      `Couldn't match "**${term}**" to anything in the document ` +
      `or to any other spec. ${hintForNotFound}`;
    showInlineError(elems, msg, titleForNotFound);
  }

  const titleForAmbiguous = "Error: Linking an ambiguous dfn.";
  const hintForAmbiguous = `To disambiguate, you need to add a ${linkToDataCite} attribute.`;
  for (const [term, data] of errorsAmbiguous) {
    const specList = [...data.specs];
    const count = specList.length;
    const specs = specList.map(s => `**${s}**`).join(", ");
    const msg =
      `The term "**${term}**" is defined in ${count} ` +
      `spec(s) in multiple ways, so it's ambiguous. ${hintForAmbiguous} ` +
      `The specs where it's defined are: ${specs}.`;
    showInlineError(data.elems, msg, titleForAmbiguous);
  }
}

function objectHash(obj) {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  const buffer = new TextEncoder().encode(str);
  return crypto.subtle.digest("SHA-1", buffer).then(bufferToHexString);
}

/** @param {ArrayBuffer} buffer */
function bufferToHexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  return [...byteArray].map(v => v.toString(16).padStart(2, "0")).join("");
}
