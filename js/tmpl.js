/*global Handlebars*/

define([
    "deps/text",
], function (text) {
    var buildMap = {};
    return {
        load:   function (name, req, onLoad, config) {
            return text.load(name, req, function (content) {
                if (config.isBuild && config.inlineText) buildMap[name] = content;
                onLoad(content);
            }, config);
        } 
    };
});
