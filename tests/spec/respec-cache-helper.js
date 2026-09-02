"use strict";

const WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Awaited by anything that reads or writes the cache, so nothing can seed an
 * entry this wipe is about to delete.
 *
 * A run pointed at a local service stores that service's responses under the
 * production URL for 24 hours, so a later run against production would read
 * them back and report a pass on bytes production never sent.
 */
export const cachesCleared = (async () => {
  const names = await caches.keys();
  await Promise.all(names.map(name => caches.delete(name)));
})();

/**
 * Pre-seeds the browser Cache API so fetchAndCache() returns cached
 * data without hitting the network. Works for any respec.org endpoint.
 *
 * @param {Record<string, {status?: number, body: any}>} entries
 *   Keys are full URLs, values have optional status (default 200)
 *   and a body (object for JSON, string for text).
 */
export async function seedCache(entries) {
  // A seeded response answers fetchAndCache before it ever calls fetch, so
  // seeding during a redirected run would leave the local service unasked and
  // the suite green whatever that service does.
  if (Object.keys(globalThis.__karma__?.config?.serviceOrigins ?? {}).length) {
    return;
  }
  await cachesCleared;
  const byOrigin = new Map();
  for (const [url, entry] of Object.entries(entries)) {
    const origin = new URL(url).origin;
    if (!byOrigin.has(origin)) byOrigin.set(origin, []);
    byOrigin.get(origin).push([url, entry]);
  }
  const expires = new Date(Date.now() + WEEK).toISOString();
  for (const [origin, urls] of byOrigin) {
    const cache = await caches.open(origin);
    for (const [url, { status = 200, body }] of urls) {
      const isJSON = body !== null && typeof body === "object";
      const headers = {
        "Content-Type": isJSON ? "application/json" : "text/plain",
        Expires: expires,
      };
      const responseBody = isJSON ? JSON.stringify(body) : body;
      await cache.put(
        new Request(url),
        new Response(responseBody, { status, headers })
      );
    }
  }
}

let groupsPromise;

/**
 * Seeds the cache with W3C group API responses from tests/data/groups.json.
 * Call from beforeAll() in any test file that uses group: in its config.
 */
export async function seedGroupCache() {
  if (!groupsPromise) {
    groupsPromise = (async () => {
      try {
        const r = await fetch("/tests/data/groups.json");
        if (!r.ok)
          throw new Error(`Failed to load groups fixture: ${r.status}`);
        return await r.json();
      } catch (err) {
        groupsPromise = undefined;
        throw err;
      }
    })();
  }
  await seedCache(await groupsPromise);
}
