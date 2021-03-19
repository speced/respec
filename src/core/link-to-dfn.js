// @ts-check
// Module core/link-to-dfn
// Gives definitions in definitionMap IDs and links <a> tags
// to the matching definitions.
import {
  CaseInsensitiveMap,
  addId,
  getIntlData,
  getLinkTargets,
  showError,
  showWarning,
  wrapInner,
} from "./utils.js";
import { THIS_SPEC, toCiteDetails } from "./data-cite.js";
import { definitionMap } from "./dfn-map.js";

export const name = "core/link-to-dfn";

/** @type {HTMLElement[]} */
export const possibleExternalLinks = [];

const localizationStrings = {
  en: {
    /**
     * @param {string} title
     */
    duplicateMsg(title) {
      return `Duplicate definition(s) of '${title}'`;
    },
    duplicateTitle: "This is defined more than once in the document.",
  },
  ja: {
    /**
     * @param {string} title
     */
    duplicateMsg(title) {
      return `'${title}' の重複定義`;
    },
    duplicateTitle: "この文書内で複数回定義されています．",
  },
  de: {
    /**
     * @param {string} title
     */
    duplicateMsg(title) {
      return `Mehrfache Definition von '${title}'`;
    },
    duplicateTitle:
      "Das Dokument enthält mehrere Definitionen dieses Eintrags.",
  },
  zh: {
    /**
     * @param {string} title
     */
    duplicateMsg(title) {
      return `'${title}' 的重复定义`;
    },
    duplicateTitle: "在文档中有重复的定义。",
  },
};
const l10n = getIntlData(localizationStrings);

export async function run(conf) {
  const titleToDfns = mapTitleToDfns();
  /** @type {HTMLAnchorElement[]} */
  const badLinks = [];

  /** @type {NodeListOf<HTMLAnchorElement>} */
  const localAnchors = document.querySelectorAll(
    "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo):not(.externalDFN)"
  );
  for (const anchor of localAnchors) {
    const dfn = findMatchingDfn(anchor, titleToDfns);
    if (dfn) {
      const foundLocalMatch = processAnchor(anchor, dfn, titleToDfns);
      if (!foundLocalMatch) {
        possibleExternalLinks.push(anchor);
      }
    } else {
      if (anchor.dataset.cite === "") {
        badLinks.push(anchor);
      } else {
        possibleExternalLinks.push(anchor);
      }
    }
  }

  showLinkingError(badLinks);

  // This needs to run before core/xref adds its data-cite and updates
  // conf.normativeReferences and conf.informativeReferences.
  updateReferences(conf);

  if (!conf.xref) {
    showLinkingError(possibleExternalLinks);
  }
}

function mapTitleToDfns() {
  /** @type {CaseInsensitiveMap<Map<string, Map<string, HTMLElement>>>} */
  const titleToDfns = new CaseInsensitiveMap();
  for (const key of definitionMap.keys()) {
    const { result, duplicates } = collectDfns(key);
    titleToDfns.set(key, result);
    if (duplicates.length > 0) {
      showError(l10n.duplicateMsg(key), name, {
        title: l10n.duplicateTitle,
        elements: duplicates,
      });
    }
  }
  return titleToDfns;
}

/**
 * @param {string} title
 */
function collectDfns(title) {
  /** @type {Map<string, Map<string, HTMLElement>>} */
  const result = new Map();
  const duplicates = [];
  for (const dfn of definitionMap.get(title)) {
    const { dfnFor = "", dfnType = "dfn" } = dfn.dataset;
    // check for potential duplicate definition
    if (result.has(dfnFor) && result.get(dfnFor).has(dfnType)) {
      const oldDfn = result.get(dfnFor).get(dfnType);
      // We want <dfn> definitions to take precedence over
      // definitions from WebIDL. WebIDL definitions wind
      // up as <span>s instead of <dfn>.
      const oldIsDfn = oldDfn.localName === "dfn";
      const newIsDfn = dfn.localName === "dfn";
      const isSameDfnType = dfnType === (oldDfn.dataset.dfnType || "dfn");
      const isSameDfnFor = dfnFor === (oldDfn.dataset.dfnFor || "");
      if (oldIsDfn && newIsDfn && isSameDfnType && isSameDfnFor) {
        duplicates.push(dfn);
        continue;
      }
    }
    const type = "idl" in dfn.dataset || dfnType !== "dfn" ? "idl" : "dfn";
    if (!result.has(dfnFor)) {
      result.set(dfnFor, new Map());
    }
    result.get(dfnFor).set(type, dfn);
    addId(dfn, "dfn", title);
  }

  return { result, duplicates };
}

