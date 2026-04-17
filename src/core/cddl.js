// @ts-check
// Module core/cddl
//  Highlights and links CDDL marked up inside <pre class="cddl">.
import {
  CddlGenericArguments,
  CddlGenericParameters,
  CddlMarker,
  CddlMemberkey,
  CddlOccurrence,
  CddlParser,
  CddlRule,
  CddlType,
} from "./import-maps.js";
import { addHashId, showError, showWarning, xmlEscape } from "./utils.js";
import { createCopyButton, injectCopyScript } from "./clipboard.js";
import css from "../styles/cddl.css.js";
import { registerDefinition } from "./dfn-map.js";
import { sub } from "./pubsubhub.js";

export const name = "core/cddl";

/**
 * RFC 8610 prelude types that should be linked to the RFC.
 * @see https://www.rfc-editor.org/rfc/rfc8610#appendix-D
 */
const PRELUDE_TYPES = new Set([
  "any",
  "uint",
  "nint",
  "int",
  "bstr",
  "bytes",
  "tstr",
  "text",
  "tdate",
  "time",
  "number",
  "biguint",
  "bignint",
  "bigint",
  "integer",
  "unsigned",
  "decfrac",
  "bigfloat",
  "eb64url",
  "eb64legacy",
  "eb16",
  "encoded-cbor",
  "uri",
  "b64url",
  "b64legacy",
  "regexp",
  "mime-message",
  "cbor-any",
  "float16",
  "float32",
  "float64",
  "float16-32",
  "float32-64",
  "float",
  "false",
  "true",
  "bool",
  "nil",
  "null",
  "undefined",
]);

const RFC_8610_URL =
  "https://www.rfc-editor.org/rfc/rfc8610#section-appendix.d";

/**
 * @typedef {{ parentNode?: CddlAstNode | null, type?: string, name?: string | { name?: string } }} CddlAstNode
 * @typedef {{ type: string, serialize: () => string }} CddlToken
 */

/**
 * Sanitize a string for use in an HTML element ID.
 * Unlike `toId()`, this follows Bikeshed-compatible CDDL IDs and strips
 * quoted CDDL literal values before slugging.
 * @param {string} str
 * @returns {string}
 */
