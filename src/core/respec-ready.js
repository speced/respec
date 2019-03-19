// @ts-check
/**
 * This Module adds a `respecIsReady` property to the document object.
 * The property returns a promise that settles when ReSpec finishes
 * processing the document.
 */
export const name = "core/respec-ready";

/** @type {() => void} */
let resolver;
const respecDonePromise = new Promise(resolve => {
  resolver = resolve;
});

Object.defineProperty(document, "respecIsReady", {
  get() {
    return respecDonePromise;
  },
});

export function resolveAsReady() {
  resolver();
}
