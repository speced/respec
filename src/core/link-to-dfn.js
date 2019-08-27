// @ts-check
// Module core/link-to-dfn
// Gives definitions in conf.definitionMap IDs and links <a> tags
// to the matching definitions.
import {
  addId,
  getLinkTargets,
  showInlineError,
  showInlineWarning,
  wrapInner,
} from "./utils.js";
import { run as addExternalReferences } from "./xref.js";
import { lang as defaultLang } from "./l10n.js";
import { definitionMap } from "./dfn-map.js";
import { linkInlineCitations } from "./data-cite.js";
import { pub } from "./pubsubhub.js";
export const name = "core/link-to-dfn";
const l10n = {
  en: {
    /**
     * @param {string} title
     */
    duplicateMsg(title) {
      return `Duplicate definition(s) of '${title}'`;
    },
    duplicateTitle: "This is defined more than once in the document.",
  },
};
const lang = defaultLang in l10n ? defaultLang : "en";

export async function run(conf) {
  document.normalize();

  const titleToDfns = mapTitleToDfns();

  /** @type {HTMLElement[]} */
  const possibleExternalLinks = [];
  /** @type {HTMLAnchorElement[]} */
  const badLinks = [];

  const localLinkSelector =
    "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo):not(.externalDFN)";
  document.querySelectorAll(localLinkSelector).forEach((
    /** @type {HTMLAnchorElement} */ anchor
  ) => {
    const linkTargets = getLinkTargets(anchor);
    const foundDfn = linkTargets.some(target => {
      return findLinkTarget(target, anchor, titleToDfns, possibleExternalLinks);
    });
    if (!foundDfn && linkTargets.length !== 0) {
      if (anchor.dataset.cite === "") {
        badLinks.push(anchor);
      } else {
        possibleExternalLinks.push(anchor);
      }
    }
  });

  showLinkingError(badLinks);

  if (conf.xref) {
    possibleExternalLinks.push(...findExplicitExternalLinks());
    try {
      await addExternalReferences(conf, possibleExternalLinks);
    } catch (error) {
      console.error(error);
      showLinkingError(possibleExternalLinks);
    }
  } else {
    showLinkingError(possibleExternalLinks);
  }

  await linkInlineCitations(document, conf);
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", "core/link-to-dfn");
}

function mapTitleToDfns() {
  /** @type {Map<string, Map<string, HTMLElement>>} */
  const titleToDfns = new Map();
  Object.keys(definitionMap).forEach(title => {
    const { result, duplicates } = collectDfns(title);
    titleToDfns.set(title, result);
    if (duplicates.length > 0) {
      showInlineError(
        duplicates,
        l10n[lang].duplicateMsg(title),
        l10n[lang].duplicateTitle
      );
    }
  });
  return titleToDfns;
}

/**
 * @param {string} title
 */
function collectDfns(title) {
  /** @type {Map<string, HTMLElement>} */
  const result = new Map();
  const duplicates = [];
  definitionMap[title].forEach(dfn => {
    if (dfn.dataset.idl === undefined) {
      // Non-IDL definitions aren't "for" an interface.
      delete dfn.dataset.dfnFor;
    }
    const { dfnFor = "" } = dfn.dataset;
    if (result.has(dfnFor)) {
      // We want <dfn> definitions to take precedence over
      // definitions from WebIDL. WebIDL definitions wind
      // up as <span>s instead of <dfn>.
      const oldIsDfn = result.get(dfnFor).localName === "dfn";
      const newIsDfn = dfn.localName === "dfn";
      if (oldIsDfn) {
        if (!newIsDfn) {
          // Don't overwrite <dfn> definitions.
          return;
        }
        duplicates.push(dfn);
      }
    }
    result.set(dfnFor, dfn);
    assignDfnId(dfn, title);
  });
  return { result, duplicates };
}

/**
 * @param {HTMLElement} dfn
 * @param {string} title
 */
function assignDfnId(dfn, title) {
  if (!dfn.id) {
    const { dfnFor } = dfn.dataset;
    if (dfn.dataset.idl) {
      addId(dfn, "dom", (dfnFor ? `${dfnFor}-` : "") + title);
    } else {
      addId(dfn, "dfn", title);
    }
  }
}

