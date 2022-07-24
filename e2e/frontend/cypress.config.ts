import { defineConfig } from "cypress";

module.exports = defineConfig({
	e2e: {
		specPattern: "./src/**/*.{cy,spec,e2e}.{js,jsx,ts,tsx}",
		baseUrl: "http://localhost:4173",
		fixturesFolder: "./cypress/fixtures",
		supportFolder: "./cypress/support",
		video: false,
		videosFolder: "../../dist/e2e/frontend/videos",
		screenshotsFolder: "../../dist/e2e/frontend/screenshots",
		reporter: "junit",
		reporterOptions: {
			mochaFile: "../../dist/tests/junit-frontend-e2e-[hash].xml",
			toConsole: false
		}
	}
});
