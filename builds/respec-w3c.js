window.respecVersion = "35.4.3";

(function () {
  'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  // @ts-check
  const inAmd = !!window.require;
  if (!inAmd) {
    /**
     * @type {any}
     * @param {string[]} deps
     * @param {(...modules: any[]) => void} callback
     */
    const require = function (deps, callback) {
      const modules = deps.map(dep => {
        if (!(dep in window.require.modules)) {
          throw new Error(`Unsupported dependency name: ${dep}`);
        }
        return window.require.modules[dep];
      });
      Promise.all(modules).then(results => callback(...results));
    };
    require.modules = {};
    window.require = require;
  }

  /**
   * @param {string} name
   * @param {object | Promise<object>} object
   */
  function expose(name, object) {
    if (!inAmd) {
      window.require.modules[name] = object;
    }
  }

  // @ts-check
  /**
   * Module core/l10n
   *
   * Looks at the lang attribute on the root element and uses it
   * to manage the config.l10n object so that other parts of the system can
   * localize their text.
   */

  const name$1e = "core/l10n";

  const html$2 = document.documentElement;
  // Explicitly default lang and dir on <html> if not set.
  // We assume English and ltr as default for international standards.
  if (!html$2?.hasAttribute("lang")) {
    html$2.lang = "en";
    if (!html$2.hasAttribute("dir")) {
      html$2.dir = "ltr";
    }
  }

  const l10n$C = {};

  const lang$1 = html$2?.lang ?? "en";

  function run$18(config) {
    config.l10n = l10n$C[lang$1] || l10n$C.en;
  }

  var l10n$D = /*#__PURE__*/Object.freeze({
    __proto__: null,
    l10n: l10n$C,
    lang: lang$1,
    name: name$1e,
    run: run$18
  });

  const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

  let idbProxyableTypes;
  let cursorAdvanceMethods;
  // This is a function to prevent it throwing up in node environments.
  function getIdbProxyableTypes() {
      return (idbProxyableTypes ||
          (idbProxyableTypes = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction,
          ]));
  }
  // This is a function to prevent it throwing up in node environments.
  function getCursorAdvanceMethods() {
      return (cursorAdvanceMethods ||
          (cursorAdvanceMethods = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
          ]));
  }
  const transactionDoneMap = new WeakMap();
  const transformCache = new WeakMap();
  const reverseTransformCache = new WeakMap();
  function promisifyRequest(request) {
      const promise = new Promise((resolve, reject) => {
          const unlisten = () => {
              request.removeEventListener('success', success);
              request.removeEventListener('error', error);
          };
          const success = () => {
              resolve(wrap(request.result));
              unlisten();
          };
          const error = () => {
              reject(request.error);
              unlisten();
          };
          request.addEventListener('success', success);
          request.addEventListener('error', error);
      });
      // This mapping exists in reverseTransformCache but doesn't exist in transformCache. This
      // is because we create many promises from a single IDBRequest.
      reverseTransformCache.set(promise, request);
      return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
      // Early bail if we've already created a done promise for this transaction.
      if (transactionDoneMap.has(tx))
          return;
      const done = new Promise((resolve, reject) => {
          const unlisten = () => {
              tx.removeEventListener('complete', complete);
              tx.removeEventListener('error', error);
              tx.removeEventListener('abort', error);
          };
          const complete = () => {
              resolve();
              unlisten();
          };
          const error = () => {
              reject(tx.error || new DOMException('AbortError', 'AbortError'));
              unlisten();
          };
          tx.addEventListener('complete', complete);
          tx.addEventListener('error', error);
          tx.addEventListener('abort', error);
      });
      // Cache it for later retrieval.
      transactionDoneMap.set(tx, done);
  }
  let idbProxyTraps = {
      get(target, prop, receiver) {
          if (target instanceof IDBTransaction) {
              // Special handling for transaction.done.
              if (prop === 'done')
                  return transactionDoneMap.get(target);
              // Make tx.store return the only store in the transaction, or undefined if there are many.
              if (prop === 'store') {
                  return receiver.objectStoreNames[1]
                      ? undefined
                      : receiver.objectStore(receiver.objectStoreNames[0]);
              }
          }
          // Else transform whatever we get back.
          return wrap(target[prop]);
      },
      set(target, prop, value) {
          target[prop] = value;
          return true;
      },
      has(target, prop) {
          if (target instanceof IDBTransaction &&
              (prop === 'done' || prop === 'store')) {
              return true;
          }
          return prop in target;
      },
  };
  function replaceTraps(callback) {
      idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
      // Due to expected object equality (which is enforced by the caching in `wrap`), we
      // only create one new func per func.
      // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
      // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
      // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
      // with real promises, so each advance methods returns a new promise for the cursor object, or
      // undefined if the end of the cursor has been reached.
      if (getCursorAdvanceMethods().includes(func)) {
          return function (...args) {
              // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
              // the original object.
              func.apply(unwrap(this), args);
              return wrap(this.request);
          };
      }
      return function (...args) {
          // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
          // the original object.
          return wrap(func.apply(unwrap(this), args));
      };
  }
  function transformCachableValue(value) {
      if (typeof value === 'function')
          return wrapFunction(value);
      // This doesn't return, it just creates a 'done' promise for the transaction,
      // which is later returned for transaction.done (see idbObjectHandler).
      if (value instanceof IDBTransaction)
          cacheDonePromiseForTransaction(value);
      if (instanceOfAny(value, getIdbProxyableTypes()))
          return new Proxy(value, idbProxyTraps);
      // Return the same value back if we're not going to transform it.
      return value;
  }
  function wrap(value) {
      // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
      // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
      if (value instanceof IDBRequest)
          return promisifyRequest(value);
      // If we've already transformed this value before, reuse the transformed value.
      // This is faster, but it also provides object equality.
      if (transformCache.has(value))
          return transformCache.get(value);
      const newValue = transformCachableValue(value);
      // Not all types are transformed.
      // These may be primitive types, so they can't be WeakMap keys.
      if (newValue !== value) {
          transformCache.set(value, newValue);
          reverseTransformCache.set(newValue, value);
      }
      return newValue;
  }
  const unwrap = (value) => reverseTransformCache.get(value);

  /**
   * Open a database.
   *
   * @param name Name of the database.
   * @param version Schema version.
   * @param callbacks Additional callbacks.
   */
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
      const request = indexedDB.open(name, version);
      const openPromise = wrap(request);
      if (upgrade) {
          request.addEventListener('upgradeneeded', (event) => {
              upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
          });
      }
      if (blocked) {
          request.addEventListener('blocked', (event) => blocked(
          // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
          event.oldVersion, event.newVersion, event));
      }
      openPromise
          .then((db) => {
          if (terminated)
              db.addEventListener('close', () => terminated());
          if (blocking) {
              db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
          }
      })
          .catch(() => { });
      return openPromise;
  }
  /**
   * Delete a database.
   *
   * @param name Name of the database.
   */
  function deleteDB(name, { blocked } = {}) {
      const request = indexedDB.deleteDatabase(name);
      if (blocked) {
          request.addEventListener('blocked', (event) => blocked(
          // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
          event.oldVersion, event));
      }
      return wrap(request).then(() => undefined);
  }

  const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
  const writeMethods = ['put', 'add', 'delete', 'clear'];
  const cachedMethods = new Map();
  function getMethod(target, prop) {
      if (!(target instanceof IDBDatabase &&
          !(prop in target) &&
          typeof prop === 'string')) {
          return;
      }
      if (cachedMethods.get(prop))
          return cachedMethods.get(prop);
      const targetFuncName = prop.replace(/FromIndex$/, '');
      const useIndex = prop !== targetFuncName;
      const isWrite = writeMethods.includes(targetFuncName);
      if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
          !(isWrite || readMethods.includes(targetFuncName))) {
          return;
      }
      const method = async function (storeName, ...args) {
          // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
          const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
          let target = tx.store;
          if (useIndex)
              target = target.index(args.shift());
          // Must reject if op rejects.
          // If it's a write operation, must reject if tx.done rejects.
          // Must reject with op rejection first.
          // Must resolve with op value.
          // Must handle both promises (no unhandled rejections)
          return (await Promise.all([
              target[targetFuncName](...args),
              isWrite && tx.done,
          ]))[0];
      };
      cachedMethods.set(prop, method);
      return method;
  }
  replaceTraps((oldTraps) => ({
      ...oldTraps,
      get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
      has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
  }));

  const advanceMethodProps = ['continue', 'continuePrimaryKey', 'advance'];
  const methodMap = {};
  const advanceResults = new WeakMap();
  const ittrProxiedCursorToOriginalProxy = new WeakMap();
  const cursorIteratorTraps = {
      get(target, prop) {
          if (!advanceMethodProps.includes(prop))
              return target[prop];
          let cachedFunc = methodMap[prop];
          if (!cachedFunc) {
              cachedFunc = methodMap[prop] = function (...args) {
                  advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
              };
          }
          return cachedFunc;
      },
  };
  async function* iterate(...args) {
      // tslint:disable-next-line:no-this-assignment
      let cursor = this;
      if (!(cursor instanceof IDBCursor)) {
          cursor = await cursor.openCursor(...args);
      }
      if (!cursor)
          return;
      cursor = cursor;
      const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
      ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
      // Map this double-proxy back to the original, so other cursor methods work.
      reverseTransformCache.set(proxiedCursor, unwrap(cursor));
      while (cursor) {
          yield proxiedCursor;
          // If one of the advancing methods was not called, call continue().
          cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
          advanceResults.delete(proxiedCursor);
      }
  }
  function isIteratorProp(target, prop) {
      return ((prop === Symbol.asyncIterator &&
          instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor])) ||
          (prop === 'iterate' && instanceOfAny(target, [IDBIndex, IDBObjectStore])));
  }
  replaceTraps((oldTraps) => ({
      ...oldTraps,
      get(target, prop, receiver) {
          if (isIteratorProp(target, prop))
              return iterate;
          return oldTraps.get(target, prop, receiver);
      },
      has(target, prop) {
          return isIteratorProp(target, prop) || oldTraps.has(target, prop);
      },
  }));

  var _idb = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deleteDB: deleteDB,
    openDB: openDB,
    unwrap: unwrap,
    wrap: wrap
  });

  /**
   * @param {string} text
   */
  function lastLine(text) {
    const splitted = text.split("\n");
    return splitted[splitted.length - 1];
  }

  function appendIfExist(base, target) {
    let result = base;
    if (target) {
      result += ` ${target}`;
    }
    return result;
  }

  function contextAsText(node) {
    const hierarchy = [node];
    while (node && node.parent) {
      const { parent } = node;
      hierarchy.unshift(parent);
      node = parent;
    }
    return hierarchy.map((n) => appendIfExist(n.type, n.name)).join(" -> ");
  }

  /**
   * @typedef {object} WebIDL2ErrorOptions
   * @property {"error" | "warning"} [level]
   * @property {Function} [autofix]
   * @property {string} [ruleName]
   *
   * @typedef {ReturnType<typeof error>} WebIDLErrorData
   *
   * @param {string} message error message
   * @param {*} position
   * @param {*} current
   * @param {*} message
   * @param {"Syntax" | "Validation"} kind error type
   * @param {WebIDL2ErrorOptions=} options
   */
  function error(
    source,
    position,
    current,
    message,
    kind,
    { level = "error", autofix, ruleName } = {},
  ) {
    /**
     * @param {number} count
     */
    function sliceTokens(count) {
      return count > 0
        ? source.slice(position, position + count)
        : source.slice(Math.max(position + count, 0), position);
    }

    /**
     * @param {import("./tokeniser.js").Token[]} inputs
     * @param {object} [options]
     * @param {boolean} [options.precedes]
     * @returns
     */
    function tokensToText(inputs, { precedes } = {}) {
      const text = inputs.map((t) => t.trivia + t.value).join("");
      const nextToken = source[position];
      if (nextToken.type === "eof") {
        return text;
      }
      if (precedes) {
        return text + nextToken.trivia;
      }
      return text.slice(nextToken.trivia.length);
    }

    const maxTokens = 5; // arbitrary but works well enough
    const line =
      source[position].type !== "eof"
        ? source[position].line
        : source.length > 1
          ? source[position - 1].line
          : 1;

    const precedingLastLine = lastLine(
      tokensToText(sliceTokens(-maxTokens), { precedes: true }),
    );

    const subsequentTokens = sliceTokens(maxTokens);
    const subsequentText = tokensToText(subsequentTokens);
    const subsequentFirstLine = subsequentText.split("\n")[0];

    const spaced = " ".repeat(precedingLastLine.length) + "^";
    const sourceContext = precedingLastLine + subsequentFirstLine + "\n" + spaced;

    const contextType = kind === "Syntax" ? "since" : "inside";
    const inSourceName = source.name ? ` in ${source.name}` : "";
    const grammaticalContext =
      current && current.name
        ? `, ${contextType} \`${current.partial ? "partial " : ""}${contextAsText(
          current,
        )}\``
        : "";
    const context = `${kind} error at line ${line}${inSourceName}${grammaticalContext}:\n${sourceContext}`;
    return {
      message: `${context} ${message}`,
      bareMessage: message,
      context,
      line,
      sourceName: source.name,
      level,
      ruleName,
      autofix,
      input: subsequentText,
      tokens: subsequentTokens,
    };
  }

  /**
   * @param {string} message error message
   */
  function syntaxError(source, position, current, message) {
    return error(source, position, current, message, "Syntax");
  }

  /**
   * @param {string} message error message
   * @param {WebIDL2ErrorOptions} [options]
   */
  function validationError(
    token,
    current,
    ruleName,
    message,
    options = {},
  ) {
    options.ruleName = ruleName;
    return error(
      current.source,
      token.index,
      current,
      message,
      "Validation",
      options,
    );
  }

  class Base {
    /**
     * @param {object} initializer
     * @param {Base["source"]} initializer.source
     * @param {Base["tokens"]} initializer.tokens
     */
    constructor({ source, tokens }) {
      Object.defineProperties(this, {
        source: { value: source },
        tokens: { value: tokens, writable: true },
        parent: { value: null, writable: true },
        this: { value: this }, // useful when escaping from proxy
      });
    }

    toJSON() {
      const json = { type: undefined, name: undefined, inheritance: undefined };
      let proto = this;
      while (proto !== Object.prototype) {
        const descMap = Object.getOwnPropertyDescriptors(proto);
        for (const [key, value] of Object.entries(descMap)) {
          if (value.enumerable || value.get) {
            // @ts-ignore - allow indexing here
            json[key] = this[key];
          }
        }
        proto = Object.getPrototypeOf(proto);
      }
      return json;
    }
  }

  /**
   * @typedef {import("../validator.js").Definitions} Definitions
   * @typedef {import("../productions/dictionary.js").Dictionary} Dictionary
   * @typedef {import("../../lib/productions/type").Type} Type
   *
   * @param {Type} idlType
   * @param {Definitions} defs
   * @param {object} [options]
   * @param {boolean} [options.useNullableInner] use when the input idlType is nullable and you want to use its inner type
   * @return {{ reference: *, dictionary: Dictionary }} the type reference that ultimately includes dictionary.
   */
  function idlTypeIncludesDictionary(
    idlType,
    defs,
    { useNullableInner } = {},
  ) {
    if (!idlType.union) {
      const def = defs.unique.get(idlType.idlType);
      if (!def) {
        return;
      }
      if (def.type === "typedef") {
        const { typedefIncludesDictionary } = defs.cache;
        if (typedefIncludesDictionary.has(def)) {
          // Note that this also halts when it met indeterminate state
          // to prevent infinite recursion
          return typedefIncludesDictionary.get(def);
        }
        defs.cache.typedefIncludesDictionary.set(def, undefined); // indeterminate state
        const result = idlTypeIncludesDictionary(def.idlType, defs);
        defs.cache.typedefIncludesDictionary.set(def, result);
        if (result) {
          return {
            reference: idlType,
            dictionary: result.dictionary,
          };
        }
      }
      if (def.type === "dictionary" && (useNullableInner || !idlType.nullable)) {
        return {
          reference: idlType,
          dictionary: def,
        };
      }
    }
    for (const subtype of idlType.subtype) {
      const result = idlTypeIncludesDictionary(subtype, defs);
      if (result) {
        if (subtype.union) {
          return result;
        }
        return {
          reference: subtype,
          dictionary: result.dictionary,
        };
      }
    }
  }

  /**
   * @param {Dictionary} dict dictionary type
   * @param {Definitions} defs
   * @return {boolean}
   */
  function dictionaryIncludesRequiredField(dict, defs) {
    if (defs.cache.dictionaryIncludesRequiredField.has(dict)) {
      return defs.cache.dictionaryIncludesRequiredField.get(dict);
    }
    // Set cached result to indeterminate to short-circuit circular definitions.
    // The final result will be updated to true or false.
    defs.cache.dictionaryIncludesRequiredField.set(dict, undefined);
    let result = dict.members.some((field) => field.required);
    if (!result && dict.inheritance) {
      const superdict = defs.unique.get(dict.inheritance);
      if (!superdict) {
        // Assume required members in the supertype if it is unknown.
        result = true;
      } else if (dictionaryIncludesRequiredField(superdict, defs)) {
        result = true;
      }
    }
    defs.cache.dictionaryIncludesRequiredField.set(dict, result);
    return result;
  }

  /**
   * For now this only checks the most frequent cases:
   * 1. direct inclusion of [EnforceRange]
   * 2. typedef of that
   *
   * More complex cases with dictionaries and records are not covered yet.
   *
   * @param {Type} idlType
   * @param {Definitions} defs
   */
  function idlTypeIncludesEnforceRange(idlType, defs) {
    if (idlType.union) {
      // TODO: This should ideally be checked too
      return false;
    }

    if (idlType.extAttrs.some((e) => e.name === "EnforceRange")) {
      return true;
    }

    const def = defs.unique.get(idlType.idlType);
    if (def?.type !== "typedef") {
      return false;
    }

    return def.idlType.extAttrs.some((e) => e.name === "EnforceRange");
  }

  class ArrayBase extends Array {
    constructor({ source, tokens }) {
      super();
      Object.defineProperties(this, {
        source: { value: source },
        tokens: { value: tokens },
        parent: { value: null, writable: true },
      });
    }
  }

  class WrappedToken extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {string} type
     */
    static parser(tokeniser, type) {
      return () => {
        const value = tokeniser.consumeKind(type);
        if (value) {
          return new WrappedToken({
            source: tokeniser.source,
            tokens: { value },
          });
        }
      };
    }

    get value() {
      return unescape$1(this.tokens.value.value);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.wrap([
        w.token(this.tokens.value),
        w.token(this.tokens.separator),
      ]);
    }
  }

  class Eof extends WrappedToken {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const value = tokeniser.consumeKind("eof");
      if (value) {
        return new Eof({ source: tokeniser.source, tokens: { value } });
      }
    }

    get type() {
      return "eof";
    }
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {string} tokenName
   */
  function tokens(tokeniser, tokenName) {
    return list$1(tokeniser, {
      parser: WrappedToken.parser(tokeniser, tokenName),
      listName: tokenName + " list",
    });
  }

  const extAttrValueSyntax = ["identifier", "decimal", "integer", "string"];

  const shouldBeLegacyPrefixed = [
    "NoInterfaceObject",
    "LenientSetter",
    "LenientThis",
    "TreatNonObjectAsNull",
    "Unforgeable",
  ];

  const renamedLegacies = new Map([
    .../** @type {[string, string][]} */ (
      shouldBeLegacyPrefixed.map((name) => [name, `Legacy${name}`])
    ),
    ["NamedConstructor", "LegacyFactoryFunction"],
    ["OverrideBuiltins", "LegacyOverrideBuiltIns"],
    ["TreatNullAs", "LegacyNullToEmptyString"],
  ]);

  /**
   * This will allow a set of extended attribute values to be parsed.
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function extAttrListItems(tokeniser) {
    for (const syntax of extAttrValueSyntax) {
      const toks = tokens(tokeniser, syntax);
      if (toks.length) {
        return toks;
      }
    }
    tokeniser.error(
      `Expected identifiers, strings, decimals, or integers but none found`,
    );
  }

  class ExtendedAttributeParameters extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const tokens = { assign: tokeniser.consume("=") };
      const ret = autoParenter(
        new ExtendedAttributeParameters({ source: tokeniser.source, tokens }),
      );
      ret.list = [];
      if (tokens.assign) {
        tokens.asterisk = tokeniser.consume("*");
        if (tokens.asterisk) {
          return ret.this;
        }
        tokens.secondaryName = tokeniser.consumeKind(...extAttrValueSyntax);
      }
      tokens.open = tokeniser.consume("(");
      if (tokens.open) {
        ret.list = ret.rhsIsList
          ? // [Exposed=(Window,Worker)]
            extAttrListItems(tokeniser)
          : // [LegacyFactoryFunction=Audio(DOMString src)] or [Constructor(DOMString str)]
            argument_list(tokeniser);
        tokens.close =
          tokeniser.consume(")") ||
          tokeniser.error("Unexpected token in extended attribute argument list");
      } else if (tokens.assign && !tokens.secondaryName) {
        tokeniser.error("No right hand side to extended attribute assignment");
      }
      return ret.this;
    }

    get rhsIsList() {
      return (
        this.tokens.assign && !this.tokens.asterisk && !this.tokens.secondaryName
      );
    }

    get rhsType() {
      if (this.rhsIsList) {
        return this.list[0].tokens.value.type + "-list";
      }
      if (this.tokens.asterisk) {
        return "*";
      }
      if (this.tokens.secondaryName) {
        return this.tokens.secondaryName.type;
      }
      return null;
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const { rhsType } = this;
      return w.ts.wrap([
        w.token(this.tokens.assign),
        w.token(this.tokens.asterisk),
        w.reference_token(this.tokens.secondaryName, this.parent),
        w.token(this.tokens.open),
        ...this.list.map((p) => {
          return rhsType === "identifier-list"
            ? w.identifier(p, this.parent)
            : p.write(w);
        }),
        w.token(this.tokens.close),
      ]);
    }
  }

  class SimpleExtendedAttribute extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const name = tokeniser.consumeKind("identifier");
      if (name) {
        return new SimpleExtendedAttribute({
          source: tokeniser.source,
          tokens: { name },
          params: ExtendedAttributeParameters.parse(tokeniser),
        });
      }
    }

    constructor({ source, tokens, params }) {
      super({ source, tokens });
      params.parent = this;
      Object.defineProperty(this, "params", { value: params });
    }

    get type() {
      return "extended-attribute";
    }
    get name() {
      return this.tokens.name.value;
    }
    get rhs() {
      const { rhsType: type, tokens, list } = this.params;
      if (!type) {
        return null;
      }
      const value = this.params.rhsIsList
        ? list
        : this.params.tokens.secondaryName
          ? unescape$1(tokens.secondaryName.value)
          : null;
      return { type, value };
    }
    get arguments() {
      const { rhsIsList, list } = this.params;
      if (!list || rhsIsList) {
        return [];
      }
      return list;
    }

    *validate(defs) {
      const { name } = this;
      if (name === "LegacyNoInterfaceObject") {
        const message = `\`[LegacyNoInterfaceObject]\` extended attribute is an \
undesirable feature that may be removed from Web IDL in the future. Refer to the \
[relevant upstream PR](https://github.com/whatwg/webidl/pull/609) for more \
information.`;
        yield validationError(
          this.tokens.name,
          this,
          "no-nointerfaceobject",
          message,
          { level: "warning" },
        );
      } else if (renamedLegacies.has(name)) {
        const message = `\`[${name}]\` extended attribute is a legacy feature \
that is now renamed to \`[${renamedLegacies.get(name)}]\`. Refer to the \
[relevant upstream PR](https://github.com/whatwg/webidl/pull/870) for more \
information.`;
        yield validationError(this.tokens.name, this, "renamed-legacy", message, {
          level: "warning",
          autofix: renameLegacyExtendedAttribute(this),
        });
      }
      for (const arg of this.arguments) {
        yield* arg.validate(defs);
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.wrap([
        w.ts.trivia(this.tokens.name.trivia),
        w.ts.extendedAttribute(
          w.ts.wrap([
            w.ts.extendedAttributeReference(this.name),
            this.params.write(w),
          ]),
        ),
        w.token(this.tokens.separator),
      ]);
    }
  }

  /**
   * @param {SimpleExtendedAttribute} extAttr
   */
  function renameLegacyExtendedAttribute(extAttr) {
    return () => {
      const { name } = extAttr;
      extAttr.tokens.name.value = renamedLegacies.get(name);
      if (name === "TreatNullAs") {
        extAttr.params.tokens = {};
      }
    };
  }

  // Note: we parse something simpler than the official syntax. It's all that ever
  // seems to be used
  class ExtendedAttributes extends ArrayBase {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const tokens = {};
      tokens.open = tokeniser.consume("[");
      const ret = new ExtendedAttributes({ source: tokeniser.source, tokens });
      if (!tokens.open) return ret;
      ret.push(
        ...list$1(tokeniser, {
          parser: SimpleExtendedAttribute.parse,
          listName: "extended attribute",
        }),
      );
      tokens.close =
        tokeniser.consume("]") ||
        tokeniser.error(
          "Expected a closing token for the extended attribute list",
        );
      if (!ret.length) {
        tokeniser.unconsume(tokens.close.index);
        tokeniser.error("An extended attribute list must not be empty");
      }
      if (tokeniser.probe("[")) {
        tokeniser.error(
          "Illegal double extended attribute lists, consider merging them",
        );
      }
      return ret;
    }

    *validate(defs) {
      for (const extAttr of this) {
        yield* extAttr.validate(defs);
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      if (!this.length) return "";
      return w.ts.wrap([
        w.token(this.tokens.open),
        ...this.map((ea) => ea.write(w)),
        w.token(this.tokens.close),
      ]);
    }
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {string} typeName
   */
  function generic_type(tokeniser, typeName) {
    const base = tokeniser.consume(
      "FrozenArray",
      "ObservableArray",
      "Promise",
      "async_sequence",
      "sequence",
      "record",
    );
    if (!base) {
      return;
    }
    const ret = autoParenter(
      new Type({ source: tokeniser.source, tokens: { base } }),
    );
    ret.tokens.open =
      tokeniser.consume("<") ||
      tokeniser.error(`No opening bracket after ${base.value}`);
    switch (base.value) {
      case "Promise": {
        if (tokeniser.probe("["))
          tokeniser.error("Promise type cannot have extended attribute");
        const subtype =
          return_type(tokeniser, typeName) ||
          tokeniser.error("Missing Promise subtype");
        ret.subtype.push(subtype);
        break;
      }
      case "async_sequence":
      case "sequence":
      case "FrozenArray":
      case "ObservableArray": {
        const subtype =
          type_with_extended_attributes(tokeniser, typeName) ||
          tokeniser.error(`Missing ${base.value} subtype`);
        ret.subtype.push(subtype);
        break;
      }
      case "record": {
        if (tokeniser.probe("["))
          tokeniser.error("Record key cannot have extended attribute");
        const keyType =
          tokeniser.consume(...stringTypes) ||
          tokeniser.error(`Record key must be one of: ${stringTypes.join(", ")}`);
        const keyIdlType = new Type({
          source: tokeniser.source,
          tokens: { base: keyType },
        });
        keyIdlType.tokens.separator =
          tokeniser.consume(",") ||
          tokeniser.error("Missing comma after record key type");
        keyIdlType.type = typeName;
        const valueType =
          type_with_extended_attributes(tokeniser, typeName) ||
          tokeniser.error("Error parsing generic type record");
        ret.subtype.push(keyIdlType, valueType);
        break;
      }
    }
    if (!ret.idlType) tokeniser.error(`Error parsing generic type ${base.value}`);
    ret.tokens.close =
      tokeniser.consume(">") ||
      tokeniser.error(`Missing closing bracket after ${base.value}`);
    return ret.this;
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function type_suffix(tokeniser, obj) {
    const nullable = tokeniser.consume("?");
    if (nullable) {
      obj.tokens.nullable = nullable;
    }
    if (tokeniser.probe("?")) tokeniser.error("Can't nullable more than once");
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {string} typeName
   */
  function single_type(tokeniser, typeName) {
    let ret = generic_type(tokeniser, typeName) || primitive_type(tokeniser);
    if (!ret) {
      const base =
        tokeniser.consumeKind("identifier") ||
        tokeniser.consume(...stringTypes, ...typeNameKeywords);
      if (!base) {
        return;
      }
      ret = new Type({ source: tokeniser.source, tokens: { base } });
      if (tokeniser.probe("<"))
        tokeniser.error(`Unsupported generic type ${base.value}`);
    }
    if (ret.generic === "Promise" && tokeniser.probe("?")) {
      tokeniser.error("Promise type cannot be nullable");
    }
    ret.type = typeName || null;
    type_suffix(tokeniser, ret);
    if (ret.nullable && ret.idlType === "any")
      tokeniser.error("Type `any` cannot be made nullable");
    return ret;
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {string} type
   */
  function union_type(tokeniser, type) {
    const tokens = {};
    tokens.open = tokeniser.consume("(");
    if (!tokens.open) return;
    const ret = autoParenter(new Type({ source: tokeniser.source, tokens }));
    ret.type = type || null;
    while (true) {
      const typ =
        type_with_extended_attributes(tokeniser, type) ||
        tokeniser.error("No type after open parenthesis or 'or' in union type");
      if (typ.idlType === "any")
        tokeniser.error("Type `any` cannot be included in a union type");
      if (typ.generic === "Promise")
        tokeniser.error("Type `Promise` cannot be included in a union type");
      ret.subtype.push(typ);
      const or = tokeniser.consume("or");
      if (or) {
        typ.tokens.separator = or;
      } else break;
    }
    if (ret.idlType.length < 2) {
      tokeniser.error(
        "At least two types are expected in a union type but found less",
      );
    }
    tokens.close =
      tokeniser.consume(")") || tokeniser.error("Unterminated union type");
    type_suffix(tokeniser, ret);
    return ret.this;
  }

  class Type extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {string} typeName
     */
    static parse(tokeniser, typeName) {
      return single_type(tokeniser, typeName) || union_type(tokeniser, typeName);
    }

    constructor({ source, tokens }) {
      super({ source, tokens });
      Object.defineProperty(this, "subtype", { value: [], writable: true });
      this.extAttrs = new ExtendedAttributes({ source, tokens: {} });
    }

    get generic() {
      if (this.subtype.length && this.tokens.base) {
        return this.tokens.base.value;
      }
      return "";
    }
    get nullable() {
      return Boolean(this.tokens.nullable);
    }
    get union() {
      return Boolean(this.subtype.length) && !this.tokens.base;
    }
    get idlType() {
      if (this.subtype.length) {
        return this.subtype;
      }
      // Adding prefixes/postfixes for "unrestricted float", etc.
      const name = [this.tokens.prefix, this.tokens.base, this.tokens.postfix]
        .filter((t) => t)
        .map((t) => t.value)
        .join(" ");
      return unescape$1(name);
    }

    *validate(defs) {
      yield* this.extAttrs.validate(defs);

      if (this.idlType === "BufferSource") {
        // XXX: For now this is a hack. Consider moving parents' extAttrs into types as the spec says:
        // https://webidl.spec.whatwg.org/#idl-annotated-types
        for (const extAttrs of [this.extAttrs, this.parent?.extAttrs]) {
          for (const extAttr of extAttrs) {
            if (extAttr.name !== "AllowShared") {
              continue;
            }
            const message = `\`[AllowShared] BufferSource\` is now replaced with AllowSharedBufferSource.`;
            yield validationError(
              this.tokens.base,
              this,
              "migrate-allowshared",
              message,
              { autofix: replaceAllowShared(this, extAttr, extAttrs) },
            );
          }
        }
      }

      if (this.idlType === "void") {
        const message = `\`void\` is now replaced by \`undefined\`. Refer to the \
[relevant GitHub issue](https://github.com/whatwg/webidl/issues/60) \
for more information.`;
        yield validationError(this.tokens.base, this, "replace-void", message, {
          autofix: replaceVoid(this),
        });
      }

      /*
       * If a union is nullable, its subunions cannot include a dictionary
       * If not, subunions may include dictionaries if each union is not nullable
       */
      const typedef = !this.union && defs.unique.get(this.idlType);
      const target = this.union
        ? this
        : typedef && typedef.type === "typedef"
          ? typedef.idlType
          : undefined;
      if (target && this.nullable) {
        // do not allow any dictionary
        const { reference } = idlTypeIncludesDictionary(target, defs) || {};
        if (reference) {
          const targetToken = (this.union ? reference : this).tokens.base;
          const message = "Nullable union cannot include a dictionary type.";
          yield validationError(
            targetToken,
            this,
            "no-nullable-union-dict",
            message,
          );
        }
      } else {
        // allow some dictionary
        for (const subtype of this.subtype) {
          yield* subtype.validate(defs);
        }
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const type_body = () => {
        if (this.union || this.generic) {
          return w.ts.wrap([
            w.token(this.tokens.base, w.ts.generic),
            w.token(this.tokens.open),
            ...this.subtype.map((t) => t.write(w)),
            w.token(this.tokens.close),
          ]);
        }
        const firstToken = this.tokens.prefix || this.tokens.base;
        const prefix = this.tokens.prefix
          ? [this.tokens.prefix.value, w.ts.trivia(this.tokens.base.trivia)]
          : [];
        const ref = w.reference(
          w.ts.wrap([
            ...prefix,
            this.tokens.base.value,
            w.token(this.tokens.postfix),
          ]),
          {
            unescaped: /** @type {string} (because it's not union) */ (
              this.idlType
            ),
            context: this,
          },
        );
        return w.ts.wrap([w.ts.trivia(firstToken.trivia), ref]);
      };
      return w.ts.wrap([
        this.extAttrs.write(w),
        type_body(),
        w.token(this.tokens.nullable),
        w.token(this.tokens.separator),
      ]);
    }
  }

  /**
   * @param {Type} type
   * @param {import("./extended-attributes.js").SimpleExtendedAttribute} extAttr
   * @param {ExtendedAttributes} extAttrs
   */
  function replaceAllowShared(type, extAttr, extAttrs) {
    return () => {
      const index = extAttrs.indexOf(extAttr);
      extAttrs.splice(index, 1);
      if (!extAttrs.length && type.tokens.base.trivia.match(/^\s$/)) {
        type.tokens.base.trivia = ""; // (let's not remove comments)
      }

      type.tokens.base.value = "AllowSharedBufferSource";
    };
  }

  /**
   * @param {Type} type
   */
  function replaceVoid(type) {
    return () => {
      type.tokens.base.value = "undefined";
    };
  }

  class Default extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const assign = tokeniser.consume("=");
      if (!assign) {
        return null;
      }
      const def =
        const_value(tokeniser) ||
        tokeniser.consumeKind("string") ||
        tokeniser.consume("null", "[", "{") ||
        tokeniser.error("No value for default");
      const expression = [def];
      if (def.value === "[") {
        const close =
          tokeniser.consume("]") ||
          tokeniser.error("Default sequence value must be empty");
        expression.push(close);
      } else if (def.value === "{") {
        const close =
          tokeniser.consume("}") ||
          tokeniser.error("Default dictionary value must be empty");
        expression.push(close);
      }
      return new Default({
        source: tokeniser.source,
        tokens: { assign },
        expression,
      });
    }

    constructor({ source, tokens, expression }) {
      super({ source, tokens });
      expression.parent = this;
      Object.defineProperty(this, "expression", { value: expression });
    }

    get type() {
      return const_data(this.expression[0]).type;
    }
    get value() {
      return const_data(this.expression[0]).value;
    }
    get negative() {
      return const_data(this.expression[0]).negative;
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.wrap([
        w.token(this.tokens.assign),
        ...this.expression.map((t) => w.token(t)),
      ]);
    }
  }

  class Argument extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const start_position = tokeniser.position;
      /** @type {Base["tokens"]} */
      const tokens = {};
      const ret = autoParenter(
        new Argument({ source: tokeniser.source, tokens }),
      );
      ret.extAttrs = ExtendedAttributes.parse(tokeniser);
      tokens.optional = tokeniser.consume("optional");
      ret.idlType = type_with_extended_attributes(tokeniser, "argument-type");
      if (!ret.idlType) {
        return tokeniser.unconsume(start_position);
      }
      if (!tokens.optional) {
        tokens.variadic = tokeniser.consume("...");
      }
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.consume(...argumentNameKeywords);
      if (!tokens.name) {
        return tokeniser.unconsume(start_position);
      }
      ret.default = tokens.optional ? Default.parse(tokeniser) : null;
      return ret.this;
    }

    get type() {
      return "argument";
    }
    get optional() {
      return !!this.tokens.optional;
    }
    get variadic() {
      return !!this.tokens.variadic;
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }

    /**
     * @param {import("../validator.js").Definitions} defs
     */
    *validate(defs) {
      yield* this.extAttrs.validate(defs);
      yield* this.idlType.validate(defs);
      const result = idlTypeIncludesDictionary(this.idlType, defs, {
        useNullableInner: true,
      });
      if (result) {
        if (this.idlType.nullable) {
          const message = `Dictionary arguments cannot be nullable.`;
          yield validationError(
            this.tokens.name,
            this,
            "no-nullable-dict-arg",
            message,
          );
        } else if (!this.optional) {
          if (
            this.parent &&
            !dictionaryIncludesRequiredField(result.dictionary, defs) &&
            isLastRequiredArgument(this)
          ) {
            const message = `Dictionary argument must be optional if it has no required fields`;
            yield validationError(
              this.tokens.name,
              this,
              "dict-arg-optional",
              message,
              {
                autofix: autofixDictionaryArgumentOptionality(this),
              },
            );
          }
        } else if (!this.default) {
          const message = `Optional dictionary arguments must have a default value of \`{}\`.`;
          yield validationError(
            this.tokens.name,
            this,
            "dict-arg-default",
            message,
            {
              autofix: autofixOptionalDictionaryDefaultValue(this),
            },
          );
        }
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.wrap([
        this.extAttrs.write(w),
        w.token(this.tokens.optional),
        w.ts.type(this.idlType.write(w)),
        w.token(this.tokens.variadic),
        w.name_token(this.tokens.name, { data: this }),
        this.default ? this.default.write(w) : "",
        w.token(this.tokens.separator),
      ]);
    }
  }

  /**
   * @param {Argument} arg
   */
  function isLastRequiredArgument(arg) {
    const list = arg.parent.arguments || arg.parent.list;
    const index = list.indexOf(arg);
    const requiredExists = list.slice(index + 1).some((a) => !a.optional);
    return !requiredExists;
  }

  /**
   * @param {Argument} arg
   */
  function autofixDictionaryArgumentOptionality(arg) {
    return () => {
      const firstToken = getFirstToken(arg.idlType);
      arg.tokens.optional = {
        ...firstToken,
        type: "optional",
        value: "optional",
      };
      firstToken.trivia = " ";
      autofixOptionalDictionaryDefaultValue(arg)();
    };
  }

  /**
   * @param {Argument} arg
   */
  function autofixOptionalDictionaryDefaultValue(arg) {
    return () => {
      arg.default = Default.parse(new Tokeniser(" = {}"));
    };
  }

  class Operation extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {object} [options]
     * @param {import("../tokeniser.js").Token} [options.special]
     * @param {import("../tokeniser.js").Token} [options.regular]
     */
    static parse(tokeniser, { special, regular } = {}) {
      const tokens = { special };
      const ret = autoParenter(
        new Operation({ source: tokeniser.source, tokens }),
      );
      if (special && special.value === "stringifier") {
        tokens.termination = tokeniser.consume(";");
        if (tokens.termination) {
          ret.arguments = [];
          return ret;
        }
      }
      if (!special && !regular) {
        tokens.special = tokeniser.consume("getter", "setter", "deleter");
      }
      ret.idlType =
        return_type(tokeniser) || tokeniser.error("Missing return type");
      tokens.name =
        tokeniser.consumeKind("identifier") || tokeniser.consume("includes");
      tokens.open =
        tokeniser.consume("(") || tokeniser.error("Invalid operation");
      ret.arguments = argument_list(tokeniser);
      tokens.close =
        tokeniser.consume(")") || tokeniser.error("Unterminated operation");
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("Unterminated operation, expected `;`");
      return ret.this;
    }

    get type() {
      return "operation";
    }
    get name() {
      const { name } = this.tokens;
      if (!name) {
        return "";
      }
      return unescape$1(name.value);
    }
    get special() {
      if (!this.tokens.special) {
        return "";
      }
      return this.tokens.special.value;
    }

    *validate(defs) {
      yield* this.extAttrs.validate(defs);
      if (!this.name && ["", "static"].includes(this.special)) {
        const message = `Regular or static operations must have both a return type and an identifier.`;
        yield validationError(this.tokens.open, this, "incomplete-op", message);
      }
      if (this.idlType) {
        if (this.idlType.generic === "async_sequence") {
          const message = `async_sequence types cannot be returned by an operation.`;
          yield validationError(
            this.idlType.tokens.base,
            this,
            "async-sequence-idl-to-js",
            message,
          );
        }
        yield* this.idlType.validate(defs);
      }
      for (const argument of this.arguments) {
        yield* argument.validate(defs);
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const { parent } = this;
      const body = this.idlType
        ? [
            w.ts.type(this.idlType.write(w)),
            w.name_token(this.tokens.name, { data: this, parent }),
            w.token(this.tokens.open),
            w.ts.wrap(this.arguments.map((arg) => arg.write(w))),
            w.token(this.tokens.close),
          ]
        : [];
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          this.tokens.name
            ? w.token(this.tokens.special)
            : w.token(this.tokens.special, w.ts.nameless, { data: this, parent }),
          ...body,
          w.token(this.tokens.termination),
        ]),
        { data: this, parent },
      );
    }
  }

  class Attribute extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {object} [options]
     * @param {import("../tokeniser.js").Token} [options.special]
     * @param {boolean} [options.noInherit]
     * @param {boolean} [options.readonly]
     */
    static parse(
      tokeniser,
      { special, noInherit = false, readonly = false } = {},
    ) {
      const start_position = tokeniser.position;
      const tokens = { special };
      const ret = autoParenter(
        new Attribute({ source: tokeniser.source, tokens }),
      );
      if (!special && !noInherit) {
        tokens.special = tokeniser.consume("inherit");
      }
      if (ret.special === "inherit" && tokeniser.probe("readonly")) {
        tokeniser.error("Inherited attributes cannot be read-only");
      }
      tokens.readonly = tokeniser.consume("readonly");
      if (readonly && !tokens.readonly && tokeniser.probe("attribute")) {
        tokeniser.error("Attributes must be readonly in this context");
      }
      tokens.base = tokeniser.consume("attribute");
      if (!tokens.base) {
        tokeniser.unconsume(start_position);
        return;
      }
      ret.idlType =
        type_with_extended_attributes(tokeniser, "attribute-type") ||
        tokeniser.error("Attribute lacks a type");
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.consume("async", "required") ||
        tokeniser.error("Attribute lacks a name");
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("Unterminated attribute, expected `;`");
      return ret.this;
    }

    get type() {
      return "attribute";
    }
    get special() {
      if (!this.tokens.special) {
        return "";
      }
      return this.tokens.special.value;
    }
    get readonly() {
      return !!this.tokens.readonly;
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }

    *validate(defs) {
      yield* this.extAttrs.validate(defs);
      yield* this.idlType.validate(defs);

      if (
        ["async_sequence", "sequence", "record"].includes(this.idlType.generic)
      ) {
        const message = `Attributes cannot accept ${this.idlType.generic} types.`;
        yield validationError(
          this.tokens.name,
          this,
          "attr-invalid-type",
          message,
        );
      }

      {
        const { reference } = idlTypeIncludesDictionary(this.idlType, defs) || {};
        if (reference) {
          const targetToken = (this.idlType.union ? reference : this.idlType)
            .tokens.base;
          const message = "Attributes cannot accept dictionary types.";
          yield validationError(targetToken, this, "attr-invalid-type", message);
        }
      }

      if (this.readonly) {
        if (idlTypeIncludesEnforceRange(this.idlType, defs)) {
          const targetToken = this.idlType.tokens.base;
          const message =
            "Readonly attributes cannot accept [EnforceRange] extended attribute.";
          yield validationError(targetToken, this, "attr-invalid-type", message);
        }
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const { parent } = this;
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.special),
          w.token(this.tokens.readonly),
          w.token(this.tokens.base),
          w.ts.type(this.idlType.write(w)),
          w.name_token(this.tokens.name, { data: this, parent }),
          w.token(this.tokens.termination),
        ]),
        { data: this, parent },
      );
    }
  }

  /**
   * @param {string} identifier
   */
  function unescape$1(identifier) {
    return identifier.startsWith("_") ? identifier.slice(1) : identifier;
  }

  /**
   * Parses comma-separated list
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {object} args
   * @param {Function} args.parser parser function for each item
   * @param {boolean} [args.allowDangler] whether to allow dangling comma
   * @param {string} [args.listName] the name to be shown on error messages
   */
  function list$1(tokeniser, { parser, allowDangler, listName = "list" }) {
    const first = parser(tokeniser);
    if (!first) {
      return [];
    }
    first.tokens.separator = tokeniser.consume(",");
    const items = [first];
    while (first.tokens.separator) {
      const item = parser(tokeniser);
      if (!item) {
        if (!allowDangler) {
          tokeniser.error(`Trailing comma in ${listName}`);
        }
        break;
      }
      item.tokens.separator = tokeniser.consume(",");
      items.push(item);
      if (!item.tokens.separator) break;
    }
    return items;
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function const_value(tokeniser) {
    return (
      tokeniser.consumeKind("decimal", "integer") ||
      tokeniser.consume("true", "false", "Infinity", "-Infinity", "NaN")
    );
  }

  /**
   * @param {object} token
   * @param {string} token.type
   * @param {string} token.value
   */
  function const_data({ type, value }) {
    switch (type) {
      case "decimal":
      case "integer":
        return { type: "number", value };
      case "string":
        return { type: "string", value: value.slice(1, -1) };
    }

    switch (value) {
      case "true":
      case "false":
        return { type: "boolean", value: value === "true" };
      case "Infinity":
      case "-Infinity":
        return { type: "Infinity", negative: value.startsWith("-") };
      case "[":
        return { type: "sequence", value: [] };
      case "{":
        return { type: "dictionary" };
      default:
        return { type: value };
    }
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function primitive_type(tokeniser) {
    function integer_type() {
      const prefix = tokeniser.consume("unsigned");
      const base = tokeniser.consume("short", "long");
      if (base) {
        const postfix = tokeniser.consume("long");
        return new Type({ source, tokens: { prefix, base, postfix } });
      }
      if (prefix) tokeniser.error("Failed to parse integer type");
    }

    function decimal_type() {
      const prefix = tokeniser.consume("unrestricted");
      const base = tokeniser.consume("float", "double");
      if (base) {
        return new Type({ source, tokens: { prefix, base } });
      }
      if (prefix) tokeniser.error("Failed to parse float type");
    }

    const { source } = tokeniser;
    const num_type = integer_type() || decimal_type();
    if (num_type) return num_type;
    const base = tokeniser.consume(
      "bigint",
      "boolean",
      "byte",
      "octet",
      "undefined",
    );
    if (base) {
      return new Type({ source, tokens: { base } });
    }
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function argument_list(tokeniser) {
    return list$1(tokeniser, {
      parser: Argument.parse,
      listName: "arguments list",
    });
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {string=} typeName (TODO: See Type.type for more details)
   */
  function type_with_extended_attributes(tokeniser, typeName) {
    const extAttrs = ExtendedAttributes.parse(tokeniser);
    const ret = Type.parse(tokeniser, typeName);
    if (ret) autoParenter(ret).extAttrs = extAttrs;
    return ret;
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {string=} typeName (TODO: See Type.type for more details)
   */
  function return_type(tokeniser, typeName) {
    const typ = Type.parse(tokeniser, typeName || "return-type");
    if (typ) {
      return typ;
    }
    const voidToken = tokeniser.consume("void");
    if (voidToken) {
      const ret = new Type({
        source: tokeniser.source,
        tokens: { base: voidToken },
      });
      ret.type = "return-type";
      return ret;
    }
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function stringifier(tokeniser) {
    const special = tokeniser.consume("stringifier");
    if (!special) return;
    const member =
      Attribute.parse(tokeniser, { special }) ||
      Operation.parse(tokeniser, { special }) ||
      tokeniser.error("Unterminated stringifier");
    return member;
  }

  /**
   * @param {string} str
   */
  function getLastIndentation(str) {
    const lines = str.split("\n");
    // the first line visually binds to the preceding token
    if (lines.length) {
      const match = lines[lines.length - 1].match(/^\s+/);
      if (match) {
        return match[0];
      }
    }
    return "";
  }

  /**
   * @param {string} parentTrivia
   */
  function getMemberIndentation(parentTrivia) {
    const indentation = getLastIndentation(parentTrivia);
    const indentCh = indentation.includes("\t") ? "\t" : "  ";
    return indentation + indentCh;
  }

  /**
   * @param {import("./interface.js").Interface} def
   */
  function autofixAddExposedWindow(def) {
    return () => {
      if (def.extAttrs.length) {
        const tokeniser = new Tokeniser("Exposed=Window,");
        const exposed = SimpleExtendedAttribute.parse(tokeniser);
        exposed.tokens.separator = tokeniser.consume(",");
        const existing = def.extAttrs[0];
        if (!/^\s/.test(existing.tokens.name.trivia)) {
          existing.tokens.name.trivia = ` ${existing.tokens.name.trivia}`;
        }
        def.extAttrs.unshift(exposed);
      } else {
        autoParenter(def).extAttrs = ExtendedAttributes.parse(
          new Tokeniser("[Exposed=Window]"),
        );
        const trivia = def.tokens.base.trivia;
        def.extAttrs.tokens.open.trivia = trivia;
        def.tokens.base.trivia = `\n${getLastIndentation(trivia)}`;
      }
    };
  }

  /**
   * Get the first syntax token for the given IDL object.
   * @param {*} data
   */
  function getFirstToken(data) {
    if (data.extAttrs.length) {
      return data.extAttrs.tokens.open;
    }
    if (data.type === "operation" && !data.special) {
      return getFirstToken(data.idlType);
    }
    const tokens = Object.values(data.tokens).sort((x, y) => x.index - y.index);
    return tokens[0];
  }

  /**
   * @template T
   * @param {T[]} array
   * @param {(item: T) => boolean} predicate
   */
  function findLastIndex(array, predicate) {
    const index = array.slice().reverse().findIndex(predicate);
    if (index === -1) {
      return index;
    }
    return array.length - index - 1;
  }

  /**
   * Returns a proxy that auto-assign `parent` field.
   * @template {Record<string | symbol, any>} T
   * @param {T} data
   * @param {*} [parent] The object that will be assigned to `parent`.
   *                     If absent, it will be `data` by default.
   * @return {T}
   */
  function autoParenter(data, parent) {
    if (!parent) {
      // Defaults to `data` unless specified otherwise.
      parent = data;
    }
    if (!data) {
      // This allows `autoParenter(undefined)` which again allows
      // `autoParenter(parse())` where the function may return nothing.
      return data;
    }
    const proxy = new Proxy(data, {
      get(target, p) {
        const value = target[p];
        if (Array.isArray(value) && p !== "source") {
          // Wraps the array so that any added items will also automatically
          // get their `parent` values.
          return autoParenter(value, target);
        }
        return value;
      },
      set(target, p, value) {
        // @ts-ignore https://github.com/microsoft/TypeScript/issues/47357
        target[p] = value;
        if (!value) {
          return true;
        } else if (Array.isArray(value)) {
          // Assigning an array will add `parent` to its items.
          for (const item of value) {
            if (typeof item.parent !== "undefined") {
              item.parent = parent;
            }
          }
        } else if (typeof value.parent !== "undefined") {
          value.parent = parent;
        }
        return true;
      },
    });
    return proxy;
  }

  // These regular expressions use the sticky flag so they will only match at
  // the current location (ie. the offset of lastIndex).
  const tokenRe = {
    // This expression uses a lookahead assertion to catch false matches
    // against integers early.
    decimal:
      /-?(?=[0-9]*\.|[0-9]+[eE])(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][-+]?[0-9]+)?|[0-9]+[Ee][-+]?[0-9]+)/y,
    integer: /-?(0([Xx][0-9A-Fa-f]+|[0-7]*)|[1-9][0-9]*)/y,
    identifier: /[_-]?[A-Za-z][0-9A-Z_a-z-]*/y,
    string: /"[^"]*"/y,
    whitespace: /[\t\n\r ]+/y,
    comment: /\/\/.*|\/\*[\s\S]*?\*\//y,
    other: /[^\t\n\r 0-9A-Za-z]/y,
  };

  const typeNameKeywords = [
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8ClampedArray",
    "BigInt64Array",
    "BigUint64Array",
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "any",
    "object",
    "symbol",
  ];

  const stringTypes = ["ByteString", "DOMString", "USVString"];

  const argumentNameKeywords = [
    "async",
    "attribute",
    "callback",
    "const",
    "constructor",
    "deleter",
    "dictionary",
    "enum",
    "getter",
    "includes",
    "inherit",
    "interface",
    "iterable",
    "maplike",
    "namespace",
    "partial",
    "required",
    "setlike",
    "setter",
    "static",
    "stringifier",
    "typedef",
    "unrestricted",
  ];

  const nonRegexTerminals = [
    "-Infinity",
    "FrozenArray",
    "Infinity",
    "NaN",
    "ObservableArray",
    "Promise",
    "async_iterable",
    "async_sequence",
    "bigint",
    "boolean",
    "byte",
    "double",
    "false",
    "float",
    "long",
    "mixin",
    "null",
    "octet",
    "optional",
    "or",
    "readonly",
    "record",
    "sequence",
    "short",
    "true",
    "undefined",
    "unsigned",
    "void",
  ].concat(argumentNameKeywords, stringTypes, typeNameKeywords);

  const punctuations = [
    "(",
    ")",
    ",",
    "...",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "*",
    "[",
    "]",
    "{",
    "}",
  ];

  const reserved = [
    // "constructor" is now a keyword
    "_constructor",
    "toString",
    "_toString",
  ];

  /**
   * @typedef {ArrayItemType<ReturnType<typeof tokenise>>} Token
   * @param {string} str
   */
  function tokenise(str) {
    const tokens = [];
    let lastCharIndex = 0;
    let trivia = "";
    let line = 1;
    let index = 0;
    while (lastCharIndex < str.length) {
      const nextChar = str.charAt(lastCharIndex);
      let result = -1;

      if (/[\t\n\r ]/.test(nextChar)) {
        result = attemptTokenMatch("whitespace", { noFlushTrivia: true });
      } else if (nextChar === "/") {
        result = attemptTokenMatch("comment", { noFlushTrivia: true });
      }

      if (result !== -1) {
        const currentTrivia = tokens.pop().value;
        line += (currentTrivia.match(/\n/g) || []).length;
        trivia += currentTrivia;
        index -= 1;
      } else if (/[-0-9.A-Z_a-z]/.test(nextChar)) {
        result = attemptTokenMatch("decimal");
        if (result === -1) {
          result = attemptTokenMatch("integer");
        }
        if (result === -1) {
          result = attemptTokenMatch("identifier");
          const lastIndex = tokens.length - 1;
          const token = tokens[lastIndex];
          if (result !== -1) {
            if (reserved.includes(token.value)) {
              const message = `${unescape$1(
              token.value,
            )} is a reserved identifier and must not be used.`;
              throw new WebIDLParseError(
                syntaxError(tokens, lastIndex, null, message),
              );
            } else if (nonRegexTerminals.includes(token.value)) {
              token.type = "inline";
            }
          }
        }
      } else if (nextChar === '"') {
        result = attemptTokenMatch("string");
      }

      for (const punctuation of punctuations) {
        if (str.startsWith(punctuation, lastCharIndex)) {
          tokens.push({
            type: "inline",
            value: punctuation,
            trivia,
            line,
            index,
          });
          trivia = "";
          lastCharIndex += punctuation.length;
          result = lastCharIndex;
          break;
        }
      }

      // other as the last try
      if (result === -1) {
        result = attemptTokenMatch("other");
      }
      if (result === -1) {
        throw new Error("Token stream not progressing");
      }
      lastCharIndex = result;
      index += 1;
    }

    // remaining trivia as eof
    tokens.push({
      type: "eof",
      value: "",
      trivia,
      line,
      index,
    });

    return tokens;

    /**
     * @param {keyof typeof tokenRe} type
     * @param {object} options
     * @param {boolean} [options.noFlushTrivia]
     */
    function attemptTokenMatch(type, { noFlushTrivia } = {}) {
      const re = tokenRe[type];
      re.lastIndex = lastCharIndex;
      const result = re.exec(str);
      if (result) {
        tokens.push({ type, value: result[0], trivia, line, index });
        if (!noFlushTrivia) {
          trivia = "";
        }
        return re.lastIndex;
      }
      return -1;
    }
  }

  class Tokeniser {
    /**
     * @param {string} idl
     */
    constructor(idl) {
      this.source = tokenise(idl);
      this.position = 0;
    }

    /**
     * @param {string} message
     * @return {never}
     */
    error(message) {
      throw new WebIDLParseError(
        syntaxError(this.source, this.position, this.current, message),
      );
    }

    /**
     * @param {string} type
     */
    probeKind(type) {
      return (
        this.source.length > this.position &&
        this.source[this.position].type === type
      );
    }

    /**
     * @param {string} value
     */
    probe(value) {
      return (
        this.probeKind("inline") && this.source[this.position].value === value
      );
    }

    /**
     * @param {...string} candidates
     */
    consumeKind(...candidates) {
      for (const type of candidates) {
        if (!this.probeKind(type)) continue;
        const token = this.source[this.position];
        this.position++;
        return token;
      }
    }

    /**
     * @param {...string} candidates
     */
    consume(...candidates) {
      if (!this.probeKind("inline")) return;
      const token = this.source[this.position];
      for (const value of candidates) {
        if (token.value !== value) continue;
        this.position++;
        return token;
      }
    }

    /**
     * @param {string} value
     */
    consumeIdentifier(value) {
      if (!this.probeKind("identifier")) {
        return;
      }
      if (this.source[this.position].value !== value) {
        return;
      }
      return this.consumeKind("identifier");
    }

    /**
     * @param {number} position
     */
    unconsume(position) {
      this.position = position;
    }
  }

  class WebIDLParseError extends Error {
    /**
     * @param {object} options
     * @param {string} options.message
     * @param {string} options.bareMessage
     * @param {string} options.context
     * @param {number} options.line
     * @param {*} options.sourceName
     * @param {string} options.input
     * @param {*[]} options.tokens
     */
    constructor({
      message,
      bareMessage,
      context,
      line,
      sourceName,
      input,
      tokens,
    }) {
      super(message);

      this.name = "WebIDLParseError"; // not to be mangled
      this.bareMessage = bareMessage;
      this.context = context;
      this.line = line;
      this.sourceName = sourceName;
      this.input = input;
      this.tokens = tokens;
    }
  }

  class EnumValue extends WrappedToken {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const value = tokeniser.consumeKind("string");
      if (value) {
        return new EnumValue({ source: tokeniser.source, tokens: { value } });
      }
    }

    get type() {
      return "enum-value";
    }
    get value() {
      return super.value.slice(1, -1);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const { parent } = this;
      return w.ts.wrap([
        w.ts.trivia(this.tokens.value.trivia),
        w.ts.definition(
          w.ts.wrap(['"', w.ts.name(this.value, { data: this, parent }), '"']),
          { data: this, parent },
        ),
        w.token(this.tokens.separator),
      ]);
    }
  }

  class Enum extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      /** @type {Base["tokens"]} */
      const tokens = {};
      tokens.base = tokeniser.consume("enum");
      if (!tokens.base) {
        return;
      }
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.error("No name for enum");
      const ret = autoParenter(new Enum({ source: tokeniser.source, tokens }));
      tokeniser.current = ret.this;
      tokens.open = tokeniser.consume("{") || tokeniser.error("Bodyless enum");
      ret.values = list$1(tokeniser, {
        parser: EnumValue.parse,
        allowDangler: true,
        listName: "enumeration",
      });
      if (tokeniser.probeKind("string")) {
        tokeniser.error("No comma between enum values");
      }
      tokens.close =
        tokeniser.consume("}") || tokeniser.error("Unexpected value in enum");
      if (!ret.values.length) {
        tokeniser.error("No value in enum");
      }
      tokens.termination =
        tokeniser.consume(";") || tokeniser.error("No semicolon after enum");
      return ret.this;
    }

    get type() {
      return "enum";
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.base),
          w.name_token(this.tokens.name, { data: this }),
          w.token(this.tokens.open),
          w.ts.wrap(this.values.map((v) => v.write(w))),
          w.token(this.tokens.close),
          w.token(this.tokens.termination),
        ]),
        { data: this },
      );
    }
  }

  class Includes extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const target = tokeniser.consumeKind("identifier");
      if (!target) {
        return;
      }
      const tokens = { target };
      tokens.includes = tokeniser.consume("includes");
      if (!tokens.includes) {
        tokeniser.unconsume(target.index);
        return;
      }
      tokens.mixin =
        tokeniser.consumeKind("identifier") ||
        tokeniser.error("Incomplete includes statement");
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("No terminating ; for includes statement");
      return new Includes({ source: tokeniser.source, tokens });
    }

    get type() {
      return "includes";
    }
    get target() {
      return unescape$1(this.tokens.target.value);
    }
    get includes() {
      return unescape$1(this.tokens.mixin.value);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.reference_token(this.tokens.target, this),
          w.token(this.tokens.includes),
          w.reference_token(this.tokens.mixin, this),
          w.token(this.tokens.termination),
        ]),
        { data: this },
      );
    }
  }

  class Typedef extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      /** @type {Base["tokens"]} */
      const tokens = {};
      const ret = autoParenter(new Typedef({ source: tokeniser.source, tokens }));
      tokens.base = tokeniser.consume("typedef");
      if (!tokens.base) {
        return;
      }
      ret.idlType =
        type_with_extended_attributes(tokeniser, "typedef-type") ||
        tokeniser.error("Typedef lacks a type");
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.error("Typedef lacks a name");
      tokeniser.current = ret.this;
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("Unterminated typedef, expected `;`");
      return ret.this;
    }

    get type() {
      return "typedef";
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }

    *validate(defs) {
      yield* this.idlType.validate(defs);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.base),
          w.ts.type(this.idlType.write(w)),
          w.name_token(this.tokens.name, { data: this }),
          w.token(this.tokens.termination),
        ]),
        { data: this },
      );
    }
  }

  class CallbackFunction extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser, base) {
      const tokens = { base };
      const ret = autoParenter(
        new CallbackFunction({ source: tokeniser.source, tokens }),
      );
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.error("Callback lacks a name");
      tokeniser.current = ret.this;
      tokens.assign =
        tokeniser.consume("=") || tokeniser.error("Callback lacks an assignment");
      ret.idlType =
        return_type(tokeniser) || tokeniser.error("Callback lacks a return type");
      tokens.open =
        tokeniser.consume("(") ||
        tokeniser.error("Callback lacks parentheses for arguments");
      ret.arguments = argument_list(tokeniser);
      tokens.close =
        tokeniser.consume(")") || tokeniser.error("Unterminated callback");
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("Unterminated callback, expected `;`");
      return ret.this;
    }

    get type() {
      return "callback";
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }

    *validate(defs) {
      yield* this.extAttrs.validate(defs);
      for (const arg of this.arguments) {
        yield* arg.validate(defs);
        if (arg.idlType.generic === "async_sequence") {
          const message = `async_sequence types cannot be returned as a callback argument.`;
          yield validationError(
            arg.tokens.name,
            arg,
            "async-sequence-idl-to-js",
            message,
          );
        }
      }
      yield* this.idlType.validate(defs);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.base),
          w.name_token(this.tokens.name, { data: this }),
          w.token(this.tokens.assign),
          w.ts.type(this.idlType.write(w)),
          w.token(this.tokens.open),
          ...this.arguments.map((arg) => arg.write(w)),
          w.token(this.tokens.close),
          w.token(this.tokens.termination),
        ]),
        { data: this },
      );
    }
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function inheritance(tokeniser) {
    const colon = tokeniser.consume(":");
    if (!colon) {
      return {};
    }
    const inheritance =
      tokeniser.consumeKind("identifier") ||
      tokeniser.error("Inheritance lacks a type");
    return { colon, inheritance };
  }

  /**
   * Parser callback.
   * @callback ParserCallback
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   * @param {...*} args
   */

  /**
   * A parser callback and optional option object.
   * @typedef AllowedMember
   * @type {[ParserCallback, object?]}
   */

  class Container extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {*} instance TODO: This should be {T extends Container}, but see https://github.com/microsoft/TypeScript/issues/4628
     * @param {*} args
     */
    static parse(tokeniser, instance, { inheritable, allowedMembers }) {
      const { tokens, type } = instance;
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.error(`Missing name in ${type}`);
      tokeniser.current = instance;
      instance = autoParenter(instance);
      if (inheritable) {
        Object.assign(tokens, inheritance(tokeniser));
      }
      tokens.open = tokeniser.consume("{") || tokeniser.error(`Bodyless ${type}`);
      instance.members = [];
      while (true) {
        tokens.close = tokeniser.consume("}");
        if (tokens.close) {
          tokens.termination =
            tokeniser.consume(";") ||
            tokeniser.error(`Missing semicolon after ${type}`);
          return instance.this;
        }
        const ea = ExtendedAttributes.parse(tokeniser);
        let mem;
        for (const [parser, ...args] of allowedMembers) {
          mem = autoParenter(parser(tokeniser, ...args));
          if (mem) {
            break;
          }
        }
        if (!mem) {
          tokeniser.error("Unknown member");
        }
        mem.extAttrs = ea;
        instance.members.push(mem.this);
      }
    }

    get partial() {
      return !!this.tokens.partial;
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }
    get inheritance() {
      if (!this.tokens.inheritance) {
        return null;
      }
      return unescape$1(this.tokens.inheritance.value);
    }

    *validate(defs) {
      for (const member of this.members) {
        if (member.validate) {
          yield* member.validate(defs);
        }
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const inheritance = () => {
        if (!this.tokens.inheritance) {
          return "";
        }
        return w.ts.wrap([
          w.token(this.tokens.colon),
          w.ts.trivia(this.tokens.inheritance.trivia),
          w.ts.inheritance(
            w.reference(this.tokens.inheritance.value, { context: this }),
          ),
        ]);
      };

      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.callback),
          w.token(this.tokens.partial),
          w.token(this.tokens.base),
          w.token(this.tokens.mixin),
          w.name_token(this.tokens.name, { data: this }),
          inheritance(),
          w.token(this.tokens.open),
          w.ts.wrap(this.members.map((m) => m.write(w))),
          w.token(this.tokens.close),
          w.token(this.tokens.termination),
        ]),
        { data: this },
      );
    }
  }

  class Constant extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      /** @type {Base["tokens"]} */
      const tokens = {};
      tokens.base = tokeniser.consume("const");
      if (!tokens.base) {
        return;
      }
      let idlType = primitive_type(tokeniser);
      if (!idlType) {
        const base =
          tokeniser.consumeKind("identifier") ||
          tokeniser.error("Const lacks a type");
        idlType = new Type({ source: tokeniser.source, tokens: { base } });
      }
      if (tokeniser.probe("?")) {
        tokeniser.error("Unexpected nullable constant type");
      }
      idlType.type = "const-type";
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.error("Const lacks a name");
      tokens.assign =
        tokeniser.consume("=") || tokeniser.error("Const lacks value assignment");
      tokens.value =
        const_value(tokeniser) || tokeniser.error("Const lacks a value");
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("Unterminated const, expected `;`");
      const ret = new Constant({ source: tokeniser.source, tokens });
      autoParenter(ret).idlType = idlType;
      return ret;
    }

    get type() {
      return "const";
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }
    get value() {
      return const_data(this.tokens.value);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const { parent } = this;
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.base),
          w.ts.type(this.idlType.write(w)),
          w.name_token(this.tokens.name, { data: this, parent }),
          w.token(this.tokens.assign),
          w.token(this.tokens.value),
          w.token(this.tokens.termination),
        ]),
        { data: this, parent },
      );
    }
  }

  class IterableLike extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const start_position = tokeniser.position;
      const ret = autoParenter(
        new IterableLike({ source: tokeniser.source, tokens: {} }),
      );
      const { tokens } = ret;
      tokens.readonly = tokeniser.consume("readonly");
      if (!tokens.readonly) {
        tokens.async = tokeniser.consume("async");
      }
      tokens.base = tokens.readonly
        ? tokeniser.consume("maplike", "setlike")
        : tokens.async
          ? tokeniser.consume("iterable")
          : tokeniser.consume("iterable", "async_iterable", "maplike", "setlike");
      if (!tokens.base) {
        tokeniser.unconsume(start_position);
        return;
      }

      const { type } = ret;
      const secondTypeRequired = type === "maplike";
      const secondTypeAllowed =
        secondTypeRequired || type === "iterable" || type === "async_iterable";
      const argumentAllowed =
        type === "async_iterable" || (ret.async && type === "iterable");

      tokens.open =
        tokeniser.consume("<") ||
        tokeniser.error(`Missing less-than sign \`<\` in ${type} declaration`);
      const first =
        type_with_extended_attributes(tokeniser) ||
        tokeniser.error(`Missing a type argument in ${type} declaration`);
      ret.idlType = [first];
      ret.arguments = [];

      if (secondTypeAllowed) {
        first.tokens.separator = tokeniser.consume(",");
        if (first.tokens.separator) {
          ret.idlType.push(type_with_extended_attributes(tokeniser));
        } else if (secondTypeRequired) {
          tokeniser.error(`Missing second type argument in ${type} declaration`);
        }
      }

      tokens.close =
        tokeniser.consume(">") ||
        tokeniser.error(`Missing greater-than sign \`>\` in ${type} declaration`);

      if (tokeniser.probe("(")) {
        if (argumentAllowed) {
          tokens.argsOpen = tokeniser.consume("(");
          ret.arguments.push(...argument_list(tokeniser));
          tokens.argsClose =
            tokeniser.consume(")") ||
            tokeniser.error("Unterminated async iterable argument list");
        } else {
          tokeniser.error(`Arguments are only allowed for \`async iterable\``);
        }
      }

      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error(`Missing semicolon after ${type} declaration`);

      return ret.this;
    }

    get type() {
      return this.tokens.base.value;
    }
    get readonly() {
      return !!this.tokens.readonly;
    }
    get async() {
      return !!this.tokens.async;
    }

    *validate(defs) {
      if (this.async && this.type === "iterable") {
        const message = "`async iterable` is now changed to `async_iterable`.";
        yield validationError(
          this.tokens.async,
          this,
          "obsolete-async-iterable-syntax",
          message,
          {
            autofix: autofixAsyncIterableSyntax(this),
          },
        );
      }
      for (const type of this.idlType) {
        yield* type.validate(defs);
      }
      for (const argument of this.arguments) {
        yield* argument.validate(defs);
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.readonly),
          w.token(this.tokens.async),
          w.token(this.tokens.base, w.ts.generic),
          w.token(this.tokens.open),
          w.ts.wrap(this.idlType.map((t) => t.write(w))),
          w.token(this.tokens.close),
          w.token(this.tokens.argsOpen),
          w.ts.wrap(this.arguments.map((arg) => arg.write(w))),
          w.token(this.tokens.argsClose),
          w.token(this.tokens.termination),
        ]),
        { data: this, parent: this.parent },
      );
    }
  }

  /**
   * @param {IterableLike} iterableLike
   */
  function autofixAsyncIterableSyntax(iterableLike) {
    return () => {
      const async = iterableLike.tokens.async;
      iterableLike.tokens.base = {
        ...async,
        type: "async_iterable",
        value: "async_iterable",
      };
      delete iterableLike.tokens.async;
    };
  }

  /**
   * @param {import("../validator.js").Definitions} defs
   * @param {import("../productions/container.js").Container} i
   */
  function* checkInterfaceMemberDuplication(defs, i) {
    const opNames = groupOperationNames(i);
    const partials = defs.partials.get(i.name) || [];
    const mixins = defs.mixinMap.get(i.name) || [];
    for (const ext of [...partials, ...mixins]) {
      const additions = getOperations(ext);
      const statics = additions.filter((a) => a.special === "static");
      const nonstatics = additions.filter((a) => a.special !== "static");
      yield* checkAdditions(statics, opNames.statics, ext, i);
      yield* checkAdditions(nonstatics, opNames.nonstatics, ext, i);
      statics.forEach((op) => opNames.statics.add(op.name));
      nonstatics.forEach((op) => opNames.nonstatics.add(op.name));
    }

    /**
     * @param {import("../productions/operation.js").Operation[]} additions
     * @param {Set<string>} existings
     * @param {import("../productions/container.js").Container} ext
     * @param {import("../productions/container.js").Container} base
     */
    function* checkAdditions(additions, existings, ext, base) {
      for (const addition of additions) {
        const { name } = addition;
        if (name && existings.has(name)) {
          const isStatic = addition.special === "static" ? "static " : "";
          const message = `The ${isStatic}operation "${name}" has already been defined for the base interface "${base.name}" either in itself or in a mixin`;
          yield validationError(
            addition.tokens.name,
            ext,
            "no-cross-overload",
            message,
          );
        }
      }
    }

    /**
     * @param {import("../productions/container.js").Container} i
     * @returns {import("../productions/operation.js").Operation[]}
     */
    function getOperations(i) {
      return i.members.filter(({ type }) => type === "operation");
    }

    /**
     * @param {import("../productions/container.js").Container} i
     */
    function groupOperationNames(i) {
      const ops = getOperations(i);
      return {
        statics: new Set(
          ops.filter((op) => op.special === "static").map((op) => op.name),
        ),
        nonstatics: new Set(
          ops.filter((op) => op.special !== "static").map((op) => op.name),
        ),
      };
    }
  }

  class Constructor extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      const base = tokeniser.consume("constructor");
      if (!base) {
        return;
      }
      /** @type {Base["tokens"]} */
      const tokens = { base };
      tokens.open =
        tokeniser.consume("(") ||
        tokeniser.error("No argument list in constructor");
      const args = argument_list(tokeniser);
      tokens.close =
        tokeniser.consume(")") || tokeniser.error("Unterminated constructor");
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("No semicolon after constructor");
      const ret = new Constructor({ source: tokeniser.source, tokens });
      autoParenter(ret).arguments = args;
      return ret;
    }

    get type() {
      return "constructor";
    }

    *validate(defs) {
      for (const argument of this.arguments) {
        yield* argument.validate(defs);
      }
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const { parent } = this;
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.base, w.ts.nameless, { data: this, parent }),
          w.token(this.tokens.open),
          w.ts.wrap(this.arguments.map((arg) => arg.write(w))),
          w.token(this.tokens.close),
          w.token(this.tokens.termination),
        ]),
        { data: this, parent },
      );
    }
  }

  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  function static_member(tokeniser) {
    const special = tokeniser.consume("static");
    if (!special) return;
    const member =
      Attribute.parse(tokeniser, { special }) ||
      Operation.parse(tokeniser, { special }) ||
      tokeniser.error("No body in static member");
    return member;
  }

  class Interface extends Container {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {import("../tokeniser.js").Token} base
     * @param {object} [options]
     * @param {import("./container.js").AllowedMember[]} [options.extMembers]
     * @param {import("../tokeniser.js").Token|null} [options.partial]
     */
    static parse(tokeniser, base, { extMembers = [], partial = null } = {}) {
      const tokens = { partial, base };
      return Container.parse(
        tokeniser,
        new Interface({ source: tokeniser.source, tokens }),
        {
          inheritable: !partial,
          allowedMembers: [
            ...extMembers,
            [Constant.parse],
            [Constructor.parse],
            [static_member],
            [stringifier],
            [IterableLike.parse],
            [Attribute.parse],
            [Operation.parse],
          ],
        },
      );
    }

    get type() {
      return "interface";
    }

    *validate(defs) {
      yield* this.extAttrs.validate(defs);
      if (
        !this.partial &&
        this.extAttrs.every((extAttr) => extAttr.name !== "Exposed")
      ) {
        const message = `Interfaces must have \`[Exposed]\` extended attribute. \
To fix, add, for example, \`[Exposed=Window]\`. Please also consider carefully \
if your interface should also be exposed in a Worker scope. Refer to the \
[WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) \
for more information.`;
        yield validationError(
          this.tokens.name,
          this,
          "require-exposed",
          message,
          {
            autofix: autofixAddExposedWindow(this),
          },
        );
      }
      const oldConstructors = this.extAttrs.filter(
        (extAttr) => extAttr.name === "Constructor",
      );
      for (const constructor of oldConstructors) {
        const message = `Constructors should now be represented as a \`constructor()\` operation on the interface \
instead of \`[Constructor]\` extended attribute. Refer to the \
[WebIDL spec section on constructor operations](https://heycam.github.io/webidl/#idl-constructors) \
for more information.`;
        yield validationError(
          constructor.tokens.name,
          this,
          "constructor-member",
          message,
          {
            autofix: autofixConstructor(this, constructor),
          },
        );
      }

      const isGlobal = this.extAttrs.some((extAttr) => extAttr.name === "Global");
      if (isGlobal) {
        const factoryFunctions = this.extAttrs.filter(
          (extAttr) => extAttr.name === "LegacyFactoryFunction",
        );
        for (const named of factoryFunctions) {
          const message = `Interfaces marked as \`[Global]\` cannot have factory functions.`;
          yield validationError(
            named.tokens.name,
            this,
            "no-constructible-global",
            message,
          );
        }

        const constructors = this.members.filter(
          (member) => member.type === "constructor",
        );
        for (const named of constructors) {
          const message = `Interfaces marked as \`[Global]\` cannot have constructors.`;
          yield validationError(
            named.tokens.base,
            this,
            "no-constructible-global",
            message,
          );
        }
      }

      yield* super.validate(defs);
      if (!this.partial) {
        yield* checkInterfaceMemberDuplication(defs, this);
      }
    }
  }

  function autofixConstructor(interfaceDef, constructorExtAttr) {
    interfaceDef = autoParenter(interfaceDef);
    return () => {
      const indentation = getLastIndentation(
        interfaceDef.extAttrs.tokens.open.trivia,
      );
      const memberIndent = interfaceDef.members.length
        ? getLastIndentation(getFirstToken(interfaceDef.members[0]).trivia)
        : getMemberIndentation(indentation);
      const constructorOp = Constructor.parse(
        new Tokeniser(`\n${memberIndent}constructor();`),
      );
      constructorOp.extAttrs = new ExtendedAttributes({
        source: interfaceDef.source,
        tokens: {},
      });
      autoParenter(constructorOp).arguments = constructorExtAttr.arguments;

      const existingIndex = findLastIndex(
        interfaceDef.members,
        (m) => m.type === "constructor",
      );
      interfaceDef.members.splice(existingIndex + 1, 0, constructorOp);

      const { close } = interfaceDef.tokens;
      if (!close.trivia.includes("\n")) {
        close.trivia += `\n${indentation}`;
      }

      const { extAttrs } = interfaceDef;
      const index = extAttrs.indexOf(constructorExtAttr);
      const removed = extAttrs.splice(index, 1);
      if (!extAttrs.length) {
        extAttrs.tokens.open = extAttrs.tokens.close = undefined;
      } else if (extAttrs.length === index) {
        extAttrs[index - 1].tokens.separator = undefined;
      } else if (!extAttrs[index].tokens.name.trivia.trim()) {
        extAttrs[index].tokens.name.trivia = removed[0].tokens.name.trivia;
      }
    };
  }

  class Mixin extends Container {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {import("../tokeniser.js").Token} base
     * @param {object} [options]
     * @param {import("./container.js").AllowedMember[]} [options.extMembers]
     * @param {import("../tokeniser.js").Token} [options.partial]
     */
    static parse(tokeniser, base, { extMembers = [], partial } = {}) {
      const tokens = { partial, base };
      tokens.mixin = tokeniser.consume("mixin");
      if (!tokens.mixin) {
        return;
      }
      return Container.parse(
        tokeniser,
        new Mixin({ source: tokeniser.source, tokens }),
        {
          allowedMembers: [
            ...extMembers,
            [Constant.parse],
            [stringifier],
            [Attribute.parse, { noInherit: true }],
            [Operation.parse, { regular: true }],
          ],
        },
      );
    }

    get type() {
      return "interface mixin";
    }
  }

  class Field extends Base {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     */
    static parse(tokeniser) {
      /** @type {Base["tokens"]} */
      const tokens = {};
      const ret = autoParenter(new Field({ source: tokeniser.source, tokens }));
      ret.extAttrs = ExtendedAttributes.parse(tokeniser);
      tokens.required = tokeniser.consume("required");
      ret.idlType =
        type_with_extended_attributes(tokeniser, "dictionary-type") ||
        tokeniser.error("Dictionary member lacks a type");
      tokens.name =
        tokeniser.consumeKind("identifier") ||
        tokeniser.error("Dictionary member lacks a name");
      ret.default = Default.parse(tokeniser);
      if (tokens.required && ret.default)
        tokeniser.error("Required member must not have a default");
      tokens.termination =
        tokeniser.consume(";") ||
        tokeniser.error("Unterminated dictionary member, expected `;`");
      return ret.this;
    }

    get type() {
      return "field";
    }
    get name() {
      return unescape$1(this.tokens.name.value);
    }
    get required() {
      return !!this.tokens.required;
    }

    *validate(defs) {
      yield* this.idlType.validate(defs);
    }

    /** @param {import("../writer.js").Writer} w */
    write(w) {
      const { parent } = this;
      return w.ts.definition(
        w.ts.wrap([
          this.extAttrs.write(w),
          w.token(this.tokens.required),
          w.ts.type(this.idlType.write(w)),
          w.name_token(this.tokens.name, { data: this, parent }),
          this.default ? this.default.write(w) : "",
          w.token(this.tokens.termination),
        ]),
        { data: this, parent },
      );
    }
  }

  class Dictionary extends Container {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {object} [options]
     * @param {import("./container.js").AllowedMember[]} [options.extMembers]
     * @param {import("../tokeniser.js").Token} [options.partial]
     */
    static parse(tokeniser, { extMembers = [], partial } = {}) {
      const tokens = { partial };
      tokens.base = tokeniser.consume("dictionary");
      if (!tokens.base) {
        return;
      }
      return Container.parse(
        tokeniser,
        new Dictionary({ source: tokeniser.source, tokens }),
        {
          inheritable: !partial,
          allowedMembers: [...extMembers, [Field.parse]],
        },
      );
    }

    get type() {
      return "dictionary";
    }
  }

  class Namespace extends Container {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {object} [options]
     * @param {import("./container.js").AllowedMember[]} [options.extMembers]
     * @param {import("../tokeniser.js").Token} [options.partial]
     */
    static parse(tokeniser, { extMembers = [], partial } = {}) {
      const tokens = { partial };
      tokens.base = tokeniser.consume("namespace");
      if (!tokens.base) {
        return;
      }
      return Container.parse(
        tokeniser,
        new Namespace({ source: tokeniser.source, tokens }),
        {
          allowedMembers: [
            ...extMembers,
            [Attribute.parse, { noInherit: true, readonly: true }],
            [Constant.parse],
            [Operation.parse, { regular: true }],
          ],
        },
      );
    }

    get type() {
      return "namespace";
    }

    *validate(defs) {
      if (
        !this.partial &&
        this.extAttrs.every((extAttr) => extAttr.name !== "Exposed")
      ) {
        const message = `Namespaces must have [Exposed] extended attribute. \
To fix, add, for example, [Exposed=Window]. Please also consider carefully \
if your namespace should also be exposed in a Worker scope. Refer to the \
[WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) \
for more information.`;
        yield validationError(
          this.tokens.name,
          this,
          "require-exposed",
          message,
          {
            autofix: autofixAddExposedWindow(this),
          },
        );
      }
      yield* super.validate(defs);
    }
  }

  class CallbackInterface extends Container {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {*} callback
     * @param {object} [options]
     * @param {import("./container.js").AllowedMember[]} [options.extMembers]
     */
    static parse(tokeniser, callback, { extMembers = [] } = {}) {
      const tokens = { callback };
      tokens.base = tokeniser.consume("interface");
      if (!tokens.base) {
        return;
      }
      return Container.parse(
        tokeniser,
        new CallbackInterface({ source: tokeniser.source, tokens }),
        {
          allowedMembers: [
            ...extMembers,
            [Constant.parse],
            [Operation.parse, { regular: true }],
          ],
        },
      );
    }

    get type() {
      return "callback interface";
    }
  }

  /** @typedef {'callbackInterface'|'dictionary'|'interface'|'mixin'|'namespace'} ExtendableInterfaces */
  /** @typedef {{ extMembers?: import("./productions/container.js").AllowedMember[]}} Extension */
  /** @typedef {Partial<Record<ExtendableInterfaces, Extension>>} Extensions */

  /**
   * Parser options.
   * @typedef {Object} ParserOptions
   * @property {string} [sourceName]
   * @property {boolean} [concrete]
   * @property {Function[]} [productions]
   * @property {Extensions} [extensions]
   */

  /**
   * @param {Tokeniser} tokeniser
   * @param {ParserOptions} options
   */
  function parseByTokens(tokeniser, options) {
    const source = tokeniser.source;

    function error(str) {
      tokeniser.error(str);
    }

    function consume(...candidates) {
      return tokeniser.consume(...candidates);
    }

    function callback() {
      const callback = consume("callback");
      if (!callback) return;
      if (tokeniser.probe("interface")) {
        return CallbackInterface.parse(tokeniser, callback, {
          ...options?.extensions?.callbackInterface,
        });
      }
      return CallbackFunction.parse(tokeniser, callback);
    }

    function interface_(opts) {
      const base = consume("interface");
      if (!base) return;
      return (
        Mixin.parse(tokeniser, base, {
          ...opts,
          ...options?.extensions?.mixin,
        }) ||
        Interface.parse(tokeniser, base, {
          ...opts,
          ...options?.extensions?.interface,
        }) ||
        error("Interface has no proper body")
      );
    }

    function partial() {
      const partial = consume("partial");
      if (!partial) return;
      return (
        Dictionary.parse(tokeniser, {
          partial,
          ...options?.extensions?.dictionary,
        }) ||
        interface_({ partial }) ||
        Namespace.parse(tokeniser, {
          partial,
          ...options?.extensions?.namespace,
        }) ||
        error("Partial doesn't apply to anything")
      );
    }

    function definition() {
      if (options.productions) {
        for (const production of options.productions) {
          const result = production(tokeniser);
          if (result) {
            return result;
          }
        }
      }

      return (
        callback() ||
        interface_() ||
        partial() ||
        Dictionary.parse(tokeniser, options?.extensions?.dictionary) ||
        Enum.parse(tokeniser) ||
        Typedef.parse(tokeniser) ||
        Includes.parse(tokeniser) ||
        Namespace.parse(tokeniser, options?.extensions?.namespace)
      );
    }

    function definitions() {
      if (!source.length) return [];
      const defs = [];
      while (true) {
        const ea = ExtendedAttributes.parse(tokeniser);
        const def = definition();
        if (!def) {
          if (ea.length) error("Stray extended attributes");
          break;
        }
        autoParenter(def).extAttrs = ea;
        defs.push(def);
      }
      const eof = Eof.parse(tokeniser);
      if (options.concrete) {
        defs.push(eof);
      }
      return defs;
    }

    const res = definitions();
    if (tokeniser.position < source.length) error("Unrecognised tokens");
    return res;
  }

  /**
   * @param {string} str
   * @param {ParserOptions} [options]
   */
  function parse(str, options = {}) {
    const tokeniser = new Tokeniser(str);
    if (typeof options.sourceName !== "undefined") {
      // @ts-ignore (See Tokeniser.source in supplement.d.ts)
      tokeniser.source.name = options.sourceName;
    }
    return parseByTokens(tokeniser, options);
  }

  function noop(arg) {
    return arg;
  }

  const templates$1 = {
    wrap: (items) => items.join(""),
    trivia: noop,
    name: noop,
    reference: noop,
    type: noop,
    generic: noop,
    nameless: noop,
    inheritance: noop,
    definition: noop,
    extendedAttribute: noop,
    extendedAttributeReference: noop,
  };

  class Writer {
    constructor(ts) {
      this.ts = Object.assign({}, templates$1, ts);
    }

    /**
     * @param {string} raw
     * @param {object} options
     * @param {string} [options.unescaped]
     * @param {import("./productions/base.js").Base} [options.context]
     * @returns
     */
    reference(raw, { unescaped, context }) {
      if (!unescaped) {
        unescaped = raw.startsWith("_") ? raw.slice(1) : raw;
      }
      return this.ts.reference(raw, unescaped, context);
    }

    /**
     * @param {import("./tokeniser.js").Token} t
     * @param {Function} wrapper
     * @param {...any} args
     * @returns
     */
    token(t, wrapper = noop, ...args) {
      if (!t) {
        return "";
      }
      const value = wrapper(t.value, ...args);
      return this.ts.wrap([this.ts.trivia(t.trivia), value]);
    }

    reference_token(t, context) {
      return this.token(t, this.reference.bind(this), { context });
    }

    name_token(t, arg) {
      return this.token(t, this.ts.name, arg);
    }

    identifier(id, context) {
      return this.ts.wrap([
        this.reference_token(id.tokens.value, context),
        this.token(id.tokens.separator),
      ]);
    }
  }

  function write(ast, { templates: ts = templates$1 } = {}) {
    ts = Object.assign({}, templates$1, ts);

    const w = new Writer(ts);

    return ts.wrap(ast.map((it) => it.write(w)));
  }

  function getMixinMap(all, unique) {
    const map = new Map();
    const includes = all.filter((def) => def.type === "includes");
    for (const include of includes) {
      const mixin = unique.get(include.includes);
      if (!mixin) {
        continue;
      }
      const array = map.get(include.target);
      if (array) {
        array.push(mixin);
      } else {
        map.set(include.target, [mixin]);
      }
    }
    return map;
  }

  /**
   * @typedef {ReturnType<typeof groupDefinitions>} Definitions
   */
  function groupDefinitions(all) {
    const unique = new Map();
    const duplicates = new Set();
    const partials = new Map();
    for (const def of all) {
      if (def.partial) {
        const array = partials.get(def.name);
        if (array) {
          array.push(def);
        } else {
          partials.set(def.name, [def]);
        }
        continue;
      }
      if (!def.name) {
        continue;
      }
      if (!unique.has(def.name)) {
        unique.set(def.name, def);
      } else {
        duplicates.add(def);
      }
    }
    return {
      all,
      unique,
      partials,
      duplicates,
      mixinMap: getMixinMap(all, unique),
      cache: {
        typedefIncludesDictionary: new WeakMap(),
        dictionaryIncludesRequiredField: new WeakMap(),
      },
    };
  }

  function* checkDuplicatedNames({ unique, duplicates }) {
    for (const dup of duplicates) {
      const { name } = dup;
      const message = `The name "${name}" of type "${
      unique.get(name).type
    }" was already seen`;
      yield validationError(dup.tokens.name, dup, "no-duplicate", message);
    }
  }

  function* validateIterable(ast) {
    const defs = groupDefinitions(ast);
    for (const def of defs.all) {
      if (def.validate) {
        yield* def.validate(defs);
      }
    }
    yield* checkDuplicatedNames(defs);
  }

  // Remove this once all of our support targets expose `.flat()` by default
  function flatten(array) {
    if (array.flat) {
      return array.flat();
    }
    return [].concat(...array);
  }

  /**
   * @param {import("./productions/base.js").Base[]} ast
   * @return {import("./error.js").WebIDLErrorData[]} validation errors
   */
  function validate(ast) {
    return [...validateIterable(flatten(ast))];
  }

  var _webidl2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    WebIDLParseError: WebIDLParseError,
    parse: parse,
    validate: validate,
    write: write
  });

  /**
   * Implementation of MIMEType and MIME Type parser from
   * https://mimesniff.spec.whatwg.org/
   */

  const HTTPTokenCodePoints = /^[!#$%&'*+-.^`|~\w]+$/;

  // "HTTP whitespace is U+000A LF, U+000D CR, U+0009 TAB or U+0020 SPACE."
  // eslint-disable-next-line no-control-regex
  const HTTPWhiteSpace = /[\u000A\u000D\u0009\u0020]/u;

  // An HTTP quoted-string token code point is
  // U+0009 TAB,
  // a code point in the range U+0020 SPACE to U+007E (~), inclusive,
  // or a code point in the range U+0080 through U+00FF (ÿ), inclusive.
  // eslint-disable-next-line no-control-regex
  const HTTPQuotedString = /^[\u0009\u{0020}-\{u0073}\u{0080}-\u{00FF}]+$/u;

  let MIMEType$1 = class MIMEType {
    constructor(input) {
      const { type, subtype, params } = parseMimeType(input);
      this.type = type.trim().toLowerCase();
      this.subtype = subtype.trimEnd().toLowerCase();
      this.parameters = new Map(Object.entries(params));
    }

    /**
     * @see https://mimesniff.spec.whatwg.org/#mime-type-essence
     */
    get essence() {
      return `${this.type}/${this.subtype}`;
    }

    toString() {
      return serialize$1(this);
    }
  };
  /**
   * https://mimesniff.spec.whatwg.org/#serialize-a-mime-type
   */
  function serialize$1(mimeType) {
    const { parameters, essence } = mimeType;
    if (!parameters.size) {
      return essence;
    }
    let paramStr = ";";
    for (const [key, value] of parameters.entries()) {
      paramStr += key;
      if (value !== null) {
        if (HTTPTokenCodePoints.test(value)) {
          paramStr += `=${value}`;
        } else {
          paramStr += `="${value}"`;
        }
      } else {
        // null or empty string
        paramStr += '=""';
      }
      paramStr += ";";
    }
    // remove final ";"
    return mimeType.essence + paramStr.slice(0, -1);
  }

  /**
   * Implementation of https://mimesniff.spec.whatwg.org/#parse-a-mime-type
   * parser state machines if as follows, params and param values are optional and can be null:
   *
   * "type"
   *    -> "subtype"
   *      -> "param-start" (ignores white space)
   *         -> "param-name"
   *            -> "param-value"
   *              -> "collect-quoted-string"
   *                -> "ignore-input-until-next-param"
   *
   *
   *
   * @param {String} input
   */
  function parseMimeType(input) {
    input = input.trim();
    if (!input) {
      throw new TypeError("Invalid input.");
    }

    let type = "";
    let subtype = "";
    let paramName = "";
    let paramValue = null;
    let params = new Map();
    let parserMode = "type";
    let inputArray = Array.from(input); // retain unicode chars
    for (let position = 0; position < inputArray.length; position++) {
      const char = inputArray[position];
      switch (parserMode) {
        case "type":
          if (char === "/") {
            parserMode = "subtype";
            continue;
          }
          type += char;
          break;
        case "subtype":
          if (char === ";") {
            parserMode = "param-start";
            continue;
          }
          subtype += char;
          break;
        case "param-start":
          // Skip HTTP white space
          if (HTTPWhiteSpace.test(char) || char === ";") {
            continue;
          }
          paramName += char;
          parserMode = "param-name";
          break;
        case "param-name":
          if (char === "=" || char === ";") {
            if (char === "=") {
              parserMode = "param-value";
              paramValue = null;
              continue;
            }
            params.set(paramName.toLowerCase(), null);
            paramName = "";
            continue;
          }
          paramName += char;
          break;
        case "param-value":
          if (char == '"') {
            parserMode = "collect-quoted-string";
            continue;
          }
          if (char === ";") {
            paramValue = paramValue.trimEnd();
            parserMode = "param-start";
            storeParam(params, paramName, paramValue);
            paramName = "";
            continue;
          }
          paramValue = typeof paramValue === "string" ? paramValue + char : char;
          break;
        case "collect-quoted-string":
          if (char === '"') {
            storeParam(params, paramName, paramValue);
            parserMode = "ignore-input-until-next-param";
            paramName = "";
            paramValue = null;
            continue;
          }
          if (char === "\\") {
            continue;
          }
          paramValue = typeof paramValue === "string" ? paramValue + char : char;
          break;
        case "ignore-input-until-next-param":
          if (char !== ";") {
            continue;
          }
          parserMode = "param-start";
          break;
        default:
          throw new Error(
            `State machine error - unknown parser mode: ${parserMode} `
          );
      }
    }
    if (paramName) {
      storeParam(params, paramName, paramValue);
    }
    if (type.trim() === "" || !HTTPTokenCodePoints.test(type)) {
      throw new TypeError("Invalid type");
    }
    if (subtype.trim() === "" || !HTTPTokenCodePoints.test(subtype)) {
      throw new TypeError("Invalid subtype");
    }
    return {
      type,
      subtype,
      params: Object.fromEntries(params.entries()),
    };
  }

  function storeParam(params, paramName, paramValue) {
    if (
      (paramName &&
        paramName !== "" &&
        !params.has(paramName) &&
        HTTPQuotedString.test(paramValue)) ||
      paramValue === null
    ) {
      params.set(paramName.toLowerCase(), paramValue);
    }
  }

  /**
   * marked v12.0.2 - a markdown parser
   * Copyright (c) 2011-2024, Christopher Jeffrey. (MIT Licensed)
   * https://github.com/markedjs/marked
   */

  /**
   * DO NOT EDIT THIS FILE
   * The code in this file is generated from files in ./src/
   */

  /**
   * Gets the original marked default options.
   */
  function _getDefaults() {
      return {
          async: false,
          breaks: false,
          extensions: null,
          gfm: true,
          hooks: null,
          pedantic: false,
          renderer: null,
          silent: false,
          tokenizer: null,
          walkTokens: null
      };
  }
  let _defaults = _getDefaults();
  function changeDefaults(newDefaults) {
      _defaults = newDefaults;
  }

  /**
   * Helpers
   */
  const escapeTest = /[&<>"']/;
  const escapeReplace = new RegExp(escapeTest.source, 'g');
  const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
  const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
  const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
  };
  const getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape$1(html, encode) {
      if (encode) {
          if (escapeTest.test(html)) {
              return html.replace(escapeReplace, getEscapeReplacement);
          }
      }
      else {
          if (escapeTestNoEncode.test(html)) {
              return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
          }
      }
      return html;
  }
  const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
  function unescape(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
          n = n.toLowerCase();
          if (n === 'colon')
              return ':';
          if (n.charAt(0) === '#') {
              return n.charAt(1) === 'x'
                  ? String.fromCharCode(parseInt(n.substring(2), 16))
                  : String.fromCharCode(+n.substring(1));
          }
          return '';
      });
  }
  const caret = /(^|[^\[])\^/g;
  function edit(regex, opt) {
      let source = typeof regex === 'string' ? regex : regex.source;
      opt = opt || '';
      const obj = {
          replace: (name, val) => {
              let valSource = typeof val === 'string' ? val : val.source;
              valSource = valSource.replace(caret, '$1');
              source = source.replace(name, valSource);
              return obj;
          },
          getRegex: () => {
              return new RegExp(source, opt);
          }
      };
      return obj;
  }
  function cleanUrl(href) {
      try {
          href = encodeURI(href).replace(/%25/g, '%');
      }
      catch (e) {
          return null;
      }
      return href;
  }
  const noopTest = { exec: () => null };
  function splitCells(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false;
          let curr = offset;
          while (--curr >= 0 && str[curr] === '\\')
              escaped = !escaped;
          if (escaped) {
              // odd number of slashes means | is escaped
              // so we leave it alone
              return '|';
          }
          else {
              // add space before unescaped |
              return ' |';
          }
      }), cells = row.split(/ \|/);
      let i = 0;
      // First/last cell in a row cannot be empty if it has no leading/trailing pipe
      if (!cells[0].trim()) {
          cells.shift();
      }
      if (cells.length > 0 && !cells[cells.length - 1].trim()) {
          cells.pop();
      }
      if (count) {
          if (cells.length > count) {
              cells.splice(count);
          }
          else {
              while (cells.length < count)
                  cells.push('');
          }
      }
      for (; i < cells.length; i++) {
          // leading or trailing whitespace is ignored per the gfm spec
          cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
  }
  /**
   * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
   * /c*$/ is vulnerable to REDOS.
   *
   * @param str
   * @param c
   * @param invert Remove suffix of non-c chars instead. Default falsey.
   */
  function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
          return '';
      }
      // Length of suffix matching the invert condition.
      let suffLen = 0;
      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
          const currChar = str.charAt(l - suffLen - 1);
          if (currChar === c && true) {
              suffLen++;
          }
          else {
              break;
          }
      }
      return str.slice(0, l - suffLen);
  }
  function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
          return -1;
      }
      let level = 0;
      for (let i = 0; i < str.length; i++) {
          if (str[i] === '\\') {
              i++;
          }
          else if (str[i] === b[0]) {
              level++;
          }
          else if (str[i] === b[1]) {
              level--;
              if (level < 0) {
                  return i;
              }
          }
      }
      return -1;
  }

  function outputLink(cap, link, raw, lexer) {
      const href = link.href;
      const title = link.title ? escape$1(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');
      if (cap[0].charAt(0) !== '!') {
          lexer.state.inLink = true;
          const token = {
              type: 'link',
              raw,
              href,
              title,
              text,
              tokens: lexer.inlineTokens(text)
          };
          lexer.state.inLink = false;
          return token;
      }
      return {
          type: 'image',
          raw,
          href,
          title,
          text: escape$1(text)
      };
  }
  function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
      if (matchIndentToCode === null) {
          return text;
      }
      const indentToCode = matchIndentToCode[1];
      return text
          .split('\n')
          .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
              return node;
          }
          const [indentInNode] = matchIndentInNode;
          if (indentInNode.length >= indentToCode.length) {
              return node.slice(indentToCode.length);
          }
          return node;
      })
          .join('\n');
  }
  /**
   * Tokenizer
   */
  class _Tokenizer {
      options;
      rules; // set by the lexer
      lexer; // set by the lexer
      constructor(options) {
          this.options = options || _defaults;
      }
      space(src) {
          const cap = this.rules.block.newline.exec(src);
          if (cap && cap[0].length > 0) {
              return {
                  type: 'space',
                  raw: cap[0]
              };
          }
      }
      code(src) {
          const cap = this.rules.block.code.exec(src);
          if (cap) {
              const text = cap[0].replace(/^ {1,4}/gm, '');
              return {
                  type: 'code',
                  raw: cap[0],
                  codeBlockStyle: 'indented',
                  text: !this.options.pedantic
                      ? rtrim(text, '\n')
                      : text
              };
          }
      }
      fences(src) {
          const cap = this.rules.block.fences.exec(src);
          if (cap) {
              const raw = cap[0];
              const text = indentCodeCompensation(raw, cap[3] || '');
              return {
                  type: 'code',
                  raw,
                  lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, '$1') : cap[2],
                  text
              };
          }
      }
      heading(src) {
          const cap = this.rules.block.heading.exec(src);
          if (cap) {
              let text = cap[2].trim();
              // remove trailing #s
              if (/#$/.test(text)) {
                  const trimmed = rtrim(text, '#');
                  if (this.options.pedantic) {
                      text = trimmed.trim();
                  }
                  else if (!trimmed || / $/.test(trimmed)) {
                      // CommonMark requires space before trailing #s
                      text = trimmed.trim();
                  }
              }
              return {
                  type: 'heading',
                  raw: cap[0],
                  depth: cap[1].length,
                  text,
                  tokens: this.lexer.inline(text)
              };
          }
      }
      hr(src) {
          const cap = this.rules.block.hr.exec(src);
          if (cap) {
              return {
                  type: 'hr',
                  raw: cap[0]
              };
          }
      }
      blockquote(src) {
          const cap = this.rules.block.blockquote.exec(src);
          if (cap) {
              // precede setext continuation with 4 spaces so it isn't a setext
              let text = cap[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, '\n    $1');
              text = rtrim(text.replace(/^ *>[ \t]?/gm, ''), '\n');
              const top = this.lexer.state.top;
              this.lexer.state.top = true;
              const tokens = this.lexer.blockTokens(text);
              this.lexer.state.top = top;
              return {
                  type: 'blockquote',
                  raw: cap[0],
                  tokens,
                  text
              };
          }
      }
      list(src) {
          let cap = this.rules.block.list.exec(src);
          if (cap) {
              let bull = cap[1].trim();
              const isordered = bull.length > 1;
              const list = {
                  type: 'list',
                  raw: '',
                  ordered: isordered,
                  start: isordered ? +bull.slice(0, -1) : '',
                  loose: false,
                  items: []
              };
              bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
              if (this.options.pedantic) {
                  bull = isordered ? bull : '[*+-]';
              }
              // Get next list item
              const itemRegex = new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`);
              let raw = '';
              let itemContents = '';
              let endsWithBlankLine = false;
              // Check if current bullet point can start a new List Item
              while (src) {
                  let endEarly = false;
                  if (!(cap = itemRegex.exec(src))) {
                      break;
                  }
                  if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
                      break;
                  }
                  raw = cap[0];
                  src = src.substring(raw.length);
                  let line = cap[2].split('\n', 1)[0].replace(/^\t+/, (t) => ' '.repeat(3 * t.length));
                  let nextLine = src.split('\n', 1)[0];
                  let indent = 0;
                  if (this.options.pedantic) {
                      indent = 2;
                      itemContents = line.trimStart();
                  }
                  else {
                      indent = cap[2].search(/[^ ]/); // Find first non-space char
                      indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
                      itemContents = line.slice(indent);
                      indent += cap[1].length;
                  }
                  let blankLine = false;
                  if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
                      raw += nextLine + '\n';
                      src = src.substring(nextLine.length + 1);
                      endEarly = true;
                  }
                  if (!endEarly) {
                      const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`);
                      const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
                      const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
                      const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
                      // Check if following lines should be included in List Item
                      while (src) {
                          const rawLine = src.split('\n', 1)[0];
                          nextLine = rawLine;
                          // Re-align to follow commonmark nesting rules
                          if (this.options.pedantic) {
                              nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
                          }
                          // End list item if found code fences
                          if (fencesBeginRegex.test(nextLine)) {
                              break;
                          }
                          // End list item if found start of new heading
                          if (headingBeginRegex.test(nextLine)) {
                              break;
                          }
                          // End list item if found start of new bullet
                          if (nextBulletRegex.test(nextLine)) {
                              break;
                          }
                          // Horizontal rule found
                          if (hrRegex.test(src)) {
                              break;
                          }
                          if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) { // Dedent if possible
                              itemContents += '\n' + nextLine.slice(indent);
                          }
                          else {
                              // not enough indentation
                              if (blankLine) {
                                  break;
                              }
                              // paragraph continuation unless last line was a different block level element
                              if (line.search(/[^ ]/) >= 4) { // indented code block
                                  break;
                              }
                              if (fencesBeginRegex.test(line)) {
                                  break;
                              }
                              if (headingBeginRegex.test(line)) {
                                  break;
                              }
                              if (hrRegex.test(line)) {
                                  break;
                              }
                              itemContents += '\n' + nextLine;
                          }
                          if (!blankLine && !nextLine.trim()) { // Check if current line is blank
                              blankLine = true;
                          }
                          raw += rawLine + '\n';
                          src = src.substring(rawLine.length + 1);
                          line = nextLine.slice(indent);
                      }
                  }
                  if (!list.loose) {
                      // If the previous item ended with a blank line, the list is loose
                      if (endsWithBlankLine) {
                          list.loose = true;
                      }
                      else if (/\n *\n *$/.test(raw)) {
                          endsWithBlankLine = true;
                      }
                  }
                  let istask = null;
                  let ischecked;
                  // Check for task list items
                  if (this.options.gfm) {
                      istask = /^\[[ xX]\] /.exec(itemContents);
                      if (istask) {
                          ischecked = istask[0] !== '[ ] ';
                          itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
                      }
                  }
                  list.items.push({
                      type: 'list_item',
                      raw,
                      task: !!istask,
                      checked: ischecked,
                      loose: false,
                      text: itemContents,
                      tokens: []
                  });
                  list.raw += raw;
              }
              // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
              list.items[list.items.length - 1].raw = raw.trimEnd();
              (list.items[list.items.length - 1]).text = itemContents.trimEnd();
              list.raw = list.raw.trimEnd();
              // Item child tokens handled here at end because we needed to have the final item to trim it first
              for (let i = 0; i < list.items.length; i++) {
                  this.lexer.state.top = false;
                  list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
                  if (!list.loose) {
                      // Check if list should be loose
                      const spacers = list.items[i].tokens.filter(t => t.type === 'space');
                      const hasMultipleLineBreaks = spacers.length > 0 && spacers.some(t => /\n.*\n/.test(t.raw));
                      list.loose = hasMultipleLineBreaks;
                  }
              }
              // Set all items to loose if list is loose
              if (list.loose) {
                  for (let i = 0; i < list.items.length; i++) {
                      list.items[i].loose = true;
                  }
              }
              return list;
          }
      }
      html(src) {
          const cap = this.rules.block.html.exec(src);
          if (cap) {
              const token = {
                  type: 'html',
                  block: true,
                  raw: cap[0],
                  pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
                  text: cap[0]
              };
              return token;
          }
      }
      def(src) {
          const cap = this.rules.block.def.exec(src);
          if (cap) {
              const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
              const href = cap[2] ? cap[2].replace(/^<(.*)>$/, '$1').replace(this.rules.inline.anyPunctuation, '$1') : '';
              const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, '$1') : cap[3];
              return {
                  type: 'def',
                  tag,
                  raw: cap[0],
                  href,
                  title
              };
          }
      }
      table(src) {
          const cap = this.rules.block.table.exec(src);
          if (!cap) {
              return;
          }
          if (!/[:|]/.test(cap[2])) {
              // delimiter row must have a pipe (|) or colon (:) otherwise it is a setext heading
              return;
          }
          const headers = splitCells(cap[1]);
          const aligns = cap[2].replace(/^\||\| *$/g, '').split('|');
          const rows = cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : [];
          const item = {
              type: 'table',
              raw: cap[0],
              header: [],
              align: [],
              rows: []
          };
          if (headers.length !== aligns.length) {
              // header and align columns must be equal, rows can be different.
              return;
          }
          for (const align of aligns) {
              if (/^ *-+: *$/.test(align)) {
                  item.align.push('right');
              }
              else if (/^ *:-+: *$/.test(align)) {
                  item.align.push('center');
              }
              else if (/^ *:-+ *$/.test(align)) {
                  item.align.push('left');
              }
              else {
                  item.align.push(null);
              }
          }
          for (const header of headers) {
              item.header.push({
                  text: header,
                  tokens: this.lexer.inline(header)
              });
          }
          for (const row of rows) {
              item.rows.push(splitCells(row, item.header.length).map(cell => {
                  return {
                      text: cell,
                      tokens: this.lexer.inline(cell)
                  };
              }));
          }
          return item;
      }
      lheading(src) {
          const cap = this.rules.block.lheading.exec(src);
          if (cap) {
              return {
                  type: 'heading',
                  raw: cap[0],
                  depth: cap[2].charAt(0) === '=' ? 1 : 2,
                  text: cap[1],
                  tokens: this.lexer.inline(cap[1])
              };
          }
      }
      paragraph(src) {
          const cap = this.rules.block.paragraph.exec(src);
          if (cap) {
              const text = cap[1].charAt(cap[1].length - 1) === '\n'
                  ? cap[1].slice(0, -1)
                  : cap[1];
              return {
                  type: 'paragraph',
                  raw: cap[0],
                  text,
                  tokens: this.lexer.inline(text)
              };
          }
      }
      text(src) {
          const cap = this.rules.block.text.exec(src);
          if (cap) {
              return {
                  type: 'text',
                  raw: cap[0],
                  text: cap[0],
                  tokens: this.lexer.inline(cap[0])
              };
          }
      }
      escape(src) {
          const cap = this.rules.inline.escape.exec(src);
          if (cap) {
              return {
                  type: 'escape',
                  raw: cap[0],
                  text: escape$1(cap[1])
              };
          }
      }
      tag(src) {
          const cap = this.rules.inline.tag.exec(src);
          if (cap) {
              if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
                  this.lexer.state.inLink = true;
              }
              else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
                  this.lexer.state.inLink = false;
              }
              if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                  this.lexer.state.inRawBlock = true;
              }
              else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                  this.lexer.state.inRawBlock = false;
              }
              return {
                  type: 'html',
                  raw: cap[0],
                  inLink: this.lexer.state.inLink,
                  inRawBlock: this.lexer.state.inRawBlock,
                  block: false,
                  text: cap[0]
              };
          }
      }
      link(src) {
          const cap = this.rules.inline.link.exec(src);
          if (cap) {
              const trimmedUrl = cap[2].trim();
              if (!this.options.pedantic && /^</.test(trimmedUrl)) {
                  // commonmark requires matching angle brackets
                  if (!(/>$/.test(trimmedUrl))) {
                      return;
                  }
                  // ending angle bracket cannot be escaped
                  const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
                  if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                      return;
                  }
              }
              else {
                  // find closing parenthesis
                  const lastParenIndex = findClosingBracket(cap[2], '()');
                  if (lastParenIndex > -1) {
                      const start = cap[0].indexOf('!') === 0 ? 5 : 4;
                      const linkLen = start + cap[1].length + lastParenIndex;
                      cap[2] = cap[2].substring(0, lastParenIndex);
                      cap[0] = cap[0].substring(0, linkLen).trim();
                      cap[3] = '';
                  }
              }
              let href = cap[2];
              let title = '';
              if (this.options.pedantic) {
                  // split pedantic href and title
                  const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
                  if (link) {
                      href = link[1];
                      title = link[3];
                  }
              }
              else {
                  title = cap[3] ? cap[3].slice(1, -1) : '';
              }
              href = href.trim();
              if (/^</.test(href)) {
                  if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
                      // pedantic allows starting angle bracket without ending angle bracket
                      href = href.slice(1);
                  }
                  else {
                      href = href.slice(1, -1);
                  }
              }
              return outputLink(cap, {
                  href: href ? href.replace(this.rules.inline.anyPunctuation, '$1') : href,
                  title: title ? title.replace(this.rules.inline.anyPunctuation, '$1') : title
              }, cap[0], this.lexer);
          }
      }
      reflink(src, links) {
          let cap;
          if ((cap = this.rules.inline.reflink.exec(src))
              || (cap = this.rules.inline.nolink.exec(src))) {
              const linkString = (cap[2] || cap[1]).replace(/\s+/g, ' ');
              const link = links[linkString.toLowerCase()];
              if (!link) {
                  const text = cap[0].charAt(0);
                  return {
                      type: 'text',
                      raw: text,
                      text
                  };
              }
              return outputLink(cap, link, cap[0], this.lexer);
          }
      }
      emStrong(src, maskedSrc, prevChar = '') {
          let match = this.rules.inline.emStrongLDelim.exec(src);
          if (!match)
              return;
          // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
          if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
              return;
          const nextChar = match[1] || match[2] || '';
          if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
              // unicode Regex counts emoji as 1 char; spread into array for proper count (used multiple times below)
              const lLength = [...match[0]].length - 1;
              let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
              const endReg = match[0][0] === '*' ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
              endReg.lastIndex = 0;
              // Clip maskedSrc to same section of string as src (move to lexer?)
              maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
              while ((match = endReg.exec(maskedSrc)) != null) {
                  rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
                  if (!rDelim)
                      continue; // skip single * in __abc*abc__
                  rLength = [...rDelim].length;
                  if (match[3] || match[4]) { // found another Left Delim
                      delimTotal += rLength;
                      continue;
                  }
                  else if (match[5] || match[6]) { // either Left or Right Delim
                      if (lLength % 3 && !((lLength + rLength) % 3)) {
                          midDelimTotal += rLength;
                          continue; // CommonMark Emphasis Rules 9-10
                      }
                  }
                  delimTotal -= rLength;
                  if (delimTotal > 0)
                      continue; // Haven't found enough closing delimiters
                  // Remove extra characters. *a*** -> *a*
                  rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
                  // char length can be >1 for unicode characters;
                  const lastCharLength = [...match[0]][0].length;
                  const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
                  // Create `em` if smallest delimiter has odd char count. *a***
                  if (Math.min(lLength, rLength) % 2) {
                      const text = raw.slice(1, -1);
                      return {
                          type: 'em',
                          raw,
                          text,
                          tokens: this.lexer.inlineTokens(text)
                      };
                  }
                  // Create 'strong' if smallest delimiter has even char count. **a***
                  const text = raw.slice(2, -2);
                  return {
                      type: 'strong',
                      raw,
                      text,
                      tokens: this.lexer.inlineTokens(text)
                  };
              }
          }
      }
      codespan(src) {
          const cap = this.rules.inline.code.exec(src);
          if (cap) {
              let text = cap[2].replace(/\n/g, ' ');
              const hasNonSpaceChars = /[^ ]/.test(text);
              const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
              if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
                  text = text.substring(1, text.length - 1);
              }
              text = escape$1(text, true);
              return {
                  type: 'codespan',
                  raw: cap[0],
                  text
              };
          }
      }
      br(src) {
          const cap = this.rules.inline.br.exec(src);
          if (cap) {
              return {
                  type: 'br',
                  raw: cap[0]
              };
          }
      }
      del(src) {
          const cap = this.rules.inline.del.exec(src);
          if (cap) {
              return {
                  type: 'del',
                  raw: cap[0],
                  text: cap[2],
                  tokens: this.lexer.inlineTokens(cap[2])
              };
          }
      }
      autolink(src) {
          const cap = this.rules.inline.autolink.exec(src);
          if (cap) {
              let text, href;
              if (cap[2] === '@') {
                  text = escape$1(cap[1]);
                  href = 'mailto:' + text;
              }
              else {
                  text = escape$1(cap[1]);
                  href = text;
              }
              return {
                  type: 'link',
                  raw: cap[0],
                  text,
                  href,
                  tokens: [
                      {
                          type: 'text',
                          raw: text,
                          text
                      }
                  ]
              };
          }
      }
      url(src) {
          let cap;
          if (cap = this.rules.inline.url.exec(src)) {
              let text, href;
              if (cap[2] === '@') {
                  text = escape$1(cap[0]);
                  href = 'mailto:' + text;
              }
              else {
                  // do extended autolink path validation
                  let prevCapZero;
                  do {
                      prevCapZero = cap[0];
                      cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? '';
                  } while (prevCapZero !== cap[0]);
                  text = escape$1(cap[0]);
                  if (cap[1] === 'www.') {
                      href = 'http://' + cap[0];
                  }
                  else {
                      href = cap[0];
                  }
              }
              return {
                  type: 'link',
                  raw: cap[0],
                  text,
                  href,
                  tokens: [
                      {
                          type: 'text',
                          raw: text,
                          text
                      }
                  ]
              };
          }
      }
      inlineText(src) {
          const cap = this.rules.inline.text.exec(src);
          if (cap) {
              let text;
              if (this.lexer.state.inRawBlock) {
                  text = cap[0];
              }
              else {
                  text = escape$1(cap[0]);
              }
              return {
                  type: 'text',
                  raw: cap[0],
                  text
              };
          }
      }
  }

  /**
   * Block-Level Grammar
   */
  const newline = /^(?: *(?:\n|$))+/;
  const blockCode = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/;
  const fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  const hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  const heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  const bullet = /(?:[*+-]|\d{1,9}[.)])/;
  const lheading = edit(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/)
      .replace(/bull/g, bullet) // lists can interrupt
      .replace(/blockCode/g, / {4}/) // indented code blocks can interrupt
      .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/) // fenced code blocks can interrupt
      .replace(/blockquote/g, / {0,3}>/) // blockquote can interrupt
      .replace(/heading/g, / {0,3}#{1,6}/) // ATX heading can interrupt
      .replace(/html/g, / {0,3}<[^\n>]+>\n/) // block html can interrupt
      .getRegex();
  const _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  const blockText = /^[^\n]+/;
  const _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
  const def = edit(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/)
      .replace('label', _blockLabel)
      .replace('title', /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/)
      .getRegex();
  const list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/)
      .replace(/bull/g, bullet)
      .getRegex();
  const _tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title'
      + '|tr|track|ul';
  const _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  const html$1 = edit('^ {0,3}(?:' // optional indentation
      + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
      + '|comment[^\\n]*(\\n+|$)' // (2)
      + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
      + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
      + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
      + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
      + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
      + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
      + ')', 'i')
      .replace('comment', _comment)
      .replace('tag', _tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();
  const paragraph = edit(_paragraph)
      .replace('hr', hr)
      .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
      .replace('|lheading', '') // setext headings don't interrupt commonmark paragraphs
      .replace('|table', '')
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', _tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
  const blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
      .replace('paragraph', paragraph)
      .getRegex();
  /**
   * Normal Block Grammar
   */
  const blockNormal = {
      blockquote,
      code: blockCode,
      def,
      fences,
      heading,
      hr,
      html: html$1,
      lheading,
      list,
      newline,
      paragraph,
      table: noopTest,
      text: blockText
  };
  /**
   * GFM Block Grammar
   */
  const gfmTable = edit('^ *([^\\n ].*)\\n' // Header
      + ' {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)' // Align
      + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)') // Cells
      .replace('hr', hr)
      .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', _tag) // tables can be interrupted by type (6) html blocks
      .getRegex();
  const blockGfm = {
      ...blockNormal,
      table: gfmTable,
      paragraph: edit(_paragraph)
          .replace('hr', hr)
          .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
          .replace('|lheading', '') // setext headings don't interrupt commonmark paragraphs
          .replace('table', gfmTable) // interrupt paragraphs with table
          .replace('blockquote', ' {0,3}>')
          .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
          .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
          .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
          .replace('tag', _tag) // pars can be interrupted by type (6) html blocks
          .getRegex()
  };
  /**
   * Pedantic grammar (original John Gruber's loose markdown specification)
   */
  const blockPedantic = {
      ...blockNormal,
      html: edit('^ *(?:comment *(?:\\n|\\s*$)'
          + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
          + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
          .replace('comment', _comment)
          .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
          .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest, // fences not supported
      lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      paragraph: edit(_paragraph)
          .replace('hr', hr)
          .replace('heading', ' *#{1,6} *[^\n]')
          .replace('lheading', lheading)
          .replace('|table', '')
          .replace('blockquote', ' {0,3}>')
          .replace('|fences', '')
          .replace('|list', '')
          .replace('|html', '')
          .replace('|tag', '')
          .getRegex()
  };
  /**
   * Inline-Level Grammar
   */
  const escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  const inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  const br = /^( {2,}|\\)\n(?!\s*$)/;
  const inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  // list of unicode punctuation marks, plus any missing characters from CommonMark spec
  const _punctuation = '\\p{P}\\p{S}';
  const punctuation = edit(/^((?![*_])[\spunctuation])/, 'u')
      .replace(/punctuation/g, _punctuation).getRegex();
  // sequences em should skip over [title](link), `code`, <html>
  const blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;
  const emStrongLDelim = edit(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, 'u')
      .replace(/punct/g, _punctuation)
      .getRegex();
  const emStrongRDelimAst = edit('^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)' // Skip orphan inside strong
      + '|[^*]+(?=[^*])' // Consume to delim
      + '|(?!\\*)[punct](\\*+)(?=[\\s]|$)' // (1) #*** can only be a Right Delimiter
      + '|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)' // (2) a***#, a*** can only be a Right Delimiter
      + '|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])' // (3) #***a, ***a can only be Left Delimiter
      + '|[\\s](\\*+)(?!\\*)(?=[punct])' // (4) ***# can only be Left Delimiter
      + '|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])' // (5) #***# can be either Left or Right Delimiter
      + '|[^punct\\s](\\*+)(?=[^punct\\s])', 'gu') // (6) a***a can be either Left or Right Delimiter
      .replace(/punct/g, _punctuation)
      .getRegex();
  // (6) Not allowed for _
  const emStrongRDelimUnd = edit('^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)' // Skip orphan inside strong
      + '|[^_]+(?=[^_])' // Consume to delim
      + '|(?!_)[punct](_+)(?=[\\s]|$)' // (1) #___ can only be a Right Delimiter
      + '|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)' // (2) a___#, a___ can only be a Right Delimiter
      + '|(?!_)[punct\\s](_+)(?=[^punct\\s])' // (3) #___a, ___a can only be Left Delimiter
      + '|[\\s](_+)(?!_)(?=[punct])' // (4) ___# can only be Left Delimiter
      + '|(?!_)[punct](_+)(?!_)(?=[punct])', 'gu') // (5) #___# can be either Left or Right Delimiter
      .replace(/punct/g, _punctuation)
      .getRegex();
  const anyPunctuation = edit(/\\([punct])/, 'gu')
      .replace(/punct/g, _punctuation)
      .getRegex();
  const autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
      .replace('scheme', /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
      .replace('email', /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/)
      .getRegex();
  const _inlineComment = edit(_comment).replace('(?:-->|$)', '-->').getRegex();
  const tag = edit('^comment'
      + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
      + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
      + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
      + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
      + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>') // CDATA section
      .replace('comment', _inlineComment)
      .replace('attribute', /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/)
      .getRegex();
  const _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  const link$2 = edit(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/)
      .replace('label', _inlineLabel)
      .replace('href', /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/)
      .replace('title', /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/)
      .getRegex();
  const reflink = edit(/^!?\[(label)\]\[(ref)\]/)
      .replace('label', _inlineLabel)
      .replace('ref', _blockLabel)
      .getRegex();
  const nolink = edit(/^!?\[(ref)\](?:\[\])?/)
      .replace('ref', _blockLabel)
      .getRegex();
  const reflinkSearch = edit('reflink|nolink(?!\\()', 'g')
      .replace('reflink', reflink)
      .replace('nolink', nolink)
      .getRegex();
  /**
   * Normal Inline Grammar
   */
  const inlineNormal = {
      _backpedal: noopTest, // only used for GFM url
      anyPunctuation,
      autolink,
      blockSkip,
      br,
      code: inlineCode,
      del: noopTest,
      emStrongLDelim,
      emStrongRDelimAst,
      emStrongRDelimUnd,
      escape,
      link: link$2,
      nolink,
      punctuation,
      reflink,
      reflinkSearch,
      tag,
      text: inlineText,
      url: noopTest
  };
  /**
   * Pedantic Inline Grammar
   */
  const inlinePedantic = {
      ...inlineNormal,
      link: edit(/^!?\[(label)\]\((.*?)\)/)
          .replace('label', _inlineLabel)
          .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
          .replace('label', _inlineLabel)
          .getRegex()
  };
  /**
   * GFM Inline Grammar
   */
  const inlineGfm = {
      ...inlineNormal,
      escape: edit(escape).replace('])', '~|])').getRegex(),
      url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, 'i')
          .replace('email', /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/)
          .getRegex(),
      _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  };
  /**
   * GFM + Line Breaks Inline Grammar
   */
  const inlineBreaks = {
      ...inlineGfm,
      br: edit(br).replace('{2,}', '*').getRegex(),
      text: edit(inlineGfm.text)
          .replace('\\b_', '\\b_| {2,}\\n')
          .replace(/\{2,\}/g, '*')
          .getRegex()
  };
  /**
   * exports
   */
  const block = {
      normal: blockNormal,
      gfm: blockGfm,
      pedantic: blockPedantic
  };
  const inline = {
      normal: inlineNormal,
      gfm: inlineGfm,
      breaks: inlineBreaks,
      pedantic: inlinePedantic
  };

  /**
   * Block Lexer
   */
  class _Lexer {
      tokens;
      options;
      state;
      tokenizer;
      inlineQueue;
      constructor(options) {
          // TokenList cannot be created in one go
          this.tokens = [];
          this.tokens.links = Object.create(null);
          this.options = options || _defaults;
          this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
          this.tokenizer = this.options.tokenizer;
          this.tokenizer.options = this.options;
          this.tokenizer.lexer = this;
          this.inlineQueue = [];
          this.state = {
              inLink: false,
              inRawBlock: false,
              top: true
          };
          const rules = {
              block: block.normal,
              inline: inline.normal
          };
          if (this.options.pedantic) {
              rules.block = block.pedantic;
              rules.inline = inline.pedantic;
          }
          else if (this.options.gfm) {
              rules.block = block.gfm;
              if (this.options.breaks) {
                  rules.inline = inline.breaks;
              }
              else {
                  rules.inline = inline.gfm;
              }
          }
          this.tokenizer.rules = rules;
      }
      /**
       * Expose Rules
       */
      static get rules() {
          return {
              block,
              inline
          };
      }
      /**
       * Static Lex Method
       */
      static lex(src, options) {
          const lexer = new _Lexer(options);
          return lexer.lex(src);
      }
      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
          const lexer = new _Lexer(options);
          return lexer.inlineTokens(src);
      }
      /**
       * Preprocessing
       */
      lex(src) {
          src = src
              .replace(/\r\n|\r/g, '\n');
          this.blockTokens(src, this.tokens);
          for (let i = 0; i < this.inlineQueue.length; i++) {
              const next = this.inlineQueue[i];
              this.inlineTokens(next.src, next.tokens);
          }
          this.inlineQueue = [];
          return this.tokens;
      }
      blockTokens(src, tokens = []) {
          if (this.options.pedantic) {
              src = src.replace(/\t/g, '    ').replace(/^ +$/gm, '');
          }
          else {
              src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
                  return leading + '    '.repeat(tabs.length);
              });
          }
          let token;
          let lastToken;
          let cutSrc;
          let lastParagraphClipped;
          while (src) {
              if (this.options.extensions
                  && this.options.extensions.block
                  && this.options.extensions.block.some((extTokenizer) => {
                      if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                          src = src.substring(token.raw.length);
                          tokens.push(token);
                          return true;
                      }
                      return false;
                  })) {
                  continue;
              }
              // newline
              if (token = this.tokenizer.space(src)) {
                  src = src.substring(token.raw.length);
                  if (token.raw.length === 1 && tokens.length > 0) {
                      // if there's a single \n as a spacer, it's terminating the last line,
                      // so move it there so that we don't get unnecessary paragraph tags
                      tokens[tokens.length - 1].raw += '\n';
                  }
                  else {
                      tokens.push(token);
                  }
                  continue;
              }
              // code
              if (token = this.tokenizer.code(src)) {
                  src = src.substring(token.raw.length);
                  lastToken = tokens[tokens.length - 1];
                  // An indented code block cannot interrupt a paragraph.
                  if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
                      lastToken.raw += '\n' + token.raw;
                      lastToken.text += '\n' + token.text;
                      this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
                  }
                  else {
                      tokens.push(token);
                  }
                  continue;
              }
              // fences
              if (token = this.tokenizer.fences(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // heading
              if (token = this.tokenizer.heading(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // hr
              if (token = this.tokenizer.hr(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // blockquote
              if (token = this.tokenizer.blockquote(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // list
              if (token = this.tokenizer.list(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // html
              if (token = this.tokenizer.html(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // def
              if (token = this.tokenizer.def(src)) {
                  src = src.substring(token.raw.length);
                  lastToken = tokens[tokens.length - 1];
                  if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
                      lastToken.raw += '\n' + token.raw;
                      lastToken.text += '\n' + token.raw;
                      this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
                  }
                  else if (!this.tokens.links[token.tag]) {
                      this.tokens.links[token.tag] = {
                          href: token.href,
                          title: token.title
                      };
                  }
                  continue;
              }
              // table (gfm)
              if (token = this.tokenizer.table(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // lheading
              if (token = this.tokenizer.lheading(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // top-level paragraph
              // prevent paragraph consuming extensions by clipping 'src' to extension start
              cutSrc = src;
              if (this.options.extensions && this.options.extensions.startBlock) {
                  let startIndex = Infinity;
                  const tempSrc = src.slice(1);
                  let tempStart;
                  this.options.extensions.startBlock.forEach((getStartIndex) => {
                      tempStart = getStartIndex.call({ lexer: this }, tempSrc);
                      if (typeof tempStart === 'number' && tempStart >= 0) {
                          startIndex = Math.min(startIndex, tempStart);
                      }
                  });
                  if (startIndex < Infinity && startIndex >= 0) {
                      cutSrc = src.substring(0, startIndex + 1);
                  }
              }
              if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
                  lastToken = tokens[tokens.length - 1];
                  if (lastParagraphClipped && lastToken.type === 'paragraph') {
                      lastToken.raw += '\n' + token.raw;
                      lastToken.text += '\n' + token.text;
                      this.inlineQueue.pop();
                      this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
                  }
                  else {
                      tokens.push(token);
                  }
                  lastParagraphClipped = (cutSrc.length !== src.length);
                  src = src.substring(token.raw.length);
                  continue;
              }
              // text
              if (token = this.tokenizer.text(src)) {
                  src = src.substring(token.raw.length);
                  lastToken = tokens[tokens.length - 1];
                  if (lastToken && lastToken.type === 'text') {
                      lastToken.raw += '\n' + token.raw;
                      lastToken.text += '\n' + token.text;
                      this.inlineQueue.pop();
                      this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
                  }
                  else {
                      tokens.push(token);
                  }
                  continue;
              }
              if (src) {
                  const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
                  if (this.options.silent) {
                      console.error(errMsg);
                      break;
                  }
                  else {
                      throw new Error(errMsg);
                  }
              }
          }
          this.state.top = true;
          return tokens;
      }
      inline(src, tokens = []) {
          this.inlineQueue.push({ src, tokens });
          return tokens;
      }
      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = []) {
          let token, lastToken, cutSrc;
          // String with links masked to avoid interference with em and strong
          let maskedSrc = src;
          let match;
          let keepPrevChar, prevChar;
          // Mask out reflinks
          if (this.tokens.links) {
              const links = Object.keys(this.tokens.links);
              if (links.length > 0) {
                  while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
                      if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                          maskedSrc = maskedSrc.slice(0, match.index) + '[' + 'a'.repeat(match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                      }
                  }
              }
          }
          // Mask out other blocks
          while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
              maskedSrc = maskedSrc.slice(0, match.index) + '[' + 'a'.repeat(match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
          }
          // Mask out escaped characters
          while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
              maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
          }
          while (src) {
              if (!keepPrevChar) {
                  prevChar = '';
              }
              keepPrevChar = false;
              // extensions
              if (this.options.extensions
                  && this.options.extensions.inline
                  && this.options.extensions.inline.some((extTokenizer) => {
                      if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                          src = src.substring(token.raw.length);
                          tokens.push(token);
                          return true;
                      }
                      return false;
                  })) {
                  continue;
              }
              // escape
              if (token = this.tokenizer.escape(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // tag
              if (token = this.tokenizer.tag(src)) {
                  src = src.substring(token.raw.length);
                  lastToken = tokens[tokens.length - 1];
                  if (lastToken && token.type === 'text' && lastToken.type === 'text') {
                      lastToken.raw += token.raw;
                      lastToken.text += token.text;
                  }
                  else {
                      tokens.push(token);
                  }
                  continue;
              }
              // link
              if (token = this.tokenizer.link(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // reflink, nolink
              if (token = this.tokenizer.reflink(src, this.tokens.links)) {
                  src = src.substring(token.raw.length);
                  lastToken = tokens[tokens.length - 1];
                  if (lastToken && token.type === 'text' && lastToken.type === 'text') {
                      lastToken.raw += token.raw;
                      lastToken.text += token.text;
                  }
                  else {
                      tokens.push(token);
                  }
                  continue;
              }
              // em & strong
              if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // code
              if (token = this.tokenizer.codespan(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // br
              if (token = this.tokenizer.br(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // del (gfm)
              if (token = this.tokenizer.del(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // autolink
              if (token = this.tokenizer.autolink(src)) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // url (gfm)
              if (!this.state.inLink && (token = this.tokenizer.url(src))) {
                  src = src.substring(token.raw.length);
                  tokens.push(token);
                  continue;
              }
              // text
              // prevent inlineText consuming extensions by clipping 'src' to extension start
              cutSrc = src;
              if (this.options.extensions && this.options.extensions.startInline) {
                  let startIndex = Infinity;
                  const tempSrc = src.slice(1);
                  let tempStart;
                  this.options.extensions.startInline.forEach((getStartIndex) => {
                      tempStart = getStartIndex.call({ lexer: this }, tempSrc);
                      if (typeof tempStart === 'number' && tempStart >= 0) {
                          startIndex = Math.min(startIndex, tempStart);
                      }
                  });
                  if (startIndex < Infinity && startIndex >= 0) {
                      cutSrc = src.substring(0, startIndex + 1);
                  }
              }
              if (token = this.tokenizer.inlineText(cutSrc)) {
                  src = src.substring(token.raw.length);
                  if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
                      prevChar = token.raw.slice(-1);
                  }
                  keepPrevChar = true;
                  lastToken = tokens[tokens.length - 1];
                  if (lastToken && lastToken.type === 'text') {
                      lastToken.raw += token.raw;
                      lastToken.text += token.text;
                  }
                  else {
                      tokens.push(token);
                  }
                  continue;
              }
              if (src) {
                  const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
                  if (this.options.silent) {
                      console.error(errMsg);
                      break;
                  }
                  else {
                      throw new Error(errMsg);
                  }
              }
          }
          return tokens;
      }
  }

  /**
   * Renderer
   */
  class _Renderer {
      options;
      constructor(options) {
          this.options = options || _defaults;
      }
      code(code, infostring, escaped) {
          const lang = (infostring || '').match(/^\S*/)?.[0];
          code = code.replace(/\n$/, '') + '\n';
          if (!lang) {
              return '<pre><code>'
                  + (escaped ? code : escape$1(code, true))
                  + '</code></pre>\n';
          }
          return '<pre><code class="language-'
              + escape$1(lang)
              + '">'
              + (escaped ? code : escape$1(code, true))
              + '</code></pre>\n';
      }
      blockquote(quote) {
          return `<blockquote>\n${quote}</blockquote>\n`;
      }
      html(html, block) {
          return html;
      }
      heading(text, level, raw) {
          // ignore IDs
          return `<h${level}>${text}</h${level}>\n`;
      }
      hr() {
          return '<hr>\n';
      }
      list(body, ordered, start) {
          const type = ordered ? 'ol' : 'ul';
          const startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
          return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }
      listitem(text, task, checked) {
          return `<li>${text}</li>\n`;
      }
      checkbox(checked) {
          return '<input '
              + (checked ? 'checked="" ' : '')
              + 'disabled="" type="checkbox">';
      }
      paragraph(text) {
          return `<p>${text}</p>\n`;
      }
      table(header, body) {
          if (body)
              body = `<tbody>${body}</tbody>`;
          return '<table>\n'
              + '<thead>\n'
              + header
              + '</thead>\n'
              + body
              + '</table>\n';
      }
      tablerow(content) {
          return `<tr>\n${content}</tr>\n`;
      }
      tablecell(content, flags) {
          const type = flags.header ? 'th' : 'td';
          const tag = flags.align
              ? `<${type} align="${flags.align}">`
              : `<${type}>`;
          return tag + content + `</${type}>\n`;
      }
      /**
       * span level renderer
       */
      strong(text) {
          return `<strong>${text}</strong>`;
      }
      em(text) {
          return `<em>${text}</em>`;
      }
      codespan(text) {
          return `<code>${text}</code>`;
      }
      br() {
          return '<br>';
      }
      del(text) {
          return `<del>${text}</del>`;
      }
      link(href, title, text) {
          const cleanHref = cleanUrl(href);
          if (cleanHref === null) {
              return text;
          }
          href = cleanHref;
          let out = '<a href="' + href + '"';
          if (title) {
              out += ' title="' + title + '"';
          }
          out += '>' + text + '</a>';
          return out;
      }
      image(href, title, text) {
          const cleanHref = cleanUrl(href);
          if (cleanHref === null) {
              return text;
          }
          href = cleanHref;
          let out = `<img src="${href}" alt="${text}"`;
          if (title) {
              out += ` title="${title}"`;
          }
          out += '>';
          return out;
      }
      text(text) {
          return text;
      }
  }

  /**
   * TextRenderer
   * returns only the textual part of the token
   */
  class _TextRenderer {
      // no need for block level renderers
      strong(text) {
          return text;
      }
      em(text) {
          return text;
      }
      codespan(text) {
          return text;
      }
      del(text) {
          return text;
      }
      html(text) {
          return text;
      }
      text(text) {
          return text;
      }
      link(href, title, text) {
          return '' + text;
      }
      image(href, title, text) {
          return '' + text;
      }
      br() {
          return '';
      }
  }

  /**
   * Parsing & Compiling
   */
  class _Parser {
      options;
      renderer;
      textRenderer;
      constructor(options) {
          this.options = options || _defaults;
          this.options.renderer = this.options.renderer || new _Renderer();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
          this.textRenderer = new _TextRenderer();
      }
      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
          const parser = new _Parser(options);
          return parser.parse(tokens);
      }
      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
          const parser = new _Parser(options);
          return parser.parseInline(tokens);
      }
      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
          let out = '';
          for (let i = 0; i < tokens.length; i++) {
              const token = tokens[i];
              // Run any renderer extensions
              if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
                  const genericToken = token;
                  const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
                  if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(genericToken.type)) {
                      out += ret || '';
                      continue;
                  }
              }
              switch (token.type) {
                  case 'space': {
                      continue;
                  }
                  case 'hr': {
                      out += this.renderer.hr();
                      continue;
                  }
                  case 'heading': {
                      const headingToken = token;
                      out += this.renderer.heading(this.parseInline(headingToken.tokens), headingToken.depth, unescape(this.parseInline(headingToken.tokens, this.textRenderer)));
                      continue;
                  }
                  case 'code': {
                      const codeToken = token;
                      out += this.renderer.code(codeToken.text, codeToken.lang, !!codeToken.escaped);
                      continue;
                  }
                  case 'table': {
                      const tableToken = token;
                      let header = '';
                      // header
                      let cell = '';
                      for (let j = 0; j < tableToken.header.length; j++) {
                          cell += this.renderer.tablecell(this.parseInline(tableToken.header[j].tokens), { header: true, align: tableToken.align[j] });
                      }
                      header += this.renderer.tablerow(cell);
                      let body = '';
                      for (let j = 0; j < tableToken.rows.length; j++) {
                          const row = tableToken.rows[j];
                          cell = '';
                          for (let k = 0; k < row.length; k++) {
                              cell += this.renderer.tablecell(this.parseInline(row[k].tokens), { header: false, align: tableToken.align[k] });
                          }
                          body += this.renderer.tablerow(cell);
                      }
                      out += this.renderer.table(header, body);
                      continue;
                  }
                  case 'blockquote': {
                      const blockquoteToken = token;
                      const body = this.parse(blockquoteToken.tokens);
                      out += this.renderer.blockquote(body);
                      continue;
                  }
                  case 'list': {
                      const listToken = token;
                      const ordered = listToken.ordered;
                      const start = listToken.start;
                      const loose = listToken.loose;
                      let body = '';
                      for (let j = 0; j < listToken.items.length; j++) {
                          const item = listToken.items[j];
                          const checked = item.checked;
                          const task = item.task;
                          let itemBody = '';
                          if (item.task) {
                              const checkbox = this.renderer.checkbox(!!checked);
                              if (loose) {
                                  if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                                          item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                                      }
                                  }
                                  else {
                                      item.tokens.unshift({
                                          type: 'text',
                                          text: checkbox + ' '
                                      });
                                  }
                              }
                              else {
                                  itemBody += checkbox + ' ';
                              }
                          }
                          itemBody += this.parse(item.tokens, loose);
                          body += this.renderer.listitem(itemBody, task, !!checked);
                      }
                      out += this.renderer.list(body, ordered, start);
                      continue;
                  }
                  case 'html': {
                      const htmlToken = token;
                      out += this.renderer.html(htmlToken.text, htmlToken.block);
                      continue;
                  }
                  case 'paragraph': {
                      const paragraphToken = token;
                      out += this.renderer.paragraph(this.parseInline(paragraphToken.tokens));
                      continue;
                  }
                  case 'text': {
                      let textToken = token;
                      let body = textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text;
                      while (i + 1 < tokens.length && tokens[i + 1].type === 'text') {
                          textToken = tokens[++i];
                          body += '\n' + (textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text);
                      }
                      out += top ? this.renderer.paragraph(body) : body;
                      continue;
                  }
                  default: {
                      const errMsg = 'Token with "' + token.type + '" type was not found.';
                      if (this.options.silent) {
                          console.error(errMsg);
                          return '';
                      }
                      else {
                          throw new Error(errMsg);
                      }
                  }
              }
          }
          return out;
      }
      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
          renderer = renderer || this.renderer;
          let out = '';
          for (let i = 0; i < tokens.length; i++) {
              const token = tokens[i];
              // Run any renderer extensions
              if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
                  const ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
                  if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
                      out += ret || '';
                      continue;
                  }
              }
              switch (token.type) {
                  case 'escape': {
                      const escapeToken = token;
                      out += renderer.text(escapeToken.text);
                      break;
                  }
                  case 'html': {
                      const tagToken = token;
                      out += renderer.html(tagToken.text);
                      break;
                  }
                  case 'link': {
                      const linkToken = token;
                      out += renderer.link(linkToken.href, linkToken.title, this.parseInline(linkToken.tokens, renderer));
                      break;
                  }
                  case 'image': {
                      const imageToken = token;
                      out += renderer.image(imageToken.href, imageToken.title, imageToken.text);
                      break;
                  }
                  case 'strong': {
                      const strongToken = token;
                      out += renderer.strong(this.parseInline(strongToken.tokens, renderer));
                      break;
                  }
                  case 'em': {
                      const emToken = token;
                      out += renderer.em(this.parseInline(emToken.tokens, renderer));
                      break;
                  }
                  case 'codespan': {
                      const codespanToken = token;
                      out += renderer.codespan(codespanToken.text);
                      break;
                  }
                  case 'br': {
                      out += renderer.br();
                      break;
                  }
                  case 'del': {
                      const delToken = token;
                      out += renderer.del(this.parseInline(delToken.tokens, renderer));
                      break;
                  }
                  case 'text': {
                      const textToken = token;
                      out += renderer.text(textToken.text);
                      break;
                  }
                  default: {
                      const errMsg = 'Token with "' + token.type + '" type was not found.';
                      if (this.options.silent) {
                          console.error(errMsg);
                          return '';
                      }
                      else {
                          throw new Error(errMsg);
                      }
                  }
              }
          }
          return out;
      }
  }

  class _Hooks {
      options;
      constructor(options) {
          this.options = options || _defaults;
      }
      static passThroughHooks = new Set([
          'preprocess',
          'postprocess',
          'processAllTokens'
      ]);
      /**
       * Process markdown before marked
       */
      preprocess(markdown) {
          return markdown;
      }
      /**
       * Process HTML after marked is finished
       */
      postprocess(html) {
          return html;
      }
      /**
       * Process all tokens before walk tokens
       */
      processAllTokens(tokens) {
          return tokens;
      }
  }

  class Marked {
      defaults = _getDefaults();
      options = this.setOptions;
      parse = this.#parseMarkdown(_Lexer.lex, _Parser.parse);
      parseInline = this.#parseMarkdown(_Lexer.lexInline, _Parser.parseInline);
      Parser = _Parser;
      Renderer = _Renderer;
      TextRenderer = _TextRenderer;
      Lexer = _Lexer;
      Tokenizer = _Tokenizer;
      Hooks = _Hooks;
      constructor(...args) {
          this.use(...args);
      }
      /**
       * Run callback for every token
       */
      walkTokens(tokens, callback) {
          let values = [];
          for (const token of tokens) {
              values = values.concat(callback.call(this, token));
              switch (token.type) {
                  case 'table': {
                      const tableToken = token;
                      for (const cell of tableToken.header) {
                          values = values.concat(this.walkTokens(cell.tokens, callback));
                      }
                      for (const row of tableToken.rows) {
                          for (const cell of row) {
                              values = values.concat(this.walkTokens(cell.tokens, callback));
                          }
                      }
                      break;
                  }
                  case 'list': {
                      const listToken = token;
                      values = values.concat(this.walkTokens(listToken.items, callback));
                      break;
                  }
                  default: {
                      const genericToken = token;
                      if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
                          this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                              const tokens = genericToken[childTokens].flat(Infinity);
                              values = values.concat(this.walkTokens(tokens, callback));
                          });
                      }
                      else if (genericToken.tokens) {
                          values = values.concat(this.walkTokens(genericToken.tokens, callback));
                      }
                  }
              }
          }
          return values;
      }
      use(...args) {
          const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
          args.forEach((pack) => {
              // copy options to new object
              const opts = { ...pack };
              // set async to true if it was set to true before
              opts.async = this.defaults.async || opts.async || false;
              // ==-- Parse "addon" extensions --== //
              if (pack.extensions) {
                  pack.extensions.forEach((ext) => {
                      if (!ext.name) {
                          throw new Error('extension name required');
                      }
                      if ('renderer' in ext) { // Renderer extensions
                          const prevRenderer = extensions.renderers[ext.name];
                          if (prevRenderer) {
                              // Replace extension with func to run new extension but fall back if false
                              extensions.renderers[ext.name] = function (...args) {
                                  let ret = ext.renderer.apply(this, args);
                                  if (ret === false) {
                                      ret = prevRenderer.apply(this, args);
                                  }
                                  return ret;
                              };
                          }
                          else {
                              extensions.renderers[ext.name] = ext.renderer;
                          }
                      }
                      if ('tokenizer' in ext) { // Tokenizer Extensions
                          if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
                              throw new Error("extension level must be 'block' or 'inline'");
                          }
                          const extLevel = extensions[ext.level];
                          if (extLevel) {
                              extLevel.unshift(ext.tokenizer);
                          }
                          else {
                              extensions[ext.level] = [ext.tokenizer];
                          }
                          if (ext.start) { // Function to check for start of token
                              if (ext.level === 'block') {
                                  if (extensions.startBlock) {
                                      extensions.startBlock.push(ext.start);
                                  }
                                  else {
                                      extensions.startBlock = [ext.start];
                                  }
                              }
                              else if (ext.level === 'inline') {
                                  if (extensions.startInline) {
                                      extensions.startInline.push(ext.start);
                                  }
                                  else {
                                      extensions.startInline = [ext.start];
                                  }
                              }
                          }
                      }
                      if ('childTokens' in ext && ext.childTokens) { // Child tokens to be visited by walkTokens
                          extensions.childTokens[ext.name] = ext.childTokens;
                      }
                  });
                  opts.extensions = extensions;
              }
              // ==-- Parse "overwrite" extensions --== //
              if (pack.renderer) {
                  const renderer = this.defaults.renderer || new _Renderer(this.defaults);
                  for (const prop in pack.renderer) {
                      if (!(prop in renderer)) {
                          throw new Error(`renderer '${prop}' does not exist`);
                      }
                      if (prop === 'options') {
                          // ignore options property
                          continue;
                      }
                      const rendererProp = prop;
                      const rendererFunc = pack.renderer[rendererProp];
                      const prevRenderer = renderer[rendererProp];
                      // Replace renderer with func to run extension, but fall back if false
                      renderer[rendererProp] = (...args) => {
                          let ret = rendererFunc.apply(renderer, args);
                          if (ret === false) {
                              ret = prevRenderer.apply(renderer, args);
                          }
                          return ret || '';
                      };
                  }
                  opts.renderer = renderer;
              }
              if (pack.tokenizer) {
                  const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
                  for (const prop in pack.tokenizer) {
                      if (!(prop in tokenizer)) {
                          throw new Error(`tokenizer '${prop}' does not exist`);
                      }
                      if (['options', 'rules', 'lexer'].includes(prop)) {
                          // ignore options, rules, and lexer properties
                          continue;
                      }
                      const tokenizerProp = prop;
                      const tokenizerFunc = pack.tokenizer[tokenizerProp];
                      const prevTokenizer = tokenizer[tokenizerProp];
                      // Replace tokenizer with func to run extension, but fall back if false
                      // @ts-expect-error cannot type tokenizer function dynamically
                      tokenizer[tokenizerProp] = (...args) => {
                          let ret = tokenizerFunc.apply(tokenizer, args);
                          if (ret === false) {
                              ret = prevTokenizer.apply(tokenizer, args);
                          }
                          return ret;
                      };
                  }
                  opts.tokenizer = tokenizer;
              }
              // ==-- Parse Hooks extensions --== //
              if (pack.hooks) {
                  const hooks = this.defaults.hooks || new _Hooks();
                  for (const prop in pack.hooks) {
                      if (!(prop in hooks)) {
                          throw new Error(`hook '${prop}' does not exist`);
                      }
                      if (prop === 'options') {
                          // ignore options property
                          continue;
                      }
                      const hooksProp = prop;
                      const hooksFunc = pack.hooks[hooksProp];
                      const prevHook = hooks[hooksProp];
                      if (_Hooks.passThroughHooks.has(prop)) {
                          // @ts-expect-error cannot type hook function dynamically
                          hooks[hooksProp] = (arg) => {
                              if (this.defaults.async) {
                                  return Promise.resolve(hooksFunc.call(hooks, arg)).then(ret => {
                                      return prevHook.call(hooks, ret);
                                  });
                              }
                              const ret = hooksFunc.call(hooks, arg);
                              return prevHook.call(hooks, ret);
                          };
                      }
                      else {
                          // @ts-expect-error cannot type hook function dynamically
                          hooks[hooksProp] = (...args) => {
                              let ret = hooksFunc.apply(hooks, args);
                              if (ret === false) {
                                  ret = prevHook.apply(hooks, args);
                              }
                              return ret;
                          };
                      }
                  }
                  opts.hooks = hooks;
              }
              // ==-- Parse WalkTokens extensions --== //
              if (pack.walkTokens) {
                  const walkTokens = this.defaults.walkTokens;
                  const packWalktokens = pack.walkTokens;
                  opts.walkTokens = function (token) {
                      let values = [];
                      values.push(packWalktokens.call(this, token));
                      if (walkTokens) {
                          values = values.concat(walkTokens.call(this, token));
                      }
                      return values;
                  };
              }
              this.defaults = { ...this.defaults, ...opts };
          });
          return this;
      }
      setOptions(opt) {
          this.defaults = { ...this.defaults, ...opt };
          return this;
      }
      lexer(src, options) {
          return _Lexer.lex(src, options ?? this.defaults);
      }
      parser(tokens, options) {
          return _Parser.parse(tokens, options ?? this.defaults);
      }
      #parseMarkdown(lexer, parser) {
          return (src, options) => {
              const origOpt = { ...options };
              const opt = { ...this.defaults, ...origOpt };
              // Show warning if an extension set async to true but the parse was called with async: false
              if (this.defaults.async === true && origOpt.async === false) {
                  if (!opt.silent) {
                      console.warn('marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored.');
                  }
                  opt.async = true;
              }
              const throwError = this.#onError(!!opt.silent, !!opt.async);
              // throw error in case of non string input
              if (typeof src === 'undefined' || src === null) {
                  return throwError(new Error('marked(): input parameter is undefined or null'));
              }
              if (typeof src !== 'string') {
                  return throwError(new Error('marked(): input parameter is of type '
                      + Object.prototype.toString.call(src) + ', string expected'));
              }
              if (opt.hooks) {
                  opt.hooks.options = opt;
              }
              if (opt.async) {
                  return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src)
                      .then(src => lexer(src, opt))
                      .then(tokens => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens)
                      .then(tokens => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens)
                      .then(tokens => parser(tokens, opt))
                      .then(html => opt.hooks ? opt.hooks.postprocess(html) : html)
                      .catch(throwError);
              }
              try {
                  if (opt.hooks) {
                      src = opt.hooks.preprocess(src);
                  }
                  let tokens = lexer(src, opt);
                  if (opt.hooks) {
                      tokens = opt.hooks.processAllTokens(tokens);
                  }
                  if (opt.walkTokens) {
                      this.walkTokens(tokens, opt.walkTokens);
                  }
                  let html = parser(tokens, opt);
                  if (opt.hooks) {
                      html = opt.hooks.postprocess(html);
                  }
                  return html;
              }
              catch (e) {
                  return throwError(e);
              }
          };
      }
      #onError(silent, async) {
          return (e) => {
              e.message += '\nPlease report this to https://github.com/markedjs/marked.';
              if (silent) {
                  const msg = '<p>An error occurred:</p><pre>'
                      + escape$1(e.message + '', true)
                      + '</pre>';
                  if (async) {
                      return Promise.resolve(msg);
                  }
                  return msg;
              }
              if (async) {
                  return Promise.reject(e);
              }
              throw e;
          };
      }
  }

  const markedInstance = new Marked();
  function marked$1(src, opt) {
      return markedInstance.parse(src, opt);
  }
  /**
   * Sets the default options.
   *
   * @param options Hash of options
   */
  marked$1.options =
      marked$1.setOptions = function (options) {
          markedInstance.setOptions(options);
          marked$1.defaults = markedInstance.defaults;
          changeDefaults(marked$1.defaults);
          return marked$1;
      };
  /**
   * Gets the original marked default options.
   */
  marked$1.getDefaults = _getDefaults;
  marked$1.defaults = _defaults;
  /**
   * Use Extension
   */
  marked$1.use = function (...args) {
      markedInstance.use(...args);
      marked$1.defaults = markedInstance.defaults;
      changeDefaults(marked$1.defaults);
      return marked$1;
  };
  /**
   * Run callback for every token
   */
  marked$1.walkTokens = function (tokens, callback) {
      return markedInstance.walkTokens(tokens, callback);
  };
  /**
   * Compiles markdown to HTML without enclosing `p` tag.
   *
   * @param src String of markdown source to be compiled
   * @param options Hash of options
   * @return String of compiled HTML
   */
  marked$1.parseInline = markedInstance.parseInline;
  /**
   * Expose
   */
  marked$1.Parser = _Parser;
  marked$1.parser = _Parser.parse;
  marked$1.Renderer = _Renderer;
  marked$1.TextRenderer = _TextRenderer;
  marked$1.Lexer = _Lexer;
  marked$1.lexer = _Lexer.lex;
  marked$1.Tokenizer = _Tokenizer;
  marked$1.Hooks = _Hooks;
  marked$1.parse = marked$1;
  marked$1.options;
  marked$1.setOptions;
  marked$1.use;
  marked$1.walkTokens;
  marked$1.parseInline;
  _Parser.parse;
  _Lexer.lex;

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function commonjsRequire(path) {
  	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }

  var pluralize$2 = {exports: {}};

  /* global define */
  var pluralize$1$1 = pluralize$2.exports;

  var hasRequiredPluralize;

  function requirePluralize () {
  	if (hasRequiredPluralize) return pluralize$2.exports;
  	hasRequiredPluralize = 1;
  	(function (module, exports) {
  		(function (root, pluralize) {
  		  /* istanbul ignore else */
  		  if (typeof commonjsRequire === 'function' && 'object' === 'object' && 'object' === 'object') {
  		    // Node.
  		    module.exports = pluralize();
  		  } else {
  		    // Browser global.
  		    root.pluralize = pluralize();
  		  }
  		})(pluralize$1$1, function () {
  		  // Rule storage - pluralize and singularize need to be run sequentially,
  		  // while other rules can be optimized using an object for instant lookups.
  		  var pluralRules = [];
  		  var singularRules = [];
  		  var uncountables = {};
  		  var irregularPlurals = {};
  		  var irregularSingles = {};

  		  /**
  		   * Sanitize a pluralization rule to a usable regular expression.
  		   *
  		   * @param  {(RegExp|string)} rule
  		   * @return {RegExp}
  		   */
  		  function sanitizeRule (rule) {
  		    if (typeof rule === 'string') {
  		      return new RegExp('^' + rule + '$', 'i');
  		    }

  		    return rule;
  		  }

  		  /**
  		   * Pass in a word token to produce a function that can replicate the case on
  		   * another word.
  		   *
  		   * @param  {string}   word
  		   * @param  {string}   token
  		   * @return {Function}
  		   */
  		  function restoreCase (word, token) {
  		    // Tokens are an exact match.
  		    if (word === token) return token;

  		    // Lower cased words. E.g. "hello".
  		    if (word === word.toLowerCase()) return token.toLowerCase();

  		    // Upper cased words. E.g. "WHISKY".
  		    if (word === word.toUpperCase()) return token.toUpperCase();

  		    // Title cased words. E.g. "Title".
  		    if (word[0] === word[0].toUpperCase()) {
  		      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
  		    }

  		    // Lower cased words. E.g. "test".
  		    return token.toLowerCase();
  		  }

  		  /**
  		   * Interpolate a regexp string.
  		   *
  		   * @param  {string} str
  		   * @param  {Array}  args
  		   * @return {string}
  		   */
  		  function interpolate (str, args) {
  		    return str.replace(/\$(\d{1,2})/g, function (match, index) {
  		      return args[index] || '';
  		    });
  		  }

  		  /**
  		   * Replace a word using a rule.
  		   *
  		   * @param  {string} word
  		   * @param  {Array}  rule
  		   * @return {string}
  		   */
  		  function replace (word, rule) {
  		    return word.replace(rule[0], function (match, index) {
  		      var result = interpolate(rule[1], arguments);

  		      if (match === '') {
  		        return restoreCase(word[index - 1], result);
  		      }

  		      return restoreCase(match, result);
  		    });
  		  }

  		  /**
  		   * Sanitize a word by passing in the word and sanitization rules.
  		   *
  		   * @param  {string}   token
  		   * @param  {string}   word
  		   * @param  {Array}    rules
  		   * @return {string}
  		   */
  		  function sanitizeWord (token, word, rules) {
  		    // Empty string or doesn't need fixing.
  		    if (!token.length || uncountables.hasOwnProperty(token)) {
  		      return word;
  		    }

  		    var len = rules.length;

  		    // Iterate over the sanitization rules and use the first one to match.
  		    while (len--) {
  		      var rule = rules[len];

  		      if (rule[0].test(word)) return replace(word, rule);
  		    }

  		    return word;
  		  }

  		  /**
  		   * Replace a word with the updated word.
  		   *
  		   * @param  {Object}   replaceMap
  		   * @param  {Object}   keepMap
  		   * @param  {Array}    rules
  		   * @return {Function}
  		   */
  		  function replaceWord (replaceMap, keepMap, rules) {
  		    return function (word) {
  		      // Get the correct token and case restoration functions.
  		      var token = word.toLowerCase();

  		      // Check against the keep object map.
  		      if (keepMap.hasOwnProperty(token)) {
  		        return restoreCase(word, token);
  		      }

  		      // Check against the replacement map for a direct word replacement.
  		      if (replaceMap.hasOwnProperty(token)) {
  		        return restoreCase(word, replaceMap[token]);
  		      }

  		      // Run all the rules against the word.
  		      return sanitizeWord(token, word, rules);
  		    };
  		  }

  		  /**
  		   * Check if a word is part of the map.
  		   */
  		  function checkWord (replaceMap, keepMap, rules, bool) {
  		    return function (word) {
  		      var token = word.toLowerCase();

  		      if (keepMap.hasOwnProperty(token)) return true;
  		      if (replaceMap.hasOwnProperty(token)) return false;

  		      return sanitizeWord(token, token, rules) === token;
  		    };
  		  }

  		  /**
  		   * Pluralize or singularize a word based on the passed in count.
  		   *
  		   * @param  {string}  word      The word to pluralize
  		   * @param  {number}  count     How many of the word exist
  		   * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
  		   * @return {string}
  		   */
  		  function pluralize (word, count, inclusive) {
  		    var pluralized = count === 1
  		      ? pluralize.singular(word) : pluralize.plural(word);

  		    return (inclusive ? count + ' ' : '') + pluralized;
  		  }

  		  /**
  		   * Pluralize a word.
  		   *
  		   * @type {Function}
  		   */
  		  pluralize.plural = replaceWord(
  		    irregularSingles, irregularPlurals, pluralRules
  		  );

  		  /**
  		   * Check if a word is plural.
  		   *
  		   * @type {Function}
  		   */
  		  pluralize.isPlural = checkWord(
  		    irregularSingles, irregularPlurals, pluralRules
  		  );

  		  /**
  		   * Singularize a word.
  		   *
  		   * @type {Function}
  		   */
  		  pluralize.singular = replaceWord(
  		    irregularPlurals, irregularSingles, singularRules
  		  );

  		  /**
  		   * Check if a word is singular.
  		   *
  		   * @type {Function}
  		   */
  		  pluralize.isSingular = checkWord(
  		    irregularPlurals, irregularSingles, singularRules
  		  );

  		  /**
  		   * Add a pluralization rule to the collection.
  		   *
  		   * @param {(string|RegExp)} rule
  		   * @param {string}          replacement
  		   */
  		  pluralize.addPluralRule = function (rule, replacement) {
  		    pluralRules.push([sanitizeRule(rule), replacement]);
  		  };

  		  /**
  		   * Add a singularization rule to the collection.
  		   *
  		   * @param {(string|RegExp)} rule
  		   * @param {string}          replacement
  		   */
  		  pluralize.addSingularRule = function (rule, replacement) {
  		    singularRules.push([sanitizeRule(rule), replacement]);
  		  };

  		  /**
  		   * Add an uncountable word rule.
  		   *
  		   * @param {(string|RegExp)} word
  		   */
  		  pluralize.addUncountableRule = function (word) {
  		    if (typeof word === 'string') {
  		      uncountables[word.toLowerCase()] = true;
  		      return;
  		    }

  		    // Set singular and plural references for the word.
  		    pluralize.addPluralRule(word, '$0');
  		    pluralize.addSingularRule(word, '$0');
  		  };

  		  /**
  		   * Add an irregular word definition.
  		   *
  		   * @param {string} single
  		   * @param {string} plural
  		   */
  		  pluralize.addIrregularRule = function (single, plural) {
  		    plural = plural.toLowerCase();
  		    single = single.toLowerCase();

  		    irregularSingles[single] = plural;
  		    irregularPlurals[plural] = single;
  		  };

  		  /**
  		   * Irregular rules.
  		   */
  		  [
  		    // Pronouns.
  		    ['I', 'we'],
  		    ['me', 'us'],
  		    ['he', 'they'],
  		    ['she', 'they'],
  		    ['them', 'them'],
  		    ['myself', 'ourselves'],
  		    ['yourself', 'yourselves'],
  		    ['itself', 'themselves'],
  		    ['herself', 'themselves'],
  		    ['himself', 'themselves'],
  		    ['themself', 'themselves'],
  		    ['is', 'are'],
  		    ['was', 'were'],
  		    ['has', 'have'],
  		    ['this', 'these'],
  		    ['that', 'those'],
  		    // Words ending in with a consonant and `o`.
  		    ['echo', 'echoes'],
  		    ['dingo', 'dingoes'],
  		    ['volcano', 'volcanoes'],
  		    ['tornado', 'tornadoes'],
  		    ['torpedo', 'torpedoes'],
  		    // Ends with `us`.
  		    ['genus', 'genera'],
  		    ['viscus', 'viscera'],
  		    // Ends with `ma`.
  		    ['stigma', 'stigmata'],
  		    ['stoma', 'stomata'],
  		    ['dogma', 'dogmata'],
  		    ['lemma', 'lemmata'],
  		    ['schema', 'schemata'],
  		    ['anathema', 'anathemata'],
  		    // Other irregular rules.
  		    ['ox', 'oxen'],
  		    ['axe', 'axes'],
  		    ['die', 'dice'],
  		    ['yes', 'yeses'],
  		    ['foot', 'feet'],
  		    ['eave', 'eaves'],
  		    ['goose', 'geese'],
  		    ['tooth', 'teeth'],
  		    ['quiz', 'quizzes'],
  		    ['human', 'humans'],
  		    ['proof', 'proofs'],
  		    ['carve', 'carves'],
  		    ['valve', 'valves'],
  		    ['looey', 'looies'],
  		    ['thief', 'thieves'],
  		    ['groove', 'grooves'],
  		    ['pickaxe', 'pickaxes'],
  		    ['passerby', 'passersby']
  		  ].forEach(function (rule) {
  		    return pluralize.addIrregularRule(rule[0], rule[1]);
  		  });

  		  /**
  		   * Pluralization rules.
  		   */
  		  [
  		    [/s?$/i, 's'],
  		    [/[^\u0000-\u007F]$/i, '$0'],
  		    [/([^aeiou]ese)$/i, '$1'],
  		    [/(ax|test)is$/i, '$1es'],
  		    [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
  		    [/(e[mn]u)s?$/i, '$1s'],
  		    [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
  		    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
  		    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
  		    [/(seraph|cherub)(?:im)?$/i, '$1im'],
  		    [/(her|at|gr)o$/i, '$1oes'],
  		    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
  		    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
  		    [/sis$/i, 'ses'],
  		    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
  		    [/([^aeiouy]|qu)y$/i, '$1ies'],
  		    [/([^ch][ieo][ln])ey$/i, '$1ies'],
  		    [/(x|ch|ss|sh|zz)$/i, '$1es'],
  		    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
  		    [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
  		    [/(pe)(?:rson|ople)$/i, '$1ople'],
  		    [/(child)(?:ren)?$/i, '$1ren'],
  		    [/eaux$/i, '$0'],
  		    [/m[ae]n$/i, 'men'],
  		    ['thou', 'you']
  		  ].forEach(function (rule) {
  		    return pluralize.addPluralRule(rule[0], rule[1]);
  		  });

  		  /**
  		   * Singularization rules.
  		   */
  		  [
  		    [/s$/i, ''],
  		    [/(ss)$/i, '$1'],
  		    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
  		    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
  		    [/ies$/i, 'y'],
  		    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
  		    [/\b(mon|smil)ies$/i, '$1ey'],
  		    [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
  		    [/(seraph|cherub)im$/i, '$1'],
  		    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
  		    [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
  		    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
  		    [/(test)(?:is|es)$/i, '$1is'],
  		    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
  		    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
  		    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
  		    [/(alumn|alg|vertebr)ae$/i, '$1a'],
  		    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
  		    [/(matr|append)ices$/i, '$1ix'],
  		    [/(pe)(rson|ople)$/i, '$1rson'],
  		    [/(child)ren$/i, '$1'],
  		    [/(eau)x?$/i, '$1'],
  		    [/men$/i, 'man']
  		  ].forEach(function (rule) {
  		    return pluralize.addSingularRule(rule[0], rule[1]);
  		  });

  		  /**
  		   * Uncountable rules.
  		   */
  		  [
  		    // Singular words with no plurals.
  		    'adulthood',
  		    'advice',
  		    'agenda',
  		    'aid',
  		    'aircraft',
  		    'alcohol',
  		    'ammo',
  		    'analytics',
  		    'anime',
  		    'athletics',
  		    'audio',
  		    'bison',
  		    'blood',
  		    'bream',
  		    'buffalo',
  		    'butter',
  		    'carp',
  		    'cash',
  		    'chassis',
  		    'chess',
  		    'clothing',
  		    'cod',
  		    'commerce',
  		    'cooperation',
  		    'corps',
  		    'debris',
  		    'diabetes',
  		    'digestion',
  		    'elk',
  		    'energy',
  		    'equipment',
  		    'excretion',
  		    'expertise',
  		    'firmware',
  		    'flounder',
  		    'fun',
  		    'gallows',
  		    'garbage',
  		    'graffiti',
  		    'hardware',
  		    'headquarters',
  		    'health',
  		    'herpes',
  		    'highjinks',
  		    'homework',
  		    'housework',
  		    'information',
  		    'jeans',
  		    'justice',
  		    'kudos',
  		    'labour',
  		    'literature',
  		    'machinery',
  		    'mackerel',
  		    'mail',
  		    'media',
  		    'mews',
  		    'moose',
  		    'music',
  		    'mud',
  		    'manga',
  		    'news',
  		    'only',
  		    'personnel',
  		    'pike',
  		    'plankton',
  		    'pliers',
  		    'police',
  		    'pollution',
  		    'premises',
  		    'rain',
  		    'research',
  		    'rice',
  		    'salmon',
  		    'scissors',
  		    'series',
  		    'sewage',
  		    'shambles',
  		    'shrimp',
  		    'software',
  		    'species',
  		    'staff',
  		    'swine',
  		    'tennis',
  		    'traffic',
  		    'transportation',
  		    'trout',
  		    'tuna',
  		    'wealth',
  		    'welfare',
  		    'whiting',
  		    'wildebeest',
  		    'wildlife',
  		    'you',
  		    /pok[eé]mon$/i,
  		    // Regexes.
  		    /[^aeiou]ese$/i, // "chinese", "japanese"
  		    /deer$/i, // "deer", "reindeer"
  		    /fish$/i, // "fish", "blowfish", "angelfish"
  		    /measles$/i,
  		    /o[iu]s$/i, // "carnivorous"
  		    /pox$/i, // "chickpox", "smallpox"
  		    /sheep$/i
  		  ].forEach(pluralize.addUncountableRule);

  		  return pluralize;
  		}); 
  	} (pluralize$2));
  	return pluralize$2.exports;
  }

  var pluralizeExports = requirePluralize();
  var pluralize$3 = /*@__PURE__*/getDefaultExportFromCjs(pluralizeExports);

  /*! (c) Andrea Giammarchi (ISC) */var hyperHTML=function(N){var t={};try{t.WeakMap=WeakMap;}catch(e){t.WeakMap=function(t,e){var n=e.defineProperty,r=e.hasOwnProperty,i=a.prototype;return i.delete=function(e){return this.has(e)&&delete e[this._]},i.get=function(e){return this.has(e)?e[this._]:void 0},i.has=function(e){return r.call(e,this._)},i.set=function(e,t){return n(e,this._,{configurable:true,value:t}),this},a;function a(e){n(this,"_",{value:"_@ungap/weakmap"+t++}),e&&e.forEach(o,this);}function o(e){this.set(e[0],e[1]);}}(Math.random(),Object);}var s=t.WeakMap,i={};try{i.WeakSet=WeakSet;}catch(e){!function(e,t){var n=r.prototype;function r(){t(this,"_",{value:"_@ungap/weakmap"+e++});}n.add=function(e){return this.has(e)||t(e,this._,{value:true,configurable:true}),this},n.has=function(e){return this.hasOwnProperty.call(e,this._)},n.delete=function(e){return this.has(e)&&delete e[this._]},i.WeakSet=r;}(Math.random(),Object.defineProperty);}function m(e,t,n,r,i,a){for(var o=("selectedIndex"in t),u=o;r<i;){var c,l=e(n[r],1);t.insertBefore(l,a),o&&u&&l.selected&&(u=!u,c=t.selectedIndex,t.selectedIndex=c<0?r:f.call(t.querySelectorAll("option"),l)),r++;}}function y(e,t){return e==t}function b(e){return e}function w(e,t,n,r,i,a,o){var u=a-i;if(u<1)return  -1;for(;u<=n-t;){for(var c=t,l=i;c<n&&l<a&&o(e[c],r[l]);)c++,l++;if(l===a)return t;t=c+1;}return  -1}function x(e,t,n,r,i){return n<r?e(t[n],0):0<n?e(t[n-1],-0).nextSibling:i}function E(e,t,n,r){for(;n<r;)a(e(t[n++],-1));}function C(e,t,n,r,i,a,o,u,c,l,s,f,h){!function(e,t,n,r,i,a,o,u,c){for(var l=[],s=e.length,f=o,h=0;h<s;)switch(e[h++]){case 0:i++,f++;break;case 1:l.push(r[i]),m(t,n,r,i++,i,f<u?t(a[f],0):c);break;case  -1:f++;}for(h=0;h<s;)switch(e[h++]){case 0:o++;break;case  -1:-1<l.indexOf(a[o])?o++:E(t,a,o++,o);}}(function(e,t,n,r,i,a,o){var u,c,l,s,f,h,d=n+a,v=[];e:for(m=0;m<=d;m++){if(50<m)return null;for(h=m-1,s=m?v[m-1]:[0,0],f=v[m]=[],u=-m;u<=m;u+=2){for(c=(l=u===-m||u!==m&&s[h+u-1]<s[h+u+1]?s[h+u+1]:s[h+u-1]+1)-u;l<a&&c<n&&o(r[i+l],e[t+c]);)l++,c++;if(l===a&&c===n)break e;f[m+u]=l;}}for(var p=Array(m/2+d/2),g=p.length-1,m=v.length-1;0<=m;m--){for(;0<l&&0<c&&o(r[i+l-1],e[t+c-1]);)p[g--]=0,l--,c--;if(!m)break;h=m-1,s=m?v[m-1]:[0,0],(u=l-c)===-m||u!==m&&s[h+u-1]<s[h+u+1]?(c--,p[g--]=1):(l--,p[g--]=-1);}return p}(n,r,a,o,u,l,f)||function(e,t,n,r,i,a,o,u){var c=0,l=r<u?r:u,s=Array(l++),f=Array(l);f[0]=-1;for(var h=1;h<l;h++)f[h]=o;for(var d=i.slice(a,o),v=t;v<n;v++){var p,g=d.indexOf(e[v]);-1<g&&(-1<(c=k(f,l,p=g+a))&&(f[c]=p,s[c]={newi:v,oldi:p,prev:s[c-1]}));}for(c=--l,--o;f[c]>o;)--c;l=u+r-c;var m=Array(l),y=s[c];for(--n;y;){for(var b=y.newi,w=y.oldi;b<n;)m[--l]=1,--n;for(;w<o;)m[--l]=-1,--o;m[--l]=0,--n,--o,y=y.prev;}for(;t<=n;)m[--l]=1,--n;for(;a<=o;)m[--l]=-1,--o;return m}(n,r,i,a,o,u,c,l),e,t,n,r,o,u,s,h);}var e=i.WeakSet,f=[].indexOf,k=function(e,t,n){for(var r=1,i=t;r<i;){var a=(r+i)/2>>>0;n<e[a]?i=a:r=1+a;}return r},a=function(e){return (e.remove||function(){var e=this.parentNode;e&&e.removeChild(this);}).call(e)};function l(e,t,n,r){for(var i=(r=r||{}).compare||y,a=r.node||b,o=null==r.before?null:a(r.before,0),u=t.length,c=u,l=0,s=n.length,f=0;l<c&&f<s&&i(t[l],n[f]);)l++,f++;for(;l<c&&f<s&&i(t[c-1],n[s-1]);)c--,s--;var h=l===c,d=f===s;if(h&&d)return n;if(h&&f<s)return m(a,e,n,f,s,x(a,t,l,u,o)),n;if(d&&l<c)return E(a,t,l,c),n;var v=c-l,p=s-f,g=-1;if(v<p){if(-1<(g=w(n,f,s,t,l,c,i)))return m(a,e,n,f,g,a(t[l],0)),m(a,e,n,g+v,s,x(a,t,c,u,o)),n}else if(p<v&&-1<(g=w(t,l,c,n,f,s,i)))return E(a,t,l,g),E(a,t,g+p,c),n;return v<2||p<2?(m(a,e,n,f,s,a(t[l],0)),E(a,t,l,c)):v==p&&function(e,t,n,r,i,a){for(;r<i&&a(n[r],e[t-1]);)r++,t--;return 0===t}(n,s,t,l,c,i)?m(a,e,n,f,s,x(a,t,c,u,o)):C(a,e,n,f,s,p,t,l,c,v,u,i,o),n}var n,r={};function o(e,t){t=t||{};var n=N.createEvent("CustomEvent");return n.initCustomEvent(e,!!t.bubbles,!!t.cancelable,t.detail),n}r.CustomEvent="function"==typeof CustomEvent?CustomEvent:(o[n="prototype"]=new o("").constructor[n],o);var u=r.CustomEvent,c={};try{c.Map=Map;}catch(e){c.Map=function(){var n=0,i=[],a=[];return {delete:function(e){var t=r(e);return t&&(i.splice(n,1),a.splice(n,1)),t},forEach:function(n,r){i.forEach(function(e,t){n.call(r,a[t],e,this);},this);},get:function(e){return r(e)?a[n]:void 0},has:r,set:function(e,t){return a[r(e)?n:i.push(e)-1]=t,this}};function r(e){return  -1<(n=i.indexOf(e))}};}var h=c.Map;function d(){return this}function v(e,t){var n="_"+e+"$";return {get:function(){return this[n]||p(this,n,t.call(this,e))},set:function(e){p(this,n,e);}}}var p=function(e,t,n){return Object.defineProperty(e,t,{configurable:true,value:"function"==typeof n?function(){return e._wire$=n.apply(this,arguments)}:n})[t]};Object.defineProperties(d.prototype,{ELEMENT_NODE:{value:1},nodeType:{value:-1}});var g,A,S,O,T,M,_={},j={},L=[],P=j.hasOwnProperty,D=0,W={attributes:_,define:function(e,t){e.indexOf("-")<0?(e in j||(D=L.push(e)),j[e]=t):_[e]=t;},invoke:function(e,t){for(var n=0;n<D;n++){var r=L[n];if(P.call(e,r))return j[r](e[r],t)}}},$=Array.isArray||(A=(g={}.toString).call([]),function(e){return g.call(e)===A}),R=(S=N,O="fragment",M="content"in H(T="template")?function(e){var t=H(T);return t.innerHTML=e,t.content}:function(e){var t,n=H(O),r=H(T);return F(n,/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(e)?(t=RegExp.$1,r.innerHTML="<table>"+e+"</table>",r.querySelectorAll(t)):(r.innerHTML=e,r.childNodes)),n},function(e,t){return ("svg"===t?function(e){var t=H(O),n=H("div");return n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg">'+e+"</svg>",F(t,n.firstChild.childNodes),t}:M)(e)});function F(e,t){for(var n=t.length;n--;)e.appendChild(t[0]);}function H(e){return e===O?S.createDocumentFragment():S.createElementNS("http://www.w3.org/1999/xhtml",e)}var I,z,V,Z,G,q,B,J,K,Q,U=(z="appendChild",V="cloneNode",Z="createTextNode",q=(G="importNode")in(I=N),(B=I.createDocumentFragment())[z](I[Z]("g")),B[z](I[Z]("")),(q?I[G](B,true):B[V](true)).childNodes.length<2?function e(t,n){for(var r=t[V](),i=t.childNodes||[],a=i.length,o=0;n&&o<a;o++)r[z](e(i[o],n));return r}:q?I[G]:function(e,t){return e[V](!!t)}),X="".trim||function(){return String(this).replace(/^\s+|\s+/g,"")},Y="-"+Math.random().toFixed(6)+"%",ee=false;try{J=N.createElement("template"),Q="tabindex",(K="content")in J&&(J.innerHTML="<p "+Q+'="'+Y+'"></p>',J[K].childNodes[0].getAttribute(Q)==Y)||(Y="_dt: "+Y.slice(1,-1)+";",ee=!0);}catch(e){}var te="\x3c!--"+Y+"--\x3e",ne=8,re=1,ie=3,ae=/^(?:style|textarea)$/i,oe=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;var ue=" \\f\\n\\r\\t",ce="[^"+ue+"\\/>\"'=]+",le="["+ue+"]+"+ce,se="<([A-Za-z]+[A-Za-z0-9:._-]*)((?:",fe="(?:\\s*=\\s*(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|"+ce.replace("\\/","")+"))?)",he=new RegExp(se+le+fe+"+)(["+ue+"]*/?>)","g"),de=new RegExp(se+le+fe+"*)(["+ue+"]*/>)","g"),ve=new RegExp("("+le+"\\s*=\\s*)(['\"]?)"+te+"\\2","gi");function pe(e,t,n,r){return "<"+t+n.replace(ve,ge)+r}function ge(e,t,n){return t+(n||'"')+Y+(n||'"')}function me(e,t,n){return oe.test(t)?e:"<"+t+n+"></"+t+">"}var ye=ee?function(e,t){var n=t.join(" ");return t.slice.call(e,0).sort(function(e,t){return n.indexOf(e.name)<=n.indexOf(t.name)?-1:1})}:function(e,t){return t.slice.call(e,0)};function be(e,t,n,r){for(var i=e.childNodes,a=i.length,o=0;o<a;){var u=i[o];switch(u.nodeType){case re:var c=r.concat(o);!function(e,t,n,r){var i,a=e.attributes,o=[],u=[],c=ye(a,n),l=c.length,s=0;for(;s<l;){var f=c[s++],h=f.value===Y;if(h||1<(i=f.value.split(te)).length){var d=f.name;if(o.indexOf(d)<0){o.push(d);var v=n.shift().replace(h?/^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/:new RegExp("^(?:|[\\S\\s]*?\\s)("+d+")\\s*=\\s*('|\")[\\S\\s]*","i"),"$1"),p=a[v]||a[v.toLowerCase()];if(h)t.push(we(p,r,v,null));else {for(var g=i.length-2;g--;)n.shift();t.push(we(p,r,v,i));}}u.push(f);}}l=u.length;var m=(s=0)<l&&ee&&!("ownerSVGElement"in e);for(;s<l;){var y=u[s++];m&&(y.value=""),e.removeAttribute(y.name);}var b=e.nodeName;if(/^script$/i.test(b)){var w=N.createElement(b);for(l=a.length,s=0;s<l;)w.setAttributeNode(a[s++].cloneNode(true));w.textContent=e.textContent,e.parentNode.replaceChild(w,e);}}(u,t,n,c),be(u,t,n,c);break;case ne:var l=u.textContent;if(l===Y)n.shift(),t.push(ae.test(e.nodeName)?Ne(e,r):{type:"any",node:u,path:r.concat(o)});else switch(l.slice(0,2)){case "/*":if("*/"!==l.slice(-2))break;case "👻":e.removeChild(u),o--,a--;}break;case ie:ae.test(e.nodeName)&&X.call(u.textContent)===te&&(n.shift(),t.push(Ne(e,r)));}o++;}}function we(e,t,n,r){return {type:"attr",node:e,path:t,name:n,sparse:r}}function Ne(e,t){return {type:"text",node:e,path:t}}var xe,Ee=(xe=new s,{get:function(e){return xe.get(e)},set:function(e,t){return xe.set(e,t),t}});function Ce(o,f){var e=(o.convert||function(e){return e.join(te).replace(de,me).replace(he,pe)})(f),t=o.transform;t&&(e=t(e));var n=R(e,o.type);Se(n);var u=[];return be(n,u,f.slice(0),[]),{content:n,updates:function(c){for(var l=[],s=u.length,e=0,t=0;e<s;){var n=u[e++],r=function(e,t){for(var n=t.length,r=0;r<n;)e=e.childNodes[t[r++]];return e}(c,n.path);switch(n.type){case "any":l.push({fn:o.any(r,[]),sparse:false});break;case "attr":var i=n.sparse,a=o.attribute(r,n.name,n.node);null===i?l.push({fn:a,sparse:false}):(t+=i.length-2,l.push({fn:a,sparse:true,values:i}));break;case "text":l.push({fn:o.text(r),sparse:false}),r.textContent="";}}return s+=t,function(){var e=arguments.length;if(s!==e-1)throw new Error(e-1+" values instead of "+s+"\n"+f.join("${value}"));for(var t=1,n=1;t<e;){var r=l[t-n];if(r.sparse){var i=r.values,a=i[0],o=1,u=i.length;for(n+=u-2;o<u;)a+=arguments[t++]+i[o++];r.fn(a);}else r.fn(arguments[t++]);}return c}}}}var ke=[];function Ae(i){var a=ke,o=Se;return function(e){var t,n,r;return a!==e&&(t=i,n=a=e,r=Ee.get(n)||Ee.set(n,Ce(t,n)),o=r.updates(U.call(N,r.content,true))),o.apply(null,arguments)}}function Se(e){for(var t=e.childNodes,n=t.length;n--;){var r=t[n];1!==r.nodeType&&0===X.call(r.textContent).length&&e.removeChild(r);}}var Oe,Te,Me=(Oe=/acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,Te=/([^A-Z])([A-Z]+)/g,function(e,t){return "ownerSVGElement"in e?function(e,t){var n;return (n=t?t.cloneNode(true):(e.setAttribute("style","--hyper:style;"),e.getAttributeNode("style"))).value="",e.setAttributeNode(n),je(n,true)}(e,t):je(e.style,false)});function _e(e,t,n){return t+"-"+n.toLowerCase()}function je(a,o){var u,c;return function(e){var t,n,r,i;switch(typeof e){case "object":if(e){if("object"===u){if(!o&&c!==e)for(n in c)n in e||(a[n]="");}else o?a.value="":a.cssText="";for(n in t=o?{}:a,e)r="number"!=typeof(i=e[n])||Oe.test(n)?i:i+"px",!o&&/^--/.test(n)?t.setProperty(n,r):t[n]=r;u="object",o?a.value=function(e){var t,n=[];for(t in e)n.push(t.replace(Te,_e),":",e[t],";");return n.join("")}(c=t):c=e;break}default:c!=e&&(u="string",c=e,o?a.value=e||"":a.cssText=e||"");}}}var Le,Pe,De=(Le=[].slice,(Pe=We.prototype).ELEMENT_NODE=1,Pe.nodeType=111,Pe.remove=function(e){var t,n=this.childNodes,r=this.firstChild,i=this.lastChild;return this._=null,e&&2===n.length?i.parentNode.removeChild(i):((t=this.ownerDocument.createRange()).setStartBefore(e?n[1]:r),t.setEndAfter(i),t.deleteContents()),r},Pe.valueOf=function(e){var t=this._,n=null==t;if(n&&(t=this._=this.ownerDocument.createDocumentFragment()),n||e)for(var r=this.childNodes,i=0,a=r.length;i<a;i++)t.appendChild(r[i]);return t},We);function We(e){var t=this.childNodes=Le.call(e,0);this.firstChild=t[0],this.lastChild=t[t.length-1],this.ownerDocument=t[0].ownerDocument,this._=null;}function $e(e){return {html:e}}function Re(e,t){switch(e.nodeType){case Ke:return 1/t<0?t?e.remove(true):e.lastChild:t?e.valueOf(true):e.firstChild;case Je:return Re(e.render(),t);default:return e}}function Fe(e,t){t(e.placeholder),"text"in e?Promise.resolve(e.text).then(String).then(t):"any"in e?Promise.resolve(e.any).then(t):"html"in e?Promise.resolve(e.html).then($e).then(t):Promise.resolve(W.invoke(e,t)).then(t);}function He(e){return null!=e&&"then"in e}var Ie,ze,Ve,Ze,Ge,qe="ownerSVGElement",Be="connected",Je=d.prototype.nodeType,Ke=De.prototype.nodeType,Qe=(ze=(Ie={Event:u,WeakSet:e}).Event,Ve=Ie.WeakSet,Ze=true,Ge=null,function(e){return Ze&&(Ze=!Ze,Ge=new Ve,function(t){var i=new Ve,a=new Ve;try{new MutationObserver(u).observe(t,{subtree:!0,childList:!0});}catch(e){var n=0,r=[],o=function(e){r.push(e),clearTimeout(n),n=setTimeout(function(){u(r.splice(n=0,r.length));},0);};t.addEventListener("DOMNodeRemoved",function(e){o({addedNodes:[],removedNodes:[e.target]});},true),t.addEventListener("DOMNodeInserted",function(e){o({addedNodes:[e.target],removedNodes:[]});},true);}function u(e){for(var t,n=e.length,r=0;r<n;r++)c((t=e[r]).removedNodes,"disconnected",a,i),c(t.addedNodes,"connected",i,a);}function c(e,t,n,r){for(var i,a=new ze(t),o=e.length,u=0;u<o;1===(i=e[u++]).nodeType&&function e(t,n,r,i,a){Ge.has(t)&&!i.has(t)&&(a.delete(t),i.add(t),t.dispatchEvent(n));for(var o=t.children||[],u=o.length,c=0;c<u;e(o[c++],n,r,i,a));}(i,a,t,n,r));}}(e.ownerDocument)),Ge.add(e),e}),Ue=/^(?:form|list)$/i,Xe=[].slice;function Ye(e){return this.type=e,Ae(this)}var et=!(Ye.prototype={attribute:function(n,r,e){var i,t=qe in n;if("style"===r)return Me(n,e,t);if("."===r.slice(0,1))return l=n,s=r.slice(1),t?function(t){try{l[s]=t;}catch(e){l.setAttribute(s,t);}}:function(e){l[s]=e;};if("?"===r.slice(0,1))return o=n,u=r.slice(1),function(e){c!==!!e&&((c=!!e)?o.setAttribute(u,""):o.removeAttribute(u));};if(/^on/.test(r)){var a=r.slice(2);return a===Be||"disconnected"===a?Qe(n):r.toLowerCase()in n&&(a=a.toLowerCase()),function(e){i!==e&&(i&&n.removeEventListener(a,i,false),(i=e)&&n.addEventListener(a,e,false));}}if("data"===r||!t&&r in n&&!Ue.test(r))return function(e){i!==e&&(i=e,n[r]!==e&&null==e?(n[r]="",n.removeAttribute(r)):n[r]=e);};if(r in W.attributes)return function(e){var t=W.attributes[r](n,e);i!==t&&(null==(i=t)?n.removeAttribute(r):n.setAttribute(r,t));};var o,u,c,l,s,f=false,h=e.cloneNode(true);return function(e){i!==e&&(i=e,h.value!==e&&(null==e?(f&&(f=false,n.removeAttributeNode(h)),h.value=e):(h.value=e,f||(f=true,n.setAttributeNode(h)))));}},any:function(r,i){var a,o={node:Re,before:r},u=qe in r?"svg":"html",c=false;return function e(t){switch(typeof t){case "string":case "number":case "boolean":c?a!==t&&(a=t,i[0].textContent=t):(c=true,a=t,i=l(r.parentNode,i,[(n=t,r.ownerDocument.createTextNode(n))],o));break;case "function":e(t(r));break;case "object":case "undefined":if(null==t){c=false,i=l(r.parentNode,i,[],o);break}default:if(c=false,$(a=t))if(0===t.length)i.length&&(i=l(r.parentNode,i,[],o));else switch(typeof t[0]){case "string":case "number":case "boolean":e({html:t});break;case "object":if($(t[0])&&(t=t.concat.apply([],t)),He(t[0])){Promise.all(t).then(e);break}default:i=l(r.parentNode,i,t,o);}else "ELEMENT_NODE"in t?i=l(r.parentNode,i,11===t.nodeType?Xe.call(t.childNodes):[t],o):He(t)?t.then(e):"placeholder"in t?Fe(t,e):"text"in t?e(String(t.text)):"any"in t?e(t.any):"html"in t?i=l(r.parentNode,i,Xe.call(R([].concat(t.html).join(""),u).childNodes),o):"length"in t?e(Xe.call(t)):e(W.invoke(t,e));}var n;}},text:function(r){var i;return function e(t){var n;i!==t&&("object"==(n=typeof(i=t))&&t?He(t)?t.then(e):"placeholder"in t?Fe(t,e):"text"in t?e(String(t.text)):"any"in t?e(t.any):"html"in t?e([].concat(t.html).join("")):"length"in t?e(Xe.call(t).join("")):e(W.invoke(t,e)):"function"==n?e(t(r)):r.textContent=null==t?"":t);}}}),tt=function(e){var t,r,i,a,n=(t=(N.defaultView.navigator||{}).userAgent,/(Firefox|Safari)\/(\d+)/.test(t)&&!/(Chrom[eium]+|Android)\/(\d+)/.test(t)),o=!("raw"in e)||e.propertyIsEnumerable("raw")||!Object.isFrozen(e.raw);return n||o?(r={},i=function(e){for(var t=".",n=0;n<e.length;n++)t+=e[n].length+"."+e[n];return r[t]||(r[t]=e)},tt=o?i:(a=new s,function(e){return a.get(e)||(n=i(t=e),a.set(t,n),n);var t,n;})):et=true,nt(e)};function nt(e){return et?e:tt(e)}function rt(e){for(var t=arguments.length,n=[nt(e)],r=1;r<t;)n.push(arguments[r++]);return n}var it=new s,at=function(t){var n,r,i;return function(){var e=rt.apply(null,arguments);return i!==e[0]?(i=e[0],r=new Ye(t),n=ut(r.apply(r,e))):r.apply(r,e),n}},ot=function(e,t){var n=t.indexOf(":"),r=it.get(e),i=t;return  -1<n&&(i=t.slice(n+1),t=t.slice(0,n)||"html"),r||it.set(e,r={}),r[i]||(r[i]=at(t))},ut=function(e){var t=e.childNodes,n=t.length;return 1===n?t[0]:n?new De(t):e},ct=new s;function lt(){var e=ct.get(this),t=rt.apply(null,arguments);return e&&e.template===t[0]?e.tagger.apply(null,t):function(e){var t=new Ye(qe in this?"svg":"html");ct.set(this,{tagger:t,template:e}),this.textContent="",this.appendChild(t.apply(null,arguments));}.apply(this,t),this}var st,ft,ht,dt,vt=W.define,pt=Ye.prototype;function gt(e){return arguments.length<2?null==e?at("html"):"string"==typeof e?gt.wire(null,e):"raw"in e?at("html")(e):"nodeType"in e?gt.bind(e):ot(e,"html"):("raw"in e?at("html"):gt.wire).apply(null,arguments)}return gt.Component=d,gt.bind=function(e){return lt.bind(e)},gt.define=vt,gt.diff=l,(gt.hyper=gt).observe=Qe,gt.tagger=pt,gt.wire=function(e,t){return null==e?at(t||"html"):ot(e,t||"html")},gt._={WeakMap:s,WeakSet:e},st=at,ft=new s,ht=Object.create,dt=function(e,t){var n={w:null,p:null};return t.set(e,n),n},Object.defineProperties(d,{for:{configurable:true,value:function(e,t){return function(e,t,n,r){var i,a,o,u=t.get(e)||dt(e,t);switch(typeof r){case "object":case "function":var c=u.w||(u.w=new s);return c.get(r)||(i=c,a=r,o=new e(n),i.set(a,o),o);default:var l=u.p||(u.p=ht(null));return l[r]||(l[r]=new e(n))}}(this,ft.get(e)||(n=e,r=new h,ft.set(n,r),r),e,null==t?"default":t);var n,r;}}}),Object.defineProperties(d.prototype,{handleEvent:{value:function(e){var t=e.currentTarget;this["getAttribute"in t&&t.getAttribute("data-call")||"on"+e.type](e);}},html:v("html",st),svg:v("svg",st),state:v("state",function(){return this.defaultState}),defaultState:{get:function(){return {}}},dispatch:{value:function(e,t){var n=this._wire$;if(n){var r=new u(e,{bubbles:true,cancelable:true,detail:t});return r.component=this,(n.dispatchEvent?n:n.firstChild).dispatchEvent(r)}return  false}},setState:{value:function(e,t){var n=this.state,r="function"==typeof e?e.call(this,n):e;for(var i in r)n[i]=r[i];return  false!==t&&this.render(),this}}}),gt}(document);
  const {Component, bind, define, diff, hyper, wire} = hyperHTML;

  // @ts-check
  // Temporary workaround until browsers get real import-maps


  const html = hyperHTML;
  const idb = _idb;
  const marked = marked$1;
  const MIMEType = MIMEType$1;
  const pluralize$1 = pluralize$3;
  const webidl2 = _webidl2;

  // @ts-check
  // Module core/utils
  // As the name implies, this contains a ragtag gang of methods that just don't fit
  // anywhere else.

  const dashes = /-/g;

  /**
   * Hashes a string from char code. Can return a negative number.
   * Based on https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
   * @param {String} text
   */
  function hashString(text) {
    let hash = 0;
    for (const char of text) {
      hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
    }
    return String(hash);
  }

  // https://stackoverflow.com/a/58633686
  const ISODate = new Intl.DateTimeFormat(["sv-SE"], {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // We use an "Australian Date" because it omits the ","
  // after the day of the month, which is required by the W3C.
  const dateLang =
    lang$1 === "en" || lang$1.startsWith("en-") ? "en-AU" : lang$1;
  const W3CDate = new Intl.DateTimeFormat(dateLang, {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: dateLang === "en-AU" ? "2-digit" : "numeric",
  });

  /** CSS selector for matching elements that are non-normative */
  const nonNormativeSelector =
    ".informative, .note, .issue, .example, .ednote, .practice, .introductory";

  /**
   * Creates a link element that represents a resource hint.
   *
   * @param {ResourceHintOption} opts Configure the resource hint.
   * @return {HTMLLinkElement} A link element ready to use.
   */
  function createResourceHint(opts) {
    const url = new URL(opts.href, document.baseURI);
    const linkElem = document.createElement("link");
    let { href } = url;
    linkElem.rel = opts.hint;
    switch (linkElem.rel) {
      case "dns-prefetch":
      case "preconnect":
        href = url.origin;
        if (opts.corsMode || url.origin !== document.location.origin) {
          linkElem.crossOrigin = opts.corsMode || "anonymous";
        }
        break;
      case "preload":
        if ("as" in opts) {
          linkElem.setAttribute("as", opts.as);
        }
        if (opts.corsMode) {
          linkElem.crossOrigin = opts.corsMode;
        }
        break;
    }
    linkElem.href = href;
    if (!opts.dontRemove) {
      linkElem.classList.add("removeOnSave");
    }
    return linkElem;
  }

  // RESPEC STUFF
  /**
   * @param {Document} doc
   */
  function removeReSpec(doc) {
    doc.querySelectorAll(".remove, script[data-requiremodule]").forEach(elem => {
      elem.remove();
    });
  }

  /**
   * Adds error class to each element while emitting a warning
   * @param {HTMLElement} elem
   * @param {String} msg message to show in warning
   * @param {String=} title error message to add on each element
   */
  function markAsOffending(elem, msg, title) {
    elem.classList.add("respec-offending-element");
    if (!elem.hasAttribute("title")) {
      elem.setAttribute("title", title || msg);
    }
    if (!elem.id) {
      addId(elem, "respec-offender");
    }
  }

  // STRING HELPERS
  /**
   * @param {"conjunction"|"disjunction"} type
   * @param {"long"|"narrow"} style
   */
  function joinFactory(type, style = "long") {
    const formatter = new Intl.ListFormat(lang$1, { style, type });
    /**
     * @template T
     * @param {string[]} items
     * @param {(value: string, index: number, array: string[]) => any} [mapper]
     */
    return (items, mapper) => {
      let elemCount = 0;
      return formatter.formatToParts(items).map(({ type, value }) => {
        if (type === "element" && mapper) {
          return mapper(value, elemCount++, items);
        }
        return value;
      });
    };
  }

  /**
   * Takes an array and returns a string that separates each of its items with the
   * proper commas and "and". The second argument is a mapping function that can
   * convert the items before they are joined.
   */
  const conjunction = joinFactory("conjunction");
  const disjunction = joinFactory("disjunction");

  /**
   *
   * @param {string[]} items
   * @param {(value: undefined, index: number, array: undefined[]) => string} [mapper]
   */
  function joinAnd(items, mapper) {
    return conjunction(items, mapper).join("");
  }

  /**
   *
   * @param {string[]} items
   * @param {(value: undefined, index: number, array: undefined[]) => string} [mapper]
   */
  function joinOr(items, mapper) {
    return disjunction(items, mapper).join("");
  }

  /**
   * Takes a string, applies some XML escapes, and returns the escaped string.
   * @param {string} str
   */
  function xmlEscape(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  /**
   * Trims string at both ends and replaces all other white space with a single
   * space.
   * @param {string} str
   */
  function norm(str) {
    return str.trim().replace(/\s+/g, " ");
  }

  /**
   * @template {Record<string, Record<string, string|Function>>} T
   * @param {T} localizationStrings
   * @returns {T[keyof T]}
   */
  function getIntlData(localizationStrings, lang = lang$1) {
    lang = lang.toLowerCase();
    // Proxy return type is a known bug:
    // https://github.com/Microsoft/TypeScript/issues/20846
    // @ts-expect-error
    return new Proxy(localizationStrings, {
      /** @param {string} key */
      get(data, key) {
        const result = getIntlDataForKey(data, key, lang) || data.en[key];
        if (!result) {
          throw new Error(`No l10n data for key: "${key}"`);
        }
        return result;
      },
    });
  }

  /**
   * @template {Record<string, Record<string, string|Function>>} T
   * @param {T} localizationStrings
   * @param {string} key
   */
  function getIntlDataForKey(localizationStrings, key, lang = lang$1) {
    lang = lang.toLowerCase();
    return (
      localizationStrings[lang]?.[key] ||
      localizationStrings[lang.match(/^(\w{2,3})-.+$/)?.[1]]?.[key]
    );
  }

  // --- DATE HELPERS -------------------------------------------------------------------------------
  /**
   * Takes a Date object and an optional separator and returns the year,month,day
   * representation with the custom separator (defaulting to none) and proper
   * 0-padding.
   * @param {Date} date
   */
  function concatDate(date, sep = "") {
    return ISODate.format(date).replace(dashes, sep);
  }

  /**
   * Checks if a date is in expected format used by ReSpec (yyyy-mm-dd)
   * @param {string} rawDate
   */
  function isValidConfDate(rawDate) {
    const date = /\d{4}-\d{2}-\d{2}/.test(rawDate)
      ? new Date(rawDate)
      : "Invalid Date";
    return date.toString() !== "Invalid Date";
  }

  // TRANSFORMATIONS

  /**
   * Run list of transforms over content and return result.
   *
   * Please note that this is a legacy method that is only kept in order to
   * maintain compatibility with RSv1. It is therefore not tested and not actively
   * supported.
   * @this {any}
   * @param {string} content
   * @param {string} [flist] List of global function names.
   * @param {unknown[]} [funcArgs] Arguments to pass to each function.
   */
  function runTransforms(content, flist, ...funcArgs) {
    const args = [this, content, ...funcArgs];
    if (flist) {
      const methods = flist.split(/\s+/);
      for (const meth of methods) {
        /** @type {any} */
        const method = window[meth];
        if (method) {
          // the initial call passed |this| directly, so we keep it that way
          try {
            content = method.apply(this, args);
          } catch (e) {
            const msg = `call to \`${meth}()\` failed with: ${e}.`;
            const hint = "See developer console for stack trace.";
            showWarning(msg, "utils/runTransforms", { hint, cause: e });
          }
        }
      }
    }
    return content;
  }

  /**
   * Cached request handler
   * @param {RequestInfo} input
   * @param {number} maxAge cache expiration duration in ms. defaults to 24 hours
   * @return {Promise<Response>}
   *  if a cached response is available and it's not stale, return it
   *  else: request from network, cache and return fresh response.
   *    If network fails, return a stale cached version if exists (else throw)
   */
  async function fetchAndCache(input, maxAge = 24 * 60 * 60 * 1000) {
    const request = new Request(input);
    const url = new URL(request.url);

    // use data from cache data if valid and render
    let cache;
    let cachedResponse;
    if ("caches" in window) {
      try {
        cache = await caches.open(url.origin);
        cachedResponse = await cache.match(request);
        if (
          cachedResponse &&
          new Date(cachedResponse.headers.get("Expires")) > new Date()
        ) {
          return cachedResponse;
        }
      } catch (err) {
        console.error("Failed to use Cache API.", err);
      }
    }

    // otherwise fetch new data and cache
    const response = await fetch(request);
    if (!response.ok) {
      if (cachedResponse) {
        // return stale version
        console.warn(`Returning a stale cached response for ${url}`);
        return cachedResponse;
      }
    }

    // cache response
    if (cache && response.ok) {
      const clonedResponse = response.clone();
      const customHeaders = new Headers(response.headers);
      const expiryDate = new Date(Date.now() + maxAge);
      customHeaders.set("Expires", expiryDate.toISOString());
      const cacheResponse = new Response(await clonedResponse.blob(), {
        headers: customHeaders,
      });
      // put in cache, and forget it (there is no recovery if it throws, but that's ok).
      await cache.put(request, cacheResponse).catch(console.error);
    }
    return response;
  }

  // --- DOM HELPERS -------------------------------

  /**
   * Separates each item with proper commas.
   * @template T
   * @param {T[]} array
   * @param {(item: T) => any} [mapper]
   */
  function htmlJoinComma(array, mapper = item => item) {
    const items = array.map(mapper);
    const joined = items.slice(0, -1).map(item => html`${item}, `);
    return html`${joined}${items[items.length - 1]}`;
  }
  /**
   *
   * @param {string[]} array
   * @param {(item: any) => any[]} [mapper]
   */
  function htmlJoinAnd(array, mapper) {
    const result = [].concat(conjunction(array, mapper));
    return result.map(item => (typeof item === "string" ? html`${item}` : item));
  }

  /**
   * Creates and sets an ID to an element (elem) by hashing the text content.
   *
   * @param {HTMLElement} elem element to hash from
   * @param {String} prefix prefix to prepend to the generated id
   */
  function addHashId(elem, prefix = "") {
    const text = norm(elem.textContent);
    const hash = hashString(text);
    return addId(elem, prefix, hash);
  }

  /**
   * Creates and sets an ID to an element (elem) using a specific prefix if
   * provided, and a specific text if given.
   * @param {HTMLElement} elem element
   * @param {String} pfx prefix
   * @param {String} txt text
   * @param {Boolean} noLC do not convert to lowercase
   * @returns {String} generated (or existing) id for element
   */
  function addId(elem, pfx = "", txt = "", noLC = false) {
    if (elem.id) {
      return elem.id;
    }
    if (!txt) {
      txt = (elem.title ? elem.title : elem.textContent).trim();
    }
    let id = noLC ? txt : txt.toLowerCase();
    id = id
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\W+/gim, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    if (!id) {
      id = "generatedID";
    } else if (/\.$/.test(id) || !/^[a-z]/i.test(pfx || id)) {
      id = `x${id}`; // trailing . doesn't play well with jQuery
    }
    if (pfx) {
      id = `${pfx}-${id}`;
    }
    if (elem.ownerDocument.getElementById(id)) {
      let i = 0;
      let nextId = `${id}-${i}`;
      while (elem.ownerDocument.getElementById(nextId)) {
        i += 1;
        nextId = `${id}-${i}`;
      }
      id = nextId;
    }
    elem.id = id;
    return id;
  }

  /**
   * Returns all the descendant text nodes of an element.
   * @param {Node} el
   * @param {string[]} exclusions node localName to exclude
   * @param {object} options
   * @param {boolean} options.wsNodes return only whitespace-only nodes.
   * @returns {Text[]}
   */
  function getTextNodes(el, exclusions = [], options = { wsNodes: true }) {
    const exclusionQuery = exclusions.join(", ");
    const acceptNode = (/** @type {Text} */ node) => {
      if (!options.wsNodes && !node.data.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      if (exclusionQuery && node.parentElement.closest(exclusionQuery)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    };
    const nodeIterator = document.createNodeIterator(
      el,
      NodeFilter.SHOW_TEXT,
      acceptNode
    );
    /** @type {Text[]} */
    const textNodes = [];
    let node;
    while ((node = nodeIterator.nextNode())) {
      textNodes.push(/** @type {Text} */ (node));
    }
    return textNodes;
  }

  /**
   * For any element, returns an array of title strings that applies the algorithm
   * used for determining the actual title of a `<dfn>` element (but can apply to
   * other as well).
   *
   * This method now *prefers* the `data-lt` attribute for the list of titles.
   * That attribute is added by this method to `<dfn>` elements, so subsequent
   * calls to this method will return the `data-lt` based list.
   * @param {HTMLElement} elem
   * @returns {String[]} array of title strings
   */
  function getDfnTitles(elem) {
    const titleSet = new Set();
    // data-lt-noDefault avoid using the text content of a definition
    // in the definition list.
    // ltNodefault is === "data-lt-noDefault"... someone screwed up 😖
    const normText = "ltNodefault" in elem.dataset ? "" : norm(elem.textContent);
    const child = /** @type {HTMLElement | undefined} */ (elem.children[0]);
    if (elem.dataset.lt) {
      // prefer @data-lt for the list of title aliases
      elem.dataset.lt
        .split("|")
        .map(item => norm(item))
        .forEach(item => titleSet.add(item));
    } else if (
      elem.childNodes.length === 1 &&
      elem.getElementsByTagName("abbr").length === 1 &&
      child.title
    ) {
      titleSet.add(child.title);
    } else if (elem.textContent === '""') {
      titleSet.add("the-empty-string");
    }

    titleSet.add(normText);
    titleSet.delete("");

    // We could have done this with @data-lt (as the logic is same), but if
    // @data-lt was not present, we would end up using @data-local-lt as element's
    // id (in other words, we prefer textContent over @data-local-lt for dfn id)
    if (elem.dataset.localLt) {
      const localLt = elem.dataset.localLt.split("|");
      localLt.forEach(item => titleSet.add(norm(item)));
    }

    const titles = [...titleSet];
    return titles;
  }

  /**
   * For an element (usually <a>), returns an array of targets that element might
   * refer to, in the object structure:
   * @typedef {object} LinkTarget
   * @property {string} for
   * @property {string} title
   *
   * For an element like:
   *  <p data-link-for="Int1"><a data-link-for="Int2">Int3.member</a></p>
   * we'll return:
   *  * {for: "int2", title: "int3.member"}
   *  * {for: "int3", title: "member"}
   *  * {for: "", title: "int3.member"}
   * @param {HTMLElement} elem
   * @returns {LinkTarget[]}
   */
  function getLinkTargets(elem) {
    /** @type {HTMLElement} */
    const linkForElem = elem.closest("[data-link-for]");
    const linkFor = linkForElem ? linkForElem.dataset.linkFor : "";
    const titles = getDfnTitles(elem);
    const results = titles.reduce((result, title) => {
      // supports legacy <dfn>Foo.Bar()</dfn> definitions
      const split = title.split(".");
      if (split.length === 2) {
        // If there are multiple '.'s, this won't match an
        // Interface/member pair anyway.
        result.push({ for: split[0], title: split[1] });
      }
      result.push({ for: linkFor, title });
      if (!linkForElem) result.push({ for: title, title });

      // Finally, we can try to match without link for
      if (linkFor !== "") result.push({ for: "", title });
      return result;
    }, []);
    return results;
  }

  /**
   * Changes name of a DOM Element
   * @param {Element} elem element to rename
   * @param {String} newName new element name
   * @param {Object} options
   * @param {boolean} options.copyAttributes
   *
   * @returns {Element} new renamed element
   */
  function renameElement(
    elem,
    newName,
    options = { copyAttributes: true }
  ) {
    if (elem.localName === newName) return elem;
    const newElement = elem.ownerDocument.createElement(newName);
    // copy attributes
    if (options.copyAttributes) {
      for (const { name, value } of elem.attributes) {
        newElement.setAttribute(name, value);
      }
    }
    // copy child nodes
    newElement.append(...elem.childNodes);
    elem.replaceWith(newElement);
    return newElement;
  }

  /**
   * @param {string} ref
   * @param {HTMLElement} element
   */
  function refTypeFromContext(ref, element) {
    const closestInformative = element.closest(nonNormativeSelector);
    let isInformative = false;
    if (closestInformative) {
      // check if parent is not normative
      isInformative =
        !element.closest(".normative") ||
        !closestInformative.querySelector(".normative");
    }
    // prefixes `!` and `?` override section behavior
    if (ref.startsWith("!")) {
      if (isInformative) {
        // A (forced) normative reference in informative section is illegal
        return { type: "informative", illegal: true };
      }
      isInformative = false;
    } else if (ref.startsWith("?")) {
      isInformative = true;
    }
    const type = isInformative ? "informative" : "normative";
    return { type, illegal: false };
  }

  /**
   * Wraps inner contents with the wrapper node
   * @param {Node} outer outer node to be modified
   * @param {Element} wrapper wrapper node to be appended
   */
  function wrapInner(outer, wrapper) {
    wrapper.append(...outer.childNodes);
    outer.appendChild(wrapper);
    return outer;
  }

  /**
   * @param {Element} element
   */
  function getPreviousSections(element) {
    /** @type {Element[]} */
    const sections = [];
    for (const previous of iteratePreviousElements(element)) {
      if (previous.localName === "section") {
        sections.push(previous);
      }
    }
    return sections;
  }

  /**
   * @param {Element} element
   */
  function* iteratePreviousElements(element) {
    let previous = element;
    while (previous.previousElementSibling) {
      previous = previous.previousElementSibling;
      yield previous;
    }
  }
  /**
   * Applies the selector for all its ancestors.
   * @param {Element} element
   * @param {string} selector
   */
  function parents(element, selector) {
    /** @type {Element[]} */
    const list = [];
    let parent = element.parentElement;
    while (parent) {
      const closest = parent.closest(selector);
      if (!closest) {
        break;
      }
      list.push(closest);
      parent = closest.parentElement;
    }
    return list;
  }

  /**
   * Calculates indentation when the element starts after a newline. The value
   * will be empty if no newline or any non-whitespace exists after one.
   * @param {Element} element
   *
   * @example `    <div></div>` returns "    " (4 spaces).
   */
  function getElementIndentation(element) {
    const { previousSibling } = element;
    if (!previousSibling || previousSibling.nodeType !== Node.TEXT_NODE) {
      return "";
    }
    const index = previousSibling.textContent.lastIndexOf("\n");
    if (index === -1) {
      return "";
    }
    const slice = previousSibling.textContent.slice(index + 1);
    if (/\S/.test(slice)) {
      return "";
    }
    return slice;
  }

  /**
   * Generates simple ids. The id's increment after it yields.
   *
   * @param {String} namespace A string like "highlight".
   * @param {number} counter A number, which can start at a given value.
   */
  function msgIdGenerator(namespace, counter = 0) {
    /** @returns {Generator<string, never, never>}  */
    function* idGenerator(namespace, counter) {
      while (true) {
        yield `${namespace}:${counter}`;
        counter++;
      }
    }
    const gen = idGenerator(namespace, counter);
    return () => {
      return gen.next().value;
    };
  }

  /** @extends {Set<string>} */
  class InsensitiveStringSet extends Set {
    /**
     * @param {Array<String>} [keys] Optional, initial keys
     */
    constructor(keys = []) {
      super();
      for (const key of keys) {
        this.add(key);
      }
    }
    /**
     * @param {string} key
     */
    add(key) {
      if (!this.has(key) && !this.getCanonicalKey(key)) {
        return super.add(key);
      }
      return this;
    }
    /**
     * @param {string} key
     */
    has(key) {
      return (
        super.has(key) ||
        [...this.keys()].some(
          existingKey => existingKey.toLowerCase() === key.toLowerCase()
        )
      );
    }
    /**
     * @param {string} key
     */
    delete(key) {
      return super.has(key)
        ? super.delete(key)
        : super.delete(this.getCanonicalKey(key));
    }
    /**
     * @param {string} key
     */
    getCanonicalKey(key) {
      return super.has(key)
        ? key
        : [...this.keys()].find(
            existingKey => existingKey.toLowerCase() === key.toLowerCase()
          );
    }
  }

  /**
   * @param {HTMLElement} node
   */
  function makeSafeCopy(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll("[id]").forEach(elem => elem.removeAttribute("id"));
    clone.querySelectorAll("dfn").forEach(dfn => {
      renameElement(dfn, "span", { copyAttributes: false });
    });
    if (clone.hasAttribute("id")) clone.removeAttribute("id");
    removeCommentNodes(clone);
    return clone;
  }

  /**
   * @param {Node} node
   */
  function removeCommentNodes(node) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT);
    for (const comment of [...walkTree(walker)]) {
      comment.remove();
    }
  }

  /**
   * @template {Node} T
   * @param {TreeWalker<T>} walker
   * @return {IterableIterator<T>}
   */
  function* walkTree(walker) {
    while (walker.nextNode()) {
      yield /** @type {T} */ (walker.currentNode);
    }
  }

  /**
   * @template ValueType
   * @extends {Map<string, ValueType>}
   */
  class CaseInsensitiveMap extends Map {
    /**
     * @param {Array<[string, ValueType]>} [entries]
     */
    constructor(entries = []) {
      super();
      entries.forEach(([key, elem]) => {
        this.set(key, elem);
      });
      return this;
    }
    /**
     * @param {String} key
     * @param {ValueType} value
     */
    set(key, value) {
      super.set(key.toLowerCase(), value);
      return this;
    }
    /**
     * @param {String} key
     */
    get(key) {
      return super.get(key.toLowerCase());
    }
    /**
     * @param {String} key
     */
    has(key) {
      return super.has(key.toLowerCase());
    }
    /**
     * @param {String} key
     */
    delete(key) {
      return super.delete(key.toLowerCase());
    }
  }

  class RespecError extends Error {
    /**
     * @param {Parameters<typeof showError>[0]} message
     * @param {Parameters<typeof showError>[1]} plugin
     * @param {Parameters<typeof showError>[2] & { isWarning: boolean }} options
     */
    constructor(message, plugin, options) {
      super(message, { ...(options.cause && { cause: options.cause }) });
      const name = options.isWarning ? "ReSpecWarning" : "ReSpecError";
      Object.assign(this, { message, plugin, name, ...options });
      if (options.elements) {
        options.elements.forEach(elem =>
          markAsOffending(elem, message, options.title)
        );
      }
    }

    toJSON() {
      const { message, name, stack } = this;
      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/26792
      const { plugin, hint, elements, title, details } = this;
      return {
        message,
        name,
        plugin,
        hint,
        elements,
        title,
        details,
        stack,
        ...(this.cause instanceof Error && {
          cause: {
            name: this.cause.name,
            message: this.cause.message,
            stack: this.cause.stack,
          },
        }),
      };
    }
  }

  /**
   * @param {string} message
   * @param {string} pluginName Name of plugin that caused the error.
   * @param {object} [options]
   * @param {string} [options.hint] How to solve the error?
   * @param {HTMLElement[]} [options.elements] Offending elements.
   * @param {string} [options.title] Title attribute for offending elements. Can be a shorter form of the message.
   * @param {string} [options.details] Any further details/context.
   * @param {Error} [options.cause] The error that caused this one.
   */
  function showError(message, pluginName, options = {}) {
    const opts = { ...options, isWarning: false };
    pub("error", new RespecError(message, pluginName, opts));
  }

  /**
   * @param {string} message
   * @param {string} pluginName Name of plugin that caused the error.
   * @param {object} [options]
   * @param {string} [options.hint] How to solve the error?
   * @param {HTMLElement[]} [options.elements] Offending elements.
   * @param {string} [options.title] Title attribute for offending elements. Can be a shorter form of the message.
   * @param {string} [options.details] Any further details/context.
   * @param {Error} [options.cause] The error that caused this one.
   */
  function showWarning(message, pluginName, options = {}) {
    const opts = { ...options, isWarning: true };
    pub("warn", new RespecError(message, pluginName, opts));
  }

  /**
   * Creates showError, showWarning utilities for use in custom pre-process and
   * post-process plugins.
   * @param {string} pluginName
   */
  function makePluginUtils(pluginName) {
    /** @typedef {Parameters<typeof showError>[2]} Options */
    return {
      /** @type {(message: string, options?: Options) => void} */
      showError: (msg, options) => showError(msg, pluginName, options),
      /** @type {(message: string, options?: Options) => void} */
      showWarning: (msg, options) => showWarning(msg, pluginName, options),
    };
  }

  /**
   * Makes a string `coded`.
   *
   * @param {string} item
   * @returns {string}
   */
  function toMDCode(item) {
    return item ? `\`${item}\`` : "";
  }

  /**
   * Joins an array of strings, wrapping each string in back-ticks (`) for inline markdown code.
   *
   * @param {string[]} array
   * @param {object} options
   * @param {boolean} options.quotes Surround each item in quotes
   */
  function codedJoinOr(array, { quotes } = { quotes: false }) {
    return joinOr(array, quotes ? s => toMDCode(addQuotes(s)) : toMDCode);
  }

  /**
   * Wraps in back-ticks ` for code.
   *
   * @param {string[]} array
   * @param {object} options
   * @param {boolean} options.quotes Surround each item in quotes
   */
  function codedJoinAnd(array, { quotes } = { quotes: false }) {
    return joinAnd(array, quotes ? s => toMDCode(addQuotes(s)) : toMDCode);
  }

  function addQuotes(item) {
    return String(item) ? `"${item}"` : "";
  }

  /**
   * Tagged template string, helps with linking to documentation.
   * Things inside [squareBrackets] are considered direct links to the documentation.
   * To alias something, one can use a "|", like [respecConfig|#respec-configuration].
   * @param {TemplateStringsArray} strings
   * @param {string[]} keys
   */
  function docLink(strings, ...keys) {
    const linkifiedStr = strings
      .map((s, i) => {
        const key = keys[i];
        if (!key) {
          return s;
        }
        // Linkables are wrapped in square brackets
        if (!key.startsWith("[") && !key.endsWith("]")) {
          return s + key;
        }

        const [linkingText, href] = key.slice(1, -1).split("|");
        if (href) {
          const url = new URL(href, "https://respec.org/docs/");
          return `${s}[${linkingText}](${url})`;
        }
        return `${s}[\`${linkingText}\`](https://respec.org/docs/#${linkingText})`;
      })
      .join("");
    return reindent$1(linkifiedStr);
  }

  /**
   * Takes a text string, trims it, splits it into lines,
   * finds the common indentation level, and then de-indents every line
   * by that common indentation level.
   *
   * @param {string} text - The text to be re-indented.
   * @returns {string} The re-indented text.
   */
  function reindent$1(text) {
    if (!text) {
      return text;
    }
    const lines = text.trimEnd().split("\n");
    while (lines.length && !lines[0].trim()) {
      lines.shift();
    }
    const indents = lines.filter(s => s.trim()).map(s => s.search(/[^\s]/));
    const leastIndent = Math.min(...indents);
    return lines.map(s => s.slice(leastIndent)).join("\n");
  }

  // @ts-check
  /**
   * Module core/pubsubhub
   *
   * Returns a singleton that can be used for message broadcasting
   * and message receiving. Replaces legacy "msg" code in ReSpec.
   */
  const name$1d = "core/pubsubhub";

  const subscriptions = new EventTarget();

  /**
   *
   * @param {EventTopic} topic
   * @param  {any} detail
   */
  function pub(topic, detail) {
    subscriptions.dispatchEvent(new CustomEvent(topic, { detail }));
    if (window.parent === window.self) {
      return;
    }
    // If this is an iframe, postMessage parent (used in testing).
    const args = String(JSON.stringify(detail?.stack || detail));
    window.parent.postMessage({ topic, args }, window.parent.location.origin);
  }

  /**
   * Subscribes to a message type.
   * @param  {EventTopic} topic The topic to subscribe to
   * @param  {Function} cb         Callback function
   * @param  {Object} [options]
   * @param  {Boolean} [options.once] Add prop "once" for single notification.
   * @return {Object}              An object that should be considered opaque,
   *                               used for unsubscribing from messages.
   */
  function sub(topic, cb, options = { once: false }) {
    /** @param {CustomEvent} ev */
    const listener = async ev => {
      try {
        await cb(ev.detail);
      } catch (error) {
        const msg = `Error in handler for topic "${topic}": ${error.message}`;
        showError(msg, `sub:${topic}`, { cause: error });
      }
    };
    subscriptions.addEventListener(topic, listener, options);
  }

  expose(name$1d, { sub });

  // @ts-check
  // Module core/include-config
  // Inject's the document's configuration into the head as JSON.

  const removeList = ["githubToken", "githubUser"];

  function run$17(config) {
    const userConfig = {};
    const amendConfig = newValues => Object.assign(userConfig, newValues);

    amendConfig(config);
    sub("amend-user-config", amendConfig);

    sub("end-all", () => {
      const script = document.createElement("script");
      script.id = "initialUserConfig";
      script.type = "application/json";
      for (const prop of removeList) {
        if (prop in userConfig) delete userConfig[prop];
      }
      script.innerHTML = JSON.stringify(userConfig, null, 2);
      document.head.appendChild(script);
    });
  }

  // @ts-check
  /**
   * module: core/exporter
   * Exports a ReSpec document, based on mime type, so it can be saved, etc.
   * Also performs cleanup, removing things that shouldn't be in published documents.
   * That is, elements that have a "removeOnSave" css class.
   */


  const mimeTypes = new Map([
    ["text/html", "html"],
    ["application/xml", "xml"],
  ]);

  /**
   * Creates a dataURI from a ReSpec document. It also cleans up the document
   * removing various things.
   *
   * @param {String} mimeType mimetype. one of `mimeTypes` above
   * @param {Document} doc document to export. useful for testing purposes
   * @returns a stringified data-uri of document that can be saved.
   */
  function rsDocToDataURL(mimeType, doc = document) {
    const format = mimeTypes.get(mimeType);
    if (!format) {
      const validTypes = [...mimeTypes.values()].join(", ");
      const msg = `Invalid format: ${mimeType}. Expected one of: ${validTypes}.`;
      throw new TypeError(msg);
    }
    const data = serialize(format, doc);
    const encodedString = encodeURIComponent(data);
    return `data:${mimeType};charset=utf-8,${encodedString}`;
  }

  function serialize(format, doc) {
    const cloneDoc = doc.cloneNode(true);
    cleanup$3(cloneDoc);
    let result = "";
    switch (format) {
      case "xml":
        result = new XMLSerializer().serializeToString(cloneDoc);
        break;
      default: {
        prettify(cloneDoc);
        if (cloneDoc.doctype) {
          result += new XMLSerializer().serializeToString(cloneDoc.doctype);
        }
        result += cloneDoc.documentElement.outerHTML;
      }
    }
    return result;
  }

  function cleanup$3(cloneDoc) {
    const { head, body, documentElement } = cloneDoc;
    removeCommentNodes(cloneDoc);

    cloneDoc
      .querySelectorAll(".removeOnSave, #toc-nav")
      .forEach(elem => elem.remove());
    body.classList.remove("toc-sidebar");
    removeReSpec(documentElement);

    const insertions = cloneDoc.createDocumentFragment();

    // Move meta viewport, as it controls the rendering on mobile.
    const metaViewport = cloneDoc.querySelector("meta[name='viewport']");
    if (metaViewport && head.firstChild !== metaViewport) {
      insertions.appendChild(metaViewport);
    }

    // Move charset to near top, as it needs to be in the first 512 bytes.
    let metaCharset = cloneDoc.querySelector(
      "meta[charset], meta[content*='charset=']"
    );
    if (!metaCharset) {
      metaCharset = html`<meta charset="utf-8" />`;
    }
    insertions.appendChild(metaCharset);

    // Add meta generator
    const respecVersion = `ReSpec ${window.respecVersion || "Developer Channel"}`;
    const metaGenerator = html`
    <meta name="generator" content="${respecVersion}" />
  `;

    insertions.appendChild(metaGenerator);
    head.prepend(insertions);
    pub("beforesave", documentElement);
  }

  /** @param {Document} cloneDoc */
  function prettify(cloneDoc) {
    cloneDoc.querySelectorAll("style").forEach(el => {
      el.innerHTML = `\n${el.innerHTML}\n`;
    });
    cloneDoc.querySelectorAll("head > *").forEach(el => {
      el.outerHTML = `\n${el.outerHTML}`;
    });
  }

  expose("core/exporter", { rsDocToDataURL });

  // @ts-check
  /**
   * This module adds a `respec` object to the `document` with the following
   * readonly properties:
   *  - version: returns version of ReSpec Script.
   *  - ready: returns a promise that settles when ReSpec finishes processing.
   *
   */

  class ReSpec {
    constructor() {
      /** @type {Promise<void>} */
      this._respecDonePromise = new Promise(resolve => {
        sub("end-all", () => resolve(), { once: true });
      });

      this.errors = [];
      this.warnings = [];

      sub("error", rsError => {
        console.error(rsError, rsError.toJSON());
        this.errors.push(rsError);
      });
      sub("warn", rsError => {
        console.warn(rsError, rsError.toJSON());
        this.warnings.push(rsError);
      });
    }

    get version() {
      return window.respecVersion;
    }

    get ready() {
      return this._respecDonePromise;
    }

    async toHTML() {
      return serialize("html", document);
    }
  }

  function init() {
    const respec = new ReSpec();
    Object.defineProperty(document, "respec", { value: respec });
  }

  // @ts-check
  // Module core/override-configuration
  // A helper module that makes it possible to override settings specified in respecConfig
  // by passing them as a query string. This is useful when you just want to make a few
  // tweaks to a document before generating the snapshot, without mucking with the source.
  // For example, you can change the status and date by appending:
  //      ?specStatus=LC&publishDate=2012-03-15

  function run$16(config) {
    const params = new URLSearchParams(document.location.search);
    const overrideEntries = Array.from(params)
      .filter(([key, value]) => !!key && !!value)
      .map(([codedKey, codedValue]) => {
        const key = decodeURIComponent(codedKey);
        const decodedValue = decodeURIComponent(codedValue.replace(/%3D/g, "="));
        let value;
        try {
          value = JSON.parse(decodedValue);
        } catch {
          value = decodedValue;
        }
        return [key, value];
      });
    const overrideProps = Object.fromEntries(overrideEntries);
    Object.assign(config, overrideProps);
    pub("amend-user-config", overrideProps);
  }

  // @ts-check
  /**
   * Module core/post-process
   *
   * Corresponds to respecConfig.postProcess and config.afterEnd.
   *  - postProcess: an array of functions that get called
   *      after processing finishes. This is not recommended and the feature is not
   *      tested. Use with care, if you know what you're doing. Chances are you really
   *      want to be using a new module with your own profile.
   *  - afterEnd: final thing that is called.
   */

  const name$1c = "core/post-process";

  async function run$15(config) {
    if (Array.isArray(config.postProcess)) {
      const promises = config.postProcess
        .filter(f => {
          const isFunction = typeof f === "function";
          if (!isFunction) {
            const msg = "Every item in `postProcess` must be a JS function.";
            showError(msg, name$1c);
          }
          return isFunction;
        })
        .map(async (f, i) => {
          const fnName = `${name$1c}/${f.name || `[${i}]`}`;
          const utils = makePluginUtils(fnName);
          try {
            return await f(config, document, utils);
          } catch (err) {
            const msg = `Function ${f.name} threw an error during \`postProcess\`.`;
            const hint = "See developer console.";
            showError(msg, name$1c, { hint, cause: err });
          }
        });
      await Promise.all(promises);
    }
    if (typeof config.afterEnd === "function") {
      await config.afterEnd(config, document);
    }
  }

  // @ts-check
  /**
   * Module core/pre-process
   *
   * Corresponds to respecConfig.preProcess.
   *  - preProcess: an array of functions that get called
   *      before anything else happens. This is not recommended and the feature is not
   *      tested. Use with care, if you know what you're doing. Chances are you really
   *      want to be using a new module with your own profile
   */

  const name$1b = "core/pre-process";

  async function run$14(config) {
    if (Array.isArray(config.preProcess)) {
      const promises = config.preProcess
        .filter(f => {
          const isFunction = typeof f === "function";
          if (!isFunction) {
            const msg = "Every item in `preProcess` must be a JS function.";
            showError(msg, name$1b);
          }
          return isFunction;
        })
        .map(async (f, i) => {
          const fnName = `${name$1b}/${f.name || `[${i}]`}`;
          const utils = makePluginUtils(fnName);
          try {
            return await f(config, document, utils);
          } catch (err) {
            const msg = `Function ${f.name} threw an error during \`preProcess\`.`;
            const hint = "See developer console.";
            showError(msg, name$1b, { hint, cause: err });
          }
        });
      await Promise.all(promises);
    }
  }

  // @ts-check
  // Module core/base-runner
  // The module in charge of running the whole processing pipeline.

  const name$1a = "core/base-runner";

  async function runAll(plugs) {
    init();

    pub("start-all", respecConfig);
    run$17(respecConfig);
    run$16(respecConfig);
    performance.mark(`${name$1a}-start`);
    await run$14(respecConfig);

    const runnables = plugs.filter(p => isRunnableModule(p));
    runnables.forEach(
      plug => !plug.name && console.warn("Plugin lacks name:", plug)
    );
    await executePreparePass(runnables, respecConfig);
    await executeRunPass(runnables, respecConfig);
    pub("plugins-done", respecConfig);

    await run$15(respecConfig);
    pub("end-all");
    removeReSpec(document);
    performance.mark(`${name$1a}-end`);
    performance.measure(name$1a, `${name$1a}-start`, `${name$1a}-end`);
  }

  function isRunnableModule(plug) {
    return plug && (plug.run || plug.Plugin);
  }

  async function executePreparePass(runnables, config) {
    for (const plug of runnables.filter(p => p.prepare)) {
      try {
        await plug.prepare(config);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function executeRunPass(runnables, config) {
    for (const plug of runnables) {
      const name = plug.name || "";

      try {
        // eslint-disable-next-line no-async-promise-executor
        await new Promise(async (resolve, reject) => {
          const timerId = setTimeout(() => {
            const msg = `Plugin ${name} took too long.`;
            console.error(msg, plug);
            reject(new Error(msg));
          }, 15000);

          performance.mark(`${name}-start`);
          try {
            if (plug.Plugin) {
              await new plug.Plugin(config).run();
              resolve();
            } else if (plug.run) {
              await plug.run(config);
              resolve();
            }
          } catch (err) {
            reject(err);
          } finally {
            clearTimeout(timerId);
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  const css$o = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$p = css$o`
.respec-modal .close-button {
  position: absolute;
  z-index: inherit;
  padding: 0.2em;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
  border: none;
  background: transparent;
}

#respec-ui {
  position: fixed;
  display: flex;
  flex-direction: row-reverse;
  top: 20px;
  right: 20px;
  width: 202px;
  text-align: right;
  z-index: 9000;
}


#respec-pill,
.respec-info-button {
  height: 2.4em;
  background: #fff;
  background: var(--bg, #fff);
  color: rgb(120, 120, 120);
  color: var(--tocnav-normal-text, rgb(120, 120, 120));
  border: 1px solid #ccc;
  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);
  box-shadow: 1px 1px 8px 0 var(--tocsidebar-shadow, rgba(100, 100, 100, 0.5));
  padding: 0.2em 0em;
}

.respec-info-button {
  border: none;
  opacity: 0.75;
  border-radius: 2em;
  margin-right: 1em;
  min-width: 3.5em;
  will-change: opacity;
}

.respec-info-button:focus,
.respec-info-button:hover {
  opacity: 1;
  transition: opacity 0.2s;
}

#respec-pill {
  width: 4.8em;
}

#respec-pill:not(:disabled) {
  animation: respec-fadein 0.6s ease-in-out;
}

@keyframes respec-fadein {
  from {
    margin-top: -1.2em;
    border-radius: 50%;
    border: 0.2em solid rgba(100, 100, 100, 0.5);
    box-shadow: none;
    height: 4.8em;
  }
  to {
    margin-top: 0;
    border: 1px solid #ccc;
    border-radius: 0;
    box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);
    height: 2.4em;
  }
}

#respec-pill:disabled {
  margin-top: -1.2em;
  position: relative;
  border: none;
  box-shadow: none;
  border-radius: 50%;
  width: 4.8em;
  height: 4.8em;
  padding: 0;
}

#respec-pill:disabled::after {
  position: absolute;
  content: '';
  inset: -0.2em;
  border-radius: 50%;
  border: 0.2em solid rgba(100, 100, 100, 0.5);
  border-left: 0.2em solid transparent;
  animation: respec-spin 0.5s infinite linear;
}

@media (prefers-reduced-motion) {
  #respec-pill:not(:disabled) {
    animation: none;
  }

  #respec-pill:disabled::after {
    animation: none;
    border-left: 0.2em solid rgba(100, 100, 100, 0.5);
  }
}

@keyframes respec-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.respec-hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s linear;
}

.respec-visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s linear;
}

#respec-pill:hover,
#respec-pill:focus {
  color: rgb(0, 0, 0);
  background-color: rgb(245, 245, 245);
  transition: color 0.2s;
}

#respec-menu {
  position: absolute;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: var(--bg, #fff);
  color: var(--text, black);
  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);
  width: 200px;
  display: none;
  text-align: left;
  margin-top: 32px;
  font-size: 0.8em;
}

#respec-menu:not([hidden]) {
  display: block;
}

#respec-menu li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.respec-save-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(47%, 2fr));
  grid-gap: 0.5cm;
  padding: 0.5cm;
}

.respec-save-button:link {
  padding-top: 16px;
  color: var(--def-text, white);
  background: var(--def-bg, rgb(42, 90, 168));
  justify-self: stretch;
  height: 1cm;
  text-decoration: none;
  text-align: center;
  font-size: inherit;
  border: none;
  border-radius: 0.2cm;
}

.respec-save-button:link:hover {
  color: var(--def-text, white);
  background: var(--defrow-border, rgb(42, 90, 168));
  padding: 0;
  margin: 0;
  border: 0;
  padding-top: 16px;
}

.respec-save-button:link:focus {
  background: var(--tocnav-active-bg, #193766);
  color: var(--tocnav-active-text, black);
}

#respec-ui button:focus,
#respec-pill:focus,
.respec-option:focus {
  outline: 0;
  outline-style: none;
}

#respec-pill-error {
  background-color: red;
  color: white;
}

#respec-pill-warning {
  background-color: orange;
  color: white;
}

.respec-warning-list,
.respec-error-list {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  font-size: 0.85em;
}

.respec-warning-list {
  background-color: rgb(255, 251, 230);
}

:is(.respec-warning-list,.respec-error-list) > li {
  list-style-type: none;
  margin: 0;
  padding: .5em 0;
  padding-left: 2em;
  padding-right: .5em;
}

:is(.respec-warning-list,.respec-error-list) > li + li {
  margin-top: 0.5rem;
}

:is(.respec-warning-list,.respec-error-list) > li:before {
  position: absolute;
  left: .4em;
}

:is(.respec-warning-list,.respec-error-list) p {
  padding: 0;
  margin: 0;
}

.respec-warning-list > li {
  color: rgb(92, 59, 0);
  border-bottom: thin solid rgb(255, 245, 194);
}

.respec-error-list,
.respec-error-list li {
  background-color: rgb(255, 240, 240);
}

.respec-warning-list > li::before {
  content: "⚠️";
}

.respec-error-list > li::before {
  content: "💥";
}

.respec-error-list > li {
  color: rgb(92, 59, 0);
  border-bottom: thin solid rgb(255, 215, 215);
}

:is(.respec-warning-list,.respec-error-list) > li li {
  list-style: disc;
}

#respec-overlay {
  display: block;
  position: fixed;
  z-index: 10000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: #000;
}

.respec-show-overlay {
  transition: opacity 0.2s linear;
  opacity: 0.5;
}

.respec-hide-overlay {
  transition: opacity 0.2s linear;
  opacity: 0;
}

.respec-modal {
  display: block;
  position: fixed;
  z-index: 11000;
  top: 10%;
  background: var(--bg, #fff);
  color: var(--text, black);
  border: 5px solid #666;
  border-color: var(--tocsidebar-shadow, #666);
  min-width: 20%;
  padding: 0;
  max-height: 80%;
  overflow-y: auto;
  margin: 0 -0.5cm;
  left: 20%;
  max-width: 75%;
  min-width: 60%;
}


.respec-modal h3 {
  margin: 0;
  padding: 0.2em;
  left: 0 !important;
  text-align: center;
  background: var(--tocsidebar-shadow, #ddd);
  color: var(--text, black);
  font-size: 1em;
}

#respec-menu button.respec-option {
  background: var(--bg, white);
  color: var(--text, black);
  border: none;
  width: 100%;
  text-align: left;
  font-size: inherit;
  padding: 1.2em 1.2em;
}

#respec-menu button.respec-option:hover {
  background-color: var(--tocnav-hover-bg, #eee);
  color: var(--tocnav-hover-text, black);
}

.respec-cmd-icon {
  padding-right: 0.5em;
}

#respec-ui button.respec-option:first-child {
  margin-top: 0;
}
#respec-ui button.respec-option:last-child {
  border: none;
  border-radius: inherit;
  margin-bottom: 0;
}

.respec-button-copy-paste {
  position: absolute;
  height: 28px;
  width: 40px;
  cursor: pointer;
  background-image: linear-gradient(#fcfcfc, #eee);
  border: 1px solid rgb(144, 184, 222);
  border-left: 0;
  border-radius: 0px 0px 3px 0;
  -webkit-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  top: 0;
  left: 127px;
}

@media print {
  #respec-ui {
    display: none;
  }
}

.respec-iframe {
  width: 100%;
  min-height: 550px;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border: 0;
}

.respec-iframe:not(.ready) {
  background: url("https://respec.org/xref/loader.gif") no-repeat center;
}

.respec-iframe + a[href] {
  font-size: 0.9rem;
  float: right;
  margin: 0 0.5em 0.5em;
  border-bottom-width: 1px;
}

p:is(.respec-hint,.respec-occurrences) {
  display: block;
  margin-top: 0.5em;
}

.respec-plugin {
  text-align: right;
  color: rgb(120, 120, 120, .5);
  font-size: 0.6em;
}
`;

  // @ts-check
  /**
   * Module core/markdown
   * Handles the optional markdown processing.
   *
   * Markdown support is optional. It is enabled by setting the `format`
   * property of the configuration object to "markdown."
   *
   * We use marked for parsing Markdown:
   * https://github.com/markedjs/marked
   *
   */


  const name$19 = "core/markdown";

  const gtEntity = /&gt;/gm;
  const ampEntity = /&amp;/gm;

  class Renderer extends marked.Renderer {
    code(code, infoString, isEscaped) {
      const { language, ...metaData } = Renderer.parseInfoString(infoString);

      // regex to check whether the language is webidl
      if (/(^webidl$)/i.test(language)) {
        return `<pre class="idl">${code}</pre>`;
      }

      const html = super
        .code(code, language, isEscaped)
        .replace(`class="language-`, `class="`);

      const { example, illegalExample } = metaData;
      if (!example && !illegalExample) return html;

      const title = example || illegalExample;
      const className = `${language} ${example ? "example" : "illegal-example"}`;
      return html.replace("<pre>", `<pre title="${title}" class="${className}">`);
    }

    image(href, title, text) {
      if (!title) {
        return super.image(href, title, text);
      }
      const html = String.raw;
      return html`
      <figure>
        <img src="${href}" alt="${text}" />
        <figcaption>${title}</figcaption>
      </figure>
    `;
    }

    /**
     * @param {string} infoString
     */
    static parseInfoString(infoString) {
      const firstSpace = infoString.search(/\s/);
      if (firstSpace === -1) {
        return { language: infoString };
      }

      const language = infoString.slice(0, firstSpace);
      const metaDataStr = infoString.slice(firstSpace + 1);
      let metaData;
      if (metaDataStr) {
        try {
          metaData = JSON.parse(`{ ${metaDataStr} }`);
        } catch (error) {
          console.error(error);
        }
      }

      return { language, ...metaData };
    }

    heading(text, level, raw) {
      const headingWithIdRegex = /(.+)\s+{#([\w-]+)}$/;
      if (headingWithIdRegex.test(text)) {
        const [, textContent, id] = text.match(headingWithIdRegex);
        return `<h${level} id="${id}">${textContent}</h${level}>`;
      }
      return super.heading(text, level, raw);
    }
  }

  /** @type {import('marked').MarkedOptions} */
  const config = {
    gfm: true,
    renderer: new Renderer(),
  };

  /**
   * @param {string} text
   * @param {object} options
   * @param {boolean} options.inline
   */
  function markdownToHtml(text, options = { inline: false }) {
    const normalizedLeftPad = reindent$1(text);
    // As markdown is pulled from HTML, > and & are already escaped and
    // so blockquotes aren't picked up by the parser. This fixes it.
    const potentialMarkdown = normalizedLeftPad
      .replace(gtEntity, ">")
      .replace(ampEntity, "&");

    const result = options.inline
      ? marked.parseInline(potentialMarkdown, config)
      : marked.parse(potentialMarkdown, config);
    return result;
  }

  /**
   * @param {string} selector
   * @return {(el: Element) => Element[]}
   */
  function convertElements(selector) {
    return element => {
      const elements = element.querySelectorAll(selector);
      elements.forEach(convertElement);
      return Array.from(elements);
    };
  }

  /**
   * @param {Element} element
   */
  function convertElement(element) {
    for (const pre of element.getElementsByTagName("pre")) {
      // HTML parser implicitly removes a newline after <pre>
      // which breaks reindentation algorithm
      pre.prepend("\n");
    }
    element.innerHTML = markdownToHtml(element.innerHTML);
  }

  /**
   * CommonMark requires additional empty newlines between markdown and HTML lines.
   * This function adds them as a backward compatibility workaround.
   * @param {HTMLElement} element
   * @param {string} selector
   */
  function workaroundBlockLevelMarkdown(element, selector) {
    /** @type {NodeListOf<HTMLElement>} */
    const elements = element.querySelectorAll(selector);
    for (const element of elements) {
      const { innerHTML } = element;
      if (/^<\w/.test(innerHTML.trimStart())) {
        // if the block content starts with HTML-like format
        // then assume it doesn't need a workaround
        continue;
      }
      // Double newlines are needed to be parsed as Markdown
      const lines = innerHTML.split("\n");
      const firstTwo = lines.slice(0, 2).join("\n");
      const lastTwo = lines.slice(-2).join("\n");
      if (firstTwo.trim()) {
        element.prepend("\n\n");
      }
      if (lastTwo.trim()) {
        // keep the indentation of the end tag
        const indentation = getElementIndentation(element);
        element.append(`\n\n${indentation}`);
      }
    }
  }

  /**
   * @param {Iterable<Element>} elements
   */
  function substituteWithTextNodes(elements) {
    Array.from(elements).forEach(element => {
      element.replaceWith(element.textContent);
    });
  }

  const processMDSections = convertElements("[data-format='markdown']:not(body)");
  const blockLevelElements =
    "[data-format=markdown], section, div, address, article, aside, figure, header, main";

  function run$13(conf) {
    const hasMDSections = !!document.querySelector(
      "[data-format=markdown]:not(body)"
    );
    const isMDFormat = conf.format === "markdown";
    if (!isMDFormat && !hasMDSections) {
      return; // Nothing to be done
    }
    // Only has markdown-format sections
    if (!isMDFormat) {
      processMDSections(document.body);
      return;
    }
    // We transplant the UI to do the markdown processing
    const rsUI = document.getElementById("respec-ui");
    rsUI.remove();
    // The new body will replace the old body
    const newBody = document.body.cloneNode(true);
    // Marked expects markdown be flush against the left margin
    // so we need to normalize the inner text of some block
    // elements.
    workaroundBlockLevelMarkdown(newBody, blockLevelElements);
    convertElement(newBody);
    // Remove links where class .nolinks
    substituteWithTextNodes(newBody.querySelectorAll(".nolinks a[href]"));
    // Frankenstein the whole thing back together
    newBody.append(rsUI);
    document.body.replaceWith(newBody);
  }

  var markdown = /*#__PURE__*/Object.freeze({
    __proto__: null,
    markdownToHtml: markdownToHtml,
    name: name$19,
    run: run$13
  });

  // @ts-check
  // Module core/ui
  // Handles the ReSpec UI
  // XXX TODO
  //  - look at other UI things to add
  //      - list issues
  //      - lint: validator, link checker, check WebIDL, ID references
  //      - save to GitHub
  //  - make a release candidate that people can test
  //  - once we have something decent, merge, ship as 3.2.0

  // Opportunistically inserts the style, with the chance to reduce some FOUC
  insertStyle$1();

  function insertStyle$1() {
    const styleElement = document.createElement("style");
    styleElement.id = "respec-ui-styles";
    styleElement.textContent = css$p;
    styleElement.classList.add("removeOnSave");
    document.head.appendChild(styleElement);
    return styleElement;
  }

  function ariaDecorate(elem, ariaMap) {
    if (!elem) {
      return;
    }
    Array.from(ariaMap).forEach(([name, value]) => {
      elem.setAttribute(`aria-${name}`, value);
    });
  }

  const respecUI = html`<div id="respec-ui" class="removeOnSave" hidden></div>`;
  const menu = html`<ul
  id="respec-menu"
  role="menu"
  aria-labelledby="respec-pill"
  hidden
></ul>`;
  const closeButton = html`<button
  class="close-button"
  onclick=${() => ui.closeModal()}
  title="Close"
>
  ❌
</button>`;
  window.addEventListener("load", () => trapFocus(menu));
  let modal;
  let overlay;
  const errors = [];
  const warnings = [];
  const buttons = {};

  sub("start-all", () => document.body.prepend(respecUI), { once: true });
  sub("end-all", () => document.body.prepend(respecUI), { once: true });

  const respecPill = html`<button id="respec-pill" disabled>ReSpec</button>`;
  respecUI.appendChild(respecPill);
  respecPill.addEventListener("click", e => {
    e.stopPropagation();
    respecPill.setAttribute("aria-expanded", String(menu.hidden));
    toggleMenu();
    menu.querySelector("li:first-child button").focus();
  });

  document.documentElement.addEventListener("click", () => {
    if (!menu.hidden) {
      toggleMenu();
    }
  });
  respecUI.appendChild(menu);

  menu.addEventListener("keydown", e => {
    if (e.key === "Escape" && !menu.hidden) {
      respecPill.setAttribute("aria-expanded", String(menu.hidden));
      toggleMenu();
      respecPill.focus();
    }
  });

  function toggleMenu() {
    menu.classList.toggle("respec-hidden");
    menu.classList.toggle("respec-visible");
    menu.hidden = !menu.hidden;
  }

  // Code adapted from https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
  function trapFocus(element) {
    const focusableEls = element.querySelectorAll(
      "a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])"
    );
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    if (firstFocusableEl) {
      firstFocusableEl.focus();
    }
    element.addEventListener("keydown", e => {
      if (e.key !== "Tab") {
        return;
      }
      // shift + tab
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      }
      // tab
      else if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    });
  }

  const ariaMap = new Map([
    ["controls", "respec-menu"],
    ["expanded", "false"],
    ["haspopup", "true"],
    ["label", "ReSpec Menu"],
  ]);
  ariaDecorate(respecPill, ariaMap);

  function errWarn(err, arr, butName, title) {
    arr.push(err);
    if (!buttons.hasOwnProperty(butName)) {
      buttons[butName] = createWarnButton(butName, arr, title);
      respecUI.appendChild(buttons[butName]);
    }
    const button = buttons[butName];
    button.textContent = arr.length;
    const label = arr.length === 1 ? pluralize$1.singular(title) : title;
    const ariaMap = new Map([["label", `${arr.length} ${label}`]]);
    ariaDecorate(button, ariaMap);
  }

  function createWarnButton(butName, arr, title) {
    const buttonId = `respec-pill-${butName}`;
    const button = html`<button
    id="${buttonId}"
    class="respec-info-button"
  ></button>`;
    button.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "true");
      const ol = html`<ol class="${`respec-${butName}-list`}"></ol>`;
      for (const err of arr) {
        const fragment = document
          .createRange()
          .createContextualFragment(rsErrorToHTML(err));
        const li = document.createElement("li");
        // if it's only a single element, just copy the contents into li
        if (fragment.firstElementChild === fragment.lastElementChild) {
          li.append(...fragment.firstElementChild.childNodes);
          // Otherwise, take everything.
        } else {
          li.appendChild(fragment);
        }
        ol.appendChild(li);
      }
      ui.freshModal(title, ol, button);
    });
    const ariaMap = new Map([
      ["expanded", "false"],
      ["haspopup", "true"],
      ["controls", `respec-pill-${butName}-modal`],
    ]);
    ariaDecorate(button, ariaMap);
    return button;
  }

  const ui = {
    show() {
      try {
        respecUI.hidden = false;
      } catch (err) {
        console.error(err);
      }
    },
    hide() {
      respecUI.hidden = true;
    },
    enable() {
      respecPill.removeAttribute("disabled");
    },
    /**
     * @param {string} _keyShort shortcut key. unused - kept for backward compatibility.
     */
    addCommand(label, handler, _keyShort, icon) {
      icon = icon || "";
      const id = `respec-button-${label.toLowerCase().replace(/\s+/, "-")}`;
      const button = html`<button id="${id}" class="respec-option">
      <span class="respec-cmd-icon" aria-hidden="true">${icon}</span> ${label}…
    </button>`;
      const menuItem = html`<li role="menuitem">${button}</li>`;
      menuItem.addEventListener("click", handler);
      menu.appendChild(menuItem);
      return button;
    },
    error(rsError) {
      errWarn(rsError, errors, "error", "ReSpec Errors");
    },
    warning(rsError) {
      errWarn(rsError, warnings, "warning", "ReSpec Warnings");
    },
    closeModal(owner) {
      if (overlay) {
        overlay.classList.remove("respec-show-overlay");
        overlay.classList.add("respec-hide-overlay");
        overlay.addEventListener("transitionend", () => {
          overlay.remove();
          overlay = null;
        });
      }
      if (owner) {
        owner.setAttribute("aria-expanded", "false");
      }
      if (!modal) return;
      modal.remove();
      modal = null;
      respecPill.focus();
    },
    freshModal(title, content, currentOwner) {
      if (modal) modal.remove();
      if (overlay) overlay.remove();
      overlay = html`<div id="respec-overlay" class="removeOnSave"></div>`;
      const id = `${currentOwner.id}-modal`;
      const headingId = `${id}-heading`;
      modal = html`<div
      id="${id}"
      class="respec-modal removeOnSave"
      role="dialog"
      aria-labelledby="${headingId}"
    >
      ${closeButton}
      <h3 id="${headingId}">${title}</h3>
      <div class="inside">${content}</div>
    </div>`;
      const ariaMap = new Map([["labelledby", headingId]]);
      ariaDecorate(modal, ariaMap);
      document.body.append(overlay, modal);
      overlay.addEventListener("click", () => this.closeModal(currentOwner));
      overlay.classList.toggle("respec-show-overlay");
      modal.hidden = false;
      trapFocus(modal);
    },
  };
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") {
      ui.closeModal();
    }
  });
  window.respecUI = ui;
  sub("error", details => ui.error(details));
  sub("warn", details => ui.warning(details));

  function rsErrorToHTML(err) {
    if (typeof err === "string") {
      return err;
    }

    const plugin = err.plugin
      ? `<p class="respec-plugin">(plugin: "${err.plugin}")</p>`
      : "";

    const hint = err.hint
      ? `\n${markdownToHtml(
        `<p class="respec-hint"><strong>How to fix:</strong> ${reindent$1(
          err.hint
        )}`,
        {
          inline: !err.hint.includes("\n"),
        }
      )}\n`
      : "";
    const elements = Array.isArray(err.elements)
      ? `<p class="respec-occurrences">Occurred <strong>${
        err.elements.length
      }</strong> times at:</p>
    ${markdownToHtml(err.elements.map(generateMarkdownLink).join("\n"))}`
      : "";
    const details = err.details
      ? `\n\n<details>\n${err.details}\n</details>\n`
      : "";
    const msg = markdownToHtml(`**${xmlEscape(err.message)}**`, { inline: true });
    const result = `${msg}${hint}${elements}${details}${plugin}`;
    return result;
  }

  /**
   * @param {Element} element
   */
  function generateMarkdownLink(element) {
    return `* [\`<${element.localName}>\`](#${element.id}) element`;
  }

  // In case everything else fails, we want the error
  window.addEventListener("error", ev => {
    console.error(ev.error, ev.message, ev);
  });

  async function run$12(plugins) {
    try {
      ui.show();
      await domReady();
      await runAll(plugins);
    } finally {
      ui.enable();
    }
  }

  async function domReady() {
    if (document.readyState === "loading") {
      await new Promise(resolve =>
        document.addEventListener("DOMContentLoaded", resolve)
      );
    }
  }

  const modules = [
    // order is significant
    Promise.resolve().then(function () { return locationHash; }),
    Promise.resolve().then(function () { return l10n$D; }),
    Promise.resolve().then(function () { return group; }),
    Promise.resolve().then(function () { return defaults; }),
    Promise.resolve().then(function () { return style$1; }),
    Promise.resolve().then(function () { return style; }),
    Promise.resolve().then(function () { return github$1; }),
    Promise.resolve().then(function () { return dataInclude; }),
    Promise.resolve().then(function () { return markdown; }),
    Promise.resolve().then(function () { return reindent; }),
    Promise.resolve().then(function () { return title; }),
    Promise.resolve().then(function () { return level; }),
    Promise.resolve().then(function () { return headers; }),
    Promise.resolve().then(function () { return abstract; }),
    Promise.resolve().then(function () { return dataTransform; }),
    Promise.resolve().then(function () { return dataAbbr; }),
    Promise.resolve().then(function () { return inlines; }),
    Promise.resolve().then(function () { return conformance; }),
    Promise.resolve().then(function () { return dfn; }),
    Promise.resolve().then(function () { return pluralize; }),
    Promise.resolve().then(function () { return examples; }),
    Promise.resolve().then(function () { return issuesNotes; }),
    Promise.resolve().then(function () { return bestPractices; }),
    Promise.resolve().then(function () { return figures; }),
    Promise.resolve().then(function () { return tables; }),
    Promise.resolve().then(function () { return webidl; }),
    Promise.resolve().then(function () { return biblio$1; }),
    Promise.resolve().then(function () { return linkToDfn; }),
    Promise.resolve().then(function () { return xref; }),
    Promise.resolve().then(function () { return dataCite; }),
    Promise.resolve().then(function () { return renderBiblio; }),
    Promise.resolve().then(function () { return dfnIndex; }),
    Promise.resolve().then(function () { return contrib; }),
    Promise.resolve().then(function () { return sections; }),
    Promise.resolve().then(function () { return fixHeaders; }),
    Promise.resolve().then(function () { return webidlIndex; }),
    Promise.resolve().then(function () { return structure; }),
    Promise.resolve().then(function () { return informative; }),
    Promise.resolve().then(function () { return idHeaders; }),
    Promise.resolve().then(function () { return caniuse; }),
    Promise.resolve().then(function () { return mdnAnnotation; }),
    Promise.resolve().then(function () { return saveHtml; }),
    Promise.resolve().then(function () { return searchSpecref; }),
    Promise.resolve().then(function () { return searchXref; }),
    Promise.resolve().then(function () { return aboutRespec; }),
    Promise.resolve().then(function () { return seo$1; }),
    Promise.resolve().then(function () { return seo; }),
    Promise.resolve().then(function () { return highlight; }),
    Promise.resolve().then(function () { return webidlClipboard; }),
    Promise.resolve().then(function () { return dataTests; }),
    Promise.resolve().then(function () { return listSorter; }),
    Promise.resolve().then(function () { return highlightVars; }),
    Promise.resolve().then(function () { return dataType; }),
    Promise.resolve().then(function () { return algorithms; }),
    Promise.resolve().then(function () { return anchorExpander; }),
    Promise.resolve().then(function () { return dfnPanel; }),
    Promise.resolve().then(function () { return index; }),
    Promise.resolve().then(function () { return webMonetization; }),
    Promise.resolve().then(function () { return dfnContract; }),
    Promise.resolve().then(function () { return beforeSave; }),
    /* Linters must be the last thing to run */
    Promise.resolve().then(function () { return checkCharset; }),
    Promise.resolve().then(function () { return checkPunctuation; }),
    Promise.resolve().then(function () { return checkInternalSlots; }),
    Promise.resolve().then(function () { return localRefsExist; }),
    Promise.resolve().then(function () { return noCaptionlessTables; }),
    Promise.resolve().then(function () { return noUnusedDfns; }),
    Promise.resolve().then(function () { return noHeadinglessSections; }),
    Promise.resolve().then(function () { return noUnusedVars; }),
    Promise.resolve().then(function () { return requiredSections; }),
    Promise.resolve().then(function () { return wptTestsExist; }),
    Promise.resolve().then(function () { return noHttpProps; }),
    Promise.resolve().then(function () { return a11y; }),
    Promise.resolve().then(function () { return informativeDfn; }),
  ];

  Promise.all(modules)
    .then(plugins => run$12(plugins))
    .catch(err => console.error(err));

  // @ts-check
  // Module core/location-hash
  // As ReSpec injects a bunch of stuff async, the scroll position is not always
  // at the right place when we are done processing. The purpose of this module
  // is to reset window's location hash, which will cause the browser to scroll
  // the window to the correct point in the document when processing is done.

  const name$18 = "core/location-hash";

  function run$11() {
    if (!window.location.hash) {
      return;
    }

    // We have to use .then() here because otherwise we would get stuck
    // awaiting this plugin to finish.
    document.respec.ready.then(() => {
      const hash = decodeURIComponent(window.location.hash).slice(1);

      let newHash = hash;
      /** @type {HTMLElement|null} */
      const element = document.getElementById(newHash);

      // Check if hash contains any non-word character.
      const isLegacyFrag = /\W/.test(newHash);

      // Allow some degree of recovery for legacy fragments format.
      // See https://github.com/speced/respec/issues/1353
      if (!element && isLegacyFrag) {
        const id = newHash
          // Replace all non-word characters with a dash.
          .replace(/[\W]+/gim, "-")
          // Remove any leading dashes.
          .replace(/^-+/, "")
          // Remove any trailing dashes.
          .replace(/-+$/, "");

        /** @type {HTMLElement|null} */
        const updatedElement = document.getElementById(id);
        if (updatedElement) {
          newHash = id;
        }
      }
      window.location.hash = `#${newHash}`;
    });
  }

  var locationHash = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$18,
    run: run$11
  });

  // @ts-check
  /**
   * @module w3c/group
   * The purpose of this module is to fetch and set the working group configuration details.
   */

  const name$17 = "w3c/group";

  const W3C_GROUPS_API = "https://respec.org/w3c/groups/";

  /**
   * Fetches the group configuration details and adds them to the document's configuration.
   * @param {Conf} conf The document configuration object.
   * @return {Promise<void>} Resolves after setting the group configuration details.
   */
  async function run$10(conf) {
    if (!conf.group) {
      return;
    }

    const { group } = conf;
    const groupDetails = Array.isArray(group)
      ? await getMultipleGroupDetails(group)
      : await getGroupDetails(group);
    Object.assign(conf, groupDetails);
  }

  /**
   * Fetches configuration details for multiple groups concurrently.
   * @param {string[]} groups An array of group identifiers.
   * @return {Promise<object>} Resolves to an object containing the configuration details for each group.
   */
  async function getMultipleGroupDetails(groups) {
    const details = await Promise.all(groups.map(getGroupDetails));
    /** @type {{ [key in keyof GroupDetails]: GroupDetails[key][] }} */
    const result = {
      wg: [],
      wgId: [],
      wgURI: [],
      wgPatentURI: [],
      wgPatentPolicy: [],
      groupType: [],
    };
    for (const groupDetails of details.filter(Boolean)) {
      for (const key of Object.keys(result)) {
        result[key].push(groupDetails[key]);
      }
    }
    return result;
  }

  /**
   * Fetches configuration details for a single group.
   * @param {string} group A group identifier.
   * @return {Promise<GroupDetails|undefined>} Resolves to an object containing the group's configuration details, or undefined if the group could not be fetched.
   */
  async function getGroupDetails(group) {
    let type = "";
    let shortname = group;
    if (group.includes("/")) {
      [type, shortname] = group.split("/", 2);
    }
    const url = new URL(`${shortname}/${type}`, W3C_GROUPS_API);
    const res = await fetchAndCache(url.href);
    if (res.ok) {
      const json = await res.json();
      const {
        id: wgId,
        name: wg,
        patentURI: wgPatentURI,
        patentPolicy: wgPatentPolicy,
        type: groupType,
        wgURI,
      } = json;
      return { wg, wgId, wgURI, wgPatentURI, wgPatentPolicy, groupType };
    }

    const text = await res.text();
    let message = `Failed to fetch group details (HTTP: ${res.status}).`;
    let hint;
    if (res.status === 409) {
      [message, hint] = text.split("\n", 2);
    } else if (res.status === 404) {
      hint = docLink`See the list of [supported group names](https://respec.org/w3c/groups/) to use with the ${"[group]"} configuration option.`;
    }
    showError(message, name$17, { hint });
  }

  var group = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$17,
    run: run$10
  });

  // @ts-check

  const name$16 = "core/templates/show-link";

  /**
   * @param {object} link
   * @param {string} link.key
   * @param {string} [link.class]
   * @param {LinkData[]} [link.data]
   */
  function showLink(link) {
    if (!link.key) {
      const msg =
        "Found a link without `key` attribute in the configuration. See dev console.";
      showWarning(msg, name$16);
      console.warn(msg, link);
      return;
    }
    return html`
    <dt class="${link.class ? link.class : null}">${link.key}</dt>
    ${link.data ? link.data.map(showLinkData) : showLinkData(link)}
  `;
  }

  /**
   * @typedef {object} LinkData
   * @property {string} [LinkData.class]
   * @property {string} [LinkData.href]
   * @property {string} [LinkData.value]
   * @param {LinkData} data
   */
  function showLinkData(data) {
    return html`<dd class="${data.class ? data.class : null}">
    ${data.href
      ? html`<a href="${data.href}">${data.value || data.href}</a>`
      : data.value}
  </dd>`;
  }

  // @ts-check

  const name$15 = "core/templates/show-logo";

  /**
   * Logo mapper. Takes a logo structure and converts it to HTML.
   *
   * @param {object} logo
   * @param {string} logo.src
   * @param {string} logo.url
   * @param {string} logo.alt
   * @param {string} [logo.id]
   * @param {number} [logo.width]
   * @param {number} [logo.height]
   * @param {number} index
   */
  function showLogo(logo, index) {
    /** @type {HTMLAnchorElement} */
    const a = html`<a href="${logo.url || null}" class="logo"
    ><img
      alt="${logo.alt || null}"
      crossorigin
      height="${logo.height || null}"
      id="${logo.id || null}"
      src="${logo.src || null}"
      width="${logo.width || null}"
    />
  </a>`;
    if (!logo.alt) {
      const src = logo.src ? `, with \`src\` ${logo.src}, ` : "";
      const msg = `Logo at index ${index}${src} is missing required "\`alt\`" property.`;
      const hint = docLink`Add the missing "\`alt\`" property describing the logo. See ${"[logos]"} for more information.`;
      showError(msg, name$15, { hint, elements: [a] });
    }
    if (!logo.src) {
      const msg = `Logo at index ${index} is missing "\`src\`" property.`;
      const hint = docLink`The \`src\` property is required on every logo. See ${"[logos]"} for more information.`;
      showError(msg, name$15, { hint, elements: [a] });
    }
    return a;
  }

  // @ts-check

  const name$14 = "core/templates/show-people";

  const localizationStrings$B = {
    en: {
      until(date) {
        return html` Until ${date} `;
      },
    },
    es: {
      until(date) {
        return html` Hasta ${date} `;
      },
    },
    ko: {
      until(date) {
        return html` ${date} 이전 `;
      },
    },
    ja: {
      until(date) {
        return html` ${date} 以前 `;
      },
    },
    de: {
      until(date) {
        return html` bis ${date} `;
      },
    },
    zh: {
      until(date) {
        return html` 直到 ${date} `;
      },
    },
  };
  const l10n$B = getIntlData(localizationStrings$B);

  const orcidIcon = () =>
    html`<svg
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
  >
    <style>
      .st1 {
        fill: #fff;
      }
    </style>
    <path
      d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
      fill="#a6ce39"
    />
    <path
      class="st1"
      d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4zM88.7 56.8c0 5.5-4.5 10.1-10.1 10.1s-10.1-4.6-10.1-10.1c0-5.6 4.5-10.1 10.1-10.1s10.1 4.6 10.1 10.1z"
    />
  </svg>`;

  /**
   * @param {Conf} conf
   * @param {"editors" | "authors" | "formerEditors"} propName - the name of the property of the people to render.
   */
  function showPeople(conf, propName) {
    const people = conf[propName];
    if (!Array.isArray(people) || !people.length) return; // nothing to show...

    const validatePerson = personValidator(propName);
    return people.filter(validatePerson).map(personToHTML);
  }

  /**
   * @param {Person} person
   */
  function personToHTML(person) {
    // The following are treated as opt-in HTML by hyperHTML
    // we need to deprecate this!
    const personName = [person.name];
    const company = [person.company];
    const editorId = person.w3cid || null;
    const contents = [];
    if (person.mailto) {
      person.url = `mailto:${person.mailto}`;
    }
    if (person.url) {
      const url = new URL(person.url, document.location.href);
      const classList =
        url.protocol === "mailto:"
          ? "ed_mailto u-email email p-name"
          : "u-url url p-name fn";
      contents.push(
        html`<a class="${classList}" href="${person.url}">${personName}</a>`
      );
    } else {
      contents.push(html`<span class="p-name fn">${personName}</span>`);
    }
    if (person.orcid) {
      contents.push(
        html`<a class="p-name orcid" href="${person.orcid}">${orcidIcon()}</a>`
      );
    }
    if (person.company) {
      const hCard = "p-org org h-org";
      const companyElem = person.companyURL
        ? html`<a class="${hCard}" href="${person.companyURL}">${company}</a>`
        : html`<span class="${hCard}">${company}</span>`;
      contents.push(html` (${companyElem})`);
    }
    if (person.note) {
      contents.push(document.createTextNode(` (${person.note})`));
    }
    if (person.extras) {
      contents.push(...person.extras.map(extra => html`, ${renderExtra(extra)}`));
    }
    const { retiredDate } = person;
    if (person.retiredDate) {
      const time = html`<time datetime="${retiredDate}"
      >${W3CDate.format(new Date(retiredDate))}</time
    >`;
      contents.push(html` - ${l10n$B.until(time)} `);
    }
    const dd = html`<dd
    class="editor p-author h-card vcard"
    data-editor-id="${editorId}"
  >
    ${contents}
  </dd>`;
    return dd;
  }

  function renderExtra(extra) {
    const classVal = extra.class || null;
    const { name, href } = extra;
    return href
      ? html`<a href="${href}" class="${classVal}">${name}</a>`
      : html`<span class="${classVal}">${name}</span>`;
  }

  /**
   *
   * @param {string} prop
   */
  function personValidator(prop) {
    /**
     * @param {Person} person
     * @param {Number} index
     */
    return function validatePerson(person, index) {
      const docsUrl = "https://respec.org/docs/";
      const seePersonHint = `See [person](${docsUrl}#person) configuration for available options.`;
      const preamble =
        `Error processing the [person object](${docsUrl}#person) ` +
        `at index ${index} of the "[\`${prop}\`](${docsUrl}#${prop})" configuration option.`;

      if (!person.name) {
        const msg = `${preamble} Missing required property \`"name"\`.`;
        showError(msg, name$14, { hint: seePersonHint });
        return false;
      }

      if (person.orcid) {
        const { orcid } = person;
        const orcidUrl = new URL(orcid, "https://orcid.org/");

        if (orcidUrl.origin !== "https://orcid.org") {
          const msg = `${preamble} ORCID "${person.orcid}" at index ${index} is invalid.`;
          const hint = `The origin should be "https://orcid.org", not "${orcidUrl.origin}".`;
          showError(msg, name$14, { hint });
          return false;
        }

        // trailing slash would mess up checksum
        const orcidId = orcidUrl.pathname.slice(1).replace(/\/$/, "");
        if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(orcidId)) {
          const msg = `${preamble} ORCID "${orcidId}" has wrong format.`;
          const hint = `ORCIDs have the format "1234-1234-1234-1234."`;
          showError(msg, name$14, { hint });
          return false;
        }

        if (!checkOrcidChecksum(orcid)) {
          const msg = `${preamble} ORCID "${orcid}" failed checksum check.`;
          const hint = "Please check that the ORCID is valid.";
          showError(msg, name$14, { hint });
          return false;
        }

        // canonical form
        person.orcid = orcidUrl.href;
      }

      if (person.retiredDate && !isValidConfDate(person.retiredDate)) {
        const msg = `${preamble} The property "\`retiredDate\`" is not a valid date.`;
        showError(msg, name$14, {
          hint: `The expected format is YYYY-MM-DD. ${seePersonHint}`,
        });
        return false;
      }

      if (
        person.hasOwnProperty("extras") &&
        !validateExtras(person.extras, seePersonHint, preamble)
      ) {
        return false;
      }

      if (person.url && person.mailto) {
        const msg = `${preamble} Has both "url" and "mailto" property.`;
        showWarning(msg, name$14, {
          hint: `Please choose either "url" or "mailto" ("url" is preferred). ${seePersonHint}`,
        });
      }

      if (person.companyURL && !person.company) {
        const msg = `${preamble} Has a "\`companyURL\`" property but no "\`company\`" property.`;
        showWarning(msg, name$14, {
          hint: `Please add a "\`company\`" property. ${seePersonHint}.`,
        });
      }
      return true;
    };
  }

  /**
   *
   * @param {PersonExtras[]} extras
   * @param {string} hint
   * @param {string} preamble
   */
  function validateExtras(extras, hint, preamble) {
    if (!Array.isArray(extras)) {
      showError(
        `${preamble}. A person's "extras" member must be an array.`,
        name$14,
        { hint }
      );
      return false;
    }
    return extras.every((extra, index) => {
      switch (true) {
        case typeof extra !== "object":
          showError(
            `${preamble}. Member "extra" at index ${index} is not an object.`,
            name$14,
            {
              hint,
            }
          );
          return false;
        case !extra.hasOwnProperty("name"):
          showError(
            `${preamble} \`PersonExtra\` object at index ${index} is missing required "name" member.`,
            name$14,
            { hint }
          );
          return false;
        case typeof extra.name === "string" && extra.name.trim() === "":
          showError(
            `${preamble} \`PersonExtra\` object at index ${index} "name" can't be empty.`,
            name$14,
            { hint }
          );
          return false;
      }
      return true;
    });
  }

  /**
   * @param {string} orcid
   * @returns {boolean}
   */
  function checkOrcidChecksum(orcid) {
    // calculate checksum as per https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier
    const lastDigit = orcid[orcid.length - 1];
    const remainder = orcid
      .split("")
      .slice(0, -1)
      .filter(c => /\d/.test(c))
      .map(Number)
      .reduce((acc, c) => (acc + c) * 2, 0);
    const lastDigitInt = (12 - (remainder % 11)) % 11;
    const lastDigitShould = lastDigitInt === 10 ? "X" : String(lastDigitInt);
    return lastDigit === lastDigitShould;
  }

  // @ts-check

  const localizationStrings$A = {
    en: {
      archives: "archives",
      author: "Author:",
      authors: "Authors:",
      commit_history: "Commit history",
      edited_in_place: "edited in place",
      editor: "Editor:",
      editors: "Editors:",
      feedback: "Feedback:",
      former_editor: "Former editor:",
      former_editors: "Former editors:",
      history: "History:",
      implementation_report: "Implementation report:",
      latest_editors_draft: "Latest editor's draft:",
      latest_published_version: "Latest published version:",
      latest_recommendation: "Latest Recommendation:",
      message_topic: "… message topic …",
      more_details_about_this_doc: "More details about this document",
      multiple_alternates(plural) {
        return `This document is also available in ${
        plural ? "these non-normative formats" : "this non-normative format"
      }:`;
      },
      prev_editor_draft: "Previous editor's draft:",
      prev_recommendation: "Previous Recommendation:",
      prev_version: "Previous version:",
      publication_history: "Publication history",
      test_suite: "Test suite:",
      this_version: "This version:",
      with_subject_line: "with subject line",
      your_topic_here: "YOUR TOPIC HERE",
    },
    ko: {
      author: "저자:",
      authors: "저자:",
      editor: "편집자:",
      editors: "편집자:",
      former_editor: "이전 편집자:",
      former_editors: "이전 편집자:",
      latest_editors_draft: "최신 편집 초안:",
      latest_published_version: "최신 버전:",
      this_version: "현재 버전:",
    },
    zh: {
      author: "作者：",
      authors: "作者：",
      commit_history: "Git提交历史",
      editor: "编辑：",
      editors: "编辑：",
      feedback: "反馈：",
      former_editor: "原编辑：",
      former_editors: "原编辑：",
      history: "历史：",
      implementation_report: "实现报告：",
      latest_editors_draft: "最新编辑草稿：",
      latest_published_version: "最新发布版本：",
      latest_recommendation: "最新发布的正式推荐标准：",
      message_topic: "… 邮件主题 …",
      prev_editor_draft: "上一版编辑草稿：",
      prev_recommendation: "上一版正式推荐标准：",
      prev_version: "上一版：",
      test_suite: "测试套件：",
      this_version: "本版本：",
    },
    ja: {
      archives: "アーカイブ",
      author: "著者：",
      authors: "著者：",
      commit_history: "更新履歴",
      edited_in_place: "改版なく更新",
      editor: "編者：",
      editors: "編者：",
      feedback: "フィードバック:",
      former_editor: "以前の版の編者：",
      former_editors: "以前の版の編者：",
      history: "履歴:",
      implementation_report: "実装レポート：",
      latest_editors_draft: "最新の編集用草案：",
      latest_published_version: "最新バージョン：",
      latest_recommendation: "最新の勧告版:",
      message_topic: "… メール件名 …",
      more_details_about_this_doc: "この文書についてのより詳細",
      prev_editor_draft: "前回の編集用草案:",
      prev_recommendation: "前回の勧告版:",
      prev_version: "前回のバージョン:",
      publication_history: "公表履歴",
      test_suite: "テストスイート：",
      this_version: "このバージョン：",
      with_subject_line: "次の件名で",
    },
    nl: {
      author: "Auteur:",
      authors: "Auteurs:",
      editor: "Redacteur:",
      editors: "Redacteurs:",
      latest_editors_draft: "Laatste werkversie:",
      latest_published_version: "Laatst gepubliceerde versie:",
      this_version: "Deze versie:",
    },
    es: {
      archives: "archivos",
      author: "Autor:",
      authors: "Autores:",
      commit_history: "Historial de cambios",
      edited_in_place: "editado en lugar",
      editor: "Editor:",
      editors: "Editores:",
      feedback: "Comentarios:",
      former_editor: "Antiguo editor:",
      former_editors: "Antiguos editores:",
      history: "Historia:",
      implementation_report: "Informe de implementación:",
      latest_editors_draft: "Última versión del editor:",
      latest_published_version: "Última versión publicada:",
      latest_recommendation: "Recomendación más reciente:",
      message_topic: "… detalles de mensaje …",
      more_details_about_this_doc: "Más detalles sobre este documento:",
      publication_history: "Historial de publicación",
      prev_editor_draft: "Última versión del editor:",
      prev_recommendation: "Última Recomendación:",
      prev_version: "Última versión:",
      test_suite: "Suite de pruebas:",
      this_version: "Esta versión:",
      with_subject_line: "con línea de asunto",
      your_topic_here: "TU SUJETO AQUÍ",
    },
    de: {
      archives: "Archiv",
      author: "Autor/in:",
      authors: "Autor/innen:",
      commit_history: "Commit-Historie",
      edited_in_place: "zuletzt geändert am",
      editor: "Redaktion:",
      editors: "Redaktion:",
      feedback: "Feedback:",
      former_editor: "Frühere Mitwirkende:",
      former_editors: "Frühere Mitwirkende:",
      history: "Verlauf:",
      implementation_report: "Umsetzungsbericht:",
      latest_editors_draft: "Letzter Entwurf:",
      latest_published_version: "Letzte publizierte Fassung:",
      latest_recommendation: "Aktuellste Empfehlung:",
      more_details_about_this_doc: "Mehr Informationen über dieses Dokument",
      multiple_alternates(plural) {
        return `Dieses Dokument ist ebenfalls in ${
        plural
          ? "diesen nicht-normativen Formaten verfügbar"
          : "diesem nicht-normativen Format verfügbar"
      }:`;
      },
      prev_editor_draft: "Vorheriger Entwurf:",
      prev_recommendation: "Vorherige Empfehlung:",
      prev_version: "Vorherige Version:",
      publication_history: "Veröffentlichungsverlauf",
      test_suite: "Testumgebung:",
      this_version: "Diese Fassung:",
    },
  };
  const l10n$A = getIntlData(localizationStrings$A);

  function getSpecSubTitleElem(conf) {
    let specSubTitleElem = document.querySelector("h2#subtitle");

    if (specSubTitleElem && specSubTitleElem.parentElement) {
      specSubTitleElem.remove();
      conf.subtitle = specSubTitleElem.textContent.trim();
    } else if (conf.subtitle) {
      specSubTitleElem = document.createElement("h2");
      specSubTitleElem.textContent = conf.subtitle;
      specSubTitleElem.id = "subtitle";
    }
    if (specSubTitleElem) {
      specSubTitleElem.classList.add("subtitle");
    }
    return specSubTitleElem;
  }

  var headersTmpl = (conf, options) => {
    /**
     * After export, we let fixup.js handle the <details>.
     */
    sub("beforesave", doc => {
      const details = doc.querySelector(".head details");
      if (details) details.open = true;
    });
    return html`<div class="head">
    ${conf.logos.length
      ? html`<p class="logos">${conf.logos.map(showLogo)}</p>`
      : ""}
    ${document.querySelector("h1#title")} ${getSpecSubTitleElem(conf)}
    <p id="w3c-state">${renderSpecTitle(conf)}</p>
    <details open="${localStorage.getItem("tr-metadata") || "true"}">
      <summary>${l10n$A.more_details_about_this_doc}</summary>
      <dl>
        ${conf.thisVersion
          ? html`<dt>${l10n$A.this_version}</dt>
              <dd>
                <a class="u-url" href="${conf.thisVersion}"
                  >${conf.thisVersion}</a
                >
              </dd>`
          : ""}
        ${"latestVersion" in conf // latestVersion can be falsy
          ? html`<dt>${l10n$A.latest_published_version}</dt>
              <dd>
                ${conf.latestVersion
                  ? html`<a href="${conf.latestVersion}"
                      >${conf.latestVersion}</a
                    >`
                  : "none"}
              </dd>`
          : ""}
        ${conf.edDraftURI
          ? html`
              <dt>${l10n$A.latest_editors_draft}</dt>
              <dd><a href="${conf.edDraftURI}">${conf.edDraftURI}</a></dd>
            `
          : ""}
        ${conf.historyURI || conf.github
          ? html`<dt>${l10n$A.history}</dt>
              ${conf.historyURI
                ? html`<dd>
                    <a href="${conf.historyURI}">${conf.historyURI}</a>
                  </dd>`
                : ""}
              ${conf.github
                ? html`<dd>
                    <a href="${conf.github.commitHistoryURL}"
                      >${l10n$A.commit_history}</a
                    >
                  </dd>`
                : ""}`
          : ""}
        ${conf.testSuiteURI
          ? html`
              <dt>${l10n$A.test_suite}</dt>
              <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
            `
          : ""}
        ${conf.implementationReportURI
          ? html`
              <dt>${l10n$A.implementation_report}</dt>
              <dd>
                <a href="${conf.implementationReportURI}"
                  >${conf.implementationReportURI}</a
                >
              </dd>
            `
          : ""}
        ${conf.prevED
          ? html`
              <dt>${l10n$A.prev_editor_draft}</dt>
              <dd><a href="${conf.prevED}">${conf.prevED}</a></dd>
            `
          : ""}
        ${conf.showPreviousVersion
          ? html`
              <dt>${l10n$A.prev_version}</dt>
              <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
            `
          : ""}
        ${!conf.prevRecURI
          ? ""
          : conf.isRec
            ? html`
                <dt>${l10n$A.prev_recommendation}</dt>
                <dd><a href="${conf.prevRecURI}">${conf.prevRecURI}</a></dd>
              `
            : html`
                <dt>${l10n$A.latest_recommendation}</dt>
                <dd><a href="${conf.prevRecURI}">${conf.prevRecURI}</a></dd>
              `}
        ${conf.editors.length
          ? html`
              <dt>${conf.editors.length > 1 ? l10n$A.editors : l10n$A.editor}</dt>
              ${showPeople(conf, "editors")}
            `
          : ""}
        ${conf.formerEditors.length
          ? html`
              <dt>
                ${conf.formerEditors.length > 1
                  ? l10n$A.former_editors
                  : l10n$A.former_editor}
              </dt>
              ${showPeople(conf, "formerEditors")}
            `
          : ""}
        ${conf.authors.length
          ? html`
              <dt>${conf.authors.length > 1 ? l10n$A.authors : l10n$A.author}</dt>
              ${showPeople(conf, "authors")}
            `
          : ""}
        ${conf.github || conf.wgPublicList
          ? html`<dt>${l10n$A.feedback}</dt>
              ${renderFeedback(conf)}`
          : ""}
        ${conf.errata
          ? html`<dt>Errata:</dt>
              <dd><a href="${conf.errata}">Errata exists</a>.</dd>`
          : ""}
        ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
      </dl>
    </details>
    ${conf.isRec
      ? html`<p>
          See also
          <a
            href="${`https://www.w3.org/Translations/?technology=${conf.shortName}`}"
          >
            <strong>translations</strong></a
          >.
        </p>`
      : ""}
    ${conf.alternateFormats
      ? html`<p>
          ${l10n$A.multiple_alternates(options.multipleAlternates)}
          ${options.alternatesHTML}
        </p>`
      : ""}
    ${renderCopyright(conf)}
    <hr title="Separator for header" />
  </div>`;
  };

  function renderFeedback(conf) {
    const definitions = [];
    // Github feedback...
    if (conf.github) {
      const { repoURL, issuesURL, newIssuesURL, pullsURL, fullName } =
        conf.github;
      definitions.push(
        html`<dd>
        <a href="${repoURL}">GitHub ${fullName}</a>
        (<a href="${pullsURL}">pull requests</a>,
        <a href="${newIssuesURL}">new issue</a>,
        <a href="${issuesURL}">open issues</a>)
      </dd>`
      );
    }

    // The <a href="mailto:list?subject"> link for the public list
    if (conf.wgPublicList) {
      const mailToURL = new URL(`mailto:${conf.wgPublicList}@w3.org`);
      const subject =
        conf.subjectPrefix ?? `[${conf.shortName}] ${l10n$A.your_topic_here}`;
      const mailingListLink = html`<a
      href="${mailToURL.href}?subject=${encodeURIComponent(subject)}"
      >${mailToURL.pathname}</a
    >`;

      // The subject line...
      const subjectLine =
        conf.subjectPrefix ||
        html`[${conf.shortName}] <em>${l10n$A.message_topic}</em>`;
      const emailSubject = html`${l10n$A.with_subject_line}${" "}
      <kbd>${subjectLine}</kbd>`;

      // Archives link
      const archiveURL = new URL(
        conf.wgPublicList,
        "https://lists.w3.org/Archives/Public/"
      );
      const archiveLink = html`(<a href="${archiveURL}" rel="discussion"
        >${l10n$A.archives}</a
      >)`;

      definitions.push(
        html`<dd>${mailingListLink} ${emailSubject} ${archiveLink}</dd>`
      );
    }
    return definitions;
  }

  function renderSpecTitle(conf) {
    const specType = conf.isCR || conf.isCRY ? conf.longStatus : conf.textStatus;
    const preamble = conf.prependW3C
      ? html`<a href="https://www.w3.org/standards/types#${conf.specStatus}"
        >W3C ${specType}</a
      >`
      : html`${specType}`;
    return html`${preamble}${" "}
    <time class="dt-published" datetime="${conf.dashDate}"
      >${W3CDate.format(conf.publishDate)}</time
    >${conf.modificationDate
      ? html`, ${l10n$A.edited_in_place}${" "}
          <time
            class="dt-modified"
            datetime="${ISODate.format(conf.modificationDate)}"
            >${W3CDate.format(conf.modificationDate)}</time
          >`
      : ""}`;
  }

  /**
   * @param { LicenseInfo } licenseInfo license information
   */
  function linkLicense(licenseInfo) {
    const { url, short, name } = licenseInfo;
    if (name === "unlicensed") {
      return html`. <span class="issue">THIS DOCUMENT IS UNLICENSED</span>.`;
    }
    return html` and
    <a rel="license" href="${url}" title="${name}">${short}</a> rules apply.`;
  }

  function renderCopyright(conf) {
    // If there is already a copyright, let's relocate it.
    const existingCopyright = document.querySelector(".copyright");
    if (existingCopyright) {
      existingCopyright.remove();
      return existingCopyright;
    }
    if (conf.isUnofficial && conf.licenseInfo) {
      return html`<p class="copyright">
      Copyright &copy;
      ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
      the document editors/authors.
      ${conf.licenseInfo.name !== "unlicensed"
        ? html`Text is available under the
            <a rel="license" href="${conf.licenseInfo.url}"
              >${conf.licenseInfo.name}</a
            >; additional terms may apply.`
        : ""}
    </p>`;
    }
    return renderOfficialCopyright(conf);
  }

  function renderOfficialCopyright(conf) {
    return html`<p class="copyright">
    <a href="https://www.w3.org/policies/#copyright">Copyright</a>
    &copy;
    ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
    ${conf.additionalCopyrightHolders
      ? html` ${[conf.additionalCopyrightHolders]} &amp; `
      : ""}
    <a href="https://www.w3.org/">World Wide Web Consortium</a>.
    <abbr title="World Wide Web Consortium">W3C</abbr><sup>&reg;</sup>
    <a href="https://www.w3.org/policies/#Legal_Disclaimer">liability</a>,
    <a href="https://www.w3.org/policies/#W3C_Trademarks">trademark</a
    >${linkLicense(conf.licenseInfo)}
  </p>`;
  }

  // @ts-check

  var cgbgHeadersTmpl = (conf, options) => {
    const existingCopyright = document.querySelector(".copyright");
    if (existingCopyright) {
      existingCopyright.remove();
    }

    const specTitleElem = document.querySelector("h1#title");
    const specTitleElemClone = specTitleElem.cloneNode(true);

    return html`<div class="head">
    ${conf.logos.length
      ? html`<p class="logos">${conf.logos.map(showLogo)}</p>`
      : ""}
    ${specTitleElem} ${getSpecSubTitleElem(conf)}
    <p id="w3c-state">
      <a href="https://www.w3.org/standards/types#reports"
        >${conf.longStatus}</a
      >
      <time class="dt-published" datetime="${conf.dashDate}"
        >${W3CDate.format(conf.publishDate)}</time
      >
    </p>
    <dl>
      ${conf.thisVersion
        ? html`<dt>${l10n$A.this_version}</dt>
            <dd>
              <a class="u-url" href="${conf.thisVersion}"
                >${conf.thisVersion}</a
              >
            </dd>`
        : ""}
      ${"latestVersion" in conf // latestVersion can be falsy
        ? html`<dt>${l10n$A.latest_published_version}</dt>
            <dd>
              ${conf.latestVersion
                ? html`<a href="${conf.latestVersion}"
                    >${conf.latestVersion}</a
                  >`
                : "none"}
            </dd>`
        : ""}
      ${conf.edDraftURI
        ? html`
            <dt>${l10n$A.latest_editors_draft}</dt>
            <dd><a href="${conf.edDraftURI}">${conf.edDraftURI}</a></dd>
          `
        : ""}
      ${conf.testSuiteURI
        ? html`
            <dt>Test suite:</dt>
            <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
          `
        : ""}
      ${conf.implementationReportURI
        ? html`
            <dt>Implementation report:</dt>
            <dd>
              <a href="${conf.implementationReportURI}"
                >${conf.implementationReportURI}</a
              >
            </dd>
          `
        : ""}
      ${conf.prevVersion
        ? html`
            <dt>Previous version:</dt>
            <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
          `
        : ""}
      ${!conf.isCGFinal
        ? html`
            ${conf.prevED
              ? html`
                  <dt>Previous editor's draft:</dt>
                  <dd><a href="${conf.prevED}">${conf.prevED}</a></dd>
                `
              : ""}
          `
        : ""}
      ${conf.editors.length
        ? html`
            <dt>${conf.editors.length > 1 ? l10n$A.editors : l10n$A.editor}</dt>
            ${showPeople(conf, "editors")}
          `
        : ""}
      ${conf.formerEditors.length
        ? html`
            <dt>
              ${conf.formerEditors.length > 1
                ? l10n$A.former_editors
                : l10n$A.former_editor}
            </dt>
            ${showPeople(conf, "formerEditors")}
          `
        : ""}
      ${conf.authors.length
        ? html`
            <dt>${conf.authors.length > 1 ? l10n$A.authors : l10n$A.author}</dt>
            ${showPeople(conf, "authors")}
          `
        : ""}
      ${conf.github || conf.wgPublicList
        ? html`<dt>${l10n$A.feedback}</dt>
            ${renderFeedback(conf)}`
        : ""}
      ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
    </dl>
    ${conf.alternateFormats
      ? html`<p>
          ${options.multipleAlternates
            ? "This document is also available in these non-normative formats:"
            : "This document is also available in this non-normative format:"}
          ${options.alternatesHTML}
        </p>`
      : ""}
    ${existingCopyright
      ? existingCopyright
      : html`<p class="copyright">
          <a href="https://www.w3.org/policies/#copyright">Copyright</a>
          &copy;
          ${conf.copyrightStart
            ? `${conf.copyrightStart}-`
            : ""}${conf.publishYear}
          ${conf.additionalCopyrightHolders
            ? html` ${[conf.additionalCopyrightHolders]} &amp; `
            : ""}
          the Contributors to the ${specTitleElemClone.childNodes}
          Specification, published by the
          <a href="${conf.wgURI}">${conf.wg}</a> under the
          ${conf.isCGFinal
            ? html`
                <a href="https://www.w3.org/community/about/agreements/fsa/"
                  >W3C Community Final Specification Agreement (FSA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/fsa-deed/"
                  >summary</a
                >
                is available.
              `
            : html`
                <a href="https://www.w3.org/community/about/agreements/cla/"
                  >W3C Community Contributor License Agreement (CLA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/cla-deed/"
                  >summary</a
                >
                is available.
              `}
        </p>`}
    <hr title="Separator for header" />
  </div>`;
  };

  // @ts-check
  const localizationStrings$z = {
    en: {
      sotd: "Status of This Document",
      status_at_publication: html`This section describes the status of this
      document at the time of its publication. A list of current W3C
      publications and the latest revision of this technical report can be found
      in the
      <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>.`,
    },
    ko: {
      sotd: "현재 문서의 상태",
      status_at_publication: html`이 부분은 현재 문서의 발행 당시 상태에 대해
      기술합니다. W3C 발행 문서의 최신 목록 및 테크니컬 리포트 최신판의
      <a href="https://www.w3.org/TR/">W3C standards and drafts index</a> 에서
      열람할 수 있습니다.`,
    },
    zh: {
      sotd: "关于本文档",
      // eslint-disable-next-line prettier/prettier
      status_at_publication: html`本章节描述了本文档的发布状态。W3C的文档列表和最新版本可通过<a
        href="https://www.w3.org/TR/"
        >W3C技术报告</a
      >索引访问。`,
    },
    ja: {
      sotd: "この文書の位置付け",
      status_at_publication: html`この節には、公開時点でのこの文書の位置づけが記されている。現時点でのW3Cの発行文書とこのテクニカルレポートの最新版は、下記から参照できる。
      <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>`,
    },
    nl: {
      sotd: "Status van dit document",
    },
    es: {
      sotd: "Estado de este Document",
      status_at_publication: html`Esta sección describe el estado del presente
      documento al momento de su publicación. Una lista de las publicaciones
      actuales del W3C y la última revisión del presente informe técnico puede
      hallarse en
      <a href="https://www.w3.org/TR/">el índice de normas y borradores</a> del
      W3C.`,
    },
    de: {
      sotd: "Status dieses Dokuments",
      status_at_publication: html`Dieser Abschnitt beschreibt den Status des
      Dokuments zum Zeitpunkt der Publikation. Eine Liste der aktuellen
      Publikatinen des W3C und die aktuellste Fassung dieser Spezifikation kann
      im <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>.`,
    },
  };

  const l10n$z = getIntlData(localizationStrings$z);

  const processLink = "https://www.w3.org/policies/process/20231103/";

  function prefix(word) {
    return /^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`;
  }

  var sotdTmpl = (conf, opts) => {
    return html`
    <h2>${l10n$z.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    ${conf.isUnofficial
      ? renderIsUnofficial(opts)
      : conf.isTagFinding
        ? opts.additionalContent
        : conf.isNoTrack
          ? renderIsNoTrack(conf, opts)
          : html`
              <p><em>${l10n$z.status_at_publication}</em></p>
              ${conf.isMemberSubmission
                ? noteForSubmission(conf, opts)
                : html`
                    ${!conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                    ${!conf.overrideStatus
                      ? html` ${linkToWorkingGroup(conf)} `
                      : ""}
                    ${conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                    ${conf.isRec ? renderIsRec(conf) : renderNotRec(conf)}
                    ${renderDeliverer(conf)}
                    <p>
                      This document is governed by the
                      <a id="w3c_process_revision" href="${processLink}"
                        >03 November 2023 W3C Process Document</a
                      >.
                    </p>
                  `}
            `}
    ${opts.additionalSections}
  `;
  };

  function renderPreview(conf) {
    const { prUrl, prNumber, edDraftURI } = conf;
    return html`<details class="annoying-warning" open="">
    <summary>
      This is a
      preview${prUrl && prNumber
        ? html`
            of pull request
            <a href="${prUrl}">#${prNumber}</a>
          `
        : ""}
    </summary>
    <p>
      Do not attempt to implement this version of the specification. Do not
      reference this version as authoritative in any way.
      ${edDraftURI
        ? html`
            Instead, see
            <a href="${edDraftURI}">${edDraftURI}</a> for the Editor's draft.
          `
        : ""}
    </p>
  </details>`;
  }

  function renderIsUnofficial(opts) {
    const { additionalContent } = opts;
    return html`
    <p>
      This document is a draft of a potential specification. It has no official
      standing of any kind and does not represent the support or consensus of
      any standards organization.
    </p>
    ${additionalContent}
  `;
  }

  function renderIsNoTrack(conf, opts) {
    const { isMO } = conf;
    const { additionalContent } = opts;
    return html`
    <p>
      This document is merely a W3C-internal
      ${isMO ? "member-confidential" : ""} document. It has no official standing
      of any kind and does not represent consensus of the W3C Membership.
    </p>
    ${additionalContent}
  `;
  }

  function renderNotRec(conf) {
    const updatableRec = document.querySelector("#sotd.updateable-rec");
    let statusExplanation = null;
    let reviewPolicy = null;
    let endorsement = html`Publication as ${prefix(conf.textStatus)} does not
  imply endorsement by W3C and its Members.`;
    let updatePolicy = html`<p>
    This is a draft document and may be updated, replaced, or obsoleted by other
    documents at any time. It is inappropriate to cite this document as other
    than a work in progress.
    ${updatableRec
      ? html`Future updates to this specification may incorporate
          <a href="${processLink}#allow-new-features">new features</a>.`
      : ""}
  </p>`;
    if (conf.specStatus === "DISC") {
      updatePolicy = html`<p>
      Publication as a Discontinued Draft implies that this document is no
      longer intended to advance or to be maintained. It is inappropriate to
      cite this document as other than abandoned work.
    </p>`;
    }
    const lsUpdatePolicy = html`<p>
    This document is maintained and updated at any time. Some parts of this
    document are work in progress.
  </p>`;
    switch (conf.specStatus) {
      case "STMT":
        endorsement = html`<p>
        A W3C Statement is a specification that, after extensive
        consensus-building, is endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> and its Members.
      </p>`;
        break;
      case "RY":
        endorsement = html`<p>W3C recommends the wide usage of this registry.</p>
        <p>
          A W3C Registry is a specification that, after extensive
          consensus-building, is endorsed by
          <abbr title="World Wide Web Consortium">W3C</abbr> and its Members.
        </p>`;
        break;
      case "CRD":
        statusExplanation = html`A Candidate Recommendation Draft integrates
      changes from the previous Candidate Recommendation that the Working Group
      intends to include in a subsequent Candidate Recommendation Snapshot.`;
        if (conf.pubMode === "LS") {
          updatePolicy = lsUpdatePolicy;
        }
        break;
      case "CRYD":
        statusExplanation = html`A Candidate Registry Draft integrates changes
      from the previous Candidate Registry Snapshot that the Working Group
      intends to include in a subsequent Candidate Registry Snapshot.`;
        if (conf.pubMode === "LS") {
          updatePolicy = lsUpdatePolicy;
        }
        break;
      case "CRY":
        statusExplanation = html`A Candidate Registry Snapshot has received
        <a href="${processLink}#dfn-wide-review">wide review</a>.`;
        reviewPolicy = html`<p>
        The W3C Membership and other interested parties are invited to review
        the document and send comments through ${conf.humanPREnd}. Advisory
        Committee Representatives should consult their
        <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
          >WBS questionnaires</a
        >. Note that substantive technical comments were expected during the
        Candidate Recommendation review period that ended ${conf.humanCREnd}.
      </p>`;
        break;
      case "CR":
        statusExplanation = html`A Candidate Recommendation Snapshot has received
        <a href="${processLink}#dfn-wide-review">wide review</a>, is intended to
        gather
        <a href="${conf.implementationReportURI}">implementation experience</a>,
        and has commitments from Working Group members to
        <a href="https://www.w3.org/policies/patent-policy/#sec-Requirements"
          >royalty-free licensing</a
        >
        for implementations.`;
        updatePolicy = html`${updatableRec
        ? html`Future updates to this specification may incorporate
            <a href="${processLink}#allow-new-features">new features</a>.`
        : ""}`;
        if (conf.pubMode === "LS") {
          reviewPolicy = html`<p>
          Comments are welcome at any time but most especially before
          ${W3CDate.format(conf.crEnd)}.
        </p>`;
        } else {
          reviewPolicy = html`<p>
          This Candidate Recommendation is not expected to advance to Proposed
          Recommendation any earlier than ${W3CDate.format(conf.crEnd)}.
        </p>`;
        }
        break;
      case "PR":
        reviewPolicy = html`<p>
        The W3C Membership and other interested parties are invited to review
        the document and send comments through ${W3CDate.format(conf.prEnd)}.
        Advisory Committee Representatives should consult their
        <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
          >WBS questionnaires</a
        >. Note that substantive technical comments were expected during the
        Candidate Recommendation review period that ended
        ${W3CDate.format(conf.crEnd)}.
      </p>`;
        break;
      case "DNOTE":
        endorsement = html`${conf.textStatus}s are not endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> nor its Members.`;
        break;
      case "NOTE":
        endorsement = html`This ${conf.textStatus} is endorsed by
        ${getWgHTML(conf)}, but is not endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> itself nor its
        Members.`;
        updatePolicy = "";
        break;
    }
    return html`<p>${endorsement} ${statusExplanation}</p>
    ${updatePolicy} ${reviewPolicy}`;
  }

  function renderIsRec(conf) {
    const { revisedRecEnd } = conf;
    const updatableRec = document.querySelector("#sotd.updateable-rec");
    let reviewTarget = "";
    if (document.querySelector(".proposed-addition")) {
      reviewTarget = "additions";
    } else if (document.querySelector(".proposed-correction")) {
      reviewTarget = "corrections";
    }
    return html`
    <p>
      W3C recommends the wide deployment of this specification as a standard for
      the Web.
    </p>

    <p>
      A W3C Recommendation is a specification that, after extensive
      consensus-building, is endorsed by
      <abbr title="World Wide Web Consortium">W3C</abbr> and its Members, and
      has commitments from Working Group members to
      <a href="https://www.w3.org/policies/patent-policy/#sec-Requirements"
        >royalty-free licensing</a
      >
      for implementations.
      ${updatableRec
        ? html`Future updates to this Recommendation may incorporate
            <a href="${processLink}#allow-new-features">new features</a>.`
        : ""}
    </p>
    ${document.querySelector(".addition")
      ? html`<p class="addition">
          Candidate additions are marked in the document.
        </p>`
      : ""}
    ${document.querySelector(".correction")
      ? html`<p class="correction">
          Candidate corrections are marked in the document.
        </p>`
      : ""}
    ${document.querySelector(".proposed-addition")
      ? html`<p class="addition proposed">
          Proposed additions are marked in the document.
        </p>`
      : ""}
    ${document.querySelector(".proposed-correction")
      ? html`<p class="correction proposed">
          Proposed corrections are marked in the document.
        </p>`
      : ""}
    ${reviewTarget
      ? html`<p>
          The W3C Membership and other interested parties are invited to review
          the proposed ${reviewTarget} and send comments through
          ${W3CDate.format(revisedRecEnd)}. Advisory Committee Representatives
          should consult their
          <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
            >WBS questionnaires</a
          >.
        </p>`
      : ""}
  `;
  }

  function renderDeliverer(conf) {
    const {
      isNote,
      isRegistry,
      wgId,
      multipleWGs,
      wgPatentHTML,
      wgPatentURI,
      wgPatentPolicy,
    } = conf;

    const patentPolicyURL =
      wgPatentPolicy === "PP2017"
        ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
        : "https://www.w3.org/policies/patent-policy/";

    const producers = !(isNote || isRegistry)
      ? html`
        This document was produced by ${multipleWGs ? "groups" : "a group"}
        operating under the
        <a href="${patentPolicyURL}"
          >${wgPatentPolicy === "PP2017" ? "1 August 2017 " : ""}W3C Patent
          Policy</a
        >.
      `
      : html`
        The
        <a href="${patentPolicyURL}"
          >${wgPatentPolicy === "PP2017" ? "1 August 2017 " : ""}W3C Patent
          Policy</a
        >
        does not carry any licensing requirements or commitments on this
        document.
      `;
    return html`<p data-deliverer="${isNote || isRegistry ? wgId : null}">
    ${producers}
    ${!(isNote || isRegistry)
      ? html`
          ${multipleWGs
            ? html` W3C maintains ${wgPatentHTML} `
            : html`
                W3C maintains a
                <a href="${[wgPatentURI]}" rel="disclosure"
                  >public list of any patent disclosures</a
                >
              `}
          made in connection with the deliverables of
          ${multipleWGs
            ? "each group; these pages also include"
            : "the group; that page also includes"}
          instructions for disclosing a patent. An individual who has actual
          knowledge of a patent that the individual believes contains
          <a href="${patentPolicyURL}#def-essential">Essential Claim(s)</a>
          must disclose the information in accordance with
          <a href="${patentPolicyURL}#sec-Disclosure"
            >section 6 of the W3C Patent Policy</a
          >.
        `
      : ""}
  </p>`;
  }

  function noteForSubmission(conf, opts) {
    return html`
    ${opts.additionalContent}
    ${conf.isMemberSubmission ? noteForMemberSubmission(conf) : ""}
  `;
  }

  function noteForMemberSubmission(conf) {
    const teamComment = `https://www.w3.org/Submission/${conf.publishDate.getUTCFullYear()}/${
    conf.submissionCommentNumber
  }/Comment/`;

    const patentPolicyURL =
      conf.wgPatentPolicy === "PP2017"
        ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
        : "https://www.w3.org/policies/patent-policy/";

    return html`<p>
    By publishing this document, W3C acknowledges that the
    <a href="${conf.thisVersion}">Submitting Members</a> have made a formal
    Submission request to W3C for discussion. Publication of this document by
    W3C indicates no endorsement of its content by W3C, nor that W3C has, is, or
    will be allocating any resources to the issues addressed by it. This
    document is not the product of a chartered W3C group, but is published as
    potential input to the
    <a href="https://www.w3.org/policies/process/">W3C Process</a>. A
    <a href="${teamComment}">W3C Team Comment</a> has been published in
    conjunction with this Member Submission. Publication of acknowledged Member
    Submissions at the W3C site is one of the benefits of
    <a href="https://www.w3.org/Consortium/Prospectus/Joining">
      W3C Membership</a
    >. Please consult the requirements associated with Member Submissions of
    <a href="${patentPolicyURL}#sec-submissions"
      >section 3.3 of the W3C Patent Policy</a
    >. Please consult the complete
    <a href="https://www.w3.org/Submission"
      >list of acknowledged W3C Member Submissions</a
    >.
  </p>`;
  }

  function renderPublicList(conf, opts) {
    const { mailToWGPublicListWithSubject, mailToWGPublicListSubscription } =
      opts;
    const { wgPublicList, subjectPrefix } = conf;
    const archivesURL = `https://lists.w3.org/Archives/Public/${wgPublicList}/`;
    return html`<p>
    If you wish to make comments regarding this document, please send them to
    <a href="${mailToWGPublicListWithSubject}">${wgPublicList}@w3.org</a>
    (<a href="${mailToWGPublicListSubscription}">subscribe</a>,
    <a href="${archivesURL}">archives</a>)${subjectPrefix
      ? html` with <code>${subjectPrefix}</code> at the start of your email's
          subject`
      : ""}.
  </p>`;
  }

  function linkToWorkingGroup(conf) {
    if (!conf.wg) {
      return;
    }
    let changes = null;
    const proposedAdditions = document.querySelector(".proposed-addition");
    const proposedCorrections = document.querySelector(".proposed-correction");
    const additions = document.querySelector(".addition");
    const corrections = document.querySelector(".correction");
    const hasRevisions =
      proposedAdditions || proposedCorrections || additions || corrections;
    if (conf.isRec && hasRevisions) {
      if (
        (proposedAdditions && proposedCorrections) ||
        (additions && corrections)
      ) {
        changes = html`It includes
      ${proposedAdditions
        ? html`<a href="${processLink}#proposed-amendments">
            proposed amendments</a
          >`
        : html`<a href="${processLink}#candidate-amendments">
            candidate amendments</a
          >`},
      introducing substantive changes and new features since the previous
      Recommendation.`;
      } else if (proposedAdditions || additions) {
        changes = html`It includes
      ${proposedAdditions
        ? html`<a href="${processLink}#proposed-addition">
            proposed additions</a
          >`
        : html`<a href="${processLink}#candidate-addition">
            candidate additions</a
          >`},
      introducing new features since the previous Recommendation.`;
      } else if (proposedCorrections || corrections) {
        changes = html`It includes
      ${proposedCorrections
        ? html`<a href="${processLink}#proposed-corrections">
            proposed corrections</a
          >`
        : html`<a href="${processLink}#candidate-correction">
            candidate corrections</a
          >`}.`;
      }
    }
    const track = status2track[conf.specStatus]
      ? html` using the
        <a href="${processLink}#recs-and-notes"
          >${status2track[conf.specStatus]} track</a
        >`
      : "";
    return html`<p>
    This document was published by ${getWgHTML(conf)} as
    ${prefix(conf.longStatus)}${track}. ${changes}
  </p>`;
  }

  function getWgHTML(conf) {
    if (Array.isArray(conf.wg)) {
      return htmlJoinAnd(conf.wg, (wg, idx) => {
        return html`the <a href="${conf.wgURI[idx]}">${wg}</a>`;
      });
    } else if (conf.wg) {
      return html`the <a href="${conf.wgURI}">${conf.wg}</a>`;
    }
  }

  function linkToCommunity(conf, opts) {
    if (!conf.github && !conf.wgPublicList) {
      return;
    }
    return html`<p>
    ${conf.github
      ? html`
          <a href="${conf.issueBase}">GitHub Issues</a> are preferred for
          discussion of this specification.
        `
      : ""}
    ${conf.wgPublicList
      ? html`
          ${conf.github && conf.wgPublicList
            ? "Alternatively, you can send comments to our mailing list."
            : "Comments regarding this document are welcome."}
          Please send them to
          <a href="${opts.mailToWGPublicListWithSubject}"
            >${conf.wgPublicList}@w3.org</a
          >
          (<a href="${opts.mailToWGPublicListSubscription}">subscribe</a>,
          <a
            href="${`https://lists.w3.org/Archives/Public/${conf.wgPublicList}/`}"
            >archives</a
          >)${conf.subjectPrefix
            ? html` with <code>${conf.subjectPrefix}</code> at the start of your
                email's subject`
            : ""}.
        `
      : ""}
  </p>`;
  }

  // @ts-check

  var cgbgSotdTmpl = (conf, opts) => {
    return html`
    <h2>${l10n$z.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    <p>
      This specification was published by the
      <a href="${conf.wgURI}">${conf.wg}</a>. It is not a W3C Standard nor is it
      on the W3C Standards Track.
      ${conf.isCGFinal
        ? html`
            Please note that under the
            <a href="https://www.w3.org/community/about/agreements/final/"
              >W3C Community Final Specification Agreement (FSA)</a
            >
            other conditions apply.
          `
        : html`
            Please note that under the
            <a href="https://www.w3.org/community/about/agreements/cla/"
              >W3C Community Contributor License Agreement (CLA)</a
            >
            there is a limited opt-out and other conditions apply.
          `}
      Learn more about
      <a href="https://www.w3.org/community/"
        >W3C Community and Business Groups</a
      >.
    </p>
    ${!conf.sotdAfterWGinfo ? opts.additionalContent : ""}
    ${!conf.github && conf.wgPublicList ? renderPublicList(conf, opts) : ""}
    ${conf.github ? linkToCommunity(conf, opts) : ""}
    ${conf.sotdAfterWGinfo ? opts.additionalContent : ""}
    ${opts.additionalSections}
  `;
  };

  // @ts-check
  // Module w3c/headers
  // Generate the headers material based on the provided configuration.
  // CONFIGURATION
  //  - specStatus: the short code for the specification's maturity level or type (required)
  //  - shortName: the small name that is used after /TR/ in published reports (required)
  //  - editors: an array of people editing the document (at least one is required). People
  //      are defined using:
  //          - name: the person's name (required)
  //          - url: URI for the person's home page
  //          - company: the person's company
  //          - companyURL: the URI for the person's company
  //          - mailto: the person's email
  //          - note: a note on the person (e.g. former editor)
  //  - authors: an array of people who are contributing authors of the document.
  //  - formerEditors: an array of people that had earlier edited the document but no longer edit.
  //  - subtitle: a subtitle for the specification
  //  - publishDate: the date to use for the publication, default to document.lastModified, and
  //      failing that to now. The format is YYYY-MM-DD or a Date object.
  //  - previousPublishDate: the date on which the previous version was published.
  //  - previousMaturity: the specStatus of the previous version
  //  - errata: the URI of the errata document, if any
  //  - alternateFormats: a list of alternate formats for the document, each of which being
  //      defined by:
  //          - uri: the URI to the alternate
  //          - label: a label for the alternate
  //          - lang: optional language
  //          - type: optional MIME type
  //  - logos: a list of logos to use instead of the W3C logo, each of which being defined by:
  //          - src: the URI to the logo (target of <img src=>)
  //          - alt: alternate text for the image (<img alt=>), defaults to "Logo" or "Logo 1", "Logo 2", ...
  //            if src is not specified, this is the text of the "logo"
  //          - height: optional height of the logo (<img height=>)
  //          - width: optional width of the logo (<img width=>)
  //          - url: the URI to the organization represented by the logo (target of <a href=>)
  //          - id: optional id for the logo, permits custom CSS (wraps logo in <span id=>)
  //          - each logo element must specify either src or alt
  //  - testSuiteURI: the URI to the test suite, if any
  //  - implementationReportURI: the URI to the implementation report, if any
  //  - noRecTrack: set to true if this document is not intended to be on the Recommendation track
  //  - edDraftURI: the URI of the Editor's Draft for this document, if any. Required if
  //      specStatus is set to "ED".
  //  - additionalCopyrightHolders: a copyright owner in addition to W3C (or the only one if specStatus
  //      is unofficial)
  //  - copyrightStart: the year from which the copyright starts running
  //  - prevED: the URI of the previous Editor's Draft if it has moved
  //  - prevRecShortname: the short name of the previous Recommendation, if the name has changed
  //  - prevRecURI: the URI of the previous Recommendation if not directly generated from
  //    prevRecShortname.
  //  - wg: the name of the WG in charge of the document. This may be an array in which case wgURI
  //      and wgPatentURI need to be arrays as well, of the same length and in the same order
  //  - wgURI: the URI to the group's page, or an array of such
  //  - wgPatentURI: the URI to the group's patent information page, or an array of such. NOTE: this
  //      is VERY IMPORTANT information to provide and get right, do not just paste this without checking
  //      that you're doing it right
  //  - wgPublicList: the name of the mailing list where discussion takes place. Note that this cannot
  //      be an array as it is assumed that there is a single list to discuss the document, even if it
  //      is handled by multiple groups
  //  - charterDisclosureURI: used for IGs (when publishing IG-NOTEs) to provide a link to the IPR commitment
  //      defined in their charter.
  //  - thisVersion: the URI to the dated current version of the specification. ONLY ever use this for CG/BG
  //      documents, for all others it is autogenerated.
  //  - latestVersion: the URI to the latest version of the specification.
  //  - prevVersion: the URI to the previous (dated) version of the specification. ONLY ever use this for CG/BG
  //      documents, for all others it is autogenerated.
  //  - subjectPrefix: the string that is expected to be used as a subject prefix when posting to the mailing
  //      list of the group.
  //  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
  //         Example of usage: [{key: "foo", href:"https://b"}, {key: "bar", href:"https://"}].
  //         Allowed values are:
  //          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
  //          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
  //          - href: a URL for the value (e.g., "https://foo.com/issues"). Optional.
  //          - class: a string representing CSS classes. Optional.
  //  - license: can be one of the following
  //      - "cc-by", which is experimentally available in some groups (but likely to be phased out).
  //          Note that this is a dual licensing regime.
  //      - "document", which is the old, but still available, document license.
  //      - "dual", dual license.
  //      - "cc0", an extremely permissive license. It is only recommended if you are working on a document that is
  //          intended to be pushed to the WHATWG.
  //      - "w3c-software", a permissive and attributions license (but GPL-compatible).
  //      - "w3c-software-doc", (default) the W3C Software and Document License
  //            https://www.w3.org/copyright/software-license-2023/

  const name$13 = "w3c/headers";

  /**
   * Resolves against https://www.w3.org.
   * @param {string} href
   */
  function w3Url(href) {
    return new URL(href, "https://www.w3.org/").href;
  }

  const status2maturity = {
    LS: "WD",
    LD: "WD",
    FPWD: "WD",
    "Member-SUBM": "SUBM",
  };

  const status2text = {
    DNOTE: "Group Draft Note",
    NOTE: "Group Note",
    STMT: "Statement",
    "Member-SUBM": "Member Submission",
    MO: "Member-Only Document",
    ED: "Editor's Draft",
    LS: "Living Standard",
    LD: "Living Document",
    FPWD: "First Public Working Draft",
    WD: "Working Draft",
    CR: "Candidate Recommendation",
    CRD: "Candidate Recommendation",
    PR: "Proposed Recommendation",
    REC: "Recommendation",
    DISC: "Discontinued Draft",
    RSCND: "Rescinded Recommendation",
    DRY: "Draft Registry",
    CRYD: "Candidate Registry",
    CRY: "Candidate Registry",
    RY: "Registry",
    unofficial: "Unofficial Draft",
    UD: "Unofficial Draft",
    base: "",
    finding: "TAG Finding",
    "draft-finding": "Draft TAG Finding",
    "editor-draft-finding": "Draft TAG Finding",
    "CG-DRAFT": "Draft Community Group Report",
    "CG-FINAL": "Final Community Group Report",
    "BG-DRAFT": "Draft Business Group Report",
    "BG-FINAL": "Final Business Group Report",
  };
  const status2long = {
    ...status2text,
    CR: "Candidate Recommendation Snapshot",
    CRD: "Candidate Recommendation Draft",
    CRY: "Candidate Registry Snapshot",
    CRYD: "Candidate Registry Draft",
  };
  const status2track = {
    DNOTE: "Note",
    NOTE: "Note",
    STMT: "Note",
    "WG-NOTE": "Note",
    "IG-NOTE": "Note",
    FPWD: "Recommendation",
    WD: "Recommendation",
    CR: "Recommendation",
    CRD: "Recommendation",
    PR: "Recommendation",
    REC: "Recommendation",
    DISC: "Recommendation",
    RSCND: "Recommendation",
    DRY: "Registry",
    CRYD: "Registry",
    CRY: "Registry",
    RY: "Registry",
  };
  const W3CNotes = ["DNOTE", "NOTE", "STMT"];
  const recTrackStatus = [
    "CR",
    "CRD",
    "DISC",
    "FPWD",
    "PR",
    "REC",
    "RSCND",
    "WD",
  ];
  const registryTrackStatus = ["DRY", "CRY", "CRYD", "RY"];
  const tagStatus = ["draft-finding", "finding", "editor-draft-finding"];
  const cgStatus = ["CG-DRAFT", "CG-FINAL"];
  const bgStatus = ["BG-DRAFT", "BG-FINAL"];
  const cgbgStatus = [...cgStatus, ...bgStatus];
  const trStatus = [
    ...W3CNotes,
    ...recTrackStatus,
    ...registryTrackStatus,
  ];
  const noTrackStatus = [
    "base",
    ...cgStatus,
    ...bgStatus,
    "editor-draft-finding",
    "draft-finding",
    "finding",
    "MO",
    "unofficial",
  ];
  /** @type {Map<string, LicenseInfo>} */
  const licenses = new Map([
    [
      "cc0",
      {
        name: "Creative Commons 0 Public Domain Dedication",
        short: "CC0",
        url: "https://creativecommons.org/publicdomain/zero/1.0/",
      },
    ],
    [
      "w3c-software",
      {
        name: "W3C Software Notice and License",
        short: "W3C Software",
        url: "https://www.w3.org/copyright/software-license-2002/",
      },
    ],
    [
      "w3c-software-doc",
      {
        name: "W3C Software and Document Notice and License",
        short: "permissive document license",
        url: "https://www.w3.org/copyright/software-license-2023/",
      },
    ],
    [
      "cc-by",
      {
        name: "Creative Commons Attribution 4.0 International Public License",
        short: "CC-BY",
        url: "https://creativecommons.org/licenses/by/4.0/legalcode",
      },
    ],
    [
      "document",
      {
        name: "W3C Document License",
        short: "document use",
        url: "https://www.w3.org/copyright/document-license/",
      },
    ],
    [
      "dual",
      {
        name: "W3C Dual License",
        short: "dual license",
        url: "https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html",
      },
    ],
    [
      undefined,
      {
        name: "unlicensed",
        url: null,
        short: "UNLICENSED",
      },
    ],
  ]);

  const patentPolicies = ["PP2017", "PP2020"];

  /**
   * @param {*} conf
   * @param {string} prop
   * @param {string | number | Date} fallbackDate
   */
  function validateDateAndRecover(conf, prop, fallbackDate = new Date()) {
    const date = conf[prop] ? new Date(conf[prop]) : new Date(fallbackDate);
    // if date is valid
    if (Number.isFinite(date.valueOf())) {
      const formattedDate = ISODate.format(date);
      return new Date(formattedDate);
    }
    const msg = docLink`${prop} is not a valid date: "${conf[prop]}". Expected format 'YYYY-MM-DD'.`;
    showError(msg, name$13);
    return new Date(ISODate.format(new Date()));
  }

  function deriveLicenseInfo(conf) {
    let license = undefined;
    if (typeof conf.license === "string") {
      const lCaseLicense = conf.license.toLowerCase();
      if (!licenses.has(lCaseLicense)) {
        const msg = `The license "\`${conf.license}\`" is not supported.`;
        const choices = codedJoinOr(
          [...licenses.keys()].filter(k => k),
          {
            quotes: true,
          }
        );
        const hint = docLink`Please set
        ${"[license]"} to one of: ${choices}. If in doubt, remove \`license\` and let ReSpec pick one for you.`;
        showError(msg, name$13, { hint });
      } else {
        license = lCaseLicense;
      }
    }

    if (conf.isUnofficial && !license) {
      license = "cc-by";
    }

    // W3C docs can't be CC-BY or CC0
    if (!conf.isUnofficial && ["cc-by", "cc0"].includes(license)) {
      const msg = docLink`License "\`${conf.license}\`" is not allowed for W3C Specifications.`;
      const hint = docLink`Please set ${"[license]"} to \`"w3c-software-doc"\` instead.`;
      showError(msg, name$13, { hint });
    }
    const licenseInfo = licenses.get(license);
    return licenseInfo;
  }

  async function run$$(conf) {
    conf.isBasic = conf.specStatus === "base";
    conf.isCGBG = cgbgStatus.includes(conf.specStatus);
    conf.isCGFinal = conf.isCGBG && conf.specStatus.endsWith("G-FINAL");
    conf.isCR = conf.specStatus === "CR" || conf.specStatus === "CRD";
    conf.isCRDraft = conf.specStatus === "CRD";
    conf.isCRY = conf.specStatus === "CRY" || conf.specStatus === "CRYD";
    conf.isEd = conf.specStatus === "ED";
    conf.isMemberSubmission = conf.specStatus === "Member-SUBM";
    conf.isMO = conf.specStatus === "MO";
    conf.isNote = W3CNotes.includes(conf.specStatus);
    conf.isNoTrack = noTrackStatus.includes(conf.specStatus);
    conf.isPR = conf.specStatus === "PR";
    conf.isRecTrack = recTrackStatus.includes(conf.specStatus);
    conf.isRec = conf.isRecTrack && conf.specStatus === "REC";
    conf.isRegistry = registryTrackStatus.includes(conf.specStatus);
    conf.isRegular = !conf.isCGBG && !conf.isBasic;
    conf.isTagEditorFinding = conf.specStatus === "editor-draft-finding";
    conf.isTagFinding = tagStatus.includes(conf.specStatus);
    conf.isUnofficial = conf.specStatus === "unofficial";
    conf.licenseInfo = deriveLicenseInfo(conf);
    conf.prependW3C = !conf.isBasic && !conf.isUnofficial;
    conf.longStatus = status2long[conf.specStatus];
    conf.textStatus = status2text[conf.specStatus];
    conf.showPreviousVersion = false;

    if (conf.isRegular && !conf.shortName) {
      const msg = docLink`The ${"[shortName]"} configuration option is required for this kind of document.`;
      const hint = docLink`Please set ${"[shortName]"} to a short name for the specification.`;
      showError(msg, name$13, { hint });
    }

    conf.publishDate = validateDateAndRecover(
      conf,
      "publishDate",
      document.lastModified
    );
    conf.publishYear = conf.publishDate.getUTCFullYear();
    if (conf.modificationDate) {
      conf.modificationDate = validateDateAndRecover(
        conf,
        "modificationDate",
        document.lastModified
      );
    }

    if (conf.isRecTrack && !conf.github && !conf.wgPublicList) {
      const msg =
        "W3C Process requires a either a link to a public repository or mailing list.";
      const hint = docLink`Use the ${"[github]"} configuration option to add a link to a repository. Alternatively use ${"[wgPublicList]"} to link to a mailing list.`;
      showError(msg, name$13, {
        hint,
      });
    }

    if (conf.isEd && !conf.edDraftURI) {
      const msg = docLink`Editor's Drafts should set ${"[edDraftURI]"} configuration option.`;
      const hint = docLink`Please set ${"[edDraftURI]"} to the URL of the Editor's Draft. Alternatively, use the set ${"[github]"} option, which automatically sets it for you.`;
      showWarning(msg, name$13, { hint });
    }

    const pubSpace = derivePubSpace(conf);
    if (pubSpace && !conf.thisVersion) {
      const maturity = status2maturity[conf.specStatus] || conf.specStatus;
      const { shortName, publishDate } = conf;
      const date = concatDate(publishDate);
      const docVersion = `${maturity}-${shortName}-${date}`;
      const year = [...trStatus, "Member-SUBM"].includes(conf.specStatus)
        ? `${publishDate.getUTCFullYear()}/`
        : "";
      conf.thisVersion = w3Url(`${pubSpace}/${year}${docVersion}/`);
    }

    if (conf.isEd) conf.thisVersion = conf.edDraftURI;
    if (conf.isCGBG) validateCGBG(conf);
    if (conf.latestVersion !== null) {
      conf.latestVersion = conf.latestVersion
        ? w3Url(conf.latestVersion)
        : w3Url(`${pubSpace}/${conf.shortName}/`);
    }

    if (conf.latestVersion) validateIfAllowedOnTR(conf);

    const latestPath = `${pubSpace}/${conf.shortName}`;
    if (conf.previousPublishDate) {
      if (!conf.previousMaturity && !conf.isTagFinding) {
        const msg = docLink`${"[`previousPublishDate`]"} is set, but missing ${"[`previousMaturity`]"}.`;
        showError(msg, name$13);
      }

      conf.previousPublishDate = validateDateAndRecover(
        conf,
        "previousPublishDate"
      );

      const prevMaturity =
        status2maturity[conf.previousMaturity] ?? conf.previousMaturity;
      if (conf.isTagFinding && conf.latestVersion) {
        const pubDate = ISODate.format(conf.publishDate);
        conf.thisVersion = w3Url(`${latestPath}-${pubDate}`);
        const prevPubDate = ISODate.format(conf.previousPublishDate);
        conf.prevVersion = w3Url(`${latestPath}-${prevPubDate}}`);
      } else if (conf.isCGBG || conf.isBasic) {
        conf.prevVersion = conf.prevVersion || "";
      } else {
        const year = conf.previousPublishDate.getUTCFullYear();
        const { shortName } = conf;
        const date = concatDate(conf.previousPublishDate);
        conf.prevVersion = w3Url(
          `${pubSpace}/${year}/${prevMaturity}-${shortName}-${date}/`
        );
      }
    }
    if (conf.prevRecShortname && !conf.prevRecURI)
      conf.prevRecURI = w3Url(`${pubSpace}/${conf.prevRecShortname}`);

    // Move any editors with retiredDate to formerEditors.
    for (let i = 0; i < conf.editors.length; i++) {
      const editor = conf.editors[i];
      if ("retiredDate" in editor) {
        conf.formerEditors.push(editor);
        conf.editors.splice(i--, 1);
      }
    }

    if (conf.editors.length === 0) {
      const msg = "At least one editor is required.";
      const hint = docLink`Add one or more editors using the ${"[editors]"} configuration option.`;
      showError(msg, name$13, { hint });
    } else if (conf.editors.length && conf.isRecTrack) {
      // check that every editor has w3cid
      conf.editors.forEach((editor, i) => {
        if (editor.w3cid) return;
        const msg = docLink`Editor ${
        editor.name ? `"${editor.name}"` : `number ${i + 1}`
      } is missing their ${"[w3cid]"}.`;
        const hint = docLink`See ${"[w3cid]"} for instructions for how to retrieve it and add it.`;
        showError(msg, name$13, { hint });
      });
    }

    if (conf.alternateFormats?.some(({ uri, label }) => !uri || !label)) {
      const msg = docLink`Every ${"[`alternateFormats`]"} entry must have a \`uri\` and a \`label\`.`;
      showError(msg, name$13);
    }
    if (conf.copyrightStart == conf.publishYear) conf.copyrightStart = "";
    conf.dashDate = ISODate.format(conf.publishDate);
    conf.publishISODate = conf.publishDate.toISOString();
    conf.shortISODate = ISODate.format(conf.publishDate);
    validatePatentPolicies(conf);
    await deriveHistoryURI(conf);
    if (conf.isTagEditorFinding) {
      delete conf.thisVersion;
      delete conf.latestVersion;
    }
    if (conf.isTagFinding) {
      conf.showPreviousVersion = conf.previousPublishDate ? true : false;
    }
    // configuration done - yay!

    const options = {
      get multipleAlternates() {
        return conf.alternateFormats && conf.alternateFormats.length > 1;
      },
      get alternatesHTML() {
        return (
          conf.alternateFormats &&
          htmlJoinAnd(
            // We need to pass a string here...
            conf.alternateFormats.map(({ label }) => label),
            (_, i) => {
              const alt = conf.alternateFormats[i];
              return html`<a
              rel="alternate"
              href="${alt.uri}"
              hreflang="${alt?.lang ?? null}"
              type="${alt?.type ?? null}"
              >${alt.label}</a
            >`;
            }
          )
        );
      },
    };

    // insert into document
    const header = (conf.isCGBG ? cgbgHeadersTmpl : headersTmpl)(conf, options);
    document.body.prepend(header);
    document.body.classList.add("h-entry");

    // handle SotD
    const sotd =
      document.getElementById("sotd") || document.createElement("section");
    if ((conf.isCGBG || !conf.isNoTrack || conf.isTagFinding) && !sotd.id) {
      const msg =
        "A Status of This Document must include at least on custom paragraph.";
      const hint =
        "Add a `<p>` in the 'sotd' section that reflects the status of this specification.";
      showError(msg, name$13, { elements: [sotd], hint });
    }
    sotd.id = sotd.id || "sotd";
    sotd.classList.add("introductory");
    // NOTE:
    //  When arrays, wg and wgURI have to be the same length (and in the same order).
    //  Technically wgURI could be longer but the rest is ignored.
    //  However wgPatentURI can be shorter. This covers the case where multiple groups
    //  publish together but some aren't used for patent policy purposes (typically this
    //  happens when one is foolish enough to do joint work with the TAG). In such cases,
    //  the groups whose patent policy applies need to be listed first, and wgPatentURI
    //  can be shorter — but it still needs to be an array.
    const wgPotentialArray = [conf.wg, conf.wgURI, conf.wgPatentURI];
    if (
      wgPotentialArray.some(item => Array.isArray(item)) &&
      !wgPotentialArray.every(item => Array.isArray(item))
    ) {
      const msg = docLink`If one of ${"[wg]"}, ${"[wgURI]"}, or ${"[wgPatentURI]"} is an array, they all have to be.`;
      const hint = docLink`Use the ${"[group]"} option with an array instead.`;
      showError(msg, name$13, { hint });
    }
    if (Array.isArray(conf.wg)) {
      conf.multipleWGs = conf.wg.length > 1;
      conf.wgPatentHTML = htmlJoinAnd(conf.wg, (wg, i) => {
        return html`a
        <a href="${conf.wgPatentURI[i]}" rel="disclosure"
          >public list of any patent disclosures (${wg})</a
        >`;
      });
    } else {
      conf.multipleWGs = false;
    }
    if (conf.isPR && !conf.crEnd) {
      const msg = docLink`${"[specStatus]"} is "PR" but no ${"[crEnd]"} is specified in the ${"[respecConfig]"} (needed to indicate end of previous CR).`;
      showError(msg, name$13);
    }

    if (conf.isCR && !conf.crEnd) {
      const msg = docLink`${"[specStatus]"} is "CR", but no ${"[crEnd]"} is specified in the ${"[respecConfig]"}.`;
      showError(msg, name$13);
    }
    conf.crEnd = validateDateAndRecover(conf, "crEnd");

    if (conf.isPr && !conf.prEnd) {
      const msg = docLink`${"[specStatus]"} is "PR" but no ${"[prEnd]"} is specified in the ${"[respecConfig]"}.`;
      showError(msg, name$13);
    }
    conf.prEnd = validateDateAndRecover(conf, "prEnd");

    const isUpdatableRec = sotd.classList.contains("updateable-rec");
    const hasCorrections = document.querySelector(".correction") !== null;
    const hasProposedCorrections =
      document.querySelector(".proposed-correction") !== null;
    const hasAdditions = document.querySelector(".addition") !== null;
    const hasProposedAdditions =
      document.querySelector(".proposed-addition") !== null;
    const hasRevisions =
      hasCorrections ||
      hasAdditions ||
      hasProposedAdditions ||
      hasProposedCorrections;

    if (conf.isRec && !conf.errata && !hasRevisions) {
      const msg = "Recommendations must have an errata link.";
      const hint = docLink`Add an ${"[errata]"} URL to your ${"[respecConfig]"}.`;
      showError(msg, name$13, { hint });
    }

    if (!isUpdatableRec && (hasAdditions || hasCorrections)) {
      const msg = docLink`${"[specStatus]"} is "REC" with proposed additions but the Recommendation is not marked as allowing new features.`;
      showError(msg, name$13);
    }

    if (
      conf.isRec &&
      isUpdatableRec &&
      (hasProposedAdditions || hasProposedCorrections) &&
      !conf.revisedRecEnd
    ) {
      const msg = docLink`${"[specStatus]"} is "REC" with proposed corrections or additions but no ${"[revisedRecEnd]"} is specified in the ${"[respecConfig]"}.`;
      showError(msg, name$13);
    }
    conf.revisedRecEnd = validateDateAndRecover(conf, "revisedRecEnd");

    if (conf.noRecTrack && recTrackStatus.includes(conf.specStatus)) {
      const msg = docLink`Document configured as ${"[noRecTrack]"}, but its status ("${conf.specStatus}") puts it on the W3C Rec Track.`;
      const notAllowed = codedJoinOr(recTrackStatus, { quotes: true });
      const hint = `Status **can't** be any of: ${notAllowed}.`;
      showError(msg, name$13, { hint });
    }
    if (!sotd.classList.contains("override")) {
      html.bind(sotd)`${populateSoTD(conf, sotd)}`;
    }

    if (!conf.implementationReportURI && conf.isCR) {
      const msg = docLink`Missing ${"[implementationReportURI]"} configuration option in ${"[respecConfig]"}.`;
      const hint = docLink`CR documents must have an ${"[implementationReportURI]"} that describes the [implementation experience](https://www.w3.org/policies/process/#implementation-experience).`;
      showError(msg, name$13, { hint });
    }
    if (!conf.implementationReportURI && conf.isPR) {
      const msg = docLink`PR documents should include an ${"[implementationReportURI]"}, which needs to link to a document that describes the [implementation experience](https://www.w3.org/policies/process-20190301/#implementation-experience).`;
      showWarning(msg, name$13);
    }

    // Requested by https://github.com/speced/respec/issues/504
    // Makes a record of a few auto-generated things.
    pub("amend-user-config", {
      publishISODate: conf.publishISODate,
      generatedSubtitle: norm(
        document.getElementById("w3c-state")?.textContent ?? ""
      ),
    });
  }

  function validateIfAllowedOnTR(conf) {
    const latestVersionURL = new URL(conf.latestVersion);
    const isW3C =
      latestVersionURL.origin === "https://www.w3.org" ||
      latestVersionURL.origin === "https://w3.org/";
    if (
      isW3C &&
      latestVersionURL.pathname.startsWith("/TR/") &&
      ["ED", ...trStatus].includes(conf.specStatus) === false
    ) {
      const msg = docLink`Documents with a status of \`"${conf.specStatus}"\` can't be published on the W3C's /TR/ (Technical Report) space.`;
      const hint = docLink`Ask a W3C Team Member for a W3C URL where the report can be published and change ${"[latestVersion]"} to something else.`;
      showError(msg, name$13, { hint });
      return;
    }
  }

  function derivePubSpace(conf) {
    const { specStatus, group } = conf;
    if (trStatus.includes(specStatus) || conf.groupType === "wg") {
      return `/TR`;
    }

    switch (specStatus) {
      case "CG-FINAL":
      case "BG-FINAL":
        return `/community/reports/${group}`;
      case "finding":
      case "draft-finding":
        return "/2001/tag/doc";
      case "Member-SUBM":
        return `/Submission`;
    }

    return "";
  }

  function validateCGBG(conf) {
    const reportType = status2text[conf.specStatus];
    const latestVersionURL = conf.latestVersion
      ? new URL(w3Url(conf.latestVersion))
      : null;

    if (!conf.wg) {
      const msg = docLink`The ${"[group]"} configuration option is required for this kind of document (${reportType}).`;
      showError(msg, name$13);
      return;
    }

    // Deal with final reports
    if (conf.isCGFinal) {
      // Final report require a w3.org URL.
      const isW3C =
        latestVersionURL?.origin === "https://www.w3.org" ||
        latestVersionURL?.origin === "https://w3.org/";
      if (isW3C === false) {
        const msg = docLink`For ${reportType}, the ${"[latestVersion]"} URL must point to somewhere at https://www.w3.org/.`;
        const hint = `Ask a W3C Team Member for a W3C URL where the report can be published.`;
        showError(msg, name$13, { hint });
        return;
      }
    }
  }

  async function deriveHistoryURI(conf) {
    if (!conf.shortName || conf.historyURI === null || !conf.latestVersion) {
      return; // Nothing to do
    }

    const canShowHistory = conf.isEd || trStatus.includes(conf.specStatus);

    if (conf.historyURI && !canShowHistory) {
      const msg = docLink`The ${"[historyURI]"} can't be used with non /TR/ documents.`;
      const hint = docLink`Please remove ${"[historyURI]"}.`;
      showError(msg, name$13, { hint });
      conf.historyURI = null;
      return;
    }

    const historyURL = new URL(
      conf.historyURI ?? `${conf.shortName}/`,
      "https://www.w3.org/standards/history/"
    );

    // If it's on the Rec Track or it's TR worthy, then allow history override.
    // Also make a an exception for FPWD, DNOTE, NOTE and DRY.
    if (
      (conf.historyURI && canShowHistory) ||
      ["FPWD", "DNOTE", "NOTE", "DRY"].includes(conf.specStatus)
    ) {
      conf.historyURI = historyURL.href;
      return;
    }

    // Let's get the history from the W3C.
    // Do a fetch HEAD request to see if the history exists...
    // We don't discriminate... if it's on the W3C website with a history,
    // we show it.
    try {
      const response = await fetch(historyURL, { method: "HEAD" });
      if (response.ok) {
        conf.historyURI = response.url;
      }
    } catch {
      // Ignore fetch errors
    }
  }

  function validatePatentPolicies(conf) {
    if (!conf.wgPatentPolicy) return;
    const policies = new Set([].concat(conf.wgPatentPolicy));
    if (
      policies.size &&
      ![...policies].every(policy => patentPolicies.includes(policy))
    ) {
      const invalidPolicies = [...policies].filter(
        policy => !patentPolicies.includes(policy)
      );
      const msg = docLink`Invalid ${"[wgPatentPolicy]"} value(s): ${codedJoinAnd(
      invalidPolicies
    )}.`;
      const hint = `Please use one of: ${codedJoinOr(patentPolicies)}.`;
      showError(msg, name$13, { hint });
    }
    if (policies.size !== 1) {
      const msg =
        "When collaborating across multiple groups, they must use the same patent policy.";
      const hint = docLink`For ${"[wgPatentPolicy]"}, please check the patent policies of each group. The patent policies were: ${[
      ...policies,
    ].join(", ")}.`;
      showError(msg, name$13, { hint });
    }
    // We take the first policy
    conf.wgPatentPolicy = [...policies][0];
  }

  /**
   * @param {*} conf
   * @param {HTMLElement} sotd
   */
  function populateSoTD(conf, sotd) {
    const options = {
      ...collectSotdContent(sotd, conf),

      get mailToWGPublicList() {
        return `mailto:${conf.wgPublicList}@w3.org`;
      },
      get mailToWGPublicListWithSubject() {
        const fragment = conf.subjectPrefix
          ? `?subject=${encodeURIComponent(conf.subjectPrefix)}`
          : "";
        return this.mailToWGPublicList + fragment;
      },
      get mailToWGPublicListSubscription() {
        return `mailto:${conf.wgPublicList}-request@w3.org?subject=subscribe`;
      },
    };
    const template = conf.isCGBG ? cgbgSotdTmpl : sotdTmpl;
    return template(conf, options);
  }

  /**
   * @param {HTMLElement} sotd
   */
  function collectSotdContent(sotd, { isTagFinding = false }) {
    const sotdClone = sotd.cloneNode(true);
    const additionalContent = document.createDocumentFragment();
    // we collect everything until we hit a section,
    // that becomes the custom content.
    while (sotdClone.hasChildNodes()) {
      if (
        sotdClone.nodeType === Node.ELEMENT_NODE &&
        // @ts-ignore
        sotdClone.firstChild.localName === "section"
      ) {
        break;
      }
      additionalContent.appendChild(sotdClone.firstChild);
    }
    if (isTagFinding && !additionalContent.hasChildNodes()) {
      const msg = docLink`ReSpec does not support automated SotD generation for TAG findings.`;
      const hint = `Please add the prerequisite content in the 'sotd' section.`;
      showWarning(msg, name$13, { hint });
    }
    return {
      additionalContent,
      // Whatever sections are left, we throw at the end.
      additionalSections: sotdClone.childNodes,
    };
  }

  var headers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    W3CNotes: W3CNotes,
    bgStatus: bgStatus,
    cgStatus: cgStatus,
    cgbgStatus: cgbgStatus,
    licenses: licenses,
    name: name$13,
    noTrackStatus: noTrackStatus,
    recTrackStatus: recTrackStatus,
    registryTrackStatus: registryTrackStatus,
    run: run$$,
    status2text: status2text,
    status2track: status2track,
    tagStatus: tagStatus,
    trStatus: trStatus
  });

  // @ts-check
  /**
   * Sets the core defaults
   */

  const coreDefaults = {
    lint: {
      "no-headingless-sections": true,
      "no-http-props": true,
      "no-unused-vars": false,
      "check-punctuation": false,
      "local-refs-exist": true,
      "check-internal-slots": false,
      "check-charset": false,
      "privsec-section": false,
    },
    pluralize: true,
    specStatus: "base",
    highlightVars: true,
    addSectionLinks: true,
  };

  // @ts-check
  /**
   * Sets the defaults for W3C specs
   */
  const name$12 = "w3c/defaults";

  const w3cLogo = {
    src: "https://www.w3.org/StyleSheets/TR/2021/logos/W3C",
    alt: "W3C",
    height: 48,
    width: 72,
    url: "https://www.w3.org/",
  };

  const memSubmissionLogo = {
    alt: "W3C Member Submission",
    href: "https://www.w3.org/Submission/",
    src: "https://www.w3.org/Icons/member_subm-v.svg",
    width: "211",
    height: "48",
  };

  const w3cDefaults = {
    lint: {
      "privsec-section": false,
      "required-sections": true,
      "wpt-tests-exist": false,
      "informative-dfn": "warn",
      "no-unused-dfns": "warn",
      a11y: false,
    },
    doJsonLd: false,
    logos: [],
    xref: true,
    wgId: "",
    otherLinks: [],
    excludeGithubLinks: true,
    subtitle: "",
    prevVersion: "",
    formerEditors: [],
    editors: [],
    authors: [],
  };

  function run$_(conf) {
    // assign the defaults
    const lint =
      conf.lint === false
        ? false
        : {
            ...coreDefaults.lint,
            ...w3cDefaults.lint,
            ...conf.lint,
          };

    Object.assign(conf, {
      ...coreDefaults,
      ...w3cDefaults,
      ...conf,
      lint,
    });

    if (conf.specStatus !== "unofficial" && !conf.hasOwnProperty("license")) {
      conf.license = "w3c-software-doc";
    }

    validateStatusForGroup(conf);
    processLogos(conf);
  }

  function processLogos(conf) {
    // Primarily include the W3C logo and license for W3C Recommendation track
    // that have an actual working group.
    const { specStatus, wg } = conf;
    const isWgStatus = [
      ...recTrackStatus,
      ...registryTrackStatus,
      ...W3CNotes,
      ...tagStatus,
      "ED",
    ].includes(specStatus);
    const inWorkingGroup = wg && wg.length && isWgStatus;
    // Member submissions don't need to be in a Working Group.
    const doesNotNeedWG = ["Member-SUBM"].includes(specStatus);
    const canShowW3CLogo = inWorkingGroup || doesNotNeedWG;
    if (canShowW3CLogo) {
      conf.logos.unshift(w3cLogo);
      if (specStatus === "Member-SUBM") {
        conf.logos.push(memSubmissionLogo);
      }
    }
  }

  function validateStatusForGroup(conf) {
    const { specStatus, groupType, group } = conf;

    if (!specStatus) {
      const msg = docLink`The ${"[specStatus]"} configuration option is required.`;
      const hint = docLink`Select an appropriate status from ${"[specStatus]"} based on your W3C group. If in doubt, use \`"unofficial"\`.`;
      showError(msg, name$12, { hint });
      conf.specStatus = "base";
      return;
    }

    if (status2text[specStatus] === undefined) {
      const msg = docLink`The ${"[specStatus]"} "\`${specStatus}\`" is not supported at for this type of document.`;
      const choices = codedJoinOr(Object.keys(status2text), { quotes: true });
      const hint = docLink`set ${"[specStatus]"} to one of: ${choices}.`;
      showError(msg, name$12, { hint });
      conf.specStatus = "base";
      return;
    }

    switch (groupType) {
      case "cg": {
        if (![...cgStatus, "unofficial", "UD"].includes(specStatus)) {
          const msg = docLink`W3C Community Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
          const supportedStatus = codedJoinOr(cgStatus, { quotes: true });
          const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"CG-DRAFT"\`.`;
          showError(msg, name$12, { hint });
          conf.specStatus = "CG-DRAFT";
        }
        break;
      }
      case "bg": {
        if (![...bgStatus, "unofficial", "UD"].includes(specStatus)) {
          const msg = docLink`W3C Business Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
          const supportedStatus = codedJoinOr(bgStatus, { quotes: true });
          const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"BG-DRAFT"\`.`;
          showError(msg, name$12, { hint });
          conf.specStatus = "BG-DRAFT";
        }
        break;
      }
      case "wg": {
        if (![...trStatus, "unofficial", "UD", "ED"].includes(specStatus)) {
          const msg = docLink`W3C Working Group documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
          const hint = docLink`Pleas see ${"[specStatus]"} for appropriate status for W3C Working Group documents.`;
          showError(msg, name$12, { hint });
        }
        break;
      }
      case "other":
        if (
          group === "tag" &&
          !["ED", ...trStatus, ...tagStatus].includes(specStatus)
        ) {
          const msg = docLink`The W3C Technical Architecture Group's documents can't use \`"${specStatus}"\` for the ${"[specStatus]"} configuration option.`;
          const supportedStatus = codedJoinOr(["ED", ...trStatus, ...tagStatus], {
            quotes: true,
          });
          const hint = `Please use one of: ${supportedStatus}. Automatically falling back to \`"unofficial"\`.`;
          showError(msg, name$12, { hint });
          conf.specStatus = "unofficial";
        }
        break;
      default:
        if (
          !conf.wgId &&
          !["unofficial", "base", "UD", "Member-SUBM"].includes(conf.specStatus)
        ) {
          const msg =
            "Document is not associated with a [W3C group](https://respec.org/w3c/groups/). Defaulting to 'base' status.";
          const hint = docLink`Use the ${"[group]"} configuration option to associated this document with a W3C group.`;
          conf.specStatus = "base";
          showError(msg, name$12, { hint });
        }
    }
  }

  var defaults = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$12,
    run: run$_
  });

  /* ReSpec specific CSS */
  const css$m = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$n = css$m`
@keyframes pop {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1.25, 1.25);
    opacity: 0.75;
  }
  100% {
    transform: scale(1, 1);
  }
}

/* --- INLINES --- */
a.internalDFN {
  color: inherit;
  border-bottom: 1px solid #99c;
  text-decoration: none;
}

a.externalDFN {
  color: inherit;
  border-bottom: 1px dotted #ccc;
  text-decoration: none;
}

a.bibref {
  text-decoration: none;
}

.respec-offending-element:target {
  animation: pop 0.25s ease-in-out 0s 1;
}

.respec-offending-element,
a[href].respec-offending-element {
  text-decoration: red wavy underline;
}
@supports not (text-decoration: red wavy underline) {
  .respec-offending-element:not(pre) {
    display: inline-block;
  }
  .respec-offending-element {
    /* Red squiggly line */
    background: url(data:image/gif;base64,R0lGODdhBAADAPEAANv///8AAP///wAAACwAAAAABAADAEACBZQjmIAFADs=)
      bottom repeat-x;
  }
}

#references :target {
  background: #eaf3ff;
  animation: pop 0.4s ease-in-out 0s 1;
}

cite .bibref {
  font-style: italic;
}

a[href].orcid {
  padding-left: 4px;
  padding-right: 4px;
}

a[href].orcid > svg {
  margin-bottom: -2px;
}

/* --- TOF --- */
ul.tof,
ol.tof {
  list-style: none outside none;
}

.caption {
  margin-top: 0.5em;
  font-style: italic;
}
#issue-summary > ul {
  column-count: 2;
}

#issue-summary li {
  list-style: none;
  display: inline-block;
}

details.respec-tests-details {
  margin-left: 1em;
  display: inline-block;
  vertical-align: top;
}

details.respec-tests-details > * {
  padding-right: 2em;
}

details.respec-tests-details[open] {
  z-index: 999999;
  position: absolute;
  border: thin solid #cad3e2;
  border-radius: 0.3em;
  background-color: white;
  padding-bottom: 0.5em;
}

details.respec-tests-details[open] > summary {
  border-bottom: thin solid #cad3e2;
  padding-left: 1em;
  margin-bottom: 1em;
  line-height: 2em;
}

details.respec-tests-details > ul {
  width: 100%;
  margin-top: -0.3em;
}

details.respec-tests-details > li {
  padding-left: 1em;
}

.self-link:hover {
  opacity: 1;
  text-decoration: none;
  background-color: transparent;
}

aside.example .marker > a.self-link {
  color: inherit;
}

.header-wrapper {
  display: flex;
  align-items: baseline;
}

:is(h2, h3, h4, h5, h6):not(#toc > h2, #abstract > h2, #sotd > h2, .head > h2) {
  position: relative;
  left: -.5em;
}

:is(h2, h3, h4, h5, h6):not(#toc h2) + a.self-link {
  color: inherit;
  order: -1;
  position: relative;
  left: -1.1em;
  font-size: 1rem;
  opacity: 0.5;
}

:is(h2, h3, h4, h5, h6) + a.self-link::before {
  content: "§";
  text-decoration: none;
  color: var(--heading-text);
}

:is(h2, h3) + a.self-link {
  top: -0.2em;
}

:is(h4, h5, h6) + a.self-link::before {
  color: black;
}

@media (max-width: 767px) {
  dd {
    margin-left: 0;
  }
}

@media print {
  .removeOnSave {
    display: none;
  }
}
`;

  // @ts-check
  // Module core/style
  // The purpose of this module is to insert the default ReSpec CSS into the document.
  // If you don't want to use the default ReSpec CSS, set the `noReSpecCSS` configuration
  // option to `true`. If you want to use your own styles, create a ReSpec profile that
  // includes your own styles and sets the `noReSpecCSS` configuration option to `true`.

  /**
   * Module Name.
   * @type {string}
   */
  const name$11 = "core/style";

  // Opportunistically inserts the style to reduce some FOUC.
  /** @type {HTMLStyleElement} */
  const styleElement = insertStyle();

  /**
   * Inserts the ReSpec CSS as a `style` element into the document's `head`.
   * @return {HTMLStyleElement} The `style` element that was inserted.
   */
  function insertStyle() {
    const styleElement = document.createElement("style");
    styleElement.id = "respec-mainstyle";
    styleElement.textContent = css$n;
    document.head.appendChild(styleElement);
    return styleElement;
  }

  /**
   * Removes the ReSpec CSS if the `noReSpecCSS` configuration option is `true`.
   * @param {Conf} conf The document configuration object.
   */
  function run$Z(conf) {
    if (conf.noReSpecCSS) {
      styleElement.remove();
    }
  }

  var style$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$11,
    run: run$Z
  });

  // @ts-check
  /**
   * Module w3c/style
   * Inserts a link to the appropriate W3C style for the specification's maturity level.
   * */


  const name$10 = "w3c/style";

  function attachFixupScript() {
    const script = document.createElement("script");
    script.src = "https://www.w3.org/scripts/TR/2021/fixup.js";
    if (location.hash) {
      script.addEventListener(
        "load",
        () => {
          window.location.href = location.hash;
        },
        { once: true }
      );
    }
    document.body.appendChild(script);
  }

  // Creates a collection of resource hints to improve the loading performance
  // of the W3C resources.
  function createResourceHints() {
    /** @type {ResourceHintOption[]}  */
    const opts = [
      {
        hint: "preconnect", // for W3C styles and scripts.
        href: "https://www.w3.org",
      },
      {
        hint: "preload", // all specs need it, and we attach it on end-all.
        href: "https://www.w3.org/scripts/TR/2021/fixup.js",
        as: "script",
      },
      {
        hint: "preload", // all specs include on base.css.
        href: getStyleUrl("base.css").href,
        as: "style",
      },
      {
        hint: "preload",
        href: getStyleUrl("dark.css").href,
        as: "style",
      },
      {
        hint: "preload", // all specs show the logo.
        href: "https://www.w3.org/StyleSheets/TR/2021/logos/W3C",
        as: "image",
        corsMode: "anonymous",
      },
    ];
    const resourceHints = document.createDocumentFragment();
    for (const link of opts.map(createResourceHint)) {
      resourceHints.appendChild(link);
    }
    return resourceHints;
  }

  // Collect elements for insertion (document fragment)
  const elements = createResourceHints();

  // Opportunistically apply base style
  elements.appendChild(
    html`<link
    rel="stylesheet"
    href="https://www.w3.org/StyleSheets/TR/2021/base.css"
    class="removeOnSave"
  />`
  );
  if (!document.head.querySelector("meta[name=viewport]")) {
    // Make meta viewport the first element in the head.
    elements.prepend(
      html`<meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />`
    );
  }

  document.head.prepend(elements);

  /**
   * @param {URL|string} linkURL
   * @returns {(exportDoc: Document) => void}
   */
  function styleMover(linkURL) {
    return exportDoc => {
      const w3cStyle = exportDoc.querySelector(`head link[href="${linkURL}"]`);
      exportDoc.querySelector("head").append(w3cStyle);
    };
  }

  /**
   * @param {Conf} conf
   */
  function run$Y(conf) {
    // Attach W3C fixup script after we are done.
    if (!conf.noToc) {
      sub("end-all", attachFixupScript, { once: true });
    }

    const finalStyleURL = getStyleUrl(getStyleFile(conf));
    document.head.appendChild(
      html`<link rel="stylesheet" href="${finalStyleURL.href}" />`
    );
    // Make sure the W3C stylesheet is the last stylesheet, as required by W3C Pub Rules.
    sub("beforesave", styleMover(finalStyleURL));

    // Add color scheme meta tag and style
    /** @type HTMLMetaElement */
    let colorScheme = document.querySelector("head meta[name=color-scheme]");
    if (!colorScheme) {
      // Default to light mode during transitional period.
      colorScheme = html`<meta name="color-scheme" content="light" />`;
      document.head.appendChild(colorScheme);
    }
    if (colorScheme.content.includes("dark")) {
      const darkModeStyleUrl = getStyleUrl("dark.css");
      document.head.appendChild(
        html`<link
        rel="stylesheet"
        href="${darkModeStyleUrl.href}"
        media="(prefers-color-scheme: dark)"
      />`
      );
      // As required by W3C Pub Rules.
      sub("beforesave", styleMover(darkModeStyleUrl));
    }
  }

  /** @param {Conf} conf */
  function getStyleFile(conf) {
    const canonicalStatus = conf.specStatus?.toUpperCase() ?? "";
    let styleFile = "";
    const canUseW3CStyle =
      [
        ...recTrackStatus,
        ...registryTrackStatus,
        ...W3CNotes,
        "ED",
        "MEMBER-SUBM",
      ].includes(canonicalStatus) && conf.wgId;

    // Figure out which style file to use.
    switch (canonicalStatus) {
      case "WD":
      case "FPWD":
        styleFile = canUseW3CStyle ? "W3C-WD" : "base.css";
        break;
      case "CG-DRAFT":
      case "CG-FINAL":
      case "BG-DRAFT":
      case "BG-FINAL":
        styleFile = canonicalStatus.toLowerCase();
        break;
      case "UD":
      case "UNOFFICIAL":
        styleFile = "W3C-UD";
        break;
      case "FINDING":
      case "DRAFT-FINDING":
      case "EDITOR-DRAFT-FINDING":
      case "BASE":
        styleFile = "base.css";
        break;
      case "MEMBER-SUBM":
        styleFile = "W3C-Member-SUBM";
        break;
      default:
        styleFile = canUseW3CStyle ? `W3C-${conf.specStatus}` : "base.css";
    }

    return styleFile;
  }

  function getStyleUrl(styleFile = "base.css") {
    return new URL(`/StyleSheets/TR/2021/${styleFile}`, "https://www.w3.org/");
  }

  var style = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$10,
    run: run$Y
  });

  // @ts-check
  /**
   * core/github
   *
   * @see https://github.com/speced/respec/wiki/github
   */

  const name$$ = "core/github";

  let resolveGithubPromise;
  let rejectGithubPromise;
  /** @type {Promise<{ apiBase: string, fullName: string, branch: string, repoURL: string } | null>} */
  const github = new Promise((resolve, reject) => {
    resolveGithubPromise = resolve;
    rejectGithubPromise = message => {
      showError(message, name$$);
      reject(new Error(message));
    };
  });

  const localizationStrings$y = {
    en: {
      file_a_bug: "File an issue",
      participate: "Participate:",
      commit_history: "Commit history",
    },
    ko: {
      participate: "참여",
    },
    zh: {
      file_a_bug: "反馈错误",
      participate: "参与：",
    },
    ja: {
      commit_history: "変更履歴",
      file_a_bug: "問題報告",
      participate: "参加方法：",
    },
    nl: {
      commit_history: "Revisiehistorie",
      file_a_bug: "Dien een melding in",
      participate: "Doe mee:",
    },
    es: {
      commit_history: "Historia de cambios",
      file_a_bug: "Nota un bug",
      participate: "Participe:",
    },
    de: {
      commit_history: "Revisionen",
      file_a_bug: "Fehler melden",
      participate: "Mitmachen:",
    },
  };
  const l10n$y = getIntlData(localizationStrings$y);

  async function run$X(conf) {
    if (!conf.hasOwnProperty("github") || !conf.github) {
      // nothing to do, bail out.
      resolveGithubPromise(null);
      return;
    }
    if (
      typeof conf.github === "object" &&
      !conf.github.hasOwnProperty("repoURL")
    ) {
      const msg = docLink`Config option ${"[github]"} is missing property \`repoURL\`.`;
      rejectGithubPromise(msg);
      return;
    }
    let tempURL = conf.github.repoURL || conf.github;
    if (!tempURL.endsWith("/")) tempURL += "/";
    /** @type URL */
    let ghURL;
    try {
      ghURL = new URL(tempURL, "https://github.com");
    } catch {
      const msg = docLink`${"[github]"} configuration option is not a valid URL? (${tempURL}).`;
      rejectGithubPromise(msg);
      return;
    }
    if (ghURL.origin !== "https://github.com") {
      const msg = docLink`${"[github]"} configuration option must be HTTPS and pointing to GitHub. (${ghURL.href}).`;
      rejectGithubPromise(msg);
      return;
    }
    const [org, repo] = ghURL.pathname.split("/").filter(item => item);
    if (!org || !repo) {
      const msg = docLink`${"[github]"} URL needs a path. For example, "w3c/my-spec".`;
      rejectGithubPromise(msg);
      return;
    }
    const branch = conf.github.branch || "gh-pages";
    const issueBase = new URL("./issues/", ghURL).href;
    const commitHistoryURL = new URL(
      `./commits/${conf.github.branch ?? ""}`,
      ghURL.href
    );
    const newProps = {
      edDraftURI: `https://${org.toLowerCase()}.github.io/${repo}/`,
      githubToken: undefined,
      githubUser: undefined,
      issueBase,
      atRiskBase: issueBase,
      otherLinks: [],
      pullBase: new URL("./pulls/", ghURL).href,
      shortName: repo,
    };
    // Assign new properties, but retain existing ones
    let githubAPI = "https://respec.org/github";
    if (conf.githubAPI) {
      if (new URL(conf.githubAPI).hostname === window.parent.location.hostname) {
        // for testing
        githubAPI = conf.githubAPI;
      } else {
        const msg =
          "The `githubAPI` configuration option is private and should not be added manually.";
        showWarning(msg, name$$);
      }
    }
    if (!conf.excludeGithubLinks) {
      const otherLink = {
        key: l10n$y.participate,
        data: [
          {
            value: `GitHub ${org}/${repo}`,
            href: ghURL,
          },
          {
            value: l10n$y.file_a_bug,
            href: newProps.issueBase,
          },
          {
            value: l10n$y.commit_history,
            href: commitHistoryURL.href,
          },
          {
            value: "Pull requests",
            href: newProps.pullBase,
          },
        ],
      };
      if (!conf.otherLinks) {
        conf.otherLinks = [];
      }
      conf.otherLinks.unshift(otherLink);
    }
    const normalizedGHObj = {
      branch,
      repoURL: ghURL.href,
      apiBase: githubAPI,
      fullName: `${org}/${repo}`,
      issuesURL: issueBase,
      pullsURL: newProps.pullBase,
      newIssuesURL: new URL("./new/choose", issueBase).href,
      commitHistoryURL: commitHistoryURL.href,
    };
    resolveGithubPromise(normalizedGHObj);

    const normalizedConfig = {
      ...newProps,
      ...conf,
      github: normalizedGHObj,
      githubAPI,
    };
    Object.assign(conf, normalizedConfig);
  }

  var github$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    github: github,
    name: name$$,
    run: run$X
  });

  /**
   * Module core/sections
   *
   * Adds <section>s to the document, based on the heading structure.
   */
  const name$_ = "core/sections";

  class DOMBuilder {
    constructor(doc) {
      this.doc = doc;
      this.root = doc.createDocumentFragment();
      this.stack = [this.root];
      this.current = this.root;
    }
    findPosition(header) {
      return parseInt(header.tagName.charAt(1), 10);
    }
    findParent(position) {
      let parent;
      while (position > 0) {
        position--;
        parent = this.stack[position];
        if (parent) return parent;
      }
    }
    findHeader({ firstChild: node }) {
      while (node) {
        if (/H[1-6]/.test(node.tagName)) {
          return node;
        }
        node = node.nextSibling;
      }
      return null;
    }

    addHeader(header) {
      const section = this.doc.createElement("section");
      const position = this.findPosition(header);

      section.appendChild(header);
      this.findParent(position).appendChild(section);
      this.stack[position] = section;
      this.stack.length = position + 1;
      this.current = section;
    }

    addSection(node) {
      const header = this.findHeader(node);
      const position = header ? this.findPosition(header) : 1;
      const parent = this.findParent(position);

      if (header) {
        node.removeChild(header);
      }

      node.appendChild(structure$1(node));

      if (header) {
        node.prepend(header);
      }

      parent.appendChild(node);
      this.current = parent;
    }

    addElement(node) {
      this.current.appendChild(node);
    }
  }
  /**
   *
   * @param {Node} fragment
   * @returns
   */
  function structure$1(fragment) {
    const builder = new DOMBuilder(fragment.ownerDocument);
    while (fragment.firstChild) {
      const node = fragment.firstChild;
      switch (node.localName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          builder.addHeader(node);
          break;
        case "section":
          builder.addSection(node);
          break;
        default:
          builder.addElement(node);
      }
    }
    return builder.root;
  }

  /**
   * Restructure a container element adding sections if needed.
   * @param {Element} elem
   */
  function restructure(elem) {
    const structuredInternals = structure$1(elem);
    if (
      structuredInternals.firstElementChild.localName === "section" &&
      elem.localName === "section"
    ) {
      const section = structuredInternals.firstElementChild;
      section.remove();
      elem.append(...section.childNodes);
    } else {
      elem.textContent = "";
    }
    elem.appendChild(structuredInternals);
  }

  function run$W() {
    restructure(document.body);
  }

  var sections = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$_,
    restructure: restructure,
    run: run$W
  });

  // @ts-check
  // Module core/data-include
  // Support for the data-include attribute. Causes external content to be included inside an
  // element that has data-include='some URI'. There is also a data-oninclude attribute that
  // features a white space separated list of global methods that will be called with the
  // module object, the content, and the included URI.
  //
  // IMPORTANT:
  //  This module only really works when you are in an HTTP context, and will most likely
  //  fail if you are editing your documents on your local drive. That is due to security
  //  restrictions in the browser.

  const name$Z = "core/data-include";

  /**
   * @param {HTMLElement} el
   * @param {string} data
   * @param {object} options
   * @param {boolean} options.replace
   */
  function fillWithText(el, data, { replace }) {
    const { includeFormat } = el.dataset;
    let fill = data;
    if (includeFormat === "markdown") {
      fill = markdownToHtml(fill);
    }

    if (includeFormat === "text") {
      el.textContent = fill;
    } else {
      el.innerHTML = fill;
    }

    if (includeFormat === "markdown") {
      restructure(el);
    }

    if (replace) {
      el.replaceWith(...el.childNodes);
    }
  }

  /**
   * @param {string} rawData
   * @param {string} id
   * @param {string} url
   */
  function processResponse(rawData, id, url) {
    /** @type {HTMLElement} */
    const el = document.querySelector(`[data-include-id=${id}]`);
    const data = runTransforms(rawData, el.dataset.oninclude, url);
    const replace = typeof el.dataset.includeReplace === "string";
    fillWithText(el, data, { replace });
    // If still in the dom tree, clean up
    if (!replace) {
      removeIncludeAttributes(el);
    }
  }
  /**
   * Removes attributes after they are used for inclusion, if present.
   *
   * @param {Element} el The element to clean up.
   */
  function removeIncludeAttributes(el) {
    [
      "data-include",
      "data-include-format",
      "data-include-replace",
      "data-include-id",
      "oninclude",
    ].forEach(attr => el.removeAttribute(attr));
  }

  async function run$V() {
    await runIncludes(document, 1);
  }

  /**
   * @param {HTMLElement | Document} root
   * @param {number} currentDepth
   */
  async function runIncludes(root, currentDepth) {
    /** @type {NodeListOf<HTMLElement>} */
    const includables = root.querySelectorAll("[data-include]");
    const promisesToInclude = Array.from(includables).map(async el => {
      const url = el.dataset.include;
      if (!url) {
        return; // just skip it
      }
      const id = `include-${String(Math.random()).slice(2)}`;
      el.dataset.includeId = id;
      try {
        const response = await fetch(url);
        const text = await response.text();
        processResponse(text, id, url);
        if (currentDepth < 3) {
          // For performance reasons, only allow limited nesting.
          await runIncludes(el, currentDepth + 1);
        }
      } catch (err) {
        const msg = `\`data-include\` failed: \`${url}\` (${err.message}).`;
        showError(msg, name$Z, { elements: [el], cause: err });
      }
    });
    await Promise.all(promisesToInclude);
  }

  var dataInclude = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$Z,
    run: run$V
  });

  // @ts-check
  /**
   * @module core/reindent
   *
   * Normalizes indents across the pre elements in the document,
   * so that indentation inside <pre> won't affect the rendered result.
   */
  const name$Y = "core/reindent";

  function run$U() {
    for (const pre of document.getElementsByTagName("pre")) {
      pre.innerHTML = reindent$1(pre.innerHTML);
    }
  }

  var reindent = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$Y,
    run: run$U
  });

  /**
   * This module handles the creation of the h1#title of a spec and
   * makes sure the <title> always matches the h1.
   *
   * If no h1#title is included, then the <title> becomes the h1#title.
   *
   * When a h1#title is included, it always takes precedence over the
   * <title> of a spec. An error will be displayed in case of
   * any mismatch.
   *
   */

  const name$X = "core/title";

  const localizationStrings$x = {
    en: {
      default_title: "No Title",
    },
    de: {
      default_title: "Kein Titel",
    },
    zh: {
      default_title: "无标题",
    },
  };

  const l10n$x = getIntlData(localizationStrings$x);

  function run$T(conf) {
    /** @type {HTMLElement} */
    const h1Elem =
      document.querySelector("h1#title") || html`<h1 id="title"></h1>`;

    // check existing element is ok to use
    if (h1Elem.isConnected && h1Elem.textContent.trim() === "") {
      const msg =
        "The document is missing a title, so using a default title. " +
        "To fix this, please give your document a `<title>`. " +
        "If you need special markup in the document's title, " +
        'please use a `<h1 id="title">`.';
      const title = "Document is missing a title";
      showError(msg, name$X, { title, elements: [h1Elem] });
    }

    // Decorate the spec title
    if (!h1Elem.id) h1Elem.id = "title";
    h1Elem.classList.add("title");

    setDocumentTitle(conf, h1Elem);

    // This will get relocated by a template later.
    document.body.prepend(h1Elem);
  }

  function setDocumentTitle(conf, h1Elem) {
    // If the h1 is newly created, it won't be connected. In this case
    // we use the <title> or a localized fallback.
    if (!h1Elem.isConnected) {
      h1Elem.textContent = document.title || `${l10n$x.default_title}`;
    }
    // We replace ":<br>" with ":", and "<br>" with "-", as appropriate.
    const tempElem = document.createElement("h1");
    tempElem.innerHTML = h1Elem.innerHTML
      .replace(/:<br>/g, ": ")
      .replace(/<br>/g, " - ");
    let documentTitle = norm(tempElem.textContent);

    if (conf.isPreview && conf.prNumber) {
      const prUrl = conf.prUrl || `${conf.github.repoURL}pull/${conf.prNumber}`;
      const { childNodes } = html`
      Preview of PR <a href="${prUrl}">#${conf.prNumber}</a>:
    `;
      h1Elem.prepend(...childNodes);
      documentTitle = `Preview of PR #${conf.prNumber}: ${documentTitle}`;
    }

    document.title = documentTitle;

    // conf.title is deperecated - we are keeping this here just to
    // retain backwards compat as we think the ePub generator
    // relies on it.
    conf.title = documentTitle;
  }

  var title = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$X,
    run: run$T
  });

  /**
   * This module updates the title and shortName
   * of a spec when there is a valid level configuration.
   *
   * Levels should be integers >= 0.
   *
   * @module w3c/level
   */

  const name$W = "w3c/level";
  /** @type {LocalizationStrings} */
  const localizationStrings$w = {
    en: {
      level: "Level",
    },
    ja: {
      level: "レベル",
    },
    nl: {
      level: "Niveau",
    },
    de: {
      level: "Stufe",
    },
    zh: {
      level: "级别",
    },
  };

  const l10n$w = getIntlData(localizationStrings$w);

  /**
   * Updates the title and shortName of a spec based on the level configuration.
   *
   * @param {Conf} conf - The configuration object.
   */
  function run$S(conf) {
    if (!conf.hasOwnProperty("level")) return;

    const h1Elem = document.querySelector("h1#title");

    const level = parseInt(conf.level);
    if (!Number.isInteger(level) || level < 0) {
      const msg = `The \`level\` configuration option must be a number greater or equal to 0. It is currently set to \`${level}\``;
      const title = "Invalid level config.";
      showError(msg, name$W, { title, elements: [h1Elem] });
      return;
    }

    h1Elem.append(` ${l10n$w.level} ${level}`);
    document.title = `${document.title} ${l10n$w.level} ${level}`;
    conf.shortName = `${conf.shortName}-${level}`;
    conf.level = level;
  }

  var level = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$W,
    run: run$S
  });

  /**
   * Module w3c/abstract
   *
   * This module handles the abstract section properly by adding necessary elements and
   * performing validations.
   *
   * @module w3c/abstract
   */


  const name$V = "w3c/abstract";

  /** @type {LocalizationStrings} */
  const localizationStrings$v = {
    en: { abstract: "Abstract" },
    ko: { abstract: "요약" },
    zh: { abstract: "摘要" },
    ja: { abstract: "要約" },
    nl: { abstract: "Samenvatting" },
    es: { abstract: "Resumen" },
    de: { abstract: "Zusammenfassung" },
  };
  const l10n$v = getIntlData(localizationStrings$v);

  /**
   * Handles the abstract section of the document.
   */
  async function run$R() {
    const abstract = findAbstract();
    if (!abstract) {
      showError('Document must have one `<section id="abstract">`.', name$V);
      return;
    }

    abstract.classList.add("introductory");
    abstract.id = "abstract";
    if (!abstract.querySelector("h2")) {
      abstract.prepend(html`<h2>${l10n$v.abstract}</h2>`);
    }
  }

  /**
   * Finds the abstract section in the document.
   *
   * @returns {HTMLElement | null} The abstract section element.
   */
  function findAbstract() {
    const abstract = document.getElementById("abstract");
    if (abstract) {
      switch (abstract.localName) {
        case "section":
          return abstract;
        case "div":
          return renameElement(abstract, "section");
        default:
          showError("The abstract should be a `<section>` element.", name$V, {
            elements: [abstract],
          });
          return abstract;
      }
    }

    const searchString = l10n$v.abstract.toLocaleLowerCase(lang$1);
    for (const header of document.querySelectorAll("h2, h3, h4, h5, h6")) {
      if (norm(header.textContent).toLocaleLowerCase(lang$1) === searchString) {
        return header.closest("section");
      }
    }

    return abstract;
  }

  var abstract = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$V,
    run: run$R
  });

  // @ts-check
  // Module core/data-transform
  // Support for the data-transform attribute
  // Any element in the tree that has a data-transform attribute is processed here.
  // The data-transform attribute can contain a white space separated list of functions
  // to call (these must have been defined globally). Each is called with a reference to
  // the core/utils plugin and the innerHTML of the element. The output of each is fed
  // as the input to the next, and the output of the last one replaces the HTML content
  // of the element.
  // IMPORTANT:
  //  It is unlikely that you should use this module. The odds are that unless you really
  //  know what you are doing, you should be using a dedicated module instead. This feature
  //  is not actively supported and support for it may be dropped. It is not accounted for
  //  in the test suite, and therefore could easily break.

  const name$U = "core/data-transform";

  function run$Q() {
    /** @type {NodeListOf<HTMLElement>} */
    const transformables = document.querySelectorAll("[data-transform]");
    transformables.forEach(el => {
      el.innerHTML = runTransforms(el.innerHTML, el.dataset.transform);
      el.removeAttribute("data-transform");
    });
  }

  var dataTransform = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$U,
    run: run$Q
  });

  // @ts-check
  // Module core/data-abbr
  // - Finds all elements with data-abbr attribute and processes them.
  const name$T = "core/dfn-abbr";

  function run$P() {
    /** @type {NodeListOf<HTMLElement>} */
    const elements = document.querySelectorAll("[data-abbr]");
    for (const elem of elements) {
      const { localName } = elem;
      switch (localName) {
        case "dfn":
          processDfnElement(elem);
          break;
        default: {
          const msg = `\`data-abbr\` attribute not supported on \`${localName}\` elements.`;
          showError(msg, name$T, {
            elements: [elem],
            title: "Error: unsupported.",
          });
        }
      }
    }
  }
  /**
   * @param {HTMLElement} dfn
   */
  function processDfnElement(dfn) {
    const abbr = generateAbbreviation(dfn);
    // get normalized <dfn> textContent to remove spaces, tabs, new lines.
    const fullForm = dfn.textContent.replace(/\s\s+/g, " ").trim();
    dfn.insertAdjacentHTML(
      "afterend",
      ` (<abbr title="${fullForm}">${abbr}</abbr>)`
    );
    const lt = dfn.dataset.lt || "";
    dfn.dataset.lt = lt
      .split("|")
      .filter(i => i.trim())
      .concat(abbr)
      .join("|");
  }

  function generateAbbreviation(elem) {
    if (elem.dataset.abbr) return elem.dataset.abbr;
    // Generates abbreviation from textContent
    // e.g., "Permanent Account Number" -> "PAN"
    return elem.textContent
      .match(/\b([a-z])/gi)
      .join("")
      .toUpperCase();
  }

  var dataAbbr = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$T,
    run: run$P
  });

  // @ts-check
  // Parses an inline IDL string (`{{ idl string }}`)
  //  and renders its components as HTML

  const idlPrimitiveRegex = /^[a-z]+(\s+[a-z]+)+\??$/; // {{unrestricted double?}} {{ double }}
  const exceptionRegex = /\B"([^"]*)"\B/; // {{ "SomeException" }}

  /**
   * Matches following patterns:
   * - `identifier(arg1, moreArgs)`
   * - `identifier()`
   * - `identifier(arg1, moreArgs)|text`
   * - `identifier(arg1, moreArgs)|text()`
   * - `identifier(arg1, moreArgs)|text(argA, moreArgs)`
   *
   * Groups: identifier, args, [text, [textArgs]]
   */
  const methodRegex = /^(\w+)\(([^\\)]*)\)(?:\|(\w+)(?:\((?:([^\\)]*))\))?)?$/;

  const slotRegex = /\[\[(\w+(?: +\w+)*)\]\](\([^)]*\))?$/;
  // matches: `value` or `[[value]]`
  // NOTE: [[value]] is actually a slot, but database has this as type="attribute"
  const attributeRegex = /^((?:\[\[)?(?:\w+(?: +\w+)*)(?:\]\])?)$/;
  const baseRegex = /^(?:\w+)\??$/;
  const enumRegex = /^(\w+)\["([\w- ]*)"\]$/;
  // TODO: const splitRegex = /(?<=\]\]|\b)\./
  // https://github.com/speced/respec/pull/1848/files#r225087385
  const methodSplitRegex = /\.?(\w+\(.*\)$)/;
  const slotSplitRegex = /\/(.+)/;
  const isProbablySlotRegex = /\[\[.+\]\]/;
  /**
   * @typedef {object} IdlBase
   * @property {"base"} type
   * @property {string} identifier
   * @property {boolean} renderParent
   * @property {boolean} nullable
   * @property {InlineIdl | null} [parent]
   *
   * @typedef {object} IdlAttribute
   * @property {"attribute"} type
   * @property {string} identifier
   * @property {boolean} renderParent
   * @property {InlineIdl | null} [parent]
   *
   * @typedef {object} IdlInternalSlot
   * @property {"internal-slot"} type
   * @property {string} identifier
   * @property {string[]} [args]
   * @property {boolean} renderParent
   * @property {InlineIdl | null} [parent]
   * @property {"attribute"|"method"} slotType
   *
   * @typedef {object} IdlMethod
   * @property {"method"} type
   * @property {string} identifier
   * @property {string[]} args
   * @property {string | undefined} renderText
   * @property {string[] | undefined} renderArgs
   * @property {boolean} renderParent
   * @property {InlineIdl | null} [parent]
   *
   * @typedef {object} IdlEnum
   * @property {"enum"} type
   * @property {string} [identifier]
   * @property {string} enumValue
   * @property {boolean} renderParent
   * @property {InlineIdl | null} [parent]
   *
   * @typedef {object} IdlException
   * @property {"exception"} type
   * @property {string} identifier
   * @property {InlineIdl | null} [parent]
   *
   * @typedef {object} IdlPrimitive
   * @property {"idl-primitive"} type
   * @property {boolean} nullable
   * @property {string} identifier
   * @property {boolean} renderParent
   * @property {InlineIdl | null} [parent]
   *
   * @typedef {IdlBase | IdlAttribute | IdlInternalSlot | IdlMethod | IdlEnum | IdlException | IdlPrimitive} InlineIdl
   */

  /**
   * @param {string} str
   * @returns {InlineIdl[]}
   */
  function parseInlineIDL(str) {
    // If it's got [[ string ]], then split as an internal slot
    const isSlot = isProbablySlotRegex.test(str);
    const splitter = isSlot ? slotSplitRegex : methodSplitRegex;
    const [forPart, childString] = str.split(splitter);
    if (isSlot && forPart && !childString) {
      throw new SyntaxError(
        `Internal slot missing "for" part. Expected \`{{ InterfaceName/${forPart}}}\` }.`
      );
    }
    const tokens = forPart
      .split(/[./]/)
      .concat(childString)
      .filter(s => s && s.trim())
      .map(s => s.trim());
    const renderParent = !str.includes("/");
    /** @type {InlineIdl[]} */
    const results = [];
    while (tokens.length) {
      const value = tokens.pop();
      // Method
      if (methodRegex.test(value)) {
        const [, identifier, allArgs, altText, altArgs] =
          value.match(methodRegex);
        const args = allArgs.split(/,\s*/).filter(arg => arg);
        const renderText = altText?.trim();
        const renderArgs = altArgs?.split(/,\s*/).filter(arg => arg);
        results.push({
          type: "method",
          identifier,
          args,
          renderParent,
          renderText,
          renderArgs,
        });
        continue;
      }
      // Enum["enum value"]
      if (enumRegex.test(value)) {
        const [, identifier, enumValue] = value.match(enumRegex);
        results.push({ type: "enum", identifier, enumValue, renderParent });
        continue;
      }
      // Exception - "NotAllowedError"
      // Or alternate enum syntax: {{ EnumContainer / "some enum value" }}
      if (exceptionRegex.test(value)) {
        const [, identifier] = value.match(exceptionRegex);
        if (renderParent) {
          results.push({ type: "exception", identifier });
        } else {
          results.push({ type: "enum", enumValue: identifier, renderParent });
        }
        continue;
      }
      // internal slot
      if (slotRegex.test(value)) {
        const [, identifier, allArgs] = value.match(slotRegex);
        const slotType = allArgs ? "method" : "attribute";
        const args = allArgs
          ?.slice(1, -1)
          .split(/,\s*/)
          .filter(arg => arg);
        results.push({
          type: "internal-slot",
          slotType,
          identifier,
          args,
          renderParent,
        });
        continue;
      }
      // attribute
      if (attributeRegex.test(value) && tokens.length) {
        const [, identifier] = value.match(attributeRegex);
        results.push({ type: "attribute", identifier, renderParent });
        continue;
      }
      if (idlPrimitiveRegex.test(value)) {
        const nullable = value.endsWith("?");
        const identifier = nullable ? value.slice(0, -1) : value;
        results.push({
          type: "idl-primitive",
          identifier,
          renderParent,
          nullable,
        });
        continue;
      }
      // base, always final token
      if (baseRegex.test(value) && tokens.length === 0) {
        const nullable = value.endsWith("?");
        const identifier = nullable ? value.slice(0, -1) : value;
        results.push({ type: "base", identifier, renderParent, nullable });
        continue;
      }
      throw new SyntaxError(`IDL micro-syntax parsing error in \`{{ ${str} }}\``);
    }
    // link the list
    results.forEach((item, i, list) => {
      item.parent = list[i + 1] || null;
    });
    // return them in the order we found them...
    return results.reverse();
  }

  /**
   * @param {IdlBase} details
   */
  function renderBase(details) {
    // Check if base is a local variable in a section
    const { identifier, renderParent, nullable } = details;
    if (renderParent) {
      return html`<a
      data-xref-type="_IDL_"
      data-link-type="idl"
      data-lt="${identifier}"
      ><code>${identifier + (nullable ? "?" : "")}</code></a
    >`;
    }
  }

  /**
   * Internal slot: .[[identifier]] or [[identifier]]
   * @param {IdlInternalSlot} details
   */
  function renderInternalSlot(details) {
    const { identifier, parent, slotType, renderParent, args } = details;
    const { identifier: linkFor } = parent || {};
    const isMethod = slotType === "method";
    const argsHtml = isMethod
      ? html`(${htmlJoinComma(args, htmlArgMapper)})`
      : null;
    const textArgs = isMethod ? `(${args.join(", ")})` : "";
    const lt = `[[${identifier}]]${textArgs}`;
    const element = html`${parent && renderParent ? "." : ""}<a
      data-xref-type="${slotType}"
      data-link-type="${slotType}"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
      data-lt="${lt}"
      ><code>[[${identifier}]]${argsHtml}</code></a
    >`;
    return element;
  }

  function htmlArgMapper(str, i, array) {
    if (i < array.length - 1) return html`<var>${str}</var>`;
    // only the last argument can be variadic
    const parts = str.split(/(^\.{3})(.+)/);
    const isVariadic = parts.length > 1;
    const arg = isVariadic ? parts[2] : parts[0];
    return html`${isVariadic ? "..." : null}<var>${arg}</var>`;
  }
  /**
   * Attribute: .identifier
   * @param {IdlAttribute} details
   */
  function renderAttribute(details) {
    const { parent, identifier, renderParent } = details;
    const { identifier: linkFor } = parent || {};
    const element = html`${renderParent ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="attribute|dict-member|const"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
      ><code>${identifier}</code></a
    >`;
    return element;
  }

  /**
   * Method: .identifier(arg1, arg2, ...), identifier(arg1, arg2, ...)
   * @param {IdlMethod} details
   */
  function renderMethod(details) {
    const { args, identifier, type, parent, renderParent } = details;
    const { renderText: text, renderArgs: textArgs } = details;
    const { identifier: linkFor } = parent || {};
    const argsText = htmlJoinComma(textArgs || args, htmlArgMapper);
    const searchText = `${identifier}(${args.join(", ")})`;
    const element = html`${parent && renderParent ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="${type}"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
      data-lt="${searchText}"
      ><code>${text || identifier}</code></a
    >${!text || textArgs ? html`<code>(${argsText})</code>` : ""}`;
    return element;
  }

  /**
   * Enum:
   * Identifier["enum value"]
   * Identifer / "enum value"
   * @param {IdlEnum} details
   */
  function renderEnum(details) {
    const { identifier, enumValue, parent } = details;
    const forContext = parent ? parent.identifier : identifier;
    const element = html`"<a
      data-link-type="idl"
      data-xref-type="enum-value"
      data-link-for="${forContext}"
      data-xref-for="${forContext}"
      data-lt="${!enumValue ? "the-empty-string" : null}"
      ><code>${enumValue}</code></a
    >"`;
    return element;
  }

  /**
   * Exception value: "NotAllowedError"
   * Only the WebIDL spec can define exceptions
   * @param {IdlException} details
   */
  function renderException(details) {
    const { identifier } = details;
    const element = html`"<a
      data-link-type="idl"
      data-cite="webidl"
      data-xref-type="exception"
      ><code>${identifier}</code></a
    >"`;
    return element;
  }

  /**
   * Interface types: {{ unrestricted double }} {{long long}}
   * Only the WebIDL spec defines these types.
   * @param {IdlPrimitive} details
   */
  function renderIdlPrimitiveType(details) {
    const { identifier, nullable } = details;
    const element = html`<a
    data-link-type="idl"
    data-cite="webidl"
    data-xref-type="interface"
    data-lt="${identifier}"
    ><code>${identifier + (nullable ? "?" : "")}</code></a
  >`;
    return element;
  }

  /**
   * Generates HTML by parsing an IDL string
   * @param {String} str IDL string
   * @return {Node} html output
   */
  function idlStringToHtml(str) {
    let results;
    try {
      results = parseInlineIDL(str);
    } catch (error) {
      const el = html`<span>{{ ${str} }}</span>`;
      const title = "Error: Invalid inline IDL string.";
      showError(error.message, "core/inlines", { title, elements: [el] });
      return el;
    }
    const render = html(document.createDocumentFragment());
    const output = [];
    for (const details of results) {
      switch (details.type) {
        case "base": {
          const base = renderBase(details);
          if (base) output.push(base);
          break;
        }
        case "attribute":
          output.push(renderAttribute(details));
          break;
        case "internal-slot":
          output.push(renderInternalSlot(details));
          break;
        case "method":
          output.push(renderMethod(details));
          break;
        case "enum":
          output.push(renderEnum(details));
          break;
        case "exception":
          output.push(renderException(details));
          break;
        case "idl-primitive":
          output.push(renderIdlPrimitiveType(details));
          break;
        default:
          throw new Error("Unknown type.");
      }
    }
    const result = render`${output}`;
    return result;
  }

  // @ts-check
  /**
   * Module core/biblio-db
   *
   * Wraps IndexedDB, allowing the storage of references and aliases on the
   * client.
   *
   * It's a standalone module that can be imported into other modules.
   *
   */

  /**
   * @typedef {keyof BiblioDb} AllowedType
   * @type {Set<AllowedType>}
   */
  const ALLOWED_TYPES = new Set(["alias", "reference"]);
  /* Database initialization tracker */
  const readyPromise = openIdb();

  /**
   * @typedef {object} BiblioDb
   *
   * @property {object} alias Object store for alias objects
   * @property {string} alias.key
   * @property {object} alias.value
   * @property {object} alias.indexes
   * @property {string} alias.aliasOf
   *
   * @property {object} reference Object store for reference objects
   * @property {string} reference.key
   * @property {object} reference.value
   *
   * @returns {Promise<import("idb").IDBPDatabase<BiblioDb>>}
   */
  async function openIdb() {
    /** @type {import("idb").IDBPDatabase<BiblioDb>} */
    const db = await idb.openDB("respec-biblio2", 12, {
      upgrade(db) {
        Array.from(db.objectStoreNames).map(storeName =>
          db.deleteObjectStore(storeName)
        );
        const store = db.createObjectStore("alias", { keyPath: "id" });
        store.createIndex("aliasOf", "aliasOf", { unique: false });
        db.createObjectStore("reference", { keyPath: "id" });
      },
    });
    // Clean the database of expired biblio entries.
    const now = Date.now();
    for (const storeName of [...ALLOWED_TYPES]) {
      const store = db.transaction(storeName, "readwrite").store;
      const range = IDBKeyRange.lowerBound(now);
      let result = await store.openCursor(range);
      while (result?.value) {
        /** @type {BiblioData} */
        const entry = result.value;
        if (entry.expires === undefined || entry.expires < now) {
          await store.delete(entry.id);
        }
        result = await result.continue();
      }
    }

    return db;
  }

  const biblioDB = {
    get ready() {
      return readyPromise;
    },
    /**
     * Finds either a reference or an alias.
     * If it's an alias, it resolves it.
     *
     * @param {String} id The reference or alias to look for.
     * @return {Promise<BiblioData?>} The reference or null.
     */
    async find(id) {
      if (await this.isAlias(id)) {
        id = await this.resolveAlias(id);
      }
      return await this.get("reference", id);
    },
    /**
     * Checks if the database has an id for a given type.
     *
     * @param {AllowedType} type One of the ALLOWED_TYPES.
     * @param {String} id The reference to find.
     * @return {Promise<Boolean>} True if it has it, false otherwise.
     */
    async has(type, id) {
      if (!ALLOWED_TYPES.has(type)) {
        throw new TypeError(`Invalid type: ${type}`);
      }
      if (!id) {
        throw new TypeError("id is required");
      }
      const db = await this.ready;
      const objectStore = db.transaction(type, "readonly").store;
      const range = IDBKeyRange.only(id);
      const result = await objectStore.openCursor(range);
      return !!result;
    },
    /**
     * Checks if a given id is an alias.
     *
     * @param {String} id The reference to check.
     * @return {Promise<Boolean>} Resolves with true if found.
     */
    async isAlias(id) {
      return await this.has("alias", id);
    },
    /**
     * Resolves an alias to its corresponding reference id.
     *
     * @param {String} id The id of the alias to look up.
     * @return {Promise<String>} The id of the resolved reference.
     */
    async resolveAlias(id) {
      if (!id) {
        throw new TypeError("id is required");
      }
      const db = await this.ready;

      const objectStore = db.transaction("alias", "readonly").store;
      const range = IDBKeyRange.only(id);
      const result = await objectStore.openCursor(range);
      return result ? result.value.aliasOf : null;
    },
    /**
     * Get a reference or alias out of the database.
     *
     * @param {AllowedType} type The type as per ALLOWED_TYPES.
     * @param {string} id The id for what to look up.
     * @return {Promise<BiblioData?>} Resolves with the retrieved object, or null.
     */
    async get(type, id) {
      if (!ALLOWED_TYPES.has(type)) {
        throw new TypeError(`Invalid type: ${type}`);
      }
      if (!id) {
        throw new TypeError("id is required");
      }
      const db = await this.ready;
      const objectStore = db.transaction(type, "readonly").store;
      const range = IDBKeyRange.only(id);
      const result = await objectStore.openCursor(range);
      return result ? result.value : null;
    },
    /**
     * Adds references and aliases to database. This is usually the data from
     * Specref's output (parsed JSON).
     *
     * @param {BibliographyMap} data An object that contains references and aliases.
     * @param {number} expires The date/time when the data expires.
     */
    async addAll(data, expires) {
      if (!data) {
        return;
      }
      const aliasesAndRefs = { alias: [], reference: [] };
      for (const id of Object.keys(data)) {
        /** @type {BiblioData} */
        const obj = { id, ...data[id], expires };
        if (obj.aliasOf) {
          aliasesAndRefs.alias.push(obj);
        } else {
          aliasesAndRefs.reference.push(obj);
        }
      }
      const promisesToAdd = [...ALLOWED_TYPES].flatMap(type => {
        return aliasesAndRefs[type].map(details => this.add(type, details));
      });
      await Promise.all(promisesToAdd);
    },
    /**
     * Adds a reference or alias to the database.
     *
     * @param {AllowedType} type The type as per ALLOWED_TYPES.
     * @param {BiblioData} details The object to store.
     */
    async add(type, details) {
      if (!ALLOWED_TYPES.has(type)) {
        throw new TypeError(`Invalid type: ${type}`);
      }
      if (typeof details !== "object") {
        throw new TypeError("details should be an object");
      }
      if (type === "alias" && !details.hasOwnProperty("aliasOf")) {
        throw new TypeError("Invalid alias object.");
      }
      const db = await this.ready;
      let isInDB = await this.has(type, details.id);
      // update or add, depending of already having it in db
      // or if it's expired
      if (isInDB) {
        const entry = await this.get(type, details.id);
        if (entry?.expires < Date.now()) {
          const { store } = db.transaction(type, "readwrite");
          await store.delete(details.id);
          isInDB = false;
        }
      }
      const { store } = db.transaction(type, "readwrite");
      return isInDB ? await store.put(details) : await store.add(details);
    },
    /**
     * Closes the underlying database.
     *
     * @return {Promise<void>} Resolves after database closes.
     */
    async close() {
      const db = await this.ready;
      db.close();
    },

    /**
     * Clears the underlying database
     */
    async clear() {
      const db = await this.ready;
      const storeNames = [...ALLOWED_TYPES];
      const stores = db.transaction(storeNames, "readwrite");
      const clearStorePromises = storeNames.map(name => {
        return stores.objectStore(name).clear();
      });
      await Promise.all(clearStorePromises);
    },
  };

  // @ts-check
  // Module core/biblio
  // Pre-processes bibliographic references
  // Configuration:
  //  - localBiblio: override or supplement the official biblio with your own.


  /** @type {Conf['biblio']} */
  const biblio = {};

  const name$S = "core/biblio";

  const bibrefsURL = new URL("https://api.specref.org/bibrefs?refs=");

  // Opportunistically dns-prefetch to bibref server, as we don't know yet
  // if we will actually need to download references yet.
  const link$1 = createResourceHint({
    hint: "dns-prefetch",
    href: bibrefsURL.origin,
  });
  document.head.appendChild(link$1);
  let doneResolver;

  /** @type {Promise<Conf['biblio']>} */
  const done = new Promise(resolve => {
    doneResolver = resolve;
  });

  async function updateFromNetwork(
    refs,
    options = { forceUpdate: false }
  ) {
    const refsToFetch = [...new Set(refs)].filter(ref => ref.trim());
    // Update database if needed, if we are online
    if (!refsToFetch.length || navigator.onLine === false) {
      return null;
    }
    let response;
    try {
      response = await fetch(bibrefsURL.href + refsToFetch.join(","));
    } catch (err) {
      console.error(err);
      return null;
    }
    if ((!options.forceUpdate && !response.ok) || response.status !== 200) {
      return null;
    }
    /** @type {Conf['biblio']} */
    const data = await response.json();
    // SpecRef updates every hour, so we should follow suit
    // https://github.com/tobie/specref#hourly-auto-updating
    const oneHourFromNow = Date.now() + 1000 * 60 * 60 * 1;
    try {
      const expires = response.headers.has("Expires")
        ? Math.min(Date.parse(response.headers.get("Expires")), oneHourFromNow)
        : oneHourFromNow;
      await biblioDB.addAll(data, expires);
    } catch (err) {
      console.error(err);
    }
    return data;
  }

  /**
   * @param {string} key
   * @returns {Promise<BiblioData>}
   */
  async function resolveRef(key) {
    const biblio = await done;
    if (!biblio.hasOwnProperty(key)) {
      return null;
    }
    const entry = biblio[key];
    if (entry.aliasOf) {
      return await resolveRef(entry.aliasOf);
    }
    return entry;
  }

  /**
   * @param {string[]} neededRefs
   */
  async function getReferencesFromIdb(neededRefs) {
    const idbRefs = [];
    // See if we have them in IDB
    try {
      await biblioDB.ready; // can throw
      const promisesToFind = neededRefs.map(async id => ({
        id,
        data: await biblioDB.find(id),
      }));
      idbRefs.push(...(await Promise.all(promisesToFind)));
    } catch (err) {
      // IndexedDB died, so we need to go to the network for all
      // references
      idbRefs.push(...neededRefs.map(id => ({ id, data: null })));
      console.warn(err);
    }

    return idbRefs;
  }

  class Plugin {
    /** @param {Conf} conf */
    constructor(conf) {
      this.conf = conf;
    }

    /**
     * Normative references take precedence over informative ones,
     * so any duplicates ones are removed from the informative set.
     */
    normalizeReferences() {
      const normalizedNormativeRefs = new Set(
        [...this.conf.normativeReferences].map(key => key.toLowerCase())
      );
      Array.from(this.conf.informativeReferences)
        .filter(key => normalizedNormativeRefs.has(key.toLowerCase()))
        .forEach(redundantKey =>
          this.conf.informativeReferences.delete(redundantKey)
        );
    }

    getRefKeys() {
      return {
        informativeReferences: Array.from(this.conf.informativeReferences),
        normativeReferences: Array.from(this.conf.normativeReferences),
      };
    }

    async run() {
      const finish = () => {
        doneResolver(this.conf.biblio);
      };
      if (!this.conf.localBiblio) {
        this.conf.localBiblio = {};
      }
      this.conf.biblio = biblio;
      const localAliases = Object.keys(this.conf.localBiblio)
        .filter(key => this.conf.localBiblio[key].hasOwnProperty("aliasOf"))
        .map(key => this.conf.localBiblio[key].aliasOf)
        .filter(key => !this.conf.localBiblio.hasOwnProperty(key));
      this.normalizeReferences();
      const allRefs = this.getRefKeys();
      const neededRefs = Array.from(
        new Set(
          allRefs.normativeReferences
            .concat(allRefs.informativeReferences)
            // Filter, as to not go to network for local refs
            .filter(key => !this.conf.localBiblio.hasOwnProperty(key))
            // but include local aliases which refer to external specs
            .concat(localAliases)
            .sort()
        )
      );

      const idbRefs = neededRefs.length
        ? await getReferencesFromIdb(neededRefs)
        : [];
      const split = { hasData: [], noData: [] };
      idbRefs.forEach(ref => {
        (ref.data ? split.hasData : split.noData).push(ref);
      });
      split.hasData.forEach(ref => {
        biblio[ref.id] = ref.data;
      });
      const externalRefs = split.noData.map(item => item.id);
      if (externalRefs.length) {
        // Going to the network for refs we don't have
        const data = await updateFromNetwork(externalRefs, { forceUpdate: true });
        Object.assign(biblio, data);
      }
      Object.assign(biblio, this.conf.localBiblio);
      finish();
    }
  }

  var biblio$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Plugin: Plugin,
    biblio: biblio,
    name: name$S,
    resolveRef: resolveRef,
    updateFromNetwork: updateFromNetwork
  });

  // @ts-check
  // Module core/render-biblio
  // renders the biblio data pre-processed in core/biblio


  const name$R = "core/render-biblio";

  const localizationStrings$u = {
    en: {
      info_references: "Informative references",
      norm_references: "Normative references",
      references: "References",
      reference_not_found: "Reference not found.",
    },
    ko: {
      references: "참조",
    },
    nl: {
      info_references: "Informatieve referenties",
      norm_references: "Normatieve referenties",
      references: "Referenties",
    },
    es: {
      info_references: "Referencias informativas",
      norm_references: "Referencias normativas",
      references: "Referencias",
      reference_not_found: "Referencia no encontrada.",
    },
    ja: {
      info_references: "参照用参考文献",
      norm_references: "規範的参考文献",
      references: "参考文献",
    },
    de: {
      info_references: "Weiterführende Informationen",
      norm_references: "Normen und Spezifikationen",
      references: "Referenzen",
    },
    zh: {
      info_references: "非规范性引用",
      norm_references: "规范性引用",
      references: "参考文献",
    },
  };

  const l10n$u = getIntlData(localizationStrings$u);

  const REF_STATUSES = new Map([
    ["CR", "W3C Candidate Recommendation"],
    ["ED", "W3C Editor's Draft"],
    ["LCWD", "W3C Last Call Working Draft"],
    ["NOTE", "W3C Working Group Note"],
    ["PR", "W3C Proposed Recommendation"],
    ["REC", "W3C Recommendation"],
    ["WD", "W3C Working Draft"],
  ]);

  const endWithDot = endNormalizer(".");

  /** @param {Conf} conf */
  function run$O(conf) {
    const informs = Array.from(conf.informativeReferences);
    const norms = Array.from(conf.normativeReferences);

    if (!informs.length && !norms.length) return;

    /** @type {HTMLElement} */
    const refSection =
      document.querySelector("section#references") ||
      html`<section id="references"></section>`;

    if (!document.querySelector("section#references > :is(h2, h1)")) {
      // We use a h1 here because this could be structured from markdown
      // which would otherwise end up in the wrong document order
      // when the document is restructured.
      refSection.prepend(html`<h1>${l10n$u.references}</h1>`);
    }

    refSection.classList.add("appendix");

    if (conf.flattenRefs && norms.length) {
      const trim = (a) => a.slice(0, 3).concat(a.length > 3 ? ["..."] : []).join(", ");
      const msg = `flattenRefs is not compatible with having both normative and informative references`;
      const details = `Normative references: ${trim(norms)}; informative references: ${trim(informs)}`;
      const hint = `Disable the flattenRefs option or remove references.`;
      showWarning(msg, name$R, { hint, details });
    }

    if (norms.length) {
      const sec = createReferencesSection(norms, l10n$u.norm_references, conf.flattenRefs);
      refSection.appendChild(sec);
    }
    if (informs.length) {
      const sec = createReferencesSection(informs, l10n$u.info_references, conf.flattenRefs);
      refSection.appendChild(sec);
    }

    document.body.appendChild(refSection);
  }

  /**
   * @param {string[]} refs
   * @param {string} title
   * @param {bool} flatten - disables the section heading
   * @returns {HTMLElement}
   */
  function createReferencesSection(refs, title, flatten) {
    const { goodRefs, badRefs } = groupRefs(refs.map(toRefContent));
    const uniqueRefs = getUniqueRefs(goodRefs);

    const refsToShow = uniqueRefs
      .concat(badRefs)
      .sort((a, b) =>
        a.ref.toLocaleLowerCase().localeCompare(b.ref.toLocaleLowerCase())
      );

    let sec;
    if (flatten) {
      sec = html`<dl class="bibliography">${refsToShow.map(showRef)}</dl>`;
    } else {
      sec = html`<section>
     <h3>${title}</h3>
      <dl class="bibliography">${refsToShow.map(showRef)}</dl>
    </section>`;
      addId(sec, "", title);
    }

    const aliases = getAliases(goodRefs);
    decorateInlineReference(uniqueRefs, aliases);
    warnBadRefs(badRefs);

    return sec;
  }

  /**
   * returns refcontent and unique key for a reference among its aliases
   * and warns about circular references
   * @param {String} ref
   * @typedef {ReturnType<typeof toRefContent>} Ref
   */
  function toRefContent(ref) {
    let refcontent = biblio[ref];
    let key = ref;
    const circular = new Set([key]);
    while (refcontent && refcontent.aliasOf) {
      if (circular.has(refcontent.aliasOf)) {
        refcontent = null;
        const msg = `Circular reference in biblio DB between [\`${ref}\`] and [\`${key}\`].`;
        showError(msg, name$R);
      } else {
        key = refcontent.aliasOf;
        refcontent = biblio[key];
        circular.add(key);
      }
    }
    if (refcontent && !refcontent.id) {
      refcontent.id = ref.toLowerCase();
    }
    return { ref, refcontent };
  }

  /** @param {Ref[]} refs */
  function groupRefs(refs) {
    const goodRefs = [];
    const badRefs = [];
    for (const ref of refs) {
      if (ref.refcontent) {
        goodRefs.push(ref);
      } else {
        badRefs.push(ref);
      }
    }
    return { goodRefs, badRefs };
  }

  /** @param {Ref[]} refs */
  function getUniqueRefs(refs) {
    /** @type {Map<string, Ref>} */
    const uniqueRefs = new Map();
    for (const ref of refs) {
      if (!uniqueRefs.has(ref.refcontent.id)) {
        // the condition ensures that only the first used [[TERM]]
        // shows up in #references section
        uniqueRefs.set(ref.refcontent.id, ref);
      }
    }
    return [...uniqueRefs.values()];
  }

  /**
   * Render an inline citation
   *
   * @param {String} ref the inline reference.
   * @param {String} [linkText] custom link text
   * @returns HTMLElement
   */
  function renderInlineCitation(ref, linkText) {
    const key = ref.replace(/^(!|\?)/, "");
    const href = `#bib-${key.toLowerCase()}`;
    const text = linkText || key;
    const elem = html`<cite
    ><a class="bibref" href="${href}" data-link-type="biblio">${text}</a></cite
  >`;
    return linkText ? elem : html`[${elem}]`;
  }

  /**
   * renders a reference
   * @param {Ref} reference
   */
  function showRef(reference) {
    const { ref, refcontent } = reference;
    const refId = `bib-${ref.toLowerCase()}`;
    const result = html`
    <dt id="${refId}">[${ref}]</dt>
    <dd>
      ${refcontent
        ? { html: stringifyReference(refcontent) }
        : html`<em class="respec-offending-element"
            >${l10n$u.reference_not_found}</em
          >`}
    </dd>
  `;
    return result;
  }

  function endNormalizer(endStr) {
    return str => {
      const trimmed = str.trim();
      const result =
        !trimmed || trimmed.endsWith(endStr) ? trimmed : trimmed + endStr;
      return result;
    };
  }

  /** @param {BiblioData|string} ref */
  function stringifyReference(ref) {
    if (typeof ref === "string") return ref;
    let output = `<cite>${ref.title}</cite>`;

    output = ref.href ? `<a href="${ref.href}">${output}</a>. ` : `${output}. `;

    if (ref.authors && ref.authors.length) {
      output += ref.authors.join("; ");
      if (ref.etAl) output += " et al";
      if (!output.endsWith(".")) output += ". ";
    }
    if (ref.publisher) {
      output = `${output} ${endWithDot(ref.publisher)} `;
    }
    if (ref.date) output += `${ref.date}. `;
    if (ref.status) output += `${REF_STATUSES.get(ref.status) || ref.status}. `;
    if (ref.href) output += `URL: <a href="${ref.href}">${ref.href}</a>`;
    return output;
  }

  /**
   * get aliases for a reference "key"
   */
  function getAliases(refs) {
    return refs.reduce((aliases, ref) => {
      const key = ref.refcontent.id;
      const keys = !aliases.has(key)
        ? aliases.set(key, []).get(key)
        : aliases.get(key);
      keys.push(ref.ref);
      return aliases;
    }, new Map());
  }

  /**
   * fix biblio reference URLs
   * Add title attribute to references
   */
  function decorateInlineReference(refs, aliases) {
    refs
      .map(({ ref, refcontent }) => {
        const refUrl = `#bib-${ref.toLowerCase()}`;
        const selectors = aliases
          .get(refcontent.id)
          .map(alias => `a.bibref[href="#bib-${alias.toLowerCase()}"]`)
          .join(",");
        const elems = document.querySelectorAll(selectors);
        return { refUrl, elems, refcontent };
      })
      .forEach(({ refUrl, elems, refcontent }) => {
        elems.forEach(a => {
          a.setAttribute("href", refUrl);
          a.setAttribute("title", refcontent.title);
          a.dataset.linkType = "biblio";
        });
      });
  }

  /**
   * warn about bad references
   */
  function warnBadRefs(refs) {
    for (const { ref } of refs) {
      /** @type {NodeListOf<HTMLElement>} */
      const links = document.querySelectorAll(
        `a.bibref[href="#bib-${ref.toLowerCase()}"]`
      );
      const elements = [...links].filter(
        ({ textContent: t }) => t.toLowerCase() === ref.toLowerCase()
      );
      const msg = `Reference "[${ref}]" not found.`;
      const hint = `Search for ["${ref}"](https://www.specref.org?q=${ref}) on Specref to see if it exists or if it's misspelled.`;
      showError(msg, name$R, { hint, elements });
    }
  }

  var renderBiblio = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$R,
    renderInlineCitation: renderInlineCitation,
    run: run$O
  });

  // @ts-check
  // Module core/inlines
  // Process all manners of inline information. These are done together despite it being
  // seemingly a better idea to orthogonalise them. The issue is that processing text nodes
  // is harder to orthogonalise, and in some browsers can also be particularly slow.
  // Things that are recognised are <abbr>/<acronym> which when used once are applied
  // throughout the document, [[REFERENCES]]/[[!REFERENCES]], {{ IDL }} and RFC2119 keywords.


  const name$Q = "core/inlines";
  const rfc2119Usage = {};

  /** @param {RegExp[]} regexes */
  const joinRegex = regexes => new RegExp(regexes.map(re => re.source).join("|"));

  const localizationStrings$t = {
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
  const l10n$t = getIntlData(localizationStrings$t);

  // Inline `code`
  // TODO: Replace (?!`) at the end with (?:<!`) at the start when Firefox + Safari
  // add support.
  const inlineCodeRegExp = /(?:`[^`]+`)(?!`)/; // `code`
  const inlineIdlReference = /(?:{{[^}]+\?*}})/; // {{ WebIDLThing }}, {{ WebIDLThing? }}
  const inlineVariable = /\B\|\w[\w\s]*(?:\s*:[\w\s&;"?<>]+\??)?\|\B/; // |var : Type?|
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
      return html`<a data-cite="${ref}" data-matched-text="${matched}"></a>`;
    }
    return html`<a href="${ref}" data-matched-text="${matched}"></a>`;
  }

  /**
   * @param {string} matched
   * @param {Text} text
   */
  function inlineXrefMatches(matched, text) {
    // slices "{{" at the beginning and "}}" at the end
    const ref = norm(matched.slice(2, -2));
    if (ref.startsWith("\\")) {
      return matched.replace("\\", "");
    }

    const node = idlStringToHtml(ref);
    // If it's inside a dfn or a `a`, it should just be coded, not linked.
    // This is because dfn elements are treated as links by ReSpec via role=link.
    const renderAsCode = !!text.parentElement.closest("dfn,a");
    return renderAsCode ? inlineCodeMatches(`\`${node.textContent}\``) : node;
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
    const { type, illegal } = refTypeFromContext(spec, txt.parentElement);
    const cite = renderInlineCitation(spec, linkText);
    const cleanRef = spec.replace(/^(!|\?)/, "");
    if (illegal && !conf.normativeReferences.has(cleanRef)) {
      const citeElem = cite.childNodes[1] || cite;
      const msg = `Normative references in informative sections are not allowed. `;
      const hint = `Remove '!' from the start of the reference \`[[${ref}]]\``;
      showWarning(msg, name$Q, { elements: [citeElem], hint });
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

  function run$N(conf) {
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
      ? new RegExp(`(?:\\b${[...abbrMap.keys()].join("\\b)|(?:\\b")}\\b)`)
      : null;

    // PROCESSING
    // Don't gather text nodes for these:
    const exclusions = ["#respec-ui", ".head", "pre", "svg", "script", "style"];
    const txts = getTextNodes(document.body, exclusions, {
      wsNodes: false, // we don't want nodes with just whitespace
    });
    const keywords = l10n$t.rfc2119Keywords();

    const inlinesRegex = new RegExp(
      `(${
      joinRegex([
        keywords,
        inlineIdlReference,
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

  var inlines = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$Q,
    rfc2119Usage: rfc2119Usage,
    run: run$N
  });

  // @ts-check
  // Module w3c/conformance
  // Handle the conformance section properly.
  const name$P = "w3c/conformance";

  const localizationStrings$s = {
    en: {
      conformance: "Conformance",
      normativity:
        "As well as sections marked as non-normative, all authoring guidelines, " +
        "diagrams, examples, and notes in this specification are non-normative. " +
        "Everything else in this specification is normative.",
      keywordInterpretation(keywords, plural) {
        return html`<p>
        The key word${plural ? "s" : ""} ${keywords} in this document
        ${plural ? "are" : "is"} to be interpreted as described in
        <a href="https://www.rfc-editor.org/info/bcp14">BCP 14</a>
        ${renderInlineCitation("RFC2119")} ${renderInlineCitation("RFC8174")}
        when, and only when, ${plural ? "they appear" : "it appears"} in all
        capitals, as shown here.
      </p>`;
      },
    },
    de: {
      conformance: "Anforderungen",
      normativity:
        "Neben den explizit als nicht-normativ gekennzeichneten Abschnitten " +
        "sind auch alle Diagramme, Beispiele und Hinweise in diesem Dokument " +
        "nicht normativ. Alle anderen Angaben sind normativ.",
      keywordInterpretation(keywords, plural) {
        return html`<p>
        ${plural ? "Die Schlüsselwörter" : "Das Schlüsselwort"} ${keywords} in
        diesem Dokument ${plural ? "sind" : "ist"} gemäß
        <a href="https://www.rfc-editor.org/info/bcp14">BCP 14</a>
        ${renderInlineCitation("RFC2119")} ${renderInlineCitation("RFC8174")}
        und unter Berücksichtigung von
        <a href="https://github.com/adfinis-sygroup/2119/blob/master/2119de.rst"
          >2119de</a
        >
        zu interpretieren, wenn und nur wenn ${plural ? "sie" : "es"} wie hier
        gezeigt durchgehend groß geschrieben wurde${plural ? "n" : ""}.
      </p>`;
      },
    },
  };
  const l10n$s = getIntlData(localizationStrings$s);

  /**
   * @param {Element} conformance
   * @param {*} conf
   */
  function processConformance(conformance, conf) {
    const terms = [...Object.keys(rfc2119Usage)];
    // Add RFC2119 to bibliography
    if (terms.length) {
      conf.normativeReferences.add("RFC2119");
      conf.normativeReferences.add("RFC8174");
    }
    // Put in the 2119 clause and reference
    const keywords = htmlJoinAnd(
      terms.sort(),
      item => html`<em class="rfc2119">${item}</em>`
    );
    const plural = terms.length > 1;
    const content = html`
    <h1>${l10n$s.conformance}</h1>
    <p>${l10n$s.normativity}</p>
    ${terms.length ? l10n$s.keywordInterpretation(keywords, plural) : null}
  `;
    conformance.prepend(...content.childNodes);
  }

  function run$M(conf) {
    const conformance = document.querySelector("section#conformance");
    if (conformance && !conformance.classList.contains("override")) {
      processConformance(conformance, conf);
    }
    // Warn when there are RFC2119/RFC8174 keywords, but not conformance section
    if (!conformance && Object.keys(rfc2119Usage).length) {
      const msg = `Document uses RFC2119 keywords but lacks a conformance section.`;
      const hint = 'Please add a `<section id="conformance">`.';
      showWarning(msg, name$P, { hint });
    }
  }

  var conformance = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$P,
    run: run$M
  });

  /**
   * Validates MIME types strings.
   *
   * @type {DefinitionValidator} */
  function validateMimeType(text, type, elem, pluginName) {
    try {
      // Constructor can throw.
      const type = new MIMEType(text);
      if (type.toString() !== text) {
        throw new Error(`Input doesn't match its canonical form: "${type}".`);
      }
    } catch (error) {
      const msg = `Invalid ${type} "${text}": ${error.message}.`;
      const hint =
        "Check that the MIME type has both a type and a sub-type, and that it's in a canonical form (e.g., `text/plain`).";
      showError(msg, pluginName, { hint, elements: [elem] });
      return false;
    }
    return true;
  }

  /**
   * Validates the names of DOM attribute and elements.
   * @param {"element-attr" | "element"} type
   * @type {DefinitionValidator} */
  function validateDOMName(text, type, elem, pluginName) {
    try {
      switch (type) {
        case "element-attr":
          document.createAttribute(text);
          return true;
        case "element":
          document.createElement(text);
          return true;
      }
    } catch (err) {
      const msg = `Invalid ${type} name "${text}": ${err.message}`;
      const hint = `Check that the ${type} name is allowed per the XML's Name production for ${type}.`;
      showError(msg, pluginName, { hint, elements: [elem] });
    }
    return false;
  }

  /**
   * Validates common variable or other named thing in a spec, like event names.
   *
   * @type {DefinitionValidator}
   */
  function validateCommonName(text, type, elem, pluginName) {
    // Check a-z, maybe a dash and letters, case insensitive.
    // Also, no spaces.
    if (/^[a-z]+(-[a-z]+)*$/i.test(text)) {
      return true; // all good
    }
    const msg = `Invalid ${type} name "${text}".`;
    const hint = `Check that the ${type} name is allowed per the naming rules for this type.`;
    showError(msg, pluginName, { hint, elements: [elem] });
    return false;
  }

  /**
   * @type {DefinitionValidator} */
  function validateQuotedString(text, type, elem, pluginName) {
    if (text.startsWith(`"`) && text.endsWith(`"`)) {
      return validateCommonName(text.slice(1, -1), type, elem, pluginName);
    }
    const msg = `Invalid ${type} "${text}".`;
    const hint = `Check that the ${type} is quoted with double quotes.`;
    showError(msg, pluginName, { hint, elements: [elem] });
    return false;
  }

  // @ts-check

  /** @type {CaseInsensitiveMap<Set<HTMLElement>>} */
  const definitionMap = new CaseInsensitiveMap();

  /**
   * @param {HTMLElement} dfn A definition element to register
   * @param {string[]} names Names to register the element by
   */
  function registerDefinition(dfn, names) {
    for (const name of names) {
      if (!definitionMap.has(name)) {
        definitionMap.set(name, new Set());
      }
      definitionMap.get(name).add(dfn);
    }
  }

  // @ts-check
  // Module core/dfn
  // - Finds all <dfn> elements and populates definitionMap to identify them.


  const name$O = "core/dfn";

  /** @type {Map<string, { requiresFor: boolean, validator?: DefinitionValidator, associateWith?: string}>}  */
  const knownTypesMap = new Map([
    ["abstract-op", { requiresFor: false }],
    [
      "attr-value",
      {
        requiresFor: true,
        associateWith: "a markup attribute",
        validator: validateCommonName,
      },
    ],
    ["element", { requiresFor: false, validator: validateDOMName }],
    [
      "element-attr",
      {
        requiresFor: false,
        validator: validateDOMName,
      },
    ],
    [
      "element-state",
      {
        requiresFor: true,
        associateWith: "a markup attribute",
        validator: validateCommonName,
      },
    ],
    ["event", { requiresFor: false, validator: validateCommonName }],
    ["http-header", { requiresFor: false }],
    ["media-type", { requiresFor: false, validator: validateMimeType }],
    ["scheme", { requiresFor: false, validator: validateCommonName }],
    ["permission", { requiresFor: false, validator: validateQuotedString }],
  ]);

  const knownTypes = [...knownTypesMap.keys()];

  function run$L() {
    for (const dfn of document.querySelectorAll("dfn")) {
      const titles = getDfnTitles(dfn);
      registerDefinition(dfn, titles);

      // It's a legacy cite or redefining a something it doesn't own, so it gets no benefit.
      if (dfn.dataset.cite && /\b#\b/.test(dfn.dataset.cite)) {
        continue;
      }

      const [linkingText] = titles;
      computeType(dfn, linkingText);
      computeExport(dfn);

      // Only add `lt`s that are different from the text content and local-lts
      const localLt = (dfn.dataset.localLt || "").split("|").map(norm);
      const lt = titles.filter(t => !localLt.includes(t));
      if (lt.length > 1 || linkingText !== norm(dfn.textContent)) {
        dfn.dataset.lt = lt.join("|");
      }
    }
  }

  /**
   * @param {HTMLElement} dfn
   * @param {string} linkingText
   * */
  function computeType(dfn, linkingText) {
    let type = "";

    switch (true) {
      // class defined type (e.g., "<dfn class="element">)
      case knownTypes.some(name => dfn.classList.contains(name)):
        // First one wins
        type = [...dfn.classList].find(className => knownTypesMap.has(className));
        validateDefinition(linkingText, type, dfn);
        break;

      // Internal slots: attributes+ methods (e.g., [[some words]](with, optional, arguments))
      case slotRegex.test(linkingText):
        type = processAsInternalSlot(linkingText, dfn);
        break;
    }

    // Derive closest type
    if (!type && !dfn.matches("[data-dfn-type]")) {
      /** @type {HTMLElement} */
      const closestType = dfn.closest("[data-dfn-type]");
      type = closestType?.dataset.dfnType;
    }
    // only if we have type and one wasn't explicitly given.
    if (type && !dfn.dataset.dfnType) {
      dfn.dataset.dfnType = type;
    }
    // Finally, addContractDefaults() will add the type to the dfn if it's not there.
    // But other modules may end up adding a type (e.g., the WebIDL module)
  }

  // Deal with export/no export
  function computeExport(dfn) {
    switch (true) {
      // Error if we have both exports and no exports.
      case dfn.matches(".export.no-export"): {
        const msg = docLink`Declares both "${"[no-export]"}" and "${"[export]"}" CSS class.`;
        const hint = "Please use only one.";
        showError(msg, name$O, { elements: [dfn], hint });
        break;
      }

      // No export wins
      case dfn.matches(".no-export, [data-noexport]"):
        if (dfn.matches("[data-export]")) {
          const msg = docLink`Declares ${"[no-export]"} CSS class, but also has a "${"[data-export]"}" attribute.`;
          const hint = "Please chose only one.";
          showError(msg, name$O, { elements: [dfn], hint });
          delete dfn.dataset.export;
        }
        dfn.dataset.noexport = "";
        break;

      // If the author explicitly asked for it to be exported, so let's export it.
      case dfn.matches(":is(.export):not([data-noexport], .no-export)"):
        dfn.dataset.export = "";
        break;
    }
  }

  /**
   * @param {string} text
   * @param {string} type
   * @param {HTMLElement} dfn
   */
  function validateDefinition(text, type, dfn) {
    const entry = knownTypesMap.get(type);
    if (entry.requiresFor && !dfn.dataset.dfnFor) {
      const msg = docLink`Definition of type "\`${type}\`" requires a ${"[data-dfn-for]"} attribute.`;
      const { associateWith } = entry;
      const hint = docLink`Use a ${"[data-dfn-for]"} attribute to associate this with ${associateWith}.`;
      showError(msg, name$O, { hint, elements: [dfn] });
    }

    if (entry.validator) {
      entry.validator(text, type, dfn, name$O);
    }
  }

  /**
   *
   * @param {string} title
   * @param {HTMLElement} dfn
   */
  function processAsInternalSlot(title, dfn) {
    if (!dfn.dataset.hasOwnProperty("idl")) {
      dfn.dataset.idl = "";
    }

    // Automatically use the closest data-dfn-for as the parent.
    /** @type HTMLElement */
    const parent = dfn.closest("[data-dfn-for]");
    if (dfn !== parent && parent?.dataset.dfnFor) {
      dfn.dataset.dfnFor = parent.dataset.dfnFor;
    }

    // Assure that it's data-dfn-for= something.
    if (!dfn.dataset.dfnFor) {
      const msg = `Internal slot "${title}" must be associated with a WebIDL interface.`;
      const hint = docLink`Use a ${"[data-dfn-for]"} attribute to associate this dfn with a WebIDL interface.`;
      showError(msg, name$O, { hint, elements: [dfn] });
    }

    // Don't export internal slots by default, as they are not supposed to be public.
    if (!dfn.matches(".export, [data-export]")) {
      dfn.dataset.noexport = "";
    }

    // If it ends with a ), then it's method. Attribute otherwise.
    const derivedType = title.endsWith(")") ? "method" : "attribute";
    if (!dfn.dataset.dfnType) {
      return derivedType;
    }

    // Perform validation on the dfn's type.
    const allowedSlotTypes = ["attribute", "method"];
    const { dfnType } = dfn.dataset;
    if (!allowedSlotTypes.includes(dfnType) || derivedType !== dfnType) {
      const msg = docLink`Invalid ${"[data-dfn-type]"} attribute on internal slot.`;
      const prettyTypes = codedJoinOr(allowedSlotTypes, {
        quotes: true,
      });
      const hint = `The only allowed types are: ${prettyTypes}. The slot "${title}" seems to be a "${toMDCode(
      derivedType
    )}"?`;
      showError(msg, name$O, { hint, elements: [dfn] });
      return "dfn";
    }
    return dfnType;
  }

  var dfn = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$O,
    run: run$L
  });

  // @ts-check
  // Adds automatic pluralization to dfns
  // If a dfn is referenced as it's plural (and plural of `data-lt` attributes),
  //   plurals of it are automatically added to `data-plurals`.
  // The linking is done in core/link-to-dfn


  const name$N = "core/pluralize";

  function run$K(conf) {
    if (!conf.pluralize) return;

    const pluralizeDfn = getPluralizer();

    /** @type {NodeListOf<HTMLElement>} */
    const dfns = document.querySelectorAll(
      "dfn:not([data-lt-no-plural]):not([data-lt-noDefault])"
    );
    dfns.forEach(dfn => {
      const terms = [dfn.textContent];
      if (dfn.dataset.lt) terms.push(...dfn.dataset.lt.split("|"));
      if (dfn.dataset.localLt) {
        terms.push(...dfn.dataset.localLt.split("|"));
      }

      const plurals = new Set(terms.map(pluralizeDfn).filter(plural => plural));

      if (plurals.size) {
        const userDefinedPlurals = dfn.dataset.plurals
          ? dfn.dataset.plurals.split("|")
          : [];
        const uniquePlurals = [...new Set([...userDefinedPlurals, ...plurals])];
        dfn.dataset.plurals = uniquePlurals.join("|");
        registerDefinition(dfn, uniquePlurals);
      }
    });
  }

  function getPluralizer() {
    /** @type {Set<string>} */
    const links = new Set();
    /** @type {NodeListOf<HTMLAnchorElement>} */
    const reflessAnchors = document.querySelectorAll("a:not([href])");
    reflessAnchors.forEach(el => {
      const normText = norm(el.textContent).toLowerCase();
      links.add(normText);
      if (el.dataset.lt) {
        links.add(el.dataset.lt);
      }
    });

    /** @type {Set<string>} */
    const dfnTexts = new Set();
    /** @type {NodeListOf<HTMLElement>} */
    const dfns = document.querySelectorAll("dfn:not([data-lt-noDefault])");
    dfns.forEach(dfn => {
      const normText = norm(dfn.textContent).toLowerCase();
      dfnTexts.add(normText);
      if (dfn.dataset.lt) {
        dfn.dataset.lt.split("|").forEach(lt => dfnTexts.add(lt));
      }
      if (dfn.dataset.localLt) {
        dfn.dataset.localLt.split("|").forEach(lt => dfnTexts.add(lt));
      }
    });

    // returns pluralized/singularized term if `text` needs pluralization/singularization, "" otherwise
    return function pluralizeDfn(/** @type {string} */ text) {
      const normText = norm(text).toLowerCase();
      const plural = pluralize$1.isSingular(normText)
        ? pluralize$1.plural(normText)
        : pluralize$1.singular(normText);
      return links.has(plural) && !dfnTexts.has(plural) ? plural : "";
    };
  }

  var pluralize = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$N,
    run: run$K
  });

  /* --- EXAMPLES --- */
  const css$k = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$l = css$k`
span.example-title {
  text-transform: none;
}

:is(aside,div).example,
div.illegal-example {
  padding: 0.5em;
  margin: 1em 0;
  position: relative;
  clear: both;
}

div.illegal-example {
  color: red;
}

div.illegal-example p {
  color: black;
}

aside.example div.example {
  border-left-width: 0.1em;
  border-color: #999;
  background: #fff;
}
`;

  // @ts-check
  // Module core/examples
  // Manages examples, including marking them up, numbering, inserting the title,
  // and reindenting.
  // Examples are any pre element with class "example" or "illegal-example".
  // When an example is found, it is reported using the "example" event. This can
  // be used by a containing shell to extract all examples.


  const name$M = "core/examples";

  const localizationStrings$r = {
    en: {
      example: "Example",
    },
    nl: {
      example: "Voorbeeld",
    },
    es: {
      example: "Ejemplo",
    },
    ko: {
      example: "예시",
    },
    ja: {
      example: "例",
    },
    de: {
      example: "Beispiel",
    },
    zh: {
      example: "例",
    },
  };

  const l10n$r = getIntlData(localizationStrings$r);

  /**
   * @typedef {object} Report
   * @property {number} number
   * @property {boolean} illegal
   * @property {string} [title]
   * @property {string} [content]
   *
   * @param {HTMLElement} elem
   * @param {number} num
   * @param {Report} report
   */
  function makeTitle(elem, num, report) {
    report.title = elem.title;
    if (report.title) elem.removeAttribute("title");
    const number = num > 0 ? ` ${num}` : "";
    const title = report.title
      ? html`<span class="example-title">: ${report.title}</span>`
      : "";
    return html`<div class="marker">
    <a class="self-link">${l10n$r.example}<bdi>${number}</bdi></a
    >${title}
  </div>`;
  }

  function run$J() {
    /** @type {NodeListOf<HTMLElement>} */
    const examples = document.querySelectorAll(
      "pre.example, pre.illegal-example, aside.example"
    );
    if (!examples.length) return;

    document.head.insertBefore(
      html`<style>
      ${css$l}
    </style>`,
      document.querySelector("link")
    );

    let number = 0;
    examples.forEach(example => {
      example.classList.contains("illegal-example");
      /** @type {Report} */
      const report = {
        };
      const { title } = example;
      if (example.localName === "aside") {
        ++number;
        const div = makeTitle(example, number, report);
        example.prepend(div);
        const id = addId(example, "example", title || String(number));
        const selfLink = div.querySelector("a.self-link");
        selfLink.href = `#${id}`;
      } else {
        const inAside = !!example.closest("aside");
        if (!inAside) ++number;

        report.content = example.innerHTML;

        // wrap
        example.classList.remove("example", "illegal-example");
        // relocate the id to the div
        const id = example.id ? example.id : null;
        if (id) example.removeAttribute("id");
        const exampleTitle = makeTitle(example, inAside ? 0 : number, report);
        const div = html`<div class="example" id="${id}">
        ${exampleTitle} ${example.cloneNode(true)}
      </div>`;
        addId(div, "example", title || String(number));
        const selfLink = div.querySelector("a.self-link");
        selfLink.href = `#${div.id}`;
        example.replaceWith(div);
      }
    });
  }

  var examples = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$M,
    run: run$J
  });

  /* --- ISSUES/NOTES --- */
  const css$i = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$j = css$i`
.issue-label {
  text-transform: initial;
}

.warning > p:first-child {
  margin-top: 0;
}
.warning {
  padding: 0.5em;
  border-left-width: 0.5em;
  border-left-style: solid;
}
span.warning {
  padding: 0.1em 0.5em 0.15em;
}

.issue.closed span.issue-number {
  text-decoration: line-through;
}

.issue.closed span.issue-number::after {
  content: " (Closed)";
  font-size: smaller;
}

.warning {
  border-color: #f11;
  border-color: var(--warning-border, #f11);
  border-width: 0.2em;
  border-style: solid;
  background: #fbe9e9;
  background: var(--warning-bg, #fbe9e9);
  color: black;
  color: var(--text, black);
}

.warning-title:before {
  content: "⚠"; /*U+26A0 WARNING SIGN*/
  font-size: 1.3em;
  float: left;
  padding-right: 0.3em;
  margin-top: -0.3em;
}

li.task-list-item {
  list-style: none;
}

input.task-list-item-checkbox {
  margin: 0 0.35em 0.25em -1.6em;
  vertical-align: middle;
}

.issue a.respec-gh-label {
  padding: 5px;
  margin: 0 2px 0 2px;
  font-size: 10px;
  text-transform: none;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  position: relative;
  bottom: 2px;
  border: none;
  display: inline-block;
}
`;

  // @ts-check
  // Module core/issues-notes
  // Manages issues and notes, including marking them up, numbering, inserting the title,
  // and injecting the style sheet.
  // These are elements with classes "issue" or "note".
  // When an issue or note is found, it is reported using the "issue" or "note" event. This can
  // be used by a containing shell to extract all of these.
  // Issues are automatically numbered by default, but you can assign them specific numbers (or,
  // despite the name, any arbitrary identifier) using the data-number attribute. Note that as
  // soon as you use one data-number on any issue all the other issues stop being automatically
  // numbered to avoid involuntary clashes.
  // If the configuration has issueBase set to a non-empty string, and issues are
  // manually numbered, a link to the issue is created using issueBase and the issue number
  const name$L = "core/issues-notes";

  const localizationStrings$q = {
    en: {
      editors_note: "Editor's note",
      feature_at_risk: "(Feature at Risk) Issue",
      issue: "Issue",
      issue_summary: "Issue summary",
      no_issues_in_spec: "There are no issues listed in this specification.",
      note: "Note",
      warning: "Warning",
    },
    ja: {
      note: "注",
      editors_note: "編者注",
      feature_at_risk: "(変更の可能性のある機能) Issue",
      issue: "Issue",
      issue_summary: "Issue の要約",
      no_issues_in_spec: "この仕様には未解決の issues は含まれていません．",
      warning: "警告",
    },
    nl: {
      editors_note: "Redactionele noot",
      issue_summary: "Lijst met issues",
      no_issues_in_spec: "Er zijn geen problemen vermeld in deze specificatie.",
      note: "Noot",
      warning: "Waarschuwing",
    },
    es: {
      editors_note: "Nota de editor",
      issue: "Cuestión",
      issue_summary: "Resumen de la cuestión",
      note: "Nota",
      no_issues_in_spec: "No hay problemas enumerados en esta especificación.",
      warning: "Aviso",
    },
    de: {
      editors_note: "Redaktioneller Hinweis",
      issue: "Frage",
      issue_summary: "Offene Fragen",
      no_issues_in_spec: "Diese Spezifikation enthält keine offenen Fragen.",
      note: "Hinweis",
      warning: "Warnung",
    },
    zh: {
      editors_note: "编者注",
      feature_at_risk: "（有可能变动的特性）Issue",
      issue: "Issue",
      issue_summary: "Issue 总结",
      no_issues_in_spec: "本规范中未列出任何 issue。",
      note: "注",
      warning: "警告",
    },
  };

  const l10n$q = getIntlData(localizationStrings$q);

  /**
   * @typedef {object} Report
   * @property {string} type
   * @property {boolean} inline
   * @property {number} number
   * @property {string} title

   * @typedef {object} GitHubLabel
   * @property {string} color
   * @property {string} name
   *
   * @typedef {object} GitHubIssue
   * @property {string} title
   * @property {string} state
   * @property {string} bodyHTML
   * @property {GitHubLabel[]} labels

   * @param {HTMLElement[]} ins
   * @param {Map<string, GitHubIssue>} ghIssues
   * @param {*} conf
   */
  function handleIssues(ins, ghIssues, conf) {
    const getIssueNumber = createIssueNumberGetter();
    const issueList = document.createElement("ul");
    ins.forEach(inno => {
      const { type, displayType, isFeatureAtRisk } = getIssueType(inno);
      const isIssue = type === "issue";
      const isInline = inno.localName === "span";
      const { number: dataNum } = inno.dataset;
      const report = {
        title: inno.title,
        number: getIssueNumber(inno),
      };
      // wrap
      if (!isInline) {
        const cssClass = isFeatureAtRisk ? `${type} atrisk` : type;
        const ariaRole = type === "note" ? "note" : null;
        const div = html`<div class="${cssClass}" role="${ariaRole}"></div>`;
        const title = document.createElement("span");
        const className = `${type}-title marker`;
        // prettier-ignore
        const titleParent = html`<div role="heading" class="${className}">${title}</div>`;
        addId(titleParent, "h", type);
        let text = displayType;
        if (inno.id) {
          div.id = inno.id;
          inno.removeAttribute("id");
        } else {
          addId(
            div,
            "issue-container",
            report.number ? `number-${report.number}` : ""
          );
        }
        /** @type {GitHubIssue} */
        let ghIssue;
        if (isIssue) {
          if (report.number !== undefined) {
            text += ` ${report.number}`;
          }
          if (inno.dataset.hasOwnProperty("number")) {
            const link = linkToIssueTracker(dataNum, conf, { isFeatureAtRisk });
            if (link) {
              title.before(link);
              link.append(title);
            }
            title.classList.add("issue-number");
            ghIssue = ghIssues.get(dataNum);
            if (!ghIssue) {
              const msg = `Failed to fetch issue number ${dataNum}.`;
              showWarning(msg, name$L);
            }
            if (ghIssue && !report.title) {
              report.title = ghIssue.title;
            }
          }
          issueList.append(createIssueSummaryEntry(l10n$q.issue, report, div.id));
        }
        title.textContent = text;
        if (report.title) {
          inno.removeAttribute("title");
          const { repoURL = "" } = conf.github || {};
          const labels = ghIssue ? ghIssue.labels : [];
          if (ghIssue && ghIssue.state === "CLOSED") {
            div.classList.add("closed");
          }
          titleParent.append(createLabelsGroup(labels, report.title, repoURL));
        }
        /** @type {HTMLElement | DocumentFragment} */
        let body = inno;
        inno.replaceWith(div);
        body.classList.remove(type);
        body.removeAttribute("data-number");
        if (ghIssue && !body.innerHTML.trim()) {
          body = document
            .createRange()
            .createContextualFragment(ghIssue.bodyHTML);
        }
        div.append(titleParent, body);
        const level = parents(titleParent, "section").length + 2;
        titleParent.setAttribute("aria-level", level);
      }
    });
    makeIssueSectionSummary(issueList);
  }

  function createIssueNumberGetter() {
    if (document.querySelector(".issue[data-number]")) {
      return element => {
        if (element.dataset.number) {
          return Number(element.dataset.number);
        }
      };
    }

    let issueNumber = 0;
    return element => {
      if (element.classList.contains("issue") && element.localName !== "span") {
        return ++issueNumber;
      }
    };
  }

  /**
   * @typedef {object} IssueType
   * @property {string} type
   * @property {string} displayType
   * @property {boolean} isFeatureAtRisk
   *
   * @param {HTMLElement} inno
   * @return {IssueType}
   */
  function getIssueType(inno) {
    const isIssue = inno.classList.contains("issue");
    const isWarning = inno.classList.contains("warning");
    const isEdNote = inno.classList.contains("ednote");
    const isFeatureAtRisk = inno.classList.contains("atrisk");
    const type = isIssue
      ? "issue"
      : isWarning
        ? "warning"
        : isEdNote
          ? "ednote"
          : "note";
    const displayType = isIssue
      ? isFeatureAtRisk
        ? l10n$q.feature_at_risk
        : l10n$q.issue
      : isWarning
        ? l10n$q.warning
        : isEdNote
          ? l10n$q.editors_note
          : l10n$q.note;
    return { type, displayType, isFeatureAtRisk };
  }

  /**
   * @param {string} dataNum
   * @param {*} conf
   */
  function linkToIssueTracker(dataNum, conf, { isFeatureAtRisk = false } = {}) {
    // Set issueBase to cause issue to be linked to the external issue tracker
    if (!isFeatureAtRisk && conf.issueBase) {
      return html`<a href="${conf.issueBase + dataNum}" />`;
    } else if (isFeatureAtRisk && conf.atRiskBase) {
      return html`<a href="${conf.atRiskBase + dataNum}" />`;
    }
  }

  /**
   * @param {string} l10nIssue
   * @param {Report} report
   */
  function createIssueSummaryEntry(l10nIssue, report, id) {
    const issueNumberText = `${l10nIssue}${
    report.number ? ` ${report.number}` : ""
  }`;
    const title = report.title
      ? html`<span style="text-transform: none">: ${report.title}</span>`
      : "";
    return html`<li><a href="${`#${id}`}">${issueNumberText}</a>${title}</li>`;
  }

  /**
   *
   * @param {HTMLUListElement} issueList
   */
  function makeIssueSectionSummary(issueList) {
    const issueSummaryElement = document.getElementById("issue-summary");
    if (!issueSummaryElement) return;
    const heading = issueSummaryElement.querySelector("h2, h3, h4, h5, h6");

    issueList.hasChildNodes()
      ? issueSummaryElement.append(issueList)
      : issueSummaryElement.append(html`<p>${l10n$q.no_issues_in_spec}</p>`);
    if (
      !heading ||
      (heading && heading !== issueSummaryElement.firstElementChild)
    ) {
      issueSummaryElement.insertAdjacentHTML(
        "afterbegin",
        `<h1>${l10n$q.issue_summary}</h1>`
      );
    }
  }

  /**
   * @param {GitHubLabel[]} labels
   * @param {string} title
   * @param {string} repoURL
   */
  function createLabelsGroup(labels, title, repoURL) {
    const labelsGroup = labels.map(label => createLabel(label, repoURL));
    if (labelsGroup.length) {
      labelsGroup.unshift(document.createTextNode(" "));
    }
    return html`<span class="issue-label">: ${title}${labelsGroup}</span>`;
  }

  /**
   * Based on https://stackoverflow.com/a/3943023
   * See https://www.w3.org/WAI/WCAG21/Techniques/general/G18.html#tests
   * @param {string} bg background color as a hex value without '#'
   */
  function textColorFromBgColor(bg) {
    const [r, g, b] = [bg.slice(0, 2), bg.slice(2, 4), bg.slice(4, 6)];
    const [R, G, B] = [r, g, b]
      .map(c => parseInt(c, 16) / 255)
      .map(c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return L > 0.179 ? "#000" : "#fff";
  }

  /**
   * @param {GitHubLabel} label
   * @param {string} repoURL
   */
  function createLabel(label, repoURL) {
    const { color: bgColor, name } = label;
    const issuesURL = new URL("./issues/", repoURL);
    issuesURL.searchParams.set("q", `is:issue is:open label:"${label.name}"`);
    const color = textColorFromBgColor(bgColor);
    const style = `background-color: #${bgColor}; color: ${color}`;
    const ariaLabel = `GitHub label: ${name}`;
    return html` <a
    class="respec-gh-label"
    style="${style}"
    href="${issuesURL.href}"
    aria-label="${ariaLabel}"
    >${name}</a
  >`;
  }

  /**
   * @returns {Promise<Map<string, GitHubIssue>>}
   */
  async function fetchAndStoreGithubIssues(github) {
    if (!github || !github.apiBase) {
      return new Map();
    }

    /** @type {NodeListOf<HTMLElement>} */
    const specIssues = document.querySelectorAll(".issue[data-number]");
    const issueNumbers = [...specIssues]
      .map(elem => Number.parseInt(elem.dataset.number, 10))
      .filter(issueNumber => issueNumber);

    if (!issueNumbers.length) {
      return new Map();
    }

    const url = new URL("issues", `${github.apiBase}/${github.fullName}/`);
    url.searchParams.set("issues", issueNumbers.join(","));

    const response = await fetch(url.href);
    if (!response.ok) {
      const msg = `Error fetching issues from GitHub. (HTTP Status ${response.status}).`;
      showError(msg, name$L);
      return new Map();
    }

    /** @type {{ [issueNumber: string]: GitHubIssue }} */
    const issues = await response.json();
    return new Map(Object.entries(issues));
  }

  async function run$I(conf) {
    const query = ".issue, .note, .warning, .ednote";
    /** @type {NodeListOf<HTMLElement>} */
    const allEls = document.querySelectorAll(query);

    const issuesAndNotes = Array.from(allEls).filter(itm => {
      // Removes any elements that are not HTML Elements (e.g., SVG nodes)
      return itm instanceof HTMLElement;
    });

    if (!issuesAndNotes.length) {
      return; // nothing to do.
    }
    const ghIssues = await fetchAndStoreGithubIssues(conf.github);
    const { head: headElem } = document;
    headElem.insertBefore(
      html`<style>
      ${css$j}
    </style>`,
      headElem.querySelector("link")
    );
    handleIssues(issuesAndNotes, ghIssues, conf);
    const ednotes = document.querySelectorAll(".ednote");
    ednotes.forEach(ednote => {
      ednote.classList.remove("ednote");
      ednote.classList.add("note");
    });
  }

  var issuesNotes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$L,
    run: run$I
  });

  // @ts-check
  // Module core/best-practices
  // Handles the marking up of best practices, and can generate a summary of all of them.
  // The summary is generated if there is a section in the document with ID bp-summary.
  // Best practices are marked up with span.practicelab.

  const name$K = "core/best-practices";

  const localizationStrings$p = {
    en: {
      best_practice: "Best Practice ",
    },
    ja: {
      best_practice: "最良実施例 ",
    },
    de: {
      best_practice: "Musterbeispiel ",
    },
    zh: {
      best_practice: "最佳实践 ",
    },
  };
  const l10n$p = getIntlData(localizationStrings$p);
  const lang = lang$1 in localizationStrings$p ? lang$1 : "en";

  function run$H() {
    /** @type {NodeListOf<HTMLElement>} */
    const bps = document.querySelectorAll(".practicelab");
    const bpSummary = document.getElementById("bp-summary");
    const summaryItems = bpSummary ? document.createElement("ul") : null;
    [...bps].forEach((bp, num) => {
      const id = addId(bp, "bp");
      const localizedBpName = html`<a class="marker self-link" href="${`#${id}`}"
      ><bdi lang="${lang}">${l10n$p.best_practice}${num + 1}</bdi></a
    >`;

      // Make the summary items, if we have a summary
      if (summaryItems) {
        const li = html`<li>${localizedBpName}: ${makeSafeCopy(bp)}</li>`;
        summaryItems.appendChild(li);
      }

      const container = bp.closest("div");
      if (!container) {
        // This is just an inline best practice...
        bp.classList.add("advisement");
        return;
      }

      // Make the advisement box
      container.classList.add("advisement");
      const title = html`${localizedBpName.cloneNode(true)}: ${bp}`;
      container.prepend(...title.childNodes);
    });
    if (bps.length) {
      if (bpSummary) {
        bpSummary.appendChild(html`<h1>Best Practices Summary</h1>`);
        bpSummary.appendChild(summaryItems);
      }
    } else if (bpSummary) {
      const msg = `Using best practices summary (#bp-summary) but no best practices found.`;
      showWarning(msg, name$K);
      bpSummary.remove();
    }
  }

  var bestPractices = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$K,
    run: run$H
  });

  // @ts-check
  // Module core/figure
  // Handles figures in the document.
  // Adds width and height to images, if they are missing.
  // Generates a Table of Figures wherever there is a #tof element.


  const name$J = "core/figures";

  const localizationStrings$o = {
    en: {
      list_of_figures: "List of Figures",
      fig: "Figure ",
    },
    ja: {
      fig: "図 ",
      list_of_figures: "図のリスト",
    },
    ko: {
      fig: "그림 ",
      list_of_figures: "그림 목록",
    },
    nl: {
      fig: "Figuur ",
      list_of_figures: "Lijst met figuren",
    },
    es: {
      fig: "Figura ",
      list_of_figures: "Lista de Figuras",
    },
    zh: {
      fig: "图 ",
      list_of_figures: "规范中包含的图",
    },
    de: {
      fig: "Abbildung",
      list_of_figures: "Abbildungsverzeichnis",
    },
  };

  const l10n$o = getIntlData(localizationStrings$o);

  function run$G() {
    const tof = collectFigures();

    // Create a Table of Figures if a section with id 'tof' exists.
    const tofElement = document.getElementById("tof");
    if (tof.length && tofElement) {
      decorateTableOfFigures(tofElement);
      tofElement.append(
        html`<h1>${l10n$o.list_of_figures}</h1>`,
        html`<ul class="tof">
        ${tof}
      </ul>`
      );
    }
  }

  /**
   * process all figures
   */
  function collectFigures() {
    /** @type {HTMLElement[]} */
    const tof = [];
    document.querySelectorAll("figure").forEach((fig, i) => {
      const caption = fig.querySelector("figcaption");

      if (caption) {
        decorateFigure(fig, caption, i);
        tof.push(getTableOfFiguresListItem(fig.id, caption));
      } else {
        const msg = "Found a `<figure>` without a `<figcaption>`.";
        showWarning(msg, name$J, { elements: [fig] });
      }
    });
    return tof;
  }

  /**
   * @param {HTMLElement} figure
   * @param {HTMLElement} caption
   * @param {number} i
   */
  function decorateFigure(figure, caption, i) {
    const title = caption.textContent;
    addId(figure, "fig", title);
    // set proper caption title
    wrapInner(caption, html`<span class="fig-title"></span>`);
    caption.prepend(
      html`<a class="self-link" href="#${figure.id}"
      >${l10n$o.fig}<bdi class="figno">${i + 1}</bdi></a
    >`,
      " "
    );
  }

  /**
   * @param {string} figureId
   * @param {HTMLElement} caption
   * @return {HTMLElement}
   */
  function getTableOfFiguresListItem(figureId, caption) {
    const tofCaption = caption.cloneNode(true);
    tofCaption.querySelectorAll("a").forEach(anchor => {
      renameElement(anchor, "span").removeAttribute("href");
    });
    return html`<li class="tofline">
    <a class="tocxref" href="${`#${figureId}`}">${tofCaption.childNodes}</a>
  </li>`;
  }

  /**
   * if it has a parent section, don't touch it
   * if it has a class of appendix or introductory, don't touch it
   * if all the preceding section siblings are introductory, make it introductory
   * if there is a preceding section sibling which is an appendix, make it appendix
   * @param {Element} tofElement
   */
  function decorateTableOfFigures(tofElement) {
    if (
      tofElement.classList.contains("appendix") ||
      tofElement.classList.contains("introductory") ||
      tofElement.closest("section")
    ) {
      return;
    }

    const previousSections = getPreviousSections(tofElement);
    if (previousSections.every(sec => sec.classList.contains("introductory"))) {
      tofElement.classList.add("introductory");
    } else if (previousSections.some(sec => sec.classList.contains("appendix"))) {
      tofElement.classList.add("appendix");
    }
  }

  var figures = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$J,
    run: run$G
  });

  // @ts-check
  // Module core/tables
  // Handles tables in the document.
  // Generates a List of Tables wherever there is a #list-of-tables element.


  const name$I = "core/tables";

  const localizationStrings$n = {
    en: {
      list_of_tables: "List of Tables",
      table: "Table ",
    },
  };

  const l10n$n = getIntlData(localizationStrings$n);

  function run$F() {
    const listOfTables = collectTables();
    const listOfTablesElement = document.querySelector("section#list-of-tables");
    if (listOfTables.length && listOfTablesElement) {
      decorateListOfTables(listOfTablesElement);
      listOfTablesElement.append(
        html`<h1>${l10n$n.list_of_tables}</h1>`,
        html`<ul class="list-of-tables">
        ${listOfTables}
      </ul>`
      );
    }
  }

  /**
   * process all tables
   */
  function collectTables() {
    /** @type {HTMLLIElement[]} */
    const listOfTables = [];
    /** @type {NodeListOf<HTMLTableElement>} */
    const tables = document.querySelectorAll("table.numbered");
    [...tables]
      // there is a separate linter rule to catch numbered tables without captions
      .filter(table => !!table.querySelector("caption"))
      .forEach((table, i) => {
        const caption = table.querySelector("caption");
        decorateTable(table, caption, i);
        listOfTables.push(getListOfTablesListItem(table.id, caption));
      });
    return listOfTables;
  }

  /**
   * @param {HTMLTableElement} table
   * @param {HTMLTableCaptionElement} caption
   * @param {number} i
   */
  function decorateTable(table, caption, i) {
    const title = caption.textContent;
    addId(table, "table", title);
    // set proper caption title
    wrapInner(caption, html`<span class="table-title"></span>`);
    caption.prepend(
      html`<a class="self-link" href="#${table.id}"
      >${l10n$n.table}<bdi class="tableno">${i + 1}</bdi></a
    >`,
      " "
    );
  }

  /**
   * @param {string} tableId
   * @param {HTMLTableCaptionElement} caption
   * @return {HTMLLIElement}
   */
  function getListOfTablesListItem(tableId, caption) {
    const listOfTablesCaption = caption.cloneNode(true);
    for (const anchor of listOfTablesCaption.querySelectorAll("a")) {
      renameElement(anchor, "span", { copyAttributes: false });
    }
    return html`<li>
    <a class="tocxref" href="${`#${tableId}`}"
      >${listOfTablesCaption.childNodes}</a
    >
  </li>`;
  }

  /**
   * if it has a parent section, don't touch it
   * if it has a class of appendix or introductory, don't touch it
   * if all the preceding section siblings are introductory, make it introductory
   * if there is a preceding section sibling which is an appendix, make it appendix
   * @param {Element} listOfTablesElement
   */
  function decorateListOfTables(listOfTablesElement) {
    if (
      listOfTablesElement.matches(".appendix, .introductory") ||
      listOfTablesElement.closest("section")
    ) {
      return;
    }

    const previousSections = getPreviousSections(listOfTablesElement);
    if (previousSections.every(sec => sec.classList.contains("introductory"))) {
      listOfTablesElement.classList.add("introductory");
    } else if (previousSections.some(sec => sec.classList.contains("appendix"))) {
      listOfTablesElement.classList.add("appendix");
    }
  }

  var tables = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$I,
    run: run$F
  });

  // @ts-check

  const topLevelEntities = new Set([
    "callback interface",
    "callback",
    "dictionary",
    "enum",
    "interface mixin",
    "interface",
    "typedef",
  ]);

  /**
   * This function looks for a <dfn> element whose title is 'name' and
   * that is "for" 'parent', which is the empty string when 'name'
   * refers to a top-level entity. For top-level entities, <dfn>
   * elements that inherit a non-empty [dfn-for] attribute are also
   * counted as matching.
   *
   * When a matching <dfn> is found, it's given <code> formatting,
   * marked as an IDL definition, and returned. If no <dfn> is found,
   * the function returns 'undefined'.
   * @param {*} defn
   * @param {string} name
   */
  function findDfn(defn, name, { parent = "" } = {}) {
    switch (defn.type) {
      case "constructor":
      case "operation":
        return findOperationDfn(defn, parent, name);
      default:
        return findNormalDfn(defn, parent, name);
    }
  }

  /**
   * @param {{ type: string, arguments: any[] }} idlAst
   * @param {string} parent
   * @param {string} name
   */
  function getAlternativeNames(idlAst, parent, name) {
    const { type } = idlAst;
    const asQualifiedName = `${parent}.${name}`;
    switch (type) {
      case "constructor":
      case "operation": {
        // Allow linking to "method()", method(arg) and "method" name.
        const asMethodName = `${name}()`;
        const asFullyQualifiedName = `${asQualifiedName}()`;
        const asMethodWithArgs = generateMethodNamesWithArgs(
          name,
          idlAst.arguments
        );
        return {
          local: [asQualifiedName, asFullyQualifiedName, name],
          exportable: [asMethodName, ...asMethodWithArgs],
        };
      }
      case "attribute":
        return {
          local: [asQualifiedName],
          exportable: [name],
        };
    }
  }

  /**
   * Generates all possible permutations of a method name based
   * on what arguments they method accepts.

   * Required arguments are always present, and optional ones
   * are stacked one by one.
   *
   * For examples: foo(req1, req2), foo(req1, req2, opt1) and so on.
   *
   * @param {String} operationName
   * @param {*} argsAst
   */
  function generateMethodNamesWithArgs(operationName, argsAst) {
    const operationNames = [];
    if (argsAst.length === 0) {
      return operationNames;
    }
    const required = []; // required arguments
    const optional = []; // optional arguments, including variadic ones
    for (const { name, optional: isOptional, variadic } of argsAst) {
      if (isOptional || variadic) {
        optional.push(name);
      } else {
        required.push(name);
      }
    }
    const requiredArgs = required.join(", ");
    const requiredOperation = `${operationName}(${requiredArgs})`;
    operationNames.push(requiredOperation);
    const optionalOps = optional.map((_, index) => {
      const args = [...required, ...optional.slice(0, index + 1)].join(", ");
      const result = `${operationName}(${args})`;
      return result;
    });
    operationNames.push(...optionalOps);
    return operationNames;
  }

  /**
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */
  function findOperationDfn(defn, parent, name) {
    // Overloads all have unique names
    if (name.includes("!overload")) {
      return findNormalDfn(defn, parent, name);
    }
    const asMethodName = `${name}()`;
    return findNormalDfn(defn, parent, asMethodName, name);
  }

  /**
   * @param {HTMLElement} dfn
   * @param {Record<"local" | "exportable", string[]>} names
   */
  function addAlternativeNames(dfn, names) {
    const { local, exportable } = names;
    const lt = dfn.dataset.lt ? new Set(dfn.dataset.lt.split("|")) : new Set();
    for (const item of exportable) {
      lt.add(item);
    }
    // Fix any ill-placed ones - local ones don't belong here
    local.filter(item => lt.has(item)).forEach(item => lt.delete(item));
    dfn.dataset.lt = [...lt].join("|");
    dfn.dataset.localLt = local.join("|");
    registerDefinition(dfn, [...local, ...exportable]);
  }

  /**
   * @param {*} defn
   * @param {string} parent
   * @param {...string} names
   */
  function findNormalDfn(defn, parent, ...names) {
    const { type } = defn;
    for (const name of names) {
      let resolvedName =
        type === "enum-value" && name === "" ? "the-empty-string" : name;
      let dfns = getDfns(resolvedName, parent, name, type);
      // If we haven't found any definitions with explicit [for]
      // and [title], look for a dotted definition, "parent.name".
      if (dfns.length === 0 && parent !== "") {
        resolvedName = `${parent}.${resolvedName}`;
        const alternativeDfns = definitionMap.get(resolvedName);
        if (alternativeDfns && alternativeDfns.size === 1) {
          dfns = [...alternativeDfns];
          registerDefinition(dfns[0], [resolvedName]);
        }
      } else {
        resolvedName = name;
      }
      if (dfns.length > 1) {
        const msg = `WebIDL identifier \`${name}\` ${
        parent ? `for \`${parent}\`` : ""
      } is defined multiple times`;
        const title = "Duplicate definition.";
        showError(msg, name, { title, elements: dfns });
      }
      if (dfns.length) {
        return dfns[0];
      }
    }
  }

  /**
   * @param {HTMLElement} dfnElem
   * @param {*} idlAst
   * @param {string} parent
   * @param {string} name
   */
  function decorateDfn(dfnElem, idlAst, parent, name) {
    if (!dfnElem.id) {
      const lCaseParent = parent.toLowerCase();
      const middle = lCaseParent ? `${lCaseParent}-` : "";
      let last = name.toLowerCase().replace(/[()]/g, "").replace(/\s/g, "-");
      if (last === "") {
        last = "the-empty-string";
        dfnElem.setAttribute("aria-label", "the empty string");
      }
      dfnElem.id = `dom-${middle}${last}`;
    }
    dfnElem.dataset.idl = idlAst.type;
    dfnElem.dataset.title = dfnElem.textContent;
    dfnElem.dataset.dfnFor = parent;
    // Derive the data-type for dictionary members, interface attributes,
    // and methods
    switch (idlAst.type) {
      case "operation":
      case "attribute":
      case "field":
        dfnElem.dataset.type = getDataType(idlAst);
        break;
    }

    // Mark the definition as code.
    if (
      !dfnElem.querySelector("code") &&
      !dfnElem.closest("code") &&
      dfnElem.children
    ) {
      wrapInner(dfnElem, dfnElem.ownerDocument.createElement("code"));
    }

    // Add data-lt and data-local-lt values and register them
    switch (idlAst.type) {
      case "attribute":
      case "constructor":
      case "operation":
        addAlternativeNames(dfnElem, getAlternativeNames(idlAst, parent, name));
        break;
    }

    return dfnElem;
  }

  /**
   * @param {string} name
   * @param {string} parent data-dfn-for
   * @param {string} originalName
   * @param {string} type
   */
  function getDfns(name, parent, originalName, type) {
    const foundDfns = definitionMap.get(name);
    if (!foundDfns || foundDfns.size === 0) {
      return [];
    }
    const dfnForArray = [...foundDfns];
    // Definitions that have a name and [data-dfn-for] that exactly match the
    // IDL entity:
    const dfns = dfnForArray.filter(dfn => {
      // This is explicitly marked as a concept, so we can't use it
      if (dfn.dataset.dfnType === "dfn") return false;

      /** @type {HTMLElement} */
      const closestDfnFor = dfn.closest(`[data-dfn-for]`);
      return closestDfnFor && closestDfnFor.dataset.dfnFor === parent;
    });

    if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
      // Make sure the name exactly matches
      return dfnForArray[0].textContent === originalName ? dfnForArray : [];
    } else if (topLevelEntities.has(type) && dfnForArray.length) {
      const dfn = dfnForArray.find(
        dfn => dfn.textContent.trim() === originalName
      );
      if (dfn) return [dfn];
    }
    return dfns;
  }

  /**
   * @return {string}
   */
  function getDataType(idlStruct = {}) {
    const { idlType, generic, union } = idlStruct;
    if (idlType === undefined) return "";
    if (typeof idlType === "string") return idlType;
    if (generic) return generic;
    // join on "|" handles for "unsigned short" etc.
    if (union) return idlType.map(getDataType).join("|");
    return getDataType(idlType);
  }

  // @ts-check
  /**
   * Module core/webidl-clipboard
   *
   * This module adds a button to each IDL pre making it possible to copy
   * well-formatted IDL to the clipboard.
   *
   */
  const name$H = "core/webidl-clipboard";

  function createButton() {
    const copyButton = document.createElement("button");
    copyButton.innerHTML =
      '<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';
    copyButton.title = "Copy IDL to clipboard";
    copyButton.classList.add("respec-button-copy-paste", "removeOnSave");
    return copyButton;
  }

  const copyButton = createButton();

  /**
   * Adds a HTML button that copies WebIDL to the clipboard.
   *
   * @param {HTMLSpanElement} idlHeader
   */
  function addCopyIDLButton(idlHeader) {
    // There may be multiple <span>s of IDL, so we take everything
    // apart from the idl header.
    const pre = idlHeader.closest("pre.idl");
    const idl = pre.cloneNode(true);
    idl.querySelector(".idlHeader").remove();
    const { textContent: idlText } = idl;
    const button = copyButton.cloneNode(true);
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(idlText);
    });
    idlHeader.append(button);
  }

  var webidlClipboard = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addCopyIDLButton: addCopyIDLButton,
    name: name$H
  });

  /* --- WEB IDL --- */
  const css$g = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$h = css$g`
pre.idl {
  padding: 1em;
  position: relative;
}

pre.idl > code {
  color: black;
  color: var(--text, black);
}

@media print {
  pre.idl {
    white-space: pre-wrap;
  }
}

.idlHeader {
  display: block;
  width: 150px;
  background: #8ccbf2;
  background: var(--def-border, #8ccbf2);
  color: #fff;
  /* TODO: need a better color here */
  color: var(--defrow-border, #fff);
  font-family: sans-serif;
  font-weight: bold;
  margin: -1em 0 1em -1em;
  height: 28px;
  line-height: 28px;
}

.idlHeader a.self-link {
  margin-left: 0.3cm;
  text-decoration: none;
  border-bottom: none;
  color: inherit;
}

.idlID {
  font-weight: bold;
  color: #005a9c;
}

.idlType {
  color: #005a9c;
}

.idlName {
  color: #ff4500;
}

.idlName a {
  color: #ff4500;
  border-bottom: 1px dotted #ff4500;
  text-decoration: none;
}

a.idlEnumItem {
  color: #000;
  border-bottom: 1px dotted #ccc;
  text-decoration: none;
}

.idlSuperclass {
  font-style: italic;
  color: #005a9c;
}

/*.idlParam*/

.idlParamName,
.idlDefaultValue {
  font-style: italic;
}

.extAttr {
  color: #666;
}

/*.idlSectionComment*/

.idlSectionComment {
  color: gray;
}

.idlIncludes a {
  font-weight: bold;
}

.respec-button-copy-paste:focus {
  text-decoration: none;
  border-color: #51a7e8;
  outline: none;
  box-shadow: 0 0 5px rgba(81, 167, 232, 0.5);
}

.respec-button-copy-paste:is(:focus:hover,.selected:focus) {
  border-color: #51a7e8;
}

.respec-button-copy-paste:is(:hover,:active,.zeroclipboard-is-hover,.zeroclipboard-is-active) {
  text-decoration: none;
  background-color: #ddd;
  background-image: linear-gradient(#eee, #ddd);
  border-color: #ccc;
}

.respec-button-copy-paste:is(:active,.selected,.zeroclipboard-is-active) {
  background-color: #dcdcdc;
  background-image: none;
  border-color: #b5b5b5;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

.respec-button-copy-paste.selected:hover {
  background-color: #cfcfcf;
}

.respec-button-copy-paste:is(:disabled,:disabled:hover,.disabled,.disabled:hover) {
  color: rgba(102, 102, 102, 0.5);
  cursor: default;
  background-color: rgba(229, 229, 229, 0.5);
  background-image: none;
  border-color: rgba(197, 197, 197, 0.5);
  box-shadow: none;
}

@media print {
  .respec-button-copy-paste {
    visibility: hidden;
  }
}
`;

  // Module core/webidl
  //  Highlights and links WebIDL marked up inside <pre class="idl">.


  const name$G = "core/webidl";
  const pluginName = name$G;

  const operationNames = {};
  const idlPartials = {};

  const templates = {
    wrap(items) {
      return items
        .flat()
        .filter(x => x !== "")
        .map(x => (typeof x === "string" ? new Text(x) : x));
    },
    trivia(t) {
      if (!t.trim()) {
        return t;
      }
      return html`<span class="idlSectionComment">${t}</span>`;
    },
    generic(keyword) {
      // Shepherd classifies "interfaces" as starting with capital letters,
      // like Promise, FrozenArray, etc.
      return /^[A-Z]/.test(keyword)
        ? html`<a data-xref-type="interface" data-cite="WEBIDL">${keyword}</a>`
        : // Other keywords like sequence, maplike, etc...
          html`<a data-xref-type="dfn" data-cite="WEBIDL">${keyword}</a>`;
    },
    reference(wrapped, unescaped, context) {
      if (context.type === "extended-attribute") {
        return wrapped;
      }
      let type = "_IDL_";
      let cite = null;
      let lt;
      switch (unescaped) {
        case "object":
          type = "interface";
          cite = "WEBIDL";
          break;
      }
      return html`<a
      data-link-type="${type === "_IDL_" ? "idl" : type}"
      data-xref-type="${type}"
      data-cite="${cite}"
      data-lt="${lt}"
      >${wrapped}</a
    >`;
    },
    name(escaped, { data, parent }) {
      if (data.idlType && data.idlType.type === "argument-type") {
        return html`<span class="idlParamName">${escaped}</span>`;
      }
      const idlLink = defineIdlName(escaped, data, parent);
      if (data.type !== "enum-value") {
        const className = parent ? "idlName" : "idlID";
        idlLink.classList.add(className);
      }
      return idlLink;
    },
    nameless(escaped, { data, parent }) {
      switch (data.type) {
        case "operation":
        case "constructor":
          return defineIdlName(escaped, data, parent);
        default:
          return escaped;
      }
    },
    type(contents) {
      return html`<span class="idlType">${contents}</span>`;
    },
    inheritance(contents) {
      return html`<span class="idlSuperclass">${contents}</span>`;
    },
    definition(contents, { data, parent }) {
      const className = getIdlDefinitionClassName(data);
      switch (data.type) {
        case "includes":
        case "enum-value":
          return html`<span class="${className}">${contents}</span>`;
      }
      const parentName = parent ? parent.name : "";
      const { name, idlId } = getNameAndId(data, parentName);
      return html`<span
      class="${className}"
      id="${idlId}"
      data-idl
      data-title="${name}"
      >${contents}</span
    >`;
    },
    extendedAttribute(contents) {
      const result = html`<span class="extAttr">${contents}</span>`;
      return result;
    },
    extendedAttributeReference(name) {
      return html`<a data-xref-type="extended-attribute">${name}</a>`;
    },
  };

  /**
   * Returns a link to existing <dfn> or creates one if doesn’t exists.
   */
  function defineIdlName(escaped, data, parent) {
    const parentName = parent ? parent.name : "";
    const { name } = getNameAndId(data, parentName);
    const dfn = findDfn(data, name, {
      parent: parentName,
    });
    const linkType = getDfnType(data.type);
    if (dfn) {
      if (!data.partial) {
        if (!dfn.matches("[data-noexport]")) dfn.dataset.export = "";
        dfn.dataset.dfnType = linkType;
      }
      decorateDfn(dfn, data, parentName, name);
      const href = `#${dfn.id}`;
      return html`<a
      data-link-for="${parentName}"
      data-link-type="${linkType}"
      href="${href}"
      class="internalDFN"
      ><code>${escaped}</code></a
    >`;
    }

    const isDefaultJSON =
      data.type === "operation" &&
      data.name === "toJSON" &&
      data.extAttrs.some(({ name }) => name === "Default");
    if (isDefaultJSON) {
      return html`<a data-link-type="dfn" data-lt="default toJSON steps"
      >${escaped}</a
    >`;
    }
    if (!data.partial) {
      const dfn = html`<dfn data-export data-dfn-type="${linkType}"
      >${escaped}</dfn
    >`;
      registerDefinition(dfn, [name]);
      decorateDfn(dfn, data, parentName, name);
      return dfn;
    }

    const unlinkedAnchor = html`<a
    data-idl="${data.partial ? "partial" : null}"
    data-link-type="${linkType}"
    data-title="${data.name}"
    data-xref-type="${linkType}"
    >${escaped}</a
  >`;

    const showWarnings =
      name && data.type !== "typedef" && !(data.partial && !dfn);
    if (showWarnings) {
      const styledName = data.type === "operation" ? `${name}()` : name;
      const ofParent = parentName ? ` \`${parentName}\`'s` : "";
      const msg = `Missing \`<dfn>\` for${ofParent} \`${styledName}\` ${data.type}.`;
      const hint = docLink`See ${"using `data-dfn-for`|#data-dfn-for"} in ReSpec's documentation.`;
      showWarning(msg, pluginName, { elements: [unlinkedAnchor], hint });
    }
    return unlinkedAnchor;
  }

  /**
   * Map to Shepherd types, for export.
   * @see https://tabatkins.github.io/bikeshed/#dfn-types
   */
  function getDfnType(idlType) {
    switch (idlType) {
      case "operation":
        return "method";
      case "field":
        return "dict-member";
      case "callback interface":
      case "interface mixin":
        return "interface";
      default:
        return idlType;
    }
  }

  function getIdlDefinitionClassName(defn) {
    switch (defn.type) {
      case "callback interface":
        return "idlInterface";
      case "operation":
        return "idlMethod";
      case "field":
        return "idlMember";
      case "enum-value":
        return "idlEnumItem";
      case "callback function":
        return "idlCallback";
    }
    return `idl${defn.type[0].toUpperCase()}${defn.type.slice(1)}`;
  }

  const nameResolverMap = new WeakMap();
  function getNameAndId(defn, parent = "") {
    if (nameResolverMap.has(defn)) {
      return nameResolverMap.get(defn);
    }
    const result = resolveNameAndId(defn, parent);
    nameResolverMap.set(defn, result);
    return result;
  }

  function resolveNameAndId(defn, parent) {
    let name = getDefnName(defn);
    // For getters, setters, etc. "anonymous-getter",
    const prefix = defn.special && defn.name === "" ? "anonymous-" : "";
    let idlId = getIdlId(prefix + name, parent);
    switch (defn.type) {
      // Top-level entities with linkable members.
      case "callback interface":
      case "dictionary":
      case "interface":
      case "interface mixin": {
        idlId += resolvePartial(defn);
        break;
      }
      case "constructor":
      case "operation": {
        const overload = resolveOverload(name, parent);
        if (overload) {
          name += overload;
          idlId += overload;
        } else if (defn.arguments.length) {
          idlId += defn.arguments
            .map(arg => `-${arg.name.toLowerCase()}`)
            .join("");
        }
        break;
      }
    }
    return { name, idlId };
  }

  function resolvePartial(defn) {
    if (!defn.partial) {
      return "";
    }
    if (!idlPartials[defn.name]) {
      idlPartials[defn.name] = 0;
    }
    idlPartials[defn.name] += 1;
    return `-partial-${idlPartials[defn.name]}`;
  }

  function resolveOverload(name, parentName) {
    const qualifiedName = `${parentName}.${name}`;
    const fullyQualifiedName = `${qualifiedName}()`;
    let overload;
    if (!operationNames[fullyQualifiedName]) {
      operationNames[fullyQualifiedName] = 0;
    }
    if (!operationNames[qualifiedName]) {
      operationNames[qualifiedName] = 0;
    } else {
      overload = `!overload-${operationNames[qualifiedName]}`;
    }
    operationNames[fullyQualifiedName] += 1;
    operationNames[qualifiedName] += 1;
    return overload || "";
  }

  function getIdlId(name, parentName) {
    if (!parentName) {
      return `idl-def-${name.toLowerCase()}`;
    }
    return `idl-def-${parentName.toLowerCase()}-${name.toLowerCase()}`;
  }

  function getDefnName(defn) {
    switch (defn.type) {
      case "enum-value":
        return defn.value;
      case "operation":
        return defn.name || defn.special;
      default:
        return defn.name || defn.type;
    }
  }

  // IDL types that never need a data-dfn-for
  const topLevelIdlTypes = [
    "interface",
    "interface mixin",
    "dictionary",
    "namespace",
    "enum",
    "typedef",
    "callback",
  ];

  /**
   * @param {Element} idlElement
   * @param {number} index
   */
  function renderWebIDL(idlElement, index) {
    let parse;
    try {
      parse = webidl2.parse(idlElement.textContent, {
        sourceName: String(index),
      });
    } catch (e) {
      const msg = `Failed to parse WebIDL: ${e.bareMessage}.`;
      showError(msg, pluginName, {
        title: e.bareMessage,
        details: `<pre>${e.context}</pre>`,
        elements: [idlElement],
      });
      // Skip this <pre> and move on to the next one.
      return [];
    }
    // we add "idl" as the canonical match, so both "webidl" and "idl" work
    idlElement.classList.add("def", "idl");
    const highlights = webidl2.write(parse, { templates });
    html.bind(idlElement)`${highlights}`;
    wrapInner(idlElement, document.createElement("code"));
    idlElement.querySelectorAll("[data-idl]").forEach(elem => {
      if (elem.dataset.dfnFor) {
        return;
      }
      const title = elem.dataset.title;
      // Select the nearest ancestor element that can contain members.
      const idlType = elem.dataset.dfnType;

      const parent = elem.parentElement.closest("[data-idl][data-title]");
      if (parent && !topLevelIdlTypes.includes(idlType)) {
        elem.dataset.dfnFor = parent.dataset.title;
      }
      if (elem.localName === "dfn") {
        registerDefinition(elem, [title]);
      }
    });
    // cross reference
    const closestCite = idlElement.closest("[data-cite], body");
    const { dataset } = closestCite;
    if (!dataset.cite) dataset.cite = "WEBIDL";
    // includes webidl in some form
    if (!/\bwebidl\b/i.test(dataset.cite)) {
      const cites = dataset.cite.trim().split(/\s+/);
      dataset.cite = ["WEBIDL", ...cites].join(" ");
    }
    addIDLHeader(idlElement);
    return parse;
  }
  /**
   * Adds a "WebIDL" decorative header/permalink to a block of WebIDL.
   * @param {HTMLPreElement} pre
   */
  function addIDLHeader(pre) {
    addHashId(pre, "webidl");
    const header = html`<span class="idlHeader"
    ><a class="self-link" href="${`#${pre.id}`}">WebIDL</a></span
  >`;
    pre.prepend(header);
    addCopyIDLButton(header);
  }

  async function run$E() {
    const idls = document.querySelectorAll("pre.idl, pre.webidl");
    if (!idls.length) {
      return;
    }
    const style = document.createElement("style");
    style.textContent = css$h;
    document.querySelector("head link, head > *:last-child").before(style);

    const astArray = [...idls].map(renderWebIDL);

    const validations = webidl2.validate(astArray);
    for (const validation of validations) {
      let details = `<pre>${xmlEscape(validation.context)}</pre>`;
      if (validation.autofix) {
        validation.autofix();
        const idlToFix = webidl2.write(astArray[validation.sourceName]);
        const escaped = xmlEscape(idlToFix);
        details += `Try fixing as:
      <pre>${escaped}</pre>`;
      }
      const msg = `WebIDL validation error: ${validation.bareMessage}`;
      showError(msg, pluginName, {
        details,
        elements: [idls[validation.sourceName]],
        title: validation.bareMessage,
      });
    }
    document.normalize();
  }

  var webidl = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addIDLHeader: addIDLHeader,
    name: name$G,
    run: run$E
  });

  // @ts-check
  /**
   * Module core/data-cite
   *
   * Allows citing other specifications using anchor elements. Simply add
   * "data-cite" and key of the specification.
   *
   * This module links elements that have `data-cite` attributes by converting
   * `data-cite` to `href` attributes. `data-cite` attributes are added to markup
   * directly by the author as well as via other modules like core/xref.
   *
   * @module core/data-cite
   */

  const name$F = "core/data-cite";

  /**
   * An arbitrary constant value used as an alias to the current spec's shortname. It
   * exists to simplify code as passing `conf.shortName` everywhere gets clumsy.
   * @type {string}
   */
  const THIS_SPEC = "__SPEC__";

  /**
   * Gets the link properties for the given citation details.
   * @param {CiteDetails} citeDetails - The citation details.
   * @returns {Promise<LinkProps|null>} The link properties or null if not found.
   */
  async function getLinkProps(citeDetails) {
    const { key, frag, path, href: canonicalHref } = citeDetails;
    let href = "";
    let title = "";

    // This is just referring to this document
    if (key === THIS_SPEC) {
      href = document.location.href;
    } else {
      // Let's go look it up in spec ref...
      const entry = await resolveRef(key);
      if (!entry) {
        return null;
      }
      href = entry.href;
      title = entry.title;
    }

    if (canonicalHref) {
      // Xref gave us a canonical link, so let's use that.
      href = canonicalHref;
    } else {
      if (path) {
        // See: https://github.com/speced/respec/issues/1856#issuecomment-429579475
        const relPath = path.startsWith("/") ? `.${path}` : path;
        href = new URL(relPath, href).href;
      }
      if (frag) {
        href = new URL(frag, href).href;
      }
    }

    return { href, title };
  }

  /**
   * Links the given element with the provided link properties and citation details.
   * @param {HTMLElement} elem - The element to link.
   * @param {LinkProps} linkProps - The link properties.
   * @param {CiteDetails} citeDetails - The citation details.
   */
  function linkElem(elem, linkProps, citeDetails) {
    const { href, title } = linkProps;
    const wrapInCiteEl = !citeDetails.path && !citeDetails.frag;

    switch (elem.localName) {
      case "a": {
        const el = /** @type {HTMLAnchorElement} */ (elem);
        if (el.textContent === "" && el.dataset.lt !== "the-empty-string") {
          el.textContent = title;
        }
        el.href = href;
        if (wrapInCiteEl) {
          const cite = document.createElement("cite");
          el.replaceWith(cite);
          cite.append(el);
        }
        break;
      }
      case "dfn": {
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.dataset.cite = citeDetails.key;
        anchor.dataset.citePath = citeDetails.path;
        anchor.dataset.citeFrag = citeDetails.frag;
        if (!elem.textContent) {
          anchor.textContent = title;
          elem.append(anchor);
        } else {
          wrapInner(elem, anchor);
        }
        if (wrapInCiteEl) {
          const cite = document.createElement("cite");
          cite.append(anchor);
          elem.append(cite);
        }
        if ("export" in elem.dataset) {
          const msg = "Exporting a linked external definition is not allowed.";
          const hint = "Please remove the `data-export` attribute.";
          showError(msg, name$F, { hint, elements: [elem] });
          delete elem.dataset.export;
        }
        elem.classList.add("externalDFN");
        elem.dataset.noExport = "";
        break;
      }
    }
  }

  /**
   * @param {string} component
   * @return {(key: string) => string}
   */
  function makeComponentFinder(component) {
    return key => {
      const position = key.search(component);
      return position !== -1 ? key.substring(position) : "";
    };
  }

  const findFrag = makeComponentFinder("#");
  const findPath = makeComponentFinder("/");

  /**
   * Converts the given raw key to citation details.
   * @param {HTMLElement} elem - The element containing the citation details.
   * @returns {CiteDetails} The citation details.
   */
  function toCiteDetails(elem) {
    const { dataset } = elem;
    const { cite: rawKey, citeFrag, citePath, citeHref } = dataset;

    // The key is a fragment, resolve using the shortName as key
    if (rawKey.startsWith("#") && !citeFrag) {
      // Closes data-cite not starting with "#"
      /** @type {HTMLElement} */
      const closest = elem.parentElement.closest(
        `[data-cite]:not([data-cite^="#"])`
      );
      const { key: parentKey, isNormative: closestIsNormative } = closest
        ? toCiteDetails(closest)
        : { key: THIS_SPEC, isNormative: false };
      dataset.cite = closestIsNormative ? parentKey : `?${parentKey}`;
      dataset.citeFrag = rawKey.replace("#", ""); // the key is acting as a fragment
      return toCiteDetails(elem);
    }

    const frag = citeFrag ? `#${citeFrag}` : findFrag(rawKey);
    const path = citePath || findPath(rawKey).split("#")[0]; // path is always before "#"
    const { type } = refTypeFromContext(rawKey, elem);
    const isNormative = type === "normative";
    // key is before "/" and "#" but after "!" or "?" (e.g., ?key/path#frag)
    const hasPrecedingMark = /^[?|!]/.test(rawKey);
    const key = rawKey.split(/[/|#]/)[0].substring(Number(hasPrecedingMark));
    const details = { key, isNormative, frag, path, href: citeHref };
    return details;
  }

  /**
   * Runs the data-cite processing on elements with the data-cite attribute.
   */
  async function run$D() {
    /** @type {NodeListOf<HTMLElement>} */
    const elems = document.querySelectorAll(
      "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
    );

    await updateBiblio([...elems]);

    for (const elem of elems) {
      const originalKey = elem.dataset.cite;
      const citeDetails = toCiteDetails(elem);
      const linkProps = await getLinkProps(citeDetails);
      if (linkProps) {
        linkElem(elem, linkProps, citeDetails);
      } else {
        const msg = `Couldn't find a match for "${originalKey}"`;
        if (elem.dataset.matchedText) {
          elem.textContent = elem.dataset.matchedText;
        }
        showWarning(msg, name$F, { elements: [elem] });
      }
    }

    sub("beforesave", cleanup$2);
  }

  /**
   * Fetches and updates `biblio` with entries corresponding to the given elements.
   * @param {HTMLElement[]} elems - The elements requiring biblio entries.
   */
  async function updateBiblio(elems) {
    const promisesForBibEntries = elems.map(toCiteDetails).map(async entry => {
      const result = await resolveRef(entry.key);
      return { entry, result };
    });
    const bibEntries = await Promise.all(promisesForBibEntries);

    const missingBibEntries = bibEntries
      .filter(({ result }) => result === null)
      .map(({ entry: { key } }) => key);

    const newEntries = await updateFromNetwork(missingBibEntries);
    if (newEntries) {
      Object.assign(biblio, newEntries);
    }
  }

  /**
   * Cleans up the data-cite attributes from the document.
   * @param {Document} doc - The document to cleanup.
   */
  function cleanup$2(doc) {
    const attrToRemove = ["data-cite", "data-cite-frag", "data-cite-path"];
    const elems = doc.querySelectorAll("a[data-cite], dfn[data-cite]");
    elems.forEach(elem =>
      attrToRemove.forEach(attr => elem.removeAttribute(attr))
    );
  }

  var dataCite = /*#__PURE__*/Object.freeze({
    __proto__: null,
    THIS_SPEC: THIS_SPEC,
    name: name$F,
    run: run$D,
    toCiteDetails: toCiteDetails
  });

  // @ts-check
  // Module core/link-to-dfn
  // Gives definitions in definitionMap IDs and links <a> tags
  // to the matching definitions.

  const name$E = "core/link-to-dfn";

  /** @type {HTMLElement[]} */
  const possibleExternalLinks = [];

  const localizationStrings$m = {
    en: {
      /**
       * @param {string} title
       */
      duplicateMsg(title) {
        return `Duplicate definition(s) of '${title}'`;
      },
      duplicateTitle: "This is defined more than once in the document.",
    },
    ja: {
      /**
       * @param {string} title
       */
      duplicateMsg(title) {
        return `'${title}' の重複定義`;
      },
      duplicateTitle: "この文書内で複数回定義されています．",
    },
    de: {
      /**
       * @param {string} title
       */
      duplicateMsg(title) {
        return `Mehrfache Definition von '${title}'`;
      },
      duplicateTitle:
        "Das Dokument enthält mehrere Definitionen dieses Eintrags.",
    },
    zh: {
      /**
       * @param {string} title
       */
      duplicateMsg(title) {
        return `'${title}' 的重复定义`;
      },
      duplicateTitle: "在文档中有重复的定义。",
    },
  };
  const l10n$m = getIntlData(localizationStrings$m);

  async function run$C(conf) {
    const titleToDfns = mapTitleToDfns();
    /** @type {HTMLAnchorElement[]} */
    const badLinks = [];

    /** @type {NodeListOf<HTMLAnchorElement>} */
    const localAnchors = document.querySelectorAll(
      "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo):not(.externalDFN)"
    );
    for (const anchor of localAnchors) {
      if (!anchor.dataset?.linkType && anchor.dataset?.xrefType) {
        possibleExternalLinks.push(anchor);
        continue;
      }
      const dfn = findMatchingDfn(anchor, titleToDfns);
      if (dfn) {
        const foundLocalMatch = processAnchor(anchor, dfn, titleToDfns);
        if (!foundLocalMatch) {
          possibleExternalLinks.push(anchor);
        }
      } else {
        if (anchor.dataset.cite === "") {
          badLinks.push(anchor);
        } else {
          possibleExternalLinks.push(anchor);
        }
      }
    }

    showLinkingError(badLinks);

    // This needs to run before core/xref adds its data-cite and updates
    // conf.normativeReferences and conf.informativeReferences.
    updateReferences(conf);

    if (!conf.xref) {
      showLinkingError(possibleExternalLinks);
    }
  }

  function mapTitleToDfns() {
    /** @type {CaseInsensitiveMap<Map<string, Map<string, HTMLElement>>>} */
    const titleToDfns = new CaseInsensitiveMap();
    for (const key of definitionMap.keys()) {
      const { result, duplicates } = collectDfns(key);
      titleToDfns.set(key, result);
      if (duplicates.length > 0) {
        showError(l10n$m.duplicateMsg(key), name$E, {
          title: l10n$m.duplicateTitle,
          elements: duplicates,
        });
      }
    }
    return titleToDfns;
  }

  /**
   * @param {string} title
   */
  function collectDfns(title) {
    /** @type {Map<string, Map<string, HTMLElement>>} */
    const result = new Map();
    const duplicates = [];
    for (const dfn of definitionMap.get(title)) {
      const { dfnType = "dfn" } = dfn.dataset;
      const dfnFors = dfn.dataset.dfnFor?.split(",").map(s => s.trim()) ?? [""];
      for (const dfnFor of dfnFors) {
        // check for potential duplicate definition
        if (result.has(dfnFor) && result.get(dfnFor).has(dfnType)) {
          const oldDfn = result.get(dfnFor).get(dfnType);
          // We want <dfn> definitions to take precedence over
          // definitions from WebIDL. WebIDL definitions wind
          // up as <span>s instead of <dfn>.
          const oldIsDfn = oldDfn.localName === "dfn";
          const newIsDfn = dfn.localName === "dfn";
          const isSameDfnType = dfnType === (oldDfn.dataset.dfnType || "dfn");
          const isSameDfnFor =
            (!dfnFor && !oldDfn.dataset.dfnFor) ||
            oldDfn.dataset.dfnFor
              ?.split(",")
              .map(s => s.trim())
              .includes(dfnFor);
          if (oldIsDfn && newIsDfn && isSameDfnType && isSameDfnFor) {
            duplicates.push(dfn);
            continue;
          }
        }
        if (!result.has(dfnFor)) {
          result.set(dfnFor, new Map());
        }
        result.get(dfnFor).set(dfnType, dfn);
        // We register non-dfn terms under the generic "idl" type as well
        // for backwards-compatibility
        if ("idl" in dfn.dataset || dfnType !== "dfn") {
          result.get(dfnFor).set("idl", dfn);
        }
        addId(dfn, "dfn", title);
      }
    }

    return { result, duplicates };
  }

  /**
   * Find a potentially matching <dfn> for given anchor.
   * @param {HTMLAnchorElement} anchor
   * @param {ReturnType<typeof mapTitleToDfns>} titleToDfns
   */
  function findMatchingDfn(anchor, titleToDfns) {
    const linkTargets = getLinkTargets(anchor);
    const target = linkTargets.find(
      target =>
        titleToDfns.has(target.title) &&
        titleToDfns.get(target.title).has(target.for)
    );
    if (!target) return;

    const dfnsByType = titleToDfns.get(target.title).get(target.for);
    const { linkType } = anchor.dataset;
    if (linkType) {
      for (const type of linkType.split("|")) {
        if (dfnsByType.get(type)) {
          return dfnsByType.get(type);
        }
      }
      return dfnsByType.get("dfn");
    } else {
      // Assumption: if it's for something, it's more likely IDL.
      const type = target.for ? "idl" : "dfn";
      return dfnsByType.get(type) || dfnsByType.get("idl");
    }
  }

  /**
   * @param {HTMLAnchorElement} anchor
   * @param {HTMLElement} dfn
   * @param {ReturnType<typeof mapTitleToDfns>} titleToDfns
   */
  function processAnchor(anchor, dfn, titleToDfns) {
    let noLocalMatch = false;
    const { linkFor } = anchor.dataset;
    const { dfnFor } = dfn.dataset;
    if (dfn.dataset.cite) {
      anchor.dataset.cite = dfn.dataset.cite;
    } else if (
      linkFor &&
      !titleToDfns.get(linkFor) &&
      dfnFor &&
      !dfnFor
        .split(",")
        .map(s => s.trim())
        .includes(linkFor)
    ) {
      noLocalMatch = true;
    } else if (dfn.classList.contains("externalDFN")) {
      // data-lt[0] serves as unique id for the dfn which this element references
      const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
      anchor.dataset.lt = lt[0] || dfn.textContent;
      noLocalMatch = true;
    } else if (anchor.dataset.idl !== "partial") {
      anchor.href = `#${dfn.id}`;
      anchor.classList.add("internalDFN");
    } else {
      noLocalMatch = true;
    }
    if (!anchor.hasAttribute("data-link-type")) {
      anchor.dataset.linkType = "idl" in dfn.dataset ? "idl" : "dfn";
    }
    if (isCode(dfn)) {
      wrapAsCode(anchor, dfn);
    }
    return !noLocalMatch;
  }

  /**
   * Check if a definition is a code
   * @param {HTMLElement} dfn a definition
   */
  function isCode(dfn) {
    if (dfn.closest("code,pre")) {
      return true;
    }
    // Note that childNodes.length === 1 excludes
    // definitions that have either other text, or other
    // whitespace, inside the <dfn>.
    if (dfn.childNodes.length !== 1) {
      return false;
    }
    const [first] = /** @type {NodeListOf<HTMLElement>} */ (dfn.childNodes);
    return first.localName === "code";
  }

  /**
   * Wrap links by <code>.
   * @param {HTMLAnchorElement} anchor a link
   * @param {HTMLElement} dfn a definition
   */
  function wrapAsCode(anchor, dfn) {
    // only add code to IDL when the definition matches
    const term = anchor.textContent.trim();
    const isIDL = dfn.dataset.hasOwnProperty("idl");
    const needsCode = shouldWrapByCode(anchor) && shouldWrapByCode(dfn, term);
    if (!isIDL || needsCode) {
      wrapInner(anchor, document.createElement("code"));
    }
  }

  /**
   * @param {HTMLElement} elem
   * @param {string} term
   */
  function shouldWrapByCode(elem, term = "") {
    switch (elem.localName) {
      case "a":
        if (!elem.querySelector("code")) {
          return true;
        }
        break;
      default: {
        const { dataset } = elem;
        if (elem.textContent.trim() === term) {
          return true;
        } else if (dataset.title === term) {
          return true;
        } else if (dataset.lt || dataset.localLt) {
          const terms = [];
          if (dataset.lt) {
            terms.push(...dataset.lt.split("|"));
          }
          if (dataset.localLt) {
            terms.push(...dataset.localLt.split("|"));
          }
          return terms.includes(term);
        }
      }
    }
    return false;
  }

  function showLinkingError(elems) {
    elems.forEach(elem => {
      const msg = `Found linkless \`<a>\` element with text "${elem.textContent}" but no matching \`<dfn>\``;
      const title = "Linking error: not matching `<dfn>`";
      showWarning(msg, name$E, { title, elements: [elem] });
    });
  }

  /**
   * Update references due to `data-cite` attributes.
   *
   * Also, make sure self-citing doesn't cause current document getting added to
   * bibliographic references section.
   * @param {Conf} conf
   */
  function updateReferences(conf) {
    const { shortName = "" } = conf;
    // Match shortName in a data-cite (with optional leading ?!), while skipping shortName as prefix.
    // https://regex101.com/r/rsZyIJ/5
    const regex = new RegExp(String.raw`^([?!])?${shortName}\b([^-])`, "i");

    /** @type {NodeListOf<HTMLElement>} */
    const elems = document.querySelectorAll(
      "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
    );
    for (const elem of elems) {
      elem.dataset.cite = elem.dataset.cite.replace(regex, `$1${THIS_SPEC}$2`);
      const { key, isNormative } = toCiteDetails(elem);
      if (key === THIS_SPEC) continue;

      if (!isNormative && !conf.normativeReferences.has(key)) {
        conf.informativeReferences.add(key);
      } else {
        conf.normativeReferences.add(key);
        conf.informativeReferences.delete(key);
      }
    }
  }

  var linkToDfn = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$E,
    possibleExternalLinks: possibleExternalLinks,
    run: run$C
  });

  // @ts-check

  /**
   * @typedef {import('core/xref').RequestEntry} RequestEntry
   * @typedef {import('core/xref').Response} Response
   * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
   * @typedef {import('core/xref').XrefDatabase} XrefDatabase
   */

  const STORE_NAME = "xrefs";
  const VERSION_CHECK_WAIT = 5 * 60 * 1000; // 5 min

  async function getIdbCache() {
    /** @type {XrefDatabase} */
    const db = await idb.openDB("xref", 2, {
      upgrade(db) {
        [...db.objectStoreNames].forEach(s => db.deleteObjectStore(s));
        const store = db.createObjectStore(STORE_NAME, { keyPath: "query.id" });
        store.createIndex("byTerm", "query.term", { unique: false });
      },
    });
    return db;
  }

  /** @param {RequestEntry[]} queries */
  async function resolveXrefCache(queries) {
    /** @type {Map<string, SearchResultEntry[]>} */
    const cachedData = new Map();

    const bustCache = await shouldBustCache();
    if (bustCache) {
      await clearXrefData();
      return cachedData;
    }

    const requiredKeySet = new Set(queries.map(query => query.id));
    try {
      const cache = await getIdbCache();
      let cursor = await cache.transaction(STORE_NAME).store.openCursor();
      while (cursor) {
        if (requiredKeySet.has(cursor.key)) {
          cachedData.set(cursor.key, cursor.value.result);
        }
        cursor = await cursor.continue();
      }
    } catch (err) {
      console.error(err);
    }
    return cachedData;
  }

  /**
   * Get last updated timestamp from server and bust cache based on that. This
   * way, we prevent dirty/erroneous/stale data being kept on a client (which is
   * possible if we use a `MAX_AGE` based caching strategy).
   */
  async function shouldBustCache() {
    const key = "XREF:LAST_VERSION_CHECK";
    const lastChecked = parseInt(localStorage.getItem(key), 10);
    const now = Date.now();

    if (!lastChecked) {
      localStorage.setItem(key, now.toString());
      return false;
    }
    if (now - lastChecked < VERSION_CHECK_WAIT) {
      // avoid checking network for any data update if old cache "fresh"
      return false;
    }

    const url = new URL("meta/version", API_URL$1).href;
    const res = await fetch(url);
    if (!res.ok) return false;
    const lastUpdated = await res.text();
    localStorage.setItem(key, now.toString());
    return parseInt(lastUpdated, 10) > lastChecked;
  }

  /**
   * @param {RequestEntry[]} queries
   * @param {Map<string, SearchResultEntry[]>} results
   */
  async function cacheXrefData(queries, results) {
    try {
      const cache = await getIdbCache();
      const tx = cache.transaction(STORE_NAME, "readwrite");
      for (const query of queries) {
        const result = results.get(query.id);
        tx.objectStore(STORE_NAME).add({ query, result });
      }
      await tx.done;
    } catch (e) {
      console.error(e);
    }
  }

  async function clearXrefData() {
    try {
      await getIdbCache().then(db => db.clear(STORE_NAME));
    } catch (e) {
      console.error(e);
    }
  }

  // @ts-check
  /**
   * @module core/xref
   *
   * Automatically adds external references.
   *
   * Searches for the terms which do not have a local definition at xref API and
   * for each query, adds `data-cite` attributes to respective elements.
   * `core/data-cite` later converts these data-cite attributes to actual links.
   * https://github.com/speced/respec/issues/1662
   */
  /**
   * @typedef {import('core/xref').RequestEntry} RequestEntry
   * @typedef {import('core/xref').Response} Response
   * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
   * @typedef {Map<string, { elems: HTMLElement[], results: SearchResultEntry[], query: RequestEntry }>} ErrorCollection
   * @typedef {{ ambiguous: ErrorCollection, notFound: ErrorCollection }} Errors
   */

  const name$D = "core/xref";

  const profiles = {
    "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"],
  };

  const API_URL$1 = "https://respec.org/xref/";

  /** @type {{ term: string; spec: string; element: HTMLElement }[]} */
  const informativeRefsInNormative = [];

  if (
    !document.querySelector("link[rel='preconnect'][href='https://respec.org']")
  ) {
    const link = createResourceHint({
      hint: "preconnect",
      href: "https://respec.org",
    });
    document.head.appendChild(link);
  }

  /**
   * @param {Object} conf respecConfig
   */
  async function run$B(conf) {
    if (!conf.xref) {
      return;
    }

    const xref = normalizeConfig(conf.xref);
    if (xref.specs) {
      const bodyCite = document.body.dataset.cite
        ? document.body.dataset.cite.split(/\s+/)
        : [];
      document.body.dataset.cite = bodyCite.concat(xref.specs).join(" ");
    }

    const elems = possibleExternalLinks.concat(findExplicitExternalLinks());
    if (!elems.length) return;

    /** @type {RequestEntry[]} */
    const queryKeys = [];
    for (const elem of elems) {
      const entry = getRequestEntry(elem);
      entry.id = await objectHash(entry);
      queryKeys.push(entry);
    }

    const data = await getData(queryKeys, xref.url);
    addDataCiteToTerms(elems, queryKeys, data, conf);

    sub("beforesave", cleanup$1);
  }

  /**
   * Find additional references that need to be looked up externally.
   * Examples: a[data-cite="spec"], dfn[data-cite="spec"], dfn.externalDFN
   */
  function findExplicitExternalLinks() {
    /** @type {NodeListOf<HTMLElement>} */
    const links = document.querySelectorAll(
      ":is(a,dfn)[data-cite]:not([data-cite=''],[data-cite*='#'])"
    );
    /** @type {NodeListOf<HTMLElement>} */
    const externalDFNs = document.querySelectorAll("dfn.externalDFN");
    return [...links]
      .filter(el => {
        // ignore empties
        if (el.textContent.trim() === "") return false;
        /** @type {HTMLElement} */
        const closest = el.closest("[data-cite]");
        return !closest || closest.dataset.cite !== "";
      })
      .concat(...externalDFNs);
  }

  /**
   * converts conf.xref to object with url and spec properties
   */
  function normalizeConfig(xref) {
    const defaults = {
      url: new URL("search/", API_URL$1).href,
      specs: null,
    };

    const config = Object.assign({}, defaults);

    const type = Array.isArray(xref) ? "array" : typeof xref;
    switch (type) {
      case "boolean":
        // using defaults already, as above
        break;
      case "string":
        if (xref.toLowerCase() in profiles) {
          Object.assign(config, { specs: profiles[xref.toLowerCase()] });
        } else {
          invalidProfileError(xref);
        }
        break;
      case "array":
        Object.assign(config, { specs: xref });
        break;
      case "object":
        Object.assign(config, xref);
        if (xref.profile) {
          const profile = xref.profile.toLowerCase();
          if (profile in profiles) {
            const specs = (xref.specs ?? []).concat(profiles[profile]);
            Object.assign(config, { specs });
          } else {
            invalidProfileError(xref.profile);
          }
        }
        break;
      default: {
        const msg = `Invalid value for \`xref\` configuration option. Received: "${xref}".`;
        showError(msg, name$D);
      }
    }
    return config;

    function invalidProfileError(profile) {
      const supportedProfiles = joinOr(Object.keys(profiles), s => `"${s}"`);
      const msg =
        `Invalid profile "${profile}" in \`respecConfig.xref\`. ` +
        `Please use one of the supported profiles: ${supportedProfiles}.`;
      showError(msg, name$D);
    }
  }

  /**
   * get xref API request entry (term and context) for given xref element
   * @param {HTMLElement} elem
   */
  function getRequestEntry(elem) {
    const isIDL = "xrefType" in elem.dataset;

    let term = getTermFromElement(elem);
    if (!isIDL) term = term.toLowerCase();

    const specs = getSpecContext(elem);
    const types = getTypeContext(elem, isIDL);
    const forContext = getForContext(elem, isIDL);

    return {
      // Add an empty `id` to ensure the shape of object returned stays same when
      // actual `id` is added later (minor perf optimization, also makes
      // TypeScript happy).
      id: "",
      term,
      types,
      ...(specs.length && { specs }),
      ...(typeof forContext === "string" && { for: forContext }),
    };
  }

  /** @param {HTMLElement} elem */
  function getTermFromElement(elem) {
    const { lt: linkingText } = elem.dataset;
    let term = linkingText ? linkingText.split("|", 1)[0] : elem.textContent;
    term = norm(term);
    return term === "the-empty-string" ? "" : term;
  }

  /**
   * Get spec context as a fallback chain, where each level (sub-array) represents
   * decreasing priority.
   * @param {HTMLElement} elem
   */
  function getSpecContext(elem) {
    /** @type {string[][]} */
    const specs = [];

    /** @type {HTMLElement} */
    let dataciteElem = elem.closest("[data-cite]");

    // Traverse up towards the root element, adding levels of lower priority specs
    while (dataciteElem) {
      const cite = dataciteElem.dataset.cite.toLowerCase().replace(/[!?]/g, "");
      const cites = cite.split(/\s+/).filter(s => s);
      if (cites.length) {
        specs.push(cites);
      }
      if (dataciteElem === elem) break;
      dataciteElem = dataciteElem.parentElement.closest("[data-cite]");
    }

    // If element itself contains data-cite, we don't take inline context into
    // account. The inline bibref context has lowest priority, if available.
    if (dataciteElem !== elem) {
      const closestSection = elem.closest("section");
      /** @type {Iterable<HTMLElement>} */
      const bibrefs = closestSection
        ? closestSection.querySelectorAll("a.bibref")
        : [];
      const inlineRefs = [...bibrefs].map(el => el.textContent.toLowerCase());
      if (inlineRefs.length) {
        specs.push(inlineRefs);
      }
    }

    const uniqueSpecContext = dedupeSpecContext(specs);
    return uniqueSpecContext;
  }

  /**
   * If we already have a spec in a higher priority level (closer to element) of
   * fallback chain, skip it from low priority levels, to prevent duplication.
   * @param {string[][]} specs
   * */
  function dedupeSpecContext(specs) {
    /** @type {string[][]} */
    const unique = [];
    for (const level of specs) {
      const higherPriority = unique[unique.length - 1] || [];
      const uniqueSpecs = [...new Set(level)].filter(
        spec => !higherPriority.includes(spec)
      );
      unique.push(uniqueSpecs.sort());
    }
    return unique;
  }

  /**
   * @param {HTMLElement} elem
   * @param {boolean} isIDL
   */
  function getForContext(elem, isIDL) {
    if (elem.dataset.xrefFor) {
      return norm(elem.dataset.xrefFor);
    }

    if (isIDL) {
      /** @type {HTMLElement} */
      const dataXrefForElem = elem.closest("[data-xref-for]");
      if (dataXrefForElem) {
        return norm(dataXrefForElem.dataset.xrefFor);
      }
    }

    return null;
  }

  /**
   * @param {HTMLElement} elem
   * @param {boolean} isIDL
   */
  function getTypeContext(elem, isIDL) {
    if (isIDL) {
      if (elem.dataset.xrefType) {
        return elem.dataset.xrefType.split("|");
      }
      return ["_IDL_"];
    }

    return ["_CONCEPT_"];
  }

  /**
   * @param {RequestEntry[]} queryKeys
   * @param {string} apiUrl
   * @returns {Promise<Map<string, SearchResultEntry[]>>}
   */
  async function getData(queryKeys, apiUrl) {
    const uniqueIds = new Set();
    const uniqueQueryKeys = queryKeys.filter(key => {
      return uniqueIds.has(key.id) ? false : uniqueIds.add(key.id) && true;
    });

    const resultsFromCache = await resolveXrefCache(uniqueQueryKeys);

    const termsToLook = uniqueQueryKeys.filter(
      key => !resultsFromCache.get(key.id)
    );
    const fetchedResults = await fetchFromNetwork(termsToLook, apiUrl);
    if (fetchedResults.size) {
      // add data to cache
      await cacheXrefData(uniqueQueryKeys, fetchedResults);
    }

    return new Map([...resultsFromCache, ...fetchedResults]);
  }

  /**
   * @param {RequestEntry[]} queries
   * @param {string} url
   * @returns {Promise<Map<string, SearchResultEntry[]>>}
   */
  async function fetchFromNetwork(queries, url) {
    if (!queries.length) return new Map();

    const options = {
      method: "POST",
      body: JSON.stringify({ queries }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, options);
    const json = await response.json();
    return new Map(json.results.map(({ id, result }) => [id, result]));
  }

  /**
   * Figures out from the tree structure if the reference is
   * normative (true) or informative (false).
   * @param {HTMLElement} elem
   */
  function isNormative(elem) {
    const closestNormative = elem.closest(".normative");
    const closestInform = elem.closest(nonNormativeSelector);
    if (!closestInform || elem === closestNormative) {
      return true;
    }
    return (
      closestNormative &&
      closestInform &&
      closestInform.contains(closestNormative)
    );
  }

  /**
   * adds data-cite attributes to elems for each term for which results are found.
   * adds citations to references section.
   * collects and shows linking errors if any.
   * @param {HTMLElement[]} elems
   * @param {RequestEntry[]} queryKeys
   * @param {Map<string, SearchResultEntry[]>} data
   * @param {any} conf
   */
  function addDataCiteToTerms(elems, queryKeys, data, conf) {
    /** @type {Errors} */
    const errors = { ambiguous: new Map(), notFound: new Map() };

    for (let i = 0, l = elems.length; i < l; i++) {
      if (elems[i].closest("[data-no-xref]")) continue;

      const elem = elems[i];
      const query = queryKeys[i];

      const { id } = query;
      const results = data.get(id);
      if (results.length === 1) {
        addDataCite(elem, query, results[0], conf);
      } else {
        const collector = errors[results.length === 0 ? "notFound" : "ambiguous"];
        if (!collector.has(id)) {
          collector.set(id, { elems: [], results, query });
        }
        collector.get(id).elems.push(elem);
      }
    }

    showErrors(errors);
  }

  /**
   * @param {HTMLElement} elem
   * @param {RequestEntry} query
   * @param {SearchResultEntry} result
   * @param {any} conf
   */
  function addDataCite(elem, query, result, conf) {
    const { term, specs = [] } = query;
    const { uri, shortname, spec, normative, type, for: forContext } = result;
    // if authored spec context had `result.spec`, use it instead of shortname
    const cite = specs.flat().includes(spec) ? spec : shortname;
    // we use this "partial" URL to resolve parts of urls...
    // but sometimes we get lucky and we get an absolute URL from xref
    // which we can then use in other places (e.g., data-cite.js)
    const url = new URL(uri, "https://partial");
    let { pathname: citePath } = url;
    // final resolution will be against the URL of the spec, which may end with
    // a filename. That filename must be preserved if there's no specific path.
    if (citePath === "/") citePath = "";
    const citeFrag = url.hash.slice(1);
    const dataset = { cite, citePath, citeFrag, linkType: type };
    if (forContext) dataset.linkFor = forContext[0];
    if (url.origin && url.origin !== "https://partial") {
      dataset.citeHref = url.href;
    }
    Object.assign(elem.dataset, dataset);

    addToReferences(elem, cite, normative, term, conf);
  }

  /**
   * add specs for citation (references section)
   * @param {HTMLElement} elem
   * @param {string} cite
   * @param {boolean} normative
   * @param {string} term
   * @param {any} conf
   */
  function addToReferences(elem, cite, normative, term, conf) {
    const isNormRef = isNormative(elem);
    if (!isNormRef) {
      // Only add it if not already normative...
      if (!conf.normativeReferences.has(cite)) {
        conf.informativeReferences.add(cite);
      }
      return;
    }
    if (normative) {
      // If it was originally informative, we move the existing
      // key to be normative.
      const existingKey = conf.informativeReferences.has(cite)
        ? conf.informativeReferences.getCanonicalKey(cite)
        : cite;
      conf.normativeReferences.add(existingKey);
      conf.informativeReferences.delete(existingKey);
      return;
    }

    // This is used by the informative-dfn linter
    informativeRefsInNormative.push({ term, spec: cite, element: elem });
  }

  /** @param {Errors} errors */
  function showErrors({ ambiguous, notFound }) {
    const getPrefilledFormURL = (term, query, specs = []) => {
      const url = new URL(API_URL$1);
      url.searchParams.set("term", term);
      if (query.for) url.searchParams.set("for", query.for);
      url.searchParams.set("types", query.types.join(","));
      if (specs.length) url.searchParams.set("specs", specs.join(","));
      return url.href;
    };

    const howToFix = (howToCiteURL, originalTerm) => {
      return docLink`[See search matches for "${originalTerm}"](${howToCiteURL}) or ${"[Learn about this error|#error-term-not-found]"}.`;
    };

    for (const { query, elems } of notFound.values()) {
      const specs = query.specs ? [...new Set(query.specs.flat())].sort() : [];
      const originalTerm = getTermFromElement(elems[0]);
      const formUrl = getPrefilledFormURL(originalTerm, query);
      const specsString = joinAnd(specs, s => `**[${s}]**`);
      const hint = howToFix(formUrl, originalTerm);
      const forParent = query.for ? `, for **"${query.for}"**, ` : "";
      const msg = `Couldn't find "**${originalTerm}**"${forParent} in this document or other cited documents: ${specsString}.`;
      const title = "No matching definition found.";
      showError(msg, name$D, { title, elements: elems, hint });
    }

    for (const { query, elems, results } of ambiguous.values()) {
      const specs = [...new Set(results.map(entry => entry.shortname))].sort();
      const specsString = joinAnd(specs, s => `**[${s}]**`);
      const originalTerm = getTermFromElement(elems[0]);
      const formUrl = getPrefilledFormURL(originalTerm, query, specs);
      const forParent = query.for ? `, for **"${query.for}"**, ` : "";
      const moreInfo = howToFix(formUrl, originalTerm);
      const hint =
        docLink`To fix, use the ${"[data-cite]"} attribute to pick the one you mean from the appropriate specification.` +
        String.raw` ${moreInfo}`;
      const msg = `The term "**${originalTerm}**"${forParent} is ambiguous because it's defined in ${specsString}.`;
      const title = "Definition is ambiguous.";
      showError(msg, name$D, { title, elements: elems, hint });
    }
  }

  function objectHash(obj) {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    const buffer = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-1", buffer).then(bufferToHexString);
  }

  /** @param {ArrayBuffer} buffer */
  function bufferToHexString(buffer) {
    const byteArray = new Uint8Array(buffer);
    return [...byteArray].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  function cleanup$1(doc) {
    const elems = doc.querySelectorAll(
      "a[data-xref-for], a[data-xref-type], a[data-link-for]"
    );
    const attrToRemove = ["data-xref-for", "data-xref-type", "data-link-for"];
    elems.forEach(el => {
      attrToRemove.forEach(attr => el.removeAttribute(attr));
    });
  }

  var xref = /*#__PURE__*/Object.freeze({
    __proto__: null,
    API_URL: API_URL$1,
    getTermFromElement: getTermFromElement,
    informativeRefsInNormative: informativeRefsInNormative,
    name: name$D,
    run: run$B
  });

  /*
  @module "core/dfn-index"
  Extends and overrides some styles from `base.css`.
  */
  const css$e = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$f = css$e`
ul.index {
  columns: 30ch;
  column-gap: 1.5em;
}

ul.index li {
  list-style: inherit;
}

ul.index li span {
  color: inherit;
  cursor: pointer;
  white-space: normal;
}

#index-defined-here ul.index li {
  font-size: 0.9rem;
}

ul.index code {
  color: inherit;
}

#index-defined-here .print-only {
  display: none;
}

@media print {
  #index-defined-here .print-only {
    display: initial;
  }
}
`;

  // @ts-check
  /**
   * If a `<section id="index">` exists, it is filled by a list of terms defined
   * (locally) by current document and a list of terms referenced (external) by
   * current document.
   */


  const name$C = "core/dfn-index";

  const localizationStrings$l = {
    en: {
      heading: "Index",
      headingExternal: "Terms defined by reference",
      headlingLocal: "Terms defined by this specification",
      dfnOf: "definition of",
    },
  };
  const l10n$l = getIntlData(localizationStrings$l);

  // Terms of these _types_ are wrapped in `<code>`.
  const CODE_TYPES = new Set([
    "attribute",
    "callback",
    "dict-member",
    "dictionary",
    "element-attr",
    "element",
    "enum-value",
    "enum",
    "exception",
    "extended-attribute",
    "interface",
    "method",
    "typedef",
  ]);

  /**
   * @typedef {{ term: string, type: string, linkFor: string, elem: HTMLAnchorElement }} Entry
   */

  function run$A() {
    const index = document.querySelector("section#index");
    if (!index) {
      // See below...
      sub("toc", () => {}, { once: true });
      return;
    }

    const styleEl = document.createElement("style");
    styleEl.textContent = css$f;
    document.head.appendChild(styleEl);

    index.classList.add("appendix");
    if (!index.querySelector("h2, h1")) {
      index.prepend(html`<h1>${l10n$l.heading}</h1>`);
    }

    const localTermIndex = html`<section id="index-defined-here">
    <h3>${l10n$l.headlingLocal}</h3>
    ${createLocalTermIndex()}
  </section>`;
    index.append(localTermIndex);

    const externalTermIndex = html`<section id="index-defined-elsewhere">
    <h3>${l10n$l.headingExternal}</h3>
    ${createExternalTermIndex()}
  </section>`;
    index.append(externalTermIndex);
    for (const el of externalTermIndex.querySelectorAll(".index-term")) {
      addId(el, "index-term");
    }

    // XXX: This event is used to overcome an edge case with core/structure,
    // related to a circular dependency in plugin run order. We want
    // core/structure to run after dfn-index so the #index can be listed in the
    // TOC, but we also want section numbers in dfn-index. So, we "split"
    // core/dfn-index in two parts, one that runs before core/structure (using
    // plugin order in profile) and the other (following) after section numbers
    // are generated in core/structure (this event).
    sub("toc", appendSectionNumbers, { once: true });

    sub("beforesave", cleanup);
  }

  function createLocalTermIndex() {
    const dataSortedByTerm = collectLocalTerms();
    return html`<ul class="index">
    ${dataSortedByTerm.map(([term, dfns]) => renderLocalTerm(term, dfns))}
  </ul>`;
  }

  function collectLocalTerms() {
    /** @type {Map<string, HTMLElement[]>} */
    const data = new Map();
    /** @type {NodeListOf<HTMLElement>} */
    const elems = document.querySelectorAll("dfn:not([data-cite])");
    for (const elem of elems) {
      if (!elem.id) continue;
      const text = norm(elem.textContent);
      const elemsByTerm = data.get(text) || data.set(text, []).get(text);
      elemsByTerm.push(elem);
    }

    const dataSortedByTerm = [...data].sort(([a], [b]) =>
      a.slice(a.search(/\w/)).localeCompare(b.slice(b.search(/\w/)))
    );

    return dataSortedByTerm;
  }

  /**
   * @param {string} term
   * @param {HTMLElement[]} dfns
   * @returns {HTMLLIElement}
   */
  function renderLocalTerm(term, dfns) {
    const renderItem = (dfn, text, suffix) => {
      const href = `#${dfn.id}`;
      return html`<li data-id=${dfn.id}>
      <a class="index-term" href="${href}">${{ html: text }}</a> ${suffix
        ? { html: suffix }
        : ""}
    </li>`;
    };

    if (dfns.length === 1) {
      const dfn = dfns[0];
      const type = getLocalTermType(dfn);
      const text = getLocalTermText(dfn, type, term);
      const suffix = getLocalTermSuffix(dfn, type, term);
      return renderItem(dfn, text, suffix);
    }
    return html`<li>
    ${term}
    <ul>
      ${dfns.map(dfn => {
        const type = getLocalTermType(dfn);
        const text = getLocalTermSuffix(dfn, type, term) || l10n$l.dfnOf;
        return renderItem(dfn, text);
      })}
    </ul>
  </li>`;
  }

  /** @param {HTMLElement} dfn */
  function getLocalTermType(dfn) {
    const ds = dfn.dataset;
    const type = ds.dfnType || ds.idl || ds.linkType || "";
    switch (type) {
      case "":
      case "dfn":
        return "";
      default:
        return type;
    }
  }

  /** @param {HTMLElement} dfn */
  function getLocalTermParentContext(dfn) {
    /** @type {HTMLElement} */
    const dfnFor = dfn.closest("[data-dfn-for]:not([data-dfn-for=''])");
    return dfnFor ? dfnFor.dataset.dfnFor : "";
  }

  /**
   * @param {HTMLElement} dfn
   * @param {string} type
   * @param {string} term
   */
  function getLocalTermText(dfn, type, term) {
    let text = term;
    if (type === "enum-value") {
      text = `"${text}"`;
    }
    if (CODE_TYPES.has(type) || dfn.dataset.idl || dfn.closest("code")) {
      text = `<code>${text}</code>`;
    }
    return text;
  }

  /**
   * @param {HTMLElement} dfn
   * @param {string} type
   * @param {string} [term=""]
   */
  function getLocalTermSuffix(dfn, type, term = "") {
    if (term.startsWith("[[")) {
      const parent = getLocalTermParentContext(dfn);
      return `internal slot for <code>${parent}</code>`;
    }

    switch (type) {
      case "dict-member":
      case "method":
      case "attribute":
      case "enum-value": {
        const typeText =
          type === "dict-member" ? "member" : type.replace("-", " ");
        const parent = getLocalTermParentContext(dfn);
        return `${typeText} for <code>${parent}</code>`;
      }
      case "interface":
      case "dictionary":
      case "enum": {
        return type;
      }
      case "constructor": {
        const parent = getLocalTermParentContext(dfn);
        return `for <code>${parent}</code>`;
      }
      default:
        return "";
    }
  }

  function appendSectionNumbers() {
    const getSectionNumber = id => {
      const dfn = document.getElementById(id);
      const sectionNumberEl = dfn
        .closest("section:not(.notoc)")
        .querySelector(".secno");
      const secNum = `§${sectionNumberEl.textContent.trim()}`;
      return html`<span class="print-only">${secNum}</span>`;
    };

    /** @type {NodeListOf<HTMLElement>} */
    const elems = document.querySelectorAll("#index-defined-here li[data-id]");
    elems.forEach(el => el.append(getSectionNumber(el.dataset.id)));
  }

  function createExternalTermIndex() {
    const data = collectExternalTerms();
    const dataSortedBySpec = [...data.entries()].sort(([specA], [specB]) =>
      specA.localeCompare(specB)
    );
    return html`<ul class="index">
    ${dataSortedBySpec.map(([spec, entries]) => {
      return html`<li data-spec="${spec}">
        ${renderInlineCitation(spec)} defines the following:
        <ul>
          ${entries
            .sort((a, b) => a.term.localeCompare(b.term))
            .map(renderExternalTermEntry)}
        </ul>
      </li>`;
    })}
  </ul>`;
  }

  function collectExternalTerms() {
    /** @type {Set<string>} */
    const uniqueReferences = new Set();
    /** @type {Map<string, Entry[]>} spec => entry[] */
    const data = new Map();

    /** @type {NodeListOf<HTMLAnchorElement>} */
    const elements = document.querySelectorAll(`a[data-cite]`);
    for (const elem of elements) {
      if (!elem.dataset.cite) {
        continue;
      }
      const { cite, citeFrag, xrefType, linkType } = elem.dataset;
      if (!(xrefType || linkType || cite.includes("#") || citeFrag)) {
        // Not a reference to a definition
        continue;
      }
      const uniqueID = elem.href;
      if (uniqueReferences.has(uniqueID)) {
        continue;
      }

      const { linkType: type, linkFor } = elem.dataset;
      const term = getTermFromElement(elem);
      if (!term) {
        continue; // <a data-cite="SPEC"></a>
      }
      const spec = toCiteDetails(elem).key.toUpperCase();

      const entriesBySpec = data.get(spec) || data.set(spec, []).get(spec);
      entriesBySpec.push({ term, type, linkFor, elem });
      uniqueReferences.add(uniqueID);
    }

    return data;
  }

  /**
   * @param {Entry} entry
   * @returns {HTMLLIElement}
   */
  function renderExternalTermEntry(entry) {
    const { elem } = entry;
    const text = getTermText(entry);
    const el = html`<li>
    <span class="index-term" data-href="${elem.href}">${{ html: text }}</span>
  </li>`;
    return el;
  }

  // Terms of these _types_ are suffixed with their type info.
  const TYPED_TYPES = new Map([
    ["attribute", "attribute"],
    ["element-attr", "attribute"],
    ["element", "element"],
    ["enum", "enum"],
    ["exception", "exception"],
    ["extended-attribute", "extended attribute"],
    ["interface", "interface"],
  ]);

  // These _terms_ have type suffix "type".
  const TYPE_TERMS = new Set([
    // Following are primitive types as per WebIDL spec:
    "boolean",
    "byte",
    "octet",
    "short",
    "unsigned short",
    "long",
    "unsigned long",
    "long long",
    "unsigned long long",
    "float",
    "unrestricted float",
    "double",
    "unrestricted double",
    // Following are not primitive types, but aren't interfaces either.
    "undefined",
    "any",
    "object",
    "symbol",
  ]);

  /** @param {Entry} entry */
  function getTermText(entry) {
    const { term, type, linkFor } = entry;
    let text = xmlEscape(term);

    if (CODE_TYPES.has(type)) {
      if (type === "extended-attribute") {
        text = `[${text}]`;
      }
      text = `<code>${text}</code>`;
    }

    const typeSuffix = TYPE_TERMS.has(term) ? "type" : TYPED_TYPES.get(type);
    if (typeSuffix) {
      text += ` ${typeSuffix}`;
    }

    if (linkFor) {
      let linkForText = linkFor;
      if (!/\s/.test(linkFor)) {
        // If linkFor is a single word, highlight it.
        linkForText = `<code>${linkForText}</code>`;
      }
      if (type === "element-attr") {
        linkForText += " element";
      }
      text += ` (for ${linkForText})`;
    }

    return text;
  }

  /** @param {Document} doc */
  function cleanup(doc) {
    doc
      .querySelectorAll("#index-defined-elsewhere li[data-spec]")
      .forEach(el => el.removeAttribute("data-spec"));

    doc
      .querySelectorAll("#index-defined-here li[data-id]")
      .forEach(el => el.removeAttribute("data-id"));
  }

  var dfnIndex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$C,
    run: run$A
  });

  // @ts-check
  // Module core/contrib
  // Fetches names of contributors from github and uses them to fill
  // in the content of elements with key identifiers:
  // #gh-contributors: people whose PR have been merged.
  // Spec editors get filtered out automatically.
  const name$B = "core/contrib";

  async function run$z(conf) {
    const ghContributors = document.getElementById("gh-contributors");
    if (!ghContributors) {
      return;
    }

    if (!conf.github) {
      const msg = docLink`Requested list of contributors from GitHub, but ${"[github]"} configuration option is not set.`;
      showError(msg, name$B);
      return;
    }

    const editors = conf.editors.map(editor => editor.name);
    const apiURL = `${conf.github.apiBase}/${conf.github.fullName}/`;
    await showContributors(editors, apiURL);
  }

  /**
   * Show list of contributors in #gh-contributors
   * @param {string[]} editors
   * @param {string} apiURL
   */
  async function showContributors(editors, apiURL) {
    const elem = document.getElementById("gh-contributors");
    if (!elem) return;

    elem.textContent = "Fetching list of contributors...";
    const contributors = await getContributors();
    if (contributors !== null) {
      toHTML$2(contributors, elem);
    } else {
      elem.textContent = "Failed to fetch contributors.";
    }

    async function getContributors() {
      const { href: url } = new URL("contributors", apiURL);
      try {
        const res = await fetchAndCache(url);
        if (!res.ok) {
          throw new Error(
            `Request to ${url} failed with status code ${res.status}`
          );
        }
        /** @type {Contributor[]} */
        const contributors = await res.json();
        return contributors.filter(
          user =>
            !editors.includes(user.name || user.login) &&
            !user.login.includes("[bot]")
        );
      } catch (error) {
        const msg = "Error loading contributors from GitHub.";
        showError(msg, name$B, { cause: error });
        return null;
      }
    }
  }

  /**
   * @typedef {{ name?: string, login: string }} Contributor
   * @param {Contributor[]} contributors
   * @param {HTMLElement} element
   */
  function toHTML$2(contributors, element) {
    const sortedContributors = contributors.sort((a, b) => {
      const nameA = a.name || a.login;
      const nameB = b.name || b.login;
      return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
    });

    if (element.tagName === "UL") {
      html(element)`${sortedContributors.map(
      ({ name, login }) =>
        `<li><a href="https://github.com/${login}">${name || login}</a></li>`
    )}`;
      return;
    }

    const names = sortedContributors.map(user => user.name || user.login);
    element.textContent = joinAnd(names);
  }

  var contrib = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$B,
    run: run$z
  });

  // @ts-check
  // Module core/fix-headers
  // Make sure that all h1-h6 headers (that are first direct children of sections) are actually
  // numbered at the right depth level. This makes it possible to just use any of them (conventionally
  // h2) with the knowledge that the proper depth level will be used

  const name$A = "core/fix-headers";

  function run$y() {
    [...document.querySelectorAll("section:not(.introductory)")]
      .map(sec => sec.querySelector("h1, h2, h3, h4, h5, h6"))
      .filter(h => h)
      .forEach(heading => {
        const depth = Math.min(getParents(heading, "section").length + 1, 6);
        renameElement(heading, `h${depth}`);
      });
  }

  function getParents(el, selector) {
    const parents = [];
    while (el != el.ownerDocument.body) {
      if (el.matches(selector)) parents.push(el);
      el = el.parentElement;
    }
    return parents;
  }

  var fixHeaders = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$A,
    run: run$y
  });

  // @ts-check
  /**
   * Module: core/webidl-index
   * constructs a summary of WebIDL in the document by
   * cloning all the generated WebIDL nodes and
   * appending them to pre element.
   *
   * Usage
   * Add a <section id="idl-index"> to the document.
   * It also supports title elements to generate a header.
   * Or if a header element is an immediate child, then
   * that is preferred.
   */
  const name$z = "core/webidl-index";

  function run$x() {
    /** @type {HTMLElement | null} */
    const idlIndexSec = document.querySelector("section#idl-index");
    if (!idlIndexSec) {
      return;
    }
    // Query for decedents headings, e.g., "h2:first-child, etc.."
    const query = [2, 3, 4, 5, 6].map(level => `h${level}:first-child`).join(",");
    if (!idlIndexSec.querySelector(query)) {
      const header = document.createElement("h2");
      if (idlIndexSec.title) {
        header.textContent = idlIndexSec.title;
        idlIndexSec.removeAttribute("title");
      } else {
        header.textContent = "IDL Index";
      }
      idlIndexSec.prepend(header);
    }

    // filter out the IDL marked with class="exclude" and the IDL in non-normative sections
    const idlIndex = Array.from(
      document.querySelectorAll("pre.idl:not(.exclude) > code")
    ).filter(idl => !idl.closest(nonNormativeSelector));

    if (idlIndex.length === 0) {
      const text = "This specification doesn't normatively declare any Web IDL.";
      idlIndexSec.append(text);
      return;
    }

    const pre = document.createElement("pre");
    pre.classList.add("idl", "def");
    pre.id = "actual-idl-index";
    idlIndex
      .map(elem => {
        const fragment = document.createDocumentFragment();
        for (const child of elem.children) {
          fragment.appendChild(child.cloneNode(true));
        }
        return fragment;
      })
      .forEach(elem => {
        if (pre.lastChild) {
          pre.append("\n\n");
        }
        pre.appendChild(elem);
      });
    // Remove duplicate IDs
    pre.querySelectorAll("*[id]").forEach(elem => elem.removeAttribute("id"));

    // Add our own IDL header
    idlIndexSec.appendChild(pre);
    wrapInner(pre, document.createElement("code"));
    addIDLHeader(pre);
  }

  var webidlIndex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$z,
    run: run$x
  });

  // @ts-check
  // Module core/structure
  //  Handles producing the ToC and numbering sections across the document.


  const lowerHeaderTags = ["h2", "h3", "h4", "h5", "h6"];

  const name$y = "core/structure";

  const localizationStrings$k = {
    en: {
      toc: "Table of Contents",
    },
    zh: {
      toc: "内容大纲",
    },
    ko: {
      toc: "목차",
    },
    ja: {
      toc: "目次",
    },
    nl: {
      toc: "Inhoudsopgave",
    },
    es: {
      toc: "Tabla de Contenidos",
    },
    de: {
      toc: "Inhaltsverzeichnis",
    },
  };

  const l10n$k = getIntlData(localizationStrings$k);

  /**
   * @typedef {object} SectionInfo
   * @property {string} secno
   * @property {string} title
   *
   * Scans sections and generate ordered list element + ID-to-anchor-content dictionary.
   * @param {Section[]} sections the target element to find child sections
   * @param {number} maxTocLevel
   */
  function scanSections(sections, maxTocLevel, { prefix = "" } = {}) {
    let appendixMode = false;
    let lastNonAppendix = 0;
    let index = 1;
    if (prefix.length && !prefix.endsWith(".")) {
      prefix += ".";
    }
    if (sections.length === 0) {
      return null;
    }
    /** @type {HTMLElement} */
    const ol = html`<ol class="toc"></ol>`;
    for (const section of sections) {
      if (section.isAppendix && !prefix && !appendixMode) {
        lastNonAppendix = index;
        appendixMode = true;
      }
      let secno = section.isIntro
        ? ""
        : appendixMode
          ? appendixNumber(index - lastNonAppendix + 1)
          : prefix + index;
      const level = secno.split(".").length;
      if (level === 1) {
        secno += ".";
        // if this is a top level item, insert
        // an OddPage comment so html2ps will correctly
        // paginate the output
        section.header.before(document.createComment("OddPage"));
      }

      if (!section.isIntro) {
        index += 1;
        section.header.prepend(html`<bdi class="secno">${secno} </bdi>`);
      }

      if (level <= maxTocLevel) {
        const id = section.header.id || section.element.id;
        const item = createTocListItem(section.header, id);
        const sub = scanSections(section.subsections, maxTocLevel, {
          prefix: secno,
        });
        if (sub) {
          item.append(sub);
        }
        ol.append(item);
      }
    }
    return ol;
  }

  /**
   * Convert a number to spreadsheet like column name.
   * For example, 1=A, 26=Z, 27=AA, 28=AB and so on..
   * @param {number} num
   */
  function appendixNumber(num) {
    let s = "";
    while (num > 0) {
      num -= 1;
      s = String.fromCharCode(65 + (num % 26)) + s;
      num = Math.floor(num / 26);
    }
    return s;
  }

  /**
   * @typedef {object} Section
   * @property {Element} element
   * @property {Element} header
   * @property {string} title
   * @property {boolean} isIntro
   * @property {boolean} isAppendix
   * @property {Section[]} subsections
   *
   * @param {Element} parent
   */
  function getSectionTree(parent) {
    /** @type {NodeListOf<HTMLElement>} */
    const sectionElements = parent.querySelectorAll(":scope > section");
    /** @type {Section[]} */
    const sections = [];

    for (const section of sectionElements) {
      const noToc = section.classList.contains("notoc");
      if (!section.children.length || noToc) {
        continue;
      }
      const header = section.children[0];
      if (!lowerHeaderTags.includes(header.localName)) {
        continue;
      }
      const title = header.textContent;
      addId(section, null, title);
      sections.push({
        element: section,
        header,
        title,
        isIntro: Boolean(section.closest(".introductory")),
        isAppendix: section.classList.contains("appendix"),
        subsections: getSectionTree(section),
      });
    }
    return sections;
  }

  /**
   * @param {Element} header
   * @param {string} id
   */
  function createTocListItem(header, id) {
    const anchor = html`<a href="${`#${id}`}" class="tocxref" />`;
    anchor.append(...header.cloneNode(true).childNodes);
    filterHeader(anchor);
    return html`<li class="tocline">${anchor}</li>`;
  }

  /**
   * Replaces any child <a> and <dfn> with <span>.
   * @param {HTMLElement} h
   */
  function filterHeader(h) {
    h.querySelectorAll("a").forEach(anchor => {
      const span = renameElement(anchor, "span");
      span.className = "formerLink";
      span.removeAttribute("href");
    });
    h.querySelectorAll("dfn").forEach(dfn => {
      const span = renameElement(dfn, "span");
      span.removeAttribute("id");
    });
  }

  function run$w(conf) {
    if ("maxTocLevel" in conf === false) {
      conf.maxTocLevel = Infinity;
    }

    renameSectionHeaders();

    // makeTOC
    if (!conf.noTOC) {
      skipFromToC();
      const sectionTree = getSectionTree(document.body);
      const result = scanSections(sectionTree, conf.maxTocLevel);
      if (result) {
        createTableOfContents(result);
      }
    }

    // See core/dfn-index
    pub("toc");
  }

  function renameSectionHeaders() {
    const headers = getNonintroductorySectionHeaders();
    if (!headers.length) {
      return;
    }
    headers.forEach(header => {
      const depth = Math.min(parents(header, "section").length + 1, 6);
      const h = `h${depth}`;
      if (header.localName !== h) {
        renameElement(header, h);
      }
    });
  }

  function getNonintroductorySectionHeaders() {
    return [
      ...document.querySelectorAll(
        "section:not(.introductory) :is(h1,h2,h3,h4,h5,h6):first-child"
      ),
    ].filter(elem => !elem.closest("section.introductory"));
  }

  /**
   * Skip descendent sections from appearing in ToC using data-max-toc.
   */
  function skipFromToC() {
    /** @type {NodeListOf<HTMLElement>} */
    const sections = document.querySelectorAll("section[data-max-toc]");
    for (const section of sections) {
      const maxToc = parseInt(section.dataset.maxToc, 10);
      if (maxToc < 0 || maxToc > 6 || Number.isNaN(maxToc)) {
        const msg = "`data-max-toc` must have a value between 0-6 (inclusive).";
        showError(msg, name$y, { elements: [section] });
        continue;
      }

      // `data-max-toc=0` is equivalent to adding a ".notoc" to current section.
      if (maxToc === 0) {
        section.classList.add("notoc");
        continue;
      }

      // When `data-max-toc=2`, we skip all ":scope > section > section" from ToC
      // i.e., at §1, we will keep §1.1 but not §1.1.1
      // Similarly, `data-max-toc=1` will keep §1, but not §1.1
      const sectionToSkipFromToC = section.querySelectorAll(
        `:scope > ${Array.from({ length: maxToc }, () => "section").join(" > ")}`
      );
      for (const el of sectionToSkipFromToC) {
        el.classList.add("notoc");
      }
    }
  }

  /**
   * @param {HTMLElement} ol
   */
  function createTableOfContents(ol) {
    if (!ol) {
      return;
    }
    const nav = html`<nav id="toc"></nav>`;
    const h2 = html`<h2 class="introductory">${l10n$k.toc}</h2>`;
    addId(h2);
    nav.append(h2, ol);
    const ref =
      document.getElementById("toc") ||
      document.getElementById("sotd") ||
      document.getElementById("abstract");
    if (ref) {
      if (ref.id === "toc") {
        ref.replaceWith(nav);
      } else {
        ref.after(nav);
      }
    }

    const link = html`<p role="navigation" id="back-to-top">
    <a href="#title"><abbr title="Back to Top">&uarr;</abbr></a>
  </p>`;
    document.body.append(link);
  }

  var structure = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$y,
    run: run$w
  });

  // @ts-check
  // Module core/informative
  // Mark specific sections as informative, based on CSS

  const name$x = "core/informative";

  const localizationStrings$j = {
    en: {
      informative: "This section is non-normative.",
    },
    nl: {
      informative: "Dit onderdeel is niet normatief.",
    },
    ko: {
      informative: "이 부분은 비규범적입니다.",
    },
    ja: {
      informative: "この節は仕様には含まれません．",
    },
    de: {
      informative: "Dieser Abschnitt ist nicht normativ.",
    },
    zh: {
      informative: "本章节不包含规范性内容。",
    },
  };

  const l10n$j = getIntlData(localizationStrings$j);

  function run$v() {
    Array.from(document.querySelectorAll("section.informative"))
      .map(informative => informative.querySelector("h2, h3, h4, h5, h6"))
      .filter(heading => heading)
      .forEach(heading => {
        heading.after(html`<p><em>${l10n$j.informative}</em></p>`);
      });
  }

  var informative = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$x,
    run: run$v
  });

  // @ts-check
  // Module core/id-headers
  // All headings are expected to have an ID, unless their immediate container has one.
  // This is currently in core though it comes from a W3C rule. It may move in the future.

  const name$w = "core/id-headers";

  const localizationStrings$i = {
    en: {
      /**
       *
       * @param {"Appendix" | "Section"} sectionType
       */
      permalinkLabel(sectionType, sectionNumber) {
        let label = `Permalink for${
        !sectionNumber ? " this" : ""
      } ${sectionType}`;
        if (sectionNumber) {
          label += ` ${norm(sectionNumber.textContent)}`;
        }
        return label;
      },
    },
  };
  const l10n$i = getIntlData(localizationStrings$i);

  function run$u(conf) {
    /** @type {NodeListOf<HTMLElement>} */
    const headings = document.querySelectorAll(
      `section:not(.head,#abstract,#sotd) h2, h3, h4, h5, h6`
    );
    for (const h of headings) {
      // prefer for ID: heading.id > parentElement.id > newly generated heading.id
      let id = h.id;
      if (!id) {
        addId(h);
        id = h.parentElement.id || h.id;
      }
      if (!conf.addSectionLinks) continue;
      const label = l10n$i.permalinkLabel(
        h.closest(".appendix") ? "Appendix" : "Section",
        h.querySelector(":scope > bdi.secno")
      );
      const wrapper = html`<div class="header-wrapper"></div>`;
      h.replaceWith(wrapper);
      const selfLink = html`<a
      href="#${id}"
      class="self-link"
      aria-label="${label}"
    ></a>`;
      wrapper.append(h, selfLink);
    }
  }

  var idHeaders = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$w,
    run: run$u
  });

  /* container for stats */
  const css$c = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$d = css$c`

.caniuse-stats {
  display: flex;
  column-gap: 2em;
}

.caniuse-group {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  flex-basis: auto;
}

.caniuse-browsers {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: .2em;
  column-gap: .4em;
  border-bottom: 1px solid #ccc;
  row-gap: .4em;
  padding-bottom: .4cm;
}

.caniuse-type {
  align-self: center;
  border-top: none;
  text-transform: capitalize;
  font-size: .8em;
  margin-top: -.8em;
  font-weight: bold;
}

.caniuse-type span {
  background-color: var(--bg, white);
  padding: 0 0.4em;
}

/* a browser version */
.caniuse-cell {
  align-items: center;
  border-radius: 1cm;
  color: #fff;
  display: flex;
  font-size: 90%;
  min-width: 1.5cm;
  padding: .3rem;
  justify-content: space-evenly;
  --supported: #2a8436dd;
  --no-support: #c44230dd;
  --no-support-alt: #b43b2bdd;
  --partial: #807301dd;
  --partial-alt: #746c00dd;
  --unknown: #757575;

  background: repeating-linear-gradient(
    var(--caniuse-angle, 45deg),
    var(--caniuse-bg) 0,
    var(--caniuse-bg-alt) 1px,
    var(--caniuse-bg-alt) 0.4em,
    var(--caniuse-bg) calc(0.25em + 1px),
    var(--caniuse-bg) 0.75em
  );
}

img.caniuse-browser {
  filter: drop-shadow(0px 0px .1cm #666666);
  background: transparent;
}

.caniuse-cell span.browser-version {
  margin-left: 0.4em;
  text-shadow: 0 0 0.1em #fff;
  font-weight: 100;
  font-size: .9em;
}

.caniuse-stats a[href] {
  white-space: nowrap;
  align-self: flex-end;
}

/* supports */
.caniuse-cell.y {
  background: var(--supported);
}

/* no support, disabled by default */
.caniuse-cell:is(.n,.d) {
  --caniuse-angle: 45deg;
  --caniuse-bg: var(--no-support);
  --caniuse-bg-alt: var(--no-support-alt);
}

.caniuse-cell.u {
  background: var(--unknown);
}

.caniuse-cell.d {
  --caniuse-angle: 180deg;
}

/* not supported by default / partial support etc
see https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md for stats */
.caniuse-cell:is(.a,.x,.p) {
  --caniuse-angle: 90deg;
  --caniuse-bg: var(--partial);
  --caniuse-bg-alt: var(--partial-alt);
}

/* handle case when printing */
@media print {
  .caniuse-cell.y::before {
    content: "✔️";
    padding: 0.5em;
  }

  .caniuse-cell.n::before {
    content: "❌";
    padding: 0.5em;
  }

  .caniuse-cell:is(.a,.d,.p,.x,.u)::before {
    content: "⚠️";
    padding: 0.5em;
  }
}
`;

  // @ts-check
  /**
   * Module: "core/caniuse"
   * Adds a caniuse support table for a "feature" #1238
   * Usage options: https://github.com/speced/respec/wiki/caniuse
   */

  const name$v = "core/caniuse";

  const API_URL = "https://respec.org/caniuse/";

  const BROWSERS = new Map([
    ["and_chr", { name: "Android Chrome", path: "chrome", type: "mobile" }],
    ["and_ff", { name: "Android Firefox", path: "firefox", type: "mobile" }],
    ["and_uc", { name: "Android UC", path: "uc", type: "mobile" }],
    ["chrome", { name: "Chrome", type: "desktop" }],
    ["edge", { name: "Edge", type: "desktop" }],
    ["firefox", { name: "Firefox", type: "desktop" }],
    ["ios_saf", { name: "iOS Safari", path: "safari-ios", type: "mobile" }],
    ["op_mob", { name: "Opera Mobile", path: "opera", type: "mobile" }],
    ["opera", { name: "Opera", type: "desktop" }],
    ["safari", { name: "Safari", type: "desktop" }],
    [
      "samsung",
      { name: "Samsung Internet", path: "samsung-internet", type: "mobile" },
    ],
  ]);

  const statToText = new Map([
    ["a", "almost supported (aka Partial support)"],
    ["d", "disabled by default"],
    ["n", "no support, or disabled by default"],
    ["p", "no support, but has Polyfill"],
    ["u", "unknown support"],
    ["x", "requires prefix to work"],
    ["y", "supported by default"],
  ]);

  function prepare(conf) {
    if (!conf.caniuse) {
      return; // nothing to do.
    }
    normalizeCaniuseConf(conf);
    validateBrowsers(conf);
    const options = conf.caniuse;
    if (!options.feature) {
      return; // no feature to show
    }

    document.head.appendChild(
      html`<style
      id="caniuse-stylesheet"
      class="${options.removeOnSave ? "removeOnSave" : ""}"
    >
      ${css$d}
    </style>`
    );
  }
  /**
   * @param {string} browser
   * @returns
   */
  function getLogoSrc(browser) {
    const path = BROWSERS.get(browser).path ?? browser;
    return `https://www.w3.org/assets/logos/browser-logos/${path}/${path}.svg`;
  }

  async function run$t(conf) {
    const options = conf.caniuse;
    if (!options?.feature) return;

    const featureURL = new URL(options.feature, "https://caniuse.com/").href;
    const headDlElem = document.querySelector(".head dl");
    const contentPromise = fetchStats(conf.caniuse)
      .then(json => processJson(json, options))
      .catch(err => handleError(err, options, featureURL));
    const definitionPair = html`<dt class="caniuse-title">Browser support:</dt>
    <dd class="caniuse-stats">
      ${{
        any: contentPromise,
        placeholder: "Fetching data from caniuse.com...",
      }}
    </dd>`;
    headDlElem.append(...definitionPair.childNodes);
    await contentPromise;
    pub("amend-user-config", { caniuse: options.feature });
    if (options.removeOnSave) {
      // Will remove the browser support cells.
      headDlElem
        .querySelectorAll(".caniuse-browser")
        .forEach(elem => elem.classList.add("removeOnSave"));
      sub("beforesave", outputDoc => {
        html.bind(outputDoc.querySelector(".caniuse-stats"))`
        <a href="${featureURL}">caniuse.com</a>`;
      });
    }
  }

  function handleError(err, options, featureURL) {
    const msg = `Failed to retrieve feature "${options.feature}".`;
    const hint = docLink`Please check the feature key on [caniuse.com](https://caniuse.com) and update ${"[caniuse]"}.`;
    showError(msg, name$v, { hint, cause: err });
    return html`<a href="${featureURL}">caniuse.com</a>`;
  }

  /**
   * returns normalized `conf.caniuse` configuration
   * @param {Object} conf   configuration settings
   */
  function normalizeCaniuseConf(conf) {
    const defaultBrowsers = new Set(BROWSERS.keys());
    defaultBrowsers.delete("op_mob");
    defaultBrowsers.delete("opera");
    const DEFAULTS = { removeOnSave: true, browsers: [...defaultBrowsers] };
    if (typeof conf.caniuse === "string") {
      conf.caniuse = { feature: conf.caniuse, ...DEFAULTS };
      return;
    }
    conf.caniuse = { ...DEFAULTS, ...conf.caniuse };
  }

  function validateBrowsers({ caniuse }) {
    const { browsers } = caniuse;
    const invalidBrowsers = browsers.filter(browser => !BROWSERS.has(browser));
    if (invalidBrowsers.length) {
      const names = codedJoinAnd(invalidBrowsers, { quotes: true });
      const msg = docLink`Invalid browser(s): (${names}) in the \`browser\` property of ${"[caniuse]"}.`;
      showWarning(msg, name$v);
    }
  }

  async function processJson(json, { feature }) {
    /** @type {Array} */
    const results = json.result;
    const groups = new Map([
      ["desktop", []],
      ["mobile", []],
    ]);
    const toBrowserCell = browserCellRenderer(feature);
    results.reduce(toBrowserCell, groups);
    const out = [...groups]
      .filter(([, arr]) => arr.length)
      .map(
        ([key, arr]) =>
          html`<div class="caniuse-group">
          <div class="caniuse-browsers">${arr}</div>
          <div class="caniuse-type"><span>${key}</div>
        </div>`
      );
    out.push(
      html`<a class="caniuse-cell" href="https://caniuse.com/${feature}"
      >More info</a
    >`
    );
    return out;
  }

  function browserCellRenderer(feature) {
    return (groups, { browser: browserId, version, caniuse }) => {
      const { name, type } = BROWSERS.get(browserId);
      const versionLong = version ? ` version ${version}` : "";
      const browserName = `${name}${versionLong}`;
      const supportLevel = statToText.get(caniuse);
      const ariaLabel = `${feature} is ${supportLevel} since ${browserName} on ${type}.`;
      const cssClass = `caniuse-cell ${caniuse}`;
      const title = capitalize(`${supportLevel} since ${browserName}.`);
      const textVersion = version ? version : "—";
      const src = getLogoSrc(browserId);
      const result = html`
      <div class="${cssClass}" title="${title}" aria-label="${ariaLabel}">
        <img
          class="caniuse-browser"
          width="20"
          height="20"
          src="${src}"
          alt="${name} logo"
        /><span class="browser-version">${textVersion}</span>
      </div>
    `;
      groups.get(type).push(result);
      return groups;
    };
  }

  /**
   * @typedef {Record<string, [string, string[]][]>} ApiResponse
   * @throws {Error} on failure
   */
  async function fetchStats(options) {
    const { feature, browsers, apiURL } = options;
    const url = new URL(apiURL || `./${feature}`, API_URL);
    browsers.forEach(browser => url.searchParams.append("browsers", browser));
    const response = await fetch(url);
    if (!response.ok) {
      const { status, statusText } = response;
      throw new Error(`Failed to get caniuse data: (${status}) ${statusText}`);
    }
    return response.json();
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  var caniuse = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BROWSERS: BROWSERS,
    name: name$v,
    prepare: prepare,
    run: run$t
  });

  const css$a = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$b = css$a`
.mdn {
  font-size: 0.75em;
  position: absolute;
  right: 0.3em;
  min-width: 0;
  margin-top: 3rem;
}

.mdn details {
  width: 100%;
  margin: 1px 0;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
  padding: 0.4em;
  padding-top: 0;
}

.mdn details[open] {
  min-width: 25ch;
  max-width: 32ch;
  background: #fff;
  background: var(--indextable-hover-bg, #fff);
  color: black;
  color: var(--indextable-hover-text, black);
  box-shadow:
    0 1em 3em -0.4em rgba(0, 0, 0, 0.3),
    0 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow:
    0 1em 3em -0.4em var(--tocsidebar-shadow, rgba(0, 0, 0, 0.3)),
    0 0 1px 1px var(--tocsidebar-shadow, rgba(0, 0, 0, 0.05));
  border-radius: 2px;
  z-index: 11;
  margin-bottom: 0.4em;
}

.mdn summary {
  text-align: right;
  cursor: default;
  margin-right: -0.4em;
}

.mdn summary span {
  font-family: zillaslab, Palatino, "Palatino Linotype", serif;
  color: #fff;
  color: var(--bg, #fff);
  background-color: #000;
  background-color: var(--text, #000);
  display: inline-block;
  padding: 3px;
}

.mdn a {
  display: inline-block;
  word-break: break-all;
}

.mdn p {
  margin: 0;
}

.mdn .engines-all {
  color: #058b00;
}
.mdn .engines-some {
  color: #b00;
}

.mdn table {
  width: 100%;
  font-size: 0.9em;
}

.mdn td {
  border: none;
}

.mdn td:nth-child(2) {
  text-align: right;
}

.mdn .nosupportdata {
  font-style: italic;
  margin: 0;
}

.mdn tr::before {
  content: "";
  display: table-cell;
  width: 1.5em;
  height: 1.5em;
  background: no-repeat center center / contain;
  font-size: 0.75em;
}

.mdn .no,
.mdn .unknown {
  color: #cccccc;
  filter: grayscale(100%);
}

.mdn .no::before,
.mdn .unknown::before {
  opacity: 0.5;
}

.mdn .chrome::before,
.mdn .chrome_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/chrome/chrome.svg);
}

.mdn .edge::before,
.mdn .edge_mobile::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/edge/edge.svg);
}

.mdn .firefox::before,
.mdn .firefox_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/firefox/firefox.svg);
}

.mdn .opera::before,
.mdn .opera_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/opera/opera.svg);
}

.mdn .safari::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/safari/safari.svg);
}

.mdn .safari_ios::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/safari-ios/safari-ios.svg);
}

.mdn .samsunginternet_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/samsung-internet/samsung-internet.svg);
}

.mdn .webview_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/android-webview/android-webview.png);
}
`;

  // @ts-check

  const name$u = "core/mdn-annotation";

  const BASE_JSON_PATH = "https://w3c.github.io/mdn-spec-links/";
  const MDN_URL_BASE = "https://developer.mozilla.org/en-US/docs/Web/";
  const MDN_BROWSERS = {
    // The browser IDs here must match the ones in the imported JSON data.
    // See the list of browser IDs at:
    // https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md#browser-identifiers.
    chrome: "Chrome",
    chrome_android: "Chrome Android",
    edge: "Edge",
    edge_mobile: "Edge Mobile",
    firefox: "Firefox",
    firefox_android: "Firefox Android",
    // nodejs: "Node.js", // no data for features in HTML
    opera: "Opera",
    opera_android: "Opera Android",
    // qq_android: "QQ Browser", // not enough data for features in HTML
    safari: "Safari",
    safari_ios: "Safari iOS",
    samsunginternet_android: "Samsung Internet",
    // uc_android: "UC browser", // not enough data for features in HTML
    // uc_chinese_android: "Chinese UC Browser", // not enough data for features in HTML
    webview_android: "WebView Android",
  };

  const localizationStrings$h = {
    en: {
      inAllEngines: "This feature is in all major engines.",
      inSomeEngines: "This feature has limited support.",
    },
    zh: {
      inAllEngines: "所有主要引擎均支持此特性。",
      inSomeEngines: "此功能支持有限。",
    },
  };
  const l10n$h = getIntlData(localizationStrings$h);

  /**
   * @param {HTMLElement} node
   */
  function insertMDNBox(node) {
    const targetAncestor = node.closest("section");
    if (!targetAncestor) return;
    const { previousElementSibling: targetSibling } = targetAncestor;
    if (targetSibling && targetSibling.classList.contains("mdn")) {
      // If the target ancestor already has a mdnBox inserted, we just use it
      return targetSibling;
    }
    const mdnBox = html`<aside class="mdn"></aside>`;
    targetAncestor.before(mdnBox);
    return mdnBox;
  }

  /**
   * @param {MdnEntry} mdnSpec
   * @returns {HTMLDetailsElement}
   */
  function attachMDNDetail(mdnSpec) {
    const { name, slug, summary, support, engines } = mdnSpec;
    const mdnSubPath = slug.slice(slug.indexOf("/") + 1);
    const href = `${MDN_URL_BASE}${slug}`;
    const label = `Expand MDN details for ${name}`;
    const engineSupport = getEngineSupportIcons(engines);
    return html`<details>
    <summary aria-label="${label}"><span>MDN</span>${engineSupport}</summary>
    <a title="${summary}" href="${href}">${mdnSubPath}</a>
    ${getEngineSupport(engines)}
    ${support
      ? buildBrowserSupportTable(support)
      : html`<p class="nosupportdata">No support data.</p>`}
  </details>`;
  }

  /**
   * @param {MdnEntry['support']} support
   * @returns {HTMLTableElement}
   */
  function buildBrowserSupportTable(support) {
    /**
     * @param {string | keyof MDN_BROWSERS} browserId
     * @param {"Yes" | "No" | "Unknown"} yesNoUnknown
     * @param {string} version
     * @returns {HTMLTableRowElement}
     */
    function createRow(browserId, yesNoUnknown, version) {
      const displayStatus = yesNoUnknown === "Unknown" ? "?" : yesNoUnknown;
      const classList = `${browserId} ${yesNoUnknown.toLowerCase()}`;
      return html`<tr class="${classList}">
      <td>${MDN_BROWSERS[browserId]}</td>
      <td>${version ? version : displayStatus}</td>
    </tr>`;
    }

    /**
     * @param {string | keyof MDN_BROWSERS} browserId
     * @param {VersionDetails} versionData
     */
    function createRowFromBrowserData(browserId, versionData) {
      if (versionData.version_removed) {
        return createRow(browserId, "No", "");
      }
      const versionAdded = versionData.version_added;
      if (typeof versionAdded === "boolean") {
        return createRow(browserId, versionAdded ? "Yes" : "No", "");
      } else if (!versionAdded) {
        return createRow(browserId, "Unknown", "");
      } else {
        return createRow(browserId, "Yes", `${versionAdded}+`);
      }
    }

    return html`<table>
    ${Object.keys(MDN_BROWSERS).map(browserId => {
      return support[browserId]
        ? createRowFromBrowserData(browserId, support[browserId])
        : createRow(browserId, "Unknown", "");
    })}
  </table>`;
  }

  async function run$s(conf) {
    const mdnKey = getMdnKey(conf);
    if (!mdnKey) return;

    const mdnSpecJson = await getMdnData(mdnKey, conf.mdn);
    if (!mdnSpecJson) return;

    const style = document.createElement("style");
    style.textContent = css$b;
    document.head.append(style);

    for (const elem of findElements(mdnSpecJson)) {
      const mdnSpecArray = mdnSpecJson[elem.id];
      const mdnBox = insertMDNBox(elem);
      if (!mdnBox) continue;
      for (const spec of mdnSpecArray) {
        mdnBox.append(attachMDNDetail(spec));
      }
    }
  }

  /** @returns {string} */
  function getMdnKey(conf) {
    const { shortName, mdn } = conf;
    if (!mdn) return;
    if (typeof mdn === "string") return mdn;
    return mdn.key || shortName;
  }

  /**
   * @param {string} key MDN key
   * @param {object} mdnConf
   * @param {string} [mdnConf.specMapUrl]
   * @param {string} [mdnConf.baseJsonPath]
   * @param {number} [mdnConf.maxAge]
   *
   * @typedef {{ version_added: string|boolean|null, version_removed?: string }} VersionDetails
   * @typedef {Record<string | keyof MDN_BROWSERS, VersionDetails>} MdnSupportEntry
   * @typedef {{ name: string, title: string, slug: string, summary: string, support: MdnSupportEntry, engines: string[] }} MdnEntry
   * @typedef {Record<string, MdnEntry[]>} MdnData
   * @returns {Promise<MdnData|undefined>}
   */
  async function getMdnData(key, mdnConf) {
    const { baseJsonPath = BASE_JSON_PATH, maxAge = 60 * 60 * 24 * 1000 } =
      mdnConf;
    const url = new URL(`${key}.json`, baseJsonPath).href;
    const res = await fetchAndCache(url, maxAge);
    if (res.status === 404) {
      const msg = `Could not find MDN data associated with key "${key}".`;
      const hint = "Please add a valid key to `respecConfig.mdn`";
      showError(msg, name$u, { hint });
      return;
    }
    return await res.json();
  }

  /**
   * Find elements that can have an annotation box attached.
   * @param {MdnData} data
   */
  function findElements(data) {
    /** @type {NodeListOf<HTMLElement>} */
    const elemsWithId = document.body.querySelectorAll("[id]:not(script)");
    return [...elemsWithId].filter(({ id }) => Array.isArray(data[id]));
  }

  /**
   * @param {MdnEntry['engines']} engines
   * @returns {HTMLSpanElement}
   */
  function getEngineSupportIcons(engines) {
    if (engines.length === 3) {
      return html`<span title="${l10n$h.inAllEngines}">✅</span>`;
    }
    if (engines.length < 2) {
      return html`<span title="${l10n$h.inSomeEngines}">🚫</span>`;
    }
    return html`<span>&emsp;</span>`;
  }

  /**
   * @param {MdnEntry['engines']} engines
   * @returns {HTMLParagraphElement|undefined}
   */
  function getEngineSupport(engines) {
    if (engines.length === 3) {
      return html`<p class="engines-all">${l10n$h.inAllEngines}</p>`;
    }
    if (engines.length < 2) {
      return html`<p class="engines-some">${l10n$h.inSomeEngines}</p>`;
    }
  }

  var mdnAnnotation = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$u,
    run: run$s
  });

  // @ts-check
  // Module ui/save-html
  // Saves content to HTML when asked to

  const name$t = "ui/save-html";

  const localizationStrings$g = {
    en: {
      save_snapshot: "Export",
    },
    nl: {
      save_snapshot: "Bewaar Snapshot",
    },
    ja: {
      save_snapshot: "保存する",
    },
    de: {
      save_snapshot: "Exportieren",
    },
    zh: {
      save_snapshot: "导出",
    },
  };
  const l10n$g = getIntlData(localizationStrings$g);

  const downloadLinks = [
    {
      id: "respec-save-as-html",
      ext: "html",
      title: "HTML",
      type: "text/html",
      get href() {
        return rsDocToDataURL(this.type);
      },
    },
    {
      id: "respec-save-as-xml",
      ext: "xhtml",
      title: "XML",
      type: "application/xml",
      get href() {
        return rsDocToDataURL(this.type);
      },
    },
    {
      id: "respec-save-as-epub",
      ext: "epub",
      title: "EPUB 3",
      type: "application/epub+zip",
      get href() {
        // Create and download an EPUB 3.2 version of the content
        // Using the EPUB 3.2 conversion service set up at labs.w3.org/r2epub
        // For more details on that service, see https://github.com/iherman/respec2epub
        const epubURL = new URL("https://labs.w3.org/r2epub/");
        epubURL.searchParams.append("respec", "true");
        epubURL.searchParams.append("url", document.location.href);
        return epubURL.href;
      },
    },
  ];

  /**
   * @param {typeof downloadLinks[0]} details
   */
  function toDownloadLink(details, conf) {
    const { id, href, ext, title, type } = details;
    const date = concatDate(conf.publishDate || new Date());
    const filename = [conf.specStatus, conf.shortName || "spec", date].join("-");
    return html`<a
    href="${href}"
    id="${id}"
    download="${filename}.${ext}"
    type="${type}"
    class="respec-save-button"
    onclick=${() => ui.closeModal()}
    >${title}</a
  >`;
  }

  function run$r(conf) {
    const saveDialog = {
      async show(button) {
        await document.respec.ready;
        const div = html`<div class="respec-save-buttons">
        ${downloadLinks.map(details => toDownloadLink(details, conf))}
      </div>`;
        ui.freshModal(l10n$g.save_snapshot, div, button);
      },
    };

    const supportsDownload = "download" in HTMLAnchorElement.prototype;
    let button;
    if (supportsDownload) {
      button = ui.addCommand(l10n$g.save_snapshot, show, "Ctrl+Shift+Alt+S", "💾");
    }

    function show() {
      if (!supportsDownload) return;
      saveDialog.show(button);
    }
  }

  /**
   * @param {*} _
   * @param {string} mimeType
   */
  function exportDocument(_, mimeType) {
    const msg =
      "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed.";
    const hint = "Use core/exporter `rsDocToDataURL()` instead.";
    showWarning(msg, name$t, { hint });
    return rsDocToDataURL(mimeType);
  }

  var saveHtml = /*#__PURE__*/Object.freeze({
    __proto__: null,
    exportDocument: exportDocument,
    name: name$t,
    run: run$r
  });

  // @ts-check
  // Module ui/search-specref
  // Search Specref database

  const URL$2 = "https://respec.org/specref/";

  const localizationStrings$f = {
    en: {
      search_specref: "Search Specref",
    },
    nl: {
      search_specref: "Doorzoek Specref",
    },
    ja: {
      search_specref: "仕様検索",
    },
    de: {
      search_specref: "Spezifikationen durchsuchen",
    },
    zh: {
      search_specref: "搜索 Specref",
    },
  };
  const l10n$f = getIntlData(localizationStrings$f);

  const button$2 = ui.addCommand(
    l10n$f.search_specref,
    show$2,
    "Ctrl+Shift+Alt+space",
    "🔎"
  );

  function show$2() {
    const onLoad = e => e.target.classList.add("ready");
    /** @type {HTMLElement} */
    const specrefSearchUI = html`
    <iframe class="respec-iframe" src="${URL$2}" onload=${onLoad}></iframe>
    <a href="${URL$2}" target="_blank">Open Search UI in a new tab</a>
  `;
    ui.freshModal(l10n$f.search_specref, specrefSearchUI, button$2);
  }

  var searchSpecref = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  // @ts-check
  // Module ui/search-xref
  // Search xref database

  const URL$1 = "https://respec.org/xref/";

  const localizationStrings$e = {
    en: {
      title: "Search definitions",
    },
    ja: {
      title: "定義検索",
    },
    de: {
      title: "Definitionen durchsuchen",
    },
    zh: {
      title: "搜索定义",
    },
  };
  const l10n$e = getIntlData(localizationStrings$e);

  const button$1 = ui.addCommand(l10n$e.title, show$1, "Ctrl+Shift+Alt+x", "📚");

  function show$1() {
    const onLoad = e => e.target.classList.add("ready");
    const xrefSearchUI = html`
    <iframe class="respec-iframe" src="${URL$1}" onload="${onLoad}"></iframe>
    <a href="${URL$1}" target="_blank">Open Search UI in a new tab</a>
  `;
    ui.freshModal(l10n$e.title, xrefSearchUI, button$1);
  }

  var searchXref = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  // @ts-check
  // Module ui/about-respec
  // A simple about dialog with pointer to the help

  const localizationStrings$d = {
    en: {
      about_respec: "About",
    },
    zh: {
      about_respec: "关于",
    },
    nl: {
      about_respec: "Over",
    },
    ja: {
      about_respec: "これについて",
    },
    de: {
      about_respec: "Über",
    },
  };
  const l10n$d = getIntlData(localizationStrings$d);

  // window.respecVersion is added at build time (see tools/builder.js)
  window.respecVersion = window.respecVersion || "Developer Edition";
  const div = document.createElement("div");
  const render = html.bind(div);
  const button = ui.addCommand(
    `${l10n$d.about_respec} ${window.respecVersion}`,
    show,
    "Ctrl+Shift+Alt+A",
    "ℹ️"
  );

  function show() {
    const entries = [];
    if ("getEntriesByType" in performance) {
      performance
        .getEntriesByType("measure")
        .sort((a, b) => b.duration - a.duration)
        .map(({ name, duration }) => {
          const humanDuration =
            duration > 1000
              ? `${Math.round(duration / 1000.0)} second(s)`
              : `${duration.toFixed(2)} milliseconds`;
          return { name, duration: humanDuration };
        })
        .map(perfEntryToTR)
        .forEach(entry => {
          entries.push(entry);
        });
    }
    render`
  <p>
    ReSpec is a document production toolchain, with a notable focus on W3C specifications.
  </p>
  <p>
    <a href='https://respec.org/docs'>Documentation</a>,
    <a href='https://github.com/speced/respec/issues'>Bugs</a>.
  </p>
  <table border="1" width="100%" hidden="${entries.length ? false : true}">
    <caption>
      Loaded plugins
    </caption>
    <thead>
      <tr>
        <th>
          Plugin Name
        </th>
        <th>
          Processing time
        </th>
      </tr>
    </thead>
    <tbody>${entries}</tbody>
  </table>
`;
    ui.freshModal(`${l10n$d.about_respec} - ${window.respecVersion}`, div, button);
  }

  function perfEntryToTR({ name, duration }) {
    const moduleURL = `https://github.com/speced/respec/blob/develop/src/${name}.js`;
    return html`
    <tr>
      <td><a href="${moduleURL}">${name}</a></td>
      <td>${duration}</td>
    </tr>
  `;
  }

  var aboutRespec = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  // @ts-check
  /**
   * This Module adds a metatag description to the document, based on the
   * first paragraph of the abstract.
   */

  const name$s = "core/seo";

  function run$q(conf) {
    if (conf.gitRevision) {
      // This allows to set a git revision of the source used to produce the
      // generated content. Typically, this would be set when generating the
      // static HTML via a build process.
      // 'revision' is the name recommended in https://wiki.whatwg.org/wiki/MetaExtensions
      const metaElem = html`<meta
      name="revision"
      content="${conf.gitRevision}"
    />`;
      document.head.appendChild(metaElem);
    }

    const firstParagraph = document.querySelector("#abstract p:first-of-type");
    if (!firstParagraph) {
      return; // no abstract, so nothing to do
    }
    // Normalize whitespace: trim, remove new lines, tabs, etc.
    const content = firstParagraph.textContent.replace(/\s+/, " ").trim();
    const metaElem = document.createElement("meta");
    metaElem.name = "description";
    metaElem.content = content;
    document.head.appendChild(metaElem);
  }

  var seo$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$s,
    run: run$q
  });

  // @ts-check
  // Module w3c/seo
  // Manages SEO information for documents
  // e.g. set the canonical URL for the document if configured
  const name$r = "w3c/seo";

  const status2rdf = {
    NOTE: "w3p:NOTE",
    WD: "w3p:WD",
    LC: "w3p:LastCall",
    CR: "w3p:CR",
    CRD: "w3p:CRD",
    PR: "w3p:PR",
    REC: "w3p:REC",
    RSCND: "w3p:RSCND",
  };

  const requiresCanonicalLink = new Set([
    ...W3CNotes,
    ...recTrackStatus,
    ...registryTrackStatus,
    "BG-FINAL",
    "CG-FINAL",
    "CRY",
    "DRY",
    "draft-finding",
    "finding",
  ]);

  async function run$p(conf) {
    // Don't include a canonical URL for documents that haven't been published.
    if (
      (!conf.canonicalURI && !requiresCanonicalLink.has(conf.specStatus)) ||
      !conf.shortName
    ) {
      return;
    }
    switch (conf.canonicalURI) {
      case "edDraft":
        if (conf.edDraftURI) {
          conf.canonicalURI = new URL(
            conf.edDraftURI,
            document.location.href
          ).href;
        } else {
          const msg = `Canonical URI set to edDraft, but no edDraftURI is set in configuration`;
          showWarning(msg, name$r);
          conf.canonicalURI = null;
        }
        break;
      case "TR":
        if (conf.latestVersion) {
          conf.canonicalURI = conf.latestVersion;
        } else {
          const msg = `Canonical URI set to TR, but no shortName is set in configuration`;
          showWarning(msg, name$r);
          conf.canonicalURI = null;
        }
        break;
      default:
        if (conf.latestVersion && !conf.canonicalURI) {
          conf.canonicalURI = conf.latestVersion;
        }
    }
    if (conf.canonicalURI) {
      const linkElem = html`<link rel="canonical" href="${conf.canonicalURI}" />`;
      document.head.appendChild(linkElem);
    }

    if (conf.doJsonLd) {
      await addJSONLDInfo(conf, document);
    }
  }

  async function addJSONLDInfo(conf, doc) {
    const rdfStatus = status2rdf[conf.specStatus];
    // Content for JSON
    const type = ["TechArticle"];
    if (rdfStatus) type.push(rdfStatus);

    const jsonld = {
      "@context": [
        "http://schema.org",
        {
          "@vocab": "http://schema.org/",
          "@language": doc.documentElement.lang || "en",
          w3p: "http://www.w3.org/2001/02pd/rec54#",
          foaf: "http://xmlns.com/foaf/0.1/",
          datePublished: { "@type": "http://www.w3.org/2001/XMLSchema#date" },
          inLanguage: { "@language": null },
          isBasedOn: { "@type": "@id" },
          license: { "@type": "@id" },
        },
      ],
      id: conf.canonicalURI || conf.thisVersion,
      type,
      name: document.title,
      inLanguage: doc.documentElement.lang || "en",
      license: conf.licenseInfo?.url,
      datePublished: conf.dashDate,
      /** @type {{ name: string, url?: string } | { name: string, url?: string }[]} */
      copyrightHolder: {
        name: "World Wide Web Consortium",
        url: "https://www.w3.org/",
      },
      discussionUrl: conf.issueBase,
      alternativeHeadline: conf.subtitle,
      isBasedOn: conf.prevVersion,
    };

    // add any additional copyright holders
    if (conf.additionalCopyrightHolders) {
      const addl = Array.isArray(conf.additionalCopyrightHolders)
        ? conf.additionalCopyrightHolders
        : [conf.additionalCopyrightHolders];
      jsonld.copyrightHolder = [
        jsonld.copyrightHolder,
        ...addl.map(h => ({ name: h })),
      ];
    }

    // description from meta description
    const description = doc.head.querySelector("meta[name=description]");
    if (description) {
      jsonld.description = description.content;
    }

    // Editors
    if (conf.editors) {
      jsonld.editor = conf.editors.map(addPerson);
    }
    if (conf.authors) {
      jsonld.contributor = conf.authors.map(addPerson);
    }

    // normative and informative references
    const citationIds = [
      ...conf.normativeReferences,
      ...conf.informativeReferences,
    ];
    const citationContents = await Promise.all(
      citationIds.map(ref => resolveRef(ref))
    );
    jsonld.citation = citationContents
      .filter(ref => typeof ref === "object")
      .map(addRef);

    const script = doc.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonld, null, 2);
    doc.head.appendChild(script);
  }

  /**
   * Turn editors and authors into a list of JSON-LD relationships
   */
  function addPerson({ name, url, mailto, company, companyURL }) {
    const ed = {
      type: "Person",
      name,
      url,
      "foaf:mbox": mailto,
    };
    if (company || companyURL) {
      ed.worksFor = {
        name: company,
        url: companyURL,
      };
    }
    return ed;
  }

  /**
   * Create a reference URL from the ref
   */
  function addRef(ref) {
    const { href: id, title: name, href: url } = ref;
    const jsonld = {
      id,
      type: "TechArticle",
      name,
      url,
    };
    if (ref.authors) {
      jsonld.creator = ref.authors.map(a => ({ name: a }));
    }
    if (ref.rawDate) {
      jsonld.publishedDate = ref.rawDate;
    }
    if (ref.isbn) {
      jsonld.identifier = ref.isbn;
    }
    if (ref.publisher) {
      jsonld.publisher = { name: ref.publisher };
    }
    return jsonld;
  }

  var seo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$r,
    requiresCanonicalLink: requiresCanonicalLink,
    run: run$p
  });

  /*
  One Light for ReSpec, with better color contrast
  Adapted from Atom One Light by Daniel Gamage (https://github.com/highlightjs/highlight.js/blob/c0b6ddbaaf7/src/styles/atom-one-light.css>
  Original One Light Syntax theme from https://github.com/atom/one-light-syntax
  */

  const css$8 = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$9 = css$8`
.hljs {
  --base: #fafafa;
  --mono-1: #383a42;
  --mono-2: #686b77;
  --mono-3: #717277;
  --hue-1: #0b76c5;
  --hue-2: #336ae3;
  --hue-3: #a626a4;
  --hue-4: #42803c;
  --hue-5: #ca4706;
  --hue-5-2: #c91243;
  --hue-6: #986801;
  --hue-6-2: #9a6a01;
}

/* There's no way to adapt this to "manual" theme toggle yet. */
@media (prefers-color-scheme: dark) {
  .hljs {
    --base: #282c34;
    --mono-1: #abb2bf;
    --mono-2: #818896;
    --mono-3: #5c6370;
    --hue-1: #56b6c2;
    --hue-2: #61aeee;
    --hue-3: #c678dd;
    --hue-4: #98c379;
    --hue-5: #e06c75;
    --hue-5-2: #be5046;
    --hue-6: #d19a66;
    --hue-6-2: #e6c07b;
  }
}

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #383a42;
  color: var(--mono-1, #383a42);
  background: #fafafa;
  background: var(--base, #fafafa);
}

.hljs-comment,
.hljs-quote {
  color: #717277;
  color: var(--mono-3, #717277);
  font-style: italic;
}

.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #a626a4;
  color: var(--hue-3, #a626a4);
}

.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #ca4706;
  color: var(--hue-5, #ca4706);
  font-weight: bold;
}

.hljs-literal {
  color: #0b76c5;
  color: var(--hue-1, #0b76c5);
}

.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta-string {
  color: #42803c;
  color: var(--hue-4, #42803c);
}

.hljs-built_in,
.hljs-class .hljs-title {
  color: #9a6a01;
  color: var(--hue-6-2, #9a6a01);
}

.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #986801;
  color: var(--hue-6, #986801);
}

.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #336ae3;
  color: var(--hue-2, #336ae3);
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-link {
  text-decoration: underline;
}
`;

  /**
   * @param {string} path
   */
  async function fetchBase(path) {
    const response = await fetch(new URL(`../../${path}`, (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('respec-w3c.js', document.baseURI).href)));
    return await response.text();
  }

  // @ts-check
  /**
   * Module core/worker
   *
   * Exports a Web Worker for ReSpec, allowing for
   * multi-threaded processing of things.
   */
  const name$q = "core/worker";
  // Opportunistically preload syntax highlighter
  /** @type ResourceHintOption */
  const hint = {
    hint: "preload",
    href: "https://www.w3.org/Tools/respec/respec-highlight",
    as: "script",
  };
  const link = createResourceHint(hint);
  document.head.appendChild(link);

  async function loadWorkerScript() {
    try {
      return (await Promise.resolve().then(function () { return respecWorker$1; })).default;
    } catch {
      return fetchBase("worker/respec-worker.js");
    }
  }

  async function createWorker() {
    const workerScript = await loadWorkerScript();
    const workerURL = URL.createObjectURL(
      new Blob([workerScript], { type: "application/javascript" })
    );
    return new Worker(workerURL);
  }

  const workerPromise = createWorker();

  expose(
    name$q,
    workerPromise.then(worker => ({ worker }))
  );

  // @ts-check
  /**
   * Module core/highlight
   *
   * Performs syntax highlighting to all pre and code elements.
   */
  const name$p = "core/highlight";

  const nextMsgId = msgIdGenerator("highlight");

  function getLanguageHint(classList) {
    return Array.from(classList)
      .filter(item => item !== "highlight" && item !== "nolinks")
      .map(item => item.toLowerCase());
  }

  async function highlightElement(elem) {
    elem.setAttribute("aria-busy", "true");
    const languages = getLanguageHint(elem.classList);
    let response;
    try {
      response = await sendHighlightRequest(elem.innerText, languages);
    } catch (err) {
      console.error(err);
      return;
    }
    const { language, value } = response;
    switch (elem.localName) {
      case "pre":
        elem.classList.remove(language);
        elem.innerHTML = `<code class="hljs${
        language ? ` ${language}` : ""
      }">${value}</code>`;
        if (!elem.classList.length) elem.removeAttribute("class");
        break;
      case "code":
        elem.innerHTML = value;
        elem.classList.add("hljs");
        if (language) elem.classList.add(language);
        break;
    }
    elem.setAttribute("aria-busy", "false");
  }

  async function sendHighlightRequest(code, languages) {
    const msg = {
      action: "highlight",
      code,
      id: nextMsgId(),
      languages,
    };
    const worker = await workerPromise;
    worker.postMessage(msg);
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Timed out waiting for highlight."));
      }, 4000);
      worker.addEventListener("message", function listener(ev) {
        const {
          data: { id, language, value },
        } = ev;
        if (id !== msg.id) return; // not for us!
        worker.removeEventListener("message", listener);
        clearTimeout(timeoutId);
        resolve({ language, value });
      });
    });
  }

  async function run$o(conf) {
    // Nothing to highlight
    if (conf.noHighlightCSS) return;
    const highlightables = [
      ...document.querySelectorAll(`
    pre:not(.idl):not(.nohighlight) > code:not(.nohighlight),
    pre:not(.idl):not(.nohighlight),
    code.highlight
  `),
    ].filter(
      // Filter pre's that contain code
      elem => elem.localName !== "pre" || !elem.querySelector("code")
    );
    // Nothing to highlight
    if (!highlightables.length) {
      return;
    }
    const promisesToHighlight = highlightables
      .filter(elem => elem.textContent.trim())
      .map(highlightElement);
    document.head.appendChild(
      html`<style>
      ${css$9}
    </style>`
    );
    await Promise.all(promisesToHighlight);
  }

  var highlight = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$p,
    run: run$o
  });

  // @ts-check
  /**
   * Module core/data-tests
   *
   * Allows specs to link to test files in a test suite, by adding `details` of where
   * particular tests for a testable assertion can be found.
   *
   * `data-tests` takes a space separated list of URLs, e.g. data-test="foo.html bar.html".
   *
   * Docs: https://respec.org/doc/#data-tests
   */
  const localizationStrings$c = {
    en: {
      missing_test_suite_uri: docLink`Found tests in your spec, but missing ${"[testSuiteURI]"} in your ReSpec config.`,
      tests: "tests",
      test: "test",
    },
    ja: {
      missing_test_suite_uri: docLink`この仕様内にテストの項目を検出しましたが，ReSpec の設定に ${"[testSuiteURI]"} が見つかりません．`,
      tests: "テスト",
      test: "テスト",
    },
    de: {
      missing_test_suite_uri: docLink`Die Spezifikation enthält Tests, aber in der ReSpec-Konfiguration ist keine ${"[testSuiteURI]"} angegeben.`,
      tests: "Tests",
      test: "Test",
    },
    zh: {
      missing_test_suite_uri: docLink`本规范中包含测试，但在 ReSpec 配置中缺少 ${"[testSuiteURI]"}。`,
      tests: "测试",
      test: "测试",
    },
  };

  const l10n$c = getIntlData(localizationStrings$c);

  const name$o = "core/data-tests";

  function toListItem(href) {
    const emojiList = [];
    const [testFile] = new URL(href).pathname.split("/").reverse();
    const testParts = testFile.split(".");
    let [testFileName] = testParts;

    const isSecureTest = testParts.find(part => part === "https");
    if (isSecureTest) {
      const requiresConnectionEmoji = document.createElement("span");
      requiresConnectionEmoji.textContent = "🔒";
      requiresConnectionEmoji.setAttribute(
        "aria-label",
        "requires a secure connection"
      );
      requiresConnectionEmoji.setAttribute("title", "Test requires HTTPS");
      testFileName = testFileName.replace(".https", "");
      emojiList.push(requiresConnectionEmoji);
    }

    const isManualTest = testFileName
      .split(".")
      .join("-")
      .split("-")
      .find(part => part === "manual");
    if (isManualTest) {
      const manualPerformEmoji = document.createElement("span");
      manualPerformEmoji.textContent = "💪";
      manualPerformEmoji.setAttribute(
        "aria-label",
        "the test must be run manually"
      );
      manualPerformEmoji.setAttribute("title", "Manual test");
      testFileName = testFileName.replace("-manual", "");
      emojiList.push(manualPerformEmoji);
    }

    const testList = html`
    <li>
      <a href="${href}">${testFileName}</a>
      ${emojiList}
    </li>
  `;
    return testList;
  }

  function run$n(conf) {
    /** @type {NodeListOf<HTMLElement>} */
    const elems = document.querySelectorAll("[data-tests]");
    const testables = [...elems].filter(elem => elem.dataset.tests);

    if (!testables.length) {
      return;
    }
    if (!conf.testSuiteURI) {
      showError(l10n$c.missing_test_suite_uri, name$o);
      return;
    }

    for (const elem of testables) {
      const tests = elem.dataset.tests.split(/,/gm).map(url => url.trim());
      const testURLs = toTestURLs(tests, conf.testSuiteURI, elem);
      handleDuplicates(testURLs, elem);
      const details = toHTML$1(testURLs);
      elem.append(details);
    }
  }

  /**
   * @param {string[]} tests
   * @param {string} testSuiteURI
   * @param {HTMLElement} elem
   */
  function toTestURLs(tests, testSuiteURI, elem) {
    return tests
      .map(test => {
        try {
          return new URL(test, testSuiteURI).href;
        } catch {
          const msg = docLink`Invalid URL in ${"[data-tests]"} attribute: ${test}.`;
          showWarning(msg, name$o, { elements: [elem] });
        }
      })
      .filter(href => href);
  }

  /**
   * @param {string[]} testURLs
   * @param {HTMLElement} elem
   */
  function handleDuplicates(testURLs, elem) {
    const duplicates = testURLs.filter(
      (link, i, self) => self.indexOf(link) !== i
    );
    if (duplicates.length) {
      const msg = docLink`Duplicate tests found in the ${"[data-tests]"} attribute.`;
      const tests = codedJoinAnd(duplicates, { quotes: true });
      const hint = docLink`To fix, remove duplicates from ${"[data-tests]"}: ${tests}.`;
      showWarning(msg, name$o, { hint, elements: [elem] });
    }
  }

  /**
   * @param {string[]} testURLs
   */
  function toHTML$1(testURLs) {
    const uniqueList = [...new Set(testURLs)];
    const details = html`
    <details class="respec-tests-details removeOnSave">
      <summary>tests: ${uniqueList.length}</summary>
      <ul>
        ${uniqueList.map(toListItem)}
      </ul>
    </details>
  `;
    return details;
  }

  var dataTests = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$o,
    run: run$n
  });

  // @ts-check
  const name$n = "core/list-sorter";

  function makeSorter(direction) {
    const order = direction === "ascending" ? 1 : -1;
    return ({ textContent: a }, { textContent: b }) => {
      return order * a.trim().localeCompare(b.trim());
    };
  }
  /**
   * Shallow sort list items in OL, and UL elements.
   *
   * @param {HTMLUListElement} elem
   * @returns {DocumentFragment}
   */
  function sortListItems(elem, dir) {
    const elements = [...elem.querySelectorAll(":scope > li")];
    const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
      frag.appendChild(elem);
      return frag;
    }, document.createDocumentFragment());
    return sortedElements;
  }

  /**
   * Shallow sort a definition list based on its definition terms (dt) elements.
   *
   * @param {HTMLDListElement} dl
   * @returns {DocumentFragment}
   */
  function sortDefinitionTerms(dl, dir) {
    const elements = [...dl.querySelectorAll(":scope > dt")];
    const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
      const { nodeType, nodeName } = elem;
      const children = document.createDocumentFragment();
      let { nextSibling: next } = elem;
      while (next) {
        if (!next.nextSibling) {
          break;
        }
        children.appendChild(next.cloneNode(true));
        const { nodeType: nextType, nodeName: nextName } = next.nextSibling;
        const isSameType = nextType === nodeType && nextName === nodeName;
        if (isSameType) {
          break;
        }
        next = next.nextSibling;
      }
      children.prepend(elem.cloneNode(true));
      frag.appendChild(children);
      return frag;
    }, document.createDocumentFragment());
    return sortedElements;
  }

  function run$m() {
    /** @type {NodeListOf<HTMLElement>} */
    const sortables = document.querySelectorAll("[data-sort]");
    for (const elem of sortables) {
      let sortedElems;
      const dir = elem.dataset.sort || "ascending";
      switch (elem.localName) {
        case "dl": {
          const definition = /** @type {HTMLDListElement} */ (elem);
          sortedElems = sortDefinitionTerms(definition, dir);
          break;
        }
        case "ol":
        case "ul": {
          const list = /** @type {HTMLUListElement} */ (elem);
          sortedElems = sortListItems(list, dir);
          break;
        }
        default: {
          const msg = `ReSpec can't sort ${elem.localName} elements.`;
          showWarning(msg, name$n, { elements: [elem] });
        }
      }
      if (sortedElems) {
        const range = document.createRange();
        range.selectNodeContents(elem);
        range.deleteContents();
        elem.appendChild(sortedElems);
      }
    }
  }

  var listSorter = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$n,
    run: run$m,
    sortDefinitionTerms: sortDefinitionTerms,
    sortListItems: sortListItems
  });

  const css$6 = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$7 = css$6`
var:hover {
  text-decoration: underline;
  cursor: pointer;
}

var.respec-hl {
  color: var(--color, #000);
  background-color: var(--bg-color);
  box-shadow: 0 0 0px 2px var(--bg-color);
}

@media (prefers-color-scheme: dark) {
  var.respec-hl {
    filter: saturate(0.9) brightness(0.9)
  }
}

/* highlight colors
  https://github.com/w3c/tr-design/issues/152
*/
var.respec-hl-c1 {
  --bg-color: #f4d200;
}

var.respec-hl-c2 {
  --bg-color: #ff87a2;
}

var.respec-hl-c3 {
  --bg-color: #96e885;
}

var.respec-hl-c4 {
  --bg-color: #3eeed2;
}

var.respec-hl-c5 {
  --bg-color: #eacfb6;
}

var.respec-hl-c6 {
  --bg-color: #82ddff;
}

var.respec-hl-c7 {
  --bg-color: #ffbcf2;
}

@media print {
  var.respec-hl {
    background: none;
    color: #000;
    box-shadow: unset;
  }
}
`;

  // @ts-check
  /**
   * Module core/highlight-vars
   * Highlights occurrences of a <var> within the algorithm or the encompassing section on click.
   * Set `conf.highlightVars = true` to enable.
   * Removes highlights from <var> if clicked anywhere else.
   * All is done while keeping in mind that exported html stays clean
   * on export.
   */

  const name$m = "core/highlight-vars";

  async function run$l(conf) {
    if (!conf.highlightVars) {
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.textContent = css$7;
    document.head.appendChild(styleElement);

    const script = document.createElement("script");
    script.id = "respec-highlight-vars";
    script.textContent = await loadScript$1();
    document.body.append(script);

    // remove highlights, cleanup empty class/style attributes
    sub("beforesave", (/** @type {Document} */ outputDoc) => {
      outputDoc.querySelectorAll("var.respec-hl").forEach(el => {
        const classesToRemove = [...el.classList.values()].filter(cls =>
          cls.startsWith("respec-hl")
        );
        el.classList.remove(...classesToRemove);
        if (!el.classList.length) el.removeAttribute("class");
      });
    });
  }

  async function loadScript$1() {
    try {
      return (await Promise.resolve().then(function () { return highlightVars_runtime$1; })).default;
    } catch {
      return fetchBase("./src/core/highlight-vars.runtime.js");
    }
  }

  var highlightVars = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$m,
    run: run$l
  });

  const css$4 = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$5 = css$4`
var {
  position: relative;
  cursor: pointer;
}

var[data-type]::before,
var[data-type]::after {
  position: absolute;
  left: 50%;
  top: -6px;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

/* the triangle or arrow or caret or whatever */
var[data-type]::before {
  content: "";
  transform: translateX(-50%);
  border-width: 4px 6px 0 6px;
  border-style: solid;
  border-color: transparent;
  border-top-color: #222;
}

/* actual text */
var[data-type]::after {
  content: attr(data-type);
  transform: translateX(-50%) translateY(-100%);
  background: #222;
  text-align: center;
  /* additional styling */
  font-family: "Dank Mono", "Fira Code", monospace;
  font-style: normal;
  padding: 6px;
  border-radius: 3px;
  color: #daca88;
  text-indent: 0;
  font-weight: normal;
}

var[data-type]:hover::after,
var[data-type]:hover::before {
  opacity: 1;
}
`;

  // @ts-check
  /**
   * Module core/data-type
   * Propagates data type of a <var> to subsequent instances within a section.
   * Also adds the CSS for the data type tooltip.
   * Set `conf.highlightVars = true` to enable.
   */

  const name$l = "core/data-type";

  function run$k(conf) {
    if (!conf.highlightVars) {
      return;
    }

    const style = document.createElement("style");
    style.textContent = css$5;
    document.head.appendChild(style);

    let section = null;
    const varMap = new Map();
    /** @type {NodeListOf<HTMLElement>} */
    const variables = document.querySelectorAll("section var");
    for (const varElem of variables) {
      const currentSection = varElem.closest("section");
      if (section !== currentSection) {
        section = currentSection;
        varMap.clear();
      }
      if (varElem.dataset.type) {
        varMap.set(varElem.textContent.trim(), varElem.dataset.type);
        continue;
      }
      const type = varMap.get(varElem.textContent.trim());
      if (type) varElem.dataset.type = type;
    }
  }

  var dataType = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$l,
    run: run$k
  });

  /* For assertions in lists containing algorithms */
  const css$2 = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$3 = css$2`
:root {
  --assertion-border: #aaa;
  --assertion-bg: #eee;
  --assertion-text: black;
}

.assert {
  border-left: 0.5em solid #aaa;
  padding: 0.3em;
  border-color: #aaa;
  border-color: var(--assertion-border);
  background: #eee;
  background: var(--assertion-bg);
  color: black;
  color: var(--assertion-text);
}

/* There's no way to adapt this to "manual" theme toggle yet. */
@media (prefers-color-scheme: dark) {
  :root {
    --assertion-border: #444;
    --assertion-bg: var(--borderedblock-bg);
    --assertion-text: var(--text);
  }
}
`;

  // @ts-check
  /**
  Currently used only for adding 'assert' class to algorithm lists
  */

  const name$k = "core/algorithms";

  function run$j() {
    const elements = Array.from(
      /** @type {NodeListOf<HTMLLIElement>} */ (
        document.querySelectorAll("ol.algorithm li")
      )
    ).filter(li => li.textContent.trim().startsWith("Assert: "));
    if (!elements.length) {
      return;
    }

    for (const li of elements) {
      li.classList.add("assert");

      // Link "Assert" to https://infra.spec.whatwg.org/#assert
      const textNode = li.firstChild;
      if (
        textNode instanceof Text &&
        textNode.textContent.startsWith("Assert: ")
      ) {
        textNode.textContent = textNode.textContent.replace("Assert: ", "");
        li.prepend(
          html`<a href="https://infra.spec.whatwg.org/#assert">Assert</a>`,
          ": "
        );
      }
    }

    const style = document.createElement("style");
    style.textContent = css$3;
    document.head.appendChild(style);
  }

  var algorithms = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$k,
    run: run$j
  });

  // @ts-check
  // expands empty anchors based on their context

  const name$j = "core/anchor-expander";

  function run$i() {
    /** @type {NodeListOf<HTMLElement>} */
    const anchorElements = document.querySelectorAll(
      "a[href^='#']:not(.self-link):not([href$='the-empty-string'])"
    );
    const anchors = [...anchorElements].filter(a => a.textContent.trim() === "");
    for (const a of anchors) {
      const id = a.getAttribute("href").slice(1);
      const matchingElement = document.getElementById(id);
      if (!matchingElement) {
        a.textContent = a.getAttribute("href");
        const msg = `Couldn't expand inline reference. The id "${id}" is not in the document.`;
        const title = `No matching id in document: ${id}.`;
        showError(msg, name$j, { title, elements: [a] });
        continue;
      }
      switch (matchingElement.localName) {
        case "h6":
        case "h5":
        case "h4":
        case "h3":
        case "h2": {
          processHeading(matchingElement, a);
          break;
        }
        case "section": {
          // find first heading in the section
          processSection(matchingElement, id, a);
          break;
        }
        case "figure": {
          processFigure(matchingElement, id, a);
          break;
        }
        case "table": {
          processTable(matchingElement, id, a);
          break;
        }
        case "aside":
        case "div": {
          processBox(matchingElement, id, a);
          break;
        }
        default: {
          a.textContent = a.getAttribute("href");
          const msg = "ReSpec doesn't support expanding this kind of reference.";
          const title = `Can't expand "#${id}".`;
          showError(msg, name$j, { title, elements: [a] });
        }
      }
      localize(matchingElement, a);
      a.normalize();
    }
  }

  function processBox(matchingElement, id, a) {
    const selfLink = matchingElement.querySelector(".marker .self-link");
    if (!selfLink) {
      a.textContent = a.getAttribute("href");
      const msg = `Found matching element "${id}", but it has no title or marker.`;
      const title = "Missing title.";
      showError(msg, name$j, { title, elements: [a] });
      return;
    }
    const copy = makeSafeCopy(selfLink);
    a.append(...copy.childNodes);
    a.classList.add("box-ref");
  }

  function processFigure(matchingElement, id, a) {
    const figcaption = matchingElement.querySelector("figcaption");
    if (!figcaption) {
      a.textContent = a.getAttribute("href");
      const msg = `Found matching figure "${id}", but figure is lacking a \`<figcaption>\`.`;
      const title = "Missing figcaption in referenced figure.";
      showError(msg, name$j, { title, elements: [a] });
      return;
    }
    // get figure label and remove the fig-number class
    const children = [
      ...makeSafeCopy(figcaption.querySelector(".self-link")).childNodes,
    ].map(node => {
      // @ts-ignore
      node.classList?.remove("figno");
      return node;
    });
    a.append(...children);
    a.classList.add("fig-ref");
    const figTitle = figcaption.querySelector(".fig-title");
    if (!a.hasAttribute("title") && figTitle) {
      a.title = norm(figTitle.textContent);
    }
  }

  function processTable(matchingTable, id, a) {
    if (!matchingTable.classList.contains("numbered")) {
      return;
    }
    const caption = matchingTable.querySelector("caption");
    if (!caption) {
      a.textContent = a.getAttribute("href");
      const msg = `Found matching table "${id}", but table is lacking a \`<caption>\`.`;
      const title = "Missing caption in referenced table.";
      showError(msg, name$j, { title, elements: [a] });
      return;
    }

    // get table label and remove the fig-number class
    const children = [
      ...makeSafeCopy(caption.querySelector(".self-link")).childNodes,
    ].map(node => {
      // @ts-ignore
      // @ts-ignore
      node.classList?.remove("tableno");
      return node;
    });
    a.append(...children);
    a.classList.add("table-ref");
    const tableTitle = caption.querySelector(".table-title");
    if (!a.hasAttribute("title") && tableTitle) {
      a.title = norm(tableTitle.textContent);
    }
  }

  function processSection(matchingElement, id, a) {
    const heading = matchingElement.querySelector("h6, h5, h4, h3, h2");
    if (!heading) {
      a.textContent = a.getAttribute("href");
      const msg =
        "Found matching section, but the section was lacking a heading element.";
      const title = `No matching id in document: "${id}".`;
      showError(msg, name$j, { title, elements: [a] });
      return;
    }
    processHeading(heading, a);
    localize(heading, a);
  }

  function processHeading(heading, a) {
    const hadSelfLink = heading.querySelector(".self-link");
    const children = [...makeSafeCopy(heading).childNodes].filter(
      // @ts-ignore
      node => !node.classList || !node.classList.contains("self-link")
    );
    a.append(...children);
    if (hadSelfLink) a.prepend("§\u00A0");
    a.classList.add("sec-ref");
    // Trim stray whitespace of the last text node (see bug #3265).
    if (a.lastChild.nodeType === Node.TEXT_NODE) {
      a.lastChild.textContent = a.lastChild.textContent.trimEnd();
    }
    // Replace all inner anchors for span elements (see bug #3136)
    a.querySelectorAll("a").forEach(a => {
      const span = renameElement(a, "span");
      // Remove the old attributes
      for (const attr of [...span.attributes]) {
        span.removeAttributeNode(attr);
      }
    });
  }

  function localize(matchingElement, newElement) {
    for (const attrName of ["dir", "lang"]) {
      // Already set on element, don't override.
      if (newElement.hasAttribute(attrName)) continue;

      // Closest in tree setting the attribute
      const matchingClosest = matchingElement.closest(`[${attrName}]`);
      if (!matchingClosest) continue;

      // Closest to reference setting the attribute
      const newClosest = newElement.closest(`[${attrName}]`);

      // It's the same, so already inherited from closest (probably HTML element or body).
      if (
        newClosest &&
        newClosest.getAttribute(attrName) ===
          matchingClosest.getAttribute(attrName)
      )
        continue;
      // Otherwise, set it.
      newElement.setAttribute(attrName, matchingClosest.getAttribute(attrName));
    }
  }

  var anchorExpander = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$j,
    run: run$i
  });

  /* dfn popup panel that list all local references to a dfn */
  /**
   * TODO: Revert changes due to https://github.com/speced/respec/pull/2888 when
   * https://github.com/w3c/css-validator/pull/111 is fixed.
   */
  const css = String.raw;

  // Prettier ignore only to keep code indented from level 0.
  // prettier-ignore
  var css$1 = css`
dfn {
  cursor: pointer;
}

.dfn-panel {
  position: absolute;
  z-index: 35;
  min-width: 300px;
  max-width: 500px;
  padding: 0.5em 0.75em;
  margin-top: 0.6em;
  font-family: "Helvetica Neue", sans-serif;
  font-size: small;
  background: #fff;
  background: var(--indextable-hover-bg, #fff);
  color: black;
  color: var(--text, black);
  box-shadow: 0 1em 3em -0.4em rgba(0, 0, 0, 0.3),
    0 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1em 3em -0.4em var(--tocsidebar-shadow, rgba(0, 0, 0, 0.3)),
    0 0 1px 1px var(--tocsidebar-shadow, rgba(0, 0, 0, 0.05));
  border-radius: 2px;
}
/* Triangle/caret */
.dfn-panel:not(.docked) > .caret {
  position: absolute;
  top: -9px;
}
.dfn-panel:not(.docked) > .caret::before,
.dfn-panel:not(.docked) > .caret::after {
  content: "";
  position: absolute;
  border: 10px solid transparent;
  border-top: 0;
  border-bottom: 10px solid #fff;
  border-bottom-color: var(--indextable-hover-bg, #fff);
  top: 0;
}
.dfn-panel:not(.docked) > .caret::before {
  border-bottom: 9px solid #a2a9b1;
  /* TODO: need slightly darker shade */
  border-bottom-color: var(--indextable-hover-bg, #a2a9b1);
}

.dfn-panel * {
  margin: 0;
}

.dfn-panel b {
  display: block;
  color: #000;
  color: var(--text, #000);
  margin-top: 0.25em;
}

.dfn-panel ul a[href] {
  color: #333;
  color: var(--text, #333);
}

.dfn-panel > div {
  display: flex;
}

.dfn-panel a.self-link {
  font-weight: bold;
  margin-right: auto;
}

.dfn-panel .marker {
  padding: 0.1em;
  margin-left: 0.5em;
  border-radius: 0.2em;
  text-align: center;
  white-space: nowrap;
  font-size: 90%;
  color: #040b1c;
}

.dfn-panel .marker.dfn-exported {
  background: #d1edfd;
  box-shadow: 0 0 0 0.125em #1ca5f940;
}
.dfn-panel .marker.idl-block {
  background: #8ccbf2;
  box-shadow: 0 0 0 0.125em #0670b161;
}

.dfn-panel a:not(:hover) {
  text-decoration: none !important;
  border-bottom: none !important;
}

.dfn-panel a[href]:hover {
  border-bottom-width: 1px;
}

.dfn-panel ul {
  padding: 0;
}

.dfn-panel li {
  margin-left: 1em;
}

.dfn-panel.docked {
  position: fixed;
  left: 0.5em;
  top: unset;
  bottom: 2em;
  margin: 0 auto;
  /* 0.75em from padding (x2), 0.5em from left position, 0.2em border (x2) */
  max-width: calc(100vw - 0.75em * 2 - 0.5em - 0.2em * 2);
  max-height: 30vh;
  overflow: auto;
}
`;

  // @ts-check
  // Constructs "dfn panels" which show all the local references to a dfn and a
  // self link to the selected dfn. Based on Bikeshed's dfn panels at
  // https://github.com/tabatkins/bikeshed/blob/ef44162c2e/bikeshed/dfnpanels.py

  const name$i = "core/dfn-panel";

  async function run$h() {
    document.head.insertBefore(
      html`<style>
      ${css$1}
    </style>`,
      document.querySelector("link")
    );

    /** @type {NodeListOf<HTMLElement>} */
    const elems = document.querySelectorAll(
      "dfn[id]:not([data-cite]), #index-defined-elsewhere .index-term"
    );
    const panels = document.createDocumentFragment();
    for (const el of elems) {
      panels.append(createPanel(el));
      // Make it possible to reach el by tabbing,
      // allowing keyboard action as needed.
      el.tabIndex = 0;
      el.setAttribute("aria-haspopup", "dialog");
    }
    if (document.body.querySelector("script")) {
      document.body.querySelector("script").before(panels);
    } else {
      document.body.append(panels);
    }

    const script = document.createElement("script");
    script.id = "respec-dfn-panel";
    script.textContent = await loadScript();
    document.body.append(script);
  }

  /** @param {HTMLElement} dfn */
  function createPanel(dfn) {
    const { id } = dfn;
    const href = dfn.dataset.href || `#${id}`;
    /** @type {NodeListOf<HTMLAnchorElement>} */
    const links = document.querySelectorAll(`a[href="${href}"]:not(.index-term)`);

    const panelId = `dfn-panel-for-${dfn.id}`;
    const definition = dfn.getAttribute("aria-label") || norm(dfn.textContent);
    /** @type {HTMLElement} */
    const panel = html`
    <div
      class="dfn-panel"
      id="${panelId}"
      hidden
      role="dialog"
      aria-modal="true"
      aria-label="Links in this document to definition: ${definition}"
    >
      <span class="caret"></span>
      <div>
        <a
          class="self-link"
          href="${href}"
          aria-label="Permalink for definition: ${definition}. Activate to close this dialog."
          >Permalink</a
        >
        ${dfnExportedMarker(dfn)} ${idlMarker(dfn, links)}
      </div>
      <p><b>Referenced in:</b></p>
      ${referencesToHTML(id, links)}
    </div>
  `;
    return panel;
  }

  /** @param {HTMLElement} dfn */
  function dfnExportedMarker(dfn) {
    if (!dfn.matches("dfn[data-export]")) return null;
    return html`<span
    class="marker dfn-exported"
    title="Definition can be referenced by other specifications"
    >exported</span
  >`;
  }

  /**
   * @param {HTMLElement} dfn
   * @param {NodeListOf<HTMLAnchorElement>} links
   */
  function idlMarker(dfn, links) {
    if (!dfn.hasAttribute("data-idl")) return null;

    for (const anchor of links) {
      if (anchor.dataset.linkType !== dfn.dataset.dfnType) continue;
      const parentIdlBlock = anchor.closest("pre.idl");
      if (parentIdlBlock && parentIdlBlock.id) {
        const href = `#${parentIdlBlock.id}`;
        return html`<a
        href="${href}"
        class="marker idl-block"
        title="Jump to IDL declaration"
        >IDL</a
      >`;
      }
    }
    return null;
  }

  /**
   * @param {string} id dfn id
   * @param {NodeListOf<HTMLAnchorElement>} links
   * @returns {HTMLUListElement}
   */
  function referencesToHTML(id, links) {
    if (!links.length) {
      return html`<ul>
      <li>Not referenced in this document.</li>
    </ul>`;
    }

    /** @type {Map<string, string[]>} */
    const titleToIDs = new Map();
    links.forEach((link, i) => {
      const linkID = link.id || `ref-for-${id}-${i + 1}`;
      if (!link.id) link.id = linkID;
      const title = getReferenceTitle(link);
      const ids = titleToIDs.get(title) || titleToIDs.set(title, []).get(title);
      ids.push(linkID);
    });

    /**
     * Returns a list that is easier to render in `listItemToHTML`.
     * @param {[string, string[]]} entry an entry from `titleToIDs`
     * @returns {{ title: string, text: string, id: string, }[]} The first list item contains
     * title from `getReferenceTitle`, rest of items contain strings like `(2)`,
     * `(3)` as title.
     */
    const toLinkProps = ([title, ids]) => {
      return [{ title, id: ids[0], text: title }].concat(
        ids.slice(1).map((id, i) => ({
          title: `Reference ${i + 2}`,
          text: `(${i + 2})`,
          id,
        }))
      );
    };

    /**
     * @param {[string, string[]]} entry
     * @returns {HTMLLIElement}
     */
    const listItemToHTML = entry => {
      return html`<li>
      ${toLinkProps(entry).map(link => {
        return html`<a href="#${link.id}" title="${link.title}">${link.text}</a
          >${" "}`;
      })}
    </li>`;
    };

    return html`<ul>
    ${[...titleToIDs].map(listItemToHTML)}
  </ul>`;
  }

  /** @param {HTMLAnchorElement} link */
  function getReferenceTitle(link) {
    const section = link.closest("section");
    if (!section) return null;
    const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
    if (!heading) return null;
    return `§ ${norm(heading.textContent)}`;
  }

  async function loadScript() {
    try {
      return (await Promise.resolve().then(function () { return dfnPanel_runtime$1; })).default;
    } catch {
      return fetchBase("./src/core/dfn-panel.runtime.js");
    }
  }

  var dfnPanel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$i,
    run: run$h
  });

  // @ts-check
  /**
   * Fetches commits between two commitish (tag or commit) - `from` and `to=HEAD`
   * and shows them as a list of "changes during" those commitish. If a filter
   * function is provided by the user, it is used to filter the commits that are
   * to be shown. Otherwise, all commits are shown.
   *
   * @typedef {{message: string, hash: string}} Commit
   */

  const name$h = "rs-changelog";

  const element = class ChangelogElement extends HTMLElement {
    constructor() {
      super();
      this.props = {
        from: this.getAttribute("from"),
        to: this.getAttribute("to") || "HEAD",
        /** @type {(commit: Commit) => boolean} */
        filter:
          typeof window[this.getAttribute("filter")] === "function"
            ? window[this.getAttribute("filter")]
            : () => true,
      };
    }

    connectedCallback() {
      const { from, to, filter } = this.props;
      html.bind(this)`
      <ul>
      ${{
        any: fetchCommits(from, to, filter)
          .then(commits => toHTML(commits))
          .catch(error =>
            showError(error.message, name$h, { elements: [this], cause: error })
          )
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
    }
  };

  async function fetchCommits(from, to, filter) {
    /** @type {Commit[]} */
    let commits;
    try {
      const gh = await github;
      if (!gh) {
        throw new Error("`respecConfig.github` is not set");
      }
      const url = new URL("commits", `${gh.apiBase}/${gh.fullName}/`);
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);

      const res = await fetch(url.href);
      if (!res.ok) {
        throw new Error(
          `Request to ${url} failed with status code ${res.status}`
        );
      }
      commits = await res.json();
      if (!commits.length) {
        throw new Error(`No commits between ${from}..${to}.`);
      }
      commits = commits.filter(filter);
    } catch (error) {
      const msg = `Error loading commits from GitHub. ${error.message}`;
      throw new Error(msg, { cause: error });
    }
    return commits;
  }

  async function toHTML(commits) {
    const { repoURL } = await github;
    return commits.map(commit => {
      const [message, prNumber = null] = commit.message.split(/\(#(\d+)\)/, 2);
      const commitURL = `${repoURL}commit/${commit.hash}`;
      const prURL = prNumber ? `${repoURL}pull/${prNumber}` : null;
      const pr = prNumber && html` (<a href="${prURL}">#${prNumber}</a>)`;
      return html`<li><a href="${commitURL}">${message.trim()}</a>${pr}</li>`;
    });
  }

  var changelog = /*#__PURE__*/Object.freeze({
    __proto__: null,
    element: element,
    name: name$h
  });

  // @ts-check
  /**
   * Registers custom elements and waits for them to finish their processing.
   *
   * Every custom element file exports:
   * - `name`: registered name of the custom element, prefixed with `rs-`.
   * - `element`: class defintion of the custom element.
   *
   * Every custom element must dispatch a CustomEvent 'done' that tells the
   * element has finished its processing, with or without errors.
   *
   * @typedef {{ name: string, element: CustomElementConstructor }} CustomElementDfn
   */

  /** @type {CustomElementDfn[]} */
  const CUSTOM_ELEMENTS = [changelog];

  const name$g = "core/custom-elements/index";

  async function run$g() {
    // prepare and register elements
    CUSTOM_ELEMENTS.forEach(el => {
      customElements.define(el.name, el.element);
    });

    // wait for each element to be ready
    const selectors = CUSTOM_ELEMENTS.map(el => el.name).join(", ");
    const elems = document.querySelectorAll(selectors);
    const readyPromises = [...elems].map(
      el => new Promise(res => el.addEventListener("done", res, { once: true }))
    );
    await Promise.all(readyPromises);
  }

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$g,
    run: run$g
  });

  // @ts-check
  /**
   * This module adds a "monetization" meta-tag to enable web-monetization.
   *
   * The meta-tag is added only to "live" documents, and is removed from generated
   * static documents.
   */

  const name$f = "core/web-monetization";

  function run$f(conf) {
    if (conf.monetization === false) {
      return;
    }
    const { monetization } = conf;

    const { removeOnSave, paymentPointer } = canonicalizeConfig(monetization);

    const cssClass = removeOnSave ? "removeOnSave" : null;
    document.head.append(
      html`<meta
      name="monetization"
      content="${paymentPointer}"
      class="${cssClass}"
    />`
    );
  }

  /**
   * @param {object|string} rawConfig
   * - {string} paymentPointer - The payment pointer to use.
   * - {boolean} removeOnSave - Whether to remove the meta tag when the document is saved.
   */
  function canonicalizeConfig(rawConfig) {
    const config = {
      paymentPointer: "$respec.org",
      removeOnSave: true,
    };
    switch (typeof rawConfig) {
      case "string":
        config.paymentPointer = rawConfig;
        break;
      case "object":
        if (rawConfig.paymentPointer) {
          config.paymentPointer = String(rawConfig.paymentPointer);
        }
        if (rawConfig.removeOnSave === false) {
          config.removeOnSave = false;
        }
        break;
    }
    return config;
  }

  var webMonetization = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$f,
    run: run$f
  });

  const name$e = "core/dfn-contract";

  function run$e() {
    addContractDefaults();
    addDefinitionPointers();
  }

  function addContractDefaults() {
    // Find all dfns that don't have a type and default them to "dfn".
    /** @type NodeListOf<HTMLElement> */
    const dfnsWithNoType = document.querySelectorAll(
      "dfn:is([data-dfn-type=''],:not([data-dfn-type]))"
    );
    for (const dfn of dfnsWithNoType) {
      dfn.dataset.dfnType = "dfn";
    }

    // Per "the contract", export all definitions, except where:
    //  - Explicitly marked with data-noexport.
    //  - The type is "dfn" and not explicitly marked for export (i.e., just a regular definition).
    //  - definitions was included via (legacy) data-cite="foo#bar".
    /** @type NodeListOf<HTMLElement> */
    const exportableDfns = document.querySelectorAll(
      "dfn:not([data-noexport], [data-export], [data-dfn-type='dfn'], [data-cite])"
    );
    for (const dfn of exportableDfns) {
      dfn.dataset.export = "";
    }
  }

  // - Sets data-defines on well-known definition content patterns
  function addDefinitionPointers() {
    // A dl with class hasdefinitions associated the dfn in each dt
    // the definition in the following sibling element
    /** @type NodeListOf<HTMLElement> */
    const describedDTs = document.querySelectorAll(
      "dl.definitions dt:has(dfn[data-dfn-type])"
    );
    for (const dt of describedDTs) {
      const dfnId = dt.querySelector("dfn[data-dfn-type]").id;
      const dfnContent = /** @type {HTMLElement | null} */ (
        dt.nextElementSibling
      );
      if (dfnContent && !dfnContent.dataset.defines && dfnId) {
        dfnContent.dataset.defines = `#${dfnId}`;
      }
    }

    // an element with class "definition" is marked as defining the term
    // found in the element
    /** @type NodeListOf<HTMLElement> */
    const definitionContainers = document.querySelectorAll(
      ".definition:has(dfn[data-dfn-type])"
    );
    for (const el of definitionContainers) {
      const dfn = el.querySelector("dfn[data-dfn-type]");
      if (dfn.id && !el.dataset.defines) {
        el.dataset.defines = `#${dfn.id}`;
      }
    }
  }

  var dfnContract = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$e,
    run: run$e
  });

  const name$d = "core/before-save";

  function run$d(conf) {
    if (!conf.beforeSave) return;

    if (
      !Array.isArray(conf.beforeSave) ||
      conf.beforeSave.some(
        el => typeof el !== "function" || el.constructor.name === "AsyncFunction"
      )
    ) {
      const msg = docLink`${"[beforeSave]"} configuration option must be an array of synchronous JS functions.`;
      showError(msg, name$d);
      return;
    }

    sub(
      "beforesave",
      documentElement => {
        performTransformations(conf.beforeSave, documentElement.ownerDocument);
      },
      { once: true }
    );
  }
  /**
   * @param {Array<Function>} transforms
   * @param {Document}
   */
  function performTransformations(transforms, doc) {
    let pos = 0;
    for (const fn of transforms) {
      try {
        fn(doc);
      } catch (err) {
        const nameOrPosition = `\`${fn.name}\`` || `at position ${pos}`;
        const msg = docLink`Function ${nameOrPosition}\` threw an error during processing of ${"[beforeSave]"}.`;
        const hint = "See developer console.";
        showError(msg, name$d, { hint, cause: err });
      } finally {
        pos++;
      }
    }
  }

  var beforeSave = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$d,
    run: run$d
  });

  // @ts-check
  /**
   * Checks whether the document has `<meta charset="utf-8">` properly.
   */

  const ruleName$b = "check-charset";
  const name$c = "core/linter-rules/check-charset";

  const localizationStrings$b = {
    en: {
      msg: `Document must only contain one \`<meta>\` tag with charset set to 'utf-8'`,
      hint: `Add this line in your document \`<head>\` section - \`<meta charset="utf-8">\` or set charset to "utf-8" if not set already.`,
    },
    zh: {
      msg: `文档只能包含一个 charset 属性为 utf-8 的 \`<meta>\` 标签`,
      hint: `将此行添加到文档的 \`<head>\` 部分—— \`<meta charset="utf-8">\` 或将 charset 设置为 utf-8（如果尚未设置）。`,
    },
  };
  const l10n$b = getIntlData(localizationStrings$b);

  function run$c(conf) {
    if (!conf.lint?.[ruleName$b]) {
      return;
    }

    /** @type {NodeListOf<HTMLMetaElement>} */
    const metas = document.querySelectorAll("meta[charset]");
    const val = [];
    for (const meta of metas) {
      val.push(meta.getAttribute("charset").trim().toLowerCase());
    }
    const utfExists = val.includes("utf-8");

    // only a single meta[charset] and is set to utf-8, correct case
    if (utfExists && metas.length === 1) {
      return;
    }
    // if more than one meta[charset] tag defined along with utf-8
    // or
    // no meta[charset] present in the document
    showWarning(l10n$b.msg, name$c, { hint: l10n$b.hint, elements: [...metas] });
  }

  var checkCharset = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$c,
    run: run$c
  });

  // @ts-check
  /**
   * Linter rule "check-punctuation". Makes sure the there are no punctuations missing at the end of a <p>.
   */

  const ruleName$a = "check-punctuation";
  const name$b = "core/linter-rules/check-punctuation";

  const punctuationMarks = [".", ":", "!", "?"];
  const humanMarks = punctuationMarks.map(mark => `"${mark}"`).join(", ");

  const localizationStrings$a = {
    en: {
      msg: "`p` elements should end with a punctuation mark.",
      hint: `Please make sure \`p\` elements end with one of: ${humanMarks}.`,
    },
  };
  const l10n$a = getIntlData(localizationStrings$a);

  function run$b(conf) {
    if (!conf.lint?.[ruleName$a]) {
      return;
    }

    // Check string ends with one of ., !, ?, :, ], or is empty.
    const punctuatingRegExp = new RegExp(
      `[${punctuationMarks.join("")}\\]]$|^ *$`,
      "m"
    );

    /** @type {NodeListOf<HTMLParagraphElement>} */
    const elems = document.querySelectorAll("p:not(#back-to-top,#w3c-state)");
    const offendingElements = [...elems].filter(
      elem => !punctuatingRegExp.test(elem.textContent.trim())
    );

    if (!offendingElements.length) {
      return;
    }
    showWarning(l10n$a.msg, name$b, { hint: l10n$a.hint, elements: offendingElements });
  }

  var checkPunctuation = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$b,
    run: run$b
  });

  // @ts-check
  /**
   * Linter rule "check-internal-slots".
   */

  const ruleName$9 = "check-internal-slots";
  const name$a = "core/linter-rules/check-internal-slots";

  const localizationStrings$9 = {
    en: {
      msg: "Internal slots should be preceded by a '.'",
      hint: "Add a '.' between the elements mentioned.",
    },
  };
  const l10n$9 = getIntlData(localizationStrings$9);

  function run$a(conf) {
    if (!conf.lint?.[ruleName$9]) {
      return;
    }

    /** @type {NodeListOf<HTMLAnchorElement>} */
    const elems = document.querySelectorAll("var+a");
    const offendingElements = [...elems].filter(
      ({ previousSibling: { nodeName } }) => {
        const isPrevVar = nodeName && nodeName === "VAR";
        return isPrevVar;
      }
    );

    if (!offendingElements.length) {
      return;
    }

    showWarning(l10n$9.msg, name$a, { hint: l10n$9.hint, elements: offendingElements });
  }

  var checkInternalSlots = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$a,
    run: run$a
  });

  // @ts-check
  /**
   * Linter rule "warn-local-ref".
   * Warns about href's that link to nonexistent id's in a spec
   */

  const ruleName$8 = "local-refs-exist";
  const name$9 = "core/linter-rules/local-refs-exist";

  const localizationStrings$8 = {
    en: {
      msg: "Broken local reference found in document.",
      hint: "Please fix the links mentioned.",
    },
  };
  const l10n$8 = getIntlData(localizationStrings$8);

  function run$9(conf) {
    if (!conf.lint?.[ruleName$8]) {
      return;
    }

    /** @type {NodeListOf<HTMLAnchorElement>} */
    const elems = document.querySelectorAll("a[href^='#']");
    const offendingElements = [...elems].filter(isBrokenHyperlink);
    if (offendingElements.length) {
      showWarning(l10n$8.msg, name$9, {
        hint: l10n$8.hint,
        elements: offendingElements,
      });
    }
  }

  function isBrokenHyperlink(elem) {
    const id = elem.getAttribute("href").substring(1);
    const doc = elem.ownerDocument;
    return !doc.getElementById(id) && !doc.getElementsByName(id).length;
  }

  var localRefsExist = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$9,
    run: run$9
  });

  // @ts-check
  /**
   * Linter rule "no-captionless-tables".
   *
   * Checks that there are no tables in the document which don't start
   * with a caption element.
   *
   * As some tables may not contain tabular data, this only applies to
   * tables marked with class="numbered".
   */

  const ruleName$7 = "no-captionless-tables";
  const name$8 = "core/linter-rules/no-captionless-tables";

  const localizationStrings$7 = {
    en: {
      msg: "All tables marked with class='numbered' must start with a caption element.",
      hint: "Add a `caption` to the offending table.",
    },
  };
  const l10n$7 = getIntlData(localizationStrings$7);

  function run$8(conf) {
    if (!conf.lint?.[ruleName$7]) {
      return;
    }
    /** @type {NodeListOf<HTMLElement>} */
    const tables = document.querySelectorAll("table.numbered");
    const offendingElements = [...tables].filter(
      table => !(table.firstElementChild instanceof HTMLTableCaptionElement)
    );

    if (!offendingElements.length) return;

    showWarning(l10n$7.msg, name$8, {
      hint: l10n$7.hint,
      elements: offendingElements,
    });
  }

  var noCaptionlessTables = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$8,
    run: run$8
  });

  // @ts-check
  /**
   * Linter rule "no-unused-dfns".
   *
   * Complains if an internal/un-exported definitions is not linked to.
   */

  const ruleName$6 = "no-unused-dfns";
  const name$7 = "core/linter-rules/no-unused-dfns";

  const localizationStrings$6 = {
    en: {
      msg(text) {
        return `Found definition for "${text}", but nothing links to it. This is usually a spec bug!`;
      },
      get hint() {
        return docLink`
        You can do one of the following...

          * Add a \`class="lint-ignore"\` attribute the definition.
          * Either remove the definition or change \`<dfn>\` to another type of HTML element.
          * If you meant to ${"[export|#data-export]"} the definition, add \`class="export"\` to the definition.

        To silence this warning entirely, set \`lint: { "no-unused-dfns": false }\` in your \`respecConfig\`.`;
      },
    },
  };
  const l10n$6 = getIntlData(localizationStrings$6);

  function run$7(conf) {
    if (!conf.lint?.[ruleName$6]) return;
    const logger = conf.lint[ruleName$6] === "error" ? showError : showWarning;
    /** @type NodeListOf<HTMLElement> */
    const definitions = document.querySelectorAll(
      "dfn:not(.lint-ignore, [data-export], [data-cite])"
    );

    const elements = [...definitions].filter(isDfnUnused);

    // These are usually bad spec bugs, so best shown individually.
    elements.forEach(element => {
      const elements = [element];
      const text = norm(element.textContent);
      logger(l10n$6.msg(text), name$7, { elements, hint: l10n$6.hint });
    });
  }

  function isDfnUnused(dfn) {
    // Not in the index
    // and not the "self-link" box
    return !document.querySelector(
      `a[href="#${dfn.id}"]:not(.index-term, .self-link)`
    );
  }

  var noUnusedDfns = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$7,
    run: run$7
  });

  // @ts-check
  /**
   * Linter rule "no-headingless-sections".
   *
   * Checks that there are no sections in the document that don't start
   * with a heading element (h1-6).
   */

  const ruleName$5 = "no-headingless-sections";
  const name$6 = "core/linter-rules/no-headingless-sections";

  const localizationStrings$5 = {
    en: {
      msg: "All sections must start with a `h2-6` element.",
      hint: "Add a `h2-6` to the offending section or use a `<div>`.",
    },
    nl: {
      msg: "Alle secties moeten beginnen met een `h2-6` element.",
      hint: "Voeg een `h2-6` toe aan de conflicterende sectie of gebruik een `<div>`.",
    },
    zh: {
      msg: "所有章节（section）都必须以 `h2-6` 元素开头。",
      hint: "将 `h2-6` 添加到有问题的章节或使用 `<div>`。",
    },
  };
  const l10n$5 = getIntlData(localizationStrings$5);

  function run$6(conf) {
    if (!conf.lint?.[ruleName$5]) {
      return;
    }
    /** @type {NodeListOf<HTMLElement>} */
    const sections = document.querySelectorAll(
      "section:not(.head,#abstract,#sotd)"
    );
    const offendingElements = [...sections].filter(
      ({ firstElementChild: e }) =>
        !e ||
        // no header wrapper and the first child is not a heading
        !(e.matches(".header-wrapper") || e instanceof HTMLHeadingElement)
    );

    if (!offendingElements.length) return;

    showWarning(l10n$5.msg, name$6, {
      hint: l10n$5.hint,
      elements: offendingElements,
    });
  }

  var noHeadinglessSections = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$6,
    run: run$6
  });

  // @ts-check
  /**
   * Linter rule "no-unused-vars".
   *
   * Checks that an variable is used if declared (the first use is treated as
   * declaration).
   */

  const ruleName$4 = "no-unused-vars";
  const name$5 = "core/linter-rules/no-unused-vars";

  const localizationStrings$4 = {
    en: {
      msg: "Variable was defined, but never used.",
      hint: "Add a `data-ignore-unused` attribute to the `<var>`.",
    },
  };
  const l10n$4 = getIntlData(localizationStrings$4);

  function run$5(conf) {
    if (!conf.lint?.[ruleName$4]) {
      return;
    }

    const offendingElements = [];

    /**
     * Check if a <section> contains a `".algorithm"`
     *
     * The selector matches:
     * ``` html
     * <section><ul class="algorithm"></ul></section>
     * <section><div><ul class="algorithm"></ul></div></section>
     * ```
     * The selector does not match:
     * ``` html
     * <section><section><ul class="algorithm"></ul></section></section>
     * ```
     * @param {HTMLElement} section
     */
    const sectionContainsAlgorithm = section =>
      !!section.querySelector(
        ":scope > :not(section) ~ .algorithm, :scope > :not(section) .algorithm"
      );

    for (const section of document.querySelectorAll("section")) {
      if (!sectionContainsAlgorithm(section)) continue;

      /**
       * `<var>` in this section, but excluding those in child sections.
       * @type {NodeListOf<HTMLElement>}
       */
      const varElems = section.querySelectorAll(":scope > :not(section) var");
      if (!varElems.length) continue;

      /** @type {Map<string, HTMLElement[]>} */
      const varUsage = new Map();
      for (const varElem of varElems) {
        const key = norm(varElem.textContent);
        const elems = varUsage.get(key) || varUsage.set(key, []).get(key);
        elems.push(varElem);
      }

      for (const vars of varUsage.values()) {
        if (vars.length === 1 && !vars[0].hasAttribute("data-ignore-unused")) {
          offendingElements.push(vars[0]);
        }
      }
    }

    if (offendingElements.length) {
      showWarning(l10n$4.msg, name$5, {
        hint: l10n$4.hint,
        elements: offendingElements,
      });
    }
  }

  var noUnusedVars = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$5,
    run: run$5
  });

  // @ts-check
  /**
   * The W3C Process requires separate Privacy Considerations and Security
   * Considerations sections. This linter checks for the presence of these
   * sections, and reports an error if they are not present.
   */


  const ruleName$3 = "required-sections";
  const name$4 = "w3c/linter-rules/required-sections";

  const localizationStrings$3 = {
    en: {
      msg(sectionTitle) {
        return `W3C Recommendation track documents require a separate "${sectionTitle}" section.`;
      },
      hint(sectionTitle) {
        return docLink`Add a \`<section>\` with a "${sectionTitle}" header. See the [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review).
        If the document is not intended for the W3C Recommendation track, set ${"[noRecTrack]"} to \`true\`
        or turn off the ${`[${ruleName$3}]`} linter rule.`;
      },
      privacy_considerations: "Privacy Considerations",
      security_considerations: "Security Considerations",
    },
    es: {
      msg(sectionTitle) {
        return `Documentos que van a ser "W3C Recommendation" requieren una sección "${sectionTitle}" separada.`;
      },
      hint(sectionTitle) {
        return docLink`Agrega una \`<section>\` con título "${sectionTitle}". Ver los [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review).
        Si el documento no está destinado a ser un W3C Recommendation, puedes poner ${"[noRecTrack]"} a \`true\`
        o apaga la regla de linter ${`[${ruleName$3}]`}.`;
      },
      privacy_considerations: "Consideraciones de privacidad",
      security_considerations: "Consideraciones de Seguridad",
    },
  };
  const l10n$3 = getIntlData(localizationStrings$3);

  const requiresSomeSectionStatus = new Set([...recTrackStatus]);
  requiresSomeSectionStatus.delete("DISC"); // "Discontinued Draft"
  // W3C notes do not require privacy or security considerations sections.
  W3CNotes.forEach(note => requiresSomeSectionStatus.delete(note));

  function run$4(conf) {
    if (!conf.lint?.[ruleName$3]) {
      return;
    }

    // We can't check for headers unless we also have a translation
    if (!getIntlDataForKey(localizationStrings$3, "privacy_considerations")) {
      // We can't check for headers unless we also have a translation
      const msg = `Cannot check for required sections as translations are not available.`;
      const hint = `File an issue to add translations or use a supported language.`;
      showWarning(msg, name$4, { hint });
      return;
    }

    if (conf.noRecTrack || !requiresSomeSectionStatus.has(conf.specStatus)) {
      return;
    }

    const logger = conf.lint[ruleName$3] === "error" ? showError : showWarning;

    const missingRequiredSections = new InsensitiveStringSet([
      l10n$3.privacy_considerations,
      l10n$3.security_considerations,
    ]);

    /** @type {NodeListOf<HTMLElement>} */
    const headers = document.querySelectorAll("h2, h3, h4, h5, h6");
    for (const header of headers) {
      const clone = header.cloneNode(true);
      // section number and self-link anchor
      clone.querySelectorAll("bdi")?.forEach(elem => elem.remove());
      const text = norm(clone.textContent);
      if (missingRequiredSections.has(text)) {
        missingRequiredSections.delete(text);
        // Check if we find them all...
        if (missingRequiredSections.size === 0) {
          return; // All present, early return!
        }
      }
    }

    // Show the ones we didn't find individually
    for (const title of missingRequiredSections) {
      logger(l10n$3.msg(title), name$4, {
        hint: l10n$3.hint(title),
      });
    }
  }

  var requiredSections = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$4,
    requiresSomeSectionStatus: requiresSomeSectionStatus,
    run: run$4
  });

  // @ts-check
  /**
   * Linter rule "wpt-tests-exist".
   * Warns about nonexistent web platform tests.
   */

  const ruleName$2 = "wpt-tests-exist";
  const name$3 = "core/linter-rules/wpt-tests-exist";

  const localizationStrings$2 = {
    en: {
      msg: "The following test could not be found in Web Platform Tests:",
      hint: "Check [wpt.live](https://wpt.live) to see if it was deleted or renamed.",
    },
  };
  const l10n$2 = getIntlData(localizationStrings$2);

  async function run$3(conf) {
    if (!conf.lint?.[ruleName$2]) {
      return;
    }

    const filesInWPT = await getFilesInWPT(conf.testSuiteURI, conf.githubAPI);
    if (!filesInWPT) {
      return;
    }

    /** @type {NodeListOf<HTMLElement>} */
    const elems = document.querySelectorAll("[data-tests]");
    const testables = [...elems].filter(elem => elem.dataset.tests);

    for (const elem of testables) {
      elem.dataset.tests
        .split(/,/gm)
        .map(test => test.trim().split(/\?|#/)[0])
        .filter(test => test && !filesInWPT.has(test))
        .map(missingTest => {
          showWarning(`${l10n$2.msg} \`${missingTest}\`.`, name$3, {
            hint: l10n$2.hint,
            elements: [elem],
          });
        });
    }
  }

  /**
   * @param {string} testSuiteURI
   * @param {string} githubAPIBase
   */
  async function getFilesInWPT(testSuiteURI, githubAPIBase) {
    let wptDirectory;
    try {
      const testSuiteURL = new URL(testSuiteURI);
      if (
        testSuiteURL.pathname.startsWith("/web-platform-tests/wpt/tree/master/")
      ) {
        const re = /web-platform-tests\/wpt\/tree\/master\/(.+)/;
        wptDirectory = testSuiteURL.pathname.match(re)[1].replace(/\//g, "");
      } else {
        wptDirectory = testSuiteURL.pathname.replace(/\//g, "");
      }
    } catch (error) {
      const msg = "Failed to parse WPT directory from testSuiteURI";
      showWarning(msg, `linter/${name$3}`);
      console.error(error);
      return null;
    }

    const url = new URL("web-platform-tests/wpt/files", `${githubAPIBase}/`);
    url.searchParams.set("path", wptDirectory);

    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.text();
      const msg =
        "Failed to fetch files from WPT repository. " +
        `Request failed with error: ${error} (${response.status})`;
      showWarning(msg, `linter/${name$3}`);
      return null;
    }
    /** @type {{ entries: string[] }} */
    const { entries } = await response.json();
    const files = entries.filter(entry => !entry.endsWith("/"));
    return new Set(files);
  }

  var wptTestsExist = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$3,
    run: run$3
  });

  // @ts-check
  /**
   * Linter rule "no-http-props". Makes sure the there are no URLs that
   * start with http:// in the ReSpec config.
   */

  const ruleName$1 = "no-http-props";
  const name$2 = "core/linter-rules/no-http-props";

  const localizationStrings$1 = {
    en: {
      msg: docLink`Insecure URLs are not allowed in ${"[respecConfig]"}.`,
      hint: "Please change the following properties to 'https://': ",
    },
    zh: {
      msg: docLink`${"[respecConfig]"} 中不允许使用不安全的URL.`,
      hint: "请将以下属性更改为 https://：",
    },
  };
  const l10n$1 = getIntlData(localizationStrings$1);

  function run$2(conf) {
    if (!conf.lint?.[ruleName$1]) {
      return;
    }

    // We can only really perform this check over http/https
    // Using parent's location as tests are loaded in iframe as a srcdoc.
    if (!parent.location.href.startsWith("http")) {
      return;
    }

    const offendingMembers = Object.getOwnPropertyNames(conf)
      // this check is cheap, "prevED" is w3c exception.
      .filter(key => (key.endsWith("URI") && conf[key]) || key === "prevED")
      // this check is expensive, so separate step
      .filter(key =>
        new URL(conf[key], parent.location.href).href.startsWith("http://")
      );

    if (offendingMembers.length) {
      const keys = joinAnd(offendingMembers, key => docLink`${`[${key}]`}`);
      showWarning(l10n$1.msg, name$2, { hint: l10n$1.hint + keys });
    }
  }

  var noHttpProps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$2,
    run: run$2
  });

  // @ts-check
  /**
   * Lints for accessibility issues using axe-core package.
   */


  const name$1 = "core/linter-rules/a11y";

  const DISABLED_RULES = [
    "color-contrast", // too slow 🐢
    "landmark-one-main", // need to add a <main>, else it marks entire page as errored
    "landmark-unique",
    "region",
  ];

  async function run$1(conf) {
    if (!conf.lint?.a11y && /** legacy */ !conf.a11y) {
      return;
    }
    const config = conf.lint?.a11y || /** legacy */ conf.a11y;

    const options = config === true ? {} : config;
    const violations = await getViolations(options);
    for (const violation of violations) {
      /**
       * We're grouping by failureSummary as it contains hints to fix the issue.
       * For example, with color-constrast rule, it tells about the present color
       * contrast and how to fix it. If we don't group, errors will be repetitive.
       * @type {Map<string, HTMLElement[]>}
       */
      const groupedBySummary = new Map();
      for (const node of violation.nodes) {
        const { failureSummary, element } = node;
        const elements =
          groupedBySummary.get(failureSummary) ||
          groupedBySummary.set(failureSummary, []).get(failureSummary);
        elements.push(element);
      }

      const { id, help, description, helpUrl } = violation;
      const title = `a11y/${id}: ${help}.`;
      for (const [failureSummary, elements] of groupedBySummary) {
        const hints = formatHintsAsMarkdown(failureSummary);
        const details = `\n\n${description}.\n\n${hints}. ([Learn more](${helpUrl}))`;
        showWarning(title, name$1, { details, elements });
      }
    }
  }

  /**
   * @param {object} opts Options as described at https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
   */
  async function getViolations(opts) {
    const { rules, ...otherOptions } = opts;
    const options = {
      rules: {
        ...Object.fromEntries(DISABLED_RULES.map(id => [id, { enabled: false }])),
        ...rules,
      },
      ...otherOptions,
      elementRef: true,
      resultTypes: ["violations"],
      reporter: "v1", // v1 includes a `failureSummary`
    };

    let axe;
    try {
      axe = await importAxe();
    } catch (error) {
      const msg = "Failed to load a11y linter.";
      showError(msg, name$1);
      console.error(error);
      return [];
    }

    try {
      const result = await axe.run(document, options);
      return result.violations;
    } catch (error) {
      const msg = "Error while looking for a11y issues.";
      showError(msg, name$1);
      console.error(error);
      return [];
    }
  }

  /** @returns {Promise<typeof window.axe>} */
  function importAxe() {
    const script = document.createElement("script");
    script.classList.add("remove");
    script.src = "https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js";
    document.head.appendChild(script);
    return new Promise((resolve, reject) => {
      script.onload = () => resolve(window.axe);
      script.onerror = reject;
    });
  }

  /** @param {string} text */
  function formatHintsAsMarkdown(text) {
    const results = [];
    for (const group of text.split("\n\n")) {
      const [msg, ...opts] = group.split(/^\s{2}/m);
      const options = opts.map(opt => `- ${opt.trimEnd()}`).join("\n");
      results.push(`${msg}${options}`);
    }
    return results.join("\n\n");
  }

  var a11y = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$1,
    run: run$1
  });

  // @ts-check
  /**
   * Linter rule "informative-dfn".
   *
   * Complains if an informative definition is referenced from a normative section.
   */

  const ruleName = "informative-dfn";
  const name = "core/linter-rules/informative-dfn";

  const localizationStrings = {
    en: {
      msg(term, cite) {
        return `Normative reference to "${term}" found but term is defined "informatively" in "${cite}".`;
      },
      get hint() {
        return docLink`
        You can do one of the following...

          * Get the source definition to be made normative
          * Add a \`class="lint-ignore"\` attribute to the link.
          * Use a local normative proxy for the definition à la \`<dfn data-cite="spec">term</dfn>\`

        To silence this warning entirely, set \`lint: { "${ruleName}": false }\` in your \`respecConfig\`.`;
      },
    },
  };
  const l10n = getIntlData(localizationStrings);

  function run(conf) {
    if (!conf.lint?.[ruleName]) return;
    const logger = conf.lint[ruleName] === "error" ? showError : showWarning;

    informativeRefsInNormative.forEach(({ term, spec, element }) => {
      if (element.classList.contains("lint-ignore")) return;
      logger(l10n.msg(term, spec), name, {
        title: "Normative reference to non-normative term.",
        elements: [element],
        hint: l10n.hint,
      });
    });
  }

  var informativeDfn = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    run: run
  });

  var respecWorker = "// ReSpec Worker v1.0.0\n\"use strict\";\ntry {\n  importScripts(\"https://www.w3.org/Tools/respec/respec-highlight\");\n} catch (err) {\n  console.error(\"Network error loading highlighter\", err);\n}\n\nself.addEventListener(\"message\", ({ data: originalData }) => {\n  const data = Object.assign({}, originalData);\n  switch (data.action) {\n    case \"highlight-load-lang\": {\n      const { langURL, propName, lang } = data;\n      importScripts(langURL);\n      self.hljs.registerLanguage(lang, self[propName]);\n      break;\n    }\n    case \"highlight\": {\n      const { code } = data;\n      const langs = data.languages.length ? data.languages : undefined;\n      try {\n        const { value, language } = self.hljs.highlightAuto(code, langs);\n        Object.assign(data, { value, language });\n      } catch (err) {\n        console.error(\"Could not transform some code?\", err);\n        // Post back the original code\n        Object.assign(data, { value: code, language: \"\" });\n      }\n      break;\n    }\n  }\n  self.postMessage(data);\n});\n";

  var respecWorker$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: respecWorker
  });

  var highlightVars_runtime = "(() => {\n// @ts-check\n\nif (document.respec) {\n  document.respec.ready.then(setupVarHighlighter);\n} else {\n  setupVarHighlighter();\n}\n\nfunction setupVarHighlighter() {\n  document\n    .querySelectorAll(\"var\")\n    .forEach(varElem => varElem.addEventListener(\"click\", highlightListener));\n}\n\nfunction highlightListener(ev) {\n  ev.stopPropagation();\n  const { target: varElem } = ev;\n  const hightligtedElems = highlightVars(varElem);\n  const resetListener = () => {\n    const hlColor = getHighlightColor(varElem);\n    hightligtedElems.forEach(el => removeHighlight(el, hlColor));\n    [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));\n  };\n  if (hightligtedElems.length) {\n    document.body.addEventListener(\"click\", resetListener, { once: true });\n  }\n}\n\n// availability of highlight colors. colors from var.css\nconst HL_COLORS = new Map([\n  [\"respec-hl-c1\", true],\n  [\"respec-hl-c2\", true],\n  [\"respec-hl-c3\", true],\n  [\"respec-hl-c4\", true],\n  [\"respec-hl-c5\", true],\n  [\"respec-hl-c6\", true],\n  [\"respec-hl-c7\", true],\n]);\n\nfunction getHighlightColor(target) {\n  // return current colors if applicable\n  const { value } = target.classList;\n  const re = /respec-hl-\\w+/;\n  const activeClass = re.test(value) && value.match(re);\n  if (activeClass) return activeClass[0];\n\n  // first color preference\n  if (HL_COLORS.get(\"respec-hl-c1\") === true) return \"respec-hl-c1\";\n\n  // otherwise get some other available color\n  return [...HL_COLORS.keys()].find(c => HL_COLORS.get(c)) || \"respec-hl-c1\";\n}\n\nfunction highlightVars(varElem) {\n  const textContent = norm(varElem.textContent);\n  const parent = varElem.closest(\".algorithm, section\");\n  const highlightColor = getHighlightColor(varElem);\n\n  const varsToHighlight = [...parent.querySelectorAll(\"var\")].filter(\n    el =>\n      norm(el.textContent) === textContent &&\n      el.closest(\".algorithm, section\") === parent\n  );\n\n  // update availability of highlight color\n  const colorStatus = varsToHighlight[0].classList.contains(\"respec-hl\");\n  HL_COLORS.set(highlightColor, colorStatus);\n\n  // highlight vars\n  if (colorStatus) {\n    varsToHighlight.forEach(el => removeHighlight(el, highlightColor));\n    return [];\n  } else {\n    varsToHighlight.forEach(el => addHighlight(el, highlightColor));\n  }\n  return varsToHighlight;\n}\n\nfunction removeHighlight(el, highlightColor) {\n  el.classList.remove(\"respec-hl\", highlightColor);\n  // clean up empty class attributes so they don't come in export\n  if (!el.classList.length) el.removeAttribute(\"class\");\n}\n\nfunction addHighlight(elem, highlightColor) {\n  elem.classList.add(\"respec-hl\", highlightColor);\n}\n\n/**\n * Same as `norm` from src/core/utils, but our build process doesn't allow\n * imports in runtime scripts, so duplicated here.\n * @param {string} str\n */\nfunction norm(str) {\n  return str.trim().replace(/\\s+/g, \" \");\n}\n})()";

  var highlightVars_runtime$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: highlightVars_runtime
  });

  var dfnPanel_runtime = "(() => {\n// @ts-check\nif (document.respec) {\n  document.respec.ready.then(setupPanel);\n} else {\n  setupPanel();\n}\n\nfunction setupPanel() {\n  const listener = panelListener();\n  document.body.addEventListener(\"keydown\", listener);\n  document.body.addEventListener(\"click\", listener);\n}\n\nfunction panelListener() {\n  /** @type {HTMLElement} */\n  let panel = null;\n  return event => {\n    const { target, type } = event;\n\n    if (!(target instanceof HTMLElement)) return;\n\n    // For keys, we only care about Enter key to activate the panel\n    // otherwise it's activated via a click.\n    if (type === \"keydown\" && event.key !== \"Enter\") return;\n\n    const action = deriveAction(event);\n\n    switch (action) {\n      case \"show\": {\n        hidePanel(panel);\n        /** @type {HTMLElement} */\n        const dfn = target.closest(\"dfn, .index-term\");\n        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);\n        const coords = deriveCoordinates(event);\n        displayPanel(dfn, panel, coords);\n        break;\n      }\n      case \"dock\": {\n        panel.style.left = null;\n        panel.style.top = null;\n        panel.classList.add(\"docked\");\n        break;\n      }\n      case \"hide\": {\n        hidePanel(panel);\n        panel = null;\n        break;\n      }\n    }\n  };\n}\n\n/**\n * @param {MouseEvent|KeyboardEvent} event\n */\nfunction deriveCoordinates(event) {\n  const target = /** @type HTMLElement */ (event.target);\n\n  // We prevent synthetic AT clicks from putting\n  // the dialog in a weird place. The AT events sometimes\n  // lack coordinates, so they have clientX/Y = 0\n  const rect = target.getBoundingClientRect();\n  if (\n    event instanceof MouseEvent &&\n    event.clientX >= rect.left &&\n    event.clientY >= rect.top\n  ) {\n    // The event probably happened inside the bounding rect...\n    return { x: event.clientX, y: event.clientY };\n  }\n\n  // Offset to the middle of the element\n  const x = rect.x + rect.width / 2;\n  // Placed at the bottom of the element\n  const y = rect.y + rect.height;\n  return { x, y };\n}\n\n/**\n * @param {Event} event\n */\nfunction deriveAction(event) {\n  const target = /** @type {HTMLElement} */ (event.target);\n  const hitALink = !!target.closest(\"a\");\n  if (target.closest(\"dfn:not([data-cite]), .index-term\")) {\n    return hitALink ? \"none\" : \"show\";\n  }\n  if (target.closest(\".dfn-panel\")) {\n    if (hitALink) {\n      return target.classList.contains(\"self-link\") ? \"hide\" : \"dock\";\n    }\n    const panel = target.closest(\".dfn-panel\");\n    return panel.classList.contains(\"docked\") ? \"hide\" : \"none\";\n  }\n  if (document.querySelector(\".dfn-panel:not([hidden])\")) {\n    return \"hide\";\n  }\n  return \"none\";\n}\n\n/**\n * @param {HTMLElement} dfn\n * @param {HTMLElement} panel\n * @param {{ x: number, y: number }} clickPosition\n */\nfunction displayPanel(dfn, panel, { x, y }) {\n  panel.hidden = false;\n  // distance (px) between edge of panel and the pointing triangle (caret)\n  const MARGIN = 20;\n\n  const dfnRects = dfn.getClientRects();\n  // Find the `top` offset when the `dfn` can be spread across multiple lines\n  let closestTop = 0;\n  let minDiff = Infinity;\n  for (const rect of dfnRects) {\n    const { top, bottom } = rect;\n    const diffFromClickY = Math.abs((top + bottom) / 2 - y);\n    if (diffFromClickY < minDiff) {\n      minDiff = diffFromClickY;\n      closestTop = top;\n    }\n  }\n\n  const top = window.scrollY + closestTop + dfnRects[0].height;\n  const left = x - MARGIN;\n  panel.style.left = `${left}px`;\n  panel.style.top = `${top}px`;\n\n  // Find if the panel is flowing out of the window\n  const panelRect = panel.getBoundingClientRect();\n  const SCREEN_WIDTH = Math.min(window.innerWidth, window.screen.width);\n  if (panelRect.right > SCREEN_WIDTH) {\n    const newLeft = Math.max(MARGIN, x + MARGIN - panelRect.width);\n    const newCaretOffset = left - newLeft;\n    panel.style.left = `${newLeft}px`;\n    /** @type {HTMLElement} */\n    const caret = panel.querySelector(\".caret\");\n    caret.style.left = `${newCaretOffset}px`;\n  }\n\n  // As it's a dialog, we trap focus.\n  // TODO: when <dialog> becomes a implemented, we should really\n  // use that.\n  trapFocus(panel, dfn);\n}\n\n/**\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction trapFocus(panel, dfn) {\n  /** @type NodeListOf<HTMLAnchorElement> elements */\n  const anchors = panel.querySelectorAll(\"a[href]\");\n  // No need to trap focus\n  if (!anchors.length) return;\n\n  // Move focus to first anchor element\n  const first = anchors.item(0);\n  first.focus();\n\n  const trapListener = createTrapListener(anchors, panel, dfn);\n  panel.addEventListener(\"keydown\", trapListener);\n\n  // Hiding the panel releases the trap\n  const mo = new MutationObserver(records => {\n    const [record] = records;\n    const target = /** @type HTMLElement */ (record.target);\n    if (target.hidden) {\n      panel.removeEventListener(\"keydown\", trapListener);\n      mo.disconnect();\n    }\n  });\n  mo.observe(panel, { attributes: true, attributeFilter: [\"hidden\"] });\n}\n\n/**\n *\n * @param {NodeListOf<HTMLAnchorElement>} anchors\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction createTrapListener(anchors, panel, dfn) {\n  const lastIndex = anchors.length - 1;\n  let currentIndex = 0;\n  return event => {\n    switch (event.key) {\n      // Hitting \"Tab\" traps us in a nice loop around elements.\n      case \"Tab\": {\n        event.preventDefault();\n        currentIndex += event.shiftKey ? -1 : +1;\n        if (currentIndex < 0) {\n          currentIndex = lastIndex;\n        } else if (currentIndex > lastIndex) {\n          currentIndex = 0;\n        }\n        anchors.item(currentIndex).focus();\n        break;\n      }\n\n      // Hitting \"Enter\" on an anchor releases the trap.\n      case \"Enter\":\n        hidePanel(panel);\n        break;\n\n      // Hitting \"Escape\" returns focus to dfn.\n      case \"Escape\":\n        hidePanel(panel);\n        dfn.focus();\n        return;\n    }\n  };\n}\n\n/** @param {HTMLElement} panel */\nfunction hidePanel(panel) {\n  if (!panel) return;\n  panel.hidden = true;\n  panel.classList.remove(\"docked\");\n}\n})()";

  var dfnPanel_runtime$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: dfnPanel_runtime
  });

})();
//# sourceMappingURL=respec-w3c.js.map
