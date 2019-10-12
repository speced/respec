// @ts-check
/**
 * This Module adds a `respecIsReady` property to the document object.
 * The property returns a promise that settles when ReSpec finishes
 * processing the document.
 */
import { sub } from "./pubsubhub.js";
export const name = "core/respec-ready";

/** @type {Promise<void>} */
const respecDonePromise = new Promise(resolve => {
  sub("end-all", resolve, { once: true });
});

Object.defineProperty(document, "respecIsReady", {
  get() {
    return respecDonePromise;
  },
});
