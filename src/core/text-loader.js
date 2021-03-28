/**
 * @param {string} path
 */
export async function fetchBase(path) {
  const response = await fetch(new URL(`../../${path}`, import.meta.url));
  return await response.text();
}
