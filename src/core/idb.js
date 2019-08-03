/**
 * Temporary workaround until browsers get import-maps
 */
export async function importIdb() {
  try {
    return await import("idb");
  } catch {
    return await import("../../node_modules/idb/build/esm/index.js");
  }
}
