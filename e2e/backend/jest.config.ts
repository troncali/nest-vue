/* eslint-disable */
export default {
	displayName: "backend-e2e",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.test.json"
		}
	},
	transform: {
		"^.+\\.[tj]s$": "ts-jest"
	},
	moduleFileExtensions: ["ts", "js", "html", "json"],
	coverageDirectory: "../../dist/tests/coverage/backend",
	testEnvironment: "node",
	reporters: [
		"default",
		[
			"jest-junit",
			{
				suiteName: "Backend E2E Tests",
				outputDirectory: "./dist/tests",
				outputName: "junit-backend-e2e.xml"
			}
		]
	],
	testMatch: ["<rootDir>/**/*.e2e.[jt]s?(x)"]
};
