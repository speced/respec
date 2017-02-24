define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['headers.html'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "        "
    + container.escapeExpression((helpers.showLogos || (depth0 && depth0.showLogos) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.logos : depth0),{"name":"showLogos","hash":{},"data":data}))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.prependW3C : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "            <a class='logo' href='https://www.w3.org/'><img width='72' height='48' src='https://www.w3.org/StyleSheets/TR/2016/logos/W3C' alt='W3C'></a>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isMemberSubmission : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isTeamSubmission : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "            <a href=\"https://www.w3.org/Submission/\"> <img height=\"48\" width=\"211\" alt=\"W3C Member Submission\" src=\"https://www.w3.org/Icons/member_subm\" /></a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "            <a href=\"https://www.w3.org/TeamSubmission/\"><img height=\"48\" width=\"211\" alt=\"W3C Team Submission\" src=\"https://www.w3.org/Icons/team_subm\"/></a>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return " property='dcterms:title'";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "    <h2 "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.doRDFa : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "id='subtitle'>"
    + container.escapeExpression(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "</h2>\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "property='bibo:subtitle' ";
},"14":function(container,depth0,helpers,partials,data) {
    return "Geonovum ";
},"16":function(container,depth0,helpers,partials,data) {
    return "property=\"dcterms:issued\"";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing, alias5="function";

  return "      <dt>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.this_version : stack1), depth0))
    + "</dt>\n      <dd><a class='u-url' href='"
    + alias2(((helper = (helper = helpers.thisVersion || (depth0 != null ? depth0.thisVersion : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"thisVersion","hash":{},"data":data}) : helper)))
    + "'>"
    + alias2(((helper = (helper = helpers.thisVersion || (depth0 != null ? depth0.thisVersion : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"thisVersion","hash":{},"data":data}) : helper)))
    + "</a></dd>\n      <dt>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.latest_published_version : stack1), depth0))
    + "</dt>\n      <dd>"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.latestVersion : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.program(21, data, 0),"data":data})) != null ? stack1 : "")
    + "</dd>\n";
},"19":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<a href='"
    + alias4(((helper = (helper = helpers.latestVersion || (depth0 != null ? depth0.latestVersion : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latestVersion","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.latestVersion || (depth0 != null ? depth0.latestVersion : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latestVersion","hash":{},"data":data}) : helper)))
    + "</a>";
},"21":function(container,depth0,helpers,partials,data) {
    return "none";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing, alias4="function";

  return "      <dt>"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.latest_editors_draft : stack1), depth0))
    + "</dt>\n      <dd><a href='"
    + alias1(((helper = (helper = helpers.edDraftURI || (depth0 != null ? depth0.edDraftURI : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"edDraftURI","hash":{},"data":data}) : helper)))
    + "'>"
    + alias1(((helper = (helper = helpers.edDraftURI || (depth0 != null ? depth0.edDraftURI : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"edDraftURI","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"25":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "      <dt>Test suite:</dt>\n      <dd><a href='"
    + alias4(((helper = (helper = helpers.testSuiteURI || (depth0 != null ? depth0.testSuiteURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testSuiteURI","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.testSuiteURI || (depth0 != null ? depth0.testSuiteURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testSuiteURI","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"27":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "      <dt>Implementation report:</dt>\n      <dd><a href='"
    + alias4(((helper = (helper = helpers.implementationReportURI || (depth0 != null ? depth0.implementationReportURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"implementationReportURI","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.implementationReportURI || (depth0 != null ? depth0.implementationReportURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"implementationReportURI","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <dt>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.bug_tracker : stack1), depth0))
    + "</dt>\n      <dd>"
    + ((stack1 = ((helper = (helper = helpers.bugTrackerHTML || (depth0 != null ? depth0.bugTrackerHTML : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"bugTrackerHTML","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</dd>\n";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.prevED : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"32":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <dt>Previous editor's draft:</dt>\n        <dd><a href='"
    + alias4(((helper = (helper = helpers.prevED || (depth0 != null ? depth0.prevED : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevED","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.prevED || (depth0 != null ? depth0.prevED : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevED","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "      <dt>Previous version:</dt>\n      <dd><a "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.doRDFa : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " href='"
    + alias4(((helper = (helper = helpers.prevVersion || (depth0 != null ? depth0.prevVersion : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.prevVersion || (depth0 != null ? depth0.prevVersion : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevVersion","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"35":function(container,depth0,helpers,partials,data) {
    return "rel=\"dcterms:replaces\"";
},"37":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isRec : depth0),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.program(40, data, 0),"data":data})) != null ? stack1 : "");
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "          <dt>Previous Recommendation:</dt>\n          <dd><a "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.doRDFa : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " href='"
    + alias4(((helper = (helper = helpers.prevRecURI || (depth0 != null ? depth0.prevRecURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.prevRecURI || (depth0 != null ? depth0.prevRecURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"40":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "          <dt>Latest Recommendation:</dt>\n          <dd><a href='"
    + alias4(((helper = (helper = helpers.prevRecURI || (depth0 != null ? depth0.prevRecURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.prevRecURI || (depth0 != null ? depth0.prevRecURI : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"prevRecURI","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"42":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.editors : stack1), depth0));
},"44":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.editor : stack1), depth0));
},"46":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "      <dt>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.multipleAuthors : depth0),{"name":"if","hash":{},"fn":container.program(47, data, 0),"inverse":container.program(49, data, 0),"data":data})) != null ? stack1 : "")
    + "</dt>\n      "
    + container.escapeExpression((helpers.showPeople || (depth0 && depth0.showPeople) || helpers.helperMissing).call(alias1,"Author",(depth0 != null ? depth0.authors : depth0),{"name":"showPeople","hash":{},"data":data}))
    + "\n";
},"47":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.authors : stack1), depth0));
},"49":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.l10n : depth0)) != null ? stack1.author : stack1), depth0));
},"51":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.otherLinks : depth0),{"name":"each","hash":{},"fn":container.program(52, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"52":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.key : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"53":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "          <dt "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["class"] : depth0),{"name":"if","hash":{},"fn":container.program(54, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + ":</dt>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.data : depth0),{"name":"if","hash":{},"fn":container.program(56, data, 0),"inverse":container.program(66, data, 0),"data":data})) != null ? stack1 : "");
},"54":function(container,depth0,helpers,partials,data) {
    var helper;

  return "class=\""
    + container.escapeExpression(((helper = (helper = helpers["class"] || (depth0 != null ? depth0["class"] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"class","hash":{},"data":data}) : helper)))
    + "\"";
},"56":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":container.program(57, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"57":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(58, data, 0),"inverse":container.program(63, data, 0),"data":data})) != null ? stack1 : "");
},"58":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "                  <dd "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["class"] : depth0),{"name":"if","hash":{},"fn":container.program(54, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                      "
    + container.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\n                    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(61, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                  </dd>\n";
},"59":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<a href=\""
    + container.escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"href","hash":{},"data":data}) : helper)))
    + "\">";
},"61":function(container,depth0,helpers,partials,data) {
    return "</a>";
},"63":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(64, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"64":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <dd><a href=\""
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "</a></dd>\n";
},"66":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),{"name":"if","hash":{},"fn":container.program(67, data, 0),"inverse":container.program(69, data, 0),"data":data})) != null ? stack1 : "");
},"67":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "              <dd "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["class"] : depth0),{"name":"if","hash":{},"fn":container.program(54, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                  "
    + container.escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\n                "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(61, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n              </dd>\n";
},"69":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.href : depth0),{"name":"if","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"70":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <dd "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["class"] : depth0),{"name":"if","hash":{},"fn":container.program(54, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                  <a href=\""
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "</a>\n                </dd>\n";
},"72":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <p>\n      Please check the <a href=\""
    + container.escapeExpression(((helper = (helper = helpers.errata || (depth0 != null ? depth0.errata : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"errata","hash":{},"data":data}) : helper)))
    + "\"><strong>errata</strong></a> for any errors or issues\n      reported since publication.\n    </p>\n";
},"74":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "    <p>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.multipleAlternates : depth0),{"name":"if","hash":{},"fn":container.program(75, data, 0),"inverse":container.program(77, data, 0),"data":data})) != null ? stack1 : "")
    + "      "
    + ((stack1 = ((helper = (helper = helpers.alternatesHTML || (depth0 != null ? depth0.alternatesHTML : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"alternatesHTML","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </p>\n";
},"75":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in these non-normative formats:\n";
},"77":function(container,depth0,helpers,partials,data) {
    return "        This document is also available in this non-normative format:\n";
},"79":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.additionalCopyrightHolders : depth0),{"name":"if","hash":{},"fn":container.program(80, data, 0),"inverse":container.program(82, data, 0),"data":data})) != null ? stack1 : "");
},"80":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <p class='copyright'>"
    + ((stack1 = ((helper = (helper = helpers.additionalCopyrightHolders || (depth0 != null ? depth0.additionalCopyrightHolders : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"additionalCopyrightHolders","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>\n";
},"82":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.overrideCopyright : depth0),{"name":"if","hash":{},"fn":container.program(83, data, 0),"inverse":container.program(85, data, 0),"data":data})) != null ? stack1 : "");
},"83":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        "
    + ((stack1 = ((helper = (helper = helpers.overrideCopyright || (depth0 != null ? depth0.overrideCopyright : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"overrideCopyright","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"85":function(container,depth0,helpers,partials,data) {
    return "        <p class='copyright'>\n          This document is licensed under a\n          <a class='subfoot' href='https://creativecommons.org/licenses/by/3.0/' rel='license'>Creative Commons\n          Attribution 3.0 License</a>.\n        </p>\n";
},"87":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.overrideCopyright : depth0),{"name":"if","hash":{},"fn":container.program(88, data, 0),"inverse":container.program(90, data, 0),"data":data})) != null ? stack1 : "");
},"88":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "      "
    + ((stack1 = ((helper = (helper = helpers.overrideCopyright || (depth0 != null ? depth0.overrideCopyright : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"overrideCopyright","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"90":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "      <p class='copyright'>\n        <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Copyright'>Copyright</a> &copy;\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.copyrightStart : depth0),{"name":"if","hash":{},"fn":container.program(91, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = helpers.publishYear || (depth0 != null ? depth0.publishYear : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"publishYear","hash":{},"data":data}) : helper)))
    + "\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.additionalCopyrightHolders : depth0),{"name":"if","hash":{},"fn":container.program(93, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <a href='https://www.w3.org/'><abbr title='World Wide Web Consortium'>W3C</abbr></a><sup>&reg;</sup>\n        (<a href='https://www.csail.mit.edu/'><abbr title='Massachusetts Institute of Technology'>MIT</abbr></a>,\n        <a href='https://www.ercim.eu/'><abbr title='European Research Consortium for Informatics and Mathematics'>ERCIM</abbr></a>,\n        <a href='https://www.keio.ac.jp/'>Keio</a>, <a href=\"http://ev.buaa.edu.cn/\">Beihang</a>).\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isCCBY : depth0),{"name":"if","hash":{},"fn":container.program(95, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        W3C <a href='https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer'>liability</a>,\n        <a href='https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks'>trademark</a> and\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isCCBY : depth0),{"name":"if","hash":{},"fn":container.program(97, data, 0),"inverse":container.program(99, data, 0),"data":data})) != null ? stack1 : "")
    + "        rules apply.\n      </p>\n";
},"91":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.copyrightStart || (depth0 != null ? depth0.copyrightStart : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"copyrightStart","hash":{},"data":data}) : helper)))
    + "-";
},"93":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return " "
    + ((stack1 = ((helper = (helper = helpers.additionalCopyrightHolders || (depth0 != null ? depth0.additionalCopyrightHolders : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"additionalCopyrightHolders","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " &amp;";
},"95":function(container,depth0,helpers,partials,data) {
    return "          Some Rights Reserved: this document is dual-licensed,\n          <a rel=\"license\" href=\"https://creativecommons.org/licenses/by/3.0/\">CC-BY</a> and\n          <a rel=\"license\" href=\"https://www.w3.org/Consortium/Legal/copyright-documents\">W3C Document License</a>.\n";
},"97":function(container,depth0,helpers,partials,data) {
    return "          <a rel=\"license\" href='https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html'>document use</a>\n";
},"99":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isW3CSoftAndDocLicense : depth0),{"name":"if","hash":{},"fn":container.program(100, data, 0),"inverse":container.program(102, data, 0),"data":data})) != null ? stack1 : "");
},"100":function(container,depth0,helpers,partials,data) {
    return "            <a rel=\"license\" href='https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document'>permissive document license</a>\n";
},"102":function(container,depth0,helpers,partials,data) {
    return "            <a rel=\"license\" href='https://www.w3.org/Consortium/Legal/copyright-documents'>document use</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class='head'>\n  <p>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.logos : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </p>\n  <h1 class='title p-name' id='title'"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.doRDFa : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  <h2>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.prependW3C : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.textStatus || (depth0 != null ? depth0.textStatus : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"textStatus","hash":{},"data":data}) : helper)))
    + " <time "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.doRDFa : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "class='dt-published' datetime='"
    + alias4(((helper = (helper = helpers.dashDate || (depth0 != null ? depth0.dashDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dashDate","hash":{},"data":data}) : helper)))
    + "'>"
    + alias4(((helper = (helper = helpers.publishHumanDate || (depth0 != null ? depth0.publishHumanDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"publishHumanDate","hash":{},"data":data}) : helper)))
    + "</time></h2>\n  <dl>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.isNoTrack : depth0),{"name":"unless","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.edDraftURI : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.testSuiteURI : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.implementationReportURI : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.bugTrackerHTML : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isED : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showPreviousVersion : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.prevRecURI : depth0),{"name":"if","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <dt>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.multipleEditors : depth0),{"name":"if","hash":{},"fn":container.program(42, data, 0),"inverse":container.program(44, data, 0),"data":data})) != null ? stack1 : "")
    + "</dt>\n    "
    + alias4((helpers.showPeople || (depth0 && depth0.showPeople) || alias2).call(alias1,"Editor",(depth0 != null ? depth0.editors : depth0),{"name":"showPeople","hash":{},"data":data}))
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.authors : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.otherLinks : depth0),{"name":"if","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </dl>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.errata : depth0),{"name":"if","hash":{},"fn":container.program(72, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.alternateFormats : depth0),{"name":"if","hash":{},"fn":container.program(74, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isUnofficial : depth0),{"name":"if","hash":{},"fn":container.program(79, data, 0),"inverse":container.program(87, data, 0),"data":data})) != null ? stack1 : "")
    + "  <hr title=\"Separator for header\">\n</div>\n";
},"useData":true});
});