// copy-webpack-plugin@5.1.2 required for compatibility with Vue CLI Service
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	configureWebpack: (config) => {
		// Configure entry file in lieu of ./src/main.ts proscribed by Vue CLI Service
		config.entry = { app: ["./src/frontend/main.ts"] };

		// Implement new CopyPlugin to configure ./src/frontend/static/ as the static assets folder
		// in lieu of default set by Vue CLI Service
		config.plugins.push(
			new CopyWebpackPlugin(
				[
					{
						from: path.resolve(
							__dirname,
							"src",
							"frontend",
							"static"
						),
						ignore: ["**/index.html"]
					}
				],
				{
					dot: false
				}
			)
		);
	},
	// Configure ./src/frontend/static/ as the location of the template
	chainWebpack: (config) => {
		config.plugin("html").tap((options) => {
			options[0].template = "./src/frontend/static/index.html";
			return options;
		});
		// Remove default 'copy' plugin; lack of ./dist folder proscribed by Vue CLI Service throws warning
		config.plugins.delete("copy");
	}
};
