module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: [
			"tsconfig.json",
			"src/backend/.eslintrc.js",
			"src/frontend/.eslintrc.js"
		],
		sourceType: "module",
		tsconfigRootDir: "./",
		ecmaVersion: 2020
	},
	plugins: ["@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"prettier/@typescript-eslint"
	],
	env: {
		node: true,
		jest: true
	}
};