/**
 * Find a potentially matching <dfn> for given anchor.
 * @param {HTMLAnchorElement} anchor
 * @param {ReturnType<typeof mapTitleToDfns>} titleToDfns
 */
function findMatchingDfn(anchor, titleToDfns) {
  const linkTargets = getLinkTargets(anchor);
  const target = linkTargets.find(
    target =>
      titleToDfns.has(target.title) &&
      titleToDfns.get(target.title).has(target.for)
  );
  if (!target) return;

  const dfnsByType = titleToDfns.get(target.title).get(target.for);
  const { linkType } = anchor.dataset;
  if (linkType) {
    const type = linkType === "dfn" ? "dfn" : "idl";
    return dfnsByType.get(type) || dfnsByType.get("dfn");
  } else {
    // Assumption: if it's for something, it's more likely IDL.
    const type = target.for ? "idl" : "dfn";
    return dfnsByType.get(type) || dfnsByType.get("idl");
  }
}

/**
 * @param {HTMLAnchorElement} anchor
 * @param {HTMLElement} dfn
 * @param {ReturnType<typeof mapTitleToDfns>} titleToDfns
 */
function processAnchor(anchor, dfn, titleToDfns) {
  let noLocalMatch = false;
  const { linkFor } = anchor.dataset;
  const { dfnFor } = dfn.dataset;
  if (dfn.dataset.cite) {
    anchor.dataset.cite = dfn.dataset.cite;
  } else if (linkFor && !titleToDfns.get(linkFor) && linkFor !== dfnFor) {
    noLocalMatch = true;
  } else if (dfn.classList.contains("externalDFN")) {
    // data-lt[0] serves as unique id for the dfn which this element references
    const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
    anchor.dataset.lt = lt[0] || dfn.textContent;
    noLocalMatch = true;
  } else if (anchor.dataset.idl !== "partial") {
    anchor.href = `#${dfn.id}`;
    anchor.classList.add("internalDFN");
  } else {
    noLocalMatch = true;
  }
  if (!anchor.hasAttribute("data-link-type")) {
    anchor.dataset.linkType = "idl" in dfn.dataset ? "idl" : "dfn";
  }
  if (isCode(dfn)) {
    wrapAsCode(anchor, dfn);
  }
  return !noLocalMatch;
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
 * @param {HTMLAnchorElement} anchor a link
 * @param {HTMLElement} dfn a definition
 */
function wrapAsCode(anchor, dfn) {
  // only add code to IDL when the definition matches
  const term = anchor.textContent.trim();
  const isIDL = dfn.dataset.hasOwnProperty("idl");
  const needsCode = shouldWrapByCode(anchor) && shouldWrapByCode(dfn, term);
  if (!isIDL || needsCode) {
    wrapInner(anchor, document.createElement("code"));
  }
}

/**
 * @param {HTMLElement} elem
 * @param {string} term
 */
function shouldWrapByCode(elem, term = "") {
  switch (elem.localName) {
    case "a":
      if (!elem.querySelector("code")) {
        return true;
      }
      break;
    default: {
      const { dataset } = elem;
      if (elem.textContent.trim() === term) {
        return true;
      } else if (dataset.title === term) {
        return true;
      } else if (dataset.lt || dataset.localLt) {
        const terms = [];
        if (dataset.lt) {
          terms.push(...dataset.lt.split("|"));
        }
        if (dataset.localLt) {
          terms.push(...dataset.localLt.split("|"));
        }
        return terms.includes(term);
      }
    }
  }
  return false;
}

function showLinkingError(elems) {
  elems.forEach(elem => {
    const msg = `Found linkless \`<a>\` element with text "${elem.textContent}" but no matching \`<dfn>\``;
    const title = "Linking error: not matching `<dfn>`";
    showWarning(msg, name, { title, elements: [elem] });
  });
}

/**
 * Update references due to `data-cite` attributes.
 *
 * Also, make sure self-citing doesn't cause current document getting added to
 * bibliographic references section.
 * @param {Conf} conf
 */
function updateReferences(conf) {
  const { shortName = "" } = conf;
  // Match shortName in a data-cite (with optional leading ?!), while skipping shortName as prefix.
  // https://regex101.com/r/rsZyIJ/5
  const regex = new RegExp(String.raw`^([?!])?${shortName}\b([^-])`, "i");

  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll(
    "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
  );
  for (const elem of elems) {
    elem.dataset.cite = elem.dataset.cite.replace(regex, `$1${THIS_SPEC}$2`);
    const { key, isNormative } = toCiteDetails(elem);
    if (key === THIS_SPEC) continue;

    if (!isNormative && !conf.normativeReferences.has(key)) {
      conf.informativeReferences.add(key);
    } else {
      conf.normativeReferences.add(key);
      conf.informativeReferences.delete(key);
    }
  }
}
