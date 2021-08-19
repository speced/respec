// @ts-check
// Module core/biblio
// Pre-processes bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

import { biblioDB } from "./biblio-db.js";
import { createResourceHint } from "./utils.js";

/** @type {Conf['biblio']} */
export const biblio = {};

export const name = "core/biblio";

const bibrefsURL = new URL("https://api.specref.org/bibrefs?refs=");

// Opportunistically dns-prefetch to bibref server, as we don't know yet
// if we will actually need to download references yet.
const link = createResourceHint({
  hint: "dns-prefetch",
  href: bibrefsURL.origin,
});
document.head.appendChild(link);
let doneResolver;

/** @type {Promise<Conf['biblio']>} */
const done = new Promise(resolve => {
  doneResolver = resolve;
});

export async function updateFromNetwork(
  refs,
  options = { forceUpdate: false }
) {
  const refsToFetch = [...new Set(refs)].filter(ref => ref.trim());
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
  /** @type {Conf['biblio']} */
  const data = await response.json();
  // SpecRef updates every hour, so we should follow suit
  // https://github.com/tobie/specref#hourly-auto-updating
  const oneHourFromNow = Date.now() + 1000 * 60 * 60 * 1;
  try {
    const expires = response.headers.has("Expires")
      ? Math.min(Date.parse(response.headers.get("Expires")), oneHourFromNow)
      : oneHourFromNow;
    await biblioDB.addAll(data, expires);
  } catch (err) {
    console.error(err);
  }
  return data;
}

/**
 * @param {string} key
 * @returns {Promise<BiblioData>}
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

/**
 * @param {string[]} neededRefs
 */
async function getReferencesFromIdb(neededRefs) {
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

  return idbRefs;
}

export class Plugin {
  /** @param {Conf} conf */
  constructor(conf) {
    this.conf = conf;
  }

  /**
   * Normative references take precedence over informative ones,
   * so any duplicates ones are removed from the informative set.
   */
  normalizeReferences() {
    const normalizedNormativeRefs = new Set(
      [...this.conf.normativeReferences].map(key => key.toLowerCase())
    );
    Array.from(this.conf.informativeReferences)
      .filter(key => normalizedNormativeRefs.has(key.toLowerCase()))
      .forEach(redundantKey =>
        this.conf.informativeReferences.delete(redundantKey)
      );
  }

  getRefKeys() {
    return {
      informativeReferences: Array.from(this.conf.informativeReferences),
      normativeReferences: Array.from(this.conf.normativeReferences),
    };
  }

  async run() {
    const finish = () => {
      doneResolver(this.conf.biblio);
    };
    if (!this.conf.localBiblio) {
      this.conf.localBiblio = {};
    }
    this.conf.biblio = biblio;
    const localAliases = Object.keys(this.conf.localBiblio)
      .filter(key => this.conf.localBiblio[key].hasOwnProperty("aliasOf"))
      .map(key => this.conf.localBiblio[key].aliasOf)
      .filter(key => !this.conf.localBiblio.hasOwnProperty(key));
    this.normalizeReferences();
    const allRefs = this.getRefKeys();
    const neededRefs = Array.from(
      new Set(
        allRefs.normativeReferences
          .concat(allRefs.informativeReferences)
          // Filter, as to not go to network for local refs
          .filter(key => !this.conf.localBiblio.hasOwnProperty(key))
          // but include local aliases which refer to external specs
          .concat(localAliases)
          .sort()
      )
    );

    const idbRefs = neededRefs.length
      ? await getReferencesFromIdb(neededRefs)
      : [];
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
    Object.assign(biblio, this.conf.localBiblio);
    finish();
  }
}
