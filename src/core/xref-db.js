// @ts-check
import { API_URL } from "./xref.js";
import { idb } from "./import-maps.js";

/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 * @typedef {import('core/xref').XrefDatabase} XrefDatabase
 */

const STORE_NAME = "xrefs";
const VERSION_CHECK_WAIT = 5 * 60 * 1000; // 5 min

async function getIdbCache() {
  /** @type {XrefDatabase} */
  const db = await idb.openDB("xref", 2, {
    upgrade(db) {
      [...db.objectStoreNames].forEach(s => db.deleteObjectStore(s));
      const store = db.createObjectStore(STORE_NAME, { keyPath: "query.id" });
      store.createIndex("byTerm", "query.term", { unique: false });
    },
  });
  return db;
}

/** @param {RequestEntry[]} queries */
export async function resolveXrefCache(queries) {
  /** @type {Map<string, SearchResultEntry[]>} */
  const cachedData = new Map();

  const bustCache = await shouldBustCache();
  if (bustCache) {
    await clearXrefData();
    return cachedData;
  }

  const requiredKeySet = new Set(queries.map(query => query.id));
  try {
    const cache = await getIdbCache();
    let cursor = await cache.transaction(STORE_NAME).store.openCursor();
    while (cursor) {
      if (requiredKeySet.has(cursor.key)) {
        cachedData.set(cursor.key, cursor.value.result);
      }
      cursor = await cursor.continue();
    }
  } catch (err) {
    console.error(err);
  }
  return cachedData;
}

/**
 * Get last updated timestamp from server and bust cache based on that. This
 * way, we prevent dirty/erroneous/stale data being kept on a client (which is
 * possible if we use a `MAX_AGE` based caching strategy).
 */
async function shouldBustCache() {
  const key = "XREF:LAST_VERSION_CHECK";
  const lastChecked = parseInt(localStorage.getItem(key), 10);
  const now = Date.now();

  if (!lastChecked) {
    localStorage.setItem(key, now.toString());
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
  localStorage.setItem(key, now.toString());
  return parseInt(lastUpdated, 10) > lastChecked;
}

/**
 * @param {RequestEntry[]} queries
 * @param {Map<string, SearchResultEntry[]>} results
 */
export async function cacheXrefData(queries, results) {
  try {
    const cache = await getIdbCache();
    const tx = cache.transaction(STORE_NAME, "readwrite");
    for (const query of queries) {
      const result = results.get(query.id);
      tx.objectStore(STORE_NAME).add({ query, result });
    }
    await tx.done;
  } catch (e) {
    console.error(e);
  }
}

export async function clearXrefData() {
  try {
    await getIdbCache().then(db => db.clear(STORE_NAME));
  } catch (e) {
    console.error(e);
  }
}
