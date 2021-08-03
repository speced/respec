// @ts-check
/**
 * @module core/xref
 *
 * Automatically adds external references.
 *
 * Searches for the terms which do not have a local definition at xref API and
 * for each query, adds `data-cite` attributes to respective elements.
 * `core/data-cite` later converts these data-cite attributes to actual links.
 * https://github.com/w3c/respec/issues/1662
 */
/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 * @typedef {Map<string, { elems: HTMLElement[], results: SearchResultEntry[], query: RequestEntry }>} ErrorCollection
 * @typedef {{ ambiguous: ErrorCollection, notFound: ErrorCollection }} Errors
 */
import { cacheXrefData, resolveXrefCache } from "./xref-db.js";
import {
  createResourceHint,
  docLink,
  joinAnd,
  joinOr,
  nonNormativeSelector,
  norm as normalize,
  showError,
  showWarning,
} from "./utils.js";
import { possibleExternalLinks } from "./link-to-dfn.js";
import { sub } from "./pubsubhub.js";

export const name = "core/xref";

const profiles = {
  "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"],
};

export const API_URL = "https://respec.org/xref/";

if (
  !document.querySelector("link[rel='preconnect'][href='https://respec.org']")
) {
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://respec.org",
  });
  document.head.appendChild(link);
}

/**
 * @param {Object} conf respecConfig
 */
export async function run(conf) {
  if (!conf.xref) {
    return;
  }

  const xref = normalizeConfig(conf.xref);
  if (xref.specs) {
    const bodyCite = document.body.dataset.cite
      ? document.body.dataset.cite.split(/\s+/)
      : [];
    document.body.dataset.cite = bodyCite.concat(xref.specs).join(" ");
  }

  const elems = possibleExternalLinks.concat(findExplicitExternalLinks());
  if (!elems.length) return;

  /** @type {RequestEntry[]} */
  const queryKeys = [];
  for (const elem of elems) {
    const entry = getRequestEntry(elem);
    entry.id = await objectHash(entry);
    queryKeys.push(entry);
  }

  const data = await getData(queryKeys, xref.url);
  addDataCiteToTerms(elems, queryKeys, data, conf);

  sub("beforesave", cleanup);
}

/**
 * Find additional references that need to be looked up externally.
 * Examples: a[data-cite="spec"], dfn[data-cite="spec"], dfn.externalDFN
 */
function findExplicitExternalLinks() {
  /** @type {NodeListOf<HTMLElement>} */
  const links = document.querySelectorAll(
    ":is(a,dfn)[data-cite]:not([data-cite=''],[data-cite*='#'])"
  );
  /** @type {NodeListOf<HTMLElement>} */
  const externalDFNs = document.querySelectorAll("dfn.externalDFN");
  return [...links]
    .filter(el => {
      // ignore empties
      if (el.textContent.trim() === "") return false;
      /** @type {HTMLElement} */
      const closest = el.closest("[data-cite]");
      return !closest || closest.dataset.cite !== "";
    })
    .concat(...externalDFNs);
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
          const specs = (xref.specs ?? []).concat(profiles[profile]);
          Object.assign(config, { specs });
        } else {
          invalidProfileError(xref.profile);
        }
      }
      break;
    default: {
      const msg = `Invalid value for \`xref\` configuration option. Received: "${xref}".`;
      showError(msg, name);
    }
  }
  return config;

  function invalidProfileError(profile) {
    const supportedProfiles = joinOr(Object.keys(profiles), s => `"${s}"`);
    const msg =
      `Invalid profile "${profile}" in \`respecConfig.xref\`. ` +
      `Please use one of the supported profiles: ${supportedProfiles}.`;
    showError(msg, name);
  }
}

/**
 * get xref API request entry (term and context) for given xref element
 * @param {HTMLElement} elem
 */
function getRequestEntry(elem) {
  const isIDL = "xrefType" in elem.dataset;

  let term = getTermFromElement(elem);
  if (!isIDL) term = term.toLowerCase();

  const specs = getSpecContext(elem);
  const types = getTypeContext(elem, isIDL);
  const forContext = getForContext(elem, isIDL);

  return {
    // Add an empty `id` to ensure the shape of object returned stays same when
    // actual `id` is added later (minor perf optimization, also makes
    // TypeScript happy).
    id: "",
    term,
    types,
    ...(specs.length && { specs }),
    ...(typeof forContext === "string" && { for: forContext }),
  };
}

