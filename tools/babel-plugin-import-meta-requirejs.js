"use strict";

const { ast } = require("@babel/template").default;
const { default: inherits } = require("@babel/plugin-syntax-import-meta");

module.exports = () => ({
  inherits,
  visitor: {
    Program(path) {
      const metas = [];
      const identifiers = new Set();

      path.traverse({
        MetaProperty(path) {
          const {
            node: { meta, property },
            scope,
          } = path;

          if (meta && meta.name === "import" && property.name === "meta") {
            metas.push(path);
          }

          for (const name of Object.keys(scope.getAllBindings())) {
            identifiers.add(name);
          }
        },
      });

      if (!metas.length) {
        return;
      }

      const metaId = getUid("importMeta");
      const module = getUid("module");

      path.node.body.unshift(
        ast`import * as ${module} from 'module';`,
        ast`const ${metaId} = { url: new URL(${module}.uri, document.baseURI).href };`
      );

      for (const meta of metas) {
        meta.replaceWith(ast`${metaId}`);
      }

      function getUid(id) {
        while (identifiers.has(id)) {
          id = path.scope.generateUidIdentifier(id).name;
        }
        return id;
      }
    },
  },
});
