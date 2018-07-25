// Module core/inlines
// Process all manners of inline information. These are done together despite it being
// seemingly a better idea to orthogonalise them. The issue is that processing text nodes
// is harder to orthogonalise, and in some browsers can also be particularly slow.
// Things that are recognised are <abbr>/<acronym> which when used once are applied
// throughout the document, [[REFERENCES]]/[[!REFERENCES]], and RFC2119 keywords.
// CONFIGURATION:
//  These options do not configure the behaviour of this module per se, rather this module
//  manipulates them (oftentimes being the only source to set them) so that other modules
//  may rely on them.
//  - normativeReferences: a map of normative reference identifiers.
//  - informativeReferences: a map of informative reference identifiers.
//  - respecRFC2119: a list of the number of times each RFC2119
//    key word was used.  NOTE: While each member is a counter, at this time
//    the counter is not used.
import { pub } from "core/pubsubhub";
import "deps/hyperhtml";
import { getTextNodes } from "core/utils";
export const name = "core/inlines";

// const inlineIdlRegex = /^([\w\.]*)\.(\w+)(?:\((.*)\))?$/;

export function run(conf) {
  document.normalize();
  if (!conf.normativeReferences) conf.normativeReferences = new Set();
  if (!conf.informativeReferences) conf.informativeReferences = new Set();
  if (!conf.respecRFC2119) conf.respecRFC2119 = {};

  // PRE-PROCESSING
  const abbrMap = new Map();
  for (const abbr of Array.from(document.querySelectorAll("abbr[title]"))) {
    abbrMap.set(abbr.textContent, abbr.title);
  }
  const aKeys = [...abbrMap.keys()];
  aKeys.sort((a, b) => b.length - a.length);
  const abbrRx = aKeys.length ? `(?:\\b${aKeys.join("\\b)|(?:\\b")}\\b)` : null;

  // PROCESSING
  const txts = getTextNodes(document.body, ["pre"]);
  const rx = new RegExp(
    "(\\bMUST(?:\\s+NOT)?\\b|\\bSHOULD(?:\\s+NOT)?\\b|\\bSHALL(?:\\s+NOT)?\\b|" +
      "\\bMAY\\b|\\b(?:NOT\\s+)?REQUIRED\\b|\\b(?:NOT\\s+)?RECOMMENDED\\b|\\bOPTIONAL\\b|" +
      "(?:{{3}.*}{3})|" +
      "(?:\\[\\[(?:!|\\\\)?[A-Za-z0-9\\.-]+\\]\\])" +
      (abbrRx ? `|${abbrRx}` : "") +
      ")"
  );
  for (const txt of txts) {
    const subtxt = txt.data.split(rx);
    if (subtxt.length === 1) continue;

    const df = document.createDocumentFragment();
    while (subtxt.length) {
      const t = subtxt.shift();
      let matched = null;
      if (subtxt.length) matched = subtxt.shift();
      df.appendChild(document.createTextNode(t));
      if (matched) {
        // RFC 2119
        if (
          /MUST(?:\s+NOT)?|SHOULD(?:\s+NOT)?|SHALL(?:\s+NOT)?|MAY|(?:NOT\s+)?REQUIRED|(?:NOT\s+)?RECOMMENDED|OPTIONAL/.test(
            matched
          )
        ) {
          matched = matched.split(/\s+/).join(" ");
          df.appendChild(
            hyperHTML`<em class="rfc2119" title="${matched}">${matched}</em>`
          );
          // remember which ones were used
          conf.respecRFC2119[matched] = true;
        } else if (conf.xref && matched.startsWith("{{{")) {
          // External IDL references (xref)
          const ref = matched
            .replace(/^\{{3}/, "")
            .replace(/\}{3}$/, "")
            .trim();
          if (ref.startsWith("\\")) {
            df.appendChild(
              document.createTextNode(`{{{${ref.replace(/^\\/, "")}}}}`)
            );
          } else {
            df.appendChild(generateIDLMarkup(ref));
          }
        } else if (matched.startsWith("[[")) {
          // BIBREF
          let ref = matched;
          ref = ref.replace(/^\[\[/, "");
          ref = ref.replace(/\]\]$/, "");
          if (ref.startsWith("\\")) {
            df.appendChild(
              document.createTextNode(`[[${ref.replace(/^\\/, "")}]]`)
            );
          } else {
            let norm = false;
            if (ref.startsWith("!")) {
              norm = true;
              ref = ref.replace(/^!/, "");
            }
            // contrary to before, we always insert the link
            if (norm) conf.normativeReferences.add(ref);
            else conf.informativeReferences.add(ref);
            df.appendChild(document.createTextNode("["));
            const refHref = `#bib-${ref.toLowerCase()}`;
            df.appendChild(
              hyperHTML`<cite><a class="bibref" href="${refHref}">${ref}</a></cite>`
            );
            df.appendChild(document.createTextNode("]"));
          }
        } else if (abbrMap.has(matched)) {
          // ABBR
          if (txt.parentNode.tagName === "ABBR")
            df.appendChild(document.createTextNode(matched));
          else
            df.appendChild(hyperHTML`
              <abbr title="${abbrMap.get(matched)}">${matched}</abbr>`);
        } else {
          // FAIL -- not sure that this can really happen
          pub(
            "error",
            `Found token '${matched}' but it does not correspond to anything`
          );
        }
      }
    }
    txt.parentNode.replaceChild(df, txt);
  }
}

function generateIDLMarkup(ref) {
  const { type, base, member, args } = parseInlineIDL(ref);

  if (!type) {
    return hyperHTML`<code><a class="respec-idl-xref">${base}</a></code>`;
  }

  const code = hyperHTML`<code><a
      class="respec-idl-xref">${base}</a>.<a
      data-xref-type="${type}"
      data-xref-for="${base}"
      class="respec-idl-xref">${member}</a></code>`;

  // type: base.attribute
  if (type === "attribute") return code;

  // base.method(args)
  if (type === "method") {
    code.appendChild(document.createTextNode("("));
    args.forEach((arg, i, all) => {
      code.appendChild(hyperHTML`<var>${arg}</var>`);
      if (i !== all.length - 1) {
        code.appendChild(document.createTextNode(", "));
      }
    });
    code.appendChild(document.createTextNode(")"));
  }
  return code;
}

function parseInlineIDL(str) {
  const result = Object.create(null);
  let splitted = str.split("(", 1);
  if (splitted.length > 1) {
    // is method
    result.args = splitted
      .pop()
      .replace(/\)$/, "")
      .split(/,\s*/)
      .filter(s => s);
    splitted = splitted.join("").split(".");
    result.type = "method";
    result.member = splitted.pop();
  }
  splitted = splitted.join("").split(".");
  if (!result.member && splitted.length > 1) {
    result.member = splitted.pop();
    result.type = "attribute";
  }
  result.base = splitted.join(".");
  return result;
}
