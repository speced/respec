((window.respecVersion = "35.9.0"),
  (function () {
    "use strict";
    var e = "undefined" != typeof document ? document.currentScript : null;
    const t = !!window.require;
    if (!t) {
      const e = function (e, t) {
        const n = window.require,
          r = e.map(e => {
            if (!(e in n.modules))
              throw new Error(`Unsupported dependency name: ${e}`);
            return n.modules[e];
          });
        Promise.all(r).then(e => t(...e));
      };
      ((e.modules = {}), (window.require = e));
    }
    function n(e, n) {
      t || (window.require.modules[e] = n);
    }
    const r = document.documentElement;
    r?.hasAttribute("lang") ||
      ((r.lang = "en"), r.hasAttribute("dir") || (r.dir = "ltr"));
    const s = {},
      i = r?.lang ?? "en";
    var o = Object.freeze({
      __proto__: null,
      l10n: s,
      lang: i,
      name: "core/l10n",
      run: function (e) {
        e.l10n = s[i] || s.en;
      },
    });
    const a = (e, t) => t.some(t => e instanceof t);
    let c, l;
    const u = new WeakMap(),
      d = new WeakMap(),
      p = new WeakMap();
    let h = {
      get(e, t, n) {
        if (e instanceof IDBTransaction) {
          if ("done" === t) return u.get(e);
          if ("store" === t)
            return n.objectStoreNames[1]
              ? void 0
              : n.objectStore(n.objectStoreNames[0]);
        }
        return b(e[t]);
      },
      set: (e, t, n) => ((e[t] = n), !0),
      has: (e, t) =>
        (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
        t in e,
    };
    function f(e) {
      h = e(h);
    }
    function m(e) {
      return (
        l ||
        (l = [
          IDBCursor.prototype.advance,
          IDBCursor.prototype.continue,
          IDBCursor.prototype.continuePrimaryKey,
        ])
      ).includes(e)
        ? function (...t) {
            return (e.apply(y(this), t), b(this.request));
          }
        : function (...t) {
            return b(e.apply(y(this), t));
          };
    }
    function g(e) {
      return "function" == typeof e
        ? m(e)
        : (e instanceof IDBTransaction &&
            (function (e) {
              if (u.has(e)) return;
              const t = new Promise((t, n) => {
                const r = () => {
                    (e.removeEventListener("complete", s),
                      e.removeEventListener("error", i),
                      e.removeEventListener("abort", i));
                  },
                  s = () => {
                    (t(), r());
                  },
                  i = () => {
                    (n(e.error || new DOMException("AbortError", "AbortError")),
                      r());
                  };
                (e.addEventListener("complete", s),
                  e.addEventListener("error", i),
                  e.addEventListener("abort", i));
              });
              u.set(e, t);
            })(e),
          a(
            e,
            c ||
              (c = [
                IDBDatabase,
                IDBObjectStore,
                IDBIndex,
                IDBCursor,
                IDBTransaction,
              ])
          )
            ? new Proxy(e, h)
            : e);
    }
    function b(e) {
      if (e instanceof IDBRequest)
        return (function (e) {
          const t = new Promise((t, n) => {
            const r = () => {
                (e.removeEventListener("success", s),
                  e.removeEventListener("error", i));
              },
              s = () => {
                (t(b(e.result)), r());
              },
              i = () => {
                (n(e.error), r());
              };
            (e.addEventListener("success", s), e.addEventListener("error", i));
          });
          return (p.set(t, e), t);
        })(e);
      if (d.has(e)) return d.get(e);
      const t = g(e);
      return (t !== e && (d.set(e, t), p.set(t, e)), t);
    }
    const y = e => p.get(e);
    const w = ["get", "getKey", "getAll", "getAllKeys", "count"],
      k = ["put", "add", "delete", "clear"],
      v = new Map();
    function $(e, t) {
      if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
      if (v.get(t)) return v.get(t);
      const n = t.replace(/FromIndex$/, ""),
        r = t !== n,
        s = k.includes(n);
      if (
        !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
        (!s && !w.includes(n))
      )
        return;
      const i = async function (e, ...t) {
        const i = this.transaction(e, s ? "readwrite" : "readonly");
        let o = i.store;
        return (
          r && (o = o.index(t.shift())),
          (await Promise.all([o[n](...t), s && i.done]))[0]
        );
      };
      return (v.set(t, i), i);
    }
    f(e => ({
      ...e,
      get: (t, n, r) => $(t, n) || e.get(t, n, r),
      has: (t, n) => !!$(t, n) || e.has(t, n),
    }));
    const x = ["continue", "continuePrimaryKey", "advance"],
      C = {},
      _ = new WeakMap(),
      S = new WeakMap(),
      T = {
        get(e, t) {
          if (!x.includes(t)) return e[t];
          let n = C[t];
          return (
            n ||
              (n = C[t] =
                function (...e) {
                  _.set(this, S.get(this)[t](...e));
                }),
            n
          );
        },
      };
    async function* E(...e) {
      let t = this;
      if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t))
        return;
      const n = new Proxy(t, T);
      for (S.set(n, t), p.set(n, y(t)); t; )
        (yield n, (t = await (_.get(n) || t.continue())), _.delete(n));
    }
    function R(e, t) {
      return (
        (t === Symbol.asyncIterator &&
          a(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        ("iterate" === t && a(e, [IDBIndex, IDBObjectStore]))
      );
    }
    f(e => ({
      ...e,
      get: (t, n, r) => (R(t, n) ? E : e.get(t, n, r)),
      has: (t, n) => R(t, n) || e.has(t, n),
    }));
    var A = Object.freeze({
      __proto__: null,
      deleteDB: function (e, { blocked: t } = {}) {
        const n = indexedDB.deleteDatabase(e);
        return (
          t && n.addEventListener("blocked", e => t(e.oldVersion, e)),
          b(n).then(() => {})
        );
      },
      openDB: function (
        e,
        t,
        { blocked: n, upgrade: r, blocking: s, terminated: i } = {}
      ) {
        const o = indexedDB.open(e, t),
          a = b(o);
        return (
          r &&
            o.addEventListener("upgradeneeded", e => {
              r(b(o.result), e.oldVersion, e.newVersion, b(o.transaction), e);
            }),
          n &&
            o.addEventListener("blocked", e =>
              n(e.oldVersion, e.newVersion, e)
            ),
          a
            .then(e => {
              (i && e.addEventListener("close", () => i()),
                s &&
                  e.addEventListener("versionchange", e =>
                    s(e.oldVersion, e.newVersion, e)
                  ));
            })
            .catch(() => {}),
          a
        );
      },
      unwrap: y,
      wrap: b,
    });
    function L(
      e,
      t,
      n,
      r,
      s,
      { level: i = "error", autofix: o, ruleName: a } = {}
    ) {
      function c(n) {
        return n > 0 ? e.slice(t, t + n) : e.slice(Math.max(t + n, 0), t);
      }
      function l(n, { precedes: r } = {}) {
        const s = n.map(e => e.trivia + e.value).join(""),
          i = e[t];
        return "eof" === i.type
          ? s
          : r
            ? s + i.trivia
            : s.slice(i.trivia.length);
      }
      const u =
          "eof" !== e[t].type ? e[t].line : e.length > 1 ? e[t - 1].line : 1,
        d = (function (e) {
          const t = e.split("\n");
          return t[t.length - 1];
        })(l(c(-5), { precedes: !0 })),
        p = c(5),
        h = l(p),
        f = d + h.split("\n")[0] + "\n" + (" ".repeat(d.length) + "^"),
        m = "Syntax" === s ? "since" : "inside",
        g = `${s} error at line ${u}${e.name ? ` in ${e.name}` : ""}${
          n && n.name
            ? `, ${m} \`${n.partial ? "partial " : ""}${(function (e) {
                const t = [e];
                for (; e && e.parent; ) {
                  const { parent: n } = e;
                  (t.unshift(n), (e = n));
                }
                return t
                  .map(e =>
                    (function (e, t) {
                      let n = e;
                      return (t && (n += ` ${t}`), n);
                    })(e.type, e.name)
                  )
                  .join(" -> ");
              })(n)}\``
            : ""
        }:\n${f}`;
      return {
        message: `${g} ${r}`,
        bareMessage: r,
        context: g,
        line: u,
        sourceName: e.name,
        level: i,
        ruleName: a,
        autofix: o,
        input: h,
        tokens: p,
      };
    }
    function P(e, t, n, r) {
      return L(e, t, n, r, "Syntax");
    }
    function N(e, t, n, r, s = {}) {
      return ((s.ruleName = n), L(t.source, e.index, t, r, "Validation", s));
    }
    class I {
      constructor({ source: e, tokens: t }) {
        Object.defineProperties(this, {
          source: { value: e },
          tokens: { value: t, writable: !0 },
          parent: { value: null, writable: !0 },
          this: { value: this },
        });
      }
      toJSON() {
        const e = { type: void 0, name: void 0, inheritance: void 0 };
        let t = this;
        for (; t !== Object.prototype; ) {
          const n = Object.getOwnPropertyDescriptors(t);
          for (const [t, r] of Object.entries(n))
            (r.enumerable || r.get) && (e[t] = this[t]);
          t = Object.getPrototypeOf(t);
        }
        return e;
      }
    }
    function D(e, t, { useNullableInner: n } = {}) {
      if (!e.union) {
        const r = t.unique.get(e.idlType);
        if (!r) return;
        if ("typedef" === r.type) {
          const { typedefIncludesDictionary: n } = t.cache;
          if (n.has(r)) return n.get(r);
          t.cache.typedefIncludesDictionary.set(r, void 0);
          const s = D(r.idlType, t);
          if ((t.cache.typedefIncludesDictionary.set(r, s), s))
            return { reference: e, dictionary: s.dictionary };
        }
        if ("dictionary" === r.type && (n || !e.nullable))
          return { reference: e, dictionary: r };
      }
      for (const n of e.subtype) {
        const e = D(n, t);
        if (e) return n.union ? e : { reference: n, dictionary: e.dictionary };
      }
    }
    function O(e, t) {
      if (t.cache.dictionaryIncludesRequiredField.has(e))
        return t.cache.dictionaryIncludesRequiredField.get(e);
      t.cache.dictionaryIncludesRequiredField.set(e, void 0);
      let n = e.members.some(e => e.required);
      if (!n && e.inheritance) {
        const r = t.unique.get(e.inheritance);
        r ? O(r, t) && (n = !0) : (n = !0);
      }
      return (t.cache.dictionaryIncludesRequiredField.set(e, n), n);
    }
    class j extends Array {
      constructor({ source: e, tokens: t }) {
        (super(),
          Object.defineProperties(this, {
            source: { value: e },
            tokens: { value: t },
            parent: { value: null, writable: !0 },
          }));
      }
    }
    class z extends I {
      static parser(e, t) {
        return () => {
          const n = e.consumeKind(t);
          if (n) return new z({ source: e.source, tokens: { value: n } });
        };
      }
      get value() {
        return ne(this.tokens.value.value);
      }
      write(e) {
        return e.ts.wrap([
          e.token(this.tokens.value),
          e.token(this.tokens.separator),
        ]);
      }
    }
    class M extends z {
      static parse(e) {
        const t = e.consumeKind("eof");
        if (t) return new M({ source: e.source, tokens: { value: t } });
      }
      get type() {
        return "eof";
      }
    }
    function q(e, t) {
      return re(e, { parser: z.parser(e, t), listName: t + " list" });
    }
    const U = ["identifier", "decimal", "integer", "string"],
      W = new Map([
        ...[
          "NoInterfaceObject",
          "LenientSetter",
          "LenientThis",
          "TreatNonObjectAsNull",
          "Unforgeable",
        ].map(e => [e, `Legacy${e}`]),
        ["NamedConstructor", "LegacyFactoryFunction"],
        ["OverrideBuiltins", "LegacyOverrideBuiltIns"],
        ["TreatNullAs", "LegacyNullToEmptyString"],
      ]);
    function F(e) {
      for (const t of U) {
        const n = q(e, t);
        if (n.length) return n;
      }
      e.error(
        "Expected identifiers, strings, decimals, or integers but none found"
      );
    }
    class B extends I {
      static parse(e) {
        const t = { assign: e.consume("=") },
          n = fe(new B({ source: e.source, tokens: t }));
        if (((n.list = []), t.assign)) {
          if (((t.asterisk = e.consume("*")), t.asterisk)) return n.this;
          t.secondaryName = e.consumeKind(...U);
        }
        return (
          (t.open = e.consume("(")),
          t.open
            ? ((n.list = n.rhsIsList ? F(e) : ae(e)),
              (t.close =
                e.consume(")") ||
                e.error(
                  "Unexpected token in extended attribute argument list"
                )))
            : t.assign &&
              !t.secondaryName &&
              e.error("No right hand side to extended attribute assignment"),
          n.this
        );
      }
      get rhsIsList() {
        return (
          this.tokens.assign &&
          !this.tokens.asterisk &&
          !this.tokens.secondaryName
        );
      }
      get rhsType() {
        return this.rhsIsList
          ? this.list[0].tokens.value.type + "-list"
          : this.tokens.asterisk
            ? "*"
            : this.tokens.secondaryName
              ? this.tokens.secondaryName.type
              : null;
      }
      write(e) {
        const { rhsType: t } = this;
        return e.ts.wrap([
          e.token(this.tokens.assign),
          e.token(this.tokens.asterisk),
          e.reference_token(this.tokens.secondaryName, this.parent),
          e.token(this.tokens.open),
          ...this.list.map(n =>
            "identifier-list" === t ? e.identifier(n, this.parent) : n.write(e)
          ),
          e.token(this.tokens.close),
        ]);
      }
    }
    class H extends I {
      static parse(e) {
        const t = e.consumeKind("identifier");
        if (t)
          return new H({
            source: e.source,
            tokens: { name: t },
            params: B.parse(e),
          });
      }
      constructor({ source: e, tokens: t, params: n }) {
        (super({ source: e, tokens: t }),
          (n.parent = this),
          Object.defineProperty(this, "params", { value: n }));
      }
      get type() {
        return "extended-attribute";
      }
      get name() {
        return this.tokens.name.value;
      }
      get rhs() {
        const { rhsType: e, tokens: t, list: n } = this.params;
        if (!e) return null;
        return {
          type: e,
          value: this.params.rhsIsList
            ? n
            : this.params.tokens.secondaryName
              ? ne(t.secondaryName.value)
              : null,
        };
      }
      get arguments() {
        const { rhsIsList: e, list: t } = this.params;
        return !t || e ? [] : t;
      }
      *validate(e) {
        const { name: t } = this;
        if ("LegacyNoInterfaceObject" === t) {
          const e =
            "`[LegacyNoInterfaceObject]` extended attribute is an undesirable feature that may be removed from Web IDL in the future. Refer to the [relevant upstream PR](https://github.com/whatwg/webidl/pull/609) for more information.";
          yield N(this.tokens.name, this, "no-nointerfaceobject", e, {
            level: "warning",
          });
        } else if (W.has(t)) {
          const e = `\`[${t}]\` extended attribute is a legacy feature that is now renamed to \`[${W.get(t)}]\`. Refer to the [relevant upstream PR](https://github.com/whatwg/webidl/pull/870) for more information.`;
          yield N(this.tokens.name, this, "renamed-legacy", e, {
            level: "warning",
            autofix:
              ((n = this),
              () => {
                const { name: e } = n;
                ((n.tokens.name.value = W.get(e)),
                  "TreatNullAs" === e && (n.params.tokens = {}));
              }),
          });
        }
        var n;
        for (const t of this.arguments) yield* t.validate(e);
      }
      write(e) {
        return e.ts.wrap([
          e.ts.trivia(this.tokens.name.trivia),
          e.ts.extendedAttribute(
            e.ts.wrap([
              e.ts.extendedAttributeReference(this.name),
              this.params.write(e),
            ])
          ),
          e.token(this.tokens.separator),
        ]);
      }
    }
    class G extends j {
      static parse(e) {
        const t = {};
        t.open = e.consume("[");
        const n = new G({ source: e.source, tokens: t });
        return t.open
          ? (n.push(
              ...re(e, { parser: H.parse, listName: "extended attribute" })
            ),
            (t.close =
              e.consume("]") ||
              e.error(
                "Expected a closing token for the extended attribute list"
              )),
            n.length ||
              (e.unconsume(t.close.index),
              e.error("An extended attribute list must not be empty")),
            e.probe("[") &&
              e.error(
                "Illegal double extended attribute lists, consider merging them"
              ),
            n)
          : n;
      }
      *validate(e) {
        for (const t of this) yield* t.validate(e);
      }
      write(e) {
        return this.length
          ? e.ts.wrap([
              e.token(this.tokens.open),
              ...this.map(t => t.write(e)),
              e.token(this.tokens.close),
            ])
          : "";
      }
    }
    function V(e, t) {
      const n = e.consume("?");
      (n && (t.tokens.nullable = n),
        e.probe("?") && e.error("Can't nullable more than once"));
    }
    function J(e, t) {
      let n =
        (function (e, t) {
          const n = e.consume(
            "FrozenArray",
            "ObservableArray",
            "Promise",
            "async_sequence",
            "sequence",
            "record"
          );
          if (!n) return;
          const r = fe(new K({ source: e.source, tokens: { base: n } }));
          switch (
            ((r.tokens.open =
              e.consume("<") || e.error(`No opening bracket after ${n.value}`)),
            n.value)
          ) {
            case "Promise": {
              e.probe("[") &&
                e.error("Promise type cannot have extended attribute");
              const n = le(e, t) || e.error("Missing Promise subtype");
              r.subtype.push(n);
              break;
            }
            case "async_sequence":
            case "sequence":
            case "FrozenArray":
            case "ObservableArray": {
              const s = ce(e, t) || e.error(`Missing ${n.value} subtype`);
              r.subtype.push(s);
              break;
            }
            case "record": {
              e.probe("[") &&
                e.error("Record key cannot have extended attribute");
              const n =
                  e.consume(...be) ||
                  e.error(`Record key must be one of: ${be.join(", ")}`),
                s = new K({ source: e.source, tokens: { base: n } });
              ((s.tokens.separator =
                e.consume(",") ||
                e.error("Missing comma after record key type")),
                (s.type = t));
              const i =
                ce(e, t) || e.error("Error parsing generic type record");
              r.subtype.push(s, i);
              break;
            }
          }
          return (
            r.idlType || e.error(`Error parsing generic type ${n.value}`),
            (r.tokens.close =
              e.consume(">") ||
              e.error(`Missing closing bracket after ${n.value}`)),
            r.this
          );
        })(e, t) || oe(e);
      if (!n) {
        const t = e.consumeKind("identifier") || e.consume(...be, ...ge);
        if (!t) return;
        ((n = new K({ source: e.source, tokens: { base: t } })),
          e.probe("<") && e.error(`Unsupported generic type ${t.value}`));
      }
      return (
        "Promise" === n.generic &&
          e.probe("?") &&
          e.error("Promise type cannot be nullable"),
        (n.type = t || null),
        V(e, n),
        n.nullable &&
          "any" === n.idlType &&
          e.error("Type `any` cannot be made nullable"),
        n
      );
    }
    let K = class extends I {
      static parse(e, t) {
        return (
          J(e, t) ||
          (function (e, t) {
            const n = {};
            if (((n.open = e.consume("(")), !n.open)) return;
            const r = fe(new K({ source: e.source, tokens: n }));
            for (r.type = t || null; ; ) {
              const n =
                ce(e, t) ||
                e.error("No type after open parenthesis or 'or' in union type");
              ("any" === n.idlType &&
                e.error("Type `any` cannot be included in a union type"),
                "Promise" === n.generic &&
                  e.error("Type `Promise` cannot be included in a union type"),
                r.subtype.push(n));
              const s = e.consume("or");
              if (!s) break;
              n.tokens.separator = s;
            }
            return (
              r.idlType.length < 2 &&
                e.error(
                  "At least two types are expected in a union type but found less"
                ),
              (n.close = e.consume(")") || e.error("Unterminated union type")),
              V(e, r),
              r.this
            );
          })(e, t)
        );
      }
      constructor({ source: e, tokens: t }) {
        (super({ source: e, tokens: t }),
          Object.defineProperty(this, "subtype", { value: [], writable: !0 }),
          (this.extAttrs = new G({ source: e, tokens: {} })));
      }
      get generic() {
        return this.subtype.length && this.tokens.base
          ? this.tokens.base.value
          : "";
      }
      get nullable() {
        return Boolean(this.tokens.nullable);
      }
      get union() {
        return Boolean(this.subtype.length) && !this.tokens.base;
      }
      get idlType() {
        if (this.subtype.length) return this.subtype;
        return ne(
          [this.tokens.prefix, this.tokens.base, this.tokens.postfix]
            .filter(e => e)
            .map(e => e.value)
            .join(" ")
        );
      }
      *validate(e) {
        if ((yield* this.extAttrs.validate(e), "BufferSource" === this.idlType))
          for (const e of [this.extAttrs, this.parent?.extAttrs])
            for (const t of e) {
              if ("AllowShared" !== t.name) continue;
              const n =
                "`[AllowShared] BufferSource` is now replaced with AllowSharedBufferSource.";
              yield N(this.tokens.base, this, "migrate-allowshared", n, {
                autofix: Y(this, t, e),
              });
            }
        if ("void" === this.idlType) {
          const e =
            "`void` is now replaced by `undefined`. Refer to the [relevant GitHub issue](https://github.com/whatwg/webidl/issues/60) for more information.";
          yield N(this.tokens.base, this, "replace-void", e, {
            autofix:
              ((t = this),
              () => {
                t.tokens.base.value = "undefined";
              }),
          });
        }
        var t;
        const n = !this.union && e.unique.get(this.idlType),
          r = this.union
            ? this
            : n && "typedef" === n.type
              ? n.idlType
              : void 0;
        if (r && this.nullable) {
          const { reference: t } = D(r, e) || {};
          if (t) {
            const e = (this.union ? t : this).tokens.base,
              n = "Nullable union cannot include a dictionary type.";
            yield N(e, this, "no-nullable-union-dict", n);
          }
        } else for (const t of this.subtype) yield* t.validate(e);
      }
      write(e) {
        return e.ts.wrap([
          this.extAttrs.write(e),
          (() => {
            if (this.union || this.generic)
              return e.ts.wrap([
                e.token(this.tokens.base, e.ts.generic),
                e.token(this.tokens.open),
                ...this.subtype.map(t => t.write(e)),
                e.token(this.tokens.close),
              ]);
            const t = this.tokens.prefix || this.tokens.base,
              n = this.tokens.prefix
                ? [
                    this.tokens.prefix.value,
                    e.ts.trivia(this.tokens.base.trivia),
                  ]
                : [],
              r = e.reference(
                e.ts.wrap([
                  ...n,
                  this.tokens.base.value,
                  e.token(this.tokens.postfix),
                ]),
                { unescaped: this.idlType, context: this }
              );
            return e.ts.wrap([e.ts.trivia(t.trivia), r]);
          })(),
          e.token(this.tokens.nullable),
          e.token(this.tokens.separator),
        ]);
      }
    };
    function Y(e, t, n) {
      return () => {
        const r = n.indexOf(t);
        (n.splice(r, 1),
          !n.length &&
            e.tokens.base.trivia.match(/^\s$/) &&
            (e.tokens.base.trivia = ""),
          (e.tokens.base.value = "AllowSharedBufferSource"));
      };
    }
    class Z extends I {
      static parse(e) {
        const t = e.consume("=");
        if (!t) return null;
        const n =
            se(e) ||
            e.consumeKind("string") ||
            e.consume("null", "[", "{") ||
            e.error("No value for default"),
          r = [n];
        if ("[" === n.value) {
          const t =
            e.consume("]") || e.error("Default sequence value must be empty");
          r.push(t);
        } else if ("{" === n.value) {
          const t =
            e.consume("}") || e.error("Default dictionary value must be empty");
          r.push(t);
        }
        return new Z({
          source: e.source,
          tokens: { assign: t },
          expression: r,
        });
      }
      constructor({ source: e, tokens: t, expression: n }) {
        (super({ source: e, tokens: t }),
          (n.parent = this),
          Object.defineProperty(this, "expression", { value: n }));
      }
      get type() {
        return ie(this.expression[0]).type;
      }
      get value() {
        return ie(this.expression[0]).value;
      }
      get negative() {
        return ie(this.expression[0]).negative;
      }
      write(e) {
        return e.ts.wrap([
          e.token(this.tokens.assign),
          ...this.expression.map(t => e.token(t)),
        ]);
      }
    }
    class X extends I {
      static parse(e) {
        const t = e.position,
          n = {},
          r = fe(new X({ source: e.source, tokens: n }));
        return (
          (r.extAttrs = G.parse(e)),
          (n.optional = e.consume("optional")),
          (r.idlType = ce(e, "argument-type")),
          r.idlType
            ? (n.optional || (n.variadic = e.consume("...")),
              (n.name = e.consumeKind("identifier") || e.consume(...ye)),
              n.name
                ? ((r.default = n.optional ? Z.parse(e) : null), r.this)
                : e.unconsume(t))
            : e.unconsume(t)
        );
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
        return ne(this.tokens.name.value);
      }
      *validate(e) {
        (yield* this.extAttrs.validate(e), yield* this.idlType.validate(e));
        const t = D(this.idlType, e, { useNullableInner: !0 });
        if (t)
          if (this.idlType.nullable) {
            const e = "Dictionary arguments cannot be nullable.";
            yield N(this.tokens.name, this, "no-nullable-dict-arg", e);
          } else if (this.optional) {
            if (!this.default) {
              const e =
                "Optional dictionary arguments must have a default value of `{}`.";
              yield N(this.tokens.name, this, "dict-arg-default", e, {
                autofix: Q(this),
              });
            }
          } else if (
            this.parent &&
            !O(t.dictionary, e) &&
            (function (e) {
              const t = e.parent.arguments || e.parent.list,
                n = t.indexOf(e),
                r = t.slice(n + 1).some(e => !e.optional);
              return !r;
            })(this)
          ) {
            const e =
              "Dictionary argument must be optional if it has no required fields";
            yield N(this.tokens.name, this, "dict-arg-optional", e, {
              autofix:
                ((n = this),
                () => {
                  const e = he(n.idlType);
                  ((n.tokens.optional = {
                    ...e,
                    type: "optional",
                    value: "optional",
                  }),
                    (e.trivia = " "),
                    Q(n)());
                }),
            });
          }
        var n;
      }
      write(e) {
        return e.ts.wrap([
          this.extAttrs.write(e),
          e.token(this.tokens.optional),
          e.ts.type(this.idlType.write(e)),
          e.token(this.tokens.variadic),
          e.name_token(this.tokens.name, { data: this }),
          this.default ? this.default.write(e) : "",
          e.token(this.tokens.separator),
        ]);
      }
    }
    function Q(e) {
      return () => {
        e.default = Z.parse(new $e(" = {}"));
      };
    }
    class ee extends I {
      static parse(e, { special: t, regular: n } = {}) {
        const r = { special: t },
          s = fe(new ee({ source: e.source, tokens: r }));
        return t &&
          "stringifier" === t.value &&
          ((r.termination = e.consume(";")), r.termination)
          ? ((s.arguments = []), s)
          : (t || n || (r.special = e.consume("getter", "setter", "deleter")),
            (s.idlType = le(e) || e.error("Missing return type")),
            (r.name = e.consumeKind("identifier") || e.consume("includes")),
            (r.open = e.consume("(") || e.error("Invalid operation")),
            (s.arguments = ae(e)),
            (r.close = e.consume(")") || e.error("Unterminated operation")),
            (r.termination =
              e.consume(";") ||
              e.error("Unterminated operation, expected `;`")),
            s.this);
      }
      get type() {
        return "operation";
      }
      get name() {
        const { name: e } = this.tokens;
        return e ? ne(e.value) : "";
      }
      get special() {
        return this.tokens.special ? this.tokens.special.value : "";
      }
      *validate(e) {
        if (
          (yield* this.extAttrs.validate(e),
          !this.name && ["", "static"].includes(this.special))
        ) {
          const e =
            "Regular or static operations must have both a return type and an identifier.";
          yield N(this.tokens.open, this, "incomplete-op", e);
        }
        if (this.idlType) {
          if ("async_sequence" === this.idlType.generic) {
            const e =
              "async_sequence types cannot be returned by an operation.";
            yield N(
              this.idlType.tokens.base,
              this,
              "async-sequence-idl-to-js",
              e
            );
          }
          yield* this.idlType.validate(e);
        }
        for (const t of this.arguments) yield* t.validate(e);
      }
      write(e) {
        const { parent: t } = this,
          n = this.idlType
            ? [
                e.ts.type(this.idlType.write(e)),
                e.name_token(this.tokens.name, { data: this, parent: t }),
                e.token(this.tokens.open),
                e.ts.wrap(this.arguments.map(t => t.write(e))),
                e.token(this.tokens.close),
              ]
            : [];
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            this.tokens.name
              ? e.token(this.tokens.special)
              : e.token(this.tokens.special, e.ts.nameless, {
                  data: this,
                  parent: t,
                }),
            ...n,
            e.token(this.tokens.termination),
          ]),
          { data: this, parent: t }
        );
      }
    }
    class te extends I {
      static parse(
        e,
        { special: t, noInherit: n = !1, readonly: r = !1 } = {}
      ) {
        const s = e.position,
          i = { special: t },
          o = fe(new te({ source: e.source, tokens: i }));
        if (
          (t || n || (i.special = e.consume("inherit")),
          "inherit" === o.special &&
            e.probe("readonly") &&
            e.error("Inherited attributes cannot be read-only"),
          (i.readonly = e.consume("readonly")),
          r &&
            !i.readonly &&
            e.probe("attribute") &&
            e.error("Attributes must be readonly in this context"),
          (i.base = e.consume("attribute")),
          i.base)
        )
          return (
            (o.idlType =
              ce(e, "attribute-type") || e.error("Attribute lacks a type")),
            (i.name =
              e.consumeKind("identifier") ||
              e.consume("async", "required") ||
              e.error("Attribute lacks a name")),
            (i.termination =
              e.consume(";") ||
              e.error("Unterminated attribute, expected `;`")),
            o.this
          );
        e.unconsume(s);
      }
      get type() {
        return "attribute";
      }
      get special() {
        return this.tokens.special ? this.tokens.special.value : "";
      }
      get readonly() {
        return !!this.tokens.readonly;
      }
      get name() {
        return ne(this.tokens.name.value);
      }
      *validate(e) {
        if (
          (yield* this.extAttrs.validate(e),
          yield* this.idlType.validate(e),
          ["async_sequence", "sequence", "record"].includes(
            this.idlType.generic
          ))
        ) {
          const e = `Attributes cannot accept ${this.idlType.generic} types.`;
          yield N(this.tokens.name, this, "attr-invalid-type", e);
        }
        {
          const { reference: t } = D(this.idlType, e) || {};
          if (t) {
            const e = (this.idlType.union ? t : this.idlType).tokens.base,
              n = "Attributes cannot accept dictionary types.";
            yield N(e, this, "attr-invalid-type", n);
          }
        }
        if (
          this.readonly &&
          (function (e, t) {
            if (e.union) return !1;
            if (e.extAttrs.some(e => "EnforceRange" === e.name)) return !0;
            const n = t.unique.get(e.idlType);
            return (
              "typedef" === n?.type &&
              n.idlType.extAttrs.some(e => "EnforceRange" === e.name)
            );
          })(this.idlType, e)
        ) {
          const e = this.idlType.tokens.base,
            t =
              "Readonly attributes cannot accept [EnforceRange] extended attribute.";
          yield N(e, this, "attr-invalid-type", t);
        }
      }
      write(e) {
        const { parent: t } = this;
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.special),
            e.token(this.tokens.readonly),
            e.token(this.tokens.base),
            e.ts.type(this.idlType.write(e)),
            e.name_token(this.tokens.name, { data: this, parent: t }),
            e.token(this.tokens.termination),
          ]),
          { data: this, parent: t }
        );
      }
    }
    function ne(e) {
      return e.startsWith("_") ? e.slice(1) : e;
    }
    function re(e, { parser: t, allowDangler: n, listName: r = "list" }) {
      const s = t(e);
      if (!s) return [];
      s.tokens.separator = e.consume(",");
      const i = [s];
      for (; s.tokens.separator; ) {
        const s = t(e);
        if (!s) {
          n || e.error(`Trailing comma in ${r}`);
          break;
        }
        if (
          ((s.tokens.separator = e.consume(",")),
          i.push(s),
          !s.tokens.separator)
        )
          break;
      }
      return i;
    }
    function se(e) {
      return (
        e.consumeKind("decimal", "integer") ||
        e.consume("true", "false", "Infinity", "-Infinity", "NaN")
      );
    }
    function ie({ type: e, value: t }) {
      switch (e) {
        case "decimal":
        case "integer":
          return { type: "number", value: t };
        case "string":
          return { type: "string", value: t.slice(1, -1) };
      }
      switch (t) {
        case "true":
        case "false":
          return { type: "boolean", value: "true" === t };
        case "Infinity":
        case "-Infinity":
          return { type: "Infinity", negative: t.startsWith("-") };
        case "[":
          return { type: "sequence", value: [] };
        case "{":
          return { type: "dictionary" };
        default:
          return { type: t };
      }
    }
    function oe(e) {
      const { source: t } = e,
        n =
          (function () {
            const n = e.consume("unsigned"),
              r = e.consume("short", "long");
            if (r) {
              const s = e.consume("long");
              return new K({
                source: t,
                tokens: { prefix: n, base: r, postfix: s },
              });
            }
            n && e.error("Failed to parse integer type");
          })() ||
          (function () {
            const n = e.consume("unrestricted"),
              r = e.consume("float", "double");
            if (r) return new K({ source: t, tokens: { prefix: n, base: r } });
            n && e.error("Failed to parse float type");
          })();
      if (n) return n;
      const r = e.consume("bigint", "boolean", "byte", "octet", "undefined");
      return r ? new K({ source: t, tokens: { base: r } }) : void 0;
    }
    function ae(e) {
      return re(e, { parser: X.parse, listName: "arguments list" });
    }
    function ce(e, t) {
      const n = G.parse(e),
        r = K.parse(e, t);
      return (r && (fe(r).extAttrs = n), r);
    }
    function le(e, t) {
      const n = K.parse(e, t || "return-type");
      if (n) return n;
      const r = e.consume("void");
      if (r) {
        const t = new K({ source: e.source, tokens: { base: r } });
        return ((t.type = "return-type"), t);
      }
    }
    function ue(e) {
      const t = e.consume("stringifier");
      if (!t) return;
      return (
        te.parse(e, { special: t }) ||
        ee.parse(e, { special: t }) ||
        e.error("Unterminated stringifier")
      );
    }
    function de(e) {
      const t = e.split("\n");
      if (t.length) {
        const e = t[t.length - 1].match(/^\s+/);
        if (e) return e[0];
      }
      return "";
    }
    function pe(e) {
      return () => {
        if (e.extAttrs.length) {
          const t = new $e("Exposed=Window,"),
            n = H.parse(t);
          n.tokens.separator = t.consume(",");
          const r = e.extAttrs[0];
          (/^\s/.test(r.tokens.name.trivia) ||
            (r.tokens.name.trivia = ` ${r.tokens.name.trivia}`),
            e.extAttrs.unshift(n));
        } else {
          fe(e).extAttrs = G.parse(new $e("[Exposed=Window]"));
          const t = e.tokens.base.trivia;
          ((e.extAttrs.tokens.open.trivia = t),
            (e.tokens.base.trivia = `\n${de(t)}`));
        }
      };
    }
    function he(e) {
      if (e.extAttrs.length) return e.extAttrs.tokens.open;
      if ("operation" === e.type && !e.special) return he(e.idlType);
      const t = Object.values(e.tokens).sort((e, t) => e.index - t.index);
      return t[0];
    }
    function fe(e, t) {
      if ((t || (t = e), !e)) return e;
      return new Proxy(e, {
        get(e, t) {
          const n = e[t];
          return Array.isArray(n) && "source" !== t ? fe(n, e) : n;
        },
        set(e, n, r) {
          if (((e[n] = r), !r)) return !0;
          if (Array.isArray(r))
            for (const e of r) void 0 !== e.parent && (e.parent = t);
          else void 0 !== r.parent && (r.parent = t);
          return !0;
        },
      });
    }
    const me = {
        decimal:
          /-?(?=[0-9]*\.|[0-9]+[eE])(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][-+]?[0-9]+)?|[0-9]+[Ee][-+]?[0-9]+)/y,
        integer: /-?(0([Xx][0-9A-Fa-f]+|[0-7]*)|[1-9][0-9]*)/y,
        identifier: /[_-]?[A-Za-z][0-9A-Z_a-z-]*/y,
        string: /"[^"]*"/y,
        whitespace: /[\t\n\r ]+/y,
        comment: /\/\/.*|\/\*[\s\S]*?\*\//y,
        other: /[^\t\n\r 0-9A-Za-z]/y,
      },
      ge = [
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
      ],
      be = ["ByteString", "DOMString", "USVString"],
      ye = [
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
      ],
      we = [
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
      ].concat(ye, be, ge),
      ke = [
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
      ],
      ve = ["_constructor", "toString", "_toString"];
    class $e {
      constructor(e) {
        ((this.source = (function (e) {
          const t = [];
          let n = 0,
            r = "",
            s = 1,
            i = 0;
          for (; n < e.length; ) {
            const a = e.charAt(n);
            let c = -1;
            if (
              (/[\t\n\r ]/.test(a)
                ? (c = o("whitespace", { noFlushTrivia: !0 }))
                : "/" === a && (c = o("comment", { noFlushTrivia: !0 })),
              -1 !== c)
            ) {
              const e = t.pop().value;
              ((s += (e.match(/\n/g) || []).length), (r += e), (i -= 1));
            } else if (/[-0-9.A-Z_a-z]/.test(a)) {
              if (
                ((c = o("decimal")), -1 === c && (c = o("integer")), -1 === c)
              ) {
                c = o("identifier");
                const e = t.length - 1,
                  n = t[e];
                if (-1 !== c) {
                  if (ve.includes(n.value)) {
                    const r = `${ne(n.value)} is a reserved identifier and must not be used.`;
                    throw new xe(P(t, e, null, r));
                  }
                  we.includes(n.value) && (n.type = "inline");
                }
              }
            } else '"' === a && (c = o("string"));
            for (const o of ke)
              if (e.startsWith(o, n)) {
                (t.push({
                  type: "inline",
                  value: o,
                  trivia: r,
                  line: s,
                  index: i,
                }),
                  (r = ""),
                  (n += o.length),
                  (c = n));
                break;
              }
            if ((-1 === c && (c = o("other")), -1 === c))
              throw new Error("Token stream not progressing");
            ((n = c), (i += 1));
          }
          return (
            t.push({ type: "eof", value: "", trivia: r, line: s, index: i }),
            t
          );
          function o(o, { noFlushTrivia: a } = {}) {
            const c = me[o];
            c.lastIndex = n;
            const l = c.exec(e);
            return l
              ? (t.push({ type: o, value: l[0], trivia: r, line: s, index: i }),
                a || (r = ""),
                c.lastIndex)
              : -1;
          }
        })(e)),
          (this.position = 0));
      }
      error(e) {
        throw new xe(P(this.source, this.position, this.current, e));
      }
      probeKind(e) {
        return (
          this.source.length > this.position &&
          this.source[this.position].type === e
        );
      }
      probe(e) {
        return (
          this.probeKind("inline") && this.source[this.position].value === e
        );
      }
      consumeKind(...e) {
        for (const t of e) {
          if (!this.probeKind(t)) continue;
          const e = this.source[this.position];
          return (this.position++, e);
        }
      }
      consume(...e) {
        if (!this.probeKind("inline")) return;
        const t = this.source[this.position];
        for (const n of e) if (t.value === n) return (this.position++, t);
      }
      consumeIdentifier(e) {
        if (
          this.probeKind("identifier") &&
          this.source[this.position].value === e
        )
          return this.consumeKind("identifier");
      }
      unconsume(e) {
        this.position = e;
      }
    }
    class xe extends Error {
      constructor({
        message: e,
        bareMessage: t,
        context: n,
        line: r,
        sourceName: s,
        input: i,
        tokens: o,
      }) {
        (super(e),
          (this.name = "WebIDLParseError"),
          (this.bareMessage = t),
          (this.context = n),
          (this.line = r),
          (this.sourceName = s),
          (this.input = i),
          (this.tokens = o));
      }
    }
    class Ce extends z {
      static parse(e) {
        const t = e.consumeKind("string");
        if (t) return new Ce({ source: e.source, tokens: { value: t } });
      }
      get type() {
        return "enum-value";
      }
      get value() {
        return super.value.slice(1, -1);
      }
      write(e) {
        const { parent: t } = this;
        return e.ts.wrap([
          e.ts.trivia(this.tokens.value.trivia),
          e.ts.definition(
            e.ts.wrap([
              '"',
              e.ts.name(this.value, { data: this, parent: t }),
              '"',
            ]),
            { data: this, parent: t }
          ),
          e.token(this.tokens.separator),
        ]);
      }
    }
    class _e extends I {
      static parse(e) {
        const t = {};
        if (((t.base = e.consume("enum")), !t.base)) return;
        t.name = e.consumeKind("identifier") || e.error("No name for enum");
        const n = fe(new _e({ source: e.source, tokens: t }));
        return (
          (e.current = n.this),
          (t.open = e.consume("{") || e.error("Bodyless enum")),
          (n.values = re(e, {
            parser: Ce.parse,
            allowDangler: !0,
            listName: "enumeration",
          })),
          e.probeKind("string") && e.error("No comma between enum values"),
          (t.close = e.consume("}") || e.error("Unexpected value in enum")),
          n.values.length || e.error("No value in enum"),
          (t.termination =
            e.consume(";") || e.error("No semicolon after enum")),
          n.this
        );
      }
      get type() {
        return "enum";
      }
      get name() {
        return ne(this.tokens.name.value);
      }
      write(e) {
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.base),
            e.name_token(this.tokens.name, { data: this }),
            e.token(this.tokens.open),
            e.ts.wrap(this.values.map(t => t.write(e))),
            e.token(this.tokens.close),
            e.token(this.tokens.termination),
          ]),
          { data: this }
        );
      }
    }
    class Se extends I {
      static parse(e) {
        const t = e.consumeKind("identifier");
        if (!t) return;
        const n = { target: t };
        if (((n.includes = e.consume("includes")), n.includes))
          return (
            (n.mixin =
              e.consumeKind("identifier") ||
              e.error("Incomplete includes statement")),
            (n.termination =
              e.consume(";") ||
              e.error("No terminating ; for includes statement")),
            new Se({ source: e.source, tokens: n })
          );
        e.unconsume(t.index);
      }
      get type() {
        return "includes";
      }
      get target() {
        return ne(this.tokens.target.value);
      }
      get includes() {
        return ne(this.tokens.mixin.value);
      }
      write(e) {
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.reference_token(this.tokens.target, this),
            e.token(this.tokens.includes),
            e.reference_token(this.tokens.mixin, this),
            e.token(this.tokens.termination),
          ]),
          { data: this }
        );
      }
    }
    class Te extends I {
      static parse(e) {
        const t = {},
          n = fe(new Te({ source: e.source, tokens: t }));
        if (((t.base = e.consume("typedef")), t.base))
          return (
            (n.idlType =
              ce(e, "typedef-type") || e.error("Typedef lacks a type")),
            (t.name =
              e.consumeKind("identifier") || e.error("Typedef lacks a name")),
            (e.current = n.this),
            (t.termination =
              e.consume(";") || e.error("Unterminated typedef, expected `;`")),
            n.this
          );
      }
      get type() {
        return "typedef";
      }
      get name() {
        return ne(this.tokens.name.value);
      }
      *validate(e) {
        yield* this.idlType.validate(e);
      }
      write(e) {
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.base),
            e.ts.type(this.idlType.write(e)),
            e.name_token(this.tokens.name, { data: this }),
            e.token(this.tokens.termination),
          ]),
          { data: this }
        );
      }
    }
    class Ee extends I {
      static parse(e, t) {
        const n = { base: t },
          r = fe(new Ee({ source: e.source, tokens: n }));
        return (
          (n.name =
            e.consumeKind("identifier") || e.error("Callback lacks a name")),
          (e.current = r.this),
          (n.assign =
            e.consume("=") || e.error("Callback lacks an assignment")),
          (r.idlType = le(e) || e.error("Callback lacks a return type")),
          (n.open =
            e.consume("(") ||
            e.error("Callback lacks parentheses for arguments")),
          (r.arguments = ae(e)),
          (n.close = e.consume(")") || e.error("Unterminated callback")),
          (n.termination =
            e.consume(";") || e.error("Unterminated callback, expected `;`")),
          r.this
        );
      }
      get type() {
        return "callback";
      }
      get name() {
        return ne(this.tokens.name.value);
      }
      *validate(e) {
        yield* this.extAttrs.validate(e);
        for (const t of this.arguments)
          if ((yield* t.validate(e), "async_sequence" === t.idlType.generic)) {
            const e =
              "async_sequence types cannot be returned as a callback argument.";
            yield N(t.tokens.name, t, "async-sequence-idl-to-js", e);
          }
        yield* this.idlType.validate(e);
      }
      write(e) {
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.base),
            e.name_token(this.tokens.name, { data: this }),
            e.token(this.tokens.assign),
            e.ts.type(this.idlType.write(e)),
            e.token(this.tokens.open),
            ...this.arguments.map(t => t.write(e)),
            e.token(this.tokens.close),
            e.token(this.tokens.termination),
          ]),
          { data: this }
        );
      }
    }
    class Re extends I {
      static parse(e, t, { inheritable: n, allowedMembers: r }) {
        const { tokens: s, type: i } = t;
        for (
          s.name =
            e.consumeKind("identifier") || e.error(`Missing name in ${i}`),
            e.current = t,
            t = fe(t),
            n &&
              Object.assign(
                s,
                (function (e) {
                  const t = e.consume(":");
                  return t
                    ? {
                        colon: t,
                        inheritance:
                          e.consumeKind("identifier") ||
                          e.error("Inheritance lacks a type"),
                      }
                    : {};
                })(e)
              ),
            s.open = e.consume("{") || e.error(`Bodyless ${i}`),
            t.members = [];
          ;
        ) {
          if (((s.close = e.consume("}")), s.close))
            return (
              (s.termination =
                e.consume(";") || e.error(`Missing semicolon after ${i}`)),
              t.this
            );
          const n = G.parse(e);
          let o;
          for (const [t, ...n] of r) if (((o = fe(t(e, ...n))), o)) break;
          (o || e.error("Unknown member"),
            (o.extAttrs = n),
            t.members.push(o.this));
        }
      }
      get partial() {
        return !!this.tokens.partial;
      }
      get name() {
        return ne(this.tokens.name.value);
      }
      get inheritance() {
        return this.tokens.inheritance
          ? ne(this.tokens.inheritance.value)
          : null;
      }
      *validate(e) {
        for (const t of this.members) t.validate && (yield* t.validate(e));
      }
      write(e) {
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.callback),
            e.token(this.tokens.partial),
            e.token(this.tokens.base),
            e.token(this.tokens.mixin),
            e.name_token(this.tokens.name, { data: this }),
            (() =>
              this.tokens.inheritance
                ? e.ts.wrap([
                    e.token(this.tokens.colon),
                    e.ts.trivia(this.tokens.inheritance.trivia),
                    e.ts.inheritance(
                      e.reference(this.tokens.inheritance.value, {
                        context: this,
                      })
                    ),
                  ])
                : "")(),
            e.token(this.tokens.open),
            e.ts.wrap(this.members.map(t => t.write(e))),
            e.token(this.tokens.close),
            e.token(this.tokens.termination),
          ]),
          { data: this }
        );
      }
    }
    class Ae extends I {
      static parse(e) {
        const t = {};
        if (((t.base = e.consume("const")), !t.base)) return;
        let n = oe(e);
        if (!n) {
          const t =
            e.consumeKind("identifier") || e.error("Const lacks a type");
          n = new K({ source: e.source, tokens: { base: t } });
        }
        (e.probe("?") && e.error("Unexpected nullable constant type"),
          (n.type = "const-type"),
          (t.name =
            e.consumeKind("identifier") || e.error("Const lacks a name")),
          (t.assign =
            e.consume("=") || e.error("Const lacks value assignment")),
          (t.value = se(e) || e.error("Const lacks a value")),
          (t.termination =
            e.consume(";") || e.error("Unterminated const, expected `;`")));
        const r = new Ae({ source: e.source, tokens: t });
        return ((fe(r).idlType = n), r);
      }
      get type() {
        return "const";
      }
      get name() {
        return ne(this.tokens.name.value);
      }
      get value() {
        return ie(this.tokens.value);
      }
      write(e) {
        const { parent: t } = this;
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.base),
            e.ts.type(this.idlType.write(e)),
            e.name_token(this.tokens.name, { data: this, parent: t }),
            e.token(this.tokens.assign),
            e.token(this.tokens.value),
            e.token(this.tokens.termination),
          ]),
          { data: this, parent: t }
        );
      }
    }
    class Le extends I {
      static parse(e) {
        const t = e.position,
          n = fe(new Le({ source: e.source, tokens: {} })),
          { tokens: r } = n;
        if (
          ((r.readonly = e.consume("readonly")),
          r.readonly || (r.async = e.consume("async")),
          (r.base = r.readonly
            ? e.consume("maplike", "setlike")
            : r.async
              ? e.consume("iterable")
              : e.consume("iterable", "async_iterable", "maplike", "setlike")),
          !r.base)
        )
          return void e.unconsume(t);
        const { type: s } = n,
          i = "maplike" === s,
          o = i || "iterable" === s || "async_iterable" === s,
          a = "async_iterable" === s || (n.async && "iterable" === s);
        r.open =
          e.consume("<") ||
          e.error(`Missing less-than sign \`<\` in ${s} declaration`);
        const c =
          ce(e) || e.error(`Missing a type argument in ${s} declaration`);
        return (
          (n.idlType = [c]),
          (n.arguments = []),
          o &&
            ((c.tokens.separator = e.consume(",")),
            c.tokens.separator
              ? n.idlType.push(ce(e))
              : i &&
                e.error(`Missing second type argument in ${s} declaration`)),
          (r.close =
            e.consume(">") ||
            e.error(`Missing greater-than sign \`>\` in ${s} declaration`)),
          e.probe("(") &&
            (a
              ? ((r.argsOpen = e.consume("(")),
                n.arguments.push(...ae(e)),
                (r.argsClose =
                  e.consume(")") ||
                  e.error("Unterminated async iterable argument list")))
              : e.error("Arguments are only allowed for `async iterable`")),
          (r.termination =
            e.consume(";") ||
            e.error(`Missing semicolon after ${s} declaration`)),
          n.this
        );
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
      *validate(e) {
        if (this.async && "iterable" === this.type) {
          const e = "`async iterable` is now changed to `async_iterable`.";
          yield N(
            this.tokens.async,
            this,
            "obsolete-async-iterable-syntax",
            e,
            {
              autofix:
                ((t = this),
                () => {
                  const e = t.tokens.async;
                  ((t.tokens.base = {
                    ...e,
                    type: "async_iterable",
                    value: "async_iterable",
                  }),
                    delete t.tokens.async);
                }),
            }
          );
        }
        var t;
        for (const t of this.idlType) yield* t.validate(e);
        for (const t of this.arguments) yield* t.validate(e);
      }
      write(e) {
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.readonly),
            e.token(this.tokens.async),
            e.token(this.tokens.base, e.ts.generic),
            e.token(this.tokens.open),
            e.ts.wrap(this.idlType.map(t => t.write(e))),
            e.token(this.tokens.close),
            e.token(this.tokens.argsOpen),
            e.ts.wrap(this.arguments.map(t => t.write(e))),
            e.token(this.tokens.argsClose),
            e.token(this.tokens.termination),
          ]),
          { data: this, parent: this.parent }
        );
      }
    }
    class Pe extends I {
      static parse(e) {
        const t = e.consume("constructor");
        if (!t) return;
        const n = { base: t };
        n.open = e.consume("(") || e.error("No argument list in constructor");
        const r = ae(e);
        ((n.close = e.consume(")") || e.error("Unterminated constructor")),
          (n.termination =
            e.consume(";") || e.error("No semicolon after constructor")));
        const s = new Pe({ source: e.source, tokens: n });
        return ((fe(s).arguments = r), s);
      }
      get type() {
        return "constructor";
      }
      *validate(e) {
        for (const t of this.arguments) yield* t.validate(e);
      }
      write(e) {
        const { parent: t } = this;
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.base, e.ts.nameless, { data: this, parent: t }),
            e.token(this.tokens.open),
            e.ts.wrap(this.arguments.map(t => t.write(e))),
            e.token(this.tokens.close),
            e.token(this.tokens.termination),
          ]),
          { data: this, parent: t }
        );
      }
    }
    function Ne(e) {
      const t = e.consume("static");
      if (!t) return;
      return (
        te.parse(e, { special: t }) ||
        ee.parse(e, { special: t }) ||
        e.error("No body in static member")
      );
    }
    class Ie extends Re {
      static parse(e, t, { extMembers: n = [], partial: r = null } = {}) {
        const s = { partial: r, base: t };
        return Re.parse(e, new Ie({ source: e.source, tokens: s }), {
          inheritable: !r,
          allowedMembers: [
            ...n,
            [Ae.parse],
            [Pe.parse],
            [Ne],
            [ue],
            [Le.parse],
            [te.parse],
            [ee.parse],
          ],
        });
      }
      get type() {
        return "interface";
      }
      *validate(e) {
        if (
          (yield* this.extAttrs.validate(e),
          !this.partial && this.extAttrs.every(e => "Exposed" !== e.name))
        ) {
          const e =
            "Interfaces must have `[Exposed]` extended attribute. To fix, add, for example, `[Exposed=Window]`. Please also consider carefully if your interface should also be exposed in a Worker scope. Refer to the [WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) for more information.";
          yield N(this.tokens.name, this, "require-exposed", e, {
            autofix: pe(this),
          });
        }
        const t = this.extAttrs.filter(e => "Constructor" === e.name);
        for (const e of t) {
          const t =
            "Constructors should now be represented as a `constructor()` operation on the interface instead of `[Constructor]` extended attribute. Refer to the [WebIDL spec section on constructor operations](https://heycam.github.io/webidl/#idl-constructors) for more information.";
          yield N(e.tokens.name, this, "constructor-member", t, {
            autofix: De(this, e),
          });
        }
        if (this.extAttrs.some(e => "Global" === e.name)) {
          const e = this.extAttrs.filter(
            e => "LegacyFactoryFunction" === e.name
          );
          for (const t of e) {
            const e =
              "Interfaces marked as `[Global]` cannot have factory functions.";
            yield N(t.tokens.name, this, "no-constructible-global", e);
          }
          const t = this.members.filter(e => "constructor" === e.type);
          for (const e of t) {
            const t =
              "Interfaces marked as `[Global]` cannot have constructors.";
            yield N(e.tokens.base, this, "no-constructible-global", t);
          }
        }
        (yield* super.validate(e),
          this.partial ||
            (yield* (function* (e, t) {
              const n = (function (e) {
                  const t = o(e);
                  return {
                    statics: new Set(
                      t.filter(e => "static" === e.special).map(e => e.name)
                    ),
                    nonstatics: new Set(
                      t.filter(e => "static" !== e.special).map(e => e.name)
                    ),
                  };
                })(t),
                r = e.partials.get(t.name) || [],
                s = e.mixinMap.get(t.name) || [];
              for (const e of [...r, ...s]) {
                const r = o(e),
                  s = r.filter(e => "static" === e.special),
                  a = r.filter(e => "static" !== e.special);
                (yield* i(s, n.statics, e, t),
                  yield* i(a, n.nonstatics, e, t),
                  s.forEach(e => n.statics.add(e.name)),
                  a.forEach(e => n.nonstatics.add(e.name)));
              }
              function* i(e, t, n, r) {
                for (const s of e) {
                  const { name: e } = s;
                  if (e && t.has(e)) {
                    const t = `The ${"static" === s.special ? "static " : ""}operation "${e}" has already been defined for the base interface "${r.name}" either in itself or in a mixin`;
                    yield N(s.tokens.name, n, "no-cross-overload", t);
                  }
                }
              }
              function o(e) {
                return e.members.filter(({ type: e }) => "operation" === e);
              }
            })(e, this)));
      }
    }
    function De(e, t) {
      return (
        (e = fe(e)),
        () => {
          const n = de(e.extAttrs.tokens.open.trivia),
            r = e.members.length
              ? de(he(e.members[0]).trivia)
              : (function (e) {
                  const t = de(e),
                    n = t.includes("\t") ? "\t" : "  ";
                  return t + n;
                })(n),
            s = Pe.parse(new $e(`\n${r}constructor();`));
          ((s.extAttrs = new G({ source: e.source, tokens: {} })),
            (fe(s).arguments = t.arguments));
          const i = (function (e, t) {
            const n = e.slice().reverse().findIndex(t);
            return -1 === n ? n : e.length - n - 1;
          })(e.members, e => "constructor" === e.type);
          e.members.splice(i + 1, 0, s);
          const { close: o } = e.tokens;
          o.trivia.includes("\n") || (o.trivia += `\n${n}`);
          const { extAttrs: a } = e,
            c = a.indexOf(t),
            l = a.splice(c, 1);
          a.length
            ? a.length === c
              ? (a[c - 1].tokens.separator = void 0)
              : a[c].tokens.name.trivia.trim() ||
                (a[c].tokens.name.trivia = l[0].tokens.name.trivia)
            : (a.tokens.open = a.tokens.close = void 0);
        }
      );
    }
    class Oe extends Re {
      static parse(e, t, { extMembers: n = [], partial: r } = {}) {
        const s = { partial: r, base: t };
        if (((s.mixin = e.consume("mixin")), s.mixin))
          return Re.parse(e, new Oe({ source: e.source, tokens: s }), {
            allowedMembers: [
              ...n,
              [Ae.parse],
              [ue],
              [te.parse, { noInherit: !0 }],
              [ee.parse, { regular: !0 }],
            ],
          });
      }
      get type() {
        return "interface mixin";
      }
    }
    class je extends I {
      static parse(e) {
        const t = {},
          n = fe(new je({ source: e.source, tokens: t }));
        return (
          (n.extAttrs = G.parse(e)),
          (t.required = e.consume("required")),
          (n.idlType =
            ce(e, "dictionary-type") ||
            e.error("Dictionary member lacks a type")),
          (t.name =
            e.consumeKind("identifier") ||
            e.error("Dictionary member lacks a name")),
          (n.default = Z.parse(e)),
          t.required &&
            n.default &&
            e.error("Required member must not have a default"),
          (t.termination =
            e.consume(";") ||
            e.error("Unterminated dictionary member, expected `;`")),
          n.this
        );
      }
      get type() {
        return "field";
      }
      get name() {
        return ne(this.tokens.name.value);
      }
      get required() {
        return !!this.tokens.required;
      }
      *validate(e) {
        yield* this.idlType.validate(e);
      }
      write(e) {
        const { parent: t } = this;
        return e.ts.definition(
          e.ts.wrap([
            this.extAttrs.write(e),
            e.token(this.tokens.required),
            e.ts.type(this.idlType.write(e)),
            e.name_token(this.tokens.name, { data: this, parent: t }),
            this.default ? this.default.write(e) : "",
            e.token(this.tokens.termination),
          ]),
          { data: this, parent: t }
        );
      }
    }
    class ze extends Re {
      static parse(e, { extMembers: t = [], partial: n } = {}) {
        const r = { partial: n };
        if (((r.base = e.consume("dictionary")), r.base))
          return Re.parse(e, new ze({ source: e.source, tokens: r }), {
            inheritable: !n,
            allowedMembers: [...t, [je.parse]],
          });
      }
      get type() {
        return "dictionary";
      }
    }
    class Me extends Re {
      static parse(e, { extMembers: t = [], partial: n } = {}) {
        const r = { partial: n };
        if (((r.base = e.consume("namespace")), r.base))
          return Re.parse(e, new Me({ source: e.source, tokens: r }), {
            allowedMembers: [
              ...t,
              [te.parse, { noInherit: !0, readonly: !0 }],
              [Ae.parse],
              [ee.parse, { regular: !0 }],
            ],
          });
      }
      get type() {
        return "namespace";
      }
      *validate(e) {
        if (!this.partial && this.extAttrs.every(e => "Exposed" !== e.name)) {
          const e =
            "Namespaces must have [Exposed] extended attribute. To fix, add, for example, [Exposed=Window]. Please also consider carefully if your namespace should also be exposed in a Worker scope. Refer to the [WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) for more information.";
          yield N(this.tokens.name, this, "require-exposed", e, {
            autofix: pe(this),
          });
        }
        yield* super.validate(e);
      }
    }
    class qe extends Re {
      static parse(e, t, { extMembers: n = [] } = {}) {
        const r = { callback: t };
        if (((r.base = e.consume("interface")), r.base))
          return Re.parse(e, new qe({ source: e.source, tokens: r }), {
            allowedMembers: [...n, [Ae.parse], [ee.parse, { regular: !0 }]],
          });
      }
      get type() {
        return "callback interface";
      }
    }
    function Ue(e, t) {
      const n = e.source;
      function r(t) {
        e.error(t);
      }
      function s(...t) {
        return e.consume(...t);
      }
      function i(n) {
        const i = s("interface");
        if (i)
          return (
            Oe.parse(e, i, { ...n, ...t?.extensions?.mixin }) ||
            Ie.parse(e, i, { ...n, ...t?.extensions?.interface }) ||
            r("Interface has no proper body")
          );
      }
      function o() {
        if (t.productions)
          for (const n of t.productions) {
            const t = n(e);
            if (t) return t;
          }
        return (
          (function () {
            const n = s("callback");
            if (n)
              return e.probe("interface")
                ? qe.parse(e, n, { ...t?.extensions?.callbackInterface })
                : Ee.parse(e, n);
          })() ||
          i() ||
          (function () {
            const n = s("partial");
            if (n)
              return (
                ze.parse(e, { partial: n, ...t?.extensions?.dictionary }) ||
                i({ partial: n }) ||
                Me.parse(e, { partial: n, ...t?.extensions?.namespace }) ||
                r("Partial doesn't apply to anything")
              );
          })() ||
          ze.parse(e, t?.extensions?.dictionary) ||
          _e.parse(e) ||
          Te.parse(e) ||
          Se.parse(e) ||
          Me.parse(e, t?.extensions?.namespace)
        );
      }
      const a = (function () {
        if (!n.length) return [];
        const s = [];
        for (;;) {
          const t = G.parse(e),
            n = o();
          if (!n) {
            t.length && r("Stray extended attributes");
            break;
          }
          ((fe(n).extAttrs = t), s.push(n));
        }
        const i = M.parse(e);
        return (t.concrete && s.push(i), s);
      })();
      return (e.position < n.length && r("Unrecognised tokens"), a);
    }
    function We(e) {
      return e;
    }
    const Fe = {
      wrap: e => e.join(""),
      trivia: We,
      name: We,
      reference: We,
      type: We,
      generic: We,
      nameless: We,
      inheritance: We,
      definition: We,
      extendedAttribute: We,
      extendedAttributeReference: We,
    };
    class Be {
      constructor(e) {
        this.ts = Object.assign({}, Fe, e);
      }
      reference(e, { unescaped: t, context: n }) {
        return (
          t || (t = e.startsWith("_") ? e.slice(1) : e),
          this.ts.reference(e, t, n)
        );
      }
      token(e, t = We, ...n) {
        if (!e) return "";
        const r = t(e.value, ...n);
        return this.ts.wrap([this.ts.trivia(e.trivia), r]);
      }
      reference_token(e, t) {
        return this.token(e, this.reference.bind(this), { context: t });
      }
      name_token(e, t) {
        return this.token(e, this.ts.name, t);
      }
      identifier(e, t) {
        return this.ts.wrap([
          this.reference_token(e.tokens.value, t),
          this.token(e.tokens.separator),
        ]);
      }
    }
    function He(e, t) {
      const n = new Map(),
        r = e.filter(e => "includes" === e.type);
      for (const e of r) {
        const r = t.get(e.includes);
        if (!r) continue;
        const s = n.get(e.target);
        s ? s.push(r) : n.set(e.target, [r]);
      }
      return n;
    }
    function* Ge(e) {
      const t = (function (e) {
        const t = new Map(),
          n = new Set(),
          r = new Map();
        for (const s of e)
          if (s.partial) {
            const e = r.get(s.name);
            e ? e.push(s) : r.set(s.name, [s]);
          } else s.name && (t.has(s.name) ? n.add(s) : t.set(s.name, s));
        return {
          all: e,
          unique: t,
          partials: r,
          duplicates: n,
          mixinMap: He(e, t),
          cache: {
            typedefIncludesDictionary: new WeakMap(),
            dictionaryIncludesRequiredField: new WeakMap(),
          },
        };
      })(e);
      for (const e of t.all) e.validate && (yield* e.validate(t));
      yield* (function* ({ unique: e, duplicates: t }) {
        for (const n of t) {
          const { name: t } = n,
            r = `The name "${t}" of type "${e.get(t).type}" was already seen`;
          yield N(n.tokens.name, n, "no-duplicate", r);
        }
      })(t);
    }
    var Ve,
      Je = Object.freeze({
        __proto__: null,
        WebIDLParseError: xe,
        parse: function (e, t = {}) {
          const n = new $e(e);
          return (
            void 0 !== t.sourceName && (n.source.name = t.sourceName),
            Ue(n, t)
          );
        },
        validate: function (e) {
          return [...Ge(((t = e), t.flat ? t.flat() : [].concat(...t)))];
          var t;
        },
        write: function (e, { templates: t = Fe } = {}) {
          t = Object.assign({}, Fe, t);
          const n = new Be(t);
          return t.wrap(e.map(e => e.write(n)));
        },
      });
    !(function (e) {
      ((e.ILLEGAL = "ILLEGAL"),
        (e.EOF = "EOF"),
        (e.NL = "\n"),
        (e.SPACE = " "),
        (e.UNDERSCORE = "_"),
        (e.DOLLAR = "$"),
        (e.ATSIGN = "@"),
        (e.CARET = "^"),
        (e.HASH = "#"),
        (e.TILDE = "~"),
        (e.AMPERSAND = "&"),
        (e.IDENT = "IDENT"),
        (e.COMMENT = "COMMENT"),
        (e.STRING = "STRING"),
        (e.NUMBER = "NUMBER"),
        (e.FLOAT = "FLOAT"),
        (e.CTLOP = "CTLOP"),
        (e.BYTES = "BYTES"),
        (e.HEX = "HEX"),
        (e.BASE64 = "BASE64"),
        (e.ASSIGN = "="),
        (e.ARROWMAP = "=>"),
        (e.TCHOICE = "/"),
        (e.GCHOICE = "//"),
        (e.TCHOICEALT = "/="),
        (e.GCHOICEALT = "//="),
        (e.PLUS = "+"),
        (e.MINUS = "-"),
        (e.QUEST = "?"),
        (e.ASTERISK = "*"),
        (e.INCLRANGE = ".."),
        (e.EXCLRANGE = "..."),
        (e.COMMA = ","),
        (e.DOT = "."),
        (e.COLON = ":"),
        (e.SEMICOLON = ";"),
        (e.LPAREN = "("),
        (e.RPAREN = ")"),
        (e.LBRACE = "{"),
        (e.RBRACE = "}"),
        (e.LBRACK = "["),
        (e.RBRACK = "]"),
        (e.LT = "<"),
        (e.GT = ">"),
        (e.QUOT = '"'));
    })(Ve || (Ve = {}));
    const Ke = Object.entries(Ve).reduce((e, [t, n]) => ((e[n] = t), e), {});
    class Ye {
      type;
      literal;
      comments;
      whitespace;
      constructor(e, t, n = [], r = "") {
        ((this.type = e),
          (this.literal = t),
          (this.comments = n),
          (this.whitespace = r));
      }
      serialize() {
        let e = "";
        for (const t of this.comments) e += t.serialize();
        switch (((e += this.whitespace), this.type)) {
          case Ve.IDENT:
          case Ve.COMMENT:
          case Ve.NUMBER:
          case Ve.FLOAT:
            e += this.literal;
            break;
          case Ve.STRING:
            e += '"' + this.literal + '"';
            break;
          case Ve.CTLOP:
            e += "." + this.literal;
            break;
          case Ve.BYTES:
            e += "'" + this.literal + "'";
            break;
          case Ve.HEX:
            e += "h'" + this.literal + "'";
            break;
          case Ve.BASE64:
            e += "b64'" + this.literal + "'";
            break;
          case Ve.EOF:
            break;
          default:
            e += this.type.valueOf();
        }
        return e;
      }
      startWithSpaces() {
        return "" !== this.whitespace || this.comments.length > 0;
      }
      toString(e = 0) {
        const t = [
          `${"  ".repeat(e)}${this.constructor.name}: ${Ke[this.type]} (${this.type})`,
        ];
        ("" !== this.whitespace &&
          t.push("  ".repeat(e + 1) + `whitespaces: ${this.whitespace.length}`),
          "" !== this.literal &&
            t.push("  ".repeat(e + 1) + `literal: ${this.literal}`));
        for (const n of this.comments) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return {
          type: this.type,
          literal: this.literal,
          comments: this.comments?.map(e => e.toJSON()),
          whitespace: this.whitespace,
        };
      }
    }
    class Ze {
      parentNode = null;
      serialize(e) {
        if ((this.setChildrenParent(), e)) {
          const t = e.markupFor(this);
          let n = null !== t[0] ? t[0] : "";
          return (
            (n += this._serialize(e)),
            (n += null !== t[1] ? t[1] : ""),
            n
          );
        }
        return this._serialize();
      }
      setChildrenParent() {
        for (const e of this.getChildren())
          ((e.parentNode = this), e.setChildrenParent());
      }
      getChildren() {
        return [];
      }
      _serializeToken(e, t) {
        return e ? (t ? t.serializeToken(e, this) : e.serialize()) : "";
      }
      toString(e = 0) {
        return "  ".repeat(e) + this.constructor.name;
      }
      toJSON() {
        return {};
      }
    }
    class Xe extends Ze {
      openToken = null;
      closeToken = null;
      serialize(e) {
        let t = "";
        if (e) {
          const n = e.markupFor(this);
          t += null !== n[0] ? n[0] : "";
        }
        if (
          ((t += this._serializeToken(this.openToken, e)),
          (t += this._serialize(e)),
          (t += this._serializeToken(this.closeToken, e)),
          e)
        ) {
          const n = e.markupFor(this);
          t += null !== n[1] ? n[1] : "";
        }
        return t;
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        return (
          this.openToken && t.push(this.openToken.toString(e + 1)),
          this.closeToken && t.push(this.closeToken.toString(e + 1)),
          t.join("\n")
        );
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          openToken: this.openToken?.toJSON(),
          closeToken: this.closeToken?.toJSON(),
        });
      }
    }
    class Qe extends Xe {
      comments = [];
      whitespace = "";
      separator = null;
      _prestr(e) {
        return "";
      }
      serialize(e) {
        let t = this._prestr(e);
        for (const n of this.comments) t += this._serializeToken(n, e);
        return (
          (t += this.whitespace),
          (t += super.serialize(e)),
          (t += this._serializeToken(this.separator, e)),
          t
        );
      }
      setComments(e) {
        ((this.comments = e.comments), (this.whitespace = e.whitespace));
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.comments) t.push(n.toString(e + 1));
        return (
          "" !== this.whitespace &&
            t.push(
              "  ".repeat(e + 1) + `whitespaces: ${this.whitespace.length}`
            ),
          this.separator && t.push(this.separator.toString(e + 1)),
          t.join("\n")
        );
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          comments: this.comments.map(e => e.toJSON()),
          whitespace: this.whitespace,
          separator: this.separator?.toJSON(),
        });
      }
    }
    class et extends Qe {
      rules;
      constructor(e) {
        (super(), (this.rules = e));
      }
      getChildren() {
        return this.rules;
      }
      _serialize(e) {
        return this.rules.map(t => t.serialize(e)).join("");
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.rules) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          rules: this.rules.map(e => e.toJSON()),
        });
      }
    }
    class tt extends Ze {
      name;
      assign;
      type;
      constructor(e, t, n) {
        (super(), (this.name = e), (this.assign = t), (this.type = n));
      }
      getChildren() {
        return [this.name, this.type];
      }
      _serialize(e) {
        let t = this.name.serialize(e);
        return (
          (t += this._serializeToken(this.assign, e)),
          (t += this.type.serialize(e)),
          t
        );
      }
      toString(e = 0) {
        return [
          super.toString(e),
          this.name.toString(e + 1),
          this.assign.toString(e + 1),
          this.type.toString(e + 1),
        ].join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          name: this.name.toJSON(),
          assign: this.assign.toJSON(),
          type: this.type.toJSON(),
        });
      }
    }
    class nt extends Qe {
      occurrence;
      key;
      type;
      constructor(e, t, n) {
        (super(), (this.occurrence = e), (this.key = t), (this.type = n));
      }
      getChildren() {
        const e = [];
        return (
          this.occurrence && e.push(this.occurrence),
          this.key && e.push(this.key),
          e.push(this.type),
          e
        );
      }
      _serialize(e) {
        let t = "";
        return (
          this.occurrence && (t += this.occurrence.serialize(e)),
          this.key && (t += this.key.serialize(e)),
          (t += this.type.serialize(e)),
          t
        );
      }
      isConvertibleToType() {
        return (
          null === this.occurrence &&
          null === this.key &&
          (!(this.type instanceof rt) ||
            this.type instanceof it ||
            this.type instanceof st)
        );
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        return (
          this.occurrence && t.push(this.occurrence.toString(e + 1)),
          this.key && t.push(this.key.toString(e + 1)),
          t.push(this.type.toString(e + 1)),
          t.join("\n")
        );
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          occurrence: this.occurrence?.toJSON(),
          key: this.key?.toJSON(),
          type: this.type.toJSON(),
        });
      }
    }
    class rt extends Qe {
      groupChoices;
      constructor(e) {
        (super(), (this.groupChoices = e));
      }
      getChildren() {
        return this.groupChoices;
      }
      _serialize(e) {
        return this.groupChoices.map(t => t.serialize(e)).join("");
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.groupChoices) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          groupChoices: this.groupChoices.map(e => e.toJSON()),
        });
      }
    }
    let st = class extends rt {},
      it = class extends rt {};
    class ot extends Qe {
      groupEntries;
      constructor(e) {
        (super(), (this.groupEntries = e));
      }
      getChildren() {
        return this.groupEntries;
      }
      _serialize(e) {
        return this.groupEntries.map(t => t.serialize(e)).join("");
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.groupEntries) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          groupEntries: this.groupEntries.map(e => e.toJSON()),
        });
      }
    }
    class at extends Qe {
      numericPart;
      typePart;
      constructor(e = null, t = null) {
        (super(), (this.numericPart = e), (this.typePart = t));
      }
      getChildren() {
        return this.typePart ? [this.typePart] : [];
      }
      _serialize(e) {
        let t = this._serializeToken(new Ye(Ve.HASH, ""), e);
        return (
          (t += this._serializeToken(this.numericPart, e)),
          (t += this.typePart ? this.typePart.serialize(e) : ""),
          t
        );
      }
      toString(e = 0) {
        const t = [super.toString(e) + " (#)"];
        return (
          this.numericPart && t.push(this.numericPart.toString(e + 1)),
          this.typePart && t.push(this.typePart.toString(e + 1)),
          t.join("\n")
        );
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          numericPart: this.numericPart?.toJSON(),
          typePart: this.typePart?.toJSON(),
        });
      }
    }
    class ct extends Qe {
      n;
      m;
      tokens;
      constructor(e, t, n = []) {
        (super(), (this.n = e), (this.m = t), (this.tokens = n));
      }
      _serialize(e) {
        return this.tokens.map(t => this._serializeToken(t, e)).join("");
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.tokens) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          n: this.n,
          m: this.m,
          tokens: this.tokens.map(e => e.toJSON()),
        });
      }
    }
    class lt extends Qe {
      value;
      type;
      constructor(e, t) {
        (super(), (this.value = e), (this.type = t));
      }
      _serialize(e) {
        let t = "",
          n = "";
        return (
          "text" === this.type
            ? ((t = '"'), (n = '"'))
            : "bytes" === this.type
              ? ((t = "'"), (n = "'"))
              : "hex" === this.type
                ? ((t = "h'"), (n = "'"))
                : "base64" === this.type && ((t = "b64'"), (n = "'")),
          e ? e.serializeValue(t, this.value, n, this) : t + this.value + n
        );
      }
      toString(e = 0) {
        return (
          "  ".repeat(e) +
          `${this.constructor.name} (${this.type}): ${this.value}`
        );
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          value: this.value,
          type: this.type,
        });
      }
    }
    class ut extends Qe {
      name;
      unwrapped;
      parameters;
      constructor(e, t, n = null) {
        (super(), (this.name = e), (this.unwrapped = t), (this.parameters = n));
      }
      getChildren() {
        return this.parameters ? [this.parameters] : [];
      }
      _prestr(e) {
        return this._serializeToken(this.unwrapped, e);
      }
      _serialize(e) {
        let t = "";
        return (
          e ? (t += e.serializeName(this.name, this)) : (t = this.name),
          this.parameters && (t += this.parameters.serialize(e)),
          t
        );
      }
      toString(e = 0) {
        const t = [super.toString(e), "  ".repeat(e + 1) + this.name];
        return (
          this.unwrapped && t.push(this.unwrapped.toString(e + 1)),
          this.parameters && t.push(this.parameters.toString(e + 1)),
          t.join("\n")
        );
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          name: this.name,
          unwrapped: this.unwrapped?.toJSON(),
          parameters: this.parameters?.toJSON(),
        });
      }
    }
    class dt extends Qe {
      target;
      constructor(e) {
        (super(), (this.target = e));
      }
      getChildren() {
        return [this.target];
      }
      _serialize(e) {
        let t = this._serializeToken(new Ye(Ve.AMPERSAND, ""), e);
        return ((t += this.target.serialize(e)), t);
      }
      toString(e = 0) {
        return [super.toString(e) + " (&)", this.target.toString(e + 1)].join(
          "\n"
        );
      }
      toJSON() {
        return Object.assign(super.toJSON(), { target: this.target.toJSON() });
      }
    }
    class pt extends Qe {
      min;
      max;
      rangeop;
      constructor(e, t, n) {
        (super(), (this.min = e), (this.max = t), (this.rangeop = n));
      }
      getChildren() {
        return [this.min, this.max];
      }
      _serialize(e) {
        let t = this.min.serialize(e);
        return (
          (t += this._serializeToken(this.rangeop, e)),
          (t += this.max.serialize(e)),
          t
        );
      }
      toString(e = 0) {
        return [
          super.toString(e),
          this.min.toString(e + 1),
          this.rangeop.toString(e + 1),
          this.max.toString(e + 1),
        ].join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          min: this.min.toJSON(),
          max: this.max.toJSON(),
          rangeop: this.rangeop.toJSON(),
        });
      }
    }
    class ht extends Qe {
      type;
      name;
      controller;
      constructor(e, t, n) {
        (super(), (this.type = e), (this.name = t), (this.controller = n));
      }
      getChildren() {
        return [this.type, this.controller];
      }
      _serialize(e) {
        let t = this.type.serialize(e);
        return (
          (t += this._serializeToken(this.name, e)),
          (t += this.controller.serialize(e)),
          t
        );
      }
      toString(e = 0) {
        return [
          super.toString(e),
          this.type.toString(e + 1),
          this.name.toString(e + 1),
          this.controller.toString(e + 1),
        ].join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          type: this.type.toJSON(),
          name: this.name.toJSON(),
          controller: this.controller.toJSON(),
        });
      }
    }
    class ft extends Ze {
      type;
      hasCut;
      hasColon;
      tokens;
      constructor(e, t, n, r = []) {
        (super(),
          (this.type = e),
          (this.hasCut = t),
          (this.hasColon = n),
          (this.tokens = r));
      }
      getChildren() {
        return [this.type];
      }
      _serialize(e) {
        let t = this.type.serialize(e);
        return (
          (t += this.tokens.map(t => this._serializeToken(t, e)).join("")),
          t
        );
      }
      toString(e = 0) {
        const t = [super.toString(e), this.type.toString(e + 1)];
        for (const n of this.tokens) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          type: this.type.toJSON(),
          hasCut: this.hasCut,
          hasColon: this.hasColon,
          tokens: this.tokens.map(e => e.toJSON()),
        });
      }
    }
    class mt extends Qe {
      types;
      constructor(e) {
        (super(), (this.types = e));
      }
      getChildren() {
        return this.types;
      }
      _serialize(e) {
        return this.types.map(t => t.serialize(e)).join("");
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.types) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          types: this.types.map(e => e.toJSON()),
        });
      }
    }
    class gt extends Xe {
      parameters;
      constructor(e) {
        (super(), (this.parameters = e));
      }
      getChildren() {
        return this.parameters;
      }
      _serialize(e) {
        return this.parameters.map(t => t.serialize(e)).join("");
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.parameters) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          parameters: this.parameters.map(e => e.toJSON()),
        });
      }
    }
    class bt extends Xe {
      parameters;
      constructor(e) {
        (super(), (this.parameters = e));
      }
      getChildren() {
        return this.parameters;
      }
      _serialize(e) {
        return this.parameters.map(t => t.serialize(e)).join("");
      }
      toString(e = 0) {
        const t = [super.toString(e)];
        for (const n of this.parameters) t.push(n.toString(e + 1));
        return t.join("\n");
      }
      toJSON() {
        return Object.assign(super.toJSON(), {
          parameters: this.parameters.map(e => e.toJSON()),
        });
      }
    }
    class yt extends Error {
      constructor(e = "A parsing error occurred") {
        (super(e), (this.name = "ParserError"));
      }
    }
    function wt(e) {
      return (
        (function (e) {
          return ("a" <= e && e <= "z") || ("A" <= e && e <= "Z");
        })(e) || "@_$".includes(e)
      );
    }
    function kt(e) {
      return (
        e.length > 0 &&
        "123456789".includes(e[0]) &&
        [...e].every(e => "0123456789".includes(e))
      );
    }
    class vt {
      line;
      position;
      constructor(e = -1, t = -1) {
        ((this.line = e), (this.position = t));
      }
    }
    class $t {
      input;
      position = 0;
      readPosition = 0;
      ch = 0;
      constructor(e) {
        ((this.input = e), this.readChar());
      }
      readChar() {
        (this.readPosition >= this.input.length
          ? (this.ch = 0)
          : (this.ch = this.input.charCodeAt(this.readPosition)),
          (this.position = this.readPosition),
          (this.readPosition += 1));
      }
      _peekAtNextChar() {
        return this.readPosition >= this.input.length
          ? ""
          : this.input[this.readPosition];
      }
      getLocation() {
        const e = this.position - 2,
          t = this.input.split("\n");
        let n = 0;
        for (let r = 0; r < t.length; r++) {
          const s = t[r].length;
          if (((n += s + 1), n > e)) {
            return new vt(r, e - (n - s) + 1);
          }
        }
        return new vt(0, 0);
      }
      getLine(e) {
        return this.input.split("\n")[e];
      }
      getLocationInfo() {
        const e = this.getLocation();
        let t = (e.line >= 0 ? this.getLine(e.line) : "") + "\n";
        return (
          (t += " ".repeat(e.position >= 0 ? e.position : 0) + "^\n"),
          (t += " ".repeat(e.position >= 0 ? e.position : 0) + "|\n"),
          t
        );
      }
      nextToken() {
        const e = this._readComments();
        let t = "";
        e.length > 0 &&
          "" === e[e.length - 1].literal &&
          ((t = e[e.length - 1].whitespace), e.pop());
        let n = new Ye(Ve.ILLEGAL, "");
        const r = String.fromCharCode(this.ch);
        let s = !1;
        if ("=" === r)
          ">" === this._peekAtNextChar()
            ? (this.readChar(), (n = new Ye(Ve.ARROWMAP, "", e, t)))
            : (n = new Ye(Ve.ASSIGN, "", e, t));
        else if ("(" === r) n = new Ye(Ve.LPAREN, "", e, t);
        else if (")" === r) n = new Ye(Ve.RPAREN, "", e, t);
        else if ("{" === r) n = new Ye(Ve.LBRACE, "", e, t);
        else if ("}" === r) n = new Ye(Ve.RBRACE, "", e, t);
        else if ("[" === r) n = new Ye(Ve.LBRACK, "", e, t);
        else if ("]" === r) n = new Ye(Ve.RBRACK, "", e, t);
        else if ("<" === r) n = new Ye(Ve.LT, "", e, t);
        else if (">" === r) n = new Ye(Ve.GT, "", e, t);
        else if ("+" === r) n = new Ye(Ve.PLUS, "", e, t);
        else if ("," === r) n = new Ye(Ve.COMMA, "", e, t);
        else if ("." === r)
          "." === this._peekAtNextChar()
            ? (this.readChar(),
              (n = new Ye(Ve.INCLRANGE, "", e, t)),
              "." === this._peekAtNextChar() &&
                (this.readChar(), (n = new Ye(Ve.EXCLRANGE, "", e, t))))
            : wt(this._peekAtNextChar()) &&
              (this.readChar(),
              (n = new Ye(Ve.CTLOP, this._readIdentifier(), e, t)),
              (s = !0));
        else if (":" === r) n = new Ye(Ve.COLON, "", e, t);
        else if ("?" === r) n = new Ye(Ve.QUEST, "", e, t);
        else if ("/" === r)
          "/" === this._peekAtNextChar()
            ? (this.readChar(),
              (n = new Ye(Ve.GCHOICE, "", e, t)),
              "=" === this._peekAtNextChar() &&
                (this.readChar(), (n = new Ye(Ve.GCHOICEALT, "", e, t))))
            : "=" === this._peekAtNextChar()
              ? (this.readChar(), (n = new Ye(Ve.TCHOICEALT, "", e, t)))
              : (n = new Ye(Ve.TCHOICE, "", e, t));
        else if ("*" === r) n = new Ye(Ve.ASTERISK, "", e, t);
        else if ("^" === r) n = new Ye(Ve.CARET, "", e, t);
        else if ("#" === r) n = new Ye(Ve.HASH, "", e, t);
        else if ("~" === r) n = new Ye(Ve.TILDE, "", e, t);
        else if ('"' === r) n = new Ye(Ve.STRING, this._readString(), e, t);
        else if ("'" === r) n = new Ye(Ve.BYTES, this._readBytesString(), e, t);
        else if (";" === r)
          ((n = new Ye(Ve.COMMENT, this._readComment(), e, t)), (s = !0));
        else if ("&" === r) n = new Ye(Ve.AMPERSAND, "", e, t);
        else if (0 === this.ch) n = new Ye(Ve.EOF, "", e, t);
        else if (wt(r))
          "b" === r && "6" === this._peekAtNextChar()
            ? (this.readChar(),
              this.readChar(),
              "4" === String.fromCharCode(this.ch) &&
              "'" === this._peekAtNextChar()
                ? (this.readChar(),
                  (n = new Ye(Ve.BASE64, this._readBytesString(), e, t)))
                : ((n = new Ye(Ve.IDENT, this._readIdentifier("b6"), e, t)),
                  (s = !0)))
            : "h" === r && "'" === this._peekAtNextChar()
              ? (this.readChar(),
                (n = new Ye(Ve.HEX, this._readBytesString(), e, t)))
              : ((n = new Ye(Ve.IDENT, this._readIdentifier(), e, t)),
                (s = !0));
        else if (this._isDigit(r) || "-" === r) {
          const r = this._readNumberOrFloat();
          ((n = new Ye(r.includes(".") ? Ve.FLOAT : Ve.NUMBER, r, e, t)),
            (s = !0));
        }
        return (s || this.readChar(), n);
      }
      _isDigit(e) {
        return e >= "0" && e <= "9";
      }
      _readIdentifier(e = "") {
        const t = this.position;
        if ("" === e && !wt(String.fromCharCode(this.ch)))
          throw this._tokenError("expected identifier, got nothing");
        for (
          ;
          wt(String.fromCharCode(this.ch)) ||
          this._isDigit(String.fromCharCode(this.ch)) ||
          "-. ".includes(String.fromCharCode(this.ch));
        ) {
          if (" " === String.fromCharCode(this.ch)) break;
          this.readChar();
        }
        const n = e + this.input.substring(t, this.position);
        if (n.endsWith("-") || n.endsWith("."))
          throw this._tokenError(
            `identifier cannot end with \`-\` or \`.\`, got \`${n}\``
          );
        return n;
      }
      _readComment() {
        const e = this.position;
        for (; this.ch && "\n" !== String.fromCharCode(this.ch); )
          this.readChar();
        return this.input.substring(e, this.position);
      }
      _readString() {
        const e = this.position;
        for (this.readChar(); '"' !== String.fromCharCode(this.ch); )
          if (
            (this.ch >= 32 && this.ch <= 33) ||
            (this.ch >= 35 && this.ch <= 91) ||
            (this.ch >= 93 && this.ch <= 126) ||
            (this.ch >= 128 && this.ch <= 1114109)
          )
            this.readChar();
          else if ("\\" === String.fromCharCode(this.ch)) {
            if (
              (this.readChar(),
              !(
                (this.ch >= 32 && this.ch <= 126) ||
                (this.ch >= 128 && this.ch <= 1114109)
              ))
            )
              throw this._tokenError(
                `invalid escape character in text string \`${this.input.substring(e + 1, this.position)}\``
              );
            this.readChar();
          } else if (10 === this.ch) this.readChar();
          else {
            if (13 !== this.ch || 10 !== this._peekAtNextChar().charCodeAt(0))
              throw this._tokenError(
                `invalid text string \`${this.input.substring(e + 1, this.position)}\``
              );
            (this.readChar(), this.readChar());
          }
        return this.input.substring(e + 1, this.position);
      }
      _readBytesString() {
        const e = this.position;
        for (this.readChar(); "'" !== String.fromCharCode(this.ch); )
          if (
            (this.ch >= 32 && this.ch <= 38) ||
            (this.ch >= 40 && this.ch <= 91) ||
            (this.ch >= 93 && this.ch <= 1114109)
          )
            this.readChar();
          else if ("\\" === String.fromCharCode(this.ch)) {
            if (
              (this.readChar(),
              !(
                (this.ch >= 32 && this.ch <= 126) ||
                (this.ch >= 128 && this.ch <= 1114109)
              ))
            )
              throw this._tokenError(
                `invalid escape character in byte string \`${this.input.substring(e + 1, this.position)}\``
              );
            this.readChar();
          } else if (10 === this.ch) this.readChar();
          else {
            if (13 !== this.ch || 10 !== this._peekAtNextChar().charCodeAt(0))
              throw this._tokenError(
                `invalid byte string \`${this.input.substring(e + 1, this.position)}\``
              );
            (this.readChar(), this.readChar());
          }
        return this.input.substring(e + 1, this.position);
      }
      _readNumberOrFloat() {
        const e = this.position;
        let t = !1;
        if (
          ("-" === String.fromCharCode(this.ch) && this.readChar(),
          "0" === String.fromCharCode(this.ch))
        ) {
          if ((this.readChar(), "x" === String.fromCharCode(this.ch))) {
            if (
              (this.readChar(),
              !"0123456789ABCDEF".includes(
                String.fromCharCode(this.ch).toUpperCase()
              ))
            )
              throw this._tokenError(
                `expected hex number to contain hex digits, got \`${this.input.substring(e, this.position)}\``
              );
            for (
              ;
              "0123456789ABCDEF".includes(
                String.fromCharCode(this.ch).toUpperCase()
              );
            )
              this.readChar();
            if ("." === String.fromCharCode(this.ch)) {
              if (((t = !0), "." === this._peekAtNextChar()))
                return this.input.substring(e, this.position);
              for (
                this.readChar();
                "0123456789ABCDEF".includes(
                  String.fromCharCode(this.ch).toUpperCase()
                );
              )
                this.readChar();
            }
            if (t && "p" !== String.fromCharCode(this.ch))
              throw this._tokenError(
                `expected hex number with fraction to have an exponent, got \`${this.input.substring(e, this.position)}\``
              );
            if ("p" === String.fromCharCode(this.ch)) {
              if (
                (this.readChar(),
                "+-".includes(String.fromCharCode(this.ch)) && this.readChar(),
                !this._isDigit(String.fromCharCode(this.ch)))
              )
                throw this._tokenError(
                  `expected hex number with exponent to have a digit in exponent, got \`${this.input.substring(e, this.position)}\``
                );
              for (; this._isDigit(String.fromCharCode(this.ch)); )
                this.readChar();
            }
          } else if ("b" === String.fromCharCode(this.ch)) {
            if ((this.readChar(), !"01".includes(String.fromCharCode(this.ch))))
              throw this._tokenError(
                `expected binary number to have binary digits, got \`${this.input.substring(e, this.position)}\``
              );
            for (; "01".includes(String.fromCharCode(this.ch)); )
              this.readChar();
          } else if ("." === String.fromCharCode(this.ch)) {
            if ("." === this._peekAtNextChar())
              return this.input.substring(e, this.position);
            if ((this.readChar(), !this._isDigit(String.fromCharCode(this.ch))))
              throw this._tokenError(
                `expected number with fraction to have digits in fraction part, got \`${this.input.substring(e, this.position)}\``
              );
            for (; this._isDigit(String.fromCharCode(this.ch)); )
              this.readChar();
            if ("e" === String.fromCharCode(this.ch)) {
              if (
                (this.readChar(),
                "+-".includes(String.fromCharCode(this.ch)) && this.readChar(),
                !this._isDigit(String.fromCharCode(this.ch)))
              )
                throw this._tokenError(
                  `expected number with exponent to have digits in exponent, got \`${this.input.substring(e, this.position)}\``
                );
              for (; this._isDigit(String.fromCharCode(this.ch)); )
                this.readChar();
            }
          }
        } else {
          for (; this._isDigit(String.fromCharCode(this.ch)); ) this.readChar();
          if ("." === String.fromCharCode(this.ch)) {
            if ("." === this._peekAtNextChar())
              return this.input.substring(e, this.position);
            if ((this.readChar(), !this._isDigit(String.fromCharCode(this.ch))))
              throw this._tokenError(
                `expected number with fraction to have digits in fraction part, got \`${this.input.substring(e, this.position)}\``
              );
            for (; this._isDigit(String.fromCharCode(this.ch)); )
              this.readChar();
          }
          if ("e" === String.fromCharCode(this.ch)) {
            if (
              (this.readChar(),
              "+-".includes(String.fromCharCode(this.ch)) && this.readChar(),
              !this._isDigit(String.fromCharCode(this.ch)))
            )
              throw this._tokenError(
                `expected number with exponent to have digits in exponent, got \`${this.input.substring(e, this.position)}\``
              );
            for (; this._isDigit(String.fromCharCode(this.ch)); )
              this.readChar();
          }
        }
        return this.input.substring(e, this.position);
      }
      _readWhitespace() {
        const e = this.position;
        for (; " \t\n\r".includes(String.fromCharCode(this.ch)); )
          this.readChar();
        return this.input.substring(e, this.position);
      }
      _readComments() {
        const e = [];
        for (;;) {
          const t = this._readWhitespace();
          if (";" !== String.fromCharCode(this.ch)) {
            if ("" !== t) {
              const n = new Ye(Ve.COMMENT, "", [], t);
              e.push(n);
            }
            break;
          }
          const n = new Ye(Ve.COMMENT, this._readComment(), [], t);
          e.push(n);
        }
        return e;
      }
      _tokenError(e) {
        const t = this.getLocation();
        return new yt(`CDDL token error - line ${t.line + 1}: ${e}`);
      }
    }
    const xt = new Ye(Ve.ILLEGAL, "");
    const Ct = /^[!#$%&'*+-.^`|~\w]+$/,
      _t = /[\u000A\u000D\u0009\u0020]/u,
      St = /^[\u0009\u{0020}-\{u0073}\u{0080}-\u{00FF}]+$/u;
    function Tt(e, t, n) {
      ((t && "" !== t && !e.has(t) && St.test(n)) || null === n) &&
        e.set(t.toLowerCase(), n);
    }
    function Et() {
      return {
        async: !1,
        breaks: !1,
        extensions: null,
        gfm: !0,
        hooks: null,
        pedantic: !1,
        renderer: null,
        silent: !1,
        tokenizer: null,
        walkTokens: null,
      };
    }
    var Rt = {
      async: !1,
      breaks: !1,
      extensions: null,
      gfm: !0,
      hooks: null,
      pedantic: !1,
      renderer: null,
      silent: !1,
      tokenizer: null,
      walkTokens: null,
    };
    function At(e) {
      Rt = e;
    }
    var Lt = { exec: () => null };
    function Pt(e, t = "") {
      let n = "string" == typeof e ? e : e.source,
        r = {
          replace: (e, t) => {
            let s = "string" == typeof t ? t : t.source;
            return ((s = s.replace(It.caret, "$1")), (n = n.replace(e, s)), r);
          },
          getRegex: () => new RegExp(n, t),
        };
      return r;
    }
    var Nt = (() => {
        try {
          return !!new RegExp("(?<=1)(?<!1)");
        } catch {
          return !1;
        }
      })(),
      It = {
        codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
        outputLinkReplace: /\\([\[\]])/g,
        indentCodeCompensation: /^(\s+)(?:```)/,
        beginningSpace: /^\s+/,
        endingHash: /#$/,
        startingSpaceChar: /^ /,
        endingSpaceChar: / $/,
        nonSpaceChar: /[^ ]/,
        newLineCharGlobal: /\n/g,
        tabCharGlobal: /\t/g,
        multipleSpaceGlobal: /\s+/g,
        blankLine: /^[ \t]*$/,
        doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
        blockquoteStart: /^ {0,3}>/,
        blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
        blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] +\S/,
        listReplaceTask: /^\[[ xX]\] +/,
        listTaskCheckbox: /\[[ xX]\]/,
        anyLine: /\n.*\n/,
        hrefBrackets: /^<(.*)>$/,
        tableDelimiter: /[:|]/,
        tableAlignChars: /^\||\| *$/g,
        tableRowBlankLine: /\n[ \t]*$/,
        tableAlignRight: /^ *-+: *$/,
        tableAlignCenter: /^ *:-+: *$/,
        tableAlignLeft: /^ *:-+ *$/,
        startATag: /^<a /i,
        endATag: /^<\/a>/i,
        startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
        endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
        startAngleBracket: /^</,
        endAngleBracket: />$/,
        pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
        unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
        escapeTest: /[&<>"']/,
        escapeReplace: /[&<>"']/g,
        escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        escapeReplaceNoEncode:
          /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
        caret: /(^|[^\[])\^/g,
        percentDecode: /%25/g,
        findPipe: /\|/g,
        splitPipe: / \|/,
        slashPipe: /\\\|/g,
        carriageReturn: /\r\n|\r/g,
        spaceLine: /^ +$/gm,
        notSpaceStart: /^\S*/,
        endingNewline: /\n$/,
        listItemRegex: e =>
          new RegExp(`^( {0,3}${e})((?:[\t ][^\\n]*)?(?:\\n|$))`),
        nextBulletRegex: e =>
          new RegExp(
            `^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`
          ),
        hrRegex: e =>
          new RegExp(
            `^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`
          ),
        fencesBeginRegex: e =>
          new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
        headingBeginRegex: e => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
        htmlBeginRegex: e =>
          new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"),
        blockquoteBeginRegex: e => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`),
      },
      Dt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      Ot = / {0,3}(?:[*+-]|\d{1,9}[.)])/,
      jt =
        /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      zt = Pt(jt)
        .replace(/bull/g, Ot)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/\|table/g, "")
        .getRegex(),
      Mt = Pt(jt)
        .replace(/bull/g, Ot)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/)
        .getRegex(),
      qt =
        /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      Ut = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,
      Wt = Pt(
        /^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/
      )
        .replace("label", Ut)
        .replace(
          "title",
          /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
        )
        .getRegex(),
      Ft = Pt(/^(bull)([ \t][^\n]+?)?(?:\n|$)/)
        .replace(/bull/g, Ot)
        .getRegex(),
      Bt =
        "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
      Ht = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
      Gt = Pt(
        "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))",
        "i"
      )
        .replace("comment", Ht)
        .replace("tag", Bt)
        .replace(
          "attribute",
          / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
        )
        .getRegex(),
      Vt = Pt(qt)
        .replace("hr", Dt)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("|lheading", "")
        .replace("|table", "")
        .replace("blockquote", " {0,3}>")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", Bt)
        .getRegex(),
      Jt = {
        blockquote: Pt(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
          .replace("paragraph", Vt)
          .getRegex(),
        code: /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,
        def: Wt,
        fences:
          /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        hr: Dt,
        html: Gt,
        lheading: zt,
        list: Ft,
        newline: /^(?:[ \t]*(?:\n|$))+/,
        paragraph: Vt,
        table: Lt,
        text: /^[^\n]+/,
      },
      Kt = Pt(
        "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
      )
        .replace("hr", Dt)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("blockquote", " {0,3}>")
        .replace("code", "(?: {4}| {0,3}\t)[^\\n]")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", Bt)
        .getRegex(),
      Yt = {
        ...Jt,
        lheading: Mt,
        table: Kt,
        paragraph: Pt(qt)
          .replace("hr", Dt)
          .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
          .replace("|lheading", "")
          .replace("table", Kt)
          .replace("blockquote", " {0,3}>")
          .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
          .replace(
            "html",
            "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
          )
          .replace("tag", Bt)
          .getRegex(),
      },
      Zt = {
        ...Jt,
        html: Pt(
          "^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))"
        )
          .replace("comment", Ht)
          .replace(
            /tag/g,
            "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b"
          )
          .getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: Lt,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: Pt(qt)
          .replace("hr", Dt)
          .replace("heading", " *#{1,6} *[^\n]")
          .replace("lheading", zt)
          .replace("|table", "")
          .replace("blockquote", " {0,3}>")
          .replace("|fences", "")
          .replace("|list", "")
          .replace("|html", "")
          .replace("|tag", "")
          .getRegex(),
      },
      Xt = /^( {2,}|\\)\n(?!\s*$)/,
      Qt = /[\p{P}\p{S}]/u,
      en = /[\s\p{P}\p{S}]/u,
      tn = /[^\s\p{P}\p{S}]/u,
      nn = Pt(/^((?![*_])punctSpace)/, "u")
        .replace(/punctSpace/g, en)
        .getRegex(),
      rn = /(?!~)[\p{P}\p{S}]/u,
      sn = Pt(/link|precode-code|html/, "g")
        .replace(
          "link",
          /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/
        )
        .replace("precode-", Nt ? "(?<!`)()" : "(^^|[^`])")
        .replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/)
        .replace("html", /<(?! )[^<>]*?>/)
        .getRegex(),
      on = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,
      an = Pt(on, "u").replace(/punct/g, Qt).getRegex(),
      cn = Pt(on, "u").replace(/punct/g, rn).getRegex(),
      ln =
        "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",
      un = Pt(ln, "gu")
        .replace(/notPunctSpace/g, tn)
        .replace(/punctSpace/g, en)
        .replace(/punct/g, Qt)
        .getRegex(),
      dn = Pt(ln, "gu")
        .replace(/notPunctSpace/g, /(?:[^\s\p{P}\p{S}]|~)/u)
        .replace(/punctSpace/g, /(?!~)[\s\p{P}\p{S}]/u)
        .replace(/punct/g, rn)
        .getRegex(),
      pn = Pt(
        "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
        "gu"
      )
        .replace(/notPunctSpace/g, tn)
        .replace(/punctSpace/g, en)
        .replace(/punct/g, Qt)
        .getRegex(),
      hn = Pt(/^~~?(?:((?!~)punct)|[^\s~])/, "u")
        .replace(/punct/g, Qt)
        .getRegex(),
      fn = Pt(
        "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",
        "gu"
      )
        .replace(/notPunctSpace/g, tn)
        .replace(/punctSpace/g, en)
        .replace(/punct/g, Qt)
        .getRegex(),
      mn = Pt(/\\(punct)/, "gu")
        .replace(/punct/g, Qt)
        .getRegex(),
      gn = Pt(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
        .replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
        .replace(
          "email",
          /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
        )
        .getRegex(),
      bn = Pt(Ht).replace("(?:--\x3e|$)", "--\x3e").getRegex(),
      yn = Pt(
        "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
      )
        .replace("comment", bn)
        .replace(
          "attribute",
          /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
        )
        .getRegex(),
      wn =
        /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,
      kn = Pt(
        /^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/
      )
        .replace("label", wn)
        .replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/)
        .replace(
          "title",
          /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/
        )
        .getRegex(),
      vn = Pt(/^!?\[(label)\]\[(ref)\]/)
        .replace("label", wn)
        .replace("ref", Ut)
        .getRegex(),
      $n = Pt(/^!?\[(ref)\](?:\[\])?/)
        .replace("ref", Ut)
        .getRegex(),
      xn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,
      Cn = {
        _backpedal: Lt,
        anyPunctuation: mn,
        autolink: gn,
        blockSkip: sn,
        br: Xt,
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        del: Lt,
        delLDelim: Lt,
        delRDelim: Lt,
        emStrongLDelim: an,
        emStrongRDelimAst: un,
        emStrongRDelimUnd: pn,
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        link: kn,
        nolink: $n,
        punctuation: nn,
        reflink: vn,
        reflinkSearch: Pt("reflink|nolink(?!\\()", "g")
          .replace("reflink", vn)
          .replace("nolink", $n)
          .getRegex(),
        tag: yn,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        url: Lt,
      },
      _n = {
        ...Cn,
        link: Pt(/^!?\[(label)\]\((.*?)\)/)
          .replace("label", wn)
          .getRegex(),
        reflink: Pt(/^!?\[(label)\]\s*\[([^\]]*)\]/)
          .replace("label", wn)
          .getRegex(),
      },
      Sn = {
        ...Cn,
        emStrongRDelimAst: dn,
        emStrongLDelim: cn,
        delLDelim: hn,
        delRDelim: fn,
        url: Pt(
          /^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/
        )
          .replace("protocol", xn)
          .replace(
            "email",
            /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/
          )
          .getRegex(),
        _backpedal:
          /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
        text: Pt(
          /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
        )
          .replace("protocol", xn)
          .getRegex(),
      },
      Tn = {
        ...Sn,
        br: Pt(Xt).replace("{2,}", "*").getRegex(),
        text: Pt(Sn.text)
          .replace("\\b_", "\\b_| {2,}\\n")
          .replace(/\{2,\}/g, "*")
          .getRegex(),
      },
      En = { normal: Jt, gfm: Yt, pedantic: Zt },
      Rn = { normal: Cn, gfm: Sn, breaks: Tn, pedantic: _n },
      An = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      },
      Ln = e => An[e];
    function Pn(e, t) {
      if (t) {
        if (It.escapeTest.test(e)) return e.replace(It.escapeReplace, Ln);
      } else if (It.escapeTestNoEncode.test(e))
        return e.replace(It.escapeReplaceNoEncode, Ln);
      return e;
    }
    function Nn(e) {
      try {
        e = encodeURI(e).replace(It.percentDecode, "%");
      } catch {
        return null;
      }
      return e;
    }
    function In(e, t) {
      let n = e
          .replace(It.findPipe, (e, t, n) => {
            let r = !1,
              s = t;
            for (; --s >= 0 && "\\" === n[s]; ) r = !r;
            return r ? "|" : " |";
          })
          .split(It.splitPipe),
        r = 0;
      if (
        (n[0].trim() || n.shift(),
        n.length > 0 && !n.at(-1)?.trim() && n.pop(),
        t)
      )
        if (n.length > t) n.splice(t);
        else for (; n.length < t; ) n.push("");
      for (; r < n.length; r++) n[r] = n[r].trim().replace(It.slashPipe, "|");
      return n;
    }
    function Dn(e, t, n) {
      let r = e.length;
      if (0 === r) return "";
      let s = 0;
      for (; s < r; ) {
        if (e.charAt(r - s - 1) !== t) break;
        s++;
      }
      return e.slice(0, r - s);
    }
    function On(e) {
      let t = e.split("\n"),
        n = t.length - 1;
      for (; n >= 0 && !t[n].trim(); ) n--;
      return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
    }
    function jn(e, t = 0) {
      let n = t,
        r = "";
      for (let t of e)
        if ("\t" === t) {
          let e = 4 - (n % 4);
          ((r += " ".repeat(e)), (n += e));
        } else ((r += t), n++);
      return r;
    }
    function zn(e, t, n, r, s) {
      let i = t.href,
        o = t.title || null,
        a = e[1].replace(s.other.outputLinkReplace, "$1");
      r.state.inLink = !0;
      let c = {
        type: "!" === e[0].charAt(0) ? "image" : "link",
        raw: n,
        href: i,
        title: o,
        text: a,
        tokens: r.inlineTokens(a),
      };
      return ((r.state.inLink = !1), c);
    }
    var Mn = class {
        options;
        rules;
        lexer;
        constructor(e) {
          this.options = e || Rt;
        }
        space(e) {
          let t = this.rules.block.newline.exec(e);
          if (t && t[0].length > 0) return { type: "space", raw: t[0] };
        }
        code(e) {
          let t = this.rules.block.code.exec(e);
          if (t) {
            let e = this.options.pedantic ? t[0] : On(t[0]),
              n = e.replace(this.rules.other.codeRemoveIndent, "");
            return {
              type: "code",
              raw: e,
              codeBlockStyle: "indented",
              text: n,
            };
          }
        }
        fences(e) {
          let t = this.rules.block.fences.exec(e);
          if (t) {
            let e = t[0],
              n = (function (e, t, n) {
                let r = e.match(n.other.indentCodeCompensation);
                if (null === r) return t;
                let s = r[1];
                return t
                  .split("\n")
                  .map(e => {
                    let t = e.match(n.other.beginningSpace);
                    if (null === t) return e;
                    let [r] = t;
                    return r.length >= s.length ? e.slice(s.length) : e;
                  })
                  .join("\n");
              })(e, t[3] || "", this.rules);
            return {
              type: "code",
              raw: e,
              lang: t[2]
                ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1")
                : t[2],
              text: n,
            };
          }
        }
        heading(e) {
          let t = this.rules.block.heading.exec(e);
          if (t) {
            let e = t[2].trim();
            if (this.rules.other.endingHash.test(e)) {
              let t = Dn(e, "#");
              (this.options.pedantic ||
                !t ||
                this.rules.other.endingSpaceChar.test(t)) &&
                (e = t.trim());
            }
            return {
              type: "heading",
              raw: Dn(t[0], "\n"),
              depth: t[1].length,
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        hr(e) {
          let t = this.rules.block.hr.exec(e);
          if (t) return { type: "hr", raw: Dn(t[0], "\n") };
        }
        blockquote(e) {
          let t = this.rules.block.blockquote.exec(e);
          if (t) {
            let e = Dn(t[0], "\n").split("\n"),
              n = "",
              r = "",
              s = [];
            for (; e.length > 0; ) {
              let t,
                i = !1,
                o = [];
              for (t = 0; t < e.length; t++)
                if (this.rules.other.blockquoteStart.test(e[t]))
                  (o.push(e[t]), (i = !0));
                else {
                  if (i) break;
                  o.push(e[t]);
                }
              e = e.slice(t);
              let a = o.join("\n"),
                c = a
                  .replace(this.rules.other.blockquoteSetextReplace, "\n    $1")
                  .replace(this.rules.other.blockquoteSetextReplace2, "");
              ((n = n ? `${n}\n${a}` : a), (r = r ? `${r}\n${c}` : c));
              let l = this.lexer.state.top;
              if (
                ((this.lexer.state.top = !0),
                this.lexer.blockTokens(c, s, !0),
                (this.lexer.state.top = l),
                0 === e.length)
              )
                break;
              let u = s.at(-1);
              if ("code" === u?.type) break;
              if ("blockquote" === u?.type) {
                let t = u,
                  i = t.raw + "\n" + e.join("\n"),
                  o = this.blockquote(i);
                ((s[s.length - 1] = o),
                  (n = n.substring(0, n.length - t.raw.length) + o.raw),
                  (r = r.substring(0, r.length - t.text.length) + o.text));
                break;
              }
              if ("list" !== u?.type);
              else {
                let t = u,
                  i = t.raw + "\n" + e.join("\n"),
                  o = this.list(i);
                ((s[s.length - 1] = o),
                  (n = n.substring(0, n.length - u.raw.length) + o.raw),
                  (r = r.substring(0, r.length - t.raw.length) + o.raw),
                  (e = i.substring(s.at(-1).raw.length).split("\n")));
              }
            }
            return { type: "blockquote", raw: n, tokens: s, text: r };
          }
        }
        list(e) {
          let t = this.rules.block.list.exec(e);
          if (t) {
            let n = t[1].trim(),
              r = n.length > 1,
              s = {
                type: "list",
                raw: "",
                ordered: r,
                start: r ? +n.slice(0, -1) : "",
                loose: !1,
                items: [],
              };
            ((n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`),
              this.options.pedantic && (n = r ? n : "[*+-]"));
            let i = this.rules.other.listItemRegex(n),
              o = !1;
            for (; e; ) {
              let n = !1,
                r = "",
                a = "";
              if (!(t = i.exec(e)) || this.rules.block.hr.test(e)) break;
              ((r = t[0]), (e = e.substring(r.length)));
              let c = jn(t[2].split("\n", 1)[0], t[1].length),
                l = e.split("\n", 1)[0],
                u = !c.trim(),
                d = 0;
              if (
                (this.options.pedantic
                  ? ((d = 2), (a = c.trimStart()))
                  : u
                    ? (d = t[1].length + 1)
                    : ((d = c.search(this.rules.other.nonSpaceChar)),
                      (d = d > 4 ? 1 : d),
                      (a = c.slice(d)),
                      (d += t[1].length)),
                u &&
                  this.rules.other.blankLine.test(l) &&
                  ((r += l + "\n"), (e = e.substring(l.length + 1)), (n = !0)),
                !n)
              ) {
                let t = this.rules.other.nextBulletRegex(d),
                  n = this.rules.other.hrRegex(d),
                  s = this.rules.other.fencesBeginRegex(d),
                  i = this.rules.other.headingBeginRegex(d),
                  o = this.rules.other.htmlBeginRegex(d),
                  p = this.rules.other.blockquoteBeginRegex(d);
                for (; e; ) {
                  let h,
                    f = e.split("\n", 1)[0];
                  if (
                    ((l = f),
                    this.options.pedantic
                      ? ((l = l.replace(
                          this.rules.other.listReplaceNesting,
                          "  "
                        )),
                        (h = l))
                      : (h = l.replace(this.rules.other.tabCharGlobal, "    ")),
                    s.test(l) ||
                      i.test(l) ||
                      o.test(l) ||
                      p.test(l) ||
                      t.test(l) ||
                      n.test(l))
                  )
                    break;
                  if (h.search(this.rules.other.nonSpaceChar) >= d || !l.trim())
                    a += "\n" + h.slice(d);
                  else {
                    if (
                      u ||
                      c
                        .replace(this.rules.other.tabCharGlobal, "    ")
                        .search(this.rules.other.nonSpaceChar) >= 4 ||
                      s.test(c) ||
                      i.test(c) ||
                      n.test(c)
                    )
                      break;
                    a += "\n" + l;
                  }
                  ((u = !l.trim()),
                    (r += f + "\n"),
                    (e = e.substring(f.length + 1)),
                    (c = h.slice(d)));
                }
              }
              (s.loose ||
                (o
                  ? (s.loose = !0)
                  : this.rules.other.doubleBlankLine.test(r) && (o = !0)),
                s.items.push({
                  type: "list_item",
                  raw: r,
                  task:
                    !!this.options.gfm && this.rules.other.listIsTask.test(a),
                  loose: !1,
                  text: a,
                  tokens: [],
                }),
                (s.raw += r));
            }
            let a = s.items.at(-1);
            if (!a) return;
            ((a.raw = a.raw.trimEnd()),
              (a.text = a.text.trimEnd()),
              (s.raw = s.raw.trimEnd()));
            for (let e of s.items) {
              if (
                ((this.lexer.state.top = !1),
                (e.tokens = this.lexer.blockTokens(e.text, [])),
                e.task)
              ) {
                if (
                  ((e.text = e.text.replace(
                    this.rules.other.listReplaceTask,
                    ""
                  )),
                  "text" === e.tokens[0]?.type ||
                    "paragraph" === e.tokens[0]?.type)
                ) {
                  ((e.tokens[0].raw = e.tokens[0].raw.replace(
                    this.rules.other.listReplaceTask,
                    ""
                  )),
                    (e.tokens[0].text = e.tokens[0].text.replace(
                      this.rules.other.listReplaceTask,
                      ""
                    )));
                  for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--)
                    if (
                      this.rules.other.listIsTask.test(
                        this.lexer.inlineQueue[e].src
                      )
                    ) {
                      this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[
                        e
                      ].src.replace(this.rules.other.listReplaceTask, "");
                      break;
                    }
                }
                let t = this.rules.other.listTaskCheckbox.exec(e.raw);
                if (t) {
                  let n = {
                    type: "checkbox",
                    raw: t[0] + " ",
                    checked: "[ ]" !== t[0],
                  };
                  ((e.checked = n.checked),
                    s.loose
                      ? e.tokens[0] &&
                        ["paragraph", "text"].includes(e.tokens[0].type) &&
                        "tokens" in e.tokens[0] &&
                        e.tokens[0].tokens
                        ? ((e.tokens[0].raw = n.raw + e.tokens[0].raw),
                          (e.tokens[0].text = n.raw + e.tokens[0].text),
                          e.tokens[0].tokens.unshift(n))
                        : e.tokens.unshift({
                            type: "paragraph",
                            raw: n.raw,
                            text: n.raw,
                            tokens: [n],
                          })
                      : e.tokens.unshift(n));
                }
              }
              if (!s.loose) {
                let t = e.tokens.filter(e => "space" === e.type),
                  n =
                    t.length > 0 &&
                    t.some(e => this.rules.other.anyLine.test(e.raw));
                s.loose = n;
              }
            }
            if (s.loose)
              for (let e of s.items) {
                e.loose = !0;
                for (let t of e.tokens)
                  "text" === t.type && (t.type = "paragraph");
              }
            return s;
          }
        }
        html(e) {
          let t = this.rules.block.html.exec(e);
          if (t) {
            let e = On(t[0]);
            return {
              type: "html",
              block: !0,
              raw: e,
              pre: "pre" === t[1] || "script" === t[1] || "style" === t[1],
              text: e,
            };
          }
        }
        def(e) {
          let t = this.rules.block.def.exec(e);
          if (t) {
            let e = t[1]
                .toLowerCase()
                .replace(this.rules.other.multipleSpaceGlobal, " "),
              n = t[2]
                ? t[2]
                    .replace(this.rules.other.hrefBrackets, "$1")
                    .replace(this.rules.inline.anyPunctuation, "$1")
                : "",
              r = t[3]
                ? t[3]
                    .substring(1, t[3].length - 1)
                    .replace(this.rules.inline.anyPunctuation, "$1")
                : t[3];
            return {
              type: "def",
              tag: e,
              raw: Dn(t[0], "\n"),
              href: n,
              title: r,
            };
          }
        }
        table(e) {
          let t = this.rules.block.table.exec(e);
          if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
          let n = In(t[1]),
            r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"),
            s = t[3]?.trim()
              ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n")
              : [],
            i = {
              type: "table",
              raw: Dn(t[0], "\n"),
              header: [],
              align: [],
              rows: [],
            };
          if (n.length === r.length) {
            for (let e of r)
              this.rules.other.tableAlignRight.test(e)
                ? i.align.push("right")
                : this.rules.other.tableAlignCenter.test(e)
                  ? i.align.push("center")
                  : this.rules.other.tableAlignLeft.test(e)
                    ? i.align.push("left")
                    : i.align.push(null);
            for (let e = 0; e < n.length; e++)
              i.header.push({
                text: n[e],
                tokens: this.lexer.inline(n[e]),
                header: !0,
                align: i.align[e],
              });
            for (let e of s)
              i.rows.push(
                In(e, i.header.length).map((e, t) => ({
                  text: e,
                  tokens: this.lexer.inline(e),
                  header: !1,
                  align: i.align[t],
                }))
              );
            return i;
          }
        }
        lheading(e) {
          let t = this.rules.block.lheading.exec(e);
          if (t) {
            let e = t[1].trim();
            return {
              type: "heading",
              raw: Dn(t[0], "\n"),
              depth: "=" === t[2].charAt(0) ? 1 : 2,
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        paragraph(e) {
          let t = this.rules.block.paragraph.exec(e);
          if (t) {
            let e =
              "\n" === t[1].charAt(t[1].length - 1) ? t[1].slice(0, -1) : t[1];
            return {
              type: "paragraph",
              raw: t[0],
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        text(e) {
          let t = this.rules.block.text.exec(e);
          if (t)
            return {
              type: "text",
              raw: t[0],
              text: t[0],
              tokens: this.lexer.inline(t[0]),
            };
        }
        escape(e) {
          let t = this.rules.inline.escape.exec(e);
          if (t) return { type: "escape", raw: t[0], text: t[1] };
        }
        tag(e) {
          let t = this.rules.inline.tag.exec(e);
          if (t)
            return (
              !this.lexer.state.inLink && this.rules.other.startATag.test(t[0])
                ? (this.lexer.state.inLink = !0)
                : this.lexer.state.inLink &&
                  this.rules.other.endATag.test(t[0]) &&
                  (this.lexer.state.inLink = !1),
              !this.lexer.state.inRawBlock &&
              this.rules.other.startPreScriptTag.test(t[0])
                ? (this.lexer.state.inRawBlock = !0)
                : this.lexer.state.inRawBlock &&
                  this.rules.other.endPreScriptTag.test(t[0]) &&
                  (this.lexer.state.inRawBlock = !1),
              {
                type: "html",
                raw: t[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: !1,
                text: t[0],
              }
            );
        }
        link(e) {
          let t = this.rules.inline.link.exec(e);
          if (t) {
            let e = t[2].trim();
            if (
              !this.options.pedantic &&
              this.rules.other.startAngleBracket.test(e)
            ) {
              if (!this.rules.other.endAngleBracket.test(e)) return;
              let t = Dn(e.slice(0, -1), "\\");
              if ((e.length - t.length) % 2 == 0) return;
            } else {
              let e = (function (e, t) {
                if (-1 === e.indexOf(t[1])) return -1;
                let n = 0;
                for (let r = 0; r < e.length; r++)
                  if ("\\" === e[r]) r++;
                  else if (e[r] === t[0]) n++;
                  else if (e[r] === t[1] && (n--, n < 0)) return r;
                return n > 0 ? -2 : -1;
              })(t[2], "()");
              if (-2 === e) return;
              if (e > -1) {
                let n = (0 === t[0].indexOf("!") ? 5 : 4) + t[1].length + e;
                ((t[2] = t[2].substring(0, e)),
                  (t[0] = t[0].substring(0, n).trim()),
                  (t[3] = ""));
              }
            }
            let n = t[2],
              r = "";
            if (this.options.pedantic) {
              let e = this.rules.other.pedanticHrefTitle.exec(n);
              e && ((n = e[1]), (r = e[3]));
            } else r = t[3] ? t[3].slice(1, -1) : "";
            return (
              (n = n.trim()),
              this.rules.other.startAngleBracket.test(n) &&
                (n =
                  this.options.pedantic &&
                  !this.rules.other.endAngleBracket.test(e)
                    ? n.slice(1)
                    : n.slice(1, -1)),
              zn(
                t,
                {
                  href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
                  title: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
                },
                t[0],
                this.lexer,
                this.rules
              )
            );
          }
        }
        reflink(e, t) {
          let n;
          if (
            (n = this.rules.inline.reflink.exec(e)) ||
            (n = this.rules.inline.nolink.exec(e))
          ) {
            let e =
              t[
                (n[2] || n[1])
                  .replace(this.rules.other.multipleSpaceGlobal, " ")
                  .toLowerCase()
              ];
            if (!e) {
              let e = n[0].charAt(0);
              return { type: "text", raw: e, text: e };
            }
            return zn(n, e, n[0], this.lexer, this.rules);
          }
        }
        emStrong(e, t, n = "") {
          let r = this.rules.inline.emStrongLDelim.exec(e);
          if (
            r &&
            (r[1] || r[2] || r[3] || r[4]) &&
            (!r[4] || !n.match(this.rules.other.unicodeAlphaNumeric)) &&
            ((!r[1] && !r[3]) || !n || this.rules.inline.punctuation.exec(n))
          ) {
            let n,
              s,
              i = [...r[0]].length - 1,
              o = i,
              a = 0,
              c =
                "*" === r[0][0]
                  ? this.rules.inline.emStrongRDelimAst
                  : this.rules.inline.emStrongRDelimUnd;
            for (
              c.lastIndex = 0, t = t.slice(-1 * e.length + i);
              null !== (r = c.exec(t));
            ) {
              if (((n = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]), !n))
                continue;
              if (((s = [...n].length), r[3] || r[4])) {
                o += s;
                continue;
              }
              if ((r[5] || r[6]) && i % 3 && !((i + s) % 3)) {
                a += s;
                continue;
              }
              if (((o -= s), o > 0)) continue;
              s = Math.min(s, s + o + a);
              let t = [...r[0]][0].length,
                c = e.slice(0, i + r.index + t + s);
              if (Math.min(i, s) % 2) {
                let e = c.slice(1, -1);
                return {
                  type: "em",
                  raw: c,
                  text: e,
                  tokens: this.lexer.inlineTokens(e),
                };
              }
              let l = c.slice(2, -2);
              return {
                type: "strong",
                raw: c,
                text: l,
                tokens: this.lexer.inlineTokens(l),
              };
            }
          }
        }
        codespan(e) {
          let t = this.rules.inline.code.exec(e);
          if (t) {
            let e = t[2].replace(this.rules.other.newLineCharGlobal, " "),
              n = this.rules.other.nonSpaceChar.test(e),
              r =
                this.rules.other.startingSpaceChar.test(e) &&
                this.rules.other.endingSpaceChar.test(e);
            return (
              n && r && (e = e.substring(1, e.length - 1)),
              { type: "codespan", raw: t[0], text: e }
            );
          }
        }
        br(e) {
          let t = this.rules.inline.br.exec(e);
          if (t) return { type: "br", raw: t[0] };
        }
        del(e, t, n = "") {
          let r = this.rules.inline.delLDelim.exec(e);
          if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
            let n,
              s,
              i = [...r[0]].length - 1,
              o = i,
              a = this.rules.inline.delRDelim;
            for (
              a.lastIndex = 0, t = t.slice(-1 * e.length + i);
              null !== (r = a.exec(t));
            ) {
              if (
                ((n = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]),
                !n || ((s = [...n].length), s !== i))
              )
                continue;
              if (r[3] || r[4]) {
                o += s;
                continue;
              }
              if (((o -= s), o > 0)) continue;
              s = Math.min(s, s + o);
              let t = [...r[0]][0].length,
                a = e.slice(0, i + r.index + t + s),
                c = a.slice(i, -i);
              return {
                type: "del",
                raw: a,
                text: c,
                tokens: this.lexer.inlineTokens(c),
              };
            }
          }
        }
        autolink(e) {
          let t = this.rules.inline.autolink.exec(e);
          if (t) {
            let e, n;
            return (
              "@" === t[2]
                ? ((e = t[1]), (n = "mailto:" + e))
                : ((e = t[1]), (n = e)),
              {
                type: "link",
                raw: t[0],
                text: e,
                href: n,
                tokens: [{ type: "text", raw: e, text: e }],
              }
            );
          }
        }
        url(e) {
          let t;
          if ((t = this.rules.inline.url.exec(e))) {
            let e, n;
            if ("@" === t[2]) ((e = t[0]), (n = "mailto:" + e));
            else {
              let r;
              do {
                ((r = t[0]),
                  (t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? ""));
              } while (r !== t[0]);
              ((e = t[0]), (n = "www." === t[1] ? "http://" + t[0] : t[0]));
            }
            return {
              type: "link",
              raw: t[0],
              text: e,
              href: n,
              tokens: [{ type: "text", raw: e, text: e }],
            };
          }
        }
        inlineText(e) {
          let t = this.rules.inline.text.exec(e);
          if (t) {
            let e = this.lexer.state.inRawBlock;
            return { type: "text", raw: t[0], text: t[0], escaped: e };
          }
        }
      },
      qn = class e {
        tokens;
        options;
        state;
        inlineQueue;
        tokenizer;
        constructor(e) {
          ((this.tokens = []),
            (this.tokens.links = Object.create(null)),
            (this.options = e || Rt),
            (this.options.tokenizer = this.options.tokenizer || new Mn()),
            (this.tokenizer = this.options.tokenizer),
            (this.tokenizer.options = this.options),
            (this.tokenizer.lexer = this),
            (this.inlineQueue = []),
            (this.state = { inLink: !1, inRawBlock: !1, top: !0 }));
          let t = { other: It, block: En.normal, inline: Rn.normal };
          (this.options.pedantic
            ? ((t.block = En.pedantic), (t.inline = Rn.pedantic))
            : this.options.gfm &&
              ((t.block = En.gfm),
              this.options.breaks
                ? (t.inline = Rn.breaks)
                : (t.inline = Rn.gfm)),
            (this.tokenizer.rules = t));
        }
        static get rules() {
          return { block: En, inline: Rn };
        }
        static lex(t, n) {
          return new e(n).lex(t);
        }
        static lexInline(t, n) {
          return new e(n).inlineTokens(t);
        }
        lex(e) {
          ((e = e.replace(It.carriageReturn, "\n")),
            this.blockTokens(e, this.tokens));
          for (let e = 0; e < this.inlineQueue.length; e++) {
            let t = this.inlineQueue[e];
            this.inlineTokens(t.src, t.tokens);
          }
          return ((this.inlineQueue = []), this.tokens);
        }
        blockTokens(e, t = [], n = !1) {
          for (
            this.tokenizer.lexer = this,
              this.options.pedantic &&
                (e = e
                  .replace(It.tabCharGlobal, "    ")
                  .replace(It.spaceLine, ""));
            e;
          ) {
            let r;
            if (
              this.options.extensions?.block?.some(
                n =>
                  !!(r = n.call({ lexer: this }, e, t)) &&
                  ((e = e.substring(r.raw.length)), t.push(r), !0)
              )
            )
              continue;
            if ((r = this.tokenizer.space(e))) {
              e = e.substring(r.raw.length);
              let n = t.at(-1);
              1 === r.raw.length && void 0 !== n ? (n.raw += "\n") : t.push(r);
              continue;
            }
            if ((r = this.tokenizer.code(e))) {
              e = e.substring(r.raw.length);
              let n = t.at(-1);
              "paragraph" === n?.type || "text" === n?.type
                ? ((n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw),
                  (n.text += "\n" + r.text),
                  (this.inlineQueue.at(-1).src = n.text))
                : t.push(r);
              continue;
            }
            if ((r = this.tokenizer.fences(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.heading(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.hr(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.blockquote(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.list(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.html(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.def(e))) {
              e = e.substring(r.raw.length);
              let n = t.at(-1);
              "paragraph" === n?.type || "text" === n?.type
                ? ((n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw),
                  (n.text += "\n" + r.raw),
                  (this.inlineQueue.at(-1).src = n.text))
                : this.tokens.links[r.tag] ||
                  ((this.tokens.links[r.tag] = {
                    href: r.href,
                    title: r.title,
                  }),
                  t.push(r));
              continue;
            }
            if ((r = this.tokenizer.table(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.lheading(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            let s = e;
            if (this.options.extensions?.startBlock) {
              let t,
                n = 1 / 0,
                r = e.slice(1);
              (this.options.extensions.startBlock.forEach(e => {
                ((t = e.call({ lexer: this }, r)),
                  "number" == typeof t && t >= 0 && (n = Math.min(n, t)));
              }),
                n < 1 / 0 && n >= 0 && (s = e.substring(0, n + 1)));
            }
            if (this.state.top && (r = this.tokenizer.paragraph(s))) {
              let i = t.at(-1);
              (n && "paragraph" === i?.type
                ? ((i.raw += (i.raw.endsWith("\n") ? "" : "\n") + r.raw),
                  (i.text += "\n" + r.text),
                  this.inlineQueue.pop(),
                  (this.inlineQueue.at(-1).src = i.text))
                : t.push(r),
                (n = s.length !== e.length),
                (e = e.substring(r.raw.length)));
            } else if ((r = this.tokenizer.text(e))) {
              e = e.substring(r.raw.length);
              let n = t.at(-1);
              "text" === n?.type
                ? ((n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw),
                  (n.text += "\n" + r.text),
                  this.inlineQueue.pop(),
                  (this.inlineQueue.at(-1).src = n.text))
                : t.push(r);
            } else if (e) {
              let t = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          }
          return ((this.state.top = !0), t);
        }
        inline(e, t = []) {
          return (this.inlineQueue.push({ src: e, tokens: t }), t);
        }
        inlineTokens(e, t = []) {
          this.tokenizer.lexer = this;
          let n,
            r = e,
            s = null;
          if (this.tokens.links) {
            let e = Object.keys(this.tokens.links);
            if (e.length > 0)
              for (
                ;
                null !==
                (s = this.tokenizer.rules.inline.reflinkSearch.exec(r));
              )
                e.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) &&
                  (r =
                    r.slice(0, s.index) +
                    "[" +
                    "a".repeat(s[0].length - 2) +
                    "]" +
                    r.slice(
                      this.tokenizer.rules.inline.reflinkSearch.lastIndex
                    ));
          }
          for (
            ;
            null !== (s = this.tokenizer.rules.inline.anyPunctuation.exec(r));
          )
            r =
              r.slice(0, s.index) +
              "++" +
              r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
          for (; null !== (s = this.tokenizer.rules.inline.blockSkip.exec(r)); )
            ((n = s[2] ? s[2].length : 0),
              (r =
                r.slice(0, s.index + n) +
                "[" +
                "a".repeat(s[0].length - n - 2) +
                "]" +
                r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex)));
          r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
          let i = !1,
            o = "";
          for (; e; ) {
            let n;
            if (
              (i || (o = ""),
              (i = !1),
              this.options.extensions?.inline?.some(
                r =>
                  !!(n = r.call({ lexer: this }, e, t)) &&
                  ((e = e.substring(n.raw.length)), t.push(n), !0)
              ))
            )
              continue;
            if ((n = this.tokenizer.escape(e))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if ((n = this.tokenizer.tag(e))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if ((n = this.tokenizer.link(e))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if ((n = this.tokenizer.reflink(e, this.tokens.links))) {
              e = e.substring(n.raw.length);
              let r = t.at(-1);
              "text" === n.type && "text" === r?.type
                ? ((r.raw += n.raw), (r.text += n.text))
                : t.push(n);
              continue;
            }
            if ((n = this.tokenizer.emStrong(e, r, o))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if ((n = this.tokenizer.codespan(e))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if ((n = this.tokenizer.br(e))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if ((n = this.tokenizer.del(e, r, o))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if ((n = this.tokenizer.autolink(e))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            if (!this.state.inLink && (n = this.tokenizer.url(e))) {
              ((e = e.substring(n.raw.length)), t.push(n));
              continue;
            }
            let s = e;
            if (this.options.extensions?.startInline) {
              let t,
                n = 1 / 0,
                r = e.slice(1);
              (this.options.extensions.startInline.forEach(e => {
                ((t = e.call({ lexer: this }, r)),
                  "number" == typeof t && t >= 0 && (n = Math.min(n, t)));
              }),
                n < 1 / 0 && n >= 0 && (s = e.substring(0, n + 1)));
            }
            if ((n = this.tokenizer.inlineText(s))) {
              ((e = e.substring(n.raw.length)),
                "_" !== n.raw.slice(-1) && (o = n.raw.slice(-1)),
                (i = !0));
              let r = t.at(-1);
              "text" === r?.type
                ? ((r.raw += n.raw), (r.text += n.text))
                : t.push(n);
            } else if (e) {
              let t = "Infinite loop on byte: " + e.charCodeAt(0);
              if (this.options.silent) {
                console.error(t);
                break;
              }
              throw new Error(t);
            }
          }
          return t;
        }
      },
      Un = class {
        options;
        parser;
        constructor(e) {
          this.options = e || Rt;
        }
        space(e) {
          return "";
        }
        code({ text: e, lang: t, escaped: n }) {
          let r = (t || "").match(It.notSpaceStart)?.[0],
            s = e.replace(It.endingNewline, "") + "\n";
          return r
            ? '<pre><code class="language-' +
                Pn(r) +
                '">' +
                (n ? s : Pn(s, !0)) +
                "</code></pre>\n"
            : "<pre><code>" + (n ? s : Pn(s, !0)) + "</code></pre>\n";
        }
        blockquote({ tokens: e }) {
          return `<blockquote>\n${this.parser.parse(e)}</blockquote>\n`;
        }
        html({ text: e }) {
          return e;
        }
        def(e) {
          return "";
        }
        heading({ tokens: e, depth: t }) {
          return `<h${t}>${this.parser.parseInline(e)}</h${t}>\n`;
        }
        hr(e) {
          return "<hr>\n";
        }
        list(e) {
          let t = e.ordered,
            n = e.start,
            r = "";
          for (let t = 0; t < e.items.length; t++) {
            let n = e.items[t];
            r += this.listitem(n);
          }
          let s = t ? "ol" : "ul";
          return (
            "<" +
            s +
            (t && 1 !== n ? ' start="' + n + '"' : "") +
            ">\n" +
            r +
            "</" +
            s +
            ">\n"
          );
        }
        listitem(e) {
          return `<li>${this.parser.parse(e.tokens)}</li>\n`;
        }
        checkbox({ checked: e }) {
          return (
            "<input " +
            (e ? 'checked="" ' : "") +
            'disabled="" type="checkbox"> '
          );
        }
        paragraph({ tokens: e }) {
          return `<p>${this.parser.parseInline(e)}</p>\n`;
        }
        table(e) {
          let t = "",
            n = "";
          for (let t = 0; t < e.header.length; t++)
            n += this.tablecell(e.header[t]);
          t += this.tablerow({ text: n });
          let r = "";
          for (let t = 0; t < e.rows.length; t++) {
            let s = e.rows[t];
            n = "";
            for (let e = 0; e < s.length; e++) n += this.tablecell(s[e]);
            r += this.tablerow({ text: n });
          }
          return (
            r && (r = `<tbody>${r}</tbody>`),
            "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n"
          );
        }
        tablerow({ text: e }) {
          return `<tr>\n${e}</tr>\n`;
        }
        tablecell(e) {
          let t = this.parser.parseInline(e.tokens),
            n = e.header ? "th" : "td";
          return (
            (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>\n`
          );
        }
        strong({ tokens: e }) {
          return `<strong>${this.parser.parseInline(e)}</strong>`;
        }
        em({ tokens: e }) {
          return `<em>${this.parser.parseInline(e)}</em>`;
        }
        codespan({ text: e }) {
          return `<code>${Pn(e, !0)}</code>`;
        }
        br(e) {
          return "<br>";
        }
        del({ tokens: e }) {
          return `<del>${this.parser.parseInline(e)}</del>`;
        }
        link({ href: e, title: t, tokens: n }) {
          let r = this.parser.parseInline(n),
            s = Nn(e);
          if (null === s) return r;
          let i = '<a href="' + (e = s) + '"';
          return (
            t && (i += ' title="' + Pn(t) + '"'),
            (i += ">" + r + "</a>"),
            i
          );
        }
        image({ href: e, title: t, text: n, tokens: r }) {
          r && (n = this.parser.parseInline(r, this.parser.textRenderer));
          let s = Nn(e);
          if (null === s) return Pn(n);
          let i = `<img src="${(e = s)}" alt="${Pn(n)}"`;
          return (t && (i += ` title="${Pn(t)}"`), (i += ">"), i);
        }
        text(e) {
          return "tokens" in e && e.tokens
            ? this.parser.parseInline(e.tokens)
            : "escaped" in e && e.escaped
              ? e.text
              : Pn(e.text);
        }
      },
      Wn = class {
        strong({ text: e }) {
          return e;
        }
        em({ text: e }) {
          return e;
        }
        codespan({ text: e }) {
          return e;
        }
        del({ text: e }) {
          return e;
        }
        html({ text: e }) {
          return e;
        }
        text({ text: e }) {
          return e;
        }
        link({ text: e }) {
          return "" + e;
        }
        image({ text: e }) {
          return "" + e;
        }
        br() {
          return "";
        }
        checkbox({ raw: e }) {
          return e;
        }
      },
      Fn = class e {
        options;
        renderer;
        textRenderer;
        constructor(e) {
          ((this.options = e || Rt),
            (this.options.renderer = this.options.renderer || new Un()),
            (this.renderer = this.options.renderer),
            (this.renderer.options = this.options),
            (this.renderer.parser = this),
            (this.textRenderer = new Wn()));
        }
        static parse(t, n) {
          return new e(n).parse(t);
        }
        static parseInline(t, n) {
          return new e(n).parseInline(t);
        }
        parse(e) {
          this.renderer.parser = this;
          let t = "";
          for (let n = 0; n < e.length; n++) {
            let r = e[n];
            if (this.options.extensions?.renderers?.[r.type]) {
              let e = r,
                n = this.options.extensions.renderers[e.type].call(
                  { parser: this },
                  e
                );
              if (
                !1 !== n ||
                ![
                  "space",
                  "hr",
                  "heading",
                  "code",
                  "table",
                  "blockquote",
                  "list",
                  "html",
                  "def",
                  "paragraph",
                  "text",
                ].includes(e.type)
              ) {
                t += n || "";
                continue;
              }
            }
            let s = r;
            switch (s.type) {
              case "space":
                t += this.renderer.space(s);
                break;
              case "hr":
                t += this.renderer.hr(s);
                break;
              case "heading":
                t += this.renderer.heading(s);
                break;
              case "code":
                t += this.renderer.code(s);
                break;
              case "table":
                t += this.renderer.table(s);
                break;
              case "blockquote":
                t += this.renderer.blockquote(s);
                break;
              case "list":
                t += this.renderer.list(s);
                break;
              case "checkbox":
                t += this.renderer.checkbox(s);
                break;
              case "html":
                t += this.renderer.html(s);
                break;
              case "def":
                t += this.renderer.def(s);
                break;
              case "paragraph":
                t += this.renderer.paragraph(s);
                break;
              case "text":
                t += this.renderer.text(s);
                break;
              default: {
                let e = 'Token with "' + s.type + '" type was not found.';
                if (this.options.silent) return (console.error(e), "");
                throw new Error(e);
              }
            }
          }
          return t;
        }
        parseInline(e, t = this.renderer) {
          this.renderer.parser = this;
          let n = "";
          for (let r = 0; r < e.length; r++) {
            let s = e[r];
            if (this.options.extensions?.renderers?.[s.type]) {
              let e = this.options.extensions.renderers[s.type].call(
                { parser: this },
                s
              );
              if (
                !1 !== e ||
                ![
                  "escape",
                  "html",
                  "link",
                  "image",
                  "strong",
                  "em",
                  "codespan",
                  "br",
                  "del",
                  "text",
                ].includes(s.type)
              ) {
                n += e || "";
                continue;
              }
            }
            let i = s;
            switch (i.type) {
              case "escape":
              case "text":
                n += t.text(i);
                break;
              case "html":
                n += t.html(i);
                break;
              case "link":
                n += t.link(i);
                break;
              case "image":
                n += t.image(i);
                break;
              case "checkbox":
                n += t.checkbox(i);
                break;
              case "strong":
                n += t.strong(i);
                break;
              case "em":
                n += t.em(i);
                break;
              case "codespan":
                n += t.codespan(i);
                break;
              case "br":
                n += t.br(i);
                break;
              case "del":
                n += t.del(i);
                break;
              default: {
                let e = 'Token with "' + i.type + '" type was not found.';
                if (this.options.silent) return (console.error(e), "");
                throw new Error(e);
              }
            }
          }
          return n;
        }
      },
      Bn = class {
        options;
        block;
        constructor(e) {
          this.options = e || Rt;
        }
        static passThroughHooks = new Set([
          "preprocess",
          "postprocess",
          "processAllTokens",
          "emStrongMask",
        ]);
        static passThroughHooksRespectAsync = new Set([
          "preprocess",
          "postprocess",
          "processAllTokens",
        ]);
        preprocess(e) {
          return e;
        }
        postprocess(e) {
          return e;
        }
        processAllTokens(e) {
          return e;
        }
        emStrongMask(e) {
          return e;
        }
        provideLexer(e = this.block) {
          return e ? qn.lex : qn.lexInline;
        }
        provideParser(e = this.block) {
          return e ? Fn.parse : Fn.parseInline;
        }
      },
      Hn = new (class {
        defaults = {
          async: !1,
          breaks: !1,
          extensions: null,
          gfm: !0,
          hooks: null,
          pedantic: !1,
          renderer: null,
          silent: !1,
          tokenizer: null,
          walkTokens: null,
        };
        options = this.setOptions;
        parse = this.parseMarkdown(!0);
        parseInline = this.parseMarkdown(!1);
        Parser = Fn;
        Renderer = Un;
        TextRenderer = Wn;
        Lexer = qn;
        Tokenizer = Mn;
        Hooks = Bn;
        constructor(...e) {
          this.use(...e);
        }
        walkTokens(e, t) {
          let n = [];
          for (let r of e)
            switch (((n = n.concat(t.call(this, r))), r.type)) {
              case "table": {
                let e = r;
                for (let r of e.header)
                  n = n.concat(this.walkTokens(r.tokens, t));
                for (let r of e.rows)
                  for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
                break;
              }
              case "list": {
                let e = r;
                n = n.concat(this.walkTokens(e.items, t));
                break;
              }
              default: {
                let e = r;
                this.defaults.extensions?.childTokens?.[e.type]
                  ? this.defaults.extensions.childTokens[e.type].forEach(r => {
                      let s = e[r].flat(1 / 0);
                      n = n.concat(this.walkTokens(s, t));
                    })
                  : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
              }
            }
          return n;
        }
        use(...e) {
          let t = this.defaults.extensions || {
            renderers: {},
            childTokens: {},
          };
          return (
            e.forEach(e => {
              let n = { ...e };
              if (
                ((n.async = this.defaults.async || n.async || !1),
                e.extensions &&
                  (e.extensions.forEach(e => {
                    if (!e.name) throw new Error("extension name required");
                    if ("renderer" in e) {
                      let n = t.renderers[e.name];
                      t.renderers[e.name] = n
                        ? function (...t) {
                            let r = e.renderer.apply(this, t);
                            return (!1 === r && (r = n.apply(this, t)), r);
                          }
                        : e.renderer;
                    }
                    if ("tokenizer" in e) {
                      if (
                        !e.level ||
                        ("block" !== e.level && "inline" !== e.level)
                      )
                        throw new Error(
                          "extension level must be 'block' or 'inline'"
                        );
                      let n = t[e.level];
                      (n
                        ? n.unshift(e.tokenizer)
                        : (t[e.level] = [e.tokenizer]),
                        e.start &&
                          ("block" === e.level
                            ? t.startBlock
                              ? t.startBlock.push(e.start)
                              : (t.startBlock = [e.start])
                            : "inline" === e.level &&
                              (t.startInline
                                ? t.startInline.push(e.start)
                                : (t.startInline = [e.start]))));
                    }
                    "childTokens" in e &&
                      e.childTokens &&
                      (t.childTokens[e.name] = e.childTokens);
                  }),
                  (n.extensions = t)),
                e.renderer)
              ) {
                let t = this.defaults.renderer || new Un(this.defaults);
                for (let n in e.renderer) {
                  if (!(n in t))
                    throw new Error(`renderer '${n}' does not exist`);
                  if (["options", "parser"].includes(n)) continue;
                  let r = n,
                    s = e.renderer[r],
                    i = t[r];
                  t[r] = (...e) => {
                    let n = s.apply(t, e);
                    return (!1 === n && (n = i.apply(t, e)), n || "");
                  };
                }
                n.renderer = t;
              }
              if (e.tokenizer) {
                let t = this.defaults.tokenizer || new Mn(this.defaults);
                for (let n in e.tokenizer) {
                  if (!(n in t))
                    throw new Error(`tokenizer '${n}' does not exist`);
                  if (["options", "rules", "lexer"].includes(n)) continue;
                  let r = n,
                    s = e.tokenizer[r],
                    i = t[r];
                  t[r] = (...e) => {
                    let n = s.apply(t, e);
                    return (!1 === n && (n = i.apply(t, e)), n);
                  };
                }
                n.tokenizer = t;
              }
              if (e.hooks) {
                let t = this.defaults.hooks || new Bn();
                for (let n in e.hooks) {
                  if (!(n in t)) throw new Error(`hook '${n}' does not exist`);
                  if (["options", "block"].includes(n)) continue;
                  let r = n,
                    s = e.hooks[r],
                    i = t[r];
                  Bn.passThroughHooks.has(n)
                    ? (t[r] = e => {
                        if (
                          this.defaults.async &&
                          Bn.passThroughHooksRespectAsync.has(n)
                        )
                          return (async () => {
                            let n = await s.call(t, e);
                            return i.call(t, n);
                          })();
                        let r = s.call(t, e);
                        return i.call(t, r);
                      })
                    : (t[r] = (...e) => {
                        if (this.defaults.async)
                          return (async () => {
                            let n = await s.apply(t, e);
                            return (!1 === n && (n = await i.apply(t, e)), n);
                          })();
                        let n = s.apply(t, e);
                        return (!1 === n && (n = i.apply(t, e)), n);
                      });
                }
                n.hooks = t;
              }
              if (e.walkTokens) {
                let t = this.defaults.walkTokens,
                  r = e.walkTokens;
                n.walkTokens = function (e) {
                  let n = [];
                  return (
                    n.push(r.call(this, e)),
                    t && (n = n.concat(t.call(this, e))),
                    n
                  );
                };
              }
              this.defaults = { ...this.defaults, ...n };
            }),
            this
          );
        }
        setOptions(e) {
          return ((this.defaults = { ...this.defaults, ...e }), this);
        }
        lexer(e, t) {
          return qn.lex(e, t ?? this.defaults);
        }
        parser(e, t) {
          return Fn.parse(e, t ?? this.defaults);
        }
        parseMarkdown(e) {
          return (t, n) => {
            let r = { ...n },
              s = { ...this.defaults, ...r },
              i = this.onError(!!s.silent, !!s.async);
            if (!0 === this.defaults.async && !1 === r.async)
              return i(
                new Error(
                  "marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."
                )
              );
            if (typeof t > "u" || null === t)
              return i(
                new Error("marked(): input parameter is undefined or null")
              );
            if ("string" != typeof t)
              return i(
                new Error(
                  "marked(): input parameter is of type " +
                    Object.prototype.toString.call(t) +
                    ", string expected"
                )
              );
            if (
              (s.hooks && ((s.hooks.options = s), (s.hooks.block = e)), s.async)
            )
              return (async () => {
                let n = s.hooks ? await s.hooks.preprocess(t) : t,
                  r = await (
                    s.hooks
                      ? await s.hooks.provideLexer(e)
                      : e
                        ? qn.lex
                        : qn.lexInline
                  )(n, s),
                  i = s.hooks ? await s.hooks.processAllTokens(r) : r;
                s.walkTokens &&
                  (await Promise.all(this.walkTokens(i, s.walkTokens)));
                let o = await (
                  s.hooks
                    ? await s.hooks.provideParser(e)
                    : e
                      ? Fn.parse
                      : Fn.parseInline
                )(i, s);
                return s.hooks ? await s.hooks.postprocess(o) : o;
              })().catch(i);
            try {
              s.hooks && (t = s.hooks.preprocess(t));
              let n = (
                s.hooks ? s.hooks.provideLexer(e) : e ? qn.lex : qn.lexInline
              )(t, s);
              (s.hooks && (n = s.hooks.processAllTokens(n)),
                s.walkTokens && this.walkTokens(n, s.walkTokens));
              let r = (
                s.hooks
                  ? s.hooks.provideParser(e)
                  : e
                    ? Fn.parse
                    : Fn.parseInline
              )(n, s);
              return (s.hooks && (r = s.hooks.postprocess(r)), r);
            } catch (e) {
              return i(e);
            }
          };
        }
        onError(e, t) {
          return n => {
            if (
              ((n.message +=
                "\nPlease report this to https://github.com/markedjs/marked."),
              e)
            ) {
              let e =
                "<p>An error occurred:</p><pre>" +
                Pn(n.message + "", !0) +
                "</pre>";
              return t ? Promise.resolve(e) : e;
            }
            if (t) return Promise.reject(n);
            throw n;
          };
        }
      })();
    function Gn(e, t) {
      return Hn.parse(e, t);
    }
    function Vn(e) {
      return e &&
        e.__esModule &&
        Object.prototype.hasOwnProperty.call(e, "default")
        ? e.default
        : e;
    }
    ((Gn.options = Gn.setOptions =
      function (e) {
        return (
          Hn.setOptions(e),
          (Gn.defaults = Hn.defaults),
          At(Gn.defaults),
          Gn
        );
      }),
      (Gn.getDefaults = Et),
      (Gn.defaults = Rt),
      (Gn.use = function (...e) {
        return (Hn.use(...e), (Gn.defaults = Hn.defaults), At(Gn.defaults), Gn);
      }),
      (Gn.walkTokens = function (e, t) {
        return Hn.walkTokens(e, t);
      }),
      (Gn.parseInline = Hn.parseInline),
      (Gn.Parser = Fn),
      (Gn.parser = Fn.parse),
      (Gn.Renderer = Un),
      (Gn.TextRenderer = Wn),
      (Gn.Lexer = qn),
      (Gn.lexer = qn.lex),
      (Gn.Tokenizer = Mn),
      (Gn.Hooks = Bn),
      (Gn.parse = Gn),
      Gn.options,
      Gn.setOptions,
      Gn.use,
      Gn.walkTokens,
      Gn.parseInline,
      Fn.parse,
      qn.lex);
    var Jn,
      Kn = { exports: {} };
    var Yn,
      Zn =
        (Jn ||
          ((Jn = 1),
          (Yn = Kn),
          (function (e, t) {
            Yn.exports = t();
          })(0, function () {
            var e = [],
              t = [],
              n = {},
              r = {},
              s = {};
            function i(e) {
              return "string" == typeof e ? new RegExp("^" + e + "$", "i") : e;
            }
            function o(e, t) {
              return e === t
                ? t
                : e === e.toLowerCase()
                  ? t.toLowerCase()
                  : e === e.toUpperCase()
                    ? t.toUpperCase()
                    : e[0] === e[0].toUpperCase()
                      ? t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
                      : t.toLowerCase();
            }
            function a(e, t) {
              return e.replace(t[0], function (n, r) {
                var s,
                  i,
                  a =
                    ((s = t[1]),
                    (i = arguments),
                    s.replace(/\$(\d{1,2})/g, function (e, t) {
                      return i[t] || "";
                    }));
                return o("" === n ? e[r - 1] : n, a);
              });
            }
            function c(e, t, r) {
              if (!e.length || n.hasOwnProperty(e)) return t;
              for (var s = r.length; s--; ) {
                var i = r[s];
                if (i[0].test(t)) return a(t, i);
              }
              return t;
            }
            function l(e, t, n) {
              return function (r) {
                var s = r.toLowerCase();
                return t.hasOwnProperty(s)
                  ? o(r, s)
                  : e.hasOwnProperty(s)
                    ? o(r, e[s])
                    : c(s, r, n);
              };
            }
            function u(e, t, n, r) {
              return function (r) {
                var s = r.toLowerCase();
                return (
                  !!t.hasOwnProperty(s) ||
                  (!e.hasOwnProperty(s) && c(s, s, n) === s)
                );
              };
            }
            function d(e, t, n) {
              return (
                (n ? t + " " : "") + (1 === t ? d.singular(e) : d.plural(e))
              );
            }
            return (
              (d.plural = l(s, r, e)),
              (d.isPlural = u(s, r, e)),
              (d.singular = l(r, s, t)),
              (d.isSingular = u(r, s, t)),
              (d.addPluralRule = function (t, n) {
                e.push([i(t), n]);
              }),
              (d.addSingularRule = function (e, n) {
                t.push([i(e), n]);
              }),
              (d.addUncountableRule = function (e) {
                "string" != typeof e
                  ? (d.addPluralRule(e, "$0"), d.addSingularRule(e, "$0"))
                  : (n[e.toLowerCase()] = !0);
              }),
              (d.addIrregularRule = function (e, t) {
                ((t = t.toLowerCase()),
                  (e = e.toLowerCase()),
                  (s[e] = t),
                  (r[t] = e));
              }),
              [
                ["I", "we"],
                ["me", "us"],
                ["he", "they"],
                ["she", "they"],
                ["them", "them"],
                ["myself", "ourselves"],
                ["yourself", "yourselves"],
                ["itself", "themselves"],
                ["herself", "themselves"],
                ["himself", "themselves"],
                ["themself", "themselves"],
                ["is", "are"],
                ["was", "were"],
                ["has", "have"],
                ["this", "these"],
                ["that", "those"],
                ["echo", "echoes"],
                ["dingo", "dingoes"],
                ["volcano", "volcanoes"],
                ["tornado", "tornadoes"],
                ["torpedo", "torpedoes"],
                ["genus", "genera"],
                ["viscus", "viscera"],
                ["stigma", "stigmata"],
                ["stoma", "stomata"],
                ["dogma", "dogmata"],
                ["lemma", "lemmata"],
                ["schema", "schemata"],
                ["anathema", "anathemata"],
                ["ox", "oxen"],
                ["axe", "axes"],
                ["die", "dice"],
                ["yes", "yeses"],
                ["foot", "feet"],
                ["eave", "eaves"],
                ["goose", "geese"],
                ["tooth", "teeth"],
                ["quiz", "quizzes"],
                ["human", "humans"],
                ["proof", "proofs"],
                ["carve", "carves"],
                ["valve", "valves"],
                ["looey", "looies"],
                ["thief", "thieves"],
                ["groove", "grooves"],
                ["pickaxe", "pickaxes"],
                ["passerby", "passersby"],
              ].forEach(function (e) {
                return d.addIrregularRule(e[0], e[1]);
              }),
              [
                [/s?$/i, "s"],
                [/[^\u0000-\u007F]$/i, "$0"],
                [/([^aeiou]ese)$/i, "$1"],
                [/(ax|test)is$/i, "$1es"],
                [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, "$1es"],
                [/(e[mn]u)s?$/i, "$1s"],
                [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, "$1"],
                [
                  /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,
                  "$1i",
                ],
                [/(alumn|alg|vertebr)(?:a|ae)$/i, "$1ae"],
                [/(seraph|cherub)(?:im)?$/i, "$1im"],
                [/(her|at|gr)o$/i, "$1oes"],
                [
                  /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,
                  "$1a",
                ],
                [
                  /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,
                  "$1a",
                ],
                [/sis$/i, "ses"],
                [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, "$1$2ves"],
                [/([^aeiouy]|qu)y$/i, "$1ies"],
                [/([^ch][ieo][ln])ey$/i, "$1ies"],
                [/(x|ch|ss|sh|zz)$/i, "$1es"],
                [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, "$1ices"],
                [/\b((?:tit)?m|l)(?:ice|ouse)$/i, "$1ice"],
                [/(pe)(?:rson|ople)$/i, "$1ople"],
                [/(child)(?:ren)?$/i, "$1ren"],
                [/eaux$/i, "$0"],
                [/m[ae]n$/i, "men"],
                ["thou", "you"],
              ].forEach(function (e) {
                return d.addPluralRule(e[0], e[1]);
              }),
              [
                [/s$/i, ""],
                [/(ss)$/i, "$1"],
                [
                  /(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,
                  "$1fe",
                ],
                [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, "$1f"],
                [/ies$/i, "y"],
                [
                  /\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,
                  "$1ie",
                ],
                [/\b(mon|smil)ies$/i, "$1ey"],
                [/\b((?:tit)?m|l)ice$/i, "$1ouse"],
                [/(seraph|cherub)im$/i, "$1"],
                [
                  /(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,
                  "$1",
                ],
                [
                  /(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,
                  "$1sis",
                ],
                [/(movie|twelve|abuse|e[mn]u)s$/i, "$1"],
                [/(test)(?:is|es)$/i, "$1is"],
                [
                  /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,
                  "$1us",
                ],
                [
                  /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,
                  "$1um",
                ],
                [
                  /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,
                  "$1on",
                ],
                [/(alumn|alg|vertebr)ae$/i, "$1a"],
                [/(cod|mur|sil|vert|ind)ices$/i, "$1ex"],
                [/(matr|append)ices$/i, "$1ix"],
                [/(pe)(rson|ople)$/i, "$1rson"],
                [/(child)ren$/i, "$1"],
                [/(eau)x?$/i, "$1"],
                [/men$/i, "man"],
              ].forEach(function (e) {
                return d.addSingularRule(e[0], e[1]);
              }),
              [
                "adulthood",
                "advice",
                "agenda",
                "aid",
                "aircraft",
                "alcohol",
                "ammo",
                "analytics",
                "anime",
                "athletics",
                "audio",
                "bison",
                "blood",
                "bream",
                "buffalo",
                "butter",
                "carp",
                "cash",
                "chassis",
                "chess",
                "clothing",
                "cod",
                "commerce",
                "cooperation",
                "corps",
                "debris",
                "diabetes",
                "digestion",
                "elk",
                "energy",
                "equipment",
                "excretion",
                "expertise",
                "firmware",
                "flounder",
                "fun",
                "gallows",
                "garbage",
                "graffiti",
                "hardware",
                "headquarters",
                "health",
                "herpes",
                "highjinks",
                "homework",
                "housework",
                "information",
                "jeans",
                "justice",
                "kudos",
                "labour",
                "literature",
                "machinery",
                "mackerel",
                "mail",
                "media",
                "mews",
                "moose",
                "music",
                "mud",
                "manga",
                "news",
                "only",
                "personnel",
                "pike",
                "plankton",
                "pliers",
                "police",
                "pollution",
                "premises",
                "rain",
                "research",
                "rice",
                "salmon",
                "scissors",
                "series",
                "sewage",
                "shambles",
                "shrimp",
                "software",
                "species",
                "staff",
                "swine",
                "tennis",
                "traffic",
                "transportation",
                "trout",
                "tuna",
                "wealth",
                "welfare",
                "whiting",
                "wildebeest",
                "wildlife",
                "you",
                /pok[eé]mon$/i,
                /[^aeiou]ese$/i,
                /deer$/i,
                /fish$/i,
                /measles$/i,
                /o[iu]s$/i,
                /pox$/i,
                /sheep$/i,
              ].forEach(d.addUncountableRule),
              d
            );
          })),
        Kn.exports),
      Xn = Vn(Zn),
      Qn = (function (e) {
        var t = {};
        try {
          t.WeakMap = WeakMap;
        } catch (u) {
          t.WeakMap = (function (e, t) {
            var n = t.defineProperty,
              r = t.hasOwnProperty,
              s = i.prototype;
            return (
              (s.delete = function (e) {
                return this.has(e) && delete e[this._];
              }),
              (s.get = function (e) {
                return this.has(e) ? e[this._] : void 0;
              }),
              (s.has = function (e) {
                return r.call(e, this._);
              }),
              (s.set = function (e, t) {
                return (n(e, this._, { configurable: !0, value: t }), this);
              }),
              i
            );
            function i(t) {
              (n(this, "_", { value: "_@ungap/weakmap" + e++ }),
                t && t.forEach(o, this));
            }
            function o(e) {
              this.set(e[0], e[1]);
            }
          })(Math.random(), Object);
        }
        var n = t.WeakMap,
          r = {};
        try {
          r.WeakSet = WeakSet;
        } catch (u) {
          !(function (e, t) {
            var n = s.prototype;
            function s() {
              t(this, "_", { value: "_@ungap/weakmap" + e++ });
            }
            ((n.add = function (e) {
              return (
                this.has(e) || t(e, this._, { value: !0, configurable: !0 }),
                this
              );
            }),
              (n.has = function (e) {
                return this.hasOwnProperty.call(e, this._);
              }),
              (n.delete = function (e) {
                return this.has(e) && delete e[this._];
              }),
              (r.WeakSet = s));
          })(Math.random(), Object.defineProperty);
        }
        function s(e, t, n, r, s, i) {
          for (var o = ("selectedIndex" in t), a = o; r < s; ) {
            var c,
              l = e(n[r], 1);
            (t.insertBefore(l, i),
              o &&
                a &&
                l.selected &&
                ((a = !a),
                (c = t.selectedIndex),
                (t.selectedIndex =
                  c < 0 ? r : d.call(t.querySelectorAll("option"), l))),
              r++);
          }
        }
        function i(e, t) {
          return e == t;
        }
        function o(e) {
          return e;
        }
        function a(e, t, n, r, s, i, o) {
          var a = i - s;
          if (a < 1) return -1;
          for (; a <= n - t; ) {
            for (var c = t, l = s; c < n && l < i && o(e[c], r[l]); )
              (c++, l++);
            if (l === i) return t;
            t = c + 1;
          }
          return -1;
        }
        function c(e, t, n, r, s) {
          return n < r ? e(t[n], 0) : 0 < n ? e(t[n - 1], -0).nextSibling : s;
        }
        function l(e, t, n, r) {
          for (; n < r; ) h(e(t[n++], -1));
        }
        var u = r.WeakSet,
          d = [].indexOf,
          p = function (e, t, n) {
            for (var r = 1, s = t; r < s; ) {
              var i = ((r + s) / 2) >>> 0;
              n < e[i] ? (s = i) : (r = 1 + i);
            }
            return r;
          },
          h = function (e) {
            return (
              e.remove ||
              function () {
                var e = this.parentNode;
                e && e.removeChild(this);
              }
            ).call(e);
          };
        function f(e, t, n, r) {
          for (
            var u = (r = r || {}).compare || i,
              d = r.node || o,
              h = null == r.before ? null : d(r.before, 0),
              f = t.length,
              m = f,
              g = 0,
              b = n.length,
              y = 0;
            g < m && y < b && u(t[g], n[y]);
          )
            (g++, y++);
          for (; g < m && y < b && u(t[m - 1], n[b - 1]); ) (m--, b--);
          var w = g === m,
            k = y === b;
          if (w && k) return n;
          if (w && y < b) return (s(d, e, n, y, b, c(d, t, g, f, h)), n);
          if (k && g < m) return (l(d, t, g, m), n);
          var v = m - g,
            $ = b - y,
            x = -1;
          if (v < $) {
            if (-1 < (x = a(n, y, b, t, g, m, u)))
              return (
                s(d, e, n, y, x, d(t[g], 0)),
                s(d, e, n, x + v, b, c(d, t, m, f, h)),
                n
              );
          } else if ($ < v && -1 < (x = a(t, g, m, n, y, b, u)))
            return (l(d, t, g, x), l(d, t, x + $, m), n);
          return (
            v < 2 || $ < 2
              ? (s(d, e, n, y, b, d(t[g], 0)), l(d, t, g, m))
              : v == $ &&
                  (function (e, t, n, r, s, i) {
                    for (; r < s && i(n[r], e[t - 1]); ) (r++, t--);
                    return 0 === t;
                  })(n, b, t, g, m, u)
                ? s(d, e, n, y, b, c(d, t, m, f, h))
                : (function (e, t, n, r, i, o, a, c, u, d, h, f, m) {
                    !(function (e, t, n, r, i, o, a, c, u) {
                      for (var d = [], p = e.length, h = a, f = 0; f < p; )
                        switch (e[f++]) {
                          case 0:
                            (i++, h++);
                            break;
                          case 1:
                            (d.push(r[i]),
                              s(t, n, r, i++, i, h < c ? t(o[h], 0) : u));
                            break;
                          case -1:
                            h++;
                        }
                      for (f = 0; f < p; )
                        switch (e[f++]) {
                          case 0:
                            a++;
                            break;
                          case -1:
                            -1 < d.indexOf(o[a]) ? a++ : l(t, o, a++, a);
                        }
                    })(
                      (function (e, t, n, r, s, i, o) {
                        var a,
                          c,
                          l,
                          u,
                          d,
                          p,
                          h = n + i,
                          f = [];
                        e: for (b = 0; b <= h; b++) {
                          if (50 < b) return null;
                          for (
                            p = b - 1,
                              u = b ? f[b - 1] : [0, 0],
                              d = f[b] = [],
                              a = -b;
                            a <= b;
                            a += 2
                          ) {
                            for (
                              c =
                                (l =
                                  a === -b ||
                                  (a !== b && u[p + a - 1] < u[p + a + 1])
                                    ? u[p + a + 1]
                                    : u[p + a - 1] + 1) - a;
                              l < i && c < n && o(r[s + l], e[t + c]);
                            )
                              (l++, c++);
                            if (l === i && c === n) break e;
                            d[b + a] = l;
                          }
                        }
                        for (
                          var m = Array(b / 2 + h / 2),
                            g = m.length - 1,
                            b = f.length - 1;
                          0 <= b;
                          b--
                        ) {
                          for (
                            ;
                            0 < l && 0 < c && o(r[s + l - 1], e[t + c - 1]);
                          )
                            ((m[g--] = 0), l--, c--);
                          if (!b) break;
                          ((p = b - 1),
                            (u = b ? f[b - 1] : [0, 0]),
                            (a = l - c) == -b ||
                            (a !== b && u[p + a - 1] < u[p + a + 1])
                              ? (c--, (m[g--] = 1))
                              : (l--, (m[g--] = -1)));
                        }
                        return m;
                      })(n, r, o, a, c, d, f) ||
                        (function (e, t, n, r, s, i, o, a) {
                          var c = 0,
                            l = r < a ? r : a,
                            u = Array(l++),
                            d = Array(l);
                          d[0] = -1;
                          for (var h = 1; h < l; h++) d[h] = o;
                          for (var f = s.slice(i, o), m = t; m < n; m++) {
                            var g,
                              b = f.indexOf(e[m]);
                            -1 < b &&
                              -1 < (c = p(d, l, (g = b + i))) &&
                              ((d[c] = g),
                              (u[c] = { newi: m, oldi: g, prev: u[c - 1] }));
                          }
                          for (c = --l, --o; d[c] > o; ) --c;
                          l = a + r - c;
                          var y = Array(l),
                            w = u[c];
                          for (--n; w; ) {
                            for (var k = w.newi, v = w.oldi; k < n; )
                              ((y[--l] = 1), --n);
                            for (; v < o; ) ((y[--l] = -1), --o);
                            ((y[--l] = 0), --n, --o, (w = w.prev));
                          }
                          for (; t <= n; ) ((y[--l] = 1), --n);
                          for (; i <= o; ) ((y[--l] = -1), --o);
                          return y;
                        })(n, r, i, o, a, c, u, d),
                      e,
                      t,
                      n,
                      r,
                      a,
                      c,
                      h,
                      m
                    );
                  })(d, e, n, y, b, $, t, g, m, v, f, u, h),
            n
          );
        }
        var m = {};
        function g(t, n) {
          n = n || {};
          var r = e.createEvent("CustomEvent");
          return (
            r.initCustomEvent(t, !!n.bubbles, !!n.cancelable, n.detail),
            r
          );
        }
        m.CustomEvent =
          "function" == typeof CustomEvent
            ? CustomEvent
            : ((g["prototype"] = new g("").constructor.prototype), g);
        var b = m.CustomEvent,
          y = {};
        try {
          y.Map = Map;
        } catch (u) {
          y.Map = function () {
            var e = 0,
              t = [],
              n = [];
            return {
              delete: function (s) {
                var i = r(s);
                return (i && (t.splice(e, 1), n.splice(e, 1)), i);
              },
              forEach: function (e, r) {
                t.forEach(function (t, s) {
                  e.call(r, n[s], t, this);
                }, this);
              },
              get: function (t) {
                return r(t) ? n[e] : void 0;
              },
              has: r,
              set: function (s, i) {
                return ((n[r(s) ? e : t.push(s) - 1] = i), this);
              },
            };
            function r(n) {
              return -1 < (e = t.indexOf(n));
            }
          };
        }
        var w = y.Map;
        function k() {
          return this;
        }
        function v(e, t) {
          var n = "_" + e + "$";
          return {
            get: function () {
              return this[n] || $(this, n, t.call(this, e));
            },
            set: function (e) {
              $(this, n, e);
            },
          };
        }
        var $ = function (e, t, n) {
          return Object.defineProperty(e, t, {
            configurable: !0,
            value:
              "function" == typeof n
                ? function () {
                    return (e._wire$ = n.apply(this, arguments));
                  }
                : n,
          })[t];
        };
        Object.defineProperties(k.prototype, {
          ELEMENT_NODE: { value: 1 },
          nodeType: { value: -1 },
        });
        var x,
          C,
          _,
          S,
          T,
          E,
          R = {},
          A = {},
          L = [],
          P = A.hasOwnProperty,
          N = 0,
          I = {
            attributes: R,
            define: function (e, t) {
              e.indexOf("-") < 0
                ? (e in A || (N = L.push(e)), (A[e] = t))
                : (R[e] = t);
            },
            invoke: function (e, t) {
              for (var n = 0; n < N; n++) {
                var r = L[n];
                if (P.call(e, r)) return A[r](e[r], t);
              }
            },
          },
          D =
            Array.isArray ||
            ((C = (x = {}.toString).call([])),
            function (e) {
              return x.call(e) === C;
            }),
          O =
            ((_ = e),
            (S = "fragment"),
            (E =
              "content" in z((T = "template"))
                ? function (e) {
                    var t = z(T);
                    return ((t.innerHTML = e), t.content);
                  }
                : function (e) {
                    var t,
                      n = z(S),
                      r = z(T);
                    return (
                      j(
                        n,
                        /^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(
                          e
                        )
                          ? ((t = RegExp.$1),
                            (r.innerHTML = "<table>" + e + "</table>"),
                            r.querySelectorAll(t))
                          : ((r.innerHTML = e), r.childNodes)
                      ),
                      n
                    );
                  }),
            function (e, t) {
              return (
                "svg" === t
                  ? function (e) {
                      var t = z(S),
                        n = z("div");
                      return (
                        (n.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg">' +
                          e +
                          "</svg>"),
                        j(t, n.firstChild.childNodes),
                        t
                      );
                    }
                  : E
              )(e);
            });
        function j(e, t) {
          for (var n = t.length; n--; ) e.appendChild(t[0]);
        }
        function z(e) {
          return e === S
            ? _.createDocumentFragment()
            : _.createElementNS("http://www.w3.org/1999/xhtml", e);
        }
        var M,
          q,
          U,
          W,
          F,
          B,
          H,
          G,
          V,
          J =
            ((q = "appendChild"),
            (U = "cloneNode"),
            (W = "createTextNode"),
            (B = (F = "importNode") in (M = e)),
            (H = M.createDocumentFragment())[q](M[W]("g")),
            H[q](M[W]("")),
            (B ? M[F](H, !0) : H[U](!0)).childNodes.length < 2
              ? function e(t, n) {
                  for (
                    var r = t[U](), s = t.childNodes || [], i = s.length, o = 0;
                    n && o < i;
                    o++
                  )
                    r[q](e(s[o], n));
                  return r;
                }
              : B
                ? M[F]
                : function (e, t) {
                    return e[U](!!t);
                  }),
          K =
            "".trim ||
            function () {
              return String(this).replace(/^\s+|\s+/g, "");
            },
          Y = "-" + Math.random().toFixed(6) + "%",
          Z = !1;
        try {
          ((G = e.createElement("template")),
            (V = "tabindex"),
            ("content" in G &&
              ((G.innerHTML = "<p " + V + '="' + Y + '"></p>'),
              G.content.childNodes[0].getAttribute(V) == Y)) ||
              ((Y = "_dt: " + Y.slice(1, -1) + ";"), (Z = !0)));
        } catch (u) {}
        var X = "\x3c!--" + Y + "--\x3e",
          Q = 8,
          ee = 1,
          te = 3,
          ne = /^(?:style|textarea)$/i,
          re =
            /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,
          se = " \\f\\n\\r\\t",
          ie = "[^" + se + "\\/>\"'=]+",
          oe = "[" + se + "]+" + ie,
          ae = "<([A-Za-z]+[A-Za-z0-9:._-]*)((?:",
          ce =
            "(?:\\s*=\\s*(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|" +
            ie.replace("\\/", "") +
            "))?)",
          le = new RegExp(ae + oe + ce + "+)([" + se + "]*/?>)", "g"),
          ue = new RegExp(ae + oe + ce + "*)([" + se + "]*/>)", "g"),
          de = new RegExp("(" + oe + "\\s*=\\s*)(['\"]?)" + X + "\\2", "gi");
        function pe(e, t, n, r) {
          return "<" + t + n.replace(de, he) + r;
        }
        function he(e, t, n) {
          return t + (n || '"') + Y + (n || '"');
        }
        function fe(e, t, n) {
          return re.test(t) ? e : "<" + t + n + "></" + t + ">";
        }
        var me = Z
          ? function (e, t) {
              var n = t.join(" ");
              return t.slice.call(e, 0).sort(function (e, t) {
                return n.indexOf(e.name) <= n.indexOf(t.name) ? -1 : 1;
              });
            }
          : function (e, t) {
              return t.slice.call(e, 0);
            };
        function ge(t, n, r, s) {
          for (var i = t.childNodes, o = i.length, a = 0; a < o; ) {
            var c = i[a];
            switch (c.nodeType) {
              case ee:
                var l = s.concat(a);
                (!(function (t, n, r, s) {
                  for (
                    var i,
                      o = t.attributes,
                      a = [],
                      c = [],
                      l = me(o, r),
                      u = l.length,
                      d = 0;
                    d < u;
                  ) {
                    var p = l[d++],
                      h = p.value === Y;
                    if (h || 1 < (i = p.value.split(X)).length) {
                      var f = p.name;
                      if (a.indexOf(f) < 0) {
                        a.push(f);
                        var m = r
                            .shift()
                            .replace(
                              h
                                ? /^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/
                                : new RegExp(
                                    "^(?:|[\\S\\s]*?\\s)(" +
                                      f +
                                      ")\\s*=\\s*('|\")[\\S\\s]*",
                                    "i"
                                  ),
                              "$1"
                            ),
                          g = o[m] || o[m.toLowerCase()];
                        if (h) n.push(be(g, s, m, null));
                        else {
                          for (var b = i.length - 2; b--; ) r.shift();
                          n.push(be(g, s, m, i));
                        }
                      }
                      c.push(p);
                    }
                  }
                  for (
                    var y =
                      (d = 0) < (u = c.length) &&
                      Z &&
                      !("ownerSVGElement" in t);
                    d < u;
                  ) {
                    var w = c[d++];
                    (y && (w.value = ""), t.removeAttribute(w.name));
                  }
                  var k = t.nodeName;
                  if (/^script$/i.test(k)) {
                    var v = e.createElement(k);
                    for (u = o.length, d = 0; d < u; )
                      v.setAttributeNode(o[d++].cloneNode(!0));
                    ((v.textContent = t.textContent),
                      t.parentNode.replaceChild(v, t));
                  }
                })(c, n, r, l),
                  ge(c, n, r, l));
                break;
              case Q:
                var u = c.textContent;
                if (u === Y)
                  (r.shift(),
                    n.push(
                      ne.test(t.nodeName)
                        ? ye(t, s)
                        : { type: "any", node: c, path: s.concat(a) }
                    ));
                else
                  switch (u.slice(0, 2)) {
                    case "/*":
                      if ("*/" !== u.slice(-2)) break;
                    case "👻":
                      (t.removeChild(c), a--, o--);
                  }
                break;
              case te:
                ne.test(t.nodeName) &&
                  K.call(c.textContent) === X &&
                  (r.shift(), n.push(ye(t, s)));
            }
            a++;
          }
        }
        function be(e, t, n, r) {
          return { type: "attr", node: e, path: t, name: n, sparse: r };
        }
        function ye(e, t) {
          return { type: "text", node: e, path: t };
        }
        var we,
          ke =
            ((we = new n()),
            {
              get: function (e) {
                return we.get(e);
              },
              set: function (e, t) {
                return (we.set(e, t), t);
              },
            });
        function ve(e, t) {
          var n = (
              e.convert ||
              function (e) {
                return e.join(X).replace(ue, fe).replace(le, pe);
              }
            )(t),
            r = e.transform;
          r && (n = r(n));
          var s = O(n, e.type);
          xe(s);
          var i = [];
          return (
            ge(s, i, t.slice(0), []),
            {
              content: s,
              updates: function (n) {
                for (var r = [], s = i.length, o = 0, a = 0; o < s; ) {
                  var c = i[o++],
                    l = (function (e, t) {
                      for (var n = t.length, r = 0; r < n; )
                        e = e.childNodes[t[r++]];
                      return e;
                    })(n, c.path);
                  switch (c.type) {
                    case "any":
                      r.push({ fn: e.any(l, []), sparse: !1 });
                      break;
                    case "attr":
                      var u = c.sparse,
                        d = e.attribute(l, c.name, c.node);
                      null === u
                        ? r.push({ fn: d, sparse: !1 })
                        : ((a += u.length - 2),
                          r.push({ fn: d, sparse: !0, values: u }));
                      break;
                    case "text":
                      (r.push({ fn: e.text(l), sparse: !1 }),
                        (l.textContent = ""));
                  }
                }
                return (
                  (s += a),
                  function () {
                    var e = arguments.length;
                    if (s !== e - 1)
                      throw new Error(
                        e -
                          1 +
                          " values instead of " +
                          s +
                          "\n" +
                          t.join("${value}")
                      );
                    for (var i = 1, o = 1; i < e; ) {
                      var a = r[i - o];
                      if (a.sparse) {
                        var c = a.values,
                          l = c[0],
                          u = 1,
                          d = c.length;
                        for (o += d - 2; u < d; ) l += arguments[i++] + c[u++];
                        a.fn(l);
                      } else a.fn(arguments[i++]);
                    }
                    return n;
                  }
                );
              },
            }
          );
        }
        var $e = [];
        function xe(e) {
          for (var t = e.childNodes, n = t.length; n--; ) {
            var r = t[n];
            1 !== r.nodeType &&
              0 === K.call(r.textContent).length &&
              e.removeChild(r);
          }
        }
        var Ce,
          _e,
          Se =
            ((Ce = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i),
            (_e = /([^A-Z])([A-Z]+)/g),
            function (e, t) {
              return "ownerSVGElement" in e
                ? (function (e, t) {
                    var n;
                    return (
                      ((n = t
                        ? t.cloneNode(!0)
                        : (e.setAttribute("style", "--hyper:style;"),
                          e.getAttributeNode("style"))).value = ""),
                      e.setAttributeNode(n),
                      Ee(n, !0)
                    );
                  })(e, t)
                : Ee(e.style, !1);
            });
        function Te(e, t, n) {
          return t + "-" + n.toLowerCase();
        }
        function Ee(e, t) {
          var n, r;
          return function (s) {
            var i, o, a, c;
            switch (typeof s) {
              case "object":
                if (s) {
                  if ("object" === n) {
                    if (!t && r !== s) for (o in r) o in s || (e[o] = "");
                  } else t ? (e.value = "") : (e.cssText = "");
                  for (o in ((i = t ? {} : e), s))
                    ((a =
                      "number" != typeof (c = s[o]) || Ce.test(o)
                        ? c
                        : c + "px"),
                      !t && /^--/.test(o) ? i.setProperty(o, a) : (i[o] = a));
                  ((n = "object"),
                    t
                      ? (e.value = (function (e) {
                          var t,
                            n = [];
                          for (t in e)
                            n.push(t.replace(_e, Te), ":", e[t], ";");
                          return n.join("");
                        })((r = i)))
                      : (r = s));
                  break;
                }
              default:
                r != s &&
                  ((n = "string"),
                  (r = s),
                  t ? (e.value = s || "") : (e.cssText = s || ""));
            }
          };
        }
        var Re,
          Ae,
          Le =
            ((Re = [].slice),
            ((Ae = Pe.prototype).ELEMENT_NODE = 1),
            (Ae.nodeType = 111),
            (Ae.remove = function (e) {
              var t,
                n = this.childNodes,
                r = this.firstChild,
                s = this.lastChild;
              return (
                (this._ = null),
                e && 2 === n.length
                  ? s.parentNode.removeChild(s)
                  : ((t = this.ownerDocument.createRange()).setStartBefore(
                      e ? n[1] : r
                    ),
                    t.setEndAfter(s),
                    t.deleteContents()),
                r
              );
            }),
            (Ae.valueOf = function (e) {
              var t = this._,
                n = null == t;
              if (
                (n &&
                  (t = this._ = this.ownerDocument.createDocumentFragment()),
                n || e)
              )
                for (var r = this.childNodes, s = 0, i = r.length; s < i; s++)
                  t.appendChild(r[s]);
              return t;
            }),
            Pe);
        function Pe(e) {
          var t = (this.childNodes = Re.call(e, 0));
          ((this.firstChild = t[0]),
            (this.lastChild = t[t.length - 1]),
            (this.ownerDocument = t[0].ownerDocument),
            (this._ = null));
        }
        function Ne(e) {
          return { html: e };
        }
        function Ie(e, t) {
          switch (e.nodeType) {
            case Be:
              return 1 / t < 0
                ? t
                  ? e.remove(!0)
                  : e.lastChild
                : t
                  ? e.valueOf(!0)
                  : e.firstChild;
            case Fe:
              return Ie(e.render(), t);
            default:
              return e;
          }
        }
        function De(e, t) {
          (t(e.placeholder),
            "text" in e
              ? Promise.resolve(e.text).then(String).then(t)
              : "any" in e
                ? Promise.resolve(e.any).then(t)
                : "html" in e
                  ? Promise.resolve(e.html).then(Ne).then(t)
                  : Promise.resolve(I.invoke(e, t)).then(t));
        }
        function Oe(e) {
          return null != e && "then" in e;
        }
        var je,
          ze,
          Me,
          qe,
          Ue,
          We = "ownerSVGElement",
          Fe = k.prototype.nodeType,
          Be = Le.prototype.nodeType,
          He =
            ((ze = (je = { Event: b, WeakSet: u }).Event),
            (Me = je.WeakSet),
            (qe = !0),
            (Ue = null),
            function (e) {
              return (
                qe &&
                  ((qe = !qe),
                  (Ue = new Me()),
                  (function (e) {
                    var t = new Me(),
                      n = new Me();
                    try {
                      new MutationObserver(o).observe(e, {
                        subtree: !0,
                        childList: !0,
                      });
                    } catch (t) {
                      var r = 0,
                        s = [],
                        i = function (e) {
                          (s.push(e),
                            clearTimeout(r),
                            (r = setTimeout(function () {
                              o(s.splice((r = 0), s.length));
                            }, 0)));
                        };
                      (e.addEventListener(
                        "DOMNodeRemoved",
                        function (e) {
                          i({ addedNodes: [], removedNodes: [e.target] });
                        },
                        !0
                      ),
                        e.addEventListener(
                          "DOMNodeInserted",
                          function (e) {
                            i({ addedNodes: [e.target], removedNodes: [] });
                          },
                          !0
                        ));
                    }
                    function o(e) {
                      for (var r, s = e.length, i = 0; i < s; i++)
                        (a((r = e[i]).removedNodes, "disconnected", n, t),
                          a(r.addedNodes, "connected", t, n));
                    }
                    function a(e, t, n, r) {
                      for (
                        var s, i = new ze(t), o = e.length, a = 0;
                        a < o;
                        1 === (s = e[a++]).nodeType &&
                        (function e(t, n, r, s, i) {
                          Ue.has(t) &&
                            !s.has(t) &&
                            (i.delete(t), s.add(t), t.dispatchEvent(n));
                          for (
                            var o = t.children || [], a = o.length, c = 0;
                            c < a;
                            e(o[c++], n, r, s, i)
                          );
                        })(s, i, t, n, r)
                      );
                    }
                  })(e.ownerDocument)),
                Ue.add(e),
                e
              );
            }),
          Ge = /^(?:form|list)$/i,
          Ve = [].slice;
        function Je(t) {
          return (
            (this.type = t),
            (function (t) {
              var n = $e,
                r = xe;
              return function (s) {
                var i, o, a;
                return (
                  n !== s &&
                    ((i = t),
                    (o = n = s),
                    (a = ke.get(o) || ke.set(o, ve(i, o))),
                    (r = a.updates(J.call(e, a.content, !0)))),
                  r.apply(null, arguments)
                );
              };
            })(this)
          );
        }
        var Ke = !(Je.prototype = {
            attribute: function (e, t, n) {
              var r,
                s = We in e;
              if ("style" === t) return Se(e, n, s);
              if ("." === t.slice(0, 1))
                return (
                  (l = e),
                  (u = t.slice(1)),
                  s
                    ? function (e) {
                        try {
                          l[u] = e;
                        } catch (t) {
                          l.setAttribute(u, e);
                        }
                      }
                    : function (e) {
                        l[u] = e;
                      }
                );
              if ("?" === t.slice(0, 1))
                return (
                  (o = e),
                  (a = t.slice(1)),
                  function (e) {
                    c !== !!e &&
                      ((c = !!e)
                        ? o.setAttribute(a, "")
                        : o.removeAttribute(a));
                  }
                );
              if (/^on/.test(t)) {
                var i = t.slice(2);
                return (
                  "connected" === i || "disconnected" === i
                    ? He(e)
                    : t.toLowerCase() in e && (i = i.toLowerCase()),
                  function (t) {
                    r !== t &&
                      (r && e.removeEventListener(i, r, !1),
                      (r = t) && e.addEventListener(i, t, !1));
                  }
                );
              }
              if ("data" === t || (!s && t in e && !Ge.test(t)))
                return function (n) {
                  r !== n &&
                    ((r = n),
                    e[t] !== n && null == n
                      ? ((e[t] = ""), e.removeAttribute(t))
                      : (e[t] = n));
                };
              if (t in I.attributes)
                return function (n) {
                  var s = I.attributes[t](e, n);
                  r !== s &&
                    (null == (r = s)
                      ? e.removeAttribute(t)
                      : e.setAttribute(t, s));
                };
              var o,
                a,
                c,
                l,
                u,
                d = !1,
                p = n.cloneNode(!0);
              return function (t) {
                r !== t &&
                  ((r = t),
                  p.value !== t &&
                    (null == t
                      ? (d && ((d = !1), e.removeAttributeNode(p)),
                        (p.value = t))
                      : ((p.value = t),
                        d || ((d = !0), e.setAttributeNode(p)))));
              };
            },
            any: function (e, t) {
              var n,
                r = { node: Ie, before: e },
                s = We in e ? "svg" : "html",
                i = !1;
              return function o(a) {
                switch (typeof a) {
                  case "string":
                  case "number":
                  case "boolean":
                    i
                      ? n !== a && ((n = a), (t[0].textContent = a))
                      : ((i = !0),
                        (n = a),
                        (t = f(
                          e.parentNode,
                          t,
                          [((c = a), e.ownerDocument.createTextNode(c))],
                          r
                        )));
                    break;
                  case "function":
                    o(a(e));
                    break;
                  case "object":
                  case "undefined":
                    if (null == a) {
                      ((i = !1), (t = f(e.parentNode, t, [], r)));
                      break;
                    }
                  default:
                    if (((i = !1), D((n = a))))
                      if (0 === a.length)
                        t.length && (t = f(e.parentNode, t, [], r));
                      else
                        switch (typeof a[0]) {
                          case "string":
                          case "number":
                          case "boolean":
                            o({ html: a });
                            break;
                          case "object":
                            if (
                              (D(a[0]) && (a = a.concat.apply([], a)), Oe(a[0]))
                            ) {
                              Promise.all(a).then(o);
                              break;
                            }
                          default:
                            t = f(e.parentNode, t, a, r);
                        }
                    else
                      "ELEMENT_NODE" in a
                        ? (t = f(
                            e.parentNode,
                            t,
                            11 === a.nodeType ? Ve.call(a.childNodes) : [a],
                            r
                          ))
                        : Oe(a)
                          ? a.then(o)
                          : "placeholder" in a
                            ? De(a, o)
                            : "text" in a
                              ? o(String(a.text))
                              : "any" in a
                                ? o(a.any)
                                : "html" in a
                                  ? (t = f(
                                      e.parentNode,
                                      t,
                                      Ve.call(
                                        O([].concat(a.html).join(""), s)
                                          .childNodes
                                      ),
                                      r
                                    ))
                                  : o(
                                      "length" in a
                                        ? Ve.call(a)
                                        : I.invoke(a, o)
                                    );
                }
                var c;
              };
            },
            text: function (e) {
              var t;
              return function n(r) {
                var s;
                t !== r &&
                  ("object" == (s = typeof (t = r)) && r
                    ? Oe(r)
                      ? r.then(n)
                      : "placeholder" in r
                        ? De(r, n)
                        : n(
                            "text" in r
                              ? String(r.text)
                              : "any" in r
                                ? r.any
                                : "html" in r
                                  ? [].concat(r.html).join("")
                                  : "length" in r
                                    ? Ve.call(r).join("")
                                    : I.invoke(r, n)
                          )
                    : "function" == s
                      ? n(r(e))
                      : (e.textContent = null == r ? "" : r));
              };
            },
          }),
          Ye = function (t) {
            var r,
              s,
              i,
              o,
              a =
                ((r = (e.defaultView.navigator || {}).userAgent),
                /(Firefox|Safari)\/(\d+)/.test(r) &&
                  !/(Chrom[eium]+|Android)\/(\d+)/.test(r)),
              c =
                !("raw" in t) ||
                t.propertyIsEnumerable("raw") ||
                !Object.isFrozen(t.raw);
            return (
              a || c
                ? ((s = {}),
                  (i = function (e) {
                    for (var t = ".", n = 0; n < e.length; n++)
                      t += e[n].length + "." + e[n];
                    return s[t] || (s[t] = e);
                  }),
                  (Ye = c
                    ? i
                    : ((o = new n()),
                      function (e) {
                        return o.get(e) || ((n = i((t = e))), o.set(t, n), n);
                        var t, n;
                      })))
                : (Ke = !0),
              Ze(t)
            );
          };
        function Ze(e) {
          return Ke ? e : Ye(e);
        }
        function Xe(e) {
          for (var t = arguments.length, n = [Ze(e)], r = 1; r < t; )
            n.push(arguments[r++]);
          return n;
        }
        var Qe = new n(),
          et = function (e) {
            var t, n, r;
            return function () {
              var s = Xe.apply(null, arguments);
              return (
                r !== s[0]
                  ? ((r = s[0]), (n = new Je(e)), (t = nt(n.apply(n, s))))
                  : n.apply(n, s),
                t
              );
            };
          },
          tt = function (e, t) {
            var n = t.indexOf(":"),
              r = Qe.get(e),
              s = t;
            return (
              -1 < n && ((s = t.slice(n + 1)), (t = t.slice(0, n) || "html")),
              r || Qe.set(e, (r = {})),
              r[s] || (r[s] = et(t))
            );
          },
          nt = function (e) {
            var t = e.childNodes,
              n = t.length;
            return 1 === n ? t[0] : n ? new Le(t) : e;
          },
          rt = new n();
        function st() {
          var e = rt.get(this),
            t = Xe.apply(null, arguments);
          return (
            e && e.template === t[0]
              ? e.tagger.apply(null, t)
              : function (e) {
                  var t = new Je(We in this ? "svg" : "html");
                  (rt.set(this, { tagger: t, template: e }),
                    (this.textContent = ""),
                    this.appendChild(t.apply(null, arguments)));
                }.apply(this, t),
            this
          );
        }
        var it,
          ot,
          at,
          ct,
          lt = I.define,
          ut = Je.prototype;
        function dt(e) {
          return arguments.length < 2
            ? null == e
              ? et("html")
              : "string" == typeof e
                ? dt.wire(null, e)
                : "raw" in e
                  ? et("html")(e)
                  : "nodeType" in e
                    ? dt.bind(e)
                    : tt(e, "html")
            : ("raw" in e ? et("html") : dt.wire).apply(null, arguments);
        }
        return (
          (dt.Component = k),
          (dt.bind = function (e) {
            return st.bind(e);
          }),
          (dt.define = lt),
          (dt.diff = f),
          ((dt.hyper = dt).observe = He),
          (dt.tagger = ut),
          (dt.wire = function (e, t) {
            return null == e ? et(t || "html") : tt(e, t || "html");
          }),
          (dt._ = { WeakMap: n, WeakSet: u }),
          (it = et),
          (ot = new n()),
          (at = Object.create),
          (ct = function (e, t) {
            var n = { w: null, p: null };
            return (t.set(e, n), n);
          }),
          Object.defineProperties(k, {
            for: {
              configurable: !0,
              value: function (e, t) {
                return (function (e, t, r, s) {
                  var i,
                    o,
                    a,
                    c = t.get(e) || ct(e, t);
                  switch (typeof s) {
                    case "object":
                    case "function":
                      var l = c.w || (c.w = new n());
                      return (
                        l.get(s) ||
                        ((i = l), (o = s), (a = new e(r)), i.set(o, a), a)
                      );
                    default:
                      var u = c.p || (c.p = at(null));
                      return u[s] || (u[s] = new e(r));
                  }
                })(
                  this,
                  ot.get(e) || ((r = e), (s = new w()), ot.set(r, s), s),
                  e,
                  null == t ? "default" : t
                );
                var r, s;
              },
            },
          }),
          Object.defineProperties(k.prototype, {
            handleEvent: {
              value: function (e) {
                var t = e.currentTarget;
                this[
                  ("getAttribute" in t && t.getAttribute("data-call")) ||
                    "on" + e.type
                ](e);
              },
            },
            html: v("html", it),
            svg: v("svg", it),
            state: v("state", function () {
              return this.defaultState;
            }),
            defaultState: {
              get: function () {
                return {};
              },
            },
            dispatch: {
              value: function (e, t) {
                var n = this._wire$;
                if (n) {
                  var r = new b(e, { bubbles: !0, cancelable: !0, detail: t });
                  return (
                    (r.component = this),
                    (n.dispatchEvent ? n : n.firstChild).dispatchEvent(r)
                  );
                }
                return !1;
              },
            },
            setState: {
              value: function (e, t) {
                var n = this.state,
                  r = "function" == typeof e ? e.call(this, n) : e;
                for (var s in r) n[s] = r[s];
                return (!1 !== t && this.render(), this);
              },
            },
          }),
          dt
        );
      })(document);
    const {
        Component: er,
        bind: tr,
        define: nr,
        diff: rr,
        hyper: sr,
        wire: ir,
      } = Qn,
      or = Qn,
      ar = A,
      cr = Gn,
      lr = class {
        constructor(e) {
          const {
            type: t,
            subtype: n,
            params: r,
          } = (function (e) {
            if (((e = e.trim()), !e)) throw new TypeError("Invalid input.");
            let t = "",
              n = "",
              r = "",
              s = null,
              i = new Map(),
              o = "type",
              a = Array.from(e);
            for (let e = 0; e < a.length; e++) {
              const c = a[e];
              switch (o) {
                case "type":
                  if ("/" === c) {
                    o = "subtype";
                    continue;
                  }
                  t += c;
                  break;
                case "subtype":
                  if (";" === c) {
                    o = "param-start";
                    continue;
                  }
                  n += c;
                  break;
                case "param-start":
                  if (_t.test(c) || ";" === c) continue;
                  ((r += c), (o = "param-name"));
                  break;
                case "param-name":
                  if ("=" === c || ";" === c) {
                    if ("=" === c) {
                      ((o = "param-value"), (s = null));
                      continue;
                    }
                    (i.set(r.toLowerCase(), null), (r = ""));
                    continue;
                  }
                  r += c;
                  break;
                case "param-value":
                  if ('"' == c) {
                    o = "collect-quoted-string";
                    continue;
                  }
                  if (";" === c) {
                    ((s = s.trimEnd()),
                      (o = "param-start"),
                      Tt(i, r, s),
                      (r = ""));
                    continue;
                  }
                  s = "string" == typeof s ? s + c : c;
                  break;
                case "collect-quoted-string":
                  if ('"' === c) {
                    (Tt(i, r, s),
                      (o = "ignore-input-until-next-param"),
                      (r = ""),
                      (s = null));
                    continue;
                  }
                  if ("\\" === c) continue;
                  s = "string" == typeof s ? s + c : c;
                  break;
                case "ignore-input-until-next-param":
                  if (";" !== c) continue;
                  o = "param-start";
                  break;
                default:
                  throw new Error(
                    `State machine error - unknown parser mode: ${o} `
                  );
              }
            }
            r && Tt(i, r, s);
            if ("" === t.trim() || !Ct.test(t))
              throw new TypeError("Invalid type");
            if ("" === n.trim() || !Ct.test(n))
              throw new TypeError("Invalid subtype");
            return {
              type: t,
              subtype: n,
              params: Object.fromEntries(i.entries()),
            };
          })(e);
          ((this.type = t.trim().toLowerCase()),
            (this.subtype = n.trimEnd().toLowerCase()),
            (this.parameters = new Map(Object.entries(r))));
        }
        get essence() {
          return `${this.type}/${this.subtype}`;
        }
        toString() {
          return (function (e) {
            const { parameters: t, essence: n } = e;
            if (!t.size) return n;
            let r = ";";
            for (const [e, n] of t.entries())
              ((r += e),
                null !== n
                  ? Ct.test(n)
                    ? (r += `=${n}`)
                    : (r += `="${n}"`)
                  : (r += '=""'),
                (r += ";"));
            return e.essence + r.slice(0, -1);
          })(this);
        }
      },
      ur = Xn,
      dr = Je,
      pr = class {
        lexer;
        curToken = xt;
        peekToken = xt;
        getCurToken() {
          return this.curToken;
        }
        getPeekToken() {
          return this.peekToken;
        }
        constructor(e) {
          ((this.lexer = new $t(e)), this._nextToken(), this._nextToken());
        }
        parse() {
          const e = [];
          for (; this.getCurToken().type !== Ve.EOF; ) {
            const t = this._parseRule();
            e.push(t);
          }
          const t = new et(e);
          return (
            (t.separator = this._nextToken()),
            t.setChildrenParent(),
            this._convertGroupDefinitions(t),
            t
          );
        }
        _parseRule() {
          const e = this._parseTypename(!0, null),
            t = this._nextToken();
          let n;
          if (t.type === Ve.ASSIGN || t.type === Ve.GCHOICEALT) {
            const r = this._parseGroupEntry();
            n = new tt(e, t, r);
          } else {
            if (t.type !== Ve.TCHOICEALT)
              throw this._parserError(
                `expected assignment (\`=\`, \`/=\`, \`//=\`) after \`${e.serialize().trim()}\`, got \`${t.serialize().trim()}\``
              );
            {
              const r = this._parseType();
              if (!(r instanceof mt)) throw new Error("Expected Type instance");
              n = new tt(e, t, r);
            }
          }
          return n;
        }
        _parseGroupEntry() {
          const e = this._parseOccurrence(),
            t = this._parseType(!0);
          let n;
          if (t instanceof ft) {
            const r = this._parseType(!1);
            if (!(r instanceof mt)) throw new Error("Expected Type instance");
            n = new nt(e, t, r);
          } else n = new nt(e, null, t);
          return n;
        }
        _parseType(e = !1) {
          const t = [];
          let n = this._parseType1(e);
          if ((t.push(n), e && this.getCurToken().type === Ve.CARET)) {
            const e = [];
            if (
              (e.push(this._nextToken()),
              this.getCurToken().type !== Ve.ARROWMAP)
            )
              throw this._parserError(
                "expected arrow map (`=>`), got `#{(this.getCurToken().serialize() + this.getPeekToken().serialize()).trim()}`"
              );
            e.push(this._nextToken());
            return new ft(n, !0, !1, e);
          }
          if (e && this.getCurToken().type === Ve.ARROWMAP) {
            return new ft(n, !1, !1, [this._nextToken()]);
          }
          if (e && this.getCurToken().type === Ve.COLON) {
            return new ft(n, !0, !0, [this._nextToken()]);
          }
          for (; this.getCurToken().type === Ve.TCHOICE; )
            ((n.separator = this._nextToken()),
              (n = this._parseType1()),
              t.push(n));
          return new mt(t);
        }
        _parseType1(e = !1) {
          const t = this._parseType2(e);
          let n;
          if (
            this.getCurToken().type === Ve.INCLRANGE ||
            this.getCurToken().type === Ve.EXCLRANGE
          ) {
            const e = this._nextToken(),
              r = this._parseType2();
            if (!(t instanceof lt || t instanceof ut))
              throw this._parserError(
                `expected range min to be a value or a typename, got \`${t.serialize().trim()}\``
              );
            if (!(r instanceof lt || r instanceof ut))
              throw this._parserError(
                `expected range max to be a value or a typename, got \`${r.serialize().trim()}\``
              );
            n = new pt(t, r, e);
          } else if (this.getCurToken().type === Ve.CTLOP) {
            const e = this._nextToken(),
              r = this._parseType2();
            n = new ht(t, e, r);
          } else n = t;
          return n;
        }
        _parseType2(e = !1) {
          let t;
          if (this.getCurToken().type === Ve.LPAREN) {
            const n = this._nextToken();
            if (e) t = this._parseGroup(!1);
            else {
              const e = this._parseType();
              if (!(e instanceof mt)) throw new Error("Expected Type instance");
              t = e;
            }
            if (((t.openToken = n), this.getCurToken().type !== Ve.RPAREN))
              throw this._parserError(
                `expected right parenthesis, got \`${this.getCurToken().serialize().trim()}\``
              );
            t.closeToken = this._nextToken();
          } else if (this.getCurToken().type === Ve.LBRACE) {
            const e = this._nextToken();
            if (
              ((t = this._parseGroup(!0)),
              (t.openToken = e),
              this.getCurToken().type !== Ve.RBRACE)
            )
              throw this._parserError(
                `expected right brace, got \`${this.getCurToken().serialize()}\``
              );
            t.closeToken = this._nextToken();
          } else if (this.getCurToken().type === Ve.LBRACK) {
            const e = this._nextToken(),
              n = this._parseGroup(!1);
            if (
              ((t = new it(n.groupChoices)),
              (t.openToken = e),
              this.getCurToken().type !== Ve.RBRACK)
            )
              throw this._parserError(
                `expected right bracket, got \`${this.getCurToken().serialize().trim()}\``
              );
            t.closeToken = this._nextToken();
          } else if (this.getCurToken().type === Ve.TILDE) {
            const e = this._nextToken();
            t = this._parseTypename(!1, e);
          } else if (this.getCurToken().type === Ve.AMPERSAND) {
            const e = this._nextToken();
            if (this.getCurToken().type === Ve.LPAREN) {
              const e = this._nextToken(),
                n = this._parseGroup(!1);
              if (((n.openToken = e), this.getCurToken().type !== Ve.RPAREN))
                throw this._parserError(
                  `expected right parenthesis, got \`${this.getCurToken().serialize().trim()}\``
                );
              ((n.closeToken = this._nextToken()), (t = new dt(n)));
            } else {
              const e = this._parseTypename(!1, null);
              t = new dt(e);
            }
            t.setComments(e);
          } else if (this.getCurToken().type === Ve.HASH) {
            const e = this._nextToken();
            if (
              (this.getCurToken().type !== Ve.NUMBER &&
                this.getCurToken().type !== Ve.FLOAT) ||
              this.getCurToken().startWithSpaces()
            )
              t = new at();
            else {
              const e = this._nextToken();
              if (
                e.literal.length > 1 &&
                ("." !== e.literal[1] || e.literal.includes("e"))
              )
                throw this._parserError(
                  `expected data item after "#" to match \`DIGIT ["." uint]\`, got \`${this.getCurToken().serialize().trim()}\``
                );
              if (
                "6" !== e.literal[0] ||
                this.getCurToken().type !== Ve.LPAREN ||
                this.getCurToken().startWithSpaces()
              )
                t = new at(e);
              else {
                const n = this._parseType2();
                if (!(n instanceof mt))
                  throw new Error("Expected Type instance");
                t = new at(e, n);
              }
            }
            t.setComments(e);
          } else if (this.getCurToken().type === Ve.IDENT)
            t = this._parseTypename(!1, null);
          else if (this.getCurToken().type === Ve.STRING) {
            const e = this._nextToken();
            ((t = new lt(e.literal, "text")), t.setComments(e));
          } else if (this.getCurToken().type === Ve.BYTES) {
            const e = this._nextToken();
            ((t = new lt(e.literal, "bytes")), t.setComments(e));
          } else if (this.getCurToken().type === Ve.HEX) {
            const e = this._nextToken();
            ((t = new lt(e.literal, "hex")), t.setComments(e));
          } else if (this.getCurToken().type === Ve.BASE64) {
            const e = this._nextToken();
            ((t = new lt(e.literal, "base64")), t.setComments(e));
          } else if (this.getCurToken().type === Ve.NUMBER) {
            const e = this._nextToken();
            ((t = new lt(e.literal, "number")), t.setComments(e));
          } else {
            if (this.getCurToken().type !== Ve.FLOAT)
              throw this._parserError(
                `invalid type2 production, got \`${this.getCurToken().serialize().trim()}\``
              );
            {
              const e = this._nextToken();
              ((t = new lt(e.literal, "number")), t.setComments(e));
            }
          }
          return t;
        }
        _parseGroup(e = !1) {
          const t = [];
          for (
            ;
            this.getCurToken().type !== Ve.RPAREN &&
            this.getCurToken().type !== Ve.RBRACE &&
            this.getCurToken().type !== Ve.RBRACK;
          ) {
            const e = [];
            for (; this.getCurToken().type !== Ve.GCHOICE; ) {
              const t = this._parseGroupEntry();
              if (
                (e.push(t),
                this.getCurToken().type === Ve.COMMA &&
                  (t.separator = this._nextToken()),
                this.getCurToken().type === Ve.RPAREN ||
                  this.getCurToken().type === Ve.RBRACE ||
                  this.getCurToken().type === Ve.RBRACK)
              )
                break;
            }
            const n = new ot(e);
            if (
              (t.push(n),
              this.getCurToken().type === Ve.RPAREN ||
                this.getCurToken().type === Ve.RBRACE ||
                this.getCurToken().type === Ve.RBRACK)
            )
              break;
            n.separator = this._nextToken();
          }
          let n;
          return ((n = e ? new st(t) : new rt(t)), n);
        }
        _parseOccurrence() {
          const e = [];
          let t = null;
          if (
            this.getCurToken().type === Ve.QUEST ||
            this.getCurToken().type === Ve.ASTERISK ||
            this.getCurToken().type === Ve.PLUS
          ) {
            const n = this.getCurToken().type === Ve.PLUS ? 1 : 0;
            let r = 1 / 0;
            (this.getCurToken().type === Ve.ASTERISK &&
              this.getPeekToken().type === Ve.NUMBER &&
              kt(this.getPeekToken().literal) &&
              !this.getPeekToken().startWithSpaces() &&
              (e.push(this._nextToken()),
              (r = parseInt(this.getCurToken().literal))),
              e.push(this._nextToken()),
              (t = new ct(n, r, e)));
          } else if (
            this.getCurToken().type === Ve.NUMBER &&
            kt(this.getCurToken().literal) &&
            this.getPeekToken().type === Ve.ASTERISK &&
            !this.getPeekToken().startWithSpaces()
          ) {
            const n = parseInt(this.getCurToken().literal);
            let r = 1 / 0;
            (e.push(this._nextToken()),
              e.push(this._nextToken()),
              this.getCurToken().type === Ve.NUMBER &&
                kt(this.getCurToken().literal) &&
                !this.getCurToken().startWithSpaces() &&
                ((r = parseInt(this.getCurToken().literal)),
                e.push(this._nextToken())),
              (t = new ct(n, r, e)));
          }
          return t;
        }
        _parseTypename(e = !1, t = null) {
          if (this.getCurToken().type !== Ve.IDENT)
            throw this._parserError(
              `expected group identifier, got \`${this.getCurToken().serialize().trim()}\``
            );
          const n = this._nextToken();
          let r;
          r = e
            ? this._parseGenericParameters()
            : this._parseGenericArguments();
          const s = new ut(n.literal, t, r);
          return (s.setComments(n), s);
        }
        _parseGenericParameters() {
          if (
            this.getCurToken().type !== Ve.LT ||
            this.getCurToken().startWithSpaces()
          )
            return null;
          const e = this._nextToken(),
            t = [];
          let n = this._parseTypename();
          for (t.push(n); this.getCurToken().type === Ve.COMMA; )
            ((n.separator = this._nextToken()),
              (n = this._parseTypename()),
              t.push(n));
          const r = new gt(t);
          if (((r.openToken = e), this.getCurToken().type !== Ve.GT))
            throw this._parserError(
              `expected \`>\` character to end generic production, got \`${this.getCurToken().serialize().trim()}\``
            );
          return ((r.closeToken = this._nextToken()), r);
        }
        _parseGenericArguments() {
          if (
            this.getCurToken().type !== Ve.LT ||
            this.getCurToken().startWithSpaces()
          )
            return null;
          const e = this._nextToken(),
            t = [];
          let n = this._parseType1();
          for (t.push(n); this.getCurToken().type === Ve.COMMA; )
            ((n.separator = this._nextToken()),
              (n = this._parseType1()),
              t.push(n));
          const r = new bt(t);
          if (((r.openToken = e), this.getCurToken().type !== Ve.GT))
            throw this._parserError(
              `expected \`>\` character to end generic production, got \`${this.getCurToken().serialize().trim()}\``
            );
          return ((r.closeToken = this._nextToken()), r);
        }
        _convertGroupDefinitions(e) {
          const t = new Set(),
            n = new Set(),
            r = new Set(),
            s = e => {
              if (
                e instanceof lt ||
                e instanceof st ||
                e instanceof it ||
                e instanceof dt ||
                e instanceof at
              )
                return "type";
              if (e instanceof pt) return s(e.min);
              if (e instanceof ht) return s(e.type);
              if (e instanceof ut) {
                const t = e.name;
                if (n.has(t) || this._isPreludeType(t)) return "type";
                if (r.has(t)) return "group";
              }
              return "unknown";
            };
          for (const s of e.rules)
            (t.add(s.name.name),
              0 === n.size && n.add(s.name.name),
              s.type instanceof mt
                ? n.add(s.name.name)
                : (s.assign.type === Ve.TCHOICEALT && n.add(s.name.name),
                  s.assign.type === Ve.GCHOICEALT && r.add(s.name.name),
                  s.type.type.types.length > 1 &&
                    null === s.type.type.openToken &&
                    n.add(s.name.name),
                  null !== s.type.occurrence && r.add(s.name.name),
                  null !== s.type.key && r.add(s.name.name)));
          const i = e => {
            e instanceof nt &&
              null !== e.key &&
              e.key.type instanceof ut &&
              !e.key.hasColon &&
              t.has(e.key.type.name) &&
              n.add(e.key.type.name);
            for (const t of e.getChildren()) i(t);
          };
          i(e);
          let o = !0;
          for (; o; ) {
            o = !1;
            for (const i of e.rules)
              if (i.type instanceof mt)
                for (const e of i.type.types)
                  e instanceof ut &&
                    t.has(e.name) &&
                    (n.has(e.name) || ((o = !0), n.add(e.name)));
              else {
                if (n.has(i.name.name))
                  for (const e of i.type.type.types)
                    e instanceof ut &&
                      t.has(e.name) &&
                      (n.has(e.name) || ((o = !0), n.add(e.name)));
                if (r.has(i.name.name))
                  for (const e of i.type.type.types)
                    e instanceof ut &&
                      t.has(e.name) &&
                      (r.has(e.name) || ((o = !0), r.add(e.name)));
                if (i.assign.type === Ve.ASSIGN) {
                  const e = new Set(i.type.type.types.map(e => s(e)));
                  if (e.has("type") && e.has("group"))
                    throw new yt(
                      `CDDL semantic error - rule \`${i.name.name}\` targets a mix of type and group rules`
                    );
                  e.has("type")
                    ? n.has(i.name.name) || ((o = !0), n.add(i.name.name))
                    : e.has("group") &&
                      (r.has(i.name.name) || ((o = !0), r.add(i.name.name)));
                }
              }
          }
          const a = [...n].filter(e => r.has(e));
          if (a.length > 0) {
            const e = a.join(", ");
            throw new yt(
              `CDDL semantic error - mix of type and group definitions for ${e}`
            );
          }
          for (const t of e.rules)
            if (!(t.type instanceof mt) && n.has(t.name.name)) {
              if (!t.type.isConvertibleToType())
                throw new yt(
                  `CDDL semantic error - rule \`${t.name.name}\` is a type definition but uses a group entry`
                );
              t.type = t.type.type;
            }
        }
        _isPreludeType(e) {
          return [
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
          ].includes(e);
        }
        _nextToken() {
          const e = this.curToken;
          return (
            (this.curToken = this.peekToken),
            (this.peekToken = this.lexer.nextToken()),
            e
          );
        }
        _parserError(e) {
          const t = this.lexer.getLocation();
          return new yt(`CDDL syntax error - line ${t.line + 1}: ${e}`);
        }
      },
      hr = class {
        serializeToken(e, t) {
          return e.serialize();
        }
        serializeValue(e, t, n, r) {
          return e + t + n;
        }
        serializeName(e, t) {
          return e;
        }
        markupFor(e) {
          return [null, null];
        }
      },
      fr = tt,
      mr = ft,
      gr = gt,
      br = bt,
      yr = mt,
      wr = ct,
      kr = /-/g,
      vr = RegExp.escape ?? (e => e.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"));
    const $r = new Intl.DateTimeFormat(["sv-SE"], {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      xr = "en" === i || i.startsWith("en-") ? "en-AU" : i,
      Cr = new Intl.DateTimeFormat(xr, {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "en-AU" === xr ? "2-digit" : "numeric",
      }),
      _r =
        ".informative, .note, .issue, .example, .ednote, .practice, .introductory";
    function Sr(e) {
      const t = new URL(e.href, document.baseURI),
        n = document.createElement("link");
      let { href: r } = t;
      switch (((n.rel = e.hint), n.rel)) {
        case "dns-prefetch":
        case "preconnect":
          ((r = t.origin),
            (e.corsMode || t.origin !== document.location.origin) &&
              (n.crossOrigin = e.corsMode || "anonymous"));
          break;
        case "preload":
          ("as" in e && n.setAttribute("as", e.as || ""),
            e.corsMode && (n.crossOrigin = e.corsMode));
      }
      return ((n.href = r), e.dontRemove || n.classList.add("removeOnSave"), n);
    }
    function Tr(e) {
      e.querySelectorAll(".remove, script[data-requiremodule]").forEach(e => {
        e.remove();
      });
    }
    function Er(e, t = "long") {
      const n = new Intl.ListFormat(i, { style: t, type: e });
      return (e, t) => {
        let r = 0;
        return n
          .formatToParts(e)
          .map(({ type: n, value: s }) =>
            "element" === n && t ? t(s, r++, e) : s
          );
      };
    }
    const Rr = Er("conjunction"),
      Ar = Er("disjunction");
    function Lr(e, t) {
      return Rr(e, t).join("");
    }
    function Pr(e, t) {
      return Ar(e, t).join("");
    }
    function Nr(e) {
      return e
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
    }
    function Ir(e) {
      return e.trim().replace(/\s+/g, " ");
    }
    function Dr(e, t = i) {
      return (
        (t = t.toLowerCase()),
        new Proxy(e, {
          get(e, n) {
            const r = Or(e, n, t) || e.en[n];
            if (!r) throw new Error(`No l10n data for key: "${n}"`);
            return r;
          },
        })
      );
    }
    function Or(e, t, n = i) {
      n = n.toLowerCase();
      const r = n.match(/^(\w{2,3})-.+$/)?.[1] ?? "";
      return e[n]?.[t] || e[r]?.[t];
    }
    function jr(e, t = "") {
      return $r.format(e).replace(kr, t);
    }
    function zr(e, t, ...n) {
      const r = [this, e, ...n];
      if (t) {
        const n = t.split(/\s+/);
        for (const t of n) {
          const n = window[t];
          if (n)
            try {
              e = n.apply(this, r);
            } catch (e) {
              is(
                `call to \`${t}()\` failed with: ${e}.`,
                "utils/runTransforms",
                { hint: "See developer console for stack trace.", cause: e }
              );
            }
        }
      }
      return e;
    }
    async function Mr(e, t = 864e5) {
      const n = new Request(e),
        r = new URL(n.url);
      let s, i;
      if ("caches" in window)
        try {
          if (
            ((s = await caches.open(r.origin)),
            (i = await s.match(n)),
            i && new Date(i.headers.get("Expires") ?? "") > new Date())
          )
            return i;
        } catch (e) {
          console.error("Failed to use Cache API.", e);
        }
      const o = await fetch(n);
      if (!o.ok && i)
        return (console.warn(`Returning a stale cached response for ${r}`), i);
      if (s && o.ok) {
        const e = o.clone(),
          r = new Headers(o.headers),
          i = new Date(Date.now() + t);
        r.set("Expires", i.toISOString());
        const a = new Response(await e.blob(), { headers: r });
        await s.put(n, a).catch(console.error);
      }
      return o;
    }
    function qr(e, t = e => e) {
      const n = e.map(t),
        r = n.slice(0, -1).map(e => or`${e}, `);
      return or`${r}${n[n.length - 1]}`;
    }
    function Ur(e, t) {
      return []
        .concat(Rr(e, t))
        .map(e => ("string" == typeof e ? or`${e}` : e));
    }
    function Wr(e, t = "") {
      const n = (function (e) {
        let t = 0;
        for (const n of e) t = (Math.imul(31, t) + n.charCodeAt(0)) | 0;
        return String(t);
      })(Ir(e.textContent));
      return Br(e, t, n);
    }
    function Fr(e, t = !1) {
      return (t ? e : e.toLowerCase())
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\W+/gim, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    }
    function Br(e, t = "", n = "", r = !1) {
      if (e.id) return e.id;
      n || (n = (e.title ? e.title : e.textContent).trim());
      let s = Fr(n, r);
      if (
        (s
          ? (!/\.$/.test(s) && /^[a-z]/i.test(t || s)) || (s = `x${s}`)
          : (s = "generatedID"),
        t && (s = `${t}-${s}`),
        e.ownerDocument.getElementById(s))
      ) {
        let t = 0,
          n = `${s}-${t}`;
        for (; e.ownerDocument.getElementById(n); )
          ((t += 1), (n = `${s}-${t}`));
        s = n;
      }
      return ((e.id = s), s);
    }
    function Hr(e) {
      const t = new Set(),
        n = "ltNodefault" in e.dataset ? "" : Ir(e.textContent),
        r = e.children[0];
      if (
        (e.dataset.lt
          ? e.dataset.lt
              .split("|")
              .map(e => Ir(e))
              .forEach(e => t.add(e))
          : 1 === e.childNodes.length &&
              1 === e.getElementsByTagName("abbr").length &&
              r &&
              r.title
            ? t.add(r.title)
            : '""' === e.textContent && t.add("the-empty-string"),
        t.add(n),
        t.delete(""),
        e.dataset.localLt)
      ) {
        e.dataset.localLt.split("|").forEach(e => t.add(Ir(e)));
      }
      return [...t];
    }
    function Gr(e, t, n = { copyAttributes: !0 }) {
      if (e.localName === t) return e;
      const r = e.ownerDocument.createElement(t);
      if (n.copyAttributes)
        for (const { name: t, value: n } of e.attributes) r.setAttribute(t, n);
      return (r.append(...e.childNodes), e.replaceWith(r), r);
    }
    function Vr(e, t) {
      const n = t.closest(_r);
      let r = !1;
      if (
        (n && (r = !t.closest(".normative") || !n.querySelector(".normative")),
        e.startsWith("!"))
      ) {
        if (r) return { type: "informative", illegal: !0 };
        r = !1;
      } else e.startsWith("?") && (r = !0);
      return { type: r ? "informative" : "normative", illegal: !1 };
    }
    function Jr(e, t) {
      return (t.append(...e.childNodes), e.appendChild(t), e);
    }
    function Kr(e) {
      const t = [];
      for (const n of (function* (e) {
        let t = e;
        for (; t.previousElementSibling; )
          ((t = t.previousElementSibling), yield t);
      })(e))
        "section" === n.localName && t.push(n);
      return t;
    }
    function Yr(e, t) {
      const n = [];
      let r = e.parentElement;
      for (; r; ) {
        const e = r.closest(t);
        if (!e) break;
        (n.push(e), (r = e.parentElement));
      }
      return n;
    }
    function Zr(e) {
      const { previousSibling: t } = e;
      if (!t || t.nodeType !== Node.TEXT_NODE) return "";
      const n = (t.textContent ?? "").lastIndexOf("\n");
      if (-1 === n) return "";
      const r = (t.textContent ?? "").slice(n + 1);
      return /\S/.test(r) ? "" : r;
    }
    class Xr extends Set {
      constructor(e = []) {
        super();
        for (const t of e) this.add(t);
      }
      add(e) {
        return this.has(e) || this.getCanonicalKey(e) ? this : super.add(e);
      }
      has(e) {
        return (
          super.has(e) ||
          [...this.keys()].some(t => t.toLowerCase() === e.toLowerCase())
        );
      }
      delete(e) {
        return super.has(e)
          ? super.delete(e)
          : super.delete(this.getCanonicalKey(e) ?? e);
      }
      getCanonicalKey(e) {
        return super.has(e)
          ? e
          : this.keys().find(t => t.toLowerCase() === e.toLowerCase());
      }
    }
    function Qr(e) {
      const t = e.cloneNode(!0);
      return (
        t.querySelectorAll("[id]").forEach(e => e.removeAttribute("id")),
        t.querySelectorAll("dfn").forEach(e => {
          Gr(e, "span", { copyAttributes: !1 });
        }),
        t.hasAttribute("id") && t.removeAttribute("id"),
        es(t),
        t
      );
    }
    function es(e) {
      const t = document.createTreeWalker(e, NodeFilter.SHOW_COMMENT);
      for (const e of [...ts(t)]) e.remove();
    }
    function* ts(e) {
      for (; e.nextNode(); ) yield e.currentNode;
    }
    class ns extends Map {
      constructor(e = []) {
        return (
          super(),
          e.forEach(([e, t]) => {
            this.set(e, t);
          }),
          this
        );
      }
      set(e, t) {
        return (super.set(e.toLowerCase(), t), this);
      }
      get(e) {
        return super.get(e.toLowerCase());
      }
      has(e) {
        return super.has(e.toLowerCase());
      }
      delete(e) {
        return super.delete(e.toLowerCase());
      }
    }
    class rs extends Error {
      constructor(e, t, n) {
        super(e, { ...(n.cause && { cause: n.cause }) });
        const r = n.isWarning ? "ReSpecWarning" : "ReSpecError";
        (Object.assign(this, { message: e, plugin: t, name: r, ...n }),
          n.elements &&
            n.elements.forEach(t =>
              (function (e, t, n) {
                (e.classList.add("respec-offending-element"),
                  e.hasAttribute("title") || e.setAttribute("title", n || t),
                  e.id || Br(e, "respec-offender"));
              })(t, e, n.title)
            ));
      }
      toJSON() {
        const { message: e, name: t, stack: n } = this,
          { plugin: r, hint: s, elements: i, title: o, details: a } = this;
        return {
          message: e,
          name: t,
          plugin: r,
          hint: s,
          elements: i,
          title: o,
          details: a,
          stack: n,
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
    function ss(e, t, n = {}) {
      const r = { ...n, isWarning: !1 };
      fs("error", new rs(e, t, r));
    }
    function is(e, t, n = {}) {
      const r = { ...n, isWarning: !0 };
      fs("warn", new rs(e, t, r));
    }
    function os(e) {
      return {
        amendConfiguration: e => fs("amend-user-config", e),
        showError: (t, n) => ss(t, e, n),
        showWarning: (t, n) => is(t, e, n),
      };
    }
    function as(e) {
      return e ? `\`${e}\`` : "";
    }
    function cs(e, { quotes: t } = { quotes: !1 }) {
      return Pr(e, t ? e => as(us(e)) : as);
    }
    function ls(e, { quotes: t } = { quotes: !1 }) {
      return Lr(e, t ? e => as(us(e)) : as);
    }
    function us(e) {
      return String(e) ? `"${e}"` : "";
    }
    function ds(e, ...t) {
      return ps(
        e
          .map((e, n) => {
            const r = t[n];
            if (!r) return e;
            if (!r.startsWith("[") && !r.endsWith("]")) return e + r;
            const [s, i] = r.slice(1, -1).split("|");
            if (i) {
              return `${e}[${s}](${new URL(i, "https://respec.org/docs/")})`;
            }
            return `${e}[\`${s}\`](https://respec.org/docs/#${s})`;
          })
          .join("")
      );
    }
    function ps(e) {
      if (!e) return e;
      const t = e.trimEnd().split("\n");
      for (; t.length && !t[0].trim(); ) t.shift();
      const n = t.filter(e => e.trim()).map(e => e.search(/[^\s]/)),
        r = Math.min(...n);
      return t.map(e => e.slice(r)).join("\n");
    }
    const hs = new EventTarget();
    function fs(e, t) {
      if (
        (hs.dispatchEvent(new CustomEvent(e, { detail: t })),
        window.parent === window.self)
      )
        return;
      const n = String(JSON.stringify(t?.stack || t));
      window.parent.postMessage(
        { topic: e, args: n },
        window.parent.location.origin
      );
    }
    function ms(e, t, n = { once: !1 }) {
      hs.addEventListener(
        e,
        async n => {
          try {
            await t(n.detail);
          } catch (t) {
            const n = t;
            ss(`Error in handler for topic "${e}": ${n.message}`, `sub:${e}`, {
              cause: n,
            });
          }
        },
        n
      );
    }
    n("core/pubsubhub", { sub: ms });
    const gs = ["githubToken", "githubUser"];
    const bs = new Map([
      ["text/html", "html"],
      ["application/xml", "xml"],
    ]);
    function ys(e, t = document) {
      const n = bs.get(e);
      if (!n) {
        const t = [...bs.values()].join(", ");
        throw new TypeError(`Invalid format: ${e}. Expected one of: ${t}.`);
      }
      const r = ws(n, t);
      return `data:${e};charset=utf-8,${encodeURIComponent(r)}`;
    }
    function ws(e, t) {
      const n = t.cloneNode(!0);
      !(function (e) {
        const { head: t, body: n, documentElement: r } = e;
        (es(e),
          e
            .querySelectorAll(".removeOnSave, #toc-nav")
            .forEach(e => e.remove()),
          n.classList.remove("toc-sidebar"),
          Tr(r));
        const s = e.createDocumentFragment(),
          i = e.querySelector("meta[name='viewport']");
        i && t.firstChild !== i && s.appendChild(i);
        const o =
          e.querySelector("meta[charset], meta[content*='charset=']") ||
          or`<meta charset="utf-8" />`;
        s.appendChild(o);
        const a = `ReSpec ${window.respecVersion || "Developer Channel"}`,
          c = or`
    <meta name="generator" content="${a}" />
  `;
        (s.appendChild(c), t.prepend(s), fs("beforesave", r));
      })(n);
      let r = "";
      if ("xml" === e) r = new XMLSerializer().serializeToString(n);
      else
        (!(function (e) {
          (e.querySelectorAll("style").forEach(e => {
            e.innerHTML = `\n${e.innerHTML}\n`;
          }),
            e.querySelectorAll("head > *").forEach(e => {
              e.outerHTML = `\n${e.outerHTML}`;
            }));
        })(n),
          n.doctype && (r += new XMLSerializer().serializeToString(n.doctype)),
          (r += n.documentElement.outerHTML));
      return r;
    }
    n("core/exporter", { rsDocToDataURL: ys });
    class ks {
      constructor() {
        ((this._respecDonePromise = new Promise(e => {
          ms("end-all", () => e(), { once: !0 });
        })),
          (this.errors = []),
          (this.warnings = []),
          ms("error", e => {
            (console.error(e, e.toJSON()), this.errors.push(e));
          }),
          ms("warn", e => {
            (console.warn(e, e.toJSON()), this.warnings.push(e));
          }));
      }
      get version() {
        return window.respecVersion;
      }
      get ready() {
        return this._respecDonePromise;
      }
      async toHTML() {
        return ws("html", document);
      }
    }
    const vs = "core/post-process";
    const $s = "core/pre-process";
    const xs = "core/base-runner";
    async function Cs(e) {
      (!(function () {
        const e = new ks();
        Object.defineProperty(document, "respec", { value: e });
      })(),
        fs("start-all", respecConfig),
        (function (e) {
          const t = {},
            n = e => Object.assign(t, e);
          (n(e),
            ms("amend-user-config", n),
            ms("end-all", () => {
              const e = document.createElement("script");
              ((e.id = "initialUserConfig"), (e.type = "application/json"));
              for (const e of gs) e in t && delete t[e];
              ((e.innerHTML = JSON.stringify(t, null, 2)),
                document.head.appendChild(e));
            }));
        })(respecConfig),
        (function (e) {
          const t = new URLSearchParams(document.location.search),
            n = Array.from(t)
              .filter(([e, t]) => !!e && !!t)
              .map(([e, t]) => {
                const n = decodeURIComponent(e),
                  r = decodeURIComponent(t.replace(/%3D/g, "="));
                let s;
                try {
                  s = JSON.parse(r);
                } catch {
                  s = r;
                }
                return [n, s];
              }),
            r = Object.fromEntries(n);
          (Object.assign(e, r), fs("amend-user-config", r));
        })(respecConfig),
        performance.mark(`${xs}-start`),
        await (async function (e) {
          if (Array.isArray(e.preProcess)) {
            const t = e.preProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  ss("Every item in `preProcess` must be a JS function.", $s),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${$s}/${r.name || `[${n}]`}`,
                s = os(t);
              try {
                await r(e, document, s);
              } catch (e) {
                ss(`Function ${t} threw an error during \`preProcess\`.`, $s, {
                  hint: "See developer console.",
                  cause: e,
                });
              }
            }
          }
        })(respecConfig));
      const t = e.filter(e => {
        return (t = e) && (t.run || t.Plugin);
        var t;
      });
      (t.forEach(e => !e.name && console.warn("Plugin lacks name:", e)),
        await (async function (e, t) {
          for (const n of e.filter(e => e.prepare))
            try {
              await n.prepare?.(t);
            } catch (e) {
              console.error(e);
            }
        })(t, respecConfig),
        await (async function (e, t) {
          for (const n of e) {
            const e = n.name || "";
            try {
              await new Promise(async (r, s) => {
                const i = setTimeout(() => {
                  const t = `Plugin ${e} took too long.`;
                  (console.error(t, n), s(new Error(t)));
                }, 15e3);
                performance.mark(`${e}-start`);
                try {
                  n.Plugin
                    ? (await new n.Plugin(t).run(), r(void 0))
                    : n.run && (await n.run(t), r(void 0));
                } catch (e) {
                  s(e);
                } finally {
                  (clearTimeout(i),
                    performance.mark(`${e}-end`),
                    performance.measure(e, `${e}-start`, `${e}-end`));
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
        })(t, respecConfig),
        fs("plugins-done", respecConfig),
        await (async function (e) {
          if (Array.isArray(e.postProcess)) {
            const t = e.postProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  ss("Every item in `postProcess` must be a JS function.", vs),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${vs}/${r.name || `[${n}]`}`,
                s = os(t);
              try {
                await r(e, document, s);
              } catch (e) {
                ss(`Function ${t} threw an error during \`postProcess\`.`, vs, {
                  hint: "See developer console.",
                  cause: e,
                });
              }
            }
          }
          "function" == typeof e.afterEnd && (await e.afterEnd(e, document));
        })(respecConfig),
        fs("end-all", void 0),
        Tr(document),
        performance.mark(`${xs}-end`),
        performance.measure(xs, `${xs}-start`, `${xs}-end`));
    }
    var _s = String.raw`.respec-modal .close-button{position:absolute;z-index:inherit;padding:.2em;font-weight:700;cursor:pointer;margin-left:5px;border:none;background:0 0}
#respec-ui{position:fixed;display:flex;flex-direction:row-reverse;top:20px;right:20px;width:202px;text-align:right;z-index:9000}
#respec-pill,.respec-info-button{height:2.4em;background:#fff;background:var(--bg,#fff);color:#787878;color:var(--tocnav-normal-text,#787878);border:1px solid #ccc;box-shadow:1px 1px 8px 0 rgba(100,100,100,.5);box-shadow:1px 1px 8px 0 var(--tocsidebar-shadow,rgba(100,100,100,.5));padding:.2em 0}
.respec-info-button{border:none;opacity:.75;border-radius:2em;margin-right:1em;min-width:3.5em;will-change:opacity}
.respec-info-button:focus,.respec-info-button:hover{opacity:1;transition:opacity .2s}
#respec-pill{width:4.8em}
#respec-pill:not(:disabled){animation:respec-fadein .6s ease-in-out}
@keyframes respec-fadein{
from{margin-top:-1.2em;border-radius:50%;border:.2em solid rgba(100,100,100,.5);box-shadow:none;height:4.8em}
to{margin-top:0;border:1px solid #ccc;border-radius:0;box-shadow:1px 1px 8px 0 rgba(100,100,100,.5);height:2.4em}
}
#respec-pill:disabled{margin-top:-1.2em;position:relative;border:none;box-shadow:none;border-radius:50%;width:4.8em;height:4.8em;padding:0}
#respec-pill:disabled::after{position:absolute;content:'';inset:-.2em;border-radius:50%;border:.2em solid rgba(100,100,100,.5);border-left:.2em solid transparent;animation:respec-spin .5s infinite linear}
@media (prefers-reduced-motion){
#respec-pill:not(:disabled){animation:none}
#respec-pill:disabled::after{animation:none;border-left:.2em solid rgba(100,100,100,.5)}
}
@keyframes respec-spin{
0%{transform:rotate(0)}
100%{transform:rotate(360deg)}
}
.respec-hidden{visibility:hidden;opacity:0;transition:visibility 0s .2s,opacity .2s linear}
.respec-visible{visibility:visible;opacity:1;transition:opacity .2s linear}
#respec-pill:focus,#respec-pill:hover{color:#000;background-color:#f5f5f5;transition:color .2s}
#respec-menu{position:absolute;margin:0;padding:0;font-family:sans-serif;background:var(--bg,#fff);color:var(--text,#000);box-shadow:1px 1px 8px 0 rgba(100,100,100,.5);width:200px;display:none;text-align:left;margin-top:32px;font-size:.8em}
#respec-menu:not([hidden]){display:block}
#respec-menu li{list-style-type:none;margin:0;padding:0}
.respec-save-buttons{display:grid;grid-template-columns:repeat(auto-fill,minmax(47%,2fr));grid-gap:.5cm;padding:.5cm}
.respec-save-button:link{padding-top:16px;color:var(--def-text,#fff);background:var(--def-bg,#2a5aa8);justify-self:stretch;height:1cm;text-decoration:none;text-align:center;font-size:inherit;border:none;border-radius:.2cm}
.respec-save-button:link:hover{color:var(--def-text,#fff);background:var(--defrow-border,#2a5aa8);padding:0;margin:0;border:0;padding-top:16px}
.respec-save-button:link:focus{background:var(--tocnav-active-bg,#193766);color:var(--tocnav-active-text,#000)}
#respec-pill:focus,#respec-ui button:focus,.respec-option:focus{outline:0;outline-style:none}
#respec-pill-error{background-color:red;color:#fff}
#respec-pill-warning{background-color:orange;color:#fff}
.respec-error-list,.respec-warning-list{margin:0;padding:0;font-family:sans-serif;font-size:.85em}
.respec-warning-list{background-color:#fffbe6}
:is(.respec-warning-list,.respec-error-list)>li{list-style-type:none;margin:0;padding:.5em 0;padding-left:2em;padding-right:.5em}
:is(.respec-warning-list,.respec-error-list)>li+li{margin-top:.5rem}
:is(.respec-warning-list,.respec-error-list)>li:before{position:absolute;left:.4em}
:is(.respec-warning-list,.respec-error-list) p{padding:0;margin:0}
.respec-warning-list>li{color:#5c3b00;border-bottom:thin solid #fff5c2}
.respec-error-list,.respec-error-list li{background-color:#fff0f0}
.respec-warning-list>li::before{content:"⚠️"}
.respec-error-list>li::before{content:"💥"}
.respec-error-list>li{color:#5c3b00;border-bottom:thin solid #ffd7d7}
:is(.respec-warning-list,.respec-error-list)>li li{list-style:disc}
#respec-overlay{display:block;position:fixed;z-index:10000;top:0;left:0;height:100%;width:100%;background:#000}
.respec-show-overlay{transition:opacity .2s linear;opacity:.5}
.respec-hide-overlay{transition:opacity .2s linear;opacity:0}
.respec-modal{display:block;position:fixed;z-index:11000;top:10%;background:var(--bg,#fff);color:var(--text,#000);border:5px solid #666;border-color:var(--tocsidebar-shadow,#666);min-width:20%;padding:0;max-height:80%;overflow-y:auto;margin:0 -.5cm;left:20%;max-width:75%;min-width:60%}
.respec-modal h3{margin:0;padding:.2em;left:0!important;text-align:center;background:var(--tocsidebar-shadow,#ddd);color:var(--text,#000);font-size:1em}
#respec-menu button.respec-option{background:var(--bg,#fff);color:var(--text,#000);border:none;width:100%;text-align:left;font-size:inherit;padding:1.2em 1.2em}
#respec-menu button.respec-option:hover{background-color:var(--tocnav-hover-bg,#eee);color:var(--tocnav-hover-text,#000)}
.respec-cmd-icon{padding-right:.5em}
#respec-ui button.respec-option:first-child{margin-top:0}
#respec-ui button.respec-option:last-child{border:none;border-radius:inherit;margin-bottom:0}
.respec-button-copy-paste{position:absolute;height:28px;width:40px;cursor:pointer;background-image:linear-gradient(#fcfcfc,#eee);border:1px solid #90b8de;border-left:0;border-radius:0 0 3px 0;-webkit-user-select:none;user-select:none;-webkit-appearance:none;top:0;left:127px}
@media print{
#respec-ui{display:none}
}
.respec-iframe{width:100%;min-height:550px;height:100%;overflow:hidden;padding:0;margin:0;border:0}
.respec-iframe:not(.ready){background:url(https://respec.org/xref/loader.gif) no-repeat center}
.respec-iframe+a[href]{font-size:.9rem;float:right;margin:0 .5em .5em;border-bottom-width:1px}
p:is(.respec-hint,.respec-occurrences){display:block;margin-top:.5em}
.respec-plugin{text-align:right;color:rgb(120,120,120,.5);font-size:.6em}`;
    const Ss = /&gt;/gm,
      Ts = /&amp;/gm;
    class Es extends cr.Renderer {
      code(e) {
        const { text: t, lang: n = "" } = e,
          { language: r, ...s } = Es.parseInfoString(n);
        if (/(^webidl$)/i.test(r)) return `<pre class="idl">${t}</pre>`;
        const i = super
            .code({ ...e, lang: r })
            .replace('class="language-', 'class="'),
          { example: o, illegalExample: a } = s;
        if (!o && !a) return i;
        const c = o || a,
          l = `${r} ${o ? "example" : "illegal-example"}`;
        return i.replace("<pre>", `<pre title="${c}" class="${l}">`);
      }
      image(e) {
        const { href: t, title: n, text: r } = e;
        if (!n) return super.image(e);
        return String.raw`
      <figure>
        <img src="${t}" alt="${r}" />
        <figcaption>${n}</figcaption>
      </figure>
    `;
      }
      static parseInfoString(e) {
        const t = e.search(/\s/);
        if (-1 === t) return { language: e };
        const n = e.slice(0, t),
          r = e.slice(t + 1);
        let s;
        if (r)
          try {
            s = JSON.parse(`{ ${r} }`);
          } catch (e) {
            console.error(e);
          }
        return { language: n, ...s };
      }
      heading(e) {
        const t = this.parser.parseInline(e.tokens),
          n = e.depth,
          r = t.match(/(.+)\s+{#([\w-]+)}$/);
        if (r) {
          const [, e, t] = r;
          return `<h${n} id="${t}">${e}</h${n}>`;
        }
        return super.heading(e);
      }
    }
    const Rs = { gfm: !0, renderer: new Es() };
    function As(e, t = { inline: !1 }) {
      const n = (function (e) {
          if (!e) return e;
          const t = e.trimEnd().split("\n"),
            n = t.findIndex(e => e.trim());
          if (-1 === n) return "";
          const r = t.slice(n),
            s = r[0].search(/[^\s]/);
          if (s < 1) return r.join("\n");
          const i = " ".repeat(s);
          return r.map(e => (e.startsWith(i) ? e.slice(s) : e)).join("\n");
        })(e),
        r = n.replace(Ss, ">").replace(Ts, "&");
      return t.inline ? cr.parseInline(r, Rs) : cr.parse(r, Rs);
    }
    function Ls(e) {
      for (const t of e.getElementsByTagName("pre")) t.prepend("\n");
      e.innerHTML = As(e.innerHTML);
    }
    const Ps =
      ((Ns = "[data-format='markdown']:not(body)"),
      e => {
        const t = e.querySelectorAll(Ns);
        return (t.forEach(Ls), Array.from(t));
      });
    var Ns;
    var Is = Object.freeze({
      __proto__: null,
      markdownToHtml: As,
      name: "core/markdown",
      run: function (e) {
        const t = !!document.querySelector("[data-format=markdown]:not(body)"),
          n = "markdown" === e.format;
        if (!n && !t) return;
        if (!n) return void Ps(document.body);
        const r = document.getElementById("respec-ui");
        r?.remove();
        const s = document.body.cloneNode(!0);
        (!(function (e, t) {
          const n = e.querySelectorAll(t);
          for (const e of n) {
            const { innerHTML: t } = e;
            if (/^<\w/.test(t.trimStart())) continue;
            const n = t.split("\n"),
              r = n.slice(0, 2).join("\n"),
              s = n.slice(-2).join("\n");
            if ((r.trim() && e.prepend("\n\n"), s.trim())) {
              const t = Zr(e);
              e.append(`\n\n${t}`);
            }
          }
        })(
          s,
          "[data-format=markdown], section, div, address, article, aside, figure, header, main"
        ),
          Ls(s),
          (function (e) {
            Array.from(e).forEach(e => {
              e.replaceWith(e.textContent);
            });
          })(s.querySelectorAll(".nolinks a[href]")),
          r && s.append(r),
          document.body.replaceWith(s));
      },
    });
    function Ds(e, t) {
      e &&
        Array.from(t).forEach(([t, n]) => {
          e.setAttribute(`aria-${t}`, n);
        });
    }
    !(function () {
      const e = document.createElement("style");
      ((e.id = "respec-ui-styles"),
        (e.textContent = _s),
        e.classList.add("removeOnSave"),
        document.head.appendChild(e));
    })();
    const Os = or`<div id="respec-ui" class="removeOnSave" hidden></div>`,
      js = or`<ul
  id="respec-menu"
  role="menu"
  aria-labelledby="respec-pill"
  hidden
></ul>`,
      zs = or`<button
  class="close-button"
  onclick=${() => Ks.closeModal()}
  title="Close"
>
  ❌
</button>`;
    let Ms, qs;
    window.addEventListener("load", () => Gs(js));
    const Us = [],
      Ws = [],
      Fs = {};
    (ms("start-all", () => document.body.prepend(Os), { once: !0 }),
      ms("end-all", () => document.body.prepend(Os), { once: !0 }));
    const Bs = or`<button id="respec-pill" disabled>ReSpec</button>`;
    function Hs() {
      (js.classList.toggle("respec-hidden"),
        js.classList.toggle("respec-visible"),
        (js.hidden = !js.hidden));
    }
    function Gs(e) {
      const t = e.querySelectorAll(
          "a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])"
        ),
        n = t[0],
        r = t[t.length - 1];
      (n && n.focus(),
        e.addEventListener("keydown", e => {
          const t = e;
          "Tab" === t.key &&
            (t.shiftKey
              ? document.activeElement === n && (r.focus(), t.preventDefault())
              : document.activeElement === r &&
                (n.focus(), t.preventDefault()));
        }));
    }
    (Os.appendChild(Bs),
      Bs.addEventListener("click", e => {
        (e.stopPropagation(),
          Bs.setAttribute("aria-expanded", String(js.hidden)),
          Hs(),
          js.querySelector("li:first-child button").focus());
      }),
      document.documentElement.addEventListener("click", () => {
        js.hidden || Hs();
      }),
      Os.appendChild(js),
      js.addEventListener("keydown", e => {
        "Escape" !== e.key ||
          js.hidden ||
          (Bs.setAttribute("aria-expanded", String(js.hidden)),
          Hs(),
          Bs.focus());
      }));
    const Vs = new Map([
      ["controls", "respec-menu"],
      ["expanded", "false"],
      ["haspopup", "true"],
      ["label", "ReSpec Menu"],
    ]);
    function Js(e, t, n, r) {
      (t.push(e),
        Fs.hasOwnProperty(n) ||
          ((Fs[n] = (function (e, t, n) {
            const r = `respec-pill-${e}`,
              s = or`<button
    id="${r}"
    class="respec-info-button"
  ></button>`;
            s.addEventListener("click", () => {
              s.setAttribute("aria-expanded", "true");
              const r = or`<ol class="${`respec-${e}-list`}"></ol>`;
              for (const e of t) {
                const t = document
                    .createRange()
                    .createContextualFragment(Ys(e)),
                  n = document.createElement("li");
                (t.firstElementChild === t.lastElementChild
                  ? n.append(...t.firstElementChild.childNodes)
                  : n.appendChild(t),
                  r.appendChild(n));
              }
              Ks.freshModal(n, r, s);
            });
            const i = new Map([
              ["expanded", "false"],
              ["haspopup", "true"],
              ["controls", `respec-pill-${e}-modal`],
            ]);
            return (Ds(s, i), s);
          })(n, t, r)),
          Os.appendChild(Fs[n])));
      const s = Fs[n];
      s.textContent = String(t.length);
      const i = 1 === t.length ? ur.singular(r) : r;
      Ds(s, new Map([["label", `${t.length} ${i}`]]));
    }
    Ds(Bs, Vs);
    const Ks = {
      show() {
        try {
          Os.hidden = !1;
        } catch (e) {
          console.error(e);
        }
      },
      hide() {
        Os.hidden = !0;
      },
      enable() {
        Bs.removeAttribute("disabled");
      },
      addCommand(e, t, n, r) {
        r = r || "";
        const s = `respec-button-${e.toLowerCase().replace(/\s+/, "-")}`,
          i = or`<button id="${s}" class="respec-option">
      <span class="respec-cmd-icon" aria-hidden="true">${r}</span> ${e}…
    </button>`,
          o = or`<li role="menuitem">${i}</li>`;
        return (o.addEventListener("click", t), js.appendChild(o), i);
      },
      error(e) {
        Js(e, Us, "error", "ReSpec Errors");
      },
      warning(e) {
        Js(e, Ws, "warning", "ReSpec Warnings");
      },
      closeModal(e) {
        if (qs) {
          const e = qs;
          (e.classList.remove("respec-show-overlay"),
            e.classList.add("respec-hide-overlay"),
            e.addEventListener("transitionend", () => {
              (e.remove(), (qs = null));
            }));
        }
        (e && e.setAttribute("aria-expanded", "false"),
          Ms && (Ms.remove(), (Ms = null), Bs.focus()));
      },
      freshModal(e, t, n) {
        (Ms && Ms.remove(),
          qs && qs.remove(),
          (qs = or`<div id="respec-overlay" class="removeOnSave"></div>`));
        const r = `${n.id}-modal`,
          s = `${r}-heading`;
        Ms = or`<div
      id="${r}"
      class="respec-modal removeOnSave"
      role="dialog"
      aria-labelledby="${s}"
    >
      ${zs}
      <h3 id="${s}">${e}</h3>
      <div class="inside">${t}</div>
    </div>`;
        const i = new Map([["labelledby", s]]);
        (Ds(Ms, i),
          document.body.append(qs, Ms),
          qs.addEventListener("click", () => this.closeModal(n)),
          qs.classList.toggle("respec-show-overlay"),
          (Ms.hidden = !1),
          Gs(Ms));
      },
    };
    function Ys(e) {
      if ("string" == typeof e) return e;
      const t = e.plugin
          ? `<p class="respec-plugin">(plugin: "${e.plugin}")</p>`
          : "",
        n = e.hint
          ? `\n${As(`<p class="respec-hint"><strong>How to fix:</strong> ${ps(e.hint)}`, { inline: !e.hint.includes("\n") })}\n`
          : "",
        r = Array.isArray(e.elements)
          ? `<p class="respec-occurrences">Occurred <strong>${e.elements.length}</strong> times at:</p>\n    ${As(e.elements.map(Zs).join("\n"))}`
          : "",
        s = e.details ? `\n\n<details>\n${e.details}\n</details>\n` : "";
      return `${As(`**${Nr(e.message)}**`, { inline: !0 })}${n}${r}${s}${t}`;
    }
    function Zs(e) {
      return `* [\`<${e.localName}>\`](#${e.id}) element`;
    }
    async function Xs(e) {
      try {
        (Ks.show(),
          await (async function () {
            "loading" === document.readyState &&
              (await new Promise(e =>
                document.addEventListener("DOMContentLoaded", e)
              ));
          })(),
          await Cs(e));
      } finally {
        Ks.enable();
      }
    }
    (document.addEventListener("keydown", e => {
      "Escape" === e.key && Ks.closeModal();
    }),
      (window.respecUI = Ks),
      ms("error", e => Ks.error(e)),
      ms("warn", e => Ks.warning(e)),
      window.addEventListener("error", e => {
        console.error(e.error, e.message, e);
      }));
    const Qs = [
      Promise.resolve().then(function () {
        return ei;
      }),
      Promise.resolve().then(function () {
        return o;
      }),
      Promise.resolve().then(function () {
        return si;
      }),
      Promise.resolve().then(function () {
        return Zi;
      }),
      Promise.resolve().then(function () {
        return eo;
      }),
      Promise.resolve().then(function () {
        return io;
      }),
      Promise.resolve().then(function () {
        return po;
      }),
      Promise.resolve().then(function () {
        return ko;
      }),
      Promise.resolve().then(function () {
        return Is;
      }),
      Promise.resolve().then(function () {
        return vo;
      }),
      Promise.resolve().then(function () {
        return Co;
      }),
      Promise.resolve().then(function () {
        return To;
      }),
      Promise.resolve().then(function () {
        return Hi;
      }),
      Promise.resolve().then(function () {
        return Ao;
      }),
      Promise.resolve().then(function () {
        return Lo;
      }),
      Promise.resolve().then(function () {
        return Io;
      }),
      Promise.resolve().then(function () {
        return Oo;
      }),
      Promise.resolve().then(function () {
        return Ja;
      }),
      Promise.resolve().then(function () {
        return Za;
      }),
      Promise.resolve().then(function () {
        return ac;
      }),
      Promise.resolve().then(function () {
        return cc;
      }),
      Promise.resolve().then(function () {
        return pc;
      }),
      Promise.resolve().then(function () {
        return bc;
      }),
      Promise.resolve().then(function () {
        return $c;
      }),
      Promise.resolve().then(function () {
        return _c;
      }),
      Promise.resolve().then(function () {
        return Tc;
      }),
      Promise.resolve().then(function () {
        return Zc;
      }),
      Promise.resolve().then(function () {
        return sl;
      }),
      Promise.resolve().then(function () {
        return pa;
      }),
      Promise.resolve().then(function () {
        return Cl;
      }),
      Promise.resolve().then(function () {
        return Ml;
      }),
      Promise.resolve().then(function () {
        return fl;
      }),
      Promise.resolve().then(function () {
        return Ca;
      }),
      Promise.resolve().then(function () {
        return Xl;
      }),
      Promise.resolve().then(function () {
        return eu;
      }),
      Promise.resolve().then(function () {
        return go;
      }),
      Promise.resolve().then(function () {
        return tu;
      }),
      Promise.resolve().then(function () {
        return nu;
      }),
      Promise.resolve().then(function () {
        return su;
      }),
      Promise.resolve().then(function () {
        return pu;
      }),
      Promise.resolve().then(function () {
        return fu;
      }),
      Promise.resolve().then(function () {
        return gu;
      }),
      Promise.resolve().then(function () {
        return $u;
      }),
      Promise.resolve().then(function () {
        return Lu;
      }),
      Promise.resolve().then(function () {
        return Du;
      }),
      Promise.resolve().then(function () {
        return Mu;
      }),
      Promise.resolve().then(function () {
        return Fu;
      }),
      Promise.resolve().then(function () {
        return Ku;
      }),
      Promise.resolve().then(function () {
        return Yu;
      }),
      Promise.resolve().then(function () {
        return nd;
      }),
      Promise.resolve().then(function () {
        return hd;
      }),
      Promise.resolve().then(function () {
        return zc;
      }),
      Promise.resolve().then(function () {
        return kd;
      }),
      Promise.resolve().then(function () {
        return _d;
      }),
      Promise.resolve().then(function () {
        return Td;
      }),
      Promise.resolve().then(function () {
        return Rd;
      }),
      Promise.resolve().then(function () {
        return jd;
      }),
      Promise.resolve().then(function () {
        return qd;
      }),
      Promise.resolve().then(function () {
        return Hd;
      }),
      Promise.resolve().then(function () {
        return Gd;
      }),
      Promise.resolve().then(function () {
        return Vd;
      }),
      Promise.resolve().then(function () {
        return Kd;
      }),
      Promise.resolve().then(function () {
        return Xd;
      }),
      Promise.resolve().then(function () {
        return rp;
      }),
      Promise.resolve().then(function () {
        return op;
      }),
      Promise.resolve().then(function () {
        return up;
      }),
      Promise.resolve().then(function () {
        return hp;
      }),
      Promise.resolve().then(function () {
        return yp;
      }),
      Promise.resolve().then(function () {
        return vp;
      }),
      Promise.resolve().then(function () {
        return Cp;
      }),
      Promise.resolve().then(function () {
        return Rp;
      }),
      Promise.resolve().then(function () {
        return Dp;
      }),
      Promise.resolve().then(function () {
        return zp;
      }),
      Promise.resolve().then(function () {
        return Up;
      }),
      Promise.resolve().then(function () {
        return Hp;
      }),
      Promise.resolve().then(function () {
        return Kp;
      }),
    ];
    Promise.all(Qs)
      .then(e => Xs(e))
      .catch(e => console.error(e));
    var ei = Object.freeze({
      __proto__: null,
      name: "core/location-hash",
      run: function () {
        window.location.hash &&
          document.respec.ready.then(() => {
            let e = decodeURIComponent(window.location.hash).slice(1);
            const t = document.getElementById(e),
              n = /\W/.test(e);
            if (!t && n) {
              const t = e
                .replace(/[\W]+/gim, "-")
                .replace(/^-+/, "")
                .replace(/-+$/, "");
              document.getElementById(t) && (e = t);
            }
            window.location.hash = `#${e}`;
          });
      },
    });
    const ti = "w3c/group",
      ni = "https://respec.org/w3c/groups/";
    async function ri(e) {
      let t = "",
        n = e;
      e.includes("/") && ([t, n] = e.split("/", 2));
      const r = new URL(`${n}/${t}`, ni),
        s = await Mr(r.href);
      if (s.ok) {
        const e = await s.json(),
          {
            id: t,
            name: n,
            patentURI: r,
            patentPolicy: i,
            type: o,
            wgURI: a,
          } = e;
        return {
          wg: n,
          wgId: t,
          wgURI: a,
          wgPatentURI: r,
          wgPatentPolicy: i,
          groupType: o,
        };
      }
      const i = await s.text();
      let o,
        a = `Failed to fetch group details (HTTP: ${s.status}).`;
      (409 === s.status
        ? ([a, o] = i.split("\n", 2))
        : 404 === s.status &&
          (o = ds`See the list of [supported group names](https://respec.org/w3c/groups/) to use with the ${"[group]"} configuration option.`),
        ss(a, ti, { hint: o }));
    }
    var si = Object.freeze({
      __proto__: null,
      name: ti,
      run: async function (e) {
        if (!e.group) return;
        const { group: t } = e,
          n = Array.isArray(t)
            ? await (async function (e) {
                const t = await Promise.all(e.map(ri)),
                  n = {
                    wg: [],
                    wgId: [],
                    wgURI: [],
                    wgPatentURI: [],
                    wgPatentPolicy: [],
                    groupType: [],
                  };
                for (const e of t.filter(Boolean))
                  for (const t of Object.keys(n)) n[t].push(e[t]);
                return n;
              })(t)
            : await ri(t);
        Object.assign(e, n);
      },
    });
    function ii(e) {
      if (!e.key) {
        const t =
          "Found a link without `key` attribute in the configuration. See dev console.";
        return (is(t, "core/templates/show-link"), void console.warn(t, e));
      }
      return or`
    <dt class="${e.class ? e.class : null}">${e.key}</dt>
    ${e.data ? e.data.map(oi) : oi(e)}
  `;
    }
    function oi(e) {
      return or`<dd class="${e.class ? e.class : null}">
    ${e.href ? or`<a href="${e.href}">${e.value || e.href}</a>` : e.value}
  </dd>`;
    }
    const ai = "core/templates/show-logo";
    function ci(e, t) {
      const n = or`<a href="${e.url || null}" class="logo"
    ><img
      alt="${e.alt || null}"
      crossorigin
      height="${e.height || null}"
      id="${e.id || null}"
      src="${e.src || null}"
      width="${e.width || null}"
    />
  </a>`;
      if (!e.alt) {
        const r = ds`Add the missing "\`alt\`" property describing the logo. See ${"[logos]"} for more information.`;
        ss(
          `Logo at index ${t}${e.src ? `, with \`src\` ${e.src}, ` : ""} is missing required "\`alt\`" property.`,
          ai,
          { hint: r, elements: [n] }
        );
      }
      if (!e.src) {
        const e = ds`The \`src\` property is required on every logo. See ${"[logos]"} for more information.`;
        ss(`Logo at index ${t} is missing "\`src\`" property.`, ai, {
          hint: e,
          elements: [n],
        });
      }
      return n;
    }
    const li = "core/templates/show-people",
      ui = Dr({
        en: { until: e => or` Until ${e} ` },
        es: { until: e => or` Hasta ${e} ` },
        ko: { until: e => or` ${e} 이전 ` },
        ja: { until: e => or` ${e} 以前 ` },
        de: { until: e => or` bis ${e} ` },
        zh: { until: e => or` 直到 ${e} ` },
      }),
      di = () => or`<svg
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
    function pi(e, t) {
      const n = e[t];
      if (!Array.isArray(n) || !n.length) return;
      const r =
        ((s = t),
        function (e, t) {
          const n = "https://respec.org/docs/",
            r = `See [person](${n}#person) configuration for available options.`,
            i = `Error processing the [person object](${n}#person) at index ${t} of the "[\`${s}\`](${n}#${s})" configuration option.`;
          if (!e.name)
            return (
              ss(`${i} Missing required property \`"name"\`.`, li, { hint: r }),
              !1
            );
          if (e.orcid) {
            const { orcid: n } = e,
              r = new URL(n, "https://orcid.org/");
            if ("https://orcid.org" !== r.origin) {
              const n = `${i} ORCID "${e.orcid}" at index ${t} is invalid.`,
                s = `The origin should be "https://orcid.org", not "${r.origin}".`;
              return (ss(n, li, { hint: s }), !1);
            }
            const s = r.pathname.slice(1).replace(/\/$/, "");
            if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(s))
              return (
                ss(`${i} ORCID "${s}" has wrong format.`, li, {
                  hint: 'ORCIDs have the format "1234-1234-1234-1234."',
                }),
                !1
              );
            if (
              !(function (e) {
                const t = e[e.length - 1],
                  n = e
                    .split("")
                    .slice(0, -1)
                    .filter(e => /\d/.test(e))
                    .map(Number)
                    .reduce((e, t) => 2 * (e + t), 0),
                  r = (12 - (n % 11)) % 11,
                  s = 10 === r ? "X" : String(r);
                return t === s;
              })(n)
            )
              return (
                ss(`${i} ORCID "${n}" failed checksum check.`, li, {
                  hint: "Please check that the ORCID is valid.",
                }),
                !1
              );
            e.orcid = r.href;
          }
          return e.retiredDate &&
            ((o = e.retiredDate),
            "Invalid Date" ===
              (/\d{4}-\d{2}-\d{2}/.test(o)
                ? new Date(o)
                : "Invalid Date"
              ).toString())
            ? (ss(
                `${i} The property "\`retiredDate\`" is not a valid date.`,
                li,
                { hint: `The expected format is YYYY-MM-DD. ${r}` }
              ),
              !1)
            : !(
                e.hasOwnProperty("extras") &&
                !(function (e, t, n) {
                  return Array.isArray(e)
                    ? e.every((e, r) => {
                        switch (!0) {
                          case "object" != typeof e:
                            return (
                              ss(
                                `${n}. Member "extra" at index ${r} is not an object.`,
                                li,
                                { hint: t }
                              ),
                              !1
                            );
                          case !e.hasOwnProperty("name"):
                            return (
                              ss(
                                `${n} \`PersonExtra\` object at index ${r} is missing required "name" member.`,
                                li,
                                { hint: t }
                              ),
                              !1
                            );
                          case "string" == typeof e.name &&
                            "" === e.name.trim():
                            return (
                              ss(
                                `${n} \`PersonExtra\` object at index ${r} "name" can't be empty.`,
                                li,
                                { hint: t }
                              ),
                              !1
                            );
                        }
                        return !0;
                      })
                    : (ss(
                        `${n}. A person's "extras" member must be an array.`,
                        li,
                        { hint: t }
                      ),
                      !1);
                })(e.extras ?? [], r, i)
              ) &&
                (e.url &&
                  e.mailto &&
                  is(`${i} Has both "url" and "mailto" property.`, li, {
                    hint: `Please choose either "url" or "mailto" ("url" is preferred). ${r}`,
                  }),
                e.companyURL &&
                  !e.company &&
                  is(
                    `${i} Has a "\`companyURL\`" property but no "\`company\`" property.`,
                    li,
                    { hint: `Please add a "\`company\`" property. ${r}.` }
                  ),
                !0);
          var o;
        });
      var s;
      return n.filter(r).map(hi);
    }
    function hi(e) {
      const t = [e.name],
        n = [e.company],
        r = e.w3cid || null,
        s = [];
      if ((e.mailto && (e.url = `mailto:${e.mailto}`), e.url)) {
        const n =
          "mailto:" === new URL(e.url, document.location.href).protocol
            ? "ed_mailto u-email email p-name"
            : "u-url url p-name fn";
        s.push(or`<a class="${n}" href="${e.url}">${t}</a>`);
      } else s.push(or`<span class="p-name fn">${t}</span>`);
      if (
        (e.orcid &&
          s.push(or`<a class="p-name orcid" href="${e.orcid}">${di()}</a>`),
        e.company)
      ) {
        const t = "p-org org h-org",
          r = e.companyURL
            ? or`<a class="${t}" href="${e.companyURL}">${n}</a>`
            : or`<span class="${t}">${n}</span>`;
        s.push(or` (${r})`);
      }
      (e.note && s.push(document.createTextNode(` (${e.note})`)),
        e.extras &&
          s.push(
            ...e.extras.map(
              e =>
                or`, ${(function (e) {
                  const t = e.class || null,
                    { name: n, href: r } = e;
                  return r
                    ? or`<a href="${r}" class="${t}">${n}</a>`
                    : or`<span class="${t}">${n}</span>`;
                })(e)}`
            )
          ));
      const { retiredDate: i } = e;
      if (e.retiredDate) {
        const e = or`<time datetime="${i}"
      >${Cr.format(new Date(i ?? ""))}</time
    >`;
        s.push(or` - ${ui.until(e)} `);
      }
      return or`<dd
    class="editor p-author h-card vcard"
    data-editor-id="${r}"
  >
    ${s}
  </dd>`;
    }
    const fi = Dr({
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
        multiple_alternates: e =>
          `This document is also available in ${e ? "these non-normative formats" : "this non-normative format"}:`,
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
        multiple_alternates: e =>
          `Dieses Dokument ist ebenfalls in ${e ? "diesen nicht-normativen Formaten verfügbar" : "diesem nicht-normativen Format verfügbar"}:`,
        prev_editor_draft: "Vorheriger Entwurf:",
        prev_recommendation: "Vorherige Empfehlung:",
        prev_version: "Vorherige Version:",
        publication_history: "Veröffentlichungsverlauf",
        test_suite: "Testumgebung:",
        this_version: "Diese Fassung:",
      },
      cs: {
        archives: "archivy",
        author: "Autor:",
        authors: "Autoři:",
        commit_history: "Historie změn",
        edited_in_place: "upraveno přímo",
        editor: "Editor:",
        editors: "Editoři:",
        feedback: "Zpětná vazba:",
        former_editor: "Bývalý editor:",
        former_editors: "Bývalí editoři:",
        history: "Historie:",
        implementation_report: "Implementační zpráva:",
        latest_editors_draft: "Nejnovější pracovní verze:",
        latest_published_version: "Nejnovější publikovaná verze:",
        latest_recommendation: "Nejnovější doporučení:",
        message_topic: "… předmět zprávy …",
        more_details_about_this_doc: "Více informací o tomto dokumentu",
        multiple_alternates: e =>
          `Tento dokument je také dostupný v ${e ? "těchto ne-normativních formátech" : "tomto ne-normativním formátu"}:`,
        prev_editor_draft: "Předchozí pracovní verze:",
        prev_recommendation: "Předchozí doporučení:",
        prev_version: "Předchozí verze:",
        publication_history: "Historie publikací",
        test_suite: "Testovací sada:",
        this_version: "Tato verze:",
        with_subject_line: "s předmětem",
        your_topic_here: "VÁŠ PŘEDMĚT ZDE",
      },
    });
    function mi(e) {
      let t = document.querySelector("h2#subtitle");
      return (
        t && t.parentElement
          ? (t.remove(), (e.subtitle = t.textContent.trim()))
          : e.subtitle &&
            ((t = document.createElement("h2")),
            (t.textContent = e.subtitle),
            (t.id = "subtitle")),
        t && t.classList.add("subtitle"),
        t
      );
    }
    var gi = (e, t) => (
      ms("beforesave", e => {
        const t = e.querySelector(".head details");
        t && (t.open = !0);
      }),
      or`<div class="head">
    ${(e.logos ?? []).length ? or`<p class="logos">${(e.logos ?? []).map(ci)}</p>` : ""}
    ${document.querySelector("h1#title")} ${mi(e)}
    <p id="w3c-state">${(function (e) {
      const t = e.isCR || e.isCRY ? e.longStatus : e.textStatus,
        n = e.prependW3C
          ? or`<a href="https://www.w3.org/standards/types#${e.specStatus}"
        >W3C ${t}</a
      >`
          : or`${t}`;
      return or`${n}${" "}
    <time class="dt-published" datetime="${e.dashDate}"
      >${Cr.format(e.publishDate)}</time
    >${
      e.modificationDate
        ? or`, ${fi.edited_in_place}${" "}
          <time
            class="dt-modified"
            datetime="${$r.format(e.modificationDate)}"
            >${Cr.format(e.modificationDate)}</time
          >`
        : ""
    }`;
    })(e)}</p>
    <details open="${localStorage.getItem("tr-metadata") || "true"}">
      <summary>${fi.more_details_about_this_doc}</summary>
      <dl>
        ${
          e.thisVersion
            ? or`<dt>${fi.this_version}</dt>
              <dd>
                <a class="u-url" href="${e.thisVersion}"
                  >${e.thisVersion}</a
                >
              </dd>`
            : ""
        }
        ${
          "latestVersion" in e
            ? or`<dt>${fi.latest_published_version}</dt>
              <dd>
                ${
                  e.latestVersion
                    ? or`<a href="${e.latestVersion}"
                      >${e.latestVersion}</a
                    >`
                    : "none"
                }
              </dd>`
            : ""
        }
        ${
          e.edDraftURI
            ? or`
              <dt>${fi.latest_editors_draft}</dt>
              <dd><a href="${e.edDraftURI}">${e.edDraftURI}</a></dd>
            `
            : ""
        }
        ${
          e.historyURI || e.github
            ? or`<dt>${fi.history}</dt>
              ${
                e.historyURI
                  ? or`<dd>
                    <a href="${e.historyURI}">${e.historyURI}</a>
                  </dd>`
                  : ""
              }
              ${
                e.github
                  ? or`<dd>
                    <a
                      href="${e.github.commitHistoryURL}"
                      >${fi.commit_history}</a
                    >
                  </dd>`
                  : ""
              }`
            : ""
        }
        ${
          e.testSuiteURI
            ? or`
              <dt>${fi.test_suite}</dt>
              <dd><a href="${e.testSuiteURI}">${e.testSuiteURI}</a></dd>
            `
            : ""
        }
        ${
          e.implementationReportURI
            ? or`
              <dt>${fi.implementation_report}</dt>
              <dd>
                <a href="${e.implementationReportURI}"
                  >${e.implementationReportURI}</a
                >
              </dd>
            `
            : ""
        }
        ${
          e.prevED
            ? or`
              <dt>${fi.prev_editor_draft}</dt>
              <dd><a href="${e.prevED}">${e.prevED}</a></dd>
            `
            : ""
        }
        ${
          e.showPreviousVersion
            ? or`
              <dt>${fi.prev_version}</dt>
              <dd><a href="${e.prevVersion}">${e.prevVersion}</a></dd>
            `
            : ""
        }
        ${
          e.prevRecURI
            ? e.isRec
              ? or`
                <dt>${fi.prev_recommendation}</dt>
                <dd><a href="${e.prevRecURI}">${e.prevRecURI}</a></dd>
              `
              : or`
                <dt>${fi.latest_recommendation}</dt>
                <dd><a href="${e.prevRecURI}">${e.prevRecURI}</a></dd>
              `
            : ""
        }
        ${
          (e.editors ?? []).length
            ? or`
              <dt>
                ${(e.editors ?? []).length > 1 ? fi.editors : fi.editor}
              </dt>
              ${pi(e, "editors")}
            `
            : ""
        }
        ${
          (e.formerEditors ?? []).length
            ? or`
              <dt>
                ${(e.formerEditors ?? []).length > 1 ? fi.former_editors : fi.former_editor}
              </dt>
              ${pi(e, "formerEditors")}
            `
            : ""
        }
        ${
          (e.authors ?? []).length
            ? or`
              <dt>
                ${(e.authors ?? []).length > 1 ? fi.authors : fi.author}
              </dt>
              ${pi(e, "authors")}
            `
            : ""
        }
        ${
          e.github || e.wgPublicList
            ? or`<dt>${fi.feedback}</dt>
              ${bi(e)}`
            : ""
        }
        ${
          e.errata
            ? or`<dt>Errata:</dt>
              <dd><a href="${e.errata}">Errata exists</a>.</dd>`
            : ""
        }
        ${e.otherLinks ? e.otherLinks.map(ii) : ""}
      </dl>
    </details>
    ${
      e.isRec
        ? or`<p>
          See also
          <a
            href="${`https://www.w3.org/Translations/?technology=${e.shortName}`}"
          >
            <strong>translations</strong></a
          >.
        </p>`
        : ""
    }
    ${
      e.alternateFormats
        ? or`<p>
          ${fi.multiple_alternates(t.multipleAlternates)}
          ${t.alternatesHTML}
        </p>`
        : ""
    }
    ${(function (e) {
      const t = document.querySelector(".copyright");
      if (t) return (t.remove(), t);
      if (e.isUnofficial && e.licenseInfo)
        return or`<p class="copyright">
      Copyright &copy;
      ${e.copyrightStart ? `${e.copyrightStart}-` : ""}${e.publishYear}
      the document editors/authors.
      ${
        "unlicensed" !== e.licenseInfo.name
          ? or`Text is available under the
            <a rel="license" href="${e.licenseInfo.url}"
              >${e.licenseInfo.name}</a
            >; additional terms may apply.`
          : ""
      }
    </p>`;
      return (function (e) {
        return or`<p class="copyright">
    <a href="https://www.w3.org/policies/#copyright">Copyright</a>
    &copy;
    ${e.copyrightStart ? `${e.copyrightStart}-` : ""}${e.publishYear}
    ${e.additionalCopyrightHolders ? or` ${[e.additionalCopyrightHolders]} &amp; ` : ""}
    <a href="https://www.w3.org/">World Wide Web Consortium</a>.
    <abbr title="World Wide Web Consortium">W3C</abbr><sup>&reg;</sup>
    <a href="https://www.w3.org/policies/#Legal_Disclaimer">liability</a>,
    <a href="https://www.w3.org/policies/#W3C_Trademarks">trademark</a
    >${(function (e) {
      const { url: t, short: n, name: r } = e;
      if ("unlicensed" === r)
        return or`. <span class="issue">THIS DOCUMENT IS UNLICENSED</span>.`;
      return or` and
    <a rel="license" href="${t}" title="${r}">${n}</a> rules apply.`;
    })(e.licenseInfo)}
  </p>`;
      })(e);
    })(e)}
    <hr title="Separator for header" />
  </div>`
    );
    function bi(e) {
      const t = [];
      if (e.github) {
        const {
          repoURL: n,
          issuesURL: r,
          newIssuesURL: s,
          pullsURL: i,
          fullName: o,
        } = e.github;
        t.push(or`<dd>
        <a href="${n}">GitHub ${o}</a>
        (<a href="${i}">pull requests</a>,
        <a href="${s}">new issue</a>,
        <a href="${r}">open issues</a>)
      </dd>`);
      }
      if (e.wgPublicList) {
        const n = new URL(`mailto:${e.wgPublicList}@w3.org`),
          r = e.subjectPrefix ?? `[${e.shortName}] ${fi.your_topic_here}`,
          s = or`<a
      href="${n.href}?subject=${encodeURIComponent(r)}"
      >${n.pathname}</a
    >`,
          i =
            e.subjectPrefix ||
            or`[${e.shortName}] <em>${fi.message_topic}</em>`,
          o = or`${fi.with_subject_line}${" "}
      <kbd>${i}</kbd>`,
          a = new URL(e.wgPublicList, "https://lists.w3.org/Archives/Public/"),
          c = or`(<a href="${a}" rel="discussion"
        >${fi.archives}</a
      >)`;
        t.push(or`<dd>${s} ${o} ${c}</dd>`);
      }
      return t;
    }
    var yi = (e, t) => {
      const n = document.querySelector(".copyright");
      n && n.remove();
      const r = document.querySelector("h1#title"),
        s = r?.cloneNode(!0);
      return or`<div class="head">
    ${(e.logos ?? []).length ? or`<p class="logos">${(e.logos ?? []).map(ci)}</p>` : ""}
    ${r} ${mi(e)}
    <p id="w3c-state">
      <a href="https://www.w3.org/standards/types#reports"
        >${e.longStatus}</a
      >
      <time class="dt-published" datetime="${e.dashDate}"
        >${Cr.format(e.publishDate)}</time
      >
    </p>
    <dl>
      ${
        e.thisVersion
          ? or`<dt>${fi.this_version}</dt>
            <dd>
              <a class="u-url" href="${e.thisVersion}"
                >${e.thisVersion}</a
              >
            </dd>`
          : ""
      }
      ${
        "latestVersion" in e
          ? or`<dt>${fi.latest_published_version}</dt>
            <dd>
              ${
                e.latestVersion
                  ? or`<a href="${e.latestVersion}"
                    >${e.latestVersion}</a
                  >`
                  : "none"
              }
            </dd>`
          : ""
      }
      ${
        e.edDraftURI
          ? or`
            <dt>${fi.latest_editors_draft}</dt>
            <dd><a href="${e.edDraftURI}">${e.edDraftURI}</a></dd>
          `
          : ""
      }
      ${
        e.testSuiteURI
          ? or`
            <dt>Test suite:</dt>
            <dd><a href="${e.testSuiteURI}">${e.testSuiteURI}</a></dd>
          `
          : ""
      }
      ${
        e.implementationReportURI
          ? or`
            <dt>Implementation report:</dt>
            <dd>
              <a href="${e.implementationReportURI}"
                >${e.implementationReportURI}</a
              >
            </dd>
          `
          : ""
      }
      ${
        e.prevVersion
          ? or`
            <dt>Previous version:</dt>
            <dd><a href="${e.prevVersion}">${e.prevVersion}</a></dd>
          `
          : ""
      }
      ${
        e.isCGFinal
          ? ""
          : or`
            ${
              e.prevED
                ? or`
                  <dt>Previous editor's draft:</dt>
                  <dd><a href="${e.prevED}">${e.prevED}</a></dd>
                `
                : ""
            }
          `
      }
      ${
        (e.editors ?? []).length
          ? or`
            <dt>
              ${(e.editors ?? []).length > 1 ? fi.editors : fi.editor}
            </dt>
            ${pi(e, "editors")}
          `
          : ""
      }
      ${
        (e.formerEditors ?? []).length
          ? or`
            <dt>
              ${(e.formerEditors ?? []).length > 1 ? fi.former_editors : fi.former_editor}
            </dt>
            ${pi(e, "formerEditors")}
          `
          : ""
      }
      ${
        (e.authors ?? []).length
          ? or`
            <dt>
              ${(e.authors ?? []).length > 1 ? fi.authors : fi.author}
            </dt>
            ${pi(e, "authors")}
          `
          : ""
      }
      ${
        e.github || e.wgPublicList
          ? or`<dt>${fi.feedback}</dt>
            ${bi(e)}`
          : ""
      }
      ${e.otherLinks ? e.otherLinks.map(ii) : ""}
    </dl>
    ${
      e.alternateFormats
        ? or`<p>
          ${t.multipleAlternates ? "This document is also available in these non-normative formats:" : "This document is also available in this non-normative format:"}
          ${t.alternatesHTML}
        </p>`
        : ""
    }
    ${
      n ||
      or`<p class="copyright">
          <a href="https://www.w3.org/policies/#copyright">Copyright</a>
          &copy;
          ${e.copyrightStart ? `${e.copyrightStart}-` : ""}${e.publishYear}
          ${e.additionalCopyrightHolders ? or` ${[e.additionalCopyrightHolders]} &amp; ` : ""}
          the Contributors to the ${s?.childNodes}
          Specification, published by the
          <a href="${e.wgURI}">${e.wg}</a> under the
          ${
            e.isCGFinal
              ? or`
                <a href="https://www.w3.org/community/about/agreements/fsa/"
                  >W3C Community Final Specification Agreement (FSA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/fsa-deed/"
                  >summary</a
                >
                is available.
              `
              : or`
                <a href="https://www.w3.org/community/about/agreements/cla/"
                  >W3C Community Contributor License Agreement (CLA)</a
                >. A human-readable
                <a
                  href="https://www.w3.org/community/about/agreements/cla-deed/"
                  >summary</a
                >
                is available.
              `
          }
        </p>`
    }
    <hr title="Separator for header" />
  </div>`;
    };
    const wi = Dr({
        en: {
          sotd: "Status of This Document",
          status_at_publication: or`This section describes the status of this
      document at the time of its publication. A list of current W3C
      publications and the latest revision of this technical report can be found
      in the
      <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>.`,
        },
        ko: {
          sotd: "현재 문서의 상태",
          status_at_publication: or`이 부분은 현재 문서의 발행 당시 상태에 대해
      기술합니다. W3C 발행 문서의 최신 목록 및 테크니컬 리포트 최신판의
      <a href="https://www.w3.org/TR/">W3C standards and drafts index</a> 에서
      열람할 수 있습니다.`,
        },
        zh: {
          sotd: "关于本文档",
          status_at_publication: or`本章节描述了本文档的发布状态。W3C的文档列表和最新版本可通过<a
        href="https://www.w3.org/TR/"
        >W3C技术报告</a
      >索引访问。`,
        },
        ja: {
          sotd: "この文書の位置付け",
          status_at_publication: or`この節には、公開時点でのこの文書の位置づけが記されている。現時点でのW3Cの発行文書とこのテクニカルレポートの最新版は、下記から参照できる。
      <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>`,
        },
        nl: { sotd: "Status van dit document" },
        es: {
          sotd: "Estado de este Document",
          status_at_publication: or`Esta sección describe el estado del presente
      documento al momento de su publicación. Una lista de las publicaciones
      actuales del W3C y la última revisión del presente informe técnico puede
      hallarse en
      <a href="https://www.w3.org/TR/">el índice de normas y borradores</a> del
      W3C.`,
        },
        de: {
          sotd: "Status dieses Dokuments",
          status_at_publication: or`Dieser Abschnitt beschreibt den Status des
      Dokuments zum Zeitpunkt der Publikation. Eine Liste der aktuellen
      Publikatinen des W3C und die aktuellste Fassung dieser Spezifikation kann
      im <a href="https://www.w3.org/TR/">W3C standards and drafts index</a>.`,
        },
        cs: {
          sotd: "Stav tohoto dokumentu",
          status_at_publication: or`Tato sekce popisuje stav tohoto dokumentu v době
      jeho zveřejnění. Seznam aktuálních publikací W3C a nejnovější verzi této
      technické zprávy najdete v
      <a href="https://www.w3.org/TR/">indexu standardů a návrhů W3C</a>
      na https://www.w3.org/TR/.`,
        },
      }),
      ki = "https://www.w3.org/policies/process/20250818/";
    function vi(e) {
      return /^[aeiou]/i.test(e) ? `an ${e}` : `a ${e}`;
    }
    var $i = (e, t) => or`
    <h2>${wi.sotd}</h2>
    ${e.isPreview ? xi(e) : ""}
    ${
      e.isUnofficial
        ? (function (e) {
            const { additionalContent: t } = e;
            return or`
    <p>
      This document is a draft of a potential specification. It has no official
      standing of any kind and does not represent the support or consensus of
      any standards organization.
    </p>
    ${t}
  `;
          })(t)
        : e.isTagFinding
          ? t.additionalContent
          : e.isNoTrack
            ? (function (e, t) {
                const { isMO: n } = e,
                  { additionalContent: r } = t;
                return or`
    <p>
      This document is merely a W3C-internal
      ${n ? "member-confidential" : ""} document. It has no official standing
      of any kind and does not represent consensus of the W3C Membership.
    </p>
    ${r}
  `;
              })(e, t)
            : or`
              <p><em>${wi.status_at_publication}</em></p>
              ${
                e.isMemberSubmission
                  ? (function (e, t) {
                      return or`
    ${t.additionalContent}
    ${
      e.isMemberSubmission
        ? (function (e) {
            const t = `https://www.w3.org/Submission/${e.publishDate.getUTCFullYear()}/${e.submissionCommentNumber}/Comment/`,
              n =
                "PP2017" === e.wgPatentPolicy
                  ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
                  : "https://www.w3.org/policies/patent-policy/";
            return or`<p>
    By publishing this document, W3C acknowledges that the
    <a href="${e.thisVersion}">Submitting Members</a> have made a formal
    Submission request to W3C for discussion. Publication of this document by
    W3C indicates no endorsement of its content by W3C, nor that W3C has, is, or
    will be allocating any resources to the issues addressed by it. This
    document is not the product of a chartered W3C group, but is published as
    potential input to the
    <a href="https://www.w3.org/policies/process/">W3C Process</a>. A
    <a href="${t}">W3C Team Comment</a> has been published in
    conjunction with this Member Submission. Publication of acknowledged Member
    Submissions at the W3C site is one of the benefits of
    <a href="https://www.w3.org/Consortium/Prospectus/Joining">
      W3C Membership</a
    >. Please consult the requirements associated with Member Submissions of
    <a href="${n}#sec-submissions"
      >section 3.3 of the W3C Patent Policy</a
    >. Please consult the complete
    <a href="https://www.w3.org/Submission"
      >list of acknowledged W3C Member Submissions</a
    >.
  </p>`;
          })(e)
        : ""
    }
  `;
                    })(e, t)
                  : or`
                    ${e.sotdAfterWGinfo ? "" : t.additionalContent}
                    ${
                      e.overrideStatus
                        ? ""
                        : or` ${(function (e) {
                            if (!e.wg) return;
                            let t = null;
                            const n =
                                document.querySelector(".addition.proposed"),
                              r = document.querySelector(
                                ".correction.proposed"
                              ),
                              s = document.querySelector(".addition"),
                              i = document.querySelector(".correction"),
                              o = n || r || s || i;
                            e.isRec &&
                              o &&
                              ((n && r) || (s && i)
                                ? (t = or`It includes
      ${
        n
          ? or`<a href="${ki}#proposed-amendments">
            proposed amendments</a
          >`
          : or`<a href="${ki}#candidate-amendments">
            candidate amendments</a
          >`
      },
      introducing substantive changes and new features since the previous
      Recommendation.`)
                                : n || s
                                  ? (t = or`It includes
      ${
        n
          ? or`<a href="${ki}#proposed-addition">
            proposed additions</a
          >`
          : or`<a href="${ki}#candidate-addition">
            candidate additions</a
          >`
      },
      introducing new features since the previous Recommendation.`)
                                  : (r || i) &&
                                    (t = or`It includes
      ${
        r
          ? or`<a href="${ki}#proposed-corrections">
            proposed corrections</a
          >`
          : or`<a href="${ki}#candidate-correction">
            candidate corrections</a
          >`
      }.`));
                            const a = Li[e.specStatus]
                              ? or` using the
        <a href="${ki}#recs-and-notes"
          >${Li[e.specStatus]}
          track</a
        >`
                              : "";
                            return or`<p>
    This document was published by ${Ci(e)} as
    ${vi(e.longStatus)}${a}. ${t}
  </p>`;
                          })(e)} `
                    }
                    ${e.sotdAfterWGinfo ? t.additionalContent : ""}
                    ${
                      e.isRec
                        ? (function (e) {
                            const { revisedRecEnd: t } = e,
                              n = document.querySelector(
                                "#sotd.updateable-rec"
                              );
                            let r = "";
                            document.querySelector(".addition.proposed")
                              ? (r = "additions")
                              : document.querySelector(
                                  ".correction.proposed"
                                ) && (r = "corrections");
                            return or`
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
      ${
        n
          ? or`Future updates to this Recommendation may incorporate
            <a href="${ki}#allow-new-features">new features</a>.`
          : ""
      }
    </p>
    ${
      document.querySelector(".addition:not(.proposed)")
        ? or`<p class="addition">
          Candidate additions are marked in the document.
        </p>`
        : ""
    }
    ${
      document.querySelector(".correction:not(.proposed)")
        ? or`<p class="correction">
          Candidate corrections are marked in the document.
        </p>`
        : ""
    }
    ${
      document.querySelector(".addition.proposed")
        ? or`<p class="addition proposed">
          Proposed additions are marked in the document.
        </p>`
        : ""
    }
    ${
      document.querySelector(".correction.proposed")
        ? or`<p class="correction proposed">
          Proposed corrections are marked in the document.
        </p>`
        : ""
    }
    ${
      r
        ? or`<p>
          The W3C Membership and other interested parties are invited to review
          the proposed ${r} and send comments through
          ${Cr.format(t)}. Advisory
          Committee Representatives should consult their
          <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
            >WBS questionnaires</a
          >.
        </p>`
        : ""
    }
  `;
                          })(e)
                        : (function (e) {
                            const t = document.querySelector(
                              "#sotd.updateable-rec"
                            );
                            let n = null,
                              r = null,
                              s = or`Publication as
  ${vi(e.textStatus)} does not imply endorsement
  by W3C and its Members.`,
                              i = or`<p>
    This is a draft document and may be updated, replaced, or obsoleted by other
    documents at any time. It is inappropriate to cite this document as other
    than a work in progress.
    ${
      t
        ? or`Future updates to this upcoming Recommendation may incorporate
          <a href="${ki}#allow-new-features">new features</a>.`
        : ""
    }
  </p>`;
                            "DISC" === e.specStatus &&
                              (i = or`<p>
      Publication as a Discontinued Draft implies that this document is no
      longer intended to advance or to be maintained. It is inappropriate to
      cite this document as other than abandoned work.
    </p>`);
                            const o = or`<p>
    This document is maintained and updated at any time. Some parts of this
    document are work in progress.
  </p>`;
                            switch (e.specStatus) {
                              case "STMT":
                                s = or`<p>
        A W3C Statement is a specification that, after extensive
        consensus-building, is endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> and its Members.
      </p>`;
                                break;
                              case "RY":
                                s = or`<p>W3C recommends the wide usage of this registry.</p>
        <p>
          A W3C Registry is a specification that, after extensive
          consensus-building, is endorsed by
          <abbr title="World Wide Web Consortium">W3C</abbr> and its Members.
        </p>`;
                                break;
                              case "CRD":
                                ((n = or`A Candidate Recommendation Draft integrates
      changes from the previous Candidate Recommendation that the Working Group
      intends to include in a subsequent Candidate Recommendation Snapshot.`),
                                  "LS" === e.pubMode && (i = o));
                                break;
                              case "CRYD":
                                ((n = or`A Candidate Registry Draft integrates changes
      from the previous Candidate Registry Snapshot that the Working Group
      intends to include in a subsequent Candidate Registry Snapshot.`),
                                  "LS" === e.pubMode && (i = o));
                                break;
                              case "CRY":
                                ((n = or`A Candidate Registry Snapshot has received
        <a href="${ki}#dfn-wide-review">wide review</a>.`),
                                  (r = or`<p>
        The W3C Membership and other interested parties are invited to review
        the document and send comments through ${e.humanPREnd}. Advisory
        Committee Representatives should consult their
        <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
          >WBS questionnaires</a
        >. Note that substantive technical comments were expected during the
        Candidate Recommendation review period that ended ${e.humanCREnd}.
      </p>`));
                                break;
                              case "CR":
                                ((n = or`A Candidate Recommendation Snapshot has received
        <a href="${ki}#dfn-wide-review">wide review</a>, is intended to
        gather
        <a href="${e.implementationReportURI}">implementation experience</a>,
        and has commitments from Working Group members to
        <a href="https://www.w3.org/policies/patent-policy/#sec-Requirements"
          >royalty-free licensing</a
        >
        for implementations.`),
                                  (i = or`${
                                    t
                                      ? or`Future updates to this upcoming Recommendation may incorporate
            <a href="${ki}#allow-new-features">new features</a>.`
                                      : ""
                                  }`),
                                  (r =
                                    "LS" === e.pubMode
                                      ? or`<p>
          Comments are welcome at any time but most especially before
          ${Cr.format(e.crEnd)}.
        </p>`
                                      : or`<p>
          This Candidate Recommendation is not expected to advance to
          Recommendation any earlier than
          ${Cr.format(e.crEnd)}.
        </p>`));
                                break;
                              case "PR":
                                r = or`<p>
        The W3C Membership and other interested parties are invited to review
        the document and send comments through
        ${Cr.format(e.prEnd)}. Advisory Committee
        Representatives should consult their
        <a href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
          >WBS questionnaires</a
        >. Note that substantive technical comments were expected during the
        Candidate Recommendation review period that ended
        ${Cr.format(e.crEnd)}.
      </p>`;
                                break;
                              case "DNOTE":
                                s = or`${e.textStatus}s are not endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> nor its Members.`;
                                break;
                              case "NOTE":
                                ((s = or`This ${e.textStatus} is endorsed by
        ${Ci(e)}, but is not endorsed by
        <abbr title="World Wide Web Consortium">W3C</abbr> itself nor its
        Members.`),
                                  (i = ""));
                            }
                            return or`<p>${s} ${n}</p>
    ${i} ${r}`;
                          })(e)
                    }
                    ${(function (e) {
                      const {
                          isNote: t,
                          isRegistry: n,
                          wgId: r,
                          multipleWGs: s,
                          wgPatentHTML: i,
                          wgPatentURI: o,
                          wgPatentPolicy: a,
                        } = e,
                        c =
                          "PP2017" === a
                            ? "https://www.w3.org/Consortium/Patent-Policy-20170801/"
                            : "https://www.w3.org/policies/patent-policy/",
                        l =
                          t || n
                            ? or`
        The
        <a href="${c}"
          >${"PP2017" === a ? "1 August 2017 " : ""}W3C Patent
          Policy</a
        >
        does not carry any licensing requirements or commitments on this
        document.
      `
                            : or`
        This document was produced by ${s ? "groups" : "a group"}
        operating under the
        <a href="${c}"
          >${"PP2017" === a ? "1 August 2017 " : ""}W3C Patent
          Policy</a
        >.
      `;
                      return or`<p data-deliverer="${t || n ? r : null}">
    ${l}
    ${
      t || n
        ? ""
        : or`
          ${
            s
              ? or` W3C maintains ${i} `
              : or`
                W3C maintains a
                ${
                  o
                    ? or`<a href="${o}" rel="disclosure"
                      >public list of any patent disclosures</a
                    >`
                    : "public list of any patent disclosures"
                }
              `
          }
          made in connection with the deliverables of
          ${s ? "each group; these pages also include" : "the group; that page also includes"}
          instructions for disclosing a patent. An individual who has actual
          knowledge of a patent that the individual believes contains
          <a href="${c}#def-essential">Essential Claim(s)</a>
          must disclose the information in accordance with
          <a href="${c}#sec-Disclosure"
            >section 6 of the W3C Patent Policy</a
          >.
        `
    }
  </p>`;
                    })(e)}
                    <p>
                      This document is governed by the
                      <a id="w3c_process_revision" href="${ki}"
                        >18 August 2025 W3C Process Document</a
                      >.
                    </p>
                  `
              }
            `
    }
    ${t.additionalSections}
  `;
    function xi(e) {
      const { prUrl: t, prNumber: n, edDraftURI: r } = e;
      return or`<details class="annoying-warning" open="">
    <summary>
      This is a
      preview${
        t && n
          ? or`
            of pull request
            <a href="${t}">#${n}</a>
          `
          : ""
      }
    </summary>
    <p>
      Do not attempt to implement this version of the specification. Do not
      reference this version as authoritative in any way.
      ${
        r
          ? or`
            Instead, see
            <a href="${r}">${r}</a> for the Editor's draft.
          `
          : ""
      }
    </p>
  </details>`;
    }
    function Ci(e) {
      return Array.isArray(e.wg)
        ? Ur(e.wg, (t, n) => or`the <a href="${e.wgURI[n]}">${t}</a>`)
        : e.wg
          ? or`the <a href="${e.wgURI}">${e.wg}</a>`
          : void 0;
    }
    var _i = (e, t) => or`
    <h2>${wi.sotd}</h2>
    ${e.isPreview ? xi(e) : ""}
    <p>
      This specification was published by the
      <a href="${e.wgURI}">${e.wg}</a>. It is not a W3C Standard nor is it
      on the W3C Standards Track.
      ${
        e.isCGFinal
          ? or`
            Please note that under the
            <a href="https://www.w3.org/community/about/agreements/final/"
              >W3C Community Final Specification Agreement (FSA)</a
            >
            other conditions apply.
          `
          : or`
            Please note that under the
            <a href="https://www.w3.org/community/about/agreements/cla/"
              >W3C Community Contributor License Agreement (CLA)</a
            >
            there is a limited opt-out and other conditions apply.
          `
      }
      Learn more about
      <a href="https://www.w3.org/community/"
        >W3C Community and Business Groups</a
      >.
    </p>
    ${e.sotdAfterWGinfo ? "" : t.additionalContent}
    ${
      !e.github && e.wgPublicList
        ? (function (e, t) {
            const {
                mailToWGPublicListWithSubject: n,
                mailToWGPublicListSubscription: r,
              } = t,
              { wgPublicList: s, subjectPrefix: i } = e;
            return or`<p>
    If you wish to make comments regarding this document, please send them to
    <a href="${n}">${s}@w3.org</a>
    (<a href="${r}">subscribe</a>,
    <a href="${`https://lists.w3.org/Archives/Public/${s}/`}">archives</a>)${
      i
        ? or` with <code>${i}</code> at the start of your email's
          subject`
        : ""
    }.
  </p>`;
          })(e, t)
        : ""
    }
    ${
      e.github
        ? (function (e, t) {
            if (e.github || e.wgPublicList)
              return or`<p>
    ${
      e.github
        ? or`
          <a href="${e.issueBase}">GitHub Issues</a> are preferred for
          discussion of this specification.
        `
        : ""
    }
    ${
      e.wgPublicList
        ? or`
          ${e.github && e.wgPublicList ? "Alternatively, you can send comments to our mailing list." : "Comments regarding this document are welcome."}
          Please send them to
          <a href="${t.mailToWGPublicListWithSubject}"
            >${e.wgPublicList}@w3.org</a
          >
          (<a href="${t.mailToWGPublicListSubscription}">subscribe</a>,
          <a
            href="${`https://lists.w3.org/Archives/Public/${e.wgPublicList}/`}"
            >archives</a
          >)${
            e.subjectPrefix
              ? or` with <code>${e.subjectPrefix}</code> at the start of your
                email's subject`
              : ""
          }.
        `
        : ""
    }
  </p>`;
          })(e, t)
        : ""
    }
    ${e.sotdAfterWGinfo ? t.additionalContent : ""}
    ${t.additionalSections}
  `;
    const Si = "w3c/headers";
    function Ti(e) {
      return new URL(e, "https://www.w3.org/").href;
    }
    const Ei = { LS: "WD", LD: "WD", FPWD: "WD", "Member-SUBM": "SUBM" },
      Ri = {
        DNOTE: "Group Note Draft",
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
        DRY: "Registry Draft",
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
      },
      Ai = {
        ...Ri,
        CR: "Candidate Recommendation Snapshot",
        CRD: "Candidate Recommendation Draft",
        CRY: "Candidate Registry Snapshot",
        CRYD: "Candidate Registry Draft",
      },
      Li = {
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
      },
      Pi = ["DNOTE", "NOTE", "STMT"],
      Ni = ["CR", "CRD", "DISC", "FPWD", "PR", "REC", "RSCND", "WD"],
      Ii = ["DRY", "CRY", "CRYD", "RY"],
      Di = ["draft-finding", "finding", "editor-draft-finding"],
      Oi = ["CG-DRAFT", "CG-FINAL"],
      ji = ["BG-DRAFT", "BG-FINAL"],
      zi = [...Oi, ...ji],
      Mi = [...Pi, ...Ni, ...Ii],
      qi = [
        "base",
        ...Oi,
        ...ji,
        "editor-draft-finding",
        "draft-finding",
        "finding",
        "MO",
        "unofficial",
      ],
      Ui = new Map([
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
      ]),
      Wi = ["PP2017", "PP2020"];
    function Fi(e, t, n = new Date()) {
      const r = e[t] ? new Date(e[t]) : new Date(n);
      if (Number.isFinite(r.valueOf())) {
        const e = $r.format(r);
        return new Date(e);
      }
      return (
        ss(
          ds`${t} is not a valid date: "${e[t]}". Expected format 'YYYY-MM-DD'.`,
          Si
        ),
        new Date($r.format(new Date()))
      );
    }
    function Bi(e, { isTagFinding: t = !1 }) {
      const n = e.cloneNode(!0),
        r = document.createDocumentFragment();
      for (
        ;
        n.hasChildNodes() &&
        (n.nodeType !== Node.ELEMENT_NODE ||
          "section" !== n.firstChild.localName);
      )
        r.appendChild(n.firstChild);
      if (t && !r.hasChildNodes()) {
        is(
          ds`ReSpec does not support automated SotD generation for TAG findings.`,
          Si,
          { hint: "Please add the prerequisite content in the 'sotd' section." }
        );
      }
      return { additionalContent: r, additionalSections: n.childNodes };
    }
    var Hi = Object.freeze({
      __proto__: null,
      W3CNotes: Pi,
      bgStatus: ji,
      cgStatus: Oi,
      cgbgStatus: zi,
      licenses: Ui,
      name: Si,
      noTrackStatus: qi,
      recTrackStatus: Ni,
      registryTrackStatus: Ii,
      run: async function (e) {
        const t = e.specStatus ?? "";
        if (
          ((e.isBasic = "base" === t),
          (e.isCGBG = zi.includes(t)),
          (e.isCGFinal = e.isCGBG && t.endsWith("G-FINAL")),
          (e.isCR = "CR" === t || "CRD" === t),
          (e.isCRDraft = "CRD" === t),
          (e.isCRY = "CRY" === t || "CRYD" === t),
          (e.isEd = "ED" === t),
          (e.isMemberSubmission = "Member-SUBM" === t),
          (e.isMO = "MO" === t),
          (e.isNote = Pi.includes(t)),
          (e.isNoTrack = qi.includes(t)),
          (e.isPR = "PR" === t),
          (e.isRecTrack = Ni.includes(t)),
          (e.isRec = e.isRecTrack && "REC" === t),
          (e.isRegistry = Ii.includes(t)),
          (e.isRegular = !e.isCGBG && !e.isBasic),
          (e.isTagEditorFinding = "editor-draft-finding" === t),
          (e.isTagFinding = Di.includes(t)),
          (e.isUnofficial = "unofficial" === t),
          (e.licenseInfo = (function (e) {
            let t;
            if ("string" == typeof e.license) {
              const n = e.license.toLowerCase();
              if (Ui.has(n)) t = n;
              else {
                const t = `The license "\`${e.license}\`" is not supported.`,
                  n = cs(
                    [...Ui.keys()].filter(e => e),
                    { quotes: !0 }
                  ),
                  r = ds`Please set
        ${"[license]"} to one of: ${n}. If in doubt, remove \`license\` and let ReSpec pick one for you.`;
                ss(t, Si, { hint: r });
              }
            }
            if (
              (e.isUnofficial && !t && (t = "cc-by"),
              !e.isUnofficial && ["cc-by", "cc0"].includes(t))
            ) {
              const t = ds`Please set ${"[license]"} to \`"w3c-software-doc"\` instead.`;
              ss(
                ds`License "\`${e.license}\`" is not allowed for W3C Specifications.`,
                Si,
                { hint: t }
              );
            }
            return void 0 === t
              ? { name: "unlicensed", url: null, short: "UNLICENSED" }
              : Ui.get(t);
          })(e)),
          (e.prependW3C = !e.isBasic && !e.isUnofficial),
          (e.longStatus = Ai[t]),
          (e.textStatus = Ri[t]),
          (e.showPreviousVersion = !1),
          e.isRegular && !e.shortName)
        ) {
          const e = ds`Please set ${"[shortName]"} to a short name for the specification.`;
          ss(
            ds`The ${"[shortName]"} configuration option is required for this kind of document.`,
            Si,
            { hint: e }
          );
        }
        if (
          ((e.publishDate = Fi(e, "publishDate", document.lastModified)),
          (e.publishYear = e.publishDate.getUTCFullYear()),
          e.modificationDate &&
            (e.modificationDate = Fi(
              e,
              "modificationDate",
              document.lastModified
            )),
          e.isRecTrack && !e.github && !e.wgPublicList)
        ) {
          const e = ds`Use the ${"[github]"} configuration option to add a link to a repository. Alternatively use ${"[wgPublicList]"} to link to a mailing list.`;
          ss(
            "W3C Process requires a either a link to a public repository or mailing list.",
            Si,
            { hint: e }
          );
        }
        if (e.isEd && !e.edDraftURI) {
          const e = ds`Please set ${"[edDraftURI]"} to the URL of the Editor's Draft. Alternatively, use the set ${"[github]"} option, which automatically sets it for you.`;
          is(
            ds`Editor's Drafts should set ${"[edDraftURI]"} configuration option.`,
            Si,
            { hint: e }
          );
        }
        const n = (function (e) {
          const { specStatus: t, group: n } = e;
          if (e.isNoTrack && !e.isCGBG && !e.isTagFinding) return "";
          if (Mi.includes(t ?? "") || "wg" === e.groupType) return "/TR";
          switch (t) {
            case "CG-FINAL":
            case "BG-FINAL":
              return `/community/reports/${n}`;
            case "finding":
            case "draft-finding":
              return "/2001/tag/doc";
            case "Member-SUBM":
              return "/Submission";
          }
          if (
            ("tag" === e.group || "ab" === e.group) &&
            "TR" === e.canonicalURI
          )
            return "/TR";
          return "";
        })(e);
        if (n && !e.thisVersion) {
          const r = Ei[t] || t,
            { shortName: s, publishDate: i } = e,
            o = `${r}-${s}-${jr(i)}`,
            a = [...Mi, "Member-SUBM"].includes(t)
              ? `${i.getUTCFullYear()}/`
              : "";
          e.thisVersion = Ti(`${n}/${a}${o}/`);
        }
        (e.isEd && (e.thisVersion = e.edDraftURI),
          e.isCGBG &&
            (function (e) {
              const t = Ri[e.specStatus],
                n = e.latestVersion ? new URL(Ti(e.latestVersion)) : null;
              if (!e.wg) {
                return void ss(
                  ds`The ${"[group]"} configuration option is required for this kind of document (${t}).`,
                  Si
                );
              }
              if (e.isCGFinal) {
                if (
                  !1 ===
                  ("https://www.w3.org" === n?.origin ||
                    "https://w3.org/" === n?.origin)
                ) {
                  ss(
                    ds`For ${t}, the ${"[latestVersion]"} URL must point to somewhere at https://www.w3.org/.`,
                    Si,
                    {
                      hint: "Ask a W3C Team Member for a W3C URL where the report can be published.",
                    }
                  );
                }
              }
            })(e),
          null !== e.latestVersion &&
            (e.latestVersion = e.latestVersion
              ? Ti(e.latestVersion)
              : n
                ? Ti(`${n}/${e.shortName}/`)
                : ""),
          e.latestVersion &&
            (function (e) {
              const t = new URL(e.latestVersion);
              if (
                ("https://www.w3.org" === t.origin ||
                  "https://w3.org/" === t.origin) &&
                t.pathname.startsWith("/TR/") &&
                !1 === ["ED", ...Mi].includes(e.specStatus)
              ) {
                const t = ds`Ask a W3C Team Member for a W3C URL where the report can be published and change ${"[latestVersion]"} to something else.`;
                ss(
                  ds`Documents with a status of \`"${e.specStatus}"\` can't be published on the W3C's /TR/ (Technical Report) space.`,
                  Si,
                  { hint: t }
                );
              }
            })(e));
        const r = `${n}/${e.shortName}`;
        if (e.previousPublishDate) {
          if (!e.previousMaturity && !e.isTagFinding) {
            ss(
              ds`${"[`previousPublishDate`]"} is set, but missing ${"[`previousMaturity`]"}.`,
              Si
            );
          }
          e.previousPublishDate = Fi(e, "previousPublishDate");
          const t = Ei[e.previousMaturity] ?? e.previousMaturity;
          if (e.isTagFinding && e.latestVersion) {
            const t = $r.format(e.publishDate);
            e.thisVersion = Ti(`${r}-${t}`);
            const n = $r.format(e.previousPublishDate);
            e.prevVersion = Ti(`${r}-${n}}`);
          } else if (e.isCGBG || e.isBasic) e.prevVersion = e.prevVersion || "";
          else {
            const r = e.previousPublishDate.getUTCFullYear(),
              { shortName: s } = e,
              i = jr(e.previousPublishDate);
            e.prevVersion = Ti(`${n}/${r}/${t}-${s}-${i}/`);
          }
        }
        e.prevRecShortname &&
          !e.prevRecURI &&
          (e.prevRecURI = Ti(`${n}/${e.prevRecShortname}`));
        const s = e.editors ?? [],
          i = e.formerEditors ?? [];
        for (let e = 0; e < s.length; e++) {
          const t = s[e];
          "retiredDate" in t && (i.push(t), s.splice(e--, 1));
        }
        if (((e.editors = s), (e.formerEditors = i), 0 === s.length)) {
          const e = ds`Add one or more editors using the ${"[editors]"} configuration option.`;
          ss("At least one editor is required.", Si, { hint: e });
        } else
          s.length &&
            e.isRecTrack &&
            s.forEach((e, t) => {
              if (e.w3cid) return;
              const n = ds`See ${"[w3cid]"} for instructions for how to retrieve it and add it.`;
              ss(
                ds`Editor ${e.name ? `"${e.name}"` : `number ${t + 1}`} is missing their ${"[w3cid]"}.`,
                Si,
                { hint: n }
              );
            });
        if (e.alternateFormats?.some(({ uri: e, label: t }) => !e || !t)) {
          ss(
            ds`Every ${"[`alternateFormats`]"} entry must have a \`uri\` and a \`label\`.`,
            Si
          );
        }
        (e.copyrightStart == e.publishYear && (e.copyrightStart = ""),
          (e.dashDate = $r.format(e.publishDate)),
          (e.publishISODate = e.publishDate.toISOString()),
          (e.shortISODate = $r.format(e.publishDate)),
          (function (e) {
            if (!e.wgPatentPolicy) return;
            const t = new Set([].concat(e.wgPatentPolicy));
            if (t.size && ![...t].every(e => Wi.includes(e))) {
              const e = ds`Invalid ${"[wgPatentPolicy]"} value(s): ${ls([...t].filter(e => !Wi.includes(e)))}.`,
                n = `Please use one of: ${cs(Wi)}.`;
              ss(e, Si, { hint: n });
            }
            if (1 !== t.size) {
              const e =
                  "When collaborating across multiple groups, they must use the same patent policy.",
                n = ds`For ${"[wgPatentPolicy]"}, please check the patent policies of each group. The patent policies were: ${[...t].join(", ")}.`;
              ss(e, Si, { hint: n });
            }
            e.wgPatentPolicy = [...t][0];
          })(e),
          await (async function (e) {
            if (!e.shortName || null === e.historyURI || !e.latestVersion)
              return;
            const t = e.isEd || Mi.includes(e.specStatus);
            if (e.historyURI && !t) {
              const t = ds`Please remove ${"[historyURI]"}.`;
              return (
                ss(
                  ds`The ${"[historyURI]"} can't be used with non /TR/ documents.`,
                  Si,
                  { hint: t }
                ),
                void (e.historyURI = null)
              );
            }
            const n = new URL(
              e.historyURI ?? `${e.shortName}/`,
              "https://www.w3.org/standards/history/"
            );
            if (
              (e.historyURI && t) ||
              ["FPWD", "DNOTE", "NOTE", "DRY"].includes(e.specStatus)
            )
              return void (e.historyURI = n.href);
            try {
              const t = await fetch(n, { method: "HEAD" });
              t.ok && (e.historyURI = t.url);
            } catch {}
          })(e),
          e.isTagEditorFinding &&
            (delete e.thisVersion, delete e.latestVersion),
          e.isTagFinding && (e.showPreviousVersion = !!e.previousPublishDate));
        const o = {
            get multipleAlternates() {
              return !!(e.alternateFormats && e.alternateFormats.length > 1);
            },
            get alternatesHTML() {
              return (
                e.alternateFormats &&
                Ur(
                  e.alternateFormats.map(({ label: e }) => e),
                  (t, n) => {
                    const r = e.alternateFormats[n];
                    return or`<a
              rel="alternate"
              href="${r.uri}"
              hreflang="${r?.lang ?? null}"
              type="${r?.type ?? null}"
              >${r.label}</a
            >`;
                  }
                )
              );
            },
          },
          a = (e.isCGBG ? yi : gi)(e, o);
        (document.body.prepend(a), document.body.classList.add("h-entry"));
        const c =
          document.getElementById("sotd") || document.createElement("section");
        if ((e.isCGBG || !e.isNoTrack || e.isTagFinding) && !c.id) {
          ss(
            "A Status of This Document must include at least on custom paragraph.",
            Si,
            {
              elements: [c],
              hint: "Add a `<p>` in the 'sotd' section that reflects the status of this specification.",
            }
          );
        }
        ((c.id = c.id || "sotd"), c.classList.add("introductory"));
        const l = [e.wg, e.wgURI, e.wgPatentURI];
        if (l.some(e => Array.isArray(e)) && !l.every(e => Array.isArray(e))) {
          const e = ds`Use the ${"[group]"} option with an array instead.`;
          ss(
            ds`If one of ${"[wg]"}, ${"[wgURI]"}, or ${"[wgPatentURI]"} is an array, they all have to be.`,
            Si,
            { hint: e }
          );
        }
        if (
          (Array.isArray(e.wg)
            ? ((e.multipleWGs = e.wg.length > 1),
              (e.wgPatentHTML = Ur(
                e.wg,
                (t, n) => or`a
        <a href="${e.wgPatentURI[n]}" rel="disclosure"
          >public list of any patent disclosures (${t})</a
        >`
              )))
            : (e.multipleWGs = !1),
          e.isPR && !e.crEnd)
        ) {
          ss(
            ds`${"[specStatus]"} is "PR" but no ${"[crEnd]"} is specified in the ${"[respecConfig]"} (needed to indicate end of previous CR).`,
            Si
          );
        }
        if (e.isCR && !e.isCRDraft && !e.crEnd) {
          ss(
            ds`${"[specStatus]"} is "CR", but no ${"[crEnd]"} is specified in the ${"[respecConfig]"}.`,
            Si
          );
        }
        if (((e.crEnd = Fi(e, "crEnd")), e.isPR && !e.prEnd)) {
          ss(
            ds`${"[specStatus]"} is "PR" but no ${"[prEnd]"} is specified in the ${"[respecConfig]"}.`,
            Si
          );
        }
        e.prEnd = Fi(e, "prEnd");
        const u = c.classList.contains("updateable-rec"),
          d = null !== document.querySelector(".correction"),
          p = null !== document.querySelector(".proposed-correction"),
          h = null !== document.querySelector(".addition"),
          f = null !== document.querySelector(".proposed-addition"),
          m = d || h || f || p;
        if (e.isRec && !e.errata && !m) {
          const e = ds`Add an ${"[errata]"} URL to your ${"[respecConfig]"}.`;
          ss("Recommendations must have an errata link.", Si, { hint: e });
        }
        if (!u && (h || d)) {
          ss(
            ds`${"[specStatus]"} is "REC" with proposed additions but the Recommendation is not marked as allowing new features.`,
            Si
          );
        }
        if (e.isRec && u && (f || p) && !e.revisedRecEnd) {
          ss(
            ds`${"[specStatus]"} is "REC" with proposed corrections or additions but no ${"[revisedRecEnd]"} is specified in the ${"[respecConfig]"}.`,
            Si
          );
        }
        if (
          ((e.revisedRecEnd = Fi(e, "revisedRecEnd")),
          e.noRecTrack && Ni.includes(t))
        ) {
          const e = ds`Document configured as ${"[noRecTrack]"}, but its status ("${t}") puts it on the W3C Rec Track.`,
            n = cs(Ni, { quotes: !0 });
          ss(e, Si, { hint: `Status **can't** be any of: ${n}.` });
        }
        if (
          (c.classList.contains("override") ||
            or.bind(c)`${(function (e, t) {
              const n = {
                  ...Bi(t, e),
                  get mailToWGPublicList() {
                    return `mailto:${e.wgPublicList}@w3.org`;
                  },
                  get mailToWGPublicListWithSubject() {
                    const t = e.subjectPrefix
                      ? `?subject=${encodeURIComponent(e.subjectPrefix)}`
                      : "";
                    return this.mailToWGPublicList + t;
                  },
                  get mailToWGPublicListSubscription() {
                    return `mailto:${e.wgPublicList}-request@w3.org?subject=subscribe`;
                  },
                },
                r = e.isCGBG ? _i : $i;
              return r(e, n);
            })(e, c)}`,
          !e.implementationReportURI && e.isCR)
        ) {
          const e = ds`CR documents must have an ${"[implementationReportURI]"} that describes the [implementation experience](https://www.w3.org/policies/process/#implementation-experience).`;
          ss(
            ds`Missing ${"[implementationReportURI]"} configuration option in ${"[respecConfig]"}.`,
            Si,
            { hint: e }
          );
        }
        if (!e.implementationReportURI && e.isPR) {
          is(
            ds`PR documents should include an ${"[implementationReportURI]"}, which needs to link to a document that describes the [implementation experience](https://www.w3.org/policies/process-20190301/#implementation-experience).`,
            Si
          );
        }
        fs("amend-user-config", {
          publishISODate: e.publishISODate,
          generatedSubtitle: Ir(
            document.getElementById("w3c-state")?.textContent ?? ""
          ),
        });
      },
      status2text: Ri,
      status2track: Li,
      tagStatus: Di,
      trStatus: Mi,
    });
    const Gi = {
        lint: {
          "no-headingless-sections": !0,
          "no-http-props": !0,
          "no-unused-vars": !1,
          "check-punctuation": !1,
          "local-refs-exist": !0,
          "check-internal-slots": !1,
          "check-charset": !1,
          "privsec-section": !1,
          "no-dfn-in-abstract": !1,
        },
        pluralize: !0,
        specStatus: "base",
        highlightVars: !0,
        addSectionLinks: !0,
      },
      Vi = "w3c/defaults",
      Ji = {
        src: "https://www.w3.org/StyleSheets/TR/2021/logos/W3C",
        alt: "W3C",
        height: 48,
        width: 72,
        url: "https://www.w3.org/",
      },
      Ki = {
        alt: "W3C Member Submission",
        href: "https://www.w3.org/Submission/",
        src: "https://www.w3.org/Icons/member_subm-v.svg",
        width: "211",
        height: "48",
      },
      Yi = {
        lint: {
          "privsec-section": !1,
          "required-sections": !0,
          "wpt-tests-exist": !1,
          "informative-dfn": "warn",
          "no-unused-dfns": "warn",
          a11y: !1,
        },
        doJsonLd: !1,
        logos: [],
        xref: !0,
        wgId: "",
        otherLinks: [],
        excludeGithubLinks: !0,
        subtitle: "",
        prevVersion: "",
        formerEditors: [],
        editors: [],
        authors: [],
      };
    var Zi = Object.freeze({
      __proto__: null,
      name: Vi,
      run: function (e) {
        const t = !1 !== e.lint && { ...Gi.lint, ...Yi.lint, ...e.lint };
        (Object.assign(e, { ...Gi, ...Yi, ...e, lint: t }),
          "unofficial" === e.specStatus ||
            e.hasOwnProperty("license") ||
            (e.license = "w3c-software-doc"),
          (function (e) {
            const { specStatus: t, groupType: n, group: r } = e;
            if (!t) {
              const t = ds`Select an appropriate status from ${"[specStatus]"} based on your W3C group. If in doubt, use \`"unofficial"\`.`;
              return (
                ss(
                  ds`The ${"[specStatus]"} configuration option is required.`,
                  Vi,
                  { hint: t }
                ),
                void (e.specStatus = "base")
              );
            }
            if (void 0 === Ri[t]) {
              const n = ds`The ${"[specStatus]"} "\`${t}\`" is not supported at for this type of document.`,
                r = ds`set ${"[specStatus]"} to one of: ${cs(Object.keys(Ri), { quotes: !0 })}.`;
              return (ss(n, Vi, { hint: r }), void (e.specStatus = "base"));
            }
            switch (n) {
              case "cg":
                if (![...Oi, "unofficial", "UD"].includes(t)) {
                  const n = ds`W3C Community Group documents can't use \`"${t}"\` for the ${"[specStatus]"} configuration option.`,
                    r = cs(Oi, { quotes: !0 });
                  (ss(n, Vi, {
                    hint: `Please use one of: ${r}. Automatically falling back to \`"CG-DRAFT"\`.`,
                  }),
                    (e.specStatus = "CG-DRAFT"));
                }
                break;
              case "bg":
                if (![...ji, "unofficial", "UD"].includes(t)) {
                  const n = ds`W3C Business Group documents can't use \`"${t}"\` for the ${"[specStatus]"} configuration option.`,
                    r = cs(ji, { quotes: !0 });
                  (ss(n, Vi, {
                    hint: `Please use one of: ${r}. Automatically falling back to \`"BG-DRAFT"\`.`,
                  }),
                    (e.specStatus = "BG-DRAFT"));
                }
                break;
              case "wg":
                if (![...Mi, "unofficial", "UD", "ED"].includes(t)) {
                  const e = ds`Pleas see ${"[specStatus]"} for appropriate status for W3C Working Group documents.`;
                  ss(
                    ds`W3C Working Group documents can't use \`"${t}"\` for the ${"[specStatus]"} configuration option.`,
                    Vi,
                    { hint: e }
                  );
                }
                break;
              case "other":
                if ("tag" === r && !["ED", ...Mi, ...Di].includes(t)) {
                  const n = ds`The W3C Technical Architecture Group's documents can't use \`"${t}"\` for the ${"[specStatus]"} configuration option.`,
                    r = cs(["ED", ...Mi, ...Di], { quotes: !0 });
                  (ss(n, Vi, {
                    hint: `Please use one of: ${r}. Automatically falling back to \`"unofficial"\`.`,
                  }),
                    (e.specStatus = "unofficial"));
                }
                break;
              default:
                if (
                  !e.wgId &&
                  !["unofficial", "base", "UD", "Member-SUBM"].includes(t)
                ) {
                  const t =
                      "Document is not associated with a [W3C group](https://respec.org/w3c/groups/). Defaulting to 'base' status.",
                    n = ds`Use the ${"[group]"} configuration option to associated this document with a W3C group.`;
                  ((e.specStatus = "base"), ss(t, Vi, { hint: n }));
                }
            }
          })(e),
          (function (e) {
            const { specStatus: t, wg: n } = e,
              r = [...Ni, ...Ii, ...Pi, ...Di, "ED"].includes(t),
              s = n && n.length && r,
              i = ["Member-SUBM"].includes(t);
            (s || i) &&
              (e.logos.unshift(Ji), "Member-SUBM" === t && e.logos.push(Ki));
          })(e));
      },
    });
    var Xi = String.raw`@keyframes pop{
0%{transform:scale(1,1)}
25%{transform:scale(1.25,1.25);opacity:.75}
100%{transform:scale(1,1)}
}
a.internalDFN{color:inherit;border-bottom:1px solid #99c;text-decoration:none}
a.externalDFN{color:inherit;border-bottom:1px dotted #ccc;text-decoration:none}
a.bibref{text-decoration:none}
.respec-offending-element:target{animation:pop .25s ease-in-out 0s 1}
.respec-offending-element,a[href].respec-offending-element{text-decoration:red wavy underline}
@supports not (text-decoration:red wavy underline){
.respec-offending-element:not(pre){display:inline-block}
.respec-offending-element{background:url(data:image/gif;base64,R0lGODdhBAADAPEAANv///8AAP///wAAACwAAAAABAADAEACBZQjmIAFADs=) bottom repeat-x}
}
#references :target{background:#eaf3ff;animation:pop .4s ease-in-out 0s 1}
cite .bibref{font-style:italic}
a[href].orcid{padding-left:4px;padding-right:4px}
a[href].orcid>svg{margin-bottom:-2px}
ol.tof,ul.tof{list-style:none outside none}
.caption{margin-top:.5em;font-style:italic}
#issue-summary>ul{column-count:2}
#issue-summary li{list-style:none;display:inline-block}
details.respec-tests-details{margin-left:1em;display:inline-block;vertical-align:top}
details.respec-tests-details>*{padding-right:2em}
details.respec-tests-details[open]{z-index:999999;position:absolute;border:thin solid #cad3e2;border-radius:.3em;background-color:#fff;padding-bottom:.5em}
details.respec-tests-details[open]>summary{border-bottom:thin solid #cad3e2;padding-left:1em;margin-bottom:1em;line-height:2em}
details.respec-tests-details>ul{width:100%;margin-top:-.3em}
details.respec-tests-details>li{padding-left:1em}
.self-link:hover{opacity:1;text-decoration:none;background-color:transparent}
aside.example .marker>a.self-link{color:inherit}
.header-wrapper{display:flex;align-items:baseline}
:is(h2,h3,h4,h5,h6):not(#toc>h2,#abstract>h2,#sotd>h2,.head>h2):has(+a.self-link){position:relative;left:-.5em}
:is(h2,h3,h4,h5,h6):not(#toch2)+a.self-link{color:inherit;order:-1;position:relative;left:-1.1em;font-size:1rem;opacity:.5}
:is(h2,h3,h4,h5,h6)+a.self-link::before{content:"§";text-decoration:none;color:var(--heading-text)}
:is(h2,h3)+a.self-link{top:-.2em}
:is(h4,h5,h6)+a.self-link::before{color:#000}
@media (max-width:767px){
dd{margin-left:0}
}
@media print{
.removeOnSave{display:none}
}
body:has(input[name=color-scheme][value=light]:checked),head:not(:has(meta[name=color-scheme][content~=dark]))+body{color-scheme:light}
body:has(input[name=color-scheme][value=dark]:checked){color-scheme:dark}`;
    const Qi = (function () {
      const e = document.createElement("style");
      return (
        (e.id = "respec-mainstyle"),
        (e.textContent = Xi),
        document.head.appendChild(e),
        e
      );
    })();
    var eo = Object.freeze({
      __proto__: null,
      name: "core/style",
      run: function (e) {
        e.noReSpecCSS && Qi.remove();
      },
    });
    function to() {
      const e = document.createElement("script");
      ((e.src = "https://www.w3.org/scripts/TR/2021/fixup.js"),
        location.hash &&
          e.addEventListener(
            "load",
            () => {
              window.location.href = location.hash;
            },
            { once: !0 }
          ),
        document.body.appendChild(e));
    }
    const no = (function () {
      const e = [
          { hint: "preconnect", href: "https://www.w3.org" },
          {
            hint: "preload",
            href: "https://www.w3.org/scripts/TR/2021/fixup.js",
            as: "script",
          },
          { hint: "preload", href: so("base.css").href, as: "style" },
          { hint: "preload", href: so("dark.css").href, as: "style" },
          {
            hint: "preload",
            href: "https://www.w3.org/StyleSheets/TR/2021/logos/W3C",
            as: "image",
            corsMode: "anonymous",
          },
        ],
        t = document.createDocumentFragment();
      for (const n of e.map(Sr)) t.appendChild(n);
      return t;
    })();
    function ro(e) {
      return t => {
        const n = t.querySelector(`head link[href="${e}"]`);
        n && t.querySelector("head")?.append(n);
      };
    }
    function so(e = "base.css") {
      return new URL(`/StyleSheets/TR/2021/${e}`, "https://www.w3.org/");
    }
    (no.appendChild(or`<link
    rel="stylesheet"
    href="https://www.w3.org/StyleSheets/TR/2021/base.css"
    class="removeOnSave"
  />`),
      document.head.querySelector("meta[name=viewport]") ||
        no.prepend(or`<meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />`),
      document.head.prepend(no));
    var io = Object.freeze({
      __proto__: null,
      name: "w3c/style",
      run: function (e) {
        e.noToc || ms("end-all", to, { once: !0 });
        const t = so(
          (function (e) {
            const t = e.specStatus?.toUpperCase() ?? "";
            let n = "";
            const r =
              [...Ni, ...Ii, ...Pi, "ED", "MEMBER-SUBM"].includes(t) && e.wgId;
            switch (t) {
              case "WD":
              case "FPWD":
                n = r ? "W3C-WD" : "base.css";
                break;
              case "CG-DRAFT":
              case "CG-FINAL":
              case "BG-DRAFT":
              case "BG-FINAL":
                n = t.toLowerCase();
                break;
              case "UD":
              case "UNOFFICIAL":
                n = "W3C-UD";
                break;
              case "FINDING":
              case "DRAFT-FINDING":
              case "EDITOR-DRAFT-FINDING":
              case "BASE":
                n = "base.css";
                break;
              case "MEMBER-SUBM":
                n = "W3C-Member-SUBM";
                break;
              default:
                n = r ? `W3C-${e.specStatus}` : "base.css";
            }
            return n;
          })(e)
        );
        (document.head.appendChild(
          or`<link rel="stylesheet" href="${t.href}" />`
        ),
          ms("beforesave", ro(t)));
        let n = document.querySelector("head meta[name=color-scheme]");
        if (
          (n ||
            ((n = or`<meta name="color-scheme" content="light" />`),
            document.head.appendChild(n)),
          n?.content.includes("dark"))
        ) {
          const e = so("dark.css");
          (document.head.appendChild(or`<link
        rel="stylesheet"
        href="${e.href}"
        media="(prefers-color-scheme: dark)"
      />`),
            ms("beforesave", ro(e)));
        }
      },
    });
    const oo = "core/github";
    let ao, co;
    const lo = new Promise((e, t) => {
        ((ao = e),
          (co = e => {
            (ss(e, oo), t(new Error(e)));
          }));
      }),
      uo = Dr({
        en: {
          file_a_bug: "File an issue",
          participate: "Participate:",
          commit_history: "Commit history",
        },
        ko: { participate: "참여" },
        zh: { file_a_bug: "反馈错误", participate: "参与：" },
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
      });
    var po = Object.freeze({
      __proto__: null,
      github: lo,
      name: oo,
      run: async function (e) {
        if (!e.hasOwnProperty("github") || !e.github) return void ao(null);
        if (
          "object" == typeof e.github &&
          !e.github.hasOwnProperty("repoURL")
        ) {
          const e = ds`Config option ${"[github]"} is missing property \`repoURL\`.`;
          return void co(e);
        }
        const t = "string" == typeof e.github ? {} : e.github;
        let n,
          r = t.repoURL || String(e.github);
        r.endsWith("/") || (r += "/");
        try {
          n = new URL(r, "https://github.com");
        } catch {
          const e = ds`${"[github]"} configuration option is not a valid URL? (${r}).`;
          return void co(e);
        }
        if ("https://github.com" !== n.origin) {
          const e = ds`${"[github]"} configuration option must be HTTPS and pointing to GitHub. (${n.href}).`;
          return void co(e);
        }
        const [s, i] = n.pathname.split("/").filter(e => e);
        if (!s || !i) {
          const e = ds`${"[github]"} URL needs a path. For example, "w3c/my-spec".`;
          return void co(e);
        }
        const o = t.branch || "gh-pages",
          a = new URL("./issues/", n).href;
        let c, l;
        if (
          ((c =
            "object" == typeof e.github && e.github.hasOwnProperty("pullsURL")
              ? e.github.pullsURL
              : new URL("./pulls/", n).href),
          c)
        )
          try {
            const e = new URL(c);
            if ("https://github.com" !== e.origin) {
              const e = ds`${"[github.pullsURL]"} must be HTTPS and pointing to GitHub. (${c}).`;
              return void co(e);
            }
            if (!e.pathname.includes("/pulls")) {
              const e = ds`${"[github.pullsURL]"} must point to pull requests. (${c}).`;
              return void co(e);
            }
          } catch {
            const e = ds`${"[github.pullsURL]"} is not a valid URL. (${c}).`;
            return void co(e);
          }
        if (
          ((l =
            "object" == typeof e.github &&
            e.github.hasOwnProperty("commitHistoryURL")
              ? e.github.commitHistoryURL
              : new URL(`./commits/${t.branch ?? ""}`, n.href).href),
          l)
        )
          try {
            const e = new URL(l);
            if ("https://github.com" !== e.origin) {
              const e = ds`${"[github.commitHistoryURL]"} must be HTTPS and pointing to GitHub. (${l}).`;
              return void co(e);
            }
            if (!e.pathname.includes("/commits")) {
              const e = ds`${"[github.commitHistoryURL]"} must point to commits. (${l}).`;
              return void co(e);
            }
          } catch {
            const e = ds`${"[github.commitHistoryURL]"} is not a valid URL. (${l}).`;
            return void co(e);
          }
        const u = {
          edDraftURI: `https://${s.toLowerCase()}.github.io/${i}/`,
          githubToken: void 0,
          githubUser: void 0,
          issueBase: a,
          atRiskBase: a,
          otherLinks: [],
          pullBase: c,
          shortName: i,
        };
        let d = "https://respec.org/github";
        if (e.githubAPI)
          if (new URL(e.githubAPI).hostname === window.parent.location.hostname)
            d = e.githubAPI;
          else {
            is(
              "The `githubAPI` configuration option is private and should not be added manually.",
              oo
            );
          }
        if (!e.excludeGithubLinks) {
          const t = {
            key: uo.participate,
            data: [
              { value: `GitHub ${s}/${i}`, href: n },
              { value: uo.file_a_bug, href: u.issueBase },
              { value: uo.commit_history, href: l },
              { value: "Pull requests", href: c },
            ],
          };
          (e.otherLinks || (e.otherLinks = []), e.otherLinks.unshift(t));
        }
        const p = {
          branch: o,
          repoURL: n.href,
          apiBase: d,
          fullName: `${s}/${i}`,
          issuesURL: a,
          pullsURL: c,
          newIssuesURL: new URL("./new/choose", a).href,
          commitHistoryURL: l,
        };
        ao(p);
        const h = { ...u, ...e, github: p, githubAPI: d };
        Object.assign(e, h);
      },
    });
    class ho {
      constructor(e) {
        ((this.doc = e),
          (this.root = e.createDocumentFragment()),
          (this.stack = [this.root]),
          (this.current = this.root));
      }
      static sectionClasses = new Set(["appendix", "informative", "notoc"]);
      findPosition(e) {
        return parseInt(e.tagName.charAt(1), 10);
      }
      findParent(e) {
        let t;
        for (; e > 0; ) if ((e--, (t = this.stack[e]), t)) return t;
      }
      findHeader({ firstChild: e }) {
        for (; e; ) {
          if (/H[1-6]/.test(e.tagName)) return e;
          e = e.nextSibling;
        }
        return null;
      }
      addHeader(e) {
        const t = this.doc.createElement("section"),
          n = this.findPosition(e);
        (t.appendChild(e),
          this.findParent(n).appendChild(t),
          (this.stack[n] = t),
          (this.stack.length = n + 1),
          (this.current = t),
          this.processHeader(e, t));
      }
      processHeader(e, t) {
        ho.sectionClasses.intersection(new Set(e.classList)).forEach(e => {
          t.classList.add(e);
        });
      }
      addSection(e) {
        const t = this.findHeader(e),
          n = t ? this.findPosition(t) : 1,
          r = this.findParent(n);
        (t && e.removeChild(t),
          e.appendChild(fo(e)),
          t && e.prepend(t),
          r.appendChild(e),
          (this.current = r));
      }
      addElement(e) {
        this.current.appendChild(e);
      }
    }
    function fo(e) {
      const t = new ho(e.ownerDocument);
      for (; e.firstChild; ) {
        const n = e.firstChild;
        switch (n.localName) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            t.addHeader(n);
            break;
          case "section":
            t.addSection(n);
            break;
          default:
            t.addElement(n);
        }
      }
      return t.root;
    }
    function mo(e) {
      const t = fo(e);
      if (
        "section" === t.firstElementChild.localName &&
        "section" === e.localName
      ) {
        const n = t.firstElementChild;
        (n.remove(), e.append(...n.childNodes));
      } else e.textContent = "";
      e.appendChild(t);
    }
    var go = Object.freeze({
      __proto__: null,
      name: "core/sections",
      restructure: mo,
      run: function () {
        mo(document.body);
      },
    });
    const bo = "core/data-include";
    function yo(e, t, n) {
      const r = document.querySelector(`[data-include-id=${t}]`);
      if (!r) return;
      const s = zr(e, r.dataset.oninclude, n),
        i = "string" == typeof r.dataset.includeReplace;
      (!(function (e, t, { replace: n }) {
        const { includeFormat: r } = e.dataset;
        let s = t;
        ("markdown" === r && (s = As(s)),
          "text" === r ? (e.textContent = s) : (e.innerHTML = s),
          "markdown" === r && mo(e),
          n && e.replaceWith(...e.childNodes));
      })(r, s, { replace: i }),
        i ||
          (function (e) {
            [
              "data-include",
              "data-include-format",
              "data-include-replace",
              "data-include-id",
              "oninclude",
            ].forEach(t => e.removeAttribute(t));
          })(r));
    }
    async function wo(e, t) {
      const n = e.querySelectorAll("[data-include]"),
        r = Array.from(n).map(async e => {
          const n = e.dataset.include;
          if (!n) return;
          const r = `include-${String(Math.random()).slice(2)}`;
          e.dataset.includeId = r;
          try {
            const s = await fetch(n);
            (yo(await s.text(), r, n), t < 3 && (await wo(e, t + 1)));
          } catch (t) {
            const r = t;
            ss(`\`data-include\` failed: \`${n}\` (${r.message}).`, bo, {
              elements: [e],
              cause: r,
            });
          }
        });
      await Promise.all(r);
    }
    var ko = Object.freeze({
      __proto__: null,
      name: bo,
      run: async function () {
        await wo(document, 1);
      },
    });
    var vo = Object.freeze({
      __proto__: null,
      name: "core/reindent",
      run: function () {
        for (const e of document.getElementsByTagName("pre"))
          e.innerHTML = ps(e.innerHTML);
      },
    });
    const $o = "core/title",
      xo = Dr({
        en: { default_title: "No Title" },
        de: { default_title: "Kein Titel" },
        zh: { default_title: "无标题" },
        cs: { default_title: "Bez názvu" },
      });
    var Co = Object.freeze({
      __proto__: null,
      name: $o,
      run: function (e) {
        const t =
          document.querySelector("h1#title") || or`<h1 id="title"></h1>`;
        if (t.isConnected && "" === t.textContent.trim()) {
          ss(
            'The document is missing a title, so using a default title. To fix this, please give your document a `<title>`. If you need special markup in the document\'s title, please use a `<h1 id="title">`.',
            $o,
            { title: "Document is missing a title", elements: [t] }
          );
        }
        (t.id || (t.id = "title"),
          t.classList.add("title"),
          (function (e, t) {
            t.isConnected ||
              (t.textContent = document.title || `${xo.default_title}`);
            const n = document.createElement("h1");
            n.innerHTML = t.innerHTML
              .replace(/:<br>/g, ": ")
              .replace(/<br>/g, " - ");
            let r = Ir(n.textContent);
            if (e.isPreview && e.prNumber) {
              const n = e.prUrl || `${e.github.repoURL}pull/${e.prNumber}`,
                { childNodes: s } = or`
      Preview of PR <a href="${n}">#${e.prNumber}</a>:
    `;
              (t.prepend(...s), (r = `Preview of PR #${e.prNumber}: ${r}`));
            }
            ((document.title = r), (e.title = r));
          })(e, t),
          document.body.prepend(t));
      },
    });
    const _o = "w3c/level",
      So = Dr({
        en: { level: "Level" },
        ja: { level: "レベル" },
        nl: { level: "Niveau" },
        de: { level: "Stufe" },
        zh: { level: "级别" },
      });
    var To = Object.freeze({
      __proto__: null,
      name: _o,
      run: function (e) {
        if (!e.hasOwnProperty("level")) return;
        const t = document.querySelector("h1#title"),
          n = parseInt(e.level);
        if (!Number.isInteger(n) || n < 0) {
          ss(
            `The \`level\` configuration option must be a number greater or equal to 0. It is currently set to \`${n}\``,
            _o,
            { title: "Invalid level config.", elements: [t] }
          );
        } else
          (t.append(` ${So.level} ${n}`),
            (document.title = `${document.title} ${So.level} ${n}`),
            (e.shortName = `${e.shortName}-${n}`),
            (e.level = n));
      },
    });
    const Eo = "w3c/abstract",
      Ro = Dr({
        en: { abstract: "Abstract" },
        ko: { abstract: "요약" },
        zh: { abstract: "摘要" },
        ja: { abstract: "要約" },
        nl: { abstract: "Samenvatting" },
        es: { abstract: "Resumen" },
        de: { abstract: "Zusammenfassung" },
        cs: { abstract: "Abstrakt" },
      });
    var Ao = Object.freeze({
      __proto__: null,
      name: Eo,
      run: async function () {
        const e = (function () {
          const e = document.getElementById("abstract");
          if (e)
            switch (e.localName) {
              case "section":
                return e;
              case "div":
                return Gr(e, "section");
              default:
                return (
                  ss("The abstract should be a `<section>` element.", Eo, {
                    elements: [e],
                  }),
                  e
                );
            }
          const t = Ro.abstract.toLocaleLowerCase(i);
          for (const e of document.querySelectorAll("h2, h3, h4, h5, h6"))
            if (Ir(e.textContent).toLocaleLowerCase(i) === t)
              return e.closest("section");
          return e;
        })();
        e
          ? (e.classList.add("introductory"),
            (e.id = "abstract"),
            e.querySelector("h2") || e.prepend(or`<h2>${Ro.abstract}</h2>`))
          : ss('Document must have one `<section id="abstract">`.', Eo);
      },
    });
    var Lo = Object.freeze({
      __proto__: null,
      name: "core/data-transform",
      run: function () {
        document.querySelectorAll("[data-transform]").forEach(e => {
          ((e.innerHTML = zr(e.innerHTML, e.dataset.transform)),
            e.removeAttribute("data-transform"));
        });
      },
    });
    const Po = "core/dfn-abbr";
    function No(e) {
      const t = (n = e).dataset.abbr
        ? n.dataset.abbr
        : (n.textContent
            ?.match(/\b([a-z])/gi)
            ?.join("")
            .toUpperCase() ?? "");
      var n;
      const r = e.textContent.replace(/\s\s+/g, " ").trim(),
        s = document.createElement("abbr");
      ((s.title = r), (s.textContent = t), e.after(" (", s, ")"));
      const i = e.dataset.lt || "";
      e.dataset.lt = i
        .split("|")
        .filter(e => e.trim())
        .concat(t)
        .join("|");
    }
    var Io = Object.freeze({
      __proto__: null,
      name: Po,
      run: function () {
        const e = document.querySelectorAll("[data-abbr]");
        for (const t of e) {
          const { localName: e } = t;
          if ("dfn" === e) No(t);
          else {
            ss(
              `\`data-abbr\` attribute not supported on \`${e}\` elements.`,
              Po,
              { elements: [t], title: "Error: unsupported." }
            );
          }
        }
      },
    });
    var Do = String.raw`:root{--assertion-border:#aaa;--assertion-bg:#eee;--assertion-text:black}
.assert{border-left:.5em solid #aaa;padding:.3em;border-color:#aaa;border-color:var(--assertion-border);background:#eee;background:var(--assertion-bg);color:#000;color:var(--assertion-text)}
@media (prefers-color-scheme:dark){
:root{--assertion-border:#444;--assertion-bg:var(--borderedblock-bg);--assertion-text:var(--text)}
}`;
    var Oo = Object.freeze({
      __proto__: null,
      name: "core/algorithms",
      run: function () {
        const e = Array.from(
          document.querySelectorAll("ol.algorithm li")
        ).filter(e => e.textContent.trim().startsWith("Assert: "));
        if (!e.length) return;
        for (const t of e) {
          t.classList.add("assert");
          const e = t.firstChild;
          e instanceof Text &&
            e.textContent.startsWith("Assert: ") &&
            ((e.textContent = e.textContent.replace("Assert: ", "")),
            t.prepend(or`<a data-cite="INFRA#assert">Assert</a>`, ": "));
        }
        const t = document.createElement("style");
        ((t.textContent = Do), document.head.appendChild(t));
      },
    });
    const jo = /^[a-z]+(\s+[a-z]+)+\??$/,
      zo = /\B"([^"]*)"\B/,
      Mo = /^(\w+)\(([^\\)]*)\)(?:\|(\w+)(?:\((?:([^\\)]*))\))?)?$/,
      qo = /\[\[(\w+(?: +\w+)*)\]\](\([^)]*\))?$/,
      Uo = /^((?:\[\[)?(?:\w+(?: +\w+)*)(?:\]\])?)$/,
      Wo = /^(?:\w+)\??$/,
      Fo = /^(\w+)\["([\w- ]*)"\]$/,
      Bo = /\.?(\w+\(.*\)$)/,
      Ho = /\/(.+)/,
      Go = /\[\[.+\]\]/;
    function Vo(e) {
      const { identifier: t, renderParent: n, nullable: r } = e;
      if (n)
        return or`<a
      data-xref-type="_IDL_"
      data-link-type="idl"
      data-lt="${t}"
      ><code>${t + (r ? "?" : "")}</code></a
    >`;
    }
    function Jo(e) {
      const {
          identifier: t,
          parent: n,
          slotType: r,
          renderParent: s,
          args: i,
        } = e,
        { identifier: o } = n || {},
        a = "method" === r,
        c = i ?? [],
        l = a ? or`(${qr(c, Ko)})` : null,
        u = a ? `(${c.join(", ")})` : "";
      return or`${n && s ? "." : ""}<a
      data-xref-type="${r}"
      data-link-type="${r}"
      data-link-for="${o}"
      data-xref-for="${o}"
      data-lt="${`[[${t}]]${u}`}"
      ><code>[[${t}]]${l}</code></a
    >`;
    }
    function Ko(e, t, n) {
      if (t < n.length - 1) return or`<var>${e}</var>`;
      const r = e.split(/(^\.{3})(.+)/),
        s = r.length > 1,
        i = s ? r[2] : r[0];
      return or`${s ? "..." : null}<var>${i}</var>`;
    }
    function Yo(e) {
      const { parent: t, identifier: n, renderParent: r } = e,
        { identifier: s } = t || {};
      return or`${r ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="attribute|dict-member|const"
      data-link-for="${s}"
      data-xref-for="${s}"
      ><code>${n}</code></a
    >`;
    }
    function Zo(e) {
      const { args: t, identifier: n, type: r, parent: s, renderParent: i } = e,
        { renderText: o, renderArgs: a } = e,
        { identifier: c } = s || {},
        l = qr(a || t, Ko),
        u = `${n}(${t.join(", ")})`;
      return or`${s && i ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="${r}"
      data-link-for="${c}"
      data-xref-for="${c}"
      data-lt="${u}"
      ><code>${o || n}</code></a
    >${!o || a ? or`<code>(${l})</code>` : ""}`;
    }
    function Xo(e) {
      const { identifier: t, enumValue: n, parent: r } = e,
        s = r ? r.identifier : t;
      return or`"<a
      data-link-type="idl"
      data-xref-type="enum-value"
      data-link-for="${s}"
      data-xref-for="${s}"
      data-lt="${n ? null : "the-empty-string"}"
      ><code>${n}</code></a
    >"`;
    }
    function Qo(e) {
      const { identifier: t } = e;
      return or`"<a
      data-link-type="idl"
      data-cite="webidl"
      data-xref-type="exception"
      ><code>${t}</code></a
    >"`;
    }
    function ea(e) {
      const { identifier: t, nullable: n } = e;
      return or`<a
    data-link-type="idl"
    data-cite="webidl"
    data-xref-type="interface"
    data-lt="${t}"
    ><code>${t + (n ? "?" : "")}</code></a
  >`;
    }
    function ta(e) {
      let t;
      try {
        t = (function (e) {
          const t = Go.test(e),
            n = t ? Ho : Bo,
            [r, s] = e.split(n);
          if (t && r && !s)
            throw new SyntaxError(
              `Internal slot missing "for" part. Expected \`{{ InterfaceName/${r}}}\` }.`
            );
          const i = r
              .split(/[./]/)
              .concat(s)
              .filter(e => e && e.trim())
              .map(e => e.trim()),
            o = !e.includes("/"),
            a = [];
          for (; i.length; ) {
            const t = i.pop() ?? "";
            if (Mo.test(t)) {
              const [, e, n, r, s] = t.match(Mo),
                i = (n ?? "").split(/,\s*/).filter(e => e),
                c = r?.trim(),
                l = s?.split(/,\s*/).filter(e => e);
              a.push({
                type: "method",
                identifier: e ?? "",
                args: i,
                renderParent: o,
                renderText: c,
                renderArgs: l,
              });
            } else if (Fo.test(t)) {
              const [, e, n] = t.match(Fo);
              a.push({
                type: "enum",
                identifier: e ?? "",
                enumValue: n ?? "",
                renderParent: o,
              });
            } else if (zo.test(t)) {
              const [, e] = t.match(zo);
              o
                ? a.push({ type: "exception", identifier: e ?? "" })
                : a.push({ type: "enum", enumValue: e ?? "", renderParent: o });
            } else if (qo.test(t)) {
              const [, e, n] = t.match(qo),
                r = n ? "method" : "attribute",
                s =
                  n
                    ?.slice(1, -1)
                    .split(/,\s*/)
                    .filter(e => e) ?? [];
              a.push({
                type: "internal-slot",
                slotType: r,
                identifier: e ?? "",
                args: s,
                renderParent: o,
              });
            } else if (Uo.test(t) && i.length) {
              const [, e] = t.match(Uo);
              a.push({
                type: "attribute",
                identifier: e ?? "",
                renderParent: o,
              });
            } else if (jo.test(t)) {
              const e = t.endsWith("?"),
                n = e ? t.slice(0, -1) : t;
              a.push({
                type: "idl-primitive",
                identifier: n,
                renderParent: o,
                nullable: e,
              });
            } else {
              if (!Wo.test(t) || 0 !== i.length)
                throw new SyntaxError(
                  `IDL micro-syntax parsing error in \`{{ ${e} }}\``
                );
              {
                const e = t.endsWith("?"),
                  n = e ? t.slice(0, -1) : t;
                a.push({
                  type: "base",
                  identifier: n,
                  renderParent: o,
                  nullable: e,
                });
              }
            }
          }
          return (
            a.forEach((e, t, n) => {
              e.parent = n[t + 1] || null;
            }),
            a.reverse()
          );
        })(e);
      } catch (t) {
        const n = or`<span>{{ ${e} }}</span>`,
          r = "Error: Invalid inline IDL string.";
        return (ss(t.message, "core/inlines", { title: r, elements: [n] }), n);
      }
      const n = or(document.createDocumentFragment()),
        r = [];
      for (const e of t)
        switch (e.type) {
          case "base": {
            const t = Vo(e);
            t && r.push(t);
            break;
          }
          case "attribute":
            r.push(Yo(e));
            break;
          case "internal-slot":
            r.push(Jo(e));
            break;
          case "method":
            r.push(Zo(e));
            break;
          case "enum":
            r.push(Xo(e));
            break;
          case "exception":
            r.push(Qo(e));
            break;
          case "idl-primitive":
            r.push(ea(e));
            break;
          default:
            throw new Error("Unknown type.");
        }
      return n`${r}`;
    }
    const na = new Set(["alias", "reference"]),
      ra = (async function () {
        const e = await ar.openDB("respec-biblio2", 12, {
            upgrade(e) {
              Array.from(e.objectStoreNames).map(t => e.deleteObjectStore(t));
              (e
                .createObjectStore("alias", { keyPath: "id" })
                .createIndex("aliasOf", "aliasOf", { unique: !1 }),
                e.createObjectStore("reference", { keyPath: "id" }));
            },
          }),
          t = Date.now();
        for (const n of [...na]) {
          const r = e.transaction(n, "readwrite").store,
            s = IDBKeyRange.lowerBound(t);
          let i = await r.openCursor(s);
          for (; i?.value; ) {
            const e = i.value;
            ((void 0 === e.expires || e.expires < t) && (await r.delete(e.id)),
              (i = await i.continue()));
          }
        }
        return e;
      })();
    const sa = {
        get ready() {
          return ra;
        },
        async find(e) {
          return (
            (await this.isAlias(e)) && (e = (await this.resolveAlias(e)) ?? e),
            await this.get("reference", e)
          );
        },
        async has(e, t) {
          if (!na.has(e)) throw new TypeError(`Invalid type: ${e}`);
          if (!t) throw new TypeError("id is required");
          const n = (await this.ready).transaction(e, "readonly").store,
            r = IDBKeyRange.only(t);
          return !!(await n.openCursor(r));
        },
        async isAlias(e) {
          return await this.has("alias", e);
        },
        async resolveAlias(e) {
          if (!e) throw new TypeError("id is required");
          const t = (await this.ready).transaction("alias", "readonly").store,
            n = IDBKeyRange.only(e),
            r = await t.openCursor(n);
          return r ? r.value.aliasOf : null;
        },
        async get(e, t) {
          if (!na.has(e)) throw new TypeError(`Invalid type: ${e}`);
          if (!t) throw new TypeError("id is required");
          const n = (await this.ready).transaction(e, "readonly").store,
            r = IDBKeyRange.only(t),
            s = await n.openCursor(r);
          return s ? s.value : null;
        },
        async addAll(e, t) {
          if (!e) return;
          const n = { alias: [], reference: [] };
          for (const r of Object.keys(e)) {
            const s = { id: r, ...e[r], expires: t };
            s.aliasOf ? n.alias.push(s) : n.reference.push(s);
          }
          const r = [...na].flatMap(e => n[e].map(t => this.add(e, t)));
          await Promise.all(r);
        },
        async add(e, t) {
          if (!na.has(e)) throw new TypeError(`Invalid type: ${e}`);
          if ("object" != typeof t)
            throw new TypeError("details should be an object");
          if ("alias" === e && !t.hasOwnProperty("aliasOf"))
            throw new TypeError("Invalid alias object.");
          const n = await this.ready;
          let r = await this.has(e, t.id);
          if (r) {
            const s = await this.get(e, t.id);
            if (s && void 0 !== s.expires && s.expires < Date.now()) {
              const { store: s } = n.transaction(e, "readwrite");
              (await s.delete(t.id), (r = !1));
            }
          }
          const { store: s } = n.transaction(e, "readwrite");
          return r ? await s.put(t) : await s.add(t);
        },
        async close() {
          (await this.ready).close();
        },
        async clear() {
          const e = await this.ready,
            t = [...na],
            n = e.transaction(t, "readwrite"),
            r = t.map(e => n.objectStore(e).clear());
          await Promise.all(r);
        },
      },
      ia = {},
      oa = new URL("https://api.specref.org/bibrefs?refs="),
      aa = Sr({ hint: "dns-prefetch", href: oa.origin });
    let ca;
    document.head.appendChild(aa);
    const la = new Promise(e => {
      ca = e;
    });
    async function ua(e, t = { forceUpdate: !1 }) {
      const n = [...new Set(e)].filter(e => e.trim());
      if (!n.length || !1 === navigator.onLine) return null;
      let r;
      try {
        r = await fetch(oa.href + n.join(","));
      } catch (e) {
        return (console.error(e), null);
      }
      if ((!t.forceUpdate && !r.ok) || 200 !== r.status) return null;
      const s = await r.json(),
        i = Date.now() + 36e5;
      try {
        const e = Date.parse(r.headers.get("Expires") || ""),
          t = Number.isNaN(e) ? i : Math.min(e, i);
        await sa.addAll(s, t);
      } catch (e) {
        console.error(e);
      }
      return s;
    }
    async function da(e) {
      const t = await la;
      if (!t.hasOwnProperty(e)) return null;
      const n = t[e];
      return n.aliasOf ? await da(n.aliasOf) : n;
    }
    var pa = Object.freeze({
      __proto__: null,
      Plugin: class {
        constructor(e) {
          this.conf = e;
        }
        normalizeReferences() {
          const e = new Set(
            [...this.conf.normativeReferences].map(e => e.toLowerCase())
          );
          Array.from(this.conf.informativeReferences)
            .filter(t => e.has(t.toLowerCase()))
            .forEach(e => this.conf.informativeReferences.delete(e));
        }
        getRefKeys() {
          return {
            informativeReferences: Array.from(this.conf.informativeReferences),
            normativeReferences: Array.from(this.conf.normativeReferences),
          };
        }
        async run() {
          (this.conf.localBiblio || (this.conf.localBiblio = {}),
            (this.conf.biblio = ia));
          const e = Object.keys(this.conf.localBiblio)
            .filter(e => this.conf.localBiblio?.[e]?.hasOwnProperty("aliasOf"))
            .map(e => this.conf.localBiblio?.[e]?.aliasOf)
            .filter(e => e && !this.conf.localBiblio?.hasOwnProperty(e));
          this.normalizeReferences();
          const t = this.getRefKeys(),
            n = Array.from(
              new Set(
                t.normativeReferences
                  .concat(t.informativeReferences)
                  .filter(e => !this.conf.localBiblio?.hasOwnProperty(e))
                  .concat(e.filter(Boolean))
                  .sort()
              )
            ),
            r = n.length
              ? await (async function (e) {
                  const t = [];
                  try {
                    await sa.ready;
                    const n = e.map(async e => ({
                      id: e,
                      data: await sa.find(e),
                    }));
                    t.push(...(await Promise.all(n)));
                  } catch (n) {
                    (t.push(...e.map(e => ({ id: e, data: null }))),
                      console.warn(n));
                  }
                  return t;
                })(n)
              : [],
            s = { hasData: [], noData: [] };
          (r.forEach(e => {
            (e.data ? s.hasData : s.noData).push(e);
          }),
            s.hasData.forEach(e => {
              e.data && (ia[e.id] = e.data);
            }));
          const i = s.noData.map(e => e.id);
          if (i.length) {
            const e = await ua(i, { forceUpdate: !0 });
            Object.assign(ia, e);
          }
          (Object.assign(ia, this.conf.localBiblio),
            (() => {
              ca(this.conf.biblio);
            })());
        }
      },
      biblio: ia,
      name: "core/biblio",
      resolveRef: da,
      updateFromNetwork: ua,
    });
    const ha = "core/render-biblio";
    function fa(e) {
      return `bib-${Fr(e)}`;
    }
    const ma = Dr({
        en: {
          info_references: "Informative references",
          norm_references: "Normative references",
          references: "References",
          reference_not_found: "Reference not found.",
        },
        ko: { references: "참조" },
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
        cs: {
          info_references: "Informativní odkazy",
          norm_references: "Normativní odkazy",
          references: "Odkazy",
          reference_not_found: "Odkaz nebyl nalezen.",
        },
      }),
      ga = new Map([
        ["CR", "W3C Candidate Recommendation"],
        ["ED", "W3C Editor's Draft"],
        ["LCWD", "W3C Last Call Working Draft"],
        ["NOTE", "W3C Working Group Note"],
        ["PR", "W3C Proposed Recommendation"],
        ["REC", "W3C Recommendation"],
        ["WD", "W3C Working Draft"],
      ]),
      ba =
        ((ya = "."),
        e => {
          const t = e.trim();
          return !t || t.endsWith(ya) ? t : t + ya;
        });
    var ya;
    function wa(e, t) {
      const { goodRefs: n, badRefs: r } = (function (e) {
          const t = [],
            n = [];
          for (const r of e) r.refcontent ? t.push(r) : n.push(r);
          return { goodRefs: t, badRefs: n };
        })(e.map(ka)),
        s = (function (e) {
          const t = new Map();
          for (const n of e)
            t.has(n.refcontent?.id ?? "") || t.set(n.refcontent?.id ?? "", n);
          return [...t.values()];
        })(n),
        i = s
          .concat(r)
          .sort((e, t) =>
            e.ref.toLocaleLowerCase().localeCompare(t.ref.toLocaleLowerCase())
          ),
        o = or`<section>
    <h3>${t}</h3>
    <dl class="bibliography">${i.map($a)}</dl>
  </section>`;
      Br(o, "", t);
      const a = (function (e) {
        const t = new Map();
        for (const n of e) {
          const e = n.refcontent?.id ?? "",
            r = t.has(e) ? t.get(e) : t.set(e, []).get(e);
          r?.push(n.ref);
        }
        return t;
      })(n);
      return (
        (function (e, t) {
          e.map(({ ref: e, refcontent: n }) => {
            const r = `#${fa(e)}`,
              s = (t.get(n.id ?? "") ?? [])
                .map(e => `a.bibref[href="#${fa(e)}"]`)
                .join(",");
            return {
              refUrl: r,
              elems: document.querySelectorAll(s),
              refcontent: n,
            };
          }).forEach(({ refUrl: e, elems: t, refcontent: n }) => {
            t.forEach(t => {
              (t.setAttribute("href", e),
                t.setAttribute("title", n.title),
                (t.dataset.linkType = "biblio"));
            });
          });
        })(s, a),
        (function (e) {
          for (const { ref: t } of e) {
            const e = [
              ...document.querySelectorAll(`a.bibref[href="#${fa(t)}"]`),
            ].filter(
              ({ textContent: e }) => e.toLowerCase() === t.toLowerCase()
            );
            ss(`Reference "[${t}]" not found.`, ha, {
              hint: `Search for ["${t}"](https://www.specref.org?q=${t}) on Specref to see if it exists or if it's misspelled.`,
              elements: e,
            });
          }
        })(r),
        o
      );
    }
    function ka(e) {
      let t = ia[e],
        n = e;
      const r = new Set([n]);
      for (; t && t.aliasOf; )
        if (r.has(t.aliasOf)) {
          t = null;
          ss(
            `Circular reference in biblio DB between [\`${e}\`] and [\`${n}\`].`,
            ha
          );
        } else ((n = t.aliasOf), (t = ia[n]), r.add(n));
      return (
        t && !t.id && (t.id = e.toLowerCase()),
        { ref: e, refcontent: t }
      );
    }
    function va(e, t) {
      const n = e.replace(/^(!|\?)/, ""),
        r = `#${fa(n)}`,
        s = or`<cite
    ><a class="bibref" href="${r}" data-link-type="biblio">${t || n}</a></cite
  >`;
      return t ? s : or`[${s}]`;
    }
    function $a(e) {
      const { ref: t, refcontent: n } = e,
        r = fa(t);
      return or`
    <dt id="${r}">[${t}]</dt>
    <dd>
      ${
        n
          ? { html: xa(n) }
          : or`<em class="respec-offending-element"
            >${ma.reference_not_found}</em
          >`
      }
    </dd>
  `;
    }
    function xa(e) {
      if ("string" == typeof e) return e;
      let t = `<cite>${e.title}</cite>`;
      if (
        ((t = e.href ? `<a href="${e.href}">${t}</a>. ` : `${t}. `), e.authors)
      ) {
        if (!Array.isArray(e.authors)) {
          const t = `The "authors" field in reference "${e.id || e.title}" must be an array.`,
            n = `Use \`authors: [${JSON.stringify(e.authors)}]\` instead of \`authors: ${JSON.stringify(e.authors)}\`.`;
          (ss(t, ha, { hint: n }), (e.authors = [e.authors]));
        }
        e.authors.length &&
          ((t += e.authors.join("; ")),
          e.etAl && (t += " et al"),
          t.endsWith(".") || (t += ". "));
      }
      return (
        e.publisher && (t = `${t} ${ba(e.publisher)} `),
        e.date && (t += `${e.date}. `),
        e.status && (t += `${ga.get(e.status) || e.status}. `),
        e.href && (t += `URL: <a href="${e.href}">${e.href}</a>`),
        t
      );
    }
    var Ca = Object.freeze({
      __proto__: null,
      name: ha,
      renderInlineCitation: va,
      run: function (e) {
        const t = Array.from(e.informativeReferences),
          n = Array.from(e.normativeReferences);
        if (!t.length && !n.length) return;
        const r =
          document.querySelector("section#references") ||
          or`<section id="references"></section>`;
        if (
          (document.querySelector("section#references > :is(h2, h1)") ||
            r.prepend(or`<h1>${ma.references}</h1>`),
          r.classList.add("appendix"),
          n.length)
        ) {
          const e = wa(n, ma.norm_references);
          r.appendChild(e);
        }
        if (t.length) {
          const e = wa(t, ma.info_references);
          r.appendChild(e);
        }
        document.body.appendChild(r);
      },
    });
    const _a = "core/inlines",
      Sa = {},
      Ta = e => new RegExp(e.map(e => e.source).join("|")),
      Ea = Dr({
        en: {
          rfc2119Keywords: () =>
            Ta([
              /\bMUST(?:\s+NOT)?\b/,
              /\bSHOULD(?:\s+NOT)?\b/,
              /\bSHALL(?:\s+NOT)?\b/,
              /\bMAY\b/,
              /\b(?:NOT\s+)?REQUIRED\b/,
              /\b(?:NOT\s+)?RECOMMENDED\b/,
              /\bOPTIONAL\b/,
            ]),
        },
        de: {
          rfc2119Keywords: () =>
            Ta([
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
            ]),
        },
      }),
      Ra = /(?:`[^`]+`)(?!`)/,
      Aa = /(?:{{[^}]+\?*}})/,
      La = /\B\|\w[\w\s]*(?:\s*:[\w\s&;"?<>]+\??)?\|\B/,
      Pa = /(?:\[\[(?:!|\\|\?)?[\w.-]+(?:|[^\]]+)?\]\])/,
      Na = /(?:\[\[\[(?:!|\\|\?)?#?[\w-.]+\]\]\])/,
      Ia = /(?:\[=[^=]+=\])/,
      Da = /(?:\[\^[^^]+\^\])/,
      Oa = /(?:\{\^[^}^]+\^\})/;
    function ja(e) {
      const t = e.slice(2, -2).trim(),
        [n, r, s] = t
          .split("/", 3)
          .map(e => e && e.trim())
          .filter(e => !!e),
        [i, o, a] = t.startsWith("/")
          ? ["element-attr", null, n]
          : s
            ? ["attr-value", `${n}/${r}`, s]
            : r
              ? ["element-attr", n, r]
              : ["element", null, n];
      return or`<code
    ><a
      data-xref-type="${i}"
      data-xref-for="${o}"
      data-link-type="${i}"
      data-link-for="${o}"
      >${a}</a
    ></code
  >`;
    }
    function za(e) {
      const t = (
        e
          .slice(2, -2)
          .trim()
          .match(/"([^"]*)"|([^/]+)/g) || []
      ).map(e => e.trim());
      if (1 === t.length) {
        const e = t[0];
        return or`<code
      ><a data-link-type="cddl-type" data-xref-type="cddl-type"
        >${e}</a
      ></code
    >`;
      }
      const n = t[0],
        r = t[1],
        s = r.startsWith('"') && r.endsWith('"') ? "cddl-value" : "cddl-key";
      return or`<code
    ><a
      data-link-type="${s}"
      data-xref-type="${s}"
      data-xref-for="${n}"
      data-link-for="${n}"
      >${r}</a
    ></code
  >`;
    }
    function Ma(e) {
      const t = Ir(e),
        n = or`<em class="rfc2119">${t}</em>`;
      return ((Sa[t] = !0), n);
    }
    function qa(e) {
      const t = e.slice(3, -3).trim();
      return t.startsWith("#")
        ? or`<a href="${t}" data-matched-text="${e}"></a>`
        : or`<a data-cite="${t}" data-matched-text="${e}"></a>`;
    }
    function Ua(e, t) {
      const n = Ir(e.slice(2, -2));
      if (n.startsWith("\\")) return e.replace(/^(\{\{\s*)\\/, "$1");
      const r = ta(n);
      return !!t.parentElement?.closest("dfn,a")
        ? Ga(`\`${r.textContent}\``)
        : r;
    }
    function Wa(e, t, n) {
      const r = e.slice(2, -2);
      if (r.startsWith("\\")) return [`[[${r.slice(1)}]]`];
      const [s, i] = r.split("|").map(Ir),
        { type: o, illegal: a } = Vr(s, t.parentElement),
        c = va(s, i),
        l = s.replace(/^(!|\?)/, "");
      if (a && !n.normativeReferences.has(l)) {
        const e = c.childNodes[1] || c;
        is(
          "Normative references in informative sections are not allowed. ",
          _a,
          {
            elements: [e],
            hint: `Remove '!' from the start of the reference \`[[${r}]]\``,
          }
        );
      }
      return (
        "informative" !== o || a
          ? n.normativeReferences.add(l)
          : n.informativeReferences.add(l),
        c.childNodes[1] ? c.childNodes : [c]
      );
    }
    function Fa(e, t, n) {
      return "ABBR" === t.parentElement?.tagName
        ? e
        : or`<abbr title="${n.get(e)}">${e}</abbr>`;
    }
    function Ba(e) {
      const t = e.slice(1, -1).split(":", 2),
        [n, r] = t.map(e => e.trim());
      return or`<var data-type="${r}">${n}</var>`;
    }
    function Ha(e) {
      const t = (function (e) {
          const t = e => e.replace("%%", "/").split("/").map(Ir).join("/"),
            n = e.replace("\\/", "%%"),
            r = n.lastIndexOf("/");
          if (-1 === r) return [t(n)];
          const s = n.substring(0, r),
            i = n.substring(r + 1, n.length);
          return [t(s), t(i)];
        })((e = e.slice(2, -2))),
        [n, r] = 2 === t.length ? t : [null, t[0]],
        [s, i] = r.includes("|")
          ? r.split("|", 2).map(e => e.trim())
          : [null, r],
        o = Va(i),
        a = n ? Ir(n) : null;
      return or`<a
    data-link-type="dfn|abstract-op"
    data-link-for="${a}"
    data-xref-for="${a}"
    data-lt="${s}"
    >${o}</a
  >`;
    }
    function Ga(e) {
      const t = e.slice(1, -1);
      return or`<code>${t}</code>`;
    }
    function Va(e) {
      return Ra.test(e)
        ? e
            .split(/(`[^`]+`)(?!`)/)
            .map(e => (e.startsWith("`") ? Ga(e) : Va(e)))
        : document.createTextNode(e);
    }
    var Ja = Object.freeze({
      __proto__: null,
      name: _a,
      rfc2119Usage: Sa,
      run: function (e) {
        const t = new Map();
        (document.normalize(),
          document.querySelector("section#conformance") ||
            document.body.classList.add("informative"),
          (e.normativeReferences = new Xr()),
          (e.informativeReferences = new Xr()),
          e.respecRFC2119 || (e.respecRFC2119 = Sa));
        const n = document.querySelectorAll("abbr[title]:not(.exclude)");
        for (const { textContent: e, title: r } of n) {
          const n = Ir(e),
            s = Ir(r);
          t.set(n, s);
        }
        const r = t.size
            ? new RegExp(
                `(?:\\b${[...t.keys()].map(e => vr(e)).join("\\b)|(?:\\b")}\\b)`
              )
            : null,
          s = (function (e, t = [], n = { wsNodes: !0 }) {
            const r = t.join(", "),
              s = document.createNodeIterator(e, NodeFilter.SHOW_TEXT, {
                acceptNode: e =>
                  n.wsNodes || e.data.trim()
                    ? r && e.parentElement?.closest(r)
                      ? NodeFilter.FILTER_REJECT
                      : NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT,
              }),
              i = [];
            let o;
            for (; (o = s.nextNode()); ) i.push(o);
            return i;
          })(
            document.body,
            ["#respec-ui", ".head", "pre", "svg", "script", "style"],
            { wsNodes: !1 }
          ),
          i = Ea.rfc2119Keywords(),
          o = new RegExp(
            `(${Ta([i, Aa, Oa, La, Pa, Na, Ia, Ra, Da, ...(r ? [r] : [])]).source})`
          );
        for (const n of s) {
          const r = n.data.split(o);
          if (1 === r.length) continue;
          const s = document.createDocumentFragment();
          let a = !0;
          for (const o of r)
            if (((a = !a), a))
              switch (!0) {
                case o.startsWith("{{"):
                  s.append(Ua(o, n));
                  break;
                case o.startsWith("{^"):
                  s.append(za(o));
                  break;
                case o.startsWith("[[["):
                  s.append(qa(o));
                  break;
                case o.startsWith("[["):
                  s.append(...Wa(o, n, e));
                  break;
                case o.startsWith("|"):
                  s.append(Ba(o));
                  break;
                case o.startsWith("[="):
                  s.append(Ha(o));
                  break;
                case o.startsWith("`"):
                  s.append(Ga(o));
                  break;
                case o.startsWith("[^"):
                  s.append(ja(o));
                  break;
                case t.has(o):
                  s.append(Fa(o, n, t));
                  break;
                case i.test(o):
                  s.append(Ma(o));
              }
            else s.append(o);
          n.replaceWith(s);
        }
      },
    });
    const Ka = "w3c/conformance",
      Ya = Dr({
        en: {
          conformance: "Conformance",
          normativity:
            "As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.",
          keywordInterpretation: (e, t) => or`<p>
        The key word${t ? "s" : ""} ${e} in this document
        ${t ? "are" : "is"} to be interpreted as described in
        <a href="https://www.rfc-editor.org/info/bcp14">BCP 14</a>
        ${va("RFC2119")} ${va("RFC8174")}
        when, and only when, ${t ? "they appear" : "it appears"} in all
        capitals, as shown here.
      </p>`,
        },
        de: {
          conformance: "Anforderungen",
          normativity:
            "Neben den explizit als nicht-normativ gekennzeichneten Abschnitten sind auch alle Diagramme, Beispiele und Hinweise in diesem Dokument nicht normativ. Alle anderen Angaben sind normativ.",
          keywordInterpretation: (e, t) => or`<p>
        ${t ? "Die Schlüsselwörter" : "Das Schlüsselwort"} ${e} in
        diesem Dokument ${t ? "sind" : "ist"} gemäß
        <a href="https://www.rfc-editor.org/info/bcp14">BCP 14</a>
        ${va("RFC2119")} ${va("RFC8174")}
        und unter Berücksichtigung von
        <a href="https://github.com/adfinis-sygroup/2119/blob/master/2119de.rst"
          >2119de</a
        >
        zu interpretieren, wenn und nur wenn ${t ? "sie" : "es"} wie hier
        gezeigt durchgehend groß geschrieben wurde${t ? "n" : ""}.
      </p>`,
        },
      });
    var Za = Object.freeze({
      __proto__: null,
      name: Ka,
      run: function (e) {
        const t = document.querySelector("section#conformance");
        if (
          (t &&
            !t.classList.contains("override") &&
            (function (e, t) {
              const n = [...Object.keys(Sa)];
              n.length &&
                (t.normativeReferences.add("RFC2119"),
                t.normativeReferences.add("RFC8174"));
              const r = Ur(n.sort(), e => or`<em class="rfc2119">${e}</em>`),
                s = n.length > 1,
                i = or`
    <h1>${Ya.conformance}</h1>
    <p>${Ya.normativity}</p>
    ${n.length ? Ya.keywordInterpretation(r, s) : null}
  `;
              e.prepend(...i.childNodes);
            })(t, e),
          !t && Object.keys(Sa).length)
        ) {
          is(
            "Document uses RFC2119 keywords but lacks a conformance section.",
            Ka,
            { hint: 'Please add a `<section id="conformance">`.' }
          );
        }
      },
    });
    function Xa(e, t, n, r) {
      try {
        switch (t) {
          case "element-attr":
            return (document.createAttribute(e), !0);
          case "element":
            return (document.createElement(e), !0);
        }
      } catch (s) {
        ss(`Invalid ${t} name "${e}": ${s.message}`, r, {
          hint: `Check that the ${t} name is allowed per the XML's Name production for ${t}.`,
          elements: [n],
        });
      }
      return !1;
    }
    function Qa(e, t, n, r) {
      if (/^[a-z]+(-[a-z]+)*$/i.test(e)) return !0;
      return (
        ss(`Invalid ${t} name "${e}".`, r, {
          hint: `Check that the ${t} name is allowed per the naming rules for this type.`,
          elements: [n],
        }),
        !1
      );
    }
    const ec = new ns();
    function tc(e, t) {
      for (const n of t) (ec.has(n) || ec.set(n, new Set()), ec.get(n)?.add(e));
    }
    const nc = "core/dfn",
      rc = new Map([
        ["abstract-op", { requiresFor: !1 }],
        [
          "attr-value",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: Qa,
          },
        ],
        ["element", { requiresFor: !1, validator: Xa }],
        ["element-attr", { requiresFor: !1, validator: Xa }],
        [
          "element-state",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: Qa,
          },
        ],
        ["event", { requiresFor: !1, validator: Qa }],
        ["http-header", { requiresFor: !1 }],
        [
          "media-type",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              try {
                const t = new lr(e);
                if (t.toString() !== e)
                  throw new Error(
                    `Input doesn't match its canonical form: "${t}".`
                  );
              } catch (s) {
                return (
                  ss(`Invalid ${t} "${e}": ${s.message}.`, r, {
                    hint: "Check that the MIME type has both a type and a sub-type, and that it's in a canonical form (e.g., `text/plain`).",
                    elements: [n],
                  }),
                  !1
                );
              }
              return !0;
            },
          },
        ],
        ["scheme", { requiresFor: !1, validator: Qa }],
        [
          "permission",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              return e.startsWith('"') && e.endsWith('"')
                ? Qa(e.slice(1, -1), t, n, r)
                : (ss(`Invalid ${t} "${e}".`, r, {
                    hint: `Check that the ${t} is quoted with double quotes.`,
                    elements: [n],
                  }),
                  !1);
            },
          },
        ],
      ]),
      sc = [...rc.keys()];
    function ic(e, t) {
      let n = "";
      switch (!0) {
        case sc.some(t => e.classList.contains(t)):
          ((n = [...e.classList].find(e => rc.has(e)) ?? ""),
            (function (e, t, n) {
              const r = rc.get(t);
              if (r?.requiresFor && !n.dataset.dfnFor) {
                const e = ds`Definition of type "\`${t}\`" requires a ${"[data-dfn-for]"} attribute.`,
                  { associateWith: s } = r,
                  i = ds`Use a ${"[data-dfn-for]"} attribute to associate this with ${s ?? ""}.`;
                ss(e, nc, { hint: i, elements: [n] });
              }
              r?.validator && r.validator(e, t, n, nc);
            })(t, n, e));
          break;
        case qo.test(t):
          n = (function (e, t) {
            t.dataset.hasOwnProperty("idl") || (t.dataset.idl = "");
            const n = t.closest("[data-dfn-for]");
            t !== n &&
              n?.dataset.dfnFor &&
              (t.dataset.dfnFor = n.dataset.dfnFor);
            if (!t.dataset.dfnFor) {
              const n = ds`Use a ${"[data-dfn-for]"} attribute to associate this dfn with a WebIDL interface.`;
              ss(
                `Internal slot "${e}" must be associated with a WebIDL interface.`,
                nc,
                { hint: n, elements: [t] }
              );
            }
            t.matches(".export, [data-export]") || (t.dataset.noexport = "");
            const r = e.endsWith(")") ? "method" : "attribute";
            if (!t.dataset.dfnType) return r;
            const s = ["attribute", "method"],
              { dfnType: i } = t.dataset;
            if (!s.includes(i) || r !== i) {
              const n = ds`Invalid ${"[data-dfn-type]"} attribute on internal slot.`,
                i = `The only allowed types are: ${cs(s, { quotes: !0 })}. The slot "${e}" seems to be a "${as(r)}"?`;
              return (ss(n, nc, { hint: i, elements: [t] }), "dfn");
            }
            return i;
          })(t, e);
      }
      if (!n && !e.matches("[data-dfn-type]")) {
        const t = e.closest("[data-dfn-type]");
        n = t?.dataset.dfnType ?? "";
      }
      n && !e.dataset.dfnType && (e.dataset.dfnType = n);
    }
    function oc(e) {
      switch (!0) {
        case e.matches(".export.no-export"):
          ss(
            ds`Declares both "${"[no-export]"}" and "${"[export]"}" CSS class.`,
            nc,
            { elements: [e], hint: "Please use only one." }
          );
          break;
        case e.matches(".no-export, [data-noexport]"):
          if (e.matches("[data-export]")) {
            (ss(
              ds`Declares ${"[no-export]"} CSS class, but also has a "${"[data-export]"}" attribute.`,
              nc,
              { elements: [e], hint: "Please chose only one." }
            ),
              delete e.dataset.export);
          }
          e.dataset.noexport = "";
          break;
        case e.matches(":is(.export):not([data-noexport], .no-export)"):
          e.dataset.export = "";
      }
    }
    var ac = Object.freeze({
      __proto__: null,
      name: nc,
      run: function () {
        for (const e of document.querySelectorAll("dfn")) {
          const t = Hr(e);
          if ((tc(e, t), e.dataset.cite && /\b#\b/.test(e.dataset.cite)))
            continue;
          const [n] = t;
          (ic(e, n), oc(e));
          const r = (e.dataset.localLt || "").split("|").map(Ir),
            s = t.filter(e => !r.includes(e));
          (s.length > 1 || n !== Ir(e.textContent)) &&
            (e.dataset.lt = s.join("|"));
        }
      },
    });
    var cc = Object.freeze({
      __proto__: null,
      name: "core/pluralize",
      run: function (e) {
        if (!e.pluralize) return;
        const t = (function () {
          const e = new Set();
          document.querySelectorAll("a:not([href])").forEach(t => {
            const n = Ir(t.textContent).toLowerCase();
            (e.add(n), t.dataset.lt && e.add(t.dataset.lt));
          });
          const t = new Set(),
            n = document.querySelectorAll("dfn:not([data-lt-noDefault])");
          return (
            n.forEach(e => {
              const n = Ir(e.textContent).toLowerCase();
              (t.add(n),
                e.dataset.lt && e.dataset.lt.split("|").forEach(e => t.add(e)),
                e.dataset.localLt &&
                  e.dataset.localLt.split("|").forEach(e => t.add(e)));
            }),
            function (n) {
              const r = Ir(n).toLowerCase(),
                s = ur.isSingular(r) ? ur.plural(r) : ur.singular(r);
              return e.has(s) && !t.has(s) ? s : "";
            }
          );
        })();
        document
          .querySelectorAll(
            "dfn:not([data-lt-no-plural]):not([data-lt-noDefault])"
          )
          .forEach(e => {
            const n = [e.textContent];
            (e.dataset.lt && n.push(...e.dataset.lt.split("|")),
              e.dataset.localLt && n.push(...e.dataset.localLt.split("|")));
            const r = new Set(n.map(t).filter(e => e));
            if (r.size) {
              const t = e.dataset.plurals ? e.dataset.plurals.split("|") : [],
                n = [...new Set([...t, ...r])];
              ((e.dataset.plurals = n.join("|")), tc(e, n));
            }
          });
      },
    });
    var lc = String.raw`span.example-title{text-transform:none}
:is(aside,div).example,div.illegal-example{padding:.5em;margin:1em 0;position:relative;clear:both}
div.illegal-example{color:red}
div.illegal-example p{color:#000}
aside.example div.example{border-left-width:.1em;border-color:#999;background:#fff}`;
    const uc = Dr({
      en: { example: "Example" },
      nl: { example: "Voorbeeld" },
      es: { example: "Ejemplo" },
      ko: { example: "예시" },
      ja: { example: "例" },
      de: { example: "Beispiel" },
      zh: { example: "例" },
      cs: { example: "Příklad" },
    });
    function dc(e, t, n) {
      ((n.title = e.title), n.title && e.removeAttribute("title"));
      const r = t > 0 ? ` ${t}` : "",
        s = n.title ? or`<span class="example-title">: ${n.title}</span>` : "";
      return or`<div class="marker">
    <a class="self-link">${uc.example}<bdi>${r}</bdi></a
    >${s}
  </div>`;
    }
    var pc = Object.freeze({
      __proto__: null,
      name: "core/examples",
      run: function () {
        const e = document.querySelectorAll(
          "pre.example, pre.illegal-example, aside.example"
        );
        if (!e.length) return;
        document.head.insertBefore(
          or`<style>
      ${lc}
    </style>`,
          document.querySelector("link")
        );
        let t = 0;
        e.forEach(e => {
          e.classList.contains("illegal-example");
          const n = {},
            { title: r } = e;
          if ("aside" === e.localName) {
            ++t;
            const s = dc(e, t, n);
            e.prepend(s);
            const i = Br(e, "example", r || String(t));
            s.querySelector("a.self-link").href = `#${i}`;
          } else {
            const s = !!e.closest("aside");
            (s || ++t,
              (n.content = e.innerHTML),
              e.classList.remove("example", "illegal-example"));
            const i = e.id ? e.id : null;
            i && e.removeAttribute("id");
            const o = dc(e, s ? 0 : t, n),
              a = or`<div class="example" id="${i}">
        ${o} ${e.cloneNode(!0)}
      </div>`;
            Br(a, "example", r || String(t));
            ((a.querySelector("a.self-link").href = `#${a.id}`),
              e.replaceWith(a));
          }
        });
      },
    });
    var hc = String.raw`.issue-label{text-transform:initial}
.warning>p:first-child{margin-top:0}
.warning{padding:.5em;border-left-width:.5em;border-left-style:solid}
span.warning{padding:.1em .5em .15em}
.issue.closed span.issue-number{text-decoration:line-through}
.issue.closed span.issue-number::after{content:" (Closed)";font-size:smaller}
.warning{border-color:#f11;border-color:var(--warning-border,#f11);border-width:.2em;border-style:solid;background:#fbe9e9;background:var(--warning-bg,#fbe9e9);color:#000;color:var(--text,#000)}
.warning-title:before{content:"⚠";font-size:1.3em;float:left;padding-right:.3em;margin-top:-.3em}
li.task-list-item{list-style:none}
input.task-list-item-checkbox{margin:0 .35em .25em -1.6em;vertical-align:middle}
.issue a.respec-gh-label{padding:5px;margin:0 2px 0 2px;font-size:10px;text-transform:none;text-decoration:none;font-weight:700;border-radius:4px;position:relative;bottom:2px;border:none;display:inline-block}`;
    const fc = "core/issues-notes",
      mc = Dr({
        en: {
          editors_note: "Editor's note",
          feature_at_risk: "(Feature at Risk) Issue",
          issue: "Issue",
          issue_summary: "Issue summary",
          no_issues_in_spec:
            "There are no issues listed in this specification.",
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
          no_issues_in_spec:
            "Er zijn geen problemen vermeld in deze specificatie.",
          note: "Noot",
          warning: "Waarschuwing",
        },
        es: {
          editors_note: "Nota de editor",
          issue: "Cuestión",
          issue_summary: "Resumen de la cuestión",
          note: "Nota",
          no_issues_in_spec:
            "No hay problemas enumerados en esta especificación.",
          warning: "Aviso",
        },
        de: {
          editors_note: "Redaktioneller Hinweis",
          issue: "Frage",
          issue_summary: "Offene Fragen",
          no_issues_in_spec:
            "Diese Spezifikation enthält keine offenen Fragen.",
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
        cs: {
          editors_note: "Poznámka editora",
          feature_at_risk: "(Funkce v ohrožení) Problém",
          issue: "Problém",
          issue_summary: "Souhrn problémů",
          no_issues_in_spec:
            "V této specifikaci nejsou uvedeny žádné problémy.",
          note: "Poznámka",
          warning: "Varování",
        },
      });
    function gc(e, t, n) {
      const r = (function () {
          if (document.querySelector(".issue[data-number]"))
            return e => {
              if (e.dataset.number) return Number(e.dataset.number);
            };
          let e = 0;
          return t => {
            if (t.classList.contains("issue") && "span" !== t.localName)
              return ++e;
          };
        })(),
        s = document.createElement("ul");
      (e.forEach(e => {
        const {
            type: i,
            displayType: o,
            isFeatureAtRisk: a,
          } = (function (e) {
            const t = e.classList.contains("issue"),
              n = e.classList.contains("warning"),
              r = e.classList.contains("ednote"),
              s = e.classList.contains("atrisk"),
              i = t ? "issue" : n ? "warning" : r ? "ednote" : "note",
              o = t
                ? s
                  ? mc.feature_at_risk
                  : mc.issue
                : n
                  ? mc.warning
                  : r
                    ? mc.editors_note
                    : mc.note;
            return { type: i, displayType: o, isFeatureAtRisk: s };
          })(e),
          c = "issue" === i,
          l = "span" === e.localName,
          { number: u } = e.dataset,
          d = { title: e.title, number: r(e) };
        if (!l) {
          const r = or`<div class="${a ? `${i} atrisk` : i}" role="${"note" === i ? "note" : null}"></div>`,
            l = document.createElement("span"),
            p = or`<div role="heading" class="${`${i}-title marker`}">${l}</div>`;
          Br(p, "h", i);
          let h,
            f = o;
          if (
            (e.id
              ? ((r.id = e.id), e.removeAttribute("id"))
              : Br(r, "issue-container", d.number ? `number-${d.number}` : ""),
            c)
          ) {
            if (
              (void 0 !== d.number && (f += ` ${d.number}`),
              e.dataset.hasOwnProperty("number"))
            ) {
              const e = (function (e, t, { isFeatureAtRisk: n = !1 } = {}) {
                if (!n && t.issueBase)
                  return or`<a href="${t.issueBase + e}" />`;
                if (n && t.atRiskBase)
                  return or`<a href="${t.atRiskBase + e}" />`;
              })(u ?? "", n, { isFeatureAtRisk: a });
              if (
                (e && (l.before(e), e.append(l)),
                l.classList.add("issue-number"),
                (h = t.get(u ?? "")),
                !h)
              ) {
                is(`Failed to fetch issue number ${u}.`, fc);
              }
              h && !d.title && (d.title = h.title);
            }
            s.append(
              (function (e, t, n) {
                const r = `${e}${t.number ? ` ${t.number}` : ""}`,
                  s = t.title
                    ? or`<span style="text-transform: none">: ${t.title}</span>`
                    : "";
                return or`<li><a href="${`#${n}`}">${r}</a>${s}</li>`;
              })(mc.issue, d, r.id)
            );
          }
          if (((l.textContent = f), d.title)) {
            e.removeAttribute("title");
            const { repoURL: t = "" } = n.github || {},
              s = h ? h.labels : [];
            (h && "CLOSED" === h.state && r.classList.add("closed"),
              p.append(
                (function (e, t, n) {
                  const r = e.map(e =>
                    (function (e, t) {
                      const { color: n, name: r } = e,
                        s = new URL("./issues/", t);
                      s.searchParams.set(
                        "q",
                        `is:issue is:open label:"${e.name}"`
                      );
                      const i = (function (e) {
                          const [t, n, r] = [
                              e.slice(0, 2),
                              e.slice(2, 4),
                              e.slice(4, 6),
                            ],
                            [s, i, o] = [t, n, r]
                              .map(e => parseInt(e, 16) / 255)
                              .map(e =>
                                e <= 0.04045
                                  ? e / 12.92
                                  : ((e + 0.055) / 1.055) ** 2.4
                              ),
                            a = 0.2126 * s + 0.7152 * i + 0.0722 * o;
                          return a > 0.179 ? "#000" : "#fff";
                        })(n),
                        o = `background-color: #${n}; color: ${i}`,
                        a = `GitHub label: ${r}`;
                      return or` <a
    class="respec-gh-label"
    style="${o}"
    href="${s.href}"
    aria-label="${a}"
    >${r}</a
  >`;
                    })(e, n)
                  );
                  r.length && r.unshift(document.createTextNode(" "));
                  return or`<span class="issue-label">: ${t}${r}</span>`;
                })(s, d.title, t)
              ));
          }
          let m = e;
          (e.replaceWith(r),
            m.classList.remove(i),
            m.removeAttribute("data-number"),
            h &&
              !m.innerHTML.trim() &&
              (m = document.createRange().createContextualFragment(h.bodyHTML)),
            r.append(p, m));
          const g = Yr(p, "section").length + 2;
          p.setAttribute("aria-level", g);
        }
      }),
        (function (e) {
          const t = document.getElementById("issue-summary");
          if (!t) return;
          const n = t.querySelector("h2, h3, h4, h5, h6");
          (e.hasChildNodes()
            ? t.append(e)
            : t.append(or`<p>${mc.no_issues_in_spec}</p>`),
            (!n || (n && n !== t.firstElementChild)) &&
              t.insertAdjacentHTML(
                "afterbegin",
                `<h1>${mc.issue_summary}</h1>`
              ));
        })(s));
    }
    var bc = Object.freeze({
      __proto__: null,
      name: fc,
      run: async function (e) {
        const t = document.querySelectorAll(".issue, .note, .warning, .ednote"),
          n = Array.from(t).filter(e => e instanceof HTMLElement);
        if (!n.length) return;
        const r = await (async function (e) {
            if (!e || !e.apiBase) return new Map();
            const t = [...document.querySelectorAll(".issue[data-number]")]
              .map(e => Number.parseInt(e.dataset.number ?? "", 10))
              .filter(e => e);
            if (!t.length) return new Map();
            const n = new URL("issues", `${e.apiBase}/${e.fullName}/`);
            n.searchParams.set("issues", t.join(","));
            const r = await fetch(n.href);
            if (!r.ok)
              return (
                ss(
                  `Error fetching issues from GitHub. (HTTP Status ${r.status}).`,
                  fc
                ),
                new Map()
              );
            const s = await r.json();
            return new Map(Object.entries(s));
          })(e.github ?? null),
          { head: s } = document;
        (s.insertBefore(
          or`<style>
      ${hc}
    </style>`,
          s.querySelector("link")
        ),
          gc(n, r, e),
          document.querySelectorAll(".ednote").forEach(e => {
            (e.classList.remove("ednote"), e.classList.add("note"));
          }));
      },
    });
    const yc = "core/best-practices",
      wc = {
        en: { best_practice: "Best Practice " },
        ja: { best_practice: "最良実施例 " },
        de: { best_practice: "Musterbeispiel " },
        zh: { best_practice: "最佳实践 " },
      },
      kc = Dr(wc),
      vc = i in wc ? i : "en";
    var $c = Object.freeze({
      __proto__: null,
      name: yc,
      run: function () {
        const e = document.querySelectorAll(".practicelab"),
          t = document.getElementById("bp-summary"),
          n = t ? document.createElement("ul") : null;
        if (
          ([...e].forEach((e, t) => {
            const r = Br(e, "bp"),
              s = or`<a class="marker self-link" href="${`#${r}`}"
      ><bdi lang="${vc}">${kc.best_practice}${t + 1}</bdi></a
    >`;
            if (n) {
              const t = or`<li>${s}: ${Qr(e)}</li>`;
              n.appendChild(t);
            }
            const i = e.closest("div");
            if (!i) return void e.classList.add("advisement");
            i.classList.add("advisement");
            const o = or`${s.cloneNode(!0)}: ${e}`;
            i.prepend(...o.childNodes);
          }),
          e.length)
        )
          t &&
            (t.appendChild(or`<h1>Best Practices Summary</h1>`),
            n && t.appendChild(n));
        else if (t) {
          (is(
            "Using best practices summary (#bp-summary) but no best practices found.",
            yc
          ),
            t.remove());
        }
      },
    });
    const xc = "core/figures",
      Cc = Dr({
        en: { list_of_figures: "List of Figures", fig: "Figure " },
        ja: { fig: "図 ", list_of_figures: "図のリスト" },
        ko: { fig: "그림 ", list_of_figures: "그림 목록" },
        nl: { fig: "Figuur ", list_of_figures: "Lijst met figuren" },
        es: { fig: "Figura ", list_of_figures: "Lista de Figuras" },
        zh: { fig: "图 ", list_of_figures: "规范中包含的图" },
        de: { fig: "Abbildung", list_of_figures: "Abbildungsverzeichnis" },
      });
    var _c = Object.freeze({
      __proto__: null,
      name: xc,
      run: function () {
        const e = (function () {
            const e = [];
            return (
              document.querySelectorAll("figure").forEach((t, n) => {
                const r = t.querySelector("figcaption");
                if (r)
                  (!(function (e, t, n) {
                    const r = t.textContent;
                    (Br(e, "fig", r),
                      Jr(t, or`<span class="fig-title"></span>`),
                      t.prepend(
                        or`<a class="self-link" href="#${e.id}"
      >${Cc.fig}<bdi class="figno">${n + 1}</bdi></a
    >`,
                        " "
                      ));
                  })(t, r, n),
                    e.push(
                      (function (e, t) {
                        const n = t.cloneNode(!0);
                        return (
                          n.querySelectorAll("a").forEach(e => {
                            Gr(e, "span").removeAttribute("href");
                          }),
                          or`<li class="tofline">
    <a class="tocxref" href="${`#${e}`}">${n.childNodes}</a>
  </li>`
                        );
                      })(t.id, r)
                    ));
                else {
                  is("Found a `<figure>` without a `<figcaption>`.", xc, {
                    elements: [t],
                  });
                }
              }),
              e
            );
          })(),
          t = document.getElementById("tof");
        e.length &&
          t &&
          (!(function (e) {
            if (
              e.classList.contains("appendix") ||
              e.classList.contains("introductory") ||
              e.closest("section")
            )
              return;
            const t = Kr(e);
            t.every(e => e.classList.contains("introductory"))
              ? e.classList.add("introductory")
              : t.some(e => e.classList.contains("appendix")) &&
                e.classList.add("appendix");
          })(t),
          t.append(
            or`<h1>${Cc.list_of_figures}</h1>`,
            or`<ul class="tof">
        ${e}
      </ul>`
          ));
      },
    });
    const Sc = Dr({
      en: { list_of_tables: "List of Tables", table: "Table " },
    });
    var Tc = Object.freeze({
      __proto__: null,
      name: "core/tables",
      run: function () {
        const e = (function () {
            const e = [],
              t = document.querySelectorAll("table.numbered");
            return (
              [...t]
                .filter(e => !!e.querySelector("caption"))
                .forEach((t, n) => {
                  const r = t.querySelector("caption");
                  r &&
                    (!(function (e, t, n) {
                      const r = t.textContent;
                      (Br(e, "table", r),
                        Jr(t, or`<span class="table-title"></span>`),
                        t.prepend(
                          or`<a class="self-link" href="#${e.id}"
      >${Sc.table}<bdi class="tableno">${n + 1}</bdi></a
    >`,
                          " "
                        ));
                    })(t, r, n),
                    e.push(
                      (function (e, t) {
                        const n = t.cloneNode(!0);
                        for (const e of n.querySelectorAll("a"))
                          Gr(e, "span", { copyAttributes: !1 });
                        return or`<li>
    <a class="tocxref" href="${`#${e}`}"
      >${n.childNodes}</a
    >
  </li>`;
                      })(t.id, r)
                    ));
                }),
              e
            );
          })(),
          t = document.querySelector("section#list-of-tables");
        e.length &&
          t &&
          (!(function (e) {
            if (e.matches(".appendix, .introductory") || e.closest("section"))
              return;
            const t = Kr(e);
            t.every(e => e.classList.contains("introductory"))
              ? e.classList.add("introductory")
              : t.some(e => e.classList.contains("appendix")) &&
                e.classList.add("appendix");
          })(t),
          t.append(
            or`<h1>${Sc.list_of_tables}</h1>`,
            or`<ul class="list-of-tables">
        ${e}
      </ul>`
          ));
      },
    });
    const Ec = new Set([
      "callback interface",
      "callback",
      "dictionary",
      "enum",
      "interface mixin",
      "interface",
      "typedef",
    ]);
    function Rc(e, t, { parent: n = "" } = {}) {
      switch (e.type) {
        case "constructor":
        case "operation":
          return (function (e, t, n) {
            if (n.includes("!overload")) return Ac(e, t, n);
            const r = `${n}()`;
            return Ac(e, t, r, n);
          })(e, n, t);
        default:
          return Ac(e, n, t);
      }
    }
    function Ac(e, t, ...n) {
      const { type: r } = e;
      for (const e of n) {
        let n = "enum-value" === r && "" === e ? "the-empty-string" : e,
          s = Pc(n, t, e, r);
        if (0 === s.length && "" !== t) {
          n = `${t}.${n}`;
          const e = ec.get(n);
          e && 1 === e.size && ((s = [...e]), tc(s[0], [n]));
        } else n = e;
        if (s.length > 1) {
          ss(
            `WebIDL identifier \`${e}\` ${t ? `for \`${t}\`` : ""} is defined multiple times`,
            e,
            { title: "Duplicate definition.", elements: s }
          );
        }
        if (s.length) return s[0];
      }
    }
    function Lc(e, t, n, r) {
      if (!e.id) {
        const t = n.toLowerCase(),
          s = t ? `${t}-` : "";
        let i = r.toLowerCase().replace(/[()]/g, "").replace(/\s/g, "-");
        ("" === i &&
          ((i = "the-empty-string"),
          e.setAttribute("aria-label", "the empty string")),
          (e.id = `dom-${s}${i}`));
      }
      switch (
        ((e.dataset.idl = t.type),
        (e.dataset.title = e.textContent),
        (e.dataset.dfnFor = n),
        t.type)
      ) {
        case "operation":
        case "attribute":
        case "field":
          e.dataset.type = Nc(t);
      }
      switch (
        (e.querySelector("code") ||
          e.closest("code") ||
          !e.children ||
          Jr(e, e.ownerDocument.createElement("code")),
        t.type)
      ) {
        case "attribute":
        case "constructor":
        case "operation": {
          const s = (function (e, t, n) {
            const { type: r } = e,
              s = `${t}.${n}`;
            switch (r) {
              case "constructor":
              case "operation": {
                const t = `${n}()`,
                  r = `${s}()`,
                  i = (function (e, t) {
                    const n = [];
                    if (0 === t.length) return n;
                    const r = [],
                      s = [];
                    for (const { name: e, optional: n, variadic: i } of t)
                      n || i ? s.push(e) : r.push(e);
                    const i = r.join(", "),
                      o = `${e}(${i})`;
                    n.push(o);
                    const a = s.map((t, n) => {
                      const i = [...r, ...s.slice(0, n + 1)].join(", ");
                      return `${e}(${i})`;
                    });
                    return (n.push(...a), n);
                  })(n, e.arguments);
                return { local: [s, r, n], exportable: [t, ...i] };
              }
              case "attribute":
                return { local: [s], exportable: [n] };
            }
          })(t, n, r);
          s &&
            (function (e, t) {
              const { local: n, exportable: r } = t,
                s = e.dataset.lt ? new Set(e.dataset.lt.split("|")) : new Set();
              for (const e of r) s.add(e);
              (n.filter(e => s.has(e)).forEach(e => s.delete(e)),
                (e.dataset.lt = [...s].join("|")),
                (e.dataset.localLt = n.join("|")),
                tc(e, [...n, ...r]));
            })(e, s);
          break;
        }
      }
      return e;
    }
    function Pc(e, t, n, r) {
      const s = ec.get(e);
      if (!s || 0 === s.size) return [];
      const i = [...s],
        o = i.filter(e => {
          if ("dfn" === e.dataset.dfnType) return !1;
          const n = e.closest("[data-dfn-for]");
          return n && n.dataset.dfnFor === t;
        });
      if (0 === o.length && "" === t && 1 === i.length)
        return i[0].textContent === n ? i : [];
      if (Ec.has(r) && i.length) {
        const e = i.find(e => e.textContent.trim() === n);
        if (e) return [e];
      }
      return o;
    }
    function Nc(e = {}) {
      const { idlType: t, generic: n, union: r } = e;
      return void 0 === t
        ? ""
        : "string" == typeof t
          ? t
          : n || (r ? t.map(Nc).join("|") : Nc(t));
    }
    const Ic =
      '<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';
    function Dc(e, t = "Copy to clipboard") {
      const n = document.createElement("button");
      return (
        (n.innerHTML = Ic),
        (n.title = t),
        n.setAttribute("aria-label", t),
        n.classList.add("respec-button-copy-paste", "removeOnSave"),
        (n.dataset.copyHeader = e),
        n.addEventListener("click", () => {
          const t = n.closest("pre");
          if (!t) return;
          const r = t.cloneNode(!0);
          (r.querySelector(e)?.remove(),
            navigator.clipboard.writeText(r.textContent ?? ""));
        }),
        n
      );
    }
    function Oc() {
      if (document.getElementById("respec-copy-paste")) return;
      const e = document.createElement("script");
      ((e.id = "respec-copy-paste"),
        (e.textContent =
          '\n    document.querySelectorAll(".respec-button-copy-paste").forEach(function(btn) {\n      btn.addEventListener("click", function() {\n        var pre = this.closest("pre");\n        if (!pre) return;\n        var sel = this.dataset.copyHeader;\n        var clone = pre.cloneNode(true);\n        if (sel) { var h = clone.querySelector(sel); if (h) h.remove(); }\n        navigator.clipboard.writeText(clone.textContent);\n      });\n    });\n  '),
        document.body.append(e));
    }
    function jc(e) {
      (e.append(Dc(".idlHeader", "Copy IDL to clipboard")), Oc());
    }
    var zc = Object.freeze({
      __proto__: null,
      addCopyIDLButton: jc,
      name: "core/webidl-clipboard",
    });
    var Mc = String.raw`pre.idl{padding:1em;position:relative}
pre.idl>code{color:#000;color:var(--text,#000)}
@media print{
pre.idl{white-space:pre-wrap}
}
.idlHeader{display:block;width:150px;background:#8ccbf2;background:var(--def-border,#8ccbf2);color:#fff;color:var(--defrow-border,#fff);font-family:sans-serif;font-weight:700;margin:-1em 0 1em -1em;height:28px;line-height:28px}
.idlHeader a.self-link{margin-left:.3cm;text-decoration:none;border-bottom:none;color:inherit}
.idlID{font-weight:700;color:#005a9c}
.idlType{color:#005a9c}
.idlName{color:#ff4500}
.idlName a{color:#ff4500;border-bottom:1px dotted #ff4500;text-decoration:none}
a.idlEnumItem{color:#000;border-bottom:1px dotted #ccc;text-decoration:none}
.idlSuperclass{font-style:italic;color:#005a9c}
.idlDefaultValue,.idlParamName{font-style:italic}
.extAttr{color:#666}
.idlSectionComment{color:gray}
.idlIncludes a{font-weight:700}
.respec-button-copy-paste:focus{text-decoration:none;border-color:#51a7e8;outline:0;box-shadow:0 0 5px rgba(81,167,232,.5)}
.respec-button-copy-paste:is(:focus:hover,.selected:focus){border-color:#51a7e8}
.respec-button-copy-paste:is(:hover,:active,.zeroclipboard-is-hover,.zeroclipboard-is-active){text-decoration:none;background-color:#ddd;background-image:linear-gradient(#eee,#ddd);border-color:#ccc}
.respec-button-copy-paste:is(:active,.selected,.zeroclipboard-is-active){background-color:#dcdcdc;background-image:none;border-color:#b5b5b5;box-shadow:inset 0 2px 4px rgba(0,0,0,.15)}
.respec-button-copy-paste.selected:hover{background-color:#cfcfcf}
.respec-button-copy-paste:is(:disabled,:disabled:hover,.disabled,.disabled:hover){color:rgba(102,102,102,.5);cursor:default;background-color:rgba(229,229,229,.5);background-image:none;border-color:rgba(197,197,197,.5);box-shadow:none}
@media print{
.respec-button-copy-paste{visibility:hidden}
}`;
    const qc = "core/webidl",
      Uc = qc,
      Wc = {},
      Fc = {},
      Bc = {
        wrap: e =>
          e
            .flat()
            .filter(e => "" !== e)
            .map(e => ("string" == typeof e ? new Text(e) : e)),
        trivia: e =>
          e.trim() ? or`<span class="idlSectionComment">${e}</span>` : e,
        generic: e =>
          /^[A-Z]/.test(e)
            ? or`<a data-xref-type="interface" data-cite="WEBIDL">${e}</a>`
            : or`<a data-xref-type="dfn" data-cite="WEBIDL">${e}</a>`,
        reference(e, t, n) {
          if ("extended-attribute" === n.type) return e;
          let r = "_IDL_",
            s = null;
          if ("object" === t) ((r = "interface"), (s = "WEBIDL"));
          return or`<a
      data-link-type="${"_IDL_" === r ? "idl" : r}"
      data-xref-type="${r}"
      data-cite="${s}"
      data-lt="${undefined}"
      >${e}</a
    >`;
        },
        name(e, { data: t, parent: n }) {
          if (t.idlType && "argument-type" === t.idlType.type)
            return or`<span class="idlParamName">${e}</span>`;
          const r = Hc(e, t, n);
          if ("enum-value" !== t.type) {
            const e = n ? "idlName" : "idlID";
            r.classList.add(e);
          }
          return r;
        },
        nameless(e, { data: t, parent: n }) {
          switch (t.type) {
            case "operation":
            case "constructor":
              return Hc(e, t, n);
            default:
              return e;
          }
        },
        type: e => or`<span class="idlType">${e}</span>`,
        inheritance: e => or`<span class="idlSuperclass">${e}</span>`,
        definition(e, { data: t, parent: n }) {
          const r = (function (e) {
            switch (e.type) {
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
            return `idl${e.type[0].toUpperCase()}${e.type.slice(1)}`;
          })(t);
          switch (t.type) {
            case "includes":
            case "enum-value":
              return or`<span class="${r}">${e}</span>`;
          }
          const s = n ? n.name : "",
            { name: i, idlId: o } = Vc(t, s);
          return or`<span
      class="${r}"
      id="${o}"
      data-idl
      data-title="${i}"
      >${e}</span
    >`;
        },
        extendedAttribute: e => or`<span class="extAttr">${e}</span>`,
        extendedAttributeReference: e =>
          or`<a data-xref-type="extended-attribute">${e}</a>`,
      };
    function Hc(e, t, n) {
      const r = n ? n.name : "",
        { name: s } = Vc(t, r),
        i = Rc(t, s, { parent: r }),
        o = (function (e) {
          switch (e) {
            case "operation":
              return "method";
            case "field":
              return "dict-member";
            case "callback interface":
            case "interface mixin":
              return "interface";
            default:
              return e;
          }
        })(t.type);
      if (i) {
        (t.partial ||
          (i.matches("[data-noexport]") || (i.dataset.export = ""),
          (i.dataset.dfnType = o)),
          Lc(i, t, r, s));
        const n = `#${i.id}`;
        return or`<a
      data-link-for="${r}"
      data-link-type="${o}"
      href="${n}"
      class="internalDFN"
      ><code>${e}</code></a
    >`;
      }
      const a =
        "operation" === t.type &&
        "toJSON" === t.name &&
        t.extAttrs.some(({ name: e }) => "Default" === e);
      if (a)
        return or`<a data-link-type="dfn" data-lt="default toJSON steps"
      >${e}</a
    >`;
      if (!t.partial) {
        const n = or`<dfn data-export data-dfn-type="${o}"
      >${e}</dfn
    >`;
        return (tc(n, [s]), Lc(n, t, r, s), n);
      }
      const c = or`<a
    data-idl="${t.partial ? "partial" : null}"
    data-link-type="${o}"
    data-title="${t.name}"
    data-xref-type="${o}"
    >${e}</a
  >`;
      if (s && "typedef" !== t.type && !(t.partial && !i)) {
        const e = ds`See ${"using `data-dfn-for`|#data-dfn-for"} in ReSpec's documentation.`;
        is(
          `Missing \`<dfn>\` for${r ? ` \`${r}\`'s` : ""} \`${"operation" === t.type ? `${s}()` : s}\` ${t.type}.`,
          Uc,
          { elements: [c], hint: e }
        );
      }
      return c;
    }
    const Gc = new WeakMap();
    function Vc(e, t = "") {
      if (Gc.has(e)) return Gc.get(e);
      const n = (function (e, t) {
        let n = (function (e) {
          switch (e.type) {
            case "enum-value":
              return e.value;
            case "operation":
              return e.name || e.special;
            default:
              return e.name || e.type;
          }
        })(e);
        const r = e.special && "" === e.name ? "anonymous-" : "";
        let s = (function (e, t) {
          if (!t) return `idl-def-${e.toLowerCase()}`;
          return `idl-def-${t.toLowerCase()}-${e.toLowerCase()}`;
        })(r + n, t);
        switch (e.type) {
          case "callback interface":
          case "dictionary":
          case "interface":
          case "interface mixin":
          case "namespace":
            s += (function (e) {
              if (!e.partial) return "";
              Fc[e.name] || (Fc[e.name] = 0);
              return ((Fc[e.name] += 1), `-partial-${Fc[e.name]}`);
            })(e);
            break;
          case "constructor":
          case "operation": {
            const r = (function (e, t) {
              const n = `${t}.${e}`,
                r = `${n}()`;
              let s;
              Wc[r] || (Wc[r] = 0);
              Wc[n] ? (s = `!overload-${Wc[n]}`) : (Wc[n] = 0);
              return ((Wc[r] += 1), (Wc[n] += 1), s || "");
            })(n, t);
            r
              ? ((n += r), (s += r))
              : e.arguments.length &&
                (s += e.arguments
                  .map(e => `-${e.name.toLowerCase()}`)
                  .join(""));
            break;
          }
        }
        return { name: n, idlId: s };
      })(e, t);
      return (Gc.set(e, n), n);
    }
    const Jc = [
      "interface",
      "interface mixin",
      "dictionary",
      "namespace",
      "enum",
      "typedef",
      "callback",
    ];
    function Kc(e, t) {
      let n;
      try {
        n = dr.parse(e.textContent, { sourceName: String(t) });
      } catch (t) {
        return (
          ss(`Failed to parse WebIDL: ${t.bareMessage}.`, Uc, {
            title: t.bareMessage,
            details: `<pre>${t.context}</pre>`,
            elements: [e],
          }),
          []
        );
      }
      e.classList.add("def", "idl");
      const r = dr.write(n, { templates: Bc });
      (or.bind(e)`${r}`,
        Jr(e, document.createElement("code")),
        e.querySelectorAll("[data-idl]").forEach(e => {
          if (e.dataset.dfnFor) return;
          const t = e.dataset.title,
            n = e.dataset.dfnType,
            r = e.parentElement.closest("[data-idl][data-title]");
          (r && !Jc.includes(n) && (e.dataset.dfnFor = r.dataset.title),
            "dfn" === e.localName && tc(e, [t]));
        }));
      const s = e.closest("[data-cite], body"),
        { dataset: i } = s;
      if ((i.cite || (i.cite = "WEBIDL"), !/\bwebidl\b/i.test(i.cite))) {
        const e = i.cite.trim().split(/\s+/);
        i.cite = ["WEBIDL", ...e].join(" ");
      }
      return (Yc(e), n);
    }
    function Yc(e) {
      Wr(e, "webidl");
      const t = or`<span class="idlHeader"
    ><a class="self-link" href="${`#${e.id}`}">WebIDL</a></span
  >`;
      (e.prepend(t), jc(t));
    }
    var Zc = Object.freeze({
      __proto__: null,
      addIDLHeader: Yc,
      name: qc,
      run: async function () {
        const e = document.querySelectorAll("pre.idl, pre.webidl");
        if (!e.length) return;
        const t = document.createElement("style");
        ((t.textContent = Mc),
          document.querySelector("head link, head > *:last-child").before(t));
        const n = [...e].map(Kc),
          r = dr.validate(n);
        for (const t of r) {
          let r = `<pre>${Nr(t.context)}</pre>`;
          if (t.autofix) {
            t.autofix();
            r += `Try fixing as:\n      <pre>${Nr(dr.write(n[t.sourceName]))}</pre>`;
          }
          ss(`WebIDL validation error: ${t.bareMessage}`, Uc, {
            details: r,
            elements: [e[t.sourceName]],
            title: t.bareMessage,
          });
        }
        document.normalize();
      },
    });
    var Xc = String.raw`:root{--cddl-comment:#6a737d;--cddl-kw:#005a9c;--cddl-str:#032f62;--cddl-num:#005cc5;--cddl-op:#6f42c1;--cddl-ctrl:#d73a49;--cddl-occ:#e36209;--cddl-bytes:#22863a;--cddl-param:#e36209;--cddl-type-dfn:#c43a31;--cddl-key-dfn:#005a9c;--cddl-header-bg:var(--def-border, #8ccbf2);--cddl-header-color:#005a9c;--cddl-focus:#51a7e8}
@media (prefers-color-scheme:dark){
:root{--cddl-comment:#8b949e;--cddl-kw:#79c0ff;--cddl-str:#a5d6ff;--cddl-num:#79c0ff;--cddl-op:#d2a8ff;--cddl-ctrl:#ff7b72;--cddl-occ:#ffa657;--cddl-bytes:#7ee787;--cddl-param:#ffa657;--cddl-type-dfn:#ffa198;--cddl-key-dfn:#79c0ff;--cddl-header-bg:#3a6da0;--cddl-header-color:#005a9c;--cddl-focus:#51a7e8}
}
pre.cddl{padding:1em;position:relative}
pre.cddl>code{color:var(--text,#000)}
@media print{
pre.cddl{white-space:pre-wrap}
}
.cddlHeader{display:block;width:150px;background:var(--cddl-header-bg);color:var(--cddl-header-color);font-family:sans-serif;font-weight:700;margin:-1em 0 1em -1em;height:1.75em;line-height:1.75em}
.cddlHeader a.self-link{margin-left:.5em;text-decoration:none;border-bottom:none;color:inherit}
pre.cddl .cddl-comment{color:var(--cddl-comment);font-style:italic}
pre.cddl .cddl-kw{color:var(--cddl-kw)}
pre.cddl .cddl-str,pre.cddl dfn[data-dfn-type=cddl-value]{color:var(--cddl-str)}
pre.cddl .cddl-num{color:var(--cddl-num)}
pre.cddl .cddl-op{color:var(--cddl-op)}
pre.cddl .cddl-ctrl{color:var(--cddl-ctrl)}
pre.cddl .cddl-occ{color:var(--cddl-occ)}
pre.cddl .cddl-name{font-weight:700}
pre.cddl .cddl-name a{color:inherit;border-bottom:1px dotted currentColor;text-decoration:none}
pre.cddl .cddl-bytes{color:var(--cddl-bytes)}
pre.cddl .cddl-param{font-style:italic;color:var(--cddl-param)}
pre.cddl a[data-link-type]{text-decoration:none;border-bottom:1px dotted currentColor}
pre.cddl dfn{font-style:normal;font-weight:700}
.cddlHeader a.self-link:focus-visible,pre.cddl a:focus-visible,pre.cddl dfn:focus-visible{outline:2px solid var(--cddl-focus);outline-offset:2px}
.respec-button-copy-paste:focus-visible{outline:2px solid var(--cddl-focus);outline-offset:2px}
pre.cddl dfn[data-dfn-type=cddl-type]{color:var(--cddl-type-dfn)}
pre.cddl dfn[data-dfn-type=cddl-key]{color:var(--cddl-key-dfn)}`;
    const Qc = "core/cddl",
      el = new Set([
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
    function tl(e) {
      return e
        .toLowerCase()
        .replace(/^"(.*)"$/, "$1")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    function nl(e) {
      let t = e.parentNode;
      for (; t; ) {
        if (t instanceof fr) return t.name?.name || null;
        t = t.parentNode;
      }
      return null;
    }
    class rl extends hr {
      #e = null;
      #t;
      constructor(e) {
        (super(), (this.#t = e));
      }
      serializeName(e, t) {
        const n = this.#t;
        if (
          (function (e) {
            let t = e.parentNode;
            for (; t; ) {
              if (t instanceof gr) return !0;
              if (t instanceof fr) return !1;
              t = t.parentNode;
            }
            return !1;
          })(t)
        ) {
          const r = nl(t);
          return (
            r &&
              (n.genericParams.has(r) || n.genericParams.set(r, new Set()),
              n.genericParams.get(r)?.add(e)),
            `<span class="cddl-param">${Nr(e)}</span>`
          );
        }
        if (
          (function (e) {
            let t = e.parentNode;
            for (; t; ) {
              if (t instanceof br) return !0;
              if (t instanceof fr) return !1;
              t = t.parentNode;
            }
            return !1;
          })(t)
        )
          return this.#n(e);
        if (
          (function (e) {
            return e.parentNode instanceof fr;
          })(t)
        )
          return ((this.#e = e), this.#r(e));
        if (
          (function (e) {
            return e.parentNode instanceof mr;
          })(t)
        )
          return this.#s(e);
        const r = nl(t) || this.#e;
        return r && n.genericParams.has(r) && n.genericParams.get(r)?.has(e)
          ? `<span class="cddl-param">${Nr(e)}</span>`
          : this.#n(e);
      }
      #r(e) {
        const t = this.#t,
          n = `cddl-type-${tl(e)}`,
          r = `cddl-type:${e}`;
        return t.definitions.has(r)
          ? `<a href="#${n}" class="cddl-name" data-link-type="cddl-type">${Nr(e)}</a>`
          : t.proseDfns.has(n)
            ? (t.definitions.set(r, { type: "cddl-type", for: null, id: n }),
              `<a href="#${n}" class="cddl-name" data-link-type="cddl-type">${Nr(e)}</a>`)
            : (t.definitions.set(r, { type: "cddl-type", for: null, id: n }),
              `<dfn data-dfn-type="cddl-type" id="${n}" data-export>${Nr(e)}</dfn>`);
      }
      #s(e) {
        const t = this.#t,
          n = this.#e;
        if (!n) return `<span class="cddl-name">${Nr(e)}</span>`;
        const r = `cddl-key-${tl(n)}-${tl(e)}`,
          s = `cddl-key:${n}/${e}`;
        return t.definitions.has(s)
          ? `<a href="#${r}" class="cddl-name" data-link-type="cddl-key" data-xref-for="${Nr(n)}">${Nr(e)}</a>`
          : t.proseDfns.has(r)
            ? (t.definitions.set(s, { type: "cddl-key", for: n, id: r }),
              `<a href="#${r}" class="cddl-name" data-link-type="cddl-key" data-xref-for="${Nr(n)}">${Nr(e)}</a>`)
            : (t.definitions.set(s, { type: "cddl-key", for: n, id: r }),
              `<dfn data-dfn-type="cddl-key" data-dfn-for="${Nr(n)}" id="${r}" data-export>${Nr(e)}</dfn>`);
      }
      #n(e) {
        const t = this.#t;
        if (el.has(e))
          return `<a class="cddl-kw" data-link-type="cddl-type" data-link-spec="rfc8610" href="https://www.rfc-editor.org/rfc/rfc8610#section-appendix.d">${Nr(e)}</a>`;
        const n = `cddl-type:${e}`;
        if (t.definitions.has(n)) {
          const r = t.definitions.get(n);
          return r
            ? `<a href="#${r.id}" class="cddl-name" data-link-type="cddl-type">${Nr(e)}</a>`
            : `<span class="cddl-name">${Nr(e)}</span>`;
        }
        return `<span class="cddl-name" data-cddl-pending="${Nr(e)}">${Nr(e)}</span>`;
      }
      serializeValue(e, t, n, r) {
        const s = this.#t,
          i = e + t + n;
        if ("text" === r.type && this.#i(r)) {
          const e = this.#e;
          if (e) {
            const n = `cddl-value-${tl(e)}-${tl(t)}`,
              r = `cddl-value:${e}/"${t}"`;
            if (s.definitions.has(r)) {
              const t = s.definitions.get(r);
              return t
                ? `<a href="#${t.id}" class="cddl-str" data-link-type="cddl-value" data-xref-for="${Nr(e)}">${Nr(i)}</a>`
                : `<span class="cddl-str">${Nr(i)}</span>`;
            }
            if (s.proseDfns.has(n))
              return (
                s.definitions.set(r, { type: "cddl-value", for: e, id: n }),
                `<a href="#${n}" class="cddl-str" data-link-type="cddl-value" data-xref-for="${Nr(e)}">${Nr(i)}</a>`
              );
            if (!s.definitions.has(r))
              return (
                s.definitions.set(r, { type: "cddl-value", for: e, id: n }),
                `<dfn data-dfn-type="cddl-value" data-dfn-for="${Nr(e)}" id="${n}" data-export>${Nr(i)}</dfn>`
              );
          }
        }
        switch (r.type) {
          case "text":
            return `<span class="cddl-str">${Nr(i)}</span>`;
          case "number":
          case "float":
            return `<span class="cddl-num">${Nr(i)}</span>`;
          case "bytes":
          case "hex":
          case "base64":
            return `<span class="cddl-bytes">${Nr(i)}</span>`;
          default:
            return Nr(i);
        }
      }
      #i(e) {
        const t = e.parentNode;
        return !!t && t instanceof yr;
      }
      serializeToken(e, t) {
        const n = e.type,
          r = e.serialize();
        switch (n) {
          case "COMMENT":
            return this.#o(r);
          case "CTLOP":
            return this.#a(r);
          case "=":
          case "/=":
          case "//=":
          case "/":
          case "//":
          case "=>":
          case "..":
          case "...":
            return this.#c(r);
          case "?":
          case "*":
          case "+":
            return t instanceof wr ? this.#l(r) : r;
          default:
            return r;
        }
      }
      #o(e) {
        return e.replace(/(;[^\n]*)/g, '<span class="cddl-comment">$1</span>');
      }
      #a(e) {
        return e.replace(/(\.\w+)/g, '<span class="cddl-ctrl">$1</span>');
      }
      #c(e) {
        const t = e.match(/^(\s*)(.*?)(\s*)$/s);
        return t
          ? `${t[1]}<span class="cddl-op">${t[2]}</span>${t[3]}`
          : `<span class="cddl-op">${e}</span>`;
      }
      #l(e) {
        const t = e.match(/^(\s*)(.*?)(\s*)$/s);
        return t
          ? `${t[1]}<span class="cddl-occ">${t[2]}</span>${t[3]}`
          : `<span class="cddl-occ">${e}</span>`;
      }
    }
    var sl = Object.freeze({
      __proto__: null,
      name: Qc,
      run: async function () {
        const e = document.querySelectorAll("pre.cddl:not([data-no-cddl])");
        if (!e.length) return;
        const t = document.createElement("style");
        t.textContent = Xc;
        const n = document.querySelector("head link, head > *:last-child");
        n ? n.before(t) : document.head.append(t);
        const r = e => new pr(e).parse(),
          s = {
            definitions: new Map(),
            proseDfns: new Set(),
            genericParams: new Map(),
          };
        var i, o, a, c;
        ((i = document),
          (o = s.proseDfns),
          ["cddl-type", "cddl-key", "cddl-value"].forEach(e => {
            i.querySelectorAll(`dfn[${e}]`).forEach(t => {
              ((t.dataset.dfnType = e), t.removeAttribute(e));
              const n = t.getAttribute("for");
              n && ((t.dataset.dfnFor = n), t.removeAttribute("for"));
              const r = t.textContent.trim(),
                s = n ? `${tl(n)}-` : "",
                i = e.replace("cddl-", ""),
                a = t.id || `cddl-${i}-${s}${tl(r)}`;
              ((t.id = a), o.add(a), tc(t, [r]));
            });
          }),
          e.forEach(e =>
            (function (e, t, n) {
              const r = e.textContent;
              if (r.trim())
                try {
                  const s = t(r),
                    i = new rl(n),
                    o = s.serialize(i),
                    a = document.createElement("code");
                  ((a.innerHTML = o),
                    (e.textContent = ""),
                    e.append(a),
                    e.classList.add("def", "highlight"),
                    Wr(e, "cddl-block"));
                  const c = document.createElement("span");
                  ((c.className = "cddlHeader"),
                    (c.innerHTML = `<a class="self-link" href="#${e.id}">CDDL</a>`));
                  const l = Dc(".cddlHeader");
                  (c.append(l), e.prepend(c));
                } catch (t) {
                  ss(
                    `CDDL processing error: ${t instanceof Error ? t.message : String(t)}`,
                    Qc,
                    {
                      elements: [e],
                      hint: 'Check the CDDL syntax in the `<pre class="cddl">` block.',
                    }
                  );
                }
            })(e, r, s)
          ),
          (a = document.body),
          (c = s.definitions),
          a.querySelectorAll("[data-cddl-pending]").forEach(e => {
            const t = `cddl-type:${e.dataset.cddlPending}`;
            if (c.has(t)) {
              const n = c.get(t);
              if (!n) return;
              const r = a.ownerDocument.createElement("a");
              ((r.href = `#${n.id}`),
                (r.className = "cddl-name"),
                (r.dataset.linkType = "cddl-type"),
                (r.textContent = e.textContent),
                e.replaceWith(r));
            }
          }),
          document.querySelectorAll("[data-cddl-pending]").forEach(e => {
            is(
              `No CDDL definition found for \`${e.getAttribute("data-cddl-pending")}\`.`,
              Qc,
              { elements: [e], hint: "Check for typos in the type name." }
            );
          }),
          (function (e, t) {
            e.querySelectorAll(
              'a[data-link-type^="cddl-"]:not([href]):not([data-cite])'
            ).forEach(e => {
              const n = e.getAttribute("data-link-type"),
                r =
                  e.getAttribute("data-xref-for") ||
                  e.getAttribute("data-link-for") ||
                  "",
                s = e.textContent.trim();
              if ("cddl-type" !== n && "cddl-key" !== n && "cddl-value" !== n)
                return;
              const i = {
                "cddl-type": `cddl-type:${s}`,
                "cddl-key": `cddl-key:${r}/${s}`,
                "cddl-value": `cddl-value:${r}/${s}`,
              }[n];
              if (t.has(i)) {
                const n = t.get(i);
                if (!n) return;
                (e.setAttribute("href", `#${n.id}`),
                  e.classList.add("internalDFN"));
              } else
                (is(
                  `CDDL ${n}: no definition found for \`${s}\`${r ? `, for \`${r}\`,` : ""} in any \`<pre class="cddl">\` block.`,
                  Qc,
                  { elements: [e] }
                ),
                  e.setAttribute("data-no-link-to-dfn", ""));
            });
          })(document, s.definitions),
          (function (e, t) {
            t.forEach(t => {
              const n = e.getElementById(t.id);
              "dfn" === n?.localName && tc(n, [n.textContent.trim()]);
            });
          })(document, s.definitions),
          Oc(),
          ms("beforesave", e => {
            e.querySelectorAll("[data-cddl-pending]").forEach(e =>
              e.removeAttribute("data-cddl-pending")
            );
          }));
      },
    });
    const il = "core/data-cite",
      ol = "__SPEC__";
    async function al(e) {
      const { key: t, frag: n, path: r, href: s } = e;
      let i = "",
        o = "";
      if (t === ol) i = document.location.href;
      else {
        const e = await da(t);
        if (!e) return null;
        ((i = e.href ?? ""), (o = e.title));
      }
      if (s) i = s;
      else {
        if (r) {
          const e = r.startsWith("/") ? `.${r}` : r;
          i = new URL(e, i).href;
        }
        n && (i = new URL(n, i).href);
      }
      return { href: i, title: o };
    }
    function cl(e, t, n) {
      const { href: r, title: s } = t,
        i = !n.path && !n.frag;
      switch (e.localName) {
        case "a": {
          const t = e;
          if (
            ("" === t.textContent &&
              "the-empty-string" !== t.dataset.lt &&
              (t.textContent = s),
            (t.href = r),
            i)
          ) {
            const e = document.createElement("cite");
            (t.replaceWith(e), e.append(t));
          }
          break;
        }
        case "dfn": {
          const t = document.createElement("a");
          if (
            ((t.href = r),
            (t.dataset.cite = n.key),
            (t.dataset.citePath = n.path),
            (t.dataset.citeFrag = n.frag),
            e.textContent ? Jr(e, t) : ((t.textContent = s), e.append(t)),
            i)
          ) {
            const n = document.createElement("cite");
            (n.append(t), e.append(n));
          }
          if ("export" in e.dataset) {
            (ss("Exporting a linked external definition is not allowed.", il, {
              hint: "Please remove the `data-export` attribute.",
              elements: [e],
            }),
              delete e.dataset.export);
          }
          (e.classList.add("externalDFN"), (e.dataset.noExport = ""));
          break;
        }
      }
    }
    function ll(e) {
      return t => {
        const n = t.search(e);
        return -1 !== n ? t.substring(n) : "";
      };
    }
    const ul = ll("#"),
      dl = ll("/");
    function pl(e) {
      const { dataset: t } = e,
        { cite: n, citeFrag: r, citePath: s, citeHref: i } = t;
      if ((n ?? "").startsWith("#") && !r) {
        const r =
            e.parentElement?.closest('[data-cite]:not([data-cite^="#"])') ??
            null,
          { key: s, isNormative: i } = r ? pl(r) : { key: ol, isNormative: !1 };
        return (
          (t.cite = i ? s : `?${s}`),
          (t.citeFrag = (n ?? "").replace("#", "")),
          pl(e)
        );
      }
      const o = r ? `#${r}` : ul(n ?? ""),
        a = s || dl(n ?? "").split("#")[0],
        { type: c } = Vr(n ?? "", e),
        l = "normative" === c,
        u = /^[?|!]/.test(n ?? "");
      return {
        key: (n ?? "").split(/[/|#]/)[0].substring(Number(u)),
        isNormative: l,
        frag: o,
        path: a,
        href: i,
      };
    }
    function hl(e) {
      const t = ["data-cite", "data-cite-frag", "data-cite-path"];
      e.querySelectorAll("a[data-cite], dfn[data-cite]").forEach(e =>
        t.forEach(t => e.removeAttribute(t))
      );
    }
    var fl = Object.freeze({
      __proto__: null,
      THIS_SPEC: ol,
      name: il,
      run: async function () {
        const e = document.querySelectorAll(
          "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
        );
        await (async function (e) {
          const t = e
              .map(pl)
              .map(async e => ({ entry: e, result: await da(e.key) })),
            n = (await Promise.all(t))
              .filter(({ result: e }) => null === e)
              .map(({ entry: { key: e } }) => e),
            r = await ua(n);
          r && Object.assign(ia, r);
        })([...e]);
        for (const t of e) {
          const e = t.dataset.cite,
            n = pl(t),
            r = await al(n);
          if (r) cl(t, r, n);
          else {
            const n = `Couldn't find a match for "${e}"`;
            (t.dataset.matchedText && (t.textContent = t.dataset.matchedText),
              is(n, il, { elements: [t] }));
          }
        }
        ms("beforesave", hl);
      },
      toCiteDetails: pl,
    });
    const ml = "core/link-to-dfn",
      gl = [],
      bl = {
        en: {
          duplicateMsg: e => `Duplicate definition(s) of '${e}'`,
          duplicateTitle: "This is defined more than once in the document.",
        },
        ja: {
          duplicateMsg: e => `'${e}' の重複定義`,
          duplicateTitle: "この文書内で複数回定義されています．",
        },
        de: {
          duplicateMsg: e => `Mehrfache Definition von '${e}'`,
          duplicateTitle:
            "Das Dokument enthält mehrere Definitionen dieses Eintrags.",
        },
        zh: {
          duplicateMsg: e => `'${e}' 的重复定义`,
          duplicateTitle: "在文档中有重复的定义。",
        },
        cs: {
          duplicateMsg: e => `Duplicitní definice '${e}'`,
          duplicateTitle: "Toto je v dokumentu definováno vícekrát.",
        },
      },
      yl = Dr(bl);
    function wl(e) {
      const t = new Map(),
        n = [];
      for (const r of ec.get(e) ?? []) {
        const { dfnType: s = "dfn" } = r.dataset,
          i = r.dataset.dfnFor?.split(",").map(e => e.trim()) ?? [""];
        for (const o of i) {
          if (t.has(o) && t.get(o)?.has(s)) {
            const e = t.get(o)?.get(s),
              i = "dfn" === e?.localName,
              a = "dfn" === r.localName,
              c = s === (e?.dataset.dfnType || "dfn"),
              l =
                (!o && !e?.dataset.dfnFor) ||
                e?.dataset.dfnFor
                  ?.split(",")
                  .map(e => e.trim())
                  .includes(o);
            if (i && a && c && l) {
              n.push(r);
              continue;
            }
          }
          (t.has(o) || t.set(o, new Map()),
            t.get(o)?.set(s, r),
            ("idl" in r.dataset || "dfn" !== s) && t.get(o)?.set("idl", r),
            Br(r, "dfn", e));
        }
      }
      return { result: t, duplicates: n };
    }
    function kl(e, t) {
      const n = (function (e) {
          const t = e.closest("[data-link-for]"),
            n = t ? (t.dataset.linkFor ?? "") : "",
            r = Hr(e).reduce((e, r) => {
              const s = r.split(".");
              return (
                2 === s.length && e.push({ for: s[0], title: s[1] }),
                e.push({ for: n, title: r }),
                t || e.push({ for: r, title: r }),
                "" !== n && e.push({ for: "", title: r }),
                e
              );
            }, []);
          return r;
        })(e),
        r = n.find(e => t.has(e.title) && t.get(e.title)?.has(e.for));
      if (!r) return;
      const s = t.get(r.title)?.get(r.for),
        { linkType: i } = e.dataset;
      if (i) {
        for (const e of i.split("|")) if (s?.get(e)) return s.get(e);
        return s?.get("dfn");
      }
      {
        const e = r.for ? "idl" : "dfn";
        return s?.get(e) || s?.get("idl");
      }
    }
    function vl(e, t, n) {
      let r = !1;
      const { linkFor: s } = e.dataset,
        { dfnFor: i } = t.dataset;
      if (t.dataset.cite) e.dataset.cite = t.dataset.cite;
      else if (
        s &&
        !n.get(s) &&
        i &&
        !i
          .split(",")
          .map(e => e.trim())
          .includes(s)
      )
        r = !0;
      else if (t.classList.contains("externalDFN")) {
        const n = t.dataset.lt ? t.dataset.lt.split("|") : [];
        ((e.dataset.lt = n[0] || t.textContent), (r = !0));
      } else
        "partial" !== e.dataset.idl
          ? ((e.href = `#${t.id}`), e.classList.add("internalDFN"))
          : (r = !0);
      return (
        e.hasAttribute("data-link-type") ||
          (e.dataset.linkType = "idl" in t.dataset ? "idl" : "dfn"),
        (function (e) {
          if (e.closest("code,pre")) return !0;
          if (1 !== e.childNodes.length) return !1;
          const [t] = e.childNodes;
          return "code" === t.localName;
        })(t) &&
          (function (e, t) {
            const n = e.textContent.trim(),
              r = t.dataset.hasOwnProperty("idl"),
              s = $l(e) && $l(t, n);
            (r && !s) || Jr(e, document.createElement("code"));
          })(e, t),
        !r
      );
    }
    function $l(e, t = "") {
      if ("a" === e.localName) {
        if (!e.querySelector("code")) return !0;
      } else {
        const { dataset: n } = e;
        if (e.textContent.trim() === t) return !0;
        if (n.title === t) return !0;
        if (n.lt || n.localLt) {
          const e = [];
          return (
            n.lt && e.push(...n.lt.split("|")),
            n.localLt && e.push(...n.localLt.split("|")),
            e.includes(t)
          );
        }
      }
      return !1;
    }
    function xl(e) {
      e.forEach(e => {
        const t = `Found linkless \`<a>\` element with text "${e.textContent}" but no matching \`<dfn>\``,
          n = e.closest("[data-link-for]"),
          r = `Add a matching \`<dfn>\` element, ${ds`use ${"[data-cite]"} to link to an external definition, or enable ${"[xref]"} for automatic cross-spec linking.`}${n ? ` This link is inside a \`data-link-for="${n.dataset.linkFor}"\` section — \`[=term=]\` links are scoped to that context. To link to a global concept instead, either add \`data-link-for=""\` on this \`<a>\` or move it outside the scoped section.` : ""}`;
        is(t, ml, {
          title: "Linking error: no matching `<dfn>`",
          hint: r,
          elements: [e],
        });
      });
    }
    var Cl = Object.freeze({
      __proto__: null,
      name: ml,
      possibleExternalLinks: gl,
      run: async function (e) {
        const t = (function () {
            const e = new ns();
            for (const t of ec.keys()) {
              const { result: n, duplicates: r } = wl(t);
              (e.set(t, n),
                r.length > 0 &&
                  ss(yl.duplicateMsg(t), ml, {
                    title: yl.duplicateTitle,
                    elements: r,
                  }));
            }
            return e;
          })(),
          n = [],
          r = document.querySelectorAll(
            "a[data-cite='']:not([data-no-link-to-dfn]), a:not([href]):not([data-cite]):not([data-no-link-to-dfn]):not(.logo):not(.externalDFN)"
          );
        for (const e of r) {
          if (!e.dataset?.linkType && e.dataset?.xrefType) {
            gl.push(e);
            continue;
          }
          const r = kl(e, t);
          if (r) {
            vl(e, r, t) || gl.push(e);
          } else "" === e.dataset.cite ? n.push(e) : gl.push(e);
        }
        (xl(n),
          (function (e) {
            const { shortName: t = "" } = e,
              n = new RegExp(String.raw`^([?!])?${vr(t)}\b([^-])`, "i"),
              r = document.querySelectorAll(
                "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
              );
            for (const t of r) {
              t.dataset.cite = (t.dataset.cite ?? "").replace(n, `$1${ol}$2`);
              const { key: r, isNormative: s } = pl(t);
              r !== ol &&
                (s || e.normativeReferences.has(r)
                  ? (e.normativeReferences.add(r),
                    e.informativeReferences.delete(r))
                  : e.informativeReferences.add(r));
            }
          })(e),
          e.xref || xl(gl));
      },
    });
    const _l = "xrefs",
      Sl = 3e5;
    async function Tl() {
      return await ar.openDB("xref", 2, {
        upgrade(e) {
          [...e.objectStoreNames].forEach(t => e.deleteObjectStore(t));
          e.createObjectStore(_l, { keyPath: "query.id" }).createIndex(
            "byTerm",
            "query.term",
            { unique: !1 }
          );
        },
      });
    }
    async function El(e) {
      const t = new Map();
      if (
        await (async function () {
          const e = "XREF:LAST_VERSION_CHECK",
            t = parseInt(localStorage.getItem(e) ?? "", 10),
            n = Date.now();
          if (!t) return (localStorage.setItem(e, n.toString()), !1);
          if (n - t < Sl) return !1;
          const r = new URL("meta/version", Ll).href,
            s = await fetch(r);
          if (!s.ok) return !1;
          const i = await s.text();
          return (localStorage.setItem(e, n.toString()), parseInt(i, 10) > t);
        })()
      )
        return (
          await (async function () {
            try {
              await Tl().then(e => e.clear(_l));
            } catch (e) {
              console.error(e);
            }
          })(),
          t
        );
      const n = new Set(e.map(e => e.id));
      try {
        const e = await Tl();
        let r = await e.transaction(_l).store.openCursor();
        for (; r; )
          (n.has(r.key) && t.set(r.key, r.value.result),
            (r = await r.continue()));
      } catch (e) {
        console.error(e);
      }
      return t;
    }
    const Rl = "core/xref",
      Al = {
        "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"],
      },
      Ll = "https://respec.org/xref/",
      Pl = [];
    if (
      !document.querySelector(
        "link[rel='preconnect'][href='https://respec.org']"
      )
    ) {
      const e = Sr({ hint: "preconnect", href: "https://respec.org" });
      document.head.appendChild(e);
    }
    function Nl(e) {
      const t = "xrefType" in e.dataset;
      let n = Il(e);
      t || (n = n.toLowerCase());
      const r = (function (e) {
          const t = [];
          let n = e.closest("[data-cite]");
          for (; n; ) {
            const r = (n.dataset.cite ?? "")
              .toLowerCase()
              .replace(/[!?]/g, "")
              .split(/\s+/)
              .filter(e => e);
            if ((r.length && t.push(r), n === e)) break;
            n = n.parentElement?.closest("[data-cite]") ?? null;
          }
          if (n !== e) {
            const n = e.closest("section"),
              r = [...(n ? n.querySelectorAll("a.bibref") : [])].map(e =>
                e.textContent.toLowerCase()
              );
            r.length && t.push(r);
          }
          const r = (function (e) {
            const t = [];
            for (const n of e) {
              const e = t[t.length - 1] || [],
                r = [...new Set(n)].filter(t => !e.includes(t));
              t.push(r.sort());
            }
            return t;
          })(t);
          return r;
        })(e),
        s = (function (e, t) {
          if (t)
            return e.dataset.xrefType
              ? e.dataset.xrefType.split("|")
              : ["_IDL_"];
          return ["_CONCEPT_"];
        })(e, t),
        i = (function (e, t) {
          if (e.dataset.xrefFor) return Ir(e.dataset.xrefFor);
          if (t) {
            const t = e.closest("[data-xref-for]");
            if (t) return Ir(t.dataset.xrefFor ?? "");
          }
          return null;
        })(e, t);
      return {
        id: "",
        term: n,
        types: s,
        ...(r.length && { specs: r }),
        ...("string" == typeof i && { for: i }),
      };
    }
    function Il(e) {
      const { lt: t } = e.dataset;
      let n = t ? t.split("|", 1)[0] : e.textContent;
      return ((n = Ir(n)), "the-empty-string" === n ? "" : n);
    }
    function Dl(e, t, n, r) {
      const { term: s, specs: i = [] } = t,
        { uri: o, shortname: a, spec: c, normative: l, type: u, for: d } = n,
        p = i.flat().includes(c) ? c : a,
        h = new URL(o, "https://partial");
      let { pathname: f } = h;
      "/" === f && (f = "");
      const m = {
        cite: p,
        citePath: f,
        citeFrag: h.hash.slice(1),
        linkType: u,
      };
      (d && (m.linkFor = d[0]),
        h.origin && "https://partial" !== h.origin && (m.citeHref = h.href),
        Object.assign(e.dataset, m),
        (function (e, t, n, r, s) {
          const i = (function (e) {
            const t = e.closest(".normative"),
              n = e.closest(_r);
            return !n || e === t || (t && n && n.contains(t));
          })(e);
          if (!i)
            return void (
              s.normativeReferences.has(t) || s.informativeReferences.add(t)
            );
          if (n) {
            const e = s.informativeReferences.has(t)
              ? (s.informativeReferences.getCanonicalKey(t) ?? t)
              : t;
            return (
              s.normativeReferences.add(e),
              void s.informativeReferences.delete(e)
            );
          }
          Pl.push({ term: r, spec: t, element: e });
        })(e, p, l, s, r));
    }
    function Ol(e) {
      const t = JSON.stringify(e, Object.keys(e).sort()),
        n = new TextEncoder().encode(t);
      return crypto.subtle.digest("SHA-1", n).then(jl);
    }
    function jl(e) {
      const t = new Uint8Array(e);
      return (
        t.toHex?.() ?? [...t].map(e => e.toString(16).padStart(2, "0")).join("")
      );
    }
    function zl(e) {
      const t = e.querySelectorAll(
          "a[data-xref-for], a[data-xref-type], a[data-link-for]"
        ),
        n = ["data-xref-for", "data-xref-type", "data-link-for"];
      t.forEach(e => {
        n.forEach(t => e.removeAttribute(t));
      });
    }
    var Ml = Object.freeze({
      __proto__: null,
      API_URL: Ll,
      getTermFromElement: Il,
      informativeRefsInNormative: Pl,
      name: Rl,
      run: async function (e) {
        if (!e.xref) return;
        const t = (function (e) {
          const t = { url: new URL("search/", Ll).href, specs: null },
            n = Object.assign({}, t);
          switch (Array.isArray(e) ? "array" : typeof e) {
            case "boolean":
              break;
            case "string": {
              const t = e;
              t.toLowerCase() in Al
                ? Object.assign(n, { specs: Al[t.toLowerCase()] })
                : r(t);
              break;
            }
            case "array":
              Object.assign(n, { specs: e });
              break;
            case "object": {
              const t = e;
              if ((Object.assign(n, t), t.profile)) {
                const e = t.profile.toLowerCase();
                if (e in Al) {
                  const r = (t.specs ?? []).concat(Al[e]);
                  Object.assign(n, { specs: r });
                } else r(t.profile);
              }
              break;
            }
            default: {
              const t = ds`Expected: \`true\`, a profile name (e.g. \`"web-platform"\`), an array of spec shortnames (e.g. \`["FETCH", "DOM"]\`), or an object with \`url\`, \`specs\`, or \`profile\` properties. See ${"[xref]"}.`;
              ss(
                `Invalid value for \`xref\` configuration option. Received: "${e}".`,
                Rl,
                { hint: t }
              );
            }
          }
          return n;
          function r(e) {
            ss(
              `Invalid profile "${e}" in \`respecConfig.xref\`. Please use one of the supported profiles: ${Pr(Object.keys(Al), e => `"${e}"`)}.`,
              Rl
            );
          }
        })(e.xref);
        if (t.specs) {
          const e = document.body.dataset.cite
            ? document.body.dataset.cite.split(/\s+/)
            : [];
          document.body.dataset.cite = e.concat(t.specs).join(" ");
        }
        const n = gl.concat(
          (function () {
            const e = document.querySelectorAll(
                ":is(a,dfn)[data-cite]:not([data-cite=''],[data-cite*='#'])"
              ),
              t = document.querySelectorAll("dfn.externalDFN");
            return [...e]
              .filter(e => {
                if ("" === e.textContent.trim()) return !1;
                const t = e.closest("[data-cite]");
                return !t || "" !== t.dataset.cite;
              })
              .concat(...t);
          })()
        );
        if (!n.length) return;
        const r = [];
        for (const e of n) {
          const t = Nl(e);
          ((t.id = await Ol(t)), r.push(t));
        }
        const s = await (async function (e, t) {
          const n = new Set(),
            r = e.filter(e => !n.has(e.id) && n.add(e.id) && !0),
            s = await El(r),
            i = r.filter(e => !s.get(e.id)),
            o = await (async function (e, t) {
              if (!e.length) return new Map();
              const n = {
                  method: "POST",
                  body: JSON.stringify({ queries: e }),
                  headers: { "Content-Type": "application/json" },
                },
                r = await fetch(t, n),
                s = await r.json();
              return new Map(s.results.map(({ id: e, result: t }) => [e, t]));
            })(i, t);
          o.size &&
            (await (async function (e, t) {
              try {
                const n = (await Tl()).transaction(_l, "readwrite");
                for (const r of e) {
                  const e = t.get(r.id) ?? [];
                  n.objectStore(_l).add({ query: r, result: e });
                }
                await n.done;
              } catch (e) {
                console.error(e);
              }
            })(r, o));
          return new Map([...s, ...o]);
        })(r, t.url);
        (!(function (e, t, n, r) {
          const s = { ambiguous: new Map(), notFound: new Map() };
          for (let i = 0, o = e.length; i < o; i++) {
            if (e[i].closest("[data-no-xref]")) continue;
            const o = e[i],
              a = t[i],
              { id: c } = a,
              l = n.get(c) ?? [];
            if (1 === l.length) Dl(o, a, l[0], r);
            else {
              const e = s[0 === l.length ? "notFound" : "ambiguous"];
              (e.has(c) || e.set(c, { elems: [], results: l, query: a }),
                e.get(c)?.elems.push(o));
            }
          }
          !(function ({ ambiguous: e, notFound: t }) {
            const n = (e, t, n = []) => {
                const r = new URL(Ll);
                return (
                  r.searchParams.set("term", e),
                  t.for && r.searchParams.set("for", t.for),
                  r.searchParams.set("types", t.types.join(",")),
                  n.length && r.searchParams.set("specs", n.join(",")),
                  r.href
                );
              },
              r = (e, t) =>
                ds`[See search matches for "${t}"](${e}) or ${"[Learn about this error|#error-term-not-found]"}.`;
            for (const { query: e, elems: s } of t.values()) {
              const t = e.specs ? [...new Set(e.specs.flat())].sort() : [],
                i = Il(s[0]),
                o = n(i, e),
                a = Lr(t, e => `**[${e}]**`),
                c = r(o, i);
              ss(
                `Couldn't find "**${i}**"${e.for ? `, for **"${e.for}"**, ` : ""} in this document or other cited documents: ${a}.`,
                Rl,
                { title: "No matching definition found.", elements: s, hint: c }
              );
            }
            for (const { query: t, elems: s, results: i } of e.values()) {
              const e = [...new Set(i.map(e => e.shortname))].sort(),
                o = Lr(e, e => `**[${e}]**`),
                a = Il(s[0]),
                c = n(a, t, e),
                l = t.for ? `, for **"${t.for}"**, ` : "",
                u = r(c, a),
                d =
                  ds`To fix, use the ${"[data-cite]"} attribute to pick the one you mean from the appropriate specification.` +
                  String.raw` ${u}`;
              ss(
                `The term "**${a}**"${l} is ambiguous because it's defined in ${o}.`,
                Rl,
                { title: "Definition is ambiguous.", elements: s, hint: d }
              );
            }
          })(s);
        })(n, r, s, e),
          ms("beforesave", zl));
      },
    });
    var ql = String.raw`ul.index{columns:30ch;column-gap:1.5em}
ul.index li{list-style:inherit}
ul.index li span{color:inherit;cursor:pointer;white-space:normal}
#index-defined-here ul.index li{font-size:.9rem}
ul.index code{color:inherit}
#index-defined-here .print-only{display:none}
@media print{
#index-defined-here .print-only{display:initial}
}`;
    const Ul = Dr({
        en: {
          heading: "Index",
          headingExternal: "Terms defined by reference",
          headingLocal: "Terms defined by this specification",
          dfnOf: "definition of",
          definesFollowing: "defines the following:",
        },
        cs: {
          heading: "Glosář",
          headingExternal: "Termíny definované odkazem",
          headingLocal: "Termíny definované touto specifikací",
          dfnOf: "definice",
          definesFollowing: "definuje následující:",
        },
        de: {
          heading: "Index",
          headingExternal: "Begriffe, die durch Verweis definiert sind",
          headingLocal: "Begriffe, die in dieser Spezifikation definiert sind",
          dfnOf: "Definition von",
          definesFollowing: "definiert Folgendes:",
        },
        es: {
          heading: "Índice",
          headingExternal: "Términos definidos por referencia",
          headingLocal: "Términos definidos por esta especificación",
          dfnOf: "definición de",
          definesFollowing: "define lo siguiente:",
        },
        ja: {
          heading: "索引",
          headingExternal: "参照によって定義された用語",
          headingLocal: "この仕様で定義された用語",
          dfnOf: "の定義",
          definesFollowing: "以下を定義します:",
        },
        ko: {
          heading: "색인",
          headingExternal: "참조로 정의된 용어",
          headingLocal: "이 명세서에서 정의된 용어",
          dfnOf: "정의",
          definesFollowing: "다음을 정의합니다:",
        },
        nl: {
          heading: "Index",
          headingExternal: "Termen gedefinieerd door verwijzing",
          headingLocal: "Termen gedefinieerd door deze specificatie",
          dfnOf: "definitie van",
          definesFollowing: "definieert het volgende:",
        },
        zh: {
          heading: "索引",
          headingExternal: "通过引用定义的术语",
          headingLocal: "由本规范定义的术语",
          dfnOf: "的定义",
          definesFollowing: "定义以下内容:",
        },
      }),
      Wl = new Set([
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
    function Fl(e) {
      const t = e.dataset,
        n = t.dfnType || t.idl || t.linkType || "";
      switch (n) {
        case "":
        case "dfn":
          return "";
        default:
          return n;
      }
    }
    function Bl(e) {
      const t = e.closest("[data-dfn-for]:not([data-dfn-for=''])");
      return t?.dataset.dfnFor || "";
    }
    function Hl(e, t, n = "") {
      if (n.startsWith("[[")) {
        return `internal slot for <code>${Bl(e)}</code>`;
      }
      switch (t) {
        case "dict-member":
        case "method":
        case "attribute":
        case "enum-value":
          return `${"dict-member" === t ? "member" : t.replace("-", " ")} for <code>${Bl(e)}</code>`;
        case "interface":
        case "dictionary":
        case "enum":
          return t;
        case "constructor":
          return `for <code>${Bl(e)}</code>`;
        default:
          return "";
      }
    }
    function Gl() {
      document
        .querySelectorAll("#index-defined-here li[data-id]")
        .forEach(e => {
          const t = (e => {
            const t = document.getElementById(e),
              n = t?.closest("section:not(.notoc)")?.querySelector(".secno");
            if (!n) return null;
            const r = `§${n.textContent.trim()}`;
            return or`<span class="print-only">${r}</span>`;
          })(e.dataset.id ?? "");
          t && e.append(t);
        });
    }
    function Vl() {
      const e = new Set(),
        t = new Map(),
        n = document.querySelectorAll("a[data-cite]");
      for (const r of n) {
        if (!r.dataset.cite) continue;
        const { cite: n, citeFrag: s, xrefType: i, linkType: o } = r.dataset;
        if (!(i || o || n.includes("#") || s)) continue;
        const a = r.href;
        if (e.has(a)) continue;
        const { linkType: c, linkFor: l } = r.dataset,
          u = Il(r);
        if (!u) continue;
        const d = pl(r).key.toUpperCase(),
          p = t.get(d) || t.set(d, []).get(d);
        (p?.push({ term: u, type: c, linkFor: l, elem: r }), e.add(a));
      }
      return t;
    }
    function Jl(e) {
      const { elem: t } = e,
        n = (function (e) {
          const { term: t, type: n, linkFor: r } = e;
          let s = Nr(t);
          Wl.has(n ?? "") &&
            ("extended-attribute" === n && (s = `[${s}]`),
            (s = `<code>${s}</code>`));
          const i = Yl.has(t) ? "type" : Kl.get(n ?? "");
          i && (s += ` ${i}`);
          if (r) {
            let e = r;
            (/\s/.test(r) || (e = `<code>${e}</code>`),
              "element-attr" === n && (e += " element"),
              (s += ` (for ${e})`));
          }
          return s;
        })(e);
      return or`<li>
    <span class="index-term" data-href="${t.href}">${{ html: n }}</span>
  </li>`;
    }
    const Kl = new Map([
        ["attribute", "attribute"],
        ["element-attr", "attribute"],
        ["element", "element"],
        ["enum", "enum"],
        ["exception", "exception"],
        ["extended-attribute", "extended attribute"],
        ["interface", "interface"],
      ]),
      Yl = new Set([
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
        "undefined",
        "any",
        "object",
        "symbol",
      ]);
    function Zl(e) {
      (e
        .querySelectorAll("#index-defined-elsewhere li[data-spec]")
        .forEach(e => e.removeAttribute("data-spec")),
        e
          .querySelectorAll("#index-defined-here li[data-id]")
          .forEach(e => e.removeAttribute("data-id")));
    }
    var Xl = Object.freeze({
      __proto__: null,
      name: "core/dfn-index",
      run: function () {
        const e = document.querySelector("section#index");
        if (!e) return void ms("toc", () => {}, { once: !0 });
        const t = document.createElement("style");
        ((t.textContent = ql),
          document.head.appendChild(t),
          e.classList.add("appendix"),
          e.querySelector("h2, h1") || e.prepend(or`<h1>${Ul.heading}</h1>`));
        const n = or`<section id="index-defined-here">
    <h3>${Ul.headingLocal}</h3>
    ${(function () {
      const e = (function () {
        const e = new Map(),
          t = document.querySelectorAll("dfn:not([data-cite])");
        for (const n of t) {
          if (!n.id) continue;
          const t = Ir(n.textContent),
            r = e.get(t) || e.set(t, []).get(t);
          r?.push(n);
        }
        const n = [...e].sort(([e], [t]) =>
          e.slice(e.search(/\w/)).localeCompare(t.slice(t.search(/\w/)))
        );
        return n;
      })();
      return or`<ul class="index">
    ${e.map(([e, t]) =>
      (function (e, t) {
        const n = (e, t, n = "") => {
          const r = `#${e.id}`;
          return or`<li data-id=${e.id}>
      <a class="index-term" href="${r}">${{ html: t }}</a> ${n ? { html: n } : ""}
    </li>`;
        };
        if (1 === t.length) {
          const r = t[0],
            s = Fl(r),
            i = (function (e, t, n) {
              let r = n;
              "enum-value" === t && (r = `"${r}"`);
              (Wl.has(t) || e.dataset.idl || e.closest("code")) &&
                (r = `<code>${r}</code>`);
              return r;
            })(r, s, e),
            o = Hl(r, s, e);
          return n(r, i, o);
        }
        return or`<li>
    ${e}
    <ul>
      ${t.map(t => {
        const r = Hl(t, Fl(t), e) || Ul.dfnOf;
        return n(t, r);
      })}
    </ul>
  </li>`;
      })(e, t)
    )}
  </ul>`;
    })()}
  </section>`;
        e.append(n);
        const r = or`<section id="index-defined-elsewhere">
    <h3>${Ul.headingExternal}</h3>
    ${(function () {
      const e = [...Vl().entries()].sort(([e], [t]) => e.localeCompare(t)),
        t = document.querySelector("section#index"),
        n = !!t?.classList.contains("prefer-full-spec-title");
      return or`<ul class="index">
    ${e.map(([e, t]) => {
      let r;
      return (
        (r = n && ia[e]?.title ? va(e, ia[e].title) : va(e)),
        or`<li data-spec="${e}">
        ${r} ${Ul.definesFollowing}
        <ul>
          ${t.sort((e, t) => e.term.localeCompare(t.term)).map(Jl)}
        </ul>
      </li>`
      );
    })}
  </ul>`;
    })()}
  </section>`;
        e.append(r);
        for (const e of r.querySelectorAll(".index-term")) Br(e, "index-term");
        (ms("toc", Gl, { once: !0 }), ms("beforesave", Zl));
      },
    });
    const Ql = "core/contrib";
    var eu = Object.freeze({
      __proto__: null,
      name: Ql,
      run: async function (e) {
        if (!document.getElementById("gh-contributors")) return;
        if (!e.github) {
          return void ss(
            ds`Requested list of contributors from GitHub, but ${"[github]"} configuration option is not set.`,
            Ql
          );
        }
        const t = (e.editors ?? []).map(e => e.name),
          n = `${e.github.apiBase}/${e.github.fullName}/`;
        await (async function (e, t) {
          const n = document.getElementById("gh-contributors");
          if (!n) return;
          n.textContent = "Fetching list of contributors...";
          const r = await s();
          null !== r
            ? (function (e, t) {
                const n = e.sort((e, t) => {
                  const n = e.name || e.login,
                    r = t.name || t.login;
                  return n.toLowerCase().localeCompare(r.toLowerCase());
                });
                if ("UL" === t.tagName)
                  return void or(
                    t
                  )`${n.map(({ name: e, login: t }) => `<li><a href="https://github.com/${t}">${e || t}</a></li>`)}`;
                const r = n.map(e => e.name || e.login);
                t.textContent = Lr(r);
              })(r, n)
            : (n.textContent = "Failed to fetch contributors.");
          async function s() {
            const { href: n } = new URL("contributors", t);
            try {
              const t = await Mr(n);
              if (!t.ok)
                throw new Error(
                  `Request to ${n} failed with status code ${t.status}`
                );
              return (await t.json()).filter(
                t =>
                  !e.includes(t.name || t.login) && !t.login.includes("[bot]")
              );
            } catch (e) {
              return (
                ss("Error loading contributors from GitHub.", Ql, { cause: e }),
                null
              );
            }
          }
        })(t, n);
      },
    });
    var tu = Object.freeze({
      __proto__: null,
      name: "core/fix-headers",
      run: function () {
        [...document.querySelectorAll("section:not(.introductory)")]
          .map(e => e.querySelector("h1, h2, h3, h4, h5, h6"))
          .filter(e => null !== e)
          .forEach(e => {
            const t = Math.min(
              (function (e, t) {
                const n = [];
                for (; e && e != e.ownerDocument.body; )
                  (e.matches(t) && n.push(e), (e = e.parentElement));
                return n;
              })(e, "section").length + 1,
              6
            );
            Gr(e, `h${t}`);
          });
      },
    });
    var nu = Object.freeze({
      __proto__: null,
      name: "core/webidl-index",
      run: function () {
        const e = document.querySelector("section#idl-index");
        if (!e) return;
        const t = [2, 3, 4, 5, 6].map(e => `h${e}:first-child`).join(",");
        if (!e.querySelector(t)) {
          const t = document.createElement("h2");
          (e.title
            ? ((t.textContent = e.title), e.removeAttribute("title"))
            : (t.textContent = "IDL Index"),
            e.prepend(t));
        }
        const n = Array.from(
          document.querySelectorAll("pre.idl:not(.exclude) > code")
        ).filter(e => !e.closest(_r));
        if (0 === n.length) {
          const t =
            "This specification doesn't normatively declare any Web IDL.";
          return void e.append(t);
        }
        const r = document.createElement("pre");
        (r.classList.add("idl", "def"),
          (r.id = "actual-idl-index"),
          n
            .map(e => {
              const t = document.createDocumentFragment();
              for (const n of e.children) t.appendChild(n.cloneNode(!0));
              return t;
            })
            .forEach(e => {
              (r.lastChild && r.append("\n\n"), r.appendChild(e));
            }),
          r.querySelectorAll("*[id]").forEach(e => e.removeAttribute("id")),
          e.appendChild(r),
          Jr(r, document.createElement("code")),
          Yc(r));
      },
    });
    function ru(e, t) {
      const n = document.createElement("pre");
      (n.classList.add("cddl", "def", "highlight"), t && (n.id = t));
      const r = document.createElement("code");
      return (
        e
          .map(e => {
            const t = document.createDocumentFragment();
            return (
              e.childNodes.forEach(e => t.appendChild(e.cloneNode(!0))),
              t
            );
          })
          .forEach(e => {
            (r.lastChild && r.append("\n\n"), r.appendChild(e));
          }),
        r.querySelectorAll("*[id]").forEach(e => e.removeAttribute("id")),
        n.append(r),
        n
      );
    }
    var su = Object.freeze({
      __proto__: null,
      name: "core/cddl-index",
      run: function () {
        const e = document.querySelector("section#cddl-index");
        if (!e) return;
        if (!e.querySelector(":scope > :is(h2, h3, h4, h5, h6):first-child")) {
          const t = document.createElement("h2");
          (e.title
            ? ((t.textContent = e.title), e.removeAttribute("title"))
            : (t.textContent = "CDDL Index"),
            e.prepend(t));
        }
        const t = Array.from(
          document.querySelectorAll("pre.cddl:not(.exclude) > code")
        ).filter(e => !e.closest(_r));
        if (0 === t.length) {
          const t = "This specification doesn't normatively declare any CDDL.";
          return void e.append(t);
        }
        const n = new Map();
        for (const e of t) {
          const t = e.closest("pre"),
            r = t?.dataset.cddlModule || "";
          let s = n.get(r);
          (s || ((s = []), n.set(r, s)), s.push(e));
        }
        n.size > 1 || (1 === n.size && !n.has(""))
          ? n.forEach((t, n) => {
              const r = document.createElement("section"),
                s = document.createElement("h3"),
                i = n || "Default";
              ((s.textContent = `Module: ${i}`),
                n &&
                  (s.id = `cddl-index-module-${n.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
                r.append(s),
                r.append(ru(t)),
                e.append(r));
            })
          : e.append(ru(t, "actual-cddl-index"));
      },
    });
    const iu = ["h2", "h3", "h4", "h5", "h6"],
      ou = "core/structure",
      au = Dr({
        en: { toc: "Table of Contents", back_to_top: "Back to Top" },
        zh: { toc: "内容大纲", back_to_top: "返回顶部" },
        ko: { toc: "목차", back_to_top: "맨 위로" },
        ja: { toc: "目次", back_to_top: "先頭に戻る" },
        nl: { toc: "Inhoudsopgave", back_to_top: "Terug naar boven" },
        es: { toc: "Tabla de Contenidos", back_to_top: "Volver arriba" },
        de: { toc: "Inhaltsverzeichnis", back_to_top: "Zurück nach oben" },
        cs: { toc: "Obsah", back_to_top: "Zpět na začátek" },
      });
    function cu(e, t, { prefix: n = "" } = {}) {
      let r = !1,
        s = 0,
        i = 1;
      if ((n.length && !n.endsWith(".") && (n += "."), 0 === e.length))
        return null;
      const o = or`<ol class="toc"></ol>`;
      for (const a of e) {
        !a.isAppendix || n || r || ((s = i), (r = !0));
        let e = a.isIntro ? "" : r ? lu(i - s + 1) : n + i;
        const c = e.split(".").length;
        if (
          (1 === c &&
            ((e += "."), a.header.before(document.createComment("OddPage"))),
          a.isIntro ||
            ((i += 1), a.header.prepend(or`<bdi class="secno">${e} </bdi>`)),
          c <= t)
        ) {
          const n = a.header.id || a.element.id,
            r = du(a.header, n),
            s = cu(a.subsections, t, { prefix: e });
          (s && r.append(s), o.append(r));
        }
      }
      return o;
    }
    function lu(e) {
      let t = "";
      for (; e > 0; )
        ((e -= 1),
          (t = String.fromCharCode(65 + (e % 26)) + t),
          (e = Math.floor(e / 26)));
      return t;
    }
    function uu(e) {
      const t = e.querySelectorAll(":scope > section"),
        n = [];
      for (const e of t) {
        const t = e.classList.contains("notoc");
        if (!e.children.length || t) continue;
        const r = e.children[0];
        if (!iu.includes(r.localName)) continue;
        const s = r.textContent;
        (Br(e, void 0, s),
          n.push({
            element: e,
            header: r,
            title: s,
            isIntro: Boolean(e.closest(".introductory")),
            isAppendix: e.classList.contains("appendix"),
            subsections: uu(e),
          }));
      }
      return n;
    }
    function du(e, t) {
      const n = or`<a href="${`#${t}`}" class="tocxref" />`;
      var r;
      return (
        n.append(...e.cloneNode(!0).childNodes),
        (r = n).querySelectorAll("a").forEach(e => {
          const t = Gr(e, "span");
          ((t.className = "formerLink"), t.removeAttribute("href"));
        }),
        r.querySelectorAll("dfn").forEach(e => {
          Gr(e, "span").removeAttribute("id");
        }),
        or`<li class="tocline">${n}</li>`
      );
    }
    var pu = Object.freeze({
      __proto__: null,
      name: ou,
      run: function (e) {
        if (
          ("maxTocLevel" in e == !1 && (e.maxTocLevel = 1 / 0),
          (function () {
            const e = [
              ...document.querySelectorAll(
                "section:not(.introductory) :is(h1,h2,h3,h4,h5,h6):first-child"
              ),
            ].filter(e => !e.closest("section.introductory"));
            if (!e.length) return;
            e.forEach(e => {
              const t = `h${Math.min(Yr(e, "section").length + 1, 6)}`;
              e.localName !== t && Gr(e, t);
            });
          })(),
          !e.noTOC)
        ) {
          !(function () {
            const e = document.querySelectorAll("section[data-max-toc]");
            for (const t of e) {
              const e = parseInt(t.dataset.maxToc ?? "", 10);
              if (e < 0 || e > 6 || Number.isNaN(e)) {
                ss(
                  "`data-max-toc` must have a value between 0-6 (inclusive).",
                  ou,
                  { elements: [t] }
                );
                continue;
              }
              if (0 === e) {
                t.classList.add("notoc");
                continue;
              }
              const n = t.querySelectorAll(
                `:scope > ${Array.from({ length: e }, () => "section").join(" > ")}`
              );
              for (const e of n) e.classList.add("notoc");
            }
          })();
          const t = cu(uu(document.body), e.maxTocLevel);
          t &&
            (function (e) {
              if (!e) return;
              const t = or`<nav id="toc"></nav>`,
                n = or`<h2 class="introductory">${au.toc}</h2>`;
              (Br(n), t.append(n, e));
              const r =
                document.getElementById("toc") ||
                document.getElementById("sotd") ||
                document.getElementById("abstract");
              r && ("toc" === r.id ? r.replaceWith(t) : r.after(t));
              const s = or`<p role="navigation" id="back-to-top">
    <a href="#title"><abbr title="${au.back_to_top}">&uarr;</abbr></a>
  </p>`;
              document.body.append(s);
            })(t);
        }
        fs("toc", void 0);
      },
    });
    const hu = Dr({
      en: { informative: "This section is non-normative." },
      nl: { informative: "Dit onderdeel is niet-normatief." },
      ko: { informative: "이 부분은 비규범적입니다." },
      ja: { informative: "この節は仕様には含まれません．" },
      de: { informative: "Dieser Abschnitt ist nicht normativ." },
      zh: { informative: "本章节不包含规范性内容。" },
      cs: { informative: "Tato sekce není normativní." },
    });
    var fu = Object.freeze({
      __proto__: null,
      name: "core/informative",
      run: function () {
        Array.from(document.querySelectorAll("section.informative"))
          .map(e => e.querySelector("h2, h3, h4, h5, h6"))
          .filter(e => null !== e)
          .forEach(e => {
            e.after(or`<p><em>${hu.informative}</em></p>`);
          });
      },
    });
    const mu = Dr({
      en: {
        permalinkLabel(e, t) {
          let n = `Permalink for${t ? "" : " this"} ${e}`;
          return (t && (n += ` ${Ir(t.textContent)}`), n);
        },
      },
    });
    var gu = Object.freeze({
      __proto__: null,
      name: "core/id-headers",
      run: function (e) {
        const t = document.querySelectorAll(
          "section:not(.head,#abstract,#sotd) h2, h3, h4, h5, h6"
        );
        for (const n of t) {
          let t = n.id;
          if (
            (t || (Br(n), (t = n.parentElement?.id || n.id)),
            !e.addSectionLinks)
          )
            continue;
          const r = mu.permalinkLabel(
              n.closest(".appendix") ? "Appendix" : "Section",
              n.querySelector(":scope > bdi.secno")
            ),
            s = or`<div class="header-wrapper"></div>`;
          n.replaceWith(s);
          const i = or`<a
      href="#${t}"
      class="self-link"
      aria-label="${r}"
    ></a>`;
          s.append(n, i);
        }
      },
    });
    var bu = String.raw`.caniuse-stats{display:flex;column-gap:2em}
.caniuse-group{display:flex;flex:1;flex-direction:column;justify-content:flex-end;flex-basis:auto}
.caniuse-browsers{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;margin-top:.2em;column-gap:.4em;border-bottom:1px solid #ccc;row-gap:.4em;padding-bottom:.4cm}
.caniuse-type{align-self:center;border-top:none;text-transform:capitalize;font-size:.8em;margin-top:-.8em;font-weight:700}
.caniuse-type span{background-color:var(--bg,#fff);padding:0 .4em}
.caniuse-cell{align-items:center;border-radius:1cm;color:#fff;display:flex;font-size:90%;min-width:1.5cm;padding:.3rem;justify-content:space-evenly;--supported:#2a8436dd;--no-support:#c44230dd;--no-support-alt:#b43b2bdd;--partial:#807301dd;--partial-alt:#746c00dd;--unknown:#757575;background:repeating-linear-gradient(var(--caniuse-angle,45deg),var(--caniuse-bg) 0,var(--caniuse-bg-alt) 1px,var(--caniuse-bg-alt) .4em,var(--caniuse-bg) calc(.25em + 1px),var(--caniuse-bg) .75em)}
img.caniuse-browser{filter:drop-shadow(0 0 .1cm #666);background:0 0}
.caniuse-cell span.browser-version{margin-left:.4em;text-shadow:0 0 .1em #fff;font-weight:100;font-size:.9em}
.caniuse-stats a[href]{white-space:nowrap;align-self:flex-end}
.caniuse-cell.y{background:var(--supported)}
.caniuse-cell:is(.n,.d){--caniuse-angle:45deg;--caniuse-bg:var(--no-support);--caniuse-bg-alt:var(--no-support-alt)}
.caniuse-cell.u{background:var(--unknown)}
.caniuse-cell.d{--caniuse-angle:180deg}
.caniuse-cell:is(.a,.x,.p){--caniuse-angle:90deg;--caniuse-bg:var(--partial);--caniuse-bg-alt:var(--partial-alt)}
@media print{
.caniuse-cell.y::before{content:"✔️";padding:.5em}
.caniuse-cell.n::before{content:"❌";padding:.5em}
.caniuse-cell:is(.a,.d,.p,.x,.u)::before{content:"⚠️";padding:.5em}
}`;
    const yu = "core/caniuse",
      wu = "https://respec.org/caniuse/",
      ku = new Map([
        ["and_chr", { name: "Android Chrome", path: "chrome", type: "mobile" }],
        [
          "and_ff",
          { name: "Android Firefox", path: "firefox", type: "mobile" },
        ],
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
          {
            name: "Samsung Internet",
            path: "samsung-internet",
            type: "mobile",
          },
        ],
      ]),
      vu = new Map([
        ["a", "almost supported (aka Partial support)"],
        ["d", "disabled by default"],
        ["n", "no support, or disabled by default"],
        ["p", "no support, but has Polyfill"],
        ["u", "unknown support"],
        ["x", "requires prefix to work"],
        ["y", "supported by default"],
      ]);
    var $u = Object.freeze({
      __proto__: null,
      BROWSERS: ku,
      name: yu,
      prepare: function (e) {
        if (!e.caniuse) return;
        (!(function (e) {
          const t = new Set(ku.keys());
          (t.delete("op_mob"), t.delete("opera"));
          const n = { removeOnSave: !0, browsers: [...t] };
          if ("string" == typeof e.caniuse)
            return void (e.caniuse = { feature: e.caniuse, ...n });
          e.caniuse = { ...n, ...e.caniuse };
        })(e),
          (function ({ caniuse: e }) {
            const { browsers: t } = e,
              n = t.filter(e => !ku.has(e));
            if (n.length) {
              is(
                ds`Invalid browser(s): (${ls(n, { quotes: !0 })}) in the \`browser\` property of ${"[caniuse]"}.`,
                yu
              );
            }
          })(e));
        const t = e.caniuse;
        t.feature &&
          document.head.appendChild(or`<style
      id="caniuse-stylesheet"
      class="${t.removeOnSave ? "removeOnSave" : ""}"
    >
      ${bu}
    </style>`);
      },
      run: async function (e) {
        const t = e.caniuse;
        if (!t?.feature) return;
        const n = new URL(t.feature, "https://caniuse.com/").href,
          r = document.querySelector(".head dl"),
          s = (async function (e) {
            const { feature: t, browsers: n, apiURL: r } = e,
              s = new URL(r || `./${t}`, wu);
            n.forEach(e => s.searchParams.append("browsers", e));
            const i = await fetch(s);
            if (!i.ok) {
              const { status: e, statusText: t } = i;
              throw new Error(`Failed to get caniuse data: (${e}) ${t}`);
            }
            return i.json();
          })(e.caniuse)
            .then(e =>
              (async function (e, { feature: t }) {
                const n = e.result,
                  r = new Map([
                    ["desktop", []],
                    ["mobile", []],
                  ]),
                  s = (function (e) {
                    return (t, { browser: n, version: r, caniuse: s }) => {
                      const i = ku.get(n),
                        { name: o, type: a } = i ?? {
                          name: n,
                          type: "desktop",
                        },
                        c = `${o}${r ? ` version ${r}` : ""}`,
                        l = vu.get(s),
                        u = `${e} is ${l} since ${c} on ${a}.`,
                        d = `caniuse-cell ${s}`,
                        p =
                          (h = `${l} since ${c}.`).charAt(0).toUpperCase() +
                          h.slice(1);
                      var h;
                      const f = r || "—",
                        m = (function (e) {
                          const t = ku.get(e)?.path ?? e;
                          return `https://www.w3.org/assets/logos/browser-logos/${t}/${t}.svg`;
                        })(n),
                        g = or`
      <div class="${d}" title="${p}" aria-label="${u}">
        <img
          class="caniuse-browser"
          width="20"
          height="20"
          src="${m}"
          alt="${o} logo"
        /><span class="browser-version">${f}</span>
      </div>
    `;
                      return (t.get(a)?.push(g), t);
                    };
                  })(t);
                n.reduce(s, r);
                const i = [...r]
                  .filter(([, e]) => e.length)
                  .map(
                    ([e, t]) => or`<div class="caniuse-group">
          <div class="caniuse-browsers">${t}</div>
          <div class="caniuse-type"><span>${e}</div>
        </div>`
                  );
                return (
                  i.push(or`<a class="caniuse-cell" href="https://caniuse.com/${t}"
      >More info</a
    >`),
                  i
                );
              })(e, t)
            )
            .catch(e =>
              (function (e, t, n) {
                const r = `Failed to retrieve feature "${t.feature}".`,
                  s = ds`Please check the feature key on [caniuse.com](https://caniuse.com) and update ${"[caniuse]"}.`;
                return (
                  ss(r, yu, { hint: s, cause: e }),
                  or`<a href="${n}">caniuse.com</a>`
                );
              })(e, t, n)
            ),
          i = or`<dt class="caniuse-title">Browser support:</dt>
    <dd class="caniuse-stats">
      ${{ any: s, placeholder: "Fetching data from caniuse.com..." }}
    </dd>`;
        (r?.append(...i.childNodes),
          await s,
          fs("amend-user-config", { caniuse: t.feature }),
          t.removeOnSave &&
            (r
              ?.querySelectorAll(".caniuse-browser")
              .forEach(e => e.classList.add("removeOnSave")),
            ms("beforesave", e => {
              or.bind(e.querySelector(".caniuse-stats"))`
        <a href="${n}">caniuse.com</a>`;
            })));
      },
    });
    var xu = String.raw`.mdn{font-size:.75em;position:absolute;right:.3em;min-width:0;margin-top:3rem}
.mdn details{width:100%;margin:1px 0;position:relative;z-index:10;box-sizing:border-box;padding:.4em;padding-top:0}
.mdn details[open]{min-width:25ch;max-width:32ch;background:#fff;background:var(--indextable-hover-bg,#fff);color:#000;color:var(--indextable-hover-text,#000);box-shadow:0 1em 3em -.4em rgba(0,0,0,.3),0 0 1px 1px rgba(0,0,0,.05);box-shadow:0 1em 3em -.4em var(--tocsidebar-shadow,rgba(0,0,0,.3)),0 0 1px 1px var(--tocsidebar-shadow,rgba(0,0,0,.05));border-radius:2px;z-index:11;margin-bottom:.4em}
.mdn summary{text-align:right;cursor:default;margin-right:-.4em}
.mdn summary span{font-family:zillaslab,Palatino,"Palatino Linotype",serif;color:#fff;color:var(--bg,#fff);background-color:#000;background-color:var(--text,#000);display:inline-block;padding:3px}
.mdn a{display:inline-block;word-break:break-all}
.mdn p{margin:0}
.mdn .engines-all{color:#058b00}
.mdn .engines-some{color:#b00}
.mdn table{width:100%;font-size:.9em}
.mdn td{border:none}
.mdn td:nth-child(2){text-align:right}
.mdn .nosupportdata{font-style:italic;margin:0}
.mdn tr::before{content:"";display:table-cell;width:1.5em;height:1.5em;background:no-repeat center center/contain;font-size:.75em}
.mdn .no,.mdn .unknown{color:#ccc;filter:grayscale(100%)}
.mdn .no::before,.mdn .unknown::before{opacity:.5}
.mdn .chrome::before,.mdn .chrome_android::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/chrome/chrome.svg)}
.mdn .edge::before,.mdn .edge_mobile::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/edge/edge.svg)}
.mdn .firefox::before,.mdn .firefox_android::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/firefox/firefox.svg)}
.mdn .opera::before,.mdn .opera_android::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/opera/opera.svg)}
.mdn .safari::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/safari/safari.svg)}
.mdn .safari_ios::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/safari-ios/safari-ios.svg)}
.mdn .samsunginternet_android::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/samsung-internet/samsung-internet.svg)}
.mdn .webview_android::before{background-image:url(https://www.w3.org/assets/logos/browser-logos/android-webview/android-webview.png)}`;
    const Cu = "core/mdn-annotation",
      _u = "https://w3c.github.io/mdn-spec-links/",
      Su = "https://developer.mozilla.org/en-US/docs/Web/",
      Tu = {
        chrome: "Chrome",
        chrome_android: "Chrome Android",
        edge: "Edge",
        edge_mobile: "Edge Mobile",
        firefox: "Firefox",
        firefox_android: "Firefox Android",
        opera: "Opera",
        opera_android: "Opera Android",
        safari: "Safari",
        safari_ios: "Safari iOS",
        samsunginternet_android: "Samsung Internet",
        webview_android: "WebView Android",
      },
      Eu = Dr({
        en: {
          inAllEngines: "This feature is in all major engines.",
          inSomeEngines: "This feature has limited support.",
        },
        zh: {
          inAllEngines: "所有主要引擎均支持此特性。",
          inSomeEngines: "此功能支持有限。",
        },
        cs: {
          inAllEngines:
            "Tato funkce je podporována ve všech hlavních prohlížečích.",
          inSomeEngines: "Tato funkce má omezenou podporu.",
        },
      });
    function Ru(e) {
      const t = e.closest("section");
      if (!t) return;
      const { previousElementSibling: n } = t;
      if (n && n.classList.contains("mdn")) return n;
      const r = or`<aside class="mdn"></aside>`;
      return (t.before(r), r);
    }
    function Au(e) {
      const { name: t, slug: n, summary: r, support: s, engines: i } = e,
        o = n.slice(n.indexOf("/") + 1),
        a = `${Su}${n}`,
        c = `Expand MDN details for ${t}`,
        l = (function (e) {
          if (3 === e.length)
            return or`<span title="${Eu.inAllEngines}">✅</span>`;
          if (e.length < 2)
            return or`<span title="${Eu.inSomeEngines}">🚫</span>`;
          return or`<span>&emsp;</span>`;
        })(i);
      return or`<details>
    <summary aria-label="${c}"><span>MDN</span>${l}</summary>
    <a title="${r}" href="${a}">${o}</a>
    ${(function (e) {
      if (3 === e.length)
        return or`<p class="engines-all">${Eu.inAllEngines}</p>`;
      if (e.length < 2)
        return or`<p class="engines-some">${Eu.inSomeEngines}</p>`;
    })(i)}
    ${
      s
        ? (function (e) {
            function t(e, t, n) {
              const r = "Unknown" === t ? "?" : t,
                s = `${e} ${t.toLowerCase()}`;
              return or`<tr class="${s}">
      <td>${Tu[e]}</td>
      <td>${n || r}</td>
    </tr>`;
            }
            function n(e, n) {
              if (n.version_removed) return t(e, "No", "");
              const r = n.version_added;
              return "boolean" == typeof r
                ? t(e, r ? "Yes" : "No", "")
                : r
                  ? t(e, "Yes", `${r}+`)
                  : t(e, "Unknown", "");
            }
            const r = Object.keys(Tu);
            return or`<table>
    ${r.map(r => (e[r] ? n(r, e[r]) : t(r, "Unknown", "")))}
  </table>`;
          })(s)
        : or`<p class="nosupportdata">No support data.</p>`
    }
  </details>`;
    }
    var Lu = Object.freeze({
      __proto__: null,
      name: Cu,
      run: async function (e) {
        const t = (function (e) {
          const { shortName: t, mdn: n } = e;
          if (!n) return;
          return "string" == typeof n ? n : n.key || t;
        })(e);
        if (!t) return;
        const n = await (async function (e, t) {
          const { baseJsonPath: n = _u, maxAge: r = 864e5 } = t,
            s = new URL(`${e}.json`, n).href,
            i = await Mr(s, r);
          if (404 === i.status) {
            return void ss(
              `Could not find MDN data associated with key "${e}".`,
              Cu,
              { hint: "Please add a valid key to `respecConfig.mdn`" }
            );
          }
          return await i.json();
        })(t, e.mdn);
        if (!n) return;
        const r = document.createElement("style");
        ((r.textContent = xu), document.head.append(r));
        for (const e of (function (e) {
          return [...document.body.querySelectorAll("[id]:not(script)")].filter(
            ({ id: t }) => Array.isArray(e[t])
          );
        })(n)) {
          const t = n[e.id],
            r = Ru(e);
          if (r) for (const e of t) r.append(Au(e));
        }
      },
    });
    const Pu = "ui/save-html",
      Nu = Dr({
        en: { save_snapshot: "Export" },
        nl: { save_snapshot: "Bewaar Snapshot" },
        ja: { save_snapshot: "保存する" },
        de: { save_snapshot: "Exportieren" },
        zh: { save_snapshot: "导出" },
      }),
      Iu = [
        {
          id: "respec-save-as-html",
          ext: "html",
          title: "HTML",
          type: "text/html",
          get href() {
            return ys(this.type);
          },
        },
        {
          id: "respec-save-as-xml",
          ext: "xhtml",
          title: "XML",
          type: "application/xml",
          get href() {
            return ys(this.type);
          },
        },
        {
          id: "respec-save-as-epub",
          ext: "epub",
          title: "EPUB 3",
          type: "application/epub+zip",
          get href() {
            const e = new URL("https://labs.w3.org/r2epub/");
            return (
              e.searchParams.append("respec", "true"),
              e.searchParams.append("url", document.location.href),
              e.href
            );
          },
        },
      ];
    var Du = Object.freeze({
      __proto__: null,
      exportDocument: function (e, t) {
        return (
          is(
            "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed.",
            Pu,
            { hint: "Use core/exporter `rsDocToDataURL()` instead." }
          ),
          ys(t)
        );
      },
      name: Pu,
      run: function (e) {
        const t = {
            async show(t) {
              await document.respec.ready;
              const n = or`<div class="respec-save-buttons">
        ${Iu.map(t =>
          (function (e, t) {
            const { id: n, href: r, ext: s, title: i, type: o } = e,
              a = jr(t.publishDate || new Date()),
              c = [t.specStatus, t.shortName || "spec", a].join("-");
            return or`<a
    href="${r}"
    id="${n}"
    download="${c}.${s}"
    type="${o}"
    class="respec-save-button"
    onclick=${() => Ks.closeModal()}
    >${i}</a
  >`;
          })(t, e)
        )}
      </div>`;
              Ks.freshModal(Nu.save_snapshot, n, t);
            },
          },
          n = "download" in HTMLAnchorElement.prototype;
        let r;
        n &&
          (r = Ks.addCommand(
            Nu.save_snapshot,
            function () {
              if (!n) return;
              t.show(r);
            },
            "Ctrl+Shift+Alt+S",
            "💾"
          ));
      },
    });
    const Ou = "https://respec.org/specref/",
      ju = Dr({
        en: { search_specref: "Search Specref" },
        nl: { search_specref: "Doorzoek Specref" },
        ja: { search_specref: "仕様検索" },
        de: { search_specref: "Spezifikationen durchsuchen" },
        zh: { search_specref: "搜索 Specref" },
        cs: { search_specref: "Hledat ve Specref" },
      }),
      zu = Ks.addCommand(
        ju.search_specref,
        function () {
          const e = or`
    <iframe class="respec-iframe" src="${Ou}" onload=${e => e.target.classList.add("ready")}></iframe>
    <a href="${Ou}" target="_blank">Open Search UI in a new tab</a>
  `;
          Ks.freshModal(ju.search_specref, e, zu);
        },
        "Ctrl+Shift+Alt+space",
        "🔎"
      );
    var Mu = Object.freeze({ __proto__: null });
    const qu = "https://respec.org/xref/",
      Uu = Dr({
        en: { title: "Search definitions" },
        ja: { title: "定義検索" },
        de: { title: "Definitionen durchsuchen" },
        zh: { title: "搜索定义" },
        cs: { title: "Hledat definice" },
      }),
      Wu = Ks.addCommand(
        Uu.title,
        function () {
          const e = or`
    <iframe class="respec-iframe" src="${qu}" onload="${e => e.target.classList.add("ready")}"></iframe>
    <a href="${qu}" target="_blank">Open Search UI in a new tab</a>
  `;
          Ks.freshModal(Uu.title, e, Wu);
        },
        "Ctrl+Shift+Alt+x",
        "📚"
      );
    var Fu = Object.freeze({ __proto__: null });
    const Bu = Dr({
      en: { about_respec: "About" },
      zh: { about_respec: "关于" },
      nl: { about_respec: "Over" },
      ja: { about_respec: "これについて" },
      de: { about_respec: "Über" },
      cs: { about_respec: "O aplikaci" },
    });
    window.respecVersion = window.respecVersion || "Developer Edition";
    const Hu = document.createElement("div"),
      Gu = or.bind(Hu),
      Vu = Ks.addCommand(
        `${Bu.about_respec} ${window.respecVersion}`,
        function () {
          const e = [];
          "getEntriesByType" in performance &&
            performance
              .getEntriesByType("measure")
              .sort((e, t) => t.duration - e.duration)
              .map(({ name: e, duration: t }) => ({
                name: e,
                duration:
                  t > 1e3
                    ? `${Math.round(t / 1e3)} second(s)`
                    : `${t.toFixed(2)} milliseconds`,
              }))
              .map(Ju)
              .forEach(t => {
                e.push(t);
              });
          (Gu`
  <p>
    ReSpec is a document production toolchain, with a notable focus on W3C specifications.
  </p>
  <p>
    <a href='https://respec.org/docs'>Documentation</a>,
    <a href='https://github.com/speced/respec/issues'>Bugs</a>.
  </p>
  <table border="1" width="100%" hidden="${!e.length}">
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
    <tbody>${e}</tbody>
  </table>
`,
            Ks.freshModal(
              `${Bu.about_respec} - ${window.respecVersion}`,
              Hu,
              Vu
            ));
        },
        "Ctrl+Shift+Alt+A",
        "ℹ️"
      );
    function Ju({ name: e, duration: t }) {
      return or`
    <tr>
      <td><a href="${`https://github.com/speced/respec/blob/develop/src/${e}.js`}">${e}</a></td>
      <td>${t}</td>
    </tr>
  `;
    }
    var Ku = Object.freeze({ __proto__: null });
    var Yu = Object.freeze({
      __proto__: null,
      name: "core/seo",
      run: function (e) {
        if (e.gitRevision) {
          const t = or`<meta
      name="revision"
      content="${e.gitRevision}"
    />`;
          document.head.appendChild(t);
        }
        const t = document.querySelector("#abstract p:first-of-type");
        if (!t) return;
        const n = t.textContent.replace(/\s+/, " ").trim(),
          r = document.createElement("meta");
        ((r.name = "description"),
          (r.content = n),
          document.head.appendChild(r));
      },
    });
    const Zu = "w3c/seo",
      Xu = {
        NOTE: "w3p:NOTE",
        WD: "w3p:WD",
        LC: "w3p:LastCall",
        CR: "w3p:CR",
        CRD: "w3p:CRD",
        PR: "w3p:PR",
        REC: "w3p:REC",
        RSCND: "w3p:RSCND",
      },
      Qu = new Set([
        ...Pi,
        ...Ni,
        ...Ii,
        "BG-FINAL",
        "CG-FINAL",
        "CRY",
        "DRY",
        "draft-finding",
        "finding",
      ]);
    function ed({ name: e, url: t, mailto: n, company: r, companyURL: s }) {
      const i = { type: "Person", name: e, url: t, "foaf:mbox": n };
      return ((r || s) && (i.worksFor = { name: r, url: s }), i);
    }
    function td(e) {
      const { href: t, title: n, href: r } = e,
        s = { id: t, type: "TechArticle", name: n, url: r };
      return (
        e.authors && (s.creator = e.authors.map(e => ({ name: e }))),
        e.rawDate && (s.publishedDate = e.rawDate),
        e.isbn && (s.identifier = e.isbn),
        e.publisher && (s.publisher = { name: e.publisher }),
        s
      );
    }
    var nd = Object.freeze({
      __proto__: null,
      name: Zu,
      requiresCanonicalLink: Qu,
      run: async function (e) {
        if ((e.canonicalURI || Qu.has(e.specStatus)) && e.shortName) {
          switch (e.canonicalURI) {
            case "edDraft":
              if (e.edDraftURI)
                e.canonicalURI = new URL(
                  e.edDraftURI,
                  document.location.href
                ).href;
              else {
                (is(
                  "Canonical URI set to edDraft, but no edDraftURI is set in configuration",
                  Zu
                ),
                  (e.canonicalURI = null));
              }
              break;
            case "TR":
              if (e.latestVersion) e.canonicalURI = e.latestVersion;
              else {
                (is(
                  "Canonical URI set to TR, but no shortName is set in configuration",
                  Zu
                ),
                  (e.canonicalURI = null));
              }
              break;
            default:
              e.latestVersion &&
                !e.canonicalURI &&
                (e.canonicalURI = e.latestVersion);
          }
          if (e.canonicalURI) {
            const t = or`<link rel="canonical" href="${e.canonicalURI}" />`;
            document.head.appendChild(t);
          }
          e.doJsonLd &&
            (await (async function (e, t) {
              const n = Xu[e.specStatus],
                r = ["TechArticle"];
              n && r.push(n);
              const s = {
                "@context": [
                  "http://schema.org",
                  {
                    "@vocab": "http://schema.org/",
                    "@language": t.documentElement.lang || "en",
                    w3p: "http://www.w3.org/2001/02pd/rec54#",
                    foaf: "http://xmlns.com/foaf/0.1/",
                    datePublished: {
                      "@type": "http://www.w3.org/2001/XMLSchema#date",
                    },
                    inLanguage: { "@language": null },
                    isBasedOn: { "@type": "@id" },
                    license: { "@type": "@id" },
                  },
                ],
                id: e.canonicalURI || e.thisVersion,
                type: r,
                name: document.title,
                inLanguage: t.documentElement.lang || "en",
                license: e.licenseInfo?.url,
                datePublished: e.dashDate,
                copyrightHolder: {
                  name: "World Wide Web Consortium",
                  url: "https://www.w3.org/",
                },
                discussionUrl: e.issueBase,
                alternativeHeadline: e.subtitle,
                isBasedOn: e.prevVersion,
              };
              if (e.additionalCopyrightHolders) {
                const t = Array.isArray(e.additionalCopyrightHolders)
                  ? e.additionalCopyrightHolders
                  : [e.additionalCopyrightHolders];
                s.copyrightHolder = [
                  s.copyrightHolder,
                  ...t.map(e => ({ name: e })),
                ];
              }
              const i = t.head.querySelector("meta[name=description]");
              i && (s.description = i.content);
              e.editors && (s.editor = e.editors.map(ed));
              e.authors && (s.contributor = e.authors.map(ed));
              const o = [...e.normativeReferences, ...e.informativeReferences],
                a = await Promise.all(o.map(e => da(e)));
              s.citation = a
                .filter(e => null !== e && "object" == typeof e)
                .map(td);
              const c = t.createElement("script");
              ((c.type = "application/ld+json"),
                (c.textContent = JSON.stringify(s, null, 2)),
                t.head.appendChild(c));
            })(e, document));
        }
      },
    });
    const rd =
      "\n  --base: #282c34;\n  --mono-1: #abb2bf;\n  --mono-2: #818896;\n  --mono-3: #5c6370;\n  --hue-1: #56b6c2;\n  --hue-2: #61aeee;\n  --hue-3: #c678dd;\n  --hue-4: #98c379;\n  --hue-5: #e06c75;\n  --hue-5-2: #be5046;\n  --hue-6: #d19a66;\n  --hue-6-2: #e6c07b;\n";
    var sd = String.raw`.hljs,body:has(input[name=color-scheme][value=light]:checked) .hljs,head:not(:has(meta[name=color-scheme][content~=dark]))+body .hljs{--base:#fafafa;--mono-1:#383a42;--mono-2:#686b77;--mono-3:#717277;--hue-1:#0b76c5;--hue-2:#336ae3;--hue-3:#a626a4;--hue-4:#42803c;--hue-5:#ca4706;--hue-5-2:#c91243;--hue-6:#986801;--hue-6-2:#9a6a01}
@media (prefers-color-scheme:dark){
.hljs{${rd}}
}
body:has(input[name=color-scheme][value=dark]:checked) .hljs{${rd}}
.hljs{display:block;overflow-x:auto;padding:.5em;color:#383a42;color:var(--mono-1,#383a42);background:#fafafa;background:var(--base,#fafafa)}
.hljs-comment,.hljs-quote{color:#717277;color:var(--mono-3,#717277);font-style:italic}
.hljs-doctag,.hljs-formula,.hljs-keyword{color:#a626a4;color:var(--hue-3,#a626a4)}
.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#ca4706;color:var(--hue-5,#ca4706);font-weight:700}
.hljs-literal{color:#0b76c5;color:var(--hue-1,#0b76c5)}
.hljs-addition,.hljs-attribute,.hljs-meta-string,.hljs-regexp,.hljs-string{color:#42803c;color:var(--hue-4,#42803c)}
.hljs-built_in,.hljs-class .hljs-title{color:#9a6a01;color:var(--hue-6-2,#9a6a01)}
.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#986801;color:var(--hue-6,#986801)}
.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#336ae3;color:var(--hue-2,#336ae3)}
.hljs-emphasis{font-style:italic}
.hljs-strong{font-weight:700}
.hljs-link{text-decoration:underline}`;
    async function id(t) {
      const n = await fetch(
        new URL(
          `../../${t}`,
          (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
            new URL("respec-w3c.js", document.baseURI).href
        )
      );
      return await n.text();
    }
    const od = new URL(
        "respec-highlight.js",
        (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
          new URL("respec-w3c.js", document.baseURI).href
      ).href,
      ad = Sr({ hint: "preload", href: od, as: "script" });
    async function cd() {
      try {
        return (
          await Promise.resolve().then(function () {
            return Yp;
          })
        ).default;
      } catch {
        return id("worker/respec-worker.js");
      }
    }
    async function ld() {
      try {
        const e = await fetch(od);
        if (e.ok) return await e.text();
      } catch {}
      return null;
    }
    document.head.appendChild(ad);
    const ud = (async function () {
      const [e, t] = await Promise.all([cd(), ld()]),
        n = new Blob(
          [
            null !== t
              ? `${t}\n`
              : 'self.RESPEC_HIGHLIGHT_URL = "https://www.w3.org/Tools/respec/respec-highlight";\n',
            e,
          ],
          { type: "application/javascript" }
        );
      return new Worker(URL.createObjectURL(n));
    })();
    n(
      "core/worker",
      ud.then(e => ({ worker: e }))
    );
    const dd = (function (e, t = 0) {
      const n = (function* (e, t) {
        for (;;) (yield `${e}:${t}`, t++);
      })(e, t);
      return () => n.next().value;
    })("highlight");
    async function pd(e) {
      const t = e;
      t.setAttribute("aria-busy", "true");
      const n =
        ((r = t.classList),
        Array.from(r)
          .filter(e => "highlight" !== e && "nolinks" !== e)
          .map(e => e.toLowerCase()));
      var r;
      let s;
      try {
        s = await (async function (e, t) {
          const n = { action: "highlight", code: e, id: dd(), languages: t },
            r = await ud;
          return (
            r.postMessage(n),
            new Promise((e, t) => {
              const s = setTimeout(() => {
                t(new Error("Timed out waiting for highlight."));
              }, 4e3);
              r.addEventListener("message", function t(i) {
                const {
                  data: { id: o, language: a, value: c },
                } = i;
                o === n.id &&
                  (r.removeEventListener("message", t),
                  clearTimeout(s),
                  e({ language: a, value: c }));
              });
            })
          );
        })(t.innerText, n);
      } catch (e) {
        return void console.error(e);
      }
      const { language: i, value: o } = s;
      switch (t.localName) {
        case "pre":
          (t.classList.remove(i),
            (t.innerHTML = `<code class="hljs${i ? ` ${i}` : ""}">${o}</code>`),
            t.classList.length || t.removeAttribute("class"));
          break;
        case "code":
          ((t.innerHTML = o), t.classList.add("hljs"), i && t.classList.add(i));
      }
      t.setAttribute("aria-busy", "false");
    }
    var hd = Object.freeze({
      __proto__: null,
      name: "core/highlight",
      run: async function (e) {
        if (e.noHighlightCSS) return;
        const t = [
          ...document.querySelectorAll(
            "\n    pre:not(.idl):not(.cddl):not(.nohighlight) > code:not(.nohighlight),\n    pre:not(.idl):not(.cddl):not(.nohighlight),\n    code.highlight\n  "
          ),
        ].filter(e => "pre" !== e.localName || !e.querySelector("code"));
        if (!t.length) return;
        const n = t.filter(e => e.textContent.trim()).map(pd);
        (document.head.appendChild(or`<style>
      ${sd}
    </style>`),
          await Promise.all(n));
      },
    });
    const fd = Dr({
        en: {
          missing_test_suite_uri: ds`Found tests in your spec, but missing ${"[testSuiteURI]"} in your ReSpec config.`,
          tests: "tests",
          test: "test",
        },
        ja: {
          missing_test_suite_uri: ds`この仕様内にテストの項目を検出しましたが，ReSpec の設定に ${"[testSuiteURI]"} が見つかりません．`,
          tests: "テスト",
          test: "テスト",
        },
        de: {
          missing_test_suite_uri: ds`Die Spezifikation enthält Tests, aber in der ReSpec-Konfiguration ist keine ${"[testSuiteURI]"} angegeben.`,
          tests: "Tests",
          test: "Test",
        },
        zh: {
          missing_test_suite_uri: ds`本规范中包含测试，但在 ReSpec 配置中缺少 ${"[testSuiteURI]"}。`,
          tests: "测试",
          test: "测试",
        },
      }),
      md = "core/data-tests";
    function gd(e) {
      const t = [],
        [n] = new URL(e).pathname.split("/").reverse(),
        r = n.split(".");
      let [s] = r;
      if (r.find(e => "https" === e)) {
        const e = document.createElement("span");
        ((e.textContent = "🔒"),
          e.setAttribute("aria-label", "requires a secure connection"),
          e.setAttribute("title", "Test requires HTTPS"),
          (s = s.replace(".https", "")),
          t.push(e));
      }
      if (
        s
          .split(".")
          .join("-")
          .split("-")
          .find(e => "manual" === e)
      ) {
        const e = document.createElement("span");
        ((e.textContent = "💪"),
          e.setAttribute("aria-label", "the test must be run manually"),
          e.setAttribute("title", "Manual test"),
          (s = s.replace("-manual", "")),
          t.push(e));
      }
      return or`
    <li>
      <a href="${e}">${s}</a>
      ${t}
    </li>
  `;
    }
    function bd(e, t, n) {
      return e
        .map(e => {
          try {
            return new URL(e, t).href;
          } catch {
            is(ds`Invalid URL in ${"[data-tests]"} attribute: ${e}.`, md, {
              elements: [n],
            });
          }
        })
        .filter(e => e);
    }
    function yd(e, t) {
      const n = e.filter((e, t, n) => n.indexOf(e) !== t);
      if (n.length) {
        const e = ds`Duplicate tests found in the ${"[data-tests]"} attribute.`,
          r = ds`To fix, remove duplicates from ${"[data-tests]"}: ${ls(n, { quotes: !0 })}.`;
        is(e, md, { hint: r, elements: [t] });
      }
    }
    function wd(e) {
      const t = [...new Set(e)];
      return or`
    <details class="respec-tests-details removeOnSave">
      <summary>tests: ${t.length}</summary>
      <ul>
        ${t.map(gd)}
      </ul>
    </details>
  `;
    }
    var kd = Object.freeze({
      __proto__: null,
      name: md,
      run: function (e) {
        const t = [...document.querySelectorAll("[data-tests]")].filter(
          e => e.dataset.tests
        );
        if (t.length)
          if (e.testSuiteURI)
            for (const n of t) {
              const t = bd(
                (n.dataset.tests ?? "").split(/,/gm).map(e => e.trim()),
                e.testSuiteURI,
                n
              ).filter(e => void 0 !== e);
              yd(t, n);
              const r = wd(t);
              n.append(r);
            }
          else ss(fd.missing_test_suite_uri, md);
      },
    });
    const vd = "core/list-sorter";
    function $d(e) {
      const t = "ascending" === e ? 1 : -1;
      return (e, n) => {
        const r = e.textContent ?? "",
          s = n.textContent ?? "";
        return t * r.trim().localeCompare(s.trim());
      };
    }
    function xd(e, t) {
      return [...e.querySelectorAll(":scope > li")]
        .sort($d(t))
        .reduce(
          (e, t) => (e.appendChild(t), e),
          document.createDocumentFragment()
        );
    }
    function Cd(e, t) {
      return [...e.querySelectorAll(":scope > dt")]
        .sort($d(t))
        .reduce((e, t) => {
          const { nodeType: n, nodeName: r } = t,
            s = document.createDocumentFragment();
          let { nextSibling: i } = t;
          for (; i && i.nextSibling; ) {
            s.appendChild(i.cloneNode(!0));
            const { nodeType: e, nodeName: t } = i.nextSibling;
            if (e === n && t === r) break;
            i = i.nextSibling;
          }
          return (s.prepend(t.cloneNode(!0)), e.appendChild(s), e);
        }, document.createDocumentFragment());
    }
    var _d = Object.freeze({
      __proto__: null,
      name: vd,
      run: function () {
        const e = document.querySelectorAll("[data-sort]");
        for (const t of e) {
          let e;
          const n = t.dataset.sort || "ascending";
          switch (t.localName) {
            case "dl":
              e = Cd(t, n);
              break;
            case "ol":
            case "ul":
              e = xd(t, n);
              break;
            default:
              is(`ReSpec can't sort ${t.localName} elements.`, vd, {
                elements: [t],
              });
          }
          if (e) {
            const n = document.createRange();
            (n.selectNodeContents(t), n.deleteContents(), t.appendChild(e));
          }
        }
      },
      sortDefinitionTerms: Cd,
      sortListItems: xd,
    });
    var Sd = String.raw`var:hover{text-decoration:underline;cursor:pointer}
var.respec-hl{color:var(--color,#000);background-color:var(--bg-color);box-shadow:0 0 0 2px var(--bg-color)}
@media (prefers-color-scheme:dark){
var.respec-hl{filter:saturate(.9) brightness(.9)}
}
var.respec-hl-c1{--bg-color:#f4d200}
var.respec-hl-c2{--bg-color:#ff87a2}
var.respec-hl-c3{--bg-color:#96e885}
var.respec-hl-c4{--bg-color:#3eeed2}
var.respec-hl-c5{--bg-color:#eacfb6}
var.respec-hl-c6{--bg-color:#82ddff}
var.respec-hl-c7{--bg-color:#ffbcf2}
@media print{
var.respec-hl{background:0 0;color:#000;box-shadow:unset}
}`;
    var Td = Object.freeze({
      __proto__: null,
      name: "core/highlight-vars",
      run: async function (e) {
        if (!e.highlightVars) return;
        const t = document.createElement("style");
        ((t.textContent = Sd), document.head.appendChild(t));
        const n = document.createElement("script");
        ((n.id = "respec-highlight-vars"),
          (n.textContent = await (async function () {
            try {
              return (
                await Promise.resolve().then(function () {
                  return Zp;
                })
              ).default;
            } catch {
              return id("./src/core/highlight-vars.runtime.js");
            }
          })()),
          document.body.append(n),
          ms("beforesave", e => {
            e.querySelectorAll("var.respec-hl").forEach(e => {
              const t = [...e.classList.values()].filter(e =>
                e.startsWith("respec-hl")
              );
              (e.classList.remove(...t),
                e.classList.length || e.removeAttribute("class"));
            });
          }));
      },
    });
    var Ed = String.raw`var[data-type]{position:relative}
var[data-type]::after,var[data-type]::before{position:absolute;left:50%;top:-6px;opacity:0;transition:opacity .4s;pointer-events:none}
var[data-type]::before{content:"";transform:translateX(-50%);border-width:4px 6px 0 6px;border-style:solid;border-color:transparent;border-top-color:#222}
var[data-type]::after{content:attr(data-type);transform:translateX(-50%) translateY(-100%);background:#222;text-align:center;font-family:"Dank Mono","Fira Code",monospace;font-style:normal;padding:6px;border-radius:3px;color:#daca88;text-indent:0;font-weight:400}
var[data-type]:hover::after,var[data-type]:hover::before{opacity:1}`;
    var Rd = Object.freeze({
      __proto__: null,
      name: "core/data-type",
      run: function (e) {
        if (!e.highlightVars) return;
        const t = document.createElement("style");
        ((t.textContent = Ed), document.head.appendChild(t));
        let n = null;
        const r = new Map(),
          s = document.querySelectorAll("section var");
        for (const e of s) {
          const t = e.closest("section");
          if ((n !== t && ((n = t), r.clear()), e.dataset.type)) {
            r.set(e.textContent.trim(), e.dataset.type);
            continue;
          }
          const s = r.get(e.textContent.trim());
          s && (e.dataset.type = s);
        }
      },
    });
    const Ad = "core/anchor-expander";
    function Ld(e, t, n) {
      const r = e.querySelector(".marker .self-link");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void ss(
          `Found matching element "${t}", but it has no title or marker.`,
          Ad,
          { title: "Missing title.", elements: [n] }
        );
      }
      const s = Qr(r);
      (n.append(...s.childNodes), n.classList.add("box-ref"));
    }
    function Pd(e, t, n) {
      const r = e.querySelector("figcaption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void ss(
          `Found matching figure "${t}", but figure is lacking a \`<figcaption>\`.`,
          Ad,
          { title: "Missing figcaption in referenced figure.", elements: [n] }
        );
      }
      const s = [...Qr(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("figno"), e)
      );
      (n.append(...s), n.classList.add("fig-ref"));
      const i = r.querySelector(".fig-title");
      !n.hasAttribute("title") && i && (n.title = Ir(i.textContent));
    }
    function Nd(e, t, n) {
      if (!e.classList.contains("numbered")) return;
      const r = e.querySelector("caption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void ss(
          `Found matching table "${t}", but table is lacking a \`<caption>\`.`,
          Ad,
          { title: "Missing caption in referenced table.", elements: [n] }
        );
      }
      const s = [...Qr(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("tableno"), e)
      );
      (n.append(...s), n.classList.add("table-ref"));
      const i = r.querySelector(".table-title");
      !n.hasAttribute("title") && i && (n.title = Ir(i.textContent));
    }
    function Id(e, t, n) {
      const r = e.querySelector("h6, h5, h4, h3, h2");
      if (r) (Dd(r, n), Od(r, n));
      else {
        n.textContent = n.getAttribute("href");
        ss(
          "Found matching section, but the section was lacking a heading element.",
          Ad,
          { title: `No matching id in document: "${t}".`, elements: [n] }
        );
      }
    }
    function Dd(e, t) {
      const n = e.querySelector(".self-link"),
        r = [...Qr(e).childNodes].filter(
          e => !e.classList || !e.classList.contains("self-link")
        );
      (t.append(...r),
        n && t.prepend("§ "),
        t.classList.add("sec-ref"),
        t.lastChild &&
          t.lastChild.nodeType === Node.TEXT_NODE &&
          (t.lastChild.textContent = (t.lastChild.textContent ?? "").trimEnd()),
        t.querySelectorAll("a").forEach(e => {
          const t = Gr(e, "span");
          for (const e of [...t.attributes]) t.removeAttributeNode(e);
        }));
    }
    function Od(e, t) {
      for (const n of ["dir", "lang"]) {
        if (t.hasAttribute(n)) continue;
        const r = e.closest(`[${n}]`);
        if (!r) continue;
        const s = t.closest(`[${n}]`);
        (s && s.getAttribute(n) === r.getAttribute(n)) ||
          t.setAttribute(n, r.getAttribute(n) ?? "");
      }
    }
    var jd = Object.freeze({
      __proto__: null,
      name: Ad,
      run: function () {
        const e = [
          ...document.querySelectorAll(
            "a[href^='#']:not(.self-link):not([href$='the-empty-string'])"
          ),
        ].filter(e => "" === e.textContent.trim());
        for (const t of e) {
          const e = (t.getAttribute("href") ?? "").slice(1),
            n = document.getElementById(e);
          if (n) {
            switch (n.localName) {
              case "h6":
              case "h5":
              case "h4":
              case "h3":
              case "h2":
                Dd(n, t);
                break;
              case "section":
                Id(n, e, t);
                break;
              case "figure":
                Pd(n, e, t);
                break;
              case "table":
                Nd(n, e, t);
                break;
              case "aside":
              case "div":
                Ld(n, e, t);
                break;
              default:
                t.textContent = t.getAttribute("href");
                ss(
                  "ReSpec doesn't support expanding this kind of reference.",
                  Ad,
                  { title: `Can't expand "#${e}".`, elements: [t] }
                );
            }
            (Od(n, t), t.normalize());
          } else {
            t.textContent = t.getAttribute("href");
            ss(
              `Couldn't expand inline reference. The id "${e}" is not in the document.`,
              Ad,
              { title: `No matching id in document: ${e}.`, elements: [t] }
            );
          }
        }
      },
    });
    var zd = String.raw`dfn{cursor:pointer}
.dfn-panel{position:absolute;z-index:35;min-width:300px;max-width:500px;padding:.5em .75em;margin-top:.6em;font-family:"Helvetica Neue",sans-serif;font-size:small;background:#fff;background:var(--indextable-hover-bg,#fff);color:#000;color:var(--text,#000);box-shadow:0 1em 3em -.4em rgba(0,0,0,.3),0 0 1px 1px rgba(0,0,0,.05);box-shadow:0 1em 3em -.4em var(--tocsidebar-shadow,rgba(0,0,0,.3)),0 0 1px 1px var(--tocsidebar-shadow,rgba(0,0,0,.05));border-radius:2px}
.dfn-panel:not(.docked)>.caret{position:absolute;top:-9px}
.dfn-panel:not(.docked)>.caret::after,.dfn-panel:not(.docked)>.caret::before{content:"";position:absolute;border:10px solid transparent;border-top:0;border-bottom:10px solid #fff;border-bottom-color:var(--indextable-hover-bg,#fff);top:0}
.dfn-panel:not(.docked)>.caret::before{border-bottom:9px solid #a2a9b1;border-bottom-color:var(--indextable-hover-bg,#a2a9b1)}
.dfn-panel *{margin:0}
.dfn-panel b{display:block;color:#000;color:var(--text,#000);margin-top:.25em}
.dfn-panel ul a[href]{color:#333;color:var(--text,#333)}
.dfn-panel>div{display:flex}
.dfn-panel a.self-link{font-weight:700;margin-right:auto}
.dfn-panel .marker{padding:.1em;margin-left:.5em;border-radius:.2em;text-align:center;white-space:nowrap;font-size:90%;color:#040b1c}
.dfn-panel .marker.dfn-exported{background:#d1edfd;box-shadow:0 0 0 .125em #1ca5f940}
.dfn-panel .marker.idl-block{background:#8ccbf2;box-shadow:0 0 0 .125em #0670b161}
.dfn-panel a:not(:hover){text-decoration:none!important;border-bottom:none!important}
.dfn-panel a[href]:hover{border-bottom-width:1px}
.dfn-panel ul{padding:0}
.dfn-panel li{margin-left:1em}
.dfn-panel.docked{position:fixed;left:.5em;top:unset;bottom:2em;margin:0 auto;max-width:calc(100vw - .75em * 2 - .5em - .2em * 2);max-height:30vh;overflow:auto}`;
    function Md(e) {
      const { id: t } = e,
        n = e.dataset.href || `#${t}`,
        r = document.querySelectorAll(`a[href="${n}"]:not(.index-term)`),
        s = `dfn-panel-for-${e.id}`,
        i = e.getAttribute("aria-label") || Ir(e.textContent),
        o = or`
    <div
      class="dfn-panel"
      id="${s}"
      hidden
      role="dialog"
      aria-modal="true"
      aria-label="Links in this document to definition: ${i}"
    >
      <span class="caret"></span>
      <div>
        <a
          class="self-link"
          href="${n}"
          aria-label="Permalink for definition: ${i}. Activate to close this dialog."
          >Permalink</a
        >
        ${(function (e) {
          return e.matches("dfn[data-export]")
            ? or`<span
    class="marker dfn-exported"
    title="Definition can be referenced by other specifications"
    >exported</span
  >`
            : null;
        })(e)} ${(function (e, t) {
          if (!e.hasAttribute("data-idl")) return null;
          for (const n of t) {
            if (n.dataset.linkType !== e.dataset.dfnType) continue;
            const t = n.closest("pre.idl");
            if (t && t.id) {
              const e = `#${t.id}`;
              return or`<a
        href="${e}"
        class="marker idl-block"
        title="Jump to IDL declaration"
        >IDL</a
      >`;
            }
          }
          return null;
        })(e, r)}
        ${(function (e, t) {
          const { dfnType: n } = e.dataset;
          if (!n?.startsWith("cddl-")) return null;
          const r = [...t].map(e => e.closest("pre.cddl")).find(e => e?.id);
          return r
            ? or`<a
    href="#${r.id}"
    class="marker cddl-block"
    title="Jump to CDDL declaration"
    >CDDL</a
  >`
            : null;
        })(e, r)}
      </div>
      <p><b>Referenced in:</b></p>
      ${(function (e, t) {
        if (!t.length)
          return or`<ul>
      <li>Not referenced in this document.</li>
    </ul>`;
        const n = new Map();
        t.forEach((t, r) => {
          const s = t.id || `ref-for-${e}-${r + 1}`;
          t.id || (t.id = s);
          const i =
            (function (e) {
              const t = e.closest("section");
              if (!t) return null;
              const n = t.querySelector("h1, h2, h3, h4, h5, h6");
              return n ? `§ ${Ir(n.textContent)}` : null;
            })(t) ?? "";
          (n.get(i) ?? n.set(i, []).get(i) ?? []).push(s);
        });
        const r = ([e, t]) =>
            [{ title: e, id: t[0], text: e }].concat(
              t
                .slice(1)
                .map((e, t) => ({
                  title: `Reference ${t + 2}`,
                  text: `(${t + 2})`,
                  id: e,
                }))
            ),
          s = e => or`<li>
      ${r(e).map(
        e => or`<a href="#${e.id}" title="${e.title}">${e.text}</a
          >${" "}`
      )}
    </li>`;
        return or`<ul>
    ${[...n].map(s)}
  </ul>`;
      })(t, r)}
    </div>
  `;
      return o;
    }
    var qd = Object.freeze({
      __proto__: null,
      name: "core/dfn-panel",
      run: async function () {
        document.head.insertBefore(
          or`<style>
      ${zd}
    </style>`,
          document.querySelector("link")
        );
        const e = document.querySelectorAll(
            "dfn[id]:not([data-cite]), #index-defined-elsewhere .index-term"
          ),
          t = document.createDocumentFragment();
        for (const n of e)
          (t.append(Md(n)),
            (n.tabIndex = 0),
            n.setAttribute("aria-haspopup", "dialog"));
        const n = document.body.querySelector("script");
        n ? n.before(t) : document.body.append(t);
        const r = document.createElement("script");
        ((r.id = "respec-dfn-panel"),
          (r.textContent = await (async function () {
            try {
              return (
                await Promise.resolve().then(function () {
                  return Xp;
                })
              ).default;
            } catch {
              return id("./src/core/dfn-panel.runtime.js");
            }
          })()),
          document.body.append(r));
      },
    });
    const Ud = "rs-changelog",
      Wd = class extends HTMLElement {
        constructor() {
          super();
          const e = this.getAttribute("filter"),
            t = e && "function" == typeof window[e] ? window[e] : () => !0;
          this.props = {
            from: this.getAttribute("from"),
            to: this.getAttribute("to") || "HEAD",
            repo: this.getAttribute("repo"),
            path: this.getAttribute("path"),
            filter: t,
          };
        }
        connectedCallback() {
          const { from: e, to: t, filter: n, repo: r, path: s } = this.props;
          or.bind(this)`
      <ul>
      ${{
        any: Fd(e, t, n, r, s)
          .then(e =>
            (async function (e, t) {
              const n = await lo,
                r = t ? `https://github.com/${t}/` : n?.repoURL;
              return e.map(e => {
                const [t, n = null] = e.message.split(/\(#(\d+)\)/, 2),
                  s = `${r}commit/${e.hash}`,
                  i =
                    n &&
                    or` (<a href="${n ? `${r}pull/${n}` : null}">#${n}</a>)`;
                return or`<li><a href="${s}">${t.trim()}</a>${i}</li>`;
              });
            })(e, r)
          )
          .catch(e => ss(e.message, Ud, { elements: [this], cause: e }))
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
        }
      };
    async function Fd(e, t, n, r, s) {
      let i;
      try {
        const o = await lo;
        if (!o) throw new Error("`respecConfig.github` is not set");
        const a = r || o.fullName,
          c = new URL("commits", `${o.apiBase}/${a}/`);
        (e && c.searchParams.set("from", e),
          c.searchParams.set("to", t),
          s && c.searchParams.set("path", s));
        const l = await fetch(c.href);
        if (!l.ok)
          throw new Error(
            `Request to ${c} failed with status code ${l.status}`
          );
        if (((i = await l.json()), !i.length))
          throw new Error(`No commits between ${e}..${t}.`);
        i = i.filter(n);
      } catch (e) {
        const t = `Error loading commits from GitHub. ${e.message}`;
        throw new Error(t, { cause: e });
      }
      return i;
    }
    const Bd = [Object.freeze({ __proto__: null, element: Wd, name: Ud })];
    var Hd = Object.freeze({
      __proto__: null,
      name: "core/custom-elements/index",
      run: async function () {
        Bd.forEach(e => {
          customElements.define(e.name, e.element);
        });
        const e = Bd.map(e => e.name).join(", "),
          t = [...document.querySelectorAll(e)].map(
            e => new Promise(t => e.addEventListener("done", t, { once: !0 }))
          );
        await Promise.all(t);
      },
    });
    var Gd = Object.freeze({
      __proto__: null,
      name: "core/web-monetization",
      run: function (e) {
        if (!1 === e.monetization) return;
        const { monetization: t } = e,
          { removeOnSave: n, paymentPointer: r } = (function (e) {
            const t = { paymentPointer: "$respec.org", removeOnSave: !0 };
            switch (typeof e) {
              case "string":
                t.paymentPointer = e;
                break;
              case "object":
                (e.paymentPointer &&
                  (t.paymentPointer = String(e.paymentPointer)),
                  !1 === e.removeOnSave && (t.removeOnSave = !1));
            }
            return t;
          })(t),
          s = n ? "removeOnSave" : null;
        document.head.append(or`<meta
      name="monetization"
      content="${r}"
      class="${s}"
    />`);
      },
    });
    var Vd = Object.freeze({
      __proto__: null,
      name: "core/dfn-contract",
      run: function () {
        (!(function () {
          const e = document.querySelectorAll(
            "dfn:is([data-dfn-type=''],:not([data-dfn-type]))"
          );
          for (const t of e) t.dataset.dfnType = "dfn";
          const t = document.querySelectorAll(
            "dfn:not([data-noexport], [data-export], [data-dfn-type='dfn'], [data-cite])"
          );
          for (const e of t) e.dataset.export = "";
        })(),
          (function () {
            const e = document.querySelectorAll(
              "dl.definitions dt:has(dfn[data-dfn-type])"
            );
            for (const t of e) {
              const e = t.querySelector("dfn[data-dfn-type]").id,
                n = t.nextElementSibling;
              n && !n.dataset.defines && e && (n.dataset.defines = `#${e}`);
            }
            const t = document.querySelectorAll(
              ".definition:has(dfn[data-dfn-type])"
            );
            for (const e of t) {
              const t = e.querySelector("dfn[data-dfn-type]");
              t.id && !e.dataset.defines && (e.dataset.defines = `#${t.id}`);
            }
          })());
      },
    });
    const Jd = "core/before-save";
    var Kd = Object.freeze({
      __proto__: null,
      name: Jd,
      run: function (e) {
        if (e.beforeSave)
          if (
            Array.isArray(e.beforeSave) &&
            !e.beforeSave.some(
              e =>
                "function" != typeof e || "AsyncFunction" === e.constructor.name
            )
          )
            ms(
              "beforesave",
              t => {
                !(function (e, t) {
                  let n = 0;
                  for (const r of e)
                    try {
                      r(t);
                    } catch (e) {
                      ss(
                        ds`Function ${r.name ? `\`${r.name}\`` : `at position ${n}`}\` threw an error during processing of ${"[beforeSave]"}.`,
                        Jd,
                        { hint: "See developer console.", cause: e }
                      );
                    } finally {
                      n++;
                    }
                })(e.beforeSave, t.ownerDocument);
              },
              { once: !0 }
            );
          else {
            ss(
              ds`${"[beforeSave]"} configuration option must be an array of synchronous JS functions.`,
              Jd
            );
          }
      },
    });
    const Yd = "core/linter-rules/check-charset",
      Zd = Dr({
        en: {
          msg: "Document must only contain one `<meta>` tag with charset set to 'utf-8'",
          hint: 'Add this line in your document `<head>` section - `<meta charset="utf-8">` or set charset to "utf-8" if not set already.',
        },
        zh: {
          msg: "文档只能包含一个 charset 属性为 utf-8 的 `<meta>` 标签",
          hint: '将此行添加到文档的 `<head>` 部分—— `<meta charset="utf-8">` 或将 charset 设置为 utf-8（如果尚未设置）。',
        },
        cs: {
          msg: "Dokument smí obsahovat pouze jeden tag `<meta>` s charset nastaveným na 'utf-8'",
          hint: 'Přidejte tento řádek do sekce `<head>` vašeho dokumentu - `<meta charset="utf-8">` nebo nastavte charset na "utf-8", pokud ještě není nastaven.',
        },
      });
    var Xd = Object.freeze({
      __proto__: null,
      name: Yd,
      run: function (e) {
        if (!e.lint?.["check-charset"]) return;
        const t = document.querySelectorAll("meta[charset]"),
          n = [];
        for (const e of t)
          n.push((e.getAttribute("charset") ?? "").trim().toLowerCase());
        (n.includes("utf-8") && 1 === t.length) ||
          is(Zd.msg, Yd, { hint: Zd.hint, elements: [...t] });
      },
    });
    const Qd = "core/linter-rules/check-punctuation",
      ep = [".", ":", "!", "?"],
      tp = ep.map(e => `"${e}"`).join(", "),
      np = Dr({
        en: {
          msg: "`p` elements should end with a punctuation mark.",
          hint: `Please make sure \`p\` elements end with one of: ${tp}.`,
        },
        cs: {
          msg: "Elementy `p` by měly končit interpunkčním znaménkem.",
          hint: `Ujistěte se, že elementy \`p\` končí jedním z těchto znaků: ${tp}.`,
        },
      });
    var rp = Object.freeze({
      __proto__: null,
      name: Qd,
      run: function (e) {
        if (!e.lint?.["check-punctuation"]) return;
        const t = new RegExp(`[${ep.join("")}\\]]$|^ *$`, "m"),
          n = [
            ...document.querySelectorAll("p:not(#back-to-top,#w3c-state)"),
          ].filter(e => !t.test(e.textContent.trim()));
        n.length && is(np.msg, Qd, { hint: np.hint, elements: n });
      },
    });
    const sp = "core/linter-rules/check-internal-slots",
      ip = Dr({
        en: {
          msg: "Internal slots should be preceded by a '.'",
          hint: "Add a '.' between the elements mentioned.",
        },
        cs: {
          msg: "Interní sloty by měly být uvedeny s tečkou '.' před názvem",
          hint: "Přidejte tečku '.' mezi uvedené prvky.",
        },
      });
    var op = Object.freeze({
      __proto__: null,
      name: sp,
      run: function (e) {
        if (!e.lint?.["check-internal-slots"]) return;
        const t = [...document.querySelectorAll("var+a")].filter(e => {
          const t = e.previousSibling?.nodeName;
          return "VAR" === t;
        });
        t.length && is(ip.msg, sp, { hint: ip.hint, elements: t });
      },
    });
    const ap = "core/linter-rules/local-refs-exist",
      cp = Dr({
        en: {
          msg: "Broken local reference found in document.",
          hint: "Please fix the links mentioned.",
        },
        cs: {
          msg: "V dokumentu byla nalezena nefunkční lokální reference.",
          hint: "Opravte prosím uvedené odkazy.",
        },
      });
    function lp(e) {
      const t = e.getAttribute("href")?.substring(1);
      if (!t) return;
      const n = e.ownerDocument;
      return !n.getElementById(t) && !n.getElementsByName(t).length;
    }
    var up = Object.freeze({
      __proto__: null,
      name: ap,
      run: function (e) {
        if (!e.lint?.["local-refs-exist"]) return;
        const t = [...document.querySelectorAll("a[href^='#']")].filter(lp);
        t.length && is(cp.msg, ap, { hint: cp.hint, elements: t });
      },
    });
    const dp = "core/linter-rules/no-captionless-tables",
      pp = Dr({
        en: {
          msg: "All tables marked with class='numbered' must start with a caption element.",
          hint: "Add a `caption` to the offending table.",
        },
        cs: {
          msg: "Všechny tabulky označené class='numbered' musí začínat elementem caption.",
          hint: "Přidejte k dané tabulce element `caption`.",
        },
      });
    var hp = Object.freeze({
      __proto__: null,
      name: dp,
      run: function (e) {
        if (!e.lint?.["no-captionless-tables"]) return;
        const t = [...document.querySelectorAll("table.numbered")].filter(
          e => !(e.firstElementChild instanceof HTMLTableCaptionElement)
        );
        t.length && is(pp.msg, dp, { hint: pp.hint, elements: t });
      },
    });
    const fp = "no-unused-dfns",
      mp = "core/linter-rules/no-unused-dfns",
      gp = Dr({
        en: {
          msg: e =>
            `Found definition for "${e}", but nothing links to it. This is usually a spec bug!`,
          get hint() {
            return ds`
        You can do one of the following...

          * Add a \`class="lint-ignore"\` attribute the definition.
          * Either remove the definition or change \`<dfn>\` to another type of HTML element.
          * If you meant to ${"[export|#data-export]"} the definition, add \`class="export"\` to the definition.

        To silence this warning entirely, set \`lint: { "no-unused-dfns": false }\` in your \`respecConfig\`.`;
          },
        },
        cs: {
          msg: e =>
            `Nalezena definice pro "${e}", ale nic na ni neodkazuje. Toto je obvykle chyba ve specifikaci!`,
          get hint() {
            return ds`
        Můžete udělat jedno z následujícího...

          * Přidejte k definici atribut \`class="lint-ignore"\`.
          * Definici buď odstraňte, nebo změňte \`<dfn>\` na jiný typ HTML elementu.
          * Pokud jste chtěli ${"[export|#data-export]"} tuto definici, přidejte k ní \`class="export"\`.

        Pro úplné potlačení tohoto varování nastavte \`lint: { "no-unused-dfns": false }\` ve vaší \`respecConfig\`.`;
          },
        },
      });
    function bp(e) {
      return !document.querySelector(
        `a[href="#${e.id}"]:not(.index-term, .self-link)`
      );
    }
    var yp = Object.freeze({
      __proto__: null,
      name: mp,
      run: function (e) {
        if (!e.lint?.[fp]) return;
        const t = "error" === e.lint[fp] ? ss : is;
        [
          ...document.querySelectorAll(
            "dfn:not(.lint-ignore, [data-export], [data-cite])"
          ),
        ]
          .filter(bp)
          .forEach(e => {
            const n = [e],
              r = Ir(e.textContent);
            t(gp.msg(r), mp, { elements: n, hint: gp.hint });
          });
      },
    });
    const wp = "core/linter-rules/no-headingless-sections",
      kp = Dr({
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
        cs: {
          msg: "Všechny sekce musí začínat elementem `h2-6`.",
          hint: "Přidejte do problematické sekce `h2-6` nebo použijte `<div>`.",
        },
      });
    var vp = Object.freeze({
      __proto__: null,
      name: wp,
      run: function (e) {
        if (!e.lint?.["no-headingless-sections"]) return;
        const t = [
          ...document.querySelectorAll("section:not(.head,#abstract,#sotd)"),
        ].filter(
          ({ firstElementChild: e }) =>
            !e ||
            !(e.matches(".header-wrapper") || e instanceof HTMLHeadingElement)
        );
        t.length && is(kp.msg, wp, { hint: kp.hint, elements: t });
      },
    });
    const $p = "core/linter-rules/no-unused-vars",
      xp = Dr({
        en: {
          msg: "Variable was defined, but never used.",
          hint: "Add a `data-ignore-unused` attribute to the `<var>`.",
        },
        cs: {
          msg: "Proměnná byla definována, ale nikdy nebyla použita.",
          hint: "Přidejte atribut `data-ignore-unused` k elementu `<var>`.",
        },
      });
    var Cp = Object.freeze({
      __proto__: null,
      name: $p,
      run: function (e) {
        if (!e.lint?.["no-unused-vars"]) return;
        const t = [],
          n = e =>
            !!e.querySelector(
              ":scope > :not(section) ~ .algorithm, :scope > :not(section) .algorithm"
            );
        for (const e of document.querySelectorAll("section")) {
          if (!n(e)) continue;
          const r = e.querySelectorAll(":scope > :not(section) var");
          if (!r.length) continue;
          const s = new Map();
          for (const e of r) {
            const t = Ir(e.textContent),
              n = s.get(t) || s.set(t, []).get(t);
            n?.push(e);
          }
          for (const e of s.values())
            1 !== e.length ||
              e[0].hasAttribute("data-ignore-unused") ||
              t.push(e[0]);
        }
        t.length && is(xp.msg, $p, { hint: xp.hint, elements: t });
      },
    });
    const _p = "no-dfn-in-abstract",
      Sp = `core/linter-rules/${_p}`,
      Tp = Dr({
        en: {
          msg: e =>
            `Definition \`${e}\` is in an unnumbered section (e.g. abstract or SotD).`,
          get hint() {
            return ds`Definitions in unnumbered sections (abstract, SotD) are semantically out of place and appear in the terms index without a section number. Move this definition to a numbered section such as "Terminology". See ${"[export|#data-export]"}.`;
          },
        },
      }),
      Ep = ["section#abstract", "section#sotd", "section.introductory"].join(
        ", "
      );
    var Rp = Object.freeze({
      __proto__: null,
      name: Sp,
      run: function (e) {
        if (!e.lint?.[_p]) return;
        const t = [...document.querySelectorAll("dfn")].filter(e =>
          e.closest(Ep)
        );
        t.forEach(e => {
          const t = Ir(e.textContent);
          is(Tp.msg(t), Sp, { hint: Tp.hint, elements: [e] });
        });
      },
    });
    const Ap = "required-sections",
      Lp = "w3c/linter-rules/required-sections",
      Pp = {
        en: {
          msg: e =>
            `W3C Recommendation track documents require a separate "${e}" section.`,
          hint: e => ds`Add a \`<section>\` with a "${e}" header. See the [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review).
        If the document is not intended for the W3C Recommendation track, set ${"[noRecTrack]"} to \`true\`
        or turn off the ${`[${Ap}]`} linter rule.`,
          privacy_considerations: "Privacy Considerations",
          security_considerations: "Security Considerations",
        },
        es: {
          msg: e =>
            `Documentos que van a ser "W3C Recommendation" requieren una sección "${e}" separada.`,
          hint: e => ds`Agrega una \`<section>\` con título "${e}". Ver los [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review).
        Si el documento no está destinado a ser un W3C Recommendation, puedes poner ${"[noRecTrack]"} a \`true\`
        o apaga la regla de linter ${`[${Ap}]`}.`,
          privacy_considerations: "Consideraciones de privacidad",
          security_considerations: "Consideraciones de Seguridad",
        },
        cs: {
          msg: e =>
            `Dokumenty na "W3C Recommendation track" vyžadují samostatnou sekci "${e}".`,
          hint: e => ds`Přidejte \`<section>\` s nadpisem "${e}". Viz [Horizontal review guidelines](https://www.w3.org/Guide/documentreview/#how_to_get_horizontal_review).
        Pokud dokument není určen pro "W3C Recommendation track", nastavte ${"[noRecTrack]"} na \`true\`
        nebo vypněte linter pravidlo ${`[${Ap}]`}.
      `,
          privacy_considerations: "Zásady ochrany soukromí",
          security_considerations: "Zásady bezpečnosti",
        },
      },
      Np = Dr(Pp),
      Ip = new Set([...Ni]);
    (Ip.delete("DISC"), Pi.forEach(e => Ip.delete(e)));
    var Dp = Object.freeze({
      __proto__: null,
      name: Lp,
      requiresSomeSectionStatus: Ip,
      run: function (e) {
        if (!e.lint?.[Ap]) return;
        if (!Or(Pp, "privacy_considerations")) {
          return void is(
            "Cannot check for required sections as translations are not available.",
            Lp,
            {
              hint: "File an issue to add translations or use a supported language.",
            }
          );
        }
        if (e.noRecTrack || !Ip.has(e.specStatus)) return;
        const t = "error" === e.lint[Ap] ? ss : is,
          n = new Xr([Np.privacy_considerations, Np.security_considerations]),
          r = document.querySelectorAll("h2, h3, h4, h5, h6");
        for (const e of r) {
          const t = e.cloneNode(!0);
          t.querySelectorAll("bdi")?.forEach(e => e.remove());
          const r = Ir(t.textContent);
          if (n.has(r) && (n.delete(r), 0 === n.size)) return;
        }
        for (const e of n) t(Np.msg(e), Lp, { hint: Np.hint(e) });
      },
    });
    const Op = "core/linter-rules/wpt-tests-exist",
      jp = Dr({
        en: {
          msg: "The following test could not be found in Web Platform Tests:",
          hint: "Check [wpt.live](https://wpt.live) to see if it was deleted or renamed.",
        },
        cs: {
          msg: "Následující test nebyl nalezen ve Web Platform Tests:",
          hint: "Zkontrolujte [wpt.live](https://wpt.live), zda nebyl smazán nebo přejmenován.",
        },
      });
    var zp = Object.freeze({
      __proto__: null,
      name: Op,
      run: async function (e) {
        if (!e.lint?.["wpt-tests-exist"]) return;
        const t = await (async function (e, t) {
          let n;
          try {
            const t = new URL(e);
            if (t.pathname.startsWith("/web-platform-tests/wpt/tree/master/")) {
              const e = /web-platform-tests\/wpt\/tree\/master\/(.+)/;
              n = (t.pathname.match(e)?.[1] ?? "").replace(/\//g, "");
            } else n = t.pathname.replace(/\//g, "");
          } catch (e) {
            return (
              is(
                "Failed to parse WPT directory from testSuiteURI",
                `linter/${Op}`
              ),
              console.error(e),
              null
            );
          }
          const r = new URL("web-platform-tests/wpt/files", `${t}/`);
          r.searchParams.set("path", n);
          const s = await fetch(r);
          if (!s.ok) {
            return (
              is(
                `Failed to fetch files from WPT repository. Request failed with error: ${await s.text()} (${s.status})`,
                `linter/${Op}`
              ),
              null
            );
          }
          const { entries: i } = await s.json(),
            o = i.filter(e => !e.endsWith("/"));
          return new Set(o);
        })(e.testSuiteURI, e.githubAPI);
        if (!t) return;
        const n = [...document.querySelectorAll("[data-tests]")].filter(
          e => e.dataset.tests
        );
        for (const e of n)
          e.dataset.tests
            ?.split(/,/gm)
            .map(e => e.trim().split(/\?|#/)[0])
            .filter(e => e && !t.has(e))
            .map(t => {
              is(`${jp.msg} \`${t}\`.`, Op, { hint: jp.hint, elements: [e] });
            });
      },
    });
    const Mp = "core/linter-rules/no-http-props",
      qp = Dr({
        en: {
          msg: ds`Insecure URLs are not allowed in ${"[respecConfig]"}.`,
          hint: "Please change the following properties to 'https://': ",
        },
        zh: {
          msg: ds`${"[respecConfig]"} 中不允许使用不安全的URL.`,
          hint: "请将以下属性更改为 https://：",
        },
        cs: {
          msg: ds`V ${"[respecConfig]"} nejsou povoleny nezabezpečené URL adresy.`,
          hint: "Změňte prosím následující vlastnosti na 'https://': ",
        },
      });
    var Up = Object.freeze({
      __proto__: null,
      name: Mp,
      run: function (e) {
        if (!e.lint?.["no-http-props"]) return;
        if (!parent.location.href.startsWith("http")) return;
        const t = Object.getOwnPropertyNames(e)
          .filter(t => (t.endsWith("URI") && e[t]) || "prevED" === t)
          .filter(t =>
            new URL(e[t], parent.location.href).href.startsWith("http://")
          );
        if (t.length) {
          const e = Lr(t, e => ds`${`[${e}]`}`);
          is(qp.msg, Mp, { hint: qp.hint + e });
        }
      },
    });
    const Wp = "core/linter-rules/a11y",
      Fp = ["color-contrast", "landmark-one-main", "landmark-unique", "region"];
    function Bp(e) {
      const t = [];
      for (const n of e.split("\n\n")) {
        const [e, ...r] = n.split(/^\s{2}/m),
          s = r.map(e => `- ${e.trimEnd()}`).join("\n");
        t.push(`${e}${s}`);
      }
      return t.join("\n\n");
    }
    var Hp = Object.freeze({
      __proto__: null,
      name: Wp,
      run: async function (e) {
        if (!e.lint?.a11y && !e.a11y) return;
        const t = e.lint?.a11y || e.a11y,
          n = !0 === t ? {} : t,
          r = await (async function (e) {
            const { rules: t, ...n } = e,
              r = {
                rules: {
                  ...Object.fromEntries(Fp.map(e => [e, { enabled: !1 }])),
                  ...t,
                },
                ...n,
                elementRef: !0,
                resultTypes: ["violations"],
                reporter: "v1",
              };
            let s;
            try {
              s = await (function () {
                const e = document.createElement("script");
                return (
                  e.classList.add("remove"),
                  (e.src =
                    "https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js"),
                  document.head.appendChild(e),
                  new Promise((t, n) => {
                    ((e.onload = () => t(window.axe)), (e.onerror = n));
                  })
                );
              })();
            } catch (e) {
              return (
                ss("Failed to load a11y linter.", Wp),
                console.error(e),
                []
              );
            }
            try {
              const e = await s?.run(document, r);
              return e?.violations ?? [];
            } catch (e) {
              return (
                ss("Error while looking for a11y issues.", Wp),
                console.error(e),
                []
              );
            }
          })(n);
        for (const e of r) {
          const t = new Map();
          for (const n of e.nodes) {
            const { failureSummary: e, element: r } = n,
              s = t.get(e) || t.set(e, []).get(e);
            s?.push(r);
          }
          const { id: n, help: r, description: s, helpUrl: i } = e,
            o = `a11y/${n}: ${r}.`;
          for (const [e, n] of t) {
            const t = Bp(e);
            is(o, Wp, {
              details: `\n\n${s}.\n\n${t}. ([Learn more](${i}))`,
              elements: n,
            });
          }
        }
      },
    });
    const Gp = "informative-dfn",
      Vp = "core/linter-rules/informative-dfn",
      Jp = Dr({
        en: {
          msg: (e, t) =>
            `Normative reference to "${e}" found but term is defined "informatively" in "${t}".`,
          get hint() {
            return ds`
        You can do one of the following...

          * Get the source definition to be made normative
          * Add a \`class="lint-ignore"\` attribute to the link.
          * Use a local normative proxy for the definition à la \`<dfn data-cite="spec">term</dfn>\`

        To silence this warning entirely, set \`lint: { "${Gp}": false }\` in your \`respecConfig\`.`;
          },
        },
        cs: {
          msg: (e, t) =>
            `Nalezen normativní odkaz na "${e}", ale pojem je definován pouze informativně v "${t}".`,
          get hint() {
            return ds`
        Můžete udělat jedno z následujícího...

          * Požádejte o to, aby zdrojová definice byla normativní
          * Přidejte atribut \`class=\"lint-ignore\"\` k odkazu.
          * Použijte lokální normativní proxy pro definici, např. \`<dfn data-cite=\"spec\">term</dfn>\`

        Pro úplné potlačení tohoto varování nastavte \`lint: { \"${Gp}\": false }\` ve vaší \`respecConfig\`.`;
          },
        },
      });
    var Kp = Object.freeze({
        __proto__: null,
        name: Vp,
        run: function (e) {
          if (!e.lint?.[Gp]) return;
          const t = "error" === e.lint[Gp] ? ss : is;
          Pl.forEach(({ term: e, spec: n, element: r }) => {
            r.classList.contains("lint-ignore") ||
              t(Jp.msg(e, n), Vp, {
                title: "Normative reference to non-normative term.",
                elements: [r],
                hint: Jp.hint,
              });
          });
        },
      }),
      Yp = Object.freeze({
        __proto__: null,
        default:
          '// ReSpec Worker\n"use strict";\n// hljs is either inlined by core/worker.js (preferred) or loaded below via\n// importScripts as a fallback when the inline fetch was not possible.\nif (typeof self.hljs === "undefined" && self.RESPEC_HIGHLIGHT_URL) {\n  try {\n    importScripts(self.RESPEC_HIGHLIGHT_URL);\n  } catch (err) {\n    console.error("Network error loading highlighter", err);\n  }\n}\n\nself.addEventListener("message", ({ data }) => {\n  if (data.action !== "highlight") return;\n  const { code } = data;\n  const langs = data.languages?.length ? data.languages : undefined;\n  try {\n    const { value, language } = self.hljs.highlightAuto(code, langs);\n    Object.assign(data, { value, language });\n  } catch (err) {\n    console.error("Could not transform some code?", err);\n    Object.assign(data, { value: code, language: "" });\n  }\n  self.postMessage(data);\n});\n',
      }),
      Zp = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\n\nif (document.respec) {\n  document.respec.ready.then(setupVarHighlighter);\n} else {\n  setupVarHighlighter();\n}\n\nfunction setupVarHighlighter() {\n  document\n    .querySelectorAll("var")\n    .forEach(varElem => varElem.addEventListener("click", highlightListener));\n}\n\n/**\n * @param {MouseEvent} ev\n */\nfunction highlightListener(ev) {\n  ev.stopPropagation();\n  const varElem = /** @type {HTMLElement} */ (ev.target);\n  const hightligtedElems = highlightVars(varElem);\n  const resetListener = () => {\n    const hlColor = getHighlightColor(varElem);\n    hightligtedElems.forEach(el => removeHighlight(el, hlColor));\n    [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));\n  };\n  if (hightligtedElems.length) {\n    document.body.addEventListener("click", resetListener, { once: true });\n  }\n}\n\n// availability of highlight colors. colors from var.css\nconst HL_COLORS = new Map([\n  ["respec-hl-c1", true],\n  ["respec-hl-c2", true],\n  ["respec-hl-c3", true],\n  ["respec-hl-c4", true],\n  ["respec-hl-c5", true],\n  ["respec-hl-c6", true],\n  ["respec-hl-c7", true],\n]);\n\n/**\n * @param {HTMLElement} target\n */\nfunction getHighlightColor(target) {\n  // return current colors if applicable\n  const { value } = target.classList;\n  const re = /respec-hl-\\w+/;\n  const activeClass = re.test(value) && value.match(re);\n  if (activeClass) return activeClass[0];\n\n  // first color preference\n  if (HL_COLORS.get("respec-hl-c1") === true) return "respec-hl-c1";\n\n  // otherwise get some other available color\n  return HL_COLORS.keys().find(c => HL_COLORS.get(c)) || "respec-hl-c1";\n}\n\n/**\n * @param {HTMLElement} varElem\n */\nfunction highlightVars(varElem) {\n  const textContent = norm(varElem.textContent);\n  const parent = /** @type {HTMLElement} */ (\n    varElem.closest(".algorithm, section")\n  );\n  if (!parent) return [];\n  const highlightColor = getHighlightColor(varElem);\n\n  const varsToHighlight = [...parent.querySelectorAll("var")].filter(\n    el =>\n      norm(el.textContent) === textContent &&\n      el.closest(".algorithm, section") === parent\n  );\n\n  // update availability of highlight color\n  const colorStatus = varsToHighlight[0].classList.contains("respec-hl");\n  HL_COLORS.set(highlightColor, colorStatus);\n\n  // highlight vars\n  if (colorStatus) {\n    varsToHighlight.forEach(el => removeHighlight(el, highlightColor));\n    return [];\n  } else {\n    varsToHighlight.forEach(el => addHighlight(el, highlightColor));\n  }\n  return varsToHighlight;\n}\n\n/**\n * @param {HTMLElement} el\n * @param {string} highlightColor\n */\nfunction removeHighlight(el, highlightColor) {\n  el.classList.remove("respec-hl", highlightColor);\n  // clean up empty class attributes so they don\'t come in export\n  if (!el.classList.length) el.removeAttribute("class");\n}\n\n/**\n * @param {HTMLElement} elem\n * @param {string} highlightColor\n */\nfunction addHighlight(elem, highlightColor) {\n  elem.classList.add("respec-hl", highlightColor);\n}\n\n/**\n * Same as `norm` from src/core/utils, but our build process doesn\'t allow\n * imports in runtime scripts, so duplicated here.\n * @param {string} str\n */\nfunction norm(str) {\n  return str.trim().replace(/\\s+/g, " ");\n}\n})()',
      }),
      Xp = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\nif (document.respec) {\n  document.respec.ready.then(setupPanel);\n} else {\n  setupPanel();\n}\n\nfunction setupPanel() {\n  const listener = panelListener();\n  document.body.addEventListener("keydown", listener);\n  document.body.addEventListener("click", listener);\n}\n\nfunction panelListener() {\n  /** @type {HTMLElement | null} */\n  let panel = null;\n  /**\n   * @param {KeyboardEvent|MouseEvent} event\n   */\n  return event => {\n    const { target, type } = event;\n\n    if (!(target instanceof HTMLElement)) return;\n\n    // For keys, we only care about Enter key to activate the panel\n    // otherwise it\'s activated via a click.\n    if (\n      type === "keydown" &&\n      /** @type {KeyboardEvent} */ (event).key !== "Enter"\n    )\n      return;\n\n    const action = deriveAction(event);\n\n    switch (action) {\n      case "show": {\n        hidePanel(panel);\n        /** @type {HTMLElement | null} */\n        const dfn = target.closest("dfn, .index-term");\n        if (!dfn?.id) break;\n        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);\n        if (!panel) break;\n        const coords = deriveCoordinates(\n          /** @type {MouseEvent|KeyboardEvent} */ (event)\n        );\n        displayPanel(dfn, panel, coords);\n        break;\n      }\n      case "dock": {\n        if (panel) {\n          panel.style.left = "";\n          panel.style.top = "";\n          panel.classList.add("docked");\n        }\n        break;\n      }\n      case "hide": {\n        hidePanel(panel);\n        panel = null;\n        break;\n      }\n    }\n  };\n}\n\n/**\n * @param {MouseEvent|KeyboardEvent} event\n */\nfunction deriveCoordinates(event) {\n  const target = /** @type HTMLElement */ (event.target);\n\n  // We prevent synthetic AT clicks from putting\n  // the dialog in a weird place. The AT events sometimes\n  // lack coordinates, so they have clientX/Y = 0\n  const rect = target.getBoundingClientRect();\n  if (\n    event instanceof MouseEvent &&\n    event.clientX >= rect.left &&\n    event.clientY >= rect.top\n  ) {\n    // The event probably happened inside the bounding rect...\n    return { x: event.clientX, y: event.clientY };\n  }\n\n  // Offset to the middle of the element\n  const x = rect.x + rect.width / 2;\n  // Placed at the bottom of the element\n  const y = rect.y + rect.height;\n  return { x, y };\n}\n\n/**\n * @param {Event} event\n */\nfunction deriveAction(event) {\n  const target = /** @type {HTMLElement} */ (event.target);\n  const hitALink = !!target.closest("a");\n  if (target.closest("dfn:not([data-cite]), .index-term")) {\n    return hitALink ? "none" : "show";\n  }\n  if (target.closest(".dfn-panel")) {\n    if (hitALink) {\n      return target.classList.contains("self-link") ? "hide" : "dock";\n    }\n\n    const panel = /** @type {HTMLElement} */ (target.closest(".dfn-panel"));\n    return panel.classList.contains("docked") ? "hide" : "none";\n  }\n  if (document.querySelector(".dfn-panel:not([hidden])")) {\n    return "hide";\n  }\n  return "none";\n}\n\n/**\n * @param {HTMLElement} dfn\n * @param {HTMLElement} panel\n * @param {{ x: number, y: number }} clickPosition\n */\nfunction displayPanel(dfn, panel, { x, y }) {\n  panel.hidden = false;\n  // distance (px) between edge of panel and the pointing triangle (caret)\n  const MARGIN = 20;\n\n  const dfnRects = dfn.getClientRects();\n  // Find the `top` offset when the `dfn` can be spread across multiple lines\n  let closestTop = 0;\n  let minDiff = Infinity;\n  for (const rect of dfnRects) {\n    const { top, bottom } = rect;\n    const diffFromClickY = Math.abs((top + bottom) / 2 - y);\n    if (diffFromClickY < minDiff) {\n      minDiff = diffFromClickY;\n      closestTop = top;\n    }\n  }\n\n  const top = window.scrollY + closestTop + dfnRects[0].height;\n  const left = x - MARGIN;\n  panel.style.left = `${left}px`;\n  panel.style.top = `${top}px`;\n\n  // Find if the panel is flowing out of the window\n  const panelRect = panel.getBoundingClientRect();\n  const SCREEN_WIDTH = Math.min(window.innerWidth, window.screen.width);\n  if (panelRect.right > SCREEN_WIDTH) {\n    const newLeft = Math.max(MARGIN, x + MARGIN - panelRect.width);\n    const newCaretOffset = left - newLeft;\n    panel.style.left = `${newLeft}px`;\n    /** @type {HTMLElement | null} */\n    const caret = panel.querySelector(".caret");\n    if (caret) caret.style.left = `${newCaretOffset}px`;\n  }\n\n  // As it\'s a dialog, we trap focus.\n  // TODO: when <dialog> becomes a implemented, we should really\n  // use that.\n  trapFocus(panel, dfn);\n}\n\n/**\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction trapFocus(panel, dfn) {\n  /** @type NodeListOf<HTMLAnchorElement> elements */\n  const anchors = panel.querySelectorAll("a[href]");\n  // No need to trap focus\n  if (!anchors.length) return;\n\n  // Move focus to first anchor element\n  const first = anchors.item(0);\n  first.focus();\n\n  const trapListener = createTrapListener(anchors, panel, dfn);\n  panel.addEventListener("keydown", trapListener);\n\n  // Hiding the panel releases the trap\n  const mo = new MutationObserver(records => {\n    const [record] = records;\n    const target = /** @type HTMLElement */ (record.target);\n    if (target.hidden) {\n      panel.removeEventListener("keydown", trapListener);\n      mo.disconnect();\n    }\n  });\n  mo.observe(panel, { attributes: true, attributeFilter: ["hidden"] });\n}\n\n/**\n *\n * @param {NodeListOf<HTMLAnchorElement>} anchors\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction createTrapListener(anchors, panel, dfn) {\n  const lastIndex = anchors.length - 1;\n  let currentIndex = 0;\n  /**\n   * @param {KeyboardEvent} event\n   */\n  return event => {\n    switch (event.key) {\n      // Hitting "Tab" traps us in a nice loop around elements.\n      case "Tab": {\n        event.preventDefault();\n        currentIndex += event.shiftKey ? -1 : +1;\n        if (currentIndex < 0) {\n          currentIndex = lastIndex;\n        } else if (currentIndex > lastIndex) {\n          currentIndex = 0;\n        }\n        anchors.item(currentIndex).focus();\n        break;\n      }\n\n      // Hitting "Enter" on an anchor releases the trap.\n      case "Enter":\n        hidePanel(panel);\n        break;\n\n      // Hitting "Escape" returns focus to dfn.\n      case "Escape":\n        hidePanel(panel);\n        dfn.focus();\n        return;\n    }\n  };\n}\n\n/** @param {HTMLElement | null} panel */\nfunction hidePanel(panel) {\n  if (!panel) return;\n  panel.hidden = true;\n  panel.classList.remove("docked");\n}\n})()',
      });
  })());
//# sourceMappingURL=respec-w3c.js.map
