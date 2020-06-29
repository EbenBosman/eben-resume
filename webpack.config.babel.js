import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import HappyPack from 'happypack'
import os from 'os'
import pkg from './package.json'
import manifest from './manifest.json'

const ENV = process.env.NODE_ENV
const isDev = ENV === 'development' || ENV === 'dev'
const isProd = ENV === 'production' || ENV === 'prod'

const vendor = Object.keys(pkg.dependencies)
const jsSourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build/demo')
const sourcePath = path.join(__dirname, 'src')
const assetsPath = 'assets/'
const port = process.env.PORT || 3000

class HappyPackPlugin {
    constructor () {
        this.init()
    }

    init () {
        this.threadPool = HappyPack.ThreadPool({
            size: os.cpus().length,
        })
        this.caches = {
            loaders: {},
            plugins: [],
        }
    }

    createPlugin (id, loaders) {
        this.caches.loaders[id] = {
            loaders,
            happypack: `happypack/loader?id=${id}`,
        }

        this.caches.plugins.push(new HappyPack({
            id,
            loaders,
            threadPool: this.threadPool,
            verboseWhenProfiling: false,
            verbose: true,
            debug: false,
        }))

        return this
    }

    getLoaders (id, isProd) {
        const { loaders, happypack } = this.caches.loaders[id]
        return isProd ? loaders : happypack
    }
}

const happyLoader = new HappyPackPlugin

happyLoader
    .createPlugin('js', ['cache-loader', 'babel-loader'])
    .createPlugin('css', ['css-loader', 'postcss-loader'])

const jsLoader = isDev ? [happyLoader.getLoaders('js')] : ['babel-loader']
const cssLoader = isDev ? [happyLoader.getLoaders('css')] : ['css-loader', 'postcss-loader']

const config = {
    context: jsSourcePath,
    entry: {
        app: [
            './app.js',
        ],
        vendor,
    },
    output: {
        path: buildPath,
        publicPath: '',
        filename: assetsPath + 'app.js',
        chunkFilename: assetsPath + '[name].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [...jsLoader],
                exclude: [path.resolve(__dirname, 'node_modules')],
            },
            {
                test: /\.css/,
                use: [
                    'css-hot-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    ...cssLoader,
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)\??.*$/,
                use: 'url-loader?limit=8192&name=' + assetsPath + '[hash].[ext]',
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                use: 'url-loader?limit=8192&name=' + assetsPath + '[hash].[ext]',
            },
        ],
        noParse: [/html2canvas/, /jspdf/],
    },
    plugins: [
        new ProgressBarPlugin(),
        new MiniCssExtractPlugin({
            filename: assetsPath + '[name].css',
            chunkFilename: assetsPath + '[id].css',
        }),
        new HtmlWebpackPlugin({
            template: path.join(sourcePath, 'index.html'),
            path: buildPath,
            filename: 'index.html',
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: false,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js/,
                },
            },
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    resolve: {
        extensions: [
            '*',
            '.js',
            '.jsx',
            '.json',
            '.css',
        ],
    },
    stats: {
        modules: false,
        children: false,
    },
    performance: {
        hints: false,
    },
    devServer: {
        contentBase: isProd ? buildPath : sourcePath,
        // historyApiFallback: true,
        port,
        // compress: isProd,
        hot: !isProd,
        noInfo: true,
        inline: !isProd,
        // disableHostCheck: true,
        host: '0.0.0.0',
    },
}

if (isDev) {
    Object.assign(config, {
        mode: 'development',
        plugins: [
            ...config.plugins,
            new HtmlWebpackIncludeAssetsPlugin({
                assets: ['vendor.dll.js'],
                append: false,
                publicPath: assetsPath,
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest,
            }),
            ...happyLoader.caches.plugins,
            new webpack.HotModuleReplacementPlugin(),
        ],
        entry: Object.assign({}, config.entry, {
            app: [
                ...config.entry.app,
            ],
        }),
        devtool: 'source-map',
    })
}

if (isProd) {
    Object.assign(config, {
        mode: 'production',
        plugins: [
            ...config.plugins,
            new CleanWebpackPlugin(['build'], {
                root: '',
                verbose: true,
                dry: false,
            }),
            new CompressionWebpackPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.jsx$|\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0,
            }),
        ],
        entry: Object.assign({}, config.entry, {
            app: [
                ...config.entry.app,
            ],
        }),
        optimization: Object.assign({}, config.optimization, {
            minimizer: [
                ...config.optimization.minimizer,
                new UglifyJsPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true,
                        },
                    },
                }),
            ],
        }),
    })
}

export default config
