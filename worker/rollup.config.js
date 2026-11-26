import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "worker/respec-highlight.js",
    output: {
      dir: "builds/",
      format: "iife",
      name: "hljs",
    },
    plugins: [resolve(), commonjs(), terser()],
  },
  {
    input: "worker/respec-worker.js",
    output: {
      dir: "builds/",
    },
  },
  {
    input: "js/deps/pele.js",
    output: {
      file: "builds/respec-pele.js",
      format: "iife",
      name: "pele",
    },
    plugins: [resolve(), terser()],
  },
];
