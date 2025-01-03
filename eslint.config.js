import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist", "node_modules"] },
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: false },
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "no-trailing-spaces": "error",

      eqeqeq: ["error", "always"],
      "no-unused-vars": ["error", { args: "none" }],
      "no-console": "warn",
    },
  },
];
