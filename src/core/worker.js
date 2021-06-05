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
// Opportunistically preload syntax highlighter
/** @type ResourceHintOption */
const hint = {
  hint: "preload",
  href: "https://www.w3.org/Tools/respec/respec-highlight",
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
  const workerURL = URL.createObjectURL(
    new Blob([workerScript], { type: "application/javascript" })
  );
  return new Worker(workerURL);
}

export const workerPromise = createWorker();

expose(
  name,
  workerPromise.then(worker => ({ worker }))
);
