import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  // applied to all files
  {
    files: ["**/*.{js,mjs,cjs}"],
    rules: {
      "eol-last": ["error", "always"],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"]
    }
  },
  // applied to browser files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser }
  },
  // applied to node files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
    plugins: { js },
    extends: ["js/recommended"]
  },
]);
