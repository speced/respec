/**
 * Parses an inline IDL string (`{{{ idl string }}}`)
 *  and renders its components as HTML
 */

import hyperHTML from "hyperhtml";

/**
 * Parses an IDL string and returns its components as:
 *
 * Foo ->
 *  { type: "base", identifier: "Foo" }
 * Foo.bar ->
 *  { type: "base", identifier: "Foo" } <- parent
 *  { type: "attribute", identifier: "bar", parent }
 * Foo.baz(arg1, arg2) ->
 *  { type: "base", identifier: "Foo" } <- parent
 *  { type: "method", identifier: "baz", args: ["arg1", "arg2"] }
 * etc.
 */
function parseInlineIDL(str) {
  const methodRegex = /(\w+)\((.*)\)$/;
  const slotRegex = /^\[\[(\w+)\]\]$/;
  // matches: `value` or `[[value]]`
  // NOTE: [[value]] is actually a slot, but database has this as type="attribute"
  const attributeRegex = /^((?:\[\[)?(?:\w+)(?:\]\])?)$/;
  // TODO: const splitRegex = /(?<=\]\]|\b)\./
  // https://github.com/w3c/respec/pull/1848/files#r225087385
  const methodSplitRegex = /\.?(\w+\(.*\)$)/;
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

function findMarchingVarType(varName, contextNode) {
  if (!contextNode) return null;
  const potentialVars = [
    ...contextNode.parentElement
      .closest("section, body")
      .querySelectorAll("var[data-type]"),
  ];
  const matchedVar = potentialVars.find(
    ({ textContent }) => textContent.trim() === varName
  );
  return matchedVar ? matchedVar.dataset.type : null;
}

function renderBase(details, contextNode) {
  // Check if base is a local variable in a section
  const { identifier } = details;
  details.idlType = findMarchingVarType(identifier, contextNode);
  const html = details.idlType
    ? hyperHTML`<var data-type="${details.idlType}">${identifier}</var>`
    : hyperHTML`<a data-xref-type="_IDL_">${identifier}</a>`;
  // we can use the identifier as the base type
  if (!details.idlType) details.idlType = identifier;
  return html;
}

// Internal slot: .[[identifier]] or [[identifier]]
function renderInternalSlot(details) {
  const { identifier, parent } = details;
  details.idlType = findDfnType(`[[${identifier}]]`);
  const lt = `[[${identifier}]]`;
  const html = hyperHTML`${parent ? "." : ""}[[<a
    class="respec-idl-xref"
    data-xref-type="_IDL_"
    data-type="${details.idlType}"
    data-lt="${lt}">${identifier}</a>]]`;
  return html;
}

// Attribute: .identifier
function renderAttribute(details) {
  const { parent, identifier } = details;
  let { idlType: linkFor } = parent;
  // We need to walk up the parent
  if (!linkFor) {
    // TODO: we get the type from the parent definition
    // THIS IS TOO FRAGILE:
    const query = `dfn[data-idl=attribute][data-title=${identifier}]`;
    const dfn = document.querySelector(query);
    linkFor = dfn.dataset.dfnFor;
  }
  const dfn = document.querySelector(
    `dfn[data-dfn-for=${linkFor.toLocaleLowerCase()}][data-idl=attribute][data-title=${identifier}]`
  );
  const dataType = dfn ? dfn.dataset.type : null;
  const html = hyperHTML`.<a
      class="respec-idl-xref"
      data-xref-type="attribute|dict-member"
      data-link-for="${linkFor}"
      data-type="${dataType}">${identifier}</a>`;
  return html;
}

// Method: .identifier(arg1, arg2, ...), identifier(arg1, arg2, ...)
function renderMethod(details, contextNode) {
  const { args, identifier, type, parent } = details;
  const { idlType } = parent || {};
  const argsText = args
    .map(arg => {
      // Are we passing a local variable to the method?
      const type = findMarchingVarType(arg, contextNode);
      return { type, arg };
    })
    .map(({ arg, type }) => `<var data-type="${type}">${arg}</var>`)
    .join(", ");
  const searchText = `${identifier}(${args.join(", ")})`;
  const html = hyperHTML`${parent ? "." : ""}<a
    class="respec-idl-xref"
    data-xref-type="${type}"
    data-link-for="${idlType}"
    data-lt="${searchText}"
    >${identifier}</a>(${[argsText]})`;
  return html;
}

/**
 * Generates HTML by parsing an IDL string
 * @param {String} str IDL string
 * @return {Node} html output
 */
export function idlStringToHtml(str, contextNode) {
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
        output.push(renderBase(details, contextNode));
        break;
      case "attribute":
        output.push(renderAttribute(details));
        break;
      case "internal-slot":
        output.push(renderInternalSlot(details));
        break;
      case "method":
        output.push(renderMethod(details, contextNode));
        break;
      default:
        throw new Error("Unknown type.");
    }
  }
  const result = render`${output}`;
  return result;
}
