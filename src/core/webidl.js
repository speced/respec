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
var idlImplementsTmpl = tmpls["implements.html"];
var idlInterfaceTmpl = tmpls["interface.html"];
var idlIterableTmpl = tmpls["iterable.html"];
var idlLineCommentTmpl = tmpls["line-comment.html"];
var idlMaplikeTmpl = tmpls["maplike.html"];
var idlMethodTmpl = tmpls["method.html"];
var idlMultiLineCommentTmpl = tmpls["multiline-comment.html"];
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
  hb.registerHelper("typeExtAttrs", function(obj) {
    return extAttr(obj.typeExtAttrs, 0, /*singleLine=*/ true);
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
    return (
      "(" +
      rhs.value
        .map(function(item) {
          return options.fn(item);
        })
        .join(",") +
      ")"
    );
  });
  hb.registerHelper("param", function(obj) {
    return new hb.SafeString(
      idlParamTmpl({
        obj: obj,
        optional: obj.optional ? "optional " : "",
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
  hb.registerHelper("idn", function(indent) {
    return new hb.SafeString(idn(indent));
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
      case "string":
      case "number":
      case "boolean":
      case "sequence":
        return JSON.stringify(value.value);
      default:
        pub("error", "Unexpected constant value type: `" + value.type + "`.");
        return "<Unknown>";
    }
  });
  hb.registerHelper("escapeArgumentName", escapeArgumentName);
  hb.registerHelper("escapeAttributeName", escapeAttributeName);
  hb.registerHelper("escapeIdentifier", escapeIdentifier);
  hb.registerHelper("pads", function(num) {
    return new hb.SafeString(pads(num));
  });
  hb.registerHelper("join", function(arr, between, options) {
    return arr
      .map(function(elem) {
        return options.fn(elem);
      })
      .join(between);
  });
  hb.registerHelper("joinNonWhitespace", function(arr, between, options) {
    return arr
      .filter(function(elem) {
        return elem.type !== "ws";
      })
      .map(function(elem) {
        return options.fn(elem);
      })
      .join(between);
  });
  // A block helper that emits an <a title> around its contents
  // if obj.dfn exists. If it exists, that implies that
  // there's another <dfn> for the object.
  hb.registerHelper("tryLink", function(obj, options) {
    var content = options.fn(this);
    const isDefaultJSON =
      obj.name === "toJSON" &&
      obj.extAttrs.some(({ name }) => name === "Default");
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
      a.dataset.linkFor = obj.linkFor ? hb.Utils.escapeExpression(obj.linkFor).toLowerCase() : "";
      a.dataset.lt = obj.dfn[0].dataset.lt || "";
    }
    return a.outerHTML;
  });
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
    type = standardTypes.has(idlType.generic)
      ? linkStandardType(idlType.generic)
      : idlType2Html(idlType.generic);
    type = type + "&lt;" + idlType2Html(idlType.idlType) + ">";
  } else {
    type = standardTypes.has(idlType.idlType)
      ? linkStandardType(idlType.idlType)
      : idlType2Html(idlType.idlType);
  }
  return type + nullable;
}

function linkStandardType(type) {
  if (!standardTypes.has(type)) {
    return type;
  }
  const safeType = hb.Utils.escapeExpression(type);
  return (
    "<a data-cite='" + standardTypes.get(safeType) + "'>" + safeType + "</a>"
  );
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
  // XXX
  //  this might be more simply done as
  //  return Array(num + 1).join(" ")
  var str = "";
  for (var i = 0; i < num; i++) str += " ";
  return str;
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
  ["LegacyArrayClass", "WEBIDL#LegacyArrayClass"],
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
  const safeString = new hb.SafeString(idlExtAttributeTmpl(opt));
  const tmpParser = document.createElement("div");
  tmpParser.innerHTML = safeString;
  Array.from(tmpParser.querySelectorAll(".extAttrName"))
    .filter(function(elem) {
      return extenedAttributesLinks.has(elem.textContent);
    })
    .forEach(function(elem) {
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
  "legacycaller",
  "legacyiterable",
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
  "legacycaller",
  "legacyiterable",
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
const attributeNameKeyword = new Set(["required"]);
var operationNames = {};
var idlPartials = {};

function escapeArgumentName(argumentName) {
  if (idlKeywords.has(argumentName) && !argumentNameKeyword.has(argumentName))
    return "_" + argumentName;
  return argumentName;
}

function escapeAttributeName(attributeName) {
  if (
    idlKeywords.has(attributeName) &&
    !attributeNameKeyword.has(attributeName)
  )
    return "_" + attributeName;
  return attributeName;
}

function escapeIdentifier(identifier) {
  if (idlKeywords.has(identifier)) return "_" + identifier;
  return identifier;
}

// Takes the result of WebIDL2.parse(), an array of definitions.
function makeMarkup(conf, parse) {
  var attr = { class: "def idl" };
  var $pre = $("<pre></pre>").attr(attr);
  $pre.html(
    parse
      .filter(function(defn) {
        return !typeIsWhitespace(defn.type);
      })
      .map(function(defn) {
        return writeDefinition(defn, -1);
      })
      .join("\n\n")
  );
  return $pre;
}

function writeDefinition(obj, indent) {
  indent++;
  var opt = { indent: indent, obj: obj };
  switch (obj.type) {
    case "typedef":
      return idlTypedefTmpl(opt);
    case "implements":
      return idlImplementsTmpl(opt);
    case "interface":
      return writeInterfaceDefinition(opt);
    case "callback interface":
      return writeInterfaceDefinition(opt, "callback ");
    case "dictionary":
      var maxQualifiers = 0,
        maxType = 0;
      var members = obj.members.filter(function(member) {
        return !typeIsWhitespace(member.type);
      });
      obj.members.forEach(function(it) {
        if (typeIsWhitespace(it.type)) {
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
      return idlDictionaryTmpl({
        obj: obj,
        indent: indent,
        children: children,
        partial: obj.partial ? "partial " : "",
      });
    case "callback":
      var paramObjs = obj.arguments
        .filter(function(it) {
          return !typeIsWhitespace(it.type);
        })
        .map(function(it) {
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
      var ret = idlCallbackTmpl(callbackObj);
      var line = $(ret).text();
      if (line.length > 80) {
        var paramPad = line.indexOf("(") + 1;
        callbackObj.children = paramObjs.join(",\n" + pads(paramPad));

        ret = idlCallbackTmpl(callbackObj);
      }
      return ret;
    case "enum":
      var children = "";
      for (var i = 0; i < obj.values.length; i++) {
        var item = obj.values[i];
        switch (item.type) {
          case undefined:
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
              lname: item.toString()
                ? item.toString().toLowerCase()
                : "the-empty-string",
              name: item.toString(),
              parentID: obj.name.toLowerCase(),
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
      return idlEnumTmpl({ obj: obj, indent: indent, children: children });
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
      typeIsWhitespace(it.type) ||
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
  return idlInterfaceTmpl({
    obj: obj,
    indent: indent,
    partial: obj.partial ? "partial " : "",
    callback: callback,
    children: children,
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
  if (attr.static) qualifiers += "static ";
  if (attr.stringifier) qualifiers += "stringifier ";
  if (attr.inherit) qualifiers += "inherit ";
  if (attr.readonly) qualifiers += "readonly ";
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

function writeMethod(meth, max, indent) {
  var paramObjs = meth.arguments
    .filter(function(it) {
      return !typeIsWhitespace(it.type);
    })
    .map(function(it) {
      return idlParamTmpl({
        obj: it,
        optional: it.optional ? "optional " : "",
        variadic: it.variadic ? "..." : "",
      });
    });
  var params = paramObjs.join(", ");
  var len = idlType2Text(meth.idlType).length;
  if (meth.static) len += 7;
  var specialProps = [
    "getter",
    "setter",
    "deleter",
    "legacycaller",
    "stringifier",
  ];
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
  return idlLineCommentTmpl({ indent: indent, comment: comment.value });
}

function writeMultiLineComment(comment, indent) {
  // Split the multi-line comment into lines so we can indent it properly.
  var lines = comment.value.split(/\r\n|\r|\n/);
  if (lines.length === 0) {
    return "";
  } else if (lines.length === 1) {
    return idlLineCommentTmpl({ indent: indent, comment: lines[0] });
  }
  var initialSpaces = Math.max(0, /^ */.exec(lines[1])[0].length - 3);

  function trimInitialSpace(line) {
    return line.slice(initialSpaces);
  }
  return idlMultiLineCommentTmpl({
    indent: indent,
    firstLine: lines[0],
    lastLine: trimInitialSpace(lines[lines.length - 1]),
    innerLine: lines.slice(1, -1).map(trimInitialSpace),
  });
}

function writeMaplike(maplike, indent) {
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
    .filter(
      ({ type }) =>
        [
          "implements",
          "ws",
          "ws-pea",
          "ws-tpea",
          "line-comment",
          "multiline-comment",
        ].includes(type) === false
    )
    .forEach(function(defn) {
      var name;
      switch (defn.type) {
        // Top-level entities with linkable members.
        case "callback interface":
        case "dictionary":
        case "exception":
        case "interface":
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
          defn.values.forEach(function(v, i) {
            if (v.type === undefined) {
              defn.values[i] = {
                toString: function() {
                  return v;
                },
                dfn: findDfn(name, v, definitionMap, defn.type, idlElem),
              };
            }
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
          defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
          break;
        case "operation":
          if (defn.name) {
            name = defn.name;
            var qualifiedName = parent + "." + name;
            var fullyQualifiedName = parent + "." + name + "()";
            if (!operationNames[fullyQualifiedName]) {
              operationNames[fullyQualifiedName] = [];
            }
            if (!operationNames[qualifiedName]) {
              operationNames[qualifiedName] = [];
            } else {
              defn.overload = operationNames[qualifiedName].length;
              name = defn.name + "!overload-" + defn.overload;
            }
            operationNames[fullyQualifiedName].push(defn);
            operationNames[qualifiedName].push(defn);
          } else if (
            defn.getter ||
            defn.setter ||
            defn.deleter ||
            defn.legacycaller ||
            defn.stringifier
          ) {
            name = "";
          }
          const idHead = `idl-def-${parent.toLowerCase()}-${name.toLowerCase()}`;
          const idTail =
            defn.overload || !defn.arguments.length
              ? ""
              : "-" +
                defn.arguments
                  .filter(arg => !typeIsWhitespace(arg.type))
                  .map(arg => arg.name.toLowerCase())
                  .join("-")
                  .replace(/\s/g, "_");
          defn.idlId = idHead + idTail;
          break;
        case "maplike":
          name = "maplike";
          defn.idlId = ("idl-def-" + parent + "-" + name).toLowerCase();
          break;
        case "iterable":
          name = "iterable";
          defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
          break;
        default:
          pub(
            "error",
            new Error("ReSpec doesn't know about IDL type: `" + defn.type + "`.")
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
  const id = "dom-" + (parent ? parent + "-" : "") + name.replace(/[()]/g, "");
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
      parse = webidl2.parse($(this).text(), { ws: true });
    } catch (e) {
      pub(
        "error",
        `Failed to parse WebIDL: \`${e.message}\`.
        <details>
        <pre>${normalizePadding(this.textContent)}\n ${e}</pre>
        </details>`
      );
      // Skip this <pre> and move on to the next one.
      return;
    }
    linkDefinitions(parse, conf.definitionMap, "", this);
    var $df = makeMarkup(conf, parse);
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
