// @ts-check
import { wrapInner } from "./utils.js";

/**
 * @param {HTMLElement} dfn
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
export function decorateDfn(dfn, defn, parent, name) {
  parent = parent.toLowerCase();
  if (!dfn.id) {
    const middle = parent ? `${parent}-` : "";
    let last = name
      .toLowerCase()
      .replace(/[()]/g, "")
      .replace(/\s/g, "-");
    if (last === "") last = "the-empty-string";
    dfn.id = `dom-${middle}${last}`;
  }
  dfn.dataset.idl = defn.type;
  dfn.dataset.title = dfn.textContent;
  dfn.dataset.dfnFor = parent;
  // Derive the data-type for dictionary members, interface attributes,
  // and methods
  switch (defn.type) {
    case "operation":
    case "attribute":
    case "field":
      dfn.dataset.type = getDataType(defn);
      break;
  }

  // Mark the definition as code.
  if (!dfn.querySelector("code") && !dfn.closest("code") && dfn.children) {
    wrapInner(dfn, dfn.ownerDocument.createElement("code"));
  }
  return dfn;
}

/**
 * @return {string}
 */
function getDataType(idlStruct) {
  const { idlType, generic, union } = idlStruct;
  if (typeof idlType === "string") return idlType;
  if (generic) return generic;
  // join on "|" handles for "unsigned short" etc.
  if (union) return idlType.map(getDataType).join("|");
  return getDataType(idlType);
}
