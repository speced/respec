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

// Derive the highlight URL from the ReSpec bundle location so tests can load
// it locally instead of always fetching from www.w3.org. In the IIFE bundle,
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

async function createWorker() {
  const workerScript = await loadWorkerScript();
  // Inject the highlight URL so the worker loads hljs from the same location
  // as the ReSpec bundle rather than always fetching from www.w3.org.
  const blob = new Blob(
    [
      `self.RESPEC_HIGHLIGHT_URL = ${JSON.stringify(highlightHref)};\n`,
      workerScript,
    ],
    { type: "application/javascript" }
  );
  return new Worker(URL.createObjectURL(blob));
}

export const workerPromise = createWorker();

expose(
  name,
  workerPromise.then(worker => ({ worker }))
);
