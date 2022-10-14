//	Node.js does not support the "import { join } as 'path'"; syntax.
//	Don't try and follow VSCode's recommendation.
const path = require('path');
const webpack = require('webpack');

const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require('brotli-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');

const isEnvProd = params => {
	if (typeof params.prd !== 'undefined' && params.prd === true)
		return true;

	return false;
};

module.exports = params => {
	const isProduction = isEnvProd(params);

	return {
		mode: isProduction ? 'production' : 'development',
		entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/app.jsx'],
		target: 'web',
		stats: {
			modules: false,
			children: true,
			errorDetails: true
		},
		watchOptions: {
			ignored: /node_modules/
		},
		resolve: {
			extensions: ['*', '.js', '.jsx'],
			fallback: {
				"assert": require.resolve("assert/"),
				"buffer": require.resolve("buffer/"),
				"stream": require.resolve("stream-browserify"),
				"util": require.resolve("util/"),
				"zlib": require.resolve("browserify-zlib")
			}
		},
		output: {
			path: path.resolve('public/assets'),
			filename: 'js/main.js',
			chunkFilename: "js/[name].[contenthash].js",
			publicPath: "/assets/"
		},
		module: {
			rules: [{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
                resolve: {
                  fullySpecified: false,
                }
			},
			{
				test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				use: 'base64-inline-loader?limit=10000000&name=[name].[ext]'
			},
			{
				test: /\.s?css$/,
				use: [{
					loader: MiniCssExtractPlugin.loader,
				},
				{
					loader: 'css-loader',
					options: {
						sourceMap: !isProduction
					}
				},
				{
					loader: 'sass-loader',
					options: {
						sourceMap: !isProduction
					}
				}
				],
			},
			{
				test: /\.(webp|png|jpe?g)$/i,
				loader: "file-loader",
				options: {
					name: "[contenthash].[ext]",
					outputPath: "images",
				},
			}
			]
		},
		plugins: [
			new WebpackBeforeBuildPlugin(function (stats, callback) {
				const fs = require('fs')
				const rimraf = require("rimraf");
				const pathToAssets = path.resolve('public/assets');

				//	colors in console.log : https://stackoverflow.com/a/41407246/813689

				try {
					if (fs.existsSync(pathToAssets)) {
						rimraf(pathToAssets, function () {
							console.log("\x1b[32m", "\r\nsuccessfully deleted public/assets\r\ncontinuing build...\r\n");
							callback();
						});
					} else {
						console.log("\x1b[33m", "\r\npublic/assets already cleared\r\ncontinuing build...\r\n");
						callback();
					}
				} catch (err) {
					console.error("\x1b[31m", err);
					callback();
				}
			}),

			new MiniCssExtractPlugin({
				filename: 'css/main.css',
				chunkFilename: 'css/[name].[contenthash].css',
				ignoreOrder: true,
			}),

			// new webpack.ProvidePlugin({
			// 	process: 'process/browser',
			// 	Buffer: ['buffer', 'Buffer'],
			// }),

			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development')
				}
			}),
			new webpack.optimize.AggressiveMergingPlugin(),

			new CompressionPlugin({
				algorithm: "gzip",
				compressionOptions: { level: isProduction ? 9 : 1 },
				minRatio: 0.9,
				deleteOriginalAssets: isProduction
			}),

			new BrotliPlugin({
				minRatio: 0.9,
				deleteOriginalAssets: isProduction
			}),

			new webpack.DefinePlugin({
				'__REACT_DEVTOOLS_GLOBAL_HOOK__': `({ isDisabled: true })`
			})
		],
		devtool: isProduction ? 'nosources-source-map' : 'inline-source-map',	//	https://webpack.js.org/configuration/devtool/
		devServer: {
			static: path.join(__dirname, 'public'),
			historyApiFallback: true,
			https: true, // https://diary-of-programmer.blogspot.com/2019/04/tips-using-ssl-locally-with-webpack-dev.html
			compress: true,
			open: true,
			port: 3000,
			hot: true,
			devMiddleware: {
				publicPath: '/assets/',
				stats: 'minimal', // none, errors-only, minimal, verbose
				writeToDisk: true
			}
		},
		optimization: {
			minimize: isProduction,
			minimizer: [new TerserPlugin(), new CssMinimizerWebpackPlugin()],
			splitChunks: {
				chunks: 'async',
				minSize: 20000,
				minRemainingSize: 0,
				minChunks: 1,
				maxAsyncRequests: 30,
				maxInitialRequests: 30,
				enforceSizeThreshold: 50000,
				cacheGroups: {
					defaultVendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						reuseExistingChunk: true,
					},
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			},
		},
	}
}