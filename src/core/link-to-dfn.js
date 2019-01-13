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
} from "./utils";
import { run as addExternalReferences } from "./xref";
import { lang as defaultLang } from "./l10n";
import { definitionMap } from "./dfn-map";
import { linkInlineCitations } from "./data-cite";
import { pub } from "./pubsubhub";
export const name = "core/link-to-dfn";
const l10n = {
  en: {
    duplicate: "This is defined more than once in the document.",
  },
};
const lang = defaultLang in l10n ? defaultLang : "en";

export async function run(conf) {
  document.normalize();

  const titleToDfns = mapTitleToDfns();

  /** @type {Element[]} */
  const possibleExternalLinks = [];
  /** @type {HTMLAnchorElement[]} */
  const badLinks = [];

  const localLinkSelector =
    "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo)";
  document.querySelectorAll(localLinkSelector).forEach((
    /** @type {HTMLAnchorElement} */ ant
  ) => {
    if (ant.classList.contains("externalDFN")) return;
    const linkTargets = getLinkTargets(ant);
    const foundDfn = linkTargets.some(target => {
      return findLinkTarget(target, ant, titleToDfns, possibleExternalLinks);
    });
    if (!foundDfn && linkTargets.length !== 0) {
      // ignore WebIDL
      if (ant.closest("pre.idl")) {
        ant.replaceWith(...ant.childNodes);
        return;
      }
      if (ant.dataset.cite === "") {
        badLinks.push(ant);
      } else {
        possibleExternalLinks.push(ant);
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
  /** @type {Record<string, Record<string, HTMLElement>>} */
  const titleToDfns = {};
  Object.keys(definitionMap).forEach(title => {
    const { result, duplicates } = collectDfns(title);
    titleToDfns[title] = result;
    if (duplicates.length > 0) {
      showInlineError(
        duplicates,
        `Duplicate definitions of '${title}'`,
        l10n[lang].duplicate
      );
    }
  });
  return titleToDfns;
}

/**
 * @param {string} title
 */
function collectDfns(title) {
  /** @type {Record<string, HTMLElement>} */
  const result = {};
  const duplicates = [];
  definitionMap[title].forEach(dfn => {
    if (dfn.dataset.idl === undefined) {
      // Non-IDL definitions aren't "for" an interface.
      delete dfn.dataset.dfnFor;
    }
    const { dfnFor = "" } = dfn.dataset;
    if (dfnFor in result) {
      // We want <dfn> definitions to take precedence over
      // definitions from WebIDL. WebIDL definitions wind
      // up as <span>s instead of <dfn>.
      const oldIsDfn = result[dfnFor].localName === "dfn";
      const newIsDfn = dfn.localName === "dfn";
      if (oldIsDfn) {
        if (!newIsDfn) {
          // Don't overwrite <dfn> definitions.
          return;
        }
        duplicates.push(dfn);
      }
    }
    result[dfnFor] = dfn;
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
 * @param {{ for: string, title: string }} target
 * @param {HTMLAnchorElement} ant
 * @param {Record<string, Record<string, HTMLElement>>} titleToDfns
 * @param {Element[]} possibleExternalLinks
 */
function findLinkTarget(target, ant, titleToDfns, possibleExternalLinks) {
  const { linkFor } = ant.dataset;
  if (!titleToDfns[target.title] || !titleToDfns[target.title][target.for]) {
    return false;
  }
  const dfn = titleToDfns[target.title][target.for];
  if (dfn.dataset.cite) {
    ant.dataset.cite = dfn.dataset.cite;
  } else if (linkFor && !titleToDfns[linkFor.toLowerCase()]) {
    possibleExternalLinks.push(ant);
  } else if (dfn.classList.contains("externalDFN")) {
    // data-lt[0] serves as unique id for the dfn which this element references
    const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
    ant.dataset.lt = lt[0] || dfn.textContent;
    possibleExternalLinks.push(ant);
  } else {
    ant.href = `#${dfn.id}`;
    ant.classList.add("internalDFN");
  }
  // add a bikeshed style indication of the type of link
  if (!ant.hasAttribute("data-link-type")) {
    ant.dataset.linkType = "dfn";
  }

  if (isCode(dfn)) {
    wrapAsCode(ant, dfn);
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
  const links = document.querySelectorAll(
    "a[data-cite]:not([data-cite='']):not([data-cite*='#']), " +
      "dfn[data-cite]:not([data-cite='']):not([data-cite*='#'])"
  );
  return [...links]
    .filter(el => {
      /** @type {HTMLElement} */
      const closest = el.closest("[data-cite]");
      return !closest || closest.dataset.cite !== "";
    })
    .concat([...document.querySelectorAll("dfn.externalDFN")]);
}

function showLinkingError(elems) {
  elems.forEach(elem => {
    showInlineWarning(
      elem,
      `Found linkless \`<a>\` element with text "${
        elem.textContent
      }" but no matching \`<dfn>\``,
      "Linking error: not matching <dfn>"
    );
  });
}
