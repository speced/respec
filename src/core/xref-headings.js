// @ts-check
/**
 * Module core/xref-headings
 *
 * Resolves cross-spec section heading titles via the respec.org headings API.
 * Used by core/data-cite to populate [[[SPEC#id]]] link text.
 * Caches results in IndexedDB via core/xref-headings-db.
 *
 * @module core/xref-headings
 */
import { cacheHeadingsData, resolveHeadingsCache } from "./xref-headings-db.js";
import { html } from "./import-maps.js";
import { showWarning } from "./utils.js";

export const name = "core/xref-headings";

const HEADINGS_API_URL = "https://respec.org/xref/search/headings";

/**
 * @typedef {{ title: string, number: string | null }} HeadingInfo
 */

/**
 * Fetches heading titles from the respec.org headings API for cross-spec
 * section links ([[[SPEC#id]]] syntax). Returns a Map keyed by "spec#id".
 * Uses IndexedDB cache; falls back to network on cache miss.
 * @param {{ spec: string, id: string }[]} queries
 * @returns {Promise<Map<string, HeadingInfo>>}
 */
export async function fetchHeadingTexts(queries) {
  if (!queries.length) return new Map();

  const cached = await resolveHeadingsCache(queries);
  const uncachedQueries = queries.filter(q => !cached.has(`${q.spec}#${q.id}`));

  if (!uncachedQueries.length) return cached;

  try {
    const res = await fetch(HEADINGS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queries: uncachedQueries }),
    });
    if (!res.ok) {
      const msg = `Failed to fetch heading texts (HTTP ${res.status}).`;
      const hint = "Cross-spec section links will fall back to spec titles.";
      showWarning(msg, name, { hint });
      return cached;
    }
    const { result = [] } = await res.json();
    /** @type {Map<string, HeadingInfo>} */
    const fetched = new Map();
    for (const entry of result) {
      if (!entry.error) {
        fetched.set(`${entry.spec}#${entry.id}`, {
          title: entry.title,
          number: entry.number || null,
        });
      }
    }
    await cacheHeadingsData(uncachedQueries, fetched);
    return new Map([...cached, ...fetched]);
  } catch {
    const msg = "Failed to fetch heading texts from respec.org.";
    const hint = "Cross-spec section links will fall back to spec titles.";
    showWarning(msg, name, { hint });
    return cached;
  }
}

/**
 * Sets heading content on an element using proper secno markup.
 * When a section number is available, produces `<bdi class="secno">N </bdi>Title`.
 * @param {HTMLElement} elem
 * @param {HeadingInfo} heading
 */
export function setHeadingContent(elem, { title, number }) {
  if (number) {
    elem.append(html`<bdi class="secno">${number} </bdi>`, title);
  } else {
    elem.textContent = title;
  }
}
