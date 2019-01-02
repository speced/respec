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

import hyperHTML from "hyperhtml";

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

/**
 * Generates HTML by parsing an IDL string
 * @param {String} str IDL string
 * @return {Node} html output
 */
export function idlStringToHtml(str) {
  const { base, attribute, member, method, args } = parseInlineIDL(str);

  if (base.startsWith("[[") && base.endsWith("]]")) {
    // is internal slot (possibly local)
    return hyperHTML`<code><a data-xref-type="attribute">${base}</a></code>`;
  }

  const baseHtml = base
    ? hyperHTML`<a data-xref-type="_IDL_">${base}</a>.`
    : "";

  if (member) {
    // type: Dictionary["member"]
    return hyperHTML`<code><a
    class="respec-idl-xref" data-xref-type="dictionary">${base}</a>["<a
    class="respec-idl-xref" data-xref-type="dict-member"
    data-link-for="${base}" data-lt="${member}">${member}</a>"]</code>`;
  }

  if (attribute) {
    // type: base.attribute
    return hyperHTML`<code>${baseHtml}<a class="respec-idl-xref"
      data-xref-type="attribute" data-link-for="${base}">${attribute}</a></code>`;
  }

  if (method) {
    // base.method(args)
    const [methodName] = method.split("(", 1);
    return hyperHTML`<code>${baseHtml}<a class="respec-idl-xref"
      data-xref-type="method" data-link-for="${base}"
      data-lt="${method}">${methodName}</a>(${{
      html: args.map(arg => `<var>${arg}</var>`).join(", "),
    }})</code>`;
  }

  return hyperHTML`<code><a data-xref-type="_IDL_">${base}</a></code>`;
}
