import { fetchAndCache } from "./utils";

export const name = "core/mdn-annoatation";

const SPEC_MAP_URL =
  "https://raw.githubusercontent.com/w3c/mdn-spec-links/master/SPECMAP.json";
const JSON_BASE = "https://w3c.github.io/mdn-spec-links/";

async function fetchAndCacheJson(url, maxAge) {
  if (!url) return {};
  const request = new Request(url);
  const response = await fetchAndCache(request, maxAge);
  const json = await response.json();
  return json;
}

export async function run(conf) {
  const { shortName, mdnAnnotation } = conf;
  if (!shortName) {
    // Nothing to do if shortName is not provided
    return;
  }
  const maxAge = (mdnAnnotation && mdnAnnotation.maxAge) || 60 * 60 * 24 * 1000;
  const specMap = await fetchAndCacheJson(SPEC_MAP_URL, maxAge);
  const hasSpecJson = Object.values(specMap).some(
    jsonName => jsonName === `${shortName}.json`
  );
  if (!hasSpecJson) {
    return;
  }
  await fetchAndCacheJson(`${JSON_BASE}/${shortName}.json`, maxAge);

  // TODO: parse the doc and look for keys in the mdn spec json
}
