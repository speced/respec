/*global Handlebars*/

define(["text"], function (text) {
    var buildMap = {};
    return {
        load:   function (name, req, onLoad, config) {
            return text.load(name, req, function (content) {
                if (config.isBuild && config.inlineText) buildMap[name] = content;
                onLoad(Handlebars.compile(content));
            }, config);
        }
    ,   write:  function (pluginName, moduleName, write) {
            if (moduleName in buildMap) {
                var content = text.jsEscape(buildMap[moduleName]);
                write("define('" + pluginName + "!" + moduleName  +
                      "', function () { return Handlebars.compile('" + content + "');});\n");
            }
        }
    };
});
