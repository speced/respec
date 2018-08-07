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

export function parseInlineIDL(str) {
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
