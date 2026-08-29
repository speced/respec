// A module worker, so the rewriting rule lives in one file rather than a copy
// here: a classic worker's `importScripts` would resolve against this script's
// root path and 404, which fails installation.
import { rewriteServiceUrl } from "/spec/service-origin-rewrite.js";

/** @type {Map<string, string>} origin -> replacement origin */
let origins = new Map();

/** @type {string[]} */
const redirects = [];

self.addEventListener("install", () => self.skipWaiting());

// claim() is what puts this worker in front of the srcdoc iframes each spec
// creates: they never navigate, so nothing else would ever control them.
self.addEventListener("activate", event =>
  event.waitUntil(self.clients.claim())
);

self.addEventListener("message", event => {
  const [port] = event.ports;
  switch (event.data?.type) {
    case "configure":
      origins = new Map(event.data.origins);
      redirects.length = 0;
      port?.postMessage({ ok: true });
      break;
    case "report":
      port?.postMessage({ redirects: [...redirects] });
      break;
  }
});

self.addEventListener("fetch", event => {
  const target = rewriteServiceUrl(event.request.url, origins);
  // Everything the suite loads comes through here, so anything unmapped must
  // fall through to the browser untouched.
  if (target === event.request.url) return;
  redirects.push(target);
  event.respondWith(forward(event.request, target));
});

/**
 * Sends `request` to `url` instead, keeping its method, headers and body.
 *
 * @param {Request} request
 * @param {string} url
 */
async function forward(request, url) {
  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.blob();
  try {
    return await fetch(url, {
      method: request.method,
      headers: request.headers,
      body,
    });
  } catch (error) {
    // A 502 keeps a service that is not running on ReSpec's own "response was
    // not ok" path. Rejecting instead surfaces as an unhandled rejection in a
    // child iframe, which no spec can see.
    return new Response(`${url} did not respond: ${error.message}`, {
      status: 502,
    });
  }
}
