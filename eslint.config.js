import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist"] },
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
    settings: { react: { version: "18.3" } },

    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
