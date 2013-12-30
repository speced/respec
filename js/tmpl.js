/*global Handlebars*/

define(["handlebars", "text"], function (hb, text) {
    var buildMap = {};
    return {
        load:   function (name, req, onLoad, config) {
            return text.load(name, req, function (content) {
                if (config.isBuild && config.inlineText) {
                    var hbn=require.nodeRequire('handlebars');
                    buildMap[name] = hbn.precompile(content);
                }
                onLoad(config.isBuild ? content : Handlebars.compile(content));
            }, config);
        }
    ,   write:  function (pluginName, moduleName, write) {
            if (moduleName in buildMap) {
                var content = buildMap[moduleName];
                write("define('" + pluginName + "!" + moduleName  +
                      "', ['handlebars'], function (hb) { return Handlebars.template(" + content + ");});\n");
            }
        }
    };
});
