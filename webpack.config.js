//	Node.js does not support the "import { join } as 'path'"; syntax.
//	Don't try and follow VSCode's recommendation.
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');

module.exports = (env) => {
	const isProduction = env === 'prod';

	return {
		mode: isProduction ? 'production' : 'development',
		entry: ['@babel/polyfill', './src/app.jsx'],
		target: 'web',
		stats: {
			modules: false
		},
		watchOptions: {
			ignored: /node_modules/
		},
		resolve: {
			extensions: ['*', '.js', '.jsx']
		},
		output: {
			path: path.resolve('public/assets'),
			filename: 'js/main.js',
			chunkFilename: "js/[name].[contenthash].js",
			publicPath: "/assets/"
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					loader: 'babel-loader',
					exclude: /node_modules/
				},
				{
					test: /\.(png|woff|woff2|eot|ttf|svg)$/,
					loader: 'url-loader?limit=100000'
				},
				{
					test: /\.s?css$/,
					use: [
						{
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
						rimraf(pathToAssets, function () { console.log("\x1b[32m", "\r\nsuccessfully deleted public/assets\r\ncontinuing build...\r\n"); callback(); });
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
		],
		devtool: isProduction ? 'source-map' : 'inline-source-map',
		devServer: {
			contentBase: path.join(__dirname, 'public'),
			historyApiFallback: true,
			https: true,	// https://diary-of-programmer.blogspot.com/2019/04/tips-using-ssl-locally-with-webpack-dev.html
			compress: true,
			noInfo: false,
			open: true,
			port: 3000,
			publicPath: '/assets/',
			quiet: false,
			stats: 'minimal', // none, errors-only, minimal, verbose
			watchContentBase: true,
			writeToDisk: true
		},
		optimization: {
			minimize: isProduction,
			minimizer: [new UglifyJsPlugin(), new OptimizeCssAssetsPlugin()]
		}
	}
}