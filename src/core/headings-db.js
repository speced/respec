// @ts-check
import { idb } from "./import-maps.js";

/**
 * @typedef {import("./headings.js").HeadingInfo} HeadingInfo
 * @typedef {{ query: { spec: string, id: string }, result: HeadingInfo }} HeadingEntry
 * @typedef {import("idb").DBSchema & { headings: { key: string, value: HeadingEntry } }} HeadingsDb
 */

const STORE_NAME = "headings";
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

async function getDb() {
  /** @type {import("idb").IDBPDatabase<HeadingsDb>} */
  const db = await idb.openDB("respec-headings", 1, {
    upgrade(db) {
      [...db.objectStoreNames].forEach(s => db.deleteObjectStore(s));
      db.createObjectStore(STORE_NAME);
    },
  });
  return db;
}

/** @param {{ spec: string, id: string }[]} queries */
export async function resolveHeadingsCache(queries) {
  /** @type {Map<string, HeadingInfo>} */
  const cachedData = new Map();

  if (shouldBustCache()) {
    await clearHeadingsData();
    return cachedData;
  }

  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME);
    for (const query of queries) {
      const key = `${query.spec}#${query.id}`;
      const entry = await tx.store.get(key);
      if (entry) {
        cachedData.set(key, entry.result);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return cachedData;
}

/**
 * @param {{ spec: string, id: string }[]} queries
 * @param {Map<string, HeadingInfo>} results
 */
export async function cacheHeadingsData(queries, results) {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    for (const query of queries) {
      const key = `${query.spec}#${query.id}`;
      const result = results.get(key);
      if (result) {
        tx.objectStore(STORE_NAME).put({ query, result }, key);
      }
    }
    await tx.done;
    localStorage.setItem("HEADINGS:LAST_CACHED", Date.now().toString());
  } catch (e) {
    console.error(e);
  }
}

function shouldBustCache() {
  const lastCached = parseInt(
    localStorage.getItem("HEADINGS:LAST_CACHED") ?? "",
    10
  );
  if (isNaN(lastCached)) return false;
  return Date.now() - lastCached > CACHE_MAX_AGE;
}

export async function clearHeadingsData() {
  try {
    const db = await getDb();
    await db.clear(STORE_NAME);
    localStorage.removeItem("HEADINGS:LAST_CACHED");
  } catch (e) {
    console.error(e);
  }
}
