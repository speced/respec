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

const xrefData = {
  lastVersionCheck: 0,
  /**
   * @type {Map<string, TemporaryXrefCache>}
   */
  map: new Map(),
};
const hasIndexedDB = typeof indexedDB !== "undefined";
const VERSION_CHECK_WAIT = 5 * 60 * 60 * 1000; // 5 min
const API_URL = "https://respec.org/xref/";

const cacheBuster = {
  async getLastVersionCheck() {
    if (hasIndexedDB) {
      const cache = await getIdbCache();
      cache.get("__LAST_VERSION_CHECK__");
    } else {
      return xrefData.lastVersionCheck;
    }
  },
  /**
   * @param {number} time
   */
  async setLastVersionCheck(time) {
    if (hasIndexedDB) {
      const cache = await getIdbCache();
      cache.set("__LAST_VERSION_CHECK__", time);
    } else {
      xrefData.lastVersionCheck = time;
    }
  },
  /**
   * Get last updated timestamp from server and bust cache based on that. This
   * way, we prevent dirty/erroneous/stale data being kept on a client (which is
   * possible if we use a `MAX_AGE` based caching strategy).
   */
  async shouldRun() {
    const lastChecked = await this.getLastVersionCheck();
    const now = Date.now();

    if (!lastChecked) {
      await this.setLastVersionCheck(now);
      return false;
    }
    if (now - lastChecked < VERSION_CHECK_WAIT) {
      // avoid checking network for any data update if old cache "fresh"
      return false;
    }

    const lastUpdated = await getRemoteLastUpdatedTime();
    if (!lastUpdated) {
      return false;
    }
    await this.setLastVersionCheck(now);
    return parseInt(lastUpdated, 10) > lastChecked;
  },
};

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
async function resolveFromMap(uniqueQueryKeys) {
  const bustCache = await cacheBuster.shouldRun();
  if (bustCache) {
    xrefData.map.clear();
  }
  /** @type {[string, SearchResultEntry[]][]} */
  const entries = [];
  for (const uniqueQueryKey of uniqueQueryKeys) {
    if (xrefData.map.has(uniqueQueryKey.id)) {
      const cached = xrefData.map.get(uniqueQueryKey.id);
      entries.push([uniqueQueryKey.id, cached.data]);
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
  const bustCache = await cacheBuster.shouldRun();
  if (bustCache) {
    await cache.clear();
    return new Map();
  }

  const cachedData = await cache.getMany(keys.map(key => key.id));
  return new Map(cachedData);
}

async function getRemoteLastUpdatedTime() {
  const url = new URL("meta/version", API_URL).href;
  const res = await fetch(url);
  if (res.ok) {
    return await res.text();
  }
}

/**
 * @param {Map<string, SearchResultEntry[]>} data
 */
export async function cacheXrefData(data) {
  if (!hasIndexedDB) {
    const dateNow = Date.now();
    for (const [key, value] of data) {
      xrefData.map.set(key, {
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
  } catch (e) {
    console.error(e);
  }
}

export async function clearXrefData() {
  if (!hasIndexedDB) {
    xrefData.map.clear();
    return;
  }
  try {
    const cache = await getIdbCache();
    await cache.clear();
  } catch (e) {
    console.error(e);
  }
}
