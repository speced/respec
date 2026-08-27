"use strict";

/**
 * Rewrites `url` when its origin appears in `map`, preserving path, query and
 * hash. Anything not in the map, and anything that is not an absolute URL, is
 * returned untouched.
 *
 * @param {string} url
 * @param {Record<string, string>} map origin -> replacement origin
 * @returns {string}
 */
export function rewriteServiceUrl(url, map) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url; // relative, or not a URL at all
  }
  const replacement = map[parsed.origin];
  if (!replacement) return url;
  const to = new URL(replacement);
  parsed.protocol = to.protocol;
  parsed.host = to.host;
  return parsed.href;
}

/**
 * Throws on a replacement origin that would fail silently or fail late.
 *
 * Each of these was reachable from a plausible environment variable value and
 * produced no useful signal: a scheme-less `localhost:8000` parses as scheme
 * `localhost:` so both setters below are ignored and the whole suite quietly
 * runs against production; a value carrying a path has the path dropped, which
 * the `_BASE` naming invites; and an unparseable value throws inside `fetch` on
 * every request, where core/biblio.js and core/worker.js swallow it and it
 * surfaces as missing bibliography rather than as a bad variable.
 *
 * @param {Record<string, string>} map
 */
export function validateServiceOrigins(map) {
  for (const [from, to] of Object.entries(map)) {
    let parsed;
    try {
      parsed = new URL(to);
    } catch {
      throw new Error(
        `Service origin for ${from} is not a URL: "${to}". Include the scheme, e.g. http://localhost:8000`
      );
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(
        `Service origin for ${from} needs an http or https scheme, got "${to}". A value like localhost:8000 parses as scheme "localhost:" and silently redirects nothing.`
      );
    }
    if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
      throw new Error(
        `Service origin for ${from} must be an origin with no path, got "${to}". Only the scheme and host are used, so a path would be dropped without warning.`
      );
    }
  }
}

/**
 * Installs a `fetch` on `win` that redirects mapped origins, and records what
 * it redirected on `win.__respecRewrittenUrls` so a test can assert the wrapper
 * was active during ReSpec's own run rather than merely present.
 *
 * Also takes the HTTP cache out of the picture, which is not optional. Two
 * things in core/utils.js fetchAndCache read and write it under the ORIGINAL
 * origin: a seeded entry answers before `fetch` is reached, so the redirect
 * never happens and nothing reports it, and a response from the local service
 * is written under the production key with a 24 hour expiry, so a later
 * production run is served local bodies. That outlives the test run in a
 * browser with a persistent profile.
 *
 * Reaches only this window. The highlight worker has its own global scope, so
 * anything it fetches is not redirected; nothing under worker/ requests a mapped
 * origin today, but an origin added to the map later would silently escape.
 *
 * @param {Window} win
 * @param {Record<string, string>} map
 */
export function installFetchRewrite(win, map) {
  if (!map || !Object.keys(map).length) return;
  validateServiceOrigins(map);
  const original = win.fetch.bind(win);
  win.__respecRewrittenUrls = [];
  // An always-miss, never-store cache. Setting it to undefined instead would
  // also work, but only via fetchAndCache's catch: `"caches" in window` stays
  // true for an own property, so it enters the branch, throws on `.open`, and
  // logs a console error on every request. This keeps that path quiet and makes
  // "read nothing, write nothing" the stated behavior rather than a side effect.
  Object.defineProperty(win, "caches", {
    configurable: true,
    value: {
      open: () =>
        Promise.resolve({
          match: () => Promise.resolve(undefined),
          put: () => Promise.resolve(undefined),
        }),
    },
  });
  win.fetch = (input, init) => {
    const isRequest = input instanceof win.Request;
    const url = isRequest ? input.url : String(input);
    const rewritten = rewriteServiceUrl(url, map);
    if (rewritten === url) return original(input, init);
    // ponytail: a Request carrying a body would need `duplex` here. core/utils.js
    // is the only site that passes a Request and always builds a bodyless GET,
    // so this is unreachable today; handle it when a caller sends one.
    const next = isRequest ? new win.Request(rewritten, input) : rewritten;
    // Recorded after the clone, so a clone that throws is not reported as a
    // redirect that happened.
    win.__respecRewrittenUrls.push(rewritten);
    return original(next, init);
  };
}