function sanitizeId(str) {
  return str
    .toLowerCase()
    .replace(/^"(.*)"$/, "$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Find the enclosing Rule's name from a node's parent chain.
 * @param {CddlAstNode} node
 * @returns {string|null}
 */
function findRuleName(node) {
  let current = node.parentNode;
  while (current) {
    if (current instanceof CddlRule) {
      return current.name?.name || null;
    }
    current = current.parentNode;
  }
  return null;
}

/**
 * Check if a node is in a GenericParameters position (formal type parameter).
 * @param {CddlAstNode} node
 * @returns {boolean}
 */
function isGenericParam(node) {
  let current = node.parentNode;
  while (current) {
    if (current instanceof CddlGenericParameters) return true;
    if (current instanceof CddlRule) return false;
    current = current.parentNode;
  }
  return false;
}

/**
 * Check if a node is in a GenericArguments position (type argument).
 * @param {CddlAstNode} node
 * @returns {boolean}
 */
function isGenericArg(node) {
  let current = node.parentNode;
  while (current) {
    if (current instanceof CddlGenericArguments) return true;
    if (current instanceof CddlRule) return false;
    current = current.parentNode;
  }
  return false;
}

/**
 * Check if a Typename node is the LHS name of a Rule (definition position).
 * @param {CddlAstNode} node
 * @returns {boolean}
 */
function isRuleName(node) {
  return node.parentNode instanceof CddlRule;
}

/**
 * Check if a Typename node is a map member key (bareword: type).
 * @param {CddlAstNode} node
 * @returns {boolean}
 */
function isMemberKey(node) {
  return node.parentNode instanceof CddlMemberkey;
}

/**
 * @typedef {object} CddlState
 * @property {Map<string, {type: string, for: string|null, id: string}>} definitions
 * @property {Set<string>} proseDfns - IDs of prose-level dfns already created
 * @property {Map<string, Set<string>>} genericParams - rule to param names
 */

/**
 * ReSpec CDDL Marker that produces highlighted, linked HTML.
 *
 * This is a subclass of cddlparser's Marker class. The Marker hooks are
 * called during AST serialization to inject HTML markup.
 */
class ReSpecCDDLMarker extends CddlMarker {
  /** @type {string|null} */
  #currentRuleName = null;

  /** @type {CddlState} */
  #state;

  /** @param {CddlState} state - shared state across all CDDL blocks */
  constructor(state) {
    super();
    this.#state = state;
  }

  /**
   * Called for every type/group name in the CDDL.
   * @param {string} name
   * @param {CddlAstNode} node - Typename AST node
   * @returns {string} HTML string
   */
  serializeName(name, node) {
    const state = this.#state;

    // Generic parameter definition (formal param in <T>)
    if (isGenericParam(node)) {
      const ruleName = findRuleName(node);
      if (ruleName) {
        if (!state.genericParams.has(ruleName)) {
          state.genericParams.set(ruleName, new Set());
        }
        state.genericParams.get(ruleName)?.add(name);
      }
      return `<span class="cddl-param">${xmlEscape(name)}</span>`;
    }

    // Generic argument (actual arg in <tstr>)
    if (isGenericArg(node)) {
      // Treat like a normal type reference
      return this.#serializeTypeRef(name);
    }

    // Rule name (LHS of = / /= / //=) → definition
    if (isRuleName(node)) {
      this.#currentRuleName = name;
      return this.#serializeRuleDef(name);
    }

    // Member key (bareword:) → key definition
    if (isMemberKey(node)) {
      return this.#serializeKeyDef(name);
    }

    // Check if name matches a generic param of the current rule
    const currentRule = findRuleName(node) || this.#currentRuleName;
    if (
      currentRule &&
      state.genericParams.has(currentRule) &&
      state.genericParams.get(currentRule)?.has(name)
    ) {
      return `<span class="cddl-param">${xmlEscape(name)}</span>`;
    }

    // Type reference (RHS)
    return this.#serializeTypeRef(name);
  }

  /**
   * Serialize a rule definition (LHS of =).
   * @param {string} name
   * @returns {string}
   */
  #serializeRuleDef(name) {
    const state = this.#state;
    const id = `cddl-type-${sanitizeId(name)}`;
    const key = `cddl-type:${name}`;

    // Check for duplicate
    if (state.definitions.has(key)) {
      return `<a href="#${id}" class="cddl-name" data-link-type="cddl-type">${xmlEscape(name)}</a>`;
    }

    // Check if prose dfn already exists
    if (state.proseDfns.has(id)) {
      state.definitions.set(key, {
        type: "cddl-type",
        for: null,
        id,
      });
      return `<a href="#${id}" class="cddl-name" data-link-type="cddl-type">${xmlEscape(name)}</a>`;
    }

    // Create new dfn
    state.definitions.set(key, { type: "cddl-type", for: null, id });
    return `<dfn data-dfn-type="cddl-type" id="${id}" data-export>${xmlEscape(name)}</dfn>`;
  }

  /**
   * Serialize a member key definition (bareword:).
   * @param {string} name
   * @returns {string}
   */
  #serializeKeyDef(name) {
    const state = this.#state;
    const forType = this.#currentRuleName;
    if (!forType) {
      return `<span class="cddl-name">${xmlEscape(name)}</span>`;
    }

    const id = `cddl-key-${sanitizeId(forType)}-${sanitizeId(name)}`;
    const key = `cddl-key:${forType}/${name}`;

    if (state.definitions.has(key)) {
      return `<a href="#${id}" class="cddl-name" data-link-type="cddl-key" data-xref-for="${xmlEscape(forType)}">${xmlEscape(name)}</a>`;
    }

    if (state.proseDfns.has(id)) {
      state.definitions.set(key, { type: "cddl-key", for: forType, id });
      return `<a href="#${id}" class="cddl-name" data-link-type="cddl-key" data-xref-for="${xmlEscape(forType)}">${xmlEscape(name)}</a>`;
    }

    state.definitions.set(key, { type: "cddl-key", for: forType, id });
    return `<dfn data-dfn-type="cddl-key" data-dfn-for="${xmlEscape(forType)}" id="${id}" data-export>${xmlEscape(name)}</dfn>`;
  }

  /**
   * Serialize a type reference (RHS usage).
   * @param {string} name
   * @returns {string}
   */
  #serializeTypeRef(name) {
    const state = this.#state;

    // Prelude type → link to RFC 8610
    if (PRELUDE_TYPES.has(name)) {
      return `<a class="cddl-kw" data-link-type="cddl-type" data-link-spec="rfc8610" href="${RFC_8610_URL}">${xmlEscape(name)}</a>`;
    }

    // Known local definition → link
    const key = `cddl-type:${name}`;
    if (state.definitions.has(key)) {
      const def = state.definitions.get(key);
      if (!def) {
        return `<span class="cddl-name">${xmlEscape(name)}</span>`;
      }
      return `<a href="#${def.id}" class="cddl-name" data-link-type="cddl-type">${xmlEscape(name)}</a>`;
    }

    // Unknown type — just style it. It might be defined in a later block.
    return `<span class="cddl-name" data-cddl-pending="${xmlEscape(name)}">${xmlEscape(name)}</span>`;
  }

  /**
   * Called for literal values (strings, numbers, bytes).
   * @param {string} prefix - e.g. '"', "h'", "b64'"
   * @param {string} value - the literal content
   * @param {string} suffix - e.g. '"', "'"
   * @param {CddlAstNode} node - Value AST node
   * @returns {string}
   */
  serializeValue(prefix, value, suffix, node) {
    const state = this.#state;
    const fullValue = prefix + value + suffix;

    // String value directly under CddlType at rule level → value definition
    if (node.type === "text" && this.#isTypeValue(node)) {
      const forType = this.#currentRuleName;
      if (forType) {
        const id = `cddl-value-${sanitizeId(forType)}-${sanitizeId(value)}`;
        const key = `cddl-value:${forType}/"${value}"`;

        if (state.definitions.has(key)) {
          const def = state.definitions.get(key);
          if (!def) {
            return `<span class="cddl-str">${xmlEscape(fullValue)}</span>`;
          }
          return `<a href="#${def.id}" class="cddl-str" data-link-type="cddl-value" data-xref-for="${xmlEscape(forType)}">${xmlEscape(fullValue)}</a>`;
        }

        if (state.proseDfns.has(id)) {
          state.definitions.set(key, {
            type: "cddl-value",
            for: forType,
            id,
          });
          return `<a href="#${id}" class="cddl-str" data-link-type="cddl-value" data-xref-for="${xmlEscape(forType)}">${xmlEscape(fullValue)}</a>`;
        }

        if (!state.definitions.has(key)) {
          state.definitions.set(key, {
            type: "cddl-value",
            for: forType,
            id,
          });
          return `<dfn data-dfn-type="cddl-value" data-dfn-for="${xmlEscape(forType)}" id="${id}" data-export>${xmlEscape(fullValue)}</dfn>`;
        }
      }
    }

    // Classify by type
    switch (node.type) {
      case "text":
        return `<span class="cddl-str">${xmlEscape(fullValue)}</span>`;
      case "number":
      case "float":
        return `<span class="cddl-num">${xmlEscape(fullValue)}</span>`;
      case "bytes":
      case "hex":
      case "base64":
        return `<span class="cddl-bytes">${xmlEscape(fullValue)}</span>`;
      default:
        return xmlEscape(fullValue);
    }
  }

  /**
   * Check if a Value node is directly under CddlType.
   * This excludes map key literals, which are represented under Memberkey.
   * @param {CddlAstNode} node
   * @returns {boolean}
   */
  #isTypeValue(node) {
    const parent = node.parentNode;
    if (!parent) return false;
    return parent instanceof CddlType;
  }

  /**
   * Called for every token (operators, delimiters, comments, etc.).
   * @param {CddlToken} token - Token object
   * @param {CddlAstNode} node - the AST node containing this token
   * @returns {string}
   */
  serializeToken(token, node) {
    const type = token.type;
    const serialized = token.serialize();

    switch (type) {
      case "COMMENT":
        return this.#wrapComment(serialized);
      case "CTLOP":
        return this.#wrapCtlop(serialized);
      case "=":
      case "/=":
      case "//=":
      case "/":
      case "//":
      case "=>":
      case "..":
      case "...":
        return this.#wrapOp(serialized);
      case "?":
      case "*":
      case "+":
        // Occurrence indicators
        if (node instanceof CddlOccurrence) {
          return this.#wrapOccurrence(serialized);
        }
        return serialized;
      default:
        return serialized;
    }
  }

  /**
   * Wrap a comment token in a span.
   * @param {string} serialized
   * @returns {string}
   */
  #wrapComment(serialized) {
    // Comments are serialized with leading whitespace — only wrap the comment
    // part. The serialized form includes whitespace + ";" + content.
    return serialized.replace(
      /(;[^\n]*)/g,
      '<span class="cddl-comment">$1</span>'
    );
  }

  /**
   * Wrap a control operator (.size, .regexp, etc.) in a span.
   * @param {string} serialized
   * @returns {string}
   */
  #wrapCtlop(serialized) {
    return serialized.replace(/(\.\w+)/g, '<span class="cddl-ctrl">$1</span>');
  }

  /**
   * Wrap an operator in a span.
   * @param {string} serialized
   * @returns {string}
   */
  #wrapOp(serialized) {
    // Preserve whitespace around the operator
    const match = serialized.match(/^(\s*)(.*?)(\s*)$/s);
    if (match) {
      return `${match[1]}<span class="cddl-op">${match[2]}</span>${match[3]}`;
    }
    return `<span class="cddl-op">${serialized}</span>`;
  }

  /**
   * Wrap an occurrence indicator in a span.
   * @param {string} serialized
   * @returns {string}
   */
  #wrapOccurrence(serialized) {
    const match = serialized.match(/^(\s*)(.*?)(\s*)$/s);
    if (match) {
      return `${match[1]}<span class="cddl-occ">${match[2]}</span>${match[3]}`;
    }
    return `<span class="cddl-occ">${serialized}</span>`;
  }
}

