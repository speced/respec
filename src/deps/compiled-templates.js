import Handlebars from './handlebars.runtime.js';

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attribute.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression((lookupProperty(helpers,"escapeAttributeName")||(depth0 && lookupProperty(depth0,"escapeAttributeName"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1),{"name":"escapeAttributeName","hash":{},"data":data,"loc":{"start":{"line":3,"column":47},"end":{"line":3,"column":79}}}));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlAttribute' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":81},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + alias2(((helper = (helper = lookupProperty(helpers,"qualifiers") || (depth0 != null ? lookupProperty(depth0,"qualifiers") : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"qualifiers","hash":{},"data":data,"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":30}}}) : helper)))
    + "attribute <span class='idlAttrType'>"
    + alias2((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":2,"column":66},"end":{"line":2,"column":81}}}))
    + "</span> "
    + alias2((lookupProperty(helpers,"pads")||(depth0 && lookupProperty(depth0,"pads"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"pad") : depth0),{"name":"pads","hash":{},"data":data,"loc":{"start":{"line":2,"column":89},"end":{"line":3,"column":5}}}))
    + "<span class='idlAttrName'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":31},"end":{"line":3,"column":91}}})) != null ? stack1 : "")
    + "</span>;</span>\r\n";
},"useData":true});
templates['callback.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlCallback' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":80},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + "callback <span class='idlCallbackID'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":53},"end":{"line":3,"column":14}}})) != null ? stack1 : "")
    + "</span> = <span class='idlCallbackType'>"
    + alias2((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":3,"column":54},"end":{"line":3,"column":69}}}))
    + "</span> ("
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"children") || (depth0 != null ? lookupProperty(depth0,"children") : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"children","hash":{},"data":data,"loc":{"start":{"line":3,"column":78},"end":{"line":3,"column":92}}}) : helper))) != null ? stack1 : "")
    + ");</span>";
},"useData":true});
templates['const.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlConst' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":77},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + "const <span class='idlConstType'>"
    + alias2((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":2,"column":49},"end":{"line":2,"column":64}}}))
    + "</span>"
    + alias2(((helper = (helper = lookupProperty(helpers,"nullable") || (depth0 != null ? lookupProperty(depth0,"nullable") : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"nullable","hash":{},"data":data,"loc":{"start":{"line":2,"column":71},"end":{"line":2,"column":83}}}) : helper)))
    + " "
    + alias2((lookupProperty(helpers,"pads")||(depth0 && lookupProperty(depth0,"pads"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"pad") : depth0),{"name":"pads","hash":{},"data":data,"loc":{"start":{"line":2,"column":84},"end":{"line":3,"column":2}}}))
    + "<span class='idlConstName'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":29},"end":{"line":4,"column":14}}})) != null ? stack1 : "")
    + "</span> = <span class='idlConstValue'>"
    + alias2((lookupProperty(helpers,"stringifyIdlConst")||(depth0 && lookupProperty(depth0,"stringifyIdlConst"))||alias4).call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"value") : stack1),{"name":"stringifyIdlConst","hash":{},"data":data,"loc":{"start":{"line":4,"column":52},"end":{"line":4,"column":83}}}))
    + "</span>;</span>\r\n";
},"useData":true});
templates['dict-member.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " = <span class='idlMemberValue'>"
    + container.escapeExpression((lookupProperty(helpers,"stringifyIdlConst")||(depth0 && lookupProperty(depth0,"stringifyIdlConst"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"default") : stack1),{"name":"stringifyIdlConst","hash":{},"data":data,"loc":{"start":{"line":4,"column":34},"end":{"line":4,"column":67}}}))
    + "</span>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlMember' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":78},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + alias2(((helper = (helper = lookupProperty(helpers,"qualifiers") || (depth0 != null ? lookupProperty(depth0,"qualifiers") : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"qualifiers","hash":{},"data":data,"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":30}}}) : helper)))
    + "<span class='idlMemberType'>"
    + alias2((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":2,"column":58},"end":{"line":2,"column":73}}}))
    + "</span> "
    + alias2((lookupProperty(helpers,"pads")||(depth0 && lookupProperty(depth0,"pads"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"typePad") : depth0),{"name":"pads","hash":{},"data":data,"loc":{"start":{"line":2,"column":81},"end":{"line":3,"column":2}}}))
    + "<span class='idlMemberName'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":30},"end":{"line":3,"column":70}}})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"default") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":77},"end":{"line":4,"column":81}}})) != null ? stack1 : "")
    + ";</span>\r\n";
},"useData":true});
templates['dictionary.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " : <span class='idlSuperclass'><a>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"inheritance") : stack1), depth0))
    + "</a></span>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlDictionary' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":82},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + alias2(((helper = (helper = lookupProperty(helpers,"partial") || (depth0 != null ? lookupProperty(depth0,"partial") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"partial","hash":{},"data":data,"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":27}}}) : helper)))
    + "dictionary <span class='idlDictionaryID'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":68},"end":{"line":3,"column":2}}})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"inheritance") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":103}}})) != null ? stack1 : "")
    + " &#123;\r\n"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"children") || (depth0 != null ? lookupProperty(depth0,"children") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"children","hash":{},"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":14}}}) : helper))) != null ? stack1 : "")
    + "&#125;;</span>";
},"useData":true});
templates['enum-item.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return alias3((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}))
    + "<a href=\"#dom-"
    + alias3(((helper = (helper = lookupProperty(helpers,"parentID") || (depth0 != null ? lookupProperty(depth0,"parentID") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"parentID","hash":{},"data":data,"loc":{"start":{"line":1,"column":28},"end":{"line":1,"column":40}}}) : helper)))
    + "-"
    + alias3(((helper = (helper = lookupProperty(helpers,"lname") || (depth0 != null ? lookupProperty(depth0,"lname") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lname","hash":{},"data":data,"loc":{"start":{"line":1,"column":41},"end":{"line":1,"column":50}}}) : helper)))
    + "\" class=\"idlEnumItem\">\""
    + alias3(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":73},"end":{"line":1,"column":81}}}) : helper)))
    + "\"</a>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"needsComma") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":86},"end":{"line":1,"column":112}}})) != null ? stack1 : "")
    + "\r\n";
},"useData":true});
templates['enum.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlEnum' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":76},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + "enum <span class='idlEnumID'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":85}}})) != null ? stack1 : "")
    + "</span> &#123;\r\n"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"children") || (depth0 != null ? lookupProperty(depth0,"children") : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"children","hash":{},"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":14}}}) : helper))) != null ? stack1 : "")
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":3,"column":14},"end":{"line":3,"column":28}}}))
    + "&#125;;</span>";
},"useData":true});
templates['extended-attribute.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='"
    + alias4(((helper = (helper = lookupProperty(helpers,"extAttrClassName") || (depth0 != null ? lookupProperty(depth0,"extAttrClassName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"extAttrClassName","hash":{},"data":data,"loc":{"start":{"line":3,"column":17},"end":{"line":3,"column":37}}}) : helper)))
    + "'><span class=\"extAttrName\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":65},"end":{"line":4,"column":4}}}) : helper)))
    + "</span>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"rhs") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":11},"end":{"line":5,"column":4}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"jsIf")||(depth0 && lookupProperty(depth0,"jsIf"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"arguments") : depth0),{"name":"jsIf","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":4},"end":{"line":6,"column":2}}})) != null ? stack1 : "")
    + "</span>";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "=<span class=\"extAttrRhs\">"
    + ((stack1 = (lookupProperty(helpers,"extAttrRhs")||(depth0 && lookupProperty(depth0,"extAttrRhs"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rhs") : depth0),{"name":"extAttrRhs","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":48},"end":{"line":4,"column":92}}})) != null ? stack1 : "")
    + "</span>";
},"3":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression(container.lambda(depth0, depth0));
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "("
    + ((stack1 = (lookupProperty(helpers,"joinNonWhitespace")||(depth0 && lookupProperty(depth0,"joinNonWhitespace"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"arguments") : depth0),", ",{"name":"joinNonWhitespace","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":24},"end":{"line":5,"column":97}}})) != null ? stack1 : "")
    + ")";
},"6":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression((lookupProperty(helpers,"param")||(depth0 && lookupProperty(depth0,"param"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"param","hash":{},"data":data,"loc":{"start":{"line":5,"column":61},"end":{"line":5,"column":75}}}));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return alias3((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":18}}}))
    + "["
    + ((stack1 = (lookupProperty(helpers,"join")||(depth0 && lookupProperty(depth0,"join"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"extAttrs") : depth0),(depth0 != null ? lookupProperty(depth0,"sep") : depth0),{"name":"join","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":19},"end":{"line":6,"column":18}}})) != null ? stack1 : "")
    + "]"
    + alias3(((helper = (helper = lookupProperty(helpers,"end") || (depth0 != null ? lookupProperty(depth0,"end") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"end","hash":{},"data":data,"loc":{"start":{"line":6,"column":19},"end":{"line":6,"column":26}}}) : helper)));
},"useData":true});
templates['field.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlField' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":77},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + "<span class='idlFieldType'>"
    + alias2((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":2,"column":43},"end":{"line":2,"column":58}}}))
    + "</span> "
    + alias2((lookupProperty(helpers,"pads")||(depth0 && lookupProperty(depth0,"pads"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"pad") : depth0),{"name":"pads","hash":{},"data":data,"loc":{"start":{"line":2,"column":66},"end":{"line":3,"column":5}}}))
    + "<span class='idlFieldName'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":32},"end":{"line":3,"column":72}}})) != null ? stack1 : "")
    + "</span>;</span>\r\n";
},"useData":true});
templates['implements.html'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlImplements'>"
    + alias3((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":28},"end":{"line":2,"column":2}}}))
    + alias3((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + "<a>"
    + alias3(alias4(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"target") : stack1), depth0))
    + "</a> implements <a>"
    + alias3(alias4(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"implements") : stack1), depth0))
    + "</a>;</span>";
},"useData":true});
templates['interface.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " : <span class='idlSuperclass'><a>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"inheritance") : stack1), depth0))
    + "</a></span>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlInterface' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":81},"end":{"line":2,"column":2}}}))
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + alias2(((helper = (helper = lookupProperty(helpers,"partial") || (depth0 != null ? lookupProperty(depth0,"partial") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"partial","hash":{},"data":data,"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":27}}}) : helper)))
    + alias2(((helper = (helper = lookupProperty(helpers,"callback") || (depth0 != null ? lookupProperty(depth0,"callback") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"callback","hash":{},"data":data,"loc":{"start":{"line":2,"column":27},"end":{"line":2,"column":39}}}) : helper)))
    + "interface <span class='idlInterfaceID'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":78},"end":{"line":3,"column":2}}})) != null ? stack1 : "")
    + "</span>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"inheritance") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":103}}})) != null ? stack1 : "")
    + " &#123;\r\n"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"children") || (depth0 != null ? lookupProperty(depth0,"children") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"children","hash":{},"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":14}}}) : helper))) != null ? stack1 : "")
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":4,"column":14},"end":{"line":4,"column":28}}}))
    + "&#125;;</span>";
},"useData":true});
templates['iterable.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "iterable";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlIterable' id=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "\" data-idl data-title='iterable'>"
    + alias1((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":76},"end":{"line":2,"column":2}}}))
    + alias1((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + alias1(((helper = (helper = lookupProperty(helpers,"qualifiers") || (depth0 != null ? lookupProperty(depth0,"qualifiers") : depth0)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(alias2,{"name":"qualifiers","hash":{},"data":data,"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":30}}}) : helper)))
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":30},"end":{"line":3,"column":2}}})) != null ? stack1 : "")
    + "&lt;"
    + alias1((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":21}}}))
    + "&gt;;</span>\r\n";
},"useData":true});
templates['line-comment.html'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlSectionComment'>"
    + alias3((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":1,"column":32},"end":{"line":1,"column":46}}}))
    + "//"
    + alias3(((helper = (helper = lookupProperty(helpers,"comment") || (depth0 != null ? lookupProperty(depth0,"comment") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"comment","hash":{},"data":data,"loc":{"start":{"line":1,"column":48},"end":{"line":1,"column":59}}}) : helper)))
    + "</span>\r\n";
},"useData":true});
templates['maplike.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "maplike";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlMaplike' id=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "\" data-idl data-title='maplike'>"
    + alias1((lookupProperty(helpers,"extAttr")||(depth0 && lookupProperty(depth0,"extAttr"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttr","hash":{},"data":data,"loc":{"start":{"line":1,"column":74},"end":{"line":2,"column":2}}}))
    + alias1((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":16}}}))
    + alias1(((helper = (helper = lookupProperty(helpers,"qualifiers") || (depth0 != null ? lookupProperty(depth0,"qualifiers") : depth0)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(alias2,{"name":"qualifiers","hash":{},"data":data,"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":30}}}) : helper)))
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":30},"end":{"line":3,"column":2}}})) != null ? stack1 : "")
    + "&lt;"
    + alias1((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":21}}}))
    + "&gt;;</span>\r\n";
},"useData":true});
templates['method.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlMethod' id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "\" data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>"
    + alias2((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":1,"column":78},"end":{"line":1,"column":92}}}))
    + alias2((lookupProperty(helpers,"extAttrInline")||(depth0 && lookupProperty(depth0,"extAttrInline"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"extAttrInline","hash":{},"data":data,"loc":{"start":{"line":1,"column":92},"end":{"line":2,"column":2}}}))
    + alias2(((helper = (helper = lookupProperty(helpers,"static") || (depth0 != null ? lookupProperty(depth0,"static") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"static","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":12}}}) : helper)))
    + alias2(((helper = (helper = lookupProperty(helpers,"special") || (depth0 != null ? lookupProperty(depth0,"special") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"special","hash":{},"data":data,"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":23}}}) : helper)))
    + "<span class='idlMethType'>"
    + alias2((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":2,"column":49},"end":{"line":2,"column":64}}}))
    + "</span> "
    + alias2((lookupProperty(helpers,"pads")||(depth0 && lookupProperty(depth0,"pads"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"pad") : depth0),{"name":"pads","hash":{},"data":data,"loc":{"start":{"line":2,"column":72},"end":{"line":3,"column":2}}}))
    + "<span class='idlMethName'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":28},"end":{"line":3,"column":68}}})) != null ? stack1 : "")
    + "</span>("
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"children") || (depth0 != null ? lookupProperty(depth0,"children") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"children","hash":{},"data":data,"loc":{"start":{"line":3,"column":76},"end":{"line":3,"column":90}}}) : helper))) != null ? stack1 : "")
    + ");</span>\r\n";
},"useData":true});
templates['multiline-comment.html'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return alias1((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"indent") : depths[1]),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":2,"column":19},"end":{"line":2,"column":36}}}))
    + alias1(container.lambda(depth0, depth0))
    + "\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlSectionComment'>"
    + alias3((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":1,"column":32},"end":{"line":1,"column":46}}}))
    + "/*"
    + alias3(((helper = (helper = lookupProperty(helpers,"firstLine") || (depth0 != null ? lookupProperty(depth0,"firstLine") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"firstLine","hash":{},"data":data,"loc":{"start":{"line":1,"column":48},"end":{"line":1,"column":61}}}) : helper)))
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"innerLine") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":3,"column":9}}})) != null ? stack1 : "")
    + alias3((lookupProperty(helpers,"idn")||(depth0 && lookupProperty(depth0,"idn"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"indent") : depth0),{"name":"idn","hash":{},"data":data,"loc":{"start":{"line":3,"column":9},"end":{"line":3,"column":23}}}))
    + alias3(((helper = (helper = lookupProperty(helpers,"lastLine") || (depth0 != null ? lookupProperty(depth0,"lastLine") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lastLine","hash":{},"data":data,"loc":{"start":{"line":3,"column":23},"end":{"line":3,"column":35}}}) : helper)))
    + "*/</span>\r\n";
},"useData":true,"useDepths":true});
templates['param.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " = <span class='idlDefaultValue'>"
    + container.escapeExpression((lookupProperty(helpers,"stringifyIdlConst")||(depth0 && lookupProperty(depth0,"stringifyIdlConst"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"default") : stack1),{"name":"stringifyIdlConst","hash":{},"data":data,"loc":{"start":{"line":5,"column":35},"end":{"line":5,"column":68}}}))
    + "</span>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlParam'>"
    + alias3((lookupProperty(helpers,"extAttrInline")||(depth0 && lookupProperty(depth0,"extAttrInline"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"extAttrInline","hash":{},"data":data,"loc":{"start":{"line":2,"column":27},"end":{"line":3,"column":2}}}))
    + alias3(((helper = (helper = lookupProperty(helpers,"optional") || (depth0 != null ? lookupProperty(depth0,"optional") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"optional","hash":{},"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":3,"column":14}}}) : helper)))
    + "<span class='idlParamType'>"
    + alias3((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":3,"column":41},"end":{"line":3,"column":56}}}))
    + alias3(((helper = (helper = lookupProperty(helpers,"variadic") || (depth0 != null ? lookupProperty(depth0,"variadic") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"variadic","hash":{},"data":data,"loc":{"start":{"line":3,"column":56},"end":{"line":4,"column":2}}}) : helper)))
    + "</span> <span class='idlParamName'>"
    + alias3(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "</span>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"default") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":56},"end":{"line":5,"column":82}}})) != null ? stack1 : "")
    + "</span>";
},"useData":true});
templates['typedef.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='idlTypedef' id='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"idlId") : stack1), depth0))
    + "' data-idl data-title='"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"obj") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "'>typedef <span class='idlTypedefType'>"
    + alias2((lookupProperty(helpers,"idlType")||(depth0 && lookupProperty(depth0,"idlType"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"idlType","hash":{},"data":data,"loc":{"start":{"line":1,"column":116},"end":{"line":2,"column":2}}}))
    + "</span> <span class='idlTypedefID'>"
    + ((stack1 = (lookupProperty(helpers,"tryLink")||(depth0 && lookupProperty(depth0,"tryLink"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"obj") : depth0),{"name":"tryLink","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":37},"end":{"line":2,"column":77}}})) != null ? stack1 : "")
    + "</span>;</span>";
},"useData":true});
templates['pcisig-conformance'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>Conformance</h2>\r\n<p>\r\n  As well as sections marked as non-normative, all implementation\r\n  notes and notes in this specification are non-normative. Everything\r\n  else in this specification is normative.\r\n</p>\r\n<p id='respecRFC2119'>\r\n  to be interpreted as described in [[!RFC2119]].\r\n</p>\r\n";
},"useData":true});
templates['pcisig-headers'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"prependPCIeLogo") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":4,"column":6},"end":{"line":16,"column":13}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    return "        <a href=\"https://www.pcisig.com/\">\r\n          <img width=\"210\" height=\"80\" alt=\"PCI Express Logo\"\r\n               src=\"https://sglaser.github.io/respec/Spec/StyleSheets/pcisig/pci_express_PMS.svg\"/>\r\n        </a>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"prependPCISIGLogo") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":8},"end":{"line":15,"column":15}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "          <a href=\"https://www.pcisig.com/\">\r\n            <img width=\"210\" height=\"108\" alt=\"PCI-SIG Logo\"\r\n                 src=\"https://sglaser.github.io/respec/Spec/StyleSheets/pcisig/pci_sig_logo_PMS_273.svg\"/>\r\n          </a>\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      &nbsp;&mdash;&nbsp;<span id=\"respec-banner-chapter\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"specChapter") || (depth0 != null ? lookupProperty(depth0,"specChapter") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"specChapter","hash":{},"data":data,"loc":{"start":{"line":24,"column":58},"end":{"line":24,"column":73}}}) : helper)))
    + "</span>\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    return " property='dcterms:title'";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <h2 "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":8},"end":{"line":32,"column":54}}})) != null ? stack1 : "")
    + "id='subtitle'>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subtitle") || (depth0 != null ? lookupProperty(depth0,"subtitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"subtitle","hash":{},"data":data,"loc":{"start":{"line":32,"column":68},"end":{"line":32,"column":80}}}) : helper)))
    + "</h2>\r\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "property='bibo:subtitle' ";
},"14":function(container,depth0,helpers,partials,data) {
    return "PCI-SIG ";
},"16":function(container,depth0,helpers,partials,data) {
    return "property=\"dcterms:issued\"";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"this_version") : stack1), depth0))
    + "</dt>\r\n      <dd><a class='u-url' href='"
    + alias2(((helper = (helper = lookupProperty(helpers,"thisVersion") || (depth0 != null ? lookupProperty(depth0,"thisVersion") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"thisVersion","hash":{},"data":data,"loc":{"start":{"line":43,"column":33},"end":{"line":43,"column":48}}}) : helper)))
    + "'>"
    + alias2(((helper = (helper = lookupProperty(helpers,"thisVersion") || (depth0 != null ? lookupProperty(depth0,"thisVersion") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"thisVersion","hash":{},"data":data,"loc":{"start":{"line":43,"column":50},"end":{"line":43,"column":65}}}) : helper)))
    + "</a></dd>\r\n      <dt>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"latest_published_version") : stack1), depth0))
    + "</dt>\r\n      <dd>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.program(21, data, 0),"data":data,"loc":{"start":{"line":45,"column":10},"end":{"line":45,"column":99}}})) != null ? stack1 : "")
    + "</dd>\r\n";
},"19":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"latestVersion") || (depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latestVersion","hash":{},"data":data,"loc":{"start":{"line":45,"column":40},"end":{"line":45,"column":57}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"latestVersion") || (depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latestVersion","hash":{},"data":data,"loc":{"start":{"line":45,"column":59},"end":{"line":45,"column":76}}}) : helper)))
    + "</a>";
},"21":function(container,depth0,helpers,partials,data) {
    return "none";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"bug_tracker") : stack1), depth0))
    + "</dt>\r\n      <dd>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"bugTrackerHTML") || (depth0 != null ? lookupProperty(depth0,"bugTrackerHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bugTrackerHTML","hash":{},"data":data,"loc":{"start":{"line":49,"column":10},"end":{"line":49,"column":30}}}) : helper))) != null ? stack1 : "")
    + "</dd>\r\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>Previous version:</dt>\r\n      <dd><a "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":13},"end":{"line":53,"column":56}}})) != null ? stack1 : "")
    + " href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevVersion") || (depth0 != null ? lookupProperty(depth0,"prevVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data,"loc":{"start":{"line":53,"column":63},"end":{"line":53,"column":78}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevVersion") || (depth0 != null ? lookupProperty(depth0,"prevVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data,"loc":{"start":{"line":53,"column":80},"end":{"line":53,"column":95}}}) : helper)))
    + "</a></dd>\r\n";
},"26":function(container,depth0,helpers,partials,data) {
    return "rel=\"dcterms:replaces\"";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleWGs") : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.program(31, data, 0),"data":data,"loc":{"start":{"line":56,"column":10},"end":{"line":56,"column":81}}})) != null ? stack1 : "")
    + "</dt>\r\n      <dd>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"wgHTML") || (depth0 != null ? lookupProperty(depth0,"wgHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"wgHTML","hash":{},"data":data,"loc":{"start":{"line":57,"column":10},"end":{"line":57,"column":22}}}) : helper))) != null ? stack1 : "")
    + "</dd>\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"workgroups") : stack1), depth0));
},"31":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"workgroup") : stack1), depth0));
},"33":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleEditors") : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.program(36, data, 0),"data":data,"loc":{"start":{"line":60,"column":10},"end":{"line":60,"column":79}}})) != null ? stack1 : "")
    + "</dt>\r\n      "
    + container.escapeExpression((lookupProperty(helpers,"showPeople")||(depth0 && lookupProperty(depth0,"showPeople"))||container.hooks.helperMissing).call(alias1,"Editor",(depth0 != null ? lookupProperty(depth0,"editors") : depth0),{"name":"showPeople","hash":{},"data":data,"loc":{"start":{"line":61,"column":6},"end":{"line":61,"column":37}}}))
    + "\r\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"editors") : stack1), depth0));
},"36":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"editor") : stack1), depth0));
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleAuthors") : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.program(41, data, 0),"data":data,"loc":{"start":{"line":64,"column":10},"end":{"line":64,"column":79}}})) != null ? stack1 : "")
    + "</dt>\r\n      "
    + container.escapeExpression((lookupProperty(helpers,"showPeople")||(depth0 && lookupProperty(depth0,"showPeople"))||container.hooks.helperMissing).call(alias1,"Author",(depth0 != null ? lookupProperty(depth0,"authors") : depth0),{"name":"showPeople","hash":{},"data":data,"loc":{"start":{"line":65,"column":6},"end":{"line":65,"column":37}}}))
    + "\r\n";
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"authors") : stack1), depth0));
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"author") : stack1), depth0));
},"43":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"otherLinks") : depth0),{"name":"each","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":68,"column":6},"end":{"line":101,"column":15}}})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"key") : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":69,"column":8},"end":{"line":100,"column":15}}})) != null ? stack1 : "");
},"45":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <dt "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":70,"column":14},"end":{"line":70,"column":51}}})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"key") || (depth0 != null ? lookupProperty(depth0,"key") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data,"loc":{"start":{"line":70,"column":52},"end":{"line":70,"column":59}}}) : helper)))
    + ":</dt>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"data") : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.program(58, data, 0),"data":data,"loc":{"start":{"line":71,"column":10},"end":{"line":99,"column":17}}})) != null ? stack1 : "");
},"46":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"class") || (depth0 != null ? lookupProperty(depth0,"class") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"class","hash":{},"data":data,"loc":{"start":{"line":70,"column":34},"end":{"line":70,"column":43}}}) : helper)))
    + "\"";
},"48":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"data") : depth0),{"name":"each","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":72,"column":12},"end":{"line":84,"column":21}}})) != null ? stack1 : "");
},"49":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"value") : depth0),{"name":"if","hash":{},"fn":container.program(50, data, 0),"inverse":container.program(55, data, 0),"data":data,"loc":{"start":{"line":73,"column":14},"end":{"line":83,"column":21}}})) != null ? stack1 : "");
},"50":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":74,"column":20},"end":{"line":74,"column":57}}})) != null ? stack1 : "")
    + ">\r\n                  "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":75,"column":18},"end":{"line":75,"column":56}}})) != null ? stack1 : "")
    + "\r\n                  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":76,"column":18},"end":{"line":76,"column":27}}}) : helper)))
    + "\r\n                  "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":77,"column":18},"end":{"line":77,"column":41}}})) != null ? stack1 : "")
    + "\r\n                </dd>\r\n";
},"51":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"href","hash":{},"data":data,"loc":{"start":{"line":75,"column":39},"end":{"line":75,"column":47}}}) : helper)))
    + "\">";
},"53":function(container,depth0,helpers,partials,data) {
    return "</a>";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(56, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":80,"column":16},"end":{"line":82,"column":23}}})) != null ? stack1 : "");
},"56":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                  <dd><a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":81,"column":31},"end":{"line":81,"column":39}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":81,"column":41},"end":{"line":81,"column":49}}}) : helper)))
    + "</a></dd>\r\n";
},"58":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"value") : depth0),{"name":"if","hash":{},"fn":container.program(59, data, 0),"inverse":container.program(61, data, 0),"data":data,"loc":{"start":{"line":86,"column":12},"end":{"line":98,"column":19}}})) != null ? stack1 : "");
},"59":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":87,"column":18},"end":{"line":87,"column":55}}})) != null ? stack1 : "")
    + ">\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":88,"column":16},"end":{"line":88,"column":54}}})) != null ? stack1 : "")
    + "\r\n                "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":89,"column":16},"end":{"line":89,"column":25}}}) : helper)))
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":90,"column":16},"end":{"line":90,"column":39}}})) != null ? stack1 : "")
    + "\r\n              </dd>\r\n";
},"61":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(62, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":93,"column":14},"end":{"line":97,"column":21}}})) != null ? stack1 : "");
},"62":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":94,"column":20},"end":{"line":94,"column":57}}})) != null ? stack1 : "")
    + ">\r\n                  <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":95,"column":27},"end":{"line":95,"column":35}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":95,"column":37},"end":{"line":95,"column":45}}}) : helper)))
    + "</a>\r\n                </dd>\r\n";
},"64":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>\r\n      Please check the <a href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"errata") || (depth0 != null ? lookupProperty(depth0,"errata") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"errata","hash":{},"data":data,"loc":{"start":{"line":106,"column":32},"end":{"line":106,"column":42}}}) : helper)))
    + "\"><strong>errata</strong></a> for any errors or issues\r\n      reported since publication.\r\n    </p>\r\n";
},"66":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleAlternates") : depth0),{"name":"if","hash":{},"fn":container.program(67, data, 0),"inverse":container.program(69, data, 0),"data":data,"loc":{"start":{"line":112,"column":6},"end":{"line":116,"column":13}}})) != null ? stack1 : "")
    + "      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"alternatesHTML") || (depth0 != null ? lookupProperty(depth0,"alternatesHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"alternatesHTML","hash":{},"data":data,"loc":{"start":{"line":117,"column":6},"end":{"line":117,"column":26}}}) : helper))) != null ? stack1 : "")
    + "\r\n    </p>\r\n";
},"67":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in these non-normative formats:\r\n";
},"69":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in this non-normative format:\r\n";
},"71":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0),{"name":"if","hash":{},"fn":container.program(72, data, 0),"inverse":container.program(74, data, 0),"data":data,"loc":{"start":{"line":121,"column":4},"end":{"line":133,"column":11}}})) != null ? stack1 : "");
},"72":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <p class='copyright'>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalCopyrightHolders") || (depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalCopyrightHolders","hash":{},"data":data,"loc":{"start":{"line":122,"column":27},"end":{"line":122,"column":59}}}) : helper))) != null ? stack1 : "")
    + "</p>\r\n";
},"74":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0),{"name":"if","hash":{},"fn":container.program(75, data, 0),"inverse":container.program(77, data, 0),"data":data,"loc":{"start":{"line":124,"column":6},"end":{"line":132,"column":13}}})) != null ? stack1 : "");
},"75":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"overrideCopyright") || (depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"overrideCopyright","hash":{},"data":data,"loc":{"start":{"line":125,"column":8},"end":{"line":125,"column":31}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"77":function(container,depth0,helpers,partials,data) {
    return "        <p class='copyright'>\r\n          This document is licensed under a\r\n          <a class='subfoot' href='https://creativecommons.org/licenses/by/3.0/' rel='license'>Creative Commons\r\n            Attribution 3.0 License</a>.\r\n        </p>\r\n";
},"79":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0),{"name":"if","hash":{},"fn":container.program(80, data, 0),"inverse":container.program(82, data, 0),"data":data,"loc":{"start":{"line":135,"column":4},"end":{"line":199,"column":11}}})) != null ? stack1 : "");
},"80":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"overrideCopyright") || (depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"overrideCopyright","hash":{},"data":data,"loc":{"start":{"line":136,"column":6},"end":{"line":136,"column":29}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"82":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <p class=\"copyright\">\r\n        Copyright &copy; "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"copyrightStart") : depth0),{"name":"if","hash":{},"fn":container.program(83, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":139,"column":25},"end":{"line":139,"column":73}}})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"publishYear") || (depth0 != null ? lookupProperty(depth0,"publishYear") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"publishYear","hash":{},"data":data,"loc":{"start":{"line":139,"column":73},"end":{"line":139,"column":88}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0),{"name":"if","hash":{},"fn":container.program(85, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":139,"column":89},"end":{"line":140,"column":82}}})) != null ? stack1 : "")
    + "\r\n        <a href=\"https://www.pcisig.com/\">PCI-SIG</a>\r\n        <sup>&reg;</sup>\r\n      </p>\r\n      <p class=\"copyright\">\r\n        PCI, PCI Express, PCIe, and PCI-SIG are trademarks or registered trademarks of PCI-SIG.\r\n        All other product names are trademarks, registered trademarks, or servicemarks of their respective owners.\r\n      </p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isNoTrack") : depth0),{"name":"if","hash":{},"fn":container.program(87, data, 0),"inverse":container.program(89, data, 0),"data":data,"loc":{"start":{"line":148,"column":6},"end":{"line":198,"column":13}}})) != null ? stack1 : "");
},"83":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"copyrightStart") || (depth0 != null ? lookupProperty(depth0,"copyrightStart") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"copyrightStart","hash":{},"data":data,"loc":{"start":{"line":139,"column":47},"end":{"line":139,"column":65}}}) : helper)))
    + "-";
},"85":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalCopyrightHolders") || (depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalCopyrightHolders","hash":{},"data":data,"loc":{"start":{"line":140,"column":37},"end":{"line":140,"column":69}}}) : helper))) != null ? stack1 : "")
    + " &amp;";
},"87":function(container,depth0,helpers,partials,data) {
    return "        <p class=\"copyright\">\r\n          PCI-SIG disclaims all warranties and liability for the use of this document\r\n          and the information contained herein and assumes no responsibility\r\n          for any errors that may appear in this document, nor does PCI-SIG make a commitment\r\n          to update the information contained herein.\r\n        </p>\r\n";
},"89":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <p class=\"copyright\">\r\n          Contact PCI-SIG Membership Services for questions about membership in the PCI-SIG\r\n          or to obtain the latest revision of this specification.\r\n          Contact PCI-SIG Technical Support for technical questions about this specification.\r\n        </p>\r\n        <dl class=\"copyright\">\r\n          <dt>Web Site</dt>\r\n          <dd><a href=\"http://www.pcisig.com\">http://www.pcisig.com</a></dd>\r\n          <dt>Membership Services</dt>\r\n          <dd><a href=\"mailto:administration@pcisig.com\">administration@pcisig.com</a></dd>\r\n          <dd><a href=\"tel:+1-503-619-0569\">+1-503-619-0569</a> (Phone)</dd>\r\n          <dd><a href=\"tel:+1-503-644-6708\">+1-503-644-6708</a> (Fax)</dd>\r\n          <dt>Technical Support</dt>\r\n          <dd><a href=\"mailto:techsupp@pcisig.com\">techsupp@pcisig.com</a></dd>\r\n        </dl>\r\n        <p class=\"copyright\"><strong>DISCLAIMER</strong></p>\r\n        <p class=\"copyright\">\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isClickThrough") : depth0),{"name":"if","hash":{},"fn":container.program(90, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":173,"column":10},"end":{"line":177,"column":17}}})) != null ? stack1 : "")
    + "          PCI-SIG disclaims all warranties and liability for the use of this document\r\n          and the information contained herein and assumes no responsibility\r\n          for any errors that may appear in this document, nor does PCI-SIG make a commitment\r\n          to update the information contained herein.\r\n        </p>\r\n        <p class=\"copyright\">\r\n          This PCI Specification is provided “as is” without any warranties of any kind,\r\n          including any warranty of merchantability, non-infringement, fitness for any\r\n          particular purpose, or any warranty otherwise arising out of any proposal,\r\n          specification, or sample. PCI-SIG disclaims all liability for infringement\r\n          of proprietary rights, relating to use of information in this specification.\r\n          This document itself may not be modified in any way, including by removing the\r\n          copyright notice or references to PCI-SIG.\r\n          No license, express or implied, by estoppel or otherwise, to any intellectual\r\n          property rights is granted herein.\r\n          PCI, PCI Express, PCIe, and PCI-SIG are trademarks or registered trademarks of\r\n          PCI-SIG.\r\n          All other product names are trademarks, registered trademarks, or servicemarks of\r\n          their respective owners.\r\n        </p>\r\n";
},"90":function(container,depth0,helpers,partials,data) {
    return "            This specification is the sole property of PCI-SIG® and\r\n            provided under a click through license through its website,\r\n            <a href=\"http://www.pcisig.com\">www.pcisig.com</a>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class='head'>\r\n  <p>\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isUnofficial") : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":17,"column":15}}})) != null ? stack1 : "")
    + "    "
    + ((stack1 = (lookupProperty(helpers,"showLogos")||(depth0 && lookupProperty(depth0,"showLogos"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"logos") : depth0),{"name":"showLogos","hash":{},"data":data,"loc":{"start":{"line":18,"column":4},"end":{"line":18,"column":25}}})) != null ? stack1 : "")
    + "\r\n  </p>\r\n\r\n  <div id=\"respec-banner\">\r\n    <span id=\"respec-banner-status\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"maturity") || (depth0 != null ? lookupProperty(depth0,"maturity") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"maturity","hash":{},"data":data,"loc":{"start":{"line":22,"column":36},"end":{"line":22,"column":48}}}) : helper)))
    + "</span>&nbsp;&mdash;&nbsp;\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"specChapter") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":4},"end":{"line":25,"column":11}}})) != null ? stack1 : "")
    + "    &nbsp;&mdash;&nbsp;<span id=\"respec-banner-spec-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":26,"column":58},"end":{"line":26,"column":67}}}) : helper)))
    + "</span>\r\n  </div>\r\n\r\n  <h1 class='title p-name' id='title'"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":29,"column":37},"end":{"line":29,"column":83}}})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":29,"column":84},"end":{"line":29,"column":93}}}) : helper)))
    + "</h1>\r\n\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subtitle") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":2},"end":{"line":33,"column":9}}})) != null ? stack1 : "")
    + "\r\n  <h2>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"prependPCISIG") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":6},"end":{"line":35,"column":42}}})) != null ? stack1 : "")
    + alias4(((helper = (helper = lookupProperty(helpers,"textStatus") || (depth0 != null ? lookupProperty(depth0,"textStatus") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"textStatus","hash":{},"data":data,"loc":{"start":{"line":35,"column":42},"end":{"line":35,"column":56}}}) : helper)))
    + "\r\n    <time "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":10},"end":{"line":36,"column":56}}})) != null ? stack1 : "")
    + " class='dt-published'\r\n          datetime='"
    + alias4(((helper = (helper = lookupProperty(helpers,"dashDate") || (depth0 != null ? lookupProperty(depth0,"dashDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dashDate","hash":{},"data":data,"loc":{"start":{"line":37,"column":20},"end":{"line":37,"column":32}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"publishHumanDate") || (depth0 != null ? lookupProperty(depth0,"publishHumanDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"publishHumanDate","hash":{},"data":data,"loc":{"start":{"line":37,"column":34},"end":{"line":37,"column":54}}}) : helper)))
    + "</time>\r\n  </h2>\r\n\r\n  <dl>\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isNoTrack") : depth0),{"name":"unless","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":41,"column":4},"end":{"line":46,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"bugTrackerHTML") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":47,"column":4},"end":{"line":50,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"showPreviousVersion") : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":51,"column":4},"end":{"line":54,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"wg") : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":55,"column":4},"end":{"line":58,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"editors") : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":59,"column":4},"end":{"line":62,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"authors") : depth0),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":63,"column":4},"end":{"line":66,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"otherLinks") : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":67,"column":4},"end":{"line":102,"column":11}}})) != null ? stack1 : "")
    + "  </dl>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"errata") : depth0),{"name":"if","hash":{},"fn":container.program(64, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":104,"column":2},"end":{"line":109,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"alternateFormats") : depth0),{"name":"if","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":110,"column":2},"end":{"line":119,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isUnofficial") : depth0),{"name":"if","hash":{},"fn":container.program(71, data, 0),"inverse":container.program(79, data, 0),"data":data,"loc":{"start":{"line":120,"column":2},"end":{"line":200,"column":9}}})) != null ? stack1 : "")
    + "  <hr title=\"Separator for header\">\r\n</div>\r\n";
},"useData":true});
templates['pcisig-sotd'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "  <details class=\"annoying-warning\" open=\"\">\r\n    <summary>This is a preview</summary>\r\n    <p>\r\n      Do not attempt to implement this version of the specification. Do not reference this\r\n      version as authoritative in any way.\r\n    </p>\r\n  </details>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <p>\r\n    This document is draft of a potential specification. It has no official standing of\r\n    any kind and does not represent the support or consensus of any standards organisation.\r\n  </p>\r\n  "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":16,"column":2},"end":{"line":16,"column":25}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isNoTrack") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data,"loc":{"start":{"line":18,"column":2},"end":{"line":65,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isSubmission") : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.program(29, data, 0),"data":data,"loc":{"start":{"line":66,"column":2},"end":{"line":84,"column":9}}})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>\r\n      This document is a PCISIG internal document. It has no official standing of any kind and does not represent\r\n      consensus of the PCISIG Membership.\r\n    </p>\r\n    "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":23,"column":4},"end":{"line":23,"column":27}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"overrideStatus") : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":4},"end":{"line":64,"column":15}}})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isFinal") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data,"loc":{"start":{"line":26,"column":6},"end":{"line":63,"column":13}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return "        <p>\r\n          This specification is an official publication of the PCISIG. The PCISIG\r\n          may publish errata to this specification and may develop future revisions to this\r\n          specification.\r\n        </p>\r\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <p>\r\n          This specification is intended to become a PCISIG Standard.\r\n          This particular document is a <strong>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"specStatusLong") || (depth0 != null ? lookupProperty(depth0,"specStatusLong") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"specStatusLong","hash":{},"data":data,"loc":{"start":{"line":35,"column":48},"end":{"line":35,"column":66}}}) : helper)))
    + "</strong>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"specLevelLong") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":10},"end":{"line":41,"column":17}}})) != null ? stack1 : "")
    + ".\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"specReviewLong") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":42,"column":10},"end":{"line":46,"column":17}}})) != null ? stack1 : "")
    + "        </p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"is09") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":8},"end":{"line":51,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"is07") : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":52,"column":8},"end":{"line":56,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"is05") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":8},"end":{"line":59,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"is03") : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":60,"column":8},"end":{"line":62,"column":15}}})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            of the <strong>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"specLevelLong") || (depth0 != null ? lookupProperty(depth0,"specLevelLong") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"specLevelLong","hash":{},"data":data,"loc":{"start":{"line":37,"column":27},"end":{"line":37,"column":44}}}) : helper)))
    + "</strong> document\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"specReviewLong") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":38,"column":12},"end":{"line":40,"column":19}}})) != null ? stack1 : "")
    + "          ";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              for <strong>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"specReviewLong") || (depth0 != null ? lookupProperty(depth0,"specReviewLong") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"specReviewLong","hash":{},"data":data,"loc":{"start":{"line":39,"column":26},"end":{"line":39,"column":44}}}) : helper)))
    + "</strong>\r\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"humanReviewEndDate") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":12},"end":{"line":45,"column":19}}})) != null ? stack1 : "");
},"17":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              The "
    + alias4(((helper = (helper = lookupProperty(helpers,"specReviewLong") || (depth0 != null ? lookupProperty(depth0,"specReviewLong") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"specReviewLong","hash":{},"data":data,"loc":{"start":{"line":44,"column":18},"end":{"line":44,"column":36}}}) : helper)))
    + " period ends 5:00 PM US Pacific Time on <b>"
    + alias4(((helper = (helper = lookupProperty(helpers,"humanReviewEndDate") || (depth0 != null ? lookupProperty(depth0,"humanReviewEndDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"humanReviewEndDate","hash":{},"data":data,"loc":{"start":{"line":44,"column":79},"end":{"line":44,"column":101}}}) : helper)))
    + "</b>.\r\n";
},"19":function(container,depth0,helpers,partials,data) {
    return "          <p>PCISIG publishes a 0.9 maturity level specification to indicate that the document is believed to be\r\n            stable and to encourage implementation by the developer community.</p>\r\n";
},"21":function(container,depth0,helpers,partials,data) {
    return "          <p>\r\n            PCISIG publishes a 0.7 maturity level specification to indicate that the ...\r\n          </p>\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    return "          <p>PCISIG publishes a 0.5 maturity level specification to indicate that the ...</p>\r\n";
},"25":function(container,depth0,helpers,partials,data) {
    return "          <p>PCISIG publishes a 0.3 maturity level specification to indicate that the ...</p>\r\n";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":67,"column":4},"end":{"line":67,"column":27}}}) : helper))) != null ? stack1 : "")
    + "\r\n    <p>PCISIG acknowledges that the Submitting Member have made a formal Submission request to PCISIG for\r\n      discussion. Publication of this document by PCISIG indicates no endorsement of its content by PCISIG, nor that\r\n      PCISIG has, is, or will be allocating any resources to the issues addressed by it. This document is not the\r\n      product of a chartered PCISIG Workgroup. </p>\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"sotdAfterWGinfo") : depth0),{"name":"unless","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":73,"column":4},"end":{"line":75,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"notRec") : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":76,"column":4},"end":{"line":82,"column":11}}})) != null ? stack1 : "")
    + "    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"addPatentNote") : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":83,"column":4},"end":{"line":83,"column":58}}})) != null ? stack1 : "")
    + "\r\n";
},"30":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":74,"column":6},"end":{"line":74,"column":29}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"32":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <p>\r\n        Publication as "
    + alias4(((helper = (helper = lookupProperty(helpers,"anOrA") || (depth0 != null ? lookupProperty(depth0,"anOrA") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"anOrA","hash":{},"data":data,"loc":{"start":{"line":78,"column":23},"end":{"line":78,"column":32}}}) : helper)))
    + " "
    + alias4(((helper = (helper = lookupProperty(helpers,"textStatus") || (depth0 != null ? lookupProperty(depth0,"textStatus") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"textStatus","hash":{},"data":data,"loc":{"start":{"line":78,"column":33},"end":{"line":78,"column":47}}}) : helper)))
    + " does not imply endorsement by the PCISIG. This is a draft document and\r\n        may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document\r\n        as other than work in progress.\r\n      </p>\r\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"addPatentNote") || (depth0 != null ? lookupProperty(depth0,"addPatentNote") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"addPatentNote","hash":{},"data":data,"loc":{"start":{"line":83,"column":28},"end":{"line":83,"column":47}}}) : helper))) != null ? stack1 : "")
    + "</p>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h2>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"sotd") : stack1), depth0))
    + "</h2>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isPreview") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":10,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isUnofficial") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data,"loc":{"start":{"line":11,"column":0},"end":{"line":85,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalSections") || (depth0 != null ? lookupProperty(depth0,"additionalSections") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"additionalSections","hash":{},"data":data,"loc":{"start":{"line":86,"column":0},"end":{"line":86,"column":24}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"useData":true});
templates['cgbg-headers.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"showLogos")||(depth0 && lookupProperty(depth0,"showLogos"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"logos") : depth0),{"name":"showLogos","hash":{},"data":data,"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":25}}})) != null ? stack1 : "")
    + "\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return " property='dc:title'";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <h2 "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":8},"end":{"line":10,"column":54}}})) != null ? stack1 : "")
    + "id='subtitle'>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subtitle") || (depth0 != null ? lookupProperty(depth0,"subtitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"subtitle","hash":{},"data":data,"loc":{"start":{"line":10,"column":68},"end":{"line":10,"column":80}}}) : helper)))
    + "</h2>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "property='bibo:subtitle' ";
},"8":function(container,depth0,helpers,partials,data) {
    return "property=\"dc:issued\"";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"this_version") : stack1), depth0))
    + "</dt>\r\n      <dd><a class='u-url' href='"
    + alias1(((helper = (helper = lookupProperty(helpers,"thisVersion") || (depth0 != null ? lookupProperty(depth0,"thisVersion") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"thisVersion","hash":{},"data":data,"loc":{"start":{"line":16,"column":33},"end":{"line":16,"column":48}}}) : helper)))
    + "'>"
    + alias1(((helper = (helper = lookupProperty(helpers,"thisVersion") || (depth0 != null ? lookupProperty(depth0,"thisVersion") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"thisVersion","hash":{},"data":data,"loc":{"start":{"line":16,"column":50},"end":{"line":16,"column":65}}}) : helper)))
    + "</a></dd>\r\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"latest_published_version") : stack1), depth0))
    + "</dt>\r\n      <dd><a href='"
    + alias1(((helper = (helper = lookupProperty(helpers,"latestVersion") || (depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"latestVersion","hash":{},"data":data,"loc":{"start":{"line":20,"column":19},"end":{"line":20,"column":36}}}) : helper)))
    + "'>"
    + alias1(((helper = (helper = lookupProperty(helpers,"latestVersion") || (depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"latestVersion","hash":{},"data":data,"loc":{"start":{"line":20,"column":38},"end":{"line":20,"column":55}}}) : helper)))
    + "</a></dd>\r\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"latest_editors_draft") : stack1), depth0))
    + "</dt>\r\n      <dd><a href='"
    + alias1(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":24,"column":19},"end":{"line":24,"column":33}}}) : helper)))
    + "'>"
    + alias1(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":24,"column":35},"end":{"line":24,"column":49}}}) : helper)))
    + "</a></dd>\r\n";
},"16":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>Test suite:</dt>\r\n      <dd><a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"testSuiteURI") || (depth0 != null ? lookupProperty(depth0,"testSuiteURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testSuiteURI","hash":{},"data":data,"loc":{"start":{"line":28,"column":19},"end":{"line":28,"column":35}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"testSuiteURI") || (depth0 != null ? lookupProperty(depth0,"testSuiteURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testSuiteURI","hash":{},"data":data,"loc":{"start":{"line":28,"column":37},"end":{"line":28,"column":53}}}) : helper)))
    + "</a></dd>\r\n";
},"18":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>Implementation report:</dt>\r\n      <dd><a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"implementationReportURI") || (depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"implementationReportURI","hash":{},"data":data,"loc":{"start":{"line":32,"column":19},"end":{"line":32,"column":46}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"implementationReportURI") || (depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"implementationReportURI","hash":{},"data":data,"loc":{"start":{"line":32,"column":48},"end":{"line":32,"column":75}}}) : helper)))
    + "</a></dd>\r\n";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"bug_tracker") : stack1), depth0))
    + "</dt>\r\n      <dd>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"bugTrackerHTML") || (depth0 != null ? lookupProperty(depth0,"bugTrackerHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bugTrackerHTML","hash":{},"data":data,"loc":{"start":{"line":36,"column":10},"end":{"line":36,"column":30}}}) : helper))) != null ? stack1 : "")
    + "</dd>\r\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>Previous version:</dt>\r\n      <dd><a "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":13},"end":{"line":40,"column":56}}})) != null ? stack1 : "")
    + " href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevVersion") || (depth0 != null ? lookupProperty(depth0,"prevVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data,"loc":{"start":{"line":40,"column":63},"end":{"line":40,"column":78}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevVersion") || (depth0 != null ? lookupProperty(depth0,"prevVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data,"loc":{"start":{"line":40,"column":80},"end":{"line":40,"column":95}}}) : helper)))
    + "</a></dd>\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    return "rel=\"dcterms:replaces\"";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"prevED") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":6},"end":{"line":46,"column":13}}})) != null ? stack1 : "");
},"26":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <dt>Previous editor's draft:</dt>\r\n        <dd><a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevED") || (depth0 != null ? lookupProperty(depth0,"prevED") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevED","hash":{},"data":data,"loc":{"start":{"line":45,"column":21},"end":{"line":45,"column":31}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevED") || (depth0 != null ? lookupProperty(depth0,"prevED") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevED","hash":{},"data":data,"loc":{"start":{"line":45,"column":33},"end":{"line":45,"column":43}}}) : helper)))
    + "</a></dd>\r\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"editors") : stack1), depth0));
},"30":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"editor") : stack1), depth0));
},"32":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleAuthors") : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.program(35, data, 0),"data":data,"loc":{"start":{"line":51,"column":10},"end":{"line":51,"column":79}}})) != null ? stack1 : "")
    + "</dt>\r\n      "
    + container.escapeExpression((lookupProperty(helpers,"showPeople")||(depth0 && lookupProperty(depth0,"showPeople"))||container.hooks.helperMissing).call(alias1,"Author",(depth0 != null ? lookupProperty(depth0,"authors") : depth0),{"name":"showPeople","hash":{},"data":data,"loc":{"start":{"line":52,"column":6},"end":{"line":52,"column":37}}}))
    + "\r\n";
},"33":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"authors") : stack1), depth0));
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"author") : stack1), depth0));
},"37":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"otherLinks") : depth0),{"name":"each","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":55,"column":6},"end":{"line":88,"column":15}}})) != null ? stack1 : "");
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"key") : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":56,"column":8},"end":{"line":87,"column":15}}})) != null ? stack1 : "");
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <dt "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":14},"end":{"line":57,"column":51}}})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"key") || (depth0 != null ? lookupProperty(depth0,"key") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data,"loc":{"start":{"line":57,"column":52},"end":{"line":57,"column":59}}}) : helper)))
    + ":</dt>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"data") : depth0),{"name":"if","hash":{},"fn":container.program(42, data, 0),"inverse":container.program(52, data, 0),"data":data,"loc":{"start":{"line":58,"column":10},"end":{"line":86,"column":17}}})) != null ? stack1 : "");
},"40":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"class") || (depth0 != null ? lookupProperty(depth0,"class") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"class","hash":{},"data":data,"loc":{"start":{"line":57,"column":34},"end":{"line":57,"column":43}}}) : helper)))
    + "\"";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"data") : depth0),{"name":"each","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":59,"column":13},"end":{"line":71,"column":22}}})) != null ? stack1 : "");
},"43":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"value") : depth0),{"name":"if","hash":{},"fn":container.program(44, data, 0),"inverse":container.program(49, data, 0),"data":data,"loc":{"start":{"line":60,"column":16},"end":{"line":70,"column":23}}})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                  <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":61,"column":22},"end":{"line":61,"column":59}}})) != null ? stack1 : "")
    + ">\r\n                    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":62,"column":20},"end":{"line":62,"column":58}}})) != null ? stack1 : "")
    + "\r\n                      "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":63,"column":22},"end":{"line":63,"column":31}}}) : helper)))
    + "\r\n                    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":64,"column":20},"end":{"line":64,"column":43}}})) != null ? stack1 : "")
    + "\r\n                  </dd>\r\n";
},"45":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"href","hash":{},"data":data,"loc":{"start":{"line":62,"column":41},"end":{"line":62,"column":49}}}) : helper)))
    + "\">";
},"47":function(container,depth0,helpers,partials,data) {
    return "</a>";
},"49":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(50, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":67,"column":18},"end":{"line":69,"column":25}}})) != null ? stack1 : "");
},"50":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <dd><a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":68,"column":33},"end":{"line":68,"column":41}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":68,"column":43},"end":{"line":68,"column":51}}}) : helper)))
    + "</a></dd>\r\n";
},"52":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"value") : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.program(55, data, 0),"data":data,"loc":{"start":{"line":73,"column":12},"end":{"line":85,"column":19}}})) != null ? stack1 : "");
},"53":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":74,"column":18},"end":{"line":74,"column":55}}})) != null ? stack1 : "")
    + ">\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":75,"column":16},"end":{"line":75,"column":54}}})) != null ? stack1 : "")
    + "\r\n                  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":76,"column":18},"end":{"line":76,"column":27}}}) : helper)))
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":77,"column":16},"end":{"line":77,"column":39}}})) != null ? stack1 : "")
    + "\r\n              </dd>\r\n";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(56, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":80,"column":14},"end":{"line":84,"column":21}}})) != null ? stack1 : "");
},"56":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":81,"column":20},"end":{"line":81,"column":57}}})) != null ? stack1 : "")
    + ">\r\n                  <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":82,"column":27},"end":{"line":82,"column":35}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":82,"column":37},"end":{"line":82,"column":45}}}) : helper)))
    + "</a>\r\n                </dd>\r\n";
},"58":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleAlternates") : depth0),{"name":"if","hash":{},"fn":container.program(59, data, 0),"inverse":container.program(61, data, 0),"data":data,"loc":{"start":{"line":93,"column":6},"end":{"line":97,"column":13}}})) != null ? stack1 : "")
    + "      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"alternatesHTML") || (depth0 != null ? lookupProperty(depth0,"alternatesHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"alternatesHTML","hash":{},"data":data,"loc":{"start":{"line":98,"column":6},"end":{"line":98,"column":26}}}) : helper))) != null ? stack1 : "")
    + "\r\n    </p>\r\n";
},"59":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in these non-normative formats: \r\n";
},"61":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in this non-normative format: \r\n";
},"63":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"copyrightStart") || (depth0 != null ? lookupProperty(depth0,"copyrightStart") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"copyrightStart","hash":{},"data":data,"loc":{"start":{"line":103,"column":26},"end":{"line":103,"column":44}}}) : helper)))
    + "-";
},"65":function(container,depth0,helpers,partials,data) {
    return "      <a href=\"https://www.w3.org/community/about/agreements/fsa/\">W3C Community Final Specification Agreement (FSA)</a>. \r\n      A human-readable <a href=\"https://www.w3.org/community/about/agreements/fsa-deed/\">summary</a> is available.\r\n";
},"67":function(container,depth0,helpers,partials,data) {
    return "      <a href=\"https://www.w3.org/community/about/agreements/cla/\">W3C Community Contributor License Agreement (CLA)</a>.\r\n      A human-readable <a href=\"https://www.w3.org/community/about/agreements/cla-deed/\">summary</a> is available.\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class='head'>\r\n  <p>\r\n    <a class='logo' href='https://www.w3.org/'><img width='72' height='48' src='https://www.w3.org/StyleSheets/TR/2016/logos/W3C' alt='W3C'></a>\r\n  </p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"logos") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":7,"column":9}}})) != null ? stack1 : "")
    + "  <h1 class='title p-name' id='title'"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":37},"end":{"line":8,"column":78}}})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":8,"column":79},"end":{"line":8,"column":88}}}) : helper)))
    + "</h1>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subtitle") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":2},"end":{"line":11,"column":9}}})) != null ? stack1 : "")
    + "  <h2>"
    + alias4(((helper = (helper = lookupProperty(helpers,"longStatus") || (depth0 != null ? lookupProperty(depth0,"longStatus") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"longStatus","hash":{},"data":data,"loc":{"start":{"line":12,"column":6},"end":{"line":12,"column":20}}}) : helper)))
    + " <time "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":27},"end":{"line":12,"column":68}}})) != null ? stack1 : "")
    + "class='dt-published' datetime='"
    + alias4(((helper = (helper = lookupProperty(helpers,"dashDate") || (depth0 != null ? lookupProperty(depth0,"dashDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dashDate","hash":{},"data":data,"loc":{"start":{"line":12,"column":99},"end":{"line":12,"column":111}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"publishHumanDate") || (depth0 != null ? lookupProperty(depth0,"publishHumanDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"publishHumanDate","hash":{},"data":data,"loc":{"start":{"line":12,"column":113},"end":{"line":12,"column":133}}}) : helper)))
    + "</time></h2>\r\n  <dl>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"thisVersion") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":4},"end":{"line":17,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":4},"end":{"line":21,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":4},"end":{"line":25,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"testSuiteURI") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":4},"end":{"line":29,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":30,"column":4},"end":{"line":33,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"bugTrackerHTML") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":4},"end":{"line":37,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"prevVersion") : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":38,"column":4},"end":{"line":41,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isCGFinal") : depth0),{"name":"unless","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":42,"column":4},"end":{"line":47,"column":15}}})) != null ? stack1 : "")
    + "    <dt>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleEditors") : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.program(30, data, 0),"data":data,"loc":{"start":{"line":48,"column":8},"end":{"line":48,"column":77}}})) != null ? stack1 : "")
    + "</dt>\r\n    "
    + alias4((lookupProperty(helpers,"showPeople")||(depth0 && lookupProperty(depth0,"showPeople"))||alias2).call(alias1,"Editor",(depth0 != null ? lookupProperty(depth0,"editors") : depth0),{"name":"showPeople","hash":{},"data":data,"loc":{"start":{"line":49,"column":4},"end":{"line":49,"column":35}}}))
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"authors") : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":50,"column":4},"end":{"line":53,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"otherLinks") : depth0),{"name":"if","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":54,"column":4},"end":{"line":89,"column":11}}})) != null ? stack1 : "")
    + "  </dl>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"alternateFormats") : depth0),{"name":"if","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":91,"column":2},"end":{"line":100,"column":9}}})) != null ? stack1 : "")
    + "  <p class='copyright'>\r\n    <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy;\r\n    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"copyrightStart") : depth0),{"name":"if","hash":{},"fn":container.program(63, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":103,"column":4},"end":{"line":103,"column":52}}})) != null ? stack1 : "")
    + alias4(((helper = (helper = lookupProperty(helpers,"publishYear") || (depth0 != null ? lookupProperty(depth0,"publishYear") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"publishYear","hash":{},"data":data,"loc":{"start":{"line":103,"column":52},"end":{"line":103,"column":67}}}) : helper)))
    + "\r\n    the Contributors to the "
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":104,"column":28},"end":{"line":104,"column":37}}}) : helper)))
    + " Specification, published by the\r\n    <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgURI") || (depth0 != null ? lookupProperty(depth0,"wgURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgURI","hash":{},"data":data,"loc":{"start":{"line":105,"column":13},"end":{"line":105,"column":22}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"wg") || (depth0 != null ? lookupProperty(depth0,"wg") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wg","hash":{},"data":data,"loc":{"start":{"line":105,"column":24},"end":{"line":105,"column":30}}}) : helper)))
    + "</a> under the\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isCGFinal") : depth0),{"name":"if","hash":{},"fn":container.program(65, data, 0),"inverse":container.program(67, data, 0),"data":data,"loc":{"start":{"line":106,"column":4},"end":{"line":112,"column":11}}})) != null ? stack1 : "")
    + "  </p>\r\n  <hr title=\"Separator for header\">\r\n</div>\r\n";
},"useData":true});
templates['cgbg-sotd.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <details class=\"annoying-warning\" open=\"\">\r\n    <summary>This is a preview</summary>\r\n    <p>\r\n      Do not attempt to implement this version of the specification. Do not reference this\r\n      version as authoritative in any way.\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":6},"end":{"line":10,"column":13}}})) != null ? stack1 : "")
    + "    </p>\r\n  </details>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        Instead, see <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":9,"column":30},"end":{"line":9,"column":44}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":9,"column":46},"end":{"line":9,"column":60}}}) : helper)))
    + "</a> for the Editor's draft.\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "    Please note that under the\r\n    <a href=\"https://www.w3.org/community/about/agreements/final/\">W3C Community Final Specification Agreement (FSA)</a>\r\n    other conditions apply.\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "    Please note that under the\r\n    <a href=\"https://www.w3.org/community/about/agreements/cla/\">W3C Community Contributor License Agreement (CLA)</a>\r\n    there is a limited opt-out and other conditions apply.\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":30,"column":2},"end":{"line":30,"column":25}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>If you wish to make comments regarding this document, please send them to\r\n    <a href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":34,"column":20},"end":{"line":34,"column":36}}}) : helper)))
    + "@w3.org"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":43},"end":{"line":34,"column":100}}})) != null ? stack1 : "")
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":34,"column":102},"end":{"line":34,"column":118}}}) : helper)))
    + "@w3.org</a>\r\n    (<a href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":35,"column":21},"end":{"line":35,"column":37}}}) : helper)))
    + "-request@w3.org?subject=subscribe'>subscribe</a>,\r\n    <a\r\n      href='https://lists.w3.org/Archives/Public/"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":37,"column":49},"end":{"line":37,"column":65}}}) : helper)))
    + "/'>archives</a>)"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":37,"column":81},"end":{"line":39,"column":26}}})) != null ? stack1 : "")
    + ".</p>\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "?subject="
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subjectPrefixEnc") || (depth0 != null ? lookupProperty(depth0,"subjectPrefixEnc") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subjectPrefixEnc","hash":{},"data":data,"loc":{"start":{"line":34,"column":73},"end":{"line":34,"column":93}}}) : helper)));
},"13":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\r\n    with <code>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subjectPrefix") || (depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subjectPrefix","hash":{},"data":data,"loc":{"start":{"line":38,"column":15},"end":{"line":38,"column":32}}}) : helper)))
    + "</code> at the start of your\r\n    email's subject";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h2>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"sotd") : stack1), depth0))
    + "</h2>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"isPreview") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":13,"column":7}}})) != null ? stack1 : "")
    + "<p>\r\n  This specification was published by the <a href='"
    + alias1(((helper = (helper = lookupProperty(helpers,"wgURI") || (depth0 != null ? lookupProperty(depth0,"wgURI") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"wgURI","hash":{},"data":data,"loc":{"start":{"line":15,"column":51},"end":{"line":15,"column":60}}}) : helper)))
    + "'>"
    + alias1(((helper = (helper = lookupProperty(helpers,"wg") || (depth0 != null ? lookupProperty(depth0,"wg") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"wg","hash":{},"data":data,"loc":{"start":{"line":15,"column":62},"end":{"line":15,"column":68}}}) : helper)))
    + "</a>.\r\n  It is not a W3C Standard nor is it on the W3C Standards Track.\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"isCGFinal") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":17,"column":2},"end":{"line":25,"column":9}}})) != null ? stack1 : "")
    + "  Learn more about\r\n  <a href=\"https://www.w3.org/community/\">W3C Community and Business Groups</a>.\r\n</p>\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias2,(depth0 != null ? lookupProperty(depth0,"sotdAfterWGinfo") : depth0),{"name":"unless","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":29,"column":0},"end":{"line":31,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":2},"end":{"line":40,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"sotdAfterWGinfo") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":41,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalSections") || (depth0 != null ? lookupProperty(depth0,"additionalSections") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"additionalSections","hash":{},"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":44,"column":24}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"useData":true});
