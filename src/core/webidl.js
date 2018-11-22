// Module core/webidl
//  Highlights and links WebIDL marked up inside <pre class="idl">.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!
import { pub } from "./pubsubhub";
import webidl2 from "../deps/webidl2";
import hb from "handlebars.runtime";
import css from "../deps/text!core/css/webidl.css";
import tmpls from "templates";
import { normalizePadding, reindent } from "./utils";
import { findDfn_ } from "./dfn-finder";

export const name = "core/webidl";

const idlAttributeTmpl = tmpls["attribute.html"];
const idlCallbackTmpl = tmpls["callback.html"];
const idlConstTmpl = tmpls["const.html"];
const idlDictionaryTmpl = tmpls["dictionary.html"];
const idlDictMemberTmpl = tmpls["dict-member.html"];
const idlEnumItemTmpl = tmpls["enum-item.html"];
const idlEnumTmpl = tmpls["enum.html"];
const idlExtAttributeTmpl = tmpls["extended-attribute.html"];
const idlIncludesTmpl = tmpls["includes.html"];
const idlImplementsTmpl = tmpls["implements.html"];
const idlInterfaceTmpl = tmpls["interface.html"];
const idlIterableLikeTmpl = tmpls["iterable-like.html"];
const idlLineCommentTmpl = tmpls["line-comment.html"];
const idlMethodTmpl = tmpls["method.html"];
const idlParamTmpl = tmpls["param.html"];
const idlTypedefTmpl = tmpls["typedef.html"];
// TODO: make these linkable somehow.
// https://github.com/w3c/respec/issues/999
// https://github.com/w3c/respec/issues/982
const unlinkable = new Set(["maplike", "setlike", "stringifier"]);

function registerHelpers() {
  hb.registerHelper("extAttr", obj => {
    return extAttr(obj.extAttrs);
  });
  hb.registerHelper("extAttrClassName", function() {
    const { name } = this;
    return ["Constructor", "NamedConstructor"].includes(name)
      ? "idlCtor"
      : "extAttr";
  });
  hb.registerHelper("extAttrRhs", (rhs, options) => {
    if (rhs.type === "identifier") {
      return options.fn(rhs.value);
    }
    return `(${rhs.value.map(v => options.fn(v.value))})`;
  });
  hb.registerHelper("param", obj => {
    const trivia = obj.optional ? obj.optional.trivia : "";
    return new hb.SafeString(
      idlParamTmpl({
        obj: obj,
        optional: obj.optional ? `${writeTrivia(trivia)}optional` : "",
        variadic: obj.variadic ? "..." : "",
      })
    );
  });
  hb.registerHelper("jsIf", function(condition, options) {
    return condition ? options.fn(this) : options.inverse(this);
  });
  hb.registerHelper("idlType", obj => {
    return new hb.SafeString(idlType2Html(obj.idlType));
  });
  hb.registerHelper("stringifyIdlConst", value => {
    switch (value.type) {
      case "null":
        return "null";
      case "Infinity":
        return value.negative ? "-Infinity" : "Infinity";
      case "NaN":
        return "NaN";
      case "number":
        return value.value;
      case "string":
      case "boolean":
      case "sequence":
        return JSON.stringify(value.value);
      default:
        pub("error", "Unexpected constant value type: `" + value.type + "`.");
        return "<Unknown>";
    }
  });
  hb.registerHelper("join", (arr, between, options) => {
    return arr.map(options.fn).join(between);
  });
  hb.registerHelper("joinNonWhitespace", (arr, between, options) => {
    return arr
      .filter(elem => elem.type !== "ws")
      .map(options.fn)
      .join(between);
  });
  // A block helper that emits an <a title> around its contents
  // if obj.dfn exists. If it exists, that implies that
  // there's another <dfn> for the object.
  hb.registerHelper("tryLink", function(obj, options) {
    const content = options.fn(this);
    const isDefaultJSON =
      obj.body &&
      obj.body.name &&
      obj.body.name.value === "toJSON" &&
      obj.extAttrs &&
      obj.extAttrs.items.some(({ name }) => name === "Default");
    // nothing defines this.
    if (!obj.dfn && !isDefaultJSON) {
      return content;
    }
    // We are going to return a hyperlink
    const a = document.createElement("a");
    a.innerText = content;
    const { dfn } = obj;
    // unambiguous match
    if (dfn) {
      a.dataset.noDefault = "";
      a.dataset.linkFor = obj.linkFor ? obj.linkFor.toLowerCase() : "";
      a.dataset.lt = dfn.dataset.lt ? dfn.dataset.lt : "";
      // handle the empty string for enum values
      if (obj.idlType === "enum-value" && content === "") {
        a.href = "#" + dfn.id;
      }
    } else if (isDefaultJSON) {
      // If toJSON is not overridden, link directly to WebIDL spec.
      a.dataset.cite = "WEBIDL#default-tojson-operation";
    } else {
      // ambiguous match
      a.dataset.noDefault = "";
      a.dataset.linkFor = obj.linkFor ? obj.linkFor.toLowerCase() : "";
      a.dataset.lt = obj.dfn
        .toArray()
        .filter(({ dataset }) => dataset && dataset.lt)
        .map(({ dataset: { lt } }) => lt)
        .join("|");
    }
    return a.outerHTML;
  });
  hb.registerHelper("trivia", writeTrivia);
}

