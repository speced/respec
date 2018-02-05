// Module core/webidl
import { pub } from "core/pubsubhub";
import webidl2 from "deps/webidl2";
import { validateWebIDL } from "core/webidl-validator";
import css from "deps/text!core/css/webidl.css";
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
    return isKeyword || isInCollection
      ? (identifier = `_${identifier}`)
      : identifier;
  };
}
const escapeIdentifier = idlKeywordEscaper();
const escapeArgumentName = idlKeywordEscaper(idlArgumentNameKeyword);
const escapeAttributeName = idlKeywordEscaper(idlAttributeNameKeyword);

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

function getTypeFromParent({ parent }) {
  if (!parent) {
    return "";
  }
  if (parent.hasOwnProperty("type")) {
    return parent.type + "-type";
  }
  return getTypeFromParent(parent);
}

/**
 * Dictionaries support their name and dot notation.
 */
function deriveNamesForDictMember({ parent, name }) {
  const { name: parentName } = parent;
  return [`${parentName}.${name}`, name];
}
/**
 * Attributes can be addressed by their name directly, or by
 * dot notation.
 */
function deriveNamesForAttribute({ parent, name }) {
  const { name: parentName } = parent;
  const asDotNotation = `${parentName}.${name}`;
  return [asDotNotation, name];
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
      .filter(nonWhitespace)
      .map(({ name, variadic }) => `${variadic ? "..." : ""}${name}`)
      .join(", ");
    const fullyQualifiedName = `${name}(${params})`;
    names.push(fullyQualifiedName);
    // fully qualified method with type information
    const paramAndTypes = args
      .filter(nonWhitespace)
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

function dedent(text) {
  const min = text
    .trimRight()
    .match(/^ +/gm)
    .reduce((min, { length }) => Math.min(min, length), +Infinity);
  if (!min) {
    return text;
  }
  const trim = `^ {${min}}`;
  const trimmer = new RegExp(trim, "gm");
  const result = text.replace(trimmer, "");
  return result.trimRight();
}

// Takes the result of WebIDL2.parse(), an array of definitions.
function toIdlArray(idlElem) {
  let result = [];
  const text = dedent(idlElem.textContent);
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
  result.forEach(obj => addParent(obj));
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
        value.forEach(item => {
          addParent(item, obj);
        });
        return;
      }
      value.parent = obj;
    });
}

function normalizeWhitespace(str) {
  return str.replace(/  +/g, " ").trim();
}

function toEnumValue(obj) {
  if (obj.type !== "string") {
    return obj;
  }
  const { type: idlType, value: name } = obj;
  return {
    type: "enum-value",
    name,
    idlType,
  };
}

