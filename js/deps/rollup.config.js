// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
    input: "js/deps/pluralize.js",
    ...template
  }
]
