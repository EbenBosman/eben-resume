import webpack from 'webpack'
import path from 'path'
import pkg from './package.json'

const vendor = Object.keys(pkg.dependencies)
const jsSourcePath = path.join(__dirname, 'src')

export default {
    mode: 'development',
    context: jsSourcePath,
    entry: {
        vendor,
    },
    output: {
        path: path.join(__dirname, 'src/assets/'),
        filename: '[name].dll.js',
        library: '[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
    ],
    module: {
        noParse: [/html2canvas/, /jspdf/],
    },
}
