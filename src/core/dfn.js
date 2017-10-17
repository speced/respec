// Module core/dfn
// Finds all <dfn> elements and populates definitionMap to identify them.
import { deriveId, getLinkedTerms, deriveDfnType, deriveAnchorType } from "core/utils";
import { pub } from "core/pubsubhub";

export const name = "core/dfn";
export const definitionMap = new Map();

function findByType(anchor, type) {
  return getLinkedTerms(anchor)
    .filter(key => definitionMap.has(key))
    .map(key => definitionMap.get(key))
    .reduce((collector, defs) => collector.concat(defs), [])
    .find(({ dataset: { dfnType } }) => dfnType === type);
}

export function findDfn(anchor) {
  const type = deriveAnchorType(anchor);
  let matchedDfn = findByType(anchor, type);
  //if don't match, let's fall back to the default type
  if (!matchedDfn && type !== "dfn") {
    matchedDfn = findByType(anchor, "dfn");
  }
  return matchedDfn;
}

function isValidDfn(dfn) {
  if (dfn.dataset.hasOwnProperty("ltNoDefault") && !dfn.dataset.lt) {
    const msg = "Invalid definition: missing or empty `data-lt` attribute.";
    pub("error", `${msg} See developer console.`);
    dfn.classList.add("respec-offending-element");
    dfn.title = msg;
    console.error(msg, dfn);
    return false;
  }
  return true;
}

function deriveDetails(dfn) {
  const id = deriveId(dfn);
  const type = deriveDfnType(dfn);
  return { id, type, dfn };
}

/**
 * Adds an id attribute, if one is missing.
 * And adds a data-dfn-type, if one is missing.
 *
 * @param {HTMLDfnElement} dfn
 */
function canonicalizeDfn(dfn) {
  const { id, type } = deriveDetails(dfn);
  dfn.id = id;
  dfn.dataset.dfnType = type;
  return dfn;
}

function markupAsCode(dfn) {
  // If it's already wrapped in code, or has code inside, ignore it.
  if (
    dfn.closest("code") ||
    dfn.querySelector("code") ||
    !dfn.hasChildNodes()
  ) {
    return;
  }
  // Otherwise, wrap
  const code = Array.from(dfn.childNodes).reduce((code, node) => {
    code.appendChild(node);
    return code;
  }, document.createElement("code"));
  dfn.appendChild(code);
}

export function run(conf, doc, cb) {
  const canicalizedDfns = Array.from(document.querySelectorAll("dfn"))
    .filter(isValidDfn)
    .map(canonicalizeDfn);
  // Now that we have the dfns in a canonical form, we store them
  // by the terms they define.
  for (const dfn of canicalizedDfns) {
    getLinkedTerms(dfn)
      .map(key => {
        if (!definitionMap.has(key)) {
          definitionMap.set(key, []);
        }
        return definitionMap.get(key);
      })
      .reduce((dfn, dfns) => {
        const { dfnType: type } = dfn.dataset;
        const alreadyDefined = dfns.find(
          ({ dataset: { dfnType } }) => dfnType === type
        );
        if (alreadyDefined) {
          const msg = `The term ${dfn.textContent.trim()} is already defined. See developer console.`;
          pub("error", msg);
          dfn.classList.add("respec-offending-element");
          dfn.title = msg;
          console.error(msg, alreadyDefined, dfn);
          return;
        }
        if (type === "idl") {
          markupAsCode(dfn);
        }
        dfns.push(dfn);
        return dfn;
      }, dfn);
  }
  cb();
}
