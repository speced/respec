// Module core/webidl
//  Highlights and links WebIDL marked up inside <pre class="idl">.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!
import { flatten, normalizePadding, reindent } from "./utils";
import css from "../deps/text!core/css/webidl.css";
import { findDfn } from "./dfn-finder";
import hyperHTML from "../deps/hyperhtml";
import { pub } from "./pubsubhub";
import webidl2 from "../deps/webidl2";
import webidl2writer from "../deps/webidl2writer";

export const name = "core/webidl";

const extendedAttributesLinks = new Map([
  ["AllowShared", "WEBIDL#AllowShared"],
  ["CEReactions", "HTML#cereactions"],
  ["Clamp", "WEBIDL#Clamp"],
  ["Constructor", "WEBIDL#Constructor"],
  ["Default", "WEBIDL#Default"],
  ["EnforceRange", "WEBIDL#EnforceRange"],
  ["Exposed", "WEBIDL#Exposed"],
  ["Global", "WEBIDL#Global"],
  ["HTMLConstructor", "HTML#htmlconstructor"],
  [
    "LegacyUnenumerableNamedProperties",
    "WEBIDL#LegacyUnenumerableNamedProperties",
  ],
  ["LegacyWindowAlias", "WEBIDL#LegacyWindowAlias"],
  ["LenientSetter", "WEBIDL#LenientSetter"],
  ["LenientThis", "WEBIDL#LenientThis"],
  ["NamedConstructor", "WEBIDL#NamedConstructor"],
  ["NewObject", "WEBIDL#NewObject"],
  ["NoInterfaceObject", "WEBIDL#NoInterfaceObject"],
  ["OverrideBuiltins", "WEBIDL#OverrideBuiltins"],
  ["PutForwards", "WEBIDL#PutForwards"],
  ["Replaceable", "WEBIDL#Replaceable"],
  ["SameObject", "WEBIDL#SameObject"],
  ["SecureContext", "WEBIDL#SecureContext"],
  ["TreatNonObjectAsNull", "WEBIDL#TreatNonObjectAsNull"],
  ["TreatNullAs", "WEBIDL#TreatNullAs"],
  ["Unforgeable", "WEBIDL#Unforgeable"],
  ["Unscopable", "WEBIDL#Unscopable"],
]);

const standardTypes = new Map([
  ["any", "WEBIDL#idl-any"],
  ["ArrayBuffer", "WEBIDL#idl-ArrayBuffer"],
  ["boolean", "WEBIDL#idl-boolean"],
  ["Buffer", "WEBIDL#idl-Buffer"],
  ["byte", "WEBIDL#idl-byte"],
  ["ByteString", "WEBIDL#idl-ByteString"],
  ["DataView", "WEBIDL#idl-DataView"],
  ["DOMException", "WEBIDL#idl-DOMException"],
  ["DOMString", "WEBIDL#idl-DOMString"],
  ["double", "WEBIDL#idl-double"],
  ["Error", "WEBIDL#idl-Error"],
  ["EventHandler", "HTML#eventhandler"],
  ["float", "WEBIDL#idl-float"],
  ["Float32Array", "WEBIDL#idl-Float32Array"],
  ["Float64Array", "WEBIDL#idl-Float64Array"],
  ["FrozenArray", "WEBIDL#idl-frozen-array"],
  ["Int16Array", "WEBIDL#idl-Int16Array"],
  ["Int32Array", "WEBIDL#idl-Int32Array"],
  ["Int8Array", "WEBIDL#idl-Int8Array"],
  ["long long", "WEBIDL#idl-long-long"],
  ["long", "WEBIDL#idl-long"],
  ["object", "WEBIDL#idl-object"],
  ["octet", "WEBIDL#idl-octet"],
  ["Promise", "WEBIDL#idl-promise"],
  ["record", "WEBIDL#idl-record"],
  ["sequence", "WEBIDL#idl-sequence"],
  ["short", "WEBIDL#idl-short"],
  ["Uint16Array", "WEBIDL#idl-Uint16Array"],
  ["Uint32Array", "WEBIDL#idl-Uint32Array"],
  ["Uint8Array", "WEBIDL#idl-Uint8Array"],
  ["Uint8ClampedArray", "WEBIDL#dl-Uint8ClampedArray"],
  ["unrestricted double", "WEBIDL#idl-unrestricted-double"],
  ["unrestricted float", "WEBIDL#idl-unrestricted-float"],
  ["unsigned long long", "WEBIDL#idl-unsigned-long-long"],
  ["unsigned long", "WEBIDL#idl-unsigned-long"],
  ["unsigned short", "WEBIDL#idl-unsigned-short"],
  ["USVString", "WEBIDL#idl-USVString"],
]);

