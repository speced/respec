// @ts-check
/**
 * Module core/data-cite
 *
 * Allows citing other specifications using anchor elements. Simply add
 * "data-cite" and key of specification.
 *
 * This module links elements that have `data-cite` attributes by converting
 * `data-cite` to `href` attributes. `data-cite` attributes are added to markup
 * directly by the author as well as via other modules like core/xref.
 */
import { biblio, resolveRef, updateFromNetwork } from "./biblio.js";
import {
  refTypeFromContext,
  showError,
  showWarning,
  wrapInner,
} from "./utils.js";
import { sub } from "./pubsubhub.js";
export const name = "core/data-cite";

/**
 * An arbitrary constant value used as an alias to current spec's shortname. It
 * exists to simplify code as passing `conf.shortName` everywhere gets clumsy.
 */
export const THIS_SPEC = "__SPEC__";

/**
 * @param {CiteDetails} citeDetails
 */
async function getLinkProps(citeDetails) {
  const { key, frag, path, href: canonicalHref } = citeDetails;
  let href = "";
  let title = "";
  // This is just referring to this document
  if (key === THIS_SPEC) {
    href = document.location.href;
  } else {
    // Let's go look it up in spec ref...
    const entry = await resolveRef(key);
    if (!entry) {
      return null;
    }
    href = entry.href;
    title = entry.title;
  }
  if (canonicalHref) {
    // Xref gave us a canonical link, so let's use that.
    href = canonicalHref;
  } else {
    if (path) {
      // See: https://github.com/w3c/respec/issues/1856#issuecomment-429579475
      const relPath = path.startsWith("/") ? `.${path}` : path;
      href = new URL(relPath, href).href;
    }
    if (frag) {
      href = new URL(frag, href).href;
    }
  }
  return { href, title };
}

/**
 * @param {HTMLElement} elem
 * @param {object} linkProps
 * @param {string} linkProps.href
 * @param {string} linkProps.title
 * @param {CiteDetails} citeDetails
 */
function linkElem(elem, linkProps, citeDetails) {
  const { href, title } = linkProps;
  const wrapInCiteEl = !citeDetails.path && !citeDetails.frag;

  switch (elem.localName) {
    case "a": {
      const el = /** @type {HTMLAnchorElement} */ (elem);
      if (el.textContent === "" && el.dataset.lt !== "the-empty-string") {
        el.textContent = title;
      }
      el.href = href;
      if (wrapInCiteEl) {
        const cite = document.createElement("cite");
        el.replaceWith(cite);
        cite.append(el);
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
      if (wrapInCiteEl) {
        const cite = document.createElement("cite");
        cite.append(anchor);
        elem.append(cite);
      }
      if ("export" in elem.dataset) {
        const msg = "Exporting an linked external definition is not allowed.";
        const hint = "Please remove the `data-export` attribute.";
        showError(msg, name, { hint, elements: [elem] });
        delete elem.dataset.export;
      }
      elem.classList.add("externalDFN");
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
 * @property {string} [href] - canonical href coming from xref
 * @param {HTMLElement} elem
 * @return {CiteDetails};
 */
export function toCiteDetails(elem) {
  const { dataset } = elem;
  const { cite: rawKey, citeFrag, citePath, citeHref } = dataset;

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
  const details = { key, isNormative, frag, path, href: citeHref };
  return details;
}

export async function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll(
    "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
  );

  await updateBiblio([...elems]);

  for (const elem of elems) {
    const originalKey = elem.dataset.cite;
    const citeDetails = toCiteDetails(elem);
    const linkProps = await getLinkProps(citeDetails);
    if (linkProps) {
      linkElem(elem, linkProps, citeDetails);
    } else {
      const msg = `Couldn't find a match for "${originalKey}"`;
      showWarning(msg, name, { elements: [elem] });
    }
  }

  sub("beforesave", cleanup);
}

/**
 * Fetch and update `biblio` with entries corresponding to given elements
 * @param {HTMLElement[]} elems
 */
async function updateBiblio(elems) {
  const promisesForBibEntries = elems.map(toCiteDetails).map(async entry => {
    const result = await resolveRef(entry.key);
    return { entry, result };
  });
  const bibEntries = await Promise.all(promisesForBibEntries);

  const missingBibEntries = bibEntries
    .filter(({ result }) => result === null)
    .map(({ entry: { key } }) => key);

  const newEntries = await updateFromNetwork(missingBibEntries);
  if (newEntries) {
    Object.assign(biblio, newEntries);
  }
}

/** @param {Document} doc */
function cleanup(doc) {
  const attrToRemove = ["data-cite", "data-cite-frag", "data-cite-path"];
  const elems = doc.querySelectorAll("a[data-cite], dfn[data-cite]");
  elems.forEach(elem =>
    attrToRemove.forEach(attr => elem.removeAttribute(attr))
  );
}
