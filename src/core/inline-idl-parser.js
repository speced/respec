// Parses an inline IDL string (`{{ idl string }}`)
//  and renders its components as HTML

import hyperHTML from "hyperhtml";
import { showInlineError } from "./utils";
const idlPrimitiveRegex = /^[a-z]+(\s+[a-z]+)+$/; // {{unrestricted double}} {{ double }}
const exceptionRegex = /\B"([^"]*)"\B/; // {{ "SomeException" }}
const methodRegex = /(\w+)\((.*)\)$/;
const slotRegex = /^\[\[(\w+)\]\]$/;
// matches: `value` or `[[value]]`
// NOTE: [[value]] is actually a slot, but database has this as type="attribute"
const attributeRegex = /^((?:\[\[)?(?:\w+)(?:\]\])?)$/;
const enumRegex = /^(\w+)\["([\w- ]*)"\]$/;
// TODO: const splitRegex = /(?<=\]\]|\b)\./
// https://github.com/w3c/respec/pull/1848/files#r225087385
const methodSplitRegex = /\.?(\w+\(.*\)$)/;

/** @param {string} str */
function parseInlineIDL(str) {
  const [nonMethodPart, methodPart] = str.split(methodSplitRegex);
  const tokens = nonMethodPart
    .split(/[./]/)
    .concat(methodPart)
    .filter(s => s && s.trim())
    .map(s => s.trim());
  const renderParent = !str.includes("/");
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
      const [, identifier] = value.match(slotRegex);
      results.push({ type: "internal-slot", identifier, renderParent });
      continue;
    }
    // attribute
    if (attributeRegex.test(value) && tokens.length) {
      const [, identifier] = value.match(attributeRegex);
      results.push({ type: "attribute", identifier, renderParent });
      continue;
    }
    if (idlPrimitiveRegex.test(value)) {
      results.push({ type: "idl-primitive", identifier: value, renderParent });
      continue;
    }
    // base, always final token
    if (attributeRegex.test(value) && tokens.length === 0) {
      results.push({ type: "base", identifier: value, renderParent });
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

function renderBase(details) {
  // Check if base is a local variable in a section
  const { identifier, renderParent } = details;
  if (renderParent) {
    return hyperHTML`<a data-xref-type="_IDL_">${identifier}</a>`;
  }
}

/**
 * Internal slot: .[[identifier]] or [[identifier]]
 */
function renderInternalSlot(details) {
  const { identifier, parent, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const lt = `[[${identifier}]]`;
  const html = hyperHTML`${parent && renderParent ? "." : ""}[[<a
    data-xref-type="attribute"
    data-link-for=${linkFor}
    data-xref-for=${linkFor}
    data-lt="${lt}">${identifier}</a>]]`;
  return html;
}

/**
 * Attribute: .identifier
 */
function renderAttribute(details) {
  const { parent, identifier, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const html = hyperHTML`${renderParent ? "." : ""}<a
      data-xref-type="attribute|dict-member"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
    >${identifier}</a>`;
  return html;
}

/**
 * Method: .identifier(arg1, arg2, ...), identifier(arg1, arg2, ...)
 */
function renderMethod(details) {
  const { args, identifier, type, parent, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const argsText = args.map(arg => `<var>${arg}</var>`).join(", ");
  const searchText = `${identifier}(${args.join(", ")})`;
  const html = hyperHTML`${parent && renderParent ? "." : ""}<a
    data-xref-type="${type}"
    data-link-for="${linkFor}"
    data-xref-for="${linkFor}"
    data-lt="${searchText}"
    >${identifier}</a>(${[argsText]})`;
  return html;
}

/**
 * Enum:
 * Identifier["enum value"]
 * Identifer / "enum value"
 */
function renderEnum(details) {
  const { identifier, enumValue, parent } = details;
  const forContext = parent ? parent.identifier : identifier;
  const html = hyperHTML`"<a
    data-xref-type="enum-value"
    data-link-for="${forContext}"
    data-xref-for="${forContext}"
    data-lt="${!enumValue ? "the-empty-string" : null}"
    >${enumValue}</a>"`;
  return html;
}

/**
 * Exception value: "NotAllowedError"
 * Only the WebIDL spec can define exceptions
 */
function renderException(details) {
  const { identifier } = details;
  const html = hyperHTML`"<a
    data-cite="WebIDL"
    data-xref-type="exception"
    >${identifier}</a>"`;
  return html;
}

/**
 * Interface types: {{ unrestricted double }} {{long long}}
 * Only the WebIDL spec defines these types.
 */
function renderIdlPrimitiveType(details) {
  const { identifier } = details;
  const html = hyperHTML`<a
    data-cite="WebIDL"
    data-xref-type="interface"
    >${identifier}</a>`;
  return html;
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
    const el = hyperHTML`<span>{{ ${str} }}</span>`;
    showInlineError(el, error.message, "Error: Invalid inline IDL string");
    return el;
  }
  const render = hyperHTML(document.createDocumentFragment());
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
  const result = render`<code>${output}</code>`;
  return result;
}
