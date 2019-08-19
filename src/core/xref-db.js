// @ts-check
import { API_URL } from "./xref.js";
import { IDBKeyVal } from "./utils.js";
import { importIdb } from "./idb.js";

/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 */

const VERSION_CHECK_WAIT = 5 * 60 * 60 * 1000; // 5 min

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
  try {
    const cache = await getIdbCache();
    return await resolveFromCache(uniqueQueryKeys, cache);
  } catch (err) {
    console.error(err);
    return new Map();
  }
}

/**
 * @param {RequestEntry[]} keys
 * @param {IDBKeyVal} cache
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function resolveFromCache(keys, cache) {
  const cacheTime = await cache.get("__CACHE_TIME__");
  const bustCache = cacheTime && (await isBustedCache(cacheTime));
  if (bustCache) {
    await cache.clear();
    return new Map();
  }

  const cachedData = await cache.getMany(keys.map(key => key.id));
  return new Map(cachedData);
}

/**
 * Get last updated timestamp from server and bust cache based on that. This way, we
 * prevent dirty/erroneous/stale data being kept on a client (which is possible
 * if we use a `MAX_AGE` based caching strategy).
 * @param {number} cachedTime
 */
async function isBustedCache(cachedTime) {
  if (Date.now() - cachedTime < VERSION_CHECK_WAIT) {
    // avoid checking network for any data update if old cache "fresh"
    return false;
  }

  const url = new URL("meta/versions", API_URL);
  const res = await fetch(url);
  if (!res.ok) return false;
  const lastUpdated = await res.text();
  return parseInt(lastUpdated, 10) > cachedTime;
}

/**
 * @param {Map<string, SearchResultEntry[]>} data
 */
export async function cacheXrefData(data) {
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
  try {
    const cache = await getIdbCache();
    await cache.clear();
  } catch (e) {
    console.error(e);
  }
}
