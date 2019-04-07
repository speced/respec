"use strict";

// Trim '.js' extension from import/export declarations
// beacuse RequireJS does not allow '.js' extension for relative paths

module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const { value: importPath } = path.node.source;
        if (importPath.endsWith(".js")) {
          path.node.source.value = importPath.slice(0, -3);
        }
      },
      ExportDeclaration(path) {
        if (!path.node.source) {
          return;
        }
        const { value: importPath } = path.node.source;
        if (importPath.endsWith(".js")) {
          path.node.source.value = importPath.slice(0, -3);
        }
      },
    },
  };
};
