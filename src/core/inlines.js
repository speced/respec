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
  regExpEscape,
  showWarning,
} from "./utils.js";
import { html } from "./import-maps.js";
import { idlStringToHtml } from "./inline-idl-parser.js";
import { renderInlineCitation } from "./render-biblio.js";

export const name = "core/inlines";
/** @type {Record<string, boolean>} */
export const rfc2119Usage = {};

/** @param {RegExp[]} regexes */
const joinRegex = regexes => new RegExp(regexes.map(re => re.source).join("|"));

const localizationStrings = {
  en: {
    rfc2119Keywords() {
      return joinRegex([
        /\bMUST(?:\s+NOT)?\b/,
        /\bSHOULD(?:\s+NOT)?\b/,
        /\bSHALL(?:\s+NOT)?\b/,
        /\bMAY\b/,
        /\b(?:NOT\s+)?REQUIRED\b/,
        /\b(?:NOT\s+)?RECOMMENDED\b/,
        /\bOPTIONAL\b/,
      ]);
    },
  },
  de: {
    rfc2119Keywords() {
      return joinRegex([
        /\bMUSS\b/,
        /\bMÜSSEN\b/,
        /\bERFORDERLICH\b/,
        /\b(?:NICHT\s+)?NÖTIG\b/,
        /\bDARF(?:\s+NICHT)?\b/,
        /\bDÜRFEN(?:\s+NICHT)?\b/,
        /\bVERBOTEN\b/,
        /\bSOLL(?:\s+NICHT)?\b/,
        /\bSOLLEN(?:\s+NICHT)?\b/,
        /\b(?:NICHT\s+)?EMPFOHLEN\b/,
        /\bKANN\b/,
        /\bKÖNNEN\b/,
        /\bOPTIONAL\b/,
      ]);
    },
  },
};
const l10n = getIntlData(localizationStrings);

// Inline `code`
// TODO: Replace (?!`) at the end with (?:<!`) at the start when Firefox + Safari
// add support.
const inlineCodeRegExp = /(?:`[^`]+`)(?!`)/; // `code`
const inlineIdlReference = /(?:{{[^}]+\?*}})/; // {{ WebIDLThing }}, {{ WebIDLThing? }}
const inlineVariable = /\B\|\w[\w\s]*(?:\s*:[\w\s&;"?<>]+\??)?\|\B/; // |var : Type?|
const inlineCitation = /(?:\[\[(?:!|\\|\?)?[\w.-]+(?:|[^\]]+)?\]\])/; // [[citation]]
const inlineExpansion = /(?:\[\[\[[^\]]+\]\]\])/; // [[[SPEC]]], [[[SPEC#id]]], [[[#id]]], [[[...|text]]], !/?-prefixed
const inlineAnchor = /(?:\[=[^=]+=\])/; // Inline [= For/link =]
const inlineElement = /(?:\[\^[^^]+\^\])/; // Inline [^element^]
const inlineCddlReference = /(?:\{\^[^}^]+\^\})/; // {^cddl-type^}, {^type/key^}

/**
 * @example [^iframe^] // [^element^]
 * @example [^iframe/allow^] // [^element/element-attr^]
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineElementMatches(matched) {
  const value = matched.slice(2, -2).trim();
  const [forPart, attribute, attrValue] = value
    .split("/", 3)
    .map(s => s && s.trim())
    .filter(s => !!s);

  const [xrefType, xrefFor, textContent] = (() => {
    // [^ /role ^], for example
    const isGlobalAttr = value.startsWith("/");
    if (isGlobalAttr) {
      return ["element-attr", null, forPart];
    } else if (attrValue) {
      return ["attr-value", `${forPart}/${attribute}`, attrValue];
    } else if (attribute) {
      return ["element-attr", forPart, attribute];
    } else {
      return ["element", null, forPart];
    }
  })();
  return html`<code
    ><a
      data-xref-type="${xrefType}"
      data-xref-for="${xrefFor}"
      data-link-type="${xrefType}"
      data-link-for="${xrefFor}"
      >${textContent}</a
    ></code
  >`;
}

/**
 * Handles CDDL inline references: {^type^}, {^type/key^}, {^type/"value"^}
 * @example {^attire^} // link to cddl-type
 * @example {^delivery/address^} // link to cddl-key
 * @example {^attire/"bow tie"^} // link to cddl-value
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineCddlMatches(matched) {
  const value = matched.slice(2, -2).trim();

  // Split on "/" but respect quoted strings
  const parts = (value.match(/"([^"]*)"|([^/]+)/g) || []).map(s => s.trim());

  if (parts.length === 1) {
    // {^typename^} → link to cddl-type
    const typeName = parts[0];
    return html`<code
      ><a data-link-type="cddl-type" data-xref-type="cddl-type"
        >${typeName}</a
      ></code
    >`;
  }

  // parts.length >= 2: {^typename/key^} or {^typename/"value"^}
  const typeName = parts[0];
  const member = parts[1];
  const type =
    member.startsWith('"') && member.endsWith('"') ? "cddl-value" : "cddl-key";
  return html`<code
    ><a
      data-link-type="${type}"
      data-xref-type="${type}"
      data-xref-for="${typeName}"
      data-link-for="${typeName}"
      >${member}</a
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
 * Validates inline expansion/reference syntax.
 * Valid forms: [[[#id]]], [[[SPEC]]], [[[SPEC#id]]], [[[SPEC|text]]],
 * [[[SPEC#id|text]]], [[[#id|text]]]
 */
