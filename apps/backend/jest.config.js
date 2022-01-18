module.exports = {
	displayName: "backend",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.test.json"
		}
	},
	transform: {
		"^.+\\.[tj]s$": "ts-jest"
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../dist/coverage/backend",
	testEnvironment: "node",
	reporters: [
		"default",
		[
			"jest-junit",
			{
				suiteName: "Backend Unit Tests",
				outputDirectory: "./dist",
				outputName: "junit-backend-unit.xml"
			}
		]
	]
};
