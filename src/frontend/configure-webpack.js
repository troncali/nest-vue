/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

// copy-webpack-plugin@5.1.2 required for compatibility with Vue CLI Service
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (config) => {
	// Implement new CopyPlugin to configure ./src/frontend/static/ as the
	// static assets folder in lieu of default ./public folder set by Vue
	config.plugins.push(
		new CopyWebpackPlugin(
			[
				{
					from: path.resolve(__dirname, "static"),
					ignore: ["**/index.html"]
				}
			],
			{
				dot: false
			}
		)
	);
};
