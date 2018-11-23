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

// This function looks for a <dfn> element whose title is 'name' and
// that is "for" 'parent', which is the empty string when 'name'
// refers to a top-level entity. For top-level entities, <dfn>
// elements that inherit a non-empty [dfn-for] attribute are also
// counted as matching.
//
// When a matching <dfn> is found, it's given <code> formatting,
// marked as an IDL definition, and returned. If no <dfn> is found,
// the function returns 'undefined'.
export function findDfn(defn, parent, name, definitionMap, idlElem) {
  return (
    findAttributeDfn(defn, parent, name, definitionMap, idlElem) ||
    findOperationDfn(defn, parent, name, definitionMap, idlElem) ||
    findNormalDfn(defn, parent, name, definitionMap, idlElem)
  );
}

function findAttributeDfn(defn, parent, name, definitionMap, idlElem) {
  if (defn.type !== "attribute") {
    return;
  }
  parent = parent.toLowerCase();
  const asLocalName = name.toLowerCase();
  const asQualifiedName = parent + "." + asLocalName;
  let dfn;
  if (definitionMap[asQualifiedName] || definitionMap[asLocalName]) {
    dfn = findNormalDfn(defn, parent, asLocalName, definitionMap, idlElem);
  }
  if (!dfn) {
    return; // try finding dfn using name, using normal search path...
  }
  const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
  lt.push(asQualifiedName, asLocalName);
  dfn.dataset.lt = [...new Set(lt)].join("|");
  return dfn;
}

function findOperationDfn(defn, parent, name, definitionMap, idlElem) {
  if (defn.type !== "operation") {
    return;
  }
  // Overloads all have unique names
  if (name.search("!overload") !== -1) {
    return;
  }
  parent = parent.toLowerCase();
  // Allow linking to both "method()" and "method" name.
  const asLocalName = name.toLowerCase();
  const asMethodName = asLocalName + "()";
  const asQualifiedName = parent + "." + asLocalName;
  const asFullyQualifiedName = asQualifiedName + "()";

  if (
    definitionMap[asMethodName] ||
    definitionMap[asFullyQualifiedName.toLowerCase()]
  ) {
    const lookupName = definitionMap[asMethodName]
      ? asMethodName
      : asFullyQualifiedName;
    const dfn = findNormalDfn(defn, parent, lookupName, definitionMap, idlElem);
    if (!dfn) {
      return; // try finding dfn using name, using normal search path...
    }
    const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
    lt.push(asFullyQualifiedName, asQualifiedName, lookupName, asLocalName);
    dfn.dataset.lt = lt.join("|");
    if (!definitionMap[asLocalName]) {
      definitionMap[asLocalName] = [];
    }
    definitionMap[asLocalName].push(dfn);
    return dfn;
  }
  // no method alias, so let's find the dfn and add it
  const dfn = findNormalDfn(defn, parent, name, definitionMap, idlElem);
  if (!dfn) {
    return;
  }
  const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
  lt.push(asMethodName, name);
  dfn.dataset.lt = lt.reverse().join("|");
  definitionMap[asMethodName] = [dfn];
  return dfn;
}

function findNormalDfn(defn, parent, name, definitionMap, idlElem) {
  if (unlinkable.has(name)) {
    return;
  }
  const originalParent = parent;
  const originalName = name;
  parent = parent.toLowerCase();
  name =
    defn.type === "enum-value" && name === ""
      ? "the-empty-string"
      : name.toLowerCase();
  let dfnForArray = definitionMap[name];
  let dfns = getDfns(dfnForArray, parent, originalName, defn.type);
  // If we haven't found any definitions with explicit [for]
  // and [title], look for a dotted definition, "parent.name".
  if (dfns.length === 0 && parent !== "") {
    const dottedName = parent + "." + name;
    dfnForArray = definitionMap[dottedName];
    if (dfnForArray !== undefined && dfnForArray.length === 1) {
      dfns = dfnForArray;
      // Found it: update the definition to specify its [for] and data-lt.
      delete definitionMap[dottedName];
      dfns[0].dataset.dfnFor = parent;
      dfns[0].dataset.lt = name;
      if (definitionMap[name] === undefined) {
        definitionMap[name] = [];
      }
      definitionMap[name].push(dfns[0]);
    }
  }
  if (dfns.length > 1) {
    const msg = `Multiple \`<dfn>\`s for \`${originalName}\` ${
      originalParent ? `in \`${originalParent}\`` : ""
    }`;
    pub("error", msg);
  }
  if (dfns.length === 0) {
    const showWarnings =
      idlElem &&
      name &&
      idlElem.classList.contains("no-link-warnings") === false;
    if (showWarnings) {
      const name =
        defn.type === "operation" ? `${originalName}()` : originalName;
      const parentName = originalParent ? ` \`${originalParent}\`'s` : "";
      let msg = `Missing \`<dfn>\` for${parentName} \`${name}\` ${defn.type}`;
      msg +=
        ". [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).";
      pub("warn", msg);
    }
    return;
  }
  return decorateDfn(dfns[0], defn, parent, name, defn.type);
}

function decorateDfn(dfn, defn, parent, name, type) {
  if (!dfn.id) {
    const id =
      "dom-" +
      (parent ? parent + "-" : "") +
      name.replace(/[()]/g, "").replace(/\s/g, "-");
    dfn.id = id;
  }
  dfn.dataset.idl = type || defn.type;
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

function getDataType(idlStruct) {
  const { idlType, baseName, generic, type, body, union } = idlStruct;
  if (typeof idlType === "string") return idlType;
  if (generic) return generic.value;
  if (type === "operation") return getDataType(body.idlType);
  // join on "|" handles for "unsigned short" etc.
  if (union) return idlType.map(getDataType).join("|");
  return baseName ? baseName : getDataType(idlType);
}
