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
    input: "worker/respec-mermaid.js",
    output: {
      file: "builds/respec-mermaid.js",
      format: "iife",
      name: "_respecMermaidBundle",
      inlineDynamicImports: true,
    },
    plugins: [resolve(), commonjs(), terser()],
  },
];
