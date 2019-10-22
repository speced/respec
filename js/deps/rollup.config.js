// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const template = {
  output: {
    dir: __dirname + '/builds/',
    format: 'esm',
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};

export default [
  {
    input: "js/deps/jquery.js",
    ...template
  },
  {
    input: "js/deps/marked.js",
    ...template
  },
  {
    input: "js/deps/nanohtml.js",
    onwarn(warning, warn) {
      if (warning.code !== "CIRCULAR_DEPENDENCY") {
        warn(warning);
      }
    },
    ...template
  },
  {
    input: "js/deps/pluralize.js",
    ...template
  }
]