/** @param {HTMLElement} elem */
export function getTermFromElement(elem) {
  const { lt: linkingText } = elem.dataset;
  let term = linkingText ? linkingText.split("|", 1)[0] : elem.textContent;
  term = normalize(term);
  return term === "the-empty-string" ? "" : term;
}

/**
 * Get spec context as a fallback chain, where each level (sub-array) represents
 * decreasing priority.
 * @param {HTMLElement} elem
 */
function getSpecContext(elem) {
  /** @type {string[][]} */
  const specs = [];

  /** @type {HTMLElement} */
  let dataciteElem = elem.closest("[data-cite]");

  // Traverse up towards the root element, adding levels of lower priority specs
  while (dataciteElem) {
    const cite = dataciteElem.dataset.cite.toLowerCase().replace(/[!?]/g, "");
    const cites = cite.split(/\s+/).filter(s => s);
    if (cites.length) {
      specs.push(cites);
    }
    if (dataciteElem === elem) break;
    dataciteElem = dataciteElem.parentElement.closest("[data-cite]");
  }

  // If element itself contains data-cite, we don't take inline context into
  // account. The inline bibref context has lowest priority, if available.
  if (dataciteElem !== elem) {
    const closestSection = elem.closest("section");
    /** @type {Iterable<HTMLElement>} */
    const bibrefs = closestSection
      ? closestSection.querySelectorAll("a.bibref")
      : [];
    const inlineRefs = [...bibrefs].map(el => el.textContent.toLowerCase());
    if (inlineRefs.length) {
      specs.push(inlineRefs);
    }
  }

  const uniqueSpecContext = dedupeSpecContext(specs);
  return uniqueSpecContext;
}

/**
 * If we already have a spec in a higher priority level (closer to element) of
 * fallback chain, skip it from low priority levels, to prevent duplication.
 * @param {string[][]} specs
 * */
function dedupeSpecContext(specs) {
  /** @type {string[][]} */
  const unique = [];
  for (const level of specs) {
    const higherPriority = unique[unique.length - 1] || [];
    const uniqueSpecs = [...new Set(level)].filter(
      spec => !higherPriority.includes(spec)
    );
    unique.push(uniqueSpecs.sort());
  }
  return unique;
}

/**
 * @param {HTMLElement} elem
 * @param {boolean} isIDL
 */
function getForContext(elem, isIDL) {
  if (elem.dataset.xrefFor) {
    return normalize(elem.dataset.xrefFor);
  }

  if (isIDL) {
    /** @type {HTMLElement} */
    const dataXrefForElem = elem.closest("[data-xref-for]");
    if (dataXrefForElem) {
      return normalize(dataXrefForElem.dataset.xrefFor);
    }
  }

  return null;
}

/**
 * @param {HTMLElement} elem
 * @param {boolean} isIDL
 */
function getTypeContext(elem, isIDL) {
  if (isIDL) {
    if (elem.dataset.xrefType) {
      return elem.dataset.xrefType.split("|");
    }
    return ["_IDL_"];
  }

  return ["_CONCEPT_"];
}

/**
 * @param {RequestEntry[]} queryKeys
 * @param {string} apiUrl
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function getData(queryKeys, apiUrl) {
  const uniqueIds = new Set();
  const uniqueQueryKeys = queryKeys.filter(key => {
    return uniqueIds.has(key.id) ? false : uniqueIds.add(key.id) && true;
  });

  const resultsFromCache = await resolveXrefCache(uniqueQueryKeys);

  const termsToLook = uniqueQueryKeys.filter(
    key => !resultsFromCache.get(key.id)
  );
  const fetchedResults = await fetchFromNetwork(termsToLook, apiUrl);
  if (fetchedResults.size) {
    // add data to cache
    await cacheXrefData(uniqueQueryKeys, fetchedResults);
  }

  return new Map([...resultsFromCache, ...fetchedResults]);
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
  return new Map(json.result);
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
  /** @type {Errors} */
  const errors = { ambiguous: new Map(), notFound: new Map() };

  for (let i = 0, l = elems.length; i < l; i++) {
    if (elems[i].closest("[data-no-xref]")) continue;

    const elem = elems[i];
    const query = queryKeys[i];

    const { id } = query;
    const results = data.get(id);
    if (results.length === 1) {
      addDataCite(elem, query, results[0], conf);
    } else {
      const collector = errors[results.length === 0 ? "notFound" : "ambiguous"];
      if (!collector.has(id)) {
        collector.set(id, { elems: [], results, query });
      }
      collector.get(id).elems.push(elem);
    }
  }

  showErrors(errors);
}

