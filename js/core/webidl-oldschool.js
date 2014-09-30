/*global Handlebars, simpleNode */

// Module core/webidl-oldschool
//  Transforms specific markup into the complex old school rendering for API information.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!

var sn;
define(
    [
        "handlebars"
    ,   "tmpl!core/css/webidl-oldschool.css"
    ,   "tmpl!core/templates/webidl/module.html"
    ,   "tmpl!core/templates/webidl/typedef.html"
    ,   "tmpl!core/templates/webidl/implements.html"
    ,   "tmpl!core/templates/webidl/dict-member.html"
    ,   "tmpl!core/templates/webidl/dictionary.html"
    ,   "tmpl!core/templates/webidl/enum-item.html"
    ,   "tmpl!core/templates/webidl/enum.html"
    ,   "tmpl!core/templates/webidl/const.html"
    ,   "tmpl!core/templates/webidl/param.html"
    ,   "tmpl!core/templates/webidl/callback.html"
    ,   "tmpl!core/templates/webidl/method.html"
    ,   "tmpl!core/templates/webidl/constructor.html"
    ,   "tmpl!core/templates/webidl/attribute.html"
    ,   "tmpl!core/templates/webidl/serializer.html"
    ,   "tmpl!core/templates/webidl/comment.html"
    ,   "tmpl!core/templates/webidl/field.html"
    ,   "tmpl!core/templates/webidl/exception.html"
    ,   "tmpl!core/templates/webidl/interface.html"
    ],
    function (hb, css, idlModuleTmpl, idlTypedefTmpl, idlImplementsTmpl, idlDictMemberTmpl, idlDictionaryTmpl,
                   idlEnumItemTmpl, idlEnumTmpl, idlConstTmpl, idlParamTmpl, idlCallbackTmpl, idlMethodTmpl,
              idlConstructorTmpl, idlAttributeTmpl, idlSerializerTmpl, idlCommentTmpl, idlFieldTmpl, idlExceptionTmpl, idlInterfaceTmpl) {
        var WebIDLProcessor = function (cfg) {
                this.parent = { type: "module", id: "outermost", children: [] };
                if (!cfg) cfg = {};
                for (var k in cfg) if (cfg.hasOwnProperty(k)) this[k] = cfg[k];

                Handlebars.registerHelper("extAttr", function (obj, indent, nl, ctor) {
                    var ret = "";
                    if (obj.extendedAttributes) {
                        ret += idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>" +
                               (typeof ctor === 'string' && ctor.length ? ",\n" + ctor : "") + "]" + (nl ? "\n" : " ");
                    }
                    else if (typeof ctor === 'string' && ctor.length) {
                        ret += idn(indent) + "[" + ctor + "]" + (nl ? "\n" : " ");
                    }
                    return new Handlebars.SafeString(ret);
                });
                Handlebars.registerHelper("param", function (obj, children) {
                    var param = "";
                    if (children) param += " (" + children + ")";
                    return new Handlebars.SafeString(param);
                });
                Handlebars.registerHelper("idn", function (indent) {
                    return new Handlebars.SafeString(idn(indent));
                });
                Handlebars.registerHelper("asWebIDL", function (proc, obj, indent) {
                    return new Handlebars.SafeString(proc.writeAsWebIDL(obj, indent));
                });
                Handlebars.registerHelper("datatype", function (text) {
                    return new Handlebars.SafeString(datatype(text));
                });
                Handlebars.registerHelper("pads", function (num) {
                    return new Handlebars.SafeString(pads(num));
                });
                Handlebars.registerHelper("superclasses", function (obj) {
                    if (!obj.superclasses || !obj.superclasses.length) return "";
                    var str = " : " +
                              obj.superclasses.map(function (it) {
                                                    return "<span class='idlSuperclass'><a>" + it + "</a></span>";
                                                  }).join(", ")
                    ;
                    return new Handlebars.SafeString(str);
                });
            }
        ,   idn = function (lvl) {
                var str = "";
                for (var i = 0; i < lvl; i++) str += "    ";
                return str;
            }
        ,   norm = function (str) {
                return str.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
            }
        ,   arrsq = function (obj) {
                var str = "";
                for (var i = 0, n = obj.arrayCount; i < n; i++) str += "[]";
                return str;
            }
        ,   datatype = function (text) {
                if ($.isArray(text)) {
                    var arr = [];
                    for (var i = 0, n = text.length; i < n; i++) arr.push(datatype(text[i]));
                    return "(" + arr.join(" or ") + ")";
                }
                else {
                    var matched = /^(sequence|Promise)<(.+)>$/.exec(text);
                    if (matched)
                        return matched[1] + "&lt;<a>" + datatype(matched[2]) + "</a>&gt;";

                    return "<a>" + text + "</a>";
                }
            }
        ,   pads = function (num) {
                // XXX
                //  this might be more simply done as
                //  return Array(num + 1).join(" ")
                var str = "";
                for (var i = 0; i < num; i++) str += " ";
                return str;
            }
        ;
        WebIDLProcessor.prototype = {
            setID:  function (obj, match) {
                obj.id = match;
                obj.refId = obj.id.replace(/[^a-zA-Z_\-]/g, "");
		obj.unescapedId = (obj.id[0] == "_" ? obj.id.slice(1) : obj.id);
            }
        ,   nullable:   function (obj, type) {
                obj.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    obj.nullable = true;
                }
                return type;
            }
        ,   array:   function (obj, type) {
                obj.array = false;
                if (/\[\]$/.test(type)) {
                    obj.arrayCount = 0;
                    type = type.replace(/(?:\[\])/g, function () {
                        obj.arrayCount++;
                        return "";
                    });
                    obj.array = true;
                }
                return type;
            }
        ,   params: function (prm, $dd, obj) {
                var p = {};
                prm = this.parseExtendedAttributes(prm, p);
                // either up to end of string, or up to ,
                // var re = /^\s*(?:in\s+)?([^,]+)\s+\b([^,\s]+)\s*(?:,)?\s*/;
                var re = /^\s*(?:in\s+)?([^,=]+)\s+\b([^,]+)\s*(?:,)?\s*/;
                var match = re.exec(prm);
                if (match) {
                    prm = prm.replace(re, "");
                    var type = match[1]
                    ,   name = match[2]
                    ,   components = name.split(/\s*=\s*/)
                    ,   deflt = null
                    ;
                    if (components.length === 1) name = name.replace(/\s+/g, "");
                    else {
                        name = components[0];
                        deflt = components[1];
                    }
                    this.parseDatatype(p, type);
                    p.defaultValue = deflt;
                    this.setID(p, name);
                    if ($dd) p.description = $dd.contents();
                    obj.params.push(p);
                }
                else {
                    this.msg.pub("error", "Expected parameter list, got: " + prm);
                    return false;
                }
                return prm;
            }
        ,   optional:   function (p) {
                if (p.isUnionType) {
                    p.optional = false;
                    return false;
                }
                else {
                    var pkw = p.datatype.split(/\s+/)
                    ,   idx = pkw.indexOf("optional")
                    ,   isOptional = false;
                    if (idx > -1) {
                        isOptional = true;
                        pkw.splice(idx, 1);
                        p.datatype = pkw.join(" ");
                    }
                    p.optional = isOptional;
                    return isOptional;
                }
            }


        ,   definition:    function ($idl) {
                var def = { children: [] }
                ,   str = $idl.attr("title")
                ,   id = $idl.attr("id");
                if (!str) this.msg.pub("error", "No IDL definition in element.");
                str = this.parseExtendedAttributes(str, def);
                if (str.indexOf("partial") === 0) { // Could be interface or dictionary
                    var defType = str.slice(8);
                    if  (defType.indexOf("interface") === 0)        this.processInterface(def, str, $idl, { partial : true });
                    else if (defType.indexOf("dictionary") === 0)   this.dictionary(def, defType, $idl, { partial : true });
                    else    this.msg.pub("error", "Expected definition, got: " + str);
                }
                else if      (str.indexOf("interface") === 0 ||
                         /^callback\s+interface\b/.test(str))   this.processInterface(def, str, $idl);
                else if (str.indexOf("exception") === 0)        this.exception(def, str, $idl);
                else if (str.indexOf("dictionary") === 0)       this.dictionary(def, str, $idl);
                else if (str.indexOf("callback") === 0)         this.callback(def, str, $idl);
                else if (str.indexOf("enum") === 0)             this.processEnum(def, str, $idl);
                else if (str.indexOf("typedef") === 0)          this.typedef(def, str, $idl);
                else if (/\bimplements\b/.test(str))            this.processImplements(def, str, $idl);
                else    this.msg.pub("error", "Expected definition, got: " + str);
                this.parent.children.push(def);
                this.processMembers(def, $idl);
                if (id) def.htmlID = id;
                return def;
            },

            processInterface:  function (obj, str, $idl, opt) {
                opt = opt || {};
                obj.type = "interface";
                obj.partial = opt.partial || false;

                var match = /^\s*(?:(partial|callback)\s+)?interface\s+([A-Za-z][A-Za-z0-9]*)(?:\s+:\s*([^{]+)\s*)?/.exec(str);
                if (match) {
                    obj.callback = !!match[1] && match[1] === "callback";
                    this.setID(obj, match[2]);
                    if ($idl.attr('data-merge')) obj.merge = $idl.attr('data-merge').split(' ');
                    if (match[3]) obj.superclasses = match[3].split(/\s*,\s*/);
                }
                else this.msg.pub("error", "Expected interface, got: " + str);
                return obj;
            },

            dictionary:  function (obj, str, $idl, opt) {
                opt = opt || {};
                obj.partial = opt.partial || false;
                return this.excDic("dictionary", obj, str, $idl);
            },

            exception:  function (obj, str, $idl) {
                return this.excDic("exception", obj, str, $idl);
            },

            excDic:  function (type, obj, str) {
                obj.type = type;
                var re = new RegExp("^\\s*" + type + "\\s+([A-Za-z][A-Za-z0-9]*)(?:\\s+:\\s*([^{]+)\\s*)?\\s*")
                ,   match = re.exec(str);
                if (match) {
                    this.setID(obj, match[1]);
                    if (match[2]) obj.superclasses = match[2].split(/\s*,\s*/);
                }
                else this.msg.pub("error", "Expected " + type + ", got: " + str);
                return obj;
            },

            callback:  function (obj, str) {
                obj.type = "callback";
                var match = /^\s*callback\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*\b(.*?)\s*$/.exec(str);
                if (match) {
                    this.setID(obj, match[1]);
                    var type = match[2];
                    this.parseDatatype(obj, type);
                }
                else this.msg.pub("error", "Expected callback, got: " + str);
                return obj;
            },

            processEnum:  function (obj, str) {
                obj.type = "enum";
                var match = /^\s*enum\s+([A-Za-z][A-Za-z0-9]*)\s*$/.exec(str);
                if (match) this.setID(obj, match[1]);
                else this.msg.pub("error", "Expected enum, got: " + str);
                return obj;
            },

            typedef:    function (obj, str, $idl) {
                obj.type = "typedef";
                str = str.replace(/^\s*typedef\s+/, "");
                str = this.parseExtendedAttributes(str, obj);
                var match = /^(.+)\s+(\S+)\s*$/.exec(str);
                if (match) {
                    var type = match[1];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);
                    obj.description = $idl.contents();
                }
                else this.msg.pub("error", "Expected typedef, got: " + str);
                return obj;
            },

            processImplements: function (obj, str, $idl) {
                obj.type = "implements";
                var match = /^\s*(.+?)\s+implements\s+(.+)\s*$/.exec(str);
                if (match) {
                    this.setID(obj, match[1]);
                    obj.datatype = match[2];
                    obj.description = $idl.contents();
                }
                else this.msg.pub("error", "Expected implements, got: " + str);
                return obj;
            },

            processMembers:    function (obj, $el) {
                var exParent = this.parent
                ,   self = this;
                this.parent = obj;
                $el.find("> dt").each(function () {
                    var $dt = $(this)
                    ,   $dd = $dt.next()
                    ,   t = obj.type
                    ,   mem
                    ;
                    if      (t === "exception")     mem = self.exceptionMember($dt, $dd);
                    else if (t === "dictionary")    mem = self.dictionaryMember($dt, $dd);
                    else if (t === "callback")      mem = self.callbackMember($dt, $dd);
                    else if (t === "enum")          mem = self.processEnumMember($dt, $dd);
                    else                            mem = self.interfaceMember($dt, $dd);
                    obj.children.push(mem);
                });
                this.parent = exParent;
            },

            parseConst:    function (obj, str) {
                // CONST
                var match = /^\s*const\s+\b([^=]+\??)\s+([^=\s]+)\s*=\s*(.*)$/.exec(str);
                if (match) {
                    obj.type = "constant";
                    var type = match[1];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);
                    obj.value = match[3];
                    return true;
                }
                return false;
            },

            exceptionMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // CONST
                if (this.parseConst(obj, str)) return obj;

                // FIELD
                var match = /^\s*(.*?)\s+(\S+)\s*$/.exec(str);
                if (match) {
                    obj.type = "field";
                    var type = match[1];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected exception member, got: " + str);
            },

            dictionaryMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // MEMBER
                var match = /^\s*([^=]+\??)\s+([^=\s]+)(?:\s*=\s*(.*))?$/.exec(str);
                if (match) {
                    obj.type = "member";
                    var type = match[1];
                    obj.defaultValue = match[3];
                    this.setID(obj, match[2]);
                    this.parseDatatype(obj, type);
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected dictionary member, got: " + str);
            },

            callbackMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // MEMBER
                var match = /^\s*(.*?)\s+([A-Za-z][A-Za-z0-9]*)\s*$/.exec(str);
                if (match) {
                    obj.type = "member";
                    var type = match[1];
                    this.setID(obj, match[2]);
                    obj.defaultValue = match[3];
                    this.parseDatatype(obj, type);
                    this.optional(obj);
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected callback member, got: " + str);
            },

            processEnumMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // MEMBER
                obj.type = "member";
                this.setID(obj, str);
                obj.refId = sn.sanitiseID(obj.id); // override with different ID type
                return obj;
            },

            interfaceMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text())
                ,   $extPrm = $dd.find("dl.parameters").first()
                ,   $sgrs = $dd.find(".getraises, .setraises")
                ,   $excepts = $dd.find("dl.exception").first()
                ;
                obj.description = $dd.contents().not("dl.parameters");
                str = this.parseExtendedAttributes(str, obj);
                var match;

                // ATTRIBUTE
                match = /^\s*(?:(readonly|inherit|stringifier)\s+)?attribute\s+(.*?)\s+(\S+)\s*$/.exec(str);
                if (match) {
                    obj.type = "attribute";
                    obj.declaration = match[1] ? match[1] : "";
                    obj.declaration += (new Array(12-obj.declaration.length)).join(" "); // fill string with spaces
                    var type = match[2];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[3]);
                    obj.raises = [];
                    $sgrs.each(function () {
                        var $el = $(this)
                        ,   exc = {
                                id:     $el.attr("title")
                            ,   onSet:  $el.hasClass("setraises")
                            ,   onGet:  $el.hasClass("getraises")
                        };
                        if ($el.is("dl")) {
                            exc.type = "codelist";
                            exc.description = [];
                            $el.find("dt").each(function () {
                                var $dt = $(this)
                                ,   $dd = $dt.next("dd");
                                exc.description.push({ id: $dt.text(), description: $dd.contents().clone() });
                            });
                        }
                        else if ($el.is("div")) {
                            exc.type = "simple";
                            exc.description = $el.contents().clone();
                        }
                        else {
                            this.msg.pub("error", "Do not know what to do with exceptions being raised defined outside of a div or dl.");
                        }
                        $el.remove();
                        obj.raises.push(exc);
                    });

                    return obj;
                }

                // CONST
                if (this.parseConst(obj, str)) return obj;

                // CONSTRUCTOR
                match = /^\s*Constructor(?:\s*\(\s*(.*)\s*\))?\s*$/.exec(str);
                if (match) {
                    obj.type = "constructor";
                    var prm = match[1] ? match[1] : [];
                    this.setID(obj, this.parent.id);
                    obj.named = false;
                    obj.datatype = "";

                    return this.methodMember(obj, $excepts, $extPrm, prm);
                }

                // NAMED CONSTRUCTOR
                match = /^\s*NamedConstructor\s*(?:=\s*)?\b([^(]+)(?:\s*\(\s*(.*)\s*\))?\s*$/.exec(str);
                if (match) {
                    obj.type = "constructor";
                    var prm = match[2] ? match[2] : [];
                    this.setID(obj, match[1]);
                    obj.named = true;
                    obj.datatype = "";

                    return this.methodMember(obj, $excepts, $extPrm, prm);
                }

                // METHOD
                match = /^\s*(.*?)\s+\b(\S+?)\s*\(\s*(.*)\s*\)\s*$/.exec(str);
                if (match) {
                    obj.type = "method";
                    var type = match[1]
                    ,   prm = match[3];
                    // XXX we need to do better for parsing modifiers
                    type = this.parseStatic(obj, type);
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);

                    return this.methodMember(obj, $excepts, $extPrm, prm);
                }

                // SERIALIZER
                match = /^\s*serializer(\s*=\s*((\{\s*(\S+(\s*,\s*\S+)*)?\s*\})|(\[(\s*\S+(\s*,\s*\S+)*)?\s*\])|(\S+)))?\s*$/.exec(str);
                if (match) {
                    obj.type = "serializer";
                    obj.values = [];
                    this.setID(obj, "serializer");
                    var serializermap = match[3],
                    serializerlist = match[6],
                    serializerattribute = match[9], rawvalues;
                    if (serializermap) {
                        obj.serializertype = "map";
                        rawvalues = match[4];
                    }
                    else if (serializerlist) {
                        obj.serializertype = "list";
                        rawvalues = match[7];
                    }
                    else if (serializerattribute) {
                        obj.serializertype = "attribute";
                        obj.values.push(serializerattribute);
                    }
                    else {
                        obj.serializertype = "prose";
                    }
                    if (rawvalues) {
                        // split at comma and remove white space
                        var values = rawvalues.split(/\s*,\s*/);
                        obj.getter = false;
                        obj.inherit = false;
                        obj.all = false;
                        if (values[0] == "getter") {
                            obj.getter = true;
                        }
                        else {
                            if (obj.serializertype == "map") {
                                if (values[0] == "inherit") {
                                    obj.inherit = true;
                                    values.shift();
                                }
                                if (values[0] == "attribute" && obj.serializertype == "map" ) {
                                    obj.all = true;
                                    values = [];
                                }
                            }
                            obj.values = values;
                        }
                    }
                    return obj;
                }

                // COMMENT
                match = /^\s*\/\/\s*(.*)\s*$/.exec(str);
                if (match) {
                    obj.type = "comment";
                    obj.id = match[1];
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected interface member, got: " + str);
            },

            methodMember:   function (obj, $excepts, $extPrm, prm) {
                obj.params = [];
                obj.raises = [];

                $excepts.each(function () {
                    var $el = $(this)
                    ,   exc = { id: $el.attr("title") };
                    if ($el.is("dl")) {
                        exc.type = "codelist";
                        exc.description = [];
                        $el.find("dt").each(function () {
                            var $dt = $(this)
                            ,   $dd = $dt.next("dd");
                            exc.description.push({ id: $dt.text(), description: $dd.contents().clone() });
                        });
                    }
                    else if ($el.is("div")) {
                        exc.type = "simple";
                        exc.description = $el.contents().clone();
                    }
                    else {
                        this.msg.pub("error", "Do not know what to do with exceptions being raised defined outside of a div or dl.");
                    }
                    $el.remove();
                    obj.raises.push(exc);
                });


                if ($extPrm.length) {
                    $extPrm.remove();
                    var self = this;
                    $extPrm.find("> dt").each(function () {
                        return self.params($(this).text(), $(this).next(), obj);
                    });
                }
                else {
                    while (prm.length) {
                        prm = this.params(prm, null, obj);
                        if (prm === false) break;
                    }
                }

                // apply optional
                var seenOptional = false;
                for (var i = 0; i < obj.params.length; i++) {
                    if (seenOptional) {
                        obj.params[i].optional = true;
                        obj.params[i].datatype = obj.params[i].datatype.replace(/\boptional\s+/, "");
                    }
                    else {
                        seenOptional = this.optional(obj.params[i]);
                    }
                }
                return obj;
            },

            parseDatatype:  function (obj, type) {
                type = this.nullable(obj, type);
                type = this.array(obj, type);
                obj.variadic = false;
                if (/\.\.\./.test(type)) {
                    type = type.replace(/\.\.\./, "");
                    obj.variadic = true;
                }
                if (type.indexOf("(") === 0) {
                    type = type.replace("(", "").replace(")", "");
                    obj.datatype = type.split(/\s+or\s+/);
                    obj.isUnionType = true;
                }
                else {
                    obj.datatype = type;
                }
            },

            parseStatic:  function (obj, type) {
                if (/^static\s+/.test(type)) {
                    type = type.replace(/^static\s+/, "");
                    obj.isStatic = true;
                }
                else {
                    obj.isStatic = false;
                }
                return type;
            },

            parseExtendedAttributes:    function (str, obj) {
                if (!str) return;
                return str.replace(/^\s*\[([^\]]+)\]\s*/, function (x, m1) { obj.extendedAttributes = m1; return ""; });
            },

            makeMarkup:    function (id) {
                var $df = $("<div></div>");
                var attr = { "class": "idl" };
                if (id) attr.id = id;
                var $pre = $("<pre></pre>").attr(attr);
                $pre.html(this.writeAsWebIDL(this.parent, -1));
                $df.append($pre);
                if (!this.conf.noLegacyStyle) $df.append(this.writeAsHTML(this.parent));
                this.mergeWebIDL(this.parent.children[0]);
                return $df.children();
            },

            parseParameterized: function (str) {
                var matched = /^(sequence|Promise)<(.+)>$/.exec(str);
                if (!matched)
                    return null;
                return { type: matched[1], parameter: matched[2] };
            },

            writeAsHTML:    function (obj) {
                if (obj.type == "module") {
                    if (obj.id == "outermost") {
                        if (obj.children.length > 1) this.msg.pub("error", "We currently only support one structural level per IDL fragment");
                        return this.writeAsHTML(obj.children[0]);
                    }
                    else {
                        this.msg.pub("warn", "No HTML can be generated for module definitions.");
                        return $("<span></span>");
                    }
                }
                else if (obj.type == "typedef") {
                    var cnt;
                    if (obj.description && obj.description.text()) cnt = [obj.description];
                    else {
                        // yuck -- should use a single model...
                        var $tdt = sn.element("span", { "class": "idlTypedefType" }, null);
                        $tdt.html(datatype(obj.datatype));
                        cnt = [ sn.text("Throughout this specification, the identifier "),
                                sn.element("span", { "class": "idlTypedefID" }, null, obj.unescapedId),
                                sn.text(" is used to refer to the "),
                                sn.text(obj.array ? (obj.arrayCount > 1 ? obj.arrayCount + "-" : "") + "array of " : ""),
                                $tdt,
                                sn.text(obj.nullable ? " (nullable)" : ""),
                                sn.text(" type.")];
                    }
                    return sn.element("div", { "class": "idlTypedefDesc" }, null, cnt);
                }
                else if (obj.type == "implements") {
                    var cnt;
                    if (obj.description && obj.description.text()) cnt = [obj.description];
                    else {
                        cnt = [ sn.text("All instances of the "),
                                sn.element("code", {}, null, [sn.element("a", {}, null, obj.unescapedId)]),
                                sn.text(" type are defined to also implement the "),
                                sn.element("a", {}, null, obj.datatype),
                                sn.text(" interface.")];
                        cnt = [sn.element("p", {}, null, cnt)];
                    }
                    return sn.element("div", { "class": "idlImplementsDesc" }, null, cnt);
                }

                else if (obj.type == "exception") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var types = ["field", "constant"];
                    var filterFunc = function (it) { return it.type === type; }
                    ,   sortFunc = function (a, b) {
                            if (a.unescapedId < b.unescapedId) return -1;
                            if (a.unescapedId > b.unescapedId) return 1;
                            return 0;
                    }
                    ;
                    for (var i = 0; i < types.length; i++) {
                        var type = types[i];
                        var things = obj.children.filter(filterFunc);
                        if (things.length === 0) continue;
                        if (!this.noIDLSorting) {
                            things.sort(sortFunc);
                        }

                        var sec = sn.element("section", {}, df);
                        var secTitle = type;
                        secTitle = secTitle.substr(0, 1).toUpperCase() + secTitle.substr(1) + "s";
                        if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, secTitle);
                        var dl = sn.element("dl", { "class": type + "s" }, sec);
                        for (var j = 0; j < things.length; j++) {
                            var it = things[j];
                            var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                            sn.element("code", {}, dt, it.unescapedId);
                            var desc = sn.element("dd", {}, dl, [it.description]);
                            if (type == "field") {
                                sn.text(" of type ", dt);
                                if (it.array) {
                                    for (var k = 0, n = it.arrayCount; k < n; k++) sn.text("array of ", dt);
                                }
                                var span = sn.element("span", { "class": "idlFieldType" }, dt);
                                var parameterized = this.parseParameterized(it.datatype);
                                if (parameterized) {
                                    sn.text(parameterized.type + "<", span);
                                    sn.element("a", {}, span, parameterized.parameter);
                                    sn.text(">", span);
                                }
                                else {
                                    sn.element("a", {}, span, it.datatype);
                                }
                                if (it.nullable) sn.text(", nullable", dt);
                            }
                            else if (type == "constant") {
                                sn.text(" of type ", dt);
                                sn.element("span", { "class": "idlConstType" }, dt, [sn.element("a", {}, null, it.datatype)]);
                                if (it.nullable) sn.text(", nullable", dt);
                            }
                        }
                    }
                    return df;
                }

                else if (obj.type == "dictionary") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var things = obj.children;
                    var cnt;
                    if (things.length === 0) return df;
                    if (!this.noIDLSorting) {
                        things.sort(function (a, b) {
                            if (a.id < b.id) return -1;
                            if (a.id > b.id) return 1;
                              return 0;
                        });
                    }

                    var sec = sn.element("section", {}, df);
                    cnt = [sn.text("Dictionary "),
                           sn.element("a", { "class": "idlType" }, null, obj.unescapedId),
                           sn.text(" Members")];
                    if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, cnt);
                    var dl = sn.element("dl", { "class": "dictionary-members" }, sec);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                        sn.element("code", {}, dt, it.unescapedId);
                        var desc = sn.element("dd", {}, dl, [it.description]);
                        sn.text(" of type ", dt);
                        if (it.array) {
                            for (var i = 0, n = it.arrayCount; i < n; i++) sn.text("array of ", dt);
                        }
                        var span = sn.element("span", { "class": "idlMemberType" }, dt);
                        var parameterized = this.parseParameterized(it.datatype);
                        if (parameterized) {
                            sn.text(parameterized.type + "<", span);
                            sn.element("a", {}, span, parameterized.parameter);
                            sn.text(">", span);
                        }
                        else {
                            sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                        }
                        if (it.nullable) sn.text(", nullable", dt);
                        if (it.defaultValue) {
                            sn.text(", defaulting to ", dt);
                            sn.element("code", {}, dt, [sn.text(it.defaultValue)]);
                        }
                    }
                    return df;
                }

                else if (obj.type == "callback") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var things = obj.children;
                    var cnt;
                    if (things.length === 0) return df;

                    var sec = sn.element("section", {}, df);
                    cnt = [sn.text("Callback "),
                           sn.element("a", { "class": "idlType" }, null, obj.unescapedId),
                           sn.text(" Parameters")];
                    if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, cnt);
                    var dl = sn.element("dl", { "class": "callback-members" }, sec);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                        sn.element("code", {}, dt, it.unescapedId);
                        var desc = sn.element("dd", {}, dl, [it.description]);
                        sn.text(" of type ", dt);
                        if (it.array) {
                            for (var i = 0, n = it.arrayCount; i < n; i++) sn.text("array of ", dt);
                        }
                        var span = sn.element("span", { "class": "idlMemberType" }, dt);
                        var parameterized = this.parseParameterized(it.datatype);
                        if (parameterized) {
                            sn.text(parameterized.type + "<", span);
                            sn.element("a", {}, span, parameterized.parameter);
                            sn.text(">", span);
                        }
                        else {
                            sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                        }
                        if (it.nullable) sn.text(", nullable", dt);
                        if (it.defaultValue) {
                            sn.text(", defaulting to ", dt);
                            sn.element("code", {}, dt, [sn.text(it.defaultValue)]);
                        }
                    }
                    return df;
                }

                else if (obj.type == "enum") {
                    var df = sn.documentFragment();
                    var things = obj.children;
                    if (things.length === 0) return df;

                    var sec = sn.element("table", { "class": "simple" }, df);
                    sn.element("tr", {}, sec, [sn.element("th", { colspan: 2 }, null, [sn.text("Enumeration description")])]);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var tr = sn.element("tr", {}, sec)
                        ,   td1 = sn.element("td", {}, tr)
                        ;
                        sn.element("code", { "id": "idl-def-" + obj.refId + "." + it.refId }, td1, it.unescapedId);
                        sn.element("td", {}, tr, [it.description]);
                    }
                    return df;
                }

                else if (obj.type == "interface") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var types = ["constructor", "attribute", "method", "constant", "serializer"];
                    var filterFunc = function (it) { return it.type == type; }
                    ,   sortFunc = function (a, b) {
                            if (a.unescapedId < b.unescapedId) return -1;
                            if (a.unescapedId > b.unescapedId) return 1;
                            return 0;
                        }
                    ;
                    for (var i = 0; i < types.length; i++) {
                        var type = types[i];
                        var things = obj.children.filter(filterFunc);
                        if (things.length === 0) continue;
                        if (!this.noIDLSorting) things.sort(sortFunc);

                        var sec = sn.element("section", {}, df);
                        var secTitle = type;
                        secTitle = secTitle.substr(0, 1).toUpperCase() + secTitle.substr(1) + (type != "serializer" ? "s" : "");
                        if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, secTitle);
                        if (type != "serializer") {
                            var dl = sn.element("dl", { "class": type + "s" }, sec);
                            for (var j = 0; j < things.length; j++) {
                                var it = things[j];
                                var id = (type == "method") ? this.makeMethodID(curLnk, it) :
                                    (type == "constructor") ? this.makeMethodID("widl-ctor-", it)
                                    : sn.idThatDoesNotExist(curLnk + it.refId);
                                var dt = sn.element("dt", { id: id }, dl);
                                sn.element("code", {}, dt, it.unescapedId);
                                if (it.isStatic) dt.append(this.doc.createTextNode(", static"));
                                var desc = sn.element("dd", {}, dl, [it.description]);
                                if (type == "method" || type == "constructor") {
                                    if (it.params.length) {
                                        var table = sn.element("table", { "class": "parameters" }, desc);
                                        var tr = sn.element("tr", {}, table);
                                        ["Parameter", "Type", "Nullable", "Optional", "Description"].forEach(function (tit) { sn.element("th", {}, tr, tit); });
                                        for (var k = 0; k < it.params.length; k++) {
                                            var prm = it.params[k];
                                            var tr = sn.element("tr", {}, table);
                                            sn.element("td", { "class": "prmName" }, tr, prm.id);
                                            var tyTD = sn.element("td", { "class": "prmType" }, tr);
                                            var code = sn.element("code", {}, tyTD);
                                            var codeHTML = datatype(prm.datatype);
                                            if (prm.array) codeHTML += arrsq(prm);
                                            if (prm.defaultValue) {
                                                codeHTML += " = " + prm.defaultValue;
                                            }
                                            code.html(codeHTML);
                                            if (prm.nullable) sn.element("td", { "class": "prmNullTrue" }, tr, $("<span role='img' aria-label='True'>\u2714</span>"));
                                            else              sn.element("td", { "class": "prmNullFalse" }, tr, $("<span role='img' aria-label='False'>\u2718</span>"));
                                            if (prm.optional) sn.element("td", { "class": "prmOptTrue" }, tr,  $("<span role='img' aria-label='True'>\u2714</span>"));
                                            else              sn.element("td", { "class": "prmOptFalse" }, tr, $("<span role='img' aria-label='False'>\u2718</span>"));
                                            var cnt = prm.description ? [prm.description] : "";
                                            sn.element("td", { "class": "prmDesc" }, tr, cnt);
                                        }
                                    }
                                    else {
                                        sn.element("div", {}, desc, [sn.element("em", {}, null, "No parameters.")]);
                                    }
                                    if (this.conf.idlOldStyleExceptions && it.raises.length) {
                                        var table = sn.element("table", { "class": "exceptions" }, desc);
                                        var tr = sn.element("tr", {}, table);
                                        ["Exception", "Description"].forEach(function (tit) { sn.element("th", {}, tr, tit); });
                                        for (var k = 0; k < it.raises.length; k++) {
                                            var exc = it.raises[k];
                                            var tr = sn.element("tr", {}, table);
                                            sn.element("td", { "class": "excName" }, tr, [sn.element("a", {}, null, exc.id)]);
                                            var dtd = sn.element("td", { "class": "excDesc" }, tr);
                                            if (exc.type == "simple") {
                                                dtd.append(exc.description);
                                            }
                                            else {
                                                var ctab = sn.element("table", { "class": "exceptionCodes" }, dtd );
                                                for (var m = 0; m < exc.description.length; m++) {
                                                    var cd = exc.description[m];
                                                    var tr = sn.element("tr", {}, ctab);
                                                    sn.element("td", { "class": "excCodeName" }, tr, [sn.element("code", {}, null, cd.id)]);
                                                    sn.element("td", { "class": "excCodeDesc" }, tr, [cd.description]);
                                                }
                                            }
                                        }
                                    }
                                    // else {
                                    //     sn.element("div", {}, desc, [sn.element("em", {}, null, "No exceptions.")]);
                                    // }

                                    if (type !== "constructor") {
                                        var reDiv = sn.element("div", {}, desc);
                                        sn.element("em", {}, reDiv, "Return type: ");
                                        var code = sn.element("code", {}, reDiv);
                                        var codeHTML = datatype(it.datatype);
                                        if (it.array) codeHTML += arrsq(it);
                                        if (it.nullable) sn.text(", nullable", reDiv);
                                        code.html(codeHTML);
                                    }
                                }
                                else if (type == "attribute") {
                                    sn.text(" of type ", dt);
                                    if (it.array) {
                                        for (var m = 0, n = it.arrayCount; m < n; m++) sn.text("array of ", dt);
                                    }
                                    var span = sn.element("span", { "class": "idlAttrType" }, dt);
                                    var parameterized = this.parseParameterized(it.datatype);
                                    if (parameterized) {
                                        sn.text(parameterized.type + "<", span);
                                        sn.element("a", {}, span, parameterized.parameter);
                                        sn.text(">", span);
                                    }
                                    else {
                                        sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                                    }
                                    if (it.declaration) sn.text(", " + it.declaration, dt);
                                    if (it.nullable) sn.text(", nullable", dt);

                                    if (this.conf.idlOldStyleExceptions && it.raises.length) {
                                        var table = sn.element("table", { "class": "exceptions" }, desc);
                                        var tr = sn.element("tr", {}, table);
                                        ["Exception", "On Get", "On Set", "Description"].forEach(function (tit) { sn.element("th", {}, tr, tit); });
                                        for (var k = 0; k < it.raises.length; k++) {
                                            var exc = it.raises[k];
                                            var tr = sn.element("tr", {}, table);
                                            sn.element("td", { "class": "excName" }, tr, [sn.element("a", {}, null, exc.id)]);
                                            ["onGet", "onSet"].forEach(function (gs) {
                                                if (exc[gs]) sn.element("td", { "class": "excGetSetTrue" }, tr, $("<span role='img' aria-label='True'>\u2714</span>"));
                                                else         sn.element("td", { "class": "excGetSetFalse" }, tr, $("<span role='img' aria-label='False'>\u2718</span>"));
                                            });
                                            var dtd = sn.element("td", { "class": "excDesc" }, tr);
                                            if (exc.type == "simple") {
                                                dtd.append(exc.description);
                                            }
                                            else {
                                                var ctab = sn.element("table", { "class": "exceptionCodes" }, dtd );
                                                for (var m = 0; m < exc.description.length; m++) {
                                                    var cd = exc.description[m];
                                                    var tr = sn.element("tr", {}, ctab);
                                                    sn.element("td", { "class": "excCodeName" }, tr, [sn.element("code", {}, null, cd.id)]);
                                                    sn.element("td", { "class": "excCodeDesc" }, tr, [cd.description]);
                                                }
                                            }
                                        }
                                    }
                                    // else {
                                    //     sn.element("div", {}, desc, [sn.element("em", {}, null, "No exceptions.")]);
                                    // }
                                }
                                else if (type == "constant") {
                                    sn.text(" of type ", dt);
                                    sn.element("span", { "class": "idlConstType" }, dt, [sn.element("a", {}, null, it.datatype)]);
                                    if (it.nullable) sn.text(", nullable", dt);
                                }
                            }
                        }
                        // Serializer
                        else {
                            var div = sn.element("div", {}, sec);
                            var it = things[0];
                            if (it.serializertype != "prose") {
                                var generatedDescription = "Instances of this interface are serialized as ";
                                if (it.serializertype == "map") {
                                    var mapDescription = "a map ";
                                    if (it.getter) {
                                        mapDescription += "with entries corresponding to the named properties";
                                    }
                                    else {
                                        var and = "";
                                        if (it.inherit) {
                                            mapDescription += "with entries from the closest inherited interface ";
                                            and = "and ";
                                        }
                                        if (it.all) {
                                            mapDescription += and + "with entries for each of the serializable attributes";
                                        }
                                        else if (it.values && it.values.length) {
                                            mapDescription += and + "with entries for the following attributes: " + it.values.join(", ");
                                        }
                                        else {
                                            mapDescription = "an empty map";
                                        }
                                    }
                                    generatedDescription += mapDescription;
                                }
                                else if (it.serializertype == "list") {
                                    var listDescription = "a list ";
                                    if (it.getter) {
                                        listDescription += "with values corresponding to the indexed properties";
                                    }
                                    else {
                                        if (it.values && it.values.length) {
                                            listDescription += "with the values of the following attributes: " + it.values.join(", ");
                                        }
                                        else {
                                            listDescription = "an empty list";
                                        }
                                    }
                                    generatedDescription += listDescription;
                                }
                                else if (it.serializertype == "attribute") {
                                    generatedDescription += "the value of the attribute " + it.values[0];
                                }
                                generatedDescription += ".";
                                sn.element("p", {}, div, generatedDescription);
                            }
                            sn.element("p", {}, div, [it.description]);
                        }
                    }
                    return df;
                }
            },

            makeMethodID:    function (cur, obj) {
                var id = cur + obj.refId + "-" + obj.datatype + "-"
                ,   params = [];
                for (var i = 0, n = obj.params.length; i < n; i++) {
                    var prm = obj.params[i];
                    params.push(prm.datatype + (prm.array ? "Array" : "") + "-" + prm.id);
                }
                id += params.join("-");
                return sn.sanitiseID(id);
            },

            mergeWebIDL:    function (obj) {
                if (typeof obj.merge === "undefined" || obj.merge.length === 0) return;
                // queue for later execution
                setTimeout(function () {
                    for (var i = 0; i < obj.merge.length; i++) {
                        var idlInterface = document.querySelector("#idl-def-" + obj.refId)
                        ,   idlInterfaceToMerge = document.querySelector("#idl-def-" + obj.merge[i]);
                        idlInterface.insertBefore(document.createElement("br"), idlInterface.firstChild);
                        idlInterface.insertBefore(document.createElement("br"), idlInterface.firstChild);
                        idlInterfaceToMerge.parentNode.parentNode.removeChild(idlInterfaceToMerge.parentNode);
                        idlInterface.insertBefore(idlInterfaceToMerge, idlInterface.firstChild);
                    }
                }, 0);
            },

            writeAsWebIDL:    function (obj, indent) {
                indent++;
                var opt = { indent: indent, obj: obj, proc: this };
                if (obj.type === "module") {
                    if (obj.id == "outermost") {
                        var $div = $("<div></div>");
                        for (var i = 0; i < obj.children.length; i++) $div.append(this.writeAsWebIDL(obj.children[i], indent - 1));
                        return $div.children();
                    }
                    else return $(idlModuleTmpl(opt));
                }

                else if (obj.type === "typedef") {
                    opt.nullable = obj.nullable ? "?" : "";
                    opt.arr = arrsq(obj);
                    return $(idlTypedefTmpl(opt));
                }

                else if (obj.type === "implements") {
                    return $(idlImplementsTmpl(opt));
                }

                else if (obj.type === "interface") {
                    // stop gap fix for duplicate IDs while we're transitioning the code
                    var div = this.doc.createElement("div")
                    ,   id = $(div).makeID("idl-def", obj.refId, true)
                    ,   maxAttr = 0, maxMeth = 0, maxConst = 0, hasRO = false;
                    obj.children.forEach(function (it) {
                        var len = 0;
                        if (it.isUnionType)   len = it.datatype.join(" or ").length + 2;
                        else if (it.datatype) len = it.datatype.length;
                        if (it.isStatic) len += 7;
                        if (it.nullable) len = len + 1;
                        if (it.array) len = len + (2 * it.arrayCount);
                        if (it.type == "attribute") maxAttr = (len > maxAttr) ? len : maxAttr;
                        else if (it.type == "method") maxMeth = (len > maxMeth) ? len : maxMeth;
                        else if (it.type == "constant") maxConst = (len > maxConst) ? len : maxConst;
                        if (it.type == "attribute" && it.declaration) hasRO = true;
                    });
                    var curLnk = "widl-" + obj.refId + "-"
                    ,   self = this
                    ,   ctor = []
                    ,   children = obj.children
                                      .map(function (ch) {
                                          if (ch.type == "attribute") return self.writeAttribute(ch, maxAttr, indent + 1, curLnk, hasRO);
                                          else if (ch.type == "method") return self.writeMethod(ch, maxMeth, indent + 1, curLnk);
                                          else if (ch.type == "constant") return self.writeConst(ch, maxConst, indent + 1, curLnk);
                                          else if (ch.type == "serializer") return self.writeSerializer(ch, indent + 1, curLnk);
                                          else if (ch.type == "constructor") ctor.push(self.writeConstructor(ch, indent, "widl-ctor-"));
                                          else if (ch.type == "comment") return self.writeComment(ch, indent + 1);
                                      })
                                      .join("")
                    ;
                    return idlInterfaceTmpl({
                        obj:        obj
                    ,   indent:     indent
                    ,   id:         id
                    ,   ctor:       ctor.join(",\n")
                    ,   partial:    obj.partial ? "partial " : ""
                    ,   callback:   obj.callback ? "callback " : ""
                    ,   children:   children
                    });
                }

                else if (obj.type === "exception") {
                    var maxAttr = 0, maxConst = 0;
                    obj.children.forEach(function (it) {
                        var len = it.datatype.length;
                        if (it.nullable) len = len + 1;
                        if (it.array) len = len + (2 * it.arrayCount);
                        if (it.type === "field")   maxAttr = (len > maxAttr) ? len : maxAttr;
                        else if (it.type === "constant") maxConst = (len > maxConst) ? len : maxConst;
                    });
                    var curLnk = "widl-" + obj.refId + "-"
                    ,   self = this
                    ,   children = obj.children
                                      .map(function (ch) {
                                          if (ch.type === "field") return self.writeField(ch, maxAttr, indent + 1, curLnk);
                                          else if (ch.type === "constant") return self.writeConst(ch, maxConst, indent + 1, curLnk);
                                      })
                                      .join("")
                    ;
                    return idlExceptionTmpl({ obj: obj, indent: indent, children: children });
                }

                else if (obj.type === "dictionary") {
                    var max = 0;
                    obj.children.forEach(function (it) {
                        var len = 0;
                        if (it.isUnionType)   len = it.datatype.join(" or ").length + 2;
                        else if (it.datatype) len = it.datatype.length;
                        if (it.nullable) len = len + 1;
                        if (it.array) len = len + (2 * it.arrayCount);
                        max = (len > max) ? len : max;
                    });
                    var curLnk = "widl-" + obj.refId + "-"
                    ,   self = this
                    ,   children = obj.children
                                      .map(function (it) {
                                          return self.writeMember(it, max, indent + 1, curLnk);
                                      })
                                      .join("")
                    ;
                    return idlDictionaryTmpl({ obj: obj, indent: indent, children: children, partial: obj.partial ? "partial " : "" });
                }

                else if (obj.type === "callback") {
                    var params = obj.children
                                    .map(function (it) {
                                        return idlParamTmpl({
                                            obj:        it
                                        ,   optional:   it.optional ? "optional " : ""
                                        ,   arr:        arrsq(it)
                                        ,   nullable:   it.nullable ? "?" : ""
                                        ,   variadic:   it.variadic ? "..." : ""
                                        });
                                    })
                                    .join(", ");
                    return idlCallbackTmpl({
                        obj:        obj
                    ,   indent:     indent
                    ,   arr:        arrsq(obj)
                    ,   nullable:   obj.nullable ? "?" : ""
                    ,   children:   params
                    });
                }

                else if (obj.type === "enum") {
                    var children = obj.children
                                      .map(function (it) { return idlEnumItemTmpl({ obj: it, parentID: obj.refId, indent: indent + 1 }); })
                                      .join(",\n");
                    return idlEnumTmpl({obj: obj, indent: indent, children: children });
                }
            },

            writeField:    function (attr, max, indent, curLnk) {
                var pad = max - attr.datatype.length;
                if (attr.nullable) pad = pad - 1;
                if (attr.array) pad = pad - (2 * attr.arrayCount);
                return idlFieldTmpl({
                    obj:        attr
                ,   indent:     indent
                ,   arr:        arrsq(attr)
                ,   nullable:   attr.nullable ? "?" : ""
                ,   pad:        pad
                ,   href:       curLnk + attr.refId
                });
            },

            writeAttribute:    function (attr, max, indent, curLnk) {
                var len = 0;
                if (attr.isUnionType)   len = attr.datatype.join(" or ").length + 2;
                else if (attr.datatype) len = attr.datatype.length;
                var pad = max - len;
                if (attr.nullable) pad = pad - 1;
                if (attr.array) pad = pad - (2 * attr.arrayCount);
                return idlAttributeTmpl({
                    obj:            attr
                ,   indent:         indent
                ,   declaration:    attr.declaration
                ,   pad:            pad
                ,   arr:            arrsq(attr)
                ,   nullable:       attr.nullable ? "?" : ""
                ,   href:           curLnk + attr.refId
                });
            },

            writeMethod:    function (meth, max, indent, curLnk) {
                var params = meth.params
                                .map(function (it) {
                                    return idlParamTmpl({
                                        obj:        it
                                    ,   optional:   it.optional ? "optional " : ""
                                    ,   arr:        arrsq(it)
                                    ,   nullable:   it.nullable ? "?" : ""
                                    ,   variadic:   it.variadic ? "..." : ""
                                    });
                                })
                                .join(", ");
                var len = 0;
                if (meth.isUnionType) len = meth.datatype.join(" or ").length + 2;
                else                  len = meth.datatype.length;
                if (meth.isStatic) len += 7;
                var pad = max - len;
                if (meth.nullable) pad = pad - 1;
                if (meth.array) pad = pad - (2 * meth.arrayCount);
                return idlMethodTmpl({
                    obj:        meth
                ,   indent:     indent
                ,   arr:        arrsq(meth)
                ,   nullable:   meth.nullable ? "?" : ""
                ,   "static":   meth.isStatic ? "static " : ""
                ,   pad:        pad
                ,   id:         this.makeMethodID(curLnk, meth)
                ,   children:   params
                });
            },

            writeConstructor:   function (ctor, indent, curLnk) {
                var params = ctor.params
                                .map(function (it) {
                                    return idlParamTmpl({
                                        obj:        it
                                    ,   optional:   it.optional ? "optional " : ""
                                    ,   arr:        arrsq(it)
                                    ,   nullable:   it.nullable ? "?" : ""
                                    ,   variadic:   it.variadic ? "..." : ""
                                    });
                                })
                                .join(", ");
                return idlConstructorTmpl({
                    obj:        ctor
                ,   indent:     indent
                ,   id:         this.makeMethodID(curLnk, ctor)
                ,   name:       ctor.named ? ctor.id : "Constructor"
                ,   keyword:    ctor.named ? "NamedConstructor=" : ""
                ,   children:   params
                });
            },

            writeConst:    function (cons, max, indent) {
                var pad = max - cons.datatype.length;
                if (cons.nullable) pad--;
                return idlConstTmpl({ obj: cons, indent: indent, pad: pad, nullable: cons.nullable ? "?" : ""});
            },

            writeComment:   function (comment, indent) {
                return idlCommentTmpl({ obj: comment, indent: indent, comment: comment.id});
            },


            writeSerializer: function (serializer, indent) {
                var values = "";
                if (serializer.serializertype == "map") {
                    var mapValues = [];
                    if (serializer.getter) mapValues = ["getter"];
                    else {
                        if (serializer.inherit) mapValues.push("inherit");
                        if (serializer.all) mapValues.push("attribute");
                        else                mapValues = mapValues.concat(serializer.values);
                    }
                    values = "{" + mapValues.join(", ") + "}";
                }
                else if (serializer.serializertype == "list") {
                    var listValues = (serializer.getter ? ["getter"] : serializer.values);
                    values = "[" + listValues.join(", ") + "]";
                }
                else if (serializer.serializertype == "attribute") {
                    values = serializer.values[0];
                }
                return idlSerializerTmpl({
                    obj:        serializer
                ,   indent:     indent
                ,   values:     values
                });
            },

            writeMember:    function (memb, max, indent, curLnk) {
                var opt = { obj: memb, indent: indent, curLnk: curLnk,
                            nullable: (memb.nullable ? "?" : ""), arr: arrsq(memb) };
                if (memb.isUnionType)   opt.pad = max - (memb.datatype.join(" or ").length + 2);
                else if (memb.datatype) opt.pad = max - memb.datatype.length;
                if (memb.nullable) opt.pad = opt.pad - 1;
                if (memb.array) opt.pad = opt.pad - (2 * memb.arrayCount);
                return idlDictMemberTmpl(opt);
            }
        };


        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/webidl");
                if (!conf.noIDLSorting) conf.noIDLSorting = false;
                if (!conf.noIDLSectionTitle) conf.noIDLSectionTitle = false;
                sn = new simpleNode(document);
                var $idl = $(".idl", doc)
                ,   finish = function () {
                        msg.pub("end", "core/webidl");
                        cb();
                    };
                if (!$idl.length) return finish();
                $(doc).find("head link").first().before($("<style/>").text(css));

                var infNames = [];
                $idl.each(function () {
                    var w = new WebIDLProcessor({ noIDLSorting: conf.noIDLSorting, msg: msg, doc: doc, conf: conf })
                    ,   inf = w.definition($(this))
                    ,   $df = w.makeMarkup(inf.htmlID);
                    $(this).replaceWith($df);
                    if ($.inArray(inf.type, "interface exception dictionary typedef callback enum".split(" ")) !== -1) infNames.push(inf.id);
                });
                doc.normalize();
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var name = $ant.text();
                    if ($.inArray(name, infNames) !== -1) {
                        $ant.attr("href", "#idl-def-" + name)
                            .addClass("idlType")
                            .html("<code>" + name + "</code>");
                    }
                });
                finish();
            }
        };
    }
);

