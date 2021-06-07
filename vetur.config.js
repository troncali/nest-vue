/** @type {import('vls').VeturConfig} */
module.exports = {
	settings: {
		// Yarn PnP requires use of Workspace Dependencies for correct linting of imports in .vue files
		"vetur.useWorkspaceDependencies": true,
		"vetur.experimental.templateInterpolationService": true
	},
	projects: [
		{
			root: "./src/frontend",
			package: "../../package.json",
			tsconfig: "tsconfig.app.json"
		}
	]
};
