// @ts-check
import { IDBKeyVal } from "./utils.js";
import { importIdb } from "./idb.js";

/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 *
 * @typedef {object} TemporaryXrefCache
 * @property {number} cachedTime
 * @property {SearchResultEntry[]} data
 */

const CACHE_MAX_AGE = 86400000; // 24 hours
/**
 * @type {Map<string, TemporaryXrefCache>}
 */
const xrefMap = new Map();

const hasIndexedDB = typeof indexedDB !== "undefined";

async function getIdbCache() {
  const { openDB } = await importIdb();
  const idb = await openDB("xref", 1, {
    upgrade(db) {
      db.createObjectStore("xrefs");
    },
  });
  return new IDBKeyVal(idb, "xrefs");
}

/**
 * @param {RequestEntry[]} uniqueQueryKeys
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
export async function resolveXrefCache(uniqueQueryKeys) {
  if (!hasIndexedDB) {
    return resolveFromMap(uniqueQueryKeys);
  }
  try {
    const cache = await getIdbCache();
    return await resolveFromCache(uniqueQueryKeys, cache);
  } catch (err) {
    console.error(err);
    return new Map();
  }
}

/**
 * @param {RequestEntry[]} uniqueQueryKeys
 */
function resolveFromMap(uniqueQueryKeys) {
  /** @type {[string, SearchResultEntry[]][]} */
  const entries = [];
  for (const uniqueQueryKey of uniqueQueryKeys) {
    if (xrefMap.has(uniqueQueryKey.id)) {
      const cached = xrefMap.get(uniqueQueryKey.id);
      if (!isBustedCache(cached.cachedTime)) {
        entries.push([uniqueQueryKey.id, cached.data]);
      }
    }
  }
  return new Map(entries);
}

/**
 * @param {RequestEntry[]} keys
 * @param {IDBKeyVal} cache
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function resolveFromCache(keys, cache) {
  const cacheTime = await cache.get("__CACHE_TIME__");
  const bustCache = cacheTime && isBustedCache(cacheTime);
  if (bustCache) {
    await cache.clear();
    return new Map();
  }

  const cachedData = await cache.getMany(keys.map(key => key.id));
  return new Map(cachedData);
}

/**
 * @param {number} cachedTime
 */
function isBustedCache(cachedTime) {
  return Date.now() - cachedTime > CACHE_MAX_AGE;
}

/**
 * @param {Map<string, SearchResultEntry[]>} data
 */
export async function cacheXrefData(data) {
  if (!hasIndexedDB) {
    const dateNow = Date.now();
    for (const [key, value] of data) {
      xrefMap.set(key, {
        cachedTime: dateNow,
        data: value,
      });
    }
    return;
  }
  try {
    const cache = await getIdbCache();
    // add data to cache
    await cache.addMany(data);
    await cache.set("__CACHE_TIME__", Date.now());
  } catch (e) {
    console.error(e);
  }
}

export async function clearXrefData() {
  if (!hasIndexedDB) {
    xrefMap.clear();
    return;
  }
  try {
    const cache = await getIdbCache();
    await cache.clear();
  } catch (e) {
    console.error(e);
  }
}
