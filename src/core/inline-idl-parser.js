// @ts-check
// Parses an inline IDL string (`{{ idl string }}`)
//  and renders its components as HTML

import { htmlJoinComma, showError } from "./utils.js";
import { html } from "./import-maps.js";
const idlPrimitiveRegex = /^[a-z]+(\s+[a-z]+)+\??$/; // {{unrestricted double?}} {{ double }}
const exceptionRegex = /\B"([^"]*)"\B/; // {{ "SomeException" }}
const methodRegex = /(\w+)\((.*)\)$/;

export const slotRegex = /\[\[(\w+(?: +\w+)*)\]\](\([^)]*\))?$/;
// matches: `value` or `[[value]]`
// NOTE: [[value]] is actually a slot, but database has this as type="attribute"
const attributeRegex = /^((?:\[\[)?(?:\w+(?: +\w+)*)(?:\]\])?)$/;
const baseRegex = /^(?:\w+)\??$/;
const enumRegex = /^(\w+)\["([\w- ]*)"\]$/;
// TODO: const splitRegex = /(?<=\]\]|\b)\./
// https://github.com/w3c/respec/pull/1848/files#r225087385
const methodSplitRegex = /\.?(\w+\(.*\)$)/;
const slotSplitRegex = /\/(.+)/;
const isProbablySlotRegex = /\[\[.+\]\]/;
/**
 * @typedef {object} IdlBase
 * @property {"base"} type
 * @property {string} identifier
 * @property {boolean} renderParent
 * @property {boolean} nullable
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlAttribute
 * @property {"attribute"} type
 * @property {string} identifier
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlInternalSlot
 * @property {"internal-slot"} type
 * @property {string} identifier
 * @property {string[]} [args]
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 * @property {"attribute"|"method"} slotType
 *
 * @typedef {object} IdlMethod
 * @property {"method"} type
 * @property {string} identifier
 * @property {string[]} args
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlEnum
 * @property {"enum"} type
 * @property {string} [identifier]
 * @property {string} enumValue
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlException
 * @property {"exception"} type
 * @property {string} identifier
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlPrimitive
 * @property {"idl-primitive"} type
 * @property {boolean} nullable
 * @property {string} identifier
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {IdlBase | IdlAttribute | IdlInternalSlot | IdlMethod | IdlEnum | IdlException | IdlPrimitive} InlineIdl
 */

/**
 * @param {string} str
 * @returns {InlineIdl[]}
 */
function parseInlineIDL(str) {
  // If it's got [[ string ]], then split as an internal slot
  const isSlot = isProbablySlotRegex.test(str);
  const splitter = isSlot ? slotSplitRegex : methodSplitRegex;
  const [forPart, childString] = str.split(splitter);
  if (isSlot && forPart && !childString) {
    throw new SyntaxError(
      `Internal slot missing "for" part. Expected \`{{ InterfaceName/${forPart}}}\` }.`
    );
  }
  const tokens = forPart
    .split(/[./]/)
    .concat(childString)
    .filter(s => s && s.trim())
    .map(s => s.trim());
  const renderParent = !str.includes("/");
  /** @type {InlineIdl[]} */
  const results = [];
  while (tokens.length) {
    const value = tokens.pop();
    // Method
    if (methodRegex.test(value)) {
      const [, identifier, allArgs] = value.match(methodRegex);
      const args = allArgs.split(/,\s*/).filter(arg => arg);
      results.push({ type: "method", identifier, args, renderParent });
      continue;
    }
    // Enum["enum value"]
    if (enumRegex.test(value)) {
      const [, identifier, enumValue] = value.match(enumRegex);
      results.push({ type: "enum", identifier, enumValue, renderParent });
      continue;
    }
    // Exception - "NotAllowedError"
    // Or alternate enum syntax: {{ EnumContainer / "some enum value" }}
    if (exceptionRegex.test(value)) {
      const [, identifier] = value.match(exceptionRegex);
      if (renderParent) {
        results.push({ type: "exception", identifier });
      } else {
        results.push({ type: "enum", enumValue: identifier, renderParent });
      }
      continue;
    }
    // internal slot
    if (slotRegex.test(value)) {
      const [, identifier, allArgs] = value.match(slotRegex);
      const slotType = allArgs ? "method" : "attribute";
      const args = allArgs
        ?.slice(1, -1)
        .split(/,\s*/)
        .filter(arg => arg);
      results.push({
        type: "internal-slot",
        slotType,
        identifier,
        args,
        renderParent,
      });
      continue;
    }
    // attribute
    if (attributeRegex.test(value) && tokens.length) {
      const [, identifier] = value.match(attributeRegex);
      results.push({ type: "attribute", identifier, renderParent });
      continue;
    }
    if (idlPrimitiveRegex.test(value)) {
      const nullable = value.endsWith("?");
      const identifier = nullable ? value.slice(0, -1) : value;
      results.push({
        type: "idl-primitive",
        identifier,
        renderParent,
        nullable,
      });
      continue;
    }
    // base, always final token
    if (baseRegex.test(value) && tokens.length === 0) {
      const nullable = value.endsWith("?");
      const identifier = nullable ? value.slice(0, -1) : value;
      results.push({ type: "base", identifier, renderParent, nullable });
      continue;
    }
    throw new SyntaxError(`IDL micro-syntax parsing error in \`{{ ${str} }}\``);
  }
  // link the list
  results.forEach((item, i, list) => {
    item.parent = list[i + 1] || null;
  });
  // return them in the order we found them...
  return results.reverse();
}

