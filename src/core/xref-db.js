// @ts-check
import { IDBKeyVal } from "./utils.js";

/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 */

const CACHE_MAX_AGE = 86400000; // 24 hours

/**
 * Temporary workaround until browsers get import-maps
 */
async function importIdb() {
  try {
    return await import("idb");
  } catch {
    return await import("../../node_modules/idb/build/esm/index.js");
  }
}

async function getIDBKeyValForXref() {
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
    const cache = await getIDBKeyValForXref();
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
  const cache = await getIDBKeyValForXref();
  // add data to cache
  await cache.addMany(data);
  await cache.set("__CACHE_TIME__", Date.now());
}

export async function clearXrefData() {
  const cache = await getIDBKeyValForXref();
  await cache.clear();
}
