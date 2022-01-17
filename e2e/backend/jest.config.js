module.exports = {
	displayName: "backend-e2e",
	testMatch: ["<rootDir>/**/*.e2e.[jt]s?(x)"],
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
	coverageDirectory: "../../builds/coverage/backend",
	reporters: [
		"default",
		[
			"jest-junit",
			{
				suiteName: "Backend E2E Tests",
				outputDirectory: "./builds",
				outputName: "junit-backend-e2e.xml"
			}
		]
	]
};
