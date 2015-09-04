
// Module ui/save-html
// Saves content to HTML when asked to

define(
    ["jquery", "core/utils"],
    function ($, utils) {
        var msg, doc, conf;
        var cleanup = function (rootEl) {
            $(".removeOnSave", rootEl).remove();
            utils.removeReSpec(rootEl);
        };
        return {
            show:   function (ui, _conf, _doc, _msg) {
                msg = _msg, doc = _doc, conf = _conf;
                if (!conf.diffTool) conf.diffTool = "http://www5.aptest.com/standards/htmldiff/htmldiff.pl";
                if (!conf.epubGenTool) conf.epubGenTool = "https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py";
                var supportsDownload = $("<a href='foo' download='x'>A</a>")[0].download === "x"
                ,   self = this
                ;
                var $div = $("<div></div>")
                ,   buttonCSS = {
                        background:     "#eee"
                    ,   border:         "1px solid #000"
                    ,   borderRadius:   "5px"
                    ,   padding:        "5px"
                    ,   margin:         "5px"
                    ,   display:        "block"
                    ,   width:          "100%"
                    ,   color:          "#000"
                    ,   textDecoration: "none"
                    ,   textAlign:      "center"
                    ,   fontSize:       "inherit"
                    }
                ,   addButton = function (title, content, fileName, popupContent) {
                        if (supportsDownload) {
                            $("<a></a>")
                                .appendTo($div)
                                .text(title)
                                .css(buttonCSS)
                                .attr({
                                    href:   "data:text/html;charset=utf-8," + encodeURIComponent(content)
                                ,   download:   fileName
                                })
                                .click(function () {
                                    ui.closeModal();
                                })
                                ;
                        }
                        else {
                            $("<button></button>")
                                .appendTo($div)
                                .text(title)
                                .css(buttonCSS)
                                .click(function () {
                                    popupContent();
                                    ui.closeModal();
                                })
                                ;
                        }

                    }
                ;
                addButton("Save as HTML", self.toString(), "Overview.html", function () { self.toHTMLSource(); });
                addButton("Save as XHTML5", self.toXML(5), "Overview.xhtml", function () { self.toXHTMLSource(5); });
                addButton("Save as XHTML 1.0", self.toXML(1), "Overview.xhtml", function () { self.toXHTMLSource(1); });
                if (conf.epubGenTool) {
                   $("<button>Save as EPUB 3</button>")
                        .appendTo($div)
                        .css(buttonCSS)
                        .click(function () {
                            self.toEPUB();
                            ui.closeModal();
                        })
                        ;
                }
                if (conf.diffTool && (conf.previousDiffURI || conf.previousURI)) {
                    $("<button>Diff</button>")
                        .appendTo($div)
                        .css(buttonCSS)
                        .click(function () {
                            self.toDiffHTML();
                            ui.closeModal();
                        })
                        ;
                }
                ui.freshModal("Save Snapshot", $div);
            }
            // convert the document to a string (HTML)
        ,   toString:    function () {
                respecEvents.pub("save", "toString")
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
                return str;
            }
            // convert the document to XML, pass 5 as mode for XHTML5
        ,   toXML:        function (mode) {
                respecEvents.pub("save", "toXML" + mode)
                var rootEl = doc.documentElement.cloneNode(true);
                cleanup(rootEl);
                if (mode !== 5) {
                    // not doing xhtml5 so rip out the html5 stuff
                    $.each("section figcaption figure aside".split(" "), function (i, item) {
                        $(item, rootEl).renameElement("div").addClass(item);
                    });
                    $("time", rootEl).renameElement("span").addClass("time").removeAttr('datetime');
                    $("[role]", rootEl).removeAttr('role') ;
                    $("[aria-level]", rootEl).removeAttr('aria-level') ;
                    $("style:not([type])", rootEl).attr("type", "text/css");
                    $("script:not([type])", rootEl).attr("type", "text/javascript");
                }
                var str = "<!DOCTYPE html"
                ,   dt = doc.doctype;
                if (dt && dt.publicId) str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
                else if (mode !== 5) {
                    if (conf.doRDFa) {
                        // use the standard RDFa 1.1 doctype
                        str += " PUBLIC '-//W3C//DTD XHTML+RDFa 1.1//EN' 'http://www.w3.org/MarkUp/DTD/xhtml-rdfa-2.dtd'";
                    } else {
                        str += " PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'";
                    }
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
                        msg.pub("warning", "Cannot handle serialising nodes of type: " + node.nodeType);
                    }
                    return out;
                };
                str += dumpNode(rootEl) + "</html>";
                return str;
            }
            // create a diff marked version against the previousURI
            // strategy - open a window in which there is a form with the
            // data needed for diff marking - submit the form so that the response populates
            // page with the diff marked version
        ,   toDiffHTML:  function () {
                respecEvents.pub("save", "toDiffHTML")
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
            }
        ,   toEPUB:  function () {
                respecEvents.pub("save", "toEPUB")
                var base = window.location.href.replace(/\/[^\/]*$/, "/")
                ,   str = "<!DOCTYPE html>\n<html>\n" +
                          "<head><title>Generating EPUB from respec</title></head>\n" +
                          "<body><form name='form' method='GET' action='" + conf.epubGenTool + "'>\n" +
                          "<input name='type' type='hidden' value='respec'>\n" +
                          "<input name='url'  type='hidden' value='" + document.location.href + "'>\n" +
                          "<p>Submitting, please wait... (it may take a while, because the HTML is also generated through a remove service).</p>"
                          "</form></body></html>" ;
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
            // toXHTML:    function (mode) {
            //     var x = window.open();
            //     x.document.write(this.toXML(mode)) ;
            //     x.document.close();
            // },
            // popup the generated XHTML source
            toXHTMLSource:    function (mode) {
                var x = window.open();
                x.document.write("<pre>" + utils.xmlEscape(this.toXML(mode)) + "</pre>");
                x.document.close();
            }
        };
    }
);
