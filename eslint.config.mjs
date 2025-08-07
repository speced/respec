import { defineConfig, globalIgnores } from "eslint/config";
import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["builds/**/*", "js/**/*", "tests/**/*", "eslint.config.mjs"]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:prettier/recommended"
    ),

    plugins: {
      import: fixupPluginRules(_import),
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.worker,
        respecConfig: true,
      },

      ecmaVersion: 2023,
      sourceType: "module",
    },

    rules: {
      "import/extensions": [
        "error",
        "always",
        {
          ignorePackages: true,
        },
      ],

      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],

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

      "spaced-comment": [
        "error",
        "always",
        {
          block: {
            balanced: true,
          },
        },
      ],
    },
  },
]);
