import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
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
