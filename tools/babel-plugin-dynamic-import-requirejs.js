"use strict";

// Supports dynamic import for RequireJS

const { expression, default: template } = require("@babel/template");
const { default: inherits } = require("@babel/plugin-syntax-dynamic-import");
const { wrapInterop } = require("@babel/helper-module-transforms");

module.exports = function() {
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
