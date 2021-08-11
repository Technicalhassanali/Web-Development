var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function (u) {
    var c = /\blang(?:uage)?-([\w-]+)\b/i,
      n = 0,
      e = {},
      M = {
        manual: u.Prism && u.Prism.manual,
        disableWorkerMessageHandler:
          u.Prism && u.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof W
              ? new W(n.type, e(n.content), n.alias)
              : Array.isArray(n)
              ? n.map(e)
              : n
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/\u00a0/g, " ");
          },
          type: function (e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function (e) {
            return (
              e.__id || Object.defineProperty(e, "__id", { value: ++n }), e.__id
            );
          },
          clone: function t(e, r) {
            var a, n;
            switch (((r = r || {}), M.util.type(e))) {
              case "Object":
                if (((n = M.util.objId(e)), r[n])) return r[n];
                for (var i in ((a = {}), (r[n] = a), e))
                  e.hasOwnProperty(i) && (a[i] = t(e[i], r));
                return a;
              case "Array":
                return (
                  (n = M.util.objId(e)),
                  r[n]
                    ? r[n]
                    : ((a = []),
                      (r[n] = a),
                      e.forEach(function (e, n) {
                        a[n] = t(e, r);
                      }),
                      a)
                );
              default:
                return e;
            }
          },
          getLanguage: function (e) {
            for (; e && !c.test(e.className); ) e = e.parentElement;
            return e
              ? (e.className.match(c) || [, "none"])[1].toLowerCase()
              : "none";
          },
          currentScript: function () {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error();
            } catch (e) {
              var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(e.stack) || [])[1];
              if (n) {
                var t = document.getElementsByTagName("script");
                for (var r in t) if (t[r].src == n) return t[r];
              }
              return null;
            }
          },
          isActive: function (e, n, t) {
            for (var r = "no-" + n; e; ) {
              var a = e.classList;
              if (a.contains(n)) return !0;
              if (a.contains(r)) return !1;
              e = e.parentElement;
            }
            return !!t;
          },
        },
        languages: {
          plain: e,
          plaintext: e,
          text: e,
          txt: e,
          extend: function (e, n) {
            var t = M.util.clone(M.languages[e]);
            for (var r in n) t[r] = n[r];
            return t;
          },
          insertBefore: function (t, e, n, r) {
            var a = (r = r || M.languages)[t],
              i = {};
            for (var l in a)
              if (a.hasOwnProperty(l)) {
                if (l == e)
                  for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o]);
                n.hasOwnProperty(l) || (i[l] = a[l]);
              }
            var s = r[t];
            return (
              (r[t] = i),
              M.languages.DFS(M.languages, function (e, n) {
                n === s && e != t && (this[e] = i);
              }),
              i
            );
          },
          DFS: function e(n, t, r, a) {
            a = a || {};
            var i = M.util.objId;
            for (var l in n)
              if (n.hasOwnProperty(l)) {
                t.call(n, l, n[l], r || l);
                var o = n[l],
                  s = M.util.type(o);
                "Object" !== s || a[i(o)]
                  ? "Array" !== s || a[i(o)] || ((a[i(o)] = !0), e(o, t, l, a))
                  : ((a[i(o)] = !0), e(o, t, null, a));
              }
          },
        },
        plugins: {},
        highlightAll: function (e, n) {
          M.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function (e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          M.hooks.run("before-highlightall", r),
            (r.elements = Array.prototype.slice.apply(
              r.container.querySelectorAll(r.selector)
            )),
            M.hooks.run("before-all-elements-highlight", r);
          for (var a, i = 0; (a = r.elements[i++]); )
            M.highlightElement(a, !0 === n, r.callback);
        },
        highlightElement: function (e, n, t) {
          var r = M.util.getLanguage(e),
            a = M.languages[r];
          e.className =
            e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r;
          var i = e.parentElement;
          i &&
            "pre" === i.nodeName.toLowerCase() &&
            (i.className =
              i.className.replace(c, "").replace(/\s+/g, " ") +
              " language-" +
              r);
          var l = { element: e, language: r, grammar: a, code: e.textContent };
          function o(e) {
            (l.highlightedCode = e),
              M.hooks.run("before-insert", l),
              (l.element.innerHTML = l.highlightedCode),
              M.hooks.run("after-highlight", l),
              M.hooks.run("complete", l),
              t && t.call(l.element);
          }
          if (
            (M.hooks.run("before-sanity-check", l),
            (i = l.element.parentElement) &&
              "pre" === i.nodeName.toLowerCase() &&
              !i.hasAttribute("tabindex") &&
              i.setAttribute("tabindex", "0"),
            !l.code)
          )
            return M.hooks.run("complete", l), void (t && t.call(l.element));
          if ((M.hooks.run("before-highlight", l), l.grammar))
            if (n && u.Worker) {
              var s = new Worker(M.filename);
              (s.onmessage = function (e) {
                o(e.data);
              }),
                s.postMessage(
                  JSON.stringify({
                    language: l.language,
                    code: l.code,
                    immediateClose: !0,
                  })
                );
            } else o(M.highlight(l.code, l.grammar, l.language));
          else o(M.util.encode(l.code));
        },
        highlight: function (e, n, t) {
          var r = { code: e, grammar: n, language: t };
          return (
            M.hooks.run("before-tokenize", r),
            (r.tokens = M.tokenize(r.code, r.grammar)),
            M.hooks.run("after-tokenize", r),
            W.stringify(M.util.encode(r.tokens), r.language)
          );
        },
        tokenize: function (e, n) {
          var t = n.rest;
          if (t) {
            for (var r in t) n[r] = t[r];
            delete n.rest;
          }
          var a = new i();
          return (
            I(a, a.head, e),
            (function e(n, t, r, a, i, l) {
              for (var o in r)
                if (r.hasOwnProperty(o) && r[o]) {
                  var s = r[o];
                  s = Array.isArray(s) ? s : [s];
                  for (var u = 0; u < s.length; ++u) {
                    if (l && l.cause == o + "," + u) return;
                    var c = s[u],
                      g = c.inside,
                      f = !!c.lookbehind,
                      h = !!c.greedy,
                      d = c.alias;
                    if (h && !c.pattern.global) {
                      var p = c.pattern.toString().match(/[imsuy]*$/)[0];
                      c.pattern = RegExp(c.pattern.source, p + "g");
                    }
                    for (
                      var v = c.pattern || c, m = a.next, y = i;
                      m !== t.tail && !(l && y >= l.reach);
                      y += m.value.length, m = m.next
                    ) {
                      var b = m.value;
                      if (t.length > n.length) return;
                      if (!(b instanceof W)) {
                        var k,
                          x = 1;
                        if (h) {
                          if (!(k = z(v, y, n, f))) break;
                          var w = k.index,
                            A = k.index + k[0].length,
                            P = y;
                          for (P += m.value.length; P <= w; )
                            (m = m.next), (P += m.value.length);
                          if (
                            ((P -= m.value.length),
                            (y = P),
                            m.value instanceof W)
                          )
                            continue;
                          for (
                            var E = m;
                            E !== t.tail &&
                            (P < A || "string" == typeof E.value);
                            E = E.next
                          )
                            x++, (P += E.value.length);
                          x--, (b = n.slice(y, P)), (k.index -= y);
                        } else if (!(k = z(v, 0, b, f))) continue;
                        var w = k.index,
                          S = k[0],
                          O = b.slice(0, w),
                          L = b.slice(w + S.length),
                          N = y + b.length;
                        l && N > l.reach && (l.reach = N);
                        var j = m.prev;
                        O && ((j = I(t, j, O)), (y += O.length)), q(t, j, x);
                        var C = new W(o, g ? M.tokenize(S, g) : S, d, S);
                        if (((m = I(t, j, C)), L && I(t, m, L), 1 < x)) {
                          var _ = { cause: o + "," + u, reach: N };
                          e(n, t, r, m.prev, y, _),
                            l && _.reach > l.reach && (l.reach = _.reach);
                        }
                      }
                    }
                  }
                }
            })(e, a, n, a.head, 0),
            (function (e) {
              var n = [],
                t = e.head.next;
              for (; t !== e.tail; ) n.push(t.value), (t = t.next);
              return n;
            })(a)
          );
        },
        hooks: {
          all: {},
          add: function (e, n) {
            var t = M.hooks.all;
            (t[e] = t[e] || []), t[e].push(n);
          },
          run: function (e, n) {
            var t = M.hooks.all[e];
            if (t && t.length) for (var r, a = 0; (r = t[a++]); ) r(n);
          },
        },
        Token: W,
      };
    function W(e, n, t, r) {
      (this.type = e),
        (this.content = n),
        (this.alias = t),
        (this.length = 0 | (r || "").length);
    }
    function z(e, n, t, r) {
      e.lastIndex = n;
      var a = e.exec(t);
      if (a && r && a[1]) {
        var i = a[1].length;
        (a.index += i), (a[0] = a[0].slice(i));
      }
      return a;
    }
    function i() {
      var e = { value: null, prev: null, next: null },
        n = { value: null, prev: e, next: null };
      (e.next = n), (this.head = e), (this.tail = n), (this.length = 0);
    }
    function I(e, n, t) {
      var r = n.next,
        a = { value: t, prev: n, next: r };
      return (n.next = a), (r.prev = a), e.length++, a;
    }
    function q(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
      ((n.next = r).prev = n), (e.length -= a);
    }
    if (
      ((u.Prism = M),
      (W.stringify = function n(e, t) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) {
          var r = "";
          return (
            e.forEach(function (e) {
              r += n(e, t);
            }),
            r
          );
        }
        var a = {
            type: e.type,
            content: n(e.content, t),
            tag: "span",
            classes: ["token", e.type],
            attributes: {},
            language: t,
          },
          i = e.alias;
        i &&
          (Array.isArray(i)
            ? Array.prototype.push.apply(a.classes, i)
            : a.classes.push(i)),
          M.hooks.run("wrap", a);
        var l = "";
        for (var o in a.attributes)
          l +=
            " " +
            o +
            '="' +
            (a.attributes[o] || "").replace(/"/g, "&quot;") +
            '"';
        return (
          "<" +
          a.tag +
          ' class="' +
          a.classes.join(" ") +
          '"' +
          l +
          ">" +
          a.content +
          "</" +
          a.tag +
          ">"
        );
      }),
      !u.document)
    )
      return (
        u.addEventListener &&
          (M.disableWorkerMessageHandler ||
            u.addEventListener(
              "message",
              function (e) {
                var n = JSON.parse(e.data),
                  t = n.language,
                  r = n.code,
                  a = n.immediateClose;
                u.postMessage(M.highlight(r, M.languages[t], t)),
                  a && u.close();
              },
              !1
            )),
        M
      );
    var t = M.util.currentScript();
    function r() {
      M.manual || M.highlightAll();
    }
    if (
      (t &&
        ((M.filename = t.src),
        t.hasAttribute("data-manual") && (M.manual = !0)),
      !M.manual)
    ) {
      var a = document.readyState;
      "loading" === a || ("interactive" === a && t && t.defer)
        ? document.addEventListener("DOMContentLoaded", r)
        : window.requestAnimationFrame
        ? window.requestAnimationFrame(r)
        : window.setTimeout(r, 16);
    }
    return M;
  })(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism);
(Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: {
    pattern:
      /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
      },
      string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/,
      name: /[^\s<>'"]+/,
    },
  },
  cdata: /<!\[CDATA\[[\s\S]*?\]\]>/i,
  tag: {
    pattern:
      /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
      },
      "special-attr": [],
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
        },
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s>\/]+/,
        inside: { namespace: /^[^\s>\/:]+:/ },
      },
    },
  },
  entity: [
    { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
    /&#x?[\da-f]{1,8};/i,
  ],
}),
  (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
    Prism.languages.markup.entity),
  (Prism.languages.markup.doctype.inside["internal-subset"].inside =
    Prism.languages.markup),
  Prism.hooks.add("wrap", function (a) {
    "entity" === a.type &&
      (a.attributes.title = a.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (a, e) {
      var s = {};
      (s["language-" + e] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[e],
      }),
        (s.cdata = /^<!\[CDATA\[|\]\]>$/i);
      var t = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: s },
      };
      t["language-" + e] = { pattern: /[\s\S]+/, inside: Prism.languages[e] };
      var n = {};
      (n[a] = {
        pattern: RegExp(
          "(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(
            /__/g,
            function () {
              return a;
            }
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: t,
      }),
        Prism.languages.insertBefore("markup", "cdata", n);
    },
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
    value: function (a, e) {
      Prism.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          "(^|[\"'\\s])(?:" +
            a +
            ")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))",
          "i"
        ),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [e, "language-" + e],
                inside: Prism.languages[e],
              },
              punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
            },
          },
        },
      });
    },
  }),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.ssml = Prism.languages.xml),
  (Prism.languages.atom = Prism.languages.xml),
  (Prism.languages.rss = Prism.languages.xml);
