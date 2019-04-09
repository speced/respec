"use strict";

// Trim '.js' extension from import/export declarations
// beacuse RequireJS does not allow '.js' extension for relative paths

/**
 * @param {string} path
 */
function isRelative(path) {
  return path.startsWith(".") && path.endsWith(".js");
}

function normalizeSource(source) {
  if (source && isRelative(source.value)) {
    source.value = source.value.slice(0, -3);
  }
}

module.exports = () => ({
  visitor: {
    ImportDeclaration(path) {
      normalizeSource(path.node.source);
    },
    ExportDeclaration(path) {
      normalizeSource(path.node.source);
    },
  },
});
