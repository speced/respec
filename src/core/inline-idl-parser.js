// Parses an inline IDL string (`{{ idl string }}`)
//  and renders its components as HTML

import hyperHTML from "hyperhtml";

const methodRegex = /(\w+)\((.*)\)$/;
const slotRegex = /^\[\[(\w+)\]\]$/;
// matches: `value` or `[[value]]`
// NOTE: [[value]] is actually a slot, but database has this as type="attribute"
const attributeRegex = /^((?:\[\[)?(?:\w+)(?:\]\])?)$/;
const enumRegex = /^(\w+)\["([\w ]+)"\]$/;
const enumValueRegex = /^"([\w ]+)"$/;
// TODO: const splitRegex = /(?<=\]\]|\b)\./
// https://github.com/w3c/respec/pull/1848/files#r225087385
const methodSplitRegex = /\.?(\w+\(.*\)$)/;

/** @param {string} str */
function parseInlineIDL(str) {
  const [nonMethodPart, methodPart] = str.split(methodSplitRegex);
  const tokens = nonMethodPart
    .split(".")
    .concat(methodPart)
    .filter(s => s && s.trim());
  const results = [];
  while (tokens.length) {
    const value = tokens.pop();
    // Method
    if (methodRegex.test(value)) {
      const [, identifier, allArgs] = value.match(methodRegex);
      const args = allArgs.split(/,\s*/).filter(arg => arg);
      results.push({ type: "method", identifier, args });
      continue;
    }
    // Enum["enum value"]
    if (enumRegex.test(value)) {
      const [, identifier, enumValue] = value.match(enumRegex);
      results.push({ type: "enum", identifier, enumValue });
      continue;
    }
    if (enumValueRegex.test(value)) {
      const [, identifier] = value.match(enumValueRegex);
      results.push({ type: "enum-value", identifier });
      continue;
    }
    // internal slot
    if (slotRegex.test(value)) {
      const [, identifier] = value.match(slotRegex);
      results.push({ type: "internal-slot", identifier });
      continue;
    }
    // attribute
    if (attributeRegex.test(value) && tokens.length) {
      const [, identifier] = value.match(attributeRegex);
      results.push({ type: "attribute", identifier });
      continue;
    }
    // base, always final token
    if (attributeRegex.test(value) && tokens.length === 0) {
      results.push({ type: "base", identifier: value });
      continue;
    }
    throw new SyntaxError(
      `IDL micro-syntax parsing error: "${value}" in \`${str}\``
    );
  }
  // link the list
  results.forEach((item, i, list) => {
    item.parent = list[i + 1] || null;
  });
  // return them in the order we found them...
  return results.reverse();
}

function findDfnType(varName) {
  const potentialElems = [...document.body.querySelectorAll("dfn[data-type]")];
  const match = potentialElems.find(
    ({ textContent }) => textContent.trim() === varName
  );
  return match ? match.dataset.type : null;
}

function renderBase(details) {
  // Check if base is a local variable in a section
  const { identifier } = details;
  // we can use the identifier as the base type
  if (!details.idlType) details.idlType = identifier;
  return hyperHTML`<a data-xref-type="_IDL_">${identifier}</a>`;
}

// Internal slot: .[[identifier]] or [[identifier]]
function renderInternalSlot(details) {
  const { identifier, parent } = details;
  details.idlType = findDfnType(`[[${identifier}]]`);
  const lt = `[[${identifier}]]`;
  const html = hyperHTML`${parent ? "." : ""}[[<a
    class="respec-idl-xref"
    data-xref-type="attribute"
    data-link-for=${parent ? parent.identifier : undefined}
    data-lt="${lt}">${identifier}</a>]]`;
  return html;
}

// Attribute: .identifier
function renderAttribute(details) {
  const { parent, identifier } = details;
  const html = hyperHTML`.<a
      class="respec-idl-xref"
      data-xref-type="attribute|dict-member"
      data-link-for="${parent.identifier}"
    >${identifier}</a>`;
  return html;
}

// Method: .identifier(arg1, arg2, ...), identifier(arg1, arg2, ...)
function renderMethod(details) {
  const { args, identifier, type, parent } = details;
  const { identifier: linkFor } = parent || {};
  const argsText = args.map(arg => `<var>${arg}</var>`).join(", ");
  const searchText = `${identifier}(${args.join(", ")})`;
  const html = hyperHTML`${parent ? "." : ""}<a
    class="respec-idl-xref"
    data-xref-type="${type}"
    data-link-for="${linkFor}"
    data-lt="${searchText}"
    >${identifier}</a>(${[argsText]})`;
  return html;
}

// Enum: Identifier["enum value"]
function renderEnum(details) {
  const { identifier, enumValue } = details;
  const html = hyperHTML`<a class="respec-idl-xref"
    data-xref-type="enum"
    >${identifier}</a>["<a class="respec-idl-xref"
    data-xref-type="enum-value" data-link-for="${identifier}"
    >${enumValue}</a>]"`;
  return html;
}

// Enum value: "enum value"
function renderEnumValue(details) {
  const { identifier } = details;
  const html = hyperHTML`"<a
    class="respec-idl-xref"
    data-xref-type="enum-value"
    >${identifier}</a>"`;
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
    console.error(error);
    return document.createTextNode(str);
  }
  const render = hyperHTML(document.createDocumentFragment());
  const output = [];
  for (const details of results) {
    switch (details.type) {
      case "base":
        output.push(renderBase(details));
        break;
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
      case "enum-value":
        output.push(renderEnumValue(details));
        break;
      default:
        throw new Error("Unknown type.");
    }
  }
  const result = render`<code>${output}</code>`;
  return result;
}
