/**
 * Parses an IDL string and returns its components as:
 *
 * Foo ->
 *  { base: "Foo" }
 * Foo.bar ->
 *  { base: "Foo", attribute: "bar" }
 * Foo.bar.baz() ->
 *  { base: "Foo.bar", method: "baz()", args: [] }
 * Foo.baz(arg1, arg2) ->
 *  { base: "Foo", method: "baz(arg1, arg2)", args: ["arg1", "arg2"] }
 * Dictionary["member"] ->
 *  { base: "Dictionary", member: "member" }
 */

const methodRegex = /(\w+)\((.*)\)$/;
const dictionaryRegex = /(\w+)+\["(\w+)"\]$/;
const slotRegex = /\[\[(\w+)\]\]$/;
const attributeRegex = /^(\w+)$/;
function parseInlineIDL(str) {
  //if (!str) return [];
  const tokens = str.split(".");
  // ends with method
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
    // dictionary
    if (dictionaryRegex.test(value)) {
      const [, identifier, member] = value.match(dictionaryRegex);
      results.push({ type: "dictionary", identifier, member });
      continue;
    }
    // attribute
    if (attributeRegex.test(value) && tokens.length) {
      const [, identifier] = value.match(attributeRegex);
      results.push({ type: "attribute", identifier });
      continue;
    }
    // base
    results.push({ type: "base", identifier: value });
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
    : hyperHTML`<a data-xref-type="_IDL_"><code>${identifier}<code></a>`;
  // we can use the identifier as the base type
  if (!details.idlType) details.idlType = identifier;
  return html;
}

// Dictionary: .identifier["member"], identifier["member"]
function renderDictionary(details, contextNode) {
  const { member, parent, identifier } = details;
  debugger
  const memberHTML = parent
    ? renderBase(details, contextNode) // it's on its own, as base
    : renderAttribute(details);
  const idlType = parent ? parent.idlType : identifier;
  const html = hyperHTML`${memberHTML}["<a 
    class="respec-idl-xref"
    data-xref-type="dict-member"
    data-link-for="${idlType}"
  >${member}</a>"</code>]`;
  // can't go any deeper with type
  return html;
}

// Internal slot: .[[identifer]]
function renderInternalSlot(details) {
  const { identifier, type } = details;
  details.idlType = findDfnType(`[[${identifier}]]`);
  const lt = `[[${identifier}]]`;
  const html = hyperHTML`.[[<code><a
    class="respec-idl-xref"
    data-xref-type="${type}"
    data-type="${details.idlType}"
    data-lt="${lt}">${identifier}</a></code>]]`;
  return html;
}

// Attribute: .identifier
function renderAttribute(details) {
  const { parent, identifier, type } = details;
  const idlType = parent ? parent.idlType : null;
  const html = hyperHTML`.<a 
      class="respec-idl-xref"
      data-xref-type="${type}" 
      data-link-for="${idlType}"><code>${identifier}</code></a>`;
  return html;
}

// Method: .identifier(arg1, arg2, ...)
function renderMethod(details, contextNode) {
  const { args, identifier, type, parent } = details;
  const { idlType } = parent;
  const argsText = args
    .map(arg => {
      // Are we passing a local variable to the method?
      const type = findMarchingVarType(arg, contextNode);
      return { type, arg };
    })
    .map(({ arg, type }) => `<var data-type="${type}">${arg}</var>`)
    .join(", ");
  const html = hyperHTML`.<a 
    class="respec-idl-xref"
    data-xref-type="${type}" 
    data-link-for="${idlType}"
    >${identifier}</a>(${[argsText]})`;
  return html;
}

/**
 * Generates HTML by parsing an IDL string
 * @param {String} str IDL string
 * @return {Node} html output
 */
export function idlStringToHtml(str, contextNode) {
  const results = parseInlineIDL(str);
  if (!results) return;
  const render = hyperHTML(document.createDocumentFragment());
  const output = [];
  for (const details of results) {
    switch (details.type) {
      case "base":
        output.push(renderBase(details, contextNode));
        break;
      case "dictionary":
        output.push(renderDictionary(details, contextNode));
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
