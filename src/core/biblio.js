// @ts-check
// Module core/biblio
// Pre-processes bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

/* jshint jquery: true */
import { biblioDB } from "./biblio-db.js";
import { createResourceHint } from "./utils.js";
import { pub } from "./pubsubhub.js";
export const biblio = {};

// for backward compatibity
export { wireReference, stringifyReference } from "./render-biblio.js";

export const name = "core/biblio";

const bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");
const crossrefURL = new URL("https://api.crossref.org/works?filter=");

/**
 * Normative references take precedence over informative ones,
 * so any duplicates ones are removed from the informative set.
 */
function normalizeReferences(conf) {
  const normalizedNormativeRefs = new Set(
    [...conf.normativeReferences].map(key => key.toLowerCase())
  );
  Array.from(conf.informativeReferences)
    .filter(key => normalizedNormativeRefs.has(key.toLowerCase()))
    .forEach(redundantKey => conf.informativeReferences.delete(redundantKey));
}

function getRefKeys(conf) {
  return {
    informativeReferences: Array.from(conf.informativeReferences),
    normativeReferences: Array.from(conf.normativeReferences),
  };
}

// Opportunistically dns-prefetch to bibref server, as we don't know yet
// if we will actually need to download references yet.
const link = createResourceHint({
  hint: "dns-prefetch",
  href: bibrefsURL.origin,
});
document.head.appendChild(link);
let doneResolver;
const done = new Promise(resolve => {
  doneResolver = resolve;
});

/*
 * Fetches a set of references from Specref
 * and / or Crossref, depending on their ids
 * (Crossref ids start with "doi:").
 *
 * Returns a map from reference ids to reference
 * contents.
 */
export async function updateFromNetwork(
  refs,
  options = { forceUpdate: false }
) {
  const refsToFetch = [...new Set(refs)].filter(ref => ref.trim());
  // Split the ids by source
  const specrefIds = refsToFetch.filter(ref => !ref.startsWith("doi:"));
  const crossrefIds = refsToFetch.filter(ref => ref.startsWith("doi:"));

  // Fetch the ids
  const specrefData = await updateFromSpecref(specrefIds, options);
  const crossrefData = await updateFromCrossref(crossrefIds);

  // Store them in the indexed DB
  const data = { ...specrefData, ...crossrefData };
  try {
    await biblioDB.addAll(data);
  } catch (err) {
    console.error(err);
  }
  return data;
}

export async function updateFromCrossref(refsToFetch) {
  if (!refsToFetch.length || navigator.onLine === false) {
    return null;
  }
  let response;
  try {
    response = await fetch(crossrefURL.href + refsToFetch.join(","));
  } catch (err) {
    console.error(err);
    return null;
  }
  const data = await response.json();

  const keyToMetadata = data.message.items.reduce((collector, item) => {
    if (item.DOI) {
      const id = `doi:${item.DOI}`;
      item.id = id;
      delete item.reference;
      collector[id] = item;
    } else {
      console.error("Invalid DOI metadata returned by Crossref");
    }
    return collector;
  }, {});
  return keyToMetadata;
}

export async function updateFromSpecref(
  refsToFetch,
  options = { forceUpdate: false }
) {
  // Update database if needed, if we are online
  if (!refsToFetch.length || navigator.onLine === false) {
    return null;
  }
  let response;
  try {
    response = await fetch(bibrefsURL.href + refsToFetch.join(","));
  } catch (err) {
    console.error(err);
    return null;
  }
  if ((!options.forceUpdate && !response.ok) || response.status !== 200) {
    return null;
  }
  const data = await response.json();
  return data;
}

/**
 * @param {string} key
 */
export async function resolveRef(key) {
  const biblio = await done;
  if (!biblio.hasOwnProperty(key)) {
    return null;
  }
  const entry = biblio[key];
  if (entry.aliasOf) {
    return await resolveRef(entry.aliasOf);
  }
  return entry;
}

export async function run(conf) {
  const finish = () => {
    doneResolver(conf.biblio);
  };
  if (!conf.localBiblio) {
    conf.localBiblio = {};
  }
  if (conf.biblio) {
    let msg = "Overriding `.biblio` in config. Please use ";
    msg += "`.localBiblio` for custom biblio entries.";
    pub("warn", msg);
  }
  conf.biblio = biblio;
  const localAliases = Array.from(Object.keys(conf.localBiblio))
    .filter(key => conf.localBiblio[key].hasOwnProperty("aliasOf"))
    .map(key => conf.localBiblio[key].aliasOf);
  normalizeReferences(conf);
  const allRefs = getRefKeys(conf);
  const neededRefs = allRefs.normativeReferences
    .concat(allRefs.informativeReferences)
    // Filter, as to not go to network for local refs
    .filter(key => !conf.localBiblio.hasOwnProperty(key))
    // but include local aliases, in case they refer to external specs
    .concat(localAliases)
    // remove duplicates
    .reduce((collector, item) => {
      if (collector.indexOf(item) === -1) {
        collector.push(item);
      }
      return collector;
    }, [])
    .sort();
  const idbRefs = [];

  // See if we have them in IDB
  try {
    await biblioDB.ready; // can throw
    const promisesToFind = neededRefs.map(async id => ({
      id,
      data: await biblioDB.find(id),
    }));
    idbRefs.push(...(await Promise.all(promisesToFind)));
  } catch (err) {
    // IndexedDB died, so we need to go to the network for all
    // references
    idbRefs.push(...neededRefs.map(id => ({ id, data: null })));
    console.warn(err);
  }
  const split = { hasData: [], noData: [] };
  idbRefs.forEach(ref => {
    (ref.data ? split.hasData : split.noData).push(ref);
  });
  split.hasData.forEach(ref => {
    biblio[ref.id] = ref.data;
  });
  const externalRefs = split.noData.map(item => item.id);
  if (externalRefs.length) {
    // Going to the network for refs we don't have
    const data = await updateFromNetwork(externalRefs, { forceUpdate: true });
    Object.assign(biblio, data);
  }
  Object.assign(biblio, conf.localBiblio);
  finish();
}