const inlineExpansionPattern =
  /^(?:!|\\|\?)?(?:#[\w-.]+|[\w-.]+(?:#[\w-.]+)?)(?:\|[^\]]+)?$/;

/**
 * @param {string} matched
 * @return {HTMLElement | string}
 */
function inlineRefMatches(matched) {
  // slices "[[[" at the beginning and "]]]" at the end
  let ref = matched.slice(3, -3).trim();
  if (!inlineExpansionPattern.test(ref)) {
    const msg = `Bad syntax: \`${matched}\` is not a valid inline expansion.`;
    const hint =
      "Expected `[[[#id]]]`, `[[[SPEC]]]`, `[[[SPEC#id]]]`, `[[[SPEC|text]]]`, `[[[SPEC#id|text]]]`, or `[[[#id|text]]]`; `!`/`?` prefixes are also supported.";
    showWarning(msg, name, { hint });
    return matched;
  }
  const pipeIdx = ref.indexOf("|");
  const linkText = pipeIdx !== -1 ? ref.slice(pipeIdx + 1).trim() : null;
  if (pipeIdx !== -1) ref = ref.slice(0, pipeIdx).trim();

  // Strip !/?/\ prefix (normative/informative/escaped markers)
  const refWithoutPrefix = ref.replace(/^[!?\\]/, "");

  if (ref.startsWith("\\")) {
    return `[[[${refWithoutPrefix}]]]`;
  }

  if (refWithoutPrefix.startsWith("#")) {
    return linkText
      ? html`<a href="${refWithoutPrefix}" data-matched-text="${matched}"
          >${linkText}</a
        >`
      : html`<a href="${refWithoutPrefix}" data-matched-text="${matched}"></a>`;
  }

  const hashIdx = refWithoutPrefix.indexOf("#");
  if (hashIdx !== -1) {
    // SPEC#fragment form: use data-cite-section for the fragment so dfn-index
    // doesn't misclassify this section link as an external definition reference.
    const prefixLength = ref.length - refWithoutPrefix.length;
    const specPart =
      ref.slice(0, prefixLength) + refWithoutPrefix.slice(0, hashIdx);
    const sectionFrag = refWithoutPrefix.slice(hashIdx + 1);
    return html`<a
      data-cite="${specPart}"
      data-cite-section="${sectionFrag}"
      data-matched-text="${matched}"
      data-lt="${linkText || null}"
    ></a>`;
  }

  return html`<a
    data-cite="${ref}"
    data-matched-text="${matched}"
    data-lt="${linkText || null}"
  ></a>`;
}

/**
 * @param {string} matched
 * @param {Text} text
 */
function inlineXrefMatches(matched, text) {
  // slices "{{" at the beginning and "}}" at the end
  const ref = norm(matched.slice(2, -2));
  if (ref.startsWith("\\")) {
    // Remove the escape backslash that immediately follows "{{" (with optional
    // whitespace), using an anchored regex to avoid removing unintended backslashes.
    return matched.replace(/^(\{\{\s*)\\/, "$1");
  }

  const node = idlStringToHtml(ref);
  // If it's inside a dfn or a `a`, it should just be coded, not linked.
  // This is because dfn elements are treated as links by ReSpec via role=link.
  const renderAsCode = !!text.parentElement?.closest("dfn,a");
  return renderAsCode ? inlineCodeMatches(`\`${node.textContent}\``) : node;
}

/**
 * @param {string} matched
 * @param {Text} txt
 * @param {Conf} conf
 * @return {Iterable<string | Node>}
 */
function inlineBibrefMatches(matched, txt, conf) {
  // slices "[[" at the start and "]]" at the end
  const ref = matched.slice(2, -2);
  if (ref.startsWith("\\")) {
    return [`[[${ref.slice(1)}]]`];
  }

  const [spec, linkText] = ref.split("|").map(norm);
  const { type, illegal } = refTypeFromContext(
    spec,
    /** @type {HTMLElement} */ (txt.parentElement)
  );
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
  return txt.parentElement?.tagName === "ABBR"
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
  const parts = splitByFor(matched);
  const [isFor, content] = parts.length === 2 ? parts : [null, parts[0]];
  const [linkingText, text] = content.includes("|")
    ? content.split("|", 2).map(s => s.trim())
    : [null, content];
  const processedContent = processInlineContent(text);
  const forContext = isFor ? norm(isFor) : null;
  return html`<a
    data-link-type="dfn|abstract-op"
    data-link-for="${forContext}"
    data-xref-for="${forContext}"
    data-lt="${linkingText}"
    >${processedContent}</a
  >`;
}

/**
 * @param {string} matched
 */
function inlineCodeMatches(matched) {
  const clean = matched.slice(1, -1); // Chop ` and `
  return html`<code>${clean}</code>`;
}

/**
 * @param {string} text
 * @returns {Node | (Node | string | DocumentFragment | HTMLElement)[]}
 */
function processInlineContent(text) {
  if (inlineCodeRegExp.test(text)) {
    // We use a capture group to split, so we can process all the parts.
    return text.split(/(`[^`]+`)(?!`)/).map((/** @type {string} */ part) => {
      return part.startsWith("`")
        ? inlineCodeMatches(part)
        : processInlineContent(part);
    });
  }
  return document.createTextNode(text);
}

/**
 * @param {Conf} conf
 */
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
  const abbrElements = document.querySelectorAll("abbr[title]:not(.exclude)");
  for (const { textContent, title } of abbrElements) {
    const key = norm(textContent);
    const value = norm(title);
    abbrMap.set(key, value);
  }
  const abbrRx = abbrMap.size
    ? new RegExp(
        `(?:\\b${[...abbrMap.keys()].map(k => regExpEscape(k)).join("\\b)|(?:\\b")}\\b)`
      )
    : null;

  // PROCESSING
  // Don't gather text nodes for these:
  const exclusions = ["#respec-ui", ".head", "pre", "svg", "script", "style"];
  const txts = getTextNodes(document.body, exclusions, {
    wsNodes: false, // we don't want nodes with just whitespace
  });
  const keywords = l10n.rfc2119Keywords();

  const inlinesRegex = new RegExp(
    `(${
      joinRegex([
        keywords,
        inlineIdlReference,
        inlineCddlReference,
        inlineVariable,
        inlineCitation,
        inlineExpansion,
        inlineAnchor,
        inlineCodeRegExp,
        inlineElement,
        ...(abbrRx ? [abbrRx] : []),
      ]).source
    })`
  );
  for (const txt of txts) {
    const subtxt = txt.data.split(inlinesRegex);
    if (subtxt.length === 1) continue;
    const df = document.createDocumentFragment();
    let matched = true;
    for (const t of subtxt) {
      matched = !matched;
      if (!matched) {
        df.append(t);
        continue;
      }
      switch (true) {
        case t.startsWith("{{"):
          df.append(inlineXrefMatches(t, txt));
          break;
        case t.startsWith("{^"):
          df.append(inlineCddlMatches(t));
          break;
        case t.startsWith("[[["):
          df.append(inlineRefMatches(t));
          break;
        case t.startsWith("[["):
          df.append(...inlineBibrefMatches(t, txt, conf));
          break;
        case t.startsWith("|"):
          df.append(inlineVariableMatches(t));
          break;
        case t.startsWith("[="):
          df.append(inlineAnchorMatches(t));
          break;
        case t.startsWith("`"):
          df.append(inlineCodeMatches(t));
          break;
        case t.startsWith("[^"):
          df.append(inlineElementMatches(t));
          break;
        case abbrMap.has(t):
          df.append(inlineAbbrMatches(t, txt, abbrMap));
          break;
        case keywords.test(t):
          df.append(inlineRFC2119Matches(t));
          break;
      }
    }
    txt.replaceWith(df);
  }
}

/**
 * Linking strings are always composed of:
 *
 *   (for-part /)+ linking-text
 *
 * E.g., " ReadableStream / set up / pullAlgorithm ".
 * Where "ReadableStream/set up/" is for-part, and "pullAlgorithm" is
 * the linking-text.
 *
 * The for part is optional, but when present can be two or three levels deep.
 *
 * @param {string} str
 *
 */
function splitByFor(str) {
  /** @param {string} str */
  const cleanUp = str => str.replace("%%", "/").split("/").map(norm).join("/");
  const safeStr = str.replace("\\/", "%%");
  const lastSlashIdx = safeStr.lastIndexOf("/");
  if (lastSlashIdx === -1) {
    return [cleanUp(safeStr)];
  }
  const forPart = safeStr.substring(0, lastSlashIdx);
  const linkingText = safeStr.substring(lastSlashIdx + 1, safeStr.length);
  return [cleanUp(forPart), cleanUp(linkingText)];
}
