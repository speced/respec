define(["exports", "deps/beautify-html", "core/beautify-options", "core/utils", "core/pubsubhub", "core/ui"], function (exports, _beautifyHtml, _beautifyOptions, _utils, _pubsubhub, _ui) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.name = undefined;
  exports.show = show;

  var _beautifyHtml2 = _interopRequireDefault(_beautifyHtml);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var name = exports.name = "ui/save-html"; // Module ui/save-html
  // Saves content to HTML when asked to

  var msg,
      doc = document,
      conf = window.respecConfig;

  var button = _ui.ui.addCommand("Bewaar Snapshot", "geonovum/ui/save-html", "Ctrl+Shift+Alt+S", "💾");

  function cleanup(rootEl) {
    $(".removeOnSave", rootEl).remove();
    $("#toc-nav", rootEl).remove();
    $("body", rootEl).removeClass("toc-sidebar");
    (0, _utils.removeReSpec)(rootEl);

    // Move meta viewport, as it controls the rendering on mobile
    var head = rootEl.querySelector("head");
    var metaViewport = rootEl.querySelector("meta[name='viewport']");
    if (metaViewport) {
      head.insertBefore(metaViewport, head.firstChild);
    }

    // Move charset to top, because it needs to be in the first 512 bytes
    var metaCharset = rootEl.querySelector("meta[charset=utf-8], meta[content*='charset=utf-8']");
    if (!metaCharset) {
      (0, _pubsubhub.pub)("warn", "Document lacks a 'meta charset' declaration. Exporting as utf-8.");
      metaCharset = doc.createElement("meta");
      metaCharset.setAttribute("charset", "utf-8");
    }
    head.insertBefore(metaCharset, head.firstChild);
    // Add meta generator
    var metaGenerator = doc.createElement("meta");
    metaGenerator.name = "generator";
    metaGenerator.content = "ReSpec " + window.respecVersion || "Developer Channel";
    head.insertBefore(metaGenerator, head.lastChild);
  }

  // Clean up markup to overcome bugs in beautifier
  function preBeautify(str) {
    return str.replace(/\n\s*\(</gm, " (<");
  }

  var save = {
    show: function show() {
      if (!conf.diffTool) conf.diffTool = "https://www5.aptest.com/standards/htmldiff/htmldiff.pl";
      var supportsDownload = Object.getOwnPropertyNames(HTMLAnchorElement.prototype).indexOf("download") > -1,
          self = this;
      var $div = $("<div class='respec-save-buttons'></div>"),
          addButton = function addButton(options) {
        if (supportsDownload) {
          $("<a class='respec-save-button'></a>").appendTo($div).text(options.title).attr({
            id: options.id,
            href: options.url,
            download: options.fileName,
            type: options.type || ""
          }).click(function () {
            _ui.ui.closeModal();
          });
        } else {
          $("<button class='respec-save-button'></button>").appendTo($div).text(options.title).click(function () {
            options.popupContent();
            _ui.ui.closeModal();
          });
        }
      };

      // HTML
      addButton({
        id: "respec-save-as-html",
        title: "Bewaar als HTML",
        url: this.htmlToDataURL(this.toString()),
        popupContent: function popupContent() {
          self.toHTMLSource();
        },

        fileName: "index.html"
      });

      // XHTML5
      addButton({
        id: "respec-save-as-xhtml5",
        fileName: "index.xhtml",
        popupContent: function popupContent() {
          self.toXHTMLSource();
        },

        title: "Bewaar als XHTML5",
        url: this.htmlToDataURL(this.toXML())
      });

      // ePub
      addButton({
        id: "respec-save-as-epub",
        fileName: "spec.epub",
        popupContent: function popupContent() {
          window.open(self.makeEPubHref(), "_blank");
        },

        title: "Bewaar als EPUB 3",
        type: "application/epub+zip",
        url: this.makeEPubHref()
      });

      if (conf.diffTool && (conf.previousDiffURI || conf.previousURI)) {
        $("<button>Diff</button>").appendTo($div).click(function () {
          self.toDiffHTML();
          _ui.ui.closeModal();
        });
      }
      _ui.ui.freshModal("Bewaar Snapshot", $div, button);
    },

    htmlToDataURL: function htmlToDataURL(data) {
      data = encodeURIComponent(data);
      return "data:text/html;charset=utf-8," + data;
    },
    makeEPubHref: function makeEPubHref() {
      var EPUB_GEN_HREF = "https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py";
      var finalURL = EPUB_GEN_HREF + "?type=respec&";
      finalURL += "url=" + encodeURIComponent(doc.location.href);
      return finalURL;
    },
    toString: function toString() {
      (0, _pubsubhub.pub)("save", "toString");
      var str = "<!DOCTYPE html",
          dt = doc.doctype;
      if (dt && dt.publicId) str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
      str += ">\n<html";
      var ats = doc.documentElement.attributes;
      for (var i = 0; i < ats.length; i++) {
        var an = ats[i].name;
        if (an === "xmlns" || an === "xml:lang") continue;
        str += " " + an + '="' + (0, _utils.xmlEscape)(ats[i].value) + '"';
      }
      str += ">\n";
      var rootEl = doc.documentElement.cloneNode(true);
      cleanup(rootEl);
      str += rootEl.innerHTML;
      str += "</html>";
      var uglyHTML = preBeautify(str);
      var beautifulHTML = _beautifyHtml2.default.html_beautify(uglyHTML, _beautifyOptions.beautifyOpts);
      return beautifulHTML;
    },

    // convert the document to XML, pass 5 as mode for XHTML5
    toXML: function toXML(mode) {
      (0, _pubsubhub.pub)("save", "toXML" + mode);
      var rootEl = doc.documentElement.cloneNode(true);
      cleanup(rootEl);
      var str = "<!DOCTYPE html";
      var dt = doc.doctype;
      if (dt && dt.publicId) {
        str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
      }
      str += ">\n<html";
      var ats = doc.documentElement.attributes,
          hasxmlns = false;
      for (var i = 0; i < ats.length; i++) {
        var an = ats[i].name;
        if (an === "xmlns") hasxmlns = true;
        str += " " + an + '="' + (0, _utils.xmlEscape)(ats[i].value) + '"';
      }
      if (!hasxmlns) str += ' xmlns="http://www.w3.org/1999/xhtml"';
      str += ">\n";
      // walk the entire DOM tree grabbing nodes and emitting them - possibly modifying them
      // if they need the funny closing tag
      var selfClosing = {};
      "br img input area base basefont col isindex link meta param hr".split(" ").forEach(function (n) {
        selfClosing[n] = true;
      });
      var noEsc = [false];
      var dumpNode = function dumpNode(node) {
        var out = "";
        // if the node is the document node.. process the children
        if (node.nodeType === 9 || node.nodeType === 1 && node.nodeName.toLowerCase() === "html") {
          for (var i = 0; i < node.childNodes.length; i++) {
            out += dumpNode(node.childNodes[i]);
          }
        } else if (1 === node.nodeType) {
          // element
          var ename = node.nodeName.toLowerCase();
          out += "<" + ename;
          for (var i = 0; i < node.attributes.length; i++) {
            var atn = node.attributes[i];
            if (/^\d+$/.test(atn.name)) continue;
            out += " " + atn.name + '="' + (0, _utils.xmlEscape)(atn.value) + '"';
          }
          if (selfClosing[ename]) out += " />";else {
            out += ">";
            noEsc.push(ename === "style" || ename === "script");
            for (var i = 0; i < node.childNodes.length; i++) {
              out += dumpNode(node.childNodes[i]);
            }noEsc.pop();
            out += "</" + ename + ">";
          }
        } else if (8 === node.nodeType) {
          // comments
          out += "\n<!--" + node.nodeValue + "-->\n";
        } else if (3 === node.nodeType || 4 === node.nodeType) {
          // text or cdata
          out += noEsc[noEsc.length - 1] ? node.nodeValue : (0, _utils.xmlEscape)(node.nodeValue);
        } else {
          // we don't handle other types
          (0, _pubsubhub.pub)("warn", "Cannot handle serialising nodes of type: " + node.nodeType);
        }
        return out;
      };
      str += dumpNode(rootEl) + "</html>";
      var uglyHTML = preBeautify(str);
      var beautifulXML = _beautifyHtml2.default.html_beautify(uglyHTML, _beautifyOptions.beautifyOpts);
      return beautifulXML;
    },
    toDiffHTML: function toDiffHTML() {
      (0, _pubsubhub.pub)("save", "toDiffHTML");
      var base = window.location.href.replace(/\/[^\/]*$/, "/"),
          str = "<!DOCTYPE html>\n<html>\n" + "<head><title>Diff form</title></head>\n" + "<body><form name='form' method='POST' action='" + conf.diffTool + "'>\n" + "<input type='hidden' name='base' value='" + base + "'>\n";
      if (conf.previousDiffURI) {
        str += "<input type='hidden' name='oldfile' value='" + conf.previousDiffURI + "'>\n";
      } else {
        str += "<input type='hidden' name='oldfile' value='" + conf.previousURI + "'>\n";
      }
      str += '<input type="hidden" name="newcontent" value="' + (0, _utils.xmlEscape)(this.toString()) + '">\n' + "<p>Submitting, please wait...</p>" + "</form></body></html>\n";
      var x = window.open();
      x.document.write(str);
      x.document.close();
      x.document.form.submit();
    },
    toHTMLSource: function toHTMLSource() {
      var x = window.open();
      x.document.write("<pre>" + (0, _utils.xmlEscape)(this.toString()) + "</pre>");
      x.document.close();
    },
    toXHTMLSource: function toXHTMLSource() {
      var x = window.open();
      x.document.write("<pre>" + (0, _utils.xmlEscape)(this.toXML()) + "</pre>");
      x.document.close();
    }
  };

  function show() {
    save.show();
  }
});
//# sourceMappingURL=save-html.js.map