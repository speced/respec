// @ts-check
import { API_URL } from "./xref.js";
import { IDBKeyVal } from "./utils.js";
import { idb } from "./import-maps.js";

/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 */

const VERSION_CHECK_WAIT = 5 * 60 * 1000; // 5 min

async function getIdbCache() {
  const db = await idb.openDB("xref", 1, {
    upgrade(db) {
      db.createObjectStore("xrefs");
    },
  });
  return new IDBKeyVal(db, "xrefs");
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
  const bustCache = await shouldBustCache(cache);
  if (bustCache) {
    await cache.clear();
    return new Map();
  }

  const cachedData = await cache.getMany(keys.map(key => key.id));
  return cachedData;
}

/**
 * Get last updated timestamp from server and bust cache based on that. This
 * way, we prevent dirty/erroneous/stale data being kept on a client (which is
 * possible if we use a `MAX_AGE` based caching strategy).
 * @param {IDBKeyVal} cache
 */
async function shouldBustCache(cache) {
  const lastChecked = await cache.get("__LAST_VERSION_CHECK__");
  const now = Date.now();

  if (!lastChecked) {
    await cache.set("__LAST_VERSION_CHECK__", now);
    return false;
  }
  if (now - lastChecked < VERSION_CHECK_WAIT) {
    // avoid checking network for any data update if old cache "fresh"
    return false;
  }

  const url = new URL("meta/version", API_URL).href;
  const res = await fetch(url);
  if (!res.ok) return false;
  const lastUpdated = await res.text();
  await cache.set("__LAST_VERSION_CHECK__", now);
  return parseInt(lastUpdated, 10) > lastChecked;
}

/**
 * @param {Map<string, SearchResultEntry[]>} data
 */
export async function cacheXrefData(data) {
  try {
    const cache = await getIdbCache();
    // add data to cache
    await cache.addMany(data);
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
