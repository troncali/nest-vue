const { WebpackPnpExternals } = require("webpack-pnp-externals");

module.exports = (config) => {
	config.externals = [WebpackPnpExternals()];
	return config;
};