function writeTrivia(text) {
  if (!text.trim().length) {
    return text;
  }
  return idlLineCommentTmpl({ text });
}

function idlType2Html(idlType) {
  if (typeof idlType === "string") {
    return `<a data-link-for="">${idlType}</a>`;
  }
  if (Array.isArray(idlType)) {
    return idlType.map(idlType2Html).join("");
  }
  const extAttrs = extAttr(idlType.extAttrs);
  const nullable = idlType.nullable ? "?" : "";
  if (idlType.union) {
    const subtypes = idlType.idlType.map(idlType2Html).join("");
    const { open, close } = idlType.trivia;
    const union = `${writeTrivia(open)}(${subtypes}${writeTrivia(close)})`;
    return `${extAttrs}${union}${nullable}`;
  }
  let type = "";
  if (idlType.generic) {
    const generic = idlType.generic.value;
    type = standardTypes.has(generic)
      ? linkStandardType(generic)
      : idlType2Html(generic);
    type = `${type}&lt;${idlType2Html(idlType.idlType)}>`;
  } else {
    type = standardTypes.has(idlType.idlType)
      ? linkStandardType(idlType.idlType)
      : idlType2Html(idlType.idlType);
  }
  const trivia = idlType.prefix ? idlType.prefix.trivia : idlType.trivia.base;
  let separator = "";
  if (idlType.separator && idlType.separator.value) {
    const { value, trivia } = idlType.separator;
    separator = `${writeTrivia(trivia)}${value}`;
  }
  return extAttrs + writeTrivia(trivia) + type + nullable + separator;
}

function linkStandardType(type) {
  if (!standardTypes.has(type)) {
    return type;
  }
  const safeType = hb.Utils.escapeExpression(type);
  return `<a data-cite='${standardTypes.get(safeType)}'>${safeType}</a>`;
}

const whitespaceTypes = new Set([
  "ws",
  "ws-pea",
  "ws-tpea",
  "line-comment",
  "multiline-comment",
]);

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

function extAttr(extAttrs) {
  if (!extAttrs) {
    // If there are no extended attributes, omit the [] entirely.
    return "";
  }
  const opt = { extAttrs };
  const safeString = new hb.SafeString(idlExtAttributeTmpl(opt));
  const tmpParser = document.createElement("div");
  tmpParser.innerHTML = safeString;
  Array.from(tmpParser.querySelectorAll(".extAttrName"))
    .filter(elem => extendedAttributesLinks.has(elem.textContent))
    .forEach(elem => {
      const a = elem.ownerDocument.createElement("a");
      a.dataset.cite = extendedAttributesLinks.get(elem.textContent);
      a.textContent = elem.textContent;
      elem.replaceChild(a, elem.firstChild);
    });
  return new hb.SafeString(tmpParser.innerHTML);
}

