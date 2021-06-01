const PnpWebpackPlugin = require("pnp-webpack-plugin");
const { WebpackPnpExternals } = require("webpack-pnp-externals");

module.exports = (config) => {
	config.resolve.plugins.push(PnpWebpackPlugin);
	config.resolve.extensions.push(".json");
	config.resolveLoader = { plugins: [PnpWebpackPlugin.moduleLoader(module)] };
	config.externals = [WebpackPnpExternals()];
	return config;
};
