const { WebpackPnpExternals } = require("webpack-pnp-externals");
// const BundleAnalyzerPlugin =
// 	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (config) => {
	// Keep PnP packages external to bundle
	config.externals = [
		WebpackPnpExternals(),
		// Below are needed for Prisma client. See https://github.com/prisma/prisma/issues/6564#issuecomment-850273211
		"_http_common",
		"encoding"
	];

	// Output a report that allows visual inspection of chunk sizes
	// config.plugins.push(
	// 	new BundleAnalyzerPlugin({
	// 		analyzerMode: "static",
	// 		reportFilename: "bundle-analysis.html",
	// 		openAnalyzer: false
	// 	})
	// );

	return config;
};
