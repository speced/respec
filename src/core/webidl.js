// Module core/webidl
//  Highlights and links WebIDL marked up inside <pre class="idl">.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!
import {
  addHashId,
  docLink,
  showError,
  showWarning,
  wrapInner,
  xmlEscape,
} from "./utils.js";
import { decorateDfn, findDfn } from "./dfn-finder.js";
import { html, webidl2 } from "./import-maps.js";
import { addCopyIDLButton } from "./webidl-clipboard.js";
import css from "../styles/webidl.css.js";
import { registerDefinition } from "./dfn-map.js";

export const name = "core/webidl";
const pluginName = name;

const operationNames = {};
const idlPartials = {};

const templates = {
  wrap(items) {
    return items
      .flat()
      .filter(x => x !== "")
      .map(x => (typeof x === "string" ? new Text(x) : x));
  },
  trivia(t) {
    if (!t.trim()) {
      return t;
    }
    return html`<span class="idlSectionComment">${t}</span>`;
  },
  generic(keyword) {
    // Shepherd classifies "interfaces" as starting with capital letters,
    // like Promise, FrozenArray, etc.
    return /^[A-Z]/.test(keyword)
      ? html`<a data-xref-type="interface" data-cite="WEBIDL">${keyword}</a>`
      : // Other keywords like sequence, maplike, etc...
        html`<a data-xref-type="dfn" data-cite="WEBIDL">${keyword}</a>`;
  },
  reference(wrapped, unescaped, context) {
    if (context.type === "extended-attribute" && context.name !== "Exposed") {
      return wrapped;
    }
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
        if (isWorkerType && context.type === "extended-attribute") {
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
    return html`<a data-xref-type="${type}" data-cite="${cite}" data-lt="${lt}"
      >${wrapped}</a
    >`;
  },
  name(escaped, { data, parent }) {
    if (data.idlType && data.idlType.type === "argument-type") {
      return html`<span class="idlParamName">${escaped}</span>`;
    }
    const idlLink = defineIdlName(escaped, data, parent);
    if (data.type !== "enum-value") {
      const className = parent ? "idlName" : "idlID";
      idlLink.classList.add(className);
    }
    return idlLink;
  },
  nameless(escaped, { data, parent }) {
    switch (data.type) {
      case "operation":
      case "constructor":
        return defineIdlName(escaped, data, parent);
      default:
        return escaped;
    }
  },
  type(contents) {
    return html`<span class="idlType">${contents}</span>`;
  },
  inheritance(contents) {
    return html`<span class="idlSuperclass">${contents}</span>`;
  },
  definition(contents, { data, parent }) {
    const className = getIdlDefinitionClassName(data);
    switch (data.type) {
      case "includes":
      case "enum-value":
        return html`<span class="${className}">${contents}</span>`;
    }
    const parentName = parent ? parent.name : "";
    const { name, idlId } = getNameAndId(data, parentName);
    return html`<span
      class="${className}"
      id="${idlId}"
      data-idl
      data-title="${name}"
      >${contents}</span
    >`;
  },
  extendedAttribute(contents) {
    const result = html`<span class="extAttr">${contents}</span>`;
    return result;
  },
  extendedAttributeReference(name) {
    return html`<a data-xref-type="extended-attribute">${name}</a>`;
  },
};

/**
 * Returns a link to existing <dfn> or creates one if doesn’t exists.
 */
function defineIdlName(escaped, data, parent) {
  const parentName = parent ? parent.name : "";
  const { name } = getNameAndId(data, parentName);
  const dfn = findDfn(data, name, {
    parent: parentName,
  });
  const linkType = getDfnType(data.type);
  if (dfn) {
    if (!data.partial) {
      if (!dfn.matches("[data-noexport]")) dfn.dataset.export = "";
      dfn.dataset.dfnType = linkType;
    }
    decorateDfn(dfn, data, parentName, name);
    const href = `#${dfn.id}`;
    return html`<a
      data-link-for="${parentName}"
      data-link-type="${linkType}"
      href="${href}"
      class="internalDFN"
      ><code>${escaped}</code></a
    >`;
  }

  const isDefaultJSON =
    data.type === "operation" &&
    data.name === "toJSON" &&
    data.extAttrs.some(({ name }) => name === "Default");
  if (isDefaultJSON) {
    return html`<a data-link-type="dfn" data-lt="default toJSON steps"
      >${escaped}</a
    >`;
  }
  if (!data.partial) {
    const dfn = html`<dfn data-export data-dfn-type="${linkType}"
      >${escaped}</dfn
    >`;
    registerDefinition(dfn, [name]);
    decorateDfn(dfn, data, parentName, name);
    return dfn;
  }

  const unlinkedAnchor = html`<a
    data-idl="${data.partial ? "partial" : null}"
    data-link-type="${linkType}"
    data-title="${data.name}"
    data-xref-type="${linkType}"
    >${escaped}</a
  >`;

  const showWarnings =
    name && data.type !== "typedef" && !(data.partial && !dfn);
  if (showWarnings) {
    const styledName = data.type === "operation" ? `${name}()` : name;
    const ofParent = parentName ? ` \`${parentName}\`'s` : "";
    const msg = `Missing \`<dfn>\` for${ofParent} \`${styledName}\` ${data.type}.`;
    const hint = docLink`See ${"using `data-dfn-for`|#data-dfn-for"} in ReSpec's documentation.`;
    showWarning(msg, pluginName, { elements: [unlinkedAnchor], hint });
  }
  return unlinkedAnchor;
}

/**
 * Map to Shepherd types, for export.
 * @see https://tabatkins.github.io/bikeshed/#dfn-types
 */
function getDfnType(idlType) {
  switch (idlType) {
    case "operation":
      return "method";
    case "field":
      return "dict-member";
    case "callback interface":
    case "interface mixin":
      return "interface";
    default:
      return idlType;
  }
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
  // For getters, setters, etc. "anonymous-getter",
  const prefix = defn.special && defn.name === "" ? "anonymous-" : "";
  let idlId = getIdlId(prefix + name, parent);
  switch (defn.type) {
    // Top-level entities with linkable members.
    case "callback interface":
    case "dictionary":
    case "interface":
    case "interface mixin": {
      idlId += resolvePartial(defn);
      break;
    }
    case "constructor":
    case "operation": {
      const overload = resolveOverload(name, parent);
      if (overload) {
        name += overload;
        idlId += overload;
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
      return defn.name || defn.special;
    default:
      return defn.name || defn.type;
  }
}

// IDL types that never need a data-dfn-for
const topLevelIdlTypes = [
  "interface",
  "interface mixin",
  "dictionary",
  "namespace",
  "enum",
  "typedef",
  "callback",
];

/**
 * @param {Element} idlElement
 * @param {number} index
 */
function renderWebIDL(idlElement, index) {
  let parse;
  try {
    parse = webidl2.parse(idlElement.textContent, {
      sourceName: String(index),
    });
  } catch (e) {
    const msg = `Failed to parse WebIDL: ${e.bareMessage}.`;
    showError(msg, pluginName, {
      title: e.bareMessage,
      details: `<pre>${e.context}</pre>`,
      elements: [idlElement],
    });
    // Skip this <pre> and move on to the next one.
    return [];
  }
  // we add "idl" as the canonical match, so both "webidl" and "idl" work
  idlElement.classList.add("def", "idl");
  const highlights = webidl2.write(parse, { templates });
  html.bind(idlElement)`${highlights}`;
  wrapInner(idlElement, document.createElement("code"));
  idlElement.querySelectorAll("[data-idl]").forEach(elem => {
    if (elem.dataset.dfnFor) {
      return;
    }
    const title = elem.dataset.title;
    // Select the nearest ancestor element that can contain members.
    const idlType = elem.dataset.dfnType;

    const parent = elem.parentElement.closest("[data-idl][data-title]");
    if (parent && !topLevelIdlTypes.includes(idlType)) {
      elem.dataset.dfnFor = parent.dataset.title;
    }
    if (elem.localName === "dfn") {
      registerDefinition(elem, [title]);
    }
  });
  // cross reference
  const closestCite = idlElement.closest("[data-cite], body");
  const { dataset } = closestCite;
  if (!dataset.cite) dataset.cite = "WEBIDL";
  // includes webidl in some form
  if (!/\bwebidl\b/i.test(dataset.cite)) {
    const cites = dataset.cite.trim().split(/\s+/);
    dataset.cite = ["WEBIDL", ...cites].join(" ");
  }
  addIDLHeader(idlElement);
  return parse;
}
/**
 * Adds a "WebIDL" decorative header/permalink to a block of WebIDL.
 * @param {HTMLPreElement} pre
 */
export function addIDLHeader(pre) {
  addHashId(pre, "webidl");
  const header = html`<span class="idlHeader"
    ><a class="self-link" href="${`#${pre.id}`}">WebIDL</a></span
  >`;
  pre.prepend(header);
  addCopyIDLButton(header);
}

export async function run() {
  const idls = document.querySelectorAll("pre.idl, pre.webidl");
  if (!idls.length) {
    return;
  }
  const style = document.createElement("style");
  style.textContent = css;
  document.querySelector("head link, head > *:last-child").before(style);

  const astArray = [...idls].map(renderWebIDL);

  const validations = webidl2.validate(astArray);
  for (const validation of validations) {
    let details = `<pre>${xmlEscape(validation.context)}</pre>`;
    if (validation.autofix) {
      validation.autofix();
      const idlToFix = webidl2.write(astArray[validation.sourceName]);
      const escaped = xmlEscape(idlToFix);
      details += `Try fixing as:
      <pre>${escaped}</pre>`;
    }
    const msg = `WebIDL validation error: ${validation.bareMessage}`;
    showError(msg, pluginName, {
      details,
      elements: [idls[validation.sourceName]],
      title: validation.bareMessage,
    });
  }
  document.normalize();
}
