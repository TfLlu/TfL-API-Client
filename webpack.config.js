const path              = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT_DIR = __dirname;
const SRC_DIR  = path.resolve(__dirname, 'src');
const HTML_DIR = path.resolve(__dirname, 'html');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
    entry: path.resolve(SRC_DIR, 'client.js'),
    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
        libraryTarget: 'umd',
        library: 'TfLAPIClient',
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                include: ROOT_DIR
            }
        ]
    },
    plugins: [
        // Simply copies the files over
        new CopyWebpackPlugin([
            { from: HTML_DIR } // to: output.path
        ]),
    ],
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    devServer: {
        contentBase: DIST_DIR,
    }
};