/**
 * Normalize prose-level CDDL dfn elements.
 * Converts shorthand attributes (cddl-type, cddl-key, cddl-value) to
 * data-dfn-type/data-dfn-for attributes.
 *
 * @param {Document} doc
 * @param {Set<string>} proseDfns - set of dfn IDs to populate
 */
function normalizeProseDfns(doc, proseDfns) {
  const cddlAttrs = ["cddl-type", "cddl-key", "cddl-value"];
  cddlAttrs.forEach(attr => {
    doc.querySelectorAll(`dfn[${attr}]`).forEach(dfn => {
      /** @type {HTMLElement} */ (dfn).dataset.dfnType = attr;
      dfn.removeAttribute(attr);

      const forValue = dfn.getAttribute("for");
      if (forValue) {
        /** @type {HTMLElement} */ (dfn).dataset.dfnFor = forValue;
        dfn.removeAttribute("for");
      }

      const name = dfn.textContent.trim();
      const forPart = forValue ? `${sanitizeId(forValue)}-` : "";
      const typePart = attr.replace("cddl-", "");
      const id = dfn.id || `cddl-${typePart}-${forPart}${sanitizeId(name)}`;
      dfn.id = id;
      proseDfns.add(id);

      registerDefinition(/** @type {HTMLElement} */ (dfn), [name]);
    });
  });
}

