/** @type {Window["fetch"]} */
export default async function(...args) {
  if (typeof fetch !== "undefined") {
    return fetch(...args);
  }
  return (await import("node-fetch")).default(...args);
}