class IDLWriter {
  constructor({ indent } = { indent: 2 }) {
    this.tabSize = indent;
  }
  write(idl) {
    const { type } = idl;
    switch (type) {
      case "interface":
      case "callback interface":
      case "interface mixin":
      case "namespace":
      case "dictionary":
        return this.writeContainer(idl);
      case "enum":
        return this.writeEnum(idl);
      case "enum-value":
        return this.writeEnumValue(idl);
      case "includes":
      case "implements":
        return this.writeSourceTarget(idl);
      case "callback":
        return this.writeCallback(idl);
      case "typedef":
        return this.writeTypeDef(idl);
      case "field":
        return this.writeDictionaryMembers(idl);
      case "attribute":
        return this.writeAttribute(idl);
      case "operation":
        return this.writeOperation(idl);
      case "const":
        return this.writeConst(idl);
      case "maplike":
      case "setlike":
      case "iterable":
        return this.writeSpecialMember(idl);
      case "ws-pea":
      case "ws-tpea":
      case "ws":
        return this.writeWhiteSpace(idl);
      case "multiline-comment":
        return this.writeMultilineComment(idl);
      case "line-comment":
        return this.writeLineComment(idl);
      case "string":
      case "number":
        return this.writeValue(idl);
      case ",":
        return () => ",";
      default:
        return this.writeUnsupported.bind(this);
    }
  }
  writeUnsupported({ type }) {
    const msg = `Unsupported IDL type \`${type}\``;
    pub("error", msg);
    return "";
  }
  writeSourceTarget(obj) {
    const extAttrs = this.writeExtendedAttributes(obj.extAttrs);
    const source = this.makeLink({ name: obj.implements, type: "interface" });
    const target = this.makeLink({ name: obj.target, type: "interface" });
    const { type } = obj;
    return normalizeWhitespace(`${extAttrs} ${target} ${type} ${source};`);
  }
  writeIdlType(obj) {
    const nullable = obj.nullable ? "?" : "";
    if (obj.union) {
      const type = obj.idlType
        .map(idlType => this.writeIdlType(idlType))
        .join(" or ");
      return `(${type})${nullable})`;
    }
    if (obj.generic) {
      const types = []
        .concat(obj.idlType)
        .map(idlType =>
          this.writeIdlType({ ...idlType, type: "generic", parent: obj })
        )
        .join(", ");
      const linkedGeneric = this.makeLink({ ...obj, name: obj.generic });
      return `${linkedGeneric}&lt;${types}>${nullable}`;
    }
    const { idlType: name } = obj;
    const link = this.makeLink({ ...obj, name });
    return `${link}${nullable}`;
  }
  makeLink(obj, { linkedTerms } = { linkedTerms: [] }) {
    const { name, type } = obj;
    // Nothing to link.
    if (!name) {
      return "";
    }
    // If no type, derive the type from the parent (e.g., "attribute-type")
    // https://github.com/w3c/webidl2.js/issues/93
    const idlType = type || getTypeFromParent(obj);
    if (!idlType) {
      throw Error("Could not determine type?");
    }
    const lt = linkedTerms.join("|");
    const parent = obj.parent ? obj.parent.name : "";
    const id = `ref-for-dom-${parent ? `${parent}-` : ""}${name}`;
    return `<a id="${id}" data-link-for="${parent}" data-lt="${lt}" dataset-idl-type="${idlType}">${name}</a>`;
  }
  writeExtendedAttributes(extAttrs) {
    const result = extAttrs
      .map(extAttr => this.writeExtendedAttribute(extAttr))
      .join(", ");
    return result ? `[${result}]` : "";
  }
  writeExtendedAttribute(obj) {
    const { arguments: extArgs, name, rhs, parent } = obj;
    let params = extArgs
      ? extArgs
          .filter(nonWhitespace)
          .map(idlParam => this.writeParam(idlParam))
          .join(", ")
      : "";
    params = params ? `(${params})` : "";
    const isList = rhs ? Array.isArray(rhs.value) : false;
    const rhsValue = isList
      ? `(${rhs.value.map(type => this.makeLink({ name: type, parent: rhs }))})`
      : rhs ? this.makeLink({ name: rhs.value, parent: rhs }) : "";
    const rightSide = rhsValue ? `=${rhsValue}` : "";
    const type = name === "Constructor" && "constructor";
    const linkedTerms = type
      ? deriveNamesForOperation(constructorToOperation(obj))
      : [];
    const linkedName = this.makeLink({ name, parent, type }, { linkedTerms });
    const result = `${linkedName}${rightSide && `${rightSide}`}${params}`;
    return result;
  }
  writeCallSite(args) {
    return `(${args
      .filter(nonWhitespace)
      .map(param => this.writeParam(param))
      .join(", ")})`;
  }
  // https://github.com/w3c/webidl2.js#arguments
  writeParam(obj) {
    const extAttrs = this.writeExtendedAttributes(obj.extAttrs);
    const idlType = this.writeIdlType(obj.idlType);
    const name = escapeArgumentName(obj.name);
    const optional = obj.optional ? "optional" : "";
    const variadic = obj.variadic ? "..." : "";
    const result = `${extAttrs} ${optional} ${idlType}${variadic} ${name}`.trimLeft();
    return normalizeWhitespace(result);
  }
  writeConst(obj) {
    const result = this.writeMember({
      ...obj,
      name: this.makeLink(obj),
      extAttrs: this.writeExtendedAttributes(obj.extAttrs),
      qualifiers: this.writeQualifiers(obj),
      idlType: this.writeIdlType({ ...obj, type: "const-type" }),
      rhs: this.writeRightHandSide(obj.value),
    });
    return result;
  }
  writeRightHandSide(obj) {
    return `= ${this.writeValue(obj)}`;
  }
  // https://github.com/w3c/webidl2.js#default-and-const-values
  writeValue({ value, negative }) {
    return value ? `${negative ? "-" : ""}${JSON.stringify(value)}` : "";
  }
  // https://github.com/w3c/webidl2.js#iterable-legacyiterable-maplike-setlike-declarations
  writeSpecialMember(obj) {
    const { type } = obj;
    const extAttrs = this.writeExtendedAttributes(obj.extAttrs);
    const idlType = []
      .concat(obj.idlType)
      .map(type => this.writeIdlType(type))
      .join(", ");
    const readOnly = obj.readonly ? "readonly" : "";
    const result = `${extAttrs} ${readOnly} ${type}&lt;${idlType}>;`;
    return normalizeWhitespace(result);
  }
  writeMember(obj) {
    const { extAttrs, qualifiers, type, idlType, name, rhs } = obj;
    let result = `${extAttrs} ${qualifiers} ${type} ${idlType} ${name} ${rhs}`.trim();
    result = normalizeWhitespace(result) + ";";
    return result;
  }
  writeEnum(obj) {
    const members = obj.values.map(toEnumValue);
    const result = this.writeContainer({ ...obj, members });
    return result;
  }
  writeEnumValue(obj) {
    const name = this.makeLink(obj);
    return `"${name}"`;
  }
  writeContainer(obj) {
    const defaultContainerObj = {
      callback: "",
      children: "",
    };
    const normalizedObj = { ...defaultContainerObj, ...obj };
    const partial = obj.partial ? "partial" : "";
    const extAttrs = this.writeExtendedAttributes(obj.extAttrs);
    const inherits = obj.inheritance
      ? `: ${this.makeLink({ name: obj.inheritance, type: "inheritance" })}`
      : "";
    const children = obj.members
      .map(member => this.write(member))
      .filter(Boolean) // Empty whitespace
      .map(
        line =>
          ["\n", ","].includes(line)
            ? line
            : `${line}`.padStart(line.length + this.tabSize)
      )
      .join("");
    const name = this.makeLink(normalizedObj);
    const { callback, type } = normalizedObj;
    const preamble = `${partial} ${callback} ${type} ${name} ${inherits}`.trim();
    const result = `${extAttrs}\n${preamble} {${children
      ? `${children}`
      : ""}};`.trimLeft();
    return result;
  }
  writeTypeDef(obj) {
    const idlType = this.writeIdlType(obj.idlType);
    const identifier = this.makeLink(obj);
    return `typedef ${idlType} ${identifier};`;
  }
  // Dictionary members
  writeDictionaryMembers(obj) {
    const name = escapeIdentifier(obj.name);
    Object.assign(obj, { name });
    const linkedTerms = deriveNamesForDictMember(obj);
    const result = this.writeMember({
      name: this.makeLink(obj, { linkedTerms }),
      extAttrs: this.writeExtendedAttributes(obj.extAttrs),
      qualifiers: this.writeQualifiers(obj),
      idlType: this.writeIdlType(obj.idlType),
      type: "",
      rhs: obj.default
        ? this.writeRightHandSide({ ...obj.default, value: obj.default.value })
        : "",
    });
    return result;
  }
  writeAttribute(obj) {
    const name = escapeAttributeName(obj.name);
    Object.assign(obj, { name });
    const linkedTerms = deriveNamesForAttribute(obj);
    const result = this.writeMember({
      ...obj,
      name: this.makeLink(obj, { linkedTerms }),
      extAttrs: this.writeExtendedAttributes(obj.extAttrs),
      qualifiers: this.writeQualifiers(obj),
      idlType: this.writeIdlType(obj.idlType),
      rhs: "",
    });
    return result;
  }
  writeQualifiers(obj) {
    const qualifiers = [
      "static",
      "stringifier",
      "inherit",
      "readonly",
      "required",
    ]
      .filter(member => obj[member])
      .join(" ");
    return qualifiers;
  }
  writeCallback(obj) {
    const name = { name: escapeIdentifier(obj.name) };
    Object.assign(obj, name);
    const { type } = obj;
    const extAttrs = this.writeExtendedAttributes(obj.extAttrs);
    const linkedName = this.makeLink(obj);
    const returnType = this.writeIdlType(obj.idlType);
    const callSite = this.writeCallSite(obj.arguments);
    const result = `${extAttrs} ${type} ${linkedName} = ${returnType} ${callSite};`;
    return normalizeWhitespace(result);
  }
  // https://github.com/w3c/webidl2.js#operation-member
  writeOperation(obj) {
    const name = { name: escapeIdentifier(obj.name) };
    Object.assign(obj, name);
    const specialOps = ["getter", "setter", "deleter", "stringifier"];
    const extAttrs = this.writeExtendedAttributes(obj.extAttrs);
    const static_ = obj.static ? "static" : "";
    const callSite = this.writeCallSite(obj.arguments);
    const special = specialOps.filter(op => obj[op]).join(" ");
    const linkedTerms = deriveNamesForOperation(obj);
    const linkedName = this.makeLink(obj, { linkedTerms });
    const returnType = this.writeIdlType(obj.idlType);
    const result = `${extAttrs} ${static_} ${special} ${returnType} ${linkedName}${callSite};`;
    return normalizeWhitespace(result);
  }
  writeLineComment({ value }) {
    return `//${value}\n`;
  }
  writeMultilineComment({ value }) {
    return `/*${value}*/`;
  }
  // Writes a single blank line if whitespace includes at least one blank line.
  writeWhiteSpace({ value }) {
    return /[\n.*\n|^\n]/.test(value) ? "\n" : "";
  }
}

