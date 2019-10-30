/**
 * @param {string} path
 */
export async function fetchBase(path) {
  const response = await fetch(new URL(`../../${path}`, import.meta.url));
  return await response.text();
}

/**
 * @param {string} fileName
 */
export async function fetchAsset(fileName) {
  return fetchBase(`assets/${fileName}`);
}
