define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attribute.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression((helpers.escapeAttributeName || (depth0 && depth0.escapeAttributeName) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1),{"name":"escapeAttributeName","hash":{},"data":data}));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlAttribute' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias2(((helper = (helper = helpers.qualifiers || (depth0 != null ? depth0.qualifiers : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"qualifiers","hash":{},"data":data}) : helper)))
    + "attribute <span class='idlAttrType'>"
    + alias2((helpers.idlType || (depth0 && depth0.idlType) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "</span> "
    + alias2((helpers.pads || (depth0 && depth0.pads) || alias4).call(alias3,(depth0 != null ? depth0.pad : depth0),{"name":"pads","hash":{},"data":data}))
    + "<span class='idlAttrName'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>;</span>\n";
},"useData":true});
templates['callback.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlCallback' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "callback <span class='idlCallbackID'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span> = <span class='idlCallbackType'>"
    + alias2((helpers.idlType || (depth0 && depth0.idlType) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "</span> ("
    + ((stack1 = ((helper = (helper = helpers.children || (depth0 != null ? depth0.children : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"children","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ");</span>";
},"useData":true});
templates['const.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlConst' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "const <span class='idlConstType'>"
    + alias2((helpers.idlType || (depth0 && depth0.idlType) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "</span>"
    + alias2(((helper = (helper = helpers.nullable || (depth0 != null ? depth0.nullable : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"nullable","hash":{},"data":data}) : helper)))
    + " "
    + alias2((helpers.pads || (depth0 && depth0.pads) || alias4).call(alias3,(depth0 != null ? depth0.pad : depth0),{"name":"pads","hash":{},"data":data}))
    + "<span class='idlConstName'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span> = <span class='idlConstValue'>"
    + alias2((helpers.stringifyIdlConst || (depth0 && depth0.stringifyIdlConst) || alias4).call(alias3,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.value : stack1),{"name":"stringifyIdlConst","hash":{},"data":data}))
    + "</span>;</span>\n";
},"useData":true});
templates['dict-member.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " = <span class='idlMemberValue'>"
    + container.escapeExpression((helpers.stringifyIdlConst || (depth0 && depth0.stringifyIdlConst) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1["default"] : stack1),{"name":"stringifyIdlConst","hash":{},"data":data}))
    + "</span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlMember' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias2(((helper = (helper = helpers.qualifiers || (depth0 != null ? depth0.qualifiers : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"qualifiers","hash":{},"data":data}) : helper)))
    + "<span class='idlMemberType'>"
    + alias2((helpers.idlType || (depth0 && depth0.idlType) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "</span> "
    + alias2((helpers.pads || (depth0 && depth0.pads) || alias4).call(alias3,(depth0 != null ? depth0.typePad : depth0),{"name":"pads","hash":{},"data":data}))
    + "<span class='idlMemberName'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1["default"] : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ";</span>\n";
},"useData":true});
templates['dictionary.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " : <span class='idlSuperclass'><a>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.inheritance : stack1), depth0))
    + "</a></span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing, alias5="function";

  return "<span class='idlDictionary' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias2(((helper = (helper = helpers.partial || (depth0 != null ? depth0.partial : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"partial","hash":{},"data":data}) : helper)))
    + "dictionary <span class='idlDictionaryID'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.inheritance : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " &#123;\n"
    + ((stack1 = ((helper = (helper = helpers.children || (depth0 != null ? depth0.children : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"children","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "&#125;;</span>";
},"useData":true});
templates['enum-item.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return alias3((helpers.idn || (depth0 && depth0.idn) || alias2).call(alias1,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "<a href=\"#dom-"
    + alias3(((helper = (helper = helpers.parentID || (depth0 != null ? depth0.parentID : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"parentID","hash":{},"data":data}) : helper)))
    + "-"
    + alias3(((helper = (helper = helpers.lname || (depth0 != null ? depth0.lname : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lname","hash":{},"data":data}) : helper)))
    + "\" class=\"idlEnumItem\">\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"</a>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.needsComma : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true});
templates['enum.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlEnum' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "enum <span class='idlEnumID'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span> &#123;\n"
    + ((stack1 = ((helper = (helper = helpers.children || (depth0 != null ? depth0.children : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"children","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "&#125;;</span>";
},"useData":true});
templates['exception.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " : <span class='idlSuperclass'><a>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.inheritance : stack1), depth0))
    + "</a></span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlException' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "exception <span class='idlExceptionID'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.inheritance : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " &#123;\n"
    + ((stack1 = ((helper = (helper = helpers.children || (depth0 != null ? depth0.children : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"children","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "&#125;;</span>";
},"useData":true});
templates['extended-attribute.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span class='"
    + alias4(((helper = (helper = helpers.extAttrClassName || (depth0 != null ? depth0.extAttrClassName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"extAttrClassName","hash":{},"data":data}) : helper)))
    + "'><span class=\"extAttrName\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.rhs : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.jsIf || (depth0 && depth0.jsIf) || alias2).call(alias1,(depth0 != null ? depth0.arguments : depth0),{"name":"jsIf","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "=<span class=\"extAttrRhs\">"
    + ((stack1 = (helpers.extAttrRhs || (depth0 && depth0.extAttrRhs) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.rhs : depth0),{"name":"extAttrRhs","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>";
},"3":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression(container.lambda(depth0, depth0));
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "("
    + ((stack1 = (helpers.joinNonWhitespace || (depth0 && depth0.joinNonWhitespace) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.arguments : depth0),", ",{"name":"joinNonWhitespace","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")";
},"6":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.param || (depth0 && depth0.param) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"param","hash":{},"data":data}));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return alias3((helpers.idn || (depth0 && depth0.idn) || alias2).call(alias1,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "["
    + ((stack1 = (helpers.join || (depth0 && depth0.join) || alias2).call(alias1,(depth0 != null ? depth0.extAttrs : depth0),(depth0 != null ? depth0.sep : depth0),{"name":"join","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "]"
    + alias3(((helper = (helper = helpers.end || (depth0 != null ? depth0.end : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"end","hash":{},"data":data}) : helper)));
},"useData":true});
templates['field.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlField' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "<span class='idlFieldType'>"
    + alias2((helpers.idlType || (depth0 && depth0.idlType) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "</span> "
    + alias2((helpers.pads || (depth0 && depth0.pads) || alias4).call(alias3,(depth0 != null ? depth0.pad : depth0),{"name":"pads","hash":{},"data":data}))
    + "<span class='idlFieldName'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>;</span>\n";
},"useData":true});
templates['implements.html'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<span class='idlImplements'>"
    + alias3((helpers.extAttr || (depth0 && depth0.extAttr) || alias2).call(alias1,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias3((helpers.idn || (depth0 && depth0.idn) || alias2).call(alias1,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "<a>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.target : stack1), depth0))
    + "</a> implements <a>"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1["implements"] : stack1), depth0))
    + "</a>;</span>";
},"useData":true});
templates['interface.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " : <span class='idlSuperclass'><a>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.inheritance : stack1), depth0))
    + "</a></span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing, alias5="function";

  return "<span class='idlInterface' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias2(((helper = (helper = helpers.partial || (depth0 != null ? depth0.partial : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"partial","hash":{},"data":data}) : helper)))
    + alias2(((helper = (helper = helpers.callback || (depth0 != null ? depth0.callback : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"callback","hash":{},"data":data}) : helper)))
    + "interface <span class='idlInterfaceID'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.inheritance : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " &#123;\n"
    + ((stack1 = ((helper = (helper = helpers.children || (depth0 != null ? depth0.children : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"children","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "&#125;;</span>";
},"useData":true});
templates['iterable.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "iterable";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing;

  return "<span class='idlIterable' id=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='iterable'>"
    + alias1((helpers.extAttr || (depth0 && depth0.extAttr) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias1((helpers.idn || (depth0 && depth0.idn) || alias3).call(alias2,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias1(((helper = (helper = helpers.qualifiers || (depth0 != null ? depth0.qualifiers : depth0)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(alias2,{"name":"qualifiers","hash":{},"data":data}) : helper)))
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "&lt;"
    + alias1((helpers.idlType || (depth0 && depth0.idlType) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "&gt;;</span>\n";
},"useData":true});
templates['line-comment.html'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<span class='idlSectionComment'>"
    + alias3((helpers.idn || (depth0 && depth0.idn) || alias2).call(alias1,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "//"
    + alias3(((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"comment","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"useData":true});
templates['maplike.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "maplike";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing;

  return "<span class='idlMaplike' id=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='maplike'>"
    + alias1((helpers.extAttr || (depth0 && depth0.extAttr) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias1((helpers.idn || (depth0 && depth0.idn) || alias3).call(alias2,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias1(((helper = (helper = helpers.qualifiers || (depth0 != null ? depth0.qualifiers : depth0)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(alias2,{"name":"qualifiers","hash":{},"data":data}) : helper)))
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "&lt;"
    + alias1((helpers.idlType || (depth0 && depth0.idlType) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "&gt;;</span>\n";
},"useData":true});
templates['method.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing, alias5="function";

  return "<span class='idlMethod' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>"
    + alias2((helpers.extAttr || (depth0 && depth0.extAttr) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias2((helpers.idn || (depth0 && depth0.idn) || alias4).call(alias3,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias2(((helper = (helper = helpers["static"] || (depth0 != null ? depth0["static"] : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"static","hash":{},"data":data}) : helper)))
    + alias2(((helper = (helper = helpers.special || (depth0 != null ? depth0.special : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"special","hash":{},"data":data}) : helper)))
    + "<span class='idlMethType'>"
    + alias2((helpers.idlType || (depth0 && depth0.idlType) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "</span> "
    + alias2((helpers.pads || (depth0 && depth0.pads) || alias4).call(alias3,(depth0 != null ? depth0.pad : depth0),{"name":"pads","hash":{},"data":data}))
    + "<span class='idlMethName'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>("
    + ((stack1 = ((helper = (helper = helpers.children || (depth0 != null ? depth0.children : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"children","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ");</span>\n";
},"useData":true});
templates['multiline-comment.html'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.escapeExpression;

  return alias1((helpers.idn || (depth0 && depth0.idn) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depths[1] != null ? depths[1].indent : depths[1]),{"name":"idn","hash":{},"data":data}))
    + alias1(container.lambda(depth0, depth0))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<span class='idlSectionComment'>"
    + alias3((helpers.idn || (depth0 && depth0.idn) || alias2).call(alias1,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + "/*"
    + alias3(((helper = (helper = helpers.firstLine || (depth0 != null ? depth0.firstLine : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"firstLine","hash":{},"data":data}) : helper)))
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.innerLine : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias3((helpers.idn || (depth0 && depth0.idn) || alias2).call(alias1,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + alias3(((helper = (helper = helpers.lastLine || (depth0 != null ? depth0.lastLine : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lastLine","hash":{},"data":data}) : helper)))
    + "*/</span>\n";
},"useData":true,"useDepths":true});
templates['param.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " = <span class='idlDefaultValue'>"
    + container.escapeExpression((helpers.stringifyIdlConst || (depth0 && depth0.stringifyIdlConst) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1["default"] : stack1),{"name":"stringifyIdlConst","hash":{},"data":data}))
    + "</span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<span class='idlParam'>"
    + alias3((helpers.extAttrInline || (depth0 && depth0.extAttrInline) || alias2).call(alias1,(depth0 != null ? depth0.obj : depth0),{"name":"extAttrInline","hash":{},"data":data}))
    + alias3(((helper = (helper = helpers.optional || (depth0 != null ? depth0.optional : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"optional","hash":{},"data":data}) : helper)))
    + "<span class='idlParamType'>"
    + alias3((helpers.idlType || (depth0 && depth0.idlType) || alias2).call(alias1,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + alias3(((helper = (helper = helpers.variadic || (depth0 != null ? depth0.variadic : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"variadic","hash":{},"data":data}) : helper)))
    + "</span> <span class='idlParamName'>"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1["default"] : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>";
},"useData":true});
templates['serializer.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "serializer";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return " = <span class='idlSerializerValues'>"
    + container.escapeExpression(((helper = (helper = helpers.values || (depth0 != null ? depth0.values : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"values","hash":{},"data":data}) : helper)))
    + "</span>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing;

  return "<span class='idlSerializer' id=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "\" data-idl data-title='serializer'>"
    + alias1((helpers.extAttr || (depth0 && depth0.extAttr) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),(depth0 != null ? depth0.indent : depth0),{"name":"extAttr","hash":{},"data":data}))
    + alias1((helpers.idn || (depth0 && depth0.idn) || alias3).call(alias2,(depth0 != null ? depth0.indent : depth0),{"name":"idn","hash":{},"data":data}))
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias3).call(alias2,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.values : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ";</span>\n";
},"useData":true});
templates['typedef.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "<span class='idlTypedef' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.idlId : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.name : stack1), depth0))
    + "'>typedef "
    + alias2((helpers.typeExtAttrs || (depth0 && depth0.typeExtAttrs) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"typeExtAttrs","hash":{},"data":data}))
    + "<span class='idlTypedefType'>"
    + alias2((helpers.idlType || (depth0 && depth0.idlType) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"idlType","hash":{},"data":data}))
    + "</span> <span class='idlTypedefID'>"
    + ((stack1 = (helpers.tryLink || (depth0 && depth0.tryLink) || alias4).call(alias3,(depth0 != null ? depth0.obj : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>;</span>";
},"useData":true});
return templates;
});