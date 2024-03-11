export const name = "core/dfn-contract";

export function run() {
  addContractDefaults();
  addDefinitionPointers();
}

function addContractDefaults() {
  // Find all dfns that don't have a type and default them to "dfn".
  /** @type NodeListOf<HTMLElement> */
  const dfnsWithNoType = document.querySelectorAll(
    "dfn:is([data-dfn-type=''],:not([data-dfn-type]))"
  );
  for (const dfn of dfnsWithNoType) {
    dfn.dataset.dfnType = "dfn";
  }

  // Per "the contract", export all definitions, except where:
  //  - Explicitly marked with data-noexport.
  //  - The type is "dfn" and not explicitly marked for export (i.e., just a regular definition).
  //  - definitions was included via (legacy) data-cite="foo#bar".
  /** @type NodeListOf<HTMLElement> */
  const exportableDfns = document.querySelectorAll(
    "dfn:not([data-noexport], [data-export], [data-dfn-type='dfn'], [data-cite])"
  );
  for (const dfn of exportableDfns) {
    dfn.dataset.export = "";
  }
}

// - Sets data-defines on well-known definition content patterns
function addDefinitionPointers() {
  // A dl with class hasdefinitions associated the dfn in each dt
  // the definition in the following sibling element
  /** @type NodeListOf<HTMLElement> */
  const describedDTs = document.querySelectorAll(
    "dl.definitions dt:has(dfn[data-dfn-type])"
  );
  for (const dt of describedDTs) {
    const dfnId = dt.querySelector("dfn[data-dfn-type]").id;
    const dfnContent = /** @type {HTMLElement | null} */ (
      dt.nextElementSibling
    );
    if (dfnContent && !dfnContent.dataset.defines && dfnId) {
      dfnContent.dataset.defines = `#${dfnId}`;
    }
  }

  // an element with class "definition" is marked as defining the term
  // found in the element
  /** @type NodeListOf<HTMLElement> */
  const definitionContainers = document.querySelectorAll(
    ".definition:has(dfn[data-dfn-type])"
  );
  for (const el of definitionContainers) {
    const dfn = el.querySelector("dfn[data-dfn-type]");
    if (dfn.id && !el.dataset.defines) {
      el.dataset.defines = `#${dfn.id}`;
    }
  }
}
