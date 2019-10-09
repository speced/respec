// @ts-check
/**
 * Temporary workaround until browsers get import-maps
 * @returns {Promise<import("idb")>}
 */
export async function importIdb() {
  try {
    return await import("idb");
  } catch {
    return await import("../../node_modules/idb/build/esm/index.js");
  }
}
