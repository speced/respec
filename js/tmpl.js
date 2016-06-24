/*global Handlebars*/

define([
    "deps/handlebars",
    "deps/text",
], function (hb, text) {
    var buildMap = {};
    return {
        load:   function (name, req, onLoad, config) {
            return text.load(name, req, function (content) {
                if (config.isBuild && config.inlineText) buildMap[name] = content;
                onLoad(config.isBuild ? content : hb.compile(content));
            }, config);
        }
    ,   write:  function (pluginName, moduleName, write) {
            if (moduleName in buildMap) {
                var content = text.jsEscape(buildMap[moduleName]);
                write("define('" + pluginName + "!" + moduleName  +
                      "', ['deps/handlebars'], function (hb) { return hb.compile('" + content + "');});\n");
            }
        }
    };
});
