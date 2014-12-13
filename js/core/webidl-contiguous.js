/*global Handlebars, simpleNode */

// Module core/webidl-contiguous
//  Highlights and links WebIDL marked up inside <pre class="idl">.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!

define(
    [
        "handlebars"
    ,   "webidl2"
    ,   "tmpl!core/css/webidl-oldschool.css"
    ,   "tmpl!core/templates/webidl-contiguous/typedef.html"
    ,   "tmpl!core/templates/webidl-contiguous/implements.html"
    ,   "tmpl!core/templates/webidl-contiguous/dict-member.html"
    ,   "tmpl!core/templates/webidl-contiguous/dictionary.html"
    ,   "tmpl!core/templates/webidl-contiguous/enum-item.html"
    ,   "tmpl!core/templates/webidl-contiguous/enum.html"
    ,   "tmpl!core/templates/webidl-contiguous/const.html"
    ,   "tmpl!core/templates/webidl-contiguous/param.html"
    ,   "tmpl!core/templates/webidl-contiguous/callback.html"
    ,   "tmpl!core/templates/webidl-contiguous/method.html"
    ,   "tmpl!core/templates/webidl-contiguous/attribute.html"
    ,   "tmpl!core/templates/webidl-contiguous/serializer.html"
    ,   "tmpl!core/templates/webidl-contiguous/comment.html"
    ,   "tmpl!core/templates/webidl-contiguous/field.html"
    ,   "tmpl!core/templates/webidl-contiguous/exception.html"
    ,   "tmpl!core/templates/webidl-contiguous/extended-attribute.html"
    ,   "tmpl!core/templates/webidl-contiguous/interface.html"
    ],
    function (hb, webidl2, css, idlTypedefTmpl, idlImplementsTmpl, idlDictMemberTmpl, idlDictionaryTmpl,
                   idlEnumItemTmpl, idlEnumTmpl, idlConstTmpl, idlParamTmpl, idlCallbackTmpl, idlMethodTmpl,
              idlAttributeTmpl, idlSerializerTmpl, idlCommentTmpl, idlFieldTmpl, idlExceptionTmpl,
              idlExtAttributeTmpl, idlInterfaceTmpl) {
        "use strict";
        var WebIDLProcessor = function (cfg) {
                this.parent = { type: "module", id: "outermost", children: [] };
                if (!cfg) cfg = {};
                for (var k in cfg) if (cfg.hasOwnProperty(k)) this[k] = cfg[k];

                Handlebars.registerHelper("extAttr", function (obj, indent) {
                    return extAttr(obj.extAttrs, indent, /*singleLine=*/false);
                });
                Handlebars.registerHelper("extAttrInline", function (obj) {
                    return extAttr(obj.extAttrs, 0, /*singleLine=*/true);
                });
                Handlebars.registerHelper("typeExtAttrs", function (obj) {
                    return extAttr(obj.typeExtAttrs, 0, /*singleLine=*/true);
                });
                Handlebars.registerHelper("extAttrClassName", function() {
                    var extAttr = this;
                    if (extAttr.name === "Constructor" || extAttr.name === "NamedConstructor") {
                        return "idlCtor";
                    }
                    return "extAttr";
                });
                Handlebars.registerHelper("param", function (obj) {
                    return new Handlebars.SafeString(
                        idlParamTmpl({
                            obj:        obj
                        ,   optional:   obj.optional ? "optional " : ""
                        ,   variadic:   obj.variadic ? "..." : ""
                        }));
                });
                Handlebars.registerHelper("jsIf", function (condition, options) {
                    if (condition) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                });
                Handlebars.registerHelper("idn", function (indent) {
                    return new Handlebars.SafeString(idn(indent));
                });
                Handlebars.registerHelper("idlType", function (obj) {
                    return new Handlebars.SafeString(idlType2Html(obj.idlType));
                });
                Handlebars.registerHelper("stringifyIdlConst", function (value) {
                    switch (value.type) {
                        case "null": return "null";
                        case "Infinity": return value.negative ? "-Infinity" : "Infinity";
                        case "NaN": return "NaN";
                        case "string":
                        case "number":
                        case "boolean":
                        case "sequence":
                            return JSON.stringify(value.value);
                        default:
                            cfg.msg.pub("error", "Unexpected constant value type: " + value.type);
                            return "<Unknown>";
                    }
                });
                Handlebars.registerHelper("escapeArgumentName", escapeArgumentName);
                Handlebars.registerHelper("escapeAttributeName", escapeAttributeName);
                Handlebars.registerHelper("escapeIdentifier", escapeIdentifier);
                Handlebars.registerHelper("pads", function (num) {
                    return new Handlebars.SafeString(pads(num));
                });
                Handlebars.registerHelper("join", function(arr, between, options) {
                    return new Handlebars.SafeString(arr.map(function(elem) { return options.fn(elem); }).join(between));
                });
                // A block helper that emits  an <a href> around its contents
                // if obj.refTitle exists. If it exists, that implies that
                // there's another <dfn> for the object.
                Handlebars.registerHelper("tryLink", function(obj, options) {
                    var content = options.fn(this);
                    if (obj.refTitle) {
                        return "<a title='" + Handlebars.Utils.escapeExpression(obj.refTitle) + "'>" + content + "</a>";
                    } else {
                        return content;
                    }
                });
            }
        ,   idn = function (lvl) {
                var str = "";
                for (var i = 0; i < lvl; i++) str += "    ";
                return str;
            }
        ,   idlType2Html = function (idlType) {
                if (typeof idlType === "string") {
                    return "<a>" + Handlebars.Utils.escapeExpression(idlType) + "</a>";
                }
                var nullable = idlType.nullable ? "?" : "";
                if (idlType.union) {
                    return '(' + idlType.idlType.map(function(type) {
                        return idlType2Html(type);
                    }).join(' or ') + ')' + nullable;
                }
                if (idlType.array) {
                    var arrayStr = '';
                    for (var i = 0; i < idlType.array; ++i) {
                        if (idlType.nullableArray[i]) {
                            arrayStr += '?';
                        }
                        arrayStr += '[]';
                    }
                    return idlType2Html({
                            generic: idlType.generic,
                            idlType: idlType.idlType,
                        }) + arrayStr + nullable;
                }
                if (idlType.generic) {
                    return Handlebars.Utils.escapeExpression(idlType.generic) + '&lt;' + idlType2Html(idlType.idlType) + '>' + nullable;
                }
                return idlType2Html(idlType.idlType) + nullable;
            }
        ,   idlType2Text = function(idlType) {
                if (typeof idlType === 'string') {
                    return idlType;
                }
                var nullable = idlType.nullable ? "?" : "";
                if (idlType.union) {
                    return '(' + idlType.idlType.map(function(type) {
                        return idlType2Text(type);
                    }).join(' or ') + ')' + nullable;
                }
                if (idlType.array) {
                    var arrayStr = '';
                    for (var i = 0; i < idlType.array; ++i) {
                        if (idlType.nullableArray[i]) {
                            arrayStr += '?';
                        }
                        arrayStr += '[]';
                    }
                    return idlType2Text({
                            generic: idlType.generic,
                            idlType: idlType.idlType,
                        }) + arrayStr + nullable;
                }
                if (idlType.generic) {
                    return idlType.generic + '<' + idlType2Text(idlType.idlType) + '>' + nullable;
                }
                return idlType2Text(idlType.idlType) + nullable;
            }
        ,   pads = function (num) {
                // XXX
                //  this might be more simply done as
                //  return Array(num + 1).join(" ")
                var str = "";
                for (var i = 0; i < num; i++) str += " ";
                return str;
            }
        ,   extAttr = function(extAttrs, indent, singleLine) {
                if (extAttrs.length == 0) {
                    // If there are no extended attributes, omit the [] entirely.
                    return "";
                }
                var opt = {
                    extAttrs: extAttrs,
                    indent: indent,
                    sep: singleLine ? ", " : ",\n " + idn(indent),
                    end: singleLine ? " " : "\n",
                };
                return new Handlebars.SafeString(idlExtAttributeTmpl(opt));
            }
        ,   idlKeywords = [
                "ByteString",
                "DOMString",
                "Date",
                "Infinity",
                "NaN",
                "RegExp",
                "USVString",
                "any",
                "attribute",
                "boolean",
                "byte",
                "callback",
                "const",
                "creator",
                "deleter",
                "dictionary",
                "double",
                "enum",
                "false",
                "float",
                "getter",
                "implements",
                "inherit",
                "interface",
                "iterable",
                "legacycaller",
                "legacyiterable",
                "long",
                "maplike",
                "null",
                "object",
                "octet",
                "optional",
                "or",
                "partial",
                "readonly",
                "required",
                "sequence",
                "serializer",
                "setlike",
                "setter",
                "short",
                "static",
                "stringifier",
                "true",
                "typedef",
                "unrestricted",
                "unsigned",
                "void",
            ]
        ,   ArgumentNameKeyword = [
                "attribute",
                "callback",
                "const",
                "creator",
                "deleter",
                "dictionary",
                "enum",
                "getter",
                "implements",
                "inherit",
                "interface",
                "iterable",
                "legacycaller",
                "legacyiterable",
                "maplike",
                "partial",
                "required",
                "serializer",
                "setlike",
                "setter",
                "static",
                "stringifier",
                "typedef",
                "unrestricted",
            ]
        ,   AttributeNameKeyword = ["required"]
        ,   escapeArgumentName = function(argumentName) {
                if (idlKeywords.indexOf(argumentName) != -1 && ArgumentNameKeyword.indexOf(argumentName) == -1)
                    return "_" + argumentName;
                return argumentName;
            }
        ,   escapeAttributeName = function(attributeName) {
                if (idlKeywords.indexOf(attributeName) != -1 && AttributeNameKeyword.indexOf(attributeName) == -1)
                    return "_" + attributeName;
                return attributeName;
            }
        ,   escapeIdentifier = function(identifier) {
                if (idlKeywords.indexOf(identifier) != -1)
                    return "_" + identifier;
                return identifier;
            }
        ,   sanitiseID = function(id) {
                id = id.split(/[^\-.0-9a-zA-Z_]/).join("-");
                id = id.replace(/^-+/g, "");
                id = id.replace(/-+$/, "");
                if (id.length > 0 && /^[^a-z]/.test(id)) id = "x" + id;
                if (id.length === 0) id = "generatedID";
                return id;
            }
        ;
        WebIDLProcessor.prototype = {
            // Takes the result of WebIDL2.parse(), an array of definitions.
            makeMarkup:    function (parse) {
                var self = this;
                var attr = { "class": "idl" };
                var $pre = $("<pre></pre>").attr(attr);
                $pre.html(parse.map(function(defn) { return self.writeDefinition(defn, -1); })
                               .join('<br><br>'));
                return $pre;
            },

            writeDefinition:    function (obj, indent) {
                indent++;
                var opt = { indent: indent, obj: obj, proc: this }
                ,   self = this;
                var dfnTypes = {
                    "typedef": function() {
                        return idlTypedefTmpl(opt);
                    },
                    "implements": function() {
                        return idlImplementsTmpl(opt);
                    },
                    "interface": function() {
                        return self.writeInterfaceDefinition(opt);
                    },
                    "callback interface": function() {
                        return self.writeInterfaceDefinition(opt, "callback ");
                    },
                    "exception": function() {
                        var maxAttr = 0, maxConst = 0;
                        obj.members.forEach(function (it) {
                            var len = idlType2Text(it.idlType).length;
                            if (it.type === "field")   maxAttr = (len > maxAttr) ? len : maxAttr;
                            else if (it.type === "const") maxConst = (len > maxConst) ? len : maxConst;
                        });
                        var children = obj.members
                                          .map(function (ch) {
                                              if (ch.type === "field") return self.writeField(ch, maxAttr, indent + 1);
                                              else if (ch.type === "const") return self.writeConst(ch, maxConst, indent + 1);
                                          })
                                          .join("")
                        ;
                        return idlExceptionTmpl({ obj: obj, indent: indent, children: children });
                    },

                    "dictionary": function() {
                        var max = 0;
                        obj.members.forEach(function (it) {
                            var len = idlType2Text(it.idlType).length;
                            max = (len > max) ? len : max;
                        });
                        var children = obj.members
                                          .map(function (it) {
                                              return self.writeMember(it, max, indent + 1);
                                          })
                                          .join("")
                        ;
                        return idlDictionaryTmpl({ obj: obj, indent: indent, children: children, partial: obj.partial ? "partial " : "" });
                    },

                    "callback": function() {
                        var params = obj.arguments
                                        .map(function (it) {
                                            return idlParamTmpl({
                                                obj:        it
                                            ,   optional:   it.optional ? "optional " : ""
                                            ,   variadic:   it.variadic ? "..." : ""
                                            });
                                        })
                                        .join(", ");
                        return idlCallbackTmpl({
                            obj:        obj
                        ,   indent:     indent
                        ,   children:   params
                        });
                    },

                    "enum": function() {
                        var children = obj.values
                                          .map(function (it) { return idlEnumItemTmpl({ obj: it, parentID: obj.fullPath, indent: indent + 1 }); })
                                          .join(",\n");
                        return idlEnumTmpl({obj: obj, indent: indent, children: children });
                    },
                };
                if (!(obj.type in dfnTypes)) {
                    this.msg.pub("error", "Unexpected object type " + obj.type + " in " + JSON.stringify(obj));
                }
                return dfnTypes[obj.type]();
            },

            writeInterfaceDefinition: function(opt, callback) {
                var obj = opt.obj, indent = opt.indent;
                // stop gap fix for duplicate IDs while we're transitioning the code
                var self = this
                ,   maxAttr = 0, maxMeth = 0, maxConst = 0;
                obj.members.forEach(function (it) {
                    if (it.type === "serializer") return;
                    var len = idlType2Text(it.idlType).length;
                    if (it.static) len += 7;
                    if (it.type == "attribute") maxAttr = (len > maxAttr) ? len : maxAttr;
                    else if (it.type == "operation") maxMeth = (len > maxMeth) ? len : maxMeth;
                    else if (it.type == "const") maxConst = (len > maxConst) ? len : maxConst;
                });
                var children = obj.members
                                  .map(function (ch) {
                                      if (ch.type == "attribute") return self.writeAttribute(ch, maxAttr, indent + 1);
                                      else if (ch.type == "operation") return self.writeMethod(ch, maxMeth, indent + 1);
                                      else if (ch.type == "const") return self.writeConst(ch, maxConst, indent + 1);
                                      else if (ch.type == "serializer") return self.writeSerializer(ch, indent + 1);
                                      else throw new Error("Unexpected member type: " + ch.type);
                                  })
                                  .join("")
                ;
                return idlInterfaceTmpl({
                    obj:        obj
                ,   indent:     indent
                ,   partial:    obj.partial ? "partial " : ""
                ,   callback:   callback
                ,   children:   children
                });
            },

            writeField:    function (attr, max, indent) {
                var pad = max - idlType2Text(attr.idlType).length;
                return idlFieldTmpl({
                    obj:        attr
                ,   indent:     indent
                ,   pad:        pad
                });
            },

            writeAttribute:    function (attr, max, indent) {
                var len = idlType2Text(attr.idlType).length;
                var pad = max - len;
                var qualifiers = "";
                if (attr.static) qualifiers += "static ";
                if (attr.stringifier) qualifiers += "stringifier ";
                if (attr.inherit) qualifiers += "inherit ";
                if (attr.readonly) qualifiers += "readonly ";
                qualifiers += "           ";
                qualifiers = qualifiers.slice(0, 11);
                return idlAttributeTmpl({
                    obj:            attr
                ,   indent:         indent
                ,   qualifiers:     qualifiers
                ,   pad:            pad
                });
            },

            writeMethod:    function (meth, max, indent) {
                var params = meth.arguments
                                .map(function (it) {
                                    return idlParamTmpl({
                                        obj:        it
                                    ,   optional:   it.optional ? "optional " : ""
                                    ,   variadic:   it.variadic ? "..." : ""
                                    });
                                })
                                .join(", ");
                var len = idlType2Text(meth.idlType).length;
                if (meth.static) len += 7;
                var pad = max - len;
                return idlMethodTmpl({
                    obj:        meth
                ,   indent:     indent
                ,   "static":   meth.static ? "static " : ""
                ,   pad:        pad
                ,   children:   params
                });
            },

            writeConst:    function (cons, max, indent) {
                var pad = max - idlType2Text(cons.idlType).length;
                if (cons.nullable) pad--;
                return idlConstTmpl({ obj: cons, indent: indent, pad: pad, nullable: cons.nullable ? "?" : ""});
            },

            writeComment:   function (comment, indent) {
                return idlCommentTmpl({ obj: comment, indent: indent, comment: comment.id});
            },

            writeSerializer: function (serializer, indent) {
                var values = "";
                if (serializer.patternMap) {
                    values = "{" + serializer.names.join(", ") + "}";
                }
                else if (serializer.patternList) {
                    values = "[" + listValues.join(", ") + "]";
                }
                else if (serializer.name) {
                    values = serializer.name;
                }
                return idlSerializerTmpl({
                    obj:        serializer
                ,   indent:     indent
                ,   values:     values
                });
            },

            writeMember:    function (memb, max, indent) {
                var opt = { obj: memb, indent: indent };
                opt.pad = max - idlType2Text(memb.idlType).length;
                return idlDictMemberTmpl(opt);
            }
        };

        // Each entity defined in IDL has a complete path like
        // "window.Interface.operation(ParamType1, optional ParamType2)". This
        // function recursively computes the path of everything in a parse
        // tree, and uses findRefTitle() to assign a "suffix" of the path to the
        // parse node's 'refTitle' attribute.
        function computeRefTitles(parse, root, definitionMap) {
            function combinePath(name) {
                if (root === "")
                    return name;
                return root + "." + name;
            }
            parse.forEach(function(defn) {
                var fullPath;
                switch (defn.type) {
                    case "callback interface":
                    case "dictionary":
                    case "enum":
                    case "exception":
                    case "interface":
                        fullPath = combinePath(defn.name);
                        if (defn.type != "enum") {
                            computeRefTitles(defn.members, fullPath, definitionMap);
                        }
                        break;

                    case "callback":
                    case "typedef":
                    case "attribute":
                    case "const":
                    case "field":
                        fullPath = combinePath(defn.name);
                        break;

                    case "operation":
                        fullPath = (combinePath(defn.name) + '(' +
                                    defn.arguments.map(function(arg) {
                                        var optional = arg.optional ? "optional-" : "";
                                        var variadic = arg.variadic ? "..." : "";
                                        return optional + idlType2Text(arg.idlType) + variadic;
                                    }).join(',') + ')');
                        break;
                    case "iterator":
                        fullPath = combinePath("iterator");
                        break;
                    case "serializer":
                        fullPath = combinePath("serializer");
                        break;

                    case "implements":
                        // Nothing to link here.
                        return;
                    default:
                        throw new Error("Unexpected type when computing refTitles: " + defn.type);
                }
                defn.fullPath = fullPath.toLowerCase();
                defn.refTitle = findRefTitle(defn.fullPath, definitionMap);
            });
        }

        // This function looks for "suffixes" of 'fullPath' in the document's
        // <dfn> elements and sets the refTitle of the entity's representation
        // in the parse tree to point to that element. For operations,
        // versions of the 'fullPath' are also tried with the parameters
        // removed.
        //
        // When a matching <dfn> is found, it's given <code> formatting.  If
        // no <dfn> is found, the function returns 'undefined'.
        //
        // Suffixes are tried in descending order of precision. For example,
        // in the path "window.Interface.operation(ParamType1, optional
        // ParamType2)", the order would be:
        //  1) window.Interface.operation(ParamType1, optional ParamType2)
        //  2) Interface.operation(ParamType1, optional ParamType2)
        //  3) operation(ParamType1, optional ParamType2)
        //  4) window.Interface.operation
        //  5) Interface.operation
        //  6) operation
        function findRefTitle(fullPath, definitionMap) {
            fullPath = fullPath.toLowerCase();
            function searchSuffixes(path) {
                while (true) {
                    if (definitionMap[path])
                        return path;
                    var firstDot = path.indexOf('.');
                    if (firstDot == -1)
                        break;
                    path = path.slice(firstDot + 1);
                }
                return undefined;
            }
            var result = searchSuffixes(fullPath);
            if (!result) {
                // If the path is an operation or serializer, we want to try again without the parameters.
                var paramStart = fullPath.indexOf("(");
                if (paramStart == -1)
                    return undefined;
                result = searchSuffixes(fullPath.slice(0, paramStart));
            }
            if (!result)
                return undefined;
            var dfn = definitionMap[result];
            // Mark the definition as code.
            if (dfn.children('code').length == 0 && dfn.parents('code').length == 0)
                dfn.wrapInner('<code></code>');
            return result;
        }

        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/webidl-contiguous");
                var $idl = $("pre.idl", doc)
                ,   finish = function () {
                        msg.pub("end", "core/webidl-contiguous");
                        cb();
                    };
                if (!$idl.length) return finish();
                if (!$(".idl", doc).not("pre").length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                }

                var infNames = [];
                $idl.each(function () {
                    var w = new WebIDLProcessor({ msg: msg, doc: doc, conf: conf })
                    ,   parse;
                    try {
                        parse = window.WebIDL2.parse($(this).text());
                    } catch(e) {
                        msg.pub("error", "Failed to parse <pre>" + $idl.text() + "</pre> as IDL: " + (e.stack || e));
                        // Skip this <pre> and move on to the next one.
                        return;
                    }
                    computeRefTitles(parse, "", conf.definitionMap);
                    var $df = w.makeMarkup(parse);
                    $df.attr({id: this.id});
                    $.merge(infNames,
                            $df.find('.idlInterface,.idlException,.idlDictionary,.idlTypedef,.idlCallback,.idlEnum')
                               .map(function() { return this.id; }).get());
                    $(this).replaceWith($df);
                });
                doc.normalize();
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var name = $ant.dfnTitle();
                    if (!conf.definitionMap[name] && $.inArray('idl-def-' + name, infNames) !== -1) {
                        $ant.attr("href", "#idl-def-" + name)
                            .addClass("idlType")
                            .wrapInner("<code></code>");
                    }
                });
                finish();
            }
        };
    }
);
