// @ts-check
// Module core/inlines
// Process all manners of inline information. These are done together despite it being
// seemingly a better idea to orthogonalise them. The issue is that processing text nodes
// is harder to orthogonalise, and in some browsers can also be particularly slow.
// Things that are recognised are <abbr>/<acronym> which when used once are applied
// throughout the document, [[REFERENCES]]/[[!REFERENCES]], {{ IDL }} and RFC2119 keywords.

import {
  InsensitiveStringSet,
  getIntlData,
  getTextNodes,
  norm,
  refTypeFromContext,
  showError,
  showWarning,
} from "./utils.js";
import { html } from "./import-maps.js";
import { idlStringToHtml } from "./inline-idl-parser.js";
import { renderInlineCitation } from "./render-biblio.js";

export const name = "core/inlines";
export const rfc2119Usage = {};

const localizationStrings = {
  en: {
    rfc2119Keywords() {
      return new RegExp(
        [
          "\\bMUST(?:\\s+NOT)?\\b",
          "\\bSHOULD(?:\\s+NOT)?\\b",
          "\\bSHALL(?:\\s+NOT)?\\b",
          "\\bMAY\\b",
          "\\b(?:NOT\\s+)?REQUIRED\\b",
          "\\b(?:NOT\\s+)?RECOMMENDED\\b",
          "\\bOPTIONAL\\b",
        ].join("|")
      );
    },
  },
  de: {
    rfc2119Keywords() {
      return new RegExp(
        [
          "\\bMUSS\\b",
          "\\bERFORDERLICH\\b",
          "\\b(?:NICHT\\s+)?NÖTIG\\b",
          "\\bDARF(?:\\s+NICHT)?\\b",
          "\\bVERBOTEN\\b",
          "\\bSOLL(?:\\s+NICHT)?\\b",
          "\\b(?:NICHT\\s+)?EMPFOHLEN\\b",
          "\\bKANN\\b",
          "\\bOPTIONAL\\b",
        ].join("|")
      );
    },
  },
};
const l10n = getIntlData(localizationStrings);

