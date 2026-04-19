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
      h = new WeakMap();
    let p = {
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
      p = e(p);
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
            ? new Proxy(e, p)
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
          return (h.set(t, e), t);
        })(e);
      if (d.has(e)) return d.get(e);
      const t = g(e);
      return (t !== e && (d.set(e, t), h.set(t, e)), t);
    }
    const y = e => h.get(e);
    const k = ["get", "getKey", "getAll", "getAllKeys", "count"],
      w = ["put", "add", "delete", "clear"],
      v = new Map();
    function x(e, t) {
      if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
      if (v.get(t)) return v.get(t);
      const n = t.replace(/FromIndex$/, ""),
        r = t !== n,
        s = w.includes(n);
      if (
        !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
        (!s && !k.includes(n))
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
      get: (t, n, r) => x(t, n) || e.get(t, n, r),
      has: (t, n) => !!x(t, n) || e.has(t, n),
    }));
    const $ = ["continue", "continuePrimaryKey", "advance"],
      C = {},
      S = new WeakMap(),
      _ = new WeakMap(),
      T = {
        get(e, t) {
          if (!$.includes(t)) return e[t];
          let n = C[t];
          return (
            n ||
              (n = C[t] =
                function (...e) {
                  S.set(this, _.get(this)[t](...e));
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
      for (_.set(n, t), h.set(n, y(t)); t; )
        (yield n, (t = await (S.get(n) || t.continue())), S.delete(n));
    }
    function L(e, t) {
      return (
        (t === Symbol.asyncIterator &&
          a(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        ("iterate" === t && a(e, [IDBIndex, IDBObjectStore]))
      );
    }
    f(e => ({
      ...e,
      get: (t, n, r) => (L(t, n) ? E : e.get(t, n, r)),
      has: (t, n) => L(t, n) || e.has(t, n),
    }));
    var A,
      R = Object.freeze({
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
    })(A || (A = {}));
    const N = Object.entries(A).reduce((e, [t, n]) => ((e[n] = t), e), {});
    class O {
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
          case A.IDENT:
          case A.COMMENT:
          case A.NUMBER:
          case A.FLOAT:
            e += this.literal;
            break;
          case A.STRING:
            e += '"' + this.literal + '"';
            break;
          case A.CTLOP:
            e += "." + this.literal;
            break;
          case A.BYTES:
            e += "'" + this.literal + "'";
            break;
          case A.HEX:
            e += "h'" + this.literal + "'";
            break;
          case A.BASE64:
            e += "b64'" + this.literal + "'";
            break;
          case A.EOF:
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
          `${"  ".repeat(e)}${this.constructor.name}: ${N[this.type]} (${this.type})`,
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
    class P {
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
    class z extends P {
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
    class j extends z {
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
    class I extends j {
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
    class D extends P {
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
    class M extends j {
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
          (!(this.type instanceof q) ||
            this.type instanceof B ||
            this.type instanceof H)
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
    class q extends j {
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
    let H = class extends q {},
      B = class extends q {};
    class F extends j {
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
    class U extends j {
      numericPart;
      typePart;
      constructor(e = null, t = null) {
        (super(), (this.numericPart = e), (this.typePart = t));
      }
      getChildren() {
        return this.typePart ? [this.typePart] : [];
      }
      _serialize(e) {
        let t = this._serializeToken(new O(A.HASH, ""), e);
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
    class W extends j {
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
    class G extends j {
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
    class J extends j {
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
    class V extends j {
      target;
      constructor(e) {
        (super(), (this.target = e));
      }
      getChildren() {
        return [this.target];
      }
      _serialize(e) {
        let t = this._serializeToken(new O(A.AMPERSAND, ""), e);
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
    class K extends j {
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
    class Z extends j {
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
    class Q extends P {
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
    class X extends j {
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
    class Y extends z {
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
    class ee extends z {
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
    class te extends Error {
      constructor(e = "A parsing error occurred") {
        (super(e), (this.name = "ParserError"));
      }
    }
    function ne(e) {
      return (
        (function (e) {
          return ("a" <= e && e <= "z") || ("A" <= e && e <= "Z");
        })(e) || "@_$".includes(e)
      );
    }
    function re(e) {
      return (
        e.length > 0 &&
        "123456789".includes(e[0]) &&
        [...e].every(e => "0123456789".includes(e))
      );
    }
    class se {
      line;
      position;
      constructor(e = -1, t = -1) {
        ((this.line = e), (this.position = t));
      }
    }
    class ie {
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
            return new se(r, e - (n - s) + 1);
          }
        }
        return new se(0, 0);
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
        let n = new O(A.ILLEGAL, "");
        const r = String.fromCharCode(this.ch);
        let s = !1;
        if ("=" === r)
          ">" === this._peekAtNextChar()
            ? (this.readChar(), (n = new O(A.ARROWMAP, "", e, t)))
            : (n = new O(A.ASSIGN, "", e, t));
        else if ("(" === r) n = new O(A.LPAREN, "", e, t);
        else if (")" === r) n = new O(A.RPAREN, "", e, t);
        else if ("{" === r) n = new O(A.LBRACE, "", e, t);
        else if ("}" === r) n = new O(A.RBRACE, "", e, t);
        else if ("[" === r) n = new O(A.LBRACK, "", e, t);
        else if ("]" === r) n = new O(A.RBRACK, "", e, t);
        else if ("<" === r) n = new O(A.LT, "", e, t);
        else if (">" === r) n = new O(A.GT, "", e, t);
        else if ("+" === r) n = new O(A.PLUS, "", e, t);
        else if ("," === r) n = new O(A.COMMA, "", e, t);
        else if ("." === r)
          "." === this._peekAtNextChar()
            ? (this.readChar(),
              (n = new O(A.INCLRANGE, "", e, t)),
              "." === this._peekAtNextChar() &&
                (this.readChar(), (n = new O(A.EXCLRANGE, "", e, t))))
            : ne(this._peekAtNextChar()) &&
              (this.readChar(),
              (n = new O(A.CTLOP, this._readIdentifier(), e, t)),
              (s = !0));
        else if (":" === r) n = new O(A.COLON, "", e, t);
        else if ("?" === r) n = new O(A.QUEST, "", e, t);
        else if ("/" === r)
          "/" === this._peekAtNextChar()
            ? (this.readChar(),
              (n = new O(A.GCHOICE, "", e, t)),
              "=" === this._peekAtNextChar() &&
                (this.readChar(), (n = new O(A.GCHOICEALT, "", e, t))))
            : "=" === this._peekAtNextChar()
              ? (this.readChar(), (n = new O(A.TCHOICEALT, "", e, t)))
              : (n = new O(A.TCHOICE, "", e, t));
        else if ("*" === r) n = new O(A.ASTERISK, "", e, t);
        else if ("^" === r) n = new O(A.CARET, "", e, t);
        else if ("#" === r) n = new O(A.HASH, "", e, t);
        else if ("~" === r) n = new O(A.TILDE, "", e, t);
        else if ('"' === r) n = new O(A.STRING, this._readString(), e, t);
        else if ("'" === r) n = new O(A.BYTES, this._readBytesString(), e, t);
        else if (";" === r)
          ((n = new O(A.COMMENT, this._readComment(), e, t)), (s = !0));
        else if ("&" === r) n = new O(A.AMPERSAND, "", e, t);
        else if (0 === this.ch) n = new O(A.EOF, "", e, t);
        else if (ne(r))
          "b" === r && "6" === this._peekAtNextChar()
            ? (this.readChar(),
              this.readChar(),
              "4" === String.fromCharCode(this.ch) &&
              "'" === this._peekAtNextChar()
                ? (this.readChar(),
                  (n = new O(A.BASE64, this._readBytesString(), e, t)))
                : ((n = new O(A.IDENT, this._readIdentifier("b6"), e, t)),
                  (s = !0)))
            : "h" === r && "'" === this._peekAtNextChar()
              ? (this.readChar(),
                (n = new O(A.HEX, this._readBytesString(), e, t)))
              : ((n = new O(A.IDENT, this._readIdentifier(), e, t)), (s = !0));
        else if (this._isDigit(r) || "-" === r) {
          const r = this._readNumberOrFloat();
          ((n = new O(r.includes(".") ? A.FLOAT : A.NUMBER, r, e, t)),
            (s = !0));
        }
        return (s || this.readChar(), n);
      }
      _isDigit(e) {
        return e >= "0" && e <= "9";
      }
      _readIdentifier(e = "") {
        const t = this.position;
        if ("" === e && !ne(String.fromCharCode(this.ch)))
          throw this._tokenError("expected identifier, got nothing");
        for (
          ;
          ne(String.fromCharCode(this.ch)) ||
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
              const n = new O(A.COMMENT, "", [], t);
              e.push(n);
            }
            break;
          }
          const n = new O(A.COMMENT, this._readComment(), [], t);
          e.push(n);
        }
        return e;
      }
      _tokenError(e) {
        const t = this.getLocation();
        return new te(`CDDL token error - line ${t.line + 1}: ${e}`);
      }
    }
    const oe = new O(A.ILLEGAL, "");
    const ae = /^[!#$%&'*+-.^`|~\w]+$/,
      ce = /[\u000A\u000D\u0009\u0020]/u,
      le = /^[\u0009\u{0020}-\{u0073}\u{0080}-\u{00FF}]+$/u;
    function ue(e, t, n) {
      ((t && "" !== t && !e.has(t) && le.test(n)) || null === n) &&
        e.set(t.toLowerCase(), n);
    }
    function de() {
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
    var he = {
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
    function pe(e) {
      he = e;
    }
    var fe = { exec: () => null };
    function me(e, t = "") {
      let n = "string" == typeof e ? e : e.source,
        r = {
          replace: (e, t) => {
            let s = "string" == typeof t ? t : t.source;
            return ((s = s.replace(be.caret, "$1")), (n = n.replace(e, s)), r);
          },
          getRegex: () => new RegExp(n, t),
        };
      return r;
    }
    var ge = (() => {
        try {
          return !!new RegExp("(?<=1)(?<!1)");
        } catch {
          return !1;
        }
      })(),
      be = {
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
      ye = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      ke = / {0,3}(?:[*+-]|\d{1,9}[.)])/,
      we =
        /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      ve = me(we)
        .replace(/bull/g, ke)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/\|table/g, "")
        .getRegex(),
      xe = me(we)
        .replace(/bull/g, ke)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/)
        .getRegex(),
      $e =
        /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      Ce = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,
      Se = me(
        /^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/
      )
        .replace("label", Ce)
        .replace(
          "title",
          /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
        )
        .getRegex(),
      _e = me(/^(bull)([ \t][^\n]+?)?(?:\n|$)/)
        .replace(/bull/g, ke)
        .getRegex(),
      Te =
        "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
      Ee = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
      Le = me(
        "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))",
        "i"
      )
        .replace("comment", Ee)
        .replace("tag", Te)
        .replace(
          "attribute",
          / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
        )
        .getRegex(),
      Ae = me($e)
        .replace("hr", ye)
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
        .replace("tag", Te)
        .getRegex(),
      Re = {
        blockquote: me(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
          .replace("paragraph", Ae)
          .getRegex(),
        code: /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,
        def: Se,
        fences:
          /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        hr: ye,
        html: Le,
        lheading: ve,
        list: _e,
        newline: /^(?:[ \t]*(?:\n|$))+/,
        paragraph: Ae,
        table: fe,
        text: /^[^\n]+/,
      },
      Ne = me(
        "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
      )
        .replace("hr", ye)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("blockquote", " {0,3}>")
        .replace("code", "(?: {4}| {0,3}\t)[^\\n]")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", Te)
        .getRegex(),
      Oe = {
        ...Re,
        lheading: xe,
        table: Ne,
        paragraph: me($e)
          .replace("hr", ye)
          .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
          .replace("|lheading", "")
          .replace("table", Ne)
          .replace("blockquote", " {0,3}>")
          .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
          .replace(
            "html",
            "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
          )
          .replace("tag", Te)
          .getRegex(),
      },
      Pe = {
        ...Re,
        html: me(
          "^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))"
        )
          .replace("comment", Ee)
          .replace(
            /tag/g,
            "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b"
          )
          .getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: fe,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: me($e)
          .replace("hr", ye)
          .replace("heading", " *#{1,6} *[^\n]")
          .replace("lheading", ve)
          .replace("|table", "")
          .replace("blockquote", " {0,3}>")
          .replace("|fences", "")
          .replace("|list", "")
          .replace("|html", "")
          .replace("|tag", "")
          .getRegex(),
      },
      ze = /^( {2,}|\\)\n(?!\s*$)/,
      je = /[\p{P}\p{S}]/u,
      Ie = /[\s\p{P}\p{S}]/u,
      De = /[^\s\p{P}\p{S}]/u,
      Me = me(/^((?![*_])punctSpace)/, "u")
        .replace(/punctSpace/g, Ie)
        .getRegex(),
      qe = /(?!~)[\p{P}\p{S}]/u,
      He = me(/link|precode-code|html/, "g")
        .replace(
          "link",
          /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/
        )
        .replace("precode-", ge ? "(?<!`)()" : "(^^|[^`])")
        .replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/)
        .replace("html", /<(?! )[^<>]*?>/)
        .getRegex(),
      Be = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,
      Fe = me(Be, "u").replace(/punct/g, je).getRegex(),
      Ue = me(Be, "u").replace(/punct/g, qe).getRegex(),
      We =
        "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",
      Ge = me(We, "gu")
        .replace(/notPunctSpace/g, De)
        .replace(/punctSpace/g, Ie)
        .replace(/punct/g, je)
        .getRegex(),
      Je = me(We, "gu")
        .replace(/notPunctSpace/g, /(?:[^\s\p{P}\p{S}]|~)/u)
        .replace(/punctSpace/g, /(?!~)[\s\p{P}\p{S}]/u)
        .replace(/punct/g, qe)
        .getRegex(),
      Ve = me(
        "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
        "gu"
      )
        .replace(/notPunctSpace/g, De)
        .replace(/punctSpace/g, Ie)
        .replace(/punct/g, je)
        .getRegex(),
      Ke = me(/^~~?(?:((?!~)punct)|[^\s~])/, "u")
        .replace(/punct/g, je)
        .getRegex(),
      Ze = me(
        "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",
        "gu"
      )
        .replace(/notPunctSpace/g, De)
        .replace(/punctSpace/g, Ie)
        .replace(/punct/g, je)
        .getRegex(),
      Qe = me(/\\(punct)/, "gu")
        .replace(/punct/g, je)
        .getRegex(),
      Xe = me(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
        .replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
        .replace(
          "email",
          /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
        )
        .getRegex(),
      Ye = me(Ee).replace("(?:--\x3e|$)", "--\x3e").getRegex(),
      et = me(
        "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
      )
        .replace("comment", Ye)
        .replace(
          "attribute",
          /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
        )
        .getRegex(),
      tt =
        /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,
      nt = me(
        /^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/
      )
        .replace("label", tt)
        .replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/)
        .replace(
          "title",
          /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/
        )
        .getRegex(),
      rt = me(/^!?\[(label)\]\[(ref)\]/)
        .replace("label", tt)
        .replace("ref", Ce)
        .getRegex(),
      st = me(/^!?\[(ref)\](?:\[\])?/)
        .replace("ref", Ce)
        .getRegex(),
      it = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,
      ot = {
        _backpedal: fe,
        anyPunctuation: Qe,
        autolink: Xe,
        blockSkip: He,
        br: ze,
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        del: fe,
        delLDelim: fe,
        delRDelim: fe,
        emStrongLDelim: Fe,
        emStrongRDelimAst: Ge,
        emStrongRDelimUnd: Ve,
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        link: nt,
        nolink: st,
        punctuation: Me,
        reflink: rt,
        reflinkSearch: me("reflink|nolink(?!\\()", "g")
          .replace("reflink", rt)
          .replace("nolink", st)
          .getRegex(),
        tag: et,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        url: fe,
      },
      at = {
        ...ot,
        link: me(/^!?\[(label)\]\((.*?)\)/)
          .replace("label", tt)
          .getRegex(),
        reflink: me(/^!?\[(label)\]\s*\[([^\]]*)\]/)
          .replace("label", tt)
          .getRegex(),
      },
      ct = {
        ...ot,
        emStrongRDelimAst: Je,
        emStrongLDelim: Ue,
        delLDelim: Ke,
        delRDelim: Ze,
        url: me(
          /^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/
        )
          .replace("protocol", it)
          .replace(
            "email",
            /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/
          )
          .getRegex(),
        _backpedal:
          /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
        text: me(
          /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
        )
          .replace("protocol", it)
          .getRegex(),
      },
      lt = {
        ...ct,
        br: me(ze).replace("{2,}", "*").getRegex(),
        text: me(ct.text)
          .replace("\\b_", "\\b_| {2,}\\n")
          .replace(/\{2,\}/g, "*")
          .getRegex(),
      },
      ut = { normal: Re, gfm: Oe, pedantic: Pe },
      dt = { normal: ot, gfm: ct, breaks: lt, pedantic: at },
      ht = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      },
      pt = e => ht[e];
    function ft(e, t) {
      if (t) {
        if (be.escapeTest.test(e)) return e.replace(be.escapeReplace, pt);
      } else if (be.escapeTestNoEncode.test(e))
        return e.replace(be.escapeReplaceNoEncode, pt);
      return e;
    }
    function mt(e) {
      try {
        e = encodeURI(e).replace(be.percentDecode, "%");
      } catch {
        return null;
      }
      return e;
    }
    function gt(e, t) {
      let n = e
          .replace(be.findPipe, (e, t, n) => {
            let r = !1,
              s = t;
            for (; --s >= 0 && "\\" === n[s]; ) r = !r;
            return r ? "|" : " |";
          })
          .split(be.splitPipe),
        r = 0;
      if (
        (n[0].trim() || n.shift(),
        n.length > 0 && !n.at(-1)?.trim() && n.pop(),
        t)
      )
        if (n.length > t) n.splice(t);
        else for (; n.length < t; ) n.push("");
      for (; r < n.length; r++) n[r] = n[r].trim().replace(be.slashPipe, "|");
      return n;
    }
    function bt(e, t, n) {
      let r = e.length;
      if (0 === r) return "";
      let s = 0;
      for (; s < r; ) {
        if (e.charAt(r - s - 1) !== t) break;
        s++;
      }
      return e.slice(0, r - s);
    }
    function yt(e) {
      let t = e.split("\n"),
        n = t.length - 1;
      for (; n >= 0 && !t[n].trim(); ) n--;
      return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
    }
    function kt(e, t = 0) {
      let n = t,
        r = "";
      for (let t of e)
        if ("\t" === t) {
          let e = 4 - (n % 4);
          ((r += " ".repeat(e)), (n += e));
        } else ((r += t), n++);
      return r;
    }
    function wt(e, t, n, r, s) {
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
    var vt = class {
        options;
        rules;
        lexer;
        constructor(e) {
          this.options = e || he;
        }
        space(e) {
          let t = this.rules.block.newline.exec(e);
          if (t && t[0].length > 0) return { type: "space", raw: t[0] };
        }
        code(e) {
          let t = this.rules.block.code.exec(e);
          if (t) {
            let e = this.options.pedantic ? t[0] : yt(t[0]),
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
              let t = bt(e, "#");
              (this.options.pedantic ||
                !t ||
                this.rules.other.endingSpaceChar.test(t)) &&
                (e = t.trim());
            }
            return {
              type: "heading",
              raw: bt(t[0], "\n"),
              depth: t[1].length,
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        hr(e) {
          let t = this.rules.block.hr.exec(e);
          if (t) return { type: "hr", raw: bt(t[0], "\n") };
        }
        blockquote(e) {
          let t = this.rules.block.blockquote.exec(e);
          if (t) {
            let e = bt(t[0], "\n").split("\n"),
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
              let c = kt(t[2].split("\n", 1)[0], t[1].length),
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
                  h = this.rules.other.blockquoteBeginRegex(d);
                for (; e; ) {
                  let p,
                    f = e.split("\n", 1)[0];
                  if (
                    ((l = f),
                    this.options.pedantic
                      ? ((l = l.replace(
                          this.rules.other.listReplaceNesting,
                          "  "
                        )),
                        (p = l))
                      : (p = l.replace(this.rules.other.tabCharGlobal, "    ")),
                    s.test(l) ||
                      i.test(l) ||
                      o.test(l) ||
                      h.test(l) ||
                      t.test(l) ||
                      n.test(l))
                  )
                    break;
                  if (p.search(this.rules.other.nonSpaceChar) >= d || !l.trim())
                    a += "\n" + p.slice(d);
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
                    (c = p.slice(d)));
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
            let e = yt(t[0]);
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
              raw: bt(t[0], "\n"),
              href: n,
              title: r,
            };
          }
        }
        table(e) {
          let t = this.rules.block.table.exec(e);
          if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
          let n = gt(t[1]),
            r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"),
            s = t[3]?.trim()
              ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n")
              : [],
            i = {
              type: "table",
              raw: bt(t[0], "\n"),
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
                gt(e, i.header.length).map((e, t) => ({
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
              raw: bt(t[0], "\n"),
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
              let t = bt(e.slice(0, -1), "\\");
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
              wt(
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
            return wt(n, e, n[0], this.lexer, this.rules);
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
      xt = class e {
        tokens;
        options;
        state;
        inlineQueue;
        tokenizer;
        constructor(e) {
          ((this.tokens = []),
            (this.tokens.links = Object.create(null)),
            (this.options = e || he),
            (this.options.tokenizer = this.options.tokenizer || new vt()),
            (this.tokenizer = this.options.tokenizer),
            (this.tokenizer.options = this.options),
            (this.tokenizer.lexer = this),
            (this.inlineQueue = []),
            (this.state = { inLink: !1, inRawBlock: !1, top: !0 }));
          let t = { other: be, block: ut.normal, inline: dt.normal };
          (this.options.pedantic
            ? ((t.block = ut.pedantic), (t.inline = dt.pedantic))
            : this.options.gfm &&
              ((t.block = ut.gfm),
              this.options.breaks
                ? (t.inline = dt.breaks)
                : (t.inline = dt.gfm)),
            (this.tokenizer.rules = t));
        }
        static get rules() {
          return { block: ut, inline: dt };
        }
        static lex(t, n) {
          return new e(n).lex(t);
        }
        static lexInline(t, n) {
          return new e(n).inlineTokens(t);
        }
        lex(e) {
          ((e = e.replace(be.carriageReturn, "\n")),
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
                  .replace(be.tabCharGlobal, "    ")
                  .replace(be.spaceLine, ""));
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
      $t = class {
        options;
        parser;
        constructor(e) {
          this.options = e || he;
        }
        space(e) {
          return "";
        }
        code({ text: e, lang: t, escaped: n }) {
          let r = (t || "").match(be.notSpaceStart)?.[0],
            s = e.replace(be.endingNewline, "") + "\n";
          return r
            ? '<pre><code class="language-' +
                ft(r) +
                '">' +
                (n ? s : ft(s, !0)) +
                "</code></pre>\n"
            : "<pre><code>" + (n ? s : ft(s, !0)) + "</code></pre>\n";
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
          return `<code>${ft(e, !0)}</code>`;
        }
        br(e) {
          return "<br>";
        }
        del({ tokens: e }) {
          return `<del>${this.parser.parseInline(e)}</del>`;
        }
        link({ href: e, title: t, tokens: n }) {
          let r = this.parser.parseInline(n),
            s = mt(e);
          if (null === s) return r;
          let i = '<a href="' + (e = s) + '"';
          return (
            t && (i += ' title="' + ft(t) + '"'),
            (i += ">" + r + "</a>"),
            i
          );
        }
        image({ href: e, title: t, text: n, tokens: r }) {
          r && (n = this.parser.parseInline(r, this.parser.textRenderer));
          let s = mt(e);
          if (null === s) return ft(n);
          let i = `<img src="${(e = s)}" alt="${ft(n)}"`;
          return (t && (i += ` title="${ft(t)}"`), (i += ">"), i);
        }
        text(e) {
          return "tokens" in e && e.tokens
            ? this.parser.parseInline(e.tokens)
            : "escaped" in e && e.escaped
              ? e.text
              : ft(e.text);
        }
      },
      Ct = class {
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
      St = class e {
        options;
        renderer;
        textRenderer;
        constructor(e) {
          ((this.options = e || he),
            (this.options.renderer = this.options.renderer || new $t()),
            (this.renderer = this.options.renderer),
            (this.renderer.options = this.options),
            (this.renderer.parser = this),
            (this.textRenderer = new Ct()));
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
      _t = class {
        options;
        block;
        constructor(e) {
          this.options = e || he;
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
          return e ? xt.lex : xt.lexInline;
        }
        provideParser(e = this.block) {
          return e ? St.parse : St.parseInline;
        }
      },
      Tt = new (class {
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
        Parser = St;
        Renderer = $t;
        TextRenderer = Ct;
        Lexer = xt;
        Tokenizer = vt;
        Hooks = _t;
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
                let t = this.defaults.renderer || new $t(this.defaults);
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
                let t = this.defaults.tokenizer || new vt(this.defaults);
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
                let t = this.defaults.hooks || new _t();
                for (let n in e.hooks) {
                  if (!(n in t)) throw new Error(`hook '${n}' does not exist`);
                  if (["options", "block"].includes(n)) continue;
                  let r = n,
                    s = e.hooks[r],
                    i = t[r];
                  _t.passThroughHooks.has(n)
                    ? (t[r] = e => {
                        if (
                          this.defaults.async &&
                          _t.passThroughHooksRespectAsync.has(n)
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
          return xt.lex(e, t ?? this.defaults);
        }
        parser(e, t) {
          return St.parse(e, t ?? this.defaults);
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
                        ? xt.lex
                        : xt.lexInline
                  )(n, s),
                  i = s.hooks ? await s.hooks.processAllTokens(r) : r;
                s.walkTokens &&
                  (await Promise.all(this.walkTokens(i, s.walkTokens)));
                let o = await (
                  s.hooks
                    ? await s.hooks.provideParser(e)
                    : e
                      ? St.parse
                      : St.parseInline
                )(i, s);
                return s.hooks ? await s.hooks.postprocess(o) : o;
              })().catch(i);
            try {
              s.hooks && (t = s.hooks.preprocess(t));
              let n = (
                s.hooks ? s.hooks.provideLexer(e) : e ? xt.lex : xt.lexInline
              )(t, s);
              (s.hooks && (n = s.hooks.processAllTokens(n)),
                s.walkTokens && this.walkTokens(n, s.walkTokens));
              let r = (
                s.hooks
                  ? s.hooks.provideParser(e)
                  : e
                    ? St.parse
                    : St.parseInline
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
                ft(n.message + "", !0) +
                "</pre>";
              return t ? Promise.resolve(e) : e;
            }
            if (t) return Promise.reject(n);
            throw n;
          };
        }
      })();
    function Et(e, t) {
      return Tt.parse(e, t);
    }
    function Lt(e) {
      return e &&
        e.__esModule &&
        Object.prototype.hasOwnProperty.call(e, "default")
        ? e.default
        : e;
    }
    ((Et.options = Et.setOptions =
      function (e) {
        return (
          Tt.setOptions(e),
          (Et.defaults = Tt.defaults),
          pe(Et.defaults),
          Et
        );
      }),
      (Et.getDefaults = de),
      (Et.defaults = he),
      (Et.use = function (...e) {
        return (Tt.use(...e), (Et.defaults = Tt.defaults), pe(Et.defaults), Et);
      }),
      (Et.walkTokens = function (e, t) {
        return Tt.walkTokens(e, t);
      }),
      (Et.parseInline = Tt.parseInline),
      (Et.Parser = St),
      (Et.parser = St.parse),
      (Et.Renderer = $t),
      (Et.TextRenderer = Ct),
      (Et.Lexer = xt),
      (Et.lexer = xt.lex),
      (Et.Tokenizer = vt),
      (Et.Hooks = _t),
      (Et.parse = Et),
      Et.options,
      Et.setOptions,
      Et.use,
      Et.walkTokens,
      Et.parseInline,
      St.parse,
      xt.lex);
    var At,
      Rt = { exports: {} };
    var Nt,
      Ot =
        (At ||
          ((At = 1),
          (Nt = Rt),
          (function (e, t) {
            Nt.exports = t();
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
        Rt.exports),
      Pt = Lt(Ot),
      zt = (function (e) {
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
          for (; n < r; ) p(e(t[n++], -1));
        }
        var u = r.WeakSet,
          d = [].indexOf,
          h = function (e, t, n) {
            for (var r = 1, s = t; r < s; ) {
              var i = ((r + s) / 2) >>> 0;
              n < e[i] ? (s = i) : (r = 1 + i);
            }
            return r;
          },
          p = function (e) {
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
              p = null == r.before ? null : d(r.before, 0),
              f = t.length,
              m = f,
              g = 0,
              b = n.length,
              y = 0;
            g < m && y < b && u(t[g], n[y]);
          )
            (g++, y++);
          for (; g < m && y < b && u(t[m - 1], n[b - 1]); ) (m--, b--);
          var k = g === m,
            w = y === b;
          if (k && w) return n;
          if (k && y < b) return (s(d, e, n, y, b, c(d, t, g, f, p)), n);
          if (w && g < m) return (l(d, t, g, m), n);
          var v = m - g,
            x = b - y,
            $ = -1;
          if (v < x) {
            if (-1 < ($ = a(n, y, b, t, g, m, u)))
              return (
                s(d, e, n, y, $, d(t[g], 0)),
                s(d, e, n, $ + v, b, c(d, t, m, f, p)),
                n
              );
          } else if (x < v && -1 < ($ = a(t, g, m, n, y, b, u)))
            return (l(d, t, g, $), l(d, t, $ + x, m), n);
          return (
            v < 2 || x < 2
              ? (s(d, e, n, y, b, d(t[g], 0)), l(d, t, g, m))
              : v == x &&
                  (function (e, t, n, r, s, i) {
                    for (; r < s && i(n[r], e[t - 1]); ) (r++, t--);
                    return 0 === t;
                  })(n, b, t, g, m, u)
                ? s(d, e, n, y, b, c(d, t, m, f, p))
                : (function (e, t, n, r, i, o, a, c, u, d, p, f, m) {
                    !(function (e, t, n, r, i, o, a, c, u) {
                      for (var d = [], h = e.length, p = a, f = 0; f < h; )
                        switch (e[f++]) {
                          case 0:
                            (i++, p++);
                            break;
                          case 1:
                            (d.push(r[i]),
                              s(t, n, r, i++, i, p < c ? t(o[p], 0) : u));
                            break;
                          case -1:
                            p++;
                        }
                      for (f = 0; f < h; )
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
                          h,
                          p = n + i,
                          f = [];
                        e: for (b = 0; b <= p; b++) {
                          if (50 < b) return null;
                          for (
                            h = b - 1,
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
                                  (a !== b && u[h + a - 1] < u[h + a + 1])
                                    ? u[h + a + 1]
                                    : u[h + a - 1] + 1) - a;
                              l < i && c < n && o(r[s + l], e[t + c]);
                            )
                              (l++, c++);
                            if (l === i && c === n) break e;
                            d[b + a] = l;
                          }
                        }
                        for (
                          var m = Array(b / 2 + p / 2),
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
                          ((h = b - 1),
                            (u = b ? f[b - 1] : [0, 0]),
                            (a = l - c) == -b ||
                            (a !== b && u[h + a - 1] < u[h + a + 1])
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
                          for (var p = 1; p < l; p++) d[p] = o;
                          for (var f = s.slice(i, o), m = t; m < n; m++) {
                            var g,
                              b = f.indexOf(e[m]);
                            -1 < b &&
                              -1 < (c = h(d, l, (g = b + i))) &&
                              ((d[c] = g),
                              (u[c] = { newi: m, oldi: g, prev: u[c - 1] }));
                          }
                          for (c = --l, --o; d[c] > o; ) --c;
                          l = a + r - c;
                          var y = Array(l),
                            k = u[c];
                          for (--n; k; ) {
                            for (var w = k.newi, v = k.oldi; w < n; )
                              ((y[--l] = 1), --n);
                            for (; v < o; ) ((y[--l] = -1), --o);
                            ((y[--l] = 0), --n, --o, (k = k.prev));
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
                      p,
                      m
                    );
                  })(d, e, n, y, b, x, t, g, m, v, f, u, p),
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
        var k = y.Map;
        function w() {
          return this;
        }
        function v(e, t) {
          var n = "_" + e + "$";
          return {
            get: function () {
              return this[n] || x(this, n, t.call(this, e));
            },
            set: function (e) {
              x(this, n, e);
            },
          };
        }
        var x = function (e, t, n) {
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
        Object.defineProperties(w.prototype, {
          ELEMENT_NODE: { value: 1 },
          nodeType: { value: -1 },
        });
        var $,
          C,
          S,
          _,
          T,
          E,
          L = {},
          A = {},
          R = [],
          N = A.hasOwnProperty,
          O = 0,
          P = {
            attributes: L,
            define: function (e, t) {
              e.indexOf("-") < 0
                ? (e in A || (O = R.push(e)), (A[e] = t))
                : (L[e] = t);
            },
            invoke: function (e, t) {
              for (var n = 0; n < O; n++) {
                var r = R[n];
                if (N.call(e, r)) return A[r](e[r], t);
              }
            },
          },
          z =
            Array.isArray ||
            ((C = ($ = {}.toString).call([])),
            function (e) {
              return $.call(e) === C;
            }),
          j =
            ((S = e),
            (_ = "fragment"),
            (E =
              "content" in D((T = "template"))
                ? function (e) {
                    var t = D(T);
                    return ((t.innerHTML = e), t.content);
                  }
                : function (e) {
                    var t,
                      n = D(_),
                      r = D(T);
                    return (
                      I(
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
                      var t = D(_),
                        n = D("div");
                      return (
                        (n.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg">' +
                          e +
                          "</svg>"),
                        I(t, n.firstChild.childNodes),
                        t
                      );
                    }
                  : E
              )(e);
            });
        function I(e, t) {
          for (var n = t.length; n--; ) e.appendChild(t[0]);
        }
        function D(e) {
          return e === _
            ? S.createDocumentFragment()
            : S.createElementNS("http://www.w3.org/1999/xhtml", e);
        }
        var M,
          q,
          H,
          B,
          F,
          U,
          W,
          G,
          J,
          V =
            ((q = "appendChild"),
            (H = "cloneNode"),
            (B = "createTextNode"),
            (U = (F = "importNode") in (M = e)),
            (W = M.createDocumentFragment())[q](M[B]("g")),
            W[q](M[B]("")),
            (U ? M[F](W, !0) : W[H](!0)).childNodes.length < 2
              ? function e(t, n) {
                  for (
                    var r = t[H](), s = t.childNodes || [], i = s.length, o = 0;
                    n && o < i;
                    o++
                  )
                    r[q](e(s[o], n));
                  return r;
                }
              : U
                ? M[F]
                : function (e, t) {
                    return e[H](!!t);
                  }),
          K =
            "".trim ||
            function () {
              return String(this).replace(/^\s+|\s+/g, "");
            },
          Z = "-" + Math.random().toFixed(6) + "%",
          Q = !1;
        try {
          ((G = e.createElement("template")),
            (J = "tabindex"),
            ("content" in G &&
              ((G.innerHTML = "<p " + J + '="' + Z + '"></p>'),
              G.content.childNodes[0].getAttribute(J) == Z)) ||
              ((Z = "_dt: " + Z.slice(1, -1) + ";"), (Q = !0)));
        } catch (u) {}
        var X = "\x3c!--" + Z + "--\x3e",
          Y = 8,
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
        function he(e, t, n, r) {
          return "<" + t + n.replace(de, pe) + r;
        }
        function pe(e, t, n) {
          return t + (n || '"') + Z + (n || '"');
        }
        function fe(e, t, n) {
          return re.test(t) ? e : "<" + t + n + "></" + t + ">";
        }
        var me = Q
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
                    var h = l[d++],
                      p = h.value === Z;
                    if (p || 1 < (i = h.value.split(X)).length) {
                      var f = h.name;
                      if (a.indexOf(f) < 0) {
                        a.push(f);
                        var m = r
                            .shift()
                            .replace(
                              p
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
                        if (p) n.push(be(g, s, m, null));
                        else {
                          for (var b = i.length - 2; b--; ) r.shift();
                          n.push(be(g, s, m, i));
                        }
                      }
                      c.push(h);
                    }
                  }
                  for (
                    var y =
                      (d = 0) < (u = c.length) &&
                      Q &&
                      !("ownerSVGElement" in t);
                    d < u;
                  ) {
                    var k = c[d++];
                    (y && (k.value = ""), t.removeAttribute(k.name));
                  }
                  var w = t.nodeName;
                  if (/^script$/i.test(w)) {
                    var v = e.createElement(w);
                    for (u = o.length, d = 0; d < u; )
                      v.setAttributeNode(o[d++].cloneNode(!0));
                    ((v.textContent = t.textContent),
                      t.parentNode.replaceChild(v, t));
                  }
                })(c, n, r, l),
                  ge(c, n, r, l));
                break;
              case Y:
                var u = c.textContent;
                if (u === Z)
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
        var ke,
          we =
            ((ke = new n()),
            {
              get: function (e) {
                return ke.get(e);
              },
              set: function (e, t) {
                return (ke.set(e, t), t);
              },
            });
        function ve(e, t) {
          var n = (
              e.convert ||
              function (e) {
                return e.join(X).replace(ue, fe).replace(le, he);
              }
            )(t),
            r = e.transform;
          r && (n = r(n));
          var s = j(n, e.type);
          $e(s);
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
        var xe = [];
        function $e(e) {
          for (var t = e.childNodes, n = t.length; n--; ) {
            var r = t[n];
            1 !== r.nodeType &&
              0 === K.call(r.textContent).length &&
              e.removeChild(r);
          }
        }
        var Ce,
          Se,
          _e =
            ((Ce = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i),
            (Se = /([^A-Z])([A-Z]+)/g),
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
                            n.push(t.replace(Se, Te), ":", e[t], ";");
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
        var Le,
          Ae,
          Re =
            ((Le = [].slice),
            ((Ae = Ne.prototype).ELEMENT_NODE = 1),
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
            Ne);
        function Ne(e) {
          var t = (this.childNodes = Le.call(e, 0));
          ((this.firstChild = t[0]),
            (this.lastChild = t[t.length - 1]),
            (this.ownerDocument = t[0].ownerDocument),
            (this._ = null));
        }
        function Oe(e) {
          return { html: e };
        }
        function Pe(e, t) {
          switch (e.nodeType) {
            case Ue:
              return 1 / t < 0
                ? t
                  ? e.remove(!0)
                  : e.lastChild
                : t
                  ? e.valueOf(!0)
                  : e.firstChild;
            case Fe:
              return Pe(e.render(), t);
            default:
              return e;
          }
        }
        function ze(e, t) {
          (t(e.placeholder),
            "text" in e
              ? Promise.resolve(e.text).then(String).then(t)
              : "any" in e
                ? Promise.resolve(e.any).then(t)
                : "html" in e
                  ? Promise.resolve(e.html).then(Oe).then(t)
                  : Promise.resolve(P.invoke(e, t)).then(t));
        }
        function je(e) {
          return null != e && "then" in e;
        }
        var Ie,
          De,
          Me,
          qe,
          He,
          Be = "ownerSVGElement",
          Fe = w.prototype.nodeType,
          Ue = Re.prototype.nodeType,
          We =
            ((De = (Ie = { Event: b, WeakSet: u }).Event),
            (Me = Ie.WeakSet),
            (qe = !0),
            (He = null),
            function (e) {
              return (
                qe &&
                  ((qe = !qe),
                  (He = new Me()),
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
                        var s, i = new De(t), o = e.length, a = 0;
                        a < o;
                        1 === (s = e[a++]).nodeType &&
                        (function e(t, n, r, s, i) {
                          He.has(t) &&
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
                He.add(e),
                e
              );
            }),
          Ge = /^(?:form|list)$/i,
          Je = [].slice;
        function Ve(t) {
          return (
            (this.type = t),
            (function (t) {
              var n = xe,
                r = $e;
              return function (s) {
                var i, o, a;
                return (
                  n !== s &&
                    ((i = t),
                    (o = n = s),
                    (a = we.get(o) || we.set(o, ve(i, o))),
                    (r = a.updates(V.call(e, a.content, !0)))),
                  r.apply(null, arguments)
                );
              };
            })(this)
          );
        }
        var Ke = !(Ve.prototype = {
            attribute: function (e, t, n) {
              var r,
                s = Be in e;
              if ("style" === t) return _e(e, n, s);
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
                    ? We(e)
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
              if (t in P.attributes)
                return function (n) {
                  var s = P.attributes[t](e, n);
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
                h = n.cloneNode(!0);
              return function (t) {
                r !== t &&
                  ((r = t),
                  h.value !== t &&
                    (null == t
                      ? (d && ((d = !1), e.removeAttributeNode(h)),
                        (h.value = t))
                      : ((h.value = t),
                        d || ((d = !0), e.setAttributeNode(h)))));
              };
            },
            any: function (e, t) {
              var n,
                r = { node: Pe, before: e },
                s = Be in e ? "svg" : "html",
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
                    if (((i = !1), z((n = a))))
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
                              (z(a[0]) && (a = a.concat.apply([], a)), je(a[0]))
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
                            11 === a.nodeType ? Je.call(a.childNodes) : [a],
                            r
                          ))
                        : je(a)
                          ? a.then(o)
                          : "placeholder" in a
                            ? ze(a, o)
                            : "text" in a
                              ? o(String(a.text))
                              : "any" in a
                                ? o(a.any)
                                : "html" in a
                                  ? (t = f(
                                      e.parentNode,
                                      t,
                                      Je.call(
                                        j([].concat(a.html).join(""), s)
                                          .childNodes
                                      ),
                                      r
                                    ))
                                  : o(
                                      "length" in a
                                        ? Je.call(a)
                                        : P.invoke(a, o)
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
                    ? je(r)
                      ? r.then(n)
                      : "placeholder" in r
                        ? ze(r, n)
                        : n(
                            "text" in r
                              ? String(r.text)
                              : "any" in r
                                ? r.any
                                : "html" in r
                                  ? [].concat(r.html).join("")
                                  : "length" in r
                                    ? Je.call(r).join("")
                                    : P.invoke(r, n)
                          )
                    : "function" == s
                      ? n(r(e))
                      : (e.textContent = null == r ? "" : r));
              };
            },
          }),
          Ze = function (t) {
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
                  (Ze = c
                    ? i
                    : ((o = new n()),
                      function (e) {
                        return o.get(e) || ((n = i((t = e))), o.set(t, n), n);
                        var t, n;
                      })))
                : (Ke = !0),
              Qe(t)
            );
          };
        function Qe(e) {
          return Ke ? e : Ze(e);
        }
        function Xe(e) {
          for (var t = arguments.length, n = [Qe(e)], r = 1; r < t; )
            n.push(arguments[r++]);
          return n;
        }
        var Ye = new n(),
          et = function (e) {
            var t, n, r;
            return function () {
              var s = Xe.apply(null, arguments);
              return (
                r !== s[0]
                  ? ((r = s[0]), (n = new Ve(e)), (t = nt(n.apply(n, s))))
                  : n.apply(n, s),
                t
              );
            };
          },
          tt = function (e, t) {
            var n = t.indexOf(":"),
              r = Ye.get(e),
              s = t;
            return (
              -1 < n && ((s = t.slice(n + 1)), (t = t.slice(0, n) || "html")),
              r || Ye.set(e, (r = {})),
              r[s] || (r[s] = et(t))
            );
          },
          nt = function (e) {
            var t = e.childNodes,
              n = t.length;
            return 1 === n ? t[0] : n ? new Re(t) : e;
          },
          rt = new n();
        function st() {
          var e = rt.get(this),
            t = Xe.apply(null, arguments);
          return (
            e && e.template === t[0]
              ? e.tagger.apply(null, t)
              : function (e) {
                  var t = new Ve(Be in this ? "svg" : "html");
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
          lt = P.define,
          ut = Ve.prototype;
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
          (dt.Component = w),
          (dt.bind = function (e) {
            return st.bind(e);
          }),
          (dt.define = lt),
          (dt.diff = f),
          ((dt.hyper = dt).observe = We),
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
          Object.defineProperties(w, {
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
                  ot.get(e) || ((r = e), (s = new k()), ot.set(r, s), s),
                  e,
                  null == t ? "default" : t
                );
                var r, s;
              },
            },
          }),
          Object.defineProperties(w.prototype, {
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
        Component: jt,
        bind: It,
        define: Dt,
        diff: Mt,
        hyper: qt,
        wire: Ht,
      } = zt,
      Bt = zt,
      Ft = R,
      Ut = Et,
      Wt = class {
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
                  if (ce.test(c) || ";" === c) continue;
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
                      ue(i, r, s),
                      (r = ""));
                    continue;
                  }
                  s = "string" == typeof s ? s + c : c;
                  break;
                case "collect-quoted-string":
                  if ('"' === c) {
                    (ue(i, r, s),
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
            r && ue(i, r, s);
            if ("" === t.trim() || !ae.test(t))
              throw new TypeError("Invalid type");
            if ("" === n.trim() || !ae.test(n))
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
                  ? ae.test(n)
                    ? (r += `=${n}`)
                    : (r += `="${n}"`)
                  : (r += '=""'),
                (r += ";"));
            return e.essence + r.slice(0, -1);
          })(this);
        }
      },
      Gt = Pt,
      Jt = class {
        lexer;
        curToken = oe;
        peekToken = oe;
        getCurToken() {
          return this.curToken;
        }
        getPeekToken() {
          return this.peekToken;
        }
        constructor(e) {
          ((this.lexer = new ie(e)), this._nextToken(), this._nextToken());
        }
        parse() {
          const e = [];
          for (; this.getCurToken().type !== A.EOF; ) {
            const t = this._parseRule();
            e.push(t);
          }
          const t = new I(e);
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
          if (t.type === A.ASSIGN || t.type === A.GCHOICEALT) {
            const r = this._parseGroupEntry();
            n = new D(e, t, r);
          } else {
            if (t.type !== A.TCHOICEALT)
              throw this._parserError(
                `expected assignment (\`=\`, \`/=\`, \`//=\`) after \`${e.serialize().trim()}\`, got \`${t.serialize().trim()}\``
              );
            {
              const r = this._parseType();
              if (!(r instanceof X)) throw new Error("Expected Type instance");
              n = new D(e, t, r);
            }
          }
          return n;
        }
        _parseGroupEntry() {
          const e = this._parseOccurrence(),
            t = this._parseType(!0);
          let n;
          if (t instanceof Q) {
            const r = this._parseType(!1);
            if (!(r instanceof X)) throw new Error("Expected Type instance");
            n = new M(e, t, r);
          } else n = new M(e, null, t);
          return n;
        }
        _parseType(e = !1) {
          const t = [];
          let n = this._parseType1(e);
          if ((t.push(n), e && this.getCurToken().type === A.CARET)) {
            const e = [];
            if (
              (e.push(this._nextToken()),
              this.getCurToken().type !== A.ARROWMAP)
            )
              throw this._parserError(
                "expected arrow map (`=>`), got `#{(this.getCurToken().serialize() + this.getPeekToken().serialize()).trim()}`"
              );
            e.push(this._nextToken());
            return new Q(n, !0, !1, e);
          }
          if (e && this.getCurToken().type === A.ARROWMAP) {
            return new Q(n, !1, !1, [this._nextToken()]);
          }
          if (e && this.getCurToken().type === A.COLON) {
            return new Q(n, !0, !0, [this._nextToken()]);
          }
          for (; this.getCurToken().type === A.TCHOICE; )
            ((n.separator = this._nextToken()),
              (n = this._parseType1()),
              t.push(n));
          return new X(t);
        }
        _parseType1(e = !1) {
          const t = this._parseType2(e);
          let n;
          if (
            this.getCurToken().type === A.INCLRANGE ||
            this.getCurToken().type === A.EXCLRANGE
          ) {
            const e = this._nextToken(),
              r = this._parseType2();
            if (!(t instanceof G || t instanceof J))
              throw this._parserError(
                `expected range min to be a value or a typename, got \`${t.serialize().trim()}\``
              );
            if (!(r instanceof G || r instanceof J))
              throw this._parserError(
                `expected range max to be a value or a typename, got \`${r.serialize().trim()}\``
              );
            n = new K(t, r, e);
          } else if (this.getCurToken().type === A.CTLOP) {
            const e = this._nextToken(),
              r = this._parseType2();
            n = new Z(t, e, r);
          } else n = t;
          return n;
        }
        _parseType2(e = !1) {
          let t;
          if (this.getCurToken().type === A.LPAREN) {
            const n = this._nextToken();
            if (e) t = this._parseGroup(!1);
            else {
              const e = this._parseType();
              if (!(e instanceof X)) throw new Error("Expected Type instance");
              t = e;
            }
            if (((t.openToken = n), this.getCurToken().type !== A.RPAREN))
              throw this._parserError(
                `expected right parenthesis, got \`${this.getCurToken().serialize().trim()}\``
              );
            t.closeToken = this._nextToken();
          } else if (this.getCurToken().type === A.LBRACE) {
            const e = this._nextToken();
            if (
              ((t = this._parseGroup(!0)),
              (t.openToken = e),
              this.getCurToken().type !== A.RBRACE)
            )
              throw this._parserError(
                `expected right brace, got \`${this.getCurToken().serialize()}\``
              );
            t.closeToken = this._nextToken();
          } else if (this.getCurToken().type === A.LBRACK) {
            const e = this._nextToken(),
              n = this._parseGroup(!1);
            if (
              ((t = new B(n.groupChoices)),
              (t.openToken = e),
              this.getCurToken().type !== A.RBRACK)
            )
              throw this._parserError(
                `expected right bracket, got \`${this.getCurToken().serialize().trim()}\``
              );
            t.closeToken = this._nextToken();
          } else if (this.getCurToken().type === A.TILDE) {
            const e = this._nextToken();
            t = this._parseTypename(!1, e);
          } else if (this.getCurToken().type === A.AMPERSAND) {
            const e = this._nextToken();
            if (this.getCurToken().type === A.LPAREN) {
              const e = this._nextToken(),
                n = this._parseGroup(!1);
              if (((n.openToken = e), this.getCurToken().type !== A.RPAREN))
                throw this._parserError(
                  `expected right parenthesis, got \`${this.getCurToken().serialize().trim()}\``
                );
              ((n.closeToken = this._nextToken()), (t = new V(n)));
            } else {
              const e = this._parseTypename(!1, null);
              t = new V(e);
            }
            t.setComments(e);
          } else if (this.getCurToken().type === A.HASH) {
            const e = this._nextToken();
            if (
              (this.getCurToken().type !== A.NUMBER &&
                this.getCurToken().type !== A.FLOAT) ||
              this.getCurToken().startWithSpaces()
            )
              t = new U();
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
                this.getCurToken().type !== A.LPAREN ||
                this.getCurToken().startWithSpaces()
              )
                t = new U(e);
              else {
                const n = this._parseType2();
                if (!(n instanceof X))
                  throw new Error("Expected Type instance");
                t = new U(e, n);
              }
            }
            t.setComments(e);
          } else if (this.getCurToken().type === A.IDENT)
            t = this._parseTypename(!1, null);
          else if (this.getCurToken().type === A.STRING) {
            const e = this._nextToken();
            ((t = new G(e.literal, "text")), t.setComments(e));
          } else if (this.getCurToken().type === A.BYTES) {
            const e = this._nextToken();
            ((t = new G(e.literal, "bytes")), t.setComments(e));
          } else if (this.getCurToken().type === A.HEX) {
            const e = this._nextToken();
            ((t = new G(e.literal, "hex")), t.setComments(e));
          } else if (this.getCurToken().type === A.BASE64) {
            const e = this._nextToken();
            ((t = new G(e.literal, "base64")), t.setComments(e));
          } else if (this.getCurToken().type === A.NUMBER) {
            const e = this._nextToken();
            ((t = new G(e.literal, "number")), t.setComments(e));
          } else {
            if (this.getCurToken().type !== A.FLOAT)
              throw this._parserError(
                `invalid type2 production, got \`${this.getCurToken().serialize().trim()}\``
              );
            {
              const e = this._nextToken();
              ((t = new G(e.literal, "number")), t.setComments(e));
            }
          }
          return t;
        }
        _parseGroup(e = !1) {
          const t = [];
          for (
            ;
            this.getCurToken().type !== A.RPAREN &&
            this.getCurToken().type !== A.RBRACE &&
            this.getCurToken().type !== A.RBRACK;
          ) {
            const e = [];
            for (; this.getCurToken().type !== A.GCHOICE; ) {
              const t = this._parseGroupEntry();
              if (
                (e.push(t),
                this.getCurToken().type === A.COMMA &&
                  (t.separator = this._nextToken()),
                this.getCurToken().type === A.RPAREN ||
                  this.getCurToken().type === A.RBRACE ||
                  this.getCurToken().type === A.RBRACK)
              )
                break;
            }
            const n = new F(e);
            if (
              (t.push(n),
              this.getCurToken().type === A.RPAREN ||
                this.getCurToken().type === A.RBRACE ||
                this.getCurToken().type === A.RBRACK)
            )
              break;
            n.separator = this._nextToken();
          }
          let n;
          return ((n = e ? new H(t) : new q(t)), n);
        }
        _parseOccurrence() {
          const e = [];
          let t = null;
          if (
            this.getCurToken().type === A.QUEST ||
            this.getCurToken().type === A.ASTERISK ||
            this.getCurToken().type === A.PLUS
          ) {
            const n = this.getCurToken().type === A.PLUS ? 1 : 0;
            let r = 1 / 0;
            (this.getCurToken().type === A.ASTERISK &&
              this.getPeekToken().type === A.NUMBER &&
              re(this.getPeekToken().literal) &&
              !this.getPeekToken().startWithSpaces() &&
              (e.push(this._nextToken()),
              (r = parseInt(this.getCurToken().literal))),
              e.push(this._nextToken()),
              (t = new W(n, r, e)));
          } else if (
            this.getCurToken().type === A.NUMBER &&
            re(this.getCurToken().literal) &&
            this.getPeekToken().type === A.ASTERISK &&
            !this.getPeekToken().startWithSpaces()
          ) {
            const n = parseInt(this.getCurToken().literal);
            let r = 1 / 0;
            (e.push(this._nextToken()),
              e.push(this._nextToken()),
              this.getCurToken().type === A.NUMBER &&
                re(this.getCurToken().literal) &&
                !this.getCurToken().startWithSpaces() &&
                ((r = parseInt(this.getCurToken().literal)),
                e.push(this._nextToken())),
              (t = new W(n, r, e)));
          }
          return t;
        }
        _parseTypename(e = !1, t = null) {
          if (this.getCurToken().type !== A.IDENT)
            throw this._parserError(
              `expected group identifier, got \`${this.getCurToken().serialize().trim()}\``
            );
          const n = this._nextToken();
          let r;
          r = e
            ? this._parseGenericParameters()
            : this._parseGenericArguments();
          const s = new J(n.literal, t, r);
          return (s.setComments(n), s);
        }
        _parseGenericParameters() {
          if (
            this.getCurToken().type !== A.LT ||
            this.getCurToken().startWithSpaces()
          )
            return null;
          const e = this._nextToken(),
            t = [];
          let n = this._parseTypename();
          for (t.push(n); this.getCurToken().type === A.COMMA; )
            ((n.separator = this._nextToken()),
              (n = this._parseTypename()),
              t.push(n));
          const r = new Y(t);
          if (((r.openToken = e), this.getCurToken().type !== A.GT))
            throw this._parserError(
              `expected \`>\` character to end generic production, got \`${this.getCurToken().serialize().trim()}\``
            );
          return ((r.closeToken = this._nextToken()), r);
        }
        _parseGenericArguments() {
          if (
            this.getCurToken().type !== A.LT ||
            this.getCurToken().startWithSpaces()
          )
            return null;
          const e = this._nextToken(),
            t = [];
          let n = this._parseType1();
          for (t.push(n); this.getCurToken().type === A.COMMA; )
            ((n.separator = this._nextToken()),
              (n = this._parseType1()),
              t.push(n));
          const r = new ee(t);
          if (((r.openToken = e), this.getCurToken().type !== A.GT))
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
                e instanceof G ||
                e instanceof H ||
                e instanceof B ||
                e instanceof V ||
                e instanceof U
              )
                return "type";
              if (e instanceof K) return s(e.min);
              if (e instanceof Z) return s(e.type);
              if (e instanceof J) {
                const t = e.name;
                if (n.has(t) || this._isPreludeType(t)) return "type";
                if (r.has(t)) return "group";
              }
              return "unknown";
            };
          for (const s of e.rules)
            (t.add(s.name.name),
              0 === n.size && n.add(s.name.name),
              s.type instanceof X
                ? n.add(s.name.name)
                : (s.assign.type === A.TCHOICEALT && n.add(s.name.name),
                  s.assign.type === A.GCHOICEALT && r.add(s.name.name),
                  s.type.type.types.length > 1 &&
                    null === s.type.type.openToken &&
                    n.add(s.name.name),
                  null !== s.type.occurrence && r.add(s.name.name),
                  null !== s.type.key && r.add(s.name.name)));
          const i = e => {
            e instanceof M &&
              null !== e.key &&
              e.key.type instanceof J &&
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
              if (i.type instanceof X)
                for (const e of i.type.types)
                  e instanceof J &&
                    t.has(e.name) &&
                    (n.has(e.name) || ((o = !0), n.add(e.name)));
              else {
                if (n.has(i.name.name))
                  for (const e of i.type.type.types)
                    e instanceof J &&
                      t.has(e.name) &&
                      (n.has(e.name) || ((o = !0), n.add(e.name)));
                if (r.has(i.name.name))
                  for (const e of i.type.type.types)
                    e instanceof J &&
                      t.has(e.name) &&
                      (r.has(e.name) || ((o = !0), r.add(e.name)));
                if (i.assign.type === A.ASSIGN) {
                  const e = new Set(i.type.type.types.map(e => s(e)));
                  if (e.has("type") && e.has("group"))
                    throw new te(
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
            throw new te(
              `CDDL semantic error - mix of type and group definitions for ${e}`
            );
          }
          for (const t of e.rules)
            if (!(t.type instanceof X) && n.has(t.name.name)) {
              if (!t.type.isConvertibleToType())
                throw new te(
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
          return new te(`CDDL syntax error - line ${t.line + 1}: ${e}`);
        }
      },
      Vt = class {
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
      Kt = D,
      Zt = Q,
      Qt = Y,
      Xt = ee,
      Yt = X,
      en = W,
      tn = /-/g,
      nn = RegExp.escape ?? (e => e.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"));
    const rn = new Intl.DateTimeFormat(["sv-SE"], {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    "en" === i || i.startsWith("en-");
    const sn =
      ".informative, .note, .issue, .example, .ednote, .practice, .introductory";
    function on(e) {
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
    function an(e) {
      e.querySelectorAll(".remove, script[data-requiremodule]").forEach(e => {
        e.remove();
      });
    }
    function cn(e, t = "long") {
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
    const ln = cn("conjunction"),
      un = cn("disjunction");
    function dn(e, t) {
      return ln(e, t).join("");
    }
    function hn(e) {
      return e
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
    }
    function pn(e) {
      return e.trim().replace(/\s+/g, " ");
    }
    function fn(e, t = i) {
      return (
        (t = t.toLowerCase()),
        new Proxy(e, {
          get(e, n) {
            const r =
              (function (e, t, n = i) {
                n = n.toLowerCase();
                const r = n.match(/^(\w{2,3})-.+$/)?.[1] ?? "";
                return e[n]?.[t] || e[r]?.[t];
              })(e, n, t) || e.en[n];
            if (!r) throw new Error(`No l10n data for key: "${n}"`);
            return r;
          },
        })
      );
    }
    function mn(e, t, ...n) {
      const r = [this, e, ...n];
      if (t) {
        const n = t.split(/\s+/);
        for (const t of n) {
          const n = window[t];
          if (n)
            try {
              e = n.apply(this, r);
            } catch (e) {
              On(
                `call to \`${t}()\` failed with: ${e}.`,
                "utils/runTransforms",
                { hint: "See developer console for stack trace.", cause: e }
              );
            }
        }
      }
      return e;
    }
    function gn(e, t = e => e) {
      const n = e.map(t),
        r = n.slice(0, -1).map(e => Bt`${e}, `);
      return Bt`${r}${n[n.length - 1]}`;
    }
    function bn(e, t = "") {
      const n = (function (e) {
        let t = 0;
        for (const n of e) t = (Math.imul(31, t) + n.charCodeAt(0)) | 0;
        return String(t);
      })(pn(e.textContent));
      return kn(e, t, n);
    }
    function yn(e, t = !1) {
      return (t ? e : e.toLowerCase())
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\W+/gim, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    }
    function kn(e, t = "", n = "", r = !1) {
      if (e.id) return e.id;
      n || (n = (e.title ? e.title : e.textContent).trim());
      let s = yn(n, r);
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
    function wn(e) {
      const t = new Set(),
        n = "ltNodefault" in e.dataset ? "" : pn(e.textContent),
        r = e.children[0];
      if (
        (e.dataset.lt
          ? e.dataset.lt
              .split("|")
              .map(e => pn(e))
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
        e.dataset.localLt.split("|").forEach(e => t.add(pn(e)));
      }
      return [...t];
    }
    function vn(e, t, n = { copyAttributes: !0 }) {
      if (e.localName === t) return e;
      const r = e.ownerDocument.createElement(t);
      if (n.copyAttributes)
        for (const { name: t, value: n } of e.attributes) r.setAttribute(t, n);
      return (r.append(...e.childNodes), e.replaceWith(r), r);
    }
    function xn(e, t) {
      const n = t.closest(sn);
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
    function $n(e, t) {
      return (t.append(...e.childNodes), e.appendChild(t), e);
    }
    function Cn(e, t) {
      const n = [];
      let r = e.parentElement;
      for (; r; ) {
        const e = r.closest(t);
        if (!e) break;
        (n.push(e), (r = e.parentElement));
      }
      return n;
    }
    function Sn(e) {
      const { previousSibling: t } = e;
      if (!t || t.nodeType !== Node.TEXT_NODE) return "";
      const n = (t.textContent ?? "").lastIndexOf("\n");
      if (-1 === n) return "";
      const r = (t.textContent ?? "").slice(n + 1);
      return /\S/.test(r) ? "" : r;
    }
    class _n extends Set {
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
    function Tn(e) {
      const t = e.cloneNode(!0);
      return (
        t.querySelectorAll("[id]").forEach(e => e.removeAttribute("id")),
        t.querySelectorAll("dfn").forEach(e => {
          vn(e, "span", { copyAttributes: !1 });
        }),
        t.hasAttribute("id") && t.removeAttribute("id"),
        En(t),
        t
      );
    }
    function En(e) {
      const t = document.createTreeWalker(e, NodeFilter.SHOW_COMMENT);
      for (const e of [...Ln(t)]) e.remove();
    }
    function* Ln(e) {
      for (; e.nextNode(); ) yield e.currentNode;
    }
    class An extends Map {
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
    class Rn extends Error {
      constructor(e, t, n) {
        super(e, { ...(n.cause && { cause: n.cause }) });
        const r = n.isWarning ? "ReSpecWarning" : "ReSpecError";
        (Object.assign(this, { message: e, plugin: t, name: r, ...n }),
          n.elements &&
            n.elements.forEach(t =>
              (function (e, t, n) {
                (e.classList.add("respec-offending-element"),
                  e.hasAttribute("title") || e.setAttribute("title", n || t),
                  e.id || kn(e, "respec-offender"));
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
    function Nn(e, t, n = {}) {
      const r = { ...n, isWarning: !1 };
      Hn("error", new Rn(e, t, r));
    }
    function On(e, t, n = {}) {
      const r = { ...n, isWarning: !0 };
      Hn("warn", new Rn(e, t, r));
    }
    function Pn(e) {
      return {
        amendConfiguration: e => Hn("amend-user-config", e),
        showError: (t, n) => Nn(t, e, n),
        showWarning: (t, n) => On(t, e, n),
      };
    }
    function zn(e) {
      return e ? `\`${e}\`` : "";
    }
    function jn(e, { quotes: t } = { quotes: !1 }) {
      return un(e, t ? e => zn(In(e)) : zn).join("");
    }
    function In(e) {
      return String(e) ? `"${e}"` : "";
    }
    function Dn(e, ...t) {
      return Mn(
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
    function Mn(e) {
      if (!e) return e;
      const t = e.trimEnd().split("\n");
      for (; t.length && !t[0].trim(); ) t.shift();
      const n = t.filter(e => e.trim()).map(e => e.search(/[^\s]/)),
        r = Math.min(...n);
      return t.map(e => e.slice(r)).join("\n");
    }
    const qn = new EventTarget();
    function Hn(e, t) {
      if (
        (qn.dispatchEvent(new CustomEvent(e, { detail: t })),
        window.parent === window.self)
      )
        return;
      const n = String(JSON.stringify(t?.stack || t));
      window.parent.postMessage(
        { topic: e, args: n },
        window.parent.location.origin
      );
    }
    function Bn(e, t, n = { once: !1 }) {
      qn.addEventListener(
        e,
        async n => {
          try {
            await t(n.detail);
          } catch (t) {
            const n = t;
            Nn(`Error in handler for topic "${e}": ${n.message}`, `sub:${e}`, {
              cause: n,
            });
          }
        },
        n
      );
    }
    n("core/pubsubhub", { sub: Bn });
    const Fn = ["githubToken", "githubUser"];
    const Un = new Map([
      ["text/html", "html"],
      ["application/xml", "xml"],
    ]);
    function Wn(e, t = document) {
      const n = Un.get(e);
      if (!n) {
        const t = [...Un.values()].join(", ");
        throw new TypeError(`Invalid format: ${e}. Expected one of: ${t}.`);
      }
      const r = Gn(n, t);
      return `data:${e};charset=utf-8,${encodeURIComponent(r)}`;
    }
    function Gn(e, t) {
      const n = t.cloneNode(!0);
      !(function (e) {
        const { head: t, body: n, documentElement: r } = e;
        (En(e),
          e
            .querySelectorAll(".removeOnSave, #toc-nav")
            .forEach(e => e.remove()),
          n.classList.remove("toc-sidebar"),
          an(r));
        const s = e.createDocumentFragment(),
          i = e.querySelector("meta[name='viewport']");
        i && t.firstChild !== i && s.appendChild(i);
        const o =
          e.querySelector("meta[charset], meta[content*='charset=']") ||
          Bt`<meta charset="utf-8" />`;
        s.appendChild(o);
        const a = `ReSpec ${window.respecVersion || "Developer Channel"}`,
          c = Bt`
    <meta name="generator" content="${a}" />
  `;
        (s.appendChild(c), t.prepend(s), Hn("beforesave", r));
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
    n("core/exporter", { rsDocToDataURL: Wn });
    class Jn {
      constructor() {
        ((this._respecDonePromise = new Promise(e => {
          Bn("end-all", () => e(), { once: !0 });
        })),
          (this.errors = []),
          (this.warnings = []),
          Bn("error", e => {
            (console.error(e, e.toJSON()), this.errors.push(e));
          }),
          Bn("warn", e => {
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
        return Gn("html", document);
      }
    }
    const Vn = "core/post-process";
    const Kn = "core/pre-process";
    const Zn = "core/base-runner";
    async function Qn(e) {
      (!(function () {
        const e = new Jn();
        Object.defineProperty(document, "respec", { value: e });
      })(),
        Hn("start-all", respecConfig),
        (function (e) {
          const t = {},
            n = e => Object.assign(t, e);
          (n(e),
            Bn("amend-user-config", n),
            Bn("end-all", () => {
              const e = document.createElement("script");
              ((e.id = "initialUserConfig"), (e.type = "application/json"));
              for (const e of Fn) e in t && delete t[e];
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
          (Object.assign(e, r), Hn("amend-user-config", r));
        })(respecConfig),
        performance.mark(`${Zn}-start`),
        await (async function (e) {
          if (Array.isArray(e.preProcess)) {
            const t = e.preProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  Nn("Every item in `preProcess` must be a JS function.", Kn),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${Kn}/${r.name || `[${n}]`}`,
                s = Pn(t);
              try {
                await r(e, document, s);
              } catch (e) {
                Nn(`Function ${t} threw an error during \`preProcess\`.`, Kn, {
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
        Hn("plugins-done", respecConfig),
        await (async function (e) {
          if (Array.isArray(e.postProcess)) {
            const t = e.postProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  Nn("Every item in `postProcess` must be a JS function.", Vn),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${Vn}/${r.name || `[${n}]`}`,
                s = Pn(t);
              try {
                await r(e, document, s);
              } catch (e) {
                Nn(`Function ${t} threw an error during \`postProcess\`.`, Vn, {
                  hint: "See developer console.",
                  cause: e,
                });
              }
            }
          }
          "function" == typeof e.afterEnd && (await e.afterEnd(e, document));
        })(respecConfig),
        Hn("end-all", void 0),
        an(document),
        performance.mark(`${Zn}-end`),
        performance.measure(Zn, `${Zn}-start`, `${Zn}-end`));
    }
    var Xn = String.raw`.respec-modal .close-button{position:absolute;z-index:inherit;padding:.2em;font-weight:700;cursor:pointer;margin-left:5px;border:none;background:0 0}
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
    const Yn = /&gt;/gm,
      er = /&amp;/gm;
    class tr extends Ut.Renderer {
      code(e) {
        const { text: t, lang: n = "" } = e,
          { language: r, ...s } = tr.parseInfoString(n);
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
    const nr = { gfm: !0, renderer: new tr() };
    function rr(e, t = { inline: !1 }) {
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
        r = n.replace(Yn, ">").replace(er, "&");
      return t.inline ? Ut.parseInline(r, nr) : Ut.parse(r, nr);
    }
    function sr(e) {
      for (const t of e.getElementsByTagName("pre")) t.prepend("\n");
      e.innerHTML = rr(e.innerHTML);
    }
    const ir =
      ((or = "[data-format='markdown']:not(body)"),
      e => {
        const t = e.querySelectorAll(or);
        return (t.forEach(sr), Array.from(t));
      });
    var or;
    var ar = Object.freeze({
      __proto__: null,
      markdownToHtml: rr,
      name: "core/markdown",
      run: function (e) {
        const t = !!document.querySelector("[data-format=markdown]:not(body)"),
          n = "markdown" === e.format;
        if (!n && !t) return;
        if (!n) return void ir(document.body);
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
              const t = Sn(e);
              e.append(`\n\n${t}`);
            }
          }
        })(
          s,
          "[data-format=markdown], section, div, address, article, aside, figure, header, main"
        ),
          sr(s),
          (function (e) {
            Array.from(e).forEach(e => {
              e.replaceWith(e.textContent);
            });
          })(s.querySelectorAll(".nolinks a[href]")),
          r && s.append(r),
          document.body.replaceWith(s));
      },
    });
    function cr(e, t) {
      e &&
        Array.from(t).forEach(([t, n]) => {
          e.setAttribute(`aria-${t}`, n);
        });
    }
    !(function () {
      const e = document.createElement("style");
      ((e.id = "respec-ui-styles"),
        (e.textContent = Xn),
        e.classList.add("removeOnSave"),
        document.head.appendChild(e));
    })();
    const lr = Bt`<div id="respec-ui" class="removeOnSave" hidden></div>`,
      ur = Bt`<ul
  id="respec-menu"
  role="menu"
  aria-labelledby="respec-pill"
  hidden
></ul>`,
      dr = Bt`<button
  class="close-button"
  onclick=${() => xr.closeModal()}
  title="Close"
>
  ❌
</button>`;
    let hr, pr;
    window.addEventListener("load", () => kr(ur));
    const fr = [],
      mr = [],
      gr = {};
    (Bn("start-all", () => document.body.prepend(lr), { once: !0 }),
      Bn("end-all", () => document.body.prepend(lr), { once: !0 }));
    const br = Bt`<button id="respec-pill" disabled>ReSpec</button>`;
    function yr() {
      (ur.classList.toggle("respec-hidden"),
        ur.classList.toggle("respec-visible"),
        (ur.hidden = !ur.hidden));
    }
    function kr(e) {
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
    (lr.appendChild(br),
      br.addEventListener("click", e => {
        (e.stopPropagation(),
          br.setAttribute("aria-expanded", String(ur.hidden)),
          yr(),
          ur.querySelector("li:first-child button").focus());
      }),
      document.documentElement.addEventListener("click", () => {
        ur.hidden || yr();
      }),
      lr.appendChild(ur),
      ur.addEventListener("keydown", e => {
        "Escape" !== e.key ||
          ur.hidden ||
          (br.setAttribute("aria-expanded", String(ur.hidden)),
          yr(),
          br.focus());
      }));
    const wr = new Map([
      ["controls", "respec-menu"],
      ["expanded", "false"],
      ["haspopup", "true"],
      ["label", "ReSpec Menu"],
    ]);
    function vr(e, t, n, r) {
      (t.push(e),
        gr.hasOwnProperty(n) ||
          ((gr[n] = (function (e, t, n) {
            const r = `respec-pill-${e}`,
              s = Bt`<button
    id="${r}"
    class="respec-info-button"
  ></button>`;
            s.addEventListener("click", () => {
              s.setAttribute("aria-expanded", "true");
              const r = Bt`<ol class="${`respec-${e}-list`}"></ol>`;
              for (const e of t) {
                const t = document
                    .createRange()
                    .createContextualFragment($r(e)),
                  n = document.createElement("li");
                (t.firstElementChild === t.lastElementChild
                  ? n.append(...t.firstElementChild.childNodes)
                  : n.appendChild(t),
                  r.appendChild(n));
              }
              xr.freshModal(n, r, s);
            });
            const i = new Map([
              ["expanded", "false"],
              ["haspopup", "true"],
              ["controls", `respec-pill-${e}-modal`],
            ]);
            return (cr(s, i), s);
          })(n, t, r)),
          lr.appendChild(gr[n])));
      const s = gr[n];
      s.textContent = String(t.length);
      const i = 1 === t.length ? Gt.singular(r) : r;
      cr(s, new Map([["label", `${t.length} ${i}`]]));
    }
    cr(br, wr);
    const xr = {
      show() {
        try {
          lr.hidden = !1;
        } catch (e) {
          console.error(e);
        }
      },
      hide() {
        lr.hidden = !0;
      },
      enable() {
        br.removeAttribute("disabled");
      },
      addCommand(e, t, n, r) {
        r = r || "";
        const s = `respec-button-${e.toLowerCase().replace(/\s+/, "-")}`,
          i = Bt`<button id="${s}" class="respec-option">
      <span class="respec-cmd-icon" aria-hidden="true">${r}</span> ${e}…
    </button>`,
          o = Bt`<li role="menuitem">${i}</li>`;
        return (o.addEventListener("click", t), ur.appendChild(o), i);
      },
      error(e) {
        vr(e, fr, "error", "ReSpec Errors");
      },
      warning(e) {
        vr(e, mr, "warning", "ReSpec Warnings");
      },
      closeModal(e) {
        if (pr) {
          const e = pr;
          (e.classList.remove("respec-show-overlay"),
            e.classList.add("respec-hide-overlay"),
            e.addEventListener("transitionend", () => {
              (e.remove(), (pr = null));
            }));
        }
        (e && e.setAttribute("aria-expanded", "false"),
          hr && (hr.remove(), (hr = null), br.focus()));
      },
      freshModal(e, t, n) {
        (hr && hr.remove(),
          pr && pr.remove(),
          (pr = Bt`<div id="respec-overlay" class="removeOnSave"></div>`));
        const r = `${n.id}-modal`,
          s = `${r}-heading`;
        hr = Bt`<div
      id="${r}"
      class="respec-modal removeOnSave"
      role="dialog"
      aria-labelledby="${s}"
    >
      ${dr}
      <h3 id="${s}">${e}</h3>
      <div class="inside">${t}</div>
    </div>`;
        const i = new Map([["labelledby", s]]);
        (cr(hr, i),
          document.body.append(pr, hr),
          pr.addEventListener("click", () => this.closeModal(n)),
          pr.classList.toggle("respec-show-overlay"),
          (hr.hidden = !1),
          kr(hr));
      },
    };
    function $r(e) {
      if ("string" == typeof e) return e;
      const t = e.plugin
          ? `<p class="respec-plugin">(plugin: "${e.plugin}")</p>`
          : "",
        n = e.hint
          ? `\n${rr(`<p class="respec-hint"><strong>How to fix:</strong> ${Mn(e.hint)}`, { inline: !e.hint.includes("\n") })}\n`
          : "",
        r = Array.isArray(e.elements)
          ? `<p class="respec-occurrences">Occurred <strong>${e.elements.length}</strong> times at:</p>\n    ${rr(e.elements.map(Cr).join("\n"))}`
          : "",
        s = e.details ? `\n\n<details>\n${e.details}\n</details>\n` : "";
      return `${rr(`**${hn(e.message)}**`, { inline: !0 })}${n}${r}${s}${t}`;
    }
    function Cr(e) {
      return `* [\`<${e.localName}>\`](#${e.id}) element`;
    }
    async function Sr(e) {
      try {
        (xr.show(),
          await (async function () {
            "loading" === document.readyState &&
              (await new Promise(e =>
                document.addEventListener("DOMContentLoaded", e)
              ));
          })(),
          await Qn(e));
      } finally {
        xr.enable();
      }
    }
    (document.addEventListener("keydown", e => {
      "Escape" === e.key && xr.closeModal();
    }),
      (window.respecUI = xr),
      Bn("error", e => xr.error(e)),
      Bn("warn", e => xr.warning(e)),
      window.addEventListener("error", e => {
        console.error(e.error, e.message, e);
      }));
    const _r = [
      Promise.resolve().then(function () {
        return Tr;
      }),
      Promise.resolve().then(function () {
        return o;
      }),
      Promise.resolve().then(function () {
        return Rr;
      }),
      Promise.resolve().then(function () {
        return Pr;
      }),
      Promise.resolve().then(function () {
        return Mr;
      }),
      Promise.resolve().then(function () {
        return Hr;
      }),
      Promise.resolve().then(function () {
        return Jr;
      }),
      Promise.resolve().then(function () {
        return ts;
      }),
      Promise.resolve().then(function () {
        return ar;
      }),
      Promise.resolve().then(function () {
        return ns;
      }),
      Promise.resolve().then(function () {
        return rs;
      }),
      Promise.resolve().then(function () {
        return is;
      }),
      Promise.resolve().then(function () {
        return bi;
      }),
      Promise.resolve().then(function () {
        return Ti;
      }),
      Promise.resolve().then(function () {
        return Ei;
      }),
      Promise.resolve().then(function () {
        return Ni;
      }),
      Promise.resolve().then(function () {
        return Ii;
      }),
      Promise.resolve().then(function () {
        return Bi;
      }),
      Promise.resolve().then(function () {
        return Wi;
      }),
      Promise.resolve().then(function () {
        return eo;
      }),
      Promise.resolve().then(function () {
        return zs;
      }),
      Promise.resolve().then(function () {
        return wo;
      }),
      Promise.resolve().then(function () {
        return uo;
      }),
      Promise.resolve().then(function () {
        return Js;
      }),
      Promise.resolve().then(function () {
        return xo;
      }),
      Promise.resolve().then(function () {
        return Qr;
      }),
      Promise.resolve().then(function () {
        return $o;
      }),
      Promise.resolve().then(function () {
        return So;
      }),
      Promise.resolve().then(function () {
        return Oo;
      }),
      Promise.resolve().then(function () {
        return zo;
      }),
      Promise.resolve().then(function () {
        return Io;
      }),
      Promise.resolve().then(function () {
        return Do;
      }),
      Promise.resolve().then(function () {
        return Fo;
      }),
      Promise.resolve().then(function () {
        return Jo;
      }),
      Promise.resolve().then(function () {
        return Yo;
      }),
      Promise.resolve().then(function () {
        return ea;
      }),
      Promise.resolve().then(function () {
        return da;
      }),
      Promise.resolve().then(function () {
        return ya;
      }),
      Promise.resolve().then(function () {
        return $a;
      }),
      Promise.resolve().then(function () {
        return Sa;
      }),
      Promise.resolve().then(function () {
        return Oa;
      }),
      Promise.resolve().then(function () {
        return ja;
      }),
      Promise.resolve().then(function () {
        return Ia;
      }),
      Promise.resolve().then(function () {
        return qa;
      }),
      Promise.resolve().then(function () {
        return Wa;
      }),
      Promise.resolve().then(function () {
        return Za;
      }),
      Promise.resolve().then(function () {
        return ec;
      }),
      Promise.resolve().then(function () {
        return rc;
      }),
      Promise.resolve().then(function () {
        return oc;
      }),
      Promise.resolve().then(function () {
        return lc;
      }),
      Promise.resolve().then(function () {
        return hc;
      }),
    ];
    Promise.all(_r)
      .then(e => Sr(e))
      .catch(e => console.error(e));
    var Tr = Object.freeze({
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
    const Er = {
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
      Lr = new Map([
        [
          "cc0",
          {
            name: "Creative Commons 0 Public Domain Dedication",
            short: "CC0",
            url: "https://creativecommons.org/publicdomain/zero/1.0/",
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
          "cc-by-nd",
          {
            name: "Creative Commons Attribution-NoDerivatives 4.0 International Public License",
            short: "CC-BY-ND",
            url: "https://creativecommons.org/licenses/by-nd/4.0/legalcode.nl",
          },
        ],
      ]),
      Ar = {
        lint: { "privsec-section": !0 },
        doJsonLd: !0,
        license: "cc-by",
        specStatus: "GN-BASIS",
        logos: [
          {
            src: "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.svg",
            alt: "Geonovum",
            id: "Geonovum",
            height: 67,
            width: 132,
            url: "https://www.geonovum.nl/",
          },
        ],
      };
    var Rr = Object.freeze({
      __proto__: null,
      name: "geonovum/defaults",
      run: function (e) {
        const t = !1 !== e.lint && { ...Er.lint, ...Ar.lint, ...e.lint };
        (Object.assign(e, { ...Er, ...Ar, ...e, lint: t }),
          Object.assign(
            e,
            (function (e) {
              return {
                isCCBY: "cc-by" === e.license,
                licenseInfo: Lr.get(e.license),
                isBasic: "GN-BASIS" === e.specStatus,
                isRegular: "GN-BASIS" === e.specStatus,
              };
            })(e)
          ));
      },
    });
    var Nr = String.raw`@keyframes pop{
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
    const Or = (function () {
      const e = document.createElement("style");
      return (
        (e.id = "respec-mainstyle"),
        (e.textContent = Nr),
        document.head.appendChild(e),
        e
      );
    })();
    var Pr = Object.freeze({
      __proto__: null,
      name: "core/style",
      run: function (e) {
        e.noReSpecCSS && Or.remove();
      },
    });
    const zr = "geonovum/style";
    function jr(e) {
      const t = document.createElement("link");
      return (
        (t.rel = "stylesheet"),
        (t.href = `https://tools.geostandaarden.nl/respec/style/${e}.css`),
        t
      );
    }
    const Ir = (function () {
        const e = [
            { hint: "preconnect", href: "https://www.w3.org" },
            {
              hint: "preload",
              href: "https://www.w3.org/scripts/TR/2016/fixup.js",
              as: "script",
            },
            { hint: "preconnect", href: "https://tools.geostandaarden.nl/" },
            {
              hint: "preload",
              href: "https://tools.geostandaarden.nl/respec/style/base.css",
              as: "style",
            },
            {
              hint: "preload",
              href: "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.svg",
              as: "image",
            },
          ],
          t = document.createDocumentFragment();
        for (const n of e.map(on)) t.appendChild(n);
        return t;
      })(),
      Dr = document.createElement("link");
    ((Dr.rel = "shortcut icon"),
      (Dr.type = "image/x-icon"),
      (Dr.href =
        "https://tools.geostandaarden.nl/respec/style/logos/Geonovum.ico"),
      document.head.prepend(Dr),
      document.head.querySelector("meta[name=viewport]") ||
        Ir.prepend(
          (function () {
            const e = document.createElement("meta");
            return (
              (e.name = "viewport"),
              (e.content = (function (e, t = ", ", n = "=") {
                return Array.from(Object.entries(e))
                  .map(([e, t]) => `${e}${n}${JSON.stringify(t)}`)
                  .join(t);
              })({
                width: "device-width",
                "initial-scale": "1",
                "shrink-to-fit": "no",
              }).replace(/"/g, "")),
              e
            );
          })()
        ),
      document.head.prepend(Ir));
    var Mr = Object.freeze({
      __proto__: null,
      name: zr,
      run: function (e) {
        if (!e.specStatus) {
          const t =
            "`respecConfig.specStatus` missing. Defaulting to 'GN-BASIS'.";
          ((e.specStatus = "GN-BASIS"), On(t, zr));
        }
        document.body.querySelector("figure.scalable") &&
          (document.head.appendChild(jr("leaflet")),
          document.head.appendChild(jr("font-awesome")));
        let t = "";
        switch (e.specStatus.toUpperCase()) {
          case "GN-WV":
            t += "GN-WV.css";
            break;
          case "GN-CV":
            t += "GN-CV.css";
            break;
          case "GN-VV":
            t += "GN-VV.css";
            break;
          case "GN-DEF":
            t += "GN-DEF.css";
            break;
          case "GN-BASIS":
            t += "GN-BASIS.css";
            break;
          default:
            t = "base.css";
        }
        (e.noToc ||
          Bn(
            "end-all",
            () => {
              !(function (e, t) {
                const n = e.createElement("script");
                (n.addEventListener(
                  "load",
                  () => {
                    window.location.hash &&
                      (window.location.href = window.location.hash);
                  },
                  { once: !0 }
                ),
                  (n.src = `https://www.w3.org/scripts/TR/${t}/fixup.js`),
                  e.body.appendChild(n));
              })(document, "2016");
            },
            { once: !0 }
          ),
          (function (e, t) {
            const n = []
              .concat(t)
              .map(t => {
                const n = e.createElement("link");
                return ((n.rel = "stylesheet"), (n.href = t), n);
              })
              .reduce(
                (e, t) => (e.appendChild(t), e),
                e.createDocumentFragment()
              );
            e.head.appendChild(n);
          })(document, `https://tools.geostandaarden.nl/respec/style/${t}`));
      },
    });
    const qr = {
      en: {
        status_at_publication: Bt`This section describes the status of this
      document at the time of its publication. Other documents may supersede
      this document. A list of current Geonovum publications and the latest
      revision of this document can be found via
      <a href="https://www.geonovum.nl/geo-standaarden/alle-standaarden"
        >https://www.geonovum.nl/geo-standaarden/alle-standaarden</a
      >(in Dutch).`,
      },
      nl: {
        status_at_publication: Bt`Deze paragraaf beschrijft de status van dit
      document ten tijde van publicatie. Het is mogelijk dat er actuelere
      versies van dit document bestaan. Een lijst van Geonovum publicaties en de
      laatste gepubliceerde versie van dit document zijn te vinden op
      <a href="https://www.geonovum.nl/geo-standaarden/alle-standaarden"
        >https://www.geonovum.nl/geo-standaarden/alle-standaarden</a
      >.`,
      },
    };
    Object.keys(qr).forEach(e => {
      (s[e] || (s[e] = {}), Object.assign(s[e], qr[e]));
    });
    var Hr = Object.freeze({ __proto__: null, name: "geonovum/l10n" });
    const Br = "core/github";
    let Fr, Ur;
    const Wr = new Promise((e, t) => {
        ((Fr = e),
          (Ur = e => {
            (Nn(e, Br), t(new Error(e)));
          }));
      }),
      Gr = fn({
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
    var Jr = Object.freeze({
      __proto__: null,
      github: Wr,
      name: Br,
      run: async function (e) {
        if (!e.hasOwnProperty("github") || !e.github) return void Fr(null);
        if (
          "object" == typeof e.github &&
          !e.github.hasOwnProperty("repoURL")
        ) {
          const e = Dn`Config option ${"[github]"} is missing property \`repoURL\`.`;
          return void Ur(e);
        }
        const t = "string" == typeof e.github ? {} : e.github;
        let n,
          r = t.repoURL || String(e.github);
        r.endsWith("/") || (r += "/");
        try {
          n = new URL(r, "https://github.com");
        } catch {
          const e = Dn`${"[github]"} configuration option is not a valid URL? (${r}).`;
          return void Ur(e);
        }
        if ("https://github.com" !== n.origin) {
          const e = Dn`${"[github]"} configuration option must be HTTPS and pointing to GitHub. (${n.href}).`;
          return void Ur(e);
        }
        const [s, i] = n.pathname.split("/").filter(e => e);
        if (!s || !i) {
          const e = Dn`${"[github]"} URL needs a path. For example, "w3c/my-spec".`;
          return void Ur(e);
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
              const e = Dn`${"[github.pullsURL]"} must be HTTPS and pointing to GitHub. (${c}).`;
              return void Ur(e);
            }
            if (!e.pathname.includes("/pulls")) {
              const e = Dn`${"[github.pullsURL]"} must point to pull requests. (${c}).`;
              return void Ur(e);
            }
          } catch {
            const e = Dn`${"[github.pullsURL]"} is not a valid URL. (${c}).`;
            return void Ur(e);
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
              const e = Dn`${"[github.commitHistoryURL]"} must be HTTPS and pointing to GitHub. (${l}).`;
              return void Ur(e);
            }
            if (!e.pathname.includes("/commits")) {
              const e = Dn`${"[github.commitHistoryURL]"} must point to commits. (${l}).`;
              return void Ur(e);
            }
          } catch {
            const e = Dn`${"[github.commitHistoryURL]"} is not a valid URL. (${l}).`;
            return void Ur(e);
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
            On(
              "The `githubAPI` configuration option is private and should not be added manually.",
              Br
            );
          }
        if (!e.excludeGithubLinks) {
          const t = {
            key: Gr.participate,
            data: [
              { value: `GitHub ${s}/${i}`, href: n },
              { value: Gr.file_a_bug, href: u.issueBase },
              { value: Gr.commit_history, href: l },
              { value: "Pull requests", href: c },
            ],
          };
          (e.otherLinks || (e.otherLinks = []), e.otherLinks.unshift(t));
        }
        const h = {
          branch: o,
          repoURL: n.href,
          apiBase: d,
          fullName: `${s}/${i}`,
          issuesURL: a,
          pullsURL: c,
          newIssuesURL: new URL("./new/choose", a).href,
          commitHistoryURL: l,
        };
        Fr(h);
        const p = { ...u, ...e, github: h, githubAPI: d };
        Object.assign(e, p);
      },
    });
    class Vr {
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
        Vr.sectionClasses.intersection(new Set(e.classList)).forEach(e => {
          t.classList.add(e);
        });
      }
      addSection(e) {
        const t = this.findHeader(e),
          n = t ? this.findPosition(t) : 1,
          r = this.findParent(n);
        (t && e.removeChild(t),
          e.appendChild(Kr(e)),
          t && e.prepend(t),
          r.appendChild(e),
          (this.current = r));
      }
      addElement(e) {
        this.current.appendChild(e);
      }
    }
    function Kr(e) {
      const t = new Vr(e.ownerDocument);
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
    function Zr(e) {
      const t = Kr(e);
      if (
        "section" === t.firstElementChild.localName &&
        "section" === e.localName
      ) {
        const n = t.firstElementChild;
        (n.remove(), e.append(...n.childNodes));
      } else e.textContent = "";
      e.appendChild(t);
    }
    var Qr = Object.freeze({
      __proto__: null,
      name: "core/sections",
      restructure: Zr,
      run: function () {
        Zr(document.body);
      },
    });
    const Xr = "core/data-include";
    function Yr(e, t, n) {
      const r = document.querySelector(`[data-include-id=${t}]`);
      if (!r) return;
      const s = mn(e, r.dataset.oninclude, n),
        i = "string" == typeof r.dataset.includeReplace;
      (!(function (e, t, { replace: n }) {
        const { includeFormat: r } = e.dataset;
        let s = t;
        ("markdown" === r && (s = rr(s)),
          "text" === r ? (e.textContent = s) : (e.innerHTML = s),
          "markdown" === r && Zr(e),
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
    async function es(e, t) {
      const n = e.querySelectorAll("[data-include]"),
        r = Array.from(n).map(async e => {
          const n = e.dataset.include;
          if (!n) return;
          const r = `include-${String(Math.random()).slice(2)}`;
          e.dataset.includeId = r;
          try {
            const s = await fetch(n);
            (Yr(await s.text(), r, n), t < 3 && (await es(e, t + 1)));
          } catch (t) {
            const r = t;
            Nn(`\`data-include\` failed: \`${n}\` (${r.message}).`, Xr, {
              elements: [e],
              cause: r,
            });
          }
        });
      await Promise.all(r);
    }
    var ts = Object.freeze({
      __proto__: null,
      name: Xr,
      run: async function () {
        await es(document, 1);
      },
    });
    var ns = Object.freeze({
      __proto__: null,
      name: "core/reindent",
      run: function () {
        for (const e of document.getElementsByTagName("pre"))
          e.innerHTML = Mn(e.innerHTML);
      },
    });
    var rs = Object.freeze({
      __proto__: null,
      name: "core/data-transform",
      run: function () {
        document.querySelectorAll("[data-transform]").forEach(e => {
          ((e.innerHTML = mn(e.innerHTML, e.dataset.transform)),
            e.removeAttribute("data-transform"));
        });
      },
    });
    var ss = String.raw`:root{--assertion-border:#aaa;--assertion-bg:#eee;--assertion-text:black}
.assert{border-left:.5em solid #aaa;padding:.3em;border-color:#aaa;border-color:var(--assertion-border);background:#eee;background:var(--assertion-bg);color:#000;color:var(--assertion-text)}
@media (prefers-color-scheme:dark){
:root{--assertion-border:#444;--assertion-bg:var(--borderedblock-bg);--assertion-text:var(--text)}
}`;
    var is = Object.freeze({
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
            t.prepend(Bt`<a data-cite="INFRA#assert">Assert</a>`, ": "));
        }
        const t = document.createElement("style");
        ((t.textContent = ss), document.head.appendChild(t));
      },
    });
    const os = /^[a-z]+(\s+[a-z]+)+\??$/,
      as = /\B"([^"]*)"\B/,
      cs = /^(\w+)\(([^\\)]*)\)(?:\|(\w+)(?:\((?:([^\\)]*))\))?)?$/,
      ls = /\[\[(\w+(?: +\w+)*)\]\](\([^)]*\))?$/,
      us = /^((?:\[\[)?(?:\w+(?: +\w+)*)(?:\]\])?)$/,
      ds = /^(?:\w+)\??$/,
      hs = /^(\w+)\["([\w- ]*)"\]$/,
      ps = /\.?(\w+\(.*\)$)/,
      fs = /\/(.+)/,
      ms = /\[\[.+\]\]/;
    function gs(e) {
      const { identifier: t, renderParent: n, nullable: r } = e;
      if (n)
        return Bt`<a
      data-xref-type="_IDL_"
      data-link-type="idl"
      data-lt="${t}"
      ><code>${t + (r ? "?" : "")}</code></a
    >`;
    }
    function bs(e) {
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
        l = a ? Bt`(${gn(c, ys)})` : null,
        u = a ? `(${c.join(", ")})` : "";
      return Bt`${n && s ? "." : ""}<a
      data-xref-type="${r}"
      data-link-type="${r}"
      data-link-for="${o}"
      data-xref-for="${o}"
      data-lt="${`[[${t}]]${u}`}"
      ><code>[[${t}]]${l}</code></a
    >`;
    }
    function ys(e, t, n) {
      if (t < n.length - 1) return Bt`<var>${e}</var>`;
      const r = e.split(/(^\.{3})(.+)/),
        s = r.length > 1,
        i = s ? r[2] : r[0];
      return Bt`${s ? "..." : null}<var>${i}</var>`;
    }
    function ks(e) {
      const { parent: t, identifier: n, renderParent: r } = e,
        { identifier: s } = t || {};
      return Bt`${r ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="attribute|dict-member|const"
      data-link-for="${s}"
      data-xref-for="${s}"
      ><code>${n}</code></a
    >`;
    }
    function ws(e) {
      const { args: t, identifier: n, type: r, parent: s, renderParent: i } = e,
        { renderText: o, renderArgs: a } = e,
        { identifier: c } = s || {},
        l = gn(a || t, ys),
        u = `${n}(${t.join(", ")})`;
      return Bt`${s && i ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="${r}"
      data-link-for="${c}"
      data-xref-for="${c}"
      data-lt="${u}"
      ><code>${o || n}</code></a
    >${!o || a ? Bt`<code>(${l})</code>` : ""}`;
    }
    function vs(e) {
      const { identifier: t, enumValue: n, parent: r } = e,
        s = r ? r.identifier : t;
      return Bt`"<a
      data-link-type="idl"
      data-xref-type="enum-value"
      data-link-for="${s}"
      data-xref-for="${s}"
      data-lt="${n ? null : "the-empty-string"}"
      ><code>${n}</code></a
    >"`;
    }
    function xs(e) {
      const { identifier: t } = e;
      return Bt`"<a
      data-link-type="idl"
      data-cite="webidl"
      data-xref-type="exception"
      ><code>${t}</code></a
    >"`;
    }
    function $s(e) {
      const { identifier: t, nullable: n } = e;
      return Bt`<a
    data-link-type="idl"
    data-cite="webidl"
    data-xref-type="interface"
    data-lt="${t}"
    ><code>${t + (n ? "?" : "")}</code></a
  >`;
    }
    function Cs(e) {
      let t;
      try {
        t = (function (e) {
          const t = ms.test(e),
            n = t ? fs : ps,
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
            if (cs.test(t)) {
              const [, e, n, r, s] = t.match(cs),
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
            } else if (hs.test(t)) {
              const [, e, n] = t.match(hs);
              a.push({
                type: "enum",
                identifier: e ?? "",
                enumValue: n ?? "",
                renderParent: o,
              });
            } else if (as.test(t)) {
              const [, e] = t.match(as);
              o
                ? a.push({ type: "exception", identifier: e ?? "" })
                : a.push({ type: "enum", enumValue: e ?? "", renderParent: o });
            } else if (ls.test(t)) {
              const [, e, n] = t.match(ls),
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
            } else if (us.test(t) && i.length) {
              const [, e] = t.match(us);
              a.push({
                type: "attribute",
                identifier: e ?? "",
                renderParent: o,
              });
            } else if (os.test(t)) {
              const e = t.endsWith("?"),
                n = e ? t.slice(0, -1) : t;
              a.push({
                type: "idl-primitive",
                identifier: n,
                renderParent: o,
                nullable: e,
              });
            } else {
              if (!ds.test(t) || 0 !== i.length)
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
        const n = Bt`<span>{{ ${e} }}</span>`,
          r = "Error: Invalid inline IDL string.";
        return (Nn(t.message, "core/inlines", { title: r, elements: [n] }), n);
      }
      const n = Bt(document.createDocumentFragment()),
        r = [];
      for (const e of t)
        switch (e.type) {
          case "base": {
            const t = gs(e);
            t && r.push(t);
            break;
          }
          case "attribute":
            r.push(ks(e));
            break;
          case "internal-slot":
            r.push(bs(e));
            break;
          case "method":
            r.push(ws(e));
            break;
          case "enum":
            r.push(vs(e));
            break;
          case "exception":
            r.push(xs(e));
            break;
          case "idl-primitive":
            r.push($s(e));
            break;
          default:
            throw new Error("Unknown type.");
        }
      return n`${r}`;
    }
    const Ss = new Set(["alias", "reference"]),
      _s = (async function () {
        const e = await Ft.openDB("respec-biblio2", 12, {
            upgrade(e) {
              Array.from(e.objectStoreNames).map(t => e.deleteObjectStore(t));
              (e
                .createObjectStore("alias", { keyPath: "id" })
                .createIndex("aliasOf", "aliasOf", { unique: !1 }),
                e.createObjectStore("reference", { keyPath: "id" }));
            },
          }),
          t = Date.now();
        for (const n of [...Ss]) {
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
    const Ts = {
        get ready() {
          return _s;
        },
        async find(e) {
          return (
            (await this.isAlias(e)) && (e = (await this.resolveAlias(e)) ?? e),
            await this.get("reference", e)
          );
        },
        async has(e, t) {
          if (!Ss.has(e)) throw new TypeError(`Invalid type: ${e}`);
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
          if (!Ss.has(e)) throw new TypeError(`Invalid type: ${e}`);
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
          const r = [...Ss].flatMap(e => n[e].map(t => this.add(e, t)));
          await Promise.all(r);
        },
        async add(e, t) {
          if (!Ss.has(e)) throw new TypeError(`Invalid type: ${e}`);
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
            t = [...Ss],
            n = e.transaction(t, "readwrite"),
            r = t.map(e => n.objectStore(e).clear());
          await Promise.all(r);
        },
      },
      Es = {},
      Ls = new URL("https://api.specref.org/bibrefs?refs="),
      As = on({ hint: "dns-prefetch", href: Ls.origin });
    let Rs;
    document.head.appendChild(As);
    const Ns = new Promise(e => {
      Rs = e;
    });
    async function Os(e, t = { forceUpdate: !1 }) {
      const n = [...new Set(e)].filter(e => e.trim());
      if (!n.length || !1 === navigator.onLine) return null;
      let r;
      try {
        r = await fetch(Ls.href + n.join(","));
      } catch (e) {
        return (console.error(e), null);
      }
      if ((!t.forceUpdate && !r.ok) || 200 !== r.status) return null;
      const s = await r.json(),
        i = Date.now() + 36e5;
      try {
        const e = Date.parse(r.headers.get("Expires") || ""),
          t = Number.isNaN(e) ? i : Math.min(e, i);
        await Ts.addAll(s, t);
      } catch (e) {
        console.error(e);
      }
      return s;
    }
    async function Ps(e) {
      const t = await Ns;
      if (!t.hasOwnProperty(e)) return null;
      const n = t[e];
      return n.aliasOf ? await Ps(n.aliasOf) : n;
    }
    var zs = Object.freeze({
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
            (this.conf.biblio = Es));
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
                    await Ts.ready;
                    const n = e.map(async e => ({
                      id: e,
                      data: await Ts.find(e),
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
              e.data && (Es[e.id] = e.data);
            }));
          const i = s.noData.map(e => e.id);
          if (i.length) {
            const e = await Os(i, { forceUpdate: !0 });
            Object.assign(Es, e);
          }
          (Object.assign(Es, this.conf.localBiblio),
            (() => {
              Rs(this.conf.biblio);
            })());
        }
      },
      biblio: Es,
      name: "core/biblio",
      resolveRef: Ps,
      updateFromNetwork: Os,
    });
    const js = "core/render-biblio";
    function Is(e) {
      return `bib-${yn(e)}`;
    }
    const Ds = fn({
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
      Ms = new Map([
        ["CR", "W3C Candidate Recommendation"],
        ["ED", "W3C Editor's Draft"],
        ["LCWD", "W3C Last Call Working Draft"],
        ["NOTE", "W3C Working Group Note"],
        ["PR", "W3C Proposed Recommendation"],
        ["REC", "W3C Recommendation"],
        ["WD", "W3C Working Draft"],
      ]),
      qs =
        ((Hs = "."),
        e => {
          const t = e.trim();
          return !t || t.endsWith(Hs) ? t : t + Hs;
        });
    var Hs;
    function Bs(e, t) {
      const { goodRefs: n, badRefs: r } = (function (e) {
          const t = [],
            n = [];
          for (const r of e) r.refcontent ? t.push(r) : n.push(r);
          return { goodRefs: t, badRefs: n };
        })(e.map(Fs)),
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
        o = Bt`<section>
    <h3>${t}</h3>
    <dl class="bibliography">${i.map(Ws)}</dl>
  </section>`;
      kn(o, "", t);
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
            const r = `#${Is(e)}`,
              s = (t.get(n.id ?? "") ?? [])
                .map(e => `a.bibref[href="#${Is(e)}"]`)
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
              ...document.querySelectorAll(`a.bibref[href="#${Is(t)}"]`),
            ].filter(
              ({ textContent: e }) => e.toLowerCase() === t.toLowerCase()
            );
            Nn(`Reference "[${t}]" not found.`, js, {
              hint: `Search for ["${t}"](https://www.specref.org?q=${t}) on Specref to see if it exists or if it's misspelled.`,
              elements: e,
            });
          }
        })(r),
        o
      );
    }
    function Fs(e) {
      let t = Es[e],
        n = e;
      const r = new Set([n]);
      for (; t && t.aliasOf; )
        if (r.has(t.aliasOf)) {
          t = null;
          Nn(
            `Circular reference in biblio DB between [\`${e}\`] and [\`${n}\`].`,
            js
          );
        } else ((n = t.aliasOf), (t = Es[n]), r.add(n));
      return (
        t && !t.id && (t.id = e.toLowerCase()),
        { ref: e, refcontent: t }
      );
    }
    function Us(e, t) {
      const n = e.replace(/^(!|\?)/, ""),
        r = `#${Is(n)}`,
        s = Bt`<cite
    ><a class="bibref" href="${r}" data-link-type="biblio">${t || n}</a></cite
  >`;
      return t ? s : Bt`[${s}]`;
    }
    function Ws(e) {
      const { ref: t, refcontent: n } = e,
        r = Is(t);
      return Bt`
    <dt id="${r}">[${t}]</dt>
    <dd>
      ${
        n
          ? { html: Gs(n) }
          : Bt`<em class="respec-offending-element"
            >${Ds.reference_not_found}</em
          >`
      }
    </dd>
  `;
    }
    function Gs(e) {
      if ("string" == typeof e) return e;
      let t = `<cite>${e.title}</cite>`;
      if (
        ((t = e.href ? `<a href="${e.href}">${t}</a>. ` : `${t}. `), e.authors)
      ) {
        if (!Array.isArray(e.authors)) {
          const t = `The "authors" field in reference "${e.id || e.title}" must be an array.`,
            n = `Use \`authors: [${JSON.stringify(e.authors)}]\` instead of \`authors: ${JSON.stringify(e.authors)}\`.`;
          (Nn(t, js, { hint: n }), (e.authors = [e.authors]));
        }
        e.authors.length &&
          ((t += e.authors.join("; ")),
          e.etAl && (t += " et al"),
          t.endsWith(".") || (t += ". "));
      }
      return (
        e.publisher && (t = `${t} ${qs(e.publisher)} `),
        e.date && (t += `${e.date}. `),
        e.status && (t += `${Ms.get(e.status) || e.status}. `),
        e.href && (t += `URL: <a href="${e.href}">${e.href}</a>`),
        t
      );
    }
    var Js = Object.freeze({
      __proto__: null,
      name: js,
      renderInlineCitation: Us,
      run: function (e) {
        const t = Array.from(e.informativeReferences),
          n = Array.from(e.normativeReferences);
        if (!t.length && !n.length) return;
        const r =
          document.querySelector("section#references") ||
          Bt`<section id="references"></section>`;
        if (
          (document.querySelector("section#references > :is(h2, h1)") ||
            r.prepend(Bt`<h1>${Ds.references}</h1>`),
          r.classList.add("appendix"),
          n.length)
        ) {
          const e = Bs(n, Ds.norm_references);
          r.appendChild(e);
        }
        if (t.length) {
          const e = Bs(t, Ds.info_references);
          r.appendChild(e);
        }
        document.body.appendChild(r);
      },
    });
    const Vs = "core/inlines",
      Ks = {},
      Zs = e => new RegExp(e.map(e => e.source).join("|")),
      Qs = fn({
        en: {
          rfc2119Keywords: () =>
            Zs([
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
            Zs([
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
      Xs = /(?:`[^`]+`)(?!`)/,
      Ys = /(?:{{[^}]+\?*}})/,
      ei = /\B\|\w[\w\s]*(?:\s*:[\w\s&;"?<>]+\??)?\|\B/,
      ti = /(?:\[\[(?:!|\\|\?)?[\w.-]+(?:|[^\]]+)?\]\])/,
      ni = /(?:\[\[\[(?:!|\\|\?)?#?[\w-.]+\]\]\])/,
      ri = /(?:\[=[^=]+=\])/,
      si = /(?:\[\^[^^]+\^\])/,
      ii = /(?:\{\^[^}^]+\^\})/;
    function oi(e) {
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
      return Bt`<code
    ><a
      data-xref-type="${i}"
      data-xref-for="${o}"
      data-link-type="${i}"
      data-link-for="${o}"
      >${a}</a
    ></code
  >`;
    }
    function ai(e) {
      const t = (
        e
          .slice(2, -2)
          .trim()
          .match(/"([^"]*)"|([^/]+)/g) || []
      ).map(e => e.trim());
      if (1 === t.length) {
        const e = t[0];
        return Bt`<code
      ><a data-link-type="cddl-type" data-xref-type="cddl-type"
        >${e}</a
      ></code
    >`;
      }
      const n = t[0],
        r = t[1],
        s = r.startsWith('"') && r.endsWith('"') ? "cddl-value" : "cddl-key";
      return Bt`<code
    ><a
      data-link-type="${s}"
      data-xref-type="${s}"
      data-xref-for="${n}"
      data-link-for="${n}"
      >${r}</a
    ></code
  >`;
    }
    function ci(e) {
      const t = pn(e),
        n = Bt`<em class="rfc2119">${t}</em>`;
      return ((Ks[t] = !0), n);
    }
    function li(e) {
      const t = e.slice(3, -3).trim();
      return t.startsWith("#")
        ? Bt`<a href="${t}" data-matched-text="${e}"></a>`
        : Bt`<a data-cite="${t}" data-matched-text="${e}"></a>`;
    }
    function ui(e, t) {
      const n = pn(e.slice(2, -2));
      if (n.startsWith("\\")) return e.replace(/^(\{\{\s*)\\/, "$1");
      const r = Cs(n);
      return !!t.parentElement?.closest("dfn,a")
        ? mi(`\`${r.textContent}\``)
        : r;
    }
    function di(e, t, n) {
      const r = e.slice(2, -2);
      if (r.startsWith("\\")) return [`[[${r.slice(1)}]]`];
      const [s, i] = r.split("|").map(pn),
        { type: o, illegal: a } = xn(s, t.parentElement),
        c = Us(s, i),
        l = s.replace(/^(!|\?)/, "");
      if (a && !n.normativeReferences.has(l)) {
        const e = c.childNodes[1] || c;
        On(
          "Normative references in informative sections are not allowed. ",
          Vs,
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
    function hi(e, t, n) {
      return "ABBR" === t.parentElement?.tagName
        ? e
        : Bt`<abbr title="${n.get(e)}">${e}</abbr>`;
    }
    function pi(e) {
      const t = e.slice(1, -1).split(":", 2),
        [n, r] = t.map(e => e.trim());
      return Bt`<var data-type="${r}">${n}</var>`;
    }
    function fi(e) {
      const t = (function (e) {
          const t = e => e.replace("%%", "/").split("/").map(pn).join("/"),
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
        o = gi(i),
        a = n ? pn(n) : null;
      return Bt`<a
    data-link-type="dfn|abstract-op"
    data-link-for="${a}"
    data-xref-for="${a}"
    data-lt="${s}"
    >${o}</a
  >`;
    }
    function mi(e) {
      const t = e.slice(1, -1);
      return Bt`<code>${t}</code>`;
    }
    function gi(e) {
      return Xs.test(e)
        ? e
            .split(/(`[^`]+`)(?!`)/)
            .map(e => (e.startsWith("`") ? mi(e) : gi(e)))
        : document.createTextNode(e);
    }
    var bi = Object.freeze({
      __proto__: null,
      name: Vs,
      rfc2119Usage: Ks,
      run: function (e) {
        const t = new Map();
        (document.normalize(),
          document.querySelector("section#conformance") ||
            document.body.classList.add("informative"),
          (e.normativeReferences = new _n()),
          (e.informativeReferences = new _n()),
          e.respecRFC2119 || (e.respecRFC2119 = Ks));
        const n = document.querySelectorAll("abbr[title]:not(.exclude)");
        for (const { textContent: e, title: r } of n) {
          const n = pn(e),
            s = pn(r);
          t.set(n, s);
        }
        const r = t.size
            ? new RegExp(
                `(?:\\b${[...t.keys()].map(e => nn(e)).join("\\b)|(?:\\b")}\\b)`
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
          i = Qs.rfc2119Keywords(),
          o = new RegExp(
            `(${Zs([i, Ys, ii, ei, ti, ni, ri, Xs, si, ...(r ? [r] : [])]).source})`
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
                  s.append(ui(o, n));
                  break;
                case o.startsWith("{^"):
                  s.append(ai(o));
                  break;
                case o.startsWith("[[["):
                  s.append(li(o));
                  break;
                case o.startsWith("[["):
                  s.append(...di(o, n, e));
                  break;
                case o.startsWith("|"):
                  s.append(pi(o));
                  break;
                case o.startsWith("[="):
                  s.append(fi(o));
                  break;
                case o.startsWith("`"):
                  s.append(mi(o));
                  break;
                case o.startsWith("[^"):
                  s.append(oi(o));
                  break;
                case t.has(o):
                  s.append(hi(o, n, t));
                  break;
                case i.test(o):
                  s.append(ci(o));
              }
            else s.append(o);
          n.replaceWith(s);
        }
      },
    });
    function yi(e, t, n, r) {
      try {
        switch (t) {
          case "element-attr":
            return (document.createAttribute(e), !0);
          case "element":
            return (document.createElement(e), !0);
        }
      } catch (s) {
        Nn(`Invalid ${t} name "${e}": ${s.message}`, r, {
          hint: `Check that the ${t} name is allowed per the XML's Name production for ${t}.`,
          elements: [n],
        });
      }
      return !1;
    }
    function ki(e, t, n, r) {
      if (/^[a-z]+(-[a-z]+)*$/i.test(e)) return !0;
      return (
        Nn(`Invalid ${t} name "${e}".`, r, {
          hint: `Check that the ${t} name is allowed per the naming rules for this type.`,
          elements: [n],
        }),
        !1
      );
    }
    const wi = new An();
    function vi(e, t) {
      for (const n of t) (wi.has(n) || wi.set(n, new Set()), wi.get(n)?.add(e));
    }
    const xi = "core/dfn",
      $i = new Map([
        ["abstract-op", { requiresFor: !1 }],
        [
          "attr-value",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: ki,
          },
        ],
        ["element", { requiresFor: !1, validator: yi }],
        ["element-attr", { requiresFor: !1, validator: yi }],
        [
          "element-state",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: ki,
          },
        ],
        ["event", { requiresFor: !1, validator: ki }],
        ["http-header", { requiresFor: !1 }],
        [
          "media-type",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              try {
                const t = new Wt(e);
                if (t.toString() !== e)
                  throw new Error(
                    `Input doesn't match its canonical form: "${t}".`
                  );
              } catch (s) {
                return (
                  Nn(`Invalid ${t} "${e}": ${s.message}.`, r, {
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
        ["scheme", { requiresFor: !1, validator: ki }],
        [
          "permission",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              return e.startsWith('"') && e.endsWith('"')
                ? ki(e.slice(1, -1), t, n, r)
                : (Nn(`Invalid ${t} "${e}".`, r, {
                    hint: `Check that the ${t} is quoted with double quotes.`,
                    elements: [n],
                  }),
                  !1);
            },
          },
        ],
      ]),
      Ci = [...$i.keys()];
    function Si(e, t) {
      let n = "";
      switch (!0) {
        case Ci.some(t => e.classList.contains(t)):
          ((n = [...e.classList].find(e => $i.has(e)) ?? ""),
            (function (e, t, n) {
              const r = $i.get(t);
              if (r?.requiresFor && !n.dataset.dfnFor) {
                const e = Dn`Definition of type "\`${t}\`" requires a ${"[data-dfn-for]"} attribute.`,
                  { associateWith: s } = r,
                  i = Dn`Use a ${"[data-dfn-for]"} attribute to associate this with ${s ?? ""}.`;
                Nn(e, xi, { hint: i, elements: [n] });
              }
              r?.validator && r.validator(e, t, n, xi);
            })(t, n, e));
          break;
        case ls.test(t):
          n = (function (e, t) {
            t.dataset.hasOwnProperty("idl") || (t.dataset.idl = "");
            const n = t.closest("[data-dfn-for]");
            t !== n &&
              n?.dataset.dfnFor &&
              (t.dataset.dfnFor = n.dataset.dfnFor);
            if (!t.dataset.dfnFor) {
              const n = Dn`Use a ${"[data-dfn-for]"} attribute to associate this dfn with a WebIDL interface.`;
              Nn(
                `Internal slot "${e}" must be associated with a WebIDL interface.`,
                xi,
                { hint: n, elements: [t] }
              );
            }
            t.matches(".export, [data-export]") || (t.dataset.noexport = "");
            const r = e.endsWith(")") ? "method" : "attribute";
            if (!t.dataset.dfnType) return r;
            const s = ["attribute", "method"],
              { dfnType: i } = t.dataset;
            if (!s.includes(i) || r !== i) {
              const n = Dn`Invalid ${"[data-dfn-type]"} attribute on internal slot.`,
                i = `The only allowed types are: ${jn(s, { quotes: !0 })}. The slot "${e}" seems to be a "${zn(r)}"?`;
              return (Nn(n, xi, { hint: i, elements: [t] }), "dfn");
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
    function _i(e) {
      switch (!0) {
        case e.matches(".export.no-export"):
          Nn(
            Dn`Declares both "${"[no-export]"}" and "${"[export]"}" CSS class.`,
            xi,
            { elements: [e], hint: "Please use only one." }
          );
          break;
        case e.matches(".no-export, [data-noexport]"):
          if (e.matches("[data-export]")) {
            (Nn(
              Dn`Declares ${"[no-export]"} CSS class, but also has a "${"[data-export]"}" attribute.`,
              xi,
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
    var Ti = Object.freeze({
      __proto__: null,
      name: xi,
      run: function () {
        for (const e of document.querySelectorAll("dfn")) {
          const t = wn(e);
          if ((vi(e, t), e.dataset.cite && /\b#\b/.test(e.dataset.cite)))
            continue;
          const [n] = t;
          (Si(e, n), _i(e));
          const r = (e.dataset.localLt || "").split("|").map(pn),
            s = t.filter(e => !r.includes(e));
          (s.length > 1 || n !== pn(e.textContent)) &&
            (e.dataset.lt = s.join("|"));
        }
      },
    });
    var Ei = Object.freeze({
      __proto__: null,
      name: "core/pluralize",
      run: function (e) {
        if (!e.pluralize) return;
        const t = (function () {
          const e = new Set();
          document.querySelectorAll("a:not([href])").forEach(t => {
            const n = pn(t.textContent).toLowerCase();
            (e.add(n), t.dataset.lt && e.add(t.dataset.lt));
          });
          const t = new Set(),
            n = document.querySelectorAll("dfn:not([data-lt-noDefault])");
          return (
            n.forEach(e => {
              const n = pn(e.textContent).toLowerCase();
              (t.add(n),
                e.dataset.lt && e.dataset.lt.split("|").forEach(e => t.add(e)),
                e.dataset.localLt &&
                  e.dataset.localLt.split("|").forEach(e => t.add(e)));
            }),
            function (n) {
              const r = pn(n).toLowerCase(),
                s = Gt.isSingular(r) ? Gt.plural(r) : Gt.singular(r);
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
              ((e.dataset.plurals = n.join("|")), vi(e, n));
            }
          });
      },
    });
    var Li = String.raw`span.example-title{text-transform:none}
:is(aside,div).example,div.illegal-example{padding:.5em;margin:1em 0;position:relative;clear:both}
div.illegal-example{color:red}
div.illegal-example p{color:#000}
aside.example div.example{border-left-width:.1em;border-color:#999;background:#fff}`;
    const Ai = fn({
      en: { example: "Example" },
      nl: { example: "Voorbeeld" },
      es: { example: "Ejemplo" },
      ko: { example: "예시" },
      ja: { example: "例" },
      de: { example: "Beispiel" },
      zh: { example: "例" },
      cs: { example: "Příklad" },
    });
    function Ri(e, t, n) {
      ((n.title = e.title), n.title && e.removeAttribute("title"));
      const r = t > 0 ? ` ${t}` : "",
        s = n.title ? Bt`<span class="example-title">: ${n.title}</span>` : "";
      return Bt`<div class="marker">
    <a class="self-link">${Ai.example}<bdi>${r}</bdi></a
    >${s}
  </div>`;
    }
    var Ni = Object.freeze({
      __proto__: null,
      name: "core/examples",
      run: function () {
        const e = document.querySelectorAll(
          "pre.example, pre.illegal-example, aside.example"
        );
        if (!e.length) return;
        document.head.insertBefore(
          Bt`<style>
      ${Li}
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
            const s = Ri(e, t, n);
            e.prepend(s);
            const i = kn(e, "example", r || String(t));
            s.querySelector("a.self-link").href = `#${i}`;
          } else {
            const s = !!e.closest("aside");
            (s || ++t,
              (n.content = e.innerHTML),
              e.classList.remove("example", "illegal-example"));
            const i = e.id ? e.id : null;
            i && e.removeAttribute("id");
            const o = Ri(e, s ? 0 : t, n),
              a = Bt`<div class="example" id="${i}">
        ${o} ${e.cloneNode(!0)}
      </div>`;
            kn(a, "example", r || String(t));
            ((a.querySelector("a.self-link").href = `#${a.id}`),
              e.replaceWith(a));
          }
        });
      },
    });
    var Oi = String.raw`.issue-label{text-transform:initial}
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
    const Pi = "core/issues-notes",
      zi = fn({
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
    function ji(e, t, n) {
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
                  ? zi.feature_at_risk
                  : zi.issue
                : n
                  ? zi.warning
                  : r
                    ? zi.editors_note
                    : zi.note;
            return { type: i, displayType: o, isFeatureAtRisk: s };
          })(e),
          c = "issue" === i,
          l = "span" === e.localName,
          { number: u } = e.dataset,
          d = { title: e.title, number: r(e) };
        if (!l) {
          const r = Bt`<div class="${a ? `${i} atrisk` : i}" role="${"note" === i ? "note" : null}"></div>`,
            l = document.createElement("span"),
            h = Bt`<div role="heading" class="${`${i}-title marker`}">${l}</div>`;
          kn(h, "h", i);
          let p,
            f = o;
          if (
            (e.id
              ? ((r.id = e.id), e.removeAttribute("id"))
              : kn(r, "issue-container", d.number ? `number-${d.number}` : ""),
            c)
          ) {
            if (
              (void 0 !== d.number && (f += ` ${d.number}`),
              e.dataset.hasOwnProperty("number"))
            ) {
              const e = (function (e, t, { isFeatureAtRisk: n = !1 } = {}) {
                if (!n && t.issueBase)
                  return Bt`<a href="${t.issueBase + e}" />`;
                if (n && t.atRiskBase)
                  return Bt`<a href="${t.atRiskBase + e}" />`;
              })(u ?? "", n, { isFeatureAtRisk: a });
              if (
                (e && (l.before(e), e.append(l)),
                l.classList.add("issue-number"),
                (p = t.get(u ?? "")),
                !p)
              ) {
                On(`Failed to fetch issue number ${u}.`, Pi);
              }
              p && !d.title && (d.title = p.title);
            }
            s.append(
              (function (e, t, n) {
                const r = `${e}${t.number ? ` ${t.number}` : ""}`,
                  s = t.title
                    ? Bt`<span style="text-transform: none">: ${t.title}</span>`
                    : "";
                return Bt`<li><a href="${`#${n}`}">${r}</a>${s}</li>`;
              })(zi.issue, d, r.id)
            );
          }
          if (((l.textContent = f), d.title)) {
            e.removeAttribute("title");
            const { repoURL: t = "" } = n.github || {},
              s = p ? p.labels : [];
            (p && "CLOSED" === p.state && r.classList.add("closed"),
              h.append(
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
                      return Bt` <a
    class="respec-gh-label"
    style="${o}"
    href="${s.href}"
    aria-label="${a}"
    >${r}</a
  >`;
                    })(e, n)
                  );
                  r.length && r.unshift(document.createTextNode(" "));
                  return Bt`<span class="issue-label">: ${t}${r}</span>`;
                })(s, d.title, t)
              ));
          }
          let m = e;
          (e.replaceWith(r),
            m.classList.remove(i),
            m.removeAttribute("data-number"),
            p &&
              !m.innerHTML.trim() &&
              (m = document.createRange().createContextualFragment(p.bodyHTML)),
            r.append(h, m));
          const g = Cn(h, "section").length + 2;
          h.setAttribute("aria-level", g);
        }
      }),
        (function (e) {
          const t = document.getElementById("issue-summary");
          if (!t) return;
          const n = t.querySelector("h2, h3, h4, h5, h6");
          (e.hasChildNodes()
            ? t.append(e)
            : t.append(Bt`<p>${zi.no_issues_in_spec}</p>`),
            (!n || (n && n !== t.firstElementChild)) &&
              t.insertAdjacentHTML(
                "afterbegin",
                `<h1>${zi.issue_summary}</h1>`
              ));
        })(s));
    }
    var Ii = Object.freeze({
      __proto__: null,
      name: Pi,
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
                Nn(
                  `Error fetching issues from GitHub. (HTTP Status ${r.status}).`,
                  Pi
                ),
                new Map()
              );
            const s = await r.json();
            return new Map(Object.entries(s));
          })(e.github ?? null),
          { head: s } = document;
        (s.insertBefore(
          Bt`<style>
      ${Oi}
    </style>`,
          s.querySelector("link")
        ),
          ji(n, r, e),
          document.querySelectorAll(".ednote").forEach(e => {
            (e.classList.remove("ednote"), e.classList.add("note"));
          }));
      },
    });
    const Di = "core/best-practices",
      Mi = {
        en: { best_practice: "Best Practice " },
        ja: { best_practice: "最良実施例 " },
        de: { best_practice: "Musterbeispiel " },
        zh: { best_practice: "最佳实践 " },
      },
      qi = fn(Mi),
      Hi = i in Mi ? i : "en";
    var Bi = Object.freeze({
      __proto__: null,
      name: Di,
      run: function () {
        const e = document.querySelectorAll(".practicelab"),
          t = document.getElementById("bp-summary"),
          n = t ? document.createElement("ul") : null;
        if (
          ([...e].forEach((e, t) => {
            const r = kn(e, "bp"),
              s = Bt`<a class="marker self-link" href="${`#${r}`}"
      ><bdi lang="${Hi}">${qi.best_practice}${t + 1}</bdi></a
    >`;
            if (n) {
              const t = Bt`<li>${s}: ${Tn(e)}</li>`;
              n.appendChild(t);
            }
            const i = e.closest("div");
            if (!i) return void e.classList.add("advisement");
            i.classList.add("advisement");
            const o = Bt`${s.cloneNode(!0)}: ${e}`;
            i.prepend(...o.childNodes);
          }),
          e.length)
        )
          t &&
            (t.appendChild(Bt`<h1>Best Practices Summary</h1>`),
            n && t.appendChild(n));
        else if (t) {
          (On(
            "Using best practices summary (#bp-summary) but no best practices found.",
            Di
          ),
            t.remove());
        }
      },
    });
    const Fi = "core/figures",
      Ui = fn({
        en: { list_of_figures: "List of Figures", fig: "Figure " },
        ja: { fig: "図 ", list_of_figures: "図のリスト" },
        ko: { fig: "그림 ", list_of_figures: "그림 목록" },
        nl: { fig: "Figuur ", list_of_figures: "Lijst met figuren" },
        es: { fig: "Figura ", list_of_figures: "Lista de Figuras" },
        zh: { fig: "图 ", list_of_figures: "规范中包含的图" },
        de: { fig: "Abbildung", list_of_figures: "Abbildungsverzeichnis" },
      });
    var Wi = Object.freeze({
      __proto__: null,
      name: Fi,
      run: function () {
        const e = (function () {
            const e = [];
            return (
              document.querySelectorAll("figure").forEach((t, n) => {
                const r = t.querySelector("figcaption");
                if (r)
                  (!(function (e, t, n) {
                    const r = t.textContent;
                    (kn(e, "fig", r),
                      $n(t, Bt`<span class="fig-title"></span>`),
                      t.prepend(
                        Bt`<a class="self-link" href="#${e.id}"
      >${Ui.fig}<bdi class="figno">${n + 1}</bdi></a
    >`,
                        " "
                      ));
                  })(t, r, n),
                    e.push(
                      (function (e, t) {
                        const n = t.cloneNode(!0);
                        return (
                          n.querySelectorAll("a").forEach(e => {
                            vn(e, "span").removeAttribute("href");
                          }),
                          Bt`<li class="tofline">
    <a class="tocxref" href="${`#${e}`}">${n.childNodes}</a>
  </li>`
                        );
                      })(t.id, r)
                    ));
                else {
                  On("Found a `<figure>` without a `<figcaption>`.", Fi, {
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
            const t = (function (e) {
              const t = [];
              for (const n of (function* (e) {
                let t = e;
                for (; t.previousElementSibling; )
                  ((t = t.previousElementSibling), yield t);
              })(e))
                "section" === n.localName && t.push(n);
              return t;
            })(e);
            t.every(e => e.classList.contains("introductory"))
              ? e.classList.add("introductory")
              : t.some(e => e.classList.contains("appendix")) &&
                e.classList.add("appendix");
          })(t),
          t.append(
            Bt`<h1>${Ui.list_of_figures}</h1>`,
            Bt`<ul class="tof">
        ${e}
      </ul>`
          ));
      },
    });
    const Gi =
      '<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';
    var Ji = String.raw`:root{--cddl-comment:#6a737d;--cddl-kw:#005a9c;--cddl-str:#032f62;--cddl-num:#005cc5;--cddl-op:#6f42c1;--cddl-ctrl:#d73a49;--cddl-occ:#e36209;--cddl-bytes:#22863a;--cddl-param:#e36209;--cddl-type-dfn:#c43a31;--cddl-key-dfn:#005a9c;--cddl-header-bg:var(--def-border, #8ccbf2);--cddl-header-color:#005a9c;--cddl-focus:#51a7e8}
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
    const Vi = "core/cddl",
      Ki = new Set([
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
    function Zi(e) {
      return e
        .toLowerCase()
        .replace(/^"(.*)"$/, "$1")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    function Qi(e) {
      let t = e.parentNode;
      for (; t; ) {
        if (t instanceof Kt) return t.name?.name || null;
        t = t.parentNode;
      }
      return null;
    }
    class Xi extends Vt {
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
              if (t instanceof Qt) return !0;
              if (t instanceof Kt) return !1;
              t = t.parentNode;
            }
            return !1;
          })(t)
        ) {
          const r = Qi(t);
          return (
            r &&
              (n.genericParams.has(r) || n.genericParams.set(r, new Set()),
              n.genericParams.get(r)?.add(e)),
            `<span class="cddl-param">${hn(e)}</span>`
          );
        }
        if (
          (function (e) {
            let t = e.parentNode;
            for (; t; ) {
              if (t instanceof Xt) return !0;
              if (t instanceof Kt) return !1;
              t = t.parentNode;
            }
            return !1;
          })(t)
        )
          return this.#n(e);
        if (
          (function (e) {
            return e.parentNode instanceof Kt;
          })(t)
        )
          return ((this.#e = e), this.#r(e));
        if (
          (function (e) {
            return e.parentNode instanceof Zt;
          })(t)
        )
          return this.#s(e);
        const r = Qi(t) || this.#e;
        return r && n.genericParams.has(r) && n.genericParams.get(r)?.has(e)
          ? `<span class="cddl-param">${hn(e)}</span>`
          : this.#n(e);
      }
      #r(e) {
        const t = this.#t,
          n = `cddl-type-${Zi(e)}`,
          r = `cddl-type:${e}`;
        return t.definitions.has(r)
          ? `<a href="#${n}" class="cddl-name" data-link-type="cddl-type">${hn(e)}</a>`
          : t.proseDfns.has(n)
            ? (t.definitions.set(r, { type: "cddl-type", for: null, id: n }),
              `<a href="#${n}" class="cddl-name" data-link-type="cddl-type">${hn(e)}</a>`)
            : (t.definitions.set(r, { type: "cddl-type", for: null, id: n }),
              `<dfn data-dfn-type="cddl-type" id="${n}" data-export>${hn(e)}</dfn>`);
      }
      #s(e) {
        const t = this.#t,
          n = this.#e;
        if (!n) return `<span class="cddl-name">${hn(e)}</span>`;
        const r = `cddl-key-${Zi(n)}-${Zi(e)}`,
          s = `cddl-key:${n}/${e}`;
        return t.definitions.has(s)
          ? `<a href="#${r}" class="cddl-name" data-link-type="cddl-key" data-xref-for="${hn(n)}">${hn(e)}</a>`
          : t.proseDfns.has(r)
            ? (t.definitions.set(s, { type: "cddl-key", for: n, id: r }),
              `<a href="#${r}" class="cddl-name" data-link-type="cddl-key" data-xref-for="${hn(n)}">${hn(e)}</a>`)
            : (t.definitions.set(s, { type: "cddl-key", for: n, id: r }),
              `<dfn data-dfn-type="cddl-key" data-dfn-for="${hn(n)}" id="${r}" data-export>${hn(e)}</dfn>`);
      }
      #n(e) {
        const t = this.#t;
        if (Ki.has(e))
          return `<a class="cddl-kw" data-link-type="cddl-type" data-link-spec="rfc8610" href="https://www.rfc-editor.org/rfc/rfc8610#section-appendix.d">${hn(e)}</a>`;
        const n = `cddl-type:${e}`;
        if (t.definitions.has(n)) {
          const r = t.definitions.get(n);
          return r
            ? `<a href="#${r.id}" class="cddl-name" data-link-type="cddl-type">${hn(e)}</a>`
            : `<span class="cddl-name">${hn(e)}</span>`;
        }
        return `<span class="cddl-name" data-cddl-pending="${hn(e)}">${hn(e)}</span>`;
      }
      serializeValue(e, t, n, r) {
        const s = this.#t,
          i = e + t + n;
        if ("text" === r.type && this.#i(r)) {
          const e = this.#e;
          if (e) {
            const n = `cddl-value-${Zi(e)}-${Zi(t)}`,
              r = `cddl-value:${e}/"${t}"`;
            if (s.definitions.has(r)) {
              const t = s.definitions.get(r);
              return t
                ? `<a href="#${t.id}" class="cddl-str" data-link-type="cddl-value" data-xref-for="${hn(e)}">${hn(i)}</a>`
                : `<span class="cddl-str">${hn(i)}</span>`;
            }
            if (s.proseDfns.has(n))
              return (
                s.definitions.set(r, { type: "cddl-value", for: e, id: n }),
                `<a href="#${n}" class="cddl-str" data-link-type="cddl-value" data-xref-for="${hn(e)}">${hn(i)}</a>`
              );
            if (!s.definitions.has(r))
              return (
                s.definitions.set(r, { type: "cddl-value", for: e, id: n }),
                `<dfn data-dfn-type="cddl-value" data-dfn-for="${hn(e)}" id="${n}" data-export>${hn(i)}</dfn>`
              );
          }
        }
        switch (r.type) {
          case "text":
            return `<span class="cddl-str">${hn(i)}</span>`;
          case "number":
          case "float":
            return `<span class="cddl-num">${hn(i)}</span>`;
          case "bytes":
          case "hex":
          case "base64":
            return `<span class="cddl-bytes">${hn(i)}</span>`;
          default:
            return hn(i);
        }
      }
      #i(e) {
        const t = e.parentNode;
        return !!t && t instanceof Yt;
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
            return t instanceof en ? this.#l(r) : r;
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
    function Yi(e, t, n) {
      const r = e.textContent;
      if (r.trim())
        try {
          const s = t(r),
            i = new Xi(n),
            o = s.serialize(i),
            a = document.createElement("code");
          ((a.innerHTML = o),
            (e.textContent = ""),
            e.append(a),
            e.classList.add("def", "highlight"),
            bn(e, "cddl-block"));
          const c = document.createElement("span");
          ((c.className = "cddlHeader"),
            (c.innerHTML = `<a class="self-link" href="#${e.id}">CDDL</a>`));
          const l = (function (e, t = "Copy to clipboard") {
            const n = document.createElement("button");
            return (
              (n.innerHTML = Gi),
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
          })(".cddlHeader");
          (c.append(l), e.prepend(c));
        } catch (t) {
          Nn(
            `CDDL processing error: ${t instanceof Error ? t.message : String(t)}`,
            Vi,
            {
              elements: [e],
              hint: 'Check the CDDL syntax in the `<pre class="cddl">` block.',
            }
          );
        }
    }
    var eo = Object.freeze({
      __proto__: null,
      name: Vi,
      run: async function () {
        const e = document.querySelectorAll("pre.cddl:not([data-no-cddl])");
        if (!e.length) return;
        const t = document.createElement("style");
        t.textContent = Ji;
        const n = document.querySelector("head link, head > *:last-child");
        n ? n.before(t) : document.head.append(t);
        const r = e => new Jt(e).parse(),
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
                s = n ? `${Zi(n)}-` : "",
                i = e.replace("cddl-", ""),
                a = t.id || `cddl-${i}-${s}${Zi(r)}`;
              ((t.id = a), o.add(a), vi(t, [r]));
            });
          }),
          e.forEach(e => Yi(e, r, s)),
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
            On(
              `No CDDL definition found for \`${e.getAttribute("data-cddl-pending")}\`.`,
              Vi,
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
                (On(
                  `CDDL ${n}: no definition found for \`${s}\`${r ? `, for \`${r}\`,` : ""} in any \`<pre class="cddl">\` block.`,
                  Vi,
                  { elements: [e] }
                ),
                  e.setAttribute("data-no-link-to-dfn", ""));
            });
          })(document, s.definitions),
          (function (e, t) {
            t.forEach(t => {
              const n = e.getElementById(t.id);
              "dfn" === n?.localName && vi(n, [n.textContent.trim()]);
            });
          })(document, s.definitions),
          (function () {
            if (document.getElementById("respec-copy-paste")) return;
            const e = document.createElement("script");
            ((e.id = "respec-copy-paste"),
              (e.textContent =
                '\n    document.querySelectorAll(".respec-button-copy-paste").forEach(function(btn) {\n      btn.addEventListener("click", function() {\n        var pre = this.closest("pre");\n        if (!pre) return;\n        var sel = this.dataset.copyHeader;\n        var clone = pre.cloneNode(true);\n        if (sel) { var h = clone.querySelector(sel); if (h) h.remove(); }\n        navigator.clipboard.writeText(clone.textContent);\n      });\n    });\n  '),
              document.body.append(e));
          })(),
          Bn("beforesave", e => {
            e.querySelectorAll("[data-cddl-pending]").forEach(e =>
              e.removeAttribute("data-cddl-pending")
            );
          }));
      },
    });
    const to = "core/data-cite",
      no = "__SPEC__";
    async function ro(e) {
      const { key: t, frag: n, path: r, href: s } = e;
      let i = "",
        o = "";
      if (t === no) i = document.location.href;
      else {
        const e = await Ps(t);
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
    function so(e, t, n) {
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
            e.textContent ? $n(e, t) : ((t.textContent = s), e.append(t)),
            i)
          ) {
            const n = document.createElement("cite");
            (n.append(t), e.append(n));
          }
          if ("export" in e.dataset) {
            (Nn("Exporting a linked external definition is not allowed.", to, {
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
    function io(e) {
      return t => {
        const n = t.search(e);
        return -1 !== n ? t.substring(n) : "";
      };
    }
    const oo = io("#"),
      ao = io("/");
    function co(e) {
      const { dataset: t } = e,
        { cite: n, citeFrag: r, citePath: s, citeHref: i } = t;
      if ((n ?? "").startsWith("#") && !r) {
        const r =
            e.parentElement?.closest('[data-cite]:not([data-cite^="#"])') ??
            null,
          { key: s, isNormative: i } = r ? co(r) : { key: no, isNormative: !1 };
        return (
          (t.cite = i ? s : `?${s}`),
          (t.citeFrag = (n ?? "").replace("#", "")),
          co(e)
        );
      }
      const o = r ? `#${r}` : oo(n ?? ""),
        a = s || ao(n ?? "").split("#")[0],
        { type: c } = xn(n ?? "", e),
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
    function lo(e) {
      const t = ["data-cite", "data-cite-frag", "data-cite-path"];
      e.querySelectorAll("a[data-cite], dfn[data-cite]").forEach(e =>
        t.forEach(t => e.removeAttribute(t))
      );
    }
    var uo = Object.freeze({
      __proto__: null,
      THIS_SPEC: no,
      name: to,
      run: async function () {
        const e = document.querySelectorAll(
          "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
        );
        await (async function (e) {
          const t = e
              .map(co)
              .map(async e => ({ entry: e, result: await Ps(e.key) })),
            n = (await Promise.all(t))
              .filter(({ result: e }) => null === e)
              .map(({ entry: { key: e } }) => e),
            r = await Os(n);
          r && Object.assign(Es, r);
        })([...e]);
        for (const t of e) {
          const e = t.dataset.cite,
            n = co(t),
            r = await ro(n);
          if (r) so(t, r, n);
          else {
            const n = `Couldn't find a match for "${e}"`;
            (t.dataset.matchedText && (t.textContent = t.dataset.matchedText),
              On(n, to, { elements: [t] }));
          }
        }
        Bn("beforesave", lo);
      },
      toCiteDetails: co,
    });
    const ho = "core/link-to-dfn",
      po = [],
      fo = fn({
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
      });
    function mo(e) {
      const t = new Map(),
        n = [];
      for (const r of wi.get(e) ?? []) {
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
            kn(r, "dfn", e));
        }
      }
      return { result: t, duplicates: n };
    }
    function go(e, t) {
      const n = (function (e) {
        const t = e.closest("[data-link-for]"),
          n = t ? (t.dataset.linkFor ?? "") : "";
        return wn(e).reduce((e, r) => {
          const s = r.split(".");
          return (
            2 === s.length && e.push({ for: s[0], title: s[1] }),
            e.push({ for: n, title: r }),
            t || e.push({ for: r, title: r }),
            "" !== n && e.push({ for: "", title: r }),
            e
          );
        }, []);
      })(e).find(e => t.has(e.title) && t.get(e.title)?.has(e.for));
      if (!n) return;
      const r = t.get(n.title)?.get(n.for),
        { linkType: s } = e.dataset;
      if (s) {
        for (const e of s.split("|")) if (r?.get(e)) return r.get(e);
        return r?.get("dfn");
      }
      {
        const e = n.for ? "idl" : "dfn";
        return r?.get(e) || r?.get("idl");
      }
    }
    function bo(e, t, n) {
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
              s = yo(e) && yo(t, n);
            (r && !s) || $n(e, document.createElement("code"));
          })(e, t),
        !r
      );
    }
    function yo(e, t = "") {
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
    function ko(e) {
      e.forEach(e => {
        const t = `Found linkless \`<a>\` element with text "${e.textContent}" but no matching \`<dfn>\``,
          n = e.closest("[data-link-for]"),
          r = `Add a matching \`<dfn>\` element, ${Dn`use ${"[data-cite]"} to link to an external definition, or enable ${"[xref]"} for automatic cross-spec linking.`}${n ? ` This link is inside a \`data-link-for="${n.dataset.linkFor}"\` section — \`[=term=]\` links are scoped to that context. To link to a global concept instead, either add \`data-link-for=""\` on this \`<a>\` or move it outside the scoped section.` : ""}`;
        On(t, ho, {
          title: "Linking error: no matching `<dfn>`",
          hint: r,
          elements: [e],
        });
      });
    }
    var wo = Object.freeze({
      __proto__: null,
      name: ho,
      possibleExternalLinks: po,
      run: async function (e) {
        const t = (function () {
            const e = new An();
            for (const t of wi.keys()) {
              const { result: n, duplicates: r } = mo(t);
              (e.set(t, n),
                r.length > 0 &&
                  Nn(fo.duplicateMsg(t), ho, {
                    title: fo.duplicateTitle,
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
            po.push(e);
            continue;
          }
          const r = go(e, t);
          if (r) {
            bo(e, r, t) || po.push(e);
          } else "" === e.dataset.cite ? n.push(e) : po.push(e);
        }
        (ko(n),
          (function (e) {
            const { shortName: t = "" } = e,
              n = new RegExp(String.raw`^([?!])?${nn(t)}\b([^-])`, "i"),
              r = document.querySelectorAll(
                "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
              );
            for (const t of r) {
              t.dataset.cite = (t.dataset.cite ?? "").replace(n, `$1${no}$2`);
              const { key: r, isNormative: s } = co(t);
              r !== no &&
                (s || e.normativeReferences.has(r)
                  ? (e.normativeReferences.add(r),
                    e.informativeReferences.delete(r))
                  : e.informativeReferences.add(r));
            }
          })(e),
          e.xref || ko(po));
      },
    });
    const vo = "core/contrib";
    var xo = Object.freeze({
      __proto__: null,
      name: vo,
      run: async function (e) {
        if (!document.getElementById("gh-contributors")) return;
        if (!e.github) {
          return void Nn(
            Dn`Requested list of contributors from GitHub, but ${"[github]"} configuration option is not set.`,
            vo
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
                  return void Bt(
                    t
                  )`${n.map(({ name: e, login: t }) => `<li><a href="https://github.com/${t}">${e || t}</a></li>`)}`;
                const r = n.map(e => e.name || e.login);
                t.textContent = dn(r);
              })(r, n)
            : (n.textContent = "Failed to fetch contributors.");
          async function s() {
            const { href: n } = new URL("contributors", t);
            try {
              const t = await (async function (e, t = 864e5) {
                const n = new Request(e),
                  r = new URL(n.url);
                let s, i;
                if ("caches" in window)
                  try {
                    if (
                      ((s = await caches.open(r.origin)),
                      (i = await s.match(n)),
                      i &&
                        new Date(i.headers.get("Expires") ?? "") > new Date())
                    )
                      return i;
                  } catch (e) {
                    console.error("Failed to use Cache API.", e);
                  }
                const o = await fetch(n);
                if (!o.ok && i)
                  return (
                    console.warn(`Returning a stale cached response for ${r}`),
                    i
                  );
                if (s && o.ok) {
                  const e = o.clone(),
                    r = new Headers(o.headers),
                    i = new Date(Date.now() + t);
                  r.set("Expires", i.toISOString());
                  const a = new Response(await e.blob(), { headers: r });
                  await s.put(n, a).catch(console.error);
                }
                return o;
              })(n);
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
                Nn("Error loading contributors from GitHub.", vo, { cause: e }),
                null
              );
            }
          }
        })(t, n);
      },
    });
    var $o = Object.freeze({
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
            vn(e, `h${t}`);
          });
      },
    });
    function Co(e, t) {
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
    var So = Object.freeze({
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
        ).filter(e => !e.closest(sn));
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
                r.append(Co(t)),
                e.append(r));
            })
          : e.append(Co(t, "actual-cddl-index"));
      },
    });
    const _o = ["h2", "h3", "h4", "h5", "h6"],
      To = "core/structure",
      Eo = fn({
        en: { toc: "Table of Contents", back_to_top: "Back to Top" },
        zh: { toc: "内容大纲", back_to_top: "返回顶部" },
        ko: { toc: "목차", back_to_top: "맨 위로" },
        ja: { toc: "目次", back_to_top: "先頭に戻る" },
        nl: { toc: "Inhoudsopgave", back_to_top: "Terug naar boven" },
        es: { toc: "Tabla de Contenidos", back_to_top: "Volver arriba" },
        de: { toc: "Inhaltsverzeichnis", back_to_top: "Zurück nach oben" },
        cs: { toc: "Obsah", back_to_top: "Zpět na začátek" },
      });
    function Lo(e, t, { prefix: n = "" } = {}) {
      let r = !1,
        s = 0,
        i = 1;
      if ((n.length && !n.endsWith(".") && (n += "."), 0 === e.length))
        return null;
      const o = Bt`<ol class="toc"></ol>`;
      for (const a of e) {
        !a.isAppendix || n || r || ((s = i), (r = !0));
        let e = a.isIntro ? "" : r ? Ao(i - s + 1) : n + i;
        const c = e.split(".").length;
        if (
          (1 === c &&
            ((e += "."), a.header.before(document.createComment("OddPage"))),
          a.isIntro ||
            ((i += 1), a.header.prepend(Bt`<bdi class="secno">${e} </bdi>`)),
          c <= t)
        ) {
          const n = a.header.id || a.element.id,
            r = No(a.header, n),
            s = Lo(a.subsections, t, { prefix: e });
          (s && r.append(s), o.append(r));
        }
      }
      return o;
    }
    function Ao(e) {
      let t = "";
      for (; e > 0; )
        ((e -= 1),
          (t = String.fromCharCode(65 + (e % 26)) + t),
          (e = Math.floor(e / 26)));
      return t;
    }
    function Ro(e) {
      const t = e.querySelectorAll(":scope > section"),
        n = [];
      for (const e of t) {
        const t = e.classList.contains("notoc");
        if (!e.children.length || t) continue;
        const r = e.children[0];
        if (!_o.includes(r.localName)) continue;
        const s = r.textContent;
        (kn(e, void 0, s),
          n.push({
            element: e,
            header: r,
            title: s,
            isIntro: Boolean(e.closest(".introductory")),
            isAppendix: e.classList.contains("appendix"),
            subsections: Ro(e),
          }));
      }
      return n;
    }
    function No(e, t) {
      const n = Bt`<a href="${`#${t}`}" class="tocxref" />`;
      var r;
      return (
        n.append(...e.cloneNode(!0).childNodes),
        (r = n).querySelectorAll("a").forEach(e => {
          const t = vn(e, "span");
          ((t.className = "formerLink"), t.removeAttribute("href"));
        }),
        r.querySelectorAll("dfn").forEach(e => {
          vn(e, "span").removeAttribute("id");
        }),
        Bt`<li class="tocline">${n}</li>`
      );
    }
    var Oo = Object.freeze({
      __proto__: null,
      name: To,
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
              const t = `h${Math.min(Cn(e, "section").length + 1, 6)}`;
              e.localName !== t && vn(e, t);
            });
          })(),
          !e.noTOC)
        ) {
          !(function () {
            const e = document.querySelectorAll("section[data-max-toc]");
            for (const t of e) {
              const e = parseInt(t.dataset.maxToc ?? "", 10);
              if (e < 0 || e > 6 || Number.isNaN(e)) {
                Nn(
                  "`data-max-toc` must have a value between 0-6 (inclusive).",
                  To,
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
          const t = Lo(Ro(document.body), e.maxTocLevel);
          t &&
            (function (e) {
              if (!e) return;
              const t = Bt`<nav id="toc"></nav>`,
                n = Bt`<h2 class="introductory">${Eo.toc}</h2>`;
              (kn(n), t.append(n, e));
              const r =
                document.getElementById("toc") ||
                document.getElementById("sotd") ||
                document.getElementById("abstract");
              r && ("toc" === r.id ? r.replaceWith(t) : r.after(t));
              const s = Bt`<p role="navigation" id="back-to-top">
    <a href="#title"><abbr title="${Eo.back_to_top}">&uarr;</abbr></a>
  </p>`;
              document.body.append(s);
            })(t);
        }
        Hn("toc", void 0);
      },
    });
    const Po = fn({
      en: { informative: "This section is non-normative." },
      nl: { informative: "Dit onderdeel is niet-normatief." },
      ko: { informative: "이 부분은 비규범적입니다." },
      ja: { informative: "この節は仕様には含まれません．" },
      de: { informative: "Dieser Abschnitt ist nicht normativ." },
      zh: { informative: "本章节不包含规范性内容。" },
      cs: { informative: "Tato sekce není normativní." },
    });
    var zo = Object.freeze({
      __proto__: null,
      name: "core/informative",
      run: function () {
        Array.from(document.querySelectorAll("section.informative"))
          .map(e => e.querySelector("h2, h3, h4, h5, h6"))
          .filter(e => null !== e)
          .forEach(e => {
            e.after(Bt`<p><em>${Po.informative}</em></p>`);
          });
      },
    });
    const jo = fn({
      en: {
        permalinkLabel(e, t) {
          let n = `Permalink for${t ? "" : " this"} ${e}`;
          return (t && (n += ` ${pn(t.textContent)}`), n);
        },
      },
    });
    var Io = Object.freeze({
      __proto__: null,
      name: "core/id-headers",
      run: function (e) {
        const t = document.querySelectorAll(
          "section:not(.head,#abstract,#sotd) h2, h3, h4, h5, h6"
        );
        for (const n of t) {
          let t = n.id;
          if (
            (t || (kn(n), (t = n.parentElement?.id || n.id)),
            !e.addSectionLinks)
          )
            continue;
          const r = jo.permalinkLabel(
              n.closest(".appendix") ? "Appendix" : "Section",
              n.querySelector(":scope > bdi.secno")
            ),
            s = Bt`<div class="header-wrapper"></div>`;
          n.replaceWith(s);
          const i = Bt`<a
      href="#${t}"
      class="self-link"
      aria-label="${r}"
    ></a>`;
          s.append(n, i);
        }
      },
    });
    var Do = Object.freeze({
      __proto__: null,
      name: "geonovum/conformance",
      run: function () {
        const e = document.querySelector("section#conformance");
        e &&
          (function (e) {
            const t = Bt`
    <h2>Conformiteit</h2>
    <p>
      Naast onderdelen die als niet normatief gemarkeerd zijn, zijn ook alle
      diagrammen, voorbeelden, en noten in dit document niet normatief. Verder
      is alles in dit document normatief.
    </p>
    <p>Informatief en normatief.</p>
  `;
            e.prepend(...t.childNodes);
          })(e);
      },
    });
    const Mo = "ui/save-html",
      qo = fn({
        en: { save_snapshot: "Export" },
        nl: { save_snapshot: "Bewaar Snapshot" },
        ja: { save_snapshot: "保存する" },
        de: { save_snapshot: "Exportieren" },
        zh: { save_snapshot: "导出" },
      }),
      Ho = [
        {
          id: "respec-save-as-html",
          ext: "html",
          title: "HTML",
          type: "text/html",
          get href() {
            return Wn(this.type);
          },
        },
        {
          id: "respec-save-as-xml",
          ext: "xhtml",
          title: "XML",
          type: "application/xml",
          get href() {
            return Wn(this.type);
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
    function Bo(e, t) {
      const { id: n, href: r, ext: s, title: i, type: o } = e,
        a = (function (e, t = "") {
          return rn.format(e).replace(tn, t);
        })(t.publishDate || new Date()),
        c = [t.specStatus, t.shortName || "spec", a].join("-");
      return Bt`<a
    href="${r}"
    id="${n}"
    download="${c}.${s}"
    type="${o}"
    class="respec-save-button"
    onclick=${() => xr.closeModal()}
    >${i}</a
  >`;
    }
    var Fo = Object.freeze({
      __proto__: null,
      exportDocument: function (e, t) {
        return (
          On(
            "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed.",
            Mo,
            { hint: "Use core/exporter `rsDocToDataURL()` instead." }
          ),
          Wn(t)
        );
      },
      name: Mo,
      run: function (e) {
        const t = {
            async show(t) {
              await document.respec.ready;
              const n = Bt`<div class="respec-save-buttons">
        ${Ho.map(t => Bo(t, e))}
      </div>`;
              xr.freshModal(qo.save_snapshot, n, t);
            },
          },
          n = "download" in HTMLAnchorElement.prototype;
        let r;
        n &&
          (r = xr.addCommand(
            qo.save_snapshot,
            function () {
              if (!n) return;
              t.show(r);
            },
            "Ctrl+Shift+Alt+S",
            "💾"
          ));
      },
    });
    const Uo = "https://respec.org/specref/",
      Wo = fn({
        en: { search_specref: "Search Specref" },
        nl: { search_specref: "Doorzoek Specref" },
        ja: { search_specref: "仕様検索" },
        de: { search_specref: "Spezifikationen durchsuchen" },
        zh: { search_specref: "搜索 Specref" },
        cs: { search_specref: "Hledat ve Specref" },
      }),
      Go = xr.addCommand(
        Wo.search_specref,
        function () {
          const e = Bt`
    <iframe class="respec-iframe" src="${Uo}" onload=${e => e.target.classList.add("ready")}></iframe>
    <a href="${Uo}" target="_blank">Open Search UI in a new tab</a>
  `;
          xr.freshModal(Wo.search_specref, e, Go);
        },
        "Ctrl+Shift+Alt+space",
        "🔎"
      );
    var Jo = Object.freeze({ __proto__: null });
    const Vo = fn({
      en: { about_respec: "About" },
      zh: { about_respec: "关于" },
      nl: { about_respec: "Over" },
      ja: { about_respec: "これについて" },
      de: { about_respec: "Über" },
      cs: { about_respec: "O aplikaci" },
    });
    window.respecVersion = window.respecVersion || "Developer Edition";
    const Ko = document.createElement("div"),
      Zo = Bt.bind(Ko),
      Qo = xr.addCommand(
        `${Vo.about_respec} ${window.respecVersion}`,
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
              .map(Xo)
              .forEach(t => {
                e.push(t);
              });
          (Zo`
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
            xr.freshModal(
              `${Vo.about_respec} - ${window.respecVersion}`,
              Ko,
              Qo
            ));
        },
        "Ctrl+Shift+Alt+A",
        "ℹ️"
      );
    function Xo({ name: e, duration: t }) {
      return Bt`
    <tr>
      <td><a href="${`https://github.com/speced/respec/blob/develop/src/${e}.js`}">${e}</a></td>
      <td>${t}</td>
    </tr>
  `;
    }
    var Yo = Object.freeze({ __proto__: null });
    var ea = Object.freeze({
      __proto__: null,
      name: "core/seo",
      run: function (e) {
        if (e.gitRevision) {
          const t = Bt`<meta
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
    const ta =
      "\n  --base: #282c34;\n  --mono-1: #abb2bf;\n  --mono-2: #818896;\n  --mono-3: #5c6370;\n  --hue-1: #56b6c2;\n  --hue-2: #61aeee;\n  --hue-3: #c678dd;\n  --hue-4: #98c379;\n  --hue-5: #e06c75;\n  --hue-5-2: #be5046;\n  --hue-6: #d19a66;\n  --hue-6-2: #e6c07b;\n";
    var na = String.raw`.hljs,body:has(input[name=color-scheme][value=light]:checked) .hljs,head:not(:has(meta[name=color-scheme][content~=dark]))+body .hljs{--base:#fafafa;--mono-1:#383a42;--mono-2:#686b77;--mono-3:#717277;--hue-1:#0b76c5;--hue-2:#336ae3;--hue-3:#a626a4;--hue-4:#42803c;--hue-5:#ca4706;--hue-5-2:#c91243;--hue-6:#986801;--hue-6-2:#9a6a01}
@media (prefers-color-scheme:dark){
.hljs{${ta}}
}
body:has(input[name=color-scheme][value=dark]:checked) .hljs{${ta}}
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
    async function ra(t) {
      const n = await fetch(
        new URL(
          `../../${t}`,
          (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
            new URL("respec-geonovum.js", document.baseURI).href
        )
      );
      return await n.text();
    }
    const sa = new URL(
        "respec-highlight.js",
        (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
          new URL("respec-geonovum.js", document.baseURI).href
      ).href,
      ia = on({ hint: "preload", href: sa, as: "script" });
    async function oa() {
      try {
        return (
          await Promise.resolve().then(function () {
            return pc;
          })
        ).default;
      } catch {
        return ra("worker/respec-worker.js");
      }
    }
    async function aa() {
      try {
        const e = await fetch(sa);
        if (e.ok) return await e.text();
      } catch {}
      return null;
    }
    document.head.appendChild(ia);
    const ca = (async function () {
      const [e, t] = await Promise.all([oa(), aa()]),
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
      ca.then(e => ({ worker: e }))
    );
    const la = (function (e, t = 0) {
      const n = (function* (e, t) {
        for (;;) (yield `${e}:${t}`, t++);
      })(e, t);
      return () => n.next().value;
    })("highlight");
    async function ua(e) {
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
          const n = { action: "highlight", code: e, id: la(), languages: t },
            r = await ca;
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
    var da = Object.freeze({
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
        const n = t.filter(e => e.textContent.trim()).map(ua);
        (document.head.appendChild(Bt`<style>
      ${na}
    </style>`),
          await Promise.all(n));
      },
    });
    const ha = fn({
        en: {
          missing_test_suite_uri: Dn`Found tests in your spec, but missing ${"[testSuiteURI]"} in your ReSpec config.`,
          tests: "tests",
          test: "test",
        },
        ja: {
          missing_test_suite_uri: Dn`この仕様内にテストの項目を検出しましたが，ReSpec の設定に ${"[testSuiteURI]"} が見つかりません．`,
          tests: "テスト",
          test: "テスト",
        },
        de: {
          missing_test_suite_uri: Dn`Die Spezifikation enthält Tests, aber in der ReSpec-Konfiguration ist keine ${"[testSuiteURI]"} angegeben.`,
          tests: "Tests",
          test: "Test",
        },
        zh: {
          missing_test_suite_uri: Dn`本规范中包含测试，但在 ReSpec 配置中缺少 ${"[testSuiteURI]"}。`,
          tests: "测试",
          test: "测试",
        },
      }),
      pa = "core/data-tests";
    function fa(e) {
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
      return Bt`
    <li>
      <a href="${e}">${s}</a>
      ${t}
    </li>
  `;
    }
    function ma(e, t, n) {
      return e
        .map(e => {
          try {
            return new URL(e, t).href;
          } catch {
            On(Dn`Invalid URL in ${"[data-tests]"} attribute: ${e}.`, pa, {
              elements: [n],
            });
          }
        })
        .filter(e => e);
    }
    function ga(e, t) {
      const n = e.filter((e, t, n) => n.indexOf(e) !== t);
      if (n.length) {
        const e = Dn`Duplicate tests found in the ${"[data-tests]"} attribute.`,
          r = Dn`To fix, remove duplicates from ${"[data-tests]"}: ${(function (
            e,
            { quotes: t } = { quotes: !1 }
          ) {
            return dn(e, t ? e => zn(In(e)) : zn);
          })(n, { quotes: !0 })}.`;
        On(e, pa, { hint: r, elements: [t] });
      }
    }
    function ba(e) {
      const t = [...new Set(e)];
      return Bt`
    <details class="respec-tests-details removeOnSave">
      <summary>tests: ${t.length}</summary>
      <ul>
        ${t.map(fa)}
      </ul>
    </details>
  `;
    }
    var ya = Object.freeze({
      __proto__: null,
      name: pa,
      run: function (e) {
        const t = [...document.querySelectorAll("[data-tests]")].filter(
          e => e.dataset.tests
        );
        if (t.length)
          if (e.testSuiteURI)
            for (const n of t) {
              const t = ma(
                (n.dataset.tests ?? "").split(/,/gm).map(e => e.trim()),
                e.testSuiteURI,
                n
              ).filter(e => void 0 !== e);
              ga(t, n);
              const r = ba(t);
              n.append(r);
            }
          else Nn(ha.missing_test_suite_uri, pa);
      },
    });
    const ka = "core/list-sorter";
    function wa(e) {
      const t = "ascending" === e ? 1 : -1;
      return (e, n) => {
        const r = e.textContent ?? "",
          s = n.textContent ?? "";
        return t * r.trim().localeCompare(s.trim());
      };
    }
    function va(e, t) {
      return [...e.querySelectorAll(":scope > li")]
        .sort(wa(t))
        .reduce(
          (e, t) => (e.appendChild(t), e),
          document.createDocumentFragment()
        );
    }
    function xa(e, t) {
      return [...e.querySelectorAll(":scope > dt")]
        .sort(wa(t))
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
    var $a = Object.freeze({
      __proto__: null,
      name: ka,
      run: function () {
        const e = document.querySelectorAll("[data-sort]");
        for (const t of e) {
          let e;
          const n = t.dataset.sort || "ascending";
          switch (t.localName) {
            case "dl":
              e = xa(t, n);
              break;
            case "ol":
            case "ul":
              e = va(t, n);
              break;
            default:
              On(`ReSpec can't sort ${t.localName} elements.`, ka, {
                elements: [t],
              });
          }
          if (e) {
            const n = document.createRange();
            (n.selectNodeContents(t), n.deleteContents(), t.appendChild(e));
          }
        }
      },
      sortDefinitionTerms: xa,
      sortListItems: va,
    });
    var Ca = String.raw`var:hover{text-decoration:underline;cursor:pointer}
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
    var Sa = Object.freeze({
      __proto__: null,
      name: "core/highlight-vars",
      run: async function (e) {
        if (!e.highlightVars) return;
        const t = document.createElement("style");
        ((t.textContent = Ca), document.head.appendChild(t));
        const n = document.createElement("script");
        ((n.id = "respec-highlight-vars"),
          (n.textContent = await (async function () {
            try {
              return (
                await Promise.resolve().then(function () {
                  return fc;
                })
              ).default;
            } catch {
              return ra("./src/core/highlight-vars.runtime.js");
            }
          })()),
          document.body.append(n),
          Bn("beforesave", e => {
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
    const _a = "core/anchor-expander";
    function Ta(e, t, n) {
      const r = e.querySelector(".marker .self-link");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Nn(
          `Found matching element "${t}", but it has no title or marker.`,
          _a,
          { title: "Missing title.", elements: [n] }
        );
      }
      const s = Tn(r);
      (n.append(...s.childNodes), n.classList.add("box-ref"));
    }
    function Ea(e, t, n) {
      const r = e.querySelector("figcaption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Nn(
          `Found matching figure "${t}", but figure is lacking a \`<figcaption>\`.`,
          _a,
          { title: "Missing figcaption in referenced figure.", elements: [n] }
        );
      }
      const s = [...Tn(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("figno"), e)
      );
      (n.append(...s), n.classList.add("fig-ref"));
      const i = r.querySelector(".fig-title");
      !n.hasAttribute("title") && i && (n.title = pn(i.textContent));
    }
    function La(e, t, n) {
      if (!e.classList.contains("numbered")) return;
      const r = e.querySelector("caption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Nn(
          `Found matching table "${t}", but table is lacking a \`<caption>\`.`,
          _a,
          { title: "Missing caption in referenced table.", elements: [n] }
        );
      }
      const s = [...Tn(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("tableno"), e)
      );
      (n.append(...s), n.classList.add("table-ref"));
      const i = r.querySelector(".table-title");
      !n.hasAttribute("title") && i && (n.title = pn(i.textContent));
    }
    function Aa(e, t, n) {
      const r = e.querySelector("h6, h5, h4, h3, h2");
      if (r) (Ra(r, n), Na(r, n));
      else {
        n.textContent = n.getAttribute("href");
        Nn(
          "Found matching section, but the section was lacking a heading element.",
          _a,
          { title: `No matching id in document: "${t}".`, elements: [n] }
        );
      }
    }
    function Ra(e, t) {
      const n = e.querySelector(".self-link"),
        r = [...Tn(e).childNodes].filter(
          e => !e.classList || !e.classList.contains("self-link")
        );
      (t.append(...r),
        n && t.prepend("§ "),
        t.classList.add("sec-ref"),
        t.lastChild &&
          t.lastChild.nodeType === Node.TEXT_NODE &&
          (t.lastChild.textContent = (t.lastChild.textContent ?? "").trimEnd()),
        t.querySelectorAll("a").forEach(e => {
          const t = vn(e, "span");
          for (const e of [...t.attributes]) t.removeAttributeNode(e);
        }));
    }
    function Na(e, t) {
      for (const n of ["dir", "lang"]) {
        if (t.hasAttribute(n)) continue;
        const r = e.closest(`[${n}]`);
        if (!r) continue;
        const s = t.closest(`[${n}]`);
        (s && s.getAttribute(n) === r.getAttribute(n)) ||
          t.setAttribute(n, r.getAttribute(n) ?? "");
      }
    }
    var Oa = Object.freeze({
      __proto__: null,
      name: _a,
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
                Ra(n, t);
                break;
              case "section":
                Aa(n, e, t);
                break;
              case "figure":
                Ea(n, e, t);
                break;
              case "table":
                La(n, e, t);
                break;
              case "aside":
              case "div":
                Ta(n, e, t);
                break;
              default:
                t.textContent = t.getAttribute("href");
                Nn(
                  "ReSpec doesn't support expanding this kind of reference.",
                  _a,
                  { title: `Can't expand "#${e}".`, elements: [t] }
                );
            }
            (Na(n, t), t.normalize());
          } else {
            t.textContent = t.getAttribute("href");
            Nn(
              `Couldn't expand inline reference. The id "${e}" is not in the document.`,
              _a,
              { title: `No matching id in document: ${e}.`, elements: [t] }
            );
          }
        }
      },
    });
    var Pa = String.raw`dfn{cursor:pointer}
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
    function za(e) {
      const { id: t } = e,
        n = e.dataset.href || `#${t}`,
        r = document.querySelectorAll(`a[href="${n}"]:not(.index-term)`),
        s = `dfn-panel-for-${e.id}`,
        i = e.getAttribute("aria-label") || pn(e.textContent),
        o = Bt`
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
            ? Bt`<span
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
              return Bt`<a
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
            ? Bt`<a
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
          return Bt`<ul>
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
              return n ? `§ ${pn(n.textContent)}` : null;
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
          s = e => Bt`<li>
      ${r(e).map(
        e => Bt`<a href="#${e.id}" title="${e.title}">${e.text}</a
          >${" "}`
      )}
    </li>`;
        return Bt`<ul>
    ${[...n].map(s)}
  </ul>`;
      })(t, r)}
    </div>
  `;
      return o;
    }
    var ja = Object.freeze({
      __proto__: null,
      name: "core/dfn-panel",
      run: async function () {
        document.head.insertBefore(
          Bt`<style>
      ${Pa}
    </style>`,
          document.querySelector("link")
        );
        const e = document.querySelectorAll(
            "dfn[id]:not([data-cite]), #index-defined-elsewhere .index-term"
          ),
          t = document.createDocumentFragment();
        for (const n of e)
          (t.append(za(n)),
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
                  return mc;
                })
              ).default;
            } catch {
              return ra("./src/core/dfn-panel.runtime.js");
            }
          })()),
          document.body.append(r));
      },
    });
    var Ia = Object.freeze({
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
    const Da = "core/linter-rules/check-charset",
      Ma = fn({
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
    var qa = Object.freeze({
      __proto__: null,
      name: Da,
      run: function (e) {
        if (!e.lint?.["check-charset"]) return;
        const t = document.querySelectorAll("meta[charset]"),
          n = [];
        for (const e of t)
          n.push((e.getAttribute("charset") ?? "").trim().toLowerCase());
        (n.includes("utf-8") && 1 === t.length) ||
          On(Ma.msg, Da, { hint: Ma.hint, elements: [...t] });
      },
    });
    const Ha = "no-dfn-in-abstract",
      Ba = `core/linter-rules/${Ha}`,
      Fa = fn({
        en: {
          msg: e =>
            `Definition \`${e}\` is in an unnumbered section (e.g. abstract or SotD).`,
          get hint() {
            return Dn`Definitions in unnumbered sections (abstract, SotD) are semantically out of place and appear in the terms index without a section number. Move this definition to a numbered section such as "Terminology". See ${"[export|#data-export]"}.`;
          },
        },
      }),
      Ua = ["section#abstract", "section#sotd", "section.introductory"].join(
        ", "
      );
    var Wa = Object.freeze({
      __proto__: null,
      name: Ba,
      run: function (e) {
        if (!e.lint?.[Ha]) return;
        const t = [...document.querySelectorAll("dfn")].filter(e =>
          e.closest(Ua)
        );
        t.forEach(e => {
          const t = pn(e.textContent);
          On(Fa.msg(t), Ba, { hint: Fa.hint, elements: [e] });
        });
      },
    });
    const Ga = "core/linter-rules/check-punctuation",
      Ja = [".", ":", "!", "?"],
      Va = Ja.map(e => `"${e}"`).join(", "),
      Ka = fn({
        en: {
          msg: "`p` elements should end with a punctuation mark.",
          hint: `Please make sure \`p\` elements end with one of: ${Va}.`,
        },
        cs: {
          msg: "Elementy `p` by měly končit interpunkčním znaménkem.",
          hint: `Ujistěte se, že elementy \`p\` končí jedním z těchto znaků: ${Va}.`,
        },
      });
    var Za = Object.freeze({
      __proto__: null,
      name: Ga,
      run: function (e) {
        if (!e.lint?.["check-punctuation"]) return;
        const t = new RegExp(`[${Ja.join("")}\\]]$|^ *$`, "m"),
          n = [
            ...document.querySelectorAll("p:not(#back-to-top,#w3c-state)"),
          ].filter(e => !t.test(e.textContent.trim()));
        n.length && On(Ka.msg, Ga, { hint: Ka.hint, elements: n });
      },
    });
    const Qa = "core/linter-rules/local-refs-exist",
      Xa = fn({
        en: {
          msg: "Broken local reference found in document.",
          hint: "Please fix the links mentioned.",
        },
        cs: {
          msg: "V dokumentu byla nalezena nefunkční lokální reference.",
          hint: "Opravte prosím uvedené odkazy.",
        },
      });
    function Ya(e) {
      const t = e.getAttribute("href")?.substring(1);
      if (!t) return;
      const n = e.ownerDocument;
      return !n.getElementById(t) && !n.getElementsByName(t).length;
    }
    var ec = Object.freeze({
      __proto__: null,
      name: Qa,
      run: function (e) {
        if (!e.lint?.["local-refs-exist"]) return;
        const t = [...document.querySelectorAll("a[href^='#']")].filter(Ya);
        t.length && On(Xa.msg, Qa, { hint: Xa.hint, elements: t });
      },
    });
    const tc = "core/linter-rules/no-headingless-sections",
      nc = fn({
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
    var rc = Object.freeze({
      __proto__: null,
      name: tc,
      run: function (e) {
        if (!e.lint?.["no-headingless-sections"]) return;
        const t = [
          ...document.querySelectorAll("section:not(.head,#abstract,#sotd)"),
        ].filter(
          ({ firstElementChild: e }) =>
            !e ||
            !(e.matches(".header-wrapper") || e instanceof HTMLHeadingElement)
        );
        t.length && On(nc.msg, tc, { hint: nc.hint, elements: t });
      },
    });
    const sc = "core/linter-rules/no-unused-vars",
      ic = fn({
        en: {
          msg: "Variable was defined, but never used.",
          hint: "Add a `data-ignore-unused` attribute to the `<var>`.",
        },
        cs: {
          msg: "Proměnná byla definována, ale nikdy nebyla použita.",
          hint: "Přidejte atribut `data-ignore-unused` k elementu `<var>`.",
        },
      });
    var oc = Object.freeze({
      __proto__: null,
      name: sc,
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
            const t = pn(e.textContent),
              n = s.get(t) || s.set(t, []).get(t);
            n?.push(e);
          }
          for (const e of s.values())
            1 !== e.length ||
              e[0].hasAttribute("data-ignore-unused") ||
              t.push(e[0]);
        }
        t.length && On(ic.msg, sc, { hint: ic.hint, elements: t });
      },
    });
    const ac = "core/linter-rules/privsec-section",
      cc = fn({
        en: {
          msg: "Document must have a 'Privacy and/or Security' Considerations section.",
          hint: "Add a privacy and/or security considerations section. See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
        },
        cs: {
          msg: "Dokument musí obsahovat sekci 'Zásady ochrany soukromí a/nebo bezpečnosti'.",
          hint: "Přidejte sekci o zásadách ochrany soukromí a/nebo bezpečnosti. Viz [Dotazník pro sebehodnocení](https://w3ctag.github.io/security-questionnaire/).",
        },
      });
    var lc = Object.freeze({
      __proto__: null,
      name: ac,
      run: function (e) {
        var t;
        e.lint?.["privsec-section"] &&
          e.isRecTrack &&
          ((t = document),
          !Array.from(t.querySelectorAll("h2, h3, h4, h5, h6")).some(
            ({ textContent: e }) => {
              const t = /(privacy|security)/im.test(e),
                n = /(considerations)/im.test(e);
              return (t && n) || t;
            }
          )) &&
          On(cc.msg, ac, { hint: cc.hint });
      },
    });
    const uc = "core/linter-rules/no-http-props",
      dc = fn({
        en: {
          msg: Dn`Insecure URLs are not allowed in ${"[respecConfig]"}.`,
          hint: "Please change the following properties to 'https://': ",
        },
        zh: {
          msg: Dn`${"[respecConfig]"} 中不允许使用不安全的URL.`,
          hint: "请将以下属性更改为 https://：",
        },
        cs: {
          msg: Dn`V ${"[respecConfig]"} nejsou povoleny nezabezpečené URL adresy.`,
          hint: "Změňte prosím následující vlastnosti na 'https://': ",
        },
      });
    var hc = Object.freeze({
        __proto__: null,
        name: uc,
        run: function (e) {
          if (!e.lint?.["no-http-props"]) return;
          if (!parent.location.href.startsWith("http")) return;
          const t = Object.getOwnPropertyNames(e)
            .filter(t => (t.endsWith("URI") && e[t]) || "prevED" === t)
            .filter(t =>
              new URL(e[t], parent.location.href).href.startsWith("http://")
            );
          if (t.length) {
            const e = dn(t, e => Dn`${`[${e}]`}`);
            On(dc.msg, uc, { hint: dc.hint + e });
          }
        },
      }),
      pc = Object.freeze({
        __proto__: null,
        default:
          '// ReSpec Worker\n"use strict";\n// hljs is either inlined by core/worker.js (preferred) or loaded below via\n// importScripts as a fallback when the inline fetch was not possible.\nif (typeof self.hljs === "undefined" && self.RESPEC_HIGHLIGHT_URL) {\n  try {\n    importScripts(self.RESPEC_HIGHLIGHT_URL);\n  } catch (err) {\n    console.error("Network error loading highlighter", err);\n  }\n}\n\nself.addEventListener("message", ({ data }) => {\n  if (data.action !== "highlight") return;\n  const { code } = data;\n  const langs = data.languages?.length ? data.languages : undefined;\n  try {\n    const { value, language } = self.hljs.highlightAuto(code, langs);\n    Object.assign(data, { value, language });\n  } catch (err) {\n    console.error("Could not transform some code?", err);\n    Object.assign(data, { value: code, language: "" });\n  }\n  self.postMessage(data);\n});\n',
      }),
      fc = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\n\nif (document.respec) {\n  document.respec.ready.then(setupVarHighlighter);\n} else {\n  setupVarHighlighter();\n}\n\nfunction setupVarHighlighter() {\n  document\n    .querySelectorAll("var")\n    .forEach(varElem => varElem.addEventListener("click", highlightListener));\n}\n\n/**\n * @param {MouseEvent} ev\n */\nfunction highlightListener(ev) {\n  ev.stopPropagation();\n  const varElem = /** @type {HTMLElement} */ (ev.target);\n  const hightligtedElems = highlightVars(varElem);\n  const resetListener = () => {\n    const hlColor = getHighlightColor(varElem);\n    hightligtedElems.forEach(el => removeHighlight(el, hlColor));\n    [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));\n  };\n  if (hightligtedElems.length) {\n    document.body.addEventListener("click", resetListener, { once: true });\n  }\n}\n\n// availability of highlight colors. colors from var.css\nconst HL_COLORS = new Map([\n  ["respec-hl-c1", true],\n  ["respec-hl-c2", true],\n  ["respec-hl-c3", true],\n  ["respec-hl-c4", true],\n  ["respec-hl-c5", true],\n  ["respec-hl-c6", true],\n  ["respec-hl-c7", true],\n]);\n\n/**\n * @param {HTMLElement} target\n */\nfunction getHighlightColor(target) {\n  // return current colors if applicable\n  const { value } = target.classList;\n  const re = /respec-hl-\\w+/;\n  const activeClass = re.test(value) && value.match(re);\n  if (activeClass) return activeClass[0];\n\n  // first color preference\n  if (HL_COLORS.get("respec-hl-c1") === true) return "respec-hl-c1";\n\n  // otherwise get some other available color\n  return HL_COLORS.keys().find(c => HL_COLORS.get(c)) || "respec-hl-c1";\n}\n\n/**\n * @param {HTMLElement} varElem\n */\nfunction highlightVars(varElem) {\n  const textContent = norm(varElem.textContent);\n  const parent = /** @type {HTMLElement} */ (\n    varElem.closest(".algorithm, section")\n  );\n  if (!parent) return [];\n  const highlightColor = getHighlightColor(varElem);\n\n  const varsToHighlight = [...parent.querySelectorAll("var")].filter(\n    el =>\n      norm(el.textContent) === textContent &&\n      el.closest(".algorithm, section") === parent\n  );\n\n  // update availability of highlight color\n  const colorStatus = varsToHighlight[0].classList.contains("respec-hl");\n  HL_COLORS.set(highlightColor, colorStatus);\n\n  // highlight vars\n  if (colorStatus) {\n    varsToHighlight.forEach(el => removeHighlight(el, highlightColor));\n    return [];\n  } else {\n    varsToHighlight.forEach(el => addHighlight(el, highlightColor));\n  }\n  return varsToHighlight;\n}\n\n/**\n * @param {HTMLElement} el\n * @param {string} highlightColor\n */\nfunction removeHighlight(el, highlightColor) {\n  el.classList.remove("respec-hl", highlightColor);\n  // clean up empty class attributes so they don\'t come in export\n  if (!el.classList.length) el.removeAttribute("class");\n}\n\n/**\n * @param {HTMLElement} elem\n * @param {string} highlightColor\n */\nfunction addHighlight(elem, highlightColor) {\n  elem.classList.add("respec-hl", highlightColor);\n}\n\n/**\n * Same as `norm` from src/core/utils, but our build process doesn\'t allow\n * imports in runtime scripts, so duplicated here.\n * @param {string} str\n */\nfunction norm(str) {\n  return str.trim().replace(/\\s+/g, " ");\n}\n})()',
      }),
      mc = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\nif (document.respec) {\n  document.respec.ready.then(setupPanel);\n} else {\n  setupPanel();\n}\n\nfunction setupPanel() {\n  const listener = panelListener();\n  document.body.addEventListener("keydown", listener);\n  document.body.addEventListener("click", listener);\n}\n\nfunction panelListener() {\n  /** @type {HTMLElement | null} */\n  let panel = null;\n  /**\n   * @param {KeyboardEvent|MouseEvent} event\n   */\n  return event => {\n    const { target, type } = event;\n\n    if (!(target instanceof HTMLElement)) return;\n\n    // For keys, we only care about Enter key to activate the panel\n    // otherwise it\'s activated via a click.\n    if (\n      type === "keydown" &&\n      /** @type {KeyboardEvent} */ (event).key !== "Enter"\n    )\n      return;\n\n    const action = deriveAction(event);\n\n    switch (action) {\n      case "show": {\n        hidePanel(panel);\n        /** @type {HTMLElement | null} */\n        const dfn = target.closest("dfn, .index-term");\n        if (!dfn?.id) break;\n        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);\n        if (!panel) break;\n        const coords = deriveCoordinates(\n          /** @type {MouseEvent|KeyboardEvent} */ (event)\n        );\n        displayPanel(dfn, panel, coords);\n        break;\n      }\n      case "dock": {\n        if (panel) {\n          panel.style.left = "";\n          panel.style.top = "";\n          panel.classList.add("docked");\n        }\n        break;\n      }\n      case "hide": {\n        hidePanel(panel);\n        panel = null;\n        break;\n      }\n    }\n  };\n}\n\n/**\n * @param {MouseEvent|KeyboardEvent} event\n */\nfunction deriveCoordinates(event) {\n  const target = /** @type HTMLElement */ (event.target);\n\n  // We prevent synthetic AT clicks from putting\n  // the dialog in a weird place. The AT events sometimes\n  // lack coordinates, so they have clientX/Y = 0\n  const rect = target.getBoundingClientRect();\n  if (\n    event instanceof MouseEvent &&\n    event.clientX >= rect.left &&\n    event.clientY >= rect.top\n  ) {\n    // The event probably happened inside the bounding rect...\n    return { x: event.clientX, y: event.clientY };\n  }\n\n  // Offset to the middle of the element\n  const x = rect.x + rect.width / 2;\n  // Placed at the bottom of the element\n  const y = rect.y + rect.height;\n  return { x, y };\n}\n\n/**\n * @param {Event} event\n */\nfunction deriveAction(event) {\n  const target = /** @type {HTMLElement} */ (event.target);\n  const hitALink = !!target.closest("a");\n  if (target.closest("dfn:not([data-cite]), .index-term")) {\n    return hitALink ? "none" : "show";\n  }\n  if (target.closest(".dfn-panel")) {\n    if (hitALink) {\n      return target.classList.contains("self-link") ? "hide" : "dock";\n    }\n\n    const panel = /** @type {HTMLElement} */ (target.closest(".dfn-panel"));\n    return panel.classList.contains("docked") ? "hide" : "none";\n  }\n  if (document.querySelector(".dfn-panel:not([hidden])")) {\n    return "hide";\n  }\n  return "none";\n}\n\n/**\n * @param {HTMLElement} dfn\n * @param {HTMLElement} panel\n * @param {{ x: number, y: number }} clickPosition\n */\nfunction displayPanel(dfn, panel, { x, y }) {\n  panel.hidden = false;\n  // distance (px) between edge of panel and the pointing triangle (caret)\n  const MARGIN = 20;\n\n  const dfnRects = dfn.getClientRects();\n  // Find the `top` offset when the `dfn` can be spread across multiple lines\n  let closestTop = 0;\n  let minDiff = Infinity;\n  for (const rect of dfnRects) {\n    const { top, bottom } = rect;\n    const diffFromClickY = Math.abs((top + bottom) / 2 - y);\n    if (diffFromClickY < minDiff) {\n      minDiff = diffFromClickY;\n      closestTop = top;\n    }\n  }\n\n  const top = window.scrollY + closestTop + dfnRects[0].height;\n  const left = x - MARGIN;\n  panel.style.left = `${left}px`;\n  panel.style.top = `${top}px`;\n\n  // Find if the panel is flowing out of the window\n  const panelRect = panel.getBoundingClientRect();\n  const SCREEN_WIDTH = Math.min(window.innerWidth, window.screen.width);\n  if (panelRect.right > SCREEN_WIDTH) {\n    const newLeft = Math.max(MARGIN, x + MARGIN - panelRect.width);\n    const newCaretOffset = left - newLeft;\n    panel.style.left = `${newLeft}px`;\n    /** @type {HTMLElement | null} */\n    const caret = panel.querySelector(".caret");\n    if (caret) caret.style.left = `${newCaretOffset}px`;\n  }\n\n  // As it\'s a dialog, we trap focus.\n  // TODO: when <dialog> becomes a implemented, we should really\n  // use that.\n  trapFocus(panel, dfn);\n}\n\n/**\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction trapFocus(panel, dfn) {\n  /** @type NodeListOf<HTMLAnchorElement> elements */\n  const anchors = panel.querySelectorAll("a[href]");\n  // No need to trap focus\n  if (!anchors.length) return;\n\n  // Move focus to first anchor element\n  const first = anchors.item(0);\n  first.focus();\n\n  const trapListener = createTrapListener(anchors, panel, dfn);\n  panel.addEventListener("keydown", trapListener);\n\n  // Hiding the panel releases the trap\n  const mo = new MutationObserver(records => {\n    const [record] = records;\n    const target = /** @type HTMLElement */ (record.target);\n    if (target.hidden) {\n      panel.removeEventListener("keydown", trapListener);\n      mo.disconnect();\n    }\n  });\n  mo.observe(panel, { attributes: true, attributeFilter: ["hidden"] });\n}\n\n/**\n *\n * @param {NodeListOf<HTMLAnchorElement>} anchors\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction createTrapListener(anchors, panel, dfn) {\n  const lastIndex = anchors.length - 1;\n  let currentIndex = 0;\n  /**\n   * @param {KeyboardEvent} event\n   */\n  return event => {\n    switch (event.key) {\n      // Hitting "Tab" traps us in a nice loop around elements.\n      case "Tab": {\n        event.preventDefault();\n        currentIndex += event.shiftKey ? -1 : +1;\n        if (currentIndex < 0) {\n          currentIndex = lastIndex;\n        } else if (currentIndex > lastIndex) {\n          currentIndex = 0;\n        }\n        anchors.item(currentIndex).focus();\n        break;\n      }\n\n      // Hitting "Enter" on an anchor releases the trap.\n      case "Enter":\n        hidePanel(panel);\n        break;\n\n      // Hitting "Escape" returns focus to dfn.\n      case "Escape":\n        hidePanel(panel);\n        dfn.focus();\n        return;\n    }\n  };\n}\n\n/** @param {HTMLElement | null} panel */\nfunction hidePanel(panel) {\n  if (!panel) return;\n  panel.hidden = true;\n  panel.classList.remove("docked");\n}\n})()',
      });
  })());
//# sourceMappingURL=respec-geonovum.js.map
