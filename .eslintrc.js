module.exports = {
	root: true,
	ignorePatterns: ["**/*"],
	plugins: ["@nrwl/nx"], // still need @typescript-eslint?
	overrides: [
		{
			files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
			rules: {
				"@nrwl/nx/enforce-module-boundaries": [
					"error",
					{
						enforceBuildableLibDependency: true,
						allow: [],
						depConstraints: [
							{
								sourceTag: "*",
								onlyDependOnLibsWithTags: ["*"]
							}
						]
					}
				]
			}
		},
		{
			files: ["*.ts", "*.tsx"],
			extends: ["plugin:@nrwl/nx/typescript"],
			rules: {}
		},
		{
			files: ["*.js", "*.jsx"],
			extends: ["plugin:@nrwl/nx/javascript"],
			rules: {}
		}
	]

	// Still need these?  Or Vue only?
	// parser: "@typescript-eslint/parser",
	// parserOptions: {
	// 	project: [
	// 		"tsconfig.json",
	// 		"src/backend/.eslintrc.js",
	// 		"src/frontend/.eslintrc.js"
	// 	],
	// 	sourceType: "module",
	// 	tsconfigRootDir: "./",
	// 	ecmaVersion: 2020
	// },
	// extends: [
	// 	"eslint:recommended",
	// 	"plugin:@typescript-eslint/recommended",
	// 	"prettier"
	// ],
	// env: {
	// 	node: true,
	// 	jest: true
	// }
};
