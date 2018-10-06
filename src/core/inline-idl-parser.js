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

const methodRegex = /\((.*)\)$/;
const idlSplitRegex = /\b\.\b|\.(?=\[\[)/;
const dictionaryRegex = /(\w+)\["(\w+)"\]/;

function parseInlineIDL(str) {
  const result = Object.create(null);
  const splitted = str.split(idlSplitRegex);
  if (methodRegex.test(splitted[splitted.length - 1])) {
    result.method = splitted.pop();
    result.args = result.method.match(methodRegex)[1].split(/,\s*/);
  }
  if (splitted.length > 1 && !result.method) {
    result.attribute = splitted.pop();
  }
  const remaining = splitted.join(".");
  if (dictionaryRegex.test(remaining)) {
    const [, base, member] = remaining.match(dictionaryRegex);
    result.base = base;
    result.member = member;
  } else {
    result.base = remaining;
  }
  return result;
}

function findMarchingVar(varName, contextNode) {
  if (!contextNode) return null;
  const potentialVars = [
    ...contextNode.parentElement
      .closest("section, body")
      .querySelectorAll("var[data-type]"),
  ];
  const matchedVar = potentialVars.find(
    ({ textContent }) => textContent.trim() === varName
  );
  return matchedVar ? matchedVar : null;
}

function renderMember(member, baseHTML, idlType, matchedVar) {
  // type: Dictionary["member"]
  const memberHTML = hyperHTML`[<code>"<a
    class="respec-idl-xref" data-xref-type="dict-member"
    data-link-for="${idlType}" data-lt="${member}">${member}</a>"</code>]`;
  const render = hyperHTML(document.createDocumentFragment());
  if (matchedVar) {
    return render`${[baseHTML]}${[memberHTML]}`;
  }
  return render`<code>${[baseHTML]}</code>${[memberHTML]}`;
}

function renderAttribute(attribute, baseHTML, idlType, matchedVar) {
  // type: base.attribute
  const attributeHTML = hyperHTML`<a 
      class="respec-idl-xref"
      data-xref-type="attribute" 
      data-link-for="${idlType}">${attribute}</a>`;
  if (matchedVar) {
    const render = hyperHTML(document.createDocumentFragment());
    return render`${baseHTML}.<code>${attributeHTML}</code>`;
  }
  return hyperHTML`<code>${baseHTML}.${attributeHTML}</code>`;
}

function renderMethod(method, args, baseHTML, idlType, matchedVar) {
  // base.method(args)
  const [methodName] = method.split("(", 1);
  const argsHTML = args
    .map(arg => {
      // Are we passing a local variable to the method?
      const argMatch = findMarchingVar(arg, matchedVar);
      const argType = argMatch ? argMatch.dataset.type : undefined;
      return { argType, arg };
    })
    .map(
      ({ arg, argType }) =>
        `<var${argType ? ` data-type="${argType}"` : ""}>${arg}</var>`
    )
    .join(", ");
  const methodHTML = `<a 
    class="respec-idl-xref"
    data-xref-type="method" 
    data-link-for="${idlType}"
    data-lt="${idlType}.${method}">${methodName}</a>(${argsHTML})`;
  const render = hyperHTML(document.createDocumentFragment());
  if (matchedVar) {
    return render`${[baseHTML]}.<code>${[methodHTML]}</code>`;
  }
  return render`<code>${[baseHTML]}</code>.${[methodHTML]}`;
}

/**
 * Generates HTML by parsing an IDL string
 * @param {String} str IDL string
 * @return {Node} html output
 */
export function idlStringToHtml(str, contextNode) {
  const { base, attribute, member, method, args } = parseInlineIDL(str);

  if (base.startsWith("[[") && base.endsWith("]]")) {
    // is internal slot (possibly local)
    return hyperHTML`<code><a data-xref-type="attribute">${base}</a></code>`;
  }

  // Check if base is a local variable
  const matchedVar = findMarchingVar(base, contextNode);
  const idlType = matchedVar ? matchedVar.dataset.type : base;
  let baseHTML;
  if (matchedVar) {
    baseHTML = hyperHTML`<var data-type="${idlType}">${base}</var>`;
  } else {
    baseHTML = base
      ? hyperHTML`<a data-xref-type="_IDL_">${base}</a>`
      : hyperHTML``;
  }
  let html;
  if (member) {
    html = renderMember(member, baseHTML, idlType, matchedVar);
  } else if (attribute) {
    html = renderAttribute(attribute, baseHTML, idlType, matchedVar);
  } else if (method) {
    html = renderMethod(method, args, baseHTML, idlType, matchedVar);
  } else {
    html = hyperHTML`<code><a data-xref-type="_IDL_">${base}</a></code>`;
  }
  return html;
}
