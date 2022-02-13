module.exports = {
	displayName: "frontend",
	preset: "../../jest.preset.js",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.test.json"
		},
		"vue-jest": {
			tsconfig: "<rootDir>/tsconfig.test.json"
		}
	},
	transform: {
		"^.+\\.vue$": "vue3-jest",
		".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
			"jest-transform-stub",
		"^.+\\.[tj]sx?$": "ts-jest"
	},
	moduleFileExtensions: ["ts", "tsx", "vue", "js", "json"],
	coverageDirectory: "../../dist/coverage/frontend",
	snapshotSerializers: ["jest-serializer-vue"],
	reporters: [
		"default",
		[
			"jest-junit",
			{
				suiteName: "Frontend Unit Tests",
				outputDirectory: "./dist/tests",
				outputName: ".xml"
			}
		]
	]
};
