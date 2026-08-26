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
 * Installs a `fetch` on `win` that redirects mapped origins, and records what
 * it redirected on `win.__respecRewrittenUrls` so a test can assert the
 * wrapper was active during ReSpec's own run rather than merely present.
 *
 * A no-op when the map is empty, so an unset environment behaves identically.
 *
 * @param {Window} win
 * @param {Record<string, string>} map
 */
export function installFetchRewrite(win, map) {
  if (!map || !Object.keys(map).length) return;
  const original = win.fetch.bind(win);
  win.__respecRewrittenUrls = [];
  win.fetch = (input, init) => {
    if (input instanceof win.Request) {
      const rewritten = rewriteServiceUrl(input.url, map);
      if (rewritten === input.url) return original(input, init);
      win.__respecRewrittenUrls.push(rewritten);
      // Clone-init form, which carries method, headers, mode, credentials,
      // cache and redirect across. ponytail: a Request carrying a body would
      // need `duplex` and throw here, but core/utils.js is the only site that
      // passes a Request and fetchAndCache always builds it as a bodyless GET.
      // Handle the body case only if a caller ever sends one.
      return original(new win.Request(rewritten, input), init);
    }
    const rewritten = rewriteServiceUrl(String(input), map);
    if (rewritten !== String(input)) win.__respecRewrittenUrls.push(rewritten);
    return original(rewritten, init);
  };
}
