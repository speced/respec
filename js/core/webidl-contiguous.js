/*global Handlebars */

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
    ,   "tmpl!core/templates/webidl-contiguous/line-comment.html"
    ,   "tmpl!core/templates/webidl-contiguous/multiline-comment.html"
    ,   "tmpl!core/templates/webidl-contiguous/field.html"
    ,   "tmpl!core/templates/webidl-contiguous/exception.html"
    ,   "tmpl!core/templates/webidl-contiguous/extended-attribute.html"
    ,   "tmpl!core/templates/webidl-contiguous/interface.html"
    ],
    function (hb, webidl2, css, idlTypedefTmpl, idlImplementsTmpl, idlDictMemberTmpl, idlDictionaryTmpl,
                   idlEnumItemTmpl, idlEnumTmpl, idlConstTmpl, idlParamTmpl, idlCallbackTmpl, idlMethodTmpl,
              idlAttributeTmpl, idlSerializerTmpl, idlLineCommentTmpl, idlMultiLineCommentTmpl, idlFieldTmpl, idlExceptionTmpl,
              idlExtAttributeTmpl, idlInterfaceTmpl) {
        "use strict";
        function registerHelpers (msg) {
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
            Handlebars.registerHelper("extAttrRhs", function(rhs, options) {
                if (rhs.type === "identifier") {
                    return options.fn(rhs.value);
                }
                return "(" + rhs.value.map(function(item) { return options.fn(item); }).join(",") + ")";
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
                        msg.pub("error", "Unexpected constant value type: " + value.type);
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
                return arr.map(function(elem) { return options.fn(elem); }).join(between);
            });
            Handlebars.registerHelper("joinNonWhitespace", function(arr, between, options) {
                return arr.filter(function(elem) {
                    return elem.type !== "ws";
                }).map(function(elem) {
                    return options.fn(elem);
                }).join(between);
            });
            // A block helper that emits an <a title> around its contents
            // if obj.dfn exists. If it exists, that implies that
            // there's another <dfn> for the object.
            Handlebars.registerHelper("tryLink", function(obj, options) {
                var content = options.fn(this);
                if (obj.dfn) {
                    var result = "<a for='" + Handlebars.Utils.escapeExpression(obj.linkFor || "") + "'";
                    if (obj.name) {
                        result += " data-lt='" + Handlebars.Utils.escapeExpression(obj.name) + "'";
                    }
                    result += ">" + content + "</a>";
                    return result;
                } else {
                    return content;
                }
            });
        }
        function idn (lvl) {
            var str = "";
            for (var i = 0; i < lvl; i++) str += "    ";
            return str;
        }
        function idlType2Html (idlType) {
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
        function idlType2Text(idlType) {
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
        function pads (num) {
            // XXX
            //  this might be more simply done as
            //  return Array(num + 1).join(" ")
            var str = "";
            for (var i = 0; i < num; i++) str += " ";
            return str;
        }
        var whitespaceTypes = {"ws": true, "ws-pea": true, "ws-tpea": true, "line-comment": true, "multiline-comment": true};
        function typeIsWhitespace(webIdlType) {
            return whitespaceTypes[webIdlType];
        }
        function extAttr(extAttrs, indent, singleLine) {
            if (extAttrs.length === 0) {
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
        var idlKeywords = [
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
        ,   AttributeNameKeyword = ["required"];
        function escapeArgumentName(argumentName) {
            if (idlKeywords.indexOf(argumentName) !== -1 && ArgumentNameKeyword.indexOf(argumentName) === -1)
                return "_" + argumentName;
            return argumentName;
        }
        function escapeAttributeName(attributeName) {
            if (idlKeywords.indexOf(attributeName) !== -1 && AttributeNameKeyword.indexOf(attributeName) === -1)
                return "_" + attributeName;
            return attributeName;
        }
        function escapeIdentifier(identifier) {
            if (idlKeywords.indexOf(identifier) !== -1)
                return "_" + identifier;
            return identifier;
        }

        // Takes the result of WebIDL2.parse(), an array of definitions.
        function makeMarkup (parse, msg) {
            var attr = { "class": "idl" };
            var $pre = $("<pre></pre>").attr(attr);
            $pre.html(parse.filter(function(defn) { return !typeIsWhitespace(defn.type); })
                           .map(function(defn) { return writeDefinition(defn, -1, msg); })
                           .join('\n\n'));
            return $pre;
        }

        function writeDefinition (obj, indent, msg) {
            indent++;
            var opt = { indent: indent, obj: obj };
            switch (obj.type) {
                case "typedef":
                    return idlTypedefTmpl(opt);
                case "implements":
                    return idlImplementsTmpl(opt);
                case "interface":
                    return writeInterfaceDefinition(opt);
                case "callback interface":
                    return writeInterfaceDefinition(opt, "callback ");
                case "exception":
                    var maxAttr = 0, maxConst = 0;
                    obj.members.forEach(function (it) {
                        if (typeIsWhitespace(it.type)) {
                            return;
                        }
                        var len = idlType2Text(it.idlType).length;
                        if (it.type === "field")   maxAttr = (len > maxAttr) ? len : maxAttr;
                        else if (it.type === "const") maxConst = (len > maxConst) ? len : maxConst;
                    });
                    var children = obj.members
                                      .map(function (ch) {
                                          switch (ch.type) {
                                            case "field": return writeField(ch, maxAttr, indent + 1);
                                            case "const": return writeConst(ch, maxConst, indent + 1);
                                            case "line-comment": return writeLineComment(ch, indent + 1);
                                            case "multiline-comment": return writeMultiLineComment(ch, indent + 1);
                                            case "ws": return writeBlankLines(ch);
                                            case "ws-pea": break;
                                            default:
                                                throw new Error('Unexpected type in exception: ' + it.type);
                                          }
                                      })
                                      .join("")
                    ;
                    return idlExceptionTmpl({ obj: obj, indent: indent, children: children });
                case "dictionary":
                    var maxQualifiers = 0, maxType = 0;
                    var members = obj.members.filter(function(member) { return !typeIsWhitespace(member.type); });
                    obj.members.forEach(function (it) {
                        if (typeIsWhitespace(it.type)) {
                            return;
                        }
                        var qualifiers = '';
                        if (it.required) qualifiers += 'required ';
                        if (maxQualifiers < qualifiers.length) maxQualifiers = qualifiers.length;

                        var typeLen = idlType2Text(it.idlType).length;
                        if (maxType < typeLen) maxType = typeLen;
                    });
                    var children = obj.members
                                      .map(function (it) {
                                          switch(it.type) {
                                            case "field": return writeMember(it, maxQualifiers, maxType, indent + 1);
                                            case "line-comment": return writeLineComment(it, indent + 1);
                                            case "multiline-comment": return writeMultiLineComment(it, indent + 1);
                                            case "ws": return writeBlankLines(it);
                                            case "ws-pea": break;
                                            default:
                                                throw new Error('Unexpected type in dictionary: ' + it.type);
                                          }
                                      })
                                      .join("")
                    ;
                    return idlDictionaryTmpl({ obj: obj, indent: indent, children: children, partial: obj.partial ? "partial " : "" });
                case "callback":
                    var params = obj.arguments
                                    .filter(function(it) {
                                        return !typeIsWhitespace(it.type);
                                    })
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
                case "enum":
                    var children = "";
                    for (var i = 0; i < obj.values.length; i++) {
                        var item = obj.values[i];
                        switch (item.type) {
                            case undefined:
                                var needsComma = false;
                                for (var j = i + 1; j < obj.values.length; j++) {
                                    var lookahead = obj.values[j];
                                    if (lookahead.type === undefined) break;
                                    if (lookahead.type === ",") {
                                        needsComma = true;
                                        break;
                                    }
                                }
                                children += idlEnumItemTmpl({
                                    obj: item,
                                    parentID: obj.fullPath,
                                    indent: indent + 1,
                                    needsComma: needsComma
                                });
                                break;
                            case "line-comment": children += writeLineComment(item, indent + 1); break;
                            case "multiline-comment": children += writeMultiLineComment(item, indent + 1); break;
                            case "ws": children += writeBlankLines(item); break;
                            case ",":
                            case "ws-pea": break;
                            default:
                                throw new Error('Unexpected type in exception: ' + item.type);
                        }
                    }
                    return idlEnumTmpl({obj: obj, indent: indent, children: children });
                default:
                    msg.pub("error", "Unexpected object type " + obj.type + " in " + JSON.stringify(obj));
                    return "";
            }
        }

        function writeInterfaceDefinition(opt, callback) {
            var obj = opt.obj, indent = opt.indent;
            var maxAttr = 0, maxMeth = 0, maxConst = 0;
            obj.members.forEach(function (it) {
                if (typeIsWhitespace(it.type) || it.type === "serializer") {
                    return;
                }
                var len = idlType2Text(it.idlType).length;
                if (it.static) len += 7;
                if (it.type === "attribute") maxAttr = (len > maxAttr) ? len : maxAttr;
                else if (it.type === "operation") maxMeth = (len > maxMeth) ? len : maxMeth;
                else if (it.type === "const") maxConst = (len > maxConst) ? len : maxConst;
            });
            var children = obj.members
                              .map(function (ch) {
                                  switch (ch.type) {
                                      case "attribute": return writeAttribute(ch, maxAttr, indent + 1);
                                      case "operation": return writeMethod(ch, maxMeth, indent + 1);
                                      case "const": return writeConst(ch, maxConst, indent + 1);
                                      case "serializer": return writeSerializer(ch, indent + 1);
                                      case "ws": return writeBlankLines(ch);
                                      case "line-comment": return writeLineComment(ch, indent + 1);
                                      case "multiline-comment": return writeMultiLineComment(ch, indent + 1);
                                      default: throw new Error("Unexpected member type: " + ch.type);
                                  }
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
        }

        function writeField (attr, max, indent) {
            var pad = max - idlType2Text(attr.idlType).length;
            return idlFieldTmpl({
                obj:        attr
            ,   indent:     indent
            ,   pad:        pad
            });
        }

        function writeAttribute (attr, max, indent) {
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
        }

        function writeMethod (meth, max, indent) {
            var params = meth.arguments
                            .filter(function (it) {
                                return !typeIsWhitespace(it.type);
                            }).map(function (it) {
                                return idlParamTmpl({
                                    obj:        it
                                ,   optional:   it.optional ? "optional " : ""
                                ,   variadic:   it.variadic ? "..." : ""
                                });
                            })
                            .join(", ");
            var len = idlType2Text(meth.idlType).length;
            if (meth.static) len += 7;
            var specialProps = ["getter", "setter", "deleter", "legacycaller", "serializer", "stringifier"];
            var special = "";
            for (var i in specialProps) {
                if (meth[specialProps[i]]) {
                    special = specialProps[i] + " ";
                    len += special.length;
                    break;
                }
            }
            var pad = max - len;
            return idlMethodTmpl({
                obj:        meth
            ,   indent:     indent
            ,   "static":   meth.static ? "static " : ""
            ,   special:    special
            ,   pad:        pad
            ,   children:   params
            });
        }

        function writeConst (cons, max, indent) {
            var pad = max - idlType2Text(cons.idlType).length;
            if (cons.nullable) pad--;
            return idlConstTmpl({ obj: cons, indent: indent, pad: pad, nullable: cons.nullable ? "?" : ""});
        }

        // Writes a single blank line if whitespace includes at least one blank line.
        function writeBlankLines(whitespace) {
            if (/\n.*\n/.test(whitespace.value)) {
                // Members end with a newline, so we only need 1 extra one to get a blank line.
                return "\n";
            }
            return "";
        }

        function writeLineComment (comment, indent) {
            return idlLineCommentTmpl({ indent: indent, comment: comment.value});
        }

        function writeMultiLineComment (comment, indent) {
            // Split the multi-line comment into lines so we can indent it properly.
            var lines = comment.value.split(/\r\n|\r|\n/);
            if (lines.length === 0) {
                return "";
            } else if (lines.length === 1) {
                return idlLineCommentTmpl({ indent: indent, comment: lines[0]});
            }
            var initialSpaces = Math.max(0, /^ */.exec(lines[1])[0].length - 3);
            function trimInitialSpace(line) {
                return line.slice(initialSpaces);
            }
            return idlMultiLineCommentTmpl({
                indent: indent,
                firstLine: lines[0],
                lastLine: trimInitialSpace(lines[lines.length - 1]),
                innerLine: lines.slice(1, -1).map(trimInitialSpace) });
        }

        function writeSerializer (serializer, indent) {
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
        }

        function writeMember (memb, maxQualifiers, maxType, indent) {
            var opt = { obj: memb, indent: indent };
            opt.typePad = maxType - idlType2Text(memb.idlType).length;
            if (memb.required) opt.qualifiers = 'required ';
            else opt.qualifiers = '         ';
            opt.qualifiers = opt.qualifiers.slice(0, maxQualifiers);
            return idlDictMemberTmpl(opt);
        }

        // Each entity defined in IDL is either a top- or second-level entity:
        // Interface or Interface.member. This function finds the <dfn>
        // element defining each entity and attaches it to the entity's
        // 'refTitle' property, and records that it describes an IDL entity by
        // adding a [data-idl] attribute.
        function linkDefinitions(parse, definitionMap, parent, msg) {
            parse.forEach(function(defn) {
                var name;
                switch (defn.type) {
                    // Top-level entities with linkable members.
                    case "callback interface":
                    case "dictionary":
                    case "exception":
                    case "interface":
                        linkDefinitions(defn.members, definitionMap, defn.name, msg);
                        name = defn.name;
                        defn.idlId = "idl-def-" + name.toLowerCase();
                        break;

                    // Top-level entities without linkable members.
                    case "enum":  // TODO: link enum members.
                    case "callback":
                    case "typedef":
                        name = defn.name;
                        defn.idlId = "idl-def-" + name.toLowerCase();
                        break;

                    // Members of top-level entities.
                    case "attribute":
                    case "const":
                    case "field":
                        name = defn.name;
                        defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
                        break;
                    case "operation":
                        if (defn.name) {
                            name = defn.name;
                        } else if (defn.getter || defn.setter || defn.deleter ||
                                   defn.legacycaller || defn.stringifier ||
                                   defn.serializer ) {
                            name = "";
                        }
                        defn.idlId = ("idl-def-" + parent.toLowerCase() + "-" +
                                      name.toLowerCase() + '(' +
                                      defn.arguments.filter(function(arg) {
                                          return !typeIsWhitespace(arg.type);
                                      }).map(function(arg) {
                                          var optional = arg.optional ? "optional-" : "";
                                          var variadic = arg.variadic ? "..." : "";
                                          return optional + idlType2Text(arg.idlType).toLowerCase() + variadic;
                                      }).join(',').replace(/\s/g, '_') + ')');
                        break;
                    case "iterator":
                        name = "iterator";
                        defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
                        break;
                    case "serializer":
                        name = "serializer";
                        defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
                        break;

                    case "implements":
                    case "ws":
                    case "ws-pea":
                    case "ws-tpea":
                    case "line-comment":
                    case "multiline-comment":
                        // Nothing to link here.
                        return;
                    default:
                        msg.pub("error", "Unexpected type when computing refTitles: " + defn.type);
                        return;
                }
                if (parent) {
                    defn.linkFor = parent;
                }
                defn.dfn = findDfn(parent, name, definitionMap, msg);
            });
        }

        // This function looks for a <dfn> element whose title is 'name' and
        // that is "for" 'parent', which is the empty string when 'name'
        // refers to a top-level entity. For top-level entities, <dfn>
        // elements that inherit a non-empty [dfn-for] attribute are also
        // counted as matching.
        //
        // When a matching <dfn> is found, it's given <code> formatting,
        // marked as an IDL definition, and returned.  If no <dfn> is found,
        // the function returns 'undefined'.
        function findDfn(parent, name, definitionMap, msg) {
            parent = parent.toLowerCase();
            name = name.toLowerCase();
            var dfnForArray = definitionMap[name];
            var dfns = [];
            if (dfnForArray) {
                // Definitions that have a title and [for] that exactly match the
                // IDL entity:
                dfns = dfnForArray.filter(function(dfn) {
                    return dfn.attr('data-dfn-for') === parent;
                });
                // If this is a top-level entity, and we didn't find anything with
                // an explicitly empty [for], try <dfn> that inherited a [for].
                if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
                    dfns = dfnForArray;
                }
            }
            // If we haven't found any definitions with explicit [for]
            // and [title], look for a dotted definition, "parent.name".
            if (dfns.length === 0 && parent !== "") {
                var dottedName = parent + '.' + name;
                dfnForArray = definitionMap[dottedName];
                if (dfnForArray !== undefined && dfnForArray.length === 1) {
                    dfns = dfnForArray;
                    // Found it: update the definition to specify its [for] and data-lt.
                    delete definitionMap[dottedName];
                    dfns[0].attr('data-dfn-for', parent);
                    dfns[0].attr('data-lt', name);
                    if (definitionMap[name] === undefined) {
                        definitionMap[name] = [];
                    }
                    definitionMap[name].push(dfns[0]);
                }
            }
            if (dfns.length > 1) {
                msg.pub("error", "Multiple <dfn>s for " + name + (parent ? " in " + parent : ""));
            }
            if (dfns.length === 0) {
                return undefined;
            }
            var dfn = dfns[0];
            // Mark the definition as code.
            dfn.attr('id', "dom-" + (parent ? parent + "-" : "") + name)
            dfn.attr('data-idl', '');
            dfn.attr('data-dfn-for', parent);
            if (dfn.children('code').length === 0 && dfn.parents('code').length === 0)
                dfn.wrapInner('<code></code>');
            return dfn;
        }

        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/webidl-contiguous");
                registerHelpers(msg);
                var $idl = $("pre.idl", doc)
                ,   finish = function () {
                        msg.pub("end", "core/webidl-contiguous");
                        cb();
                    };
                if (!$idl.length) return finish();
                if (!$(".idl", doc).not("pre").length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                }

                var idlNames = [];
                $idl.each(function () {
                    var parse;
                    try {
                        parse = window.WebIDL2.parse($(this).text(), {ws: true});
                    } catch(e) {
                        msg.pub("error", "Failed to parse <pre>" + $idl.text() + "</pre> as IDL: " + (e.stack || e));
                        // Skip this <pre> and move on to the next one.
                        return;
                    }
                    linkDefinitions(parse, conf.definitionMap, "", msg);
                    var $df = makeMarkup(parse, msg);
                    $df.attr({id: this.id});
                    $df.find('.idlAttribute,.idlCallback,.idlConst,.idlDictionary,.idlEnum,.idlException,.idlField,.idlInterface,.idlMember,.idlMethod,.idlSerializer,.idlTypedef')
                        .each(function() {
                            var elem = $(this);
                            var title = elem.attr('data-title').toLowerCase();
                            // Select the nearest ancestor element that can contain members.
                            var parent = elem.parent().closest('.idlDictionary,.idlEnum,.idlException,.idlInterface');
                            if (parent.length) {
                                elem.attr('data-dfn-for', parent.attr('data-title').toLowerCase());
                            }
                            if (!conf.definitionMap[title]) {
                                conf.definitionMap[title] = [];
                            }
                            conf.definitionMap[title].push(elem);
                        });
                    $(this).replaceWith($df);
                });
                doc.normalize();
                finish();
            }
        };
    }
);
