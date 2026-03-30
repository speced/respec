// @ts-check
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import jasminePlugin from "eslint-plugin-jasmine";
import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["builds/**", "js/**"],
  },
  js.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...globals.worker,
        respecConfig: "writable",
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "import/extensions": ["error", "always", { ignorePackages: true }],
      "dot-notation": "error",
      "eol-last": ["error", "always"],
      indent: 0,
      "no-console": 0,
      "no-duplicate-imports": 2,
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-prototype-builtins": 0,
      "no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
        },
      ],
      "no-var": 2,
      "object-shorthand": 2,
      "one-var": ["error", "never"],
      "prefer-arrow-callback": 2,
      "prefer-const": 2,
      "prefer-template": 2,
      quotes: 0,
      "require-atomic-updates": 0,
      semi: ["error", "always"],
      "sort-imports": 2,
      "spaced-comment": ["error", "always", { block: { balanced: true } }],
    },
  },
  // CommonJS files (tools, karma configs)
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  // Test files (headless.cjs and test-build.cjs also use jasmine)
  {
    files: ["tests/**/*.js", "tests/**/*.cjs"],
    plugins: { jasmine: jasminePlugin },
    languageOptions: {
      globals: {
        ...globals.jasmine,
      },
    },
    rules: {
      "no-console": 2,
      "no-sparse-arrays": 0,
      ...jasminePlugin.configs.recommended.rules,
      "jasmine/new-line-before-expect": 0,
      "jasmine/new-line-between-declarations": 0,
      "jasmine/no-spec-dupes": ["error", "branch"],
      "jasmine/prefer-jasmine-matcher": 2,
    },
  },
];