// Inline `code`
// TODO: Replace (?!`) at the end with (?:<!`) at the start when Firefox + Safari
// add support.
const inlineCodeRegExp = /(?:`[^`]+`)(?!`)/; // `code`
const inlineIdlReference = /(?:{{[^}]+}})/; // {{ WebIDLThing }}
const inlineVariable = /\B\|\w[\w\s]*(?:\s*:[\w\s&;<>]+)?\|\B/; // |var : Type|
const inlineCitation = /(?:\[\[(?:!|\\|\?)?[\w.-]+(?:|[^\]]+)?\]\])/; // [[citation]]
const inlineExpansion = /(?:\[\[\[(?:!|\\|\?)?#?[\w-.]+\]\]\])/; // [[[expand]]]
const inlineAnchor = /(?:\[=[^=]+=\])/; // Inline [= For/link =]
const inlineElement = /(?:\[\^[^^]+\^\])/; // Inline [^element^]

/**
 * @example [^iframe^] // [^element^]
 * @example [^iframe/allow^] // [^element/element-attr^]
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineElementMatches(matched) {
  const value = matched.slice(2, -2).trim();
  const [element, attribute, attrValue] = value
    .split("/", 3)
    .map(s => s && s.trim())
    .filter(s => !!s);
  const [xrefType, xrefFor, textContent] = (() => {
    if (attrValue) {
      return ["attr-value", `${element}/${attribute}`, attrValue];
    } else if (attribute) {
      return ["element-attr", element, attribute];
    } else {
      return ["element", null, element];
    }
  })();
  return html`<code
    ><a data-xref-type="${xrefType}" data-xref-for="${xrefFor}"
      >${textContent}</a
    ></code
  >`;
}

/**
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineRFC2119Matches(matched) {
  const value = norm(matched);
  const nodeElement = html`<em class="rfc2119">${value}</em>`;
  // remember which ones were used
  rfc2119Usage[value] = true;
  return nodeElement;
}

/**
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineRefMatches(matched) {
  // slices "[[[" at the beginning and "]]]" at the end
  const ref = matched.slice(3, -3).trim();
  if (!ref.startsWith("#")) {
    return html`<a data-cite="${ref}"></a>`;
  }
  if (document.querySelector(ref)) {
    return html`<a href="${ref}"></a>`;
  }
  const badReference = html`<span>${matched}</span>`;
  const msg = `Wasn't able to expand ${matched} as it didn't match any id in the document.`;
  const hint = `Please make sure there is element with id ${ref} in the document.`;
  showError(msg, name, { hint, elements: [badReference] });
  return badReference;
}

/**
 * @param {string} matched
 */
function inlineXrefMatches(matched) {
  // slices "{{" at the beginning and "}}" at the end
  const ref = matched.slice(2, -2).trim();
  return ref.startsWith("\\")
    ? matched.replace("\\", "")
    : idlStringToHtml(norm(ref));
}

/**
 * @param {string} matched
 * @param {Text} txt
 * @param {Object} conf
 * @return {Iterable<string | Node>}
 */
function inlineBibrefMatches(matched, txt, conf) {
  // slices "[[" at the start and "]]" at the end
  const ref = matched.slice(2, -2);
  if (ref.startsWith("\\")) {
    return [`[[${ref.slice(1)}]]`];
  }

  const [spec, linkText] = ref.split("|").map(norm);
  const { type, illegal } = refTypeFromContext(spec, txt.parentNode);
  const cite = renderInlineCitation(spec, linkText);
  const cleanRef = spec.replace(/^(!|\?)/, "");
  if (illegal && !conf.normativeReferences.has(cleanRef)) {
    const citeElem = cite.childNodes[1] || cite;
    const msg = `Normative references in informative sections are not allowed. `;
    const hint = `Remove '!' from the start of the reference \`[[${ref}]]\``;
    showWarning(msg, name, { elements: [citeElem], hint });
  }

  if (type === "informative" && !illegal) {
    conf.informativeReferences.add(cleanRef);
  } else {
    conf.normativeReferences.add(cleanRef);
  }
  return cite.childNodes[1] ? cite.childNodes : [cite];
}

/**
 * @param {string} matched
 * @param {Text} txt
 * @param {Map<string, string>} abbrMap
 */
function inlineAbbrMatches(matched, txt, abbrMap) {
  return txt.parentElement.tagName === "ABBR"
    ? matched
    : html`<abbr title="${abbrMap.get(matched)}">${matched}</abbr>`;
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
  return html`<var data-type="${type}">${varName}</var>`;
}

/**
 * @example [= foo =] => <a>foo</a>
 * @example [= bar/foo =] => <a data-link-for="bar" data-xref-for="bar">foo</a>
 * @example [= `foo` =] => <a><code>foo</code></a>
 * @example [= foo|bar =] => <a data-lt="foo">bar</a>
 * @param {string} matched
 */
function inlineAnchorMatches(matched) {
  matched = matched.slice(2, -2); // Chop [= =]
  const parts = splitBySlash(matched, 2);
  const [isFor, content] = parts.length === 2 ? parts : [null, parts[0]];
  const [linkingText, text] = content.includes("|")
    ? content.split("|", 2).map(s => s.trim())
    : [null, content];
  const processedContent = processInlineContent(text);
  const forContext = isFor ? norm(isFor) : null;
  return html`<a
    data-link-type="dfn"
    data-link-for="${forContext}"
    data-xref-for="${forContext}"
    data-lt="${linkingText}"
    >${processedContent}</a
  >`;
}

function inlineCodeMatches(matched) {
  const clean = matched.slice(1, -1); // Chop ` and `
  return html`<code>${clean}</code>`;
}

function processInlineContent(text) {
  if (inlineCodeRegExp.test(text)) {
    // We use a capture group to split, so we can process all the parts.
    return text.split(/(`[^`]+`)(?!`)/).map(part => {
      return part.startsWith("`")
        ? inlineCodeMatches(part)
        : processInlineContent(part);
    });
  }
  return document.createTextNode(text);
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
  // Don't gather text nodes for these:
  const exclusions = ["#respec-ui", ".head", "pre"];
  const txts = getTextNodes(document.body, exclusions, {
    wsNodes: false, // we don't want nodes with just whitespace
  });
  const keywords = l10n.rfc2119Keywords();
  const rx = new RegExp(
    `(${[
      keywords.source,
      inlineIdlReference.source,
      inlineVariable.source,
      inlineCitation.source,
      inlineExpansion.source,
      inlineAnchor.source,
      inlineCodeRegExp.source,
      inlineElement.source,
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
        df.append(t);
      } else if (t.startsWith("{{")) {
        const node = inlineXrefMatches(t);
        df.append(node);
      } else if (t.startsWith("[[[")) {
        const node = inlineRefMatches(t);
        df.append(node);
      } else if (t.startsWith("[[")) {
        const nodes = inlineBibrefMatches(t, txt, conf);
        df.append(...nodes);
      } else if (t.startsWith("|")) {
        const node = inlineVariableMatches(t);
        df.append(node);
      } else if (t.startsWith("[=")) {
        const node = inlineAnchorMatches(t);
        df.append(node);
      } else if (t.startsWith("`")) {
        const node = inlineCodeMatches(t);
        df.append(node);
      } else if (t.startsWith("[^")) {
        const node = inlineElementMatches(t);
        df.append(node);
      } else if (abbrMap.has(t)) {
        const node = inlineAbbrMatches(t, txt, abbrMap);
        df.append(node);
      } else if (keywords.test(t)) {
        const node = inlineRFC2119Matches(t);
        df.append(node);
      } else {
        // FAIL -- not sure that this can really happen
        throw new Error(
          `Found token '${t}' but it does not correspond to anything`
        );
      }
    }
    txt.replaceWith(df);
  }
}

/**
 * Split a string by slash (`/`) unless it's escaped by a backslash (`\`)
 * @param {string} str
 *
 * TODO: Use negative lookbehind (`str.split(/(?<!\\)\//)`) when supported.
 * https://github.com/w3c/respec/issues/2869
 */
function splitBySlash(str, limit = Infinity) {
  return str
    .replace("\\/", "%%")
    .split("/", limit)
    .map(s => s && s.trim().replace("%%", "/"));
}