function nonWhitespace({ type }) {
  return "ws" !== type;
}

function addDefinitionRoots({ idlArray, idlElem }) {
  const definableTypes = ["dictionary", "interface", "enum"];
  const closestSection = idlElem.closest(
    "section[data-dfn-for], section, body"
  );
  const { dataset } = closestSection;
  const dfnsFor = toNormalizedSet(dataset.dfnFor);
  const linksFor = toNormalizedSet(dataset.linkFor);
  idlArray
    .filter(({ type }) => definableTypes.includes(type))
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
    .filter(Boolean)
    .map(elem => elem.toLocaleLowerCase().trim())
    .reduce((collector, item) => collector.add(item), new Set());
}

function makeWriter() {
  const writer = new IDLWriter({ indent: 2 });
  return function toHTML({ idlArray, idlElem }) {
    idlElem.classList.add("def");
    const html = idlArray
      .map(idlObj => writer.write(idlObj))
      .filter(Boolean)
      .map(line => (line.endsWith("\n") ? line : `${line}\n`))
      .join("")
      .trim();
    return { idlElem, html };
  };
}

const styleElement = document.createElement("style");
styleElement.id = "respec-webidl";
styleElement.textContent = css;
document.head.appendChild(styleElement);

export function run(conf, doc, cb) {
  const idls = doc.querySelectorAll("pre.idl");
  if (!idls.length) {
    styleElement.remove();
    return cb();
  }
  const toHTML = makeWriter();
  // If we have IDL to process...
  Array.from(idls)
    .map(idlElem => ({ idlArray: toIdlArray(idlElem), idlElem }))
    .map(obj => validateWebIDL(obj.idlArray) && obj)
    .map(addDefinitionRoots)
    .filter(({ idlArray: { length } }) => length)
    .map(toHTML)
    .forEach(({ idlElem, html }) => {
      idlElem.innerHTML = html.trim();
    });
  cb();
}
