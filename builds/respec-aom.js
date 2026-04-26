((window.respecVersion = "36.0.0"),
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
    const o = {},
      i = r?.lang ?? "en";
    var s = Object.freeze({
      __proto__: null,
      l10n: o,
      lang: i,
      name: "core/l10n",
      run: function (e) {
        e.l10n = o[i] || o.en;
      },
    });
    const a = (e, t) => t.some(t => e instanceof t);
    let l, c;
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
        c ||
        (c = [
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
                    (e.removeEventListener("complete", o),
                      e.removeEventListener("error", i),
                      e.removeEventListener("abort", i));
                  },
                  o = () => {
                    (t(), r());
                  },
                  i = () => {
                    (n(e.error || new DOMException("AbortError", "AbortError")),
                      r());
                  };
                (e.addEventListener("complete", o),
                  e.addEventListener("error", i),
                  e.addEventListener("abort", i));
              });
              u.set(e, t);
            })(e),
          a(
            e,
            l ||
              (l = [
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
                (e.removeEventListener("success", o),
                  e.removeEventListener("error", i));
              },
              o = () => {
                (t(b(e.result)), r());
              },
              i = () => {
                (n(e.error), r());
              };
            (e.addEventListener("success", o), e.addEventListener("error", i));
          });
          return (p.set(t, e), t);
        })(e);
      if (d.has(e)) return d.get(e);
      const t = g(e);
      return (t !== e && (d.set(e, t), p.set(t, e)), t);
    }
    const y = e => p.get(e);
    const w = ["get", "getKey", "getAll", "getAllKeys", "count"],
      v = ["put", "add", "delete", "clear"],
      k = new Map();
    function x(e, t) {
      if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
      if (k.get(t)) return k.get(t);
      const n = t.replace(/FromIndex$/, ""),
        r = t !== n,
        o = v.includes(n);
      if (
        !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
        (!o && !w.includes(n))
      )
        return;
      const i = async function (e, ...t) {
        const i = this.transaction(e, o ? "readwrite" : "readonly");
        let s = i.store;
        return (
          r && (s = s.index(t.shift())),
          (await Promise.all([s[n](...t), o && i.done]))[0]
        );
      };
      return (k.set(t, i), i);
    }
    f(e => ({
      ...e,
      get: (t, n, r) => x(t, n) || e.get(t, n, r),
      has: (t, n) => !!x(t, n) || e.has(t, n),
    }));
    const $ = ["continue", "continuePrimaryKey", "advance"],
      E = {},
      S = new WeakMap(),
      _ = new WeakMap(),
      C = {
        get(e, t) {
          if (!$.includes(t)) return e[t];
          let n = E[t];
          return (
            n ||
              (n = E[t] =
                function (...e) {
                  S.set(this, _.get(this)[t](...e));
                }),
            n
          );
        },
      };
    async function* L(...e) {
      let t = this;
      if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t))
        return;
      const n = new Proxy(t, C);
      for (_.set(n, t), p.set(n, y(t)); t; )
        (yield n, (t = await (S.get(n) || t.continue())), S.delete(n));
    }
    function A(e, t) {
      return (
        (t === Symbol.asyncIterator &&
          a(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        ("iterate" === t && a(e, [IDBIndex, IDBObjectStore]))
      );
    }
    f(e => ({
      ...e,
      get: (t, n, r) => (A(t, n) ? L : e.get(t, n, r)),
      has: (t, n) => A(t, n) || e.has(t, n),
    }));
    var T,
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
          { blocked: n, upgrade: r, blocking: o, terminated: i } = {}
        ) {
          const s = indexedDB.open(e, t),
            a = b(s);
          return (
            r &&
              s.addEventListener("upgradeneeded", e => {
                r(b(s.result), e.oldVersion, e.newVersion, b(s.transaction), e);
              }),
            n &&
              s.addEventListener("blocked", e =>
                n(e.oldVersion, e.newVersion, e)
              ),
            a
              .then(e => {
                (i && e.addEventListener("close", () => i()),
                  o &&
                    e.addEventListener("versionchange", e =>
                      o(e.oldVersion, e.newVersion, e)
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
    })(T || (T = {}));
    const O = Object.entries(T).reduce((e, [t, n]) => ((e[n] = t), e), {});
    new (class {
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
          case T.IDENT:
          case T.COMMENT:
          case T.NUMBER:
          case T.FLOAT:
            e += this.literal;
            break;
          case T.STRING:
            e += '"' + this.literal + '"';
            break;
          case T.CTLOP:
            e += "." + this.literal;
            break;
          case T.BYTES:
            e += "'" + this.literal + "'";
            break;
          case T.HEX:
            e += "h'" + this.literal + "'";
            break;
          case T.BASE64:
            e += "b64'" + this.literal + "'";
            break;
          case T.EOF:
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
          `${"  ".repeat(e)}${this.constructor.name}: ${O[this.type]} (${this.type})`,
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
    })(T.ILLEGAL, "");
    const N = /^[!#$%&'*+-.^`|~\w]+$/,
      P = /[\u000A\u000D\u0009\u0020]/u,
      I = /^[\u0009\u{0020}-\{u0073}\u{0080}-\u{00FF}]+$/u;
    function D(e, t, n) {
      ((t && "" !== t && !e.has(t) && I.test(n)) || null === n) &&
        e.set(t.toLowerCase(), n);
    }
    function j() {
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
    var z = {
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
    function M(e) {
      z = e;
    }
    var q = { exec: () => null };
    function H(e, t = "") {
      let n = "string" == typeof e ? e : e.source,
        r = {
          replace: (e, t) => {
            let o = "string" == typeof t ? t : t.source;
            return ((o = o.replace(F.caret, "$1")), (n = n.replace(e, o)), r);
          },
          getRegex: () => new RegExp(n, t),
        };
      return r;
    }
    var B = (() => {
        try {
          return !!new RegExp("(?<=1)(?<!1)");
        } catch {
          return !1;
        }
      })(),
      F = {
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
      W = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      U = / {0,3}(?:[*+-]|\d{1,9}[.)])/,
      G =
        /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      V = H(G)
        .replace(/bull/g, U)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/\|table/g, "")
        .getRegex(),
      Z = H(G)
        .replace(/bull/g, U)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/)
        .getRegex(),
      Y =
        /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      K = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,
      X = H(
        /^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/
      )
        .replace("label", K)
        .replace(
          "title",
          /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
        )
        .getRegex(),
      Q = H(/^(bull)([ \t][^\n]+?)?(?:\n|$)/)
        .replace(/bull/g, U)
        .getRegex(),
      J =
        "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
      ee = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
      te = H(
        "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))",
        "i"
      )
        .replace("comment", ee)
        .replace("tag", J)
        .replace(
          "attribute",
          / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
        )
        .getRegex(),
      ne = H(Y)
        .replace("hr", W)
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
        .replace("tag", J)
        .getRegex(),
      re = {
        blockquote: H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
          .replace("paragraph", ne)
          .getRegex(),
        code: /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,
        def: X,
        fences:
          /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        hr: W,
        html: te,
        lheading: V,
        list: Q,
        newline: /^(?:[ \t]*(?:\n|$))+/,
        paragraph: ne,
        table: q,
        text: /^[^\n]+/,
      },
      oe = H(
        "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
      )
        .replace("hr", W)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("blockquote", " {0,3}>")
        .replace("code", "(?: {4}| {0,3}\t)[^\\n]")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", J)
        .getRegex(),
      ie = {
        ...re,
        lheading: Z,
        table: oe,
        paragraph: H(Y)
          .replace("hr", W)
          .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
          .replace("|lheading", "")
          .replace("table", oe)
          .replace("blockquote", " {0,3}>")
          .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]")
          .replace(
            "html",
            "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
          )
          .replace("tag", J)
          .getRegex(),
      },
      se = {
        ...re,
        html: H(
          "^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))"
        )
          .replace("comment", ee)
          .replace(
            /tag/g,
            "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b"
          )
          .getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: q,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: H(Y)
          .replace("hr", W)
          .replace("heading", " *#{1,6} *[^\n]")
          .replace("lheading", V)
          .replace("|table", "")
          .replace("blockquote", " {0,3}>")
          .replace("|fences", "")
          .replace("|list", "")
          .replace("|html", "")
          .replace("|tag", "")
          .getRegex(),
      },
      ae = /^( {2,}|\\)\n(?!\s*$)/,
      le = /[\p{P}\p{S}]/u,
      ce = /[\s\p{P}\p{S}]/u,
      ue = /[^\s\p{P}\p{S}]/u,
      de = H(/^((?![*_])punctSpace)/, "u")
        .replace(/punctSpace/g, ce)
        .getRegex(),
      pe = /(?!~)[\p{P}\p{S}]/u,
      he = H(/link|precode-code|html/, "g")
        .replace(
          "link",
          /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/
        )
        .replace("precode-", B ? "(?<!`)()" : "(^^|[^`])")
        .replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/)
        .replace("html", /<(?! )[^<>]*?>/)
        .getRegex(),
      fe = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,
      me = H(fe, "u").replace(/punct/g, le).getRegex(),
      ge = H(fe, "u").replace(/punct/g, pe).getRegex(),
      be =
        "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",
      ye = H(be, "gu")
        .replace(/notPunctSpace/g, ue)
        .replace(/punctSpace/g, ce)
        .replace(/punct/g, le)
        .getRegex(),
      we = H(be, "gu")
        .replace(/notPunctSpace/g, /(?:[^\s\p{P}\p{S}]|~)/u)
        .replace(/punctSpace/g, /(?!~)[\s\p{P}\p{S}]/u)
        .replace(/punct/g, pe)
        .getRegex(),
      ve = H(
        "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
        "gu"
      )
        .replace(/notPunctSpace/g, ue)
        .replace(/punctSpace/g, ce)
        .replace(/punct/g, le)
        .getRegex(),
      ke = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u")
        .replace(/punct/g, le)
        .getRegex(),
      xe = H(
        "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",
        "gu"
      )
        .replace(/notPunctSpace/g, ue)
        .replace(/punctSpace/g, ce)
        .replace(/punct/g, le)
        .getRegex(),
      $e = H(/\\(punct)/, "gu")
        .replace(/punct/g, le)
        .getRegex(),
      Ee = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
        .replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
        .replace(
          "email",
          /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
        )
        .getRegex(),
      Se = H(ee).replace("(?:--\x3e|$)", "--\x3e").getRegex(),
      _e = H(
        "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
      )
        .replace("comment", Se)
        .replace(
          "attribute",
          /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
        )
        .getRegex(),
      Ce =
        /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,
      Le = H(
        /^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/
      )
        .replace("label", Ce)
        .replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/)
        .replace(
          "title",
          /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/
        )
        .getRegex(),
      Ae = H(/^!?\[(label)\]\[(ref)\]/)
        .replace("label", Ce)
        .replace("ref", K)
        .getRegex(),
      Te = H(/^!?\[(ref)\](?:\[\])?/)
        .replace("ref", K)
        .getRegex(),
      Re = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,
      Oe = {
        _backpedal: q,
        anyPunctuation: $e,
        autolink: Ee,
        blockSkip: he,
        br: ae,
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        del: q,
        delLDelim: q,
        delRDelim: q,
        emStrongLDelim: me,
        emStrongRDelimAst: ye,
        emStrongRDelimUnd: ve,
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        link: Le,
        nolink: Te,
        punctuation: de,
        reflink: Ae,
        reflinkSearch: H("reflink|nolink(?!\\()", "g")
          .replace("reflink", Ae)
          .replace("nolink", Te)
          .getRegex(),
        tag: _e,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        url: q,
      },
      Ne = {
        ...Oe,
        link: H(/^!?\[(label)\]\((.*?)\)/)
          .replace("label", Ce)
          .getRegex(),
        reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/)
          .replace("label", Ce)
          .getRegex(),
      },
      Pe = {
        ...Oe,
        emStrongRDelimAst: we,
        emStrongLDelim: ge,
        delLDelim: ke,
        delRDelim: xe,
        url: H(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
          .replace("protocol", Re)
          .replace(
            "email",
            /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/
          )
          .getRegex(),
        _backpedal:
          /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
        text: H(
          /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
        )
          .replace("protocol", Re)
          .getRegex(),
      },
      Ie = {
        ...Pe,
        br: H(ae).replace("{2,}", "*").getRegex(),
        text: H(Pe.text)
          .replace("\\b_", "\\b_| {2,}\\n")
          .replace(/\{2,\}/g, "*")
          .getRegex(),
      },
      De = { normal: re, gfm: ie, pedantic: se },
      je = { normal: Oe, gfm: Pe, breaks: Ie, pedantic: Ne },
      ze = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      },
      Me = e => ze[e];
    function qe(e, t) {
      if (t) {
        if (F.escapeTest.test(e)) return e.replace(F.escapeReplace, Me);
      } else if (F.escapeTestNoEncode.test(e))
        return e.replace(F.escapeReplaceNoEncode, Me);
      return e;
    }
    function He(e) {
      try {
        e = encodeURI(e).replace(F.percentDecode, "%");
      } catch {
        return null;
      }
      return e;
    }
    function Be(e, t) {
      let n = e
          .replace(F.findPipe, (e, t, n) => {
            let r = !1,
              o = t;
            for (; --o >= 0 && "\\" === n[o]; ) r = !r;
            return r ? "|" : " |";
          })
          .split(F.splitPipe),
        r = 0;
      if (
        (n[0].trim() || n.shift(),
        n.length > 0 && !n.at(-1)?.trim() && n.pop(),
        t)
      )
        if (n.length > t) n.splice(t);
        else for (; n.length < t; ) n.push("");
      for (; r < n.length; r++) n[r] = n[r].trim().replace(F.slashPipe, "|");
      return n;
    }
    function Fe(e, t, n) {
      let r = e.length;
      if (0 === r) return "";
      let o = 0;
      for (; o < r; ) {
        if (e.charAt(r - o - 1) !== t) break;
        o++;
      }
      return e.slice(0, r - o);
    }
    function We(e) {
      let t = e.split("\n"),
        n = t.length - 1;
      for (; n >= 0 && !t[n].trim(); ) n--;
      return t.length - n <= 2 ? e : t.slice(0, n + 1).join("\n");
    }
    function Ue(e, t = 0) {
      let n = t,
        r = "";
      for (let t of e)
        if ("\t" === t) {
          let e = 4 - (n % 4);
          ((r += " ".repeat(e)), (n += e));
        } else ((r += t), n++);
      return r;
    }
    function Ge(e, t, n, r, o) {
      let i = t.href,
        s = t.title || null,
        a = e[1].replace(o.other.outputLinkReplace, "$1");
      r.state.inLink = !0;
      let l = {
        type: "!" === e[0].charAt(0) ? "image" : "link",
        raw: n,
        href: i,
        title: s,
        text: a,
        tokens: r.inlineTokens(a),
      };
      return ((r.state.inLink = !1), l);
    }
    var Ve = class {
        options;
        rules;
        lexer;
        constructor(e) {
          this.options = e || z;
        }
        space(e) {
          let t = this.rules.block.newline.exec(e);
          if (t && t[0].length > 0) return { type: "space", raw: t[0] };
        }
        code(e) {
          let t = this.rules.block.code.exec(e);
          if (t) {
            let e = this.options.pedantic ? t[0] : We(t[0]),
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
                let o = r[1];
                return t
                  .split("\n")
                  .map(e => {
                    let t = e.match(n.other.beginningSpace);
                    if (null === t) return e;
                    let [r] = t;
                    return r.length >= o.length ? e.slice(o.length) : e;
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
              let t = Fe(e, "#");
              (this.options.pedantic ||
                !t ||
                this.rules.other.endingSpaceChar.test(t)) &&
                (e = t.trim());
            }
            return {
              type: "heading",
              raw: Fe(t[0], "\n"),
              depth: t[1].length,
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        hr(e) {
          let t = this.rules.block.hr.exec(e);
          if (t) return { type: "hr", raw: Fe(t[0], "\n") };
        }
        blockquote(e) {
          let t = this.rules.block.blockquote.exec(e);
          if (t) {
            let e = Fe(t[0], "\n").split("\n"),
              n = "",
              r = "",
              o = [];
            for (; e.length > 0; ) {
              let t,
                i = !1,
                s = [];
              for (t = 0; t < e.length; t++)
                if (this.rules.other.blockquoteStart.test(e[t]))
                  (s.push(e[t]), (i = !0));
                else {
                  if (i) break;
                  s.push(e[t]);
                }
              e = e.slice(t);
              let a = s.join("\n"),
                l = a
                  .replace(this.rules.other.blockquoteSetextReplace, "\n    $1")
                  .replace(this.rules.other.blockquoteSetextReplace2, "");
              ((n = n ? `${n}\n${a}` : a), (r = r ? `${r}\n${l}` : l));
              let c = this.lexer.state.top;
              if (
                ((this.lexer.state.top = !0),
                this.lexer.blockTokens(l, o, !0),
                (this.lexer.state.top = c),
                0 === e.length)
              )
                break;
              let u = o.at(-1);
              if ("code" === u?.type) break;
              if ("blockquote" === u?.type) {
                let t = u,
                  i = t.raw + "\n" + e.join("\n"),
                  s = this.blockquote(i);
                ((o[o.length - 1] = s),
                  (n = n.substring(0, n.length - t.raw.length) + s.raw),
                  (r = r.substring(0, r.length - t.text.length) + s.text));
                break;
              }
              if ("list" !== u?.type);
              else {
                let t = u,
                  i = t.raw + "\n" + e.join("\n"),
                  s = this.list(i);
                ((o[o.length - 1] = s),
                  (n = n.substring(0, n.length - u.raw.length) + s.raw),
                  (r = r.substring(0, r.length - t.raw.length) + s.raw),
                  (e = i.substring(o.at(-1).raw.length).split("\n")));
              }
            }
            return { type: "blockquote", raw: n, tokens: o, text: r };
          }
        }
        list(e) {
          let t = this.rules.block.list.exec(e);
          if (t) {
            let n = t[1].trim(),
              r = n.length > 1,
              o = {
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
              s = !1;
            for (; e; ) {
              let n = !1,
                r = "",
                a = "";
              if (!(t = i.exec(e)) || this.rules.block.hr.test(e)) break;
              ((r = t[0]), (e = e.substring(r.length)));
              let l = Ue(t[2].split("\n", 1)[0], t[1].length),
                c = e.split("\n", 1)[0],
                u = !l.trim(),
                d = 0;
              if (
                (this.options.pedantic
                  ? ((d = 2), (a = l.trimStart()))
                  : u
                    ? (d = t[1].length + 1)
                    : ((d = l.search(this.rules.other.nonSpaceChar)),
                      (d = d > 4 ? 1 : d),
                      (a = l.slice(d)),
                      (d += t[1].length)),
                u &&
                  this.rules.other.blankLine.test(c) &&
                  ((r += c + "\n"), (e = e.substring(c.length + 1)), (n = !0)),
                !n)
              ) {
                let t = this.rules.other.nextBulletRegex(d),
                  n = this.rules.other.hrRegex(d),
                  o = this.rules.other.fencesBeginRegex(d),
                  i = this.rules.other.headingBeginRegex(d),
                  s = this.rules.other.htmlBeginRegex(d),
                  p = this.rules.other.blockquoteBeginRegex(d);
                for (; e; ) {
                  let h,
                    f = e.split("\n", 1)[0];
                  if (
                    ((c = f),
                    this.options.pedantic
                      ? ((c = c.replace(
                          this.rules.other.listReplaceNesting,
                          "  "
                        )),
                        (h = c))
                      : (h = c.replace(this.rules.other.tabCharGlobal, "    ")),
                    o.test(c) ||
                      i.test(c) ||
                      s.test(c) ||
                      p.test(c) ||
                      t.test(c) ||
                      n.test(c))
                  )
                    break;
                  if (h.search(this.rules.other.nonSpaceChar) >= d || !c.trim())
                    a += "\n" + h.slice(d);
                  else {
                    if (
                      u ||
                      l
                        .replace(this.rules.other.tabCharGlobal, "    ")
                        .search(this.rules.other.nonSpaceChar) >= 4 ||
                      o.test(l) ||
                      i.test(l) ||
                      n.test(l)
                    )
                      break;
                    a += "\n" + c;
                  }
                  ((u = !c.trim()),
                    (r += f + "\n"),
                    (e = e.substring(f.length + 1)),
                    (l = h.slice(d)));
                }
              }
              (o.loose ||
                (s
                  ? (o.loose = !0)
                  : this.rules.other.doubleBlankLine.test(r) && (s = !0)),
                o.items.push({
                  type: "list_item",
                  raw: r,
                  task:
                    !!this.options.gfm && this.rules.other.listIsTask.test(a),
                  loose: !1,
                  text: a,
                  tokens: [],
                }),
                (o.raw += r));
            }
            let a = o.items.at(-1);
            if (!a) return;
            ((a.raw = a.raw.trimEnd()),
              (a.text = a.text.trimEnd()),
              (o.raw = o.raw.trimEnd()));
            for (let e of o.items) {
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
                    o.loose
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
              if (!o.loose) {
                let t = e.tokens.filter(e => "space" === e.type),
                  n =
                    t.length > 0 &&
                    t.some(e => this.rules.other.anyLine.test(e.raw));
                o.loose = n;
              }
            }
            if (o.loose)
              for (let e of o.items) {
                e.loose = !0;
                for (let t of e.tokens)
                  "text" === t.type && (t.type = "paragraph");
              }
            return o;
          }
        }
        html(e) {
          let t = this.rules.block.html.exec(e);
          if (t) {
            let e = We(t[0]);
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
              raw: Fe(t[0], "\n"),
              href: n,
              title: r,
            };
          }
        }
        table(e) {
          let t = this.rules.block.table.exec(e);
          if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
          let n = Be(t[1]),
            r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"),
            o = t[3]?.trim()
              ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n")
              : [],
            i = {
              type: "table",
              raw: Fe(t[0], "\n"),
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
            for (let e of o)
              i.rows.push(
                Be(e, i.header.length).map((e, t) => ({
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
              raw: Fe(t[0], "\n"),
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
              let t = Fe(e.slice(0, -1), "\\");
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
              Ge(
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
            return Ge(n, e, n[0], this.lexer, this.rules);
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
              o,
              i = [...r[0]].length - 1,
              s = i,
              a = 0,
              l =
                "*" === r[0][0]
                  ? this.rules.inline.emStrongRDelimAst
                  : this.rules.inline.emStrongRDelimUnd;
            for (
              l.lastIndex = 0, t = t.slice(-1 * e.length + i);
              null !== (r = l.exec(t));
            ) {
              if (((n = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]), !n))
                continue;
              if (((o = [...n].length), r[3] || r[4])) {
                s += o;
                continue;
              }
              if ((r[5] || r[6]) && i % 3 && !((i + o) % 3)) {
                a += o;
                continue;
              }
              if (((s -= o), s > 0)) continue;
              o = Math.min(o, o + s + a);
              let t = [...r[0]][0].length,
                l = e.slice(0, i + r.index + t + o);
              if (Math.min(i, o) % 2) {
                let e = l.slice(1, -1);
                return {
                  type: "em",
                  raw: l,
                  text: e,
                  tokens: this.lexer.inlineTokens(e),
                };
              }
              let c = l.slice(2, -2);
              return {
                type: "strong",
                raw: l,
                text: c,
                tokens: this.lexer.inlineTokens(c),
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
              o,
              i = [...r[0]].length - 1,
              s = i,
              a = this.rules.inline.delRDelim;
            for (
              a.lastIndex = 0, t = t.slice(-1 * e.length + i);
              null !== (r = a.exec(t));
            ) {
              if (
                ((n = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]),
                !n || ((o = [...n].length), o !== i))
              )
                continue;
              if (r[3] || r[4]) {
                s += o;
                continue;
              }
              if (((s -= o), s > 0)) continue;
              o = Math.min(o, o + s);
              let t = [...r[0]][0].length,
                a = e.slice(0, i + r.index + t + o),
                l = a.slice(i, -i);
              return {
                type: "del",
                raw: a,
                text: l,
                tokens: this.lexer.inlineTokens(l),
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
      Ze = class e {
        tokens;
        options;
        state;
        inlineQueue;
        tokenizer;
        constructor(e) {
          ((this.tokens = []),
            (this.tokens.links = Object.create(null)),
            (this.options = e || z),
            (this.options.tokenizer = this.options.tokenizer || new Ve()),
            (this.tokenizer = this.options.tokenizer),
            (this.tokenizer.options = this.options),
            (this.tokenizer.lexer = this),
            (this.inlineQueue = []),
            (this.state = { inLink: !1, inRawBlock: !1, top: !0 }));
          let t = { other: F, block: De.normal, inline: je.normal };
          (this.options.pedantic
            ? ((t.block = De.pedantic), (t.inline = je.pedantic))
            : this.options.gfm &&
              ((t.block = De.gfm),
              this.options.breaks
                ? (t.inline = je.breaks)
                : (t.inline = je.gfm)),
            (this.tokenizer.rules = t));
        }
        static get rules() {
          return { block: De, inline: je };
        }
        static lex(t, n) {
          return new e(n).lex(t);
        }
        static lexInline(t, n) {
          return new e(n).inlineTokens(t);
        }
        lex(e) {
          ((e = e.replace(F.carriageReturn, "\n")),
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
                  .replace(F.tabCharGlobal, "    ")
                  .replace(F.spaceLine, ""));
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
            let o = e;
            if (this.options.extensions?.startBlock) {
              let t,
                n = 1 / 0,
                r = e.slice(1);
              (this.options.extensions.startBlock.forEach(e => {
                ((t = e.call({ lexer: this }, r)),
                  "number" == typeof t && t >= 0 && (n = Math.min(n, t)));
              }),
                n < 1 / 0 && n >= 0 && (o = e.substring(0, n + 1)));
            }
            if (this.state.top && (r = this.tokenizer.paragraph(o))) {
              let i = t.at(-1);
              (n && "paragraph" === i?.type
                ? ((i.raw += (i.raw.endsWith("\n") ? "" : "\n") + r.raw),
                  (i.text += "\n" + r.text),
                  this.inlineQueue.pop(),
                  (this.inlineQueue.at(-1).src = i.text))
                : t.push(r),
                (n = o.length !== e.length),
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
            o = null;
          if (this.tokens.links) {
            let e = Object.keys(this.tokens.links);
            if (e.length > 0)
              for (
                ;
                null !==
                (o = this.tokenizer.rules.inline.reflinkSearch.exec(r));
              )
                e.includes(o[0].slice(o[0].lastIndexOf("[") + 1, -1)) &&
                  (r =
                    r.slice(0, o.index) +
                    "[" +
                    "a".repeat(o[0].length - 2) +
                    "]" +
                    r.slice(
                      this.tokenizer.rules.inline.reflinkSearch.lastIndex
                    ));
          }
          for (
            ;
            null !== (o = this.tokenizer.rules.inline.anyPunctuation.exec(r));
          )
            r =
              r.slice(0, o.index) +
              "++" +
              r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
          for (; null !== (o = this.tokenizer.rules.inline.blockSkip.exec(r)); )
            ((n = o[2] ? o[2].length : 0),
              (r =
                r.slice(0, o.index + n) +
                "[" +
                "a".repeat(o[0].length - n - 2) +
                "]" +
                r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex)));
          r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
          let i = !1,
            s = "";
          for (; e; ) {
            let n;
            if (
              (i || (s = ""),
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
            if ((n = this.tokenizer.emStrong(e, r, s))) {
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
            if ((n = this.tokenizer.del(e, r, s))) {
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
            let o = e;
            if (this.options.extensions?.startInline) {
              let t,
                n = 1 / 0,
                r = e.slice(1);
              (this.options.extensions.startInline.forEach(e => {
                ((t = e.call({ lexer: this }, r)),
                  "number" == typeof t && t >= 0 && (n = Math.min(n, t)));
              }),
                n < 1 / 0 && n >= 0 && (o = e.substring(0, n + 1)));
            }
            if ((n = this.tokenizer.inlineText(o))) {
              ((e = e.substring(n.raw.length)),
                "_" !== n.raw.slice(-1) && (s = n.raw.slice(-1)),
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
      Ye = class {
        options;
        parser;
        constructor(e) {
          this.options = e || z;
        }
        space(e) {
          return "";
        }
        code({ text: e, lang: t, escaped: n }) {
          let r = (t || "").match(F.notSpaceStart)?.[0],
            o = e.replace(F.endingNewline, "") + "\n";
          return r
            ? '<pre><code class="language-' +
                qe(r) +
                '">' +
                (n ? o : qe(o, !0)) +
                "</code></pre>\n"
            : "<pre><code>" + (n ? o : qe(o, !0)) + "</code></pre>\n";
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
          let o = t ? "ol" : "ul";
          return (
            "<" +
            o +
            (t && 1 !== n ? ' start="' + n + '"' : "") +
            ">\n" +
            r +
            "</" +
            o +
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
            let o = e.rows[t];
            n = "";
            for (let e = 0; e < o.length; e++) n += this.tablecell(o[e]);
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
          return `<code>${qe(e, !0)}</code>`;
        }
        br(e) {
          return "<br>";
        }
        del({ tokens: e }) {
          return `<del>${this.parser.parseInline(e)}</del>`;
        }
        link({ href: e, title: t, tokens: n }) {
          let r = this.parser.parseInline(n),
            o = He(e);
          if (null === o) return r;
          let i = '<a href="' + (e = o) + '"';
          return (
            t && (i += ' title="' + qe(t) + '"'),
            (i += ">" + r + "</a>"),
            i
          );
        }
        image({ href: e, title: t, text: n, tokens: r }) {
          r && (n = this.parser.parseInline(r, this.parser.textRenderer));
          let o = He(e);
          if (null === o) return qe(n);
          let i = `<img src="${(e = o)}" alt="${qe(n)}"`;
          return (t && (i += ` title="${qe(t)}"`), (i += ">"), i);
        }
        text(e) {
          return "tokens" in e && e.tokens
            ? this.parser.parseInline(e.tokens)
            : "escaped" in e && e.escaped
              ? e.text
              : qe(e.text);
        }
      },
      Ke = class {
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
      Xe = class e {
        options;
        renderer;
        textRenderer;
        constructor(e) {
          ((this.options = e || z),
            (this.options.renderer = this.options.renderer || new Ye()),
            (this.renderer = this.options.renderer),
            (this.renderer.options = this.options),
            (this.renderer.parser = this),
            (this.textRenderer = new Ke()));
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
            let o = r;
            switch (o.type) {
              case "space":
                t += this.renderer.space(o);
                break;
              case "hr":
                t += this.renderer.hr(o);
                break;
              case "heading":
                t += this.renderer.heading(o);
                break;
              case "code":
                t += this.renderer.code(o);
                break;
              case "table":
                t += this.renderer.table(o);
                break;
              case "blockquote":
                t += this.renderer.blockquote(o);
                break;
              case "list":
                t += this.renderer.list(o);
                break;
              case "checkbox":
                t += this.renderer.checkbox(o);
                break;
              case "html":
                t += this.renderer.html(o);
                break;
              case "def":
                t += this.renderer.def(o);
                break;
              case "paragraph":
                t += this.renderer.paragraph(o);
                break;
              case "text":
                t += this.renderer.text(o);
                break;
              default: {
                let e = 'Token with "' + o.type + '" type was not found.';
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
            let o = e[r];
            if (this.options.extensions?.renderers?.[o.type]) {
              let e = this.options.extensions.renderers[o.type].call(
                { parser: this },
                o
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
                ].includes(o.type)
              ) {
                n += e || "";
                continue;
              }
            }
            let i = o;
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
      Qe = class {
        options;
        block;
        constructor(e) {
          this.options = e || z;
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
          return e ? Ze.lex : Ze.lexInline;
        }
        provideParser(e = this.block) {
          return e ? Xe.parse : Xe.parseInline;
        }
      },
      Je = new (class {
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
        Parser = Xe;
        Renderer = Ye;
        TextRenderer = Ke;
        Lexer = Ze;
        Tokenizer = Ve;
        Hooks = Qe;
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
                      let o = e[r].flat(1 / 0);
                      n = n.concat(this.walkTokens(o, t));
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
                let t = this.defaults.renderer || new Ye(this.defaults);
                for (let n in e.renderer) {
                  if (!(n in t))
                    throw new Error(`renderer '${n}' does not exist`);
                  if (["options", "parser"].includes(n)) continue;
                  let r = n,
                    o = e.renderer[r],
                    i = t[r];
                  t[r] = (...e) => {
                    let n = o.apply(t, e);
                    return (!1 === n && (n = i.apply(t, e)), n || "");
                  };
                }
                n.renderer = t;
              }
              if (e.tokenizer) {
                let t = this.defaults.tokenizer || new Ve(this.defaults);
                for (let n in e.tokenizer) {
                  if (!(n in t))
                    throw new Error(`tokenizer '${n}' does not exist`);
                  if (["options", "rules", "lexer"].includes(n)) continue;
                  let r = n,
                    o = e.tokenizer[r],
                    i = t[r];
                  t[r] = (...e) => {
                    let n = o.apply(t, e);
                    return (!1 === n && (n = i.apply(t, e)), n);
                  };
                }
                n.tokenizer = t;
              }
              if (e.hooks) {
                let t = this.defaults.hooks || new Qe();
                for (let n in e.hooks) {
                  if (!(n in t)) throw new Error(`hook '${n}' does not exist`);
                  if (["options", "block"].includes(n)) continue;
                  let r = n,
                    o = e.hooks[r],
                    i = t[r];
                  Qe.passThroughHooks.has(n)
                    ? (t[r] = e => {
                        if (
                          this.defaults.async &&
                          Qe.passThroughHooksRespectAsync.has(n)
                        )
                          return (async () => {
                            let n = await o.call(t, e);
                            return i.call(t, n);
                          })();
                        let r = o.call(t, e);
                        return i.call(t, r);
                      })
                    : (t[r] = (...e) => {
                        if (this.defaults.async)
                          return (async () => {
                            let n = await o.apply(t, e);
                            return (!1 === n && (n = await i.apply(t, e)), n);
                          })();
                        let n = o.apply(t, e);
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
          return Ze.lex(e, t ?? this.defaults);
        }
        parser(e, t) {
          return Xe.parse(e, t ?? this.defaults);
        }
        parseMarkdown(e) {
          return (t, n) => {
            let r = { ...n },
              o = { ...this.defaults, ...r },
              i = this.onError(!!o.silent, !!o.async);
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
              (o.hooks && ((o.hooks.options = o), (o.hooks.block = e)), o.async)
            )
              return (async () => {
                let n = o.hooks ? await o.hooks.preprocess(t) : t,
                  r = await (
                    o.hooks
                      ? await o.hooks.provideLexer(e)
                      : e
                        ? Ze.lex
                        : Ze.lexInline
                  )(n, o),
                  i = o.hooks ? await o.hooks.processAllTokens(r) : r;
                o.walkTokens &&
                  (await Promise.all(this.walkTokens(i, o.walkTokens)));
                let s = await (
                  o.hooks
                    ? await o.hooks.provideParser(e)
                    : e
                      ? Xe.parse
                      : Xe.parseInline
                )(i, o);
                return o.hooks ? await o.hooks.postprocess(s) : s;
              })().catch(i);
            try {
              o.hooks && (t = o.hooks.preprocess(t));
              let n = (
                o.hooks ? o.hooks.provideLexer(e) : e ? Ze.lex : Ze.lexInline
              )(t, o);
              (o.hooks && (n = o.hooks.processAllTokens(n)),
                o.walkTokens && this.walkTokens(n, o.walkTokens));
              let r = (
                o.hooks
                  ? o.hooks.provideParser(e)
                  : e
                    ? Xe.parse
                    : Xe.parseInline
              )(n, o);
              return (o.hooks && (r = o.hooks.postprocess(r)), r);
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
                qe(n.message + "", !0) +
                "</pre>";
              return t ? Promise.resolve(e) : e;
            }
            if (t) return Promise.reject(n);
            throw n;
          };
        }
      })();
    function et(e, t) {
      return Je.parse(e, t);
    }
    function tt(e) {
      return e &&
        e.__esModule &&
        Object.prototype.hasOwnProperty.call(e, "default")
        ? e.default
        : e;
    }
    ((et.options = et.setOptions =
      function (e) {
        return (
          Je.setOptions(e),
          (et.defaults = Je.defaults),
          M(et.defaults),
          et
        );
      }),
      (et.getDefaults = j),
      (et.defaults = z),
      (et.use = function (...e) {
        return (Je.use(...e), (et.defaults = Je.defaults), M(et.defaults), et);
      }),
      (et.walkTokens = function (e, t) {
        return Je.walkTokens(e, t);
      }),
      (et.parseInline = Je.parseInline),
      (et.Parser = Xe),
      (et.parser = Xe.parse),
      (et.Renderer = Ye),
      (et.TextRenderer = Ke),
      (et.Lexer = Ze),
      (et.lexer = Ze.lex),
      (et.Tokenizer = Ve),
      (et.Hooks = Qe),
      (et.parse = et),
      et.options,
      et.setOptions,
      et.use,
      et.walkTokens,
      et.parseInline,
      Xe.parse,
      Ze.lex);
    var nt,
      rt = { exports: {} };
    var ot,
      it =
        (nt ||
          ((nt = 1),
          (ot = rt),
          (function (e, t) {
            ot.exports = t();
          })(0, function () {
            var e = [],
              t = [],
              n = {},
              r = {},
              o = {};
            function i(e) {
              return "string" == typeof e ? new RegExp("^" + e + "$", "i") : e;
            }
            function s(e, t) {
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
                var o,
                  i,
                  a =
                    ((o = t[1]),
                    (i = arguments),
                    o.replace(/\$(\d{1,2})/g, function (e, t) {
                      return i[t] || "";
                    }));
                return s("" === n ? e[r - 1] : n, a);
              });
            }
            function l(e, t, r) {
              if (!e.length || n.hasOwnProperty(e)) return t;
              for (var o = r.length; o--; ) {
                var i = r[o];
                if (i[0].test(t)) return a(t, i);
              }
              return t;
            }
            function c(e, t, n) {
              return function (r) {
                var o = r.toLowerCase();
                return t.hasOwnProperty(o)
                  ? s(r, o)
                  : e.hasOwnProperty(o)
                    ? s(r, e[o])
                    : l(o, r, n);
              };
            }
            function u(e, t, n, r) {
              return function (r) {
                var o = r.toLowerCase();
                return (
                  !!t.hasOwnProperty(o) ||
                  (!e.hasOwnProperty(o) && l(o, o, n) === o)
                );
              };
            }
            function d(e, t, n) {
              return (
                (n ? t + " " : "") + (1 === t ? d.singular(e) : d.plural(e))
              );
            }
            return (
              (d.plural = c(o, r, e)),
              (d.isPlural = u(o, r, e)),
              (d.singular = c(r, o, t)),
              (d.isSingular = u(r, o, t)),
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
                  (o[e] = t),
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
        rt.exports),
      st = tt(it),
      at = (function (e) {
        var t = {};
        try {
          t.WeakMap = WeakMap;
        } catch (u) {
          t.WeakMap = (function (e, t) {
            var n = t.defineProperty,
              r = t.hasOwnProperty,
              o = i.prototype;
            return (
              (o.delete = function (e) {
                return this.has(e) && delete e[this._];
              }),
              (o.get = function (e) {
                return this.has(e) ? e[this._] : void 0;
              }),
              (o.has = function (e) {
                return r.call(e, this._);
              }),
              (o.set = function (e, t) {
                return (n(e, this._, { configurable: !0, value: t }), this);
              }),
              i
            );
            function i(t) {
              (n(this, "_", { value: "_@ungap/weakmap" + e++ }),
                t && t.forEach(s, this));
            }
            function s(e) {
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
            var n = o.prototype;
            function o() {
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
              (r.WeakSet = o));
          })(Math.random(), Object.defineProperty);
        }
        function o(e, t, n, r, o, i) {
          for (var s = ("selectedIndex" in t), a = s; r < o; ) {
            var l,
              c = e(n[r], 1);
            (t.insertBefore(c, i),
              s &&
                a &&
                c.selected &&
                ((a = !a),
                (l = t.selectedIndex),
                (t.selectedIndex =
                  l < 0 ? r : d.call(t.querySelectorAll("option"), c))),
              r++);
          }
        }
        function i(e, t) {
          return e == t;
        }
        function s(e) {
          return e;
        }
        function a(e, t, n, r, o, i, s) {
          var a = i - o;
          if (a < 1) return -1;
          for (; a <= n - t; ) {
            for (var l = t, c = o; l < n && c < i && s(e[l], r[c]); )
              (l++, c++);
            if (c === i) return t;
            t = l + 1;
          }
          return -1;
        }
        function l(e, t, n, r, o) {
          return n < r ? e(t[n], 0) : 0 < n ? e(t[n - 1], -0).nextSibling : o;
        }
        function c(e, t, n, r) {
          for (; n < r; ) h(e(t[n++], -1));
        }
        var u = r.WeakSet,
          d = [].indexOf,
          p = function (e, t, n) {
            for (var r = 1, o = t; r < o; ) {
              var i = ((r + o) / 2) >>> 0;
              n < e[i] ? (o = i) : (r = 1 + i);
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
              d = r.node || s,
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
            v = y === b;
          if (w && v) return n;
          if (w && y < b) return (o(d, e, n, y, b, l(d, t, g, f, h)), n);
          if (v && g < m) return (c(d, t, g, m), n);
          var k = m - g,
            x = b - y,
            $ = -1;
          if (k < x) {
            if (-1 < ($ = a(n, y, b, t, g, m, u)))
              return (
                o(d, e, n, y, $, d(t[g], 0)),
                o(d, e, n, $ + k, b, l(d, t, m, f, h)),
                n
              );
          } else if (x < k && -1 < ($ = a(t, g, m, n, y, b, u)))
            return (c(d, t, g, $), c(d, t, $ + x, m), n);
          return (
            k < 2 || x < 2
              ? (o(d, e, n, y, b, d(t[g], 0)), c(d, t, g, m))
              : k == x &&
                  (function (e, t, n, r, o, i) {
                    for (; r < o && i(n[r], e[t - 1]); ) (r++, t--);
                    return 0 === t;
                  })(n, b, t, g, m, u)
                ? o(d, e, n, y, b, l(d, t, m, f, h))
                : (function (e, t, n, r, i, s, a, l, u, d, h, f, m) {
                    !(function (e, t, n, r, i, s, a, l, u) {
                      for (var d = [], p = e.length, h = a, f = 0; f < p; )
                        switch (e[f++]) {
                          case 0:
                            (i++, h++);
                            break;
                          case 1:
                            (d.push(r[i]),
                              o(t, n, r, i++, i, h < l ? t(s[h], 0) : u));
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
                            -1 < d.indexOf(s[a]) ? a++ : c(t, s, a++, a);
                        }
                    })(
                      (function (e, t, n, r, o, i, s) {
                        var a,
                          l,
                          c,
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
                              l =
                                (c =
                                  a === -b ||
                                  (a !== b && u[p + a - 1] < u[p + a + 1])
                                    ? u[p + a + 1]
                                    : u[p + a - 1] + 1) - a;
                              c < i && l < n && s(r[o + c], e[t + l]);
                            )
                              (c++, l++);
                            if (c === i && l === n) break e;
                            d[b + a] = c;
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
                            0 < c && 0 < l && s(r[o + c - 1], e[t + l - 1]);
                          )
                            ((m[g--] = 0), c--, l--);
                          if (!b) break;
                          ((p = b - 1),
                            (u = b ? f[b - 1] : [0, 0]),
                            (a = c - l) == -b ||
                            (a !== b && u[p + a - 1] < u[p + a + 1])
                              ? (l--, (m[g--] = 1))
                              : (c--, (m[g--] = -1)));
                        }
                        return m;
                      })(n, r, s, a, l, d, f) ||
                        (function (e, t, n, r, o, i, s, a) {
                          var l = 0,
                            c = r < a ? r : a,
                            u = Array(c++),
                            d = Array(c);
                          d[0] = -1;
                          for (var h = 1; h < c; h++) d[h] = s;
                          for (var f = o.slice(i, s), m = t; m < n; m++) {
                            var g,
                              b = f.indexOf(e[m]);
                            -1 < b &&
                              -1 < (l = p(d, c, (g = b + i))) &&
                              ((d[l] = g),
                              (u[l] = { newi: m, oldi: g, prev: u[l - 1] }));
                          }
                          for (l = --c, --s; d[l] > s; ) --l;
                          c = a + r - l;
                          var y = Array(c),
                            w = u[l];
                          for (--n; w; ) {
                            for (var v = w.newi, k = w.oldi; v < n; )
                              ((y[--c] = 1), --n);
                            for (; k < s; ) ((y[--c] = -1), --s);
                            ((y[--c] = 0), --n, --s, (w = w.prev));
                          }
                          for (; t <= n; ) ((y[--c] = 1), --n);
                          for (; i <= s; ) ((y[--c] = -1), --s);
                          return y;
                        })(n, r, i, s, a, l, u, d),
                      e,
                      t,
                      n,
                      r,
                      a,
                      l,
                      h,
                      m
                    );
                  })(d, e, n, y, b, x, t, g, m, k, f, u, h),
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
              delete: function (o) {
                var i = r(o);
                return (i && (t.splice(e, 1), n.splice(e, 1)), i);
              },
              forEach: function (e, r) {
                t.forEach(function (t, o) {
                  e.call(r, n[o], t, this);
                }, this);
              },
              get: function (t) {
                return r(t) ? n[e] : void 0;
              },
              has: r,
              set: function (o, i) {
                return ((n[r(o) ? e : t.push(o) - 1] = i), this);
              },
            };
            function r(n) {
              return -1 < (e = t.indexOf(n));
            }
          };
        }
        var w = y.Map;
        function v() {
          return this;
        }
        function k(e, t) {
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
        Object.defineProperties(v.prototype, {
          ELEMENT_NODE: { value: 1 },
          nodeType: { value: -1 },
        });
        var $,
          E,
          S,
          _,
          C,
          L,
          A = {},
          T = {},
          R = [],
          O = T.hasOwnProperty,
          N = 0,
          P = {
            attributes: A,
            define: function (e, t) {
              e.indexOf("-") < 0
                ? (e in T || (N = R.push(e)), (T[e] = t))
                : (A[e] = t);
            },
            invoke: function (e, t) {
              for (var n = 0; n < N; n++) {
                var r = R[n];
                if (O.call(e, r)) return T[r](e[r], t);
              }
            },
          },
          I =
            Array.isArray ||
            ((E = ($ = {}.toString).call([])),
            function (e) {
              return $.call(e) === E;
            }),
          D =
            ((S = e),
            (_ = "fragment"),
            (L =
              "content" in z((C = "template"))
                ? function (e) {
                    var t = z(C);
                    return ((t.innerHTML = e), t.content);
                  }
                : function (e) {
                    var t,
                      n = z(_),
                      r = z(C);
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
                      var t = z(_),
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
                  : L
              )(e);
            });
        function j(e, t) {
          for (var n = t.length; n--; ) e.appendChild(t[0]);
        }
        function z(e) {
          return e === _
            ? S.createDocumentFragment()
            : S.createElementNS("http://www.w3.org/1999/xhtml", e);
        }
        var M,
          q,
          H,
          B,
          F,
          W,
          U,
          G,
          V,
          Z =
            ((q = "appendChild"),
            (H = "cloneNode"),
            (B = "createTextNode"),
            (W = (F = "importNode") in (M = e)),
            (U = M.createDocumentFragment())[q](M[B]("g")),
            U[q](M[B]("")),
            (W ? M[F](U, !0) : U[H](!0)).childNodes.length < 2
              ? function e(t, n) {
                  for (
                    var r = t[H](), o = t.childNodes || [], i = o.length, s = 0;
                    n && s < i;
                    s++
                  )
                    r[q](e(o[s], n));
                  return r;
                }
              : W
                ? M[F]
                : function (e, t) {
                    return e[H](!!t);
                  }),
          Y =
            "".trim ||
            function () {
              return String(this).replace(/^\s+|\s+/g, "");
            },
          K = "-" + Math.random().toFixed(6) + "%",
          X = !1;
        try {
          ((G = e.createElement("template")),
            (V = "tabindex"),
            ("content" in G &&
              ((G.innerHTML = "<p " + V + '="' + K + '"></p>'),
              G.content.childNodes[0].getAttribute(V) == K)) ||
              ((K = "_dt: " + K.slice(1, -1) + ";"), (X = !0)));
        } catch (u) {}
        var Q = "\x3c!--" + K + "--\x3e",
          J = 8,
          ee = 1,
          te = 3,
          ne = /^(?:style|textarea)$/i,
          re =
            /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,
          oe = " \\f\\n\\r\\t",
          ie = "[^" + oe + "\\/>\"'=]+",
          se = "[" + oe + "]+" + ie,
          ae = "<([A-Za-z]+[A-Za-z0-9:._-]*)((?:",
          le =
            "(?:\\s*=\\s*(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|" +
            ie.replace("\\/", "") +
            "))?)",
          ce = new RegExp(ae + se + le + "+)([" + oe + "]*/?>)", "g"),
          ue = new RegExp(ae + se + le + "*)([" + oe + "]*/>)", "g"),
          de = new RegExp("(" + se + "\\s*=\\s*)(['\"]?)" + Q + "\\2", "gi");
        function pe(e, t, n, r) {
          return "<" + t + n.replace(de, he) + r;
        }
        function he(e, t, n) {
          return t + (n || '"') + K + (n || '"');
        }
        function fe(e, t, n) {
          return re.test(t) ? e : "<" + t + n + "></" + t + ">";
        }
        var me = X
          ? function (e, t) {
              var n = t.join(" ");
              return t.slice.call(e, 0).sort(function (e, t) {
                return n.indexOf(e.name) <= n.indexOf(t.name) ? -1 : 1;
              });
            }
          : function (e, t) {
              return t.slice.call(e, 0);
            };
        function ge(t, n, r, o) {
          for (var i = t.childNodes, s = i.length, a = 0; a < s; ) {
            var l = i[a];
            switch (l.nodeType) {
              case ee:
                var c = o.concat(a);
                (!(function (t, n, r, o) {
                  for (
                    var i,
                      s = t.attributes,
                      a = [],
                      l = [],
                      c = me(s, r),
                      u = c.length,
                      d = 0;
                    d < u;
                  ) {
                    var p = c[d++],
                      h = p.value === K;
                    if (h || 1 < (i = p.value.split(Q)).length) {
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
                          g = s[m] || s[m.toLowerCase()];
                        if (h) n.push(be(g, o, m, null));
                        else {
                          for (var b = i.length - 2; b--; ) r.shift();
                          n.push(be(g, o, m, i));
                        }
                      }
                      l.push(p);
                    }
                  }
                  for (
                    var y =
                      (d = 0) < (u = l.length) &&
                      X &&
                      !("ownerSVGElement" in t);
                    d < u;
                  ) {
                    var w = l[d++];
                    (y && (w.value = ""), t.removeAttribute(w.name));
                  }
                  var v = t.nodeName;
                  if (/^script$/i.test(v)) {
                    var k = e.createElement(v);
                    for (u = s.length, d = 0; d < u; )
                      k.setAttributeNode(s[d++].cloneNode(!0));
                    ((k.textContent = t.textContent),
                      t.parentNode.replaceChild(k, t));
                  }
                })(l, n, r, c),
                  ge(l, n, r, c));
                break;
              case J:
                var u = l.textContent;
                if (u === K)
                  (r.shift(),
                    n.push(
                      ne.test(t.nodeName)
                        ? ye(t, o)
                        : { type: "any", node: l, path: o.concat(a) }
                    ));
                else
                  switch (u.slice(0, 2)) {
                    case "/*":
                      if ("*/" !== u.slice(-2)) break;
                    case "👻":
                      (t.removeChild(l), a--, s--);
                  }
                break;
              case te:
                ne.test(t.nodeName) &&
                  Y.call(l.textContent) === Q &&
                  (r.shift(), n.push(ye(t, o)));
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
          ve =
            ((we = new n()),
            {
              get: function (e) {
                return we.get(e);
              },
              set: function (e, t) {
                return (we.set(e, t), t);
              },
            });
        function ke(e, t) {
          var n = (
              e.convert ||
              function (e) {
                return e.join(Q).replace(ue, fe).replace(ce, pe);
              }
            )(t),
            r = e.transform;
          r && (n = r(n));
          var o = D(n, e.type);
          $e(o);
          var i = [];
          return (
            ge(o, i, t.slice(0), []),
            {
              content: o,
              updates: function (n) {
                for (var r = [], o = i.length, s = 0, a = 0; s < o; ) {
                  var l = i[s++],
                    c = (function (e, t) {
                      for (var n = t.length, r = 0; r < n; )
                        e = e.childNodes[t[r++]];
                      return e;
                    })(n, l.path);
                  switch (l.type) {
                    case "any":
                      r.push({ fn: e.any(c, []), sparse: !1 });
                      break;
                    case "attr":
                      var u = l.sparse,
                        d = e.attribute(c, l.name, l.node);
                      null === u
                        ? r.push({ fn: d, sparse: !1 })
                        : ((a += u.length - 2),
                          r.push({ fn: d, sparse: !0, values: u }));
                      break;
                    case "text":
                      (r.push({ fn: e.text(c), sparse: !1 }),
                        (c.textContent = ""));
                  }
                }
                return (
                  (o += a),
                  function () {
                    var e = arguments.length;
                    if (o !== e - 1)
                      throw new Error(
                        e -
                          1 +
                          " values instead of " +
                          o +
                          "\n" +
                          t.join("${value}")
                      );
                    for (var i = 1, s = 1; i < e; ) {
                      var a = r[i - s];
                      if (a.sparse) {
                        var l = a.values,
                          c = l[0],
                          u = 1,
                          d = l.length;
                        for (s += d - 2; u < d; ) c += arguments[i++] + l[u++];
                        a.fn(c);
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
              0 === Y.call(r.textContent).length &&
              e.removeChild(r);
          }
        }
        var Ee,
          Se,
          _e =
            ((Ee = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i),
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
                      Le(n, !0)
                    );
                  })(e, t)
                : Le(e.style, !1);
            });
        function Ce(e, t, n) {
          return t + "-" + n.toLowerCase();
        }
        function Le(e, t) {
          var n, r;
          return function (o) {
            var i, s, a, l;
            switch (typeof o) {
              case "object":
                if (o) {
                  if ("object" === n) {
                    if (!t && r !== o) for (s in r) s in o || (e[s] = "");
                  } else t ? (e.value = "") : (e.cssText = "");
                  for (s in ((i = t ? {} : e), o))
                    ((a =
                      "number" != typeof (l = o[s]) || Ee.test(s)
                        ? l
                        : l + "px"),
                      !t && /^--/.test(s) ? i.setProperty(s, a) : (i[s] = a));
                  ((n = "object"),
                    t
                      ? (e.value = (function (e) {
                          var t,
                            n = [];
                          for (t in e)
                            n.push(t.replace(Se, Ce), ":", e[t], ";");
                          return n.join("");
                        })((r = i)))
                      : (r = o));
                  break;
                }
              default:
                r != o &&
                  ((n = "string"),
                  (r = o),
                  t ? (e.value = o || "") : (e.cssText = o || ""));
            }
          };
        }
        var Ae,
          Te,
          Re =
            ((Ae = [].slice),
            ((Te = Oe.prototype).ELEMENT_NODE = 1),
            (Te.nodeType = 111),
            (Te.remove = function (e) {
              var t,
                n = this.childNodes,
                r = this.firstChild,
                o = this.lastChild;
              return (
                (this._ = null),
                e && 2 === n.length
                  ? o.parentNode.removeChild(o)
                  : ((t = this.ownerDocument.createRange()).setStartBefore(
                      e ? n[1] : r
                    ),
                    t.setEndAfter(o),
                    t.deleteContents()),
                r
              );
            }),
            (Te.valueOf = function (e) {
              var t = this._,
                n = null == t;
              if (
                (n &&
                  (t = this._ = this.ownerDocument.createDocumentFragment()),
                n || e)
              )
                for (var r = this.childNodes, o = 0, i = r.length; o < i; o++)
                  t.appendChild(r[o]);
              return t;
            }),
            Oe);
        function Oe(e) {
          var t = (this.childNodes = Ae.call(e, 0));
          ((this.firstChild = t[0]),
            (this.lastChild = t[t.length - 1]),
            (this.ownerDocument = t[0].ownerDocument),
            (this._ = null));
        }
        function Ne(e) {
          return { html: e };
        }
        function Pe(e, t) {
          switch (e.nodeType) {
            case We:
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
        function Ie(e, t) {
          (t(e.placeholder),
            "text" in e
              ? Promise.resolve(e.text).then(String).then(t)
              : "any" in e
                ? Promise.resolve(e.any).then(t)
                : "html" in e
                  ? Promise.resolve(e.html).then(Ne).then(t)
                  : Promise.resolve(P.invoke(e, t)).then(t));
        }
        function De(e) {
          return null != e && "then" in e;
        }
        var je,
          ze,
          Me,
          qe,
          He,
          Be = "ownerSVGElement",
          Fe = v.prototype.nodeType,
          We = Re.prototype.nodeType,
          Ue =
            ((ze = (je = { Event: b, WeakSet: u }).Event),
            (Me = je.WeakSet),
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
                      new MutationObserver(s).observe(e, {
                        subtree: !0,
                        childList: !0,
                      });
                    } catch (t) {
                      var r = 0,
                        o = [],
                        i = function (e) {
                          (o.push(e),
                            clearTimeout(r),
                            (r = setTimeout(function () {
                              s(o.splice((r = 0), o.length));
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
                    function s(e) {
                      for (var r, o = e.length, i = 0; i < o; i++)
                        (a((r = e[i]).removedNodes, "disconnected", n, t),
                          a(r.addedNodes, "connected", t, n));
                    }
                    function a(e, t, n, r) {
                      for (
                        var o, i = new ze(t), s = e.length, a = 0;
                        a < s;
                        1 === (o = e[a++]).nodeType &&
                        (function e(t, n, r, o, i) {
                          He.has(t) &&
                            !o.has(t) &&
                            (i.delete(t), o.add(t), t.dispatchEvent(n));
                          for (
                            var s = t.children || [], a = s.length, l = 0;
                            l < a;
                            e(s[l++], n, r, o, i)
                          );
                        })(o, i, t, n, r)
                      );
                    }
                  })(e.ownerDocument)),
                He.add(e),
                e
              );
            }),
          Ge = /^(?:form|list)$/i,
          Ve = [].slice;
        function Ze(t) {
          return (
            (this.type = t),
            (function (t) {
              var n = xe,
                r = $e;
              return function (o) {
                var i, s, a;
                return (
                  n !== o &&
                    ((i = t),
                    (s = n = o),
                    (a = ve.get(s) || ve.set(s, ke(i, s))),
                    (r = a.updates(Z.call(e, a.content, !0)))),
                  r.apply(null, arguments)
                );
              };
            })(this)
          );
        }
        var Ye = !(Ze.prototype = {
            attribute: function (e, t, n) {
              var r,
                o = Be in e;
              if ("style" === t) return _e(e, n, o);
              if ("." === t.slice(0, 1))
                return (
                  (c = e),
                  (u = t.slice(1)),
                  o
                    ? function (e) {
                        try {
                          c[u] = e;
                        } catch (t) {
                          c.setAttribute(u, e);
                        }
                      }
                    : function (e) {
                        c[u] = e;
                      }
                );
              if ("?" === t.slice(0, 1))
                return (
                  (s = e),
                  (a = t.slice(1)),
                  function (e) {
                    l !== !!e &&
                      ((l = !!e)
                        ? s.setAttribute(a, "")
                        : s.removeAttribute(a));
                  }
                );
              if (/^on/.test(t)) {
                var i = t.slice(2);
                return (
                  "connected" === i || "disconnected" === i
                    ? Ue(e)
                    : t.toLowerCase() in e && (i = i.toLowerCase()),
                  function (t) {
                    r !== t &&
                      (r && e.removeEventListener(i, r, !1),
                      (r = t) && e.addEventListener(i, t, !1));
                  }
                );
              }
              if ("data" === t || (!o && t in e && !Ge.test(t)))
                return function (n) {
                  r !== n &&
                    ((r = n),
                    e[t] !== n && null == n
                      ? ((e[t] = ""), e.removeAttribute(t))
                      : (e[t] = n));
                };
              if (t in P.attributes)
                return function (n) {
                  var o = P.attributes[t](e, n);
                  r !== o &&
                    (null == (r = o)
                      ? e.removeAttribute(t)
                      : e.setAttribute(t, o));
                };
              var s,
                a,
                l,
                c,
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
                r = { node: Pe, before: e },
                o = Be in e ? "svg" : "html",
                i = !1;
              return function s(a) {
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
                          [((l = a), e.ownerDocument.createTextNode(l))],
                          r
                        )));
                    break;
                  case "function":
                    s(a(e));
                    break;
                  case "object":
                  case "undefined":
                    if (null == a) {
                      ((i = !1), (t = f(e.parentNode, t, [], r)));
                      break;
                    }
                  default:
                    if (((i = !1), I((n = a))))
                      if (0 === a.length)
                        t.length && (t = f(e.parentNode, t, [], r));
                      else
                        switch (typeof a[0]) {
                          case "string":
                          case "number":
                          case "boolean":
                            s({ html: a });
                            break;
                          case "object":
                            if (
                              (I(a[0]) && (a = a.concat.apply([], a)), De(a[0]))
                            ) {
                              Promise.all(a).then(s);
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
                        : De(a)
                          ? a.then(s)
                          : "placeholder" in a
                            ? Ie(a, s)
                            : "text" in a
                              ? s(String(a.text))
                              : "any" in a
                                ? s(a.any)
                                : "html" in a
                                  ? (t = f(
                                      e.parentNode,
                                      t,
                                      Ve.call(
                                        D([].concat(a.html).join(""), o)
                                          .childNodes
                                      ),
                                      r
                                    ))
                                  : s(
                                      "length" in a
                                        ? Ve.call(a)
                                        : P.invoke(a, s)
                                    );
                }
                var l;
              };
            },
            text: function (e) {
              var t;
              return function n(r) {
                var o;
                t !== r &&
                  ("object" == (o = typeof (t = r)) && r
                    ? De(r)
                      ? r.then(n)
                      : "placeholder" in r
                        ? Ie(r, n)
                        : n(
                            "text" in r
                              ? String(r.text)
                              : "any" in r
                                ? r.any
                                : "html" in r
                                  ? [].concat(r.html).join("")
                                  : "length" in r
                                    ? Ve.call(r).join("")
                                    : P.invoke(r, n)
                          )
                    : "function" == o
                      ? n(r(e))
                      : (e.textContent = null == r ? "" : r));
              };
            },
          }),
          Ke = function (t) {
            var r,
              o,
              i,
              s,
              a =
                ((r = (e.defaultView.navigator || {}).userAgent),
                /(Firefox|Safari)\/(\d+)/.test(r) &&
                  !/(Chrom[eium]+|Android)\/(\d+)/.test(r)),
              l =
                !("raw" in t) ||
                t.propertyIsEnumerable("raw") ||
                !Object.isFrozen(t.raw);
            return (
              a || l
                ? ((o = {}),
                  (i = function (e) {
                    for (var t = ".", n = 0; n < e.length; n++)
                      t += e[n].length + "." + e[n];
                    return o[t] || (o[t] = e);
                  }),
                  (Ke = l
                    ? i
                    : ((s = new n()),
                      function (e) {
                        return s.get(e) || ((n = i((t = e))), s.set(t, n), n);
                        var t, n;
                      })))
                : (Ye = !0),
              Xe(t)
            );
          };
        function Xe(e) {
          return Ye ? e : Ke(e);
        }
        function Qe(e) {
          for (var t = arguments.length, n = [Xe(e)], r = 1; r < t; )
            n.push(arguments[r++]);
          return n;
        }
        var Je = new n(),
          et = function (e) {
            var t, n, r;
            return function () {
              var o = Qe.apply(null, arguments);
              return (
                r !== o[0]
                  ? ((r = o[0]), (n = new Ze(e)), (t = nt(n.apply(n, o))))
                  : n.apply(n, o),
                t
              );
            };
          },
          tt = function (e, t) {
            var n = t.indexOf(":"),
              r = Je.get(e),
              o = t;
            return (
              -1 < n && ((o = t.slice(n + 1)), (t = t.slice(0, n) || "html")),
              r || Je.set(e, (r = {})),
              r[o] || (r[o] = et(t))
            );
          },
          nt = function (e) {
            var t = e.childNodes,
              n = t.length;
            return 1 === n ? t[0] : n ? new Re(t) : e;
          },
          rt = new n();
        function ot() {
          var e = rt.get(this),
            t = Qe.apply(null, arguments);
          return (
            e && e.template === t[0]
              ? e.tagger.apply(null, t)
              : function (e) {
                  var t = new Ze(Be in this ? "svg" : "html");
                  (rt.set(this, { tagger: t, template: e }),
                    (this.textContent = ""),
                    this.appendChild(t.apply(null, arguments)));
                }.apply(this, t),
            this
          );
        }
        var it,
          st,
          at,
          lt,
          ct = P.define,
          ut = Ze.prototype;
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
          (dt.Component = v),
          (dt.bind = function (e) {
            return ot.bind(e);
          }),
          (dt.define = ct),
          (dt.diff = f),
          ((dt.hyper = dt).observe = Ue),
          (dt.tagger = ut),
          (dt.wire = function (e, t) {
            return null == e ? et(t || "html") : tt(e, t || "html");
          }),
          (dt._ = { WeakMap: n, WeakSet: u }),
          (it = et),
          (st = new n()),
          (at = Object.create),
          (lt = function (e, t) {
            var n = { w: null, p: null };
            return (t.set(e, n), n);
          }),
          Object.defineProperties(v, {
            for: {
              configurable: !0,
              value: function (e, t) {
                return (function (e, t, r, o) {
                  var i,
                    s,
                    a,
                    l = t.get(e) || lt(e, t);
                  switch (typeof o) {
                    case "object":
                    case "function":
                      var c = l.w || (l.w = new n());
                      return (
                        c.get(o) ||
                        ((i = c), (s = o), (a = new e(r)), i.set(s, a), a)
                      );
                    default:
                      var u = l.p || (l.p = at(null));
                      return u[o] || (u[o] = new e(r));
                  }
                })(
                  this,
                  st.get(e) || ((r = e), (o = new w()), st.set(r, o), o),
                  e,
                  null == t ? "default" : t
                );
                var r, o;
              },
            },
          }),
          Object.defineProperties(v.prototype, {
            handleEvent: {
              value: function (e) {
                var t = e.currentTarget;
                this[
                  ("getAttribute" in t && t.getAttribute("data-call")) ||
                    "on" + e.type
                ](e);
              },
            },
            html: k("html", it),
            svg: k("svg", it),
            state: k("state", function () {
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
                for (var o in r) n[o] = r[o];
                return (!1 !== t && this.render(), this);
              },
            },
          }),
          dt
        );
      })(document);
    const {
        Component: lt,
        bind: ct,
        define: ut,
        diff: dt,
        hyper: pt,
        wire: ht,
      } = at,
      ft = at,
      mt = R,
      gt = et,
      bt = class {
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
              o = null,
              i = new Map(),
              s = "type",
              a = Array.from(e);
            for (let e = 0; e < a.length; e++) {
              const l = a[e];
              switch (s) {
                case "type":
                  if ("/" === l) {
                    s = "subtype";
                    continue;
                  }
                  t += l;
                  break;
                case "subtype":
                  if (";" === l) {
                    s = "param-start";
                    continue;
                  }
                  n += l;
                  break;
                case "param-start":
                  if (P.test(l) || ";" === l) continue;
                  ((r += l), (s = "param-name"));
                  break;
                case "param-name":
                  if ("=" === l || ";" === l) {
                    if ("=" === l) {
                      ((s = "param-value"), (o = null));
                      continue;
                    }
                    (i.set(r.toLowerCase(), null), (r = ""));
                    continue;
                  }
                  r += l;
                  break;
                case "param-value":
                  if ('"' == l) {
                    s = "collect-quoted-string";
                    continue;
                  }
                  if (";" === l) {
                    ((o = o.trimEnd()),
                      (s = "param-start"),
                      D(i, r, o),
                      (r = ""));
                    continue;
                  }
                  o = "string" == typeof o ? o + l : l;
                  break;
                case "collect-quoted-string":
                  if ('"' === l) {
                    (D(i, r, o),
                      (s = "ignore-input-until-next-param"),
                      (r = ""),
                      (o = null));
                    continue;
                  }
                  if ("\\" === l) continue;
                  o = "string" == typeof o ? o + l : l;
                  break;
                case "ignore-input-until-next-param":
                  if (";" !== l) continue;
                  s = "param-start";
                  break;
                default:
                  throw new Error(
                    `State machine error - unknown parser mode: ${s} `
                  );
              }
            }
            r && D(i, r, o);
            if ("" === t.trim() || !N.test(t))
              throw new TypeError("Invalid type");
            if ("" === n.trim() || !N.test(n))
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
                  ? N.test(n)
                    ? (r += `=${n}`)
                    : (r += `="${n}"`)
                  : (r += '=""'),
                (r += ";"));
            return e.essence + r.slice(0, -1);
          })(this);
        }
      },
      yt = st,
      wt = /-/g,
      vt = RegExp.escape ?? (e => e.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")),
      kt = new Intl.DateTimeFormat(["sv-SE"], {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      xt = "en" === i || i.startsWith("en-") ? "en-AU" : i,
      $t = new Intl.DateTimeFormat(xt, {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "en-AU" === xt ? "2-digit" : "numeric",
      }),
      Et =
        ".informative, .note, .issue, .example, .ednote, .practice, .introductory";
    function St(e) {
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
    function _t(e) {
      e.querySelectorAll(".remove, script[data-requiremodule]").forEach(e => {
        e.remove();
      });
    }
    function Ct(e, t = "long") {
      const n = new Intl.ListFormat(i, { style: t, type: e });
      return (e, t) => {
        let r = 0;
        return n
          .formatToParts(e)
          .map(({ type: n, value: o }) =>
            "element" === n && t ? t(o, r++, e) : o
          );
      };
    }
    const Lt = Ct("conjunction"),
      At = Ct("disjunction");
    function Tt(e, t) {
      return Lt(e, t).join("");
    }
    function Rt(e) {
      return e.trim().replace(/\s+/g, " ");
    }
    function Ot(e, t = i) {
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
    function Nt(e, t, ...n) {
      const r = [this, e, ...n];
      if (t) {
        const n = t.split(/\s+/);
        for (const t of n) {
          const n = window[t];
          if (n)
            try {
              e = n.apply(this, r);
            } catch (e) {
              Yt(
                `call to \`${t}()\` failed with: ${e}.`,
                "utils/runTransforms",
                { hint: "See developer console for stack trace.", cause: e }
              );
            }
        }
      }
      return e;
    }
    function Pt(e, t = e => e) {
      const n = e.map(t),
        r = n.slice(0, -1).map(e => ft`${e}, `);
      return ft`${r}${n[n.length - 1]}`;
    }
    function It(e, t = !1) {
      return (t ? e : e.toLowerCase())
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\W+/gim, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    }
    function Dt(e, t = "", n = "", r = !1) {
      if (e.id) return e.id;
      n || (n = (e.title ? e.title : e.textContent).trim());
      let o = It(n, r);
      if (
        (o
          ? (!/\.$/.test(o) && /^[a-z]/i.test(t || o)) || (o = `x${o}`)
          : (o = "generatedID"),
        t && (o = `${t}-${o}`),
        e.ownerDocument.getElementById(o))
      ) {
        let t = 0,
          n = `${o}-${t}`;
        for (; e.ownerDocument.getElementById(n); )
          ((t += 1), (n = `${o}-${t}`));
        o = n;
      }
      return ((e.id = o), o);
    }
    function jt(e) {
      const t = new Set(),
        n = "ltNodefault" in e.dataset ? "" : Rt(e.textContent),
        r = e.children[0];
      if (
        (e.dataset.lt
          ? e.dataset.lt
              .split("|")
              .map(e => Rt(e))
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
        e.dataset.localLt.split("|").forEach(e => t.add(Rt(e)));
      }
      return [...t];
    }
    function zt(e, t, n = { copyAttributes: !0 }) {
      if (e.localName === t) return e;
      const r = e.ownerDocument.createElement(t);
      if (n.copyAttributes)
        for (const { name: t, value: n } of e.attributes) r.setAttribute(t, n);
      return (r.append(...e.childNodes), e.replaceWith(r), r);
    }
    function Mt(e, t) {
      const n = t.closest(Et);
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
    function qt(e, t) {
      return (t.append(...e.childNodes), e.appendChild(t), e);
    }
    function Ht(e) {
      const { previousSibling: t } = e;
      if (!t || t.nodeType !== Node.TEXT_NODE) return "";
      const n = (t.textContent ?? "").lastIndexOf("\n");
      if (-1 === n) return "";
      const r = (t.textContent ?? "").slice(n + 1);
      return /\S/.test(r) ? "" : r;
    }
    class Bt extends Set {
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
    function Ft(e) {
      const t = e.cloneNode(!0);
      return (
        t.querySelectorAll("[id]").forEach(e => e.removeAttribute("id")),
        t.querySelectorAll("dfn").forEach(e => {
          zt(e, "span", { copyAttributes: !1 });
        }),
        t.hasAttribute("id") && t.removeAttribute("id"),
        Wt(t),
        t
      );
    }
    function Wt(e) {
      const t = document.createTreeWalker(e, NodeFilter.SHOW_COMMENT);
      for (const e of [...Ut(t)]) e.remove();
    }
    function* Ut(e) {
      for (; e.nextNode(); ) yield e.currentNode;
    }
    class Gt extends Map {
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
    class Vt extends Error {
      constructor(e, t, n) {
        super(e, { ...(n.cause && { cause: n.cause }) });
        const r = n.isWarning ? "ReSpecWarning" : "ReSpecError";
        (Object.assign(this, { message: e, plugin: t, name: r, ...n }),
          n.elements &&
            n.elements.forEach(t =>
              (function (e, t, n) {
                (e.classList.add("respec-offending-element"),
                  e.hasAttribute("title") || e.setAttribute("title", n || t),
                  e.id || Dt(e, "respec-offender"));
              })(t, e, n.title)
            ));
      }
      toJSON() {
        const { message: e, name: t, stack: n } = this,
          { plugin: r, hint: o, elements: i, title: s, details: a } = this;
        return {
          message: e,
          name: t,
          plugin: r,
          hint: o,
          elements: i,
          title: s,
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
    function Zt(e, t, n = {}) {
      const r = { ...n, isWarning: !1 };
      nn("error", new Vt(e, t, r));
    }
    function Yt(e, t, n = {}) {
      const r = { ...n, isWarning: !0 };
      nn("warn", new Vt(e, t, r));
    }
    function Kt(e) {
      return {
        amendConfiguration: e => nn("amend-user-config", e),
        showError: (t, n) => Zt(t, e, n),
        showWarning: (t, n) => Yt(t, e, n),
      };
    }
    function Xt(e) {
      return e ? `\`${e}\`` : "";
    }
    function Qt(e, { quotes: t } = { quotes: !1 }) {
      return At(
        e,
        t
          ? e => {
              return Xt(((t = e), String(t) ? `"${t}"` : ""));
              var t;
            }
          : Xt
      ).join("");
    }
    function Jt(e, ...t) {
      return en(
        e
          .map((e, n) => {
            const r = t[n];
            if (!r) return e;
            if (!r.startsWith("[") && !r.endsWith("]")) return e + r;
            const [o, i] = r.slice(1, -1).split("|");
            if (i) {
              return `${e}[${o}](${new URL(i, "https://respec.org/docs/")})`;
            }
            return `${e}[\`${o}\`](https://respec.org/docs/#${o})`;
          })
          .join("")
      );
    }
    function en(e) {
      if (!e) return e;
      const t = e.trimEnd().split("\n");
      for (; t.length && !t[0].trim(); ) t.shift();
      const n = t.filter(e => e.trim()).map(e => e.search(/[^\s]/)),
        r = Math.min(...n);
      return t.map(e => e.slice(r)).join("\n");
    }
    const tn = new EventTarget();
    function nn(e, t) {
      if (
        (tn.dispatchEvent(new CustomEvent(e, { detail: t })),
        window.parent === window.self)
      )
        return;
      const n = String(JSON.stringify(t?.stack || t));
      window.parent.postMessage(
        { topic: e, args: n },
        window.parent.location.origin
      );
    }
    function rn(e, t, n = { once: !1 }) {
      tn.addEventListener(
        e,
        async n => {
          try {
            await t(n.detail);
          } catch (t) {
            const n = t;
            Zt(`Error in handler for topic "${e}": ${n.message}`, `sub:${e}`, {
              cause: n,
            });
          }
        },
        n
      );
    }
    n("core/pubsubhub", { sub: rn });
    const on = ["githubToken", "githubUser"];
    const sn = new Map([
      ["text/html", "html"],
      ["application/xml", "xml"],
    ]);
    function an(e, t = document) {
      const n = sn.get(e);
      if (!n) {
        const t = [...sn.values()].join(", ");
        throw new TypeError(`Invalid format: ${e}. Expected one of: ${t}.`);
      }
      const r = ln(n, t);
      return `data:${e};charset=utf-8,${encodeURIComponent(r)}`;
    }
    function ln(e, t) {
      const n = t.cloneNode(!0);
      !(function (e) {
        const { head: t, body: n, documentElement: r } = e;
        (Wt(e),
          e
            .querySelectorAll(".removeOnSave, #toc-nav")
            .forEach(e => e.remove()),
          n.classList.remove("toc-sidebar"),
          _t(r));
        const o = e.createDocumentFragment(),
          i = e.querySelector("meta[name='viewport']");
        i && t.firstChild !== i && o.appendChild(i);
        const s =
          e.querySelector("meta[charset], meta[content*='charset=']") ||
          ft`<meta charset="utf-8" />`;
        o.appendChild(s);
        const a = `ReSpec ${window.respecVersion || "Developer Channel"}`,
          l = ft`
    <meta name="generator" content="${a}" />
  `;
        (o.appendChild(l), t.prepend(o), nn("beforesave", r));
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
    n("core/exporter", { rsDocToDataURL: an });
    class cn {
      constructor() {
        ((this._respecDonePromise = new Promise(e => {
          rn("end-all", () => e(), { once: !0 });
        })),
          (this.errors = []),
          (this.warnings = []),
          rn("error", e => {
            (console.error(e, e.toJSON()), this.errors.push(e));
          }),
          rn("warn", e => {
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
        return ln("html", document);
      }
    }
    const un = "core/post-process";
    const dn = "core/pre-process";
    const pn = "core/base-runner";
    async function hn(e) {
      (!(function () {
        const e = new cn();
        Object.defineProperty(document, "respec", { value: e });
      })(),
        nn("start-all", respecConfig),
        (function (e) {
          const t = {},
            n = e => Object.assign(t, e);
          (n(e),
            rn("amend-user-config", n),
            rn("end-all", () => {
              const e = document.createElement("script");
              ((e.id = "initialUserConfig"), (e.type = "application/json"));
              for (const e of on) e in t && delete t[e];
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
                let o;
                try {
                  o = JSON.parse(r);
                } catch {
                  o = r;
                }
                return [n, o];
              }),
            r = Object.fromEntries(n);
          (Object.assign(e, r), nn("amend-user-config", r));
        })(respecConfig),
        performance.mark(`${pn}-start`),
        await (async function (e) {
          if (Array.isArray(e.preProcess)) {
            const t = e.preProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  Zt("Every item in `preProcess` must be a JS function.", dn),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${dn}/${r.name || `[${n}]`}`,
                o = Kt(t);
              try {
                await r(e, document, o);
              } catch (e) {
                Zt(`Function ${t} threw an error during \`preProcess\`.`, dn, {
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
              await new Promise(async (r, o) => {
                const i = setTimeout(() => {
                  const t = `Plugin ${e} took too long.`;
                  (console.error(t, n), o(new Error(t)));
                }, 15e3);
                performance.mark(`${e}-start`);
                try {
                  n.Plugin
                    ? (await new n.Plugin(t).run(), r(void 0))
                    : n.run && (await n.run(t), r(void 0));
                } catch (e) {
                  o(e);
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
        nn("plugins-done", respecConfig),
        await (async function (e) {
          if (Array.isArray(e.postProcess)) {
            const t = e.postProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  Zt("Every item in `postProcess` must be a JS function.", un),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${un}/${r.name || `[${n}]`}`,
                o = Kt(t);
              try {
                await r(e, document, o);
              } catch (e) {
                Zt(`Function ${t} threw an error during \`postProcess\`.`, un, {
                  hint: "See developer console.",
                  cause: e,
                });
              }
            }
          }
          "function" == typeof e.afterEnd && (await e.afterEnd(e, document));
        })(respecConfig),
        nn("end-all", void 0),
        _t(document),
        performance.mark(`${pn}-end`),
        performance.measure(pn, `${pn}-start`, `${pn}-end`));
    }
    var fn = String.raw`.respec-modal .close-button{position:absolute;z-index:inherit;padding:.2em;font-weight:700;cursor:pointer;margin-left:5px;border:none;background:0 0}
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
    const mn = /&gt;/gm,
      gn = /&amp;/gm;
    class bn extends gt.Renderer {
      code(e) {
        const { text: t, lang: n = "" } = e,
          { language: r, ...o } = bn.parseInfoString(n);
        if (/(^webidl$)/i.test(r)) return `<pre class="idl">${t}</pre>`;
        const i = super
            .code({ ...e, lang: r })
            .replace('class="language-', 'class="'),
          { example: s, illegalExample: a } = o;
        if (!s && !a) return i;
        const l = s || a,
          c = `${r} ${s ? "example" : "illegal-example"}`;
        return i.replace("<pre>", `<pre title="${l}" class="${c}">`);
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
        let o;
        if (r)
          try {
            o = JSON.parse(`{ ${r} }`);
          } catch (e) {
            console.error(e);
          }
        return { language: n, ...o };
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
    const yn = { gfm: !0, renderer: new bn() };
    function wn(e, t = { inline: !1 }) {
      const n = (function (e) {
          if (!e) return e;
          const t = e.trimEnd().split("\n"),
            n = t.findIndex(e => e.trim());
          if (-1 === n) return "";
          const r = t.slice(n),
            o = r[0].search(/[^\s]/);
          if (o < 1) return r.join("\n");
          const i = " ".repeat(o);
          return r.map(e => (e.startsWith(i) ? e.slice(o) : e)).join("\n");
        })(e),
        r = n.replace(mn, ">").replace(gn, "&");
      return t.inline ? gt.parseInline(r, yn) : gt.parse(r, yn);
    }
    function vn(e) {
      for (const t of e.getElementsByTagName("pre")) t.prepend("\n");
      e.innerHTML = wn(e.innerHTML);
    }
    const kn =
      ((xn = "[data-format='markdown']:not(body)"),
      e => {
        const t = e.querySelectorAll(xn);
        return (t.forEach(vn), Array.from(t));
      });
    var xn;
    var $n = Object.freeze({
      __proto__: null,
      markdownToHtml: wn,
      name: "core/markdown",
      run: function (e) {
        const t = !!document.querySelector("[data-format=markdown]:not(body)"),
          n = "markdown" === e.format;
        if (!n && !t) return;
        if (!n) return void kn(document.body);
        const r = document.getElementById("respec-ui");
        r?.remove();
        const o = document.body.cloneNode(!0);
        (!(function (e, t) {
          const n = e.querySelectorAll(t);
          for (const e of n) {
            const { innerHTML: t } = e;
            if (/^<\w/.test(t.trimStart())) continue;
            const n = t.split("\n"),
              r = n.slice(0, 2).join("\n"),
              o = n.slice(-2).join("\n");
            if ((r.trim() && e.prepend("\n\n"), o.trim())) {
              const t = Ht(e);
              e.append(`\n\n${t}`);
            }
          }
        })(
          o,
          "[data-format=markdown], section, div, address, article, aside, figure, header, main"
        ),
          vn(o),
          (function (e) {
            Array.from(e).forEach(e => {
              e.replaceWith(e.textContent);
            });
          })(o.querySelectorAll(".nolinks a[href]")),
          r && o.append(r),
          document.body.replaceWith(o));
      },
    });
    function En(e, t) {
      e &&
        Array.from(t).forEach(([t, n]) => {
          e.setAttribute(`aria-${t}`, n);
        });
    }
    !(function () {
      const e = document.createElement("style");
      ((e.id = "respec-ui-styles"),
        (e.textContent = fn),
        e.classList.add("removeOnSave"),
        document.head.appendChild(e));
    })();
    const Sn = ft`<div id="respec-ui" class="removeOnSave" hidden></div>`,
      _n = ft`<ul
  id="respec-menu"
  role="menu"
  aria-labelledby="respec-pill"
  hidden
></ul>`,
      Cn = ft`<button
  class="close-button"
  onclick=${() => zn.closeModal()}
  title="Close"
>
  ❌
</button>`;
    let Ln, An;
    window.addEventListener("load", () => In(_n));
    const Tn = [],
      Rn = [],
      On = {};
    (rn("start-all", () => document.body.prepend(Sn), { once: !0 }),
      rn("end-all", () => document.body.prepend(Sn), { once: !0 }));
    const Nn = ft`<button id="respec-pill" disabled>ReSpec</button>`;
    function Pn() {
      (_n.classList.toggle("respec-hidden"),
        _n.classList.toggle("respec-visible"),
        (_n.hidden = !_n.hidden));
    }
    function In(e) {
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
    (Sn.appendChild(Nn),
      Nn.addEventListener("click", e => {
        (e.stopPropagation(),
          Nn.setAttribute("aria-expanded", String(_n.hidden)),
          Pn(),
          _n.querySelector("li:first-child button").focus());
      }),
      document.documentElement.addEventListener("click", () => {
        _n.hidden || Pn();
      }),
      Sn.appendChild(_n),
      _n.addEventListener("keydown", e => {
        "Escape" !== e.key ||
          _n.hidden ||
          (Nn.setAttribute("aria-expanded", String(_n.hidden)),
          Pn(),
          Nn.focus());
      }));
    const Dn = new Map([
      ["controls", "respec-menu"],
      ["expanded", "false"],
      ["haspopup", "true"],
      ["label", "ReSpec Menu"],
    ]);
    function jn(e, t, n, r) {
      (t.push(e),
        On.hasOwnProperty(n) ||
          ((On[n] = (function (e, t, n) {
            const r = `respec-pill-${e}`,
              o = ft`<button
    id="${r}"
    class="respec-info-button"
  ></button>`;
            o.addEventListener("click", () => {
              o.setAttribute("aria-expanded", "true");
              const r = ft`<ol class="${`respec-${e}-list`}"></ol>`;
              for (const e of t) {
                const t = document
                    .createRange()
                    .createContextualFragment(Mn(e)),
                  n = document.createElement("li");
                (t.firstElementChild === t.lastElementChild
                  ? n.append(...t.firstElementChild.childNodes)
                  : n.appendChild(t),
                  r.appendChild(n));
              }
              zn.freshModal(n, r, o);
            });
            const i = new Map([
              ["expanded", "false"],
              ["haspopup", "true"],
              ["controls", `respec-pill-${e}-modal`],
            ]);
            return (En(o, i), o);
          })(n, t, r)),
          Sn.appendChild(On[n])));
      const o = On[n];
      o.textContent = String(t.length);
      const i = 1 === t.length ? yt.singular(r) : r;
      En(o, new Map([["label", `${t.length} ${i}`]]));
    }
    En(Nn, Dn);
    const zn = {
      show() {
        try {
          Sn.hidden = !1;
        } catch (e) {
          console.error(e);
        }
      },
      hide() {
        Sn.hidden = !0;
      },
      enable() {
        Nn.removeAttribute("disabled");
      },
      addCommand(e, t, n, r) {
        r = r || "";
        const o = `respec-button-${e.toLowerCase().replace(/\s+/, "-")}`,
          i = ft`<button id="${o}" class="respec-option">
      <span class="respec-cmd-icon" aria-hidden="true">${r}</span> ${e}…
    </button>`,
          s = ft`<li role="menuitem">${i}</li>`;
        return (s.addEventListener("click", t), _n.appendChild(s), i);
      },
      error(e) {
        jn(e, Tn, "error", "ReSpec Errors");
      },
      warning(e) {
        jn(e, Rn, "warning", "ReSpec Warnings");
      },
      closeModal(e) {
        if (An) {
          const e = An;
          (e.classList.remove("respec-show-overlay"),
            e.classList.add("respec-hide-overlay"),
            e.addEventListener("transitionend", () => {
              (e.remove(), (An = null));
            }));
        }
        (e && e.setAttribute("aria-expanded", "false"),
          Ln && (Ln.remove(), (Ln = null), Nn.focus()));
      },
      freshModal(e, t, n) {
        (Ln && Ln.remove(),
          An && An.remove(),
          (An = ft`<div id="respec-overlay" class="removeOnSave"></div>`));
        const r = `${n.id}-modal`,
          o = `${r}-heading`;
        Ln = ft`<div
      id="${r}"
      class="respec-modal removeOnSave"
      role="dialog"
      aria-labelledby="${o}"
    >
      ${Cn}
      <h3 id="${o}">${e}</h3>
      <div class="inside">${t}</div>
    </div>`;
        const i = new Map([["labelledby", o]]);
        (En(Ln, i),
          document.body.append(An, Ln),
          An.addEventListener("click", () => this.closeModal(n)),
          An.classList.toggle("respec-show-overlay"),
          (Ln.hidden = !1),
          In(Ln));
      },
    };
    function Mn(e) {
      if ("string" == typeof e) return e;
      const t = e.plugin
          ? `<p class="respec-plugin">(plugin: "${e.plugin}")</p>`
          : "",
        n = e.hint
          ? `\n${wn(`<p class="respec-hint"><strong>How to fix:</strong> ${en(e.hint)}`, { inline: !e.hint.includes("\n") })}\n`
          : "",
        r = Array.isArray(e.elements)
          ? `<p class="respec-occurrences">Occurred <strong>${e.elements.length}</strong> times at:</p>\n    ${wn(e.elements.map(qn).join("\n"))}`
          : "",
        o = e.details ? `\n\n<details>\n${e.details}\n</details>\n` : "";
      var i;
      return `${wn(`**${((i = e.message), i.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/</g, "&lt;"))}**`, { inline: !0 })}${n}${r}${o}${t}`;
    }
    function qn(e) {
      return `* [\`<${e.localName}>\`](#${e.id}) element`;
    }
    async function Hn(e) {
      try {
        (zn.show(),
          await (async function () {
            "loading" === document.readyState &&
              (await new Promise(e =>
                document.addEventListener("DOMContentLoaded", e)
              ));
          })(),
          await hn(e));
      } finally {
        zn.enable();
      }
    }
    (document.addEventListener("keydown", e => {
      "Escape" === e.key && zn.closeModal();
    }),
      (window.respecUI = zn),
      rn("error", e => zn.error(e)),
      rn("warn", e => zn.warning(e)),
      window.addEventListener("error", e => {
        console.error(e.error, e.message, e);
      }));
    const Bn = [
      Promise.resolve().then(function () {
        return Fn;
      }),
      Promise.resolve().then(function () {
        return s;
      }),
      Promise.resolve().then(function () {
        return Vn;
      }),
      Promise.resolve().then(function () {
        return Kn;
      }),
      Promise.resolve().then(function () {
        return Jn;
      }),
      Promise.resolve().then(function () {
        return ar;
      }),
      Promise.resolve().then(function () {
        return $n;
      }),
      Promise.resolve().then(function () {
        return lr;
      }),
      Promise.resolve().then(function () {
        return dr;
      }),
      Promise.resolve().then(function () {
        return _r;
      }),
      Promise.resolve().then(function () {
        return Ar;
      }),
      Promise.resolve().then(function () {
        return Tr;
      }),
      Promise.resolve().then(function () {
        return Nr;
      }),
      Promise.resolve().then(function () {
        return Ir;
      }),
      Promise.resolve().then(function () {
        return Zo;
      }),
      Promise.resolve().then(function () {
        return Qo;
      }),
      Promise.resolve().then(function () {
        return li;
      }),
      Promise.resolve().then(function () {
        return ci;
      }),
      Promise.resolve().then(function () {
        return hi;
      }),
      Promise.resolve().then(function () {
        return yi;
      }),
      Promise.resolve().then(function () {
        return $i;
      }),
      Promise.resolve().then(function () {
        return _i;
      }),
      Promise.resolve().then(function () {
        return po;
      }),
      Promise.resolve().then(function () {
        return Gi;
      }),
      Promise.resolve().then(function () {
        return Di;
      }),
      Promise.resolve().then(function () {
        return Eo;
      }),
      Promise.resolve().then(function () {
        return Zi;
      }),
      Promise.resolve().then(function () {
        return rr;
      }),
      Promise.resolve().then(function () {
        return Yi;
      }),
      Promise.resolve().then(function () {
        return rs;
      }),
      Promise.resolve().then(function () {
        return is;
      }),
      Promise.resolve().then(function () {
        return as;
      }),
      Promise.resolve().then(function () {
        return ps;
      }),
      Promise.resolve().then(function () {
        return ys;
      }),
      Promise.resolve().then(function () {
        return ws;
      }),
      Promise.resolve().then(function () {
        return Ts;
      }),
      Promise.resolve().then(function () {
        return Is;
      }),
      Promise.resolve().then(function () {
        return js;
      }),
      Promise.resolve().then(function () {
        return Ms;
      }),
      Promise.resolve().then(function () {
        return Vs;
      }),
      Promise.resolve().then(function () {
        return Ks;
      }),
      Promise.resolve().then(function () {
        return na;
      }),
      Promise.resolve().then(function () {
        return ra;
      }),
      Promise.resolve().then(function () {
        return sa;
      }),
      Promise.resolve().then(function () {
        return da;
      }),
      Promise.resolve().then(function () {
        return ga;
      }),
      Promise.resolve().then(function () {
        return va;
      }),
      Promise.resolve().then(function () {
        return $a;
      }),
      Promise.resolve().then(function () {
        return _a;
      }),
      Promise.resolve().then(function () {
        return Aa;
      }),
      Promise.resolve().then(function () {
        return Oa;
      }),
    ];
    Promise.all(Bn)
      .then(e => Hn(e))
      .catch(e => console.error(e));
    var Fn = Object.freeze({
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
    const Wn = {
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
      Un = new Map([
        [
          "aom",
          {
            name: "Alliance for Open Media License",
            short: "AOM",
            url: "http://aomedia.org/license/",
          },
        ],
      ]),
      Gn = {
        format: "markdown",
        logos: [
          {
            src: "https://aomedia.org/assets/images/aomedia-icon-only.png",
            alt: "AOM",
            id: "AOM",
            height: 170,
            width: 170,
            url: "https://aomedia.org/",
          },
        ],
        license: "aom",
      };
    var Vn = Object.freeze({
      __proto__: null,
      name: "aom/defaults",
      run: function (e) {
        const t = !1 !== e.lint && { ...Wn.lint, ...Gn.lint, ...e.lint };
        (Object.assign(e, { ...Wn, ...Gn, ...e, lint: t }),
          Object.assign(
            e,
            (function (e) {
              return { licenseInfo: Un.get(e.license) };
            })(e)
          ));
      },
    });
    var Zn = String.raw`@keyframes pop{
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
    const Yn = (function () {
      const e = document.createElement("style");
      return (
        (e.id = "respec-mainstyle"),
        (e.textContent = Zn),
        document.head.appendChild(e),
        e
      );
    })();
    var Kn = Object.freeze({
      __proto__: null,
      name: "core/style",
      run: function (e) {
        e.noReSpecCSS && Yn.remove();
      },
    });
    const Xn = "aom/style";
    const Qn = (function () {
      const e = [
          { hint: "preconnect", href: "https://www.w3.org" },
          {
            hint: "preload",
            href: "https://www.w3.org/scripts/TR/2016/fixup.js",
            as: "script",
          },
          {
            hint: "preload",
            href: "https://www.w3.org/StyleSheets/TR/2016/base.css",
            as: "style",
          },
        ],
        t = document.createDocumentFragment();
      for (const n of e.map(St)) t.appendChild(n);
      return t;
    })();
    (Qn.appendChild(
      (function () {
        const e = document.createElement("link");
        return (
          (e.rel = "stylesheet"),
          (e.href = "https://www.w3.org/StyleSheets/TR/2016/base.css"),
          e.classList.add("removeOnSave"),
          e
        );
      })()
    ),
      document.head.querySelector("meta[name=viewport]") ||
        Qn.prepend(
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
      document.head.prepend(Qn));
    var Jn = Object.freeze({
      __proto__: null,
      name: Xn,
      run: function (e) {
        if (!e.specStatus) {
          const t = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
          ((e.specStatus = "base"), Yt(t, Xn));
        }
        let t = "";
        if ("PD" === e.specStatus.toUpperCase()) t = "W3C-UD";
        else t = "base.css";
        e.noToc ||
          rn(
            "end-all",
            () => {
              !(function (e, t) {
                const n = e.createElement("script");
                (location.hash &&
                  n.addEventListener(
                    "load",
                    () => {
                      window.location.href = location.hash;
                    },
                    { once: !0 }
                  ),
                  (n.src = `https://www.w3.org/scripts/TR/${t}/fixup.js`),
                  e.body.appendChild(n));
              })(document, "2016");
            },
            { once: !0 }
          );
        const n = `https://www.w3.org/StyleSheets/TR/2016/${t}`;
        var r;
        (!(function (e, t) {
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
        })(document, n),
          rn(
            "beforesave",
            ((r = n),
            e => {
              const t = e.querySelector(`head link[href="${r}"]`);
              t && e.querySelector("head")?.append(t);
            })
          ));
      },
    });
    class er {
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
        er.sectionClasses.intersection(new Set(e.classList)).forEach(e => {
          t.classList.add(e);
        });
      }
      addSection(e) {
        const t = this.findHeader(e),
          n = t ? this.findPosition(t) : 1,
          r = this.findParent(n);
        (t && e.removeChild(t),
          e.appendChild(tr(e)),
          t && e.prepend(t),
          r.appendChild(e),
          (this.current = r));
      }
      addElement(e) {
        this.current.appendChild(e);
      }
    }
    function tr(e) {
      const t = new er(e.ownerDocument);
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
    function nr(e) {
      const t = tr(e);
      if (
        "section" === t.firstElementChild.localName &&
        "section" === e.localName
      ) {
        const n = t.firstElementChild;
        (n.remove(), e.append(...n.childNodes));
      } else e.textContent = "";
      e.appendChild(t);
    }
    var rr = Object.freeze({
      __proto__: null,
      name: "core/sections",
      restructure: nr,
      run: function () {
        nr(document.body);
      },
    });
    const or = "core/data-include";
    function ir(e, t, n) {
      const r = document.querySelector(`[data-include-id=${t}]`);
      if (!r) return;
      const o = Nt(e, r.dataset.oninclude, n),
        i = "string" == typeof r.dataset.includeReplace;
      (!(function (e, t, { replace: n }) {
        const { includeFormat: r } = e.dataset;
        let o = t;
        ("markdown" === r && (o = wn(o)),
          "text" === r ? (e.textContent = o) : (e.innerHTML = o),
          "markdown" === r && nr(e),
          n && e.replaceWith(...e.childNodes));
      })(r, o, { replace: i }),
        i ||
          (function (e) {
            [
              "data-include",
              "data-include-format",
              "data-include-replace",
              "data-include-id",
              "data-oninclude",
            ].forEach(t => e.removeAttribute(t));
          })(r));
    }
    async function sr(e, t) {
      const n = e.querySelectorAll("[data-include]"),
        r = Array.from(n).map(async e => {
          const n = e.dataset.include;
          if (!n) return;
          const r = `include-${String(Math.random()).slice(2)}`;
          e.dataset.includeId = r;
          try {
            const o = await fetch(n);
            (ir(await o.text(), r, n), t < 3 && (await sr(e, t + 1)));
          } catch (t) {
            const r = t;
            Zt(`\`data-include\` failed: \`${n}\` (${r.message}).`, or, {
              elements: [e],
              cause: r,
            });
          }
        });
      await Promise.all(r);
    }
    var ar = Object.freeze({
      __proto__: null,
      name: or,
      run: async function () {
        await sr(document, 1);
      },
    });
    var lr = Object.freeze({
      __proto__: null,
      name: "core/reindent",
      run: function () {
        for (const e of document.getElementsByTagName("pre"))
          e.innerHTML = en(e.innerHTML);
      },
    });
    const cr = "core/title",
      ur = Ot({
        en: { default_title: "No Title" },
        de: { default_title: "Kein Titel" },
        zh: { default_title: "无标题" },
        cs: { default_title: "Bez názvu" },
      });
    var dr = Object.freeze({
      __proto__: null,
      name: cr,
      run: function (e) {
        const t =
          document.querySelector("h1#title") || ft`<h1 id="title"></h1>`;
        if (t.isConnected && "" === t.textContent.trim()) {
          Zt(
            'The document is missing a title, so using a default title. To fix this, please give your document a `<title>`. If you need special markup in the document\'s title, please use a `<h1 id="title">`.',
            cr,
            { title: "Document is missing a title", elements: [t] }
          );
        }
        (t.id || (t.id = "title"),
          t.classList.add("title"),
          (function (e, t) {
            t.isConnected ||
              (t.textContent = document.title || `${ur.default_title}`);
            const n = document.createElement("h1");
            n.innerHTML = t.innerHTML
              .replace(/:<br>/g, ": ")
              .replace(/<br>/g, " - ");
            let r = Rt(n.textContent);
            if (e.isPreview && e.prNumber) {
              const n = e.prUrl || `${e.github.repoURL}pull/${e.prNumber}`,
                { childNodes: o } = ft`
      Preview of PR <a href="${n}">#${e.prNumber}</a>:
    `;
              (t.prepend(...o), (r = `Preview of PR #${e.prNumber}: ${r}`));
            }
            ((document.title = r), (e.title = r));
          })(e, t),
          document.body.prepend(t));
      },
    });
    function pr(e) {
      if (!e.key) {
        const t =
          "Found a link without `key` attribute in the configuration. See dev console.";
        return (Yt(t, "core/templates/show-link"), void console.warn(t, e));
      }
      return ft`
    <dt class="${e.class ? e.class : null}">${e.key}</dt>
    ${e.data ? e.data.map(hr) : hr(e)}
  `;
    }
    function hr(e) {
      return ft`<dd class="${e.class ? e.class : null}">
    ${e.href ? ft`<a href="${e.href}">${e.value || e.href}</a>` : e.value}
  </dd>`;
    }
    const fr = "core/templates/show-logo";
    function mr(e, t) {
      const n = ft`<a href="${e.url || null}" class="logo"
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
        const r = Jt`Add the missing "\`alt\`" property describing the logo. See ${"[logos]"} for more information.`;
        Zt(
          `Logo at index ${t}${e.src ? `, with \`src\` ${e.src}, ` : ""} is missing required "\`alt\`" property.`,
          fr,
          { hint: r, elements: [n] }
        );
      }
      if (!e.src) {
        const e = Jt`The \`src\` property is required on every logo. See ${"[logos]"} for more information.`;
        Zt(`Logo at index ${t} is missing "\`src\`" property.`, fr, {
          hint: e,
          elements: [n],
        });
      }
      return n;
    }
    const gr = "core/templates/show-people",
      br = Ot({
        en: { until: e => ft` Until ${e} ` },
        es: { until: e => ft` Hasta ${e} ` },
        ko: { until: e => ft` ${e} 이전 ` },
        ja: { until: e => ft` ${e} 以前 ` },
        de: { until: e => ft` bis ${e} ` },
        zh: { until: e => ft` 直到 ${e} ` },
      }),
      yr = () => ft`<svg
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
    function wr(e, t) {
      const n = e[t];
      if (!Array.isArray(n) || !n.length) return;
      const r =
        ((o = t),
        function (e, t) {
          const n = "https://respec.org/docs/",
            r = `See [person](${n}#person) configuration for available options.`,
            i = `Error processing the [person object](${n}#person) at index ${t} of the "[\`${o}\`](${n}#${o})" configuration option.`;
          if (!e.name)
            return (
              Zt(`${i} Missing required property \`"name"\`.`, gr, { hint: r }),
              !1
            );
          if (e.orcid) {
            const { orcid: n } = e,
              r = new URL(n, "https://orcid.org/");
            if ("https://orcid.org" !== r.origin) {
              const n = `${i} ORCID "${e.orcid}" at index ${t} is invalid.`,
                o = `The origin should be "https://orcid.org", not "${r.origin}".`;
              return (Zt(n, gr, { hint: o }), !1);
            }
            const o = r.pathname.slice(1).replace(/\/$/, "");
            if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(o))
              return (
                Zt(`${i} ORCID "${o}" has wrong format.`, gr, {
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
                  o = 10 === r ? "X" : String(r);
                return t === o;
              })(n)
            )
              return (
                Zt(`${i} ORCID "${n}" failed checksum check.`, gr, {
                  hint: "Please check that the ORCID is valid.",
                }),
                !1
              );
            e.orcid = r.href;
          }
          return e.retiredDate &&
            ((s = e.retiredDate),
            "Invalid Date" ===
              (/\d{4}-\d{2}-\d{2}/.test(s)
                ? new Date(s)
                : "Invalid Date"
              ).toString())
            ? (Zt(
                `${i} The property "\`retiredDate\`" is not a valid date.`,
                gr,
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
                              Zt(
                                `${n}. Member "extra" at index ${r} is not an object.`,
                                gr,
                                { hint: t }
                              ),
                              !1
                            );
                          case !e.hasOwnProperty("name"):
                            return (
                              Zt(
                                `${n} \`PersonExtra\` object at index ${r} is missing required "name" member.`,
                                gr,
                                { hint: t }
                              ),
                              !1
                            );
                          case "string" == typeof e.name &&
                            "" === e.name.trim():
                            return (
                              Zt(
                                `${n} \`PersonExtra\` object at index ${r} "name" can't be empty.`,
                                gr,
                                { hint: t }
                              ),
                              !1
                            );
                        }
                        return !0;
                      })
                    : (Zt(
                        `${n}. A person's "extras" member must be an array.`,
                        gr,
                        { hint: t }
                      ),
                      !1);
                })(e.extras ?? [], r, i)
              ) &&
                (e.url &&
                  e.mailto &&
                  Yt(`${i} Has both "url" and "mailto" property.`, gr, {
                    hint: `Please choose either "url" or "mailto" ("url" is preferred). ${r}`,
                  }),
                e.companyURL &&
                  !e.company &&
                  Yt(
                    `${i} Has a "\`companyURL\`" property but no "\`company\`" property.`,
                    gr,
                    { hint: `Please add a "\`company\`" property. ${r}.` }
                  ),
                !0);
          var s;
        });
      var o;
      return n.filter(r).map(vr);
    }
    function vr(e) {
      const t = [e.name],
        n = [e.company],
        r = e.w3cid || null,
        o = [];
      if ((e.mailto && (e.url = `mailto:${e.mailto}`), e.url)) {
        const n =
          "mailto:" === new URL(e.url, document.location.href).protocol
            ? "ed_mailto u-email email p-name"
            : "u-url url p-name fn";
        o.push(ft`<a class="${n}" href="${e.url}">${t}</a>`);
      } else o.push(ft`<span class="p-name fn">${t}</span>`);
      if (
        (e.orcid &&
          o.push(ft`<a class="p-name orcid" href="${e.orcid}">${yr()}</a>`),
        e.company)
      ) {
        const t = "p-org org h-org",
          r = e.companyURL
            ? ft`<a class="${t}" href="${e.companyURL}">${n}</a>`
            : ft`<span class="${t}">${n}</span>`;
        o.push(ft` (${r})`);
      }
      (e.note && o.push(document.createTextNode(` (${e.note})`)),
        e.extras &&
          o.push(
            ...e.extras.map(
              e =>
                ft`, ${(function (e) {
                  const t = e.class || null,
                    { name: n, href: r } = e;
                  return r
                    ? ft`<a href="${r}" class="${t}">${n}</a>`
                    : ft`<span class="${t}">${n}</span>`;
                })(e)}`
            )
          ));
      const { retiredDate: i } = e;
      if (e.retiredDate) {
        const e = ft`<time datetime="${i}"
      >${$t.format(new Date(i ?? ""))}</time
    >`;
        o.push(ft` - ${br.until(e)} `);
      }
      return ft`<dd
    class="editor p-author h-card vcard"
    data-editor-id="${r}"
  >
    ${o}
  </dd>`;
    }
    const kr = Ot({
      en: {
        author: "Author:",
        authors: "Authors:",
        editor: "Editor:",
        editors: "Editors:",
        former_editor: "Former editor:",
        former_editors: "Former editors:",
        latest_editors_draft: "Latest editor's draft:",
        latest_published_version: "Latest approved version:",
        this_version: "This version:",
        issue_tracker: "Issue Tracker:",
      },
    });
    var xr = e => ft`<div class="head">
    ${"PD" !== e.specStatus ? (e.logos ?? []).map(mr) : ""}
    ${document.querySelector("h1#title")} ${(function (e) {
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
    })(e)}
    <h2>
      ${e.textStatus} -
      <time class="dt-published" datetime="${e.dashDate}"
        >${e.publishHumanDate}</time
      >
    </h2>
    <dl>
      <dt>${kr.this_version}</dt>
      <dd>
        <a class="u-url" href="${e.thisVersion}">${e.thisVersion}</a>
      </dd>
      <dt>${kr.issue_tracker}</dt>
      <dd>
        <a class="u-url" href="${e.issueTracker}">${e.issueTracker}</a>
      </dd>
      <dt>${e.multipleEditors ? kr.editors : kr.editor}</dt>
      ${wr(e, "editors")}
      ${
        Array.isArray(e.formerEditors) && e.formerEditors.length > 0
          ? ft`
            <dt>
              ${e.multipleFormerEditors ? kr.former_editors : kr.former_editor}
            </dt>
            ${wr(e, "formerEditors")}
          `
          : ""
      }
      ${
        e.authors
          ? ft`
            <dt>${e.multipleAuthors ? kr.authors : kr.author}</dt>
            ${wr(e, "authors")}
          `
          : ""
      }
      ${e.otherLinks ? e.otherLinks.map(pr) : ""}
    </dl>
    ${(function (e) {
      const t = document.querySelector(".copyright");
      if (t) return (t.remove(), t);
      return ft`<p class="copyright">
    Copyright ${e.publishYear},
    <a href="https://www.w3.org/"
      ><abbr title="The Alliance for Open Media">AOM</abbr></a
    ><br />
    Licensing information is available at http://aomedia.org/license/<br />
    The MATERIALS ARE PROVIDED “AS IS.” The Alliance for Open Media, its
    members,and its contributors expressly disclaim any warranties (express,
    implied, or otherwise), including implied warranties of merchantability,
    non-infringement, fitness for a particular purpose, or title, related to the
    materials. The entire risk as to implementing or otherwise using the
    materials is assumed by the implementer and user. IN NO EVENT WILL THE
    ALLIANCE FOR OPEN MEDIA, ITS MEMBERS, OR CONTRIBUTORS BE LIABLE TO ANY OTHER
    PARTY FOR LOST PROFITS OR ANY FORM OF INDIRECT, SPECIAL, INCIDENTAL, OR
    CONSEQUENTIAL DAMAGES OF ANY CHARACTER FROM ANY CAUSES OF ACTION OF ANY KIND
    WITH RESPECT TO THIS DELIVERABLE OR ITS GOVERNING AGREEMENT, WHETHER BASED
    ON BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, AND
    WHETHER OR NOT THE OTHER MEMBER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
    DAMAGE.
  </p>`;
    })(e)}
    <hr />
  </div>`;
    const $r = "aom/headers",
      Er = {
        PD: "Pre-Draft",
        WGD: "AOM Work Group Draft",
        WGA: "AOM Working Group Approved Draft",
        FD: "AOM Final Deliverable",
      },
      Sr = new Intl.DateTimeFormat(["en-US"], {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    var _r = Object.freeze({
      __proto__: null,
      name: $r,
      run: function (e) {
        if (!e.specStatus) {
          Zt("Missing required configuration: `specStatus`", $r);
        }
        ((e.title = document.title || "No title"),
          e.subtitle || (e.subtitle = ""),
          (e.publishDate = (function (e, t, n = new Date()) {
            const r = e[t] ? new Date(e[t]) : new Date(n);
            if (Number.isFinite(r.valueOf())) {
              const e = kt.format(r);
              return new Date(e);
            }
            return (
              Zt(
                `[\`${t}\`](https://github.com/speced/respec/wiki/${t}) is not a valid date: "${e[t]}". Expected format 'YYYY-MM-DD'.`,
                $r
              ),
              new Date(kt.format(new Date()))
            );
          })(e, "publishDate", document.lastModified)),
          (e.thisVersion = `https://aomediacodec.github.io/${e.shortName}/`),
          (e.issueTracker = `https://github.com/AOMediaCodec/${e.shortName}/issues/`),
          (e.publishYear = e.publishDate.getUTCFullYear()),
          (e.publishHumanDate = Sr.format(e.publishDate)));
        const t = function (e) {
          if (!e.name) {
            Zt("All authors and editors must have a name.", $r);
          }
        };
        if ((e.formerEditors || (e.formerEditors = []), e.editors)) {
          e.editors.forEach(t);
          for (let t = 0; t < e.editors.length; t++) {
            const n = e.editors[t];
            "retiredDate" in n &&
              (e.formerEditors.push(n), e.editors.splice(t--, 1));
          }
        }
        if (!e.editors || 0 === e.editors.length) {
          Zt("At least one editor is required", $r);
        }
        (e.formerEditors.length && e.formerEditors.forEach(t),
          e.authors && e.authors.forEach(t),
          (e.multipleEditors = e.editors && e.editors.length > 1),
          (e.multipleFormerEditors = e.formerEditors.length > 1),
          (e.multipleAuthors = e.authors && e.authors.length > 1),
          e.copyrightStart &&
            e.copyrightStart == e.publishYear &&
            (e.copyrightStart = ""),
          (e.textStatus = Er[e.specStatus]),
          (e.dashDate = kt.format(e.publishDate)),
          (e.publishISODate = e.publishDate.toISOString()));
        const n = xr(e);
        (document.body.prepend(n),
          document.body.classList.add("h-entry"),
          nn("amend-user-config", {
            publishISODate: e.publishISODate,
            generatedSubtitle: `${e.longStatus} ${e.publishHumanDate}`,
          }));
      },
    });
    const Cr = "aom/abstract",
      Lr = Ot({ en: { abstract: "Abstract" } });
    var Ar = Object.freeze({
      __proto__: null,
      name: Cr,
      run: async function () {
        const e = document.getElementById("abstract");
        if (!e) {
          return void Zt(
            'Document must have one element with `id="abstract"',
            Cr
          );
        }
        e.classList.add("introductory");
        let t = document.querySelector("#abstract>h2");
        t ||
          ((t = document.createElement("h2")),
          (t.textContent = Lr.abstract),
          e.prepend(t));
      },
    });
    var Tr = Object.freeze({
      __proto__: null,
      name: "core/data-transform",
      run: function () {
        document.querySelectorAll("[data-transform]").forEach(e => {
          ((e.innerHTML = Nt(e.innerHTML, e.dataset.transform)),
            e.removeAttribute("data-transform"));
        });
      },
    });
    const Rr = "core/dfn-abbr";
    function Or(e) {
      const t = (n = e).dataset.abbr
        ? n.dataset.abbr
        : (n.textContent
            ?.match(/\b([a-z])/gi)
            ?.join("")
            .toUpperCase() ?? "");
      var n;
      const r = e.textContent.replace(/\s\s+/g, " ").trim(),
        o = document.createElement("abbr");
      ((o.title = r), (o.textContent = t), e.after(" (", o, ")"));
      const i = e.dataset.lt || "";
      e.dataset.lt = i
        .split("|")
        .filter(e => e.trim())
        .concat(t)
        .join("|");
    }
    var Nr = Object.freeze({
      __proto__: null,
      name: Rr,
      run: function () {
        const e = document.querySelectorAll("[data-abbr]");
        for (const t of e) {
          const { localName: e } = t;
          if ("dfn" === e) Or(t);
          else {
            Zt(
              `\`data-abbr\` attribute not supported on \`${e}\` elements.`,
              Rr,
              { elements: [t], title: "Error: unsupported." }
            );
          }
        }
      },
    });
    var Pr = String.raw`:root{--assertion-border:#aaa;--assertion-bg:#eee;--assertion-text:black}
.assert{border-left:.5em solid #aaa;padding:.3em;border-color:#aaa;border-color:var(--assertion-border);background:#eee;background:var(--assertion-bg);color:#000;color:var(--assertion-text)}
@media (prefers-color-scheme:dark){
:root{--assertion-border:#444;--assertion-bg:var(--borderedblock-bg);--assertion-text:var(--text)}
}`;
    var Ir = Object.freeze({
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
            t.prepend(ft`<a data-cite="INFRA#assert">Assert</a>`, ": "));
        }
        const t = document.createElement("style");
        ((t.textContent = Pr), document.head.appendChild(t));
      },
    });
    const Dr = /^[a-z]+(\s+[a-z]+)+\??$/,
      jr = /\B"([^"]*)"\B/,
      zr = /^(\w+)\(([^\\)]*)\)(?:\|(\w+)(?:\((?:([^\\)]*))\))?)?$/,
      Mr = /\[\[(\w+(?: +\w+)*)\]\](\([^)]*\))?$/,
      qr = /^((?:\[\[)?(?:\w+(?: +\w+)*)(?:\]\])?)$/,
      Hr = /^(?:\w+)\??$/,
      Br = /^(\w+)\["([\w- ]*)"\]$/,
      Fr = /\.?(\w+\(.*\)$)/,
      Wr = /\/(.+)/,
      Ur = /\[\[.+\]\]/;
    function Gr(e) {
      const { identifier: t, renderParent: n, nullable: r } = e;
      if (n)
        return ft`<a
      data-xref-type="_IDL_"
      data-link-type="idl"
      data-lt="${t}"
      ><code>${t + (r ? "?" : "")}</code></a
    >`;
    }
    function Vr(e) {
      const {
          identifier: t,
          parent: n,
          slotType: r,
          renderParent: o,
          args: i,
        } = e,
        { identifier: s } = n || {},
        a = "method" === r,
        l = i ?? [],
        c = a ? ft`(${Pt(l, Zr)})` : null,
        u = a ? `(${l.join(", ")})` : "";
      return ft`${n && o ? "." : ""}<a
      data-xref-type="${r}"
      data-link-type="${r}"
      data-link-for="${s}"
      data-xref-for="${s}"
      data-lt="${`[[${t}]]${u}`}"
      ><code>[[${t}]]${c}</code></a
    >`;
    }
    function Zr(e, t, n) {
      if (t < n.length - 1) return ft`<var>${e}</var>`;
      const r = e.split(/(^\.{3})(.+)/),
        o = r.length > 1,
        i = o ? r[2] : r[0];
      return ft`${o ? "..." : null}<var>${i}</var>`;
    }
    function Yr(e) {
      const { parent: t, identifier: n, renderParent: r } = e,
        { identifier: o } = t || {};
      return ft`${r ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="attribute|dict-member|const"
      data-link-for="${o}"
      data-xref-for="${o}"
      ><code>${n}</code></a
    >`;
    }
    function Kr(e) {
      const { args: t, identifier: n, type: r, parent: o, renderParent: i } = e,
        { renderText: s, renderArgs: a } = e,
        { identifier: l } = o || {},
        c = Pt(a || t, Zr),
        u = `${n}(${t.join(", ")})`;
      return ft`${o && i ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="${r}"
      data-link-for="${l}"
      data-xref-for="${l}"
      data-lt="${u}"
      ><code>${s || n}</code></a
    >${!s || a ? ft`<code>(${c})</code>` : ""}`;
    }
    function Xr(e) {
      const { identifier: t, enumValue: n, parent: r } = e,
        o = r ? r.identifier : t;
      return ft`"<a
      data-link-type="idl"
      data-xref-type="enum-value"
      data-link-for="${o}"
      data-xref-for="${o}"
      data-lt="${n ? null : "the-empty-string"}"
      ><code>${n}</code></a
    >"`;
    }
    function Qr(e) {
      const { identifier: t } = e;
      return ft`"<a
      data-link-type="idl"
      data-cite="webidl"
      data-xref-type="exception"
      ><code>${t}</code></a
    >"`;
    }
    function Jr(e) {
      const { identifier: t, nullable: n } = e;
      return ft`<a
    data-link-type="idl"
    data-cite="webidl"
    data-xref-type="interface"
    data-lt="${t}"
    ><code>${t + (n ? "?" : "")}</code></a
  >`;
    }
    function eo(e) {
      let t;
      try {
        t = (function (e) {
          const t = Ur.test(e),
            n = t ? Wr : Fr,
            [r, o] = e.split(n);
          if (t && r && !o)
            throw new SyntaxError(
              `Internal slot missing "for" part. Expected \`{{ InterfaceName/${r}}}\` }.`
            );
          const i = r
              .split(/[./]/)
              .concat(o)
              .filter(e => e && e.trim())
              .map(e => e.trim()),
            s = !e.includes("/"),
            a = [];
          for (; i.length; ) {
            const t = i.pop() ?? "";
            if (zr.test(t)) {
              const [, e, n, r, o] = t.match(zr),
                i = (n ?? "").split(/,\s*/).filter(e => e),
                l = r?.trim(),
                c = o?.split(/,\s*/).filter(e => e);
              a.push({
                type: "method",
                identifier: e ?? "",
                args: i,
                renderParent: s,
                renderText: l,
                renderArgs: c,
              });
            } else if (Br.test(t)) {
              const [, e, n] = t.match(Br);
              a.push({
                type: "enum",
                identifier: e ?? "",
                enumValue: n ?? "",
                renderParent: s,
              });
            } else if (jr.test(t)) {
              const [, e] = t.match(jr);
              s
                ? a.push({ type: "exception", identifier: e ?? "" })
                : a.push({ type: "enum", enumValue: e ?? "", renderParent: s });
            } else if (Mr.test(t)) {
              const [, e, n] = t.match(Mr),
                r = n ? "method" : "attribute",
                o =
                  n
                    ?.slice(1, -1)
                    .split(/,\s*/)
                    .filter(e => e) ?? [];
              a.push({
                type: "internal-slot",
                slotType: r,
                identifier: e ?? "",
                args: o,
                renderParent: s,
              });
            } else if (qr.test(t) && i.length) {
              const [, e] = t.match(qr);
              a.push({
                type: "attribute",
                identifier: e ?? "",
                renderParent: s,
              });
            } else if (Dr.test(t)) {
              const e = t.endsWith("?"),
                n = e ? t.slice(0, -1) : t;
              a.push({
                type: "idl-primitive",
                identifier: n,
                renderParent: s,
                nullable: e,
              });
            } else {
              if (!Hr.test(t) || 0 !== i.length)
                throw new SyntaxError(
                  `IDL micro-syntax parsing error in \`{{ ${e} }}\``
                );
              {
                const e = t.endsWith("?"),
                  n = e ? t.slice(0, -1) : t;
                a.push({
                  type: "base",
                  identifier: n,
                  renderParent: s,
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
        const n = ft`<span>{{ ${e} }}</span>`,
          r = "Error: Invalid inline IDL string.";
        return (Zt(t.message, "core/inlines", { title: r, elements: [n] }), n);
      }
      const n = ft(document.createDocumentFragment()),
        r = [];
      for (const e of t)
        switch (e.type) {
          case "base": {
            const t = Gr(e);
            t && r.push(t);
            break;
          }
          case "attribute":
            r.push(Yr(e));
            break;
          case "internal-slot":
            r.push(Vr(e));
            break;
          case "method":
            r.push(Kr(e));
            break;
          case "enum":
            r.push(Xr(e));
            break;
          case "exception":
            r.push(Qr(e));
            break;
          case "idl-primitive":
            r.push(Jr(e));
            break;
          default:
            throw new Error("Unknown type.");
        }
      return n`${r}`;
    }
    const to = new Set(["alias", "reference"]),
      no = (async function () {
        const e = await mt.openDB("respec-biblio2", 12, {
            upgrade(e) {
              Array.from(e.objectStoreNames).map(t => e.deleteObjectStore(t));
              (e
                .createObjectStore("alias", { keyPath: "id" })
                .createIndex("aliasOf", "aliasOf", { unique: !1 }),
                e.createObjectStore("reference", { keyPath: "id" }));
            },
          }),
          t = Date.now();
        for (const n of [...to]) {
          const r = e.transaction(n, "readwrite").store,
            o = IDBKeyRange.lowerBound(t);
          let i = await r.openCursor(o);
          for (; i?.value; ) {
            const e = i.value;
            ((void 0 === e.expires || e.expires < t) && (await r.delete(e.id)),
              (i = await i.continue()));
          }
        }
        return e;
      })();
    const ro = {
        get ready() {
          return no;
        },
        async find(e) {
          return (
            (await this.isAlias(e)) && (e = (await this.resolveAlias(e)) ?? e),
            await this.get("reference", e)
          );
        },
        async has(e, t) {
          if (!to.has(e)) throw new TypeError(`Invalid type: ${e}`);
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
          if (!to.has(e)) throw new TypeError(`Invalid type: ${e}`);
          if (!t) throw new TypeError("id is required");
          const n = (await this.ready).transaction(e, "readonly").store,
            r = IDBKeyRange.only(t),
            o = await n.openCursor(r);
          return o ? o.value : null;
        },
        async addAll(e, t) {
          if (!e) return;
          const n = { alias: [], reference: [] };
          for (const r of Object.keys(e)) {
            const o = { id: r, ...e[r], expires: t };
            o.aliasOf ? n.alias.push(o) : n.reference.push(o);
          }
          const r = [...to].flatMap(e => n[e].map(t => this.add(e, t)));
          await Promise.all(r);
        },
        async add(e, t) {
          if (!to.has(e)) throw new TypeError(`Invalid type: ${e}`);
          if ("object" != typeof t)
            throw new TypeError("details should be an object");
          if ("alias" === e && !t.hasOwnProperty("aliasOf"))
            throw new TypeError("Invalid alias object.");
          const n = await this.ready;
          let r = await this.has(e, t.id);
          if (r) {
            const o = await this.get(e, t.id);
            if (o && void 0 !== o.expires && o.expires < Date.now()) {
              const { store: o } = n.transaction(e, "readwrite");
              (await o.delete(t.id), (r = !1));
            }
          }
          const { store: o } = n.transaction(e, "readwrite");
          return r ? await o.put(t) : await o.add(t);
        },
        async close() {
          (await this.ready).close();
        },
        async clear() {
          const e = await this.ready,
            t = [...to],
            n = e.transaction(t, "readwrite"),
            r = t.map(e => n.objectStore(e).clear());
          await Promise.all(r);
        },
      },
      oo = {},
      io = new URL("https://api.specref.org/bibrefs?refs="),
      so = St({ hint: "dns-prefetch", href: io.origin });
    let ao;
    document.head.appendChild(so);
    const lo = new Promise(e => {
      ao = e;
    });
    async function co(e, t = { forceUpdate: !1 }) {
      const n = [...new Set(e)].filter(e => e.trim());
      if (!n.length || !1 === navigator.onLine) return null;
      let r;
      try {
        r = await fetch(io.href + n.join(","));
      } catch (e) {
        return (console.error(e), null);
      }
      if ((!t.forceUpdate && !r.ok) || 200 !== r.status) return null;
      const o = await r.json(),
        i = Date.now() + 36e5;
      try {
        const e = Date.parse(r.headers.get("Expires") || ""),
          t = Number.isNaN(e) ? i : Math.min(e, i);
        await ro.addAll(o, t);
      } catch (e) {
        console.error(e);
      }
      return o;
    }
    async function uo(e) {
      const t = await lo;
      if (!t.hasOwnProperty(e)) return null;
      const n = t[e];
      return n.aliasOf ? await uo(n.aliasOf) : n;
    }
    var po = Object.freeze({
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
            (this.conf.biblio = oo));
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
                    await ro.ready;
                    const n = e.map(async e => ({
                      id: e,
                      data: await ro.find(e),
                    }));
                    t.push(...(await Promise.all(n)));
                  } catch (n) {
                    (t.push(...e.map(e => ({ id: e, data: null }))),
                      console.warn(n));
                  }
                  return t;
                })(n)
              : [],
            o = { hasData: [], noData: [] };
          (r.forEach(e => {
            (e.data ? o.hasData : o.noData).push(e);
          }),
            o.hasData.forEach(e => {
              e.data && (oo[e.id] = e.data);
            }));
          const i = o.noData.map(e => e.id);
          if (i.length) {
            const e = await co(i, { forceUpdate: !0 });
            Object.assign(oo, e);
          }
          (Object.assign(oo, this.conf.localBiblio),
            (() => {
              ao(this.conf.biblio);
            })());
        }
      },
      biblio: oo,
      name: "core/biblio",
      resolveRef: uo,
      updateFromNetwork: co,
    });
    const ho = "core/render-biblio";
    function fo(e) {
      return `bib-${It(e)}`;
    }
    const mo = Ot({
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
      go = new Map([
        ["CR", "W3C Candidate Recommendation"],
        ["ED", "W3C Editor's Draft"],
        ["LCWD", "W3C Last Call Working Draft"],
        ["NOTE", "W3C Working Group Note"],
        ["PR", "W3C Proposed Recommendation"],
        ["REC", "W3C Recommendation"],
        ["WD", "W3C Working Draft"],
      ]),
      bo =
        ((yo = "."),
        e => {
          const t = e.trim();
          return !t || t.endsWith(yo) ? t : t + yo;
        });
    var yo;
    function wo(e, t) {
      const { goodRefs: n, badRefs: r } = (function (e) {
          const t = [],
            n = [];
          for (const r of e) r.refcontent ? t.push(r) : n.push(r);
          return { goodRefs: t, badRefs: n };
        })(e.map(vo)),
        o = (function (e) {
          const t = new Map();
          for (const n of e)
            t.has(n.refcontent?.id ?? "") || t.set(n.refcontent?.id ?? "", n);
          return [...t.values()];
        })(n),
        i = o
          .concat(r)
          .sort((e, t) =>
            e.ref.toLocaleLowerCase().localeCompare(t.ref.toLocaleLowerCase())
          ),
        s = ft`<section>
    <h3>${t}</h3>
    <dl class="bibliography">${i.map(xo)}</dl>
  </section>`;
      Dt(s, "", t);
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
            const r = `#${fo(e)}`,
              o = (t.get(n.id ?? "") ?? [])
                .map(e => `a.bibref[href="#${fo(e)}"]`)
                .join(",");
            return {
              refUrl: r,
              elems: document.querySelectorAll(o),
              refcontent: n,
            };
          }).forEach(({ refUrl: e, elems: t, refcontent: n }) => {
            t.forEach(t => {
              (t.setAttribute("href", e),
                t.setAttribute("title", n.title),
                (t.dataset.linkType = "biblio"));
            });
          });
        })(o, a),
        (function (e) {
          for (const { ref: t } of e) {
            const e = [
              ...document.querySelectorAll(`a.bibref[href="#${fo(t)}"]`),
            ].filter(
              ({ textContent: e }) => e.toLowerCase() === t.toLowerCase()
            );
            Zt(`Reference "[${t}]" not found.`, ho, {
              hint: `Search for ["${t}"](https://www.specref.org?q=${t}) on Specref to see if it exists or if it's misspelled.`,
              elements: e,
            });
          }
        })(r),
        s
      );
    }
    function vo(e) {
      let t = oo[e],
        n = e;
      const r = new Set([n]);
      for (; t && t.aliasOf; )
        if (r.has(t.aliasOf)) {
          t = null;
          Zt(
            `Circular reference in biblio DB between [\`${e}\`] and [\`${n}\`].`,
            ho
          );
        } else ((n = t.aliasOf), (t = oo[n]), r.add(n));
      return (
        t && !t.id && (t.id = e.toLowerCase()),
        { ref: e, refcontent: t }
      );
    }
    function ko(e, t) {
      const n = e.replace(/^(!|\?)/, ""),
        r = `#${fo(n)}`,
        o = ft`<cite
    ><a class="bibref" href="${r}" data-link-type="biblio">${t || n}</a></cite
  >`;
      return t ? o : ft`[${o}]`;
    }
    function xo(e) {
      const { ref: t, refcontent: n } = e,
        r = fo(t);
      return ft`
    <dt id="${r}">[${t}]</dt>
    <dd>
      ${
        n
          ? { html: $o(n) }
          : ft`<em class="respec-offending-element"
            >${mo.reference_not_found}</em
          >`
      }
    </dd>
  `;
    }
    function $o(e) {
      if ("string" == typeof e) return e;
      let t = `<cite>${e.title}</cite>`;
      if (
        ((t = e.href ? `<a href="${e.href}">${t}</a>. ` : `${t}. `), e.authors)
      ) {
        if (!Array.isArray(e.authors)) {
          const t = `The "authors" field in reference "${e.id || e.title}" must be an array.`,
            n = `Use \`authors: [${JSON.stringify(e.authors)}]\` instead of \`authors: ${JSON.stringify(e.authors)}\`.`;
          (Zt(t, ho, { hint: n }), (e.authors = [e.authors]));
        }
        e.authors.length &&
          ((t += e.authors.join("; ")),
          e.etAl && (t += " et al"),
          t.endsWith(".") || (t += ". "));
      }
      return (
        e.publisher && (t = `${t} ${bo(e.publisher)} `),
        e.date && (t += `${e.date}. `),
        e.status && (t += `${go.get(e.status) || e.status}. `),
        e.href && (t += `URL: <a href="${e.href}">${e.href}</a>`),
        t
      );
    }
    var Eo = Object.freeze({
      __proto__: null,
      name: ho,
      renderInlineCitation: ko,
      run: function (e) {
        const t = Array.from(e.informativeReferences),
          n = Array.from(e.normativeReferences);
        if (!t.length && !n.length) return;
        const r =
          document.querySelector("section#references") ||
          ft`<section id="references"></section>`;
        if (
          (document.querySelector("section#references > :is(h2, h1)") ||
            r.prepend(ft`<h1>${mo.references}</h1>`),
          r.classList.add("appendix"),
          n.length)
        ) {
          const e = wo(n, mo.norm_references);
          r.appendChild(e);
        }
        if (t.length) {
          const e = wo(t, mo.info_references);
          r.appendChild(e);
        }
        document.body.appendChild(r);
      },
    });
    const So = "core/inlines",
      _o = {},
      Co = e => new RegExp(e.map(e => e.source).join("|")),
      Lo = Ot({
        en: {
          rfc2119Keywords: () =>
            Co([
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
            Co([
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
      Ao = /(?:`[^`]+`)(?!`)/,
      To = /(?:{{[^}]+\?*}})/,
      Ro = /\B\|\w[\w\s]*(?:\s*:[\w\s&;"?<>]+\??)?\|\B/,
      Oo = /(?:\[\[(?:!|\\|\?)?[\w.-]+(?:|[^\]]+)?\]\])/,
      No = /(?:\[\[\[(?:!|\\|\?)?#?[\w-.]+\]\]\])/,
      Po = /(?:\[=[^=]+=\])/,
      Io = /(?:\[\^[^^]+\^\])/,
      Do = /(?:\{\^[^}^]+\^\})/;
    function jo(e) {
      const t = e.slice(2, -2).trim(),
        [n, r, o] = t
          .split("/", 3)
          .map(e => e && e.trim())
          .filter(e => !!e),
        [i, s, a] = t.startsWith("/")
          ? ["element-attr", null, n]
          : o
            ? ["attr-value", `${n}/${r}`, o]
            : r
              ? ["element-attr", n, r]
              : ["element", null, n];
      return ft`<code
    ><a
      data-xref-type="${i}"
      data-xref-for="${s}"
      data-link-type="${i}"
      data-link-for="${s}"
      >${a}</a
    ></code
  >`;
    }
    function zo(e) {
      const t = (
        e
          .slice(2, -2)
          .trim()
          .match(/"([^"]*)"|([^/]+)/g) || []
      ).map(e => e.trim());
      if (1 === t.length) {
        const e = t[0];
        return ft`<code
      ><a data-link-type="cddl-type" data-xref-type="cddl-type"
        >${e}</a
      ></code
    >`;
      }
      const n = t[0],
        r = t[1],
        o = r.startsWith('"') && r.endsWith('"') ? "cddl-value" : "cddl-key";
      return ft`<code
    ><a
      data-link-type="${o}"
      data-xref-type="${o}"
      data-xref-for="${n}"
      data-link-for="${n}"
      >${r}</a
    ></code
  >`;
    }
    function Mo(e) {
      const t = Rt(e),
        n = ft`<em class="rfc2119">${t}</em>`;
      return ((_o[t] = !0), n);
    }
    function qo(e) {
      const t = e.slice(3, -3).trim();
      return t.startsWith("#")
        ? ft`<a href="${t}" data-matched-text="${e}"></a>`
        : ft`<a data-cite="${t}" data-matched-text="${e}"></a>`;
    }
    function Ho(e, t) {
      const n = Rt(e.slice(2, -2));
      if (n.startsWith("\\")) return e.replace(/^(\{\{\s*)\\/, "$1");
      const r = eo(n);
      return !!t.parentElement?.closest("dfn,a")
        ? Go(`\`${r.textContent}\``)
        : r;
    }
    function Bo(e, t, n) {
      const r = e.slice(2, -2);
      if (r.startsWith("\\")) return [`[[${r.slice(1)}]]`];
      const [o, i] = r.split("|").map(Rt),
        { type: s, illegal: a } = Mt(o, t.parentElement),
        l = ko(o, i),
        c = o.replace(/^(!|\?)/, "");
      if (a && !n.normativeReferences.has(c)) {
        const e = l.childNodes[1] || l;
        Yt(
          "Normative references in informative sections are not allowed. ",
          So,
          {
            elements: [e],
            hint: `Remove '!' from the start of the reference \`[[${r}]]\``,
          }
        );
      }
      return (
        "informative" !== s || a
          ? n.normativeReferences.add(c)
          : n.informativeReferences.add(c),
        l.childNodes[1] ? l.childNodes : [l]
      );
    }
    function Fo(e, t, n) {
      return "ABBR" === t.parentElement?.tagName
        ? e
        : ft`<abbr title="${n.get(e)}">${e}</abbr>`;
    }
    function Wo(e) {
      const t = e.slice(1, -1).split(":", 2),
        [n, r] = t.map(e => e.trim());
      return ft`<var data-type="${r}">${n}</var>`;
    }
    function Uo(e) {
      const t = (function (e) {
          const t = e => e.replace("%%", "/").split("/").map(Rt).join("/"),
            n = e.replace("\\/", "%%"),
            r = n.lastIndexOf("/");
          if (-1 === r) return [t(n)];
          const o = n.substring(0, r),
            i = n.substring(r + 1, n.length);
          return [t(o), t(i)];
        })((e = e.slice(2, -2))),
        [n, r] = 2 === t.length ? t : [null, t[0]],
        [o, i] = r.includes("|")
          ? r.split("|", 2).map(e => e.trim())
          : [null, r],
        s = Vo(i),
        a = n ? Rt(n) : null;
      return ft`<a
    data-link-type="dfn|abstract-op"
    data-link-for="${a}"
    data-xref-for="${a}"
    data-lt="${o}"
    >${s}</a
  >`;
    }
    function Go(e) {
      const t = e.slice(1, -1);
      return ft`<code>${t}</code>`;
    }
    function Vo(e) {
      return Ao.test(e)
        ? e
            .split(/(`[^`]+`)(?!`)/)
            .map(e => (e.startsWith("`") ? Go(e) : Vo(e)))
        : document.createTextNode(e);
    }
    var Zo = Object.freeze({
      __proto__: null,
      name: So,
      rfc2119Usage: _o,
      run: function (e) {
        const t = new Map();
        (document.normalize(),
          document.querySelector("section#conformance") ||
            document.body.classList.add("informative"),
          (e.normativeReferences = new Bt()),
          (e.informativeReferences = new Bt()),
          e.respecRFC2119 || (e.respecRFC2119 = _o));
        const n = document.querySelectorAll("abbr[title]:not(.exclude)");
        for (const { textContent: e, title: r } of n) {
          const n = Rt(e),
            o = Rt(r);
          t.set(n, o);
        }
        const r = t.size
            ? new RegExp(
                `(?:\\b${[...t.keys()].map(e => vt(e)).join("\\b)|(?:\\b")}\\b)`
              )
            : null,
          o = (function (e, t = [], n = { wsNodes: !0 }) {
            const r = t.join(", "),
              o = document.createNodeIterator(e, NodeFilter.SHOW_TEXT, {
                acceptNode: e =>
                  n.wsNodes || e.data.trim()
                    ? r && e.parentElement?.closest(r)
                      ? NodeFilter.FILTER_REJECT
                      : NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT,
              }),
              i = [];
            let s;
            for (; (s = o.nextNode()); ) i.push(s);
            return i;
          })(
            document.body,
            ["#respec-ui", ".head", "pre", "svg", "script", "style"],
            { wsNodes: !1 }
          ),
          i = Lo.rfc2119Keywords(),
          s = new RegExp(
            `(${Co([i, To, Do, Ro, Oo, No, Po, Ao, Io, ...(r ? [r] : [])]).source})`
          );
        for (const n of o) {
          const r = n.data.split(s);
          if (1 === r.length) continue;
          const o = document.createDocumentFragment();
          let a = !0;
          for (const s of r)
            if (((a = !a), a))
              switch (!0) {
                case s.startsWith("{{"):
                  o.append(Ho(s, n));
                  break;
                case s.startsWith("{^"):
                  o.append(zo(s));
                  break;
                case s.startsWith("[[["):
                  o.append(qo(s));
                  break;
                case s.startsWith("[["):
                  o.append(...Bo(s, n, e));
                  break;
                case s.startsWith("|"):
                  o.append(Wo(s));
                  break;
                case s.startsWith("[="):
                  o.append(Uo(s));
                  break;
                case s.startsWith("`"):
                  o.append(Go(s));
                  break;
                case s.startsWith("[^"):
                  o.append(jo(s));
                  break;
                case t.has(s):
                  o.append(Fo(s, n, t));
                  break;
                case i.test(s):
                  o.append(Mo(s));
              }
            else o.append(s);
          n.replaceWith(o);
        }
      },
    });
    const Yo = "aom/conformance",
      Ko = Ot({
        en: {
          conformance: "Conformance",
          normativity:
            "As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.",
          keywordInterpretation: (e, t) => ft`<p>
        The key word${t ? "s" : ""} ${e} in this document
        ${t ? "are" : "is"} to be interpreted as described in
        <a href="https://www.rfc-editor.org/info/bcp14">BCP 14</a>
        ${ko("RFC2119")} ${ko("RFC8174")}
        when, and only when, ${t ? "they appear" : "it appears"} in all
        capitals, as shown here.
      </p>`,
        },
      });
    function Xo(e, t) {
      const n = [...Object.keys(_o)];
      n.length &&
        (t.normativeReferences.add("RFC2119"),
        t.normativeReferences.add("RFC8174"));
      const r =
        ((o = n.sort()),
        []
          .concat(Lt(o, e => ft`<em class="rfc2119">${e}</em>`))
          .map(e => ("string" == typeof e ? ft`${e}` : e)));
      var o;
      const i = n.length > 1,
        s = ft`
    <h1>${Ko.conformance}</h1>
    <p>${Ko.normativity}</p>
    ${n.length ? Ko.keywordInterpretation(r, i) : null}
  `;
      e.prepend(...s.childNodes);
    }
    var Qo = Object.freeze({
      __proto__: null,
      name: Yo,
      run: function (e) {
        const t = document.querySelector("section#conformance");
        if (
          (t && !t.classList.contains("override") && Xo(t, e),
          !t && Object.keys(_o).length)
        ) {
          Yt(
            "Document uses RFC2119 keywords but lacks a conformance section.",
            Yo,
            { hint: 'Please add a `<section id="conformance">`.' }
          );
        }
      },
    });
    function Jo(e, t, n, r) {
      try {
        switch (t) {
          case "element-attr":
            return (document.createAttribute(e), !0);
          case "element":
            return (document.createElement(e), !0);
        }
      } catch (o) {
        Zt(`Invalid ${t} name "${e}": ${o.message}`, r, {
          hint: `Check that the ${t} name is allowed per the XML's Name production for ${t}.`,
          elements: [n],
        });
      }
      return !1;
    }
    function ei(e, t, n, r) {
      if (/^[a-z]+(-[a-z]+)*$/i.test(e)) return !0;
      return (
        Zt(`Invalid ${t} name "${e}".`, r, {
          hint: `Check that the ${t} name is allowed per the naming rules for this type.`,
          elements: [n],
        }),
        !1
      );
    }
    const ti = new Gt();
    function ni(e, t) {
      for (const n of t) (ti.has(n) || ti.set(n, new Set()), ti.get(n)?.add(e));
    }
    const ri = "core/dfn",
      oi = new Map([
        ["abstract-op", { requiresFor: !1 }],
        [
          "attr-value",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: ei,
          },
        ],
        ["element", { requiresFor: !1, validator: Jo }],
        ["element-attr", { requiresFor: !1, validator: Jo }],
        [
          "element-state",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: ei,
          },
        ],
        ["event", { requiresFor: !1, validator: ei }],
        ["http-header", { requiresFor: !1 }],
        [
          "media-type",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              try {
                const t = new bt(e);
                if (t.toString() !== e)
                  throw new Error(
                    `Input doesn't match its canonical form: "${t}".`
                  );
              } catch (o) {
                return (
                  Zt(`Invalid ${t} "${e}": ${o.message}.`, r, {
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
        ["scheme", { requiresFor: !1, validator: ei }],
        [
          "permission",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              return e.startsWith('"') && e.endsWith('"')
                ? ei(e.slice(1, -1), t, n, r)
                : (Zt(`Invalid ${t} "${e}".`, r, {
                    hint: `Check that the ${t} is quoted with double quotes.`,
                    elements: [n],
                  }),
                  !1);
            },
          },
        ],
      ]),
      ii = [...oi.keys()];
    function si(e, t) {
      let n = "";
      switch (!0) {
        case ii.some(t => e.classList.contains(t)):
          ((n = [...e.classList].find(e => oi.has(e)) ?? ""),
            (function (e, t, n) {
              const r = oi.get(t);
              if (r?.requiresFor && !n.dataset.dfnFor) {
                const e = Jt`Definition of type "\`${t}\`" requires a ${"[data-dfn-for]"} attribute.`,
                  { associateWith: o } = r,
                  i = Jt`Use a ${"[data-dfn-for]"} attribute to associate this with ${o ?? ""}.`;
                Zt(e, ri, { hint: i, elements: [n] });
              }
              r?.validator && r.validator(e, t, n, ri);
            })(t, n, e));
          break;
        case Mr.test(t):
          n = (function (e, t) {
            t.dataset.hasOwnProperty("idl") || (t.dataset.idl = "");
            const n = t.closest("[data-dfn-for]");
            t !== n &&
              n?.dataset.dfnFor &&
              (t.dataset.dfnFor = n.dataset.dfnFor);
            if (!t.dataset.dfnFor) {
              const n = Jt`Use a ${"[data-dfn-for]"} attribute to associate this dfn with a WebIDL interface.`;
              Zt(
                `Internal slot "${e}" must be associated with a WebIDL interface.`,
                ri,
                { hint: n, elements: [t] }
              );
            }
            t.matches(".export, [data-export]") || (t.dataset.noexport = "");
            const r = e.endsWith(")") ? "method" : "attribute";
            if (!t.dataset.dfnType) return r;
            const o = ["attribute", "method"],
              { dfnType: i } = t.dataset;
            if (!o.includes(i) || r !== i) {
              const n = Jt`Invalid ${"[data-dfn-type]"} attribute on internal slot.`,
                i = `The only allowed types are: ${Qt(o, { quotes: !0 })}. The slot "${e}" seems to be a "${Xt(r)}"?`;
              return (Zt(n, ri, { hint: i, elements: [t] }), "dfn");
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
    function ai(e) {
      switch (!0) {
        case e.matches(".export.no-export"):
          Zt(
            Jt`Declares both "${"[no-export]"}" and "${"[export]"}" CSS class.`,
            ri,
            { elements: [e], hint: "Please use only one." }
          );
          break;
        case e.matches(".no-export, [data-noexport]"):
          if (e.matches("[data-export]")) {
            (Zt(
              Jt`Declares ${"[no-export]"} CSS class, but also has a "${"[data-export]"}" attribute.`,
              ri,
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
    var li = Object.freeze({
      __proto__: null,
      name: ri,
      run: function () {
        for (const e of document.querySelectorAll("dfn")) {
          const t = jt(e);
          if ((ni(e, t), e.dataset.cite && /\b#\b/.test(e.dataset.cite)))
            continue;
          const [n] = t;
          (si(e, n), ai(e));
          const r = (e.dataset.localLt || "").split("|").map(Rt),
            o = t.filter(e => !r.includes(e));
          (o.length > 1 || n !== Rt(e.textContent)) &&
            (e.dataset.lt = o.join("|"));
        }
      },
    });
    var ci = Object.freeze({
      __proto__: null,
      name: "core/pluralize",
      run: function (e) {
        if (!e.pluralize) return;
        const t = (function () {
          const e = new Set();
          document.querySelectorAll("a:not([href])").forEach(t => {
            const n = Rt(t.textContent).toLowerCase();
            (e.add(n), t.dataset.lt && e.add(t.dataset.lt));
          });
          const t = new Set(),
            n = document.querySelectorAll("dfn:not([data-lt-noDefault])");
          return (
            n.forEach(e => {
              const n = Rt(e.textContent).toLowerCase();
              (t.add(n),
                e.dataset.lt && e.dataset.lt.split("|").forEach(e => t.add(e)),
                e.dataset.localLt &&
                  e.dataset.localLt.split("|").forEach(e => t.add(e)));
            }),
            function (n) {
              const r = Rt(n).toLowerCase(),
                o = yt.isSingular(r) ? yt.plural(r) : yt.singular(r);
              return e.has(o) && !t.has(o) ? o : "";
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
              ((e.dataset.plurals = n.join("|")), ni(e, n));
            }
          });
      },
    });
    var ui = String.raw`span.example-title{text-transform:none}
:is(aside,div).example,div.illegal-example{padding:.5em;margin:1em 0;position:relative;clear:both}
div.illegal-example{color:red}
div.illegal-example p{color:#000}
aside.example div.example{border-left-width:.1em;border-color:#999;background:#fff}`;
    const di = Ot({
      en: { example: "Example" },
      nl: { example: "Voorbeeld" },
      es: { example: "Ejemplo" },
      ko: { example: "예시" },
      ja: { example: "例" },
      de: { example: "Beispiel" },
      zh: { example: "例" },
      cs: { example: "Příklad" },
    });
    function pi(e, t, n) {
      ((n.title = e.title), n.title && e.removeAttribute("title"));
      const r = t > 0 ? ` ${t}` : "",
        o = n.title ? ft`<span class="example-title">: ${n.title}</span>` : "";
      return ft`<div class="marker">
    <a class="self-link">${di.example}<bdi>${r}</bdi></a
    >${o}
  </div>`;
    }
    var hi = Object.freeze({
      __proto__: null,
      name: "core/examples",
      run: function () {
        const e = document.querySelectorAll(
          "pre.example, pre.illegal-example, aside.example"
        );
        if (!e.length) return;
        document.head.insertBefore(
          ft`<style>
      ${ui}
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
            const o = pi(e, t, n);
            e.prepend(o);
            const i = Dt(e, "example", r || String(t));
            o.querySelector("a.self-link").href = `#${i}`;
          } else {
            const o = !!e.closest("aside");
            (o || ++t,
              (n.content = e.innerHTML),
              e.classList.remove("example", "illegal-example"));
            const i = e.id ? e.id : null;
            i && e.removeAttribute("id");
            const s = pi(e, o ? 0 : t, n),
              a = ft`<div class="example" id="${i}">
        ${s} ${e.cloneNode(!0)}
      </div>`;
            Dt(a, "example", r || String(t));
            ((a.querySelector("a.self-link").href = `#${a.id}`),
              e.replaceWith(a));
          }
        });
      },
    });
    var fi = String.raw`.issue-label{text-transform:initial}
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
    const mi = "core/issues-notes",
      gi = Ot({
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
    function bi(e, t, n) {
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
        o = document.createElement("ul");
      (e.forEach(e => {
        const {
            type: i,
            displayType: s,
            isFeatureAtRisk: a,
          } = (function (e) {
            const t = e.classList.contains("issue"),
              n = e.classList.contains("warning"),
              r = e.classList.contains("ednote"),
              o = e.classList.contains("atrisk"),
              i = t ? "issue" : n ? "warning" : r ? "ednote" : "note",
              s = t
                ? o
                  ? gi.feature_at_risk
                  : gi.issue
                : n
                  ? gi.warning
                  : r
                    ? gi.editors_note
                    : gi.note;
            return { type: i, displayType: s, isFeatureAtRisk: o };
          })(e),
          l = "issue" === i,
          c = "span" === e.localName,
          { number: u } = e.dataset,
          d = { title: e.title, number: r(e) };
        if (!c) {
          const r = ft`<div class="${a ? `${i} atrisk` : i}" role="${"note" === i ? "note" : null}"></div>`,
            c = document.createElement("span"),
            p = ft`<div class="${`${i}-title marker`}">${c}</div>`;
          Dt(p, "h", i);
          let h,
            f = s;
          if (
            (e.id
              ? ((r.id = e.id), e.removeAttribute("id"))
              : Dt(r, "issue-container", d.number ? `number-${d.number}` : ""),
            l)
          ) {
            if (
              (void 0 !== d.number && (f += ` ${d.number}`),
              e.dataset.hasOwnProperty("number"))
            ) {
              const e = (function (e, t, { isFeatureAtRisk: n = !1 } = {}) {
                if (!n && t.issueBase)
                  return ft`<a href="${t.issueBase + e}" />`;
                if (n && t.atRiskBase)
                  return ft`<a href="${t.atRiskBase + e}" />`;
              })(u ?? "", n, { isFeatureAtRisk: a });
              if (
                (e && (c.before(e), e.append(c)),
                c.classList.add("issue-number"),
                (h = t.get(u ?? "")),
                !h)
              ) {
                Yt(`Failed to fetch issue number ${u}.`, mi);
              }
              h && !d.title && (d.title = h.title);
            }
            o.append(
              (function (e, t, n) {
                const r = `${e}${t.number ? ` ${t.number}` : ""}`,
                  o = t.title
                    ? ft`<span style="text-transform: none">: ${t.title}</span>`
                    : "";
                return ft`<li><a href="${`#${n}`}">${r}</a>${o}</li>`;
              })(gi.issue, d, r.id)
            );
          }
          if (((c.textContent = f), d.title)) {
            e.removeAttribute("title");
            const { repoURL: t = "" } = n.github || {},
              o = h ? h.labels : [];
            (h && "CLOSED" === h.state && r.classList.add("closed"),
              p.append(
                (function (e, t, n) {
                  const r = e.map(e =>
                    (function (e, t) {
                      const { color: n, name: r } = e,
                        o = new URL("./issues/", t);
                      o.searchParams.set(
                        "q",
                        `is:issue is:open label:"${e.name}"`
                      );
                      const i = (function (e) {
                          const [t, n, r] = [
                              e.slice(0, 2),
                              e.slice(2, 4),
                              e.slice(4, 6),
                            ],
                            [o, i, s] = [t, n, r]
                              .map(e => parseInt(e, 16) / 255)
                              .map(e =>
                                e <= 0.04045
                                  ? e / 12.92
                                  : ((e + 0.055) / 1.055) ** 2.4
                              ),
                            a = 0.2126 * o + 0.7152 * i + 0.0722 * s;
                          return a > 0.179 ? "#000" : "#fff";
                        })(n),
                        s = `background-color: #${n}; color: ${i}`,
                        a = `GitHub label: ${r}`;
                      return ft` <a
    class="respec-gh-label"
    style="${s}"
    href="${o.href}"
    aria-label="${a}"
    >${r}</a
  >`;
                    })(e, n)
                  );
                  r.length && r.unshift(document.createTextNode(" "));
                  return ft`<span class="issue-label">: ${t}${r}</span>`;
                })(o, d.title, t)
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
        }
      }),
        (function (e) {
          const t = document.getElementById("issue-summary");
          if (!t) return;
          const n = t.querySelector("h2, h3, h4, h5, h6");
          (e.hasChildNodes()
            ? t.append(e)
            : t.append(ft`<p>${gi.no_issues_in_spec}</p>`),
            (!n || (n && n !== t.firstElementChild)) &&
              t.insertAdjacentHTML(
                "afterbegin",
                `<h1>${gi.issue_summary}</h1>`
              ));
        })(o));
    }
    var yi = Object.freeze({
      __proto__: null,
      name: mi,
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
                Zt(
                  `Error fetching issues from GitHub. (HTTP Status ${r.status}).`,
                  mi
                ),
                new Map()
              );
            const o = await r.json();
            return new Map(Object.entries(o));
          })(e.github ?? null),
          { head: o } = document;
        (o.insertBefore(
          ft`<style>
      ${fi}
    </style>`,
          o.querySelector("link")
        ),
          bi(n, r, e),
          document.querySelectorAll(".ednote").forEach(e => {
            (e.classList.remove("ednote"), e.classList.add("note"));
          }));
      },
    });
    const wi = "core/best-practices",
      vi = {
        en: { best_practice: "Best Practice " },
        ja: { best_practice: "最良実施例 " },
        de: { best_practice: "Musterbeispiel " },
        zh: { best_practice: "最佳实践 " },
      },
      ki = Ot(vi),
      xi = i in vi ? i : "en";
    var $i = Object.freeze({
      __proto__: null,
      name: wi,
      run: function () {
        const e = document.querySelectorAll(".practicelab"),
          t = document.getElementById("bp-summary"),
          n = t ? document.createElement("ul") : null;
        if (
          ([...e].forEach((e, t) => {
            const r = Dt(e, "bp"),
              o = ft`<a class="marker self-link" href="${`#${r}`}"
      ><bdi lang="${xi}">${ki.best_practice}${t + 1}</bdi></a
    >`;
            if (n) {
              const t = ft`<li>${o}: ${Ft(e)}</li>`;
              n.appendChild(t);
            }
            const i = e.closest("div");
            if (!i) return void e.classList.add("advisement");
            i.classList.add("advisement");
            const s = ft`${o.cloneNode(!0)}: ${e}`;
            i.prepend(...s.childNodes);
          }),
          e.length)
        )
          t &&
            (t.appendChild(ft`<h1>Best Practices Summary</h1>`),
            n && t.appendChild(n));
        else if (t) {
          (Yt(
            "Using best practices summary (#bp-summary) but no best practices found.",
            wi
          ),
            t.remove());
        }
      },
    });
    const Ei = "core/figures",
      Si = Ot({
        en: { list_of_figures: "List of Figures", fig: "Figure " },
        ja: { fig: "図 ", list_of_figures: "図のリスト" },
        ko: { fig: "그림 ", list_of_figures: "그림 목록" },
        nl: { fig: "Figuur ", list_of_figures: "Lijst met figuren" },
        es: { fig: "Figura ", list_of_figures: "Lista de Figuras" },
        zh: { fig: "图 ", list_of_figures: "规范中包含的图" },
        de: { fig: "Abbildung", list_of_figures: "Abbildungsverzeichnis" },
      });
    var _i = Object.freeze({
      __proto__: null,
      name: Ei,
      run: function () {
        const e = (function () {
            const e = [];
            return (
              document.querySelectorAll("figure").forEach((t, n) => {
                const r = t.querySelector("figcaption");
                if (r)
                  (!(function (e, t, n) {
                    const r = t.textContent;
                    (Dt(e, "fig", r),
                      qt(t, ft`<span class="fig-title"></span>`),
                      t.prepend(
                        ft`<a class="self-link" href="#${e.id}"
      >${Si.fig}<bdi class="figno">${n + 1}</bdi></a
    >`,
                        " "
                      ));
                  })(t, r, n),
                    e.push(
                      (function (e, t) {
                        const n = t.cloneNode(!0);
                        return (
                          n.querySelectorAll("a").forEach(e => {
                            zt(e, "span").removeAttribute("href");
                          }),
                          ft`<li class="tofline">
    <a class="tocxref" href="${`#${e}`}">${n.childNodes}</a>
  </li>`
                        );
                      })(t.id, r)
                    ));
                else {
                  Yt("Found a `<figure>` without a `<figcaption>`.", Ei, {
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
            ft`<h1>${Si.list_of_figures}</h1>`,
            ft`<ul class="tof">
        ${e}
      </ul>`
          ));
      },
    });
    const Ci = "core/data-cite",
      Li = "__SPEC__";
    async function Ai(e) {
      const { key: t, frag: n, path: r, href: o } = e;
      let i = "",
        s = "";
      if (t === Li) i = document.location.href;
      else {
        const e = await uo(t);
        if (!e) return null;
        ((i = e.href ?? ""), (s = e.title));
      }
      if (o) i = o;
      else {
        if (r) {
          const e = r.startsWith("/") ? `.${r}` : r;
          i = new URL(e, i).href;
        }
        n && (i = new URL(n, i).href);
      }
      return { href: i, title: s };
    }
    function Ti(e, t, n) {
      const { href: r, title: o } = t,
        i = !n.path && !n.frag;
      switch (e.localName) {
        case "a": {
          const t = e;
          if (
            ("" === t.textContent &&
              "the-empty-string" !== t.dataset.lt &&
              (t.textContent = o),
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
            e.textContent ? qt(e, t) : ((t.textContent = o), e.append(t)),
            i)
          ) {
            const n = document.createElement("cite");
            (n.append(t), e.append(n));
          }
          if ("export" in e.dataset) {
            (Zt("Exporting a linked external definition is not allowed.", Ci, {
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
    function Ri(e) {
      return t => {
        const n = t.search(e);
        return -1 !== n ? t.substring(n) : "";
      };
    }
    const Oi = Ri("#"),
      Ni = Ri("/");
    function Pi(e) {
      const { dataset: t } = e,
        { cite: n, citeFrag: r, citePath: o, citeHref: i } = t;
      if ((n ?? "").startsWith("#") && !r) {
        const r =
            e.parentElement?.closest('[data-cite]:not([data-cite^="#"])') ??
            null,
          { key: o, isNormative: i } = r ? Pi(r) : { key: Li, isNormative: !1 };
        return (
          (t.cite = i ? o : `?${o}`),
          (t.citeFrag = (n ?? "").replace("#", "")),
          Pi(e)
        );
      }
      const s = r ? `#${r}` : Oi(n ?? ""),
        a = o || Ni(n ?? "").split("#")[0],
        { type: l } = Mt(n ?? "", e),
        c = "normative" === l,
        u = /^[?|!]/.test(n ?? "");
      return {
        key: (n ?? "").split(/[/|#]/)[0].substring(Number(u)),
        isNormative: c,
        frag: s,
        path: a,
        href: i,
      };
    }
    function Ii(e) {
      const t = ["data-cite", "data-cite-frag", "data-cite-path"];
      e.querySelectorAll("a[data-cite], dfn[data-cite]").forEach(e =>
        t.forEach(t => e.removeAttribute(t))
      );
    }
    var Di = Object.freeze({
      __proto__: null,
      THIS_SPEC: Li,
      name: Ci,
      run: async function () {
        const e = document.querySelectorAll(
          "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
        );
        await (async function (e) {
          const t = e
              .map(Pi)
              .map(async e => ({ entry: e, result: await uo(e.key) })),
            n = (await Promise.all(t))
              .filter(({ result: e }) => null === e)
              .map(({ entry: { key: e } }) => e),
            r = await co(n);
          r && Object.assign(oo, r);
        })([...e]);
        for (const t of e) {
          const e = t.dataset.cite,
            n = Pi(t),
            r = await Ai(n);
          if (r) Ti(t, r, n);
          else {
            const n = `Couldn't find a match for "${e}"`;
            (t.dataset.matchedText && (t.textContent = t.dataset.matchedText),
              Yt(n, Ci, { elements: [t] }));
          }
        }
        rn("beforesave", Ii);
      },
      toCiteDetails: Pi,
    });
    const ji = "core/link-to-dfn",
      zi = [],
      Mi = {
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
      qi = Ot(Mi);
    function Hi(e) {
      const t = new Map(),
        n = [];
      for (const r of ti.get(e) ?? []) {
        const { dfnType: o = "dfn" } = r.dataset,
          i = r.dataset.dfnFor?.split(",").map(e => e.trim()) ?? [""];
        for (const s of i) {
          if (t.has(s) && t.get(s)?.has(o)) {
            const e = t.get(s)?.get(o),
              i = "dfn" === e?.localName,
              a = "dfn" === r.localName,
              l = o === (e?.dataset.dfnType || "dfn"),
              c =
                (!s && !e?.dataset.dfnFor) ||
                e?.dataset.dfnFor
                  ?.split(",")
                  .map(e => e.trim())
                  .includes(s);
            if (i && a && l && c) {
              n.push(r);
              continue;
            }
          }
          (t.has(s) || t.set(s, new Map()),
            t.get(s)?.set(o, r),
            ("idl" in r.dataset || "dfn" !== o) && t.get(s)?.set("idl", r),
            Dt(r, "dfn", e));
        }
      }
      return { result: t, duplicates: n };
    }
    function Bi(e, t) {
      const n = (function (e) {
          const t = e.closest("[data-link-for]"),
            n = t ? (t.dataset.linkFor ?? "") : "",
            r = jt(e).reduce((e, r) => {
              const o = r.split(".");
              return (
                2 === o.length && e.push({ for: o[0], title: o[1] }),
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
      const o = t.get(r.title)?.get(r.for),
        { linkType: i } = e.dataset;
      if (i) {
        for (const e of i.split("|")) if (o?.get(e)) return o.get(e);
        return o?.get("dfn");
      }
      {
        const e = r.for ? "idl" : "dfn";
        return o?.get(e) || o?.get("idl");
      }
    }
    function Fi(e, t, n) {
      let r = !1;
      const { linkFor: o } = e.dataset,
        { dfnFor: i } = t.dataset;
      if (t.dataset.cite) e.dataset.cite = t.dataset.cite;
      else if (
        o &&
        !n.get(o) &&
        i &&
        !i
          .split(",")
          .map(e => e.trim())
          .includes(o)
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
              o = Wi(e) && Wi(t, n);
            (r && !o) || qt(e, document.createElement("code"));
          })(e, t),
        !r
      );
    }
    function Wi(e, t = "") {
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
    function Ui(e) {
      e.forEach(e => {
        const t = `Found linkless \`<a>\` element with text "${e.textContent}" but no matching \`<dfn>\``,
          n = e.closest("[data-link-for]"),
          r = `Add a matching \`<dfn>\` element, ${Jt`use ${"[data-cite]"} to link to an external definition, or enable ${"[xref]"} for automatic cross-spec linking.`}${n ? ` This link is inside a \`data-link-for="${n.dataset.linkFor}"\` section — \`[=term=]\` links are scoped to that context. To link to a global concept instead, either add \`data-link-for=""\` on this \`<a>\` or move it outside the scoped section.` : ""}`;
        Yt(t, ji, {
          title: "Linking error: no matching `<dfn>`",
          hint: r,
          elements: [e],
        });
      });
    }
    var Gi = Object.freeze({
      __proto__: null,
      name: ji,
      possibleExternalLinks: zi,
      run: async function (e) {
        const t = (function () {
            const e = new Gt();
            for (const t of ti.keys()) {
              const { result: n, duplicates: r } = Hi(t);
              (e.set(t, n),
                r.length > 0 &&
                  Zt(qi.duplicateMsg(t), ji, {
                    title: qi.duplicateTitle,
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
            zi.push(e);
            continue;
          }
          const r = Bi(e, t);
          if (r) {
            Fi(e, r, t) || zi.push(e);
          } else "" === e.dataset.cite ? n.push(e) : zi.push(e);
        }
        (Ui(n),
          (function (e) {
            const { shortName: t = "" } = e,
              n = new RegExp(String.raw`^([?!])?${vt(t)}\b([^-])`, "i"),
              r = document.querySelectorAll(
                "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
              );
            for (const t of r) {
              t.dataset.cite = (t.dataset.cite ?? "").replace(n, `$1${Li}$2`);
              const { key: r, isNormative: o } = Pi(t);
              r !== Li &&
                (o || e.normativeReferences.has(r)
                  ? (e.normativeReferences.add(r),
                    e.informativeReferences.delete(r))
                  : e.informativeReferences.add(r));
            }
          })(e),
          e.xref || Ui(zi));
      },
    });
    const Vi = "core/contrib";
    var Zi = Object.freeze({
      __proto__: null,
      name: Vi,
      run: async function (e) {
        if (!document.getElementById("gh-contributors")) return;
        if (!e.github) {
          return void Zt(
            Jt`Requested list of contributors from GitHub, but ${"[github]"} configuration option is not set.`,
            Vi
          );
        }
        const t = (e.editors ?? []).map(e => e.name),
          n = `${e.github.apiBase}/${e.github.fullName}/`;
        await (async function (e, t) {
          const n = document.getElementById("gh-contributors");
          if (!n) return;
          n.textContent = "Fetching list of contributors...";
          const r = await o();
          null !== r
            ? (function (e, t) {
                const n = e.sort((e, t) => {
                  const n = e.name || e.login,
                    r = t.name || t.login;
                  return n.toLowerCase().localeCompare(r.toLowerCase());
                });
                if ("UL" === t.tagName)
                  return void ft(
                    t
                  )`${n.map(({ name: e, login: t }) => `<li><a href="https://github.com/${t}">${e || t}</a></li>`)}`;
                const r = n.map(e => e.name || e.login);
                t.textContent = Tt(r);
              })(r, n)
            : (n.textContent = "Failed to fetch contributors.");
          async function o() {
            const { href: n } = new URL("contributors", t);
            try {
              const t = await (async function (e, t = 864e5) {
                const n = new Request(e),
                  r = new URL(n.url);
                let o, i;
                if ("caches" in window)
                  try {
                    if (
                      ((o = await caches.open(r.origin)),
                      (i = await o.match(n)),
                      i &&
                        new Date(i.headers.get("Expires") ?? "") > new Date())
                    )
                      return i;
                  } catch (e) {
                    console.error("Failed to use Cache API.", e);
                  }
                const s = await fetch(n);
                if (!s.ok && i)
                  return (
                    console.warn(`Returning a stale cached response for ${r}`),
                    i
                  );
                if (o && s.ok) {
                  const e = s.clone(),
                    r = new Headers(s.headers),
                    i = new Date(Date.now() + t);
                  r.set("Expires", i.toISOString());
                  const a = new Response(await e.blob(), { headers: r });
                  await o.put(n, a).catch(console.error);
                }
                return s;
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
                Zt("Error loading contributors from GitHub.", Vi, { cause: e }),
                null
              );
            }
          }
        })(t, n);
      },
    });
    var Yi = Object.freeze({
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
            zt(e, `h${t}`);
          });
      },
    });
    const Ki = ["h2", "h3", "h4", "h5", "h6"],
      Xi = "core/structure",
      Qi = Ot({
        en: { toc: "Table of Contents", back_to_top: "Back to Top" },
        zh: { toc: "内容大纲", back_to_top: "返回顶部" },
        ko: { toc: "목차", back_to_top: "맨 위로" },
        ja: { toc: "目次", back_to_top: "先頭に戻る" },
        nl: { toc: "Inhoudsopgave", back_to_top: "Terug naar boven" },
        es: { toc: "Tabla de Contenidos", back_to_top: "Volver arriba" },
        de: { toc: "Inhaltsverzeichnis", back_to_top: "Zurück nach oben" },
        cs: { toc: "Obsah", back_to_top: "Zpět na začátek" },
      });
    function Ji(e, t, { prefix: n = "" } = {}) {
      let r = !1,
        o = 0,
        i = 1;
      if ((n.length && !n.endsWith(".") && (n += "."), 0 === e.length))
        return null;
      const s = ft`<ol class="toc"></ol>`;
      for (const a of e) {
        !a.isAppendix || n || r || ((o = i), (r = !0));
        let e = a.isIntro ? "" : r ? es(i - o + 1) : n + i;
        const l = e.split(".").length;
        if (
          (1 === l &&
            ((e += "."), a.header.before(document.createComment("OddPage"))),
          a.isIntro ||
            ((i += 1), a.header.prepend(ft`<bdi class="secno">${e} </bdi>`)),
          l <= t)
        ) {
          const n = a.header.id || a.element.id,
            r = ns(a.header, n),
            o = Ji(a.subsections, t, { prefix: e });
          (o && r.append(o), s.append(r));
        }
      }
      return s;
    }
    function es(e) {
      let t = "";
      for (; e > 0; )
        ((e -= 1),
          (t = String.fromCharCode(65 + (e % 26)) + t),
          (e = Math.floor(e / 26)));
      return t;
    }
    function ts(e) {
      const t = e.querySelectorAll(":scope > section"),
        n = [];
      for (const e of t) {
        const t = e.classList.contains("notoc");
        if (!e.children.length || t) continue;
        const r = e.children[0];
        if (!Ki.includes(r.localName)) continue;
        const o = r.textContent;
        (Dt(e, void 0, o),
          n.push({
            element: e,
            header: r,
            title: o,
            isIntro: Boolean(e.closest(".introductory")),
            isAppendix: e.classList.contains("appendix"),
            subsections: ts(e),
          }));
      }
      return n;
    }
    function ns(e, t) {
      const n = ft`<a href="${`#${t}`}" class="tocxref" />`;
      var r;
      return (
        n.append(...e.cloneNode(!0).childNodes),
        (r = n).querySelectorAll("a").forEach(e => {
          const t = zt(e, "span");
          ((t.className = "formerLink"), t.removeAttribute("href"));
        }),
        r.querySelectorAll("dfn").forEach(e => {
          zt(e, "span").removeAttribute("id");
        }),
        ft`<li class="tocline">${n}</li>`
      );
    }
    var rs = Object.freeze({
      __proto__: null,
      name: Xi,
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
              const t = Math.min(
                  (function (e, t) {
                    const n = [];
                    let r = e.parentElement;
                    for (; r; ) {
                      const e = r.closest(t);
                      if (!e) break;
                      (n.push(e), (r = e.parentElement));
                    }
                    return n;
                  })(e, "section").length + 1,
                  6
                ),
                n = `h${t}`;
              e.localName !== n && zt(e, n);
            });
          })(),
          !e.noTOC)
        ) {
          !(function () {
            const e = document.querySelectorAll("section[data-max-toc]");
            for (const t of e) {
              const e = parseInt(t.dataset.maxToc ?? "", 10);
              if (e < 0 || e > 6 || Number.isNaN(e)) {
                Zt(
                  "`data-max-toc` must have a value between 0-6 (inclusive).",
                  Xi,
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
          const t = Ji(ts(document.body), e.maxTocLevel);
          t &&
            (function (e) {
              if (!e) return;
              const t = ft`<nav id="toc"></nav>`,
                n = ft`<h2 class="introductory">${Qi.toc}</h2>`;
              (Dt(n), t.append(n, e));
              const r =
                document.getElementById("toc") ||
                document.getElementById("sotd") ||
                document.getElementById("abstract");
              r && ("toc" === r.id ? r.replaceWith(t) : r.after(t));
              const o = ft`<p role="navigation" id="back-to-top">
    <a href="#title"><abbr title="${Qi.back_to_top}">&uarr;</abbr></a>
  </p>`;
              document.body.append(o);
            })(t);
        }
        nn("toc", void 0);
      },
    });
    const os = Ot({
      en: { informative: "This section is non-normative." },
      nl: { informative: "Dit onderdeel is niet-normatief." },
      ko: { informative: "이 부분은 비규범적입니다." },
      ja: { informative: "この節は仕様には含まれません．" },
      de: { informative: "Dieser Abschnitt ist nicht normativ." },
      zh: { informative: "本章节不包含规范性内容。" },
      cs: { informative: "Tato sekce není normativní." },
    });
    var is = Object.freeze({
      __proto__: null,
      name: "core/informative",
      run: function () {
        Array.from(document.querySelectorAll("section.informative"))
          .map(e => e.querySelector("h2, h3, h4, h5, h6"))
          .filter(e => null !== e)
          .forEach(e => {
            e.after(ft`<p><em>${os.informative}</em></p>`);
          });
      },
    });
    const ss = Ot({
      en: {
        permalinkLabel(e, t) {
          let n = `Permalink for${t ? "" : " this"} ${e}`;
          return (t && (n += ` ${Rt(t.textContent)}`), n);
        },
      },
    });
    var as = Object.freeze({
      __proto__: null,
      name: "core/id-headers",
      run: function (e) {
        const t = document.querySelectorAll(
          "section:not(.head,#abstract,#sotd) h2, h3, h4, h5, h6"
        );
        for (const n of t) {
          let t = n.id;
          if (
            (t || (Dt(n), (t = n.parentElement?.id || n.id)),
            !e.addSectionLinks)
          )
            continue;
          const r = ss.permalinkLabel(
              n.closest(".appendix") ? "Appendix" : "Section",
              n.querySelector(":scope > bdi.secno")
            ),
            o = ft`<div class="header-wrapper"></div>`;
          n.replaceWith(o);
          const i = ft`<a
      href="#${t}"
      class="self-link"
      aria-label="${r}"
    ></a>`;
          o.append(n, i);
        }
      },
    });
    const ls = "ui/save-html",
      cs = Ot({
        en: { save_snapshot: "Export" },
        nl: { save_snapshot: "Bewaar Snapshot" },
        ja: { save_snapshot: "保存する" },
        de: { save_snapshot: "Exportieren" },
        zh: { save_snapshot: "导出" },
      }),
      us = [
        {
          id: "respec-save-as-html",
          ext: "html",
          title: "HTML",
          type: "text/html",
          get href() {
            return an(this.type);
          },
        },
        {
          id: "respec-save-as-xml",
          ext: "xhtml",
          title: "XML",
          type: "application/xml",
          get href() {
            return an(this.type);
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
    function ds(e, t) {
      const { id: n, href: r, ext: o, title: i, type: s } = e,
        a = (function (e, t = "") {
          return kt.format(e).replace(wt, t);
        })(t.publishDate || new Date()),
        l = [t.specStatus, t.shortName || "spec", a].join("-");
      return ft`<a
    href="${r}"
    id="${n}"
    download="${l}.${o}"
    type="${s}"
    class="respec-save-button"
    onclick=${() => zn.closeModal()}
    >${i}</a
  >`;
    }
    var ps = Object.freeze({
      __proto__: null,
      exportDocument: function (e, t) {
        return (
          Yt(
            "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed.",
            ls,
            { hint: "Use core/exporter `rsDocToDataURL()` instead." }
          ),
          an(t)
        );
      },
      name: ls,
      run: function (e) {
        const t = {
            async show(t) {
              await document.respec.ready;
              const n = ft`<div class="respec-save-buttons">
        ${us.map(t => ds(t, e))}
      </div>`;
              zn.freshModal(cs.save_snapshot, n, t);
            },
          },
          n = "download" in HTMLAnchorElement.prototype;
        let r;
        n &&
          (r = zn.addCommand(
            cs.save_snapshot,
            function () {
              if (!n) return;
              t.show(r);
            },
            "Ctrl+Shift+Alt+S",
            "💾"
          ));
      },
    });
    const hs = Ot({
      en: { about_respec: "About" },
      zh: { about_respec: "关于" },
      nl: { about_respec: "Over" },
      ja: { about_respec: "これについて" },
      de: { about_respec: "Über" },
      cs: { about_respec: "O aplikaci" },
    });
    window.respecVersion = window.respecVersion || "Developer Edition";
    const fs = document.createElement("div"),
      ms = ft.bind(fs),
      gs = zn.addCommand(
        `${hs.about_respec} ${window.respecVersion}`,
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
              .map(bs)
              .forEach(t => {
                e.push(t);
              });
          (ms`
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
            zn.freshModal(
              `${hs.about_respec} - ${window.respecVersion}`,
              fs,
              gs
            ));
        },
        "Ctrl+Shift+Alt+A",
        "ℹ️"
      );
    function bs({ name: e, duration: t }) {
      return ft`
    <tr>
      <td><a href="${`https://github.com/speced/respec/blob/develop/src/${e}.js`}">${e}</a></td>
      <td>${t}</td>
    </tr>
  `;
    }
    var ys = Object.freeze({ __proto__: null });
    var ws = Object.freeze({
      __proto__: null,
      name: "core/seo",
      run: function (e) {
        if (e.gitRevision) {
          const t = ft`<meta
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
    const vs =
      "\n  --base: #282c34;\n  --mono-1: #abb2bf;\n  --mono-2: #818896;\n  --mono-3: #5c6370;\n  --hue-1: #56b6c2;\n  --hue-2: #61aeee;\n  --hue-3: #c678dd;\n  --hue-4: #98c379;\n  --hue-5: #e06c75;\n  --hue-5-2: #be5046;\n  --hue-6: #d19a66;\n  --hue-6-2: #e6c07b;\n";
    var ks = String.raw`.hljs,body:has(input[name=color-scheme][value=light]:checked) .hljs,head:not(:has(meta[name=color-scheme][content~=dark]))+body .hljs{--base:#fafafa;--mono-1:#383a42;--mono-2:#686b77;--mono-3:#717277;--hue-1:#0b76c5;--hue-2:#336ae3;--hue-3:#a626a4;--hue-4:#42803c;--hue-5:#ca4706;--hue-5-2:#c91243;--hue-6:#986801;--hue-6-2:#9a6a01}
@media (prefers-color-scheme:dark){
.hljs{${vs}}
}
body:has(input[name=color-scheme][value=dark]:checked) .hljs{${vs}}
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
    async function xs(t) {
      const n = await fetch(
        new URL(
          `../../${t}`,
          (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
            new URL("respec-aom.js", document.baseURI).href
        )
      );
      return await n.text();
    }
    const $s = new URL(
        "respec-highlight.js",
        (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
          new URL("respec-aom.js", document.baseURI).href
      ).href,
      Es = St({ hint: "preload", href: $s, as: "script" });
    async function Ss() {
      try {
        return (
          await Promise.resolve().then(function () {
            return Na;
          })
        ).default;
      } catch {
        return xs("worker/respec-worker.js");
      }
    }
    async function _s() {
      try {
        const e = await fetch($s);
        if (e.ok) return await e.text();
      } catch {}
      return null;
    }
    document.head.appendChild(Es);
    const Cs = (async function () {
      const [e, t] = await Promise.all([Ss(), _s()]),
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
      Cs.then(e => ({ worker: e }))
    );
    const Ls = (function (e, t = 0) {
      const n = (function* (e, t) {
        for (;;) (yield `${e}:${t}`, t++);
      })(e, t);
      return () => n.next().value;
    })("highlight");
    async function As(e) {
      const t = e;
      t.setAttribute("aria-busy", "true");
      const n =
        ((r = t.classList),
        Array.from(r)
          .filter(e => "highlight" !== e && "nolinks" !== e)
          .map(e => e.toLowerCase()));
      var r;
      let o;
      try {
        o = await (async function (e, t) {
          const n = { action: "highlight", code: e, id: Ls(), languages: t },
            r = await Cs;
          return (
            r.postMessage(n),
            new Promise((e, t) => {
              const o = setTimeout(() => {
                t(new Error("Timed out waiting for highlight."));
              }, 4e3);
              r.addEventListener("message", function t(i) {
                const {
                  data: { id: s, language: a, value: l },
                } = i;
                s === n.id &&
                  (r.removeEventListener("message", t),
                  clearTimeout(o),
                  e({ language: a, value: l }));
              });
            })
          );
        })(t.innerText, n);
      } catch (e) {
        return void console.error(e);
      }
      const { language: i, value: s } = o;
      switch (t.localName) {
        case "pre":
          (t.classList.remove(i),
            (t.innerHTML = `<code class="hljs${i ? ` ${i}` : ""}">${s}</code>`),
            t.classList.length || t.removeAttribute("class"));
          break;
        case "code":
          ((t.innerHTML = s), t.classList.add("hljs"), i && t.classList.add(i));
      }
      t.setAttribute("aria-busy", "false");
    }
    var Ts = Object.freeze({
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
        const n = t.filter(e => e.textContent.trim()).map(As);
        (document.head.appendChild(ft`<style>
      ${ks}
    </style>`),
          await Promise.all(n));
      },
    });
    const Rs = "core/list-sorter";
    function Os(e) {
      const t = "ascending" === e ? 1 : -1;
      return (e, n) => {
        const r = e.textContent ?? "",
          o = n.textContent ?? "";
        return t * r.trim().localeCompare(o.trim());
      };
    }
    function Ns(e, t) {
      return [...e.querySelectorAll(":scope > li")]
        .sort(Os(t))
        .reduce(
          (e, t) => (e.appendChild(t), e),
          document.createDocumentFragment()
        );
    }
    function Ps(e, t) {
      return [...e.querySelectorAll(":scope > dt")]
        .sort(Os(t))
        .reduce((e, t) => {
          const { nodeType: n, nodeName: r } = t,
            o = document.createDocumentFragment();
          let { nextSibling: i } = t;
          for (; i && i.nextSibling; ) {
            o.appendChild(i.cloneNode(!0));
            const { nodeType: e, nodeName: t } = i.nextSibling;
            if (e === n && t === r) break;
            i = i.nextSibling;
          }
          return (o.prepend(t.cloneNode(!0)), e.appendChild(o), e);
        }, document.createDocumentFragment());
    }
    var Is = Object.freeze({
      __proto__: null,
      name: Rs,
      run: function () {
        const e = document.querySelectorAll("[data-sort]");
        for (const t of e) {
          let e;
          const n = t.dataset.sort || "ascending";
          switch (t.localName) {
            case "dl":
              e = Ps(t, n);
              break;
            case "ol":
            case "ul":
              e = Ns(t, n);
              break;
            default:
              Yt(`ReSpec can't sort ${t.localName} elements.`, Rs, {
                elements: [t],
              });
          }
          if (e) {
            const n = document.createRange();
            (n.selectNodeContents(t), n.deleteContents(), t.appendChild(e));
          }
        }
      },
      sortDefinitionTerms: Ps,
      sortListItems: Ns,
    });
    var Ds = String.raw`var:hover{text-decoration:underline;cursor:pointer}
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
    var js = Object.freeze({
      __proto__: null,
      name: "core/highlight-vars",
      run: async function (e) {
        if (!e.highlightVars) return;
        const t = document.createElement("style");
        ((t.textContent = Ds), document.head.appendChild(t));
        const n = document.createElement("script");
        ((n.id = "respec-highlight-vars"),
          (n.textContent = await (async function () {
            try {
              return (
                await Promise.resolve().then(function () {
                  return Pa;
                })
              ).default;
            } catch {
              return xs("./src/core/highlight-vars.runtime.js");
            }
          })()),
          document.body.append(n),
          rn("beforesave", e => {
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
    var zs = String.raw`var[data-type]{position:relative}
var[data-type]::after,var[data-type]::before{position:absolute;left:50%;top:-6px;opacity:0;transition:opacity .4s;pointer-events:none}
var[data-type]::before{content:"";transform:translateX(-50%);border-width:4px 6px 0 6px;border-style:solid;border-color:transparent;border-top-color:#222}
var[data-type]::after{content:attr(data-type);transform:translateX(-50%) translateY(-100%);background:#222;text-align:center;font-family:"Dank Mono","Fira Code",monospace;font-style:normal;padding:6px;border-radius:3px;color:#daca88;text-indent:0;font-weight:400}
var[data-type]:hover::after,var[data-type]:hover::before{opacity:1}`;
    var Ms = Object.freeze({
      __proto__: null,
      name: "core/data-type",
      run: function (e) {
        if (!e.highlightVars) return;
        const t = document.createElement("style");
        ((t.textContent = zs), document.head.appendChild(t));
        let n = null;
        const r = new Map(),
          o = document.querySelectorAll("section var");
        for (const e of o) {
          const t = e.closest("section");
          if ((n !== t && ((n = t), r.clear()), e.dataset.type)) {
            r.set(e.textContent.trim(), e.dataset.type);
            continue;
          }
          const o = r.get(e.textContent.trim());
          o && (e.dataset.type = o);
        }
      },
    });
    const qs = "core/anchor-expander";
    function Hs(e, t, n) {
      const r = e.querySelector(".marker .self-link");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Zt(
          `Found matching element "${t}", but it has no title or marker.`,
          qs,
          { title: "Missing title.", elements: [n] }
        );
      }
      const o = Ft(r);
      (n.append(...o.childNodes), n.classList.add("box-ref"));
    }
    function Bs(e, t, n) {
      const r = e.querySelector("figcaption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Zt(
          `Found matching figure "${t}", but figure is lacking a \`<figcaption>\`.`,
          qs,
          { title: "Missing figcaption in referenced figure.", elements: [n] }
        );
      }
      const o = [...Ft(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("figno"), e)
      );
      (n.append(...o), n.classList.add("fig-ref"));
      const i = r.querySelector(".fig-title");
      !n.hasAttribute("title") && i && (n.title = Rt(i.textContent));
    }
    function Fs(e, t, n) {
      if (!e.classList.contains("numbered")) return;
      const r = e.querySelector("caption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Zt(
          `Found matching table "${t}", but table is lacking a \`<caption>\`.`,
          qs,
          { title: "Missing caption in referenced table.", elements: [n] }
        );
      }
      const o = [...Ft(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("tableno"), e)
      );
      (n.append(...o), n.classList.add("table-ref"));
      const i = r.querySelector(".table-title");
      !n.hasAttribute("title") && i && (n.title = Rt(i.textContent));
    }
    function Ws(e, t, n) {
      const r = e.querySelector("h6, h5, h4, h3, h2");
      if (r) (Us(r, n), Gs(r, n));
      else {
        n.textContent = n.getAttribute("href");
        Zt(
          "Found matching section, but the section was lacking a heading element.",
          qs,
          { title: `No matching id in document: "${t}".`, elements: [n] }
        );
      }
    }
    function Us(e, t) {
      const n = e.querySelector(".self-link"),
        r = [...Ft(e).childNodes].filter(
          e => !e.classList || !e.classList.contains("self-link")
        );
      (t.append(...r),
        n && t.prepend("§ "),
        t.classList.add("sec-ref"),
        t.lastChild &&
          t.lastChild.nodeType === Node.TEXT_NODE &&
          (t.lastChild.textContent = (t.lastChild.textContent ?? "").trimEnd()),
        t.querySelectorAll("a").forEach(e => {
          const t = zt(e, "span");
          for (const e of [...t.attributes]) t.removeAttributeNode(e);
        }));
    }
    function Gs(e, t) {
      for (const n of ["dir", "lang"]) {
        if (t.hasAttribute(n)) continue;
        const r = e.closest(`[${n}]`);
        if (!r) continue;
        const o = t.closest(`[${n}]`);
        (o && o.getAttribute(n) === r.getAttribute(n)) ||
          t.setAttribute(n, r.getAttribute(n) ?? "");
      }
    }
    var Vs = Object.freeze({
      __proto__: null,
      name: qs,
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
                Us(n, t);
                break;
              case "section":
                Ws(n, e, t);
                break;
              case "figure":
                Bs(n, e, t);
                break;
              case "table":
                Fs(n, e, t);
                break;
              case "aside":
              case "div":
                Hs(n, e, t);
                break;
              case "dfn": {
                const e = Ft(n);
                (t.append(...e.childNodes), t.classList.add("dfn-ref"));
                break;
              }
              default:
                t.textContent = t.getAttribute("href");
                Zt(
                  "ReSpec doesn't support expanding this kind of reference.",
                  qs,
                  { title: `Can't expand "#${e}".`, elements: [t] }
                );
            }
            (Gs(n, t), t.normalize());
          } else {
            t.textContent = t.getAttribute("href");
            Zt(
              `Couldn't expand inline reference. The id "${e}" is not in the document.`,
              qs,
              { title: `No matching id in document: ${e}.`, elements: [t] }
            );
          }
        }
      },
    });
    var Zs = String.raw`dfn{cursor:pointer}
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
.dfn-panel .marker.cddl-block{background:#8ccbf2;box-shadow:0 0 0 .125em #0670b161}
.dfn-panel a:not(:hover){text-decoration:none!important;border-bottom:none!important}
.dfn-panel a[href]:hover{border-bottom-width:1px}
.dfn-panel ul{padding:0}
.dfn-panel li{margin-left:1em}
.dfn-panel.docked{position:fixed;left:.5em;top:unset;bottom:2em;margin:0 auto;max-width:calc(100vw - .75em * 2 - .5em - .2em * 2);max-height:30vh;overflow:auto}`;
    function Ys(e) {
      const { id: t } = e,
        n = e.dataset.href || `#${t}`,
        r = document.querySelectorAll(`a[href="${n}"]:not(.index-term)`),
        o = `dfn-panel-for-${e.id}`,
        i = e.getAttribute("aria-label") || Rt(e.textContent),
        s = ft`
    <div
      class="dfn-panel"
      id="${o}"
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
            ? ft`<span
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
              return ft`<a
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
            ? ft`<a
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
          return ft`<ul>
      <li>Not referenced in this document.</li>
    </ul>`;
        const n = new Map();
        t.forEach((t, r) => {
          const o = t.id || `ref-for-${e}-${r + 1}`;
          t.id || (t.id = o);
          const i =
            (function (e) {
              const t = e.closest("section");
              if (!t) return null;
              const n = t.querySelector("h1, h2, h3, h4, h5, h6");
              return n ? `§ ${Rt(n.textContent)}` : null;
            })(t) ?? "";
          (n.get(i) ?? n.set(i, []).get(i) ?? []).push(o);
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
          o = e => ft`<li>
      ${r(e).map(
        e => ft`<a href="#${e.id}" title="${e.title}">${e.text}</a
          >${" "}`
      )}
    </li>`;
        return ft`<ul>
    ${[...n].map(o)}
  </ul>`;
      })(t, r)}
    </div>
  `;
      return s;
    }
    var Ks = Object.freeze({
      __proto__: null,
      name: "core/dfn-panel",
      run: async function () {
        document.head.insertBefore(
          ft`<style>
      ${Zs}
    </style>`,
          document.querySelector("link")
        );
        const e = document.querySelectorAll(
            "dfn[id]:not([data-cite]), #index-defined-elsewhere .index-term"
          ),
          t = document.createDocumentFragment();
        for (const n of e)
          (t.append(Ys(n)),
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
                  return Ia;
                })
              ).default;
            } catch {
              return xs("./src/core/dfn-panel.runtime.js");
            }
          })()),
          document.body.append(r));
      },
    });
    const Xs = new Promise((e, t) => {});
    Ot({
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
    const Qs = "rs-changelog",
      Js = class extends HTMLElement {
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
          const { from: e, to: t, filter: n, repo: r, path: o } = this.props;
          ft.bind(this)`
      <ul>
      ${{
        any: ea(e, t, n, r, o)
          .then(e =>
            (async function (e, t) {
              const n = await Xs,
                r = t ? `https://github.com/${t}/` : n?.repoURL;
              return e.map(e => {
                const [t, n = null] = e.message.split(/\(#(\d+)\)/, 2),
                  o = `${r}commit/${e.hash}`,
                  i =
                    n &&
                    ft` (<a href="${n ? `${r}pull/${n}` : null}">#${n}</a>)`;
                return ft`<li><a href="${o}">${t.trim()}</a>${i}</li>`;
              });
            })(e, r)
          )
          .catch(e => Zt(e.message, Qs, { elements: [this], cause: e }))
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
        }
      };
    async function ea(e, t, n, r, o) {
      let i;
      try {
        const s = await Xs;
        if (!s) throw new Error("`respecConfig.github` is not set");
        const a = r || s.fullName,
          l = new URL("commits", `${s.apiBase}/${a}/`);
        (e && l.searchParams.set("from", e),
          l.searchParams.set("to", t),
          o && l.searchParams.set("path", o));
        const c = await fetch(l.href);
        if (!c.ok)
          throw new Error(
            `Request to ${l} failed with status code ${c.status}`
          );
        if (((i = await c.json()), !i.length))
          throw new Error(`No commits between ${e}..${t}.`);
        i = i.filter(n);
      } catch (e) {
        const t = `Error loading commits from GitHub. ${e.message}`;
        throw new Error(t, { cause: e });
      }
      return i;
    }
    const ta = [Object.freeze({ __proto__: null, element: Js, name: Qs })];
    var na = Object.freeze({
      __proto__: null,
      name: "core/custom-elements/index",
      run: async function () {
        ta.forEach(e => {
          customElements.define(e.name, e.element);
        });
        const e = ta.map(e => e.name).join(", "),
          t = [...document.querySelectorAll(e)].map(
            e => new Promise(t => e.addEventListener("done", t, { once: !0 }))
          );
        await Promise.all(t);
      },
    });
    var ra = Object.freeze({
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
    const oa = "core/linter-rules/check-charset",
      ia = Ot({
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
    var sa = Object.freeze({
      __proto__: null,
      name: oa,
      run: function (e) {
        if (!e.lint?.["check-charset"]) return;
        const t = document.querySelectorAll("meta[charset]"),
          n = [];
        for (const e of t)
          n.push((e.getAttribute("charset") ?? "").trim().toLowerCase());
        (n.includes("utf-8") && 1 === t.length) ||
          Yt(ia.msg, oa, { hint: ia.hint, elements: [...t] });
      },
    });
    const aa = "no-dfn-in-abstract",
      la = `core/linter-rules/${aa}`,
      ca = Ot({
        en: {
          msg: e =>
            `Definition \`${e}\` is in an unnumbered section (e.g. abstract or SotD).`,
          get hint() {
            return Jt`Definitions in unnumbered sections (abstract, SotD) are semantically out of place and appear in the terms index without a section number. Move this definition to a numbered section such as "Terminology". See ${"[export|#data-export]"}.`;
          },
        },
      }),
      ua = ["section#abstract", "section#sotd", "section.introductory"].join(
        ", "
      );
    var da = Object.freeze({
      __proto__: null,
      name: la,
      run: function (e) {
        if (!e.lint?.[aa]) return;
        const t = [...document.querySelectorAll("dfn")].filter(e =>
          e.closest(ua)
        );
        t.forEach(e => {
          const t = Rt(e.textContent);
          Yt(ca.msg(t), la, { hint: ca.hint, elements: [e] });
        });
      },
    });
    const pa = "core/linter-rules/check-punctuation",
      ha = [".", ":", "!", "?"],
      fa = ha.map(e => `"${e}"`).join(", "),
      ma = Ot({
        en: {
          msg: "`p` elements should end with a punctuation mark.",
          hint: `Please make sure \`p\` elements end with one of: ${fa}.`,
        },
        cs: {
          msg: "Elementy `p` by měly končit interpunkčním znaménkem.",
          hint: `Ujistěte se, že elementy \`p\` končí jedním z těchto znaků: ${fa}.`,
        },
      });
    var ga = Object.freeze({
      __proto__: null,
      name: pa,
      run: function (e) {
        if (!e.lint?.["check-punctuation"]) return;
        const t = new RegExp(`[${ha.join("")}\\]]$|^ *$`, "m"),
          n = [
            ...document.querySelectorAll("p:not(#back-to-top,#w3c-state)"),
          ].filter(e => !t.test(e.textContent.trim()));
        n.length && Yt(ma.msg, pa, { hint: ma.hint, elements: n });
      },
    });
    const ba = "core/linter-rules/local-refs-exist",
      ya = Ot({
        en: {
          msg: "Broken local reference found in document.",
          hint: "Please fix the links mentioned.",
        },
        cs: {
          msg: "V dokumentu byla nalezena nefunkční lokální reference.",
          hint: "Opravte prosím uvedené odkazy.",
        },
      });
    function wa(e) {
      const t = e.getAttribute("href")?.substring(1);
      if (!t) return;
      const n = e.ownerDocument;
      return !n.getElementById(t) && !n.getElementsByName(t).length;
    }
    var va = Object.freeze({
      __proto__: null,
      name: ba,
      run: function (e) {
        if (!e.lint?.["local-refs-exist"]) return;
        const t = [...document.querySelectorAll("a[href^='#']")].filter(wa);
        t.length && Yt(ya.msg, ba, { hint: ya.hint, elements: t });
      },
    });
    const ka = "core/linter-rules/no-headingless-sections",
      xa = Ot({
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
    var $a = Object.freeze({
      __proto__: null,
      name: ka,
      run: function (e) {
        if (!e.lint?.["no-headingless-sections"]) return;
        const t = [
          ...document.querySelectorAll("section:not(.head,#abstract,#sotd)"),
        ].filter(
          ({ firstElementChild: e }) =>
            !e ||
            !(e.matches(".header-wrapper") || e instanceof HTMLHeadingElement)
        );
        t.length && Yt(xa.msg, ka, { hint: xa.hint, elements: t });
      },
    });
    const Ea = "core/linter-rules/no-unused-vars",
      Sa = Ot({
        en: {
          msg: "Variable was defined, but never used.",
          hint: "Add a `data-ignore-unused` attribute to the `<var>`.",
        },
        cs: {
          msg: "Proměnná byla definována, ale nikdy nebyla použita.",
          hint: "Přidejte atribut `data-ignore-unused` k elementu `<var>`.",
        },
      });
    var _a = Object.freeze({
      __proto__: null,
      name: Ea,
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
          const o = new Map();
          for (const e of r) {
            const t = Rt(e.textContent),
              n = o.get(t) || o.set(t, []).get(t);
            n?.push(e);
          }
          for (const e of o.values())
            1 !== e.length ||
              e[0].hasAttribute("data-ignore-unused") ||
              t.push(e[0]);
        }
        t.length && Yt(Sa.msg, Ea, { hint: Sa.hint, elements: t });
      },
    });
    const Ca = "core/linter-rules/privsec-section",
      La = Ot({
        en: {
          msg: "Document must have a 'Privacy and/or Security' Considerations section.",
          hint: "Add a privacy and/or security considerations section. See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
        },
        cs: {
          msg: "Dokument musí obsahovat sekci 'Zásady ochrany soukromí a/nebo bezpečnosti'.",
          hint: "Přidejte sekci o zásadách ochrany soukromí a/nebo bezpečnosti. Viz [Dotazník pro sebehodnocení](https://w3ctag.github.io/security-questionnaire/).",
        },
      });
    var Aa = Object.freeze({
      __proto__: null,
      name: Ca,
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
          Yt(La.msg, Ca, { hint: La.hint });
      },
    });
    const Ta = "core/linter-rules/no-http-props",
      Ra = Ot({
        en: {
          msg: Jt`Insecure URLs are not allowed in ${"[respecConfig]"}.`,
          hint: "Please change the following properties to 'https://': ",
        },
        zh: {
          msg: Jt`${"[respecConfig]"} 中不允许使用不安全的URL.`,
          hint: "请将以下属性更改为 https://：",
        },
        cs: {
          msg: Jt`V ${"[respecConfig]"} nejsou povoleny nezabezpečené URL adresy.`,
          hint: "Změňte prosím následující vlastnosti na 'https://': ",
        },
      });
    var Oa = Object.freeze({
        __proto__: null,
        name: Ta,
        run: function (e) {
          if (!e.lint?.["no-http-props"]) return;
          if (!parent.location.href.startsWith("http")) return;
          const t = Object.getOwnPropertyNames(e)
            .filter(t => (t.endsWith("URI") && e[t]) || "prevED" === t)
            .filter(t =>
              new URL(e[t], parent.location.href).href.startsWith("http://")
            );
          if (t.length) {
            const e = Tt(t, e => Jt`${`[${e}]`}`);
            Yt(Ra.msg, Ta, { hint: Ra.hint + e });
          }
        },
      }),
      Na = Object.freeze({
        __proto__: null,
        default:
          '// ReSpec Worker\n"use strict";\n// hljs is either inlined by core/worker.js (preferred) or loaded below via\n// importScripts as a fallback when the inline fetch was not possible.\nif (typeof self.hljs === "undefined" && self.RESPEC_HIGHLIGHT_URL) {\n  try {\n    importScripts(self.RESPEC_HIGHLIGHT_URL);\n  } catch (err) {\n    console.error("Network error loading highlighter", err);\n  }\n}\n\nself.addEventListener("message", ({ data }) => {\n  if (data.action !== "highlight") return;\n  const { code } = data;\n  const langs = data.languages?.length ? data.languages : undefined;\n  try {\n    const { value, language } = self.hljs.highlightAuto(code, langs);\n    Object.assign(data, { value, language });\n  } catch (err) {\n    console.error("Could not transform some code?", err);\n    Object.assign(data, { value: code, language: "" });\n  }\n  self.postMessage(data);\n});\n',
      }),
      Pa = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\n\nif (document.respec) {\n  document.respec.ready.then(setupVarHighlighter);\n} else {\n  setupVarHighlighter();\n}\n\nfunction setupVarHighlighter() {\n  document\n    .querySelectorAll("var")\n    .forEach(varElem => varElem.addEventListener("click", highlightListener));\n}\n\n/**\n * @param {MouseEvent} ev\n */\nfunction highlightListener(ev) {\n  ev.stopPropagation();\n  const varElem = /** @type {HTMLElement} */ (ev.target);\n  const hightligtedElems = highlightVars(varElem);\n  const resetListener = () => {\n    const hlColor = getHighlightColor(varElem);\n    hightligtedElems.forEach(el => removeHighlight(el, hlColor));\n    [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));\n  };\n  if (hightligtedElems.length) {\n    document.body.addEventListener("click", resetListener, { once: true });\n  }\n}\n\n// availability of highlight colors. colors from var.css\nconst HL_COLORS = new Map([\n  ["respec-hl-c1", true],\n  ["respec-hl-c2", true],\n  ["respec-hl-c3", true],\n  ["respec-hl-c4", true],\n  ["respec-hl-c5", true],\n  ["respec-hl-c6", true],\n  ["respec-hl-c7", true],\n]);\n\n/**\n * @param {HTMLElement} target\n */\nfunction getHighlightColor(target) {\n  // return current colors if applicable\n  const { value } = target.classList;\n  const re = /respec-hl-\\w+/;\n  const activeClass = re.test(value) && value.match(re);\n  if (activeClass) return activeClass[0];\n\n  // first color preference\n  if (HL_COLORS.get("respec-hl-c1") === true) return "respec-hl-c1";\n\n  // otherwise get some other available color\n  return HL_COLORS.keys().find(c => HL_COLORS.get(c)) || "respec-hl-c1";\n}\n\n/**\n * @param {HTMLElement} varElem\n */\nfunction highlightVars(varElem) {\n  const textContent = norm(varElem.textContent);\n  const parent = /** @type {HTMLElement} */ (\n    varElem.closest(".algorithm, section")\n  );\n  if (!parent) return [];\n  const highlightColor = getHighlightColor(varElem);\n\n  const varsToHighlight = [...parent.querySelectorAll("var")].filter(\n    el =>\n      norm(el.textContent) === textContent &&\n      el.closest(".algorithm, section") === parent\n  );\n\n  // update availability of highlight color\n  const colorStatus = varsToHighlight[0].classList.contains("respec-hl");\n  HL_COLORS.set(highlightColor, colorStatus);\n\n  // highlight vars\n  if (colorStatus) {\n    varsToHighlight.forEach(el => removeHighlight(el, highlightColor));\n    return [];\n  } else {\n    varsToHighlight.forEach(el => addHighlight(el, highlightColor));\n  }\n  return varsToHighlight;\n}\n\n/**\n * @param {HTMLElement} el\n * @param {string} highlightColor\n */\nfunction removeHighlight(el, highlightColor) {\n  el.classList.remove("respec-hl", highlightColor);\n  // clean up empty class attributes so they don\'t come in export\n  if (!el.classList.length) el.removeAttribute("class");\n}\n\n/**\n * @param {HTMLElement} elem\n * @param {string} highlightColor\n */\nfunction addHighlight(elem, highlightColor) {\n  elem.classList.add("respec-hl", highlightColor);\n}\n\n/**\n * Same as `norm` from src/core/utils, but our build process doesn\'t allow\n * imports in runtime scripts, so duplicated here.\n * @param {string} str\n */\nfunction norm(str) {\n  return str.trim().replace(/\\s+/g, " ");\n}\n})()',
      }),
      Ia = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\nif (document.respec) {\n  document.respec.ready.then(setupPanel);\n} else {\n  setupPanel();\n}\n\nfunction setupPanel() {\n  const listener = panelListener();\n  document.body.addEventListener("keydown", listener);\n  document.body.addEventListener("click", listener);\n}\n\nfunction panelListener() {\n  /** @type {HTMLElement | null} */\n  let panel = null;\n  /**\n   * @param {KeyboardEvent|MouseEvent} event\n   */\n  return event => {\n    const { target, type } = event;\n\n    if (!(target instanceof HTMLElement)) return;\n\n    // For keys, we only care about Enter key to activate the panel\n    // otherwise it\'s activated via a click.\n    if (\n      type === "keydown" &&\n      /** @type {KeyboardEvent} */ (event).key !== "Enter"\n    )\n      return;\n\n    const action = deriveAction(event);\n\n    switch (action) {\n      case "show": {\n        hidePanel(panel);\n        /** @type {HTMLElement | null} */\n        const dfn = target.closest("dfn, .index-term");\n        if (!dfn?.id) break;\n        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);\n        if (!panel) break;\n        const coords = deriveCoordinates(\n          /** @type {MouseEvent|KeyboardEvent} */ (event)\n        );\n        displayPanel(dfn, panel, coords);\n        break;\n      }\n      case "dock": {\n        if (panel) {\n          panel.style.left = "";\n          panel.style.top = "";\n          panel.classList.add("docked");\n        }\n        break;\n      }\n      case "hide": {\n        hidePanel(panel);\n        panel = null;\n        break;\n      }\n    }\n  };\n}\n\n/**\n * @param {MouseEvent|KeyboardEvent} event\n */\nfunction deriveCoordinates(event) {\n  const target = /** @type HTMLElement */ (event.target);\n\n  // We prevent synthetic AT clicks from putting\n  // the dialog in a weird place. The AT events sometimes\n  // lack coordinates, so they have clientX/Y = 0\n  const rect = target.getBoundingClientRect();\n  if (\n    event instanceof MouseEvent &&\n    event.clientX >= rect.left &&\n    event.clientY >= rect.top\n  ) {\n    // The event probably happened inside the bounding rect...\n    return { x: event.clientX, y: event.clientY };\n  }\n\n  // Offset to the middle of the element\n  const x = rect.x + rect.width / 2;\n  // Placed at the bottom of the element\n  const y = rect.y + rect.height;\n  return { x, y };\n}\n\n/**\n * @param {Event} event\n */\nfunction deriveAction(event) {\n  const target = /** @type {HTMLElement} */ (event.target);\n  const hitALink = !!target.closest("a");\n  if (target.closest("dfn:not([data-cite]), .index-term")) {\n    return hitALink ? "none" : "show";\n  }\n  if (target.closest(".dfn-panel")) {\n    if (hitALink) {\n      return target.classList.contains("self-link") ? "hide" : "dock";\n    }\n\n    const panel = /** @type {HTMLElement} */ (target.closest(".dfn-panel"));\n    return panel.classList.contains("docked") ? "hide" : "none";\n  }\n  if (document.querySelector(".dfn-panel:not([hidden])")) {\n    return "hide";\n  }\n  return "none";\n}\n\n/**\n * @param {HTMLElement} dfn\n * @param {HTMLElement} panel\n * @param {{ x: number, y: number }} clickPosition\n */\nfunction displayPanel(dfn, panel, { x, y }) {\n  panel.hidden = false;\n  // distance (px) between edge of panel and the pointing triangle (caret)\n  const MARGIN = 20;\n\n  const dfnRects = dfn.getClientRects();\n  // Find the `top` offset when the `dfn` can be spread across multiple lines\n  let closestTop = 0;\n  let minDiff = Infinity;\n  for (const rect of dfnRects) {\n    const { top, bottom } = rect;\n    const diffFromClickY = Math.abs((top + bottom) / 2 - y);\n    if (diffFromClickY < minDiff) {\n      minDiff = diffFromClickY;\n      closestTop = top;\n    }\n  }\n\n  const top = window.scrollY + closestTop + dfnRects[0].height;\n  const left = x - MARGIN;\n  panel.style.left = `${left}px`;\n  panel.style.top = `${top}px`;\n\n  // Find if the panel is flowing out of the window\n  const panelRect = panel.getBoundingClientRect();\n  const SCREEN_WIDTH = Math.min(window.innerWidth, window.screen.width);\n  if (panelRect.right > SCREEN_WIDTH) {\n    const newLeft = Math.max(MARGIN, x + MARGIN - panelRect.width);\n    const newCaretOffset = left - newLeft;\n    panel.style.left = `${newLeft}px`;\n    /** @type {HTMLElement | null} */\n    const caret = panel.querySelector(".caret");\n    if (caret) caret.style.left = `${newCaretOffset}px`;\n  }\n\n  // As it\'s a dialog, we trap focus.\n  // TODO: when <dialog> becomes a implemented, we should really\n  // use that.\n  trapFocus(panel, dfn);\n}\n\n/**\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction trapFocus(panel, dfn) {\n  /** @type NodeListOf<HTMLAnchorElement> elements */\n  const anchors = panel.querySelectorAll("a[href]");\n  // No need to trap focus\n  if (!anchors.length) return;\n\n  // Move focus to first anchor element\n  const first = anchors.item(0);\n  first.focus();\n\n  const trapListener = createTrapListener(anchors, panel, dfn);\n  panel.addEventListener("keydown", trapListener);\n\n  // Hiding the panel releases the trap\n  const mo = new MutationObserver(records => {\n    const [record] = records;\n    const target = /** @type HTMLElement */ (record.target);\n    if (target.hidden) {\n      panel.removeEventListener("keydown", trapListener);\n      mo.disconnect();\n    }\n  });\n  mo.observe(panel, { attributes: true, attributeFilter: ["hidden"] });\n}\n\n/**\n *\n * @param {NodeListOf<HTMLAnchorElement>} anchors\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction createTrapListener(anchors, panel, dfn) {\n  const lastIndex = anchors.length - 1;\n  let currentIndex = 0;\n  /**\n   * @param {KeyboardEvent} event\n   */\n  return event => {\n    switch (event.key) {\n      // Hitting "Tab" traps us in a nice loop around elements.\n      case "Tab": {\n        event.preventDefault();\n        currentIndex += event.shiftKey ? -1 : +1;\n        if (currentIndex < 0) {\n          currentIndex = lastIndex;\n        } else if (currentIndex > lastIndex) {\n          currentIndex = 0;\n        }\n        anchors.item(currentIndex).focus();\n        break;\n      }\n\n      // Hitting "Enter" on an anchor releases the trap.\n      case "Enter":\n        hidePanel(panel);\n        break;\n\n      // Hitting "Escape" returns focus to dfn.\n      case "Escape":\n        hidePanel(panel);\n        dfn.focus();\n        return;\n    }\n  };\n}\n\n/** @param {HTMLElement | null} panel */\nfunction hidePanel(panel) {\n  if (!panel) return;\n  panel.hidden = true;\n  panel.classList.remove("docked");\n}\n})()',
      });
  })());
//# sourceMappingURL=respec-aom.js.map
