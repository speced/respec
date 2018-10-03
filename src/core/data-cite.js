/**
 * Module core/data-cite
 *
 * Allows citing other specifications using
 * anchor elements. Simply add "data-cite"
 * and key of specification.
 *
 * This module simply adds the found key
 * to either conf.normativeReferences
 * or to conf.informativeReferences depending on
 * if it starts with a ! or not.
 *
 * Usage:
 * https://github.com/w3c/respec/wiki/data--cite
 */
import { resolveRef, updateFromNetwork } from "core/biblio";
import { showInlineError, refDetailsFromContext } from "core/utils";
export const name = "core/data-cite";

function requestLookup(conf) {
  const toCiteDetails = citeDetailsConverter(conf);
  return async elem => {
    const originalKey = elem.dataset.cite;
    const { key, frag, path } = toCiteDetails(elem);
    let href = "";
    // This is just referring to this document
    if (key === conf.shortName) {
      href = document.location.href;
    } else {
      // Let's go look it up in spec ref...
      const entry = await resolveRef(key);
      cleanElement(elem);
      if (!entry) {
        showInlineError(elem, `Couldn't find a match for "${originalKey}".`);
        return;
      }
      href = entry.href;
    }
    if (path) {
      href = new URL(path, href).href;
    }
    if (frag) {
      href = new URL(frag, href).href;
    }
    switch (elem.localName) {
      case "a": {
        elem.href = href;
        break;
      }
      case "dfn": {
        const a = elem.ownerDocument.createElement("a");
        a.href = href;
        while (elem.firstChild) {
          a.appendChild(elem.firstChild);
        }
        elem.appendChild(a, elem);
        break;
      }
    }
  };
}

function cleanElement(elem) {
  ["data-cite", "data-cite-frag"]
    .filter(attrName => elem.hasAttribute(attrName))
    .forEach(attrName => elem.removeAttribute(attrName));
}

function makeComponentFinder(component) {
  return key => {
    const position = key.search(component);
    if (position !== -1) {
      return key.substring(position);
    }
    return "";
  };
}

function citeDetailsConverter(conf) {
  const findFrag = makeComponentFinder("#");
  const findPath = makeComponentFinder("/");
  return function toCiteDetails(elem) {
    const { dataset } = elem;
    const { cite: rawKey, citeFrag, citePath } = dataset;
    // The key is a fragment, resolve using the shortName as key
    if (rawKey.startsWith("#") && !citeFrag) {
      // Closes data-cite not starting with "#"
      const closest = elem.parentElement.closest(
        `[data-cite]:not([data-cite^="#"])`
      );
      const { key: parentKey, isNormative: closestIsNormative } = closest
        ? toCiteDetails(closest)
        : { key: conf.shortName || "", isNormative: false };
      dataset.cite = closestIsNormative ? parentKey : `?${parentKey}`;
      dataset.citeFrag = rawKey.replace("#", ""); // the key is acting as fragment
      return toCiteDetails(elem);
    }
    const frag = citeFrag ? "#" + citeFrag : findFrag(rawKey);
    const path = citePath || findPath(rawKey).split("#")[0];
    const { type } = refDetailsFromContext(rawKey, elem);
    const isNormative = type === "normative";
    // key is before "/" and "#" but after "!" or "?"
    const key = rawKey
      .split("/")[0]
      .split("#")[0]
      .substring(/^[?|!]/.test(rawKey));
    const details = { key, isNormative, frag, path };
    return details;
  };
}

export async function run(conf) {
  const toCiteDetails = citeDetailsConverter(conf);
  Array.from(document.querySelectorAll(["dfn[data-cite], a[data-cite]"]))
    .filter(el => el.dataset.cite)
    .map(toCiteDetails)
    .forEach(({ isNormative, key }) => {
      const refSink = isNormative
        ? conf.normativeReferences
        : conf.informativeReferences;
      refSink.add(key);
    });
}

export async function linkInlineCitations(doc, conf = respecConfig) {
  const toLookupRequest = requestLookup(conf);
  const elems = [
    ...doc.querySelectorAll(
      "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
    ),
  ];
  const citeConverter = citeDetailsConverter(conf);

  const promisesForMissingEntries = elems
    .map(citeConverter)
    .map(async entry => {
      const result = await resolveRef(entry);
      return { entry, result };
    });
  const bibEntries = await Promise.all(promisesForMissingEntries);

  const missingBibEntries = bibEntries
    .filter(({ result }) => result === null)
    .map(({ entry: { key } }) => key);

  // we now go to network to fetch missing entries
  const newEntries = await updateFromNetwork(missingBibEntries);
  Object.assign(conf.biblio, newEntries);

  const lookupRequests = elems.map(toLookupRequest);
  return await Promise.all(lookupRequests);
}
