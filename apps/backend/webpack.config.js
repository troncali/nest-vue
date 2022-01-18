const { WebpackPnpExternals } = require("webpack-pnp-externals");
// const BundleAnalyzerPlugin =
// 	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (config) => {
	config.externals = [WebpackPnpExternals()];
	// Enable to visually inspect chunk sizes
	// config.plugins.push(new BundleAnalyzerPlugin());
	return config;
};
