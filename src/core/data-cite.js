// @ts-check
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
import { refTypeFromContext, showInlineWarning, wrapInner } from "./utils";
import { resolveRef, updateFromNetwork } from "./biblio";
import hyperHTML from "hyperhtml";
export const name = "core/data-cite";

function requestLookup(conf) {
  const toCiteDetails = citeDetailsConverter(conf);
  return async elem => {
    const originalKey = elem.dataset.cite;
    const { key, frag, path } = toCiteDetails(elem);
    let href = "";
    let title = "";
    // This is just referring to this document
    if (key.toLowerCase() === conf.shortName.toLowerCase()) {
      console.log(
        elem,
        `The reference "${key}" is resolved into the current document per \`conf.shortName\`.`
      );
      href = document.location.href;
    } else {
      // Let's go look it up in spec ref...
      const entry = await resolveRef(key);
      cleanElement(elem);
      if (!entry) {
        showInlineWarning(elem, `Couldn't find a match for "${originalKey}"`);
        return;
      }
      href = entry.href;
      title = entry.title;
    }
    if (path) {
      // See: https://github.com/w3c/respec/issues/1856#issuecomment-429579475
      const relPath = path.startsWith("/") ? `.${path}` : path;
      href = new URL(relPath, href).href;
    }
    if (frag) {
      href = new URL(frag, href).href;
    }
    switch (elem.localName) {
      case "a": {
        if (elem.textContent === "") {
          elem.textContent = title;
        }
        elem.href = href;
        break;
      }
      case "dfn": {
        const anchor = hyperHTML`<a href="${href}">`;
        if (!elem.textContent) {
          anchor.textContent = title;
          elem.append(anchor);
        } else {
          wrapInner(elem, anchor);
        }
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
    return position !== -1 ? key.substring(position) : "";
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
    const frag = citeFrag ? `#${citeFrag}` : findFrag(rawKey);
    const path = citePath || findPath(rawKey).split("#")[0]; // path is always before "#"
    const { type } = refTypeFromContext(rawKey, elem);
    const isNormative = type === "normative";
    // key is before "/" and "#" but after "!" or "?" (e.g., ?key/path#frag)
    const key = rawKey.split(/[/|#]/)[0].substring(/^[?|!]/.test(rawKey));
    const details = { key, isNormative, frag, path };
    return details;
  };
}

export async function run(conf) {
  const toCiteDetails = citeDetailsConverter(conf);
  /** @type {NodeListOf<HTMLElement>} */
  const cites = document.querySelectorAll("dfn[data-cite], a[data-cite]");
  Array.from(cites)
    .filter(el => el.dataset.cite)
    .map(toCiteDetails)
    // it's not the same spec
    .filter(({ key }) => {
      return key.toLowerCase() !== (conf.shortName || "").toLowerCase();
    })
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

  const lookupRequests = [...new Set(elems)].map(toLookupRequest);
  return await Promise.all(lookupRequests);
}
