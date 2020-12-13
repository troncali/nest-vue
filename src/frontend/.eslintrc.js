module.exports = {
	extends: [
		"../../.eslintrc.js",
		"plugin:vue/vue3-essential",
		"@vue/typescript/recommended",
		"@vue/prettier",
		"@vue/prettier/@typescript-eslint"
	],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
	},
	overrides: [
		{
			files: [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)"
			],
			env: {
				jest: true
			}
		}
	]
};
