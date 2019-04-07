/**
 * Module core/worker
 *
 * Exports a Web Worker for ReSpec, allowing for
 * multi-threaded processing of things.
 */
export const name = "core/worker";

import { createResourceHint } from "./utils";
import { expose } from "./expose-modules";

// Opportunistically preload syntax highlighter
const hint = {
  hint: "preload",
  href: "https://www.w3.org/Tools/respec/respec-highlight.js",
  as: "script",
};
const link = createResourceHint(hint);
document.head.appendChild(link);

async function loadWorkerScript() {
  try {
    return (await import("text!../../assets/respec-worker.js")).default;
  } catch {
    const res = await fetch(
      new URL("../../assets/respec-worker.js", import.meta.url)
    );
    return await res.text();
  }
}

async function createWorker() {
  const workerScript = await loadWorkerScript();
  const workerURL = URL.createObjectURL(
    new Blob([workerScript], { type: "application/javascript" })
  );
  const worker = new Worker(workerURL);
  expose(name, { worker });
  return worker;
}

export const workerPromise = createWorker();
