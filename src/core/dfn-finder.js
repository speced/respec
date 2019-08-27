// @ts-check
import { definitionMap, registerDefinition } from "./dfn-map.js";
import { showInlineError, wrapInner } from "./utils.js";

const topLevelEntities = new Set([
  "callback interface",
  "callback",
  "dictionary",
  "enum",
  "interface mixin",
  "interface",
  "typedef",
]);

/**
 * This function looks for a <dfn> element whose title is 'name' and
 * that is "for" 'parent', which is the empty string when 'name'
 * refers to a top-level entity. For top-level entities, <dfn>
 * elements that inherit a non-empty [dfn-for] attribute are also
 * counted as matching.
 *
 * When a matching <dfn> is found, it's given <code> formatting,
 * marked as an IDL definition, and returned. If no <dfn> is found,
 * the function returns 'undefined'.
 * @param {*} defn
 * @param {string} name
 */
export function findDfn(defn, name, { parent = "" } = {}) {
  return tryFindDfn(defn, parent, name);
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
function tryFindDfn(defn, parent, name) {
  switch (defn.type) {
    case "attribute":
      return findAttributeDfn(defn, parent, name);
    case "operation":
      return findOperationDfn(defn, parent, name);
    default:
      return findNormalDfn(defn, parent, name);
  }
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
function findAttributeDfn(defn, parent, name) {
  const dfn = findNormalDfn(defn, parent, name);
  if (!dfn) {
    return;
  }
  addAlternativeNames(dfn, getAlternativeNames("attribute", parent, name));
  return dfn;
}

function getAlternativeNames(type, parent, name) {
  const asQualifiedName = `${parent}.${name}`;
  switch (type) {
    case "operation": {
      // Allow linking to both "method()" and "method" name.
      const asMethodName = `${name}()`;
      const asFullyQualifiedName = `${asQualifiedName}()`;
      return [asFullyQualifiedName, asQualifiedName, asMethodName, name];
    }
    case "attribute":
      return [asQualifiedName, name];
  }
  return;
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
function findOperationDfn(defn, parent, name) {
  // Overloads all have unique names
  if (name.includes("!overload")) {
    return findNormalDfn(defn, parent, name);
  }
  const asMethodName = `${name}()`;
  const dfn = findNormalDfn(defn, parent, asMethodName, name);
  if (!dfn) {
    return;
  }
  addAlternativeNames(dfn, getAlternativeNames("operation", parent, name));
  return dfn;
}

/**
 * @param {HTMLElement} dfn
 * @param {string[]} names
 */
export function addAlternativeNames(dfn, names) {
  const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
  lt.push(...names);
  dfn.dataset.lt = [...new Set(lt)].join("|");
  registerDefinition(dfn, names);
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {string[]} names
 */
function findNormalDfn(defn, parent, ...names) {
  for (const name of names) {
    let resolvedName =
      defn.type === "enum-value" && name === ""
        ? "the-empty-string"
        : name.toLowerCase();
    let dfnForArray = definitionMap[resolvedName];
    let dfns = getDfns(dfnForArray, parent, name, defn.type);
    // If we haven't found any definitions with explicit [for]
    // and [title], look for a dotted definition, "parent.name".
    if (dfns.length === 0 && parent !== "") {
      resolvedName = `${parent}.${resolvedName}`;
      dfnForArray = definitionMap[resolvedName.toLowerCase()];
      if (dfnForArray !== undefined && dfnForArray.length === 1) {
        dfns = dfnForArray;
        // Found it: register with its local name
        delete definitionMap[resolvedName];
        registerDefinition(dfns[0], [resolvedName]);
      }
    }
    if (dfns.length > 1) {
      const msg = `WebIDL identifier \`${name}\` ${
        parent ? `for \`${parent}\`` : ""
      } is defined multiple times`;
      showInlineError(dfns, msg, "Duplicate definition.");
    }
    if (dfns.length) {
      if (name !== resolvedName) {
        dfns[0].dataset.lt = resolvedName;
      }
      return dfns[0];
    }
  }
}

/**
 * @param {HTMLElement} dfn
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
export function decorateDfn(dfn, defn, parent, name) {
  if (!dfn.id) {
    const lCaseParent = parent.toLowerCase();
    const middle = lCaseParent ? `${lCaseParent}-` : "";
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

  // Add data-lt values and register them
  switch (defn.type) {
    case "operation":
      addAlternativeNames(dfn, getAlternativeNames("operation", parent, name));
      break;
    case "attribute":
      addAlternativeNames(dfn, getAlternativeNames("attribute", parent, name));
      break;
  }

  return dfn;
}

/**
 * @param {HTMLElement[]} dfnForArray
 * @param {string} parent - data-dfn-for
 * @param {string} originalName
 * @param {string} type
 */
function getDfns(dfnForArray, parent, originalName, type) {
  if (!dfnForArray) {
    return [];
  }
  // Definitions that have a name and [data-dfn-for] that exactly match the
  // IDL entity:
  const dfns = [];
  for (const dfn of dfnForArray) {
    /** @type {HTMLElement} */
    const closestDfnFor = dfn.closest(`[data-dfn-for]`);
    if (!closestDfnFor) {
      continue;
    }
    if (closestDfnFor.dataset.dfnFor === parent) dfns.push(dfn);
  }
  if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
    // Make sure the name exactly matches
    return dfnForArray[0].textContent === originalName ? dfnForArray : [];
  } else if (topLevelEntities.has(type) && dfnForArray.length) {
    const dfn = dfnForArray.find(
      dfn => dfn.textContent.trim() === originalName
    );
    if (dfn) return [dfn];
  }
  return dfns;
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
