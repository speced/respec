
// Module ui/save-html
// Saves content to HTML when asked to

define(
    [
        "deps/beautify-html",
        "core/beautify-options",
        "core/pubsubhub",
        "core/utils",
        "core/ui",
    ],
    function (beautify, beautifyOpts, pubsubhub, utils, ui) {
        var msg, doc = document, conf = window.respecConfig;
        const button = ui.addCommand("Save Snapshot", "ui/save-html", "Ctrl+Shift+Alt+S", "💾");
        var cleanup = function (rootEl) {
            $(".removeOnSave", rootEl).remove();
            $("#toc-nav", rootEl).remove() ;
            $("body", rootEl).removeClass('toc-sidebar');
            utils.removeReSpec(rootEl);

            // Move meta viewport, as it controls the rendering on mobile
            var head = rootEl.querySelector("head");
            var metaViewport = rootEl.querySelector("meta[name='viewport']");
            if(metaViewport){
                head.insertBefore(metaViewport, head.firstChild);
            }

            // Move charset to top, because it needs to be in the first 512 bytes
            var metaCharset = rootEl.querySelector("meta[charset=utf-8], meta[content*='charset=utf-8']");
            if(!metaCharset){
                pubsubhub.pub("warn", "Document lacks a 'meta charset' declaration. Exporting as utf-8.");
                metaCharset = doc.createElement("meta");
                metaCharset.setAttribute("charset", "utf-8");
            }
            head.insertBefore(metaCharset, head.firstChild);
            // Add meta generator
            var metaGenerator = doc.createElement("meta");
            metaGenerator.name = "generator";
            metaGenerator.content = "ReSpec " + window.respecVersion || "Developer Channel";
            head.insertBefore(metaGenerator, head.lastChild);
        };

        // Clean up markup to overcome bugs in beautifier
        function preBeautify(str){
            return str
                .replace(/\n\s*\(</mg, " (<");
        }
        return {
            show: function() {
                if (!conf.diffTool) conf.diffTool = "https://www5.aptest.com/standards/htmldiff/htmldiff.pl";
                var supportsDownload = Object
                    .getOwnPropertyNames(HTMLAnchorElement.prototype)
                    .indexOf("download") > -1
                ,   self = this
                ;
                var $div = $("<div></div>")
                ,   addButton = function (options) {
                        if (supportsDownload) {
                            $("<a class='respec-save-button'></a>")
                                .appendTo($div)
                                .text(options.title)
                                .attr({
                    id: options.id
                ,   href: options.url
                                ,   download: options.fileName
                                ,   type: options.type || ""
                                })
                                .click(function () {
                                    ui.closeModal();
                                })
                                ;
                        }
                        else {
                            $("<button class='respec-save-button'></button>")
                                .appendTo($div)
                                .text(options.title)
                                .click(function () {
                                    options.popupContent();
                                    ui.closeModal();
                                })
                                ;
                        }

                    }
                ;

                // HTML
                addButton({
            id: "respec-save-as-html",
                    title: "Save as HTML",
                    url: this.htmlToDataURL(this.toString()),
                    popupContent: function () { self.toHTMLSource(); },
                    fileName: "index.html",
                });

                // XHTML5
                addButton({
            id: "respec-save-as-xhtml5",
                    fileName: "index.xhtml",
                    popupContent: function () {
                        self.toXHTMLSource();
                    },
                    title: "Save as XHTML5",
                    url: this.htmlToDataURL(this.toXML()),
                });

                // ePub
                addButton({
            id: "respec-save-as-epub",
                    fileName: "spec.epub",
                    popupContent: function () {
                        window.open(self.makeEPubHref(), "_blank");
                    },
                    title: "Save as EPUB 3",
                    type: "application/epub+zip",
                    url: this.makeEPubHref(),
                });


                if (conf.diffTool && (conf.previousDiffURI || conf.previousURI)) {
                    $("<button>Diff</button>")
                        .appendTo($div)
                        .click(function () {
                            self.toDiffHTML();
                            ui.closeModal();
                        })
                        ;
                }
                ui.freshModal("Save Snapshot", $div, button);
            }
        ,   htmlToDataURL: function(data){
                data = encodeURIComponent(data);
                return "data:text/html;charset=utf-8," + data;
            }
        // Create and download an EPUB 3 version of the content
        // Using (by default) the EPUB 3 conversion service set up at labs.w3.org/epub-generator
        // For more details on that service, see https://github.com/iherman/respec2epub
        ,   makeEPubHref: function(){
                var EPUB_GEN_HREF = "https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py";
                var finalURL = EPUB_GEN_HREF + "?type=respec&";
                finalURL += "url=" + encodeURIComponent(doc.location.href);
                return finalURL;
            }
            // convert the document to a string (HTML)
        ,   toString:    function () {
                pubsubhub.pub("save", "toString")
                var str = "<!DOCTYPE html"
                ,   dt = doc.doctype;
                if (dt && dt.publicId) str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
                str += ">\n<html";
                var ats = doc.documentElement.attributes;
                for (var i = 0; i < ats.length; i++) {
                    var an = ats[i].name;
                    if (an === "xmlns" || an === "xml:lang") continue;
                    str += " " + an + "=\"" + utils.xmlEscape(ats[i].value) + "\"";
                }
                str += ">\n";
                var rootEl = doc.documentElement.cloneNode(true);
                cleanup(rootEl);
                str += rootEl.innerHTML;
                str += "</html>";
                var uglyHTML = preBeautify(str);
                var beautifulHTML = beautify.html_beautify(uglyHTML, beautifyOpts);
                return beautifulHTML;
            }
            // convert the document to XML, pass 5 as mode for XHTML5
        ,   toXML:        function (mode) {
                pubsubhub.pub("save", "toXML" + mode)
                var rootEl = doc.documentElement.cloneNode(true);
                cleanup(rootEl);
                var str = "<!DOCTYPE html"
                var dt = doc.doctype;
                if (dt && dt.publicId){
                    str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
                }
                str += ">\n<html";
                var ats = doc.documentElement.attributes
                ,   hasxmlns = false;
                for (var i = 0; i < ats.length; i++) {
                    var an = ats[i].name;
                    if (an === "xmlns") hasxmlns = true;
                    str += " " + an + "=\"" + utils.xmlEscape(ats[i].value) + "\"";
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
                var dumpNode = function (node) {
                    var out = "";
                    // if the node is the document node.. process the children
                    if (node.nodeType === 9 || (node.nodeType === 1 && node.nodeName.toLowerCase() == "html")) {
                        for (var i = 0; i < node.childNodes.length; i++) out += dumpNode(node.childNodes[i]);
                    }
                    // element
                    else if (1 === node.nodeType) {
                        var ename = node.nodeName.toLowerCase() ;
                        out += "<" + ename ;
                        for (var i = 0; i < node.attributes.length; i++) {
                            var atn = node.attributes[i];
                            if (/^\d+$/.test(atn.name)) continue;
                            out += " " + atn.name + "=\"" + utils.xmlEscape(atn.value) + "\"";
                        }
                        if (selfClosing[ename]) out += " />";
                        else {
                            out += ">";
                            noEsc.push(ename === "style" || ename === "script");
                            for (var i = 0; i < node.childNodes.length; i++) out += dumpNode(node.childNodes[i]);
                            noEsc.pop();
                            out += "</" + ename + ">";
                        }
                    }
                    // comments
                    else if (8 === node.nodeType) {
                        out += "\n<!--" + node.nodeValue + "-->\n";
                    }
                    // text or cdata
                    else if (3 === node.nodeType || 4 === node.nodeType) {
                        out += noEsc[noEsc.length - 1] ? node.nodeValue : utils.xmlEscape(node.nodeValue);
                    }
                    // we don't handle other types
                    else {
                        pubsubhub.pub("warn", "Cannot handle serialising nodes of type: " + node.nodeType);
                    }
                    return out;
                };
                str += dumpNode(rootEl) + "</html>";
                var uglyHTML = preBeautify(str);
                var beautifulXML = beautify.html_beautify(uglyHTML, beautifyOpts);
                return beautifulXML;
            }
            // create a diff marked version against the previousURI
            // strategy - open a window in which there is a form with the
            // data needed for diff marking - submit the form so that the response populates
            // page with the diff marked version
        ,   toDiffHTML:  function () {
                pubsubhub.pub("save", "toDiffHTML")
                var base = window.location.href.replace(/\/[^\/]*$/, "/")
                ,   str = "<!DOCTYPE html>\n<html>\n" +
                          "<head><title>Diff form</title></head>\n" +
                          "<body><form name='form' method='POST' action='" + conf.diffTool + "'>\n" +
                          "<input type='hidden' name='base' value='" + base + "'>\n";
                if (conf.previousDiffURI) {
                    str += "<input type='hidden' name='oldfile' value='" + conf.previousDiffURI + "'>\n";
                }
                else {
                    str += "<input type='hidden' name='oldfile' value='" + conf.previousURI + "'>\n";
                }
                str += '<input type="hidden" name="newcontent" value="' + utils.xmlEscape(this.toString()) + '">\n' +
                       '<p>Submitting, please wait...</p>' +
                       "</form></body></html>\n";
                var x = window.open();
                x.document.write(str);
                x.document.close();
                x.document.form.submit();
            },
            // popup the generated HTML content
            // toHTML:    function () {
            //     var x = window.open();
            //     x.document.write(this.toString());
            //     x.document.close();
            // },
            // popup the generated source
            toHTMLSource:    function () {
                var x = window.open();
                x.document.write("<pre>" + utils.xmlEscape(this.toString()) + "</pre>");
                x.document.close();
            },
            // popup the generated XHTML content
            // toXHTML:    function () {
            //     var x = window.open();
            //     x.document.write(this.toXML()) ;
            //     x.document.close();
            // },
            // popup the generated XHTML source
            toXHTMLSource:    function () {
                var x = window.open();
                x.document.write("<pre>" + utils.xmlEscape(this.toXML()) + "</pre>");
                x.document.close();
            }
        };
    }
);
