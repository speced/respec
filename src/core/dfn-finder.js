// @ts-check
import { definitionMap, registerDefinition } from "./dfn-map.js";
import { showError, wrapInner } from "./utils.js";

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
  switch (defn.type) {
    case "constructor":
    case "operation":
      return findOperationDfn(defn, parent, name);
    default:
      return findNormalDfn(defn, parent, name);
  }
}

/**
 * @param {{ type: string, arguments: any[] }} idlAst
 * @param {string} parent
 * @param {string} name
 */
function getAlternativeNames(idlAst, parent, name) {
  const { type } = idlAst;
  const asQualifiedName = `${parent}.${name}`;
  switch (type) {
    case "constructor":
    case "operation": {
      // Allow linking to "method()", method(arg) and "method" name.
      const asMethodName = `${name}()`;
      const asFullyQualifiedName = `${asQualifiedName}()`;
      const asMethodWithArgs = generateMethodNamesWithArgs(
        name,
        idlAst.arguments
      );
      return {
        local: [asQualifiedName, asFullyQualifiedName, name],
        exportable: [asMethodName, ...asMethodWithArgs],
      };
    }
    case "attribute":
      return {
        local: [asQualifiedName],
        exportable: [name],
      };
  }
}

/**
 * Generates all possible permutations of a method name based
 * on what arguments they method accepts.

 * Required arguments are always present, and optional ones
 * are stacked one by one.
 *
 * For examples: foo(req1, req2), foo(req1, req2, opt1) and so on.
 *
 * @param {String} operationName
 * @param {*} argsAst
 */
function generateMethodNamesWithArgs(operationName, argsAst) {
  const operationNames = [];
  if (argsAst.length === 0) {
    return operationNames;
  }
  const required = []; // required arguments
  const optional = []; // optional arguments, including variadic ones
  for (const { name, optional: isOptional, variadic } of argsAst) {
    if (isOptional || variadic) {
      optional.push(name);
    } else {
      required.push(name);
    }
  }
  const requiredArgs = required.join(", ");
  const requiredOperation = `${operationName}(${requiredArgs})`;
  operationNames.push(requiredOperation);
  const optionalOps = optional.map((_, index) => {
    const args = [...required, ...optional.slice(0, index + 1)].join(", ");
    const result = `${operationName}(${args})`;
    return result;
  });
  operationNames.push(...optionalOps);
  return operationNames;
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
  return findNormalDfn(defn, parent, asMethodName, name);
}

/**
 * @param {HTMLElement} dfn
 * @param {Record<"local" | "exportable", string[]>} names
 */
function addAlternativeNames(dfn, names) {
  const { local, exportable } = names;
  const lt = dfn.dataset.lt ? new Set(dfn.dataset.lt.split("|")) : new Set();
  for (const item of exportable) {
    lt.add(item);
  }
  // Fix any ill-placed ones - local ones don't belong here
  local.filter(item => lt.has(item)).forEach(item => lt.delete(item));
  dfn.dataset.lt = [...lt].join("|");
  dfn.dataset.localLt = local.join("|");
  registerDefinition(dfn, [...local, ...exportable]);
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {...string} names
 */
function findNormalDfn(defn, parent, ...names) {
  const { type } = defn;
  for (const name of names) {
    let resolvedName =
      type === "enum-value" && name === "" ? "the-empty-string" : name;
    let dfns = getDfns(resolvedName, parent, name, type);
    // If we haven't found any definitions with explicit [for]
    // and [title], look for a dotted definition, "parent.name".
    if (dfns.length === 0 && parent !== "") {
      resolvedName = `${parent}.${resolvedName}`;
      const alternativeDfns = definitionMap.get(resolvedName);
      if (alternativeDfns && alternativeDfns.size === 1) {
        dfns = [...alternativeDfns];
        registerDefinition(dfns[0], [resolvedName]);
      }
    } else {
      resolvedName = name;
    }
    if (dfns.length > 1) {
      const msg = `WebIDL identifier \`${name}\` ${
        parent ? `for \`${parent}\`` : ""
      } is defined multiple times`;
      const title = "Duplicate definition.";
      showError(msg, name, { title, elements: dfns });
    }
    if (dfns.length) {
      return dfns[0];
    }
  }
}

/**
 * @param {HTMLElement} dfnElem
 * @param {*} idlAst
 * @param {string} parent
 * @param {string} name
 */
export function decorateDfn(dfnElem, idlAst, parent, name) {
  if (!dfnElem.id) {
    const lCaseParent = parent.toLowerCase();
    const middle = lCaseParent ? `${lCaseParent}-` : "";
    let last = name.toLowerCase().replace(/[()]/g, "").replace(/\s/g, "-");
    if (last === "") {
      last = "the-empty-string";
      dfnElem.setAttribute("aria-label", "the empty string");
    }
    dfnElem.id = `dom-${middle}${last}`;
  }
  dfnElem.dataset.idl = idlAst.type;
  dfnElem.dataset.title = dfnElem.textContent;
  dfnElem.dataset.dfnFor = parent;
  // Derive the data-type for dictionary members, interface attributes,
  // and methods
  switch (idlAst.type) {
    case "operation":
    case "attribute":
    case "field":
      dfnElem.dataset.type = getDataType(idlAst);
      break;
  }

  // Mark the definition as code.
  if (
    !dfnElem.querySelector("code") &&
    !dfnElem.closest("code") &&
    dfnElem.children
  ) {
    wrapInner(dfnElem, dfnElem.ownerDocument.createElement("code"));
  }

  // Add data-lt and data-local-lt values and register them
  switch (idlAst.type) {
    case "attribute":
    case "constructor":
    case "operation":
      addAlternativeNames(dfnElem, getAlternativeNames(idlAst, parent, name));
      break;
  }

  return dfnElem;
}

/**
 * @param {string} name
 * @param {string} parent data-dfn-for
 * @param {string} originalName
 * @param {string} type
 */
function getDfns(name, parent, originalName, type) {
  const foundDfns = definitionMap.get(name);
  if (!foundDfns || foundDfns.size === 0) {
    return [];
  }
  const dfnForArray = [...foundDfns];
  // Definitions that have a name and [data-dfn-for] that exactly match the
  // IDL entity:
  const dfns = dfnForArray.filter(dfn => {
    // This is explicitly marked as a concept, so we can't use it
    if (dfn.dataset.dfnType === "dfn") return false;

    /** @type {HTMLElement} */
    const closestDfnFor = dfn.closest(`[data-dfn-for]`);
    return closestDfnFor && closestDfnFor.dataset.dfnFor === parent;
  });

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
function getDataType(idlStruct = {}) {
  const { idlType, generic, union } = idlStruct;
  if (idlType === undefined) return "";
  if (typeof idlType === "string") return idlType;
  if (generic) return generic;
  // join on "|" handles for "unsigned short" etc.
  if (union) return idlType.map(getDataType).join("|");
  return getDataType(idlType);
}