/**
 * @param {IdlBase} details
 */
function renderBase(details) {
  // Check if base is a local variable in a section
  const { identifier, renderParent, nullable } = details;
  if (renderParent) {
    return html`<a
      data-xref-type="_IDL_"
      data-link-type="idl"
      data-lt="${identifier}"
      ><code>${identifier + (nullable ? "?" : "")}</code></a
    >`;
  }
}

/**
 * Internal slot: .[[identifier]] or [[identifier]]
 * @param {IdlInternalSlot} details
 */
function renderInternalSlot(details) {
  const { identifier, parent, slotType, renderParent, args } = details;
  const { identifier: linkFor } = parent || {};
  const isMethod = slotType === "method";
  const argsHtml = isMethod
    ? html`(${htmlJoinComma(args, htmlArgMapper)})`
    : null;
  const textArgs = isMethod ? `(${args.join(", ")})` : "";
  const lt = `[[${identifier}]]${textArgs}`;
  const element = html`${parent && renderParent ? "." : ""}<a
      data-xref-type="${slotType}"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
      data-lt="${lt}"
      ><code>[[${identifier}]]${argsHtml}</code></a
    >`;
  return element;
}

function htmlArgMapper(str, i, array) {
  if (i < array.length - 1) return html`<var>${str}</var>`;
  // only the last argument can be variadic
  const parts = str.split(/(^\.{3})(.+)/);
  const isVariadic = parts.length > 1;
  const arg = isVariadic ? parts[2] : parts[0];
  return html`${isVariadic ? "..." : null}<var>${arg}</var>`;
}
/**
 * Attribute: .identifier
 * @param {IdlAttribute} details
 */
function renderAttribute(details) {
  const { parent, identifier, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const element = html`${renderParent ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="attribute|dict-member|const"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
      ><code>${identifier}</code></a
    >`;
  return element;
}

/**
 * Method: .identifier(arg1, arg2, ...), identifier(arg1, arg2, ...)
 * @param {IdlMethod} details
 */
function renderMethod(details) {
  const { args, identifier, type, parent, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const argsText = htmlJoinComma(args, htmlArgMapper);
  const searchText = `${identifier}(${args.join(", ")})`;
  const element = html`${parent && renderParent ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="${type}"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
      data-lt="${searchText}"
      ><code>${identifier}</code></a
    ><code>(${argsText})</code>`;
  return element;
}

/**
 * Enum:
 * Identifier["enum value"]
 * Identifer / "enum value"
 * @param {IdlEnum} details
 */
function renderEnum(details) {
  const { identifier, enumValue, parent } = details;
  const forContext = parent ? parent.identifier : identifier;
  const element = html`"<a
      data-link-type="idl"
      data-xref-type="enum-value"
      data-link-for="${forContext}"
      data-xref-for="${forContext}"
      data-lt="${!enumValue ? "the-empty-string" : null}"
      ><code>${enumValue}</code></a
    >"`;
  return element;
}

/**
 * Exception value: "NotAllowedError"
 * Only the WebIDL spec can define exceptions
 * @param {IdlException} details
 */
function renderException(details) {
  const { identifier } = details;
  const element = html`"<a
      data-link-type="idl"
      data-cite="WebIDL"
      data-xref-type="exception"
      ><code>${identifier}</code></a
    >"`;
  return element;
}

/**
 * Interface types: {{ unrestricted double }} {{long long}}
 * Only the WebIDL spec defines these types.
 * @param {IdlPrimitive} details
 */
function renderIdlPrimitiveType(details) {
  const { identifier, nullable } = details;
  const element = html`<a
    data-link-type="idl"
    data-cite="WebIDL"
    data-xref-type="interface"
    data-lt="${identifier}"
    ><code>${identifier + (nullable ? "?" : "")}</code></a
  >`;
  return element;
}

/**
 * Generates HTML by parsing an IDL string
 * @param {String} str IDL string
 * @return {Node} html output
 */
export function idlStringToHtml(str) {
  let results;
  try {
    results = parseInlineIDL(str);
  } catch (error) {
    const el = html`<span>{{ ${str} }}</span>`;
    const title = "Error: Invalid inline IDL string.";
    showError(error.message, "core/inlines", { title, elements: [el] });
    return el;
  }
  const render = html(document.createDocumentFragment());
  const output = [];
  for (const details of results) {
    switch (details.type) {
      case "base": {
        const base = renderBase(details);
        if (base) output.push(base);
        break;
      }
      case "attribute":
        output.push(renderAttribute(details));
        break;
      case "internal-slot":
        output.push(renderInternalSlot(details));
        break;
      case "method":
        output.push(renderMethod(details));
        break;
      case "enum":
        output.push(renderEnum(details));
        break;
      case "exception":
        output.push(renderException(details));
        break;
      case "idl-primitive":
        output.push(renderIdlPrimitiveType(details));
        break;
      default:
        throw new Error("Unknown type.");
    }
  }
  const result = render`${output}`;
  return result;
}