templates['conformance.html'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>Conformance</h2>\r\n<p>\r\n  As well as sections marked as non-normative, all authoring guidelines, diagrams, examples,\r\n  and notes in this specification are non-normative. Everything else in this specification is\r\n  normative.\r\n</p>\r\n<p id='respecRFC2119'>\r\n  to be interpreted as described in [[!RFC2119]].\r\n</p>\r\n";
},"useData":true});
templates['headers.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "    <p>\r\n      <a class='logo' href='https://www.w3.org/'><img width='72' height='48' src='https://www.w3.org/StyleSheets/TR/2016/logos/W3C' alt='W3C'></a>\r\n    </p>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return " property='dcterms:title'";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <h2 "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":8},"end":{"line":10,"column":54}}})) != null ? stack1 : "")
    + "id='subtitle'>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subtitle") || (depth0 != null ? lookupProperty(depth0,"subtitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"subtitle","hash":{},"data":data,"loc":{"start":{"line":10,"column":68},"end":{"line":10,"column":80}}}) : helper)))
    + "</h2>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "property='bibo:subtitle' ";
},"8":function(container,depth0,helpers,partials,data) {
    return "W3C ";
},"10":function(container,depth0,helpers,partials,data) {
    return "property=\"dcterms:issued\"";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"this_version") : stack1), depth0))
    + "</dt>\r\n      <dd><a class='u-url' href='"
    + alias2(((helper = (helper = lookupProperty(helpers,"thisVersion") || (depth0 != null ? lookupProperty(depth0,"thisVersion") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"thisVersion","hash":{},"data":data,"loc":{"start":{"line":16,"column":33},"end":{"line":16,"column":48}}}) : helper)))
    + "'>"
    + alias2(((helper = (helper = lookupProperty(helpers,"thisVersion") || (depth0 != null ? lookupProperty(depth0,"thisVersion") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"thisVersion","hash":{},"data":data,"loc":{"start":{"line":16,"column":50},"end":{"line":16,"column":65}}}) : helper)))
    + "</a></dd>\r\n      <dt>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"latest_published_version") : stack1), depth0))
    + "</dt>\r\n      <dd>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data,"loc":{"start":{"line":18,"column":10},"end":{"line":18,"column":99}}})) != null ? stack1 : "")
    + "</dd>\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"latestVersion") || (depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latestVersion","hash":{},"data":data,"loc":{"start":{"line":18,"column":40},"end":{"line":18,"column":57}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"latestVersion") || (depth0 != null ? lookupProperty(depth0,"latestVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latestVersion","hash":{},"data":data,"loc":{"start":{"line":18,"column":59},"end":{"line":18,"column":76}}}) : helper)))
    + "</a>";
},"15":function(container,depth0,helpers,partials,data) {
    return "none";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"latest_editors_draft") : stack1), depth0))
    + "</dt>\r\n      <dd><a href='"
    + alias1(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":22,"column":19},"end":{"line":22,"column":33}}}) : helper)))
    + "'>"
    + alias1(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":22,"column":35},"end":{"line":22,"column":49}}}) : helper)))
    + "</a></dd>\r\n";
},"19":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>Test suite:</dt>\r\n      <dd><a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"testSuiteURI") || (depth0 != null ? lookupProperty(depth0,"testSuiteURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testSuiteURI","hash":{},"data":data,"loc":{"start":{"line":26,"column":19},"end":{"line":26,"column":35}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"testSuiteURI") || (depth0 != null ? lookupProperty(depth0,"testSuiteURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testSuiteURI","hash":{},"data":data,"loc":{"start":{"line":26,"column":37},"end":{"line":26,"column":53}}}) : helper)))
    + "</a></dd>\r\n";
},"21":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>Implementation report:</dt>\r\n      <dd><a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"implementationReportURI") || (depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"implementationReportURI","hash":{},"data":data,"loc":{"start":{"line":30,"column":19},"end":{"line":30,"column":46}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"implementationReportURI") || (depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"implementationReportURI","hash":{},"data":data,"loc":{"start":{"line":30,"column":48},"end":{"line":30,"column":75}}}) : helper)))
    + "</a></dd>\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"bug_tracker") : stack1), depth0))
    + "</dt>\r\n      <dd>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"bugTrackerHTML") || (depth0 != null ? lookupProperty(depth0,"bugTrackerHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bugTrackerHTML","hash":{},"data":data,"loc":{"start":{"line":34,"column":10},"end":{"line":34,"column":30}}}) : helper))) != null ? stack1 : "")
    + "</dd>\r\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"prevED") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":37,"column":6},"end":{"line":40,"column":13}}})) != null ? stack1 : "");
},"26":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <dt>Previous editor's draft:</dt>\r\n        <dd><a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevED") || (depth0 != null ? lookupProperty(depth0,"prevED") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevED","hash":{},"data":data,"loc":{"start":{"line":39,"column":21},"end":{"line":39,"column":31}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevED") || (depth0 != null ? lookupProperty(depth0,"prevED") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevED","hash":{},"data":data,"loc":{"start":{"line":39,"column":33},"end":{"line":39,"column":43}}}) : helper)))
    + "</a></dd>\r\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>Previous version:</dt>\r\n      <dd><a "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":13},"end":{"line":44,"column":56}}})) != null ? stack1 : "")
    + " href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevVersion") || (depth0 != null ? lookupProperty(depth0,"prevVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data,"loc":{"start":{"line":44,"column":63},"end":{"line":44,"column":78}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevVersion") || (depth0 != null ? lookupProperty(depth0,"prevVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data,"loc":{"start":{"line":44,"column":80},"end":{"line":44,"column":95}}}) : helper)))
    + "</a></dd>\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    return "rel=\"dcterms:replaces\"";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isRec") : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.program(34, data, 0),"data":data,"loc":{"start":{"line":47,"column":6},"end":{"line":53,"column":13}}})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <dt>Previous Recommendation:</dt>\r\n          <dd><a "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":17},"end":{"line":49,"column":60}}})) != null ? stack1 : "")
    + " href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevRecURI") || (depth0 != null ? lookupProperty(depth0,"prevRecURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data,"loc":{"start":{"line":49,"column":67},"end":{"line":49,"column":81}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevRecURI") || (depth0 != null ? lookupProperty(depth0,"prevRecURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data,"loc":{"start":{"line":49,"column":83},"end":{"line":49,"column":97}}}) : helper)))
    + "</a></dd>\r\n";
},"34":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <dt>Latest Recommendation:</dt>\r\n          <dd><a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevRecURI") || (depth0 != null ? lookupProperty(depth0,"prevRecURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data,"loc":{"start":{"line":52,"column":23},"end":{"line":52,"column":37}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"prevRecURI") || (depth0 != null ? lookupProperty(depth0,"prevRecURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data,"loc":{"start":{"line":52,"column":39},"end":{"line":52,"column":53}}}) : helper)))
    + "</a></dd>\r\n";
},"36":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"editors") : stack1), depth0));
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"editor") : stack1), depth0));
},"40":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <dt>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleAuthors") : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.program(43, data, 0),"data":data,"loc":{"start":{"line":58,"column":10},"end":{"line":58,"column":79}}})) != null ? stack1 : "")
    + "</dt>\r\n      "
    + container.escapeExpression((lookupProperty(helpers,"showPeople")||(depth0 && lookupProperty(depth0,"showPeople"))||container.hooks.helperMissing).call(alias1,"Author",(depth0 != null ? lookupProperty(depth0,"authors") : depth0),{"name":"showPeople","hash":{},"data":data,"loc":{"start":{"line":59,"column":6},"end":{"line":59,"column":37}}}))
    + "\r\n";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"authors") : stack1), depth0));
},"43":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"author") : stack1), depth0));
},"45":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"otherLinks") : depth0),{"name":"each","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":62,"column":6},"end":{"line":95,"column":15}}})) != null ? stack1 : "");
},"46":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"key") : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":63,"column":8},"end":{"line":94,"column":15}}})) != null ? stack1 : "");
},"47":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <dt "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":64,"column":14},"end":{"line":64,"column":51}}})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"key") || (depth0 != null ? lookupProperty(depth0,"key") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data,"loc":{"start":{"line":64,"column":52},"end":{"line":64,"column":59}}}) : helper)))
    + ":</dt>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"data") : depth0),{"name":"if","hash":{},"fn":container.program(50, data, 0),"inverse":container.program(60, data, 0),"data":data,"loc":{"start":{"line":65,"column":10},"end":{"line":93,"column":17}}})) != null ? stack1 : "");
},"48":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"class") || (depth0 != null ? lookupProperty(depth0,"class") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"class","hash":{},"data":data,"loc":{"start":{"line":64,"column":34},"end":{"line":64,"column":43}}}) : helper)))
    + "\"";
},"50":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"data") : depth0),{"name":"each","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":66,"column":13},"end":{"line":78,"column":22}}})) != null ? stack1 : "");
},"51":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"value") : depth0),{"name":"if","hash":{},"fn":container.program(52, data, 0),"inverse":container.program(57, data, 0),"data":data,"loc":{"start":{"line":67,"column":16},"end":{"line":77,"column":23}}})) != null ? stack1 : "");
},"52":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                  <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":68,"column":22},"end":{"line":68,"column":59}}})) != null ? stack1 : "")
    + ">\r\n                    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":69,"column":20},"end":{"line":69,"column":58}}})) != null ? stack1 : "")
    + "\r\n                      "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":70,"column":22},"end":{"line":70,"column":31}}}) : helper)))
    + "\r\n                    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":20},"end":{"line":71,"column":43}}})) != null ? stack1 : "")
    + "\r\n                  </dd>\r\n";
},"53":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"href","hash":{},"data":data,"loc":{"start":{"line":69,"column":41},"end":{"line":69,"column":49}}}) : helper)))
    + "\">";
},"55":function(container,depth0,helpers,partials,data) {
    return "</a>";
},"57":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":74,"column":18},"end":{"line":76,"column":25}}})) != null ? stack1 : "");
},"58":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <dd><a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":75,"column":33},"end":{"line":75,"column":41}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":75,"column":43},"end":{"line":75,"column":51}}}) : helper)))
    + "</a></dd>\r\n";
},"60":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"value") : depth0),{"name":"if","hash":{},"fn":container.program(61, data, 0),"inverse":container.program(63, data, 0),"data":data,"loc":{"start":{"line":80,"column":12},"end":{"line":92,"column":19}}})) != null ? stack1 : "");
},"61":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":81,"column":18},"end":{"line":81,"column":55}}})) != null ? stack1 : "")
    + ">\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":82,"column":16},"end":{"line":82,"column":54}}})) != null ? stack1 : "")
    + "\r\n                  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":83,"column":18},"end":{"line":83,"column":27}}}) : helper)))
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":84,"column":16},"end":{"line":84,"column":39}}})) != null ? stack1 : "")
    + "\r\n              </dd>\r\n";
},"63":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(64, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":87,"column":14},"end":{"line":91,"column":21}}})) != null ? stack1 : "");
},"64":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <dd "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"class") : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":88,"column":20},"end":{"line":88,"column":57}}})) != null ? stack1 : "")
    + ">\r\n                  <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":89,"column":27},"end":{"line":89,"column":35}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"href") || (depth0 != null ? lookupProperty(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":89,"column":37},"end":{"line":89,"column":45}}}) : helper)))
    + "</a>\r\n                </dd>\r\n";
},"66":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>\r\n      Please check the <a href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"errata") || (depth0 != null ? lookupProperty(depth0,"errata") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"errata","hash":{},"data":data,"loc":{"start":{"line":100,"column":32},"end":{"line":100,"column":42}}}) : helper)))
    + "\"><strong>errata</strong></a> for any errors or issues\r\n      reported since publication.\r\n    </p>\r\n";
},"68":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>\r\n      See also <a href=\"http://www.w3.org/2003/03/Translations/byTechnology?technology="
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"shortName") || (depth0 != null ? lookupProperty(depth0,"shortName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"shortName","hash":{},"data":data,"loc":{"start":{"line":106,"column":87},"end":{"line":106,"column":100}}}) : helper)))
    + "\">\r\n      <strong>translations</strong></a>.\r\n    </p>\r\n";
},"70":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleAlternates") : depth0),{"name":"if","hash":{},"fn":container.program(71, data, 0),"inverse":container.program(73, data, 0),"data":data,"loc":{"start":{"line":112,"column":6},"end":{"line":116,"column":13}}})) != null ? stack1 : "")
    + "      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"alternatesHTML") || (depth0 != null ? lookupProperty(depth0,"alternatesHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"alternatesHTML","hash":{},"data":data,"loc":{"start":{"line":117,"column":6},"end":{"line":117,"column":26}}}) : helper))) != null ? stack1 : "")
    + "\r\n    </p>\r\n";
},"71":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in these non-normative formats:\r\n";
},"73":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in this non-normative format:\r\n";
},"75":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0),{"name":"if","hash":{},"fn":container.program(76, data, 0),"inverse":container.program(78, data, 0),"data":data,"loc":{"start":{"line":121,"column":4},"end":{"line":133,"column":11}}})) != null ? stack1 : "");
},"76":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <p class='copyright'>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalCopyrightHolders") || (depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalCopyrightHolders","hash":{},"data":data,"loc":{"start":{"line":122,"column":27},"end":{"line":122,"column":59}}}) : helper))) != null ? stack1 : "")
    + "</p>\r\n";
},"78":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0),{"name":"if","hash":{},"fn":container.program(79, data, 0),"inverse":container.program(81, data, 0),"data":data,"loc":{"start":{"line":124,"column":6},"end":{"line":132,"column":13}}})) != null ? stack1 : "");
},"79":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"overrideCopyright") || (depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"overrideCopyright","hash":{},"data":data,"loc":{"start":{"line":125,"column":8},"end":{"line":125,"column":31}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"81":function(container,depth0,helpers,partials,data) {
    return "        <p class='copyright'>\r\n          This document is licensed under a\r\n          <a class='subfoot' href='https://creativecommons.org/licenses/by/3.0/' rel='license'>Creative Commons\r\n          Attribution 3.0 License</a>.\r\n        </p>\r\n";
},"83":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0),{"name":"if","hash":{},"fn":container.program(84, data, 0),"inverse":container.program(86, data, 0),"data":data,"loc":{"start":{"line":135,"column":4},"end":{"line":164,"column":11}}})) != null ? stack1 : "");
},"84":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"overrideCopyright") || (depth0 != null ? lookupProperty(depth0,"overrideCopyright") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"overrideCopyright","hash":{},"data":data,"loc":{"start":{"line":136,"column":6},"end":{"line":136,"column":29}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"86":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <p class='copyright'>\r\n        <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy;\r\n        "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"copyrightStart") : depth0),{"name":"if","hash":{},"fn":container.program(87, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":140,"column":8},"end":{"line":140,"column":56}}})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"publishYear") || (depth0 != null ? lookupProperty(depth0,"publishYear") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"publishYear","hash":{},"data":data,"loc":{"start":{"line":140,"column":56},"end":{"line":140,"column":71}}}) : helper)))
    + "\r\n        "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0),{"name":"if","hash":{},"fn":container.program(89, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":141,"column":8},"end":{"line":141,"column":88}}})) != null ? stack1 : "")
    + "\r\n        <a href='https://www.w3.org/'><abbr title='World Wide Web Consortium'>W3C</abbr></a><sup>&reg;</sup>\r\n        (<a href='https://www.csail.mit.edu/'><abbr title='Massachusetts Institute of Technology'>MIT</abbr></a>,\r\n        <a href='https://www.ercim.eu/'><abbr title='European Research Consortium for Informatics and Mathematics'>ERCIM</abbr></a>,\r\n        <a href='https://www.keio.ac.jp/'>Keio</a>, <a href=\"http://ev.buaa.edu.cn/\">Beihang</a>).\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isCCBY") : depth0),{"name":"if","hash":{},"fn":container.program(91, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":146,"column":8},"end":{"line":150,"column":15}}})) != null ? stack1 : "")
    + "        W3C <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer'>liability</a>,\r\n        <a href='https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks'>trademark</a> and\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isCCBY") : depth0),{"name":"if","hash":{},"fn":container.program(93, data, 0),"inverse":container.program(95, data, 0),"data":data,"loc":{"start":{"line":153,"column":8},"end":{"line":161,"column":15}}})) != null ? stack1 : "")
    + "        rules apply.\r\n      </p>\r\n";
},"87":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"copyrightStart") || (depth0 != null ? lookupProperty(depth0,"copyrightStart") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"copyrightStart","hash":{},"data":data,"loc":{"start":{"line":140,"column":30},"end":{"line":140,"column":48}}}) : helper)))
    + "-";
},"89":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalCopyrightHolders") || (depth0 != null ? lookupProperty(depth0,"additionalCopyrightHolders") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalCopyrightHolders","hash":{},"data":data,"loc":{"start":{"line":141,"column":43},"end":{"line":141,"column":75}}}) : helper))) != null ? stack1 : "")
    + " &amp;";
},"91":function(container,depth0,helpers,partials,data) {
    return "          Some Rights Reserved: this document is dual-licensed,\r\n          <a rel=\"license\" href=\"https://creativecommons.org/licenses/by/3.0/\">CC-BY</a> and\r\n          <a rel=\"license\" href=\"https://www.w3.org/Consortium/Legal/copyright-documents\">W3C Document License</a>.\r\n";
},"93":function(container,depth0,helpers,partials,data) {
    return "          <a rel=\"license\" href='https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html'>document use</a>\r\n";
},"95":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isW3CSoftAndDocLicense") : depth0),{"name":"if","hash":{},"fn":container.program(96, data, 0),"inverse":container.program(98, data, 0),"data":data,"loc":{"start":{"line":156,"column":10},"end":{"line":160,"column":17}}})) != null ? stack1 : "");
},"96":function(container,depth0,helpers,partials,data) {
    return "            <a rel=\"license\" href='https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document'>permissive document license</a>\r\n";
},"98":function(container,depth0,helpers,partials,data) {
    return "            <a rel=\"license\" href='https://www.w3.org/Consortium/Legal/copyright-documents'>document use</a>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class='head'>\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isUnofficial") : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":6,"column":13}}})) != null ? stack1 : "")
    + "  "
    + ((stack1 = (lookupProperty(helpers,"showLogos")||(depth0 && lookupProperty(depth0,"showLogos"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"logos") : depth0),{"name":"showLogos","hash":{},"data":data,"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":23}}})) != null ? stack1 : "")
    + "\r\n  <h1 class='title p-name' id='title'"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":37},"end":{"line":8,"column":83}}})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":8,"column":84},"end":{"line":8,"column":93}}}) : helper)))
    + "</h1>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subtitle") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":2},"end":{"line":11,"column":9}}})) != null ? stack1 : "")
    + "  <h2>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"prependW3C") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":6},"end":{"line":12,"column":35}}})) != null ? stack1 : "")
    + alias4(((helper = (helper = lookupProperty(helpers,"textStatus") || (depth0 != null ? lookupProperty(depth0,"textStatus") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"textStatus","hash":{},"data":data,"loc":{"start":{"line":12,"column":35},"end":{"line":12,"column":49}}}) : helper)))
    + " <time "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":56},"end":{"line":12,"column":102}}})) != null ? stack1 : "")
    + "class='dt-published' datetime='"
    + alias4(((helper = (helper = lookupProperty(helpers,"dashDate") || (depth0 != null ? lookupProperty(depth0,"dashDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dashDate","hash":{},"data":data,"loc":{"start":{"line":12,"column":133},"end":{"line":12,"column":145}}}) : helper)))
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"publishHumanDate") || (depth0 != null ? lookupProperty(depth0,"publishHumanDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"publishHumanDate","hash":{},"data":data,"loc":{"start":{"line":12,"column":147},"end":{"line":12,"column":167}}}) : helper)))
    + "</time></h2>\r\n  <dl>\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isNoTrack") : depth0),{"name":"unless","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":4},"end":{"line":19,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":4},"end":{"line":23,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"testSuiteURI") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":24,"column":4},"end":{"line":27,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":4},"end":{"line":31,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"bugTrackerHTML") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":4},"end":{"line":35,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isED") : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":4},"end":{"line":41,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"showPreviousVersion") : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":42,"column":4},"end":{"line":45,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"prevRecURI") : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":46,"column":4},"end":{"line":54,"column":11}}})) != null ? stack1 : "")
    + "    <dt>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleEditors") : depth0),{"name":"if","hash":{},"fn":container.program(36, data, 0),"inverse":container.program(38, data, 0),"data":data,"loc":{"start":{"line":55,"column":8},"end":{"line":55,"column":77}}})) != null ? stack1 : "")
    + "</dt>\r\n    "
    + alias4((lookupProperty(helpers,"showPeople")||(depth0 && lookupProperty(depth0,"showPeople"))||alias2).call(alias1,"Editor",(depth0 != null ? lookupProperty(depth0,"editors") : depth0),{"name":"showPeople","hash":{},"data":data,"loc":{"start":{"line":56,"column":4},"end":{"line":56,"column":35}}}))
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"authors") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":4},"end":{"line":60,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"otherLinks") : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":61,"column":4},"end":{"line":96,"column":11}}})) != null ? stack1 : "")
    + "  </dl>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"errata") : depth0),{"name":"if","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":98,"column":2},"end":{"line":103,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isRec") : depth0),{"name":"if","hash":{},"fn":container.program(68, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":104,"column":2},"end":{"line":109,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"alternateFormats") : depth0),{"name":"if","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":110,"column":2},"end":{"line":119,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isUnofficial") : depth0),{"name":"if","hash":{},"fn":container.program(75, data, 0),"inverse":container.program(83, data, 0),"data":data,"loc":{"start":{"line":120,"column":2},"end":{"line":165,"column":9}}})) != null ? stack1 : "")
    + "  <hr title=\"Separator for header\">\r\n</div>\r\n";
},"useData":true});
templates['permalinks.css'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "  section > *:hover > span.permalink { visibility: visible; }\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  float: right;\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "  visibility: hidden;\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "/* --- PERMALINKS --- */\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"permalinkHide") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":4,"column":7}}})) != null ? stack1 : "")
    + "\r\n.permalink {\r\n  width: 1px;\r\n  height: 1px;\r\n  overflow: visible;\r\n  font-size: 10pt;\r\n  font-style: normal;\r\n  vertical-align: middle;\r\n  margin-left: 4px;\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"permalinkEdge") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":2},"end":{"line":16,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"permalinkHide") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":2},"end":{"line":19,"column":9}}})) != null ? stack1 : "")
    + "}\r\n\r\n.permalink a, .permalink a:link, .permalink a:visited, .permalink a:hover, .permalink a:focus, .permalink a:active {\r\n  background:transparent !important;\r\n  text-decoration:none;\r\n  font-weight: bold;\r\n  color:#666 !important;\r\n}\r\n\r\n.permalink abbr {\r\n  border:0;\r\n}\r\n";
},"useData":true});
templates['sotd.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <details class=\"annoying-warning\" open=\"\">\r\n    <summary>This is a preview</summary>\r\n    <p>\r\n      Do not attempt to implement this version of the specification. Do not reference this\r\n      version as authoritative in any way.\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":6},"end":{"line":10,"column":13}}})) != null ? stack1 : "")
    + "    </p>\r\n  </details>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        Instead, see <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":9,"column":30},"end":{"line":9,"column":44}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"edDraftURI") || (depth0 != null ? lookupProperty(depth0,"edDraftURI") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"edDraftURI","hash":{},"data":data,"loc":{"start":{"line":9,"column":46},"end":{"line":9,"column":60}}}) : helper)))
    + "</a> for the Editor's draft.\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <p>\r\n    This document is draft of a potential specification. It has no official standing of\r\n    any kind and does not represent the support or consensus of any standards organisation.\r\n  </p>\r\n  "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":25}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isTagFinding") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data,"loc":{"start":{"line":21,"column":2},"end":{"line":192,"column":9}}})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":22,"column":4},"end":{"line":22,"column":27}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isNoTrack") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(13, data, 0),"data":data,"loc":{"start":{"line":24,"column":4},"end":{"line":191,"column":11}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <p>\r\n        This document is merely a W3C-internal "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isMO") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":47},"end":{"line":26,"column":85}}})) != null ? stack1 : "")
    + " document. It\r\n        has no official standing of any kind and does not represent consensus of the W3C\r\n        Membership.\r\n      </p>\r\n      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":30,"column":6},"end":{"line":30,"column":29}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "member-confidential";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <p>\r\n        <em>"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"status_at_publication") : stack1), depth0)) != null ? stack1 : "")
    + "</em>\r\n      </p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isSubmission") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.program(23, data, 0),"data":data,"loc":{"start":{"line":35,"column":6},"end":{"line":190,"column":13}}})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":36,"column":8},"end":{"line":36,"column":31}}}) : helper))) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isMemberSubmission") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(17, data, 0),"data":data,"loc":{"start":{"line":37,"column":8},"end":{"line":64,"column":15}}})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    return "          <p>\r\n            By publishing this document, W3C acknowledges that\r\n            the <a href=\"https://www.w3.org/Submission/@@@submissiondoc@@@\">Submitting Members</a>\r\n            have made a formal Submission request to W3C for discussion. Publication of this document\r\n            by W3C indicates no endorsement of its content by W3C, nor that W3C has, is, or will be\r\n            allocating any resources to the issues addressed by it. This document is not the product\r\n            of a chartered W3C group, but is published as potential input to\r\n            the <a href=\"https://www.w3.org/Consortium/Process\">W3C Process</a>.\r\n            A <a href=\"https://www.w3.org/Submission/@@@teamcomment@@@\">W3C Team Comment</a> has been\r\n            published in conjunction with this Member Submission. Publication of acknowledged Member Submissions\r\n            at the W3C site is one of the benefits of <a href=\"https://www.w3.org/Consortium/Prospectus/Joining\">\r\n            W3C Membership</a>. Please consult the requirements associated with Member Submissions of\r\n            <a href=\"https://www.w3.org/Consortium/Patent-Policy/#sec-submissions\">section 3.3 of the\r\n            W3C Patent Policy</a>. Please consult the complete <a href=\"https://www.w3.org/Submission\">list\r\n            of acknowledged W3C Member Submissions</a>.\r\n          </p>\r\n";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isTeamSubmission") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":55,"column":10},"end":{"line":63,"column":17}}})) != null ? stack1 : "");
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <p>If you wish to make comments regarding this document, please send them to\r\n            <a href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":57,"column":28},"end":{"line":57,"column":44}}}) : helper)))
    + "@w3.org"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":51},"end":{"line":57,"column":108}}})) != null ? stack1 : "")
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":57,"column":110},"end":{"line":57,"column":126}}}) : helper)))
    + "@w3.org</a>\r\n            (<a href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":58,"column":29},"end":{"line":58,"column":45}}}) : helper)))
    + "-request@w3.org?subject=subscribe'>subscribe</a>,\r\n            <a\r\n              href='https://lists.w3.org/Archives/Public/"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":60,"column":57},"end":{"line":60,"column":73}}}) : helper)))
    + "/'>archives</a>)"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":60,"column":89},"end":{"line":61,"column":93}}})) != null ? stack1 : "")
    + ".</p>\r\n            <p>Please consult the complete <a href=\"https://www.w3.org/TeamSubmission/\">list of Team Submissions</a>.</p>\r\n";
},"19":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "?subject="
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subjectPrefixEnc") || (depth0 != null ? lookupProperty(depth0,"subjectPrefixEnc") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subjectPrefixEnc","hash":{},"data":data,"loc":{"start":{"line":57,"column":81},"end":{"line":57,"column":101}}}) : helper)));
},"21":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\r\n              with <code>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"subjectPrefix") || (depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"subjectPrefix","hash":{},"data":data,"loc":{"start":{"line":61,"column":25},"end":{"line":61,"column":42}}}) : helper)))
    + "</code> at the start of your email's subject";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"sotdAfterWGinfo") : depth0),{"name":"unless","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":66,"column":8},"end":{"line":68,"column":19}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"overrideStatus") : depth0),{"name":"unless","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":69,"column":8},"end":{"line":112,"column":19}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":113,"column":8},"end":{"line":118,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"sotdAfterWGinfo") : depth0),{"name":"if","hash":{},"fn":container.program(41, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":119,"column":8},"end":{"line":121,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"notRec") : depth0),{"name":"if","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":122,"column":8},"end":{"line":129,"column":15}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isRec") : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":130,"column":8},"end":{"line":139,"column":15}}})) != null ? stack1 : "")
    + "        <p"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isNote") : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":140,"column":10},"end":{"line":140,"column":57}}})) != null ? stack1 : "")
    + ">\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isIGNote") : depth0),{"name":"unless","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":141,"column":10},"end":{"line":150,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"recNotExpected") : depth0),{"name":"if","hash":{},"fn":container.program(56, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":151,"column":10},"end":{"line":153,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isIGNote") : depth0),{"name":"unless","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":154,"column":10},"end":{"line":173,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isIGNote") : depth0),{"name":"if","hash":{},"fn":container.program(67, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":174,"column":10},"end":{"line":177,"column":17}}})) != null ? stack1 : "")
    + "        </p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isNewProcess") : depth0),{"name":"if","hash":{},"fn":container.program(69, data, 0),"inverse":container.program(71, data, 0),"data":data,"loc":{"start":{"line":179,"column":8},"end":{"line":188,"column":15}}})) != null ? stack1 : "")
    + "        "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"addPatentNote") : depth0),{"name":"if","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":189,"column":8},"end":{"line":189,"column":62}}})) != null ? stack1 : "")
    + "\r\n";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":67,"column":8},"end":{"line":67,"column":31}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <p>\r\n          This document was published by "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"wgHTML") || (depth0 != null ? lookupProperty(depth0,"wgHTML") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgHTML","hash":{},"data":data,"loc":{"start":{"line":71,"column":41},"end":{"line":71,"column":53}}}) : helper))) != null ? stack1 : "")
    + " as "
    + alias4(((helper = (helper = lookupProperty(helpers,"anOrA") || (depth0 != null ? lookupProperty(depth0,"anOrA") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"anOrA","hash":{},"data":data,"loc":{"start":{"line":71,"column":57},"end":{"line":71,"column":66}}}) : helper)))
    + " "
    + alias4(((helper = (helper = lookupProperty(helpers,"longStatus") || (depth0 != null ? lookupProperty(depth0,"longStatus") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"longStatus","hash":{},"data":data,"loc":{"start":{"line":71,"column":67},"end":{"line":71,"column":81}}}) : helper)))
    + ".\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"notYetRec") : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":72,"column":10},"end":{"line":74,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":75,"column":10},"end":{"line":82,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isCR") : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":83,"column":10},"end":{"line":88,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isPER") : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":89,"column":10},"end":{"line":98,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isPR") : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.program(37, data, 0),"data":data,"loc":{"start":{"line":99,"column":10},"end":{"line":110,"column":17}}})) != null ? stack1 : "")
    + "        </p>\r\n";
},"27":function(container,depth0,helpers,partials,data) {
    return "            This document is intended to become a W3C Recommendation.\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            Comments regarding this document are welcome. Please send them to\r\n            <a href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":77,"column":28},"end":{"line":77,"column":44}}}) : helper)))
    + "@w3.org"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":77,"column":51},"end":{"line":77,"column":108}}})) != null ? stack1 : "")
    + "'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":77,"column":110},"end":{"line":77,"column":126}}}) : helper)))
    + "@w3.org</a>\r\n            (<a href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":78,"column":29},"end":{"line":78,"column":45}}}) : helper)))
    + "-request@w3.org?subject=subscribe'>subscribe</a>,\r\n            <a\r\n              href='https://lists.w3.org/Archives/Public/"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":80,"column":57},"end":{"line":80,"column":73}}}) : helper)))
    + "/'>archives</a>)"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"subjectPrefix") : depth0),{"name":"if","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":80,"column":89},"end":{"line":81,"column":93}}})) != null ? stack1 : "")
    + ".\r\n";
},"31":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            W3C publishes a Candidate Recommendation to indicate that the document is believed to be\r\n            stable and to encourage implementation by the developer community. This Candidate\r\n            Recommendation is expected to advance to Proposed Recommendation no earlier than\r\n            "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"humanCREnd") || (depth0 != null ? lookupProperty(depth0,"humanCREnd") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"humanCREnd","hash":{},"data":data,"loc":{"start":{"line":87,"column":12},"end":{"line":87,"column":26}}}) : helper)))
    + ".\r\n";
},"33":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              W3C Advisory Committee Members are invited to\r\n              send formal review comments on this Proposed\r\n              Edited Recommendation to the W3C Team until\r\n              "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"humanPEREnd") || (depth0 != null ? lookupProperty(depth0,"humanPEREnd") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"humanPEREnd","hash":{},"data":data,"loc":{"start":{"line":93,"column":14},"end":{"line":93,"column":29}}}) : helper)))
    + ".\r\n              Members of the Advisory Committee will find the\r\n              appropriate review form for this document by\r\n              consulting their list of current\r\n              <a href='https://www.w3.org/2002/09/wbs/myQuestionnaires'>WBS questionnaires</a>.\r\n";
},"35":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              The W3C Membership and other interested parties are invited to review the document and\r\n              send comments to\r\n              <a rel='discussion' href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":102,"column":47},"end":{"line":102,"column":63}}}) : helper)))
    + "@w3.org'>"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":102,"column":72},"end":{"line":102,"column":88}}}) : helper)))
    + "@w3.org</a>\r\n              (<a href='mailto:"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":103,"column":31},"end":{"line":103,"column":47}}}) : helper)))
    + "-request@w3.org?subject=subscribe'>subscribe</a>,\r\n              <a href='https://lists.w3.org/Archives/Public/"
    + alias4(((helper = (helper = lookupProperty(helpers,"wgPublicList") || (depth0 != null ? lookupProperty(depth0,"wgPublicList") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"wgPublicList","hash":{},"data":data,"loc":{"start":{"line":104,"column":60},"end":{"line":104,"column":76}}}) : helper)))
    + "/'>archives</a>)\r\n              through "
    + alias4(((helper = (helper = lookupProperty(helpers,"humanPREnd") || (depth0 != null ? lookupProperty(depth0,"humanPREnd") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"humanPREnd","hash":{},"data":data,"loc":{"start":{"line":105,"column":22},"end":{"line":105,"column":36}}}) : helper)))
    + ". Advisory Committee Representatives should consult their\r\n              <a href='https://www.w3.org/2002/09/wbs/myQuestionnaires'>WBS questionnaires</a>.\r\n              Note that substantive technical comments were expected during the Candidate Recommendation\r\n              review period that ended "
    + alias4(((helper = (helper = lookupProperty(helpers,"humanCREnd") || (depth0 != null ? lookupProperty(depth0,"humanCREnd") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"humanCREnd","hash":{},"data":data,"loc":{"start":{"line":108,"column":39},"end":{"line":108,"column":53}}}) : helper)))
    + ".\r\n";
},"37":function(container,depth0,helpers,partials,data) {
    return "";
},"39":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <p>\r\n            Please see the Working Group's  <a href='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"implementationReportURI") || (depth0 != null ? lookupProperty(depth0,"implementationReportURI") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"implementationReportURI","hash":{},"data":data,"loc":{"start":{"line":115,"column":53},"end":{"line":115,"column":80}}}) : helper)))
    + "'>implementation\r\n            report</a>.\r\n          </p>\r\n";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalContent") || (depth0 != null ? lookupProperty(depth0,"additionalContent") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additionalContent","hash":{},"data":data,"loc":{"start":{"line":120,"column":10},"end":{"line":120,"column":33}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"43":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <p>\r\n            Publication as "
    + alias4(((helper = (helper = lookupProperty(helpers,"anOrA") || (depth0 != null ? lookupProperty(depth0,"anOrA") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"anOrA","hash":{},"data":data,"loc":{"start":{"line":124,"column":27},"end":{"line":124,"column":36}}}) : helper)))
    + " "
    + alias4(((helper = (helper = lookupProperty(helpers,"textStatus") || (depth0 != null ? lookupProperty(depth0,"textStatus") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"textStatus","hash":{},"data":data,"loc":{"start":{"line":124,"column":37},"end":{"line":124,"column":51}}}) : helper)))
    + " does not imply endorsement by the W3C\r\n            Membership. This is a draft document and may be updated, replaced or obsoleted by other\r\n            documents at any time. It is inappropriate to cite this document as other than work in\r\n            progress.\r\n          </p>\r\n";
},"45":function(container,depth0,helpers,partials,data) {
    return "          <p>\r\n            This document has been reviewed by W3C Members, by software developers, and by other W3C\r\n            groups and interested parties, and is endorsed by the Director as a W3C Recommendation.\r\n            It is a stable document and may be used as reference material or cited from another\r\n            document. W3C's role in making the Recommendation is to draw attention to the\r\n            specification and to promote its widespread deployment. This enhances the functionality\r\n            and interoperability of the Web.\r\n          </p>\r\n";
},"47":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-deliverer=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"wgId") || (depth0 != null ? lookupProperty(depth0,"wgId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"wgId","hash":{},"data":data,"loc":{"start":{"line":140,"column":41},"end":{"line":140,"column":49}}}) : helper)))
    + "\"";
},"49":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            This document was produced by\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleWGs") : depth0),{"name":"if","hash":{},"fn":container.program(50, data, 0),"inverse":container.program(52, data, 0),"data":data,"loc":{"start":{"line":143,"column":12},"end":{"line":147,"column":19}}})) != null ? stack1 : "")
    + " operating under the\r\n            <a"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"doRDFa") : depth0),{"name":"if","hash":{},"fn":container.program(54, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":148,"column":14},"end":{"line":148,"column":79}}})) != null ? stack1 : "")
    + "\r\n            href='https://www.w3.org/Consortium/Patent-Policy/'>W3C Patent Policy</a>.\r\n";
},"50":function(container,depth0,helpers,partials,data) {
    return "            groups\r\n";
},"52":function(container,depth0,helpers,partials,data) {
    return "            a group\r\n            ";
},"54":function(container,depth0,helpers,partials,data) {
    return " id=\"sotd_patent\" property='w3p:patentRules'";
},"56":function(container,depth0,helpers,partials,data) {
    return "            The group does not expect this document to become a W3C Recommendation.\r\n";
},"58":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleWGs") : depth0),{"name":"if","hash":{},"fn":container.program(59, data, 0),"inverse":container.program(61, data, 0),"data":data,"loc":{"start":{"line":155,"column":12},"end":{"line":160,"column":19}}})) != null ? stack1 : "")
    + "            made in connection with the deliverables of\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"multipleWGs") : depth0),{"name":"if","hash":{},"fn":container.program(63, data, 0),"inverse":container.program(65, data, 0),"data":data,"loc":{"start":{"line":162,"column":12},"end":{"line":166,"column":19}}})) != null ? stack1 : "")
    + "            instructions for disclosing a patent. An individual who has actual knowledge of a patent\r\n            which the individual believes contains\r\n            <a href='https://www.w3.org/Consortium/Patent-Policy/#def-essential'>Essential\r\n            Claim(s)</a> must disclose the information in accordance with\r\n            <a href='https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure'>section\r\n            6 of the W3C Patent Policy</a>.\r\n";
},"59":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              W3C maintains "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"wgPatentHTML") || (depth0 != null ? lookupProperty(depth0,"wgPatentHTML") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"wgPatentHTML","hash":{},"data":data,"loc":{"start":{"line":156,"column":28},"end":{"line":156,"column":46}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"61":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              W3C maintains a <a href='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"wgPatentURI") || (depth0 != null ? lookupProperty(depth0,"wgPatentURI") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"wgPatentURI","hash":{},"data":data,"loc":{"start":{"line":158,"column":39},"end":{"line":158,"column":54}}}) : helper)))
    + "' rel='disclosure'>public list of any patent\r\n              disclosures</a>\r\n";
},"63":function(container,depth0,helpers,partials,data) {
    return "            each group; these pages also include\r\n";
},"65":function(container,depth0,helpers,partials,data) {
    return "            the group; that page also includes\r\n";
},"67":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            The disclosure obligations of the Participants of this group are described in the\r\n            <a href='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"charterDisclosureURI") || (depth0 != null ? lookupProperty(depth0,"charterDisclosureURI") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"charterDisclosureURI","hash":{},"data":data,"loc":{"start":{"line":176,"column":21},"end":{"line":176,"column":45}}}) : helper)))
    + "'>charter</a>.\r\n";
},"69":function(container,depth0,helpers,partials,data) {
    return "          <p>This document is governed by the <a id=\"w3c_process_revision\"\r\n            href=\"https://www.w3.org/2017/Process-20170301/\">1 March 2017 W3C Process Document</a>.\r\n          </p>\r\n";
},"71":function(container,depth0,helpers,partials,data) {
    return "          <p>\r\n            This document is governed by the  <a id=\"w3c_process_revision\"\r\n            href=\"https://www.w3.org/2005/10/Process-20051014/\">14 October 2005 W3C Process Document</a>.\r\n          </p>\r\n";
},"73":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"addPatentNote") || (depth0 != null ? lookupProperty(depth0,"addPatentNote") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"addPatentNote","hash":{},"data":data,"loc":{"start":{"line":189,"column":32},"end":{"line":189,"column":51}}}) : helper))) != null ? stack1 : "")
    + "</p>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h2>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"l10n") : depth0)) != null ? lookupProperty(stack1,"sotd") : stack1), depth0))
    + "</h2>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isPreview") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":13,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isUnofficial") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":14,"column":0},"end":{"line":193,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"additionalSections") || (depth0 != null ? lookupProperty(depth0,"additionalSections") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"additionalSections","hash":{},"data":data,"loc":{"start":{"line":194,"column":0},"end":{"line":194,"column":24}}}) : helper))) != null ? stack1 : "")
    + "\r\n";
},"useData":true});
})();
