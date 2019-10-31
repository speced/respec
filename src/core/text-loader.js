/**
 * @param {string} path
 */
export async function fetchBase(path) {
  if (typeof fetch === "function") {
    const response = await fetch(new URL(`../../${path}`, import.meta.url));
    return await response.text();
  } else {
    const loader = await import("./asset-loader.js");
    return loader.loadAssetOnNode("examples.css");
  }
}

/**
 * @param {string} fileName
 */
export async function fetchAsset(fileName) {
  return fetchBase(`assets/${fileName}`);
}
