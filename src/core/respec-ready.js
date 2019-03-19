/**
 * This Module adds a `respecIsReady` property to the document object.
 * The property returns a promise that settles when ReSpec finishes
 * processing the document.
 */
import { sub } from "./pubsubhub";
export const name = "core/respec-ready";

const respecDonePromise = new Promise(resolve => {
  sub("end-all", resolve, { once: true });
});

Object.defineProperty(document, "respecIsReady", {
  get() {
    return respecDonePromise;
  },
});
