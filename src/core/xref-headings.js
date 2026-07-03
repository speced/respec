// @ts-check
/**
 * Module core/xref-headings
 *
 * Resolves cross-spec section heading titles via the respec.org headings API.
 * Handles [[[SPEC#id]]] section links: applies alias text (data-lt) or fetches
 * heading titles from the API, and updates element content with proper secno markup.
 * Caches results in IndexedDB via core/xref-headings-db.
 *
 * Configuration:
 *   conf.xref.headingApiUrl {string} — override the headings API URL (useful for testing)
 *
 * @module core/xref-headings
 */
import { cacheHeadingsData, resolveHeadingsCache } from "./xref-headings-db.js";
import { html } from "./import-maps.js";
import { setInlineContent } from "./inlines.js";
import { showWarning } from "./utils.js";

export const name = "core/xref-headings";

export const HEADINGS_API_URL = "https://respec.org/xref/search/headings";

/**
 * @typedef {{ title: string, number: string | null }} HeadingInfo
 * @typedef {{ spec: string, id: string, title: string, number: string | null, error?: boolean }} HeadingApiResultEntry
 */

/**
 * Processes all [[[SPEC#id]]] section links in the document:
 * - Applies alias text (data-lt) when provided by the author
 * - Fetches section heading titles from the headings API for the rest
 * - Falls back to the spec title already set by core/data-cite
 *
 * Must run after core/data-cite (so elements have href and spec-title fallback).
 * @param {Conf} conf
 */
export async function run(conf) {
  // Section links from [[[SPEC#id]]] have both data-cite-frag and data-matched-text set.
  // (data-matched-text is set by inlines.js on all [[[...]]] expansions;
  // data-cite-frag carries the section fragment for the SPEC#id form only.)
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const elems = document.querySelectorAll(
    "a[data-cite-frag][data-matched-text]"
  );
  if (!elems.length) return;

  const apiUrl = getApiUrl(conf);

  /** @type {Map<string, { spec: string, id: string }>} */
  const headingQueries = new Map();
  /** @type {{ elem: HTMLAnchorElement, key: string }[]} */
  const headingElems = [];

  elems.forEach(elem => {
    if (elem.dataset.lt) {
      setInlineContent(elem, elem.dataset.lt);
      delete elem.dataset.lt;
    } else {
      const spec = (elem.dataset.cite ?? "").replace(/^[!?]/, "");
      const id = elem.dataset.citeFrag ?? "";
      const key = `${spec}#${id}`;
      headingElems.push({ elem, key });
      if (!headingQueries.has(key)) {
        headingQueries.set(key, { spec, id });
      }
    }
  });

  if (!headingElems.length) return;

  const headingTexts = await fetchHeadingTexts(
    [...headingQueries.values()],
    apiUrl
  );

  headingElems.forEach(({ elem, key }) => {
    const heading = headingTexts.get(key);
    if (heading?.title) {
      setHeadingContent(elem, heading);
    }
  });
}

/**
 * Returns the headings API URL from conf, falling back to the default.
 * @param {Conf} conf
 * @returns {string}
 */
function getApiUrl(conf) {
  const xrefConf =
    typeof conf.xref === "object" &&
    conf.xref !== null &&
    !Array.isArray(conf.xref)
      ? conf.xref
      : {};
  return typeof xrefConf.headingApiUrl === "string"
    ? xrefConf.headingApiUrl
    : HEADINGS_API_URL;
}

/**
 * Fetches heading titles from the respec.org headings API for cross-spec
 * section links ([[[SPEC#id]]] syntax). Returns a Map keyed by "spec#id".
 * Uses IndexedDB cache; falls back to network on cache miss.
 * @param {{ spec: string, id: string }[]} queries
 * @param {string} [apiUrl] - override the API URL (defaults to HEADINGS_API_URL)
 * @returns {Promise<Map<string, HeadingInfo>>}
 */
export async function fetchHeadingTexts(queries, apiUrl = HEADINGS_API_URL) {
  if (!queries.length) return new Map();

  const cached = await resolveHeadingsCache(queries);
  const uncachedQueries = queries.filter(q => !cached.has(`${q.spec}#${q.id}`));

  if (!uncachedQueries.length) return cached;

  try {
    const res = await fetch(apiUrl, {
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
    const fetched = new Map(
      /** @type {HeadingApiResultEntry[]} */ (result)
        .filter(entry => !entry.error)
        .map(
          entry =>
            /** @type {[string, HeadingInfo]} */ ([
              `${entry.spec}#${entry.id}`,
              { title: entry.title, number: entry.number || null },
            ])
        )
    );
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
 * Prefixes the reference with the "§" section sign (followed by a
 * non-breaking space), matching in-document section links produced by
 * core/anchor-expander. When a section number is available, produces
 * `§\u00A0<bdi class="secno">N </bdi>Title`.
 * @param {HTMLElement} elem
 * @param {HeadingInfo} heading
 */
export function setHeadingContent(elem, { title, number }) {
  elem.classList.add("sec-ref");
  elem.textContent = "";
  elem.append("§\u00A0");
  if (number) {
    elem.append(html`<bdi class="secno">${number} </bdi>`, title);
  } else {
    elem.append(title);
  }
}
