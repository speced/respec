// @ts-check
// Module core/dfn
// - Finds all <dfn> elements and populates definitionMap to identify them.

import {
  codedJoinOr,
  docLink,
  getDfnTitles,
  norm,
  showError,
  toMDCode,
} from "./utils.js";
import {
  validateCommonName,
  validateDOMName,
  validateMimeType,
} from "./dfn-validators.js";
import { registerDefinition } from "./dfn-map.js";
import { slotRegex } from "./inline-idl-parser.js";
import { sub } from "./pubsubhub.js";

export const name = "core/dfn";

const knownTypesMap = new Map([
  ["abstract-op", { requiresFor: false }],
  ["attribute", { requiresFor: false, validator: validateDOMName }],
  [
    "attr-value",
    {
      requiresFor: true,
      associateWith: "an HTML attribute",
      validator: validateDOMName,
    },
  ],
  ["element", { requiresFor: false, validator: validateDOMName }],
  [
    "element-state",
    {
      requiresFor: true,
      associateWith: "an HTML attribute",
      validator: validateCommonName,
    },
  ],
  ["event", { requiresFor: false, validator: validateCommonName }],
  ["http-header", { requiresFor: false }],
  ["scheme", { requiresFor: false, validator: validateCommonName }],
  ["media-type", { requiresFor: false, validator: validateMimeType }],
]);

const knownTypes = [...knownTypesMap.keys()];

export function run() {
  for (const dfn of document.querySelectorAll("dfn")) {
    const titles = getDfnTitles(dfn);
    registerDefinition(dfn, titles);

    const [linkingText] = titles;

    let shouldExport = false;
    let type = "";

    // It's a legacy cite or redefining a something it doesn't own, so it gets no benefit.
    if (dfn.dataset.cite && /.+#./.test(dfn.dataset.cite)) {
      continue;
    }

    switch (true) {
      // class defined type (e.g., "<dfn class="element">)
      case knownTypes.some(name => dfn.classList.contains(name)):
        type = knownTypes.find(name => dfn.classList.contains(name));
        validateDefinition(dfn, linkingText, type);
        shouldExport = true;
        break;

      // Internal slots: attributes+ methods (e.g., [[some words]](with, optional, arguments))
      case slotRegex.test(linkingText):
        shouldExport = false;
        type = processAsInternalSlot(linkingText, dfn);
        break;
    }

    // If the Editor explicitly asked for it to be exported, so let's export it.
    if (dfn.classList.contains("export")) shouldExport = true;

    if (shouldExport && !dfn.dataset.hasOwnProperty("noexport")) {
      dfn.dataset.export = "";
    }

    // Get closest type from context
    if (!type) {
      /** @type {HTMLElement} */
      const closestType = dfn.closest("[data-dfn-type]");
      type = closestType?.dataset.dfnType;
    }
    if (!dfn.dataset.dfnType && type) dfn.dataset.dfnType = type;

    // Only add `lt`s that are different from the text content
    if (titles.length === 1 && linkingText === norm(dfn.textContent)) {
      continue;
    }
    dfn.dataset.lt = titles.join("|");
  }
  sub("plugins-done", addContractDefaults);
}

function validateDefinition(dfn, linkingText, type) {
  const entry = knownTypesMap.get(type);
  if (entry.requiresFor && !dfn.dataset.dfnFor) {
    const msg = docLink`Definition of type "\`${type}\`" requires a ${"[data-dfn-for]"} attribute.`;
    const { associateWith } = entry;
    const hint = docLink`Use a ${"[data-dfn-for]"} attribute to associate this with ${associateWith}.`;
    showError(msg, name, { hint, elements: [dfn] });
  }

  if (entry.validator) {
    entry.validator(linkingText, type, dfn, name);
  }
}

/**
 *
 * @param {string} title
 * @param {HTMLElement} dfn
 */
function processAsInternalSlot(title, dfn) {
  if (!dfn.dataset.hasOwnProperty("idl")) {
    dfn.dataset.idl = "";
  }

  // Automatically use the closest data-dfn-for as the parent.
  /** @type HTMLElement */
  const parent = dfn.closest("[data-dfn-for]");
  if (dfn !== parent && parent?.dataset.dfnFor) {
    dfn.dataset.dfnFor = parent.dataset.dfnFor;
  }

  // Assure that it's data-dfn-for= something.
  if (!dfn.dataset.dfnFor) {
    const msg = `Internal slot "${title}" must be associated with a WebIDL interface.`;
    const hint = docLink`Use a ${"[data-dfn-for]"} attribute to associate this dfn with a WebIDL interface.`;
    showError(msg, name, { hint, elements: [dfn] });
  }

  // Don't export internal slots by default, as they are not supposed to be public.
  if (!dfn.dataset.hasOwnProperty("export")) dfn.dataset.noexport = "";

  // If it ends with a ), then it's method. Attribute otherwise.
  const derivedType = title.endsWith(")") ? "method" : "attribute";
  if (!dfn.dataset.dfnType) {
    return derivedType;
  }

  // Perform validation on the dfn's type.
  const allowedSlotTypes = ["attribute", "method"];
  const { dfnType } = dfn.dataset;
  if (!allowedSlotTypes.includes(dfnType) || derivedType !== dfnType) {
    const msg = docLink`Invalid ${"[data-dfn-type]"} attribute on internal slot.`;
    const prettyTypes = codedJoinOr(allowedSlotTypes, {
      quotes: true,
    });
    const hint = `The only allowed types are: ${prettyTypes}. The slot "${title}" seems to be a "${toMDCode(
      derivedType
    )}"?`;
    showError(msg, name, { hint, elements: [dfn] });
    return "dfn";
  }
  return dfnType;
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
