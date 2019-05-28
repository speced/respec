// Module core/webidl
//  Highlights and links WebIDL marked up inside <pre class="idl">.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!
import * as webidl2 from "webidl2";
import { flatten, showInlineWarning } from "./utils.js";
import css from "text!../../assets/webidl.css";
import { findDfn } from "./dfn-finder.js";
import hyperHTML from "hyperhtml";
import { pub } from "./pubsubhub.js";
import { registerDefinition } from "./dfn-map.js";

export const name = "core/webidl";

const operationNames = {};
const idlPartials = {};

const templates = {
  wrap(items) {
    return items
      .reduce(flatten, [])
      .filter(x => x !== "")
      .map(x => (typeof x === "string" ? new Text(x) : x));
  },
  trivia(t) {
    if (!t.trim()) {
      return t;
    }
    return hyperHTML`<span class='idlSectionComment'>${t}</span>`;
  },
  generic(keyword) {
    // Shepherd classifies "interfaces" as starting with capital letters,
    // like Promise, FrozenArray, etc.
    return /^[A-Z]/.test(keyword)
      ? hyperHTML`<a data-xref-type="interface" data-cite="WebIDL">${keyword}</a>`
      : // Other keywords like sequence, maplike, etc...
        hyperHTML`<a data-xref-type="dfn" data-cite="WebIDL">${keyword}</a>`;
  },
  reference(wrapped, unescaped, context = {}) {
    const { tokens } = context;
    let type = "_IDL_";
    let cite = null;
    let lt;
    switch (unescaped) {
      case "Window":
        type = "interface";
        cite = "HTML";
        break;
      case "object":
        type = "interface";
        cite = "WebIDL";
        break;
      default: {
        const isWorkerType = unescaped.includes("Worker");
        if (isWorkerType && tokens && tokens.name.value === "Exposed") {
          lt = `${unescaped}GlobalScope`;
          type = "interface";
          cite = ["Worker", "DedicatedWorker", "SharedWorker"].includes(
            unescaped
          )
            ? "HTML"
            : null;
        }
      }
    }
    return hyperHTML`<a
      data-xref-type="${type}" data-cite="${cite}" data-lt="${lt}">${wrapped}</a>`;
  },
  name(escaped, { data, parent }) {
    if (data.idlType && data.idlType.type === "argument-type") {
      return hyperHTML`<span class="idlParamName">${escaped}</span>`;
    }
    const idlAnchor = createIdlAnchor(escaped, data, parent);
    const className = parent ? "idlName" : "idlID";
    if (data.type === "enum-value") {
      return idlAnchor;
    }
    return hyperHTML`<span class="${className}">${idlAnchor}</span>`;
  },
  type(contents) {
    return hyperHTML`<span class="idlType">${contents}</span>`;
  },
  inheritance(contents) {
    return hyperHTML`<span class="idlSuperclass">${contents}</span>`;
  },
  definition(contents, { data, parent }) {
    const className = getIdlDefinitionClassName(data);
    switch (data.type) {
      case "includes":
      case "enum-value":
        return hyperHTML`<span class='${className}'>${contents}</span>`;
    }
    const parentName = parent ? parent.name : "";
    const { name, idlId } = getNameAndId(data, parentName);
    return hyperHTML`<span class='${className}' id='${idlId}' data-idl data-title='${name}'>${contents}</span>`;
  },
  extendedAttribute(contents) {
    const result = hyperHTML`<span class="extAttr">${contents}</span>`;
    return result;
  },
  extendedAttributeReference(name) {
    return hyperHTML`<a data-xref-type="extended-attribute">${name}</a>`;
  },
};

function createIdlAnchor(escaped, data, parent) {
  const parentName = parent ? parent.name : "";
  const { name } = getNameAndId(data, parentName);
  const dfn = findDfn(data, name, {
    parent: parentName,
  });
  if (dfn) {
    return hyperHTML`<a
      data-link-for="${parentName.toLowerCase()}"
      data-lt="${dfn.dataset.lt || null}">${escaped}</a>`;
  }

  const isDefaultJSON =
    data.type === "operation" &&
    data.name === "toJSON" &&
    data.extAttrs.some(({ name }) => name === "Default");
  if (isDefaultJSON) {
    return hyperHTML`<a data-lt="default toJSON operation">${escaped}</a>`;
  }

  const unlinkedAnchor = hyperHTML`<a data-xref-type="${
    data.type
  }">${escaped}</a>`;
  const showWarnings = name && data.type !== "typedef";
  if (showWarnings) {
    const styledName = data.type === "operation" ? `${name}()` : name;
    const ofParent = parentName ? ` \`${parentName}\`'s` : "";
    const msg = `Missing \`<dfn>\` for${ofParent} \`${styledName}\` ${
      data.type
    }. [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).`;
    showInlineWarning(unlinkedAnchor, msg, "");
  }
  return unlinkedAnchor;
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
      } else if (defn.arguments.length) {
        idlId += defn.arguments
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
  return `-partial-${idlPartials[defn.name]}`;
}

function resolveOverload(name, parentName) {
  const qualifiedName = `${parentName}.${name}`;
  const fullyQualifiedName = `${qualifiedName}()`;
  let overload;
  if (!operationNames[fullyQualifiedName]) {
    operationNames[fullyQualifiedName] = 0;
  }
  if (!operationNames[qualifiedName]) {
    operationNames[qualifiedName] = 0;
  } else {
    overload = `!overload-${operationNames[qualifiedName]}`;
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
  switch (defn.type) {
    case "enum-value":
      return defn.value;
    case "operation":
      return defn.name;
    default:
      return defn.name || defn.type;
  }
}

function renderWebIDL(idlElement) {
  let parse;
  try {
    parse = webidl2.parse(idlElement.textContent);
  } catch (e) {
    pub(
      "error",
      `Failed to parse WebIDL: ${e.message}.
      <details>
      <pre>${idlElement.textContent}\n ${e}</pre>
      </details>`
    );
    // Skip this <pre> and move on to the next one.
    return;
  }
  idlElement.classList.add("def", "idl");
  const { dataset } = idlElement;
  if (dataset.cite) {
    const hasWebIDL = dataset.cite
      .split(" ")
      .map(item => item.toLowerCase())
      .includes("webidl");
    if (!hasWebIDL) {
      const newDataCite = ["WebIDL"].concat(
        dataset.cite.split(/\s+/).filter(i => i)
      );
      dataset.cite = newDataCite.join(" ");
    }
  } else {
    dataset.cite = "WebIDL";
  }
  const html = webidl2.write(parse, { templates });
  const render = hyperHTML.bind(idlElement);
  render`${html}`;
  idlElement.querySelectorAll("[data-idl]").forEach(elem => {
    const title = elem.dataset.title.toLowerCase();
    // Select the nearest ancestor element that can contain members.
    const parent = elem.parentElement.closest("[data-idl][data-title]");
    if (parent) {
      elem.dataset.dfnFor = parent.dataset.title.toLowerCase();
    }
    registerDefinition(elem, [title]);
  });
}

export function run() {
  const idls = document.querySelectorAll("pre.idl");
  if (!idls.length) {
    return;
  }
  if (!document.querySelector(".idl:not(pre)")) {
    const link = document.querySelector("head link");
    if (link) {
      const style = document.createElement("style");
      style.textContent = css;
      link.before(style);
    }
  }
  idls.forEach(renderWebIDL);
  document.normalize();
}
