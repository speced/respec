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

export function findDfn_(
  defn,
  { parent, name, originalParent, originalName, definitionMap, type, idlElem }
) {
  let dfnForArray = definitionMap[name];
  let dfns = [];
  if (dfnForArray) {
    // Definitions that have a title and [data-dfn-for] that exactly match the
    // IDL entity:
    dfns = dfnForArray.filter(dfn => dfn.closest(`[data-dfn-for="${parent}"]`));
    // If this is a top-level entity, and we didn't find anything with
    // an explicitly empty [for], try <dfn> that inherited a [for].
    if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
      dfns = dfnForArray;
    } else if (topLevelEntities.has(type) && dfnForArray.length) {
      const dfn = dfnForArray.find(
        dfn => dfn.textContent.trim() === originalName
      );
      if (dfn) dfns = [dfn];
    }
  }
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
      type &&
      idlElem &&
      name &&
      idlElem.classList.contains("no-link-warnings") === false;
    if (showWarnings) {
      const name = type === "operation" ? `${originalName}()` : originalName;
      const parentName = originalParent ? ` \`${originalParent}\`'s` : "";
      let msg = `Missing \`<dfn>\` for${parentName} \`${name}\` ${type}`;
      msg +=
        ". [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).";
      pub("warn", msg);
    }
    return;
  }
  const [dfn] = dfns;
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

function getDataType(idlStruct) {
  const { idlType, baseName, generic, type, body, union } = idlStruct;
  if (typeof idlType === "string") return idlType;
  if (generic) return generic.value;
  if (type === "operation") return getDataType(body.idlType);
  // join on "|" handles for "unsigned short" etc.
  if (union) return idlType.map(getDataType).join("|");
  return baseName ? baseName : getDataType(idlType);
}
