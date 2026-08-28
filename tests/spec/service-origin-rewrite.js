"use strict";

/**
 * Rewrites `url` when its origin appears in `origins`, preserving path, query
 * and hash. Returns anything unmapped, or not absolute, untouched.
 *
 * @param {string} url
 * @param {Map<string, string>} origins origin -> replacement origin
 * @returns {string}
 */
export function rewriteServiceUrl(url, origins) {
  if (!URL.canParse(url)) return url;
  const parsed = new URL(url);
  const replacement = origins.get(parsed.origin);
  if (!replacement) return url;
  return new URL(
    `${parsed.pathname}${parsed.search}${parsed.hash}`,
    replacement
  ).href;
}

/**
 * Throws unless every replacement parses as an http or https URL. Only its
 * scheme and host get used, so a path, query or fragment is ignored.
 *
 * @param {Map<string, string>} origins
 */
export function validateServiceOrigins(origins) {
  for (const [from, to] of origins) {
    if (!URL.canParse(to)) {
      throw new Error(
        `Service origin for ${from} is not a valid URL: "${to}". Expected an origin like http://localhost:8000.`
      );
    }
    if (!["http:", "https:"].includes(new URL(to).protocol)) {
      throw new Error(
        `Service origin for ${from} needs an http:// or https:// prefix, got "${to}".`
      );
    }
  }
}

/**
 * Installs a `fetch` on `targetWindow` that redirects mapped origins, appending
 * each rewritten URL to `targetWindow.__respecRewrittenUrls`.
 *
 * Does not reach the highlight worker, which has its own global scope.
 *
 * @param {Window} targetWindow
 * @param {Map<string, string>} origins
 */
export function installFetchRewrite(targetWindow, origins) {
  if (!origins?.size) return;
  validateServiceOrigins(origins);
  const original = targetWindow.fetch.bind(targetWindow);
  targetWindow.__respecRewrittenUrls = [];
  // The real Cache API cannot stay: fetchAndCache in core/utils.js keys it on the
  // pre-rewrite origin, so a seeded entry answers before it calls fetch, and a
  // local response lands under the production key for 24 hours.
  const alwaysMiss = {
    async open() {
      return {
        async match() {},
        async put() {},
      };
    },
  };
  Object.defineProperty(targetWindow, "caches", {
    configurable: true,
    value: alwaysMiss,
  });
  targetWindow.fetch = (input, init) => {
    const isRequest = input instanceof targetWindow.Request;
    const url = isRequest ? input.url : String(input);
    const rewritten = rewriteServiceUrl(url, origins);
    if (rewritten === url) return original(input, init);
    const next = isRequest
      ? new targetWindow.Request(rewritten, input)
      : rewritten;
    targetWindow.__respecRewrittenUrls.push(rewritten);
    return original(next, init);
  };
}