/**
 * @param {HTMLElement} elem
 * @param {RequestEntry} query
 * @param {SearchResultEntry} result
 * @param {any} conf
 */
function addDataCite(elem, query, result, conf) {
  const { term, specs = [] } = query;
  const { uri, shortname, spec, normative, type, for: forContext } = result;
  // if authored spec context had `result.spec`, use it instead of shortname
  const cite = specs.flat().includes(spec) ? spec : shortname;
  // we use this "partial" URL to resolve parts of urls...
  // but sometimes we get lucky and we get an absolute URL from xref
  // which we can then use in other places (e.g., data-cite.js)
  const url = new URL(uri, "https://partial");
  const { pathname: citePath } = url;
  const citeFrag = url.hash.slice(1);
  const dataset = { cite, citePath, citeFrag, type };
  if (forContext) dataset.linkFor = forContext[0];
  if (url.origin && url.origin !== "https://partial") {
    dataset.citeHref = url.href;
  }
  Object.assign(elem.dataset, dataset);

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

  const msg = `Normative reference to "${term}" found but term is defined "informatively" in "${cite}".`;
  const title = "Normative reference to non-normative term.";
  showWarning(msg, name, { title, elements: [elem] });
}

/** @param {Errors} errors */
function showErrors({ ambiguous, notFound }) {
  const getPrefilledFormURL = (term, query, specs = []) => {
    const url = new URL(API_URL);
    url.searchParams.set("term", term);
    if (query.for) url.searchParams.set("for", query.for);
    url.searchParams.set("types", query.types.join(","));
    if (specs.length) url.searchParams.set("specs", specs.join(","));
    return url.href;
  };

  const howToFix = (howToCiteURL, originalTerm) => {
    return docLink`
    [See search matches for "${originalTerm}"](${howToCiteURL}) or
    ${"[Learn about this error|#error-term-not-found]"}.`;
  };

  for (const { query, elems } of notFound.values()) {
    const specs = query.specs ? [...new Set(query.specs.flat())].sort() : [];
    const originalTerm = getTermFromElement(elems[0]);
    const formUrl = getPrefilledFormURL(originalTerm, query);
    const specsString = joinAnd(specs, s => `**[${s}]**`);
    const hint = howToFix(formUrl, originalTerm);
    const forParent = query.for ? `, for **"${query.for}"**, ` : "";
    const msg = `Couldn't find "**${originalTerm}**"${forParent} in this document or other cited documents: ${specsString}.`;
    const title = "No matching definition found.";
    showError(msg, name, { title, elements: elems, hint });
  }

  for (const { query, elems, results } of ambiguous.values()) {
    const specs = [...new Set(results.map(entry => entry.shortname))].sort();
    const specsString = joinAnd(specs, s => `**[${s}]**`);
    const originalTerm = getTermFromElement(elems[0]);
    const formUrl = getPrefilledFormURL(originalTerm, query, specs);
    const forParent = query.for ? `, for **"${query.for}"**, ` : "";
    const moreInfo = howToFix(formUrl, originalTerm);
    const hint = docLink`To fix, use the ${"[data-cite]"} attribute to pick the one you mean from the appropriate specification. ${moreInfo}.`;
    const msg = `The term "**${originalTerm}**"${forParent} is ambiguous because it's defined in ${specsString}.`;
    const title = "Definition is ambiguous.";
    showError(msg, name, { title, elements: elems, hint });
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

function cleanup(doc) {
  const elems = doc.querySelectorAll(
    "a[data-xref-for], a[data-xref-type], a[data-link-for]"
  );
  const attrToRemove = ["data-xref-for", "data-xref-type", "data-link-for"];
  elems.forEach(el => {
    attrToRemove.forEach(attr => el.removeAttribute(attr));
  });
}