const operationNames = {};
const idlPartials = {};

// Takes the result of WebIDL2.parse(), an array of definitions.
function makeMarkup(parse, definitionMap, { suppressWarnings } = {}) {
  const templates = {
    wrap(items) {
      return items
        .reduce(flatten, [])
        .map(x => (typeof x === "string" ? new Text(x) : x));
    },
    trivia(t) {
      if (!t.trim()) {
        return t;
      }
      return hyperHTML`<span class='idlSectionComment'>${t}</span>`;
    },
    reference(wrapped, name) {
      if (standardTypes.has(name)) {
        return hyperHTML`<a data-cite='${standardTypes.get(
          name
        )}'>${wrapped}</a>`;
      }
      return hyperHTML`<a data-link-for="">${wrapped}</a>`;
    },
    name(escaped, { data, parent }) {
      if (data.idlType && data.idlType.type === "argument-type") {
        return hyperHTML`<span class="idlParamName">${escaped}</span>`;
      }
      const parentName = parent ? parent.name : "";
      const { name } = getNameAndId(data, parentName);
      const dfn = findDfn(data, name, definitionMap, {
        parent: parentName,
        suppressWarnings,
      });
      const idlAnchor = createIdlAnchor(escaped, data, parentName, dfn);
      const className = parent ? "idlName" : "idlID";
      if (data.type === "enum-value") {
        return idlAnchor;
      }
      return hyperHTML`<span class="${className}">${idlAnchor}</span>`;
    },
    type: contents => hyperHTML`<span class="idlType">${contents}</span>`,
    inheritance: contents =>
      hyperHTML`<span class="idlSuperclass">${contents}</span>`,
    definition: createIdlElement,
    extendedAttribute: contents =>
      hyperHTML`<span class="extAttr">${contents}</span>`,
    extendedAttributeReference(name) {
      if (!extendedAttributesLinks.has(name)) {
        return hyperHTML`<a>${name}</a>`;
      }
      return hyperHTML`<a data-cite="${extendedAttributesLinks.get(
        name
      )}">${name}</a>`;
    },
  };
  const result = webidl2writer.write(parse, { templates });
  return hyperHTML`<pre class="def idl">${result}</pre>`;
}

function createIdlAnchor(escaped, data, parentName, dfn) {
  if (dfn) {
    return hyperHTML`<a data-link-for="${parentName.toLowerCase()}" data-lt="${dfn
      .dataset.lt || ""}">${escaped}</a>`;
  }
  const isDefaultJSON =
    data.body &&
    data.body.name &&
    data.body.name.value === "toJSON" &&
    data.extAttrs &&
    data.extAttrs.items.some(({ name }) => name === "Default");
  if (isDefaultJSON) {
    return hyperHTML`<a data-cite="WEBIDL#default-tojson-operation">${escaped}</a>`;
  }
  return escaped;
}

function createIdlElement(contents, { data, parent }) {
  const className = getIdlDefinitionClassName(data);
  switch (data.type) {
    case "includes":
    case "enum-value":
      return hyperHTML`<span class='${className}'>${contents}</span>`;
  }
  const parentName = parent ? parent.name : "";
  const { name, idlId } = getNameAndId(data, parentName);
  return hyperHTML`<span class='${className}' id='${idlId}' data-idl data-title='${name}'>${contents}</span>`;
}

function getIdlDefinitionClassName(defn) {
  switch (defn.type) {
    case "callback interface":
      return "idlInterface";
    case "operation":
      return "idlMethod";
    case "field":
      return "idlMember";
    case "enum-value":
      return "idlEnumItem";
    case "callback function":
      return "idlCallback";
  }
  return `idl${defn.type[0].toUpperCase()}${defn.type.slice(1)}`;
}

