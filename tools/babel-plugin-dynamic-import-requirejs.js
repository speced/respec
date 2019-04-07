"use strict";

const { expression, ast } = require("@babel/template").default;
const { default: inherits } = require("@babel/plugin-syntax-dynamic-import");
const { wrapInterop } = require("@babel/helper-module-transforms");

const buildImport = expression`require([SOURCE], resolve)`;

exports.__esModule = true;

exports.default = function() {
  return {
    inherits,
    visitor: {
      CallExpression(path) {
        if (path.node.callee.type === "Import") {
          const newImport = wrapInterop(
            path,
            buildImport({
              SOURCE: path.node.arguments[0],
            }),
            "default"
          );
          path.replaceWith(ast`(new Promise(resolve => ${newImport}))`);
        }
      },
    },
  };
};

module.exports = exports.default;
