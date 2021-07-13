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
import { registerDefinition } from "./dfn-map.js";
import { slotRegex } from "./inline-idl-parser.js";
import { sub } from "./pubsubhub.js";

export const name = "core/dfn";

export function run() {
  for (const dfn of document.querySelectorAll("dfn")) {
    const titles = getDfnTitles(dfn);
    registerDefinition(dfn, titles);

    const [linkingText] = titles;
    // Matches attributes and methods, like [[some words]](with, optional, arguments)
    // but ignores legacy data-cite="foo#bar" (e.g., a link to a slot in the ES6 spec)
    if (!dfn.dataset.cite && slotRegex.test(linkingText)) {
      processAsInternalSlot(linkingText, dfn);
    }

    // Only add `lt`s that are different from the text content
    if (titles.length === 1 && linkingText === norm(dfn.textContent)) {
      continue;
    }
    dfn.dataset.lt = titles.join("|");
  }
  sub("plugins-done", addContractDefaults);
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
    dfn.dataset.dfnType = derivedType;
    return;
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
  }
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
