((window.respecVersion = "35.9.0"),
  (function () {
    "use strict";
    var e = "undefined" != typeof document ? document.currentScript : null;
    const t = !!window.require;
    if (!t) {
      const e = function (e, t) {
        const n = e.map(e => {
          if (!(e in window.require.modules))
            throw new Error(`Unsupported dependency name: ${e}`);
          return window.require.modules[e];
        });
        Promise.all(n).then(e => t(...e));
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
      _ = {},
      E = new WeakMap(),
      S = new WeakMap(),
      C = {
        get(e, t) {
          if (!$.includes(t)) return e[t];
          let n = _[t];
          return (
            n ||
              (n = _[t] =
                function (...e) {
                  E.set(this, S.get(this)[t](...e));
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
      for (S.set(n, t), p.set(n, y(t)); t; )
        (yield n, (t = await (E.get(n) || t.continue())), E.delete(n));
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
    var R = Object.freeze({
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
    const T = /^[!#$%&'*+-.^`|~\w]+$/,
      P = /[\u000A\u000D\u0009\u0020]/u,
      j = /^[\u0009\u{0020}-\{u0073}\u{0080}-\u{00FF}]+$/u;
    function N(e, t, n) {
      ((t && "" !== t && !e.has(t) && j.test(n)) || null === n) &&
        e.set(t.toLowerCase(), n);
    }
    function z() {
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
    var O = {
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
    function D(e) {
      O = e;
    }
    var I = { exec: () => null };
    function q(e, t = "") {
      let n = "string" == typeof e ? e : e.source,
        r = {
          replace: (e, t) => {
            let o = "string" == typeof t ? t : t.source;
            return ((o = o.replace(H.caret, "$1")), (n = n.replace(e, o)), r);
          },
          getRegex: () => new RegExp(n, t),
        };
      return r;
    }
    var M = (() => {
        try {
          return !!new RegExp("(?<=1)(?<!1)");
        } catch {
          return !1;
        }
      })(),
      H = {
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
        listReplaceTabs: /^\t+/,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] /,
        listReplaceTask: /^\[[ xX]\] +/,
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
        unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
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
      },
      B = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      F = /(?:[*+-]|\d{1,9}[.)])/,
      W =
        /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      U = q(W)
        .replace(/bull/g, F)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/\|table/g, "")
        .getRegex(),
      V = q(W)
        .replace(/bull/g, F)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/)
        .getRegex(),
      Z =
        /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      G = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,
      K = q(
        /^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/
      )
        .replace("label", G)
        .replace(
          "title",
          /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
        )
        .getRegex(),
      Y = q(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/)
        .replace(/bull/g, F)
        .getRegex(),
      X =
        "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
      Q = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
      J = q(
        "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))",
        "i"
      )
        .replace("comment", Q)
        .replace("tag", X)
        .replace(
          "attribute",
          / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
        )
        .getRegex(),
      ee = q(Z)
        .replace("hr", B)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("|lheading", "")
        .replace("|table", "")
        .replace("blockquote", " {0,3}>")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", X)
        .getRegex(),
      te = {
        blockquote: q(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
          .replace("paragraph", ee)
          .getRegex(),
        code: /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,
        def: K,
        fences:
          /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        hr: B,
        html: J,
        lheading: U,
        list: Y,
        newline: /^(?:[ \t]*(?:\n|$))+/,
        paragraph: ee,
        table: I,
        text: /^[^\n]+/,
      },
      ne = q(
        "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
      )
        .replace("hr", B)
        .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
        .replace("blockquote", " {0,3}>")
        .replace("code", "(?: {4}| {0,3}\t)[^\\n]")
        .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
        .replace(
          "html",
          "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
        )
        .replace("tag", X)
        .getRegex(),
      re = {
        ...te,
        lheading: V,
        table: ne,
        paragraph: q(Z)
          .replace("hr", B)
          .replace("heading", " {0,3}#{1,6}(?:\\s|$)")
          .replace("|lheading", "")
          .replace("table", ne)
          .replace("blockquote", " {0,3}>")
          .replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace("list", " {0,3}(?:[*+-]|1[.)]) ")
          .replace(
            "html",
            "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)"
          )
          .replace("tag", X)
          .getRegex(),
      },
      oe = {
        ...te,
        html: q(
          "^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))"
        )
          .replace("comment", Q)
          .replace(
            /tag/g,
            "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b"
          )
          .getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: I,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: q(Z)
          .replace("hr", B)
          .replace("heading", " *#{1,6} *[^\n]")
          .replace("lheading", U)
          .replace("|table", "")
          .replace("blockquote", " {0,3}>")
          .replace("|fences", "")
          .replace("|list", "")
          .replace("|html", "")
          .replace("|tag", "")
          .getRegex(),
      },
      ie = /^( {2,}|\\)\n(?!\s*$)/,
      se = /[\p{P}\p{S}]/u,
      ae = /[\s\p{P}\p{S}]/u,
      le = /[^\s\p{P}\p{S}]/u,
      ce = q(/^((?![*_])punctSpace)/, "u")
        .replace(/punctSpace/g, ae)
        .getRegex(),
      ue = /(?!~)[\p{P}\p{S}]/u,
      de = q(/link|precode-code|html/, "g")
        .replace(
          "link",
          /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/
        )
        .replace("precode-", M ? "(?<!`)()" : "(^^|[^`])")
        .replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/)
        .replace("html", /<(?! )[^<>]*?>/)
        .getRegex(),
      pe = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,
      he = q(pe, "u").replace(/punct/g, se).getRegex(),
      fe = q(pe, "u").replace(/punct/g, ue).getRegex(),
      me =
        "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",
      ge = q(me, "gu")
        .replace(/notPunctSpace/g, le)
        .replace(/punctSpace/g, ae)
        .replace(/punct/g, se)
        .getRegex(),
      be = q(me, "gu")
        .replace(/notPunctSpace/g, /(?:[^\s\p{P}\p{S}]|~)/u)
        .replace(/punctSpace/g, /(?!~)[\s\p{P}\p{S}]/u)
        .replace(/punct/g, ue)
        .getRegex(),
      ye = q(
        "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
        "gu"
      )
        .replace(/notPunctSpace/g, le)
        .replace(/punctSpace/g, ae)
        .replace(/punct/g, se)
        .getRegex(),
      we = q(/\\(punct)/, "gu")
        .replace(/punct/g, se)
        .getRegex(),
      ve = q(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
        .replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
        .replace(
          "email",
          /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
        )
        .getRegex(),
      ke = q(Q).replace("(?:--\x3e|$)", "--\x3e").getRegex(),
      xe = q(
        "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
      )
        .replace("comment", ke)
        .replace(
          "attribute",
          /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
        )
        .getRegex(),
      $e =
        /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,
      _e = q(
        /^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/
      )
        .replace("label", $e)
        .replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/)
        .replace(
          "title",
          /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/
        )
        .getRegex(),
      Ee = q(/^!?\[(label)\]\[(ref)\]/)
        .replace("label", $e)
        .replace("ref", G)
        .getRegex(),
      Se = q(/^!?\[(ref)\](?:\[\])?/)
        .replace("ref", G)
        .getRegex(),
      Ce = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,
      Le = {
        _backpedal: I,
        anyPunctuation: we,
        autolink: ve,
        blockSkip: de,
        br: ie,
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        del: I,
        emStrongLDelim: he,
        emStrongRDelimAst: ge,
        emStrongRDelimUnd: ye,
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        link: _e,
        nolink: Se,
        punctuation: ce,
        reflink: Ee,
        reflinkSearch: q("reflink|nolink(?!\\()", "g")
          .replace("reflink", Ee)
          .replace("nolink", Se)
          .getRegex(),
        tag: xe,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        url: I,
      },
      Ae = {
        ...Le,
        link: q(/^!?\[(label)\]\((.*?)\)/)
          .replace("label", $e)
          .getRegex(),
        reflink: q(/^!?\[(label)\]\s*\[([^\]]*)\]/)
          .replace("label", $e)
          .getRegex(),
      },
      Re = {
        ...Le,
        emStrongRDelimAst: be,
        emStrongLDelim: fe,
        url: q(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
          .replace("protocol", Ce)
          .replace(
            "email",
            /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/
          )
          .getRegex(),
        _backpedal:
          /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
        text: q(
          /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
        )
          .replace("protocol", Ce)
          .getRegex(),
      },
      Te = {
        ...Re,
        br: q(ie).replace("{2,}", "*").getRegex(),
        text: q(Re.text)
          .replace("\\b_", "\\b_| {2,}\\n")
          .replace(/\{2,\}/g, "*")
          .getRegex(),
      },
      Pe = { normal: te, gfm: re, pedantic: oe },
      je = { normal: Le, gfm: Re, breaks: Te, pedantic: Ae },
      Ne = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      },
      ze = e => Ne[e];
    function Oe(e, t) {
      if (t) {
        if (H.escapeTest.test(e)) return e.replace(H.escapeReplace, ze);
      } else if (H.escapeTestNoEncode.test(e))
        return e.replace(H.escapeReplaceNoEncode, ze);
      return e;
    }
    function De(e) {
      try {
        e = encodeURI(e).replace(H.percentDecode, "%");
      } catch {
        return null;
      }
      return e;
    }
    function Ie(e, t) {
      let n = e
          .replace(H.findPipe, (e, t, n) => {
            let r = !1,
              o = t;
            for (; --o >= 0 && "\\" === n[o]; ) r = !r;
            return r ? "|" : " |";
          })
          .split(H.splitPipe),
        r = 0;
      if (
        (n[0].trim() || n.shift(),
        n.length > 0 && !n.at(-1)?.trim() && n.pop(),
        t)
      )
        if (n.length > t) n.splice(t);
        else for (; n.length < t; ) n.push("");
      for (; r < n.length; r++) n[r] = n[r].trim().replace(H.slashPipe, "|");
      return n;
    }
    function qe(e, t, n) {
      let r = e.length;
      if (0 === r) return "";
      let o = 0;
      for (; o < r; ) {
        if (e.charAt(r - o - 1) !== t) break;
        o++;
      }
      return e.slice(0, r - o);
    }
    function Me(e, t, n, r, o) {
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
    var He = class {
        options;
        rules;
        lexer;
        constructor(e) {
          this.options = e || O;
        }
        space(e) {
          let t = this.rules.block.newline.exec(e);
          if (t && t[0].length > 0) return { type: "space", raw: t[0] };
        }
        code(e) {
          let t = this.rules.block.code.exec(e);
          if (t) {
            let e = t[0].replace(this.rules.other.codeRemoveIndent, "");
            return {
              type: "code",
              raw: t[0],
              codeBlockStyle: "indented",
              text: this.options.pedantic ? e : qe(e, "\n"),
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
              let t = qe(e, "#");
              (this.options.pedantic ||
                !t ||
                this.rules.other.endingSpaceChar.test(t)) &&
                (e = t.trim());
            }
            return {
              type: "heading",
              raw: t[0],
              depth: t[1].length,
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        hr(e) {
          let t = this.rules.block.hr.exec(e);
          if (t) return { type: "hr", raw: qe(t[0], "\n") };
        }
        blockquote(e) {
          let t = this.rules.block.blockquote.exec(e);
          if (t) {
            let e = qe(t[0], "\n").split("\n"),
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
              let l = t[2]
                  .split("\n", 1)[0]
                  .replace(this.rules.other.listReplaceTabs, e =>
                    " ".repeat(3 * e.length)
                  ),
                c = e.split("\n", 1)[0],
                u = !l.trim(),
                d = 0;
              if (
                (this.options.pedantic
                  ? ((d = 2), (a = l.trimStart()))
                  : u
                    ? (d = t[1].length + 1)
                    : ((d = t[2].search(this.rules.other.nonSpaceChar)),
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
                  s = this.rules.other.htmlBeginRegex(d);
                for (; e; ) {
                  let p,
                    h = e.split("\n", 1)[0];
                  if (
                    ((c = h),
                    this.options.pedantic
                      ? ((c = c.replace(
                          this.rules.other.listReplaceNesting,
                          "  "
                        )),
                        (p = c))
                      : (p = c.replace(this.rules.other.tabCharGlobal, "    ")),
                    o.test(c) ||
                      i.test(c) ||
                      s.test(c) ||
                      t.test(c) ||
                      n.test(c))
                  )
                    break;
                  if (p.search(this.rules.other.nonSpaceChar) >= d || !c.trim())
                    a += "\n" + p.slice(d);
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
                  (!u && !c.trim() && (u = !0),
                    (r += h + "\n"),
                    (e = e.substring(h.length + 1)),
                    (l = p.slice(d)));
                }
              }
              o.loose ||
                (s
                  ? (o.loose = !0)
                  : this.rules.other.doubleBlankLine.test(r) && (s = !0));
              let p,
                h = null;
              (this.options.gfm &&
                ((h = this.rules.other.listIsTask.exec(a)),
                h &&
                  ((p = "[ ] " !== h[0]),
                  (a = a.replace(this.rules.other.listReplaceTask, "")))),
                o.items.push({
                  type: "list_item",
                  raw: r,
                  task: !!h,
                  checked: p,
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
            for (let e = 0; e < o.items.length; e++)
              if (
                ((this.lexer.state.top = !1),
                (o.items[e].tokens = this.lexer.blockTokens(
                  o.items[e].text,
                  []
                )),
                !o.loose)
              ) {
                let t = o.items[e].tokens.filter(e => "space" === e.type),
                  n =
                    t.length > 0 &&
                    t.some(e => this.rules.other.anyLine.test(e.raw));
                o.loose = n;
              }
            if (o.loose)
              for (let e = 0; e < o.items.length; e++) o.items[e].loose = !0;
            return o;
          }
        }
        html(e) {
          let t = this.rules.block.html.exec(e);
          if (t)
            return {
              type: "html",
              block: !0,
              raw: t[0],
              pre: "pre" === t[1] || "script" === t[1] || "style" === t[1],
              text: t[0],
            };
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
            return { type: "def", tag: e, raw: t[0], href: n, title: r };
          }
        }
        table(e) {
          let t = this.rules.block.table.exec(e);
          if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
          let n = Ie(t[1]),
            r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"),
            o = t[3]?.trim()
              ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n")
              : [],
            i = { type: "table", raw: t[0], header: [], align: [], rows: [] };
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
                Ie(e, i.header.length).map((e, t) => ({
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
          if (t)
            return {
              type: "heading",
              raw: t[0],
              depth: "=" === t[2].charAt(0) ? 1 : 2,
              text: t[1],
              tokens: this.lexer.inline(t[1]),
            };
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
              let t = qe(e.slice(0, -1), "\\");
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
              Me(
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
            return Me(n, e, n[0], this.lexer, this.rules);
          }
        }
        emStrong(e, t, n = "") {
          let r = this.rules.inline.emStrongLDelim.exec(e);
          if (
            !(!r || (r[3] && n.match(this.rules.other.unicodeAlphaNumeric))) &&
            ((!r[1] && !r[2]) || !n || this.rules.inline.punctuation.exec(n))
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
              null != (r = l.exec(t));
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
        del(e) {
          let t = this.rules.inline.del.exec(e);
          if (t)
            return {
              type: "del",
              raw: t[0],
              text: t[2],
              tokens: this.lexer.inlineTokens(t[2]),
            };
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
      Be = class e {
        tokens;
        options;
        state;
        tokenizer;
        inlineQueue;
        constructor(e) {
          ((this.tokens = []),
            (this.tokens.links = Object.create(null)),
            (this.options = e || O),
            (this.options.tokenizer = this.options.tokenizer || new He()),
            (this.tokenizer = this.options.tokenizer),
            (this.tokenizer.options = this.options),
            (this.tokenizer.lexer = this),
            (this.inlineQueue = []),
            (this.state = { inLink: !1, inRawBlock: !1, top: !0 }));
          let t = { other: H, block: Pe.normal, inline: je.normal };
          (this.options.pedantic
            ? ((t.block = Pe.pedantic), (t.inline = je.pedantic))
            : this.options.gfm &&
              ((t.block = Pe.gfm),
              this.options.breaks
                ? (t.inline = je.breaks)
                : (t.inline = je.gfm)),
            (this.tokenizer.rules = t));
        }
        static get rules() {
          return { block: Pe, inline: je };
        }
        static lex(t, n) {
          return new e(n).lex(t);
        }
        static lexInline(t, n) {
          return new e(n).inlineTokens(t);
        }
        lex(e) {
          ((e = e.replace(H.carriageReturn, "\n")),
            this.blockTokens(e, this.tokens));
          for (let e = 0; e < this.inlineQueue.length; e++) {
            let t = this.inlineQueue[e];
            this.inlineTokens(t.src, t.tokens);
          }
          return ((this.inlineQueue = []), this.tokens);
        }
        blockTokens(e, t = [], n = !1) {
          for (
            this.options.pedantic &&
            (e = e.replace(H.tabCharGlobal, "    ").replace(H.spaceLine, ""));
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
          let n,
            r = e,
            o = null;
          if (this.tokens.links) {
            let e = Object.keys(this.tokens.links);
            if (e.length > 0)
              for (
                ;
                null != (o = this.tokenizer.rules.inline.reflinkSearch.exec(r));
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
            null != (o = this.tokenizer.rules.inline.anyPunctuation.exec(r));
          )
            r =
              r.slice(0, o.index) +
              "++" +
              r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
          for (; null != (o = this.tokenizer.rules.inline.blockSkip.exec(r)); )
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
            if ((n = this.tokenizer.del(e))) {
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
      Fe = class {
        options;
        parser;
        constructor(e) {
          this.options = e || O;
        }
        space(e) {
          return "";
        }
        code({ text: e, lang: t, escaped: n }) {
          let r = (t || "").match(H.notSpaceStart)?.[0],
            o = e.replace(H.endingNewline, "") + "\n";
          return r
            ? '<pre><code class="language-' +
                Oe(r) +
                '">' +
                (n ? o : Oe(o, !0)) +
                "</code></pre>\n"
            : "<pre><code>" + (n ? o : Oe(o, !0)) + "</code></pre>\n";
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
          let t = "";
          if (e.task) {
            let n = this.checkbox({ checked: !!e.checked });
            e.loose
              ? "paragraph" === e.tokens[0]?.type
                ? ((e.tokens[0].text = n + " " + e.tokens[0].text),
                  e.tokens[0].tokens &&
                    e.tokens[0].tokens.length > 0 &&
                    "text" === e.tokens[0].tokens[0].type &&
                    ((e.tokens[0].tokens[0].text =
                      n + " " + Oe(e.tokens[0].tokens[0].text)),
                    (e.tokens[0].tokens[0].escaped = !0)))
                : e.tokens.unshift({
                    type: "text",
                    raw: n + " ",
                    text: n + " ",
                    escaped: !0,
                  })
              : (t += n + " ");
          }
          return (
            (t += this.parser.parse(e.tokens, !!e.loose)),
            `<li>${t}</li>\n`
          );
        }
        checkbox({ checked: e }) {
          return (
            "<input " +
            (e ? 'checked="" ' : "") +
            'disabled="" type="checkbox">'
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
          return `<code>${Oe(e, !0)}</code>`;
        }
        br(e) {
          return "<br>";
        }
        del({ tokens: e }) {
          return `<del>${this.parser.parseInline(e)}</del>`;
        }
        link({ href: e, title: t, tokens: n }) {
          let r = this.parser.parseInline(n),
            o = De(e);
          if (null === o) return r;
          let i = '<a href="' + (e = o) + '"';
          return (
            t && (i += ' title="' + Oe(t) + '"'),
            (i += ">" + r + "</a>"),
            i
          );
        }
        image({ href: e, title: t, text: n, tokens: r }) {
          r && (n = this.parser.parseInline(r, this.parser.textRenderer));
          let o = De(e);
          if (null === o) return Oe(n);
          let i = `<img src="${(e = o)}" alt="${n}"`;
          return (t && (i += ` title="${Oe(t)}"`), (i += ">"), i);
        }
        text(e) {
          return "tokens" in e && e.tokens
            ? this.parser.parseInline(e.tokens)
            : "escaped" in e && e.escaped
              ? e.text
              : Oe(e.text);
        }
      },
      We = class {
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
      },
      Ue = class e {
        options;
        renderer;
        textRenderer;
        constructor(e) {
          ((this.options = e || O),
            (this.options.renderer = this.options.renderer || new Fe()),
            (this.renderer = this.options.renderer),
            (this.renderer.options = this.options),
            (this.renderer.parser = this),
            (this.textRenderer = new We()));
        }
        static parse(t, n) {
          return new e(n).parse(t);
        }
        static parseInline(t, n) {
          return new e(n).parseInline(t);
        }
        parse(e, t = !0) {
          let n = "";
          for (let r = 0; r < e.length; r++) {
            let o = e[r];
            if (this.options.extensions?.renderers?.[o.type]) {
              let e = o,
                t = this.options.extensions.renderers[e.type].call(
                  { parser: this },
                  e
                );
              if (
                !1 !== t ||
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
                n += t || "";
                continue;
              }
            }
            let i = o;
            switch (i.type) {
              case "space":
                n += this.renderer.space(i);
                continue;
              case "hr":
                n += this.renderer.hr(i);
                continue;
              case "heading":
                n += this.renderer.heading(i);
                continue;
              case "code":
                n += this.renderer.code(i);
                continue;
              case "table":
                n += this.renderer.table(i);
                continue;
              case "blockquote":
                n += this.renderer.blockquote(i);
                continue;
              case "list":
                n += this.renderer.list(i);
                continue;
              case "html":
                n += this.renderer.html(i);
                continue;
              case "def":
                n += this.renderer.def(i);
                continue;
              case "paragraph":
                n += this.renderer.paragraph(i);
                continue;
              case "text": {
                let o = i,
                  s = this.renderer.text(o);
                for (; r + 1 < e.length && "text" === e[r + 1].type; )
                  ((o = e[++r]), (s += "\n" + this.renderer.text(o)));
                n += t
                  ? this.renderer.paragraph({
                      type: "paragraph",
                      raw: s,
                      text: s,
                      tokens: [{ type: "text", raw: s, text: s, escaped: !0 }],
                    })
                  : s;
                continue;
              }
              default: {
                let e = 'Token with "' + i.type + '" type was not found.';
                if (this.options.silent) return (console.error(e), "");
                throw new Error(e);
              }
            }
          }
          return n;
        }
        parseInline(e, t = this.renderer) {
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
      Ve = class {
        options;
        block;
        constructor(e) {
          this.options = e || O;
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
        provideLexer() {
          return this.block ? Be.lex : Be.lexInline;
        }
        provideParser() {
          return this.block ? Ue.parse : Ue.parseInline;
        }
      },
      Ze = new (class {
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
        Parser = Ue;
        Renderer = Fe;
        TextRenderer = We;
        Lexer = Be;
        Tokenizer = He;
        Hooks = Ve;
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
                let t = this.defaults.renderer || new Fe(this.defaults);
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
                let t = this.defaults.tokenizer || new He(this.defaults);
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
                let t = this.defaults.hooks || new Ve();
                for (let n in e.hooks) {
                  if (!(n in t)) throw new Error(`hook '${n}' does not exist`);
                  if (["options", "block"].includes(n)) continue;
                  let r = n,
                    o = e.hooks[r],
                    i = t[r];
                  Ve.passThroughHooks.has(n)
                    ? (t[r] = e => {
                        if (
                          this.defaults.async &&
                          Ve.passThroughHooksRespectAsync.has(n)
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
          return Be.lex(e, t ?? this.defaults);
        }
        parser(e, t) {
          return Ue.parse(e, t ?? this.defaults);
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
                      ? await o.hooks.provideLexer()
                      : e
                        ? Be.lex
                        : Be.lexInline
                  )(n, o),
                  i = o.hooks ? await o.hooks.processAllTokens(r) : r;
                o.walkTokens &&
                  (await Promise.all(this.walkTokens(i, o.walkTokens)));
                let s = await (
                  o.hooks
                    ? await o.hooks.provideParser()
                    : e
                      ? Ue.parse
                      : Ue.parseInline
                )(i, o);
                return o.hooks ? await o.hooks.postprocess(s) : s;
              })().catch(i);
            try {
              o.hooks && (t = o.hooks.preprocess(t));
              let n = (
                o.hooks ? o.hooks.provideLexer() : e ? Be.lex : Be.lexInline
              )(t, o);
              (o.hooks && (n = o.hooks.processAllTokens(n)),
                o.walkTokens && this.walkTokens(n, o.walkTokens));
              let r = (
                o.hooks
                  ? o.hooks.provideParser()
                  : e
                    ? Ue.parse
                    : Ue.parseInline
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
                Oe(n.message + "", !0) +
                "</pre>";
              return t ? Promise.resolve(e) : e;
            }
            if (t) return Promise.reject(n);
            throw n;
          };
        }
      })();
    function Ge(e, t) {
      return Ze.parse(e, t);
    }
    function Ke(e) {
      return e &&
        e.__esModule &&
        Object.prototype.hasOwnProperty.call(e, "default")
        ? e.default
        : e;
    }
    ((Ge.options = Ge.setOptions =
      function (e) {
        return (
          Ze.setOptions(e),
          (Ge.defaults = Ze.defaults),
          D(Ge.defaults),
          Ge
        );
      }),
      (Ge.getDefaults = z),
      (Ge.defaults = O),
      (Ge.use = function (...e) {
        return (Ze.use(...e), (Ge.defaults = Ze.defaults), D(Ge.defaults), Ge);
      }),
      (Ge.walkTokens = function (e, t) {
        return Ze.walkTokens(e, t);
      }),
      (Ge.parseInline = Ze.parseInline),
      (Ge.Parser = Ue),
      (Ge.parser = Ue.parse),
      (Ge.Renderer = Fe),
      (Ge.TextRenderer = We),
      (Ge.Lexer = Be),
      (Ge.lexer = Be.lex),
      (Ge.Tokenizer = He),
      (Ge.Hooks = Ve),
      (Ge.parse = Ge),
      Ge.options,
      Ge.setOptions,
      Ge.use,
      Ge.walkTokens,
      Ge.parseInline,
      Ue.parse,
      Be.lex);
    var Ye,
      Xe = { exports: {} };
    var Qe,
      Je =
        (Ye ||
          ((Ye = 1),
          (Qe = Xe),
          (function (e, t) {
            Qe.exports = t();
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
        Xe.exports),
      et = Ke(Je),
      tt = (function (e) {
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
          _,
          E,
          S,
          C,
          L,
          A = {},
          R = {},
          T = [],
          P = R.hasOwnProperty,
          j = 0,
          N = {
            attributes: A,
            define: function (e, t) {
              e.indexOf("-") < 0
                ? (e in R || (j = T.push(e)), (R[e] = t))
                : (A[e] = t);
            },
            invoke: function (e, t) {
              for (var n = 0; n < j; n++) {
                var r = T[n];
                if (P.call(e, r)) return R[r](e[r], t);
              }
            },
          },
          z =
            Array.isArray ||
            ((_ = ($ = {}.toString).call([])),
            function (e) {
              return $.call(e) === _;
            }),
          O =
            ((E = e),
            (S = "fragment"),
            (L =
              "content" in I((C = "template"))
                ? function (e) {
                    var t = I(C);
                    return ((t.innerHTML = e), t.content);
                  }
                : function (e) {
                    var t,
                      n = I(S),
                      r = I(C);
                    return (
                      D(
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
                      var t = I(S),
                        n = I("div");
                      return (
                        (n.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg">' +
                          e +
                          "</svg>"),
                        D(t, n.firstChild.childNodes),
                        t
                      );
                    }
                  : L
              )(e);
            });
        function D(e, t) {
          for (var n = t.length; n--; ) e.appendChild(t[0]);
        }
        function I(e) {
          return e === S
            ? E.createDocumentFragment()
            : E.createElementNS("http://www.w3.org/1999/xhtml", e);
        }
        var q,
          M,
          H,
          B,
          F,
          W,
          U,
          V,
          Z,
          G =
            ((M = "appendChild"),
            (H = "cloneNode"),
            (B = "createTextNode"),
            (W = (F = "importNode") in (q = e)),
            (U = q.createDocumentFragment())[M](q[B]("g")),
            U[M](q[B]("")),
            (W ? q[F](U, !0) : U[H](!0)).childNodes.length < 2
              ? function e(t, n) {
                  for (
                    var r = t[H](), o = t.childNodes || [], i = o.length, s = 0;
                    n && s < i;
                    s++
                  )
                    r[M](e(o[s], n));
                  return r;
                }
              : W
                ? q[F]
                : function (e, t) {
                    return e[H](!!t);
                  }),
          K =
            "".trim ||
            function () {
              return String(this).replace(/^\s+|\s+/g, "");
            },
          Y = "-" + Math.random().toFixed(6) + "%",
          X = !1;
        try {
          ((V = e.createElement("template")),
            (Z = "tabindex"),
            ("content" in V &&
              ((V.innerHTML = "<p " + Z + '="' + Y + '"></p>'),
              V.content.childNodes[0].getAttribute(Z) == Y)) ||
              ((Y = "_dt: " + Y.slice(1, -1) + ";"), (X = !0)));
        } catch (u) {}
        var Q = "\x3c!--" + Y + "--\x3e",
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
          return t + (n || '"') + Y + (n || '"');
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
                      h = p.value === Y;
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
                if (u === Y)
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
                  K.call(l.textContent) === Q &&
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
          var o = O(n, e.type);
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
              0 === K.call(r.textContent).length &&
              e.removeChild(r);
          }
        }
        var _e,
          Ee,
          Se =
            ((_e = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i),
            (Ee = /([^A-Z])([A-Z]+)/g),
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
                      "number" != typeof (l = o[s]) || _e.test(s)
                        ? l
                        : l + "px"),
                      !t && /^--/.test(s) ? i.setProperty(s, a) : (i[s] = a));
                  ((n = "object"),
                    t
                      ? (e.value = (function (e) {
                          var t,
                            n = [];
                          for (t in e)
                            n.push(t.replace(Ee, Ce), ":", e[t], ";");
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
          Re,
          Te =
            ((Ae = [].slice),
            ((Re = Pe.prototype).ELEMENT_NODE = 1),
            (Re.nodeType = 111),
            (Re.remove = function (e) {
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
            (Re.valueOf = function (e) {
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
            Pe);
        function Pe(e) {
          var t = (this.childNodes = Ae.call(e, 0));
          ((this.firstChild = t[0]),
            (this.lastChild = t[t.length - 1]),
            (this.ownerDocument = t[0].ownerDocument),
            (this._ = null));
        }
        function je(e) {
          return { html: e };
        }
        function Ne(e, t) {
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
              return Ne(e.render(), t);
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
                  ? Promise.resolve(e.html).then(je).then(t)
                  : Promise.resolve(N.invoke(e, t)).then(t));
        }
        function Oe(e) {
          return null != e && "then" in e;
        }
        var De,
          Ie,
          qe,
          Me,
          He,
          Be = "ownerSVGElement",
          Fe = v.prototype.nodeType,
          We = Te.prototype.nodeType,
          Ue =
            ((Ie = (De = { Event: b, WeakSet: u }).Event),
            (qe = De.WeakSet),
            (Me = !0),
            (He = null),
            function (e) {
              return (
                Me &&
                  ((Me = !Me),
                  (He = new qe()),
                  (function (e) {
                    var t = new qe(),
                      n = new qe();
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
                        var o, i = new Ie(t), s = e.length, a = 0;
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
          Ve = /^(?:form|list)$/i,
          Ze = [].slice;
        function Ge(t) {
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
                    (r = a.updates(G.call(e, a.content, !0)))),
                  r.apply(null, arguments)
                );
              };
            })(this)
          );
        }
        var Ke = !(Ge.prototype = {
            attribute: function (e, t, n) {
              var r,
                o = Be in e;
              if ("style" === t) return Se(e, n, o);
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
              if ("data" === t || (!o && t in e && !Ve.test(t)))
                return function (n) {
                  r !== n &&
                    ((r = n),
                    e[t] !== n && null == n
                      ? ((e[t] = ""), e.removeAttribute(t))
                      : (e[t] = n));
                };
              if (t in N.attributes)
                return function (n) {
                  var o = N.attributes[t](e, n);
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
                r = { node: Ne, before: e },
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
                    if (((i = !1), z((n = a))))
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
                              (z(a[0]) && (a = a.concat.apply([], a)), Oe(a[0]))
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
                            11 === a.nodeType ? Ze.call(a.childNodes) : [a],
                            r
                          ))
                        : Oe(a)
                          ? a.then(s)
                          : "placeholder" in a
                            ? ze(a, s)
                            : "text" in a
                              ? s(String(a.text))
                              : "any" in a
                                ? s(a.any)
                                : "html" in a
                                  ? (t = f(
                                      e.parentNode,
                                      t,
                                      Ze.call(
                                        O([].concat(a.html).join(""), o)
                                          .childNodes
                                      ),
                                      r
                                    ))
                                  : s(
                                      "length" in a
                                        ? Ze.call(a)
                                        : N.invoke(a, s)
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
                    ? Oe(r)
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
                                    ? Ze.call(r).join("")
                                    : N.invoke(r, n)
                          )
                    : "function" == o
                      ? n(r(e))
                      : (e.textContent = null == r ? "" : r));
              };
            },
          }),
          Ye = function (t) {
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
                  (Ye = l
                    ? i
                    : ((s = new n()),
                      function (e) {
                        return s.get(e) || ((n = i((t = e))), s.set(t, n), n);
                        var t, n;
                      })))
                : (Ke = !0),
              Xe(t)
            );
          };
        function Xe(e) {
          return Ke ? e : Ye(e);
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
                  ? ((r = o[0]), (n = new Ge(e)), (t = nt(n.apply(n, o))))
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
            return 1 === n ? t[0] : n ? new Te(t) : e;
          },
          rt = new n();
        function ot() {
          var e = rt.get(this),
            t = Qe.apply(null, arguments);
          return (
            e && e.template === t[0]
              ? e.tagger.apply(null, t)
              : function (e) {
                  var t = new Ge(Be in this ? "svg" : "html");
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
          ct = N.define,
          ut = Ge.prototype;
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
        Component: nt,
        bind: rt,
        define: ot,
        diff: it,
        hyper: st,
        wire: at,
      } = tt,
      lt = tt,
      ct = R,
      ut = Ge,
      dt = class {
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
                      N(i, r, o),
                      (r = ""));
                    continue;
                  }
                  o = "string" == typeof o ? o + l : l;
                  break;
                case "collect-quoted-string":
                  if ('"' === l) {
                    (N(i, r, o),
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
            r && N(i, r, o);
            if ("" === t.trim() || !T.test(t))
              throw new TypeError("Invalid type");
            if ("" === n.trim() || !T.test(n))
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
                  ? T.test(n)
                    ? (r += `=${n}`)
                    : (r += `="${n}"`)
                  : (r += '=""'),
                (r += ";"));
            return e.essence + r.slice(0, -1);
          })(this);
        }
      },
      pt = et,
      ht = /-/g,
      ft = new Intl.DateTimeFormat(["sv-SE"], {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      mt = "en" === i || i.startsWith("en-") ? "en-AU" : i,
      gt = new Intl.DateTimeFormat(mt, {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "en-AU" === mt ? "2-digit" : "numeric",
      }),
      bt =
        ".informative, .note, .issue, .example, .ednote, .practice, .introductory";
    function yt(e) {
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
          ("as" in e && n.setAttribute("as", e.as),
            e.corsMode && (n.crossOrigin = e.corsMode));
      }
      return ((n.href = r), e.dontRemove || n.classList.add("removeOnSave"), n);
    }
    function wt(e) {
      e.querySelectorAll(".remove, script[data-requiremodule]").forEach(e => {
        e.remove();
      });
    }
    function vt(e, t = "long") {
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
    const kt = vt("conjunction"),
      xt = vt("disjunction");
    function $t(e, t) {
      return kt(e, t).join("");
    }
    function _t(e) {
      return e.trim().replace(/\s+/g, " ");
    }
    function Et(e, t = i) {
      return (
        (t = t.toLowerCase()),
        new Proxy(e, {
          get(e, n) {
            const r =
              (function (e, t, n = i) {
                return (
                  (n = n.toLowerCase()),
                  e[n]?.[t] || e[n.match(/^(\w{2,3})-.+$/)?.[1]]?.[t]
                );
              })(e, n, t) || e.en[n];
            if (!r) throw new Error(`No l10n data for key: "${n}"`);
            return r;
          },
        })
      );
    }
    function St(e, t, ...n) {
      const r = [this, e, ...n];
      if (t) {
        const n = t.split(/\s+/);
        for (const t of n) {
          const n = window[t];
          if (n)
            try {
              e = n.apply(this, r);
            } catch (e) {
              Bt(
                `call to \`${t}()\` failed with: ${e}.`,
                "utils/runTransforms",
                { hint: "See developer console for stack trace.", cause: e }
              );
            }
        }
      }
      return e;
    }
    function Ct(e, t = e => e) {
      const n = e.map(t),
        r = n.slice(0, -1).map(e => lt`${e}, `);
      return lt`${r}${n[n.length - 1]}`;
    }
    function Lt(e, t = "", n = "", r = !1) {
      if (e.id) return e.id;
      n || (n = (e.title ? e.title : e.textContent).trim());
      let o = r ? n : n.toLowerCase();
      if (
        ((o = o
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\W+/gim, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "")),
        o
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
    function At(e) {
      const t = new Set(),
        n = "ltNodefault" in e.dataset ? "" : _t(e.textContent),
        r = e.children[0];
      if (
        (e.dataset.lt
          ? e.dataset.lt
              .split("|")
              .map(e => _t(e))
              .forEach(e => t.add(e))
          : 1 === e.childNodes.length &&
              1 === e.getElementsByTagName("abbr").length &&
              r.title
            ? t.add(r.title)
            : '""' === e.textContent && t.add("the-empty-string"),
        t.add(n),
        t.delete(""),
        e.dataset.localLt)
      ) {
        e.dataset.localLt.split("|").forEach(e => t.add(_t(e)));
      }
      return [...t];
    }
    function Rt(e, t, n = { copyAttributes: !0 }) {
      if (e.localName === t) return e;
      const r = e.ownerDocument.createElement(t);
      if (n.copyAttributes)
        for (const { name: t, value: n } of e.attributes) r.setAttribute(t, n);
      return (r.append(...e.childNodes), e.replaceWith(r), r);
    }
    function Tt(e, t) {
      const n = t.closest(bt);
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
    function Pt(e, t) {
      return (t.append(...e.childNodes), e.appendChild(t), e);
    }
    function jt(e, t) {
      const n = [];
      let r = e.parentElement;
      for (; r; ) {
        const e = r.closest(t);
        if (!e) break;
        (n.push(e), (r = e.parentElement));
      }
      return n;
    }
    function Nt(e) {
      const { previousSibling: t } = e;
      if (!t || t.nodeType !== Node.TEXT_NODE) return "";
      const n = t.textContent.lastIndexOf("\n");
      if (-1 === n) return "";
      const r = t.textContent.slice(n + 1);
      return /\S/.test(r) ? "" : r;
    }
    class zt extends Set {
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
          : super.delete(this.getCanonicalKey(e));
      }
      getCanonicalKey(e) {
        return super.has(e)
          ? e
          : [...this.keys()].find(t => t.toLowerCase() === e.toLowerCase());
      }
    }
    function Ot(e) {
      const t = e.cloneNode(!0);
      return (
        t.querySelectorAll("[id]").forEach(e => e.removeAttribute("id")),
        t.querySelectorAll("dfn").forEach(e => {
          Rt(e, "span", { copyAttributes: !1 });
        }),
        t.hasAttribute("id") && t.removeAttribute("id"),
        Dt(t),
        t
      );
    }
    function Dt(e) {
      const t = document.createTreeWalker(e, NodeFilter.SHOW_COMMENT);
      for (const e of [...It(t)]) e.remove();
    }
    function* It(e) {
      for (; e.nextNode(); ) yield e.currentNode;
    }
    class qt extends Map {
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
    class Mt extends Error {
      constructor(e, t, n) {
        super(e, { ...(n.cause && { cause: n.cause }) });
        const r = n.isWarning ? "ReSpecWarning" : "ReSpecError";
        (Object.assign(this, { message: e, plugin: t, name: r, ...n }),
          n.elements &&
            n.elements.forEach(t =>
              (function (e, t, n) {
                (e.classList.add("respec-offending-element"),
                  e.hasAttribute("title") || e.setAttribute("title", n || t),
                  e.id || Lt(e, "respec-offender"));
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
    function Ht(e, t, n = {}) {
      const r = { ...n, isWarning: !1 };
      Kt("error", new Mt(e, t, r));
    }
    function Bt(e, t, n = {}) {
      const r = { ...n, isWarning: !0 };
      Kt("warn", new Mt(e, t, r));
    }
    function Ft(e) {
      return {
        showError: (t, n) => Ht(t, e, n),
        showWarning: (t, n) => Bt(t, e, n),
      };
    }
    function Wt(e) {
      return e ? `\`${e}\`` : "";
    }
    function Ut(e, { quotes: t } = { quotes: !1 }) {
      return xt(
        e,
        t
          ? e => {
              return Wt(((t = e), String(t) ? `"${t}"` : ""));
              var t;
            }
          : Wt
      ).join("");
    }
    function Vt(e, ...t) {
      return Zt(
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
    function Zt(e) {
      if (!e) return e;
      const t = e.trimEnd().split("\n");
      for (; t.length && !t[0].trim(); ) t.shift();
      const n = t.filter(e => e.trim()).map(e => e.search(/[^\s]/)),
        r = Math.min(...n);
      return t.map(e => e.slice(r)).join("\n");
    }
    const Gt = new EventTarget();
    function Kt(e, t) {
      if (
        (Gt.dispatchEvent(new CustomEvent(e, { detail: t })),
        window.parent === window.self)
      )
        return;
      const n = String(JSON.stringify(t?.stack || t));
      window.parent.postMessage(
        { topic: e, args: n },
        window.parent.location.origin
      );
    }
    function Yt(e, t, n = { once: !1 }) {
      Gt.addEventListener(
        e,
        async n => {
          try {
            await t(n.detail);
          } catch (t) {
            Ht(`Error in handler for topic "${e}": ${t.message}`, `sub:${e}`, {
              cause: t,
            });
          }
        },
        n
      );
    }
    n("core/pubsubhub", { sub: Yt });
    const Xt = ["githubToken", "githubUser"];
    const Qt = new Map([
      ["text/html", "html"],
      ["application/xml", "xml"],
    ]);
    function Jt(e, t = document) {
      const n = Qt.get(e);
      if (!n) {
        const t = [...Qt.values()].join(", ");
        throw new TypeError(`Invalid format: ${e}. Expected one of: ${t}.`);
      }
      const r = en(n, t);
      return `data:${e};charset=utf-8,${encodeURIComponent(r)}`;
    }
    function en(e, t) {
      const n = t.cloneNode(!0);
      !(function (e) {
        const { head: t, body: n, documentElement: r } = e;
        (Dt(e),
          e
            .querySelectorAll(".removeOnSave, #toc-nav")
            .forEach(e => e.remove()),
          n.classList.remove("toc-sidebar"),
          wt(r));
        const o = e.createDocumentFragment(),
          i = e.querySelector("meta[name='viewport']");
        i && t.firstChild !== i && o.appendChild(i);
        let s = e.querySelector("meta[charset], meta[content*='charset=']");
        s || (s = lt`<meta charset="utf-8" />`);
        o.appendChild(s);
        const a = `ReSpec ${window.respecVersion || "Developer Channel"}`,
          l = lt`
    <meta name="generator" content="${a}" />
  `;
        (o.appendChild(l), t.prepend(o), Kt("beforesave", r));
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
    n("core/exporter", { rsDocToDataURL: Jt });
    class tn {
      constructor() {
        ((this._respecDonePromise = new Promise(e => {
          Yt("end-all", () => e(), { once: !0 });
        })),
          (this.errors = []),
          (this.warnings = []),
          Yt("error", e => {
            (console.error(e, e.toJSON()), this.errors.push(e));
          }),
          Yt("warn", e => {
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
        return en("html", document);
      }
    }
    const nn = "core/post-process";
    const rn = "core/pre-process";
    const on = "core/base-runner";
    async function sn(e) {
      (!(function () {
        const e = new tn();
        Object.defineProperty(document, "respec", { value: e });
      })(),
        Kt("start-all", respecConfig),
        (function (e) {
          const t = {},
            n = e => Object.assign(t, e);
          (n(e),
            Yt("amend-user-config", n),
            Yt("end-all", () => {
              const e = document.createElement("script");
              ((e.id = "initialUserConfig"), (e.type = "application/json"));
              for (const e of Xt) e in t && delete t[e];
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
          (Object.assign(e, r), Kt("amend-user-config", r));
        })(respecConfig),
        performance.mark(`${on}-start`),
        await (async function (e) {
          if (Array.isArray(e.preProcess)) {
            const t = e.preProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  Ht("Every item in `preProcess` must be a JS function.", rn),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${rn}/${r.name || `[${n}]`}`,
                o = Ft(t);
              try {
                await r(e, document, o);
              } catch (e) {
                Ht(`Function ${t} threw an error during \`preProcess\`.`, rn, {
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
              await n.prepare(t);
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
                    ? (await new n.Plugin(t).run(), r())
                    : n.run && (await n.run(t), r());
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
        Kt("plugins-done", respecConfig),
        await (async function (e) {
          if (Array.isArray(e.postProcess)) {
            const t = e.postProcess.filter(e => {
              const t = "function" == typeof e;
              return (
                t ||
                  Ht("Every item in `postProcess` must be a JS function.", nn),
                t
              );
            });
            for (const [n, r] of t.entries()) {
              const t = `${nn}/${r.name || `[${n}]`}`,
                o = Ft(t);
              try {
                await r(e, document, o);
              } catch (e) {
                Ht(`Function ${t} threw an error during \`postProcess\`.`, nn, {
                  hint: "See developer console.",
                  cause: e,
                });
              }
            }
          }
          "function" == typeof e.afterEnd && (await e.afterEnd(e, document));
        })(respecConfig),
        Kt("end-all"),
        wt(document),
        performance.mark(`${on}-end`),
        performance.measure(on, `${on}-start`, `${on}-end`));
    }
    var an = String.raw`.respec-modal .close-button{position:absolute;z-index:inherit;padding:.2em;font-weight:700;cursor:pointer;margin-left:5px;border:none;background:0 0}
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
    const ln = /&gt;/gm,
      cn = /&amp;/gm;
    class un extends ut.Renderer {
      code(e) {
        const { text: t, lang: n = "" } = e,
          { language: r, ...o } = un.parseInfoString(n);
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
    const dn = { gfm: !0, renderer: new un() };
    function pn(e, t = { inline: !1 }) {
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
        r = n.replace(ln, ">").replace(cn, "&");
      return t.inline ? ut.parseInline(r, dn) : ut.parse(r, dn);
    }
    function hn(e) {
      for (const t of e.getElementsByTagName("pre")) t.prepend("\n");
      e.innerHTML = pn(e.innerHTML);
    }
    const fn =
      ((mn = "[data-format='markdown']:not(body)"),
      e => {
        const t = e.querySelectorAll(mn);
        return (t.forEach(hn), Array.from(t));
      });
    var mn;
    var gn = Object.freeze({
      __proto__: null,
      markdownToHtml: pn,
      name: "core/markdown",
      run: function (e) {
        const t = !!document.querySelector("[data-format=markdown]:not(body)"),
          n = "markdown" === e.format;
        if (!n && !t) return;
        if (!n) return void fn(document.body);
        const r = document.getElementById("respec-ui");
        r.remove();
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
              const t = Nt(e);
              e.append(`\n\n${t}`);
            }
          }
        })(
          o,
          "[data-format=markdown], section, div, address, article, aside, figure, header, main"
        ),
          hn(o),
          (function (e) {
            Array.from(e).forEach(e => {
              e.replaceWith(e.textContent);
            });
          })(o.querySelectorAll(".nolinks a[href]")),
          o.append(r),
          document.body.replaceWith(o));
      },
    });
    function bn(e, t) {
      e &&
        Array.from(t).forEach(([t, n]) => {
          e.setAttribute(`aria-${t}`, n);
        });
    }
    !(function () {
      const e = document.createElement("style");
      ((e.id = "respec-ui-styles"),
        (e.textContent = an),
        e.classList.add("removeOnSave"),
        document.head.appendChild(e));
    })();
    const yn = lt`<div id="respec-ui" class="removeOnSave" hidden></div>`,
      wn = lt`<ul
  id="respec-menu"
  role="menu"
  aria-labelledby="respec-pill"
  hidden
></ul>`,
      vn = lt`<button
  class="close-button"
  onclick=${() => Tn.closeModal()}
  title="Close"
>
  ❌
</button>`;
    let kn, xn;
    window.addEventListener("load", () => Ln(wn));
    const $n = [],
      _n = [],
      En = {};
    (Yt("start-all", () => document.body.prepend(yn), { once: !0 }),
      Yt("end-all", () => document.body.prepend(yn), { once: !0 }));
    const Sn = lt`<button id="respec-pill" disabled>ReSpec</button>`;
    function Cn() {
      (wn.classList.toggle("respec-hidden"),
        wn.classList.toggle("respec-visible"),
        (wn.hidden = !wn.hidden));
    }
    function Ln(e) {
      const t = e.querySelectorAll(
          "a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])"
        ),
        n = t[0],
        r = t[t.length - 1];
      (n && n.focus(),
        e.addEventListener("keydown", e => {
          "Tab" === e.key &&
            (e.shiftKey
              ? document.activeElement === n && (r.focus(), e.preventDefault())
              : document.activeElement === r &&
                (n.focus(), e.preventDefault()));
        }));
    }
    (yn.appendChild(Sn),
      Sn.addEventListener("click", e => {
        (e.stopPropagation(),
          Sn.setAttribute("aria-expanded", String(wn.hidden)),
          Cn(),
          wn.querySelector("li:first-child button").focus());
      }),
      document.documentElement.addEventListener("click", () => {
        wn.hidden || Cn();
      }),
      yn.appendChild(wn),
      wn.addEventListener("keydown", e => {
        "Escape" !== e.key ||
          wn.hidden ||
          (Sn.setAttribute("aria-expanded", String(wn.hidden)),
          Cn(),
          Sn.focus());
      }));
    const An = new Map([
      ["controls", "respec-menu"],
      ["expanded", "false"],
      ["haspopup", "true"],
      ["label", "ReSpec Menu"],
    ]);
    function Rn(e, t, n, r) {
      (t.push(e),
        En.hasOwnProperty(n) ||
          ((En[n] = (function (e, t, n) {
            const r = `respec-pill-${e}`,
              o = lt`<button
    id="${r}"
    class="respec-info-button"
  ></button>`;
            o.addEventListener("click", () => {
              o.setAttribute("aria-expanded", "true");
              const r = lt`<ol class="${`respec-${e}-list`}"></ol>`;
              for (const e of t) {
                const t = document
                    .createRange()
                    .createContextualFragment(Pn(e)),
                  n = document.createElement("li");
                (t.firstElementChild === t.lastElementChild
                  ? n.append(...t.firstElementChild.childNodes)
                  : n.appendChild(t),
                  r.appendChild(n));
              }
              Tn.freshModal(n, r, o);
            });
            const i = new Map([
              ["expanded", "false"],
              ["haspopup", "true"],
              ["controls", `respec-pill-${e}-modal`],
            ]);
            return (bn(o, i), o);
          })(n, t, r)),
          yn.appendChild(En[n])));
      const o = En[n];
      o.textContent = t.length;
      const i = 1 === t.length ? pt.singular(r) : r;
      bn(o, new Map([["label", `${t.length} ${i}`]]));
    }
    bn(Sn, An);
    const Tn = {
      show() {
        try {
          yn.hidden = !1;
        } catch (e) {
          console.error(e);
        }
      },
      hide() {
        yn.hidden = !0;
      },
      enable() {
        Sn.removeAttribute("disabled");
      },
      addCommand(e, t, n, r) {
        r = r || "";
        const o = `respec-button-${e.toLowerCase().replace(/\s+/, "-")}`,
          i = lt`<button id="${o}" class="respec-option">
      <span class="respec-cmd-icon" aria-hidden="true">${r}</span> ${e}…
    </button>`,
          s = lt`<li role="menuitem">${i}</li>`;
        return (s.addEventListener("click", t), wn.appendChild(s), i);
      },
      error(e) {
        Rn(e, $n, "error", "ReSpec Errors");
      },
      warning(e) {
        Rn(e, _n, "warning", "ReSpec Warnings");
      },
      closeModal(e) {
        (xn &&
          (xn.classList.remove("respec-show-overlay"),
          xn.classList.add("respec-hide-overlay"),
          xn.addEventListener("transitionend", () => {
            (xn.remove(), (xn = null));
          })),
          e && e.setAttribute("aria-expanded", "false"),
          kn && (kn.remove(), (kn = null), Sn.focus()));
      },
      freshModal(e, t, n) {
        (kn && kn.remove(),
          xn && xn.remove(),
          (xn = lt`<div id="respec-overlay" class="removeOnSave"></div>`));
        const r = `${n.id}-modal`,
          o = `${r}-heading`;
        kn = lt`<div
      id="${r}"
      class="respec-modal removeOnSave"
      role="dialog"
      aria-labelledby="${o}"
    >
      ${vn}
      <h3 id="${o}">${e}</h3>
      <div class="inside">${t}</div>
    </div>`;
        const i = new Map([["labelledby", o]]);
        (bn(kn, i),
          document.body.append(xn, kn),
          xn.addEventListener("click", () => this.closeModal(n)),
          xn.classList.toggle("respec-show-overlay"),
          (kn.hidden = !1),
          Ln(kn));
      },
    };
    function Pn(e) {
      if ("string" == typeof e) return e;
      const t = e.plugin
          ? `<p class="respec-plugin">(plugin: "${e.plugin}")</p>`
          : "",
        n = e.hint
          ? `\n${pn(`<p class="respec-hint"><strong>How to fix:</strong> ${Zt(e.hint)}`, { inline: !e.hint.includes("\n") })}\n`
          : "",
        r = Array.isArray(e.elements)
          ? `<p class="respec-occurrences">Occurred <strong>${e.elements.length}</strong> times at:</p>\n    ${pn(e.elements.map(jn).join("\n"))}`
          : "",
        o = e.details ? `\n\n<details>\n${e.details}\n</details>\n` : "";
      var i;
      return `${pn(`**${((i = e.message), i.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/</g, "&lt;"))}**`, { inline: !0 })}${n}${r}${o}${t}`;
    }
    function jn(e) {
      return `* [\`<${e.localName}>\`](#${e.id}) element`;
    }
    async function Nn(e) {
      try {
        (Tn.show(),
          await (async function () {
            "loading" === document.readyState &&
              (await new Promise(e =>
                document.addEventListener("DOMContentLoaded", e)
              ));
          })(),
          await sn(e));
      } finally {
        Tn.enable();
      }
    }
    (document.addEventListener("keydown", e => {
      "Escape" === e.key && Tn.closeModal();
    }),
      (window.respecUI = Tn),
      Yt("error", e => Tn.error(e)),
      Yt("warn", e => Tn.warning(e)),
      window.addEventListener("error", e => {
        console.error(e.error, e.message, e);
      }));
    const zn = [
      Promise.resolve().then(function () {
        return On;
      }),
      Promise.resolve().then(function () {
        return s;
      }),
      Promise.resolve().then(function () {
        return Mn;
      }),
      Promise.resolve().then(function () {
        return Fn;
      }),
      Promise.resolve().then(function () {
        return Vn;
      }),
      Promise.resolve().then(function () {
        return er;
      }),
      Promise.resolve().then(function () {
        return gn;
      }),
      Promise.resolve().then(function () {
        return tr;
      }),
      Promise.resolve().then(function () {
        return or;
      }),
      Promise.resolve().then(function () {
        return kr;
      }),
      Promise.resolve().then(function () {
        return _r;
      }),
      Promise.resolve().then(function () {
        return Er;
      }),
      Promise.resolve().then(function () {
        return Lr;
      }),
      Promise.resolve().then(function () {
        return Io;
      }),
      Promise.resolve().then(function () {
        return Bo;
      }),
      Promise.resolve().then(function () {
        return Qo;
      }),
      Promise.resolve().then(function () {
        return Jo;
      }),
      Promise.resolve().then(function () {
        return ri;
      }),
      Promise.resolve().then(function () {
        return li;
      }),
      Promise.resolve().then(function () {
        return hi;
      }),
      Promise.resolve().then(function () {
        return gi;
      }),
      Promise.resolve().then(function () {
        return oo;
      }),
      Promise.resolve().then(function () {
        return Oi;
      }),
      Promise.resolve().then(function () {
        return Si;
      }),
      Promise.resolve().then(function () {
        return go;
      }),
      Promise.resolve().then(function () {
        return Ii;
      }),
      Promise.resolve().then(function () {
        return Yn;
      }),
      Promise.resolve().then(function () {
        return qi;
      }),
      Promise.resolve().then(function () {
        return Zi;
      }),
      Promise.resolve().then(function () {
        return Ki;
      }),
      Promise.resolve().then(function () {
        return Xi;
      }),
      Promise.resolve().then(function () {
        return ns;
      }),
      Promise.resolve().then(function () {
        return ls;
      }),
      Promise.resolve().then(function () {
        return cs;
      }),
      Promise.resolve().then(function () {
        return ws;
      }),
      Promise.resolve().then(function () {
        return _s;
      }),
      Promise.resolve().then(function () {
        return Ss;
      }),
      Promise.resolve().then(function () {
        return Ls;
      }),
      Promise.resolve().then(function () {
        return Rs;
      }),
      Promise.resolve().then(function () {
        return Is;
      }),
      Promise.resolve().then(function () {
        return Hs;
      }),
      Promise.resolve().then(function () {
        return Zs;
      }),
      Promise.resolve().then(function () {
        return Gs;
      }),
      Promise.resolve().then(function () {
        return Xs;
      }),
      Promise.resolve().then(function () {
        return na;
      }),
      Promise.resolve().then(function () {
        return sa;
      }),
      Promise.resolve().then(function () {
        return ca;
      }),
      Promise.resolve().then(function () {
        return pa;
      }),
      Promise.resolve().then(function () {
        return ma;
      }),
      Promise.resolve().then(function () {
        return ya;
      }),
    ];
    Promise.all(zn)
      .then(e => Nn(e))
      .catch(e => console.error(e));
    var On = Object.freeze({
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
    const Dn = {
        lint: {
          "no-headingless-sections": !0,
          "no-http-props": !0,
          "no-unused-vars": !1,
          "check-punctuation": !1,
          "local-refs-exist": !0,
          "check-internal-slots": !1,
          "check-charset": !1,
          "privsec-section": !1,
        },
        pluralize: !0,
        specStatus: "base",
        highlightVars: !0,
        addSectionLinks: !0,
      },
      In = new Map([
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
          "cc-by-sa",
          {
            name: "Creative Commons Attribution-ShareAlike 4.0 International Public License",
            short: "CC-BY-SA",
            url: "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
          },
        ],
      ]),
      qn = {
        format: "markdown",
        isED: !1,
        isNoTrack: !0,
        isPR: !1,
        lint: { "privsec-section": !0, "wpt-tests-exist": !1 },
        logos: [],
        prependW3C: !1,
        doJsonLd: !1,
        license: "cc-by",
        shortName: "X",
        showPreviousVersion: !1,
      };
    var Mn = Object.freeze({
      __proto__: null,
      name: "dini/defaults",
      run: function (e) {
        const t = !1 !== e.lint && { ...Dn.lint, ...qn.lint, ...e.lint };
        (Object.assign(e, { ...Dn, ...qn, ...e, lint: t }),
          Object.assign(
            e,
            (function (e) {
              return { licenseInfo: In.get(e.license) };
            })(e)
          ));
      },
    });
    var Hn = String.raw`@keyframes pop{
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
:is(h2,h3,h4,h5,h6):not(#toc>h2,#abstract>h2,#sotd>h2,.head>h2){position:relative;left:-.5em}
:is(h2,h3,h4,h5,h6):not(#toch2)+a.self-link{color:inherit;order:-1;position:relative;left:-1.1em;font-size:1rem;opacity:.5}
:is(h2,h3,h4,h5,h6)+a.self-link::before{content:"§";text-decoration:none;color:var(--heading-text)}
:is(h2,h3)+a.self-link{top:-.2em}
:is(h4,h5,h6)+a.self-link::before{color:#000}
@media (max-width:767px){
dd{margin-left:0}
}
@media print{
.removeOnSave{display:none}
}`;
    const Bn = (function () {
      const e = document.createElement("style");
      return (
        (e.id = "respec-mainstyle"),
        (e.textContent = Hn),
        document.head.appendChild(e),
        e
      );
    })();
    var Fn = Object.freeze({
      __proto__: null,
      name: "core/style",
      run: function (e) {
        e.noReSpecCSS && Bn.remove();
      },
    });
    const Wn = "dini/style";
    const Un = (function () {
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
      for (const n of e.map(yt)) t.appendChild(n);
      return t;
    })();
    (Un.appendChild(
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
        Un.prepend(
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
      document.head.prepend(Un));
    var Vn = Object.freeze({
      __proto__: null,
      name: Wn,
      run: function (e) {
        if (!e.specStatus) {
          const t = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
          ((e.specStatus = "base"), Bt(t, Wn));
        }
        let t = "";
        switch (e.specStatus.toUpperCase()) {
          case "UNOFFICIAL":
            t = "W3C-UD";
            break;
          case "BASE":
            t = "base.css";
        }
        e.noToc ||
          Yt(
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
          Yt(
            "beforesave",
            ((r = n),
            e => {
              const t = e.querySelector(`head link[href="${r}"]`);
              e.querySelector("head").append(t);
            })
          ));
      },
    });
    class Zn {
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
        Zn.sectionClasses.intersection(new Set(e.classList)).forEach(e => {
          t.classList.add(e);
        });
      }
      addSection(e) {
        const t = this.findHeader(e),
          n = t ? this.findPosition(t) : 1,
          r = this.findParent(n);
        (t && e.removeChild(t),
          e.appendChild(Gn(e)),
          t && e.prepend(t),
          r.appendChild(e),
          (this.current = r));
      }
      addElement(e) {
        this.current.appendChild(e);
      }
    }
    function Gn(e) {
      const t = new Zn(e.ownerDocument);
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
    function Kn(e) {
      const t = Gn(e);
      if (
        "section" === t.firstElementChild.localName &&
        "section" === e.localName
      ) {
        const n = t.firstElementChild;
        (n.remove(), e.append(...n.childNodes));
      } else e.textContent = "";
      e.appendChild(t);
    }
    var Yn = Object.freeze({
      __proto__: null,
      name: "core/sections",
      restructure: Kn,
      run: function () {
        Kn(document.body);
      },
    });
    const Xn = "core/data-include";
    function Qn(e, t, n) {
      const r = document.querySelector(`[data-include-id=${t}]`),
        o = St(e, r.dataset.oninclude, n),
        i = "string" == typeof r.dataset.includeReplace;
      (!(function (e, t, { replace: n }) {
        const { includeFormat: r } = e.dataset;
        let o = t;
        ("markdown" === r && (o = pn(o)),
          "text" === r ? (e.textContent = o) : (e.innerHTML = o),
          "markdown" === r && Kn(e),
          n && e.replaceWith(...e.childNodes));
      })(r, o, { replace: i }),
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
    async function Jn(e, t) {
      const n = e.querySelectorAll("[data-include]"),
        r = Array.from(n).map(async e => {
          const n = e.dataset.include;
          if (!n) return;
          const r = `include-${String(Math.random()).slice(2)}`;
          e.dataset.includeId = r;
          try {
            const o = await fetch(n);
            (Qn(await o.text(), r, n), t < 3 && (await Jn(e, t + 1)));
          } catch (t) {
            Ht(`\`data-include\` failed: \`${n}\` (${t.message}).`, Xn, {
              elements: [e],
              cause: t,
            });
          }
        });
      await Promise.all(r);
    }
    var er = Object.freeze({
      __proto__: null,
      name: Xn,
      run: async function () {
        await Jn(document, 1);
      },
    });
    var tr = Object.freeze({
      __proto__: null,
      name: "core/reindent",
      run: function () {
        for (const e of document.getElementsByTagName("pre"))
          e.innerHTML = Zt(e.innerHTML);
      },
    });
    const nr = "core/title",
      rr = Et({
        en: { default_title: "No Title" },
        de: { default_title: "Kein Titel" },
        zh: { default_title: "无标题" },
        cs: { default_title: "Bez názvu" },
      });
    var or = Object.freeze({
      __proto__: null,
      name: nr,
      run: function (e) {
        const t =
          document.querySelector("h1#title") || lt`<h1 id="title"></h1>`;
        if (t.isConnected && "" === t.textContent.trim()) {
          Ht(
            'The document is missing a title, so using a default title. To fix this, please give your document a `<title>`. If you need special markup in the document\'s title, please use a `<h1 id="title">`.',
            nr,
            { title: "Document is missing a title", elements: [t] }
          );
        }
        (t.id || (t.id = "title"),
          t.classList.add("title"),
          (function (e, t) {
            t.isConnected ||
              (t.textContent = document.title || `${rr.default_title}`);
            const n = document.createElement("h1");
            n.innerHTML = t.innerHTML
              .replace(/:<br>/g, ": ")
              .replace(/<br>/g, " - ");
            let r = _t(n.textContent);
            if (e.isPreview && e.prNumber) {
              const n = e.prUrl || `${e.github.repoURL}pull/${e.prNumber}`,
                { childNodes: o } = lt`
      Preview of PR <a href="${n}">#${e.prNumber}</a>:
    `;
              (t.prepend(...o), (r = `Preview of PR #${e.prNumber}: ${r}`));
            }
            ((document.title = r), (e.title = r));
          })(e, t),
          document.body.prepend(t));
      },
    });
    function ir(e) {
      if (!e.key) {
        const t =
          "Found a link without `key` attribute in the configuration. See dev console.";
        return (Bt(t, "core/templates/show-link"), void console.warn(t, e));
      }
      return lt`
    <dt class="${e.class ? e.class : null}">${e.key}</dt>
    ${e.data ? e.data.map(sr) : sr(e)}
  `;
    }
    function sr(e) {
      return lt`<dd class="${e.class ? e.class : null}">
    ${e.href ? lt`<a href="${e.href}">${e.value || e.href}</a>` : e.value}
  </dd>`;
    }
    const ar = "core/templates/show-logo";
    function lr(e, t) {
      const n = lt`<a href="${e.url || null}" class="logo"
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
        const r = Vt`Add the missing "\`alt\`" property describing the logo. See ${"[logos]"} for more information.`;
        Ht(
          `Logo at index ${t}${e.src ? `, with \`src\` ${e.src}, ` : ""} is missing required "\`alt\`" property.`,
          ar,
          { hint: r, elements: [n] }
        );
      }
      if (!e.src) {
        const e = Vt`The \`src\` property is required on every logo. See ${"[logos]"} for more information.`;
        Ht(`Logo at index ${t} is missing "\`src\`" property.`, ar, {
          hint: e,
          elements: [n],
        });
      }
      return n;
    }
    const cr = "core/templates/show-people",
      ur = Et({
        en: { until: e => lt` Until ${e} ` },
        es: { until: e => lt` Hasta ${e} ` },
        ko: { until: e => lt` ${e} 이전 ` },
        ja: { until: e => lt` ${e} 以前 ` },
        de: { until: e => lt` bis ${e} ` },
        zh: { until: e => lt` 直到 ${e} ` },
      }),
      dr = () => lt`<svg
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
    function pr(e, t) {
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
              Ht(`${i} Missing required property \`"name"\`.`, cr, { hint: r }),
              !1
            );
          if (e.orcid) {
            const { orcid: n } = e,
              r = new URL(n, "https://orcid.org/");
            if ("https://orcid.org" !== r.origin) {
              const n = `${i} ORCID "${e.orcid}" at index ${t} is invalid.`,
                o = `The origin should be "https://orcid.org", not "${r.origin}".`;
              return (Ht(n, cr, { hint: o }), !1);
            }
            const o = r.pathname.slice(1).replace(/\/$/, "");
            if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(o))
              return (
                Ht(`${i} ORCID "${o}" has wrong format.`, cr, {
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
                Ht(`${i} ORCID "${n}" failed checksum check.`, cr, {
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
            ? (Ht(
                `${i} The property "\`retiredDate\`" is not a valid date.`,
                cr,
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
                              Ht(
                                `${n}. Member "extra" at index ${r} is not an object.`,
                                cr,
                                { hint: t }
                              ),
                              !1
                            );
                          case !e.hasOwnProperty("name"):
                            return (
                              Ht(
                                `${n} \`PersonExtra\` object at index ${r} is missing required "name" member.`,
                                cr,
                                { hint: t }
                              ),
                              !1
                            );
                          case "string" == typeof e.name &&
                            "" === e.name.trim():
                            return (
                              Ht(
                                `${n} \`PersonExtra\` object at index ${r} "name" can't be empty.`,
                                cr,
                                { hint: t }
                              ),
                              !1
                            );
                        }
                        return !0;
                      })
                    : (Ht(
                        `${n}. A person's "extras" member must be an array.`,
                        cr,
                        { hint: t }
                      ),
                      !1);
                })(e.extras, r, i)
              ) &&
                (e.url &&
                  e.mailto &&
                  Bt(`${i} Has both "url" and "mailto" property.`, cr, {
                    hint: `Please choose either "url" or "mailto" ("url" is preferred). ${r}`,
                  }),
                e.companyURL &&
                  !e.company &&
                  Bt(
                    `${i} Has a "\`companyURL\`" property but no "\`company\`" property.`,
                    cr,
                    { hint: `Please add a "\`company\`" property. ${r}.` }
                  ),
                !0);
          var s;
        });
      var o;
      return n.filter(r).map(hr);
    }
    function hr(e) {
      const t = [e.name],
        n = [e.company],
        r = e.w3cid || null,
        o = [];
      if ((e.mailto && (e.url = `mailto:${e.mailto}`), e.url)) {
        const n =
          "mailto:" === new URL(e.url, document.location.href).protocol
            ? "ed_mailto u-email email p-name"
            : "u-url url p-name fn";
        o.push(lt`<a class="${n}" href="${e.url}">${t}</a>`);
      } else o.push(lt`<span class="p-name fn">${t}</span>`);
      if (
        (e.orcid &&
          o.push(lt`<a class="p-name orcid" href="${e.orcid}">${dr()}</a>`),
        e.company)
      ) {
        const t = "p-org org h-org",
          r = e.companyURL
            ? lt`<a class="${t}" href="${e.companyURL}">${n}</a>`
            : lt`<span class="${t}">${n}</span>`;
        o.push(lt` (${r})`);
      }
      (e.note && o.push(document.createTextNode(` (${e.note})`)),
        e.extras &&
          o.push(
            ...e.extras.map(
              e =>
                lt`, ${(function (e) {
                  const t = e.class || null,
                    { name: n, href: r } = e;
                  return r
                    ? lt`<a href="${r}" class="${t}">${n}</a>`
                    : lt`<span class="${t}">${n}</span>`;
                })(e)}`
            )
          ));
      const { retiredDate: i } = e;
      if (e.retiredDate) {
        const e = lt`<time datetime="${i}"
      >${gt.format(new Date(i))}</time
    >`;
        o.push(lt` - ${ur.until(e)} `);
      }
      return lt`<dd
    class="editor p-author h-card vcard"
    data-editor-id="${r}"
  >
    ${o}
  </dd>`;
    }
    const fr = "dini/templates/headers",
      mr = "https://creativecommons.org/licenses/by/4.0/legalcode",
      gr = Et({
        en: {
          author: "Author:",
          authors: "Authors:",
          editor: "Editor:",
          editors: "Editors:",
          former_editor: "Former editor:",
          former_editors: "Former editors:",
          latest_editors_draft: "Latest editor's draft:",
          latest_published_version: "Latest published version:",
          this_version: "This version:",
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
          editor: "编辑：",
          editors: "编辑：",
          former_editor: "原编辑：",
          former_editors: "原编辑：",
          latest_editors_draft: "最新编辑草稿：",
          latest_published_version: "最新发布版本：",
          this_version: "本版本：",
        },
        ja: {
          author: "著者：",
          authors: "著者：",
          editor: "編者：",
          editors: "編者：",
          former_editor: "以前の版の編者：",
          former_editors: "以前の版の編者：",
          latest_editors_draft: "最新の編集用草案：",
          latest_published_version: "最新バージョン：",
          this_version: "このバージョン：",
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
          author: "Autor:",
          authors: "Autores:",
          editor: "Editor:",
          editors: "Editores:",
          latest_editors_draft: "Borrador de editor mas reciente:",
          latest_published_version: "Versión publicada mas reciente:",
          this_version: "Ésta versión:",
        },
        de: {
          author: "Autor/in:",
          authors: "Autor/innen:",
          editor: "Redaktion:",
          editors: "Redaktion:",
          former_editor: "Frühere Mitwirkende:",
          former_editors: "Frühere Mitwirkende:",
          latest_editors_draft: "Letzter Entwurf:",
          latest_published_version: "Letzte publizierte Fassung:",
          this_version: "Diese Fassung:",
        },
      });
    var br = e => lt`<div class="head">
    ${e.logos.map(lr)} ${document.querySelector("h1#title")}
    ${(function (e) {
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
      ${e.textStatus}
      <time class="dt-published" datetime="${e.dashDate}"
        >${e.publishHumanDate}</time
      >
    </h2>
    <dl>
      <dt>${e.multipleEditors ? gr.editors : gr.editor}</dt>
      ${pr(e, "editors")}
      ${
        Array.isArray(e.formerEditors) && e.formerEditors.length > 0
          ? lt`
            <dt>
              ${e.multipleFormerEditors ? gr.former_editors : gr.former_editor}
            </dt>
            ${pr(e, "formerEditors")}
          `
          : ""
      }
      ${
        e.authors
          ? lt`
            <dt>${e.multipleAuthors ? gr.authors : gr.author}</dt>
            ${pr(e, "authors")}
          `
          : ""
      }
      ${e.otherLinks ? e.otherLinks.map(ir) : ""}
    </dl>
    ${(function (e) {
      const t = document.querySelector(".copyright");
      if (t) return (t.remove(), t);
      if (e.hasOwnProperty("overrideCopyright")) {
        Bt("The `overrideCopyright` configuration option is deprecated.", fr, {
          hint: 'Please use `<p class="copyright">` instead.',
        });
      }
      return e.overrideCopyright
        ? [e.overrideCopyright]
        : lt`<p class="copyright">
        Dieses Dokument ist lizensiert unter
        ${((n = "Creative Commons Attribution 4.0 International Public License"), (r = mr), (o = "subfoot"), lt`<a rel="license" href="${r}" class="${o}">${n}</a>`)}.
      </p>`;
      var n, r, o;
    })(e)}
    <hr />
  </div>`;
    const yr = "dini/headers",
      wr = new Intl.DateTimeFormat(["de-DE"], {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "2-digit",
      }),
      vr = { unofficial: "Entwurf vom", base: "Spezifikation vom" };
    var kr = Object.freeze({
      __proto__: null,
      name: yr,
      run: function (e) {
        if (
          ((e.isUnofficial = "unofficial" === e.specStatus),
          (e.isBasic = "base" === e.specStatus),
          !e.specStatus)
        ) {
          Ht("Missing required configuration: `specStatus`", yr);
        }
        ((e.title = document.title || "Kein Titel"),
          e.subtitle || (e.subtitle = ""),
          (e.publishDate = (function (e, t, n = new Date()) {
            const r = e[t] ? new Date(e[t]) : new Date(n);
            if (Number.isFinite(r.valueOf())) {
              const e = ft.format(r);
              return new Date(e);
            }
            return (
              Ht(
                `[\`${t}\`](https://github.com/speced/respec/wiki/${t}) is not a valid date: "${e[t]}". Expected format 'YYYY-MM-DD'.`,
                yr
              ),
              new Date(ft.format(new Date()))
            );
          })(e, "publishDate", document.lastModified)),
          (e.publishYear = e.publishDate.getUTCFullYear()),
          (e.publishHumanDate = wr.format(e.publishDate)));
        const t = function (e) {
          if (!e.name) {
            Ht("All authors and editors must have a name.", yr);
          }
          if (e.orcid)
            try {
              e.orcid = (function (e) {
                const t = new URL(e, "https://orcid.org/");
                if ("https://orcid.org" !== t.origin)
                  throw new Error(
                    `The origin should be "https://orcid.org", not "${t.origin}".`
                  );
                const n = t.pathname.slice(1).replace(/\/$/, "");
                if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(n))
                  throw new Error(
                    `ORCIDs have the format "1234-1234-1234-1234", not "${n}"`
                  );
                const r = n[n.length - 1],
                  o =
                    (12 -
                      (n
                        .split("")
                        .slice(0, -1)
                        .filter(e => /\d/.test(e))
                        .map(Number)
                        .reduce((e, t) => 2 * (e + t), 0) %
                        11)) %
                    11,
                  i = 10 === o ? "X" : String(o);
                if (r !== i) throw new Error(`"${n}" has an invalid checksum.`);
                return t.href;
              })(e.orcid);
            } catch (t) {
              (Ht(`"${e.orcid}" is not an ORCID. ${t.message}`, yr),
                delete e.orcid);
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
          Ht("At least one editor is required", yr);
        }
        (e.formerEditors.length && e.formerEditors.forEach(t),
          e.authors && e.authors.forEach(t),
          (e.multipleEditors = e.editors && e.editors.length > 1),
          (e.multipleFormerEditors = e.formerEditors.length > 1),
          (e.multipleAuthors = e.authors && e.authors.length > 1),
          (e.alternateFormats || []).forEach(e => {
            if (!e.uri || !e.label) {
              Ht("All alternate formats must have a uri and a label.", yr);
            }
          }),
          e.copyrightStart &&
            e.copyrightStart == e.publishYear &&
            (e.copyrightStart = ""),
          (e.textStatus = vr[e.specStatus]),
          (e.dashDate = ft.format(e.publishDate)),
          (e.publishISODate = e.publishDate.toISOString()));
        const n = br(e);
        (document.body.prepend(n),
          document.body.classList.add("h-entry"),
          Kt("amend-user-config", {
            publishISODate: e.publishISODate,
            generatedSubtitle: `${e.longStatus} ${e.publishHumanDate}`,
          }));
      },
    });
    const xr = "dini/abstract",
      $r = Et({
        en: { abstract: "Abstract" },
        ko: { abstract: "요약" },
        zh: { abstract: "摘要" },
        ja: { abstract: "要約" },
        nl: { abstract: "Samenvatting" },
        es: { abstract: "Resumen" },
        de: { abstract: "Zusammenfassung" },
      });
    var _r = Object.freeze({
      __proto__: null,
      name: xr,
      run: async function () {
        const e = document.getElementById("abstract");
        if (!e) {
          return void Ht(
            'Document must have one element with `id="abstract"',
            xr
          );
        }
        e.classList.add("introductory");
        let t = document.querySelector("#abstract>h2");
        t ||
          ((t = document.createElement("h2")),
          (t.textContent = $r.abstract),
          e.prepend(t));
      },
    });
    var Er = Object.freeze({
      __proto__: null,
      name: "core/data-transform",
      run: function () {
        document.querySelectorAll("[data-transform]").forEach(e => {
          ((e.innerHTML = St(e.innerHTML, e.dataset.transform)),
            e.removeAttribute("data-transform"));
        });
      },
    });
    const Sr = "core/dfn-abbr";
    function Cr(e) {
      const t = (n = e).dataset.abbr
        ? n.dataset.abbr
        : n.textContent
            .match(/\b([a-z])/gi)
            .join("")
            .toUpperCase();
      var n;
      const r = e.textContent.replace(/\s\s+/g, " ").trim();
      e.insertAdjacentHTML("afterend", ` (<abbr title="${r}">${t}</abbr>)`);
      const o = e.dataset.lt || "";
      e.dataset.lt = o
        .split("|")
        .filter(e => e.trim())
        .concat(t)
        .join("|");
    }
    var Lr = Object.freeze({
      __proto__: null,
      name: Sr,
      run: function () {
        const e = document.querySelectorAll("[data-abbr]");
        for (const t of e) {
          const { localName: e } = t;
          if ("dfn" === e) Cr(t);
          else {
            Ht(
              `\`data-abbr\` attribute not supported on \`${e}\` elements.`,
              Sr,
              { elements: [t], title: "Error: unsupported." }
            );
          }
        }
      },
    });
    const Ar = /^[a-z]+(\s+[a-z]+)+\??$/,
      Rr = /\B"([^"]*)"\B/,
      Tr = /^(\w+)\(([^\\)]*)\)(?:\|(\w+)(?:\((?:([^\\)]*))\))?)?$/,
      Pr = /\[\[(\w+(?: +\w+)*)\]\](\([^)]*\))?$/,
      jr = /^((?:\[\[)?(?:\w+(?: +\w+)*)(?:\]\])?)$/,
      Nr = /^(?:\w+)\??$/,
      zr = /^(\w+)\["([\w- ]*)"\]$/,
      Or = /\.?(\w+\(.*\)$)/,
      Dr = /\/(.+)/,
      Ir = /\[\[.+\]\]/;
    function qr(e) {
      const { identifier: t, renderParent: n, nullable: r } = e;
      if (n)
        return lt`<a
      data-xref-type="_IDL_"
      data-link-type="idl"
      data-lt="${t}"
      ><code>${t + (r ? "?" : "")}</code></a
    >`;
    }
    function Mr(e) {
      const {
          identifier: t,
          parent: n,
          slotType: r,
          renderParent: o,
          args: i,
        } = e,
        { identifier: s } = n || {},
        a = "method" === r,
        l = a ? lt`(${Ct(i, Hr)})` : null,
        c = a ? `(${i.join(", ")})` : "";
      return lt`${n && o ? "." : ""}<a
      data-xref-type="${r}"
      data-link-type="${r}"
      data-link-for="${s}"
      data-xref-for="${s}"
      data-lt="${`[[${t}]]${c}`}"
      ><code>[[${t}]]${l}</code></a
    >`;
    }
    function Hr(e, t, n) {
      if (t < n.length - 1) return lt`<var>${e}</var>`;
      const r = e.split(/(^\.{3})(.+)/),
        o = r.length > 1,
        i = o ? r[2] : r[0];
      return lt`${o ? "..." : null}<var>${i}</var>`;
    }
    function Br(e) {
      const { parent: t, identifier: n, renderParent: r } = e,
        { identifier: o } = t || {};
      return lt`${r ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="attribute|dict-member|const"
      data-link-for="${o}"
      data-xref-for="${o}"
      ><code>${n}</code></a
    >`;
    }
    function Fr(e) {
      const { args: t, identifier: n, type: r, parent: o, renderParent: i } = e,
        { renderText: s, renderArgs: a } = e,
        { identifier: l } = o || {},
        c = Ct(a || t, Hr),
        u = `${n}(${t.join(", ")})`;
      return lt`${o && i ? "." : ""}<a
      data-link-type="idl"
      data-xref-type="${r}"
      data-link-for="${l}"
      data-xref-for="${l}"
      data-lt="${u}"
      ><code>${s || n}</code></a
    >${!s || a ? lt`<code>(${c})</code>` : ""}`;
    }
    function Wr(e) {
      const { identifier: t, enumValue: n, parent: r } = e,
        o = r ? r.identifier : t;
      return lt`"<a
      data-link-type="idl"
      data-xref-type="enum-value"
      data-link-for="${o}"
      data-xref-for="${o}"
      data-lt="${n ? null : "the-empty-string"}"
      ><code>${n}</code></a
    >"`;
    }
    function Ur(e) {
      const { identifier: t } = e;
      return lt`"<a
      data-link-type="idl"
      data-cite="webidl"
      data-xref-type="exception"
      ><code>${t}</code></a
    >"`;
    }
    function Vr(e) {
      const { identifier: t, nullable: n } = e;
      return lt`<a
    data-link-type="idl"
    data-cite="webidl"
    data-xref-type="interface"
    data-lt="${t}"
    ><code>${t + (n ? "?" : "")}</code></a
  >`;
    }
    function Zr(e) {
      let t;
      try {
        t = (function (e) {
          const t = Ir.test(e),
            n = t ? Dr : Or,
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
            const t = i.pop();
            if (Tr.test(t)) {
              const [, e, n, r, o] = t.match(Tr),
                i = n.split(/,\s*/).filter(e => e),
                l = r?.trim(),
                c = o?.split(/,\s*/).filter(e => e);
              a.push({
                type: "method",
                identifier: e,
                args: i,
                renderParent: s,
                renderText: l,
                renderArgs: c,
              });
            } else if (zr.test(t)) {
              const [, e, n] = t.match(zr);
              a.push({
                type: "enum",
                identifier: e,
                enumValue: n,
                renderParent: s,
              });
            } else if (Rr.test(t)) {
              const [, e] = t.match(Rr);
              s
                ? a.push({ type: "exception", identifier: e })
                : a.push({ type: "enum", enumValue: e, renderParent: s });
            } else if (Pr.test(t)) {
              const [, e, n] = t.match(Pr),
                r = n ? "method" : "attribute",
                o = n
                  ?.slice(1, -1)
                  .split(/,\s*/)
                  .filter(e => e);
              a.push({
                type: "internal-slot",
                slotType: r,
                identifier: e,
                args: o,
                renderParent: s,
              });
            } else if (jr.test(t) && i.length) {
              const [, e] = t.match(jr);
              a.push({ type: "attribute", identifier: e, renderParent: s });
            } else if (Ar.test(t)) {
              const e = t.endsWith("?"),
                n = e ? t.slice(0, -1) : t;
              a.push({
                type: "idl-primitive",
                identifier: n,
                renderParent: s,
                nullable: e,
              });
            } else {
              if (!Nr.test(t) || 0 !== i.length)
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
        const n = lt`<span>{{ ${e} }}</span>`,
          r = "Error: Invalid inline IDL string.";
        return (Ht(t.message, "core/inlines", { title: r, elements: [n] }), n);
      }
      const n = lt(document.createDocumentFragment()),
        r = [];
      for (const e of t)
        switch (e.type) {
          case "base": {
            const t = qr(e);
            t && r.push(t);
            break;
          }
          case "attribute":
            r.push(Br(e));
            break;
          case "internal-slot":
            r.push(Mr(e));
            break;
          case "method":
            r.push(Fr(e));
            break;
          case "enum":
            r.push(Wr(e));
            break;
          case "exception":
            r.push(Ur(e));
            break;
          case "idl-primitive":
            r.push(Vr(e));
            break;
          default:
            throw new Error("Unknown type.");
        }
      return n`${r}`;
    }
    const Gr = new Set(["alias", "reference"]),
      Kr = (async function () {
        const e = await ct.openDB("respec-biblio2", 12, {
            upgrade(e) {
              Array.from(e.objectStoreNames).map(t => e.deleteObjectStore(t));
              (e
                .createObjectStore("alias", { keyPath: "id" })
                .createIndex("aliasOf", "aliasOf", { unique: !1 }),
                e.createObjectStore("reference", { keyPath: "id" }));
            },
          }),
          t = Date.now();
        for (const n of [...Gr]) {
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
    const Yr = {
        get ready() {
          return Kr;
        },
        async find(e) {
          return (
            (await this.isAlias(e)) && (e = await this.resolveAlias(e)),
            await this.get("reference", e)
          );
        },
        async has(e, t) {
          if (!Gr.has(e)) throw new TypeError(`Invalid type: ${e}`);
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
          if (!Gr.has(e)) throw new TypeError(`Invalid type: ${e}`);
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
          const r = [...Gr].flatMap(e => n[e].map(t => this.add(e, t)));
          await Promise.all(r);
        },
        async add(e, t) {
          if (!Gr.has(e)) throw new TypeError(`Invalid type: ${e}`);
          if ("object" != typeof t)
            throw new TypeError("details should be an object");
          if ("alias" === e && !t.hasOwnProperty("aliasOf"))
            throw new TypeError("Invalid alias object.");
          const n = await this.ready;
          let r = await this.has(e, t.id);
          if (r) {
            const o = await this.get(e, t.id);
            if (o?.expires < Date.now()) {
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
            t = [...Gr],
            n = e.transaction(t, "readwrite"),
            r = t.map(e => n.objectStore(e).clear());
          await Promise.all(r);
        },
      },
      Xr = {},
      Qr = new URL("https://api.specref.org/bibrefs?refs="),
      Jr = yt({ hint: "dns-prefetch", href: Qr.origin });
    let eo;
    document.head.appendChild(Jr);
    const to = new Promise(e => {
      eo = e;
    });
    async function no(e, t = { forceUpdate: !1 }) {
      const n = [...new Set(e)].filter(e => e.trim());
      if (!n.length || !1 === navigator.onLine) return null;
      let r;
      try {
        r = await fetch(Qr.href + n.join(","));
      } catch (e) {
        return (console.error(e), null);
      }
      if ((!t.forceUpdate && !r.ok) || 200 !== r.status) return null;
      const o = await r.json(),
        i = Date.now() + 36e5;
      try {
        const e = r.headers.has("Expires")
          ? Math.min(Date.parse(r.headers.get("Expires")), i)
          : i;
        await Yr.addAll(o, e);
      } catch (e) {
        console.error(e);
      }
      return o;
    }
    async function ro(e) {
      const t = await to;
      if (!t.hasOwnProperty(e)) return null;
      const n = t[e];
      return n.aliasOf ? await ro(n.aliasOf) : n;
    }
    var oo = Object.freeze({
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
            (this.conf.biblio = Xr));
          const e = Object.keys(this.conf.localBiblio)
            .filter(e => this.conf.localBiblio[e].hasOwnProperty("aliasOf"))
            .map(e => this.conf.localBiblio[e].aliasOf)
            .filter(e => !this.conf.localBiblio.hasOwnProperty(e));
          this.normalizeReferences();
          const t = this.getRefKeys(),
            n = Array.from(
              new Set(
                t.normativeReferences
                  .concat(t.informativeReferences)
                  .filter(e => !this.conf.localBiblio.hasOwnProperty(e))
                  .concat(e)
                  .sort()
              )
            ),
            r = n.length
              ? await (async function (e) {
                  const t = [];
                  try {
                    await Yr.ready;
                    const n = e.map(async e => ({
                      id: e,
                      data: await Yr.find(e),
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
              Xr[e.id] = e.data;
            }));
          const i = o.noData.map(e => e.id);
          if (i.length) {
            const e = await no(i, { forceUpdate: !0 });
            Object.assign(Xr, e);
          }
          (Object.assign(Xr, this.conf.localBiblio),
            (() => {
              eo(this.conf.biblio);
            })());
        }
      },
      biblio: Xr,
      name: "core/biblio",
      resolveRef: ro,
      updateFromNetwork: no,
    });
    const io = "core/render-biblio",
      so = Et({
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
      ao = new Map([
        ["CR", "W3C Candidate Recommendation"],
        ["ED", "W3C Editor's Draft"],
        ["LCWD", "W3C Last Call Working Draft"],
        ["NOTE", "W3C Working Group Note"],
        ["PR", "W3C Proposed Recommendation"],
        ["REC", "W3C Recommendation"],
        ["WD", "W3C Working Draft"],
      ]),
      lo =
        ((co = "."),
        e => {
          const t = e.trim();
          return !t || t.endsWith(co) ? t : t + co;
        });
    var co;
    function uo(e, t) {
      const { goodRefs: n, badRefs: r } = (function (e) {
          const t = [],
            n = [];
          for (const r of e) r.refcontent ? t.push(r) : n.push(r);
          return { goodRefs: t, badRefs: n };
        })(e.map(po)),
        o = (function (e) {
          const t = new Map();
          for (const n of e)
            t.has(n.refcontent.id) || t.set(n.refcontent.id, n);
          return [...t.values()];
        })(n),
        i = o
          .concat(r)
          .sort((e, t) =>
            e.ref.toLocaleLowerCase().localeCompare(t.ref.toLocaleLowerCase())
          ),
        s = lt`<section>
    <h3>${t}</h3>
    <dl class="bibliography">${i.map(fo)}</dl>
  </section>`;
      Lt(s, "", t);
      const a = (function (e) {
        return e.reduce((e, t) => {
          const n = t.refcontent.id;
          return ((e.has(n) ? e.get(n) : e.set(n, []).get(n)).push(t.ref), e);
        }, new Map());
      })(n);
      return (
        (function (e, t) {
          e.map(({ ref: e, refcontent: n }) => {
            const r = `#bib-${e.toLowerCase()}`,
              o = t
                .get(n.id)
                .map(e => `a.bibref[href="#bib-${e.toLowerCase()}"]`)
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
              ...document.querySelectorAll(
                `a.bibref[href="#bib-${t.toLowerCase()}"]`
              ),
            ].filter(
              ({ textContent: e }) => e.toLowerCase() === t.toLowerCase()
            );
            Ht(`Reference "[${t}]" not found.`, io, {
              hint: `Search for ["${t}"](https://www.specref.org?q=${t}) on Specref to see if it exists or if it's misspelled.`,
              elements: e,
            });
          }
        })(r),
        s
      );
    }
    function po(e) {
      let t = Xr[e],
        n = e;
      const r = new Set([n]);
      for (; t && t.aliasOf; )
        if (r.has(t.aliasOf)) {
          t = null;
          Ht(
            `Circular reference in biblio DB between [\`${e}\`] and [\`${n}\`].`,
            io
          );
        } else ((n = t.aliasOf), (t = Xr[n]), r.add(n));
      return (
        t && !t.id && (t.id = e.toLowerCase()),
        { ref: e, refcontent: t }
      );
    }
    function ho(e, t) {
      const n = e.replace(/^(!|\?)/, ""),
        r = `#bib-${n.toLowerCase()}`,
        o = lt`<cite
    ><a class="bibref" href="${r}" data-link-type="biblio">${t || n}</a></cite
  >`;
      return t ? o : lt`[${o}]`;
    }
    function fo(e) {
      const { ref: t, refcontent: n } = e,
        r = `bib-${t.toLowerCase()}`;
      return lt`
    <dt id="${r}">[${t}]</dt>
    <dd>
      ${
        n
          ? { html: mo(n) }
          : lt`<em class="respec-offending-element"
            >${so.reference_not_found}</em
          >`
      }
    </dd>
  `;
    }
    function mo(e) {
      if ("string" == typeof e) return e;
      let t = `<cite>${e.title}</cite>`;
      return (
        (t = e.href ? `<a href="${e.href}">${t}</a>. ` : `${t}. `),
        e.authors &&
          e.authors.length &&
          ((t += e.authors.join("; ")),
          e.etAl && (t += " et al"),
          t.endsWith(".") || (t += ". ")),
        e.publisher && (t = `${t} ${lo(e.publisher)} `),
        e.date && (t += `${e.date}. `),
        e.status && (t += `${ao.get(e.status) || e.status}. `),
        e.href && (t += `URL: <a href="${e.href}">${e.href}</a>`),
        t
      );
    }
    var go = Object.freeze({
      __proto__: null,
      name: io,
      renderInlineCitation: ho,
      run: function (e) {
        const t = Array.from(e.informativeReferences),
          n = Array.from(e.normativeReferences);
        if (!t.length && !n.length) return;
        const r =
          document.querySelector("section#references") ||
          lt`<section id="references"></section>`;
        if (
          (document.querySelector("section#references > :is(h2, h1)") ||
            r.prepend(lt`<h1>${so.references}</h1>`),
          r.classList.add("appendix"),
          n.length)
        ) {
          const e = uo(n, so.norm_references);
          r.appendChild(e);
        }
        if (t.length) {
          const e = uo(t, so.info_references);
          r.appendChild(e);
        }
        document.body.appendChild(r);
      },
    });
    const bo = "core/inlines",
      yo = {},
      wo = e => new RegExp(e.map(e => e.source).join("|")),
      vo = Et({
        en: {
          rfc2119Keywords: () =>
            wo([
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
            wo([
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
      ko = /(?:`[^`]+`)(?!`)/,
      xo = /(?:{{[^}]+\?*}})/,
      $o = /\B\|\w[\w\s]*(?:\s*:[\w\s&;"?<>]+\??)?\|\B/,
      _o = /(?:\[\[(?:!|\\|\?)?[\w.-]+(?:|[^\]]+)?\]\])/,
      Eo = /(?:\[\[\[(?:!|\\|\?)?#?[\w-.]+\]\]\])/,
      So = /(?:\[=[^=]+=\])/,
      Co = /(?:\[\^[^^]+\^\])/;
    function Lo(e) {
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
      return lt`<code
    ><a
      data-xref-type="${i}"
      data-xref-for="${s}"
      data-link-type="${i}"
      data-link-for="${s}"
      >${a}</a
    ></code
  >`;
    }
    function Ao(e) {
      const t = _t(e),
        n = lt`<em class="rfc2119">${t}</em>`;
      return ((yo[t] = !0), n);
    }
    function Ro(e) {
      const t = e.slice(3, -3).trim();
      return t.startsWith("#")
        ? lt`<a href="${t}" data-matched-text="${e}"></a>`
        : lt`<a data-cite="${t}" data-matched-text="${e}"></a>`;
    }
    function To(e, t) {
      const n = _t(e.slice(2, -2));
      if (n.startsWith("\\")) return e.replace("\\", "");
      const r = Zr(n);
      return !!t.parentElement.closest("dfn,a")
        ? Oo(`\`${r.textContent}\``)
        : r;
    }
    function Po(e, t, n) {
      const r = e.slice(2, -2);
      if (r.startsWith("\\")) return [`[[${r.slice(1)}]]`];
      const [o, i] = r.split("|").map(_t),
        { type: s, illegal: a } = Tt(o, t.parentElement),
        l = ho(o, i),
        c = o.replace(/^(!|\?)/, "");
      if (a && !n.normativeReferences.has(c)) {
        const e = l.childNodes[1] || l;
        Bt(
          "Normative references in informative sections are not allowed. ",
          bo,
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
    function jo(e, t, n) {
      return "ABBR" === t.parentElement.tagName
        ? e
        : lt`<abbr title="${n.get(e)}">${e}</abbr>`;
    }
    function No(e) {
      const t = e.slice(1, -1).split(":", 2),
        [n, r] = t.map(e => e.trim());
      return lt`<var data-type="${r}">${n}</var>`;
    }
    function zo(e) {
      const t = (function (e) {
          const t = e => e.replace("%%", "/").split("/").map(_t).join("/"),
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
        s = Do(i),
        a = n ? _t(n) : null;
      return lt`<a
    data-link-type="dfn|abstract-op"
    data-link-for="${a}"
    data-xref-for="${a}"
    data-lt="${o}"
    >${s}</a
  >`;
    }
    function Oo(e) {
      const t = e.slice(1, -1);
      return lt`<code>${t}</code>`;
    }
    function Do(e) {
      return ko.test(e)
        ? e
            .split(/(`[^`]+`)(?!`)/)
            .map(e => (e.startsWith("`") ? Oo(e) : Do(e)))
        : document.createTextNode(e);
    }
    var Io = Object.freeze({
      __proto__: null,
      name: bo,
      rfc2119Usage: yo,
      run: function (e) {
        const t = new Map();
        (document.normalize(),
          document.querySelector("section#conformance") ||
            document.body.classList.add("informative"),
          (e.normativeReferences = new zt()),
          (e.informativeReferences = new zt()),
          e.respecRFC2119 || (e.respecRFC2119 = yo));
        const n = document.querySelectorAll("abbr[title]:not(.exclude)");
        for (const { textContent: e, title: r } of n) {
          const n = _t(e),
            o = _t(r);
          t.set(n, o);
        }
        const r = t.size
            ? new RegExp(`(?:\\b${[...t.keys()].join("\\b)|(?:\\b")}\\b)`)
            : null,
          o = (function (e, t = [], n = { wsNodes: !0 }) {
            const r = t.join(", "),
              o = document.createNodeIterator(e, NodeFilter.SHOW_TEXT, e =>
                n.wsNodes || e.data.trim()
                  ? r && e.parentElement.closest(r)
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT
                  : NodeFilter.FILTER_REJECT
              ),
              i = [];
            let s;
            for (; (s = o.nextNode()); ) i.push(s);
            return i;
          })(
            document.body,
            ["#respec-ui", ".head", "pre", "svg", "script", "style"],
            { wsNodes: !1 }
          ),
          i = vo.rfc2119Keywords(),
          s = new RegExp(
            `(${wo([i, xo, $o, _o, Eo, So, ko, Co, ...(r ? [r] : [])]).source})`
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
                  o.append(To(s, n));
                  break;
                case s.startsWith("[[["):
                  o.append(Ro(s));
                  break;
                case s.startsWith("[["):
                  o.append(...Po(s, n, e));
                  break;
                case s.startsWith("|"):
                  o.append(No(s));
                  break;
                case s.startsWith("[="):
                  o.append(zo(s));
                  break;
                case s.startsWith("`"):
                  o.append(Oo(s));
                  break;
                case s.startsWith("[^"):
                  o.append(Lo(s));
                  break;
                case t.has(s):
                  o.append(jo(s, n, t));
                  break;
                case i.test(s):
                  o.append(Ao(s));
              }
            else o.append(s);
          n.replaceWith(o);
        }
      },
    });
    const qo = "dini/conformance",
      Mo = Et({
        en: {
          conformance: "Conformance",
          normativity:
            "As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.",
          keywordInterpretation: (e, t) => lt`<p>
        The key word${t ? "s" : ""} ${e} in this document
        ${t ? "are" : "is"} to be interpreted as described in
        <a href="https://www.rfc-editor.org/info/bcp14">BCP 14</a>
        ${ho("RFC2119")} ${ho("RFC8174")}
        when, and only when, ${t ? "they appear" : "it appears"} in all
        capitals, as shown here.
      </p>`,
        },
        de: {
          conformance: "Anforderungen",
          normativity:
            "Neben den explizit als nicht-normativ gekennzeichneten Abschnitten sind auch alle Diagramme, Beispiele und Hinweise in diesem Dokument nicht normativ. Alle anderen Angaben sind normativ.",
          keywordInterpretation: (e, t) => lt`<p>
        ${t ? "Die Schlüsselwörter" : "Das Schlüsselwort"} ${e} in
        diesem Dokument ${t ? "sind" : "ist"} gemäß
        <a href="https://www.rfc-editor.org/info/bcp14">BCP 14</a>
        ${ho("RFC2119")} ${ho("RFC8174")}
        und unter Berücksichtigung von
        <a href="https://github.com/adfinis-sygroup/2119/blob/master/2119de.rst"
          >2119de</a
        >
        zu interpretieren, wenn und nur wenn ${t ? "sie" : "es"} wie hier
        gezeigt durchgehend groß geschrieben wurde${t ? "n" : ""}.
      </p>`,
        },
      });
    function Ho(e, t) {
      const n = [...Object.keys(yo)];
      n.length &&
        (t.normativeReferences.add("RFC2119"),
        t.normativeReferences.add("RFC8174"));
      const r =
        ((o = n.sort()),
        []
          .concat(kt(o, e => lt`<em class="rfc2119">${e}</em>`))
          .map(e => ("string" == typeof e ? lt`${e}` : e)));
      var o;
      const i = n.length > 1,
        s = lt`
    <h1>${Mo.conformance}</h1>
    <p>${Mo.normativity}</p>
    ${n.length ? Mo.keywordInterpretation(r, i) : null}
  `;
      e.prepend(...s.childNodes);
    }
    var Bo = Object.freeze({
      __proto__: null,
      name: qo,
      run: function (e) {
        const t = document.querySelector("section#conformance");
        if (
          (t && !t.classList.contains("override") && Ho(t, e),
          !t && Object.keys(yo).length)
        ) {
          Bt(
            "Document uses RFC2119 keywords but lacks a conformance section.",
            qo,
            { hint: 'Please add a `<section id="conformance">`.' }
          );
        }
      },
    });
    function Fo(e, t, n, r) {
      try {
        switch (t) {
          case "element-attr":
            return (document.createAttribute(e), !0);
          case "element":
            return (document.createElement(e), !0);
        }
      } catch (o) {
        Ht(`Invalid ${t} name "${e}": ${o.message}`, r, {
          hint: `Check that the ${t} name is allowed per the XML's Name production for ${t}.`,
          elements: [n],
        });
      }
      return !1;
    }
    function Wo(e, t, n, r) {
      if (/^[a-z]+(-[a-z]+)*$/i.test(e)) return !0;
      return (
        Ht(`Invalid ${t} name "${e}".`, r, {
          hint: `Check that the ${t} name is allowed per the naming rules for this type.`,
          elements: [n],
        }),
        !1
      );
    }
    const Uo = new qt();
    function Vo(e, t) {
      for (const n of t) (Uo.has(n) || Uo.set(n, new Set()), Uo.get(n).add(e));
    }
    const Zo = "core/dfn",
      Go = new Map([
        ["abstract-op", { requiresFor: !1 }],
        [
          "attr-value",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: Wo,
          },
        ],
        ["element", { requiresFor: !1, validator: Fo }],
        ["element-attr", { requiresFor: !1, validator: Fo }],
        [
          "element-state",
          {
            requiresFor: !0,
            associateWith: "a markup attribute",
            validator: Wo,
          },
        ],
        ["event", { requiresFor: !1, validator: Wo }],
        ["http-header", { requiresFor: !1 }],
        [
          "media-type",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              try {
                const t = new dt(e);
                if (t.toString() !== e)
                  throw new Error(
                    `Input doesn't match its canonical form: "${t}".`
                  );
              } catch (o) {
                return (
                  Ht(`Invalid ${t} "${e}": ${o.message}.`, r, {
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
        ["scheme", { requiresFor: !1, validator: Wo }],
        [
          "permission",
          {
            requiresFor: !1,
            validator: function (e, t, n, r) {
              return e.startsWith('"') && e.endsWith('"')
                ? Wo(e.slice(1, -1), t, n, r)
                : (Ht(`Invalid ${t} "${e}".`, r, {
                    hint: `Check that the ${t} is quoted with double quotes.`,
                    elements: [n],
                  }),
                  !1);
            },
          },
        ],
      ]),
      Ko = [...Go.keys()];
    function Yo(e, t) {
      let n = "";
      switch (!0) {
        case Ko.some(t => e.classList.contains(t)):
          ((n = [...e.classList].find(e => Go.has(e))),
            (function (e, t, n) {
              const r = Go.get(t);
              if (r.requiresFor && !n.dataset.dfnFor) {
                const e = Vt`Definition of type "\`${t}\`" requires a ${"[data-dfn-for]"} attribute.`,
                  { associateWith: o } = r,
                  i = Vt`Use a ${"[data-dfn-for]"} attribute to associate this with ${o}.`;
                Ht(e, Zo, { hint: i, elements: [n] });
              }
              r.validator && r.validator(e, t, n, Zo);
            })(t, n, e));
          break;
        case Pr.test(t):
          n = (function (e, t) {
            t.dataset.hasOwnProperty("idl") || (t.dataset.idl = "");
            const n = t.closest("[data-dfn-for]");
            t !== n &&
              n?.dataset.dfnFor &&
              (t.dataset.dfnFor = n.dataset.dfnFor);
            if (!t.dataset.dfnFor) {
              const n = Vt`Use a ${"[data-dfn-for]"} attribute to associate this dfn with a WebIDL interface.`;
              Ht(
                `Internal slot "${e}" must be associated with a WebIDL interface.`,
                Zo,
                { hint: n, elements: [t] }
              );
            }
            t.matches(".export, [data-export]") || (t.dataset.noexport = "");
            const r = e.endsWith(")") ? "method" : "attribute";
            if (!t.dataset.dfnType) return r;
            const o = ["attribute", "method"],
              { dfnType: i } = t.dataset;
            if (!o.includes(i) || r !== i) {
              const n = Vt`Invalid ${"[data-dfn-type]"} attribute on internal slot.`,
                i = `The only allowed types are: ${Ut(o, { quotes: !0 })}. The slot "${e}" seems to be a "${Wt(r)}"?`;
              return (Ht(n, Zo, { hint: i, elements: [t] }), "dfn");
            }
            return i;
          })(t, e);
      }
      if (!n && !e.matches("[data-dfn-type]")) {
        const t = e.closest("[data-dfn-type]");
        n = t?.dataset.dfnType;
      }
      n && !e.dataset.dfnType && (e.dataset.dfnType = n);
    }
    function Xo(e) {
      switch (!0) {
        case e.matches(".export.no-export"):
          Ht(
            Vt`Declares both "${"[no-export]"}" and "${"[export]"}" CSS class.`,
            Zo,
            { elements: [e], hint: "Please use only one." }
          );
          break;
        case e.matches(".no-export, [data-noexport]"):
          if (e.matches("[data-export]")) {
            (Ht(
              Vt`Declares ${"[no-export]"} CSS class, but also has a "${"[data-export]"}" attribute.`,
              Zo,
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
    var Qo = Object.freeze({
      __proto__: null,
      name: Zo,
      run: function () {
        for (const e of document.querySelectorAll("dfn")) {
          const t = At(e);
          if ((Vo(e, t), e.dataset.cite && /\b#\b/.test(e.dataset.cite)))
            continue;
          const [n] = t;
          (Yo(e, n), Xo(e));
          const r = (e.dataset.localLt || "").split("|").map(_t),
            o = t.filter(e => !r.includes(e));
          (o.length > 1 || n !== _t(e.textContent)) &&
            (e.dataset.lt = o.join("|"));
        }
      },
    });
    var Jo = Object.freeze({
      __proto__: null,
      name: "core/pluralize",
      run: function (e) {
        if (!e.pluralize) return;
        const t = (function () {
          const e = new Set();
          document.querySelectorAll("a:not([href])").forEach(t => {
            const n = _t(t.textContent).toLowerCase();
            (e.add(n), t.dataset.lt && e.add(t.dataset.lt));
          });
          const t = new Set(),
            n = document.querySelectorAll("dfn:not([data-lt-noDefault])");
          return (
            n.forEach(e => {
              const n = _t(e.textContent).toLowerCase();
              (t.add(n),
                e.dataset.lt && e.dataset.lt.split("|").forEach(e => t.add(e)),
                e.dataset.localLt &&
                  e.dataset.localLt.split("|").forEach(e => t.add(e)));
            }),
            function (n) {
              const r = _t(n).toLowerCase(),
                o = pt.isSingular(r) ? pt.plural(r) : pt.singular(r);
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
              ((e.dataset.plurals = n.join("|")), Vo(e, n));
            }
          });
      },
    });
    var ei = String.raw`span.example-title{text-transform:none}
:is(aside,div).example,div.illegal-example{padding:.5em;margin:1em 0;position:relative;clear:both}
div.illegal-example{color:red}
div.illegal-example p{color:#000}
aside.example div.example{border-left-width:.1em;border-color:#999;background:#fff}`;
    const ti = Et({
      en: { example: "Example" },
      nl: { example: "Voorbeeld" },
      es: { example: "Ejemplo" },
      ko: { example: "예시" },
      ja: { example: "例" },
      de: { example: "Beispiel" },
      zh: { example: "例" },
      cs: { example: "Příklad" },
    });
    function ni(e, t, n) {
      ((n.title = e.title), n.title && e.removeAttribute("title"));
      const r = t > 0 ? ` ${t}` : "",
        o = n.title ? lt`<span class="example-title">: ${n.title}</span>` : "";
      return lt`<div class="marker">
    <a class="self-link">${ti.example}<bdi>${r}</bdi></a
    >${o}
  </div>`;
    }
    var ri = Object.freeze({
      __proto__: null,
      name: "core/examples",
      run: function () {
        const e = document.querySelectorAll(
          "pre.example, pre.illegal-example, aside.example"
        );
        if (!e.length) return;
        document.head.insertBefore(
          lt`<style>
      ${ei}
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
            const o = ni(e, t, n);
            e.prepend(o);
            const i = Lt(e, "example", r || String(t));
            o.querySelector("a.self-link").href = `#${i}`;
          } else {
            const o = !!e.closest("aside");
            (o || ++t,
              (n.content = e.innerHTML),
              e.classList.remove("example", "illegal-example"));
            const i = e.id ? e.id : null;
            i && e.removeAttribute("id");
            const s = ni(e, o ? 0 : t, n),
              a = lt`<div class="example" id="${i}">
        ${s} ${e.cloneNode(!0)}
      </div>`;
            Lt(a, "example", r || String(t));
            ((a.querySelector("a.self-link").href = `#${a.id}`),
              e.replaceWith(a));
          }
        });
      },
    });
    var oi = String.raw`.issue-label{text-transform:initial}
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
    const ii = "core/issues-notes",
      si = Et({
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
    function ai(e, t, n) {
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
                  ? si.feature_at_risk
                  : si.issue
                : n
                  ? si.warning
                  : r
                    ? si.editors_note
                    : si.note;
            return { type: i, displayType: s, isFeatureAtRisk: o };
          })(e),
          l = "issue" === i,
          c = "span" === e.localName,
          { number: u } = e.dataset,
          d = { title: e.title, number: r(e) };
        if (!c) {
          const r = lt`<div class="${a ? `${i} atrisk` : i}" role="${"note" === i ? "note" : null}"></div>`,
            c = document.createElement("span"),
            p = lt`<div role="heading" class="${`${i}-title marker`}">${c}</div>`;
          Lt(p, "h", i);
          let h,
            f = s;
          if (
            (e.id
              ? ((r.id = e.id), e.removeAttribute("id"))
              : Lt(r, "issue-container", d.number ? `number-${d.number}` : ""),
            l)
          ) {
            if (
              (void 0 !== d.number && (f += ` ${d.number}`),
              e.dataset.hasOwnProperty("number"))
            ) {
              const e = (function (e, t, { isFeatureAtRisk: n = !1 } = {}) {
                if (!n && t.issueBase)
                  return lt`<a href="${t.issueBase + e}" />`;
                if (n && t.atRiskBase)
                  return lt`<a href="${t.atRiskBase + e}" />`;
              })(u, n, { isFeatureAtRisk: a });
              if (
                (e && (c.before(e), e.append(c)),
                c.classList.add("issue-number"),
                (h = t.get(u)),
                !h)
              ) {
                Bt(`Failed to fetch issue number ${u}.`, ii);
              }
              h && !d.title && (d.title = h.title);
            }
            o.append(
              (function (e, t, n) {
                const r = `${e}${t.number ? ` ${t.number}` : ""}`,
                  o = t.title
                    ? lt`<span style="text-transform: none">: ${t.title}</span>`
                    : "";
                return lt`<li><a href="${`#${n}`}">${r}</a>${o}</li>`;
              })(si.issue, d, r.id)
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
                      return lt` <a
    class="respec-gh-label"
    style="${s}"
    href="${o.href}"
    aria-label="${a}"
    >${r}</a
  >`;
                    })(e, n)
                  );
                  r.length && r.unshift(document.createTextNode(" "));
                  return lt`<span class="issue-label">: ${t}${r}</span>`;
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
          const g = jt(p, "section").length + 2;
          p.setAttribute("aria-level", g);
        }
      }),
        (function (e) {
          const t = document.getElementById("issue-summary");
          if (!t) return;
          const n = t.querySelector("h2, h3, h4, h5, h6");
          (e.hasChildNodes()
            ? t.append(e)
            : t.append(lt`<p>${si.no_issues_in_spec}</p>`),
            (!n || (n && n !== t.firstElementChild)) &&
              t.insertAdjacentHTML(
                "afterbegin",
                `<h1>${si.issue_summary}</h1>`
              ));
        })(o));
    }
    var li = Object.freeze({
      __proto__: null,
      name: ii,
      run: async function (e) {
        const t = document.querySelectorAll(".issue, .note, .warning, .ednote"),
          n = Array.from(t).filter(e => e instanceof HTMLElement);
        if (!n.length) return;
        const r = await (async function (e) {
            if (!e || !e.apiBase) return new Map();
            const t = [...document.querySelectorAll(".issue[data-number]")]
              .map(e => Number.parseInt(e.dataset.number, 10))
              .filter(e => e);
            if (!t.length) return new Map();
            const n = new URL("issues", `${e.apiBase}/${e.fullName}/`);
            n.searchParams.set("issues", t.join(","));
            const r = await fetch(n.href);
            if (!r.ok)
              return (
                Ht(
                  `Error fetching issues from GitHub. (HTTP Status ${r.status}).`,
                  ii
                ),
                new Map()
              );
            const o = await r.json();
            return new Map(Object.entries(o));
          })(e.github),
          { head: o } = document;
        (o.insertBefore(
          lt`<style>
      ${oi}
    </style>`,
          o.querySelector("link")
        ),
          ai(n, r, e),
          document.querySelectorAll(".ednote").forEach(e => {
            (e.classList.remove("ednote"), e.classList.add("note"));
          }));
      },
    });
    const ci = "core/best-practices",
      ui = {
        en: { best_practice: "Best Practice " },
        ja: { best_practice: "最良実施例 " },
        de: { best_practice: "Musterbeispiel " },
        zh: { best_practice: "最佳实践 " },
      },
      di = Et(ui),
      pi = i in ui ? i : "en";
    var hi = Object.freeze({
      __proto__: null,
      name: ci,
      run: function () {
        const e = document.querySelectorAll(".practicelab"),
          t = document.getElementById("bp-summary"),
          n = t ? document.createElement("ul") : null;
        if (
          ([...e].forEach((e, t) => {
            const r = Lt(e, "bp"),
              o = lt`<a class="marker self-link" href="${`#${r}`}"
      ><bdi lang="${pi}">${di.best_practice}${t + 1}</bdi></a
    >`;
            if (n) {
              const t = lt`<li>${o}: ${Ot(e)}</li>`;
              n.appendChild(t);
            }
            const i = e.closest("div");
            if (!i) return void e.classList.add("advisement");
            i.classList.add("advisement");
            const s = lt`${o.cloneNode(!0)}: ${e}`;
            i.prepend(...s.childNodes);
          }),
          e.length)
        )
          t &&
            (t.appendChild(lt`<h1>Best Practices Summary</h1>`),
            t.appendChild(n));
        else if (t) {
          (Bt(
            "Using best practices summary (#bp-summary) but no best practices found.",
            ci
          ),
            t.remove());
        }
      },
    });
    const fi = "core/figures",
      mi = Et({
        en: { list_of_figures: "List of Figures", fig: "Figure " },
        ja: { fig: "図 ", list_of_figures: "図のリスト" },
        ko: { fig: "그림 ", list_of_figures: "그림 목록" },
        nl: { fig: "Figuur ", list_of_figures: "Lijst met figuren" },
        es: { fig: "Figura ", list_of_figures: "Lista de Figuras" },
        zh: { fig: "图 ", list_of_figures: "规范中包含的图" },
        de: { fig: "Abbildung", list_of_figures: "Abbildungsverzeichnis" },
      });
    var gi = Object.freeze({
      __proto__: null,
      name: fi,
      run: function () {
        const e = (function () {
            const e = [];
            return (
              document.querySelectorAll("figure").forEach((t, n) => {
                const r = t.querySelector("figcaption");
                if (r)
                  (!(function (e, t, n) {
                    const r = t.textContent;
                    (Lt(e, "fig", r),
                      Pt(t, lt`<span class="fig-title"></span>`),
                      t.prepend(
                        lt`<a class="self-link" href="#${e.id}"
      >${mi.fig}<bdi class="figno">${n + 1}</bdi></a
    >`,
                        " "
                      ));
                  })(t, r, n),
                    e.push(
                      (function (e, t) {
                        const n = t.cloneNode(!0);
                        return (
                          n.querySelectorAll("a").forEach(e => {
                            Rt(e, "span").removeAttribute("href");
                          }),
                          lt`<li class="tofline">
    <a class="tocxref" href="${`#${e}`}">${n.childNodes}</a>
  </li>`
                        );
                      })(t.id, r)
                    ));
                else {
                  Bt("Found a `<figure>` without a `<figcaption>`.", fi, {
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
            lt`<h1>${mi.list_of_figures}</h1>`,
            lt`<ul class="tof">
        ${e}
      </ul>`
          ));
      },
    });
    const bi = "core/data-cite",
      yi = "__SPEC__";
    async function wi(e) {
      const { key: t, frag: n, path: r, href: o } = e;
      let i = "",
        s = "";
      if (t === yi) i = document.location.href;
      else {
        const e = await ro(t);
        if (!e) return null;
        ((i = e.href), (s = e.title));
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
    function vi(e, t, n) {
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
            e.textContent ? Pt(e, t) : ((t.textContent = o), e.append(t)),
            i)
          ) {
            const n = document.createElement("cite");
            (n.append(t), e.append(n));
          }
          if ("export" in e.dataset) {
            (Ht("Exporting a linked external definition is not allowed.", bi, {
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
    function ki(e) {
      return t => {
        const n = t.search(e);
        return -1 !== n ? t.substring(n) : "";
      };
    }
    const xi = ki("#"),
      $i = ki("/");
    function _i(e) {
      const { dataset: t } = e,
        { cite: n, citeFrag: r, citePath: o, citeHref: i } = t;
      if (n.startsWith("#") && !r) {
        const r = e.parentElement.closest('[data-cite]:not([data-cite^="#"])'),
          { key: o, isNormative: i } = r ? _i(r) : { key: yi, isNormative: !1 };
        return (
          (t.cite = i ? o : `?${o}`),
          (t.citeFrag = n.replace("#", "")),
          _i(e)
        );
      }
      const s = r ? `#${r}` : xi(n),
        a = o || $i(n).split("#")[0],
        { type: l } = Tt(n, e),
        c = "normative" === l,
        u = /^[?|!]/.test(n);
      return {
        key: n.split(/[/|#]/)[0].substring(Number(u)),
        isNormative: c,
        frag: s,
        path: a,
        href: i,
      };
    }
    function Ei(e) {
      const t = ["data-cite", "data-cite-frag", "data-cite-path"];
      e.querySelectorAll("a[data-cite], dfn[data-cite]").forEach(e =>
        t.forEach(t => e.removeAttribute(t))
      );
    }
    var Si = Object.freeze({
      __proto__: null,
      THIS_SPEC: yi,
      name: bi,
      run: async function () {
        const e = document.querySelectorAll(
          "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
        );
        await (async function (e) {
          const t = e
              .map(_i)
              .map(async e => ({ entry: e, result: await ro(e.key) })),
            n = (await Promise.all(t))
              .filter(({ result: e }) => null === e)
              .map(({ entry: { key: e } }) => e),
            r = await no(n);
          r && Object.assign(Xr, r);
        })([...e]);
        for (const t of e) {
          const e = t.dataset.cite,
            n = _i(t),
            r = await wi(n);
          if (r) vi(t, r, n);
          else {
            const n = `Couldn't find a match for "${e}"`;
            (t.dataset.matchedText && (t.textContent = t.dataset.matchedText),
              Bt(n, bi, { elements: [t] }));
          }
        }
        Yt("beforesave", Ei);
      },
      toCiteDetails: _i,
    });
    const Ci = "core/link-to-dfn",
      Li = [],
      Ai = {
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
      Ri = Et(Ai);
    function Ti(e) {
      const t = new Map(),
        n = [];
      for (const r of Uo.get(e)) {
        const { dfnType: o = "dfn" } = r.dataset,
          i = r.dataset.dfnFor?.split(",").map(e => e.trim()) ?? [""];
        for (const s of i) {
          if (t.has(s) && t.get(s).has(o)) {
            const e = t.get(s).get(o),
              i = "dfn" === e.localName,
              a = "dfn" === r.localName,
              l = o === (e.dataset.dfnType || "dfn"),
              c =
                (!s && !e.dataset.dfnFor) ||
                e.dataset.dfnFor
                  ?.split(",")
                  .map(e => e.trim())
                  .includes(s);
            if (i && a && l && c) {
              n.push(r);
              continue;
            }
          }
          (t.has(s) || t.set(s, new Map()),
            t.get(s).set(o, r),
            ("idl" in r.dataset || "dfn" !== o) && t.get(s).set("idl", r),
            Lt(r, "dfn", e));
        }
      }
      return { result: t, duplicates: n };
    }
    function Pi(e, t) {
      const n = (function (e) {
          const t = e.closest("[data-link-for]"),
            n = t ? t.dataset.linkFor : "",
            r = At(e).reduce((e, r) => {
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
        r = n.find(e => t.has(e.title) && t.get(e.title).has(e.for));
      if (!r) return;
      const o = t.get(r.title).get(r.for),
        { linkType: i } = e.dataset;
      if (i) {
        for (const e of i.split("|")) if (o.get(e)) return o.get(e);
        return o.get("dfn");
      }
      {
        const e = r.for ? "idl" : "dfn";
        return o.get(e) || o.get("idl");
      }
    }
    function ji(e, t, n) {
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
              o = Ni(e) && Ni(t, n);
            (r && !o) || Pt(e, document.createElement("code"));
          })(e, t),
        !r
      );
    }
    function Ni(e, t = "") {
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
    function zi(e) {
      e.forEach(e => {
        Bt(
          `Found linkless \`<a>\` element with text "${e.textContent}" but no matching \`<dfn>\``,
          Ci,
          { title: "Linking error: not matching `<dfn>`", elements: [e] }
        );
      });
    }
    var Oi = Object.freeze({
      __proto__: null,
      name: Ci,
      possibleExternalLinks: Li,
      run: async function (e) {
        const t = (function () {
            const e = new qt();
            for (const t of Uo.keys()) {
              const { result: n, duplicates: r } = Ti(t);
              (e.set(t, n),
                r.length > 0 &&
                  Ht(Ri.duplicateMsg(t), Ci, {
                    title: Ri.duplicateTitle,
                    elements: r,
                  }));
            }
            return e;
          })(),
          n = [],
          r = document.querySelectorAll(
            "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo):not(.externalDFN)"
          );
        for (const e of r) {
          if (!e.dataset?.linkType && e.dataset?.xrefType) {
            Li.push(e);
            continue;
          }
          const r = Pi(e, t);
          if (r) {
            ji(e, r, t) || Li.push(e);
          } else "" === e.dataset.cite ? n.push(e) : Li.push(e);
        }
        (zi(n),
          (function (e) {
            const { shortName: t = "" } = e,
              n = new RegExp(String.raw`^([?!])?${t}\b([^-])`, "i"),
              r = document.querySelectorAll(
                "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
              );
            for (const t of r) {
              t.dataset.cite = t.dataset.cite.replace(n, `$1${yi}$2`);
              const { key: r, isNormative: o } = _i(t);
              r !== yi &&
                (o || e.normativeReferences.has(r)
                  ? (e.normativeReferences.add(r),
                    e.informativeReferences.delete(r))
                  : e.informativeReferences.add(r));
            }
          })(e),
          e.xref || zi(Li));
      },
    });
    const Di = "core/contrib";
    var Ii = Object.freeze({
      __proto__: null,
      name: Di,
      run: async function (e) {
        if (!document.getElementById("gh-contributors")) return;
        if (!e.github) {
          return void Ht(
            Vt`Requested list of contributors from GitHub, but ${"[github]"} configuration option is not set.`,
            Di
          );
        }
        const t = e.editors.map(e => e.name),
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
                  return void lt(
                    t
                  )`${n.map(({ name: e, login: t }) => `<li><a href="https://github.com/${t}">${e || t}</a></li>`)}`;
                const r = n.map(e => e.name || e.login);
                t.textContent = $t(r);
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
                      i && new Date(i.headers.get("Expires")) > new Date())
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
                Ht("Error loading contributors from GitHub.", Di, { cause: e }),
                null
              );
            }
          }
        })(t, n);
      },
    });
    var qi = Object.freeze({
      __proto__: null,
      name: "core/fix-headers",
      run: function () {
        [...document.querySelectorAll("section:not(.introductory)")]
          .map(e => e.querySelector("h1, h2, h3, h4, h5, h6"))
          .filter(e => e)
          .forEach(e => {
            const t = Math.min(
              (function (e, t) {
                const n = [];
                for (; e != e.ownerDocument.body; )
                  (e.matches(t) && n.push(e), (e = e.parentElement));
                return n;
              })(e, "section").length + 1,
              6
            );
            Rt(e, `h${t}`);
          });
      },
    });
    const Mi = ["h2", "h3", "h4", "h5", "h6"],
      Hi = "core/structure",
      Bi = Et({
        en: { toc: "Table of Contents", back_to_top: "Back to Top" },
        zh: { toc: "内容大纲", back_to_top: "返回顶部" },
        ko: { toc: "목차", back_to_top: "맨 위로" },
        ja: { toc: "目次", back_to_top: "先頭に戻る" },
        nl: { toc: "Inhoudsopgave", back_to_top: "Terug naar boven" },
        es: { toc: "Tabla de Contenidos", back_to_top: "Volver arriba" },
        de: { toc: "Inhaltsverzeichnis", back_to_top: "Zurück nach oben" },
        cs: { toc: "Obsah", back_to_top: "Zpět na začátek" },
      });
    function Fi(e, t, { prefix: n = "" } = {}) {
      let r = !1,
        o = 0,
        i = 1;
      if ((n.length && !n.endsWith(".") && (n += "."), 0 === e.length))
        return null;
      const s = lt`<ol class="toc"></ol>`;
      for (const a of e) {
        !a.isAppendix || n || r || ((o = i), (r = !0));
        let e = a.isIntro ? "" : r ? Wi(i - o + 1) : n + i;
        const l = e.split(".").length;
        if (
          (1 === l &&
            ((e += "."), a.header.before(document.createComment("OddPage"))),
          a.isIntro ||
            ((i += 1), a.header.prepend(lt`<bdi class="secno">${e} </bdi>`)),
          l <= t)
        ) {
          const n = a.header.id || a.element.id,
            r = Vi(a.header, n),
            o = Fi(a.subsections, t, { prefix: e });
          (o && r.append(o), s.append(r));
        }
      }
      return s;
    }
    function Wi(e) {
      let t = "";
      for (; e > 0; )
        ((e -= 1),
          (t = String.fromCharCode(65 + (e % 26)) + t),
          (e = Math.floor(e / 26)));
      return t;
    }
    function Ui(e) {
      const t = e.querySelectorAll(":scope > section"),
        n = [];
      for (const e of t) {
        const t = e.classList.contains("notoc");
        if (!e.children.length || t) continue;
        const r = e.children[0];
        if (!Mi.includes(r.localName)) continue;
        const o = r.textContent;
        (Lt(e, null, o),
          n.push({
            element: e,
            header: r,
            title: o,
            isIntro: Boolean(e.closest(".introductory")),
            isAppendix: e.classList.contains("appendix"),
            subsections: Ui(e),
          }));
      }
      return n;
    }
    function Vi(e, t) {
      const n = lt`<a href="${`#${t}`}" class="tocxref" />`;
      var r;
      return (
        n.append(...e.cloneNode(!0).childNodes),
        (r = n).querySelectorAll("a").forEach(e => {
          const t = Rt(e, "span");
          ((t.className = "formerLink"), t.removeAttribute("href"));
        }),
        r.querySelectorAll("dfn").forEach(e => {
          Rt(e, "span").removeAttribute("id");
        }),
        lt`<li class="tocline">${n}</li>`
      );
    }
    var Zi = Object.freeze({
      __proto__: null,
      name: Hi,
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
              const t = `h${Math.min(jt(e, "section").length + 1, 6)}`;
              e.localName !== t && Rt(e, t);
            });
          })(),
          !e.noTOC)
        ) {
          !(function () {
            const e = document.querySelectorAll("section[data-max-toc]");
            for (const t of e) {
              const e = parseInt(t.dataset.maxToc, 10);
              if (e < 0 || e > 6 || Number.isNaN(e)) {
                Ht(
                  "`data-max-toc` must have a value between 0-6 (inclusive).",
                  Hi,
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
          const t = Fi(Ui(document.body), e.maxTocLevel);
          t &&
            (function (e) {
              if (!e) return;
              const t = lt`<nav id="toc"></nav>`,
                n = lt`<h2 class="introductory">${Bi.toc}</h2>`;
              (Lt(n), t.append(n, e));
              const r =
                document.getElementById("toc") ||
                document.getElementById("sotd") ||
                document.getElementById("abstract");
              r && ("toc" === r.id ? r.replaceWith(t) : r.after(t));
              const o = lt`<p role="navigation" id="back-to-top">
    <a href="#title"><abbr title="${Bi.back_to_top}">&uarr;</abbr></a>
  </p>`;
              document.body.append(o);
            })(t);
        }
        Kt("toc");
      },
    });
    const Gi = Et({
      en: { informative: "This section is non-normative." },
      nl: { informative: "Dit onderdeel is niet normatief." },
      ko: { informative: "이 부분은 비규범적입니다." },
      ja: { informative: "この節は仕様には含まれません．" },
      de: { informative: "Dieser Abschnitt ist nicht normativ." },
      zh: { informative: "本章节不包含规范性内容。" },
      cs: { informative: "Tato sekce není normativní." },
    });
    var Ki = Object.freeze({
      __proto__: null,
      name: "core/informative",
      run: function () {
        Array.from(document.querySelectorAll("section.informative"))
          .map(e => e.querySelector("h2, h3, h4, h5, h6"))
          .filter(e => e)
          .forEach(e => {
            e.after(lt`<p><em>${Gi.informative}</em></p>`);
          });
      },
    });
    const Yi = Et({
      en: {
        permalinkLabel(e, t) {
          let n = `Permalink for${t ? "" : " this"} ${e}`;
          return (t && (n += ` ${_t(t.textContent)}`), n);
        },
      },
    });
    var Xi = Object.freeze({
      __proto__: null,
      name: "core/id-headers",
      run: function (e) {
        const t = document.querySelectorAll(
          "section:not(.head,#abstract,#sotd) h2, h3, h4, h5, h6"
        );
        for (const n of t) {
          let t = n.id;
          if (
            (t || (Lt(n), (t = n.parentElement.id || n.id)), !e.addSectionLinks)
          )
            continue;
          const r = Yi.permalinkLabel(
              n.closest(".appendix") ? "Appendix" : "Section",
              n.querySelector(":scope > bdi.secno")
            ),
            o = lt`<div class="header-wrapper"></div>`;
          n.replaceWith(o);
          const i = lt`<a
      href="#${t}"
      class="self-link"
      aria-label="${r}"
    ></a>`;
          o.append(n, i);
        }
      },
    });
    const Qi = "ui/save-html",
      Ji = Et({
        en: { save_snapshot: "Export" },
        nl: { save_snapshot: "Bewaar Snapshot" },
        ja: { save_snapshot: "保存する" },
        de: { save_snapshot: "Exportieren" },
        zh: { save_snapshot: "导出" },
      }),
      es = [
        {
          id: "respec-save-as-html",
          ext: "html",
          title: "HTML",
          type: "text/html",
          get href() {
            return Jt(this.type);
          },
        },
        {
          id: "respec-save-as-xml",
          ext: "xhtml",
          title: "XML",
          type: "application/xml",
          get href() {
            return Jt(this.type);
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
    function ts(e, t) {
      const { id: n, href: r, ext: o, title: i, type: s } = e,
        a = (function (e, t = "") {
          return ft.format(e).replace(ht, t);
        })(t.publishDate || new Date()),
        l = [t.specStatus, t.shortName || "spec", a].join("-");
      return lt`<a
    href="${r}"
    id="${n}"
    download="${l}.${o}"
    type="${s}"
    class="respec-save-button"
    onclick=${() => Tn.closeModal()}
    >${i}</a
  >`;
    }
    var ns = Object.freeze({
      __proto__: null,
      exportDocument: function (e, t) {
        return (
          Bt(
            "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed.",
            Qi,
            { hint: "Use core/exporter `rsDocToDataURL()` instead." }
          ),
          Jt(t)
        );
      },
      name: Qi,
      run: function (e) {
        const t = {
            async show(t) {
              await document.respec.ready;
              const n = lt`<div class="respec-save-buttons">
        ${es.map(t => ts(t, e))}
      </div>`;
              Tn.freshModal(Ji.save_snapshot, n, t);
            },
          },
          n = "download" in HTMLAnchorElement.prototype;
        let r;
        n &&
          (r = Tn.addCommand(
            Ji.save_snapshot,
            function () {
              if (!n) return;
              t.show(r);
            },
            "Ctrl+Shift+Alt+S",
            "💾"
          ));
      },
    });
    const rs = Et({
      en: { about_respec: "About" },
      zh: { about_respec: "关于" },
      nl: { about_respec: "Over" },
      ja: { about_respec: "これについて" },
      de: { about_respec: "Über" },
      cs: { about_respec: "O aplikaci" },
    });
    window.respecVersion = window.respecVersion || "Developer Edition";
    const os = document.createElement("div"),
      is = lt.bind(os),
      ss = Tn.addCommand(
        `${rs.about_respec} ${window.respecVersion}`,
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
              .map(as)
              .forEach(t => {
                e.push(t);
              });
          (is`
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
            Tn.freshModal(
              `${rs.about_respec} - ${window.respecVersion}`,
              os,
              ss
            ));
        },
        "Ctrl+Shift+Alt+A",
        "ℹ️"
      );
    function as({ name: e, duration: t }) {
      return lt`
    <tr>
      <td><a href="${`https://github.com/speced/respec/blob/develop/src/${e}.js`}">${e}</a></td>
      <td>${t}</td>
    </tr>
  `;
    }
    var ls = Object.freeze({ __proto__: null });
    var cs = Object.freeze({
      __proto__: null,
      name: "core/seo",
      run: function (e) {
        if (e.gitRevision) {
          const t = lt`<meta
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
    var us = String.raw`.hljs{--base:#fafafa;--mono-1:#383a42;--mono-2:#686b77;--mono-3:#717277;--hue-1:#0b76c5;--hue-2:#336ae3;--hue-3:#a626a4;--hue-4:#42803c;--hue-5:#ca4706;--hue-5-2:#c91243;--hue-6:#986801;--hue-6-2:#9a6a01}
@media (prefers-color-scheme:dark){
.hljs{--base:#282c34;--mono-1:#abb2bf;--mono-2:#818896;--mono-3:#5c6370;--hue-1:#56b6c2;--hue-2:#61aeee;--hue-3:#c678dd;--hue-4:#98c379;--hue-5:#e06c75;--hue-5-2:#be5046;--hue-6:#d19a66;--hue-6-2:#e6c07b}
}
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
    async function ds(t) {
      const n = await fetch(
        new URL(
          `../../${t}`,
          (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
            new URL("respec-dini.js", document.baseURI).href
        )
      );
      return await n.text();
    }
    const ps = new URL(
        "respec-highlight.js",
        (e && "SCRIPT" === e.tagName.toUpperCase() && e.src) ||
          new URL("respec-dini.js", document.baseURI).href
      ).href,
      hs = yt({ hint: "preload", href: ps, as: "script" });
    async function fs() {
      try {
        return (
          await Promise.resolve().then(function () {
            return wa;
          })
        ).default;
      } catch {
        return ds("worker/respec-worker.js");
      }
    }
    async function ms() {
      try {
        const e = await fetch(ps);
        if (e.ok) return await e.text();
      } catch {}
      return null;
    }
    document.head.appendChild(hs);
    const gs = (async function () {
      const [e, t] = await Promise.all([fs(), ms()]),
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
      gs.then(e => ({ worker: e }))
    );
    const bs = (function (e, t = 0) {
      const n = (function* (e, t) {
        for (;;) (yield `${e}:${t}`, t++);
      })(e, t);
      return () => n.next().value;
    })("highlight");
    async function ys(e) {
      e.setAttribute("aria-busy", "true");
      const t =
        ((n = e.classList),
        Array.from(n)
          .filter(e => "highlight" !== e && "nolinks" !== e)
          .map(e => e.toLowerCase()));
      var n;
      let r;
      try {
        r = await (async function (e, t) {
          const n = { action: "highlight", code: e, id: bs(), languages: t },
            r = await gs;
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
        })(e.innerText, t);
      } catch (e) {
        return void console.error(e);
      }
      const { language: o, value: i } = r;
      switch (e.localName) {
        case "pre":
          (e.classList.remove(o),
            (e.innerHTML = `<code class="hljs${o ? ` ${o}` : ""}">${i}</code>`),
            e.classList.length || e.removeAttribute("class"));
          break;
        case "code":
          ((e.innerHTML = i), e.classList.add("hljs"), o && e.classList.add(o));
      }
      e.setAttribute("aria-busy", "false");
    }
    var ws = Object.freeze({
      __proto__: null,
      name: "core/highlight",
      run: async function (e) {
        if (e.noHighlightCSS) return;
        const t = [
          ...document.querySelectorAll(
            "\n    pre:not(.idl):not(.nohighlight) > code:not(.nohighlight),\n    pre:not(.idl):not(.nohighlight),\n    code.highlight\n  "
          ),
        ].filter(e => "pre" !== e.localName || !e.querySelector("code"));
        if (!t.length) return;
        const n = t.filter(e => e.textContent.trim()).map(ys);
        (document.head.appendChild(lt`<style>
      ${us}
    </style>`),
          await Promise.all(n));
      },
    });
    const vs = "core/list-sorter";
    function ks(e) {
      const t = "ascending" === e ? 1 : -1;
      return ({ textContent: e }, { textContent: n }) =>
        t * e.trim().localeCompare(n.trim());
    }
    function xs(e, t) {
      return [...e.querySelectorAll(":scope > li")]
        .sort(ks(t))
        .reduce(
          (e, t) => (e.appendChild(t), e),
          document.createDocumentFragment()
        );
    }
    function $s(e, t) {
      return [...e.querySelectorAll(":scope > dt")]
        .sort(ks(t))
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
    var _s = Object.freeze({
      __proto__: null,
      name: vs,
      run: function () {
        const e = document.querySelectorAll("[data-sort]");
        for (const t of e) {
          let e;
          const n = t.dataset.sort || "ascending";
          switch (t.localName) {
            case "dl":
              e = $s(t, n);
              break;
            case "ol":
            case "ul":
              e = xs(t, n);
              break;
            default:
              Bt(`ReSpec can't sort ${t.localName} elements.`, vs, {
                elements: [t],
              });
          }
          if (e) {
            const n = document.createRange();
            (n.selectNodeContents(t), n.deleteContents(), t.appendChild(e));
          }
        }
      },
      sortDefinitionTerms: $s,
      sortListItems: xs,
    });
    var Es = String.raw`var:hover{text-decoration:underline;cursor:pointer}
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
    var Ss = Object.freeze({
      __proto__: null,
      name: "core/highlight-vars",
      run: async function (e) {
        if (!e.highlightVars) return;
        const t = document.createElement("style");
        ((t.textContent = Es), document.head.appendChild(t));
        const n = document.createElement("script");
        ((n.id = "respec-highlight-vars"),
          (n.textContent = await (async function () {
            try {
              return (
                await Promise.resolve().then(function () {
                  return va;
                })
              ).default;
            } catch {
              return ds("./src/core/highlight-vars.runtime.js");
            }
          })()),
          document.body.append(n),
          Yt("beforesave", e => {
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
    var Cs = String.raw`var{position:relative;cursor:pointer}
var[data-type]::after,var[data-type]::before{position:absolute;left:50%;top:-6px;opacity:0;transition:opacity .4s;pointer-events:none}
var[data-type]::before{content:"";transform:translateX(-50%);border-width:4px 6px 0 6px;border-style:solid;border-color:transparent;border-top-color:#222}
var[data-type]::after{content:attr(data-type);transform:translateX(-50%) translateY(-100%);background:#222;text-align:center;font-family:"Dank Mono","Fira Code",monospace;font-style:normal;padding:6px;border-radius:3px;color:#daca88;text-indent:0;font-weight:400}
var[data-type]:hover::after,var[data-type]:hover::before{opacity:1}`;
    var Ls = Object.freeze({
      __proto__: null,
      name: "core/data-type",
      run: function (e) {
        if (!e.highlightVars) return;
        const t = document.createElement("style");
        ((t.textContent = Cs), document.head.appendChild(t));
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
    var As = String.raw`:root{--assertion-border:#aaa;--assertion-bg:#eee;--assertion-text:black}
.assert{border-left:.5em solid #aaa;padding:.3em;border-color:#aaa;border-color:var(--assertion-border);background:#eee;background:var(--assertion-bg);color:#000;color:var(--assertion-text)}
@media (prefers-color-scheme:dark){
:root{--assertion-border:#444;--assertion-bg:var(--borderedblock-bg);--assertion-text:var(--text)}
}`;
    var Rs = Object.freeze({
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
            t.prepend(
              lt`<a href="https://infra.spec.whatwg.org/#assert">Assert</a>`,
              ": "
            ));
        }
        const t = document.createElement("style");
        ((t.textContent = As), document.head.appendChild(t));
      },
    });
    const Ts = "core/anchor-expander";
    function Ps(e, t, n) {
      const r = e.querySelector(".marker .self-link");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Ht(
          `Found matching element "${t}", but it has no title or marker.`,
          Ts,
          { title: "Missing title.", elements: [n] }
        );
      }
      const o = Ot(r);
      (n.append(...o.childNodes), n.classList.add("box-ref"));
    }
    function js(e, t, n) {
      const r = e.querySelector("figcaption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Ht(
          `Found matching figure "${t}", but figure is lacking a \`<figcaption>\`.`,
          Ts,
          { title: "Missing figcaption in referenced figure.", elements: [n] }
        );
      }
      const o = [...Ot(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("figno"), e)
      );
      (n.append(...o), n.classList.add("fig-ref"));
      const i = r.querySelector(".fig-title");
      !n.hasAttribute("title") && i && (n.title = _t(i.textContent));
    }
    function Ns(e, t, n) {
      if (!e.classList.contains("numbered")) return;
      const r = e.querySelector("caption");
      if (!r) {
        n.textContent = n.getAttribute("href");
        return void Ht(
          `Found matching table "${t}", but table is lacking a \`<caption>\`.`,
          Ts,
          { title: "Missing caption in referenced table.", elements: [n] }
        );
      }
      const o = [...Ot(r.querySelector(".self-link")).childNodes].map(
        e => (e.classList?.remove("tableno"), e)
      );
      (n.append(...o), n.classList.add("table-ref"));
      const i = r.querySelector(".table-title");
      !n.hasAttribute("title") && i && (n.title = _t(i.textContent));
    }
    function zs(e, t, n) {
      const r = e.querySelector("h6, h5, h4, h3, h2");
      if (r) (Os(r, n), Ds(r, n));
      else {
        n.textContent = n.getAttribute("href");
        Ht(
          "Found matching section, but the section was lacking a heading element.",
          Ts,
          { title: `No matching id in document: "${t}".`, elements: [n] }
        );
      }
    }
    function Os(e, t) {
      const n = e.querySelector(".self-link"),
        r = [...Ot(e).childNodes].filter(
          e => !e.classList || !e.classList.contains("self-link")
        );
      (t.append(...r),
        n && t.prepend("§ "),
        t.classList.add("sec-ref"),
        t.lastChild.nodeType === Node.TEXT_NODE &&
          (t.lastChild.textContent = t.lastChild.textContent.trimEnd()),
        t.querySelectorAll("a").forEach(e => {
          const t = Rt(e, "span");
          for (const e of [...t.attributes]) t.removeAttributeNode(e);
        }));
    }
    function Ds(e, t) {
      for (const n of ["dir", "lang"]) {
        if (t.hasAttribute(n)) continue;
        const r = e.closest(`[${n}]`);
        if (!r) continue;
        const o = t.closest(`[${n}]`);
        (o && o.getAttribute(n) === r.getAttribute(n)) ||
          t.setAttribute(n, r.getAttribute(n));
      }
    }
    var Is = Object.freeze({
      __proto__: null,
      name: Ts,
      run: function () {
        const e = [
          ...document.querySelectorAll(
            "a[href^='#']:not(.self-link):not([href$='the-empty-string'])"
          ),
        ].filter(e => "" === e.textContent.trim());
        for (const t of e) {
          const e = t.getAttribute("href").slice(1),
            n = document.getElementById(e);
          if (n) {
            switch (n.localName) {
              case "h6":
              case "h5":
              case "h4":
              case "h3":
              case "h2":
                Os(n, t);
                break;
              case "section":
                zs(n, e, t);
                break;
              case "figure":
                js(n, e, t);
                break;
              case "table":
                Ns(n, e, t);
                break;
              case "aside":
              case "div":
                Ps(n, e, t);
                break;
              default:
                t.textContent = t.getAttribute("href");
                Ht(
                  "ReSpec doesn't support expanding this kind of reference.",
                  Ts,
                  { title: `Can't expand "#${e}".`, elements: [t] }
                );
            }
            (Ds(n, t), t.normalize());
          } else {
            t.textContent = t.getAttribute("href");
            Ht(
              `Couldn't expand inline reference. The id "${e}" is not in the document.`,
              Ts,
              { title: `No matching id in document: ${e}.`, elements: [t] }
            );
          }
        }
      },
    });
    var qs = String.raw`dfn{cursor:pointer}
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
    function Ms(e) {
      const { id: t } = e,
        n = e.dataset.href || `#${t}`,
        r = document.querySelectorAll(`a[href="${n}"]:not(.index-term)`),
        o = `dfn-panel-for-${e.id}`,
        i = e.getAttribute("aria-label") || _t(e.textContent),
        s = lt`
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
            ? lt`<span
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
              return lt`<a
        href="${e}"
        class="marker idl-block"
        title="Jump to IDL declaration"
        >IDL</a
      >`;
            }
          }
          return null;
        })(e, r)}
      </div>
      <p><b>Referenced in:</b></p>
      ${(function (e, t) {
        if (!t.length)
          return lt`<ul>
      <li>Not referenced in this document.</li>
    </ul>`;
        const n = new Map();
        t.forEach((t, r) => {
          const o = t.id || `ref-for-${e}-${r + 1}`;
          t.id || (t.id = o);
          const i = (function (e) {
            const t = e.closest("section");
            if (!t) return null;
            const n = t.querySelector("h1, h2, h3, h4, h5, h6");
            return n ? `§ ${_t(n.textContent)}` : null;
          })(t);
          (n.get(i) || n.set(i, []).get(i)).push(o);
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
          o = e => lt`<li>
      ${r(e).map(
        e => lt`<a href="#${e.id}" title="${e.title}">${e.text}</a
          >${" "}`
      )}
    </li>`;
        return lt`<ul>
    ${[...n].map(o)}
  </ul>`;
      })(t, r)}
    </div>
  `;
      return s;
    }
    var Hs = Object.freeze({
      __proto__: null,
      name: "core/dfn-panel",
      run: async function () {
        document.head.insertBefore(
          lt`<style>
      ${qs}
    </style>`,
          document.querySelector("link")
        );
        const e = document.querySelectorAll(
            "dfn[id]:not([data-cite]), #index-defined-elsewhere .index-term"
          ),
          t = document.createDocumentFragment();
        for (const n of e)
          (t.append(Ms(n)),
            (n.tabIndex = 0),
            n.setAttribute("aria-haspopup", "dialog"));
        document.body.querySelector("script")
          ? document.body.querySelector("script").before(t)
          : document.body.append(t);
        const n = document.createElement("script");
        ((n.id = "respec-dfn-panel"),
          (n.textContent = await (async function () {
            try {
              return (
                await Promise.resolve().then(function () {
                  return ka;
                })
              ).default;
            } catch {
              return ds("./src/core/dfn-panel.runtime.js");
            }
          })()),
          document.body.append(n));
      },
    });
    const Bs = new Promise((e, t) => {});
    Et({
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
    const Fs = "rs-changelog",
      Ws = class extends HTMLElement {
        constructor() {
          (super(),
            (this.props = {
              from: this.getAttribute("from"),
              to: this.getAttribute("to") || "HEAD",
              repo: this.getAttribute("repo"),
              path: this.getAttribute("path"),
              filter:
                "function" == typeof window[this.getAttribute("filter")]
                  ? window[this.getAttribute("filter")]
                  : () => !0,
            }));
        }
        connectedCallback() {
          const { from: e, to: t, filter: n, repo: r, path: o } = this.props;
          lt.bind(this)`
      <ul>
      ${{
        any: Us(e, t, n, r, o)
          .then(e =>
            (async function (e, t) {
              const n = await Bs,
                r = t ? `https://github.com/${t}/` : n.repoURL;
              return e.map(e => {
                const [t, n = null] = e.message.split(/\(#(\d+)\)/, 2),
                  o = `${r}commit/${e.hash}`,
                  i =
                    n &&
                    lt` (<a href="${n ? `${r}pull/${n}` : null}">#${n}</a>)`;
                return lt`<li><a href="${o}">${t.trim()}</a>${i}</li>`;
              });
            })(e, r)
          )
          .catch(e => Ht(e.message, Fs, { elements: [this], cause: e }))
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
    `;
        }
      };
    async function Us(e, t, n, r, o) {
      let i;
      try {
        const s = await Bs;
        if (!s) throw new Error("`respecConfig.github` is not set");
        const a = r || s.fullName,
          l = new URL("commits", `${s.apiBase}/${a}/`);
        (l.searchParams.set("from", e),
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
    const Vs = [Object.freeze({ __proto__: null, element: Ws, name: Fs })];
    var Zs = Object.freeze({
      __proto__: null,
      name: "core/custom-elements/index",
      run: async function () {
        Vs.forEach(e => {
          customElements.define(e.name, e.element);
        });
        const e = Vs.map(e => e.name).join(", "),
          t = [...document.querySelectorAll(e)].map(
            e => new Promise(t => e.addEventListener("done", t, { once: !0 }))
          );
        await Promise.all(t);
      },
    });
    var Gs = Object.freeze({
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
    const Ks = "core/linter-rules/check-charset",
      Ys = Et({
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
    var Xs = Object.freeze({
      __proto__: null,
      name: Ks,
      run: function (e) {
        if (!e.lint?.["check-charset"]) return;
        const t = document.querySelectorAll("meta[charset]"),
          n = [];
        for (const e of t)
          n.push(e.getAttribute("charset").trim().toLowerCase());
        (n.includes("utf-8") && 1 === t.length) ||
          Bt(Ys.msg, Ks, { hint: Ys.hint, elements: [...t] });
      },
    });
    const Qs = "core/linter-rules/check-punctuation",
      Js = [".", ":", "!", "?"],
      ea = Js.map(e => `"${e}"`).join(", "),
      ta = Et({
        en: {
          msg: "`p` elements should end with a punctuation mark.",
          hint: `Please make sure \`p\` elements end with one of: ${ea}.`,
        },
        cs: {
          msg: "Elementy `p` by měly končit interpunkčním znaménkem.",
          hint: `Ujistěte se, že elementy \`p\` končí jedním z těchto znaků: ${ea}.`,
        },
      });
    var na = Object.freeze({
      __proto__: null,
      name: Qs,
      run: function (e) {
        if (!e.lint?.["check-punctuation"]) return;
        const t = new RegExp(`[${Js.join("")}\\]]$|^ *$`, "m"),
          n = [
            ...document.querySelectorAll("p:not(#back-to-top,#w3c-state)"),
          ].filter(e => !t.test(e.textContent.trim()));
        n.length && Bt(ta.msg, Qs, { hint: ta.hint, elements: n });
      },
    });
    const ra = "core/linter-rules/local-refs-exist",
      oa = Et({
        en: {
          msg: "Broken local reference found in document.",
          hint: "Please fix the links mentioned.",
        },
        cs: {
          msg: "V dokumentu byla nalezena nefunkční lokální reference.",
          hint: "Opravte prosím uvedené odkazy.",
        },
      });
    function ia(e) {
      const t = e.getAttribute("href").substring(1),
        n = e.ownerDocument;
      return !n.getElementById(t) && !n.getElementsByName(t).length;
    }
    var sa = Object.freeze({
      __proto__: null,
      name: ra,
      run: function (e) {
        if (!e.lint?.["local-refs-exist"]) return;
        const t = [...document.querySelectorAll("a[href^='#']")].filter(ia);
        t.length && Bt(oa.msg, ra, { hint: oa.hint, elements: t });
      },
    });
    const aa = "core/linter-rules/no-headingless-sections",
      la = Et({
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
    var ca = Object.freeze({
      __proto__: null,
      name: aa,
      run: function (e) {
        if (!e.lint?.["no-headingless-sections"]) return;
        const t = [
          ...document.querySelectorAll("section:not(.head,#abstract,#sotd)"),
        ].filter(
          ({ firstElementChild: e }) =>
            !e ||
            !(e.matches(".header-wrapper") || e instanceof HTMLHeadingElement)
        );
        t.length && Bt(la.msg, aa, { hint: la.hint, elements: t });
      },
    });
    const ua = "core/linter-rules/no-unused-vars",
      da = Et({
        en: {
          msg: "Variable was defined, but never used.",
          hint: "Add a `data-ignore-unused` attribute to the `<var>`.",
        },
        cs: {
          msg: "Proměnná byla definována, ale nikdy nebyla použita.",
          hint: "Přidejte atribut `data-ignore-unused` k elementu `<var>`.",
        },
      });
    var pa = Object.freeze({
      __proto__: null,
      name: ua,
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
            const t = _t(e.textContent);
            (o.get(t) || o.set(t, []).get(t)).push(e);
          }
          for (const e of o.values())
            1 !== e.length ||
              e[0].hasAttribute("data-ignore-unused") ||
              t.push(e[0]);
        }
        t.length && Bt(da.msg, ua, { hint: da.hint, elements: t });
      },
    });
    const ha = "core/linter-rules/privsec-section",
      fa = Et({
        en: {
          msg: "Document must have a 'Privacy and/or Security' Considerations section.",
          hint: "Add a privacy and/or security considerations section. See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
        },
        cs: {
          msg: "Dokument musí obsahovat sekci 'Zásady ochrany soukromí a/nebo bezpečnosti'.",
          hint: "Přidejte sekci o zásadách ochrany soukromí a/nebo bezpečnosti. Viz [Dotazník pro sebehodnocení](https://w3ctag.github.io/security-questionnaire/).",
        },
      });
    var ma = Object.freeze({
      __proto__: null,
      name: ha,
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
          Bt(fa.msg, ha, { hint: fa.hint });
      },
    });
    const ga = "core/linter-rules/no-http-props",
      ba = Et({
        en: {
          msg: Vt`Insecure URLs are not allowed in ${"[respecConfig]"}.`,
          hint: "Please change the following properties to 'https://': ",
        },
        zh: {
          msg: Vt`${"[respecConfig]"} 中不允许使用不安全的URL.`,
          hint: "请将以下属性更改为 https://：",
        },
        cs: {
          msg: Vt`V ${"[respecConfig]"} nejsou povoleny nezabezpečené URL adresy.`,
          hint: "Změňte prosím následující vlastnosti na 'https://': ",
        },
      });
    var ya = Object.freeze({
        __proto__: null,
        name: ga,
        run: function (e) {
          if (!e.lint?.["no-http-props"]) return;
          if (!parent.location.href.startsWith("http")) return;
          const t = Object.getOwnPropertyNames(e)
            .filter(t => (t.endsWith("URI") && e[t]) || "prevED" === t)
            .filter(t =>
              new URL(e[t], parent.location.href).href.startsWith("http://")
            );
          if (t.length) {
            const e = $t(t, e => Vt`${`[${e}]`}`);
            Bt(ba.msg, ga, { hint: ba.hint + e });
          }
        },
      }),
      wa = Object.freeze({
        __proto__: null,
        default:
          '// ReSpec Worker v1.0.0\n"use strict";\n// hljs is either inlined by core/worker.js (preferred) or loaded below via\n// importScripts as a fallback when the inline fetch was not possible.\nif (typeof self.hljs === "undefined" && self.RESPEC_HIGHLIGHT_URL) {\n  try {\n    importScripts(self.RESPEC_HIGHLIGHT_URL);\n  } catch (err) {\n    console.error("Network error loading highlighter", err);\n  }\n}\n\nself.addEventListener("message", ({ data: originalData }) => {\n  const data = Object.assign({}, originalData);\n  switch (data.action) {\n    case "highlight-load-lang": {\n      const { langURL, propName, lang } = data;\n      importScripts(langURL);\n      self.hljs.registerLanguage(lang, self[propName]);\n      break;\n    }\n    case "highlight": {\n      const { code } = data;\n      const langs = data.languages.length ? data.languages : undefined;\n      try {\n        const { value, language } = self.hljs.highlightAuto(code, langs);\n        Object.assign(data, { value, language });\n      } catch (err) {\n        console.error("Could not transform some code?", err);\n        // Post back the original code\n        Object.assign(data, { value: code, language: "" });\n      }\n      break;\n    }\n  }\n  self.postMessage(data);\n});\n',
      }),
      va = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\n\nif (document.respec) {\n  document.respec.ready.then(setupVarHighlighter);\n} else {\n  setupVarHighlighter();\n}\n\nfunction setupVarHighlighter() {\n  document\n    .querySelectorAll("var")\n    .forEach(varElem => varElem.addEventListener("click", highlightListener));\n}\n\nfunction highlightListener(ev) {\n  ev.stopPropagation();\n  const { target: varElem } = ev;\n  const hightligtedElems = highlightVars(varElem);\n  const resetListener = () => {\n    const hlColor = getHighlightColor(varElem);\n    hightligtedElems.forEach(el => removeHighlight(el, hlColor));\n    [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));\n  };\n  if (hightligtedElems.length) {\n    document.body.addEventListener("click", resetListener, { once: true });\n  }\n}\n\n// availability of highlight colors. colors from var.css\nconst HL_COLORS = new Map([\n  ["respec-hl-c1", true],\n  ["respec-hl-c2", true],\n  ["respec-hl-c3", true],\n  ["respec-hl-c4", true],\n  ["respec-hl-c5", true],\n  ["respec-hl-c6", true],\n  ["respec-hl-c7", true],\n]);\n\nfunction getHighlightColor(target) {\n  // return current colors if applicable\n  const { value } = target.classList;\n  const re = /respec-hl-\\w+/;\n  const activeClass = re.test(value) && value.match(re);\n  if (activeClass) return activeClass[0];\n\n  // first color preference\n  if (HL_COLORS.get("respec-hl-c1") === true) return "respec-hl-c1";\n\n  // otherwise get some other available color\n  return [...HL_COLORS.keys()].find(c => HL_COLORS.get(c)) || "respec-hl-c1";\n}\n\nfunction highlightVars(varElem) {\n  const textContent = norm(varElem.textContent);\n  const parent = varElem.closest(".algorithm, section");\n  const highlightColor = getHighlightColor(varElem);\n\n  const varsToHighlight = [...parent.querySelectorAll("var")].filter(\n    el =>\n      norm(el.textContent) === textContent &&\n      el.closest(".algorithm, section") === parent\n  );\n\n  // update availability of highlight color\n  const colorStatus = varsToHighlight[0].classList.contains("respec-hl");\n  HL_COLORS.set(highlightColor, colorStatus);\n\n  // highlight vars\n  if (colorStatus) {\n    varsToHighlight.forEach(el => removeHighlight(el, highlightColor));\n    return [];\n  } else {\n    varsToHighlight.forEach(el => addHighlight(el, highlightColor));\n  }\n  return varsToHighlight;\n}\n\nfunction removeHighlight(el, highlightColor) {\n  el.classList.remove("respec-hl", highlightColor);\n  // clean up empty class attributes so they don\'t come in export\n  if (!el.classList.length) el.removeAttribute("class");\n}\n\nfunction addHighlight(elem, highlightColor) {\n  elem.classList.add("respec-hl", highlightColor);\n}\n\n/**\n * Same as `norm` from src/core/utils, but our build process doesn\'t allow\n * imports in runtime scripts, so duplicated here.\n * @param {string} str\n */\nfunction norm(str) {\n  return str.trim().replace(/\\s+/g, " ");\n}\n})()',
      }),
      ka = Object.freeze({
        __proto__: null,
        default:
          '(() => {\n// @ts-check\nif (document.respec) {\n  document.respec.ready.then(setupPanel);\n} else {\n  setupPanel();\n}\n\nfunction setupPanel() {\n  const listener = panelListener();\n  document.body.addEventListener("keydown", listener);\n  document.body.addEventListener("click", listener);\n}\n\nfunction panelListener() {\n  /** @type {HTMLElement} */\n  let panel = null;\n  return event => {\n    const { target, type } = event;\n\n    if (!(target instanceof HTMLElement)) return;\n\n    // For keys, we only care about Enter key to activate the panel\n    // otherwise it\'s activated via a click.\n    if (type === "keydown" && event.key !== "Enter") return;\n\n    const action = deriveAction(event);\n\n    switch (action) {\n      case "show": {\n        hidePanel(panel);\n        /** @type {HTMLElement} */\n        const dfn = target.closest("dfn, .index-term");\n        panel = document.getElementById(`dfn-panel-for-${dfn.id}`);\n        const coords = deriveCoordinates(event);\n        displayPanel(dfn, panel, coords);\n        break;\n      }\n      case "dock": {\n        panel.style.left = null;\n        panel.style.top = null;\n        panel.classList.add("docked");\n        break;\n      }\n      case "hide": {\n        hidePanel(panel);\n        panel = null;\n        break;\n      }\n    }\n  };\n}\n\n/**\n * @param {MouseEvent|KeyboardEvent} event\n */\nfunction deriveCoordinates(event) {\n  const target = /** @type HTMLElement */ (event.target);\n\n  // We prevent synthetic AT clicks from putting\n  // the dialog in a weird place. The AT events sometimes\n  // lack coordinates, so they have clientX/Y = 0\n  const rect = target.getBoundingClientRect();\n  if (\n    event instanceof MouseEvent &&\n    event.clientX >= rect.left &&\n    event.clientY >= rect.top\n  ) {\n    // The event probably happened inside the bounding rect...\n    return { x: event.clientX, y: event.clientY };\n  }\n\n  // Offset to the middle of the element\n  const x = rect.x + rect.width / 2;\n  // Placed at the bottom of the element\n  const y = rect.y + rect.height;\n  return { x, y };\n}\n\n/**\n * @param {Event} event\n */\nfunction deriveAction(event) {\n  const target = /** @type {HTMLElement} */ (event.target);\n  const hitALink = !!target.closest("a");\n  if (target.closest("dfn:not([data-cite]), .index-term")) {\n    return hitALink ? "none" : "show";\n  }\n  if (target.closest(".dfn-panel")) {\n    if (hitALink) {\n      return target.classList.contains("self-link") ? "hide" : "dock";\n    }\n    const panel = target.closest(".dfn-panel");\n    return panel.classList.contains("docked") ? "hide" : "none";\n  }\n  if (document.querySelector(".dfn-panel:not([hidden])")) {\n    return "hide";\n  }\n  return "none";\n}\n\n/**\n * @param {HTMLElement} dfn\n * @param {HTMLElement} panel\n * @param {{ x: number, y: number }} clickPosition\n */\nfunction displayPanel(dfn, panel, { x, y }) {\n  panel.hidden = false;\n  // distance (px) between edge of panel and the pointing triangle (caret)\n  const MARGIN = 20;\n\n  const dfnRects = dfn.getClientRects();\n  // Find the `top` offset when the `dfn` can be spread across multiple lines\n  let closestTop = 0;\n  let minDiff = Infinity;\n  for (const rect of dfnRects) {\n    const { top, bottom } = rect;\n    const diffFromClickY = Math.abs((top + bottom) / 2 - y);\n    if (diffFromClickY < minDiff) {\n      minDiff = diffFromClickY;\n      closestTop = top;\n    }\n  }\n\n  const top = window.scrollY + closestTop + dfnRects[0].height;\n  const left = x - MARGIN;\n  panel.style.left = `${left}px`;\n  panel.style.top = `${top}px`;\n\n  // Find if the panel is flowing out of the window\n  const panelRect = panel.getBoundingClientRect();\n  const SCREEN_WIDTH = Math.min(window.innerWidth, window.screen.width);\n  if (panelRect.right > SCREEN_WIDTH) {\n    const newLeft = Math.max(MARGIN, x + MARGIN - panelRect.width);\n    const newCaretOffset = left - newLeft;\n    panel.style.left = `${newLeft}px`;\n    /** @type {HTMLElement} */\n    const caret = panel.querySelector(".caret");\n    caret.style.left = `${newCaretOffset}px`;\n  }\n\n  // As it\'s a dialog, we trap focus.\n  // TODO: when <dialog> becomes a implemented, we should really\n  // use that.\n  trapFocus(panel, dfn);\n}\n\n/**\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction trapFocus(panel, dfn) {\n  /** @type NodeListOf<HTMLAnchorElement> elements */\n  const anchors = panel.querySelectorAll("a[href]");\n  // No need to trap focus\n  if (!anchors.length) return;\n\n  // Move focus to first anchor element\n  const first = anchors.item(0);\n  first.focus();\n\n  const trapListener = createTrapListener(anchors, panel, dfn);\n  panel.addEventListener("keydown", trapListener);\n\n  // Hiding the panel releases the trap\n  const mo = new MutationObserver(records => {\n    const [record] = records;\n    const target = /** @type HTMLElement */ (record.target);\n    if (target.hidden) {\n      panel.removeEventListener("keydown", trapListener);\n      mo.disconnect();\n    }\n  });\n  mo.observe(panel, { attributes: true, attributeFilter: ["hidden"] });\n}\n\n/**\n *\n * @param {NodeListOf<HTMLAnchorElement>} anchors\n * @param {HTMLElement} panel\n * @param {HTMLElement} dfn\n * @returns\n */\nfunction createTrapListener(anchors, panel, dfn) {\n  const lastIndex = anchors.length - 1;\n  let currentIndex = 0;\n  return event => {\n    switch (event.key) {\n      // Hitting "Tab" traps us in a nice loop around elements.\n      case "Tab": {\n        event.preventDefault();\n        currentIndex += event.shiftKey ? -1 : +1;\n        if (currentIndex < 0) {\n          currentIndex = lastIndex;\n        } else if (currentIndex > lastIndex) {\n          currentIndex = 0;\n        }\n        anchors.item(currentIndex).focus();\n        break;\n      }\n\n      // Hitting "Enter" on an anchor releases the trap.\n      case "Enter":\n        hidePanel(panel);\n        break;\n\n      // Hitting "Escape" returns focus to dfn.\n      case "Escape":\n        hidePanel(panel);\n        dfn.focus();\n        return;\n    }\n  };\n}\n\n/** @param {HTMLElement} panel */\nfunction hidePanel(panel) {\n  if (!panel) return;\n  panel.hidden = true;\n  panel.classList.remove("docked");\n}\n})()',
      });
  })());
//# sourceMappingURL=respec-dini.js.map