/**
 * Resolve pending references after all blocks are processed.
 * Nodes with data-cddl-pending that now have matching definitions
 * are converted to links.
 *
 * @param {HTMLElement} container
 * @param {Map<string, {type: string, for: string|null, id: string}>} definitions
 */
function resolvePendingRefs(container, definitions) {
  container.querySelectorAll("[data-cddl-pending]").forEach(span => {
    const name = /** @type {HTMLElement} */ (span).dataset.cddlPending;
    const key = `cddl-type:${name}`;
    if (definitions.has(key)) {
      const def = definitions.get(key);
      if (!def) return;
      const a = container.ownerDocument.createElement("a");
      a.href = `#${def.id}`;
      a.className = "cddl-name";
      a.dataset.linkType = "cddl-type";
      a.textContent = span.textContent;
      span.replaceWith(a);
    }
  });
}

/**
 * Resolve inline {^ ^} CDDL references to local dfn IDs.
 * Links with href are skipped by link-to-dfn, preventing xref errors.
 *
 * @param {Document} doc
 * @param {Map<string, {type: string, for: string|null, id: string}>} definitions
 */
function resolveInlineCddlRefs(doc, definitions) {
  const selector = 'a[data-link-type^="cddl-"]:not([href]):not([data-cite])';
  doc.querySelectorAll(selector).forEach(link => {
    const linkType = link.getAttribute("data-link-type");
    const linkFor =
      link.getAttribute("data-xref-for") ||
      link.getAttribute("data-link-for") ||
      "";
    const text = link.textContent.trim();

    /** @type {Record<"cddl-type"|"cddl-key"|"cddl-value", string>} */
    const keyMap = {
      "cddl-type": `cddl-type:${text}`,
      "cddl-key": `cddl-key:${linkFor}/${text}`,
      "cddl-value": `cddl-value:${linkFor}/${text}`,
    };
    if (
      linkType !== "cddl-type" &&
      linkType !== "cddl-key" &&
      linkType !== "cddl-value"
    ) {
      return;
    }
    const key = keyMap[linkType];

    if (definitions.has(key)) {
      const def = definitions.get(key);
      if (!def) return;
      link.setAttribute("href", `#${def.id}`);
      link.classList.add("internalDFN");
    } else {
      const forClause = linkFor ? `, for \`${linkFor}\`,` : "";
      showWarning(
        `CDDL ${linkType}: no definition found for \`${text}\`${forClause} in any \`<pre class="cddl">\` block.`,
        name,
        { elements: [/** @type {HTMLElement} */ (link)] }
      );
      link.setAttribute("data-no-link-to-dfn", "");
    }
  });
}

