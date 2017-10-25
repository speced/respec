// Module core/webidl
//  Highlights and links WebIDL marked up inside <pre class="idl">.

import { pub } from "core/pubsubhub";
import webidl2 from "deps/webidl2";
import { validateWebIDL } from "core/webidl-validator";
import hb from "handlebars.runtime";
import css from "deps/text!core/css/webidl.css";
import tmpls from "templates";
import { normalizePadding } from "core/utils";
import {
  idlArgumentNameKeyword,
  idlAttributeNameKeyword,
  idlKeywords,
  idlOperation,
  idlType as idlTypeDefault,
} from "core/symbols";
export const name = "core/webidl";

function idlKeywordEscaper(keywordSet) {
  return identifier => {
    const isKeyword = idlKeywords.has(identifier);
    const isInCollection = keywordSet && keywordSet.has(identifier);
    if (isKeyword || isInCollection) {
      identifier = +"_";
    }
    return identifier;
  };
}

// Handlebars Helpers
const escapeIdentifier = idlKeywordEscaper();
const escapeArgumentName = idlKeywordEscaper(idlArgumentNameKeyword);
const escapeAttributeName = idlKeywordEscaper(idlAttributeNameKeyword);

function idlExtAttr(obj, indent) {
  return extAttr(obj.extAttrs, indent, /*singleLine=*/ false);
}

function extAttrInline(obj) {
  return extAttr(obj.extAttrs, 0, /*singleLine=*/ true);
}

function typeExtAttrs(obj) {
  return extAttr(obj.typeExtAttrs, 0, /*singleLine=*/ true);
}

function extAttrRhs(rhs, options) {
  if (rhs.type === "identifier") {
    const { value: name, type } = rhs;
    return options.fn({ obj: rhs, name, type, parent });
  }
  const combined = rhs.value
    .map(name => {
      const obj = {
        ...defaultLinkableObj,
        name,
        type: "extended-attribute-item",
      };
      return options.fn(obj);
    })
    .join(",");
  return `(${combined})`;
}

