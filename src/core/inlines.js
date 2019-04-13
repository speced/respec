// @ts-check
// Module core/inlines
// Process all manners of inline information. These are done together despite it being
// seemingly a better idea to orthogonalise them. The issue is that processing text nodes
// is harder to orthogonalise, and in some browsers can also be particularly slow.
// Things that are recognised are <abbr>/<acronym> which when used once are applied
// throughout the document, [[REFERENCES]]/[[!REFERENCES]], {{ IDL }} and RFC2119 keywords.
// CONFIGURATION:
//  These options do not configure the behaviour of this module per se, rather this module
//  manipulates them (oftentimes being the only source to set them) so that other modules
//  may rely on them.
//  - normativeReferences: a map of normative reference identifiers.
//  - informativeReferences: a map of informative reference identifiers.
//  - respecRFC2119: a list of the number of times each RFC2119
//    key word was used.  NOTE: While each member is a counter, at this time
//    the counter is not used.
import {
  InsensitiveStringSet,
  getTextNodes,
  refTypeFromContext,
  showInlineWarning,
} from "./utils.js";
import hyperHTML from "hyperhtml";
import { idlStringToHtml } from "./inline-idl-parser.js";
import { renderInlineCitation } from "./render-biblio.js";

export const name = "core/inlines";
export const rfc2119Usage = {};

/**
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineRFC2119Matches(matched) {
  const normalize = matched.split(/\s+/).join(" ");
  const nodeElement = hyperHTML`<em class="rfc2119" title="${normalize}">${normalize}</em>`;
  // remember which ones were used
  rfc2119Usage[normalize] = true;
  return nodeElement;
}

/**
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineRefMatches(matched) {
  // slices "[[[" at the beginning and "]]]" at the end
  const ref = matched.slice(3, -3).trim();
  const nodeElement = hyperHTML`<a data-cite="${ref}"></a>`;
  return nodeElement;
}

/**
 * @param {string} matched
 */
function inlineXrefMatches(matched) {
  // slices "{{" at the beginning and "}}" at the end
  const ref = matched.slice(2, -2).trim();
  return ref.startsWith("\\")
    ? document.createTextNode(`${matched.replace("\\", "")}`)
    : idlStringToHtml(ref);
}

/**
 * @param {string} matched
 * @param {Text} txt
 * @param {Object} conf
 * @return {Iterable<Node>}
 */
function inlineBibrefMatches(matched, txt, conf) {
  // slices "[[" at the start and "]]" at the end
  const ref = matched.slice(2, -2);
  if (ref.startsWith("\\")) {
    return [document.createTextNode(`[[${ref.slice(1)}]]`)];
  }
  const { type, illegal } = refTypeFromContext(ref, txt.parentNode);
  const cite = renderInlineCitation(ref);
  const cleanRef = ref.replace(/^(!|\?)/, "");
  if (illegal && !conf.normativeReferences.has(cleanRef)) {
    showInlineWarning(
      cite.childNodes[1], // cite element
      "Normative references in informative sections are not allowed. " +
        `Remove '!' from the start of the reference \`[[!${ref}]]\``
    );
  }

  if (type === "informative" && !illegal) {
    conf.informativeReferences.add(cleanRef);
  } else {
    conf.normativeReferences.add(cleanRef);
  }
  return cite.childNodes;
}

/**
 * @param {string} matched
 * @param {Text} txt
 * @param {Map<string, string>} abbrMap
 */
function inlineAbbrMatches(matched, txt, abbrMap) {
  return txt.parentElement.tagName === "ABBR"
    ? document.createTextNode(matched)
    : hyperHTML`<abbr title="${abbrMap.get(matched)}">${matched}</abbr>`;
}

/**
 * @example |varName: type| => <var data-type="type">varName</var>
 * @example |varName| => <var>varName</var>
 * @param {string} matched
 */
function inlineVariableMatches(matched) {
  // remove "|" at the beginning and at the end, then split at an optional `:`
  const matches = matched.slice(1, -1).split(":", 2);
  const [varName, type] = matches.map(s => s.trim());
  return hyperHTML`<var data-type="${type}">${varName}</var>`;
}

export function run(conf) {
  const abbrMap = new Map();
  document.normalize();
  if (!document.querySelector("section#conformance")) {
    // make the document informative
    document.body.classList.add("informative");
  }
  conf.normativeReferences = new InsensitiveStringSet();
  conf.informativeReferences = new InsensitiveStringSet();

  if (!conf.respecRFC2119) conf.respecRFC2119 = rfc2119Usage;

  // PRE-PROCESSING
  /** @type {NodeListOf<HTMLElement>} */
  const abbrs = document.querySelectorAll("abbr[title]");
  for (const abbr of abbrs) {
    abbrMap.set(abbr.textContent, abbr.title);
  }
  const aKeys = [...abbrMap.keys()];
  const abbrRx = aKeys.length ? `(?:\\b${aKeys.join("\\b)|(?:\\b")}\\b)` : null;

  // PROCESSING
  const txts = getTextNodes(document.body, ["pre"]);
  const rx = new RegExp(
    `(${[
      "\\bMUST(?:\\s+NOT)?\\b",
      "\\bSHOULD(?:\\s+NOT)?\\b",
      "\\bSHALL(?:\\s+NOT)?\\b",
      "\\bMAY\\b",
      "\\b(?:NOT\\s+)?REQUIRED\\b",
      "\\b(?:NOT\\s+)?RECOMMENDED\\b",
      "\\bOPTIONAL\\b",
      "(?:{{2}\\s*.*\\s*}{2})", // inline IDL references,
      "\\B\\|\\w[\\w\\s]*(?:\\s*\\:[\\w\\s&;<>]+)?\\|\\B", // inline variable regex
      "(?:\\[\\[(?:!|\\\\|\\?)?[A-Za-z0-9\\.-]+\\]\\])",
      "(?:\\[\\[\\[(?:!|\\\\|\\?)?[A-Za-z0-9\\.-]+\\]\\]\\])",
      ...(abbrRx ? [abbrRx] : []),
    ].join("|")})`
  );
  for (const txt of txts) {
    const subtxt = txt.data.split(rx);
    if (subtxt.length === 1) continue;

    const df = document.createDocumentFragment();
    let matched = true;
    for (const t of subtxt) {
      matched = !matched;
      if (!matched) {
        df.appendChild(document.createTextNode(t));
      } else if (t.startsWith("{{")) {
        const node = inlineXrefMatches(t);
        df.appendChild(node);
      } else if (t.startsWith("[[[")) {
        const node = inlineRefMatches(t);
        df.appendChild(node);
      } else if (t.startsWith("[[")) {
        const nodes = inlineBibrefMatches(t, txt, conf);
        df.append(...nodes);
      } else if (t.startsWith("|")) {
        const node = inlineVariableMatches(t);
        df.appendChild(node);
      } else if (abbrMap.has(t)) {
        const node = inlineAbbrMatches(t, txt, abbrMap);
        df.appendChild(node);
      } else if (
        /MUST(?:\s+NOT)?|SHOULD(?:\s+NOT)?|SHALL(?:\s+NOT)?|MAY|(?:NOT\s+)?REQUIRED|(?:NOT\s+)?RECOMMENDED|OPTIONAL/.test(
          t
        )
      ) {
        const node = inlineRFC2119Matches(t);
        df.appendChild(node);
      } else {
        // FAIL -- not sure that this can really happen
        throw new Error(
          `Found token '${t}' but it does not correspond to anything`
        );
      }
    }
    txt.parentNode.replaceChild(df, txt);
  }
}
