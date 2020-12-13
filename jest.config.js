module.exports = {
	projects: [
		{
			displayName: "backend",
			testEnvironment: "node",
			testMatch: [
				"<rootDir>/**/backend/**/*.spec.[jt]s?(x)",
				"<rootDir>/**/e2e/backend/**/*.[jt]s?(x)"
			],
			moduleNameMapper: {
				"^@/(.*)$": "<rootDir>/src/$1"
			},
			transform: {
				"^.+\\.(t|j)s$": "ts-jest"
			}
		},
		{
			displayName: "frontend",
			preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
			transform: {
				"^.+\\.vue$": "vue-jest",
				"^.+\\.(t|j)s$": "ts-jest"
			},
			testMatch: [
				"<rootDir>/**/frontend/**/*.spec.[jt]s?(x)",
				"<rootDir>/**/e2e/frontend/**/*.[jt]s?(x)"
			],
			testEnvironment: "jest-environment-jsdom-fifteen",
			globals: {
				"vue-jest": {
					tsConfig: "./src/frontend/tsconfig.json"
				}
			}
		}
	]
};