function param(obj) {
  const idlParamTmpl = tmpls["param.html"];
  return new hb.SafeString(
    idlParamTmpl({
      obj,
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
      pub("error", `Unexpected constant value type: \`"${value.type}"\`.`);
      return "<Unknown>";
  }
}

function join(arr, between, options) {
  return arr.map(elem => options.fn(elem)).join(between);
}

function joinNonWhitespace(arr, between, options) {
  return arr
    .filter(elem => elem.type !== "ws")
    .map(elem => options.fn(elem))
    .join(between);
}

const helpers = new Map([
  ["escapeArgumentName", escapeArgumentName],
  ["escapeAttributeName", escapeAttributeName],
  ["escapeIdentifier", escapeIdentifier], // used by enum-item.html
  ["extAttr", idlExtAttr],
  ["extAttrInline", extAttrInline],
  ["extAttrRhs", extAttrRhs],
  ["idlType", ({ idlType }) => new hb.SafeString(idlType2Html(idlType))],
  ["idn", idn],
  ["join", join],
  ["joinNonWhitespace", joinNonWhitespace],
  ["jsIf", jsIf],
  ["pads", num => new hb.SafeString(pads(num))],
  ["param", param],
  ["stringifyIdlConst", stringifyIdlConst],
  ["toLowerCase", str => str.toLowerCase()],
  ["tryLink", tryLink],
  ["typeExtAttrs", typeExtAttrs],
]);

/**
 * Converts a IDL constructor definition (extended attribute) to an IDL operation.
 *
 * @param {Object} obj
 */
function constructorToOperation(obj) {
  const { parent: { name }, parent } = obj;
  const idlType = { ...idlTypeDefault, idlType: name };
  const opt = {
    ...idlOperation,
    name,
    idlType,
    parent,
    arguments: obj.arguments.concat(),
  };
  return opt;
}

/**
 * Adds hyperlinks for each IDL type. Handles IDL defaults.
 */
const defaultLinkableObj = Object.freeze({
  inheritance: "",
  name: "",
  extAttrs: [],
  type: "",
});
function tryLink(obj, options) {
  const { inheritance, name, type, parent } = {
    ...defaultLinkableObj,
    ...obj,
  };
  const content = options.fn(this);
  const a = document.createElement("a");
  // We are going to return a hyperlink
  a.innerText = content;
  a.dataset.linkType = "idl";
  // If no type, derive the type from the parent (e.g., "attribute-type")
  // https://github.com/w3c/webidl2.js/issues/93
  a.dataset.idlType = type || parent && parent.type ? `${parent.type}-type` : "";
  const parents = new Set();
  if (parent && parent.name) {
    parents.add(parent.name.toLowerCase());
  }
  // linked terms - later maps to "data-lt" attribute.
  const lt = new Set();
  // This is an internal IDL reference.
  switch (type) {
    case "enum": {
      lt.add(name);
      break;
    }
    case "extended-attribute": {
      switch (name) {
        case "NamedConstructor":
          break;
        // Constructor is a special case of an operation for the parent interface.
        case "Constructor": {
          const opt = constructorToOperation(obj);
          deriveNamesForOperation(opt).reduce((lt, term) => lt.add(term), lt);
          break;
        }
      }
      break;
    }
    case "operation": {
      const isDefault = obj.extAttrs.some(({ name }) => name === "Default");
      if (isDefault) {
        a.dataset.idlIsDefault = name;
      }
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
    case "namespace":
    case "interface": {
      // Interfaces can inherit, so we check if we are trying to inherit
      const isSuperClass = content === inheritance;
      const actualName = isSuperClass ? inheritance : name;
      let normalName = actualName.toLowerCase();
      parents.add(normalName);
      break;
    }
  }
  if (lt.size) {
    a.dataset.lt = [...lt]
      .map(term => term.toLowerCase())
      .filter(term => a.textContent.toLowerCase() !== term)
      .join("|");
  }
  if (type !== "extended-attribute" && parents.size) {
    a.dataset.linkFor = [...parents].join(" ");
  }
  return a.outerHTML;
}

/**
 * Dictionaries support their name, dot notation
 * and parent["name"]
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
  const names = [methodId, methodName];
  if (args.length) {
    // fully qualified method, but no type information
    const params = args
      .filter(whitespace)
      .map(({ name, variadic }) => `${variadic ? "..." : ""}${name}`)
      .join(", ");
    const fullyQualifiedName = `${name}(${params})`;
    names.push(fullyQualifiedName);
    // fully qualified method with type information
    const paramAndTypes = args
      .filter(whitespace)
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
    // Fully qualified with return type (unspecific)
    names.unshift(`${returnType} ${fullyQualifiedWithTypes}`);
  } else {
    names.unshift(`${returnType} ${methodName}`);
  }
  return names.reverse(); // most specific, to least specific
}

const TABSIZE = 4;
function idn(lvl) {
  return "".padStart(lvl * TABSIZE);
}

function idlType2Html(idlType) {
  if (Array.isArray(idlType)) {
    return idlType.map(idlType2Html).join(", ");
  }
  const nullable = idlType.nullable ? "?" : "";
  if (idlType.union) {
    const union = `(${idlType.idlType
      .map(idlType2Html)
      .join(" or ")})${nullable}`;
    return union;
  }
  if (idlType.array) {
    var arrayStr = idlType.array.reduce(
      (arrayStr, item, i) => arrayStr + (idlType.nullableArray[i] ? "?" : "[]"),
      ""
    );
    const { generic, idlType } = idlType;
    const array = idlType2Html({ generic, idlType }) + arrayStr + nullable;
    return array;
  }
  const type = idlType2Html(
    idlType.generic ? idlType.generic : idlType.idlType
  );
  return type + nullable;
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

const whiteSpaceTypes = new Set([
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
  return new hb.SafeString(tmpParser.innerHTML);
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
  result.filter(whitespace).forEach(obj => addParent(obj));
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
          .filter(whitespace)
          .filter(({ type }) => type !== ",")
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
    case "namespace":
    case "interface":
      return writeInterfaceDefinition(opt);
    case "callback interface":
      return writeInterfaceDefinition(opt, "callback ");
    case "dictionary": {
      let maxQualifiers = 0;
      let maxType = 0;
      obj.members.filter(whitespace).forEach(function(it) {
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
      var paramObjs = obj.arguments.filter(whitespace).map(function(it) {
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
  const { obj, indent } = opt;
  let maxAttr = 0;
  let maxAttrQualifiers = 0;
  let maxMeth = 0;
  let maxConst = 0;
  obj.members
    .filter(whitespace)
    .filter(({ type }) => !["maplike", "iterable"].includes(type))
    .forEach(it => {
      var len = idlType2Text(it.idlType).length;
      switch (it.type) {
        case "attribute": {
          const qualifiersLen = writeAttributeQualifiers(it).length;
          maxAttr = len > maxAttr ? len : maxAttr;
          maxAttrQualifiers =
            qualifiersLen > maxAttrQualifiers
              ? qualifiersLen
              : maxAttrQualifiers;
          break;
        }
        case "operation": {
          maxMeth = len > maxMeth ? len : maxMeth;
          break;
        }
        case "const": {
          maxConst = len > maxConst ? len : maxConst;
          break;
        }
      }
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
  const partial = obj.partial ? "partial " : "";
  const idlInterfaceTmpl = tmpls["interface.html"];
  return idlInterfaceTmpl({
    obj,
    indent,
    callback,
    children,
    partial,
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

function whitespace({ type }) {
  return whiteSpaceTypes.has(type) === false;
}

function writeMethod(meth, max, indent) {
  var paramObjs = meth.arguments.filter(whitespace).map(function(it) {
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
  const idlDictMemberTmpl = tmpls["dict-member.html"];
  return idlDictMemberTmpl(opt);
}

const definableTypes = new Set(["dictionary", "interface", "enum"]);

function addDefinitionRoots({ idlArray, idlElem }) {
  const closestSection = idlElem.closest(
    "section[data-dfn-for], section, body"
  );
  const { dataset } = closestSection;
  const dfnsFor = toNormalizedSet(dataset.dfnFor);
  const linksFor = toNormalizedSet(dataset.linkFor);
  idlArray
    .filter(({ type }) => definableTypes.has(type))
    .map(({ name }) => name.toLowerCase())
    .forEach(name => {
      dfnsFor.add(name);
      linksFor.add(name);
    });
  dataset.dfnFor = [...dfnsFor].join(" ");
  dataset.linkFor = [...linksFor].join(" ");
  return { idlArray, idlElem };
}

function toNormalizedSet(str = "") {
  return str
    .split(/\s+/)
    .filter(item => item)
    .map(elem => elem.toLocaleLowerCase().trim())
    .reduce((collector, item) => collector.add(item), new Set());
}

function toHTML({ idlArray, idlElem }) {
  idlElem.classList.add("def");
  const html = idlArray
    .filter(whitespace)
    .map(idlObj => writeDefinition(idlObj))
    .join("\n\n");
  return { idlElem, html };
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
    .map(obj => validateWebIDL(obj.idlArray) && obj)
    .map(addDefinitionRoots)
    .filter(({ idlArray: { length } }) => length)
    .map(toHTML)
    .forEach(({ idlElem, html }) => {
      idlElem.innerHTML = html;
    });
  if (window.requestIdleCallback) {
    window.requestIdleCallback(unregisterHelpers);
  } else {
    unregisterHelpers();
  }
  cb();
}
