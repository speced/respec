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

const xrefs = new Map([
  ["any", "WEBIDL#idl-any"],
  ["ArrayBuffer", "WEBIDL#idl-ArrayBuffer"],
  ["boolean", "WEBIDL#idl-boolean"],
  ["Buffer", "WEBIDL#idl-Buffer"],
  ["byte", "WEBIDL#idl-byte"],
  ["ByteString", "WEBIDL#idl-ByteString"],
  ["Callback", "WEBIDL#idl-Callback"],
  ["CEReactions", "HTML#cereactions"],
  ["Clamp", "WEBIDL#Clamp"],
  ["Constructor", "WEBIDL#Constructor"],
  ["DataView", "WEBIDL#idl-DataView"],
  ["Default", "WEBIDL#Default"],
  ["DOMException", "WEBIDL#idl-DOMException"],
  ["DOMString", "WEBIDL#idl-DOMString"],
  ["double", "WEBIDL#idl-double"],
  ["EnforceRange", "WEBIDL#EnforceRange"],
  ["Error", "WEBIDL#idl-Error"],
  ["EventHandler", "HTML#eventhandler"],
  ["Exposed", "WEBIDL#Exposed"],
  ["float", "WEBIDL#idl-float"],
  ["Float32Array", "WEBIDL#idl-Float32Array"],
  ["Float64Array", "WEBIDL#idl-Float64Array"],
  ["FrozenArray", "WEBIDL#idl-frozen-array"],
  ["Global", "WEBIDL#Global"],
  ["HTMLConstructor", "HTML#htmlconstructor"],
  ["Int16Array", "WEBIDL#idl-Int16Array"],
  ["Int32Array", "WEBIDL#idl-Int32Array"],
  ["Int8Array", "WEBIDL#idl-Int8Array"],
  ["LegacyArrayClass", "WEBIDL#LegacyArrayClass"],
  ["LenientSetter", "WEBIDL#LenientSetter"],
  ["LenientThis", "WEBIDL#LenientThis"],
  ["long long", "WEBIDL#idl-long-long"],
  ["long", "WEBIDL#idl-long"],
  ["NamedConstructor", "WEBIDL#NamedConstructor"],
  ["NewObject", "WEBIDL#NewObject"],
  ["NoInterfaceObject", "WEBIDL#NoInterfaceObject"],
  ["object", "WEBIDL#idl-object"],
  ["octet", "WEBIDL#idl-octet"],
  ["OverrideBuiltins", "WEBIDL#OverrideBuiltins"],
  ["PrimaryGlobal", "WEBIDL#PrimaryGlobal"],
  ["Promise", "WEBIDL#idl-promise"],
  ["PutForwards", "WEBIDL#PutForwards"],
  ["record", "WEBIDL#idl-record"],
  ["Replaceable", "WEBIDL#Replaceable"],
  ["SameObject", "WEBIDL#SameObject"],
  ["SecureContext", "WEBIDL#SecureContext"],
  ["sequence", "WEBIDL#idl-sequence"],
  ["short", "WEBIDL#idl-short"],
  ["toJSON", "WEBIDL#default-tojson-operation"],
  ["TreatNonObjectAsNull", "WEBIDL#TreatNonObjectAsNull"],
  ["TreatNullAs", "WEBIDL#TreatNullAs"],
  ["Uint16Array", "WEBIDL#idl-Uint16Array"],
  ["Uint32Array", "WEBIDL#idl-Uint32Array"],
  ["Uint8Array", "WEBIDL#idl-Uint8Array"],
  ["Uint8ClampedArray", "WEBIDL#dl-Uint8ClampedArray"],
  ["Unforgeable", "WEBIDL#Unforgeable"],
  ["unrestricted double", "WEBIDL#idl-unrestricted-double"],
  ["unrestricted float", "WEBIDL#idl-unrestricted-float"],
  ["Unscopable", "WEBIDL#Unscopable"],
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

const helpers = new Map([
  ["escapeArgumentName", escapeArgumentName],
  ["escapeAttributeName", escapeAttributeName],
  ["escapeIdentifier", escapeIdentifier],
  ["extAttr", idlExtAttr],
  ["extAttrClassName", extAttrClassName],
  ["extAttrInline", extAttrInline],
  ["extAttrRhs", extAttrRhs],
  ["idlType", idlType],
  ["idn", idn],
  ["join", join],
  ["joinNonWhitespace", joinNonWhitespace],
  ["jsIf", jsIf],
  ["pads", idlPads],
  ["param", param],
  ["stringifyIdlConst", stringifyIdlConst],
  ["toLowerCase", toLowerCase],
  ["tryLink", tryLink],
  ["typeExtAttrs", typeExtAttrs],
]);

function escapeArgumentName(argumentName) {
  if (idlKeywords.has(argumentName) && !argumentNameKeyword.has(argumentName)) {
    return "_" + argumentName;
  }
  return argumentName;
}

const attributeNameKeyword = new Set(["required"]);
function escapeAttributeName(attributeName) {
  if (
    idlKeywords.has(attributeName) &&
    !attributeNameKeyword.has(attributeName)
  )
    return "_" + attributeName;
  return attributeName;
}

function idlType(obj) {
  return new hb.SafeString(idlType2Html(obj.idlType));
}

function toLowerCase(str) {
  return str.toLowerCase();
}

function idlExtAttr(obj, indent) {
  return extAttr(obj.extAttrs, indent, /*singleLine=*/ false);
}

function extAttrInline(obj) {
  return extAttr(obj.extAttrs, 0, /*singleLine=*/ true);
}

function typeExtAttrs(obj) {
  return extAttr(obj.typeExtAttrs, 0, /*singleLine=*/ true);
}

function extAttrClassName() {
  var extAttr = this;
  if (extAttr.name === "Constructor" || extAttr.name === "NamedConstructor") {
    return "idlCtor";
  }
  return "extAttr";
}

function extAttrRhs(rhs, options) {
  if (rhs.type === "identifier") {
    return options.fn(rhs.value);
  }
  const combined = rhs.value.map(item => options.fn(item)).join(",");
  return "(" + combined + ")";
}

function param(obj) {
  const idlParamTmpl = tmpls["param.html"];
  return new hb.SafeString(
    idlParamTmpl({
      obj: obj,
      optional: obj.optional ? "optional " : "",
      variadic: obj.variadic ? "..." : "",
    })
  );
}

function jsIf(condition, options) {
  return condition ? options.fn(this) : options.inverse(this);
}

function stringifyIdlConst(value) {
  switch (value.type) {
    case "null":
      return "null";
    case "Infinity":
      return value.negative ? "-Infinity" : "Infinity";
    case "NaN":
      return "NaN";
    case "string":
    case "number":
    case "boolean":
    case "sequence":
      return JSON.stringify(value.value);
    default:
      pub("error", "Unexpected constant value type: `" + value.type + "`.");
      return "<Unknown>";
  }
}

function idlPads(num) {
  return new hb.SafeString(pads(num));
}

function join(arr, between, options) {
  return arr
    .map(function(elem) {
      return options.fn(elem);
    })
    .join(between);
}
function joinNonWhitespace(arr, between, options) {
  return arr
    .filter(function(elem) {
      return elem.type !== "ws";
    })
    .map(function(elem) {
      return options.fn(elem);
    })
    .join(between);
}

/**
   * Adds hyperlinks for each IDL type. Handles IDL defaults.
   */
const defaultObj = Object.freeze({
  inheritance: "",
  name: "",
  extAttrs: [],
  type: "",
});
function tryLink(obj, options) {
  const { inheritance, name, extAttrs, type } = { ...defaultObj, ...obj };
  const content = options.fn(this);
  const a = document.createElement("a");
  // We are going to return a hyperlink
  a.innerText = content;
  a.dataset.linkType = "idl";
  // Let's deal with WebIDL's Defaults first.
  const isDefault = extAttrs && extAttrs.some(({ name }) => name === "Default");
  if (isDefault && xrefs.has(name)) {
    // It's Default, link directly to WebIDL spec.
    a.dataset.cite = xrefs.get(name);
    return a.outerHTML;
  }
  // linked terms - later maps to "data-lt" attribute.
  const lt = new Set();
  // This is an internal IDL reference.
  switch (type) {
    case "enum": {
      lt.add(name);
      break;
    }
    case "operation": {
      deriveNamesForOperation(obj).reduce((lt, term) => lt.add(term), lt);
      break;
    }
    case "attribute": {
      deriveNamesForAttribute(obj).reduce((lt, term) => lt.add(term), lt);
      break;
    }
    case "field": {
      deriveNamesForDictMember(obj).reduce((lt, term) => lt.add(term), lt);
      break;
    }
    case "interface": {
      // Interfaces can inherit, so we check if we are trying to inherit
      const isInherits = content === inheritance;
      const actualName = isInherits ? inheritance : name;
      let normalName = hb.Utils.escapeExpression(actualName.toLowerCase());
      if (!isInherits) {
        a.dataset.linkFor = normalName;
      } else if (isInherits && xrefs.has(actualName)) {
        a.dataset.cite = xrefs.get(actualName);
      } else {
        a.dataset.linkFor = normalName;
      }
      break;
    }
  }
  if (obj.parent) {
    a.dataset.linkFor = hb.Utils.escapeExpression(
      obj.parent.name.toLowerCase()
    );
  }
  if (lt.size) {
    const linkedTerms = [...lt]
      .map(term => term.toLowerCase())
      .filter(term => a.textContent.toLowerCase() !== term)
      .join("|");

    a.dataset.lt = linkedTerms;
  }
  return a.outerHTML;
}

/**
 * Dictionaries support their name, dot notation
 * and parent["name"]
 *
 */
function deriveNamesForDictMember({ parent, name }) {
  const { name: parentName } = parent;
  return [name, `${parentName}.${name}`, `${parentName}["${name}"]`];
}

/**
 * Attributes can be addressed by their name directly, or by
 * dot notation.
 */
function deriveNamesForAttribute({ parent, name }) {
  const { name: parentName } = parent;
  const asDotNotation = `${parentName}.${name}`;
  return [name, asDotNotation];
}

/**
 * Operations can be referenced in multiple ways
 *  - by their name
 *  - as method: name()
 *  - fully qualified: name(arg1, arg2, ...arg3);
 *  - fully qualified with types: name(DOMString arg1, Bar arg2, Foo... arg3);
 *  - fully qualified with return type: void foo(DOMString bar, Bar... baz)
 *  - dot notation:
 *    - Foo.bar
 *    - Foo.bar()
 *    - Foo.bar(args)
 */
function deriveNamesForOperation(obj) {
  const {
    name,
    arguments: args,
    idlType: { idlType: returnType },
    parent: { name: parentName },
  } = obj;

  const methodId = name;
  const methodName = `${name}()`;
  const names = [
    methodId,
    methodName,
    `${parentName}.${methodId}`,
    `${parentName}.${methodName}`,
  ];
  if (args.length) {
    // fully qualified method, but no type information
    const params = args
      .filter(({ type }) => !whiteSpaceTypes.has(type))
      .map(({ name, variadic }) => `${variadic ? "..." : ""}${name}`)
      .join(", ");
    const fullyQualifiedName = `${name}(${params})`;
    names.push(fullyQualifiedName, `${parentName}.${fullyQualifiedName}`);
    // fully qualified method with type information
    const paramAndTypes = args
      .filter(({ type }) => !whiteSpaceTypes.has(type))
      .map(arg => {
        const { name, variadic, idlType: { idlType } } = arg;
        return `${idlType}${variadic ? "... " : " "}${name}`;
      })
      .join(", ");
    const fullyQualifiedWithTypes = `${name}(${paramAndTypes})`;
    names.push(
      fullyQualifiedWithTypes,
      `${parentName}.${fullyQualifiedWithTypes}`
    );
    // Fully qualified with return type
    names.push(`${returnType} ${fullyQualifiedWithTypes}`);
  } else {
    names.push(`${returnType} ${methodName}`);
  }
  return names.reverse(); // most specific, to least specific
}

function idn(lvl) {
  var str = "";
  for (var i = 0; i < lvl; i++) {
    str += "    ";
  }
  return str;
}

function idlType2Html(idlType) {
  if (typeof idlType === "string") {
    return "<a>" + hb.Utils.escapeExpression(idlType) + "</a>";
  }
  if (Array.isArray(idlType)) {
    return idlType.map(idlType2Html).join(", ");
  }
  var nullable = idlType.nullable ? "?" : "";
  if (idlType.union) {
    return (
      "(" +
      idlType.idlType
        .map(function(type) {
          return idlType2Html(type);
        })
        .join(" or ") +
      ")" +
      nullable
    );
  }
  if (idlType.array) {
    var arrayStr = "";
    for (var i = 0; i < idlType.array; ++i) {
      if (idlType.nullableArray[i]) {
        arrayStr += "?";
      }
      arrayStr += "[]";
    }
    return (
      idlType2Html({
        generic: idlType.generic,
        idlType: idlType.idlType,
      }) +
      arrayStr +
      nullable
    );
  }
  var type = "";
  if (idlType.generic) {
    type = xrefs.has(idlType.generic)
      ? linkStandardType(idlType.generic)
      : idlType2Html(idlType.generic);
    type = type + "&lt;" + idlType2Html(idlType.idlType) + ">";
  } else {
    type = xrefs.has(idlType.idlType)
      ? linkStandardType(idlType.idlType)
      : idlType2Html(idlType.idlType);
  }
  return type + nullable;
}

function linkStandardType(type) {
  if (!xrefs.has(type)) {
    return type;
  }
  const safeType = hb.Utils.escapeExpression(type);
  return "<a data-cite='" + xrefs.get(safeType) + "'>" + safeType + "</a>";
}

function idlType2Text(idlType) {
  if (typeof idlType === "string") {
    return idlType;
  }
  var nullable = idlType.nullable ? "?" : "";
  if (idlType.union) {
    return (
      "(" +
      idlType.idlType
        .map(function(type) {
          return idlType2Text(type);
        })
        .join(" or ") +
      ")" +
      nullable
    );
  }
  if (idlType.array) {
    var arrayStr = "";
    for (var i = 0; i < idlType.array; ++i) {
      if (idlType.nullableArray[i]) {
        arrayStr += "?";
      }
      arrayStr += "[]";
    }
    return (
      idlType2Text({
        generic: idlType.generic,
        idlType: idlType.idlType,
      }) +
      arrayStr +
      nullable
    );
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
  return "".padStart(num, " ");
}

var whiteSpaceTypes = new Set([
  "ws",
  "ws-pea",
  "ws-tpea",
  "line-comment",
  "multiline-comment",
]);

function extAttr(extAttrs, indent, singleLine) {
  if (extAttrs.length === 0) {
    // If there are no extended attributes, omit the [] entirely.
    return "";
  }
  var opt = {
    extAttrs: extAttrs,
    indent: indent,
    sep: singleLine ? ", " : ",\n " + idn(indent),
    end: singleLine ? " " : "\n",
  };
  const idlExtAttributeTmpl = tmpls["extended-attribute.html"];
  const safeString = new hb.SafeString(idlExtAttributeTmpl(opt));
  const tmpParser = document.createElement("div");
  tmpParser.innerHTML = safeString;
  Array.from(tmpParser.querySelectorAll(".extAttrName"))
    .filter(function(elem) {
      return xrefs.has(elem.textContent);
    })
    .forEach(function(elem) {
      const a = elem.ownerDocument.createElement("a");
      a.dataset.cite = xrefs.get(elem.textContent);
      a.textContent = elem.textContent;
      elem.replaceChild(a, elem.firstChild);
    });
  return new hb.SafeString(tmpParser.innerHTML);
}

function escapeIdentifier(identifier) {
  if (idlKeywords.has(identifier)) return "_" + identifier;
  return identifier;
}

// Takes the result of WebIDL2.parse(), an array of definitions.
function toIdlArray(idlElem) {
  let result = [];
  const text = idlElem.textContent;
  // Parse the IDLs
  // for each, report if any have errors
  try {
    result = webidl2.parse(text, { ws: true });
  } catch (err) {
    pub(
      "error",
      `Failed to parse WebIDL: \`${err.message}\`.
      <details>
        <pre>${normalizePadding(text)}\n ${err}</pre>
      </details>`
    );
  }
  // add parents
  result
    .filter(({ type }) => !whiteSpaceTypes.has(type))
    .forEach(obj => addParent(obj));
  return result;
}

function addParent(obj, owner = null) {
  obj.parent = owner;
  Array.from(Object.entries(obj))
    .filter(([key]) => key !== "parent")
    .filter(([, value]) => Array.isArray(value) || value instanceof Object)
    .map(([, value]) => value)
    .forEach(value => {
      if (Array.isArray(value)) {
        value
          .filter(({ type }) => type !== "," && !whiteSpaceTypes.has(type))
          .forEach(item => {
            addParent(item, obj);
          });
        return;
      }
      value.parent = obj;
    });
}

function writeDefinition(obj) {
  let indent = 0;
  var opt = { indent: indent, obj: obj };
  switch (obj.type) {
    case "typedef": {
      const idlTypedefTmpl = tmpls["typedef.html"];
      return idlTypedefTmpl(opt);
    }
    case "implements": {
      const idlImplementsTmpl = tmpls["implements.html"];
      return idlImplementsTmpl(opt);
    }
    case "interface":
      return writeInterfaceDefinition(opt);
    case "callback interface":
      return writeInterfaceDefinition(opt, "callback ");
    case "dictionary": {
      let maxQualifiers = 0;
      let maxType = 0;
      obj.members.forEach(function(it) {
        if (whiteSpaceTypes.has(it.type)) {
          return;
        }
        var qualifiers = "";
        if (it.required) qualifiers += "required ";
        if (maxQualifiers < qualifiers.length)
          maxQualifiers = qualifiers.length;

        var typeLen = idlType2Text(it.idlType).length;
        if (maxType < typeLen) maxType = typeLen;
      });
      var children = obj.members
        .map(function(it) {
          switch (it.type) {
            case "field":
              return writeMember(it, maxQualifiers, maxType, indent + 1);
            case "line-comment":
              return writeLineComment(it, indent + 1);
            case "multiline-comment":
              return writeMultiLineComment(it, indent + 1);
            case "ws":
              return writeBlankLines(it);
            case "ws-pea":
              break;
            default:
              throw new Error(
                "Unexpected type in dictionary: `" + it.type + "`."
              );
          }
        })
        .join("");
      const idlDictionaryTmpl = tmpls["dictionary.html"];
      return idlDictionaryTmpl({
        obj: obj,
        indent: indent,
        children: children,
        partial: obj.partial ? "partial " : "",
      });
    }
    case "callback": {
      var paramObjs = obj.arguments
        .filter(function(it) {
          return !whiteSpaceTypes.has(it.type);
        })
        .map(function(it) {
          const idlParamTmpl = tmpls["param.html"];
          return idlParamTmpl({
            obj: it,
            optional: it.optional ? "optional " : "",
            variadic: it.variadic ? "..." : "",
          });
        });
      var callbackObj = {
        obj: obj,
        indent: indent,
        children: paramObjs.join(", "),
      };
      const idlCallbackTmpl = tmpls["callback.html"];
      var ret = idlCallbackTmpl(callbackObj);
      var line = $(ret).text();
      if (line.length > 80) {
        var paramPad = line.indexOf("(") + 1;
        callbackObj.children = paramObjs.join(",\n" + pads(paramPad));
        ret = idlCallbackTmpl(callbackObj);
      }
      return ret;
    }
    case "enum": {
      const idlEnumTmpl = tmpls["enum.html"];
      const idlEnumItemTmpl = tmpls["enum-item.html"];
      let children = "";
      for (var i = 0; i < obj.values.length; i++) {
        var item = obj.values[i];
        switch (item.type) {
          case "string":
            var needsComma = false;
            for (var j = i + 1; j < obj.values.length; j++) {
              var lookahead = obj.values[j];
              if (lookahead.type === undefined) break;
              if (lookahead.type === ",") {
                needsComma = true;
                break;
              }
            }
            children += idlEnumItemTmpl({
              obj: item,
              name: item.value,
              indent: indent + 1,
              needsComma: needsComma,
            });
            break;
          case "line-comment":
            children += writeLineComment(item, indent + 1);
            break;
          case "multiline-comment":
            children += writeMultiLineComment(item, indent + 1);
            break;
          case "ws":
            children += writeBlankLines(item);
            break;
          case ",":
          case "ws-pea":
            break;
          default:
            throw new Error(
              "Unexpected type in exception: `" + item.type + "`."
            );
        }
      }
      return idlEnumTmpl({ obj, indent, children });
    }
    default:
      pub(
        "error",
        "Unexpected object type `" + obj.type + "` in " + JSON.stringify(obj)
      );
      return "";
  }
}

function writeInterfaceDefinition(opt, callback) {
  var obj = opt.obj,
    indent = opt.indent;
  var maxAttr = 0,
    maxAttrQualifiers = 0,
    maxMeth = 0,
    maxConst = 0;
  obj.members.forEach(function(it) {
    if (
      whiteSpaceTypes.has(it.type) ||
      it.type === "maplike" ||
      it.type === "iterable"
    ) {
      return;
    }
    var len = idlType2Text(it.idlType).length;
    if (it.type === "attribute") {
      var qualifiersLen = writeAttributeQualifiers(it).length;
      maxAttr = len > maxAttr ? len : maxAttr;
      maxAttrQualifiers =
        qualifiersLen > maxAttrQualifiers ? qualifiersLen : maxAttrQualifiers;
    } else if (it.type === "operation") maxMeth = len > maxMeth ? len : maxMeth;
    else if (it.type === "const") maxConst = len > maxConst ? len : maxConst;
  });
  var children = obj.members
    .map(function(ch) {
      switch (ch.type) {
        case "attribute":
          return writeAttribute(ch, maxAttr, indent + 1, maxAttrQualifiers);
        case "operation":
          return writeMethod(ch, maxMeth, indent + 1);
        case "const":
          return writeConst(ch, maxConst, indent + 1);
        case "maplike":
          return writeMaplike(ch, indent + 1);
        case "iterable":
          return writeIterable(ch, indent + 1);
        case "ws":
          return writeBlankLines(ch);
        case "line-comment":
          return writeLineComment(ch, indent + 1);
        case "multiline-comment":
          return writeMultiLineComment(ch, indent + 1);
        default:
          throw new Error("Unexpected member type: `" + ch.type + "`.");
      }
    })
    .join("");
  const idlInterfaceTmpl = tmpls["interface.html"];
  return idlInterfaceTmpl({
    obj: obj,
    indent: indent,
    partial: obj.partial ? "partial " : "",
    callback: callback,
    children: children,
  });
}

function writeAttributeQualifiers(attr) {
  var qualifiers = "";
  if (attr.static) qualifiers += "static ";
  if (attr.stringifier) qualifiers += "stringifier ";
  if (attr.inherit) qualifiers += "inherit ";
  if (attr.readonly) qualifiers += "readonly ";
  return qualifiers;
}

function writeAttribute(attr, max, indent, maxQualifiers) {
  const idlAttributeTmpl = tmpls["attribute.html"];
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

function writeMethod(meth, max, indent) {
  var paramObjs = meth.arguments
    .filter(function(it) {
      return !whiteSpaceTypes.has(it.type);
    })
    .map(function(it) {
      const idlParamTmpl = tmpls["param.html"];
      return idlParamTmpl({
        obj: it,
        optional: it.optional ? "optional " : "",
        variadic: it.variadic ? "..." : "",
      });
    });
  var params = paramObjs.join(", ");
  var len = idlType2Text(meth.idlType).length;
  if (meth.static) len += 7;
  var specialProps = ["getter", "setter", "deleter", "stringifier"];
  var special = "";
  for (var i in specialProps) {
    if (meth[specialProps[i]]) {
      special = specialProps[i] + " ";
      len += special.length;
      break;
    }
  }
  var pad = max - len;
  var methObj = {
    obj: meth,
    indent: indent,
    static: meth.static ? "static " : "",
    special: special,
    pad: pad,
    children: params,
  };
  const idlMethodTmpl = tmpls["method.html"];
  var ret = idlMethodTmpl(methObj);
  var line = $(ret).text();
  if (line.length > 80) {
    var paramPad = line.indexOf("(") + 1;
    methObj.children = paramObjs.join(",\n" + pads(paramPad));
    ret = idlMethodTmpl(methObj);
  }
  return ret;
}

function writeConst(cons, max, indent) {
  const idlConstTmpl = tmpls["const.html"];
  var pad = max - idlType2Text(cons.idlType).length;
  if (cons.nullable) pad--;
  return idlConstTmpl({
    obj: cons,
    indent: indent,
    pad: pad,
    nullable: cons.nullable ? "?" : "",
  });
}

// Writes a single blank line if whitespace includes at least one blank line.
function writeBlankLines(whitespace) {
  if (/\n.*\n/.test(whitespace.value)) {
    // Members end with a newline, so we only need 1 extra one to get a blank line.
    return "\n";
  }
  return "";
}

function writeLineComment(comment, indent) {
  const idlLineCommentTmpl = tmpls["line-comment.html"];
  return idlLineCommentTmpl({ indent: indent, comment: comment.value });
}

function writeMultiLineComment(comment, indent) {
  // Split the multi-line comment into lines so we can indent it properly.
  var lines = comment.value.split(/\r\n|\r|\n/);
  if (lines.length === 0) {
    return "";
  } else if (lines.length === 1) {
    return writeLineComment(lines[0], indent);
    //idlLineCommentTmpl({ indent: indent, comment: lines[0] });
  }
  var initialSpaces = Math.max(0, /^ */.exec(lines[1])[0].length - 3);

  function trimInitialSpace(line) {
    return line.slice(initialSpaces);
  }
  const idlMultiLineCommentTmpl = tmpls["multiline-comment.html"];
  return idlMultiLineCommentTmpl({
    indent: indent,
    firstLine: lines[0],
    lastLine: trimInitialSpace(lines[lines.length - 1]),
    innerLine: lines.slice(1, -1).map(trimInitialSpace),
  });
}

function writeMaplike(maplike, indent) {
  const idlMaplikeTmpl = tmpls["maplike.html"];
  var qualifiers = "";
  if (maplike.readonly) qualifiers += "readonly ";
  return idlMaplikeTmpl({
    obj: maplike,
    qualifiers: qualifiers,
    indent: indent,
  });
}

function writeIterable(iterable, indent) {
  var qualifiers = "";
  if (iterable.readonly) qualifiers += "readonly ";
  const idlIterableTmpl = tmpls["iterable.html"];
  return idlIterableTmpl({
    obj: iterable,
    qualifiers: qualifiers,
    indent: indent,
  });
}

function writeMember(memb, maxQualifiers, maxType, indent) {
  var opt = { obj: memb, indent: indent };
  opt.typePad = maxType - idlType2Text(memb.idlType).length;
  if (memb.required) opt.qualifiers = "required ";
  else opt.qualifiers = "         ";
  opt.qualifiers = opt.qualifiers.slice(0, maxQualifiers);
  const idlDictMemberTmpl = tmpls["dictionary.html"];
  return idlDictMemberTmpl(opt);
}

const definableTypes = new Set(["dictionary", "interface", "enum"]);

function addDefinitionRoots({ idlArray, idlElem }) {
  const closestSection = idlElem.closest(
    "section[data-dfn-for], section, body"
  );
  idlArray
    .filter(({ type }) => definableTypes.has(type))
    .map(({ name }) => name.toLowerCase())
    .forEach(name => {
      // if we don't have a dfnFor, add it.
      if (!closestSection.dataset.dfnFor) {
        closestSection.dataset.dfnFor = name;
        closestSection.dataset.dfnLinkFor = name;
        return;
      }
      // Otherwise, let's add it.
      const currentDfns = closestSection.dataset.dfnFor
        .split(" ")
        .map(value => value.toLowerCase());
      if (!currentDfns.includes(name)) {
        closestSection.dataset.dfnFor = currentDfns.concat(name).join(" ");
      }
    });
  return { idlArray, idlElem };
}

function toHTML({ idlArray, idlElem }) {
  idlElem.classList.add("def");
  // This one probably crashed, so let's not replace it
  if (idlArray.length === 0) {
    return;
  }
  const html = idlArray
    .filter(idlObj => !whiteSpaceTypes.has(idlObj.type))
    .map(idlObj => writeDefinition(idlObj))
    .join("\n\n");
  idlElem.innerHTML = html;
}

function registerHelpers() {
  Array.from(helpers.entries()).forEach(([key, f]) =>
    hb.registerHelper(key, f)
  );
}

function unregisterHelpers() {
  Array.from(helpers.keys()).forEach(key => hb.unregisterHelper(key));
}

const styleElement = document.createElement("style");
styleElement.id = "respec-webidl";
styleElement.textContent = css;
document.head.appendChild(styleElement);

export function run(conf, doc, cb) {
  // Find all idls
  const idls = doc.querySelectorAll("pre.idl");
  if (!idls.length) {
    styleElement.remove();
    return cb();
  }
  // If we have IDL to process...
  registerHelpers();
  Array.from(idls)
    .map(idlElem => ({ idlArray: toIdlArray(idlElem), idlElem }))
    .map(addDefinitionRoots)
    .map(toHTML);
  if (window.requestIdleCallback) {
    window.requestIdleCallback(unregisterHelpers);
  } else {
    unregisterHelpers();
  }
  cb();
}
