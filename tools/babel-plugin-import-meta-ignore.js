"use strict";

const { ast } = require("@babel/template").default;
const { default: inherits } = require("@babel/plugin-syntax-import-meta");

module.exports = () => ({
  inherits,
  visitor: {
    Program(path) {
      const metas = [];

      path.traverse({
        MetaProperty(path) {
          const {
            node: { meta, property },
          } = path;

          if (meta && meta.name === "import" && property.name === "meta") {
            metas.push(path);
          }
        },
      });

      if (!metas.length) {
        return;
      }

      for (const meta of metas) {
        meta.replaceWith(ast`({})`);
      }
    },
  },
});
