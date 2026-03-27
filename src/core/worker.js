// @ts-check
/**
 * Module core/worker
 *
 * Exports a Web Worker for ReSpec, allowing for
 * multi-threaded processing of things.
 */
export const name = "core/worker";

// Opportunistically preload syntax highlighter, which is used by the worker
import { createResourceHint } from "./utils.js";
import { expose } from "./expose-modules.js";
import { fetchBase } from "./text-loader.js";

// Derive the highlight URL from the ReSpec bundle location. In the IIFE bundle,
// import.meta.url resolves to the script element's src (captured at load time).
const highlightHref = new URL("respec-highlight.js", import.meta.url).href;

/** @type ResourceHintOption */
const hint = {
  hint: "preload",
  href: highlightHref,
  as: "script",
};
const link = createResourceHint(hint);
document.head.appendChild(link);

async function loadWorkerScript() {
  try {
    return (await import("text!../../worker/respec-worker.js")).default;
  } catch {
    return fetchBase("worker/respec-worker.js");
  }
}

/**
 * Fetch the highlight script in the main thread so it can be inlined directly
 * into the worker blob. This avoids importScripts() from a blob worker, which
 * Firefox blocks for cross-origin URLs in some environments.
 * Falls back to injecting the URL for importScripts() if the fetch fails
 * (e.g. cross-origin without CORS headers in production).
 */
async function fetchHighlightScript() {
  try {
    const response = await fetch(highlightHref);
    if (response.ok) return await response.text();
  } catch {
    // Network unavailable or CORS error — fall back to URL injection
  }
  return null;
}

async function createWorker() {
  const [workerScript, highlightScript] = await Promise.all([
    loadWorkerScript(),
    fetchHighlightScript(),
  ]);

  // If we fetched the script, inline it directly (no importScripts needed).
  // Otherwise inject the URL so the worker can importScripts() it.
  const preamble =
    highlightScript !== null
      ? `${highlightScript}\n`
      : `self.RESPEC_HIGHLIGHT_URL = ${JSON.stringify(highlightHref)};\n`;

  const blob = new Blob([preamble, workerScript], {
    type: "application/javascript",
  });
  return new Worker(URL.createObjectURL(blob));
}

export const workerPromise = createWorker();

expose(
  name,
  workerPromise.then(worker => ({ worker }))
);