const standardTypes = new Map([
  ["any", "WEBIDL#idl-any"],
  ["ArrayBuffer", "WEBIDL#idl-ArrayBuffer"],
  ["boolean", "WEBIDL#idl-boolean"],
  ["Buffer", "WEBIDL#idl-Buffer"],
  ["byte", "WEBIDL#idl-byte"],
  ["ByteString", "WEBIDL#idl-ByteString"],
  ["Callback", "WEBIDL#idl-Callback"],
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
function makeMarkup(parse) {
  const pre = document.createElement("pre");
  pre.classList.add("def", "idl");
  pre.innerHTML = parse.map(writeDefinition).join("");
  return pre;
}

function writeDefinition(obj) {
  const opt = { obj };
  switch (obj.type) {
    case "typedef":
      return idlTypedefTmpl(opt);
    case "includes":
      return idlIncludesTmpl(opt);
    case "implements":
      return idlImplementsTmpl(opt);
    case "interface":
      return writeInterfaceDefinition(opt);
    case "interface mixin":
      return writeInterfaceDefinition(opt, { mixin: true });
    case "callback interface":
      return writeInterfaceDefinition(opt, { callback: true });
    case "dictionary": {
      const children = obj.members.map(writeMember).join("");
      return idlDictionaryTmpl({
        obj,
        children,
        partial: obj.partial ? `${writeTrivia(obj.partial.trivia)}partial` : "",
      });
    }
    case "callback": {
      const paramObjs = obj.arguments.map(it =>
        idlParamTmpl({
          obj: it,
          optional: it.optional
            ? `${writeTrivia(it.optional.trivia)}optional`
            : "",
          variadic: it.variadic ? "..." : "",
        })
      );
      const callbackObj = {
        obj,
        children: paramObjs.join(","),
      };
      return idlCallbackTmpl(callbackObj);
    }
    case "enum": {
      const linkFor = obj.name.toLowerCase();
      const children = obj.values
        .map(enumItem => {
          const obj = {
            ...enumItem,
            linkFor,
            idlType: "enum-value",
          };
          return idlEnumItemTmpl({ obj });
        })
        .join("");
      return idlEnumTmpl({ obj, children });
    }
    case "eof":
      return writeTrivia(obj.trivia);
    default:
      pub(
        "error",
        "Unexpected object type `" + obj.type + "` in " + JSON.stringify(obj)
      );
      return "";
  }
}

function writeInterfaceDefinition(opt, fixes = {}) {
  const { obj } = opt;
  const children = obj.members
    .map(ch => {
      switch (ch.type) {
        case "attribute":
          return writeAttribute(ch);
        case "operation":
          return writeMethod(ch);
        case "const":
          return writeConst(ch);
        case "iterable":
        case "maplike":
        case "setlike":
          return writeIterableLike(ch);
        default:
          throw new Error("Unexpected member type: `" + ch.type + "`.");
      }
    })
    .join("");
  return idlInterfaceTmpl({
    obj,
    partial: obj.partial ? `${writeTrivia(obj.partial.trivia)}partial` : "",
    callback: fixes.callback
      ? `${writeTrivia(obj.trivia.callback)}callback`
      : "",
    mixin: fixes.mixin ? `${writeTrivia(obj.trivia.mixin)}mixin` : "",
    children,
  });
}

function writeAttributeQualifiers(attr) {
  let qualifiers = "";
  if (attr.static) qualifiers += `${writeTrivia(attr.static.trivia)}static`;
  if (attr.stringifier)
    qualifiers += `${writeTrivia(attr.stringifier.trivia)}stringifier`;
  if (attr.inherit) qualifiers += `${writeTrivia(attr.inherit.trivia)}inherit`;
  if (attr.readonly)
    qualifiers += `${writeTrivia(attr.readonly.trivia)}readonly`;
  return qualifiers;
}

function writeAttribute(attr) {
  const qualifiers = writeAttributeQualifiers(attr);
  return idlAttributeTmpl({
    obj: attr,
    qualifiers,
  });
}

function writeMethod(meth) {
  const paramObjs = ((meth.body && meth.body.arguments) || [])
    .filter(it => !whitespaceTypes.has(it.type))
    .map(it => {
      const trivia = it.optional ? it.optional.trivia : "";
      return idlParamTmpl({
        obj: it,
        optional: it.optional ? `${writeTrivia(trivia)}optional` : "",
        variadic: it.variadic ? "..." : "",
      });
    });
  const params = paramObjs.join(",");
  const modifiers = ["getter", "setter", "deleter", "stringifier", "static"];
  let special = "";
  for (const specialProp of modifiers) {
    if (meth[specialProp]) {
      special = writeTrivia(meth[specialProp].trivia) + specialProp;
    }
  }
  const methObj = {
    obj: meth,
    special,
    children: params,
  };
  if (meth.body && meth.body.name) {
    methObj.name = meth.body.name.value;
  }
  return idlMethodTmpl(methObj);
}

function writeConst(cons) {
  return idlConstTmpl({
    obj: cons,
    nullable: cons.nullable ? "?" : "",
  });
}

function writeIterableLike(iterableLike) {
  const { type, readonly } = iterableLike;
  return idlIterableLikeTmpl({
    obj: iterableLike,
    qualifiers: readonly ? `${writeTrivia(readonly.trivia)}readonly` : "",
    className: `idl${type[0].toUpperCase()}${type.slice(1)}`,
  });
}

function writeMember(memb) {
  const opt = { obj: memb, qualifiers: "" };
  if (memb.required)
    opt.qualifiers = `${writeTrivia(memb.required.trivia)}required`;
  return idlDictMemberTmpl(opt);
}

// Each entity defined in IDL is either a top- or second-level entity:
// Interface or Interface.member. This function finds the <dfn>
// element defining each entity and attaches it to the entity's
// 'refTitle' property, and records that it describes an IDL entity by
// adding a [data-idl] attribute.

function linkDefinitions(parse, definitionMap, parent, idlElem) {
  parse
    // Don't bother with any of these
    .filter(({ type }) => !["includes", "implements", "eof"].includes(type))
    .forEach(defn => {
      let name;
      switch (defn.type) {
        // Top-level entities with linkable members.
        case "callback interface":
        case "dictionary":
        case "interface":
        case "interface mixin": {
          let partialIdx = "";
          if (defn.partial) {
            if (!idlPartials[defn.name]) {
              idlPartials[defn.name] = [];
            }
            idlPartials[defn.name].push(defn);
            partialIdx = "-partial-" + idlPartials[defn.name].length;
          }
          linkDefinitions(defn.members, definitionMap, defn.name, idlElem);
          name = defn.name;
          defn.idlId = "idl-def-" + name.toLowerCase() + partialIdx;
          break;
        }
        case "enum":
          name = defn.name;
          defn.values
            .filter(({ type }) => type === "enum-value")
            .forEach(enumValue => {
              enumValue.dfn = findDfn(
                defn,
                name,
                enumValue.value,
                definitionMap,
                "enum-value",
                idlElem
              );
            });
          defn.idlId = "idl-def-" + name.toLowerCase();
          break;
        // Top-level entities without linkable members.
        case "callback":
        case "typedef":
          name = defn.name;
          defn.idlId = "idl-def-" + name.toLowerCase();
          break;
        // Members of top-level entities.
        case "attribute":
        case "const":
        case "field":
          name = defn.name;
          defn.idlId =
            "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
          break;
        case "operation": {
          if (defn.body && defn.body.name) {
            name = defn.body.name.value;
            const qualifiedName = parent + "." + name;
            const fullyQualifiedName = parent + "." + name + "()";
            if (!operationNames[fullyQualifiedName]) {
              operationNames[fullyQualifiedName] = [];
            }
            if (!operationNames[qualifiedName]) {
              operationNames[qualifiedName] = [];
            } else {
              defn.overload = operationNames[qualifiedName].length;
              name += "!overload-" + defn.overload;
            }
            operationNames[fullyQualifiedName].push(defn);
            operationNames[qualifiedName].push(defn);
          } else if (
            defn.getter ||
            defn.setter ||
            defn.deleter ||
            defn.stringifier
          ) {
            name = "";
          }
          const idHead = `idl-def-${parent.toLowerCase()}-${name.toLowerCase()}`;
          const idTail =
            defn.overload || !defn.body || !defn.body.arguments.length
              ? ""
              : "-" +
                defn.body.arguments
                  .filter(arg => !whitespaceTypes.has(arg.type))
                  .map(arg => arg.name.toLowerCase())
                  .join("-")
                  .replace(/\s/g, "_");
          defn.idlId = idHead + idTail;
          break;
        }
        case "iterable":
        case "maplike":
        case "setlike":
          name = defn.type;
          defn.idlId =
            "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
          break;
        default:
          pub(
            "error",
            new Error(
              "ReSpec doesn't know about IDL type: `" + defn.type + "`."
            )
          );
          return;
      }
      if (parent) {
        defn.linkFor = parent;
      }
      defn.dfn = findDfn(defn, parent, name, definitionMap, defn.type, idlElem);
    });
}

// This function looks for a <dfn> element whose title is 'name' and
// that is "for" 'parent', which is the empty string when 'name'
// refers to a top-level entity. For top-level entities, <dfn>
// elements that inherit a non-empty [dfn-for] attribute are also
// counted as matching.
//
// When a matching <dfn> is found, it's given <code> formatting,
// marked as an IDL definition, and returned. If no <dfn> is found,
// the function returns 'undefined'.
function findDfn(defn, parent, name, definitionMap, type, idlElem) {
  const originalParent = parent;
  const originalName = name;
  parent = parent.toLowerCase();
  switch (type) {
    case "attribute": {
      const asLocalName = name.toLowerCase();
      const asQualifiedName = parent + "." + asLocalName;
      let dfn;
      if (definitionMap[asQualifiedName] || definitionMap[asLocalName]) {
        dfn = findDfn(defn, parent, asLocalName, definitionMap, null, idlElem);
      }
      if (!dfn) {
        break; // try finding dfn using name, using normal search path...
      }
      const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
      lt.push(asQualifiedName, asLocalName);
      dfn.dataset.lt = [...new Set(lt)].join("|");
      return dfn;
    }
    case "operation": {
      // Overloads all have unique names
      if (name.search("!overload") !== -1) {
        name = name.toLowerCase();
        break;
      }
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
        const dfn = findDfn(
          defn,
          parent,
          lookupName,
          definitionMap,
          null,
          idlElem
        );
        if (!dfn) {
          break; // try finding dfn using name, using normal search path...
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
      const dfn = findDfn(defn, parent, name, definitionMap, null, idlElem);
      if (!dfn) {
        break;
      }
      const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
      lt.push(asMethodName, name);
      dfn.dataset.lt = lt.reverse().join("|");
      definitionMap[asMethodName] = [dfn];
      return dfn;
    }
    case "enum-value":
      name = name === "" ? "the-empty-string" : name.toLowerCase();
      break;
    default:
      name = name.toLowerCase();
  }
  if (!unlinkable.has(name)) {
    return findDfn_(defn, {
      parent,
      name,
      originalParent,
      originalName,
      definitionMap,
      type,
      idlElem,
    });
  }
}

export function run(conf) {
  const idls = document.querySelectorAll("pre.idl");
  if (!idls.length) {
    return;
  }
  registerHelpers();
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
    linkDefinitions(parse, conf.definitionMap, "", idlElement);
    const newElement = makeMarkup(parse);
    if (idlElement.id) newElement.id = idlElement.id;
    newElement
      .querySelectorAll(
        ".idlAttribute,.idlCallback,.idlConst,.idlDictionary,.idlEnum,.idlField,.idlInterface,.idlMember,.idlMethod,.idlMaplike,.idlIterable,.idlTypedef"
      )
      .forEach(elem => {
        const title = elem.dataset.title.toLowerCase();
        // Select the nearest ancestor element that can contain members.
        const parent = elem.parentElement.closest(
          ".idlDictionary,.idlEnum,.idlInterface"
        );
        if (parent) {
          elem.dataset.dfnFor = parent.dataset.title.toLowerCase();
        }
        if (!conf.definitionMap[title]) {
          conf.definitionMap[title] = [];
        }
        conf.definitionMap[title].push(elem);
      });
    idlElement.parentElement.replaceChild(newElement, idlElement);
    newElement.classList.add(...idlElement.classList);
  });
  document.normalize();
}
