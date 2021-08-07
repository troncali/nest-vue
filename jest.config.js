const { getJestProjects } = require("@nrwl/jest");

module.exports = {
	projects: getJestProjects()
	// projects: [
	// 	"<rootDir>/src/backend/",
	// 	"<rootDir>/e2e/backend/",
	// 	"<rootDir>/src/frontend/"
	// ]
};
