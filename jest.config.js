const { getJestProjects } = require("@nrwl/jest");

module.exports = {
	projects: getJestProjects()
	// projects: [
	// 	"<rootDir>/apps/backend/",
	// 	"<rootDir>/e2e/backend/",
	// 	"<rootDir>/apps/frontend/"
	// ]
};
