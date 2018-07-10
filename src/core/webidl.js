// Module core/webidl
//  Highlights and links WebIDL marked up inside <pre class="idl">.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!
import { pub } from "core/pubsubhub";
import webidl2 from "deps/webidl2";
import hb from "handlebars.runtime";
import css from "deps/text!core/css/webidl.css";
import tmpls from "templates";
import { normalizePadding } from "core/utils";

export const name = "core/webidl";

var idlAttributeTmpl = tmpls["attribute.html"];
var idlCallbackTmpl = tmpls["callback.html"];
var idlConstTmpl = tmpls["const.html"];
var idlDictionaryTmpl = tmpls["dictionary.html"];
var idlDictMemberTmpl = tmpls["dict-member.html"];
var idlEnumItemTmpl = tmpls["enum-item.html"];
var idlEnumTmpl = tmpls["enum.html"];
var idlExtAttributeTmpl = tmpls["extended-attribute.html"];
var idlFieldTmpl = tmpls["field.html"];
var idlIncludesTmpl = tmpls["includes.html"];
var idlImplementsTmpl = tmpls["implements.html"];
var idlInterfaceTmpl = tmpls["interface.html"];
var idlIterableLikeTmpl = tmpls["iterable-like.html"];
var idlLineCommentTmpl = tmpls["line-comment.html"];
var idlMethodTmpl = tmpls["method.html"];
var idlParamTmpl = tmpls["param.html"];
var idlTypedefTmpl = tmpls["typedef.html"];
// TODO: make these linkable somehow.
// https://github.com/w3c/respec/issues/999
// https://github.com/w3c/respec/issues/982
var unlinkable = new Set(["maplike", "setlike", "stringifier"]);

