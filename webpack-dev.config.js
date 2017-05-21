
var path = require('path');
var webpack = require('webpack');
var minimizeOpt = process.argv.indexOf('--optimize-minimize') !== -1;


module.exports = { 
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: minimizeOpt ? 'aframedc.min.js' : 'aframedc.js',
        libraryTarget: 'window',
        library: 'aframedc'
    }
};
if (minimizeOpt) {
    module.exports.plugins = [];
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}