// Module core/biblio
// Pre-processes bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

/* jshint jquery: true */
import { biblioDB } from "./biblio-db.js";
import { createResourceHint } from "./utils.js";
import fetch from "./fetch.js";
import { pub } from "./pubsubhub.js";

// for backward compatibity
export { wireReference, stringifyReference } from "./render-biblio.js";

export const name = "core/biblio";

export class Biblio {
  constructor() {
    this.finished = new Promise(resolve => (this.finish = resolve));
    /** @type {Record<string, *>} */
    this.map = {};
  }

  /**
   * @param {string} key
   */
  async resolveRef(key) {
    await this.finished;
    if (!this.map.hasOwnProperty(key)) {
      return null;
    }
    const entry = this.map[key];
    if (entry.aliasOf) {
      return await this.resolveRef(entry.aliasOf);
    }
    return entry;
  }
}

const bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");

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

/**
 * @param {Document} document
 */
function insertResourceHint(document) {
  const link = createResourceHint(
    {
      hint: "dns-prefetch",
      href: bibrefsURL.origin,
    },
    document
  );
  document.head.appendChild(link);
  return link;
}

// Opportunistically dns-prefetch to bibref server, as we don't know yet
// if we will actually need to download references yet.
const linkElement =
  typeof document !== "undefined" ? insertResourceHint(document) : undefined;

export async function updateFromNetwork(
  refs,
  options = { forceUpdate: false }
) {
  const refsToFetch = [...new Set(refs)].filter(ref => ref.trim());
  // Update database if needed, if we are online
  const offline = typeof navigator !== "undefined" && !navigator.onLine;
  if (!refsToFetch.length || offline) {
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
  try {
    await biblioDB.addAll(data);
  } catch (err) {
    console.error(err);
  }
  return data;
}

/**
 * @param {import("../respec-document.js").RespecDocument} respecDoc
 */
export default async function({ document, configuration: conf, biblio }) {
  if (!linkElement) {
    insertResourceHint(document);
  }
  if (!conf.localBiblio) {
    conf.localBiblio = {};
  }
  if (conf.biblio) {
    let msg = "Overriding `.biblio` in config. Please use ";
    msg += "`.localBiblio` for custom biblio entries.";
    pub("warn", msg);
  }
  conf.biblio = biblio.map;
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
    biblio.map[ref.id] = ref.data;
  });
  const externalRefs = split.noData.map(item => item.id);
  if (externalRefs.length) {
    // Going to the network for refs we don't have
    const data = await updateFromNetwork(externalRefs, { forceUpdate: true });
    Object.assign(biblio.map, data);
  }
  Object.assign(biblio.map, conf.localBiblio);
  await updateFromNetwork(neededRefs);
  biblio.finish();
}
