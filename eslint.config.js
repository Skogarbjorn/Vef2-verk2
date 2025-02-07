import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
		files: ["src/frontend/**/*.js"],
		languageOptions: { globals: globals.browser }
	},
  {
		files: ["src/backend/**/*.js"],
		languageOptions: { globals: globals.node }
	},
  pluginJs.configs.recommended,
];
