/**
 * Module core/worker
 *
 * Exports a Web Worker for ReSpec, allowing for
 * multi-threaded processing of things.
 */

// Opportunistically preload syntax highlighter, which is used by the worker
import utils from "core/utils";
// Opportunistically preload syntax highlighter
const hint = {
  hint: "preload",
  href: "https://www.w3.org/Tools/respec/respec-highlight.js",
  as: "script",
};
const link = utils.createResourceHint(hint);
document.head.appendChild(link);

// Only shipping ReSpec has a version
const url = (typeof window.respecVersion === "undefined" || window.respecVersion === "Developer Edition")
  ? "/worker/respec-worker.js"
  : "https://www.w3.org/Tools/respec/respec-worker";

export const worker = new Worker(url);
