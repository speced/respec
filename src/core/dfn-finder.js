// @ts-check
import { definitionMap, registerDefinition } from "./dfn-map";
import { pub } from "./pubsubhub";
import { wrapInner } from "./utils";

const topLevelEntities = new Set([
  "callback interface",
  "callback",
  "dictionary",
  "enum",
  "interface mixin",
  "interface",
  "typedef",
]);

// TODO: make these linkable somehow.
// https://github.com/w3c/respec/issues/999
// https://github.com/w3c/respec/issues/982
const unlinkable = new Set(["maplike", "setlike", "stringifier"]);

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
 * @param {{ parent?: string; suppressWarnings?: boolean }} options
 */
export function findDfn(
  defn,
  name,
  { parent = "", suppressWarnings = false } = {}
) {
  if (unlinkable.has(name)) {
    return;
  }
  const dfn = tryFindDfn(defn, parent, name);
  if (dfn) {
    return dfn;
  }
  const showWarnings = name && !(suppressWarnings || defn.type === "typedef");
  if (showWarnings) {
    const styledName = defn.type === "operation" ? `${name}()` : name;
    const ofParent = parent ? ` \`${parent}\`'s` : "";
    pub(
      "warn",
      `Missing \`<dfn>\` for${ofParent} \`${styledName}\` ${
        defn.type
      }. [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).`
    );
  }
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
  const parentLow = parent.toLowerCase();
  const asLocalName = name.toLowerCase();
  const asQualifiedName = `${parentLow}.${asLocalName}`;
  const dfn = findNormalDfn(defn, parent, asLocalName);
  if (!dfn) {
    return;
  }
  addAlternativeNames(dfn, [asQualifiedName, asLocalName]);
  return dfn;
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
  const parentLow = parent.toLowerCase();
  // Allow linking to both "method()" and "method" name.
  const asLocalName = name.toLowerCase();
  const asMethodName = `${asLocalName}()`;
  const asQualifiedName = `${parentLow}.${asLocalName}`;
  const asFullyQualifiedName = `${asQualifiedName}()`;

  const dfn =
    findNormalDfn(defn, parent, asMethodName) ||
    findNormalDfn(defn, parent, name);
  if (!dfn) {
    return;
  }
  addAlternativeNames(dfn, [
    asFullyQualifiedName,
    asQualifiedName,
    asMethodName,
    asLocalName,
  ]);
  return dfn;
}

/**
 * @param {HTMLElement} dfn
 * @param {string[]} names
 */
function addAlternativeNames(dfn, names) {
  const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
  lt.push(...names);
  dfn.dataset.lt = [...new Set(lt)].join("|");
  registerDefinition(dfn, names);
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
function findNormalDfn(defn, parent, name) {
  const parentLow = parent.toLowerCase();
  let resolvedName =
    defn.type === "enum-value" && name === "" ? "the-empty-string" : name;
  const nameLow = resolvedName.toLowerCase();
  let dfnForArray = definitionMap[nameLow];
  let dfns = getDfns(dfnForArray, parentLow, name, defn.type);
  // If we haven't found any definitions with explicit [for]
  // and [title], look for a dotted definition, "parent.name".
  if (dfns.length === 0 && parentLow !== "") {
    resolvedName = `${parentLow}.${nameLow}`;
    dfnForArray = definitionMap[resolvedName];
    if (dfnForArray !== undefined && dfnForArray.length === 1) {
      dfns = dfnForArray;
      // Found it: register with its local name
      delete definitionMap[resolvedName];
      registerDefinition(dfns[0], [nameLow]);
    }
  }
  if (dfns.length > 1) {
    const msg = `Multiple \`<dfn>\`s for \`${name}\` ${
      parent ? `in \`${parent}\`` : ""
    }`;
    pub("error", msg);
  }
  if (dfns.length) {
    if (name !== resolvedName) {
      dfns[0].dataset.lt = resolvedName;
    }
    return decorateDfn(dfns[0], defn, parentLow, nameLow);
  }
}

/**
 * @param {HTMLElement} dfn
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
function decorateDfn(dfn, defn, parent, name) {
  if (!dfn.id) {
    const middle = parent ? `${parent}-` : "";
    const last = name.replace(/[()]/g, "").replace(/\s/g, "-");
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
 * @param {HTMLElement[]} dfnForArray
 * @param {string} parent
 * @param {string} originalName
 * @param {string} type
 */
function getDfns(dfnForArray, parent, originalName, type) {
  if (!dfnForArray) {
    return [];
  }
  // Definitions that have a title and [data-dfn-for] that exactly match the
  // IDL entity:
  const dfns = dfnForArray.filter(dfn =>
    dfn.closest(`[data-dfn-for="${parent}"]`)
  );
  // If this is a top-level entity, and we didn't find anything with
  // an explicitly empty [for], try <dfn> that inherited a [for].
  if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
    return dfnForArray;
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
  const { idlType, baseName, generic, type, body, union } = idlStruct;
  if (typeof idlType === "string") return idlType;
  if (generic) return generic.value;
  if (type === "operation") return getDataType(body.idlType);
  // join on "|" handles for "unsigned short" etc.
  if (union) return idlType.map(getDataType).join("|");
  return baseName ? baseName : getDataType(idlType);
}
