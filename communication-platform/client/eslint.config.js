import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  // applied to all files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"] ,
    rules: {
      "eol-last": ["error", "always"],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "react/react-in-jsx-scope": "off",
      "no-useless-catch": "off"
    }
  },
  // applied to browser files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser }
  },
  // applied to node files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    languageOptions: { globals: globals.node },
    extends: ["js/recommended"],
    rules: {
      "no-useless-catch": "off"
    }
  },
  // applied to react files
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react: pluginReact },
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error"
    }
  }
],
{
  ignores: ["src/components/ui/**"]
});