!(function (s) {
  var e =
    /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  (s.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
      inside: {
        rule: /^@[\w-]+/,
        "selector-function-argument": {
          pattern:
            /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: !0,
          alias: "selector",
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: !0,
        },
      },
    },
    url: {
      pattern: RegExp(
        "\\burl\\((?:" + e.source + "|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)",
        "i"
      ),
      greedy: !0,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: { pattern: RegExp("^" + e.source + "$"), alias: "url" },
      },
    },
    selector: {
      pattern: RegExp(
        "(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" +
          e.source +
          ")*(?=\\s*\\{)"
      ),
      lookbehind: !0,
    },
    string: { pattern: e, greedy: !0 },
    property: {
      pattern:
        /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: !0,
    },
    important: /!important\b/i,
    function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
    punctuation: /[(){};:,]/,
  }),
    (s.languages.css.atrule.inside.rest = s.languages.css);
  var t = s.languages.markup;
  t && (t.tag.addInlined("style", "css"), t.tag.addAttribute("style", "css"));
})(Prism);
Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0,
  },
  "class-name": {
    pattern:
      /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ },
  },
  keyword:
    /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\b\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern:
        /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:prototype|constructor))/,
      lookbehind: !0,
    },
  ],
  keyword: [
    { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
    {
      pattern:
        /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0,
    },
  ],
  function:
    /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number:
    /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  operator:
    /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
})),
  (Prism.languages.javascript["class-name"][0].pattern =
    /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern:
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: Prism.languages.regex,
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/,
      },
    },
    "function-variable": {
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function",
    },
    parameter: [
      {
        pattern:
          /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore("javascript", "string", {
    hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
    "template-string": {
      pattern:
        /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": { pattern: /^`|`$/, alias: "string" },
        interpolation: {
          pattern:
            /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation",
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  }),
  Prism.languages.markup &&
    (Prism.languages.markup.tag.addInlined("script", "javascript"),
    Prism.languages.markup.tag.addAttribute(
      "on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)",
      "javascript"
    )),
  (Prism.languages.js = Prism.languages.javascript);
!(function (e) {
  var a,
    n = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
  (e.languages.css.selector = {
    pattern: e.languages.css.selector.pattern,
    lookbehind: !0,
    inside: (a = {
      "pseudo-element":
        /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
      "pseudo-class": /:[-\w]+/,
      class: /\.[-\w]+/,
      id: /#[-\w]+/,
      attribute: {
        pattern: RegExp("\\[(?:[^[\\]\"']|" + n.source + ")*\\]"),
        greedy: !0,
        inside: {
          punctuation: /^\[|\]$/,
          "case-sensitivity": {
            pattern: /(\s)[si]$/i,
            lookbehind: !0,
            alias: "keyword",
          },
          namespace: {
            pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
            lookbehind: !0,
            inside: { punctuation: /\|$/ },
          },
          "attr-name": {
            pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/,
            lookbehind: !0,
          },
          "attr-value": [
            n,
            {
              pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/,
              lookbehind: !0,
            },
          ],
          operator: /[|~*^$]?=/,
        },
      },
      "n-th": [
        {
          pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
          lookbehind: !0,
          inside: { number: /[\dn]+/, operator: /[+-]/ },
        },
        { pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i, lookbehind: !0 },
      ],
      combinator: />|\+|~|\|\|/,
      punctuation: /[(),]/,
    }),
  }),
    (e.languages.css.atrule.inside["selector-function-argument"].inside = a),
    e.languages.insertBefore("css", "property", {
      variable: {
        pattern:
          /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
        lookbehind: !0,
      },
    });
  var r = { pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/, lookbehind: !0 },
    i = { pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/, lookbehind: !0 };
  e.languages.insertBefore("css", "function", {
    operator: { pattern: /(\s)[+\-*\/](?=\s)/, lookbehind: !0 },
    hexcode: { pattern: /\B#[\da-f]{3,8}\b/i, alias: "color" },
    color: [
      {
        pattern:
          /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
        lookbehind: !0,
      },
      {
        pattern:
          /\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
        inside: {
          unit: r,
          number: i,
          function: /[\w-]+(?=\()/,
          punctuation: /[(),]/,
        },
      },
    ],
    entity: /\\[\da-f]{1,8}/i,
    unit: r,
    number: i,
  });
})(Prism);
!(function (i) {
  i.languages.diff = {
    coord: [/^(?:\*{3}|-{3}|\+{3}).*$/m, /^@@.*@@$/m, /^\d.*$/m],
  };
  var r = {
    "deleted-sign": "-",
    "deleted-arrow": "<",
    "inserted-sign": "+",
    "inserted-arrow": ">",
    unchanged: " ",
    diff: "!",
  };
  Object.keys(r).forEach(function (e) {
    var n = r[e],
      a = [];
    /^\w+$/.test(e) || a.push(/\w+/.exec(e)[0]),
      "diff" === e && a.push("bold"),
      (i.languages.diff[e] = {
        pattern: RegExp("^(?:[" + n + "].*(?:\r\n?|\n|(?![\\s\\S])))+", "m"),
        alias: a,
        inside: {
          line: { pattern: /(.)(?=[\s\S]).*(?:\r\n?|\n)?/, lookbehind: !0 },
          prefix: { pattern: /[\s\S]/, alias: /\w+/.exec(e)[0] },
        },
      });
  }),
    Object.defineProperty(i.languages.diff, "PREFIXES", { value: r });
})(Prism);
!(function (h) {
  function v(e, n) {
    return "___" + e.toUpperCase() + n + "___";
  }
  Object.defineProperties((h.languages["markup-templating"] = {}), {
    buildPlaceholders: {
      value: function (a, r, e, o) {
        if (a.language === r) {
          var c = (a.tokenStack = []);
          (a.code = a.code.replace(e, function (e) {
            if ("function" == typeof o && !o(e)) return e;
            for (var n, t = c.length; -1 !== a.code.indexOf((n = v(r, t))); )
              ++t;
            return (c[t] = e), n;
          })),
            (a.grammar = h.languages.markup);
        }
      },
    },
    tokenizePlaceholders: {
      value: function (p, k) {
        if (p.language === k && p.tokenStack) {
          p.grammar = h.languages[k];
          var m = 0,
            d = Object.keys(p.tokenStack);
          !(function e(n) {
            for (var t = 0; t < n.length && !(m >= d.length); t++) {
              var a = n[t];
              if (
                "string" == typeof a ||
                (a.content && "string" == typeof a.content)
              ) {
                var r = d[m],
                  o = p.tokenStack[r],
                  c = "string" == typeof a ? a : a.content,
                  i = v(k, r),
                  u = c.indexOf(i);
                if (-1 < u) {
                  ++m;
                  var g = c.substring(0, u),
                    l = new h.Token(
                      k,
                      h.tokenize(o, p.grammar),
                      "language-" + k,
                      o
                    ),
                    s = c.substring(u + i.length),
                    f = [];
                  g && f.push.apply(f, e([g])),
                    f.push(l),
                    s && f.push.apply(f, e([s])),
                    "string" == typeof a
                      ? n.splice.apply(n, [t, 1].concat(f))
                      : (a.content = f);
                }
              } else a.content && e(a.content);
            }
            return n;
          })(p.tokens);
        }
      },
    },
  });
})(Prism);
!(function (a) {
  var e = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
    t = [
      { pattern: /\b(?:false|true)\b/i, alias: "boolean" },
      { pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i, greedy: !0, lookbehind: !0 },
      {
        pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
        greedy: !0,
        lookbehind: !0,
      },
      /\b(?:null)\b/i,
      /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/,
    ],
    i =
      /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    n =
      /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
    s = /[{}\[\](),:;]/;
  a.languages.php = {
    delimiter: { pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i, alias: "important" },
    comment: e,
    variable: /\$+(?:\w+\b|(?=\{))/i,
    package: {
      pattern:
        /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      lookbehind: !0,
      inside: { punctuation: /\\/ },
    },
    "class-name-definition": {
      pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
      lookbehind: !0,
      alias: "class-name",
    },
    "function-definition": {
      pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
      lookbehind: !0,
      alias: "function",
    },
    keyword: [
      {
        pattern:
          /(\(\s*)\b(?:bool|boolean|int|integer|float|string|object|array)\b(?=\s*\))/i,
        alias: "type-casting",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern:
          /([(,?]\s*)\b(?:bool|int|float|string|object|array(?!\s*\()|mixed|self|static|callable|iterable|(?:null|false)(?=\s*\|))\b(?=\s*\$)/i,
        alias: "type-hint",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern: /([(,?]\s*[\w|]\|\s*)(?:null|false)\b(?=\s*\$)/i,
        alias: "type-hint",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern:
          /(\)\s*:\s*(?:\?\s*)?)\b(?:bool|int|float|string|object|void|array(?!\s*\()|mixed|self|static|callable|iterable|(?:null|false)(?=\s*\|))\b/i,
        alias: "return-type",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern: /(\)\s*:\s*(?:\?\s*)?[\w|]\|\s*)(?:null|false)\b/i,
        alias: "return-type",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern:
          /\b(?:bool|int|float|string|object|void|array(?!\s*\()|mixed|iterable|(?:null|false)(?=\s*\|))\b/i,
        alias: "type-declaration",
        greedy: !0,
      },
      {
        pattern: /(\|\s*)(?:null|false)\b/i,
        alias: "type-declaration",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern: /\b(?:parent|self|static)(?=\s*::)/i,
        alias: "static-context",
        greedy: !0,
      },
      { pattern: /(\byield\s+)from\b/i, lookbehind: !0 },
      /\bclass\b/i,
      {
        pattern:
          /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|match|new|or|parent|print|private|protected|public|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
        lookbehind: !0,
      },
    ],
    "argument-name": {
      pattern: /([(,]\s+)\b[a-z_]\w*(?=\s*:(?!:))/i,
      lookbehind: !0,
    },
    "class-name": [
      {
        pattern:
          /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
        greedy: !0,
        lookbehind: !0,
      },
      { pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i, greedy: !0, lookbehind: !0 },
      { pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i, greedy: !0 },
      {
        pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
        alias: "class-name-fully-qualified",
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
      },
      {
        pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
        alias: "class-name-fully-qualified",
        greedy: !0,
        inside: { punctuation: /\\/ },
      },
      {
        pattern:
          /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
        alias: "class-name-fully-qualified",
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
      },
      {
        pattern: /\b[a-z_]\w*(?=\s*\$)/i,
        alias: "type-declaration",
        greedy: !0,
      },
      {
        pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
        alias: ["class-name-fully-qualified", "type-declaration"],
        greedy: !0,
        inside: { punctuation: /\\/ },
      },
      { pattern: /\b[a-z_]\w*(?=\s*::)/i, alias: "static-context", greedy: !0 },
      {
        pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
        alias: ["class-name-fully-qualified", "static-context"],
        greedy: !0,
        inside: { punctuation: /\\/ },
      },
      {
        pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
        alias: "type-hint",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
        alias: ["class-name-fully-qualified", "type-hint"],
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
      },
      {
        pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
        alias: "return-type",
        greedy: !0,
        lookbehind: !0,
      },
      {
        pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
        alias: ["class-name-fully-qualified", "return-type"],
        greedy: !0,
        lookbehind: !0,
        inside: { punctuation: /\\/ },
      },
    ],
    constant: t,
    function: {
      pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
      lookbehind: !0,
      inside: { punctuation: /\\/ },
    },
    property: { pattern: /(->\s*)\w+/, lookbehind: !0 },
    number: i,
    operator: n,
    punctuation: s,
  };
  var l = {
      pattern:
        /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
      lookbehind: !0,
      inside: a.languages.php,
    },
    r = [
      {
        pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
        alias: "nowdoc-string",
        greedy: !0,
        inside: {
          delimiter: {
            pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
            alias: "symbol",
            inside: { punctuation: /^<<<'?|[';]$/ },
          },
        },
      },
      {
        pattern:
          /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
        alias: "heredoc-string",
        greedy: !0,
        inside: {
          delimiter: {
            pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
            alias: "symbol",
            inside: { punctuation: /^<<<"?|[";]$/ },
          },
          interpolation: l,
        },
      },
      {
        pattern: /`(?:\\[\s\S]|[^\\`])*`/,
        alias: "backtick-quoted-string",
        greedy: !0,
      },
      {
        pattern: /'(?:\\[\s\S]|[^\\'])*'/,
        alias: "single-quoted-string",
        greedy: !0,
      },
      {
        pattern: /"(?:\\[\s\S]|[^\\"])*"/,
        alias: "double-quoted-string",
        greedy: !0,
        inside: { interpolation: l },
      },
    ];
  a.languages.insertBefore("php", "variable", {
    string: r,
    attribute: {
      pattern:
        /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
      greedy: !0,
      inside: {
        "attribute-content": {
          pattern: /^(#\[)[\s\S]+(?=\]$)/,
          lookbehind: !0,
          inside: {
            comment: e,
            string: r,
            "attribute-class-name": [
              {
                pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                alias: "class-name",
                greedy: !0,
                lookbehind: !0,
              },
              {
                pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                alias: ["class-name", "class-name-fully-qualified"],
                greedy: !0,
                lookbehind: !0,
                inside: { punctuation: /\\/ },
              },
            ],
            constant: t,
            number: i,
            operator: n,
            punctuation: s,
          },
        },
        delimiter: { pattern: /^#\[|\]$/, alias: "punctuation" },
      },
    },
  }),
    a.hooks.add("before-tokenize", function (e) {
      if (/<\?/.test(e.code)) {
        a.languages["markup-templating"].buildPlaceholders(
          e,
          "php",
          /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/gi
        );
      }
    }),
    a.hooks.add("after-tokenize", function (e) {
      a.languages["markup-templating"].tokenizePlaceholders(e, "php");
    });
})(Prism);
!(function () {
  if (
    "undefined" != typeof Prism &&
    "undefined" != typeof document &&
    document.querySelector
  ) {
    var t,
      o = "line-numbers",
      s = "linkable-line-numbers",
      a = function () {
        if (void 0 === t) {
          var e = document.createElement("div");
          (e.style.fontSize = "13px"),
            (e.style.lineHeight = "1.5"),
            (e.style.padding = "0"),
            (e.style.border = "0"),
            (e.innerHTML = "&nbsp;<br />&nbsp;"),
            document.body.appendChild(e),
            (t = 38 === e.offsetHeight),
            document.body.removeChild(e);
        }
        return t;
      },
      l = !0,
      u = 0;
    Prism.hooks.add("before-sanity-check", function (e) {
      var t = e.element.parentElement;
      if (c(t)) {
        var n = 0;
        v(".line-highlight", t).forEach(function (e) {
          (n += e.textContent.length), e.parentNode.removeChild(e);
        }),
          n &&
            /^(?: \n)+$/.test(e.code.slice(-n)) &&
            (e.code = e.code.slice(0, -n));
      }
    }),
      Prism.hooks.add("complete", function e(t) {
        var n = t.element.parentElement;
        if (c(n)) {
          clearTimeout(u);
          var i = Prism.plugins.lineNumbers,
            r = t.plugins && t.plugins.lineNumbers;
          if (b(n, o) && i && !r) Prism.hooks.add("line-numbers", e);
          else d(n)(), (u = setTimeout(f, 1));
        }
      }),
      window.addEventListener("hashchange", f),
      window.addEventListener("resize", function () {
        v("pre")
          .filter(c)
          .map(function (e) {
            return d(e);
          })
          .forEach(y);
      });
  }
  function v(e, t) {
    return Array.prototype.slice.call((t || document).querySelectorAll(e));
  }
  function b(e, t) {
    return e.classList.contains(t);
  }
  function y(e) {
    e();
  }
  function c(e) {
    return (
      !(!e || !/pre/i.test(e.nodeName)) &&
      (!!e.hasAttribute("data-line") || !(!e.id || !Prism.util.isActive(e, s)))
    );
  }
  function d(u, e, c) {
    var t = (e = "string" == typeof e ? e : u.getAttribute("data-line") || "")
        .replace(/\s+/g, "")
        .split(",")
        .filter(Boolean),
      d = +u.getAttribute("data-line-offset") || 0,
      f = (a() ? parseInt : parseFloat)(getComputedStyle(u).lineHeight),
      p = Prism.util.isActive(u, o),
      n = u.querySelector("code"),
      h = p ? u : n || u,
      m = [],
      g =
        n && h != n
          ? (function (e, t) {
              var n = getComputedStyle(e),
                i = getComputedStyle(t);
              function r(e) {
                return +e.substr(0, e.length - 2);
              }
              return (
                t.offsetTop +
                r(i.borderTopWidth) +
                r(i.paddingTop) -
                r(n.paddingTop)
              );
            })(u, n)
          : 0;
    t.forEach(function (e) {
      var t = e.split("-"),
        n = +t[0],
        i = +t[1] || n,
        r =
          u.querySelector('.line-highlight[data-range="' + e + '"]') ||
          document.createElement("div");
      if (
        (m.push(function () {
          r.setAttribute("aria-hidden", "true"),
            r.setAttribute("data-range", e),
            (r.className = (c || "") + " line-highlight");
        }),
        p && Prism.plugins.lineNumbers)
      ) {
        var o = Prism.plugins.lineNumbers.getLine(u, n),
          s = Prism.plugins.lineNumbers.getLine(u, i);
        if (o) {
          var a = o.offsetTop + g + "px";
          m.push(function () {
            r.style.top = a;
          });
        }
        if (s) {
          var l = s.offsetTop - o.offsetTop + s.offsetHeight + "px";
          m.push(function () {
            r.style.height = l;
          });
        }
      } else
        m.push(function () {
          r.setAttribute("data-start", String(n)),
            n < i && r.setAttribute("data-end", String(i)),
            (r.style.top = (n - d - 1) * f + g + "px"),
            (r.textContent = new Array(i - n + 2).join(" \n"));
        });
      m.push(function () {
        h.appendChild(r);
      });
    });
    var i = u.id;
    if (p && Prism.util.isActive(u, s) && i) {
      b(u, s) ||
        m.push(function () {
          u.classList.add(s);
        });
      var r = parseInt(u.getAttribute("data-start") || "1");
      v(".line-numbers-rows > span", u).forEach(function (e, t) {
        var n = t + r;
        e.onclick = function () {
          var e = i + "." + n;
          (l = !1),
            (location.hash = e),
            setTimeout(function () {
              l = !0;
            }, 1);
        };
      });
    }
    return function () {
      m.forEach(y);
    };
  }
  function f() {
    var e = location.hash.slice(1);
    v(".temporary.line-highlight").forEach(function (e) {
      e.parentNode.removeChild(e);
    });
    var t = (e.match(/\.([\d,-]+)$/) || [, ""])[1];
    if (t && !document.getElementById(e)) {
      var n = e.slice(0, e.lastIndexOf(".")),
        i = document.getElementById(n);
      if (i)
        i.hasAttribute("data-line") || i.setAttribute("data-line", ""),
          d(i, t, "temporary ")(),
          l &&
            document
              .querySelector(".temporary.line-highlight")
              .scrollIntoView();
    }
  }
})();
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var o = "line-numbers",
      a = /\n(?!$)/g,
      e = (Prism.plugins.lineNumbers = {
        getLine: function (e, n) {
          if ("PRE" === e.tagName && e.classList.contains(o)) {
            var t = e.querySelector(".line-numbers-rows");
            if (t) {
              var i = parseInt(e.getAttribute("data-start"), 10) || 1,
                r = i + (t.children.length - 1);
              n < i && (n = i), r < n && (n = r);
              var s = n - i;
              return t.children[s];
            }
          }
        },
        resize: function (e) {
          u([e]);
        },
        assumeViewportIndependence: !0,
      }),
      n = void 0;
    window.addEventListener("resize", function () {
      (e.assumeViewportIndependence && n === window.innerWidth) ||
        ((n = window.innerWidth),
        u(Array.prototype.slice.call(document.querySelectorAll("pre." + o))));
    }),
      Prism.hooks.add("complete", function (e) {
        if (e.code) {
          var n = e.element,
            t = n.parentNode;
          if (
            t &&
            /pre/i.test(t.nodeName) &&
            !n.querySelector(".line-numbers-rows") &&
            Prism.util.isActive(n, o)
          ) {
            n.classList.remove(o), t.classList.add(o);
            var i,
              r = e.code.match(a),
              s = r ? r.length + 1 : 1,
              l = new Array(s + 1).join("<span></span>");
            (i = document.createElement("span")).setAttribute(
              "aria-hidden",
              "true"
            ),
              (i.className = "line-numbers-rows"),
              (i.innerHTML = l),
              t.hasAttribute("data-start") &&
                (t.style.counterReset =
                  "linenumber " +
                  (parseInt(t.getAttribute("data-start"), 10) - 1)),
              e.element.appendChild(i),
              u([t]),
              Prism.hooks.run("line-numbers", e);
          }
        }
      }),
      Prism.hooks.add("line-numbers", function (e) {
        (e.plugins = e.plugins || {}), (e.plugins.lineNumbers = !0);
      });
  }
  function u(e) {
    if (
      0 !=
      (e = e.filter(function (e) {
        var n = (function (e) {
          return e
            ? window.getComputedStyle
              ? getComputedStyle(e)
              : e.currentStyle || null
            : null;
        })(e)["white-space"];
        return "pre-wrap" === n || "pre-line" === n;
      })).length
    ) {
      var n = e
        .map(function (e) {
          var n = e.querySelector("code"),
            t = e.querySelector(".line-numbers-rows");
          if (n && t) {
            var i = e.querySelector(".line-numbers-sizer"),
              r = n.textContent.split(a);
            i ||
              (((i = document.createElement("span")).className =
                "line-numbers-sizer"),
              n.appendChild(i)),
              (i.innerHTML = "0"),
              (i.style.display = "block");
            var s = i.getBoundingClientRect().height;
            return (
              (i.innerHTML = ""),
              {
                element: e,
                lines: r,
                lineHeights: [],
                oneLinerHeight: s,
                sizer: i,
              }
            );
          }
        })
        .filter(Boolean);
      n.forEach(function (e) {
        var i = e.sizer,
          n = e.lines,
          r = e.lineHeights,
          s = e.oneLinerHeight;
        (r[n.length - 1] = void 0),
          n.forEach(function (e, n) {
            if (e && 1 < e.length) {
              var t = i.appendChild(document.createElement("span"));
              (t.style.display = "block"), (t.textContent = e);
            } else r[n] = s;
          });
      }),
        n.forEach(function (e) {
          for (
            var n = e.sizer, t = e.lineHeights, i = 0, r = 0;
            r < t.length;
            r++
          )
            void 0 === t[r] &&
              (t[r] = n.children[i++].getBoundingClientRect().height);
        }),
        n.forEach(function (e) {
          var n = e.sizer,
            t = e.element.querySelector(".line-numbers-rows");
          (n.style.display = "none"),
            (n.innerHTML = ""),
            e.lineHeights.forEach(function (e, n) {
              t.children[n].style.height = e + "px";
            });
        });
    }
  }
})();
!(function () {
  if ("undefined" != typeof Prism) {
    var e =
        /\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:=&@]+(?:\?[\w\-+%~/.:=?&!$'()*,;@]*)?(?:#[\w\-+%~/.:#=?&!$'()*,;@]*)?/,
      r = /\b\S+@[\w.]+[a-z]{2}/,
      a = /\[([^\]]+)\]\(([^)]+)\)/,
      l = ["comment", "url", "attr-value", "string"];
    (Prism.plugins.autolinker = {
      processGrammar: function (i) {
        i &&
          !i["url-link"] &&
          (Prism.languages.DFS(i, function (i, n, t) {
            -1 < l.indexOf(t) &&
              !Array.isArray(n) &&
              (n.pattern || (n = this[i] = { pattern: n }),
              (n.inside = n.inside || {}),
              "comment" == t && (n.inside["md-link"] = a),
              "attr-value" == t
                ? Prism.languages.insertBefore(
                    "inside",
                    "punctuation",
                    { "url-link": e },
                    n
                  )
                : (n.inside["url-link"] = e),
              (n.inside["email-link"] = r));
          }),
          (i["url-link"] = e),
          (i["email-link"] = r));
      },
    }),
      Prism.hooks.add("before-highlight", function (i) {
        Prism.plugins.autolinker.processGrammar(i.grammar);
      }),
      Prism.hooks.add("wrap", function (i) {
        if (/-link$/.test(i.type)) {
          i.tag = "a";
          var n = i.content;
          if ("email-link" == i.type && 0 != n.indexOf("mailto:"))
            n = "mailto:" + n;
          else if ("md-link" == i.type) {
            var t = i.content.match(a);
            (n = t[2]), (i.content = t[1]);
          }
          i.attributes.href = n;
          try {
            i.content = decodeURIComponent(i.content);
          } catch (i) {}
        }
      });
  }
})();

/*  CSS Documentation of Property
!(function () {
  if ("undefined" != typeof Prism) {
    if (
      (Prism.languages.css &&
        (Prism.languages.css.selector.pattern
          ? ((Prism.languages.css.selector.inside["pseudo-class"] = /:[\w-]+/),
            (Prism.languages.css.selector.inside["pseudo-element"] =
              /::[\w-]+/))
          : (Prism.languages.css.selector = {
              pattern: Prism.languages.css.selector,
              inside: {
                "pseudo-class": /:[\w-]+/,
                "pseudo-element": /::[\w-]+/,
              },
            })),
      Prism.languages.markup)
    ) {
      Prism.languages.markup.tag.inside.tag.inside["tag-id"] = /[\w-]+/;
      var s = {
        HTML: {
          a: 1,
          abbr: 1,
          acronym: 1,
          b: 1,
          basefont: 1,
          bdo: 1,
          big: 1,
          blink: 1,
          cite: 1,
          code: 1,
          dfn: 1,
          em: 1,
          kbd: 1,
          i: 1,
          rp: 1,
          rt: 1,
          ruby: 1,
          s: 1,
          samp: 1,
          small: 1,
          spacer: 1,
          strike: 1,
          strong: 1,
          sub: 1,
          sup: 1,
          time: 1,
          tt: 1,
          u: 1,
          var: 1,
          wbr: 1,
          noframes: 1,
          summary: 1,
          command: 1,
          dt: 1,
          dd: 1,
          figure: 1,
          figcaption: 1,
          center: 1,
          section: 1,
          nav: 1,
          article: 1,
          aside: 1,
          hgroup: 1,
          header: 1,
          footer: 1,
          address: 1,
          noscript: 1,
          isIndex: 1,
          main: 1,
          mark: 1,
          marquee: 1,
          meter: 1,
          menu: 1,
        },
        SVG: {
          animateColor: 1,
          animateMotion: 1,
          animateTransform: 1,
          glyph: 1,
          feBlend: 1,
          feColorMatrix: 1,
          feComponentTransfer: 1,
          feFuncR: 1,
          feFuncG: 1,
          feFuncB: 1,
          feFuncA: 1,
          feComposite: 1,
          feConvolveMatrix: 1,
          feDiffuseLighting: 1,
          feDisplacementMap: 1,
          feFlood: 1,
          feGaussianBlur: 1,
          feImage: 1,
          feMerge: 1,
          feMergeNode: 1,
          feMorphology: 1,
          feOffset: 1,
          feSpecularLighting: 1,
          feTile: 1,
          feTurbulence: 1,
          feDistantLight: 1,
          fePointLight: 1,
          feSpotLight: 1,
          linearGradient: 1,
          radialGradient: 1,
          altGlyph: 1,
          textPath: 1,
          tref: 1,
          altglyph: 1,
          textpath: 1,
          altglyphdef: 1,
          altglyphitem: 1,
          clipPath: 1,
          "color-profile": 1,
          cursor: 1,
          "font-face": 1,
          "font-face-format": 1,
          "font-face-name": 1,
          "font-face-src": 1,
          "font-face-uri": 1,
          foreignObject: 1,
          glyphRef: 1,
          hkern: 1,
          vkern: 1,
        },
        MathML: {},
      };
    }
    var a;
    Prism.hooks.add("wrap", function (e) {
      if (
        ("tag-id" == e.type ||
          ("property" == e.type && 0 != e.content.indexOf("-")) ||
          ("rule" == e.type && 0 != e.content.indexOf("@-")) ||
          ("pseudo-class" == e.type && 0 != e.content.indexOf(":-")) ||
          ("pseudo-element" == e.type && 0 != e.content.indexOf("::-")) ||
          ("attr-name" == e.type && 0 != e.content.indexOf("data-"))) &&
        -1 === e.content.indexOf("<") &&
        ("css" == e.language || "scss" == e.language || "markup" == e.language)
      ) {
        var t = "https://webplatform.github.io/docs/",
          n = e.content;
        if ("css" == e.language || "scss" == e.language)
          (t += "css/"),
            "property" == e.type
              ? (t += "properties/")
              : "rule" == e.type
              ? ((t += "atrules/"), (n = n.substring(1)))
              : "pseudo-class" == e.type
              ? ((t += "selectors/pseudo-classes/"), (n = n.substring(1)))
              : "pseudo-element" == e.type &&
                ((t += "selectors/pseudo-elements/"), (n = n.substring(2)));
        else if ("markup" == e.language)
          if ("tag-id" == e.type) {
            if (
              !(a =
                (function (e) {
                  var t = e.toLowerCase();
                  {
                    if (s.HTML[t]) return "html";
                    if (s.SVG[e]) return "svg";
                    if (s.MathML[e]) return "mathml";
                  }
                  if (0 !== s.HTML[t] && "undefined" != typeof document) {
                    var n = (document
                      .createElement(e)
                      .toString()
                      .match(/\[object HTML(.+)Element\]/) || [])[1];
                    if (n && "Unknown" != n) return (s.HTML[t] = 1), "html";
                  }
                  if (
                    (s.HTML[t] = 0) !== s.SVG[e] &&
                    "undefined" != typeof document
                  ) {
                    var a = (document
                      .createElementNS("http://www.w3.org/2000/svg", e)
                      .toString()
                      .match(/\[object SVG(.+)Element\]/) || [])[1];
                    if (a && "Unknown" != a) return (s.SVG[e] = 1), "svg";
                  }
                  if ((s.SVG[e] = 0) !== s.MathML[e] && 0 === e.indexOf("m"))
                    return (s.MathML[e] = 1), "mathml";
                  return (s.MathML[e] = 0), null;
                })(e.content) || a)
            )
              return;
            t += a + "/elements/";
          } else if ("attr-name" == e.type) {
            if (!a) return;
            t += a + "/attributes/";
          }
        (t += n),
          (e.tag = "a"),
          (e.attributes.href = t),
          (e.attributes.target = "_blank");
      }
    });
  }
})();

*/
!(function () {
  if ("undefined" != typeof Prism) {
    var a,
      t,
      e = "";
    (Prism.plugins.customClass = {
      add: function (n) {
        a = n;
      },
      map: function (s) {
        t =
          "function" == typeof s
            ? s
            : function (n) {
                return s[n] || n;
              };
      },
      prefix: function (n) {
        e = n || "";
      },
      apply: u,
    }),
      Prism.hooks.add("wrap", function (s) {
        if (a) {
          var n = a({ content: s.content, type: s.type, language: s.language });
          Array.isArray(n)
            ? s.classes.push.apply(s.classes, n)
            : n && s.classes.push(n);
        }
        (t || e) &&
          (s.classes = s.classes.map(function (n) {
            return u(n, s.language);
          }));
      });
  }
  function u(n, s) {
    return e + (t ? t(n, s) : n);
  }
})();
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    Element.prototype.matches ||
      (Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector);
    var o = {
        js: "javascript",
        py: "python",
        rb: "ruby",
        ps1: "powershell",
        psm1: "powershell",
        sh: "bash",
        bat: "batch",
        h: "c",
        tex: "latex",
      },
      h = "data-src-status",
      g = "loading",
      c = "loaded",
      u =
        "pre[data-src]:not([" +
        h +
        '="' +
        c +
        '"]):not([' +
        h +
        '="' +
        g +
        '"])',
      n = /\blang(?:uage)?-([\w-]+)\b/i;
    Prism.hooks.add("before-highlightall", function (e) {
      e.selector += ", " + u;
    }),
      Prism.hooks.add("before-sanity-check", function (e) {
        var t = e.element;
        if (t.matches(u)) {
          (e.code = ""), t.setAttribute(h, g);
          var i = t.appendChild(document.createElement("CODE"));
          i.textContent = "Loading…";
          var n = t.getAttribute("data-src"),
            s = e.language;
          if ("none" === s) {
            var a = (/\.(\w+)$/.exec(n) || [, "none"])[1];
            s = o[a] || a;
          }
          p(i, s), p(t, s);
          var r = Prism.plugins.autoloader;
          r && r.loadLanguages(s);
          var l = new XMLHttpRequest();
          l.open("GET", n, !0),
            (l.onreadystatechange = function () {
              4 == l.readyState &&
                (l.status < 400 && l.responseText
                  ? (t.setAttribute(h, c),
                    (i.textContent = l.responseText),
                    Prism.highlightElement(i))
                  : (t.setAttribute(h, "failed"),
                    400 <= l.status
                      ? (i.textContent = (function (e, t) {
                          return "✖ Error " + e + " while fetching file: " + t;
                        })(l.status, l.statusText))
                      : (i.textContent =
                          "✖ Error: File does not exist or is empty")));
            }),
            l.send(null);
        }
      });
    var e = !(Prism.plugins.fileHighlight = {
      highlight: function (e) {
        for (
          var t, i = (e || document).querySelectorAll(u), n = 0;
          (t = i[n++]);

        )
          Prism.highlightElement(t);
      },
    });
    Prism.fileHighlight = function () {
      e ||
        (console.warn(
          "Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."
        ),
        (e = !0)),
        Prism.plugins.fileHighlight.highlight.apply(this, arguments);
    };
  }
  function p(e, t) {
    var i = e.className;
    (i = i.replace(n, " ") + " language-" + t),
      (e.className = i.replace(/\s+/g, " ").trim());
  }
})();
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var i = [],
      l = {},
      d = function () {};
    Prism.plugins.toolbar = {};
    var e = (Prism.plugins.toolbar.registerButton = function (e, n) {
        var t;
        (t =
          "function" == typeof n
            ? n
            : function (e) {
                var t;
                return (
                  "function" == typeof n.onClick
                    ? (((t = document.createElement("button")).type = "button"),
                      t.addEventListener("click", function () {
                        n.onClick.call(this, e);
                      }))
                    : "string" == typeof n.url
                    ? ((t = document.createElement("a")).href = n.url)
                    : (t = document.createElement("span")),
                  n.className && t.classList.add(n.className),
                  (t.textContent = n.text),
                  t
                );
              }),
          e in l
            ? console.warn(
                'There is a button with the key "' + e + '" registered already.'
              )
            : i.push((l[e] = t));
      }),
      t = (Prism.plugins.toolbar.hook = function (a) {
        var e = a.element.parentNode;
        if (
          e &&
          /pre/i.test(e.nodeName) &&
          !e.parentNode.classList.contains("code-toolbar")
        ) {
          var t = document.createElement("div");
          t.classList.add("code-toolbar"),
            e.parentNode.insertBefore(t, e),
            t.appendChild(e);
          var r = document.createElement("div");
          r.classList.add("toolbar");
          var n = i,
            o = (function (e) {
              for (; e; ) {
                var t = e.getAttribute("data-toolbar-order");
                if (null != t)
                  return (t = t.trim()).length ? t.split(/\s*,\s*/g) : [];
                e = e.parentElement;
              }
            })(a.element);
          o &&
            (n = o.map(function (e) {
              return l[e] || d;
            })),
            n.forEach(function (e) {
              var t = e(a);
              if (t) {
                var n = document.createElement("div");
                n.classList.add("toolbar-item"),
                  n.appendChild(t),
                  r.appendChild(n);
              }
            }),
            t.appendChild(r);
        }
      });
    e("label", function (e) {
      var t = e.element.parentNode;
      if (t && /pre/i.test(t.nodeName) && t.hasAttribute("data-label")) {
        var n,
          a,
          r = t.getAttribute("data-label");
        try {
          a = document.querySelector("template#" + r);
        } catch (e) {}
        return (
          a
            ? (n = a.content)
            : (t.hasAttribute("data-url")
                ? ((n = document.createElement("a")).href =
                    t.getAttribute("data-url"))
                : (n = document.createElement("span")),
              (n.textContent = r)),
          n
        );
      }
    }),
      Prism.hooks.add("complete", t);
  }
})();

/*
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document)
    if (Prism.plugins.toolbar) {
      var i = {
        none: "Plain text",
        plain: "Plain text",
        plaintext: "Plain text",
        text: "Plain text",
        txt: "Plain text",
        html: "HTML",
        xml: "XML",
        svg: "SVG",
        mathml: "MathML",
        ssml: "SSML",
        rss: "RSS",
        css: "CSS",
        clike: "C-like",
        js: "JavaScript",
        abap: "ABAP",
        abnf: "ABNF",
        al: "AL",
        antlr4: "ANTLR4",
        g4: "ANTLR4",
        apacheconf: "Apache Configuration",
        apl: "APL",
        aql: "AQL",
        arff: "ARFF",
        asciidoc: "AsciiDoc",
        adoc: "AsciiDoc",
        aspnet: "ASP.NET (C#)",
        asm6502: "6502 Assembly",
        autohotkey: "AutoHotkey",
        autoit: "AutoIt",
        basic: "BASIC",
        bbcode: "BBcode",
        bnf: "BNF",
        rbnf: "RBNF",
        bsl: "BSL (1C:Enterprise)",
        oscript: "OneScript",
        csharp: "C#",
        cs: "C#",
        dotnet: "C#",
        cpp: "C++",
        cfscript: "CFScript",
        cfc: "CFScript",
        cil: "CIL",
        cmake: "CMake",
        cobol: "COBOL",
        coffee: "CoffeeScript",
        conc: "Concurnas",
        csp: "Content-Security-Policy",
        "css-extras": "CSS Extras",
        csv: "CSV",
        dataweave: "DataWeave",
        dax: "DAX",
        django: "Django/Jinja2",
        jinja2: "Django/Jinja2",
        "dns-zone-file": "DNS zone file",
        "dns-zone": "DNS zone file",
        dockerfile: "Docker",
        dot: "DOT (Graphviz)",
        gv: "DOT (Graphviz)",
        ebnf: "EBNF",
        editorconfig: "EditorConfig",
        ejs: "EJS",
        etlua: "Embedded Lua templating",
        erb: "ERB",
        "excel-formula": "Excel Formula",
        xlsx: "Excel Formula",
        xls: "Excel Formula",
        fsharp: "F#",
        "firestore-security-rules": "Firestore security rules",
        ftl: "FreeMarker Template Language",
        gml: "GameMaker Language",
        gamemakerlanguage: "GameMaker Language",
        gcode: "G-code",
        gdscript: "GDScript",
        gedcom: "GEDCOM",
        glsl: "GLSL",
        graphql: "GraphQL",
        hbs: "Handlebars",
        hs: "Haskell",
        hcl: "HCL",
        hlsl: "HLSL",
        http: "HTTP",
        hpkp: "HTTP Public-Key-Pins",
        hsts: "HTTP Strict-Transport-Security",
        ichigojam: "IchigoJam",
        "icu-message-format": "ICU Message Format",
        idr: "Idris",
        ignore: ".ignore",
        gitignore: ".gitignore",
        hgignore: ".hgignore",
        npmignore: ".npmignore",
        inform7: "Inform 7",
        javadoc: "JavaDoc",
        javadoclike: "JavaDoc-like",
        javastacktrace: "Java stack trace",
        jq: "JQ",
        jsdoc: "JSDoc",
        "js-extras": "JS Extras",
        json: "JSON",
        webmanifest: "Web App Manifest",
        json5: "JSON5",
        jsonp: "JSONP",
        jsstacktrace: "JS stack trace",
        "js-templates": "JS Templates",
        kts: "Kotlin Script",
        kt: "Kotlin",
        kumir: "KuMir (КуМир)",
        kum: "KuMir (КуМир)",
        latex: "LaTeX",
        tex: "TeX",
        context: "ConTeXt",
        lilypond: "LilyPond",
        ly: "LilyPond",
        emacs: "Lisp",
        elisp: "Lisp",
        "emacs-lisp": "Lisp",
        llvm: "LLVM IR",
        log: "Log file",
        lolcode: "LOLCODE",
        md: "Markdown",
        "markup-templating": "Markup templating",
        matlab: "MATLAB",
        mel: "MEL",
        mongodb: "MongoDB",
        moon: "MoonScript",
        n1ql: "N1QL",
        n4js: "N4JS",
        n4jsd: "N4JS",
        "nand2tetris-hdl": "Nand To Tetris HDL",
        naniscript: "Naninovel Script",
        nani: "Naninovel Script",
        nasm: "NASM",
        neon: "NEON",
        nginx: "nginx",
        nsis: "NSIS",
        objectivec: "Objective-C",
        objc: "Objective-C",
        ocaml: "OCaml",
        opencl: "OpenCL",
        openqasm: "OpenQasm",
        qasm: "OpenQasm",
        parigp: "PARI/GP",
        objectpascal: "Object Pascal",
        psl: "PATROL Scripting Language",
        pcaxis: "PC-Axis",
        px: "PC-Axis",
        peoplecode: "PeopleCode",
        pcode: "PeopleCode",
        php: "PHP",
        phpdoc: "PHPDoc",
        "php-extras": "PHP Extras",
        plsql: "PL/SQL",
        powerquery: "PowerQuery",
        pq: "PowerQuery",
        mscript: "PowerQuery",
        powershell: "PowerShell",
        promql: "PromQL",
        properties: ".properties",
        protobuf: "Protocol Buffers",
        purebasic: "PureBasic",
        pbfasm: "PureBasic",
        purs: "PureScript",
        py: "Python",
        qsharp: "Q#",
        qs: "Q#",
        q: "Q (kdb+ database)",
        qml: "QML",
        rkt: "Racket",
        jsx: "React JSX",
        tsx: "React TSX",
        renpy: "Ren'py",
        rpy: "Ren'py",
        rest: "reST (reStructuredText)",
        robotframework: "Robot Framework",
        robot: "Robot Framework",
        rb: "Ruby",
        sas: "SAS",
        sass: "Sass (Sass)",
        scss: "Sass (Scss)",
        "shell-session": "Shell session",
        "sh-session": "Shell session",
        shellsession: "Shell session",
        sml: "SML",
        smlnj: "SML/NJ",
        solidity: "Solidity (Ethereum)",
        sol: "Solidity (Ethereum)",
        "solution-file": "Solution file",
        sln: "Solution file",
        soy: "Soy (Closure Template)",
        sparql: "SPARQL",
        rq: "SPARQL",
        "splunk-spl": "Splunk SPL",
        sqf: "SQF: Status Quo Function (Arma 3)",
        sql: "SQL",
        iecst: "Structured Text (IEC 61131-3)",
        "t4-templating": "T4 templating",
        "t4-cs": "T4 Text Templates (C#)",
        t4: "T4 Text Templates (C#)",
        "t4-vb": "T4 Text Templates (VB)",
        tap: "TAP",
        tt2: "Template Toolkit 2",
        toml: "TOML",
        trig: "TriG",
        ts: "TypeScript",
        tsconfig: "TSConfig",
        uscript: "UnrealScript",
        uc: "UnrealScript",
        uri: "URI",
        url: "URL",
        vbnet: "VB.Net",
        vhdl: "VHDL",
        vim: "vim",
        "visual-basic": "Visual Basic",
        vba: "VBA",
        vb: "Visual Basic",
        wasm: "WebAssembly",
        wiki: "Wiki markup",
        wolfram: "Wolfram language",
        nb: "Mathematica Notebook",
        wl: "Wolfram language",
        xeoracube: "XeoraCube",
        "xml-doc": "XML doc (.net)",
        xojo: "Xojo (REALbasic)",
        xquery: "XQuery",
        yaml: "YAML",
        yml: "YAML",
        yang: "YANG",
      };
      Prism.plugins.toolbar.registerButton("show-language", function (e) {
        var a = e.element.parentNode;
        if (a && /pre/i.test(a.nodeName)) {
          var t,
            s =
              a.getAttribute("data-language") ||
              i[e.language] ||
              ((t = e.language)
                ? (t.substring(0, 1).toUpperCase() + t.substring(1)).replace(
                    /s(?=cript)/,
                    "S"
                  )
                : t);
          if (s) {
            var o = document.createElement("span");
            return (o.textContent = s), o;
          }
        }
      });
    } else console.warn("Show Languages plugin loaded before Toolbar plugin.");
})();
*/



!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var c = [];
    t(function (t) {
      if (t && t.meta && t.data) {
        if (t.meta.status && 400 <= t.meta.status)
          return "Error: " + (t.data.message || t.meta.status);
        if ("string" == typeof t.data.content)
          return "function" == typeof atob
            ? atob(t.data.content.replace(/\s/g, ""))
            : "Your browser cannot decode base64";
      }
      return null;
    }, "github"),
      t(function (t, e) {
        if (t && t.meta && t.data && t.data.files) {
          if (t.meta.status && 400 <= t.meta.status)
            return "Error: " + (t.data.message || t.meta.status);
          var n = t.data.files,
            a = e.getAttribute("data-filename");
          if (null == a)
            for (var r in n)
              if (n.hasOwnProperty(r)) {
                a = r;
                break;
              }
          return void 0 !== n[a]
            ? n[a].content
            : "Error: unknown or missing gist file " + a;
        }
        return null;
      }, "gist"),
      t(function (t) {
        return t && t.node && "string" == typeof t.data ? t.data : null;
      }, "bitbucket");
    var m = 0,
      p = "data-jsonp-status",
      g = "loading",
      h = "loaded",
      v = "failed",
      b =
        "pre[data-jsonp]:not([" +
        p +
        '="' +
        h +
        '"]):not([' +
        p +
        '="' +
        g +
        '"])';
    Prism.hooks.add("before-highlightall", function (t) {
      t.selector += ", " + b;
    }),
      Prism.hooks.add("before-sanity-check", function (t) {
        var r = t.element;
        if (r.matches(b)) {
          (t.code = ""), r.setAttribute(p, g);
          var i = r.appendChild(document.createElement("CODE"));
          i.textContent = "Loading…";
          var e = t.language;
          i.className = "language-" + e;
          var n = Prism.plugins.autoloader;
          n && n.loadLanguages(e);
          var a = r.getAttribute("data-adapter"),
            o = null;
          if (a) {
            if ("function" != typeof window[a])
              return (
                r.setAttribute(p, v),
                void (i.textContent = (function (t) {
                  return (
                    '✖ Error: JSONP adapter function "' + t + "\" doesn't exist"
                  );
                })(a))
              );
            o = window[a];
          }
          var u = "prismjsonp" + m++,
            s = document.createElement("a"),
            d = (s.href = r.getAttribute("data-jsonp"));
          s.href +=
            (s.search ? "&" : "?") +
            (r.getAttribute("data-callback") || "callback") +
            "=" +
            u;
          var f = setTimeout(function () {
              r.setAttribute(p, v),
                (i.textContent = (function (t) {
                  return "✖ Error: Timeout loading " + t;
                })(d));
            }, Prism.plugins.jsonphighlight.timeout),
            l = document.createElement("script");
          (l.src = s.href),
            (window[u] = function (t) {
              document.head.removeChild(l), clearTimeout(f), delete window[u];
              var e = null;
              if (o) e = o(t, r);
              else
                for (
                  var n = 0, a = c.length;
                  n < a && null === (e = c[n].adapter(t, r));
                  n++
                );
              null === e
                ? (r.setAttribute(p, v),
                  (i.textContent =
                    "✖ Error: Cannot parse response (perhaps you need an adapter function?)"))
                : (r.setAttribute(p, h),
                  (i.textContent = e),
                  Prism.highlightElement(i));
            }),
            document.head.appendChild(l);
        }
      }),
      (Prism.plugins.jsonphighlight = {
        timeout: 5e3,
        registerAdapter: t,
        removeAdapter: function (e) {
          if (("string" == typeof e && (e = n(e)), "function" == typeof e)) {
            var t = c.findIndex(function (t) {
              return t.adapter === e;
            });
            0 <= t && c.splice(t, 1);
          }
        },
        highlight: function (t) {
          for (
            var e, n = (t || document).querySelectorAll(b), a = 0;
            (e = n[a++]);

          )
            Prism.highlightElement(e);
        },
      });
  }
  function t(t, e) {
    (e = e || t.name),
      "function" != typeof t || n(t) || n(e) || c.push({ adapter: t, name: e });
  }
  function n(t) {
    if ("function" == typeof t) {
      for (var e = 0; (n = c[e++]); )
        if (n.adapter.valueOf() === t.valueOf()) return n.adapter;
    } else if ("string" == typeof t) {
      var n;
      for (e = 0; (n = c[e++]); ) if (n.name === t) return n.adapter;
    }
    return null;
  }
})();
"undefined" != typeof Prism &&
  Prism.hooks.add("wrap", function (e) {
    "keyword" === e.type && e.classes.push("keyword-" + e.content);
  });
"undefined" != typeof Prism &&
  "undefined" != typeof document &&
  Prism.hooks.add("before-sanity-check", function (e) {
    if (e.code) {
      var n = e.element.parentNode,
        o = /(?:^|\s)keep-initial-line-feed(?:\s|$)/;
      !n ||
        "pre" !== n.nodeName.toLowerCase() ||
        o.test(n.className) ||
        o.test(e.element.className) ||
        (e.code = e.code.replace(/^(?:\r?\n|\r)/, ""));
    }
  });
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var a =
        /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/g,
      c = /^#?((?:[\da-f]){3,4}|(?:[\da-f]{2}){3,4})$/i,
      l = [
        function (n) {
          var r = c.exec(n);
          if (r) {
            for (
              var o = 6 <= (n = r[1]).length ? 2 : 1,
                s = n.length / o,
                e = 1 == o ? 1 / 15 : 1 / 255,
                t = [],
                i = 0;
              i < s;
              i++
            ) {
              var a = parseInt(n.substr(i * o, o), 16);
              t.push(a * e);
            }
            return (
              3 == s && t.push(1),
              "rgba(" +
                t
                  .slice(0, 3)
                  .map(function (n) {
                    return String(Math.round(255 * n));
                  })
                  .join(",") +
                "," +
                String(Number(t[3].toFixed(3))) +
                ")"
            );
          }
        },
        function (n) {
          var r = new Option().style;
          return (r.color = n), r.color ? n : void 0;
        },
      ];
    Prism.hooks.add("wrap", function (n) {
      if ("color" === n.type || 0 <= n.classes.indexOf("color")) {
        for (
          var r, o = n.content, s = o.split(a).join(""), e = 0, t = l.length;
          e < t && !r;
          e++
        )
          r = l[e](s);
        if (!r) return;
        var i =
          '<span class="inline-color-wrapper"><span class="inline-color" style="background-color:' +
          r +
          ';"></span></span>';
        n.content = i + o;
      }
    });
  }
})();
!(function () {
  if (
    "undefined" != typeof Prism &&
    "undefined" != typeof document &&
    Function.prototype.bind
  ) {
    var n,
      s,
      l = {
        gradient: {
          create:
            ((n = {}),
            (s = function (e) {
              if (n[e]) return n[e];
              var s = e.match(
                  /^(\b|\B-[a-z]{1,10}-)((?:repeating-)?(?:linear|radial)-gradient)/
                ),
                t = s && s[1],
                i = s && s[2],
                a = e
                  .replace(
                    /^(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\(|\)$/g,
                    ""
                  )
                  .split(/\s*,\s*/);
              return 0 <= i.indexOf("linear")
                ? (n[e] = (function (e, s, t) {
                    var i = "180deg";
                    return (
                      /^(?:-?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|rad)|to\b|top|right|bottom|left)/.test(
                        t[0]
                      ) &&
                        (i = t.shift()).indexOf("to ") < 0 &&
                        (0 <= i.indexOf("top")
                          ? (i =
                              0 <= i.indexOf("left")
                                ? "to bottom right"
                                : 0 <= i.indexOf("right")
                                ? "to bottom left"
                                : "to bottom")
                          : 0 <= i.indexOf("bottom")
                          ? (i =
                              0 <= i.indexOf("left")
                                ? "to top right"
                                : 0 <= i.indexOf("right")
                                ? "to top left"
                                : "to top")
                          : 0 <= i.indexOf("left")
                          ? (i = "to right")
                          : 0 <= i.indexOf("right")
                          ? (i = "to left")
                          : e &&
                            (0 <= i.indexOf("deg")
                              ? (i = 90 - parseFloat(i) + "deg")
                              : 0 <= i.indexOf("rad") &&
                                (i = Math.PI / 2 - parseFloat(i) + "rad"))),
                      s + "(" + i + "," + t.join(",") + ")"
                    );
                  })(t, i, a))
                : 0 <= i.indexOf("radial")
                ? (n[e] = (function (e, s, t) {
                    if (t[0].indexOf("at") < 0) {
                      var i = "center",
                        a = "ellipse",
                        n = "farthest-corner";
                      if (
                        (/\bcenter|top|right|bottom|left\b|^\d+/.test(t[0]) &&
                          (i = t.shift().replace(/\s*-?\d+(?:rad|deg)\s*/, "")),
                        /\bcircle|ellipse|closest|farthest|contain|cover\b/.test(
                          t[0]
                        ))
                      ) {
                        var r = t.shift().split(/\s+/);
                        !r[0] ||
                          ("circle" !== r[0] && "ellipse" !== r[0]) ||
                          (a = r.shift()),
                          r[0] && (n = r.shift()),
                          "cover" === n
                            ? (n = "farthest-corner")
                            : "contain" === n && (n = "clothest-side");
                      }
                      return (
                        s +
                        "(" +
                        a +
                        " " +
                        n +
                        " at " +
                        i +
                        "," +
                        t.join(",") +
                        ")"
                      );
                    }
                    return s + "(" + t.join(",") + ")";
                  })(0, i, a))
                : (n[e] = i + "(" + a.join(",") + ")");
            }),
            function () {
              new Prism.plugins.Previewer(
                "gradient",
                function (e) {
                  return (
                    (this.firstChild.style.backgroundImage = ""),
                    (this.firstChild.style.backgroundImage = s(e)),
                    !!this.firstChild.style.backgroundImage
                  );
                },
                "*",
                function () {
                  this._elt.innerHTML = "<div></div>";
                }
              );
            }),
          tokens: {
            gradient: {
              pattern:
                /(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\((?:(?:rgb|hsl)a?\(.+?\)|[^\)])+\)/gi,
              inside: { function: /[\w-]+(?=\()/, punctuation: /[(),]/ },
            },
          },
          languages: {
            css: !0,
            less: !0,
            sass: [
              {
                lang: "sass",
                before: "punctuation",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
              {
                lang: "sass",
                before: "punctuation",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        angle: {
          create: function () {
            new Prism.plugins.Previewer(
              "angle",
              function (e) {
                var s,
                  t,
                  i = parseFloat(e),
                  a = e.match(/[a-z]+$/i);
                if (!i || !a) return !1;
                switch ((a = a[0])) {
                  case "deg":
                    s = 360;
                    break;
                  case "grad":
                    s = 400;
                    break;
                  case "rad":
                    s = 2 * Math.PI;
                    break;
                  case "turn":
                    s = 1;
                }
                return (
                  (t = (100 * i) / s),
                  (t %= 100),
                  this[(i < 0 ? "set" : "remove") + "Attribute"](
                    "data-negative",
                    ""
                  ),
                  (this.querySelector("circle").style.strokeDasharray =
                    Math.abs(t) + ",500"),
                  !0
                );
              },
              "*",
              function () {
                this._elt.innerHTML =
                  '<svg viewBox="0 0 64 64"><circle r="16" cy="32" cx="32"></circle></svg>';
              }
            );
          },
          tokens: {
            angle:
              /(?:\b|\B-|(?=\B\.))(?:\d+(?:\.\d+)?|\.\d+)(?:deg|g?rad|turn)\b/i,
          },
          languages: {
            css: !0,
            less: !0,
            markup: {
              lang: "markup",
              before: "punctuation",
              inside: "inside",
              root:
                Prism.languages.markup &&
                Prism.languages.markup.tag.inside["attr-value"],
            },
            sass: [
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
              {
                lang: "sass",
                before: "operator",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "func",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        color: {
          create: function () {
            new Prism.plugins.Previewer("color", function (e) {
              return (
                (this.style.backgroundColor = ""),
                (this.style.backgroundColor = e),
                !!this.style.backgroundColor
              );
            });
          },
          tokens: {
            color: [Prism.languages.css.hexcode].concat(
              Prism.languages.css.color
            ),
          },
          languages: {
            css: !1,
            less: !0,
            markup: {
              lang: "markup",
              before: "punctuation",
              inside: "inside",
              root:
                Prism.languages.markup &&
                Prism.languages.markup.tag.inside["attr-value"],
            },
            sass: [
              {
                lang: "sass",
                before: "punctuation",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
            ],
            scss: !1,
            stylus: [
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        easing: {
          create: function () {
            new Prism.plugins.Previewer(
              "easing",
              function (e) {
                var s = (e =
                  {
                    linear: "0,0,1,1",
                    ease: ".25,.1,.25,1",
                    "ease-in": ".42,0,1,1",
                    "ease-out": "0,0,.58,1",
                    "ease-in-out": ".42,0,.58,1",
                  }[e] || e).match(/-?(?:\d+(?:\.\d+)?|\.\d+)/g);
                if (4 !== s.length) return !1;
                (s = s.map(function (e, s) {
                  return 100 * (s % 2 ? 1 - e : e);
                })),
                  this.querySelector("path").setAttribute(
                    "d",
                    "M0,100 C" +
                      s[0] +
                      "," +
                      s[1] +
                      ", " +
                      s[2] +
                      "," +
                      s[3] +
                      ", 100,0"
                  );
                var t = this.querySelectorAll("line");
                return (
                  t[0].setAttribute("x2", s[0]),
                  t[0].setAttribute("y2", s[1]),
                  t[1].setAttribute("x2", s[2]),
                  t[1].setAttribute("y2", s[3]),
                  !0
                );
              },
              "*",
              function () {
                this._elt.innerHTML =
                  '<svg viewBox="-20 -20 140 140" width="100" height="100"><defs><marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth"><circle cx="2" cy="2" r="1.5" /></marker></defs><path d="M0,100 C20,50, 40,30, 100,0" /><line x1="0" y1="100" x2="20" y2="50" marker-start="url(#prism-previewer-easing-marker)" marker-end="url(#prism-previewer-easing-marker)" /><line x1="100" y1="0" x2="40" y2="30" marker-start="url(#prism-previewer-easing-marker)" marker-end="url(#prism-previewer-easing-marker)" /></svg>';
              }
            );
          },
          tokens: {
            easing: {
              pattern:
                /\bcubic-bezier\((?:-?(?:\d+(?:\.\d+)?|\.\d+),\s*){3}-?(?:\d+(?:\.\d+)?|\.\d+)\)\B|\b(?:linear|ease(?:-in)?(?:-out)?)(?=\s|[;}]|$)/i,
              inside: { function: /[\w-]+(?=\()/, punctuation: /[(),]/ },
            },
          },
          languages: {
            css: !0,
            less: !0,
            sass: [
              {
                lang: "sass",
                inside: "inside",
                before: "punctuation",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
        time: {
          create: function () {
            new Prism.plugins.Previewer(
              "time",
              function (e) {
                var s = parseFloat(e),
                  t = e.match(/[a-z]+$/i);
                return (
                  !(!s || !t) &&
                  ((t = t[0]),
                  (this.querySelector("circle").style.animationDuration =
                    2 * s + t),
                  !0)
                );
              },
              "*",
              function () {
                this._elt.innerHTML =
                  '<svg viewBox="0 0 64 64"><circle r="16" cy="32" cx="32"></circle></svg>';
              }
            );
          },
          tokens: { time: /(?:\b|\B-|(?=\B\.))(?:\d+(?:\.\d+)?|\.\d+)m?s\b/i },
          languages: {
            css: !0,
            less: !0,
            markup: {
              lang: "markup",
              before: "punctuation",
              inside: "inside",
              root:
                Prism.languages.markup &&
                Prism.languages.markup.tag.inside["attr-value"],
            },
            sass: [
              {
                lang: "sass",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["property-line"],
              },
              {
                lang: "sass",
                before: "operator",
                inside: "inside",
                root:
                  Prism.languages.sass && Prism.languages.sass["variable-line"],
              },
            ],
            scss: !0,
            stylus: [
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["property-declaration"].inside,
              },
              {
                lang: "stylus",
                before: "hexcode",
                inside: "rest",
                root:
                  Prism.languages.stylus &&
                  Prism.languages.stylus["variable-declaration"].inside,
              },
            ],
          },
        },
      },
      t = "token",
      i = "active",
      a = "flipped",
      r = function (e, s, t, i) {
        (this._elt = null),
          (this._type = e),
          (this._token = null),
          (this.updater = s),
          (this._mouseout = this.mouseout.bind(this)),
          (this.initializer = i);
        var a = this;
        t || (t = ["*"]),
          Array.isArray(t) || (t = [t]),
          t.forEach(function (e) {
            "string" != typeof e && (e = e.lang),
              r.byLanguages[e] || (r.byLanguages[e] = []),
              r.byLanguages[e].indexOf(a) < 0 && r.byLanguages[e].push(a);
          }),
          (r.byType[e] = this);
      };
    for (var e in ((r.prototype.init = function () {
      this._elt ||
        ((this._elt = document.createElement("div")),
        (this._elt.className = "prism-previewer prism-previewer-" + this._type),
        document.body.appendChild(this._elt),
        this.initializer && this.initializer());
    }),
    (r.prototype.isDisabled = function (e) {
      do {
        if (e.hasAttribute && e.hasAttribute("data-previewers"))
          return (
            -1 ===
            (e.getAttribute("data-previewers") || "")
              .split(/\s+/)
              .indexOf(this._type)
          );
      } while ((e = e.parentNode));
      return !1;
    }),
    (r.prototype.check = function (e) {
      if (!e.classList.contains(t) || !this.isDisabled(e)) {
        do {
          if (
            e.classList &&
            e.classList.contains(t) &&
            e.classList.contains(this._type)
          )
            break;
        } while ((e = e.parentNode));
        e && e !== this._token && ((this._token = e), this.show());
      }
    }),
    (r.prototype.mouseout = function () {
      this._token.removeEventListener("mouseout", this._mouseout, !1),
        (this._token = null),
        this.hide();
    }),
    (r.prototype.show = function () {
      if ((this._elt || this.init(), this._token))
        if (this.updater.call(this._elt, this._token.textContent)) {
          this._token.addEventListener("mouseout", this._mouseout, !1);
          var e = (function (e) {
            var s = e.getBoundingClientRect(),
              t = s.left,
              i = s.top,
              a = document.documentElement.getBoundingClientRect();
            return (
              (t -= a.left),
              {
                top: (i -= a.top),
                right: innerWidth - t - s.width,
                bottom: innerHeight - i - s.height,
                left: t,
                width: s.width,
                height: s.height,
              }
            );
          })(this._token);
          this._elt.classList.add(i),
            0 < e.top - this._elt.offsetHeight
              ? (this._elt.classList.remove(a),
                (this._elt.style.top = e.top + "px"),
                (this._elt.style.bottom = ""))
              : (this._elt.classList.add(a),
                (this._elt.style.bottom = e.bottom + "px"),
                (this._elt.style.top = "")),
            (this._elt.style.left = e.left + Math.min(200, e.width / 2) + "px");
        } else this.hide();
    }),
    (r.prototype.hide = function () {
      this._elt.classList.remove(i);
    }),
    (r.byLanguages = {}),
    (r.byType = {}),
    (r.initEvents = function (e, s) {
      var t = [];
      r.byLanguages[s] && (t = t.concat(r.byLanguages[s])),
        r.byLanguages["*"] && (t = t.concat(r.byLanguages["*"])),
        e.addEventListener(
          "mouseover",
          function (e) {
            var s = e.target;
            t.forEach(function (e) {
              e.check(s);
            });
          },
          !1
        );
    }),
    (Prism.plugins.Previewer = r),
    Prism.hooks.add("before-highlight", function (n) {
      for (var r in l) {
        var o = l[r].languages;
        if (n.language && o[n.language] && !o[n.language].initialized) {
          var e = o[n.language];
          Array.isArray(e) || (e = [e]),
            e.forEach(function (e) {
              var s, t, i, a;
              (e =
                (!0 === e
                  ? ((s = "important"), (t = n.language))
                  : ((s = e.before || "important"),
                    (t = e.inside || e.lang),
                    (i = e.root || Prism.languages),
                    (a = e.skip)),
                n.language)),
                !a &&
                  Prism.languages[e] &&
                  (Prism.languages.insertBefore(t, s, l[r].tokens, i),
                  (n.grammar = Prism.languages[e]),
                  (o[n.language] = { initialized: !0 }));
            });
        }
      }
    }),
    Prism.hooks.add("after-highlight", function (e) {
      (r.byLanguages["*"] || r.byLanguages[e.language]) &&
        r.initEvents(e.element, e.language);
    }),
    l))
      l[e].create();
  }
})();
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var l = {
        javascript: "clike",
        actionscript: "javascript",
        apex: ["clike", "sql"],
        arduino: "cpp",
        aspnet: ["markup", "csharp"],
        birb: "clike",
        bison: "c",
        c: "clike",
        csharp: "clike",
        cpp: "c",
        cfscript: "clike",
        chaiscript: ["clike", "cpp"],
        coffeescript: "javascript",
        crystal: "ruby",
        "css-extras": "css",
        d: "clike",
        dart: "clike",
        django: "markup-templating",
        ejs: ["javascript", "markup-templating"],
        etlua: ["lua", "markup-templating"],
        erb: ["ruby", "markup-templating"],
        fsharp: "clike",
        "firestore-security-rules": "clike",
        flow: "javascript",
        ftl: "markup-templating",
        gml: "clike",
        glsl: "c",
        go: "clike",
        groovy: "clike",
        haml: "ruby",
        handlebars: "markup-templating",
        haxe: "clike",
        hlsl: "c",
        idris: "haskell",
        java: "clike",
        javadoc: ["markup", "java", "javadoclike"],
        jolie: "clike",
        jsdoc: ["javascript", "javadoclike", "typescript"],
        "js-extras": "javascript",
        json5: "json",
        jsonp: "json",
        "js-templates": "javascript",
        kotlin: "clike",
        latte: ["clike", "markup-templating", "php"],
        less: "css",
        lilypond: "scheme",
        liquid: "markup-templating",
        markdown: "markup",
        "markup-templating": "markup",
        mongodb: "javascript",
        n4js: "javascript",
        objectivec: "c",
        opencl: "c",
        parser: "markup",
        php: "markup-templating",
        phpdoc: ["php", "javadoclike"],
        "php-extras": "php",
        plsql: "sql",
        processing: "clike",
        protobuf: "clike",
        pug: ["markup", "javascript"],
        purebasic: "clike",
        purescript: "haskell",
        qsharp: "clike",
        qml: "javascript",
        qore: "clike",
        racket: "scheme",
        jsx: ["markup", "javascript"],
        tsx: ["jsx", "typescript"],
        reason: "clike",
        ruby: "clike",
        sass: "css",
        scss: "css",
        scala: "java",
        "shell-session": "bash",
        smarty: "markup-templating",
        solidity: "clike",
        soy: "markup-templating",
        sparql: "turtle",
        sqf: "clike",
        squirrel: "clike",
        swift: "clike",
        "t4-cs": ["t4-templating", "csharp"],
        "t4-vb": ["t4-templating", "vbnet"],
        tap: "yaml",
        tt2: ["clike", "markup-templating"],
        textile: "markup",
        twig: "markup",
        typescript: "javascript",
        v: "clike",
        vala: "clike",
        vbnet: "basic",
        velocity: "markup",
        wiki: "markup",
        xeora: "markup",
        "xml-doc": "markup",
        xquery: "markup",
      },
      n = {
        html: "markup",
        xml: "markup",
        svg: "markup",
        mathml: "markup",
        ssml: "markup",
        atom: "markup",
        rss: "markup",
        js: "javascript",
        g4: "antlr4",
        adoc: "asciidoc",
        shell: "bash",
        shortcode: "bbcode",
        rbnf: "bnf",
        oscript: "bsl",
        cs: "csharp",
        dotnet: "csharp",
        cfc: "cfscript",
        coffee: "coffeescript",
        conc: "concurnas",
        jinja2: "django",
        "dns-zone": "dns-zone-file",
        dockerfile: "docker",
        gv: "dot",
        eta: "ejs",
        xlsx: "excel-formula",
        xls: "excel-formula",
        gamemakerlanguage: "gml",
        hbs: "handlebars",
        hs: "haskell",
        idr: "idris",
        gitignore: "ignore",
        hgignore: "ignore",
        npmignore: "ignore",
        webmanifest: "json",
        kt: "kotlin",
        kts: "kotlin",
        kum: "kumir",
        tex: "latex",
        context: "latex",
        ly: "lilypond",
        emacs: "lisp",
        elisp: "lisp",
        "emacs-lisp": "lisp",
        md: "markdown",
        moon: "moonscript",
        n4jsd: "n4js",
        nani: "naniscript",
        objc: "objectivec",
        qasm: "openqasm",
        objectpascal: "pascal",
        px: "pcaxis",
        pcode: "peoplecode",
        pq: "powerquery",
        mscript: "powerquery",
        pbfasm: "purebasic",
        purs: "purescript",
        py: "python",
        qs: "qsharp",
        rkt: "racket",
        rpy: "renpy",
        robot: "robotframework",
        rb: "ruby",
        "sh-session": "shell-session",
        shellsession: "shell-session",
        smlnj: "sml",
        sol: "solidity",
        sln: "solution-file",
        rq: "sparql",
        t4: "t4-cs",
        trig: "turtle",
        ts: "typescript",
        tsconfig: "typoscript",
        uscript: "unrealscript",
        uc: "unrealscript",
        url: "uri",
        vb: "visual-basic",
        vba: "visual-basic",
        mathematica: "wolfram",
        nb: "wolfram",
        wl: "wolfram",
        xeoracube: "xeora",
        yml: "yaml",
      },
      p = {},
      e = "components/",
      a = Prism.util.currentScript();
    if (a) {
      var r =
          /\bplugins\/autoloader\/prism-autoloader\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i,
        s = /(^|\/)[\w-]+\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i,
        i = a.getAttribute("data-autoloader-path");
      if (null != i) e = i.trim().replace(/\/?$/, "/");
      else {
        var t = a.src;
        r.test(t)
          ? (e = t.replace(r, "components/"))
          : s.test(t) && (e = t.replace(s, "$1components/"));
      }
    }
    var o = (Prism.plugins.autoloader = {
      languages_path: e,
      use_minified: !0,
      loadLanguages: m,
    });
    Prism.hooks.add("complete", function (e) {
      var a = e.element,
        r = e.language;
      if (a && r && "none" !== r) {
        var s = (function (e) {
          var a = (e.getAttribute("data-dependencies") || "").trim();
          if (!a) {
            var r = e.parentElement;
            r &&
              "pre" === r.tagName.toLowerCase() &&
              (a = (r.getAttribute("data-dependencies") || "").trim());
          }
          return a ? a.split(/\s*,\s*/g) : [];
        })(a);
        /^diff-./i.test(r)
          ? (s.push("diff"), s.push(r.substr("diff-".length)))
          : s.push(r),
          s.every(u) ||
            m(s, function () {
              Prism.highlightElement(a);
            });
      }
    });
  }
  function u(e) {
    if (0 <= e.indexOf("!")) return !1;
    if ((e = n[e] || e) in Prism.languages) return !0;
    var a = p[e];
    return a && !a.error && !1 === a.loading;
  }
  function m(e, a, r) {
    "string" == typeof e && (e = [e]);
    var s = e.length,
      i = 0,
      t = !1;
    function c() {
      t || (++i === s && a && a(e));
    }
    0 !== s
      ? e.forEach(function (e) {
          !(function (a, r, s) {
            var i = 0 <= a.indexOf("!");
            function e() {
              var e = p[a];
              e || (e = p[a] = { callbacks: [] }),
                e.callbacks.push({ success: r, error: s }),
                !i && u(a)
                  ? k(a, "success")
                  : !i && e.error
                  ? k(a, "error")
                  : (!i && e.loading) ||
                    ((e.loading = !0),
                    (e.error = !1),
                    (function (e, a, r) {
                      var s = document.createElement("script");
                      (s.src = e),
                        (s.async = !0),
                        (s.onload = function () {
                          document.body.removeChild(s), a && a();
                        }),
                        (s.onerror = function () {
                          document.body.removeChild(s), r && r();
                        }),
                        document.body.appendChild(s);
                    })(
                      (function (e) {
                        return (
                          o.languages_path +
                          "prism-" +
                          e +
                          (o.use_minified ? ".min" : "") +
                          ".js"
                        );
                      })(a),
                      function () {
                        (e.loading = !1), k(a, "success");
                      },
                      function () {
                        (e.loading = !1), (e.error = !0), k(a, "error");
                      }
                    ));
            }
            (a = a.replace("!", "")), (a = n[a] || a);
            var t = l[a];
            t && t.length ? m(t, e, s) : e();
          })(e, c, function () {
            t || ((t = !0), r && r(e));
          });
        })
      : a && setTimeout(a, 0);
  }
  function k(e, a) {
    if (p[e]) {
      for (var r = p[e].callbacks, s = 0, i = r.length; s < i; s++) {
        var t = r[s][a];
        t && setTimeout(t, 0);
      }
      r.length = 0;
    }
  }
})();
"undefined" != typeof Prism &&
  "undefined" != typeof document &&
  document.createRange &&
  ((Prism.plugins.KeepMarkup = !0),
  Prism.hooks.add("before-highlight", function (e) {
    if (
      e.element.children.length &&
      Prism.util.isActive(e.element, "keep-markup", !0)
    ) {
      var a = 0,
        s = [],
        p = function (e, n) {
          var o = {};
          n || ((o.clone = e.cloneNode(!1)), (o.posOpen = a), s.push(o));
          for (var t = 0, d = e.childNodes.length; t < d; t++) {
            var r = e.childNodes[t];
            1 === r.nodeType ? p(r) : 3 === r.nodeType && (a += r.data.length);
          }
          n || (o.posClose = a);
        };
      p(e.element, !0), s && s.length && (e.keepMarkup = s);
    }
  }),
  Prism.hooks.add("after-highlight", function (n) {
    if (n.keepMarkup && n.keepMarkup.length) {
      var a = function (e, n) {
        for (var o = 0, t = e.childNodes.length; o < t; o++) {
          var d = e.childNodes[o];
          if (1 === d.nodeType) {
            if (!a(d, n)) return !1;
          } else
            3 === d.nodeType &&
              (!n.nodeStart &&
                n.pos + d.data.length > n.node.posOpen &&
                ((n.nodeStart = d), (n.nodeStartPos = n.node.posOpen - n.pos)),
              n.nodeStart &&
                n.pos + d.data.length >= n.node.posClose &&
                ((n.nodeEnd = d), (n.nodeEndPos = n.node.posClose - n.pos)),
              (n.pos += d.data.length));
          if (n.nodeStart && n.nodeEnd) {
            var r = document.createRange();
            return (
              r.setStart(n.nodeStart, n.nodeStartPos),
              r.setEnd(n.nodeEnd, n.nodeEndPos),
              n.node.clone.appendChild(r.extractContents()),
              r.insertNode(n.node.clone),
              r.detach(),
              !1
            );
          }
        }
        return !0;
      };
      n.keepMarkup.forEach(function (e) {
        a(n.element, { node: e, pos: 0 });
      }),
        (n.highlightedCode = n.element.innerHTML);
    }
  }));
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var d = /(?:^|\s)command-line(?:\s|$)/,
      f = "command-line-prompt",
      m = "".startsWith
        ? function (e, t) {
            return e.startsWith(t);
          }
        : function (e, t) {
            return 0 === e.indexOf(t);
          };
    Prism.hooks.add("before-highlight", function (e) {
      var t = h(e);
      if (!t.complete && e.code) {
        var n = e.element.parentElement;
        if (
          n &&
          /pre/i.test(n.nodeName) &&
          (d.test(n.className) || d.test(e.element.className))
        ) {
          var a = e.element.querySelector("." + f);
          a && a.remove();
          var s = e.code.split("\n");
          t.numberOfLines = s.length;
          var o = (t.outputLines = []),
            r = n.getAttribute("data-output"),
            i = n.getAttribute("data-filter-output");
          if (null !== r)
            r.split(",").forEach(function (e) {
              var t = e.split("-"),
                n = parseInt(t[0], 10),
                a = 2 === t.length ? parseInt(t[1], 10) : n;
              if (!isNaN(n) && !isNaN(a)) {
                n < 1 && (n = 1), a > s.length && (a = s.length), a--;
                for (var r = --n; r <= a; r++) (o[r] = s[r]), (s[r] = "");
              }
            });
          else if (i)
            for (var l = 0; l < s.length; l++)
              m(s[l], i) && ((o[l] = s[l].slice(i.length)), (s[l] = ""));
          e.code = s.join("\n");
        } else t.complete = !0;
      } else t.complete = !0;
    }),
      Prism.hooks.add("before-insert", function (e) {
        var t = h(e);
        if (!t.complete) {
          for (
            var n = e.highlightedCode.split("\n"),
              a = t.outputLines || [],
              r = 0,
              s = a.length;
            r < s;
            r++
          )
            a.hasOwnProperty(r) && (n[r] = a[r]);
          e.highlightedCode = n.join("\n");
        }
      }),
      Prism.hooks.add("complete", function (e) {
        if (
          (function (e) {
            return "command-line" in (e.vars = e.vars || {});
          })(e)
        ) {
          var t = h(e);
          if (!t.complete) {
            var n,
              a = e.element.parentElement;
            d.test(e.element.className) &&
              (e.element.className = e.element.className.replace(d, " ")),
              d.test(a.className) || (a.className += " command-line");
            var r = t.numberOfLines || 0,
              s = c("data-prompt", "");
            if ("" !== s) n = p('<span data-prompt="' + s + '"></span>', r);
            else
              n = p(
                '<span data-user="' +
                  c("data-user", "user") +
                  '" data-host="' +
                  c("data-host", "localhost") +
                  '"></span>',
                r
              );
            var o = document.createElement("span");
            (o.className = f), (o.innerHTML = n);
            for (var i = t.outputLines || [], l = 0, m = i.length; l < m; l++)
              if (i.hasOwnProperty(l)) {
                var u = o.children[l];
                u.removeAttribute("data-user"),
                  u.removeAttribute("data-host"),
                  u.removeAttribute("data-prompt");
              }
            e.element.insertBefore(o, e.element.firstChild), (t.complete = !0);
          }
        }
        function c(e, t) {
          return (a.getAttribute(e) || t).replace(/"/g, "&quot");
        }
      });
  }
  function p(e, t) {
    for (var n = "", a = 0; a < t; a++) n += e;
    return n;
  }
  function h(e) {
    var t = (e.vars = e.vars || {});
    return (t["command-line"] = t["command-line"] || {});
  }
})();
"undefined" != typeof Prism &&
  "undefined" != typeof document &&
  (Element.prototype.matches ||
    (Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector),
  (Prism.plugins.UnescapedMarkup = !0),
  Prism.hooks.add("before-highlightall", function (e) {
    e.selector +=
      ', [class*="lang-"] script[type="text/plain"], [class*="language-"] script[type="text/plain"], script[type="text/plain"][class*="lang-"], script[type="text/plain"][class*="language-"]';
  }),
  Prism.hooks.add("before-sanity-check", function (e) {
    var t = e.element;
    if (t.matches('script[type="text/plain"]')) {
      var a = document.createElement("code"),
        c = document.createElement("pre");
      c.className = a.className = t.className;
      var n = t.dataset;
      return (
        Object.keys(n || {}).forEach(function (e) {
          Object.prototype.hasOwnProperty.call(n, e) && (c.dataset[e] = n[e]);
        }),
        (a.textContent = e.code =
          e.code.replace(/&lt;\/script(?:>|&gt;)/gi, "</script>")),
        c.appendChild(a),
        t.parentNode.replaceChild(c, t),
        void (e.element = a)
      );
    }
    if (!e.code) {
      var o = t.childNodes;
      1 === o.length &&
        "#comment" == o[0].nodeName &&
        (t.textContent = e.code = o[0].textContent);
    }
  }));
!(function () {
  if ("undefined" != typeof Prism) {
    var i =
      Object.assign ||
      function (e, n) {
        for (var t in n) n.hasOwnProperty(t) && (e[t] = n[t]);
        return e;
      };
    (e.prototype = {
      setDefaults: function (e) {
        this.defaults = i(this.defaults, e);
      },
      normalize: function (e, n) {
        for (var t in (n = i(this.defaults, n))) {
          var r = t.replace(/-(\w)/g, function (e, n) {
            return n.toUpperCase();
          });
          "normalize" !== t &&
            "setDefaults" !== r &&
            n[t] &&
            this[r] &&
            (e = this[r].call(this, e, n[t]));
        }
        return e;
      },
      leftTrim: function (e) {
        return e.replace(/^\s+/, "");
      },
      rightTrim: function (e) {
        return e.replace(/\s+$/, "");
      },
      tabsToSpaces: function (e, n) {
        return (n = 0 | n || 4), e.replace(/\t/g, new Array(++n).join(" "));
      },
      spacesToTabs: function (e, n) {
        return (n = 0 | n || 4), e.replace(RegExp(" {" + n + "}", "g"), "\t");
      },
      removeTrailing: function (e) {
        return e.replace(/\s*?$/gm, "");
      },
      removeInitialLineFeed: function (e) {
        return e.replace(/^(?:\r?\n|\r)/, "");
      },
      removeIndent: function (e) {
        var n = e.match(/^[^\S\n\r]*(?=\S)/gm);
        return n && n[0].length
          ? (n.sort(function (e, n) {
              return e.length - n.length;
            }),
            n[0].length ? e.replace(RegExp("^" + n[0], "gm"), "") : e)
          : e;
      },
      indent: function (e, n) {
        return e.replace(
          /^[^\S\n\r]*(?=\S)/gm,
          new Array(++n).join("\t") + "$&"
        );
      },
      breakLines: function (e, n) {
        n = !0 === n ? 80 : 0 | n || 80;
        for (var t = e.split("\n"), r = 0; r < t.length; ++r)
          if (!(s(t[r]) <= n)) {
            for (
              var i = t[r].split(/(\s+)/g), o = 0, a = 0;
              a < i.length;
              ++a
            ) {
              var l = s(i[a]);
              n < (o += l) && ((i[a] = "\n" + i[a]), (o = l));
            }
            t[r] = i.join("");
          }
        return t.join("\n");
      },
    }),
      "undefined" != typeof module && module.exports && (module.exports = e),
      (Prism.plugins.NormalizeWhitespace = new e({
        "remove-trailing": !0,
        "remove-indent": !0,
        "left-trim": !0,
        "right-trim": !0,
      })),
      Prism.hooks.add("before-sanity-check", function (e) {
        var n = Prism.plugins.NormalizeWhitespace;
        if (
          (!e.settings || !1 !== e.settings["whitespace-normalization"]) &&
          Prism.util.isActive(e.element, "whitespace-normalization", !0)
        )
          if ((e.element && e.element.parentNode) || !e.code) {
            var t = e.element.parentNode;
            if (e.code && t && "pre" === t.nodeName.toLowerCase()) {
              for (
                var r = t.childNodes, i = "", o = "", a = !1, l = 0;
                l < r.length;
                ++l
              ) {
                var s = r[l];
                s == e.element
                  ? (a = !0)
                  : "#text" === s.nodeName &&
                    (a ? (o += s.nodeValue) : (i += s.nodeValue),
                    t.removeChild(s),
                    --l);
              }
              if (e.element.children.length && Prism.plugins.KeepMarkup) {
                var c = i + e.element.innerHTML + o;
                (e.element.innerHTML = n.normalize(c, e.settings)),
                  (e.code = e.element.textContent);
              } else
                (e.code = i + e.code + o),
                  (e.code = n.normalize(e.code, e.settings));
            }
          } else e.code = n.normalize(e.code, e.settings);
      });
  }
  function e(e) {
    this.defaults = i({}, e);
  }
  function s(e) {
    for (var n = 0, t = 0; t < e.length; ++t)
      e.charCodeAt(t) == "\t".charCodeAt(0) && (n += 3);
    return e.length + n;
  }
})();
!(function () {
  if ("undefined" != typeof Prism) {
    var e = {
        pattern: /(.)\bdata:[^\/]+\/[^,]+,(?:(?!\1)[\s\S]|\\\1)+(?=\1)/,
        lookbehind: !0,
        inside: {
          "language-css": {
            pattern: /(data:[^\/]+\/(?:[^+,]+\+)?css,)[\s\S]+/,
            lookbehind: !0,
          },
          "language-javascript": {
            pattern: /(data:[^\/]+\/(?:[^+,]+\+)?javascript,)[\s\S]+/,
            lookbehind: !0,
          },
          "language-json": {
            pattern: /(data:[^\/]+\/(?:[^+,]+\+)?json,)[\s\S]+/,
            lookbehind: !0,
          },
          "language-markup": {
            pattern: /(data:[^\/]+\/(?:[^+,]+\+)?(?:html|xml),)[\s\S]+/,
            lookbehind: !0,
          },
        },
      },
      r = ["url", "attr-value", "string"];
    (Prism.plugins.dataURIHighlight = {
      processGrammar: function (i) {
        i &&
          !i["data-uri"] &&
          (Prism.languages.DFS(i, function (i, a, n) {
            -1 < r.indexOf(n) &&
              !Array.isArray(a) &&
              (a.pattern || (a = this[i] = { pattern: a }),
              (a.inside = a.inside || {}),
              "attr-value" == n
                ? Prism.languages.insertBefore(
                    "inside",
                    a.inside["url-link"] ? "url-link" : "punctuation",
                    { "data-uri": e },
                    a
                  )
                : a.inside["url-link"]
                ? Prism.languages.insertBefore(
                    "inside",
                    "url-link",
                    { "data-uri": e },
                    a
                  )
                : (a.inside["data-uri"] = e));
          }),
          (i["data-uri"] = e));
      },
    }),
      Prism.hooks.add("before-highlight", function (i) {
        if (e.pattern.test(i.code))
          for (var a in e.inside)
            if (
              e.inside.hasOwnProperty(a) &&
              !e.inside[a].inside &&
              e.inside[a].pattern.test(i.code)
            ) {
              var n = a.match(/^language-(.+)/)[1];
              Prism.languages[n] &&
                (e.inside[a].inside = {
                  rest:
                    ((r = Prism.languages[n]),
                    Prism.plugins.autolinker &&
                      Prism.plugins.autolinker.processGrammar(r),
                    r),
                });
            }
        var r;
        Prism.plugins.dataURIHighlight.processGrammar(i.grammar);
      });
  }
})();
!(function () {
  function u(t, e) {
    t.addEventListener("click", function () {
      !(function (t) {
        navigator.clipboard
          ? navigator.clipboard
              .writeText(t.getText())
              .then(t.success, function () {
                o(t);
              })
          : o(t);
      })(e);
    });
  }
  function o(e) {
    var t = document.createElement("textarea");
    (t.value = e.getText()),
      (t.style.top = "0"),
      (t.style.left = "0"),
      (t.style.position = "fixed"),
      document.body.appendChild(t),
      t.focus(),
      t.select();
    try {
      var o = document.execCommand("copy");
      setTimeout(function () {
        o ? e.success() : e.error();
      }, 1);
    } catch (t) {
      setTimeout(function () {
        e.error(t);
      }, 1);
    }
    document.body.removeChild(t);
  }
  "undefined" != typeof Prism &&
    "undefined" != typeof document &&
    (Prism.plugins.toolbar
      ? Prism.plugins.toolbar.registerButton("copy-to-clipboard", function (t) {
          var e = t.element,
            o = (function (t) {
              var e = {
                copy: "Copy",
                "copy-error": "Press Ctrl+C to copy",
                "copy-success": "Copied!",
                "copy-timeout": 5e3,
              };
              for (var o in e) {
                for (
                  var n = "data-prismjs-" + o, c = t;
                  c && !c.hasAttribute(n);

                )
                  c = c.parentElement;
                c && (e[o] = c.getAttribute(n));
              }
              return e;
            })(e),
            n = document.createElement("button");
          (n.className = "copy-to-clipboard-button"),
            n.setAttribute("type", "button");
          var c = document.createElement("span");
          return (
            n.appendChild(c),
            i("copy"),
            u(n, {
              getText: function () {
                return e.textContent;
              },
              success: function () {
                i("copy-success"), r();
              },
              error: function () {
                i("copy-error"),
                  setTimeout(function () {
                    !(function (t) {
                      window.getSelection().selectAllChildren(t);
                    })(e);
                  }, 1),
                  r();
              },
            }),
            n
          );
          function r() {
            setTimeout(function () {
              i("copy");
            }, o["copy-timeout"]);
          }
          function i(t) {
            (c.textContent = o[t]), n.setAttribute("data-copy-state", t);
          }
        })
      : console.warn("Copy to Clipboard plugin loaded before Toolbar plugin."));
})();
"undefined" != typeof Prism &&
  "undefined" != typeof document &&
  document.querySelector &&
  Prism.plugins.toolbar.registerButton("download-file", function (t) {
    var e = t.element.parentNode;
    if (
      e &&
      /pre/i.test(e.nodeName) &&
      e.hasAttribute("data-src") &&
      e.hasAttribute("data-download-link")
    ) {
      var n = e.getAttribute("data-src"),
        a = document.createElement("a");
      return (
        (a.textContent =
          e.getAttribute("data-download-link-label") || "Download"),
        a.setAttribute("download", ""),
        (a.href = n),
        a
      );
    }
  });
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    var d = { "(": ")", "[": "]", "{": "}" },
      u = { "(": "brace-round", "[": "brace-square", "{": "brace-curly" },
      f = { "${": "{" },
      h = 0,
      n = /^(pair-\d+-)(open|close)$/;
    Prism.hooks.add("complete", function (e) {
      var t = e.element,
        n = t.parentElement;
      if (n && "PRE" == n.tagName) {
        var r = [];
        if (
          (Prism.util.isActive(t, "match-braces") && r.push("(", "[", "{"),
          0 != r.length)
        ) {
          n.__listenerAdded ||
            (n.addEventListener("mousedown", function () {
              var e = n.querySelector("code"),
                t = p("brace-selected");
              Array.prototype.slice
                .call(e.querySelectorAll("." + t))
                .forEach(function (e) {
                  e.classList.remove(t);
                });
            }),
            Object.defineProperty(n, "__listenerAdded", { value: !0 }));
          var o = Array.prototype.slice.call(
              t.querySelectorAll("span." + p("token") + "." + p("punctuation"))
            ),
            l = [];
          r.forEach(function (e) {
            for (
              var t = d[e], n = p(u[e]), r = [], c = [], s = 0;
              s < o.length;
              s++
            ) {
              var i = o[s];
              if (0 == i.childElementCount) {
                var a = i.textContent;
                (a = f[a] || a) === e
                  ? (l.push({ index: s, open: !0, element: i }),
                    i.classList.add(n),
                    i.classList.add(p("brace-open")),
                    c.push(s))
                  : a === t &&
                    (l.push({ index: s, open: !1, element: i }),
                    i.classList.add(n),
                    i.classList.add(p("brace-close")),
                    c.length && r.push([s, c.pop()]));
              }
            }
            r.forEach(function (e) {
              var t = "pair-" + h++ + "-",
                n = o[e[0]],
                r = o[e[1]];
              (n.id = t + "open"),
                (r.id = t + "close"),
                [n, r].forEach(function (e) {
                  e.addEventListener("mouseenter", v),
                    e.addEventListener("mouseleave", m),
                    e.addEventListener("click", b);
                });
            });
          });
          var c = 0;
          l.sort(function (e, t) {
            return e.index - t.index;
          }),
            l.forEach(function (e) {
              e.open
                ? (e.element.classList.add(p("brace-level-" + ((c % 12) + 1))),
                  c++)
                : ((c = Math.max(0, c - 1)),
                  e.element.classList.add(p("brace-level-" + ((c % 12) + 1))));
            });
        }
      }
    });
  }
  function p(e) {
    var t = Prism.plugins.customClass;
    return t ? t.apply(e, "none") : e;
  }
  function e(e) {
    var t = n.exec(e.id);
    return document.querySelector(
      "#" + t[1] + ("open" == t[2] ? "close" : "open")
    );
  }
  function v() {
    Prism.util.isActive(this, "brace-hover", !0) &&
      [this, e(this)].forEach(function (e) {
        e.classList.add(p("brace-hover"));
      });
  }
  function m() {
    [this, e(this)].forEach(function (e) {
      e.classList.remove(p("brace-hover"));
    });
  }
  function b() {
    Prism.util.isActive(this, "brace-select", !0) &&
      [this, e(this)].forEach(function (e) {
        e.classList.add(p("brace-selected"));
      });
  }
})();
!(function () {
  if ("undefined" != typeof Prism) {
    var m = /^diff-([\w-]+)/i,
      d =
        /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/gi,
      c = RegExp(
        "(?:__|[^\r\n<])*(?:\r\n?|\n|(?:__|[^\r\n<])(?![^\r\n]))".replace(
          /__/g,
          function () {
            return d.source;
          }
        ),
        "gi"
      ),
      a = !1;
    Prism.hooks.add("before-sanity-check", function (e) {
      var i = e.language;
      m.test(i) &&
        !e.grammar &&
        (e.grammar = Prism.languages[i] = Prism.languages.diff);
    }),
      Prism.hooks.add("before-tokenize", function (e) {
        a ||
          Prism.languages.diff ||
          Prism.plugins.autoloader ||
          ((a = !0),
          console.warn(
            "Prism's Diff Highlight plugin requires the Diff language definition (prism-diff.js).Make sure the language definition is loaded or use Prism's Autoloader plugin."
          ));
        var i = e.language;
        m.test(i) &&
          !Prism.languages[i] &&
          (Prism.languages[i] = Prism.languages.diff);
      }),
      Prism.hooks.add("wrap", function (e) {
        var i, a;
        if ("diff" !== e.language) {
          var s = m.exec(e.language);
          if (!s) return;
          (i = s[1]), (a = Prism.languages[i]);
        }
        var r = Prism.languages.diff && Prism.languages.diff.PREFIXES;
        if (r && e.type in r) {
          var n,
            g = e.content
              .replace(d, "")
              .replace(/&lt;/g, "<")
              .replace(/&amp;/g, "&"),
            f = g.replace(/(^|[\r\n])./g, "$1");
          n = a ? Prism.highlight(f, a, i) : Prism.util.encode(f);
          var u,
            l = new Prism.Token("prefix", r[e.type], [/\w+/.exec(e.type)[0]]),
            t = Prism.Token.stringify(l, e.language),
            o = [];
          for (c.lastIndex = 0; (u = c.exec(n)); ) o.push(t + u[0]);
          /(?:^|[\r\n]).$/.test(g) && o.push(t),
            (e.content = o.join("")),
            a && e.classes.push("language-" + i);
        }
      });
  }
})();
!(function () {
  if ("undefined" != typeof Prism && "undefined" != typeof document) {
    Element.prototype.matches ||
      (Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector);
    var e,
      t = Prism.util.currentScript(),
      r = [],
      n = (Prism.plugins.filterHighlightAll = {
        add: function (t) {
          r.push(function (e) {
            return t({ element: e, language: Prism.util.getLanguage(e) });
          });
        },
        addSelector: function (t) {
          r.push(function (e) {
            return e.matches(t);
          });
        },
        reject: {
          add: function (t) {
            r.push(function (e) {
              return !t({ element: e, language: Prism.util.getLanguage(e) });
            });
          },
          addSelector: function (t) {
            r.push(function (e) {
              return !e.matches(t);
            });
          },
        },
        filterKnown: !!t && t.hasAttribute("data-filter-known"),
      });
    if (
      (n.add(function (e) {
        return !n.filterKnown || "object" == typeof Prism.languages[e.language];
      }),
      t)
    )
      (e = t.getAttribute("data-filter-selector")) && n.addSelector(e),
        (e = t.getAttribute("data-reject-selector")) && n.reject.addSelector(e);
    Prism.hooks.add("before-all-elements-highlight", function (e) {
      e.elements = e.elements.filter(i);
    });
  }
  function i(e) {
    for (var t = 0, n = r.length; t < n; t++) if (!r[t](e)) return !1;
    return !0;
  }
})();
"undefined" != typeof Prism &&
  ((Prism.languages.treeview = {
    "treeview-part": {
      pattern: /^.+/m,
      inside: {
        "entry-line": [
          { pattern: /\|-- |├── /, alias: "line-h" },
          { pattern: /\| {3}|│ {3}/, alias: "line-v" },
          { pattern: /`-- |└── /, alias: "line-v-last" },
          { pattern: / {4}/, alias: "line-v-gap" },
        ],
        "entry-name": { pattern: /.*\S.*/, inside: { operator: / -> / } },
      },
    },
  }),
  Prism.hooks.add("wrap", function (e) {
    if ("treeview" === e.language && "entry-name" === e.type) {
      var t = e.classes,
        n = /(^|[^\\])\/\s*$/;
      if (n.test(e.content))
        (e.content = e.content.replace(n, "$1")), t.push("dir");
      else {
        e.content = e.content.replace(/(^|[^\\])[=*|]\s*$/, "$1");
        for (
          var a = e.content.toLowerCase().replace(/\s+/g, "").split(".");
          1 < a.length;

        )
          a.shift(), t.push("ext-" + a.join("-"));
      }
      "." === e.content[0] && t.push("dotfile");
    }
  }));