const nameResolverMap = new WeakMap();
function getNameAndId(defn, parent = "") {
  if (nameResolverMap.has(defn)) {
    return nameResolverMap.get(defn);
  }
  const result = resolveNameAndId(defn, parent);
  nameResolverMap.set(defn, result);
  return result;
}

function resolveNameAndId(defn, parent) {
  let name = getDefnName(defn);
  let idlId = getIdlId(name, parent);
  switch (defn.type) {
    // Top-level entities with linkable members.
    case "callback interface":
    case "dictionary":
    case "interface":
    case "interface mixin": {
      idlId += resolvePartial(defn);
      break;
    }
    case "operation": {
      const overload = resolveOverload(name, parent);
      if (overload) {
        name += overload;
      } else if (defn.body && defn.body.arguments.length) {
        idlId += defn.body.arguments
          .map(arg => `-${arg.name.toLowerCase()}`)
          .join("");
      }
      break;
    }
  }
  return { name, idlId };
}

function resolvePartial(defn) {
  if (!defn.partial) {
    return "";
  }
  if (!idlPartials[defn.name]) {
    idlPartials[defn.name] = 0;
  }
  idlPartials[defn.name] += 1;
  return "-partial-" + idlPartials[defn.name];
}

function resolveOverload(name, parentName) {
  const qualifiedName = parentName + "." + name;
  const fullyQualifiedName = qualifiedName + "()";
  let overload;
  if (!operationNames[fullyQualifiedName]) {
    operationNames[fullyQualifiedName] = 0;
  }
  if (!operationNames[qualifiedName]) {
    operationNames[qualifiedName] = 0;
  } else {
    overload = "!overload-" + operationNames[qualifiedName];
  }
  operationNames[fullyQualifiedName] += 1;
  operationNames[qualifiedName] += 1;
  return overload || "";
}

function getIdlId(name, parentName) {
  if (!parentName) {
    return `idl-def-${name.toLowerCase()}`;
  }
  return `idl-def-${parentName.toLowerCase()}-${name.toLowerCase()}`;
}

function getDefnName(defn) {
  if (defn.type === "enum-value") {
    return defn.value;
  } else if (defn.type !== "operation") {
    return defn.name || defn.type;
  } else if (defn.body && defn.body.name) {
    return defn.body.name.value;
  }
  return "";
}

export function run(conf) {
  const idls = document.querySelectorAll("pre.idl");
  if (!idls.length) {
    return;
  }
  if (!document.querySelector(".idl:not(pre)")) {
    const link = document.querySelector("head link");
    if (link) {
      const style = document.createElement("style");
      style.textContent = css;
      link.parentElement.insertBefore(style, link);
    }
  }

  idls.forEach(idlElement => {
    let parse;
    try {
      const idl = reindent(idlElement.textContent);
      parse = webidl2.parse(idl);
    } catch (e) {
      pub(
        "error",
        `Failed to parse WebIDL: ${e.message}.
        <details>
        <pre>${normalizePadding(idlElement.textContent)}\n ${e}</pre>
        </details>`
      );
      // Skip this <pre> and move on to the next one.
      return;
    }
    // linkDefinitions(parse, conf.definitionMap, "", idlElement);
    const newElement = makeMarkup(parse, conf.definitionMap, {
      suppressWarnings: idlElement.classList.contains("no-link-warnings"),
    });
    if (idlElement.id) newElement.id = idlElement.id;
    newElement.querySelectorAll("[data-idl]").forEach(elem => {
      const title = elem.dataset.title.toLowerCase();
      // Select the nearest ancestor element that can contain members.
      const parent = elem.parentElement.closest("[data-idl][data-title]");
      if (parent) {
        elem.dataset.dfnFor = parent.dataset.title.toLowerCase();
      }
      if (!conf.definitionMap[title]) {
        conf.definitionMap[title] = [];
      }
      conf.definitionMap[title].push(elem);
    });
    idlElement.replaceWith(newElement);
    newElement.classList.add(...idlElement.classList);
  });
  document.normalize();
}
