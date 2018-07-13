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
  const apiURL = xref.url ? new URL(xref.url, location.href) : API_URL;
  if (!(apiURL instanceof URL)) {
    throw new TypeError("respecConfig.xref.url must be a valid URL instance");
  }
  const results = await fetchXrefs(query, apiURL);
  addDataCiteToTerms(query, results, xrefMap, conf);
}

/**
 * maps term to elements and context
 * @param {Array:Elements} elems
 * @returns {Map} term => [ { elem } ]
 */
function createXrefMap(elems) {
  return elems.reduce((map, elem) => {
    let term = elem.dataset.lt
      ? elem.dataset.lt.split("|", 1)[0]
      : elem.textContent;
    term = normalize(term);

    let specs = [];
    const datacite = elem.closest("[data-cite]");
    if (datacite && datacite.dataset.cite) {
      specs = datacite.dataset.cite
        .toLowerCase()
        .replace(/!/g, "")
        .split(/\s+/);
    }
    // if element itself contains data-cite, we don't take inline context into account
    if (datacite !== elem) {
      const refs = [
        ...elem.closest("section").querySelectorAll("a.bibref"),
      ].map(el => el.textContent.toLowerCase());
      specs.push(...refs);
    }

    const xrefsForTerm = map.has(term) ? map.get(term) : [];
    xrefsForTerm.push({ elem, specs });
    return map.set(term, xrefsForTerm);
  }, new Map());
}

/**
 * creates a body for POST request to API
 * @param {Map} xrefs
 * @returns {Object} { keys: [{ term }] }
 */
function createXrefQuery(xrefs) {
  const queryKeys = [...xrefs.entries()].reduce(
    (queryKeys, [term, entries]) => {
      for (const { specs } of entries) {
        queryKeys.add(JSON.stringify({ term, specs })); // only unique
      }
      return queryKeys;
    },
    new Set()
  );
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
 * @param {Object} query query sent to server
 * @param {Object} results parsed JSON results returned from API
 * @param {Map} xrefMap xrefMap
 * @param {Object} conf respecConfig
 */
function addDataCiteToTerms(query, results, xrefMap, conf) {
  for (const [term, entries] of xrefMap) {
    entries.forEach(entry => {
      const result = disambiguate(results[term], entry, term);
      if (!result) return;
      const { elem } = entry;
      const { uri, spec: cite, normative } = result;
      const path = uri.includes("/") ? uri.split("/", 1)[1] : uri;
      const [citePath, citeFrag] = path.split("#");
      const citeObj = { cite, citePath, citeFrag };
      Object.assign(elem.dataset, citeObj);

      // update indirect links (data-lt, data-plurals)
      const indirectLinks = document.querySelectorAll(
        `[data-dfn-type="xref"][data-xref="${term.toLowerCase()}"]`
      );
      indirectLinks.forEach(el => {
        el.removeAttribute("data-xref");
        Object.assign(el.dataset, citeObj);
      });

      // add specs for citation (references section)
      const closestInform = elem.closest(
        ".informative, .note, figure, .example, .issue"
      );
      if (
        closestInform &&
        (!elem.closest(".normative") ||
          !closestInform.querySelector(".normative"))
      ) {
        conf.informativeReferences.add(cite);
      } else {
        if (normative) {
          conf.normativeReferences.add(cite);
        } else {
          const msg =
            `Adding an informative reference to "${term}" from "${cite}" ` +
            "in a normative section";
          const title = "Error: Informative reference in normative section";
          showInlineError(entry.elem, msg, title);
        }
      }
    });
  }
}

// disambiguate fetched results based on context
function disambiguate(fetchedData, context, term) {
  const { elem } = context;
  const specs = context.specs || [];
  const data = (fetchedData || []).filter(entry => {
    return !specs.length || specs.includes(entry.spec);
  });

  if (!data.length) {
    const msg =
      `Couldn't match "**${term}**" to anything in the document or to any other spec. ` +
      "Please provide a [`data-cite`](https://github.com/w3c/respec/wiki/data--cite) attribute for it.";
    const title = "Error: No matching dfn found.";
    if (!elem.dataset.cite) showInlineError(elem, msg, title);
    return null;
  }

  if (data.length === 1) {
    return data[0]; // unambiguous
  }

  const ambiguousSpecs = [...new Set(data.map(e => e.spec))];
  const msg =
    `The term "**${term}**" is defined in ${ambiguousSpecs.length} ` +
    `spec(s) in ${data.length} ways, so it's ambiguous. ` +
    "To disambiguate, you need to add a [`data-cite`](https://github.com/w3c/respec/wiki/data--cite) attribute. " +
    `The specs where it's defined are: ${ambiguousSpecs
      .map(s => `**${s}**`)
      .join(", ")}.`;
  const title = "Error: Linking an ambiguous dfn.";
  showInlineError(elem, msg, title);
  return null;
}
