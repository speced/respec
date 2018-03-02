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
export const name = "core/inlines";

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
  const abbrRx = aKeys.length
    ? `(?:\\b${aKeys.join("\\b)|(?:\\b")}\\b)`
    : null;

  // PROCESSING
  const txts = window.$.fn.allTextNodes.call([document.body], ["pre"]);
  const rx = new RegExp(
    "(\\bMUST(?:\\s+NOT)?\\b|\\bSHOULD(?:\\s+NOT)?\\b|\\bSHALL(?:\\s+NOT)?\\b|" +
      "\\bMAY\\b|\\b(?:NOT\\s+)?REQUIRED\\b|\\b(?:NOT\\s+)?RECOMMENDED\\b|\\bOPTIONAL\\b|" +
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
          df.appendChild(hyperHTML`<em class="rfc2119" title="${matched}">${matched}</em>`);
          // remember which ones were used
          conf.respecRFC2119[matched] = true;
        } else if (/^\[\[/.test(matched)) {
          // BIBREF
          let ref = matched;
          ref = ref.replace(/^\[\[/, "");
          ref = ref.replace(/\]\]$/, "");
          if (ref.indexOf("\\") === 0) {
            df.appendChild(
              document.createTextNode(`[[${ref.replace(/^\\/, "")}]]`)
            );
          } else {
            let norm = false;
            if (ref.indexOf("!") === 0) {
              norm = true;
              ref = ref.replace(/^!/, "");
            }
            // contrary to before, we always insert the link
            if (norm) conf.normativeReferences.add(ref);
            else conf.informativeReferences.add(ref);
            df.appendChild(document.createTextNode("["));
            df.appendChild(hyperHTML`<cite><a class="bibref" href="${`#bib-${ref}`}">${ref}</a></cite>`);
            df.appendChild(document.createTextNode("]"));
          }
        } else if (abbrMap.has(matched)) {
          // ABBR
          if (txt.parentNode.tagName === "ABBR")
            df.appendChild(document.createTextNode(matched));
          else
            df.appendChild(hyperHTML`<abbr title="${abbrMap.get(matched)}">${matched}</abbr>`);
        } else {
          // FAIL -- not sure that this can really happen
          pub(
            "error",
            `Found token '${
              matched
            }' but it does not correspond to anything`
          );
        }
      }
    }
    txt.parentNode.replaceChild(df, txt);
  }
}
