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
import { showInlineError } from "core/utils";
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

function citeDetailsConverter(conf) {
  return function toCiteDetails(elem) {
    const { dataset } = elem;
    let { cite: key, citeFrag: frag, citePath: path } = dataset;
    const isNormative = key.startsWith("!");
    const pathPosition = key.search("/");
    const fragPosition = key.search("#");
    // The key is a fragment, resolve using the shortName as key
    if (key.startsWith("#") && !frag) {
      // Closes data-cite not starting with "#"
      const closest = elem.parentElement.closest(
        `[data-cite]:not([data-cite^="#"])`
      );
      const { key: parentKey, isNormative: closestIsNormative } = closest
        ? toCiteDetails(closest)
        : { key: conf.shortName || "", isNormative: false };
      elem.dataset.cite = closestIsNormative ? `!${parentKey}` : parentKey;
      elem.dataset.citeFrag = key; // the key is acting as fragment
      return toCiteDetails(elem);
    }
    if (fragPosition !== -1) {
      frag = !frag ? key.substr(fragPosition) : frag;
      key = key.substring(0, fragPosition);
    }
    if (pathPosition !== -1) {
      path = !path ? key.substr(pathPosition) : path;
      key = key.substring(0, pathPosition);
    }
    if (isNormative) {
      key = key.substr(1);
    }
    if (frag && !frag.startsWith("#")) {
      frag = "#" + frag;
    }
    // remove head / for URL resolution
    if (path && path.startsWith("/")) {
      path = path.substr(1);
    }
    return { key, isNormative, frag, path };
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