window.simpleNode = function (doc) {
    this.doc = doc ? doc : document;
};
window.simpleNode.prototype = {

    // --- NODE CREATION ---
    element:    function (name, attr, parent, content) {
        var $el = $(this.doc.createElement(name));
        $el.attr(attr || {});
        if (parent) $(parent).append($el);
        if (content) {
            if (content instanceof jQuery) $el.append(content);
            else if (content instanceof Array) for (var i = 0; i < content.length; i++) $el.append(content[i]);
            else this.text(content, $el);
        }
        return $el;
    },

    text:    function (txt, parent) {
        var tn = this.doc.createTextNode(txt);
        if (parent) $(parent).append(tn);
        return tn;
    },

    documentFragment:    function () {
        return this.doc.createDocumentFragment();
    },

    // --- ID MANAGEMENT ---
    sanitiseID:    function (id) {
        id = id.split(/[^\-.0-9a-zA-Z_]/).join("-");
        id = id.replace(/^-+/g, "");
        id = id.replace(/-+$/, "");
        if (id.length > 0 && /^[^a-z]/.test(id)) id = "x" + id;
        if (id.length === 0) id = "generatedID";
        return id;
    },

    idThatDoesNotExist:    function (id) {
        var inc = 1;
        if (this.doc.getElementById(id)) {
            while (this.doc.getElementById(id + "-" + inc)) inc++;
            id = id + "-" + inc;
        }
        return id;
    }
};
