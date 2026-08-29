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