function registerHelpers() {
  hb.registerHelper("extAttr", function(obj, indent) {
    return extAttr(obj.extAttrs, indent, /*singleLine=*/ false);
  });
  hb.registerHelper("extAttrInline", function(obj) {
    return extAttr(obj.extAttrs, 0, /*singleLine=*/ true);
  });
  hb.registerHelper("extAttrClassName", function() {
    var extAttr = this;
    if (extAttr.name === "Constructor" || extAttr.name === "NamedConstructor") {
      return "idlCtor";
    }
    return "extAttr";
  });
  hb.registerHelper("extAttrRhs", function(rhs, options) {
    if (rhs.type === "identifier") {
      return options.fn(rhs.value);
    }
    return `(${rhs.value.map(v => options.fn(v.value))})`;
  });
  hb.registerHelper("param", function(obj) {
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
    if (condition) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  hb.registerHelper("idlType", function(obj) {
    return new hb.SafeString(idlType2Html(obj.idlType));
  });
  hb.registerHelper("stringifyIdlConst", function(value) {
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
  hb.registerHelper("pads", function(num) {
    return new hb.SafeString(pads(num));
  });
  hb.registerHelper("join", function(arr, between, options) {
    return arr.map(options.fn).join(between);
  });
  hb.registerHelper("joinNonWhitespace", function(arr, between, options) {
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
    // Let's deal with WebIDL's Default toJSON(); first.
    if (!obj.dfn && isDefaultJSON) {
      // If toJSON is not overridden, link directly to WebIDL spec.
      a.dataset.cite = "WEBIDL#default-tojson-operation";
    } else {
      // This is an internal IDL reference.
      a.dataset.noDefault = "";
      a.dataset.linkFor = obj.linkFor
        ? hb.Utils.escapeExpression(obj.linkFor).toLowerCase()
        : "";
      a.dataset.lt = obj.dfn[0].dataset.lt || "";
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
    return `<a>${hb.Utils.escapeExpression(idlType)}</a>`;
  }
  if (Array.isArray(idlType)) {
    return idlType.map(idlType2Html).join(",");
  }
  const extAttrs = extAttr(idlType.extAttrs, 0, /*singleLine=*/ true);
  const nullable = idlType.nullable ? "?" : "";
  if (idlType.union) {
    const subtypes = idlType.idlType.map(idlType2Html).join(" or");
    const union = `${writeTrivia(idlType.trivia.open)}(${subtypes})`;
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
  return extAttrs + writeTrivia(trivia) + type + nullable;
}

function linkStandardType(type) {
  if (!standardTypes.has(type)) {
    return type;
  }
  const safeType = hb.Utils.escapeExpression(type);
  return `<a data-cite='${standardTypes.get(safeType)}'>${safeType}</a>`;
}

function idlType2Text(idlType) {
  if (typeof idlType === "string") {
    return idlType;
  }
  const nullable = idlType.nullable ? "?" : "";
  if (idlType.union) {
    return `(${idlType.idlType.map(idlType2Text).join(" or ")})${nullable}`;
  }
  if (idlType.generic) {
    const types = []
      .concat(idlType.idlType)
      .map(idlType2Text)
      .join(", ");
    return `${idlType.generic}<${types}>${nullable}`;
  }
  return idlType2Text(idlType.idlType) + nullable;
}

function pads(num) {
  return " ".repeat(num);
}
var whitespaceTypes = {
  ws: true,
  "ws-pea": true,
  "ws-tpea": true,
  "line-comment": true,
  "multiline-comment": true,
};

function typeIsWhitespace(webIdlType) {
  return whitespaceTypes[webIdlType];
}

const extenedAttributesLinks = new Map([
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
  ["LenientSetter", "WEBIDL#LenientSetter"],
  ["LenientThis", "WEBIDL#LenientThis"],
  ["NamedConstructor", "WEBIDL#NamedConstructor"],
  ["NewObject", "WEBIDL#NewObject"],
  ["NoInterfaceObject", "WEBIDL#NoInterfaceObject"],
  ["OverrideBuiltins", "WEBIDL#OverrideBuiltins"],
  ["PrimaryGlobal", "WEBIDL#PrimaryGlobal"],
  ["PutForwards", "WEBIDL#PutForwards"],
  ["Replaceable", "WEBIDL#Replaceable"],
  ["SameObject", "WEBIDL#SameObject"],
  ["SecureContext", "WEBIDL#SecureContext"],
  ["TreatNonObjectAsNull", "WEBIDL#TreatNonObjectAsNull"],
  ["TreatNullAs", "WEBIDL#TreatNullAs"],
  ["Unforgeable", "WEBIDL#Unforgeable"],
  ["Unscopable", "WEBIDL#Unscopable"],
]);

function extAttr(extAttrs, indent, singleLine) {
  if (!extAttrs) {
    // If there are no extended attributes, omit the [] entirely.
    return "";
  }
  const opt = { extAttrs };
  const safeString = new hb.SafeString(idlExtAttributeTmpl(opt));
  const tmpParser = document.createElement("div");
  tmpParser.innerHTML = safeString;
  Array.from(tmpParser.querySelectorAll(".extAttrName"))
    .filter(elem => extenedAttributesLinks.has(elem.textContent))
    .forEach(elem => {
      const a = elem.ownerDocument.createElement("a");
      a.dataset.cite = extenedAttributesLinks.get(elem.textContent);
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

const idlKeywords = new Set([
  "any",
  "attribute",
  "boolean",
  "byte",
  "ByteString",
  "callback",
  "const",
  "creator",
  "Date",
  "deleter",
  "dictionary",
  "DOMString",
  "double",
  "enum",
  "false",
  "float",
  "getter",
  "implements",
  "Infinity",
  "inherit",
  "interface",
  "iterable",
  "long",
  "maplike",
  "NaN",
  "null",
  "object",
  "octet",
  "optional",
  "or",
  "partial",
  "readonly",
  "RegExp",
  "required",
  "sequence",
  "setlike",
  "setter",
  "short",
  "static",
  "stringifier",
  "true",
  "typedef",
  "unrestricted",
  "unsigned",
  "USVString",
  "void",
]);
const argumentNameKeyword = new Set([
  "attribute",
  "callback",
  "const",
  "creator",
  "deleter",
  "dictionary",
  "enum",
  "getter",
  "implements",
  "inherit",
  "interface",
  "iterable",
  "maplike",
  "partial",
  "required",
  "setlike",
  "setter",
  "static",
  "stringifier",
  "typedef",
  "unrestricted",
]);
var operationNames = {};
var idlPartials = {};

// Takes the result of WebIDL2.parse(), an array of definitions.
function makeMarkup(conf, parse) {
  var pre = document.createElement("pre");
  pre.classList.add("def", "idl");
  pre.innerHTML = parse.map(defn => writeDefinition(defn)).join("");
  return pre;
}

/**
 * Removes common indents across the IDL texts,
 * so that indentation inside <pre> won't affect the rendered result.
 * @param {string} text IDL text
 */
function unindentMarkup(text) {
  if (!text) {
    return text;
  }
  // TODO: use trimEnd if Edge and Firefox support it
  const lines = text.trimRight().split("\n");
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  const indents = lines.filter(s => s).map(s => s.search(/[^\s]/));
  const leastIndent = Math.min(...indents);
  return lines.map(s => s.slice(leastIndent)).join("\n");
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
      var callbackObj = {
        obj,
        children: paramObjs.join(","),
      };
      return idlCallbackTmpl(callbackObj);
    }
    case "enum": {
      var children = "";
      for (const item of obj.values) {
        switch (item.type) {
          case "string":
            children += idlEnumItemTmpl({
              obj: item,
              lname: item.value
                ? item.value.toLowerCase().replace(/\s/g, "-")
                : "the-empty-string",
              parentID: obj.name.toLowerCase(),
            });
            break;
          default:
            throw new Error(
              "Unexpected type in exception: `" + item.type + "`."
            );
        }
      }
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

function writeField(attr, max, indent) {
  var pad = max - idlType2Text(attr.idlType).length;
  return idlFieldTmpl({
    obj: attr,
    indent: indent,
    pad: pad,
  });
}

function writeAttributeQualifiers(attr) {
  var qualifiers = "";
  if (attr.static) qualifiers += `${writeTrivia(attr.static.trivia)}static`;
  if (attr.stringifier)
    qualifiers += `${writeTrivia(attr.stringifier.trivia)}stringifier`;
  if (attr.inherit) qualifiers += `${writeTrivia(attr.inherit.trivia)}inherit`;
  if (attr.readonly)
    qualifiers += `${writeTrivia(attr.readonly.trivia)}readonly`;
  return qualifiers;
}

function writeAttribute(attr, max, indent, maxQualifiers) {
  var len = idlType2Text(attr.idlType).length;
  var pad = max - len;
  var qualifiers = writeAttributeQualifiers(attr);
  qualifiers += pads(maxQualifiers);
  qualifiers = qualifiers.slice(0, maxQualifiers);
  return idlAttributeTmpl({
    obj: attr,
    indent: indent,
    qualifiers: qualifiers,
    pad: pad,
  });
}

function writeMethod(meth) {
  const paramObjs = ((meth.body && meth.body.arguments) || [])
    .filter(it => !typeIsWhitespace(it.type))
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

function writeConst(cons, max, indent) {
  var pad = max - idlType2Text(cons.idlType).length;
  if (cons.nullable) pad--;
  return idlConstTmpl({
    obj: cons,
    indent: indent,
    pad: pad,
    nullable: cons.nullable ? "?" : "",
  });
}

function writeIterableLike(iterableLike, indent) {
  const { type, readonly } = iterableLike;
  return idlIterableLikeTmpl({
    obj: iterableLike,
    qualifiers: readonly ? `${writeTrivia(readonly.trivia)}readonly` : "",
    indent: indent,
    className: `idl${type[0].toUpperCase()}${type.slice(1)}`,
  });
}

function writeMember(memb) {
  var opt = { obj: memb, qualifiers: "" };
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
        case "interface mixin":
          var partialIdx = "";
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
        case "enum":
          name = defn.name;
          for (const v of defn.values) {
            if (v.type === "string") {
              v.dfn = findDfn(name, v.value, definitionMap, defn.type, idlElem);
            }
          }
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
        case "operation":
          if (defn.body && defn.body.name) {
            name = defn.body.name.value;
            var qualifiedName = parent + "." + name;
            var fullyQualifiedName = parent + "." + name + "()";
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
                  .filter(arg => !typeIsWhitespace(arg.type))
                  .map(arg => arg.name.toLowerCase())
                  .join("-")
                  .replace(/\s/g, "_");
          defn.idlId = idHead + idTail;
          break;
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
      defn.dfn = findDfn(parent, name, definitionMap, defn.type, idlElem);
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
function findDfn(parent, name, definitionMap, type, idlElem) {
  const originalParent = parent;
  const originalName = name;
  parent = parent.toLowerCase();
  switch (type) {
    case "operation":
      // Overloads all have unique names
      if (name.search("!overload") !== -1) {
        name = name.toLowerCase();
        break;
      }
      // Allow linking to both "method()" and "method" name.
      const asMethodName = name.toLowerCase() + "()";
      const asFullyQualifiedName = parent + "." + name.toLowerCase() + "()";

      if (definitionMap[asMethodName] || definitionMap[asFullyQualifiedName]) {
        const lookupName = definitionMap[asMethodName]
          ? asMethodName
          : asFullyQualifiedName;
        const dfn = findDfn(parent, lookupName, definitionMap, null, idlElem);
        if (!dfn) {
          break; // try finding dfn using name, using normal search path...
        }
        const lt = dfn[0].dataset.lt ? dfn[0].dataset.lt.split("|") : [];
        lt.push(lookupName, name);
        dfn[0].dataset.lt = lt.join("|");
        if (!definitionMap[name]) {
          definitionMap[name] = [];
        }
        definitionMap[name].push(dfn);
        return dfn;
      }
      // no method alias, so let's find the dfn and add it
      const dfn = findDfn(parent, name, definitionMap, null, idlElem);
      if (!dfn) {
        break;
      }
      const lt = dfn[0].dataset.lt ? dfn[0].dataset.lt.split("|") : [];
      lt.push(asMethodName, name);
      dfn[0].dataset.lt = lt.reverse().join("|");
      definitionMap[asMethodName] = [dfn];
      return dfn;
    case "enum":
      if (name === "") {
        name = "the-empty-string";
        break;
      }
    default:
      name = name.toLowerCase();
  }
  if (unlinkable.has(name)) {
    return;
  }
  var dfnForArray = definitionMap[name];
  var dfns = [];
  if (dfnForArray) {
    // Definitions that have a title and [data-dfn-for] that exactly match the
    // IDL entity:
    dfns = dfnForArray.filter(dfn => dfn[0].dataset.dfnFor === parent);
    // If this is a top-level entity, and we didn't find anything with
    // an explicitly empty [for], try <dfn> that inherited a [for].
    if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
      dfns = dfnForArray;
    }
  }
  // If we haven't found any definitions with explicit [for]
  // and [title], look for a dotted definition, "parent.name".
  if (dfns.length === 0 && parent !== "") {
    var dottedName = parent + "." + name;
    dfnForArray = definitionMap[dottedName];
    if (dfnForArray !== undefined && dfnForArray.length === 1) {
      dfns = dfnForArray;
      // Found it: update the definition to specify its [for] and data-lt.
      delete definitionMap[dottedName];
      dfns[0].attr("data-dfn-for", parent);
      dfns[0].attr("data-lt", name);
      if (definitionMap[name] === undefined) {
        definitionMap[name] = [];
      }
      definitionMap[name].push(dfns[0]);
    }
  }
  if (dfns.length > 1) {
    const msg = `Multiple \`<dfn>\`s for \`${originalName}\` ${originalParent
      ? `in \`${originalParent}\``
      : ""}`;
    pub("error", new Error(msg));
  }
  if (dfns.length === 0) {
    const showWarnings =
      type &&
      idlElem &&
      name &&
      idlElem.classList.contains("no-link-warnings") === false;
    if (showWarnings) {
      var msg = `No \`<dfn>\` for ${type} \`${originalName}\`${originalParent
        ? " in `" + originalParent + "`"
        : ""}`;
      msg +=
        ". [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).";
      pub("warn", msg);
    }
    return;
  }
  const dfn = dfns[0][0]; // work on actual node, not jquery
  const id =
    "dom-" +
    (parent ? parent + "-" : "") +
    name.replace(/[()]/g, "").replace(/\s/g, "-");
  dfn.id = id;
  dfn.dataset.idl = "";
  dfn.dataset.title = dfn.textContent;
  dfn.dataset.dfnFor = parent;
  // Mark the definition as code.
  if (!dfn.querySelector("code") && !dfn.closest("code") && dfn.children) {
    const code = dfn.ownerDocument.createElement("code");
    while (dfn.hasChildNodes()) {
      code.appendChild(dfn.firstChild);
    }
    dfn.appendChild(code);
  }
  return dfns[0];
}
var resolveDone;

export const done = new Promise(function(resolve) {
  resolveDone = resolve;
});

export function run(conf, doc, cb) {
  var finish = function() {
    resolveDone();
    pub("end", "core/webidl");
    cb();
  };
  var $idl = $("pre.idl", doc);
  if (!$idl.length) {
    return finish();
  }
  registerHelpers();
  if (!$(".idl", doc).not("pre").length) {
    $(doc)
      .find("head link")
      .first()
      .before($("<style/>").text(css));
  }

  $idl.each(function() {
    var parse;
    try {
      const idl = unindentMarkup(this.textContent);
      parse = webidl2.parse(idl);
    } catch (e) {
      pub(
        "error",
        `Failed to parse WebIDL: ${e.message}.
        <details>
        <pre>${normalizePadding(this.textContent)}\n ${e}</pre>
        </details>`
      );
      // Skip this <pre> and move on to the next one.
      return;
    }
    linkDefinitions(parse, conf.definitionMap, "", this);
    var $df = $(makeMarkup(conf, parse));
    $df.attr({ id: this.id });
    $df
      .find(
        ".idlAttribute,.idlCallback,.idlConst,.idlDictionary,.idlEnum,.idlException,.idlField,.idlInterface,.idlMember,.idlMethod,.idlMaplike,.idlIterable,.idlTypedef"
      )
      .each(function() {
        var elem = $(this);
        var title = elem.attr("data-title").toLowerCase();
        // Select the nearest ancestor element that can contain members.
        var parent = elem
          .parent()
          .closest(".idlDictionary,.idlEnum,.idlException,.idlInterface");
        if (parent.length) {
          elem.attr("data-dfn-for", parent.attr("data-title").toLowerCase());
        }
        if (!conf.definitionMap[title]) {
          conf.definitionMap[title] = [];
        }
        conf.definitionMap[title].push(elem);
      });
    $(this).replaceWith($df);
    $df[0].classList.add(...this.classList);
  });
  doc.normalize();
  finish();
}