/**
 * Register all CDDL definitions with ReSpec's dfn-map.
 * @param {Document} doc
 * @param {Map<string, {type: string, for: string|null, id: string}>} definitions
 */
function registerCddlDfns(doc, definitions) {
  definitions.forEach(def => {
    const dfn = doc.getElementById(def.id);
    if (dfn?.localName === "dfn") {
      registerDefinition(/** @type {HTMLElement} */ (dfn), [
        dfn.textContent.trim(),
      ]);
    }
  });
}

/**
 * Parse and process a single CDDL block.
 * @param {HTMLElement} pre - the <pre class="cddl"> element
 * @param {(text: string) => object} parse - CDDL parser function
 * @param {CddlState} state - shared state across all CDDL blocks
 */
function processCddlBlock(pre, parse, state) {
  const cddlText = pre.textContent;
  if (!cddlText.trim()) return;

  try {
    const ast = parse(cddlText);
    const marker = new ReSpecCDDLMarker(state);
    const html = ast.serialize(marker);

    // Wrap in <code> (matching WebIDL pattern)
    const code = document.createElement("code");
    code.innerHTML = html;
    pre.textContent = "";
    pre.append(code);
    pre.classList.add("def", "highlight");
    addHashId(pre, "cddl-block");

    // Add CDDL header with copy button
    const header = document.createElement("span");
    header.className = "cddlHeader";
    header.innerHTML = `<a class="self-link" href="#${pre.id}">CDDL</a>`;
    const copyButton = createCopyButton(".cddlHeader");
    header.append(copyButton);
    pre.prepend(header);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    showError(`CDDL processing error: ${message}`, name, {
      elements: [pre],
      hint: 'Check the CDDL syntax in the `<pre class="cddl">` block.',
    });
  }
}

export async function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const cddls = document.querySelectorAll("pre.cddl:not([data-no-cddl])");
  if (!cddls.length) return;

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = css;
  const styleAnchor = document.querySelector("head link, head > *:last-child");
  if (styleAnchor) {
    styleAnchor.before(style);
  } else {
    document.head.append(style);
  }

  // Import cddlparser via import-maps (avoids fs/path imports in main entry)
  const parse = (/** @type {string} */ text) => {
    const parser = new CddlParser(text);
    return parser.parse();
  };

  // Shared state across all CDDL blocks
  /** @type {CddlState} */
  const state = {
    definitions: new Map(),
    proseDfns: new Set(),
    genericParams: new Map(),
  };

  // Step 1: Normalize prose-level CDDL dfns
  normalizeProseDfns(document, state.proseDfns);

  // Step 2: Process each CDDL block
  cddls.forEach(pre => processCddlBlock(pre, parse, state));

  // Step 3: Resolve pending references (forward references across blocks)
  resolvePendingRefs(document.body, state.definitions);

  // Warn about any still-unresolved pending refs (likely typos)
  document.querySelectorAll("[data-cddl-pending]").forEach(span => {
    const typeName = span.getAttribute("data-cddl-pending");
    showWarning(`No CDDL definition found for \`${typeName}\`.`, name, {
      elements: [/** @type {HTMLElement} */ (span)],
      hint: "Check for typos in the type name.",
    });
  });

  // Step 4: Resolve inline {^ ^} references to CDDL dfns
  resolveInlineCddlRefs(document, state.definitions);

  // Step 5: Register definitions with ReSpec's dfn-map
  registerCddlDfns(document, state.definitions);

  // Step 6: Inject runtime copy-button script (survives export)
  injectCopyScript();

  // Step 7: Clean up CDDL-specific attributes on export
  sub("beforesave", (/** @type {Document} */ outputDoc) => {
    outputDoc
      .querySelectorAll("[data-cddl-pending]")
      .forEach(el => el.removeAttribute("data-cddl-pending"));
  });
}