/**
 * @param {import("./utils.js").LinkTarget} target
 * @param {HTMLAnchorElement} anchor
 * @param {Map<string, Map<string, HTMLElement>>} titleToDfns
 * @param {HTMLElement[]} possibleExternalLinks
 */
function findLinkTarget(target, anchor, titleToDfns, possibleExternalLinks) {
  const { linkFor } = anchor.dataset;
  if (
    !titleToDfns.has(target.title) ||
    !titleToDfns.get(target.title).get(target.for)
  ) {
    return false;
  }
  const dfn = titleToDfns.get(target.title).get(target.for);
  if (dfn.dataset.cite) {
    anchor.dataset.cite = dfn.dataset.cite;
  } else if (linkFor && !titleToDfns.get(linkFor)) {
    possibleExternalLinks.push(anchor);
  } else if (dfn.classList.contains("externalDFN")) {
    // data-lt[0] serves as unique id for the dfn which this element references
    const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
    anchor.dataset.lt = lt[0] || dfn.textContent;
    possibleExternalLinks.push(anchor);
  } else {
    if (anchor.dataset.idl === "partial") {
      possibleExternalLinks.push(anchor);
    } else {
      anchor.href = `#${dfn.id}`;
      anchor.classList.add("internalDFN");
    }
  }
  // add a bikeshed style indication of the type of link
  if (!anchor.hasAttribute("data-link-type")) {
    anchor.dataset.linkType = "dfn";
  }
  if (isCode(dfn)) {
    wrapAsCode(anchor, dfn);
  }
  return true;
}

/**
 * Check if a definition is a code
 * @param {HTMLElement} dfn a definition
 */
function isCode(dfn) {
  if (dfn.closest("code,pre")) {
    return true;
  }
  // Note that childNodes.length === 1 excludes
  // definitions that have either other text, or other
  // whitespace, inside the <dfn>.
  if (dfn.childNodes.length !== 1) {
    return false;
  }
  const [first] = /** @type {NodeListOf<HTMLElement>} */ (dfn.childNodes);
  return first.localName === "code";
}

/**
 * Wrap links by <code>.
 * @param {HTMLAnchorElement} ant a link
 * @param {HTMLElement} dfn a definition
 */
function wrapAsCode(ant, dfn) {
  // only add code to IDL when the definition matches
  const term = ant.textContent.trim();
  const isIDL = dfn.dataset.hasOwnProperty("idl");
  const needsCode = shouldWrapByCode(dfn, term);
  if (!isIDL || needsCode) {
    wrapInner(ant, document.createElement("code"));
  }
}

/**
 * @param {HTMLElement} dfn
 * @param {string} term
 */
function shouldWrapByCode(dfn, term) {
  const { dataset } = dfn;
  if (dfn.textContent.trim() === term) {
    return true;
  } else if (dataset.title === term) {
    return true;
  } else if (dataset.lt) {
    return dataset.lt.split("|").includes(term.toLowerCase());
  }
  return false;
}

/**
 * Find additional references that need to be looked up externally.
 * Examples: a[data-cite="spec"], dfn[data-cite="spec"], dfn.externalDFN
 */
function findExplicitExternalLinks() {
  /** @type {NodeListOf<HTMLElement>} */
  const links = document.querySelectorAll(
    "a[data-cite]:not([data-cite='']):not([data-cite*='#']), " +
      "dfn[data-cite]:not([data-cite='']):not([data-cite*='#'])"
  );
  /** @type {NodeListOf<HTMLElement>} */
  const externalDFNs = document.querySelectorAll("dfn.externalDFN");
  return [...links]
    .filter(el => {
      // ignore empties
      if (el.textContent.trim() === "") return false;
      /** @type {HTMLElement} */
      const closest = el.closest("[data-cite]");
      return !closest || closest.dataset.cite !== "";
    })
    .concat(...externalDFNs);
}

function showLinkingError(elems) {
  elems.forEach(elem => {
    showInlineWarning(
      elem,
      `Found linkless \`<a>\` element with text "${elem.textContent}" but no matching \`<dfn>\``,
      "Linking error: not matching `<dfn>`"
    );
  });
}
