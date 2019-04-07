"use strict";

const { expression, default: template } = require("@babel/template");
const { default: inherits } = require("@babel/plugin-syntax-dynamic-import");
const { wrapInterop } = require("@babel/helper-module-transforms");

exports.__esModule = true;

exports.default = function() {
  return {
    inherits,
    visitor: {
      CallExpression(path) {
        if (path.node.callee.type !== "Import") {
          return;
        }
        const wrapped = wrapInterop(path, expression.ast`m`, "default");
        const newImport = template.ast`
          (new Promise(resolve => require([${
            path.node.arguments[0]
          }], m => resolve(${wrapped}))))
        `;
        path.replaceWith(newImport);
      },
    },
  };
};

module.exports = exports.default;
