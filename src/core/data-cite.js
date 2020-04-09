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
import { biblio, resolveRef, updateFromNetwork } from "./biblio.js";
import {
  refTypeFromContext,
  showInlineError,
  showInlineWarning,
  wrapInner,
} from "./utils.js";
import { sub } from "./pubsubhub.js";
export const name = "core/data-cite";

const THIS_SPEC = "__SPEC__";

async function toLookupRequest(elem) {
  const originalKey = elem.dataset.cite;
  const { key, frag, path } = toCiteDetails(elem);
  let href = "";
  let title = "";
  // This is just referring to this document
  if (key === THIS_SPEC) {
    console.log(
      elem,
      `The reference "${key}" is resolved into the current document per \`conf.shortName\`.`
    );
    href = document.location.href;
  } else {
    // Let's go look it up in spec ref...
    const entry = await resolveRef(key);
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
      if (elem.textContent === "" && elem.dataset.lt !== "the-empty-string") {
        elem.textContent = title;
      }
      elem.href = href;
      if (!path && !frag) {
        const cite = document.createElement("cite");
        elem.replaceWith(cite);
        cite.append(elem);
      }
      break;
    }
    case "dfn": {
      const anchor = document.createElement("a");
      anchor.href = href;
      if (!elem.textContent) {
        anchor.textContent = title;
        elem.append(anchor);
      } else {
        wrapInner(elem, anchor);
      }
      if (!path && !frag) {
        const cite = document.createElement("cite");
        cite.append(anchor);
        elem.append(cite);
      }
      if ("export" in elem.dataset) {
        showInlineError(
          elem,
          "Exporting an linked external definition is not allowed. Please remove the `data-export` attribute",
          "Please remove the `data-export` attribute."
        );
        delete elem.dataset.export;
      }
      elem.dataset.noExport = "";
      break;
    }
  }
}

/**
 * @param {string} component
 * @return {(key: string) => string}
 */
function makeComponentFinder(component) {
  return key => {
    const position = key.search(component);
    return position !== -1 ? key.substring(position) : "";
  };
}

const findFrag = makeComponentFinder("#");
const findPath = makeComponentFinder("/");

/**
 * @typedef {object} CiteDetails
 * @property {string} key
 * @property {boolean} isNormative
 * @property {string} frag
 * @property {string} path
 *
 * @param {HTMLElement} elem
 * @return {CiteDetails};
 */
export function toCiteDetails(elem) {
  const { dataset } = elem;
  const { cite: rawKey, citeFrag, citePath } = dataset;
  // The key is a fragment, resolve using the shortName as key
  if (rawKey.startsWith("#") && !citeFrag) {
    // Closes data-cite not starting with "#"
    /** @type {HTMLElement} */
    const closest = elem.parentElement.closest(
      `[data-cite]:not([data-cite^="#"])`
    );
    const { key: parentKey, isNormative: closestIsNormative } = closest
      ? toCiteDetails(closest)
      : { key: THIS_SPEC, isNormative: false };
    dataset.cite = closestIsNormative ? parentKey : `?${parentKey}`;
    dataset.citeFrag = rawKey.replace("#", ""); // the key is acting as fragment
    return toCiteDetails(elem);
  }
  const frag = citeFrag ? `#${citeFrag}` : findFrag(rawKey);
  const path = citePath || findPath(rawKey).split("#")[0]; // path is always before "#"
  const { type } = refTypeFromContext(rawKey, elem);
  const isNormative = type === "normative";
  // key is before "/" and "#" but after "!" or "?" (e.g., ?key/path#frag)
  const hasPrecedingMark = /^[?|!]/.test(rawKey);
  const key = rawKey.split(/[/|#]/)[0].substring(Number(hasPrecedingMark));
  const details = { key, isNormative, frag, path };
  return details;
}

export async function run(conf) {
  const shortNameRegex = new RegExp(
    String.raw`\b${conf.shortName.toLowerCase()}\b`,
    "i"
  );
  /** @type {NodeListOf<HTMLElement>} */
  const cites = document.querySelectorAll("dfn[data-cite], a[data-cite]");
  Array.from(cites)
    .filter(el => el.dataset.cite)
    .map(el => {
      el.dataset.cite = el.dataset.cite.replace(shortNameRegex, THIS_SPEC);
      return el;
    })
    .map(toCiteDetails)
    // it's not the same spec
    .filter(({ key }) => key !== THIS_SPEC)
    .forEach(({ isNormative, key }) => {
      if (!isNormative && !conf.normativeReferences.has(key)) {
        conf.informativeReferences.add(key);
        return;
      }
      conf.normativeReferences.add(key);
      conf.informativeReferences.delete(key);
    });

  sub("beforesave", cleanup);
}

export async function linkInlineCitations() {
  const elems = [
    ...document.querySelectorAll(
      "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
    ),
  ];

  const promisesForMissingEntries = elems
    .map(toCiteDetails)
    .map(async entry => {
      const result = await resolveRef(entry.key);
      return { entry, result };
    });
  const bibEntries = await Promise.all(promisesForMissingEntries);

  const missingBibEntries = bibEntries
    .filter(({ result }) => result === null)
    .map(({ entry: { key } }) => key);

  // we now go to network to fetch missing entries
  const newEntries = await updateFromNetwork(missingBibEntries);
  if (newEntries) Object.assign(biblio, newEntries);

  const lookupRequests = [...new Set(elems)].map(toLookupRequest);
  return await Promise.all(lookupRequests);
}

function cleanup(doc) {
  const attrToRemove = ["data-cite", "data-cite-frag", "data-cite-path"];
  const elems = doc.querySelectorAll("a[data-cite], dfn[data-cite]");
  elems.forEach(elem =>
    attrToRemove.forEach(attr => elem.removeAttribute(attr))
  );
}
