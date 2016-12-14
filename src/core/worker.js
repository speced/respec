/**
 * Module core/worker
 *
 * Exports a Web Worker for ReSpec, allowing for
 * multi-threaded processing of things.
 */

// Only shipping ReSpec has a version
const url = (typeof window.respecVersion === "undefined" || window.respecVersion === "Developer Edition")
  ? "/worker/respec-worker.js"
  : "https://www.w3.org/Tools/respec/respec-worker";
export const worker = new Worker(url);
